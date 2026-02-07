/**
 * POST /api/biometric/comparison
 * Criar análise de comparação (25 FPs ou Premium)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { JuizBiometricoService } from '@/lib/biomechanics/juiz-biometrico.service'
import { FPService, InsufficientFPError } from '@/lib/fp/fp.service'


const COMPARISON_COST_FP = 25

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parsear request
    const body = await request.json()
    const { baseline_id, images, description } = body

    if (!baseline_id) {
      return NextResponse.json(
        { error: 'baseline_id is required' },
        { status: 400 }
      )
    }

    if (!images || (!images.frontal && !images.lateral && !images.posterior)) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    // 3. Verificar saldo de FP
    const fpService = new FPService()
    const currentBalance = await fpService.getBalance(session.user.id!)

    if (currentBalance < COMPARISON_COST_FP) {
      return NextResponse.json(
        {
          error: 'Insufficient FitPoints',
          required_fps: COMPARISON_COST_FP,
          current_balance: currentBalance,
          shortfall: COMPARISON_COST_FP - currentBalance,
        },
        { status: 402 }
      )
    }

    // 4. Gerar análise comparativa
    const juizService = new JuizBiometricoService()
    const analysis = await juizService.analyzeComparison({
      baseline_id,
      images,
      user_id: session.user.id!,
      current_protocol: description,
    })

    if (analysis.type === 'validation_error') {
      return NextResponse.json(analysis, { status: 400 })
    }

    // 5. Deduzir FitPoints (dentro de uma transação)
    try {
      await fpService.deductFP({
        user_id: session.user.id!,
        amount: COMPARISON_COST_FP,
        category: 'biometric_comparison',
        description: `Biometric comparison for baseline ${baseline_id}`,
        reference_id: analysis.comparison_id,
      })

      // Obter novo saldo
      const newBalance = await fpService.getBalance(session.user.id!)

      return NextResponse.json({
        success: true,
        comparison_id: analysis.comparison_id,
        analysis: analysis.analysis,
        fps_deducted: COMPARISON_COST_FP,
        new_balance: newBalance,
        message: `✅ Comparison complete! -${COMPARISON_COST_FP} FP`,
      })
    } catch (error) {
      if (error instanceof InsufficientFPError) {
        return NextResponse.json(
          {
            error: 'Insufficient FitPoints',
            required_fps: COMPARISON_COST_FP,
            current_balance: error.available,
            shortfall: error.required - error.available,
          },
          { status: 402 }
        )
      }

      throw error
    }
  } catch (error: any) {
    console.error('[Comparison API Error]:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
