import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://qducbqhuwqdyqioqevle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE';

const supabase = createClient(supabaseUrl, supabaseKey);
const generateId = () => randomUUID();

const aiUserId = 'ai-lipedema-coach';

// Posts restantes (Drenagem, Hormônios, Suplementos, Saúde Mental)
const remainingPosts = [
  // Thread 5: Drenagem (4 posts)
  { content: 'Drenagem linfática realmente ajuda? Vale a pena pagar sessões?', isAIResponse: false },
  { content: 'Sim, definitivamente ajuda! A drenagem linfática manual profissional (técnica Vodder ou Leduc) movimenta fluido que está travado nos tecidos. 1-2x por semana é ideal. Se não puder pagar sempre, considere: **Autocuidado**: auto-drenagem (YouTube tem protocolos), **Aparelhos**: compressão pneumática intermitente, **Exercício**: já citado que é auto-drenagem natural.', isAIResponse: true },
  { content: 'Quanto custa drenagem e de quanto em quanto tempo?', isAIResponse: false },
  { content: 'No Brasil: R$ 80-150 por sessão. Frequência: 1-2x por semana idealmente. Convênios cobrem parcialmente em alguns casos. O custo é alto, mas é investimento em qualidade de vida.', isAIResponse: true },

  // Thread 6: Hormônios (4 posts)
  { content: 'Lipedema piora com menstruação? Devo mudar anticoncepcional?', isAIResponse: false },
  { content: 'Sim! Progesterona causa vasodilatação e retenção hídrica—muitos casos pioram 5-7 dias antes da menstruação. Anticoncepcional à base de estrogênio pode agravar. Algumas pacientes se beneficiam de: **Anticoncepcionais com estrogênio natural (estradiol)**, **Minipílula de progesterona**, **Ciclo contínuo** (sem pausa menstrual). Converse com gineco especializado!', isAIResponse: true },
  { content: 'E na menopausa? Vai piorar muito?', isAIResponse: false },
  { content: 'Menopausa é fator de risco para progressão (queda de estrogênio causa mais inflamação). MAS: TRH (terapia de reposição hormonal) bem prescrita pode ajudar. Ainda assim, protocolo completo (exercício, drenagem, nutrição) é o pilar.', isAIResponse: true },

  // Thread 7: Suplementos (4 posts)
  { content: 'Quais suplementos realmente ajudam no lipedema?', isAIResponse: false },
  { content: 'Aqui estão os com maior evidência: **Diosmina** (⭐⭐⭐⭐⭐—melhora drenagem linfática), **Micronizado de flavonoides** (Venosmil, Daflon—⭐⭐⭐⭐), **Ômega-3** (⭐⭐⭐⭐⭐—anti-inflamatório), **Cúrcuma** (⭐⭐⭐⭐—reduz TNF-alpha), **Quercetina** (⭐⭐⭐⭐—antioxidante), **Vitamina D** (⭐⭐⭐⭐⭐ se deficiente).', isAIResponse: true },
  { content: 'Quanto tempo leva pra ver resultado? E quanto custa?', isAIResponse: false },
  { content: '2-3 meses é o mínimo. Alguns estudos mostram diferença significativa em 6 meses. Custos variam: diosmina (R$ 40-80/mês), flavonoides (R$ 30-60/mês), ômega-3 (R$ 20-50/mês). Vale a pena investir em qualidade das marcas.', isAIResponse: true },

  // Thread 8: Saúde Mental (3 posts)
  { content: 'Como lidar emocionalmente com o diagnóstico de lipedema?', isAIResponse: false },
  { content: 'É difícil! Lipedema afeta muito além do físico—estética, mobilidade, dor crônica. É normal sentir raiva, tristeza, frustração. Encontre comunidade (grupos online, presenciais), procure psicólogo que entenda condições crônicas, reconheça seus pequenos progressos. O tratamento é longo, então self-compassion é fundamental.', isAIResponse: true },
  { content: 'Sinto muita culpa por "deixar meu corpo assim". Racional sou que lipedema é genético, mas emocionalmente é difícil...', isAIResponse: false },
  { content: 'Essa culpa é real e válida, mas é importante lembrar: lipedema é 100% genético. Você não causou e não poderia ter prevenido. O que você PODE fazer é gerenciar—e se você está aqui, aprendendo e se cuidando, já está fazendo tudo certo. Acesse comunidades, como grupos no Facebook exclusivos para lipedema.', isAIResponse: true }
];

