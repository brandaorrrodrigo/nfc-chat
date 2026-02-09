require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: Dor Menstrual
// ~32 posts em 8 conversas
// Foco: cólicas, dismenorreia, endometriose, ciclo menstrual,
// treino menstruado, nutrição anti-inflamatória, PMS,
// ciclo de performance, tratamentos
// ============================================================

const POSTS = [

  // CONVERSA 1: "Cólica menstrual — quando é normal?"
  {
    userId: 'user_sim_001',
    content: 'Tenho 26 anos e a minha cólica é tão intensa que tomo ibuprofeno de 6 em 6 horas, não consigo fazer nada. Algumas amigas dizem que cólica "forte" é normal, mas eu fico me perguntando se deveria investigar mais. Alguma menina aqui tem o mesmo problema? Como vocês lidam?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: 'Isso é bem comum — eu também tinha, mas descobri que é dismenorreia primária depois de vários testes. Fui em ginecologista que focava em saúde do ciclo e mudou tudo pra mim. Vale a pena investigar.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Giovana, excelente pergunta e super válido sua preocupação. Cólica normal: dor leve a moderada, controlável com movimento/calor/anti-inflamatório, não interfere atividades, cessa em 3-4 dias. Anormal (dismenorreia severa): dor incapacitante, comprome atividades, precisa medicação consistente, pode ter náusea/vômito. Duas categorias: Primária (maioria, sem causa estrutural, causada por prostaglandinas altas) e Secundária (tem causa: endometriose, miomas, adenomiose). Seu caso merece investigação com ginecologista que entenda ciclo menstrual.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: 'Nunca tinha ouvido falar em dismenorreia — vou marcar já com minha ginecologista. Valeu, espero que tenha solução mesmo.',
    isAIResponse: false,
  },

  // CONVERSA 2: "Treinar menstruada? Vale a pena?"
  {
    userId: 'user_sim_012',
    content: 'Eu tenho MUITO medo de treinar perto da menstruação. Medo de vazar (vergonha!), de piorar a cólica, de passar mal. Algumas instrutoras dizem pra "ouvir o corpo", mas aí a gente acaba não indo nunca. Alguém aqui treina mesmo menstruada? Como funciona?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: 'A melhor coisa que fiz foi treinar menstruada. No começo é estranho, mas a endorfina da atividade reduz a dor. Lógico que não faço agachamento pesado no primeiro dia, mas caminhada rápida, hidroginástica, yoga — muda tudo.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Thais, fatos científicos: Performance NÃO cai significativamente. Força máxima é praticamente igual em qualquer dia do ciclo. Treinar REDUZ dor (não aumenta) — atividade aeróbica aumenta endorfina e exercício de força reduz espasmo uterino. Saúde reprodutiva não é afetada — treinar menstruada não causa infecção ou distúrbios menstruais. Para vazamento: absorventes especiais (Modibodi, Thinx), coletor menstrual ou absorvente com calcinha de proteção. Programa inteligente: Dias 1-3 atividade leve (caminhada, yoga, natação). Dias 4-7 musculação moderada. Dias 8-14 MELHOR SEMANA pro treino pesado. Dias 15-28 atividade estável, evitar fadiga extrema.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: 'Não sabia que treinar REDUZ a dor... vou começar com caminhada mesmo, já comprei um coletor menstrual. Obrigada!',
    isAIResponse: false,
  },

  // CONVERSA 3: "Nutrição anti-cólica — o que realmente ajuda?"
  {
    userId: 'user_sim_018',
    content: 'Ouço muito falar em ômega-3, magnésio, cúrcuma pra cólica. Será que é realmente efetivo ou é só... marketing? Alguém aqui notou diferença real mudando a alimentação? Quanto tempo leva?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'Comecei com magnésio (400mg/dia) e depois de umas 2 semanas a cólica era MUITO mais leve. Minha ginecologista recomendou também — aparentemente magnésio reduz prostaglandinas.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Marina, há realmente EVIDÊNCIA CIENTÍFICA forte. Cólica menstrual é causada por prostaglandinas F (PGF2α) — moléculas inflamatórias. Ômega-3 (2-3g/dia): reduz dor em 30-50% após 2-3 ciclos. Magnésio (400-500mg/dia): reduz dor severa em 30-50%. Cúrcuma (500-1000mg/dia com piperina): reduz dor em 60%+. Vitamina D (4000 IU/dia) + Cálcio (1000mg/dia): reduz dor em 30%. Gengibre (1g/dia): similar a ibuprofeno. Protocolo: Semana 1-2 ômega-3 + cálcio + vit D. Semana 3-4 adicionar magnésio + cúrcuma + gengibre. Dias 1-3 menstruação continuar e aumentar gengibre em chá. Quanto tempo leva: gengibre 1-2 ciclos, magnésio 1-2 ciclos, ômega-3 2-3 ciclos, efeito máximo 3-4 ciclos.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_018',
    content: 'Protocolo muito claro. Vou começar com magnésio + ômega-3 e ver se consigo reduzir ibuprofeno. Obrigada pela quebra de galho!',
    isAIResponse: false,
  },

  // CONVERSA 4: "Endometriose — como saber se tenho?"
  {
    userId: 'user_sim_011',
    content: 'Minha cólica é tão forte que já passei mal em público. Minhas amigas dizem que pode ser endometriose porque minha mãe tem. Mas como eu sou magrinha e ativa, acho que é improvável? Quais são os sinais mesmo?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Tenho endometriose confirmada e posso te falar: magrinha/ativa NÃO exclui. A dor é avassaladora pra mim, e só descobri aos 24 anos quando fiz ressonância. Vale investigar mesmo.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Beatriz, endometriose é diagnosticada em média aos 7-10 anos APÓS início dos sintomas. Tecido endometrial cresce FORA do útero — nas trompas, ovários, peritônio. Afeta 10-15% das mulheres em idade reprodutiva. Sinais de alerta: Dor menstrual severa incapacitante, piora progressiva ao longo dos anos, dor além da menstruação, infertilidade inexplicada, fluxo muito pesado (duração >7 dias), fadiga crônica, depressão/ansiedade. MITO: "Se você é magra/ativa, não tem". FALSO — endometriose não discrimina por peso ou fitness. Como investigar: Entrevista clínica + exame pélvico, ultrassom transvaginal, ressonância magnética, laparoscopia (gold standard). Tratamentos: anti-inflamatório contínuo, hormônios (pílula contínua, DIU, implante), fisioterapia pélvica, nutrição anti-inflamatória, cirurgia se necessário.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: 'Vou marcar já — minha mãe também tinha dor forte, eu não sabia que historicamente familiar aumenta risco. Preciso investigar mesmo.',
    isAIResponse: false,
  },

  // CONVERSA 5: "PMS — é da mente ou é real?"
  {
    userId: 'user_sim_014',
    content: 'Uma semana antes da menstruação eu fico intolerante, como TUDO, gano 2-3kg de água, tenho insônia. Meus amigos brincam que "é a síndrome do mês" e isso me incomoda. Será que é real ou eu sou exagerada?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: 'É 100% real — meu ciclo é tão previsível que meus amigos brincam que conseguem "adivinhar" meus dias de TPM. Água, irritabilidade, craving de chocolate — tudo semanal.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Juliana, PMS é ABSOLUTAMENTE real, neurobiológico e até em primatas a gente vê comportamentos similares. Síndrome Pré-Menstrual: sintomas cíclicos na fase lútea, desaparecem com menstruação, afeta 50-80% das mulheres. Mecanismo: Hormônios flutuam (estrogênio e progesterona), serotonina cai (progesterona reduz triptofano), GABA reduz (menos calmante disponível), aldosterona sobe (retenção de água). Sintomas emocionais: irritabilidade, depressão, ansiedade, insônia, perda de libido. Sintomas físicos: inchaço, sensibilidade peito, retenção água (ganho 1-3kg é ÁGUA não gordura), fadiga, enxaqueca, dores articulares. Comportamentais: craving açúcar/gordura (corpo realmente queima 150-200kcal extra), isolamento, falta concentração. Estratégias: Magnésio 400mg, Vit B6 50-100mg, Cálcio 1200mg, reduzir sal semana -1, cardio/HIIT aumenta serotonina. Medicações se severo (TDPM): SSRIs, diuréticos, pílula hormonal contínua.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: 'Valeu pela validação. Vou começar com magnésio e vitamina B6, e também avisar meus amigos que é coisa de verdade. Cansada de ser ignorada quando falo disso.',
    isAIResponse: false,
  },

  // CONVERSA 6: "Ciclo irregular — quando deveria preocupar?"
  {
    userId: 'user_sim_016',
    content: 'Meu ciclo é super irregular — às vezes vem com 25 dias, às vezes 35. Treino pesado e como pouco (deficit calórico pra perder gordura). Minha amiga perdeu a menstruação completamente com treino pesado, isso pode acontecer comigo?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: 'Irregularidade é normal mas amenorreia (perder menstruação) é sinal de problema — geralmente não estou comendo o suficiente pra volume de treino. Aumentei ingestão e voltou tudo ao normal.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Carla, ciclo regular 21-35 dias é considerado normal. Ciclo irregular: variação de 8+ dias mês a mês. Amenorreia primária: nunca menstruou (raro). Amenorreia secundária: tinha ciclo, depois parou por 3+ meses (RED FLAG se relacionada a treino pesado + deficit calórico). Corpo para menstruação em "modo sobrevivência" — prioriza respiração > imunidade > reprodução. RED FLAG pra amenorreia: deficit >500kcal/dia + treino >10h/semana, gordura corporal <18%, baixa ingestão carboidrato, deficiência ferro/vitaminas. Você mencionou "treino pesado + como pouco" = RISCO ALTO. Problemas: curto prazo perda óssea, fadiga crônica, perda libido. Longo prazo: osteoporose precoce, infertilidade permanente, atrofia vaginal, doença cardíaca. Ação: aumentar calorias 300-500kcal, carboidrato 4-5g/kg, reduzir volume treino pra 6-8h/semana, rastrear ciclo, teste de hormônios se pausar 3+ meses.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: 'Não sabia que isso podia ser tão sério. Vou aumentar minhas calorias e focar em recuperação. Obrigada — melhor resolver agora que depois.',
    isAIResponse: false,
  },

  // CONVERSA 7: "Calor vs. Ibuprofeno — qual é melhor?"
  {
    userId: 'user_sim_010',
    content: 'Quando tenho cólica forte, minha avó manda bolsa de água quente e minha mãe fala pra tomar ibuprofeno. Qual funciona melhor? Posso usar os dois juntos ou causa algo?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: 'Bolsa quente me salva. Sigo uma rotina: bolsa por 20 min, depois 20 min de pausa. No primeiro dia de menstruação, com calor continuo não preciso de remédio.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Beatriz, funcionam de mecanismos diferentes. Ibuprofeno (AINE): bloqueia prostaglandinas, reduz inflamação e dor + contração uterina. Eficácia: reduz dor severa em 50-60%, melhor se tomado ANTES ou nos primeiros sinais, efeito em 30-45min, duração 6-8h. Dosagem: 400-600mg de 6 em 6h, máximo 2400mg/dia. Bolsa térmica: aumenta circulação local, relaxa musculatura, reduz desconforto + espasmo. Eficácia: 40-50%, equivalente a ibuprofeno em vários estudos, efeito em 10-15min, duração enquanto aplicada. Podem usar juntos? SIM, é seguro e recomendado — efeitos se complementam (prostaglandinas + relaxamento muscular). Protocolo: Leve-moderada: bolsa 20min aplicada/20min pausa ou banho quente. Moderada-severa: ibuprofeno 600mg IMEDIATAMENTE + bolsa quente. Severa: ibuprofeno 600mg + paracetamol 500mg juntos, bolsa quente contínua. Dicas: bolsa 40-45°C, 20min contínuo, dias 1-2 menstruação melhor, tomar ibuprofeno com comida/leite protege estômago, não tomar diariamente.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: 'Vou começar com bolsa quente + ibuprofeno então. Meus pais estavam ambos certos!',
    isAIResponse: false,
  },

  // CONVERSA 8: "Ciclo menstrual e performance — periodização real"
  {
    userId: 'user_sim_019',
    content: 'Ouço que algumas atletas periodizam treino de acordo com o ciclo menstrual. É coisa de elite ou qualquer pessoa pode fazer? Como funciona na prática?',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_013',
    content: 'Comecei a rastrear meu ciclo + treino há 3 meses e meu desempenho melhorou absurdamente. Semana de ovulação sou muito mais forte. Depois fica pesado mas controlável. Recomendo muito.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Luciana, essa é uma das maiores oportunidades de otimização science-based pra mulher. Mulheres têm flutuação hormonal cíclica que muda metabolismo, força, resistência, recuperação — pode ser desvantagem (se ignora) ou vantagem (se otimiza). FASE 1 MENSTRUAÇÃO (Dias 1-5): hormônios baixos, metabolismo normal, força similar, capacidade aeróbica ótima, recuperação lenta. Treino ideal: cardio leve-moderado, yoga/pilates/mobilidade, evitar leg day pesado, volume reduzido. FASE 2 FOLICULAR (Dias 6-14): estrogênio sobe, metabolismo catabólico, força aumenta, capacidade aeróbica MÁXIMA, recuperação rápida. Dia 14 OVULAÇÃO = pico de força. Treino ideal: MELHOR FASE PRA FORÇA — agachamento, levantamento terra, HIIT/crossfit, volume máximo, tente records. FASE 3 LÚTEA INICIAL (Dias 15-21): progesterona sobe, metabolismo anabólico, força alta mas declina, recuperação boa. Treino ideal: força moderada, volume moderado-alto, foco hypertrophy, cardio steady-state. FASE 4 LÚTEA TARDIA (Dias 22-28): progesterona alta, estrogênio baixo, queima calórica máxima +200kcal/dia, força cai 10%, recuperação lenta, PMS. Treino ideal: volume reduzido, intensidade leve-moderada, yoga/pilates, descanso extra. Nutrição: Semana 1-2 calorias base, carboidrato 3-4g/kg. Semana 3 aumentar 150-200kcal, Semana 4 aumentar 200-300kcal (corpo genuinamente queima mais). Rastreamento: use app (Clue, Flo) ou calendário + desempenho. Timeline esperada: 6-12 meses periodização = ganho força maior, recuperação melhor, menos lesões, performance mais estável.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_019',
    content: 'Esse breakdown de periodização é exatamente o que eu precisava ver. Vou baixar um app de rastreamento e começar agora mesmo. Muito obrigada!',
    isAIResponse: false,
  },
];

