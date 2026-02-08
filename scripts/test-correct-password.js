/**
 * Teste com senha correta!
 */
const { Client } = require('pg')

async function test() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres_local_2026',
    database: 'nutrifitcoach',
  })

  console.log('Tentando conectar com senha correta...')

  try {
    await client.connect()
    console.log('✅ CONECTADO COM SUCESSO!')

    const res = await client.query('SELECT COUNT(*) FROM "Arena"')
    console.log(`\n📊 Arenas no banco: ${res.rows[0].count}`)

    const res2 = await client.query('SELECT COUNT(*) FROM "Post"')
    console.log(`📊 Posts no banco: ${res2.rows[0].count}`)

    const res3 = await client.query('SELECT COUNT(*) FROM "User"')
    console.log(`📊 Usuários no banco: ${res3.rows[0].count}\n`)

    await client.end()
  } catch (err) {
    console.error('❌ Erro:', err.message)
  }
}

test()
