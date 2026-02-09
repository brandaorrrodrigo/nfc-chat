require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: DÉFICIT CALÓRICO NA VIDA REAL
// 48 posts | 10 conversas (4-6 posts cada)
// Foco: o que acontece FORA da planilha — platô, NEAT,
// metabolismo adaptativo, social, álcool, obsessão,
// refeed, efeito sanfona, ciclo menstrual, vida real
// ============================================================

const POSTS = [

  // ============================================================
  // CONVERSA 1: Déficit de 500kcal mas peso não cai — o que está errado?
  // ============================================================
  {
    userId: 'user_sim_002', // Juliana Santos
    content: `Estou em déficit de 500kcal há 6 semanas (nutricionista calculou meu TDEE em 1.900kcal e como 1.400kcal). Peso na balança: ZERO mudança. Meço tudo na balança de cozinha, uso MyFitnessPal, não trapaceio. Minha nutri disse "confia no processo" mas 6 semanas sem resultado é muito pra "confiar". O que pode estar errado? Desanimando.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, 6 semanas sem mudança no peso com déficit aparente de 500kcal tem explicação — e na maioria dos casos NÃO é "metabolismo lento". Vou investigar as causas mais comuns em ordem de probabilidade.

Causa 1 — Você está comendo mais do que pensa (a mais comum, ~70% dos casos):
O problema da subestimação calórica: Lichtman et al. (1992, NEJM) mostrou que participantes em "déficit" que não perdiam peso subestimavam sua ingestão em 47% e superestimavam gasto calórico em 51%. Isso não é mentira — é erro de medição, viés cognitivo e calorias invisíveis.

Fontes de erro mesmo pesando tudo: óleo de cozinha (1 colher = 120kcal), molhos e condimentos, petiscos inconscientes, fim de semana comendo "normal", erro no banco de dados do MyFitnessPal com dados inseridos por usuários.

O que fazer: registre ABSOLUTAMENTE TUDO por 7 dias — cada gole, cada colher. Fotografe tudo. Compare com a semana "normal". A maioria das pessoas encontra 200-500kcal "invisíveis" nesse exercício.

Causa 2 — Seu TDEE está superestimado:
O cálculo de TDEE por fórmula tem margem de erro de ±15-20%. Se seu TDEE REAL é 1.700 (não 1.900), seu déficit é de 300kcal, não 500. Com 300kcal: ~300g de gordura/semana = ~1.2kg/mês — fácil de mascarar por retenção hídrica.

Causa 3 — Retenção hídrica mascarando perda de gordura:
Muito mais comum do que as pessoas imaginam. Cortisol elevado, fase lútea do ciclo menstrual, aumento de volume de treino → retenção de 1-3kg de água.

Teste revelador: meça circunferência da cintura. Se a cintura REDUZIU mesmo com peso estável → você está perdendo gordura e retendo água. A balança mente; a fita não.

Causa 4 — Recomposição corporal:
Se começou a treinar recentemente E está em déficit moderado: pode estar perdendo gordura E ganhando músculo simultaneamente. Na balança: empate. No espelho e nas roupas: mudança visível.

Causa 5 — Metabolismo adaptativo (termogênese adaptativa):
Existe, mas NÃO é tão grande quanto se pensa. Em déficit moderado: redução de 5-15% no TDEE (Rosenbaum et al., 2008). ~100-200kcal a menos de gasto que o previsto. NÃO é suficiente para zerar um déficit de 500kcal.

Plano de ação prático (próximas 2 semanas):
1. Registre ABSOLUTAMENTE TUDO que entra na boca
2. Meça circunferência da cintura 1x/semana
3. Tire foto frontal e lateral
4. Pese diariamente e calcule MÉDIA SEMANAL
5. Se a média não cair E cintura não reduzir → reduza 100-150kcal/dia ou aumente NEAT

Juliana, "confiar no processo" é válido nas primeiras 2-3 semanas. Com 6 semanas sem resultado, é hora de INVESTIGAR.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009', // Bruno Ferreira
    content: `A fita métrica mudou minha perspectiva. 4 semanas com peso ESTÁVEL mas cintura caiu 2cm. Eu estava perdendo gordura e retendo água por causa do cortisol (trabalho estressante + dormindo 5h). Quando ajustei o sono pra 7h, na semana seguinte o peso DESPENCOU 1.5kg — a água saiu. A balança é a pior métrica para acompanhar déficit calórico. Use fita + fotos + tendência de peso semanal.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006', // Patricia Oliveira
    content: `O ponto do óleo é BRUTAL. Eu achava que cozinhava "saudável" com azeite. Quando pesei o azeite que eu usava por dia: 4 colheres de sopa. 480kcal SÓ DE AZEITE. Quase 1/3 da minha meta calórica. Troquei pra spray de óleo (PAM) e reduzi pra 1 colher medida. Achei minhas calorias "invisíveis". O déficit começou a funcionar na MESMA semana.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003', // Mariana Costa
    content: `Sobre o fim de semana destruindo o déficit: fiz as contas. Semana: 5 dias × 500kcal déficit = -2.500kcal. Sábado jantar fora + drinks = +1.200kcal superávit. Domingo brunch + cinema com pipoca = +800kcal superávit. Déficit semanal REAL: 2.500 - 2.000 = 500kcal. Ou seja, 500kcal de déficit por SEMANA em vez de 3.500. Resultado: 200g de perda por semana em vez de 500g. 3 meses pra perder 2.5kg. Parece "não funcionar" mas na verdade funciona — só MUITO devagar.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010', // Thiago Martins
    content: `Erro que cometi: MyFitnessPal dizia que "peito de frango" tinha 110kcal/100g. O dado era de peito SEM PELE e GRELHADO. Eu comia peito COM PELE e com 1 colher de óleo na frigideira. Diferença real: ~180kcal/100g. Em 200g por dia = 140kcal "fantasma" que eu não contava. CRUZE dados com o rótulo do produto ou tabela TACO.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 2: NEAT — o segredo que caiu sem você perceber
  // ============================================================
  {
    userId: 'user_sim_005', // Rafael Lima
    content: `Comecei a usar relógio com contador de passos e descobri algo assustador: antes da dieta eu dava 9.000 passos/dia. Depois de 4 semanas de déficit, caiu pra 5.500 passos SEM EU PERCEBER. Eu sentava mais, mexia menos, ficava mais parado. O NEAT caiu uns 300-400kcal e eu nem notava. Alguém mais passou por isso?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rafael, você descobriu um dos fenômenos mais importantes e SUBESTIMADOS do déficit calórico: a redução inconsciente do NEAT (Non-Exercise Activity Thermogenesis).

NEAT = toda energia gasta em atividades que NÃO são exercício formal: andar, ficar de pé, gesticular, se mexer na cadeira, subir escada, cozinhar, limpar a casa.

Composição do gasto energético diário:
- TMB (taxa metabólica basal): 60-70%
- TEF (efeito térmico dos alimentos): 8-10%
- EAT (exercício formal): 5-10%
- NEAT: 15-30% ← é a variável MAIS controlável e MAIS variável

O NEAT pode variar 2.000kcal entre pessoas (Levine et al., 1999, Science). Uma pessoa inquieta gasta até 2.000kcal/dia a mais que uma sedentária do mesmo peso.

O que acontece com o NEAT em déficit calórico:
Termogênese adaptativa comportamental (Rosenbaum et al., 2003): o corpo reduz NEAT INCONSCIENTEMENTE para conservar energia. Você para de gesticular, senta em vez de ficar de pé, escolhe elevador. Redução típica: 200-500kcal/dia em déficits prolongados. Isso SOZINHO pode eliminar seu déficit planejado.

Como combater a queda de NEAT:
1. Meta de passos diários: 8.000-10.000 passos/dia independente. Se abaixo no final da tarde → caminhada de 15-20 min
2. Estratégias de NEAT forçado: standing desk, reuniões caminhando, estacionar longe, escadas SEMPRE
3. Awareness: monitore passos DIARIAMENTE. Se queda > 15% → ativamente compensar

Rafael, você descobriu que seu corpo compensou 400kcal de déficit com 400kcal a menos de NEAT. Força os passos de volta pra 9.000+ e o déficit vai funcionar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011', // Lucas Souza
    content: `NEAT é a peça que faltava. 3 déficits na vida, 3 vezes estagnou. Nas 3 vezes eu diminuía passos sem perceber. Agora tenho meta FIXA de 10.000 passos/dia — é regra como escovar dente. Resultado: esse déficit está funcionando consistentemente pela primeira vez. A caminhada de 20 min depois do jantar faz MAIS diferença que trocar a quantidade de arroz.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008', // Camila Ribeiro
    content: `A dica de ficar de pé durante ligações parece boba mas soma MUITO. Trabalho home office e faço ~2h de calls por dia. Antes ficava sentada. Agora fico de pé andando pelo apartamento. Meu relógio registrou +2.500 passos/dia só com isso. São ~100kcal extras/dia que eu nem percebo. Em 1 mês são 3.000kcal. Quase 1kg de gordura de NEAT sem esforço.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 3: Metabolismo adaptativo — é real ou desculpa?
  // ============================================================
  {
    userId: 'user_sim_010', // Thiago Martins
    content: `Vi um influencer falando que "metabolismo lento é mito" e que "se você não emagrece é porque come demais". Outro diz que metabolismo adaptativo é REAL e que o corpo "entra em modo econômico". Quem tem razão? Eu faço déficit CERTINHO e depois de 12 semanas a perda desacelerou muito.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Thiago, os dois estão parcialmente certos — a verdade é mais nuançada. Vou separar o que é ciência do que é narrativa.

"Metabolismo lento" como desculpa: a variação NATURAL de TMB entre pessoas do mesmo peso/idade/sexo é de ±10-15% (Müller et al., 2004). Entre duas mulheres de 70kg, a diferença pode ser 150-250kcal/dia. Relevante mas NÃO explica diferenças de 1.000kcal que as pessoas alegam. A maioria "não emagrece em déficit" porque está subestimando ingestão ou superestimando gasto.

Metabolismo adaptativo — o que a ciência diz (é REAL, mas menor do que se pensa):

Componentes da adaptação metabólica em déficit:
1. Redução da TMB (termogênese adaptativa verdadeira): Rosenbaum et al. (2008): após perda de 10%, a TMB cai ~15% além do esperado. Redução REAL de ~150-250kcal/dia além do explicado pela massa perdida.
2. Queda de NEAT (já discutimos): 200-500kcal/dia de redução inconsciente. É o MAIOR componente.
3. Redução do efeito térmico dos alimentos (TEF): Relativamente pequeno: 50-100kcal/dia.
4. Eficiência mecânica aumentada: Corpo fica 5-10% mais eficiente no exercício.

Somando tudo: -430 a -930kcal/dia de adaptação possível. ISSO É SIGNIFICATIVO.

Como lidar na prática (sua situação — 12 semanas):
1. Aceite que alguma adaptação ocorreu — recalcule seu TDEE
2. Diet break: 1-2 semanas comendo na MANUTENÇÃO. Byrne et al. (2018, MATADOR study): dieta intermitente (2 semanas déficit / 2 semanas manutenção) preservou TMB melhor
3. Refeed day: 1-2 dias por semana com calorias em manutenção
4. Aumente NEAT conscientemente — forma mais eficaz de compensar
5. Musculação é INEGOCIÁVEL — preserva massa magra → preserva TMB

Thiago, recalcule, faça um diet break, e o déficit volta a funcionar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005', // Rafael Lima
    content: `O diet break do MATADOR study funcionou pra mim na prática. 6 semanas de déficit → 1 semana manutenção → 6 semanas de déficit. Na semana de manutenção ganhei 0.5kg (água/glicogênio) que perdi em 3 dias quando voltei ao déficit. E a velocidade de perda VOLTOU ao ritmo das primeiras semanas. É como reiniciar o sistema.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016', // Daniela Correia
    content: `O estudo do Biggest Loser me deu medo de fazer déficit. Mas a explicação foi bem clara: aquilo era déficit brutal + exercício extremo + sem musculação preservando massa. Um déficit de 300-500kcal com musculação e proteína alta NÃO é o Biggest Loser. Contexto importa muito.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 4: Contagem de calorias obsessiva — quando é problema
  // ============================================================
  {
    userId: 'user_sim_007', // Fernanda Alves
    content: `Estou ficando OBSESSIVA com contagem de calorias. Peso cada folha de alface. Recuso convites pra jantar porque não sei os macros. Acordo pensando no que vou comer. Choro quando passo 50kcal do planejado. Meu namorado diz que estou com problema. Eu acho que é "disciplina". Onde está a linha entre disciplina e transtorno?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, vou ser direta: o que você descreve já cruzou a linha. Pesar folha de alface, chorar por 50kcal, recusar vida social NÃO é disciplina — são sinais de alerta para uma relação disfuncional com comida.

A linha entre disciplina e problema:
Disciplina saudável: planejar refeições, registrar calorias como informação (sem julgamento emocional), fazer escolhas conscientes, aceitar dias que fogem do plano sem culpa significativa.

Sinais de alerta (você tem vários):
- Ansiedade intensa quando não sabe os macros exatos
- Evitar situações sociais por causa da comida
- Resposta emocional desproporcional a variações mínimas
- Pensamento obsessivo sobre comida
- Rigidez extrema que compromete qualidade de vida

O que pode estar acontecendo:
Ortorexia: obsessão por alimentação "correta" que se torna patológica. Comportamento restritivo pré-TCA: pode escalar para transtorno alimentar.

Por que isso é contraproducente:
Cortisol cronicamente elevado pela ansiedade → retenção hídrica → "peso não cai" → mais ansiedade → ciclo vicioso. Isolamento social → piora saúde mental.

O que fazer:
1. Parar de contar calorias por 2-4 semanas — sim, parece aterrorizante. Coma porções razoáveis, sem registro numérico.
2. Procurar ajuda profissional — psicólogo especializado em comportamento alimentar (não nutricionista adicional)
3. Se não quer parar: conte apenas CALORIAS TOTAIS (não macros), use ranges em vez de números fixos

Fernanda, seu namorado está certo. Quando as pessoas ao seu redor percebem antes de você, é porque o comportamento é visível.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001', // Ana Paula
    content: `Fernanda, EU FUI VOCÊ. Pesava cada grama, chorava por "errar", recusava aniversário de amigos. Minha psicóloga me diagnosticou com comportamento restritivo. 6 meses de TCC e hoje conto calorias de forma FLEXÍVEL — com ranges, sem pesar folha de alface. E adivinhe? EMAGRECI MAIS quando parei de ser rígida. Porque o cortisol baixou.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020', // Beatriz Gomes
    content: `A inversão "sua vida serve à dieta" vs "a dieta serve à vida" é a frase que todo mundo precisa ouvir. Quando eu trocava planos com amigos pra "não sair da dieta", era a dieta controlando minha vida. Agora: se tem aniversário, vou, como, e no dia seguinte volto ao normal. Resultado no fim do mês? IGUAL. Porque 1 refeição livre não estraga 29 dias.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 5: Refeed e dia livre — ciência ou desculpa?
  // ============================================================
  {
    userId: 'user_sim_009', // Bruno Ferreira
    content: `Meu coach prescreve 1 refeed de carboidrato por semana no déficit. Ele diz que "restaura leptina" e "mantém metabolismo". Funciona mesmo ou é desculpa pra comer mais? Sinto que perco o progresso da semana.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Bruno, refeed tem base científica sim, mas a magnitude do efeito é menor do que muitos coaches vendem. Vou separar o que é ciência do que é exagero.

O que é refeed (definição precisa):
1-2 dias por semana com calorias elevadas para MANUTENÇÃO ou leve superávit. O aumento é primariamente em CARBOIDRATOS (não gordura). Proteína mantida alta, gordura mantida baixa-moderada. NÃO é "dia do lixo".

Sobre leptina e refeed:
A leptina CAI em déficit calórico proporcionalmente à restrição de carboidratos. Um dia alto em carbo ELEVA leptina transitoriamente — Dirlewanger et al. (2000): overfeeding de carbo por 1 dia aumentou leptina em ~28%. MAS: o efeito é TRANSITÓRIO (24-48h) e pode não ser suficiente para "resetar" completamente a adaptação metabólica de semanas.

Benefícios REAIS do refeed semanal:
1. Reposição de glicogênio muscular: déficit crônico → glicogênio baixo → treino fica péssimo. 1 dia alto em carbo → glicogênio repõe → treino do dia seguinte é MUITO melhor
2. Aderência psicológica: saber que tem 1 dia de mais comida → tolerância ao déficit aumenta
3. Hormonal: T3 e leptina sobem transitoriamente. Efeito real mas PEQUENO
4. NEAT pode subir: mais energia → mais movimento

Você NÃO perde o progresso da semana (matemática):
Déficit 500kcal × 6 dias = -3.000kcal. Refeed = 0 déficit no dia. Déficit semanal: -3.000kcal. Sem refeed: -3.500kcal. Diferença: 70g de gordura por semana. SETENTA GRAMAS. Vale a pena em troca de melhor treino e aderência.

Como fazer refeed corretamente:
Calorias: manutenção ou até +10%. Carboidratos: aumentar 50-100%. Gordura: REDUZIR para compensar. Proteína: manter igual. Timing: dia de treino pesado. Fontes: arroz, batata, batata-doce, macarrão.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003', // Mariana Costa
    content: `Refeed no dia de treino de perna = MELHOR TREINO DA SEMANA. Meu agachamento rende 10-15% mais no dia seguinte ao refeed. É glicogênio cheio. E mentalmente: saber que sexta-feira é "dia de mais carbo" me faz aguentar a segunda a quinta sem reclamar. É a cenoura na frente do burro.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011', // Lucas Souza
    content: `Erro que cometi: confundir refeed com "dia do lixo". Meu refeed era pizza + cerveja + sobremesa = 3.500kcal acima. Isso não é refeed, é binge. Quando corrigi pra 300-400g de carboidrato LIMPO (arroz, batata, aveia), o efeito foi MUITO melhor: mais energia, melhor treino, sem culpa.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 6: Efeito sanfona — como quebrar o ciclo
  // ============================================================
  {
    userId: 'user_sim_001', // Ana Paula
    content: `Perdi 15kg 3 vezes na vida. Recuperei tudo nas 3. Dessa vez quero fazer diferente. Alguém que quebrou o efeito sanfona pode me dizer o que fez? O que mudar pra não voltar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ana Paula, efeito sanfona tem causas previsíveis — e a maioria é no PÓS-dieta. Vou mapear o que a ciência mostra.

Por que o peso volta (os mecanismos):
1. Ausência de fase de manutenção: a maioria faz déficit → meta → volta a comer "normal". O "normal" é o padrão anterior → volta ao peso. Sumithran et al. (2011): hormônios da fome permanecem alterados por 12 meses após perda de peso.
2. Perda de massa magra durante o déficit: sem musculação = músculo perdido → TMB menor → TDEE menor → quando volta a comer normal → está em superávit → engorda mais rápido
3. Dieta extrema → compulsão pós-dieta: deficits agressivos → upregulation de hormônios da fome → fome extrema pós-dieta

O protocolo anti-sanfona (o que fazer DESTA vez):
Durante o déficit: déficit MODERADO (300-500kcal), musculação 3-4x, proteína alta (1.6-2.2g/kg), refeeds semanais, diet breaks a cada 6-8 semanas, velocidade 0.5-1% do peso corporal por semana.

TRANSIÇÃO (fase crítica que 95% das pessoas pulam):
Reverse dieting: aumente calorias em 100-150kcal/semana até manutenção. Processo de 4-8 semanas para subir do déficit à manutenção. O corpo se adapta gradualmente.

MANUTENÇÃO (onde o jogo é ganho ou perdido):
Fique em manutenção por MÍNIMO 3-6 meses. Continue treinando. Monitore peso. Identifique "peso de alarme": se subir X kg → volte a prestar atenção. Construa HÁBITOS sustentáveis.

A pergunta-chave para cada hábito do déficit: "Consigo fazer isso por 5 anos?"
Cortar todo carboidrato → NÃO. Treinar 3x/semana → SIM. Pesar alimentos em casa → TALVEZ.

Ana Paula, o erro das 3 vezes foi: déficit agressivo + sem musculação + sem fase de transição + volta abrupta. Desta vez: déficit moderado + musculação + proteína alta + reverse diet + 6 meses de manutenção. Demora mais, mas é permanente.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012', // Roberta Mendes
    content: `O reverse dieting mudou minha vida. Déficit anterior: 1.200kcal → meta → voltei a 2.200kcal no dia seguinte → ganhei 5kg em 3 semanas. Dessa vez: 1.400kcal → subi 100kcal/semana durante 8 semanas → 2.200kcal sem ganhar gordura. Ganhei 1.5kg (glicogênio/água) e estabilizou. 8 meses depois: peso estável. PRIMEIRA VEZ.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017', // Renata Moraes
    content: `A pergunta "consigo fazer isso por 5 anos?" é filtro perfeito. Nas dietas anteriores eu cortava tudo, 2h de cardio, ÓBVIO que não sustentei. Dessa vez: como arroz todo dia, saio pra jantar 1x/semana, treino musculação 45min 4x/semana. Perdi mais devagar (10 meses pra 12kg) mas estou mantendo há 1 ano.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 7: Álcool e déficit — a verdade nua
  // ============================================================
  {
    userId: 'user_sim_005', // Rafael Lima
    content: `Bebo cerveja no fim de semana — umas 4-6 latas. Faz déficit certinho segunda a sexta e no sábado bebo. O álcool está destruindo meu déficit? Li que álcool "para a queima de gordura".`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rafael, álcool é o elefante na sala que muita gente em déficit ignora. Não vou moralizar — vou te dar os números.

O que o álcool faz no metabolismo de gordura:
Sim, o álcool PAUSA a oxidação de gordura (Siler et al., 1999). Quando você bebe, o corpo prioriza metabolizar o etanol (tóxico). A oxidação de gordura cai até ~75%. O corpo essencialmente diz: "preciso me livrar desse veneno primeiro".

MAS isso não significa que álcool = engordar automaticamente:
Se as calorias TOTAIS (incluindo álcool) ainda estão em déficit → você perde gordura. O álcool tem 7kcal/g. O problema NÃO é o mecanismo — é que álcool traz calorias EXTRAS difíceis de compensar.

Suas 4-6 latas de cerveja — as contas:
1 lata (350ml, 5%): ~150kcal. 4 latas: 600kcal. 6 latas: 900kcal.

Cenário semanal:
Segunda a sexta: 500kcal × 5 = -2.500kcal. Sábado: 6 cervejas + petiscos = +1.500kcal total. Domingo: ressaca → NEAT despenca = ±0.

Déficit REAL: 2.500 - 1.500 = 1.000kcal/semana (versus 3.500 planejado).

Estratégias se quiser beber E emagrecer:
1. Reduza quantidade: 4-6 latas → 2-3 latas
2. Escolha melhor: cerveja (150kcal) vs vodka com água com gás (65kcal)
3. Corte gordura no dia que beber: compensar as calorias
4. Controle os petiscos: a maioria das calorias extras vem da COMIDA
5. Não sacrifique o dia seguinte: ressaca ≠ desculpa pra pizza

Rafael, 2 cervejas + refeição proteica antes + sem petiscos = déficit preservado.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010', // Thiago Martins
    content: `Troquei 5 cervejas por 2 gin tônica (com tônica zero): 130kcal vs 750kcal. Economizei 620kcal. 4 sábados = 2.480kcal/mês. Quase 350g de gordura. E como ANTES de sair agora — peito de frango. Chego no bar sem fome e bebo menos.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008', // Camila Ribeiro
    content: `Mulheres: cuidado EXTRA com drinks "femininos". Uma caipirinha de frutas num bar tem 350-500kcal FÁCIL. 3 caipirinhas = 1.000-1.500kcal = TRÊS DIAS de déficit. Vou de vodka com água com gás (65kcal) ou vinho seco (120kcal). A escolha da bebida importa MAIS.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 8: Déficit e ciclo menstrual — o peso enlouquece
  // ============================================================
  {
    userId: 'user_sim_016', // Daniela Correia
    content: `Toda vez que minha menstruação se aproxima, o peso SOBE 1-2kg mesmo em déficit perfeito. Já chorei achando que estava engordando. Dura uns 5-7 dias e depois "some". Isso é normal? Como lidar sem surtar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Daniela, isso é 100% FISIOLÓGICO e NÃO é gordura. A flutuação hormonal do ciclo menstrual afeta o peso na balança de forma significativa.

O que acontece em cada fase:
Fase folicular (dia 1-14): estrogênio subindo. Retenção hídrica: BAIXA. Peso: mais estável, tendência de queda. Melhor fase pra avaliar se o déficit funciona.

Ovulação (dia ~14): pico de estrogênio. Algumas mulheres retêm 0.5-1kg de água por 1-2 dias.

Fase lútea (dia 15-28): progesterona sobe → RETENÇÃO de sódio e água. Peso pode subir 1-3kg SÓ de água. Aumenta apetite e desejo por carbo/doce.

Menstruação (dia 1-5): progesterona DESPENCA → rim libera sódio e água. Peso cai abruptamente. É quando o progresso REAL aparece.

Como lidar na prática (sem surtar):
1. Compare peso com o MESMO PERÍODO do ciclo anterior — não compare dia 25 deste mês com dia 10 do mês passado
2. Use média semanal, não peso diário — pese todo dia, calcule média
3. Espere a menstruação pra avaliar — o peso no dia 3-5 é o mais "honesto"
4. Na fase lútea tardia (TPM): aumente 100-200kcal do déficit, ACEITE o ganho de peso → NÃO é gordura

Daniela, não chore pelo peso da fase lútea. É ÁGUA. Espere o dia 3-5 da menstruação, pese-se, e compare com o mesmo dia do mês anterior. Esse é o dado real.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007', // Fernanda Alves
    content: `ESSA explicação deveria ser dada pra toda mulher que começa dieta. Eu quase desisti 3 vezes porque "engordei" na TPM. Era ÁGUA toda vez. Quando aprendi a comparar menstruação com menstruação, vi que estava perdendo 600-800g por CICLO. Mas entre os ciclos, a balança era uma montanha-russa.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 9: Comer fora, social e viagem — como manter o déficit
  // ============================================================
  {
    userId: 'user_sim_012', // Roberta Mendes
    content: `Como manter déficit quando janto fora 2-3x por semana? Trabalho com clientes e eventos são parte do trabalho. Já tentei "chutar" as calorias do restaurante mas estou sempre errada. Alguma estratégia prática pra quem não pode controlar 100%?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Roberta, essa é a pergunta da VIDA REAL. O déficit que só funciona com marmita é insustentável. Estratégias práticas:

Princípio central: não tente controlar o RESTAURANTE — controle o RESTANTE do dia.

Estratégia 1 — Buffer calórico:
Se janta fora à noite (estimativa: 800-1.200kcal), coma MENOS durante o dia. Café leve: 200kcal. Almoço leve: 400kcal. Total até o jantar: 600kcal → sobra 800-900kcal.

Estratégia 2 — Hierarquia do prato no restaurante:
1. PROTEÍNA primeiro: peça peixe, frango, carne magra
2. VEGETAIS: salada ou legumes
3. CARBO moderado: coma metade se vier acompanhamento
4. MOLHOS e EXTRAS: onde estão as calorias. Peça à parte.
5. BEBIDA: água ou 1 taça de vinho
6. SOBREMESA: divida com alguém ou pule

Estratégia 3 — Estimativa rápida de restaurante:
Salada com frango grelhado: 400-600kcal. Filé de peixe + legumes: 500-700kcal. Massa cremosa: 800-1.200kcal. Hambúrguer + batata: 1.200-1.600kcal. Estime 800kcal como base.

Estratégia 4 — A regra 80/20:
Se janta fora 3x/semana = 3 de 21 refeições = 14%. As outras 18 (86%) são controladas. Se essas 18 estão em déficit → 3 refeições fora não destroem o progresso.

Roberta, comer fora 3x/semana NÃO impede déficit. Impede se CADA jantar fora for 2.000kcal sem compensação. Com buffer calórico + escolhas inteligentes, o déficit semanal se mantém.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_002', // Juliana Santos
    content: `O buffer calórico é exatamente o que faço. Dias que janto fora: café com ovos (200kcal) + almoço salada (400kcal) + jantar livre (800kcal) = 1.400kcal. Dias em casa: 3 refeições normais. Média semanal bate o déficit. Perdi 8kg em 5 meses comendo fora 2-3x/semana. Sustentável.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020', // Beatriz Gomes
    content: `A tabela de estimativa por restaurante é OURO. Imprimi e colei na geladeira. Não precisa ser exata — precisa estar no BALLPARK. Antes eu ou chutava 400kcal pra um risoto (na verdade 1.000) ou entrava em pânico. Ter estimativas razoáveis me deu controle SEM obsessão.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 10: Déficit muito agressivo — por que não ir logo de 1.000kcal?
  // ============================================================
  {
    userId: 'user_sim_011', // Lucas Souza
    content: `Se 500kcal de déficit perde 0.5kg/semana, por que não fazer 1.000kcal e perder 1kg/semana? Quero resultado RÁPIDO. Sei que é "agressivo" mas aguento a fome. Vale a pena?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Lucas, a tentação é lógica pela matemática. Mas o corpo não funciona como planilha linear. Vou te mostrar por que déficits agressivos CUSTAM mais do que entregam.

O que acontece com déficit de 1.000kcal+ (40-50% de restrição):

1. Perda de massa magra ACELERADA:
Quanto maior o déficit, maior a proporção de músculo perdido (Garthe et al., 2011). Déficit de 500kcal: ~80% gordura/20% músculo. Déficit de 1.000kcal: pode chegar a 60% gordura/40% músculo. Cada kg de músculo perdido = ~50kcal/dia a menos de TMB.

2. Adaptação metabólica MAIOR e MAIS RÁPIDA:
Queda mais rápida de T3, leptina, testosterona. NEAT despenca mais drasticamente. O corpo "resiste" com muito mais força.

3. Perda de performance no treino:
Glicogênio cronicamente baixo → treinos péssimos → menos estímulo para preservar músculo. O treino que deveria PROTEGER seu músculo perde eficácia.

4. Hormônios reprodutivos:
Mulheres: amenorreia hipotalâmica (perda da menstruação). Homens: testosterona cai significativamente.

5. Fome extrema → compulsão:
Quanto maior o déficit, maior o drive de fome. A maioria aguenta 2-4 semanas → depois quebra. A quebra é compulsão que elimina semanas de progresso.

6. Efeito sanfona:
Déficits agressivos → recuperação de peso mais provável e rápida após a dieta.

Para VOCÊ:
Déficit de 300-500kcal/dia → perde 300-500g/semana → PRESERVA músculo → SUSTENTÁVEL. Em 6 meses: 7-13kg de gordura com músculo preservado. Resultado visual: incomparavelmente melhor.

Lucas, "acabar logo" é ilusão. Quem faz agressivo "acaba" mais rápido mas RECOMEÇA mais vezes.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005', // Rafael Lima
    content: `Posso confirmar com dados pessoais. Primeiro cutting: 1.100kcal por 10 semanas. Perdi 10kg. Mas 1RM caiu 25kg e ficava exausto. Em 3 meses recuperei 8kg. Segundo cutting: 400kcal por 20 semanas. Perdi 8kg. 1RM caiu 5kg. Energia normal. 1 ano depois: mantive o peso. A diferença? Preservou músculo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003', // Mariana Costa
    content: `A tabela gordura:músculo deveria ser OBRIGATÓRIA em qualquer consultório. Todo mundo foca em "quanto perdi" sem perguntar "perdi O QUÊ". 8kg de gordura com 2kg de músculo é COMPLETAMENTE diferente de 8kg com 4kg de músculo. No espelho, na roupa, no metabolismo — em TUDO. Perder peso rápido é fácil. Perder GORDURA mantendo músculo é a arte real.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================
async function main() {
  console.log('\n🏟️  SEED: DÉFICIT CALÓRICO NA VIDA REAL\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%deficit-calorico%,name.ilike.%déficit calórico%');

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('slug.ilike.%deficit%,name.ilike.%déficit%');
    if (allArenas?.length) {
      console.log('Arenas com "deficit":', allArenas.map(a => `${a.slug} | ${a.name}`));
    }
    return;
  }

  const arena = arenas[0];
  console.log(`✅ Arena: ${arena.name} | ID: ${arena.id} | Posts atuais: ${arena.totalPosts}`);

  // 2. Deletar posts antigos
  const { data: deleted } = await supabase
    .from('Post')
    .delete()
    .eq('arenaId', arena.id)
    .select('id');

  console.log(`🗑️  Posts antigos deletados: ${deleted?.length || 0}`);

  // 3. Inserir novos posts
  const baseTime = new Date('2025-02-07T06:00:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 14 * 60 * 1000); // 14 min entre posts

    const { error: insertError } = await supabase.from('Post').insert({
      id: randomUUID(),
      arenaId: arena.id,
      userId: post.userId,
      content: post.content,
      isPublished: true,
      isPinned: false,
      isOfficial: post.isAIResponse,
      isAIResponse: post.isAIResponse,
      isUnderReview: false,
      isApproved: true,
      viewCount: Math.floor(Math.random() * 120) + 25,
      likeCount: post.isAIResponse
        ? Math.floor(Math.random() * 40) + 22
        : Math.floor(Math.random() * 25) + 5,
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

  // 4. Atualizar contador + SEO
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  await supabase
    .from('Arena')
    .update({
      totalPosts: count,
      status: count > 10 ? 'HOT' : 'WARM',
    })
    .eq('id', arena.id);

  console.log(`📊 Total posts na arena: ${count}`);
  console.log('\n🏟️  Arena Déficit Calórico pronta! ✅\n');
}

main().catch(console.error);
