import { createClient } from '@supabase/supabase-js';
import pkg from 'pg';
const { Client } = pkg;

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';
const supabase = createClient(supabaseUrl, supabaseKey);

const dockerClient = new Client({
  host: 'localhost',
  port: 5432,
  database: 'nfc_admin',
  user: 'nfc',
  password: 'nfc_password_change_me'
});

async function copyData() {
  console.log('🔄 Copiando dados do Supabase para Docker...\n');

  try {
    await dockerClient.connect();
    console.log('✅ Conectado ao Docker PostgreSQL\n');

    // 1. Copiar Arenas
    console.log('📌 Copiando Arenas...');
    const { data: supabaseArenas } = await supabase
      .from('Arena')
      .select('*')
      .in('slug', ['protocolo-lipedema', 'sinal-vermelho']);

    for (const arena of supabaseArenas || []) {
      await dockerClient.query(
        `INSERT INTO "Arena" (id, name, slug, description, icon, color, category, isActive, aiPersona,
         aiInterventionRate, aiFrustrationThreshold, aiCooldown, categoria, criadaPor, totalPosts, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (slug) DO NOTHING`,
        [arena.id, arena.name, arena.slug, arena.description, arena.icon, arena.color, arena.category,
         arena.isActive, arena.aiPersona, arena.aiInterventionRate, arena.aiFrustrationThreshold,
         arena.aiCooldown, arena.categoria, arena.criadaPor, arena.totalPosts, arena.createdAt, arena.updatedAt]
      );
    }
    console.log(`   ✅ ${supabaseArenas?.length || 0} arenas copiadas\n`);

    // 2. Copiar Usuários
    console.log('👤 Copiando Usuários...');
    const { data: supabaseUsers } = await supabase
      .from('User')
      .select('*');

    for (const user of supabaseUsers || []) {
      await dockerClient.query(
        `INSERT INTO "User" (id, email, name, role, is_ghost_user, fpTotal, fpAvailable, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [user.id, user.email, user.name, user.role, user.is_ghost_user, user.fpTotal, user.fpAvailable, user.createdAt, user.updatedAt]
      );
    }
    console.log(`   ✅ ${supabaseUsers?.length || 0} usuários copiados\n`);

    // 3. Copiar Posts
    console.log('📝 Copiando Posts...');
    const { data: supabasePosts } = await supabase
      .from('Post')
      .select('*')
      .in('arenaId', (supabaseArenas || []).map(a => a.id));

    for (const post of supabasePosts || []) {
      await dockerClient.query(
        `INSERT INTO "Post" (id, content, "arenaId", "userId", "isAIResponse", "isPublished", "isApproved", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [post.id, post.content, post.arenaId, post.userId, post.isAIResponse, post.isPublished, post.isApproved, post.createdAt, post.updatedAt]
      );
    }
    console.log(`   ✅ ${supabasePosts?.length || 0} posts copiados\n`);

    // 4. Verificar resultado
    const arenaCount = await dockerClient.query('SELECT COUNT(*) FROM "Arena"');
    const userCount = await dockerClient.query('SELECT COUNT(*) FROM "User"');
    const postCount = await dockerClient.query('SELECT COUNT(*) FROM "Post"');

    console.log('═'.repeat(60));
    console.log('✅ CÓPIA CONCLUÍDA!');
    console.log('═'.repeat(60));
    console.log(`📊 Totais no Docker:`);
    console.log(`   - Arenas: ${arenaCount.rows[0].count}`);
    console.log(`   - Usuários: ${userCount.rows[0].count}`);
    console.log(`   - Posts: ${postCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  } finally {
    await dockerClient.end();
  }
}

copyData();
