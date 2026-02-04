/**
 * GERADOR DE SQL - COMPATÍVEL COM SCHEMA REAL
 */

import * as fs from 'fs';

// Função para sanitizar texto e garantir encoding correto
function sanitizeText(text: string): string {
  return text
    .replace(/'/g, "''")  // Escapar aspas simples
    .normalize('NFC');     // Normalizar Unicode
}

console.log('🔧 Gerando SQL compatível com schema real...\n');

const ARENAS = [
  'postura', 'lipedema', 'hipercifose', 'compressao',
  'menstrual', 'gluteo_medio', 'miofascial', 'desvio_bacia',
];

let sql = '';

sql += `-- ════════════════════════════════════════════════════════\n`;
sql += `-- IMPORTAÇÃO 8 ARENAS - NUTRIFIT COMMUNITIES\n`;
sql += `-- ════════════════════════════════════════════════════════\n\n`;

// Adicionar colunas necessárias
sql += `-- Adicionar campos necessários\n`;
sql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS is_ghost_user BOOLEAN DEFAULT false;\n`;
sql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS username TEXT;\n`;
sql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS bio TEXT;\n`;
sql += `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS avatar_url TEXT;\n\n`;

// Criar as 8 arenas
sql += `-- Criar as 8 arenas\n`;
const arenas = [
  { id: 'arena_postura', slug: 'barriga-pochete-postura', name: 'Barriga Pochete', category: 'postura', description: 'Discussões sobre postura e barriga projetada' },
  { id: 'arena_lipedema', slug: 'musculacao-lipedema', name: 'Musculação Lipedema', category: 'lipedema', description: 'Como treinar com lipedema' },
  { id: 'arena_hipercifose', slug: 'hipercifose-drenagem', name: 'Hipercifose Drenagem', category: 'hipercifose', description: 'Hipercifose e drenagem corporal' },
  { id: 'arena_compressao', slug: 'meia-compressao-treino', name: 'Meia Compressão', category: 'compressao', description: 'Treinar com meia de compressão' },
  { id: 'arena_menstrual', slug: 'lipedema-dor-menstrual', name: 'Dor Menstrual', category: 'menstrual', description: 'Dor nos nódulos no período menstrual' },
  { id: 'arena_gluteo_medio', slug: 'gluteo-medio-valgo', name: 'Glúteo Médio/Valgo', category: 'gluteo_medio', description: 'Glúteo médio e valgo dinâmico' },
  { id: 'arena_miofascial', slug: 'liberacao-miofascial-lipedema', name: 'Liberação Miofascial', category: 'miofascial', description: 'Liberação miofascial para lipedema' },
  { id: 'arena_desvio_bacia', slug: 'desvio-bacia-gordura', name: 'Desvio de Bacia', category: 'desvio_bacia', description: 'Desvio de bacia vs gordura localizada' },
];

const arenaMap: Record<string, string> = {};
arenas.forEach(arena => {
  arenaMap[arena.slug] = arena.id;
  sql += `INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")\n`;
  sql += `VALUES (\n`;
  sql += `  '${arena.id}',\n`;
  sql += `  '${arena.slug}',\n`;
  sql += `  '${arena.name}',\n`;
  sql += `  '${arena.description}',\n`;
  sql += `  '💬',\n`;
  sql += `  '#8B5CF6',\n`;
  sql += `  '${arena.category}',\n`;
  sql += `  true,\n`;
  sql += `  NOW(),\n`;
  sql += `  NOW()\n`;
  sql += `) ON CONFLICT (id) DO UPDATE SET\n`;
  sql += `  slug = EXCLUDED.slug,\n`;
  sql += `  name = EXCLUDED.name,\n`;
  sql += `  description = EXCLUDED.description;\n\n`;
});
sql += `\n`;

// Criar tabela de mensagens
sql += `-- Criar tabela de mensagens\n`;
sql += `CREATE TABLE IF NOT EXISTS nfc_chat_messages (\n`;
sql += `    id TEXT PRIMARY KEY,\n`;
sql += `    comunidade_slug TEXT NOT NULL,\n`;
sql += `    post_id TEXT,\n`;
sql += `    author_id TEXT NOT NULL,\n`;
sql += `    author_name TEXT NOT NULL,\n`;
sql += `    content TEXT NOT NULL,\n`;
sql += `    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n`;
sql += `    is_ia BOOLEAN DEFAULT false\n`;
sql += `);\n\n`;

