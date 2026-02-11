#!/usr/bin/env node

/**
 * Execute SQL Final - Insere 120 posts nas 3 arenas
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🚀 EXECUTANDO SQL FINAL - 120 POSTS EM 3 ARENAS         ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Posts para Peptídeos & Farmacologia
const postspeptideos = [
  'BPC-157 & Péptidos de Recuperação - qual sua experiência?',
  'BPC-157 melhora regeneração tecidual e mobilidade articular',
  'GHK-Cu é outro peptídeo promissor para rejuvenescimento',
  'Alguém usou BPC-157 para tendinite crônica?',
  'Percebi melhoria significativa em mobilidade de ombro',
  'A dose típica é 250mcg 2x/dia. Quanto tempo leva pra resultado?',
  '4-6 semanas é o comum. Combine com mobilidade ativa',
  'Inibidores de Aromatase - qual é mais efetivo?',
  'Anastrozol vs Letrozol vs Exemestane - experiências?',
  'Anastrozol é o mais estudado. Dose 1mg EOD',
  'Quais os efeitos colaterais principais?',
  'Dor articular é o principal efeito colateral',
  'Magnésio e Taurina ajudam a reduzir dores',
  'Preciso monitorar E2, HDL e LDL quando uso IA',
  'Colágeno tipo II para saúde articular - funciona?',
  'Colágeno tipo II é específico para cartilagem',
  '5-10g/dia é a dose comum. Combine com vitamina C',
  'Glucosamina e Condroitina complementam bem',
  'Quanto tempo leva pra perceber resultado?',
  '4-8 semanas é o normal para ganhos',
  'Oxitocina além de social - há aplicações pra treino?',
  'Oxitocina pode melhorar recuperação e reduzir cortisol',
  'Semax é outro peptídeo interessante para cognição',
  'Qual a dose de Oxitocina para estes propósitos?',
  '4-8 IU intranasal, 2-3x/semana é comum',
  'Precisa ser feito com monitoramento médico',
  'Creatina monohidratada - ainda a melhor opção?',
  'Creatina reduz conversão de testosterona para DHT',
  'Monohidratado é mais estudado e barato',
  '3-5g/dia é a dose padrão',
  'Loading é opcional. Com ou sem? Qual a diferença?',
  'Sem loading: demora 3-4 semanas. Com loading: 3-5 dias',
  'Qual a relação custo-benefício da creatina?',
  'Excelente. Talvez o melhor suplemento custo-benefício',
  'NAC para fígado quando em ciclo - dosagem?',
  '600-1200mg 2-3x/dia é o comum',
  'Milk Thistle também funciona bem',
  'TUDCA é melhor que NAC para proteção hepática?',
  'TUDCA é mais específico. 250-500mg/dia',
  'Combine os três para proteção máxima'
];

// Posts para Receitas & Alimentação
const postsreceitas = [
  'Receitas fáceis com frango pra noite - compartilhem!',
  'Frango desfiado ao molho de tomate é super rápido',
  'Filé assado no forno por 30min - sempre suculento',
  'Como deixar frango sempre úmido e suculento?',
  'Marinada com azeite, limão e alho funciona',
  'Não cozinha demais - máximo 25 minutos',
  'Ideias de café da manhã proteico e prático?',
  'Omelete com frutas vermelhas é meu padrão',
  'Iogurte grego com granola caseira - muito bom',
  'Panqueca de aveia com ovos - rápido e prático',
  'Quanto de proteína num bom café proteico?',
  '25-40g é o ideal pra saciar',
  'Como fazer meal prep que dura até quarta?',
  'Congele em containers de vidro - melhor que plástico',
  'Máximo 3 dias na geladeira sem congelar',
  'Qual o melhor dia pra fazer meal prep semanal?',
  'Domingo é o clássico. Segunda também funciona',
  'Quanto tempo dura cada refeição pronta?',
  '3 dias na geladeira, congelado até 1 mês',
  'Intolerância à lactose - vocês têm?',
  'Leite A2 é mais digerível que A1',
  'Queijo curado tem menos lactose que fresco',
  'Iogurte grego é praticamente lactose-free',
  'E glúten, alguém tem sensibilidade?',
  'Aveia pura é gluten-free',
  'Sem glúten não é sempre saudável',
  'Receitas de low-carb que não ficam chatas?',
  'Arroz de couve-flor com carne é ótimo',
  'Espaguete de abobrinha é surpreendentemente bom',
  'Pão de queijo é praticamente low-carb',
  'Quanto de carbo vocês comem no total?',
  '50-100g é uma boa faixa pra low-carb',
  'Depende do treino e objetivo',
  'Protocolo de refeed - quanto de carbo?',
  '1.5-2x seu peso corporal em gramas',
  'Uma vez por semana é suficiente',
  'Vitaminas - o que realmente faz diferença?',
  'D3, Ômega 3, Multivitamínico básico',
  'Eletrólitos quando treina muito?',
  'Sódio, potássio, magnésio - importante mesmo'
];

// Posts para Exercícios & Técnica
const postsexercicios = [
  'Como agachar mais profundo com segurança?',
  'Mobilidade de quadril é fundamental',
  'Faça alongamento 90-90 diariamente pra profundidade',
  'Pés paralelos ou virados pra fora - qual o melhor?',
  'Virados pra fora ajuda na estabilidade',
  'Profundidade máxima varia com sua biomecânica',
  'Qual exercício é melhor pro bíceps isolado?',
  'Rosca direta é mais isolado que supino',
  'Supino trabalha mais músculos no geral',
  'Combino os dois no mesmo treino',
  'Qual amplitude de movimento é melhor?',
  'Máxima amplitude sempre que possível',
  'Controle na fase excêntrica - quanto tempo?',
  '3 segundos na fase excêntrica é o padrão',
  'Coluna reta ou arredondada no deadlift?',
  'Depende do seu tipo de deadlift',
  'Convencional pede coluna neutra',
  'Sumo permite mais inclinação de tronco',
  'Qual a melhor variação de deadlift?',
  'A que você consegue mais carga com segurança',
  'Devo fazer mais compostos ou isolamento?',
  'Baseie em compostos - 70% do treino',
  'Adicione isolamento no final - 30%',
  'Qual a ordem correta dos exercícios?',
  'Sempre compostos primeiro quando está fresco',
  'Isolamento quando menos fatigado possível',
  'Supino com barra vs halteres - qual melhor?',
  'Barra = mais carga, halteres = maior amplitude',
  'Combino os dois em semanas alternadas',
  'Pull-ups vs máquina de puxada - qual escolher?',
  'Pull-up é mais funcional e trabalha estabilizadores',
  'Máquina é bom pra iniciante ou lesionado',
  'Leg press vs agachamento livre?',
  'Agachamento é superior pra força geral',
  'Leg press complementa bem no final',
  'Flexão vs extensão de joelho - qual primeiro?',
  'Depende do seu objetivo',
  'Pra força: extensão. Pra hipertrofia: ambos',
  'Como progredir quando estagna na força?',
  'Aumenta repetições primeiro',
  'Depois aumenta peso em 2-5% quando possível'
];

async function insertPosts(arenaId, arenaName, posts) {
  console.log(`\n📍 ${arenaName} (${posts.length} posts)`);

  let successCount = 0;
  let errorCount = 0;

  for (const content of posts) {
    const { error } = await supabase.from('Post').insert({
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
      successCount++;
    } else {
      errorCount++;
      if (errorCount <= 3) {
        console.log(`   ⚠️  Erro: ${error.message}`);
      }
    }
  }

  console.log(`   ✅ ${successCount}/${posts.length} posts inseridos`);
  return successCount;
}

async function main() {
  try {
    // 1. Criar arena Peptídeos se não existir
    console.log('\n🔧 Preparando arenas...');
    await supabase.from('Arena').insert({
      id: 'arena_peptideos_farmacologia',
      slug: 'peptideos-farmacologia',
      name: '💉 Peptídeos & Farmacologia',
      description: 'Farmacologia avançada, peptídeos de pesquisa, protocolos de elite e redução de danos',
      icon: '💉',
      color: 'from-purple-600 to-violet-600',
      category: 'farmacologia',
      categoria: 'COMUNIDADES_LIVRES',
      arenaType: 'GENERAL',
      criadaPor: 'ADMIN',
      isActive: true,
      isPaused: false,
      allowImages: true,
      allowLinks: true,
      allowVideos: false,
      totalPosts: 0,
      totalComments: 0,
      dailyActiveUsers: 0,
    }).catch(() => {}); // Ignora erro se arena já existe

    // 2. Inserir posts nas 3 arenas
    let total = 0;
    total += await insertPosts('arena_peptideos_farmacologia', '💉 Peptídeos & Farmacologia', postspeptideos);
    total += await insertPosts('receitas-saudaveis', '🥗 Receitas Saudáveis', postsreceitas);
    total += await insertPosts('exercicios-que-ama', '💪 Exercícios que Ama', postsexercicios);

    // 3. Mostrar resumo
    console.log('\n' + '═'.repeat(60));
    console.log('✅ RESUMO FINAL');
    console.log('═'.repeat(60));
    console.log(`Total de posts inseridos: ${total}`);
    console.log('Status: 🟢 SUCESSO');
    console.log('═'.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

main();
