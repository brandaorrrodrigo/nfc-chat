/**
 * Seed Arenas de Avaliação Biométrica por Visão Computacional
 *
 * Cria 3 arenas temáticas focadas em:
 * 1. Postura & Estética Real
 * 2. Avaliação Biométrica & Assimetrias
 * 3. Dor, Função & Saúde Postural
 *
 * Cada arena tem 3 threads iniciais com perguntas + respostas da IA
 *
 * Executar: npx tsx scripts/seed-arenas-biometria.ts
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Usuário sistema para posts oficiais
const SYSTEM_USER_ID = 'system-biometria';
const AI_USER_ID = 'ai-biomechanics';

interface ThreadData {
  title: string;
  question: string;
  aiResponse: string;
}

interface ArenaData {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  aiPersona: string;
  aiPrompt: string;
  aiOpenQuestions: string[];
  threads: ThreadData[];
}

interface SeedData {
  arenas: ArenaData[];
}

async function seedArenasBiometria() {
  console.log('🌱 Iniciando seed de Arenas de Avaliação Biométrica...\n');

  // 1. Criar/buscar usuário sistema
  console.log('🔧 Criando usuários sistema...');
  const systemUser = await prisma.user.upsert({
    where: { id: SYSTEM_USER_ID },
    update: {},
    create: {
      id: SYSTEM_USER_ID,
      email: 'sistema@nutrifitcoach.com.br',
      name: 'Sistema NFV',
      password: 'not-used',
      role: 'ADMIN',
    },
  });

  const aiUser = await prisma.user.upsert({
    where: { id: AI_USER_ID },
    update: {},
    create: {
      id: AI_USER_ID,
      email: 'ia-biomecanica@nutrifitcoach.com.br',
      name: 'IA Biomecânica NFV',
      password: 'not-used',
      role: 'ADMIN',
    },
  });
  console.log(`✓ Usuário sistema: ${systemUser.id}`);
  console.log(`✓ Usuário IA: ${aiUser.id}\n`);

  // 2. Ler arquivo JSON
  const dataPath = path.join(__dirname, '../data/arenas-biometria-seed.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const seedData: SeedData = JSON.parse(rawData);

  let arenasCreated = 0;
  let threadsCreated = 0;
  let commentsCreated = 0;

  for (const arenaData of seedData.arenas) {
    console.log(`📍 Criando arena: ${arenaData.name}`);

    // 1. Criar ou atualizar arena
    const arena = await prisma.arena.upsert({
      where: { slug: arenaData.slug },
      update: {
        name: arenaData.name,
        description: arenaData.description,
        icon: arenaData.icon,
        color: arenaData.color,
      },
      create: {
        slug: arenaData.slug,
        name: arenaData.name,
        description: arenaData.description,
        icon: arenaData.icon,
        color: arenaData.color,
        category: arenaData.category,
        isActive: true,
        allowImages: true,
        allowLinks: true,
        allowVideos: false,
        aiPersona: arenaData.aiPersona as any,
        aiInterventionRate: 60,
        aiFrustrationThreshold: 120,
        aiCooldown: 5,
        arenaType: 'NFV_HUB', // Hub de discussão aberta
        categoria: 'BIOMECANICA_NFV',
      },
    });

    arenasCreated++;
    console.log(`  ✓ Arena criada/atualizada: ${arena.id}`);

    // 2. Criar threads iniciais
    for (const threadData of arenaData.threads) {
      console.log(`  📝 Criando thread: ${threadData.title}`);

      // Criar post inicial (pergunta do usuário)
      const post = await prisma.post.create({
        data: {
          arenaId: arena.id,
          userId: SYSTEM_USER_ID,
          content: threadData.question,
          isPublished: true,
          isPinned: true, // Threads iniciais são fixadas
          isOfficial: true, // Posts de seed são oficiais
          isAIResponse: false,
          viewCount: 0,
          likeCount: 0,
          commentCount: 1, // Terá 1 comment (resposta da IA)
        },
      });

      threadsCreated++;
      console.log(`    ✓ Post criado: ${post.id}`);

      // Criar resposta da IA
      const aiComment = await prisma.comment.create({
        data: {
          postId: post.id,
          userId: AI_USER_ID,
          content: threadData.aiResponse,
          isAIResponse: true,
          isApproved: true,
        },
      });

      commentsCreated++;
      console.log(`    ✓ Resposta da IA criada: ${aiComment.id}`);

      // Criar metadados da IA para o comment
      // Nota: AIMetadata está vinculado a Post, não Comment
      // Vamos criar para o post mesmo que a resposta seja no comment
      await prisma.aIMetadata.create({
        data: {
          postId: post.id,
          chunksUsed: [],
          booksReferenced: [],
          confidenceScore: 0.85,
          wasApproved: true,
        },
      });

      console.log(`    ✓ Metadados criados`);
    }

    // 3. Atualizar métricas da arena
    await prisma.arena.update({
      where: { id: arena.id },
      data: {
        totalPosts: arenaData.threads.length,
        totalComments: arenaData.threads.length, // 1 comment por thread
      },
    });

    console.log(`  ✓ Métricas atualizadas\n`);
  }

  console.log('════════════════════════════════════════════════════════');
  console.log('✅ Seed concluído com sucesso!');
  console.log('════════════════════════════════════════════════════════');
  console.log(`📊 Estatísticas:`);
  console.log(`   - Arenas criadas/atualizadas: ${arenasCreated}`);
  console.log(`   - Threads (posts) criadas: ${threadsCreated}`);
  console.log(`   - Respostas da IA criadas: ${commentsCreated}`);
  console.log('════════════════════════════════════════════════════════\n');

  console.log('🔍 Verifique no Prisma Studio:');
  console.log('   npx prisma studio\n');

  console.log('🎯 Arenas disponíveis:');
  const arenas = await prisma.arena.findMany({
    where: {
      slug: {
        in: seedData.arenas.map((a) => a.slug),
      },
    },
    select: {
      slug: true,
      name: true,
      totalPosts: true,
      totalComments: true,
    },
  });

  arenas.forEach((arena) => {
    console.log(`   - ${arena.name} (/${arena.slug})`);
    console.log(`     Posts: ${arena.totalPosts} | Comments: ${arena.totalComments}`);
  });

  console.log('\n');
}

// Executar seed
seedArenasBiometria()
  .catch((error) => {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
