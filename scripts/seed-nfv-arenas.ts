/**
 * Seed NFV Arenas - Cria Hub Biomecanico + 5 Arenas Premium
 *
 * Executar: npx ts-node scripts/seed-nfv-arenas.ts
 * Ou: npx tsx scripts/seed-nfv-arenas.ts
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function seedNFVArenas() {
  console.log('Seeding NFV arenas...');

  // 1. Hub Biomecanico (Level 1)
  const hub = await prisma.arena.upsert({
    where: { slug: 'hub-biomecanico' },
    update: {},
    create: {
      slug: 'hub-biomecanico',
      name: 'Hub Biomecanico',
      description: 'Discussao aberta sobre biomecanica, padrao de movimento, tecnica de exercicios e correcao de execucao. Compartilhe duvidas e aprenda com a comunidade.',
      icon: '🦴',
      color: '#8b5cf6',
      category: 'biomecanica',
      isActive: true,
      allowImages: true,
      allowLinks: true,
      allowVideos: false,
      aiPersona: 'BIOMECHANICS_EXPERT',
      aiInterventionRate: 60,
      arenaType: 'NFV_HUB',
    },
  });
  console.log(`Hub Biomecanico criado: ${hub.id}`);

  // 2. Arenas Premium de Analise (Level 3)
  const premiumArenas = [
    {
      slug: 'analise-agachamento',
      name: 'Analise: Agachamento',
      description: 'Envie seu video de agachamento para analise biomecanica detalhada com IA + revisao de especialista.',
      icon: '🏋️',
      color: '#8b5cf6',
      movementCategory: 'membros-inferiores',
      movementPattern: 'agachamento',
    },
    {
      slug: 'analise-terra',
      name: 'Analise: Levantamento Terra',
      description: 'Envie seu video de levantamento terra para analise biomecanica detalhada com IA + revisao de especialista.',
      icon: '💪',
      color: '#f59e0b',
      movementCategory: 'membros-inferiores',
      movementPattern: 'terra',
    },
    {
      slug: 'analise-supino',
      name: 'Analise: Supino',
      description: 'Envie seu video de supino para analise biomecanica detalhada com IA + revisao de especialista.',
      icon: '🔱',
      color: '#ef4444',
      movementCategory: 'membros-superiores',
      movementPattern: 'supino',
    },
    {
      slug: 'analise-puxadas',
      name: 'Analise: Puxadas',
      description: 'Envie seu video de puxada para analise biomecanica detalhada com IA + revisao de especialista.',
      icon: '🔗',
      color: '#06b6d4',
      movementCategory: 'membros-superiores',
      movementPattern: 'puxadas',
    },
    {
      slug: 'analise-elevacao-pelvica',
      name: 'Analise: Elevacao Pelvica',
      description: 'Envie seu video de elevacao pelvica para analise biomecanica detalhada com IA + revisao de especialista.',
      icon: '🍑',
      color: '#ec4899',
      movementCategory: 'membros-inferiores',
      movementPattern: 'elevacao-pelvica',
    },
  ];

  for (const arena of premiumArenas) {
    const created = await prisma.arena.upsert({
      where: { slug: arena.slug },
      update: {},
      create: {
        slug: arena.slug,
        name: arena.name,
        description: arena.description,
        icon: arena.icon,
        color: arena.color,
        category: 'biomecanica',
        isActive: true,
        allowImages: true,
        allowLinks: true,
        allowVideos: true,
        aiPersona: 'BIOMECHANICS_EXPERT',
        aiInterventionRate: 40,
        arenaType: 'NFV_PREMIUM',
        parentArenaSlug: 'hub-biomecanico',
        requiresFP: 25,
        requiresSubscription: false,
        movementCategory: arena.movementCategory,
        movementPattern: arena.movementPattern,
      },
    });
    console.log(`Arena premium criada: ${created.slug} (${created.id})`);
  }

  console.log('NFV arenas seeded successfully!');
}

seedNFVArenas()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
