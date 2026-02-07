/**
 * Script de Estatísticas de Avatares
 *
 * Exibe relatório completo sobre o uso de avatares no sistema
 *
 * Uso:
 *   npm run avatar:stats
 */

import { PrismaClient } from '@prisma/client';
import { AvatarService } from '../backend/src/modules/avatars/avatar.service';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 RELATÓRIO DE ESTATÍSTICAS DE AVATARES\n');
  console.log('='.repeat(60));

  const avatarService = new AvatarService();

  // 1. Totais gerais
  console.log('\n📈 TOTAIS GERAIS:');
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();
  const postsWithAvatar = await prisma.post.count({ where: { avatarId: { not: null } } });
  const commentsWithAvatar = await prisma.comment.count({ where: { avatarId: { not: null } } });

  console.log(`  Posts: ${totalPosts} (${postsWithAvatar} com avatar, ${totalPosts - postsWithAvatar} sem)`);
  console.log(`  Comentários: ${totalComments} (${commentsWithAvatar} com avatar, ${totalComments - commentsWithAvatar} sem)`);

  const coveragePosts = totalPosts > 0 ? ((postsWithAvatar / totalPosts) * 100).toFixed(1) : '0';
  const coverageComments = totalComments > 0 ? ((commentsWithAvatar / totalComments) * 100).toFixed(1) : '0';

  console.log(`  Cobertura: Posts ${coveragePosts}%, Comentários ${coverageComments}%`);

  // 2. Distribuição por avatar (posts)
  console.log('\n🎨 DISTRIBUIÇÃO POR AVATAR (POSTS):');
  const statsPost = await avatarService.getAvatarStats();

  if (statsPost.length > 0) {
    console.log(`  Total de avatares únicos em uso: ${statsPost.length}\n`);

    statsPost.slice(0, 15).forEach((s, index) => {
      const percentage = totalPosts > 0 ? ((s.count / totalPosts) * 100).toFixed(1) : '0';
      const avatar = s.avatar;
      const details = avatar
        ? `${avatar.sexo} | ${avatar.idade_range} | ${avatar.biotipo} | ${avatar.estilo}`
        : 'Dados não encontrados';

      console.log(`  ${index + 1}. ${s.avatar_id}`);
      console.log(`     ${details}`);
      console.log(`     Uso: ${s.count} posts (${percentage}%)\n`);
    });
  } else {
    console.log('  Nenhum avatar em uso ainda.\n');
  }

  // 3. Distribuição por sexo
  console.log('\n⚧ DISTRIBUIÇÃO POR SEXO:');
  const maleAvatars = statsPost.filter(s => s.avatar?.sexo === 'M').reduce((sum, s) => sum + s.count, 0);
  const femaleAvatars = statsPost.filter(s => s.avatar?.sexo === 'F').reduce((sum, s) => sum + s.count, 0);
  const totalWithSex = maleAvatars + femaleAvatars;

  if (totalWithSex > 0) {
    const malePerc = ((maleAvatars / totalWithSex) * 100).toFixed(1);
    const femalePerc = ((femaleAvatars / totalWithSex) * 100).toFixed(1);

    console.log(`  Masculino (M): ${maleAvatars} (${malePerc}%)`);
    console.log(`  Feminino (F): ${femaleAvatars} (${femalePerc}%)`);
  } else {
    console.log('  Dados insuficientes');
  }

  // 4. Distribuição por biotipo
  console.log('\n💪 DISTRIBUIÇÃO POR BIOTIPO:');
  const biotipos = ['ectomorfo', 'mesomorfo', 'endomorfo'];

  biotipos.forEach(biotipo => {
    const count = statsPost.filter(s => s.avatar?.biotipo === biotipo).reduce((sum, s) => sum + s.count, 0);
    const percentage = totalWithSex > 0 ? ((count / totalWithSex) * 100).toFixed(1) : '0';
    console.log(`  ${biotipo.charAt(0).toUpperCase() + biotipo.slice(1)}: ${count} (${percentage}%)`);
  });

  // 5. Avatares não utilizados
  console.log('\n🔍 AVATARES DISPONÍVEIS NÃO UTILIZADOS:');
  const allAvatars = avatarService.getAllAvatars();
  const usedAvatarIds = new Set(statsPost.map(s => s.avatar_id));
  const unusedAvatars = allAvatars.filter(a => !usedAvatarIds.has(a.id));

  if (unusedAvatars.length > 0) {
    console.log(`  Total: ${unusedAvatars.length} avatares sem uso\n`);

    unusedAvatars.slice(0, 10).forEach(avatar => {
      console.log(`  - ${avatar.id}: ${avatar.sexo} | ${avatar.idade_range} | ${avatar.biotipo} | ${avatar.estilo}`);
    });

    if (unusedAvatars.length > 10) {
      console.log(`  ... e mais ${unusedAvatars.length - 10} avatares`);
    }
  } else {
    console.log('  Todos os avatares estão sendo utilizados!');
  }

  // 6. Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');

  if (postsWithAvatar < totalPosts || commentsWithAvatar < totalComments) {
    console.log('  ⚠️  Execute a migração para atribuir avatares aos registros sem avatar:');
    console.log('      npm run avatar:migrate');
  } else {
    console.log('  ✅ Todos os registros possuem avatares atribuídos!');
  }

  if (unusedAvatars.length > allAvatars.length / 2) {
    console.log(`  📊 ${unusedAvatars.length} avatares (${((unusedAvatars.length / allAvatars.length) * 100).toFixed(0)}%) não estão sendo utilizados.`);
    console.log('      Considere ajustar o sistema de atribuição para melhor distribuição.');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Relatório concluído!\n');
}

main()
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
