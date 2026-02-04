import 'dotenv/config'
import { PrismaClient } from './lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nutrifitcoach.com' },
    update: {},
    create: {
      email: 'admin@nutrifitcoach.com',
      name: 'Admin NFC',
      password: 'admin123',
      role: 'SUPER_ADMIN' as any,
      twoFactorEnabled: false,
      fpTotal: 1000,
      fpAvailable: 1000
    }
  })

  console.log('✅ Admin criado:', admin.email)
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
