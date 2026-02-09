require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: Glúteo Médio / Valgo
// ~32 posts em 8 conversas
// Foco: fraqueza do glúteo médio, valgo dinâmico de joelho,
// sinal de Trendelenburg, hip drop na corrida, lesão de LCA,
// joelho pra dentro no agachamento, ativação, fortalecimento,
// diferença glúteo médio vs máximo, impacto estético e funcional
// ============================================================

const POSTS = [

  // ── CONVERSA 1: "Meu joelho vai pra dentro no agachamento" ──
  {
    userId: 'user_sim_003',
    content: `Toda vez que agacho com carga, meus joelhos vão pra dentro na subida — principalmente o esquerdo. Meu personal disse que é "valgo dinâmico" e que o problema não é o joelho, é o quadril. Mas como? Se o joelho que mexe, como o problema tá no quadril?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Mariana, seu personal está absolutamente certo — e essa confusão é universal. O joelho é a VÍTIMA, não o criminoso.

**O que é valgo dinâmico de joelho:**

O joelho "cair pra dentro" durante movimentos de cadeia fechada (agachamento, aterrissagem, subir escada) é chamado de **valgo dinâmico**. Diferente do valgo estrutural (genu valgum — joelhos permanentemente em X), o valgo dinâmico acontece SÓ durante o movimento e é causado por **fraqueza/inibição muscular no quadril**.

**A cadeia biomecânica do valgo:**

1. O glúteo médio é responsável por **abduzir e rotar externamente o fêmur**
2. Quando está fraco ou inibido → o fêmur roda INTERNAMENTE e aduz durante carga
3. O fêmur rodando internamente PUXA o joelho pra dentro
4. O joelho não decide ir pra dentro — ele é ARRASTADO pela posição do fêmur
5. A tíbia segue o fêmur → pronação excessiva do pé → arco plantar colapsa

**Toda a cadeia: quadril fraco → fêmur roda → joelho colapsa → tornozelo prona → arco cai**

O joelho é o elo do meio que sofre as consequências de cima (quadril) e de baixo (tornozelo).

**Por que é perigoso:**

- **Sobrecarga do LCA (Ligamento Cruzado Anterior):** valgo é o mecanismo #1 de lesão de LCA, especialmente em mulheres
- **Síndrome patelofemoral:** a patela trackeia mal quando o fêmur roda internamente → dor anterior do joelho
- **Desgaste meniscal:** carga assimétrica no menisco medial
- **Condromalácia:** cartilagem sob a patela se desgasta assimetricamente
- Mulheres têm **2-6x mais risco** de lesão de LCA que homens — em grande parte pelo valgo dinâmico mais prevalente (pelve mais larga, ângulo Q maior, menor ativação de glúteo médio)

**O teste visual (filme-se):**

1. Agachamento frontal sem carga — filme de frente
2. Single leg squat (agachamento em uma perna) — filme de frente
3. Drop jump (pule de um step e aterrisse com as duas pernas) — filme de frente

Observe: os joelhos passam pra dentro da linha dos pés na descida/aterrissagem? Se sim → valgo dinâmico presente.

**Correção — o protocolo anti-valgo:**

**Fase 1 — Ativação do glúteo médio (semanas 1-3):**

Antes de fortalecer, precisa ATIVAR — muitas pessoas têm o músculo "desligado" (amnésia glútea).

- **Clamshell com miniband**: deitada lateral, joelhos flexionados 90°, pés juntos, abra os joelhos contra a resistência. 3x15 cada lado. SINTA o lateral do quadril, não a coxa
- **Side-lying hip abduction**: deitada lateral, perna de cima estendida, eleve lateralmente 30-45°. 3x15 cada. Sem rodar o quadril pra trás
- **Banded monster walk**: miniband nos tornozelos, posição de semi-agachamento, caminhe lateralmente. 3x10 passos cada direção

**Fase 2 — Fortalecimento (semanas 3-8):**

- **Band walk lateral**: band nos joelhos, agachamento parcial, passos laterais. 3x12 cada
- **Single leg glute bridge**: ponte unilateral — exige estabilização pélvica. 3x12 cada
- **Cable/band hip abduction em pé**: 3x15 cada
- **Step-up lateral em banco**: suba lateralmente, controle a descida. 3x10 cada
- **Curtsy lunge**: 3x10 cada — combina abdução com carga

**Fase 3 — Integração no agachamento (semanas 6-12):**

- **Agachamento com miniband nos joelhos**: a band força você a empurrar os joelhos PRA FORA durante todo o movimento. 3x10-12 com carga leve-moderada
- **Goblet squat com pausa**: segure 3s no fundo, mantendo joelhos ativamente pra fora. 3x8
- **Single leg squat to box**: agachamento unilateral controlado sentando num banco. 3x8 cada — o teste definitivo de controle de valgo

**Cue mental durante agachamento:**
"Empurre o chão pra fora com os pés" — essa instrução ativa automaticamente os abdutores e rotadores externos do quadril, corrigindo o valgo sem pensar no joelho.

Mariana, corrija o quadril e o joelho se corrige sozinho. É upstream thinking — resolver a causa, não o sintoma.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `O cue de "empurrar o chão pra fora" mudou meu agachamento da noite pro dia. Literalmente. Quando eu pensava "joelhos pra fora" ficava artificial. Quando penso "pés empurram o chão pro lado", os joelhos vão pro lugar certo automaticamente.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `A cadeia biomecânica (quadril → fêmur → joelho → tornozelo) finalmente fez sentido. Meu personal me deu a miniband e vou usar em TODOS os agachamentos por enquanto. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Glúteo médio vs máximo — a diferença que ninguém ensina ──
  {
    userId: 'user_sim_001',
    content: `Treino glúteo 3x/semana com hip thrust, agachamento e stiff pesados. Meu bumbum cresceu mas minha fisio disse que meu glúteo médio é FRACO. Como pode? Treino glúteo pesado! Qual a diferença entre glúteo médio e máximo na prática?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ana Paula, essa é uma das confusões mais comuns e consequentes no treinamento. Treinar "glúteo" pesado sem especificar QUAL glúteo é como dizer "treino braço" sem diferenciar bíceps de tríceps — são músculos diferentes com funções diferentes.

**Anatomia funcional simplificada:**

**Glúteo MÁXIMO (gluteus maximus):**
- O MAIOR músculo do corpo humano
- Fibras predominantemente verticais
- Função principal: **extensão do quadril** (empurrar pra trás) + rotação externa
- Exercícios clássicos: hip thrust, agachamento, stiff, búlgaro, extensão de quadril
- É o músculo que dá **volume e projeção** ao bumbum
- O que TODO treino de "glúteo" foca

**Glúteo MÉDIO (gluteus medius):**
- Músculo em forma de LEQUE na lateral do quadril
- Fibras predominantemente horizontais/diagonais
- Função principal: **abdução do quadril** (perna pro lado) + **estabilização pélvica** em apoio unipodal
- Exercícios específicos: abdução lateral, clamshell, monster walk, step-up lateral
- É o músculo que dá a **curva lateral** do quadril e ESTABILIZA a pelve
- O que quase NINGUÉM treina adequadamente

**Glúteo MÍNIMO (gluteus minimus):**
- O menor, profundo ao médio
- Função: sinergista do médio na abdução e estabilização
- Ativado nos mesmos exercícios do médio

**Por que o máximo pode ser forte com o médio fraco:**

Hip thrust, agachamento e stiff são movimentos de **extensão** no plano sagital (frente-trás). O glúteo médio trabalha primariamente no plano FRONTAL (lado-lado). São planos de movimento diferentes.

Analogia: é como ter bíceps enorme e tríceps fraco porque só faz rosca e nunca faz extensão. São "braço", mas músculos diferentes.

**Análise dos exercícios comuns:**

| Exercício | Glúteo Máximo | Glúteo Médio |
|---|---|---|
| Hip Thrust | ⭐⭐⭐⭐⭐ | ⭐ |
| Agachamento | ⭐⭐⭐⭐ | ⭐⭐ |
| Stiff/RDL | ⭐⭐⭐⭐ | ⭐ |
| Búlgaro | ⭐⭐⭐⭐ | ⭐⭐⭐ (estabilização) |
| Clamshell | ⭐ | ⭐⭐⭐⭐ |
| Abdução lateral | ⭐ | ⭐⭐⭐⭐⭐ |
| Monster walk | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Single leg squat | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Side plank c/ abdução | ⭐ | ⭐⭐⭐⭐⭐ |
| Step-up lateral | ⭐⭐ | ⭐⭐⭐⭐ |

**A maioria dos treinos de glúteo tem 5 exercícios de extensão e ZERO de abdução.** Resultado: máximo hipertrofiado, médio atrofiado.

**Impacto estético do glúteo médio:**

O glúteo médio é responsável pela **curvatura lateral do quadril** — aquele arredondamento visto de frente. Sem ele:
- Bumbum "pontudo" visto de trás (projeção só do máximo)
- "Hip dip" mais pronunciado (depressão lateral entre ilíaco e trocanter)
- Falta de proporção vista de frente

Com ele forte:
- Quadril arredondado visto de frente
- Transição suave do quadril para a coxa
- Proporção equilibrada em todos os ângulos

**Como integrar no seu treino de 3x/semana:**

Cada sessão de glúteo: adicione **2 exercícios de abdução/estabilização lateral** antes dos compostos. Exemplos:
- Clamshell 2x15 + Monster walk 2x10 → depois hip thrust, agachamento etc.
- Total extra: 8-10 minutos por sessão
- Em 6-8 semanas: diferença funcional E estética perceptível

Ana Paula, adicione glúteo médio com a mesma seriedade que treina máximo. Seu quadril, seus joelhos e sua estética agradecerão.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `A tabela de exercícios com estrelas é OURO. Olhei meu treino de glúteo e confirmou: 100% extensão, 0% abdução. Adicionei clamshell + monster walk como aquecimento há 2 meses e já sinto que meu quadril "segura" melhor no agachamento. E esteticamente, a lateral do quadril tá mais cheia.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Finalmente entendi por que meu bumbum é "grande de lado" mas "fino de frente". É o médio! Vou adicionar os exercícios de abdução antes de todo treino. A analogia de bíceps forte com tríceps fraco é perfeita.`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Valgo e risco de lesão de LCA em mulheres ──
  {
    userId: 'user_sim_007',
    content: `Minha filha de 16 anos joga vôlei e a técnica pediu pra ela fazer "prevenção de LCA" com exercícios de glúteo médio. Achei exagero — ela é jovem e saudável. Mas vi que lesão de LCA é muito mais comum em mulheres. Por que? E esses exercícios realmente previnem?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, a técnica da sua filha está CORRETÍSSIMA — e essa recomendação pode literalmente evitar uma cirurgia e 6-12 meses fora do esporte.

**Lesão de LCA em mulheres — os números assustam:**

- Mulheres atletas têm **2-8x MAIS risco** de ruptura de LCA que homens no mesmo esporte
- No vôlei especificamente: o risco é **~4-6x maior** em mulheres
- Pico de incidência: **15-19 anos** — exatamente a idade da sua filha
- ~70% das rupturas de LCA são **sem contato** — a atleta aterrissa, muda de direção ou desacelera e o joelho colapsa sozinho
- O mecanismo mais comum: aterrissagem de salto com **valgo dinâmico** (joelho pra dentro)

**Por que mulheres têm mais risco:**

**1. Anatomia:**
- Pelve mais larga → maior ângulo Q (ângulo do fêmur) → tendência natural a valgo
- Intercôndilo femoral mais estreito → menos espaço para o LCA
- LCA feminino geralmente menor e com menos fibras

**2. Hormonal:**
- Estrogênio aumenta a frouxidão ligamentar
- O LCA tem receptores de estrogênio
- Risco aumenta na fase pré-ovulatória e ovulatória do ciclo menstrual (pico de estrogênio)

**3. Neuromuscular (o fator MAIS modificável):**
- Mulheres ativam proporcionalmente MAIS quadríceps e MENOS isquiotibiais e glúteos na aterrissagem
- Quadríceps dominante = tíbia tracionada anteriormente = estresse no LCA
- Menor ativação de glúteo médio = menor controle de valgo = joelho colapsa
- **ESTE é o fator que os exercícios corrigem**

**Programas de prevenção — a evidência é FORTE:**

**Meta-análise de Myer et al. (2013):**
- Programas neuromusculares preventivos reduzem risco de lesão de LCA em **52-73%** em atletas femininas
- Isso é uma das intervenções preventivas MAIS eficazes em toda a medicina esportiva
- Investimento: 15-20 minutos de aquecimento antes do treino/jogo

**O programa FIFA 11+ (adaptado para vôlei):**

É o programa preventivo mais validado cientificamente. Componentes:

**Parte 1 — Aquecimento corrido (6 min):**
- Corrida reta, corrida com deslocamento lateral, corrida com mudança de direção

**Parte 2 — Força e equilíbrio (10 min):**
- Prancha frontal e lateral: 2x30s
- Nordic curl (isquiotibiais): 2x5-8
- Single leg balance (equilíbrio unipodal): 2x30s cada
- Agachamento unilateral com controle de valgo: 2x8 cada
- Monster walk com miniband: 2x10 cada direção
- **Aterrissagem controlada de salto**: 2x5 — salte e aterrisse com joelhos alinhados sobre os pés, NUNCA pra dentro

**Parte 3 — Corrida com mudança de direção (4 min):**
- Sprint com frenagem controlada
- Mudança de direção com controle de valgo
- Saltos laterais com aterrissagem estável

**O exercício mais crítico — treino de aterrissagem:**
- Salte de uma caixa de 30cm e aterrisse com as duas pernas
- FOCO: joelhos alinhados sobre os pés, NÃO colapsando pra dentro
- Progressão: aterrissagem bipodal → unipodal → com rotação → com bola
- Feedback visual (espelho ou vídeo) é essencial para correção

Fernanda, NÃO é exagero. É uma das intervenções preventivas mais bem documentadas na medicina esportiva. 15 minutos antes de cada treino podem evitar 6-12 meses de recuperação cirúrgica. A técnica está protegendo sua filha.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_004',
    content: `Minha filha rompeu o LCA aos 17 jogando futsal — aterrissou de um salto com o joelho pra dentro. 8 meses de recuperação, cirurgia, fisioterapia. O time NÃO fazia nenhum trabalho preventivo. Se tivessem feito 15 minutos desses exercícios antes dos treinos, talvez tivesse evitado. Prevenção custa minutos, lesão custa meses.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `Retiro o "exagero". 52-73% de redução de risco com 15 minutos é impressionante. Vou conversar com a técnica e apoiar totalmente o programa preventivo. E vou mostrar o depoimento do Carlos pra ela entender a importância. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Hip drop na corrida — por que dói o joelho ──
  {
    userId: 'user_sim_010',
    content: `Comecei a correr há 4 meses e desenvolvi dor no joelho esquerdo (lado externo). Fui no ortopedista: síndrome da banda iliotibial. Ele pediu filmagem da corrida e apontou "queda pélvica contralateral" — o quadril do lado oposto ao pé de apoio cai. Disse que o problema é glúteo médio. Mais uma vez, dor no joelho e culpa do quadril?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Thiago, exatamente o mesmo princípio do valgo no agachamento, agora aplicado à corrida. O quadril fraco é o vilão mais comum de dores nos membros inferiores em corredores.

**O que é a queda pélvica contralateral (hip drop / sinal de Trendelenburg dinâmico):**

Quando você corre, a cada passada fica apoiado em UMA perna. O glúteo médio da perna de apoio precisa **manter a pelve nivelada**. Se está fraco:

- A pelve do lado oposto (perna no ar) CAI
- O fêmur da perna de apoio aduz e rota internamente
- A banda iliotibial (BIT) é esticada excessivamente sobre o epicôndilo lateral do fêmur
- Fricção repetitiva a cada passada → inflamação → síndrome da banda iliotibial
- ~5.000-6.000 passadas por km → milhares de microtraumas por corrida

**A biomecânica visual:**
- Corredor com glúteo médio forte: pelve estável, tronco alinhado, mínima oscilação lateral
- Corredor com glúteo médio fraco: pelve "balanço", tronco inclina pro lado, ombro compensa → ineficiência + lesão

**Lesões associadas à fraqueza do glúteo médio em corredores:**
- Síndrome da banda iliotibial (a SUA) — a mais comum
- Síndrome patelofemoral ("runner's knee")
- Tendinopatia do glúteo médio (dor no lado do quadril)
- Fascite plantar (compensação no pé)
- Fraturas de estresse tibial (sobrecarga assimétrica)
- Periostite tibial ("canelite")

**Estudo de Fredericson et al. (2000):**
Corredores com síndrome da banda iliotibial tinham **glúteo médio significativamente mais fraco** no lado afetado. Após 6 semanas de fortalecimento específico, 92% ficaram livres de dor e voltaram a correr.

**Protocolo para corredores com dor por fraqueza de glúteo médio:**

**Fase 1 — Parar de correr + tratar a inflamação (1-2 semanas):**
- Suspenda corrida temporariamente (pode fazer bike/natação)
- Gelo no ponto de dor 15 min, 2-3x/dia
- Foam roller na BIT (NÃO no ponto de dor, mas ACIMA — na lateral da coxa)
- Anti-inflamatório conforme orientação médica

**Fase 2 — Fortalecimento isolado (semanas 2-6):**
- Clamshell com band: 3x15 cada — foco em SENTIR o lateral do quadril
- Side-lying hip abduction: 3x15 cada — perna reta, sem rodar quadril
- Single leg bridge: 3x12 cada — estabilização pélvica
- Single leg deadlift (sem carga): 3x10 cada — equilíbrio + glúteo médio
- Side plank: 3x20-30s cada — oblíquos + glúteo médio sinergicamente
- Step-down lateral controlado: 3x8 cada — excêntrico do glúteo médio (crucial)

**Fase 3 — Retorno à corrida (semanas 4-8):**
- Comece com caminhada-corrida (2 min correndo / 1 min andando x 20 min)
- FILME-SE correndo: a queda pélvica deve ser visivelmente menor
- Mantenha fortalecimento 3x/semana DURANTE a corrida (não pare quando a dor sumir)
- Aumente volume de corrida ~10%/semana (regra dos 10%)

**Prevenção permanente (para sempre):**
- 2-3x/semana: 10 minutos de exercícios de glúteo médio como aquecimento pré-corrida
- Esses 10 minutos são um "seguro" contra recidiva
- Corredores sérios nunca devem abandonar o fortalecimento de quadril

Thiago, 92% de resolução com fortalecimento é uma taxa extraordinária. Seu joelho não precisa de cirurgia — seu quadril precisa de glúteo médio.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `Tive exatamente a mesma lesão (BIT esquerda). 6 semanas de fortalecimento de glúteo médio + pausa na corrida. Voltei a correr sem dor e meu pace até melhorou — pelve estável = menos desperdício de energia lateral = corrida mais eficiente. Fortalecimento de glúteo médio deveria ser OBRIGATÓRIO pra todo corredor.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010',
    content: `92% de resolução com fortalecimento! Vou seguir o protocolo à risca. E a parte de CONTINUAR os exercícios mesmo depois da dor sumir é crucial — foi exatamente o erro que cometi: parei o fortalecimento e a dor voltou em 3 meses.`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Amnésia glútea — quando o músculo "desliga" ──
  {
    userId: 'user_sim_009',
    content: `Meu fisio falou que tenho "amnésia glútea" — que meus glúteos estão "desligados" por ficar sentado 10h/dia. Achei que era piada. Isso existe de verdade? Como um músculo "desliga"?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Bruno, não é piada — amnésia glútea é um termo clínico informal (formalmente: **inibição do glúteo por inibição recíproca alterada**) e é extremamente prevalente na população sedentária moderna.

**O que acontece fisiologicamente:**

**1. Inibição recíproca:**
- Quando um músculo está encurtado/hipertônico, o músculo oposto (antagonista) é INIBIDO pelo sistema nervoso
- Sentado: os **flexores do quadril** (iliopsoas, reto femoral) ficam encurtados
- Encurtamento crônico do iliopsoas → sinal neural que INIBE o glúteo máximo e médio
- O glúteo não "desaparece" — ele está lá, mas o cérebro "esquece" de ativá-lo eficientemente

**2. Alteração do padrão motor:**
- Quando o glúteo está inibido, outros músculos COMPENSAM: isquiotibiais, eretores da espinha, piriforme
- Com o tempo, o cérebro cria um padrão motor onde NÃO inclui o glúteo → "amnésia"
- Você faz extensão de quadril (subir escada, ficar em pé) usando isquiotibiais e lombar em vez de glúteo
- Resultado: lombar e isquiotibiais sobrecarregados, glúteo subativado

**3. O ciclo:**
Sentado 8-10h → iliopsoas encurta → glúteo inibido → outros compensam → glúteo enfraquece → mais compensação → pior ativação → mais fraqueza

**Teste de ativação glútea (faça agora):**

**Teste 1 — Extensão de quadril em prono:**
1. Deite de barriga pra baixo
2. Coloque uma mão no glúteo e outra nos isquiotibiais
3. Levante a perna estendida do chão
4. O que ativa PRIMEIRO?
   - Se isquiotibiais ativam antes do glúteo → padrão alterado (amnésia)
   - Se glúteo ativa primeiro → padrão normal

**Teste 2 — Ponte de glúteo:**
1. Faça uma ponte de glúteo lentamente
2. Onde sente mais? Glúteo ou isquiotibiais/lombar?
3. Se sente mais nos isquios ou na lombar → glúteo não está ativando adequadamente

**Prevalência:**
- Estima-se que **>50% dos adultos sedentários** tenham algum grau de inibição glútea
- Profissões de escritório são as mais afetadas
- Quanto mais horas sentado/dia, pior a inibição

**Protocolo de "reativação" glútea:**

**Fase 1 — Liberar o que está bloqueando (diariamente):**
- **Alongamento do iliopsoas**: lunge ajoelhado, empurre quadril pra frente, 30-45s cada lado, 2-3x/dia
- **Liberação miofascial do reto femoral**: foam roller na frente da coxa, 60s cada lado
- A liberação dos flexores "tira o freio" do glúteo

**Fase 2 — Reensinar o cérebro (diariamente por 4-6 semanas):**
- **Glute squeeze isométrico**: em pé, contraia o glúteo MÁXIMO por 5s. Relaxe. Repita 10x. Parece bobo mas está recriando a conexão mente-músculo
- **Ponte de glúteo com foco mental**: 3x15, concentre-se em "apertar o bumbum" no topo. Se sentir nos isquios, reposicione os pés mais pra perto do bumbum
- **Clamshell ultra-lento**: 3x12 cada, 3s pra abrir, 3s pra fechar. Sinta o lateral do quadril queimar
- **Bird-dog com aperto glúteo**: na extensão da perna, contraia conscientemente o glúteo daquele lado

**Fase 3 — Integração (semanas 4-8):**
- Single leg deadlift com foco em ativação glútea
- Step-up alto com pausa no topo (squeeze glúteo)
- Agachamento com ativação prévia (faça clamshell ou monster walk ANTES de agachar)

**A técnica da "ativação prévia" (PAP simplificado):**
Antes de qualquer exercício pesado de MMII, faça 2x15 de clamshell ou monster walk. Isso "acorda" o glúteo e garante que ele participe do exercício composto em vez de deixar os isquiotibiais e lombar compensarem.

Bruno, seus glúteos não desapareceram — eles estão dormindo depois de anos de cadeira. O protocolo acima é o despertador.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: `Fiz o teste de extensão em prono e CLARAMENTE meus isquios ativam primeiro. Depois de 3 semanas de protocolo de reativação (alongamento do iliopsoas + ponte com foco + clamshell), refiz o teste e agora o glúteo ativa primeiro. A diferença no agachamento é perceptível — sinto o bumbum trabalhando pela primeira vez.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `"O glúteo não desapareceu, está dormindo depois de anos de cadeira" — essa frase resume tudo. Vou começar a fazer o alongamento do iliopsoas + glute squeeze no escritório a cada 2h. Acordar o glúteo é o primeiro passo!`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Hip dip — é estético ou funcional? ────────
  {
    userId: 'user_sim_002',
    content: `Tenho "hip dip" (aquela depressão na lateral do quadril, entre o osso do quadril e a coxa). Odeio esteticamente. Vi vídeos dizendo que exercícios de glúteo médio eliminam hip dip. É verdade ou é estrutura óssea?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, hip dips são um dos temas onde a indústria fitness mais engana — então vamos separar o que é real do que é marketing.

**O que são hip dips anatomicamente:**

Hip dips (também chamados de "violin hips") são a **depressão natural** entre o trocanter maior do fêmur e a crista ilíaca. Essa concavidade é determinada por:

1. **Largura da pelve** (distância entre cristas ilíacas)
2. **Posição do trocanter maior** (ponto de inserção do fêmur)
3. **Formato do ilíaco** (osso do quadril — varia entre pessoas)
4. **Distribuição de gordura** nessa região
5. **Volume muscular** do glúteo médio e tensor da fáscia lata

**A verdade incômoda:**
- Os fatores 1, 2 e 3 são **100% genéticos/estruturais** e NÃO mudam com exercício
- Os fatores 4 e 5 são **parcialmente modificáveis**
- Se sua anatomia óssea cria uma depressão profunda, NENHUM exercício a eliminará completamente

**O que o exercício PODE fazer:**
- **Hipertrofiar o glúteo médio**: preencher PARCIALMENTE a depressão com músculo
- Melhora visual: de ~20-40% dependendo da anatomia individual
- Um glúteo médio bem desenvolvido suaviza a depressão mas raramente a elimina
- O resultado depende completamente de QUÃO profundo é o hip dip estrutural

**O que o exercício NÃO pode fazer:**
- Eliminar completamente hip dips profundos que são determinados pela anatomia óssea
- Modificar a forma dos ossos (crista ilíaca, trocanter)
- Criar um contorno perfeitamente redondo se a estrutura não permite

**Os vídeos de "eliminar hip dip em 30 dias" são desonestos porque:**
- Mostram ângulos e iluminação favoráveis no "depois"
- Selecionam pessoas com hip dips leves (mais responsivos)
- 30 dias é insuficiente para hipertrofia significativa do glúteo médio
- Não mostram follow-up de longo prazo

**Exercícios que AJUDAM (hipertrofia do glúteo médio):**
- Todos os exercícios de abdução que já discutimos nesta arena
- Para HIPERTROFIA (não só ativação): carga progressiva é necessária
- Cable hip abduction pesada: 3x10-12
- Side-lying hip abduction com caneleira pesada: 3x12-15
- Curtsy lunge com carga: 3x10 cada
- Step-up lateral com carga: 3x10 cada
- **Timeline realista: 6-12 meses de trabalho consistente para mudança estética perceptível**

**A perspectiva:**
- Hip dips são uma variação anatômica NORMAL — não um defeito
- ~70% das mulheres têm algum grau de hip dip
- Modelos e influencers que parecem não ter: genética favorável + edição + ângulo
- Focar em função (estabilidade pélvica, prevenção de lesão) em vez de eliminação de uma concavidade natural é mais saudável e sustentável

Juliana, fortaleça o glúteo médio porque é funcional e esteticamente benéfico. Mas calibre a expectativa: hip dips podem suavizar, mas a eliminação completa depende de anatomia, não de exercício.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_020',
    content: `OBRIGADA pela honestidade. Gastei 1 ano fazendo exercícios de "eliminar hip dip" e fiquei frustrada. Meus hip dips reduziram LEVEMENTE mas não sumiram. Agora entendo: minha estrutura óssea tem depressão profunda. Troquei o foco pra fortalecer pra função e aceitei que meu quadril é assim. Muito mais saudável.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `70% das mulheres têm hip dip! Eu achava que era anormal. Vou continuar treinando glúteo médio pela função e pela melhora que der — mas sem a expectativa de "eliminar" algo que é minha anatomia. Valeu pela transparência!`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Tendinopatia do glúteo médio — dor lateral do quadril ──
  {
    userId: 'user_sim_006',
    content: `Tenho dor CRÔNICA na lateral do quadril — especialmente ao deitar de lado, subir escada e cruzar as pernas. Faz 8 meses. Já fiz raio-X (normal) e ultrassom que mostrou "tendinopatia do glúteo médio com bursite trocantérica". É o mesmo glúteo médio que estamos discutindo aqui? Qual o tratamento?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Patricia, sim — é o mesmo glúteo médio, e a tendinopatia dele é uma das causas mais comuns de dor lateral de quadril, especialmente em mulheres acima de 35 anos.

**O que é tendinopatia do glúteo médio:**

O tendão do glúteo médio se insere no **trocanter maior** (aquele osso que sente na lateral do quadril). Quando submetido a sobrecarga crônica, irritação mecânica ou degeneração, o tendão inflama e degenera → dor.

**A antiga "bursite trocantérica" foi reclassificada:**
- O que se chamava de "bursite" na maioria dos casos é na verdade **tendinopatia do glúteo médio** com ou sem bursite associada
- A bursa inflama SECUNDARIAMENTE à irritação do tendão — raramente é o problema primário
- Tratamento focado SÓ na bursa (infiltração isolada) frequentemente falha porque não trata a causa

**Prevalência:**
- Afeta ~10-25% das mulheres >40 anos
- 3-4x mais comum em mulheres que em homens
- Associada a: sedentarismo, fraqueza de abdutores, obesidade, pós-menopausa

**O paradoxo da tendinopatia do glúteo médio:**
- O tendão PRECISA ser fortalecido → mas exercício excessivo ou mal dosado PIORA
- Repouso total não resolve (o tendão precisa de estímulo para se regenerar)
- A solução é **carga gradual e progressiva** — nem demais, nem de menos

**O que PIORA (evitar durante a fase aguda):**

- 🔴 **Deitar sobre o lado afetado** (comprime o tendão contra o trocanter — dor noturna clássica)
- 🔴 **Cruzar as pernas** (estica o tendão sobre o trocanter)
- 🔴 **Ficar em pé apoiada num pé só** (hip hang) do lado oposto
- 🔴 **Alongamento excessivo** do glúteo (ex: piriforme stretch) — comprime o tendão
- 🔴 **Subir escadas rápido** sem controle

**Protocolo de reabilitação (evidência forte — Mellor et al., 2018):**

**Estudo LEAP trial:** exercício de fortalecimento progressivo foi SUPERIOR a infiltração de corticoide e "esperar melhorar" — em 1 ano, o grupo de exercício teve melhores desfechos.

**Fase 1 — Alívio de compressão (semanas 1-2):**
- Dorme: coloque travesseiro entre os joelhos (descomprime o tendão)
- Não cruze as pernas
- Não deite sobre o lado afetado
- Não faça alongamentos de glúteo/piriforme (compressão!)
- Isometria leve: em pé, empurre o joelho do lado afetado contra a parede lateralmente. 5x45s, 3x/dia. Alivia dor via mecanismo de analgesia isométrica

**Fase 2 — Fortalecimento isométrico e isotônico lento (semanas 2-6):**
- Ponte de glúteo bilateral: 3x15 — sem dor
- Abdução isométrica deitada: 3x30s — pressione contra resistência fixa
- Clamshell LEVE: 3x10 — sem band inicialmente, arco de movimento pequeno
- Side-lying hip abduction: 3x10 — ROM reduzido, controle total

**Fase 3 — Fortalecimento progressivo (semanas 6-12):**
- Ponte unilateral: 3x10 cada
- Abdução com caneleira: 3x12
- Step-up lateral baixo: 3x8 cada
- Single leg stance 30s cada lado
- Carga progressiva: aumente peso/reps a cada 1-2 semanas SE sem dor

**Fase 4 — Retorno funcional (semanas 12+):**
- Subir escada normal sem dor
- Deitar de lado sem dor
- Exercícios de impacto progressivo

**Timeline honesta:**
- Melhora significativa: 8-12 semanas de trabalho consistente
- Resolução completa: 3-6 meses em média
- Tendinopatias crônicas (>6 meses como a sua): podem levar 6-12 meses
- Paciência é FUNDAMENTAL — tendões se regeneram muito mais devagar que músculos

Patricia, o estudo LEAP mostrou que exercício supera infiltração. Encontre um fisioterapeuta que entenda de tendinopatia e siga o protocolo progressivo. A recuperação é lenta mas é real.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_019',
    content: `Tive tendinopatia do glúteo médio por 1 ano. Fiz 3 infiltrações de corticoide — alívio por 4-6 semanas e voltava. Quando finalmente fiz fisioterapia focada em fortalecimento progressivo, melhorou de verdade em 4 meses. O exercício é o tratamento, não a injeção.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `O travesseiro entre os joelhos foi a primeira coisa que aliviou minha dor noturna em 8 meses! Simples demais. E vou procurar um fisio pra seguir o protocolo progressivo em vez de ficar pedindo infiltração. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Programa completo de glúteo médio ─────────
  {
    userId: 'user_sim_004',
    content: `Li toda essa arena e agora entendo que glúteo médio é crucial. Mas preciso de um programa PRÁTICO e integrado — não exercícios soltos. Como encaixar glúteo médio no meu treino de musculação 4x/semana sem gastar 30 minutos extras?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Carlos, a forma mais eficiente é integrar o glúteo médio como **aquecimento ativacional** antes de sessões de MMII e como **exercício acessório** no final. Total extra: 8-12 minutos por sessão.

**Programa integrado — 4x/semana com glúteo médio:**

**Sessão A — MMII Quad-dominante (Segunda):**

*Aquecimento ativacional (5 min):*
- Clamshell com miniband: 2x12 cada lado
- Monster walk: 2x8 passos cada direção

*Treino principal:*
- Agachamento com miniband nos joelhos: 4x8-10
- Leg press unilateral: 3x10 cada
- Búlgaro: 3x10 cada
- Extensora: 3x12

*Acessório de glúteo médio (3 min):*
- Cable hip abduction em pé: 2x15 cada

**Sessão B — Superior (Terça):**
- Treino normal de superior
- Sem trabalho específico de glúteo médio

**Sessão C — MMII Posterior/Glúteo (Quinta):**

*Aquecimento ativacional (5 min):*
- Side-lying hip abduction: 2x12 cada
- Banded lateral walk em agachamento: 2x10 cada direção

*Treino principal:*
- Hip thrust: 4x10-12
- Stiff: 3x10
- Step-up lateral com halter: 3x10 cada ← trabalha médio COM carga
- Flexora: 3x12
- Ponte unilateral: 3x12 cada ← trabalha médio + máximo

*Acessório de glúteo médio (3 min):*
- Curtsy lunge com halter: 2x10 cada

**Sessão D — Superior (Sexta):**
- Treino normal de superior
- Opcional: 2x15 clamshell como "ativação geral" no aquecimento (2 min)

**Resumo do volume semanal de glúteo médio:**
- Aquecimento ativacional: 2 sessões x 5 min = 10 min
- Exercícios acessórios: 2 sessões x 3 min = 6 min
- Exercícios integrados no treino principal: step-up lateral + ponte unilateral
- **Total extra: ~16 minutos por SEMANA** para um resultado funcional e estético significativo

**Progressão ao longo dos meses:**

**Mês 1-2 (ativação):**
- Miniband leve, foco em sentir o músculo
- Carga leve nos acessórios
- Objetivo: reconexão mente-músculo

**Mês 3-4 (fortalecimento):**
- Miniband média-pesada
- Carga progressiva nos acessórios (caneleira, cabo, halteres)
- Objetivo: ganho de força mensurável

**Mês 5-6 (hipertrofia):**
- Carga significativa nos acessórios
- Volume aumentado (3 séries em vez de 2 nos acessórios)
- Objetivo: mudança visual na lateral do quadril

**Mês 7+ (manutenção):**
- Manter 2x/semana como aquecimento + acessório
- Progressão de carga contínua mas lenta
- O glúteo médio forte vira sua "apólice de seguro" contra valgo, dor e instabilidade

**Indicadores de que está funcionando:**
- Teste de Trendelenburg melhora (pelve não cai na postura unipodal)
- Valgo no agachamento reduz ou desaparece
- Menos dor no joelho (se tinha)
- Lateral do quadril mais "cheia" visualmente
- Estabilidade geral nos exercícios unilaterais melhora

Carlos, 16 minutos semanais para proteger joelhos, estabilizar pelve, melhorar performance e arredondar o quadril. É o melhor investimento de tempo que existe num programa de treino.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: `Esse programa integrado é exatamente o que eu precisava. Antes eu tentava "encaixar" glúteo médio mas não sabia onde. Agora: ativação no aquecimento + 1 acessório no final = feito. Sem adicionar 30 minutos, sem desculpa. Implementando a partir de segunda! 💪`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: `16 minutos por semana pra tudo isso. Não tem desculpa. O programa tá salvo e vou seguir a progressão mensal. Obrigado pela praticidade — teoria sem aplicação é inútil, e esse post resolveu a aplicação.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🔍 Buscando arena "Glúteo Médio/Valgo"...');

  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%gluteo-medio%,slug.ilike.%valgo%,name.ilike.%glúteo médio%,name.ilike.%valgo%');

  if (arenaError) {
    console.error('❌ Erro ao buscar arena:', arenaError);
    return;
  }

  if (!arenas || arenas.length === 0) {
    console.log('⚠️  Arena não encontrada. Tentando busca mais ampla...');
    const { data: retry } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('name.ilike.%gluteo%medio%,name.ilike.%médio%,slug.ilike.%medio%');

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
  const baseTime = new Date('2025-02-05T07:45:00Z');

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
