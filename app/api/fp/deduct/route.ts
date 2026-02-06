/**
 * API: POST /api/fp/deduct
 * Deduz FP da conta do usuário para usar features pagas
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { FPService, InsufficientFPError } from '@/lib/fp/fp.service'

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parsear request
    const body = await request.json()
    const { amount, category, description, reference_id, metadata } = body

    // 3. Validar campos obrigatórios
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount (number > 0) is required' },
        { status: 400 }
      )
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { error: 'Category (string) is required' },
        { status: 400 }
      )
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description (string) is required' },
        { status: 400 }
      )
    }

    // 4. Deduzir FPs
    const fpService = new FPService()

    try {
      await fpService.deductFP({
        user_id: session.user.id,
        amount,
        category,
        description,
        reference_id,
        metadata,
      })

      // 5. Retornar novo saldo
      const newBalance = await fpService.getBalance(session.user.id)

      return NextResponse.json({
        success: true,
        amount_deducted: amount,
        new_balance: newBalance,
        message: `✅ -${amount} FP deducted for ${category}`,
      })
    } catch (error) {
      if (error instanceof InsufficientFPError) {
        return NextResponse.json(
          {
            error: 'Insufficient FitPoints',
            required: error.required,
            available: error.available,
            shortfall: error.required - error.available,
          },
          { status: 402 } // Payment Required
        )
      }

      throw error
    }
  } catch (error: any) {
    console.error('[FP Deduct API Error]:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
