/**
 * API Endpoint - Juiz Biométrico NFV
 *
 * POST /api/biometric/analyze - Criar baseline ou reavaliação
 * GET  /api/biometric/analyze - Buscar avaliações do usuário
 */

import { NextRequest, NextResponse } from 'next/server';
import { juizBiometrico } from '@/lib/biomechanics/juiz-biometrico.service';

// ============================================
// POST - Criar análise (baseline ou comparação)
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      user_id,
      images,
      baseline_id,
      current_protocol,
      type, // 'baseline' ou 'comparison'
    } = body;

    // Validação básica
    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      );
    }

    if (!images) {
      return NextResponse.json(
        { error: 'images é obrigatório' },
        { status: 400 }
      );
    }

    // Determinar tipo de análise
    const analysisType = type || (baseline_id ? 'comparison' : 'baseline');

    console.log(`🔍 Análise ${analysisType} solicitada para usuário:`, user_id);

    let result;

    if (analysisType === 'comparison' && baseline_id) {
      // Reavaliação comparativa
      result = await juizBiometrico.analyzeComparison({
        user_id,
        images,
        baseline_id,
        current_protocol,
      });
    } else {
      // Baseline inicial
      result = await juizBiometrico.analyzeBaseline({
        user_id,
        images,
        current_protocol,
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Erro na análise biométrica:', error);
    return NextResponse.json(
      {
        error: 'Erro ao processar análise',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Buscar avaliações do usuário
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const action = searchParams.get('action'); // 'welcome' | 'latest' | 'all'

    if (!user_id && action !== 'welcome') {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      );
    }

    // Mensagem de boas-vindas
    if (action === 'welcome') {
      const welcomeMessage = juizBiometrico.getWelcomeMessage();
      return NextResponse.json({
        type: 'welcome',
        message: welcomeMessage,
      });
    }

    // Buscar baseline mais recente
    if (action === 'latest') {
      const baseline = await juizBiometrico.getUserBaseline(user_id!);
      return NextResponse.json({
        type: 'latest_baseline',
        baseline,
      });
    }

    // Buscar todas as avaliações
    const evaluations = await juizBiometrico.getUserEvaluations(user_id!);

    return NextResponse.json({
      type: 'all_evaluations',
      evaluations,
      total: evaluations.length,
    });
  } catch (error: any) {
    console.error('❌ Erro ao buscar avaliações:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar avaliações',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
