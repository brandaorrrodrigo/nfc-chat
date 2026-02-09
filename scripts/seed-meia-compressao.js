require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: MEIA COMPRESSÃO
// 36 posts | 8 conversas (4-5 posts cada)
// Foco: meias de compressão para lipedema, insuficiência venosa,
// treino, classes, marcas, cuidados práticos
// ============================================================

const POSTS = [

  // CONVERSA 1: Classes de compressão
  {
    userId: 'user_sim_002',
    content: 'Minha angiologista prescreveu meia de compressão classe 2 (20-30mmHg) pro meu lipedema. Na farmácia vi classe 1, 2, 3 e até 4. Qual a diferença REAL entre as classes? Posso usar uma mais leve ou preciso seguir exatamente a prescrição?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Juliana, siga a prescrição — classe 2 foi escolhida por razão clínica. Classes: Classe 1 leve (15-21 mmHg) para varizes leves/prevenção. Classe 2 moderada (23-32 mmHg) para varizes moderadas, lipedema estágio I-II, insuficiência venosa crônica. Classe 3 alta (34-46 mmHg) para linfedema, lipedema estágio III. Classe 4 muito alta (>49 mmHg) para linfedema severo. NO lipedema, classe 2 é o padrão. Usar classe 1 quando prescreveram 2 é insuficiente — a compressão não contrabalança a pressão hidrostática do edema lipedematoso. Diferença de conforto é real, mas conforto ≠ eficácia. Se desconfortável, problema é TAMANHO/ajuste, não classe. Malha circular vs plana: circular (tubo, estética) para insuficiência leve-moderada. Plana (costurada, espessa) IDEAL para lipedema II-III — distribui pressão uniformemente.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: 'Complemento crucial: a MEDIÇÃO é tudo. Na primeira vez comprei meia classe 2 tamanho M de prateleira — apertava demais no tornozelo e folgava na coxa. Fui numa ortopédica especializada que tirou 8 medidas diferentes. A meia sob medida da MESMA classe 2 é infinitamente mais confortável. Se está insuportável, provavelmente não é a classe — é o TAMANHO.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: 'Sobre malha plana vs circular: eu tenho lipedema estágio II com bastante tecido na coxa interna. Meia circular classe 2 fazia um garrotamento horrível. Troquei pra malha plana sob medida — compressão uniforme, sem garrotear, muito mais funcional. Custa mais (R$ 800-1200 vs R$ 200-400) mas pra quem tem lipedema com volume significativo, vale.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: 'Dica de economia: muitos planos de saúde cobrem meia de compressão COM PRESCRIÇÃO médica. O meu cobre 2 pares por ano de malha plana sob medida. Gastava R$ 2.400/ano do bolso até descobrir. Pergunte ao seu plano — geralmente está na cobertura de órteses e próteses. Precisa de laudo médico com CID (lipedema é E88.2) + prescrição.',
    isAIResponse: false,
  },

  // CONVERSA 2: Treinar com ou sem meia
  {
    userId: 'user_sim_007',
    content: 'Treino musculação 3x/semana pra lipedema. Às vezes esqueço a meia de compressão e treino sem. Outras vezes o calor é tanto que tiro no meio do treino. Faz REALMENTE diferença treinar com meia? Sinto que minhas pernas incham mais nos dias sem, mas pode ser impressão.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Fernanda, NÃO é impressão. Durante contração muscular, o músculo empurra sangue venoso e linfa de volta ao coração. A compressão externa AMPLIFICA esse efeito: impede que líquido extravase de volta durante relaxamento. Sem compressão: contração empurra pra cima, relaxamento permite refluxo parcial. Com compressão: contração empurra, compressão mantém no vaso durante relaxamento. Partsch & Moski (2013): compressão durante exercício melhora significativamente hemodinâmica venosa. Diretrizes S1 recomendam compressão durante atividade física como parte do tratamento combinado. Dados práticos: treino COM compressão edema pós-treino resolve em 2-4h. SEM compressão: edema dura 24-48h. Diferença em circunferência pós-treino pode ser 1-3cm. Para calor: meia microfibra ou moisture-wicking, ponta aberta, treinar em horário fresco, spray água termal, talco nos pés, fio mais fino.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: 'Depois que medi a diferença fiquei convencida: coxa ANTES e DEPOIS do treino, com e sem meia, dias diferentes. Com meia classe 2: +0.5cm pós-treino (voltou normal em 2h). Sem meia: +2.5cm pós-treino (ainda inchada na manhã seguinte). Nunca mais treino sem. Meia fica dentro da bolsa da academia permanentemente.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: 'Para o calor: descobri a Sigvaris linha Athletic (esportiva). É classe 2 mas com tecido respirável. Pago mais (~R$ 350 vs R$ 200) mas uso especificamente pro treino. A meia convencional deixo pro dia a dia. Ter 2 modelos é ideal se orçamento permitir.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: 'Hack de quem esquece a meia: comprei meia extra baratinha classe 1 (R$ 60) e deixei PERMANENTEMENTE na bolsa da academia. Se esqueço a classe 2, tenho a classe 1 de backup. Não é ideal, mas é muito melhor que treinar sem nada.',
    isAIResponse: false,
  },

  // CONVERSA 3: Como calçar
  {
    userId: 'user_sim_012',
    content: 'Gente, não consigo CALÇAR a meia classe 2. Fico 15 minutos lutando, suando, quase chorando. Já rasguei 2 meias (R$ 400 cada) tentando puxar. Minha mãe vem ajudar mas mesmo assim é uma guerra. Tem lipedema com bastante volume na panturrilha e a meia simplesmente não sobe. Já pensei em desistir da compressão por isso. SOCORRO.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Roberta, a dificuldade de calçar é o motivo número 1 de abandono da compressão (Reich-Schupke et al. 2017). Você NÃO está sozinha. Técnicas: 1) Luvas de borracha para louça — borracha gripa no tecido, permite puxar com MUITO menos esforço. Custo R$ 5-10. 2) Técnica correta: vire a meia do avesso ATÉ calcanhar, encaixe calcanhar, desvire aos poucos, suba em etapas de 5cm. NUNCA puxe pela borda superior. 3) Calçador de meia (donner) — dispositivo que abre a meia, você encaixa pé, puxa calçador pra cima. Custo R$ 80-200. 4) Meia com zíper — abre zíper, encaixa perna, fecha. 5) Sistema 2 meias classe 1 sobrepostas — soma pressão (~30mmHg), cada meia individual MUITO mais fácil de calçar. Validado clinicamente.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: 'AS LUVAS DE BORRACHA. Gente. Gastei R$ 180 num calçador quando a solução eram as luvas amarelas de R$ 8 da Bombril. A borracha gripa no tecido e você PUXA sem escorregar. Meu tempo de calçar caiu de 12 minutos pra 4. A ortopedista deveria entregar um par de luvas junto com cada meia prescrita.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'Roberta, o sistema de 2 meias sobrepostas salvou minha mãe. Ela tem 62 anos, lipedema + artrite nas mãos — calçar classe 2 era impossível. Angiologista prescreveu 2x classe 1 sobrepostas. Cada meia entra fácil, resultado de compressão é equivalente, minha mãe consegue calçar SOZINHA.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Outra dica: calçador Easy Slide (modelo metálico, ~R$ 150) mudou minha vida. Coloco meia na armação, encaixo pé, puxo as alças — pronto em 2 minutos sem esforço. Pago por ele com a primeira meia que NÃO rasgo.',
    isAIResponse: false,
  },

  // CONVERSA 4: Dormir com meia
  {
    userId: 'user_sim_001',
    content: 'Li que algumas mulheres dormem com meia de compressão. Minha angiologista disse pra tirar pra dormir. Mas quando tiro, acordo com as pernas mais inchadas que quando deitei. Quem tem razão? Posso dormir com a meia?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Ana Paula, sua angiologista está certa como REGRA GERAL, mas exceções no lipedema justificam compressão noturna. Regra geral: deitada, pressão hidrostática gravitacional é quase ZERO. Compressão que faz sentido DE PÉ não é necessária DEITADA. Pele precisa respirar e se recuperar. Exceção no lipedema: há disfunção linfática primária — líquido acumula INDEPENDENTE da posição. Tecido fibrosado retém líquido patologicamente. Sem compressão noturna, edema acumula durante 7-8h de sono — acorda com pernas maiores. Compressão noturna para lipedema — quando faz sentido: estágio II-III com edema significativo, componente linfedematoso, pós-cirúrgico, edema matinal consistentemente pior. MAS: compressão noturna é DIFERENTE — use MAIS LEVE. Classe 1 (15-21 mmHg) ou compressão específica para noite. Existem: Circaid, JuxtaCures, bandagens de curta elasticidade. Meia noturna ideal é flat knit leve ou bandagem — NÃO meia convencional de dia. Opções: meia classe 1 específica pra dormir, bandagem curta elasticidade, Circaid/JuxtaCures, legging compressão leve.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: 'Uso Circaid à noite (sistema velcro ajustável) — game changer. Coloco em 30 segundos, ajusto pressão conforme conforto, acordo com pernas MUITO menos inchadas. Angiologista prescreveu depois que mostrei que edema matinal estava pior. Custa ~R$ 600-800 mas plano cobriu com laudo.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: 'Solução caseira que funciona pra mim: comprei legging de compressão esportiva (não é médica, ~15mmHg) e uso pra dormir. É fácil de vestir, confortável, edema matinal reduziu visivelmente. Não é solução ideal pra lipedema avançado, mas pro meu estágio I-II é suficiente à noite e custa R$ 60.',
    isAIResponse: false,
  },

  // CONVERSA 5: Marcas
  {
    userId: 'user_sim_016',
    content: 'Já usei Sigvaris, Jobst, Venosan e Kendall. Cada uma tem algo que amo e algo que odeio. Pra quem está começando: qual marca vocês recomendam considerando QUALIDADE + DURABILIDADE + PREÇO? Meia é investimento caro.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Daniela, não existe melhor marca absoluta — depende do formato da perna, tipo de tecido e uso. Sigvaris (Suíça): referência mundial, durabilidade excelente, linha Custom (malha plana sob medida) melhor pra lipedema. Preço ~R$ 250-450 classe 2. Jobst (Alemanha): boa variedade, conforto consistente, borda siliconada que segura bem. Preço ~R$ 200-380. Venosan (Suíça): excelente custo-benefício, tecidos inovadores com algodão. Preço ~R$ 180-320. Kendall (Brasil): mais acessível, funcional pra começar. Preço ~R$ 120-200. Para lipedema (malha plana): Sigvaris Custom, Juzo (alemã, excelente), Medi (alemã). Preço ~R$ 800-1.500. Recomendação: orçamento apertado — Kendall ou Venosan. Melhor custo-benefício — Venosan. Qualidade/durabilidade máxima — Sigvaris.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_002',
    content: 'Minha experiência: comecei com Kendall (classe 2, R$ 140). Funcionou 3 meses, depois ficou frouxa. Migrei pra Venosan Legline — durou 5 meses com uso diário, conforto MUITO superior. Agora uso Sigvaris pra dia a dia e tenho Venosan como backup. Pra lipedema e uso TODO DIA, não economize.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'Adendo importante: EXPERIMENTEM antes de comprar se possível. Fui numa ortopédica com amostras de todas as marcas. A que ficou melhor na MINHA perna foi Jobst — borda siliconada segurou perfeito. Na minha amiga a mesma Jobst escorregava e Sigvaris ficou perfeita. Cada perna é única. Não compre pela marca — compre pelo AJUSTE.',
    isAIResponse: false,
  },

  // CONVERSA 6: Viagem de avião
  {
    userId: 'user_sim_003',
    content: 'Vou viajar de avião pela primeira vez desde o diagnóstico de lipedema (6h de voo). Minha médica disse pra usar meia de compressão no voo mas não deu detalhes. Uso minha meia classe 2 normal ou precisa de algo diferente? E o que mais posso fazer pra não chegar com as pernas destruídas?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Mariana, voo longo com lipedema requer preparação. Pressurização ~2.400m altitude, imobilidade prolongada, baixa umidade conspiram contra suas pernas. PRÉ-VOO: calce meia antes de sair de casa, use classe 2 habitual (consultar médica pra classe 3 se estágio III). Hidrate bem, evite álcool. DURANTE: mantenha meia o voo todo. A cada 30-45min: flexão plantar/dorsiflexão do tornozelo 20x, círculos com tornozelo, contrair quadríceps 10x. A cada 1-2h: levante, caminhe pelo corredor 2-3min. Hidrate 200ml água a cada hora. Evite álcool, café em excesso, sódio excessivo. Peça assento no corredor. PÓS-VOO: mantenha meia 2h após pouso. Eleve pernas 15-20min, auto-drenagem suave 5min, caminhada leve 15-20min. Hidrate reforçado nas 24h seguintes. Levar na mão: garrafa água, meia extra, creme hidratante, meias antiderrapantes pro avião.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: 'Viajei 10h pra Europa com lipedema. Protocolo meia + exercícios + hidratação funcionou. Cheguei com pernas levemente mais inchadas, mas NADA comparado à vez que viajei sem meia (quase não entrava nos sapatos). Dica extra: bolinha de tênis pra rolar nos pés — ativa músculos da panturrilha. E almofada de pescoço pra dormir sentada sem ficar torta.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: 'Sobre assento no corredor: VALE OURO. Na ida fiquei na janela, dava vergonha de incomodar pra levantar toda hora. Na volta peguei corredor e levantei a cada 40min sem pedir licença. A diferença nas pernas ao chegar foi gritante. Pague pelo assento no corredor. É investimento em saúde, não luxo.',
    isAIResponse: false,
  },

  // CONVERSA 7: Meia escorregando
  {
    userId: 'user_sim_020',
    content: 'Minha meia 7/8 (coxa) fica ESCORREGANDO o dia todo. Borda siliconada não segura. Toda hora tenho que subir. Quando escorrega faz garrotamento atrás do joelho que é pior que estar sem meia. Já tentei 2 marcas. Estou a ponto de trocar pra meia-calça desconfortável mas que não escorrega. Alguma solução?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Beatriz, escorregar é muito comum — especialmente em lipedema onde forma cônica (panturrilha > coxa) pode não ser convencional. Diagnóstico: meia 7/8 precisa diferença circunferência pra segurar. No lipedema coxa pode ser tão grande que meia não tem cintura natural pra ancorar. Silicone perde aderência com suor/cremes. Tamanho pode estar errado — remedir resolve. Soluções: 1) Cola de pele (It Stays, Sigvaris Skin Glue) R$ 40-60 — aplica na pele, calça meia, gruda firme. Remove fácil com água. 2) Borda siliconada LARGA (5cm) em vez de fina (1-2cm) — maior aderência. 3) Cinta-liga/suspensório pra meia — cinto na cintura com presilhas que seguram borda. 4) Meia-calça compressão — elimina problema (sem borda na coxa). 5) Malha plana sob medida — solução DEFINITIVA pra lipedema com volume irregular. CUIDADO: meia enrolada atrás joelho funciona como TORNIQUETE — pior que estar sem meia. Tira imediatamente se acontecer.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: 'O It Stays (cola pra meia) salvou minha vida. R$ 45 Mercado Livre. Passo na coxa, calço meia, NÃO MOVE o dia inteiro. Nem no treino. Remove fácil no banho. Antes puxava a meia 15-20x/dia. Agora zero. Deveria vir de brinde com toda meia 7/8.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: 'Eu desisti da 7/8 e migrei pra meia-calça Sigvaris classe 2. É mais quente e chatinha pra tirar no banheiro, mas NUNCA escorrega. Pro meu formato (lipedema com coxa volumosa cilíndrica), a 7/8 não segura em nenhuma marca. Meia-calça resolveu 100 por cento. Cada corpo é único — não insista no modelo que não funciona.',
    isAIResponse: false,
  },

  // CONVERSA 8: Cuidados e durabilidade
  {
    userId: 'user_sim_012',
    content: 'Meia de compressão é CARA. R$ 300-400 o par. Preciso fazer durar o máximo possível. Qual o jeito certo de lavar, secar, guardar? Li que máquina de lavar destrói. É verdade? E quanto tempo dura antes de perder a compressão?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Roberta, cuidar corretamente pode DOBRAR a vida útil. Vida útil esperada: uso diário com lavagem adequada 4-6 meses. Uso alternado (2 pares) 6-8 meses cada. Sinais de perda de eficácia: fácil de calçar demais, não marca na pele ao tirar, tecido frouxo, transparente. LAVAGEM CORRETA: água fria/morna até 30°C, sabão neutro líquido (sem alvejante, amaciante, cloro), mergulhar e pressionar suavemente (NÃO esfregar/torcer), enxaguar bem, espremer gentilmente enrolando em toalha seca, secar em superfície plana à sombra. Se máquina (emergência): saco protetor OBRIGATÓRIO, ciclo delicado, água fria, SEM centrifugação, SEM amaciante. NUNCA: secadora, ferro, alvejante, amaciante (destrói elastano e silicone), torcer, secar ao sol, secar pendurada. Frequência: TODOS OS DIAS (suor/óleo/cremes degradam fibras). Guardar: seca, dobrada suavemente (não enrolar apertado), longe sol/calor, não molhada. Durabilidade: marcar data início no cós. Quando 5-6 meses substituir. Alternância: ideal ter 2-3 pares.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: 'Dica de marcar a data: escrevo com caneta permanente na parte interna do cós "Início: 15/01". Quando completa 5 meses compro próxima. Meia perde compressão GRADUALMENTE e você nem percebe. Aí calça uma NOVA e pensa "uau, como apertava". Deveria trocar no prazo.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'Sobre amaciante: destruí 2 pares com amaciante antes de saber. Borda siliconada ficou lisa (não gruda mais) e tecido todo frouxo. R$ 700 perdidos. Agora lavo SÓ com sabão de coco líquido e meias duram o esperado. SE UMA dica: NUNCA USE AMACIANTE. É o erro mais caro.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Rotina prática: tenho 3 pares. Segunda uso par A, terça par B, quarta par C. Todo dia chego em casa: tiro, lavo (2min bacia), espremo na toalha, estendo no varal banheiro. Manhã já está seco. Virou automático como escovar dente. Segredo é ter 2+ pares — com 1 só você ou lava e calça molhada ou não lava.',
    isAIResponse: false,
  },
];

async function main() {
  console.log('\n🏟️  SEED: MEIA COMPRESSÃO\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%meia-compressao%,slug.ilike.%meia_compressao%,name.ilike.%meia compress%')
    .limit(1);

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('slug.ilike.%meia%,name.ilike.%meia%,slug.ilike.%compress%,name.ilike.%compress%')
      .limit(10);
    if (allArenas?.length) {
      console.log('Arenas com "meia" ou "compress":');
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
  const baseTime = new Date('2026-02-09T06:30:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 17 * 60 * 1000);

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
        viewCount: Math.floor(Math.random() * 70) + 12,
        likeCount: post.isAIResponse
          ? Math.floor(Math.random() * 28) + 15
          : Math.floor(Math.random() * 18) + 4,
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

  console.log('\n🎉 Seed "Meia Compressão" completado com sucesso!\n');
}

main().catch(console.error);
