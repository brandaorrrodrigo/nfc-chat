/**
 * POST /api/fitpoints/deduct
 * Deduzir FitPoints da conta do usuário
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { FPService } from '@/lib/fp/fp.service'

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
    const { amount, category, reference } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // 3. Deduzir FPs
    const fpService = new FPService()
    const result = await fpService.deductFitPoints({
      user_id: session.user.email,
      amount,
      category,
      reference,
    })

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Insufficient FitPoints',
          current_balance: result.current_balance,
          required: amount,
          shortfall: amount - (result.current_balance || 0),
        },
        { status: 402 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction_id: result.transaction_id,
      amount_deducted: amount,
      balance_after: result.balance_after,
      message: `✅ -${amount} FP deducted`,
    })
  } catch (error: any) {
    console.error('[FitPoints Deduct API Error]:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
