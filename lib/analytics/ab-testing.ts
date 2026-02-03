/**
 * A/B Testing Service
 * Sistema simples de A/B testing para mensagens de conversão
 */

import { prisma } from '@/lib/prisma';

export interface ABTestVariant {
  id: string;
  name: string;
  message: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export interface ABTestResult {
  testId: string;
  variants: ABTestVariant[];
  winner: ABTestVariant | null;
  confidence: number;
}

// Variantes de mensagens de conversão
export const CONVERSION_MESSAGE_VARIANTS = [
  {
    id: 'variant_a',
    name: 'Padrão',
    message: '🎯 Você desbloqueou um desconto! Acumule FP e resgate agora.',
  },
  {
    id: 'variant_b',
    name: 'Urgência',
    message: '🔥 OPORTUNIDADE LIMITADA! Seus FP podem virar desconto HOJE!',
  },
  {
    id: 'variant_c',
    name: 'Social Proof',
    message: '⭐ 50+ membros já resgataram! Não fique de fora, use seus FP!',
  },
];

/**
 * Seleciona variante aleatória para teste
 */
export function selectABVariant(): string {
  const variants = CONVERSION_MESSAGE_VARIANTS;
  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex].id;
}

/**
 * Registra impressão de variante
 */
export async function trackABImpression(variantId: string, userId: string): Promise<void> {
  await prisma.aBTestEvent.create({
    data: {
      testId: 'conversion_message_test',
      variantId,
      userId,
      eventType: 'impression',
    },
  });
}

/**
 * Registra conversão de variante
 */
export async function trackABConversion(variantId: string, userId: string): Promise<void> {
  await prisma.aBTestEvent.create({
    data: {
      testId: 'conversion_message_test',
      variantId,
      userId,
      eventType: 'conversion',
    },
  });
}

/**
 * Obtém resultados do teste A/B
 */
export async function getABTestResults(testId: string = 'conversion_message_test'): Promise<ABTestResult> {
  const variants = await Promise.all(
    CONVERSION_MESSAGE_VARIANTS.map(async (variant) => {
      const [impressions, conversions] = await Promise.all([
        prisma.aBTestEvent.count({
          where: {
            testId,
            variantId: variant.id,
            eventType: 'impression',
          },
        }),
        prisma.aBTestEvent.count({
          where: {
            testId,
            variantId: variant.id,
            eventType: 'conversion',
          },
        }),
      ]);

      const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;

      return {
        id: variant.id,
        name: variant.name,
        message: variant.message,
        impressions,
        conversions,
        conversionRate,
      };
    })
  );

  // Encontrar vencedor
  const winner = variants.reduce((best, current) =>
    current.conversionRate > best.conversionRate ? current : best
  , variants[0]);

  // Calcular confiança (simplificado)
  const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);
  const confidence = totalConversions > 30 ? Math.min(95, (winner.conversionRate / 10) * 100) : 0;

  return {
    testId,
    variants,
    winner: confidence > 80 ? winner : null,
    confidence,
  };
}
