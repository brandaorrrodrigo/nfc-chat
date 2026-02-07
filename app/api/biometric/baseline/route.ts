/**
 * POST /api/biometric/baseline
 * Criar análise baseline (1ª grátis)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import { JuizBiometricoService } from '@/lib/biomechanics/juiz-biometrico.service'


export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parsear request
    const body = await request.json()
    const { images, description } = body

    if (!images || (!images.frontal && !images.lateral && !images.posterior)) {
      return NextResponse.json(
        { error: 'At least one image is required (frontal, lateral, or posterior)' },
        { status: 400 }
      )
    }

    // 3. Verificar se já usou baseline grátis
    const existingBaseline = await prisma.biometricBaseline.findFirst({
      where: {
        user_id: session.user.id,
        was_free: true,
      },
      select: { id: true },
    })

    if (existingBaseline) {
      return NextResponse.json(
        { error: 'Free baseline already used. Use FitPoints for more analyses.' },
        { status: 402 } // Payment Required
      )
    }

    // 4. Gerar análise com Juiz Biométrico
    const juizService = new JuizBiometricoService()
    const analysis = await juizService.analyzeBaseline({
      images,
      user_id: session.user.id!,
      current_protocol: description,
    })

    if (analysis.type === 'validation_error') {
      return NextResponse.json(analysis, { status: 400 })
    }

    if (analysis.type === 'paywall_blocked') {
      return NextResponse.json(analysis, { status: 402 })
    }

    // JuizBiometricoService já salvou no banco, retornar resultado
    return NextResponse.json({
      success: true,
      baseline_id: analysis.baseline_id,
      analysis: analysis.analysis,
      fps_deducted: analysis.payment_info?.cost_fps || 0,
      message: '✅ Baseline analysis complete!',
    })
  } catch (error: any) {
    console.error('[Baseline API Error]:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
