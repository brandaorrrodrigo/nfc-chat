/**
 * PostgreSQL Client Direct (substitui Supabase Client)
 *
 * Usa pg driver diretamente pois Prisma tem problemas de autenticação
 * com Docker PostgreSQL no Windows
 */

import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

// Helper para queries
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('[PG Query]', { text: text.substring(0, 100), duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('[PG Error]', { text, error })
    throw error
  }
}

// Helper para pegar um client da pool (para transactions)
export async function getClient() {
  return await pool.connect()
}

// Query Builder - compatível com Supabase Client API
class QueryBuilder {
  private table: string
  private selectColumns: string = '*'
  private whereClauses: string[] = []
  private whereParams: any[] = []
  private orderByClause: string = ''
  private limitClause: string = ''
  private options: { count?: 'exact', head?: boolean } = {}

  constructor(table: string) {
    this.table = table
  }

  select(columns: string = '*', opts?: { count?: 'exact', head?: boolean }) {
    this.selectColumns = columns
    if (opts) this.options = opts
    return this
  }

  eq(column: string, value: any) {
    this.whereClauses.push(`"${column}" = $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  neq(column: string, value: any) {
    this.whereClauses.push(`"${column}" != $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  gte(column: string, value: any) {
    this.whereClauses.push(`"${column}" >= $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  lte(column: string, value: any) {
    this.whereClauses.push(`"${column}" <= $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  gt(column: string, value: any) {
    this.whereClauses.push(`"${column}" > $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  lt(column: string, value: any) {
    this.whereClauses.push(`"${column}" < $${this.whereParams.length + 1}`)
    this.whereParams.push(value)
    return this
  }

  in(column: string, values: any[]) {
    if (values.length === 0) {
      this.whereClauses.push('1 = 0') // Never match
      return this
    }
    const placeholders = values.map((_, i) => `$${this.whereParams.length + i + 1}`).join(',')
    this.whereClauses.push(`"${column}" IN (${placeholders})`)
    this.whereParams.push(...values)
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    const direction = options?.ascending === false ? 'DESC' : 'ASC'
    this.orderByClause = `ORDER BY "${column}" ${direction}`
    return this
  }

  limit(n: number) {
    this.limitClause = `LIMIT ${n}`
    return this
  }

  async single() {
    const sql = this.buildSQL() + ' LIMIT 1'
    try {
      const { rows } = await query(sql, this.whereParams)
      return { data: rows[0] || null, error: null }
    } catch (error) {
      console.error('[QueryBuilder] Error:', error)
      return { data: null, error }
    }
  }

  async execute() {
    try {
      // Se for count com head, apenas contar
      if (this.options.count === 'exact' && this.options.head) {
        const countSQL = this.buildCountSQL()
        const { rows } = await query(countSQL, this.whereParams)
        return { count: parseInt(rows[0].count), error: null }
      }

      // Se for count normal, contar e retornar dados
      if (this.options.count === 'exact') {
        const countSQL = this.buildCountSQL()
        const dataSQL = this.buildSQL()
        const [countResult, dataResult] = await Promise.all([
          query(countSQL, this.whereParams),
          query(dataSQL, this.whereParams)
        ])
        return {
          count: parseInt(countResult.rows[0].count),
          data: dataResult.rows,
          error: null
        }
      }

      // Query normal
      const sql = this.buildSQL()
      const { rows } = await query(sql, this.whereParams)
      return { data: rows, error: null }
    } catch (error) {
      console.error('[QueryBuilder] Error:', error)
      return { data: null, error }
    }
  }

  private buildSQL(): string {
    let sql = `SELECT ${this.selectColumns} FROM "${this.table}"`

    if (this.whereClauses.length > 0) {
      sql += ` WHERE ${this.whereClauses.join(' AND ')}`
    }

    if (this.orderByClause) {
      sql += ` ${this.orderByClause}`
    }

    if (this.limitClause) {
      sql += ` ${this.limitClause}`
    }

    return sql
  }

  private buildCountSQL(): string {
    let sql = `SELECT COUNT(*) FROM "${this.table}"`

    if (this.whereClauses.length > 0) {
      sql += ` WHERE ${this.whereClauses.join(' AND ')}`
    }

    return sql
  }
}

// Wrapper similar ao Supabase Client para facilitar migração
export const db = {
  // SELECT com query builder
  from: (table: string) => new QueryBuilder(table),

  // COUNT simples (compatibilidade legada)
  count: async (table: string, where?: { column: string, value: any }) => {
    if (where) {
      const { rows } = await query(`SELECT COUNT(*) FROM "${table}" WHERE "${where.column}" = $1`, [where.value])
      return parseInt(rows[0].count)
    }
    const { rows } = await query(`SELECT COUNT(*) FROM "${table}"`)
    return parseInt(rows[0].count)
  },

  // INSERT
  insert: async (table: string, data: Record<string, any> | Record<string, any>[]) => {
    try {
      const records = Array.isArray(data) ? data : [data]
      if (records.length === 0) return { data: [], error: null }

      const columns = Object.keys(records[0])
      const values = records.map((record, rowIndex) => {
        const vals = columns.map((col, colIndex) => {
          const paramIndex = rowIndex * columns.length + colIndex + 1
          return `$${paramIndex}`
        })
        return `(${vals.join(', ')})`
      }).join(', ')

      const params = records.flatMap(record => columns.map(col => record[col]))

      const sql = `INSERT INTO "${table}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES ${values} RETURNING *`
      const { rows } = await query(sql, params)

      return { data: Array.isArray(data) ? rows : rows[0], error: null }
    } catch (error) {
      console.error('[DB Insert] Error:', error)
      return { data: null, error }
    }
  },

  // UPDATE
  update: async (table: string, data: Record<string, any>, where: { column: string, value: any }) => {
    try {
      const columns = Object.keys(data)
      const setClauses = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ')
      const params = [...columns.map(col => data[col]), where.value]

      const sql = `UPDATE "${table}" SET ${setClauses} WHERE "${where.column}" = $${columns.length + 1} RETURNING *`
      const { rows } = await query(sql, params)

      return { data: rows, error: null }
    } catch (error) {
      console.error('[DB Update] Error:', error)
      return { data: null, error }
    }
  },

  // DELETE
  delete: async (table: string, where: { column: string, value: any }) => {
    try {
      const sql = `DELETE FROM "${table}" WHERE "${where.column}" = $1 RETURNING *`
      const { rows } = await query(sql, [where.value])

      return { data: rows, error: null }
    } catch (error) {
      console.error('[DB Delete] Error:', error)
      return { data: null, error }
    }
  }
}

export default pool
