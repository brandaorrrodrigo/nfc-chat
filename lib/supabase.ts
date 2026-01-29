/**
 * Supabase Client
 *
 * Cliente para conexão com o Supabase.
 * Usa as variáveis de ambiente do .env.local
 *
 * IMPORTANTE: Cliente é opcional - só inicializa se tiver credenciais
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Só cria o cliente se as credenciais existirem
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('⚠️ Supabase credentials not found. Database features disabled.');
}

/**
 * Verifica se o Supabase está configurado
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

/**
 * Retorna o cliente Supabase ou lança erro se não configurado
 */
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return supabase;
}

export { supabase };
export default supabase;