sql += `CREATE INDEX IF NOT EXISTS idx_chat_comunidade ON nfc_chat_messages(comunidade_slug);\n`;
sql += `CREATE INDEX IF NOT EXISTS idx_chat_post ON nfc_chat_messages(post_id);\n\n`;

let totalUsers = 0;
let totalThreads = 0;
let totalMensagens = 0;

ARENAS.forEach((arena, index) => {
  const filename = `../arena-${arena}-dados.json`;
  console.log(`[${index + 1}/8] ${arena}...`);

  try {
    const dados = JSON.parse(fs.readFileSync(filename, 'utf-8'));

    sql += `\n-- ════ ARENA ${index + 1}: ${dados.arena.nome} ════\n\n`;

    // Ghost Users (simplificado)
    dados.ghostUsers.forEach((user: any) => {
      const bio = sanitizeText(user.bio || '');
      sql += `INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")\n`;
      sql += `VALUES (\n`;
      sql += `  '${user.id}',\n`;
      sql += `  '${user.email}',\n`;
      sql += `  '${user.name}',\n`;
      sql += `  '${user.username}',\n`;
      sql += `  '${user.avatar_url}',\n`;
      sql += `  '${bio}',\n`;
      sql += `  true,\n`;
      sql += `  NOW(),\n`;
      sql += `  NOW()\n`;
      sql += `) ON CONFLICT (id) DO UPDATE SET\n`;
      sql += `  username = EXCLUDED.username,\n`;
      sql += `  avatar_url = EXCLUDED.avatar_url,\n`;
      sql += `  bio = EXCLUDED.bio,\n`;
      sql += `  is_ghost_user = EXCLUDED.is_ghost_user;\n\n`;
    });
    totalUsers += dados.ghostUsers.length;

    // Threads/Posts
    dados.threads.forEach((thread: any) => {
      const title = sanitizeText(thread.title);
      const content = sanitizeText(thread.content);
      // Concatenar título no início do conteúdo
      const fullContent = `${title}\n\n${content}`;
      const arenaId = arenaMap[thread.arena_slug];

      sql += `INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")\n`;
      sql += `VALUES (\n`;
      sql += `  '${thread.id}',\n`;
      sql += `  '${arenaId}',\n`;
      sql += `  '${thread.user_id}',\n`;
      sql += `  '${fullContent}',\n`;
      sql += `  true,\n`;
      sql += `  '${thread.created_at}'::timestamptz,\n`;
      sql += `  '${thread.created_at}'::timestamptz\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });
    totalThreads += dados.threads.length;

    // Mensagens
    dados.mensagens.forEach((msg: any) => {
      const content = sanitizeText(msg.content);
      const authorName = sanitizeText(msg.author_name);
      sql += `INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)\n`;
      sql += `VALUES (\n`;
      sql += `  '${msg.id}',\n`;
      sql += `  '${msg.comunidade_slug}',\n`;
      sql += `  ${msg.post_id ? `'${msg.post_id}'` : 'NULL'},\n`;
      sql += `  '${msg.author_id}',\n`;
      sql += `  '${authorName}',\n`;
      sql += `  '${content}',\n`;
      sql += `  '${msg.created_at}'::timestamptz,\n`;
      sql += `  ${msg.is_ia}\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    });
    totalMensagens += dados.mensagens.length;

    console.log(`   ✅ ${dados.ghostUsers.length} users, ${dados.threads.length} threads, ${dados.mensagens.length} msgs`);

  } catch (error) {
    console.error(`   ❌ ${error}`);
  }
});

sql += `\n-- ════════════════════════════════════════════════════════\n`;
sql += `-- RESUMO: ${totalUsers} users | ${totalThreads} threads | ${totalMensagens} msgs\n`;
sql += `-- ════════════════════════════════════════════════════════\n`;

fs.writeFileSync('IMPORT_FINAL.sql', sql, { encoding: 'utf-8' });

console.log(`\n✅ Arquivo gerado: IMPORT_FINAL.sql`);
console.log(`📊 Total: ${totalUsers} users, ${totalThreads} threads, ${totalMensagens} mensagens\n`);
console.log(`💡 Execute no Supabase SQL Editor:\n`);
console.log(`   1. Copie todo o conteúdo de IMPORT_FINAL.sql`);
console.log(`   2. Cole no SQL Editor`);
console.log(`   3. Clique em RUN\n`);
