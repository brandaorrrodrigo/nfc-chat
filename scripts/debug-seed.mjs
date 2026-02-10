#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function debug() {
  console.log('🔍 DEBUG: Testando inserção de post\n');

  // 1. Check arena
  console.log('1. Procurando arena performance-biohacking...');
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name')
    .eq('slug', 'performance-biohacking');

  if (arenaError) {
    console.log('   ❌ Erro ao buscar arena:', arenaError);
    process.exit(1);
  }

  if (!arenas || arenas.length === 0) {
    console.log('   ❌ Arena não encontrada');
    process.exit(1);
  }

  const arena = arenas[0];
  console.log(`   ✅ Encontrada: ${arena.id} - ${arena.name}\n`);

  // 2. Check user
  console.log('2. Procurando usuário ai-facilitator...');
  const { data: users, error: userError } = await supabase
    .from('User')
    .select('id')
    .eq('id', 'ai-facilitator');

  if (userError) {
    console.log('   ❌ Erro ao buscar usuário:', userError);
  } else if (!users || users.length === 0) {
    console.log('   ❌ Usuário não encontrado');
  } else {
    console.log(`   ✅ Usuário encontrado: ${users[0].id}\n`);
  }

  // 3. Try inserting a test post
  console.log('3. Tentando inserir um post de teste...');
  const testPostId = randomUUID();
  const { data: insertResult, error: insertError } = await supabase
    .from('Post')
    .insert({
      id: testPostId,
      content: 'Este é um post de teste',
      arenaId: arena.id,
      userId: 'ai-facilitator',
      isPublished: true,
      isPinned: false,
      isOfficial: true,
      isAIResponse: false,
      isApproved: true,
      viewCount: 0,
      likeCount: 0,
    })
    .select();

  if (insertError) {
    console.log('   ❌ Erro ao inserir:', insertError.message);
    console.log('   Detalhes:', insertError);
    process.exit(1);
  } else {
    console.log('   ✅ Post inserido com sucesso!');
    console.log('   ID:', testPostId);
    process.exit(0);
  }
}

debug().catch((error) => {
  console.error('❌ ERRO FATAL:', error.message);
  process.exit(1);
});
