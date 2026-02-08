/**
 * Prepara o PostgreSQL local (Docker) para receber a migração do Supabase
 *
 * Uso: node scripts/prepare-local-db.js
 */

const { execSync } = require('child_process')

function exec(command, description) {
  console.log(`   ${description}...`)
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
    console.log('   ✅ Sucesso')
    return output
  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}`)
    return null
  }
}

async function main() {
  console.log('🔧 Preparando PostgreSQL local para migração...\n')

  // 1. Resetar senha
  console.log('1️⃣  Resetando senha do usuário postgres...')
  exec(
    'docker exec unified-postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD \'postgres\';"',
    'Alterando senha'
  )
  console.log('')

  // 2. Verificar/criar database
  console.log('2️⃣  Verificando database nutrifitcoach...')
  const checkDb = exec(
    'docker exec unified-postgres psql -U postgres -lqt',
    'Listando databases'
  )

  if (checkDb && checkDb.includes('nutrifitcoach')) {
    console.log('   ✅ Database nutrifitcoach já existe')
  } else {
    console.log('   📦 Criando database nutrifitcoach...')
    exec(
      'docker exec unified-postgres psql -U postgres -c "CREATE DATABASE nutrifitcoach;"',
      'Criando database'
    )
  }
  console.log('')

  // 3. Configurar pg_hba.conf
  console.log('3️⃣  Configurando autenticação do PostgreSQL...')
  exec(
    'docker exec unified-postgres sh -c "sed -i \'s/trust/scram-sha-256/g\' /var/lib/postgresql/data/pg_hba.conf"',
    'Atualizando pg_hba.conf'
  )
  exec(
    'docker exec unified-postgres psql -U postgres -c "SELECT pg_reload_conf();"',
    'Recarregando configuração'
  )
  console.log('')

  // 4. Aplicar schema do Prisma
  console.log('4️⃣  Aplicando schema do Prisma...')
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/nutrifitcoach'
  process.env.DIRECT_URL = 'postgresql://postgres:postgres@localhost:5432/nutrifitcoach'

  console.log('   Tentando prisma migrate deploy...')
  try {
    execSync('npx prisma migrate deploy', { encoding: 'utf-8', stdio: 'inherit' })
    console.log('   ✅ Migrations aplicadas')
  } catch (error) {
    console.log('   ⚠️  Migrate falhou, tentando db push...')
    try {
      execSync('npx prisma db push --skip-generate', { encoding: 'utf-8', stdio: 'inherit' })
      console.log('   ✅ Schema aplicado via db push')
    } catch (err) {
      console.error('   ❌ Erro ao aplicar schema:', err.message)
    }
  }
  console.log('')

  console.log('🎉 Banco local preparado!\n')
  console.log('Próximo passo: node scripts/migrate-supabase-to-docker.js')
}

main().catch(console.error)
