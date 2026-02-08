import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mark this route as dynamic to prevent build-time compilation
export const dynamic = 'force-dynamic';

/**
 * Endpoint de teste para verificar conexão com banco
 */
export async function GET() {
  try {
    // Teste simples: contar arenas
    const count = await prisma.arena.count()

    return NextResponse.json({
      success: true,
      message: 'Prisma conectado!',
      arenasCount: count,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}