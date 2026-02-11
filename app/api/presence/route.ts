import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * POST /api/presence
 * Registra presença de QUALQUER visitante (logado ou anônimo).
 *
 * - Todos: upsert na tabela anonymous_visitor (Supabase)
 * - Logados: também atualiza user_arena_activity (Supabase)
 *
 * Body: { visitorId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const visitorId = body.visitorId as string

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId required' }, { status: 400 })
    }

    // ✅ Registrar visitante na tabela anonymous_visitor (Supabase)
    const { error: upsertErr } = await supabase
      .from('anonymous_visitor')
      .upsert(
        { visitorId, lastSeenAt: new Date().toISOString() },
        { onConflict: 'visitorId' }
      )

    if (upsertErr) {
      console.warn('[Presence] anonymous_visitor upsert error:', upsertErr.message)
    }

    // Se logado, também atualizar user_arena_activity (contagem por arena)
    const session = await getServerSession(authOptions)

    if (session?.user?.id) {
      const userId = session.user.id
      const now = new Date().toISOString()

      const { data: existing } = await supabase
        .from('user_arena_activity')
        .select('id')
        .eq('userId', userId)
        .limit(1)

      if (existing && existing.length > 0) {
        await supabase
          .from('user_arena_activity')
          .update({ lastSeenAt: now })
          .eq('userId', userId)
      } else {
        const { data: arenas } = await supabase
          .from('Arena')
          .select('id')
          .eq('isActive', true)

        if (arenas && arenas.length > 0) {
          const records = arenas.map((a) => ({
            userId,
            arenaId: a.id,
            lastSeenAt: now,
            visitCount: 0,
          }))

          await supabase
            .from('user_arena_activity')
            .upsert(records, { onConflict: 'userId,arenaId' })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Presence] Error:', error)
    return NextResponse.json(
      { error: 'Failed', detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
