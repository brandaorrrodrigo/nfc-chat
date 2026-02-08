import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';

const supabase = createClient(supabaseUrl, supabaseKey);
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

// Posts sem referência a usuários ainda
const postContents = [
  { content: 'Oi pessoal! Acho que tenho lipedema, mas não tenho certeza. Como saber se é realmente lipedema e não é só gordura mesmo?', isAIResponse: false },
  { content: 'Excelente pergunta! Lipedema é diferente de gordura comum. Aqui estão os sinais principais: desproporcionalidade, simetria, hematomas fáceis, dor ao toque, textura "casca de laranja".', isAIResponse: true },
  { content: 'Eu tenho isso! Procurei dermatologista, fui embora com antibiótico. Depois fui com angiologista e aí sim foi diagnóstico correto.', isAIResponse: false },
  { content: 'Verdade! O lipedema muitas vezes é diagnosticado como celulite ou gordura. Procurar um especialista é essencial.', isAIResponse: true },
  { content: 'E quanto ao teste com pinça? Ouvi falar que o lipedema não muda tamanho com mudanças de peso...', isAIResponse: false },
  { content: 'Descobri que tenho lipedema estágio 2. O que significam esses estágios? Vai piorar mais?', isAIResponse: false },
  { content: 'Existem 4 estágios. **Estágio 1**: Pele lisa, edema leve. **Estágio 2**: Pele irregular, nódulos palpáveis. **Estágio 3**: Alterações de pele aumentadas. **Estágio 4**: Linfedema.', isAIResponse: true },
  { content: 'Estou há 5 anos com estágio 2 e nunca progrediu. Sigo protocolo: exercício aquático, drenagem, compressão e dieta.', isAIResponse: false },
  { content: 'Exato! A progressão depende do protocolo. Pacientes que seguem tratamento completo frequentemente mantêm o estágio por anos.', isAIResponse: true },
  { content: 'Qual é o tratamento mais importante dos 4?', isAIResponse: false },
  { content: 'Qual a melhor dieta para lipedema? Perder peso ajuda?', isAIResponse: false },
  { content: 'Lipedema é resistente a déficit calórico. A dieta funciona por seu efeito **anti-inflamatório**. Focar em: ômega-3, alimentos ricos em polifenóis, evitar açúcares/processados.', isAIResponse: true },
  { content: 'Que diferença! Sempre achei que era só fazer dieta. Vou tentar aumentar anti-inflamatórios.', isAIResponse: false },
  { content: 'Vale lembrar: hidratação reforçada é crucial. Beba 2.5-3L de água com sal para facilitar drenagem linfática.', isAIResponse: true },
  { content: 'Posso beber cerveja ou vinho com lipedema?', isAIResponse: false },
  { content: 'Quais exercícios são realmente seguros para lipedema?', isAIResponse: false },
  { content: 'Os MELHORES são: **Aquáticos** (piscina—o padrão-ouro), **Caminhada com compressão**, **Bicicleta ergométrica**, **Pilates baixo-impacto**, **Yoga**. EVITAR: **Corrida**, **HIIT**, **CrossFit**.', isAIResponse: true },
  { content: 'Quanto tempo de exercício por semana recomenda?', isAIResponse: false },
  { content: 'Protocolo ideal: 4-5x por semana, 30-45 min por sessão. Combinação: 2-3x aquático + 1-2x musculação adaptada + 1x yoga/pilates.', isAIResponse: true },
  { content: 'Drenagem linfática realmente ajuda? Vale a pena pagar sessões?', isAIResponse: false },
  { content: 'Sim, definitivamente ajuda! A drenagem linfática manual profissional movimenta fluido que está travado. 1-2x por semana é ideal.', isAIResponse: true },
  { content: 'Quanto custa drenagem e de quanto em quanto tempo?', isAIResponse: false },
  { content: 'Lipedema piora com menstruação? Devo mudar anticoncepcional?', isAIResponse: false },
  { content: 'Sim! Progesterona causa vasodilatação e retenção hídrica. Muitos casos pioram 5-7 dias antes da menstruação. Converse com gineco especializado!', isAIResponse: true },
  { content: 'E na menopausa? Vai piorar muito?', isAIResponse: false },
  { content: 'Menopausa é fator de risco para progressão. MAS: TRH bem prescrita pode ajudar. Ainda assim, protocolo completo é o pilar.', isAIResponse: true },
  { content: 'Quais suplementos realmente ajudam no lipedema?', isAIResponse: false },
  { content: 'Aqui estão os com maior evidência: **Diosmina** (⭐⭐⭐⭐⭐), **Flavonoides micronizados** (⭐⭐⭐⭐), **Ômega-3** (⭐⭐⭐⭐⭐), **Cúrcuma** (⭐⭐⭐⭐), **Quercetina** (⭐⭐⭐⭐), **Vitamina D** (⭐⭐⭐⭐⭐).', isAIResponse: true },
  { content: 'Quanto tempo leva pra ver resultado?', isAIResponse: false },
  { content: '2-3 meses é o mínimo. Alguns estudos mostram diferença significativa em 6 meses.', isAIResponse: true },
  { content: 'Como lidar emocionalmente com o diagnóstico de lipedema?', isAIResponse: false },
  { content: 'É difícil! Lipedema afeta muito além do físico. É normal sentir raiva, tristeza, frustração. Encontre comunidade, procure psicólogo. O tratamento é longo, self-compassion é fundamental.', isAIResponse: true },
  { content: 'Sinto muita culpa por "deixar meu corpo assim". Racional sou que lipedema é genético, mas emocionalmente...', isAIResponse: false },
  { content: 'Essa culpa é real e válida, mas é importante lembrar: lipedema é 100% genético. Você não causou e não poderia ter prevenido.', isAIResponse: true }
];

