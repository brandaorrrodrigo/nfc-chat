/**
 * API: Posts e Comentários das Arenas
 * Busca posts e comentários da tabela Post/Comment do Supabase
 * Inclui nomes reais dos autores via join com User
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }

    // 1. Buscar arena pelo slug
    const { data: arena, error: arenaError } = await supabase
      .from('Arena')
      .select('id, name, description')
      .eq('slug', slug)
      .single()

    if (arenaError || !arena) {
      return NextResponse.json(
        { error: 'Arena not found' },
        { status: 404 }
      )
    }

    // 2. Buscar posts da arena com userId e avatarInitialsColor
    const { data: posts, error: postsError } = await supabase
      .from('Post')
      .select('id, content, "createdAt", "isPublished", userId, "isAIResponse", "avatarInitialsColor"')
      .eq('arenaId', arena.id)
      .eq('isPublished', true)
      .order('createdAt', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    // 3. Coletar todos os userIds (posts + comments) para buscar nomes
    const allUserIds = new Set<string>()
    ;(posts || []).forEach((p) => { if (p.userId) allUserIds.add(p.userId) })

    // Buscar comentários de todos os posts de uma vez
    const postIds = (posts || []).map((p) => p.id)
    const { data: allComments } = postIds.length > 0
      ? await supabase
          .from('Comment')
          .select('id, "postId", content, "createdAt", "isAIResponse", userId, "avatarInitialsColor"')
          .in('postId', postIds)
          .order('createdAt', { ascending: true })
      : { data: [] }

    ;(allComments || []).forEach((c) => { if (c.userId) allUserIds.add(c.userId) })

    // 4. Buscar nomes de todos os usuários envolvidos
    const userMap: Record<string, string> = {}
    if (allUserIds.size > 0) {
      const { data: users } = await supabase
        .from('User')
        .select('id, name')
        .in('id', Array.from(allUserIds))

      ;(users || []).forEach((u) => { userMap[u.id] = u.name || 'Usuário' })
    }

    // 5. Montar resposta com nomes reais
    const commentsByPost: Record<string, any[]> = {}
    ;(allComments || []).forEach((c) => {
      if (!commentsByPost[c.postId]) commentsByPost[c.postId] = []
      commentsByPost[c.postId].push(c)
    })

    const postsWithComments = (posts || []).map((post) => {
      const postComments = commentsByPost[post.id] || []
      const authorName = userMap[post.userId] || 'Usuário'

      return {
        id: post.id,
        conteudo: post.content,
        autor: {
          id: post.userId || 'system',
          nome: authorName,
          avatar: undefined as string | undefined,
        },
        timestamp: new Date(post.createdAt).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAt: post.createdAt,
        isEdited: false,
        editedAt: null,
        respostas: postComments.map((comment) => {
          const commentAuthorName = comment.isAIResponse
            ? 'IA Especialista'
            : (userMap[comment.userId] || 'Usuário')

          return {
            id: comment.id,
            conteudo: comment.content,
            autor: {
              id: comment.userId || 'ai',
              nome: commentAuthorName,
              avatar: undefined as string | undefined,
              isIA: comment.isAIResponse,
            },
            timestamp: new Date(comment.createdAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
        }),
        reacoes: [],
      }
    })

    return NextResponse.json({
      arena: {
        name: arena.name,
        description: arena.description,
      },
      mensagens: postsWithComments,
      total: postsWithComments.length,
    })
  } catch (error: any) {
    console.error('[Posts Comments API Error]:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
