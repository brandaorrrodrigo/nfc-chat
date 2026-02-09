require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ============================================================
// SEED: POSTURA & ESTÉTICA REAL
// 40 posts | 8 conversas de 5 posts cada
// Foco: como postura impacta aparência, mitos posturais,
// treino corretivo, estética funcional, corpo real
// ============================================================

const POSTS = [

  // CONVERSA 1: Barriga saliente mesmo magra — gordura ou postura?
  {
    userId: 'user_sim_002',
    content: 'Sou magra (IMC 21), braços e pernas finos, mas minha barriga é SALIENTE. Parece que estou grávida de 3 meses. Já fiz déficit calórico agressivo e a barriga não some — só perdi mais músculo nos membros. Minha personal disse que pode ser postura (anteversão pélvica) e não gordura. Como saber a diferença? E se for postura, como corrigir?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Juliana, esse é um dos motivos mais comuns de frustração estética — e frequentemente o problema NÃO é gordura. Teste rápido: fique de pé de lado, coloque uma mão no osso do quadril e outra no sacro. Se a mão da frente está MUITO mais baixa que a de trás, é anteversão pélvica. Agora contraia glúteo e abdômen como se fosse guardar a barriga — se a barriga diminui visivelmente, é postural, não gordura. Causas: flexores de quadril encurtados (psoas, reto femoral) + glúteo e abdômen fracos. É a causa MAIS COMUM em mulheres jovens magras com barriga saliente. NÃO se resolve com déficit calórico — é biomecânica. Protocolo: alongamento do psoas, dead bug 3x10, ponte de glúteo com foco em retroversão pélvica 3x12, bird-dog 3x8 cada lado. Timeline: 1-2 semanas consciência corporal, mês 1-2 melhora estática, mês 3-4 melhora visual significativa. Mais déficit calórico numa pessoa com IMC 21 é perder músculo. Se for anteversão, o tratamento é exercício corretivo.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_003',
    content: 'ERA EU. IMC 20, barriga saliente, fiz déficit até ficar com cara de doente e a barriga continuava. Uma fisioterapeuta identificou anteversão pélvica de 18 graus (normal é até 10-12 graus). Fiz 3 meses de correção — dead bug religioso + alongamento de psoas + ponte de glúteo focando em retroversão. Minha barriga reduziu VISIVELMENTE sem perder 1 grama. Era postura o tempo todo. Anos de frustração resolvidos com biomecânica, não com dieta.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: 'Complementando: no meu caso era COMBINAÇÃO. Anteversão pélvica + distensão por intolerância a FODMAP. Corrigi a postura E fiz dieta low FODMAP por 6 semanas. A barriga reduziu uns 70 por cento. Então vale investigar os dois caminhos ao mesmo tempo. Gastroenterologista + fisioterapeuta que entenda biomecânica.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: 'Uma dica visual que me ajudou a entender a anteversão: tira uma foto sua de lado relaxada, depois tira outra contraindo glúteo e abdômen forte. Se a diferença na barriga for drástica, é postura. Se for mínima, é gordura ou distensão. Simples e qualquer uma faz em casa. Salvei essa comparação no celular e foi o que me motivou a fazer o corretivo em vez de mais dieta.',
    isAIResponse: false,
  },

  // CONVERSA 2: Ombros projetados pra frente — cifose visual
  {
    userId: 'user_sim_007',
    content: 'Meus ombros são muito pra frente e dá um aspecto de "corcunda" mesmo eu não sendo gorda. Em fotos de lado fico horrível. Já tentei "puxar os ombros pra trás" conscientemente mas em 5 minutos volto ao normal. Isso é cifose? Consigo corrigir com exercício ou preciso de colete postural?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Fernanda, o que você descreve é protração de ombros — frequentemente combinada com cifose torácica aumentada. É extremamente comum e sim, exercício corrige. Colete postural NÃO funciona. O colete mantém ombros pra trás passivamente — os músculos que DEVERIAM fazer isso ficam AINDA MAIS FRACOS. Quando tira, volta ou piora. O que está acontecendo (Upper Crossed Syndrome): Músculos encurtados — peitoral maior/menor, trapézio superior, esternocleidomastóideo. Músculos fracos — trapézio médio/inferior, romboides, serrátil anterior. Protocolo: Liberar encurtados — pec stretch na porta, foam roller torácico, auto-liberação de trapézio com bolinha. Fortalecer fracos — face pull 3x15, remada com retração escapular 3x12, Y-T-W no banco inclinado 2x10 cada, band pull-apart 3x15. Timeline: semana 1-4 melhora mobilidade, mês 2-3 fortalecimento visível, mês 3-6 mudança postural automática. Face pulls + band pull-aparts são exercícios pra vida toda.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: 'Face pull 3x/semana + foam roller torácico diário = transformação em 4 meses. Sério. Meus ombros paravam 3-4cm à frente da linha da orelha, agora estão quase alinhados. Joguei meu colete fora (gastei R$ 180 à toa naquilo). O face pull é o exercício mais subestimado da academia. E o melhor: minha dor no pescoço de anos também sumiu como bônus.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: 'Dica de quem trabalha 10h no computador: coloquei um alarme a cada 45 minutos que diz ESCÁPULAS. Faço 10 retrações escapulares + 5 chin tucks ali mesmo na cadeira. Leva 30 segundos. Isso + face pull no treino mudou minha postura em fotos de forma visível. Minha mãe que não me via há 3 meses comentou que eu parecia mais alta. Era a postura.',
    isAIResponse: false,
  },

  // CONVERSA 3: Glúteo "caído" — é genética ou treino errado?
  {
    userId: 'user_sim_020',
    content: 'Treino glúteo 3x/semana há 2 anos e meu bumbum continua "caído". Não é falta de músculo — quando contraio é duro. Mas relaxado parece que escorre pra baixo. Minha amiga treina menos que eu e tem bumbum empinado naturalmente. É genética e devo aceitar, ou tem algo que posso fazer?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Beatriz, essa é uma das perguntas mais honestas sobre estética. A resposta envolve genética SIM, mas também biomecânica. Os fatores genéticos que você NÃO controla: inserção muscular do glúteo máximo — inserções mais altas no ílio criam aparência mais empinada naturalmente. Inserções mais baixas criam aparência mais distribuída. Formato pélvico — pelve mais larga com maior inclinação anterior cria mais projeção glútea. Distribuição de gordura — algumas depositam preferencialmente na parte superior (aparência redonda), outras na inferior. Os fatores que você CONTROLA: Proporção entre porções do glúteo — a maioria foca na porção inferior/média. Para aparência empinada: abdução com cabo, side-lying hip abduction, hip thrust com banda acima dos joelhos, seated abduction. Relação glúteo vs isquiotibiais — isquiotibiais desenvolvidos "empurram" glúteo pra cima. Stiff romeno e leg curl são essenciais. Anteversão pélvica — uma leve anteversão aumenta projeção. Protocolo: Hip thrust com banda 4x12, abdução no cabo 3x15, stiff romeno 4x10, nordic curl 3x6, ponte unilateral 3x10. Frequência 3-4x/semana, 15-20 séries diretas de glúteo.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_017',
    content: 'O ponto sobre isquiotibiais é OURO. Eu negligenciei posterior de coxa por anos e meu glúteo parecia solto por baixo. Quando minha coach adicionou stiff pesado 2x/semana + nordic curl, em 3 meses a transição coxa-glúteo mudou completamente. Os isquiotibiais funcionam como uma prateleira que sustenta o glúteo.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Sobre a porção superior: quando comecei a fazer abdução com cabo em pé a parte de cima do meu glúteo começou a preencher. Eram as fibras superiores do glúteo máximo + glúteo médio. Mudou o FORMATO visualmente — ficou mais arredondado em cima em vez de concentrar tudo embaixo. Antes eu só fazia agachamento e hip thrust e o resultado era bom mas faltava a parte de cima.',
    isAIResponse: false,
  },

  // CONVERSA 4: Ombros desnivelados — assimetria normal vs patológica
  {
    userId: 'user_sim_006',
    content: 'Minha fisioterapeuta disse que meu ombro direito é 2cm mais alto que o esquerdo. Nas fotos é visível. Ela falou em escoliose leve e me assustei. Isso afeta minha estética? Preciso corrigir? Treino musculação há 1 ano e nunca tinha percebido.',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Patricia, 2cm de diferença entre ombros é mais comum do que imagina. Lederman (2011) documentou: assimetrias posturais de até 1-3cm são encontradas em 85-95 por cento da população assintomática. A maioria tem um ombro ligeiramente mais alto (geralmente o lado dominante). O corpo humano NÃO é simétrico — assim como seu rosto não é perfeitamente simétrico. Quando investigar: dor associada, assimetria > 3cm e progressiva, limitação funcional. Sobre escoliose leve: escoliose funcional (postural) corrige quando se inclina pra frente. Escoliose estrutural leve < 20 graus Cobb raramente causa problemas. O que a assimetria geralmente é: dominância de um lado, trapézio superior mais hipertônico, hábitos posturais, diferença de ativação muscular. Para reduzir: exercícios unilaterais começando pelo lado fraco, auto-liberação do lado hipertônico, farmer carry unilateral. O que NÃO fazer: obcecar com simetria perfeita, parar de treinar por medo, gastar fortunas em alinhamento. 2cm de diferença é imperceptível para 99 por cento das pessoas no dia a dia.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_016',
    content: 'Passei por isso! Fui numa fisio que me mostrou 47 problemas posturais numa avaliação de 15 minutos. Saí de lá achando que estava toda torta e com MEDO de treinar. Fui em outra profissional que me disse: você tem variações anatômicas normais, está sem dor, pode treinar normalmente com alguns ajustes unilaterais. A primeira queria vender 24 sessões. A segunda me devolveu a confiança.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: 'O exercício unilateral equilibrou minha assimetria de ombro visivelmente. Meu lado esquerdo era visivelmente menor. 6 meses de remada unilateral e desenvolvimento unilateral SEMPRE começando pelo esquerdo. Agora a diferença é mínima. A musculação BEM FEITA é o melhor corretivo postural que existe.',
    isAIResponse: false,
  },

  // CONVERSA 5: Pernas em X (valgo) — dá pra mudar a aparência?
  {
    userId: 'user_sim_008',
    content: 'Tenho joelho valgo (pernas em X) desde criança. Meus joelhos se tocam mas os tornozelos não. Esteticamente me incomoda MUITO — fico horrível de shorts. Tenho 25 anos, já vi que o osso não muda depois de adulta. Existe ALGO que melhore pelo menos a aparência? Exercício muda alguma coisa ou vou ter que aceitar?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Camila, vou ser honesta sobre o que muda e o que não muda, e depois te dar um plano para maximizar o que está no seu controle. O que NÃO muda (estrutural): após o fechamento das placas de crescimento, o ângulo ósseo do fêmur e tíbia é fixo. Se o valgo é estrutural, exercício não altera o osso. O que MUDA (funcional e muscular) — e é MUITO: Valgo funcional vs estrutural — muitas mulheres têm um componente funcional significativo. Glúteo médio fraco faz fêmur girar internamente, adutores hipertônicos puxam joelho pra medial, tibial posterior fraco causa pronação do pé. Hipertrofia estratégica: quadríceps lateral bem desenvolvido preenche contorno externo da coxa, glúteo médio bem desenvolvido preenche lateral do quadril, panturrilha desenvolvida equilibra proporção. Protocolo: Clamshell com banda 3x20, monster walk 3x15, single-leg glute bridge 3x12, leg press com pés juntos 4x12, abdução de quadril 4x15. Timeline: 4-6 meses perceberá valgo dinâmico reduzido e contorno lateral mais preenchido.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_002',
    content: 'Camila, eu tenho valgo estrutural E funcional. A parte funcional melhorou MUITO com monster walk + clamshell + agachamento com banda. Meus joelhos não colapsam mais no agachamento. A parte estrutural continua — meus joelhos ainda se tocam. MAS esteticamente melhorou porque vasto lateral e glúteo médio preencheram a silhueta. Não ficou reto, mas ficou MUITO mais proporcional.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: 'Adendo sobre pronação do pé: fui numa podóloga e descobri que meu pé pronava excessivamente — empurrava joelho pra dentro — aumentava valgo funcional. Com uma palmilha de correção + short foot exercise, meu valgo DINÂMICO reduziu uns 30 por cento. Vale investigar o pé antes de focar só no joelho.',
    isAIResponse: false,
  },

  // CONVERSA 6: Pescoço "de tartaruga" — cabeça anteriorizada
  {
    userId: 'user_sim_016',
    content: 'Trabalho 9h no computador e meu pescoço vai cada vez mais pra frente. Parece pescoço de tartaruga. Vi no espelho de lado e levei um susto — minha orelha está uns 5cm à frente do ombro. Tenho 30 anos e já pareço que tenho 50 de postura. Dor no pescoço constante. Consigo reverter ou já era?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Daniela, a anteriorização da cabeça é a epidemia postural do século XXI. A cada centímetro que a cabeça avança, o pescoço sustenta ~4,5kg a mais de carga. Se está 5cm à frente, seu pescoço está sustentando ~22kg extras. E sim, é reversível na grande maioria dos casos. Por que acontece: tela do computador abaixo da linha dos olhos, celular, cadeira sem suporte, cifose torácica. Após meses/anos: tecidos moles ADAPTAM — a posição anteriorizada se torna o novo normal. Encurtado/hipertônico: suboccipitais, esternocleidomastóideo, escalenos, peitoral menor. Enfraquecido: flexores cervicais profundos, trapézio inferior, extensores torácicos. Protocolo Nível 1: chin tuck diário 10 reps, ergonomia perfeita (topo de tela na altura dos olhos), regra 20-20-20 a cada 20 minutos. Nível 2: foam roller torácico 2 min, auto-liberação de suboccipitais, alongamento de ECM. Nível 3: chin tuck com resistência 3x8 (o mais importante), face pull 3x15, Y-raise 3x10, remada 3x12. Timeline: semana 1-2 dor pode aumentar levemente, mês 1 melhora mobilidade, mês 2-3 mudança postural visível, mês 4-6 novo padrão automático.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: 'O chin tuck com resistência mudou meu jogo. Parece simples demais pra funcionar, mas os flexores cervicais profundos são os estabilizadores que ninguém treina. Em 6 semanas minha dor no pescoço de ANOS reduziu de 6 para 2 em escala de dor. E minha postura em fotos de lado mudou visivelmente. Meu namorado comentou que eu parecia mais confiante. Era o pescoço voltando pro lugar.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: 'Sobre ergonomia: gastei R$ 90 num suporte de notebook + R$ 60 num teclado externo. Melhor investimento em saúde que já fiz. Antes meu notebook ficava na mesa e eu passava 8h olhando pra BAIXO. Agora a tela está na altura dos olhos e meu pescoço agradece. Se você trabalha em casa, isso é OBRIGATÓRIO.',
    isAIResponse: false,
  },

  // CONVERSA 7: "Ombro largo" feminino — aceitar ou camuflar?
  {
    userId: 'user_sim_012',
    content: 'Tenho ombros largos naturalmente e ODEIO. Pareço uma nadadora. Fico desproporcional porque meu quadril é estreito. Minha mãe diz pra eu parar de treinar ombro porque vai alargar mais. Quero saber: treinar ombro alarga OSSO? E tem como disfarçar essa proporção com treino?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Roberta, treinar ombro NÃO alarga osso. Ponto. A clavícula tem comprimento fixo após o fechamento epifisário (~18-20 anos). Mas existe uma estratégia inteligente de treino para harmonizar proporções. Mito desfeito: musculação pode hipertrofiar deltóide — acrescenta 1-3cm de largura muscular. Mas a maioria das mulheres NÃO desenvolve ombros como nadadora com treino recreacional. A estratégia: não reduzir ombro (impossível) — AUMENTAR quadril/glúteo. A proporção visual ombro/quadril é o que o olho percebe. PRIORIDADE — Hipertrofia de glúteo e quadril: hip thrust pesado 4x8, agachamento sumo 4x12, abdução 4x15, búlgaro 3x10, stiff 4x10. Frequência 3-4x/semana. OMBRO — treinar sim, mas com estratégia: reduzir volume de deltóide lateral para 6-8 séries/semana, manter trapézio posterior 8-10 séries/semana. Evitar elevação lateral pesada. COSTAS — costas bem desenvolvidas criam V invertido que, combinado com quadril largo, forma ampulheta.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_002',
    content: 'Roberta, eu tenho ombro largo + quadril estreito também e a estratégia de investir em glúteo e coxa funcionou DEMAIS. Em 1 ano de foco pesado em posterior (hip thrust, stiff, búlgaro, abdução), meu quadril encheu e a proporção mudou visivelmente. O ombro é o mesmo — o que mudou foi a proporção. E não, meu ombro não ficou mais largo com treino moderado. Sua mãe está errada nessa.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_008',
    content: 'Acrescento algo sobre autoimagem: quando eu odiava meus ombros, eu via OMBRO em toda foto. Depois que comecei a trabalhar a proporção e me sentir melhor, percebi que ninguém além de mim nunca comentou sobre meus ombros. A gente hiperanalisa o próprio corpo de um jeito que os outros simplesmente não fazem.',
    isAIResponse: false,
  },

  // CONVERSA 8: Celulite e aparência da pele — o que treino muda?
  {
    userId: 'user_sim_001',
    content: 'Vou fazer a pergunta que toda mulher quer fazer: treino e dieta melhoram celulite DE VERDADE? Tenho celulite grau 2-3 em glúteo e posterior de coxa. Já gastei com cremes, drenagem, massagem modeladora, lipocavitação — melhora 1 semana e volta. Minha dermatologista disse celulite não tem cura. Mas vejo mulheres fitness que parecem não ter. É Photoshop ou treino resolve?',
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: 'Ana Paula, essa é a pergunta de milhões. Vou ser completamente honesta. O que é celulite: arquitetura do tecido subcutâneo feminino. Na mulher: septos fibrosos são perpendiculares à pele — formam câmaras — gordura hernia pra cima — ondulações. No homem: septos são cruzados (em X) — distribuem gordura uniformemente — menos celulite. Isso é genética, não doença. 85-98 por cento das mulheres pós-púberes têm algum grau de celulite. O que NÃO funciona: cremes anticelulite (efeito cosmético transitório), drenagem linfática (para edema, não estrutura), massagem modeladora (temporário), lipocavitação (não altera septos). O que funciona PARCIALMENTE: radiofrequência, subcisão (corta mecanicamente os septos). O que treino faz: hipertrofia do músculo ABAIXO — empurra pele pra fora de forma mais uniforme — reduz ondulações. É como inflar um balão murcho. Resultado: NÃO elimina celulite, mas REDUZ visivelmente — especialmente grau 1-2. Protocolo: hipertrofia de glúteo e posterior (hip thrust, stiff pesado), recomposição corporal (menos gordura + mais músculo), hidratação de pele, colágeno hidrolisado 5-15g/dia. Timeline: mês 1-2 sem mudança, mês 3-6 melhora gradual, mês 6-12 diferença clara.',
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: 'OBRIGADA pela honestidade. Já gastei facilmente R$ 8.000 em tratamentos estéticos para celulite nos últimos 3 anos. Resultado? Temporário TODA vez. Quando comecei a focar em hipertrofia de glúteo (hip thrust + stiff pesado, 4x/semana), em 6 meses minha celulite reduziu visivelmente sem gastar 1 real extra. O músculo crescendo esticou a pele por baixo.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_020',
    content: 'O ponto sobre iluminação deveria ser ensinado na escola. Tirei foto do meu glúteo com luz de banheiro (de cima, direta) — parecia lisinho. Tirei com luz lateral natural — celulite grau 2 evidente. MESMA pessoa, MESMO momento. Toda vez que vejo foto de influencer sem celulite eu penso na iluminação e no ângulo. Quando elas postam vídeo em movimento, na praia com sol real, adivinhem? TODAS têm textura.',
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: 'Sobre colágeno: comecei tomando 10g de colágeno hidrolisado/dia há 8 meses por causa de articulação e percebi melhora na pele como bônus. Não milagre, mas a pele do glúteo e coxa ficou mais firme ao toque. Combinado com hipertrofia pesada, o resultado visual é o melhor que já tive. E custou R$ 40/mês de colágeno + academia. Contra R$ 500/sessão de radiofrequência que eu fazia antes.',
    isAIResponse: false,
  },
];

