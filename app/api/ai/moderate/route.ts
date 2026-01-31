/**
 * API: Moderacao IA
 * Path: /api/ai/moderate
 *
 * Endpoint para moderacao automatica de mensagens.
 * Detecta novatos, sentimento, desinformacao e gera respostas.
 *
 * POST - Analisa mensagem e retorna resposta da IA (se necessario)
 * GET - Retorna status do sistema de moderacao
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { moderateMessage, celebrateStreak, celebrateFPMilestone } from '@/lib/ia/moderator';
import { getUserStats } from '@/lib/ia/user-detector';
// FP é concedido pelo sistema principal no frontend (useFP hook)
// Evitamos duplicação não importando/chamando awardFP aqui

// ========================================
// GET - Status do Sistema
// ========================================

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      success: true,
      moderator: {
        status: 'active',
        version: '1.0.0',
        features: {
          welcomeMessages: true,
          emotionalSupport: true,
          misinformationCorrection: true,
          achievementCelebration: true,
          streakCelebration: true,
          fpMilestones: true,
        },
      },
    });
  } catch (error) {
    console.error('[AI Moderate GET Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao obter status' },
      { status: 500 }
    );
  }
}

// ========================================
// POST - Moderar Mensagem
// ========================================

interface ModerationRequestBody {
  userId: string;
  userName: string;
  content: string;
  communitySlug: string;
  communityName?: string;
  messageId?: string;
  // Opcional: verificar streak/FP milestones
  checkStreak?: boolean;
  checkFPMilestone?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticacao (opcional mas recomendado)
    const session = await getServerSession(authOptions);

    const body: ModerationRequestBody = await request.json();

    // Validacao basica
    if (!body.userId || !body.content || !body.communitySlug) {
      return NextResponse.json(
        { success: false, error: 'userId, content e communitySlug sao obrigatorios' },
        { status: 400 }
      );
    }

    // 1. MODERAR MENSAGEM
    const result = await moderateMessage({
      userId: body.userId,
      userName: body.userName || 'Usuario',
      content: body.content,
      communitySlug: body.communitySlug,
      communityName: body.communityName,
      messageId: body.messageId,
    });

    // 2. CONCEDER FP (se configurado)
    // Nota: FP já é concedido pelo sistema principal de FP no frontend
    // Aqui só logamos para debugging
    if (result.fpAwarded > 0) {
      console.log(`[AI Moderate] FP sugerido: ${result.fpAwarded} para ${body.userId} (ação: ${result.action})`);
      // O sistema principal de FP (useFP hook) já cuida da concessão de FP
      // Evitamos duplicação não chamando awardFP aqui
    }

    // 3. VERIFICAR STREAK (se solicitado)
    let streakCelebration = null;
    if (body.checkStreak) {
      const stats = result.userStats || await getUserStats(body.userId);
      if (stats.streakDays > 0) {
        streakCelebration = await celebrateStreak(
          body.userId,
          body.userName,
          stats.streakDays,
          stats.fpTotal
        );
      }
    }

    // 4. VERIFICAR FP MILESTONE (se solicitado)
    let fpMilestoneResult = null;
    if (body.checkFPMilestone) {
      const stats = result.userStats || await getUserStats(body.userId);
      fpMilestoneResult = celebrateFPMilestone(body.userName, stats.fpTotal);
    }

    // 5. RETORNAR RESULTADO
    return NextResponse.json({
      success: true,
      moderation: {
        shouldRespond: result.shouldRespond,
        response: result.response,
        responseType: result.responseType,
        action: result.action,
        interventionId: result.interventionId,
      },
      fp: {
        awarded: result.fpAwarded,
        action: result.action,
      },
      analysis: result.analysis ? {
        sentiment: result.analysis.sentiment,
        mainTopic: result.analysis.mainTopic,
        isQuestion: result.analysis.isQuestion,
        needsEmotionalSupport: result.analysis.needsEmotionalSupport,
        hasMisinformation: result.analysis.hasMisinformation,
      } : null,
      celebrations: {
        streak: streakCelebration,
        fpMilestone: fpMilestoneResult,
      },
    });

  } catch (error: any) {
    console.error('[AI Moderate POST Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao moderar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

