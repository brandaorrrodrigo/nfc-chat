/**
 * API Route: Plano Corretivo Automatico
 *
 * POST /api/nfv/corrective-plan
 *   Body: { analysisId: string, force?: boolean }
 *   Gera plano corretivo de 4 semanas para analise com criterios warning/danger
 *
 * GET /api/nfv/corrective-plan?analysisId=xxx
 *   Retorna plano ja gerado (se existir)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { generateCorrectivePlanFromAnalysis } from '@/lib/biomechanics/corrective-plan-generator';

const TABLE = 'nfc_chat_video_analyses';

/**
 * Deep-parse ai_analysis que pode estar serializada como string (single ou double)
 */
function deepParseAnalysis(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  let data = raw;
  // Parse strings recursivamente (max 3 niveis de serialização)
  for (let i = 0; i < 3; i++) {
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { break; }
    } else { break; }
  }
  if (typeof data !== 'object' || data === null) return null;
  return data as Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const analysisId = request.nextUrl.searchParams.get('analysisId');
    if (!analysisId) {
      return NextResponse.json({ error: 'analysisId required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: analysis, error } = await supabase
      .from(TABLE)
      .select('ai_analysis')
      .eq('id', analysisId)
      .single();

    if (error || !analysis) {
      return NextResponse.json({ error: 'Analise nao encontrada' }, { status: 404 });
    }

    const aiData = deepParseAnalysis(analysis.ai_analysis);
    const plan = aiData?.corrective_plan;

    if (!plan) {
      return NextResponse.json({ exists: false, message: 'Plano corretivo ainda nao gerado' });
    }

    return NextResponse.json({ exists: true, plan });
  } catch (error) {
    console.error('[CorrectivePlan API] GET error:', error);
    return NextResponse.json(
      { error: 'Erro interno', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const analysisId = body.analysisId as string;

    if (!analysisId) {
      return NextResponse.json({ error: 'analysisId required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Buscar analise
    const { data: analysis, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', analysisId)
      .single();

    if (fetchError || !analysis) {
      return NextResponse.json({ error: 'Analise nao encontrada' }, { status: 404 });
    }

    // Deep parse ai_analysis (pode estar serializada como string)
    const aiData = deepParseAnalysis(analysis.ai_analysis);

    if (!aiData) {
      return NextResponse.json(
        { error: 'Analise nao contem dados de IA' },
        { status: 400 }
      );
    }

    // Verificar se ja existe plano valido (com semanas nao-vazias)
    const existingPlan = aiData.corrective_plan as Record<string, unknown> | undefined;
    const forceRegenerate = body.force === true;
    const planHasContent = existingPlan &&
      Array.isArray(existingPlan.semanas) &&
      (existingPlan.semanas as unknown[]).length > 0;

    if (planHasContent && !forceRegenerate) {
      return NextResponse.json({
        exists: true,
        plan: existingPlan,
        message: 'Plano corretivo ja existe',
      });
    }

    console.log(`[CorrectivePlan API] Gerando plano para analise ${analysisId}`);

    // Gerar plano corretivo
    const plan = await generateCorrectivePlanFromAnalysis(aiData);

    // Salvar plano no registro (merge com ai_analysis existente)
    const updatedAiAnalysis = {
      ...aiData,
      corrective_plan: plan,
    };

    const { error: updateError } = await supabase
      .from(TABLE)
      .update({ ai_analysis: updatedAiAnalysis })
      .eq('id', analysisId);

    if (updateError) {
      console.error('[CorrectivePlan API] Erro ao salvar:', updateError);
      return NextResponse.json({
        exists: true,
        plan,
        saved: false,
        message: 'Plano gerado mas nao salvo no banco',
      });
    }

    console.log(`[CorrectivePlan API] Plano salvo com sucesso para ${analysisId}`);

    return NextResponse.json({
      exists: true,
      plan,
      saved: true,
      message: 'Plano corretivo gerado e salvo com sucesso',
    });
  } catch (error) {
    console.error('[CorrectivePlan API] POST error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar plano corretivo', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
