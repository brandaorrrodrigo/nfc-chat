require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: MUSCULAÇÃO LIPEDEMA
// 42 posts | 8 conversas (5-6 posts cada)
// Apenas personas femininas (lipedema = condição feminina 97%+)
// Foco: treino resistido adaptado, evidência, manejo prático
// ============================================================

const POSTS = [

  // CONVERSA 1: Medo de treinar perna
  {
    userId: 'user_sim_001',
    content: 'Fui diagnosticada com lipedema estágio II nas pernas. Minha médica disse pra fazer musculação mas minha maior PARANOIA é: treinar perna não vai fazer inchar mais? Já tenho as pernas enormes e desproporcionais ao tronco. A ideia de fazer agachamento e elas ficarem MAIORES me apavora. Alguém com lipedema treina perna?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Ana Paula, esse medo é o motivo número 1 pelo qual mulheres com lipedema evitam musculação — e ironicamente, a musculação é uma das melhores intervenções disponíveis. No lipedema, o tecido adiposo é estruturalmente diferente: adipócitos hipertrofiados + inflamação crônica + fragilidade capilar. Musculação NÃO aumenta o tecido lipedematoso. A contração muscular funciona como BOMBA para o sistema linfático. Stutz et al. (2019): exercício combinado reduziu dor, melhorou mobilidade e qualidade de vida. Donahue et al. (2022): treino resistido não aumentou a circunferência do membro — reduziu. Mecanismos: reduz inflamação sistêmica, melhora sensibilidade à insulina, aumenta taxa metabólica basal. Nas primeiras 2-4 semanas pode haver edema pós-treino (normal), use meia de compressão durante o treino.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: 'Ana Paula, EU ERA VOCÊ há 2 anos. Lipedema estágio II, medo mortal de treinar perna. Meu marido me convenceu a tentar 3 meses com personal que entendia a condição. Resultado: minhas pernas NÃO aumentaram de circunferência. Ficaram mais firmes, a dor ao toque reduziu uns 40%, e meus joelhos param de doer ao subir escada. A musculação foi a melhor coisa que fiz pelo meu lipedema.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Complemento importante: USE MEIA DE COMPRESSÃO NO TREINO. Eu comecei sem e minhas pernas inchavam muito pós-treino. Quando comecei a treinar com meia de compressão classe 2 (20-30 mmHg), o inchaço pós-treino reduziu drasticamente. Minha fisioterapeuta vascular explicou que a compressão auxilia a bomba muscular e evita que o líquido extravase durante o esforço.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: 'Outro ponto: meçam a circunferência das pernas com fita métrica ANTES de começar e a cada 30 dias. No mesmo horário, mesmo nível (10cm acima do joelho, maior circunferência da panturrilha). Eu fiz isso e tenho DADOS concretos de que em 6 meses de musculação minha circunferência de coxa REDUZIU 2cm, mesmo com aumento visível de tônus muscular.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: 'A parte sobre o retorno linfático é fundamental. Minha angiologista desenhou pra mim: o sistema linfático NÃO tem bomba própria (como o coração pro sangue). Ele depende da CONTRAÇÃO MUSCULAR e da respiração. Então ficar parada = linfa estagnada = mais inchaço e fibrose. Musculação é literalmente a BOMBA que o lipedema precisa.',
    isAIResponse: false,
  },

  // CONVERSA 2: Qual treino é melhor
  {
    userId: 'user_sim_006',
    content: 'Todo mundo fala que hidroginástica é o melhor exercício pra lipedema. Minha fisio diz musculação. Meu médico diz pilates. Estou confusa. Qual desses tem MAIS evidência pra lipedema especificamente? Não consigo fazer os 3 por questão de tempo e dinheiro — preciso escolher 1.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Patricia, vou analisar cada modalidade pela lente do lipedema. Exercício aquático: pressão hidrostática = compressão natural 360 graus. Flutuabilidade reduz impacto articular. Limitações: baixa carga mecânica, estimulo limitado pra hipertrofia. Pilates: melhora consciência corporal, baixo impacto. Limitações: carga geralmente insuficiente, praticamente sem evidência específica para lipedema. Musculação: permite progressão de carga contínua, bomba muscular potente, reduz inflamação sistêmica, fortalece tecido conectivo, melhora sensibilidade à insulina. Stutz (2019) e diretrizes alemãs S1 recomendam musculação. Veredito: MUSCULAÇÃO é a primeira escolha quando se pode fazer apenas uma modalidade. Se puder adicionar segunda: musculação 3x + exercício aquático 1-2x.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: 'Fiz os 3 em momentos diferentes e concordo 100 por cento. Hidro foi ótima no início quando eu tinha muita dor. Pilates me ajudou com mobilidade. Mas NADA me deu os resultados da musculação: pernas mais firmes, menos dor ao toque, menos cansaço ao andar. Se tivesse que voltar no tempo e escolher só 1, musculação sem pensar.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: 'Dica prática: eu combino musculação 3x/semana com caminhada na água 1x (não é hidro tradicional — é literalmente caminhar na piscina rasa por 30-40 minutos). A pressão da água drena as pernas e o dia seguinte à caminhada aquática é quando minhas pernas estão MENOS inchadas na semana.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: 'Para quem tem medo de academia: eu comecei em casa com elásticos de resistência + garrafas de água. Sim, é possível. Não é ideal, mas me tirou do zero. Depois de 2 meses e alguma confiança, entrei na academia. Às vezes o obstáculo não é a modalidade, é a VERGONHA de treinar com pernas desproporcionais. Se isso for barreira, comece em casa.',
    isAIResponse: false,
  },

  // CONVERSA 3: Leg press doeu demais
  {
    userId: 'user_sim_007',
    content: 'Tentei fazer leg press e a DOR foi horrível. Não dor muscular — dor no tecido da coxa onde a plataforma PRESSIONAVA. Minha pele ficou roxa com hematomas. Minha personal não entendeu porque outras alunas fazem sem problema. É assim pra quem tem lipedema? Tenho que evitar leg press?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Fernanda, o que você descreve é 100 por cento consistente com lipedema e NÃO acontece na maioria das pessoas sem a condição. O tecido lipedematoso tem capilares fragilizados — hematomas com pressão mínima. Há hiperalgesia no tecido afetado. Exercícios que precisam adaptação: leg press (colocar almofada no assento), cadeira extensora (acolchoar o rolo), cadeira flexora (acolchoamento + meia de compressão). Exercícios bem tolerados: agachamento livre ou goblet, hip thrust com proteção na barra, stiff romeno, step-up, búlgaro, abdução com cabo, caminhada em esteira. Regra prática: priorize exercícios onde NÃO há pressão externa sobre o tecido afetado.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: 'Os hematomas no leg press aconteciam comigo também! Minha coxa ficava ROXA por semana. Minha solução foi trocar pra agachamento goblet e búlgaro com halteres. Zero pressão externa, zero hematoma, e sinceramente o estímulo muscular é até melhor porque recruta mais estabilizadores.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: 'Sobre a personal não entender: eu imprimi o consenso alemão sobre lipedema (é PDF gratuito) e levei pra minha personal. Ela leu, pesquisou mais, e MUDOU completamente meu programa. Trocou máquinas por pesos livres, reduziu volume inicial, adicionou compressão obrigatória. Hoje ela é a melhor personal que eu poderia ter porque APRENDEU.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Dica que descobri: hip thrust com a barra acolchoada com aquele protetor de espuma GROSSO (não o fininho). Minha região do quadril tem lipedema leve e a barra sem proteção causava dor e marca roxa. Com o protetor de 3cm de espuma, faço hip thrust pesado sem problema. Investi R$ 25 no protetor e resolveu.',
    isAIResponse: false,
  },

  // CONVERSA 4: Lipedema braço
  {
    userId: 'user_sim_016',
    content: 'Meu lipedema afeta braços também (estágio I-II). Meus braços são enormes comparados ao tronco e dói quando aperto. Todas as informações sobre treino e lipedema focam nas PERNAS. E os braços? Posso fazer rosca, tríceps, supino? Algo que devo evitar? Me sinto invisível porque parece que lipedema de braço não existe.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Daniela, lipedema em membros superiores afeta 30 por cento das mulheres com a condição e é MUITO subdiagnosticado. Você não é invisível. Mesma lógica dos MMII: evitar pressão externa direta sobre tecido afetado. Máquinas que comprimem — adaptar com acolchoamento. Manga de compressão durante o treino (classe 1-2). Exercícios bem tolerados: rosca bíceps com halteres em pé, rosca martelo, rosca com elástico, tríceps no cabo, tríceps francês, kickback, desenvolvimento, elevação lateral, elevação frontal, face pull, puxada no pulley, remada. Comece com cargas LEVES, repetições mais altas (15-20 reps), progressão para 10-12 reps com mais carga após 4-6 semanas.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: 'Daniela, tenho lipedema nos braços também e NINGUÉM fala sobre isso. Quando conto, as pessoas olham com cara de "mas isso existe?". Sim, existe, e dói. Treino MMSS 2x/semana com manga de compressão. Rosca martelo, tríceps no cabo, desenvolvimento, remada. Meus braços não diminuíram de circunferência mas estão MUITO mais firmes e a dor ao toque reduziu depois de 4 meses.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'Sobre a manga de compressão: eu uso a Sigvaris classe 2 (braçadeira 20-30mmHg) e comprei na farmácia ortopédica com prescrição da angiologista. O plano de saúde cobriu. E sim, a diferença de treinar COM vs SEM compressão nos braços é gritante — menos inchaço pós-treino, menos hematomas.',
    isAIResponse: false,
  },

  // CONVERSA 5: Peso na balança
  {
    userId: 'user_sim_020',
    content: 'Três meses de musculação 3x/semana + alimentação controlada e a balança NÃO MEXEU. Nem 1kg. Me sinto mais firme, a roupa está mais folgada, mas o número na balança me destrói psicologicamente. Minha amiga sem lipedema perdeu 8kg. Estou fazendo algo errado ou o lipedema simplesmente não permite perder peso?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Beatriz, o que você descreve é EXATAMENTE o que esperamos no lipedema com musculação. A balança está te mentindo. O tecido lipedematoso é resistente à lipólise convencional. Child et al. (2010): expressão alterada de receptores adrenérgicos. Você ESTÁ em recomposição corporal: perda de gordura + ganho de músculo simultâneo. Músculo é mais denso — para a balança: empate. Para seu corpo: transformação real. Retenção hídrica no lipedema é errática — peso pode flutuar 1-3kg em um DIA. MÉTRICAS IMPORTANTES: circunferências com fita métrica (cada 30 dias), fotos comparativas, métricas funcionais (quanto levanta, dor ao toque, edema), como a roupa cabe. Jogue a balança fora ou para de usá-la como medida de sucesso. Você está 3 meses em, se sentindo firme, roupa folgada. Isso é SUCESSO real.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: 'Beatriz, 1 ano de musculação e meu peso caiu exatamente 2kg. DOIS. Mas perdi 6cm de cintura, 3cm de coxa, e minhas pernas NÃO aumentaram. Visto 2 números a menos de calça. Se olhasse SÓ a balança, diria que fracassei. A fita métrica e as fotos contam outra história. No lipedema, a balança é sua inimiga.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: 'Minha psicóloga me fez um exercício: esconder a balança por 60 dias e anotar só como me sinto, como a roupa cabe, quanto levanto. Depois olhei a balança: tinha perdido 1kg. Mas tinha uma LISTA de vitórias: mais energia, menos dor nas pernas, calça abotoando fácil, agachando 30kg. 1kg na balança vs uma lista de vitórias. Perspectiva é tudo.',
    isAIResponse: false,
  },

  // CONVERSA 6: Pós-cirurgia
  {
    userId: 'user_sim_002',
    content: 'Fiz lipoaspiração tumescente para lipedema nas coxas e pernas há 6 semanas. Meu cirurgião liberou exercícios leves. Mas quero voltar pra musculação — era minha âncora emocional e física. Quanto tempo até eu poder agachar de novo? E tem algo que devo fazer diferente no pós-op?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Juliana, a lipoaspiração tumescente remove tecido lipedematoso diretamente, e musculação pós-cirúrgica é ESSENCIAL para manter resultado. Não cura, mas musculação mantém retorno linfático. PROTOCOLO: Semanas 1-4 — caminhada leve 10-20 min/dia, compressão contínua 24h, zero musculação. Semanas 4-8 — exercícios peso corporal sem carga (agachamento, ponte, step-up baixo), core leve, MMSS leve. Semanas 8-12 — cargas LEVES (30-40 por cento pre-op), progressão 10-15 por cento/semana. Semanas 12-16 — progressão 50-70 por cento pre-op, 3x/semana. Mês 4+ — progressão gradual até carga pre-op ou além. RED FLAGS: edema que não reduz em 48h, dor aguda localizada, vermelhidão/calor, seroma, febre → contatar cirurgião.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: 'Fiz lipo tumescente há 8 meses. O retorno gradual é fundamental. Eu quis voltar a agachar pesado na semana 6 e minha perna inchou tanto que parecia que nem tinha operado. Voltei pra fase 2, respeitei o tempo. Na semana 12 comecei a progredir sem problemas. Hoje estou com carga PRÉ-cirúrgica e minhas pernas estão MUITO melhores.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: 'Juliana, uma coisa que ninguém me avisou: o edema pós-cirúrgico pode durar 6-12 MESES para resolver completamente. Eu estava frustrada no mês 2. No mês 6 desinchei significativamente e no mês 10 vi o resultado real. A musculação ACELEROU a resolução do edema por causa da bomba muscular. Paciência + treino consistente = resultado.',
    isAIResponse: false,
  },

  // CONVERSA 7: Dor crônica
  {
    userId: 'user_sim_012',
    content: 'Meu lipedema estágio III dói CONSTANTEMENTE. Não preciso nem apertar — só encostar já dói. Nível 5-6 no dia a dia. Quando treino, sobe pra 7-8. Todo mundo fala que musculação ajuda mas ninguém explica como treinar quando seu corpo grita de dor o tempo todo. Estou quase desistindo.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Roberta, não desista. Lipedema estágio III com dor crônica significativa é desafiador, mas há uma abordagem realista. Comece na ÁGUA (piscina aquecida 30-33 graus C): flutuabilidade reduz carga, pressão hidrostática auxilia drenagem, calor reduz dor. Caminhada na água 15-20 min, 2-3x/semana, com dor máximo 1-2 pontos acima do baseline. DEPOIS — exercício em seco sem carga (senta ou deitada): ponte, dead bug, abdução lateral deitada. DEPOIS — carga leve com monitoramento de edema. A dor pode NÃO melhorar nas primeiras 4-8 semanas (normal). Mês 2-3: melhora gradual começa. Mês 4-6: maioria reporta redução de 20-40 por cento. Use anti-inflamatório se prescrito 1h antes do treino. NÃO é linear — dias bons e ruins. Exercício ataca o MECANISMO da dor (inflamação + estase linfática).',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: 'Roberta, eu estava no mesmo ponto. Dor 6/10 diária, estágio III. Comecei na piscina aquecida. 3 meses só de água. Depois misturei: 2x piscina + 1x musculação leve. Hoje, 10 meses depois: 3x musculação + 1x piscina. Minha dor basal caiu de 6 pra 3-4. Ainda dói, mas é VIVER com dor 3 vs sobreviver com dor 6. A diferença é enorme.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Algo que me ajudou enormemente: minha médica adicionou duloxetina (60mg/dia) — é um antidepressivo que TAMBÉM trata dor crônica. A dor basal caiu de 7 pra 4 e eu CONSEGUI começar a treinar. Não é pra todo mundo, mas foi o que me tirou da paralisia. Exercício sozinho quando a dor é 7+ é muito difícil. Às vezes precisa de uma ajuda farmacológica.',
    isAIResponse: false,
  },

  // CONVERSA 8: Frequência e periodização
  {
    userId: 'user_sim_008',
    content: 'Já entendi que musculação é bom pro lipedema. Agora quero detalhes de PROGRAMAÇÃO: quantas vezes por semana? Full body ou divisão? Quantas séries pra perna? Tenho lipedema estágio II e treino há 6 meses. Quero algo mais estruturado e eficiente.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Camila, após 6 meses você pode ter programação refinada. FREQUÊNCIA: 3x/semana é o sweet spot. 2x funciona mas progressão lenta. 4x possível se bem recuperada. Dias consecutivos de MMII: EVITAR (dar 48h entre sessões). VOLUME: MMII 12-16 séries/semana, MMSS 8-12 séries/grupo, core 4-6 séries. Consistência > volume. PROGRESSÃO: a cada 2 semanas (não semanal). Micro-progressão: 1-2.5kg em MMII, 0.5-1kg em MMSS. PERIODIZAÇÃO mensal: semana 1 normal, semana 2 progressão, semana 3 consolidação, semana 4 DELOAD (reduzir 30-40 por cento carga). Deload é ESPECIALMENTE importante — permite resolução de edema acumulado. Divisão recomendada: Full Body 3x com exercícios diferentes cada dia OU Upper/Lower alternado (semana A: lower/upper/lower, semana B: upper/lower/upper).',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: 'O deload na semana 4 é VITAL pra quem tem lipedema. Eu treinava 4 semanas direto e na semana 5 minhas pernas estavam tão inchadas que eu parava 2 semanas. Quando minha coach implementou deload programado a cada 4ª semana, parei de ter essas crises. Reduzo tudo pela metade, foco em mobilidade e drenagem, e volto 100 por cento.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'Sobre progressão a cada 2 semanas em vez de semanal: isso me tirou muita frustração. Na academia normal, progressão semanal é padrão. Mas com lipedema meu corpo precisava de mais tempo. Quando aceitei que MEU ritmo é diferente e que 2kg a cada 2 semanas ainda é 52kg de progressão por ANO, relaxei e meu treino ficou mais prazeroso.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: 'Uma planilha simples que uso: anoto data, exercício, carga, reps, e uma coluna "edema pós-treino" (0 = nenhum, 1 = leve, 2 = moderado, 3 = intenso). Depois de 3 meses percebi um padrão: quando faço mais de 14 séries de MMII na semana, o edema sobe pra 2-3. Abaixo de 14, fica 0-1. Cada corpo tem seu LIMIAR e só com dados você descobre o seu.',
    isAIResponse: false,
  },
];

