// ═══════════════════════════════════════════════════════════════
// SEED ARENA: EMAGRECIMENTO FEMININO 35+
// Executar: npx tsx scripts/seed-emagrecimento-35-mais.ts
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// ============================================================
// SEED: Emagrecimento Feminino 35+
// ~32 posts em 8 conversas
// Foco: mudanças hormonais, perimenopausa, metabolismo após 35,
// resistência insulínica, sarcopenia, sono, estresse, tireoide,
// estratégias práticas adaptadas à realidade da mulher 35+
// ============================================================

const POSTS = [
  // ── CONVERSA 1: "Depois dos 35 meu corpo mudou completamente" ──
  {
    userId: 'user_sim_006',
    content: `Gente, tenho 38 anos e sinto que meu corpo simplesmente PAROU de responder. Até os 32 eu cortava um pouco a comida e emagrecia. Agora faço dieta, treino 4x/semana e a balança não mexe. Acumulo gordura na barriga (nunca fui assim) e retenho líquido demais. Alguém mais sentindo isso?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Patricia, o que você descreve é **fisiologicamente real** e não é "frescura" nem falta de esforço. A partir dos 33-35 anos, o corpo feminino passa por mudanças hormonais progressivas que afetam diretamente a composição corporal.

**O que muda hormonalmente após os 35:**

**1. Declínio de progesterona (começa antes do estrogênio):**
- A progesterona começa a cair já na faixa dos 33-35 — é o primeiro hormônio a declinar
- Progesterona baixa = maior retenção hídrica, inchaço, sono mais leve, ansiedade
- Também favorece a **dominância estrogênica relativa**, que promove acúmulo de gordura no quadril e abdômen inferior

**2. Flutuações de estrogênio:**
- Na perimenopausa (que pode começar aos 35-40), o estrogênio não cai linearmente — ele **oscila** de forma irregular
- Picos de estrogênio = retenção, inchaço, sensibilidade mamária
- Quedas de estrogênio = ondas de calor, alteração de humor, redistribuição de gordura para região abdominal

**3. Resistência insulínica progressiva:**
- A sensibilidade à insulina diminui naturalmente com a idade
- O corpo passa a tolerar menos carboidratos refinados sem consequência metabólica
- Gordura abdominal que "nunca teve" é um sinal clássico de aumento da resistência insulínica

**4. Queda da taxa metabólica basal:**
- Perda de massa muscular (sarcopenia) começa a acelerar a partir dos 30
- Menos músculo = menor gasto calórico basal
- A queda é de ~2-4% por década, mas pode ser **atenuada significativamente** com musculação

**O que NÃO funciona mais como antes:**
- Déficit calórico agressivo sem treino de força → acelera a perda muscular
- Cardio em excesso como estratégia principal → aumenta cortisol, piora o cenário hormonal
- "Comer menos" indiscriminadamente → sem priorizar proteína, perde músculo e mantém gordura

A boa notícia: com as estratégias certas para essa fase, os resultados vêm. Só precisam ser **diferentes** das que funcionavam aos 25.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Tenho 41 anos e me identifiquei com TUDO. O acúmulo de gordura abdominal sem mudança de dieta foi o que mais me assustou. Quando fui na endocrinologista, a resistência insulínica apareceu nos exames. Nunca tive antes.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `Que alívio saber que tem explicação fisiológica. Eu tava me culpando achando que era falta de disciplina. Vou marcar endocrinologista e pedir esses exames. Quais estratégias vocês recomendam pra essa fase?`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Proteína e musculação como prioridade absoluta ──
  {
    userId: 'user_sim_001',
    content: `Tenho 36 anos e minha nutricionista aumentou minha proteína pra 130g/dia (peso 65kg). Achei muito! Antes comia uns 50-60g. Ela disse que depois dos 35 a proteína é "inegociável". Faz sentido esse aumento todo?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Ana Paula, sua nutricionista está corretíssima. Após os 35, a proteína deixa de ser "importante" e se torna **a prioridade nutricional número 1** para emagrecimento e composição corporal.

**Por que a proteína é crítica após os 35:**

**1. Resistência anabólica:**
- A partir dos 30-35 anos, o músculo se torna **menos responsivo** ao estímulo anabólico da proteína
- Onde uma mulher de 25 anos precisa de ~20g de proteína por refeição para maximizar a síntese proteica, após os 35 esse limiar sobe para **30-40g por refeição**
- Para a mesma resposta anabólica, você precisa de MAIS proteína — isso é fisiologia, não opinião

**2. Leucina como trigger:**
- O aminoácido leucina é o principal ativador do mTOR (via de síntese muscular)
- Após 35+, o limiar de leucina sobe: precisa de **3-4g de leucina por refeição** (vs ~2g em jovens)
- 30g de proteína animal de alta qualidade fornece ~3g de leucina

**3. Prevenção da sarcopenia:**
- Mulheres perdem ~3-8% de massa muscular por década após os 30
- Menos músculo = menor TMB = mais dificuldade pra emagrecer = ciclo vicioso
- Proteína adequada + musculação é a ÚNICA intervenção comprovada contra sarcopenia

**Recomendação prática para mulheres 35+:**
- **Mínimo:** 1,6g/kg/dia → para 65kg = 104g
- **Ideal em déficit:** 2,0-2,2g/kg/dia → para 65kg = **130-143g** (exatamente o que ela prescreveu)
- **Distribuição:** dividida em 3-4 refeições com **pelo menos 30g cada**
- Não adianta comer 10g no café, 15g no almoço e 80g no jantar — a distribuição importa

**Como atingir 130g sem suplemento:**
- Café: 3 ovos + 100g de queijo cottage = ~30g
- Almoço: 150g de frango/peixe = ~35g
- Lanche: 200g de iogurte grego + 30g de whey = ~35g
- Jantar: 150g de carne/peixe = ~35g
- Total: ~135g

Sua nutricionista acertou em cheio. Mantenha isso como prioridade absoluta.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `Quando aumentei minha proteína de 60g pra 120g (tenho 37 anos, 62kg), em 3 meses minha composição corporal mudou mais do que em 1 ano de "dieta low carb" com proteína baixa. Perdi 4kg de gordura e ganhei massa magra nos exames. Proteína é game changer nessa fase.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Vocês me convenceram! Tava resistente ao volume de proteína mas vou me organizar com essas sugestões de distribuição. 30g por refeição em 4 refeições parece bem factível.`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Cortisol, estresse e gordura abdominal ────
  {
    userId: 'user_sim_016',
    content: `Tenho 42 anos, dois filhos, trabalho integral, e tô sempre exausta. Faço dieta certinho mas a gordura abdominal não sai. Minha médica pediu cortisol e veio alto. Ela disse que o estresse crônico pode estar sabotando meu emagrecimento. Como assim estresse engorda?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Daniela, sua médica está absolutamente certa. O cortisol cronicamente elevado é um dos maiores sabotadores do emagrecimento feminino 35+, e o mecanismo é bem documentado.

**Como o cortisol crônico impede o emagrecimento:**

**1. Redistribuição de gordura para o abdômen:**
- O tecido adiposo visceral (abdominal) tem **4x mais receptores de cortisol** que o subcutâneo
- Cortisol alto sinaliza ao corpo para armazenar energia especificamente na região abdominal — é uma resposta de sobrevivência ancestral
- É por isso que mulheres estressadas acumulam gordura na barriga mesmo em déficit calórico

**2. Resistência insulínica induzida por cortisol:**
- Cortisol elevado aumenta a glicemia (gliconeogênese hepática)
- O pâncreas responde com mais insulina
- Insulina cronicamente alta bloqueia a lipólise (queima de gordura)
- Ciclo: estresse → cortisol → glicemia alta → insulina alta → gordura abdominal

**3. Retenção hídrica:**
- Cortisol alto aumenta aldosterona → retenção de sódio e água
- Pode mascarar perda de gordura por semanas na balança

**4. Sabotagem comportamental:**
- Cortisol alto aumenta fome hedônica (desejo por comfort food — doce, gorduroso)
- Reduz qualidade do sono → mais grelina → mais fome no dia seguinte
- Reduz motivação para treinar

**Estratégias PRÁTICAS para reduzir cortisol (ordem de impacto):**

**Prioridade 1 — Sono (maior impacto isolado):**
- 7-8h é o MÍNIMO, não luxo
- Uma noite mal dormida eleva cortisol em até 37% no dia seguinte
- Rotina de desaceleração: sem telas 1h antes, quarto escuro e fresco

**Prioridade 2 — Exercício calibrado:**
- Musculação moderada (3-4x/semana, 45-60min) → reduz cortisol crônico
- EVITAR: HIIT diário, cardio longo em jejum, treinos exaustivos 6x/semana
- Treino excessivo em mulher estressada = mais cortisol = piora o quadro

**Prioridade 3 — Nutrição anti-estresse:**
- NÃO fazer déficit agressivo (mais cortisol)
- Magnésio: 300-400mg/dia (glicinato ou treonato) — cofator de >300 enzimas, relaxante
- Não pular refeições — jejum prolongado em mulheres com cortisol alto é contraproducente
- Carboidratos complexos à noite ajudam na conversão de triptofano → serotonina → melatonina

**Prioridade 4 — Gestão de estresse ativo:**
- 10-15 min de caminhada ao ar livre pela manhã (regula ritmo circadiano)
- Respiração diafragmática 4-7-8 antes de dormir (ativa parassimpático)

Para mulheres 35+ com vida estressante, controlar o cortisol pode ser mais impactante do que cortar mais 200 calorias.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Me identifiquei 100%. Tenho 39 anos, mãe solo, trabalho das 8 às 18 e ainda fazia HIIT 5x/semana achando que ia "queimar mais". Resultado: cortisol nas alturas, insônia, gordura abdominal aumentando. Quando troquei pra musculação 3x + caminhada e priorizei dormir 7h, em 2 meses perdi 3cm de cintura sem mudar a dieta.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `Uau. Eu faço exatamente isso — HIIT 5x, durmo 5-6h e tô sempre no déficit agressivo. Basicamente o combo perfeito pra aumentar cortisol. Vou repensar tudo.`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Tireoide e emagrecimento ──────────────────
  {
    userId: 'user_sim_007',
    content: `Descobri hipotireoidismo subclínico aos 37 anos (TSH 6,2). Minha endócrino disse que isso pode explicar a dificuldade de emagrecer, cansaço e queda de cabelo. Alguém mais com tireoide alterada? Quanto impacta no emagrecimento?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Fernanda, hipotireoidismo é **muito mais comum em mulheres** (5-8x mais que em homens) e a incidência aumenta significativamente após os 35 anos. Boa decisão investigar.

**Impacto da tireoide no metabolismo:**

**O que a tireoide faz:**
- T3 e T4 regulam diretamente a taxa metabólica basal (TMB)
- Controlam a termogênese, a oxidação de gordura e a sensibilidade à insulina
- Influenciam humor, energia, qualidade do sono, função intestinal

**TSH 6,2 — o que significa na prática:**
- TSH normal: 0,4-4,0 mUI/L (referência laboratorial)
- TSH 4,5-10 com T4 livre normal = hipotireoidismo subclínico
- Seu TSH de 6,2 indica que a hipófise está "gritando" pra tireoide produzir mais hormônio
- Impacto estimado na TMB: redução de **5-15%** → pode significar 80-200kcal/dia a menos de gasto

**Como isso afeta o emagrecimento:**
- Redução direta da TMB (menos calorias gastas em repouso)
- Redução do NEAT (menos energia = menos movimento espontâneo)
- Maior resistência insulínica
- Retenção hídrica (por acúmulo de mucopolissacarídeos)
- Fadiga → menos intensidade no treino → menos gasto calórico
- Constipação → sensação de inchaço e peso

**O que você pode fazer:**

**1. Tratamento médico (discuta com sua endócrina):**
- Hipotireoidismo subclínico com TSH >6 + sintomas geralmente justifica tratamento com levotiroxina
- A decisão é da sua médica, mas com TSH 6,2 + sintomas (cansaço, queda de cabelo, dificuldade de emagrecer), muitos endocrinologistas optam por tratar

**2. Nutrição de suporte à tireoide:**
- **Selênio**: 200mcg/dia — essencial para conversão T4→T3 (2-3 castanhas-do-pará/dia)
- **Zinco**: 15-25mg/dia — cofator da desiodase
- **Iodo**: adequado mas sem excesso (sal iodado já supre)
- **Evitar excesso de crucíferas cruas** em grandes quantidades (brócolis, couve cru) — cozidos não há problema
- **Vitamina D**: frequentemente deficiente em hipotireoidismo — checar e suplementar se necessário

**3. Ajuste de expectativas:**
- Até a tireoide estabilizar com tratamento (4-8 semanas), a perda de peso pode ser mais lenta
- Não faça déficit agressivo com tireoide baixa — piora a conversão T4→T3
- Déficit moderado (250-350kcal) + musculação é o caminho mais seguro

**4. Exames importantes para pedir:**
- TSH, T4 livre, T3 livre, anti-TPO, anti-tireoglobulina, vitamina D, ferritina, B12

Com o tratamento adequado e a tireoide normalizada, a resposta ao déficit melhora significativamente.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Também descobri hipotireoidismo aos 39. Depois que comecei levotiroxina e estabilizei o TSH em 2,0 — a diferença foi enorme. Energia voltou, o emagrecimento destravou, até o humor melhorou. Se sua médica indicar, não tenha medo do tratamento.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `Muito obrigada pelo detalhamento! Vou conversar com minha endócrina sobre o tratamento e pedir os exames complementares. A dica das castanhas-do-pará pro selênio já vou aplicar hoje.`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Perimenopausa e estratégias específicas ───
  {
    userId: 'user_sim_020',
    content: `Tenho 44 anos e minha ginecologista disse que estou na perimenopausa. Ciclo irregular, ondas de calor à noite, engordei 6kg em 1 ano sem mudar nada na rotina. Existe alguma estratégia nutricional específica pra essa fase? Sinto que as "dietas normais" não servem mais.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Beatriz, a perimenopausa é uma fase de transição que dura em média **4-8 anos** antes da menopausa, e exige de fato abordagens nutricionais e de treino adaptadas.

**Por que as "dietas normais" param de funcionar:**

Na perimenopausa, o estrogênio flutua de forma irregular — pode estar altíssimo num mês e baixo no seguinte. Essa instabilidade causa:
- Maior resistência insulínica (especialmente nos dias de estrogênio baixo)
- Redistribuição de gordura de quadril/coxa → abdômen
- Perda acelerada de massa muscular
- Retenção hídrica imprevisível
- Alteração no metabolismo de carboidratos

**Estratégia nutricional adaptada para perimenopausa:**

**1. Proteína como base (já falamos, mas reforço):**
- 1,8-2,2g/kg/dia, mínimo 30g por refeição
- Inclua proteína NO CAFÉ DA MANHÃ — o cortisol matinal está naturalmente alto nessa fase, proteína ajuda a estabilizar glicemia

**2. Carboidratos estratégicos (não eliminados):**
- Sensibilidade à insulina flutua com o ciclo → carboidratos complexos são aliados, refinados são inimigos
- Priorize: batata-doce, arroz integral, aveia, leguminosas, frutas com casca
- Concentre **mais carboidratos no pós-treino e à noite**
- À noite: carboidrato complexo ajuda na produção de serotonina/melatonina — melhora o sono que já está comprometido pelas ondas de calor

**3. Gorduras de qualidade (essenciais nessa fase):**
- Ômega-3: efeito anti-inflamatório + pode atenuar sintomas vasomotores (ondas de calor)
- 2-3 porções de peixe gordo/semana ou suplementação de 2-3g EPA+DHA/dia
- Azeite extravirgem, abacate, oleaginosas — gorduras que melhoram sensibilidade insulínica

**4. Fitoestrogênios (suporte natural):**
- Isoflavonas de soja (tofu, edamame, missô): podem atenuar flutuações estrogênicas
- Linhaça moída: 2 colheres de sopa/dia — lignanas com ação estrogênica leve
- Não substituem tratamento médico, mas ajudam como complemento

**5. Anti-inflamatórios naturais:**
- Cúrcuma com pimenta preta (aumenta biodisponibilidade 2000%)
- Gengibre
- Chá verde (EGCG — antioxidante + leve efeito termogênico)

**Sobre os 6kg em 1 ano:**
- Parte é gordura real (pela mudança hormonal + provável resistência insulínica)
- Parte é retenção hídrica flutuante
- Parte pode ser perda de massa muscular (o músculo é mais denso que gordura — se perde músculo e ganha gordura, o peso pode até não mudar muito mas a composição piora)

**Exames essenciais nessa fase:**
- Perfil hormonal completo (FSH, LH, estradiol, progesterona)
- Insulina de jejum + HOMA-IR
- Perfil lipídico completo
- Vitamina D, B12, ferritina
- Densitometria óssea (baseline)

A perimenopausa NÃO é sentença de ganho de peso. É uma fase que exige **recalibração**, não resignação.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `Beatriz, tenho 38 e já estou na perimenopausa precoce. A dica de concentrar carboidratos à noite me ajudou MUITO com o sono. Estava acordando 3-4x por noite e agora durmo muito melhor. E quando o sono melhorou, o emagrecimento voltou a responder.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Obrigada pela abordagem tão completa! Vou pedir esses exames e já começar com a linhaça e o ômega-3. A parte de carboidratos à noite nunca teria pensado — sempre cortava carboidrato no jantar achando que era melhor.`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Exercício ideal depois dos 35 ─────────────
  {
    userId: 'user_sim_012',
    content: `Fiz aula de spinning e corrida por 10 anos pra manter o peso. Funcionava. Agora aos 40 não funciona mais — peso subindo, corpo flácido mesmo correndo 5x/semana. Minha amiga me disse pra trocar tudo por musculação. É tão impactante assim a diferença?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Roberta, é uma das mudanças mais impactantes que uma mulher 35+ pode fazer. A musculação não é "mais um exercício" — é a **intervenção número 1 contra o envelhecimento metabólico feminino**.

**Por que o cardio para de funcionar como antes:**

Cardio aeróbico (corrida, spinning) queima calorias DURANTE o exercício, mas:
- Não constrói massa muscular significativa (e pode até contribuir para catabolismo em excesso)
- Gera adaptação: seu corpo fica cada vez mais **eficiente** → gasta MENOS calorias para o mesmo esforço
- Excesso de cardio em mulheres 35+ com estresse alto → eleva cortisol → piora composição corporal
- Não combate a sarcopenia — o problema central do envelhecimento metabólico

**O que a musculação faz que o cardio não faz:**

**1. Constrói e preserva massa muscular:**
- Cada kg de músculo gasta ~13-15kcal/dia em repouso (vs ~4,5kcal/kg de gordura)
- Mas o efeito real é maior: músculo ativo aumenta NEAT, sensibilidade insulínica e EPOC
- É a ÚNICA forma comprovada de reverter a sarcopenia

**2. EPOC (Excess Post-Exercise Oxygen Consumption):**
- Musculação pesada eleva o metabolismo por **24-72h** pós-treino
- Cardio moderado eleva por ~2-4h
- Ao longo da semana, o gasto calórico total pode ser similar ou superior

**3. Melhora a sensibilidade insulínica:**
- Contração muscular contra resistência ativa o GLUT-4 (transportador de glicose independente de insulina)
- Efeito agudo dura até 48h pós-treino
- Essencial para mulheres 35+ com resistência insulínica crescente

**4. Saúde óssea:**
- Mulheres na perimenopausa perdem densidade óssea aceleradamente
- Impacto mecânico da musculação estimula osteoblastos
- Cardio de baixo impacto (bicicleta, spinning) NÃO gera esse estímulo

**Recomendação prática de transição:**
- **Prioridade 1:** Musculação 3-4x/semana (compostos pesados: agachamento, hip thrust, supino, remada, terra)
- **Prioridade 2:** Caminhada diária 30-45min (baixo estresse, alto volume de NEAT, zero impacto em cortisol)
- **Prioridade 3:** 1-2 sessões curtas de cardio mais intenso SE gostar e SE recuperação permitir

Não precisa abandonar a corrida completamente se você ama correr. Mas a hierarquia deve ser: **musculação primeiro, cardio como complemento** — não o contrário.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Fiz essa transição aos 36 e foi a melhor decisão. Corria 40km/semana e pesava 67kg. Troquei pra musculação 4x + caminhada. Em 1 ano: 63kg, muito menos "flacidez" e mais energia. Minha composição corporal mudou completamente.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Ok, convencida. Vou procurar um bom personal pra montar um programa de musculação e ir reduzindo a corrida pra 2x/semana. Obrigada pela explicação!`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Sono e emagrecimento 35+ ──────────────────
  {
    userId: 'user_sim_002',
    content: `Tenho 37 anos e durmo mal faz uns 2 anos. Demoro pra pegar no sono, acordo de madrugada e não volto a dormir. Percebi que quando durmo bem (tipo quando viajo de férias), desincho e até emagreço. Tem relação real ou é coincidência?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `Juliana, não é coincidência. O sono é provavelmente o fator **mais subestimado** no emagrecimento feminino 35+, e os dados são impressionantes.

**Impacto do sono ruim no emagrecimento (dados de estudos):**

**Estudo Nedeltcheva et al. (2010):**
- Dois grupos em déficit calórico idêntico
- Grupo com 8,5h de sono: **55% da perda de peso veio de gordura**
- Grupo com 5,5h de sono: **apenas 25% veio de gordura** — o resto foi massa magra
- Mesma dieta, mesmo déficit — a diferença foi SÓ o sono

**Efeitos hormonais de dormir <7h:**
- Grelina (fome) aumenta **~28%**
- Leptina (saciedade) cai **~18%**
- Cortisol matinal sobe **~37%**
- Sensibilidade insulínica cai **~25-30%** em apenas 4 dias de sono curto
- GH (hormônio do crescimento) — secretado principalmente no sono profundo — cai drasticamente

**Por que mulheres 35+ são especialmente vulneráveis:**
- Queda de progesterona = menos efeito ansiolítico/sedativo natural (progesterona age no receptor GABA)
- Oscilações de estrogênio = ondas de calor noturnas, suor, despertar
- Cortisol elevado pela rotina = dificuldade de "desligar" à noite
- É um ciclo: sono ruim → mais cortisol → mais gordura abdominal → mais inflamação → sono pior

**Protocolo prático de higiene do sono para mulheres 35+:**

**Ambiental:**
- Quarto a 18-20°C (ondas de calor pioram com calor ambiente)
- Escuridão total (bloqueia qualquer luz — melatonina é suprimida por luz mínima)
- Ruído branco ou silêncio total

**Nutricional (últimas 3h antes de dormir):**
- Jantar com carboidrato complexo + proteína (triptofano → serotonina → melatonina)
- Magnésio glicinato 200-400mg ~1h antes de dormir
- Chá de camomila ou passiflora
- Evitar cafeína após 14h (meia-vida da cafeína: 5-6h, mas em mulheres pode ser maior)

**Comportamental:**
- Exposição à luz solar pela manhã (15-20min) — calibra o relógio circadiano
- Sem telas 60min antes de dormir (ou use óculos blue-blocker)
- Horário fixo de dormir e acordar — mesmo nos fins de semana
- Se acordar de madrugada: NÃO olhe o celular (luz suprime melatonina imediatamente)

**Quando buscar ajuda médica:**
- Se essas medidas não resolverem em 3-4 semanas
- Se suspeita de apneia (ronco, cansaço excessivo diurno, acordar com boca seca)
- Discutir com ginecologista: em perimenopausa, reposição de progesterona pode melhorar dramaticamente o sono`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `Aquele estudo de 55% vs 25% de perda de gordura me deixou em choque quando li pela primeira vez. Basicamente, dormir mal transforma dieta em perda de músculo. Priorizei sono e foi o maior upgrade do meu emagrecimento aos 38 anos.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `Vou implementar o protocolo todo. A dica do magnésio antes de dormir e do carboidrato no jantar vou testar já hoje. E vou parar de olhar o celular quando acordo de madrugada — faço isso TODA vez. 😅`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Expectativas realistas e paciência ────────
  {
    userId: 'user_sim_019',
    content: `Tenho 43 anos, comecei a fazer tudo "certo" há 3 meses — musculação 4x, proteína 2g/kg, dormir 7h, déficit moderado de 350kcal. Resultado: perdi só 2,5kg. Tô frustrado porque no meu marido (mesma rotina) já foram 7kg. Isso é normal ou tô fazendo algo errado?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_facilitator',
    content: `João Carlos, preciso te dizer algo importante: **2,5kg em 3 meses fazendo tudo certo como mulher 43+ pode ser um resultado excelente**, e a comparação com seu marido é biologicamente injusta.

**Por que homens e mulheres emagrecem diferente:**

**Diferenças fisiológicas reais:**
- Homens têm **~15-20% mais massa muscular** → TMB naturalmente maior
- Testosterona masculina é **10-20x maior** → preserva músculo em déficit e queima gordura mais eficientemente
- Mulheres retêm mais líquido (ciclo menstrual, flutuações hormonais) → a balança mente mais
- Estrogênio feminino favorece armazenamento de gordura como **reserva energética** — é uma vantagem evolutiva que dificulta emagrecimento

**A matemática real do seu resultado:**
- 2,5kg em 3 meses = ~0,83kg/mês = ~0,19kg/semana
- Com déficit de 350kcal → déficit semanal teórico de 2.450kcal = ~0,32kg/semana de gordura
- Mas se você está treinando musculação pesada com proteína alta, provavelmente está **ganhando massa muscular ao mesmo tempo**
- Cenário provável: perdeu ~4kg de gordura e ganhou ~1,5kg de músculo = -2,5kg na balança mas **melhora significativa de composição corporal**

**Indicadores melhores que a balança:**
- Medidas de cintura, quadril, braço, coxa
- Fotos comparativas (mesmo ângulo, mesma luz, mesma hora)
- Como a roupa está vestindo
- Bioimpedância (se tiver acesso)
- Força no treino (se está subindo = está ganhando/mantendo músculo)
- Energia, humor, sono

**Projeção realista para mulheres 35+:**
- Mês 1-3: ajustes hormonais, retenção hídrica variável, perda aparente menor
- Mês 3-6: corpo "entende" o novo padrão, perda se torna mais consistente
- Mês 6-12: resultados acumulados impressionantes
- **Expectativa saudável: 0,5-1kg de perda líquida por mês** (pode parecer pouco, mas são 6-12kg/ano)

**Sobre a comparação com o marido:**
- Parem de comparar números absolutos — vocês são biologicamente diferentes
- Se quiser comparar: **% do peso corporal perdido** é mais justo
- Melhor ainda: não compare. Cada corpo é um experimento individual.

Você está fazendo TUDO certo. O resultado está vindo. Mantenha a consistência e avalie o progresso em 6 meses, não em 3.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `A explicação sobre perder gordura e ganhar músculo ao mesmo tempo é crucial. Eu "perdi" só 1kg em 4 meses mas perdi 8cm de cintura e 2 números de calça. Se eu tivesse olhado só a balança, teria desistido. Meçam-se, tirem fotos, esqueçam o número.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_019',
    content: `Caramba, nunca tinha pensado na recomposição corporal dessa forma. Minha cintura diminuiu 3cm nesses 3 meses e tô levantando mais peso. Vou parar de focar na balança e dar mais tempo pro processo. Obrigado pela dose de realidade! 💪`,
    isAIResponse: false,
  },
];

// ============================================================
async function main() {
  console.log('🏟️  SEED: EMAGRECIMENTO FEMININO 35+\n');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'emagrecimento', mode: 'insensitive' } },
          { slug: { contains: 'feminino', mode: 'insensitive' } },
          { slug: { contains: '35', mode: 'insensitive' } },
          { name: { contains: 'Emagrecimento', mode: 'insensitive' } },
          { name: { contains: '35', mode: 'insensitive' } },
        ],
      },
    });

    if (!arena) {
      console.log('❌ Arena não encontrada. Arenas disponíveis:');
      const allArenas = await prisma.arena.findMany({
        select: { id: true, slug: true, name: true },
        orderBy: { slug: 'asc' },
      });
      allArenas.forEach(a => console.log(`  ${a.slug} | ${a.name}`));
      return;
    }

    console.log(`✅ Arena: ${arena.name} | ID: ${arena.id}`);

    // Limpar posts antigos
    const deleted = await prisma.post.deleteMany({
      where: { arenaId: arena.id },
    });
    console.log(`🗑️  ${deleted.count} posts antigos removidos`);

    // Inserir novos posts
    let created = 0;
    const baseTime = new Date('2026-02-04T08:00:00Z');

    for (let i = 0; i < POSTS.length; i++) {
      const post = POSTS[i];
      const postTime = new Date(baseTime.getTime() + (i * 18 * 60 * 1000));

      try {
        await prisma.post.create({
          data: {
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
        created++;
      } catch (err: any) {
        console.error(`❌ Post ${i}: ${err.message}`);
      }
    }

    // Atualizar contagem
    const count = await prisma.post.count({
      where: { arenaId: arena.id, isDeleted: false },
    });

    await prisma.arena.update({
      where: { id: arena.id },
      data: { totalPosts: count },
    });

    console.log(`\n✅ ${created} posts criados`);
    console.log(`📊 Total na arena: ${count}`);
    console.log('\n🏟️  Arena pronta! ✅\n');
  } catch (error) {
    console.error('Erro fatal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
