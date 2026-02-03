/**
 * Gatilhos de Conversão - IA Facilitadora
 * Monitora FP e envia mensagens incentivando conversão
 */

import { supabase } from '../supabase';
import { getAvailableTiers, COUPON_TIERS } from '../coupons/coupon-tiers';

export interface ConversionTrigger {
  userId: string;
  userName: string;
  fpBalance: number;
  availableTiers: typeof COUPON_TIERS;
  highestTier: typeof COUPON_TIERS[0];
  arenaSource?: string;
}

export interface ConversionMessage {
  type: 'private_message' | 'highlight' | 'notification';
  title: string;
  message: string;
  cta: string;
  tier: typeof COUPON_TIERS[0];
}

/**
 * Detecta usuários elegíveis para conversão
 */
export async function detectConversionOpportunities(): Promise<ConversionTrigger[]> {
  try {
    console.log('🎯 Detecting conversion opportunities...');

    // Buscar usuários com FP >= 100 (tier mínimo)
    const { data: users, error } = await supabase
      .from('User')
      .select('id, name, fpAvailable')
      .gte('fpAvailable', 100)
      .order('fpAvailable', { ascending: false })
      .limit(50);

    if (error || !users) {
      console.error('Error fetching users:', error);
      return [];
    }

    // Filtrar apenas quem ainda não resgatou recentemente
    const opportunities: ConversionTrigger[] = [];

    for (const user of users) {
      // Verificar se já resgatou nas últimas 24h
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);

      const { data: recentCoupons } = await supabase
        .from('Coupon')
        .select('id')
        .eq('userId', user.id)
        .gte('createdAt', dayAgo.toISOString())
        .limit(1);

      // Se já resgatou recentemente, pular
      if (recentCoupons && recentCoupons.length > 0) {
        continue;
      }

      // Obter tiers disponíveis
      const availableTiers = getAvailableTiers(user.fpAvailable);

      if (availableTiers.length === 0) {
        continue;
      }

      // Tier mais alto disponível
      const highestTier = availableTiers[availableTiers.length - 1];

      opportunities.push({
        userId: user.id,
        userName: user.name || 'Usuário',
        fpBalance: user.fpAvailable,
        availableTiers,
        highestTier,
      });
    }

    console.log(`✅ Found ${opportunities.length} conversion opportunities`);

    return opportunities;
  } catch (error) {
    console.error('Error detecting conversion opportunities:', error);
    return [];
  }
}

/**
 * Gera mensagem de conversão personalizada
 */
export function generateConversionMessage(trigger: ConversionTrigger): ConversionMessage {
  const { fpBalance, highestTier, userName } = trigger;

  // Mensagens por tier
  const messages = {
    tier_basic: {
      title: '🎯 Você Desbloqueou um Desconto!',
      message: `Olá ${userName}! Vejo que você se tornou um membro ativo aqui na arena! 🎉\n\nVocê acumulou ${fpBalance} FP através das suas contribuições técnicas. Isso significa que você desbloqueou **5% de desconto no plano mensal** do nosso App Premium!\n\nQue tal transformar todo esse conhecimento em resultados práticos com treinos personalizados e acompanhamento profissional?`,
      cta: 'Resgatar Desconto Agora',
    },
    tier_intermediate: {
      title: '🥈 Autoridade em Construção!',
      message: `Parabéns ${userName}! Você já é uma referência aqui! 🚀\n\nCom ${fpBalance} FP acumulados, suas contribuições técnicas liberaram **15% de desconto no plano trimestral**.\n\nAproveite essa oportunidade exclusiva para levar seu treino para o próximo nível com nosso App Premium. Sua dedicação aqui merece resultados reais!`,
      cta: 'Resgatar 15% OFF',
    },
    tier_advanced: {
      title: '🥇 Você é uma Autoridade Técnica!',
      message: `${userName}, você se destacou! 🏆\n\nSeus incríveis ${fpBalance} FP mostram que você é uma verdadeira autoridade técnica aqui. Por isso, liberamos o **maior desconto possível: 30% no plano anual**!\n\nÉ hora de aplicar todo esse conhecimento com treinos de elite, análises biomecânicas avançadas e acompanhamento personalizado. Você merece!`,
      cta: 'Resgatar 30% OFF Premium',
    },
  };

  const tierMessages = messages[highestTier.id as keyof typeof messages];

  return {
    type: 'private_message',
    title: tierMessages.title,
    message: tierMessages.message,
    cta: tierMessages.cta,
    tier: highestTier,
  };
}

