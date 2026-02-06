/**
 * SEED DE ARENAS BIOMÉTRICAS - SUPABASE
 *
 * Execute este script manualmente no Supabase SQL Editor:
 * https://supabase.com/dashboard/project/qducbqhuwqdyqioqevle/editor
 *
 * Cria:
 * - 2 usuários sistema (system-biometria, ai-biomechanics)
 * - 3 arenas de avaliação biométrica
 * - 9 posts iniciais (3 por arena)
 * - 9 comments da IA
 *
 * Idempotente: Pode ser executado múltiplas vezes sem duplicar dados.
 */

-- ============================================
-- 1. CRIAR USUÁRIOS SISTEMA
-- ============================================

INSERT INTO "User" (
  id,
  email,
  name,
  password,
  role,
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'system-biometria',
    'sistema@nutrifitcoach.com.br',
    'Sistema NFV',
    'not-used',
    'ADMIN',
    NOW(),
    NOW()
  ),
  (
    'ai-biomechanics',
    'ia-biomecanica@nutrifitcoach.com.br',
    'IA Biomecânica NFV',
    'not-used',
    'ADMIN',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CRIAR ARENAS
-- ============================================

-- Arena 1: Postura & Estética Real
INSERT INTO "Arena" (
  id,
  slug,
  name,
  description,
  icon,
  color,
  category,
  "arenaType",
  "isActive",
  "isPaused",
  "allowImages",
  "allowLinks",
  "allowVideos",
  "aiPersona",
  "aiInterventionRate",
  "aiFrustrationThreshold",
  "aiCooldown",
  categoria,
  "totalPosts",
  "totalComments",
  "createdAt",
  "updatedAt"
)
VALUES (
  'arena-postura-estetica',
  'postura-estetica',
  '🧍 Postura & Estética Real',
  'Discussões sobre estética corporal sob a ótica da postura e biomecânica. Como a postura afeta sua aparência? Aquele "pneuzinho" pode ser desalinhamento? Venha entender o que a IA de análise corporal revela.',
  '🧍',
  '#10B981',
  'BIOMECANICA_NFV',
  'NFV_HUB',
  true,
  false,
  true,
  true,
  false,
  'BIOMECHANICS_EXPERT',
  60,
  120,
  5,
  'BIOMECANICA_NFV',
  3,
  3,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "totalPosts" = 3,
  "totalComments" = 3,
  "updatedAt" = NOW();

-- Arena 2: Avaliação Biométrica & Assimetrias
INSERT INTO "Arena" (
  id,
  slug,
  name,
  description,
  icon,
  color,
  category,
  "arenaType",
  "isActive",
  "isPaused",
  "allowImages",
  "allowLinks",
  "allowVideos",
  "aiPersona",
  "aiInterventionRate",
  "aiFrustrationThreshold",
  "aiCooldown",
  categoria,
  "totalPosts",
  "totalComments",
  "createdAt",
  "updatedAt"
)
VALUES (
  'arena-avaliacao-assimetrias',
  'avaliacao-assimetrias',
  '📐 Avaliação Biométrica & Assimetrias',
  'Espaço para discussões sobre leitura corporal, assimetrias e análise biométrica por IA. Como a visão computacional identifica desalinhamentos? O que é normal e o que precisa atenção? A IA analisa, você decide.',
  '📐',
  '#3B82F6',
  'BIOMECANICA_NFV',
  'NFV_HUB',
  true,
  false,
  true,
  true,
  false,
  'BIOMECHANICS_EXPERT',
  60,
  120,
  5,
  'BIOMECANICA_NFV',
  3,
  3,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "totalPosts" = 3,
  "totalComments" = 3,
  "updatedAt" = NOW();

-- Arena 3: Dor, Função & Saúde Postural
INSERT INTO "Arena" (
  id,
  slug,
  name,
  description,
  icon,
  color,
  category,
  "arenaType",
  "isActive",
  "isPaused",
  "allowImages",
  "allowLinks",
  "allowVideos",
  "aiPersona",
  "aiInterventionRate",
  "aiFrustrationThreshold",
  "aiCooldown",
  categoria,
  "totalPosts",
  "totalComments",
  "createdAt",
  "updatedAt"
)
VALUES (
  'arena-dor-funcao-saude',
  'dor-funcao-saude',
  '🩺 Dor, Função & Saúde Postural',
  'Explore a relação entre postura, dor e função. Dor lombar sem lesão? Peso nas pernas ao fim do dia? A IA de biomecânica ajuda a identificar padrões posturais que podem estar por trás do desconforto.',
  '🩺',
  '#F59E0B',
  'BIOMECANICA_NFV',
  'NFV_HUB',
  true,
  false,
  true,
  true,
  false,
  'BIOMECHANICS_EXPERT',
  60,
  120,
  5,
  'BIOMECANICA_NFV',
  3,
  3,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "totalPosts" = 3,
  "totalComments" = 3,
  "updatedAt" = NOW();

-- ============================================
-- 3. CRIAR POSTS (THREADS INICIAIS)
-- ============================================

-- Arena 1: Postura & Estética Real - Posts

INSERT INTO "Post" (
  id,
  "arenaId",
  "userId",
  content,
  "isPublished",
  "isPinned",
  "isOfficial",
  "isAIResponse",
  "viewCount",
  "likeCount",
  "commentCount",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'post-postura-barriga-pochete',
    'arena-postura-estetica',
    'system-biometria',
    E'# Barriga "pochete" que não sai: postura ou gordura? 🤔\n\nTreino religiosamente, faço dieta, mas aquela barriguinha abaixo do umbigo (tipo "pochete") simplesmente não sai. Será que pode ser algo relacionado à postura? Já vi gente falando que bacia desalinhada pode causar isso. A análise biométrica por IA consegue identificar se é questão postural ou apenas gordura localizada?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),
  (
    'post-postura-gluteo-caido',
    'arena-postura-estetica',
    'system-biometria',
    E'# Glúteo caído mesmo treinando: treino ou bacia desalinhada? 🍑\n\nFaço treino de glúteo há meses (agachamento, stiff, hip thrust), mas continua com aspecto "caído". Uma amiga fisioterapeuta disse que pode ser a bacia rodada ou inclinada. Isso faz sentido? A avaliação por IA consegue detectar se meu quadril está desalinhado e isso está afetando a estética do glúteo?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),
  (
    'post-postura-corpo-desproporcional',
    'arena-postura-estetica',
    'system-biometria',
    E'# Corpo desproporcional: perna grande, tronco fino 📏\n\nMe vejo no espelho e sinto que meu corpo é desproporcional: pernas grossas, mas tronco fino. Será que isso pode ser postura? Ouvi falar que cifose (costas arredondadas) pode fazer o tronco parecer menor. A análise biométrica da IA consegue medir proporções e identificar se é estrutura óssea ou compensação postural?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),

-- Arena 2: Avaliação & Assimetrias - Posts

  (
    'post-assimetria-ombro-alto',
    'arena-avaliacao-assimetrias',
    'system-biometria',
    E'# Um ombro mais alto que o outro: estético ou funcional? 🤷\n\nPercebo que meu ombro direito fica mais alto que o esquerdo. Às vezes me incomoda esteticamente (camiseta fica torta), mas não sinto dor. Isso é comum? A IA de visão computacional consegue quantificar essa diferença e me dizer se é algo que preciso corrigir ou se é só característica individual?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),
  (
    'post-assimetria-quadril-rodado',
    'arena-avaliacao-assimetrias',
    'system-biometria',
    E'# Quadril rodado: impactos estéticos e funcionais 🔄\n\nUm personal me disse que meu quadril está "rodado" (um lado mais à frente que o outro). Fiquei preocupada: isso pode causar dor no futuro? E esteticamente, afeta a silhueta? A análise biométrica por IA consegue medir essa rotação e mostrar se está dentro do normal ou se preciso trabalhar correção?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),
  (
    'post-assimetria-direita-esquerda',
    'arena-avaliacao-assimetrias',
    'system-biometria',
    E'# Assimetria direita vs esquerda: quando importa? ⚖️\n\nNoto que minha perna direita parece levemente mais desenvolvida que a esquerda. Isso é normal? Todo mundo tem alguma assimetria? Ou isso pode indicar sobrecarga e risco de lesão? Como a IA biomecânica diferencia assimetrias "normais" de assimetrias que precisam atenção?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),

-- Arena 3: Dor & Função - Posts

  (
    'post-dor-lombar-sem-lesao',
    'arena-dor-funcao-saude',
    'system-biometria',
    E'# Dor lombar sem lesão: pode ser postura? 🤕\n\nTenho dor lombar recorrente, mas já fiz exames e não tem nada (sem hérnia, sem lesão). O médico disse que é "postural". Mas o que isso significa na prática? A avaliação biométrica por IA consegue identificar padrões de postura que podem estar causando essa dor?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),
  (
    'post-dor-peso-pernas',
    'arena-dor-funcao-saude',
    'system-biometria',
    E'# Peso nas pernas ao fim do dia: circulação ou postura? 🦵\n\nNo fim do dia sinto minhas pernas pesadas e inchadas. Será problema circulatório ou pode ser postura? Ouvi falar que pessoas com bacia desalinhada sobrecarregam uma perna. A IA de biomecânica consegue ver se minha distribuição de peso está equilibrada?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  ),
  (
    'post-dor-periodo-menstrual',
    'arena-dor-funcao-saude',
    'system-biometria',
    E'# Dor que piora no período menstrual: postura influencia? 🌙\n\nMinha dor lombar piora MUITO durante a menstruação. Sempre achei que era normal, mas será que postura pode estar agravando? A análise biométrica consegue mostrar se meu alinhamento pélvico está contribuindo para essa dor cíclica?',
    true,
    true,
    true,
    false,
    0,
    0,
    1,
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CRIAR COMMENTS (RESPOSTAS DA IA)
-- ============================================

INSERT INTO "Comment" (
  id,
  "postId",
  "userId",
  content,
  "isAIResponse",
  "aiPersona",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    'comment-barriga-pochete-ia',
    'post-postura-barriga-pochete',
    'ai-biomechanics',
    E'Excelente pergunta! A "barriga pochete" (abaixo do umbigo) pode ter múltiplas causas, e **sim, a postura é um fator importante** 🎯\n\n**O que a Análise Biométrica por IA revela:**\n\n1. **Anteversão pélvica** (bacia inclinada para frente):\n   - Cria uma "projeção" abdominal baixa\n   - Mesmo com baixo percentual de gordura, a região parece saliente\n   - Comum em pessoas que ficam muito tempo sentadas\n\n2. **Hiperlordose lombar** (curvatura exagerada na lombar):\n   - Empurra a região abdominal baixa para frente\n   - Pode coexistir com músculos abdominais fracos\n\n3. **Distribuição de gordura vs. postura**:\n   - A IA mede ângulos pélvicos e curvatura lombar\n   - Compara com padrões biomecânicos ideais\n   - Diferencia "volume" (gordura) de "projeção" (postura)\n\n**Como saber qual é o seu caso?**\n\nA análise por visão computacional:\n- Mede o ângulo de inclinação pélvica (ideal: 8-12°)\n- Avalia se há compensação postural\n- Identifica se é questão estrutural ou muscular\n\n💡 **Pergunta para você refletir:**\nVocê nota se essa "pochete" fica mais evidente ao ficar em pé parada, ou permanece igual mesmo quando contrai o abdômen conscientemente?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-gluteo-caido-ia',
    'post-postura-gluteo-caido',
    'ai-biomechanics',
    E'Sua amiga fisioterapeuta está certa! 🎯 A **posição da bacia influencia DIRETAMENTE a aparência do glúteo**, independente do treino.\n\n**O que acontece biomecanicamente:**\n\n1. **Retroversão pélvica** (bacia "encaixada" para trás):\n   - Glúteo parece "achatado" mesmo desenvolvido\n   - Perde o formato arredondado característico\n   - Treino fortalece, mas não muda aparência\n\n2. **Rotação pélvica** (um lado da bacia mais à frente):\n   - Um glúteo parece "caído" em relação ao outro\n   - Assimetria estética evidente\n\n3. **Relação com core e lombar**:\n   - Fraqueza de core pode alterar posicionamento pélvico\n   - Hipercifose (costas arredondadas) puxa bacia para retroversão\n\n**Como a IA de Visão Computacional ajuda:**\n\n- Mede o ângulo sacral (inclinação do osso sacro)\n- Compara simetria direita vs. esquerda\n- Identifica se há rotação ou inclinação pélvica\n- Diferencia "glúteo fraco" de "glúteo mal posicionado"\n\n**Teste rápido:**\nFique de lado no espelho e "encaixe" a bacia (retroversão intencional). Depois solte e deixe a lombar fazer uma curva natural (anteversão leve). Você nota diferença na aparência do glúteo?\n\n💡 **Se mudar, é postura. Se não mudar, é desenvolvimento muscular.**\n\n🤔 Você já tentou esse teste? Qual o resultado?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-corpo-desproporcional-ia',
    'post-postura-corpo-desproporcional',
    'ai-biomechanics',
    E'Percepção interessante! E você está certa: **postura pode alterar completamente a percepção de proporções corporais** 📐\n\n**Como a postura afeta proporções visuais:**\n\n1. **Cifose torácica** (ombros arredondados para frente):\n   - Tórax parece "afundado"\n   - Tronco visualmente mais curto\n   - Pernas parecem desproporcionalmente grandes\n\n2. **Anteriorização da cabeça** (pescoço para frente):\n   - Encurta visualmente a linha do tronco\n   - Comum em quem usa muito celular/computador\n\n3. **Rotação escapular** (omoplatas aladas):\n   - Costas parecem estreitas\n   - Contrasta com coxas desenvolvidas\n\n**O que a Análise Biométrica por IA mede:**\n\n- **Proporção real** (estrutura óssea):\n  - Razão comprimento fêmur / comprimento tronco\n  - Baseada em landmarks anatômicos fixos\n\n- **Proporção visual** (influência postural):\n  - Como cifose/lordose alteram linhas corporais\n  - Diferença entre "proporção real" vs "proporção percebida"\n\n**Exemplo prático:**\nUma pessoa com cifose de 50° pode ter tronco 8cm mais curto VISUALMENTE, mas estruturalmente igual.\n\n**A IA consegue:**\n✅ Medir sua estrutura óssea real\n✅ Identificar compensações posturais\n✅ Mostrar "antes/depois" simulado de correção postural\n\n💭 **Pergunta:**\nQuando você "puxa os ombros para trás" conscientemente, a percepção de desproporção diminui?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-ombro-alto-ia',
    'post-assimetria-ombro-alto',
    'ai-biomechanics',
    E'Ótima observação! Assimetrias de ombro são **extremamente comuns** e nem sempre precisam correção. Vamos entender quando importa 🔍\n\n**Tipos de assimetria de ombro:**\n\n1. **Assimetria estrutural** (óssea):\n   - Diferença no comprimento das clavículas\n   - Geralmente < 5mm, imperceptível\n   - Não causa dor, não precisa correção\n\n2. **Assimetria funcional** (muscular/postural):\n   - Trapézio dominante de um lado\n   - Escoliose funcional (corrigível)\n   - Pode causar sobrecarga no futuro\n\n3. **Assimetria compensatória** (secundária):\n   - Bacia desnivelada → compensa nos ombros\n   - Rotação de tronco → ombro parece mais alto\n\n**O que a IA de Visão Computacional identifica:**\n\n- **Quantifica a diferença**: 3mm? 10mm? 20mm?\n- **Mede alinhamento da bacia**: Está desnivelada?\n- **Avalia rotação de tronco**: Há torção?\n- **Identifica causa raiz**: Problema nos ombros ou compensação de baixo para cima?\n\n**Referências biomecânicas:**\n- ✅ Assimetria < 1cm: Geralmente normal, apenas característica individual\n- ⚠️ Assimetria 1-2cm: Monitorar, avaliar se há sobrecarga\n- 🚨 Assimetria > 2cm: Investigar causa, risco de dor/lesão\n\n💡 **Teste em casa:**\nPeça alguém para marcar a altura de cada ombro na parede (você de costas, relaxada). Meça a diferença. Quantos cm você encontrou?\n\n🤔 E a bacia, também percebe desnivelamento ou só nos ombros?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-quadril-rodado-ia',
    'post-assimetria-quadril-rodado',
    'ai-biomechanics',
    E'Sua preocupação é válida! **Rotação pélvica pode sim ter impactos funcionais e estéticos**, mas nem sempre é problemática 🔄\n\n**O que é rotação pélvica:**\n\nImagine a bacia como um volante de carro. Rotação = um lado (EIAS - espinha ilíaca) está mais à frente que o outro.\n\n**Impactos funcionais:**\n\n1. **Sobrecarga articular:**\n   - Quadril do lado rodado para frente: mais compressão\n   - Pode causar dor no futuro se não tratado\n   - Comum: dor unilateral (só um lado)\n\n2. **Compensações em cadeia:**\n   - Quadril → joelho → tornozelo\n   - Risco de lesões em joelho do lado sobrecarregado\n\n3. **Padrões de movimento alterados:**\n   - Agachamento assimétrico\n   - Marcha (caminhada) compensada\n\n**Impactos estéticos:**\n\n- Cintura parece "desigual" (um lado mais marcado)\n- Glúteo de um lado pode parecer mais caído\n- Silhueta lateral alterada\n\n**Como a IA biomecânica mede:**\n\n- Ângulo de rotação pélvica (em graus)\n- Comparação com padrão ideal (< 5° de rotação = normal)\n- Avaliação de compensações secundárias (joelho, tornozelo)\n\n**Valores de referência:**\n- ✅ Rotação < 5°: Normal, característica individual\n- ⚠️ Rotação 5-10°: Monitorar, pode precisar correção\n- 🚨 Rotação > 10°: Recomendado trabalho corretivo\n\n💭 **Teste funcional:**\nFaça um agachamento de frente para o espelho. Seus joelhos descem simétricos ou um vai mais para frente/lado?\n\n🤔 Você sente diferença de força/mobilidade entre as pernas?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-assimetria-direita-esquerda-ia',
    'post-assimetria-direita-esquerda',
    'ai-biomechanics',
    E'Pergunta FUNDAMENTAL! 🎯 **Todos temos assimetrias** - a questão é quando elas se tornam um problema.\n\n**Assimetrias normais vs. problemáticas:**\n\n**✅ Assimetrias NORMAIS (fisiológicas):**\n\n1. **Dominância lateral:**\n   - Lado dominante (direito em destros) pode ser 3-5% maior\n   - Comum em membros superiores (braços)\n   - Não causa dor, não limita função\n\n2. **Variações anatômicas:**\n   - Diferenças ósseas < 1cm\n   - Inserções musculares ligeiramente diferentes\n   - Sem impacto funcional\n\n**🚨 Assimetrias PROBLEMÁTICAS (patológicas):**\n\n1. **Diferença de força > 10-15%:**\n   - Indica sobrecarga/compensação\n   - Risco aumentado de lesão\n   - Precisa balanceamento\n\n2. **Diferença de volume muscular evidente:**\n   - Visível a olho nu (não só em medidas)\n   - Sugere desuso ou padrão motor alterado\n\n3. **Assimetria com dor/limitação:**\n   - Qualquer assimetria + dor = sinal de alerta\n   - Precisa investigação\n\n**Como a IA diferencia:**\n\n- **Mede percentual de diferença**: 3%? 8%? 15%?\n- **Compara com população saudável**: Você está dentro do esperado?\n- **Avalia padrões de movimento**: Há compensação funcional?\n- **Identifica causa**: Sobrecarga, desuso, padrão neuromotor?\n\n**Exemplo prático:**\n- Perna direita 5% maior + sem dor + força equilibrada = ✅ Normal\n- Perna direita 5% maior + dor joelho + fraqueza esquerda = 🚨 Problema\n\n💡 **Teste de força:**\nStiff unilateral (uma perna): você consegue fazer mesmo número de reps/mesma carga nas duas pernas?\n\n🤔 Qual a diferença? E há dor em algum lado?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-dor-lombar-sem-lesao-ia',
    'post-dor-lombar-sem-lesao',
    'ai-biomechanics',
    E'Seu médico está certo, mas vamos **traduzir** o que "dor lombar postural" significa biomecanicamente 💡\n\n**Dor lombar postural = Sobrecarga mecânica sem lesão estrutural**\n\n**Principais causas posturais identificáveis por IA:**\n\n1. **Hiperlordose lombar** (curvatura exagerada):\n   - Comprime facetas articulares posteriores\n   - Dor que piora em pé parada, melhora curvada\n   - Ângulo lombar > 45° (normal: 30-40°)\n\n2. **Retificação lombar** (perda da curvatura):\n   - Sobrecarga em discos (mais pressão anterior)\n   - Dor que piora sentada, melhora em pé\n   - Ângulo lombar < 20°\n\n3. **Desalinhamento pélvico:**\n   - Anteversão/retroversão excessiva\n   - Rotação/inclinação lateral\n   - Cria tensões assimétricas nos músculos lombares\n\n4. **Fraqueza de core:**\n   - Lombar "trabalha sozinha" para estabilizar tronco\n   - Sobrecarga muscular crônica\n   - Fadiga = dor\n\n**Como a IA biomecânica identifica:**\n\n- Mede ângulo de lordose lombar (graus)\n- Avalia inclinação/rotação pélvica\n- Identifica compensações (cifose torácica, anteriorização de cabeça)\n- Compara com padrão biomecânico ideal\n\n**Exemplo:**\nPaciente com lordose de 52° + anteversão pélvica de 18° → Sobrecarga de facetas articulares → Dor lombar baixa, pior ao ficar em pé.\n\n**Padrões de dor ajudam no diagnóstico:**\n- Dor piora em pé parada → Hiperlordose\n- Dor piora sentada → Retificação\n- Dor mais de um lado → Rotação/inclinação pélvica\n\n🤔 **Sua dor:**\nPiora mais em que posição? Em pé, sentada, ou ao acordar?\nÉ mais central ou mais de um lado?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-peso-pernas-ia',
    'post-dor-peso-pernas',
    'ai-biomechanics',
    E'Ótima pergunta! Pode ser **ambos** - circulação E postura frequentemente andam juntos 🔄\n\n**Como postura afeta "peso nas pernas":**\n\n1. **Desalinhamento pélvico → Sobrecarga assimétrica:**\n   - Um lado da bacia mais baixo/rodado\n   - Uma perna recebe mais peso corporal\n   - Sobrecarga → fadiga muscular → sensação de peso\n\n2. **Hiperlordose → Anteriorização do centro de gravidade:**\n   - Peso corporal desloca para frente\n   - Panturrilhas trabalham mais para manter equilíbrio\n   - Fadiga de panturrilha → dificulta retorno venoso → inchaço\n\n3. **Retificação lombar → Posteriorização:**\n   - Peso vai para calcanhares\n   - Isquiotibiais (posteriores de coxa) sobrecarregados\n   - Fadiga muscular + compressão venosa\n\n**Como postura e circulação se relacionam:**\n\n- **Postura ruim → Músculos fadigados → Bomba muscular ineficiente**\n- Músculos são responsáveis por "bombear" sangue venoso de volta ao coração\n- Se estão fadigados/tensos, bomba não funciona bem → inchaço\n\n**O que a IA biomecânica mostra:**\n\n- **Distribuição de peso:** Está simétrica?\n- **Centro de gravidade:** Anteriorizado? Posteriorizado?\n- **Alinhamento de membros inferiores:** Joelhos valgos/varos?\n\n**Teste prático:**\nFique descalça, olhando para frente. Sem pensar, onde você sente mais peso: dedos dos pés ou calcanhares? Perna direita ou esquerda?\n\n💡 **Sintomas que sugerem componente postural:**\n- ✅ Peso/inchaço ASSIMÉTRICO (uma perna pior)\n- ✅ Melhora ao deitar com pernas elevadas\n- ✅ Piora proporcional ao tempo em pé\n\n🤔 O peso/inchaço é igual nas duas pernas ou uma é pior?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  ),
  (
    'comment-dor-periodo-menstrual-ia',
    'post-dor-periodo-menstrual',
    'ai-biomechanics',
    E'**SIM, postura pode MUITO agravar dor lombar menstrual!** E você não está sozinha - estudos mostram forte correlação 🌙\n\n**Por que a dor lombar piora na menstruação:**\n\n1. **Fatores hormonais (base):**\n   - Prostaglandinas causam contrações uterinas\n   - Útero está na pelve, próximo à lombar\n   - Dor referida para região lombar\n\n2. **Como postura AGRAVA:**\n\n**Anteversão pélvica excessiva:**\n- Útero fica mais "solto" na cavidade pélvica\n- Mais mobilidade = mais sensibilidade a contrações\n- Hiperlordose lombar comprime facetas → DOR SOMADA\n\n**Desalinhamento pélvico:**\n- Tensões assimétricas em ligamentos uterinos\n- Músculos do assoalho pélvico desequilibrados\n- Durante menstruação (útero mais sensível) → essas tensões viram DOR\n\n3. **Inflamação sistêmica:**\n   - Menstruação aumenta inflamação geral\n   - Músculos lombares já sobrecarregados (por má postura) ficam ainda mais sensíveis\n   - Tensão muscular + inflamação = DOR INTENSA\n\n**O que a análise biométrica identifica:**\n\n- **Inclinação pélvica:** Anteversão excessiva?\n- **Tensão em psoas:** Músculo liga lombar ao quadril, quando tenso puxa vértebras\n- **Assimetrias pélvicas:** Criam tensões nos ligamentos uterinos\n\n**Padrão comum:**\nPaciente com anteversão de 16° + hiperlordose de 48° → Dor lombar CRÔNICA leve + DOR AGUDA intensa durante menstruação.\n\n**Sinais de componente postural:**\n- ✅ Dor lombar existe (leve) fora da menstruação\n- ✅ Piora MUITO durante menstruação\n- ✅ Posições específicas aliviam (fetal, 4 apoios)\n\n🤔 **Você sente dor lombar leve/desconforto FORA do período menstrual também?**\nE qual posição mais alivia durante a cólica?',
    true,
    'BIOMECHANICS_EXPERT',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. ATUALIZAR MÉTRICAS DAS ARENAS
-- ============================================

UPDATE "Arena"
SET
  "totalPosts" = 3,
  "totalComments" = 3,
  "updatedAt" = NOW()
WHERE slug IN ('postura-estetica', 'avaliacao-assimetrias', 'dor-funcao-saude');

-- ============================================
-- 6. VERIFICAÇÃO
-- ============================================

SELECT
  '✅ Script executado com sucesso!' as status,
  (SELECT COUNT(*) FROM "User" WHERE id IN ('system-biometria', 'ai-biomechanics')) as usuarios_criados,
  (SELECT COUNT(*) FROM "Arena" WHERE slug IN ('postura-estetica', 'avaliacao-assimetrias', 'dor-funcao-saude')) as arenas_criadas,
  (SELECT COUNT(*) FROM "Post" WHERE "arenaId" IN (SELECT id FROM "Arena" WHERE slug IN ('postura-estetica', 'avaliacao-assimetrias', 'dor-funcao-saude'))) as posts_criados,
  (SELECT COUNT(*) FROM "Comment" WHERE "postId" IN (SELECT id FROM "Post" WHERE "arenaId" IN (SELECT id FROM "Arena" WHERE slug IN ('postura-estetica', 'avaliacao-assimetrias', 'dor-funcao-saude')))) as comments_criados;

-- Lista as arenas criadas
SELECT
  slug,
  name,
  "totalPosts",
  "totalComments"
FROM "Arena"
WHERE slug IN ('postura-estetica', 'avaliacao-assimetrias', 'dor-funcao-saude')
ORDER BY slug;
