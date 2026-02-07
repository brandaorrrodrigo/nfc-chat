import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/community/stats
 * Retorna estatísticas GLOBAIS da comunidade (todos os dados REAIS do banco)
 */
export async function GET() {
  try {
    // Buscar estatísticas reais do banco de dados
    const [
      totalArenas,
      totalPosts,
      totalComments,
      uniqueUsers,
      recentActivity,
    ] = await Promise.all([
      // Total de arenas ativas
      prisma.arena.count({
        where: { isActive: true }
      }),

      // Total de posts (não deletados)
      prisma.post.count({
        where: { isDeleted: false }
      }),

      // Total de comentários (não deletados)
      prisma.comment.count({
        where: { isDeleted: false }
      }),

      // Usuários únicos que postaram
      prisma.post.findMany({
        where: { isDeleted: false },
        select: { userId: true },
        distinct: ['userId']
      }),

      // Atividade recente (últimas 24h)
      prisma.post.count({
        where: {
          isDeleted: false,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      }),
    ])

    // Usuários online (últimos 15 minutos) - distinct users
    const onlineUsersData = await prisma.userArenaActivity.findMany({
      where: {
        lastSeenAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000)
        }
      },
      select: { userId: true },
      distinct: ['userId']
    })
    const onlineUsers = onlineUsersData.length

    const stats = {
      totalArenas,
      totalPosts,
      totalComments,
      totalUsers: uniqueUsers.length,
      onlineNow: onlineUsers,
      recentActivity24h: recentActivity,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    })
  } catch (error) {
    console.error('[Community Stats] Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch community stats',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined,
        prismaAvailable: typeof prisma !== 'undefined',
        models: typeof prisma !== 'undefined' ? Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')) : []
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
