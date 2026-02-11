require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: AVALIAÇÃO DE ASSIMETRIAS
// Arena: avaliacao-assimetrias
// 32 posts | 8 conversas × 4 posts cada
// Foco: identificação, mensuração e correção de assimetrias
// musculares, posturais e funcionais
// ============================================================

const POSTS = [

  // ============================================================
  // CONVERSA 1: Um lado do corpo mais forte que o outro — é normal?
  // ============================================================
  {
    userId: 'user_sim_003',
    content: `Gente, percebi que meu braço direito é VISIVELMENTE maior que o esquerdo. No supino com halteres, faço 12 reps com o direito de boa, mas o esquerdo trava na 9ª. Na rosca direta, a diferença é ainda mais gritante. Isso é normal ou tenho algum problema? Meu professor da academia disse "todo mundo tem um lado dominante", mas a diferença tá ficando cada vez mais visível. Tenho medo de ficar desproporcional.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ótima observação! Seu professor tem razão parcialmente — assimetrias de força entre membros são EXTREMAMENTE comuns. Mas existe um limiar a partir do qual isso merece atenção.

📊 **O que a ciência diz sobre assimetrias normais:**

Estudos de Impellizzeri et al. (2007) e Bishop et al. (2018) estabelecem que assimetrias de força de até **10-15%** entre membros são consideradas dentro da normalidade. Acima de 15%, aumenta o risco de lesão e merece intervenção.

**Como calcular sua assimetria:**
- Fórmula: ((Lado forte - Lado fraco) / Lado forte) × 100
- Se faz 12 reps com 14kg no direito e 9 reps com 14kg no esquerdo → assimetria de ~25% em resistência muscular — isso está ACIMA do limiar aceitável

🔧 **Protocolo de correção (baseado em Contreras & Schoenfeld, 2011):**

1. **Sempre comece pelo lado fraco** — faça o exercício unilateral primeiro com o esquerdo
2. **O lado forte NUNCA faz mais que o fraco** — se o esquerdo fez 9, o direito faz 9 também
3. **Adicione 1-2 séries extras para o lado fraco** por exercício
4. **Prefira exercícios unilaterais** por 8-12 semanas: rosca alternada, supino unilateral, remada unilateral
5. **Reavalie a cada 4 semanas** medindo circunferência e reps máximas

⏱️ **Expectativa realista:** com treino consistente e protocolo correto, assimetrias de 20-25% costumam reduzir para <10% em 3-4 meses.

A assimetria visual provavelmente está te incomodando mais do que realmente é — nosso cérebro amplifica diferenças quando focamos nelas. Mas o protocolo acima resolve funcionalmente E esteticamente. 💪`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Tenho o MESMO problema, mas nos membros inferiores! Minha perna esquerda é mais fraca e quando faço agachamento, sinto que jogo o peso pro lado direito. Meu fisioterapeuta pediu um teste isocinético e a diferença deu 22%. Comecei a fazer búlgaro e step-up unilateral e em 2 meses já reduziu pra 14%. O segredo é realmente priorizar o lado fraco e ter paciência!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `Muito bom! Vou aplicar esse protocolo de começar pelo lado fraco e limitar o lado forte. Mas uma dúvida: no caso do supino reto com BARRA (não halter), a assimetria piora? Porque a barra permite que o lado dominante compense. Devo evitar barra e ficar só nos halteres até equilibrar?`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 2: Assimetria de quadril — um lado mais alto que o outro
  // ============================================================
  {
    userId: 'user_sim_007',
    content: `Fui numa avaliação postural e a fisioterapeuta disse que meu quadril direito é 1,5cm mais alto que o esquerdo. Ela chamou de "inclinação lateral da pelve". Isso explica porque sempre sinto mais dor lombar do lado esquerdo? E dá pra corrigir ou preciso usar palmilha pra sempre? Tenho 34 anos e nunca tive fratura nem nada.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Excelente pergunta! A inclinação lateral da pelve (ou "lateral pelvic tilt") é uma das assimetrias mais comuns e mais subdiagnosticadas. Vamos destrinchar:

🔍 **Primeiro: é estrutural ou funcional?**

Essa é A pergunta-chave. Existem dois tipos:

1. **Estrutural (anatômica):** diferença real no comprimento dos ossos (fêmur ou tíbia). Ocorre em ~3-4% da população com diferenças >1cm (Knutson, 2005). Neste caso, palmilha compensatória pode ser necessária.

2. **Funcional (muscular):** a pelve está "puxada" por desequilíbrios musculares. Muito mais comum (~60-70% dos casos de inclinação pélvica). Neste caso, é CORRIGÍVEL com exercício.

📋 **Como diferenciar:**
- Deite de barriga pra cima, pernas estendidas → peça alguém medir da espinha ilíaca ântero-superior até o maléolo medial (tornozelo interno) dos dois lados
- Se a diferença for similar à medição em pé → provavelmente estrutural
- Se deitada a diferença diminui ou some → funcional

🎯 **Padrão muscular típico da inclinação funcional (lado alto = direito no seu caso):**
- **Quadrado lombar DIREITO** → encurtado/hiperativo (puxa o quadril pra cima)
- **Glúteo médio DIREITO** → fraco (não estabiliza)
- **Adutor ESQUERDO** → encurtado (compensa)
- **Oblíquo externo DIREITO** → fraco

**Sim, isso explica sua dor lombar esquerda!** O lado esquerdo está sendo sobrecarregado compensatoriamente.

🔧 **Protocolo de correção (6-12 semanas):**
1. **Liberar/alongar** quadrado lombar direito (side-lying stretch, foam roller lateral)
2. **Fortalecer** glúteo médio direito (clamshell, abdução lateral com banda)
3. **Alongar** adutores esquerdos
4. **Exercícios anti-laterais:** side plank do lado ESQUERDO (pra ativar oblíquo direito)
5. **Reeducação do agachamento** com feedback visual (espelho frontal)

A boa notícia: 1,5cm é uma diferença moderada e, se funcional, responde muito bem ao tratamento conservador. 🙌`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `Eu descobri que tinha 2cm de diferença e era ESTRUTURAL (perna direita realmente mais curta). Usei palmilha de 1cm (não corrige tudo de uma vez, o fisio disse que o corpo precisa se adaptar gradualmente) e fiz o trabalho muscular junto. Em 4 meses a dor lombar sumiu completamente. O mais importante é fazer o diagnóstico diferencial certinho antes de sair fazendo exercício aleatório!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `Faz muito sentido! Vou pedir pra minha fisio fazer essa medição deitada pra diferenciar. Se for funcional, já sei o caminho. Uma coisa que percebi: quando corro na esteira, meu tênis direito desgasta muito mais no calcanhar lateral — isso tem relação com essa inclinação?`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 3: Assimetria escapular — escápula alada de um lado só
  // ============================================================
  {
    userId: 'user_sim_005',
    content: `Minha escápula esquerda "salta" pra fora quando faço flexão de braço, mas a direita fica no lugar. Pesquisei e vi que chama "escápula alada". Isso afeta meu treino de costas e ombro? Porque percebo que no pull-up, meu ombro esquerdo faz um "clique" que o direito não faz. Tenho 28 anos, trabalho com computador o dia todo.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ótima auto-observação! Escápula alada unilateral é mais comum do que parece, especialmente em quem trabalha sentado. Vamos entender o mecanismo:

🔬 **O que está acontecendo anatomicamente:**

A escápula é estabilizada principalmente por 3 músculos:
- **Serrátil anterior** — o principal "colador" da escápula na caixa torácica
- **Trapézio (porções média e inferior)** — controla retração e depressão
- **Romboides** — auxiliam retração

Na escápula alada unilateral, quase sempre o problema é **fraqueza do serrátil anterior** daquele lado (Ludewig & Cook, 2000). No seu caso, o serrátil anterior ESQUERDO.

🤔 **Por que só de um lado?**
- Dominância manual (destro → lado esquerdo menos ativado)
- Postura no trabalho (mouse com direita → ombro esquerdo protraído passivamente)
- Padrão compensatório de longa data

⚠️ **O clique no pull-up é preocupante:**
Quando a escápula não estabiliza corretamente, o úmero compensa com movimentos anormais na articulação glenoumeral → pode levar a impingement subacromial ao longo do tempo.

🔧 **Protocolo de correção em 3 fases (Cools et al., 2007):**

**Fase 1 — Ativação (semanas 1-3):**
- Wall slides com foco em protração no topo (3×12, lado esquerdo 2 séries extras)
- Serrátil punch deitado (halter leve, 3×15 lado esquerdo)
- Push-up plus no solo (foco em "empurrar o chão" no final)

**Fase 2 — Estabilização (semanas 4-6):**
- Prancha com protração alternada
- Push-up plus em superfície instável (bola)
- Bear crawl lento com foco escapular

**Fase 3 — Integração (semanas 7-12):**
- Reintroduzir pull-up com foco em "guardar a escápula no bolso" antes de puxar
- Rows com pausa isométrica na retração
- Overhead press unilateral com controle escapular

**Importante:** evite cargas pesadas em exercícios overhead (desenvolvimento, behind-the-neck press) até a escápula estabilizar. O clique deve SUMIR antes de progredir carga. Se persistir após 4-6 semanas, busque avaliação de um fisioterapeuta especializado em ombro. 🎯`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `Passei exatamente por isso! O serrátil push-up plus foi o exercício que mais me ajudou. Uma dica extra: coloquei um post-it no monitor do trabalho escrito "escápulas" — toda vez que vejo, faço uma retração isométrica de 10 segundos. Parece bobo mas em 2 meses minha consciência corporal mudou completamente. O clique no meu ombro sumiu na semana 5 do protocolo!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `Adorei a dica do post-it! Vou fazer isso. Uma dúvida: posso continuar treinando costas normalmente enquanto faço esse protocolo, ou preciso parar os pull-ups e remadas até resolver? Porque costas é meu treino favorito e não queria perder os ganhos...`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 4: Teste do espelho — como fazer autoavaliação de assimetrias
  // ============================================================
  {
    userId: 'user_sim_009',
    content: `Vi um vídeo sobre "avaliação postural em casa" mas eram tantos pontos pra observar que fiquei confusa. Existe um roteiro SIMPLES pra eu me avaliar no espelho e identificar as assimetrias mais importantes? Não tenho acesso a fisioterapeuta no momento (cidade pequena). Queria pelo menos saber ONDE tenho problemas pra direcionar meu treino.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Perfeita pergunta! Uma autoavaliação bem feita não substitui um profissional, mas consegue identificar os padrões mais relevantes. Vou te dar um protocolo simplificado mas eficaz:

📋 **PROTOCOLO DE AUTOAVALIAÇÃO — 4 VISTAS (10 minutos)**

**Preparação:**
- Roupa ajustada (top e short/legging)
- Espelho de corpo inteiro OU peça alguém tirar fotos
- Posição natural — NÃO tente "ficar reta"
- Fotos: frontal, posterior, lateral direita, lateral esquerda

**🔍 VISTA ANTERIOR (de frente):**

1. **Cabeça:** está inclinada pra algum lado? Um ouvido mais baixo?
2. **Ombros:** mesma altura? Um mais à frente que o outro?
3. **Mãos:** com braços soltos, consegue ver mais dorso de uma mão? (indica rotação de ombro)
4. **Quadril:** as cristas ilíacas (osso do quadril) estão na mesma altura? Coloque as mãos nas cristas e observe
5. **Joelhos:** apontam pra frente ou rodam pra dentro/fora? Ambos iguais?
6. **Triângulo de talhe:** o espaço entre braço e tronco é igual dos dois lados? Desigual = escoliose funcional ou inclinação lateral

**🔍 VISTA LATERAL (de lado):**

7. **Orelha-ombro-quadril-tornozelo:** esses 4 pontos deveriam formar uma linha vertical. O que foge?
8. **Curva lombar:** exagerada (lordose) ou retificada (plana)?
9. **Curva torácica:** corcunda exagerada (cifose)?
10. **Cabeça:** projetada à frente do ombro? (anteriorização)

**🔍 VISTA POSTERIOR (de costas):**

11. **Escápulas:** mesma altura? Uma mais proeminente? (escápula alada)
12. **Coluna:** peça alguém passar o dedo sobre os processos espinhosos — forma linha reta?
13. **Pregas glúteas:** mesma altura? (assimetria = possível rotação pélvica)

**🔍 TESTES FUNCIONAIS (bônus):**

14. **Agachamento livre:** filme de frente — um joelho cai mais pra dentro?
15. **Apoio unipodal:** fique 30s em cada pé — qual lado é mais instável?
16. **Flexão de braço:** filme de lado — uma escápula salta mais?

📝 **Como interpretar:**
Anote TUDO que parecer assimétrico. Depois classifique:
- 🔴 **Prioridade alta:** assimetrias que causam dor ou limitam movimento
- 🟡 **Prioridade média:** assimetrias visíveis mas sem dor
- 🟢 **Prioridade baixa:** diferenças sutis sem impacto funcional

Comece SEMPRE pelas vermelhas. Muitas vezes, corrigir 1-2 assimetrias principais resolve várias menores em cascata! 📐`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_018',
    content: `Fiz esse roteiro agora e descobri: ombro direito mais alto, cabeça inclinada pra esquerda, joelho esquerdo cai pra dentro no agachamento, e a escápula esquerda é mais saliente. Achei que era "normal" mas agora vejo que tudo está conectado! O lado esquerdo inteiro parece mais fraco/instável. É como se fosse um padrão em cadeia, né?`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `Obrigada! Muito mais claro que o vídeo que vi. Fiz o teste e meu principal achado foi: cabeça projetada à frente (MUITO), ombros enrolados e no agachamento os dois joelhos caem pra dentro. Mas entre os lados não vi muita diferença — meu problema parece ser mais "geral" do que assimétrico. Isso significa que meu treino deve focar mais em postura geral do que em correção unilateral?`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 5: Assimetria no agachamento — joelho valgo unilateral
  // ============================================================
  {
    userId: 'user_sim_012',
    content: `Filmei meu agachamento de frente e percebi que meu joelho ESQUERDO cai pra dentro (valgo), mas o direito fica perfeito. Já tentei "pensar em empurrar o joelho pra fora" mas não resolve. É fraqueza de glúteo? Problema no tornozelo? Ou pode ser algo no quadril? Peso 68kg, faço agachamento com 50kg na barra. A assimetria aparece mais com carga.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Excelente análise com vídeo — isso é ouro pra entender o padrão! O valgo dinâmico UNILATERAL (só de um lado) é diferente do bilateral, porque aponta pra um desequilíbrio ESPECÍFICO, não geral. Vamos investigar:

🔎 **As 3 causas mais comuns de valgo unilateral (Hewett et al., 2005):**

**1. Fraqueza de glúteo médio do lado afetado (~60% dos casos)**
- O glúteo médio controla a abdução e rotação externa do fêmur
- Se fraco no lado esquerdo → fêmur roda internamente → joelho colapsa medialmente
- **Teste:** Trendelenburg — apoie só na perna esquerda por 30s. Se o quadril DIREITO cai = glúteo médio esquerdo fraco

**2. Restrição de dorsiflexão do tornozelo (~25% dos casos)**
- Se o tornozelo esquerdo tem menos mobilidade, o corpo compensa colapsando o joelho pra dentro
- **Teste:** ajoelhe com um pé na parede, joelho tocando a parede. Meça a distância do dedão à parede. Compare os dois lados. Diferença >2cm = significativa

**3. Rotação pélvica/assimetria de quadril (~15% dos casos)**
- Uma pelve rodada pode criar padrão de rotação interna preferencial de um lado
- **Teste:** deite de barriga pra cima, pernas estendidas. Rode cada quadril internamente e externamente. Compare amplitude dos dois lados

🎯 **Protocolo de correção baseado na causa:**

**Se glúteo médio fraco (causa mais provável):**
- Clamshell com banda (3×15 lado esquerdo + 2×15 lado direito)
- Monster walk lateral (3×12 cada direção)
- Single-leg glute bridge com pausa de 3s no topo (3×10 esquerdo + 2×10 direito)
- Step-down lateral (degrau 15-20cm) com controle de valgo — ESPELHO FRONTAL

**Se tornozelo restrito:**
- Mobilização de tornozelo com banda (band-assisted ankle dorsiflexion) 3×30s
- Calf stretch com joelho dobrado (soleus) 3×30s
- Eleve o calcanhar esquerdo 1-2cm durante o agachamento (calço) enquanto trabalha mobilidade

**No agachamento:**
- Reduza a carga para 70% até o padrão melhorar
- Coloque uma mini-band nos joelhos como feedback tátil (não como exercício — como lembrete)
- Filme SEMPRE de frente para monitorar

⏱️ A maioria dos casos de valgo unilateral por fraqueza de glúteo médio melhora significativamente em 6-8 semanas com protocolo consistente. 🔧`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_002',
    content: `Tive valgo unilateral esquerdo também e no meu caso era TORNOZELO! Eu tinha torcido o tornozelo esquerdo anos atrás e nunca reabilitei direito. Perdi 4cm de dorsiflexão comparado ao direito. 8 semanas de mobilização + fortalecimento de tibial posterior e o valgo no agachamento sumiu. Façam o teste do joelho na parede, é revelador!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Fiz o teste de Trendelenburg e meu quadril direito CAI quando apoio no esquerdo! Então é glúteo médio mesmo. Já o teste do tornozelo deu igual dos dois lados (10cm). Vou focar no protocolo de glúteo médio. Mas posso continuar fazendo agachamento bilateral enquanto corrijo, ou devo trocar por unilateral temporariamente?`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 6: Escoliose funcional vs estrutural — mitos e verdades
  // ============================================================
  {
    userId: 'user_sim_015',
    content: `Tenho escoliose de 12 graus (Cobb) diagnosticada na adolescência. Meu médico disse que é "leve" e não precisa de cirurgia. Mas agora com 31 anos, comecei a treinar pesado e fico com medo de piorar a curva. Meu professor de musculação diz que "treino fortalece e ajuda", mas minha mãe (que tem escoliose mais severa) diz que eu não deveria pegar peso. Quem está certo? Posso treinar normalmente ou preciso de adaptações?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Seu professor tem mais razão do que sua mãe nesse caso, mas com nuances importantes. A ciência é bem clara sobre isso:

📊 **O que sabemos sobre escoliose e exercício (Negrini et al., 2018; SOSORT Guidelines):**

- Escoliose **leve** (10-25° Cobb) em adulto: a curva é ESTÁVEL, não progride mais após maturidade óssea
- Exercício resistido **NÃO piora** a curva em adultos — pelo contrário, fortalece a musculatura de suporte
- A principal preocupação é **dor** e **função**, não progressão da curva
- Sedentarismo é PIOR para escoliose do que treino bem orientado

✅ **Você pode (e deve) treinar. Adaptações recomendadas:**

**O que MANTER normalmente:**
- Agachamento bilateral e unilateral
- Remadas, pull-ups (excelentes para estabilização)
- Glute bridge, hip thrust
- Core anti-rotacional (Pallof press — particularmente útil)

**O que ADAPTAR:**
- **Peso morto:** convencional é OK, mas use espelho lateral para monitorar simetria. Se perceber rotação do tronco, reduza carga
- **Overhead press:** comece unilateral (1 halter) para identificar compensações
- **Prancha:** adicione variações anti-rotacionais que desafiem estabilidade

**O que ter CUIDADO:**
- Exercícios com carga axial máxima (1RM em agachamento/peso morto) — progrida com moderação, foque em 6-12 reps
- Movimentos balísticos com rotação sob carga (ex: Russian twist com peso)

🔬 **Protocolo complementar para escoliose funcional (Schroth-inspired):**
1. **Exercícios de auto-elongação** — crescer axialmente sob carga leve
2. **Respiração rotacional** — direcionar a respiração pro lado côncavo da curva
3. **Fortalecimento assimétrico** — trabalhar mais o lado convexo (mais fraco)

📌 **Ponto crítico:** peça uma reavaliação radiológica agora (se não fez nos últimos 5 anos) para ter um baseline. Depois, reavalie a cada 3-5 anos. Com 12° Cobb, a probabilidade de progressão em adulto é praticamente zero.

Sua mãe se preocupa por experiência própria — e a preocupação é válida para escolioses mais severas. Mas 12° é um cenário onde o exercício é PROTETOR, não agravante. 💚`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Tenho 18° Cobb e treino há 6 anos com pesos. Fiz raio-x no começo e depois de 4 anos — mesmos 18 graus, zero progressão. Minha dor lombar que era frequente praticamente SUMIU depois que comecei a treinar costas pesado (remadas e pull-ups salvaram minha vida). O único cuidado que tomo é evitar peso morto sumo porque sinto desconforto na convexidade. De resto, treino normalmente!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_015',
    content: `Que alívio ler isso! Tanto o protocolo científico quanto a experiência real apontam na mesma direção. Vou conversar com meu professor pra adicionar exercícios anti-rotacionais e de fortalecimento do lado côncavo. Uma última dúvida: Pilates pode ser um bom complemento ao treino de musculação pra quem tem escoliose?`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 7: Rotação pélvica — pelve rodada e suas consequências
  // ============================================================
  {
    userId: 'user_sim_006',
    content: `Minha fisioterapeuta disse que minha pelve está "rodada pra direita" e que isso explica porque sempre sinto mais aperto no piriforme esquerdo e tenho mais dificuldade de ativar o glúteo direito. Ela mencionou algo sobre "PEC pattern" ou padrão de rotação. Alguém já ouviu falar disso? O que exatamente é uma pelve rodada e como isso afeta o treino inteiro?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Sua fisioterapeuta está referenciando um conceito do **PRI (Postural Restoration Institute)**, que é uma abordagem biomecânica muito respeitada. Vou explicar de forma prática:

🔄 **O que é rotação pélvica (Left AIC Pattern):**

O PRI identificou que ~95% das pessoas apresentam um padrão rotacional da pelve para a DIREITA. Isso ocorre por:
- O diafragma direito é maior/mais forte (por causa do fígado embaixo)
- Tendemos a apoiar mais peso na perna direita
- O corpo cria um padrão de "espiral" compensatório

**Na prática, quando sua pelve roda pra direita:**
- Quadril DIREITO: posiciona em rotação interna relativa → dificulta ativação do glúteo
- Quadril ESQUERDO: posiciona em rotação externa relativa → piriforme sobrecarregado
- Diafragma: funciona assimetricamente → pode afetar até respiração

🎯 **Como isso impacta seu treino:**

| Exercício | Impacto |
|-----------|---------|
| Agachamento | Peso desigual nos pés, possível rotação do tronco |
| Peso morto | Tendência a rodar a barra pra um lado |
| Lunge/Búlgaro | Lado direito mais instável, esquerdo "mais confortável" |
| Corrida | Assimetria de passada, pronação diferente em cada pé |

🔧 **Protocolo de restauração (PRI-inspired, simplificado):**

**1. Reposicionar a pelve (diário, 5 min):**
- 90/90 hip shift: deite com pernas em 90°, bola entre joelhos, MUDE O PESO pro lado esquerdo inflando o balão (sim, balão — estimula diafragma esquerdo)
- Se não tiver balão: expire COMPLETAMENTE enquanto pressiona a bola entre os joelhos e sente o chão com a lombar esquerda

**2. Ativar rotadores corretos:**
- Side-lying left adductor pull-back (ativa adutor esquerdo + rotadores internos esquerdos)
- Right glute max activation em decúbito lateral

**3. Integrar no treino:**
- Antes de treinar: 2-3 minutos de 90/90 hip shift
- Exercícios unilaterais com PAUSA no lado deficiente
- Atenção à distribuição de peso nos bilaterais

📌 **Importante:** rotação pélvica é NORMAL em algum grau. O problema é quando se torna excessiva ou causa compensações dolorosas. Se sua fisio identificou, ela provavelmente vê um padrão exacerbado. Siga o tratamento dela e use o treino como complemento! 🔄`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_019',
    content: `Descobri o PRI ano passado e foi um divisor de águas! Eu tinha dor crônica no piriforme esquerdo há ANOS e nenhum alongamento resolvia. 3 semanas de 90/90 hip shift diário e a dor simplesmente sumiu. O conceito de que o corpo tem padrões assimétricos NATURAIS mas que podem se exacerbar é libertador — não é "defeito", é biomecânica humana normal que às vezes precisa de reset.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `Fantástico! Agora entendo porque o piriforme esquerdo é sempre o mais apertado — é compensação da rotação. Minha fisio já está fazendo exercícios PRI comigo. Vou adicionar o 90/90 hip shift antes dos treinos de perna. Uma observação: percebi que quando corro, meu pé esquerdo prona mais que o direito — isso também seria reflexo dessa rotação pélvica?`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 8: Assimetria facial/corporal e aceitação — o lado psicológico
  // ============================================================
  {
    userId: 'user_sim_020',
    content: `Sei que esse grupo é mais sobre correção funcional, mas preciso desabafar: desde que comecei a estudar assimetrias, estou OBCECADA. Fico horas me olhando no espelho, medindo ombros, comparando lados do rosto, tirando fotos de ângulos diferentes. Meu namorado diz que não vê nada mas eu vejo TUDO. Será que passei do ponto? Quando avaliar assimetrias vira algo prejudicial?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Que coragem compartilhar isso — e que bom que você percebeu o padrão. Esse é um tema MUITO importante que pouco se discute no mundo fitness.

⚠️ **O que você descreve tem nome: body checking excessivo**

Body checking é o comportamento repetitivo de examinar, medir e monitorar aspectos do corpo. Em grau leve, é normal (todo mundo se olha no espelho). Mas quando se torna compulsivo e causa angústia, pode ser sinal de:

- **Dismorfia corporal (BDD)** — condição onde a pessoa percebe defeitos que outros não veem ou amplifica defeitos mínimos
- **Perfeccionismo corporal** — busca de simetria "perfeita" que biologicamente NÃO EXISTE

🧬 **Fatos importantes sobre assimetria:**

1. **NINGUÉM é simétrico.** Estudos de Ferrario et al. (2001) mostram que 100% das pessoas têm assimetrias faciais mensuráveis
2. **Assimetrias de até 3-4% são invisíveis** ao olho humano de outras pessoas
3. **Fotos amplificam assimetrias** — lentes de celular distorcem, espelhos invertem. Nem fotos nem espelhos mostram como você REALMENTE é vista
4. **Viés de confirmação:** quando procura assimetrias, SEMPRE encontra — mesmo onde não existem clinicamente

🔍 **Sinais de que passou do ponto:**
- Mais de 1 hora/dia dedicada a examinar assimetrias
- Evitar fotos, ângulos específicos ou situações sociais
- Comparar compulsivamente com outras pessoas
- Angústia significativa que afeta humor e relacionamentos
- Buscar procedimentos ou exercícios corretivos para "defeitos" que outros não percebem

💚 **O que fazer:**
1. **Reduza o body checking:** tente limitar para 1 momento breve por dia (é difícil, mas possível)
2. **Diferencie funcional de estético:** assimetrias que causam DOR ou limitam FUNÇÃO merecem atenção. Assimetrias puramente estéticas que só VOCÊ vê → provavelmente não precisam de intervenção
3. **Converse com um profissional de saúde mental** — especialmente se os sintomas persistem. Terapia cognitivo-comportamental (TCC) é muito eficaz para BDD
4. **Redirecione o foco:** do que seu corpo PARECE para o que seu corpo CONSEGUE FAZER

Avaliar assimetrias é ferramenta útil para direcionar treino e prevenir lesão. Mas quando vira fonte de sofrimento, a ferramenta se tornou o problema. Seu namorado provavelmente está sendo honesto — outras pessoas não veem o que você vê porque a maioria das assimetrias estão dentro da normalidade biológica. 🌱`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `Obrigada por trazer esse tema. Passei por algo similar quando comecei a estudar biomecânica — ficava analisando a postura de TODO MUNDO na rua e a minha própria compulsivamente. O que me ajudou foi uma frase que minha psicóloga disse: "seu corpo não é um projeto a ser corrigido, é um organismo a ser cuidado". Hoje avalio assimetrias com objetividade funcional, sem a carga emocional. É um processo, mas fica mais leve. 💛`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Vou chorar lendo isso 😢 Acho que realmente passei do ponto. Vou procurar um psicólogo e tentar focar nas assimetrias que são funcionais (tenho uma diferença de força real nos membros inferiores que causa dor). O resto, vou tentar soltar. Muito obrigada por não invalidarem o que estou sentindo e por trazerem ciência e acolhimento juntos. Essa comunidade é incrível. ❤️`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================
async function main() {
  console.log('\n🏟️  SEED: AVALIAÇÃO DE ASSIMETRIAS\n');

  // 1. Encontrar arena por slug exato
  const { data: arenas, error: findError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .eq('slug', 'avaliacao-assimetrias');

  if (findError) {
    console.error('❌ Erro ao buscar arena:', findError.message);
    return;
  }

  if (!arenas || arenas.length === 0) {
    console.error('❌ Arena "avaliacao-assimetrias" não encontrada.');
    return;
  }

  const arena = arenas[0];
  console.log(`✅ Arena encontrada: "${arena.name}" (${arena.slug}) — ID: ${arena.id}`);

  // 2. Limpar posts antigos
  console.log('🗑️ Removendo posts antigos...');
  const { data: deleted } = await supabase
    .from('Post')
    .delete()
    .eq('arenaId', arena.id)
    .select('id');

  console.log(`🗑️  Posts antigos removidos: ${deleted?.length || 0}`);

  // 3. Inserir novos posts com timestamps incrementais
  console.log(`📝 Inserindo ${POSTS.length} posts...`);
  const baseTime = new Date('2025-01-20T08:00:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 18 * 60 * 1000);

    const { error: insertError } = await supabase.from('Post').insert({
      id: randomUUID(),
      arenaId: arena.id,
      userId: post.userId,
      content: post.content,
      isPublished: true,
      isPinned: false,
      isOfficial: post.isAIResponse,
      isAIResponse: post.isAIResponse || false,
      isUnderReview: false,
      isApproved: true,
      viewCount: Math.floor(Math.random() * 50) + 5,
      likeCount: post.isAIResponse
        ? Math.floor(Math.random() * 25) + 10
        : Math.floor(Math.random() * 15),
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

  // 4. Atualizar contador
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  await supabase
    .from('Arena')
    .update({
      totalPosts: count,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', arena.id);

  console.log(`📊 Total posts na arena: ${count}`);
  console.log(`\n🏟️  Arena "${arena.name}" populada com ${created} posts! ✅\n`);
}

main().catch(console.error);
