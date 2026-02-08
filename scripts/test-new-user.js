/**
 * Teste com novo usuário
 */
const { Client } = require('pg')

async function test() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'nfc',
    password: 'nfc123',
    database: 'nutrifitcoach',
  })

  console.log('Tentando conectar com usuário nfc...')

  try {
    await client.connect()
    console.log('✅ CONECTADO!')

    const res = await client.query('SELECT COUNT(*) FROM "Arena"')
    console.log(`Arenas: ${res.rows[0].count}`)

    await client.end()
  } catch (err) {
    console.error('❌ Erro:', err.message)
  }
}

test()
