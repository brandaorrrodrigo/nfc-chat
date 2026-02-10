import { PrismaClient } from '@/lib/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { hub_slug: string } }
) {
  try {
    const arenas = await prisma.arena.findMany({
      where: {
        hub_slug: params.hub_slug,
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        icon: true,
        color: true,
        description: true,
        totalPosts: true,
        dailyActiveUsers: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Metadados dos hubs disponíveis
    const HUB_CONFIG: Record<string, any> = {
      'avaliacao-fisica': {
        title: '👤 Hub de Avaliação Física',
        subtitle: 'Análise Corporal Completa',
        description:
          'Avaliação completa: composição, postura, assimetrias, saúde postural e potencial de transformação visual',
        color: 'from-amber-600 to-orange-600',
      },
      'mobilidade-flexibilidade': {
        title: '🧘 Hub de Mobilidade & Flexibilidade',
        subtitle: 'Amplitude e Movimento Funcional',
        description:
          'Melhore amplitude de movimento, evite lesões, corrija padrões posturais restritivos e ganhe liberdade de movimento',
        color: 'from-teal-600 to-cyan-600',
      },
      'treino-forca': {
        title: '💪 Hub de Treino & Força',
        subtitle: 'Ganho Muscular e Potência',
        description:
          'Ganho muscular, força máxima, progressão de carga inteligente e periodização avançada',
        color: 'from-red-600 to-pink-600',
      },
      'nutricao-dieta': {
        title: '🥗 Hub de Nutrição & Dieta',
        subtitle: 'Alimentação e Macros',
        description:
          'Nutrição prática, cálculo de macros, deficiência calórica, dietas especializadas e receitas',
        color: 'from-green-600 to-emerald-600',
      },
    };

    const hubMeta = HUB_CONFIG[params.hub_slug];

    if (!hubMeta) {
      return NextResponse.json(
        { error: 'Hub not found' },
        { status: 404 }
      );
    }

    if (arenas.length === 0) {
      return NextResponse.json(
        { error: 'No arenas found in this hub' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      hub: hubMeta,
      arenas: arenas.map((a) => ({
        ...a,
        postCount: a.totalPosts,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar arenas do hub:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hub arenas' },
      { status: 500 }
    );
  }
}
