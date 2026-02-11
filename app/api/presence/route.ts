import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'
import { safeRedis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * POST /api/presence
 * Registra presença de QUALQUER visitante (logado ou anônimo).
 *
 * - Anônimos: armazenados no Redis com TTL de 2 min (chave visitor:{id})
 * - Logados: atualiza UserArenaActivity + Redis
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

    // ✅ Registrar visitante no Redis (TTL 2 minutos) — funciona para todos
    await safeRedis.setEx(`visitor:${visitorId}`, 120, '1')

    // Se logado, também atualizar UserArenaActivity (contagem precisa por arena)
    const session = await getServerSession(authOptions)

    if (session?.user?.id) {
      const userId = session.user.id
      const now = new Date().toISOString()

      const { data: existing } = await supabase
        .from('UserArenaActivity')
        .select('id')
        .eq('userId', userId)
        .limit(1)

      if (existing && existing.length > 0) {
        await supabase
          .from('UserArenaActivity')
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
            .from('UserArenaActivity')
            .upsert(records, { onConflict: 'userId,arenaId' })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Presence] Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
