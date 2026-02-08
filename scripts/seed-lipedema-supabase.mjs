import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';

const supabase = createClient(supabaseUrl, supabaseKey);

// Gerar UUID
const generateId = () => randomUUID();

const arenaData = {
  slug: 'protocolo-lipedema',
  name: 'Protocolo Lipedema',
  description: 'Arena dedicada ao protocolo completo de tratamento para lipedema. Discutimos diagnóstico, estágios, nutrição, exercícios seguros, drenagem linfática, hormônios, suplementos com evidência científica e saúde mental.',
  icon: '🦵',
  color: 'from-purple-600 to-violet-600',
  category: 'saude',
  isActive: true,
  aiPersona: 'BALANCED',
  aiInterventionRate: 60,
  arenaType: 'GENERAL'
};

const posts = [
  { content: 'Oi pessoal! Acho que tenho lipedema, mas não tenho certeza. Como saber se é realmente lipedema e não é só gordura mesmo?', isAIResponse: false, userId: 'user_01' },
  { content: 'Excelente pergunta! Lipedema é diferente de gordura comum. Aqui estão os sinais principais: desproporcionalidade, simetria, hematomas fáceis, dor ao toque, textura "casca de laranja".', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Eu tenho isso! Procurei dermatologista, fui embora com antibiótico. Depois fui com angiologista e aí sim foi diagnóstico correto.', isAIResponse: false, userId: 'user_02' },
  { content: 'Verdade! O lipedema muitas vezes é diagnosticado como celulite ou gordura. Procurar um especialista é essencial.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'E quanto ao teste com pinça? Ouvi falar que o lipedema não muda tamanho com mudanças de peso...', isAIResponse: false, userId: 'user_03' },
  { content: 'Descobri que tenho lipedema estágio 2. O que significam esses estágios? Vai piorar mais?', isAIResponse: false, userId: 'user_04' },
  { content: 'Existem 4 estágios. **Estágio 1**: Pele lisa, edema leve. **Estágio 2**: Pele irregular, nódulos palpáveis. **Estágio 3**: Alterações de pele aumentadas. **Estágio 4**: Linfedema.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Estou há 5 anos com estágio 2 e nunca progrediu. Sigo protocolo: exercício aquático, drenagem, compressão e dieta.', isAIResponse: false, userId: 'user_05' },
  { content: 'Exato! A progressão depende do protocolo. Pacientes que seguem tratamento completo frequentemente mantêm o estágio por anos.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Qual é o tratamento mais importante dos 4?', isAIResponse: false, userId: 'user_06' },
  { content: 'Qual a melhor dieta para lipedema? Perder peso ajuda?', isAIResponse: false, userId: 'user_07' },
  { content: 'Lipedema é resistente a déficit calórico. A dieta funciona por seu efeito **anti-inflamatório**. Focar em: ômega-3, alimentos ricos em polifenóis, evitar açúcares/processados.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Que diferença! Sempre achei que era só fazer dieta. Vou tentar aumentar anti-inflamatórios.', isAIResponse: false, userId: 'user_08' },
  { content: 'Vale lembrar: hidratação reforçada é crucial. Beba 2.5-3L de água com sal para facilitar drenagem linfática.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Posso beber cerveja ou vinho com lipedema?', isAIResponse: false, userId: 'user_09' },
  { content: 'Quais exercícios são realmente seguros para lipedema?', isAIResponse: false, userId: 'user_10' },
  { content: 'Os MELHORES são: **Aquáticos** (piscina—o padrão-ouro), **Caminhada com compressão**, **Bicicleta ergométrica**, **Pilates baixo-impacto**, **Yoga**. EVITAR: **Corrida**, **HIIT**, **CrossFit**.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Quanto tempo de exercício por semana recomenda?', isAIResponse: false, userId: 'user_11' },
  { content: 'Protocolo ideal: 4-5x por semana, 30-45 min por sessão. Combinação: 2-3x aquático + 1-2x musculação adaptada + 1x yoga/pilates.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Drenagem linfática realmente ajuda? Vale a pena pagar sessões?', isAIResponse: false, userId: 'user_12' },
  { content: 'Sim, definitivamente ajuda! A drenagem linfática manual profissional movimenta fluido que está travado. 1-2x por semana é ideal.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Quanto custa drenagem e de quanto em quanto tempo?', isAIResponse: false, userId: 'user_13' },
  { content: 'Lipedema piora com menstruação? Devo mudar anticoncepcional?', isAIResponse: false, userId: 'user_14' },
  { content: 'Sim! Progesterona causa vasodilatação e retenção hídrica. Muitos casos pioram 5-7 dias antes da menstruação. Converse com gineco especializado!', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'E na menopausa? Vai piorar muito?', isAIResponse: false, userId: 'user_15' },
  { content: 'Menopausa é fator de risco para progressão. MAS: TRH bem prescrita pode ajudar. Ainda assim, protocolo completo é o pilar.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Quais suplementos realmente ajudam no lipedema?', isAIResponse: false, userId: 'user_16' },
  { content: 'Aqui estão os com maior evidência: **Diosmina** (⭐⭐⭐⭐⭐), **Flavonoides micronizados** (⭐⭐⭐⭐), **Ômega-3** (⭐⭐⭐⭐⭐), **Cúrcuma** (⭐⭐⭐⭐), **Quercetina** (⭐⭐⭐⭐), **Vitamina D** (⭐⭐⭐⭐⭐).', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Quanto tempo leva pra ver resultado?', isAIResponse: false, userId: 'user_17' },
  { content: '2-3 meses é o mínimo. Alguns estudos mostram diferença significativa em 6 meses.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Como lidar emocionalmente com o diagnóstico de lipedema?', isAIResponse: false, userId: 'user_18' },
  { content: 'É difícil! Lipedema afeta muito além do físico. É normal sentir raiva, tristeza, frustração. Encontre comunidade, procure psicólogo. O tratamento é longo, self-compassion é fundamental.', isAIResponse: true, userId: 'ai-lipedema-coach' },
  { content: 'Sinto muita culpa por "deixar meu corpo assim". Racional sou que lipedema é genético, mas emocionalmente...', isAIResponse: false, userId: 'user_19' },
  { content: 'Essa culpa é real e válida, mas é importante lembrar: lipedema é 100% genético. Você não causou e não poderia ter prevenido.', isAIResponse: true, userId: 'ai-lipedema-coach' }
];

async function main() {
  console.log('🏟️ SEED: Arena Protocolo Lipedema\n');

  try {
    // Buscar arena existente
    let { data: existingArena, error: findError } = await supabase
      .from('Arena')
      .select('*')
      .eq('slug', arenaData.slug)
      .maybeSingle();

    let arena;
    if (!existingArena) {
      console.log('⚠️ Arena não encontrada. Criando...');
      const arenaWithId = {
        ...arenaData,
        id: generateId(),
        createdAt: new Date().toISOString()
      };
      const { data: newArena, error: createError } = await supabase
        .from('Arena')
        .insert([arenaWithId])
        .select()
        .single();

      if (createError) throw createError;
      arena = newArena;
      console.log('✅ Arena criada:', arena.id);
    } else {
      arena = existingArena;
      console.log('✅ Arena encontrada:', arena.id, arena.name);
    }

    const ARENA_ID = arena.id;

    // Verificar posts existentes
    const { data: existingPosts, count: postCount } = await supabase
      .from('Post')
      .select('*', { count: 'exact' })
      .eq('arenaId', ARENA_ID);

    console.log(`📊 Posts existentes: ${postCount || 0}`);

    if ((postCount || 0) >= 20) {
      console.log('✅ Arena já tem posts suficientes. Pulando seed.');
      return;
    }

    // Criar posts
    console.log(`\n🧵 Criando ${posts.length} posts...`);

    let baseTime = new Date('2026-02-01T08:00:00Z');
    for (const post of posts) {
      baseTime = new Date(baseTime.getTime() + (45 + Math.floor(Math.random() * 90)) * 60000);

      const { error: postError } = await supabase
        .from('Post')
        .insert([{
          id: generateId(),
          content: post.content,
          arenaId: ARENA_ID,
          userId: post.userId,
          isAIResponse: post.isAIResponse,
          isPublished: true,
          isApproved: true,
          createdAt: baseTime.toISOString()
        }]);

      if (postError) {
        console.error(`❌ Erro ao criar post:`, postError.message);
      }
    }

    // Verificar final
    const { count: finalCount } = await supabase
      .from('Post')
      .select('*', { count: 'exact' })
      .eq('arenaId', ARENA_ID);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ SEED COMPLETO — Protocolo Lipedema');
    console.log('═'.repeat(60));
    console.log(`📊 Posts criados: ${finalCount}`);
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  }
}

main();
