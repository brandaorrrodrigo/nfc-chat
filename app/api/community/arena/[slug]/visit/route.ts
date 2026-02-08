import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
    const { data: arena, error: arenaError } = await supabase
      .from('Arena')
      .select('id')
      .eq('slug', slug)
      .eq('isActive', true)
      .single()

    if (arenaError || !arena) {
      return NextResponse.json(
        { error: 'Arena not found' },
        { status: 404 }
      )
    }

    // Verificar se já existe atividade do usuário
    const { data: existingActivity } = await supabase
      .from('UserArenaActivity')
      .select('id, visitCount')
      .eq('userId', session.user.id)
      .eq('arenaId', arena.id)
      .single()

    if (existingActivity) {
      // Atualizar atividade existente
      await supabase
        .from('UserArenaActivity')
        .update({
          lastSeenAt: new Date().toISOString(),
          visitCount: (existingActivity.visitCount || 0) + 1
        })
        .eq('id', existingActivity.id)
    } else {
      // Criar nova atividade
      await supabase
        .from('UserArenaActivity')
        .insert({
          userId: session.user.id,
          arenaId: arena.id,
          lastSeenAt: new Date().toISOString(),
          visitCount: 1
        })
    }

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
