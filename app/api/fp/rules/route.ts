import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rules = await prisma.fPRule.findMany({
      orderBy: { action: 'asc' }
    })

    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching FP rules:', error)
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const rule = await prisma.fPRule.create({
      data: {
        action: body.action,
        fpValue: body.fpValue || 10,
        dailyCap: body.dailyCap,
        cooldown: body.cooldown,
        isActive: body.isActive ?? true
      }
    })

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Error creating FP rule:', error)
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
