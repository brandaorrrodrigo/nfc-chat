/**
 * API: Subscribe (Notifications)
 * Path: /api/comunidades/subscribe
 *
 * Gerencia inscrições para notificações de comunidades.
 * SEMPRE retorna JSON válido.
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { apiError } from '@/lib/api-utils';

// Store mock em memória (substituir por Supabase em produção)
// Estrutura: userId -> Set<communitySlug>
const subscriptionsStore = new Map<string, Set<string>>();

/**
 * GET /api/comunidades/subscribe
 * Verifica se usuário está inscrito em uma comunidade
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        subscribed: false,
      });
    }

    const userId = (session.user as any).id || session.user.email;
    const { searchParams } = new URL(request.url);
    const community = searchParams.get('community');

    if (!community) {
      return apiError('community é obrigatório', 400);
    }

    const userSubs = subscriptionsStore.get(userId) || new Set();

    return NextResponse.json({
      success: true,
      subscribed: userSubs.has(community),
      community,
    });
  } catch (err) {
    console.error('[Subscribe GET Error]', err);
    return apiError('Erro ao verificar inscrição', 500);
  }
}

/**
 * POST /api/comunidades/subscribe
 * Inscreve usuário em uma comunidade
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return apiError('Autenticação necessária', 401, 'UNAUTHORIZED');
    }

    const userId = (session.user as any).id || session.user.email;

    let body;
    try {
      body = await request.json();
    } catch {
      return apiError('Body JSON inválido', 400);
    }

    const { communitySlug } = body;

    if (!communitySlug) {
      return apiError('communitySlug é obrigatório', 400);
    }

    // Inicializar store se não existir
    if (!subscriptionsStore.has(userId)) {
      subscriptionsStore.set(userId, new Set());
    }

    const userSubs = subscriptionsStore.get(userId)!;
    userSubs.add(communitySlug);

    return NextResponse.json({
      success: true,
      subscribed: true,
      community: communitySlug,
      message: 'Inscrição ativada com sucesso',
    });
  } catch (err) {
    console.error('[Subscribe POST Error]', err);
    return apiError('Erro ao processar inscrição', 500);
  }
}

/**
 * DELETE /api/comunidades/subscribe
 * Remove inscrição do usuário
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return apiError('Autenticação necessária', 401, 'UNAUTHORIZED');
    }

    const userId = (session.user as any).id || session.user.email;
    const { searchParams } = new URL(request.url);
    const community = searchParams.get('community');

    if (!community) {
      return apiError('community é obrigatório', 400);
    }

    const userSubs = subscriptionsStore.get(userId);
    if (userSubs) {
      userSubs.delete(community);
    }

    return NextResponse.json({
      success: true,
      subscribed: false,
      community,
      message: 'Inscrição cancelada',
    });
  } catch (err) {
    console.error('[Subscribe DELETE Error]', err);
    return apiError('Erro ao cancelar inscrição', 500);
  }
}