async function main() {
  console.log('🔍 Buscando arena "Dor Menstrual"...\n');

  // Buscar arena
  const { data: arenas, error: arenasError } = await supabase
    .from('Arena')
    .select('id, slug, name')
    .or("slug.eq.dor-menstrual,name.ilike.%Dor Menstrual%")
    .limit(1);

  if (arenasError || !arenas || arenas.length === 0) {
    console.error('❌ Arena não encontrada. Erro:', arenasError?.message);
    console.log('   Arenas disponíveis com "dor":');

    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name')
      .ilike('name', '%dor%')
      .limit(5);

    allArenas?.forEach(a => console.log(`   - ${a.name} (slug: ${a.slug})`));
    return;
  }

  const arena = arenas[0];
  console.log(`✅ Arena encontrada: "${arena.name}"\n`);

  // Deletar posts antigos
  console.log('🗑️  Deletando posts antigos...');
  const { count: deletedCount, error: deleteError } = await supabase
    .from('Post')
    .delete()
    .eq('arenaId', arena.id);

  if (deleteError) {
    console.error('❌ Erro ao deletar:', deleteError.message);
    return;
  }
  console.log(`✅ ${deletedCount} posts deletados\n`);

  // Inserir novos posts
  console.log(`📝 Inserindo ${POSTS.length} posts...\n`);

  let baseTime = new Date('2026-02-09T08:00:00Z');
  const postsToInsert = POSTS.map((post, idx) => ({
    id: randomUUID(),
    arenaId: arena.id,
    userId: post.userId,
    content: post.content,
    isAIResponse: post.isAIResponse,
    isPublished: true,
    isApproved: true,
    viewCount: Math.floor(Math.random() * 50) + 10,
    likeCount: Math.floor(Math.random() * 20) + 2,
    createdAt: new Date(baseTime.getTime() + idx * 18 * 60 * 1000),
    updatedAt: new Date(baseTime.getTime() + idx * 18 * 60 * 1000),
  }));

  const { error: insertError, data: insertedPosts } = await supabase
    .from('Post')
    .insert(postsToInsert)
    .select();

  if (insertError) {
    console.error('❌ Erro ao inserir posts:', insertError.message);
    return;
  }

  console.log(`✅ ${insertedPosts?.length || postsToInsert.length} posts inseridos com sucesso!\n`);

  // Atualizar contador de posts na arena
  console.log('🔄 Atualizando contador de posts da arena...');
  const { error: updateError } = await supabase
    .from('Arena')
    .update({ totalPosts: postsToInsert.length })
    .eq('id', arena.id);

  if (updateError) {
    console.error('❌ Erro ao atualizar arena:', updateError.message);
    return;
  }

  console.log(`✅ Arena atualizada com ${postsToInsert.length} posts\n`);
  console.log('🎉 Seed "Dor Menstrual" completado com sucesso!');
}

main().catch(console.error);
