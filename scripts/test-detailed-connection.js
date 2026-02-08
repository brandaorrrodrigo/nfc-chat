/**
 * Teste com configurações detalhadas
 */
const { Client } = require('pg')

async function test() {
  const configs = [
    {
      desc: 'Com SSL desabilitado',
      config: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'nfc2026',
        database: 'nutrifitcoach',
        ssl: false,
      }
    },
    {
      desc: 'Com connectionTimeoutMillis alto',
      config: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'nfc2026',
        database: 'nutrifitcoach',
        connectionTimeoutMillis: 10000,
      }
    },
    {
      desc: 'IP do container',
      config: {
        host: '172.18.0.8',
        port: 5432,
        user: 'postgres',
        password: 'nfc2026',
        database: 'nutrifitcoach',
      }
    },
  ]

  for (const { desc, config } of configs) {
    console.log(`\n🔍 Tentando: ${desc}`)
    console.log(`   Host: ${config.host}`)

    const client = new Client(config)

    try {
      await client.connect()
      console.log(`✅ SUCESSO!`)

      const res = await client.query('SELECT COUNT(*) FROM "Arena"')
      console.log(`   Arenas: ${res.rows[0].count}\n`)

      await client.end()
      return // Para se funcionar
    } catch (err) {
      console.log(`❌ Falhou: ${err.message}`)
    }
  }

  console.log('\n❌ Nenhuma configuração funcionou\n')
}

test()
