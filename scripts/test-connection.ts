/**
 * Test Database Connection
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('\n🔍 Testando conexão com o banco...\n');

    // Test 1: Connection
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Test 2: Count arenas
    const count = await prisma.arena.count();
    console.log(`✅ Total de arenas no banco: ${count}\n`);

    // Test 3: List biomechanics arenas
    const bioArenas = await prisma.arena.findMany({
      where: {
        categoria: 'BIOMECANICA_NFV'
      },
      select: {
        slug: true,
        name: true,
        isActive: true,
        arenaType: true,
      },
      orderBy: {
        slug: 'asc'
      }
    });

    console.log('✅ Arenas de Biomecânica encontradas:');
    console.table(bioArenas);

    // Test 4: Get specific arena
    const agachamento = await prisma.arena.findUnique({
      where: { slug: 'analise-agachamento' }
    });

    if (agachamento) {
      console.log('\n✅ Arena "analise-agachamento" encontrada:');
      console.log('  - ID:', agachamento.id);
      console.log('  - Nome:', agachamento.name);
      console.log('  - Ativa:', agachamento.isActive);
      console.log('  - Tipo:', agachamento.arenaType);
    } else {
      console.log('\n❌ Arena "analise-agachamento" NÃO encontrada!');
    }

    console.log('\n🎉 Teste concluído com sucesso!');
  } catch (error: any) {
    console.error('\n❌ Erro ao conectar:', error.message);
    console.error('\nDetalhes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
