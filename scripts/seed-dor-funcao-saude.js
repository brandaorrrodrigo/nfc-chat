require('dotenv').config();
const { randomUUID } = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: DOR, FUNÇÃO & SAÚDE POSTURAL
// 40 posts | 8 conversas (5 posts cada)
// Foco: dor lombar, cervicalgia home office, ciática, ombro,
// joelho, formigamento, pernas pesadas — triagem com red flags,
// relação postura-dor-função, quando investigar vs quando treinar
// ============================================================

const POSTS = [

  // ============================================================
  // CONVERSA 1: Dor lombar ao acordar — causas e o que fazer
  // ============================================================
  {
    userId: 'user_sim_002', // Juliana Santos
    content: `Acordo todo dia com dor lombar. Demora uns 20-30 minutos pra "soltar" e aí melhora. Não machucquei nada, não tive trauma. Meu colchão tem 3 anos. O que pode ser? Devo fazer exame?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, dor lombar matinal que melhora com movimento é um dos padrões mais comuns e geralmente NÃO indica patologia grave. Vou explicar as causas mais prováveis e quando se preocupar.

**Por que a lombar dói de manhã (fisiologia):**

**1. Hidratação dos discos intervertebrais à noite:**
- Durante o dia: gravidade comprime os discos → perdem água → ficam mais finos
- À noite deitado: sem compressão gravitacional → discos REABSORVEM água → ficam mais espessos
- O disco mais hidratado gera mais pressão intradiscal → rigidez e desconforto matinal
- Por isso você é 1-2cm MAIS ALTO de manhã do que à noite (Tyrrell et al., 1985)
- Os primeiros 20-30 min de pé: disco expulsa o excesso de água → normaliza → dor melhora

**2. Rigidez articular matinal (creep viscoelástico reverso):**
- Ligamentos e cápsulas articulares se "assentam" durante imobilidade prolongada
- Ao levantar: precisam ser re-mobilizados → sensação de rigidez
- Normal: até 30 min de rigidez matinal
- Red flag: > 60 min de rigidez matinal (pode indicar processo inflamatório — artrite, espondilite)

**3. Posição de sono:**
- Barriga pra baixo (prono): hiperextensão lombar por 6-8h → compressão facetária → dor ao acordar
- Barriga pra cima sem suporte: lordose excessiva → mesma compressão
- Fetal excessivo: flexão lombar prolongada → pressão discal posterior

**4. Colchão:**
- Colchão de 3 anos geralmente ainda é OK (vida útil: 7-10 anos)
- MAS: se o colchão afunda no centro → sua lombar fica em extensão ou flexão não-neutra
- Teste: deite de costas no colchão — consegue passar a mão entre a lombar e o colchão? Se sim, está afundando demais

**5. Fraqueza de core/estabilizadores:**
- Sem tônus adequado de transverso do abdômen e multífidos → coluna depende de estruturas passivas (discos, ligamentos) → sobrecarga → dor

**O que NÃO é (provavelmente):**
- Hérnia discal: dor discogênica geralmente PIORA com flexão/sentar e MELHORA de pé/andando. Sua melhora com movimento sugere NÃO é disco
- Fratura: sem trauma, em pessoa jovem, extremamente improvável
- Tumor: dor tumoral geralmente é CONSTANTE e PROGRESSIVA, não melhora com movimento, frequentemente noturna → não combina com seu padrão

**Red flags (quando INVESTIGAR com médico):**

🚩 Rigidez matinal > 60 minutos
🚩 Dor que NÃO melhora com movimento
🚩 Dor que PIORA progressivamente semana a semana
🚩 Dor noturna que ACORDA você
🚩 Perda de força em perna ou pé
🚩 Alteração de controle de bexiga/intestino
🚩 Febre associada
🚩 Perda de peso inexplicada
🚩 Histórico de câncer

**Se NENHUMA red flag → plano de ação:**

**1. Mobilidade matinal (5 min ao acordar):**
- Cat-cow (gato-vaca): 10 reps lentas
- Rotação de tronco deitada: 10 cada lado
- Flexão de joelhos ao peito: 3x20s
- Dead bug: 10 reps
- Faz a transição disco-hidratado → disco-normalizado mais rápido

**2. Ajuste de posição de sono:**
- De lado: travesseiro entre os joelhos (alinha pelve)
- De costas: travesseiro fino sob os joelhos (reduz lordose)
- Barriga pra baixo: evitar se possível; se não conseguir, travesseiro fino sob o abdômen

**3. Fortalecimento de core (3x/semana):**
- Dead bug: 3x10
- Bird-dog: 3x10
- Prancha: 3x30s
- Ponte de glúteo: 3x15
- McGill big 3 (curl-up, side plank, bird-dog): protocolo mais estudado para dor lombar

**4. Não precisa de exame de imagem:**
- Diretrizes internacionais (NICE, ACP): exame de imagem SÓ se red flags presentes
- Ressonância em pessoa SEM red flags → alta chance de encontrar "achados incidentais" (protrusões assintomáticas, degeneração normal) que geram ansiedade sem mudar a conduta
- Brinjikji et al. (2015): 52% de pessoas ASSINTOMÁTICAS com 30 anos têm protrusão discal na RM — achado NORMAL do envelhecimento

Juliana, dor lombar matinal que melhora em 20-30 min é o padrão mais benigno que existe. Mobilidade ao acordar + core + ajuste de sono. Se não melhorar em 4-6 semanas OU surgir qualquer red flag → aí sim investigue.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009', // Bruno Ferreira
    content: `A rotina matinal de 5 min mudou minha vida. 1 ano de dor lombar ao acordar. Comecei cat-cow + dead bug + ponte de glúteo TODO dia de manhã (antes do café). Em 3 semanas: dor reduziu 70%. Em 8 semanas: zero dor matinal. 5 minutos. CINCO. Quase fui no ortopedista pedir ressonância quando a solução era mobilidade + core.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006', // Patricia Oliveira
    content: `O dado de que 52% de pessoas SEM DOR têm protrusão na RM é ESSENCIAL. Minha vizinha fez RM "preventiva", apareceu protrusão L4-L5, e ela ficou apavorada sem ter DOR NENHUMA. Quase operou. Um segundo ortopedista disse: "isso é normal pra sua idade, não faça nada". Exame sem indicação = ansiedade sem benefício.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003', // Mariana Costa
    content: `Sobre posição de sono: eu dormia de barriga pra baixo a vida toda. Dor lombar matinal há 5 anos. Quando comecei a dormir de lado com travesseiro entre os joelhos (levou 2 semanas pra acostumar), a dor caiu PELA METADE. Adicionei a mobilidade matinal e sumiu. Às vezes a causa mais simples é a mais ignorada.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 2: Dor cervical e trabalho em casa (home office)
  // ============================================================
  {
    userId: 'user_sim_008', // Camila Ribeiro
    content: `Desde que comecei home office (3 anos) minha cervical é um desastre. Dor na nuca, sensação de peso na cabeça, às vezes irradia pro trapézio. Trabalho no notebook na mesa da cozinha. Já tentei alongamentos mas volta todo dia. O que estou fazendo de errado?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Camila, o problema não é a cervical — é o SETUP de trabalho. Notebook na mesa da cozinha é uma das configurações ergonômicas mais destrutivas que existe. Vou explicar o mecanismo e a solução.

**Por que notebook na mesa causa dor cervical:**

**A biomecânica do desastre:**
- Tela do notebook: ~25-30cm abaixo da linha dos olhos
- Para VER a tela: você flexiona a cervical ~30-45°
- Hansraj (2014): a cada 15° de flexão cervical, a carga sobre a coluna cervical AUMENTA progressivamente
  - 0° (neutro): 4.5-5.5kg (peso da cabeça)
  - 15°: 12kg
  - 30°: 18kg
  - 45°: 22kg
  - 60°: 27kg
- 8h por dia com 18-22kg sobre a cervical → sobrecarga muscular → dor
- Os músculos suboccipitais, esplênio, semiespinhal e trapézio superior trabalham CONTINUAMENTE para segurar sua cabeça que está "caindo" pra frente

**É como segurar um halter de 18kg com o braço estendido por 8 horas. Não importa quão forte você é — vai doer.**

**A solução NÃO é alongamento (paliativo). É ERGONOMIA (causa raiz).**

**Setup ergonômico mínimo para home office:**

**1. Tela na altura dos olhos (INEGOCIÁVEL):**
- Borda superior da tela na linha dos olhos ou 2-3cm acima
- Soluções: suporte para notebook (R$ 30-80) + teclado externo (R$ 50-80) + mouse
- OU: monitor externo (investimento maior mas ideal)
- Custo mínimo: R$ 80-160. Resolve 70% do problema

**2. Distância da tela:**
- 50-70cm dos olhos (comprimento do braço)
- Muito perto → flexão cervical pra focar
- Muito longe → inclinação pra frente pra ler

**3. Cadeira:**
- Pés apoiados no chão (ou apoio de pé)
- Joelhos a ~90°
- Lombar com suporte (almofada lombar se a cadeira não tem)
- Braços apoiados na mesa com cotovelos a ~90°

**4. Pausas ativas:**
- A cada 30-45 min: levantar + 30s de mobilidade cervical
- Chin tuck (queixo duplo): 10 reps — fortalece flexores cervicais profundos
- Retração escapular: 10 reps — neutraliza protração
- Rotação cervical: 5 cada lado, lenta

**Protocolo corretivo (além da ergonomia):**

**Diário (5 min):**
- Chin tuck com resistência (mão atrás da cabeça): 3x10
- Foam roller torácico (extensão): 2 min
- Band pull-apart ou face pull: 3x15

**3x/semana (no treino):**
- Face pull: 3x15
- Remada com retração escapular: 3x12
- Dead hang (pendurar na barra): 3x20s
- Desenvolvimento com boa técnica (mobilidade de ombro)

**Red flags cervicais (quando investigar):**

🚩 Dor que irradia pro braço com formigamento/dormência
🚩 Perda de força na mão (não consegue segurar objetos)
🚩 Dor de cabeça intensa, diferente do habitual
🚩 Dor pós-trauma (queda, acidente)
🚩 Tontura ou alteração visual associada à posição do pescoço

Camila, 3 anos de notebook na mesa = 3 anos de 18-22kg de carga extra na cervical. Investir R$ 100 em suporte + teclado externo vai resolver mais que 100 sessões de alongamento. Trate a CAUSA (ergonomia), não o SINTOMA (dor).`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010', // Thiago Martins
    content: `O suporte de notebook + teclado externo foi o melhor investimento de saúde que fiz. R$ 120 total no Mercado Livre. Em 2 semanas: dor cervical reduziu 80%. Em 1 mês: praticamente zero. 3 anos de dor resolvidos com R$ 120 de ergonomia. ANTES de ir em fisio, ortopedista ou comprar órtese: ARRUME SEU SETUP DE TRABALHO.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012', // Roberta Mendes
    content: `O dado do Hansraj (18kg a 30° de flexão) é chocante quando você VISUALIZA. Segure um halter de 18kg com o braço estendido e veja quanto tempo aguenta. 2 minutos? Agora imagine 8 HORAS. É isso que sua cervical faz quando você olha pra baixo pro notebook. A analogia deveria estar em todo manual de home office.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016', // Daniela Correia
    content: `Pra quem tem orçamento zero: empilhei livros/caixas na mesa até a tela do notebook ficar na altura dos olhos. Pluguei um teclado USB de R$ 30 que já tinha. Gambiarra? Sim. Funciona? 100%. A dor cervical sumiu. Não precisa de setup de escritório caro — precisa da TELA NA ALTURA DOS OLHOS, não importa como.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 3: Dor ciática sem diagnóstico de hérnia
  // ============================================================
  {
    userId: 'user_sim_005', // Rafael Lima
    content: `Dor que desce da lombar pra nádega e atrás da coxa. Parece ciática. Mas fiz RM e NÃO tem hérnia. Ortopedista disse "é muscular" e mandou tomar anti-inflamatório. A dor volta toda vez que paro o remédio. Se não é hérnia, o que é? E como resolver de verdade?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rafael, ciática (ou dor radicular) sem hérnia na RM é mais COMUM do que se pensa. A RM ser normal não significa que o nervo não está sendo irritado — significa que a compressão não é discal.

**Causas de dor "ciática" SEM hérnia discal:**

**1. Síndrome do piriforme (causa mais comum de "ciática sem hérnia"):**
- O nervo ciático passa ATRAVÉS ou ABAIXO do músculo piriforme na nádega
- Em ~17% da população, o nervo passa ATRAVÉS do piriforme (variação anatômica)
- Piriforme hipertônico/espasmo → comprime o ciático → dor que irradia exatamente como hérnia
- Teste: dor piora ao sentar em superfície dura + piora ao cruzar a perna
- Palpação do piriforme é MUITO dolorosa

**2. Radiculopatia por estenose foraminal:**
- O forame (buraco por onde o nervo sai da coluna) pode estar estreitado por osteófitos (bicos de papagaio)
- Nem sempre aparece como "hérnia" na RM mas comprime o nervo
- Mais comum em > 50 anos
- Piora com extensão (ficar de pé, caminhar) e melhora com flexão (sentar)

**3. Dor referida do quadrado lombar (QL):**
- QL hipertônico pode irradiar dor para nádega e coxa posterior
- NÃO é compressão neural real (não tem formigamento verdadeiro)
- Confundido com ciática mas é dor MUSCULAR referida
- Teste: pressão no QL reproduz a dor na nádega? Provável QL

**4. Síndrome facetária lombar:**
- Articulações facetárias irritadas referem dor para nádega e coxa
- Padrão: dor lombar + dor na nádega que NÃO passa do joelho
- Piora com extensão e rotação da lombar

**5. Trigger points glúteos:**
- Trigger points no glúteo médio e mínimo referem dor pela perna abaixo
- Padrão de irradiação IMITA ciática
- Diferença: a dor é difusa, não segue dermátomo preciso, e reproduz ao pressionar o ponto

**Como diferenciar (guia prático):**

| Achado | Hérnia real | Piriforme | Muscular/TP |
|---|---|---|---|
| Irradia abaixo do joelho | Sim, até o pé | Até o joelho | Geralmente não |
| Formigamento/dormência | Sim, dermátomo | Às vezes | Não |
| Piora ao sentar | Sim | Sim (piriforme) | Variável |
| Piora ao tossir/espirrar | Sim | Não | Não |
| Palpação reproduz dor | Não necessariamente | Sim (piriforme) | Sim (TP) |
| Lasègue (SLR) positivo | Sim | Às vezes | Não |
| RM com achado | Hérnia/protrusão | Normal | Normal |

**Para SEU caso (RM normal + dor recorrente):**

Suspeita principal: síndrome do piriforme ou trigger points glúteos.

**Protocolo de tratamento:**

**1. Liberação do piriforme (diário):**
- Bola de lacrosse no piriforme: sentar sobre a bola, cruzar a perna → 60-90s
- Alongamento do piriforme: 3x30s cada lado (perna cruzada, puxar o joelho oposto)
- Foam roller em glúteo profundo: 2 min cada lado

**2. Fortalecimento de glúteo médio (paradoxalmente o piriforme compensa fraqueza do GM):**
- Clamshell: 3x15
- Side-lying abduction: 3x12
- Monster walk: 3x10 passos
- O glúteo médio forte → piriforme não precisa compensar → para de espasmar → nervo livre

**3. Mobilidade de quadril:**
- 90/90 stretch: 3x30s cada lado
- Rotação interna/externa de quadril: 10 cada
- Cat-cow focando na pelve: 10 reps

**4. Estabilização lombar:**
- McGill big 3: curl-up, side plank, bird-dog
- Se a lombar é instável → piriforme recruta como estabilizador → espasma → dor

**5. Evitar:**
- Sentar prolongado sem pausas (o piriforme encurta)
- Cruzar as pernas sempre do mesmo lado
- Carteira no bolso traseiro (pressão direta sobre o piriforme — "wallet sciatica")

Se em 4-6 semanas NÃO melhorar com esse protocolo → investigue com fisioterapeuta especializado em dor neural. Pode ser necessário dry needling no piriforme ou bloqueio diagnóstico.

Rafael, anti-inflamatório mascara o sintoma. Liberação do piriforme + fortalecimento do glúteo médio + estabilização lombar trata a CAUSA. Teste por 4 semanas e reavalie.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011', // Lucas Souza
    content: `ERA O PIRIFORME. Mesma história: dor "ciática", RM limpa, ortopedista confuso. Um fisioterapeuta especializado palpou meu piriforme D e eu quase pulei da maca de dor. 4 semanas de bola de lacrosse + alongamento + clamshell: dor reduziu 90%. 2 meses: zero. O piriforme era o vilão escondido. A carteira no bolso traseiro era o GATILHO — tirei e nunca mais.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001', // Ana Paula
    content: `A "wallet sciatica" (ciática da carteira) deveria ter campanha de conscientização. Meu marido tinha dor ciática D há 2 anos. Ressonância normal. Gastou R$ 3.000 em consultas e exames. A solução: tirar a carteira do bolso traseiro direito. Sentava 8h/dia no trabalho sobre a carteira = compressão direta do piriforme sobre o ciático. Tirou a carteira → dor sumiu em 3 semanas. TRÊS MIL REAIS quando a solução custava R$ 0.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 4: Dor no ombro ao levantar o braço
  // ============================================================
  {
    userId: 'user_sim_007', // Fernanda Alves
    content: `Dor no ombro quando levanto o braço acima da cabeça. Especificamente entre 60° e 120° — depois que passa dessa faixa, melhora. Dói no desenvolvimento e na elevação lateral. É do treino ou é algo sério? Tenho 34 anos.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, a dor entre 60° e 120° de abdução (arco doloroso) que melhora acima disso é um padrão clássico que aponta para uma estrutura específica.

**O arco doloroso de 60-120°:**

Esse padrão é altamente sugestivo de **síndrome do impacto subacromial** — a causa MAIS COMUM de dor no ombro em pessoas fisicamente ativas.

**O que acontece:**
- Entre 60-120°: o tendão do supraespinhal (manguito rotador) e a bursa subacromial passam por um espaço estreito entre o úmero e o acrômio
- Se há inflamação da bursa (bursite) ou tendinopatia do supraespinhal → eles "encaixam" nesse espaço → dor
- Abaixo de 60°: o tendão ainda não está na zona de impacto → sem dor
- Acima de 120°: o tendão já passou pela zona → alívio

**Causas mais comuns (por que desenvolveu isso):**

**1. Postura de ombro protraído (protração/rotação interna):**
- Home office + celular → ombros pra frente → espaço subacromial REDUZ
- Menos espaço = mais impacto do tendão = mais irritação

**2. Desequilíbrio muscular:**
- Peitoral e deltóide anterior FORTES (muito supino, muito push-up)
- Manguito rotador e estabilizadores escapulares FRACOS (pouco face pull, pouca remada)
- Escápula não rotaciona adequadamente → úmero bate no acrômio

**3. Progressão de carga rápida demais:**
- Aumentou peso do desenvolvimento ou elevação lateral rápido → tendão não acompanhou

**O que fazer (protocolo conservador — funciona em 70-80% dos casos):**

**Fase 1 — Redução de irritação (2-4 semanas):**
- EVITAR exercícios no arco doloroso: desenvolvimento acima da cabeça, elevação lateral com carga
- Substituir por variações que não provocam dor: elevação lateral até 60° apenas, supino inclinado (controla o arco)
- Gelo 15 min pós-treino se houver inflamação aguda

**Fase 2 — Fortalecimento do manguito rotador (iniciar junto com fase 1):**
- Rotação externa com elástico (cotovelo colado ao corpo): 3x15 diário
- Rotação externa em 90° de abdução (se tolerável): 3x12
- Full can (elevação no plano da escápula com polegar pra cima): 3x12 com peso leve (1-2kg)
- Face pull: 3x15 (prioridade em TODOS os treinos)

**Fase 3 — Estabilização escapular:**
- Retração escapular na remada (consciente): 3x12
- Serrátil anterior: push-up plus (protração no topo da flexão): 3x10
- Wall slide (Y-raise na parede): 3x10
- Objetivo: escápula rotaciona corretamente → mais espaço subacromial → menos impacto

**Fase 4 — Retorno gradual ao overhead (4-8 semanas):**
- Desenvolvimento com halter (mais mobilidade que barra): iniciar LEVE
- Se doer no arco → não está pronta, continue fase 2-3
- Progredir carga MUITO lentamente (1-2kg por semana)

**Red flags do ombro (quando investigar com médico):**

🚩 Dor noturna que acorda (deitar sobre o lado afetado é insuportável)
🚩 Perda de força súbita (não consegue levantar o braço) — possível ruptura de manguito
🚩 Trauma (queda sobre o braço/ombro)
🚩 Dor que NÃO melhora em 6-8 semanas de protocolo conservador
🚩 Instabilidade (sensação de que o ombro "sai do lugar")
🚩 Idade > 50 + fraqueza + dor → investigar ruptura

Fernanda, aos 34 anos, arco doloroso sem trauma é quase certamente impacto subacromial por desequilíbrio muscular ou postura. Rotação externa + face pull + estabilização escapular + evitar overhead temporariamente. A maioria resolve em 6-8 semanas sem precisar de exame.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017', // Renata Moraes
    content: `Tive exatamente isso — arco doloroso clássico no ombro D. Fisio confirmou impacto subacromial por fraqueza do manguito e escapular. 6 semanas de rotação externa com elástico + face pull diário + wall slides = dor SUMIU. Agora faço desenvolvimento novamente sem dor. A chave: parei de insistir no exercício que doía e tratei a CAUSA (manguito fraco, escápula preguiçosa).`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010', // Thiago Martins
    content: `Face pull deveria ser OBRIGATÓRIO em todo programa de treino. Desde que adicionei 3x15 de face pull em TODO treino de MMSS, meus 2 ombros que viviam doendo pararam. É profilaxia: fortalece rotadores externos e retratores escapulares que compensam o excesso de push (supino, flexão, desenvolvimento). Custa 3 minutos por treino. Previne meses de dor.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 5: Joelho estrala ao agachar — é grave?
  // ============================================================
  {
    userId: 'user_sim_011', // Lucas Souza
    content: `Meu joelho estrala TODA VEZ que agacho. Som alto, tipo "crack". Não dói. Mas o barulho assusta e todo mundo na academia olha. Devo parar de agachar? É desgaste da cartilagem?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Lucas, estalidos articulares sem dor são um dos motivos mais comuns de preocupação desnecessária no treino. Vou te tranquilizar com ciência.

**O que causa o "crack" no joelho:**

**1. Cavitação (o mais comum):**
- Dentro da articulação há líquido sinovial com gases dissolvidos (CO2, N2)
- Movimento rápido → pressão muda → gás forma bolha → bolha estoura → "crack"
- É o MESMO mecanismo de estalar os dedos
- INOFENSIVO. Não causa artrite, não desgasta cartilagem
- Unsworth et al. (1971): cavitação articular é fenômeno fisiológico normal

**2. Deslizamento de tendão/ligamento sobre proeminência óssea:**
- O tendão da patela ou o trato iliotibial pode "pular" sobre um relevo ósseo
- Produz estalo ou "click"
- Comum em pessoas com anatomia onde o tendão é mais tenso
- INOFENSIVO se sem dor

**3. Crepitação (ruído contínuo, tipo "areia"):**
- Diferente de estalo isolado
- Crepitação fina: frequentemente normal (líquido sinovial, gases)
- Crepitação GROSSA com dor: PODE indicar irregularidade da cartilagem
- A distinção é: estalo isolado sem dor ≠ crepitação dolorosa

**O que a ciência diz sobre estalidos sem dor:**

**De Oliveira Silva et al. (2018):**
- Estalidos no joelho SEM dor não estão associados a dano articular
- Não aumentam risco de osteoartrite
- Não indicam necessidade de investigação

**Robertson et al. (2017):**
- Crepitação patelar é encontrada em 99% dos joelhos em algum momento
- Não é preditiva de patologia quando sem dor

**A regra de ouro:**
- Estalo SEM dor = FISIOLÓGICO → ignore
- Estalo COM dor = POTENCIALMENTE relevante → investigue
- Estalo COM inchaço = INVESTIGAR
- Estalo COM bloqueio (joelho "trava" e não estende) = INVESTIGAR (possível lesão meniscal)

**Quando se preocupar:**

🚩 Dor durante ou após o estalo
🚩 Inchaço no joelho após treino
🚩 Bloqueio articular (joelho trava em posição)
🚩 Instabilidade (joelho "foge" durante movimento)
🚩 Estalo que MUDOU recentemente (novo, diferente, após trauma)

**O que NÃO fazer:**
- Parar de agachar por causa de estalo sem dor ❌
- Pedir RM "preventiva" para estalo sem dor ❌
- Reduzir amplitude de agachamento por medo ❌

**O que PODE fazer (se o barulho incomoda psicologicamente):**
- Aquecer bem antes de agachar (5 min de bike/caminhada + extensão leve)
- Muitas vezes o estalo ocorre nas primeiras reps e desaparece quando aquece
- Progredir amplitude gradualmente (primeiro meia amplitude, depois completa)
- Suplementação de colágeno tipo II (evidência moderada mas sem risco)

Lucas, seu joelho que estrala sem dor é NORMAL. Continue agachando. O barulho é gás estourando, não cartilagem quebrando. Se surgir dor, inchaço ou bloqueio → reavalie. Até lá: agache em paz.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005', // Rafael Lima
    content: `Meu joelho esquerdo estrala ALTO desde os 18 anos. Tenho 32. 14 anos de estalo sem dor nenhuma. Agacho 100kg+ sem problema. Se estalo fosse desgaste, meu joelho já teria virado pó. É só gás no líquido sinovial. Ignorar e treinar foi a melhor decisão — se tivesse parado de agachar por medo do barulho, não teria as pernas que tenho.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020', // Beatriz Gomes
    content: `A dica de aquecer antes resolve 90% do "barulho assustador". Meu joelho parecia um saco de pipoca estourando a frio. Depois de 5 min de bike leve + 10 agachamentos livres, silêncio total. O joelho precisa aquecer o líquido sinovial — ele fica mais "grosso" a frio e mais fluido quente. Se o barulho te incomoda: aquecimento resolve sem precisar parar nada.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 6: Formigamento nas mãos durante treino
  // ============================================================
  {
    userId: 'user_sim_016', // Daniela Correia
    content: `Minhas mãos formigam durante treino de MMSS — especialmente supino e desenvolvimento. Dedos 4 e 5 (anelar e mínimo) ficam dormentes. Passa depois do treino. É circulação ou algo sério?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Daniela, formigamento nos dedos 4 e 5 (anelar e mínimo) durante exercício de pressão é um padrão específico que aponta para uma estrutura precisa.

**Os dedos 4 e 5 são inervados pelo NERVO ULNAR.**

Formigamento nessa distribuição durante supino e desenvolvimento sugere **compressão do nervo ulnar** — e existem 3 locais possíveis.

**Locais de compressão do nervo ulnar:**

**1. Cotovelo — túnel cubital (mais comum em treino):**
- O nervo ulnar passa ATRÁS do epicôndilo medial (aquele "osso do cotovelo que dói ao bater")
- Em flexão prolongada do cotovelo (posição de supino, desenvolvimento) → o nervo é ESTIRADO
- Se associar pressão sobre o cotovelo (apoiado em banco) → compressão dupla
- Teste: mantenha o cotovelo flexionado a 90° por 60s → formigamento nos dedos 4-5? Positivo

**2. Punho — canal de Guyon:**
- O nervo ulnar passa pelo punho na borda ulnar (lado do mínimo)
- Grip apertado + extensão de punho (como segurar barra no supino) → compressão
- Especialmente com luva de musculação apertada

**3. Cervical (menos provável se é só durante exercício):**
- Raiz C8-T1 comprimida na coluna cervical → irradia no trajeto ulnar
- MAS: se formiga SÓ durante treino e NÃO no dia a dia → provavelmente é periférico (cotovelo ou punho)

**Por que acontece no treino especificamente:**

No supino/desenvolvimento:
- Cotovelo flexionado + grip na barra = dupla compressão (estiramento no cotovelo + compressão no punho)
- Isquemia relativa: o fluxo sanguíneo para o nervo é comprometido pela posição sustentada
- Após o exercício: posição normaliza → fluxo retorna → formigamento cessa

**O que fazer:**

**1. Ajuste de grip e posição:**
- Grip mais largo no supino → menos flexão de cotovelo → menos estiramento ulnar
- Punho neutro (não hiper-estendido): usar wrist wraps pode ajudar a manter neutro
- Não apoiar cotovelo em superfícies duras

**2. Remova luvas de musculação:**
- Luvas apertadas comprimem o canal de Guyon
- Teste sem luva por 2 semanas → se melhora, era a luva

**3. Nerve glides (deslizamento neural) pré-treino:**
- Braço estendido ao lado → punho em extensão → incline a cabeça pro lado oposto
- 10 repetições lentas cada lado
- "Solta" o nervo antes de colocar em posição de estresse

**4. Se persiste:**
- Evitar flexão sustentada de cotovelo > 90° (dormir com cotovelo dobrado é gatilho comum)
- Cotoveleira noturna (mantém cotovelo em extensão durante o sono)

**Red flags neurológicos (investigar com médico):**

🚩 Formigamento que NÃO passa após o treino (persiste horas/dias)
🚩 Perda de força na mão (dificuldade de segurar objetos, abrir potes)
🚩 Atrofia dos músculos da mão (eminência hipotenar — base do mínimo)
🚩 Formigamento durante atividades leves (não só treino)
🚩 Formigamento em TODOS os dedos (não só 4-5) → pode ser síndrome do túnel do carpo ou cervical

Daniela, seu padrão (dedos 4-5, durante exercícios de pressão, melhora após) é clássico de compressão ulnar no cotovelo ou punho. Ajuste grip, remova luvas, faça nerve glides. Se persistir ou piorar → eletroneuromiografia com neurologista.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008', // Camila Ribeiro
    content: `ERA A LUVA! Usava luva de musculação há 3 anos e meus dedos 4-5 formigavam em TODO treino de MMSS. Tirei a luva como teste: formigamento SUMIU na primeira sessão. A luva era apertada no punho e comprimia exatamente na borda ulnar (canal de Guyon). 3 anos achando que era "problema neurológico" quando era um acessório de R$ 30. Teste SEM luva antes de ir no médico.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009', // Bruno Ferreira
    content: `Os nerve glides fizeram diferença imediata pro meu formigamento no supino. Faço 10 reps de cada lado entre séries de aquecimento e o formigamento durante as séries pesadas reduziu muito. É como "avisar" o nervo que vai ser colocado em posição de estresse — ele se prepara. 30 segundos de nerve glide pra evitar formigamento em 45 min de treino. Custo-benefício absurdo.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 7: Pernas pesadas ao fim do dia — é postural?
  // ============================================================
  {
    userId: 'user_sim_003', // Mariana Costa
    content: `Final do dia de trabalho (fico sentada 8h) e minhas pernas ficam pesadas, inchadas e doloridas. Especialmente panturrilha e tornozelo. Quando deito e elevo, melhora. É falta de exercício? Insuficiência venosa? Ou postura sentada?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Mariana, pernas pesadas ao final de período sentado prolongado é extremamente comum e tem causas sobrepostas. Vou separar as mais prováveis.

**O mecanismo (por que sentar faz as pernas incharem):**

**1. Estase venosa por gravidade + inatividade:**
- Sentada: sangue desce pelas artérias normalmente, mas o RETORNO venoso depende da bomba muscular da panturrilha
- Se a panturrilha está IMÓVEL por horas → bomba muscular inativa → sangue/líquido acumula nos MMII
- O líquido extravasa dos capilares para o interstício → EDEMA gravitacional
- Resultado: pernas pesadas, inchadas, desconfortáveis

**2. Compressão venosa pela posição:**
- Sentar com quadril e joelhos a 90° → compressão parcial da veia femoral na virilha
- Cruzar as pernas → compressão adicional na poplítea (atrás do joelho)
- Cadeira com borda dura → compressão da coxa posterior

**3. Retorno linfático comprometido:**
- A drenagem linfática dos MMII também depende de movimento muscular
- Imobilidade → acúmulo de linfa → edema + sensação de peso

**Quando é "normal" (edema funcional) vs quando investigar:**

**Edema funcional (posicional) — provavelmente o seu caso:**
- Aparece ao fim do dia após período sentado/em pé
- Melhora com elevação e exercício
- BILATERAL e simétrico
- Sem dor localizada intensa
- Sem alteração de cor da pele

**Investigar com médico (angiologista/vascular):**
🚩 Edema UNILATERAL (uma perna só — pode ser TVP)
🚩 Dor localizada intensa na panturrilha (TVP)
🚩 Alteração de cor: vermelhidão, cianose (azulado)
🚩 Varizes visíveis + sensação de queimação
🚩 Edema que NÃO resolve com elevação
🚩 Histórico familiar de trombose
🚩 Uso de anticoncepcional (aumenta risco de TVP)
🚩 Edema em pessoa com lipedema (padrão diferente)

**Soluções práticas:**

**1. Ativação da bomba da panturrilha (a cada 30-45 min):**
- Flexão plantar/dorsiflexão: 20 reps (levantar e abaixar o calcanhar sentada)
- Círculos de tornozelo: 10 cada direção
- Levantar e caminhar 1-2 min
- TIMER no celular: a cada 30 min → 30 segundos de ativação
- Isso é a intervenção MAIS EFICAZ e mais subestimada

**2. Posição sentada otimizada:**
- Pés apoiados no chão (ou apoio elevado)
- NÃO cruzar as pernas (comprime vasos)
- Alternar posição: sentada → em pé → sentada (mesa de altura ajustável ideal)

**3. Meia de compressão classe 1 (preventiva):**
- Para quem fica sentada > 6h/dia: meia classe 1 (15-21 mmHg) é CONFORTÁVEL e reduz edema vespertino significativamente
- Não precisa ser classe 2 (que é pra patologia) — classe 1 preventiva serve
- Custo: R$ 60-150

**4. Exercício regular:**
- Musculação de MMII 2-3x/semana melhora o tônus da bomba muscular
- Panturrilha forte = bomba muscular mais eficiente = menos edema
- Caminhada diária (mesmo 20 min) faz diferença significativa

**5. Final do dia:**
- Elevação de pernas 15-20 min (pernas acima do coração)
- Banho de contraste: 30s quente + 30s frio nas pernas (vasomotricidade)

Mariana, se o edema é bilateral, aparece ao final do dia sentada e melhora com elevação → é edema posicional funcional. Ativação da panturrilha a cada 30 min + não cruzar pernas + meia classe 1 resolve a maioria dos casos. Se for UNILATERAL ou não resolver → vascular obrigatório.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012', // Roberta Mendes
    content: `O timer de 30 minutos pra ativar a panturrilha MUDOU meu fim de dia. Coloquei alarme vibratório no celular — a cada 30 min faço 20 flexões plantares sentada (ninguém percebe na mesa de trabalho). Leva 15 segundos. Minhas pernas pararam de inchar. Era SÓ ISSO. Bombear o sangue de volta. 15 segundos a cada 30 min em troca de pernas leves às 18h. Melhor troca da minha vida.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007', // Fernanda Alves
    content: `Pra quem tem lipedema: as pernas pesadas ao final do dia são PIORES porque o tecido lipedematoso já compromete a drenagem. Meia classe 2 (não classe 1 como o protocolo preventivo) + ativação de panturrilha + elevação é o TRIPÉ obrigatório. Se tem lipedema e trabalha sentada sem meia de compressão, as pernas vão pesar SEMPRE. A meia transforma o dia.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 8: Dor ≠ lesão — a biopsicossocial da dor
  // ============================================================
  {
    userId: 'user_sim_020', // Beatriz Gomes
    content: `Li que "dor não significa necessariamente que algo está quebrado". Como assim? Se dói, alguma coisa TEM que estar errada, não? Tenho dor lombar há meses e fico com medo de treinar porque acho que vou piorar. Mas os exames são normais.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Beatriz, essa é talvez a conversa mais importante sobre dor que podemos ter. O modelo biomédico antigo ("dor = lesão tecidual") está desatualizado. A ciência moderna da dor é mais complexa — e entender isso muda COMPLETAMENTE como você lida com sua dor.

**O modelo antigo (biomédico — INCOMPLETO):**
- Dor = dano no tecido
- Mais dor = mais dano
- Se dói ao treinar = está piorando
- Implicação: evite tudo que dói → descanso total → melhora

**O modelo moderno (biopsicossocial da dor):**
- Dor = interpretação do CÉREBRO sobre sinais do corpo + contexto psicológico + contexto social
- NÃO é uma medida direta de dano tecidual
- A mesma lesão pode doer MUITO ou NADA dependendo do contexto

**Evidências que provam que dor ≠ dano:**

**1. Lesões sem dor:**
- Brinjikji et al. (2015): 52% dos adultos de 30 anos têm protrusão discal na RM SEM DOR
- 80% dos adultos > 50 anos têm degeneração discal na RM SEM DOR
- Soldados em combate com ferimentos graves frequentemente não sentem dor até horas depois

**2. Dor sem lesão:**
- Dor do membro fantasma: amputados sentem dor em membro que NÃO EXISTE
- Nocebo: pacientes que recebem pilha de água + aviso "pode doer" reportam dor REAL
- Sua situação: exames normais + dor persistente = dor real SEM dano tecidual proporcional

**3. Dor que muda com contexto:**
- Mesma pressão no dedo: se aplicada por pesquisador em jaleco branco dói MAIS
- Atletas com lesão durante final de campeonato: não sentem dor até acabar o jogo
- Estresse, sono ruim, ansiedade, catastrofização → AMPLIFICAM dor sem mudar o tecido

**O que modula a dor (além do tecido):**

**Fatores que AUMENTAM dor (amplificadores centrais):**
- Sono ruim (<6h ou qualidade ruim) → sensitização central → tudo dói mais
- Estresse crônico → cortisol altera processamento de dor
- Catastrofização ("essa dor vai piorar e nunca vai melhorar") → amplificação cortical
- Medo de movimento (cinesiofobia) → tensão muscular → mais dor → mais medo → CICLO
- Sedentarismo → menos endorfinas, menos modulação descendente da dor
- Isolamento social → amplificação da percepção de dor

**Fatores que REDUZEM dor (moduladores descendentes):**
- Exercício regular → liberação de endorfinas, endocanabinoides → analgesia natural
- Sono adequado → processamento normal da dor
- Educação sobre dor (entender que dor ≠ dano) → reduz catastrofização → reduz dor REAL
- Exposição gradual ao movimento temido → desssensibiliza o sistema nervoso
- Suporte social → modulação da percepção de dor

**Para SUA situação (dor lombar crônica com exames normais):**

Sua dor é REAL — isso é inquestionável. Mas a causa provavelmente NÃO é dano tecidual ativo. É mais provável:
- Sensitização central: seu sistema nervoso está "amplificando" sinais normais da lombar
- Cinesiofobia: o medo de treinar está gerando tensão muscular protetora → que gera dor
- Descondicionamento: evitar movimento → musculatura enfraquece → mais sobrecarga em estruturas passivas → mais dor

**O tratamento que funciona:**
1. **Exposição gradual ao exercício** — começar LEVE e aumentar progressivamente
2. **NÃO evitar movimento** — repouso prolongado PIORA dor lombar crônica
3. **Educação sobre dor** (isso que estamos fazendo agora)
4. **Higiene do sono** (7-8h de qualidade)
5. **Manejo de estresse**
6. **Exercícios de estabilização** (McGill big 3) que "ensinam" o cérebro que a lombar é SEGURA

Mosher et al. (2012): exercício é recomendado como tratamento de PRIMEIRA LINHA para dor lombar crônica em TODAS as guidelines internacionais. Não exercício = piora.

Beatriz, seu medo de treinar é compreensível — mas é o medo que está perpetuando a dor, não o treino. Comece com exercícios de estabilização LEVES, aumente gradualmente, e confie nos exames que dizem que sua coluna está INTACTA. O cérebro precisa reaprender que movimento é SEGURO.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006', // Patricia Oliveira
    content: `Isso me trouxe às lágrimas. 2 anos de dor lombar crônica. Evitei TUDO: treino, carregar sacola, brincar com meu filho. Exames normais. Ninguém me explicou que a DOR não significava DANO. Um fisioterapeuta especializado em dor crônica me colocou num programa de exposição gradual + educação sobre dor. 3 meses depois: faço agachamento, carrego meu filho e vivo. A dor ainda aparece às vezes — mas eu NÃO tenho mais medo dela. E sem medo, ela pesa 10% do que pesava.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009', // Bruno Ferreira
    content: `A frase que mudou minha relação com dor: "dor é um alarme, não um dano report. E alarmes podem disparar com sensibilidade excessiva." Meu alarme de dor lombar estava calibrado pra disparar com QUALQUER movimento. A exposição gradual ao exercício recalibrou o alarme. Agora ele dispara só quando realmente importa (carga excessiva, posição perigosa) — não a cada vez que inclino pra amarrar o sapato.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================
async function main() {
  console.log('\n🏟️  SEED: DOR, FUNÇÃO & SAÚDE POSTURAL\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .eq('slug', 'dor-funcao-saude');

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('slug.ilike.%dor%,name.ilike.%dor%,slug.ilike.%postural%,name.ilike.%postural%');
    if (allArenas?.length) {
      console.log('Arenas encontradas:', allArenas.map(a => `${a.slug} | ${a.name}`));
    }
    return;
  }

  const arena = arenas[0];
  console.log(`✅ Arena: ${arena.name} | ID: ${arena.id} | Posts atuais: ${arena.totalPosts}`);

  // 2. Deletar posts antigos
  const { data: deleted } = await supabase
    .from('Post')
    .delete()
    .eq('arenaId', arena.id)
    .select('id');

  console.log(`🗑️  Posts antigos deletados: ${deleted?.length || 0}`);

  // 3. Inserir novos posts
  const baseTime = new Date('2025-02-07T07:00:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 15 * 60 * 1000);

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
      viewCount: Math.floor(Math.random() * 100) + 22,
      likeCount: post.isAIResponse
        ? Math.floor(Math.random() * 35) + 20
        : Math.floor(Math.random() * 22) + 5,
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

  // 4. Atualizar contador + SEO
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  await supabase
    .from('Arena')
    .update({
      totalPosts: count,
      status: count > 10 ? 'HOT' : 'WARM',
      name: 'Dor, Função e Saúde Postural: Lombar, Cervical, Ombro, Joelho e Ciática — Quando Preocupar',
      description: 'Dor lombar ao acordar, cervicalgia do home office, ciática sem hérnia (piriforme!), ombro com arco doloroso, joelho que estrala, formigamento nas mãos, pernas pesadas e o modelo biopsicossocial da dor. Red flags para saber quando investigar vs quando treinar. Comunidade com triagem baseada em evidência científica e experiências reais.'
    })
    .eq('id', arena.id);

  console.log(`📊 Total posts na arena: ${count}`);
  console.log('📝 Título e descrição SEO atualizados');
  console.log('\n🏟️  Arena Dor, Função & Saúde Postural pronta! ✅\n');
}

main().catch(console.error);
