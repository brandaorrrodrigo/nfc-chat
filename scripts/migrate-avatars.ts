/**
 * Script de Migração de Avatares
 *
 * Atribui avatares para todos os posts e comentários existentes
 * que ainda não possuem avatar atribuído.
 *
 * Uso:
 *   npm run avatar:migrate
 */

import { PrismaClient } from '@prisma/client';
import { AvatarService } from '../backend/src/modules/avatars/avatar.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando migração de avatares...\n');

  // Criar instância do service
  const avatarService = new AvatarService();

  // 1. Estatísticas ANTES da migração
  console.log('📊 Estatísticas ANTES da migração:');
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();

  const postsWithoutAvatar = await prisma.post.count({
    where: {
      OR: [
        { avatarId: null },
        { avatarId: '' }
      ]
    }
  });

  const commentsWithoutAvatar = await prisma.comment.count({
    where: {
      OR: [
        { avatarId: null },
        { avatarId: '' }
      ]
    }
  });

  console.log(`  Total de posts: ${totalPosts}`);
  console.log(`  Posts sem avatar: ${postsWithoutAvatar}`);
  console.log(`  Posts com avatar: ${totalPosts - postsWithoutAvatar}`);
  console.log(`\n  Total de comentários: ${totalComments}`);
  console.log(`  Comentários sem avatar: ${commentsWithoutAvatar}`);
  console.log(`  Comentários com avatar: ${totalComments - commentsWithoutAvatar}\n`);

  if (postsWithoutAvatar === 0 && commentsWithoutAvatar === 0) {
    console.log('✅ Todos os posts e comentários já possuem avatar!');
    return;
  }

  // 2. Migrar POSTS
  if (postsWithoutAvatar > 0) {
    console.log('🔄 Migrando posts...');
    const resultPosts = await avatarService.migrateExistingPosts();
    console.log(`✅ Posts migrados: ${resultPosts.migrated}, erros: ${resultPosts.errors}\n`);
  }

  // 3. Migrar COMENTÁRIOS
  if (commentsWithoutAvatar > 0) {
    console.log('🔄 Migrando comentários...');

    const comments = await prisma.comment.findMany({
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
      }
    });

    let migratedComments = 0;
    let errorsComments = 0;

    for (const comment of comments) {
      try {
        const avatar = avatarService.assignRandomAvatar();

        await prisma.comment.update({
          where: { id: comment.id },
          data: {
            avatarId: avatar.id,
            avatarImg: avatar.img,
            avatarInitialsColor: avatar.initials_color
          }
        });

        migratedComments++;

        if (migratedComments % 100 === 0) {
          console.log(`  Migrados ${migratedComments}/${comments.length}`);
        }

      } catch (error) {
        console.error(`  ❌ Erro ao migrar comentário ${comment.id}: ${error.message}`);
        errorsComments++;
      }
    }

    console.log(`✅ Comentários migrados: ${migratedComments}, erros: ${errorsComments}\n`);
  }

  // 4. Estatísticas DEPOIS da migração
  console.log('📊 Estatísticas DEPOIS da migração:');
  const postsWithAvatarAfter = await prisma.post.count({
    where: {
      avatarId: { not: null }
    }
  });

  const commentsWithAvatarAfter = await prisma.comment.count({
    where: {
      avatarId: { not: null }
    }
  });

  console.log(`  Posts com avatar: ${postsWithAvatarAfter}/${totalPosts}`);
  console.log(`  Comentários com avatar: ${commentsWithAvatarAfter}/${totalComments}\n`);

  // 5. Distribuição de avatares (top 10)
  console.log('📈 Distribuição de avatares (top 10):');
  const stats = await avatarService.getAvatarStats();

  stats.slice(0, 10).forEach((s, index) => {
    console.log(`  ${index + 1}. ${s.avatar_id}: ${s.count} posts`);
  });

  console.log('\n✅ Migração completa!');
}

main()
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
