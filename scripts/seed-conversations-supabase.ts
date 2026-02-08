/**
 * Seed de Conversas Realistas - VERSÃO SUPABASE CLIENT
 *
 * Usa Supabase Client direto (SEM PRISMA)
 * Para executar: npm run seed:conversations:supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { randomUUID } from 'crypto';

// Carregar .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não definidos');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
  treino: [
    'Estagnacao no agachamento - como avancar?',
    'Como aumentar carga no supino',
    'Periodizacao para ganho de hipertrofia',
    'Treino A/B ou ABC? Qual escolher?',
    'Falha muscular: sempre necessaria?',
    'Volume ideal por grupo muscular',
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
  if (slug.includes('treino') || slug.includes('performance')) {
    return TOPIC_TEMPLATES.treino;
  }

  return TOPIC_TEMPLATES.default;
}

// Criar ou buscar usuario
async function createOrGetUser(user: any) {
  const { data: existing } = await supabase
    .from('User')
    .select('*')
    .eq('email', user.email)
    .single();

  if (!existing) {
    const { data: created, error } = await supabase
      .from('User')
      .insert({
        id: user.id,
        email: user.email,
        name: user.name,
        role: 'USER',
      })
      .select()
      .single();

    if (error) {
      console.error(`   ❌ Erro ao criar usuário ${user.email}:`, error.message);
      return null;
    }

    return created;
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
  const { count: existingPosts } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id);

  const postsToCreate = Math.max(0, targetPostsPerArena - (existingPosts || 0));

  if (postsToCreate === 0) {
    console.log(`  ⏭️  Arena ja tem ${existingPosts} posts`);
    return { postsCreated: 0, commentsCreated: 0 };
  }

  console.log(`  📝 Criando ${postsToCreate} posts para: ${arena.name}`);

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
    const { data: mainPost, error: postError } = await supabase
      .from('Post')
      .insert({
        id: randomUUID(),
        arenaId: arena.id,
        userId: initialUser.id,
        content: `${topic}\n\nTenho essa duvida ha algum tempo e gostaria de ouvir a opiniao de voces.`,
        isPublished: true,
        isAIResponse: false,
      })
      .select()
      .single();

    if (postError) {
      console.error(`   ❌ Erro ao criar post:`, postError.message);
      continue;
    }

    postsCreated++;

    // COMENTARIO 1: Resposta inicial
    if (postsCreated < postsToCreate) {
      const responderUser = getRandomElement(allUsers);

      const { error: commentError } = await supabase
        .from('Comment')
        .insert({
          id: randomUUID(),
          postId: mainPost.id,
          userId: responderUser.id,
          content: 'Otima pergunta! Vou compartilhar minha experiencia com isso. E um topico bem importante.',
          isAIResponse: false,
        });

      if (!commentError) {
        commentsCreated++;
      }
    }

    // COMENTARIO 2: Feedback do usuario original
    if (postsCreated < postsToCreate && Math.random() > 0.4) {
      await supabase
        .from('Comment')
        .insert({
          id: randomUUID(),
          postId: mainPost.id,
          userId: initialUser.id,
          content: 'Obrigado! Isso ajuda muito!',
          isAIResponse: false,
        });

      commentsCreated++;
    }

    // COMENTARIOS 3-4: Outros usuarios
    const otherCommentsCount = Math.min(2, Math.floor(Math.random() * 2) + 1);

    for (let c = 0; c < otherCommentsCount && postsCreated < postsToCreate; c++) {
      const otherUser = getRandomElement(allUsers);

      if (otherUser.id !== initialUser.id) {
        await supabase
          .from('Comment')
          .insert({
            id: randomUUID(),
            postId: mainPost.id,
            userId: otherUser.id,
            content: getRandomElement(COMMENT_RESPONSES),
            isAIResponse: false,
          });

        commentsCreated++;
      }
    }
  }

  // Atualizar contadores da arena
  const { count: totalPosts } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id);

  const { data: posts } = await supabase
    .from('Post')
    .select('id')
    .eq('arenaId', arena.id);

  const postIds = posts?.map((p: any) => p.id) || [];

  let totalComments = 0;
  if (postIds.length > 0) {
    const { count } = await supabase
      .from('Comment')
      .select('*', { count: 'exact', head: true })
      .in('postId', postIds);

    totalComments = count || 0;
  }

  const { data: uniqueUsers } = await supabase
    .from('Post')
    .select('userId')
    .eq('arenaId', arena.id);

  const uniqueUserCount = new Set(uniqueUsers?.map((p: any) => p.userId) || []).size;

  await supabase
    .from('Arena')
    .update({
      totalPosts: totalPosts || 0,
      totalComments: totalComments,
      dailyActiveUsers: uniqueUserCount,
    })
    .eq('id', arena.id);

  console.log(`    ✅ ${totalPosts} posts, ${totalComments} comentarios`);

  return { postsCreated, commentsCreated };
}

// MAIN
async function main() {
  console.log('\n======================================');
  console.log('✨ Seed de Conversas Realistas');
  console.log('📡 Usando Supabase Client (SEM PRISMA)');
  console.log('======================================\n');

  // 1. Testar conexão
  console.log('🔌 Testando conexão com Supabase...');
  const { data: testArena, error: testError } = await supabase
    .from('Arena')
    .select('id')
    .limit(1)
    .single();

  if (testError) {
    console.error('❌ Erro de conexão:', testError.message);
    console.error('   Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local');
    process.exit(1);
  }

  console.log('✅ Conexão OK!\n');

  // 2. Criar usuarios simulados
  console.log('👥 Preparando usuarios simulados...');

  const createdUsers: any[] = [];
  for (const simUser of SIMULATED_USERS) {
    const user = await createOrGetUser(simUser);
    if (user) {
      createdUsers.push(user);
    }
  }

  console.log(`✅ ${createdUsers.length} usuarios prontos\n`);

  // 3. Buscar todas as arenas
  const { data: arenas, error: arenasError } = await supabase
    .from('Arena')
    .select('*')
    .order('name', { ascending: true });

  if (arenasError || !arenas) {
    console.error('❌ Erro ao buscar arenas:', arenasError?.message);
    process.exit(1);
  }

  console.log(`🏟️  Arenas encontradas: ${arenas.length}`);
  console.log(`🎯 Meta por arena: 35 posts`);
  console.log(`📊 Total esperado: ~${arenas.length * 35} posts\n`);

  console.log('⏳ Iniciando populacao em 3 segundos...\n');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 4. Popular cada arena
  let totalPostsCreated = 0;
  let totalCommentsCreated = 0;

  for (let i = 0; i < arenas.length; i++) {
    console.log(`\n[${i + 1}/${arenas.length}]`);
    const result = await populateArena(arenas[i], 35, createdUsers);
    totalPostsCreated += result.postsCreated;
    totalCommentsCreated += result.commentsCreated;

    // Pequeno delay entre arenas
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // 5. Relatorio final
  console.log('\n======================================');
  console.log('🎉 SEED COMPLETO!');
  console.log('======================================\n');

  const { data: finalStats } = await supabase
    .from('Arena')
    .select('name, totalPosts, totalComments, dailyActiveUsers')
    .order('totalPosts', { ascending: false });

  const totalPosts = finalStats?.reduce((sum: number, a: any) => sum + a.totalPosts, 0) || 0;
  const totalComments = finalStats?.reduce((sum: number, a: any) => sum + a.totalComments, 0) || 0;

  console.log('📈 Estatisticas Finais:');
  console.log(`  📝 Total de posts: ${totalPosts}`);
  console.log(`  💬 Total de comentarios: ${totalComments}`);
  console.log(`  🔥 Total de interacoes: ${totalPosts + totalComments}`);
  console.log(`  📊 Media de posts/arena: ${(totalPosts / arenas.length).toFixed(1)}\n`);

  console.log('🏆 Top 10 Arenas com mais posts:\n');

  finalStats
    ?.slice(0, 10)
    .forEach((arena: any, idx: number) => {
      console.log(`  ${idx + 1}. ${arena.name}: ${arena.totalPosts} posts`);
    });

  console.log('\n✅ Sistema pronto para uso!\n');
}

main()
  .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  });
