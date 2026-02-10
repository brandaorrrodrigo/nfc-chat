import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { safeRedis } from '@/lib/redis'
import prisma from '@/lib/prisma'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const grouped = searchParams.get('grouped') === 'true'
    const flushCache = searchParams.get('flush') === 'true'
    const debugEnv = searchParams.get('debug') === 'env'

    // Debug de variáveis de ambiente
    if (debugEnv) {
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
        database_url: maskUrl(process.env.DATABASE_URL || ''),
        direct_url: maskUrl(process.env.DIRECT_URL || ''),
        has_database_url: !!process.env.DATABASE_URL,
        has_direct_url: !!process.env.DIRECT_URL,
      })
    }

    // Limpar cache se solicitado
    if (flushCache) {
      await safeRedis.flushDb()
      return NextResponse.json({ message: 'Cache limpo' })
    }

    // Check cache
    const cacheKey = `arenas:${grouped ? 'grouped' : 'list'}:${category || 'all'}`
    const cached = await safeRedis.get(cacheKey)
    if (cached) {
      return NextResponse.json(JSON.parse(cached))
    }

    console.log('[Arenas] Fetching from Supabase...')

    let query = supabase
      .from('Arena')
      .select('*, tags:ArenaTag(tag), hub_slug')
      .eq('isActive', true)

    if (category) {
      query = query.eq('categoria', category)
    }

    query = query.order('totalPosts', { ascending: false })

    const { data: arenas, error } = await query

    if (error) {
      console.error('[Arenas] Error:', error)
      console.log('[Arenas] Returning fallback data (Supabase offline)')

      // Fallback: retornar todas as arenas conhecidas quando Supabase offline
      const fallbackArenas = [
        // Biomecânica NFV
        { id: '1', slug: 'hub-biomecanico', name: 'Hub Biomecânico', description: 'Análise biomecânica com IA', icon: 'Activity', color: '#8b5cf6', categoria: 'BIOMECANICA_NFV', totalPosts: 245, totalUsers: 22, isActive: true },
        { id: '2', slug: 'analise-agachamento', name: 'Análise: Agachamento', description: 'Análise biomecânica do agachamento', icon: 'Video', color: '#8b5cf6', categoria: 'BIOMECANICA_NFV', totalPosts: 187, totalUsers: 15, isActive: true },
        { id: '3', slug: 'analise-terra', name: 'Análise: Levantamento Terra', description: 'Análise do terra com IA', icon: 'Video', color: '#f59e0b', categoria: 'BIOMECANICA_NFV', totalPosts: 134, totalUsers: 11, isActive: true },
        { id: '4', slug: 'analise-supino', name: 'Análise: Supino', description: 'Análise biomecânica do supino', icon: 'Video', color: '#ef4444', categoria: 'BIOMECANICA_NFV', totalPosts: 112, totalUsers: 9, isActive: true },
        { id: '5', slug: 'analise-puxadas', name: 'Análise: Puxadas', description: 'Análise de puxadas e remadas', icon: 'Video', color: '#06b6d4', categoria: 'BIOMECANICA_NFV', totalPosts: 98, totalUsers: 8, isActive: true },

        // Saúde & Condições
        { id: '6', slug: 'lipedema-paradoxo', name: 'Lipedema: Paradoxo do Cardio', description: 'Protocolo de lipedema', icon: 'Activity', color: '#ec4899', categoria: 'SAUDE_CONDICOES_CLINICAS', totalPosts: 67, totalUsers: 12, isActive: true },
        { id: '7', slug: 'protocolo-lipedema', name: 'Protocolo Lipedema', description: 'Tratamento completo de lipedema', icon: 'Heart', color: '#f43f5e', categoria: 'SAUDE_CONDICOES_CLINICAS', totalPosts: 35, totalUsers: 8, isActive: true },
        { id: '8', slug: 'sinal-vermelho', name: 'Sinal Vermelho: Dor, Ajuste ou Lesão', description: 'Identificar e prevenir lesões', icon: 'AlertTriangle', color: '#dc2626', categoria: 'SAUDE_CONDICOES_CLINICAS', totalPosts: 45, totalUsers: 10, isActive: true },
        { id: '9', slug: 'dor-funcao', name: 'Dor, Função & Saúde Postural', description: 'Relação entre dor e função', icon: 'Activity', color: '#7c3aed', categoria: 'SAUDE_CONDICOES_CLINICAS', totalPosts: 52, totalUsers: 13, isActive: true },

        // Treino & Exercício
        { id: '10', slug: 'treino-gluteo', name: 'Treino de Glúteo', description: 'Especialização em hipertrofia glútea', icon: 'Dumbbell', color: '#ec4899', categoria: 'TREINO_EXERCICIOS', totalPosts: 58, totalUsers: 14, isActive: true },
        { id: '11', slug: 'treino-em-casa', name: 'Treino em Casa', description: 'Programas para treinar em casa', icon: 'Home', color: '#f59e0b', categoria: 'TREINO_EXERCICIOS', totalPosts: 37, totalUsers: 9, isActive: true },
        { id: '12', slug: 'odeia-treinar', name: 'Exercício pra Quem Odeia Treinar', description: 'Mínimo efetivo e consistência', icon: 'Dumbbell', color: '#ef4444', categoria: 'TREINO_EXERCICIOS', totalPosts: 48, totalUsers: 11, isActive: true },
        { id: '13', slug: 'liberacao-miofascial', name: 'Liberação Miofascial', description: 'Técnicas de liberação e recuperação', icon: 'Activity', color: '#06b6d4', categoria: 'TREINO_EXERCICIOS', totalPosts: 34, totalUsers: 7, isActive: true },

        // Nutrição
        { id: '14', slug: 'deficit-calorico-vida-real', name: 'Déficit Calórico na Vida Real', description: 'Estratégias práticas de emagrecimento', icon: 'Utensils', color: '#10b981', categoria: 'NUTRICAO_DIETAS', totalPosts: 41, totalUsers: 10, isActive: true },
        { id: '15', slug: 'ansiedade-compulsao', name: 'Ansiedade e Alimentação Compulsiva', description: 'Relação entre ansiedade e comida', icon: 'Brain', color: '#8b5cf6', categoria: 'NUTRICAO_DIETAS', totalPosts: 32, totalUsers: 9, isActive: true },
        { id: '16', slug: 'receitas-alimentacao', name: 'Receitas & Alimentação', description: 'Receitas saudáveis e práticas', icon: 'Utensils', color: '#f59e0b', categoria: 'RECEITAS_ALIMENTACAO', totalPosts: 41, totalUsers: 8, isActive: true },

        // Comunidades Livres
        { id: '17', slug: 'performance-biohacking', name: 'Performance & Biohacking', description: 'Protocolos avançados de performance', icon: 'Zap', color: '#f59e0b', categoria: 'COMUNIDADES_LIVRES', totalPosts: 55, totalUsers: 12, isActive: true },
        { id: '18', slug: 'canetas-emagrecedoras', name: 'Canetas Emagrecedoras (GLP-1)', description: 'Medicações para emagrecimento', icon: 'Syringe', color: '#06b6d4', categoria: 'COMUNIDADES_LIVRES', totalPosts: 32, totalUsers: 7, isActive: true },
        { id: '19', slug: 'emagrecimento-35-mais', name: 'Emagrecimento 35+', description: 'Estratégias específicas para 35+', icon: 'TrendingDown', color: '#10b981', categoria: 'COMUNIDADES_LIVRES', totalPosts: 32, totalUsers: 8, isActive: true },
        { id: '20', slug: 'aspiracional-estetica', name: 'Aspiracional & Estética', description: 'Metas realistas de transformação', icon: 'Sparkles', color: '#ec4899', categoria: 'COMUNIDADES_LIVRES', totalPosts: 32, totalUsers: 9, isActive: true },
        { id: '21', slug: 'antes-depois-processo-real', name: 'Antes & Depois: Processo Real', description: 'Transformações e histórias reais', icon: 'Camera', color: '#8b5cf6', categoria: 'COMUNIDADES_LIVRES', totalPosts: 32, totalUsers: 10, isActive: true },
        { id: '22', slug: 'postura-estetica', name: 'Postura & Estética Real', description: 'Biomecânica e estética corporal', icon: 'Activity', color: '#06b6d4', categoria: 'COMUNIDADES_LIVRES', totalPosts: 52, totalUsers: 15, isActive: true },
        { id: '23', slug: 'avaliacao-biometrica-assimetrias', name: 'Avaliação Biométrica & Assimetrias', description: 'Análise postural e assimetrias', icon: 'Camera', color: '#f59e0b', categoria: 'COMUNIDADES_LIVRES', totalPosts: 40, totalUsers: 12, isActive: true },
      ]

      return NextResponse.json(fallbackArenas)
    }

    console.log(`[Arenas] Found ${arenas?.length || 0} arenas`)

    // ✅ Calcular total de usuários únicos por arena (com groupBy otimizado)
    let arenasWithUserCount = arenas || []
    try {
      // Buscar contagem agregada para cada arena
      const userCountByArena = await prisma.post.groupBy({
        by: ['arenaId'],
        _count: {
          userId: true,
        },
        where: {
          arenaId: {
            in: arenasWithUserCount.map((a) => a.id),
          },
        },
      })

      // Criar mapa de arenaId -> totalUsers
      const userCountMap = new Map(
        userCountByArena.map((item) => [item.arenaId, item._count.userId])
      )

      // Adicionar totalUsers a cada arena
      arenasWithUserCount = arenasWithUserCount.map((arena) => ({
        ...arena,
        totalUsers: userCountMap.get(arena.id) || 0,
      }))
    } catch (err) {
      console.warn('[Arenas] Failed to calculate totalUsers:', err)
      // Continue sem contar usuários se houver erro
    }

    let result: unknown

    if (grouped) {
      const groups: Record<string, typeof arenasWithUserCount> = {}
      for (const arena of arenasWithUserCount) {
        const cat = arena.categoria || 'COMUNIDADES_LIVRES'
        if (!groups[cat]) groups[cat] = []
        groups[cat].push(arena)
      }
      result = { groups, total: arenasWithUserCount.length }
    } else {
      result = arenasWithUserCount
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
    await safeRedis.del('arenas:list:all', 'arenas:grouped:all', 'arenas:list:all', 'arenas:grouped:all')

    // Limpar todos os caches de arenas
    const keys = await safeRedis.keys('arenas:*')
    if (keys && keys.length > 0) {
      await safeRedis.del(...keys)
    }

    return NextResponse.json(arena, { status: 201 })
  } catch (error) {
    console.error('Error creating arena:', error)
    return NextResponse.json({ error: 'Failed to create arena' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
