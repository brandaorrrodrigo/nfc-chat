import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

// Mark this route as dynamic to prevent build-time compilation
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('🌱 Iniciando seed das comunidades...')

    // Criar usuário admin
    const adminPassword = await hash('admin123', 10)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@nutrifitcoach.com' },
      update: {},
      create: {
        email: 'admin@nutrifitcoach.com',
        name: 'Admin NFC',
        password: adminPassword,
        role: 'SUPER_ADMIN',
        twoFactorEnabled: false,
        fpTotal: 1000,
        fpAvailable: 1000
      }
    })

    console.log('✅ Admin criado:', admin.email)

    // ========================================
    // ARENAS (17 comunidades)
    // ========================================

    const arenas = [
      // RECEITAS & ALIMENTAÇÃO
      {
        name: 'Receitas Saudáveis',
        slug: 'receitas-saudaveis',
        description: 'Compartilhe receitas fit e receba análise nutricional automática da IA: calorias, proteínas, carboidratos e gorduras por porção.',
        icon: 'Utensils',
        color: '#10b981',
        category: 'nutrition',
        aiPersona: 'BALANCED',
        aiInterventionRate: 50,
        aiFrustrationThreshold: 120,
        aiCooldown: 5,
        totalPosts: 127,
        status: 'WARM',
        tags: ['receitas', 'fit', 'nutricional', 'calorias', 'proteínas']
      },
      {
        name: 'Dieta na Vida Real',
        slug: 'dieta-vida-real',
        description: 'Espaço para falar da dificuldade real de seguir dietas, mesmo quando elas são bem elaboradas.',
        icon: 'Utensils',
        color: '#84cc16',
        category: 'nutrition',
        aiPersona: 'MOTIVATIONAL',
        aiInterventionRate: 50,
        aiFrustrationThreshold: 120,
        aiCooldown: 5,
        totalPosts: 4521,
        status: 'HOT',
        tags: ['dieta', 'prática', 'alimentação', 'rotina']
      },
      {
        name: 'Déficit Calórico na Vida Real',
        slug: 'deficit-calorico',
        description: 'Nem sempre o déficit funciona como nos cálculos. Aqui falamos do que acontece na prática, no corpo e na rotina.',
        icon: 'TrendingDown',
        color: '#f97316',
        category: 'nutrition',
        aiPersona: 'SCIENTIFIC',
        aiInterventionRate: 50,
        aiFrustrationThreshold: 120,
        aiCooldown: 5,
        totalPosts: 2341,
        status: 'HOT',
        tags: ['déficit', 'calorias', 'emagrecimento', 'metabolismo']
      }
    ]

    return Response.json({
      success: true,
      message: 'Seed iniciado com sucesso',
      admin,
      communityCount: arenas.length
    })
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
