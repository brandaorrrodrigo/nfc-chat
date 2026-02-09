require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: AVALIAÇÃO BIOMÉTRICA & ASSIMETRIAS
// 40 posts | 8 conversas (5 posts cada)
// Foco: visão computacional (MediaPipe/OpenPose), análise postural,
// assimetrias normais vs patológicas, ângulos articulares,
// limitações da IA, interpretação de dados, corpo real
// ============================================================

const POSTS = [

  // ============================================================
  // CONVERSA 1: Como a IA analisa minha postura por câmera?
  // ============================================================
  {
    userId: 'user_sim_002',
    content: `Vi que o NutriFitCoach tem análise postural por câmera. Como funciona na prática? Quão confiável é comparado com um fisioterapeuta presencial?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ótima pergunta. A análise por visão computacional funciona detectando 33 pontos anatômicos (landmarks) usando MediaPipe ou OpenPose. A câmera captura sua imagem, o algoritmo identifica cada ponto (ombros, quadris, joelhos, tornozelos, etc) e calcula ângulos e distâncias. Esses números são comparados com ranges de normalidade.

O que funciona BEM: medição OBJETIVA (elimina viés), rastreamento temporal (mesma métrica meses depois), detecção de assimetrias, acessibilidade, consistência.

O que NÃO funciona: tecido mole esconde landmarks reais (especialmente lipedema), câmera 2D não captura rotações 3D, não avalia mobilidade ativa, não palpa, não sabe se dói.

Melhor pensar como: IA = TRIAGEM inteligente + TRACKING objetivo. Fisioterapeuta = diagnóstico contextualizado + tratamento.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Trabalho com software e entendo MediaPipe. Ponto crítico: em pessoas magras, erro < 1cm. Com tecido subcutâneo aumentado, pode chegar 3-4cm. A IA precisa ser honesta sobre isso. Dados precisos > dados bonitos mas errados.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `Fiz avaliação pelo app e depois presencial com fisioterapeuta. Coincidiram 80%: ombro direito mais alto, anteriorização de cabeça, quadril inclinado. O que fisio pegou: rotação de fêmur (precisa teste ativo) e trigger point no trapézio. Juntos = completo. IA deu o mapa, fisio o contexto.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_009',
    content: `O tracking de progresso é onde IA BRILHA. Avaliação jan e abr (mesma posição, roupa, horário). Anteriorização caiu 5.2cm → 3.1cm. NÚMERO concreto. Presencialmente seria "parece melhor" — subjetivo. Dado objetivo me motivou continuar o protocolo.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 2: Assimetrias normais — quando parar de se preocupar
  // ============================================================
  {
    userId: 'user_sim_007',
    content: `Avaliação mostrou ombro direito 1.8cm mais alto e quadril 0.7° inclinado. Entrei em pânico. Preciso tratar ou é normal? Sem dor nenhuma.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `NÃO entre em pânico. Assimetrias detectadas são VARIAÇÕES NORMAIS do corpo humano.

Dados de prevalência em pessoas SAUDÁVEIS assintomáticas:
- Ombros desnivelados >1cm: 85-95% das pessoas
- Inclinação pélvica lateral <2°: 80%+ população
- Comprimento funcional diferente MMII até 1.5cm: 70% das pessoas
- Ninguém tem rosto simétrico

Ranges de NORMALIDADE:
- Desnível ombro: <2.5cm = normal, 2.5-4cm = monitorar, >4cm = investigar
- Inclinação pélvica: <2° = normal, 2-4° = monitorar, >4° = investigar
- Anteriorização cabeça: <3cm = normal, 3-5cm = monitorar, >5cm = investigar

Seus achados: 1.8cm ombro + 0.7° quadril = NORMAIS. Sem dor = NENHUMA ação necessária.

Significância estatística ≠ significância clínica. Detectável ≠ relevante para saúde.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `OBRIGADA pela tabela. Saí achando que estava TODA TORTA. Fisioterapeuta riu: "isso é sua anatomia". IA detecta precisão — o difícil é saber o que IMPORTA. Tabela deveria vir em todo relatório.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Passei 6 meses obcecada com "ombro 2cm mais alto". 2 fisioterapeutas + quiroprata = R$ 2.000. NADA mudou porque não tinha nada pra mudar. Quando aceitei variação normal, parei gastar dinheiro tentando "consertar" o que não está quebrado. Avaliação sem INTERPRETAÇÃO = ansiedade.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 3: Como tirar fotos certas pra avaliação precisa
  // ============================================================
  {
    userId: 'user_sim_008',
    content: `Fiz 3 avaliações em dias diferentes e resultados variaram. Ombro: 1.5cm numa, 2.3cm noutra, 0.8cm na terceira. IA é inconsistente ou eu fiz errado?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Variação é erro de PADRONIZAÇÃO nas fotos, não inconsistência IA. Análise por câmera é sensível: distância, altura, ângulo, iluminação, roupa, postura afetam tudo.

Protocolo correto:

Ambiente: fundo liso, iluminação frontal difusa, sem espelho atrás.

Câmera: na altura do UMBIGO (centro de massa), 2.5-3m distância, retrato (vertical), tripé fixo, nível.

Corpo: roupa ajustada, descalço, cabelo preso, pés largura ombros paralelos, marcação de posição com fita, braços relaxados, olhar reto.

Vistas: anterior (frente), lateral direita, posterior (costas).

Postura: NÃO "corrija" — quer postura HABITUAL. Feche olhos 5s, balance, abra → posição natural.

Temporal: MESMA hora do dia (postura varia ao longo dia), MESMA roupa, fotografar antes treino, MESMA posição pés (marca com fita).

Com protocolo: variação entre sessões cai <0.5cm — aceitável.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: `Dica de fita marcando pés é GENIAL. Faço avaliação mensal e ficou CONSISTENTE: mesma fita, mesma marca câmera, mesma roupa, mesmo horário (sábado 8h antes treino). Resultado: vejo evolução REAL — anteriorização cabeça caiu 5.2cm → 3.1cm em 2 meses. Dado confiável porque captura idêntica.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: `Erro que cometi: camisetão larga. Algoritmo detectava ombro 3cm mais largo porque pegava contorno camiseta. Troquei pra top ajustado → detecção precisa. Roupa larga = dados errados. Parece óbvio mas ninguém avisa.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 4: Avaliação detectou valgo de joelho — e agora?
  // ============================================================
  {
    userId: 'user_sim_005',
    content: `Avaliação detectou 8° valgo dinâmico joelho direito (esquerdo 3°). Flagado como "assimetria significativa". Devo parar agachar? Tenho dor leve medial D às vezes.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `IA fez seu trabalho: detectou assimetria REAL e RELEVANTE. 8° vs 3° com dor merece atenção. NÃO parar, mas INVESTIGAR e AJUSTAR.

Causas comuns de valgo dinâmico assimétrico:

1. Fraqueza glúteo médio unilateral — MAIS COMUM. Glúteo médio fraco → fêmur roda interno → joelho cai medial.
2. Dorsiflexão limitada tornozelo → compensa com pronação → joelho cai.
3. Adutores/TFL hipertônicos unilaterais.
4. Pronação excessiva do pé.

A dor medial: valgo + dor medial → estresse ligamento colateral medial + pata de ganso. Não emergência mas sinal de sobrecarga.

Plano:

1. Avaliação presencial com fisioterapeuta — confirmar causa (teste força GM, knee-to-wall test, avaliação do pé).

2. Corretivo imediato:
   - Clamshell mini band: 3x15 lado D (diário)
   - Side-lying abduction: 3x12
   - Monster walk mini band: 3x10
   - Knee-to-wall stretch: 3x30s

3. Agachamento AJUSTADO (não parar):
   - Mini band ACIMA joelhos → força empurrar joelhos pra fora
   - Reduzir carga 20-30%
   - Cue: "empurrar chão pra fora com os pés"
   - Filmar cada sessão → monitorar

4. Reavaliação 4-6 semanas: objetivo reduzir 8° → <5°.

Valor IA: detectou assimetria imperceptível a olho nu (3° diferença). Pegar CEDO = correção simples. Pegar TARDE = lesão.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `Exatamente isso — valgo 9° joelho esquerdo. Fisio confirmou: GM fraco E + dorsiflexão limitada. 8 semanas clamshell + monster walk + stretch. Reavaliação: valgo → 4°. Dor desapareceu. IA detectou o que eu sentia mas não explicava. Sem medição objetiva, ignoraria até lesionar.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: `Mini band no agachamento pra corrigir valgo foi TRANSFORMADORA. Cue "empurrar banda pra fora" ativou GM de um jeito que nunca conseguia. 4 semanas: padrão mudou visivelmente em vídeos. Agora uso banda no aquecimento SEMPRE. Investimento: R$ 15.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 5: Análise de movimento — agachamento pela câmera
  // ============================================================
  {
    userId: 'user_sim_011',
    content: `Além de postura estática, IA consegue analisar meu MOVIMENTO? Filmar agachamento e dizer se tá correto? Seria incrível pra quem treina em casa sem personal.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Sim — análise de movimento por visão computacional é possível e é próximo nível após estática.

Diferença: estática = 1 foto → ângulos em 1 instante. Movimento = vídeo → landmarks rastreados frame-a-frame → ângulos ao longo todo arco.

O que análise de movimento do agachamento detecta:

1. Profundidade: ângulo joelho no ponto mais baixo. ACHA que vai fundo? Número mostra 100° (paralelo não atingido).

2. Shift lateral: quadril deveria descer RETO. Se desloca 2-3cm pra direita → compensação.

3. Valgo dinâmico: rastreia posição joelho vs tornozelo vs quadril. Em qual FASE aparece?

4. Butt wink: ângulo pélvico durante descida. Identifica ponto exato em que pelve retroversa.

5. Inclinação tronco: se excessiva → fraqueza quadríceps relativa ou limitação tornozelo.

6. Timing/simetria: subida é simétrica? Velocidade controlada ou queda livre?

Limitações: câmera 2D (precisa 2 câmeras idealmente), frame rate celular OK pra agachamento (30fps), pode "perder" landmarks se membros se cruzam.

Protocolo: vista lateral (OBRIGATÓRIA) + vista frontal (COMPLEMENTAR). Roupa ajustada, descalço, 3-5 reps. Filme com carga LEVE e PESADA → compare (compensações aparecem com peso).

Valor: o que levaria semanas pra personal perceber visualmente, IA identifica em 1 vídeo.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: `Filmei agachamento lateral + frontal e análise mostrou: tronco inclina 15° MAIS que deveria e quadril shift 2cm pra direita na subida. Treino 2 anos e NINGUÉM de Instagram mostrou isso. Vista frontal é que mais revela — de lado parece OK, de frente problemas aparecem. Entendo por que lombar doia com agachamento pesado.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: `Butt wink era meu fantasma. Análise mostrou pelve começava retroverter 95° do joelho. Causa? Dorsiflexão limitada tornozelo. 4 semanas mobilidade → retroversão agora só aparece 80° (muito mais fundo). Dado objetivo → intervenção específica → resultado mensurável.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 6: Lipedema e avaliação — a IA erra mais?
  // ============================================================
  {
    userId: 'user_sim_003',
    content: `Tenho lipedema estágio II. Fiz avaliação: valgo apareceu 12° mas fisio presencial disse 6-7°. Volume das pernas atrapalha detecção?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Sua desconfiança está correta. Lipedema REDUZ precisão da detecção.

Por quê: algoritmo detecta CONTORNO visível, não osso. Lipedema = contorno significativamente afastado do eixo ósseo. "Joelho" detectado visualmente pode estar 2-4cm lateral do joelho REAL. Resultado: ângulos SUPERESTIMADOS.

Volume assimétrico: se lipedema é mais medial na coxa → landmark joelho empurrado lateral → parece MENOS valgo. Se lateral → parece MAIS valgo. Imprevisível.

Perda de definição: contornos articulares menos definidos com lipedema → menor confiança do algoritmo → mais erro.

Adaptações:

1. Usar meia de compressão DURANTE avaliação: comprime tecido → contorno mais próximo osso → medição mais precisa. Não perfeito, mas reduz erro.

2. Marcadores externos: adesivos reflexivos sobre landmarks reais (palpados manualmente). IA rastreia marcadores em vez de contorno.

3. Dar peso MENOR aos dados de MMII: para tronco/ombro/cabeça detecção é precisa (lipedema não afeta). Para MMII: considerar margem ±3-5° nos ângulos. Cruzar SEMPRE com presencial.

4. Avaliação funcional > estática: análise de MOVIMENTO pode ser mais informativa que foto estática em lipedema.

O sistema DEVERIA informar: "Detecção de landmarks em MMII com confiança reduzida devido a volume de tecido. Margem de erro estimada: ±3-5°."

Honestidade sobre limitações = dados confiáveis.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: `Explica MUITO. Avaliação por câmera: 14° valgo. Fisio com goniômetro: 7°. DOBRO de erro por volume lipedema coxa medial. Agora faço avaliação com meia compressão: resultado fica ~9° (vs 7° goniômetro). Meia ajuda algoritmo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: `Transparência sobre limitações diferencia ferramenta CONFIÁVEL de marketing. Se IA disser "seu valgo é 12° — precisa corrigir" sem informar ±5° de erro → leva a intervenções desnecessárias. Prefiro ouvir "~12° com ±4° margem — confirme presencialmente" que número falso como verdade.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 7: Tracking de evolução — o poder do antes/depois OBJETIVO
  // ============================================================
  {
    userId: 'user_sim_009',
    content: `Protocolo corretivo 4 meses (chin tuck, face pull, fortalecimento GM). Avaliação mês 1 e mês 4. Comparação é INCRÍVEL — números concretos mostrando evolução. Com que frequência reavaliar?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Tracking de evolução é onde IA entrega MAIOR valor. Nenhum profissional consegue reproduzir medições com mesma precisão meses depois.

Avaliação humana repetida: viés avaliador, erro intermensuradores, memória falha. Resultado: "está melhor" (subjetivo).

IA: mesmas condições → mesma medição → comparação VÁLIDA. Números exatos: 5.2cm → 3.1cm. Gráfico de evolução. Resultado: "-2.1cm em 4 meses, 0.5cm/mês" (objetivo).

Frequência ideal de reavaliação:

- Protocolo corretivo ATIVO: a cada 4-6 semanas
- Manutenção (sem intervenção): a cada 3-6 meses
- Pós-cirúrgico: cada 2-4 semanas no início, mensal depois
- Treino regular (acompanhamento): cada 2-3 meses
- Mudança de programa: antes + 8 semanas depois

Por que NÃO semanal: mudanças levam SEMANAS-MESES. Semanal → variação dia-a-dia > melhora real → frustrante.

Interpretar resultados:

Melhora real: anteriorização -1cm ou mais em 4-6 semanas = significativo. Valgo -2° ou mais = significativo.

Sem mudança relevante: variações <0.5cm ou <1° podem ser erro medição. Reavaliar em mais 4-6 semanas.

Piora: se piorou além margem erro → revisar protocolo + consultar profissional.

DICA: crie prontuário digital. Registre cada avaliação (data, condições, protocolo em andamento). Em 6-12 meses: mapa completo da sua evolução que nenhuma clínica oferece.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: `Prontuário digital é INCRÍVEL. Pasta Google Drive com fotos padronizadas + prints dos relatórios. Mês 1-2-3-4. Quando fico desmotivada com corretivo, abro pasta e VEjo números mudando. Motivação pura baseada em fatos. Recomendo pra todo mundo.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `Dados 6 meses: anteriorização 5.8cm → 2.9cm. Valgo D 8° → 4°. Desnível ombro 2.1cm → 1.4cm. Tudo com chin tuck diário + face pull 3x/sem + clamshell + monster walk. IA mostrou ONDE focar, protocolo corrigiu, reavaliação PROVOU funcionou. Sem medição objetiva: no escuro.`,
    isAIResponse: false,
  },

  // ============================================================
  // CONVERSA 8: O futuro — IA preditiva e prevenção de lesões
  // ============================================================
  {
    userId: 'user_sim_010',
    content: `Se IA analisa postura/movimento agora, qual próximo passo? Dá pra PREVER lesões antes que aconteçam? Tipo, ver padrão valgo + shift lateral e dizer "em X meses terá problema no joelho"?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Previsão de lesão por biomecânica é campo ativo de pesquisa. Potencial é real, estamos no começo.

O que JÁ é POSSÍVEL hoje:

1. Identificação de fatores de risco CONHECIDOS: valgo >10° → fator de risco LCA. Assimetria força >15% → risco ao membro mais fraco. Anteriorização excessiva → cervicalgia e cefaleia. IA detecta e ALERTA.

2. Screening pré-participação: FMS por câmera, overhead squat, compensações que predispõem lesão.

3. Detecção fadiga em tempo real: após X reps, técnica deteriora → valgo sobe 8° → IA identifica ponto de risco. "Suas reps 1-6 tinham 3°. Reps 7-10 subiram 8°. Reduza volume."

O que está PRÓXIMO (2-5 anos):

1. Modelos preditivos individuais: IA aprende SEU padrão ao longo meses. Se mudança anormal → alerta personalizado.

2. Correlação biomecânica × carga × sono × dor: modelo preditivo integrado. "Nas semanas com volume agachamento 15 séries E valgo D +2°, você reportou dor joelho na semana seguinte."

3. Análise de marcha em tempo real: sensores calçado + câmera. Detectar mudanças que precedem lesões estresse.

O que é FUTURO (5-10+ anos):

1. Predição probabilística: "23% de probabilidade lesão meniscal medial D nos próximos 6 meses." Requer bancos de dados enormes + validação prospectiva.

2. Biofeedback em tempo real: óculos RA mostrando ângulos DURANTE agachamento. Correção imediata: "joelho D caindo — ative GM."

Honestidade ATUAL: IA é EXCELENTE em DETECTAR padrões anormais. BOA em ALERTAR sobre fatores de risco conhecidos. LIMITADA em PREVER lesões específicas. INÚTIL para substituir julgamento clínico.

Valor HOJE: prevenção não precisa predição perfeita. Se detecta valgo 10° + assimetria 5° → corrigir REDUZ risco mesmo sem saber QUAL lesão evitaria. Como cinto de segurança: não prevê acidente, mas reduz dano.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: `Detecção fadiga em tempo real me empolgou. Se IA puder dizer "pare, sua técnica deteriorou e risco aumentou" durante série pesada → salva joelhos e lombares. Pra quem treina sozinho em casa: GAME CHANGER. Espero NutriFitCoach implemente isso.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Como fisioterapeuta: IA é ALIADA, não concorrente. Ela mede precisão milimétrica, repete medição idêntica meses depois, analisa frame-a-frame. EU faço o que ela não consegue: palpar, testar mobilidade ativa, contextualizar dor, decidir se achado é relevante. Futuro é INTEGRAÇÃO, não substituição. Melhores resultados: IA + profissional juntos.`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================
async function main() {
  console.log('\n🏟️  SEED: AVALIAÇÃO BIOMÉTRICA & ASSIMETRIAS\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%avaliacao-biometrica%,slug.ilike.%avaliacao_biometrica%,name.ilike.%avaliação biométrica%,name.ilike.%avaliacao biometrica%,slug.ilike.%biometrica%');

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('slug.ilike.%biometr%,name.ilike.%biometr%,slug.ilike.%assimetr%,name.ilike.%assimetr%,slug.ilike.%avaliacao%,name.ilike.%avaliação%');
    if (allArenas?.length) {
      console.log('Arenas encontradas:', allArenas.map(a => `${a.slug} | ${a.name}`));
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
  const baseTime = new Date('2025-02-08T08:30:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 15 * 60 * 1000);

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
      viewCount: Math.floor(Math.random() * 80) + 20,
      likeCount: post.isAIResponse
        ? Math.floor(Math.random() * 30) + 18
        : Math.floor(Math.random() * 20) + 5,
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
  console.log('\n🏟️  Arena Avaliação Biométrica & Assimetrias pronta! ✅\n');
}

main().catch(console.error);
