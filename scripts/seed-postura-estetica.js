const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const POSTS = [
  // Thread 1: Pelve Anterior - O Inimigo do Abdômen
  {
    content: 'Pelvic tilt anterior é quando a pelve "tomba" para frente. Parece simples, mas muda completamente a aparência do abdômen, mesmo com baixo percentual de gordura.',
    arenaId: null,
    userId: 'user_sim_001',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 247,
    likeCount: 38,
  },
  {
    content: 'Anatomicamente, quando inclinamos a pelve para frente, aumentamos a curvatura da coluna. Isso empurra as vísceras abdominais para frente e projeta a barriga',
    arenaId: null,
    userId: 'user_sim_002',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 189,
    likeCount: 31,
  },
  {
    content: 'Vi isso em muito fitness influencer. Fazem abdômen com pelve anterior só pra parecer que tem mais músculos. Depois andam com a barriga saindo',
    arenaId: null,
    userId: 'user_sim_003',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 156,
    likeCount: 24,
  },
  {
    content: 'A solução é ativar o core anteroposteriormente - não é só abdômen reto, é todo o cilindro. Glúteos, piso pélvico, transverso, reto abdominal.',
    arenaId: null,
    userId: 'user_sim_004',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 212,
    likeCount: 42,
  },
  {
    content: 'Teste: pressione a coluna contra uma parede e puxe a barriga para dentro. Sinta o glúteo apertando também. Esse é o pattern correto.',
    arenaId: null,
    userId: 'ai_facilitator',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: true,
    isApproved: true,
    viewCount: 298,
    likeCount: 56,
  },

  // Thread 2: Ombros Protrusos - Upper Crossed Syndrome
  {
    content: 'Meu maior problema é essa postura de quem fica digitando. Ombros para frente, coluna torácica redonda. Pior que ninguém me disse que era "ruim" esteticamente.',
    arenaId: null,
    userId: 'user_sim_005',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 334,
    likeCount: 67,
  },
  {
    content: 'Ombro protuso reduz a largura visual do peito e do dorso. Faz o pescoço parecer curto também. É tipo estar sempre curvado.',
    arenaId: null,
    userId: 'user_sim_006',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 267,
    likeCount: 45,
  },
  {
    content: 'O padrão Upper Crossed é: músculos do peito e levantador da escápula CURTOS, músculos das costas (romboides, lower trap) FRACOS.',
    arenaId: null,
    userId: 'user_sim_007',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 198,
    likeCount: 33,
  },
  {
    content: 'Treino: face pulls, retração escapular, pectoral stretch com porta, Dead bugs. Tudo 3-4x semana. Leva meses pra corrigir anos de má postura.',
    arenaId: null,
    userId: 'user_sim_008',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 289,
    likeCount: 52,
  },
  {
    content: 'E ainda tem o mindset: parar de se curvar durante o dia. Manter ombros pra trás, peito aberto. É comportamento antes de ser anatomia.',
    arenaId: null,
    userId: 'ai_facilitator',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: true,
    isApproved: true,
    viewCount: 356,
    likeCount: 78,
  },

  // Thread 3: Assimetria de Ombros - Normal ou Problema?
  {
    content: 'Meu ombro direito é visivelmente mais baixo que o esquerdo. Preocupante? Operação? Ou é normal todo mundo ter?',
    arenaId: null,
    userId: 'user_sim_009',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 423,
    likeCount: 89,
  },
  {
    content: 'Maior parte das pessoas tem assimetria de ombro. Uns mm de diferença é totalmente normal. Problema é quando vem acompanhado de dor.',
    arenaId: null,
    userId: 'user_sim_010',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 356,
    likeCount: 64,
  },
  {
    content: 'Se é funcional (sem dor), é questão estética só. Camisetas ajustadas vão revelar mesmo. Pode trabalhar com compensações posturais.',
    arenaId: null,
    userId: 'user_sim_011',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 289,
    likeCount: 51,
  },
  {
    content: 'Vi pessoas operarem só por estética e se arrependarem. Operação fixa estrutura mas não muda movimento compensatório.',
    arenaId: null,
    userId: 'user_sim_012',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 267,
    likeCount: 44,
  },
  {
    content: 'Avaliação: foto de frente relaxado vs postura corrigida. Dinâmica vs estática. Se força for igual nos dois lados, é só anatomia normal.',
    arenaId: null,
    userId: 'ai_facilitator',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: true,
    isApproved: true,
    viewCount: 401,
    likeCount: 91,
  },

  // Thread 4: Tech Neck - O Vilão das Redes Sociais
  {
    content: 'Meu pescoço tá saindo para frente. Passava horas no celular trabalhando. Agora meu rosto parece "descido" na frente.',
    arenaId: null,
    userId: 'user_sim_013',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 512,
    likeCount: 104,
  },
  {
    content: 'Tech neck cria o "double chin" visual mesmo sem gordura extra. Porque a cabeça projeta para frente, o queixo fica em ângulo errado.',
    arenaId: null,
    userId: 'user_sim_014',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 445,
    likeCount: 88,
  },
  {
    content: 'Fisicamente, aumenta lordose cervical. Músculos do pescoço anterior ficam tensos, posteriores fracos. Piora dor nas costas tbm.',
    arenaId: null,
    userId: 'user_sim_015',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 378,
    likeCount: 72,
  },
  {
    content: 'Correção: monitor na altura dos olhos, celular em posição mais alta, exercícios de cervical extension, chin tucks, postura consciente.',
    arenaId: null,
    userId: 'user_sim_016',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 423,
    likeCount: 81,
  },
  {
    content: 'Leva 6-8 semanas pra notar melhoria visual. Músculos do pescoço respondem rápido, mas o padrão se corrige aos poucos.',
    arenaId: null,
    userId: 'ai_facilitator',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: true,
    isApproved: true,
    viewCount: 489,
    likeCount: 106,
  },

  // Thread 5: Joelho Valgo - Estética e Função
  {
    content: 'Meus joelhos parecem se juntar quando fico em pé relaxado. Afeta a beleza da perna? Preciso corrigir?',
    arenaId: null,
    userId: 'user_sim_017',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 334,
    likeCount: 67,
  },
  {
    content: 'Joelho valgo leve não é "feio", mas perna reta é considerada mais linear/estética. Agora, se vem com dor, aí sim precisa',
    arenaId: null,
    userId: 'user_sim_018',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 289,
    likeCount: 54,
  },
  {
    content: 'O problema de valgo é que concentra carga no interior do joelho. Gera dor, lesão meniscal, artrose prematura.',
    arenaId: null,
    userId: 'user_sim_019',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 267,
    likeCount: 46,
  },
  {
    content: 'Treino pra valgo: glúteo médio e máximo, abdutor de quadril, exercises contra adução. Monster walks, lateral band walks.',
    arenaId: null,
    userId: 'user_sim_020',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 312,
    likeCount: 58,
  },
  {
    content: 'Se for estrutural (ósseo), treino não muda muito. Mas se for muscular, pra 6-12 meses de treino específico você vê diferença.',
    arenaId: null,
    userId: 'ai_facilitator',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: true,
    isApproved: true,
    viewCount: 378,
    likeCount: 72,
  },

  // Thread 6: Proporções Ombro-Quadril
  {
    content: 'Vi vídeos falando sobre razão ideal de largura de ombro vs quadril. Qual é mesmo? Meus ombros são mais largos.',
    arenaId: null,
    userId: 'user_sim_021',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 267,
    likeCount: 52,
  },
  {
    content: 'Anatomicamente, em homens, ombro mais largo que quadril é padrão. Em mulheres, quadril largo é feminino biologicamente.',
    arenaId: null,
    userId: 'user_sim_022',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 234,
    likeCount: 43,
  },
  {
    content: 'Visualmente, V-taper (ombros > quadril) é considerado mais musculoso. Mas proporcional também combina com altura.',
    arenaId: null,
    userId: 'user_sim_023',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 198,
    likeCount: 37,
  },
  {
    content: 'Muito maior diferença fica estranho (tipo físico culturista). Natural é quando parece equilibrado pro seu corpo.',
    arenaId: null,
    userId: 'user_sim_024',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 212,
    likeCount: 41,
  },
  {
    content: 'Se quiser aumentar proporção visualmente: mais deltoides (treino lateral), glúteo moderado. Não é sobre ficar anabolizado.',
    arenaId: null,
    userId: 'ai_facilitator',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: true,
    isApproved: true,
    viewCount: 289,
    likeCount: 65,
  },

  // Thread 7: Lordose Lombar Exagerada
  {
    content: 'Minha coluna tem muita curvatura. Parece que empino demais o glúteo mesmo quando estou relaxada. Isso é ruim?',
    arenaId: null,
    userId: 'user_sim_025',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 378,
    likeCount: 76,
  },
  {
    content: 'Lordose exagerada cria projeção abdominal mesmo sem gordura. Parece que tem uma barriga saindo, quando na verdade é curvatura.',
    arenaId: null,
    userId: 'user_sim_026',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 312,
    likeCount: 61,
  },
  {
    content: 'Funcionalmente, comprime discos lombares. Afeta também a estética das costas - parece hiperlordose demais.',
    arenaId: null,
    userId: 'user_sim_027',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 267,
    likeCount: 51,
  },
  {
    content: 'Alguns "booty gains" vêm de lordose aumentada, não necessariamente mais glúteo. Por isso muitas mulheres sentem dor.',
    arenaId: null,
    userId: 'user_sim_028',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 289,
    likeCount: 54,
  },
  {
    content: 'Correção: anterior pelvic tilt reduction (glúteo + core), mobilidade de quadril, stretching psoás, dead bugs, bird dogs regularmente.',
    arenaId: null,
    userId: 'ai_facilitator',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: true,
    isApproved: true,
    viewCount: 345,
    likeCount: 71,
  },

  // Thread 8: Pés Planos - Efeito em Cadeia
  {
    content: 'Tenho pé plano de um lado e normal do outro. Acho que tá afetando minha marcha inteira. Qual o cascata?',
    arenaId: null,
    userId: 'user_sim_029',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 423,
    likeCount: 88,
  },
  {
    content: 'Pé plano aumenta pronação. Aí o tornozelo vira pra dentro. Joelho vira pra dentro. Quadril desalinha. Coluna compensa. Cascata real.',
    arenaId: null,
    userId: 'user_sim_030',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 356,
    likeCount: 72,
  },
  {
    content: 'Você vê alguém com pé plano, talvez tenha joelho valgo, assimetria de quadril, escoliose funcional. Tudo conectado.',
    arenaId: null,
    userId: 'user_sim_031',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 289,
    likeCount: 58,
  },
  {
    content: 'Solução começa pelo pé: palmilha ortopédica se muito grave, exercícios intrínseco de pé, treino de estabilidade tornozelo.',
    arenaId: null,
    userId: 'user_sim_032',
    isPublished: true,
    isPinned: false,
    isOfficial: false,
    isAIResponse: false,
    isApproved: true,
    viewCount: 267,
    likeCount: 52,
  },
];

