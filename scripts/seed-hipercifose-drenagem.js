require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: Hipercifose & Drenagem
// ~32 posts em 8 conversas
// Foco: cifose torácica aumentada, "corcunda", postura
// de celular, dowager's hump, drenagem linfática manual,
// retenção hídrica, inchaço, lipedema vs edema, exercício
// como drenagem natural, mitos sobre drenagem
// ============================================================

const POSTS = [

  // ── CONVERSA 1: "Tenho corcunda e tô com 30 anos" ────────
  {
    userId: 'user_sim_003',
    content: `Tirei uma foto de perfil e levei um susto — tenho uma curvatura enorme nas costas, parece corcunda. Tenho 30 anos! Trabalho no notebook há 8 anos. Minha mãe tem a mesma coisa e diz que é genético e "não tem jeito". Tem jeito ou não?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Mariana, a resposta depende do TIPO de hipercifose — e na maioria dos casos de pessoas jovens que trabalham com computador, SIM tem jeito.

**O que é hipercifose torácica:**

A coluna torácica tem uma curvatura natural (cifose) de ~20-45° (Cobb). Acima de 45° é considerada **hipercifose**. Visualmente: as costas arredondam excessivamente, os ombros protraem, a cabeça vai pra frente.

**Tipos — e essa distinção é CRUCIAL:**

**1. Hipercifose POSTURAL (funcional) — a mais comum em jovens:**
- Causada por desequilíbrio muscular crônico (sentar curvado horas/dia por anos)
- A coluna vertebral está NORMAL estruturalmente — o problema é muscular/postural
- Teste: deite de barriga pra baixo e tente estender as costas (cobra). Se a curvatura reduz significativamente → POSTURAL
- **TEM CORREÇÃO com exercício e consciência postural**
- Prevalência em trabalhadores de escritório: extremamente alta

**2. Doença de Scheuermann:**
- Cifose estrutural por cunhamento vertebral (vértebras se deformam na adolescência)
- Geralmente diagnosticada entre 12-17 anos
- Teste: a curvatura NÃO reduz completamente ao estender
- Visível no raio-X: 3+ vértebras consecutivas com cunhamento >5° cada
- Melhora parcial com exercício, mas NÃO corrige completamente
- Casos severos (>70° Cobb): avaliação para colete ou cirurgia

**3. Hipercifose senil/osteoporótica:**
- Fraturas vertebrais por compressão em idosos com osteoporose
- Geralmente >60 anos
- NÃO é o seu caso com 30 anos

**O padrão muscular da hipercifose postural:**

| ENCURTADOS/HIPERTÔNICOS | FRACOS/INIBIDOS |
|---|---|
| Peitoral maior e menor | Trapézio inferior e médio |
| Suboccipitais | Serrátil anterior |
| Esternocleidomastoideo | Flexores profundos cervicais |
| Subscapular | Romboides |
| Bíceps | Extensores torácicos (eretores) |

**Protocolo de correção (8-16 semanas):**

**1. Alongar o que puxa pra frente (diariamente, 5 min):**
- **Peitoral na porta**: braço a 90°, avance pela porta. 30s cada lado. 2x
- **Peitoral menor**: deite sobre foam roller longitudinalmente, braços abertos a 45°, deixe a gravidade abrir os ombros. 60-90s
- **Flexores cervicais**: incline a cabeça suavemente pra trás, queixo pro teto. 20s, 3x
- **Alongamento de bíceps na parede**: mão na parede, gire o corpo pra fora. 30s cada

**2. Fortalecer o que puxa pra trás (3-4x/semana, 15 min):**
- **Y-T-W-L deitado (prono)**: de barriga pra baixo, faça cada letra com os braços. 2x10 cada. Ativa TODA a musculatura extensora/retratora
- **Face pull com elástico**: 3x15. O melhor exercício único para hipercifose
- **Retração cervical (chin tuck)**: 3x10, segure 5s cada. Fortalece flexores profundos
- **Band pull-apart**: 3x15. Romboides + trapézio médio
- **Remada sentada/com elástico**: 3x12. Fortalece todo o posterior
- **Superman (extensão torácica)**: 3x10, segure 3s no topo. Extensores torácicos
- **Wall angel**: encostada na parede, deslize os braços pra cima mantendo contato com a parede. 3x10. Mobilidade + ativação escapular

**3. Mobilidade torácica (diariamente, 3 min):**
- **Foam roller transversal**: deite com o foam roller TRANSVERSAL na torácica (NÃO na lombar). Estenda as costas sobre ele em cada segmento. 30s por posição, 4-5 posições
- **Cat-cow focado na torácica**: na posição de 4 apoios, foque o arredondamento/extensão na torácica (bloqueie a lombar). 10 ciclos
- **Rotação torácica**: 4 apoios, mão na nuca, rode o cotovelo pro teto. 10 cada lado

**Genética vs hábito:**
Sua mãe tem a mesma cifose? Possibilidades:
- Vocês compartilham os mesmos HÁBITOS posturais (genético do estilo de vida, não do DNA)
- Pode haver componente genético real (Scheuermann é parcialmente hereditário)
- Um raio-X de perfil diferencia definitivamente: se as vértebras são normais → postural e corrigível

**O que esperar:**
- Semana 1-4: melhora quando lembra de corrigir, volta quando esquece
- Semana 4-8: postura melhor se torna mais natural
- Semana 8-16: diferença visível em fotos de perfil
- Manutenção: exercícios de fortalecimento posterior PERMANENTES (senão volta)

Mariana, com 30 anos e cifose postural, a correção é altamente provável. Mas exige trabalho consistente — não existe "ajuste rápido".`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_020',
    content: `Fiz o teste de deitar e estender — minha curvatura reduziu muito. Postural! Comecei face pull + Y-T-W + foam roller há 3 meses e meu namorado comentou que minha postura "parece outra". Tenho 28 anos e trabalhava curvada desde os 18. 10 anos de cifose postural melhorando em 3 meses de exercício correto.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `Vou fazer o teste de extensão e se for postural, começo o protocolo imediatamente. E vou pedir um raio-X de perfil pra descartar Scheuermann. Obrigada pela clareza!`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Dowager's hump — o calombo na base do pescoço ──
  {
    userId: 'user_sim_006',
    content: `Tenho um calombo na base do pescoço/topo das costas — parece uma "corcovinha". Minha amiga disse que é "dowager's hump" e que vem de postura do celular. Isso é gordura ou osso? Tem como eliminar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Patricia, o "calombo" na transição cervicotorácica (C7-T1) é cada vez mais comum e pode ter composições diferentes que exigem abordagens diferentes.

**O que pode ser esse calombo:**

**1. Almofada de gordura dorsocervical (buffalo hump):**
- Depósito de GORDURA localizado sobre o processo espinhoso de C7
- Mais comum em: mulheres pós-menopausa, uso crônico de corticoide, síndrome de Cushing, obesidade, resistência insulínica
- É mole à palpação, não é duro
- Reduz com perda de gordura + correção postural
- Se persistente: lipoaspiração localizada é opção (último recurso)

**2. Proeminência óssea de C7 (normal em muitas pessoas):**
- O processo espinhoso de C7 é naturalmente o MAIS proeminente da coluna cervical
- Em pessoas magras, é visível e palpável — completamente normal
- NÃO é patológico

**3. Cifose aumentada na junção cervicotorácica (postural):**
- A anteriorização crônica da cabeça (postura de celular/notebook) aumenta a carga na junção C7-T1
- O corpo responde espessando tecidos moles (ligamentos, fáscia, gordura) para proteger a área
- Combinação de gordura + espessamento fascial + postura cifótica = o "calombo" visual
- **ESTA é a causa mais comum em jovens que usam celular/notebook excessivamente**

**A postura de celular em números:**
- Brasileiros usam celular em média **9-10 horas por dia** (dados We Are Social)
- Posição típica: cabeça flexionada 45-60°
- A junção C7-T1 absorve a maior parte dessa carga (ponto de transição entre cervical móvel e torácica rígida)
- Anos dessa carga → adaptação tecidual → calombo

**Protocolo de redução:**

**Se for predominantemente POSTURAL (a maioria):**

*Correção da posição da cabeça (diariamente):*
- **Chin tuck** (retração cervical): 3x10, segure 5s. Reposiciona a cabeça sobre o tronco
- **Celular na altura dos olhos**: levante o celular em vez de baixar a cabeça. Parece bobo, reduz 80% da carga cervical
- **Monitor na altura dos olhos**: se trabalha com computador, é obrigatório

*Mobilidade da junção C7-T1:*
- **Foam roller na torácica alta**: posicione o roller na região T1-T4, estenda suavemente por cima. 30s em cada ponto
- **Rotação torácica alta**: sentada, mãos cruzadas no peito, rode o tronco focando na região alta. 10 cada lado
- **Extensão com toalha**: enrole uma toalha, coloque na base do pescoço, deite de barriga pra cima e deixe a cabeça cair suavemente pra trás. 60-90s

*Fortalecimento:*
- Face pull, Y-T-W, band pull-apart, remada (mesmo protocolo da conversa anterior)
- **Retração cervical com resistência**: empurre a cabeça contra a mão (isometria posterior). 5x10s

**Quando investigar mais:**
- Calombo que cresceu rapidamente → exames hormonais (cortisol, descartar Cushing)
- Uso crônico de corticoide oral/inalatório → discutir com médico
- Ganho de peso centralizado + face arredondada + estrias roxas → Cushing (raro mas importante)

**Timeline de melhora (componente postural):**
- 4-6 semanas: postura da cabeça visivelmente melhor
- 8-12 semanas: calombo começa a reduzir
- 3-6 meses: melhora significativa
- Componente de gordura leva mais tempo e depende de emagrecimento geral

Patricia, o primeiro passo mais impactante é levantar o celular na altura dos olhos. Parece pequeno, mas remove a causa primária.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `Meu "calombo" reduziu visivelmente em 4 meses com chin tuck diário + foam roller na torácica alta + face pull. E o hábito de levantar o celular fez diferença ENORME. Minha fisio mediu a proeminência antes e depois — reduziu quase pela metade.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `Nunca pensei que 10h/dia de celular com cabeça baixa por anos criaria uma adaptação física assim. Vou começar pela coisa mais simples: levantar o celular. E o foam roller na torácica alta. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Drenagem linfática — o que funciona vs marketing ──
  {
    userId: 'user_sim_007',
    content: `Faço drenagem linfática manual toda semana (R$ 150/sessão) porque me sinto muito inchada. No dia seguinte fico "desinchada" mas em 2-3 dias volta tudo. Tô gastando R$ 600/mês em algo que "não dura". É normal ou a drenagem não funciona?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Fernanda, o padrão de "desincha 1 dia e volta" é a experiência mais relatada sobre drenagem — e revela tanto a verdade quanto a limitação da técnica.

**O que a drenagem linfática REALMENTE faz:**

**O sistema linfático:**
- Rede de vasos que coleta o excesso de líquido intersticial (fluido entre as células) e devolve à circulação sanguínea
- NÃO tem bomba própria (diferente do sangue com o coração) — depende de contração muscular, respiração e gravidade
- Se o retorno linfático é lento → acúmulo de líquido → inchaço/edema

**A drenagem linfática manual (DLM):**
- Técnica de massagem suave que estimula o fluxo linfático mecanicamente
- Pressão leve e rítmica (~30-40mmHg) na direção dos linfonodos
- Move o líquido acumulado de volta pro sistema circulatório → eliminado pelos rins → desincha

**Por que funciona no dia mas não dura:**
- A DLM move o líquido que JÁ ESTÁ acumulado — é um efeito MECÂNICO temporário
- Se a CAUSA do acúmulo não foi resolvida, o líquido volta a se acumular
- É como secar o chão sem fechar a torneira — seca e molha de novo
- O efeito dura 24-72h e depois a retenção reaparece

**Quando a DLM é genuinamente indicada (evidência forte):**
- ✅ Linfedema (pós-cirúrgico, pós-câncer de mama) — tratamento padrão-ouro
- ✅ Pós-operatório de cirurgias plásticas (lipo, abdominoplastia)
- ✅ Gestação com edema significativo
- ✅ Insuficiência venosa crônica com edema
- ✅ Lipedema (como parte do protocolo)

**Quando a DLM é marketing disfarçado (evidência fraca/nenhuma):**
- ❌ "Desintoxicação" — o corpo tem fígado e rins pra isso
- ❌ "Emagrecimento" — DLM não queima gordura
- ❌ "Eliminar celulite" — a celulite é estrutural, não é fluido
- ❌ "Desinchar" por excesso de sódio/carboidrato/hormonal sem tratar a causa

**Em vez de R$ 600/mês em DLM, investigue POR QUE você incha:**

**Causas comuns de inchaço crônico:**

**1. Excesso de sódio:**
- Consumo médio brasileiro: ~12g de sal/dia (recomendado: <5g)
- Cada 1g de sódio extra retém ~200ml de água
- Solução: reduzir para <5g sal/dia → desincha em 3-5 dias

**2. Sedentarismo:**
- O retorno linfático depende de contração muscular (especialmente das pernas)
- Ficar sentada/em pé parada horas → líquido acumula nas pernas
- Solução: caminhada 20-30min/dia é a "drenagem natural" mais eficaz que existe

**3. Hormonal:**
- Progesterona na fase lútea (pré-menstrual) causa retenção hídrica
- Pílula anticoncepcional pode agravar
- Hipotireoidismo: retenção generalizada (mixedema)

**4. Baixa ingestão de água (paradoxalmente):**
- Beber pouca água → corpo retém mais (modo "conservação")
- Aumentar para 30-35ml/kg/dia pode REDUZIR retenção

**5. Baixa proteína na dieta:**
- Albumina mantém pressão oncótica (puxa fluido de volta para os vasos)
- Proteína insuficiente → albumina baixa → líquido vaza para os tecidos

**"Drenagem natural" — grátis e sustentável:**
- Caminhada diária (contração da panturrilha = "segundo coração")
- Elevação de pernas 15-20min à noite
- Meia de compressão em dias longos sentada/em pé
- Reduzir sódio + aumentar potássio (frutas, vegetais)
- Hidratação adequada
- Exercício regular

Fernanda, R$ 600/mês em DLM sem investigar a causa é tratar o sintoma indefinidamente. Investigue o motivo, trate a causa, e a DLM fica reservada para momentos pontuais — não como manutenção semanal eterna.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `Parei a drenagem semanal e comecei a caminhar 30min/dia + reduzir sódio + beber mais água. Em 2 semanas meu inchaço reduziu mais do que com a drenagem. A caminhada É a drenagem — a panturrilha faz o trabalho quando contraímos. Economizei R$ 600/mês.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: `"Secar o chão sem fechar a torneira" — essa analogia é PERFEITA. Vou investigar as causas (aposto que é sódio + sedentarismo) antes de gastar mais em sessões. Obrigada pela honestidade!`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Retenção hídrica vs gordura — como diferenciar ──
  {
    userId: 'user_sim_001',
    content: `Meu peso varia até 3kg de um dia pro outro. Tem dias que acordo "magra" e outros que pareço ter engordado 5kg da noite pro dia. Isso é retenção ou gordura? Como saber a diferença?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ana Paula, variação de 3kg em 24h é 100% RETENÇÃO HÍDRICA — é fisiologicamente impossível ganhar ou perder 3kg de gordura em um dia.

**A matemática que resolve a dúvida:**
- 1kg de gordura = ~7.700kcal de excedente
- Para GANHAR 3kg de gordura em 1 dia, você precisaria consumir ~23.100kcal ACIMA da sua necessidade
- Isso é ~40 Big Macs num dia
- Se você não comeu 40 Big Macs, não é gordura

**O que causa variação de 1-3kg diários:**

**1. Sódio (o maior vilão):**
- Refeição salgada à noite → +1-2kg na balança de manhã
- Cada 1g de sódio extra retém ~200ml de água
- Jantar japonês (shoyu, missô) → +1,5-2kg facilmente
- Normaliza em 24-48h ao retomar consumo normal

**2. Carboidrato:**
- Cada 1g de glicogênio armazena ~3-4g de água
- Dia de "refeição livre" com muito carb → armazena 200-400g de glicogênio extra → +600-1.600g de ÁGUA
- NÃO é gordura — é o corpo armazenando combustível + a água que vem junto
- Reverte em 1-3 dias de alimentação normal

**3. Ciclo menstrual:**
- Fase lútea (pré-menstrual): progesterona retém 1-3kg de água
- Pior nos 3-5 dias antes da menstruação
- Alivia com a chegada da menstruação (queda de progesterona)
- Completamente hormonal e fisiológico

**4. Cortisol:**
- Estresse crônico → cortisol elevado → aldosterona → retenção de sódio e água
- Noite mal dormida → cortisol alto → +0,5-1kg na manhã seguinte
- Período de trabalho intenso → inchaço crônico

**5. Hidratação:**
- Beber pouca água → corpo retém mais
- Beber muito de uma vez → volume transitório na balança

**6. Conteúdo intestinal:**
- 1-2kg de comida e fezes no trato gastrointestinal é normal
- Dia de mais fibra/volume alimentar → balança sobe sem mudança na composição corporal

**Como diferenciar retenção de gordura na prática:**

| Característica | Retenção hídrica | Ganho de gordura |
|---|---|---|
| Velocidade | Aparece em 1-2 dias | Gradual (semanas/meses) |
| Magnitude | 1-3kg de um dia pro outro | 0,5-1kg por SEMANA no máximo |
| Aparência | Rosto inchado, mãos, pés, sensação de "estufar" | Aumento gradual de medidas |
| Localização | Generalizado, muda com posição | Depósitos específicos (abdômen, quadril) |
| Reversibilidade | Some em 1-3 dias | Não some sem déficit calórico |
| Marca de anel/meia | Mais apertados nos dias de retenção | Sem mudança rápida |

**Como monitorar peso INTELIGENTEMENTE:**
- Pese-se TODOS os dias, no mesmo horário (manhã, em jejum, após banheiro)
- Calcule a **média semanal** (soma de 7 dias / 7)
- Compare a MÉDIA desta semana com a da semana passada
- A média suaviza as oscilações diárias e mostra a tendência REAL
- Se a média semanal está descendo → você está perdendo gordura, independente do dia que subiu 2kg

Ana Paula, a balança diária é uma foto borrada por água, sódio, carboidrato, hormônios e intestino. A média semanal é o retrato real.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `A média semanal mudou minha relação com a balança. Antes eu entrava em pânico quando subia 2kg de um dia pro outro. Agora peso todo dia mas só olho a média de domingo. Minha média vem caindo consistentemente mesmo com dias de +2kg. Parei de sofrer.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `A tabela diferenciando retenção de gordura é genial — aparência, velocidade, localização, reversibilidade. Vou colar na geladeira pra lembrar nos dias de "pânico da balança". E vou começar a fazer média semanal. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Exercício como drenagem natural ───────────
  {
    userId: 'user_sim_002',
    content: `Minha fisio disse que exercício físico é "a melhor drenagem que existe". Isso é real ou ela tá simplificando? Que tipo de exercício drena melhor?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, sua fisio está CORRETA — e não está simplificando. O exercício é literalmente o mecanismo mais eficiente de retorno linfático e venoso que existe.

**Por que exercício drena melhor que drenagem manual:**

**1. O sistema linfático não tem bomba própria.**
Depende de:
- Contração muscular (principal) ← exercício faz isso
- Respiração profunda (diafragma como "bomba" torácica) ← exercício faz isso
- Pulsação arterial adjacente ← exercício aumenta isso
- Gravidade/posição ← exercício varia isso

A DLM manual simula parte desses mecanismos com pressão externa. O exercício ativa TODOS simultaneamente.

**2. A panturrilha como "segundo coração":**
- As veias das pernas têm válvulas que impedem refluxo
- Quando a panturrilha contrai (a cada passo), ela ESPREME o sangue e a linfa pra cima
- É literalmente uma bomba muscular
- Caminhar 30 minutos → centenas de compressões rítmicas → drenagem massiva
- Nenhuma sessão manual de 1h reproduz esse volume de bombeamento

**3. Respiração profunda durante exercício:**
- O diafragma é uma bomba linfática
- Na inspiração: pressão negativa no tórax SUGA linfa do abdômen pra cima
- Durante exercício: frequência e profundidade respiratória aumentam → mais sucção linfática
- A cisterna do quilo (grande reservatório linfático no abdômen) drena diretamente pela ação diafragmática

**Ranking de exercícios por eficácia de drenagem:**

**Tier 1 — Máxima drenagem:**
- **Caminhada** (30-45min): a bomba da panturrilha + balanço dos braços + respiração. Simples e eficaz demais
- **Natação/hidroginástica**: pressão hidrostática da água comprime uniformemente → efeito de "meia de compressão" em 360°. Estudo: redução de edema de MMII significativamente maior que em terra
- **Rebounding (mini-trampolim)**: cada salto cria mudança de aceleração gravitacional → linfa é "ordenhada" pelas válvulas. Muito usado em fisioterapia linfática

**Tier 2 — Muito eficaz:**
- **Bicicleta/pedalar**: boa ativação de panturrilha + quadríceps em cadência rítmica
- **Yoga/alongamento dinâmico**: posições invertidas (pernas pra cima, dog descendente) + respiração profunda
- **Dança**: movimento multidirecional + panturrilha + respiração

**Tier 3 — Eficaz com ressalvas:**
- **Musculação**: excelente para drenar membros trabalhados durante o treino. Menos eficaz globalmente que aeróbico
- **HIIT**: intensidade muito alta pode AUMENTAR retenção temporariamente (cortisol)

**Protocolo "drenagem natural" diário:**

**Manhã (5 min):**
- Respiração diafragmática profunda: 10 ciclos (inspira 4s expandindo abdômen → expira 6s contraindo)
- Elevar as pernas contra a parede: 3-5 minutos (gravidade drena MMII)

**Ao longo do dia:**
- Caminhar 5 min a cada hora sentada
- Pump de panturrilha sentada: suba e desça os calcanhares 20x (faz em reunião sem ninguém ver)
- Beber 30-35ml/kg de água

**Final do dia:**
- Caminhada 20-30 min (pode ser com cachorro, ir ao mercado, caminhar no bairro)
- Elevação de pernas 15-20 min vendo TV

**Custo mensal: R$ 0. Eficácia: superior à DLM semanal de R$ 600.**

Juliana, sua fisio está certa. O corpo tem seu próprio sistema de drenagem — o exercício é o botão de ligar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Minha esposa fazia drenagem 2x/semana pra inchaço nas pernas. Quando começou a caminhar 30min/dia, o inchaço reduziu MAIS do que com as sessões. A fisio confirmou: panturrilha ativa > mão de terapeuta pra drenagem crônica. Economizou R$ 1.200/mês.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `O pump de panturrilha sentada é genial — posso fazer em qualquer reunião! E a elevação de pernas à noite vou incorporar. Basicamente: mover o corpo é o tratamento. Simples demais pra indústria vender, por isso empurram sessões semanais.`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Lipedema vs retenção — a diferença crucial ──
  {
    userId: 'user_sim_016',
    content: `Minhas pernas são MUITO mais grossas que o resto do corpo — proporção completamente desproporcional. Faço dieta, emagreço no tronco e braços, mas as pernas não mudam. Minha esteticista diz que é "retenção" e me vende drenagem. Mas li sobre lipedema e me identifiquei. Como diferenciar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Daniela, essa é uma diferença CRUCIAL que pode mudar completamente sua abordagem — e infelizmente muitos profissionais confundem ou desconhecem.

**Lipedema vs Retenção hídrica (edema) vs Obesidade de MMII:**

**RETENÇÃO HÍDRICA (Edema):**
- Inchaço simétrico que VARIA ao longo do dia (pior à noite, melhor de manhã)
- Sinal de cacifo positivo: pressione a canela por 10s → fica uma marca ("cova") que demora pra voltar
- Responde a elevação de pernas, exercício, redução de sódio
- NÃO dói ao toque
- Pés ficam inchados junto
- Drenagem alivia temporariamente

**LIPEDEMA:**
- Doença crônica do tecido adiposo, quase exclusiva de mulheres
- Gordura PATOLÓGICA depositada simetricamente em MMII (e às vezes braços)
- NÃO responde a dieta ou exercício — o tronco emagrece, as pernas NÃO
- Sinal de cacifo NEGATIVO (pressiona e NÃO fica marca)
- DÓI ao toque (hipersensibilidade) — hematomas fáceis
- PÉS POUPADOS — a gordura para no tornozelo, criando o "efeito bracelete"
- Início: puberdade, gestação ou menopausa (gatilhos hormonais)
- Prevalência estimada: 10-18% das mulheres (subdiagnosticado drasticamente)

**OBESIDADE COMUM de MMII:**
- Gordura proporcional ao resto do corpo
- Responde a déficit calórico proporcionalmente
- NÃO dói ao toque
- Sem sinal de bracelete
- Sem hematomas fáceis

**Teste de autoavaliação para lipedema:**

Marque SIM ou NÃO:
1. Pernas desproporcionalmente maiores que o tronco? ( )
2. Dieta e exercício emagrecem o corpo mas NÃO as pernas? ( )
3. Dor ou sensibilidade ao toque nas pernas? ( )
4. Hematomas fáceis (roxos sem lembrar de ter batido)? ( )
5. Pés normais com "salto" brusco no tornozelo? ( )
6. Simétrico (os dois lados iguais)? ( )
7. Iniciou na puberdade, gestação ou menopausa? ( )
8. Histórico familiar de "pernas grossas"? ( )

**5+ SIM: altíssima probabilidade de lipedema → procurar médico vascular ou angiologista especializado**

**O que a drenagem NÃO faz no lipedema:**
- NÃO remove a gordura lipedematosa (é gordura doente, não fluido)
- Pode ajudar o componente de EDEMA ASSOCIADO (que frequentemente coexiste)
- Não é tratamento primário — é complemento

**Tratamento real do lipedema:**
- Terapia descongestiva complexa (TDC): DLM + bandagens + exercício aquático + meia de compressão
- Exercício de baixo impacto (natação/bike — protege articulações)
- Nutrição anti-inflamatória (NÃO dieta restritiva que emagrece tudo menos as pernas)
- Cirurgia: lipoaspiração tumescente WAL/PAL (única forma de remover a gordura lipedematosa)
- Suporte psicológico (o impacto emocional é enorme)

Daniela, se você se identificou com a descrição do lipedema, o próximo passo é um médico vascular que CONHEÇA a doença. Muitos ainda confundem com "só engordar nas pernas". O diagnóstico correto muda o tratamento completamente.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `Passei 15 anos achando que era "retenção" e fazendo drenagem. Quando finalmente fui diagnosticada com lipedema estágio 2 por um angiologista especializado, chorei de alívio. NÃO era falta de dieta. NÃO era preguiça. É uma DOENÇA. O diagnóstico correto é libertador.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `Marquei 7 de 8 no checklist. Vou procurar um angiologista AMANHÃ. Se for lipedema, finalmente vou parar de me culpar por "não conseguir emagrecer as pernas". Obrigada por essa informação — pode mudar minha vida.`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Meia de compressão — quando e por que usar ──
  {
    userId: 'user_sim_020',
    content: `Meu médico receitou meia de compressão 20-30mmHg pra usar no trabalho (fico em pé 8h/dia como vendedora). Mas é quente, desconfortável e parece "coisa de velho". Realmente faz diferença ou é exagero?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Beatriz, entendo o desconforto — mas a meia de compressão é uma das intervenções mais eficazes e subutilizadas para saúde vascular e linfática.

**O que a meia de compressão faz fisiologicamente:**

- Aplica pressão GRADIENTE: máxima no tornozelo (~100%) e decrescente em direção ao joelho/coxa (~70-40%)
- Esse gradiente EMPURRA o sangue e a linfa de volta pra cima contra a gravidade
- Reduz o diâmetro das veias superficiais → aumenta velocidade de fluxo
- Previne refluxo venoso (sangue "voltando pra baixo")
- Resultado: menos acúmulo de líquido, menos inchaço, menos peso nas pernas

**Evidência:**
- Cochrane review: meias de compressão reduzem significativamente edema, dor e sensação de peso em profissionais que ficam em pé/sentados por longos períodos
- Reduzem risco de trombose venosa profunda em viagens longas (~60-70%)
- Melhoram recuperação pós-exercício (evidência moderada)

**Quem deveria usar e não usa:**
- Profissionais que ficam em pé >6h/dia (vendedores, enfermeiros, professores, cabeleireiros)
- Profissionais que ficam sentados >6h/dia (escritório, motoristas)
- Gestantes (a partir do 2° trimestre)
- Pessoas com varizes ou histórico familiar
- Pessoas com lipedema
- Viagens aéreas >4h

**Guia de compressão:**

| Compressão | Indicação |
|---|---|
| 15-20mmHg (suave) | Prevenção, pernas cansadas, viagens |
| 20-30mmHg (moderada) | Varizes leves, inchaço diário, ficar em pé muito tempo |
| 30-40mmHg (forte) | Varizes moderadas, linfedema, lipedema, pós-cirúrgico |

Sua prescrição de 20-30mmHg é adequada para 8h em pé.

**Dicas práticas para usar sem sofrer:**

**Calor:**
- Existem meias de microfibra mais finas (Kendall, Sigvaris Soft) — menos quentes que as tradicionais
- Modelos 3/4 (até abaixo do joelho) são mais toleráveis que meia-calça
- Se trabalha de calça: a meia fica invisível

**Colocação:**
- Vista ANTES de levantar da cama (quando as pernas estão menos inchadas)
- Use luvas de borracha pra facilitar deslizar
- Desembole a meia até o calcanhar, encaixe e vá desenrolando (não puxe de uma vez)

**Manutenção:**
- Lave com sabão neutro, seque à sombra (não use secadora)
- Troque a cada 4-6 meses (perde elasticidade)
- Tenha pelo menos 2 pares pra alternar

**A diferença que faz em 8h em pé:**
- SEM meia: pernas pesadas, inchaço progressivo, dor ao final do dia, varizes piorando
- COM meia: pernas leves, muito menos inchaço, energia para o final do dia

"Coisa de velho" é ter varizes aos 35 e insuficiência venosa crônica aos 45 porque não usou prevenção quando podia.

Beatriz, 8h em pé sem meia de compressão é como dirigir 8h sem cinto — funciona até o dia que não funciona. Use a meia e suas pernas aos 50 anos agradecerão.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Trabalho 10h em pé como enfermeira. Comecei a usar meia 20-30mmHg há 3 anos. A diferença entre os dias COM e SEM é gritante. COM: chego em casa com pernas normais. SEM: chego destruída com tornozelos inchados. Não é cosmético — é FUNCIONAL.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `A analogia com cinto de segurança me convenceu. Vou comprar um par de microfibra (menos quente) e testar 1 semana. Se a diferença for como a Renata descreve, vou aderir. Melhor prevenir do que remediar varizes depois.`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Cifose + inchaço — o combo postural-linfático ──
  {
    userId: 'user_sim_018',
    content: `Li toda essa arena e percebi que tenho os DOIS problemas juntos: cifose torácica + inchaço crônico nas pernas. Existe conexão entre postura ruim e drenagem ruim? Ou são problemas separados que coincidiram?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Marcelo, excelente observação — e sim, existe conexão real entre postura e drenagem, embora não seja a causa mais óbvia.

**As conexões postura-drenagem:**

**1. Diafragma comprometido pela cifose:**
- A hipercifose torácica LIMITA a expansão torácica → respiração superficial
- O diafragma é a principal bomba linfática do tronco
- Respiração rasa → menos sucção diafragmática → retorno linfático reduzido do abdômen e MMII
- Estudo: a capacidade vital pulmonar diminui ~10% para cada 10° de cifose acima do normal

**2. Compressão do ducto torácico:**
- O ducto torácico (principal vaso linfático do corpo) passa pelo mediastino
- Cifose severa + ombros protrusos = compressão mecânica da entrada torácica
- Pode reduzir o retorno linfático global

**3. Sedentarismo como causa comum:**
- Ficar sentado horas → cifose postural (causa)
- Ficar sentado horas → panturrilha inativa (consequência)
- Mesmo fator → dois problemas simultâneos
- Não é que a cifose CAUSE inchaço — mas a causa de ambos é a mesma: IMOBILIDADE

**4. Inatividade do core:**
- Na hipercifose, o core fica inibido (mesma lógica da conversa sobre amnésia glútea)
- Core inativo → menos compressão abdominal → menos auxílio ao retorno linfático visceral

**Protocolo integrado "corrige postura + desinfla":**

**Rotina matinal (8 min):**
- Respiração diafragmática 360°: 10 ciclos (expande costelas lateralmente, NÃO abdômen anterior). Ativa bomba diafragmática
- Cat-cow com foco em torácica: 10 ciclos. Mobiliza cifose
- Foam roller transversal na torácica: 2 min. Abre a cifose
- Chin tuck: 10 reps x 5s. Corrige cabeça anteriorizada

**Ao longo do dia (micro-doses):**
- A cada hora sentado: levantar 3-5 min + pump de panturrilha 20x + 5 respirações profundas
- Band pull-apart com elástico na cadeira: 15 reps a cada 2h (leva 30 segundos)
- Ergonomia: monitor na altura dos olhos (resolve a causa postural)

**Treino 3-4x/semana (30-40 min):**
- **Caminhada 20 min**: drenagem natural + cardio
- **Face pull**: 3x15 (correção cifose)
- **Y-T-W**: 2x10 cada (extensores torácicos)
- **Remada**: 3x12 (posterior em geral)
- **Ponte de glúteo**: 3x15 (ativa posterior, core, abre quadril)
- **Dead bug**: 3x10 cada (core profundo — auxilia pressão abdominal para retorno linfático)

**Final do dia (5 min):**
- Pernas elevadas na parede: 5 min (drena MMII por gravidade)
- Alongamento peitoral na porta: 30s cada lado
- 5 respirações diafragmáticas profundas

**Investimentos recomendados:**
- Foam roller: R$ 40-80 (uma vez)
- Elástico para face pull: R$ 20-40 (uma vez)
- Monitor externo + teclado/mouse: R$ 400-600 (uma vez)
- Meia de compressão se fica sentado/em pé >6h: R$ 60-150 (a cada 6 meses)
- **Total: R$ 520-870 (investimento único vs R$ 7.200/ano em drenagem semanal)**

Marcelo, postura e drenagem estão conectados pelo diafragma, pelo sedentarismo como causa comum, e pela inatividade geral. Tratar os dois juntos é mais eficiente que separadamente.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Nunca pensei na conexão diafragma → drenagem. Minha cifose limita minha respiração → menos bombeamento linfático → mais inchaço. É uma cadeia. O protocolo integrado de 8+5 minutos diários + treino 3x/semana é totalmente factível. Melhor que 1h de DLM por semana!`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_018',
    content: `O cálculo final é matador: R$ 520-870 uma vez vs R$ 7.200/ano em drenagem. E o protocolo integrado trata a CAUSA (imobilidade + cifose + diafragma ineficiente) em vez do sintoma (fluido acumulado). Começo amanhã. Valeu por conectar os pontos!`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🔍 Buscando arena "Hipercifose Drenagem"...');

  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%hipercifose%,slug.ilike.%drenagem%,name.ilike.%hipercifose%,name.ilike.%cifose%drenagem%');

  if (arenaError) {
    console.error('❌ Erro ao buscar arena:', arenaError);
    return;
  }

  if (!arenas || arenas.length === 0) {
    console.log('⚠️  Arena não encontrada. Tentando busca alternativa...');
    const { data: retry } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('name.ilike.%cifose%,name.ilike.%drenagem%,slug.ilike.%cifose%');

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
  const baseTime = new Date('2025-02-07T08:15:00Z');

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
