/**
 * GET /api/debug-env
 * Debug endpoint para verificar variáveis de ambiente
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL || ''
  const directUrl = process.env.DIRECT_URL || ''

  // Ocultar senha mas mostrar host e porta
  const maskUrl = (url: string) => {
    if (!url) return 'NOT SET'
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/)
    if (match) {
      const [, user, password, hostPort, db] = match
      return `postgresql://${user}:***@${hostPort}/${db}`
    }
    return 'INVALID FORMAT'
  }

  return NextResponse.json({
    env: process.env.NODE_ENV,
    database_url: maskUrl(databaseUrl),
    direct_url: maskUrl(directUrl),
    has_database_url: !!process.env.DATABASE_URL,
    has_direct_url: !!process.env.DIRECT_URL,
  })
}
