#!/usr/bin/env node

/**
 * Execute All 4 Seeds via Supabase SDK
 * ===================================
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SEEDS = [
  {
    name: 'Performance & Biohacking',
    slug: 'performance-biohacking',
    threads: [
      {
        title: 'Periodização Avançada',
        posts: [
          'Qual é melhor? Block Periodization vs Conjugate Method?',
          'Block periodization melhora força máxima mais rápido',
          'Conjugate é mais seguro para longo prazo',
          'Combino os dois em ciclos de 12 semanas',
          'Qual deload vocês fazem entre blocos?',
          'Uma semana com 50% do volume costuma ser suficiente',
        ],
      },
      {
        title: 'Treinamento em Altitude',
        posts: [
          'Alguém tem experiência com altitude training?',
          'Melhora VO2 máx e resistência aeróbica',
          '2000-3000m é o ideal para maioria',
          'Passei 3 semanas em Bogotá, resultado ótimo',
          'Quanto tempo leva pra adaptação?',
          '2-3 semanas em média, depende da altitude',
        ],
      },
      {
        title: 'Suplementação com Nitratos',
        posts: [
          'Suco de beterraba vs suplementos de nitrato?',
          'Suplementos são mais concentrados',
          '500mg de nitrato/dia é a dose comum',
          'Melhora performance cardio em ~3-5%',
          'Qual a melhor marca de suplemento?',
          'Beetroot juice é mais barato e natural',
        ],
      },
      {
        title: 'GH Secretagogues',
        posts: [
          'GHRP vs GHRH - qual combinar?',
          'GHRP-6 com CJC-1295 é muito bom',
          'MK-677 é oral e mais conveniente',
          'Qual o protocolo ideal?',
          '5mg MK-677 antes de dormir',
          'Resultado em ~4-6 semanas',
        ],
      },
      {
        title: 'Harm Reduction Protocols',
        posts: [
          'Como minimizar riscos com PEDs?',
          'Monitoramento regular é essencial',
          'Exames de sangue a cada 4 semanas',
          'Proteção hepática é fundamental',
          'Qual suplemento para liver?',
          'NAC, Milk Thistle, TUDCA funcionam bem',
        ],
      },
    ],
  },
  {
    name: 'Receitas & Alimentação',
    slug: 'receitas-saudaveis',
    threads: [
      {
        title: 'Frango - 10 Receitas',
        posts: [
          'Receitas fáceis com frango a noite?',
          'Frango desfiado ao molho de tomate é rápido',
          'Parem assado no forno por 30min',
          'Como deixar frango suculento?',
          'Marinada com azeite e limão ajuda',
          'Não cozinha demais, máx 25min',
        ],
      },
      {
        title: 'Café da Manhã Proteico',
        posts: [
          'Ideias pra café da manhã com proteína?',
          'Omelete com frutas vermelhas',
          'Iogurte grego com granola caseira',
          'Panqueca de aveia com ovos',
          'Quanto de proteína num bom café?',
          '25-40g é o ideal',
        ],
      },
      {
        title: 'Meal Prep Semanal',
        posts: [
          'Como fazer meal prep que não estraga?',
          'Congele em containers de vidro',
          'Máx 3 dias na geladeira',
          'Qual melhor dia pra preparar?',
          'Domingo é o clássico',
          'Segunda pra quarta é o máximo',
        ],
      },
      {
        title: 'Tolerância a Alimentos',
        posts: [
          'Intolerância a lactose - sou assim',
          'Leite A2 é mais digestível',
          'Queijo curado tem menos lactose',
          'Iogurte grego também é bom',
          'E glúten, vocês têm sensibilidade?',
          'Aveia pura é gluten free',
        ],
      },
      {
        title: 'Receitas Low-Carb',
        posts: [
          'Receitas boas de low-carb sem ficar chato?',
          'Arroz de couve-flor com carne',
          'Espaguete de abobrinha é ótimo',
          'Pão de queijo é low-carb',
          'Quanto de carb vocês comem?',
          '50-100g é uma boa faixa',
        ],
      },
    ],
  },
  {
    name: 'Exercícios & Técnica',
    slug: 'exercicios-que-ama',
    threads: [
      {
        title: 'Agachamento Profundo',
        posts: [
          'Como agachar mais profundo com segurança?',
          'Mobilidade de quadril é fundamental',
          'Faça alongamento 90-90 diariamente',
          'Pés paralelos ou ligeiramente virados?',
          'Virados pra fora ajuda na estabilidade',
          'Profundidade máxima varia com biomecanics',
        ],
      },
      {
        title: 'Rosca Direta vs Supino',
        posts: [
          'Qual exercício é melhor pro bíceps?',
          'Rosca direta é mais isolado',
          'Supino trabalha mais músculos',
          'Combino os dois no treino',
          'Qual amplitudede movimento?',
          'Máxima amplitude sempre que possível',
        ],
      },
      {
        title: 'Deadlift - Técnica Completa',
        posts: [
          'Coluna reta ou arredondada no deadlift?',
          'Depende do seu tipo de deadlift',
          'Convencional pede coluna neutra',
          'Sumo permite mais inclinação',
          'Qual a melhor variação?',
          'A que você consegue mais carga',
        ],
      },
      {
        title: 'Isolamento vs Compostos',
        posts: [
          'Devo fazer mais compostos ou isolamento?',
          'Baseie em compostos (70%)',
          'Adicione isolamento no final (30%)',
          'Qual ordem no treino?',
          'Sempre compostos primeiro',
          'Isolamento quando menos fatigado possível',
        ],
      },
      {
        title: 'Progressão de Carga',
        posts: [
          'Como progredir quando estagna?',
          'Aumenta repetições primeiro',
          'Depois aumenta peso em 2-5%',
          'Mude ângulo do exercício',
          'Tempo sob tensão também conta',
          'Controle de 3s na fase excêntrica',
        ],
      },
    ],
  },
];

async function insertSeed(seedConfig) {
  const { name, slug, threads } = seedConfig;

  console.log(`\n📍 ${name}`);

  // Get arena ID
  const { data: arena } = await supabase
    .from('Arena')
    .select('id')
    .eq('slug', slug)
    .single();

  if (!arena) {
    console.log(`   ❌ Arena não encontrada: ${slug}`);
    return 0;
  }

  const arenaId = arena.id;
  let postCount = 0;

  for (const thread of threads) {
    for (const content of thread.posts) {
      const { error } = await supabase.from('Post').insert({
        id: randomUUID(),
        content,
        arenaId,
        userId: 'ai-facilitator',
        isPublished: true,
        isPinned: false,
        isOfficial: true,
        isAIResponse: false,
        isApproved: true,
        viewCount: Math.floor(Math.random() * 50),
        likeCount: Math.floor(Math.random() * 25),
      });

      if (!error) {
        postCount++;
      }
    }
  }

  console.log(`   ✅ ${postCount} posts criados`);
  return postCount;
}

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🚀 EXECUTANDO SEEDS VIA SUPABASE SDK  ║');
  console.log('╚════════════════════════════════════════╝');

  let totalPosts = 0;

  for (const seed of SEEDS) {
    const count = await insertSeed(seed);
    totalPosts += count;
  }

  console.log(`\n${'═'.repeat(40)}`);
  console.log(`✅ TOTAL: ${totalPosts} posts criados`);
  console.log(`${'═'.repeat(40)}\n`);

  process.exit(totalPosts > 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('❌ ERRO:', error.message);
  process.exit(1);
});
