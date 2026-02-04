const { Client } = require('pg');
require('dotenv/config');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🔌 Testando conexão ao Supabase...');
    console.log('URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    await client.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Hora do servidor:', result.rows[0]);
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  }
}

testConnection();
