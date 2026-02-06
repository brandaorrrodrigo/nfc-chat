/**
 * ═══════════════════════════════════════════════════════════════
 * DIAGNÓSTICO TOTAL DO SISTEMA DE CONTADORES
 * ═══════════════════════════════════════════════════════════════
 *
 * Mapeia TODAS as inconsistências entre:
 * - Contadores armazenados (Arena.total_posts, etc)
 * - Dados reais (count de Posts/Threads)
 *
 * Gera:
 * - diagnostic-report.json (dados técnicos)
 * - conversas-backup.txt (backup legível)
 * - Recomendação de ação (reset vs correção)
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface DiagnosticReport {
  timestamp: string;
  arenas: ArenaReport[];
  inconsistencies: Inconsistency[];
  summary: Summary;
}

interface ArenaReport {
  arena_id: string;
  arena_name: string;
  arena_slug: string;

  // Contadores no banco Arena
  db_total_posts: number;
  db_total_comments: number;
  db_daily_active_users: number;

  // Contadores REAIS
  real_posts_count: number;
  real_comments_count: number;
  real_unique_users: number;

  // Diferenças
  posts_diff: number;
  comments_diff: number;
  users_diff: number;

  // Status
  has_inconsistency: boolean;

  // Posts detalhados
  posts: PostReport[];
}

interface PostReport {
  post_id: string;
  author_name: string;
  content_preview: string;
  db_comment_count: number;
  real_comment_count: number;
  comment_diff: number;
  created_at: string;
  comments: CommentSummary[];
}

interface CommentSummary {
  comment_id: string;
  author_name: string;
  content_preview: string;
  created_at: string;
}

interface Inconsistency {
  type: 'arena_posts' | 'arena_comments' | 'arena_users' | 'post_comments' | 'zero_content';
  severity: 'critical' | 'high' | 'medium' | 'low';
  arena: string;
  post?: string;
  expected: number;
  actual: number;
  diff: number;
  description: string;
}

interface Summary {
  total_arenas: number;
  arenas_with_issues: number;
  total_posts: number;
  posts_with_issues: number;
  total_comments: number;
  critical_issues: number;
  high_issues: number;
  medium_issues: number;
  low_issues: number;
}

async function main() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DO SISTEMA DE CONTADORES\n');
  console.log('Analisando banco de dados...\n');

  const report: DiagnosticReport = {
    timestamp: new Date().toISOString(),
    arenas: [],
    inconsistencies: [],
    summary: {
      total_arenas: 0,
      arenas_with_issues: 0,
      total_posts: 0,
      posts_with_issues: 0,
      total_comments: 0,
      critical_issues: 0,
      high_issues: 0,
      medium_issues: 0,
      low_issues: 0
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // BUSCAR TODAS AS ARENAS
  // ═══════════════════════════════════════════════════════════════

  const arenas = await prisma.arena.findMany({
    include: {
      posts: {
        where: {
          isDeleted: false
        },
        include: {
          comments: {
            where: {
              isDeleted: false
            },
            include: {
              user: {
                select: {
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          },
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  report.summary.total_arenas = arenas.length;

  console.log(`📊 Encontradas ${arenas.length} arenas\n`);

  // ═══════════════════════════════════════════════════════════════
  // ANALISAR CADA ARENA
  // ═══════════════════════════════════════════════════════════════

  for (const arena of arenas) {
    console.log(`\n🏟️  Analisando: ${arena.name}`);
    console.log('─'.repeat(60));

    // Contadores do banco
    const dbPosts = arena.totalPosts;
    const dbComments = arena.totalComments;
    const dbUsers = arena.dailyActiveUsers;

    // Contadores REAIS
    const realPosts = arena.posts.length;
    const realComments = arena.posts.reduce((sum, p) => sum + p.comments.length, 0);

    // Usuários únicos (apenas humanos)
    const uniqueUserIds = new Set(
      arena.posts
        .filter(p => p.userId)
        .map(p => p.userId)
    );
    const realUsers = uniqueUserIds.size;

    // Calcular diferenças
    const postsDiff = dbPosts - realPosts;
    const commentsDiff = dbComments - realComments;
    const usersDiff = dbUsers - realUsers;

    const hasIssue = postsDiff !== 0 || commentsDiff !== 0 || usersDiff !== 0;

    if (hasIssue) {
      report.summary.arenas_with_issues++;
    }

    // Log visual
    console.log(`\n📈 CONTADORES:`);
    console.log(`   Posts:       DB=${dbPosts.toString().padStart(5)} | Real=${realPosts.toString().padStart(5)} | Diff=${postsDiff > 0 ? '+' : ''}${postsDiff}`);
    console.log(`   Comentários: DB=${dbComments.toString().padStart(5)} | Real=${realComments.toString().padStart(5)} | Diff=${commentsDiff > 0 ? '+' : ''}${commentsDiff}`);
    console.log(`   Usuários:    DB=${dbUsers.toString().padStart(5)} | Real=${realUsers.toString().padStart(5)} | Diff=${usersDiff > 0 ? '+' : ''}${usersDiff}`);

    // Registrar inconsistências - Arena Posts
    if (postsDiff !== 0) {
      const inconsistency: Inconsistency = {
        type: 'arena_posts',
        severity: Math.abs(postsDiff) > 100 ? 'critical' : Math.abs(postsDiff) > 20 ? 'high' : 'medium',
        arena: arena.name,
        expected: realPosts,
        actual: dbPosts,
        diff: postsDiff,
        description: `Arena mostra ${dbPosts} posts mas tem ${realPosts} reais`
      };
      report.inconsistencies.push(inconsistency);

      if (inconsistency.severity === 'critical') report.summary.critical_issues++;
      else if (inconsistency.severity === 'high') report.summary.high_issues++;
      else report.summary.medium_issues++;
    }

    // Registrar inconsistências - Arena Comments
    if (commentsDiff !== 0) {
      const inconsistency: Inconsistency = {
        type: 'arena_comments',
        severity: Math.abs(commentsDiff) > 200 ? 'critical' : Math.abs(commentsDiff) > 50 ? 'high' : 'medium',
        arena: arena.name,
        expected: realComments,
        actual: dbComments,
        diff: commentsDiff,
        description: `Arena mostra ${dbComments} comentários mas tem ${realComments} reais`
      };
      report.inconsistencies.push(inconsistency);

      if (inconsistency.severity === 'critical') report.summary.critical_issues++;
      else if (inconsistency.severity === 'high') report.summary.high_issues++;
      else report.summary.medium_issues++;
    }

    // Registrar inconsistências - Arena Users
    if (usersDiff !== 0) {
      const inconsistency: Inconsistency = {
        type: 'arena_users',
        severity: Math.abs(usersDiff) > 50 ? 'critical' : Math.abs(usersDiff) > 10 ? 'high' : 'medium',
        arena: arena.name,
        expected: realUsers,
        actual: dbUsers,
        diff: usersDiff,
        description: `Arena mostra ${dbUsers} usuários mas tem ${realUsers} únicos`
      };
      report.inconsistencies.push(inconsistency);

      if (inconsistency.severity === 'critical') report.summary.critical_issues++;
      else if (inconsistency.severity === 'high') report.summary.high_issues++;
      else report.summary.medium_issues++;
    }

    // Arenas vazias com contadores não-zero
    if (realPosts === 0 && realComments === 0) {
      if (dbPosts > 0 || dbComments > 0) {
        const inconsistency: Inconsistency = {
          type: 'zero_content',
          severity: 'critical',
          arena: arena.name,
          expected: 0,
          actual: dbPosts + dbComments,
          diff: dbPosts + dbComments,
          description: `Arena VAZIA mas mostra ${dbPosts} posts e ${dbComments} comentários`
        };
        report.inconsistencies.push(inconsistency);
        report.summary.critical_issues++;
      }
    }

    // Analisar posts individuais
    const postsReport: PostReport[] = [];

    for (const post of arena.posts) {
      const dbPostComments = post.commentCount;
      const realPostComments = post.comments.length;
      const commentDiff = dbPostComments - realPostComments;

      report.summary.total_posts++;

      if (commentDiff !== 0) {
        report.summary.posts_with_issues++;

        const inconsistency: Inconsistency = {
          type: 'post_comments',
          severity: Math.abs(commentDiff) > 10 ? 'high' : 'medium',
          arena: arena.name,
          post: post.content.substring(0, 50) + '...',
          expected: realPostComments,
          actual: dbPostComments,
          diff: commentDiff,
          description: `Post mostra ${dbPostComments} comentários mas tem ${realPostComments}`
        };
        report.inconsistencies.push(inconsistency);

        if (inconsistency.severity === 'high') report.summary.high_issues++;
        else report.summary.medium_issues++;
      }

      postsReport.push({
        post_id: post.id,
        author_name: post.user?.name || 'Desconhecido',
        content_preview: post.content.substring(0, 150),
        db_comment_count: dbPostComments,
        real_comment_count: realPostComments,
        comment_diff: commentDiff,
        created_at: post.createdAt.toISOString(),
        comments: post.comments.map(c => ({
          comment_id: c.id,
          author_name: c.user?.name || 'Desconhecido',
          content_preview: c.content.substring(0, 100),
          created_at: c.createdAt.toISOString()
        }))
      });
    }

    report.summary.total_comments += realComments;

    // Adicionar ao report
    report.arenas.push({
      arena_id: arena.id,
      arena_name: arena.name,
      arena_slug: arena.slug,
      db_total_posts: dbPosts,
      db_total_comments: dbComments,
      db_daily_active_users: dbUsers,
      real_posts_count: realPosts,
      real_comments_count: realComments,
      real_unique_users: realUsers,
      posts_diff: postsDiff,
      comments_diff: commentsDiff,
      users_diff: usersDiff,
      has_inconsistency: hasIssue,
      posts: postsReport
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // GERAR RELATÓRIO EM JSON
  // ═══════════════════════════════════════════════════════════════

  const reportPath = path.join(__dirname, '../diagnostic-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n\n' + '═'.repeat(60));
  console.log('📊 RESUMO EXECUTIVO');
  console.log('═'.repeat(60));
  console.log(`\n✅ Total de arenas: ${report.summary.total_arenas}`);
  console.log(`❌ Arenas com problemas: ${report.summary.arenas_with_issues}`);
  console.log(`\n📝 Total de posts reais: ${report.summary.total_posts}`);
  console.log(`❌ Posts com problemas: ${report.summary.posts_with_issues}`);
  console.log(`\n💬 Total de comentários reais: ${report.summary.total_comments}`);
  console.log(`\n🚨 PROBLEMAS ENCONTRADOS:`);
  console.log(`   🔴 Críticos: ${report.summary.critical_issues}`);
  console.log(`   🟠 Altos: ${report.summary.high_issues}`);
  console.log(`   🟡 Médios: ${report.summary.medium_issues}`);
  console.log(`   🟢 Baixos: ${report.summary.low_issues}`);

  console.log(`\n💾 Relatório completo salvo em: ${reportPath}`);

  // ═══════════════════════════════════════════════════════════════
  // GERAR BACKUP LEGÍVEL (TXT)
  // ═══════════════════════════════════════════════════════════════

  console.log('\n📦 Gerando backup legível das conversas...');

  let backupContent = '';
  backupContent += '═'.repeat(80) + '\n';
  backupContent += 'BACKUP COMPLETO DAS ARENAS E CONVERSAS\n';
  backupContent += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
  backupContent += '═'.repeat(80) + '\n\n';

  for (const arenaReport of report.arenas) {
    backupContent += '\n' + '█'.repeat(80) + '\n';
    backupContent += `ARENA: ${arenaReport.arena_name}\n`;
    backupContent += `Slug: ${arenaReport.arena_slug}\n`;
    backupContent += `ID: ${arenaReport.arena_id}\n`;
    backupContent += '█'.repeat(80) + '\n\n';

    backupContent += `📊 ESTATÍSTICAS:\n`;
    backupContent += `   Posts: ${arenaReport.real_posts_count}\n`;
    backupContent += `   Comentários: ${arenaReport.real_comments_count}\n`;
    backupContent += `   Membros únicos: ${arenaReport.real_unique_users}\n\n`;

    if (arenaReport.posts.length === 0) {
      backupContent += '   ⚠️  Arena sem posts\n\n';
      continue;
    }

    for (let i = 0; i < arenaReport.posts.length; i++) {
      const post = arenaReport.posts[i];
      backupContent += '─'.repeat(80) + '\n';
      backupContent += `📌 POST #${i + 1}\n`;
      backupContent += `   Autor: ${post.author_name}\n`;
      backupContent += `   Data: ${new Date(post.created_at).toLocaleString('pt-BR')}\n`;
      backupContent += `   ID: ${post.post_id}\n`;
      backupContent += `   Comentários: ${post.real_comment_count}\n`;
      backupContent += '─'.repeat(80) + '\n';
      backupContent += post.content_preview + (post.content_preview.length === 150 ? '...' : '') + '\n\n';

      if (post.comments.length > 0) {
        backupContent += '   💬 COMENTÁRIOS:\n\n';
        for (let j = 0; j < post.comments.length; j++) {
          const comment = post.comments[j];
          backupContent += `   ┌─ Comentário #${j + 1} ────────────────────────────────\n`;
          backupContent += `   │ Autor: ${comment.author_name}\n`;
          backupContent += `   │ Data: ${new Date(comment.created_at).toLocaleString('pt-BR')}\n`;
          backupContent += `   ├─────────────────────────────────────────────────────\n`;
          backupContent += `   │ ${comment.content_preview}${comment.content_preview.length === 100 ? '...' : ''}\n`;
          backupContent += `   └─────────────────────────────────────────────────────\n\n`;
        }
      }
    }
  }

  const backupPath = path.join(__dirname, '../conversas-backup.txt');
  fs.writeFileSync(backupPath, backupContent, 'utf-8');

  console.log(`✅ Backup legível salvo em: ${backupPath}`);

  // ═══════════════════════════════════════════════════════════════
  // RECOMENDAÇÃO
  // ═══════════════════════════════════════════════════════════════

  console.log('\n\n' + '═'.repeat(60));
  console.log('💡 RECOMENDAÇÃO');
  console.log('═'.repeat(60));

  const totalIssues = report.summary.critical_issues + report.summary.high_issues + report.summary.medium_issues;

  if (totalIssues > 10) {
    console.log('\n🔴 SISTEMA ALTAMENTE COMPROMETIDO\n');
    console.log('Recomendação: RESET COMPLETO + SEED COM CONVERSAS REAIS');
    console.log('\nPróximos passos:');
    console.log('1. Revisar backup em conversas-backup.txt');
    console.log('2. Preservar conversas importantes');
    console.log('3. Executar script de seed com 30-40 conversas por arena');
    console.log('4. Popular com IA intermediando');
  } else if (totalIssues > 0) {
    console.log('\n🟡 PROBLEMAS DETECTADOS\n');
    console.log('Recomendação: Correção de contadores + Seed complementar');
    console.log('\nPróximos passos:');
    console.log('1. Executar CORRIGIR_CONTADORES_FALSOS.sql');
    console.log('2. Popular arenas vazias com seed');
    console.log('3. Validar correções');
  } else {
    console.log('\n✅ SISTEMA ÍNTEGRO\n');
    console.log('Nenhuma inconsistência detectada!');
    console.log('\nPróximos passos:');
    console.log('1. Popular arenas vazias com conversas');
    console.log('2. Manter sistema em produção');
  }

  console.log('\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
