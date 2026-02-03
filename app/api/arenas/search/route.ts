/**
 * API: Arena Search
 * Path: GET /api/arenas/search?q=texto&category=X&limit=20
 *
 * Busca arenas por nome, descrição e tags.
 * Retorna arenas ordenadas por relevância (HOT primeiro, mais posts).
 */

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { safeRedis } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const category = searchParams.get('category')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

    if (q.length < 2 && !category) {
      return NextResponse.json({ arenas: [], total: 0 })
    }

    // Check cache
    const cacheKey = `arenas:search:${q}:${category || ''}:${limit}`
    const cached = await safeRedis.get(cacheKey)
    if (cached) {
      return NextResponse.json(JSON.parse(cached))
    }

    // Build query
    const where: Record<string, unknown> = { isActive: true }

    if (q.length >= 2) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { some: { tag: { contains: q, mode: 'insensitive' } } } },
      ]
    }

    if (category) {
      where.categoria = category
    }

    const arenas = await prisma.arena.findMany({
      where,
      include: { tags: true },
      orderBy: [
        { totalPosts: 'desc' },
      ],
      take: limit,
    })

    // Sort: HOT first, then WARM, then by totalPosts
    const statusOrder: Record<string, number> = { HOT: 0, WARM: 1, COLD: 2, ARCHIVED: 3 }
    arenas.sort((a, b) => {
      const statusDiff = (statusOrder[a.status] ?? 2) - (statusOrder[b.status] ?? 2)
      if (statusDiff !== 0) return statusDiff
      return b.totalPosts - a.totalPosts
    })

    const result = { arenas, total: arenas.length }

    // Cache 60 seconds
    if (q.length >= 2) {
      await safeRedis.setEx(cacheKey, 60, JSON.stringify(result))
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Arena Search Error]', error)
    return NextResponse.json({ arenas: [], total: 0, error: 'Erro na busca' }, { status: 500 })
  }
}
