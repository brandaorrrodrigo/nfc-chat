import { PrismaClient, AIPersona, ArenaType } from '@prisma/client';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════
// DADOS COMPLETOS - ARENA 01: PROTOCOLO LIPEDEMA
// ═══════════════════════════════════════════════════════════════

interface ThreadData {
  title: string;
  slug: string;
  posts: {
    content: string;
    authorType: string;
    authorId?: string;
    authorName: string;
    isAiResponse?: boolean;
  }[];
}

const THREADS: ThreadData[] = [
  // ═══════════════════════════════════════════════════════════
  // THREAD 1: O que é lipedema
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Suspeito que tenho lipedema - como saber se é isso mesmo?',
    slug: 'suspeito-que-tenho-lipedema-como-saber',
    posts: [
      {
        content: `Oi pessoal, tenho 34 anos e desde a adolescência minhas pernas são muito mais grossas que o tronco. Faço dieta, emagreço em cima mas as pernas nunca mudam. Quando aperto a coxa dói bastante e vivo com hematomas sem motivo. Minha mãe tem as pernas iguais. Será que é lipedema? Como faço pra descobrir?`,
        authorType: 'user',
        authorId: 'user_sim_002',
        authorName: 'Juliana Santos'
      },
      {
        content: `Juliana, obrigado por compartilhar. O que você descreve tem características muito compatíveis com lipedema. Vou te explicar os pontos-chave:

**O que é lipedema:**
É uma condição crônica que afeta predominantemente mulheres e se caracteriza pelo acúmulo desproporcional de gordura, geralmente nas pernas e quadris. Não é obesidade comum — é uma doença do tecido adiposo com forte componente genético e hormonal.

**Sinais clássicos que você mencionou:**
- Desproporcionalidade corpo superior vs inferior (tronco magro, pernas volumosas)
- Dor ao toque ou pressão nas áreas afetadas
- Hematomas frequentes sem trauma significativo
- Histórico familiar (sua mãe com padrão similar)
- Resistência a dieta e exercício na região afetada

**Como confirmar:**
O diagnóstico é essencialmente clínico. Procure um **angiologista** ou **cirurgião vascular** com experiência em lipedema. Não existe exame de sangue ou imagem que "confirme" lipedema isoladamente — o médico avalia pelo exame físico + histórico.

**Teste simples (não substitui médico):**
Pressione a região da canela (osso da tíbia). Se não forma "caroço" ao apertar (diferente de edema por retenção), mas a coxa e panturrilha são dolorosas ao toque, isso reforça a hipótese.

**Diferença importante:**
- **Lipedema**: gordura dolorosa, pés preservados, não melhora com dieta
- **Linfedema**: inchaço com edema, afeta pés, piora ao longo do dia
- **Obesidade**: gordura distribuída, pés afetados, responde a déficit calórico

Você notou se seus pés ficam inchados ao final do dia ou se o volume é mais nas coxas e panturrilhas?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Nossa, é exatamente isso! Meus pés são normais, magros até. Todo o volume é coxa e panturrilha. Vou procurar um angiologista. Obrigada pela explicação tão clara!`,
        authorType: 'user',
        authorId: 'user_sim_002',
        authorName: 'Juliana Santos'
      },
      {
        content: `Juliana, passo pelo mesmo! Tenho 38 anos e só descobri lipedema estágio 2 ano passado. Procura um angiologista que CONHEÇA lipedema, porque muitos ainda confundem com "só obesidade". Eu fui em 3 médicos antes de ter o diagnóstico correto.`,
        authorType: 'user',
        authorId: 'user_sim_016',
        authorName: 'Daniela Correia'
      },
      {
        content: `Também tenho lipedema e a dica da Daniela é fundamental. Procure médicos que já trabalhem com a condição. A Sociedade Brasileira de Angiologia pode ajudar a encontrar especialistas na sua região.`,
        authorType: 'user',
        authorId: 'user_sim_006',
        authorName: 'Patricia Oliveira'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // THREAD 2: Estágios do lipedema
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Quais são os estágios do lipedema e como saber em qual estou?',
    slug: 'estagios-do-lipedema-como-classificar',
    posts: [
      {
        content: `Fui diagnosticada com lipedema mas o médico não explicou direito os estágios. Sei que existem 4, mas não entendi como classificar. Alguém pode explicar de forma simples?`,
        authorType: 'user',
        authorId: 'user_sim_003',
        authorName: 'Mariana Costa'
      },
      {
        content: `Mariana, ótima pergunta. A classificação em estágios ajuda a entender a progressão e definir a abordagem terapêutica. Vou detalhar cada um:

**Estágio 1 — Inicial:**
- Pele com superfície normal, mas tecido subcutâneo mais espesso
- Nódulos pequenos palpáveis sob a pele (sensação de "bolinhas de isopor")
- Dor leve ao toque profundo
- Visualmente: pernas proporcionalmente maiores, mas sem deformidade evidente
- Muitas mulheres passam anos neste estágio sem diagnóstico

**Estágio 2 — Moderado:**
- Nódulos maiores e facilmente palpáveis (lipomas)
- Superfície da pele começa a ficar irregular (ondulações visíveis)
- Dor mais frequente, inclusive espontânea
- Hematomas com facilidade
- Visualmente: desproporção mais evidente, "colunas" de gordura na parte interna das coxas

**Estágio 3 — Avançado:**
- Grandes massas de gordura e tecido fibrótico
- Deformidade visível com lobos de gordura pendentes
- Dor significativa que pode limitar atividades
- Pele com fibrose e textura irregular
- Mobilidade pode ser afetada

**Estágio 4 — Lipo-linfedema:**
- Lipedema associado a linfedema secundário
- Edema que agora AFETA pés e tornozelos
- Fibrose intensa
- Risco de infecções (erisipela/celulite)
- Mobilidade severamente comprometida

**Importante:**
A progressão NÃO é inevitável. Com tratamento conservador adequado (compressão, exercício, nutrição anti-inflamatória), é possível estabilizar e até melhorar sintomas em qualquer estágio.

Você consegue palpar nódulos nas coxas quando pressiona? E a superfície da pele, como está?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Pelo que você descreveu, acho que estou no estágio 2. Tenho as bolinhas e a pele já tem ondulações. O médico falou em usar meia de compressão. Faz diferença mesmo?`,
        authorType: 'user',
        authorId: 'user_sim_003',
        authorName: 'Mariana Costa'
      },
      {
        content: `Mariana, a compressão é um dos pilares do tratamento conservador. A meia elástica de compressão graduada (geralmente 20-30 mmHg para estágio 2) ajuda a:

- Reduzir a dor ao longo do dia
- Melhorar o retorno venoso e linfático
- Minimizar progressão do edema
- Dar suporte ao tecido durante exercícios

A adaptação pode ser difícil nas primeiras semanas — a meia é apertada e quente. Mas a maioria das mulheres relata melhora significativa na dor após 2-3 semanas de uso consistente.

Dica: coloque logo ao acordar, antes de levantar, quando as pernas estão menos volumosas.

Você já iniciou algum exercício junto com a compressão?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Uso meia de compressão há 8 meses e é outro mundo. No começo sofri mas agora não fico sem. A dor reduziu muito. Vale MUITO a pena insistir.`,
        authorType: 'user',
        authorId: 'user_sim_016',
        authorName: 'Daniela Correia'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // THREAD 3: Alimentação para lipedema
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Qual a melhor dieta para quem tem lipedema?',
    slug: 'melhor-dieta-para-lipedema',
    posts: [
      {
        content: `Tenho lipedema estágio 1 e quero ajustar minha alimentação. Já vi gente falando em keto, low carb, anti-inflamatória... Qual realmente funciona pro lipedema? Não quero mais perder tempo com dieta que não resolve.`,
        authorType: 'user',
        authorId: 'user_sim_001',
        authorName: 'Ana Paula'
      },
      {
        content: `Ana Paula, essa é uma das perguntas mais importantes no manejo do lipedema. Vou te dar o panorama baseado em evidências:

**O que a ciência diz:**
Não existe UMA dieta específica "para lipedema" com evidência robusta de nível A. Mas as pesquisas atuais apontam para abordagens que reduzem inflamação sistêmica e melhoram a função linfática.

**Abordagens com melhores resultados relatados:**

**1. Dieta Anti-inflamatória (mais recomendada como base):**
- Prioriza: vegetais, peixes gordos (salmão, sardinha), azeite, cúrcuma, gengibre
- Elimina: ultraprocessados, açúcar refinado, óleos de semente (soja, milho, canola)
- Reduz: glúten e laticínios (muitas pacientes relatam melhora com redução)
- Foco: qualidade dos alimentos, não apenas calorias

**2. Low Carb Moderado (50-100g carbs/dia):**
- Reduz retenção hídrica rapidamente
- Melhora marcadores inflamatórios
- Mais sustentável que keto a longo prazo
- Permite frutas vermelhas, vegetais e leguminosas

**3. Dieta Cetogênica (keto):**
- Alguns estudos pequenos mostram redução de dor e volume
- Difícil manutenção a longo prazo
- Risco de deficiências nutricionais se mal planejada
- Pode ser útil como fase inicial (4-8 semanas) seguida de low carb

**O que EVITAR independente da abordagem:**
- Açúcar refinado (potente pró-inflamatório)
- Álcool (piora edema e inflamação)
- Ultraprocessados (aditivos que agravam inflamação)

**Minha sugestão prática:**
Comece pela dieta anti-inflamatória como base e reduza gradualmente carboidratos refinados. Observe como seu corpo responde em 4-6 semanas.

Você já tem alguma restrição alimentar ou alergia que eu deva considerar?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Fiz keto por 3 meses e a dor melhorou muito, mas não consegui manter. Agora faço low carb moderado com foco anti-inflamatório e me sinto muito bem. A chave pra mim foi tirar açúcar e glúten.`,
        authorType: 'user',
        authorId: 'user_sim_012',
        authorName: 'Roberta Mendes'
      },
      {
        content: `Roberta, seu relato é muito comum e faz sentido clínico. A fase cetogênica ajuda na "resetada" inflamatória inicial, e a transição para low carb anti-inflamatório é mais sustentável. Sobre glúten: não é necessário eliminar para todas, mas muitas mulheres com lipedema relatam melhora significativa.`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Comecei tirando açúcar há 1 mês e já senti diferença nos hematomas - aparecem menos. Vou seguir a sugestão de ir para low carb gradual. Obrigada pelas dicas!`,
        authorType: 'user',
        authorId: 'user_sim_001',
        authorName: 'Ana Paula'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // THREAD 4: Exercícios seguros
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Quais exercícios são seguros para quem tem lipedema?',
    slug: 'exercicios-seguros-lipedema',
    posts: [
      {
        content: `Tenho lipedema e morro de medo de treinar e piorar. Corrida dói demais, crossfit nem pensar. O que posso fazer sem agravar a condição? Tenho 42 anos, estágio 2.`,
        authorType: 'user',
        authorId: 'user_sim_016',
        authorName: 'Daniela Correia'
      },
      {
        content: `Daniela, seu medo é compreensível mas a boa notícia é: exercício é FUNDAMENTAL no manejo do lipedema. A questão é QUAL e COMO fazer. Vou detalhar:

**Exercícios RECOMENDADOS (seguros e benéficos):**

**1. Exercícios aquáticos (OURO no lipedema):**
- Hidroginástica, natação, caminhada na água
- A pressão hidrostática funciona como compressão natural
- Sem impacto nas articulações
- Melhora drenagem linfática naturalmente
- Ideal: 2-3x por semana, 30-45 min

**2. Musculação com cargas moderadas:**
- Fortalece musculatura sob o tecido lipedematoso
- Melhora bomba muscular (retorno venoso/linfático)
- Usar SEMPRE meia de compressão durante o treino
- Preferir: séries de 12-15 repetições, sem falha muscular

**3. Caminhada (com compressão):**
- Baixo impacto, ativa bomba da panturrilha
- 30-40 min, ritmo moderado
- SEMPRE com meia de compressão
- Terreno plano preferencialmente

**4. Yoga / Pilates:**
- Melhora mobilidade e consciência corporal
- Posturas invertidas auxiliam drenagem
- Fortalece core sem sobrecarga nas pernas

**Exercícios com CAUTELA:**
- Corrida: alto impacto, piora dor e hematomas
- CrossFit/HIIT intenso: excesso de inflamação aguda
- Pular corda: impacto repetitivo

**Regras gerais:**
1. SEMPRE use compressão durante exercício
2. Hidrate-se muito (ajuda sistema linfático)
3. Pós-treino: eleve as pernas 15-20 min
4. Progressão lenta e consistente > intensidade alta esporádica

Você tem acesso a piscina? E já usa meia de compressão durante atividades?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Comecei hidroginástica há 4 meses e é o melhor exercício que já fiz na vida. Na água não dói NADA. Saio da piscina com as pernas leves. Super recomendo pra quem tem lipedema.`,
        authorType: 'user',
        authorId: 'user_sim_017',
        authorName: 'Renata Moraes'
      },
      {
        content: `Faço musculação 3x por semana com meia de compressão e funciona muito bem. No começo tive medo de "engrossar" mais as pernas mas na verdade o músculo por baixo deu mais firmeza e melhorou a circulação.`,
        authorType: 'user',
        authorId: 'user_sim_006',
        authorName: 'Patricia Oliveira'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // THREAD 5: Drenagem linfática
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Drenagem linfática realmente ajuda no lipedema?',
    slug: 'drenagem-linfatica-ajuda-lipedema',
    posts: [
      {
        content: `Minha médica indicou drenagem linfática manual 2x por semana. Mas é caro demais manter isso. Funciona mesmo? Existe alternativa caseira? Já gasto bastante com meia de compressão.`,
        authorType: 'user',
        authorId: 'user_sim_020',
        authorName: 'Beatriz Gomes'
      },
      {
        content: `Beatriz, entendo a preocupação com custo. Vou contextualizar:

**Drenagem linfática manual (DLM) no lipedema:**
A DLM é benéfica especialmente quando há componente de linfedema associado. No lipedema puro (estágios 1-3), o benefício principal é alívio temporário de sintomas — redução de peso/sensação de "pernas pesadas".

**O que a evidência mostra:**
- DLM NÃO reduz a gordura lipedematosa
- DLM AJUDA a mobilizar fluido intersticial
- O efeito é temporário (24-72h)
- Mais eficaz quando combinada com compressão

**Alternativas com boa relação custo-benefício:**

**1. Automassagem linfática (grátis):**
- Movimentos suaves, sempre em direção ao coração
- Começar pela virilha (linfonodos inguinais) e descer
- 10-15 min por noite
- YouTube tem tutoriais excelentes

**2. Pressoterapia (botas pneumáticas):**
- Algumas clínicas oferecem pacotes mais acessíveis
- Existem versões domésticas (investimento inicial)
- Funciona por compressão pneumática sequencial

**3. Exercícios aquáticos:**
- A pressão da água faz "drenagem natural"
- Benefício duplo: exercício + efeito drenante

**4. Elevação de pernas:**
- Gratuito e eficaz
- 15-20 min com pernas acima do coração

**Minha sugestão prática:**
Faça DLM profissional 1x por semana (em vez de 2x) e complemente com automassagem nos outros dias + exercício aquático 2x por semana.

Você já aprendeu a técnica de automassagem?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Comprei uma bota de pressoterapia doméstica há 6 meses e foi o melhor investimento. Uso 3x por semana, 30 minutos. Já senti que não preciso mais da drenagem manual toda semana.`,
        authorType: 'user',
        authorId: 'user_sim_012',
        authorName: 'Roberta Mendes'
      },
      {
        content: `A autodrenagem mudou minha vida. Assisti vídeos no YouTube sobre a técnica Vodder adaptada e faço toda noite antes de dormir. Não é igual à profissional mas ajuda MUITO na sensação de peso e dor.`,
        authorType: 'user',
        authorId: 'user_sim_003',
        authorName: 'Mariana Costa'
      },
      {
        content: `Ótimas dicas, meninas. Vou começar com a automassagem e ver se consigo uma bota pressoterapia. Obrigada!`,
        authorType: 'user',
        authorId: 'user_sim_020',
        authorName: 'Beatriz Gomes'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // THREAD 6: Lipedema e hormônios
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Lipedema piora com hormônios? Anticoncepcional e menopausa',
    slug: 'lipedema-hormonios-anticoncepcional-menopausa',
    posts: [
      {
        content: `Tenho 45 anos, lipedema estágio 2, e estou entrando na perimenopausa. Notei que as pernas estão piorando rápido nos últimos meses. Minha filha de 16 anos começou a desenvolver os mesmos sinais depois que tomou anticoncepcional. Hormônios realmente pioram o lipedema?`,
        authorType: 'user',
        authorId: 'user_sim_017',
        authorName: 'Renata Moraes'
      },
      {
        content: `Renata, sua observação está absolutamente correta. A relação hormonal é forte:

**Lipedema e hormônios — o que sabemos:**

O lipedema é uma condição hormono-dependente. Os momentos de piora mais relatados são exatamente as grandes transições hormonais.

**Dados da UK Big Survey (maior pesquisa sobre lipedema):**
- 46% das mulheres relatam início/piora na puberdade
- 19% durante gravidez
- 16% na menopausa/perimenopausa

**Por que hormônios pioram:**
O estrogênio tem papel direto na distribuição de gordura e na permeabilidade vascular. Em momentos de flutuação hormonal intensa, o tecido lipedematoso responde com aumento de volume, inflamação e dor.

**Sobre anticoncepcionais:**
- Anticoncepcionais com alto teor de estrogênio podem agravar lipedema
- Progesterona isolada tende a ser mais segura
- DIU hormonal (Mirena) é geralmente melhor tolerado
- Cada caso é individual — converse com ginecologista que entenda lipedema

**Sobre sua filha:**
É muito comum o lipedema se manifestar na puberdade. Sugiro:
1. Avaliação com angiologista experiente em lipedema
2. Considerar trocar para método sem estrogênio
3. Iniciar compressão precoce se confirmado
4. Orientação nutricional anti-inflamatória desde já

Sua filha tem sintomas de dor nas pernas ou hematomas frequentes?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Sim, ela reclama de dor nas coxas e vive roxa. Vou marcar angiologista pra ela. Obrigada pela explicação, fez muito sentido. Vou conversar com a ginecologista sobre trocar o anticoncepcional também.`,
        authorType: 'user',
        authorId: 'user_sim_017',
        authorName: 'Renata Moraes'
      },
      {
        content: `Troquei do anticoncepcional oral para o DIU Mirena e senti melhora em 2-3 meses. Menos inchaço, menos dor. Valeu muito a pena.`,
        authorType: 'user',
        authorId: 'user_sim_006',
        authorName: 'Patricia Oliveira'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // THREAD 7: Suplementação para lipedema
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Suplementos que ajudam no lipedema - quais têm evidência?',
    slug: 'suplementos-lipedema-evidencia',
    posts: [
      {
        content: `Vi uma lista enorme de suplementos "para lipedema" na internet. Selênio, diosmina, castanha da índia, ômega 3, vitamina D... Não dá pra tomar tudo. Quais realmente têm evidência e vale a pena investir?`,
        authorType: 'user',
        authorId: 'user_sim_007',
        authorName: 'Fernanda Alves'
      },
      {
        content: `Fernanda, excelente pergunta. Vou separar por nível de evidência para você priorizar:

**NÍVEL 1 — Forte evidência / alta prioridade:**

**Ômega 3 (EPA/DHA):**
- Anti-inflamatório potente
- Dose: 2-3g de EPA+DHA/dia
- Preferir: óleo de peixe concentrado ou óleo de krill
- Benefício: redução de dor, edema e inflamação sistêmica

**Vitamina D:**
- Deficiência é muito comum em lipedema (>70%)
- Dose: ajustar conforme exame (meta: 40-60 ng/mL)
- Típico: 2.000-5.000 UI/dia
- SEMPRE dosar antes de suplementar

**NÍVEL 2 — Boa evidência / prioridade média:**

**Diosmina + Hesperidina (ex: Daflon):**
- Venotônico que melhora microcirculação
- Dose: 500-1000mg/dia
- Benefício: reduz sensação de peso e dor

**Selênio:**
- Antioxidante que protege tecido linfático
- Dose: 100-200mcg/dia

**Cúrcuma (curcumina):**
- Potente anti-inflamatório natural
- Dose: 500-1000mg de curcumina/dia COM piperina
- Sem piperina, absorção é muito baixa (~3%)

**Priorização prática:**
1. Vitamina D (barato, essencial)
2. Ômega 3 de qualidade (investimento mais importante)
3. Diosmina (se tem dor/peso)
4. Cúrcuma com piperina

Você tem exames recentes de vitamina D?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Tomo ômega 3 + vitamina D + diosmina há 1 ano. A dor reduziu bastante e os hematomas diminuíram. Concordo que são os mais importantes. Não senti diferença com castanha da índia.`,
        authorType: 'user',
        authorId: 'user_sim_016',
        authorName: 'Daniela Correia'
      },
      {
        content: `Adicionei cúrcuma com piperina há 3 meses e senti melhora na dor. Minha vitamina D estava em 18 ng/mL (muito baixa) e subiu pra 45 após 6 meses de suplementação.`,
        authorType: 'user',
        authorId: 'user_sim_012',
        authorName: 'Roberta Mendes'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // THREAD 8: Lipedema e saúde mental
  // ═══════════════════════════════════════════════════════════
  {
    title: 'Como lidar emocionalmente com o diagnóstico de lipedema',
    slug: 'lipedema-saude-mental-emocional',
    posts: [
      {
        content: `Acabei de receber o diagnóstico de lipedema estágio 2. Por um lado foi um alívio saber que não é "falta de esforço". Por outro, bateu uma tristeza enorme de saber que é crônico. Como vocês lidam emocionalmente com isso?`,
        authorType: 'user',
        authorId: 'user_sim_001',
        authorName: 'Ana Paula'
      },
      {
        content: `Ana Paula, o que você está sentindo é absolutamente normal e muito comum. A maioria das mulheres com lipedema passa por essa dualidade emocional no diagnóstico.

**O alívio é legítimo:**
Muitas mulheres passaram anos ouvindo "é só emagrecer" ou "você não se esforça o suficiente". Finalmente ter um nome para o que acontece com o seu corpo é validador.

**A tristeza também é legítima:**
Saber que é uma condição crônica (sem cura definitiva) assusta. Mas crônico não significa "sem controle". Significa que precisa de manejo contínuo.

**O que ajuda emocionalmente:**

**1. Comunidade:**
Trocar experiências com outras mulheres que entendem. O isolamento é o maior inimigo emocional.

**2. Informação de qualidade:**
Entender a doença reduz ansiedade.

**3. Focar no que é controlável:**
- Nutrição adequada ✅
- Exercício adaptado ✅
- Compressão ✅
- Suplementação ✅
- Acompanhamento médico ✅

**4. Redefinir expectativas:**
O objetivo não é "curar" — é viver bem COM lipedema. Muitas mulheres controlam sintomas por décadas e vivem com qualidade.

**5. Suporte psicológico:**
Se a tristeza persistir, buscar um psicólogo não é fraqueza — é inteligência.

Você já tem uma rede de suporte que entende o diagnóstico?`,
        authorType: 'ai',
        authorName: 'IA - Protocolo Lipedema',
        isAiResponse: true
      },
      {
        content: `Passei exatamente por isso há 2 anos. O diagnóstico foi libertador e assustador ao mesmo time. O que mais me ajudou foi encontrar comunidades como essa e ver que não estou sozinha. Você vai ficar bem, Ana!`,
        authorType: 'user',
        authorId: 'user_sim_016',
        authorName: 'Daniela Correia'
      },
      {
        content: `Faço terapia há 1 ano e minha psicóloga me ajudou muito a aceitar e focar no que posso controlar. Se puder, invista nisso. Não é frescura.`,
        authorType: 'user',
        authorId: 'user_sim_006',
        authorName: 'Patricia Oliveira'
      },
      {
        content: `Obrigada meninas, vocês não imaginam como isso me ajuda. Vou continuar aqui acompanhando e compartilhando. Já me sinto menos sozinha.`,
        authorType: 'user',
        authorId: 'user_sim_001',
        authorName: 'Ana Paula'
      }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO DE EXECUÇÃO
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('🏟️  SEED ARENA 01: PROTOCOLO LIPEDEMA\n');
  console.log('═'.repeat(60));

  // 1. Encontrar ou criar a arena
  let arena = await prisma.arena.findFirst({
    where: {
      OR: [
        { slug: 'protocolo-lipedema' },
        { slug: { contains: 'lipedema' } },
        { name: { contains: 'Lipedema' } }
      ]
    }
  });

  if (!arena) {
    console.log('⚠️  Arena não encontrada. Criando...');

    arena = await prisma.arena.create({
      data: {
        slug: 'protocolo-lipedema',
        name: 'Protocolo Lipedema',
        description: 'Arena dedicada ao lipedema: diagnóstico, estágios, tratamentos conservadores, nutrição anti-inflamatória, exercícios seguros e troca de experiências.',
        icon: '🦵',
        color: 'from-purple-600 to-violet-600',
        category: 'saude',
        isActive: true,
        aiPersona: AIPersona.BALANCED,
        aiInterventionRate: 65,
        arenaType: ArenaType.GENERAL
      }
    });

    console.log(`✅ Arena criada: ${arena.id}`);
  } else {
    console.log(`✅ Arena encontrada: ${arena.id} - ${arena.name}`);
  }

  // 2. Verificar posts existentes
  const existingPosts = await prisma.post.count({
    where: {
      arenaId: arena.id
    }
  });

  console.log(`📊 Posts existentes: ${existingPosts}`);

  if (existingPosts > 0) {
    console.log('✅ Arena já tem conteúdo. Pulando seed.');
    return;
  }

  // 3. Criar posts
  let totalPostsCreated = 0;

  for (const threadData of THREADS) {
    console.log(`\n🧵 Criando: "${threadData.title}"`);

    for (const postData of threadData.posts) {
      await prisma.post.create({
        data: {
          content: postData.content,
          arenaId: arena.id,
          userId: postData.authorId || 'ai-protocol-lipedema',
          isAIResponse: postData.isAiResponse || false,
          isPublished: true,
          isApproved: true
        }
      });
      totalPostsCreated++;
    }

    console.log(`   ✅ ${threadData.posts.length} posts criados`);
  }

  // 4. Atualizar arena
  const finalPostCount = await prisma.post.count({
    where: {
      arenaId: arena.id
    }
  });

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED CONCLUÍDO!\n');
  console.log(`📊 Resultados Arena "Protocolo Lipedema":`);
  console.log(`   Posts: ${finalPostCount}`);
  console.log(`   Posts criados agora: ${totalPostsCreated}`);
  console.log('\n🏟️  Arena pronta para uso!\n');
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
