import { PrismaClient } from './generated/prisma'

// Modelos pendentes de migração — tipados como any até serem adicionados ao schema
type ExtendedPrismaClient = PrismaClient & {
  coupon: any;
  couponCombo: any;
  couponReactivation: any;
  fitnessPointLog: any;
  referral: any;
  referralUsage: any;
  notification: any;
  aBTestEvent: any;
  userMilestone: any;
  pushSubscription: any;
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined
}

export const prisma = (global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})) as ExtendedPrismaClient

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
