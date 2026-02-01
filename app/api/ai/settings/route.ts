import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { arenaId, settings } = await req.json()

    if (arenaId === 'global') {
      // Aplicar para todas as arenas
      await prisma.arena.updateMany({
        data: {
          aiPersona: settings.persona,
          aiInterventionRate: settings.interventionRate,
          aiFrustrationThreshold: settings.frustrationThreshold,
          aiCooldown: settings.cooldown
        }
      })
    } else {
      // Aplicar para arena específica
      await prisma.arena.update({
        where: { id: arenaId },
        data: {
          aiPersona: settings.persona,
          aiInterventionRate: settings.interventionRate,
          aiFrustrationThreshold: settings.frustrationThreshold,
          aiCooldown: settings.cooldown
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating AI settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
