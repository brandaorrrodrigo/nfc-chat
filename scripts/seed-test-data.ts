/**
 * Script para popular banco local com dados de teste
 * Cria usuários, posts e comentários para testar sistema de avatars
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// Dados de teste de usuários (usando apenas campos disponíveis no schema)
const testUsers = [
  // Mulheres (nomes com F no final para identificar)
  { name: 'Ana Silva F', email: 'ana@test.com' },
  { name: 'Beatriz Santos F', email: 'beatriz@test.com' },
  { name: 'Carla Oliveira F', email: 'carla@test.com' },
  { name: 'Daniela Costa F', email: 'daniela@test.com' },
  { name: 'Eliana Ferreira F', email: 'eliana@test.com' },
  { name: 'Fernanda Lima F', email: 'fernanda@test.com' },
  { name: 'Gabriela Rocha F', email: 'gabriela@test.com' },
  { name: 'Helena Martins F', email: 'helena@test.com' },

  // Homens (nomes com M no final para identificar)
  { name: 'Igor Souza M', email: 'igor@test.com' },
  { name: 'João Pedro M', email: 'joao@test.com' },
  { name: 'Carlos Eduardo M', email: 'carlos@test.com' },
  { name: 'Lucas Mendes M', email: 'lucas@test.com' },
  { name: 'Marcos Vinicius M', email: 'marcos@test.com' },
  { name: 'Natan Alves M', email: 'natan@test.com' },
  { name: 'Otávio Ribeiro M', email: 'otavio@test.com' },
  { name: 'Paulo Henrique M', email: 'paulo@test.com' },
  { name: 'Rafael Gomes M', email: 'rafael@test.com' },
  { name: 'Sergio Barbosa M', email: 'sergio@test.com' },
];

// Tópicos de posts realistas
const postTopics = [
  'Qual melhor treino para iniciantes?',
  'Dicas de suplementação para ganho de massa',
  'Como melhorar meu agachamento?',
  'Treino ABC ou ABCDE?',
  'Receitas fit para o café da manhã',
  'Quanto tempo demora para ver resultados?',
  'Melhor horário para treinar?',
  'Como evitar lesões no treino?',
  'Dieta cutting: quantas calorias?',
  'Supino reto vs supino inclinado',
  'Cardio antes ou depois do treino?',
  'Como aumentar carga no levantamento terra?',
  'Proteína whey: qual comprar?',
  'Treino em casa vs academia',
  'Descanso ativo: como fazer?',
  'Melhor exercício para glúteos',
  'Como definir o abdômen?',
  'Bulking limpo: é possível?',
  'Exercícios para corrigir postura',
  'Como vencer o platô de treino?',
];

// Comentários variados
const commentTexts = [
  'Muito boa essa dica!',
  'Tenho a mesma dúvida, alguém pode ajudar?',
  'Já tentei isso e funcionou bem pra mim',
  'Obrigado pela resposta, ajudou muito!',
  'No meu caso prefiro treinar de manhã',
  'Concordo totalmente!',
  'Interessante, vou testar',
  'Faz sentido, valeu!',
  'Alguém tem mais informações sobre isso?',
  'Excelente explicação!',
];

async function main() {
  console.log('🌱 Iniciando seed do banco local...\n');

  // Limpar dados existentes
  console.log('🗑️  Limpando dados anteriores...');
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.arena.deleteMany();
  console.log('✅ Dados limpos\n');

  // Criar arena de teste
  console.log('🏟️  Criando arena de teste...');
  const arena = await prisma.arena.create({
    data: {
      id: 'test-arena',
      name: 'Arena de Testes',
      slug: 'testes',
      description: 'Arena para testes do sistema de avatars',
      icon: '🧪',
      color: '#3B82F6',
      category: 'geral',
      isActive: true,
    },
  });
  console.log(`✅ Arena criada: ${arena.name}\n`);

  // Criar usuários
  console.log('👥 Criando usuários de teste...');
  const createdUsers = [];
  for (const userData of testUsers) {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
      },
    });
    createdUsers.push(user);
    console.log(`   ✓ ${user.name}`);
  }
  console.log(`✅ ${createdUsers.length} usuários criados\n`);

  // Criar posts (TODOS sem avatar para testar script de fix)
  console.log('📝 Criando posts...');
  const createdPosts = [];

  for (let i = 0; i < 40; i++) {
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const topic = postTopics[Math.floor(Math.random() * postTopics.length)];

    const post = await prisma.post.create({
      data: {
        content: topic,
        userId: user.id,
        arenaId: arena.id,
        // Todos os posts sem avatar - para testar script de atribuição
        avatarId: null,
        avatarImg: null,
        avatarInitialsColor: null,
      },
    });

    createdPosts.push(post);
  }
  console.log(`✅ ${createdPosts.length} posts criados (todos sem avatar)\n`);

  // Criar comentários (todos sem avatar)
  console.log('💬 Criando comentários...');
  let commentsCount = 0;

  for (const post of createdPosts) {
    // Cada post recebe 0-5 comentários
    const numComments = Math.floor(Math.random() * 6);

    for (let i = 0; i < numComments; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const commentText = commentTexts[Math.floor(Math.random() * commentTexts.length)];

      await prisma.comment.create({
        data: {
          content: commentText,
          postId: post.id,
          userId: user.id,
          // Todos sem avatar - para testar script de atribuição
          avatarId: null,
          avatarImg: null,
          avatarInitialsColor: null,
        },
      });

      commentsCount++;
    }
  }
  console.log(`✅ ${commentsCount} comentários criados (todos sem avatar)\n`);

  // Resumo final
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ SEED CONCLUÍDO COM SUCESSO!\n');
  console.log('📊 Resumo:');
  console.log(`   🏟️  Arena: ${arena.name}`);
  console.log(`   👥 Usuários: ${createdUsers.length}`);
  console.log(`   📝 Posts: ${createdPosts.length} (TODOS sem avatar)`);
  console.log(`   💬 Comentários: ${commentsCount} (TODOS sem avatar)`);
  console.log(`   ⚠️  Total sem avatar: ${createdPosts.length + commentsCount}`);
  console.log('\n🎯 Próximos passos:');
  console.log('   1. npm run avatar:analyze  → Ver distribuição atual (deve mostrar 0)');
  console.log('   2. npm run avatar:fix      → Atribuir avatares automaticamente');
  console.log('   3. npm run avatar:analyze  → Verificar distribuição balanceada');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
