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
 * Atualiza lastSeenAt do usuário em todas as arenas que já visitou.
 * Chamado pela página principal para manter presença online.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await supabase
      .from('UserArenaActivity')
      .update({ lastSeenAt: new Date().toISOString() })
      .eq('userId', session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Presence] Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
