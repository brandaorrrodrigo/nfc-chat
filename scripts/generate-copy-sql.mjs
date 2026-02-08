import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSQL() {
  console.log('Buscando dados do Supabase...\n');

  // Arenas
  const { data: arenas } = await supabase
    .from('Arena')
    .select('*')
    .in('slug', ['protocolo-lipedema', 'sinal-vermelho']);

  console.log(`📌 Arenas: ${arenas?.length || 0}`);

  // Usuários
  const { data: users } = await supabase.from('User').select('*');
  console.log(`👤 Usuários: ${users?.length || 0}`);

  // Posts
  const { data: posts } = await supabase
    .from('Post')
    .select('*')
    .in('arenaId', (arenas || []).map(a => a.id));

  console.log(`📝 Posts: ${posts?.length || 0}`);

  // Gerar SQL
  let sql = '-- Sincronizar dados do Supabase para Docker\n\n';

  // Arenas
  sql += '-- Inserir Arenas\n';
  for (const arena of arenas || []) {
    const escapedName = arena.name.replace(/'/g, "''");
    const escapedDesc = (arena.description || '').replace(/'/g, "''");
    sql += `INSERT INTO "Arena" (id, name, slug, description, icon, color, category, isActive, aiPersona, aiInterventionRate, aiFrustrationThreshold, aiCooldown, categoria, criadaPor, totalPosts, createdAt, updatedAt) VALUES ('${arena.id}', '${escapedName}', '${arena.slug}', '${escapedDesc}', '${arena.icon}', '${arena.color}', '${arena.category}', ${arena.isActive}, '${arena.aiPersona}', ${arena.aiInterventionRate}, ${arena.aiFrustrationThreshold}, ${arena.aiCooldown}, '${arena.categoria}', '${arena.criadaPor}', ${arena.totalPosts}, '${arena.createdAt}', '${arena.updatedAt}') ON CONFLICT (slug) DO NOTHING;\n`;
  }

  // Usuários
  sql += '\n-- Inserir Usuários\n';
  for (const user of users || []) {
    const escapedName = (user.name || '').replace(/'/g, "''");
    const escapedEmail = (user.email || '').replace(/'/g, "''");
    sql += `INSERT INTO "User" (id, email, name, role, is_ghost_user, fpTotal, fpAvailable, createdAt, updatedAt) VALUES ('${user.id}', '${escapedEmail}', '${escapedName}', '${user.role}', ${user.is_ghost_user}, ${user.fpTotal}, ${user.fpAvailable}, '${user.createdAt}', '${user.updatedAt}') ON CONFLICT (id) DO NOTHING;\n`;
  }

  // Posts
  sql += '\n-- Inserir Posts\n';
  for (const post of posts || []) {
    const escapedContent = post.content.replace(/'/g, "''");
    sql += `INSERT INTO "Post" (id, content, "arenaId", "userId", "isAIResponse", "isPublished", "isApproved", "createdAt", "updatedAt") VALUES ('${post.id}', '${escapedContent}', '${post.arenaId}', '${post.userId}', ${post.isAIResponse}, ${post.isPublished}, ${post.isApproved}, '${post.createdAt}', '${post.updatedAt}') ON CONFLICT (id) DO NOTHING;\n`;
  }

  // Escrever em arquivo
  fs.writeFileSync('/tmp/insert-docker-data.sql', sql);
  console.log('\n✅ SQL gerado com sucesso!');
  console.log(`Arquivo: /tmp/insert-docker-data.sql`);
  console.log(`Linhas: ${sql.split('\n').length}`);
}

generateSQL().catch(console.error);
