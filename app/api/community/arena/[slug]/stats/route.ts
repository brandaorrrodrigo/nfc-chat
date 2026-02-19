import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/community/arena/[slug]/stats
 * Retorna estatísticas REAIS de uma arena específica
 * Conta exatamente o que aparece no feed (posts publicados + seus comentários)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params

    // Buscar arena
    const { data: arena, error: arenaError } = await supabase
      .from('Arena')
      .select('id, name, slug, dailyActiveUsers')
      .eq('slug', slug)
      .eq('isActive', true)
      .single()

    if (arenaError || !arena) {
      return NextResponse.json(
        { error: 'Arena not found' },
        { status: 404 }
      )
    }

    // Contar posts publicados (mesmo filtro que posts-comments API usa)
    const { data: posts } = await supabase
      .from('Post')
      .select('id')
      .eq('arenaId', arena.id)
      .eq('isPublished', true)

    const postCount = posts?.length ?? 0

    // Contar comentários desses posts (mesmo filtro que posts-comments API usa)
    let commentCount = 0
    if (posts && posts.length > 0) {
      const postIds = posts.map(p => p.id)
      const { count } = await supabase
        .from('Comment')
        .select('id', { count: 'exact', head: true })
        .in('postId', postIds)
      commentCount = count ?? 0
    }

    // Total de mensagens = posts + comentários visíveis no feed
    const totalMessages = postCount + commentCount

    // Atividade recente (últimas 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: recentPosts } = await supabase
      .from('Post')
      .select('*', { count: 'exact', head: true })
      .eq('arenaId', arena.id)
      .eq('isPublished', true)
      .gte('createdAt', oneDayAgo)

    const { count: recentComments } = await supabase
      .from('Comment')
      .select('*', { count: 'exact', head: true })
      .in('postId', posts?.map(p => p.id) || [])
      .gte('createdAt', oneDayAgo)

    // Usuários online agora (últimos 15 minutos)
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { data: onlineData } = await supabase
      .from('user_arena_activity')
      .select('userId')
      .eq('arenaId', arena.id)
      .gte('lastSeenAt', fifteenMinAgo)

    const onlineNow = new Set(onlineData?.map(u => u.userId) || []).size

    const stats = {
      arenaId: arena.id,
      name: arena.name,
      slug: arena.slug,
      totalPosts: postCount,
      totalComments: commentCount,
      totalMessages,
      totalMembers: arena.dailyActiveUsers || 0,
      onlineNow,
      recentPosts24h: recentPosts || 0,
      recentComments24h: recentComments || 0,
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
