/**
 * GET /api/hubs/[slug]
 *
 * Retorna um HUB (arena com arenaType='NFV_HUB') com todas suas arenas filhas
 *
 * RESPOSTA:
 * {
 *   success: boolean
 *   hub: { id, slug, name, description, icon, color, arenaType, categoria }
 *   children: [{ id, slug, name, description, icon, color, totalPosts, requiresFP, status }]
 *   error?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // 1. Buscar o HUB
    const hub = await prisma.arena.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        arenaType: true,
        categoria: true,
        isActive: true,
      },
    });

    // 2. Validar se é HUB
    if (!hub || hub.arenaType !== 'NFV_HUB') {
      return NextResponse.json(
        {
          success: false,
          error: 'Arena não encontrada ou não é um HUB',
        },
        { status: 404 }
      );
    }

    // 3. Buscar arenas filhas
    const children = await prisma.arena.findMany({
      where: {
        parentArenaSlug: slug,
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        totalPosts: true,
        requiresFP: true,
        status: true,
        arenaType: true,
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(
      {
        success: true,
        hub,
        children,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[HUB API] Erro:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar HUB',
      },
      { status: 500 }
    );
  }
}
