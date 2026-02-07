import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/community/stats
 * Retorna estatísticas GLOBAIS da comunidade (todos os dados REAIS do banco)
 */
export async function GET() {
  try {
    console.log('[Community Stats] Fetching from database...')

    // Buscar estatísticas reais do banco de dados
    // Execute queries sequentially to avoid pgBouncer connection issues
    const totalArenas = await prisma.arena.count({
      where: { isActive: true }
    })
    console.log('[Community Stats] Total arenas:', totalArenas)

    const totalPosts = await prisma.post.count({
      where: { isDeleted: false }
    })
    console.log('[Community Stats] Total posts:', totalPosts)

    const totalComments = await prisma.comment.count({
      where: { isDeleted: false }
    })
    console.log('[Community Stats] Total comments:', totalComments)

    const uniqueUsers = await prisma.post.findMany({
      where: { isDeleted: false },
      select: { userId: true },
      distinct: ['userId']
    })
    console.log('[Community Stats] Unique users:', uniqueUsers.length)

    const recentActivity = await prisma.post.count({
      where: {
        isDeleted: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    })
    console.log('[Community Stats] Recent activity:', recentActivity)

    /* OLD parallel execution - commented out
    const [
      totalArenas,
      totalPosts,
      totalComments,
      uniqueUsers,
      recentActivity,
    ] = await Promise.all([
    */

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
