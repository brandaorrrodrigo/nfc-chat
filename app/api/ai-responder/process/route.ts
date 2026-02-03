/**
 * API: AI Auto Responder
 * POST /api/ai-responder/process
 *
 * Processa perguntas sem resposta e gera respostas da IA
 * Ideal para rodar via cron job
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { processUnansweredQuestions } from '@/lib/ai-responder/auto-responder';

export async function POST(request: NextRequest) {
  try {
    // Verificar token de autorização (para cron jobs)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';

    // Permitir via token OU via sessão admin
    const hasValidToken = authHeader === `Bearer ${cronSecret}`;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === 'admin';

    if (!hasValidToken && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      minMinutesSincePost = 30,
      maxResponses = 5,
      interventionRate = 50,
    } = body;

    console.log(`🤖 AI Auto Responder triggered`);

    // Processar perguntas
    const stats = await processUnansweredQuestions({
      minMinutesSincePost,
      maxResponses,
      interventionRate,
    });

    return NextResponse.json({
      success: true,
      stats,
      message: `Processed ${stats.processed} questions, responded to ${stats.responded}`,
    });
  } catch (error: any) {
    console.error('❌ AI Auto Responder error:', error);

    return NextResponse.json(
      {
        error: 'Processing failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Status do auto responder
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      status: 'AI Auto Responder is running',
      config: {
        defaultMinMinutes: 30,
        defaultMaxResponses: 5,
        defaultInterventionRate: 50,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
