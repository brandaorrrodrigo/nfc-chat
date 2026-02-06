/**
 * POST /api/biometric/comparison
 * Criar análise de comparação (25 FPs ou Premium)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'
import { JuizBiometricoService } from '@/lib/biomechanics/juiz-biometrico.service'
import { biometricPaywall } from '@/lib/biomechanics/biometric-paywall.service'
import { FPService } from '@/lib/fp/fp.service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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

    // 3. Verificar acesso com paywall
    const paywall = await biometricPaywall.checkComparisonAccess(
      session.user.email,
      COMPARISON_COST_FP
    )

    if (!paywall.allowed) {
      return NextResponse.json(
        {
          error: 'Insufficient FitPoints',
          required_fps: COMPARISON_COST_FP,
          current_balance: paywall.current_balance,
          shortfall: COMPARISON_COST_FP - (paywall.current_balance || 0),
        },
        { status: 402 }
      )
    }

    // 4. Gerar análise comparativa
    const juizService = new JuizBiometricoService()
    const analysis = await juizService.analyzeComparison({
      baseline_id,
      images,
      user_id: session.user.email,
      current_protocol: description,
    })

    if (analysis.type === 'validation_error') {
      return NextResponse.json(analysis, { status: 400 })
    }

    // 5. Deduzir FitPoints
    const fpService = new FPService()
    const deduction = await fpService.deductFitPoints({
      user_id: session.user.email,
      amount: COMPARISON_COST_FP,
      category: 'biometric_comparison',
      reference: baseline_id,
    })

    if (!deduction.success) {
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      )
    }

    // 6. Salvar comparação no banco
    const { data: comparison, error: saveError } = await supabase
      .from('BiometricComparison')
      .insert({
        baseline_id,
        user_id: session.user.email,
        analysis_text: analysis.analysis,
        images_metadata: JSON.stringify(images),
        protocol_context: description,
        cost_fps: COMPARISON_COST_FP,
        payment_method: 'fitpoints',
        transaction_id: deduction.transaction_id,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Save error:', saveError)
      // Reembolsar se não conseguir salvar
      await fpService.refundFitPoints({
        transaction_id: deduction.transaction_id!,
        reason: 'Save failed',
      })
      return NextResponse.json(
        { error: 'Failed to save comparison' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      comparison_id: comparison.id,
      analysis: analysis.analysis,
      fps_deducted: COMPARISON_COST_FP,
      new_balance: deduction.balance_after,
      message: `✅ Comparison complete! -${COMPARISON_COST_FP} FP`,
    })
  } catch (error: any) {
    console.error('[Comparison API Error]:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
