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
      categoria: 'RECEITAS_ALIMENTACAO' as const,
      aiPersona: 'BALANCED' as const,
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5,
      totalPosts: 127,
      status: 'WARM' as const,
      tags: ['receitas', 'fit', 'nutricional', 'calorias', 'proteínas']
    },
    {
      name: 'Dieta na Vida Real',
      slug: 'dieta-vida-real',
      description: 'Espaço para falar da dificuldade real de seguir dietas, mesmo quando elas são bem elaboradas.',
      icon: 'Utensils',
      color: '#84cc16',
      category: 'nutrition',
      categoria: 'NUTRICAO_DIETAS' as const,
      aiPersona: 'MOTIVATIONAL' as const,
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5,
      totalPosts: 4521,
      status: 'HOT' as const,
      tags: ['dieta', 'prática', 'alimentação', 'rotina']
    },
    {
      name: 'Déficit Calórico na Vida Real',
      slug: 'deficit-calorico',
      description: 'Nem sempre o déficit funciona como nos cálculos. Aqui falamos do que acontece na prática, no corpo e na rotina.',
      icon: 'TrendingDown',
      color: '#f97316',
      category: 'nutrition',
      categoria: 'NUTRICAO_DIETAS' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5,
      totalPosts: 2341,
      status: 'HOT' as const,
      tags: ['déficit', 'calorias', 'emagrecimento', 'metabolismo']
    },

    // TREINO & EXERCÍCIOS
    {
      name: 'Exercícios que Ama',
      slug: 'exercicios-que-ama',
      description: 'Compartilhe exercícios que você AMA fazer e receba análise biomecânica da IA: músculos ativados, padrão de movimento e variações.',
      icon: 'Dumbbell',
      color: '#6366f1',
      category: 'fitness',
      categoria: 'TREINO_EXERCICIOS' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 60,
      aiFrustrationThreshold: 90,
      aiCooldown: 5,
      totalPosts: 184,
      status: 'WARM' as const,
      tags: ['exercícios', 'biomecânica', 'variações', 'músculos']
    },
    {
      name: 'Treino de Glúteo',
      slug: 'treino-gluteo',
      description: 'Treino de glúteo com foco em resultado: genética, dor, carga, repetição, constância e evolução real.',
      icon: 'Dumbbell',
      color: '#ec4899',
      category: 'fitness',
      categoria: 'TREINO_EXERCICIOS' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 60,
      aiFrustrationThreshold: 90,
      aiCooldown: 5,
      totalPosts: 3156,
      status: 'HOT' as const,
      tags: ['glúteo', 'hipertrofia', 'treino', 'carga']
    },
    {
      name: 'Exercício para Quem Odeia Treinar',
      slug: 'odeia-treinar',
      description: 'Para quem quer resultado, mas não se identifica com academia tradicional.',
      icon: 'Heart',
      color: '#f43f5e',
      category: 'fitness',
      categoria: 'TREINO_EXERCICIOS' as const,
      aiPersona: 'MOTIVATIONAL' as const,
      aiInterventionRate: 60,
      aiFrustrationThreshold: 90,
      aiCooldown: 5,
      totalPosts: 1432,
      status: 'WARM' as const,
      tags: ['motivação', 'iniciante', 'alternativo', 'exercício']
    },
    {
      name: 'Treino em Casa',
      slug: 'treino-casa',
      description: 'Exercícios livres e com poucos acessórios. Baseado na metodologia Bret: ~100% dos exercícios podem ser feitos em casa.',
      icon: 'Home',
      color: '#8b5cf6',
      category: 'fitness',
      categoria: 'TREINO_EXERCICIOS' as const,
      aiPersona: 'BALANCED' as const,
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5,
      totalPosts: 2156,
      status: 'WARM' as const,
      tags: ['casa', 'livre', 'acessório', 'bodyweight']
    },
    {
      name: 'Performance & Biohacking',
      slug: 'performance-biohacking',
      description: 'Protocolos de elite, farmacologia avançada e estratégias de redução de danos. Ciência aplicada sem filtro.',
      icon: 'Zap',
      color: '#7c3aed',
      category: 'fitness',
      categoria: 'TREINO_EXERCICIOS' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 40,
      aiFrustrationThreshold: 120,
      aiCooldown: 10,
      totalPosts: 892,
      status: 'HOT' as const,
      tags: ['biohacking', 'performance', 'farmacologia', 'elite']
    },

    // SAÚDE & CONDIÇÕES CLÍNICAS (dores, lipedema)
    {
      name: 'Sinal Vermelho',
      slug: 'sinal-vermelho',
      description: 'Investigação inteligente de dores e desconfortos em exercícios. A IA faz perguntas progressivas e sugere ajustes ou encaminha ao médico.',
      icon: 'Activity',
      color: '#ef4444',
      category: 'health',
      categoria: 'SAUDE_CONDICOES_CLINICAS' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 70,
      aiFrustrationThreshold: 60,
      aiCooldown: 5,
      totalPosts: 93,
      status: 'WARM' as const,
      tags: ['dor', 'saúde', 'investigação', 'desconforto', 'médico']
    },
    {
      name: 'Lipedema — Paradoxo do Cardio',
      slug: 'lipedema-paradoxo',
      description: 'Por que HIIT pode piorar o lipedema? Discussão técnica sobre HIF-1α, NF-κB, macrófagos M1 e o protocolo AEJ + compressão.',
      icon: 'Activity',
      color: '#06b6d4',
      category: 'health',
      categoria: 'SAUDE_CONDICOES_CLINICAS' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 40,
      aiFrustrationThreshold: 120,
      aiCooldown: 10,
      totalPosts: 634,
      status: 'HOT' as const,
      tags: ['lipedema', 'HIIT', 'cardio', 'inflamação', 'AEJ']
    },

    // SAÚDE & CONDIÇÕES CLÍNICAS
    {
      name: 'Protocolo Lipedema',
      slug: 'lipedema',
      description: 'Espaço para mulheres que convivem com lipedema compartilharem sintomas, estratégias, frustrações e avanços reais no dia a dia.',
      icon: 'Activity',
      color: '#0ea5e9',
      category: 'health',
      categoria: 'SAUDE_CONDICOES_CLINICAS' as const,
      aiPersona: 'MOTIVATIONAL' as const,
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5,
      totalPosts: 1247,
      status: 'WARM' as const,
      tags: ['lipedema', 'feminino', 'protocolo', 'sintomas']
    },
    {
      name: 'Canetas Emagrecedoras',
      slug: 'canetas',
      description: 'Relatos reais sobre uso de Ozempic, Wegovy, Mounjaro: efeitos colaterais, expectativas e adaptações no estilo de vida.',
      icon: 'Syringe',
      color: '#14b8a6',
      category: 'health',
      categoria: 'SAUDE_CONDICOES_CLINICAS' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5,
      totalPosts: 1856,
      status: 'WARM' as const,
      tags: ['ozempic', 'GLP-1', 'medicação', 'emagrecimento']
    },
    {
      name: 'Ansiedade, Compulsão e Alimentação',
      slug: 'ansiedade-alimentacao',
      description: 'Discussões abertas sobre relação emocional com a comida, sem julgamento.',
      icon: 'Brain',
      color: '#a855f7',
      category: 'health',
      categoria: 'SAUDE_CONDICOES_CLINICAS' as const,
      aiPersona: 'MOTIVATIONAL' as const,
      aiInterventionRate: 60,
      aiFrustrationThreshold: 90,
      aiCooldown: 5,
      totalPosts: 2087,
      status: 'HOT' as const,
      tags: ['ansiedade', 'compulsão', 'emocional', 'alimentação']
    },
    {
      name: 'Emagrecimento Feminino 35+',
      slug: 'emagrecimento-35-mais',
      description: 'Mudanças hormonais, metabolismo e a realidade do corpo após os 30–40 anos.',
      icon: 'Sparkles',
      color: '#f59e0b',
      category: 'health',
      categoria: 'SAUDE_CONDICOES_CLINICAS' as const,
      aiPersona: 'BALANCED' as const,
      aiInterventionRate: 50,
      aiFrustrationThreshold: 120,
      aiCooldown: 5,
      totalPosts: 1678,
      status: 'WARM' as const,
      tags: ['hormônios', 'metabolismo', 'feminino', '35+', 'menopausa']
    },

    // COMUNIDADES LIVRES
    {
      name: 'Antes e Depois — Processo Real',
      slug: 'antes-depois',
      description: 'Mais do que fotos, histórias. O foco é o processo, não só o resultado.',
      icon: 'Camera',
      color: '#06b6d4',
      category: 'community',
      categoria: 'COMUNIDADES_LIVRES' as const,
      aiPersona: 'MOTIVATIONAL' as const,
      aiInterventionRate: 30,
      aiFrustrationThreshold: 120,
      aiCooldown: 10,
      totalPosts: 2934,
      status: 'HOT' as const,
      tags: ['transformação', 'antes-depois', 'processo', 'história']
    },
    {
      name: 'Aspiracional & Estética',
      slug: 'aspiracional-estetica',
      description: 'Sonhos estéticos com base científica e responsabilidade. IA educadora sobre procedimentos com preparo físico, nutricional e psicológico.',
      icon: 'Sparkles',
      color: '#d946ef',
      category: 'lifestyle',
      categoria: 'COMUNIDADES_LIVRES' as const,
      aiPersona: 'SCIENTIFIC' as const,
      aiInterventionRate: 60,
      aiFrustrationThreshold: 90,
      aiCooldown: 5,
      totalPosts: 156,
      status: 'WARM' as const,
      tags: ['estética', 'procedimento', 'aspiracional', 'científico']
    },
  ]

  for (const { tags, ...arenaData } of arenas) {
    const created = await prisma.arena.upsert({
      where: { slug: arenaData.slug },
      update: {
        categoria: arenaData.categoria,
        totalPosts: arenaData.totalPosts,
        status: arenaData.status,
      },
      create: arenaData
    })

    // Criar tags
    for (const tag of tags) {
      await prisma.arenaTag.upsert({
        where: {
          arenaId_tag: { arenaId: created.id, tag }
        },
        update: {},
        create: {
          arenaId: created.id,
          tag
        }
      })
    }

    console.log(`✅ Arena criada: ${created.name} (${tags.length} tags)`)
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

  // ========================================
  // EXERCÍCIOS (CATÁLOGO BIOMECÂNICO)
  // ========================================
  console.log('\n💪 Creating exercise catalog...')

  const exercises = [
    // LOWER BODY
    {
      name: 'Agachamento Livre (Back Squat)',
      slug: 'back-squat',
      category: 'LOWER_BODY' as const,
      movementPattern: 'squat',
      description: 'Agachamento com barra nas costas, movimento fundamental de membros inferiores.',
      instructions: '1. Barra apoiada no trapézio\n2. Descer controladamente até quadril abaixo da linha do joelho\n3. Subir mantendo torso estável',
      primaryMuscles: ['quadriceps', 'glutes', 'hamstrings'],
      secondaryMuscles: ['core', 'spinal_erectors'],
      equipment: ['barbell', 'squat_rack'],
      isActive: true,
      isPremium: false,
    },
    {
      name: 'Levantamento Terra Convencional',
      slug: 'deadlift-conventional',
      category: 'LOWER_BODY' as const,
      movementPattern: 'hinge',
      description: 'Levantamento terra com pegada convencional, padrão de dobradiça de quadril.',
      instructions: '1. Pés afastados na largura do quadril\n2. Barra próxima às canelas\n3. Extensão de quadril e joelhos simultânea',
      primaryMuscles: ['hamstrings', 'glutes', 'spinal_erectors'],
      secondaryMuscles: ['quadriceps', 'traps', 'forearms'],
      equipment: ['barbell'],
      isActive: true,
      isPremium: false,
    },
    {
      name: 'Hip Thrust',
      slug: 'hip-thrust',
      category: 'LOWER_BODY' as const,
      movementPattern: 'hip_extension',
      description: 'Extensão de quadril com costas apoiadas em banco.',
      instructions: '1. Apoiar escápulas no banco\n2. Barra sobre o quadril\n3. Extensão completa até alinhamento torso-coxa',
      primaryMuscles: ['glutes'],
      secondaryMuscles: ['hamstrings', 'core'],
      equipment: ['barbell', 'bench'],
      isActive: true,
      isPremium: false,
    },
    // UPPER BODY - PUSH
    {
      name: 'Supino Reto (Bench Press)',
      slug: 'bench-press',
      category: 'UPPER_BODY_PUSH' as const,
      movementPattern: 'horizontal_push',
      description: 'Empurrão horizontal deitado no banco.',
      instructions: '1. Deitado no banco, pés firmes no chão\n2. Descer barra até peito\n3. Empurrar até extensão completa',
      primaryMuscles: ['pectorals', 'triceps'],
      secondaryMuscles: ['anterior_deltoids', 'serratus'],
      equipment: ['barbell', 'bench'],
      isActive: true,
      isPremium: false,
    },
    // UPPER BODY - PULL
    {
      name: 'Remada com Apoio no Peito',
      slug: 'chest-supported-row',
      category: 'UPPER_BODY_PULL' as const,
      movementPattern: 'horizontal_pull',
      description: 'Puxada horizontal com peito apoiado em banco inclinado.',
      instructions: '1. Peito apoiado no banco inclinado\n2. Puxar halteres até cotovelos ultrapassarem torso\n3. Controlar descida',
      primaryMuscles: ['lats', 'rhomboids', 'traps'],
      secondaryMuscles: ['biceps', 'rear_deltoids'],
      equipment: ['dumbbells', 'incline_bench'],
      isActive: true,
      isPremium: false,
    },
    {
      name: 'Remada Curvada com Barra',
      slug: 'barbell-row',
      category: 'UPPER_BODY_PULL' as const,
      movementPattern: 'horizontal_pull',
      description: 'Puxada horizontal em pé com torso inclinado.',
      instructions: '1. Torso inclinado 45°\n2. Puxar barra até abdômen\n3. Controlar descida',
      primaryMuscles: ['lats', 'rhomboids', 'traps'],
      secondaryMuscles: ['biceps', 'spinal_erectors'],
      equipment: ['barbell'],
      isActive: true,
      isPremium: false,
    },
    {
      name: 'Remada no Cabo Sentado',
      slug: 'cable-row',
      category: 'UPPER_BODY_PULL' as const,
      movementPattern: 'horizontal_pull',
      description: 'Puxada horizontal sentado com cabo.',
      instructions: '1. Sentado com torso ereto\n2. Puxar cabo até abdômen\n3. Manter controle total',
      primaryMuscles: ['lats', 'rhomboids', 'traps'],
      secondaryMuscles: ['biceps', 'rear_deltoids'],
      equipment: ['cable_machine'],
      isActive: true,
      isPremium: false,
    },
    {
      name: 'Elevação Lateral',
      slug: 'lateral-raise',
      category: 'UPPER_BODY_PULL' as const,
      movementPattern: 'shoulder_abduction',
      description: 'Abdução de ombro com halteres.',
      instructions: '1. Em pé, halteres ao lado do corpo\n2. Elevar lateralmente até altura dos ombros\n3. Controlar descida',
      primaryMuscles: ['lateral_deltoids'],
      secondaryMuscles: ['traps', 'supraspinatus'],
      equipment: ['dumbbells'],
      isActive: true,
      isPremium: false,
    },
  ]

  for (const exercise of exercises) {
    const created = await prisma.exercise.upsert({
      where: { slug: exercise.slug },
      update: {},
      create: exercise
    })
    console.log(`✅ Exercício criado: ${created.name}`)
  }

  // ========================================
  // BIOMETRIC PRICING
  // ========================================
  console.log('\n💵 Creating biometric pricing...')

  const pricing = [
    {
      item_type: 'baseline',
      fps_cost: 0,
      premium_free: true,
      first_free: true,
      is_active: true,
    },
    {
      item_type: 'comparison',
      fps_cost: 25,
      premium_free: true,
      first_free: false,
      is_active: true,
    },
    {
      item_type: 'export_pdf',
      fps_cost: 10,
      premium_free: false,
      first_free: false,
      is_active: true,
    },
  ]

  for (const p of pricing) {
    const created = await prisma.biometricPricing.upsert({
      where: { item_type: p.item_type },
      update: {},
      create: p
    })
    console.log(`✅ Pricing criado: ${created.item_type} (${created.fps_cost} FPs)`)
  }

  console.log('\n🎉 Seed completed!')
  console.log('📊 Summary:')
  console.log(`   - Arenas: ${arenas.length}`)
  console.log(`   - Exercises: ${exercises.length}`)
  console.log(`   - FP Rules: ${fpRules.length}`)
  console.log(`   - Spam Filters: ${spamFilters.length}`)
  console.log(`   - Pricing: ${pricing.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
