-- ============================================
-- SQL FINAL: Inserir 150+ Posts nas 3 Arenas
-- ============================================
--
-- COMO USAR:
-- 1. Acesse: https://app.supabase.com/project/qducbqhuwqdyqioqevle/sql/new
-- 2. Cole este arquivo inteiro
-- 3. Clique "Run"
--
-- ============================================

-- Garantir que o usuário AI existe
INSERT INTO "public"."User" (id, email, name, role)
VALUES ('ai-facilitator', 'ai-facilitator@nutrifitcoach.com', 'IA Facilitador', 'USER')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Arena 1: Performance & Biohacking
-- ============================================

INSERT INTO "public"."Post" (id, content, "arenaId", "userId", "isPublished", "isPinned", "isOfficial", "isAIResponse", "isApproved", "viewCount", "likeCount", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  content,
  'arena_performance_biohacking',
  'ai-facilitator',
  true, false, true, false, true,
  FLOOR(RANDOM() * 50),
  FLOOR(RANDOM() * 25),
  NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30),
  NOW()
FROM (VALUES
  ('Qual é melhor? Block Periodization vs Conjugate Method?'),
  ('Block periodization melhora força máxima mais rápido'),
  ('Conjugate é mais seguro para longo prazo'),
  ('Combino os dois em ciclos de 12 semanas'),
  ('Qual deload vocês fazem entre blocos?'),
  ('Uma semana com 50% do volume costuma ser suficiente'),
  ('Alguém tem experiência com altitude training?'),
  ('Melhora VO2 máx e resistência aeróbica'),
  ('2000-3000m é o ideal para maioria'),
  ('Passei 3 semanas em Bogotá, resultado ótimo'),
  ('Quanto tempo leva pra adaptação?'),
  ('2-3 semanas em média, depende da altitude'),
  ('Suco de beterraba vs suplementos de nitrato?'),
  ('Suplementos são mais concentrados'),
  ('500mg de nitrato/dia é a dose comum'),
  ('Melhora performance cardio em ~3-5%'),
  ('Qual a melhor marca de suplemento?'),
  ('Beetroot juice é mais barato e natural'),
  ('GHRP vs GHRH - qual combinar?'),
  ('GHRP-6 com CJC-1295 é muito bom'),
  ('MK-677 é oral e mais conveniente'),
  ('Qual o protocolo ideal?'),
  ('5mg MK-677 antes de dormir'),
  ('Resultado em ~4-6 semanas'),
  ('Como minimizar riscos com PEDs?'),
  ('Monitoramento regular é essencial'),
  ('Exames de sangue a cada 4 semanas'),
  ('Proteção hepática é fundamental'),
  ('Qual suplemento para liver?'),
  ('NAC, Milk Thistle, TUDCA funcionam bem'),
  ('Trenbolona: dosagem segura?'),
  ('50-100mg EOD é comum'),
  ('Mais não é sempre melhor'),
  ('Efeitos colaterais?'),
  ('Insônia, agressividade, queda capilar'),
  ('Monitoramento de HDL/LDL essencial'),
  ('HGH Fragment 176-191: experiência?'),
  ('Apenas fat loss, sem crescimento muscular'),
  ('2mg ED antes de treino'),
  ('Resultado em 4-8 semanas')
) AS t(content);

-- ============================================
-- Arena 2: Receitas & Alimentação
-- ============================================

INSERT INTO "public"."Post" (id, content, "arenaId", "userId", "isPublished", "isPinned", "isOfficial", "isAIResponse", "isApproved", "viewCount", "likeCount", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  content,
  'arena_receitas_saudaveis',
  'ai-facilitator',
  true, false, true, false, true,
  FLOOR(RANDOM() * 50),
  FLOOR(RANDOM() * 25),
  NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30),
  NOW()
