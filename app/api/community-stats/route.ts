import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * GET /api/community-stats
 * Retorna estatísticas GLOBAIS da comunidade (todos os dados REAIS do banco)
 */
export async function GET() {
  try {
    console.log('[Community Stats] Fetching from Supabase...')

    // Total de arenas ativas
    const { count: totalArenas } = await supabase
      .from('Arena')
      .select('*', { count: 'exact', head: true })
      .eq('isActive', true)

    // Total de posts não deletados
    const { count: totalPosts } = await supabase
      .from('Post')
      .select('*', { count: 'exact', head: true })
      .eq('isDeleted', false)

    // Total de comentários não deletados
    const { count: totalComments } = await supabase
      .from('Comment')
      .select('*', { count: 'exact', head: true })
      .eq('isDeleted', false)

    // Usuários únicos que postaram
    const { data: postsData } = await supabase
      .from('Post')
      .select('userId')
      .eq('isDeleted', false)

    const uniqueUsers = new Set(postsData?.map(p => p.userId) || []).size

    // Atividade recente (últimas 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: recentActivity } = await supabase
      .from('Post')
      .select('*', { count: 'exact', head: true })
      .eq('isDeleted', false)
      .gte('createdAt', oneDayAgo)

    // Usuários online (últimos 15 minutos)
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { data: onlineData } = await supabase
      .from('UserArenaActivity')
      .select('userId')
      .gte('lastSeenAt', fifteenMinAgo)

    const onlineUsers = new Set(onlineData?.map(u => u.userId) || []).size

    // ✅ Contar visitantes anônimos do PostgreSQL (inclui logados e não-logados)
    let anonymousVisitors = 0
    try {
      const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000)
      const result: { count: bigint }[] = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM "AnonymousVisitor" WHERE "lastSeenAt" >= $1`,
        twoMinAgo
      )
      anonymousVisitors = Number(result[0]?.count || 0)
    } catch (err) {
      console.warn('[Community Stats] Failed to count anonymous visitors:', err)
    }

    // onlineNow = máximo entre visitantes DB e usuários logados
    // (visitantes já inclui logados pois eles também pingam como visitor)
    const totalOnline = Math.max(anonymousVisitors, onlineUsers)

    const stats = {
      totalArenas: totalArenas || 0,
      totalPosts: totalPosts || 0,
      totalComments: totalComments || 0,
      totalUsers: uniqueUsers,
      onlineNow: totalOnline,
      recentActivity24h: recentActivity || 0,
      updatedAt: new Date().toISOString(),
    }

    console.log('[Community Stats] Success:', stats)

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
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
