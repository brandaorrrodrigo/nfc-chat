/**
 * Teste sem senha (para trust mode)
 */
const { Client } = require('pg')

async function test() {
  const configs = [
    { desc: 'Sem senha', config: { host: 'localhost', port: 5432, user: 'postgres', database: 'nutrifitcoach' } },
    { desc: 'Senha vazia', config: { host: 'localhost', port: 5432, user: 'postgres', password: '', database: 'nutrifitcoach' } },
    { desc: 'Senha postgres', config: { host: 'localhost', port: 5432, user: 'postgres', password: 'postgres', database: 'nutrifitcoach' } },
    { desc: 'Senha Anilha15!', config: { host: 'localhost', port: 5432, user: 'postgres', password: 'Anilha15!', database: 'nutrifitcoach' } },
  ]

  for (const { desc, config } of configs) {
    const client = new Client(config)
    console.log(`\nTentando: ${desc}...`)

    try {
      await client.connect()
      console.log(`✅ SUCESSO com: ${desc}`)

      const res = await client.query('SELECT COUNT(*) FROM "Arena"')
      console.log(`   Arenas: ${res.rows[0].count}`)

      await client.end()
      break // Se funcionar, para aqui
    } catch (err) {
      console.log(`❌ Falhou: ${err.message}`)
    }
  }
}

test()
