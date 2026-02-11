/**
 * API Route: NFV Videos
 * POST - Upload/criar registro de video
 * GET - Listar videos por arena
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { isPremiumNFVArena } from '@/lib/biomechanics/nfv-config';
import { spendFPForVideo } from '@/lib/fp/service';
import { checkVideoUploadPermission } from '@/lib/biomechanics/video-gating';

const TABLE = 'nfc_chat_video_analyses';

/**
 * Trigger automatico para analise com IA (Ollama llama3.2-vision)
 * Chamado em background apos criar registro de video.
 * Faz ate 3 tentativas com backoff exponencial (5s, 15s, 45s).
 * Se todas falharem, seta status ERROR no banco.
 */
const RETRY_DELAYS = [5000, 15000, 45000]; // 5s, 15s, 45s

async function triggerAIAnalysis(analysisId: string): Promise<void> {
  const baseUrl = process.env.NEXTAUTH_URL ||
                 process.env.NEXT_PUBLIC_APP_URL ||
                 'http://localhost:3000';

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    console.log(`[NFV] Triggering AI analysis for ${analysisId} (attempt ${attempt + 1}/${RETRY_DELAYS.length + 1})`);

    try {
      const response = await fetch(`${baseUrl}/api/nfv/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`[NFV] AI analysis completed (attempt ${attempt + 1}):`, {
          score: result.aiResult?.overall_score,
          type: result.aiResult?.analysis_type,
        });
        return; // Sucesso — sair do loop
      }

      const errorData = await response.json().catch(() => ({}));
      console.warn(`[NFV] AI analysis attempt ${attempt + 1} failed:`, errorData.error);

      // Se ja processou (status nao e PENDING_AI/ERROR), parar de tentar
      if (response.status === 400) return;

    } catch (error: any) {
      console.warn(`[NFV] AI analysis attempt ${attempt + 1} error:`, error.message);
    }

    // Se ainda tem retries, esperar antes da proxima tentativa
    if (attempt < RETRY_DELAYS.length) {
      const delay = RETRY_DELAYS[attempt];
      console.log(`[NFV] Retrying in ${delay / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Todas as tentativas falharam
  console.error(`[NFV] All ${RETRY_DELAYS.length + 1} analysis attempts failed for ${analysisId}`);
  await setAnalysisError(analysisId, 'Analise falhou apos multiplas tentativas. Verifique se o Ollama esta rodando.');
}

async function setAnalysisError(analysisId: string, errorMessage: string): Promise<void> {
  try {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabase();
    await supabase
      .from(TABLE)
      .update({
        status: 'ERROR',
        ai_analysis: {
          error: errorMessage,
          timestamp: new Date().toISOString(),
        },
      })
      .eq('id', analysisId);
  } catch { /* best effort */ }
}

// POST - Criar registro de video analysis
export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await req.json();
    const {
      userId,
      userName,
      arenaSlug,
      videoUrl,
      videoPath,
      thumbnailUrl,
      durationSeconds,
      movementPattern,
      userDescription,
      paidWithSubscription,
    } = body;

    if (!userId || !arenaSlug || !videoUrl || !videoPath || !movementPattern) {
      return NextResponse.json({ error: 'Campos obrigatorios faltando' }, { status: 400 });
    }

    if (!isPremiumNFVArena(arenaSlug)) {
      return NextResponse.json({ error: 'Arena nao e premium NFV' }, { status: 400 });
    }

    // Verificar permissao (paidWithSubscription = is_premium do frontend)
    const permission = await checkVideoUploadPermission(userId, arenaSlug, paidWithSubscription === true);
    if (!permission.allowed) {
      return NextResponse.json({
        error: 'Permissao negada',
        reason: permission.reason,
        fpBalance: permission.fpBalance,
        fpCost: permission.fpCost,
      }, { status: 403 });
    }

    // Cobrar FP se nao for assinante
    let fpCost = 0;
    if (!paidWithSubscription && permission.reason === 'fp_sufficient') {
      const spendResult = await spendFPForVideo(userId, {
        arena_slug: arenaSlug,
        movement_pattern: movementPattern,
      });
      if (!spendResult.success) {
        return NextResponse.json({ error: 'Erro ao cobrar FP', reason: spendResult.reason }, { status: 400 });
      }
      fpCost = spendResult.fpSpent;
    }

    // Criar registro
    const id = `va_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        id,
        arena_slug: arenaSlug,
        user_id: userId,
        user_name: userName || 'Usuario',
        video_url: videoUrl,
        video_path: videoPath,
        thumbnail_url: thumbnailUrl || null,
        duration_seconds: durationSeconds || null,
        movement_pattern: movementPattern,
        user_description: userDescription || null,
        fp_cost: fpCost,
        paid_with_subscription: paidWithSubscription || false,
        status: 'PENDING_AI',
      })
      .select()
      .single();

    if (error) {
      console.error('[NFV] Error creating video analysis:', error);
      return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
    }

    // 🤖 TRIGGER AUTOMÁTICO: Iniciar análise com IA (Ollama)
    // Dispara em background para não bloquear resposta ao usuário
    triggerAIAnalysis(data.id).catch((err) => {
      console.error('[NFV] Auto-analysis trigger failed:', err);
    });

    return NextResponse.json({ success: true, analysis: data });
  } catch (error) {
    console.error('[NFV] POST error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// GET - Listar videos por arena
export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const arenaSlug = searchParams.get('arenaSlug');
    const status = searchParams.get('status');
    const pattern = searchParams.get('pattern');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = getSupabase();
    let query = supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (arenaSlug) {
      query = query.eq('arena_slug', arenaSlug);
    }

    if (status) {
      // Suporta múltiplos status separados por vírgula
      const statusList = status.split(',').map(s => s.trim());
      if (statusList.length > 1) {
        query = query.in('status', statusList);
      } else {
        query = query.eq('status', status);
      }
    } else {
      // Mostrar todos os videos (na fila, processando, analisados, aprovados e com erro)
      query = query.in('status', ['PENDING_AI', 'PROCESSING', 'AI_ANALYZED', 'APPROVED', 'ERROR']);
    }

    if (pattern) {
      query = query.eq('movement_pattern', pattern);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[NFV] Error fetching videos:', error);
      return NextResponse.json({ error: 'Erro ao buscar videos' }, { status: 500 });
    }

    return NextResponse.json({ videos: data || [] });
  } catch (error) {
    console.error('[NFV] GET error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
