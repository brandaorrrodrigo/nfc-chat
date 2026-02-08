/**
 * Script seguro para popular arenas com dados do JSON
 * Com suporte melhorado para reconexão e tratamento de erros
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Carregar .env.local ANTES de qualquer import que use DATABASE_URL
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('✓ Loading .env.local for Docker credentials');
  dotenv.config({ path: envLocalPath });
} else {
  console.log('⚠ .env.local not found, usando .env padrão');
}

console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

import { PrismaClient } from '../lib/generated/prisma';

async function main() {
  console.log('\n=== Populando Arenas com Conversas (Tentativa Segura) ===\n');

  // Criar Prisma client
  const prisma = new PrismaClient({
    log: ['error'],
  });

  try {
    // 1. Verificar conexão teste
    console.log('Testando conexão...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Conexão OK\n');

    // 2. Ler JSON
    const jsonPath = path.join(__dirname, '..', 'seed-data', 'conversations.json');
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`Arquivo não encontrado: ${jsonPath}`);
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Usuarios no JSON: ${jsonData.usuarios.length}`);
    console.log(`Conversas no JSON: ${jsonData.conversas.length}\n`);

    // 3. Listar arenas existentes
    console.log('Buscando arenas...');
    const arenasExistentes = await prisma.arena.findMany({
      select: { id: true, slug: true, name: true },
    });
    console.log(`Arenas encontradas no banco: ${arenasExistentes.length}`);
    arenasExistentes.forEach(a => {
      console.log(`  - ${a.slug}: ${a.name} (${a.id})`);
    });

    if (arenasExistentes.length === 0) {
      console.log(
        '\n⚠ AVISO: Nenhuma arena encontrada no banco de dados!'
      );
      console.log(
        'As arenas precisam ser criadas primeiro. Verifique se o database.sql foi executado.'
      );
      return;
    }

    console.log();

    // 4. Para cada conversa esperada, buscar e popular
    let totalPosts = 0;
    let totalComments = 0;

    for (const conversa of jsonData.conversas) {
      const arena = arenasExistentes.find(a => a.slug === conversa.arena_slug);

      if (!arena) {
        console.log(`✗ ${conversa.arena_name}: Arena não encontrada (${conversa.arena_slug})`);
        continue;
      }

      console.log(`▶ ${conversa.arena_name}...`);

      let postsCount = 0;
      let commentsCount = 0;
      let errorCount = 0;

      // Para cada thread
      for (const thread of conversa.threads) {
        try {
          // Pegar usuario
          const authorUser = jsonData.usuarios.find(
            (u: any) => u.id === thread.usuario_original_id
          );

          if (!authorUser) {
            errorCount++;
            continue;
          }

          // Criar post
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

          // Update post comment count
          await prisma.post.update({
            where: { id: post.id },
            data: { commentCount: thread.posts.length - 1 },
          });
        } catch (e: any) {
          errorCount++;
          console.error(`    Erro ao criar thread:`, e.message);
        }
      }

      // Update arena counters
      try {
        const postCount = await prisma.post.count({
          where: { arenaId: arena.id },
        });

        const commentCount = await prisma.comment.count({
          where: { post: { arenaId: arena.id } },
        });

        const userCount = await prisma.post.findMany({
          where: { arenaId: arena.id },
          select: { userId: true },
          distinct: ['userId'],
        });

        await prisma.arena.update({
          where: { id: arena.id },
          data: {
            totalPosts: postCount,
            totalComments: commentCount,
            dailyActiveUsers: userCount.length,
          },
        });

        totalPosts += postCount;
        totalComments += commentCount;

        console.log(
          `  ✓ ${postsCount} posts, ${commentsCount} comentarios (${errorCount} erros)`
        );
      } catch (e: any) {
        console.log(`  ✗ Erro ao atualizar contadores: ${e.message}`);
      }
    }

    console.log(`\n✅ COMPLETO! ${totalPosts} posts totais`);
  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
