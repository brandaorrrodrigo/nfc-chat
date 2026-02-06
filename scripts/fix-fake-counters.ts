/**
 * ═══════════════════════════════════════════════════════════════
 * CORRIGIR CONTADORES FALSOS DAS COMUNIDADES
 * ═══════════════════════════════════════════════════════════════
 *
 * PROBLEMA:
 * - Arenas mostrando "38 comentários" mas totalmente vazias
 * - Contadores desatualizados
 * - Números não batem com realidade
 *
 * SOLUÇÃO:
 * - Recalcula TODOS os contadores baseado em dados reais
 * - Identifica arenas vazias
 * - Corrige discrepâncias
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

interface ArenaReport {
  id: string;
  slug: string;
  name: string;
  stored: {
    posts: number;
    comments: number;
    active: number;
  };
  real: {
    posts: number;
    comments: number;
    users: number;
  };
  diff: {
    posts: number;
    comments: number;
  };
  isEmpty: boolean;
}

async function main() {
  console.log('🔍 DIAGNÓSTICO DE CONTADORES FALSOS\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 1: DIAGNÓSTICO
  // ═══════════════════════════════════════════════════════════════

  const arenas = await prisma.arena.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      totalPosts: true,
      totalComments: true,
      dailyActiveUsers: true,
    },
    orderBy: {
      name: 'asc'
    }
  });

  console.log(`📊 Total de arenas: ${arenas.length}\n`);

  const reports: ArenaReport[] = [];
  let totalDiscrepancies = 0;
  let emptyArenas = 0;

  for (const arena of arenas) {
    // Contar posts REAIS
    const realPosts = await prisma.post.count({
      where: {
        arenaId: arena.id,
        isDeleted: false
      }
    });

    // Contar comentários REAIS
    const realComments = await prisma.comment.count({
      where: {
        post: {
          arenaId: arena.id
        },
        isDeleted: false
      }
    });

    // Contar usuários únicos que postaram
    const uniqueUsers = await prisma.post.findMany({
      where: {
        arenaId: arena.id,
        isDeleted: false
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    const isEmpty = realPosts === 0 && realComments === 0;
    const hasFakeNumbers = (arena.totalPosts > 0 || arena.totalComments > 0) && isEmpty;

    const report: ArenaReport = {
      id: arena.id,
      slug: arena.slug,
      name: arena.name,
      stored: {
        posts: arena.totalPosts,
        comments: arena.totalComments,
        active: arena.dailyActiveUsers
      },
      real: {
        posts: realPosts,
        comments: realComments,
        users: uniqueUsers.length
      },
      diff: {
        posts: arena.totalPosts - realPosts,
        comments: arena.totalComments - realComments
      },
      isEmpty
    };

    reports.push(report);

    // Contar discrepâncias
    if (report.diff.posts !== 0 || report.diff.comments !== 0) {
      totalDiscrepancies++;
    }

    if (isEmpty) {
      emptyArenas++;
    }

    // Mostrar arenas com problemas
    if (hasFakeNumbers) {
      console.log(`🚨 ARENA VAZIA COM NÚMEROS FALSOS:`);
      console.log(`   ${arena.name} (${arena.slug})`);
      console.log(`   Mostra: ${arena.totalPosts} posts, ${arena.totalComments} comentários`);
      console.log(`   Real: VAZIA (0 posts, 0 comentários)\n`);
    } else if (report.diff.posts !== 0 || report.diff.comments !== 0) {
      console.log(`⚠️  DISCREPÂNCIA:`);
      console.log(`   ${arena.name} (${arena.slug})`);
      console.log(`   Posts: ${arena.totalPosts} → ${realPosts} (${report.diff.posts > 0 ? '+' : ''}${report.diff.posts})`);
      console.log(`   Comments: ${arena.totalComments} → ${realComments} (${report.diff.comments > 0 ? '+' : ''}${report.diff.comments})\n`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RESUMO DO DIAGNÓSTICO
  // ═══════════════════════════════════════════════════════════════

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📊 RESUMO DO DIAGNÓSTICO\n');
  console.log(`Total de arenas: ${arenas.length}`);
  console.log(`Arenas vazias: ${emptyArenas}`);
  console.log(`Arenas com discrepâncias: ${totalDiscrepancies}`);
  console.log(`Arenas corretas: ${arenas.length - totalDiscrepancies}\n`);

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 2: CORREÇÃO
  // ═══════════════════════════════════════════════════════════════

  if (totalDiscrepancies === 0) {
    console.log('✅ Todos os contadores estão corretos! Nada a fazer.\n');
    return;
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔧 CORRIGINDO CONTADORES...\n');

  let corrected = 0;

  for (const report of reports) {
    if (report.diff.posts !== 0 || report.diff.comments !== 0) {
      await prisma.arena.update({
        where: { id: report.id },
        data: {
          totalPosts: report.real.posts,
          totalComments: report.real.comments,
          dailyActiveUsers: report.real.users
        }
      });

      console.log(`✓ ${report.name}`);
      if (report.diff.posts !== 0) {
        console.log(`  Posts: ${report.stored.posts} → ${report.real.posts}`);
      }
      if (report.diff.comments !== 0) {
        console.log(`  Comments: ${report.stored.comments} → ${report.real.comments}`);
      }
      console.log();

      corrected++;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 3: CORRIGIR COMENTÁRIOS NOS POSTS
  // ═══════════════════════════════════════════════════════════════

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔧 CORRIGINDO CONTADORES DE COMENTÁRIOS NOS POSTS...\n');

  const posts = await prisma.post.findMany({
    select: {
      id: true,
      commentCount: true,
      content: true
    }
  });

  let postsFixed = 0;

  for (const post of posts) {
    const realCommentCount = await prisma.comment.count({
      where: {
        postId: post.id,
        isDeleted: false
      }
    });

    if (post.commentCount !== realCommentCount) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          commentCount: realCommentCount
        }
      });

      if (post.commentCount !== 0 || realCommentCount !== 0) {
        const preview = post.content.substring(0, 50).replace(/\n/g, ' ');
        console.log(`✓ Post "${preview}..."`);
        console.log(`  Comments: ${post.commentCount} → ${realCommentCount}\n`);
      }

      postsFixed++;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RELATÓRIO FINAL
  // ═══════════════════════════════════════════════════════════════

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✅ CORREÇÃO CONCLUÍDA!\n');
  console.log(`Arenas corrigidas: ${corrected}`);
  console.log(`Posts corrigidos: ${postsFixed}\n`);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 SITUAÇÃO FINAL:\n');

  // Verificar resultado final
  const finalArenas = await prisma.arena.findMany({
    select: {
      name: true,
      slug: true,
      totalPosts: true,
      totalComments: true,
      dailyActiveUsers: true
    },
    orderBy: {
      totalPosts: 'desc'
    }
  });

  for (const arena of finalArenas) {
    if (arena.totalPosts > 0 || arena.totalComments > 0) {
      console.log(`🏟️  ${arena.name}`);
      console.log(`   Posts: ${arena.totalPosts}`);
      console.log(`   Comentários: ${arena.totalComments}`);
      console.log(`   Usuários ativos: ${arena.dailyActiveUsers}\n`);
    }
  }

  const stillEmpty = finalArenas.filter(a => a.totalPosts === 0 && a.totalComments === 0);
  if (stillEmpty.length > 0) {
    console.log(`\n📭 Arenas vazias (${stillEmpty.length}):`);
    stillEmpty.forEach(a => console.log(`   - ${a.name} (${a.slug})`));
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✅ Todos os contadores agora refletem a REALIDADE!\n');
}

main()
  .catch((error) => {
    console.error('❌ Erro:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
