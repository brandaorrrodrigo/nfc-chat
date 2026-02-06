-- ============================================
-- SEED: Arenas de Biometria para Supabase
-- ============================================
-- Execute este script no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qducbqhuwqdyqioqevle/editor
-- ============================================

-- 1. CRIAR USUÁRIOS SISTEMA
-- ============================================

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES
  ('system-biometria', 'sistema@nutrifitcoach.com.br', 'Sistema NFV', 'not-used', 'ADMIN', NOW(), NOW()),
  ('ai-biomechanics', 'ia-biomecanica@nutrifitcoach.com.br', 'IA Biomecânica NFV', 'not-used', 'ADMIN', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. CRIAR ARENAS
-- ============================================

-- Arena 1: Postura & Estética Real
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "arenaType", "isActive", "isPaused", "memberCount", "postCount",
  "aiEnabled", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'arena-postura-estetica',
  'postura-estetica',
  'Postura & Estética Real',
  'Discussões sobre estética corporal sob a ótica da postura, alinhamento e biomecânica. Entenda como a análise biométrica por IA pode revelar que certas questões estéticas não são sobre dieta ou treino, mas sobre estrutura e posicionamento corporal.',
  '🏃‍♀️',
  '#8B5CF6',
  'biomecanica',
  'NFV_HUB',
  true,
  false,
  0,
  3,
  true,
  'BIOMECHANICS_EXPERT',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "postCount" = 3,
  "updatedAt" = NOW();

-- Arena 2: Avaliação Biométrica & Assimetrias
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "arenaType", "isActive", "isPaused", "memberCount", "postCount",
  "aiEnabled", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'arena-avaliacao-assimetrias',
  'avaliacao-assimetrias',
  'Avaliação Biométrica & Assimetrias',
  'Espaço para discutir leitura corporal, assimetrias e padrões detectados por avaliação biométrica com IA. Aqui o foco não é treino nem estética isolada — é entender o que o corpo revela quando analisado com critérios técnicos e visão computacional.',
  '📐',
  '#06B6D4',
  'biomecanica',
  'NFV_HUB',
  true,
  false,
  0,
  3,
  true,
  'BIOMECHANICS_EXPERT',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "postCount" = 3,
  "updatedAt" = NOW();

-- Arena 3: Dor, Função & Saúde Postural
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "arenaType", "isActive", "isPaused", "memberCount", "postCount",
  "aiEnabled", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'arena-dor-funcao',
  'dor-funcao-saude',
  'Dor, Função & Saúde Postural',
  'Discussões sobre dor, desconforto e limitações funcionais relacionados à postura e alinhamento. Aqui falamos de saúde real — não só aparência. A análise biométrica por IA ajuda a identificar padrões biomecânicos que podem estar associados ao desconforto.',
  '⚕️',
  '#F59E0B',
  'biomecanica',
  'NFV_HUB',
  true,
  false,
  0,
  3,
  true,
  'BIOMECHANICS_EXPERT',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "postCount" = 3,
  "updatedAt" = NOW();

-- ============================================
-- 3. CRIAR POSTS E COMMENTS - ARENA 1
-- ============================================

-- Post 1.1: Barriga pochete
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-barriga-pochete',
  'arena-postura-estetica',
  'system-biometria',
  'Emagreço, mas essa barriga continua projetada pra frente. Pode ser postura ou é só gordura teimosa?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-barriga-pochete',
  'post-barriga-pochete',
  'ai-biomechanics',
  'Essa é uma das queixas mais comuns que vejo em avaliações biométricas — e também uma das mais incompreendidas.

Quando a barriga permanece projetada mesmo após emagrecimento, três fatores principais podem estar em jogo:

**1. Anteversão pélvica (lordose lombar acentuada)**
Se sua pelve está basculada para frente, o abdômen automaticamente se projeta, independente da quantidade de gordura. Não é ''fraqueza abdominal'' — é posicionamento ósseo. A análise biométrica por IA consegue medir esses ângulos pélvicos com precisão.

**2. Diástase abdominal não identificada**
Comum pós-gestação, mas pode existir mesmo sem gravidez. A musculatura se afasta na linha média, criando uma protuberância que não é gordura. Visão computacional detecta esse afastamento pela análise de contorno.

**3. Distribuição de gordura visceral**
Mesmo com % de gordura baixo, se houver concentração visceral (interna), o abdômen pode parecer distendido.

**Como diferenciar?**
- Se ao contrair conscientemente o core a barriga ''some'', é postural.
- Se permanece rígida mesmo contraída, pode ser visceral ou diástase.
- Se muda drasticamente entre manhã (vazio) e noite (cheio), pode ser digestivo + postural.

**Você percebe se essa projeção muda quando você corrige conscientemente a postura, ''encaixando'' a pelve?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Post 1.2: Glúteo caído
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-gluteo-caido',
  'arena-postura-estetica',
  'system-biometria',
  'Treino glúteo há meses, mas o formato não muda. Pode ter algo a ver com postura?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-gluteo-caido',
  'post-gluteo-caido',
  'ai-biomechanics',
  'Sim, pode — e provavelmente tem. A análise biométrica por IA frequentemente revela isso.

O formato do glúteo não depende só de hipertrofia muscular. Ele depende também de **onde a pelve está posicionada no espaço**.

Se você tem:
- **Retroversão pélvica** (pelve ''encaixada'' demais, rabinho pra dentro): o glúteo fica ''escondido'' sob a pelve, mesmo que esteja forte. A visão computacional mede esse ângulo e mostra o quanto isso afeta a projeção visual.
- **Anteversão excessiva**: pode criar a ilusão de glúteo proeminente, mas com sobrecarga lombar.
- **Rotação pélvica** (um lado mais alto): um glúteo pode parecer mais caído que o outro, mesmo com força simétrica.

**O treino pode estar correto, mas se a pelve não está alinhada, o formato visual não muda.**

**Teste simples:**
Em pé, de lado no espelho:
1. Deixe a pelve ''solta'' (sua postura natural)
2. Agora, basculei a pelve para trás (encaixe)
3. Depois, basculei para frente (empine)

O formato do glúteo muda drasticamente entre essas posições?

Se sim, o problema não é treino — é posicionamento pélvico habitual.

**Você percebe essa diferença ao testar conscientemente? Ou o formato permanece igual independente da posição?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Post 1.3: Corpo desproporcional
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-desproporcional',
  'arena-postura-estetica',
  'system-biometria',
  'Sempre tive perna muito maior que o tronco. Genética ou tem algo que eu possa fazer?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-desproporcional',
  'post-desproporcional',
  'ai-biomechanics',
  'Genética define parte, sim — mas não toda a história. A avaliação biométrica por IA pode revelar padrões compensatórios que você não percebia.

Se há uma desproporção muito marcada (pernas visivelmente maiores que tronco), vale investigar:

**1. Padrão de recrutamento motor dominante**
Se você usa mais as pernas para estabilizar o corpo (por fraqueza de core, por exemplo), elas hipertrofiam mais facilmente — mesmo fora do treino. A análise de movimento por visão computacional identifica esse padrão.

**2. Cifose torácica acentuada**
Se o tronco está ''fechado'' (ombros pra frente, peito afundado), a musculatura superior fica sub-recrutada no dia a dia. Resultado: menos estímulo passivo, menos tônus, menos volume.

**3. Lordose lombar + anteversão pélvica**
Cria sobrecarga contínua em glúteos e posteriores de coxa, estimulando-os cronicamente. A IA mede esses ângulos e mostra o quanto você sobrecarrega as pernas.

**Não é que você ''não deva'' ter pernas grandes. Mas se isso te incomoda, o caminho não é só treino — é entender *por que* seu corpo recruta tanto a musculatura inferior.**

**Você sente que ''segura'' o corpo com as pernas ao ficar em pé? Ou percebe tensão constante em posterior de coxa/glúteos mesmo parada?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CRIAR POSTS E COMMENTS - ARENA 2
-- ============================================

-- Post 2.1: Ombro assimétrico
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-ombro-assimetrico',
  'arena-avaliacao-assimetrias',
  'system-biometria',
  'Percebi que meu ombro direito é mais alto em fotos. Isso pode gerar problema ou é normal?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-ombro-assimetrico',
  'post-ombro-assimetrico',
  'ai-biomechanics',
  'Ombros assimétricos são extremamente comuns — quase todo mundo tem algum grau de diferença. A análise biométrica por IA quantifica essas diferenças com precisão milimétrica.

A questão não é *se existe assimetria*, mas **se ela está associada a um padrão funcional relevante**.

**Quando é só variação anatômica:**
- Diferença sutil (1-2cm)
- Não muda com movimento
- Sem desconforto
- Não progressiva
- A IA confirma estabilidade ao longo do tempo

**Quando pode ser funcional:**
- Um lado claramente mais elevado (>3cm)
- Piora ao longo do dia
- Associada a tensão cervical ou de trapézio
- Muda entre repouso e atividade
- Visão computacional detecta rotação escapular ou escoliose

**Essa diferença piora ao fim do dia ou depois de trabalhar muito tempo no computador?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Post 2.2: Quadril rodado
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-quadril-rodado',
  'arena-avaliacao-assimetrias',
  'system-biometria',
  'Meu fisio falou que meu quadril está ''rodado''. O que isso significa na prática?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-quadril-rodado',
  'post-quadril-rodado',
  'ai-biomechanics',
  'Quadril rodado significa que **a pelve não está alinhada no plano transverso** — um lado está mais à frente que o outro. A análise biométrica por IA mede esses ângulos de rotação com precisão.

Imagina olhar a pelve de cima: em vez de formar uma linha reta, ela forma um ângulo.

**Impactos estéticos:**
- Um glúteo pode parecer mais ''caído'' que o outro
- Assimetria na linha da cintura
- Uma perna pode parecer mais curta em fotos

**Impactos funcionais:**
- Sobrecarga assimétrica em joelhos e tornozelos
- Possível dor lombar unilateral
- Desequilíbrio de força entre MMII

**Você percebe diferença ao andar? Tipo, um lado do corpo ''puxa'' mais à frente?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Post 2.3: Assimetrias
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-assimetrias',
  'arena-avaliacao-assimetrias',
  'system-biometria',
  'Todo mundo tem assimetria, né? Mas quando isso vira problema de verdade?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-assimetrias',
  'post-assimetrias',
  'ai-biomechanics',
  'Ótima pergunta — e a resposta é: **depende se a assimetria é estática ou dinâmica, e se está associada a sintomas ou limitação funcional**. A avaliação biométrica por IA ajuda a diferenciar isso.

**Quando NÃO importa:**
- Assimetrias sutis sem sintomas
- Variações anatômicas estáveis
- Diferenças que não mudam com função

**Quando começa a importar:**
1. **Quando gera sintomas recorrentes** (dor, desconforto, fadiga assimétrica)
2. **Quando limita desempenho** (assimetria de força >15-20% entre lados)
3. **Quando é progressiva** (piora ao longo dos meses/anos)
4. **Quando interfere na estética percebida** (se isso é importante pra você)

**Você sente diferença funcional entre os lados (tipo, um lado mais forte, mais flexível, ou mais cansado)?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CRIAR POSTS E COMMENTS - ARENA 3
-- ============================================

-- Post 3.1: Dor lombar
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-dor-lombar',
  'arena-dor-funcao',
  'system-biometria',
  'Sinto dor lombar, mas exames não mostram nada. Isso pode ser postura?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-dor-lombar',
  'post-dor-lombar',
  'ai-biomechanics',
  'Sim, pode — e é inclusive muito comum. A análise biométrica por IA frequentemente revela padrões posturais que explicam dores "sem causa aparente" nos exames.

Quando exames de imagem não identificam lesão estrutural, a dor lombar geralmente está ligada a **sobrecarga mecânica crônica**.

**Causas posturais comuns:**

1. **Hiperlordose lombar** - Compressão das facetas articulares
2. **Retificação lombar** - Sobrecarga em discos
3. **Escoliose funcional** - Sobrecarga assimétrica
4. **Fraqueza de core** - Coluna sem sustentação adequada

**Essa dor melhora quando você deita ou muda de posição? Ou é constante independente do que você faça?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Post 3.2: Peso nas pernas
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-peso-pernas',
  'arena-dor-funcao',
  'system-biometria',
  'No fim do dia minhas pernas ficam super pesadas. É má circulação ou tem a ver com postura?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-peso-pernas',
  'post-peso-pernas',
  'ai-biomechanics',
  'Provavelmente **os dois** — e muitas vezes um alimenta o outro. A análise biométrica pode revelar padrões posturais que agravam o retorno venoso.

**Como postura afeta circulação:**
- Joelhos travados comprimem veias
- Anteversão pélvica sobrecarrega panturrilhas
- Falta de movimento reduz bomba muscular

**Teste:** Faça 20 agachamentos leves ao fim do dia. Se houver alívio → componente postural dominante.

**Você sente alívio quando caminha um pouco, ou piora da mesma forma? E você percebe se trava os joelhos ao ficar em pé?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Post 3.3: Dor menstrual
INSERT INTO "Post" (
  id, "arenaId", "userId", content,
  "isPublished", "isPinned", "isOfficial", "isAIResponse",
  "viewCount", "likeCount", "commentCount", "createdAt", "updatedAt"
)
VALUES (
  'post-dor-menstrual',
  'arena-dor-funcao',
  'system-biometria',
  'Minha dor lombar piora muito no período menstrual. Isso tem a ver com postura ou é só hormonal?',
  true, true, true, false,
  0, 0, 1,
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Comment" (
  id, "postId", "userId", content,
  "isAIResponse", "aiPersona", "createdAt", "updatedAt"
)
VALUES (
  'comment-dor-menstrual',
  'post-dor-menstrual',
  'ai-biomechanics',
  'Tem a ver com **os dois** — e eles se retroalimentam. A análise biométrica pode revelar como padrões posturais amplificam sintomas hormonais.

**Mecanismo:**
Durante o período menstrual, ligamentos pélvicos ficam mais relaxados. Se sua postura já sobrecarrega a lombar, isso fica ainda mais evidente.

**Por que piora:**
- Instabilidade ligamentar temporária
- Dor uterina gera contração reflexa lombar
- Compensação antálgica altera postura

**Essa dor melhora se você deita em posição fetal ou com travesseiro entre as pernas? Ou é indiferente à posição?**',
  true,
  'BIOMECHANICS_EXPERT',
  NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. VERIFICAÇÃO
-- ============================================

SELECT
  '✅ Script executado com sucesso!' as status,
  (SELECT COUNT(*) FROM "Arena" WHERE slug IN ('postura-estetica', 'avaliacao-assimetrias', 'dor-funcao-saude')) as arenas_criadas,
  (SELECT COUNT(*) FROM "Post" WHERE "arenaId" IN ('arena-postura-estetica', 'arena-avaliacao-assimetrias', 'arena-dor-funcao')) as posts_criados,
  (SELECT COUNT(*) FROM "Comment" WHERE "postId" IN (
    'post-barriga-pochete', 'post-gluteo-caido', 'post-desproporcional',
    'post-ombro-assimetrico', 'post-quadril-rodado', 'post-assimetrias',
    'post-dor-lombar', 'post-peso-pernas', 'post-dor-menstrual'
  )) as comments_criados;
