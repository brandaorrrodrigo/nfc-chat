const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(
  'https://qducbqhuwqdyqioqevle.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE'
);

// ═══════════════════════════════════════════════════════════════
// POSTS COMPLETOS — ARENA: RECEITAS SAUDÁVEIS
// ═══════════════════════════════════════════════════════════════
//
// Estrutura: cada post vai direto na Arena (sem tabela Thread)
// Posts sequenciais formam conversas naturais
// isAIResponse = true para respostas da IA
//
// ═══════════════════════════════════════════════════════════════

const POSTS = [

  // ─────────────────────────────────────────────────────────
  // CONVERSA 1: Café da manhã proteico rápido
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_005',
    content: `☕ CAFÉ DA MANHÃ PROTEICO E RÁPIDO PRA QUEM TREINA CEDO

Treino às 6h da manhã e não consigo comer nada elaborado antes. Preciso de opções de café da manhã com bastante proteína, que sejam rápidas de fazer (máximo 10 minutos) e que sustentem até o almoço. Atualmente como só uma banana e já chego no treino sem energia. Alguma sugestão?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `Ótima pergunta! A banana sozinha não fornece proteína suficiente e a energia acaba rápido. Aqui vão 5 opções testadas, todas com menos de 10 minutos:

**1. Overnight Oats Proteico (prepara na noite anterior — 0 min de manhã):**
- 40g aveia + 1 scoop whey + 200ml leite + 1 colher de pasta de amendoim
- Mistura tudo no pote, geladeira durante a noite
- Macros: ~420 kcal | 35g proteína | 40g carbs | 14g gordura

**2. Wrap de Ovo Express (5 min):**
- 1 tortilha integral + 2 ovos mexidos + 1 fatia muçarela + tomate
- Macros: ~350 kcal | 24g proteína | 28g carbs | 16g gordura

**3. Shake Pré-Treino Completo (3 min):**
- 1 scoop whey + 1 banana + 1 col sopa pasta de amendoim + 250ml leite + gelo
- Macros: ~450 kcal | 38g proteína | 35g carbs | 18g gordura

**4. Iogurte Grego Turbinado (2 min):**
- 170g iogurte grego natural + 30g granola + 1 scoop whey
- Macros: ~380 kcal | 40g proteína | 30g carbs | 8g gordura

**5. Panqueca de Microondas (4 min):**
- 1 banana amassada + 2 ovos + 1 scoop whey + canela
- Caneca untada, microondas 2-3 min
- Macros: ~350 kcal | 32g proteína | 28g carbs | 10g gordura

Para treino às 6h, comer 30-40 min antes. Se estômago não aceita sólidos, o shake é a melhor opção.

Qual combina mais com sua rotina?`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `O overnight oats é genial! Preparo 3 potes no domingo e já tenho pra segunda, terça e quarta. Zero trabalho de manhã. Coloco whey de chocolate e fica uma delícia.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `A panqueca de microondas salvou minha vida. Faço em 4 minutos literalmente. Dica: coloca um fio de mel por cima e fica show. Sustenta até o almoço tranquilo.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 2: Marmita fit semanal
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_004',
    content: `🥗 MARMITA FIT SEMANAL SEM ENJOAR

Toda semana faço frango com batata doce e brócolis. Estou MORRENDO de enjoo. Preciso de ideias de marmita que sejam saudáveis, com boa proteína, mas que variem sabor. Preparo tudo no domingo. Orçamento limitado. Alguém tem um esquema bom?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `O "frango + batata doce + brócolis" é o clássico que todo mundo enjoa! O segredo é usar o mesmo método (meal prep dominical) mas variar proteínas, temperos e acompanhamentos.

**MÉTODO: COZINHE 3 PROTEÍNAS + 3 CARBOS + 3 VEGETAIS**

**Proteínas (escolha 3/semana, ~1.5kg cada):**
Frango (coxa desossada — mais saborosa que peito), carne moída, ovos cozidos, atum, tilápia

**Carbos (escolha 3):**
Arroz integral, batata inglesa, macarrão integral, mandioca, inhame

**Vegetais (escolha 3-4):**
Abobrinha, cenoura + vagem, couve, berinjela, repolho roxo

**EXEMPLO SEMANA:**
- **Seg:** Coxa de frango ao molho de tomate + arroz + abobrinha grelhada
- **Ter:** Carne moída com legumes + purê de batata
- **Qua:** Omelete de forno + macarrão integral ao alho
- **Qui:** Frango desfiado com requeijão + arroz + couve
- **Sex:** Tilápia assada + mandioca + salada de repolho roxo

**Custo estimado (5 marmitas):** R$60-80

**Dica de ouro:** o segredo é trocar os TEMPEROS mais que os ingredientes. Mesmo frango com páprica defumada é completamente diferente de frango com limão e ervas.

Congele quarta a sexta, geladeira segunda e terça. Quer outra semana com outras combinações?`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Esse esquema de 3+3+3 é muito inteligente. Uma dica: marinada! Deixo as proteínas marinando no sábado à noite e no domingo tudo fica muito mais saboroso.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: `Vou montar esse esquema hoje! A ideia de variar tempero é genial. Semana passada fiz frango com curry e ficou incrível. Obrigado pela estrutura!`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 3: Jantar low carb
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_001',
    content: `🌙 JANTAR LOW CARB QUE MATA A FOME DE VERDADE

Comecei low carb há 2 semanas e o jantar é meu maior problema. Faço saladinha e 1 hora depois estou com fome de novo. Preciso de receitas de jantar low carb que sejam SATISFATÓRIAS, que eu durma sem fome. Pode ter gordura boa, não tenho medo.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `O problema clássico: "salada não sustenta". E não sustenta mesmo quando é só folha + tomate! O segredo do jantar low carb saciante é proteína + gordura boa + fibra vegetal densa:

**1. Frango à Parmegiana Low Carb (20 min):**
- Filés empanados com farinha de amêndoas + parmesão + orégano
- Frigideira com azeite, cobrir com molho de tomate + muçarela, gratinar
- Acompanhar com abobrinha grelhada
- Macros: ~480 kcal | 42g prot | 28g gord | 8g carbs

**2. Omelete Recheada de Forno (15 min):**
- 3 ovos + cream cheese + espinafre + tomate seco + queijo coalho
- Forma untada, forno 180°C por 12 min
- Macros: ~420 kcal | 30g prot | 32g gord | 4g carbs

**3. Salmão com Crosta de Castanhas (18 min):**
- Filé coberto com castanha triturada + alho + ervas + azeite
- Forno 200°C, 15 min. Servir com purê de couve-flor
- Macros: ~520 kcal | 38g prot | 36g gord | 6g carbs

**4. Bowl de Carne Moída Tex-Mex (15 min):**
- Carne moída com cominho + páprica, base de alface + abacate
- Cobertura: sour cream + cheddar ralado
- Macros: ~500 kcal | 35g prot | 34g gord | 8g carbs

**5. Espaguete de Abobrinha à Carbonara (12 min):**
- Abobrinha espiralizada + molho de gemas + parmesão + bacon
- Macros: ~380 kcal | 22g prot | 28g gord | 7g carbs

**Por que saciam:** proteína ativa hormônio da saciedade, gordura atrasa esvaziamento gástrico, fibra vegetal dá volume. Combinação = 4-6h sem fome.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `O bowl tex-mex virou meu jantar favorito. Faço 3x por semana e nunca enjoo. Durmo sem fome nenhuma. A combinação carne + abacate + sour cream é perfeita.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Fiz o frango à parmegiana com farinha de amêndoas e ficou crocante demais! Melhor que o original. Vou testar todas as outras.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 4: Lanches sem geladeira
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_004',
    content: `🎒 LANCHES SAUDÁVEIS PRA TRABALHO SEM GELADEIRA

Trabalho em obra e não tenho geladeira nem microondas. Preciso de lanches saudáveis que aguentem o dia todo na mochila sem estragar. Atualmente como biscoito e salgadinho porque é o mais prático. Quero mudar isso.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `Trabalhar sem geladeira é desafiador mas tem ótimas opções que não precisam refrigeração:

**PROTEÍNA:**
- **Charque/carne seca desfiada** — dura dias fora da geladeira, alta proteína, zero carb
- **Ovos cozidos** (até 6h com casca) — 2 ovos = 14g proteína
- **Castanhas mix** — 30-40g = proteína + gordura boa

**ENERGIA:**
- **Banana + sachê de pasta de amendoim** — combo perfeito
- **Barras de proteína** (>10g prot, <10g açúcar)
- **Frutas resistentes:** maçã, tangerina, goiaba, pera
- **Tapioca com ovo e queijo** — embalar em alumínio, aguenta 4-5h

**PRÁTICO:**
- **Pão integral + pasta de amendoim + banana** — seguro o dia todo
- **Queijo parmesão em cubos** — aguenta calor melhor que queijos frescos
- **Amendoim torrado** — R$10-15/kg, substitui castanhas caras

**LANCHEIRA DO DIA:**
- Manhã: 2 ovos cozidos + 1 maçã
- Tarde: castanhas (30g) + banana + sachê pasta de amendoim
- Emergência: barra de proteína

**Custo semanal:** ~R$30-40

Prepare tudo no domingo: ovos cozidos, porções de castanhas em saquinhos zip, frutas lavadas.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Os sachês de pasta de amendoim mudaram minha vida. Levo 2 por dia + banana. Simples, barato e sustenta muito. Larguei o salgadinho faz 3 meses e já emagreci 4kg.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 5: Receitas anti-inflamatórias
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_016',
    content: `🔥 RECEITAS ANTI-INFLAMATÓRIAS PRA DOR CRÔNICA

Tenho fibromialgia e o médico disse que alimentação anti-inflamatória pode ajudar na dor. Mas não sei por onde começar na prática. Não adianta falar "coma cúrcuma" — preciso de receitas prontas que eu consiga fazer no dia a dia.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `Entendo a frustração. "Coma cúrcuma" sem contexto não ajuda. Aqui vão receitas COMPLETAS com ingredientes anti-inflamatórios integrados:

**1. Golden Milk Turbinado (noturno, 5 min):**
- 200ml leite de coco + 1 col chá cúrcuma + 1/2 canela + pimenta-do-reino + 1 col chá óleo de coco + mel
- Aquecer em fogo baixo. Tomar antes de dormir.
- Anti-inflamatórios: curcumina, cinamaldeído, ácido láurico

**2. Salmão com Crosta de Gengibre e Gergelim (20 min):**
- 200g salmão + gengibre ralado + gergelim + shoyu + mel
- Forno 200°C, 15-18 min. Servir com brócolis no vapor.
- Anti-inflamatórios: ômega-3 (EPA/DHA), gingerol, lignanas

**3. Sopa de Abóbora com Gengibre (25 min):**
- 400g abóbora + cebola + alho + gengibre + caldo de osso + azeite
- Cozinhar 20 min, bater. Finalizar com azeite cru.
- Anti-inflamatórios: betacaroteno, gingerol, alicina, polifenóis

**4. Bowl de Sardinha com Abacate (10 min, sem fogo):**
- 1 lata sardinha + 1/2 abacate + limão + tomate cereja + cebola roxa + azeite
- Anti-inflamatórios: ômega-3, ácido oleico, licopeno

**5. Smoothie Anti-inflamatório (5 min):**
- Frutas vermelhas congeladas + banana + linhaça + leite de amêndoas + cúrcuma + pimenta-do-reino
- Anti-inflamatórios: antocianinas, curcumina, ômega-3 vegetal

**O QUE ELIMINAR:**
- Óleos de semente refinados (soja, milho, canola)
- Açúcar refinado, farinha branca, ultraprocessados, embutidos

Comece substituindo o óleo por azeite + 1 receita dessas por dia. Em 2-3 semanas você deve notar diferença.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `O golden milk mudou minha vida. Tomo toda noite há 4 meses e durmo melhor, acordo com menos rigidez. A dica da pimenta-do-reino é essencial — sem ela a cúrcuma não funciona!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `Obrigada pelas receitas COMPLETAS! Isso sim é prático. Já fiz o salmão com gengibre e ficou maravilhoso. Finalmente algo que consigo fazer no dia a dia.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 6: Doce fit gostoso
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_020',
    content: `🍫 DOCE FIT QUE É REALMENTE GOSTOSO

Cansei de doce fit que parece borracha com sabor de adoçante. Quero receitas de sobremesa saudável que sejam REALMENTE gostosas, que eu possa servir pra visita sem vergonha. Sou chocólatra assumida.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `Como chocólatra, essas vão te conquistar. Nenhuma usa adoçante artificial:

**1. Mousse de Chocolate com Abacate (10 min + geladeira):**
- 1 abacate maduro + 3 col sopa cacau 100% + 2 col sopa mel + baunilha + sal
- Bater no processador. Geladeira 1h. Rende 3-4 porções.
- Macros/porção: ~180 kcal | Segredo: você NÃO sente o abacate

**2. Brownie de Batata Doce (30 min):**
- 200g batata doce cozida + 3 col cacau + 2 ovos + 2 col óleo de coco + 3 col mel + fermento
- Forno 180°C, 20-25 min. Rende 8 porções.
- Textura: úmido e denso como brownie de verdade

**3. Trufa de Tâmara e Cacau (15 min):**
- 10 tâmaras + 3 col cacau + 2 col pasta de amendoim
- Processar, fazer bolinhas, rolar no cacau. Geladeira 30 min.
- Parece trufa de confeitaria. Ninguém acredita que é saudável.

**4. Sorvete de Banana com Chocolate (5 min):**
- 2 bananas congeladas + 2 col cacau + 1 col pasta de amendoim
- Bater no processador até virar creme. Servir imediatamente.
- Textura idêntica a sorvete cremoso

**5. Pudim de Chia com Chocolate (5 min + overnight):**
- 3 col chia + 200ml leite de coco + 2 col cacau + 1 col mel
- Geladeira 4h ou overnight. Cobrir com frutas vermelhas.

Dica universal: cacau 100% em pó + mel ou tâmaras = sabor real de chocolate sem ultraprocessados.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `A mousse de abacate é ABSURDAMENTE boa. Servi numa festa e NINGUÉM percebeu que tinha abacate. Todo mundo pediu a receita!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Fiz o brownie de batata doce e chorei de felicidade. Finalmente um doce fit que é BOM de verdade. Meu filho de 5 anos comeu e pediu mais. Obrigada!`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 7: Vegana proteica
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_007',
    content: `🌱 RECEITAS VEGANAS COM PROTEÍNA DE VERDADE

Sou vegana e treino musculação. Nutricionista disse que estou com proteína baixa (0.8g/kg). Quero chegar a 1.6g/kg sem depender de soja processada. Quais receitas veganas têm proteína real com ingredientes naturais?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `Alcançar 1.6g/kg vegana sem soja processada é possível com planejamento:

**FONTES (por 100g cozido):**
Tempeh: 19g | Seitan: 25g | Edamame: 11g | Lentilha: 9g | Grão-de-bico: 8.5g | Quinoa: 4.5g

**RECEITA 1: Bowl Lentilha + Quinoa (25 min):**
- 150g lentilha + 100g quinoa + abacate + cenoura + rúcula + molho tahine
- Macros: ~520 kcal | 28g prot

**RECEITA 2: Hambúrguer de Grão-de-Bico (20 min):**
- 200g grão-de-bico amassado + aveia + cebola + cominho + páprica
- 3 hambúrgueres na frigideira com azeite
- Macros/hambúrguer: ~180 kcal | 9g prot

**RECEITA 3: Strogonoff de Tempeh (20 min):**
- 200g tempeh dourado + cogumelos + creme de castanha de caju + mostarda
- Macros: ~480 kcal | 32g prot

**RECEITA 4: Wrap de Seitan com Homus (10 min):**
- 150g seitan grelhado + homus + rúcula + tomate + cebola roxa
- Macros: ~420 kcal | 35g prot

**DIA COMPLETO (60kg = 96g proteína):**
- Café: shake vegano (35g) = 35g
- Almoço: bowl lentilha + quinoa (28g) = 63g
- Lanche: homus + cenoura + castanhas (12g) = 75g
- Jantar: strogonoff tempeh (32g) = 107g ✅

Combinação leguminosa + cereal garante aminoácidos completos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `O strogonoff de tempeh é INCRÍVEL. Faço toda semana e meu namorado que come carne adora. Tempeh dá textura que soja processada nunca vai dar.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 8: Hipercalórica para ganho de massa
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_005',
    content: `💪 RECEITAS HIPERCALÓRICAS PRA GANHO DE MASSA

Tenho 29 anos, 1,78m e 65kg. Quero chegar a 75kg com massa muscular. Não consigo comer grande volume. Preciso de receitas que concentrem muita caloria em pouca comida, sem fast food.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `Para 65→75kg, precisa de superávit de ~300-500 kcal/dia. O desafio de pouco apetite se resolve CONCENTRANDO calorias:

**1. Shake Hipercalórico Caseiro — 900 kcal (5 min):**
- 300ml leite integral + 1 banana + 2 scoops whey + 3 col pasta de amendoim + 2 col aveia + 1 col azeite
- Macros: 900 kcal | 60g prot | 40g gord | 70g carbs
- Tomar ENTRE refeições. Melhor truque pra quem não come volume.

**2. Arroz Turbinado — 600 kcal (20 min):**
- 150g arroz + 2 ovos mexidos junto + castanha de caju picada + 1 col azeite
- Parece arroz normal mas tem o dobro de calorias

**3. Pasta de Amendoim com Banana (5 min) — 620 kcal:**
- 2 fatias pão integral + 3 col pasta de amendoim + banana + mel

**4. Macarrão Bolonhesa Hipercalórica (25 min) — 850 kcal:**
- 150g macarrão integral + 200g carne moída + molho + azeite + parmesão generoso
- Uma refeição que vale por duas

**5. Overnight Oats Hipercalórico — 780 kcal:**
- 80g aveia + 300ml leite integral + whey + pasta de amendoim + banana + frutas secas

**DICAS:**
1. Líquido > sólido (shakes são mais fáceis de consumir)
2. Coma a cada 2.5-3h
3. Adicione azeite em TUDO (1 col = 120 kcal invisíveis)
4. Não beba água durante a refeição

O shake de 900 kcal é seu melhor amigo. Sem ele é muito difícil atingir 3.000+ kcal.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `O shake hipercalórico mudou meu jogo. Passei de 68 pra 76kg em 6 meses tomando 1 por dia + treino 5x/semana. A dica de colocar azeite é real — não muda o sabor e adiciona muita caloria.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `O arroz turbinado com ovo e castanha é genial. Não parece que estou comendo "mais". Vou adotar o shake também. Valeu!`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 9: Dieta barata
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_004',
    content: `💰 DIETA SAUDÁVEL COM POUCO DINHEIRO

Ganho um salário mínimo. Todo mundo fala "coma salmão, abacate, castanhas" — coisas que custam metade do meu mercado. Dá pra ter alimentação saudável de verdade com orçamento apertado? Sem whey, sem salmão, sem superalimento importado?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_receitas',
    content: `CLARO que dá! A comida mais saudável do Brasil é a mais barata: arroz, feijão, ovo, banana, couve.

**PROTEÍNAS BARATAS:**
- **Ovo** — R$0,60-0,80/un (REI ABSOLUTO)
- **Frango coxa** — R$12-15/kg
- **Sardinha em lata** — R$5-7 (substitui salmão! Mais ômega-3 que cápsulas)
- **Feijão** — R$6-8/kg
- **Fígado bovino** — R$12-18/kg (mais nutritivo que qualquer suplemento)

**CARBOS BARATOS:**
Arroz R$5-7/kg | Batata inglesa R$4-6/kg | Banana R$3-5/kg | Mandioca R$4-6/kg

**VEGETAIS BARATOS:**
Couve R$2-3/maço | Cenoura R$4-6/kg | Repolho R$3-5/un (dura semanas!)

**CARDÁPIO DIÁRIO — R$150-200/semana:**
- **Café:** 3 ovos mexidos + banana + café
- **Almoço:** arroz + feijão + frango (coxa) + couve refogada
- **Lanche:** amendoim + banana
- **Jantar:** omelete com legumes + batata cozida

**SUBSTITUIÇÕES INTELIGENTES:**
- Sardinha em lata 3x/semana = ômega-3 sem suplemento
- Fígado 1x/semana = multivitamínico natural (vit A, B12, ferro, zinco)
- 4-5 ovos/dia = mesma proteína de 1 scoop whey, mais vitaminas, mais barato
- Amendoim = substitui castanhas caras

Sua alimentação pode ser MELHOR que muita gente que gasta R$500/mês em suplementos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Essa resposta deveria ser fixada em todo fórum de nutrição. Arroz, feijão, ovo, couve e frango é a base mais saudável que existe e custa menos que fast food.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: `Nunca pensei no fígado como "multivitamínico natural". Minha avó sempre falou que fígado era bom e eu ignorava. Obrigado!`,
    isAIResponse: false,
  },
];

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO DE EXECUÇÃO
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('🏟️  SEED: RECEITAS SAUDÁVEIS\n');

  // 1. Encontrar a arena
  const { data: arenas } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%receita%,name.ilike.%receita%');

  if (!arenas || arenas.length === 0) {
    console.log('❌ Arena "Receitas" não encontrada. Criando...');
    const { data: newArena, error } = await supabase.from('Arena').insert({
      slug: 'receitas-saudaveis',
      name: 'Receitas Saudáveis',
      description: 'Receitas que cabem no seu protocolo: keto, low carb, anti-inflamatória, vegana, proteica — com análise nutricional.',
      icon: '🍽️',
      color: 'from-green-500 to-emerald-500',
      category: 'nutricao',
      isActive: true,
      totalPosts: 0,
      totalComments: 0,
      dailyActiveUsers: 0,
      status: 'COLD'
    }).select().single();

    if (error) { console.error('Erro ao criar arena:', error); return; }
    console.log('✅ Arena criada:', newArena.id);
    arenas.push(newArena);
  }

  const arena = arenas[0];
  console.log(`✅ Arena: ${arena.name} | ID: ${arena.id} | Posts atuais: ${arena.totalPosts}`);

  // 2. Limpar posts lixo (genéricos)
  const { data: existingPosts } = await supabase
    .from('Post')
    .select('id, content')
    .eq('arenaId', arena.id);

  if (existingPosts) {
    const lixo = existingPosts.filter(p =>
      p.content.includes('Tenho essa duvida ha algum tempo') ||
      p.content.includes('gostaria de ouvir a opiniao de voces')
    );

    if (lixo.length > 0) {
      const ids = lixo.map(p => p.id);
      await supabase.from('Post').delete().in('id', ids);
      console.log(`🗑️  ${lixo.length} posts lixo removidos`);
    }
  }

  // 3. Inserir posts novos
  let created = 0;
  const baseTime = new Date('2026-02-07T08:00:00Z');

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + (i * 15 * 60 * 1000)); // 15 min entre posts

    const { error } = await supabase.from('Post').insert({
      id: uuidv4(),
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
      createdAt: postTime.toISOString(),
      updatedAt: postTime.toISOString(),
    });

    if (error) {
      console.error(`❌ Erro post ${i}:`, error.message);
    } else {
      created++;
    }
  }

  console.log(`\n✅ ${created} posts criados`);

  // 4. Atualizar contador da arena
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  await supabase
    .from('Arena')
    .update({ totalPosts: count, status: count > 10 ? 'HOT' : 'WARM' })
    .eq('id', arena.id);

  console.log(`📊 Total posts na arena: ${count}`);
  console.log('\n🏟️  Arena Receitas Saudáveis pronta! ✅\n');
}

main().catch(console.error);
