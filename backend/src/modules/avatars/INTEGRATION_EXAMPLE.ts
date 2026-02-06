/**
 * EXEMPLO DE INTEGRAÇÃO DO SISTEMA DE AVATARES
 *
 * Este arquivo demonstra como usar o sistema de avatares
 * na geração de posts e comentários.
 */

import { PrismaClient } from '@prisma/client';
import { AvatarService } from './avatar.service';

const prisma = new PrismaClient();
const avatarService = new AvatarService();

// ============================================================================
// EXEMPLO 1: Criar Post com Avatar Inteligente
// ============================================================================

interface UserProfile {
  sexo: 'M' | 'F';
  idade: number;
  biotipo: 'ectomorfo' | 'mesomorfo' | 'endomorfo';
  objetivo: string;
}

async function createPostWithAvatar(
  userId: string,
  arenaId: string,
  content: string,
  userProfile: UserProfile
) {
  console.log('📝 Criando post com avatar inteligente...');

  // 1. ATRIBUIR AVATAR BASEADO NO PERFIL (BACKEND)
  const avatar = avatarService.assignAvatar({
    sexo: userProfile.sexo,
    idade: userProfile.idade,
    biotipo: userProfile.biotipo,
    objetivo: userProfile.objetivo
  });

  console.log(`✅ Avatar atribuído: ${avatar.id}`);
  console.log(`   Estilo: ${avatar.estilo}`);
  console.log(`   Tags: ${avatar.tags.join(', ')}`);

  // 2. SALVAR POST COM AVATAR
  const post = await prisma.post.create({
    data: {
      userId,
      arenaId,
      content,

      // Avatar (NUNCA gerado pelo LLM)
      avatarId: avatar.id,
      avatarImg: avatar.img,
      avatarInitialsColor: avatar.initials_color
    }
  });

  console.log(`✅ Post criado: ${post.id}`);

  return post;
}

// ============================================================================
// EXEMPLO 2: Geração de Chat com Claude (SEM mencionar avatar)
// ============================================================================

async function generateChatMessageWithAvatar(
  userName: string,
  userProfile: UserProfile,
  context: string
) {
  console.log('🤖 Gerando mensagem de chat...');

  // 1. ATRIBUIR AVATAR PRIMEIRO (BACKEND)
  const avatar = avatarService.assignAvatar({
    sexo: userProfile.sexo,
    idade: userProfile.idade,
    biotipo: userProfile.biotipo,
    objetivo: userProfile.objetivo
  });

  // 2. GERAR MENSAGEM COM CLAUDE
  // IMPORTANTE: Avatar NÃO é mencionado no prompt
  const systemPrompt = `
Você está gerando mensagens de chat para o sistema NutriFitCoach.

IMPORTANTE - AVATARES:
- NUNCA mencione ou descreva avatares no texto das mensagens
- NUNCA tente criar ou imaginar como o usuário se parece
- O usuário já possui um avatar_id atribuído automaticamente pelo sistema
- Você APENAS escreve mensagens coerentes com o perfil fornecido
- NÃO inclua descrições visuais do usuário

Escreva APENAS a mensagem do chat. O avatar já está definido pelo sistema.
  `.trim();

  const userPrompt = `
Gere uma mensagem de chat para:
Nome: ${userName}
Avatar ID: ${avatar.id} (sistema interno, não mencionar)
Perfil: ${JSON.stringify(userProfile)}
Contexto: ${context}

Escreva apenas o texto da mensagem, sem mencionar aparência ou avatar.
  `.trim();

  // Simular chamada ao Claude (substituir com integração real)
  const messageText = await callClaude(systemPrompt, userPrompt);

  console.log(`✅ Mensagem gerada (${messageText.length} caracteres)`);
  console.log(`✅ Avatar atribuído: ${avatar.id}`);

  // 3. RETORNAR MENSAGEM COM AVATAR
  return {
    text: messageText,
    avatar: {
      id: avatar.id,
      img: avatar.img,
      initialsColor: avatar.initials_color
    }
  };
}

// Placeholder para integração com Claude
async function callClaude(system: string, user: string): Promise<string> {
  // TODO: Implementar chamada real ao Claude API
  return `Olá! Estou focando em ${user.includes('hipertrofia') ? 'ganhar massa muscular' : 'meus objetivos'}. Alguém tem dicas?`;
}

// ============================================================================
// EXEMPLO 3: Migração de Posts Existentes
// ============================================================================

async function migrateExistingPostsExample() {
  console.log('🔄 Migrando posts existentes...\n');

  // Buscar posts sem avatar
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { avatarId: null },
        { avatarId: '' }
      ]
    },
    select: {
      id: true,
      userId: true,
      user: {
        select: {
          name: true
        }
      }
    },
    take: 10 // Limitar para exemplo
  });

  console.log(`📊 Encontrados ${posts.length} posts sem avatar\n`);

  for (const post of posts) {
    // Atribuir avatar aleatório (ou usar perfil se disponível)
    const avatar = avatarService.assignRandomAvatar();

    // Atualizar post
    await prisma.post.update({
      where: { id: post.id },
      data: {
        avatarId: avatar.id,
        avatarImg: avatar.img,
        avatarInitialsColor: avatar.initials_color
      }
    });

    console.log(`✅ Post ${post.id}: ${avatar.id}`);
  }

  console.log(`\n✅ Migração completa!`);
}

