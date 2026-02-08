require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('./lib/generated/prisma')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('🔌 Testando conexão com Supabase via Prisma...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'))

    const arenaCount = await prisma.arena.count()
    console.log('✅ Conexão bem-sucedida!')
    console.log('📊 Total de arenas:', arenaCount)

    const arenas = await prisma.arena.findMany({
      take: 3,
      select: { name: true, slug: true }
    })
    console.log('📋 Primeiras arenas:', arenas)

  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
