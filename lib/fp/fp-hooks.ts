/**
 * FP Hooks - Aplicação automática de regras de FP
 * Chamados quando eventos acontecem no sistema
 */

import { awardFP } from './fp-service';

/**
 * Hook: Usuário criou um novo post
 */
export async function onPostCreated(
  userId: string,
  postId: string,
  arenaSlug: string
) {
  // Award FP por criar post
  const result = await awardFP(userId, 'POST_CREATED', {
    relatedEntityType: 'POST',
    relatedEntityId: postId,
    description: `Criou tópico em ${arenaSlug}`,
  });

  // Checar se é o primeiro post do dia para bônus
  if (result.success) {
    await awardFP(userId, 'FIRST_POST_DAY', {
      relatedEntityType: 'POST',
      relatedEntityId: postId,
      description: 'Primeiro post do dia',
    });
  }

  return result;
}

/**
 * Hook: Usuário criou um comentário
 */
export async function onCommentCreated(
  userId: string,
  commentId: string,
  postId: string
) {
  return await awardFP(userId, 'COMMENT_CREATED', {
    relatedEntityType: 'COMMENT',
    relatedEntityId: commentId,
    description: 'Comentou em tópico',
  });
}

/**
 * Hook: Usuário criou uma resposta
 */
export async function onReplyCreated(
  userId: string,
  replyId: string,
  commentId: string
) {
  return await awardFP(userId, 'REPLY_CREATED', {
    relatedEntityType: 'REPLY',
    relatedEntityId: replyId,
    description: 'Respondeu comentário',
  });
}

/**
 * Hook: Post recebeu um like
 */
export async function onPostLiked(
  authorId: string,
  postId: string,
  likerId: string
) {
  // Apenas dar FP se quem deu like não é o próprio autor
  if (authorId === likerId) {
    return { success: false, reason: 'self_like' };
  }

  return await awardFP(authorId, 'POST_LIKED', {
    relatedEntityType: 'POST',
    relatedEntityId: postId,
    description: 'Post recebeu like',
  });
}

/**
 * Hook: Comentário recebeu um like
 */
export async function onCommentLiked(
  authorId: string,
  commentId: string,
  likerId: string
) {
  // Apenas dar FP se quem deu like não é o próprio autor
  if (authorId === likerId) {
    return { success: false, reason: 'self_like' };
  }

  return await awardFP(authorId, 'COMMENT_LIKED', {
    relatedEntityType: 'COMMENT',
    relatedEntityId: commentId,
    description: 'Comentário recebeu like',
  });
}

/**
 * Hook: Comentário marcado como útil
 */
export async function onCommentMarkedHelpful(
  authorId: string,
  commentId: string
) {
  return await awardFP(authorId, 'COMMENT_HELPFUL', {
    relatedEntityType: 'COMMENT',
    relatedEntityId: commentId,
    description: 'Comentário marcado como útil',
  });
}

/**
 * Hook: Resposta marcada como melhor resposta
 */
export async function onBestAnswerMarked(
  authorId: string,
  commentId: string,
  postId: string
) {
  return await awardFP(authorId, 'BEST_ANSWER', {
    relatedEntityType: 'COMMENT',
    relatedEntityId: commentId,
    description: 'Melhor resposta',
  });
}

/**
 * Hook: Post compartilhado
 */
export async function onPostShared(
  authorId: string,
  postId: string
) {
  return await awardFP(authorId, 'POST_SHARED', {
    relatedEntityType: 'POST',
    relatedEntityId: postId,
    description: 'Post compartilhado',
  });
}

/**
 * Hook: Análise de vídeo aprovada
 */
export async function onVideoAnalysisApproved(
  userId: string,
  analysisId: string
) {
  return await awardFP(userId, 'VIDEO_ANALYSIS_APPROVED', {
    relatedEntityType: 'VIDEO_ANALYSIS',
    relatedEntityId: analysisId,
    description: 'Análise de vídeo aprovada e publicada',
  });
}

/**
 * Hook: Usuário fez login diário
 */
export async function onDailyLogin(userId: string) {
  return await awardFP(userId, 'DAILY_LOGIN', {
    description: 'Login diário',
  });
}

/**
 * Hook: Usuário atingiu streak
 */
export async function onStreakMilestone(
  userId: string,
  streakDays: number
) {
  let action: any = null;

  if (streakDays === 7) action = 'STREAK_BONUS_7';
  else if (streakDays === 30) action = 'STREAK_BONUS_30';
  else if (streakDays === 90) action = 'STREAK_BONUS_90';
  else if (streakDays === 365) action = 'STREAK_BONUS_365';

  if (!action) return { success: false, reason: 'invalid_streak' };

  return await awardFP(userId, action, {
    description: `Bônus de ${streakDays} dias de streak`,
    bypassValidation: true,
  });
}

/**
 * Hook: Usuário ganhou badge
 */
export async function onBadgeEarned(
  userId: string,
  badgeType: string,
  badgeName: string
) {
  return await awardFP(userId, 'BADGE_EARNED', {
    relatedEntityType: 'BADGE',
    relatedEntityId: badgeType,
    description: `Conquistou badge: ${badgeName}`,
  });
}

/**
 * Hook: Penalidade por spam
 */
export async function onSpamDetected(
  userId: string,
  entityType: string,
  entityId: string
) {
  return await awardFP(userId, 'SPAM_PENALTY', {
    relatedEntityType: entityType,
    relatedEntityId: entityId,
    description: 'Penalidade por spam',
    bypassValidation: true,
  });
}

/**
 * Hook: Penalidade por conteúdo de baixa qualidade
 */
export async function onLowQualityContent(
  userId: string,
  entityType: string,
  entityId: string
) {
  return await awardFP(userId, 'LOW_QUALITY_PENALTY', {
    relatedEntityType: entityType,
    relatedEntityId: entityId,
    description: 'Penalidade por baixa qualidade',
    bypassValidation: true,
  });
}

/**
 * Hook: Penalidade por conteúdo reportado
 */
export async function onContentReported(
  userId: string,
  entityType: string,
  entityId: string,
  reason: string
) {
  return await awardFP(userId, 'REPORTED_CONTENT_PENALTY', {
    relatedEntityType: entityType,
    relatedEntityId: entityId,
    description: `Conteúdo reportado: ${reason}`,
    bypassValidation: true,
  });
}

/**
 * Hook: Post de alta qualidade aprovado por moderador
 */
export async function onQualityPostApproved(
  userId: string,
  postId: string
) {
  return await awardFP(userId, 'POST_QUALITY_BONUS', {
    relatedEntityType: 'POST',
    relatedEntityId: postId,
    description: 'Bônus por post de alta qualidade',
    bypassValidation: true,
  });
}
