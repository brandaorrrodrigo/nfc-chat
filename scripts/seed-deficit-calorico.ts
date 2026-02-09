// ═══════════════════════════════════════════════════════════════
// SEED ARENA: DÉFICIT CALÓRICO NA VIDA REAL
// Executar: npx tsx scripts/seed-deficit-calorico.ts
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// ============================================================
// SEED: Déficit Calórico na Vida Real
// ~32 posts organizados em 8 conversas
// Foco: estratégias práticas de déficit, armadilhas comuns,
// adaptação metabólica, fome, aderência, refeeds, diet breaks
// ============================================================

const POSTS = [
  // ── CONVERSA 1: Déficit agressivo vs moderado ──────────────
  {
    userId: 'user_sim_004',
    content: `Pessoal, sempre que tento emagrecer eu vou pro déficit de 1000kcal de uma vez. Nas primeiras 2 semanas perco uns 3kg, mas na terceira semana já tô com compulsão, irritado, dormindo mal. Aí desisto e recupero tudo.

Isso acontece com mais alguém? Qual déficit vocês usam na prática?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Carlos, esse padrão que você descreve é **extremamente comum** e tem explicação fisiológica clara.

**Por que déficits agressivos sabotam:**
- Déficits acima de **25-30% do TDEE** aumentam significativamente os níveis de **grelina** (hormônio da fome) e reduzem **leptina** (saciedade)
- A queda rápida de leptina sinaliza ao hipotálamo que há "escassez", ativando mecanismos de conservação energética
- O cortisol sobe, prejudicando sono e humor — exatamente o que você relatou
- Após 2-3 semanas nesse regime, a compulsão não é "falta de disciplina", é **resposta neuroendócrina**

**O que a literatura recomenda na prática:**
- **Déficit moderado:** 300-500kcal/dia (15-25% do TDEE)
- Perda esperada: **0,5-1% do peso corporal por semana**
- Preservação muscular muito superior
- Aderência de longo prazo incomparavelmente melhor

**Exemplo prático:**
Se seu TDEE é 2.500kcal → déficit de 400kcal → consumo de 2.100kcal/dia → perda de ~0,4kg/semana → **~1,6kg/mês de forma sustentável**

Parece "pouco"? Em 6 meses são quase 10kg — e sem o efeito sanfona. O déficit agressivo que "funciona rápido" quase sempre resulta em recuperação total + perda de massa magra.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `Cara, eu passei EXATAMENTE por isso. Fazia aqueles déficits malucos de 1200kcal sendo que meu gasto era uns 2800. Resultado: perdi 8kg em 2 meses, recuperei 10 em 3.

Agora tô fazendo déficit de 350kcal, perco devagar mas tô no quinto mês consecutivo sem desistir. Já foram 9kg e tô mantendo toda a força no treino.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `Bruno, seu relato é a prova viva do que funciona. Eu também aprendi na marra — agora penso em "qual déficit eu consigo manter por 6 meses?" em vez de "qual déficit me faz perder mais rápido?". Mudou tudo.`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Como calcular TDEE de verdade ─────────────
  {
    userId: 'user_sim_002',
    content: `Gente, usei 3 calculadoras online de TDEE e cada uma deu um valor diferente — 1.800, 2.100 e 2.300. 😅 Qual eu sigo? Tenho 28 anos, 68kg, 1,65m, treino musculação 4x/semana e trabalho sentada.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Juliana, essa variação entre calculadoras é normal porque cada uma usa fórmulas diferentes (Harris-Benedict, Mifflin-St Jeor, Katch-McArdle). Nenhuma é 100% precisa — são **estimativas iniciais**.

**O método mais confiável na prática:**

**1. Estimativa inicial (ponto de partida):**
- Para seu perfil (mulher, 68kg, 1,65m, 28 anos, treino 4x): a Mifflin-St Jeor com fator de atividade 1,55 daria aproximadamente **2.050-2.100kcal**
- Use isso como PONTO DE PARTIDA, não como verdade absoluta

**2. Método de rastreamento real (2-3 semanas):**
- Coma **consistentemente** a quantidade estimada (~2.100kcal) por 14-21 dias
- Pese-se **diariamente** de manhã, em jejum, após ir ao banheiro
- Calcule a **média semanal** do peso (ignore variações diárias)
- Se o peso médio ficou estável → esse é seu TDEE real
- Se subiu → seu TDEE real é menor, reduza 100-150kcal
- Se desceu → seu TDEE real é maior

**3. Aplicar o déficit:**
- Com o TDEE confirmado, aplique déficit de 300-500kcal
- Continue monitorando médias semanais e ajuste a cada 3-4 semanas

**Importante:** Calculadoras online erram em média **±300kcal**. Por isso o rastreamento real é insubstituível.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Eu fiz exatamente esse processo e descobri que meu TDEE real era 200kcal MENOR do que todas as calculadoras diziam. Se não tivesse rastreado, estaria comendo na manutenção achando que estava em déficit. Super recomendo as 2-3 semanas de teste.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `Faz total sentido! Vou começar rastreando por 2 semanas em 2.100kcal e ver o que acontece com as médias. Obrigada pela explicação detalhada! 🙏`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Fome no déficit — o que é normal e o que não é ──
  {
    userId: 'user_sim_003',
    content: `Tô na terceira semana de déficit (comendo 1.650kcal, meu TDEE é ~2.000) e a fome tá INSUPORTÁVEL entre as 15h e 18h. Fico pensando em comida o tempo todo. Isso é normal ou tô fazendo algo errado?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Mariana, algum nível de fome em déficit é **fisiologicamente esperado** — afinal, você está consumindo menos do que gasta. Mas fome "insuportável" e pensamento obsessivo em comida podem indicar ajustes necessários.

**Checklist antes de aceitar a fome como "normal":**

**1. Proteína está adequada?**
- Em déficit, o mínimo recomendado é **1,6-2,2g/kg** de peso corporal
- Para 68kg → pelo menos **109-150g de proteína/dia**
- Proteína é o macro com maior poder de saciedade (efeito térmico + sinalização de CCK e PYY)

**2. Volume alimentar está suficiente?**
- Priorize alimentos de **alta densidade nutricional e baixa densidade calórica**: vegetais, folhas, frutas com casca, legumes
- 400g de brócolis = 136kcal e ocupa muito espaço gástrico
- Distensão gástrica é um dos sinais primários de saciedade

**3. Distribuição das refeições faz sentido para sua rotina?**
- Se a fome ataca às 15h-18h, talvez seu almoço esteja muito cedo ou com pouca fibra/proteína
- Considere deslocar mais calorias para esse período (lanche proteico às 15h, por exemplo)

**4. Sono e estresse sob controle?**
- Dormir menos de 7h aumenta grelina em até **28%** e reduz leptina em até **18%**
- Cortisol elevado cronicamente amplifica fome hedônica (vontade de comfort food)

**5. Água e hidratação:**
- Desidratação leve é frequentemente confundida com fome
- 500ml de água 20-30 min antes das refeições reduz ingestão calórica em **~75-90kcal** por refeição

Se após ajustar esses pontos a fome continuar desproporcional, pode ser que o déficit de 350kcal esteja alto **para o seu momento** — reduzir para 200-250kcal temporariamente é válido.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Acabei de calcular minha proteína e tô comendo só 80g/dia 😳 E meu almoço é às 11h30, fico sem comer nada até as 19h. Acho que achei o problema! Vou subir a proteína e colocar um lanche às 15h.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: `Mariana, quando eu ajustei minha proteína de 70g para 130g no déficit, a diferença foi absurda. A fome diminuiu uns 60% facilmente. E comer ovo cozido ou iogurte grego às 15h virou meu salva-vidas.`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Platô de perda de peso ────────────────────
  {
    userId: 'user_sim_010',
    content: `Tô em déficit há 3 meses, perdi 6kg nos primeiros 2 meses e agora faz 4 semanas que a balança NÃO SE MOVE. Continuo comendo as mesmas 1.900kcal. Meu metabolismo "adaptou"? Preciso cortar mais calorias?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Thiago, antes de cortar calorias, precisamos entender o que pode estar acontecendo. **Platôs após 8-12 semanas de déficit são extremamente comuns** e nem sempre significam que você precisa comer menos.

**Possíveis causas do platô (em ordem de probabilidade):**

**1. Retenção hídrica mascarando perda de gordura**
- Cortisol elevado pelo déficit prolongado causa retenção de líquido
- O famoso "whoosh effect": o corpo retém água nas células adiposas que perderam gordura, e depois libera tudo de uma vez
- Mudanças no treino, estresse, qualidade do sono — tudo afeta retenção

**2. Seu TDEE diminuiu (e isso é normal)**
- Você perdeu 6kg → seu corpo agora gasta **menos energia** (menos massa para carregar, menor TMB)
- Estimativa: a cada 1kg perdido, o TDEE cai ~15-20kcal/dia
- 6kg perdidos = TDEE pode ter caído **~90-120kcal/dia**
- As 1.900kcal que eram déficit agora podem estar próximas da manutenção

**3. Adaptação metabólica (termogênese adaptativa)**
- Além da queda por perda de peso, o corpo pode reduzir o gasto em **mais 5-15%** como mecanismo de defesa
- Isso inclui redução de NEAT (movimento espontâneo), eficiência muscular aumentada, menor termogênese alimentar

**O que fazer ANTES de cortar calorias:**
- **Opção A — Diet break:** Coma na manutenção (~2.100-2.200kcal) por 1-2 semanas. Isso ajuda a normalizar leptina, cortisol e retenção hídrica. Depois volte ao déficit.
- **Opção B — Refeed days:** 1-2 dias por semana comendo na manutenção, priorizando carboidratos. Mantém o déficit semanal mas dá alívio hormonal.
- **Opção C — Recalcular:** Se já fez diet break e o platô persiste, reduza 100-150kcal e monitore por mais 2-3 semanas.

Com 3 meses de déficit contínuo, eu priorizaria a **Opção A** antes de qualquer corte adicional.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Nunca tinha ouvido falar de diet break. Faz sentido — tô em déficit ininterrupto há 3 meses, dormindo mal, treino caiu. Vou fazer 2 semanas na manutenção e depois volto. Valeu demais!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `Thiago, fiz meu primeiro diet break mês passado depois de 10 semanas de déficit. Resultado: voltei pro déficit e em 10 dias perdi os 1,5kg que estavam "travados". É contraintuitivo comer mais, mas funciona.`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Déficit e ciclo menstrual ─────────────────
  {
    userId: 'user_sim_007',
    content: `Meninas, na semana antes da menstruação eu simplesmente NÃO CONSIGO manter o déficit. A fome é outra coisa, retenho 2kg de água, fico inchada e desanimada. Como vocês lidam com isso?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Fernanda, o que você descreve é **100% fisiológico** e ignorar o ciclo menstrual é um dos maiores erros em protocolos de déficit para mulheres.

**O que acontece hormonalmente:**

**Fase lútea (pós-ovulação até menstruação, ~dias 15-28):**
- Progesterona sobe → aumenta temperatura corporal basal → **TMB sobe 5-10%** (~100-300kcal/dia a mais de gasto)
- Estradiol e progesterona elevados aumentam resistência à insulina → mais fome, mais desejo por carboidratos
- Retenção hídrica de **1-3kg** é completamente normal (aldosterona + progesterona)
- Serotonina cai → busca por comfort food é resposta neuroquímica, não emocional

**Estratégia prática — Déficit Cíclico:**

**Fase folicular (dias 1-14):** Déficit normal (300-500kcal abaixo do TDEE)
- Melhor tolerância ao déficit, mais energia, melhor sensibilidade à insulina
- Aproveite para fazer o "trabalho pesado" do déficit aqui

**Fase lútea (dias 15-28):** Déficit reduzido ou manutenção
- Reduza o déficit para 100-200kcal ou coma na manutenção
- Aumente carboidratos em 20-30g (ajuda na serotonina)
- O aumento do TMB compensa parcialmente as calorias extras

**O déficit semanal/mensal total fica similar**, mas a aderência melhora drasticamente.

**Sobre os 2kg de retenção:** Ignore completamente o peso na semana pré-menstrual. Compare APENAS: peso médio da semana 1 do ciclo anterior vs peso médio da semana 1 do ciclo atual. Essa é a comparação válida.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `Essa abordagem de déficit cíclico mudou minha vida! Antes eu entrava em parafuso toda fase lútea, comia demais de culpa e desistia. Agora já sei que nessa semana como na manutenção e tá tudo bem. Em 4 meses perdi 5kg sem surtar nenhuma vez.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `Que alívio saber que não é "fraqueza". Vou começar a ciclar meu déficit com o ciclo menstrual. Faz muito mais sentido do que lutar contra a biologia.`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Álcool e déficit calórico ─────────────────
  {
    userId: 'user_sim_014',
    content: `Pergunta sincera: dá pra incluir álcool no déficit calórico sem ferrar tudo? Bebo cerveja com os amigos no fim de semana, umas 3-4 latas. Não quero virar monge, mas também não quero sabotar meu progresso.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Rodrigo, pergunta honesta merece resposta honesta. **Dá pra incluir álcool? Sim. É ideal? Não.** Vamos aos fatos:

**O custo real do álcool no déficit:**
- Álcool = **7kcal/g** (quase o dobro de carboidrato/proteína)
- 1 lata de cerveja (350ml, 5%) ≈ **150kcal**
- 4 latas = **~600kcal** — isso pode ser 1/3 do seu total diário em déficit
- Álcool tem **zero valor nutricional** — não sacia, não nutre, não preserva músculo

**Efeitos além das calorias:**
- Álcool **interrompe a oxidação de gordura** enquanto está sendo metabolizado (o corpo prioriza eliminar o álcool)
- Reduz síntese proteica muscular em **até 20-30%** por 24-48h
- Piora qualidade do sono (menos sono profundo e REM)
- Desinibe controle alimentar → o perigo real não é a cerveja, é o **petisco/fast food que vem junto**

**Estratégia pragmática se vai beber:**
- Limite a **1-2 vezes no mês** em vez de todo fim de semana
- No dia que beber, reduza gordura dietética (é o macro mais fácil de cortar sem perder saciedade) para "abrir espaço" calórico
- Mantenha a proteína alta mesmo no dia do álcool
- Escolha opções menos calóricas: vinho seco (~120kcal/taça) ou destilado com água/gelo (~100kcal/dose) vs cerveja (~150kcal/lata)
- Defina um limite ANTES de sair e coma uma refeição completa com proteína + fibra antes de beber

**Perspectiva realista:** Se seu déficit semanal é de ~2.800kcal (400/dia) e você bebe 600kcal de cerveja + 400kcal de petisco todo sábado, **perdeu 1/3 do déficit da semana inteira**. É por isso que muita gente tá "em déficit" mas não emagrece.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Esse cálculo de perder 1/3 do déficit semanal com uma noite de cerveja me deu um tapa na cara. Eu bebia toda sexta E sábado, e ficava frustrado que "a dieta não funcionava". Cortei pra 2x no mês e em 2 meses perdi o que não perdia há 6.`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Comer fora em déficit ─────────────────────
  {
    userId: 'user_sim_017',
    content: `Como vocês fazem pra manter o déficit quando comem fora? Minha família almoça junto todo domingo e saio com amigas 1-2x na semana. Não quero ser a chata que leva marmita pra restaurante, mas também não quero descontar 3 dias da semana.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Renata, essa é uma das habilidades mais importantes para déficit sustentável no mundo real. Ninguém mantém déficit de longo prazo comendo 100% em casa.

**Estratégias práticas para comer fora em déficit:**

**1. Técnica do "Buffer Calórico"**
- Se sabe que vai jantar fora, reduza ~200-300kcal nas refeições anteriores (não zere — isso causa compulsão à noite)
- Priorize proteína e vegetais nas refeições do dia para "guardar" calorias de carboidrato e gordura pro jantar

**2. Leitura rápida de cardápio**
- Pratos grelhados/assados > fritos/empanados
- Peça molhos e temperos à parte
- Salada como entrada (volume gástrico antes do prato principal)
- Troque acompanhamentos calóricos: purê/batata frita → legumes grelhados/salada

**3. Técnica do prato mental**
- Monte mentalmente: **1/2 do prato em vegetais, 1/4 proteína, 1/4 carboidrato**
- Em rodízio ou buffet: primeiro passe = proteína + vegetais. Segundo passe = complementos
- Coma devagar — leva 20min para sinais de saciedade chegarem ao cérebro

**4. Frequência importa mais que perfeição**
- 3 dias/semana fora é significativo — não dá pra ignorar
- Mas NÃO precisa ser perfeito em cada refeição
- Objetivo: fazer escolhas **10-20% melhores**, não perfeitas

**5. No almoço de domingo em família:**
- Sirva-se com porções moderadas (use prato menor se possível)
- Coma bastante salada/legumes primeiro
- Se tiver sobremesa, coma uma porção pequena e aproveite sem culpa — restringir 100% gera compensação depois

**Mentalidade chave:** Comer fora em déficit não é sobre "resistir a tudo". É sobre **reduzir o excesso médio** ao longo da semana.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: `A técnica do buffer calórico me salvou! Nos dias que sei que vou jantar fora, faço café da manhã e almoço mais leves (mas com bastante proteína). Chego no jantar com "espaço" calórico e consigo aproveitar sem culpa. Já são 4 meses em déficit com vida social normal.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: `Adorei a ideia de "fazer escolhas 10-20% melhores" em vez de buscar perfeição. Acho que meu erro era justamente o pensamento de tudo ou nada — ou comia perfeitamente ou desistia de contar. Vou aplicar essas estratégias!`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Quando parar o déficit ────────────────────
  {
    userId: 'user_sim_018',
    content: `Tô em déficit há 5 meses, perdi 11kg (saí de 92 pra 81kg, 1,78m, homem, 35 anos). Meu objetivo era 78kg mas tô muito cansado, treino caiu bastante e tô irritado com tudo. Devo insistir até 78kg ou parar?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Marcelo, o que você descreve são **sinais claros de que seu corpo precisa de uma pausa**, independente de faltar 3kg pro objetivo.

**Sinais de que é hora de parar/pausar o déficit:**
- Queda significativa de performance no treino ✅ (você reportou)
- Irritabilidade e alteração de humor persistentes ✅
- Fadiga desproporcional ao nível de atividade ✅
- Libido reduzida
- Sono prejudicado
- Pensamento obsessivo em comida
- Déficit prolongado (>16-20 semanas sem pausa)

Você tem pelo menos 3 desses sinais após 5 meses contínuos. Isso é seu corpo sinalizando que a **adaptação metabólica está significativa** e que continuar forçando vai gerar mais prejuízo do que benefício.

**Recomendação: Reverse Diet → Manutenção → Novo ciclo**

**Fase 1 — Reverse diet (3-4 semanas):**
- Aumente calorias gradualmente: +100-150kcal/semana
- Priorize o aumento em carboidratos (recupera glicogênio, performance e humor)
- Objetivo: chegar à manutenção (~2.400-2.500kcal para seu perfil atual) sem ganho excessivo

**Fase 2 — Manutenção (6-8 semanas MÍNIMO):**
- Coma na manutenção, foque em treino pesado e recuperação
- Leptina, testosterona, cortisol e hormônios tireoidianos se normalizam
- Espere ganhar 1-2kg de água/glicogênio — **isso NÃO é gordura**

**Fase 3 — Novo mini-cut (se ainda quiser):**
- Depois de 6-8 semanas estabilizado, faça um cut de 6-8 semanas para os 78kg
- Com metabolismo recuperado, a perda será mais eficiente e menos sofrida

**Perspectiva:** Você perdeu 11kg em 5 meses — isso é um resultado excelente. Os últimos 3kg vão continuar lá quando você voltar, mas com metabolismo e hormônios recuperados, vai ser muito mais fácil.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_015',
    content: `Marcelo, fiz exatamente esse erro de "insistir nos últimos quilos". Resultado: perdi os 3kg mas junto foi embora toda minha massa muscular e fiquei com uma relação péssima com comida. Se pudesse voltar no tempo, teria feito exatamente o que a IA sugeriu — pausar, manter, e voltar depois.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_018',
    content: `Valeu pessoal. Difícil aceitar psicologicamente "parar perto da meta" mas faz total sentido. Vou começar o reverse diet essa semana. Melhor chegar nos 78kg em 3 meses com saúde do que forçar agora e me destruir.`,
    isAIResponse: false,
  },
];

// ============================================================
async function main() {
  console.log('🏟️  SEED: DÉFICIT CALÓRICO NA VIDA REAL\n');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'deficit', mode: 'insensitive' } },
          { slug: { contains: 'calorico', mode: 'insensitive' } },
          { name: { contains: 'Déficit', mode: 'insensitive' } },
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
    const baseTime = new Date('2026-02-06T08:30:00Z');

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
