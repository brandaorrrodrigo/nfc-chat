/**
 * Script para migrar dados do Supabase para PostgreSQL local (Docker)
 *
 * Uso: node scripts/migrate-supabase-to-docker.js
 */

const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('../lib/generated/prisma')
const { execSync } = require('child_process')

// Supabase (origem)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// PostgreSQL local (destino)
const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres:postgres@localhost:5432/nutrifitcoach',
  log: ['query', 'info', 'warn', 'error'],
})

const TABLES_TO_MIGRATE = [
  'Arena',
  'ArenaTag',
  'Post',
  'Comment',
  'User',
  'UserArenaActivity',
  'AIMetadata',
]

async function migrateTable(tableName) {
  console.log(`\n📦 Migrando ${tableName}...`)

  try {
    // Buscar todos os dados do Supabase
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(10000) // Ajustar se necessário

    if (error) {
      console.error(`❌ Erro ao buscar dados de ${tableName}:`, error.message)
      return { table: tableName, count: 0, error: error.message }
    }

    if (!data || data.length === 0) {
      console.log(`⚠️  ${tableName} está vazia no Supabase`)
      return { table: tableName, count: 0, error: null }
    }

    console.log(`   Encontrados ${data.length} registros em ${tableName}`)

    // Inserir no PostgreSQL local usando Prisma
    const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1)

    if (!prisma[modelName]) {
      console.error(`❌ Model ${modelName} não encontrado no Prisma`)
      return { table: tableName, count: 0, error: 'Model not found' }
    }

    // Inserir em lotes de 100
    const batchSize = 100
    let inserted = 0

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize)

      try {
        await prisma[modelName].createMany({
          data: batch,
          skipDuplicates: true,
        })
        inserted += batch.length
        process.stdout.write(`\r   Inseridos: ${inserted}/${data.length}`)
      } catch (err) {
        console.error(`\n   ⚠️  Erro ao inserir lote ${i}-${i + batchSize}:`, err.message)
      }
    }

    console.log(`\n✅ ${tableName}: ${inserted} registros migrados`)
    return { table: tableName, count: inserted, error: null }

  } catch (error) {
    console.error(`❌ Erro fatal em ${tableName}:`, error.message)
    return { table: tableName, count: 0, error: error.message }
  }
}

async function resetDatabase() {
  console.log('🗑️  Limpando banco de dados local...\n')

  try {
    // Desabilitar constraints temporariamente
    await prisma.$executeRawUnsafe('SET CONSTRAINTS ALL DEFERRED;')

    // Limpar tabelas na ordem correta (respeitando foreign keys)
    const tables = [
      'AIMetadata',
      'UserArenaActivity',
      'Comment',
      'Post',
      'ArenaTag',
      'Arena',
      'User',
    ]

    for (const table of tables) {
      const modelName = table.charAt(0).toLowerCase() + table.slice(1)
      if (prisma[modelName]) {
        const { count } = await prisma[modelName].deleteMany()
        console.log(`   Deletados ${count} registros de ${table}`)
      }
    }

    console.log('\n✅ Banco limpo!\n')
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Iniciando migração Supabase → PostgreSQL Docker\n')
  console.log('Origem: Supabase')
  console.log('Destino: PostgreSQL localhost:5432/nutrifitcoach\n')

  // Confirmar antes de prosseguir
  console.log('⚠️  ATENÇÃO: Isso vai APAGAR todos os dados do banco local!')
  console.log('Pressione Ctrl+C para cancelar ou Enter para continuar...')

  // Aguardar 3 segundos
  await new Promise(resolve => setTimeout(resolve, 3000))

  try {
    // 1. Limpar banco local
    await resetDatabase()

    // 2. Migrar cada tabela
    const results = []
    for (const table of TABLES_TO_MIGRATE) {
      const result = await migrateTable(table)
      results.push(result)
    }

    // 3. Resumo
    console.log('\n📊 RESUMO DA MIGRAÇÃO:')
    console.log('═'.repeat(50))

    let totalMigrated = 0
    let totalErrors = 0

    results.forEach(({ table, count, error }) => {
      const status = error ? '❌' : '✅'
      const msg = error ? `ERRO: ${error}` : `${count} registros`
      console.log(`${status} ${table.padEnd(25)} ${msg}`)

      if (!error) totalMigrated += count
      if (error) totalErrors++
    })

    console.log('═'.repeat(50))
    console.log(`\n✅ Total migrado: ${totalMigrated} registros`)
    if (totalErrors > 0) {
      console.log(`⚠️  Tabelas com erro: ${totalErrors}`)
    }
    console.log('\n🎉 Migração concluída!')

  } catch (error) {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