async function main() {
  console.log('🏟️ SEED: Arena Protocolo Lipedema\n');

  try {
    // 1. Buscar ou criar usuário AI
    console.log('👤 Verificando usuário IA...');
    let { data: aiUser, error: aiUserError } = await supabase
      .from('User')
      .select('*')
      .eq('id', 'ai-lipedema-coach')
      .maybeSingle();

    const aiUserId = 'ai-lipedema-coach';

    if (!aiUser) {
      console.log('   Criando usuário IA...');
      const { data: newAiUser, error: createAiError } = await supabase
        .from('User')
        .insert([{
          id: aiUserId,
          email: 'ai-lipedema-coach@nutrifitcoach.com',
          name: 'IA Lipedema Coach',
          isBot: true
        }])
        .select()
        .single();

      if (createAiError) {
        console.log('   ⚠️ Não foi possível criar usuário IA, usando ID diretamente');
      } else {
        console.log('   ✅ Usuário IA criado');
      }
    } else {
      console.log('   ✅ Usuário IA encontrado');
    }

    // 2. Buscar usuários reais para posts de usuários
    const { data: realUsers } = await supabase
      .from('User')
      .select('id')
      .limit(5);

    const userIds = realUsers?.map(u => u.id) || [];
    let userIndex = 0;
    const getNextUserId = () => {
      if (userIds.length === 0) return aiUserId;
      const id = userIds[userIndex % userIds.length];
      userIndex++;
      return id;
    };

    console.log(`✅ ${userIds.length} usuários reais encontrados\n`);

    // 3. Buscar ou criar arena
    console.log('🏟️ Verificando arena...');
    let { data: existingArena, error: findError } = await supabase
      .from('Arena')
      .select('*')
      .eq('slug', arenaData.slug)
      .maybeSingle();

    let arena;
    if (!existingArena) {
      console.log('   Criando arena...');
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
      console.log('   ✅ Arena criada:', arena.id);
    } else {
      arena = existingArena;
      console.log('   ✅ Arena encontrada:', arena.id);
    }

    const ARENA_ID = arena.id;

    // 4. Verificar posts existentes
    const { count: postCount } = await supabase
      .from('Post')
      .select('*', { count: 'exact' })
      .eq('arenaId', ARENA_ID);

    console.log(`📊 Posts existentes: ${postCount || 0}\n`);

    if ((postCount || 0) >= 20) {
      console.log('✅ Arena já tem posts suficientes. Pulando seed.');
      return;
    }

    // 5. Criar posts
    console.log(`🧵 Criando ${postContents.length} posts...\n`);

    let baseTime = new Date('2026-02-01T08:00:00Z');
    let successCount = 0;
    let errorCount = 0;

    for (const post of postContents) {
      baseTime = new Date(baseTime.getTime() + (45 + Math.floor(Math.random() * 90)) * 60000);

      const userId = post.isAIResponse ? aiUserId : getNextUserId();

      const { error: postError } = await supabase
        .from('Post')
        .insert([{
          id: generateId(),
          content: post.content,
          arenaId: ARENA_ID,
          userId: userId,
          isAIResponse: post.isAIResponse,
          isPublished: true,
          isApproved: true,
          createdAt: baseTime.toISOString()
        }]);

      if (postError) {
        console.error(`❌ Erro ao criar post:`, postError.message);
        errorCount++;
      } else {
        successCount++;
      }
    }

    // 6. Verificar final
    const { count: finalCount } = await supabase
      .from('Post')
      .select('*', { count: 'exact' })
      .eq('arenaId', ARENA_ID);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ SEED COMPLETO — Protocolo Lipedema');
    console.log('═'.repeat(60));
    console.log(`📊 Posts criados com sucesso: ${successCount}`);
    console.log(`❌ Posts com erro: ${errorCount}`);
    console.log(`📈 Total na arena: ${finalCount}`);
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  }
}

main();