// ============================================================================
// EXEMPLO 4: Uso no Frontend (React/Next.js)
// ============================================================================

/*
// Em um componente React:

import { AvatarDisplay } from '@/components/avatar';

function PostCard({ post }) {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar com fallback automático *\/}
      <AvatarDisplay
        avatarId={post.avatarId}
        avatarImg={post.avatarImg}
        userName={post.user.name}
        initialsColor={post.avatarInitialsColor}
        size="md"
      />

      <div>
        <h3>{post.user.name}</h3>
        <p>{post.content}</p>
      </div>
    </div>
  );
}

// Com badges (premium, founder):

import { AvatarWithBadge } from '@/components/avatar';

function UserProfile({ user }) {
  return (
    <AvatarWithBadge
      avatarId={user.avatarId}
      avatarImg={user.avatarImg}
      userName={user.name}
      initialsColor={user.avatarInitialsColor}
      isPremium={user.isPremium}
      isFounder={user.isFounder}
      size="lg"
    />
  );
}
*/

// ============================================================================
// EXEMPLO 5: Estatísticas e Monitoramento
// ============================================================================

async function getAvatarStatistics() {
  console.log('📊 Estatísticas de Avatares\n');

  // Usar o método do service
  const stats = await avatarService.getAvatarStats();

  console.log('Top 10 avatares mais usados:');
  stats.slice(0, 10).forEach((s, index) => {
    const avatar = s.avatar;
    console.log(`${index + 1}. ${s.avatar_id}: ${s.count} posts`);
    if (avatar) {
      console.log(`   ${avatar.sexo} | ${avatar.idade_range} | ${avatar.biotipo} | ${avatar.estilo}\n`);
    }
  });

  // Estatísticas customizadas
  const totalPosts = await prisma.post.count();
  const postsWithAvatar = await prisma.post.count({
    where: { avatarId: { not: null } }
  });

  const coverage = (postsWithAvatar / totalPosts) * 100;

  console.log(`\nCobertura: ${coverage.toFixed(2)}% (${postsWithAvatar}/${totalPosts})`);
}

// ============================================================================
// EXEMPLO 6: Fallback de Iniciais
// ============================================================================

function demonstrateInitialsFallback() {
  console.log('🎨 Demonstração de Fallback de Iniciais\n');

  const names = [
    'Maria Silva',
    'João',
    'Ana Paula Costa',
    'Carlos Eduardo',
    'Fernanda'
  ];

  names.forEach(name => {
    const initials = avatarService.getInitials(name);
    const color = avatarService.getInitialsColor(name);

    console.log(`${name}:`);
    console.log(`  Iniciais: ${initials}`);
    console.log(`  Cor: ${color}\n`);
  });
}

// ============================================================================
// EXECUTAR EXEMPLOS
// ============================================================================

async function runExamples() {
  console.log('🚀 EXEMPLOS DE INTEGRAÇÃO DO SISTEMA DE AVATARES');
  console.log('='.repeat(70));
  console.log('');

  // Exemplo 1: Criar post
  await createPostWithAvatar(
    'user123',
    'arena456',
    'Comecei meu treino hoje! Alguém tem dicas?',
    {
      sexo: 'F',
      idade: 29,
      biotipo: 'mesomorfo',
      objetivo: 'hipertrofia'
    }
  );

  console.log('\n' + '='.repeat(70) + '\n');

  // Exemplo 2: Gerar chat
  const chatMessage = await generateChatMessageWithAvatar(
    'Maria_Fit29',
    {
      sexo: 'F',
      idade: 29,
      biotipo: 'mesomorfo',
      objetivo: 'hipertrofia'
    },
    'Arena de hipertrofia, primeira mensagem'
  );

  console.log('Mensagem gerada:');
  console.log(`"${chatMessage.text}"`);
  console.log(`Avatar: ${chatMessage.avatar.id}`);

  console.log('\n' + '='.repeat(70) + '\n');

  // Exemplo 3: Estatísticas
  await getAvatarStatistics();

  console.log('\n' + '='.repeat(70) + '\n');

  // Exemplo 4: Fallback
  demonstrateInitialsFallback();

  console.log('='.repeat(70));
  console.log('✅ Todos os exemplos executados!');
}

// Executar se for chamado diretamente
if (require.main === module) {
  runExamples()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

// Exports para uso em outros módulos
export {
  createPostWithAvatar,
  generateChatMessageWithAvatar,
  migrateExistingPostsExample,
  getAvatarStatistics,
  demonstrateInitialsFallback
};
