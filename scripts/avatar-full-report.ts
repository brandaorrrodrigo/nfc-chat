/**
 * Relatório Completo do Sistema de Avatares
 * Mostra status de posts, comentários e distribuição geral
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Importar catálogo de avatares
const catalogPath = path.join(__dirname, '../backend/src/modules/avatars/avatar-catalog.json');
const avatarCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                                                                ║');
  console.log('║         RELATÓRIO COMPLETO - SISTEMA DE AVATARES               ║');
  console.log('║                                                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  // ═══════════════════════════════════════════════════════════════
  // DADOS GERAIS
  // ═══════════════════════════════════════════════════════════════

  const users = await prisma.user.count();
  const arenas = await prisma.arena.count();
  const posts = await prisma.post.findMany({
    select: { avatarId: true }
  });
  const comments = await prisma.comment.findMany({
    select: { avatarId: true }
  });

  const totalPosts = posts.length;
  const totalComments = comments.length;
  const totalItems = totalPosts + totalComments;

  const postsWithAvatar = posts.filter(p => p.avatarId).length;
  const commentsWithAvatar = comments.filter(c => c.avatarId).length;
  const itemsWithAvatar = postsWithAvatar + commentsWithAvatar;

  console.log('📊 DADOS GERAIS');
  console.log('─'.repeat(70));
  console.log(`   👥 Usuários cadastrados: ${users}`);
  console.log(`   🏟️  Arenas ativas: ${arenas}`);
  console.log(`   📝 Posts: ${totalPosts}`);
  console.log(`   💬 Comentários: ${totalComments}`);
  console.log(`   📦 Total de itens: ${totalItems}`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // COBERTURA DE AVATARES
  // ═══════════════════════════════════════════════════════════════

  const postsCoverage = totalPosts > 0 ? (postsWithAvatar / totalPosts * 100) : 0;
  const commentsCoverage = totalComments > 0 ? (commentsWithAvatar / totalComments * 100) : 0;
  const totalCoverage = totalItems > 0 ? (itemsWithAvatar / totalItems * 100) : 0;

  console.log('✅ COBERTURA DE AVATARES');
  console.log('─'.repeat(70));
  console.log(`   📝 Posts com avatar: ${postsWithAvatar}/${totalPosts} (${postsCoverage.toFixed(1)}%)`);
  console.log(`   💬 Comentários com avatar: ${commentsWithAvatar}/${totalComments} (${commentsCoverage.toFixed(1)}%)`);
  console.log(`   📦 Cobertura total: ${itemsWithAvatar}/${totalItems} (${totalCoverage.toFixed(1)}%)`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // DISTRIBUIÇÃO DE AVATARES
  // ═══════════════════════════════════════════════════════════════

  const allAvatars = [...posts, ...comments].filter(item => item.avatarId);
  const distribution: Record<string, number> = {};

  allAvatars.forEach(item => {
    const avatarId = item.avatarId!;
    distribution[avatarId] = (distribution[avatarId] || 0) + 1;
  });

  const uniqueAvatarsInUse = Object.keys(distribution).length;
  const totalAvatarsAvailable = avatarCatalog.avatars.length;

  const usageCounts = Object.values(distribution);
  const maxUsage = Math.max(...usageCounts);
  const minUsage = Math.min(...usageCounts);
  const avgUsage = usageCounts.reduce((a, b) => a + b, 0) / usageCounts.length;

  console.log('📈 DISTRIBUIÇÃO DE AVATARES');
  console.log('─'.repeat(70));
  console.log(`   🎨 Avatares disponíveis: ${totalAvatarsAvailable}`);
  console.log(`   ✅ Avatares em uso: ${uniqueAvatarsInUse} (${(uniqueAvatarsInUse / totalAvatarsAvailable * 100).toFixed(1)}%)`);
  console.log(`   📊 Uso médio: ${avgUsage.toFixed(1)} itens/avatar`);
  console.log(`   📈 Uso máximo: ${maxUsage} itens/avatar`);
  console.log(`   📉 Uso mínimo: ${minUsage} itens/avatar`);
  console.log(`   📏 Amplitude: ${maxUsage - minUsage} itens`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // TOP 10 AVATARES MAIS USADOS
  // ═══════════════════════════════════════════════════════════════

  const top10 = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log('🏆 TOP 10 AVATARES MAIS USADOS');
  console.log('─'.repeat(70));
  top10.forEach(([avatarId, count], index) => {
    const percentage = (count / allAvatars.length * 100).toFixed(1);
    const bar = '█'.repeat(Math.ceil(count / maxUsage * 20));
    console.log(`   ${String(index + 1).padStart(2)}. ${avatarId.padEnd(20)} | ${String(count).padStart(4)} itens (${percentage.padStart(5)}%) ${bar}`);
  });
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // DISTRIBUIÇÃO POR GÊNERO
  // ═══════════════════════════════════════════════════════════════

  const femaleAvatars = Object.entries(distribution).filter(([id]) => id.includes('_f_'));
  const maleAvatars = Object.entries(distribution).filter(([id]) => id.includes('_m_'));

  const femaleCount = femaleAvatars.reduce((sum, [, count]) => sum + count, 0);
  const maleCount = maleAvatars.reduce((sum, [, count]) => sum + count, 0);

  console.log('👥 DISTRIBUIÇÃO POR GÊNERO');
  console.log('─'.repeat(70));
  console.log(`   👩 Feminino: ${femaleCount} itens (${(femaleCount / allAvatars.length * 100).toFixed(1)}%)`);
  console.log(`   👨 Masculino: ${maleCount} itens (${(maleCount / allAvatars.length * 100).toFixed(1)}%)`);
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // QUALIDADE DO SISTEMA
  // ═══════════════════════════════════════════════════════════════

  const issues = [];

  if (totalCoverage < 100) {
    issues.push(`⚠️  Cobertura incompleta: ${totalCoverage.toFixed(1)}% (objetivo: 100%)`);
  }

  if (uniqueAvatarsInUse < totalAvatarsAvailable * 0.8) {
    issues.push(`⚠️  Poucos avatares em uso: ${uniqueAvatarsInUse}/${totalAvatarsAvailable} (${(uniqueAvatarsInUse / totalAvatarsAvailable * 100).toFixed(1)}%)`);
  }

  const amplitudeRatio = (maxUsage - minUsage) / avgUsage;
  if (amplitudeRatio > 1.0) {
    issues.push(`⚠️  Distribuição desbalanceada: amplitude ${maxUsage - minUsage} (${(amplitudeRatio * 100).toFixed(0)}% da média)`);
  }

  console.log('🔍 QUALIDADE DO SISTEMA');
  console.log('─'.repeat(70));

  if (issues.length === 0) {
    console.log('   ✅ Sistema funcionando perfeitamente!');
    console.log('   ✅ Cobertura completa');
    console.log('   ✅ Distribuição balanceada');
    console.log('   ✅ Todos os avatares em uso');
  } else {
    issues.forEach(issue => console.log(`   ${issue}`));
  }

  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // RECOMENDAÇÕES
  // ═══════════════════════════════════════════════════════════════

  console.log('💡 RECOMENDAÇÕES');
  console.log('─'.repeat(70));

  if (totalCoverage >= 100) {
    console.log('   ✅ Sistema está completo e pronto para produção!');
  } else {
    console.log(`   🔧 Executar: npm run avatar:fix - Para corrigir ${totalItems - itemsWithAvatar} itens sem avatar`);
  }

  if (uniqueAvatarsInUse === totalAvatarsAvailable && amplitudeRatio < 1.0) {
    console.log('   ✅ Distribuição perfeita alcançada!');
  }

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    FIM DO RELATÓRIO                            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
