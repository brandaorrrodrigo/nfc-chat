import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ ANÁLISE DE ARENAS\n');
  console.log('═'.repeat(100));

  try {
    const arenas = await prisma.arena.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        totalPosts: true,
        totalComments: true,
        dailyActiveUsers: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: [
        { status: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    console.log(`\n📊 TOTAL DE ARENAS: ${arenas.length}\n`);

    // Agrupar por status
    const byStatus = {
      HOT: arenas.filter(a => a.status === 'HOT'),
      WARM: arenas.filter(a => a.status === 'WARM'),
      COLD: arenas.filter(a => a.status === 'COLD'),
      ARCHIVED: arenas.filter(a => a.status === 'ARCHIVED')
    };

    // Calcular necessidade de atualização (critério: menos de 20 posts)
    const needsUpdate = arenas.filter(a => a._count.posts < 20);
    const updated = arenas.filter(a => a._count.posts >= 20);

    console.log(`\n📈 ESTATÍSTICAS GERAIS:`);
    console.log(`   ✅ Arenas com conteúdo completo (≥20 posts): ${updated.length}`);
    console.log(`   ⚠️  Arenas que precisam atualização (<20 posts): ${needsUpdate.length}`);
    console.log(`   Total de posts em todas as arenas: ${arenas.reduce((sum, a) => sum + a._count.posts, 0)}`);

    console.log(`\n${'═'.repeat(100)}\n`);

    // Mostrar por status
    for (const [status, list] of Object.entries(byStatus)) {
      if (list.length === 0) continue;

      console.log(`\n🔥 STATUS: ${status} (${list.length} arenas)`);
      console.log('─'.repeat(100));

      for (const arena of list) {
        const postCount = arena._count.posts;
        const isComplete = postCount >= 20;
        const icon = isComplete ? '✅' : '⚠️';
        const status = isComplete ? 'COMPLETA' : 'INCOMPLETA';

        console.log(`${icon} ${arena.name}`);
        console.log(`   Slug: ${arena.slug}`);
        console.log(`   Posts: ${postCount} | Comentários: ${arena.totalComments} | Usuários: ${arena.dailyActiveUsers}`);
        console.log(`   Status: ${status} | Criada: ${new Date(arena.createdAt).toLocaleDateString('pt-BR')}`);
        console.log('');
      }
    }

    console.log(`\n${'═'.repeat(100)}`);
    console.log(`\n📋 ARENAS QUE PRECISAM DE ATUALIZAÇÃO (${needsUpdate.length}):\n`);

    needsUpdate.sort((a, b) => a._count.posts - b._count.posts);

    for (const arena of needsUpdate) {
      const needed = 20 - arena._count.posts;
      console.log(`⚠️  ${arena.name}`);
      console.log(`   Slug: ${arena.slug}`);
      console.log(`   Posts atuais: ${arena._count.posts}/20`);
      console.log(`   Faltam: ${needed} posts para 20 posts (mínimo para considerar completa)`);
      console.log('');
    }

    console.log(`\n${'═'.repeat(100)}`);
    console.log(`\n✅ ARENAS COMPLETAS (${updated.length}):\n`);

    updated.sort((a, b) => b._count.posts - a._count.posts);

    for (const arena of updated.slice(0, 15)) {
      console.log(`✅ ${arena.name}`);
      console.log(`   Slug: ${arena.slug}`);
      console.log(`   Posts: ${arena._count.posts}`);
      console.log('');
    }

    if (updated.length > 15) {
      console.log(`   ... e mais ${updated.length - 15} arenas completas`);
    }

    console.log(`\n${'═'.repeat(100)}\n`);

  } catch (error) {
    console.error('❌ ERRO:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
