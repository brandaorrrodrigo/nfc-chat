require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: LIBERAÇÃO MIOFASCIAL
// 38 posts | 8 conversas (4-5 posts cada)
// Foco: foam roller, bola de lacrosse, técnicas, mitos vs ciência,
// protocolos pré/pós-treino, liberação para lipedema, dor crônica
// ============================================================

const POSTS = [

  // CONVERSA 1: Foam roller funciona?
  {
    userId: 'user_sim_002',
    content: 'Minha personal manda foam roller 15 min antes de todo treino. Diz que libera a fáscia, quebra aderências. Vi um vídeo de fisio dizendo que é tudo mito. Quem tem razão? Estou perdendo 15 minutos à toa ou funciona?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Juliana, os dois têm parte da razão. Foam roller FUNCIONA, mas provavelmente NÃO pelo mecanismo descrito. O QUE NÃO FAZ: quebra aderências (fáscia requer ~925kg/cm² de força, seu peso gera fração disso). Alonga fáscia permanentemente (não gera tensão suficiente). O QUE REALMENTE FAZ: modulação neurológica (pressão ativa mecanorreceptores, SNC reduz tônus muscular reflexamente). Aumento transitório de ADM (~4°, dura 10-20min). Redução de DOMS pós-treino. Efeito psicológico real. Evidência: Beardsley & Škarabot (2015) reduz rigidez de forma aguda. Pearcey et al. (2015) reduz DOMS. Chertok et al. (2021) não reduz força pré-treino. Na prática: 3-5min pré-treino em áreas tensas OK, 15min é excessivo. Seu personal está certo que funciona, errado no mecanismo.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: 'Cara, isso explica MUITO. Eu sentia que funcionava mas repetia o papo de "quebrar aderências" e ninguém comprava. Agora faz sentido: é neurológico. Músculo relaxa porque SNC manda relaxar, não porque smaguei algo. 3-5min nos pontos tensos melhora meu agachamento visivelmente.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: 'O ponto sobre DOMS é real. Faço foam roller pós-treino de perna (5min em quadríceps, adutores, glúteo) e a diferença no dia seguinte é perceptível vs quando pulo. Não elimina, mas reduz de "não consigo sentar" pra "dói mas funciono".',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: 'Pergunta: se o efeito de ADM dura só 10-20min, faz sentido fazer foam roller NO QUADRIL/TORNOZELO IMEDIATAMENTE antes de agachar, certo? Não adianta em casa 1h antes. Estou certo?',
    isAIResponse: false,
  },

  // CONVERSA 2: Foam roller vs bola vs pistola
  {
    userId: 'user_sim_010',
    content: 'Existem mil ferramentas: foam roller liso, texturizado, bola de lacrosse, bola de tênis, pistola de massagem, rolo com espinhos... Qual usar pra quê? Comprei pistola de R$ 400 e uso em TUDO. É overkill?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Thiago, cada ferramenta tem sweet spot. FOAM ROLLER LISO: melhor pra áreas GRANDES — quadríceps, isquiotibiais, adutores, panturrilha, torácica. Pressão moderada. Custo R$ 30-60. Básico obrigatório. FOAM ROLLER TEXTURIZADO: mesmas áreas com pressão ligeiramente maior. Evidência: Curran et al. (2015) sem diferença significativa. Marginal. BOLA DE LACROSSE: pontos ESPECÍFICOS e profundos — piriforme, glúteo médio, subescapular, sóleo, plantar, trapézio, suboccipitais. Pressão alta localizada. Custo R$ 15-25. Trigger points específicos. BOLA DUPLA (peanut): paravertebrais — duas bolas coladas, uma de cada lado da coluna. Excelente torácica/cervical. Custo R$ 20-40 (ou DIY com 2 bolas tênis + fita). PISTOLA MASSAGEM: áreas GRANDES com tensão generalizada. Vibração percussiva estimula mecanorreceptores. Custo R$ 150-800. Rápida, fácil. Konrad et al. (2020): comparável ao foam roller. Limitação: não substitui pressão sustentada em trigger points. KIT ESSENCIAL: foam roller R$ 40 + bola lacrosse R$ 20 + pistola R$ 200-300 (opcional).',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_005',
    content: 'A bola de lacrosse no piriforme é DIVINA e DIABÓLICA. Primeiro dói, depois alívio de "interruptor de tensão desligado". Sento, cruzo perna, fico 60-90s. Release é físico — sinto o músculo soltar. Antes de todo treino de perna, agachamento melhorou muito.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: 'Sobre pistola: comprei genérica de R$ 150 no Mercado Livre. Funciona perfeitamente. Diferença pras de R$ 800 é barulho/bateria/acabamento — mecanismo percussivo é igual. Se orçamento apertado, não se sinta pressionada. Pra trigger point nada substitui bola de lacrosse.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: 'A dica do peanut caseiro (2 bolas tênis + fita) é genial. Deito, bolas cada lado da coluna torácica, vou subindo/descendo. Alívio na região entre escápulas após dia sentada é INSTANTÂNEO. Custo R$ 10. Faço toda noite antes de dormir, cervicalgia crônica melhorou visivelmente.',
    isAIResponse: false,
  },

  // CONVERSA 3: Liberação para lipedema
  {
    userId: 'user_sim_017',
    content: 'Tenho lipedema estágio II e vi que foam roller é recomendado. Meu tecido é MUITO sensível — só encostar já dói. Posso usar nas pernas com lipedema? Não vou causar hematomas ou piorar? Fisio disse que pode mas com cuidado — queria detalhes.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Renata, pode, mas protocolo precisa ser adaptado. NO LIPEDEMA: fragilidade capilar hematomas com pressão inofensiva, hiperalgesia dor amplificada, edema tecido já sob pressão, fibrose estágio II-III nódulos dolorosos. NÃO FAZER: foam roller diretamente com pressão máxima, rolar agressivamente tentando quebrar nódulos, ferramentas alta pressão diretamente, forçar dor. O QUE PODE: 1) FOAM ROLLER COM MEIA DE COMPRESSÃO — meia distribui pressão, protege capilares, reduz hematomas. 2) PRESSÃO LEVE a moderada — dor escala 3-5/10 (máximo 5 no lipedema vs 5-7 normal). 3) MOVIMENTOS LENTOS — 1-2cm/segundo. 4) FERRAMENTAS ADEQUADAS — espuma MACIA (não PVC duro), bola TÊNIS (não lacrosse), pistola velocidade BAIXA. 5) ÁREAS FOCO — quadríceps/panturrilha (com cuidado), glúteo bola tênis, evitar IT band/adutores (muito sensível). 6) TIMING — pré 2-3min leve COM meia, pós 3-5min. Monitorar hematomas — se houver reduzir. Dor pós > 2h = pressão excessiva.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: 'Confirmo que foam roller COM meia funciona muito bem. 2min em quadríceps/panturrilha com meia classe 2 pré-treino. Pressão leve, devagar. Nunca tive hematoma. SEM meia tentei uma vez — marcas roxas por 5 dias. A meia é o segredo pra lipedema.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: 'Adiciono: pistola massagem velocidade 1 (mais baixa) SOBRE a meia é MARAVILHOSA pro lipedema. Vibração suave, não pressão direta intensa. Uso nos quadríceps/panturrilhas pós-treino, peso nas pernas reduz bastante. Só não uso velocidade alta nem pele — receita pra hematoma.',
    isAIResponse: false,
  },

  // CONVERSA 4: IT band — por que dói?
  {
    userId: 'user_sim_005',
    content: 'Lateral da coxa no foam roller é A DOR MAIS INTENSA. Fico suando frio. Todo mundo fala que tem que rolar a IT band mas parece tortura. É pra doer assim? Ou estou errado? Por que essa região é tão sensível?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Rafael, a IT band no foam roller é controversa. A dor extrema é sinal de que provavelmente NÃO deveria fazer assim. POR QUE DÓI: IT band NÃO é músculo — é faixa de tecido conectivo denso, essencialmente tendão. MUITO pouca capacidade de relaxar. Dor vem de compressão de estruturas ABAIXO: vasto lateral, nervos cutâneos laterais, bursas. Região rica em nociceptores. Gordura subcutânea lateral frequentemente fina. PODE SER LIBERADA COM FOAM ROLLER? Provavelmente NÃO. Chaudhry et al. (2008): força necessária ~925kg/cm², seu peso NÃO gera isso. Você está comprimindo vasto lateral e irritando nervos — não liberando IT band. O QUE FAZER: 1) LIBERAR MÚSCULOS QUE PUXAM IT BAND — TFL (bola lacrosse na anterolateral quadril, 60s). Glúteo máximo (fibras que se inserem na IT band). Vasto lateral (foam roller anterior-lateral da coxa, MÚSCULO, NÃO IT band pura). 2) FORTALECER ESTABILIZAÇÃO QUADRIL — síndrome IT band (dor joelho lateral) vem de FRAQUEZA glúteo médio. Clamshell, monster walk, abdução cabo, agachamento com banda. 3) SE PRECISA TRABALHAR LATERAL COXA — pressão MÍNIMA, foco no vasto lateral (anterior), dor máxima 4/10, pistola velocidade baixa.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: 'Isso muda TUDO. Eu ficava 5min rolando a IT band em agonia achando que tinha que doer. Quando troquei pra bola lacrosse no TFL (ponto abaixo/lateral do osso quadril), alívio foi MUITO maior com MUITO menos dor. 60s pressão sustentada, tensão lateral toda reduziu. TFL era o vilão, não IT band.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'O fortalecimento de glúteo médio resolveu minha síndrome da IT band na corrida. Dor joelho lateral toda corrida. Fisio identificou glúteo médio fraco — quadril cedia — IT band sobrecarregada. 8 semanas clamshell + monster walk + single leg deadlift e nunca mais tive dor. Liberação miofascial na IT band era paliativo.',
    isAIResponse: false,
  },

  // CONVERSA 5: Antes ou depois?
  {
    userId: 'user_sim_016',
    content: 'Debate eterno: foam roller ANTES ou DEPOIS do treino? Ou os dois? Personal diz antes (aquecer). Fisio diz depois (recuperar). Li que antes pode REDUZIR força. Qual a resposta baseada em evidência?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Daniela, as duas respostas estão parcialmente certas. TIMING muda o objetivo, não eficácia. ANTES DO TREINO: NÃO reduz força/potência — Wiewelhove et al. (2019) sem efeito negativo significativo. DIFERENTE de alongamento estático prolongado (>60s) que pode reduzir força 5%. BENEFÍCIOS PRÉ: aumento transitório ADM (~4°), redução de rigidez muscular, ativação proprioceptiva. PROTOCOLO PRÉ: 30-60s por grupo muscular, total 2-5min, pressão moderada, movimentos lentos, foco em áreas que LIMITAM seu treino. DEPOIS DO TREINO: Pearcey et al. (2015) foam rolling pós-treino reduziu DOMS significativamente 24-72h. Melhora percepção recuperação, aumento fluxo sanguíneo local, ativação parassimpática. PROTOCOLO PÓS: 60-90s por grupo trabalhado, total 5-10min, pressão moderada a alta. Resposta prática: pré-treino MOBILIDADE funcional, pós-treino RECUPERAÇÃO. Se tem que escolher um: pós-treino tem evidência mais forte.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: 'Minha rotina: 2min foam roller em áreas que vou treinar (pré) + 5-8min pós-treino no corpo todo. Total ~10min por sessão. Desde que comecei, meu DOMS reduziu de "não consigo descer escada" pra "leve desconforto". Agachamento ficou mais profundo porque solto panturrilha/adutores antes. Os dois juntos é ideal.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: 'Para quem tem pouco tempo: eu faço foam roller SÓ à noite em casa, 10min assistindo TV. Não faço antes nem depois do treino. O efeito na recuperação e rigidez matinal é ótimo. O melhor momento é o que você CONSEGUE fazer consistentemente. Consistência importa mais que timing perfeito.',
    isAIResponse: false,
  },

  // CONVERSA 6: Posso rolar a lombar? Cervical?
  {
    userId: 'user_sim_011',
    content: 'Minha lombar é rígida e tentei foam roller na lombar — doeu e parece que piorou. Vi gente no YouTube rolando a lombar inteira. Pode ou não? E pescoço — posso usar bola de lacrosse na cervical?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Lucas, duas perguntas importantes. LOMBAR NO FOAM ROLLER — NÃO recomendado convencionalmente. Anatomia: coluna lombar tem lordose natural (curva pra dentro). Deitar sobre foam roller hiperextensão forçada comprime articulações facetárias/discos posteriores. Sem costelas protegendo, musculatura CONTRAI defensivamente em vez de relaxar. Resultado: TENSIONA mais em vez de soltar. Risco: irritar articulações facetárias, espasmo protetor, se hérnia discal pode piorar compressão nervosa. O QUE FAZER: bola lacrosse no QUADRADO LOMBAR (QL) — deitar de lado, bola entre crista ilíaca e última costela, pressão lateral (NÃO sobre coluna). 60s cada lado. Liberar GLÚTEOS (tenso = lombar sobrecarregada). Foam roller em FLEXORES QUADRIL — psoas tenso puxa lombar pra frente. Foam roller em TORÁCICA — torácica rígida = lombar compensa. CERVICAL — pode, com cuidado. Pode fazer: bola dupla (peanut) em suboccipitais — deitar, bola dupla na base do crânio, relaxar peso da cabeça. 2-3min. Excelente cefaleia tensional. Bola tênis em paravertebrais cervicais — deitar, bola cada lado coluna (NÃO sobre vértebras). Pressão suave, movimentos mínimos. NÃO fazer: foam roller ROLANDO sobre cervical (vértebras pequenas vulneráveis), bola lacrosse (dura demais) sobre processos espinhosos cervicais, pressão intensa lateral do pescoço (carótida/vago ali), movimentos bruscos/estalidos.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: 'A bola dupla em suboccipitais é o melhor exercício de liberação que conheço. Tenho cefaleia tensional crônica (9h computador) e 3min deitada com bola dupla na base do crânio TODA noite reduziu minhas dores em uns 50 por cento. Primeiro minuto desconfortável, depois músculos soltam e é quase meditativo. Ritual sagrado do sono.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010',
    content: 'Sobre lombar: eu fazia EXATAMENTE o que Lucas descreve — rolava a lombar e sempre saía pior. Quando troquei pra bola lacrosse no QL (deitado de lado) + foam roller em torácica + alongamento psoas, minha rigidez lombar SUMIU em 3 semanas de rotina diária. Lombar era VÍTIMA. Culpados eram glúteo, torácica e psoas encurtado.',
    isAIResponse: false,
  },

  // CONVERSA 7: Quanto tempo? Rápido ou devagar?
  {
    userId: 'user_sim_003',
    content: 'Cada vídeo ensina coisa diferente. Uns dizem "role rápido, vai e volta". Outros "encontre ponto e SEGURE 2 minutos". Qual técnica correta? Quanto tempo por região? Qual pressão ideal?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Mariana, existem DUAS técnicas diferentes com objetivos diferentes. AMBAS válidas. TÉCNICA 1 — ROLAMENTO LENTO: role devagar 1-2cm/segundo, 3-5 passadas pelo músculo, 30-60s por grupo. Objetivo: redução geral de tônus, aumento de ADM, aquecimento. Quando: pré-treino, sem ponto específico. Pressão: moderada 4-6/10. TÉCNICA 2 — PRESSÃO SUSTENTADA: encontrar ponto de tensão/dor e MANTER estático. 30-90s no ponto (ou até sentir release — redução de 50%+ na dor/tensão). Objetivo: reduzir trigger point específico. Quando: pós-treino, pontos específicos de dor. Pressão: moderada a alta 5-7/10 — desconfortável mas tolerável. O "RELEASE": primeiros 15-30s dor pode AUMENTAR. Depois de 30-60s: SNC aceita pressão, tônus cai reflexamente. Você sentirá: redução dor, amolecimento, rolo afunda mais. Se após 90s sem release — saia, tente próxima sessão. NÃO force. ERROS: rolar RÁPIDO demais (tipo massagem), pressão excessiva "tem que doer", >5min no MESMO ponto (irritação), prender respiração (respire normalmente). ESCALA PRESSÃO IDEAL: 1-3/10 muito leve pouco efeito, 4-6/10 IDEAL (desconforto produtivo), 7-8/10 limiar, 9-10/10 contraproducente — músculo CONTRAI. Dica OURO: respire normalmente durante liberação. Inspirar profundo, expirar lentamente soltando corpo, sentir ponto soltar. Respiração é 50 por cento da técnica.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: 'A dica de RESPIRAR durante liberação é subestimada. Eu prendia a respiração (como abdominal) e ficava MAIS tensa. Quando comecei a expirar profundamente enquanto mantinha pressão no ponto, release vem MUITO mais rápido. Inspirar profundo, expirar lentamente, sentir ponto soltar. Respiração é 50 por cento.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_006',
    content: 'Resumo prático que eu sigo: role devagar até achar o vilão, pare no vilão, respire fundo 4-5x, siga pro próximo. Leva 30-60s por ponto. Em 5min cubro corpo todo. Simples, sem complicação, consistente todo dia. Funciona infinitamente melhor que os 20min de rolamento aleatório/frenético que fazia antes.',
    isAIResponse: false,
  },

  // CONVERSA 8: Libera miofascial substitui alongamento?
  {
    userId: 'user_sim_009',
    content: 'Se foam roller aumenta amplitude de movimento, posso SUBSTITUIR alongamento? Odeio alongar e adoro foam roller. Mesma coisa no final?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Bruno, NÃO são mesma coisa. Mecanismos diferentes, efeitos se complementam. FOAM ROLLER: modulação neural (tônus). ADM dura 10-20min. Força neutro (não reduz). Rigidez reduz agudo. DOMS reduz. Efeito estrutural mínimo a longo prazo. ALONGAMENTO ESTÁTICO: deformação viscoelástica tecido. ADM dura 30-60min. Força pode reduzir 3-5% se >60s pré-treino. Rigidez reduz agudo/crônico. DOMS evidência mista. Mudança estrutural SIM — com prática crônica adiciona sarcômeros em série → ganho real duradouro ADM. O QUE SIGNIFICA: Foam roller ótimo para efeitos AGUDOS. Pouca evidência de mudança LONGO PRAZO. Alongamento crônico (4+ semanas, 3-5x/semana, 30-60s por músculo) músculo REALMENTE ADICIONA sarcômeros — ganho real durável. Foam roller NÃO faz isso. RESPOSTA PRÁTICA: se objetivo é ADM aguda (pré-treino) — foam roller tão bom quanto alongamento E não reduz força. PODE substituir pré-treino. Se objetivo é flexibilidade LONGO PRAZO — foam roller INSUFICIENTE. Precisa alongamento consistente. NÃO pode substituir. Se objetivo é recuperação — foam roller SUPERIOR ao alongamento pós-treino para DOMS. COMBO IDEAL: pré-treino foam roller 2-3min (mobilidade aguda), pós-treino foam roller 5min (recuperação), separado alongamento 10-15min 2-3x/semana (ganho flexibilidade durável).',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_011',
    content: 'Faço exatamente isso: foam roller pré e pós-treino na academia + 10min alongamento à noite em casa assistindo série. Em 3 meses meu overhead squat melhorou absurdamente. Foam roller dava ADM temporária pro treino, alongamento noturno consolidou flexibilidade. Um sem o outro não dava resultado.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_007',
    content: 'A tabela comparativa é perfeita. Eu achava que era mesma coisa e fazia SÓ foam roller. Flexibilidade estagnou. Quando adicionei 15min alongamento estático 3x/semana (isquiotibiais/flexores quadril), destravou. Foam roller me "soltava" pro treino mas não mudava meu range permanente. As duas juntas = resultado máximo.',
    isAIResponse: false,
  },
];

