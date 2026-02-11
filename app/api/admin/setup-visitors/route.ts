import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * GET /api/admin/setup-visitors
 * Verifica se a tabela anonymous_visitor existe.
 *
 * POST /api/admin/setup-visitors?action=create
 * Cria a tabela via conexão direta (DIRECT_URL).
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { error: testError } = await supabase
      .from('anonymous_visitor')
      .select('visitorId')
      .limit(1)

    if (testError) {
      return NextResponse.json({
        exists: false,
        error: testError.message,
        instruction: 'Acesse POST /api/admin/setup-visitors para criar, ou use o Supabase SQL Editor',
      })
    }

    return NextResponse.json({ exists: true, message: 'Tabela anonymous_visitor existe!' })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed',
      detail: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Usar pg direto com DATABASE_URL (pooler na Vercel)
    const directUrl = process.env.DATABASE_URL
    if (!directUrl) {
      return NextResponse.json({ error: 'No DATABASE_URL configured' }, { status: 500 })
    }

    // Dynamic import para evitar bundling issues
    const { Client } = await import('pg')

    // Parse manual da URL para evitar bug com username contendo ponto
    const url = new URL(directUrl)
    const client = new Client({
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      ssl: { rejectUnauthorized: false },
    })

    await client.connect()

    await client.query(`
      CREATE TABLE IF NOT EXISTS anonymous_visitor (
        "visitorId" TEXT PRIMARY KEY,
        "lastSeenAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_anonymous_visitor_last_seen
      ON anonymous_visitor ("lastSeenAt");
    `)

    // Enable RLS with permissive policy
    await client.query(`
      ALTER TABLE anonymous_visitor ENABLE ROW LEVEL SECURITY;
    `)

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'anonymous_visitor' AND policyname = 'Allow all'
        ) THEN
          CREATE POLICY "Allow all" ON anonymous_visitor FOR ALL USING (true) WITH CHECK (true);
        END IF;
      END
      $$;
    `)

    await client.end()

    return NextResponse.json({
      success: true,
      message: 'Tabela anonymous_visitor criada com sucesso!'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to create table',
      detail: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
