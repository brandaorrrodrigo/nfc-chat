/**
 * ═══════════════════════════════════════════════════════════════
 * DIAGNÓSTICO VISUAL COMPLETO DO SISTEMA DE COMUNIDADE
 * ═══════════════════════════════════════════════════════════════
 *
 * NÃO MODIFICA NADA - Apenas ANALISA e REPORTA
 *
 * Gera:
 * - Relatório visual de 8 passos no console
 * - diagnostic-report.json (dados técnicos)
 * - conversas-backup.txt (backup legível)
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

interface ArenaAnalysis {
  id: string;
  name: string;
  slug: string;

  // Banco de dados
  db_posts: number;
  db_comments: number;
  db_members: number;

  // Realidade
  real_posts: number;
  real_comments: number;
  real_members: number;

  // Diferenças
  posts_diff: number;
  comments_diff: number;
  members_diff: number;

  // Status
  status: 'critical' | 'high' | 'medium' | 'ok';
  issues: string[];

  // Posts detalhados
  posts: {
    id: string;
    author_name: string;
    content: string;
    db_comment_count: number;
    real_comment_count: number;
    comment_diff: number;
    created_at: Date;
    comments: {
      id: string;
      author_name: string;
      content: string;
      created_at: Date;
    }[];
  }[];
}

async function main() {
  console.clear();

  printHeader();

  // Buscar todas as arenas com dados completos
  console.log('⏳ Buscando dados do banco...\n');

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

  console.log(`✅ ${arenas.length} arenas carregadas\n`);

  // Analisar cada arena
  const analyses: ArenaAnalysis[] = [];

  for (const arena of arenas) {
    const analysis = await analyzeArena(arena);
    analyses.push(analysis);
  }

  // ═══════════════════════════════════════════════════════════════
  // PASSO 1: VISÃO GERAL
  // ═══════════════════════════════════════════════════════════════

  printStep1(analyses);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 2: RESUMO EXECUTIVO
  // ═══════════════════════════════════════════════════════════════

  const summary = calculateSummary(analyses);
  printStep2(summary);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 3: PROBLEMAS CRÍTICOS
  // ═══════════════════════════════════════════════════════════════

  const critical = analyses.filter(a => a.status === 'critical');
  printStep3(critical);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 4: PROBLEMAS ALTOS
  // ═══════════════════════════════════════════════════════════════

  const high = analyses.filter(a => a.status === 'high');
  printStep4(high);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 5: BACKUP DE CONVERSAS REAIS
  // ═══════════════════════════════════════════════════════════════

  const backupPath = await generateBackup(analyses);
  printStep5(analyses, backupPath);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 6: TOP 10 ARENAS
  // ═══════════════════════════════════════════════════════════════

  const top10 = analyses
    .filter(a => a.real_posts > 0)
    .sort((a, b) => b.real_posts - a.real_posts)
    .slice(0, 10);
  printStep6(top10);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 7: EXEMPLO DE CONTEÚDO REAL
  // ═══════════════════════════════════════════════════════════════

  const mostActive = top10[0];
  if (mostActive) {
    printStep7(mostActive);
  }

  // ═══════════════════════════════════════════════════════════════
  // PASSO 8: RECOMENDAÇÃO
  // ═══════════════════════════════════════════════════════════════

  printStep8(summary, analyses);

  // Salvar relatório JSON
  const reportPath = path.join(__dirname, '../diagnostic-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ analyses, summary }, null, 2));

  console.log(`\n📄 Relatório JSON salvo em: ${reportPath}\n`);
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE ANÁLISE
// ═══════════════════════════════════════════════════════════════

async function analyzeArena(arena: any): Promise<ArenaAnalysis> {
  const dbPosts = arena.totalPosts;
  const dbComments = arena.totalComments;
  const dbMembers = arena.dailyActiveUsers;

  const realPosts = arena.posts.length;
  const realComments = arena.posts.reduce((sum: number, p: any) => sum + p.comments.length, 0);

  // Membros únicos (apenas humanos)
  const uniqueUsers = new Set(
    arena.posts
      .filter((p: any) => p.userId)
      .map((p: any) => p.userId)
  );
  const realMembers = uniqueUsers.size;

  const postsDiff = dbPosts - realPosts;
  const commentsDiff = dbComments - realComments;
  const membersDiff = dbMembers - realMembers;

  // Determinar status
  const issues: string[] = [];
  let status: 'critical' | 'high' | 'medium' | 'ok' = 'ok';

  // Crítico: arena vazia mas mostra números
  if (realPosts === 0 && dbPosts > 0) {
    status = 'critical';
    issues.push(`Arena VAZIA mas mostra ${dbPosts} posts`);
  }
  // Crítico: diferença enorme
  else if (Math.abs(postsDiff) > 100 || Math.abs(commentsDiff) > 200) {
    status = 'critical';
    if (Math.abs(postsDiff) > 100) {
      issues.push(`Diferença de ${Math.abs(postsDiff)} posts`);
    }
    if (Math.abs(commentsDiff) > 200) {
      issues.push(`Diferença de ${Math.abs(commentsDiff)} comentários`);
    }
  }
  // Alto: diferença moderada
  else if (Math.abs(postsDiff) > 20 || Math.abs(commentsDiff) > 50) {
    status = 'high';
    if (Math.abs(postsDiff) > 20) {
      issues.push(`Diferença de ${Math.abs(postsDiff)} posts`);
    }
    if (Math.abs(commentsDiff) > 50) {
      issues.push(`Diferença de ${Math.abs(commentsDiff)} comentários`);
    }
  }
  // Médio: qualquer diferença
  else if (postsDiff !== 0 || commentsDiff !== 0 || membersDiff !== 0) {
    status = 'medium';
    if (postsDiff !== 0) issues.push(`${Math.abs(postsDiff)} posts de diferença`);
    if (commentsDiff !== 0) issues.push(`${Math.abs(commentsDiff)} comentários de diferença`);
    if (membersDiff !== 0) issues.push(`${Math.abs(membersDiff)} membros de diferença`);
  }

  // Analisar posts
  const postsAnalysis = arena.posts.map((post: any) => {
    const dbPostComments = post.commentCount;
    const realPostComments = post.comments.length;

    return {
      id: post.id,
      author_name: post.user?.name || 'Desconhecido',
      content: post.content,
      db_comment_count: dbPostComments,
      real_comment_count: realPostComments,
      comment_diff: dbPostComments - realPostComments,
      created_at: post.createdAt,
      comments: post.comments.map((c: any) => ({
        id: c.id,
        author_name: c.user?.name || 'Desconhecido',
        content: c.content,
        created_at: c.createdAt
      }))
    };
  });

  return {
    id: arena.id,
    name: arena.name,
    slug: arena.slug,
    db_posts: dbPosts,
    db_comments: dbComments,
    db_members: dbMembers,
    real_posts: realPosts,
    real_comments: realComments,
    real_members: realMembers,
    posts_diff: postsDiff,
    comments_diff: commentsDiff,
    members_diff: membersDiff,
    status,
    issues,
    posts: postsAnalysis
  };
}

function calculateSummary(analyses: ArenaAnalysis[]) {
  const critical = analyses.filter(a => a.status === 'critical').length;
  const high = analyses.filter(a => a.status === 'high').length;
  const medium = analyses.filter(a => a.status === 'medium').length;
  const ok = analyses.filter(a => a.status === 'ok').length;

  const totalRealPosts = analyses.reduce((sum, a) => sum + a.real_posts, 0);
  const totalRealComments = analyses.reduce((sum, a) => sum + a.real_comments, 0);
  const totalRealMembers = analyses.reduce((sum, a) => sum + a.real_members, 0);

  const totalDbPosts = analyses.reduce((sum, a) => sum + a.db_posts, 0);
  const totalDbComments = analyses.reduce((sum, a) => sum + a.db_comments, 0);
  const totalDbMembers = analyses.reduce((sum, a) => sum + a.db_members, 0);

  return {
    total_arenas: analyses.length,
    critical,
    high,
    medium,
    ok,
    total_real_posts: totalRealPosts,
    total_real_comments: totalRealComments,
    total_real_members: totalRealMembers,
    total_db_posts: totalDbPosts,
    total_db_comments: totalDbComments,
    total_db_members: totalDbMembers,
    posts_diff: totalDbPosts - totalRealPosts,
    comments_diff: totalDbComments - totalRealComments,
    members_diff: totalDbMembers - totalRealMembers
  };
}

async function generateBackup(analyses: ArenaAnalysis[]): Promise<string> {
  let backup = '';

  backup += '═'.repeat(80) + '\n';
  backup += 'BACKUP COMPLETO DAS CONVERSAS REAIS\n';
  backup += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
  backup += '═'.repeat(80) + '\n\n';

  for (const arena of analyses) {
    if (arena.real_posts === 0) continue;

    backup += '\n' + '█'.repeat(80) + '\n';
    backup += `ARENA: ${arena.name}\n`;
    backup += `Slug: ${arena.slug}\n`;
    backup += `Posts reais: ${arena.real_posts}\n`;
    backup += `Comentários reais: ${arena.real_comments}\n`;
    backup += '█'.repeat(80) + '\n\n';

    for (let i = 0; i < arena.posts.length; i++) {
      const post = arena.posts[i];

      backup += '─'.repeat(80) + '\n';
      backup += `POST #${i + 1}\n`;
      backup += `Autor: ${post.author_name}\n`;
      backup += `Data: ${post.created_at.toLocaleString('pt-BR')}\n`;
      backup += `Comentários: ${post.real_comment_count}\n`;
      backup += '─'.repeat(80) + '\n';
      backup += post.content + '\n\n';

      if (post.comments.length > 0) {
        backup += '💬 COMENTÁRIOS:\n\n';
        for (let j = 0; j < post.comments.length; j++) {
          const comment = post.comments[j];
          backup += `  ${j + 1}. ${comment.author_name} (${comment.created_at.toLocaleString('pt-BR')})\n`;
          backup += `     ${comment.content}\n\n`;
        }
      }
    }
  }

  const backupPath = path.join(__dirname, '../conversas-backup.txt');
  fs.writeFileSync(backupPath, backup, 'utf-8');

  return backupPath;
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE IMPRESSÃO
// ═══════════════════════════════════════════════════════════════

function printHeader() {
  console.log('\n' + '═'.repeat(80));
  console.log('🔍 DIAGNÓSTICO COMPLETO DO SISTEMA DE COMUNIDADE');
  console.log('═'.repeat(80) + '\n');
}

function printStep1(analyses: ArenaAnalysis[]) {
  console.log('📋 PASSO 1: VISÃO GERAL DAS ARENAS\n');
  console.log('─'.repeat(80));

  for (const arena of analyses) {
    let statusIcon = '';
    let statusText = '';

    switch (arena.status) {
      case 'critical':
        statusIcon = '🔴';
        statusText = 'CRÍTICO';
        break;
      case 'high':
        statusIcon = '🟠';
        statusText = 'ALTO';
        break;
      case 'medium':
        statusIcon = '🟡';
        statusText = 'MÉDIO';
        break;
      case 'ok':
        statusIcon = '✅';
        statusText = 'OK';
        break;
    }

    console.log(`${statusIcon} ${arena.name.padEnd(40)} [${statusText}]`);
    console.log(`   BD: ${arena.db_posts} posts | Real: ${arena.real_posts} posts | Diff: ${arena.posts_diff > 0 ? '+' : ''}${arena.posts_diff}`);

    if (arena.issues.length > 0) {
      arena.issues.forEach(issue => {
        console.log(`   ⚠️  ${issue}`);
      });
    }

    console.log('');
  }

  console.log('─'.repeat(80) + '\n\n');
}

function printStep2(summary: any) {
  console.log('📊 PASSO 2: RESUMO EXECUTIVO\n');
  console.log('─'.repeat(80));

  console.log(`\n🏟️  ARENAS:`);
  console.log(`   Total: ${summary.total_arenas}`);
  console.log(`   🔴 Críticas: ${summary.critical}`);
  console.log(`   🟠 Altas: ${summary.high}`);
  console.log(`   🟡 Médias: ${summary.medium}`);
  console.log(`   ✅ Corretas: ${summary.ok}`);

  console.log(`\n💬 POSTS:`);
  console.log(`   No banco: ${summary.total_db_posts}`);
  console.log(`   Reais: ${summary.total_real_posts}`);
  console.log(`   Diferença: ${summary.posts_diff > 0 ? '+' : ''}${summary.posts_diff} (${summary.posts_diff > 0 ? 'inflado' : summary.posts_diff < 0 ? 'deflado' : 'correto'})`);

  console.log(`\n💭 COMENTÁRIOS:`);
  console.log(`   No banco: ${summary.total_db_comments}`);
  console.log(`   Reais: ${summary.total_real_comments}`);
  console.log(`   Diferença: ${summary.comments_diff > 0 ? '+' : ''}${summary.comments_diff}`);

  console.log(`\n👥 MEMBROS ÚNICOS:`);
  console.log(`   No banco: ${summary.total_db_members}`);
  console.log(`   Reais: ${summary.total_real_members}`);
  console.log(`   Diferença: ${summary.members_diff > 0 ? '+' : ''}${summary.members_diff}`);

  console.log('\n' + '─'.repeat(80) + '\n\n');
}

function printStep3(critical: ArenaAnalysis[]) {
  console.log('🔴 PASSO 3: PROBLEMAS CRÍTICOS\n');
  console.log('─'.repeat(80));

  if (critical.length === 0) {
    console.log('\n✅ Nenhum problema crítico encontrado!\n');
  } else {
    console.log(`\n⚠️  ${critical.length} arena(s) com problemas CRÍTICOS:\n`);

    for (const arena of critical) {
      console.log(`📍 ${arena.name}`);
      console.log(`   BD mostra: ${arena.db_posts} posts`);
      console.log(`   Realidade: ${arena.real_posts} posts`);
      console.log(`   Diferença: ${Math.abs(arena.posts_diff)} posts ${arena.posts_diff > 0 ? 'a mais no BD' : 'a menos no BD'}`);

      arena.issues.forEach(issue => {
        console.log(`   ❌ ${issue}`);
      });

      console.log('');
    }
  }

  console.log('─'.repeat(80) + '\n\n');
}

function printStep4(high: ArenaAnalysis[]) {
  console.log('🟠 PASSO 4: PROBLEMAS ALTOS\n');
  console.log('─'.repeat(80));

  if (high.length === 0) {
    console.log('\n✅ Nenhum problema alto encontrado!\n');
  } else {
    console.log(`\n⚠️  ${high.length} arena(s) com problemas ALTOS:\n`);

    for (const arena of high) {
      console.log(`📍 ${arena.name}`);
      console.log(`   BD: ${arena.db_posts} posts | Real: ${arena.real_posts} posts | Diff: ${arena.posts_diff > 0 ? '+' : ''}${arena.posts_diff}`);

      // Mostrar posts com problemas nos comentários
      const problemPosts = arena.posts.filter(p => p.comment_diff !== 0);
      if (problemPosts.length > 0 && problemPosts.length <= 5) {
        console.log(`   Posts com contadores errados:`);
        problemPosts.forEach(p => {
          const preview = p.content.substring(0, 50).replace(/\n/g, ' ');
          console.log(`     - "${preview}...": BD=${p.db_comment_count} | Real=${p.real_comment_count}`);
        });
      } else if (problemPosts.length > 5) {
        console.log(`   ${problemPosts.length} posts com contadores de comentários errados`);
      }

      console.log('');
    }
  }

  console.log('─'.repeat(80) + '\n\n');
}

function printStep5(analyses: ArenaAnalysis[], backupPath: string) {
  console.log('💾 PASSO 5: BACKUP DE CONVERSAS REAIS\n');
  console.log('─'.repeat(80));

  const arenasWithContent = analyses.filter(a => a.real_posts > 0);

  console.log(`\n✅ Backup salvo em: ${backupPath}`);
  console.log(`\n📊 Resumo do backup:`);
  console.log(`   Arenas com conteúdo: ${arenasWithContent.length}`);
  console.log(`   Total de posts salvos: ${analyses.reduce((sum, a) => sum + a.real_posts, 0)}`);
  console.log(`   Total de comentários salvos: ${analyses.reduce((sum, a) => sum + a.real_comments, 0)}`);

  console.log(`\n📋 Arenas incluídas no backup:\n`);

  for (const arena of arenasWithContent) {
    console.log(`   ✓ ${arena.name}: ${arena.real_posts} posts, ${arena.real_comments} comentários`);
  }

  console.log('\n' + '─'.repeat(80) + '\n\n');
}

function printStep6(top10: ArenaAnalysis[]) {
  console.log('🏆 PASSO 6: TOP 10 ARENAS COM MAIS CONTEÚDO\n');
  console.log('─'.repeat(80) + '\n');

  if (top10.length === 0) {
    console.log('⚠️  Nenhuma arena com conteúdo encontrada!\n');
  } else {
    for (let i = 0; i < top10.length; i++) {
      const arena = top10[i];
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;

      console.log(`${medal} ${arena.name}`);
      console.log(`   Posts: ${arena.real_posts} | Comentários: ${arena.real_comments} | Membros: ${arena.real_members}`);
      console.log('');
    }
  }

  console.log('─'.repeat(80) + '\n\n');
}

function printStep7(arena: ArenaAnalysis) {
  console.log('📝 PASSO 7: EXEMPLO DE CONTEÚDO REAL\n');
  console.log('─'.repeat(80));

  console.log(`\nArena mais ativa: ${arena.name}\n`);

  if (arena.posts.length === 0) {
    console.log('⚠️  Nenhum post encontrado.\n');
    console.log('─'.repeat(80) + '\n\n');
    return;
  }

  // Mostrar primeiros 3 posts
  const postsToShow = arena.posts.slice(0, 3);

  for (let i = 0; i < postsToShow.length; i++) {
    const post = postsToShow[i];

    console.log(`📝 ${post.author_name} (${post.created_at.toLocaleString('pt-BR')}):`);
    console.log(`${'-'.repeat(60)}`);

    const preview = post.content.length > 200
      ? post.content.substring(0, 200) + '...'
      : post.content;

    console.log(preview);

    if (post.comments.length > 0) {
      console.log(`\n💬 ${post.comments.length} comentário(s)`);
    }

    console.log('');
  }

  if (arena.posts.length > 3) {
    console.log(`... e mais ${arena.posts.length - 3} posts.\n`);
  }

  console.log('─'.repeat(80) + '\n\n');
}

function printStep8(summary: any, analyses: ArenaAnalysis[]) {
  console.log('💡 PASSO 8: RECOMENDAÇÃO\n');
  console.log('═'.repeat(80));

  const totalIssues = summary.critical + summary.high + summary.medium;
  const hasContent = summary.total_real_posts > 0;

  console.log('\n📊 ANÁLISE:\n');
  console.log(`   Problemas encontrados: ${totalIssues}`);
  console.log(`   Conteúdo real existente: ${hasContent ? 'SIM' : 'NÃO'}`);
  console.log(`   Posts reais: ${summary.total_real_posts}`);
  console.log(`   Comentários reais: ${summary.total_real_comments}`);

  console.log('\n🎯 RECOMENDAÇÃO:\n');

  if (summary.critical >= 3 || totalIssues >= 10) {
    console.log('   🔴 SITUAÇÃO CRÍTICA - RESET COMPLETO + SEED\n');
    console.log('   Razão: Muitos problemas graves detectados.');
    console.log('   Ação sugerida:');
    console.log('   1. Backup feito ✅ (conversas-backup.txt)');
    console.log('   2. Resetar contadores de TODAS as arenas');
    console.log('   3. Popular arenas vazias com 30-40 conversas');
    console.log('   4. IA intermediando e facilitando');
    console.log('\n   ⚠️  Dados reais preservados no backup.');
  } else if (totalIssues > 0) {
    console.log('   🟡 PROBLEMAS DETECTADOS - CORREÇÃO + SEED\n');
    console.log('   Razão: Problemas encontrados mas recuperável.');
    console.log('   Ação sugerida:');
    console.log('   1. Executar CORRIGIR_CONTADORES_FALSOS.sql');
    console.log('   2. Popular arenas vazias com conversas');
    console.log('   3. Validar correções');
  } else {
    console.log('   ✅ SISTEMA ÍNTEGRO - APENAS SEED\n');
    console.log('   Ação sugerida:');
    console.log('   1. Popular arenas vazias com 30-40 conversas');
    console.log('   2. IA intermediando discussões');
  }

  console.log('\n' + '═'.repeat(80));

  console.log('\n\n📌 PRÓXIMOS PASSOS - ME ENVIE ESTAS 3 INFORMAÇÕES:\n');
  console.log('1. RESUMO EXECUTIVO (Passo 2):');
  console.log(`   - Total de arenas: ${summary.total_arenas}`);
  console.log(`   - Posts no BD: ${summary.total_db_posts}`);
  console.log(`   - Posts reais: ${summary.total_real_posts}`);
  console.log(`   - Diferença: ${summary.posts_diff}`);

  console.log('\n2. RECOMENDAÇÃO (Passo 8):');
  if (summary.critical >= 3 || totalIssues >= 10) {
    console.log('   - RESET COMPLETO + SEED');
  } else if (totalIssues > 0) {
    console.log('   - CORREÇÃO + SEED');
  } else {
    console.log('   - APENAS SEED');
  }

  console.log('\n3. CATEGORIAS:');
  console.log(`   - 🔴 Críticas: ${summary.critical}`);
  console.log(`   - 🟠 Altas: ${summary.high}`);
  console.log(`   - 🟡 Médias: ${summary.medium}`);
  console.log(`   - ✅ Corretas: ${summary.ok}`);

  console.log('\nCom essas informações, criarei a ETAPA 2 apropriada! 🚀\n');
}

// ═══════════════════════════════════════════════════════════════
// EXECUTAR
// ═══════════════════════════════════════════════════════════════

main()
  .catch((error) => {
    console.error('\n❌ ERRO AO EXECUTAR DIAGNÓSTICO:\n');
    console.error(error);
    console.log('\n💡 ALTERNATIVA: Execute o DIAGNOSTICO_COMPLETO.sql no Supabase Studio\n');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
