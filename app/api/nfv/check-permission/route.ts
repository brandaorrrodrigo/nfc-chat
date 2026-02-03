/**
 * API Route: Check Video Upload Permission
 * Verifica se usuário pode enviar vídeo (FP ou assinatura)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const arenaSlug = searchParams.get('arenaSlug');
    const userId = searchParams.get('userId');

    if (!arenaSlug || !userId) {
      return NextResponse.json(
        { error: 'arenaSlug e userId são obrigatórios' },
        { status: 400 }
      );
    }

    // 1. Buscar arena
    const { data: arena, error: arenaError } = await supabase
      .from('Arena')
      .select('requiresFP, requiresSubscription, arenaType')
      .eq('slug', arenaSlug)
      .single();

    if (arenaError || !arena) {
      return NextResponse.json({ error: 'Arena não encontrada' }, { status: 404 });
    }

    // 2. Verificar se é arena premium
    if (arena.arenaType !== 'NFV_PREMIUM') {
      return NextResponse.json({
        allowed: false,
        reason: 'Arena não suporta upload de vídeo',
      });
    }

    // 3. Buscar usuário
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('fpAvailable, role')
      .eq('id', userId)
      .single();

    if (userError) {
      // Usuário não existe no banco, criar registro básico
      console.log('[Check Permission] User not found, allowing upload');
      return NextResponse.json({
        allowed: true,
        reason: 'new_user',
        fpCost: arena.requiresFP || 0,
        fpBalance: 0,
      });
    }

    // 4. Verificar assinatura (TODO: integrar com sistema de assinaturas)
    const isSubscriber = false; // Por enquanto sempre false

    // 5. Verificar FP
    const fpCost = arena.requiresFP || 0;
    const fpBalance = user.fpAvailable || 0;
    const hasSufficientFP = fpBalance >= fpCost;

    // 6. Determinar permissão
    let allowed = false;
    let reason = '';

    if (isSubscriber) {
      allowed = true;
      reason = 'subscriber';
    } else if (hasSufficientFP) {
      allowed = true;
      reason = 'fp_sufficient';
    } else {
      allowed = false;
      reason = 'insufficient_fp';
    }

    return NextResponse.json({
      allowed,
      reason,
      fpCost,
      fpBalance,
      isSubscriber,
    });
  } catch (error: any) {
    console.error('[Check Permission] Error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
