/**
 * Database Client - PostgreSQL Connection
 *
 * Provides a standardized query interface for API endpoints.
 * Uses node-postgres (pg) for direct PostgreSQL access.
 *
 * SETUP REQUIRED:
 * 1. Install dependencies: npm install pg @types/pg
 * 2. Set DATABASE_URL in .env.local with Supabase connection string
 *    Format: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
 *    Get from: Supabase Dashboard > Settings > Database > Connection string
 */

import { Pool, QueryResult as PgQueryResult } from 'pg';

// PostgreSQL connection pool
let pool: Pool | null = null;

/**
 * Initialize database connection pool
 */
function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL not found in environment variables');
    throw new Error(
      'DATABASE_URL is required. Add it to .env.local:\n' +
      'DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres'
    );
  }

  pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    max: 20, // Maximum number of clients in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected database pool error:', err);
  });

  console.log('✅ PostgreSQL connection pool initialized');

  return pool;
}

/**
 * Query result interface (compatible with pg)
 */
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number | null;
  command: string;
  fields?: any[];
}

/**
 * Database client with query method
 */
export const db = {
  /**
   * Execute raw SQL query
   * @param text SQL query string (supports $1, $2, ... placeholders)
   * @param params Query parameters (optional)
   * @returns Query result with rows array
   *
   * @example
   * const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
   * const users = result.rows;
   */
  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const client = getPool();

    try {
      const result = await client.query(text, params);

      return {
        rows: result.rows,
        rowCount: result.rowCount,
        command: result.command,
        fields: result.fields,
      };
    } catch (error: any) {
      console.error('❌ Database query error:', {
        message: error.message,
        query: text.substring(0, 200),
        params: params?.map((p) => typeof p === 'string' ? p.substring(0, 50) : p),
      });
      throw error;
    }
  },

  /**
   * Get a client from the pool for transactions
   * @example
   * const client = await db.getClient();
   * try {
   *   await client.query('BEGIN');
   *   await client.query('INSERT INTO ...');
   *   await client.query('COMMIT');
   * } catch (e) {
   *   await client.query('ROLLBACK');
   *   throw e;
   * } finally {
   *   client.release();
   * }
   */
  async getClient() {
    return getPool().connect();
  },

  /**
   * Close database connection pool
   * Use in cleanup/shutdown handlers
   */
  async close() {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('✅ PostgreSQL connection pool closed');
    }
  },
};

export default db;
