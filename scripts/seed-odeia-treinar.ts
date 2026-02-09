// ═══════════════════════════════════════════════════════════════
// SEED ARENA: EXERCÍCIO PARA QUEM ODEIA TREINAR
// Executar: npx tsx scripts/seed-odeia-treinar.ts
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const POSTS = [
  // ─────────────────────────────────────────────────────────
  // CONVERSA 1: Exercício mínimo efetivo
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_019',
    content: `🎯 EXERCÍCIO MÍNIMO EFETIVO: QUANTO É SUFICIENTE?

Tenho 55 anos e zero condicionamento. Qual o MÍNIMO de exercício que faz diferença real na saúde? Não quero meta de Instagram, quero saúde.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `Pergunta mais inteligente que existe ao começar. Dados reais:

**O MÍNIMO CIENTIFICAMENTE COMPROVADO:**
- 150 min/semana de atividade moderada (caminhada acelerada)
- OU 75 min/semana de atividade intensa
- Traduzindo: **30 min de caminhada, 5x/semana**

**O DADO MAIS IMPORTANTE:**
O maior salto de benefício é entre ZERO e POUCO. Sedentário → 90 min/semana = **redução de 30-40% em mortalidade**. De 150 → 300 min = só mais 5-10%. Fazer qualquer coisa é infinitamente melhor que nada.

**SEU PLANO PROGRESSIVO:**
- Semana 1-4: caminhada 15 min, 3x/semana (total 45 min)
- Semana 5-8: caminhada 20-25 min, 4x/semana (total 100 min)
- Semana 9-12: caminhada 30 min, 5x/semana (150 min — META)

**ADICIONAL PÓS-50 (Sarcopenia):**
Perda muscular acelera. Adicione 2x/semana, 10 min:
- Agachamento na cadeira: 2x10
- Flexão na parede: 2x10
- Subir escada: 2-3 andares

**O QUE GANHA:** Redução 30-40% risco cardiovascular, melhora do sono, menos ansiedade, proteção contra diabetes.

Começar com 15 min 3x/semana é o passo que muda tudo. Consegue essa semana?`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_018',
    content: `Tenho 58 anos e comecei exatamente assim — 15 min de caminhada. Hoje, 1 ano depois, faço 40 min + musculação leve. Meu cardiologista tirou um remédio de pressão.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_019',
    content: `O dado de que o maior benefício é entre ZERO e POUCO me motivou muito. Sempre pensei que tinha que ser intenso. Vou começar segunda com 15 min.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 2: Detesta academia
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_renata',
    content: `🏋️ DETESTO ACADEMIA MAS PRECISO ME EXERCITAR

Não suporto o barulho, a competição, as máquinas. Mas sei que preciso. O que funciona pra quem ODEIA treinar?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `~50% das pessoas que começam academia desistem em 3 meses. O problema não é preguiça — é incompatibilidade.

**ALTERNATIVAS REAIS:**

**Ar livre:** Caminhada/corrida, ciclismo, trilhas, calistenia em praça

**Social:** Dança (zumba, forró), lutas (muay thai, boxe — surpreendentemente acolhedoras), vôlei, grupos de corrida

**Casa:** Yoga (YouTube), treinos com peso corporal (Nike Training Club app), pular corda (20 min = cardio intenso), mini trampolim

**Eficiência máxima:** HIIT 15-20 min, kettlebell, calistenia

**COMO DESCOBRIR A SUA:**
1. Sozinha ou grupo?
2. Dentro ou ar livre?
3. Intenso e curto ou moderado e longo?
4. Competitivo ou não?

Exemplo: sozinha + ar livre + moderado + com música = **caminhada com podcast**
Grupo + intenso + com música = **zumba**

**REGRA DE OURO:** O melhor exercício é o que você CONSEGUE MANTER por meses. Se academia te faz sofrer, chance de manter = zero.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `Comecei muay thai achando que ia odiar. Exercício mais divertido que já fiz! O ambiente é oposto da academia: todo mundo se ajuda. Gasto 600 kcal/aula e saio feliz.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `Pular corda em casa transformou meu condicionamento. 15 min/dia, zero deslocamento, zero mensalidade. A corda custou R$25.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 3: Treino em casa mãe com bebê
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_amanda',
    content: `🤱 TREINO EM CASA COM BEBÊ DORMINDO

Mães ocupadas: preciso de treino de 20 min, sem equipamento, sem barulho (bebê dormindo). Existe isso?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `Existe! Treino "Silent Burn" — 20 min, zero barulho, sem pulos:

**Aquecimento (2 min):** Marcha no lugar (sem bater pé) + rotação quadril

**BLOCO 1 — Inferior (7 min):**
- Agachamento lento (3s descendo) — 12x
- Afundo alternado — 10x cada
- Ponte de glúteo com pausa 3s — 15x
- Agachamento isométrico parede — 30s

**BLOCO 2 — Superior + Core (7 min):**
- Flexão (chão ou parede) — 10-15x
- Prancha frontal — 30s
- Superman — 12x
- Tríceps no chão — 8-12x
- Prancha lateral — 20s cada

**BLOCO 3 — Cardio silencioso (3 min):**
- Mountain climber LENTO — 30s
- Agachamento + joelho alto — 30s
- Prancha com toque ombro — 30s

**Alongamento (1 min)**

**CARACTERÍSTICAS:** ✅ Zero pulos ✅ Zero equipamento ✅ 20 min exatos ✅ Corpo todo ✅ Pode dividir 2x 10 min

**Progressão:** 1x/semana → 2x → 3x. Semana 8+: garrafa 2L como peso.

**DICA REAL:** Não espere 20 min perfeitos. Se bebê acordar no minuto 12, você fez 12 min — infinitamente melhor que zero.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `Fiz esse treino na licença maternidade. Voltei ao trabalho com mais disposição do que antes de engravidar. A dica "12 min é melhor que zero" salvou minha sanidade.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_amanda',
    content: `Mountain climber lento é genial! Nunca tinha pensado em exercício silencioso. Bebê tem 4 meses, vou começar pelo bloco 1.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 4: Caminhada é suficiente
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_006',
    content: `🚶‍♀️ SÓ CAMINHADA É SUFICIENTE OU PRECISO DE MAIS?

Caminho 30 min/dia há 1 ano. Perdi 6kg, me sinto ótima. Mas todo mundo diz que "preciso de musculação". SÓ caminhar é suficiente? Tenho 42 anos.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `Parabéns pelo 1 ano de consistência — mais raro e valioso que qualquer plano perfeito.

**Saúde geral e longevidade → SIM, caminhada é excelente.** Atende OMS.

**Emagrecimento → Funciona, com limite.** Corpo adapta, gasto diminui.

**Saúde muscular e óssea pós-40 → NÃO é suficiente sozinha.**

Após 40: perda muscular 3-5%/DÉCADA. Osteoporose silenciosa. Risco de queda aumenta. Caminhada NÃO preserva massa muscular.

**MAS NÃO PRECISA SER ACADEMIA:**
- Treino em casa com peso corporal (20 min, 2x/sem)
- Pilates
- Yoga power/vinyasa
- Elásticos de resistência (R$30-50)

**VERSÃO MÍNIMA — Adicione pós-caminhada:**
- 15 agachamentos
- 10 flexões
- 15 pontes de glúteo
- 30s prancha
- Repetir 2x. Total: 8-10 min.

Caminhada diária + 10 min de força = programa COMPLETO de saúde.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Caminhada + 10 min de força depois. Minha densitometria óssea melhorou de um ano pro outro. Osteoporose é silenciosa, força muscular previne. Adicionem!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `Comprei elásticos de resistência (R$40) e faço em casa depois da caminhada. 3 exercícios, 10 min, 3x/semana. Mais firmeza no corpo em 2 meses.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 5: Motivação zero
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_004',
    content: `😴 COMO CRIAR HÁBITO COM MOTIVAÇÃO ZERO

Já comprei plano anual de academia 3 vezes. Fui no máximo 2 meses. Agora nem compro porque sei que vou desistir. Como criar o hábito quando NÃO TEM vontade?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `Direto: motivação NÃO cria hábito. Hábito cria motivação. Pessoas que treinam há anos não acordam motivadas — têm um SISTEMA.

**MÉTODO DOS MICRO-HÁBITOS (BJ Fogg, Stanford):**

**Regra 1 — Comece ridiculamente pequeno:**
- Semana 1: coloque o tênis. SÓ ISSO.
- Semana 2: coloque tênis + saia de casa. Pode voltar em 5 min.
- Semana 3: caminhe 10 min.
- Semana 4: caminhe 15-20 min.

**Regra 2 — Vincule a algo que já faz:**
"Depois do café, coloco o tênis" (não "vou treinar de manhã")

**Regra 3 — Elimine fricção:**
Roupa separada na noite anterior. Exercício PERTO de casa.

**Regra 4 — Regra dos 2 minutos:**
Nos piores dias: 10 agachamentos + 10 flexões = 90 segundos. Na maioria das vezes, depois de começar você continua.

**Regra 5 — Não quebre a sequência:**
Calendário, marque X nos dias. Depois de 7 dias, não quer quebrar.

**O QUE MATOU SUAS 3 TENTATIVAS:**
Meta alta + expectativa irreal + ambiente errado = desistência + culpa.

**PLANO 30 DIAS:**
- Dia 1-7: calce tênis e saia. 5 min.
- Dia 8-14: caminhe 10 min.
- Dia 15-21: 15 min.
- Dia 22-30: 20 min.
20 dias de 30 = hábito formado. Motivação aparece DEPOIS.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Regra dos 2 minutos me salvou. Nos piores dias faço 10 agachamentos e 10 flexões. 90 segundos. Metade das vezes continuo e faço o treino todo. Em 6 meses não perdi nenhum dia.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `"Calce o tênis" parece piada mas funciona ABSURDAMENTE. Comecei há 4 meses e hoje corro 5km 3x/semana. Tudo começou com colocar o tênis e sair.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 6: Exercício acima de 100kg
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_004',
    content: `⚖️ EXERCÍCIOS SEGUROS ACIMA DE 100KG

Tenho 120kg e 1,75m. Quero me exercitar mas tenho medo de machucar joelhos e coluna. Corrida nem pensar. O que é seguro? Sinto vergonha de academia também.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `Preocupação com articulações é inteligente. Com 120kg, evitar alto impacto no início é correto.

**TIER 1 — Melhor segurança/resultado:**

**Exercícios aquáticos (OURO):** Hidroginástica, natação, caminhada na piscina. Água reduz peso aparente em 80-90%. Zero impacto. 45 min = 300-500 kcal.

**Bicicleta ergométrica:** Peso no banco, não nas articulações. Pode ser em casa (usada R$200-400).

**TIER 2 — Com adaptação:**

**Caminhada:** terreno plano, tênis com amortecimento, começar 10-15 min. Se doer joelho → trocar por bicicleta.

**Musculação com máquinas:** guiam movimento, menos risco. Leg press, cadeira extensora, pulley.

**Elíptico:** sem impacto, corpo todo.

**EVITAR NO INÍCIO:**
❌ Corrida (impacto = 3-4x peso = 360-480kg no joelho por passada)
❌ Pular corda
❌ Esportes com mudança brusca de direção

**VERGONHA — opções:**
- Horários vazios (6h ou 14-16h)
- Treino em casa: bicicleta + exercícios no chão
- Piscina: todo mundo é "igual" na água

**DADO MOTIVACIONAL:** Cada kg perdido = 4kg menos de pressão nos joelhos. Aos 110kg, joelhos sentem como 40kg menos de pressão.

Tem acesso a piscina ou bicicleta?`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_018',
    content: `Comecei com 130kg e fui direto pra hidroginástica. Na água sou "leve", sem dor, sem vergonha. Perdi 25kg em 1 ano. Hoje faço natação + musculação com 105kg. Joelhos perfeitos.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: `O dado de 4kg de pressão por kg perdido me motivou. Vou procurar piscina perto de casa. Obrigado por não julgar.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 7: Exercício e saúde mental
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_003',
    content: `🧠 EXERCÍCIO PRA ANSIEDADE E DEPRESSÃO — FUNCIONA?

Meu psiquiatra sugeriu exercício como parte do tratamento. Estou medicada. É real ou papo motivacional? Qual tipo funciona melhor pra saúde mental?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `Seu psiquiatra está absolutamente correto. Evidência ROBUSTA:

**META-ANÁLISE 2023 (BMJ, 14.000+ participantes):**
- Exercício = efeito EQUIVALENTE a antidepressivos em depressão leve/moderada
- Ansiedade: redução de 26%
- Efeito em 2-4 semanas

**IMPORTANTE:** NÃO substitui medicação em casos moderados/graves. COMPLEMENTA.

**MECANISMOS:**
1. Endorfinas + endocanabinóides = bem-estar
2. BDNF = crescimento neuronal no hipocampo
3. Cortisol reduz 20-30%
4. Serotonina/dopamina regulados
5. Sono melhora
6. Autoeficácia = sensação de conquista

**PARA ANSIEDADE:**
Atividades rítmicas: caminhada, natação, bicicleta. Yoga. Exercício ao ar livre. Intensidade moderada.

**PARA DEPRESSÃO:**
Exercícios em grupo. Musculação (progressão visível). Corrida (runner's high é real).

**PLANO:**
- Caminhada ao ar livre 20-30 min, 4x/semana (manhã se possível)
- Yoga 1-2x/semana opcional

**DICA:** Nos dias que a ansiedade está alta e você MENOS quer se exercitar, são os dias que MAIS ajuda. 10 min de caminhada = ansiedade reduz em 15-20 min. É química.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Comecei a correr por recomendação da psicóloga há 1 ano. Tão importante quanto a medicação. Nos dias que corro, ansiedade é 50% menor o dia todo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: `Yoga mudou minha relação com ansiedade. A respiração que aprendo aplico no dia a dia em crises. 8 meses e já reduzi dose do ansiolítico (com autorização médica).`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 8: Dança como exercício
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_renata2',
    content: `💃 DANÇA COMO EXERCÍCIO: FUNCIONA PRA EMAGRECER?

Professora de zumba aqui. Muita aluna pergunta se dança "conta" como exercício. Posso dizer: CONTA. Mas pra quem quer emagrecer, zumba 3x basta?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_exercicio',
    content: `Dança conta e tem MAIOR taxa de aderência (pessoas continuam fazendo). Isso importa mais que eficiência teórica.

**GASTO CALÓRICO (60 min, mulher 65kg):**
- Zumba: 350-500 kcal
- Corrida 8km/h: 450-550 kcal
- Musculação: 200-350 kcal
- Caminhada: 250-300 kcal

**Zumba está no TOP 3.**

**ZUMBA 3X BASTA PRA EMAGRECER?**
3 aulas de 50 min = ~1.200-1.500 kcal/semana. Para 0.5kg/semana = déficit de 3.500 kcal. Zumba contribui com 35-40%. Restante = alimentação.

**Zumba 3x + alimentação ajustada = SIM, funciona.**

**BENEFÍCIOS EXTRAS:** Coordenação, saúde cognitiva (coreografias = plasticidade neural), aspecto social, flexibilidade.

**O QUE DANÇA NÃO FAZ BEM:** Força muscular significativa, hipertrofia, proteção óssea forte.

**IDEAL:**
- Dança 3x/semana (cardio + prazer)
- Força 2x/semana (músculos + ossos)

**DICA:** Inclua 10 min de circuito de força no final das aulas (agachamento, flexão, prancha). Faz diferença enorme pras alunas.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_020',
    content: `Perdi 14kg com zumba 4x/semana + dieta. Nunca pisei na academia. Dança é o único exercício que me faz QUERER ir. Esse é o segredo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_renata2',
    content: `Adorei a sugestão de força no final da aula! Vou implementar. Muitas alunas perguntam sobre musculação mas não querem academia.`,
    isAIResponse: false,
  },
];

// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log('🏟️  SEED: EXERCÍCIO PARA QUEM ODEIA TREINAR\n');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'odeia', mode: 'insensitive' } },
          { slug: { contains: 'exercicio', mode: 'insensitive' } },
          { name: { contains: 'Odeia', mode: 'insensitive' } },
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
    const baseTime = new Date('2026-02-07T08:00:00Z');

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
