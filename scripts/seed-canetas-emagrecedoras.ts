import { PrismaClient } from '../lib/generated/prisma';
import { v4 as cuid } from 'cuid';

const prisma = new PrismaClient();

// ============================================================
// SEED: Canetas Emagrecedoras
// 32 posts em 8 conversas
// Foco: semaglutida (Ozempic/Wegovy), tirzepatida (Mounjaro),
// liraglutida (Saxenda), mecanismo de ação, efeitos colaterais,
// perda muscular, reganho, custo, quando indicar, expectativas
// ============================================================

const POSTS = [
  // ── CONVERSA 1: Semaglutida — como funciona de verdade ────
  {
    userId: 'user_sim_006',
    content: `Minha endócrino receitou Ozempic 0,25mg pra começar. IMC 34, resistência insulínica, já tentei de tudo. Mas tenho medo — vejo muita gente falando que é "milagre" e muita gente falando que é "veneno". Alguém usando pode me contar a real?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Patricia, ótimo que veio por prescrição médica com indicação clínica clara (IMC 34 + resistência insulínica). Vamos separar fatos de hype.

**O que é semaglutida e como funciona:**

Semaglutida (Ozempic/Wegovy) é um **agonista do receptor GLP-1** — imita um hormônio que seu corpo já produz naturalmente após as refeições.

**Mecanismos de ação (múltiplos):**

**1. No pâncreas:**
- Estimula secreção de insulina de forma **glicose-dependente** (só quando a glicemia está alta)
- Suprime glucagon (reduz produção hepática de glicose)
- Melhora diretamente a resistência insulínica — no seu caso, isso é especialmente relevante

**2. No estômago:**
- Retarda o esvaziamento gástrico em **~30-40%**
- Comida permanece mais tempo no estômago → saciedade prolongada
- É por isso que muitos usuários relatam "não sentir fome" ou sentir "empachamento"

**3. No cérebro (hipotálamo):**
- Atua diretamente nos centros de saciedade e recompensa
- Reduz fome hedônica (desejo por alimentos hiperpalatáveis)
- Reduz o "food noise" — aquele pensamento constante em comida que muitas pessoas com obesidade experimentam
- Este é provavelmente o efeito mais impactante relatado pelos usuários

**Resultados dos estudos clínicos (STEP trials):**

**Semaglutida 2,4mg (Wegovy) — estudo STEP 1:**
- Perda média: **~15% do peso corporal** em 68 semanas
- ~1/3 dos participantes perdeu >20%
- Placebo perdeu ~2,4%

**O que NÃO te contam no hype:**
- A perda NÃO é só de gordura — **~25-40% pode ser massa magra** se não houver treino de força e proteína adequada
- Os efeitos colaterais gastrointestinais são reais e podem ser significativos
- Se parar sem mudança de hábitos, o reganho é a regra, não exceção
- Não é "milagre" — é uma ferramenta farmacológica potente que funciona melhor COM mudanças de estilo de vida

**Protocolo de titulação (padrão):**
- Mês 1-2: 0,25mg/semana (adaptação)
- Mês 2-3: 0,5mg
- Mês 3-4: 1,0mg
- Mês 4+: 1,7mg → 2,4mg (dose terapêutica para obesidade)
- A titulação lenta minimiza efeitos colaterais — NÃO pule etapas

Com IMC 34 e resistência insulínica, sua indicação é legítima e a semaglutida pode ser uma ferramenta valiosa — desde que combinada com treino de força, proteína alta e acompanhamento médico contínuo.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Uso Ozempic há 8 meses, cheguei na dose de 1mg. Perdi 14kg. A redução do "food noise" é o efeito mais impressionante — eu pensava em comida o dia inteiro e agora simplesmente não penso mais. Mas confirmo: sem musculação e proteína alta, minha médica disse que eu perderia muito músculo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `A explicação do mecanismo me deixou mais segura. Vou começar os 0,25mg essa semana e manter meu treino de força + proteína alta. Obrigada pela resposta completa!`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Efeitos colaterais — o que esperar ────────
  {
    userId: 'user_sim_002',
    content: `Comecei Ozempic há 2 semanas (0,25mg) e tô com náusea CONSTANTE, estômago pesado e um gosto metálico horrível na boca. Nos dias de aplicação fico quase sem conseguir comer. Isso é normal? Vai melhorar? Tô quase desistindo.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, esses efeitos colaterais são **os mais comuns** reportados nos estudos clínicos e na grande maioria dos casos melhoram significativamente com o tempo.

**Efeitos colaterais gastrointestinais — frequência nos estudos:**
- Náusea: **~44%** dos pacientes (o mais comum)
- Diarreia: ~30%
- Vômito: ~24%
- Constipação: ~24%
- Dispepsia/empachamento: ~20%
- Disgeusia (gosto alterado): ~10-15%

**Linha do tempo típica:**
- **Semanas 1-4:** pico dos efeitos colaterais (especialmente náusea)
- **Semanas 4-8:** melhora progressiva na maioria dos pacientes
- **Semanas 8-12:** a maioria se adapta significativamente
- A cada aumento de dose, os sintomas podem retornar temporariamente (por isso a titulação gradual)

**Estratégias práticas para minimizar:**

**Para náusea:**
- Coma porções PEQUENAS e frequentes (5-6x/dia em vez de 3 grandes)
- Evite alimentos gordurosos e frituras (gordura + esvaziamento gástrico lento = náusea garantida)
- Gengibre: chá de gengibre ou gengibre cristalizado — antiemético natural com evidência
- Coma devagar — mastigar bem facilita a digestão com trânsito lento
- Evite deitar logo após comer (mínimo 30-45 min sentada/em pé)

**Para empachamento:**
- Reduza volume das refeições (seu estômago está esvaziando mais devagar — o que cabia antes não cabe mais)
- Priorize proteína primeiro, depois vegetais, carboidrato por último
- Evite beber líquido DURANTE a refeição (beba 30 min antes ou 1h depois)

**Para gosto metálico:**
- Pastilha de menta sem açúcar
- Bochechos com água + limão
- Geralmente melhora sozinho em 3-4 semanas

**Para constipação (se aparecer):**
- Hidratação: mínimo 2L/dia (GLP-1 pode reduzir sede — programe alarmes)
- Fibra: psyllium (1 colher de sopa/dia) + vegetais
- Atividade física regular ajuda motilidade

**Sinais de alerta (procure seu médico imediatamente):**
- Dor abdominal intensa e persistente (risco raro de pancreatite)
- Vômitos incontroláveis que impedem hidratação
- Icterícia (pele/olhos amarelados)
- Reação alérgica (inchaço, dificuldade de respirar)

**NÃO desista prematuramente.** A adaptação em 0,25mg (dose mais baixa) geralmente é a fase mais desconfortável porque o corpo ainda não conhece a molécula. Se após 4-6 semanas em 0,25mg os efeitos permanecerem severos, converse com sua médica sobre ajustar a titulação (ficar mais tempo em cada dose antes de subir).`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `Juliana, passei pelo MESMO nas primeiras 3 semanas. Quase desisti. Na quarta semana melhorou uns 60%, na sexta semana a náusea virou leve e esporádica. Hoje, 5 meses depois, basicamente zero náusea. As dicas de comer porções menores e evitar gordura fazem diferença real.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `Ok, vou aguentar mais umas semanas então. A dica do gengibre vou testar hoje. E percebi que tô tentando comer as mesmas porções de antes — provavelmente preciso reduzir o volume por refeição. Obrigada pela tabela de frequência, ajuda saber que é "normal".`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Perda de massa muscular com caneta ────────
  {
    userId: 'user_sim_004',
    content: `Li que até 40% do peso perdido com Ozempic pode ser músculo, não gordura. Isso é verdade? Porque se for, parece uma troca péssima — perder peso mas ficar fraco e flácido. Como evitar isso?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Carlos, essa preocupação é legítima e fundamentada. A perda de massa magra com agonistas GLP-1 é real e é **o principal risco** do uso sem acompanhamento adequado.

**Os números dos estudos:**

**STEP 1 (semaglutida 2,4mg):**
- Perda total média: ~15kg
- Composição: ~60-65% gordura, **~35-40% massa magra**
- Para comparação: em déficit calórico com treino de força e proteína alta, a proporção ideal é ~80-85% gordura e 15-20% massa magra

**Por que GLP-1 agonistas causam mais perda muscular:**
- A supressão de apetite é TÃO intensa que muitos pacientes comem **muito pouca proteína** sem perceber
- A náusea dificulta consumo de proteína (alimento com maior poder de saciedade + digestão mais lenta)
- Muitos pacientes reduzem atividade física pela fadiga/náusea
- O déficit calórico resultante é frequentemente muito agressivo (800-1200kcal/dia em alguns casos)

**O termo "Ozempic face/body":**
- Perda rápida de peso com alta proporção de músculo = aparência flácida, face encovada
- Não é efeito da droga em si — é efeito da **perda muscular excessiva por déficit mal gerenciado**

**Protocolo para PRESERVAR músculo durante uso de GLP-1:**

**1. Proteína — a variável mais crítica:**
- Mínimo **absoluto**: 1,6g/kg de peso corporal/dia
- Ideal: **2,0-2,4g/kg/dia**
- Distribuída em 4-5 refeições menores (já que porções grandes são mal toleradas)
- Se não conseguir atingir com comida → suplementar com whey/caseína
- **Priorize proteína sobre tudo** — se a náusea só permite comer pouco, que o pouco seja proteína

**2. Musculação — inegociável:**
- Treino de força 3-4x/semana com ênfase em exercícios compostos
- Progressão de carga sempre que possível
- O estímulo mecânico é o sinal mais potente contra o catabolismo muscular
- Sem musculação, nenhuma quantidade de proteína compensa

**3. Velocidade de perda controlada:**
- Não deixe o déficit ficar excessivo (muitos pacientes comem <1.000kcal sem perceber)
- Monitore: se está perdendo >1% do peso corporal por semana consistentemente, está perdendo músculo em excesso
- Converse com o médico sobre velocidade de titulação

**4. Monitoramento:**
- Bioimpedância ou DEXA a cada 8-12 semanas
- Se massa magra caindo >25% da perda total → aumentar proteína e/ou ajustar dose
- Força no treino é indicador prático: se cargas estão despencando, está perdendo músculo

**Estudo STEP-UP (semaglutida + exercício):**
- Grupo com exercício estruturado preservou significativamente mais massa magra
- A combinação fármaco + treino é superior ao fármaco isolado em TODOS os desfechos

A caneta é a ferramenta. Musculação e proteína são o que determinam a QUALIDADE do peso que você perde.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: `Minha esposa começou Ozempic sem treinar e com proteína baixa. Perdeu 12kg mas ficou visivelmente mais flácida e fraca. Quando adicionou musculação 3x + proteína 2g/kg, a composição corporal mudou completamente nos 4 meses seguintes — mesmo sem perder muito peso a mais na balança. A ordem ideal seria ter começado o treino JUNTO com a caneta.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_004',
    content: `Entendi. Então a caneta sem musculação e proteína alta é basicamente trocar gordura por flacidez. Vou garantir os 2g/kg de proteína e manter meu treino de força antes de considerar usar.`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Reganho de peso ao parar ──────────────────
  {
    userId: 'user_sim_012',
    content: `Usei Wegovy por 1 ano, perdi 18kg. Meu plano parou de cobrir e tive que parar. Em 6 meses recuperei 12kg. Tô arrasada. É verdade que todo mundo reganha? Existe forma de parar sem recuperar tudo?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Roberta, infelizmente seu caso é consistente com o que os estudos mostram. O reganho após descontinuação é **a grande limitação** dos agonistas GLP-1 e precisa ser discutido abertamente.

**O que os estudos mostram sobre reganho:**

**STEP 1 Extension (acompanhamento 1 ano após parada):**
- Participantes recuperaram **~2/3 do peso perdido** em 1 ano após descontinuação
- Os benefícios metabólicos (HbA1c, circunferência abdominal, lipídios) também reverteram parcialmente
- Apenas uma minoria manteve >10% de perda

**Por que o reganho acontece:**

**1. A obesidade é uma doença crônica:**
- Os set points hormonais (leptina, grelina, insulina) que mantinham a obesidade **não são "resetados"** permanentemente pela caneta
- Quando o GLP-1 exógeno sai, os sinais de fome voltam ao estado pré-tratamento
- O "food noise" retorna — muitos pacientes relatam que é como "ligar um interruptor"

**2. Perda de massa magra durante o tratamento:**
- Se perdeu músculo significativo → TMB está menor do que antes do tratamento
- Agora precisa de MENOS calorias pra manter o peso → margem de erro menor

**3. Hábitos podem não ter se consolidado:**
- Se a supressão de apetite fez todo o trabalho, os novos hábitos podem não ter sido internalizados
- Quando o apetite volta, os padrões antigos retornam junto

**Estratégias para minimizar reganho (se for parar):**

**Antes de parar:**
- **Reduza a dose gradualmente** (titulação reversa) em vez de parar abruptamente — dê tempo ao corpo para se readaptar
- Exemplo: 2,4mg → 1,7mg (4 semanas) → 1,0mg (4 semanas) → 0,5mg (4 semanas) → parar
- Consolide hábitos ENQUANTO ainda tem o apoio farmacológico

**Durante e após a descontinuação:**
- Proteína alta (2g/kg) — mantém saciedade e preserva músculo
- Musculação 3-4x/semana — cada kg de músculo preservado ajuda a manter o gasto calórico
- Monitoramento semanal de peso (média semanal, não diária)
- Se o peso subir >3-4kg, aja rapidamente (ajuste calórico, consulte o médico)
- Defina com o médico um "limite de reganho" para considerar retomar a medicação

**A conversa difícil que precisa acontecer:**
- Muitos especialistas já consideram GLP-1 agonistas como **tratamento crônico** para obesidade, assim como anti-hipertensivos para hipertensão
- A pergunta real é: o custo-benefício de uso contínuo justifica no seu caso?
- Discuta com seu médico: doses menores de manutenção, alternativas genéricas (quando disponíveis), programas de assistência farmacêutica

Roberta, o reganho não é culpa sua — é a biologia da obesidade. Não se julgue por isso.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `A ideia de tratar como doença crônica muda a perspectiva completamente. Ninguém para remédio de pressão e se culpa quando a pressão sobe. Com obesidade deveria ser igual — se há indicação, o tratamento pode precisar ser contínuo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `A titulação reversa NINGUÉM me orientou a fazer — meu plano cortou e eu parei de uma vez. Vou conversar com minha endócrino sobre dose de manutenção mais baixa ou retomar parcialmente. Obrigada pela perspectiva sem julgamento.`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Tirzepatida (Mounjaro) vs Semaglutida ────
  {
    userId: 'user_sim_014',
    content: `Meu médico mencionou tirzepatida (Mounjaro) como opção além do Ozempic. Disse que pode ser mais potente. Alguém sabe a diferença? Vale trocar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rodrigo, a tirzepatida é a molécula mais recente e os resultados clínicos são realmente impressionantes. Vamos comparar com dados.

**Diferença fundamental no mecanismo:**

**Semaglutida (Ozempic/Wegovy):**
- Agonista de **GLP-1** (único receptor)
- Age no pâncreas, estômago e cérebro via GLP-1

**Tirzepatida (Mounjaro/Zepbound):**
- Agonista **duplo: GLP-1 + GIP** (dois receptores)
- O GIP (peptídeo insulinotrópico dependente de glicose) adiciona efeitos na sensibilidade insulínica, metabolismo lipídico e potencialmente na termogênese
- A ação dupla parece produzir resultados superiores

**Comparação de resultados (estudos head-to-head):**

**Estudo SURMOUNT (tirzepatida) vs STEP (semaglutida):**
- Semaglutida 2,4mg: perda ~15-17%
- Tirzepatida 15mg: perda ~20-22%
- Participantes com >20%: Semaglutida ~32% vs Tirzepatida ~57%

**Efeitos colaterais:**
- Ambas causam náusea, diarreia, constipação
- Tirzepatida pode ter perfil GI ligeiramente melhor em alguns estudos

**Diferenças práticas no Brasil:**
- Semaglutida: Ozempic (diabetes), Wegovy (obesidade)
- Tirzepatida: Mounjaro
- Custo: Tirzepatida geralmente R$ 200-400 mais cara/mês

**Quando considerar trocar:**
- Resposta insuficiente à semaglutida (>6 meses sem atingir meta)
- Efeitos colaterais intoleráveis

Rodrigo, a tirzepatida é superior em eficácia, mas o custo é maior. Decida com seu médico baseado em resposta atual e disponibilidade.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_018',
    content: `Mudei de Ozempic pra Mounjaro há 4 meses porque tinha estagnado. A diferença foi notável — perdi mais 7kg e minha resistência insulínica melhorou significativamente nos exames. Mas o custo é pesado.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_014',
    content: `Boa comparação. Tô respondendo bem ao Ozempic 1mg, então faz mais sentido continuar e subir a dose do que trocar agora. Vou guardar a tirzepatida como opção se estagnar.`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Caneta sem prescrição e manipulados ───────
  {
    userId: 'user_sim_011',
    content: `Uma amiga comprou semaglutida manipulada numa farmácia sem receita. Saiu R$ 200 (vs R$ 1.000+ do Ozempic). Ela perdeu 8kg em 2 meses e tá super feliz. Tô tentada... é seguro?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Lucas, preciso ser direto: **usar semaglutida manipulada sem prescrição médica envolve riscos sérios** que a maioria das pessoas subestima.

**Os problemas com manipulados não prescritos:**

**1. Qualidade e dosagem incerta:**
- Farmácias de manipulação variam enormemente em controle de qualidade
- A semaglutida é um **peptídeo complexo** — manipulação de peptídeos é tecnicamente muito mais difícil que manipular comprimidos simples
- Estudos já encontraram variações de **±30-50% na dose real** em manipulados de peptídeos
- Dose menor = ineficaz. Dose maior = efeitos colaterais graves, inclusive pancreatite

**2. Sem acompanhamento médico:**
- Não tem avaliação prévia de contraindicações (histórico de pancreatite, carcinoma medular de tireoide, neoplasia endócrina múltipla tipo 2)
- Não tem monitoramento de função pancreática, tireoidiana, renal
- Não tem ajuste de dose baseado em resposta clínica
- Não tem avaliação de interações medicamentosas

**3. Sem titulação adequada:**
- Muitas pessoas compram uma única concentração e começam com dose alta
- Sem titulação gradual, o risco de efeitos adversos graves sobe significativamente

**4. Risco legal e regulatório:**
- Semaglutida é medicamento de prescrição obrigatória
- Farmácia que vende sem receita está em irregularidade com a ANVISA
- Se houver evento adverso grave, você não tem respaldo

**Riscos reais que já foram documentados:**
- Pancreatite aguda (inflamação do pâncreas — potencialmente fatal)
- Gastroparesia severa (paralisia gástrica prolongada)
- Desidratação grave por vômitos
- Hipoglicemia em não-diabéticos (especialmente com doses incorretas)
- Lesão renal aguda (por desidratação secundária aos vômitos/diarreia)
- Perda muscular severa (sem orientação nutricional adequada)

**A economia de R$ 800 pode custar uma internação de R$ 20.000+.**

**O que fazer se tem interesse legítimo:**
- Consulte um **endocrinologista** — se houver indicação clínica (IMC ≥30, ou IMC ≥27 com comorbidades), ele prescreve
- Alguns planos de saúde cobrem parcialmente
- Programas de desconto do fabricante existem
- Se o custo é proibitivo, discuta com o médico alternativas (liraglutida/Saxenda pode ser mais acessível, ou mesmo abordagens não farmacológicas)

Entendo que o custo é uma barreira real. Mas automedicação com peptídeos injetáveis não é a solução.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `Conheço uma pessoa que usou manipulado e teve pancreatite. Ficou 5 dias internada. A "economia" saiu MUITO mais cara. Não vale o risco. Se for usar, que seja prescrito e de marca com controle de qualidade.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `Ok, ponto recebido. Vou marcar endócrino e fazer pelo caminho certo. Melhor gastar mais com segurança do que economizar com risco.`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Caneta pra quem precisa perder "pouco" ────
  {
    userId: 'user_sim_003',
    content: `Tenho IMC 26, quero perder 5-6kg por estética. Minha dermato (!) me ofereceu Ozempic. Faz sentido usar caneta pra quem não tem obesidade? Ou é exagero?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Mariana, essa é uma das questões mais importantes no debate atual sobre canetas emagrecedoras, e a resposta curta é: **na grande maioria dos casos, usar GLP-1 agonista para perder 5-6kg de sobrepeso leve é desproporcional.**

**Indicações aprovadas pela ANVISA/FDA para semaglutida (Wegovy):**
- IMC ≥30 (obesidade), ou
- IMC ≥27 com pelo menos 1 comorbidade (diabetes tipo 2, hipertensão, dislipidemia, apneia do sono)
- Seu IMC de 26 sem comorbidades **não se enquadra na indicação aprovada**

**Por que não faz sentido para o seu caso:**

**1. Relação risco-benefício desfavorável:**
- Qualquer medicamento tem efeitos colaterais potenciais
- Para obesidade com comorbidades, os riscos se justificam pelo benefício metabólico
- Para 5-6kg estéticos, os riscos (náusea crônica, possível gastroparesia, perda muscular, custo de R$ 1.000+/mês) não se justificam

**2. Perda muscular desproporcional:**
- Quando há POUCA gordura a perder, a proporção de massa magra perdida AUMENTA
- Para quem tem IMC 26, perder 5kg com GLP-1 pode significar 2-3kg de músculo — resultado estético oposto ao desejado

**3. Reganho garantido ao parar:**
- Para 5-6kg, você usaria a medicação por quanto tempo? 3-4 meses?
- Ao parar, o peso volta — e aí?
- Uso crônico para 5-6kg de sobrepeso leve é medicalização desnecessária

**4. A dermato não é a especialista adequada:**
- Prescrição off-label por profissional não especialista é uma preocupação crescente
- Se houver indicação real, quem deve avaliar é **endocrinologista ou nutrólogo**

**O que FUNCIONA para 5-6kg de sobrepeso leve:**
- Déficit moderado (250-350kcal/dia) por 12-16 semanas
- Proteína adequada (1,8-2g/kg)
- Musculação 3-4x/semana (recomposição corporal pode ser mais eficaz que perda de peso pura)
- Esses 5-6kg podem ser perdidos em 3-4 meses com mudanças de hábito simples
- E o resultado é **sustentável** — sem custo mensal, sem efeitos colaterais, sem reganho

**Quando faz sentido um IMC 26-27 considerar caneta:**
- Se há resistência insulínica documentada
- Se há comorbidades metabólicas
- Se TODAS as tentativas de mudança de estilo de vida falharam com acompanhamento adequado
- Se há componente de compulsão alimentar diagnosticada

Não caia na banalização da caneta como atalho estético. Para o seu perfil, as ferramentas tradicionais bem aplicadas são mais seguras, mais baratas e mais sustentáveis.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: `Quando minha amiga de IMC 24 começou Ozempic "pra secar", perdeu 7kg em 3 meses. Mas junto foi embora volume do rosto, peito e glúteo. Parou e recuperou tudo — só que sem o músculo que tinha antes. Caneta pra quem não precisa é furada.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `Faz total sentido. 5kg com déficit moderado e treino em 3-4 meses vs meses de Ozempic a R$ 1.000+ com efeitos colaterais e reganho. A conta não fecha mesmo. Vou procurar um nutri e personal em vez do Ozempic.`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Liraglutida (Saxenda) — alternativa ───────
  {
    userId: 'user_sim_019',
    content: `Meu endócrino sugeriu Saxenda ao invés de Ozempic porque é mais "testada" e tem mais tempo de mercado. Mas vejo pouca gente falando dela. É inferior ao Ozempic? Qual a diferença prática?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `João Carlos, a liraglutida (Saxenda) foi o **primeiro agonista GLP-1 aprovado para obesidade** e tem um perfil bem conhecido. Vamos comparar objetivamente.

**Liraglutida (Saxenda) vs Semaglutida (Wegovy/Ozempic):**

| Aspecto | Liraglutida (Saxenda) | Semaglutida (Wegovy) |
|---|---|---|
| Frequência | **Diária** (1x/dia) | **Semanal** (1x/semana) |
| Dose terapêutica | 3,0mg/dia | 2,4mg/semana |
| Perda de peso média | **~8%** do peso | **~15%** do peso |
| Tempo de mercado | Desde 2014 (~11 anos) | Desde 2021 (~4 anos) |
| Perfil de segurança | Muito bem estabelecido | Bem estabelecido, menos tempo |
| Custo mensal (BR) | R$ 600-1.200 | R$ 900-1.500 |
| Efeitos GI | Similares | Similares (possível mais intensos) |

**Vantagens da Liraglutida (Saxenda):**
- **Mais tempo de mercado** → perfil de segurança de longo prazo mais robusto — seu endócrino tem razão nesse ponto
- **Aplicação diária permite ajuste fino** — se tiver efeito colateral, o efeito da dose dura ~12-14h, não 7 dias
- Se reagir mal a uma dose semanal de semaglutida, tem que esperar uma semana pra passar
- Pode ser mais adequada para pacientes com perfil de risco que justifique cautela adicional
- Mais dados de segurança em subpopulações específicas

**Vantagens da Semaglutida (Wegovy/Ozempic):**
- **Perda de peso quase 2x maior** nos estudos
- **Aplicação semanal** — muito mais conveniente (1 injeção vs 7)
- Estudos cardiovasculares robustos (SELECT trial) mostrando redução de eventos cardiovasculares em 20%

**Para quem a Saxenda pode ser a melhor escolha:**
- Primeiro uso de GLP-1 agonista (começar pelo mais testado é uma abordagem conservadora válida)
- Pacientes que querem ajuste fino diário
- Resposta suficiente com ~8% de perda (se o objetivo não exige 15%+)
- Pacientes mais cautelosos com medicações mais recentes
- Custo levemente menor em alguns casos

**Para quem semaglutida é melhor:**
- Necessidade de perda >10% do peso corporal
- Preferência por aplicação semanal
- Perfil cardiometabólico de alto risco (benefício cardiovascular comprovado)

**Pragmaticamente:**
Saxenda não é "inferior" — é uma molécula com perfil diferente. Se seu endócrino avaliou que Saxenda é adequada para seu caso, confie na avaliação dele. Muitos médicos experientes preferem começar com Saxenda justamente pela segurança de longo prazo e pelo controle diário mais fino. Se a resposta for insuficiente em 4-6 meses, a transição para semaglutida é sempre uma opção.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Comecei com Saxenda e funcionou muito bem pra mim — perdi 9kg em 6 meses. A injeção diária incomoda um pouco, mas me dá mais controle. Nos dias que sei que vou comer mais (evento social), aplico e ajuda. Cada caso é um caso.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_019',
    content: `Excelente comparação. Meu endócrino é bem conservador e faz sentido ele preferir a mais testada. Vou começar com Saxenda e avaliar a resposta antes de considerar trocar. Valeu pela tabela comparativa!`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🏟️  SEED: CANETAS EMAGRECEDORAS');
  console.log('');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'caneta', mode: 'insensitive' } },
          { name: { contains: 'caneta', mode: 'insensitive' } },
          { slug: { contains: 'emagrecedor', mode: 'insensitive' } },
          { name: { contains: 'emagrecedor', mode: 'insensitive' } },
          { slug: { contains: 'Ozempic', mode: 'insensitive' } },
          { name: { contains: 'Ozempic', mode: 'insensitive' } },
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
    const baseTime = new Date('2025-01-27T08:00:00Z');

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
