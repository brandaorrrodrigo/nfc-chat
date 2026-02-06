/**
 * Script para corrigir avatares duplicados nas Arenas
 * e redistribuir de forma balanceada
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
  console.log('🔍 ANÁLISE E CORREÇÃO DE AVATARES EM ARENAS\n');
  console.log('='.repeat(70));
  console.log('');

  // Buscar todas as arenas
  const allArenas = await prisma.arena.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      avatarId: true,
      avatarImg: true,
      avatarInitialsColor: true,
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`📊 Total de arenas: ${allArenas.length}\n`);

  // Analisar distribuição atual
  const avatarUsage = new Map<string, number>();
  const arenasWithAvatar = allArenas.filter(a => a.avatarId);
  const arenasWithoutAvatar = allArenas.filter(a => !a.avatarId);

  arenasWithAvatar.forEach(arena => {
    const count = avatarUsage.get(arena.avatarId!) || 0;
    avatarUsage.set(arena.avatarId!, count + 1);
  });

  console.log('📈 Distribuição atual:');
  console.log(`   ✅ Arenas com avatar: ${arenasWithAvatar.length}`);
  console.log(`   ⚠️  Arenas sem avatar: ${arenasWithoutAvatar.length}`);
  console.log(`   🎨 Avatares únicos em uso: ${avatarUsage.size}/30\n`);

  // Identificar duplicados
  const duplicated = Array.from(avatarUsage.entries())
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);

  if (duplicated.length > 0) {
    console.log('🚨 Avatares duplicados:');
    duplicated.forEach(([avatarId, count]) => {
      console.log(`   - ${avatarId}: usado ${count} vezes`);
    });
    console.log('');
  }

  // Criar pool de avatares não usados ou pouco usados
  const usageTracker: Record<string, number> = {};
  avatarCatalog.avatars.forEach((avatar: Avatar) => {
    usageTracker[avatar.id] = avatarUsage.get(avatar.id) || 0;
  });

  // Arenas que precisam de novo avatar (duplicados)
  const arenasToFix = allArenas.filter(arena => {
    if (!arena.avatarId) return true; // Sem avatar
    const usage = avatarUsage.get(arena.avatarId);
    return usage && usage > 1; // Duplicado
  });

  if (arenasToFix.length === 0) {
    console.log('✅ Nenhuma arena precisa de correção!');
    console.log('   Distribuição está balanceada.\n');
    return;
  }

  console.log(`🔧 Arenas que precisam de correção: ${arenasToFix.length}\n`);

  // Corrigir arenas
  let fixed = 0;
  const fixLog: Array<{
    arena_slug: string;
    arena_name: string;
    old_avatar: string | null;
    new_avatar: string;
  }> = [];

  for (const arena of arenasToFix) {
    try {
      // Escolher avatar menos usado
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
      await prisma.arena.update({
        where: { id: arena.id },
        data: {
          avatarId: avatar.id,
          avatarImg: avatar.img,
          avatarInitialsColor: avatar.initials_color
        }
      });

      // Incrementar contador de uso
      usageTracker[avatar.id]++;

      fixLog.push({
        arena_slug: arena.slug,
        arena_name: arena.name,
        old_avatar: arena.avatarId || 'null',
        new_avatar: avatar.id,
      });

      fixed++;

      if (fixed % 10 === 0) {
        console.log(`   Progresso: ${fixed}/${arenasToFix.length}`);
      }

    } catch (error: any) {
      console.error(`   ❌ Erro ao corrigir arena ${arena.slug}: ${error.message}`);
    }
  }

  console.log('');
  console.log('✅ CORREÇÃO CONCLUÍDA!\n');
  console.log(`📊 Resultados:`);
  console.log(`   - Arenas corrigidas: ${fixed}`);
  console.log(`   - Taxa de sucesso: ${((fixed / arenasToFix.length) * 100).toFixed(1)}%\n`);

  // Nova distribuição
  const newUsage = Object.entries(usageTracker)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  console.log('📈 Nova distribuição (top 10):');
  newUsage.slice(0, 10).forEach(([avatarId, count]) => {
    console.log(`   ${avatarId.padEnd(20)}: ${count} arena(s)`);
  });

  console.log('');
  console.log('📊 Estatísticas finais:');
  console.log(`   - Avatares em uso: ${newUsage.length}/30`);
  console.log(`   - Uso máximo: ${Math.max(...newUsage.map(([, c]) => c))} arena(s)/avatar`);
  console.log(`   - Uso mínimo: ${Math.min(...newUsage.map(([, c]) => c))} arena(s)/avatar`);

  // Salvar log
  const logPath = path.join(__dirname, '../arena-avatar-fix-log.json');
  fs.writeFileSync(logPath, JSON.stringify(fixLog, null, 2));
  console.log(`\n💾 Log detalhado salvo em: ${logPath}`);

  console.log('\n' + '='.repeat(70));
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
