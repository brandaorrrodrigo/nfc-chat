/**
 * POST /api/biometric/baseline
 * Criar análise baseline (1ª grátis)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'
import { JuizBiometricoService } from '@/lib/biomechanics/juiz-biometrico.service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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
    const { data: existingBaseline } = await supabase
      .from('BiometricBaseline')
      .select('id')
      .eq('user_id', session.user.email)
      .eq('was_free', true)
      .single()

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
      user_id: session.user.email,
      current_protocol: description,
    })

    if (analysis.type === 'validation_error') {
      return NextResponse.json(analysis, { status: 400 })
    }

    if (analysis.type === 'paywall_blocked') {
      return NextResponse.json(analysis, { status: 402 })
    }

    // 5. Salvar no banco
    const { data: baseline, error: saveError } = await supabase
      .from('BiometricBaseline')
      .insert({
        user_id: session.user.email,
        analysis_text: analysis.analysis,
        images_metadata: JSON.stringify(images),
        protocol_context: description,
        was_free: true,
        cost_fps: 0,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Save error:', saveError)
      return NextResponse.json(
        { error: 'Failed to save baseline' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      baseline_id: baseline.id,
      analysis: analysis.analysis,
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
