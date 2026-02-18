import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🏟️ SEED: Arena Performance & Biohacking (v3 — ~200 posts, GH15 Bible refs)\n');

  const { data: arenaData } = await sb.from('Arena').select('*').eq('slug', 'performance-biohacking').single();
  let arena = arenaData;

  if (!arena) {
    const { data: created, error } = await sb.from('Arena').insert({
      id: 'arena_performance_biohacking',
      slug: 'performance-biohacking',
      name: '💊 Performance & Biohacking',
      description: 'Ciência aplicada sem filtro. Protocolos de elite, farmacologia avançada, estratégias de otimização de performance física e cognitiva. Discussões sobre redução de danos, evidence-based protocols, e otimização biológica.',
      icon: '💊',
      color: '#EC4899',
      category: 'SAUDE_CONDICOES_CLINICAS',
      isActive: true,
      aiPersona: 'SCIENTIFIC',
      categoria: 'SAUDE_CONDICOES_CLINICAS'
    }).select('*').single();
    if (error) throw new Error('Erro ao criar arena: ' + error.message);
    arena = created;
  }

  const ARENA_ID = arena.id;
  console.log('✅ Arena:', arena.name);

  const { data: deletedData } = await sb.from('Post').delete().eq('arenaId', ARENA_ID).select('id');
  console.log(`🗑️ ${deletedData?.length ?? 0} posts apagados`);

  // ========================================
  // USUÁRIOS (14 participantes + 1 IA)
  // ========================================
  const userNames = [
    { id: 'user_perf_drm', name: 'Dr. Marcus', email: 'dr.marcus@example.com' },
    { id: 'user_perf_rafael', name: 'Rafael Santos', email: 'rafael.santos.perf@example.com' },
    { id: 'user_perf_carlos', name: 'Carlos Mendes', email: 'carlos.mendes.perf@example.com' },
    { id: 'user_perf_lucas', name: 'Lucas Ferreira', email: 'lucas.ferreira.perf@example.com' },
    { id: 'user_perf_amanda', name: 'Amanda Costa', email: 'amanda.costa.perf@example.com' },
    { id: 'user_perf_pedro', name: 'Pedro Costa', email: 'pedro.costa.perf@example.com' },
    { id: 'user_perf_thiago', name: 'Thiago Oliveira', email: 'thiago.oliveira.perf@example.com' },
    { id: 'user_perf_renato', name: 'Renato Barbosa', email: 'renato.barbosa.perf@example.com' },
    { id: 'user_perf_igor', name: 'Igor Duarte', email: 'igor.duarte.perf@example.com' },
    { id: 'user_perf_juliana', name: 'Juliana Reis', email: 'juliana.reis.perf@example.com' },
    { id: 'user_perf_bruno', name: 'Bruno Machado', email: 'bruno.machado.perf@example.com' },
    { id: 'user_perf_danilo', name: 'Danilo Alves', email: 'danilo.alves.perf@example.com' },
    { id: 'user_perf_patricia', name: 'Patricia Lima', email: 'patricia.lima.perf@example.com' },
    { id: 'user_perf_gustavo', name: 'Gustavo Nunes', email: 'gustavo.nunes.perf@example.com' },
  ];

  const userIds: Record<string, string> = {};
  for (const userData of userNames) {
    const { data: existing } = await sb.from('User').select('id').eq('email', userData.email).single();
    if (existing) {
      userIds[userData.id] = existing.id;
    } else {
      const { data: created, error } = await sb.from('User').insert({
        id: userData.id, email: userData.email, name: userData.name, password: 'hashed'
      }).select('id').single();
      if (error) throw new Error('Erro criando user ' + userData.name + ': ' + error.message);
      userIds[userData.id] = created!.id;
    }
  }

  const AI_USER_ID = 'user_perf_ia';
  const { data: existingAi } = await sb.from('User').select('id').eq('email', 'ia-performance@example.com').single();
  let aiUserId: string;
  if (existingAi) {
    aiUserId = existingAi.id;
  } else {
    const { data: aiCreated, error } = await sb.from('User').insert({
      id: AI_USER_ID, email: 'ia-performance@example.com', name: 'IA — Performance & Biohacking', password: 'hashed'
    }).select('id').single();
    if (error) throw new Error('Erro criando AI user: ' + error.message);
    aiUserId = aiCreated!.id;
  }
  const aiUser = { id: aiUserId };

  let baseTime = new Date('2026-01-30T09:00:00Z');
  const nextTime = (minMinutes = 5, maxMinutes = 20) => {
    baseTime = new Date(baseTime.getTime() + (minMinutes + Math.floor(Math.random() * (maxMinutes - minMinutes))) * 60000);
    return new Date(baseTime);
  };

  const posts = [

    // ============================================================
    // THREAD 1: TREMBOLONA E REPARTICIONAMENTO (ORIGINAL)
    // ============================================================
    {
      content: 'Pessoal, vamos falar de Trembolona e reparticionamento. A pergunta que sempre recebo: "Como queimar gordura em superávit calórico?" A resposta está no antagonismo do Receptor de Glicocorticoide.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Dr. Marcus, pode explicar melhor esse mecanismo? Vi que a Trembolona ocupa o GR e impede o cortisol de agir. Isso realmente reduz a deposição visceral?',
      userId: userIds['user_perf_rafael'],
      isAIResponse: false
    },
    {
      content: 'Rafael, exato. São 3 mecanismos simultâneos: 1) Antagonismo do GR — menos cortisol ativo = menos lipogênese visceral. 2) Aumento de IGF-1 local que sequestra nutrientes pro músculo. 3) Upregulation de receptores β-adrenérgicos no adipócito aumentando lipólise basal.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'INSIGHT: Discussão técnica sobre mecanismos de reparticionamento. Trembolona atua em 3 vias simultâneas — GR, IGF-1 local e β-adrenérgica.',
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'E os colaterais? Sei que perfil lipídico colapsa. Como monitorar corretamente?',
      userId: userIds['user_perf_carlos'],
      isAIResponse: false
    },
    {
      content: 'Carlos, obrigatório: hematócrito (risco de policitemia), lipidograma completo (HDL despenca, LDL oxida), função hepática e renal. Colaterais neurológicos também são reais — insônia, agressividade via modulação GABAérgica. Monitoramento constante é o mínimo.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 2: FRAGMENT 176-191 + AEJ (ORIGINAL)
    // ============================================================
    {
      content: 'Mudando de assunto: comprei Fragment 176-191 mas não vi resultado nenhum. Aplicava sempre de manhã depois do café. Onde errei?',
      userId: userIds['user_perf_lucas'],
      isAIResponse: false
    },
    {
      content: 'Lucas, aí está seu erro. Fragment é o segmento C-terminal do GH (aminoácidos 176-191). Ele apenas MOBILIZA gordura via ativação da HSL, mas NÃO OXIDA. Se aplicou pós-refeição com insulina alta, a insulina INIBIU a HSL via fosforilação inibitória. O Fragment nem conseguiu agir.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Então qual o protocolo correto?',
      userId: userIds['user_perf_lucas'],
      isAIResponse: false
    },
    {
      content: 'Protocolo que funciona: 1) Aplicação subcutânea em jejum prolongado (8-12h sem comer). 2) Aguardar 15-20min para pico plasmático. 3) AEJ de baixa-média intensidade (60-70% FC máx) por 30-45min. 4) NÃO comer carboidrato imediatamente após.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Então sem o cardio em jejum, os ácidos graxos liberados simplesmente voltam pro adipócito?',
      userId: userIds['user_perf_lucas'],
      isAIResponse: false
    },
    {
      content: 'Exatamente. Re-esterificação. Ciclo inútil. Você pagou caro por uma injeção que não fez nada. O Fragment MOBILIZA, o cardio OXIDA. A sinergia é OBRIGATÓRIA. Sem cardio em jejum = dinheiro jogado fora.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'RESUMO: Protocolo Fragment 176-191 = Jejum 8-12h + Aplicação + Espera 15min + AEJ 60-70% FC por 30-45min. Sem cardio = ciclo inútil de mobilização/re-esterificação.',
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 3: BPC-157 PARA RECUPERAÇÃO (ORIGINAL)
    // ============================================================
    {
      content: 'Dr. Marcus, e sobre BPC-157 pra recuperação de lesão? Estou com tendinite crônica há 6 meses.',
      userId: userIds['user_perf_amanda'],
      isAIResponse: false
    },
    {
      content: 'Amanda, BPC-157 é um pentadecapeptídeo derivado de proteína gástrica. Promove angiogênese, aumenta expressão de GH receptors e acelera cicatrização de tendão/ligamento. Protocolo comum: 250-500mcg 2x/dia, subcutâneo próximo à lesão. Duração: 4-6 semanas. Combinação com TB-500 potencializa.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'NOVO TÓPICO: Peptídeos para recuperação — BPC-157 e TB-500. Compartilhe suas experiências.',
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Alguém já usou BPC-157 pra recuperação de lesão? Estou com tendinite crônica e queria saber se vale a pena.',
      userId: userIds['user_perf_pedro'],
      isAIResponse: false
    },
    {
      content: 'Pedro, usei TB-500 + BPC-157 juntos por 5 semanas depois de uma ruptura parcial do supraespinhal. Ressonância de controle mostrou redução significativa da lesão. Meu ortopedista ficou surpreso. Protocolo: BPC 250mcg + TB-500 2mg, 2x/semana.',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 4: HGH + INSULINA = O JOGO REAL (GH15 BIBLE)
    // ============================================================
    {
      content: 'Quero abrir uma discussão polêmica mas necessária. O bodybuilding moderno desde os anos 2000 — é TUDO sobre HGH + insulina, ou AAS ainda tem papel principal? Vi o debate do GH15 sobre isso e quero opiniões.',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: `Renato, o GH15 tinha uma tese central que se confirmou com os anos: bodybuilding moderno é um jogo de HGH + insulina. AAS sozinho te leva a 90kg condicionado, máximo. Mas o "blow up" — o tamanho REAL com condição — só vem do combo GH + slin.

**AAS SOZINHO (sem GH/insulina):**
- Limite prático: 85-95kg no palco, 5-7% BF
- Condicionamento bom, mas sem volume 3D

**AAS + HGH (sem insulina):**
- Limite: 95-100kg no palco
- Separação muscular aparece, qualidade melhora

**AAS + HGH + INSULINA (o combo completo):**
- 100-115kg+ no palco
- Volumização muscular tridimensional
- IGF-1 700-800+ = conditioned size

O GH15 descrevia: quando IGF-1 bate 700+, você anda na rua e parece 4 semanas do palco. Hiperplasia real.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO CIENTÍFICO: O conceito de "conditioned size" se alinha com estudos sobre hiperplasia muscular induzida por IGF-1. A combinação HGH + insulina maximiza o eixo GH → IGF-1 hepático. Atletas <90kg = AAS only, 90-100kg = AAS + GH, >100kg = combo completo.`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Mas Dr. Marcus, isso não é extremamente perigoso? Insulina mal dosada mata.',
      userId: userIds['user_perf_igor'],
      isAIResponse: false
    },
    {
      content: `Igor, ABSOLUTAMENTE perigoso. Insulina pode te matar em HORAS se errar a dose.

**Riscos reais:**
- Hipoglicemia severa = coma, morte cerebral, óbito
- Profissionais usam 200-300 UI/dia
- Margem de erro é mínima

**Protocolo de redução de danos (se alguém insistir):**
1. NUNCA sem glicosímetro ao alcance
2. Sempre ter dextrose/suco disponível
3. Começar com 3-5 UI pós-treino (não pre)
4. NUNCA dormir após aplicação sem comer
5. Monitorar glicemia a cada 30min nas primeiras 2h

Eu NÃO recomendo. Mas informação salva vidas.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Obrigado pela honestidade. Isso confirma que o caminho natural tem limites, mas o farmacológico tem riscos que a maioria subestima.',
      userId: userIds['user_perf_igor'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 5: QUALIDADE DO GH — PHARMA vs GENÉRICOS (GH15 BIBLE)
    // ============================================================
    {
      content: 'Pessoal, alguém que entende de GH pode explicar a diferença REAL entre GH pharma grade e genéricos chineses? Vejo gente pagando 10x mais por Serostim vs genéricos.',
      userId: userIds['user_perf_bruno'],
      isAIResponse: false
    },
    {
      content: `Bruno, essa é A questão central do GH. O GH15 dedicou ANOS a isso.

**SOMATROPINA 191aa vs 192aa:**
- 191aa = sequência idêntica ao GH humano endógeno
- 192aa = versão com metionina extra no N-terminal (somatrem, obsoleta)
- 192aa causa mais anticorpos, menos biodisponibilidade

**COMO VERIFICAR QUALIDADE:**

1. **Serum test:** Aplica 10 UI, coleta sangue 3h depois
   - GH pharma: serum 25-40 ng/mL
   - Genérico bom: 15-25 ng/mL
   - Lixo: <10 ng/mL

2. **IGF-1 baseline vs após 4 semanas:**
   - Pharma: IGF-1 700-800+
   - Genérico bom: 400-600
   - Sub-dosado: <300

**Regra de ouro do GH15:** Se após 100 dias de GH legítimo você não parecer 4 semanas out do palco andando na rua, seu GH é lixo.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `ANÁLISE: Diferença entre 191aa (somatropina) e 192aa (somatrem) documentada — FDA descontinuou somatrem nos anos 90. Serum test + IGF-1 sérico como proxy de biodisponibilidade são métodos validados clinicamente. ALERTA: Aquisição sem prescrição é ilegal.`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Dr. Marcus, e a questão da pureza proteica? Vi que GH pode ter 80% ou 99% de pureza e o serum test dar o MESMO resultado.',
      userId: userIds['user_perf_bruno'],
      isAIResponse: false
    },
    {
      content: `Excelente observação. Serum test mede QUANTO GH está no sangue, não QUAL a qualidade.

Exemplo: Produto A (99% pureza) e B (80% pureza) podem dar serum 30. Mas A terá efeito biológico SUPERIOR: menos impurezas = menos anticorpos, mais proteína funcional por UI, meia-vida mais estável.

É por isso que APENAS serum test não basta. Precisa acompanhar IGF-1 ao longo de semanas. O GH15 batia nessa tecla: análise de composição em laboratório era o único teste definitivo.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 6: IDADE, RECUPERAÇÃO E GH OBRIGATÓRIO (GH15 BIBLE)
    // ============================================================
    {
      content: 'Tenho 37 anos, voltei a treinar depois de 3 anos parado. Estou 8kg acima do meu melhor peso. Consigo voltar ao que era?',
      userId: userIds['user_perf_juliana'],
      isAIResponse: false
    },
    {
      content: `Juliana, vou ser honesto.

**A verdade dura:** Após os 35, com layoff de 3+ anos, duplicar sua melhor condição é EXTREMAMENTE difícil. GH endógeno cai ~14% por década após os 30. Testosterona ~1-2% ao ano. Sensibilidade a insulina diminui.

**O que funciona naturalmente:** DUP periodizado, sono 7-9h, proteína 2.2-2.5g/kg, creatina 5g/dia.

**O que o pessoal avançado faz:** TRT sob supervisão, GH fisiológico (1-2 UI/dia). O GH15 dizia: "GH é obrigatório para qualquer um acima de 32 que queira parecer competitivo."

**Expectativa realista:** 90-95% do seu melhor em 12-18 meses. Os últimos 5-10% exigem mais tempo e possivelmente intervenção hormonal.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Mas e a "memória muscular"? Não ajuda?',
      userId: userIds['user_perf_juliana'],
      isAIResponse: false
    },
    {
      content: `Memória muscular é REAL — os mionúcleos adquiridos persistem por anos. Acelera a re-hipertrofia nos primeiros 6-8 meses. MAS você sempre fica "2kg e 0.5% de BF" do seu melhor. Os mionúcleos ajudam no VOLUME, mas a QUALIDADE (separação, vascularização) depende do ambiente hormonal.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `RESUMO: Retorno pós-35 com layoff — memória muscular acelera volume, qualidade depende de ambiente hormonal. GH endógeno cai 14%/década. Expectativa: 90-95% do pico em 12-18 meses.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 7: TREN ACETATO vs PARABOLAN (GH15 BIBLE)
    // ============================================================
    {
      content: 'Vi que muito coach gringo considera Trenbolona o "ouro" dos AAS. Parabolan vs Tren Acetato — qual a diferença real?',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },
    {
      content: `Thiago, Tren Acetato > Parabolan em TUDO que importa na prática.

**Tren Acetato:** Meia-vida ~48-72h. Injeção EOD ou ED. Pico rápido. Ajuste fácil — se der colateral, sai rápido.

**Parabolan (Hexa):** Meia-vida ~14 dias. Se der colateral grave, demora SEMANAS pra sair.

A frequência de injeção é CRÍTICA. Mínimo a cada 2 dias. Níveis plasmáticos ESTÁVEIS e ALTOS = reparticionamento máximo. Parabolan gera picos e vales.

**Bottom line:** Acetato é a única versão que faz sentido. Parabolan é marketing com ester caro.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'E a dosagem? Onde fica o ponto de retorno diminuído?',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },
    {
      content: `Dose-resposta: 150-200mg/sem = perceptível. 300-400mg = sweet spot. 500-700mg = avançado, colaterais se multiplicam. 700mg+ = rendimento diminuído.

O ponto está em ~400-500mg. Se precisa de mais que 500mg pra ver resultado, o problema não é a dose — é treino, dieta ou genética.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO FARMACOLÓGICO: Trenbolona tem afinidade ~5x maior pelo receptor androgênico que testosterona. Éster acetato permite ajuste em ~3 dias vs ~2 semanas para hexa. ALERTA: Uso veterinário, não aprovado para humanos.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 8: SUPLEMENTOS = LIXO? (GH15 BIBLE)
    // ============================================================
    {
      content: 'Pergunta controversa: quais suplementos REALMENTE funcionam?',
      userId: userIds['user_perf_igor'],
      isAIResponse: false
    },
    {
      content: `Igor, vou ser brutalmente honesto:

**FUNCIONAM:** Creatina 3-5g/dia. Cafeína 3-6mg/kg. Whey = COMIDA, não suplemento mágico.

**MARGINALMENTE:** Beta-alanina ~2-3%. Citrulina 6-8g.

**NÃO FUNCIONAM:** BCAAs, glutamina, ZMA, fat burners OTC, HMB em atletas, tribulus.

**A verdade:** A distância entre natural com suplementos e sem é de ~2-3%. Entre natural e TRT básica é de 30-50%. Suplementos são um mercado de R$150 bilhões construído sobre 2-3%.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Mas e os pré-treinos? Sinto que treino muito melhor.',
      userId: userIds['user_perf_pedro'],
      isAIResponse: false
    },
    {
      content: `Pedro, o que funciona é a CAFEÍNA. Compra cafeína em cápsula 200-400mg — se o efeito for igual ao pré de R$150, você descobriu que paga R$140 por corante e formigamento de beta-alanina.

Exceção: pré com 6-8g citrulina + 200-300mg cafeína + 3g beta-alanina em doses DECLARADAS. Mas são poucos.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 9: INSULINA — PROTOCOLOS E TIMING (GH15 BIBLE)
    // ============================================================
    {
      content: 'Dr. Marcus, pode detalhar protocolos de insulina que profissionais usam? Puramente educacional.',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: `Renato, insulina exógena é o tópico mais perigoso do bodybuilding.

**TIPOS:**
- Humalog (lispro): onset 5-15min, pico 30-90min — peri-treino
- Humulin R (regular): onset 30min, pico 2-3h — refeições
- Lantus (glargina): sem pico, 20-24h — base contínua

**PROTOCOLO PRO (competidores):**
- Humalog 15-20 UI peri-treino
- Humulin R 10-15 UI com cada refeição
- Lantus 20-40 UI base noturna
- Total: 100-300 UI/dia
- SEMPRE com GH 10-20 UI/dia

**POR QUE MATA:**
- Hipoglicemia <40mg/dL = confusão, convulsão, coma
- <20mg/dL = morte cerebral em minutos
- NÃO tem antídoto rápido se inconsciente

DISCLAIMER: NÃO recomendo. Informação para ENTENDER, não replicar.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `ALERTA DE SEGURANÇA: Insulina exógena sem supervisão médica é potencialmente fatal. A margem entre dose eficaz e letal é estreita. Discussão EXCLUSIVAMENTE educacional e de redução de danos.`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Isso explica porque tantos bodybuilders morrem jovens. O combo GH + insulina + estimulantes é uma bomba-relógio.',
      userId: userIds['user_perf_carlos'],
      isAIResponse: false
    },
    {
      content: 'Exatamente. Hipertrofia ventricular por GH + sobrecarga hemodinâmica por AAS + arritmia por estimulantes. Dallas McCarver, Rich Piana, Bostin Loyd — todos tinham corações 2-3x o tamanho normal na autópsia.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 10: AEJ + COMPRESSÃO PARA LIPEDEMA (CROSSOVER)
    // ============================================================
    {
      content: 'Dr. Marcus, minha esposa tem Lipedema grau 2 e a médica mandou fazer HIIT. Isso está correto?',
      userId: userIds['user_perf_bruno'],
      isAIResponse: false
    },
    {
      content: `Bruno, NÃO. Tecido adiposo no Lipedema é HIPÓXICO, FIBROSADO, com drenagem linfática comprometida. HIIT dispara HIF-1α, ativa NF-κB. Resultado: mais edema, mais fibrose.

**Protocolo correto:** AEJ 5-6km/h + meia de compressão 20-30mmHg + jejum. A contração muscular rítmica funciona como bomba linfática auxiliar. Compressão cria gradiente que potencializa retorno em até 40%.

Duração: 40-60min. 4-5x/semana. Discussão aprofundada na arena de Lipedema.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `PROTOCOLO: Lipedema = Caminhada 5-6km/h + Compressão 20-30mmHg + Jejum. HIIT é CONTRAINDICADO em tecido lipedematoso.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 11: BODY FAT 6% — COMO RECONHECER (GH15 BIBLE)
    // Ref: GH15 — "when you get to 6% bodyfat you know it...
    // the face COME OUT from behind the skin... features change"
    // ============================================================
    {
      content: 'Pessoal, quero entender: qual a diferença REAL entre 7% e 6% de BF? Parece pouco mas dizem que muda tudo.',
      userId: userIds['user_perf_danilo'],
      isAIResponse: false
    },
    {
      content: `Danilo, essa é uma das descrições mais precisas que já li sobre o assunto — e o GH15 detalhou isso melhor que qualquer paper.

**A 7%:** Rosto é magro, abdômen definido, veias nos braços aparecem. Você parece "em forma". Mas ainda é genérico.

**A 6% — TUDO muda:**

O rosto SOBE por trás da pele. As maçãs do rosto se projetam. A distribuição de água no rosto muda completamente — fica MAIS magro mas paradoxalmente mais CHEIO. É um look que garçonetes em restaurante reconhecem instantaneamente.

O corpo fica quadrado. Os músculos saltam por cima dos ossos como animação japonesa. A pele gruda no músculo. É a diferença entre "esse cara malha" e "esse cara É um bodybuilder".

**Sinais práticos do 6% real:**
- Estriações visíveis no deltóide sem pump
- Veias abdominais aparentes
- Separação clara entre cabeças do quadríceps sentado
- Rosto com aparência "escultural" — mandíbula marcada, olheiras leves
- Todo mundo que te vê acha que você CRESCEU (mesmo tendo perdido peso)

O mais importante: 1% de 7% pra 6% pode representar 1.5-2kg de gordura pura a perder. Parece pouco, mas é uma jornada BRUTAL — geralmente requer 3-4 semanas de dieta limpa + Tren + possível manipulação de diuréticos.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Caramba, nunca vi descrito assim. Então a maioria dos caras que dizem estar a 6% estão na verdade a 8%?',
      userId: userIds['user_perf_danilo'],
      isAIResponse: false
    },
    {
      content: 'Danilo, FACILMENTE. A maioria que diz estar a 6% está entre 8-10%. Quando você realmente chega a 6%, não precisa perguntar a ninguém — você SABE. É como o GH15 dizia: desconhecidos na rua te param. Garçonetes sorriem sem motivo. Outros bodybuilders te olham com respeito silencioso. É unmistakeable.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Eu cheguei a ~7% uma vez pra uma competição regional. Posso confirmar — estava definido mas não tinha esse "efeito" que o Dr. Marcus descreve. Faltava aquela última camada. Agora entendo que faltaram 1-2 semanas de prep mais agressivo.',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO: A percepção visual de gordura corporal é não-linear. A diferença entre 10% e 8% é sutil. Entre 8% e 7% é moderada. Entre 7% e 6% é DRAMÁTICA — a pele se torna quase transparente sobre o músculo. Métodos de medição (bioimpedância, dobras cutâneas) têm margem de erro de ±2-3% nessa faixa.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 12: VINCE TAYLOR — CICLO DE UM PROFISSIONAL (GH15)
    // Ref: GH15 — "Sustanon 1250mg, Test Prop 1000mg, EQ 1800mg,
    // Parabolan 228mg ED, Masteron 200mg ED, Anadrol 200mg ED,
    // GH 18iu ED"
    // ============================================================
    {
      content: 'Vi uma discussão antiga sobre o ciclo do Vince Taylor. Alguém sabe os números reais? Quero entender a escala do que um profissional IFBB realmente usa.',
      userId: userIds['user_perf_gustavo'],
      isAIResponse: false
    },
    {
      content: `Gustavo, existe um relato bem documentado de alguém que conviveu com Vince Taylor nos bastidores. Os números são chocantes para quem acha que profissionais usam "500mg de testo e um pouquinho de tren":

**Ciclo do Vince Taylor (1 mês do show):**
- Sustanon 1.250mg/semana
- Testosterona Propionato 1.000mg/semana
- Boldenona (EQ) 1.800mg/semana
- Parabolan 228mg DIÁRIO
- Masteron 200mg DIÁRIO
- Anadrol 200mg DIÁRIO (oral)
- T3 + Clembuterol + Efedrina (doses não especificadas)
- GH 18 UI DIÁRIO

Conforme se aproximava do show, ele REDUZIA testosterona e AUMENTAVA Masteron e Parabolan para endurecer.

O Vince treinava 2x/dia, 6 dias por semana. 12-15 séries por grupo muscular, reps moderadas, nunca até a falha. Era completamente disciplinado com as injeções — nunca perdia um horário.

Não usava synthol, mas fazia site injections (injeção no músculo alvo com o próprio AAS). Usava diuréticos moderados.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Espera... 228mg de Parabolan POR DIA? Isso é mais de 1.5g de Tren por SEMANA. E 200mg de Anadrol? Isso não destroi o fígado?',
      userId: userIds['user_perf_gustavo'],
      isAIResponse: false
    },
    {
      content: `Gustavo, BEM-VINDO à realidade do bodybuilding profissional. Isso é o que ninguém te conta:

1. **Fígado:** Anadrol 200mg/dia por períodos curtos (4-6 semanas pré-show) com monitoramento de enzimas hepáticas. Não é seguro, mas é o que fazem.

2. **Volume total de AAS:** ~6-7 gramas de injetáveis + orais por semana. Um amador usa 500mg-1g total. Um pro usa 5-10x mais.

3. **GH 18 UI:** Isso é uma dose absurda. Dose de reposição = 1-2 UI. Dose "anti-aging" = 3-4 UI. 18 UI é território de efeitos colaterais sérios — acromegalia, resistência insulínica, intestino distendido.

4. **Custo:** Um ciclo desses custa R$15.000-30.000/mês com GH pharma grade. É por isso que a maioria dos pros está sempre quebrada ou vendendo algo.

Esse é o nível REAL. Quando um pro diz "só uso um pouquinho de testo", está mentindo. TODOS eles.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Agora faz sentido a barriga do GH (gut distention) que vemos nos pros atuais. 18 UI de GH diário por anos causa crescimento visceral inevitável.',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: 'Renato, exatamente. O "palumboísmo" — nome do Dave Palumbo que exibia isso de forma extrema — é resultado direto de GH + insulina em doses altas por tempo prolongado. Hipertrofia das vísceras. Irreversível. É o preço que pagam.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `DADOS DO CASO: Ciclo profissional IFBB documentado com >6g de AAS/semana + 18 UI GH diário. Evidencia a distância ENORME entre protocolos amadores e profissionais. O custo financeiro e de saúde é proporcionalmente extremo.

ALERTA: Doses profissionais são INCOMPATÍVEIS com saúde a longo prazo. Mortalidade precoce documentada.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 13: NANDROLONA/DECA — ARTICULAÇÕES E COLATERAIS
    // ============================================================
    {
      content: 'Dr. Marcus, o ortopedista me sugeriu "um ciclo de Deca" pra ajudar nas articulações. É verdade que Nandrolona ajuda nas juntas ou é mito?',
      userId: userIds['user_perf_pedro'],
      isAIResponse: false
    },
    {
      content: `Pedro, Nandrolona (Deca-Durabolin) TEM efeito real nas articulações, mas o mecanismo é mal entendido:

**O que realmente acontece:**
1. Retenção hídrica na cápsula sinovial — mais "almofada" na articulação
2. Aumento na síntese de colágeno tipo III (estudos in vitro)
3. Efeito anti-inflamatório leve via redução de IL-6
4. NÃO regenera cartilagem — apenas alivia sintomas

**Problema:** Quando para de usar, a dor VOLTA. Muitas vezes PIOR, porque você treinou pesado achando que estava curado.

**Colaterais específicos da Nandrolona:**
- Supressão BRUTAL do eixo HPT (pior que testosterona)
- "Deca dick" — disfunção erétil por excesso de prolactina via progesterona
- Recuperação do eixo muito mais lenta (metabólitos detectáveis até 18 meses)
- Retenção hídrica significativa

**Se quer articulações:**
- Colágeno tipo II 40mg/dia (UC-II)
- Ômega 3 em dose alta (3-4g EPA/DHA)
- BPC-157 + TB-500 para lesões específicas
- Glucosamina + condroitina (evidência mista, mas baixo risco)`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'E se combinar Deca com Testo na proporção certa, resolve o problema da disfunção?',
      userId: userIds['user_perf_pedro'],
      isAIResponse: false
    },
    {
      content: `Parcialmente. A regra clássica é Testo ≥ Deca em dosagem. Ex: Testo 500mg + Deca 300mg. A testosterona mantém a função sexual e a DHT alta o suficiente pra contrabalançar a progesterona da Nandrolona.

Mas mesmo assim ~30% dos homens reportam algum grau de DE com Nandrolona. Ter Cabergolina (antagonista de prolactina) à mão é praticamente obrigatório.

O ponto maior: usar AAS só pra articulação é como usar bomba nuclear pra abrir uma porta. Existem opções melhores e mais seguras.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `RESUMO FARMACOLÓGICO: Nandrolona alivia sintomas articulares por retenção sinovial e síntese de colágeno, mas NÃO regenera. Supressão do eixo HPT severa, recuperação lenta. Alternativas mais seguras: UC-II, BPC-157, ômega 3.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 14: DIANABOL vs TESTOSTERONA — BLOAT (GH15 BIBLE)
    // Ref: GH15 — "testosterona = BLOOOOOFY. dianabol = DISGUSTED
    // WATER FOUNTAIN... you will not be a walking sculpture"
    // ============================================================
    {
      content: 'Por que todo mundo inicia com Dianabol ou Testosterona alta? Vi relatos de muita retenção. Existe algo melhor pra primeiro ciclo?',
      userId: userIds['user_perf_danilo'],
      isAIResponse: false
    },
    {
      content: `Danilo, porque a indústria de coaching vende o que é fácil, não o que é ideal. E o GH15 era brutalmente honesto sobre isso:

**Testosterona em dose alta (500mg+):**
- Aromatização → estradiol alto → retenção hídrica
- Pele engrossa
- Cara inchada, "moon face"
- O famoso "puff buff" — grande mas borrado

**Dianabol:**
- Aromatiza AINDA mais que testo
- "Fonte de água nojenta" — palavras do GH15
- Ganho rápido de peso (80% água)
- Perde tudo em 2-3 semanas após parar

**O que os veteranos sabem:**
Se quer PARECER bodybuilder (não apenas ser grande), o protocolo é:
- Testosterona base BAIXA (200-300mg/sem)
- Trembolona Acetato 300-400mg/sem
- Primobolan 400-600mg/sem OU Masteron
- GH se >30 anos

O GH15 dizia: "coloque alguém em Primo + Tren + GH com Testo mínima e sem orais — em 3 meses, todo mundo em volta vai PARAR pra olhar. Ele vai parecer uma escultura andando."

A diferença é: Testo + Dbol te fazem GRANDE. Tren + Primo te fazem BONITO.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Mas pra primeiro ciclo não é inseguro já partir pra Trembolona? Li que é muito agressivo.',
      userId: userIds['user_perf_danilo'],
      isAIResponse: false
    },
    {
      content: `Danilo, CORRETO. Trembolona NÃO é pra primeiro ciclo. A progressão inteligente é:

1. **Primeiro ciclo:** Testosterona Enantato 300-400mg/sem, 12 semanas. Entender como seu corpo responde a androgênios.

2. **Segundo ciclo:** Testo 300mg + Primobolan 400mg (ou Masteron se prefere algo mais barato). Notar a diferença na qualidade vs testo isolada.

3. **Terceiro ciclo+:** Aí sim, se souber o que está fazendo, introduz Tren em dose baixa (200mg/sem) e avalia tolerância.

A maioria erra empilhando tudo no primeiro ciclo e nunca sabe o que cada composto faz isoladamente.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Verdade. Meu primeiro ciclo foi só Testo 400mg/sem por 12 semanas. Ganhei 7kg de músculo limpo e entendi meu corpo. No segundo adicionei Primo e a diferença na qualidade foi absurda — mais seco, mais vascular, quase sem retenção.',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },
    {
      content: `INSIGHT: Progressão farmacológica inteligente = um composto por vez para entender resposta individual. Combinações de alto risco (Tren, orais) devem ser reservadas para usuários experientes com exames regulares.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 15: PRIMOBOLAN — O PADRÃO OURO (GH15 BIBLE)
    // Ref: GH15 — "legit primobolana and trenbolona... with hgh...
    // with minimal testosterona... see what happen to that fella"
    // ============================================================
    {
      content: 'Dr. Marcus, por que Primobolan é tão caro e tão procurado? Vi que era o favorito do Arnold. Vale o investimento?',
      userId: userIds['user_perf_rafael'],
      isAIResponse: false
    },
    {
      content: `Rafael, Primobolan (Metenolona) é o AAS mais elegante que existe. Por quê:

**PRÓS:**
- NÃO aromatiza → zero retenção hídrica estrogênica
- Melhora na qualidade muscular sem alterar peso drasticamente
- Colaterais brandos (mais seguro que quase todos)
- Manutenção de nitrogênio durante déficit calórico
- Não é hepatotóxico (forma injetável)
- Não altera humor significativamente

**CONTRAS:**
- CARO — R$300-600 por ampola
- Dose necessária é ALTA (400-800mg/semana para resultados visíveis)
- Altamente falsificado (muitos "Primos" são Boldenona rotulada)
- Supressão do eixo ainda ocorre (menos que outros, mas ocorre)

**Por que era o favorito da era clássica:**
Arnold, Zane, Sergio, Labrada — todos usavam Primo como base. O GH15 batia nessa tecla: a era clássica parecia MELHOR porque usavam compostos que não retêm água. Testo + Dbol + Deca = massa borrada. Primo + Tren + GH = escultura.

**Protocolo padrão:**
- Primo Enantato 600mg/semana (mínimo funcional)
- Testo Enantato 200mg/semana (base TRT)
- 16-20 semanas (precisa de tempo pra Primo agir)

**Regra:** Se seu "Primo" custa menos de R$200/ampola e está vindo como "Primobolan Depot" de algum UGL, provavelmente é Boldenona. Teste em laboratório.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Primobolan oral (Metenolona Acetato) vale a pena ou é jogar dinheiro fora?',
      userId: userIds['user_perf_rafael'],
      isAIResponse: false
    },
    {
      content: `Primo oral tem baixíssima biodisponibilidade. Precisaria de 100-150mg/dia pra equiparar a 600mg/semana injetável. Custo astronômico. A versão injetável é MUITO superior custo-benefício. O oral só faz sentido pra quem tem fobia de agulha e dinheiro sobrando — e mesmo assim, Oxandrolona seria escolha melhor.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `NOTA: Metenolona (Primobolan) é classificada como Classe III nos EUA e substância controlada no Brasil. Falsificação é extremamente comum neste mercado.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 16: PCT — É REALMENTE NECESSÁRIO? (GH15 BIBLE)
    // Ref: GH15 — "pct is garbage!... you dont look like bodybuild
    // if you stop aas"
    // ============================================================
    {
      content: 'Pergunta que gera guerra: PCT (terapia pós-ciclo) é realmente necessária? Ou é mito da indústria de suplementos?',
      userId: userIds['user_perf_carlos'],
      isAIResponse: false
    },
    {
      content: `Carlos, essa é uma das maiores guerras filosóficas do underground. Vou dar os dois lados:

**LADO "PCT É OBRIGATÓRIA":**
- Após cessar AAS, o eixo HPT está suprimido
- Sem PCT: LH e FSH demoram meses pra normalizar
- Risco de atrofia testicular permanente
- SERMs (Tamoxifeno 20mg, Clomifeno 50mg) estimulam LH/FSH
- HCG 1000-2000 UI durante o ciclo mantém testículos ativos

**LADO "PCT É LIXO" (posição GH15):**
- Se você parar de usar AAS, vai perder quase tudo
- PCT recupera eixo mas não mantém os ganhos
- O resultado final é: 6 semanas de PCT pra voltar a produzir o que produzia antes — e perder 80% do ganho
- A verdadeira solução é: ou assume que vai usar pra sempre (blast & cruise) ou nunca comece

**MINHA POSIÇÃO:**
PCT é medicamente necessária se a pessoa DECIDIR parar de usar. É irresponsável cessar AAS sem recuperação do eixo. MAS — e aqui o GH15 tinha razão — ninguém que experimentou o tamanho real consegue voltar ao natural. A realidade é que a maioria que "faz PCT" volta a ciclar em 3-6 meses.

**PCT PROTOCOLO (se for parar):**
- Semana 1-2 pós-último éster: HCG 2000 UI EOD
- Semana 3-6: Tamoxifeno 20mg/dia + Clomifeno 50mg/dia
- Semana 7-8: Tamoxifeno 10mg/dia
- Exames: Testo total, LH, FSH, estradiol a cada 4 semanas

Se após 3 meses os valores não normalizaram, considerar TRT definitiva.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'E o blast & cruise — é mais seguro que ciclar com PCT?',
      userId: userIds['user_perf_carlos'],
      isAIResponse: false
    },
    {
      content: `Blast & cruise (alternar entre doses altas e dose TRT) evita a montanha-russa hormonal dos ciclos on/off/PCT. Mas requer compromisso VITALÍCIO com reposição.

Benefícios: menos oscilação hormonal, manutenção dos ganhos, sem a depressão do PCT.

Riscos: você NUNCA mais volta ao natural. Eixo HPT desliga permanentemente após uso prolongado. É uma decisão que muitos tomam aos 25 e se arrependem aos 40.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `PONTO MÉDICO: Recuperação do eixo HPT varia enormemente por indivíduo. Fatores: duração do uso, compostos utilizados (19-nor são piores), idade, genética. Exames regulares pós-ciclo são OBRIGATÓRIOS.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 17: BOLDENONA (EQ) — APETITE E HEMÁCIAS
    // ============================================================
    {
      content: 'Dr. Marcus, Boldenona (Equipoise) parece ser um composto intermediário — nem tão forte quanto Tren, nem tão suave quanto Primo. Onde ela se encaixa?',
      userId: userIds['user_perf_gustavo'],
      isAIResponse: false
    },
    {
      content: `Gustavo, Boldenona é o "composto de suporte" por excelência. Características:

**EFEITOS PRINCIPAIS:**
- Aumento SIGNIFICATIVO de apetite (vantagem em bulking, problema em cutting)
- Aumento de eritropoiese (hemácias) → mais oxigenação → resistência cardiovascular
- Ganho muscular gradual e de qualidade
- Retenção hídrica baixa-moderada
- Vascularização aumentada

**DOSAGEM:** 400-800mg/semana. Éster undecanoato = meia-vida LONGA (~14 dias). Precisa de 6-8 semanas pra saturar. Ciclos curtos são inúteis.

**PROBLEMAS:**
- Hematócrito sobe MUITO — risco de policitemia. Doar sangue regularmente.
- Metabólito detectável até 18 meses em doping test
- Ansiedade em dose alta (algumas pessoas reportam)
- O aumento de apetite pode sabotar um cutting

**ONDE SE ENCAIXA:**
Off-season como base anabólica: Testo 500 + EQ 600 + GH 4 UI = massa limpa progressiva. Era o segundo composto favorito do Vince Taylor — 1.800mg/semana no ciclo dele.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Fiz exame com hematócrito 54% depois de 10 semanas de Boldenona 600mg. Meu médico surtou. É perigoso mesmo?',
      userId: userIds['user_perf_gustavo'],
      isAIResponse: false
    },
    {
      content: `Gustavo, 54% é ALTO. Normal masculino é 40-50%. Acima de 54% o sangue fica viscoso — risco de trombose, AVC, embolia pulmonar.

**Protocolo imediato:**
1. Doar sangue (450mL remove ~2-3% de hematócrito)
2. Hidratação agressiva (3-4L água/dia)
3. Aspirina 100mg/dia como antiagregante plaquetário
4. Reduzir ou suspender Boldenona
5. Re-exame em 2 semanas

**Prevenção:** Com qualquer AAS que aumente hemácias (Boldenona, Anadrol, Testo alta), monitorar hematócrito a cada 6-8 semanas. Doar sangue a cada 8-12 semanas profilaticamente.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `ALERTA DE SAÚDE: Policitemia (hematócrito elevado) é um risco real com AAS, especialmente Boldenona. Monitoramento regular e doação de sangue são medidas de redução de danos essenciais.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 18: CLEMBUTEROL — PROTOCOLOS E RISCOS
    // ============================================================
    {
      content: 'Clembuterol para cutting — funciona ou é superestimado? E os riscos cardíacos são reais?',
      userId: userIds['user_perf_patricia'],
      isAIResponse: false
    },
    {
      content: `Patricia, Clembuterol é um agonista beta-2 adrenérgico. Funciona? SIM, mas com nuances:

**MECANISMO:**
- Ativa receptores β2 → termogênese + lipólise
- Efeito anticatabólico leve
- Aumento da taxa metabólica em ~10-15%

**PROTOCOLOS:**
1. **Escada:** 20mcg → sobe 20mcg a cada 2-3 dias → max 120-160mcg → desce
2. **2 semanas on/2 off:** Evita downregulation de receptores
3. **Com Ketotifeno:** 1mg de Ketotifeno à noite permite uso contínuo por up-regulating β2

**RISCOS CARDÍACOS — SIM, SÃO REAIS:**
- Taquicardia sustentada (FC 100-120 bpm em repouso)
- Hipertrofia ventricular esquerda (documentada em animais, sugerida em humanos)
- Arritmias (especialmente com eletrólitos desbalanceados)
- Hipocalemia (depleta potássio → câimbras + risco cardíaco)
- Tremor fino nas mãos
- Insônia severa

**COMBINAÇÕES PERIGOSAS:**
Clenbuterol + T3 + Efedrina + Tren = cocktail cardiotóxico. O coração bate a 130bpm o dia inteiro enquanto você se desidrata. É assim que pros morrem.

**ALTERNATIVA MAIS SEGURA:** Salbutamol (albuterol) oral — mesma classe, meia-vida mais curta, menos cardiotoxicidade.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Eu usei Clen uma vez — 80mcg e meu coração parecia que ia sair do peito. Tremor nas mãos que não conseguia escrever. Nunca mais.',
      userId: userIds['user_perf_amanda'],
      isAIResponse: false
    },
    {
      content: 'Amanda, isso é comum. A sensibilidade individual varia enormemente. Algumas pessoas toleram 120mcg de olhos fechados, outras não passam de 40mcg. Se 80mcg causou taquicardia severa, Clen NÃO é pra você. Suplementar taurina 3-5g/dia e potássio ajuda nos tremores, mas se o coração não tolera, NÃO force.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `SEGURANÇA: Clembuterol tem índice terapêutico estreito. Monitorar FC e pressão arterial. Suplementar: taurina 3-5g, potássio, magnésio. Alternativa com menor risco cardíaco: salbutamol.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 19: T3/T4 — TIREOIDE E METABOLISMO
    // ============================================================
    {
      content: 'Pessoal, T3 (liotironina) pra acelerar metabolismo em cutting — vale a pena? Quanto de massa muscular se perde?',
      userId: userIds['user_perf_lucas'],
      isAIResponse: false
    },
    {
      content: `Lucas, T3 é uma ferramenta poderosa mas MAL entendida:

**O QUE FAZ:**
- Aumenta metabolismo basal em 15-30% (dose-dependente)
- Potencializa lipólise
- MAS TAMBÉM aumenta catabolismo proteico

**POR QUE BODYBUILDERS USAM:**
Com AAS + GH no sistema, o catabolismo proteico é parcialmente contrabalançado. Então eles podem "queimar gordura mais rápido sem perder músculo" — mas isso SÓ funciona com o stack completo.

**T3 SOZINHO (sem AAS):**
- Você PERDE músculo junto com gordura
- Ratio é ~50-50 em dose alta sem proteção anabólica
- É a PIOR escolha pra natural que quer secar

**PROTOCOLO (se protegido por AAS):**
- Começar 25mcg/dia, subir 12.5mcg a cada semana
- Max: 50-75mcg/dia (>75mcg = muito catabólico)
- NÃO parar de uma vez — reduzir gradualmente (tireóide precisa retomar produção)
- Duração: 6-8 semanas máximo

**PERIGO REAL:**
Se usar T3 por muito tempo em dose alta, pode causar supressão da tireoide endógena. Em teoria, é reversível. Na prática, algumas pessoas nunca recuperam 100% da função tireoideana.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'E T4 (levotiroxina) seria uma alternativa mais segura? Vi gente recomendando.',
      userId: userIds['user_perf_lucas'],
      isAIResponse: false
    },
    {
      content: 'T4 é o pró-hormônio. Precisa ser convertido em T3 pela deiodinase. É mais suave, mais controlável, menos catabólico. Mas também menos potente pra queima de gordura. Na prática, quem quer resultado rápido usa T3. Quem quer segurança, T4 em dose moderada (100-150mcg) substitui razoavelmente. Exames de TSH, T3 livre e T4 livre a cada 4 semanas são obrigatórios.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 20: OXANDROLONA — USO FEMININO
    // ============================================================
    {
      content: 'Sou mulher, 32 anos, treino há 6 anos. Minha coach sugeriu Oxandrolona 10mg/dia pra "dar aquele up". É seguro? Quais os riscos reais pra mulheres?',
      userId: userIds['user_perf_patricia'],
      isAIResponse: false
    },
    {
      content: `Patricia, Oxandrolona é o AAS mais popular entre mulheres, mas "mais seguro" não significa "seguro":

**POR QUE MULHERES USAM:**
- Androgênico BAIXO (relativo a outros AAS)
- Ganho de força significativo
- Perda de gordura (especialmente abdominal)
- Não aromatiza (sem retenção estrogênica)
- Resultados rápidos em 4-6 semanas

**RISCOS REAIS (que coach de Instagram NÃO te conta):**
1. **Virilização:** Voz mais grave, clitóris aumentado, acne, pelos faciais. Em dose baixa é raro mas POSSÍVEL. E muitos efeitos são IRREVERSÍVEIS.
2. **Perfil lipídico:** HDL despenca (até -50%). LDL sobe. Oral = primeiro passo hepático.
3. **Ciclo menstrual:** Pode irregularizar ou cessar.
4. **Acne:** Muito comum mesmo em dose baixa.
5. **Queda de cabelo:** Se tiver predisposição genética, Oxandrolona pode acelerar alopécia.

**DOSE SEGURA (relativa):**
- 5-10mg/dia por 6-8 semanas MAX
- Exames antes, durante e depois: lipidograma, função hepática, testosterona total e livre
- AO PRIMEIRO sinal de virilização (voz, clitóris) → PARAR IMEDIATAMENTE

**ALTERNATIVA:** Se o objetivo é performance sem riscos androgênicos, SARM como Ostarine (MK-2866) tem perfil mais seguro — embora também não seja isento de riscos.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Uma amiga minha usou 20mg/dia por 12 semanas (recomendação do "coach"). A voz dela engrossou permanentemente. Está destruída emocionalmente. Eu tinha medo disso.',
      userId: userIds['user_perf_patricia'],
      isAIResponse: false
    },
    {
      content: '20mg por 12 semanas em mulher é ABSURDO. Isso é negligência profissional. 5mg por 6 semanas já é agressivo pra muitas mulheres. O problema é coach sem formação que trata mulher como "homem em dose menor". Endocrinologia feminina é completamente diferente.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `ALERTA: Virilização em mulheres por AAS pode ser irreversível (engrossamento vocal, hipertrofia clitoriana). Doses devem ser MÍNIMAS e duração CURTA. Monitoramento rigoroso é obrigatório. Qualquer sinal de virilização = interrupção imediata.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 21: DIURÉTICOS — ÚLTIMA SEMANA DE COMPETIÇÃO
    // ============================================================
    {
      content: 'Como funciona a manipulação de água e diuréticos na última semana antes de subir no palco? Vi que é onde mais erros acontecem.',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },
    {
      content: `Thiago, a "peak week" é onde shows são GANHOS e PERDIDOS. E diuréticos são a ferramenta mais perigosa:

**PROTOCOLO CLÁSSICO DE PEAK WEEK:**

1. **7 dias antes:** Água alta (6-8L/dia), carboidrato reduzido, sódio alto
2. **4-5 dias antes:** Water load máximo (8-10L/dia) → corpo "aprende" a excretar rápido
3. **2 dias antes:** Corta água para 1-2L. Corpo continua excretando por inércia → seca
4. **1 dia antes:** Carb load (500-700g) → glicogênio puxa água PARA DENTRO do músculo
5. **Dia do show:** Última refeição = arroz branco + mel. Sódio moderado.

**DIURÉTICOS USADOS:**
- **Furosemida (Lasix):** Loop diurético. BRUTAL. Puxa água de todos os compartimentos. Risco: hipocalemia, câimbra cardíaca.
- **Espironolactona (Aldactone):** Poupador de potássio. Mais suave. Anti-androgênico (colateral).
- **Hidroclorotiazida:** Tiazídico. Moderado.

**ONDE DÁ ERRADO:**
- Excesso de Lasix = desidratação → câimbra → hospital
- Cortou água demais = flat (músculos sem volume)
- Carbou demais = spillover (água subcutânea volta)
- Sódio errado = fica borrado no palco

Andreas Münzer morreu em 1996 por falência múltipla após manipulação extrema de diuréticos + drogas. Tinha 0% de gordura subcutânea. O corpo simplesmente desligou.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Na prática, quão perigoso é usar Lasix sem supervisão?',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },
    {
      content: `Lasix é o segundo composto mais perigoso depois da insulina no bodybuilding. 20mg de Lasix puxa 2-3 litros de água em horas. Potássio vai junto. Coração precisa de potássio pra bater. A equação é simples: Lasix + desidratação + baixo potássio = arritmia cardíaca = morte.

Se INSISTIR: ter suplementação de potássio, banana, água de coco à mão. Nunca mais que 20-40mg. E ter alguém POR PERTO que saiba que você está usando.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO: Mortes documentadas em competições estão frequentemente associadas a manipulação de diuréticos + desidratação extrema. Andreas Münzer (1996) e Mohammed Benaziza (1992) são casos emblemáticos.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 22: WINSTROL — ARTICULAÇÕES vs CONDIÇÃO
    // ============================================================
    {
      content: 'Winstrol (Stanozolol) pra competição — vi que seca muito mas mata as articulações. É verdade?',
      userId: userIds['user_perf_igor'],
      isAIResponse: false
    },
    {
      content: `Igor, Stanozolol é uma faca de dois gumes:

**PRÓS:**
- Não aromatiza → zero retenção estrogênica
- Endurecimento muscular visual impressionante
- Reduz SHBG → mais testosterona livre
- Efeito de "secar" a pele sobre o músculo

**CONTRAS:**
- **Articulações:** Reduz líquido sinovial. Se já tem problema articular, Winstrol transforma em INFERNO. Joelhos, ombros, punhos — tudo range.
- **Hepatotoxicidade:** C-17-alfa-alquilado = primeiro passo hepático. TGO/TGP disparam.
- **Perfil lipídico:** Devasta HDL tanto quanto Tren ou Oxandrolona.
- **Tendões:** Colágeno enfraquece. Risco de ruptura tendínea aumenta.

**USO INTELIGENTE:**
- Apenas últimas 4-6 semanas pré-show para endurecimento final
- NUNCA em bulk (articulações secas + treino pesado = lesão garantida)
- Dose: 50mg/dia (injetável preferível ao oral — menos hepatotoxicidade)
- Combinar com Nandrolona em dose baixa alivia as articulações

É o composto que muitos usam pra "aquele look final" — mas o custo nas articulações é real e muitas vezes irreversível.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Usei Winstrol 50mg oral por 8 semanas. Meu joelho esquerdo nunca mais foi o mesmo. Faz 2 anos e ainda incomoda. Não vale a pena.',
      userId: userIds['user_perf_pedro'],
      isAIResponse: false
    },
    {
      content: 'Pedro, caso clássico. 8 semanas de oral é muito tempo — o dano articular se acumula. O efeito visual é temporário, o dano é permanente. Composto pra uso CIRÚRGICO (curto e preciso), não pra ciclos longos.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 23: MASTERON — DHT E PRÉ-COMPETIÇÃO
    // ============================================================
    {
      content: 'Masteron (Drostanolona) — parece ser o "segredo" pra condição pré-show. Qual a diferença real em relação a Winstrol na preparação?',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: `Renato, Masteron é o anti-estrógeno ANABÓLICO. Diferenças vs Winstrol:

**MASTERON:**
- Derivado de DHT → ação anti-estrogênica (compete com estradiol no receptor)
- Endurecimento muscular SEM secar articulações
- Sensação de bem-estar (efeito no SNC)
- Injetável apenas → sem hepatotoxicidade
- Vince Taylor usava 200mg DIÁRIO (!!)

**WINSTROL:**
- C-17-alfa → hepatotóxico
- Seca articulações brutalmente
- Disponível oral e injetável
- Visual mais "crepado" mas com custo articular

**NA PRÁTICA:**
Masteron é SUPERIOR a Winstrol em quase tudo exceto custo. É por isso que profissionais preferem Masteron. O endurecimento é comparável, mas sem destruir articulações.

**LIMITAÇÃO:** Masteron só "funciona visualmente" se você já está MAGRO (<10% BF). Em alguém com 15% não faz diferença visual nenhuma — não é um queimador de gordura, é um "finalizador".

**DOSE:** Propionato 300-500mg/sem ou Enantato 400-600mg/sem. Últimas 6-8 semanas de prep.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Faz sentido combinar Masteron + Tren nas últimas semanas?',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: 'Renato, é literalmente O combo mais popular pré-show entre competidores sérios. Tren queima gordura e reparticiona. Masteron endurece e dá anti-estrógeno. Juntos = condição brutal. Adicione Testo base baixa (150-200mg) e você tem o stack de prep clássico de 90% dos competidores NPC/IFBB.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 24: DNP — O TERMOGÊNICO MAIS PERIGOSO
    // ============================================================
    {
      content: 'Alguém já usou DNP (2,4-dinitrofenol)? Sei que é considerado o termogênico mais forte que existe mas também o mais perigoso.',
      userId: userIds['user_perf_danilo'],
      isAIResponse: false
    },
    {
      content: `Danilo, DNP merece uma discussão especial porque é LITERALMENTE veneno industrial usado como termogênico.

**O QUE É:**
DNP é um desacoplador mitocondrial. Ele curto-circuita a cadeia de transporte de elétrons — energia que deveria virar ATP vira CALOR. Seu corpo vira um forno.

**EFICÁCIA:**
- Perda de gordura de 0.5-1kg por DIA em dose alta
- NADA no planeta é mais eficiente pra queima de gordura pura
- Não é anticatabólico nem anabólico — queima tudo

**POR QUE MATA:**
1. **Hipertermia:** Sua temperatura corporal sobe 1-3°C. Em dose alta ou ambiente quente, pode subir a 40-42°C → falência orgânica → morte
2. **NÃO TEM ANTÍDOTO.** Se tomou demais, NINGUÉM pode fazer nada. Meia-vida de 36h. Você queima vivo de dentro pra fora.
3. **Catarata:** Documentada em 1-2% dos usuários
4. **Neuropatia periférica**
5. **Erupções cutâneas alérgicas**

**DOSE "USADA" (NÃO RECOMENDO):**
- 200mg/dia por 2-3 semanas é considerado "conservador"
- >400mg/dia = zona de perigo real
- Suor profuso, insônia total, letargia extrema são "normais"

**MORTES DOCUMENTADAS:**
Dezenas. Uma mulher de 21 anos morreu em 2013 no UK com 200mg. Um homem de 30 morreu em 2018 nos EUA com 600mg. Sensibilidade individual torna QUALQUER dose potencialmente letal.

EU CATEGORICAMENTE NÃO RECOMENDO DNP EM NENHUMA CIRCUNSTÂNCIA.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Meu Deus. Sem antídoto mesmo? E ainda assim tem gente que usa?',
      userId: userIds['user_perf_danilo'],
      isAIResponse: false
    },
    {
      content: 'Sem antídoto. A única coisa que o hospital pode fazer é banho de gelo, fluidos intravenosos e rezar. O DNP tem meia-vida de 36h — cada dose se acumula sobre a anterior. É por isso que mortes geralmente acontecem no dia 3-4 de uso, quando a concentração acumula.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `ALERTA MÁXIMO: DNP (2,4-dinitrofenol) é classificado como pesticida industrial. NÃO é aprovado para consumo humano em NENHUM país. Mortes documentadas incluem jovens saudáveis. NÃO EXISTE antídoto para overdose.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 25: CONDITIONED SIZE vs MASS MONSTER (GH15 BIBLE)
    // Ref: GH15 — "200lb 6% can be achievable... this is what
    // bodybuild is... they also dont die from abuse"
    // ============================================================
    {
      content: 'Filosoficamente: o bodybuilding deveria ser sobre estética (conditioned size) ou sobre ser o maior possível (mass monster)?',
      userId: userIds['user_perf_rafael'],
      isAIResponse: false
    },
    {
      content: `Rafael, essa é A questão filosófica do bodybuilding moderno. E o GH15 tinha posição clara:

**CONDITIONED SIZE (200lb/90kg, 6%):**
- Era dos 70s-80s: Zane 185lb, Arnold 235lb, Labrada 195lb
- Estética, proporções, linhas claras
- Alcançável com AAS + dieta + genética boa
- Sem insulina, sem GH em dose alta
- Saúde relativamente preservada
- O público LEIGO acha bonito

**MASS MONSTER (250-300lb, 4-6%):**
- Era dos 2000s+: Coleman 300lb, Yates 270lb
- Volume tridimensional absurdo
- REQUER GH + insulina + tudo mais
- Gut distention (barriga de GH)
- Mortalidade precoce
- O público leigo acha BIZARRO

**O GH15 defendia:** 200lb (90kg) a 6% é o pico da estética masculina. Pode ser alcançado com Tren Acetato + pouca Testosterona + GH opcional se >30 anos + Primo ou Boldenona. Sem insulina, sem doses absurdas. É o que ele chamava de "conditioned size" — quando você anda na rua e TODOS percebem que você é bodybuilder, mas ninguém se assusta.

**REALIDADE:** Os juízes premiam tamanho. Big Ramy ganhou Olympia com 300lb. Mas morre mais cedo que Zane, que está vivo e saudável aos 80+. A escolha é individual, mas os dados são claros.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Frank Zane com 80+ anos ainda tem shape. Big Ramy com 40 já parece acabado. Os números falam por si.',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: 'Exatamente. Longevidade vs tamanho. O bodybuilding moderno escolheu tamanho. A conta chegou em forma de funerais precoces. Classic Physique está crescendo como categoria justamente por isso — é um retorno à estética.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `PERSPECTIVA: O debate estética vs tamanho reflete a tensão entre saúde e performance extrema em qualquer esporte. Categoria Classic Physique (limite ~100kg) representa um movimento de retorno à estética com protocolos menos agressivos.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 26: CUSTO REAL DE UM CICLO PROFISSIONAL
    // ============================================================
    {
      content: 'Vamos ser práticos: quanto custa REALMENTE um ciclo de bodybuilding, desde amador até pro?',
      userId: userIds['user_perf_bruno'],
      isAIResponse: false
    },
    {
      content: `Bruno, transparência total:

**CICLO INICIANTE (Testo only):**
- Testosterona Enantato: R$150-300/mês
- Tamoxifeno (PCT): R$50
- Exames sangue: R$300-500
- **Total: R$500-800/ciclo de 12 semanas**

**CICLO INTERMEDIÁRIO (Testo + Primo/Tren):**
- Testosterona: R$150-300/mês
- Primobolan: R$1.200-2.400/mês (se legítimo)
- Ou Trembolona Acetato: R$300-600/mês
- Exames: R$500-800
- Suporte (IA, cabergolina): R$100-200
- **Total: R$2.000-4.000/ciclo de 16 semanas**

**CICLO COMPETIDOR (stack completo):**
- Testo + Tren + Masteron + oral: R$1.500-3.000/mês
- GH pharma grade 8-10 UI: R$3.000-8.000/mês
- GH genérico bom: R$800-1.500/mês
- Insulina: R$50-100/mês (barato é o veneno)
- Exames completos: R$800-1.200
- Suporte (IA, caber, hepatoprotetores): R$300-500/mês
- **Total: R$5.000-12.000/mês**

**CICLO PROFISSIONAL IFBB (topo):**
- Tudo acima multiplicado por 3-5x em doses
- GH pharma 18-20 UI: R$10.000-25.000/mês
- Insulina variada: R$200-400/mês
- Coaching + nutricionista: R$2.000-5.000/mês
- Exames premium: R$1.500-3.000
- **Total: R$15.000-35.000/mês**

É por isso que a maioria dos pros está endividada, vendendo ciclos ou fazendo personal training em massa. O esporte não paga o suficiente pra sustentar o que cobra.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'R$35.000 POR MÊS? E o prêmio do Mr. Olympia é quanto?',
      userId: userIds['user_perf_bruno'],
      isAIResponse: false
    },
    {
      content: 'Mr. Olympia 2025 pagou $400k (~R$2.4 milhões) ao campeão. Parece muito, mas divida por 12 meses de prep a R$30k/mês = R$360k só em drogas. Sem contar alimentação (~R$3-5k/mês pra 5.000-8.000 kcal/dia), viagens, inscrição. O lucro real de um campeão é menor do que parece. Pros fora do top 5 muitas vezes PERDEM dinheiro competindo.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 27: SITE INJECTIONS — MITO OU REALIDADE
    // ============================================================
    {
      content: 'Site injections (aplicar no músculo alvo) realmente ajudam no crescimento localizado ou é mito?',
      userId: userIds['user_perf_igor'],
      isAIResponse: false
    },
    {
      content: `Igor, site injections são DIFERENTES de synthol. Confundir os dois é erro comum.

**SITE INJECTION (com AAS/GH):**
- Aplica o composto intramuscular no músculo que quer priorizar
- Concentração LOCAL do hormônio é maior
- Efeito: estímulo LIGEIRAMENTE maior na síntese proteica local
- IGF-1 intramuscular é dose-dependente de concentração local
- Profissionais fazem isso sistematicamente em braços, deltóides, panturrilhas
- Vince Taylor era conhecido por aplicar em braços e panturrilhas

**SYNTHOL (óleos de posing):**
- Óleo puro (MCT + benzyl alcohol + lidocaína)
- NÃO é hormonal — é apenas volume físico
- Cria "bolhas" de óleo dentro do músculo
- Resultado: aparência artificial, inflada
- Risco: embolia, infecção, necrose
- É fraude estética, não crescimento real

**VEREDICTO:**
Site injections com AAS em óleo têm lógica farmacológica — mais hormônio no local = mais estímulo. Mas o efeito é SUTIL — estamos falando de diferença de 5-10%, não de transformação. A maioria do crescimento vem da dose total sistêmica + treino.

O que NÃO funciona: aplicar synthol pra "encher" um músculo fraco. O mercado underground está cheio de "óleo de posing" vendido como se fosse anabólico. É puro scam.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'E os vídeos de caras com braços enormes mas deformados? Tipo o Kirill Tereshin (Synthol Kid)?',
      userId: userIds['user_perf_igor'],
      isAIResponse: false
    },
    {
      content: 'Igor, aquilo é distúrbio dismórfico corporal + synthol em litros. Não tem nada a ver com bodybuilding. O cara quase perdeu os braços por necrose. É o extremo da doença mental que esse esporte pode alimentar quando combinado com dismorfia.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 28: METFORMINA — ANTI-AGING E SENSIBILIDADE A INSULINA
    // ============================================================
    {
      content: 'Metformina tá virando "droga anti-aging" no Vale do Silício. Tem base científica ou é hype?',
      userId: userIds['user_perf_juliana'],
      isAIResponse: false
    },
    {
      content: `Juliana, Metformina é um dos compostos mais interessantes na interseção de longevidade e performance:

**O QUE FAZ:**
- Ativa AMPK → melhora sensibilidade a insulina
- Reduz glicose hepática → menos insulina basal
- Efeito mimético de restrição calórica (mTOR downregulation)
- Anti-inflamatório leve (reduz CRP, TNF-α)
- Potencial efeito antitumoral (dados epidemiológicos)

**PARA BODYBUILDERS:**
- Melhora particionamento de nutrientes (mais pra músculo, menos pra gordura)
- Combate resistência insulínica causada por GH
- Protege parcialmente contra diabetes tipo 2 induzida por GH + slin exógena
- Bryan Johnson e outros biohackers usam 500-1000mg/dia

**CONTRAS:**
- Desconforto gastrointestinal (10-30% dos usuários)
- Reduz absorção de B12 (suplementar)
- Pode REDUZIR ganhos de hipertrofia (via inibição de mTOR — o estudo da meta-análise de 2019)
- Não é mágica — o efeito anti-aging é de 10-15% de melhora em biomarcadores

**MINHA OPINIÃO:**
Para biohacking/longevidade em dose baixa (500mg/dia) com monitoramento de HbA1c e B12 = risco-benefício favorável após 35-40 anos. Para bodybuilder em fase de crescimento = pode ser contraproducente. Timing importa.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Então pra quem usa GH, Metformina seria quase obrigatória pra proteger contra resistência insulínica?',
      userId: userIds['user_perf_juliana'],
      isAIResponse: false
    },
    {
      content: 'Sim, é exatamente assim que muitos usam. GH em dose alta cria resistência insulínica → Metformina 500-1000mg contrabalança → permite usar GH por mais tempo sem virar pré-diabético. É uma ferramenta de harm reduction no contexto farmacológico.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO CIENTÍFICO: O estudo TAME (Targeting Aging with Metformin) é o primeiro trial clínico a testar metformina especificamente como droga anti-aging. Resultados preliminares sugerem benefícios em biomarcadores inflamatórios. Uso off-label é crescente.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 29: ECA STACK — EFEDRINA, CAFEÍNA, ASPIRINA
    // ============================================================
    {
      content: 'ECA Stack (Efedrina + Cafeína + Aspirina) ainda é relevante em 2026? Ou foi completamente superado?',
      userId: userIds['user_perf_carlos'],
      isAIResponse: false
    },
    {
      content: `Carlos, ECA é um dos termogênicos mais estudados da história e AINDA funciona:

**PROTOCOLO CLÁSSICO:**
- Efedrina 25mg + Cafeína 200mg + Aspirina 81mg
- 2-3x ao dia
- Duração: 4-8 semanas com 2 semanas off

**EFICÁCIA:**
- Aumento de ~8-10% na taxa metabólica
- Supressão de apetite significativa
- Efeito sinérgico real (E+C juntos > separados)

**COMPARAÇÃO COM ALTERNATIVAS:**
- Clembuterol: mais potente na termogênese, mais cardiotóxico
- Salbutamol: similar à efedrina, menos estimulante no SNC
- Yohimbina: complementar (agonista α2 antagonista), funciona em jejum

**STATUS LEGAL:**
Efedrina é restrita/banida em muitos países. No Brasil, Franol (associação com teofilina) era usado como fonte mas foi limitado. Encontrar efedrina pura é difícil legalmente.

**RISCOS:**
- Hipertensão (monitorar PA diariamente)
- Taquicardia
- Ansiedade, insônia
- Tremores
- Contraindicado para quem tem problema cardíaco

O GH15 mencionava que Vince Taylor usava efedrina no prep. É old school mas eficaz. O problema é acesso legal e riscos cardiovasculares em quem já usa AAS.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Aspirina no stack é realmente necessária?',
      userId: userIds['user_perf_carlos'],
      isAIResponse: false
    },
    {
      content: 'Não. A aspirina foi incluída originalmente para inibir prostaglandinas que atenuam o efeito da efedrina. Na prática, estudos posteriores mostraram que E+C sem aspirina tem eficácia IGUAL. A aspirina só adiciona risco de irritação gástrica. EC stack é suficiente.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 30: DIETA SUSHI PARA COMPETIÇÃO (GH15 BIBLE)
    // Ref: GH15 — "i can and did prep fellas to shows on sushi...
    // yes sushi and white rice to shows"
    // ============================================================
    {
      content: 'Dr. Marcus, vi uma referência do GH15 dizendo que preparava competidores com dieta de SUSHI. Isso é sério ou era piada?',
      userId: userIds['user_perf_amanda'],
      isAIResponse: false
    },
    {
      content: `Amanda, era SÉRIO. E ilustra um ponto fundamental que a indústria fitness NÃO quer que você entenda:

**A TESE DO GH15:**
"Dieta não importa tanto quanto hormônios. Se Trenbolona, Primobolan e GH estão no sistema, você pode parecer 3 semanas do palco em QUALQUER dia do ano com qualquer dieta razoável."

**O QUE ISSO SIGNIFICA:**
- Sushi = proteína (peixe) + carboidrato (arroz branco) + gordura (abacate, cream cheese)
- São macros COMPLETOS em forma agradável
- Quando os hormônios certos estão trabalhando, o corpo faz o reparticionamento sozinho
- O frango + batata doce + brócolis NÃO é necessário
- O que importa é: déficit calórico + proteína adequada + os compostos certos

**NUANCE IMPORTANTE:**
Isso funciona com pharmacology on board. Natural? Dieta importa MUITO. A diferença é que os hormônios fazem o trabalho pesado de particionamento. Tren especialmente garante que nutrientes vão pro músculo, não pro adipócito, independente da fonte.

**PRÁTICA:**
Nas últimas 4-5 semanas de prep, dieta limpa é necessária pra remover aqueles últimos quilos de gordura subcutânea. Mas até 4-5 semanas out? Sushi, arroz, peixe, carne — qualquer coisa com macros razoáveis funciona se os hormônios estão corretos.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Isso muda completamente minha visão. Então toda aquela neurose de pesar arroz na balança e comer frango insosso é desnecessária se a pessoa está em protocolos farmacológicos?',
      userId: userIds['user_perf_amanda'],
      isAIResponse: false
    },
    {
      content: `Em grande parte, sim. A obsessão com "comida limpa" é um produto da indústria de coaching que precisa justificar R$500/mês de consultoria. O corpo não distingue "frango com batata doce" de "salmão com arroz" se os macros são equivalentes.

MAS — e aqui é importante — isso NÃO significa comer lixo. Sushi é comida de qualidade. A lição é: não precisa sofrer comendo insosso. Precisa ter macros adequados, proteína suficiente e o ambiente hormonal correto.

O GH15 era claro: "Bodybuilding é TODO HORMÔNIOS. Dieta é 10%. Treino é 20%. Hormônios são 70%." Controverso, mas observacionalmente preciso no contexto farmacológico.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO: A ideia de que dieta ultra-restritiva é obrigatória para competidores é amplamente questionada por coaches de elite. Macros importam mais que fonte alimentar. Hormônios determinam particionamento de nutrientes.

NOTA: Para praticantes naturais, a qualidade da dieta tem peso MAIOR na composição corporal.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 31: ANADROL (OXIMETOLONA) — O ORAL MAIS FORTE
    // ============================================================
    {
      content: 'Anadrol (Oximetolona) 50mg — vi que é considerado o oral mais potente pra volume. Como funciona e quais os riscos reais?',
      userId: userIds['user_perf_gustavo'],
      isAIResponse: false
    },
    {
      content: `Gustavo, Anadrol é a BAZUCA dos orais. O composto favorito do Vince Taylor a 200mg/dia (!).

**COMO FUNCIONA:**
- C-17-alfa-alquilado (hepatotóxico)
- Estimula eritropoiese massiva (mais que qualquer outro AAS oral)
- Efeito de volumização muscular rápido por retenção intramuscular
- Ganho de 5-10kg nas primeiras 4 semanas

**PARADOXO DO ANADROL:**
Não aromatiza diretamente, MAS causa efeitos estrogênicos (ginecomastia, retenção). Ninguém sabe exatamente por quê. Teoria: ativa receptor estrogênico diretamente.

**RISCOS:**
- Hepatotoxicidade SEVERA (TGO/TGP >300 é comum)
- Hipertensão por retenção hídrica massiva
- Cefaleia (muito comum, especialmente nos primeiros dias)
- Supressão BRUTAL do eixo
- Lipídios devastados

**DOSE:**
50mg/dia é padrão. 100mg é avançado. 200mg (como Vince Taylor) é insanidade reservada a profissionais sob monitoramento constante. Uso máximo: 4-6 semanas.

**TRUQUE DE COMPETIDOR:**
Anadrol em dose baixa (25-50mg) nas ÚLTIMAS 2 semanas antes do show pra preencher os músculos com volume intramuscular. Muitos pros fazem isso — é o "fullness hack".`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Anadrol vs Dianabol pra volume — qual superior?',
      userId: userIds['user_perf_gustavo'],
      isAIResponse: false
    },
    {
      content: `Anadrol ganha em volume bruto e força. Dianabol ganha em "feel good" (euforia, bem-estar) e é ligeiramente menos tóxico. Na prática: Anadrol pra quem quer ganho AGRESSIVO. Dianabol pra quem quer experiência mais tolerável. Ambos são hepatotóxicos e causam retenção. Nenhum deveria passar de 6 semanas.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `FARMACOLOGIA: Oximetolona (Anadrol) foi desenvolvida para tratar anemia aplástica. Dose terapêutica: 1-5mg/kg/dia. Uso em bodybuilding excede doses clínicas em 3-5x. Monitoramento hepático OBRIGATÓRIO.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 32: GH E O INTESTINO DISTENDIDO (PALUMBOÍSMO)
    // ============================================================
    {
      content: 'A "barriga de GH" é inevitável se usar hormônio do crescimento por muito tempo? Ou existe forma de prevenir?',
      userId: userIds['user_perf_patricia'],
      isAIResponse: false
    },
    {
      content: `Patricia, o "GH gut" ou "palumboísmo" é um dos tópicos mais debatidos.

**O QUE CAUSA:**
1. GH estimula crescimento de TODOS os tecidos — incluindo vísceras (fígado, intestino, rins)
2. Insulina em dose alta potencializa o crescimento visceral
3. Volume absurdo de comida (5.000-10.000 kcal/dia) distende o estômago mecanicamente
4. IGF-1 crônico >500 = hiperplasia celular generalizada

**É INEVITÁVEL?**
- Em dose baixa-moderada (2-4 UI/dia) por tempo limitado: NÃO
- Em dose alta (10-20 UI/dia) por anos: PROVAVELMENTE SIM
- A combinação GH + insulina é o acelerador principal
- Genética influencia (alguns são mais susceptíveis)

**PREVENÇÃO (parcial):**
- Manter GH <6 UI/dia se longevidade importa
- Evitar insulina exógena
- Vacuum training (treino de transverso abdominal) — ajuda esteticamente mas não resolve a causa
- Dieta intermitente (dar "folgas" ao TGI)
- Monitorar volume de órgãos por ultrassom anual

**REALIDADE:**
Olhe os competidores clássicos dos 70s-80s que usavam AAS sem GH — cintura fina, vacuum impecável. Agora olhe os pros atuais com 18 UI de GH diário — barriga projetada mesmo a 4% de BF. A diferença é GH + insulina. Dave Palumbo é o exemplo extremo — o corpo parou de responder aos hormônios mas as vísceras continuaram crescendo.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'O Chris Bumstead (Classic Physique) não tem barriga de GH. Ele usa GH ou não?',
      userId: userIds['user_perf_patricia'],
      isAIResponse: false
    },
    {
      content: 'CBum certamente usa GH, mas provavelmente em dose mais baixa que Open bodybuilders (4-8 UI vs 15-20 UI). Classic Physique tem limite de peso E exigência estética de cintura fina — os competidores são FORÇADOS a moderar doses de GH e insulina. É por isso que Classic está crescendo em popularidade — é o que o público quer ver.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO MÉDICO: Visceromegalia (aumento dos órgãos internos) é efeito documentado de GH crônico suprafisiológico. Em acromegalia clínica, cardiomegalia e hepatomegalia são achados comuns. O mesmo processo ocorre em uso exógeno de GH.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 33: SARMs — PROMESSA vs REALIDADE
    // ============================================================
    {
      content: 'SARMs (moduladores seletivos) — são realmente mais seguros que AAS? Ou é marketing?',
      userId: userIds['user_perf_danilo'],
      isAIResponse: false
    },
    {
      content: `Danilo, SARMs são o GRANDE MARKETING da década passada. Realidade vs promessa:

**A PROMESSA:**
- Seletividade tecidual: ativam receptor androgênico apenas no músculo/osso
- Sem efeitos em próstata, fígado, pele
- Sem aromatização
- O "esteróide seguro"

**A REALIDADE:**
1. Seletividade é PARCIAL, não absoluta. Todos os SARMs suprimem o eixo HPT.
2. Ostarine (MK-2866): 25mg/dia = supressão de testosterona de 30-50%. "Seguro" aonde?
3. LGD-4033 (Ligandrol): Mais potente. Supressão >50%. Hepatotoxicidade reportada.
4. RAD-140 (Testolone): Quase tão supressivo quanto AAS. Casos de hepatite documentados.
5. A maioria dos SARMs vendidos online são FALSIFICADOS — contém pró-hormônios, AAS, ou nada.

**COMPARAÇÃO HONESTA:**
- Ostarine 25mg/dia ≈ Testosterona 150-200mg/semana em ganho muscular
- MAS Testo 150mg/sem é mais barata, mais estudada, e tem PCT estabelecida
- SARMs não são aprovados pela ANVISA ou FDA para nenhum uso
- Zero controle de qualidade no mercado underground

**VEREDICTO:**
SARMs são a "porta de entrada" pra quem tem medo de agulha. O resultado é inferior ao AAS injetável, a supressão do eixo é real, e o mercado é cheio de falsificações. Se vai usar algo, pelo menos use algo ESTUDADO há 60+ anos (testosterona) em vez de algo que existe há 10 anos com zero estudo de longo prazo em humanos.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Mas pra mulheres que não querem virilização, Ostarine não seria opção melhor que Oxandrolona?',
      userId: userIds['user_perf_patricia'],
      isAIResponse: false
    },
    {
      content: 'Patricia, em TEORIA sim — Ostarine 10mg causa menos virilização que Oxandrolona 10mg. Na PRÁTICA, a qualidade do que você compra é questionável. Pode estar tomando qualquer coisa. Pelo menos Oxandrolona farmacêutica (com receita) tem controle de qualidade. SARMs do mercado negro? Zero garantias.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `REGULATÓRIO: SARMs não são aprovados para uso humano por nenhuma agência reguladora (ANVISA, FDA, EMA). Vendidos como "produtos de pesquisa" para contornar legislação. Múltiplas análises independentes encontraram compostos diferentes do declarado no rótulo.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 34: SONO E GH ENDÓGENO — O ANABÓLICO GRATUITO
    // ============================================================
    {
      content: 'Dr. Marcus, sempre fala de sono como prioridade. Quanto de diferença faz o sono na produção endógena de GH?',
      userId: userIds['user_perf_lucas'],
      isAIResponse: false
    },
    {
      content: `Lucas, sono é literalmente o anabólico mais poderoso que você tem DE GRAÇA.

**DADOS:**
- 60-70% do GH diário é secretado durante sono profundo (ondas lentas, estágios 3-4)
- Pico de GH ocorre nos primeiros 90 minutos de sono
- Privação de sono (5h vs 8h) reduz GH noturno em até 70%
- Uma noite mal dormida = um dia inteiro com GH reduzido

**OTIMIZAÇÃO DO SONO PARA GH:**
1. Dormir em ambiente ESCURO total (melatonina endógena maximiza GH)
2. Temperatura fresca (18-20°C)
3. Última refeição 2-3h antes de dormir (insulina alta suprime GH)
4. Magnésio glicinato 400mg antes de dormir
5. Evitar álcool (destrói ondas lentas)
6. Consistência de horário (ritmo circadiano)

**SUPLEMENTOS QUE AUMENTAM GH NOTURNO:**
- GABA 3g antes de dormir (+400% em um estudo, mas absorção oral é questionável)
- Arginina 5-9g em jejum antes de dormir (+60%)
- Melatonina 0.5-1mg (dose BAIXA — mais não é melhor)
- Glicina 3g (melhora qualidade do sono)

**PERSPECTIVA:**
Um atleta natural com sono otimizado de 8-9h produz mais GH do que alguém que dorme 5h e toma GABA. Antes de pensar em GH exógeno, otimize o endógeno. É gratuito e sem efeitos colaterais.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'E pra quem trabalha em turno noturno? O GH é secretado de acordo com o ciclo de sono ou com o horário do dia?',
      userId: userIds['user_perf_lucas'],
      isAIResponse: false
    },
    {
      content: 'É com o ciclo de sono, não com o relógio. Se você consegue dormir 8h de qualidade durante o dia (quarto escuro, silencioso, rotina consistente), a secreção de GH é preservada. O problema é que POUCOS conseguem qualidade de sono diurno igual ao noturno. A melatonina exógena em dose baixa (0.5mg) ajuda a "enganar" o relógio biológico.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `EVIDÊNCIA: Meta-análise de 2020 confirma que privação de sono reduz GH em 50-70% e aumenta cortisol em 30-40%. Combinação catastrófica para composição corporal: menos anabolismo + mais catabolismo. Sono é a intervenção de menor custo e maior impacto.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 35: HEMATÓCRITO E DOAÇÃO DE SANGUE
    // ============================================================
    {
      content: 'Estou com hematócrito 52% após 16 semanas de Testo + EQ. Médico mandou parar tudo. Doação de sangue resolve ou preciso parar mesmo?',
      userId: userIds['user_perf_pedro'],
      isAIResponse: false
    },
    {
      content: `Pedro, 52% é zona de atenção mas não emergência. Acima de 54% = risco real.

**PROTOCOLO:**
1. Doação de sangue (450mL) → reduz ~2-3 pontos
2. Hidratação agressiva 3-4L/dia → dilui temporariamente
3. Naringenina (extrato de grapefruit) 500mg/dia → evidência FRACA mas usada
4. Se EQ é o causador principal, REDUZIR dose ou substituir
5. Aspirina 100mg/dia como antiagregante

**NÃO PRECISA PARAR TUDO se:**
- Hematócrito estabiliza <52% após doação
- Sem sintomas (dor de cabeça, visão embaçada, dormência)
- Monitoramento a cada 4-6 semanas

**PRECISA PARAR se:**
- >54% mesmo após doação
- Sintomas neurológicos
- Plaquetas altas concomitantes

Doação de sangue a cada 8-12 semanas é PROTOCOLO PADRÃO de harm reduction pra quem usa AAS. Deveria ser tão rotineiro quanto exame de sangue.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Posso doar sangue normalmente estando em ciclo? Eles não detectam?',
      userId: userIds['user_perf_pedro'],
      isAIResponse: false
    },
    {
      content: 'Bancos de sangue NÃO testam para esteróides anabolizantes. Testam para doenças transmissíveis (HIV, hepatite, sífilis, etc). Você pode doar normalmente. ATENÇÃO: não mencione uso de AAS — alguns bancos recusam por "uso de drogas injetáveis" por precaução, mesmo que AAS não contamine o sangue do receptor.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 36: HEPATOPROTETORES — PROTEGENDO O FÍGADO
    // ============================================================
    {
      content: 'Quais hepatoprotetores usar durante ciclo com orais? TUDCA, silimarina, NAC — o que realmente funciona?',
      userId: userIds['user_perf_rafael'],
      isAIResponse: false
    },
    {
      content: `Rafael, proteção hepática durante uso de orais C-17-alfa é OBRIGATÓRIA:

**TIER S (forte evidência):**
- **TUDCA** (ácido tauroursodesoxicólico) 500-1000mg/dia — O MELHOR. Ácido biliar que protege hepatócitos contra colestase induzida por orais. Começar junto com o oral, manter 2 semanas após.
- **NAC** (N-acetilcisteína) 600-1200mg/dia — Precursor de glutationa. Antioxidante hepático. Usado em emergências de intoxicação por paracetamol.

**TIER A (boa evidência):**
- **Silimarina** (cardo mariano) 420-600mg/dia — Antioxidante hepático, anti-inflamatório. Décadas de uso clínico em hepatopatias.
- **Vitamina E** 400 UI/dia — Reduz esteatose hepática.

**TIER B (evidência moderada):**
- **SAMe** (S-adenosilmetionina) 400-800mg/dia — Suporte metilação hepática
- **Lecitina/Fosfatidilcolina** — Suporte à membrana hepatocitária

**PROTOCOLO PADRÃO:**
TUDCA 500mg + NAC 600mg + Silimarina 420mg — durante todo o período de uso de oral e 2 semanas após.

**O QUE NÃO FUNCIONA:** Chá de boldo, detox de Instagram, suco verde, cápsulas de alcachofra em dose homeopática.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'TUDCA é caro. Silimarina sozinha resolve?',
      userId: userIds['user_perf_rafael'],
      isAIResponse: false
    },
    {
      content: 'Silimarina sozinha oferece proteção PARCIAL. TUDCA é superior porque age no mecanismo específico da toxicidade de orais C-17 (colestase). Se só pode comprar um, TUDCA. Se pode comprar dois, TUDCA + NAC. Silimarina é complementar.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `EVIDÊNCIA: TUDCA é usado clinicamente para colestase intra-hepática. NAC é protocolo de emergência para hepatotoxicidade. Ambos têm base científica sólida para proteção hepática durante uso de esteróides orais alquilados.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 37: TODOS USAM HORMÔNIOS (GH15 BIBLE)
    // Ref: GH15 — "everyone in gymnasium that look like bodybuilder
    // is ON HORMONES... get it in your fucking head already"
    // ============================================================
    {
      content: 'Pergunta sincera: qual percentual real de pessoas "em shape" na academia estão usando algo?',
      userId: userIds['user_perf_juliana'],
      isAIResponse: false
    },
    {
      content: `Juliana, o GH15 era brutalmente honesto sobre isso e a experiência confirma:

**A REGRA:**
Todo mundo na academia que PARECE bodybuilder — seja 80kg, 85kg, 95kg ou 115kg — está em hormônios. TODOS. Isso inclui:
- O cara de 90kg "natural" com deltóides 3D
- A mulher com ombros largos e cintura fina "só com dieta"
- O personal trainer de 40 anos mais definido que aos 25
- O cara que "só usa creatina e whey"

**ESTIMATIVAS REAIS (não oficiais):**
- 80-90% dos homens com >85kg magros estão em algo
- 60-70% das mulheres com "physique fitness" em algo
- 95%+ dos influencers fitness usam ou já usaram
- 99.9% dos competidores em qualquer nível usam

**POR QUE MENTEM?**
- Contratos de patrocínio exigem imagem "natural"
- Ilegalidade em muitos países
- Julgamento social
- Vender programas de treino/dieta (se admitir que é droga, ninguém compra)

**O LIMITE NATURAL REAL:**
Para homem médio, treinando perfeitamente por 5+ anos:
- 75-85kg magro (10-12% BF) dependendo da altura
- Braço 38-42cm frio
- Sem vascularização em repouso significativa
- Sem ombros 3D ("cannonball delts" é sinal de androgênio)

Se alguém está 20%+ acima desses números E magro, está usando algo. Sem exceção.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Isso não é desmotivador pra quem treina natural?',
      userId: userIds['user_perf_juliana'],
      isAIResponse: false
    },
    {
      content: `Juliana, ao contrário — é LIBERTADOR. Quando você entende que o influencer com shape impossível está usando farmacologia, para de se cobrar por não atingir um padrão artificialmente inflado.

O natural pode ter um corpo EXCELENTE — magro, forte, funcional, bonito. Só não vai parecer capa de revista Men's Health. E tudo bem. O objetivo deveria ser a melhor versão de SI MESMO, não uma comparação injusta com quem usa ferramentas farmacológicas.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `DADOS: Pesquisa anônima em academias dos EUA (2019) mostrou que 39% dos homens e 8% das mulheres relataram uso atual ou passado de AAS. Números reais provavelmente são maiores devido ao estigma de admitir uso.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 38: CARDIO E AAS — PROTEÇÃO CARDIOVASCULAR
    // ============================================================
    {
      content: 'AAS causam problemas cardíacos. Fazer cardio regularmente protege ou não adianta?',
      userId: userIds['user_perf_igor'],
      isAIResponse: false
    },
    {
      content: `Igor, cardio é ESSENCIAL para quem usa AAS. Não elimina os riscos, mas reduz significativamente:

**EFEITOS CARDÍACOS DOS AAS:**
- Hipertrofia ventricular esquerda (HVE)
- HDL despenca → aterosclerose acelerada
- Hipertensão por retenção hídrica e vasoconstrição
- Hematócrito elevado → sangue viscoso
- Remodelamento cardíaco (fibrose)

**COMO CARDIO AJUDA:**
1. Mantém elasticidade vascular
2. Aumenta HDL parcialmente (contra o efeito dos AAS)
3. Melhora retorno venoso e débito cardíaco
4. Regula pressão arterial
5. Melhora sensibilidade a insulina

**PROTOCOLO MÍNIMO:**
- 30-45min de cardio de baixa-moderada intensidade, 4-5x/semana
- FC em 120-140bpm (zona aeróbica)
- Bike, caminhada inclinada, elíptico
- NÃO precisa ser HIIT (pode sobrecarregar coração já estressado)

**EXAMES CARDÍACOS OBRIGATÓRIOS:**
- Ecocardiograma anual (medir espessura ventricular)
- ECG de repouso semestral
- Score de cálcio coronariano a cada 2-3 anos (>35 anos)
- Pressão arterial: monitorar semanalmente

**SUPLEMENTOS CARDIOPROTETORES:**
- Ômega 3 (EPA 2g + DHA 1g/dia)
- CoQ10 200-300mg/dia
- Citrus bergamot 1000mg/dia (reduz LDL oxidado)
- Taurina 3-5g/dia`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Conheci um bodybuilder de 42 anos que nunca fez cardio. Infartou na academia fazendo leg press. Sobreviveu, mas com 30% de comprometimento ventricular.',
      userId: userIds['user_perf_thiago'],
      isAIResponse: false
    },
    {
      content: 'Thiago, caso clássico e infelizmente comum. Leg press com Valsalva + pressão arterial de 180/110 + HVE não diagnosticada = bomba-relógio. Bodybuilders morrem mais de parada cardíaca do que de qualquer outra causa. Cardio não é opcional — é SEGURO DE VIDA.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `ALERTA: Morte súbita cardíaca é a principal causa de mortalidade em bodybuilders competitivos. Hipertrofia ventricular esquerda, fibrose miocárdica e doença coronariana acelerada são achados comuns em autópsias. Cardio regular e exames são OBRIGATÓRIOS.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 39: EXAMES DE SANGUE — O QUE PEDIR E QUANDO
    // ============================================================
    {
      content: 'Dr. Marcus, pode fazer uma lista dos exames ESSENCIAIS pra quem usa AAS? Meu médico não entende do assunto.',
      userId: userIds['user_perf_bruno'],
      isAIResponse: false
    },
    {
      content: `Bruno, aqui está o painel COMPLETO que todo usuário de AAS deveria fazer:

**A CADA CICLO (antes, durante semana 6-8, e pós):**

1. **Hemograma completo** — Hematócrito (policitemia), hemoglobina, plaquetas
2. **Lipidograma** — Colesterol total, HDL, LDL, triglicerídeos, VLDL
3. **Função hepática** — TGO (AST), TGP (ALT), GGT, bilirrubinas, fosfatase alcalina
4. **Função renal** — Creatinina, uréia, taxa de filtração glomerular
5. **Hormonal** — Testosterona total e livre, LH, FSH, estradiol, prolactina
6. **Glicemia e HbA1c** — Sensibilidade a insulina
7. **PSA** — Próstata (obrigatório >30 anos)
8. **TSH, T3 livre, T4 livre** — Tireóide

**ANUAL:**
9. **Ecocardiograma** — Espessura ventricular, fração de ejeção
10. **ECG de repouso** — Ritmo cardíaco
11. **Ultrassom de fígado** — Esteatose, nódulos
12. **Densitometria óssea** (se >40 ou uso prolongado)

**A CADA 2-3 ANOS:**
13. **Score de cálcio coronariano** — Aterosclerose
14. **Ressonância cardíaca** (se HVE detectada)

**CUSTO APROXIMADO:**
O painel básico (itens 1-8) custa R$300-600 em laboratórios populares. O completo com ecocardiograma: R$800-1.500.

**DICA:** Muitos médicos não entendem o contexto. Seja HONESTO com seu médico sobre o que está usando. O sigilo médico te protege. Um médico informado pode te salvar a vida.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Quanto tempo depois de parar um ciclo os exames normalizam?',
      userId: userIds['user_perf_bruno'],
      isAIResponse: false
    },
    {
      content: `Depende do composto:
- **Lipídios (HDL/LDL):** 4-8 semanas após cessação
- **Hepáticos (TGO/TGP):** 2-4 semanas (se sem dano permanente)
- **Hematócrito:** 6-12 semanas (mais lento com Boldenona)
- **Eixo hormonal (LH/FSH/Testo):** 4-16 semanas (com PCT)
- **Eixo sem PCT:** 3-12 MESES (ou nunca, em uso prolongado)

Exame pós-ciclo ideal: 6-8 semanas após última injeção (ou fim da PCT). Se valores não normalizaram em 3 meses, procurar endocrinologista.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `PROTOCOLO DE MONITORAMENTO: Painel sanguíneo pré, durante e pós-ciclo é o padrão mínimo de redução de danos. A maioria dos efeitos adversos é DETECTÁVEL por exames ANTES de causar sintomas. Prevenção > tratamento.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 40: REDUÇÃO DE DANOS — FILOSOFIA GERAL
    // ============================================================
    {
      content: 'Pra fechar esse mês de discussões intensas — qual seria o "manifesto" de redução de danos pra quem decidiu usar farmacologia?',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: `Renato, excelente forma de encerrar. Se tivesse que resumir TUDO que discutimos em princípios:

**10 MANDAMENTOS DA REDUÇÃO DE DANOS:**

1. **EXAMES SEMPRE.** Antes, durante, depois. Sem exceção.
2. **MENOS É MAIS.** A dose mínima eficaz é a dose certa. Não a máxima tolerável.
3. **CONHEÇA CADA COMPOSTO.** Um por vez. Nunca empilhe o que não conhece isoladamente.
4. **CARDIO NÃO É OPCIONAL.** 30min, 4x/semana, zona aeróbica. É seguro de vida.
5. **SONO É ANABÓLICO.** 7-9h. Não negociável. Melhor que qualquer suplemento.
6. **INSULINA MATA.** Se não tem 100% de certeza do que está fazendo, NÃO USE.
7. **GH TEM PREÇO.** Doses altas = viscerais grandes. Dose fisiológica = benefício com risco aceitável.
8. **SEJA HONESTO COM SEU MÉDICO.** Sigilo médico existe por um motivo.
9. **TENHA PLANO DE SAÍDA.** PCT ou TRT. Mas tenha um plano antes de começar.
10. **SEU CORPO NÃO É DESCARTÁVEL.** Você tem UM. Trate-o como o investimento mais valioso que tem.

A farmacologia no esporte existe, existiu e vai continuar existindo. A questão não é moralizar — é minimizar danos. Informação é a primeira linha de defesa.`,
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: 'Esse resumo deveria ser fixado no topo da arena. Obrigado por todo o conhecimento compartilhado aqui, Dr. Marcus.',
      userId: userIds['user_perf_renato'],
      isAIResponse: false
    },
    {
      content: 'Renato, o conhecimento é de todos. A responsabilidade também. Sigam aprendendo, questionem sempre, façam exames. O corpo que vocês constroem tem que durar uma vida inteira — não apenas até o próximo show.',
      userId: userIds['user_perf_drm'],
      isAIResponse: false
    },
    {
      content: `ENCERRAMENTO: 40 threads de discussão cobrindo farmacologia avançada, protocolos, riscos e redução de danos. Esta arena opera sob princípio de INFORMAÇÃO como ferramenta de proteção — não como incentivo ao uso. Continuem fazendo exames, priorizem saúde, e busquem sempre supervisão médica.`,
      userId: aiUser.id,
      isAIResponse: true
    },
  ];

  console.log(`\n📝 Criando ${posts.length} posts...`);
  let count = 0;
  const BATCH_SIZE = 20;

  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE).map(post => ({
      id: uuid(),
      arenaId: ARENA_ID,
      userId: post.userId,
      content: post.content,
      isPublished: true,
      isApproved: true,
      isAIResponse: post.isAIResponse,
      viewCount: Math.floor(Math.random() * 200) + 30,
      likeCount: Math.floor(Math.random() * 80) + 5,
      createdAt: nextTime().toISOString()
    }));

    const { error } = await sb.from('Post').insert(batch);
    if (error) {
      console.error(`❌ Erro no batch ${i}-${i + batch.length}:`, error.message);
      throw error;
    }
    count += batch.length;
    console.log(`  → ${count}/${posts.length} posts criados...`);
  }

  const { count: totalPosts } = await sb.from('Post').select('id', { count: 'exact', head: true }).eq('arenaId', ARENA_ID);
  const { data: uniqueUsersData } = await sb.from('Post').select('userId').eq('arenaId', ARENA_ID).eq('isAIResponse', false);
  const uniqueUserCount = new Set(uniqueUsersData?.map(u => u.userId)).size;

  await sb.from('Arena').update({
    totalPosts: totalPosts ?? posts.length,
    dailyActiveUsers: uniqueUserCount,
    status: 'HOT'
  }).eq('id', ARENA_ID);

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED COMPLETO — Performance & Biohacking (v3)');
  console.log('═'.repeat(60));
  console.log(`📊 Posts: ${totalPosts ?? posts.length} | Usuários: ${uniqueUserCount + 1} (+ IA)`);
  console.log(`📖 Threads: 40 (3 originais + 37 novas com refs GH15 Bible)`);
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e);
    process.exit(1);
  });
