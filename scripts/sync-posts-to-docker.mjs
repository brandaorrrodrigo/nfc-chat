import { createClient } from '@supabase/supabase-js';
import pkg from 'pg';
const { Client } = pkg;

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';
const supabase = createClient(supabaseUrl, supabaseKey);

const dockerClient = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'nfc_admin',
  user: 'nfc',
  password: 'nfc_password_change_me',
  connect_timeout: 10
});

async function syncPosts() {
  console.log('🔄 Sincronizando posts do Supabase para Docker PostgreSQL...\n');

  try {
    await dockerClient.connect();
    console.log('✅ Conectado ao Docker PostgreSQL\n');

    // Arenas para sincronizar
    const arenas = [
      { slug: 'protocolo-lipedema', name: 'Protocolo Lipedema' },
      { slug: 'sinal-vermelho', name: 'Sinal Vermelho' }
    ];

    for (const arena of arenas) {
      console.log(`📌 Processando: ${arena.name}`);

      // 1. Buscar arena no Docker
      const arenaRes = await dockerClient.query(
        'SELECT id FROM "Arena" WHERE slug = $1',
        [arena.slug]
      );

      if (arenaRes.rows.length === 0) {
        console.log(`   ⚠️  Arena não encontrada no Docker`);
        continue;
      }

      const arenaId = arenaRes.rows[0].id;

      // 2. Deletar posts antigos
      const deleteRes = await dockerClient.query(
        'DELETE FROM "Post" WHERE "arenaId" = $1',
        [arenaId]
      );
      console.log(`   🗑️  ${deleteRes.rowCount} posts antigos deletados`);

      // 3. Buscar posts novos do Supabase
      const { data: supabasePosts } = await supabase
        .from('Post')
        .select('*')
        .eq('arenaId', arenaId)
        .order('createdAt');

      if (!supabasePosts || supabasePosts.length === 0) {
        console.log(`   ⚠️  Nenhum post encontrado no Supabase`);
        continue;
      }

      console.log(`   📥 Encontrados ${supabasePosts.length} posts no Supabase`);

      // 4. Inserir posts novos no Docker
      for (const post of supabasePosts) {
        const createdAt = post.createdAt || new Date().toISOString();

        await dockerClient.query(
          `INSERT INTO "Post" (id, content, "arenaId", "userId", "isAIResponse", "isPublished", "isApproved", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [post.id, post.content, arenaId, post.userId, post.isAIResponse, post.isPublished, post.isApproved, createdAt]
        );
      }

      console.log(`   ✅ ${supabasePosts.length} posts inseridos\n`);
    }

    console.log('═'.repeat(60));
    console.log('✅ SINCRONIZAÇÃO COMPLETA!');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('❌ ERRO:', error.message);
  } finally {
    await dockerClient.end();
  }
}

syncPosts();