async function main() {
  console.log('\n🏟️  SEED: POSTURA & ESTÉTICA REAL\n');

  // 1. Encontrar arena
  const { data: arenas, error: arenaError } = await supabase
    .from('Arena')
    .select('id, slug, name, totalPosts')
    .or('slug.ilike.%postura%estetica%,name.ilike.%postura%estética%,slug.ilike.%postura-estetica%')
    .limit(1);

  if (arenaError || !arenas?.length) {
    console.error('❌ Arena não encontrada! Erro:', arenaError?.message);
    console.log('Tentando busca alternativa...');
    const { data: allArenas } = await supabase
      .from('Arena')
      .select('id, slug, name, totalPosts')
      .ilike('name', '%postura%')
      .limit(10);
    if (allArenas?.length) {
      console.log('Arenas com "postura":');
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

  // 3. Inserir novos posts com timestamps incrementais
  const baseTime = new Date('2026-02-09T08:00:00Z');
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
        viewCount: Math.floor(Math.random() * 90) + 15,
        likeCount: post.isAIResponse
          ? Math.floor(Math.random() * 30) + 18
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

  // 4. Atualizar contador da arena
  const { count } = await supabase
    .from('Post')
    .select('*', { count: 'exact', head: true })
    .eq('arenaId', arena.id)
    .eq('isDeleted', false);

  const { error: updateError } = await supabase
    .from('Arena')
    .update({ totalPosts: count })
    .eq('id', arena.id);

  if (updateError) {
    console.error('❌ Erro ao atualizar arena:', updateError.message);
  } else {
    console.log(`✅ Arena atualizada com ${count} posts`);
  }

  console.log('\n🎉 Seed "Postura & Estética Real" completado com sucesso!\n');
}

main().catch(console.error);
