import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const rule = await prisma.fPRule.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(rule)
  } catch (error) {
    console.error('Error updating FP rule:', error)
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fPRule.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting FP rule:', error)
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
