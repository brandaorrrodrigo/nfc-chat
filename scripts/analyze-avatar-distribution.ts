/**
 * Script de Análise de Distribuição de Avatares
 *
 * Analisa a distribuição atual de avatares sem modificar dados
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 ANÁLISE DE DISTRIBUIÇÃO DE AVATARES\n');
  console.log('='.repeat(70));
  console.log('');

  const allChats = await prisma.post.findMany({
    select: {
      id: true,
      avatarId: true,
      userId: true,
      user: {
        select: {
          name: true
        }
      },
      createdAt: true
    }
  });

  // Agrupar por avatar
  const distribution: Record<string, { count: number; users: Set<string> }> = {};

  allChats.forEach(chat => {
    const key = chat.avatarId || 'SEM_AVATAR';
    if (!distribution[key]) {
      distribution[key] = {
        count: 0,
        users: new Set()
      };
    }
    distribution[key].count++;
    distribution[key].users.add(chat.user.name);
  });

  console.log(`📈 ESTATÍSTICAS GERAIS:`);
  console.log(`   Total de posts: ${allChats.length}`);
  console.log(`   Avatares únicos em uso: ${Object.keys(distribution).length}`);
  console.log('');

  console.log('🏆 TOP 20 AVATARES MAIS USADOS:');
  console.log('');

  Object.entries(distribution)
    .map(([id, data]) => ({
      avatar_id: id,
      count: data.count,
      unique_users: data.users.size
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .forEach((item, idx) => {
      const percentage = ((item.count / allChats.length) * 100).toFixed(1);
      const bar = '█'.repeat(Math.min(Math.floor(item.count / 10), 50));

      console.log(
        `${String(idx + 1).padStart(2)}. ${item.avatar_id.padEnd(25)} | ` +
        `${String(item.count).padStart(5)} posts (${String(percentage).padStart(5)}%) | ` +
        `${String(item.unique_users).padStart(3)} users | ${bar}`
      );
    });

  // Análise de problemas
  const withoutAvatar = distribution['SEM_AVATAR']?.count || 0;
  const distributionValues = Object.values(distribution).map(d => d.count);
  const maxUse = Math.max(...distributionValues);
  const minUse = Math.min(...distributionValues.filter(v => v > 0));
  const avgUse = allChats.length / Object.keys(distribution).length;
  const stdDev = Math.sqrt(
    distributionValues.reduce((sum, val) => sum + Math.pow(val - avgUse, 2), 0) / distributionValues.length
  );

  console.log('');
  console.log('🔍 ANÁLISE DE QUALIDADE:');
  console.log('');
  console.log(`   Posts sem avatar: ${withoutAvatar}`);
  console.log(`   Avatar mais usado: ${maxUse} vezes`);
  console.log(`   Avatar menos usado: ${minUse} vezes`);
  console.log(`   Uso médio: ${avgUse.toFixed(1)} vezes/avatar`);
  console.log(`   Desvio padrão: ${stdDev.toFixed(1)}`);
  console.log(`   Coeficiente de variação: ${((stdDev / avgUse) * 100).toFixed(1)}%`);
  console.log('');

  // Diagnóstico de problemas
  const hasProblems: string[] = [];

  if (withoutAvatar > 0) {
    hasProblems.push(`❌ ${withoutAvatar} posts SEM avatar`);
  }

  if (maxUse > avgUse * 3) {
    const overusedCount = Object.values(distribution).filter(d => d.count > avgUse * 3).length;
    hasProblems.push(`⚠️  ${overusedCount} avatares SUPER-USADOS (>3x média)`);
  }

  if (stdDev > avgUse * 0.5) {
    hasProblems.push(`⚠️  Distribuição MUITO DESBALANCEADA (desvio padrão alto)`);
  }

  const totalAvatarsAvailable = 30; // Do catálogo
  const avatarsInUse = Object.keys(distribution).filter(k => k !== 'SEM_AVATAR').length;
  if (avatarsInUse < totalAvatarsAvailable * 0.5) {
    hasProblems.push(`⚠️  Apenas ${avatarsInUse}/${totalAvatarsAvailable} avatares em uso (${((avatarsInUse/totalAvatarsAvailable)*100).toFixed(0)}%)`);
  }

  console.log('🚨 PROBLEMAS DETECTADOS:');
  console.log('');

  if (hasProblems.length === 0) {
    console.log('   ✅ Nenhum problema detectado!');
    console.log('   ✅ Sistema de avatares funcionando perfeitamente!');
  } else {
    hasProblems.forEach(problem => {
      console.log(`   ${problem}`);
    });
    console.log('');
    console.log('💡 RECOMENDAÇÃO:');
    console.log('   Execute: npm run avatar:fix');
    console.log('   Para reatribuir avatares de forma balanceada');
  }

  console.log('');
  console.log('='.repeat(70));

  // Análise por usuário (se muitos posts com mesmo avatar são do mesmo usuário)
  console.log('');
  console.log('👥 ANÁLISE POR USUÁRIO:');
  console.log('');

  const topAvatars = Object.entries(distribution)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  topAvatars.forEach(([avatarId, data]) => {
    if (avatarId === 'SEM_AVATAR') return;

    const postsPerUser = data.count / data.users.size;
    const status = postsPerUser > 5 ? '⚠️ ' : '✅';

    console.log(`   ${status} ${avatarId}:`);
    console.log(`      ${data.count} posts / ${data.users.size} users = ${postsPerUser.toFixed(1)} posts/user`);
  });

  console.log('');
}

main()
  .catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
