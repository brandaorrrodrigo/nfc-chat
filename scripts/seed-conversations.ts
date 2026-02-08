/**
 * Seed de Conversas Realistas
 *
 * Popula todas as 36 arenas com conversas autenticas
 * - Preserva posts existentes
 * - Adiciona 30-40 posts por arena
 * - Sincroniza contadores automaticamente
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// Usuarios simulados (22 personas realistas)
const SIMULATED_USERS = [
  { id: 'user_sim_001', name: 'Ana Paula', email: 'ana.paula@fitcoach.local' },
  { id: 'user_sim_002', name: 'Juliana Santos', email: 'juliana.santos@fitcoach.local' },
  { id: 'user_sim_003', name: 'Mariana Costa', email: 'mariana.costa@fitcoach.local' },
  { id: 'user_sim_004', name: 'Carlos Eduardo', email: 'carlos.eduardo@fitcoach.local' },
  { id: 'user_sim_005', name: 'Rafael Lima', email: 'rafael.lima@fitcoach.local' },
  { id: 'user_sim_006', name: 'Patricia Oliveira', email: 'patricia.oliveira@fitcoach.local' },
  { id: 'user_sim_007', name: 'Fernanda Alves', email: 'fernanda.alves@fitcoach.local' },
  { id: 'user_sim_008', name: 'Camila Ribeiro', email: 'camila.ribeiro@fitcoach.local' },
  { id: 'user_sim_009', name: 'Bruno Ferreira', email: 'bruno.ferreira@fitcoach.local' },
  { id: 'user_sim_010', name: 'Thiago Martins', email: 'thiago.martins@fitcoach.local' },
  { id: 'user_sim_011', name: 'Lucas Souza', email: 'lucas.souza@fitcoach.local' },
  { id: 'user_sim_012', name: 'Roberta Mendes', email: 'roberta.mendes@fitcoach.local' },
  { id: 'user_sim_013', name: 'Amanda Silva', email: 'amanda.silva@fitcoach.local' },
  { id: 'user_sim_014', name: 'Rodrigo Andrade', email: 'rodrigo.andrade@fitcoach.local' },
  { id: 'user_sim_015', name: 'Gustavo Rocha', email: 'gustavo.rocha@fitcoach.local' },
  { id: 'user_sim_016', name: 'Daniela Correia', email: 'daniela.correia@fitcoach.local' },
  { id: 'user_sim_017', name: 'Renata Moraes', email: 'renata.moraes@fitcoach.local' },
  { id: 'user_sim_018', name: 'Marcelo Pereira', email: 'marcelo.pereira@fitcoach.local' },
  { id: 'user_sim_019', name: 'Joao Carlos', email: 'joao.carlos@fitcoach.local' },
  { id: 'user_sim_020', name: 'Beatriz Gomes', email: 'beatriz.gomes@fitcoach.local' },
  { id: 'user_sim_021', name: 'Isabella Sousa', email: 'isabella.sousa@fitcoach.local' },
  { id: 'user_sim_022', name: 'Victor Almeida', email: 'victor.almeida@fitcoach.local' },
];

// Templates de topicos por tipo de arena
const TOPIC_TEMPLATES: Record<string, string[]> = {
  postura: [
    'Barriga saliente mesmo magro - como corrigir?',
    'Ombros desnivelados - afeta aparencia?',
    'Gluteo caido: e postura ou treino?',
    'Como corrigir cifose visual',
    'Pelve anteriorizada e barriga',
    'Lordose excessiva: treino ou genetica?',
  ],
  dor: [
    'Dor lombar ao acordar - causas?',
    'Joelho estrala ao agachar',
    'Dor no ombro ao levantar braco',
    'Formigamento nas maos durante treino',
    'Dor ciatica sem diagnostico de hernia',
    'Dor cervical e trabalho em casa',
  ],
  avaliacao: [
    'Um lado mais forte que outro - e problema?',
    'Assimetria de ombros: impacto funcional?',
    'Diferença entre pernas - preocupante?',
    'Rotação pelvica identificada na avaliacao',
    'Valgo de joelho - preciso corrigir?',
    'Como avaliar propria mobilidade',
  ],
  treino: [
    'Estagnacao no agachamento - como avancar?',
    'Como aumentar carga no supino',
    'Periodizacao para ganho de hipertrofia',
    'Treino A/B ou ABC? Qual escolher?',
    'Falha muscular: sempre necessaria?',
    'Volume ideal por grupo muscular',
  ],
  nutricao: [
    'Proteina: quanto e realmente suficiente?',
    'Carboidrato a noite engorda?',
    'Jejum intermitente: funciona mesmo?',
    'Refeeds: como fazer corretamente?',
    'Dieta flexivel vs rigida: qual escolher?',
    'Suplementos essenciais na musculacao',
  ],
  mobilidade: [
    'Mobilidade de quadril limitada',
    'Ombro travado: como solucionar?',
    'Flexibilidade de isquiotibial',
    'Mobilidade de tornozelo para agachamento',
    'Amplitude de movimento reduzida',
    'Alongamento estatico vs dinamico',
  ],
  default: [
    'Qual sua experiencia nessa area?',
    'Alguem pode ajudar com essa duvida?',
    'Vou compartilhar minha historia',
    'Como voces lidam com isso?',
    'Procuro orientacao',
  ],
};

// Respostas de comentarios
const COMMENT_RESPONSES = [
  'Tambem tenho isso! Vou testar a dica.',
  'Passei por situacao similar. No meu caso foi diferente.',
  'Otima explicacao! Muito util.',
  'Alguem ja fez isso? Queria saber resultados.',
  'Estou na mesma situacao. Vou tentar.',
  'Fez diferenca grande comigo.',
  'Concordo totalmente!',
  'Muito bom esse ponto!',
  'Vou implementar isso.',
  'Excelente contribuicao!',
];

// Funcoes auxiliares
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getTemplateForArena(arena: any): string[] {
  const slug = arena.slug.toLowerCase();

  if (slug.includes('postura') || slug.includes('estetica')) {
    return TOPIC_TEMPLATES.postura;
  }
  if (slug.includes('dor') || slug.includes('funcao')) {
    return TOPIC_TEMPLATES.dor;
  }
  if (slug.includes('avalia') || slug.includes('assimetria')) {
    return TOPIC_TEMPLATES.avaliacao;
  }
  if (slug.includes('treino') || slug.includes('performance')) {
    return TOPIC_TEMPLATES.treino;
  }
  if (slug.includes('nutri') || slug.includes('dieta')) {
    return TOPIC_TEMPLATES.nutricao;
  }
  if (slug.includes('mobilidade') || slug.includes('flexibilidade')) {
    return TOPIC_TEMPLATES.mobilidade;
  }

  return TOPIC_TEMPLATES.default;
}

// Criar ou buscar usuario
async function createOrGetUser(user: any) {
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!existing) {
    return await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'USER',
      },
    });
  }

  return existing;
}

// Popular uma arena
async function populateArena(
  arena: any,
  targetPostsPerArena: number,
  allUsers: any[]
): Promise<{ postsCreated: number; commentsCreated: number }> {
  // Contar posts existentes
  const existingPosts = await prisma.post.count({
    where: { arenaId: arena.id },
  });

  const postsToCreate = Math.max(0, targetPostsPerArena - existingPosts);

  if (postsToCreate === 0) {
    console.log(`  Arena ja tem ${existingPosts} posts`);
    return { postsCreated: 0, commentsCreated: 0 };
  }

  console.log(`  Criando ${postsToCreate} posts para: ${arena.name}`);

  const topics = getTemplateForArena(arena);
  let postsCreated = 0;
  let commentsCreated = 0;

  // Criar posts em threads
  const postsPerThread = 4;
  const threadsToCreate = Math.ceil(postsToCreate / postsPerThread);

  for (let t = 0; t < threadsToCreate && postsCreated < postsToCreate; t++) {
    const topic = getRandomElement(topics);
    const initialUser = getRandomElement(allUsers);

    // POST 1: Pergunta inicial
    const mainPost = await prisma.post.create({
      data: {
        arenaId: arena.id,
        userId: initialUser.id,
        content: `${topic}\n\nTenho essa duvida ha algum tempo e gostaria de ouvir a opiniao de voces.`,
        isPublished: true,
        isAIResponse: false,
      },
    });

    postsCreated++;

    // COMENTARIO 1: Resposta inicial
    if (postsCreated < postsToCreate) {
      const responderUser = getRandomElement(allUsers);

      await prisma.comment.create({
        data: {
          postId: mainPost.id,
          userId: responderUser.id,
          content:
            'Otima pergunta! Vou compartilhar minha experiencia com isso. E um topico bem importante.',
          isAIResponse: false,
        },
      });

      commentsCreated++;
    }

    // COMENTARIO 2: Feedback do usuario original
    if (postsCreated < postsToCreate && Math.random() > 0.4) {
      await prisma.comment.create({
        data: {
          postId: mainPost.id,
          userId: initialUser.id,
          content: 'Obrigado! Isso ajuda muito!',
          isAIResponse: false,
        },
      });

      commentsCreated++;
    }

    // COMENTARIOS 3-4: Outros usuarios
    const otherCommentsCount = Math.min(2, Math.floor(Math.random() * 2) + 1);

    for (let c = 0; c < otherCommentsCount && postsCreated < postsToCreate; c++) {
      const otherUser = getRandomElement(allUsers);

      if (otherUser.id !== initialUser.id) {
        await prisma.comment.create({
          data: {
            postId: mainPost.id,
            userId: otherUser.id,
            content: getRandomElement(COMMENT_RESPONSES),
            isAIResponse: false,
          },
        });

        commentsCreated++;
      }
    }

    // Atualizar contador de comentarios do post
    const commentCount = await prisma.comment.count({
      where: { postId: mainPost.id },
    });

    await prisma.post.update({
      where: { id: mainPost.id },
      data: { commentCount },
    });
  }

  // Atualizar contadores da arena
  const totalPosts = await prisma.post.count({
    where: { arenaId: arena.id },
  });

  const totalComments = await prisma.comment.count({
    where: {
      post: {
        arenaId: arena.id,
      },
    },
  });

  const uniqueUsers = await prisma.post.findMany({
    where: { arenaId: arena.id },
    select: { userId: true },
    distinct: ['userId'],
  });

  await prisma.arena.update({
    where: { id: arena.id },
    data: {
      totalPosts: totalPosts,
      totalComments: totalComments,
      dailyActiveUsers: uniqueUsers.length,
    },
  });

  console.log(`    -> ${totalPosts} posts, ${totalComments} comentarios`);

  return { postsCreated, commentsCreated };
}

// MAIN
async function main() {
  console.log('\n======================================');
  console.log('Seed de Conversas Realistas');
  console.log('======================================\n');

  // 1. Criar usuarios simulados
  console.log('Preparando usuarios simulados...');

  for (const simUser of SIMULATED_USERS) {
    await createOrGetUser(simUser);
  }

  console.log(`OK: ${SIMULATED_USERS.length} usuarios prontos\n`);

  // 2. Buscar todos os usuarios do banco
  const allUsers = await prisma.user.findMany({
    select: { id: true },
  });

  // 3. Buscar todas as arenas
  const arenas = await prisma.arena.findMany({
    orderBy: { name: 'asc' },
  });

  console.log(`Arenas encontradas: ${arenas.length}`);
  console.log(`Meta por arena: 35 posts`);
  console.log(`Total esperado: ~${arenas.length * 35} posts\n`);

  console.log('Iniciando populacao em 3 segundos...\n');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 4. Popular cada arena
  let totalPostsCreated = 0;
  let totalCommentsCreated = 0;

  for (let i = 0; i < arenas.length; i++) {
    console.log(`[${i + 1}/${arenas.length}]`);
    const result = await populateArena(arenas[i], 35, allUsers);
    totalPostsCreated += result.postsCreated;
    totalCommentsCreated += result.commentsCreated;

    // Pequeno delay entre arenas
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // 5. Relatorio final
  console.log('\n======================================');
  console.log('SEED COMPLETO!');
  console.log('======================================\n');

  const finalStats = await prisma.arena.findMany({
    select: {
      name: true,
      totalPosts: true,
      totalComments: true,
      dailyActiveUsers: true,
    },
  });

  const totalPosts = finalStats.reduce((sum, a) => sum + a.totalPosts, 0);
  const totalComments = finalStats.reduce((sum, a) => sum + a.totalComments, 0);

  console.log('Estatisticas Finais:');
  console.log(`  Total de posts: ${totalPosts}`);
  console.log(`  Total de comentarios: ${totalComments}`);
  console.log(`  Total de interacoes: ${totalPosts + totalComments}`);
  console.log(`  Media de posts/arena: ${(totalPosts / arenas.length).toFixed(1)}\n`);

  console.log('Top 10 Arenas com mais posts:\n');

  finalStats
    .sort((a, b) => b.totalPosts - a.totalPosts)
    .slice(0, 10)
    .forEach((arena, idx) => {
      console.log(`  ${idx + 1}. ${arena.name}: ${arena.totalPosts} posts`);
    });

  console.log('\nSistema pronto para uso!\n');
}

main()
  .catch((error) => {
    console.error('Erro:', error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
