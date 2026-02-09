// ═══════════════════════════════════════════════════════════════
// SEED ARENA: DIETA NA VIDA REAL
// Executar: npx tsx scripts/seed-dieta-vida-real.ts
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const POSTS = [
  // ─────────────────────────────────────────────────────────
  // CONVERSA 1: Dieta social — comer com amigos
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_lucas',
    content: `🍕 DIETA SOCIAL: COMO COMER COM AMIGOS SEM SABOTAR

Toda sexta saio com amigos: rodízio de pizza, churrasquinho, boteco. Se eu evitar, perco convívio social. Se participar, detono a dieta. Alguma estratégia real?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `A dieta que destrói sua vida social vai falhar. Vamos resolver de forma prática:

**PRINCÍPIO: Uma refeição livre/semana NÃO sabota dieta nenhuma.**
21 refeições/semana → se 20 são boas, 1 "ruim" = menos de 5%. O que sabota é o efeito cascata: "já comi pizza, estraguei tudo, vou comer o resto do fim de semana."

**ESTRATÉGIAS POR SITUAÇÃO:**

**🍕 Rodízio de Pizza:**
- Coma devagar (espere 5 min entre fatias)
- Priorize sabores com proteína (frango, atum, calabresa)
- Antes de ir: coma proteína em casa (2 ovos ou shake) — chega menos faminto
- Limite: 4-5 fatias é razoável (~800-1000 kcal em vez de 2000+)

**🥩 Churrasquinho (MELHOR cenário pra dieta):**
- Priorize: carnes, frango, linguiça artesanal
- Evite: farofa, pão de alho, maionese, refrigerante
- Cerveja: limite 2-3 long necks

**🍺 Boteco:**
- Petiscos inteligentes: carne de sol, frango à passarinha
- Evitar: porção de batata frita, pastel, mandioca frita
- Coma antes de ir (proteína + fibra)

**REGRA DOS 80/20:**
Se segunda a sexta você come bem, as 2-3 refeições sociais do fim de semana NÃO determinam seu resultado. O que estraga é a compulsão de sábado e domingo DEPOIS da refeição social.

**SOBRE ÁLCOOL:**
- 1 cerveja = ~150 kcal | 4 cervejas = 600 kcal "invisíveis"
- Estratégia: alternar cerveja com água
- Melhor opção: gin + tônica diet (~70 kcal)`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `A regra dos 80/20 me salvou. Parei de me culpar por comer pizza na sexta e foquei em fazer as outras 20 refeições certas. Perdi 8kg em 4 meses sem abrir mão de NADA social.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: `A dica de comer proteína ANTES de sair é genial. Comecei a comer 3 ovos cozidos antes do happy hour e chego lá sem fome desesperada. Como menos besteira e curto igual.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 2: Viagem e dieta
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_amanda',
    content: `✈️ VIAGEM E DIETA: COMO NÃO VOLTAR 5KG MAIS PESADO

Viajo a trabalho 2x/mês. Hotel + restaurantes + aeroporto. Sempre volto 2-3kg mais pesado. Dicas pra viagem?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `Primeiro vamos separar realidade de ilusão:

**OS 2-3KG PÓS-VIAGEM:**
- ~70% retenção hídrica (excesso de sódio em restaurantes)
- ~20% conteúdo intestinal (mais comida = mais volume no trato GI)
- ~10% pode ser gordura real
- **Tradução: desses 3kg, ~300g são gordura. O resto sai em 3-5 dias.**

**ESTRATÉGIAS PRÁTICAS:**

**✈️ Aeroporto:** Leve castanhas + barra de proteína + fruta. Evite fast food.

**🏨 Hotel:** Café da manhã = ovos mexidos + frutas + queijo. Evite pães, bolos, sucos de caixa. Se tem cozinha: mercado local para iogurte, frutas, castanhas.

**🍽️ Restaurantes:** Regra simples: proteína + salada + 1 acompanhamento. Prato executivo é a refeição mais equilibrada e barata do restaurante.

**💡 Kit Viagem:** 3-4 sachês de whey, castanhas em porções, barras de proteína, garrafinha.

**MENTALIDADE:**
Viagem 2x/mês = 4-6 dias fora da rotina. Nos outros 24-26 dias se você come bem, essas viagens NÃO determinam seu resultado. Faça escolhas razoáveis (não perfeitas) e curta.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `O kit viagem com sachês de whey mudou tudo. Tomo de manhã no quarto com água e já garanto 30g de proteína antes de sair. Chego no restaurante menos faminta.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `Viajo toda semana e confirmo: os 2-3kg somem em 3 dias depois que volto pra rotina. Era puro sódio + volume intestinal. Parei de pirar com a balança pós-viagem.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 3: Dieta sem cozinhar
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_pedro',
    content: `🍽️ COMO MANTER DIETA SEM COZINHAR

Engenheiro, trabalho 10h/dia. Zero tempo pra cozinhar. Restaurante por quilo é opção? Delivery? Como manter alimentação saudável comendo fora?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `Verdade que ninguém fala: você NÃO precisa cozinhar pra comer bem.

**RESTAURANTE POR QUILO — SUA MELHOR OPÇÃO:**

**Como montar o prato:**
- 1/2 do prato: salada e vegetais variados
- 1/4 do prato: proteína (grelhado, assado — EVITE frito)
- 1/4 do prato: arroz + feijão
- Finalizar com azeite na salada

**O que PEGAR:** grelhados, saladas variadas, legumes refogados, arroz + feijão, ovos
**O que EVITAR:** frituras, maionese, farofas gordurosas, massas cremosas, refrigerante

**JANTAR SEM COZINHAR:**
- Omelete (5 min, 3 ovos + queijo + tomate)
- Salada pronta de supermercado + frango de rotisserie (R$15-20, rende 2 jantares)
- Wrap integral + atum + salada (3 min)
- Delivery de marmita fit

**CAFÉ DA MANHÃ (2 min):**
Iogurte grego + fruta + granola OU shake de whey + banana + pasta de amendoim

**CUSTO MENSAL SEM COZINHAR:** ~R$1.100 vs meal prep caseiro ~R$700
Mais caro, sim. Mas se 10h de trabalho = seu tempo vale mais que R$400/mês. É investimento.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Faço EXATAMENTE isso. Por quilo no almoço + omelete no jantar. Perdi 12kg em 6 meses SEM cozinhar uma única marmita.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `O frango de rotisserie do supermercado é hack de vida. R$15-20, rende 2 jantares, zero preparo. Com salada de saquinho = jantar saudável em 2 minutos.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 4: Família que não colabora
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_002',
    content: `👨‍👩‍👧 DIETA QUANDO A FAMÍLIA NÃO COLABORA

Meu marido compra biscoito, sorvete, refrigerante. Meus filhos comem porcaria o dia todo. Tem SEMPRE tentação em casa. Ele diz que "não é justo" tirar dos outros por causa da minha dieta. Como lidar?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `Seu marido tem razão parcialmente — você não pode impor restrições à família. Mas existem estratégias sem conflito:

**PRINCÍPIO: Ambiente > Força de vontade**
Resistir a sorvete na geladeira 10x/dia → uma hora cede. A solução é mudar o ambiente.

**ESTRATÉGIAS:**

**1. Gaveta/prateleira da família:** Guloseimas em UM local que você não vê. Não é tirar, é organizar.

**2. SEU estoque visível:** Frutas na bancada, castanhas no pote bonito, iogurte na frente da geladeira. O que você vê primeiro, come primeiro.

**3. Mesma base, personalização diferente:** Arroz + feijão + carne + salada = todo mundo come junto. Família adiciona fritura se quiser, você adiciona salada extra.

**4. Não proíba, substitua:** Em vez de "tirem o refrigerante", coloque água com gás + limão gelada na mesa.

**5. Cozinha fechada pós-jantar:** Chá, água — OK. Snacking noturno eliminado por regra, não por dieta.

**SOBRE SEU MARIDO:**
Conversa honesta: "Não preciso que mude, só que as coisas que me tentam fiquem na gaveta X. Você come o que quiser." Isso é justo.

**DADO:** Pessoas com ultraprocessados VISÍVEIS em casa pesam 4-6kg a mais. Não é proibir — é visibilidade.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `A "gaveta da família" salvou meu casamento e minha dieta. Meu marido entendeu quando expliquei que não era proibir, era organizar. Funciona DEMAIS.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `Potes bonitos de castanhas e frutas secas na bancada = melhor hack. Quando bate vontade, pego ali. Não preciso abrir gaveta de biscoito.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 5: Comer emocional
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_003',
    content: `😰 COMO PARAR DE COMER POR ANSIEDADE

Meu problema não é falta de conhecimento. Sei o que comer. Mas quando fico ansiosa, como compulsivamente. Chocolate, biscoito, o que tiver. Depois vem culpa → mais ansiedade → mais compulsão. Como sair desse ciclo?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `O que você descreve é comer emocional — atinge ~40% das pessoas que fazem dieta. Conhecimento nutricional NÃO resolve. É questão comportamental.

**O CICLO:** Estresse → comer compulsivo → culpa → mais ansiedade → mais compulsão

**POR QUE ACONTECE:**
Açúcar e gordura ativam dopamina (recompensa). Cérebro aprende: comida = alívio do estresse. Quanto mais repete, mais forte a conexão.

**ESTRATÉGIAS BASEADAS EM EVIDÊNCIA:**

**1. Timer de 10 minutos:** Sentiu vontade? Espere 10 min. Não proíba — adie. Em 50-60% das vezes, a vontade passa.

**2. Identifique o gatilho:**
- Fome real: cresce gradualmente, qualquer comida resolve, estômago ronca
- Fome emocional: surge subitamente, quer algo ESPECÍFICO, vem da "cabeça"

**3. Substitua a recompensa (não a emoção):**
- Ansiedade → caminhada 10 min (libera mesmas endorfinas que chocolate)
- Estresse → banho quente, respiração 4-7-8
- Tédio → ligar pra alguém

**4. Não restrinja demais:** Dietas ultrarestritivas AUMENTAM compulsão. Permita 1-2 quadrados de chocolate amargo/dia. Incluir remove o "proibido".

**5. Sono e exercício:** Sono < 6h = grelina (fome) sobe 28%. Exercício regular = cortisol cai 20-30%.

**QUANDO BUSCAR AJUDA:** Se compulsão é diária e incontrolável → psicólogo com TCC para transtornos alimentares.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `O timer de 10 minutos mudou minha relação com comida. Parece bobo mas funciona. Na metade das vezes a vontade passa. Faço há 3 meses e reduzi muito a compulsão.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Incluir 2 quadrados de chocolate amargo todo dia acabou com minha compulsão. Quando permiti, o fim de semana parou de ser festa de compensação. Parece contraditório mas funciona.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 6: Dieta barata
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_004',
    content: `💰 DIETA SAUDÁVEL COM SALÁRIO MÍNIMO

Todo mundo fala "coma salmão, abacate, castanhas" — coisas que custam metade do meu mercado. Dá pra comer saudável de verdade com pouco dinheiro?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `A comida mais saudável do Brasil É a mais barata: arroz, feijão, ovo, banana, couve.

**PROTEÍNAS BARATAS:**
- **Ovo** — R$0,60-0,80/un (REI ABSOLUTO)
- **Frango coxa** — R$12-15/kg
- **Sardinha em lata** — R$5-7 (substitui salmão! Mais ômega-3 que cápsulas)
- **Feijão** — R$6-8/kg
- **Fígado bovino** — R$12-18/kg (mais nutritivo que qualquer multivitamínico)

**CARDÁPIO DIÁRIO R$25-30:**
- Café: 3 ovos mexidos + banana + café
- Almoço: arroz + feijão + frango + couve refogada
- Lanche: amendoim + banana
- Jantar: omelete com legumes + batata cozida

**SUBSTITUIÇÕES INTELIGENTES:**
- Sardinha em lata 3x/semana = ômega-3 sem suplemento
- Fígado 1x/semana = multivitamínico natural
- 4-5 ovos/dia = mesma proteína que 1 scoop whey
- Amendoim = substitui castanhas caras

Sua alimentação pode ser MELHOR que quem gasta R$500/mês em suplementos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Arroz, feijão, ovo, couve e frango é a base mais saudável que existe e custa menos que fast food. Parei de gastar com suplemento e investi em comida de verdade.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: `A dica da sardinha substituindo salmão é OURO. 3 latas/semana = R$15-20 e meu triglicerídeo caiu 40 pontos em 3 meses.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 7: Ciclo segunda-feira
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_020',
    content: `🔄 TODA SEGUNDA RECOMEÇO A DIETA — COMO PARAR?

Padrão: segunda a quinta faço dieta certinha. Sexta relaxa. Sábado é churrasco, cerveja, pizza. Domingo como tudo porque "amanhã recomeço". Segunda, 2kg mais pesada. Há 2 anos assim. Socorro.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `Esse padrão tem nome: **ciclo restrição-compulsão**. Motivo nº 1 de estagnação. A solução é contraintuitiva: ser MENOS rígida durante a semana.

**A MATEMÁTICA:**
- Seg-Qui (4 dias): déficit 500 kcal/dia = -2.000 kcal
- Sex-Dom (3 dias): excesso 1.000-1.500 kcal/dia = +3.000-4.500 kcal
- **Saldo: +1.000 a +2.500 kcal = ENGORDANDO**
- Você sofre 4 dias pra ganhar peso em 3. Pior dos mundos.

**A SOLUÇÃO:**

**1. Aumente calorias seg-qui:** -300/dia em vez de -500. Parece que "demora mais", mas sem compensação no fim de semana o resultado líquido é melhor.

**2. Inclua "proibidos" DURANTE a semana:**
- 2 quadrados de chocolate/dia ✅
- 1 fatia de pizza na quarta ✅
- Quando inclui, o fim de semana perde função de "escape"

**3. Fim de semana com consciência (não restrição):** Churrasco, pizza — OK. Só não entre no modo "já foi, vou comer tudo".

**4. Elimine "recomeçar segunda":** Não existe zerar. Uma pizza não apaga 4 dias bons.

**5. Pare de pesar na segunda:** Peso de segunda é sempre inflado (sódio, álcool). Pese quarta ou quinta.

**META REALISTA:** 0.5kg/semana consistente = 24kg/ano. Sem sofrimento.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `Isso foi EU por 3 anos. Relaxei durante a semana (incluí chocolate, pizza de quarta) e o fim de semana parou de ser compensação. Perdi 10kg em 6 meses sem "segunda-feira reset".`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `A matemática me chocou. Eu realmente sofro 4 dias pra GANHAR peso em 3. Vou mudar a abordagem. Obrigada pela clareza.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 8: Platô de emagrecimento
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_007',
    content: `📉 PAREI DE EMAGRECER — PLATÔ HÁ 2 MESES

Perdi 8kg nos primeiros 3 meses. Nos últimos 2 meses, ZERO. Mesma dieta, mesmo treino. Já reduzi mais calorias e nada. Estou em 1.200 kcal e treino 5x. O que está errado?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_dieta_real',
    content: `Platô com 1.200 kcal é sinal de ALERTA, não sinal pra cortar mais.

**POR QUE O PLATÔ ACONTECE:**
Quando perde peso: metabolismo basal CAI, NEAT diminui, hormônios da fome AUMENTAM, eficiência metabólica AUMENTA. = Adaptação metabólica.

**O PROBLEMA:** 1.200 kcal + treino 5x = "modo sobrevivência". Metabolismo caiu pra ~1.200. Déficit real = ZERO. Cortar mais = perda muscular + fadiga.

**A SOLUÇÃO — COMER MAIS (Diet Break):**

**Fase 1 — Diet Break (2-4 semanas):**
Subir para manutenção (~1.800-2.000 kcal). Adicionar carboidratos. Manter proteína alta. Continuar treinando. Vai ganhar 1-2kg (água + glicogênio, NÃO gordura).

**Fase 2 — Novo déficit moderado:**
Voltar para ~1.500-1.600 kcal (NÃO 1.200). Proteína 1.6-2g/kg. Treino 4x (não 5). Perda recomeça.

**POR QUE FUNCIONA:** Diet break "reseta" leptina, T3, NEAT. Quando volta ao déficit, corpo responde de novo.

**VERIFICAR TAMBÉM:**
- Sono < 7h = cortisol elevado = retenção
- Estresse crônico = gordura abdominal
- Fase lútea = retenção 1-3kg (normal)
- Tireoide: se platô > 3 meses

Parece loucura "coma mais pra perder", mas a ciência apoia. Topa diet break de 2 semanas?`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Platô de 3 meses com 1.300 kcal. Nutricionista mandou subir pra 1.800 por 3 semanas. Ganhei 1.5kg (pânico). Voltei pra 1.500 e perdi 4kg em 6 semanas. Diet break FUNCIONA.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `Explica tudo! Eu estava cortando cada vez mais e piorando. 1.200 treinando 5x é insustentável. Vou fazer o diet break.`,
    isAIResponse: false,
  },
];

// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log('🏟️  SEED: DIETA NA VIDA REAL\n');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'dieta', mode: 'insensitive' } },
          { slug: { contains: 'vida-real', mode: 'insensitive' } },
          { name: { contains: 'Dieta na Vida Real', mode: 'insensitive' } },
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
    const baseTime = new Date('2026-02-07T09:00:00Z');

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
            viewCount: Math.floor(Math.random() * 50) + 5,
            likeCount: Math.floor(Math.random() * 15),
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
