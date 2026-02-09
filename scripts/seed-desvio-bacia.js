require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: Desvio de Bacia
// ~32 posts em 8 conversas
// Foco: desnivelamento pélvico, obliquidade pélvica, escoliose
// compensatória, assimetria de gordura/músculo, impacto no
// treino, dor, estética assimétrica, correção funcional,
// quando é estrutural vs funcional, fisioterapia
// ============================================================

const POSTS = [

  // ── CONVERSA 1: "Um lado do quadril é maior que o outro" ──
  {
    userId: 'user_sim_008',
    content: `Sempre notei que meu corpo é "torto" — um lado do quadril parece mais largo, acumulo mais gordura de um lado da barriga, e minha calça nunca veste igual dos dois lados. Fui no ortopedista e ele disse que tenho "obliquidade pélvica" e uma perna funcionalmente mais curta. Isso pode causar acúmulo desigual de gordura? E como corrigir?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Camila, a obliquidade pélvica (ou desnivelamento pélvico) é muito mais comum do que se imagina e sim, tem relação direta com a aparência assimétrica do corpo — incluindo distribuição de gordura.

**O que é obliquidade pélvica:**

A pelve deveria estar nivelada horizontalmente (cristas ilíacas na mesma altura). Na obliquidade, **um lado está mais alto que o outro**, criando uma cascata de compensações em todo o corpo.

**Prevalência:** estudos sugerem que algum grau de assimetria pélvica está presente em **60-80% da população** — a maioria leve e assintomática. Torna-se clinicamente relevante quando a diferença é >5-10mm ou gera sintomas.

**Tipos:**

**1. Estrutural (anatômica):**
- Diferença real de comprimento das pernas (discrepância verdadeira)
- Assimetria óssea da própria pelve
- Sequela de fratura, cirurgia ou condição congênita
- NÃO corrige com exercício — pode precisar de palmilha compensatória

**2. Funcional (muscular/fascial):**
- Pernas têm o mesmo comprimento real, mas desequilíbrios musculares "puxam" a pelve para um lado
- Espasmo do quadrado lombar de um lado eleva aquela crista ilíaca
- Encurtamento do iliopsoas ou adutores de um lado
- CORRIGE com trabalho muscular e fisioterapia — mais comum que a estrutural

**Como a obliquidade pélvica afeta a aparência:**

**1. Assimetria de gordura aparente:**
- A pelve desnivelada muda a tensão dos tecidos moles de cada lado
- O lado "comprimido" (onde a pelve está mais baixa) pode ter pregas cutâneas mais visíveis, acúmulo aparente de gordura na cintura
- O lado "esticado" (pelve mais alta) parece mais "limpo"
- NÃO é mais gordura de um lado — é a mesma gordura distribuída de forma diferente pela posição da pelve

**2. Assimetria muscular:**
- O corpo compensa o desnivelamento usando músculos assimetricamente
- Um glúteo pode ser mais desenvolvido/ativado que o outro
- Um oblíquo mais contraído que o outro
- Isso cria diferença visual de tônus e volume

**3. Escoliose compensatória:**
- A coluna se curva para compensar a pelve desnivelada
- Cria assimetria em toda a silhueta — cintura, costelas, ombros
- A "pochete" pode ser mais pronunciada de um lado

**O que fazer:**

**Passo 1 — Diagnóstico preciso:**
- Raio-X panorâmico de coluna + pelve (em pé) → diferencia estrutural de funcional
- Escanometria → mede comprimento real das pernas
- Avaliação funcional com fisioterapeuta → identifica padrão muscular

**Passo 2 — Se FUNCIONAL (a maioria dos casos):**
- Trabalho de correção muscular (detalhado nas próximas conversas)
- Fisioterapia manual + exercícios corretivos
- Timeline: 8-16 semanas de trabalho consistente para melhora significativa

**Passo 3 — Se ESTRUTURAL:**
- Palmilha compensatória prescrita por ortopedista
- A palmilha nivela a pelve mecanicamente → as compensações musculares se resolvem gradualmente
- Exercícios corretivos como complemento

Camila, o fato de você ter diagnóstico já é um grande passo. A maioria das pessoas vive a vida toda com obliquidade sem saber e se perguntando por que o corpo é "torto".`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Tenho perna esquerda 1,2cm mais curta (estrutural, confirmada por escanometria). Uso palmilha compensatória há 2 anos e a diferença na minha postura e dor lombar foi absurda. E sim — minha "barriga de um lado só" reduziu visivelmente quando a pelve nivelou. A palmilha custa R$ 200-400 e pode mudar tudo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: `A explicação de que não é "mais gordura de um lado" mas sim "a mesma gordura redistribuída pela posição da pelve" me fez tudo fazer sentido. Vou pedir a escanometria pro ortopedista. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Quadrado lombar — o vilão silencioso ──────
  {
    userId: 'user_sim_005',
    content: `Minha fisio disse que meu "desvio de bacia" é por causa do quadrado lombar encurtado de um lado. Nunca ouvi falar desse músculo. O que ele faz e por que desvia a bacia?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rafael, o quadrado lombar (QL) é provavelmente o músculo mais impactante e menos conhecido no contexto de assimetria pélvica.

**O que é o quadrado lombar:**
- Músculo profundo que conecta a **última costela** à **crista ilíaca** (topo da pelve) dos dois lados da coluna
- Função: flexão lateral do tronco, estabilização da coluna lombar, elevação da pelve (hiking)
- Quando contraído/encurtado de UM lado → **puxa aquela crista ilíaca para cima** → desnivelamento pélvico

**Por que encurta de um lado:**

**1. Hábitos posturais assimétricos:**
- Sempre cruzar a MESMA perna → encurta o QL do lado cruzado
- Apoiar o peso sempre no MESMO pé quando em pé → o QL do lado oposto trabalha mais
- Dormir sempre do MESMO lado em posição fetal → encurta o QL superior
- Carregar bolsa/mochila sempre no MESMO ombro → compensação do QL contralateral

**2. Trabalho sedentário:**
- Sentar inclinado para um lado (apoiando no braço da cadeira)
- Monitor posicionado lateralmente → rotação crônica do tronco
- 8h/dia nessa posição = anos de encurtamento progressivo

**3. Compensação de lesão:**
- Torção de tornozelo antiga → mudança no padrão de marcha → sobrecarga unilateral do QL
- Dor no joelho de um lado → claudicação compensatória → QL hipertônico

**Diagnóstico funcional simples:**
1. Fique de pé diante do espelho, sem roupa, posição natural
2. Observe suas cristas ilíacas (osso do quadril) — uma está mais alta?
3. Observe a prega da cintura — uma mais profunda/marcada?
4. Observe os ombros — o ombro oposto ao quadril elevado geralmente está mais baixo (compensação)
5. Flexione lateralmente para cada lado — o lado encurtado terá MENOS amplitude

**Protocolo de liberação e alongamento do QL:**

**1. Liberação miofascial (diariamente):**
- **Bola de tênis/lacrosse na parede:** coloque a bola entre a parede e a região lateral lombar (entre a última costela e a crista ilíaca). Pressione e role lentamente. 60-90 segundos CADA LADO, com ênfase no lado encurtado
- **Foam roller lateral:** deite lateralmente sobre o foam roller na região do QL. Role lentamente. 60s cada lado

**2. Alongamento do QL (lado encurtado — 2-3x/dia):**
- **Alongamento lateral em pé:** em pé, cruze a perna do lado encurtado ATRÁS da outra. Incline o tronco para o lado oposto, braço estendido sobre a cabeça. Segure 30-45s. Repita 3x
- **Alongamento lateral deitado:** deitada de barriga pra cima, puxe ambos os joelhos pro peito, depois deixe as pernas caírem para o lado OPOSTO ao encurtamento. 30-45s
- **Child's pose lateral:** posição de "oração" (child's pose) caminhando as mãos para um lado. 30s cada

**3. Fortalecimento do QL oposto (o lado fraco):**
- **Side plank:** 3x15-20s do lado fraco (2x mais que do lado forte inicialmente)
- **Farmer's carry unilateral:** segure peso APENAS do lado que precisa ativar o QL oposto. 3x30m
- **Pallof press anti-lateral:** 3x10 com ênfase no lado fraco

**4. Reeducação postural:**
- Alterne a perna que cruza
- Distribua peso igualmente nos dois pés quando em pé
- Posicione o monitor do computador centralizado
- Alterne o lado da bolsa/mochila

**Timeline de melhora:**
- Semana 1-2: redução de tensão e dor no lado encurtado
- Semana 3-6: melhora visível de nivelamento pélvico
- Semana 8-12: nova postura mais simétrica se automatizando
- Manutenção contínua necessária (tendência a recidivar sem consciência postural)

Rafael, o QL encurtado é a causa #1 de obliquidade pélvica funcional. A boa notícia é que responde bem ao tratamento conservador.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `A bola de lacrosse no QL mudou minha vida. Meu lado direito era tão encurtado que eu sentia uma "corda" quando a bola passava. 6 semanas de liberação diária + alongamento e minha fisio mediu 8mm de melhora no nivelamento. Sem precisar de palmilha.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `Acabei de perceber que cruzo SEMPRE a perna direita e carrego a mochila SEMPRE no ombro esquerdo. Exatamente o lado que minha fisio disse que tá encurtado. Hábitos de décadas criando assimetria. Vou começar o protocolo de liberação hoje!`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Treino com bacia desnivelada — cuidados ───
  {
    userId: 'user_sim_014',
    content: `Tenho obliquidade pélvica funcional e treino musculação. Meu personal diz pra treinar normal, que "o corpo compensa". Mas sinto que agachamento e terra ficam assimétricos — um lado trabalha mais que o outro. Devo adaptar o treino ou treinar normal mesmo?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rodrigo, "o corpo compensa" é uma meia-verdade perigosa. Sim, o corpo compensa — mas a compensação é exatamente o que **perpetua e piora a assimetria**. Treinar "normal" com obliquidade significativa é como construir uma casa sobre fundação torta.

**Problemas de treinar com pelve desnivelada sem adaptação:**

**1. Agachamento bilateral:**
- A pelve desnivelada distribui carga assimetricamente
- O lado da pelve mais alta recebe ~55-60% da carga, o lado mais baixo ~40-45%
- Resultado: um quadríceps, um glúteo, um eretor mais forte que o outro
- Com o tempo: assimetria se reforça, risco de lesão no lado sobrecarregado

**2. Levantamento terra:**
- A barra "puxa" mais de um lado → rotação compensatória do tronco
- Risco de hérnia discal é maior com carga assimétrica rotacional
- Erector spinae de um lado fadiga antes → mecanismo lesional clássico

**3. Leg press e hack squat:**
- Mesmo em máquinas, a pelve desnivelada faz um lado empurrar mais
- A sensação de "um lado trabalha mais" que você descreve é REAL, não imaginação

**Protocolo de treino adaptado para obliquidade pélvica:**

**Princípio #1 — Priorize exercícios UNILATERAIS:**
- Agachamento búlgaro > Agachamento bilateral
- Stiff unilateral > Stiff bilateral
- Leg press unilateral > Bilateral
- Step-up > Agachamento
- Cada perna trabalha independentemente → sem compensação

**Princípio #2 — Equalize cargas COM CUIDADO:**
- Comece SEMPRE pelo lado mais fraco
- Use a mesma carga e reps do lado fraco no lado forte (mesmo que seja "fácil")
- Gradualmente o lado fraco alcança o forte
- NÃO use carga diferente em cada lado (cria novos padrões compensatórios)

**Princípio #3 — Trabalho corretivo ANTES do treino principal:**

**Aquecimento corretivo (10-15 min):**
- Liberação do QL com bola: 60s cada lado
- Alongamento do iliopsoas bilateral: 30s cada
- Clamshell com miniband: 2x15 cada (ativação glúteo médio)
- Dead bug: 2x8 cada (estabilização pélvica)
- Bird-dog: 2x8 cada (anti-rotação)
- Side plank: 20s cada lado (ênfase no lado fraco)

**Princípio #4 — Exercícios bilaterais com ADAPTAÇÃO:**

Se quiser manter agachamento e terra:
- **Agachamento:** use espelho lateral, filme-se. Observe se a pelve desloca ou roda. Se sim → reduzir carga até conseguir manter simétrico
- **Terra:** comece com peso moderado. Se sentir rotação → pause, corrija, continue. Se não consegue manter simétrico → substitua por stiff unilateral temporariamente
- **Hack squat:** coloque uma cunha fina (0,5-1cm) sob o pé do lado da perna mais curta funcional — nivela a pelve durante o exercício

**Princípio #5 — Fortalecimento do lado fraco (trabalho extra):**
- Adicione 1-2 séries extras de exercício unilateral para o lado mais fraco
- Exemplo: se o glúteo esquerdo é mais fraco, faça 3 séries de búlgaro de cada lado + 1 série extra do lado esquerdo
- Progressão: quando a assimetria de força reduzir para <10%, volte a volume igual

**O que NÃO fazer:**
- Ignorar a assimetria e "forçar" simetria com carga alta bilateral
- Treinar pesado sem corrigir a base (fundação torta)
- Depender só do treino corretivo sem tratar a causa (QL, iliopsoas etc.)

Rodrigo, adaptar o treino não é "ser fresco" — é inteligência. Uma lesão por assimetria não corrigida pode te tirar do treino por meses.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_004',
    content: `Tive hérnia discal L4-L5 por treinar terra pesado com pelve desnivelada durante 3 anos. Ninguém me alertou. Após a recuperação, mudei pra unilateral + corretivo e hoje treino sem dor. Rodrigo, adapta AGORA — a lesão não compensa.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_014',
    content: `O depoimento do Carlos me convenceu. Vou trocar agachamento bilateral por búlgaro e terra por stiff unilateral até resolver a assimetria. E vou adicionar o aquecimento corretivo. Melhor prevenir do que remediar.`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Glúteo médio — a chave da estabilidade pélvica ──
  {
    userId: 'user_sim_007',
    content: `Minha fisio disse que meu desvio de bacia é por fraqueza do glúteo médio. Mas eu treino glúteo pesado na academia! Como pode ser fraco?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, essa é uma confusão muito comum: **treinar glúteo MÁXIMO (o grande) não significa que o glúteo MÉDIO (o estabilizador) está forte.** São músculos com funções completamente diferentes.

**Glúteo máximo vs glúteo médio:**

**Glúteo máximo (o que a maioria treina):**
- O maior músculo do corpo
- Função: extensão do quadril (empurrar pra trás), rotação externa
- Exercícios clássicos: hip thrust, agachamento, stiff, búlgaro
- É o músculo que dá "volume" ao bumbum

**Glúteo médio (o que quase ninguém treina adequadamente):**
- Músculo lateral do quadril, em forma de leque
- Função principal: **abdução do quadril** e **estabilização pélvica** durante a marcha e postura unipodal
- Quando fraco → pelve "cai" do lado oposto a cada passo (sinal de Trendelenburg)
- É o músculo que **mantém a pelve nivelada**

**Por que o glúteo médio fica fraco mesmo treinando "glúteo":**
- Hip thrust, agachamento e stiff são exercícios de **extensão** → glúteo máximo
- O glúteo médio precisa de exercícios de **abdução e estabilização lateral** → raramente incluídos no treino
- Ficar sentado 8-10h/dia INIBE o glúteo médio (amnésia glútea lateral)
- É possível ter um glúteo máximo muito forte e um médio muito fraco

**Teste de Trendelenburg (faça agora):**
1. Fique em pé diante do espelho
2. Levante um pé do chão (fique apoiada em uma perna)
3. Observe a pelve do lado da perna levantada:
   - Se a pelve MANTÉM ou SOBE → glúteo médio forte do lado de apoio ✅
   - Se a pelve CAI → glúteo médio fraco do lado de apoio ❌
4. Repita do outro lado e compare

**Programa de fortalecimento do glúteo médio:**

**Fase 1 — Ativação (semanas 1-3):**
- **Clamshell com miniband**: deitada lateral, joelhos flexionados, abra os joelhos contra a resistência da band. 3x15 cada lado. Foco em sentir o lateral do quadril, NÃO a coxa
- **Side-lying hip abduction**: deitada lateral, perna de cima estendida, eleve lateralmente sem rodar o quadril. 3x15 cada lado
- **Monster walk com miniband**: band nos tornozelos, agachamento parcial, caminhe lateralmente. 3x10 passos cada direção
- **Single leg glute bridge**: ponte apoiada numa perna. 3x12 cada. Exige estabilização do glúteo médio

**Fase 2 — Fortalecimento (semanas 3-8):**
- **Band walk lateral com agachamento parcial**: 3x12 cada direção
- **Step-up lateral**: suba lateralmente num banco. 3x10 cada
- **Single leg RDL (stiff unilateral)**: exige estabilização pélvica intensa. 3x10 cada
- **Cable/band hip abduction em pé**: 3x15 cada
- **Curtsy lunge**: 3x10 cada — abdução + extensão combinada

**Fase 3 — Integração funcional (semanas 8+):**
- Agachamento unilateral (pistol progressão)
- Single leg step-down controlado
- Bulgarian split squat com foco em estabilidade pélvica (sem "cair" pro lado)
- Corrida leve com foco em ativação consciente

**Frequência:**
- Ativação: todo dia como aquecimento (5 min)
- Fortalecimento: 3x/semana
- Espere 6-8 semanas para melhora funcional significativa no nivelamento pélvico

**O impacto na estética:**
Um glúteo médio forte não só estabiliza a pelve — ele também cria a **curva lateral do quadril** que dá a aparência de "quadril arredondado". É o músculo que diferencia um bumbum "redondo" de um bumbum "pontudo".

Fernanda, adicione glúteo médio ao seu treino com a mesma seriedade que treina máximo. A estabilidade pélvica (e a estética) agradecerão.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `Fiz o teste de Trendelenburg e minha pelve CAI visivelmente do lado esquerdo quando apoio na perna direita. Ou seja, glúteo médio direito fraco. Treino glúteo 3x/semana com hip thrust pesado — mas nunca faço abdução ou exercício lateral. Vou corrigir isso imediatamente!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `Comecei o protocolo de glúteo médio há 6 semanas. O teste de Trendelenburg que antes falhava dos dois lados agora passa do lado direito e quase passa do esquerdo. E minha fisio disse que a pelve está visivelmente mais nivelada. Funciona!`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Escoliose e desvio de bacia ───────────────
  {
    userId: 'user_sim_010',
    content: `Tenho escoliose em "S" diagnosticada na adolescência (curva torácica D e lombar E). Meu quiropraxista disse que a escoliose causa desvio na bacia. Mas meu ortopedista disse que é o desvio na bacia que causa a escoliose. Quem veio primeiro?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Thiago, essa é literalmente a versão musculoesquelética do "ovo ou galinha" — e a resposta honesta é que **depende do tipo de escoliose e da história individual**.

**Os dois cenários:**

**Cenário 1 — Escoliose PRIMÁRIA causando obliquidade pélvica:**
- Na escoliose idiopática (a mais comum, ~80% dos casos), a curvatura da coluna se desenvolve primeiro (geralmente na adolescência)
- A pelve se inclina como **compensação** para manter a cabeça centralizada sobre os pés
- Curva em S: a curva lombar "puxa" a pelve para um lado
- Nesse caso: a escoliose é a causa, a obliquidade pélvica é consequência

**Cenário 2 — Obliquidade pélvica causando escoliose FUNCIONAL:**
- Uma perna mais curta (estrutural ou funcional) desnivela a pelve
- A coluna se curva para compensar o desnivelamento → escoliose compensatória
- Se corrigir a pelve (palmilha ou trabalho muscular), a escoliose melhora
- Nesse caso: a pelve é a causa, a escoliose é consequência

**Como diferenciar:**
- **Teste de Adams (flexão do tronco):** na escoliose estrutural, a rotação vertebral (gibosidade) persiste na flexão. Na funcional, tende a reduzir ou desaparecer
- **Raio-X em pé vs deitado:** escoliose estrutural permanece deitado. Funcional reduz significativamente
- **Corrigir a pelve e reavaliar:** se a escoliose melhora com correção pélvica → era compensatória

**O que importa PRATICAMENTE (independente de quem veio primeiro):**

Para escoliose + obliquidade pélvica, o tratamento aborda AMBOS simultaneamente:

**1. Exercícios de Schroth (padrão-ouro para escoliose):**
- Método fisioterapêutico específico para escoliose
- Alongamento do lado côncavo (encurtado) + fortalecimento do lado convexo (esticado)
- Exercícios respiratórios rotatórios — usar a respiração para "abrir" o lado colapsado
- Exige fisioterapeuta certificado em Schroth (vale buscar)

**2. Correção pélvica simultânea:**
- QL do lado elevado: liberar e alongar
- Glúteo médio do lado fraco: fortalecer
- Iliopsoas: avaliar assimetria e corrigir

**3. Musculação adaptada:**
- Exercícios unilaterais predominantes (mesma lógica da conversa anterior)
- Evitar cargas compressivas pesadas na coluna (agachamento com barra alta pesado)
- Preferir: goblet squat, trap bar deadlift, exercícios com halteres (permitem ajuste natural do corpo)
- Core anti-rotação: Pallof press, farmer's carry, bird-dog — estabilizam contra a tendência rotacional

**4. O que NÃO corrige escoliose estrutural:**
- Quiropraxia isolada (pode aliviar sintomas temporariamente mas não corrige curva estrutural)
- "Pendurar-se de cabeça pra baixo"
- Massagem (alívio temporário, não correção)

**Expectativas realistas:**
- Escoliose **funcional**: pode melhorar significativamente (60-80% de correção) com trabalho adequado
- Escoliose **estrutural** leve a moderada (<30° Cobb): pode estabilizar e melhorar funcionalmente com exercício
- Escoliose **estrutural** severa (>40-50° Cobb): pode precisar de intervenção ortopédica (colete ou cirurgia)
- Em TODOS os casos, exercício melhora dor, função e qualidade de vida

Thiago, o mais importante não é quem veio primeiro — é tratar o sistema inteiro (pelve + coluna) de forma integrada.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Tenho escoliose de 22° Cobb e fiz Schroth por 1 ano. Minha curva não "sumiu" mas estabilizou, minha dor reduziu 80%, e minha assimetria visual melhorou muito. O método Schroth é impressionante — mas precisa de profissional qualificado, não dá pra fazer por YouTube.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010',
    content: `Vou procurar um fisio certificado em Schroth. A abordagem de tratar pelve + coluna juntas faz muito mais sentido do que ficar debatendo quem veio primeiro. Obrigado pela clareza!`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Assimetria estética — quando um lado é diferente ──
  {
    userId: 'user_sim_003',
    content: `Meu corpo é visivelmente assimétrico: um glúteo é mais "cheio", uma cintura é mais marcada, um lado da barriga acumula mais. Isso me incomoda muito esteticamente. Exercício pode corrigir a aparência ou preciso aceitar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Mariana, assimetria corporal é a REGRA, não a exceção — mas isso não significa que não pode ser melhorada.

**Primeiro: normalizar assimetria:**
- **100% dos corpos humanos são assimétricos** — nenhum corpo é perfeitamente espelhado
- Estudos de antropometria: diferenças de 5-15% em circunferência de membros contralaterais são normais
- Um pé geralmente é maior, um braço mais forte, um glúteo mais ativo
- As fotos que parecem "simétricas" no Instagram frequentemente são espelhadas digitalmente ou posadas para minimizar diferenças

**O que PODE ser corrigido com exercício:**

**1. Assimetria muscular (mais comum e mais tratável):**
- Se um glúteo é mais desenvolvido porque é mais ativado → treino unilateral equaliza
- Se uma perna é mais forte → exercícios unilaterais começando sempre pelo lado fraco
- Resultado esperado: redução de 60-80% da assimetria de volume muscular em 4-6 meses
- Pode nunca ser 100% simétrico, mas a diferença fica imperceptível

**2. Assimetria postural (pélvica/coluna):**
- Obliquidade pélvica corrigida → redistribui tecidos moles de forma mais simétrica
- Melhora em cintura, quadril e abdômen pode ser significativa
- Abordamos nas conversas anteriores

**O que NÃO se corrige com exercício:**

**3. Assimetria esquelética:**
- Diferenças na forma óssea da pelve, fêmur ou costelas são estruturais
- Exercício não muda osso
- Pode ser disfarçado com desenvolvimento muscular estratégico (construir mais onde parece menor)

**4. Distribuição de gordura genética:**
- Se a gordura se acumula mais de um lado (sem componente postural), é variação individual normal
- Perda de gordura generalizada pode equilibrar visualmente, mas a tendência genética persiste

**Estratégias para melhorar simetria visual:**

**Treino:**
- Exercícios unilaterais em TUDO: búlgaro, stiff unilateral, remada unilateral, hip thrust unilateral
- Comece pelo lado fraco/menor, use mesma carga e reps do dois lados
- Adicione 1-2 séries extras para o lado menor se a assimetria for >15%

**Fotografia e percepção:**
- Tire fotos padronizadas mensais de ambos os lados
- Muitas vezes a assimetria é mais perceptível pra VOCÊ do que para os outros
- Peça opinião honesta de alguém de confiança — a dismorfismo amplifica assimetrias reais

**Aceitação estratégica:**
- Foque em corrigir o que é corrigível (muscular, postural)
- Aceite o que é estrutural
- Lembre-se: ninguém olha seu corpo procurando assimetrias — essa análise minuciosa é só sua

Mariana, melhore o que pode, aceite o que não pode, e saiba que ninguém — literalmente ninguém — tem um corpo perfeitamente simétrico.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_020',
    content: `Uma coisa que me ajudou foi parar de me analisar no espelho procurando defeitos. Quando pedi pra 5 amigas apontarem minha "assimetria óbvia", NENHUMA conseguiu ver o que eu via. Às vezes a maior assimetria está na nossa percepção, não no corpo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `A Beatriz tem um ponto forte. Vou focar no treino unilateral pra equalizar o muscular e corrigir a postura pélvica — e parar de me olhar no espelho com lupa. Obrigada a todas!`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Dor lombar unilateral e desvio pélvico ───
  {
    userId: 'user_sim_018',
    content: `Tenho dor lombar SEMPRE do lado direito. Nunca do esquerdo. Meu quiro disse que é por desvio de bacia. Faz sentido dor só de um lado? E como aliviar sem depender de sessões semanais de quiropraxia pra sempre?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Marcelo, dor lombar unilateral associada a desvio pélvico é um padrão extremamente comum e sim, faz total sentido fisiologicamente.

**Por que dói SÓ de um lado:**

Com a pelve desnivelada, a coluna lombar se curva para compensar (escoliose funcional). O lado côncavo da curva (o lado "comprimido") sofre:

- **Compressão das facetas articulares** de um lado → irritação → dor
- **QL hipertônico/espástico** de um lado → tensão crônica → dor muscular
- **Disco intervertebral sob carga assimétrica** → degeneração precoce de um lado
- **Nervo comprimido de um lado** → pode irradiar para glúteo e perna (pseudo-ciática)

O lado direito da sua dor provavelmente corresponde ao lado da compensação principal.

**Como se tornar independente da quiropraxia:**

Quiropraxia pode aliviar sintomas agudos (ajustes manuais, liberação miofascial), mas a solução de LONGO PRAZO é **corrigir a causa** — o desequilíbrio muscular e postural que mantém a pelve desviada.

**Protocolo de autogerenciamento:**

**Fase 1 — Alívio agudo (diariamente enquanto tiver dor):**

- **Liberação miofascial com bola** no QL do lado dolorido: 60-90s, pressão firme mas tolerável
- **Alongamento do QL** deitado: joelhos pro peito, deixe as pernas caírem para o lado oposto à dor. 30-45s, 3x
- **Cat-cow**: 4 apoios, arredonde e arqueie a coluna lentamente. 10 repetições. Mobiliza segmentos comprimidos
- **Posição de alívio**: deitado de costas, pernas elevadas a 90° num banco/cadeira. 5-10 min. Reduz compressão discal e espasmo

**Fase 2 — Correção (3-5x/semana):**

- **Dead bug**: 3x10 cada lado — estabiliza a pelve em posição neutra
- **Bird-dog**: 3x10 cada lado — anti-rotação e estabilização
- **Side plank do lado fraco**: 3x15-20s — fortalece o lado inibido
- **Ponte de glúteo com ênfase unilateral**: 3x12 cada — ativa glúteo do lado fraco
- **Pallof press**: 3x10 cada — anti-rotação funcional
- **Alongamento do iliopsoas bilateral**: 30-45s cada, diariamente

**Fase 3 — Manutenção (permanente):**
- 10 minutos de mobilidade pélvica + core TODO DIA (inegociável)
- Consciência postural ao sentar e ficar em pé
- Exercícios unilaterais no treino de musculação
- Liberação com bola 2-3x/semana preventivamente

**Quando NÃO é "só" desvio de bacia (sinais de alerta):**
- Dor que irradia abaixo do joelho → possível compressão nervosa real → médico
- Perda de força ou sensibilidade na perna → urgente → médico
- Dor que não melhora com NADA em 4-6 semanas → investigar com imagem (RM)
- Dor noturna que acorda → descartar causas não mecânicas

**Sobre dependência de quiropraxia/fisioterapia:**
- Sessões manuais são ferramentas de CURTO PRAZO — resolvem o sintoma no momento
- O trabalho ATIVO (exercícios de correção, fortalecimento, mobilidade) é a solução de longo prazo
- Objetivo: usar sessões profissionais inicialmente para "desbloquear" + exercícios de autogerenciamento para manter
- Após 8-12 sessões com melhora, você deveria precisar cada vez MENOS da intervenção passiva

Marcelo, a independência é possível — mas exige investir 10-15 minutos diários em corretivos. É menos tempo (e dinheiro) do que sessões semanais de quiropraxia pro resto da vida.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Ia no quiro toda semana por 2 anos. Quando comecei a fazer os corretivos diariamente (dead bug, bird-dog, liberação do QL), reduzi pra 1x/mês e depois parei. A dor que era 7/10 crônica foi pra 1-2/10 esporádica. O exercício corretivo é o tratamento real — a quiropraxia era o band-aid.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_018',
    content: `A analogia de "band-aid vs tratamento real" é perfeita. Cada vez que saio do quiro me sinto ótimo por 3-4 dias, depois volta. Vou começar os corretivos diários pra resolver de verdade. 10-15 minutos por dia é nada comparado com o custo das sessões.`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Quando o desvio é só anatômico e tudo bem ──
  {
    userId: 'user_sim_020',
    content: `Fiz todos os exames: raio-X, escanometria, avaliação funcional completa. Resultado: tenho uma assimetria pélvica ANATÔMICA leve (diferença de 6mm na perna), sem componente funcional significativo, sem dor, sem limitação. Meu ortopedista disse que "não precisa corrigir, só monitorar". Mas a assimetria estética me incomoda. Devo aceitar ou insistir em tratar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Beatriz, essa é uma situação onde a resposta MÉDICA e a resposta ESTÉTICA podem entrar em conflito — e vale analisar com cuidado.

**O que seu ortopedista quis dizer:**

6mm de discrepância é considerada **assimetria leve** na literatura:
- **<6mm**: geralmente insignificante, não causa sintomas na maioria das pessoas
- **6-15mm**: zona cinzenta — pode ou não causar sintomas, depende de compensações individuais
- **>15mm**: frequentemente sintomática, indicação de tratamento

Sem dor e sem limitação funcional, clinicamente ele está correto: não há necessidade médica de intervenção.

**Mas a estética importa também — e tudo bem.**

A insatisfação estética com o corpo é legítima. A questão é **o que vale a pena fazer** e **o que não muda**.

**O que PODE ajudar esteticamente (mesmo sem "necessidade médica"):**

**1. Palmilha compensatória leve (3-5mm):**
- Mesmo que "clinicamente desnecessária", uma palmilha de 4-5mm no calçado pode melhorar o nivelamento visual
- É simples, barata (R$ 100-200), reversível
- Converse com o ortopedista: "sei que não é obrigatório, mas gostaria de experimentar para estética"
- Muitos ortopedistas concordam quando o paciente comunica claramente a motivação

**2. Treino unilateral para equalizar musculatura:**
- A pelve levemente desnivelada pode ter causado assimetria muscular sutil ao longo dos anos
- Exercícios unilaterais equalizando força e volume melhoram simetria visual
- Foco em glúteo médio bilateral + exercícios unilaterais de MMII

**3. Core e postura:**
- Trabalho de core profundo pode melhorar a postura global e minimizar compensações visuais
- Mesmo sem "necessidade", o benefício estético e funcional é real

**O que NÃO vale a pena:**
- Obsessão com 6mm — literalmente invisível para qualquer pessoa que não seja você
- Sessões frequentes de quiropraxia/osteopatia tentando "alinhar" uma assimetria anatômica (não vai mudar o osso)
- Cirurgia (completamente desproporcional para esse grau)
- Deixar a assimetria dominar sua relação com o corpo

**Perspectiva:**
- Modelos profissionais, atletas olímpicas, atrizes — todas têm assimetrias anatômicas
- 6mm é a espessura de uma caneta esferográfica. Ninguém, em nenhuma circunstância, percebe visualmente
- A diferença estética que você nota é possivelmente amplificada pela consciência do diagnóstico — agora que sabe, "vê" mais

**A proposta equilibrada:**
Faça as coisas simples (palmilha leve, treino unilateral, core), melhore o que pode, e depois dê a si mesma permissão de parar de procurar o "defeito". Seu corpo está saudável, funcional e absolutamente normal — com seus 6mm de individualidade incluídos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: `"6mm é a espessura de uma caneta" — isso me colocou em perspectiva. Eu tenho 8mm de diferença e depois que meu ortopedista me disse isso, passei MESES obcecada. Até que percebi que convivi 35 anos sem saber e não incomodava. O diagnóstico criou a obsessão, não o corpo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Ana Paula, acho que é exatamente isso — saber criou a obsessão. Vou fazer a palmilha leve e o treino unilateral (que são boas práticas de qualquer forma) e parar de me analisar no espelho procurando 6mm de diferença. Obrigada pela dose de realidade gentil! 💜`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🔍 Buscando arena "Desvio de Bacia"...');

  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%desvio%bacia%,name.ilike.%desvio%bacia%,slug.ilike.%bacia%gordura%');

  if (arenaError) {
    console.error('❌ Erro ao buscar arena:', arenaError);
    return;
  }

  if (!arenas || arenas.length === 0) {
    console.log('⚠️  Arena não encontrada. Tentando busca alternativa...');
    const { data: retry } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('name.ilike.%desvio%,slug.ilike.%desvio%');

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
  const baseTime = new Date('2025-02-03T08:00:00Z');

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
