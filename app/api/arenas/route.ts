import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeRedis } from '@/lib/redis'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const grouped = searchParams.get('grouped') === 'true'

    // Check cache
    const cacheKey = `arenas:${grouped ? 'grouped' : 'list'}:${category || 'all'}`
    const cached = await safeRedis.get(cacheKey)
    if (cached) {
      return NextResponse.json(JSON.parse(cached))
    }

    console.log('[Arenas] Fetching from Supabase...')

    let query = supabase
      .from('Arena')
      .select('*, tags:ArenaTag(tag)')
      .eq('isActive', true)

    if (category) {
      query = query.eq('categoria', category)
    }

    query = query.order('totalPosts', { ascending: false })

    const { data: arenas, error } = await query

    if (error) {
      console.error('[Arenas] Error:', error)
      return NextResponse.json({ error: 'Failed to fetch arenas' }, { status: 500 })
    }

    console.log(`[Arenas] Found ${arenas?.length || 0} arenas`)

    let result: unknown

    if (grouped) {
      const groups: Record<string, typeof arenas> = {}
      for (const arena of arenas || []) {
        const cat = arena.categoria || 'COMUNIDADES_LIVRES'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(arena)
      }
      result = { groups, total: arenas?.length || 0 }
    } else {
      result = arenas || []
    }

    // Cache 5 minutes
    await safeRedis.setEx(cacheKey, 300, JSON.stringify(result))

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Arenas] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch arenas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { tags, ...arenaFields } = body

    const arena = await prisma.$transaction(async (tx) => {
      const created = await tx.arena.create({
        data: {
          name: arenaFields.name,
          slug: arenaFields.slug,
          description: arenaFields.description,
          icon: arenaFields.icon || 'MessageCircle',
          color: arenaFields.color || '#6366f1',
          category: arenaFields.category || 'general',
          categoria: arenaFields.categoria || 'COMUNIDADES_LIVRES',
          criadaPor: arenaFields.criadaPor || 'USER',
          createdByUserId: arenaFields.createdByUserId || null,
          aiPersona: arenaFields.aiPersona || 'BALANCED',
          aiInterventionRate: arenaFields.aiInterventionRate || 50,
          aiFrustrationThreshold: arenaFields.aiFrustrationThreshold || 120,
          aiCooldown: arenaFields.aiCooldown || 5,
          allowVideos: arenaFields.allowVideos || false,
        }
      })

      // Create tags if provided
      if (tags && Array.isArray(tags) && tags.length > 0) {
        await tx.arenaTag.createMany({
          data: tags.map((tag: string) => ({
            arenaId: created.id,
            tag: tag.trim().toLowerCase(),
          })),
          skipDuplicates: true,
        })
      }

      return tx.arena.findUnique({
        where: { id: created.id },
        include: { tags: true },
      })
    })

    // Invalidate cache
    await safeRedis.del('arenas:list:all', 'arenas:grouped:all')

    return NextResponse.json(arena, { status: 201 })
  } catch (error) {
    console.error('Error creating arena:', error)
    return NextResponse.json({ error: 'Failed to create arena' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
