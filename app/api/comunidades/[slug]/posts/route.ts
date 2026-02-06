import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    // Buscar arena pelo slug
    const { data: arena, error: arenaError } = await supabase
      .from('Arena')
      .select('id, name, description, slug')
      .eq('slug', slug)
      .single()

    if (arenaError || !arena) {
      return NextResponse.json(
        { error: 'Arena not found', details: arenaError?.message },
        { status: 404 }
      )
    }

    // Buscar posts da arena
    const { data: posts, error: postsError } = await supabase
      .from('Post')
      .select(`
        id,
        content,
        "createdAt",
        "isPublished",
        "totalPosts",
        user:userId (
          name,
          id
        ),
        comments:Comment (
          id,
          content,
          "createdAt",
          "isAIResponse",
          user:userId (
            name,
            id
          )
        )
      `)
      .eq('arenaId', arena.id)
      .eq('isPublished', true)
      .order('createdAt', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      return NextResponse.json(
        { error: 'Failed to fetch posts', details: postsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      arena,
      posts: posts || [],
      total: posts?.length || 0,
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
