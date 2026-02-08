/**
 * Teste de conexão PostgreSQL Docker
 * Verifica se os dados migrados estão acessíveis
 */

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
})

async function testConnection() {
  console.log('🔍 Testando conexão PostgreSQL Docker...\n')

  try {
    // 1. Testar conexão básica
    const client = await pool.connect()
    console.log('✅ Conexão estabelecida com sucesso!')

    // 2. Verificar tabelas
    const { rows: tables } = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `)
    console.log(`\n📋 Tabelas encontradas: ${tables.length}`)
    tables.slice(0, 10).forEach(t => console.log(`   - ${t.tablename}`))
    if (tables.length > 10) console.log(`   ... e mais ${tables.length - 10}`)

    // 3. Contar registros principais
    const counts = await Promise.all([
      client.query('SELECT COUNT(*) FROM "User"'),
      client.query('SELECT COUNT(*) FROM "Arena"'),
      client.query('SELECT COUNT(*) FROM "Post"'),
      client.query('SELECT COUNT(*) FROM "Comment"'),
    ])

    console.log('\n📊 Registros migrados:')
    console.log(`   Users:     ${counts[0].rows[0].count}`)
    console.log(`   Arenas:    ${counts[1].rows[0].count}`)
    console.log(`   Posts:     ${counts[2].rows[0].count}`)
    console.log(`   Comments:  ${counts[3].rows[0].count}`)

    // 4. Testar query complexa (como as usadas nos endpoints)
    const { rows: arenas } = await client.query(`
      SELECT
        a.*,
        COALESCE(
          json_agg(
            json_build_object('tag', t.tag)
          ) FILTER (WHERE t.tag IS NOT NULL),
          '[]'::json
        ) as tags
      FROM "Arena" a
      LEFT JOIN "ArenaTag" t ON t."arenaId" = a.id
      WHERE a."isActive" = true
      GROUP BY a.id
      ORDER BY a."totalPosts" DESC
      LIMIT 3
    `)

    console.log(`\n🎯 Top 3 arenas ativas:`)
    arenas.forEach(a => {
      console.log(`   ${a.name} (${a.slug}) - ${a.totalPosts} posts - ${a.tags.length} tags`)
    })

    client.release()
    console.log('\n✅ Todos os testes passaram!\n')

  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()
