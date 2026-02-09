import { PrismaClient } from '../lib/generated/prisma';
import { v4 as cuid } from 'cuid';

const prisma = new PrismaClient();

// ============================================================
// SEED: Ansiedade, Compulsão e Alimentação
// 32 posts em 8 conversas
// Foco: compulsão alimentar, comer emocional, ciclo restrição-
// compulsão, fome real vs hedônica, relação com comida,
// estratégias práticas baseadas em evidência, quando buscar ajuda
// ============================================================

const POSTS = [
  // ── CONVERSA 1: Ciclo restrição-compulsão ─────────────────
  {
    userId: 'user_sim_008',
    content: `Tô presa num ciclo horrível: durante a semana sigo a dieta perfeitamente (1.300kcal), mas sexta à noite "algo quebra" e eu como TUDO. Pizza, chocolate, sorvete — fácil 3.000-4.000kcal numa noite. No sábado vem a culpa, no domingo eu começo jejum pra "compensar" e na segunda reinicio a dieta restritiva. Isso acontece há 2 anos. Alguém mais?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Camila, o que você descreve é o **ciclo restrição-compulsão**, um dos padrões mais comuns e mais danosos na relação com a alimentação. E preciso ser direto: **a compulsão é consequência da restrição, não o contrário.**

**O mecanismo fisiológico:**

Quando você come 1.300kcal/dia sendo que seu corpo precisa de ~1.800-2.200kcal, várias coisas acontecem:

**1. Resposta neuroendócrina à escassez:**
- Grelina (fome) sobe progressivamente ao longo da semana
- Leptina (saciedade) despenca
- Neuropeptídeo Y aumenta — este neuropeptídeo especificamente **aumenta o desejo por carboidratos e alimentos hiperpalatáveis**
- Até sexta-feira, seu cérebro está bioquimicamente programado para buscar alimentos densos em energia

**2. Depleção de serotonina:**
- Restrição calórica prolongada reduz triptofano disponível → menos serotonina
- Serotonina baixa = humor rebaixado, irritabilidade, desejo intenso por doce
- Quando você come chocolate/doce na sexta, há uma liberação aguda de serotonina — é um alívio neuroquímico real

**3. O paradoxo da "força de vontade":**
- Decisões alimentares restritivas usam **glicose cerebral e recursos do córtex pré-frontal**
- Ao longo da semana, essa capacidade se esgota (ego depletion)
- Sexta à noite, após uma semana inteira de restrição + trabalho + estresse, o sistema de controle cede ao sistema de recompensa

**A compulsão NÃO é falta de disciplina — é a resposta biológica à privação.**

**Como quebrar o ciclo:**

**Passo 1 — Pare de restringir demais (o mais difícil psicologicamente):**
- Aumente para 1.600-1.800kcal/dia (déficit moderado, não agressivo)
- Inclua alimentos que você gosta DENTRO do plano — todo dia, não só no "dia do lixo"
- Se você ama chocolate: 30g de chocolate 70% (150kcal) todo dia é melhor do que "proibir" e comer 300g na sexta

**Passo 2 — Elimine a mentalidade "tudo ou nada":**
- Não existe "dia da dieta" e "dia do lixo"
- Existe um padrão alimentar sustentável, com flexibilidade DIÁRIA
- Se comeu mais num almoço, ajuste levemente no jantar — sem drama, sem compensação radical

**Passo 3 — Nunca compense com jejum ou restrição no dia seguinte:**
- Compensar alimenta o ciclo: restrição → compulsão → culpa → restrição → compulsão
- Depois de comer demais: a próxima refeição é NORMAL. Não pule, não reduza drasticamente

**Passo 4 — Considere acompanhamento profissional:**
- 2 anos nesse ciclo pode indicar **Transtorno de Compulsão Alimentar Periódica (TCAP)**
- Um psicólogo especializado em comportamento alimentar pode ajudar enormemente
- Não é fraqueza buscar ajuda — é inteligência

Esse ciclo tem solução, mas a solução é contraintuitiva: **comer mais (e melhor), não menos.**`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Camila, eu vivia esse EXATO ciclo por 3 anos. O que quebrou foi quando minha nutricionista me "obrigou" a subir pra 1.700kcal e incluir um doce todo dia. Nas primeiras 2 semanas tive medo de engordar. Na terceira, as compulsões de sexta simplesmente pararam. Parece mágica mas é fisiologia.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: `Tô chorando lendo isso. Sério. Nunca ninguém me explicou dessa forma. Eu achava que era fraca, sem disciplina. Mas faz total sentido — 1.300kcal é muito pouco pra mim. Vou procurar uma nutri que entenda esse ciclo.`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Fome real vs fome emocional ───────────────
  {
    userId: 'user_sim_001',
    content: `Como diferenciar fome real de fome emocional? Quando tô ansiosa ou estressada no trabalho, sinto uma "fome" que parece real — estômago aperta, boca saliva. Mas sei que acabei de almoçar há 1 hora. Isso é cabeça ou corpo?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ana Paula, excelente pergunta — e a resposta é mais complexa do que "é tudo da sua cabeça". A ansiedade **realmente produz sensações físicas de fome** através de mecanismos neuroendócrinos. Não é imaginação.

**Fome fisiológica vs fome emocional — como diferenciar:**

**Fome fisiológica (homeostática):**
- Aparece **gradualmente** ao longo de horas
- Aceita diferentes tipos de alimento (arroz com feijão resolve)
- Vem acompanhada de sinais físicos reais: estômago roncando, leve tontura, queda de concentração
- Após comer, há **saciedade clara** — você para naturalmente
- Não gera culpa depois

**Fome emocional (hedônica):**
- Aparece **subitamente**, muitas vezes associada a um gatilho emocional
- É **específica**: quer chocolate, não brócolis. Quer pizza, não salada
- Pode vir com sensações físicas reais (boca salivando, aperto gástrico) — a ansiedade ativa o **nervo vago** e o eixo HPA, que produzem sintomas digestivos genuínos
- Após comer, **não há saciedade** — a vontade persiste ou volta rápido
- Frequentemente seguida de culpa ou arrependimento

**Por que a ansiedade causa "fome física":**
- Cortisol elevado → aumenta gliconeogênese → oscilação de glicemia → sinalização de fome
- Ativação do sistema nervoso simpático → liberação de adrenalina → contração gástrica (a sensação de "estômago apertando")
- Queda de serotonina na ansiedade → o cérebro busca triptofano via alimentos ricos em carboidrato/açúcar

**Teste prático dos 15 minutos:**
Quando sentir essa "fome" repentina após ter comido:
1. Beba 300ml de água
2. Levante-se, caminhe por 5 minutos (mude o ambiente se possível)
3. Espere 15 minutos
4. Pergunte: "Eu comeria uma banana ou ovo cozido agora?" — Se sim, pode ser fome real. Se não, e você quer especificamente algo doce/gorduroso, é fome emocional
5. Se a "fome" passou com a mudança de atividade → era emocional

**O que fazer quando identificar fome emocional:**
- **Não se culpe** — identificar já é uma vitória enorme
- Nomeie a emoção: "não estou com fome, estou ansiosa/entediada/frustrada"
- Substitua o comportamento: respire fundo 4x, mande uma mensagem pra alguém, saia pra caminhar
- Se mesmo assim comer: coma COM CONSCIÊNCIA, devagar, sentindo o sabor. Comer emocional no piloto automático é muito mais danoso do que comer emocional consciente

A fome emocional não é "defeito" — é um mecanismo de regulação emocional que o cérebro aprendeu. Com prática, você pode criar caminhos alternativos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `O teste da banana é genial e simples. Toda vez que sinto essa "fome" repentina, me pergunto "eu comeria uma maçã agora?" — se a resposta é "não, eu quero biscoito", já sei que é emocional. Identificar é metade da solução.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `A explicação de que ansiedade REALMENTE causa sensações físicas de fome me ajudou muito. Eu achava que tava ficando louca porque "sabia que não era fome" mas sentia fisicamente. Agora entendo o mecanismo. Vou praticar o teste dos 15 minutos!`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Comer de madrugada ────────────────────────
  {
    userId: 'user_sim_010',
    content: `Tenho um problema sério: acordo de madrugada (2h-3h da manhã) e vou direto pra cozinha. Como pão, biscoito, resto de comida — tudo no piloto automático. De manhã nem lembro direito o que comi. Isso tá destruindo minha dieta e minha autoestima. Já tentei não ter comida em casa mas aí fico ansioso de dia.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Thiago, o que você descreve tem nome: **Síndrome do Comer Noturno (Night Eating Syndrome - NES)** ou, dependendo do grau de consciência, pode estar relacionado a **Sleep-Related Eating Disorder (SRED)**. Isso não é falta de disciplina — é uma condição reconhecida no DSM-5.

**Síndrome do Comer Noturno — critérios:**
- Consumo de pelo menos **25% das calorias diárias após o jantar** ou
- **Despertares noturnos com ingestão alimentar** pelo menos 2x/semana
- Consciência do episódio (diferente de SRED, que é parassonia)
- Associada frequentemente a ansiedade, depressão e insônia

**Por que acontece — mecanismos:**

**1. Desregulação do ritmo circadiano alimentar:**
- Em pessoas com NES, os ritmos de **leptina, melatonina e cortisol** estão dessincronizados
- A liberação noturna de melatonina (que deveria suprimir fome) é insuficiente
- Grelina permanece elevada durante a noite

**2. Serotonina baixa:**
- Estudos mostram que indivíduos com NES têm níveis reduzidos de serotonina, especialmente à noite
- A busca por carboidratos de madrugada é uma tentativa inconsciente de elevar serotonina para induzir relaxamento e sono

**3. Restrição diurna:**
- Muitas pessoas com NES comem pouco durante o dia (anorexia matinal é um sintoma clássico)
- A privação acumula e explode à noite quando as defesas estão baixas

**O que fazer:**

**Imediato — Reestruture a alimentação DIURNA:**
- Café da manhã substancial com proteína (mesmo sem fome — force gentilmente nas primeiras semanas)
- Refeições regulares a cada 3-4h durante o dia
- Jantar completo com carboidrato complexo + proteína + gordura boa (NÃO faça low carb à noite — piora NES)
- Lanche pré-sono: iogurte grego + banana ou aveia — fornece triptofano e carboidrato para produção de serotonina/melatonina

**Ambiental:**
- Não tente "esvaziar a cozinha" — isso gera mais ansiedade diurna, como você notou
- Em vez disso: prepare um **lanche pré-sono saudável** e deixe acessível. Se acordar, coma AQUILO e volte pra cama

**Profissional — ESSENCIAL:**
- **Psicólogo/psiquiatra**: NES responde bem a **TCC (Terapia Cognitivo-Comportamental)** e, em alguns casos, a **ISRSs (antidepressivos serotoninérgicos)** que regulam serotonina noturna
- **Médico do sono**: descartar apneia, insônia primária, parassonias
- Isso não é algo pra resolver sozinho com "força de vontade"

Thiago, o mais importante: **isso é uma condição médica tratável**, não falha de caráter. Muitas pessoas melhoram significativamente com tratamento adequado.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `Cara, passei por isso dos 28 aos 32 anos. Só melhorou quando fui no psiquiatra e comecei tratamento com sertralina + TCC. Em 3 meses os episódios de madrugada pararam quase completamente. Não tenha vergonha de buscar ajuda médica — eu perdi 4 anos tentando resolver com disciplina.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010',
    content: `Nem sabia que isso tinha nome. Sempre achei que era gula ou fraqueza. A parte de comer pouco de dia e explodir de noite me descreve 100%. Vou procurar um psicólogo especializado. Obrigado de verdade.`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Ansiedade pré-menstrual e compulsão ───────
  {
    userId: 'user_sim_007',
    content: `Na TPM eu viro outra pessoa com comida. Fico ansiosa, irritada, e a vontade de chocolate e doce fica INCONTROLÁVEL. No restante do mês consigo me controlar normalmente, mas esses 5-7 dias antes da menstruação são um desastre. Alguma estratégia pra lidar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, a compulsão pré-menstrual é **bioquimicamente mediada** — não é "frescura" nem falta de controle. E tentar resistir com pura força de vontade contra a bioquímica é uma batalha perdida. A estratégia certa é **trabalhar COM seu ciclo, não contra ele**.

**O que acontece na fase lútea tardia (5-7 dias pré-menstrual):**

**1. Queda abrupta de serotonina:**
- Estrogênio cai → serotonina cai junto (estrogênio potencializa a síntese de serotonina)
- Serotonina baixa = irritabilidade, ansiedade, humor deprimido, desejo por carboidratos
- Carboidratos aumentam triptofano cerebral → serotonina → alívio temporário
- O desejo por chocolate/doce é literalmente uma **automedicação inconsciente**

**2. Progesterona alta → aumenta apetite:**
- Progesterona eleva a temperatura basal → TMB sobe 5-10% (~100-300kcal/dia)
- O corpo realmente PRECISA de um pouco mais de energia
- Resistir completamente a esse aumento é lutar contra fisiologia

**3. GABA e ansiedade:**
- Flutuações de progesterona afetam receptores GABA (o mesmo sistema que benzodiazepínicos atuam)
- Resultado: aumento de ansiedade, tensão, inquietação — gatilhos clássicos de comer emocional

**Estratégia prática — protocolo "TPM inteligente":**

**Nutrição adaptada (dias -7 a -1 do ciclo):**
- Aumente calorias em **100-200kcal** (seu corpo precisa mesmo)
- Aumente carboidratos complexos em 20-30g (aveia, batata-doce, arroz integral)
- Inclua **chocolate 70%+ diariamente** (30-40g = ~180kcal) — satisfaz o desejo sem espiral
- Mantenha proteína alta (efeito estabilizador de glicemia)
- Adicione alimentos ricos em magnésio: espinafre, amêndoas, semente de abóbora

**Suplementação de suporte:**
- **Magnésio glicinato**: 300-400mg/dia — reduz irritabilidade, ansiedade e retenção
- **Vitamina B6**: 50-100mg/dia na fase lútea — cofator na síntese de serotonina e GABA
- **Ômega-3**: 2g/dia — anti-inflamatório, pode atenuar sintomas de TPM

**Comportamental:**
- NÃO restrinja mais na TPM tentando compensar — isso GARANTE compulsão
- Se quiser doce, coma uma porção definida ANTES de estar desesperada
- Comer preventivamente (uma porção planejada) é diferente de comer reativamente (metade de um pacote)
- Exercício leve a moderado: caminhada, yoga, natação — reduz ansiedade sem aumentar cortisol

**Mentalidade:**
- Esses 5-7 dias NÃO vão arruinar 23 dias de consistência
- Mesmo se comer 200kcal a mais por dia durante 7 dias = 1.400kcal extras no mês = ~0,2kg de gordura teórica
- É insignificante no longo prazo. A compulsão que vem de tentar restringir nesses dias causa MUITO mais dano

Trabalhe com seu ciclo, não contra ele. Seu corpo não é seu inimigo.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `O magnésio glicinato mudou minha TPM drasticamente. A irritabilidade caiu uns 70%, durmo melhor e a compulsão por doce diminuiu muito. Comecei a tomar do dia 14 ao dia 28 do ciclo. Super recomendo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `A sacada de incluir chocolate 70% todo dia na TPM em vez de "proibir doce" é brilhante. Quando eu proíbo, como uma barra inteira de Lacta. Quando permito 30g de amargo, fico satisfeita. Vou testar o protocolo completo no próximo ciclo!`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Comer emocional no tédio ──────────────────
  {
    userId: 'user_sim_011',
    content: `Trabalho home office e meu maior inimigo é o TÉDIO. Quando a tarefa é chata ou tô esperando resposta de alguém, vou pra cozinha. Não é fome. É puro tédio. Já calculei que como umas 500-800kcal extras por dia só nesses "lanches de tédio". Como parar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Lucas, comer por tédio é a forma mais prevalente de comer emocional e tem raízes neurológicas bem documentadas.

**Por que o tédio leva à comida:**

O tédio é um estado de **baixa estimulação dopaminérgica** — o cérebro está sub-estimulado e busca a forma mais acessível e rápida de dopamina. Comida hiperpalatável (doce, salgado, crocante) ativa o sistema de recompensa imediatamente. No home office, a cozinha está a 10 passos — é o path of least resistance.

O ciclo é: tédio → desconforto → busca de recompensa → comida → prazer momentâneo → volta ao tédio → repete.

**Estratégias baseadas em evidência:**

**1. Reestruturação ambiental (maior impacto):**
- **Distância física**: trabalhe no cômodo mais longe da cozinha possível
- **Barreiras visuais**: guarde lanches em armários fechados, não no balcão (o que os olhos não veem, o sistema de recompensa não ativa)
- **Disponibilidade**: se vai existir algo acessível, que seja baixa caloria e alta saciedade — pepino cortado, cenoura, tomate cereja
- Pesquisa do Brian Wansink: visibilidade e proximidade de comida aumentam consumo em **até 70%**

**2. Substituição de estímulo (trocar a fonte de dopamina):**
- O cérebro quer estimulação, não necessariamente comida
- Alternativas que funcionam: levantar e fazer 10 agachamentos, 1 minuto de respiração, mandar uma mensagem pra alguém, ouvir uma música, sair na varanda por 2 minutos
- A regra dos "5 minutos": quando sentir o impulso, faça QUALQUER outra coisa por 5 minutos. Em ~60% das vezes, o impulso passa

**3. Estrutura temporal (prevenção):**
- Trabalhe em blocos de 50min + 10min de pausa ATIVA (não na cozinha)
- Planeje os horários exatos das refeições e lanches — coma NESSES horários, não nos intervalos
- Ter estrutura reduz o espaço para decisões impulsivas

**4. Mindful eating quando comer:**
- Se mesmo assim for comer: sente-se à mesa, ponha no prato, coma devagar
- Comer de pé na frente da geladeira = piloto automático = 3x mais consumo
- Comer sentado, no prato, com atenção = satisfação com muito menos volume

**5. Protocolo de "3 perguntas" antes de abrir a geladeira:**
1. "Estou com fome ou entediado?"
2. "Comeria uma fruta ou ovo agora?" (se não → não é fome)
3. "O que eu realmente preciso neste momento?" (geralmente: estímulo, movimento, pausa)

**Sobre as 500-800kcal extras:**
Isso representa ~3.500-5.600kcal/semana — o equivalente a 0,5-0,8kg de gordura potencial. Corrigir SÓ esse hábito pode ser mais impactante do que qualquer dieta restritiva.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `A técnica que funcionou pra mim no home office: coloco um copo d'água grande na mesa e toda vez que sinto vontade de ir na cozinha, bebo um gole e faço 10 flexões. Em 3 semanas virou hábito — perdi 2kg sem mudar a dieta, só cortando os lanches de tédio.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `A regra dos 5 minutos parece simples mas aposto que funciona. E a parte de guardar os lanches fora da vista — meu pacote de biscoito fica LITERALMENTE do lado do monitor. Vou mudar isso hoje. 😅`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Culpa e vergonha após comer demais ────────
  {
    userId: 'user_sim_017',
    content: `Ontem fui num aniversário e comi bolo, salgadinho, brigadeiro. Voltei pra casa com tanta CULPA que chorei. Hoje tô pensando em fazer jejum de 24h pra compensar. Sei que isso é errado mas a culpa é insuportável. Como parar de me sentir assim?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Renata, primeiro: **não faça jejum de 24h pra compensar.** Isso alimenta o ciclo culpa → punição → restrição → compulsão que é exatamente o que queremos quebrar.

Agora vamos falar sobre a culpa em si, porque ela é talvez a emoção mais destrutiva na relação com comida.

**Por que a culpa alimentar é tão poderosa:**

A cultura da dieta criou uma **moralização da comida** — alimentos são classificados como "bons" ou "ruins", "limpos" ou "sujos", "permitidos" ou "proibidos". Quando você come um alimento "proibido", o cérebro processa isso como **transgressão moral**, ativando os mesmos circuitos de vergonha e culpa que seriam ativados por um ato realmente antiético.

Mas comer brigadeiro num aniversário **não é uma falha moral**. É uma experiência social e alimentar normal.

**Os danos reais da culpa alimentar:**

**1. Efeito "dane-se" (what-the-hell effect):**
- Pesquisas de Janet Polivy: quando pessoas em dieta "quebram" uma regra, pensam "já estraguei tudo, tanto faz" e comem MUITO mais do que comeriam se não tivessem a regra
- A culpa por comer 3 brigadeiros pode levar a comer 10 — a culpa CAUSA mais exagero, não menos

**2. Ciclo de punição:**
- Comeu demais → culpa → jejum/restrição → fome/privação → compulsão → mais culpa
- Cada volta no ciclo é mais intensa que a anterior

**3. Relação tóxica com comida:**
- Prazer natural da alimentação é substituído por ansiedade e medo
- Situações sociais viram fonte de estresse em vez de alegria
- Comida deixa de ser nutrição e prazer e vira campo de batalha emocional

**Como lidar com a culpa AGORA:**

**1. Matemática real (coloque em perspectiva):**
- Suponha que você comeu 1.500kcal extras na festa (isso é MUITO)
- 1.500kcal = ~0,2kg de gordura teórica
- Seu corpo não "transformou" essas calorias em gordura instantaneamente — parte foi termogênese, parte glicogênio
- No contexto de um mês inteiro, 1.500kcal extras representam ~1,6% do total mensal
- É IRRELEVANTE no longo prazo

**2. A próxima refeição é NORMAL:**
- Não é restrita, não é punitiva
- Coma normalmente — seu corpo autorregula se você deixar
- Seu apetite provavelmente estará naturalmente menor amanhã — confie nisso

**3. Reframe cognitivo:**
- Troque "eu comi demais, sou fraca" por "comi em um aniversário, faz parte da vida, amanhã volto ao meu padrão"
- Nenhum fisiculturista de elite mantém 100% de aderência 365 dias/ano — e você não precisa manter também

**4. Se a culpa é frequente e intensa → busque ajuda:**
- Culpa alimentar crônica pode ser sintoma de transtorno alimentar restritivo
- TCC para transtornos alimentares é altamente eficaz
- Não normalize sofrimento com comida

Renata, comer brigadeiro no aniversário da sua amiga é **viver**. Não é falha. A saúde se constrói no padrão de meses e anos, não numa festa.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `"Comer brigadeiro num aniversário não é uma falha moral" — precisava ler isso. Eu também chorava depois de festas. Quando comecei terapia com foco em comportamento alimentar, a terapeuta me mostrou que a culpa estava causando mais dano do que a comida em si. Hoje como na festa, curto, e no dia seguinte sigo normal.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: `Li umas 3x essa resposta. A parte sobre a moralização da comida me pegou forte. Eu realmente trato chocolate como se fosse crime. Vou NÃO fazer o jejum e comer normalmente hoje. E vou procurar um psicólogo. Obrigada ❤️`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Relação entre dietas restritivas e TCA ────
  {
    userId: 'user_sim_002',
    content: `Já fiz low carb, cetogênica, jejum 16:8, jejum de 24h, dieta do ovo, sopa... Toda dieta nova funciona 2-3 semanas e depois eu "explodo". Minha psicóloga disse que eu posso ter desenvolvido Transtorno de Compulsão Alimentar de tanto fazer dieta restritiva. Isso é possível? Dieta pode CAUSAR compulsão?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, sim. A relação entre dietas restritivas e desenvolvimento de Transtorno de Compulsão Alimentar (TCA) é bem documentada na literatura.

**O que a ciência diz:**

**Estudo de Minnesota (Ancel Keys, 1944-1945):**
- 36 homens saudáveis, sem histórico de problemas alimentares, foram submetidos a semi-inanição controlada (~1.600kcal/dia com alta atividade)
- Resultados: **100% desenvolveram** obsessão por comida, pensamentos intrusivos sobre alimentação, episódios de compulsão quando tinham acesso a comida, comer escondido, perda de controle
- Após o período de restrição, muitos continuaram com padrões compulsivos por MESES mesmo com comida abundante
- Homens sem NENHUM histórico prévio de problema alimentar desenvolveram comportamentos idênticos ao TCA

**Evidências atuais:**
- Restrição calórica crônica é o **preditor mais robusto** de desenvolvimento de compulsão alimentar (Polivy & Herman, 1985, e dezenas de estudos subsequentes)
- O risco é dose-dependente: quanto mais dietas restritivas no histórico, maior a probabilidade de TCA
- Estima-se que **35% dos "dieters" progridem para comportamento alimentar patológico** e ~25% destes desenvolvem transtorno alimentar clínico

**O mecanismo:**
1. Restrição → privação calórica e psicológica
2. Privação → adaptações hormonais (grelina ↑, leptina ↓, NPY ↑)
3. Compulsão como resposta biológica à privação
4. Culpa → mais restrição → mais compulsão → ciclo se intensifica
5. Com o tempo, o padrão se torna automático e desconectado da fome real → transtorno

**Critérios diagnósticos do TCA (DSM-5):**
- Episódios recorrentes de compulsão (comer grande quantidade + sensação de perda de controle)
- Pelo menos 3 de: comer rápido, comer até desconforto, comer sem fome, comer sozinho por vergonha, sentir culpa/nojo após
- Sofrimento significativo
- Pelo menos 1x/semana por 3 meses
- SEM comportamentos compensatórios regulares (diferencia de bulimia)

**O que fazer:**

**1. Parar TODAS as dietas restritivas — imediatamente:**
- Isso parece assustador, mas é o primeiro passo do tratamento
- Comer de forma regular, estruturada, sem proibições, com quantidade adequada
- O objetivo inicial NÃO é emagrecer — é normalizar a relação com comida

**2. Tratamento profissional:**
- **TCC para TCA** é o padrão-ouro (eficácia de ~50-60% de remissão completa)
- **Nutricionista comportamental** (não prescritiva/restritiva)
- Em alguns casos, **medicação** pode auxiliar (ISRSs, lisdexanfetamina)
- Sua psicóloga está no caminho certo — mantenha o acompanhamento

**3. Linha do tempo de recuperação (realista):**
- 3-6 meses para estabilizar padrão alimentar
- 6-12 meses para reduzir significativamente episódios compulsivos
- 1-2 anos para reconstruir relação saudável com comida
- Emagrecimento pode acontecer como CONSEQUÊNCIA, não como objetivo

Juliana, o fato de sua psicóloga ter identificado isso é excelente. Muitas pessoas passam anos em ciclos de dieta sem nunca receber esse diagnóstico.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Esse post é importantíssimo. Eu fui diagnosticada com TCA aos 34 depois de 15 anos de dietas restritivas. Minha terapeuta me disse exatamente isso — as dietas não eram a solução, eram a CAUSA. 1 ano de TCC e nutricionista comportamental e hoje como sem medo, sem compulsão, e ironicamente perdi peso sem fazer dieta.`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Alimentação intuitiva funciona? ───────────
  {
    userId: 'user_sim_020',
    content: `Minha nutri sugeriu que eu pare de contar calorias e tente "alimentação intuitiva". Depois de anos contando tudo no app, tenho MEDO de parar. E se eu engordar? A alimentação intuitiva realmente funciona pra quem precisa emagrecer ou é só pra quem quer manter o peso?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Beatriz, questão super relevante. A alimentação intuitiva é frequentemente mal interpretada tanto por quem defende quanto por quem critica. Vamos aos fatos.

**O que é alimentação intuitiva (Tribole & Resch, 1995):**
- Framework com **10 princípios** que incluem: rejeitar mentalidade de dieta, honrar a fome, fazer paz com a comida, respeitar a saciedade, descobrir satisfação, lidar com emoções sem comida, respeitar o corpo, movimento prazeroso, nutrição gentil
- NÃO é "comer o que quiser sem pensar" — isso é uma distorção do conceito

**O que a ciência diz:**

**Benefícios bem documentados:**
- Melhora significativa em comportamento alimentar desordenado
- Redução de compulsão alimentar e comer emocional
- Melhora de indicadores psicológicos: autoestima, satisfação corporal, qualidade de vida
- Melhora de indicadores metabólicos: pressão arterial, perfil lipídico, HbA1c (em alguns estudos)

**Sobre perda de peso:**
- A maioria dos estudos mostra **manutenção de peso**, não perda significativa
- Porém: muitos participantes desses estudos são ex-restritores crônicos que estavam em ciclo de restrição-compulsão
- Quando o ciclo para, o peso tende a se **estabilizar** — para muitos, isso já é uma vitória

**Para quem funciona melhor:**
- Pessoas com histórico de dietas restritivas e relação disfuncional com comida ✅
- Pessoas com compulsão alimentar ✅
- Pessoas com ansiedade/culpa alimentar ✅

**Para quem pode não ser o melhor caminho (inicialmente):**
- Atletas com objetivos de performance/composição corporal específicos
- Pessoas com condições metabólicas que exigem controle nutricional (diabetes tipo 1, por exemplo)

**Abordagem intermediária que pode funcionar pra você:**

Se contar calorias te gera ansiedade mas parar completamente te dá medo, considere uma **transição gradual:**

**Fase 1 (4-6 semanas): Pare de contar, mantenha estrutura:**
- Monte pratos balanceados por VISUAL (1/2 vegetais, 1/4 proteína, 1/4 carboidrato)
- Coma em horários regulares
- Sem app, sem contagem, sem pesagem de comida
- Foque em sinais de fome e saciedade (antes de comer: "quão faminta estou de 0-10?"; durante: "estou satisfeita?")

**Fase 2 (4-6 semanas): Flexibilize gradualmente:**
- Permita todos os alimentos sem categorizar como "bom/ruim"
- Pratique comer até 80% de saciedade (conceito japonês hara hachi bu)
- Se comer "mais" num dia, observe sem julgar e siga normalmente

**Fase 3 (contínua): Avalie:**
- Seu peso provavelmente estabilizará
- Sua relação com comida melhorará significativamente
- Se perder peso, ótimo — veio como consequência
- Se mantiver, está num peso que seu corpo mantém sem sofrimento

**Sobre o medo de engordar:**
- O medo em si é um sinal de que sua relação com comida precisa de trabalho
- Se a contagem de calorias gera ansiedade, ela está fazendo mais mal do que bem
- Confie no processo e no acompanhamento da sua nutricionista

O objetivo final não é nunca mais saber o que tem no prato — é comer com consciência, sem obsessão, sem medo.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Parei de contar calorias há 8 meses depois de 5 anos usando app religiosamente. Primeiras 2 semanas: pânico total. Primeiro mês: ganhei 1kg. Depois disso: estabilizei e nos últimos 3 meses perdi 2kg naturalmente, sem contar nada. E o mais importante — como sem ansiedade pela primeira vez na vida.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Obrigada pela abordagem equilibrada. Não é "contar é ótimo" nem "contar é horrível" — depende do contexto e da pessoa. Vou confiar na minha nutri e tentar a transição gradual. A fase 1 com visual do prato me parece um bom começo.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🏟️  SEED: ANSIEDADE, COMPULSÃO E ALIMENTAÇÃO');
  console.log('');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'ansiedade', mode: 'insensitive' } },
          { name: { contains: 'ansiedade', mode: 'insensitive' } },
          { slug: { contains: 'compulsao', mode: 'insensitive' } },
          { name: { contains: 'compulsao', mode: 'insensitive' } },
          { slug: { contains: 'compulsão', mode: 'insensitive' } },
          { name: { contains: 'compulsão', mode: 'insensitive' } },
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
    const baseTime = new Date('2025-01-25T07:30:00Z');

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
