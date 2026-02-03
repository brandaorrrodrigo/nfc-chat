/**
 * Test Supabase REST API Connection
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando API REST do Supabase...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY?.substring(0, 30) + '...\n');

async function testSupabaseAPI() {
  try {
    // Test 1: List arenas via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/Arena?select=slug,name,categoria,isActive&categoria=eq.BIOMECANICA_NFV&order=slug.asc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arenas = await response.json();

    console.log('✅ Conexão via REST API funcionou!\n');
    console.log(`✅ Encontradas ${arenas.length} arenas de biomecânica:\n`);

    arenas.forEach((arena: any, index: number) => {
      console.log(`${index + 1}. ${arena.slug}`);
      console.log(`   Nome: ${arena.name}`);
      console.log(`   Ativa: ${arena.isActive}`);
      console.log('');
    });

    // Test 2: Count total arenas
    const countResponse = await fetch(`${SUPABASE_URL}/rest/v1/Arena?select=count`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    });

    const countHeader = countResponse.headers.get('content-range');
    const totalCount = countHeader ? parseInt(countHeader.split('/')[1]) : 0;

    console.log(`✅ Total de arenas no banco: ${totalCount}\n`);
    console.log('🎉 Teste concluído com sucesso!');
    console.log('\n💡 A REST API funciona! O problema é apenas a conexão PostgreSQL direta.');

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

testSupabaseAPI();
