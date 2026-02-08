/**
 * Migração Supabase → Docker usando SQL puro (sem Prisma)
 *
 * Uso: node scripts/migrate-supabase-to-docker-sql.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { execSync } = require('child_process')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const TABLES = [
  'User',
  'Arena',
  'ArenaTag',
  'Post',
  'Comment',
  'UserArenaActivity',
  'AIMetadata',
]

// Campos permitidos (que existem no schema Prisma)
const ALLOWED_FIELDS = {
  User: ['id', 'email', 'name', 'password', 'role', 'twoFactorEnabled', 'twoFactorSecret',
         'fpTotal', 'fpAvailable', 'currentStreak', 'longestStreak', 'lastActiveDate',
         'fp_balance', 'fp_lifetime', 'subscription_tier', 'subscription_status', 'subscription_ends_at',
         'free_baseline_used', 'isMuted', 'mutedUntil', 'isBanned', 'bannedAt', 'bannedReason',
         'spamScore', 'createdAt', 'updatedAt'],
  Arena: ['id', 'slug', 'name', 'description', 'icon', 'color', 'category', 'isActive', 'isPaused',
           'allowImages', 'allowLinks', 'allowVideos', 'aiPersona', 'aiInterventionRate',
           'aiFrustrationThreshold', 'aiCooldown', 'arenaType', 'parentArenaSlug', 'requiresFP',
           'requiresSubscription', 'movementCategory', 'movementPattern', 'categoria', 'criadaPor',
           'createdByUserId', 'totalPosts', 'totalComments', 'dailyActiveUsers', 'status',
           'createdAt', 'updatedAt'],
  Post: ['id', 'arenaId', 'userId', 'content', 'isPublished', 'isDeleted', 'isPinned', 'createdAt', 'updatedAt'],
  Comment: ['id', 'postId', 'userId', 'content', 'isDeleted', 'createdAt', 'updatedAt'],
  ArenaTag: null,
  UserArenaActivity: null,
  AIMetadata: null,
}

// Mapeamento de campos Supabase (snake_case) → Prisma (camelCase)
const FIELD_MAPPINGS = {
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  is_active: 'isActive',
  is_deleted: 'isDeleted',
  is_published: 'isPublished',
  is_pinned: 'isPinned',
  is_muted: 'isMuted',
  is_banned: 'isBanned',
  is_paused: 'isPaused',
  two_factor_enabled: 'twoFactorEnabled',
  fp_total: 'fpTotal',
  fp_available: 'fpAvailable',
  current_streak: 'currentStreak',
  longest_streak: 'longestStreak',
  last_streak_date: 'lastStreakDate',
  spam_score: 'spamScore',
  last_activity_at: 'lastActivityAt',
  allow_images: 'allowImages',
  allow_links: 'allowLinks',
  allow_videos: 'allowVideos',
  daily_active_users: 'dailyActiveUsers',
  total_posts: 'totalPosts',
  total_comments: 'totalComments',
  ai_persona: 'aiPersona',
  ai_intervention_rate: 'aiInterventionRate',
  ai_frustration_threshold: 'aiFrustrationThreshold',
  ai_cooldown: 'aiCooldown',
  arena_type: 'arenaType',
  parent_arena_slug: 'parentArenaSlug',
  requires_fp: 'requiresFP',
  requires_subscription: 'requiresSubscription',
  movement_category: 'movementCategory',
  movement_pattern: 'movementPattern',
  created_by_user_id: 'createdByUserId',
  criada_por: 'criadaPor',
  atualizado_em: 'updatedAt',
  user_id: 'userId',
  arena_id: 'arenaId',
  post_id: 'postId',
}

function mapFields(data, tableName) {
  const allowedFields = ALLOWED_FIELDS[tableName]

  return data.map(row => {
    const mapped = {}
    Object.keys(row).forEach(key => {
      const newKey = FIELD_MAPPINGS[key] || key

      // Se há lista de campos permitidos, filtrar
      if (allowedFields && !allowedFields.includes(newKey)) {
        return // Skip this field
      }

      mapped[newKey] = row[key]
    })
    // Adicionar timestamps se faltarem
    if (!mapped.updatedAt && !mapped.updated_at) {
      mapped.updatedAt = mapped.createdAt || new Date().toISOString()
    }
    return mapped
  })
}

function escapeValue(val) {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'boolean') return val ? 'true' : 'false'
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    // Escapar aspas simples
    return `'${val.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`
  }
  if (val instanceof Date) {
    return `'${val.toISOString()}'`
  }
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`
  }
  return 'NULL'
}

function generateInsertSQL(tableName, data) {
  if (!data || data.length === 0) return ''

  // Pegar todas as colunas de todos os registros (alguns podem ter campos null)
  const allColumns = new Set()
  data.forEach(row => {
    Object.keys(row).forEach(key => allColumns.add(key))
  })
  const columns = Array.from(allColumns)

  const values = data.map(row => {
    const vals = columns.map(col => {
      const val = row[col]
      // Se o campo não existe no registro, usar NULL
      return val !== undefined ? escapeValue(val) : 'NULL'
    })
    return `(${vals.join(', ')})`
  }).join(',\n  ')

  return `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')})
VALUES
  ${values}
ON CONFLICT DO NOTHING;`
}

async function migrateTable(tableName) {
  console.log(`\n📦 Migrando ${tableName}...`)

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(10000)

    if (error) {
      console.error(`❌ Erro ao buscar: ${error.message}`)
      return { table: tableName, count: 0 }
    }

    if (!data || data.length === 0) {
      console.log(`   ⚠️  Tabela vazia`)
      return { table: tableName, count: 0 }
    }

    console.log(`   Encontrados ${data.length} registros`)

    // Mapear campos snake_case → camelCase e filtrar campos inválidos
    const mappedData = mapFields(data, tableName)

    // Gerar SQL
    const sql = generateInsertSQL(tableName, mappedData)

    // Salvar em arquivo temporário
    const tmpFile = `scripts/tmp_${tableName}.sql`
    fs.writeFileSync(tmpFile, sql)

    // Executar no PostgreSQL
    console.log(`   Executando INSERT...`)
    try {
      const output = execSync(
        `cat "${tmpFile}" | docker exec -i -e PGPASSWORD=postgres unified-postgres psql -U postgres -d nutrifitcoach`,
        { encoding: 'utf-8', stdio: 'pipe' }
      )
      if (output.includes('ERROR')) {
        console.error(`   ⚠️  Avisos/Erros:\n${output}`)
      }
      console.log(`   ✅ ${data.length} registros inseridos`)

      // NÃO limpar arquivo temporário para debug
      // fs.unlinkSync(tmpFile)
      console.log(`   📄 SQL salvo em: ${tmpFile}`)

      return { table: tableName, count: data.length }
    } catch (error) {
      console.error(`   ❌ Erro ao inserir:`, error.message)
      return { table: tableName, count: 0 }
    }

  } catch (error) {
    console.error(`❌ Erro fatal:`, error.message)
    return { table: tableName, count: 0 }
  }
}

async function main() {
  console.log('🚀 Migração Supabase → PostgreSQL Docker (SQL puro)\n')

  const results = []

  for (const table of TABLES) {
    const result = await migrateTable(table)
    results.push(result)
  }

  // Resumo
  console.log('\n📊 RESUMO:')
  console.log('═'.repeat(50))

  let total = 0
  results.forEach(({ table, count }) => {
    console.log(`${count > 0 ? '✅' : '⚠️ '} ${table.padEnd(25)} ${count} registros`)
    total += count
  })

  console.log('═'.repeat(50))
  console.log(`\n✅ Total migrado: ${total} registros\n`)
}

main().catch(console.error)
