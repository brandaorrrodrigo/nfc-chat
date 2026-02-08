/**
 * Teste simples de conexão pg
 */
require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function test() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'nutrifitcoach',
  })

  console.log('Tentando conectar...')
  console.log('Host: localhost')
  console.log('Port: 5432')
  console.log('User: postgres')
  console.log('Database: nutrifitcoach')

  try {
    await client.connect()
    console.log('✅ Conectado!')

    const res = await client.query('SELECT NOW()')
    console.log('✅ Query executada:', res.rows[0])

    await client.end()
  } catch (err) {
    console.error('❌ Erro:', err.message)
    console.error('Código:', err.code)
  }
}

test()
