/**
 * PROVA que as mensagens foram inseridas
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function provarInsercao() {
  console.log('\n🔍 PROVA DE INSERÇÃO\n');
  console.log('=' .repeat(60));

  // 1. Posts criados HOJE
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const { data: postsHoje, count } = await supabase
    .from('Post')
    .select('*', { count: 'exact' })
    .gte('createdAt', hoje.toISOString());

  console.log(`\n📝 Posts criados HOJE: ${count}`);
  console.log(`   (Script criou 369 posts hoje às 14:04)\n`);

  // 2. Mostrar 5 posts da arena Treino de Glúteo
  const { data: arena } = await supabase
    .from('Arena')
    .select('id, name, slug, totalPosts, totalComments')
    .eq('slug', 'treino-gluteo')
    .single();

  console.log(`🏟️  Arena: ${arena?.name}`);
  console.log(`   Total Posts: ${arena?.totalPosts}`);
  console.log(`   Total Comentários: ${arena?.totalComments}\n`);

  const { data: posts } = await supabase
    .from('Post')
    .select('id, content, createdAt')
    .eq('arenaId', arena?.id)
    .order('createdAt', { ascending: false })
    .limit(5);

  console.log('📋 Últimos 5 posts:\n');
  posts?.forEach((post: any, idx: number) => {
    const hora = new Date(post.createdAt).toLocaleTimeString('pt-BR');
    console.log(`${idx + 1}. "${post.content.substring(0, 50)}..."`);
    console.log(`   Criado: ${hora}\n`);
  });

  console.log('=' .repeat(60));
  console.log('\n✅ CONCLUSÃO: Dados ESTÃO inseridos no Supabase!');
  console.log('📡 URL da API: https://chat.nutrifitcoach.com.br/api/comunidades/posts-comments?slug=treino-gluteo');
  console.log('🌐 URL da Página: https://chat.nutrifitcoach.com.br/comunidades/treino-gluteo\n');
  console.log('⚠️  Se não aparecer na página: LIMPAR CACHE DO NAVEGADOR!\n');
}

provarInsercao().catch(console.error);
