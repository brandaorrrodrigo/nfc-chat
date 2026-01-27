/**
 * API: Favorites
 * Path: /api/comunidades/favorites
 *
 * Gerencia favoritos de tópicos e comunidades.
 * SEMPRE retorna JSON válido.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { apiSuccess, apiError } from '@/lib/api-utils';

// Store mock em memória (substituir por Supabase em produção)
// Estrutura: userId -> Set<"type:id">
const favoritesStore = new Map<string, Set<string>>();

function getFavoriteKey(type: string, id: string): string {
  return `${type}:${id}`;
}

/**
 * GET /api/comunidades/favorites
 * Retorna favoritos do usuário ou verifica se um item é favorito
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        isFavorite: false,
        favorites: [],
      });
    }

    const userId = (session.user as any).id || session.user.email;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const userFavorites = favoritesStore.get(userId) || new Set();

    // Se type e id fornecidos, verifica item específico
    if (type && id) {
      const key = getFavoriteKey(type, id);
      return NextResponse.json({
        success: true,
        isFavorite: userFavorites.has(key),
      });
    }

    // Retorna todos os favoritos
    const favorites = Array.from(userFavorites).map((key) => {
      const [type, id] = key.split(':');
      return { type, id };
    });

    return NextResponse.json({
      success: true,
      favorites,
    });
  } catch (err) {
    console.error('[Favorites GET Error]', err);
    return apiError('Erro ao buscar favoritos', 500);
  }
}

/**
 * POST /api/comunidades/favorites
 * Adiciona ou remove favorito (toggle)
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

    const { type, slug, id } = body;
    const itemId = id || slug;

    if (!type || !itemId) {
      return apiError('type e (id ou slug) são obrigatórios', 400);
    }

    // Inicializar store se não existir
    if (!favoritesStore.has(userId)) {
      favoritesStore.set(userId, new Set());
    }

    const userFavorites = favoritesStore.get(userId)!;
    const key = getFavoriteKey(type, itemId);

    // Toggle
    let isFavorite: boolean;
    if (userFavorites.has(key)) {
      userFavorites.delete(key);
      isFavorite = false;
    } else {
      userFavorites.add(key);
      isFavorite = true;
    }

    return NextResponse.json({
      success: true,
      isFavorite,
      action: isFavorite ? 'added' : 'removed',
    });
  } catch (err) {
    console.error('[Favorites POST Error]', err);
    return apiError('Erro ao processar favorito', 500);
  }
}
