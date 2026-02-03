/**
 * Test Supabase - Verificação Simples
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando Supabase - Verificação Simples\n');

async function testSupabase() {
  try {
    // Test 1: Health check
    console.log('1️⃣ Testando health check...');
    const healthResponse = await fetch(`${SUPABASE_URL}/rest/v1/`);
    console.log(`   Status: ${healthResponse.status} ${healthResponse.statusText}\n`);

    // Test 2: Listar tabelas (usando schema endpoint)
    console.log('2️⃣ Tentando acessar Arena (case-sensitive)...');

    // Tentar com letra maiúscula
    const response1 = await fetch(`${SUPABASE_URL}/rest/v1/Arena?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    console.log(`   "Arena" (maiúscula): ${response1.status} ${response1.statusText}`);

    // Tentar com letra minúscula
    const response2 = await fetch(`${SUPABASE_URL}/rest/v1/arena?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    console.log(`   "arena" (minúscula): ${response2.status} ${response2.statusText}\n`);

    // Test 3: Tentar qualquer tabela
    console.log('3️⃣ Testando outras tabelas...');
    const tables = ['User', 'user', 'Post', 'post'];

    for (const table of tables) {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      console.log(`   "${table}": ${res.status} ${res.statusText}`);
    }

    console.log('\n4️⃣ Verificando se a API key está válida...');
    console.log(`   Key length: ${SUPABASE_ANON_KEY?.length} chars`);
    console.log(`   Key starts with: ${SUPABASE_ANON_KEY?.substring(0, 20)}...`);

    // Verificar se é uma JWT válida
    try {
      const parts = SUPABASE_ANON_KEY!.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        console.log(`   JWT role: ${payload.role}`);
        console.log(`   JWT iss: ${payload.iss}`);
        console.log(`   JWT exp: ${new Date(payload.exp * 1000).toISOString()}`);
      }
    } catch (e) {
      console.log('   ❌ Não é uma JWT válida');
    }

  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
  }
}

testSupabase();