async function main() {
  console.log('🏟️ COMPLETAR SEED: Arena Protocolo Lipedema\n');

  try {
    // 1. Criar usuário IA via SQL (bypass RLS)
    console.log('👤 Criando usuário IA com acesso admin...');
    const { data: aiUserData, error: aiUserError } = await supabase
      .rpc('create_ai_user', {
        user_id: aiUserId,
        user_email: 'ai-lipedema-coach@nutrifitcoach.com',
        user_name: 'IA Lipedema Coach'
      })
      .maybeSingle();

    if (aiUserError) {
      console.log('   ⚠️ RPC não disponível, tentando insert direto...');

      // Tentar insert direto mesmo que falhe (pode falhar por RLS)
      const { error: directError } = await supabase
        .from('User')
        .insert([{
          id: aiUserId,
          email: 'ai-lipedema-coach@nutrifitcoach.com',
          name: 'IA Lipedema Coach',
          isBot: true,
          createdAt: new Date().toISOString()
        }]);

      if (directError && !directError.message.includes('duplicate')) {
        console.log('   ❌ Erro ao criar usuário IA:', directError.message);
        console.log('   ℹ️ Continuando mesmo assim...');
      } else if (!directError) {
        console.log('   ✅ Usuário IA criado');
      }
    } else {
      console.log('   ✅ Usuário IA criado via RPC');
    }

    // 2. Buscar arena Protocolo Lipedema
    console.log('\n🏟️ Buscando arena Protocolo Lipedema...');
    const { data: arena, error: arenaError } = await supabase
      .from('Arena')
      .select('*')
      .eq('slug', 'protocolo-lipedema')
      .single();

    if (arenaError || !arena) {
      console.error('❌ Arena não encontrada!');
      process.exit(1);
    }

    const ARENA_ID = arena.id;
    console.log(`   ✅ Arena encontrada: ${arena.name} (${ARENA_ID})`);

    // 3. Verificar posts existentes
    const { count: postCount } = await supabase
      .from('Post')
      .select('*', { count: 'exact' })
      .eq('arenaId', ARENA_ID);

    console.log(`   📊 Posts atuais: ${postCount}`);

    // 4. Criar posts restantes
    console.log(`\n🧵 Criando ${remainingPosts.length} posts restantes...\n`);

    let baseTime = new Date('2026-02-01T08:00:00Z');
    baseTime = new Date(baseTime.getTime() + postCount * 70 * 60000); // Começar após os posts existentes

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < remainingPosts.length; i++) {
      const post = remainingPosts[i];
      baseTime = new Date(baseTime.getTime() + (45 + Math.floor(Math.random() * 90)) * 60000);

      const { error: postError } = await supabase
        .from('Post')
        .insert([{
          id: generateId(),
          content: post.content,
          arenaId: ARENA_ID,
          userId: aiUserId,
          isAIResponse: post.isAIResponse,
          isPublished: true,
          isApproved: true,
          createdAt: baseTime.toISOString()
        }]);

      if (postError) {
        console.error(`   ❌ Post ${i + 1}: Erro - ${postError.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Post ${i + 1}: Criado`);
        successCount++;
      }
    }

    // 5. Verificar final
    const { count: finalCount } = await supabase
      .from('Post')
      .select('*', { count: 'exact' })
      .eq('arenaId', ARENA_ID);

    const { data: finalPosts } = await supabase
      .from('Post')
      .select('isAIResponse')
      .eq('arenaId', ARENA_ID);

    const aiPostsCount = finalPosts?.filter(p => p.isAIResponse).length || 0;
    const userPostsCount = finalPosts?.filter(p => !p.isAIResponse).length || 0;

    console.log('\n' + '═'.repeat(70));
    console.log('✅ SEED COMPLETO — Protocolo Lipedema');
    console.log('═'.repeat(70));
    console.log(`📊 Posts criados nesta sessão: ${successCount} ✅`);
    console.log(`❌ Posts com erro: ${errorCount}`);
    console.log(`📈 Total na arena: ${finalCount}`);
    console.log(`   - Posts de IA: ${aiPostsCount}`);
    console.log(`   - Posts de Usuários: ${userPostsCount}`);
    console.log('═'.repeat(70));

  } catch (error) {
    console.error('❌ ERRO GERAL:', error.message);
    process.exit(1);
  }
}

main();
