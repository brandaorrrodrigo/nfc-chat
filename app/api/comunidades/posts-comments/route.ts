/**
 * API: Posts e Comentários das Arenas
 * Busca posts e comentários da tabela Post/Comment do Supabase
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

    // 2. Buscar posts da arena
    const { data: posts, error: postsError } = await supabase
      .from('Post')
      .select('id, content, "createdAt", "isPublished", "totalPosts"')
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

    // 3. Para cada post, buscar comentários
    const postsWithComments = await Promise.all(
      (posts || []).map(async (post) => {
        const { data: comments } = await supabase
          .from('Comment')
          .select('id, content, "createdAt", "isAIResponse", userId')
          .eq('postId', post.id)
          .order('createdAt', { ascending: true })

        return {
          id: post.id,
          conteudo: post.content,
          autor: {
            id: 'system',
            nome: 'Sistema',
            avatar: '/avatars/system.png',
          },
          timestamp: new Date(post.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          createdAt: post.createdAt,
          isEdited: false,
          editedAt: null,
          respostas: (comments || []).map((comment) => ({
            id: comment.id,
            conteudo: comment.content,
            autor: {
              id: comment.userId || 'ai',
              nome: comment.isAIResponse ? 'IA Especialista' : 'Usuário',
              avatar: comment.isAIResponse ? '/avatars/ia.png' : '/avatars/user.png',
              isIA: comment.isAIResponse,
            },
            timestamp: new Date(comment.createdAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          })),
          reacoes: [],
        }
      })
    )

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
