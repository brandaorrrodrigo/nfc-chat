/**
 * Verificar posts inseridos no Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPosts() {
  console.log('🔍 Verificando posts no Supabase...\n');

  // 1. Total de posts
  const { count: totalPosts } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true });

  console.log(`📝 Total de Posts: ${totalPosts}`);

  // 2. Total de comentários
  const { count: totalComments } = await supabase
    .from('Comment')
    .select('*', { count: 'exact', head: true });

  console.log(`💬 Total de Comentários: ${totalComments}\n`);

  // 3. Posts recentes (últimos 10)
  const { data: recentPosts } = await supabase
    .from('Post')
    .select('id, content, createdAt, arenaId, userId')
    .order('createdAt', { ascending: false })
    .limit(10);

  console.log('🆕 Últimos 10 posts criados:\n');
  recentPosts?.forEach((post: any, idx: number) => {
    console.log(`${idx + 1}. ${post.content.substring(0, 60)}...`);
    console.log(`   Arena: ${post.arenaId} | User: ${post.userId}`);
    console.log(`   Criado: ${new Date(post.createdAt).toLocaleString()}\n`);
  });

  // 4. Arenas com mais posts
  const { data: arenas } = await supabase
    .from('Arena')
    .select('name, slug, totalPosts, totalComments')
    .order('totalPosts', { ascending: false })
    .limit(10);

  console.log('🏆 Top 10 Arenas com mais posts:\n');
  arenas?.forEach((arena: any, idx: number) => {
    console.log(`${idx + 1}. ${arena.name}: ${arena.totalPosts} posts, ${arena.totalComments} comentários`);
  });
}

checkPosts().catch(console.error);
