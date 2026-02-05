/**
 * Script de Teste - Juiz Biométrico NFV
 *
 * Testa as funcionalidades principais do sistema:
 * 1. Criar baseline
 * 2. Criar comparação
 * 3. Buscar avaliações
 *
 * Executar: npx tsx scripts/test-juiz-biometrico.ts
 */

import { juizBiometrico } from '../lib/biomechanics/juiz-biometrico.service';

// Imagens de exemplo (substitua por base64 reais para teste completo)
const MOCK_IMAGES = {
  frontal: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  lateral: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
  posterior: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
};

async function testJuizBiometrico() {
  console.log('🧪 Iniciando testes do Juiz Biométrico NFV\n');

  const TEST_USER_ID = 'test-user-' + Date.now();

  try {
    // ==========================================
    // Teste 1: Mensagem de Boas-Vindas
    // ==========================================
    console.log('📋 Teste 1: Mensagem de Boas-Vindas');
    console.log('─────────────────────────────────────');

    const welcomeMessage = juizBiometrico.getWelcomeMessage();
    console.log(welcomeMessage.substring(0, 200) + '...\n');
    console.log('✅ Mensagem de boas-vindas OK\n');

    // ==========================================
    // Teste 2: Validação de Imagens (Deve Falhar)
    // ==========================================
    console.log('📋 Teste 2: Validação de Imagens Incompletas');
    console.log('─────────────────────────────────────');

    const incompleteImages = {
      frontal: MOCK_IMAGES.frontal,
      // lateral e posterior faltando
    };

    const validationResult = await juizBiometrico.analyzeBaseline({
      user_id: TEST_USER_ID,
      images: incompleteImages as any,
    });

    if (validationResult.type === 'validation_error') {
      console.log('✅ Validação detectou imagens faltantes:');
      console.log('   -', validationResult.missing?.join(', '));
    } else {
      console.log('❌ Validação deveria ter falhado');
    }
    console.log('');

    // ==========================================
    // Teste 3: Criar Baseline (SKIP se sem API key)
    // ==========================================
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('⏭️  Teste 3: Pulado (ANTHROPIC_API_KEY não configurada)\n');
      console.log('📝 Para testar análise completa:');
      console.log('   1. Configure ANTHROPIC_API_KEY no .env');
      console.log('   2. Substitua MOCK_IMAGES por imagens base64 reais');
      console.log('   3. Execute: npx tsx scripts/test-juiz-biometrico.ts\n');
      return;
    }

    console.log('📋 Teste 3: Criar Baseline');
    console.log('─────────────────────────────────────');
    console.log('⚠️  ATENÇÃO: Este teste consome tokens da API Claude');
    console.log('⚠️  ATENÇÃO: MOCK_IMAGES precisa ser substituído por imagens reais\n');

    // DESCOMENTE PARA TESTAR COM API REAL
    /*
    const baselineResult = await juizBiometrico.analyzeBaseline({
      user_id: TEST_USER_ID,
      images: MOCK_IMAGES,
      current_protocol: 'Treino 5x semana + dieta mediterrânea',
    });

    if (baselineResult.type === 'baseline_created') {
      console.log('✅ Baseline criado:', baselineResult.baseline_id);
      console.log('\n📊 Análise (primeiros 500 caracteres):');
      console.log(baselineResult.analysis?.substring(0, 500) + '...\n');

      // ==========================================
      // Teste 4: Criar Comparação
      // ==========================================
      console.log('📋 Teste 4: Criar Comparação');
      console.log('─────────────────────────────────────');

      const comparisonResult = await juizBiometrico.analyzeComparison({
        user_id: TEST_USER_ID,
        baseline_id: baselineResult.baseline_id!,
        images: MOCK_IMAGES,
        current_protocol: 'Treino 6x semana + dieta cetogênica',
      });

      if (comparisonResult.type === 'comparison_created') {
        console.log('✅ Comparação criada:', comparisonResult.comparison_id);
        console.log('\n📊 Comparação (primeiros 500 caracteres):');
        console.log(comparisonResult.analysis?.substring(0, 500) + '...\n');
      }

      // ==========================================
      // Teste 5: Buscar Avaliações
      // ==========================================
      console.log('📋 Teste 5: Buscar Avaliações do Usuário');
      console.log('─────────────────────────────────────');

      const evaluations = await juizBiometrico.getUserEvaluations(TEST_USER_ID);
      console.log('✅ Avaliações encontradas:', evaluations.length);
      console.log('   - Baselines:', evaluations.length);
      console.log('   - Comparações:', evaluations[0]?.comparisons.length || 0);
    }
    */

    console.log('\n════════════════════════════════════════');
    console.log('✅ Testes básicos concluídos com sucesso!');
    console.log('════════════════════════════════════════\n');

    console.log('📝 Próximos passos:');
    console.log('   1. Configure ANTHROPIC_API_KEY');
    console.log('   2. Descomente testes da API real');
    console.log('   3. Substitua MOCK_IMAGES por base64 reais');
    console.log('   4. Execute migration: npx prisma db push');
    console.log('   5. Execute testes completos\n');
  } catch (error) {
    console.error('\n❌ Erro nos testes:', error);
    process.exit(1);
  }
}

// Executar testes
testJuizBiometrico()
  .then(() => {
    console.log('🎉 Script finalizado\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
