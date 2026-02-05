/**
 * FitPoints System - Exemplos Práticos de Uso
 *
 * Demonstra como usar os services de FitPoints e Paywall
 * em diferentes cenários do sistema de avaliação biométrica.
 */

import { fitpointsService } from '../fitpoints/fitpoints.service';
import { biometricPaywall } from './biometric-paywall.service';
import { juizBiometrico } from './juiz-biometrico.service';

// ============================================
// EXEMPLO 1: Verificar Saldo do Usuário
// ============================================

async function checkUserBalance(userId: string) {
  // Método simples: apenas o saldo
  const balance = await fitpointsService.getBalance(userId);
  console.log(`💰 Saldo: ${balance} FPs`);

  // Método completo: estatísticas detalhadas
  const stats = await fitpointsService.getStats(userId);
  console.log(`
📊 Estatísticas:
   - Saldo atual: ${stats.balance} FPs
   - Total ganho: ${stats.lifetime} FPs
   - Total gasto: ${stats.spent} FPs
   - Tier: ${stats.subscription.tier}
   - Status: ${stats.subscription.status}
   - Baseline grátis usado: ${stats.quotas.free_baseline_used ? 'Sim' : 'Não'}
  `);
}

// ============================================
// EXEMPLO 2: Adicionar FitPoints (Compra/Recompensa)
// ============================================

async function addFitPointsToUser(userId: string) {
  // Compra de FPs
  await fitpointsService.addFitPoints({
    user_id: userId,
    amount: 100,
    transaction_type: 'purchase',
    description: 'Compra de pacote 100 FPs',
    metadata: {
      package: 'basic',
      price_brl: 19.90,
      payment_method: 'credit_card',
    },
  });

  console.log('✅ 100 FPs adicionados (compra)');

  // Recompensa por atividade
  await fitpointsService.addFitPoints({
    user_id: userId,
    amount: 5,
    transaction_type: 'reward',
    description: 'Recompensa: Post engajado na arena',
    metadata: {
      post_id: 'post123',
      likes: 50,
    },
  });

  console.log('✅ 5 FPs adicionados (recompensa)');
}

// ============================================
// EXEMPLO 3: Criar Baseline (Primeira Vez - Grátis)
// ============================================

async function createFirstBaseline(userId: string) {
  // Verificar se pode criar baseline
  const access = await biometricPaywall.checkBaselineAccess(userId);

  if (!access.allowed) {
    console.log('🚫 Acesso bloqueado:', access.reason);
    return;
  }

  console.log(`✅ Acesso permitido via ${access.payment_method}`);

  // Criar baseline
  const result = await juizBiometrico.analyzeBaseline({
    user_id: userId,
    images: {
      frontal: 'data:image/jpeg;base64,...',
      lateral: 'data:image/jpeg;base64,...',
      posterior: 'data:image/jpeg;base64,...',
    },
    current_protocol: 'Treino 5x semana + dieta mediterrânea',
  });

  if (result.type === 'baseline_created') {
    console.log(`
✅ Baseline criado com sucesso!
   - ID: ${result.baseline_id}
   - Método: ${result.payment_info?.method}
   - Custo: ${result.payment_info?.cost_fps} FPs
    `);
  } else if (result.type === 'paywall_blocked') {
    console.log(`
🚫 Paywall bloqueado!
   - Razão: ${result.paywall_reason}
   - FPs necessários: ${result.required_fps}
   - Saldo atual: ${result.current_balance}
   - Faltam: ${result.shortfall} FPs
    `);
  }
}

// ============================================
// EXEMPLO 4: Criar Comparação (Com FitPoints)
// ============================================

async function createComparisonWithFPs(userId: string, baselineId: string) {
  // 1. Verificar acesso
  const access = await biometricPaywall.checkComparisonAccess(userId);

  if (!access.allowed) {
    console.log('🚫 Acesso bloqueado:', access.reason);
    console.log(`💡 Saldo atual: ${access.current_balance} FPs`);
    console.log(`💡 Faltam: ${access.shortfall} FPs`);

    // Sugerir compra de FPs ou Premium
    console.log('\n💡 Opções:');
    console.log(`   1. Comprar ${access.shortfall} FPs (R$ ${(access.shortfall! * 0.20).toFixed(2)})`);
    console.log('   2. Assinar Premium (R$ 49,90/mês - ilimitado)');
    return;
  }

  console.log(`✅ Acesso permitido`);
  console.log(`💰 Custo: ${access.cost_fps} FPs`);
  console.log(`💳 Método: ${access.payment_method}`);

  // 2. Criar comparação (paywall já vai deduzir FPs)
  const result = await juizBiometrico.analyzeComparison({
    user_id: userId,
    baseline_id: baselineId,
    images: {
      frontal: 'data:image/jpeg;base64,...',
      lateral: 'data:image/jpeg;base64,...',
      posterior: 'data:image/jpeg;base64,...',
    },
    current_protocol: 'Treino 6x semana + dieta cetogênica',
  });

  if (result.type === 'comparison_created') {
    console.log(`
✅ Comparação criada com sucesso!
   - ID: ${result.comparison_id}
   - Método: ${result.payment_info?.method}
   - Custo: ${result.payment_info?.cost_fps} FPs
   - Transaction ID: ${result.payment_info?.transaction_id}
    `);

    // Verificar novo saldo
    const newBalance = await fitpointsService.getBalance(userId);
    console.log(`💰 Novo saldo: ${newBalance} FPs`);
  }
}

// ============================================
// EXEMPLO 5: Usuário Premium (Ilimitado)
// ============================================

