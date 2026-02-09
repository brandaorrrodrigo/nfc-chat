import { PrismaClient } from '../lib/generated/prisma';
import { v4 as cuid } from 'cuid';

const prisma = new PrismaClient();

// ============================================================
// SEED: Lipedema — Paradoxo do Cardio
// 32 posts em 8 conversas
// Foco: por que cardio tradicional pode piorar lipedema,
// exercícios aquáticos, impacto vs baixo impacto, inflamação,
// sistema linfático, musculação adaptada, caminhada, natação,
// HIIT vs LISS, compressão durante exercício
// ============================================================

const POSTS = [
  // ── CONVERSA 1: "Corro 5x/semana e minhas pernas só pioram" ──
  {
    userId: 'user_sim_008',
    content: `Fui diagnosticada com lipedema estágio 2 há 1 ano. Desde então tentei emagrecer correndo — comecei com 3x e aumentei pra 5x/semana, 40min cada. Meu tronco emagreceu mas minhas pernas estão PIORES. Mais inchadas, mais doloridas, com mais nódulos. Minha angiologista disse que o cardio de impacto pode estar piorando. Como assim exercício piora?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Camila, sua angiologista está correta. Esse é o **Paradoxo do Cardio no Lipedema** — um dos aspectos mais contraintuitivos e menos conhecidos dessa condição.

**Por que a corrida pode piorar o lipedema:**

O lipedema NÃO é gordura comum. É tecido adiposo **doente** — com inflamação crônica, fragilidade capilar, fibrose progressiva e comprometimento linfático. As regras que valem para gordura normal não se aplicam.

**1. Impacto repetitivo = microtrauma nos capilares frágeis:**
- No lipedema, os capilares sanguíneos e linfáticos são **estruturalmente frágeis**
- Cada passada na corrida gera impacto de **2-3x o peso corporal** nas pernas
- Esse impacto repetido causa microlesões nos capilares já comprometidos
- Resultado: mais extravasamento de líquido intersticial, mais edema, mais inflamação
- É por isso que suas pernas estão mais inchadas DEPOIS de correr

**2. Inflamação induzida pelo exercício de alto impacto:**
- Exercício intenso produz citocinas inflamatórias (IL-6, TNF-α) transitoriamente — em tecido saudável, isso é benéfico (adaptação)
- No tecido lipedematoso, que já está em estado inflamatório crônico, a inflamação adicional **agrava a fibrose** e a progressão da doença
- Cada sessão de corrida intensa adiciona inflamação a um sistema que não consegue resolvê-la adequadamente

**3. Sobrecarga do sistema linfático:**
- O exercício aumenta a produção de linfa em **até 10-15x**
- No lipedema, a drenagem linfática já está comprometida
- Mais linfa produzida + drenagem insuficiente = acúmulo = inchaço pós-exercício que demora a resolver
- Com o tempo, a sobrecarga crônica pode levar à **lipolinfedema** (combinação de lipedema + linfedema)

**4. O paradoxo do emagrecimento seletivo:**
- A gordura lipedematosa é **resistente à lipólise** — ela não responde normalmente aos hormônios que mobilizam gordura (catecolaminas)
- Quando você cria déficit calórico com corrida, o corpo mobiliza gordura de onde CONSEGUE: tronco, braços, rosto
- As pernas não respondem → a desproporção AUMENTA
- Isso não é falha sua — é a fisiopatologia da doença

**O que NÃO significa:**
- NÃO significa "não faça exercício" — exercício é fundamental no manejo do lipedema
- Significa que o TIPO de exercício precisa ser adaptado à condição

Nas próximas conversas da arena vamos cobrir quais exercícios SÃO seguros e benéficos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `MEU DEUS, é exatamente isso que acontece comigo. Faço spinning 4x/semana, meu rosto tá magro, braços finos, e as pernas parecem que estão cada vez maiores. E depois do spinning ficam vermelhas, quentes e doloridas por horas. Achava que era "normal" do exercício.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: `Patricia, idêntico ao meu caso. A vermelhidão e calor pós-exercício nas pernas é sinal de inflamação local. Nenhum profissional de educação física me explicou isso até a angiologista alertar. Precisamos parar e repensar.`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Exercícios aquáticos — o padrão-ouro ──────
  {
    userId: 'user_sim_007',
    content: `Se corrida e spinning fazem mal, o que posso fazer? Minha vascular recomendou exercícios na água. Mas nadar não é cardio também? Qual a diferença?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, exercícios aquáticos são considerados o **padrão-ouro** para lipedema por razões fisiológicas específicas que nenhum exercício terrestre consegue replicar.

**Por que a água é terapêutica no lipedema:**

**1. Pressão hidrostática:**
- A água exerce pressão progressiva no corpo (maior na profundidade)
- Essa pressão funciona como uma **compressão natural 360°**
- Efeito direto: reduz edema, melhora retorno venoso e linfático
- Em imersão até o peito, a pressão hidrostática é equivalente a ~20-30mmHg — similar a uma meia de compressão terapêutica

**2. Zero impacto:**
- Na água, o corpo "pesa" ~10% do peso terrestre (em imersão até o pescoço)
- Zero impacto = zero microtrauma nos capilares frágeis
- Sem impacto = sem gatilho inflamatório adicional nos tecidos lipedematosos

**3. Drenagem linfática passiva:**
- A pressão da água + movimentos suaves criam um efeito de **bombeamento linfático natural**
- A cada movimento, a água massageia os tecidos e auxilia na drenagem
- Esse efeito não existe em nenhum exercício terrestre

**4. Resistência multidirecional sem sobrecarga articular:**
- A água oferece resistência em TODAS as direções de movimento
- Quanto mais rápido o movimento, mais resistência — autoregulável
- Fortalecimento muscular sem carga compressiva articular

**Melhores exercícios aquáticos para lipedema:**

**Tier 1 — Máximo benefício:**
- **Hidroginástica terapêutica** (ideal: com profissional que entenda lipedema)
- **Deep water running** (corrida em águas profundas com colete flutuador) — simula corrida sem NENHUM impacto
- **Natação** (estilos de menos impacto: costas e crawl > peito)

**Tier 2 — Excelente:**
- **Aqua cycling** (bicicleta ergométrica dentro d'água)
- **Caminhada na piscina** (em profundidade de cintura a peito)

**Frequência recomendada:**
- 3-5x/semana, 30-45 minutos
- Temperatura ideal da água: **28-30°C** (morna — nem fria demais que cause vasoconstrição, nem quente que aumente vasodilatação/edema)
- Evite piscinas muito aquecidas (>32°C) — calor piora o edema

**Resultados esperados:**
- Redução de edema perceptível já nas primeiras semanas
- Melhora de dor e sensação de peso nas pernas
- Condicionamento cardiovascular sem progressão da doença
- Melhora da mobilidade articular

A diferença entre nadar e correr no lipedema não é sobre intensidade — é sobre o **ambiente mecânico**. A água protege os tecidos frágeis enquanto permite exercício eficaz.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Comecei deep water running 3x/semana há 4 meses. A diferença é gritante — minhas pernas desincharam visivelmente, a dor reduziu uns 70%, e perdi medidas no tronco sem agravar as pernas. Melhor decisão que tomei desde o diagnóstico.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `A explicação da pressão hidrostática como "compressão natural" fez o clique. Vou procurar uma academia com piscina e aula de hidroginástica. Existe algo específico que devo informar ao professor sobre o lipedema?`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Musculação com lipedema — pode ou não? ────
  {
    userId: 'user_sim_016',
    content: `Minha fisioterapeuta disse pra fazer musculação leve pra pernas. Mas minha cirurgiã vascular disse pra não treinar pernas pesado. As informações se contradizem e tô confusa. Musculação piora ou ajuda o lipedema?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Daniela, as duas profissionais estão parcialmente certas — a questão é no **como**. Musculação pode ser muito benéfica no lipedema, MAS precisa de adaptações específicas.

**Por que musculação AJUDA no lipedema:**

**1. Bomba muscular:**
- A contração muscular é o principal mecanismo de **retorno venoso e linfático** nos membros inferiores
- Músculos mais fortes = bomba muscular mais eficiente = melhor drenagem
- A longo prazo, musculação consistente MELHORA a capacidade de drenagem das pernas

**2. Preservação/ganho de massa muscular:**
- Lipedema + dieta = risco alto de perda muscular
- Músculo sob o tecido lipedematoso melhora a sustentação e aparência
- Massa muscular aumenta TMB → ajuda no controle de peso geral

**3. Sensibilidade insulínica:**
- Muitas mulheres com lipedema têm resistência insulínica associada
- Musculação melhora GLUT-4 e captação de glicose

**Por que musculação PESADA DEMAIS pode prejudicar:**

**1. Aumento de pressão intra-abdominal e intravascular:**
- Cargas muito altas + manobra de Valsalva → pico de pressão venosa nas pernas
- Em capilares já frágeis, isso causa extravasamento e edema agudo
- É por isso que depois de treino de pernas pesado, mulheres com lipedema frequentemente relatam pernas "balão"

**2. DOMS excessivo:**
- Dano muscular excessivo gera resposta inflamatória local
- No tecido lipedematoso, inflamação adicional = piora

**Protocolo de musculação adaptada para lipedema:**

**Membros inferiores — REGRAS:**
- **Cargas moderadas**: 50-65% de 1RM (NÃO treino de força máxima)
- **Repetições altas**: 15-20 reps por série
- **Cadência controlada**: 3s excêntrica, 1s concêntrica (mais tempo sob tensão com menos carga)
- **Séries moderadas**: 2-3 séries por exercício
- **Sem Valsalva**: respiração contínua — expire no esforço
- **SEMPRE com meia de compressão** durante o treino (mínimo 20-30mmHg)

**Exercícios recomendados para pernas:**
- Leg press (ângulo 45° — sem flexão excessiva do quadril)
- Extensora e flexora (isolados, carga moderada)
- Agachamento com peso corporal ou carga leve
- Ponte de glúteo (excelente: baixo impacto, alta ativação)
- Panturrilha sentada (bomba muscular direta)

**Exercícios a evitar/adaptar:**
- Agachamento pesado com barra
- Terra pesado (pressão intra-abdominal muito alta)
- Pliometria (saltos — impacto)
- Box jumps, burpees, qualquer coisa com impacto repetido

**Membros superiores e core:**
- Sem restrições significativas — treine normalmente
- Aproveite para intensificar tronco/braços enquanto modera pernas

**Pós-treino:**
- Elevação das pernas por 10-15 min
- Se possível, drenagem linfática manual ou pressoterapia
- Compressa fria (10-15 min) se sentir calor/inchaço nas pernas

A regra geral: **musculação SIM, mas com inteligência**. O objetivo é bomba muscular e fortalecimento, não destruição muscular máxima.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_020',
    content: `Treino assim há 1 ano — carga moderada, reps altas, sempre com meia 20-30mmHg. Minha circulação melhorou muito e o inchaço pós-treino é mínimo. A chave é a compressão durante o treino e NÃO tentar treinar pernas como se não tivesse lipedema.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `Agora faz sentido! A fisio disse "leve" e a vascular disse "não pesado" — basicamente as duas queriam dizer moderado com adaptações. Vou imprimir esse protocolo e levar pro meu personal. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Caminhada — a aliada subestimada ──────────
  {
    userId: 'user_sim_001',
    content: `Não tenho acesso a piscina nem academia. Caminhada serve pra quem tem lipedema? Ou é considerado "impacto" igual corrida? É a única coisa que consigo fazer no momento.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ana Paula, caminhada é **excelente** para lipedema e é provavelmente o exercício mais acessível e subestimado para essa condição.

**Caminhada vs Corrida — por que são completamente diferentes no lipedema:**

**Impacto:**
- Corrida: **2-3x** o peso corporal a cada passada
- Caminhada: **1,0-1,5x** o peso corporal
- Essa diferença é enorme para capilares frágeis — o limiar entre benéfico e danoso está exatamente aí

**Ativação da bomba muscular:**
- Caminhada ativa ritmicamente a **bomba muscular da panturrilha** (o "segundo coração")
- Cada passo: panturrilha contrai → comprime veias e vasos linfáticos → empurra fluido de volta
- Esse bombeamento rítmico e de baixa intensidade é exatamente o que o sistema linfático comprometido precisa

**Intensidade inflamatória:**
- Caminhada moderada é **anti-inflamatória** (reduz IL-6 crônico, aumenta IL-10 anti-inflamatória)
- Corrida intensa é pró-inflamatória transitoriamente — no lipedema, esse "transitoriamente" pode se somar à inflamação crônica

**Protocolo de caminhada otimizado para lipedema:**

**Frequência e duração:**
- **Diariamente** se possível (ou mínimo 5x/semana)
- 30-45 minutos por sessão
- Intensidade: conversar confortavelmente — se não consegue falar frases completas, está rápido demais

**Obrigatório:**
- **Meia de compressão** durante toda a caminhada (20-30mmHg para estágio 1-2, 30-40mmHg para estágio 3)
- A compressão durante a caminhada potencializa o efeito da bomba muscular em **até 40-50%**
- Sem compressão, parte do benefício se perde porque o fluido bombeado refaz o extravasamento

**Terreno:**
- Superfície plana e regular (evite trilhas irregulares — risco de torção + impacto variável)
- Grama é melhor que asfalto (absorve mais impacto)
- Esteira com amortecimento é excelente opção indoor

**Calçado:**
- Tênis com bom amortecimento (absorção de impacto)
- Evitar calçados rígidos ou rasos

**Horário:**
- Manhã é ideal (cortisol naturalmente mais alto = menos retenção)
- Evitar horários de calor intenso (calor piora edema)

**Pós-caminhada:**
- Eleve as pernas 10-15 min (acima do nível do coração)
- Mantenha a meia de compressão por pelo menos 30 min após

**O que esperar:**
- Primeiras 2-4 semanas: redução de peso/inchaço nas pernas ao final do dia
- 1-3 meses: melhora de dor, menos nódulos sensíveis, mais energia
- Longo prazo: melhor manejo da condição, desaceleração da progressão

Ana Paula, caminhada com compressão é a base do manejo de lipedema. Não subestime por ser "simples" — é mais terapêutico do que spinning ou corrida para quem tem essa condição.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Comecei caminhando 30min/dia com meia 20-30mmHg e em 6 semanas minhas pernas já estavam visivelmente menos inchadas ao final do dia. É simples, é grátis e funciona. A compressão durante a caminhada faz TODA a diferença — sem a meia o resultado é muito menor.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Que ótimo! Já caminho mas nunca uso a meia de compressão durante. Vou começar a usar amanhã. E vou trocar o horário do meio-dia (sol forte) pra manhã cedo. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: HIIT, CrossFit e exercícios de impacto ───
  {
    userId: 'user_sim_009',
    content: `Minha personal quer que eu faça HIIT e circuito funcional com burpees, box jumps e kettlebell swing. Ela diz que "queima mais gordura". Tenho lipedema estágio 1. Devo fazer ou recusar? Não quero ser a "paciente difícil" mas tô preocupada.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Bruno, nesse caso você precisa SIM recusar esses exercícios específicos. Isso não é ser "paciente difícil" — é proteger seu corpo de uma condição que a maioria dos profissionais de educação física não conhece.

**HIIT e exercícios de alto impacto no lipedema — análise por exercício:**

**🔴 CONTRAINDICADOS (alto risco):**

**Burpees:**
- Combina impacto de salto + queda + posição invertida
- Cada repetição: impacto de ~3-5x o peso corporal
- Microtrauma capilar garantido em tecido lipedematoso

**Box jumps:**
- Impacto na aterrissagem: **4-6x** o peso corporal
- Risco altíssimo para capilares frágeis
- Também risco de lesão articular (lipedema compromete propriocepção)

**Jump squats / Pliometria:**
- Mesmo problema — impacto repetido de alta magnitude
- Contraindicação clara em lipedema de qualquer estágio

**🟡 ADAPTAR COM CUIDADO:**

**Kettlebell swing:**
- O swing em si não tem impacto, mas gera pico de pressão intra-abdominal
- Pode ser feito com carga LEVE e foco em técnica
- Alternativa: hip thrust ou ponte de glúteo (mesma musculatura, sem pressão intra-abdominal)

**HIIT no conceito (alta intensidade intervalada):**
- O PROBLEMA não é a alta intensidade em si — é o TIPO de exercício
- HIIT de baixo impacto é possível: bike ergométrica, remo, elíptico
- O que não pode: HIIT com saltos, corrida, impacto repetido

**🟢 SEGUROS E EFICAZES (podem substituir):**

**Cardio de alta intensidade sem impacto:**
- Bicicleta ergométrica com intervalos (30s forte / 60s leve)
- Remo ergômetro (excelente condicionamento, zero impacto nas pernas)
- Elíptico (simula corrida sem impacto)
- Natação intervalada

**Circuito funcional adaptado:**
- Agachamento com peso corporal (sem salto)
- Remada com banda elástica
- Prancha e variações de core
- Ponte de glúteo
- Battle ropes (braços — excelente cardio de alta intensidade sem impacto nos MMII)

**Como conversar com sua personal:**
Sugiro ser direta: *"Tenho lipedema, uma condição que torna meus capilares frágeis. Exercícios de impacto pioram a doença. Preciso de alternativas sem saltos e sem impacto repetido nas pernas. Podemos adaptar o programa?"*

Se a profissional não conhecer lipedema ou insistir que "todo mundo pode fazer burpee", considere buscar alguém com experiência em patologias vasculares/linfáticas. Sua saúde vem primeiro.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Passei por isso — minha personal insistia em HIIT com saltos. Depois de 2 meses, minhas pernas estavam visivelmente piores. Troquei de profissional e encontrei uma que conhece lipedema. Faz TODA a diferença ter alguém que entende a condição.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `Vou ter essa conversa com ela essa semana. Se não se adaptar, troco. A classificação por cores (verde/amarelo/vermelho) ficou super clara. Vou sugerir o circuito adaptado com bike, remo e battle ropes.`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Compressão durante exercício ──────────────
  {
    userId: 'user_sim_020',
    content: `Minha médica insiste que eu use meia de compressão PRA TREINAR. Mas é super desconfortável, quente e apertada durante o exercício. Faz tanta diferença assim? Posso treinar sem e colocar depois?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Beatriz, entendo o desconforto — mas sua médica está certa e esse é um dos pontos onde a evidência é mais clara.

**Por que compressão DURANTE o exercício é fundamental no lipedema:**

**O que acontece durante exercício SEM compressão:**
- Exercício aumenta fluxo sanguíneo para os músculos ativos em **até 20x**
- Nos capilares frágeis do lipedema, o aumento de pressão intravascular causa **extravasamento** de fluido para o interstício
- A bomba muscular empurra fluido para cima, mas sem contenção externa, parte do fluido refaz o extravasamento
- Resultado líquido: pernas mais inchadas DEPOIS do treino do que antes

**O que acontece COM compressão:**
- A compressão cria uma **contrapressão externa** que se opõe ao extravasamento capilar
- O bombeamento muscular é potencializado: a meia funciona como "parede" contra a qual o músculo comprime os vasos
- Menos extravasamento + drenagem mais eficiente = redução de edema pós-exercício
- Estudos em insuficiência venosa crônica (condição vascular semelhante) mostram que compressão durante exercício **melhora drenagem em ~40-50%** vs sem compressão

**Colocar depois NÃO substitui:**
- O dano (extravasamento) ocorre DURANTE o exercício
- Colocar a meia depois trata o edema que já se formou, mas não previne a formação
- Prevenção > tratamento

**Como tornar mais tolerável:**

**1. Tipo correto de meia:**
- Para exercício: prefira **meias de compressão esportivas** (tecido mais respirável, com wicking de umidade)
- Marcas como Sigvaris, Venosan e Juzo têm linhas esportivas
- Meias de algodão grosso são mais quentes — meias de microfibra/nylon são mais frescas

**2. Compressão adequada (não excessiva):**
- Para exercício: **20-30mmHg** costuma ser suficiente e mais confortável
- 30-40mmHg é para uso terapêutico pesado — pode ser excessivo durante exercício

**3. Modelo:**
- Meia 3/4 (abaixo do joelho) é geralmente suficiente para exercício e mais fácil de tolerar
- Se o lipedema afeta coxas: meia-calça ou meia 7/8

**4. Temperatura:**
- Treine em ambientes climatizados quando possível
- Exercícios aquáticos eliminam o problema (a água É a compressão)
- Nos dias quentes: prefira horários mais frescos

**5. Adaptação:**
- As primeiras 2-3 semanas são as piores
- Depois o corpo se adapta e a maioria relata que "nem lembra que está usando"
- O alívio pós-treino (pernas menos inchadas e doloridas) reforça positivamente o uso

**Investimento que vale:**
Uma boa meia esportiva de compressão custa R$ 80-200 e dura ~6 meses com uso frequente. É o acessório mais custo-efetivo no manejo do lipedema.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `Treino há 8 meses sempre com meia de compressão 20-30mmHg e posso confirmar: nas vezes que esqueci, a diferença foi BRUTAL. Com meia, saio do treino com pernas leves. Sem meia, saio inchada e dolorida. Não treino mais sem.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Ok, convencida. Vou investir numa meia esportiva de microfibra 20-30mmHg em vez de usar a meia grossa prescrita que é insuportável no calor. A dica do modelo esportivo pode resolver meu problema com desconforto.`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Yoga e pilates no lipedema ────────────────
  {
    userId: 'user_sim_002',
    content: `Yoga e pilates seriam bons pra quem tem lipedema? Gosto dessas modalidades mas não sei se ajudam ou se é "perda de tempo" comparado com musculação e natação. Tenho estágio 1.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, tanto yoga quanto pilates têm benefícios reais e específicos no lipedema que vão além do que musculação e cardio oferecem. Não é "perda de tempo" — é um **complemento terapêutico** valioso.

**Yoga no lipedema — benefícios específicos:**

**1. Ativação do sistema linfático:**
- Posturas invertidas (pernas pra cima) usam a **gravidade a favor** da drenagem linfática
- Viparita Karani (pernas na parede) é quase uma "drenagem linfática gravitacional passiva"
- Twists suaves comprimem e liberam tecidos → efeito de bombeamento linfático

**2. Respiração diafragmática:**
- O diafragma é a **bomba linfática mais poderosa** do corpo
- Cada respiração diafragmática profunda cria pressão negativa no ducto torácico → puxa linfa dos membros inferiores
- Pranayama (técnicas respiratórias do yoga) treinam essa bomba diretamente
- Efeito: melhora global da drenagem linfática, redução de inchaço

**3. Redução de cortisol e estresse:**
- Yoga regular reduz cortisol em **~15-25%** (meta-análise de 42 estudos)
- Cortisol alto piora inflamação e retenção — no lipedema, isso é especialmente relevante
- Redução do estresse = redução da inflamação sistêmica

**4. Mobilidade e propriocepção:**
- Lipedema pode comprometer propriocepção nos membros inferiores
- Yoga trabalha equilíbrio e consciência corporal

**Posturas especialmente benéficas:**
- Viparita Karani (pernas na parede) — 5-10 min diários
- Supta Baddha Konasana (borboleta deitada) — abertura do quadril, drenagem inguinal
- Cat-Cow (gato-vaca) — mobilidade + respiração diafragmática
- Twists suaves deitada — compressão/descompressão linfática

**Posturas a evitar/modificar:**
- Evitar permanência prolongada em pé (>2 min) em postura única — aumenta edema gravitacional
- Evitar posturas que comprimam excessivamente a região inguinal (nódulos linfáticos)

**Pilates no lipedema:**

**Benefícios:**
- Fortalecimento de core e estabilidade pélvica (fundamental)
- Trabalho de cadeia cinética controlada
- Low-impact por natureza
- Reformer é especialmente bom: resistência com molas (sem carga gravitacional pesada)

**Preferência:**
- **Pilates no Reformer** > solo (mais controle de carga, mais variação, menos impacto)
- Mat pilates é bom mas limitado para MMII com lipedema

**Protocolo semanal ideal combinado:**
- Musculação adaptada: 2-3x/semana
- Aquático: 2-3x/semana
- Yoga ou Pilates: 1-2x/semana
- Caminhada com compressão: diariamente

Não pense em "ou" — pense em **combinação**. Cada modalidade contribui de forma diferente para o manejo do lipedema.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `A Viparita Karani (pernas na parede) virou meu ritual noturno — 10 minutos todo dia antes de dormir. A redução de inchaço ao final do dia é perceptível. É tão simples que parece que não funciona, mas funciona demais.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `Que bom saber que não é perda de tempo! A explicação do diafragma como bomba linfática me surpreendeu. Vou manter meu yoga 2x/semana e adicionar natação. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Programa semanal completo para lipedema ───
  {
    userId: 'user_sim_012',
    content: `Depois de ler tudo nessa arena, quero montar um programa semanal completo. Tenho lipedema estágio 2, acesso a piscina, academia e faço yoga. Alguém pode me ajudar a organizar tudo isso?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Roberta, excelente iniciativa. Vamos montar um programa semanal completo baseado em tudo que discutimos, adaptado para estágio 2.

**PROGRAMA SEMANAL — LIPEDEMA ESTÁGIO 2**

**SEGUNDA — Musculação adaptada (membros superiores + core)**
- Aquecimento: 10 min bike ergométrica (sem impacto)
- Supino máquina/halteres: 3x12
- Remada máquina/cabo: 3x12
- Desenvolvimento ombros: 3x12
- Bíceps + tríceps: 2x15 cada
- Core: prancha 3x30s + dead bug 3x10 cada lado
- ⚡ Sem restrição de carga para tronco — treine normalmente
- 🧦 Meia de compressão: recomendável mas não obrigatória

**TERÇA — Aquático (pool day)**
- Deep water running ou hidroginástica: 40-45 min
- Se natação: crawl ou costas, ritmo moderado, 30-40 min
- 🧦 Compressão: não necessária na água (a água é a compressão)

**QUARTA — Musculação adaptada (membros inferiores)**
- Ativação: ponte de glúteo sem carga 2x15, clamshell 2x15
- Leg press 45°: 3x15-20 (carga moderada — 50-60% do que conseguiria)
- Extensora: 3x15
- Flexora: 3x15
- Panturrilha sentada: 3x20 (bomba muscular!)
- Ponte de glúteo com carga: 3x15
- Abdução máquina: 3x15
- ⚡ Cadência lenta: 3s descida, 1s subida
- 🧦 Meia de compressão: **OBRIGATÓRIA** (20-30mmHg)
- Pós-treino: elevar pernas 10-15 min

**QUINTA — Aquático**
- Mesma estrutura de terça (pode variar modalidade)
- Se disponível: aqua cycling é excelente variação

**SEXTA — Musculação (misto + circuito leve)**
- Circuito de baixo impacto:
  - Battle ropes: 3x30s (cardio intenso sem impacto nos MMII)
  - Remada no TRX: 3x12
  - Agachamento com peso corporal: 3x15
  - Prancha lateral: 2x20s cada lado
  - Ponte de glúteo unilateral: 2x12 cada
- 🧦 Meia de compressão: **OBRIGATÓRIA**

**SÁBADO — Yoga/Pilates**
- Sessão de 45-60 min focada em:
  - Respiração diafragmática (5 min)
  - Posturas invertidas (Viparita Karani)
  - Twists suaves
  - Mobilidade de quadril
  - Relaxamento final com pernas elevadas

**DOMINGO — Caminhada + descanso ativo**
- 30-40 min de caminhada leve em superfície plana
- 🧦 Meia de compressão: sim
- À noite: pernas na parede 10 min

**REGRAS GERAIS DO PROGRAMA:**
- **Compressão**: em TODA atividade terrestre de MMII
- **Hidratação**: mínimo 2L/dia (sistema linfático precisa de hidratação)
- **Pós-treino de pernas**: sempre elevar 10-15 min
- **Monitore**: se as pernas ficarem mais inchadas, doloridas ou com hematomas novos → reduza intensidade
- **Drenagem linfática manual**: se possível, 1-2x/semana (complementa tudo)
- **Progressão**: aumente carga/duração em **no máximo 10% por semana**

**Expectativas realistas para estágio 2:**
- Mês 1-2: redução de edema, melhora de dor, mais energia
- Mês 3-6: melhora visível de contorno, menos nódulos sensíveis, melhor mobilidade
- Longo prazo: desaceleração significativa da progressão da doença

Lipedema não tem cura, mas um programa de exercícios bem desenhado é uma das intervenções mais poderosas para **controlar a progressão e melhorar qualidade de vida**.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `Esse programa é ouro! Já salvei e vou imprimir. A divisão entre dias de tronco (sem restrição) e pernas (adaptado com compressão) faz muito sentido. E ter 2 dias aquáticos na semana é o ideal que minha vascular recomendou.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Perfeito! Vou começar na segunda. A clareza de saber exatamente o que fazer cada dia tira a ansiedade de "será que tô fazendo certo?". Obrigada por compilar tudo numa estrutura prática! 💜`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🏟️  SEED: LIPEDEMA — PARADOXO DO CARDIO');
  console.log('');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'lipedema', mode: 'insensitive' } },
          { name: { contains: 'lipedema', mode: 'insensitive' } },
          { slug: { contains: 'paradoxo', mode: 'insensitive' } },
          { name: { contains: 'paradoxo', mode: 'insensitive' } },
        ],
      },
    });

    if (!arena) {
      console.log('❌ Arena não encontrada. Arenas disponíveis:');
      const allArenas = await prisma.arena.findMany({
        select: { slug: true, name: true },
        orderBy: { name: 'asc' },
      });
      allArenas.forEach(a => console.log(`  - ${a.slug} | ${a.name}`));
      return;
    }

    console.log(`✅ Arena encontrada: "${arena.name}" (${arena.slug})`);
    console.log(`   Posts atuais: ${arena.totalPosts}`);
    console.log('');

    // Limpar posts existentes
    console.log('🗑️  Limpando posts antigos...');
    await prisma.post.deleteMany({
      where: { arenaId: arena.id },
    });

    // Inserir novos posts
    console.log(`📝 Inserindo ${POSTS.length} posts...\n`);
    const baseTime = new Date('2025-01-28T08:15:00Z');

    for (let i = 0; i < POSTS.length; i++) {
      const post = POSTS[i];
      const postTime = new Date(baseTime.getTime() + (i * 18 * 60 * 1000));

      await prisma.post.create({
        data: {
          id: cuid(),
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

      const label = post.isAIResponse ? '🤖 IA' : `👤 ${post.userId}`;
      console.log(`  ✅ Post ${(i + 1).toString().padStart(2)}/${POSTS.length} — ${label}`);
    }

    // Atualizar contador
    const count = await prisma.post.count({
      where: {
        arenaId: arena.id,
        isDeleted: false,
      },
    });

    await prisma.arena.update({
      where: { id: arena.id },
      data: { totalPosts: count },
    });

    console.log(`\n🎉 Concluído! ${count} posts na arena "${arena.name}"`);
  } catch (error) {
    console.error('❌ Erro fatal:', (error as any).message || error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
