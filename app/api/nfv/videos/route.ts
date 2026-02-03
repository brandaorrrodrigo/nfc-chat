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

    // Verificar permissao
    const permission = await checkVideoUploadPermission(userId, arenaSlug);
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
      query = query.eq('status', status);
    } else {
      // Por padrao, mostrar apenas aprovados para publico
      query = query.eq('status', 'APPROVED');
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
