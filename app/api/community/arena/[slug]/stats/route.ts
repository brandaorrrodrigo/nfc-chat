import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/generated/prisma'

/**
 * GET /api/community/arena/[slug]/stats
 * Retorna estatísticas REAIS de uma arena específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Buscar arena
    const arena = await prisma.arena.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        totalPosts: true,
        totalComments: true,
        dailyActiveUsers: true,
      }
    })

    if (!arena) {
      return NextResponse.json(
        { error: 'Arena not found' },
        { status: 404 }
      )
    }

    // Contar usuários online AGORA (últimos 15 minutos nesta arena)
    const onlineNow = await prisma.userArenaActivity.count({
      where: {
        arenaId: arena.id,
        lastSeenAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000)
        }
      },
      distinct: ['userId']
    })

    // Posts recentes (últimas 24h)
    const recentPosts = await prisma.post.count({
      where: {
        arenaId: arena.id,
        isDeleted: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    })

    // Comentários recentes (últimas 24h)
    const recentComments = await prisma.comment.count({
      where: {
        post: {
          arenaId: arena.id,
          isDeleted: false
        },
        isDeleted: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    })

    const stats = {
      arenaId: arena.id,
      name: arena.name,
      slug: arena.slug,
      totalPosts: arena.totalPosts,
      totalComments: arena.totalComments,
      totalMembers: arena.dailyActiveUsers, // Usuários únicos que postaram
      onlineNow, // REAL: usuários ativos nos últimos 15min
      recentPosts24h: recentPosts,
      recentComments24h: recentComments,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30'
      }
    })
  } catch (error) {
    console.error('[Arena Stats] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch arena stats' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
