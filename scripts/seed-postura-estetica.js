require('dotenv').config();
const { randomUUID } = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: POSTURA & ESTÉTICA REAL
// Arena: postura-estetica
// 8 conversas × 4 posts = 32 posts
// Tema central: como postura e biomecânica afetam aparência
// ============================================================

const POSTS = [
  // ── CONVERSA 1: Barriga saliente por anteversão pélvica ──
  {
    userId: 'user_sim_004',
    content: `Sou magra (IMC 21), braços e pernas finos, mas minha barriga é SALIENTE. Parece que estou grávida de 3 meses. Já fiz déficit calórico agressivo e a barriga não some — só perdi mais músculo nos membros. Minha personal disse que pode ser postura (anteversão pélvica) e não gordura. Como saber a diferença? E se for postura, como corrigir?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, esse é um dos motivos mais comuns de frustração estética — e frequentemente o problema NÃO é gordura.\n\nTeste rápido: fique de pé de lado, coloque uma mão no osso do quadril (EIAS) e outra no sacro. Se a mão da frente está MUITO mais baixa que a de trás, é anteversão pélvica. Agora contraia glúteo e abdômen como se fosse "guardar" a barriga — se a barriga diminui visivelmente, é postural, não gordura.\n\nO que acontece biomecanicamente: os flexores de quadril (psoas e reto femoral) encurtados puxam a pelve pra frente, aumentando a lordose lombar. O abdômen é empurrado pra fora passivamente. Glúteo e abdômen fracos não conseguem contrabalancear. Resultado: barriga protusa mesmo com baixo percentual de gordura.\n\nIsso é a causa MAIS COMUM em mulheres jovens magras com barriga saliente. NÃO se resolve com déficit calórico — é biomecânica. Mais déficit numa pessoa com IMC 21 é perder músculo e piorar o problema.\n\nProtocolo de correção:\n\n• Alongamento do psoas — 3×30s cada lado, diário\n• Dead bug — 3×10 (foco em manter lombar colada no chão)\n• Ponte de glúteo com foco em retroversão pélvica — 3×12\n• Bird-dog — 3×8 cada lado\n• Prancha com retroversão — 3×20s\n\nTimeline realista: semanas 1-2 consciência corporal e propriocepção. Mês 1-2 melhora na postura estática. Mês 3-4 melhora visual significativa. O tratamento é exercício corretivo, não dieta.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `ERA EU. IMC 20, barriga saliente, fiz déficit até ficar com cara de doente e a barriga continuava. Uma fisioterapeuta identificou anteversão pélvica de 18 graus (normal é até 10-12). Fiz 3 meses de correção — dead bug religioso + alongamento de psoas + ponte de glúteo focando em retroversão. Minha barriga reduziu VISIVELMENTE sem perder 1 grama. Era postura o tempo todo. Anos de frustração resolvidos com biomecânica, não com dieta.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Complementando: no meu caso era COMBINAÇÃO. Anteversão pélvica + distensão abdominal por intolerância a FODMAP. Corrigi a postura E fiz dieta low FODMAP por 6 semanas. A barriga reduziu uns 70%. Então vale investigar os dois caminhos ao mesmo tempo — gastroenterologista + fisioterapeuta que entenda biomecânica. Uma dica visual: tira foto de lado relaxada, depois tira outra contraindo glúteo e abdômen forte. Se a diferença na barriga for drástica, é postura. Se for mínima, é gordura ou distensão.`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Protração de ombros / Upper Crossed Syndrome ──
  {
    userId: 'user_sim_009',
    content: `Meus ombros são muito pra frente e dá um aspecto de "corcunda" mesmo eu não sendo gorda. Em fotos de lado fico horrível. Já tentei "puxar os ombros pra trás" conscientemente mas em 5 minutos volto ao normal. Isso é cifose? Consigo corrigir com exercício ou preciso de colete postural?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, o que você descreve é protração de ombros — frequentemente combinada com cifose torácica aumentada. É extremamente comum e sim, exercício corrige. Colete postural NÃO funciona.\n\nO colete mantém ombros pra trás PASSIVAMENTE — os músculos que deveriam fazer isso ficam AINDA MAIS FRACOS. Quando tira, volta ou piora. É o equivalente a usar muleta quando você pode reabilitar a perna.\n\nO que está acontecendo — Upper Crossed Syndrome (Janda, 1979):\n\nMúsculos encurtados/hipertônicos: peitoral maior e menor, trapézio superior, esternocleidomastóideo, levantador da escápula.\n\nMúsculos fracos/inibidos: trapézio médio e inferior, romboides, serrátil anterior, flexores cervicais profundos.\n\nProtocolo:\n\nLIBERAR ENCURTADOS:\n• Pec stretch na porta — 3×30s cada lado\n• Foam roller torácico — 2 minutos diários\n• Auto-liberação de trapézio superior com bolinha\n\nFORTALECER FRACOS:\n• Face pull — 3×15 (o exercício mais importante)\n• Remada com retração escapular — 3×12\n• Y-T-W no banco inclinado — 2×10 cada posição\n• Band pull-apart — 3×15\n\nTimeline: semanas 1-4 melhora mobilidade torácica. Mês 2-3 fortalecimento visível, ombros começam a "ficar" mais pra trás. Mês 3-6 mudança postural automática — o novo padrão motor se estabelece.\n\nFace pulls + band pull-aparts são exercícios pra vida toda. Faça mesmo nos dias que não treinar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_002',
    content: `Face pull 3x/semana + foam roller torácico diário = transformação em 4 meses. Sério. Meus ombros paravam 3-4cm à frente da linha da orelha, agora estão quase alinhados. Joguei meu colete fora (gastei R$ 180 à toa naquilo). O face pull é o exercício mais subestimado da academia. E o melhor: minha dor no pescoço de anos também sumiu como bônus.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_015',
    content: `Dica de quem trabalha 10h no computador: coloquei um alarme a cada 45 minutos que diz "ESCÁPULAS". Faço 10 retrações escapulares + 5 chin tucks ali mesmo na cadeira. Leva 30 segundos. Isso + face pull no treino mudou minha postura em fotos de forma visível. Minha mãe que não me via há 3 meses comentou que eu parecia "mais alta". Era a postura.`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Assimetria de ombros e escoliose leve ──
  {
    userId: 'user_sim_006',
    content: `Minha fisioterapeuta disse que meu ombro direito é 2cm mais alto que o esquerdo. Nas fotos é visível. Ela falou em escoliose leve e me assustei. Isso afeta minha estética? Preciso corrigir? Treino musculação há 1 ano e nunca tinha percebido.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Patricia, 2cm de diferença entre ombros é mais comum do que imagina.\n\nLederman (2011) documentou: assimetrias posturais de até 1-3cm são encontradas em 85-95% da população assintomática. A maioria tem um ombro ligeiramente mais alto — geralmente o lado dominante.\n\nO corpo humano NÃO é simétrico — assim como seu rosto não é perfeitamente simétrico.\n\nQuando investigar com mais cuidado:\n• Dor associada à assimetria\n• Assimetria > 3cm e progressiva (aumentando)\n• Limitação funcional em movimentos\n\nSobre escoliose leve: escoliose funcional (postural) corrige quando você se inclina pra frente — os processos espinhosos se alinham. Escoliose estrutural leve (< 20° Cobb) raramente causa problemas funcionais ou estéticos significativos.\n\nO que a assimetria geralmente é na prática:\n• Dominância lateral — lado dominante mais desenvolvido\n• Trapézio superior mais hipertônico de um lado\n• Hábitos posturais — bolsa sempre no mesmo ombro, celular no mesmo ouvido\n• Diferença de ativação muscular lado a lado\n\nPara reduzir:\n• Exercícios unilaterais começando pelo lado fraco — 3 séries cada\n• Auto-liberação do trapézio do lado hipertônico\n• Farmer carry unilateral do lado mais baixo — 3×30s\n\nO que NÃO fazer: obcecar com simetria perfeita, parar de treinar por medo, gastar fortunas tentando "alinhar". 2cm de diferença é imperceptível para 99% das pessoas no dia a dia.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Passei por isso! Fui numa fisio que me mostrou 47 "problemas posturais" numa avaliação de 15 minutos. Saí de lá achando que estava toda torta e com MEDO de treinar. Fui em outra profissional que me disse: "você tem variações anatômicas normais, está sem dor, pode treinar normalmente com alguns ajustes unilaterais." A primeira queria vender 24 sessões. A segunda me devolveu a confiança.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `O exercício unilateral equilibrou minha assimetria de ombro visivelmente. Meu lado esquerdo era visivelmente menor. 6 meses de remada unilateral e desenvolvimento unilateral SEMPRE começando pelo esquerdo. Agora a diferença é mínima. A musculação bem feita é o melhor corretivo postural que existe.`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Anteriorização da cabeça (pescoço de tartaruga) ──
  {
    userId: 'user_sim_008',
    content: `Trabalho 9h no computador e meu pescoço vai cada vez mais pra frente. Parece "pescoço de tartaruga". Vi no espelho de lado e levei um susto — minha orelha está uns 5cm à frente do ombro. Tenho 30 anos e já pareço que tenho 50 de postura. Dor no pescoço constante. Consigo reverter ou já era?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Daniela, a anteriorização da cabeça é a epidemia postural do século XXI. E a boa notícia: é reversível na grande maioria dos casos.\n\nA biomecânica do problema: a cada centímetro que a cabeça avança à frente da linha de gravidade, o pescoço sustenta aproximadamente 4,5kg a mais de carga (Hansraj, 2014). Se está 5cm à frente, seu pescoço está sustentando cerca de 22kg extras. É como segurar uma bola de boliche com o braço esticado em vez de junto ao corpo.\n\nPor que acontece: tela do computador abaixo da linha dos olhos, uso de celular olhando pra baixo, cadeira sem suporte lombar adequado, cifose torácica que empurra cabeça compensatoriamente.\n\nApós meses ou anos: tecidos moles ADAPTAM — suboccipitais, ECM e escalenos encurtam. A posição anteriorizada se torna o "novo normal" do sistema nervoso.\n\nEncurtado/hipertônico: suboccipitais, esternocleidomastóideo, escalenos, peitoral menor.\nEnfraquecido: flexores cervicais profundos, trapézio inferior, extensores torácicos.\n\nProtocolo por níveis:\n\nNível 1 — Base (semanas 1-4):\n• Chin tuck diário — 10 reps, 5s cada\n• Ergonomia: topo da tela na altura dos olhos\n• Regra 20-20-20: a cada 20 minutos, olhar 20 segundos para algo a 20 pés\n\nNível 2 — Mobilidade (semanas 3-6):\n• Foam roller torácico — 2 minutos\n• Auto-liberação de suboccipitais com bola de tênis\n• Alongamento de ECM — 3×20s cada lado\n\nNível 3 — Fortalecimento (a partir da semana 4):\n• Chin tuck com resistência (banda) — 3×8 (o mais importante)\n• Face pull — 3×15\n• Y-raise — 3×10\n• Remada com retração — 3×12\n\nTimeline: semanas 1-2 pode haver leve aumento de desconforto (tecidos se adaptando). Mês 1 melhora mobilidade cervical. Mês 2-3 mudança postural visível. Mês 4-6 novo padrão automático.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `O chin tuck com resistência mudou meu jogo. Parece simples demais pra funcionar, mas os flexores cervicais profundos são os estabilizadores que ninguém treina. Em 6 semanas minha dor no pescoço de ANOS reduziu de 6/10 para 2/10 em escala de dor. E minha postura em fotos de lado mudou visivelmente. Meu namorado comentou que eu parecia "mais confiante". Era o pescoço voltando pro lugar.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_014',
    content: `Sobre ergonomia: gastei R$ 90 num suporte de notebook + R$ 60 num teclado externo. Melhor investimento em saúde que já fiz. Antes meu notebook ficava na mesa e eu passava 8h olhando pra BAIXO. Agora a tela está na altura dos olhos e meu pescoço agradece. Se você trabalha em casa, isso é OBRIGATÓRIO. Previne o problema na raiz.`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Valgo de joelho (pernas em X) e estética ──
  {
    userId: 'user_sim_012',
    content: `Tenho joelho valgo (pernas em X) desde criança. Meus joelhos se tocam mas os tornozelos não. Esteticamente me incomoda MUITO — fico horrível de shorts. Tenho 25 anos, já vi que o osso não muda depois de adulta. Existe ALGO que melhore pelo menos a aparência? Exercício muda alguma coisa ou vou ter que aceitar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Camila, vou ser honesta sobre o que muda e o que não muda — e depois te dar um plano para maximizar o que está no seu controle.\n\nO que NÃO muda (estrutural): após o fechamento das placas de crescimento (18-20 anos), o ângulo ósseo do fêmur e tíbia é fixo. Se o valgo é puramente estrutural, exercício não altera o osso.\n\nO que MUDA (funcional e muscular) — e é MUITO:\n\nValgo funcional vs estrutural: muitas mulheres têm um componente funcional significativo que se soma ao estrutural. Glúteo médio fraco permite rotação interna do fêmur. Adutores hipertônicos puxam joelho pra medial. Tibial posterior fraco causa pronação do pé que amplifica o valgo.\n\nHipertrofia estratégica para mudar o CONTORNO visual:\n• Quadríceps lateral (vasto lateral) bem desenvolvido preenche contorno externo da coxa\n• Glúteo médio bem desenvolvido preenche lateral do quadril\n• Panturrilha desenvolvida equilibra proporção da perna como um todo\n\nProtocolo:\n• Clamshell com banda — 3×20 (ativação de glúteo médio)\n• Monster walk — 3×15 passos cada direção\n• Single-leg glute bridge — 3×12 cada lado\n• Leg press com pés paralelos — 4×12\n• Abdução de quadril — 4×15\n• Short foot exercise — 3×15 (para pronação do pé)\n\nTimeline: 4-6 meses você perceberá valgo dinâmico reduzido (joelhos não colapsam em agachamento) e contorno lateral mais preenchido. O ângulo ósseo permanece, mas a silhueta muda.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: `Camila, eu tenho valgo estrutural E funcional. A parte funcional melhorou MUITO com monster walk + clamshell + agachamento com banda. Meus joelhos não colapsam mais no agachamento. A parte estrutural continua — meus joelhos ainda se tocam. MAS esteticamente melhorou porque vasto lateral e glúteo médio preencheram a silhueta. Não ficou "reto", mas ficou MUITO mais proporcional.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `Adendo sobre pronação do pé: fui numa podóloga e descobri que meu pé pronava excessivamente — empurrava joelho pra dentro — aumentava valgo funcional. Com uma palmilha de correção + short foot exercise, meu valgo DINÂMICO reduziu uns 30%. Vale investigar o pé antes de focar só no joelho. A cadeia cinética começa lá embaixo.`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Proporção ombro/quadril (ombros largos) ──
  {
    userId: 'user_sim_003',
    content: `Tenho ombros largos naturalmente e ODEIO. Pareço uma nadadora. Fico desproporcional porque meu quadril é estreito. Minha mãe diz pra eu parar de treinar ombro porque "vai alargar mais". Quero saber: treinar ombro alarga OSSO? E tem como disfarçar essa proporção com treino?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Roberta, treinar ombro NÃO alarga osso. Ponto.\n\nA clavícula tem comprimento fixo após o fechamento epifisário (por volta dos 18-20 anos, podendo ir até 25 na extremidade medial). Nenhum exercício altera comprimento ósseo.\n\nMas existe uma estratégia inteligente de treino para harmonizar proporções visuais.\n\nO que musculação faz no ombro: hipertrofia do deltóide pode acrescentar 1-3cm de largura muscular. Na maioria das mulheres com treino recreacional, esse acréscimo é modesto. Você NÃO vai desenvolver ombros de nadadora olímpica sem genética específica + volume absurdo + anos de treino.\n\nA estratégia correta: não é reduzir ombro (impossível) — é AUMENTAR quadril e glúteo. A proporção visual ombro/quadril é o que o olho humano percebe como "harmonia".\n\nPRIORIDADE — Hipertrofia de glúteo e quadril:\n• Hip thrust pesado — 4×8\n• Agachamento sumo — 4×12\n• Abdução com carga — 4×15\n• Búlgaro — 3×10 cada\n• Stiff — 4×10\nFrequência: 3-4x/semana\n\nOMBRO — treinar sim, mas com estratégia:\n• Reduzir volume de deltóide lateral para 6-8 séries/semana\n• Manter trapézio inferior/posterior — 8-10 séries/semana\n• Evitar elevação lateral pesada progressiva\n\nCOSTAS — costas bem desenvolvidas criam V invertido que, combinado com quadril largo, forma ampulheta visual.\n\nEm 6-12 meses de foco pesado em glúteo/quadril, a proporção muda significativamente. O ombro é o mesmo — o que muda é o equilíbrio visual.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: `Roberta, eu tenho ombro largo + quadril estreito também e a estratégia de investir em glúteo e coxa funcionou DEMAIS. Em 1 ano de foco pesado em posterior (hip thrust, stiff, búlgaro, abdução), meu quadril "encheu" e a proporção mudou visivelmente. O ombro é o MESMO — o que mudou foi a proporção. E não, meu ombro não ficou mais largo com treino moderado. Sua mãe está errada nessa.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Acrescento algo sobre autoimagem: quando eu odiava meus ombros, eu via OMBRO em toda foto. Depois que comecei a trabalhar a proporção e me sentir melhor com o corpo, percebi que ninguém além de mim nunca tinha comentado sobre meus ombros. A gente hiperanalisa o próprio corpo de um jeito que os outros simplesmente não fazem. O treino ajuda a estética E a relação com o espelho.`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Lordose lombar excessiva e impacto na silhueta ──
  {
    userId: 'user_sim_006',
    content: `Minha lombar tem uma curvatura exagerada — parece que estou empinando o bumbum de propósito, mas é minha postura natural. Quando fico muito tempo em pé, dói. E visualmente minha barriga fica projetada pra frente mesmo sendo magra. É hiperlordose? Exercício resolve ou preciso de tratamento específico?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Marina, o que você descreve é hiperlordose lombar — uma curvatura lombar acima dos 40-60° considerados fisiológicos. É muito mais comum em mulheres do que em homens, e tem relação direta com a estética da silhueta.\n\nPor que impacta a aparência:\n\nA lordose excessiva projeta o abdômen pra frente (mesmo sem gordura) e o glúteo pra trás de forma exagerada. Parece "bumbum empinado" mas é compensação — e frequentemente causa dor lombar por compressão das facetas articulares.\n\nCausas mais comuns:\n• Fraqueza de core profundo (transverso abdominal, multífido)\n• Encurtamento de flexores de quadril e eretores lombares\n• Glúteo máximo inibido — não estabiliza pelve em posição neutra\n• Uso prolongado de salto alto (desloca centro de gravidade)\n• Gestação prévia com diástase abdominal residual\n\nDiferença importante: anteversão pélvica e hiperlordose frequentemente coexistem mas são mecanismos diferentes. A anteversão "puxa" a pelve pra frente. A hiperlordose é o aumento da curva lombar em si. Geralmente um alimenta o outro.\n\nProtocolo:\n\nFASE 1 — Consciência e mobilidade (semanas 1-4):\n• Inclinação pélvica posterior (pelvic tilt) deitada — 3×15\n• Cat-cow focando em retroversão — 2 minutos\n• Alongamento de psoas em avanço — 3×30s cada lado\n• Alongamento de reto femoral — 3×30s cada lado\n\nFASE 2 — Fortalecimento (semanas 3-8):\n• Dead bug com progressão — 3×10\n• Ponte de glúteo com foco em achatar lombar — 3×12\n• Pallof press — 3×10 cada lado\n• Bird-dog — 3×8 cada lado\n\nFASE 3 — Integração funcional (mês 2+):\n• Agachamento com foco em posição pélvica neutra\n• Prancha com retroversão ativa — 3×20s\n• Stiff com consciência lombar\n\nTimeline: mês 1-2 redução de dor e melhora de consciência corporal. Mês 3-4 mudança visual na silhueta. Mês 6+ novo padrão postural mais estável.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: `Eu tinha hiperlordose + anteversão combinadas. Resultado: barriga pra frente, bumbum exageradamente empinado, e dor lombar crônica. O que mais me ajudou foi o dead bug FEITO CERTO — com lombar pressionada no chão o tempo todo. Parece fácil mas se fizer devagar e controlado, queima muito. Em 2 meses minha postura de pé mudou e a dor reduziu de 7/10 pra 2/10. Fisio disse que meus eretores lombares estavam hipertônicos e o transverso abdominal "dormindo".`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `Sobre o salto alto: trabalho de scarpin 5 dias/semana e minha lordose piorou muito nos últimos anos. Comecei a usar tênis no trajeto e trocar pra salto só no escritório. Nos dias de home office fico descalça. Só essa mudança + os exercícios de retroversão já melhoraram. A fisio explicou que o salto joga o peso pra frente e a lombar compensa curvando mais. Faz sentido biomecânico total.`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Pé plano/pronado afetando alinhamento e estética das pernas ──
  {
    userId: 'user_sim_007',
    content: `Tenho pé chato desde sempre. Nunca dei importância mas uma fisioterapeuta me disse que meu pé pronado está causando uma cascata: joelho rodando pra dentro, quadril compensando, e até minha lombar está sendo afetada. Visualmente minhas pernas parecem "tortas" quando fico de pé. Isso é real ou ela está exagerando pra vender sessões?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Larissa, ela NÃO está exagerando — a cadeia cinética ascendente do pé é real e bem documentada na literatura biomecânica.\n\nO pé é a BASE de toda a cadeia. Quando o arco medial colapsa (pé plano/pronado), a tíbia roda internamente. Isso puxa o fêmur em rotação interna e adução — criando valgo dinâmico de joelho. O quadril compensa com rotação do ilíaco, e a lombar pode aumentar lordose compensatória.\n\nPowers (2003) demonstrou que a pronação excessiva do pé correlaciona com aumento de 15-20% de rotação interna do fêmur. Não é teoria — é biomecânica mensurada.\n\nImpacto visual: pernas que parecem "tortas" ou em X, joelhos que colapsam ao agachar, tornozelos que "caem" pra dentro.\n\nDiagnóstico rápido: fique de pé e olhe seus tornozelos por trás (peça alguém pra tirar foto). Se o tendão de Aquiles faz uma curva pra dentro em vez de linha reta, há pronação excessiva.\n\nAbordagem de baixo pra cima:\n\nNÍVEL 1 — Pé (base):\n• Short foot exercise — 3×15 (ativar arco medial sem curvar dedos)\n• Towel scrunches — 3×20\n• Single leg balance em superfície instável — 3×30s\n\nNÍVEL 2 — Tornozelo e perna:\n• Elevação de panturrilha unilateral — 3×15 (foco em não pronar)\n• Tibial posterior com banda — 3×12\n• Mobilidade de dorsiflexão — foam roller na panturrilha + alongamento\n\nNÍVEL 3 — Quadril (topo da cadeia):\n• Clamshell — 3×20\n• Monster walk — 3×15\n• Agachamento com foco em "joelho pra fora" — 3×12\n\nSobre palmilha: pode ser útil como suporte ENQUANTO fortalece. Mas palmilha sem exercício é muleta permanente — o pé nunca aprende a se estabilizar sozinho.\n\nTimeline: 6-8 semanas para melhora funcional perceptível. 3-4 meses para mudança visual no alinhamento em pé.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_013',
    content: `Confirmo 100%. Tenho pé plano grau 2 e quando comecei short foot exercise + fortalecimento de tibial posterior, em 3 meses meu arco medial melhorou visivelmente. Meu valgo dinâmico de joelho reduziu e minhas pernas parecem mais "retas" quando fico de pé. O ortopedista ficou surpreso na reavaliação. Exercício funciona — mas tem que ser consistente e diário no começo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `Importante compartilhar: eu usei palmilha por 4 anos SEM fazer exercício nenhum. Quando tirava a palmilha, tudo voltava. Era dependência total. Minha nova fisio me tirou a palmilha gradualmente enquanto fortalecia o pé. Demorou 6 meses mas hoje fico sem palmilha e meu arco se sustenta. A palmilha era necessária no início, mas o objetivo é que o pé funcione sozinho. Não deixem virar muleta eterna.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('\n🏟️  SEED: POSTURA & ESTÉTICA REAL\n');

  // 1. Encontrar arena por slug
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .eq('slug', 'postura-estetica');

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada:', arenaError?.message || 'Nenhum resultado');
    return;
  }

  const arena = arenas[0];
  console.log(`✅ Arena: ${arena.name} | ID: ${arena.id} | Posts atuais: ${arena.totalPosts}`);

  // 2. Limpar posts antigos
  const { data: deleted } = await supabase
    .from('Post')
    .delete()
    .eq('arenaId', arena.id)
    .select('id');

  console.log(`🗑️  Posts antigos removidos: ${deleted?.length || 0}`);

  // 3. Inserir novos posts com timestamps incrementais
  const baseTime = new Date('2026-02-09T08:00:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 16 * 60 * 1000); // 16 min entre posts

    const { error: insertError } = await supabase.from('Post').insert({
      id: randomUUID(),
      arenaId: arena.id,
      userId: post.userId,
      content: post.content,
      isPublished: true,
      isPinned: false,
      isOfficial: post.isAIResponse,
      isAIResponse: post.isAIResponse,
      isUnderReview: false,
      isApproved: true,
      viewCount: Math.floor(Math.random() * 80) + 10,
      likeCount: post.isAIResponse
        ? Math.floor(Math.random() * 20) + 8
        : Math.floor(Math.random() * 15) + 2,
      commentCount: 0,
      isDeleted: false,
      createdAt: postTime.toISOString(),
      updatedAt: postTime.toISOString(),
    });

    if (insertError) {
      console.error(`❌ Erro no post ${i + 1}:`, insertError.message);
    } else {
      created++;
    }
  }

  console.log(`✅ ${created} posts criados`);

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
  console.log('\n🏟️  Arena Postura & Estética Real pronta! ✅\n');
}

main().catch(console.error);