async function premiumUserFlow(userId: string, baselineId: string) {
  // Premium tem tudo ilimitado
  console.log('👑 Usuário Premium - Acesso ilimitado');

  // Baseline
  const baseline = await juizBiometrico.analyzeBaseline({
    user_id: userId,
    images: {
      frontal: 'data:image/jpeg;base64,...',
      lateral: 'data:image/jpeg;base64,...',
      posterior: 'data:image/jpeg;base64,...',
    },
  });

  console.log(`✅ Baseline: ${baseline.payment_info?.method} (sem custo)`);

  // Comparação
  const comparison = await juizBiometrico.analyzeComparison({
    user_id: userId,
    baseline_id: baselineId,
    images: {
      frontal: 'data:image/jpeg;base64,...',
      lateral: 'data:image/jpeg;base64,...',
      posterior: 'data:image/jpeg;base64,...',
    },
  });

  console.log(`✅ Comparação: ${comparison.payment_info?.method} (sem custo)`);
}

// ============================================
// EXEMPLO 6: Histórico de Transações
// ============================================

async function showTransactionHistory(userId: string) {
  const transactions = await fitpointsService.getTransactionHistory(userId, 10);

  console.log(`\n📜 Histórico de Transações (últimas 10):`);
  console.log('─────────────────────────────────────────');

  transactions.forEach((tx) => {
    const sign = tx.amount >= 0 ? '+' : '';
    const type = tx.amount >= 0 ? '📈' : '📉';

    console.log(`
${type} ${sign}${tx.amount} FPs | Saldo: ${tx.balance_after} FPs
   ${tx.description}
   Tipo: ${tx.transaction_type} | Categoria: ${tx.category}
   Data: ${tx.created_at.toLocaleString('pt-BR')}
    `);
  });
}

// ============================================
// EXEMPLO 7: Reembolsar FitPoints (Erro/Cancelamento)
// ============================================

async function refundComparison(transactionId: string) {
  // Cenário: Usuário pagou 25 FPs mas houve erro na análise
  // Sistema deve reembolsar automaticamente

  console.log(`🔄 Processando reembolso...`);

  await fitpointsService.refundFitPoints(transactionId);

  console.log('✅ Reembolso processado com sucesso');
}

// ============================================
// EXEMPLO 8: Verificar Múltiplas Operações
// ============================================

async function checkMultipleOperations(userId: string) {
  // Verificar acesso a múltiplas features
  const baselineAccess = await biometricPaywall.checkBaselineAccess(userId);
  const comparisonAccess = await biometricPaywall.checkComparisonAccess(userId);
  const exportAccess = await biometricPaywall.checkExportAccess(userId);

  console.log(`
📊 Status de Acesso para Usuário ${userId}:
─────────────────────────────────────────

1️⃣ Baseline:
   ${baselineAccess.allowed ? '✅ Permitido' : '🚫 Bloqueado'}
   Método: ${baselineAccess.payment_method || 'N/A'}
   Custo: ${baselineAccess.cost_fps} FPs
   ${!baselineAccess.allowed ? `Razão: ${baselineAccess.reason}` : ''}

2️⃣ Comparação:
   ${comparisonAccess.allowed ? '✅ Permitido' : '🚫 Bloqueado'}
   Método: ${comparisonAccess.payment_method || 'N/A'}
   Custo: ${comparisonAccess.cost_fps} FPs
   ${!comparisonAccess.allowed ? `Razão: ${comparisonAccess.reason}` : ''}

3️⃣ Export PDF:
   ${exportAccess.allowed ? '✅ Permitido' : '🚫 Bloqueado'}
   Método: ${exportAccess.payment_method || 'N/A'}
   Custo: ${exportAccess.cost_fps} FPs
   ${!exportAccess.allowed ? `Razão: ${exportAccess.reason}` : ''}

💰 Saldo atual: ${comparisonAccess.current_balance} FPs
  `);
}

// ============================================
// EXEMPLO 9: Simulação de Conversão Free → Premium
// ============================================

async function simulateConversionFunnel(userId: string) {
  console.log('🎯 Simulando funil de conversão...\n');

  // 1. Usuário Free faz baseline grátis
  console.log('1️⃣ Baseline grátis (hook)');
  await createFirstBaseline(userId);

  // 2. Adicionar FPs iniciais (promo)
  console.log('\n2️⃣ Bônus de boas-vindas');
  await fitpointsService.addFitPoints({
    user_id: userId,
    amount: 50,
    transaction_type: 'bonus',
    description: 'Bônus de boas-vindas',
  });

  // 3. Fazer 2 comparações (gasta 50 FPs)
  console.log('\n3️⃣ Primeira comparação (-25 FPs)');
  // await createComparisonWithFPs(userId, baselineId);

  console.log('\n4️⃣ Segunda comparação (-25 FPs)');
  // await createComparisonWithFPs(userId, baselineId);

  // 4. Saldo zerado, usuário tenta terceira comparação
  console.log('\n5️⃣ Tentativa de terceira comparação (sem FPs)');
  const access = await biometricPaywall.checkComparisonAccess(userId);

  if (!access.allowed) {
    console.log(`
🚫 Saldo insuficiente!

💡 O usuário agora percebe o valor e tem 2 opções:
   1. Comprar mais FPs: ${access.shortfall} FPs = R$ ${(access.shortfall! * 0.20).toFixed(2)}
   2. Assinar Premium: R$ 49,90/mês = ILIMITADO

🎯 Momento ideal para conversão!
    `);
  }
}

// ============================================
// EXPORT
// ============================================

export const examples = {
  checkUserBalance,
  addFitPointsToUser,
  createFirstBaseline,
  createComparisonWithFPs,
  premiumUserFlow,
  showTransactionHistory,
  refundComparison,
  checkMultipleOperations,
  simulateConversionFunnel,
};
