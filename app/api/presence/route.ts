import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

let tableEnsured = false

async function ensureTable() {
  if (tableEnsured) return
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AnonymousVisitor" (
        "visitorId" TEXT PRIMARY KEY,
        "lastSeenAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AnonymousVisitor_lastSeenAt_idx"
      ON "AnonymousVisitor" ("lastSeenAt")
    `)
    tableEnsured = true
  } catch (err) {
    console.warn('[Presence] ensureTable:', err)
  }
}

/**
 * POST /api/presence
 * Registra presença de QUALQUER visitante (logado ou anônimo).
 *
 * - Todos: upsert na tabela AnonymousVisitor (Prisma/PostgreSQL)
 * - Logados: também atualiza UserArenaActivity (Supabase)
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

    // ✅ Garantir que a tabela existe (1x por cold start)
    await ensureTable()

    // ✅ Registrar visitante no PostgreSQL (funciona na Vercel)
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AnonymousVisitor" ("visitorId", "lastSeenAt")
       VALUES ($1, NOW())
       ON CONFLICT ("visitorId") DO UPDATE SET "lastSeenAt" = NOW()`,
      visitorId
    )

    // Se logado, também atualizar UserArenaActivity (contagem por arena)
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
