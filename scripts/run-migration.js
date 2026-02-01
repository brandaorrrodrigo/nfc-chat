/**
 * Script para executar migration SQL no Supabase
 * Uso: node scripts/run-migration.js
 */

const fs = require('fs');
const path = require('path');

// Carregar .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { Client } = require('pg');

async function runMigration() {
  // Usar pooler URL para melhor compatibilidade
  const databaseUrl = process.env.DATABASE_URL?.replace('db.', 'aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1')
    || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URL não encontrada em .env.local');
    process.exit(1);
  }

  // Extrair componentes da URL original e reconstruir
  const originalUrl = process.env.DATABASE_URL;
  const match = originalUrl.match(/postgresql:\/\/([^:]+):([^@]+)@[^\/]+\/(.+)/);

  if (!match) {
    console.error('DATABASE_URL em formato inválido');
    process.exit(1);
  }

  const [, user, password, database] = match;
  const projectRef = 'qducbqhuwqdyqioqevle';

  // Tentar conexão direta primeiro
  const directUrl = `postgresql://${user}:${password}@db.${projectRef}.supabase.co:5432/${database}`;

  const client = new Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    console.log('Conectando ao Supabase...');
    await client.connect();
    console.log('Conectado!');

    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', 'ia_interventions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executando migration...');
    await client.query(sql);
    console.log('Migration executada com sucesso!');

  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
