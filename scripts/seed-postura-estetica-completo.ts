import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ SEED: Arena Postura & Estética Real (Versão 2)\n');

  // ═══════════════════════════════════════════════════════════
  // PASSO 1: Encontrar ou criar a arena
  // ═══════════════════════════════════════════════════════════

  let arena = await prisma.arena.findFirst({
    where: {
      OR: [
        { slug: 'postura-estetica-real' },
        { slug: 'postura-estetica' },
        { name: { contains: 'Postura' } }
      ]
    }
  });

  if (!arena) {
    console.log('⚠️ Arena não encontrada. Criando...');
    arena = await prisma.arena.create({
      data: {
        slug: 'postura-estetica-real',
        name: '🧍 Postura & Estética Real',
        description: 'Discussões sobre estética corporal sob a ótica da postura e biomecânica. Como a postura afeta sua aparência? Aquele pneuzinho pode ser desalinhamento? Barriga saliente mesmo magro? Ombros caídos arruinando seu shape? Venha entender o que realmente está acontecendo no seu corpo.',
        icon: '🧍',
        color: '#10B981',
        category: 'TREINO_EXERCICIOS',
        isActive: true,
        aiPersona: 'BIOMECHANICS_EXPERT',
        aiInterventionRate: 60,
        aiFrustrationThreshold: 120,
        aiCooldown: 5,
        categoria: 'BIOMECANICA_NFV'
      }
    });
    console.log('✅ Arena criada:', arena.id);
  } else {
    console.log('✅ Arena encontrada:', arena.id, arena.name);
  }

  const ARENA_ID = arena.id;

  // ═══════════════════════════════════════════════════════════
  // PASSO 2: APAGAR posts existentes da arena
  // ═══════════════════════════════════════════════════════════

  console.log('🗑️ Apagando posts existentes...');

  const deletedPosts = await prisma.post.deleteMany({
    where: { arenaId: ARENA_ID }
  });

  console.log(`   🗑️ ${deletedPosts.count} posts apagados`);

  // ═══════════════════════════════════════════════════════════
  // PASSO 3: Criar usuarios (se não existirem)
  // ═══════════════════════════════════════════════════════════

  const userIds: Record<string, string> = {};
  const userNames = [
    { id: 'user_sim_001', name: 'Ana Paula', email: 'ana.paula@example.com' },
    { id: 'user_sim_002', name: 'Juliana Santos', email: 'juliana.santos@example.com' },
    { id: 'user_sim_003', name: 'Mariana Costa', email: 'mariana.costa@example.com' },
    { id: 'user_sim_005', name: 'Rafael Lima', email: 'rafael.lima@example.com' },
    { id: 'user_sim_006', name: 'Patricia Oliveira', email: 'patricia.oliveira@example.com' },
    { id: 'user_sim_007', name: 'Fernanda Alves', email: 'fernanda.alves@example.com' },
    { id: 'user_sim_008', name: 'Camila Ribeiro', email: 'camila.ribeiro@example.com' },
    { id: 'user_sim_009', name: 'Bruno Ferreira', email: 'bruno.ferreira@example.com' },
    { id: 'user_sim_010', name: 'Thiago Martins', email: 'thiago.martins@example.com' },
    { id: 'user_sim_012', name: 'Roberta Mendes', email: 'roberta.mendes@example.com' },
    { id: 'user_sim_014', name: 'Rodrigo Andrade', email: 'rodrigo.andrade@example.com' },
    { id: 'user_sim_016', name: 'Daniela Correia', email: 'daniela.correia@example.com' },
    { id: 'user_sim_017', name: 'Renata Moraes', email: 'renata.moraes@example.com' },
    { id: 'user_sim_020', name: 'Beatriz Gomes', email: 'beatriz.gomes@example.com' }
  ];

  console.log('👤 Verificando usuários...');

  for (const userData of userNames) {
    let user = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          password: 'hashed_password'
        }
      });
      console.log(`   ✅ Usuário criado: ${userData.name}`);
    }

    userIds[userData.id] = user.id;
  }

  // IA User
  let aiUser = await prisma.user.findUnique({
    where: { email: 'ia-postura@example.com' }
  });

  if (!aiUser) {
    aiUser = await prisma.user.create({
      data: {
        email: 'ia-postura@example.com',
        name: 'IA — Postura & Estética',
        password: 'hashed_password'
      }
    });
  }

  const AI_USER_ID = aiUser.id;

  // ═══════════════════════════════════════════════════════════
  // PASSO 4: Criar todos os posts (sem threads)
  // ═══════════════════════════════════════════════════════════

  console.log('\n📝 Criando posts...\n');

  let baseTime = new Date('2026-02-04T08:00:00Z');
  const nextTime = () => {
    baseTime = new Date(baseTime.getTime() + (45 + Math.floor(Math.random() * 90)) * 60000);
    return new Date(baseTime);
  };

  const posts = [
    // THREAD 1: Barriga saliente mesmo magro
    {
      content: 'Sou magra mas tenho barriga — postura pode ser a causa?',
      userId: userIds['user_sim_003'],
      isAIResponse: false
    },
    {
      content: 'Tenho 28 anos, peso 55kg, 1.65m e faço academia há 2 anos. Meu percentual de gordura é 20% mas minha barriga PROJETA pra frente. De perfil parece que estou grávida de 3 meses. Já tentei de tudo: abdominais, dieta, cardio. Nada resolve. Uma amiga disse que pode ser postura. Isso é real? 😩',
      userId: userIds['user_sim_003'],
      isAIResponse: false
    },
    {
      content: `Mariana, sua amiga provavelmente acertou. Com 55kg, 1.65m e 20% de gordura, não há excesso de gordura para justificar essa barriga. O que você descreve é um dos padrões posturais mais comuns e mais confundidos com "gordura":

**Anteversão Pélvica (Anterior Pelvic Tilt)**

É quando sua pelve "tomba" para frente, como se fosse um balde derramando água pela frente. Esse desalinhamento causa uma cascata visual:

1. **Pelve inclina anterior** → aumenta a curvatura lombar (hiperlordose)
2. **Hiperlordose** → empurra as vísceras abdominais para frente
3. **Vísceras projetadas** → barriga saliente mesmo sem gordura
4. **Glúteo parece mais empinado** (mas não é hipertrofia, é a posição da pelve)

**Teste agora mesmo (Teste de Thomas modificado):**

1. Deite de costas em uma mesa ou bancada firme
2. Puxe um joelho em direção ao peito e segure
3. Observe a perna oposta:
   - Se a coxa da perna solta LEVANTA da mesa → seu psoas está encurtado → provável anteversão pélvica
   - Se a coxa fica relaxada na mesa → psoas normal

**Teste 2 (Teste da parede):**

1. Fique de pé, costas encostadas na parede
2. Calcanhares, glúteo, escápulas e cabeça tocando a parede
3. Coloque a mão entre sua lombar e a parede:
   - Se cabe mais que a espessura da sua mão → hiperlordose (anteversão)
   - Se cabe exatamente a mão → normal

**Músculos envolvidos:**

Psoas ilíaco, reto femoral, eretor da espinha (ENCURTADOS). Glúteo máximo e abdominais profundos (FRACOS).

**Protocolo corretivo (4-6 semanas):**

Alongar: psoas, reto femoral, eretor da espinha. Fortalecer: glúteo, transverso abdominal, oblíquos com ênfase em posterior pelvic tilt.

Consegue fazer os dois testes e me contar o resultado?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'FIZ OS DOIS TESTES! No teste de Thomas, minha coxa levantou BEM alto da mesa. No teste da parede, couberam quase 2 mãos na lombar. Então é isso mesmo?! Dois anos fazendo crunch achando que ia resolver e tava PIORANDO? Vou começar o protocolo hoje. Dead bugs e hip thrust com pelvic tilt!',
      userId: userIds['user_sim_003'],
      isAIResponse: false
    },
    {
      content: `Exatamente, Mariana! Seus testes confirmam anteversão pélvica com encurtamento de psoas. Crunch convencional pode piorar porque: fortalece reto abdominal sem ativar transverso, não corrige posição pélvica, reforça o padrão errado.

**Substituições imediatas:**

- Crunch → Dead bugs (4x12)
- Abdominal infra → Reverse crunch com posterior pelvic tilt (3x15)
- Prancha tradicional → Prancha com pelvic tilt + squeeze glúteo (3x30s)

E no hip thrust, o detalhe crucial: no topo, aperte o glúteo E faça retroversão pélvica (esconda o rabo). Volta aqui em 4 semanas com foto de perfil pra comparar!`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'GENTE! Eu tenho o MESMO problema! 52kg e barriga projetada. Meu personal sempre mandava mais abdominal e nunca melhorava. Fiz o teste de Thomas agora e minha coxa levantou MUITO da mesa. Nunca ninguém me falou de anteversão pélvica. Vou mostrar esse thread pra ele!',
      userId: userIds['user_sim_020'],
      isAIResponse: false
    },
    {
      content: 'Eu corrigi a anteversão pélvica em uns 3 meses com fisio + treino corretivo. Minha barriga "sumiu" sem perder 1kg sequer. Meu marido achou que eu tinha feito lipo kkk. É impressionante como a postura muda TUDO visualmente. Persistam no protocolo!',
      userId: userIds['user_sim_006'],
      isAIResponse: false
    },

    // THREAD 2: Ombros caídos para frente
    {
      content: 'Meus ombros vão para frente e arruínam todo meu shape',
      userId: userIds['user_sim_009'],
      isAIResponse: false
    },
    {
      content: 'Treino há 3 anos, tenho peitoral e dorsal desenvolvidos, mas de perfil meus ombros vão pra frente e parece que sou "curvado". De frente meu peito parece menor do que é e meu pescoço parece curto. Isso me incomoda demais. É a famigerada protrusão de ombro? Como corrigir sem perder o que já construí?',
      userId: userIds['user_sim_009'],
      isAIResponse: false
    },
    {
      content: `Bruno, clássico! É o padrão postural mais comum em quem treina musculação — Upper Crossed Syndrome.

**Músculos ENCURTADOS:** Peitoral maior/menor, subescapular, levantador da escápula, esternocleidomastoideo.

**Músculos FRACOS:** Trapézio médio/inferior, romboides, serrátil anterior, rotadores externos do ombro.

**Impacto visual:** De frente peito côncavo, ombros estreitos, pescoço curto. De perfil costas curvadas, cabeça projetada.

**Protocolo corretivo:**

Regra: Para cada série de empurrar (supino, desenvolvimento), faça 2 séries de puxar.

**Exercícios obrigatórios:**
1. Face pulls com rotação externa — 3x15
2. Band pull-aparts — 3x20
3. Wall slides — 3x10
4. Alongamento peitoral em portal — 2x30seg

**Timeline:** 2-3 semanas consciência postural, 4-6 semanas melhora visual, 8-12 semanas mudança estética significativa.

Você treina peito quantas vezes por semana?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Treino peito 2x/semana e NUNCA fiz face pull na vida. Agora entendi o desequilíbrio. Vou começar com face pull em todo treino e a regra de 2:1 puxar/empurrar. A retração escapular no supino é algo que meu personal nunca me ensinou — isso muda a mecânica do exercício?',
      userId: userIds['user_sim_009'],
      isAIResponse: false
    },
    {
      content: `Muda completamente, Bruno! Retração escapular no supino: estabiliza a escápula na bancada (base mais sólida, mais força), abre o peito (maior amplitude), protege o ombro (mantém espaço subacromial).

Como fazer: antes de tirar a barra, aperte as escápulas uma contra a outra como se quisesse segurar uma caneta. Mantenha essa retração DURANTE TODA a série.

Face pulls: comece com carga LEVE. O erro comum é peso demais + momento. A contração final — mãos ao lado das orelhas, abrindo com rotação externa — é onde acontece. Segure 1-2 segundos nessa posição.`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Confirmo tudo isso! Eu tinha protrusão severa, comecei face pulls 4x/semana há 6 meses. Minha postura mudou DRASTICAMENTE. Meu supino até aumentou porque a base escapular ficou mais estável. E esteticamente, meu peito parece 2x maior só porque agora está "aberto".',
      userId: userIds['user_sim_014'],
      isAIResponse: false
    },
    {
      content: 'Mulheres também sofrem com isso! Trabalho em escritório e meus ombros são super para frente. Além de ser feio, me dá dor cervical constante. Comecei os band pull-aparts em casa (comprei elástico por R$15) e em 3 semanas já senti diferença na dor. Exercício simples e barato que funciona.',
      userId: userIds['user_sim_008'],
      isAIResponse: false
    },

    // THREAD 3: Tech neck
    {
      content: 'Tech neck está destruindo meu rosto — papada sem gordura',
      userId: userIds['user_sim_001'],
      isAIResponse: false
    },
    {
      content: 'Tenho 30 anos, sou magra, mas em fotos meu queixo parece ter papada. Uma dermatologista disse que não é gordura, é postura do pescoço — "tech neck" por ficar no celular. Meu pescoço projeta pra frente e cria esse efeito de queixo duplo. Isso realmente acontece? Existe correção sem procedimento estético?',
      userId: userIds['user_sim_001'],
      isAIResponse: false
    },
    {
      content: `Ana Paula, sua dermatologista tem razão — Forward Head Posture (FHP) é um dos efeitos estéticos mais subestimados da postura moderna.

**Como cria "papada":**

A cada centímetro que sua cabeça projeta à frente do ombro, o peso percebido pela cervical aumenta ~4.5 kg. Com 5 cm projeção (comum celular), a cervical sustenta ~27 kg. Isso enfraquece platisma e acumula pele/tecido no submento.

**Teste:**

1. Foto de perfil relaxada
2. Puxe queixo para trás (chin tuck) e outra foto
3. Se "papada" diminui na segunda → é postural

**Exercícios:**

1. **Chin tucks** — Sente ereta, puxe queixo para trás 5 seg, 3x15, 3x/dia
2. **Chin tuck com resistência** — Toalha atrás da cabeça, 3x10
3. **Flexão cervical profunda** — Deitada, acene "sim" leve 1cm, 10 seg, 3x10
4. **Wall chin tucks** — De pé costas na parede, 3x10

**Hábitos:**

- Celular na altura dos olhos
- Monitor na altura dos olhos
- A cada 20min: 5 chin tucks
- Travesseiro neutro

**Timeline:** 3-4 semanas melhora, 8-12 semanas mudança significativa.

Você trabalha muitas horas no computador?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Trabalho 8h no notebook! E o notebook fica na mesa baixa, então olho pra baixo o dia todo. Fiz o teste da foto: a diferença com chin tuck é ABSURDA, parece outra pessoa. Vou ajustar a altura do monitor e começar os chin tucks hoje. Estava cogitando lipo de papada e era POSTURA!',
      userId: userIds['user_sim_001'],
      isAIResponse: false
    },
    {
      content: 'Ana Paula, investe em um suporte pra notebook (R$50-80) ou empilha livros embaixo. Teclado e mouse externos. Essa mudança SOZINHA já muda drasticamente a postura cervical. Eu gastava R$200/mês em fisio e a raiz era o notebook na mesa baixa.',
      userId: userIds['user_sim_016'],
      isAIResponse: false
    },
    {
      content: 'Eu era personal trainer e não sabia que tech neck causava aparência de papada. Fui estudar e agora ensino chin tucks pra TODOS os meus alunos. A quantidade de gente que tem isso e não sabe é absurda. Simples, grátis e muda o rosto em semanas.',
      userId: userIds['user_sim_010'],
      isAIResponse: false
    },

    // THREAD 4: Glúteo caído
    {
      content: 'Meu glúteo é "caído" — é genética ou postura?',
      userId: userIds['user_sim_008'],
      isAIResponse: false
    },
    {
      content: 'Treino glúteo 3x por semana com carga boa. Hip thrust, agachamento, búlgaro, stiff. Mas meu glúteo continua com aparência "caída" e achatada. Minha colega treina MENOS e tem glúteo redondo e empinado. É só genética ou pode ser algo postural que estou ignorando?',
      userId: userIds['user_sim_008'],
      isAIResponse: false
    },
    {
      content: `Camila, pergunta excelente — resposta é: provavelmente os dois, mas postura tem papel ENORME.

**Genética:** Inserção muscular, anatomia pélvica, distribuição de gordura (você não muda).

**Postura (você MUDA):**

- Posição pélvica afeta drasticamente aparência do glúteo
- Ativação glútea: muita gente NÃO ativa glúteo corretamente
- Compensação: quads e lombar roubam o trabalho

**Seu possível problema — Amnésia Glútea:**

Termo técnico para quando glúteo "esquece" de contrair. Acontece por: ficar sentada, dominância de quadríceps, dominância lombar.

**Teste:**

1. Deite de bruços, flexione um joelho 90°
2. Eleve coxa 10 cm
3. Observar contração:
   - Se PRIMEIRO contrai lombar/isquiotibial → amnésia glútea
   - Se PRIMEIRO contrai glúteo → ativação normal

**Protocolo — Acordar o Glúteo:**

**Fase 1 (2-3 sem, ANTES de cada treino):**
- Clamshell com elástico: 3x15 (sentir QUEIMAR)
- Ponte glútea com hold: 3x10, 5 seg contração
- Abdução lateral: 3x12

**Fase 2 — Conexão mente-músculo:**
- Hip thrust: pause 3 seg no topo APERTANDO glúteo
- Agachamento: "empurre chão para os lados" (ativa glúteo médio)
- Búlgaro: calcanhar firme, não ponta do pé

**Expectativa:** 6-8 semanas você nota diferença no formato e volume.

Você sente queimação no glúteo durante treino ou mais nas coxas e lombar?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Sinto MUITO mais nas coxas e lombar! No agachamento, minha lombar dói antes do glúteo cansar. No hip thrust eu sinto mais isquiotibial. Então é amnésia glútea mesmo?! Faz sentido porque fico sentada 10h por dia no trabalho. Vou começar o protocolo de ativação amanhã!',
      userId: userIds['user_sim_008'],
      isAIResponse: false
    },
    {
      content: 'Tive o MESMO problema! Treinava glúteo pesado mas sentia mais nas coxas. Minha fisio me passou ativação glútea com elástico antes do treino (5 minutos). Mudou TUDO. Hoje sinto o glúteo QUEIMANDO. E o formato mudou visivelmente em 2 meses.',
      userId: userIds['user_sim_007'],
      isAIResponse: false
    },
    {
      content: 'Dica de ouro: no hip thrust, pés um pouco mais longe do corpo (não tão perto). Quando pés ficam perto demais, isquiotibiais dominam. Com pés mais afastados, glúteo assume. Sente a diferença na hora!',
      userId: userIds['user_sim_012'],
      isAIResponse: false
    },

    // THREAD 5: Cifose torácica
    {
      content: 'Tenho "corcunda" e isso me dá vergonha — tem conserto?',
      userId: userIds['user_sim_002'],
      isAIResponse: false
    },
    {
      content: 'Tenho 35 anos e desde a adolescência tenho uma curvatura nas costas superiores. Minha mãe sempre falava "endireita as costas" mas nunca melhorou. Agora com 35 parece que piorou. Vejo fotos minhas e fico arrasada. Isso tem nome? Tem solução nessa idade?',
      userId: userIds['user_sim_002'],
      isAIResponse: false
    },
    {
      content: `Juliana, tem nome sim — **hipercifose torácica**. Aumento excessivo da curvatura natural da coluna torácica (parte alta das costas).

**Tipos:**

1. **Cifose postural (funcional)** — Mais comum. Causada por hábitos, fraqueza muscular. CORRIGÍVEL com exercício.
2. **Cifose de Scheuermann** — Estrutural, vértebras em formato cunha. Correção PARCIAL.
3. **Cifose degenerativa** — Idosos, osteoporose.

**Teste para saber:**

1. Deite de bruços, braços ao lado
2. Eleve tronco (sphinx/cobra)
3. Observar curvatura:
   - Se DESAPARECE → postural (boa notícia!)
   - Se PERMANECE → pode ser estrutural → procure ortopedista para raio-X

**Para cifose POSTURAL:**

**Músculos:**
- Alongar: peitoral, abdominais, latíssimo
- Fortalecer: extensores torácicos, trapézio médio/inferior, romboides

**Protocolo:**

**Semanas 1-4:**
- Foam roller torácico: 2 min/dia
- Cat-cow: 3x10
- Prone Y-T-W: 3x8 cada
- Alongamento peitoral: 2x30seg

**Semanas 5-8:**
- Face pulls: 3x15
- Remada com pausa: 2 seg na contração
- Farmer's walk: 3x30m
- Extensão torácica no foam roller: 3x10

**Expectativa:** Aos 35 anos é MUITO responsiva. 2-4 meses para diferença significativa.

Consegue fazer o teste de extensão e me dizer se curvatura diminui?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Fiz o teste da cobra e a curvatura diminuiu BASTANTE! Então é postural, que alívio! Vou comprar foam roller e começar o protocolo. Nunca ninguém me explicou isso — fisioterapeutas só mandavam "ficar reta" sem dar exercícios específicos. Obrigada!',
      userId: userIds['user_sim_002'],
      isAIResponse: false
    },
    {
      content: 'O foam roller foi a melhor compra pra postura. 2 minutos deitada sobre ele na torácica e minha coluna "abre" imediatamente. Faço antes de treinar e antes de dormir. Meu marido disse que em 2 meses pareceu que eu cresci uns centímetros — era a postura abrindo!',
      userId: userIds['user_sim_006'],
      isAIResponse: false
    },

    // THREAD 6: Assimetria de ombros
    {
      content: 'Um ombro mais alto que o outro — normal ou problema?',
      userId: userIds['user_sim_007'],
      isAIResponse: false
    },
    {
      content: 'Em fotos sempre percebo que meu ombro direito é visivelmente mais alto que o esquerdo. Uso bolsa sempre do lado direito e durmo mais virada pra esquerda. Isso é normal ou devo me preocupar? Camisetas ficam tortas em mim e me incomoda muito esteticamente.',
      userId: userIds['user_sim_007'],
      isAIResponse: false
    },
    {
      content: `Fernanda, assimetria é universal. A questão é o GRAU e se tem sintomas.

**Causas comuns:**

1. **Dominância lateral** — Você destra → trapézio superior direito mais tenso. Bolsa sempre direito → elevado cronicamente.
2. **Escoliose funcional** — Leve curvatura lateral, responde a exercício.
3. **Escoliose estrutural** — Fixa na coluna, requer raio-X.

**Teste de Adams:**

1. Pé juntos
2. Incline tronco pra frente com braços soltos
3. Observar de trás:
   - Se um lado das costas mais ALTO → pode ser estrutural → procure ortopedista
   - Se simétrico → provavelmente funcional

**Para assimetria funcional:**

**Hábitos:**
- Alternar bolsa entre ombros OU mochila
- Variar posição de dormir
- Mouse/objetos frequentes no lado oposto periodicamente

**Exercícios:**

**Alongamento (lado alto — direito):**
- Inclinação lateral cervical para ESQUERDA: 3x30seg
- Levantador escápula direito: 3x30seg

**Fortalecimento (lado baixo — esquerdo):**
- Shrugs unilateral só esquerdo: 3x12
- Remada unilateral enfatizando esquerdo: 1 série extra
- Farmer's walk unilateral: 3x30m

**Expectativa:** 6-12 semanas de consciência + exercício corretivo. Não fica 100% simétrica (ninguém é), mas reduz a ponto de não ser perceptível em fotos.

Você sente dor no ombro mais alto?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Puramente estético! Não tenho dor. Fiz teste de Adams e costas parecem simétricas na flexão, então funcional. Vou trocar pra mochila e começar shrugs unilaterais. Obrigada por explicar que assimetria leve é normal — me aliviou!',
      userId: userIds['user_sim_007'],
      isAIResponse: false
    },
    {
      content: 'Eu tinha ombro esquerdo mais alto (sou canhota). Fisio me fez trocar bolsa pro outro lado e fazer 1 série extra de exercícios unilaterais do lado baixo. Em 2 meses, minha mãe observadora disse que "sumiu" a diferença. Não é mágica, é consistência.',
      userId: userIds['user_sim_001'],
      isAIResponse: false
    },

    // THREAD 7: Pernas arqueadas
    {
      content: 'Minhas pernas são arqueadas — dá pra corrigir?',
      userId: userIds['user_sim_005'],
      isAIResponse: false
    },
    {
      content: 'Tenho pernas arqueadas (geno varo) desde criança. Quando fico de pé com pés juntos, meus joelhos não se tocam. Não dói, mas esteticamente me incomoda muito, especialmente de shorts. Já li que pode ser ósseo e não tem jeito. É verdade? Tem algo que exercício possa melhorar?',
      userId: userIds['user_sim_005'],
      isAIResponse: false
    },
    {
      content: `Rafael, vou ser honesto: depende do tipo.

**Dois cenários:**

1. **Geno varo ESTRUTURAL (ósseo)** — Forma do fêmur/tíbia naturalmente curvada. Desde infância, genético. Exercício NÃO muda formato ósseo. Apenas cirurgia se indicação médica.

2. **Geno varo FUNCIONAL (muscular)** — Fraqueza adutores/glúteo médio, rigidez lateral, rotação tibial alterada. Exercício PODE melhorar significativamente.

**Teste funcional:**

1. De pé relaxado → observe gap entre joelhos
2. Conscientemente, rodar joelhos pra dentro (ativar adutores/glúteo)
3. Se gap DIMINUI → há componente funcional
4. Se gap permanece IGUAL → predominantemente estrutural

**Estratégia de preenchimento visual:**

Mesmo estrutural, hipertrofia estratégica "preenche" visualmente o gap = silhueta mais reta.

**Músculos para desenvolver:**

- **Vasto medial (VMO)** — Leg extension últimos 30° + agachamento profundo
- **Adutor** — Adução máquina, sumo squat, Copenhagen plank
- **Gastrocnêmio medial** — Panturrilha pés levemente pra fora
- **Semitendíneo/membranoso** — Leg curl, stiff pés levemente pra dentro

**Protocolo:**

- Leg extension (últimos 30°): 4x15
- Agachamento sumo profundo: 4x12
- Adução máquina (hold 2seg): 4x15
- Panturrilha com rotação externa: 4x20
- Copenhagen plank: 3x20seg

**Expectativa:** Se funcional 2-3 meses melhora visível. Se estrutural, preenchimento reduz percepção do arqueamento 3-6 meses.

Consegue fazer teste funcional?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Fiz teste e gap reduziu um pouco quando ativei. Então tem componente funcional! Vou investir em vasto medial e adutores. A estratégia de "preencher" com músculo faz sentido — nunca tinha pensado. Obrigado pela honestidade sobre o que dá pra mudar!',
      userId: userIds['user_sim_005'],
      isAIResponse: false
    },
    {
      content: 'Tenho geno varo leve e o que mais ajudou esteticamente foi desenvolver vasto medial e panturrilha. Em 6 meses de treino focado, silhueta das pernas ficou MUITO mais harmônica. Não ficou "reta", mas diferença em fotos é enorme. Vale o investimento no treino seletivo.',
      userId: userIds['user_sim_010'],
      isAIResponse: false
    },

    // THREAD 8: Joelho valgo
    {
      content: 'Joelho em X — só estético ou preciso corrigir?',
      userId: userIds['user_sim_017'],
      isAIResponse: false
    },
    {
      content: 'Meus joelhos se juntam quando fico relaxada em pé (joelho valgo). No agachamento eles vão pra dentro também. Meu personal diz que é fraqueza de glúteo. Minha preocupação é dupla: é feio E tenho medo de lesionar no treino. Como corrigir? É possível melhorar em adulto?',
      userId: userIds['user_sim_017'],
      isAIResponse: false
    },
    {
      content: `Renata, seu personal está parcialmente certo — glúteo médio fraco é principal suspeito, mas não único. Valgo dinâmico no agachamento é preocupante funcionalmente. Sob carga, estresse no ligamento colateral medial aumenta. Risco de lesão é real se não corrigir.

**Valgo estático vs Dinâmico:**

- **Estático:** Pode ser estrutural OU funcional
- **Dinâmico:** Quase sempre FUNCIONAL = corrigível

**Cadeia de fraqueza:**

1. Glúteo médio fraco → não controla rotação interna do fêmur
2. Rotadores externos fracos → fêmur roda internamente
3. Dorsiflexão tornozelo limitada → compensação proximal
4. Adutores hiperativos → puxam joelho medialmente
5. Arco colapsado → base instável

**Teste — Single Leg Squat:**

1. Pé em uma perna
2. Agache ~60° de flexão
3. Observar joelho:
   - Se colapsa pra dentro → valgo funcional confirmado
   - Se alinhado com 2º dedo → controle adequado

**Protocolo Completo:**

**Nível 1 — Ativação (semanas 1-3, diariamente):**
- Monster walks: 3x15 passos cada direção
- Clamshell: 3x15 cada lado, hold 3 seg
- Glute bridge: 3x15, empurrando joelhos pra fora

**Nível 2 — Fortalecimento (semanas 4-8, 3x/semana):**
- Lateral band walks: 3x15 (meio agachamento)
- Agachamento com band no joelho: 3x12 (elástico força valgo, você resiste)
- Step up lateral: 3x10 cada perna
- Single leg deadlift: 3x10 cada perna

**Nível 3 — Integração (semanas 9-12):**
- Agachamento livre com foco em "empurrar joelhos pra fora"
- Single leg squat progressivo

**Mobilidade de tornozelo (ESSENCIAL):**

Teste: joelho consegue ultrapassar ponta do pé com calcanhar no chão ~10cm parede? Se não → dorsiflexão limitada.

Exercício: knee-to-wall stretch 3x30seg, diariamente.

**Resultados:** Valgo dinâmico melhora 6-8 semanas. Valgo estático leve melhora 3-6 meses.

Você tem boa mobilidade de tornozelo ou calcanhar sai do chão no agachamento profundo?`,
      userId: AI_USER_ID,
      isAIResponse: true
    },
    {
      content: 'Meu calcanhar SAI DO CHÃO sim no agachamento profundo! Então é tornozelo também! Fiz teste do single leg squat e meu joelho vai MUITO pra dentro dos dois lados. Vou adicionar knee-to-wall stretch todo dia e monster walks antes de treinar. Obrigada por ser tão completa!',
      userId: userIds['user_sim_017'],
      isAIResponse: false
    },
    {
      content: 'Mini band no agachamento mudou minha vida! Valgo severo e em 2 meses de treino com band + glúteo médio + mobilidade tornozelo, agachamento ficou LIMPO. Personal filmou antes/depois — nem parece a mesma pessoa. E visualmente pernas muito mais retas.',
      userId: userIds['user_sim_008'],
      isAIResponse: false
    },
    {
      content: 'Dica: calçado importa MUITO pro valgo. Se treina com tênis macio (Nike Free), base instável, valgo piora. Troque pra sola firme e rasa (sapatilha agachamento ou All Star). Diferença imediata.',
      userId: userIds['user_sim_014'],
      isAIResponse: false
    }
  ];

  console.log(`📝 Inserindo ${posts.length} posts...`);

  for (const post of posts) {
    await prisma.post.create({
      data: {
        arenaId: ARENA_ID,
        userId: post.userId,
        content: post.content,
        isPublished: true,
        isApproved: true,
        isAIResponse: post.isAIResponse,
        viewCount: Math.floor(Math.random() * 100),
        likeCount: Math.floor(Math.random() * 50),
        createdAt: nextTime()
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // PASSO 5: Atualizar contadores da arena
  // ═══════════════════════════════════════════════════════════

  console.log('\n📊 Atualizando contadores da arena...');

  const totalPosts = await prisma.post.count({
    where: { arenaId: ARENA_ID }
  });

  const uniqueUsers = await prisma.post.findMany({
    where: {
      arenaId: ARENA_ID,
      isAIResponse: false
    },
    select: { userId: true },
    distinct: ['userId']
  });

  await prisma.arena.update({
    where: { id: ARENA_ID },
    data: {
      totalPosts,
      dailyActiveUsers: uniqueUsers.length,
      status: 'WARM'
    }
  });

  // ═══════════════════════════════════════════════════════════
  // RELATÓRIO FINAL
  // ═══════════════════════════════════════════════════════════

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED COMPLETO — Postura & Estética Real (v2)');
  console.log('═'.repeat(60));
  console.log(`📊 Posts criados: ${totalPosts}`);
  console.log(`📊 Usuários únicos: ${uniqueUsers.length}`);
  console.log(`📊 Arena status: WARM`);
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
