import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * POST /api/presence
 * Atualiza lastSeenAt do usuário em todas as arenas.
 * Se o usuário nunca visitou nenhuma arena, cria registros para todas as ativas.
 * Chamado pela página principal para manter presença online.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const now = new Date().toISOString()

    // Verificar se o usuário já tem registros de atividade
    const { data: existing } = await supabase
      .from('UserArenaActivity')
      .select('id')
      .eq('userId', userId)
      .limit(1)

    if (existing && existing.length > 0) {
      // Usuário já tem registros → apenas atualizar lastSeenAt
      await supabase
        .from('UserArenaActivity')
        .update({ lastSeenAt: now })
        .eq('userId', userId)
    } else {
      // Primeiro acesso → criar registros para todas as arenas ativas
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
          .from('UserArenaActivity')
          .upsert(records, { onConflict: 'userId,arenaId' })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Presence] Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
