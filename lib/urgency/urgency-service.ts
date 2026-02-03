/**
 * Urgency Service
 * Sistema de urgência e FOMO para aumentar conversão
 */

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export interface ExpiringCoupon {
  id: string;
  userId: string;
  code: string;
  tierName: string;
  discountPercent: number;
  expiresAt: Date;
  hoursRemaining: number;
}

export interface UrgencyStats {
  expiringSoon: number;
  recentRedeems: number;
  availableSlots: number;
}

/**
 * Detecta cupons próximos de expirar (12h)
 */
export async function detectExpiringCoupons(): Promise<ExpiringCoupon[]> {
  const now = new Date();
  const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  const coupons = await prisma.coupon.findMany({
    where: {
      status: 'ACTIVE',
      expiresAt: {
        gte: now,
        lte: twelveHoursFromNow,
      },
    },
    select: {
      id: true,
      userId: true,
      code: true,
      tierName: true,
      discountPercent: true,
      expiresAt: true,
    },
  });

  return coupons.map((coupon) => {
    const hoursRemaining = Math.floor(
      (coupon.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    return {
      ...coupon,
      hoursRemaining,
    };
  });
}

/**
 * Envia lembretes de expiração
 */
export async function sendExpirationReminders(): Promise<{
  sent: number;
  failed: number;
}> {
  const expiringCoupons = await detectExpiringCoupons();

  let sent = 0;
  let failed = 0;

  for (const coupon of expiringCoupons) {
    try {
      // Verificar se já enviou lembrete
      const alreadySent = await prisma.notification.findFirst({
        where: {
          userId: coupon.userId,
          type: 'coupon_expiring',
          metadata: {
            path: ['couponId'],
            equals: coupon.id,
          },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
          },
        },
      });

      if (alreadySent) {
        console.log(`⏭️ Lembrete já enviado para cupom ${coupon.code}`);
        continue;
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: coupon.userId },
        select: { name: true, email: true },
      });

      if (!user) continue;

      // Criar notificação no banco
      await prisma.notification.create({
        data: {
          userId: coupon.userId,
          type: 'coupon_expiring',
          title: '⏰ Seu Cupom Vai Expirar!',
          message: `Seu cupom de ${coupon.discountPercent}% OFF expira em ${coupon.hoursRemaining}h. Use agora!`,
          metadata: {
            couponId: coupon.id,
            code: coupon.code,
            hoursRemaining: coupon.hoursRemaining,
          },
        },
      });

      // Enviar email (opcional)
      if (user.email) {
        try {
          await sendEmail({
            to: user.email,
            subject: `⏰ Seu Cupom de ${coupon.discountPercent}% OFF Expira em ${coupon.hoursRemaining}h!`,
            html: generateExpirationEmailHTML(user.name || 'Usuário', coupon),
          });
        } catch (emailError) {
          console.error(`❌ Erro ao enviar email para ${user.email}:`, emailError);
        }
      }

      sent++;
      console.log(`✅ Lembrete enviado: ${coupon.code} (${coupon.hoursRemaining}h restantes)`);
    } catch (error) {
      console.error(`❌ Erro ao enviar lembrete para cupom ${coupon.id}:`, error);
      failed++;
    }
  }

  return { sent, failed };
}

/**
 * Obtém estatísticas de urgência
 */
export async function getUrgencyStats(): Promise<UrgencyStats> {
  const now = new Date();
  const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [expiringSoon, recentRedeems] = await Promise.all([
    // Cupons expirando nas próximas 12h
    prisma.coupon.count({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          gte: now,
          lte: twelveHoursFromNow,
        },
      },
    }),
    // Resgates nas últimas 24h
    prisma.coupon.count({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    }),
  ]);

  // Calcular "slots disponíveis" (artificial scarcity)
  const availableSlots = Math.max(0, 50 - recentRedeems);

  return {
    expiringSoon,
    recentRedeems,
    availableSlots,
  };
}

/**
 * Obtém contagem de resgates recentes por tier
 */
export async function getRecentRedeemsByTier(hours: number = 24): Promise<
  Record<string, number>
> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const coupons = await prisma.coupon.findMany({
    where: {
      createdAt: {
        gte: since,
      },
    },
    select: {
      tierId: true,
    },
  });

  const byTier: Record<string, number> = {};
  for (const coupon of coupons) {
    byTier[coupon.tierId] = (byTier[coupon.tierId] || 0) + 1;
  }

  return byTier;
}

/**
 * Verifica se usuário é Early Adopter (primeiros 100)
 */
export async function isEarlyAdopter(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { createdAt: true },
  });

  if (!user) return false;

  // Contar usuários criados antes deste
  const count = await prisma.user.count({
    where: {
      createdAt: {
        lt: user.createdAt,
      },
    },
  });

  return count < 100;
}

/**
 * Obtém badge do usuário
 */
export async function getUserBadge(userId: string): Promise<string | null> {
  const earlyAdopter = await isEarlyAdopter(userId);

  if (earlyAdopter) {
    return '🏆 Early Adopter';
  }

  // Verificar outros badges
  const couponCount = await prisma.coupon.count({
    where: {
      userId,
      status: 'USED',
    },
  });

  if (couponCount >= 5) {
    return '⭐ Super Convertedor';
  } else if (couponCount >= 3) {
    return '💎 Convertedor Ativo';
  } else if (couponCount >= 1) {
    return '✨ Primeiro Resgate';
  }

  return null;
}

/**
 * Gera HTML do email de expiração
 */
function generateExpirationEmailHTML(
  userName: string,
  coupon: ExpiringCoupon
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .coupon-code { background: white; border: 2px dashed #10b981; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #10b981; margin: 20px 0; border-radius: 5px; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .urgency { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Seu Cupom Vai Expirar!</h1>
    </div>
    <div class="content">
      <p>Olá <strong>${userName}</strong>,</p>

      <p>Detectamos que seu cupom de <strong>${coupon.discountPercent}% OFF</strong> está prestes a expirar!</p>

      <div class="urgency">
        <strong>⚠️ Atenção:</strong> Restam apenas <strong>${coupon.hoursRemaining} horas</strong> para usar seu desconto!
      </div>

      <p>Seu código:</p>
      <div class="coupon-code">${coupon.code}</div>

      <p>Não perca essa oportunidade! Use agora no nosso App Premium e economize <strong>${coupon.discountPercent}%</strong> na sua assinatura.</p>

      <center>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.nutrifitcoach.com'}/checkout?coupon=${coupon.code}" class="cta">
          Usar Cupom Agora
        </a>
      </center>

      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        Este cupom expira em: <strong>${coupon.expiresAt.toLocaleString('pt-BR')}</strong>
      </p>
    </div>
    <div class="footer">
      <p>NutriFitCoach - Transformando Engajamento em Valor</p>
      <p>Você recebeu este email porque possui um cupom ativo que está expirando.</p>
    </div>
  </div>
</body>
</html>
  `;
}
