/**
 * Teste de conexão com nfc-postgres
 */
require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function test() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'nfc',
    password: 'nfc_password_change_me',
    database: 'nfc_admin',
  })

  console.log('🔍 Testando conexão nfc-postgres...\n')
  console.log('User:', 'nfc')
  console.log('Database:', 'nfc_admin\n')

  try {
    await client.connect()
    console.log('✅ CONECTADO COM SUCESSO!\n')

    // Listar tabelas
    const { rows: tables } = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `)

    console.log(`📋 Tabelas encontradas: ${tables.length}`)
    if (tables.length > 0) {
      tables.forEach(t => console.log(`   - ${t.tablename}`))
    } else {
      console.log('   (nenhuma tabela ainda - banco novo)')
    }

    await client.end()
    console.log('\n✅ Teste completo!\n')
  } catch (err) {
    console.error('❌ Erro:', err.message)
    console.error('Código:', err.code)
  }
}

test()
