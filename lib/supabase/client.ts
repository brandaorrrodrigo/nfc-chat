/**
 * Supabase Client
 * Cliente para uso no browser (Client Components)
 */

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Supabase client type
export type TypedSupabaseClient = SupabaseClient

// Create client function
export function createClient(): TypedSupabaseClient {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Cliente Supabase para uso no browser
 */
export const supabase: TypedSupabaseClient = createClient()

/**
 * Função para criar cliente (compatibilidade)
 */
export function createBrowserClient(): TypedSupabaseClient {
  return createClient()
}

export default supabase
