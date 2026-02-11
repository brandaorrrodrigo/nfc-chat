import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * GET /api/admin/setup-visitors
 * Cria a tabela anonymous_visitor se não existir.
 * Use a Supabase SQL Editor para criar manualmente se este endpoint falhar.
 *
 * SQL para criar manualmente:
 * CREATE TABLE IF NOT EXISTS anonymous_visitor (
 *   "visitorId" TEXT PRIMARY KEY,
 *   "lastSeenAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
 * );
 * CREATE INDEX IF NOT EXISTS idx_anonymous_visitor_last_seen ON anonymous_visitor ("lastSeenAt");
 */
export async function GET() {
  try {
    // Tenta inserir e deletar um registro para verificar se a tabela existe
    const { error: testError } = await supabase
      .from('anonymous_visitor')
      .select('visitorId')
      .limit(1)

    if (testError) {
      return NextResponse.json({
        exists: false,
        error: testError.message,
        instruction: 'Crie a tabela manualmente no Supabase SQL Editor com o SQL abaixo:',
        sql: `
CREATE TABLE IF NOT EXISTS anonymous_visitor (
  "visitorId" TEXT PRIMARY KEY,
  "lastSeenAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_anonymous_visitor_last_seen ON anonymous_visitor ("lastSeenAt");

-- Desabilitar RLS para permitir acesso via anon key
ALTER TABLE anonymous_visitor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON anonymous_visitor FOR ALL USING (true) WITH CHECK (true);
        `.trim()
      })
    }

    return NextResponse.json({
      exists: true,
      message: 'Tabela anonymous_visitor já existe!'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed',
      detail: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
