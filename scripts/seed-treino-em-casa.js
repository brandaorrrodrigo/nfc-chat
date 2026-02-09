require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: TREINO EM CASA
// 44 posts | 9 conversas (4-6 posts cada)
// Base: metodologia Bret Contreras (~100% dos exercícios em casa)
// Foco: peso corporal, elásticos, halteres, espaço limitado,
// barulho, motivação, mães, orçamento, progressão
// ============================================================

const POSTS = [

  // ============================================================
  // CONVERSA 1: Só peso corporal — dá resultado real?
  // ============================================================
  {
    userId: 'user_sim_002',
    content: `Tô sem grana pra comprar equipamento. Dá pra ter resultado REAL de hipertrofia só com peso corporal? Ou vou só "tonificar" e ficar nisso?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Dá pra ter resultado REAL sim — com uma condição: você precisa progredir a dificuldade dos exercícios. Hipertrofia requer: tensão mecânica suficiente + proximidade da falha + volume adequado. O músculo NÃO sabe se a resistência vem de um halter ou da gravidade sobre SEU CORPO. O que importa: as últimas 3-5 repetições são DIFÍCEIS?

Sistema de progressão por exercício (peso corporal puro):

Empurrar: Flexão inclinada (parede) → sofá → chão joelho → chão completa → pés elevados → arqueiro → unilateral assistida.

Puxar: Remada invertida na mesa → remada com toalha na porta → pull-up negativa → pull-up completa.

Perna/glúteo: Agachamento → búlgaro → pistol assistido. Ponte de glúteo → unilateral → elevado.

Core: Prancha → toque de ombro → lateral. Dead bug → com extensão.

Programa mínimo viável (3x/semana, 25 min): Dia A: flexão, agachamento búlgaro, pike push-up, hip thrust sofá. Dia B: remada invertida, ponte unilateral, superman, step-up. Dia C: full body com variações mais difíceis.

Regra de progressão: quando conseguir 3x15+ → avance para variação mais difícil.

Limitação real: perna e glúteo excelente, peito/ombro bom até intermediário, costas limitado (barra de porta R$ 40 resolve).`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_020',
    content: `A remada invertida na mesa mudou meu treino de costas! Deito embaixo, puxo até a borda. Sinto igual à remada no cabo. E quando fica fácil: elevo os pés. Custo: R$ 0.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `8 meses de peso corporal puro + barra de porta (R$ 50). Meus braços, ombros e glúteo mudaram visivelmente. Treino no quarto 25 min, 4x/semana. A chave é PROGREDIR as variações — se está fácil, avance pra versão mais difícil.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `O estudo me convenceu. Se flexão difícil produz hipertrofia comparável ao supino COM CARGA, não tem desculpa. Vou seguir o programa!`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 2: Setup home gym com R$ 500 — o que comprar?
  // ============================================================
  {
    userId: 'user_sim_004',
    content: `Quero montar espaço em casa com R$ 500. O que compraria pra ter MÁXIMO resultado com esse valor? Prioridade: hipertrofia de glúteo e perna.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `R$ 500 é suficiente pra setup EXCELENTE de glúteo e perna. Lista priorizada:

Prioridade 1 — Halteres ajustáveis (R$ 150-200): par até 20kg. MELHOR investimento/real. Dezenas de exercícios.

Prioridade 2 — Kit elásticos (R$ 80-120): 3-5 resistências. Mini band + long band. Essenciais.

Prioridade 3 — Barra de porta (R$ 40-60): resolve puxar.

Prioridade 4 — Caneleira ajustável 5kg (R$ 60-80): extensão de quadril, abdução, kick back.

Prioridade 5 — Tapete EVA (R$ 30-50): conforto e proteção piso.

Setup ideal: Halteres (~180) + kit elásticos (~100) + barra (~50) + caneleira (~70) + tapete (~40) = R$ 440.

Programa 4x/semana: Dia 1 glúteo+quad, Dia 2 upper, Dia 3 glúteo+posterior, Dia 4 full body.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `Montei exatamente esse setup por R$ 450. Treino 10 meses e meu shape melhorou MAIS que 2 anos de academia que eu faltava 50%. A caneleira é subestimada — donkey kick com 5kg ativa o glúteo do jeito que não conseguia na academia. Investimento que se paga na primeira mensalidade que você NÃO gasta.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Dica: comprem halteres USADOS no Facebook por R$ 100. Fevereiro/março explodem os classificados com equipamento que compraram em Janeiro e nunca usaram. Com a economia, comprei kit elásticos completo.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 3: Elásticos — dá pra hipertrofiar de verdade?
  // ============================================================
  {
    userId: 'user_sim_006',
    content: `Comprei kit de elásticos por R$ 100 mas parecem brinquedo. Fiz abduções e remadas que parecem leve. Dá pra hipertrofiar de VERDADE com bands?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Elásticos são ferramentas legítimas de hipertrofia — se usados corretamente. Lopes et al. (2019): treino com elásticos = ganhos comparáveis aos pesos livres.

Por que parece "brinquedo":

Problema 1: resistência errada. Se faz 30 reps fáceis → band muito leve. Solução: band que cause FALHA entre 8-20 reps. Se ainda leve → dobre a band ou combine 2.

Problema 2: falta de intenção. Elástico permite "trapacear" fácil. Solução: fase concêntrica com intenção + excêntrica 3-4s CONTROLADA.

Problema 3: exercícios limitados. Só abdução e remada → subutilizando.

Exercícios SÉRIOS: Hip thrust com band (4x12), monster walk (3x15), kickback (3x15 cada), clamshell (3x20), remada sentada (4x12), face pull (3x15), puxada joelhos (3x12), push-up com band (3x máx).

Vantagem ÚNICA: resistência ascendente — máxima no topo (exatamente onde o glúteo tem mais ativação no hip thrust). Complementa peso livre perfeitamente.

Use band certa, controle excêntrico, vá perto da falha. A sensação muda COMPLETAMENTE.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `Treino com elásticos 1 ano. Braços e costas desenvolveram visivelmente. Chave: band CERTA e FALHA próxima. Comecei com band verde (leve) achando inútil. Troquei pra preta/roxa (pesada/extra) — jogo mudou. Se faz 20 reps fácil, band está fraca demais.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Excêntrico lento com elástico é BRUTAL. Faço chest press com band preta, 3s subida e 4s retorno (excêntrica controlada). Não passo de 10 reps. Meu peitoral discorda de "brinquedo". Intenção transforma exercício de fisioterapia pra hipertrofia real.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 4: Apartamento + barulho — treinar sem incomodar
  // ============================================================
  {
    userId: 'user_sim_013',
    content: `Moro 3° andar, piso madeira. Qualquer salto vizinho reclama. Burpee = briga com vizinho. Como treinar INTENSIDADE sem barulho?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Treino intenso e silencioso é POSSÍVEL e TÃO eficaz. Maior barulho vem de IMPACTO — elimine impacto.

Exercícios que fazem barulho (EVITAR): burpees com salto, jump squats, box jumps, jump lunges, pular corda.

Substitutos silenciosos IGUALMENTE eficazes:
- Burpee → sprawl (mão chão → prancha → volta SEM saltar): 90% intensidade
- Jump squat → agachamento com pausa 3s fundo + subida explosiva (SEM sair chão): igualmente difícil
- Jump lunge → búlgaro com pausa
- Box jump → step-up alto explosivo
- Pular corda → mountain climber controlado OU step-ups rápidos

Protocolos silenciosos mas INTENSOS:

Tabata silencioso (4 min brutal): 20s sprawl + 10s descanso × 8 rounds. Ou mountain climber. Ou agachamento isométrico.

EMOM silencioso (20 min): Min 1: 10 flexões, Min 2: 15 agachamentos, Min 3: 10 remada halter cada lado, Min 4: 20 ponte glúteo. Repetir 5x.

Circuito tempo sob tensão (zero impacto): agachamento 5s descida/5s subida (8 reps), flexão 4s descida/3s subida (6 reps), prancha 45s, wall sit 45s. 3-4 rounds, 60s descanso.

Medidas extras: tapete EVA duplo, meias antiderrapantes, halteres revestidos (não metálicos), nunca derrubar pesos.

Carlos, sprawl é tão intenso quanto burpee. Agachamento com TUT é mais difícil que jump squat. Treino silencioso não é fraco — é INTELIGENTE.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Sprawl é tão intenso. Faço Tabata silencioso e fico DESTRUÍDO — sem reclamação vizinhos. 8 rounds 20s sprawl + 10s = 4 minutos puro sofrimento. Agachamento 5s descida faz pernas tremerem mais que jump squat. Barulho ≠ intensidade.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_013',
    content: `Tabela de substituições é ouro. Testei agachamento pausa 3s fundo + subida explosiva SEM sair chão: MUITO mais difícil que jump squat. Vizinho agradece e pernas também.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 5: Mãe com filhos pequenos — treinar com interrupções
  // ============================================================
  {
    userId: 'user_sim_016',
    content: `Tenho 2 filhos (3 e 6). Único horário é ACORDADOS. Já tentei treinar e sobem em mim, pedem água, brigam. Trancar no quarto = culpa. Acordar 5h com bebê 3h = impossível. Como mãe REALMENTE consegue treinar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Desafio REAL afetando milhões. Solução NÃO é treino "ideal" com filhos — é adaptar FORMAT.

Princípio: melhor treino com filhos é o que ACONTECE, não o perfeito que não acontece.

Formato 1 — Treino EMOM:
A cada minuto, 1 exercício (8-12 reps). Tempo sobrando = descanso. Se criança interrompe → pule minuto → retome próximo. CADA MINUTO INDEPENDENTE. 15-20 min = treino completo. Exemplificado acima.

Formato 2 — Acumulação ao longo dia:
Em vez de 30 min único, faça 3x 10 min. Manhã: agachamento + ponte. Tarde: flexão + remada. Noite: hip thrust + prancha. Evidência (Baz-Valle et al., 2019): distribuir séries ao longo dia = hipertrofia equivalente sessão única.

Formato 3 — Treino COM crianças:
Criança 3 anos: usar como "peso" agachamento/ponte (amam). Criança 6: dar "tarefas" — "conta reps", "faça junto". Transformar em brincadeira.

Formato 4 — Negociação de tela:
25 min desenho TV = 25 min treino você. Culpa de "tela" << benefício mãe saudável. Se tela = 25 min treino 3-4x/semana → USE sem culpa.

Estratégias: treinar MESMO cômodo (veem você), pesos PRONTOS (não monte), aceitar que NENHUM será sem interrupção, planejar que tolerem pausa.

O que NÃO funciona: acordar 5h (sono prejudicado piora TUDO), 1h ininterrupta com crianças em casa (vai frustrar), esperar "momento perfeito" (não existe até 10+).

Daniela, 20 min fragmentados 4x/semana = 80 min treino real/semana. MUITO mais que zero.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_001',
    content: `EMOM salvou minha vida mãe-que-treina. Cada minuto independente — se filha (4) interrompe, pulo minuto e retomo próximo. 15-20 min consigo 12-15 séries REAIS mesmo com 3-4 interrupções. E desenho: 25 min Bluey = cuidar da minha saúde = INVESTIMENTO na maternidade, não negligência.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `A permissão de "usar tela durante treino" tirou peso ENORME. Psicóloga disse: "25 min tela pra exercitar BENEFICIA família inteira". Mãe saudável = mãe melhor. Comecei EMOM durante Mundo Bita e nunca mais parei.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 6: Halteres ficaram leves — limite do treino em casa?
  // ============================================================
  {
    userId: 'user_sim_005',
    content: `Treino em casa 1 ano com halteres 20kg. Os 20kg estão FÁCEIS — 3x15 stiff tranquilo. Chegou LIMITE do treino em casa? Hora de ir pra academia?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `20kg "fácil" NÃO significa esgotou potencial. Significa que precisa mudar ESTRATÉGIA de sobrecarga.

Sobrecarga progressiva NÃO é só adicionar peso. Existem 7 formas:

1. Aumento de carga (esgotou) — limitado
2. Tempo sob tensão: excêntrica 4-5s → 20kg com 4s descida RADICALMENTE diferente de 1s ✅ imediato
3. Pausa isométrica: 2-3s no ponto mais difícil → recruta mais unidades motoras ✅ imediato
4. Unilateral: stiff bilateral 20kg → stiff UNILATERAL 20kg → dobrou carga relativa ✅ imediato
5. Rest-pause: 10 reps, descanso 15s, 3-4 mais, 15s, 2-3 mais → volume efetivo maior ✅ imediato
6. Drop set mecânico: variação difícil → mais fácil sem descanso. Búlgaro → agachamento → parcial ✅ imediato
7. 1.5 reps: desce todo, sobe metade, desce, sobe todo = 1 rep. Duplica TUT ✅ imediato

Aplicação — seu stiff "fácil":
Antes: bilateral 20kg, 3x15, excêntrica rápida = fácil.
Agora: UNILATERAL 20kg, excêntrica 4s, pausa 2s alongamento, 3x8-10 = BRUTAL.

Quando ir pra academia:
- Quando esgotou TODAS 7 progressões com seus pesos
- Quando quer cargas >40-50kg (agachamento, stiff pesado)
- Quando quer equipamentos específicos (polia, leg press, puxada alta)
- Quando quer ambiente social

Com 20kg + técnicas intensificação, tem mais 6-12 MESES progressão antes de academia.

Rafael, seus 20kg com 4s excêntrica + unilateral vão sentir como 40kg.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Rest-pause e tempo training REATIVARAM ganhos. Meus 20kg com 4s excêntrica > 30kg com rápido na academia. Músculo conta TENSÃO × TEMPO. Unilateral com 20kg búlgaro é humilhante. MUITO chão antes de academia.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `Testei hoje stiff unilateral 20kg, 4s descida, pausa 2s — não passei de 8 reps/perna. Antes 15 bilateral fácil. TÉCNICA é que faltava, não peso. Vou explorar 7 formas progressão antes de R$ 200/mês academia.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 7: Motivação — como não desistir em 2 semanas
  // ============================================================
  {
    userId: 'user_sim_011',
    content: `Tentei treinar em casa 3x e desisto em 2-3 semanas. Sofá ali, TV ali, geladeira ali. Na academia pelo menos quando chega, treina. Como vocês mantêm consistência?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Questão NÃO é motivação — é SISTEMA. Motivação oscila; sistemas funcionam independente.

Por que casa é diferente academia (psicologia ambiental):
Academia: IR já = comprometimento (sunk cost deslocamento). Casa: barreira entrada = zero → saída também zero. Domicílio = âncoras descanso (sofá, TV, cama) → cérebro condicionado RELAXAR. Solução: criar GATILHOS e SEPARAÇÃO ambiental.

Estratégia 1 — Regra 5 minutos:
Dia que não quer NADA: "só 5 min". Comprometa-se 5 min APENAS. Psicologia: começar muda inércia. 90% das vezes passa de 5 min. Se parar em 5? Tudo bem — 5 > 0. Elimina decisão binária.

Estratégia 2 — Gatilho ambiental (trocar roupa):
Horário planejado: troque pra roupa treino IMEDIATAMENTE. NÃO sente sofá "só pouco". Troca roupa = gatilho psicológico. (Fogg 2019, Tiny Habits).

Estratégia 3 — Espaço separado:
Designar 2m² casa como "área treino" — tapete, pesos ali. Pisa ali → modo treino ativado. NÃO treine sofá TV.

Estratégia 4 — Horário não-negociável:
UM horário, sempre. "18h30 treino" — não "quando der". Alarme celular. Em 3-4 semanas = automático (Lally et al., 2010).

Estratégia 5 — Treino curto > longo que não acontece:
Se 40 min planejado e não quer: faça 15 min. 15 min alta intensidade 4x/semana > 40 min 1x. Reduza DURAÇÃO, nunca FREQUÊNCIA. Hábito = frequência.

Estratégia 6 — Accountability:
Poste na comunidade que treinou. Parceiro virtual. Marque calendar X. Sequência visual motiva.

Quando REALMENTE é hora de ir academia: quando esgotou TODAS 7 progressões com seus pesos.

O que NÃO funciona: "segunda vou começar", programas 1h+ iniciante, depender de motivação, música como primária.

Desistiu 3x com 2-3 semanas — é ANTES de hábito formar (~4-8 semanas). Use regra 5 min + roupa gatilho. Se passar 4 semanas, consistência se auto-alimenta.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_015',
    content: `Regra 5 minutos salvou. Dias que não quero NADA: "só 5 min, depois paro". NUNCA parei. Cérebro resiste INÍCIO, não exercício. Uma vez que começa, endorfina toma conta. 6 meses consistente — recorde pessoal.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `Dica roupa gatilho é genial. Cheguei do trabalho, troquei IMEDIATAMENTE — não sentei sofá. Fui direto tapete. Treinei 22 min. Se sentasse "só 5 min" → não saía. Roupa gatilho = interruptor.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 8: Casa vs academia — estou perdendo resultado?
  // ============================================================
  {
    userId: 'user_sim_017',
    content: `Treino em casa 2 anos e amo. Mas fico com dúvida: deixo resultado na mesa? Academia com equipamento "de verdade" seria MUITO melhor? Tenho halteres 24kg, elásticos, barra porta.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Resposta: academia tem MAIS ferramentas. Mas "mais ferramentas" ≠ automaticamente "mais resultado".

O que academia oferece que casa não:
- Cargas mais altas (agachamento 60-100kg+)
- Máquinas (leg press, hack squat, polia)
- Cable/polia (kickback, crucifixo, puxada)
- Mais variedade = mais opções angulação

Impacto real:
Para INICIANTES/INTERMEDIÁRIOS (0-3 anos): diferença PEQUENA (10-20% no máx). Estímulo limitante = intensidade e consistência, não equipamento.

Para AVANÇADOS (3+ anos): diferença mais relevante (cargas altas necessárias).

O cálculo que importa:

Scenario A — Academia: 100% potencial × 65% assiduidade = 65% efetivo.
Scenario B — Casa: 82-85% potencial × 92% assiduidade = ~75% efetivo.

Casa com alta assiduidade GANHA academia com assiduidade mediana.

O que deixa na mesa:
- Hip thrust 80-100kg+ (halter limita)
- Puxada alta carga pesada
- Leg press pesado
- Cable kickback progressivo

O que GANHA em casa:
- Tempo (sem deslocamento)
- Dinheiro (sem mensalidade)
- Consistência (não falta)
- Flexibilidade horário
- Conforto psicológico

Para seu setup (24kg + elásticos + barra): ~85-90% cobertura exercícios. Com intensificação (TUT, unilateral, rest-pause): estímulo pra ANOS progressão.

Com 2 anos em casa + resultados que ama: não troque EXCETO (1) halteres + técnicas realmente esgotem E (2) CERTEZA que irá academia frequência. Se QUALQUER dúvida assiduidade → casa ganha.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `Fiz 3 anos academia e 2 casa. Melhores resultados? Casa. Motivo: NUNCA FALTEI. Academia: 30-40% falta. 85% potencial consistência 95% vs 100% potencial 60% assiduidade → casa ganha. De longe.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: `Comparação 85% potencial com consistência > 100% potencial com 60% assiduidade. Continuo em casa sem culpa. Se REALMENTE estagnasse com todas técnicas intensificação, considero academia. Mas pernas/glúteo melhores que nunca — e treino pijama se quiser 😂`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 9: Programa completo — me dá um plano semanal!
  // ============================================================
  {
    userId: 'user_sim_008',
    content: `Me dá PROGRAMA COMPLETO em casa. Tenho: halteres até 16kg, kit elásticos, mini band, caneleira 4kg. Objetivo: hipertrofia glúteo/perna + manutenção MMSS. 4 dias/semana, 30-35 min.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Programa 4 semanas com progressão. Base: Bret Contreras adaptado home gym.

DIA A — GLÚTEO + QUAD (30 min):
1. Hip thrust sofá com halter (16kg): 4×12 (pausa 2s topo)
2. Agachamento goblet (16kg): 3×12 (excêntrica 3s)
3. Búlgaro halter (12kg cada): 3×10 cada perna
4. Monster walk mini band: 3×15 passos
5. Extensão quadril 4 apoios caneleira: 3×15 cada
6. Wall sit: 2×45s

DIA B — UPPER + CORE (30 min):
1. Flexão (variação adequada): 3×máx (-2)
2. Remada unilateral halter: 3×12 cada
3. Desenvolvimento halteres (10-12kg): 3×10
4. Rosca bíceps elástico: 3×12
5. Tríceps francês halter: 3×12
6. Face pull elástico: 3×15
7. Dead bug: 3×10 cada

DIA C — GLÚTEO + POSTERIOR (30 min):
1. Stiff romeno halteres (16kg): 4×10 (exc 4s, pausa 2s)
2. Hip thrust unilateral sofá: 3×12 cada
3. Abdução lateral deitada mini band: 3×20 cada
4. Step-up alto halter (12kg): 3×10 cada
5. Fire hydrant caneleira: 3×12 cada
6. Ponte pés elevados + halter: 3×15

DIA D — FULL BODY (35 min):
1. Agachamento sumo halter: 3×12
2. Flexão pés elevados: 3×máx
3. Stiff unilateral halter: 3×8 cada
4. Remada elástico: 3×12
5. Hip thrust com band (quadril): 3×15
6. Elevação lateral elástico: 2×15
7. Prancha toque ombro: 3×30s

Progressão 4 semanas:
Semana 1: aprender forma, excêntrica 2-3s.
Semana 2: aumentar excêntrica 3-4s, adicionar 1 rep/série.
Semana 3: tentar carga maior ou rest-pause último exercício.
Semana 4: DELOAD — 40% volume. Recuperar.

Após 4 semanas: repetir bloco com carga/técnica + avançada.

Regras: aquecimento 2-3 min (mini band), descanso 60-90s glúteo/perna + 45-60s MMSS, últimas 2-3 reps DIFÍCEIS.

Volume semanal: glúteo ~20 séries ✅, quad ~9 ✅, posterior ~10 ✅, peito ~6 ✅, costas ~9 ✅.

Camila, programa cobre objetivo perfeito: ênfase glúteo (20 séries/semana) + manutenção MMSS. Em 4 semanas avalie fotos e ajuste.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_002',
    content: `Programa completo 4 dias é exatamente o que precisava. Estruturado com progressão, sem inventar. Comecei segunda — já fiz A e B. Pausa 2s topo hip thrust MUDA — sinto muito mais. 4 semanas seguindo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Segui programa parecido 12 semanas (3 blocos). Glúteo mudou VISIVELMENTE — mãe comentou sem perguntar. Tudo em casa, 14kg halter + elásticos. Técnicas intensificação (excêntrica lenta + pausa + unilateral) = equipamento limitado → resultado ilimitado.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================
async function main() {
  console.log('\n🏟️  SEED: TREINO EM CASA\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%treino-em-casa%,slug.ilike.%treino_em_casa%,name.ilike.%treino em casa%');

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('slug.ilike.%casa%,name.ilike.%casa%');
    if (allArenas?.length) {
      console.log('Arenas com "casa":', allArenas.map(a => `${a.slug} | ${a.name}`));
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
  const baseTime = new Date('2025-02-08T08:00:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 14 * 60 * 1000);

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
      viewCount: Math.floor(Math.random() * 95) + 18,
      likeCount: post.isAIResponse
        ? Math.floor(Math.random() * 32) + 18
        : Math.floor(Math.random() * 22) + 5,
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
  console.log('\n🏟️  Arena Treino em Casa pronta! ✅\n');
}

main().catch(console.error);
