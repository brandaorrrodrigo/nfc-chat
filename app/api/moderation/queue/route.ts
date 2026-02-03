import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'PENDING'

    const queue = await prisma.moderationQueue.findMany({
      where: {
        status: status as any
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json(queue)
  } catch (error) {
    console.error('Error fetching moderation queue:', error)
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
