// ═══════════════════════════════════════════════════════════════
// SEED ARENA: TREINO DE GLÚTEO
// Executar: npx tsx scripts/seed-treino-gluteo.ts
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// ============================================================
// SEED: Treino de Glúteo
// ~32 posts em 8 conversas
// Foco: ativação, exercícios eficientes, conexão mente-músculo,
// periodização, erros comuns, glúteo médio/mínimo, hip thrust,
// frequência ideal, progressão de carga
// ============================================================

const POSTS = [
  // ── CONVERSA 1: Não sinto o glúteo ativando ───────────────
  {
    userId: 'user_sim_003',
    content: `Gente, faço agachamento, leg press, stiff... mas simplesmente NÃO SINTO o glúteo trabalhando. Quem domina é sempre o quadríceps e posterior de coxa. Já tentei "pensar no músculo" mas não adianta. O que tô fazendo de errado?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Mariana, esse é provavelmente o problema mais comum no treino de glúteo e tem causas específicas que podem ser corrigidas.

**Por que o glúteo "não ativa":**

O glúteo máximo é o **maior músculo do corpo** mas paradoxalmente é um dos mais inibidos na população moderna. Ficar sentada 8-10h/dia causa o que se chama de **"amnésia glútea"** — o glúteo fica cronicamente alongado e com drive neural reduzido, enquanto flexores do quadril e quadríceps assumem os movimentos.

**Solução em 3 etapas:**

**1. Ativação pré-treino (5-8 min, OBRIGATÓRIO):**
- **Clamshell** com miniband: 2x20 cada lado — ativa glúteo médio
- **Ponte de glúteo unilateral** (sem carga): 2x15 cada lado — foco em squeeze máximo no topo
- **Monster walk** com miniband nos tornozelos: 2x12 passos cada direção
- O objetivo NÃO é fadigar, é **acordar o padrão neural**

**2. Ordem dos exercícios:**
- Comece pelo exercício de maior ativação glútea PRIMEIRO, quando o drive neural da ativação ainda está fresco
- **Hip thrust** antes de agachamento — pesquisa do Bret Contreras mostra ativação EMG do glúteo **~2x maior** no hip thrust vs agachamento
- Agachamento e leg press são exercícios de quadríceps dominante — não são ruins pra glúteo, mas não devem ser o foco principal

**3. Técnica no agachamento para mais glúteo:**
- Stance mais ampla (1,5x largura dos ombros)
- Pés levemente apontados para fora (~30°)
- "Empurre o chão para fora" com os pés (abdução ativa)
- Profundidade: pelo menos paralelo ou abaixo — a ativação do glúteo **dobra** abaixo dos 90° de flexão do joelho
- Na subida: inicie com "empurrar o quadril pra frente", não com estender os joelhos

Experimente essas mudanças por 3-4 semanas e me diz se melhorou.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `Mariana, eu era igualzinha. O que mudou TUDO pra mim foi a ativação com miniband antes do treino + colocar hip thrust como primeiro exercício. Em 3 semanas já tava sentindo o glúteo de um jeito que nunca tinha sentido em 2 anos de treino.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `Vou começar amanhã com a ativação! Nunca fiz clamshell nem monster walk. E sempre fiz agachamento primeiro e hip thrust no final quando já tava morta. Acho que achei meus erros.`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Hip thrust — técnica correta ──────────────
  {
    userId: 'user_sim_002',
    content: `Comecei a fazer hip thrust mas fico com dor na lombar e a barra machuca o quadril. Tô usando 40kg e faço 4x12. Alguém tem dicas de técnica? Já pensei em desistir desse exercício.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Juliana, dor lombar e desconforto da barra são os dois problemas mais reportados no hip thrust — e ambos são 100% corrigíveis.

**DOR LOMBAR — Causa: hiperextensão do quadril**

O erro mais comum é subir o quadril "o mais alto possível" e arquear a lombar no topo. O glúteo máximo faz **extensão do quadril até 0° (posição neutra)** — acima disso, quem estende é a lombar.

**Correção:**
- No topo do movimento, seu corpo deve formar uma **linha reta** dos ombros ao joelho — não um arco
- **Posterior pelvic tilt (PPT)** no topo: "enfie o cóccix pra dentro" no ponto de contração máxima
- Olhe para o seu cinto/umbigo no topo, NÃO para frente — isso evita hiperextensão cervical que puxa a lombar junto
- O queixo deve ficar levemente tucked (olhando pra frente/baixo)

**BARRA MACHUCANDO — Soluções:**
- Use um **pad grosso** (tipo Squat Sponge ou Hampton thick bar pad) — os pads finos de academia não resolvem
- Posicione a barra **na dobra do quadril** (crista ilíaca), não no osso do púbis
- Se não tiver pad bom: dobre um colchonete de yoga ao meio e enrole na barra
- Alternativa: hip thrust na **Smith machine** com pad — mais estável e mais fácil de posicionar

**POSIÇÃO DOS PÉS (afeta tudo):**
- Pés na largura dos ombros, afastados o suficiente para que no topo do movimento as **canelas fiquem verticais** (90° no joelho)
- Pés muito perto do corpo → quadríceps domina
- Pés muito longe → posteriores dominam e lombar compensa
- Pés levemente apontados para fora (~15-20°) e empurre os joelhos para fora

**POSIÇÃO DAS COSTAS NO BANCO:**
- A borda do banco deve apoiar na **base da escápula** (não no meio das costas)
- Banco muito alto = desconforto e pouca amplitude
- Banco muito baixo = perde estabilidade

Tenta essas correções com carga leve (20kg) primeiro e vai subindo quando a técnica estiver limpa.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `Juliana, a dica do queixo tucked e do PPT no topo eliminaram minha dor lombar na hora. E sobre o pad — investi num Hampton thick pad e nunca mais senti a barra. Vale cada centavo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `Meu Deus, meus pés estavam MUITO perto do banco! E eu realmente hiperestendia a lombar no topo achando que era pra subir o máximo. Vou corrigir tudo isso. Obrigada pela explicação detalhada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Melhores exercícios por região do glúteo ──
  {
    userId: 'user_sim_001',
    content: `Quero focar na parte lateral e superior do glúteo (aquele "shelf" na parte de cima). Quais exercícios são melhores pra cada região? Faço só hip thrust, agachamento e búlgaro atualmente.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Ana Paula, excelente pergunta. O complexo glúteo tem **3 músculos** com funções diferentes, e treinar só com exercícios de extensão de quadril (hip thrust, agachamento) deixa lacunas importantes.

**ANATOMIA FUNCIONAL:**

**Glúteo Máximo (subdivisões superior e inferior):**
- Função principal: extensão e rotação externa do quadril
- Porção superior: também faz **abdução** — é ela que cria o "shelf" que você quer
- Porção inferior: extensão pura

**Glúteo Médio:**
- Função: **abdução e estabilização** do quadril
- Responsável pelo arredondamento lateral
- Muito ativado em exercícios unilaterais e com abdução

**Glúteo Mínimo:**
- Estabilizador profundo, abdução
- Trabalhado junto com o médio na maioria dos exercícios de abdução

**EXERCÍCIOS POR REGIÃO (baseado em estudos EMG):**

**Para "shelf" superior + lateral (glúteo máximo superior + médio):**
- **Abdução de quadril no cabo** (em pé): altíssima ativação da porção superior
- **Side-lying hip abduction** com carga: simples mas muito eficaz
- **Sumo deadlift / Sumo squat**: a abdução ativa durante o movimento recruta porção superior
- **Monster walk / Band walk**: ativação contínua do médio

**Para volume/massa geral (glúteo máximo inferior + superior):**
- **Hip thrust** (bilateral e unilateral): rei da ativação EMG do glúteo máximo
- **Stiff / RDL**: excelente no glúteo em posição alongada (stretch)
- **Agachamento búlgaro**: combina extensão + estabilização unilateral

**Para arredondamento lateral (glúteo médio):**
- **Abdução sentada na máquina** (incline o tronco pra frente pra mais médio)
- **Clamshell** com carga progressiva
- **Single-leg Romanian deadlift**: o médio trabalha intensamente pra estabilizar

**Seu treino atual revisado:**
Você tem hip thrust (massa geral ✅), agachamento (quad dominante, glúteo moderado ✅) e búlgaro (unilateral ✅). Faltam exercícios de **abdução** para a parte lateral/superior. Adicione 2-3 exercícios de abdução por sessão e em 8-12 semanas você vai notar a diferença na parte lateral.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `Quando comecei a fazer abdução no cabo e hip abduction deitada, meu glúteo mudou completamente em 3 meses. É impressionante como quase ninguém treina abdução de quadril e depois reclama que o glúteo não cresce nas laterais.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Entendi! Meu treino era 100% extensão de quadril e zero abdução. Vou adicionar abdução no cabo e na máquina sentada. Obrigada pela separação por região, ficou muito claro! 💪`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Frequência ideal de treino de glúteo ──────
  {
    userId: 'user_sim_016',
    content: `Atualmente treino glúteo 1x na semana no "dia de perna". Mas vejo muita gente dizendo que precisa treinar 2-3x pra crescer. Qual a frequência ideal? E como encaixar sem sobrecarregar?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Daniela, a ciência atual favorece **frequência maior** para o glúteo, e tem razões fisiológicas específicas pra isso.

**Por que o glúteo responde bem a frequência alta:**
- A **síntese proteica muscular (MPS)** pós-treino dura **24-48h** em músculos treinados — com 1x/semana, você tem 5 dias sem estímulo anabólico
- O glúteo é um músculo **grande, potente e resistente à fadiga** — recupera mais rápido que músculos menores
- Estudos de Schoenfeld (2016) e outros mostram que **2x/semana produz mais hipertrofia que 1x** com mesmo volume semanal total

**Recomendação prática: 2-3x/semana**

**Distribuição do volume semanal:**

Se você faz **16-20 séries semanais** de glúteo (recomendação para intermediárias):

**Opção A — 2x/semana:**
- Dia A: 8-10 séries (foco em extensão de quadril: hip thrust, RDL, búlgaro)
- Dia B: 8-10 séries (foco em abdução + unilateral: abdução no cabo, step-up, clamshell com carga)

**Opção B — 3x/semana:**
- Dia A: 6 séries (hip thrust pesado 4x6-8 + RDL 2x10)
- Dia B: 6 séries (búlgaro 3x10 + abdução cabo 3x12-15)
- Dia C: 6 séries (hip thrust leve/pausa 3x12-15 + side-lying abduction 3x15)

**Como encaixar na rotina sem sobrecarregar:**
- NÃO duplique treinos idênticos — varie exercícios, ângulos e faixas de repetição
- Separe os dias de glúteo por **pelo menos 48h** (ex: segunda, quarta, sexta)
- Se treina perna pesada (agachamento/leg), conte as séries que ativam glúteo indiretamente
- O volume total semanal importa mais que o volume por sessão

**Sinal de que a frequência está alta demais:**
- Dor/fadiga acumulada que não resolve em 48h
- Performance caindo sessão após sessão
- Se isso acontecer → reduza para 2x e diminua 2-3 séries totais`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Mudei de 1x pra 2x por semana há 6 meses, com o mesmo volume semanal total só dividido em 2 dias. A diferença foi nítida — muito mais crescimento do que nos 2 anos anteriores treinando 1x. Recomendo demais.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `Vou testar a Opção A com 2x/semana. Faz sentido dividir em extensão e abdução em dias separados. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Agachamento profundo vs paralelo ──────────
  {
    userId: 'user_sim_009',
    content: `Meu professor diz que agachamento profundo (abaixo do paralelo) é perigoso pro joelho e não precisa pra glúteo. Mas vejo outros profissionais dizendo o contrário. Qual a real?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Bruno, essa é uma das maiores discussões no treinamento e a ciência já tem posição bem clara.

**O agachamento profundo é perigoso pro joelho?**

**NÃO, para a maioria das pessoas.** Revisões sistemáticas (Hartmann et al., 2013; Schoenfeld, 2010) concluem que:
- As forças compressivas no joelho **não aumentam** significativamente abaixo do paralelo — na verdade, elas atingem o pico a ~90° de flexão
- Abaixo de 90°, a área de contato patelofemoral **aumenta**, distribuindo melhor a força
- O "wrapping effect" dos tecidos moles (posteriores de coxa contra panturrilha) **estabiliza** a articulação em flexão profunda
- Contraindicação real: lesões pré-existentes no menisco ou cartilagem, condições específicas

**E para ativação do glúteo?**

A ciência é clara: **profundidade importa muito.**
- Estudos EMG mostram que a ativação do glúteo máximo **aumenta significativamente** quando a flexão do quadril ultrapassa 90°
- Calhoon & Fry (1999), Contreras et al. (2015): a ativação do glúteo em agachamento profundo é **~25-35% maior** que no agachamento paralelo
- O glúteo trabalha mais na porção **inferior do movimento** (saída do "hole"), onde está em máximo alongamento sob carga

**Na prática:**
- Se seu objetivo é glúteo → agachamento **pelo menos paralelo**, idealmente abaixo
- Se não tem mobilidade para profundo com boa técnica → trabalhe mobilidade de tornozelo e quadril progressivamente
- Profundidade > carga: melhor fazer profundo com 60kg do que paralelo com 100kg se o objetivo é glúteo
- Se tem limitações articulares reais no joelho → use hip thrust e RDL como exercícios primários de glúteo e mantenha o agachamento na profundidade confortável

**Sobre o professor:** com respeito, essa orientação é baseada em conceitos antigos que foram refutados pela literatura atual. Mas se ele insiste, não precisa bater de frente — simplesmente adicione hip thrust e exercícios de abdução ao treino para compensar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: `Essa informação sobre as forças no joelho é importante. O medo do agachamento profundo vem de um estudo dos anos 60 que já foi completamente superado, mas muitos profissionais continuam repetindo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `Boa, vou trabalhar mobilidade pra conseguir descer mais. E adorei a dica de não bater de frente com o professor — vou adicionar hip thrust por conta própria e pronto. 😂`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Progressão de carga no hip thrust ─────────
  {
    userId: 'user_sim_020',
    content: `Faço hip thrust há 4 meses e tô estagnada em 80kg. Faço 4x12 certinho mas não consigo subir pra 90kg. Como vocês progridem nesse exercício?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Beatriz, platô no hip thrust é super comum porque é um exercício que permite cargas altas rápido, mas a progressão linear tem limite. Vamos explorar formas inteligentes de progredir.

**Progressão de carga NÃO é a única forma de progressão.**

Existe o conceito de **sobrecarga progressiva multidimensional** — você pode progredir em várias variáveis:

**1. Progressão por repetições (mais acessível):**
- Semana 1: 80kg 4x10
- Semana 2: 80kg 4x11
- Semana 3: 80kg 4x12
- Semana 4: 85kg 4x9-10 → reinicia o ciclo
- Esse modelo de **double progression** é excelente para intermediárias

**2. Progressão por pausa (aumenta tempo sob tensão):**
- Mantenha 80kg mas adicione **2-3 segundos de squeeze** no topo de cada rep
- 80kg com 3s de pausa no topo é significativamente mais difícil que 90kg sem pausa
- Altíssima ativação do glúteo pelo pico de contração mantido

**3. Progressão por tempo excêntrico:**
- Desça em **3-4 segundos** controlando o peso
- O dano mecânico na excêntrica é um dos principais drives de hipertrofia

**4. Progressão unilateral:**
- Single-leg hip thrust com 30-40kg é brutalmente mais difícil que bilateral com 80kg
- Corrige assimetrias e aumenta recrutamento motor

**5. Variação de exercício (mesma função, estímulo diferente):**
- Hip thrust com pés elevados (maior ROM)
- Hip thrust na Smith (mais estável, permite focar mais no squeeze)
- Hip thrust com banda nos joelhos (adiciona abdução simultânea)
- Glute bridge no chão com carga (ROM menor, pico de contração diferente)

**Estrutura prática para sair do platô (4 semanas):**
- Semana 1: Hip thrust pausa 3s — 70kg 4x10
- Semana 2: Hip thrust pausa 3s — 72,5kg 4x10
- Semana 3: Hip thrust normal — 82,5kg 4x8
- Semana 4: Hip thrust normal — 85kg 4x8

Aposte na variação de estímulos em vez de insistir na mesma configuração esperando resultado diferente.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `A progressão por pausa no topo é insanamente eficaz. Eu tava travada em 100kg, voltei pra 80kg com 3s de squeeze e depois de 6 semanas consegui fazer 105kg normal. O tempo sob tensão faz uma diferença enorme.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Nunca tinha pensado em progressão por pausa ou excêntrica! Tava focada só em colocar mais anilha. Vou seguir esse modelo de 4 semanas e volto pra contar o resultado.`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Glúteo e dor na lombar ────────────────────
  {
    userId: 'user_sim_019',
    content: `Sempre que treino glúteo pesado (principalmente stiff e hip thrust), no dia seguinte fico com a lombar dolorida. Não é o glúteo que dói — é a lombar. Isso é normal ou tô compensando demais?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `João Carlos, **dor na lombar após treino de glúteo NÃO é normal** e geralmente indica compensação. Se fosse o glúteo trabalhando corretamente, a dor/DOMS seria no próprio glúteo.

**Causas mais comuns:**

**1. Glúteo fraco → lombar compensa na extensão de quadril**
- Quando o glúteo máximo não gera força suficiente para estender o quadril, os **eretores da espinha** assumem o trabalho
- Isso é especialmente comum no stiff/RDL e no hip thrust
- Teste rápido: consiga contrair o glúteo **isoladamente** em pé com força? Se é difícil, o drive neural pro glúteo está deficiente

**2. Erros técnicos específicos:**

**No stiff/RDL:**
- Arredondar a lombar (flexão) na descida → sobrecarga nos discos
- Hiperestender na subida → compressão facetária
- Correção: mantenha a coluna **neutra** o tempo todo. Pense em "empurrar o quadril pra trás" na descida e "empurrar o quadril pra frente" na subida, com coluna rígida

**No hip thrust:**
- Hiperextensão no topo (como falamos antes)
- Apoio no banco muito baixo → lombar compensa a falta de estabilidade
- Correção: PPT no topo + banco na base da escápula

**3. Core fraco / instabilidade lombopélvica:**
- Se o core não estabiliza a pelve durante a extensão de quadril, a lombar se torna o fulcro do movimento
- Solução: fortaleça core anti-extensão (dead bug, pallof press, prancha)

**Protocolo de correção (4-6 semanas):**
1. Reduza carga em 30-40% em todos os exercícios de glúteo
2. Faça ativação glútea antes de cada treino (ponte, clamshell, fire hydrant)
3. Adicione 2-3 exercícios de core anti-extensão ao final do treino
4. Foque em técnica perfeita: filme seus sets e analise
5. Progrida carga SÓ quando a dor lombar zerar

Se a dor persistir mesmo com técnica corrigida e carga leve → procure um fisioterapeuta para avaliação.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `Passei pelo mesmo problema. O fisio me avaliou e meu glúteo era extremamente fraco comparado com eretores — compensação clássica. 8 semanas de ativação focada + dead bugs todo treino e a lombar parou de doer completamente.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_019',
    content: `Fiz o teste de contrair o glúteo em pé e realmente é bem difícil ativar com força de forma isolada. Vou seguir o protocolo de correção. Valeu demais!`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Genética e expectativas realistas ─────────
  {
    userId: 'user_sim_007',
    content: `Treino glúteo há 2 anos, 3x/semana, progressão de carga, proteína em dia. Meu glúteo cresceu, mas NADA perto do que vejo nas influencers. Será que é genética e eu tenho que aceitar? Tô ficando frustrada.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Fernanda, essa frustração é legítima e merece uma conversa honesta.

**O papel da genética é REAL e significativo:**

A genética influencia o desenvolvimento do glúteo em vários níveis:
- **Inserções musculares**: determinam o formato/shape do músculo — não mudam com treino
- **Distribuição de fibras tipo I vs tipo II**: afeta potencial de hipertrofia
- **Proporção pélvica**: largura do quadril e ângulo do fêmur influenciam a "estética" visual do glúteo
- **Distribuição de gordura**: genética determina ONDE seu corpo deposita gordura subcutânea — algumas mulheres depositam mais no glúteo, criando aparência de mais volume

Estudos de variabilidade individual em resposta ao treinamento mostram diferença de **até 4x na hipertrofia** entre high-responders e low-responders com o MESMO protocolo.

**A realidade das influencers (precisamos falar sobre isso):**
- Muitas usam **ângulos de foto, iluminação e edição** — o glúteo numa foto de Instagram não é o glúteo na vida real
- Uma parcela significativa usa **anabolizantes** (testosterona, oxandrolona, etc.) sem declarar — os resultados ficam fisiologicamente impossíveis para mulheres naturais
- Implantes e procedimentos estéticos são mais comuns do que se imagina nesse meio
- Comparar seu corpo natural com corpos potencialmente alterados farmacologica ou cirurgicamente é injusto

**O que é realista para uma mulher natural treinando bem:**
- **Ano 1**: ganho mais significativo — formação neural + hipertrofia inicial
- **Ano 2**: ganhos ainda visíveis mas desacelerando
- **Ano 3+**: ganhos marginais que exigem periodização sofisticada
- Total realista em 3-5 anos: aumento de volume glúteo de **15-25%** em mulheres naturais com treino e nutrição otimizados

**O que você pode controlar:**
- Seleção de exercícios (enfatizando suas fibras dominantes)
- Volume e frequência adequados
- Nutrição com superávit leve para crescimento
- Sono e recuperação
- **Composição corporal** — reduzir gordura em outras regiões pode fazer o glúteo parecer mais proeminente proporcionalmente

2 anos de treino bem feito com crescimento visível é um resultado **excelente**. Não deixe a comparação com parâmetros irrealistas diminuir sua conquista.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Esse post deveria ser leitura obrigatória pra toda mulher que treina. Quando eu parei de me comparar com perfis do Instagram e comecei a me comparar comigo mesma de 1 ano atrás, minha relação com o treino melhorou 100%. E curiosamente, meus resultados também.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `Obrigada pela honestidade. Acho que eu precisava ouvir isso. Meu glúteo CRESCEU sim comparado com 2 anos atrás, mas eu tava numa espiral de comparação com gente que provavelmente nem é natural. Vou focar no meu progresso pessoal.`,
    isAIResponse: false,
  },
];

// ============================================================
async function main() {
  console.log('🏟️  SEED: TREINO DE GLÚTEO\n');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'gluteo', mode: 'insensitive' } },
          { slug: { contains: 'glute', mode: 'insensitive' } },
          { name: { contains: 'Glúteo', mode: 'insensitive' } },
        ],
      },
    });

    if (!arena) {
      console.log('❌ Arena não encontrada. Arenas disponíveis:');
      const allArenas = await prisma.arena.findMany({
        select: { id: true, slug: true, name: true },
        orderBy: { slug: 'asc' },
      });
      allArenas.forEach(a => console.log(`  ${a.slug} | ${a.name}`));
      return;
    }

    console.log(`✅ Arena: ${arena.name} | ID: ${arena.id}`);

    // Limpar posts antigos
    const deleted = await prisma.post.deleteMany({
      where: { arenaId: arena.id },
    });
    console.log(`🗑️  ${deleted.count} posts antigos removidos`);

    // Inserir novos posts
    let created = 0;
    const baseTime = new Date('2026-02-05T09:00:00Z');

    for (let i = 0; i < POSTS.length; i++) {
      const post = POSTS[i];
      const postTime = new Date(baseTime.getTime() + (i * 18 * 60 * 1000));

      try {
        await prisma.post.create({
          data: {
            arenaId: arena.id,
            userId: post.userId,
            content: post.content,
            isPublished: true,
            isPinned: false,
            isOfficial: false,
            isAIResponse: post.isAIResponse,
            isUnderReview: false,
            isApproved: true,
            viewCount: Math.floor(Math.random() * 60) + 10,
            likeCount: Math.floor(Math.random() * 20),
            commentCount: 0,
            isDeleted: false,
            createdAt: postTime,
            updatedAt: postTime,
          },
        });
        created++;
      } catch (err: any) {
        console.error(`❌ Post ${i}: ${err.message}`);
      }
    }

    // Atualizar contagem
    const count = await prisma.post.count({
      where: { arenaId: arena.id, isDeleted: false },
    });

    await prisma.arena.update({
      where: { id: arena.id },
      data: { totalPosts: count },
    });

    console.log(`\n✅ ${created} posts criados`);
    console.log(`📊 Total na arena: ${count}`);
    console.log('\n🏟️  Arena pronta! ✅\n');
  } catch (error) {
    console.error('Erro fatal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
