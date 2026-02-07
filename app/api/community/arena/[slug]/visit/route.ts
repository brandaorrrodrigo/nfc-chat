import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/generated/prisma'

/**
 * POST /api/community/arena/[slug]/visit
 * Registra visita do usuário na arena (para contagem de "online agora")
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = params

    // Buscar arena
    const arena = await prisma.arena.findUnique({
      where: { slug, isActive: true },
      select: { id: true }
    })

    if (!arena) {
      return NextResponse.json(
        { error: 'Arena not found' },
        { status: 404 }
      )
    }

    // Registrar/Atualizar atividade do usuário
    await prisma.userArenaActivity.upsert({
      where: {
        userId_arenaId: {
          userId: session.user.id,
          arenaId: arena.id
        }
      },
      create: {
        userId: session.user.id,
        arenaId: arena.id,
        lastSeenAt: new Date(),
        visitCount: 1
      },
      update: {
        lastSeenAt: new Date(),
        visitCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Visit registered'
    })
  } catch (error) {
    console.error('[Arena Visit] Error:', error)
    return NextResponse.json(
      { error: 'Failed to register visit' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
