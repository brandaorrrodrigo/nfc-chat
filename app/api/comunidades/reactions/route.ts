/**
 * API: Reactions
 * Path: /api/comunidades/reactions
 *
 * Gerencia reações em mensagens das comunidades.
 * SEMPRE retorna JSON válido.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { apiSuccess, apiError } from '@/lib/api-utils';

// Tipos de reação disponíveis
const REACTION_TYPES = ['forca', 'amor', 'inspirador', 'util', 'parabens'] as const;

// Store mock em memória (substituir por Supabase em produção)
const reactionsStore = new Map<string, Map<string, Set<string>>>();

function getReactionKey(messageId: string, community: string): string {
  return `${community}:${messageId}`;
}

/**
 * GET /api/comunidades/reactions
 * Retorna reações de uma mensagem
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const community = searchParams.get('community');

    if (!messageId || !community) {
      return apiError('messageId e community são obrigatórios', 400);
    }

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    const key = getReactionKey(messageId, community);
    const messageReactions = reactionsStore.get(key);

    // Montar resposta
    const reactions = REACTION_TYPES.map((type) => {
      const usersWhoReacted = messageReactions?.get(type) || new Set();
      return {
        type,
        total: usersWhoReacted.size,
        userReacted: userId ? usersWhoReacted.has(userId) : false,
      };
    }).filter((r) => r.total > 0);

    return NextResponse.json({
      success: true,
      messageId,
      community,
      reactions,
    });
  } catch (err) {
    console.error('[Reactions GET Error]', err);
    return apiError('Erro ao buscar reações', 500);
  }
}

/**
 * POST /api/comunidades/reactions
 * Adiciona ou remove reação (toggle)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return apiError('Autenticação necessária', 401, 'UNAUTHORIZED');
    }

    const userId = (session.user as any).id || session.user.email;
    if (!userId) {
      return apiError('Usuário inválido', 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return apiError('Body JSON inválido', 400);
    }

    const { messageId, communitySlug, reactionType } = body;

    if (!messageId || !communitySlug || !reactionType) {
      return apiError('messageId, communitySlug e reactionType são obrigatórios', 400);
    }

    if (!REACTION_TYPES.includes(reactionType)) {
      return apiError(`Tipo de reação inválido: ${reactionType}`, 400);
    }

    const key = getReactionKey(messageId, communitySlug);

    // Inicializar store se não existir
    if (!reactionsStore.has(key)) {
      reactionsStore.set(key, new Map());
    }

    const messageReactions = reactionsStore.get(key)!;

    if (!messageReactions.has(reactionType)) {
      messageReactions.set(reactionType, new Set());
    }

    const usersWhoReacted = messageReactions.get(reactionType)!;

    // Toggle: se já reagiu, remove; senão, adiciona
    let action: 'added' | 'removed';
    if (usersWhoReacted.has(userId)) {
      usersWhoReacted.delete(userId);
      action = 'removed';
    } else {
      usersWhoReacted.add(userId);
      action = 'added';
    }

    return NextResponse.json({
      success: true,
      action,
      reactionType,
      total: usersWhoReacted.size,
    });
  } catch (err) {
    console.error('[Reactions POST Error]', err);
    return apiError('Erro ao processar reação', 500);
  }
}
