import { PrismaClient } from '../lib/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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

  // Criar arenas iniciais
  const arenas = [
    {
      name: 'Receitas Fit',
      slug: 'receitas-fit',
      description: 'Compartilhe e descubra receitas saudáveis e deliciosas',
      icon: '🍽️',
      color: '#10b981',
      category: 'nutrition',
      aiPersona: 'BALANCED',
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5
    },
    {
      name: 'Exercícios AMA',
      slug: 'exercicios-ama',
      description: 'Tire dúvidas sobre treinos e exercícios',
      icon: '💪',
      color: '#f59e0b',
      category: 'fitness',
      aiPersona: 'SCIENTIFIC',
      aiInterventionRate: 60,
      aiFrustrationThreshold: 90,
      aiCooldown: 5
    },
    {
      name: 'Sinal Vermelho',
      slug: 'sinal-vermelho',
      description: 'Comportamentos e sinais de alerta alimentar',
      icon: '🚨',
      color: '#ef4444',
      category: 'health',
      aiPersona: 'MOTIVATIONAL',
      aiInterventionRate: 70,
      aiFrustrationThreshold: 60,
      aiCooldown: 10
    }
  ]

  for (const arena of arenas) {
    const created = await prisma.arena.upsert({
      where: { slug: arena.slug },
      update: {},
      create: arena
    })
    console.log(`✅ Arena criada: ${created.name}`)
  }

  // Criar regras de FP
  const fpRules = [
    { action: 'post_created', fpValue: 10, dailyCap: 50, cooldown: null },
    { action: 'comment_created', fpValue: 5, dailyCap: 100, cooldown: null },
    { action: 'post_liked', fpValue: 1, dailyCap: 20, cooldown: null },
    { action: 'helpful_comment', fpValue: 15, dailyCap: null, cooldown: 30 },
    { action: 'spam_detected', fpValue: -50, dailyCap: null, cooldown: null },
    { action: 'daily_streak', fpValue: 5, dailyCap: 5, cooldown: null }
  ]

  for (const rule of fpRules) {
    const created = await prisma.fPRule.upsert({
      where: { action: rule.action },
      update: {},
      create: {
        ...rule,
        isActive: true
      }
    })
    console.log(`✅ Regra FP criada: ${created.action}`)
  }

  // Criar filtros de spam
  const spamFilters = [
    { type: 'KEYWORD', value: 'viagra', severity: 10 },
    { type: 'KEYWORD', value: 'bitcoin', severity: 8 },
    { type: 'KEYWORD', value: 'compre agora', severity: 7 },
    { type: 'LINK', value: 'bit.ly', severity: 5 },
    { type: 'PATTERN', value: '\\d{10,}', severity: 6 } // 10+ dígitos seguidos
  ]

  for (const filter of spamFilters) {
    await prisma.spamFilter.create({
      data: {
        ...filter,
        isActive: true
      }
    })
  }

  console.log(`✅ ${spamFilters.length} filtros de spam criados`)

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
