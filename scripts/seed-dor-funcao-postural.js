require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: Dor, Função & Saúde Postural
// ~32 posts em 8 conversas
// Foco: dor lombar, cervicalgia, ciática, ombro, joelho,
// postura no home office, exercício corretivo, quando é
// urgente, mitos sobre postura, catastrofização da dor
// ============================================================

const POSTS = [

  // ── CONVERSA 1: Dor lombar ao acordar — causas reais ──────
  {
    userId: 'user_sim_002',
    content: `Acordo todo dia com dor lombar que melhora depois de 30-40 minutos em pé e me movimentando. Durante o dia fico bem. Mas toda manhã é o mesmo: dureza e dor na lombar. Já troquei o colchão 2 vezes e não resolveu. O que pode ser?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, dor lombar matinal que melhora com movimento é um padrão clínico específico e tem causas bem definidas — e raramente é o colchão.

**Por que a lombar dói de manhã e melhora ao longo do dia:**

**1. Intumescimento discal noturno:**
- Durante o dia, a gravidade comprime seus discos intervertebrais → eles perdem água e "achatam"
- Durante a noite, deitada e sem carga gravitacional, os discos RE-ABSORVEM água e INCHAM (~1-2cm de altura são ganhos durante o sono)
- Resultado: ao acordar, os discos estão mais "cheios" e pressionam mais as estruturas ao redor
- Essa pressão extra irrita tecidos já sensibilizados → dor
- Ao ficar em pé e se mover, a gravidade + movimento redistribuem o líquido → alívio em 30-60min
- Isso é fisiologia NORMAL — mas em discos já degenerados ou com protrusão, o efeito é amplificado

**2. Rigidez articular das facetas:**
- As articulações facetárias da coluna produzem líquido sinovial com movimento
- 6-8h imóvel → articulações "secas" → rigidez matinal
- Movimento reintroduz lubrificação → melhora progressiva
- Mesmo mecanismo da artrose em qualquer articulação

**3. Posição de dormir:**
- Barriga pra baixo (prono): hiperlordose mantida por horas → compressão facetária posterior
- De lado sem travesseiro entre pernas: a perna de cima puxa a pelve → torção lombar
- De barriga pra cima com pernas estendidas: iliopsoas traciona a lombar em lordose

**4. Inflamação crônica de baixo grau:**
- Cortisol (anti-inflamatório natural) está no ponto mais BAIXO do ciclo ao acordar (~4-6h da manhã)
- Qualquer inflamação subclínica se manifesta mais nesse horário
- O pico de cortisol matinal (6-8h) alivia progressivamente

**Posições de dormir que protegem a lombar:**

**De lado (melhor opção):**
- Travesseiro entre os joelhos (OBRIGATÓRIO — nivela a pelve)
- Joelhos levemente flexionados
- Travesseiro de altura adequada para manter cervical neutra

**De barriga pra cima:**
- Travesseiro FINO sob os joelhos (tira a tração do iliopsoas na lombar)
- Travesseiro cervical que preencha a lordose do pescoço sem elevar demais a cabeça

**Evitar:**
- Barriga pra baixo (pior posição para lombar)

**Rotina matinal anti-dor (5 minutos na cama antes de levantar):**

1. **Joelhos ao peito bilateral**: puxe os dois joelhos em direção ao peito, segure 20s. Repetir 3x. Abre o espaço intervertebral posterior
2. **Rotação de tronco deitada**: joelhos flexionados, deixe cair pros dois lados alternadamente. 10x cada. Mobiliza facetas
3. **Cat-cow na cama**: fique de 4 apoios na cama, arredonde e arqueie lentamente. 10 ciclos. "Lubrifica" os discos
4. **Extensão de McKenzie**: de barriga pra baixo, apoie nos cotovelos e estenda levemente a coluna. 30s, 3x. Redistribui o núcleo do disco anteriormente

**Quando procurar médico (sinais de alerta):**
- Dor que NÃO melhora com movimento ao longo do dia
- Rigidez matinal >60 minutos todos os dias (investigar espondilite anquilosante)
- Dor que irradia para pernas, com formigamento ou perda de força
- Dor noturna que acorda do sono (diferente de dor ao acordar)

Juliana, antes de trocar o colchão pela terceira vez, experimente o travesseiro entre os joelhos + a rotina matinal de 5 minutos. Se a dor for o padrão discal/facetário que descrevi, a melhora costuma ser perceptível na primeira semana.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_019',
    content: `O travesseiro entre os joelhos mudou minhas manhãs. Dormia de lado sem nada há 20 anos. Na primeira noite com travesseiro: 70% menos dor ao acordar. Custo: R$ 0 (usei uma almofada que já tinha). Às vezes a solução é absurdamente simples.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `A explicação do disco absorvendo água à noite fez TUDO fazer sentido. Minha dor é exatamente nos primeiros 30 min e depois some. Vou testar o travesseiro entre os joelhos + rotina matinal essa semana. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Dor cervical e home office ────────────────
  {
    userId: 'user_sim_010',
    content: `Trabalho de casa há 3 anos. Minha cervical é um DESASTRE — dor na nuca, rigidez, dor de cabeça que começa atrás e vai pra frente. Já fiz sessões de quiro, massagem, acupuntura. Alivia por 2-3 dias e volta. Meu setup: notebook na mesa de jantar, sem monitor externo, sem cadeira de escritório.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Thiago, seu setup é um gerador de cervicalgia crônica. Você está efetivamente tratando o SINTOMA repetidamente (quiro, massagem) sem remover a CAUSA (ergonomia + fraqueza muscular). Enquanto a causa existir, o sintoma volta.

**O que o notebook na mesa de jantar faz com sua cervical:**

- Tela do notebook está ~30-40cm ABAIXO da linha dos olhos
- Para olhar a tela: flexão cervical de ~45-60° por 8h/dia
- A cabeça pesa ~5kg em posição neutra. A cada 15° de flexão, a carga na cervical AUMENTA:
  - 0° (neutra): ~5kg
  - 15°: ~12kg
  - 30°: ~18kg
  - 45°: ~22kg
  - 60°: ~27kg ("text neck" máximo)
- 8h/dia com 22-27kg na cervical = degeneração acelerada de discos, facetas e músculos

**A tríade do home office cervical:**
1. **Flexão crônica** → sobrecarga nos discos cervicais + encurtamento dos flexores
2. **Extensores cervicais exaustos** → suboccipitais hipertônicos → cefaleia tensional (sua dor que "vai da nuca pra frente")
3. **Ombros protrusos** → peitoral encurtado, trapézio superior hipertônico, trapézio inferior/serrátil fraco

**Correção do setup (investimento mínimo, impacto máximo):**

**Prioridade 1 — Monitor na altura dos olhos (R$ 0-200):**
- Opção gratuita: empilhe livros/caixas sob o notebook até a borda superior da tela ficar na altura dos olhos. Use teclado e mouse USB externos (R$ 50-100)
- Opção ideal: monitor externo (R$ 400-800) + suporte na altura correta + teclado/mouse
- ISSO SOZINHO resolve 60-70% do problema

**Prioridade 2 — Cadeira (R$ 200-1.500):**
- Não precisa ser "cadeira gamer" cara — precisa ter ajuste de altura e apoio lombar
- A mesa de jantar + cadeira de jantar não tem ajuste nenhum
- Mínimo: assento na altura que permita pés no chão + coxas paralelas ao solo

**Prioridade 3 — Pausas ativas (R$ 0):**
- Regra 30/30/30: a cada 30 min, olhe para algo a 30 metros por 30 segundos (descansa os olhos + muda a posição da cervical)
- A cada 50 min: levante, caminhe 3-5 min, faça retração cervical (queixo pra trás)

**Protocolo de exercícios para cervicalgia de home office:**

**Diariamente (5-8 min, pode fazer na cadeira):**

- **Retração cervical (chin tuck)**: puxe o queixo pra trás criando "papada". Segure 5s. Repita 10x. O exercício mais importante para cervicalgia — fortalece flexores profundos e descomprime a cervical posterior
- **Rotações cervicais lentas**: gire a cabeça lentamente para cada lado, 10x. Mobilidade
- **Alongamento do trapézio superior**: incline a cabeça pro lado, mão puxa suavemente. 30s cada. Alivia tensão do "músculo do estresse"
- **Alongamento do peitoral na porta**: braço a 90° no batente da porta, avance o corpo. 30s cada. Abre os ombros protrusos
- **Compressão escapular**: sente ereto, aperte as escápulas uma contra a outra. Segure 5s. 15x. Ativa trapézio inferior + romboides

**3x/semana (fortalecimento — 10 min):**
- **Retração cervical com resistência**: mesma retração, mas empurre a cabeça contra a mão (isometria). 5x10s
- **Y-T-W deitado**: de barriga pra baixo, faça a forma de Y, T e W com os braços (fortalece trapézio inferior/médio e serrátil). 2x10 cada
- **Remada com elástico**: 3x15 — fortalece todo o posterior que o home office enfraquece
- **Face pull com elástico**: 3x15 — rotadores externos + retratores escapulares

**O que esperar:**
- Correção do setup: melhora perceptível em 1-2 semanas
- Exercícios corretivos: melhora progressiva em 3-6 semanas
- A combinação (setup + exercício) é sinergística — nenhum funciona bem sozinho

Thiago, você está gastando dinheiro em tratamento repetitivo quando o investimento real deveria ser R$ 100-200 em ergonomia + 5 minutos diários de exercício. Remova a causa e o sintoma desaparece.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_018',
    content: `Empilhei 3 resmas de papel A4 sob o notebook e comprei teclado USB por R$ 40. Custo total: R$ 40. Diferença na cervical em 1 semana: ABSURDA. Minha dor de cabeça reduziu 80%. Às vezes o problema é tão óbvio que a gente não vê.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010',
    content: `A tabela de peso da cabeça por ângulo (5kg → 27kg) me assustou. Vou comprar teclado/mouse externo hoje e empilhar livros. E o chin tuck vou fazer a cada hora no trabalho. Obrigado pela honestidade — nenhum quiro me disse isso.`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Ciática sem hérnia — o piriforme e outros ──
  {
    userId: 'user_sim_005',
    content: `Tenho dor que começa no glúteo e desce pela perna esquerda até o joelho. Clássica "ciática". Mas fiz ressonância da coluna e o médico disse que NÃO tenho hérnia de disco. Então de onde vem a dor? Ele mencionou "síndrome do piriforme" mas explicou rápido demais.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rafael, dor ciática SEM hérnia é mais comum do que as pessoas imaginam. O nervo ciático pode ser irritado em vários pontos ao longo de seu trajeto — o disco é o mais famoso mas NÃO o único.

**Anatomia do nervo ciático:**
- O mais longo e espesso do corpo: das raízes L4-S3 até os pés
- Sai da pelve pelo forame isquiático, PASSA POR BAIXO (ou às vezes ATRAVÉS) do músculo piriforme
- Desce pela face posterior da coxa → divide-se em tibial e fibular no joelho

**Causas de ciática SEM hérnia de disco:**

**1. Síndrome do piriforme (provável no seu caso):**
- O piriforme é um pequeno músculo rotador externo profundo do quadril
- Em ~15-20% da população, o nervo ciático passa ATRAVÉS do piriforme (variação anatômica)
- Quando o piriforme está hipertônico, encurtado ou inflamado → comprime o nervo ciático
- Gatilhos: ficar sentado muito tempo, carteira no bolso traseiro, excesso de exercícios de rotação externa, trauma na região glútea

**Teste FAIR (Flexion-Adduction-Internal Rotation):**
Deite de costas → flexione o quadril 60° → aduza (leve o joelho pra dentro) → rode internamente. Se reproduzir a dor ciática → piriforme positivo

**2. Compressão por outros rotadores profundos:**
- Gêmeos superior/inferior, obturador interno
- Mesmo mecanismo do piriforme mas menos diagnosticado

**3. Estenose foraminal (sem hérnia):**
- Estreitamento do forame por osteófitos (bicos de papagaio) ou hipertrofia facetária
- Pode não aparecer como "hérnia" na RM mas comprime a raiz nervosa
- Mais comum >50 anos

**4. Pontos-gatilho miofasciais:**
- Trigger points no glúteo mínimo podem referir dor que SIMULA ciática
- Dor desce pela lateral da coxa e perna — padrão muito similar ao ciático
- Não é compressão neural — é dor referida muscular

**Protocolo para síndrome do piriforme:**

**Fase 1 — Descompressão (diariamente):**

- **Liberação miofascial**: sente sobre uma bola de tênis/lacrosse posicionada no glúteo profundo (ponto de dor). Mantenha 60-90s até sentir o músculo "soltar". Role lentamente
- **Alongamento do piriforme**: deitada, cruze o tornozelo esquerdo sobre o joelho direito → puxe o joelho direito em direção ao peito. 30-45s, 3x. Deve sentir alongamento profundo no glúteo
- **Alongamento "figura 4" sentada**: sentado, cruze o tornozelo no joelho oposto e incline o tronco pra frente. 30s cada lado
- **NÃO exagere no alongamento**: piriforme inflamado pode piorar com alongamento excessivo. Dor LEVE durante alongamento: ok. Dor forte: pare

**Fase 2 — Fortalecer o que está fraco (3x/semana):**

O piriforme frequentemente fica hipertônico por COMPENSAR fraqueza do glúteo médio e máximo.

- **Clamshell**: 3x15 cada (ativa rotadores externos sem sobrecarregar piriforme)
- **Ponte de glúteo**: 3x15 (ativa máximo, reduz demanda no piriforme)
- **Monster walk**: 2x10 cada direção
- **Dead bug**: 3x10 cada (estabilização lombo-pélvica)

**Fase 3 — Modificação de hábitos:**
- Retire a carteira do bolso traseiro (compressão direta no piriforme quando sentado)
- Levante a cada 45-60 min se trabalha sentado
- Evite cruzar as pernas cronicamente
- Almofada com recorte isquiático (tipo "donut") se senta muitas horas

**Timeline:**
- Liberação + alongamento: alívio parcial em 1-2 semanas
- Fortalecimento completo: melhora significativa em 4-8 semanas
- Se não melhorar em 6-8 semanas → reavaliar com médico (pode não ser piriforme)

**Quando NÃO é piriforme (sinais de alerta):**
- Perda de força progressiva no pé/perna
- Perda de sensibilidade em "sela" (períneo) → URGÊNCIA
- Perda de controle de bexiga/intestino → EMERGÊNCIA (cauda equina)
- Dor que piora progressivamente sem resposta a tratamento conservador

Rafael, a RM sem hérnia é na verdade uma BOA NOTÍCIA — síndrome do piriforme tem resolução conservadora excelente. Bola de lacrosse + fortalecimento do glúteo + modificação de hábitos resolvem a maioria dos casos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_015',
    content: `Passei 2 anos achando que tinha hérnia por causa da "ciática". Quando a RM veio limpa, fiquei confuso. Fisio diagnosticou piriforme, fiz 6 semanas de liberação com bola + fortalecimento de glúteo → 90% de melhora. O piriforme é o grande impostor da ciática.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `O teste FAIR reproduziu EXATAMENTE minha dor. Piriforme confirmado. A bola de lacrosse no glúteo profundo doeu muito na primeira vez — claramente o músculo estava super tenso. Vou seguir o protocolo. E sim, carrego carteira no bolso traseiro há 15 anos. Tirando agora!`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Ombro — dor ao levantar o braço ──────────
  {
    userId: 'user_sim_006',
    content: `Sinto dor no ombro direito quando levanto o braço acima da cabeça — especialmente no arco entre 60° e 120°. Depois de 120° melhora. Peguei medo de treinar ombro na academia. O que pode ser?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Patricia, o padrão de dor entre 60-120° que alivia acima disso é clássico de **impingement (impacto) subacromial** — a condição de ombro mais comum em praticantes de musculação.

**O que acontece mecanicamente:**

Entre 60-120° de abdução/flexão do braço, o espaço subacromial (entre o acrômio e a cabeça do úmero) atinge seu MENOR tamanho. Estruturas que passam por esse espaço — tendão do supraespinhal, bursa subacromial — são comprimidas ("pinçadas").

Acima de 120°, a escápula já rotou o suficiente para abrir espaço novamente → alívio.

Esse "arco doloroso" (60-120°) é sinal clínico clássico de impingement.

**Causas mais comuns em quem treina:**

**1. Disfunção da ritmo escapulotorácico:**
- Para o braço subir completamente, a escápula precisa rotar superiormente em sincronia
- Se a escápula "atrasa" (discinesia escapular), o espaço subacromial não abre a tempo → pinçamento
- Causa: serrátil anterior fraco + trapézio inferior fraco + peitoral menor encurtado

**2. Desequilíbrio muscular clássico do "bro split":**
- Excesso de treino de empurrar (supino, desenvolvimento) → rotadores internos fortes, peitoral encurtado
- Pouco treino de puxar → rotadores externos fracos, retratores escapulares fracos
- Resultado: a cabeça do úmero migra anteriormente e superiormente → diminui espaço subacromial

**3. Supraespinhal degenerado/inflamado:**
- O tendão do supraespinhal é o mais vulnerável — fica comprimido cronicamente no arco doloroso
- Pode ter tendinopatia (degeneração), bursite associada, ou ambos

**O que NÃO fazer:**
- 🔴 Treinar "empurrando a dor" — piora inflamação
- 🔴 Mais supino e desenvolvimento com arco de dor
- 🔴 Elevar peso acima da cabeça sem tratar a causa
- 🔴 Ignorar achando que "passa" — tendinopatias crônicas demoram muito mais pra resolver

**Protocolo de correção e retorno ao treino:**

**Fase 1 — Reduzir irritação (semanas 1-2):**
- Evitar movimentos que reproduzam a dor (especialmente acima da cabeça com carga)
- Gelo 15 min após treino/atividade irritante
- PODE treinar abaixo do arco doloroso (remada, supino parcial até 60° sem dor)

**Fase 2 — Correção escapular e do manguito (semanas 2-8):**

*Rotadores externos (fortalecer):*
- **Rotação externa com elástico a 0°**: cotovelo ao lado do corpo, rode pra fora contra elástico. 3x15 cada. Lento e controlado
- **Rotação externa a 90°** (posição de scarecrow): cotovelo na altura do ombro, rode pra trás. 3x12. Mais específico para o arco doloroso
- **Side-lying external rotation**: deitado de lado, halter leve, rode pra cima. 3x15

*Escápula (estabilizar):*
- **Serrátil push-up plus**: flexão normal + no final protraia as escápulas (empurre mais). 3x10
- **Y-T-W deitado ou inclinado**: 2x10 cada posição. Trapézio inferior + médio
- **Face pull com elástico**: 3x15. Retração + rotação externa combinada — o melhor exercício corretivo para ombro de quem treina

*Alongar o que está encurtado:*
- **Peitoral menor no batente da porta**: 30s cada lado, 2x/dia
- **Cápsula posterior do ombro (sleeper stretch)**: deitado de lado, empurre o antebraço em direção ao solo. 30s, 2x cada

**Fase 3 — Retorno progressivo ao treino (semanas 6-12):**
- Reintroduzir movimentos acima da cabeça com carga LEVE
- Progridir 10% de carga/semana se sem dor
- Manter rotação externa e face pull PERMANENTEMENTE no treino (prevenção)
- Regra: proporção puxar/empurrar de pelo menos 2:1 até normalizar

**Proporção ideal no treino (prevenção de impingement):**
- Para cada série de empurrar (supino, desenvolvimento), faça 1,5-2 séries de puxar (remada, face pull, rotação externa)
- Isso equilibra a força dos rotadores e retratores

Patricia, impingement tratado corretamente tem prognóstico excelente. A maioria resolve em 6-12 semanas com fortalecimento adequado. Não precisa abandonar o treino — precisa EQUILIBRAR.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_004',
    content: `Face pull salvou meus ombros. Fiz supino pesado por anos sem nenhum exercício de rotação externa. Desenvolvimentei impingement bilateral. 8 semanas de face pull + rotação externa + proporção 2:1 e voltei a treinar sem dor. Agora face pull é OBRIGATÓRIO em todo treino de superior.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `O "arco doloroso" de 60-120° é exatamente minha dor! E o desequilíbrio empurrar/puxar faz total sentido — faço muito supino e desenvolvimento e quase nada de rotação externa. Vou implementar o protocolo e a proporção 2:1. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Joelho que estala — quando preocupar ──────
  {
    userId: 'user_sim_014',
    content: `Meu joelho estala toda vez que agacho — um estalo audível, tipo "crack". Não dói. Mas preocupa. É sinal de desgaste? Preciso parar de agachar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rodrigo, essa é uma das dúvidas mais comuns na musculação e a resposta curta é: **estalo SEM dor geralmente NÃO é problema.**

**Tipos de estalidos articulares:**

**1. Crepitação fisiológica (inofensiva):**
- Som de "estalo" ou "crack" sem dor
- Causado por: bolhas de gás (nitrogênio) que se formam e colapsam no líquido sinovial durante movimento
- Mesmo mecanismo de "estalar os dedos"
- NÃO causa artrose, NÃO indica desgaste, NÃO precisa de tratamento
- **Prevalência: ~30-40% da população tem crepitação no joelho sem nenhuma patologia**

**2. Crepitação patológica (atenção):**
- Acompanhada de DOR durante ou após o estalo
- Som mais contínuo, tipo "areia/papel amassado" durante o movimento
- Pode indicar: condromalácia patelar, desgaste de cartilagem, lesão meniscal
- Precisa de avaliação médica

**3. Snap/ressalto (geralmente tendão):**
- Estalo de "ressalto" em ponto específico do arco de movimento
- Geralmente é um tendão passando sobre proeminência óssea
- Comum: banda iliotibial sobre epicôndilo lateral, tendão poplíteo
- Se sem dor: geralmente benigno

**A classificação prática:**

| Sintoma | Risco | Ação |
|---|---|---|
| Estalo SEM dor, SEM inchaço | Muito baixo | Continuar treinando |
| Estalo COM dor leve e transitória | Baixo-moderado | Observar, modificar amplitude se necessário |
| Estalo COM dor persistente | Moderado | Avaliar com profissional |
| Estalo + dor + inchaço + falseio | Alto | Parar e consultar ortopedista |
| Crepitação contínua tipo "areia" + dor | Moderado-alto | Consultar ortopedista + imagem |

**Sobre condromalácia patelar (a preocupação mais comum):**
- É amolecimento/degeneração da cartilagem sob a patela
- Grau 1-2: muito comum e frequentemente assintomático
- Estudos de RM em pessoas ASSINTOMÁTICAS: ~30-40% têm alterações de cartilagem sem NENHUM sintoma
- Crepitação + dor anterior do joelho ao agachar/descer escada = condromalácia sintomática
- Crepitação SEM dor = provavelmente NÃO é condromalácia relevante

**Sobre agachamento e saúde do joelho:**
- Mito persistente: "agachamento destrói os joelhos"
- Realidade: agachamento com técnica adequada PROTEGE os joelhos
- Estudo de Hartmann et al. (2013): agachamento profundo não aumenta risco de lesão de joelho em indivíduos saudáveis
- Fortalecimento de quadríceps e isquiotibiais via agachamento REDUZ risco de lesão ligamentar

**Quando o estalo DEVE preocupar:**
- Apareceu de repente após trauma/lesão
- Acompanha dor que piora progressivamente
- Joelho incha após atividade
- Sensação de "travamento" ou "falseio" (joelho "falhando")
- Limitação de amplitude de movimento

Rodrigo, seu joelho estala sem dor → continue agachando tranquilamente. Se um dia aparecer dor acompanhando o estalo, aí sim vale investigar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `Meus joelhos estalam desde os 18 anos. Tenho 34 e agacho 120kg sem dor. Meu ortopedista explicou exatamente isso — bolhas de gás no líquido sinovial, completamente normal. Não tem relação com desgaste. Parem de ter medo de estalo sem dor!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_014',
    content: `Alívio total. Ia parar de agachar por medo do estalo. A classificação por sintomas ajuda muito — estalo sem dor e sem inchaço = tranquilo. Se mudar, consulto. Simples assim. Valeu!`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Formigamento nas mãos durante treino ─────
  {
    userId: 'user_sim_001',
    content: `Nas últimas semanas minhas mãos formigam durante o treino de supino e desenvolvimento. Especialmente o dedo mínimo e anelar da mão esquerda. Passa depois de alguns minutos. Devo me preocupar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ana Paula, formigamento no dedo mínimo e anelar é um padrão ESPECÍFICO que aponta para o **nervo ulnar** — e sim, merece atenção.

**Mapa dos nervos da mão:**

Cada dedo é inervado por nervos diferentes. O padrão de formigamento indica QUAL nervo está comprometido:
- **Polegar + indicador + médio** → nervo mediano (síndrome do túnel do carpo)
- **Mínimo + metade do anelar** → nervo ulnar (compressão no cotovelo ou punho)
- **Toda a mão** → compressão cervical (raiz C6-C7-C8)

Seu padrão (mínimo + anelar) = **nervo ulnar**.

**Onde o nervo ulnar pode ser comprimido:**

**1. Cotovelo (síndrome do túnel cubital) — mais comum em quem treina:**
- O nervo ulnar passa num sulco raso atrás do epicôndilo medial (a "canaleta" do cotovelo — onde dói quando bate o "cotovelo engraçado")
- Na posição de supino: cotovelo flexionado + carga compressiva = nervo pinçado
- No desenvolvimento: cotovelo flexionado em carga máxima = pico de compressão
- Pior com carga pesada e alta repetição

**2. Punho (canal de Guyon):**
- Compressão na base da palma
- Pior com grip muito apertado na barra
- Ciclistas também sofrem por apoiar peso no guidão

**3. Cervical (raiz C8-T1):**
- Se o formigamento NÃO está relacionado à posição do cotovelo/punho → investigar cervical
- Geralmente acompanha dor no pescoço/ombro

**O que fazer:**

**Imediato — Modificações no treino:**
- **Supino**: evite flexão excessiva do cotovelo. Pegada não muito fechada. Descanse os cotovelos estendidos entre séries
- **Desenvolvimento**: reduza a amplitude se o formigamento aparece no ponto mais baixo (flexão máxima do cotovelo)
- **Grip**: relaxe o aperto — muitos apertam a barra com mais força que o necessário
- **Cotoveleira de compressão leve**: pode ajudar a reduzir irritação durante treino

**Corretivos:**
- **Nerve flossing ulnar (deslizamento neural)**: estenda o braço ao lado, cotovelo reto, flexione e estenda o punho lentamente enquanto inclina a cabeça pro lado oposto. 10x, 2x/dia. "Desliza" o nervo pelo trajeto
- **Evite dormir com cotovelo totalmente flexionado**: enrole uma toalha ao redor do cotovelo à noite para impedir flexão >90° (a compressão noturna é uma causa comum)
- **Fortalecimento de estabilizadores escapulares**: disfunção escapular pode contribuir para tensão neural no membro superior

**Quando procurar médico:**
- Formigamento que persiste FORA do treino
- Perda de força na mão (dificuldade de segurar objetos, abrir potes)
- Atrofia muscular na mão (espaço entre polegar e indicador "afundando")
- Formigamento progressivamente pior

Ana Paula, o padrão é clássico de compressão ulnar no cotovelo durante exercícios de empurrar. Na maioria dos casos, modificação da técnica + nerve flossing resolvem. Mas se persistir ou piorar fora do treino, investigue com um ortopedista.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Tive exatamente isso — mínimo e anelar formigando no supino. Era compressão do ulnar no cotovelo. O nerve flossing + parar de dormir com o cotovelo dobrado (enrolei uma toalha) resolveu em 3 semanas. Simples mas eficaz.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `O mapa de nervos por dedo é INCRÍVEL — nunca soube que cada dedo indica um nervo diferente. Mínimo + anelar = ulnar. Vou fazer o nerve flossing e testar a toalha no cotovelo à noite. Se não melhorar em 3-4 semanas, vou no ortopedista. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Mitos sobre postura — "postura perfeita" não existe ──
  {
    userId: 'user_sim_018',
    content: `Fui num quiropraxista que olhou minha postura e disse que minha cifose torácica está "aumentada", minha cabeça está "anteriorizada" e minha pelve "desalinhada". Saí de lá achando que minha coluna é um desastre. Mas eu NÃO tenho dor. Devo me preocupar com postura "imperfeita" se não tenho sintoma?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Marcelo, essa pergunta toca em um dos temas mais debatidos (e mal compreendidos) da saúde musculoesquelética moderna. A resposta pode te surpreender.

**O paradigma está mudando:**

**Visão ANTIGA (ainda dominante na prática clínica):**
"Postura imperfeita = dor futura. Corrija tudo ou vai ter problemas."

**Visão ATUAL (baseada em evidência dos últimos 10-15 anos):**
"A correlação entre postura estática e dor é FRACA. Não existe 'postura perfeita'. O corpo é resiliente e adaptável."

**O que as revisões sistemáticas mostram:**

**1. Cifose torácica e dor:**
- Estudo de Christensen & Hartvigsen (2008): **NÃO há correlação consistente** entre grau de cifose torácica e dor nas costas
- Muitas pessoas com cifose "aumentada" são assintomáticas
- Muitas pessoas com postura "perfeita" têm dor

**2. Anteriorização da cabeça e cervicalgia:**
- Richards et al. (2016): a posição da cabeça em repouso **NÃO prediz** dor cervical de forma confiável
- Algumas pessoas com cabeça bem anteriorizada não têm dor nenhuma
- Há grande variação individual normal

**3. "Alinhamento" pélvico:**
- Lederman (2011): assimetrias pélvicas e posturais são **normais e ubíquas**
- Tentar "corrigir" toda assimetria é como tentar fazer todo rosto perfeitamente simétrico — biologicamente irreal

**Então postura não importa?**

Não é isso. A nuance é:
- **Postura ESTÁTICA** (como você se posiciona parado) tem pouca correlação com dor
- **Postura SUSTENTADA** (ficar 8h na mesma posição sem mover) tem relação com dor — mas pela IMOBILIDADE, não pela "imperfeição"
- **Capacidade de mover-se entre posições** importa mais que a posição em si

**O que realmente prediz dor musculoesquelética:**
- Sedentarismo e inatividade física ⭐⭐⭐⭐⭐
- Estresse, ansiedade e depressão ⭐⭐⭐⭐⭐
- Crenças negativas sobre o corpo ("minha coluna é frágil") ⭐⭐⭐⭐
- Histórico de dor prévia ⭐⭐⭐⭐
- Sono ruim ⭐⭐⭐⭐
- Imobilidade prolongada ⭐⭐⭐
- Postura estática "imperfeita" ⭐ (fraca)

**O perigo do diagnóstico catastrofizante:**

Quando um profissional olha sua postura e lista "defeitos" em alguém SEM dor, pode criar:
- **Nocebo**: a informação negativa cria expectativa de dor → o cérebro começa a monitorar aquela região → pode GERAR dor que não existia
- **Cinesiofobia**: medo de se mover "errado" → evitação de movimento → mais fraqueza → mais dor
- **Dependência de tratamento**: "preciso de sessões semanais pra alinhar" quando o corpo estava funcionando perfeitamente

**O que VALE a pena para postura:**
- Se MOVER regularmente (o melhor "corretor postural" é exercício)
- Variar posições ao longo do dia (não ficar 8h estático)
- Fortalecer o corpo de forma equilibrada (musculação, calistenia, yoga etc.)
- NÃO se fixar em "postura perfeita" — buscar corpo FORTE e MÓVEL

Marcelo, você não tem dor. Seu corpo está funcionando. Mover-se regularmente e fortalecer-se é infinitamente mais valioso do que perseguir uma "postura perfeita" que não existe.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `OBRIGADA por esse post. Um quiro me disse que minha coluna estava "toda torta" e que eu precisava de 24 sessões. Eu não tinha DOR NENHUMA. Fui por 10 sessões, gastei R$ 2.000 e no final ainda estava "torta" (porque é minha anatomia normal). A indústria do medo postural lucra com nossa insegurança.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_018',
    content: `O conceito de nocebo é assustador — a informação negativa do quiro pode ter CRIADO preocupação onde não existia. Eu literalmente saí da sessão "sentindo" minha postura ruim pela primeira vez. Vou focar em me mover e ficar forte em vez de perseguir perfeição postural. Valeu!`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Exercício como tratamento de dor crônica ──
  {
    userId: 'user_sim_012',
    content: `Tenho dor lombar crônica há 4 anos. Já fiz de tudo: quiro, fisio, acupuntura, pilates, infiltração. Melhora temporariamente e volta. Meu médico agora disse que minha melhor opção é "exercício regular e consistente". Mas como me exercitar com DOR? Parece contraditório.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Roberta, seu médico está alinhado com a evidência mais recente — e entendo que parece contraditório. Vou explicar por que exercício é o tratamento de primeira linha para dor lombar crônica e como fazer quando dói.

**O que a ciência diz (de forma inequívoca):**

**Diretrizes internacionais (NICE, ACP, WHO) para dor lombar crônica:**
- Exercício é recomendado como **tratamento de primeira linha**
- ACIMA de medicação, massagem, manipulação, acupuntura
- Não é "bom complemento" — é o PILAR central do tratamento

**Meta-análise de Hayden et al. (2021) — Cochrane:**
- Exercício é eficaz para reduzir dor E incapacidade em dor lombar crônica
- Nenhuma modalidade específica é superior a outra (o que importa é FAZER, não o tipo)
- A consistência é mais importante que a intensidade

**Por que exercício funciona para dor crônica:**

**1. Mecanismo físico:**
- Fortalece musculatura estabilizadora → melhor suporte articular
- Melhora mobilidade e flexibilidade → menos rigidez
- Nutre discos intervertebrais (o disco não tem vascularização — depende de movimento para trocar nutrientes)

**2. Mecanismo neurológico (o mais importante em dor CRÔNICA):**
- Dor crônica envolve **sensibilização central**: o sistema nervoso fica "hipersensível" e amplifica sinais de dor
- Exercício regular **dessensibiliza** o sistema nervoso ao longo do tempo
- Produz endorfinas, serotonina e endocanabinoides (analgesia natural)
- Muda a forma como o cérebro processa dor — literalmente remodela redes neurais

**3. Mecanismo psicológico:**
- Exercício reduz catastrofização (acreditar que a dor significa dano grave)
- Reduz cinesiofobia (medo de movimento)
- Melhora autoeficácia ("meu corpo é capaz")
- Trata ansiedade e depressão que frequentemente acompanham dor crônica

**Como se exercitar COM dor crônica:**

**Regra fundamental — "Hurt ≠ Harm" (dor ≠ dano):**
- Em dor crônica, a dor NÃO significa que você está causando dano
- A sensibilização central faz o corpo "gritar" com estímulos que NÃO são perigosos
- Permitir um aumento LEVE e temporário da dor durante exercício é aceitável (2-3 pontos numa escala 0-10)
- A dor NÃO deve ser significativamente pior 24h após o exercício

**Protocolo de exposição gradual:**

**Semana 1-2: Linha de base ("o que consigo sem piora significativa"):**
- Caminhe até a dor aumentar 2 pontos → pare → esse é seu baseline
- Se são 8 minutos: ok, 8 minutos é o começo. Sem julgamento
- Faça 3-5x/semana nesse baseline

**Semana 3-4: Aumento de 10-15%:**
- De 8 para 9-10 minutos
- Se a dor não piorar 24h após: manter
- Se piorar: volte ao anterior por mais 1 semana

**Mês 2-3: Adicione exercícios de fortalecimento:**
- Dead bug: 2x8 (core profundo — protege a lombar)
- Ponte de glúteo: 2x10
- Bird-dog: 2x8 cada
- Comece com volume MÍNIMO e progrida lentamente

**Mês 3-6: Progressão para exercícios mais desafiadores:**
- Agachamento goblet leve
- Remada
- Caminhada 20-30 minutos
- O objetivo é construir CONFIANÇA no corpo tanto quanto força

**O que esperar (honestamente):**
- Semanas 1-4: pode NÃO melhorar (ou até ter leves pioras temporárias). Normal
- Mês 2-3: melhora gradual começa a se consolidar
- Mês 4-6: a maioria das pessoas tem redução significativa de dor e incapacidade
- A melhora NÃO é linear — tem dias bons e ruins. A tendência geral é que importa

Roberta, 4 anos de dor crônica tratada com intervenções passivas (onde o profissional FAZ algo em você) e melhora temporária → é hora de intervenções ATIVAS (onde VOCÊ faz o trabalho). O exercício é o tratamento. A consistência é a prescrição.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Dor lombar crônica de 5 anos. Gastei >R$ 15.000 em quiro + fisio passiva + acupuntura. Alívio temporário, sempre voltava. Quando comecei exercício regular (pilates + musculação 3x/semana) de forma CONSISTENTE, em 4 meses minha dor caiu de 7/10 para 2-3/10. É o tratamento que funciona — e o mais barato.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `"Hurt ≠ Harm" é a frase que eu precisava ouvir. Tenho MEDO de me mover porque associo qualquer dor com "estou me machucando". Mas em 4 anos de proteção a dor não sumiu — talvez seja hora de enfrentar. Vou começar pelo baseline de caminhada. Obrigada por essa perspectiva.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🔍 Buscando arena "Dor, Função & Saúde Postural"...');

  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%dor%,slug.ilike.%postural%,name.ilike.%dor%função%,name.ilike.%postural%');

  if (arenaError) {
    console.error('❌ Erro ao buscar arena:', arenaError);
    return;
  }

  if (!arenas || arenas.length === 0) {
    console.log('⚠️  Arena não encontrada. Tentando busca alternativa...');
    const { data: retry } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('name.ilike.%dor%,name.ilike.%saúde postural%,slug.ilike.%saude%');

    if (!retry || retry.length === 0) {
      console.log('⚠️  Arena não encontrada. Arenas disponíveis:');
      const { data: all } = await supabase.from('Arena').select('slug, name').order('name');
      all?.forEach(a => console.log(`  - ${a.slug} | ${a.name}`));
      return;
    }
    var arena = retry[0];
  } else {
    var arena = arenas[0];
  }

  console.log(`✅ Arena encontrada: "${arena.name}" (${arena.slug})`);
  console.log(`   Posts atuais: ${arena.totalPosts}`);

  console.log('🗑️  Limpando posts antigos...');
  const { error: deleteError } = await supabase
    .from('Post')
    .delete()
    .eq('arenaId', arena.id);

  if (deleteError) {
    console.error('❌ Erro ao deletar:', deleteError);
    return;
  }

  console.log(`📝 Inserindo ${POSTS.length} posts...`);
  const baseTime = new Date('2025-02-06T08:00:00Z');

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + (i * 18 * 60 * 1000));

    const { error: insertError } = await supabase.from('Post').insert({
      id: randomUUID(),
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

    if (insertError) {
      console.error(`❌ Erro no post ${i + 1}:`, insertError.message);
    } else {
      const label = post.isAIResponse ? '🤖 IA' : `👤 ${post.userId}`;
      console.log(`  ✅ Post ${i + 1}/${POSTS.length} — ${label}`);
    }
  }

  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  await supabase.from('Arena').update({ totalPosts: count }).eq('id', arena.id);
  console.log(`\n🎉 Concluído! ${count} posts na arena "${arena.name}"`);
}

main().catch(console.error);
