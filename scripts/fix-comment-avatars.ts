/**
 * Script para atribuir avatares aos comentários
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Importar catálogo de avatares
const catalogPath = path.join(__dirname, '../backend/src/modules/avatars/avatar-catalog.json');
const avatarCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

interface Avatar {
  id: string;
  img: string;
  initials_color: string;
}

async function main() {
  console.log('💬 ATRIBUIÇÃO DE AVATARES - COMENTÁRIOS\n');
  console.log('='.repeat(70));
  console.log('');

  // Buscar todos os comentários
  const allComments = await prisma.comment.findMany({
    select: {
      id: true,
      userId: true,
      avatarId: true,
      user: {
        select: {
          name: true
        }
      }
    }
  });

  const commentsWithoutAvatar = allComments.filter(c => !c.avatarId);

  console.log(`📊 Total de comentários: ${allComments.length}`);
  console.log(`⚠️  Sem avatar: ${commentsWithoutAvatar.length}\n`);

  if (commentsWithoutAvatar.length === 0) {
    console.log('✅ Todos os comentários já possuem avatares!');
    return;
  }

  console.log('🔧 Atribuindo avatares...\n');

  // Criar distribuição balanceada
  const usageTracker: Record<string, number> = {};
  avatarCatalog.avatars.forEach((avatar: Avatar) => {
    usageTracker[avatar.id] = 0;
  });

  // Contar uso atual (comentários que já têm avatar)
  allComments
    .filter(c => c.avatarId)
    .forEach(c => {
      if (c.avatarId && usageTracker[c.avatarId!] !== undefined) {
        usageTracker[c.avatarId!]++;
      }
    });

  let fixed = 0;

  for (const comment of commentsWithoutAvatar) {
    try {
      // Escolher avatar menos usado para balancear
      const leastUsedAvatars = Object.entries(usageTracker)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5) // Top 5 menos usados
        .map(([id]) => id);

      const avatarId = leastUsedAvatars[Math.floor(Math.random() * leastUsedAvatars.length)];
      const avatar = avatarCatalog.avatars.find((a: Avatar) => a.id === avatarId);

      if (!avatar) {
        throw new Error(`Avatar ${avatarId} não encontrado no catálogo`);
      }

      // Atualizar no banco
      await prisma.comment.update({
        where: { id: comment.id },
        data: {
          avatarId: avatar.id,
          avatarImg: avatar.img,
          avatarInitialsColor: avatar.initials_color
        }
      });

      // Incrementar contador de uso
      usageTracker[avatar.id]++;
      fixed++;

      // Progress log
      if (fixed % 25 === 0) {
        const progress = ((fixed / commentsWithoutAvatar.length) * 100).toFixed(1);
        console.log(`   Progresso: ${fixed}/${commentsWithoutAvatar.length} (${progress}%)`);
      }

    } catch (error: any) {
      console.error(`   ❌ Erro ao corrigir comentário ${comment.id}: ${error.message}`);
    }
  }

  console.log('');
  console.log('✅ CORREÇÃO CONCLUÍDA!\n');
  console.log(`📊 Resultados:`);
  console.log(`   - Comentários corrigidos: ${fixed}`);
  console.log(`   - Taxa de sucesso: ${((fixed / commentsWithoutAvatar.length) * 100).toFixed(1)}%\n`);

  // Distribuição final
  const finalDistribution = Object.entries(usageTracker)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log('📈 Distribuição de avatares em comentários (top 10):');
  finalDistribution.forEach(([avatarId, count]) => {
    const percentage = ((count / allComments.length) * 100).toFixed(1);
    console.log(`  ${avatarId.padEnd(25)}: ${String(count).padStart(4)} comentários (${percentage}%)`);
  });

  console.log('');
  console.log('='.repeat(70));
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
