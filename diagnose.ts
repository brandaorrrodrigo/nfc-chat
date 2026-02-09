import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();

async function check() {
  try {
    const cols_arenas = await p.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Arena' ORDER BY ordinal_position`;
    const cols_posts = await p.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'Post' ORDER BY ordinal_position`;

    console.log('\n✅ COLUNAS DAS TABELAS:');
    console.log('ARENA:', JSON.stringify((cols_arenas as any[]).map(c => c.column_name)));
    console.log('POST:', JSON.stringify((cols_posts as any[]).map(c => c.column_name)));

    const arenas = await p.arena.findMany({
      select: { id: true, slug: true, name: true, totalPosts: true },
      orderBy: { name: 'asc' }
    });

    console.log('\n📊 TODAS AS ARENAS (' + arenas.length + '):');
    arenas.forEach((a, i) => {
      console.log(
        (i+1).toString().padStart(2) + '. ' +
        a.slug.padEnd(25) + ' | ' +
        a.name.padEnd(40) + ' | posts: ' +
        (a.totalPosts || 0).toString().padStart(3) + ' | id: ' + a.id
      );
    });
  } catch (e) {
    console.error('ERRO:', (e as any).message);
  } finally {
    await p.$disconnect();
  }
}

check();
