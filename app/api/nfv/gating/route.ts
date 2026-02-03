/**
 * API Route: NFV Gating Check
 * GET - Verificar permissao de upload (FP + subscription)
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkVideoUploadPermission } from '@/lib/biomechanics/video-gating';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const arenaSlug = searchParams.get('arenaSlug');

    if (!userId || !arenaSlug) {
      return NextResponse.json({ error: 'userId e arenaSlug obrigatorios' }, { status: 400 });
    }

    const result = await checkVideoUploadPermission(userId, arenaSlug);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[NFV] Gating check error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
