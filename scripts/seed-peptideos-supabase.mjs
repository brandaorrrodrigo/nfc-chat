#!/usr/bin/env node

/**
 * Seed: Peptídeos & Farmacologia (via Supabase SDK)
 * ================================================
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ARENA_SLUG = 'peptideos-farmacologia';
const ARENA_NAME = 'Peptídeos & Farmacologia';
const USER_ID = 'ai-facilitator'; // IA user

async function main() {
  console.log(`🧬 SEED: ${ARENA_NAME}\n`);

  try {
    // 1. Verificar se arena existe
    const { data: existingArena } = await supabase
      .from('Arena')
      .select('id')
      .eq('slug', ARENA_SLUG)
      .single();

    let arenaId;

    if (existingArena) {
      arenaId = existingArena.id;
      console.log(`✅ Arena encontrada: ${arenaId}\n`);
    } else {
      console.log(`❌ Arena não encontrada. Execute primeiramente.`);
      process.exit(1);
    }

    // 2. Posts para inserir
    const threads = [
      {
        title: 'BPC-157 & Péptidos de Recuperação',
        posts: [
          { author: 'Coach', content: 'BPC-157 é estudado para regeneração tecidual e mobilidade articular. Qual sua experiência?' },
          { author: 'User1', content: 'Tomei por 4 semanas, melhoria real em dor de ombro crônica. Recomendo!' },
          { author: 'Coach', content: 'GHK-Cu é outro peptídeo com aplicações interessantes. Alguém usou?' },
          { author: 'User2', content: 'Tb testei BPC-157, percebi melhoria em recuperação pós-treino' },
          { author: 'Coach', content: 'A dose típica é 250mcg 2x/dia. Que resultados vocês tiveram?' },
          { author: 'User3', content: 'Excelente para tendinite. Muito efetivo mesmo!' },
        ],
      },
      {
        title: 'Inibidores de Aromatase & Otimização Hormonal',
        posts: [
          { author: 'Coach', content: 'Anastrozol vs Letrozol vs Exemestane - qual é mais efetivo?' },
          { author: 'User1', content: 'Anastrozol é o mais estudado. Dose típica 1mg EOD ou ED' },
          { author: 'Coach', content: 'Quais os efeitos colaterais mais comuns?' },
          { author: 'User2', content: 'Dor articular é o principal. Magnésio e Taurina ajudam muito' },
          { author: 'User3', content: 'Preciso de cuidado com lipídios quando uso IA' },
          { author: 'Coach', content: 'Monitorar E2, LDL e HDL é essencial' },
        ],
      },
      {
        title: 'Colágeno e Peptídeos para Articulações',
        posts: [
          { author: 'Coach', content: 'Colágeno tipo II vs tipo I+III para saúde articular?' },
          { author: 'User1', content: 'Tipo II é específico para cartilagem. 5-10g/dia é a dose comum' },
          { author: 'User2', content: 'Combino com Glucosamina e Condroitina, resultado melhor' },
          { author: 'Coach', content: 'Quanto tempo leva para ver resultado?' },
          { author: 'User3', content: '4-8 semanas para perceber diferença' },
          { author: 'User1', content: 'Combinar com vitamina C melhora absorção e síntese' },
        ],
      },
      {
        title: 'Oxitocina & Peptídeos Neuroprotetivos',
        posts: [
          { author: 'Coach', content: 'Oxitocina além de social - há evidências pra treino?' },
          { author: 'User1', content: 'Pode melhorar recuperação e reduzir cortisol pós-treino' },
          { author: 'User2', content: 'Semax é outro peptídeo promissor para cognição' },
          { author: 'Coach', content: 'Qual a dose de Oxitocina para estes propósitos?' },
          { author: 'User3', content: '4-8 IU intranasal, 2-3x/semana é comum' },
          { author: 'User1', content: 'Precisa ser feito com cuidado e monitoramento' },
        ],
      },
      {
        title: 'Creatina & Fosfocreatina - Além do Básico',
        posts: [
          { author: 'Coach', content: 'Nova pesquisa sobre creatina e neuroproteção?' },
          { author: 'User1', content: 'Creatina reduz conversão de testosterona para DHT' },
          { author: 'User2', content: 'Monohidratado é mais estudado e barato' },
          { author: 'Coach', content: 'Quantos gramas/dia é recomendado?' },
          { author: 'User3', content: '3-5g/dia é a dose padrão. Loading é opcional' },
          { author: 'User1', content: 'Excelente relação custo-benefício' },
        ],
      },
    ];

    let totalPosts = 0;

    for (const thread of threads) {
      console.log(`📍 Thread: "${thread.title}"`);

      for (const post of thread.posts) {
        const { error } = await supabase.from('Post').insert({
          id: randomUUID(),
          content: post.content,
          arenaId: arenaId,
          userId: USER_ID,
          isPublished: true,
          isPinned: false,
          isOfficial: post.author === 'Coach',
          isAIResponse: post.author === 'Coach',
          isApproved: true,
          viewCount: Math.floor(Math.random() * 100),
          likeCount: Math.floor(Math.random() * 50),
        });

        if (error) {
          console.error(`   ❌ Erro ao inserir post: ${error.message}`);
        } else {
          totalPosts++;
        }
      }
    }

    console.log(`\n✅ ${totalPosts} posts criados na arena "${ARENA_NAME}"`);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ ERRO: ${error.message}`);
    process.exit(1);
  }
}

main();