async function main() {
  console.log('\n🏟️  SEED: LIBERAÇÃO MIOFASCIAL\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%liberacao-miofascial%,slug.ilike.%liberacao_miofascial%,name.ilike.%liberação miofascial%,name.ilike.%liberacao miofascial%')
    .limit(1);

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .or('slug.ilike.%miofascial%,name.ilike.%miofascial%,slug.ilike.%liberacao%,name.ilike.%liberação%')
      .limit(10);
    if (allArenas?.length) {
      console.log('Arenas encontradas:');
      allArenas.forEach(a => console.log(`  - ${a.slug} | ${a.name}`));
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
  const baseTime = new Date('2026-02-09T06:00:00Z');
  let created = 0;

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const postTime = new Date(baseTime.getTime() + i * 16 * 60 * 1000);

    const { error: insertError } = await supabase
      .from('Post')
      .insert({
        id: randomUUID(),
        arenaId: arena.id,
        userId: post.userId,
        content: post.content,
        isPublished: true,
        isApproved: true,
        isAIResponse: post.isAIResponse,
        viewCount: Math.floor(Math.random() * 85) + 15,
        likeCount: post.isAIResponse
          ? Math.floor(Math.random() * 30) + 16
          : Math.floor(Math.random() * 20) + 4,
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

  // 4. Atualizar contador
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  await supabase
    .from('Arena')
    .update({ totalPosts: count, status: count > 10 ? 'HOT' : 'WARM' })
    .eq('id', arena.id);

  console.log(`📊 Total posts na arena: ${count}`);
  console.log('\n🎉 Seed "Liberação Miofascial" completado com sucesso!\n');
}

main().catch(console.error);
