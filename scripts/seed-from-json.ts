/**
 * Importa dados do conversations.json para o banco
 * Mais simples que seed-conversations.ts
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Importando dados do JSON ===\n');

  try {
    // Ler JSON
    const jsonPath = path.join(__dirname, '..', 'seed-data', 'conversations.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`Usuarios: ${jsonData.usuarios.length}`);
    console.log(`Conversas: ${jsonData.conversas.length}\n`);

    // 1. Criar usuarios
    console.log('Criando usuarios...');
    for (const user of jsonData.usuarios) {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: 'USER',
          },
        });
      } catch (e) {
        console.log(`  ✓ ${user.name} ja existe`);
      }
    }
    console.log(`✓ ${jsonData.usuarios.length} usuarios prontos\n`);

    // 2. Para cada conversa, popular arena
    for (const conversa of jsonData.conversas) {
      console.log(`\nPopulando: ${conversa.arena_name}`);

      const arena = await prisma.arena.findFirst({
        where: { slug: conversa.arena_slug },
      });

      if (!arena) {
        console.log(`  ✗ Arena ${conversa.arena_slug} nao encontrada`);
        continue;
      }

      let postsCount = 0;
      let commentsCount = 0;

      // Para cada thread
      for (const thread of conversa.threads) {
        // Pegar usuario do post original
        const authorUser = jsonData.usuarios.find(
          (u: any) => u.id === thread.usuario_original_id
        );

        if (!authorUser) continue;

        // Criar post principal
        const post = await prisma.post.create({
          data: {
            arenaId: arena.id,
            userId: authorUser.id,
            content: thread.posts[0].conteudo,
            isPublished: true,
            isAIResponse: false,
          },
        });

        postsCount++;

        // Criar comentarios
        for (let i = 1; i < thread.posts.length; i++) {
          const postData = thread.posts[i];
          const commentUser = jsonData.usuarios.find(
            (u: any) => u.id === postData.usuario_id
          );

          if (!commentUser) continue;

          await prisma.comment.create({
            data: {
              postId: post.id,
              userId: commentUser.id,
              content: postData.conteudo,
              isAIResponse: postData.tipo.includes('resposta'),
            },
          });

          commentsCount++;
        }

        // Atualizar post com contagem de comentarios
        const commentCount = await prisma.comment.count({
          where: { postId: post.id },
        });

        await prisma.post.update({
          where: { id: post.id },
          data: { commentCount },
        });
      }

      console.log(`  ✓ ${postsCount} posts, ${commentsCount} comentarios`);
    }

    // 3. Atualizar contadores de todas as arenas
    console.log('\n\nAtualizando contadores...');
    const arenas = await prisma.arena.findMany();

    for (const arena of arenas) {
      const totalPosts = await prisma.post.count({
        where: { arenaId: arena.id },
      });

      const totalComments = await prisma.comment.count({
        where: { post: { arenaId: arena.id } },
      });

      const activeUsers = await prisma.post.findMany({
        where: { arenaId: arena.id },
        select: { userId: true },
        distinct: ['userId'],
      });

      if (totalPosts > 0) {
        await prisma.arena.update({
          where: { id: arena.id },
          data: {
            totalPosts,
            totalComments,
            dailyActiveUsers: activeUsers.length,
          },
        });

        console.log(`  ✓ ${arena.name}: ${totalPosts} posts`);
      }
    }

    console.log('\n✅ COMPLETO!\n');

  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