/**
 * Envia mensagem de conversão para usuário
 */
export async function sendConversionMessage(
  trigger: ConversionTrigger
): Promise<boolean> {
  try {
    const message = generateConversionMessage(trigger);

    console.log(`📧 Sending conversion message to ${trigger.userName}...`);

    // Criar notificação no banco
    const { error } = await supabase.from('Notification').insert({
      userId: trigger.userId,
      type: 'CONVERSION_OPPORTUNITY',
      title: message.title,
      content: message.message,
      metadata: {
        fpBalance: trigger.fpBalance,
        tierId: trigger.highestTier.id,
        discountPercent: trigger.highestTier.discountPercent,
        cta: message.cta,
      },
      read: false,
    });

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    console.log(`✅ Conversion message sent to ${trigger.userName}`);

    return true;
  } catch (error) {
    console.error('Error sending conversion message:', error);
    return false;
  }
}

/**
 * Processa gatilhos de conversão (cron job)
 */
export async function processConversionTriggers(
  options: {
    maxNotifications?: number;
  } = {}
): Promise<{
  opportunities: number;
  sent: number;
  skipped: number;
}> {
  const { maxNotifications = 10 } = options;

  console.log('\n🎯 Processing conversion triggers...');

  const stats = {
    opportunities: 0,
    sent: 0,
    skipped: 0,
  };

  try {
    // Detectar oportunidades
    const opportunities = await detectConversionOpportunities();
    stats.opportunities = opportunities.length;

    if (opportunities.length === 0) {
      console.log('  No conversion opportunities found');
      return stats;
    }

    // Processar até maxNotifications
    const toProcess = opportunities.slice(0, maxNotifications);

    for (const opportunity of toProcess) {
      const sent = await sendConversionMessage(opportunity);

      if (sent) {
        stats.sent++;
      } else {
        stats.skipped++;
      }

      // Delay para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`\n✅ Conversion triggers processed:`);
    console.log(`   Opportunities: ${stats.opportunities}`);
    console.log(`   Sent: ${stats.sent}`);
    console.log(`   Skipped: ${stats.skipped}`);

    return stats;
  } catch (error) {
    console.error('Error processing conversion triggers:', error);
    return stats;
  }
}

/**
 * Verifica se usuário deve receber gatilho agora
 */
export async function shouldTriggerConversion(userId: string): Promise<{
  shouldTrigger: boolean;
  tier?: typeof COUPON_TIERS[0];
  fpBalance?: number;
}> {
  try {
    // Buscar saldo de FP
    const { data: user } = await supabase
      .from('User')
      .select('fpAvailable')
      .eq('id', userId)
      .single();

    if (!user) {
      return { shouldTrigger: false };
    }

    const fpBalance = user.fpAvailable || 0;

    // Verificar se tem FP suficiente
    const availableTiers = getAvailableTiers(fpBalance);

    if (availableTiers.length === 0) {
      return { shouldTrigger: false };
    }

    // Verificar se já foi notificado recentemente
    const hourAgo = new Date();
    hourAgo.setHours(hourAgo.getHours() - 24);

    const { data: recentNotification } = await supabase
      .from('Notification')
      .select('id')
      .eq('userId', userId)
      .eq('type', 'CONVERSION_OPPORTUNITY')
      .gte('createdAt', hourAgo.toISOString())
      .limit(1);

    if (recentNotification && recentNotification.length > 0) {
      return { shouldTrigger: false };
    }

    // Tier mais alto disponível
    const tier = availableTiers[availableTiers.length - 1];

    return {
      shouldTrigger: true,
      tier,
      fpBalance,
    };
  } catch (error) {
    console.error('Error checking conversion trigger:', error);
    return { shouldTrigger: false };
  }
}
