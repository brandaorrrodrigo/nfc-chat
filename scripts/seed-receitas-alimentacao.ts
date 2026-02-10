import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ SEED: Arena Receitas & Alimentação\n');

  let arena = await prisma.arena.findFirst({
    where: { OR: [{ slug: 'receitas-alimentacao' }, { name: { contains: 'Receitas' } }] }
  });

  if (!arena) {
    arena = await prisma.arena.create({
      data: {
        slug: 'receitas-alimentacao',
        name: '🍽️ Receitas & Alimentação',
        description: 'Receitas práticas, nutritivas e deliciosas para seus objetivos. Dicas de preparo, macros, substituições, comida de verdade que funciona.',
        icon: '🍽️',
        color: '#F97316',
        category: 'RECEITAS_ALIMENTACAO',
        isActive: true,
        aiPersona: 'SUSTAINING',
        categoria: 'RECEITAS_ALIMENTACAO'
      }
    });
  }

  const ARENA_ID = arena.id;
  console.log('✅ Arena:', arena.name);

  const deletedPosts = await prisma.post.deleteMany({ where: { arenaId: ARENA_ID } });
  console.log(`🗑️ ${deletedPosts.count} posts apagados`);

  const userNames = [
    { id: 'user_rec_001', name: 'Chef Nutricionista', email: 'chef.nutri@example.com' },
    { id: 'user_rec_002', name: 'Cozinheira Fit', email: 'cozinheira.fit@example.com' },
    { id: 'user_rec_003', name: 'Receita Simples', email: 'receita.simples@example.com' },
    { id: 'user_rec_004', name: 'Mãe do Meal Prep', email: 'maealmealprep@example.com' },
    { id: 'user_rec_005', name: 'Protéína Clara', email: 'proteina.clara@example.com' },
    { id: 'user_rec_006', name: 'Dica de Cozinha', email: 'dica.cozinha@example.com' },
    { id: 'user_rec_007', name: 'Sabor Saudável', email: 'sabor.saudavel@example.com' },
  ];

  const userIds: Record<string, string> = {};
  for (const userData of userNames) {
    let user = await prisma.user.findUnique({ where: { email: userData.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { id: userData.id, email: userData.email, name: userData.name, password: 'hashed' }
      });
    }
    userIds[userData.id] = user.id;
  }

  let aiUser = await prisma.user.findUnique({ where: { email: 'ia-receitas@example.com' } });
  if (!aiUser) {
    aiUser = await prisma.user.create({
      data: { email: 'ia-receitas@example.com', name: 'IA — Receitas & Alimentação', password: 'hashed' }
    });
  }

  let baseTime = new Date('2026-02-05T11:00:00Z');
  const nextTime = () => {
    baseTime = new Date(baseTime.getTime() + (35 + Math.floor(Math.random() * 75)) * 60000);
    return new Date(baseTime);
  };

  const posts = [
    // THREAD 1: Frango e arroz
    {
      content: 'Frango e arroz fica maçante — como variar SEM sair da dieta?',
      userId: userIds['user_rec_001'],
      isAIResponse: false
    },
    {
      content: 'Todos nós conhecemos a receita "frango e arroz". É barato, efetivo, mas psicologicamente morre. Como variar mantendo macros e sem ficar muito caro? Buscosuggestões de marinadas, temperos, acompanhamentos que "troquem" o sabor.',
      userId: userIds['user_rec_001'],
      isAIResponse: false
    },
    {
      content: `Ótima pergunta. Vou dar 5 variações que mantêm macros mas mudam 100% o sabor:

**OPÇÃO 1: Frango Teriyaki + Arroz Integral**
- 200g peito frango (marinado 30min em tamari + gengibre + alho)
- Acebolado com brócolis
- Arroz integral (ou sushi rice para variar)
- Macros: P 35g, C 45g, F 3g

**OPÇÃO 2: Frango Grego + Arroz**
- 200g frango marinado: azeite + sumo limão + oregão
- Acompanhamento: tomate cherry, cebola roxa, azeitona
- Arroz branco normal
- Macros: P 35g, C 45g, F 5g

**OPÇÃO 3: Frango Tandoori + Arroz**
- Marinada: iogurte + tandoori spice (cúrcuma, cominho, páprica)
- Assado 25min
- Arroz com caldo de legumes (combina bem)
- Macros: P 35g, C 45g, F 2g

**OPÇÃO 4: Frango Teriyaki Light vs Pesado**
- Light: só tamari, gengibre, mirin (açúcar), alho
- Pesado: idem + gergelim + brócolis refogado
- Arroz jasmine (quebra monotonia)
- Macros: P 35g, C 45g, F 1-3g (depende do modo)

**OPÇÃO 5: Frango à Milanesa + Arroz**
- Frango com farinha de aveia/panko
- Frito rápido ou assado
- Acompanhamento: salada com vinagre
- Arroz com ervas
- Macros: P 35g, C 45g, F 5g

**HACK: Marinadas (0 caloria adicional):**
- Tamari + gengibre + alho (asiático)
- Limão + oregão + alho (grego)
- Iogurte + especiarias (indiano)
- Vinagre balsâmico + mel (italiano)

**HACK: Arroz (sem trocar macros):**
- Caldo de legumes em vez de água (+sabor)
- Arroz integral (mesmos macros, +fibra)
- Jasmine rice (mais saboroso que branco)
- Arroz selvagem (exótico, mesmo carbo)

**Sugestão prática:**
Escolha 1 marinada para segunda, 1 para quarta, 1 para sábado. Rotaciona para não ficar maçante. Investimento inicial mínimo em temperos.

Qual é seu orçamento/tempo de preparo?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Adorei! Vou testar a marinada tandoori essa semana. Que molho combina bem? Ou como servir?',
      userId: userIds['user_rec_001'],
      isAIResponse: false
    },
    {
      content: `Tandoori combina com raita (iogurte + pepino + hortelã) MAS cuidado com macros (iogurte tem 5g carbo por colher). Opção light: iogurte natural 0% (10g tem <1g carbo) + pepino + limão.`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Vou fazer raita light mesmo. Tandoori fica perfeito com iogurte! Obrigada!',
      userId: userIds['user_rec_002'],
      isAIResponse: false
    },

    // THREAD 2: Café da manhã proteico
    {
      content: 'Café da manhã proteico sem ovo — alternativas?',
      userId: userIds['user_rec_003'],
      isAIResponse: false
    },
    {
      content: 'Tenho alergia a ovo (ou cansada de ovo todo dia). Preciso de café da manhã com 30-40g proteína, relativamente rápido para sair de casa. O que vocês fazem?',
      userId: userIds['user_rec_003'],
      isAIResponse: false
    },
    {
      content: `5 opções que sou muito comum:

**OPÇÃO 1: Iogurte Grego + Granola + Frutas (8min)**
- 200g iogurte grego 0% (20g proteína)
- 30g granola (5g proteína + carbo)
- Morango (carbo)
- Total: P 25g, C 40g, F 2g

**OPÇÃO 2: Cottage Cheese (5min)**
- 200g cottage cheese (28g proteína)
- Mel + canela
- Pão integral (carbo)
- Total: P 28g, C 35g, F 2g

**OPÇÃO 3: Whey + Aveia (5min)**
- 1 scoop whey (25g)
- 50g aveia cozida (5g)
- Leite de amêndoa
- Total: P 30g, C 40g, F 3g

**OPÇÃO 4: Frango + Pão Integral (7min)**
- Peito frango 150g pré-cozido (35g proteína)
- Pão integral 2 fatias (carbo)
- Manteiga de amendoim 1 col (gordura)
- Total: P 35g, C 40g, F 5g

**OPÇÃO 5: Cheesecake Proteico (5min prep, congela)**
- 150g ricota (14g)
- 1 scoop whey (25g)
- Mel + calda
- Total: P 39g, C 25g, F 2g (quando pronto, só descongelar)

**MEU FAVORITO (barato + fácil):**
- Leite quente + aveia + mel (5 min)
- Whey na aveia (30g proteína)
- Total: P 30-35g, carbo ok, super barato

Qual você mais curte?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Cottage cheese com granola! Só não sabia que era tão proteico. Vou começar amanhã!',
      userId: userIds['user_rec_003'],
      isAIResponse: false
    },
    {
      content: 'Cottage puro fica sem sabor. Dica: mistura com mel + granola + banana = fica tipo tigela de açai mas 10x mais proteína.',
      userId: userIds['user_rec_004'],
      isAIResponse: false
    },

    // THREAD 3: Meal prep
    {
      content: 'Meal prep para a semana — container, congelamento, segurança?',
      userId: userIds['user_rec_004'],
      isAIResponse: false
    },
    {
      content: 'Quero começar a fazer meal prep domingo para segunda-sexta. Mas tenho dúvidas: quanto tempo dura no geladeira? Congela? Qual container? Como descongelar sem ficar ruim?',
      userId: userIds['user_rec_004'],
      isAIResponse: false
    },
    {
      content: `Ótimo! Meal prep bem feito economiza tempo, dinheiro e mantém consistência. Aqui está o protocolo:

**DURAÇÃO / ARMAZENAMENTO:**

| Alimento | Geladeira | Congelador | Método |
|----------|-----------|-----------|--------|
| Frango cozido | 3-4 dias | 3 meses | Airtight container |
| Arroz cozido | 4-5 dias | 1-2 meses | Separado (fica seco) |
| Brócolis cozido | 3-4 dias | 3 meses | Airtight |
| Abóbora/batata | 4-5 dias | 2-3 meses | Airtight |
| Molho | 5-7 dias | 2 meses | Frasco vidro |

**REGRA GERAL:** Se foi armazenado <4h pós-cozimento E em container hermético: 3-5 dias geladeira.

**CONGELAMENTO (recomendo):**
1. Cozinha domingo
2. Esfria completamente (IMPORTANTE)
3. Coloca em container ou ziplock
4. Congela imediatamente
5. Segunda a sexta: retira container de manhã (descongelamento geladeira)
6. Aquece 2-3 min microondas no trabalho

**SEGURANÇA:**
- Nunca descongelar em temperatura ambiente (risco botulismo)
- Descongelar em geladeira (8-12h) ou microondas
- Se cozido + congelado correto: SEGURO até 2-3 meses

**CONTAINERS RECOMENDADOS:**
- Pyrex glass (melhor, vidro não lixivia)
- BPA-free plastic (Rubbermaid, Tupperware)
- Ziplock congelador (barato, descartável)

**PROTOCOLO IDEAL (para 5 refeições):**

Domingo 2h:
1. Cozinha 1kg frango peito (15 min)
2. Cozinha 2 xícaras arroz (20 min)
3. Cozinha brócolis/abóbora (15 min)
4. Divide em 5 containers: frango (200g) + arroz (150g) + verde (100g)
5. Molho em frasco separado
6. Congela tudo

Segunda-Sexta:
- Retira container de manhã
- Aquece 3 min microondas no trabalho
- Sem sal até na hora de comer (mantém sabor)

**DICA PRO:** Molho SEPARADO dos containers. Carbo + proteína congela bem, mas molho fica líquido estranho quando descongelado. Tempera na hora.

**VARIAÇÃO:** Se não quer congelar, só geladeira = máximo 4 refeições (segunda-quinta). Sexta cozinha novamente.

Qual é seu sistema preferido?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Excelente protocolo! Vou usar vidro Pyrex, congela, e molho separado. Vira game changer na minha semana.',
      userId: userIds['user_rec_004'],
      isAIResponse: false
    },
    {
      content: 'Faço isso há 1 ano, melhore meu treino porque paro de comer besteira no trabalho. Consistência de dieta é chave.',
      userId: userIds['user_rec_005'],
      isAIResponse: false
    },

    // THREAD 4: Substituições de ingredientes
    {
      content: 'Alergia/intolerância — substituições de ingredientes mantendo macros?',
      userId: userIds['user_rec_005'],
      isAIResponse: false
    },
    {
      content: 'Sou intolerante a lactose, alergia a amendoim. Muitas receitas usam esses. Como substitui sem ficar desnutrido ou muito caro?',
      userId: userIds['user_rec_005'],
      isAIResponse: false
    },
    {
      content: `Intolerância a lactose + alergia a amendoim é combinação comum. Aqui estão substituições 1:1:

**LACTOSE:**

| Original | Substitui | Macros | Custo |
|----------|-----------|--------|-------|
| 200g iogurte grego | 150g cottage + 50ml água | Proteína idêntica | +$0 |
| Leite integral | Leite de aveia (não de amêndoa) | Carbo idêntico | =$$ |
| Queijo | Tofu firme marinado | Proteína ok, menos cálcio | =$$ |
| Manteiga | Óleo de coco/azeite | Gordura ok, sem caseinato | =$$ |

**AMENDOIM:**

| Original | Substitui | Macros | Custo |
|----------|-----------|--------|-------|
| Manteiga amendoim | Tahine (gergelim) | Gordura + proteína OK | +$1 |
| Amendoim torrado | Sementes girassol | Proteína, gordura OK | =$$ |
| Óleo amendoim | Óleo soja/canola | Gordura OK | =-$ |

**PROTEÍNA (sem lactose):**
- Whey isolado (sem lactose, maior custo)
- Proteína vegana (arroz + ervilha blend)
- Clara de ovo (sempre uma opção)
- Carne vermelha/frango (0 lactose)

**MEU PROTOCOLO PARA VOCÊ:**

**Café da manhã:**
- Aveia + leite de aveia + whey isolado + mel (30g proteína, sem lactose/amendoim)

**Almoço:**
- Arroz + frango + brócolis + azeite (sem nada problemático)

**Lanche:**
- Maçã + manteiga tahine (250cal, 8g gordura, sem alergia)

**Jantar:**
- Batata doce + filé + salada (completo, sem problema)

**Custo mensal:**
- Sem substituições: ~R$250
- Com substituições: ~R$280 (diferença mínima)

**Dica importante:**
Cheque labels de "sem glúten" / "sem lactose" — frequentemente usam amendoim como espessante. Leia TUDO.

Qual é seu orçamento mensal com comida?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Adorei o protocolo! Vou usar leite de aveia, tahine no lugar de amendoim, e whey isolado. Muito melhor que achava!',
      userId: userIds['user_rec_005'],
      isAIResponse: false
    },

    // THREAD 5: Comidas assadas
    {
      content: 'Receitas assadas — tempo, temperatura, como não resseca?',
      userId: userIds['user_rec_006'],
      isAIResponse: false
    },
    {
      content: 'Quando assos frango, carne, sempre fica ressecado. Qual é o segredo? Temperatura exata? Tempo? Cobertura? Como fica suculento?',
      userId: userIds['user_rec_006'],
      isAIResponse: false
    },
    {
      content: `Ressecamento é por SUPERAQUECIMENTO. Aqui está o protocolo profissional:

**FRANGO (peito):**
- Temperatura: 190°C (não 200+)
- Tempo: 20-22 min (depende espessura)
- Verificação: termômetro de carne 75°C interno
- Segredo: REPOUSO 5 min antes de cortar (retém suco)

Técnica:
1. Temperada
2. Pincela com azeite
3. Assa 20 min em 190°C
4. Retira do forno
5. Espera 5 min COBERTA COM PAPEL ALUMÍNIO
6. Corta e serve

**CARNE VERMELHA (contra filé):**
- Temperatura: 180°C
- Tempo: 12-15 min (raro-médio)
- Termômetro: 60°C (raro), 65°C (médio)
- Segredo: REPOUSO 10 min

**ABÓBORA/BATATA:**
- Temperatura: 200°C
- Tempo: 25-30 min
- Segredo: Corta em tamanho uniforme

**DICAS PRO:**

1. **Marinada (antes):** Azeite + ácido (limão/vinagre) = retém umidade
2. **Cobertura:** Papel alumínio primeiros 15 min, depois descobre = dourado + úmido
3. **Umidade adicional:** Coloca um bowl com água no forno = vapor, mantém suco
4. **Termômetro é KING:** Acho (65°C para frango, 60°C para carne rara)

**RECEITA PADRÃO (peito frango):**

Ingredientes:
- 200g peito frango
- 1 col azeite
- Sumo 1/2 limão
- Sal, pimenta, alho

Preparo:
1. Mistura azeite + limão + sal + alho
2. Pincela frango
3. Assa 20 min em 190°C (coberto até min 15)
4. Verifica interno = 75°C
5. Repousa 5 min
6. Serve

Resultado: Macio, suculento, 35g proteína.

Qual tipo de carne você mais assa?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Frango é meu pão de cada dia. Vou testar essa técnica de repouso + temperatura 190°C. Aposto que muda!',
      userId: userIds['user_rec_006'],
      isAIResponse: false
    },
    {
      content: 'Termômetro de carne é investimento que volta RÁPIDO. Nunca mais assa coisa ressecada. Vale muito a pena.',
      userId: userIds['user_rec_007'],
      isAIResponse: false
    },
  ];

  console.log(`\n📝 Criando ${posts.length} posts...`);
  for (const post of posts) {
    await prisma.post.create({
      data: {
        arenaId: ARENA_ID,
        userId: post.userId,
        content: post.content,
        isPublished: true,
        isApproved: true,
        isAIResponse: post.isAIResponse,
        viewCount: Math.floor(Math.random() * 90),
        likeCount: Math.floor(Math.random() * 45),
        createdAt: nextTime()
      }
    });
  }

  const totalPosts = await prisma.post.count({ where: { arenaId: ARENA_ID } });
  const uniqueUsers = await prisma.post.findMany({
    where: { arenaId: ARENA_ID, isAIResponse: false },
    select: { userId: true },
    distinct: ['userId']
  });

  await prisma.arena.update({
    where: { id: ARENA_ID },
    data: { totalPosts, dailyActiveUsers: uniqueUsers.length, status: 'WARM' }
  });

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED COMPLETO — Receitas & Alimentação');
  console.log('═'.repeat(60));
  console.log(`📊 Posts: ${totalPosts} | Usuários: ${uniqueUsers.length}`);
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
