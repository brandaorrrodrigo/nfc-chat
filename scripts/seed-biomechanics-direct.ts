/**
 * Seed Biomechanics Arenas - Versão Direta com env.local
 *
 * Executar: npx tsx scripts/seed-biomechanics-direct.ts
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar .env.local explicitamente
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const arenas = [
  // 1. Hub Biomecânico
  {
    slug: 'hub-biomecanico',
    name: 'Hub Biomecânico',
    description: 'Discussão aberta sobre biomecânica, padrões de movimento, cadeia cinética e correção postural. IA especialista em análise de movimento.',
    icon: 'Activity',
    color: '#8b5cf6',
    category: 'biomecanica',
    isActive: true,
    isPaused: false,
    allowImages: true,
    allowLinks: true,
    allowVideos: false,
    aiPersona: 'BIOMECHANICS_EXPERT' as const,
    aiInterventionRate: 60,
    aiFrustrationThreshold: 90,
    aiCooldown: 5,
    arenaType: 'NFV_HUB' as const,
    parentArenaSlug: null,
    requiresFP: null,
    requiresSubscription: false,
    movementCategory: null,
    movementPattern: null,
    categoria: 'BIOMECANICA_NFV' as const,
    criadaPor: 'ADMIN' as const,
    totalPosts: 245,
    totalComments: 0,
    dailyActiveUsers: 22,
    status: 'WARM' as const,
    tags: ['biomecânica', 'análise', 'movimento', 'técnica', 'nfv'],
  },
  // 2. Análise: Agachamento
  {
    slug: 'analise-agachamento',
    name: 'Análise: Agachamento',
    description: 'Envie seu vídeo de agachamento e receba análise biomecânica com IA + revisão profissional. Identifique compensações e melhore sua técnica.',
    icon: 'Video',
    color: '#8b5cf6',
    category: 'biomecanica',
    isActive: true,
    isPaused: false,
    allowImages: true,
    allowLinks: true,
    allowVideos: true,
    aiPersona: 'BIOMECHANICS_EXPERT' as const,
    aiInterventionRate: 40,
    aiFrustrationThreshold: 120,
    aiCooldown: 5,
    arenaType: 'NFV_PREMIUM' as const,
    parentArenaSlug: 'hub-biomecanico',
    requiresFP: 25,
    requiresSubscription: false,
    movementCategory: 'membros-inferiores',
    movementPattern: 'agachamento',
    categoria: 'BIOMECANICA_NFV' as const,
    criadaPor: 'ADMIN' as const,
    totalPosts: 187,
    totalComments: 0,
    dailyActiveUsers: 15,
    status: 'WARM' as const,
    tags: ['agachamento', 'biomecânica', 'análise', 'vídeo', 'nfv'],
  },
  // 3. Análise: Levantamento Terra
  {
    slug: 'analise-terra',
    name: 'Análise: Levantamento Terra',
    description: 'Análise biomecânica do seu terra. IA identifica posição da coluna, ativação de posteriores e padrão de hip hinge.',
    icon: 'Video',
    color: '#f59e0b',
    category: 'biomecanica',
    isActive: true,
    isPaused: false,
    allowImages: true,
    allowLinks: true,
    allowVideos: true,
    aiPersona: 'BIOMECHANICS_EXPERT' as const,
    aiInterventionRate: 40,
    aiFrustrationThreshold: 120,
    aiCooldown: 5,
    arenaType: 'NFV_PREMIUM' as const,
    parentArenaSlug: 'hub-biomecanico',
    requiresFP: 25,
    requiresSubscription: false,
    movementCategory: 'membros-inferiores',
    movementPattern: 'terra',
    categoria: 'BIOMECANICA_NFV' as const,
    criadaPor: 'ADMIN' as const,
    totalPosts: 134,
    totalComments: 0,
    dailyActiveUsers: 11,
    status: 'WARM' as const,
    tags: ['terra', 'deadlift', 'biomecânica', 'análise', 'nfv'],
  },
  // 4. Análise: Supino
  {
    slug: 'analise-supino',
    name: 'Análise: Supino',
    description: 'Envie seu vídeo de supino para análise de retração escapular, trajetória da barra e ativação peitoral.',
    icon: 'Video',
    color: '#ef4444',
    category: 'biomecanica',
    isActive: true,
    isPaused: false,
    allowImages: true,
    allowLinks: true,
    allowVideos: true,
    aiPersona: 'BIOMECHANICS_EXPERT' as const,
    aiInterventionRate: 40,
    aiFrustrationThreshold: 120,
    aiCooldown: 5,
    arenaType: 'NFV_PREMIUM' as const,
    parentArenaSlug: 'hub-biomecanico',
    requiresFP: 25,
    requiresSubscription: false,
    movementCategory: 'membros-superiores',
    movementPattern: 'supino',
    categoria: 'BIOMECANICA_NFV' as const,
    criadaPor: 'ADMIN' as const,
    totalPosts: 112,
    totalComments: 0,
    dailyActiveUsers: 9,
    status: 'WARM' as const,
    tags: ['supino', 'bench press', 'biomecânica', 'análise', 'nfv'],
  },
  // 5. Análise: Puxadas
  {
    slug: 'analise-puxadas',
    name: 'Análise: Puxadas',
    description: 'Análise biomecânica de puxadas e remadas. IA avalia ativação de dorsais, compensação de bíceps e posição escapular.',
    icon: 'Video',
    color: '#06b6d4',
    category: 'biomecanica',
    isActive: true,
    isPaused: false,
    allowImages: true,
    allowLinks: true,
    allowVideos: true,
    aiPersona: 'BIOMECHANICS_EXPERT' as const,
    aiInterventionRate: 40,
    aiFrustrationThreshold: 120,
    aiCooldown: 5,
    arenaType: 'NFV_PREMIUM' as const,
    parentArenaSlug: 'hub-biomecanico',
    requiresFP: 25,
    requiresSubscription: false,
    movementCategory: 'membros-superiores',
    movementPattern: 'puxadas',
    categoria: 'BIOMECANICA_NFV' as const,
    criadaPor: 'ADMIN' as const,
    totalPosts: 98,
    totalComments: 0,
    dailyActiveUsers: 7,
    status: 'WARM' as const,
    tags: ['puxadas', 'dorsais', 'biomecânica', 'análise', 'nfv'],
  },
  // 6. Análise: Elevação Pélvica
  {
    slug: 'analise-elevacao-pelvica',
    name: 'Análise: Elevação Pélvica',
    description: 'Análise do hip thrust e elevação pélvica. IA verifica extensão de quadril, ativação glútea e compensações lombares.',
    icon: 'Video',
    color: '#ec4899',
    category: 'biomecanica',
    isActive: true,
    isPaused: false,
    allowImages: true,
    allowLinks: true,
    allowVideos: true,
    aiPersona: 'BIOMECHANICS_EXPERT' as const,
    aiInterventionRate: 40,
    aiFrustrationThreshold: 120,
    aiCooldown: 5,
    arenaType: 'NFV_PREMIUM' as const,
    parentArenaSlug: 'hub-biomecanico',
    requiresFP: 25,
    requiresSubscription: false,
    movementCategory: 'membros-inferiores',
    movementPattern: 'elevacao-pelvica',
    categoria: 'BIOMECANICA_NFV' as const,
    criadaPor: 'ADMIN' as const,
    totalPosts: 156,
    totalComments: 0,
    dailyActiveUsers: 13,
    status: 'WARM' as const,
    tags: ['glúteo', 'hip thrust', 'biomecânica', 'análise', 'nfv'],
  },
];

async function seedBiomechanicsArenas() {
  console.log('🌱 Seeding Biomechanics Arenas...');
  console.log('📍 DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

  try {
    for (const { tags, ...arenaData } of arenas) {
      const created = await prisma.arena.upsert({
        where: { slug: arenaData.slug },
        update: {
          name: arenaData.name,
          description: arenaData.description,
          categoria: arenaData.categoria,
          arenaType: arenaData.arenaType,
          aiPersona: arenaData.aiPersona,
          totalPosts: arenaData.totalPosts,
          status: arenaData.status,
        },
        create: arenaData,
      });

      console.log(`✅ Arena criada/atualizada: ${created.name} (${created.slug})`);

      // Criar tags
      for (const tag of tags) {
        await prisma.arenaTag.upsert({
          where: {
            arenaId_tag: { arenaId: created.id, tag },
          },
          update: {},
          create: {
            arenaId: created.id,
            tag,
          },
        });
      }

      console.log(`   📌 ${tags.length} tags adicionadas`);
    }

    console.log('\n🎉 Todas as arenas de biomecânica foram criadas com sucesso!');

    // Verificar arenas criadas
    const createdArenas = await prisma.arena.findMany({
      where: {
        slug: {
          in: arenas.map((a) => a.slug),
        },
      },
      select: {
        slug: true,
        name: true,
        categoria: true,
        arenaType: true,
        status: true,
        isActive: true,
      },
      orderBy: { slug: 'asc' },
    });

    console.log('\n📋 Arenas criadas:');
    console.table(createdArenas);
  } catch (error) {
    console.error('❌ Erro ao criar arenas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedBiomechanicsArenas()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
