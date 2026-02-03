/**
 * API: Social Proof
 * GET /api/urgency/social-proof?hours=24
 *
 * Obtém dados de prova social para FOMO
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  getSocialProofData,
  getRecentActivity,
  getRedemptionVelocity,
  getPeakHours,
} from '@/lib/urgency/social-proof';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const includeActivity = searchParams.get('includeActivity') === 'true';
    const includeVelocity = searchParams.get('includeVelocity') === 'true';
    const includePeakHours = searchParams.get('includePeakHours') === 'true';

    // Buscar dados principais
    const socialProof = await getSocialProofData(hours);

    // Buscar dados opcionais
    const [activity, velocity, peakHours] = await Promise.all([
      includeActivity ? getRecentActivity() : Promise.resolve(null),
      includeVelocity ? getRedemptionVelocity() : Promise.resolve(null),
      includePeakHours ? getPeakHours() : Promise.resolve(null),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...socialProof,
        ...(activity && { recentActivity: activity }),
        ...(velocity && { velocity }),
        ...(peakHours && { peakHours }),
      },
    });
  } catch (error: any) {
    console.error('❌ Social proof error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch social proof data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