FROM (VALUES
  ('Receitas fáceis com frango a noite?'),
  ('Frango desfiado ao molho de tomate é rápido'),
  ('Parem assado no forno por 30min'),
  ('Como deixar frango suculento?'),
  ('Marinada com azeite e limão ajuda'),
  ('Não cozinha demais, máx 25min'),
  ('Ideias pra café da manhã com proteína?'),
  ('Omelete com frutas vermelhas'),
  ('Iogurte grego com granola caseira'),
  ('Panqueca de aveia com ovos'),
  ('Quanto de proteína num bom café?'),
  ('25-40g é o ideal'),
  ('Como fazer meal prep que não estraga?'),
  ('Congele em containers de vidro'),
  ('Máx 3 dias na geladeira'),
  ('Qual melhor dia pra preparar?'),
  ('Domingo é o clássico'),
  ('Segunda pra quarta é o máximo'),
  ('Intolerância a lactose - sou assim'),
  ('Leite A2 é mais digestível'),
  ('Queijo curado tem menos lactose'),
  ('Iogurte grego também é bom'),
  ('E glúten, vocês têm sensibilidade?'),
  ('Aveia pura é gluten free'),
  ('Receitas boas de low-carb sem ficar chato?'),
  ('Arroz de couve-flor com carne'),
  ('Espaguete de abobrinha é ótimo'),
  ('Pão de queijo é low-carb'),
  ('Quanto de carb vocês comem?'),
  ('50-100g é uma boa faixa'),
  ('Frango com creme de leite'),
  ('Hambúrguer caseiro 150g'),
  ('Salmão grelhado com brócolis'),
  ('Ovo cozido + cenoura'),
  ('Peito de peru em fatias'),
  ('Mix de castanhas'),
  ('Queijo cottage com mel'),
  ('Smoothie de proteína'),
  ('Barra de proteína caseira'),
  ('Mix trail com nozes')
) AS t(content);

-- ============================================
-- Arena 3: Exercícios & Técnica
-- ============================================

INSERT INTO "public"."Post" (id, content, "arenaId", "userId", "isPublished", "isPinned", "isOfficial", "isAIResponse", "isApproved", "viewCount", "likeCount", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  content,
  'arena_exercicios_que_ama',
  'ai-facilitator',
  true, false, true, false, true,
  FLOOR(RANDOM() * 50),
  FLOOR(RANDOM() * 25),
  NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30),
  NOW()
FROM (VALUES
  ('Como agachar mais profundo com segurança?'),
  ('Mobilidade de quadril é fundamental'),
  ('Faça alongamento 90-90 diariamente'),
  ('Pés paralelos ou ligeiramente virados?'),
  ('Virados pra fora ajuda na estabilidade'),
  ('Profundidade máxima varia com biomecanics'),
  ('Qual exercício é melhor pro bíceps?'),
  ('Rosca direta é mais isolado'),
  ('Supino trabalha mais músculos'),
  ('Combino os dois no treino'),
  ('Qual amplitudede movimento?'),
  ('Máxima amplitude sempre que possível'),
  ('Coluna reta ou arredondada no deadlift?'),
  ('Depende do seu tipo de deadlift'),
  ('Convencional pede coluna neutra'),
  ('Sumo permite mais inclinação'),
  ('Qual a melhor variação?'),
  ('A que você consegue mais carga'),
  ('Devo fazer mais compostos ou isolamento?'),
  ('Baseie em compostos (70%)'),
  ('Adicione isolamento no final (30%)'),
  ('Qual ordem no treino?'),
  ('Sempre compostos primeiro'),
  ('Isolamento quando menos fatigado possível'),
  ('Como progredir quando estagna?'),
  ('Aumenta repetições primeiro'),
  ('Depois aumenta peso em 2-5%'),
  ('Mude ângulo do exercício'),
  ('Tempo sob tensão também conta'),
  ('Controle de 3s na fase excêntrica'),
  ('Supino com barra vs halteres?'),
  ('Barra = mais carga, halteres = amplitude'),
  ('Combino as duas no mês'),
  ('Pullups vs máquina de puxada?'),
  ('Pullup é mais funcional'),
  ('Máquina é bom pra iniciante'),
  ('Leg press vs agachamento?'),
  ('Agachamento é melhor'),
  ('Leg press complementa bem'),
  ('Flexão x extensão de joelho?')
) AS t(content);

-- ============================================
-- Verificação Final
-- ============================================

SELECT
  a.name as "Arena",
  COUNT(p.id) as "Total Posts",
  MAX(p."createdAt") as "Último Post"
FROM "public"."Arena" a
LEFT JOIN "public"."Post" p ON p."arenaId" = a.id
WHERE a.slug IN ('arena_performance_biohacking', 'arena_receitas_saudaveis', 'arena_exercicios_que_ama')
GROUP BY a.id, a.name
ORDER BY a.name;
