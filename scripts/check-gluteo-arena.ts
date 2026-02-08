/**
 * Verificar posts da arena de glúteo
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGluteoArena() {
  console.log('🔍 Verificando arena de Glúteo...\n');

  // 1. Buscar arena
  const { data: arenas } = await supabase
    .from('Arena')
    .select('*')
    .or('slug.ilike.%gluteo%,name.ilike.%gluteo%');

  console.log(`🏟️  Arenas encontradas com "gluteo":\n`);
  arenas?.forEach((arena: any) => {
    console.log(`   - ${arena.name}`);
    console.log(`     Slug: ${arena.slug}`);
    console.log(`     Posts: ${arena.totalPosts} | Comentários: ${arena.totalComments}`);
    console.log(`     URL: http://localhost:3000/comunidades/${arena.slug}\n`);
  });

  if (!arenas || arenas.length === 0) {
    console.log('❌ Nenhuma arena encontrada com "gluteo"\n');
    return;
  }

  // 2. Buscar posts da primeira arena de glúteo
  const gluteoArena = arenas[0];

  const { data: posts } = await supabase
    .from('Post')
    .select('id, content, createdAt, isPublished')
    .eq('arenaId', gluteoArena.id)
    .eq('isPublished', true)
    .order('createdAt', { ascending: false })
    .limit(5);

  console.log(`📝 Últimos 5 posts da arena "${gluteoArena.name}":\n`);

  if (!posts || posts.length === 0) {
    console.log('❌ Nenhum post encontrado!\n');
    return;
  }

  for (const post of posts) {
    console.log(`   ${post.content.substring(0, 80)}...`);
    console.log(`   Criado: ${new Date(post.createdAt).toLocaleString()}\n`);

    // Buscar comentários deste post
    const { count } = await supabase
      .from('Comment')
      .select('*', { count: 'exact', head: true })
      .eq('postId', post.id);

    console.log(`   💬 ${count} comentários\n`);
  }
}

checkGluteoArena().catch(console.error);
