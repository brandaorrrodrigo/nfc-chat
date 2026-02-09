import { PrismaClient } from '../lib/generated/prisma';
import { v4 as cuid } from 'cuid';

const prisma = new PrismaClient();

// ============================================================
// SEED: Antes e Depois — Processo Real
// 32 posts em 8 conversas
// Foco: relatos reais de transformação com timeline honesta,
// erros no caminho, platôs, recaídas, o que funcionou de verdade,
// números reais, fotos sem filtro, bastidores da jornada
// ============================================================

const POSTS = [
  // ── CONVERSA 1: 30kg em 18 meses — a jornada completa ────
  {
    userId: 'user_sim_006',
    content: `Perdi 30kg em 18 meses (98kg → 68kg, mulher, 1,63m, 34 anos). Todo mundo me pede "qual o segredo?" e fica frustrado quando digo que não tem segredo. Quero contar o processo REAL aqui — com os altos, os baixos e tudo que ninguém mostra.

**Mês 1-2:** Comecei com déficit de 500kcal e caminhada 30min/dia. Perdi 4,5kg. Mas 2kg eram água. Fácil, motivação altíssima.

**Mês 3-4:** Comecei musculação 3x/semana. A balança PAROU por 3 semanas. Quase desisti. Minha nutri explicou que era retenção hídrica do treino novo. Perdi 3kg no período.

**Mês 5-7:** Meu melhor período. Déficit ajustado, treino pegando, perdi 6kg. Mas no mês 6 tive um episódio de compulsão num fim de semana — ganhei 1,5kg que levaram 2 semanas pra sair.

**Mês 8-10:** PLATÔ DE 6 SEMANAS. Balança travada. Quase troquei de nutricionista. Fiz diet break de 2 semanas na manutenção. Voltei pro déficit e destravou — perdi 4kg.

**Mês 11-13:** Minha fase mais difícil emocionalmente. Pele solta aparecendo, comentários maldosos ("tá doente?"), roupa toda larga. Perdi mais 5kg mas chorei várias vezes.

**Mês 14-16:** Reduzi o déficit pra 300kcal (metabolismo já tinha adaptado). Perda mais lenta — 2,5kg no período. Mas composição corporal mudou muito com musculação.

**Mês 17-18:** Últimos 3kg. Os mais difíceis e lentos. Reverse diet pra manutenção.

**Total real:** 30kg em 18 meses. Mas não foi linear. Teve 3 platôs, 1 compulsão, 2 semanas de diet break, ajustes em nutrição 6 vezes, troca de programa de treino 3 vezes, e uns 15 dias onde comi fora do plano e segui sem culpa no dia seguinte.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Patricia, OBRIGADO por esse relato. Esse é exatamente o tipo de transformação real que esta arena precisa — sem filtro, sem romantização.

**Vou destacar os pontos do seu processo que são UNIVERSAIS:**

**1. A perda NÃO é linear:**
- Seu gráfico de peso teria picos, vales, platôs e degraus — não uma reta descendente
- Qualquer pessoa que mostra uma curva suave é omitindo dados ou mentindo
- Platôs de 3-6 semanas são **fisiologicamente normais**

**2. Os primeiros quilos são os mais fáceis:**
- Seus 4,5kg iniciais incluíam água e glicogênio
- A perda desacelera naturalmente ao longo do tempo
- Expectativa realista: ~0,5-1% do peso corporal por semana, desacelerando

**3. Recaídas fazem parte — a resposta a elas define o resultado:**
- Sua compulsão no mês 6: aconteceu, você seguiu em frente
- Se tivesse desistido, teria perdido os 24kg seguintes
- **"A próxima refeição é normal"** é a frase mais importante

**4. Diet breaks são FERRAMENTA, não falha:**
- Seu diet break destravou o platô
- Comer na manutenção 1-2 semanas normaliza leptina e cortisol
- A maioria desiste por medo de "perder progresso"

**5. Os últimos quilos são desproporcionalmente difíceis:**
- Seus últimos 3kg levaram o mesmo tempo dos primeiros 8kg
- Quanto mais magro, mais o corpo resiste

**6. O impacto emocional é subestimado:**
- Comentários negativos, pele solta, identidade em transição
- Acompanhamento psicológico deveria ser padrão

Patricia, seus 18 meses são um manual. Não é bonito, não é linear — mas é verdadeiro.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Esse relato me deu esperança real. Tô no mês 5, já passei por 1 platô e 1 compulsão. Tava achando que tava fazendo errado. Saber que alguém que perdeu 30kg TAMBÉM passou por isso muda tudo. Obrigada!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `Renata, o que eu queria ter ouvido no meu mês 5: o caminho TEM buracos. Você não está fazendo errado por cair — está fazendo certo por continuar depois de cair. Segue firme! ❤️`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Recomposição — quando a balança mente ─────
  {
    userId: 'user_sim_009',
    content: `Meu "antes e depois" vai confundir todo mundo: em 10 meses fui de 82kg para... 80kg. Só 2kg de diferença. Mas minha cintura saiu de 96cm pra 84cm, braço de 30cm pra 35cm, e caio de 42 pra 38 na calça. A composição corporal mudou RADICALMENTE. A balança é a pior métrica que existe?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Bruno, seu caso é o exemplo PERFEITO de por que a balança, isoladamente, é uma métrica incompleta.

**Sua matemática corporal:**
- Peso: -2kg (parece "nada")
- Cintura: -12cm (mudança ENORME)
- Braço: +5cm (ganho substancial de músculo)
- Calça: 4 números a menos

**O que provavelmente aconteceu:**
- Perdeu ~8-10kg de gordura
- Ganhou ~6-8kg de músculo
- Resultado líquido: -2kg
- Resultado real: transformação completa

**Por que isso acontece:**
- Músculo é ~18% mais denso que gordura → ocupa MENOS espaço por kg
- 1kg de músculo é do tamanho de uma tangerina; 1kg de gordura é do tamanho de uma toranja
- Alguém pode GANHAR peso enquanto fica visivelmente mais magro

**Hierarquia das métricas de progresso:**

**Tier 1 — Mais confiáveis:**
- DEXA scan (padrão ouro)
- Fotos padronizadas mensais
- Medidas de circunferência

**Tier 2 — Úteis com contexto:**
- Bioimpedância (tendência)
- Cargas no treino (subindo = construindo músculo)
- Como a roupa veste

**Tier 3 — Útil apenas como complemento:**
- Balança (peso total)

Bruno, sua transformação é impressionante. Se tivesse desistido porque "a balança não mexe", teria perdido 7 meses de resultados extraordinários.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_004',
    content: `Eu QUASE desisti no mês 4 porque ganhei 1kg na balança. Meu personal me convenceu a tirar medidas — tinha perdido 4cm de cintura. Se não fosse a fita métrica, teria abandonado.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `Exatamente! E o pior: quando conto que "perdi 2kg" as pessoas falam "só?" — aí mostro as fotos e a reação muda completamente. Precisamos mudar essa cultura de que sucesso = número na balança.`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Recaída de 8kg e recomeço ─────────────────
  {
    userId: 'user_sim_002',
    content: `Preciso ser honesta aqui. Em 2023 perdi 12kg e estava muito feliz. Aí veio: mudança de emprego, término de relacionamento, mudança de cidade. Em 6 meses recuperei 8kg. Tô me sentindo um fracasso total. Alguém já passou por uma recaída grande?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, antes de mais nada: **recuperar peso após evento estressante importante não é fracasso — é uma das coisas mais normais da ciência da obesidade.**

**Dados sobre reganho:**
- **~80% das pessoas que perdem peso** recuperam parte em 1-5 anos
- Eventos estressantes são o **gatilho mais comum**
- Cortisol crônico favorece reganho na região abdominal
- Isso NÃO significa que a perda foi inútil

**O que é importante entender:**

**1. Você não "voltou à estaca zero":**
- Perdeu 12kg, recuperou 8 → ainda está 4kg abaixo do início
- Os hábitos que construiu não desapareceram — estão dormentes
- Reativar é mais rápido que construir do zero

**2. O contexto explica tudo:**
- Mudança de emprego + término + mudança de cidade = **tríade de estresse máximo**
- Qualquer pessoa teria dificuldade sob essas condições
- Comida como regulação emocional é resposta adaptativa, não "preguiça"

**3. O recomeço TEM vantagens:**
- Você já sabe o que funciona
- Não precisa de tentativa e erro
- Seu corpo tem "memória muscular"
- Sua experiência te dá **realismo**

**Como recomeçar:**

**Semana 1-2:**
- Volte a estruturar refeições (3-4/dia com proteína)
- Atividade física LEVE (caminhada 20min)
- Durma 7h+
- Objetivo: rotina, NÃO perda

**Semana 3-4:**
- Comece déficit LEVE (200-300kcal)
- Musculação 2-3x/semana
- Introduza proteína adequada

**Mês 2+:**
- Déficit moderado (300-500kcal)
- Musculação 3-4x/semana

A perda inicial vai ser rápida nos primeiros 2-3 meses (reganho recente é mais fácil de reverter).`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Juliana, passei por isso DUAS VEZES. Na terceira, adicionei terapia. 3 anos estável agora. O recomeço é mais forte que o começo porque você JÁ SABE o caminho.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `A ideia de começar as 2 primeiras semanas SEM déficit, só organizando rotina, me alivia muito. Vou devagar dessa vez. Obrigada pelo acolhimento ❤️`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Transformação lenta — 8kg em 1 ano ────────
  {
    userId: 'user_sim_020',
    content: `Minha transformação não é "impressionante": perdi 8kg em 12 meses (73 → 65kg, 1,58m, 40 anos). Mas me sinto OUTRA pessoa. É válido compartilhar mesmo sendo "pouco"?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Beatriz, sua transformação é ABSOLUTAMENTE válida e pode ser mais significativa do que muitas "dramáticas".

**8kg em 12 meses em uma mulher de 40 anos — o que isso REALMENTE significa:**

**1. Velocidade ideal:**
- ~0,67kg/mês = ~0,15kg/semana
- Preserva máximo de massa muscular
- Zero risco de perda significativa de massa magra
- Zero estresse metabólico grave

**2. Sustentabilidade:**
- Perdas lentas têm **MUITO maior chance** de serem mantidas
- A maioria dos mantenedores de longo prazo perdeu gradualmente
- 8kg perdidos lentamente > 20kg perdidos rápido e recuperados

**3. Impacto na saúde real:**
- 8kg = ~11% do peso corporal → **clinicamente significativo**
- Melhora de sensibilidade insulínica: ~25-40%
- Redução de pressão arterial: ~5-10mmHg sistólica
- Melhora de perfil lipídico
- Redução de marcadores inflamatórios

**4. Contexto da idade:**
- Aos 40 anos, com as mudanças hormonais, perder 8kg sustentavelmente é EXCELENTE
- Muitas mulheres nessa idade estão GANHANDO peso

**Por que achamos que 8kg é "pouco":**
- A indústria normalizou perdas de 15-20kg em 12 semanas
- Redes sociais selecionam os extremos
- Mas é exatamente esse 0,7kg/mês que, mantido por 5 anos, transforma vidas

Beatriz, compartilhe sem hesitar. Sua história é REAL, replicável e sustentável.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `Beatriz, eu preciso do SEU tipo de história. Tenho 42 anos e perdi 5kg em 8 meses. Achava que era patético. Agora vejo que é o ritmo certo. Obrigada!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Vocês me emocionaram. Os 8kg mais importantes da minha vida — e os mais saudáveis. Vou compartilhar minhas fotos aqui quando tiver coragem. 💜`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: O que ninguém te conta sobre emagrecer muito ──
  {
    userId: 'user_sim_018',
    content: `Perdi 35kg em 20 meses. Resultado incrível no papel. Mas ninguém me avisou sobre os BASTIDORES:

- Pele solta no abdômen e peito
- Amigos que sumiram (ciúmes?)
- Gente que diz "tá doente"
- Não me reconhecer no espelho
- Roupas todas enormes
- Medo CONSTANTE de engordar
- Estranhamento no sexo
- Precisei de terapia pra nova identidade

Alguém mais passou por esses bastidores?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Marcelo, obrigado por essa honestidade. Tudo que você listou é **documentado na literatura de psicologia bariátrica**.

**Os bastidores reais de grandes perdas:**

**1. Crise de identidade:**
- Seu cérebro mantém uma "imagem corporal interna" que leva **6-12 meses para atualizar**
- Você não se reconhece — é desorientador
- >60% de pacientes pós-bariátrica relatam isso

**2. Mudança nas relações sociais:**
- Sua transformação pode ser percebida como **ameaça**
- Comentários sabotadores são comuns
- Amizades baseadas em comportamentos compartilhados desaparecem

**3. "Está doente" / "Para de emagrecer":**
- Ironia: as mesmas pessoas agora dizem "emagreceu demais"
- Desconforto alheio que se expressa como "preocupação"

**4. Pele solta — o elefante na sala:**
- Após 35kg, algum grau é quase inevitável
- Pode gerar frustração: "fiz todo esse esforço"
- Demora 18-24 meses para avaliar retração máxima

**5. Medo de reganho:**
- **60-70% de pessoas** com grandes perdas desenvolvem ansiedade
- Hipervigilância alimentar, pesagem compulsiva
- TCC ajuda significativamente

**6. Necessidade de suporte psicológico:**
- Mudar o corpo muda a psique
- Terapia deveria ser PADRÃO, não exceção

Marcelo, os bastidores são tão parte da transformação quanto a perda em si.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: `A parte de "não me reconhecer no espelho" é REAL. Perdi 28kg e por meses levava susto com reflexos. Meu terapeuta explicou que o cérebro demora. 2 anos depois, normalizou.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_018',
    content: `Saber que 60-70% das pessoas com grandes perdas têm essa ansiedade me alivia. É uma jornada muito mais complexa do que "coma menos, mova mais". Obrigado!`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: O platô mais longo que enfrentei ──────────
  {
    userId: 'user_sim_007',
    content: `Relato de platô: fiquei 9 SEMANAS sem perder um grama. Quase desisti 5 vezes. Tava em déficit de 400kcal confirmado, treinando 4x/semana, dormindo 7h. Minha nutri insistiu pra eu continuar. Na semana 10, perdi 2,3kg de UMA VEZ. Alguém explica?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, o que você experimentou é o **whoosh effect** — o fenômeno mais frustrante da perda de gordura.

**O que provavelmente aconteceu:**

**1. Você ESTAVA perdendo gordura o tempo todo:**
- Com déficit de 400kcal/dia por 9 semanas: ~25.200kcal = ~3,3kg de gordura real
- Mas a balança não refletiu porque...

**2. As células de gordura se encheram de água:**
- Quando liberam triglicerídeos, frequentemente **preenchem o espaço com água**
- A célula mantém seu volume, trocando gordura por água
- Seu peso: gordura saiu, água entrou → balança estável

**3. Cortisol e retenção sistêmica:**
- Estresse do déficit prolongado eleva cortisol
- Estresse por "por que não emagreço?" eleva MAIS
- Cortisol alto → retenção hídrica sistêmica
- Kg de água mascarando kg de gordura

**4. O "whoosh":**
- Em algum momento, o corpo libera a água retida
- Gatilho: refeição mais calórica, boa noite de sono, redução de estresse, ciclo menstrual
- De repente: 2,3kg overnight

**Como lidar com platôs:**

**O que fazer:**
- Continue por **mais 2-3 semanas** além de onde quer desistir
- Use medidas e fotos como backup
- Diet break de 1-2 semanas pode desbloquear (reduz cortisol)
- Refeição mais calórica também pode gatilhar

**O que NÃO fazer:**
- Cortar mais calorias (piora cortisol = mais retenção)
- Adicionar mais cardio (mais estresse)
- Desistir (o peso está pronto pra cair)

Fernanda, suas 9 semanas foram 9 semanas de perda de gordura mascarada por água.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: `Isso explica TANTA coisa! Tive um platô de 5 semanas e numa sexta de pizza acordei no sábado 1,8kg mais leve. Achei que a balança tava quebrada. Era o whoosh!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `EXATAMENTE — no dia antes do whoosh eu tinha comido mais que o normal. A explicação do cortisol caindo com a refeição livre faz perfeito sentido!`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Processo real com doença crônica ──────────
  {
    userId: 'user_sim_012',
    content: `Quero contar meu "antes e depois" diferente. Tenho hipotireoidismo + SOP. Perdi "só" 11kg em 14 meses (82 → 71kg, 1,60m, 37 anos). Pra quem tem as duas, cada quilo é uma GUERRA. Meu processo:

- Levotiroxina ajustada 3 vezes até acertar
- Metformina pra resistência insulínica
- Proteína em 2g/kg (fez diferença enorme)
- Musculação 3x + caminhada diária
- Zero cardio de alta intensidade
- Ciclos de 8 semanas déficit + 2 manutenção
- Acompanhamento com endócrino, nutri e psicóloga

Não é glamouroso. Não é rápido. Mas é real.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Roberta, seu relato é **extremamente importante** — representa milhões de mulheres com condições crônicas.

**Por que 11kg com hipotireoidismo + SOP é excepcional:**

**Hipotireoidismo:**
- TMB reduzida em 5-15% até dose correta
- As 3 trocas de levotiroxina significam ~4-6 meses de metabolismo subótimo
- Fadiga crônica afetando treino e NEAT

**SOP:**
- Resistência insulínica **2-3x maior**
- Hiperandrogenismo favorece acúmulo abdominal
- Inflamação crônica
- Dificuldade em mobilizar gordura normalmente

**As duas juntas potencializam negativamente.**

**O que você fez CERTO:**

**1. Tratamento médico PRIMEIRO:**
- Ajustar levotiroxina antes de cobrar estética
- Metformina baseada em evidência

**2. Proteína alta como pilar:**
- 2g/kg com resistência insulínica é essencial
- Estabiliza glicemia, preserva músculo, aumenta saciedade

**3. Ciclos de déficit com pausas:**
- 8 semanas déficit + 2 manutenção é ideal para crônicas
- Evita adaptação metabólica excessiva

**4. Zero cardio intenso:**
- Inteligente — HIIT em mulheres com SOP pode elevar cortisol

**5. Equipe multidisciplinar:**
- Endócrino + nutri + psicóloga deveria ser PADRÃO

**Para quem tem condições crônicas:**
Sua transformação não será igual à de quem não tem. A velocidade será diferente, os obstáculos maiores, e cada quilo deveria ser celebrado proporcionalmente. 11kg em 14 meses com essas condições é excelente.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Roberta, obrigada por compartilhar. Tenho SOP e tô no mês 3 com 1,5kg perdido. Tava me sentindo horrível comparando com amigas. Saber que alguém com as mesmas condições perdeu 11kg me deu perspectiva. Não é sobre velocidade — é sobre persistência.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Mariana, 1,5kg em 3 meses com SOP é ÓTIMO — principalmente se ganhando força e medidas mudando. Continua firme. A gente joga com cartas diferentes, mas ainda pode vencer. 💪`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: 2 anos depois — manutenção é a parte mais difícil ──
  {
    userId: 'user_sim_004',
    content: `Todo mundo foca no "durante" e ninguém fala do "depois". Perdi 22kg há 2 anos e mantenho até hoje (±2kg). Mas manter é MUITO mais difícil do que perder. Meus aprendizados:

1. Não existe "terminar a dieta" — existe ajustar pra manutenção
2. Pesagem diária + média semanal me mantém no controle
3. Tenho um "peso gatilho" — se subir 3kg, ajo imediatamente
4. Treino de força virou inegociável — 4x/semana há 2 anos
5. Proteína alta pra sempre
6. Permito TUDO em moderação
7. 2-3 eventos sociais "sem contar" por mês
8. Terapia mensal pra saúde mental

O processo de perda durou 15 meses. A manutenção é pro resto da vida.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Carlos, esse é possivelmente o post mais valioso desta arena. Porque **a manutenção é onde a maioria falha**.

**Dados sobre manutenção:**
- Dos que perdem >10% do peso, apenas **~20% mantêm** por >2 anos
- National Weight Control Registry mostra que seus 8 pontos refletem comportamentos comuns

**Análise dos seus 8 pontos:**

**1. "Não existe terminar a dieta":**
- Você entendeu que manutenção é nível de consciência permanente
- Não restrição, mas atenção

**2. Pesagem diária + média semanal:**
- **75% dos mantenedores de sucesso** se pesam semanalmente
- Média elimina ansiedade da flutuação
- Funciona como GPS

**3. "Peso gatilho" com ação imediata:**
- Mais fácil perder 3kg que 15kg
- Intervir cedo = mini-correção
- A maioria ignora +3-5kg e só age em +10kg

**4. Treino de força inegociável:**
- Massa muscular é protetor contra reganho
- Mais músculo = TMB maior = margem calórica maior
- 4x/semana por 2 anos indica que virou identidade

**5. Proteína alta permanentemente:**
- Saciedade sustentada
- Preservação muscular
- Efeito térmico alto

**6. Tudo em moderação, nada proibido:**
- Proibição → desejo → compulsão → culpa → ciclo
- Permissão com consciência → satisfação
- **Esta é a diferença entre dieta e estilo de vida**

**7. Eventos sociais "sem contar":**
- Flexibilidade planejada mantém sanidade
- 2-3x/mês é insignificante em 30 dias

**8. Terapia de manutenção:**
- O aspecto mais subestimado
- Manutenção mensal é mais eficaz (e barata) que terapia intensiva após recaída

**O NWCR mostra sobre mantenedores:**
- 78% tomam café da manhã todos os dias
- 75% se pesam pelo menos 1x/semana
- 90% se exercitam ~1h/dia
- Maioria mantém padrão alimentar relativamente consistente

Carlos, 2 anos de manutenção de 22kg. Isso é raro e admirável.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `O conceito de "peso gatilho" salvou minha manutenção. Defini 70kg como limite — se a média semanal passa, entro em déficit leve por 2 semanas. Já ativei 3x em 18 meses e nunca passei de 71.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: `Exatamente, Patricia! O peso gatilho transforma manutenção de algo abstrato em algo concreto. Em vez de "estou engordando 😱", vira "ok, hora de 2 semanas de ajuste". Controle sem obsessão.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🏟️  SEED: ANTES E DEPOIS — PROCESSO REAL');
  console.log('');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'antes-depois', mode: 'insensitive' } },
          { name: { contains: 'antes', mode: 'insensitive' } },
          { slug: { contains: 'antes', mode: 'insensitive' } },
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
    const baseTime = new Date('2025-01-30T07:30:00Z');

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
