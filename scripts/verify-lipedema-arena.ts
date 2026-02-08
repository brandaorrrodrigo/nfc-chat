import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando arena Protocolo Lipedema...\n');

  // Buscar a arena
  const arena = await prisma.arena.findFirst({
    where: {
      slug: 'protocolo-lipedema'
    },
    include: {
      posts: true
    }
  });

  if (!arena) {
    console.log('❌ Arena NÃO encontrada no banco de dados');
    console.log('\n📋 Arenas existentes no banco:');
    const allArenas = await prisma.arena.findMany({
      select: { id: true, slug: true, name: true }
    });
    allArenas.forEach(a => {
      console.log(`   - ${a.slug}: ${a.name}`);
    });
    return;
  }

  console.log('✅ Arena encontrada!');
  console.log(`\n📊 Detalhes da Arena:`);
  console.log(`   ID: ${arena.id}`);
  console.log(`   Nome: ${arena.name}`);
  console.log(`   Slug: ${arena.slug}`);
  console.log(`   Descrição: ${arena.description.substring(0, 100)}...`);
  console.log(`   Icon: ${arena.icon}`);
  console.log(`   Ativa: ${arena.isActive}`);
  
  console.log(`\n📝 Posts na Arena:`);
  console.log(`   Total: ${arena.posts.length}`);
  
  if (arena.posts.length > 0) {
    console.log('\n   Primeiros 5 posts:');
    arena.posts.slice(0, 5).forEach((post, idx) => {
      console.log(`   ${idx + 1}. ${post.content.substring(0, 60)}...`);
    });
  }

  // Verificar estatísticas por tipo de post
  const aiPosts = arena.posts.filter(p => p.isAIResponse);
  const userPosts = arena.posts.filter(p => !p.isAIResponse);
  
  console.log(`\n📈 Distribuição:`);
  console.log(`   Posts de Usuários: ${userPosts.length}`);
  console.log(`   Posts de IA: ${aiPosts.length}`);
  console.log(`   Publicados: ${arena.posts.filter(p => p.isPublished).length}`);
  console.log(`   Aprovados: ${arena.posts.filter(p => p.isApproved).length}`);
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
