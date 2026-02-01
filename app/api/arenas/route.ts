import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const arenas = await prisma.arena.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(arenas)
  } catch (error) {
    console.error('Error fetching arenas:', error)
    return NextResponse.json({ error: 'Failed to fetch arenas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const arena = await prisma.arena.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        icon: body.icon || '🎯',
        color: body.color || '#6366f1',
        category: body.category || 'general',
        aiPersona: body.aiPersona || 'BALANCED',
        aiInterventionRate: body.aiInterventionRate || 50,
        aiFrustrationThreshold: body.aiFrustrationThreshold || 120,
        aiCooldown: body.aiCooldown || 5
      }
    })

    return NextResponse.json(arena, { status: 201 })
  } catch (error) {
    console.error('Error creating arena:', error)
    return NextResponse.json({ error: 'Failed to create arena' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
