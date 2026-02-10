/**
 * verify-hub-structure.ts
 *
 * Script para validar estrutura de HUBs no banco
 * Executa quando Supabase estiver online
 *
 * Execução: npx tsx scripts/verify-hub-structure.ts
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

interface HubInfo {
  slug: string;
  name: string;
  arenaType: string;
  totalChildren: number;
  children: string[];
}

async function verifyHubStructure() {
  console.log('🔍 Verificando estrutura de HUBs...\n');

  try {
    // 1. Listar todos os HUBs
    const hubs = await prisma.arena.findMany({
      where: {
        arenaType: 'NFV_HUB',
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        arenaType: true,
        totalPosts: true,
      },
      orderBy: { name: 'asc' },
    });

    console.log(`📊 HUBs Encontrados: ${hubs.length}\n`);

    if (hubs.length === 0) {
      console.log('⚠️  AVISO: Nenhum HUB encontrado no banco!');
      console.log('   Certifique-se de que os seeds foram executados.\n');
      return;
    }

    // 2. Para cada HUB, listar suas arenas filhas
    const hubsInfo: HubInfo[] = [];

    for (const hub of hubs) {
      const children = await prisma.arena.findMany({
        where: {
          parentArenaSlug: hub.slug,
          isActive: true,
        },
        select: {
          slug: true,
          name: true,
          totalPosts: true,
        },
        orderBy: { name: 'asc' },
      });

      const hubInfo: HubInfo = {
        slug: hub.slug,
        name: hub.name,
        arenaType: hub.arenaType,
        totalChildren: children.length,
        children: children.map(c => c.slug),
      };

      hubsInfo.push(hubInfo);

      console.log(`✅ ${hub.name}`);
      console.log(`   Slug: ${hub.slug}`);
      console.log(`   Type: ${hub.arenaType}`);
      console.log(`   Filhas: ${children.length}`);

      if (children.length > 0) {
        children.forEach(child => {
          console.log(`      • ${child} (${child} posts)`);
        });
      } else {
        console.log(`      ⚠️  SEM ARENAS FILHAS!`);
      }
      console.log();
    }

    // 3. Listar arenas órfãs (sem HUB pai)
    const orphanArenas = await prisma.arena.findMany({
      where: {
        arenaType: { not: 'NFV_HUB' },
        parentArenaSlug: null,
        isActive: true,
      },
      select: {
        slug: true,
        name: true,
        arenaType: true,
      },
      orderBy: { name: 'asc' },
    });

    if (orphanArenas.length > 0) {
      console.log(`\n⚠️  ARENAS ÓRFÃS (sem HUB pai): ${orphanArenas.length}\n`);
      orphanArenas.forEach(arena => {
        console.log(`   • ${arena.slug} (${arena.name}) - Type: ${arena.arenaType}`);
      });
    }

    // 4. Validação final
    console.log('\n' + '='.repeat(60));
    console.log('📋 VALIDAÇÃO FINAL\n');

    let allValid = true;

    // Verificar que cada HUB tem pelo menos uma filha
    const hubsWithoutChildren = hubsInfo.filter(h => h.totalChildren === 0);
    if (hubsWithoutChildren.length > 0) {
      console.log(`❌ ${hubsWithoutChildren.length} HUB(s) sem arenas filhas:`);
      hubsWithoutChildren.forEach(h => console.log(`   - ${h.name}`));
      allValid = false;
    } else {
      console.log('✅ Todos os HUBs têm arenas filhas');
    }

    // Verificar que cada arena filha tem parentArenaSlug
    const totalChildren = hubsInfo.reduce((sum, h) => sum + h.totalChildren, 0);
    console.log(`✅ Total de arenas filhas: ${totalChildren}`);

    // Verificar que não há arenas órfãs (opcionalmente)
    if (orphanArenas.length > 0) {
      console.log(`\n⚠️  ${orphanArenas.length} arenas sem HUB pai (verifique se é intencional)`);
    } else {
      console.log('✅ Nenhuma arena órfã encontrada');
    }

    console.log('\n' + '='.repeat(60));

    if (allValid) {
      console.log('\n✅ ESTRUTURA DE HUBs VÁLIDA!\n');
    } else {
      console.log('\n❌ PROBLEMAS DETECTADOS NA ESTRUTURA DE HUBs\n');
      process.exit(1);
    }

    // 5. Endpoints para testar
    console.log('🧪 ENDPOINTS PARA TESTAR:\n');
    hubsInfo.forEach(hub => {
      console.log(`   GET /api/hubs/${hub.slug}`);
      console.log(`   PAGE http://localhost:3000/comunidades/hub/${hub.slug}\n`);
    });

  } catch (error) {
    console.error('❌ Erro ao verificar HUBs:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyHubStructure();
