/**
 * Script de Correção de Avatares Duplicados
 *
 * Reatribui avatares para posts com avatares problemáticos
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
  sexo: string;
  idade_range: string;
  biotipo: string;
  estilo: string;
  img: string;
  initials_color: string;
  tags: string[];
}

interface AvatarAssignmentCriteria {
  sexo?: 'M' | 'F';
  idade?: number;
  biotipo?: 'ectomorfo' | 'mesomorfo' | 'endomorfo';
  objetivo?: string;
}

// Service de avatar standalone (sem NestJS)
class StandaloneAvatarService {
  private avatars: Avatar[];
  private fallbackColors: string[];

  constructor() {
    this.avatars = avatarCatalog.avatars;
    this.fallbackColors = avatarCatalog.fallback_colors;
  }

  assignAvatar(criteria: AvatarAssignmentCriteria = {}): Avatar {
    let candidates = [...this.avatars];

    // Filtrar por sexo
    if (criteria.sexo) {
      const filtered = candidates.filter(a => a.sexo === criteria.sexo);
      if (filtered.length > 0) {
        candidates = filtered;
      }
    }

    // Filtrar por idade
    if (criteria.idade) {
      const filtered = candidates.filter(a => {
        const [min, max] = a.idade_range.split('-').map(Number);
        return criteria.idade! >= min && criteria.idade! <= max;
      });
      if (filtered.length > 0) {
        candidates = filtered;
      }
    }

    // Filtrar por biotipo
    if (criteria.biotipo) {
      const filtered = candidates.filter(a => a.biotipo === criteria.biotipo);
      if (filtered.length > 0) {
        candidates = filtered;
      }
    }

    // Filtrar por objetivo (tags)
    if (criteria.objetivo) {
      const objetivo = criteria.objetivo.toLowerCase();
      const filtered = candidates.filter(a =>
        a.tags.some(tag => objetivo.includes(tag) || tag.includes(objetivo))
      );
      if (filtered.length > 0) {
        candidates = filtered;
      }
    }

    // Escolher aleatoriamente entre candidatos
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    return selected;
  }

  assignRandomAvatar(): Avatar {
    return this.avatars[Math.floor(Math.random() * this.avatars.length)];
  }

  getInitialsColor(name: string): string {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.fallbackColors[hash % this.fallbackColors.length];
  }
}

interface PostWithAvatar {
  id: string;
  userId: string;
  avatarId: string | null;
  avatarImg: string | null;
  createdAt: Date;
  user: {
    name: string;
  };
}

async function main() {
  console.log('🔍 CORREÇÃO DE AVATARES DUPLICADOS\n');
  console.log('='.repeat(70));
  console.log('');

  const avatarService = new StandaloneAvatarService();

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 1: ANÁLISE - Identificar problema
  // ═══════════════════════════════════════════════════════════════

  console.log('📊 Analisando posts...\n');

  const allPosts = await prisma.post.findMany({
    select: {
      id: true,
      userId: true,
      avatarId: true,
      avatarImg: true,
      createdAt: true,
      user: {
        select: {
          name: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`📈 Total de posts: ${allPosts.length}\n`);

  // Agrupar por avatar para ver duplicatas
  const avatarGroups = allPosts.reduce((acc, post) => {
    const key = post.avatarId || 'null';
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {} as Record<string, PostWithAvatar[]>);

  console.log('📊 Distribuição ATUAL de avatares (top 10):');
  Object.entries(avatarGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .forEach(([avatarId, posts]) => {
      const percentage = ((posts.length / allPosts.length) * 100).toFixed(1);
      console.log(`  ${avatarId.padEnd(25)}: ${String(posts.length).padStart(4)} posts (${percentage}%)`);
    });
  console.log('');

  // Identificar avatares problemáticos
  const avgUseTarget = allPosts.length / 30; // 30 avatares disponíveis
  const problematicAvatars = Object.entries(avatarGroups).filter(
    ([id, posts]) => {
      // Considera problemático se:
      const isNull = id === 'null' || id === '';
      const tooManyUses = posts.length > avgUseTarget * 2.5; // Mais de 2.5x a média
      const isGeneric = id.includes('default') || id.includes('generic');

      return isNull || tooManyUses || isGeneric;
    }
  );

  const postsToFix = problematicAvatars.flatMap(([_, posts]) => posts);

  console.log(`⚠️  PROBLEMAS DETECTADOS:`);
  console.log(`   Posts com avatares problemáticos: ${postsToFix.length}`);
  console.log(`   Avatares problemáticos: ${problematicAvatars.length}`);
  console.log(`   Uso médio desejado: ${avgUseTarget.toFixed(1)} posts/avatar\n`);

  if (postsToFix.length === 0) {
    console.log('✅ Não há avatares problemáticos para corrigir!');
    console.log('   Distribuição já está balanceada.\n');
    return;
  }

  console.log('🔧 Avatares que serão redistribuídos:');
  problematicAvatars.forEach(([avatarId, posts]) => {
    console.log(`   - ${avatarId}: ${posts.length} posts`);
  });
  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 2: CONFIRMAÇÃO
  // ═══════════════════════════════════════════════════════════════

  console.log('🎯 AÇÃO A SER EXECUTADA:');
  console.log('   1. Reatribuir avatares de forma aleatória balanceada');
  console.log('   2. Manter nome, conteúdo e data originais');
  console.log('   3. Gerar log detalhado das mudanças');
  console.log('   4. Criar backup das alterações\n');

  console.log('⚠️  AVISO: Esta operação modificará o banco de dados.');
  console.log('');

  // Auto-continuar em modo não-interativo
  if (process.env.AUTO_CONFIRM !== 'true') {
    console.log('Pressione ENTER para continuar ou CTRL+C para cancelar...');
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    console.log('');
  }

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 3: CORREÇÃO
  // ═══════════════════════════════════════════════════════════════

  console.log('🔧 Iniciando correção...\n');

  let fixed = 0;
  let errors = 0;
  const fixLog: Array<{
    post_id: string;
    user_name: string;
    old_avatar: string;
    new_avatar: string;
    timestamp: string;
  }> = [];

  // Criar distribuição balanceada
  const usageTracker: Record<string, number> = {};
  avatarCatalog.avatars.forEach((avatar: Avatar) => {
    usageTracker[avatar.id] = 0;
  });

  // Contar uso atual (posts que NÃO serão modificados)
  allPosts
    .filter(p => !postsToFix.includes(p))
    .forEach(p => {
      if (p.avatarId && usageTracker[p.avatarId] !== undefined) {
        usageTracker[p.avatarId]++;
      }
    });

  for (const post of postsToFix) {
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
      await prisma.post.update({
        where: { id: post.id },
        data: {
          avatarId: avatar.id,
          avatarImg: avatar.img,
          avatarInitialsColor: avatar.initials_color
        }
      });

      // Incrementar contador de uso
      usageTracker[avatar.id]++;

      fixLog.push({
        post_id: post.id,
        user_name: post.user.name,
        old_avatar: post.avatarId || 'null',
        new_avatar: avatar.id,
        timestamp: new Date().toISOString()
      });

      fixed++;

      // Progress log
      if (fixed % 25 === 0) {
        const progress = ((fixed / postsToFix.length) * 100).toFixed(1);
        console.log(`   Progresso: ${fixed}/${postsToFix.length} (${progress}%)`);
      }

    } catch (error: any) {
      console.error(`   ❌ Erro ao corrigir post ${post.id}: ${error.message}`);
      errors++;
    }
  }

  console.log('');

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 4: RELATÓRIO FINAL
  // ═══════════════════════════════════════════════════════════════

  console.log('✅ CORREÇÃO CONCLUÍDA!\n');
  console.log(`📊 Resultados:`);
  console.log(`   - Corrigidos: ${fixed}`);
  console.log(`   - Erros: ${errors}`);
  console.log(`   - Taxa de sucesso: ${((fixed / (fixed + errors)) * 100).toFixed(1)}%\n`);

  // Distribuição DEPOIS
  const allPostsAfter = await prisma.post.findMany({
    select: { avatarId: true }
  });

  const avatarGroupsAfter = allPostsAfter.reduce((acc, post) => {
    const key = post.avatarId || 'null';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📈 Distribuição NOVA de avatares (top 10):');
  Object.entries(avatarGroupsAfter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([avatarId, count]) => {
      const oldCount = avatarGroups[avatarId]?.length || 0;
      const change = count - oldCount;
      const changeStr = change >= 0 ? `+${change}` : `${change}`;
      const percentage = ((count / allPostsAfter.length) * 100).toFixed(1);

      console.log(
        `  ${avatarId.padEnd(25)}: ${String(count).padStart(4)} posts (${String(percentage).padStart(5)}%) ` +
        `[${changeStr.padStart(4)}]`
      );
    });
  console.log('');

  // Salvar log detalhado
  const logPath = path.join(__dirname, '../avatar-fix-log.json');
  const logData = {
    timestamp: new Date().toISOString(),
    stats: {
      total_posts: allPosts.length,
      posts_fixed: fixed,
      errors: errors,
      success_rate: ((fixed / (fixed + errors)) * 100).toFixed(2) + '%'
    },
    distribution_before: Object.fromEntries(
      Object.entries(avatarGroups).map(([id, posts]) => [id, posts.length])
    ),
    distribution_after: avatarGroupsAfter,
    changes: fixLog
  };

  fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
  console.log(`💾 Log detalhado salvo em: ${logPath}\n`);

  // ═══════════════════════════════════════════════════════════════
  // ETAPA 5: VALIDAÇÃO PÓS-CORREÇÃO
  // ═══════════════════════════════════════════════════════════════

  const stillProblematic = await prisma.post.count({
    where: {
      OR: [
        { avatarId: null },
        { avatarId: '' }
      ]
    }
  });

  console.log('🔍 VALIDAÇÃO PÓS-CORREÇÃO:\n');

  if (stillProblematic > 0) {
    console.log(`   ⚠️  Ainda existem ${stillProblematic} posts sem avatar.`);
    console.log('      Execute o script novamente para corrigir.\n');
  } else {
    console.log(`   ✅ Todos os posts agora possuem avatares!\n`);
  }

  // Verificar balanceamento
  const maxUse = Math.max(...Object.values(avatarGroupsAfter));
  const minUse = Math.min(
    ...Object.values(avatarGroupsAfter).filter(v => v > 0)
  );
  const avgUse = allPostsAfter.length / Object.keys(avatarGroupsAfter).length;
  const range = maxUse - minUse;

  console.log(`📊 BALANCEAMENTO:`);
  console.log(`   - Uso máximo: ${maxUse} posts/avatar`);
  console.log(`   - Uso mínimo: ${minUse} posts/avatar`);
  console.log(`   - Uso médio: ${avgUse.toFixed(1)} posts/avatar`);
  console.log(`   - Amplitude: ${range} posts`);
  console.log(`   - Desvio do ideal: ${((maxUse / avgUse - 1) * 100).toFixed(1)}%\n`);

  if (maxUse > avgUse * 1.5) {
    console.log(`   ⚠️  Ainda há desbalanceamento (considere rodar novamente)\n`);
  } else {
    console.log(`   ✅ Distribuição bem balanceada!\n`);
  }

  console.log('='.repeat(70));
  console.log('');
  console.log('✅ PROCESSO COMPLETO!');
  console.log('');
  console.log('📋 Próximos passos:');
  console.log('   1. npm run avatar:analyze - Ver distribuição atualizada');
  console.log('   2. Verificar avatar-fix-log.json para detalhes');
  console.log('   3. Testar no frontend se avatares estão variados');
  console.log('');
}

main()
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