async function seedPosturaEstetica() {
  try {
    console.log('[SEED] Iniciando população de Postura & Estética Real...\n');

    // Fetch arena by slug or name
    console.log('[SEED] Buscando arena...');
    const { data: arenas, error: arenasError } = await supabase
      .from('Arena')
      .select('*')
      .or('slug.ilike.%postura-estetica%,name.ilike.%Postura%Estética%');

    if (arenasError) {
      console.error('❌ Erro ao buscar arena:', arenasError.message);
      return;
    }

    if (!arenas || arenas.length === 0) {
      console.error('❌ Arena não encontrada');
      return;
    }

    const arena = arenas[0];
    console.log(`✅ Arena encontrada: "${arena.name}" (${arena.slug})\n`);

    // Delete old posts
    console.log('[SEED] Limpando posts antigos...');
    const { data: oldPosts } = await supabase
      .from('Post')
      .select('id')
      .eq('arenaId', arena.id);

    if (oldPosts && oldPosts.length > 0) {
      const { error: deleteError } = await supabase
        .from('Post')
        .delete()
        .eq('arenaId', arena.id);

      if (!deleteError) {
        console.log(`✅ ${oldPosts.length} posts antigos removidos\n`);
      }
    }

    // Create new posts
    let postsCreated = 0;

    for (let i = 0; i < POSTS.length; i++) {
      const post = POSTS[i];

      const postData = {
        ...post,
        id: randomUUID(),
        arenaId: arena.id,
        createdAt: new Date(Date.now() - (POSTS.length - i) * 14 * 60000),
      };

      const { error: insertError } = await supabase
        .from('Post')
        .insert([postData]);

      if (!insertError) {
        postsCreated++;
      } else {
        console.warn(`⚠️  Falha ao inserir post ${i + 1}:`, insertError.message);
      }
    }

    console.log(`\n✅ Seed concluído com sucesso!`);
    console.log(`   - Posts criados: ${postsCreated}/${POSTS.length}`);
    console.log(`   - Arena: ${arena.name}`);
  } catch (error) {
    console.error('❌ Erro durante seed:', error.message);
  }
}

seedPosturaEstetica();
