/**
 * Script de Seed - Biometric Pricing
 *
 * Popula tabela BiometricPricing com preços estratégicos:
 * - Baseline: Grátis (1x lifetime) para Free, Ilimitado para Premium
 * - Comparação: 25 FPs para Free, Ilimitado para Premium
 * - Export PDF: 15 FPs para Free, Ilimitado para Premium
 *
 * Executar: npm run seed:pricing
 */

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const PRICING_DATA = [
  {
    item_type: 'baseline',
    fps_cost: 0, // Primeira grátis
    premium_free: true, // Ilimitado para Premium
    first_free: true, // Primeira vez grátis
    max_per_month: null, // Ilimitado para Premium
    is_active: true,
  },
  {
    item_type: 'comparison',
    fps_cost: 25,
    premium_free: true, // Ilimitado para Premium
    first_free: false,
    max_per_month: null, // Ilimitado para Premium
    is_active: true,
  },
  {
    item_type: 'export_pdf',
    fps_cost: 15,
    premium_free: true, // Ilimitado para Premium
    first_free: false,
    max_per_month: null, // Ilimitado para Premium
    is_active: true,
  },
];

async function seedBiometricPricing() {
  console.log('💰 Iniciando seed de Biometric Pricing...\n');

  try {
    for (const pricing of PRICING_DATA) {
      console.log(`📝 Configurando preço: ${pricing.item_type}`);
      console.log(`   - Custo: ${pricing.fps_cost} FPs`);
      console.log(`   - Premium grátis: ${pricing.premium_free ? 'Sim' : 'Não'}`);
      console.log(`   - Primeira grátis: ${pricing.first_free ? 'Sim' : 'Não'}`);

      const result = await prisma.biometricPricing.upsert({
        where: {
          item_type: pricing.item_type,
        },
        update: {
          fps_cost: pricing.fps_cost,
          premium_free: pricing.premium_free,
          first_free: pricing.first_free,
          max_per_month: pricing.max_per_month,
          is_active: pricing.is_active,
          updated_at: new Date(),
        },
        create: pricing,
      });

      console.log(`✅ ${pricing.item_type}: ${result.id}\n`);
    }

    console.log('════════════════════════════════════════');
    console.log('✅ Seed de Biometric Pricing concluído!');
    console.log('════════════════════════════════════════\n');

    console.log('📊 Resumo da Monetização:');
    console.log('   - Baseline: Grátis (1x) → Premium ilimitado');
    console.log('   - Comparação: 25 FPs → Premium ilimitado');
    console.log('   - Export PDF: 15 FPs → Premium ilimitado\n');

    console.log('💡 Estratégia de Paywall:');
    console.log('   1️⃣ Hook: Baseline grátis (conquista usuário)');
    console.log('   2️⃣ Monetização: Comparações custam FPs (receita recorrente)');
    console.log('   3️⃣ Upsell: Premium = tudo ilimitado (conversão)\n');
  } catch (error) {
    console.error('❌ Erro ao popular preços:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed
seedBiometricPricing()
  .then(() => {
    console.log('🎉 Script finalizado com sucesso\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