async function main() {
  console.log('\n🏟️  SEED: MUSCULAÇÃO LIPEDEMA\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%musculacao-lipedema%,slug.ilike.%musculacao_lipedema%,name.ilike.%musculação lipedema%,name.ilike.%musculacao lipedema%')
    .limit(1);

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    console.log('Tentando busca alternativa...');
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .ilike('slug', '%lipedema%')
      .limit(10);
    if (allArenas?.length) {
      console.log('Arenas com "lipedema":');
      allArenas.forEach(a => console.log(`  - ${a.slug} | ${a.name}`));
    }
    return;
  }

  const arena = arenas[0];
  console.log(`✅ Arena: ${arena.name} | ID: ${arena.id} | Posts atuais: ${arena.totalPosts}`);

  // 2. Deletar posts antigos
  const { data: deleted } = await supabase
    .from('Post')
    .delete()
    .eq('arenaId', arena.id)
    .select('id');

  console.log(`🗑️  Posts antigos deletados: ${deleted?.length || 0}`);

  // 3. Inserir novos posts
  const baseTime = new Date('2026-02-09T07:30:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 15 * 60 * 1000);

    const { error: insertError } = await supabase
      .from('Post')
      .insert({
        id: randomUUID(),
        arenaId: arena.id,
        userId: post.userId,
        content: post.content,
        isPublished: true,
        isApproved: true,
        isAIResponse: post.isAIResponse,
        viewCount: Math.floor(Math.random() * 100) + 20,
        likeCount: post.isAIResponse
          ? Math.floor(Math.random() * 35) + 20
          : Math.floor(Math.random() * 22) + 5,
        createdAt: postTime.toISOString(),
        updatedAt: postTime.toISOString(),
      });

    if (insertError) {
      console.error(`❌ Erro no post ${i + 1}:`, insertError.message);
    } else {
      created++;
    }
  }

  console.log(`✅ ${created} posts criados`);

  // 4. Atualizar contador
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  const { error: updateError } = await supabase
    .from('Arena')
    .update({ totalPosts: count })
    .eq('id', arena.id);

  if (updateError) {
    console.error('❌ Erro ao atualizar arena:', updateError.message);
  } else {
    console.log(`✅ Arena atualizada com ${count} posts`);
  }

  console.log('\n🎉 Seed "Musculação Lipedema" completado com sucesso!\n');
}

main().catch(console.error);
