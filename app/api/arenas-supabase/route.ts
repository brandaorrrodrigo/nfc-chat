/**
 * API Route: Arenas (via Supabase Client)
 * Alternativa que usa Supabase Client ao invés de Prisma
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const grouped = searchParams.get('grouped') === 'true';

    console.log('[Arenas Supabase] Fetching arenas...');

    let query = supabase
      .from('Arena')
      .select('*, tags:ArenaTag(tag)')
      .eq('isActive', true);

    if (category) {
      query = query.eq('categoria', category);
    }

    query = query.order('totalPosts', { ascending: false });

    const { data: arenas, error } = await query;

    if (error) {
      console.error('[Arenas Supabase] Error:', error);
      return NextResponse.json({ error: 'Failed to fetch arenas', details: error.message }, { status: 500 });
    }

    console.log(`[Arenas Supabase] Found ${arenas?.length || 0} arenas`);

    let result: unknown;

    if (grouped) {
      const groups: Record<string, typeof arenas> = {};
      for (const arena of arenas || []) {
        const cat = arena.categoria || 'COMUNIDADES_LIVRES';
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(arena);
      }
      result = { groups, total: arenas?.length || 0 };
    } else {
      result = arenas || [];
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Arenas Supabase] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch arenas', details: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
