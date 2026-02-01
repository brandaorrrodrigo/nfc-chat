/**
 * API: Moderacao IA
 * Path: /api/ai/moderate
 *
 * Endpoint para moderacao automatica de mensagens.
 * Detecta novatos, sentimento, desinformacao e gera respostas.
 * Analisa receitas nutricionalmente quando em arena de receitas.
 *
 * POST - Analisa mensagem e retorna resposta da IA (se necessario)
 * GET - Retorna status do sistema de moderacao
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { moderateMessage, celebrateStreak, celebrateFPMilestone } from '@/lib/ia/moderator';
import { getUserStats } from '@/lib/ia/user-detector';
import {
  parseRecipeFromPost,
  looksLikeRecipe,
  calculateRecipeNutrition,
  generateNutritionAnalysis,
} from '@/lib/nutrition';
import {
  parseExerciseFromPost,
  looksLikeExercise,
  generateExerciseAnalysis,
} from '@/lib/training';
import {
  looksLikePainPost,
  parseSymptomFromPost,
} from '@/lib/biomechanics/symptom-parser';
import {
  startInvestigation,
  getNextQuestion,
  processAnswer,
  shouldGiveDiagnosis,
  generateDiagnosis,
  formatDiagnosisForChat,
} from '@/lib/biomechanics/investigation-engine';
import {
  generateInitialResponse,
  generateFollowUpResponse,
  generateFinalDiagnosisResponse,
} from '@/lib/ai/investigation-response';
import {
  parseAspirationFromPost,
} from '@/lib/aesthetics/aspiration-parser';
import {
  generateAestheticEducationResponse,
} from '@/lib/ai/aesthetic-education-response';
// FP é concedido pelo sistema principal no frontend (useFP hook)
// Evitamos duplicação não importando/chamando awardFP aqui

// Slugs de comunidades/arenas de receitas
const RECIPE_COMMUNITY_SLUGS = [
  'receitas-saudaveis',
  'receitas',
  'arena-receitas',
  'culinaria-fit',
];

// Slugs de comunidades/arenas de exercícios
const EXERCISE_COMMUNITY_SLUGS = [
  'exercicios-que-ama',
  'exercicios',
  'treino',
  'academia',
];

// Slugs de comunidades/arenas de investigação biomecânica (Sinal Vermelho)
const PAIN_INVESTIGATION_SLUGS = [
  'sinal-vermelho',
  'dores-desconfortos',
  'investigacao-biomecânica',
];

// Slugs de comunidades/arenas de aspiração estética
const AESTHETIC_ASPIRATION_SLUGS = [
  'aspiracional-estetica',
  'estetica',
  'cirurgia-plastica',
];

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
          nutritionAnalysis: true,
          biomechanicsAnalysis: true,
          painInvestigation: true,
        },
        recipeCommunities: RECIPE_COMMUNITY_SLUGS,
        exerciseCommunities: EXERCISE_COMMUNITY_SLUGS,
        painInvestigationCommunities: PAIN_INVESTIGATION_SLUGS,
        aestheticAspirationCommunities: AESTHETIC_ASPIRATION_SLUGS,
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

    // ========================================
    // DETECTAR E ANALISAR RECEITAS
    // ========================================
    const isRecipeCommunity = RECIPE_COMMUNITY_SLUGS.includes(body.communitySlug.toLowerCase());
    const contentLooksLikeRecipe = looksLikeRecipe(body.content);

    // Se for comunidade de receitas E parecer uma receita → análise nutricional
    if (isRecipeCommunity && contentLooksLikeRecipe) {
      console.log(`[AI Moderate] Detectada receita em ${body.communitySlug} por ${body.userName}`);

      try {
        // 1. Parse da receita
        const parsedRecipe = parseRecipeFromPost(body.content);

        if (!parsedRecipe.isValid || parsedRecipe.ingredients.length < 2) {
          // Receita inválida ou muito simples - fazer moderação normal
          console.log('[AI Moderate] Receita inválida, fallback para moderação normal');
        } else {
          // 2. Calcular nutrição
          const nutrition = await calculateRecipeNutrition(parsedRecipe);

          // 3. Gerar análise completa
          const analysisResult = generateNutritionAnalysis(
            body.userName || 'Chef',
            parsedRecipe,
            nutrition
          );

          console.log(`[AI Moderate] Análise nutricional gerada: ${nutrition.perPortion.calories}kcal, ${nutrition.perPortion.protein}g proteína`);

          // 4. Retornar resposta de análise nutricional
          return NextResponse.json({
            success: true,
            type: 'recipe_analysis',
            moderation: {
              shouldRespond: true,
              response: analysisResult.response,
              responseType: 'nutrition_analysis',
              action: 'recipe_analyzed',
            },
            fp: {
              awarded: analysisResult.fpAwarded,
              action: 'recipe_shared',
            },
            recipe: {
              title: parsedRecipe.title,
              ingredientsCount: parsedRecipe.ingredients.length,
              portions: parsedRecipe.portions,
              tags: parsedRecipe.tags,
            },
            nutrition: {
              perPortion: nutrition.perPortion,
              macroRatio: nutrition.macroRatio,
              confidence: nutrition.confidence,
              unknownIngredients: nutrition.unknownIngredients,
            },
            summary: analysisResult.summary,
            analysis: null,
            celebrations: {
              streak: null,
              fpMilestone: null,
            },
            badges: null,
          });
        }
      } catch (recipeError: any) {
        console.error('[AI Moderate] Erro ao analisar receita:', recipeError.message);
        // Fallback para moderação normal em caso de erro
      }
    }

    // ========================================
    // DETECTAR E ANALISAR EXERCÍCIOS
    // ========================================
    const isExerciseCommunity = EXERCISE_COMMUNITY_SLUGS.includes(body.communitySlug.toLowerCase());
    const contentLooksLikeExercise = looksLikeExercise(body.content);

    // Se for comunidade de exercícios E parecer um exercício → análise biomecânica
    if (isExerciseCommunity && contentLooksLikeExercise) {
      console.log(`[AI Moderate] Detectado exercício em ${body.communitySlug} por ${body.userName}`);

      try {
        // 1. Parse do exercício
        const parsedExercise = parseExerciseFromPost(body.content);

        if (!parsedExercise.isValid || !parsedExercise.name) {
          // Exercício inválido - fazer moderação normal
          console.log('[AI Moderate] Exercício inválido, fallback para moderação normal');
        } else {
          // 2. Gerar análise biomecânica
          const analysisResult = generateExerciseAnalysis(
            body.userName || 'Atleta',
            parsedExercise
          );

          console.log(`[AI Moderate] Análise biomecânica gerada para: ${parsedExercise.name} (encontrado: ${analysisResult.exerciseFound})`);

          // 3. Retornar resposta de análise biomecânica
          return NextResponse.json({
            success: true,
            type: 'exercise_analysis',
            moderation: {
              shouldRespond: true,
              response: analysisResult.response,
              responseType: 'biomechanics_analysis',
              action: 'exercise_analyzed',
            },
            fp: {
              awarded: analysisResult.fpAwarded,
              action: 'exercise_shared',
            },
            exercise: {
              name: parsedExercise.name,
              targetMuscles: parsedExercise.targetMuscles,
              feel: parsedExercise.feel,
              reason: parsedExercise.reason,
              load: parsedExercise.load,
              tags: parsedExercise.tags,
              equipment: parsedExercise.equipment,
              found: analysisResult.exerciseFound,
            },
            biomechanics: analysisResult.exerciseData ? {
              primaryMuscles: analysisResult.exerciseData.primaryMuscles,
              secondaryMuscles: analysisResult.exerciseData.secondaryMuscles,
              movementPattern: analysisResult.exerciseData.movementPattern,
              activation: analysisResult.exerciseData.biomechanics.activation,
            } : null,
            siblings: analysisResult.siblings,
            analysis: null,
            celebrations: {
              streak: null,
              fpMilestone: null,
            },
            badges: null,
          });
        }
      } catch (exerciseError: any) {
        console.error('[AI Moderate] Erro ao analisar exercício:', exerciseError.message);
        // Fallback para moderação normal em caso de erro
      }
    }

    // ========================================
    // DETECTAR E INVESTIGAR SINTOMAS/DOR (SINAL VERMELHO)
    // ========================================
    const isPainInvestigationCommunity = PAIN_INVESTIGATION_SLUGS.includes(body.communitySlug.toLowerCase());
    const contentLooksLikePain = looksLikePainPost(body.content);

    // Se for comunidade de investigação E parecer post de dor → iniciar investigação
    if (isPainInvestigationCommunity && contentLooksLikePain) {
      console.log(`[AI Moderate] Detectado post de dor em ${body.communitySlug} por ${body.userName}`);

      try {
        // 1. Iniciar investigação
        const investigation = startInvestigation(
          body.communitySlug,
          body.userId,
          body.messageId || crypto.randomUUID(),
          body.content
        );

        if (!investigation) {
          console.log('[AI Moderate] Não foi possível iniciar investigação, fallback para moderação normal');
        } else {
          // 2. Obter primeira pergunta
          const firstQuestion = getNextQuestion(investigation);

          if (!firstQuestion) {
            console.log('[AI Moderate] Nenhuma pergunta disponível, fallback para moderação normal');
          } else {
            // 3. Gerar resposta inicial com primeira pergunta
            const response = generateInitialResponse(
              investigation.parsedSymptom,
              firstQuestion
            );

            // Marcar pergunta como feita
            investigation.questionsAsked.push(firstQuestion);

            console.log(`[AI Moderate] Investigação iniciada: região ${investigation.region}, primeira pergunta feita`);

            // 4. Salvar investigação no banco (FUTURO: persistir no Prisma)
            // TODO: await prisma.biomechanicalInvestigation.create({ data: investigation })

            // 5. Retornar resposta de investigação
            return NextResponse.json({
              success: true,
              type: 'pain_investigation_started',
              moderation: {
                shouldRespond: true,
                response: response,
                responseType: 'investigation_question',
                action: 'investigation_started',
              },
              fp: {
                awarded: 5, // FP por compartilhar sintoma
                action: 'symptom_shared',
              },
              investigation: {
                id: investigation.id,
                region: investigation.region,
                status: investigation.status,
                questionsAsked: investigation.questionsAsked.length,
                questionsRemaining: 6 - investigation.questionsAsked.length,
              },
              symptom: {
                exercise: investigation.parsedSymptom.exercise,
                region: investigation.parsedSymptom.region,
                location: investigation.parsedSymptom.location,
                intensity: investigation.parsedSymptom.intensity,
                duration: investigation.parsedSymptom.duration,
              },
              analysis: null,
              celebrations: {
                streak: null,
                fpMilestone: null,
              },
              badges: null,
            });
          }
        }
      } catch (painError: any) {
        console.error('[AI Moderate] Erro ao iniciar investigação:', painError.message);
        // Fallback para moderação normal em caso de erro
      }
    }

    // ========================================
    // DETECTAR E EDUCAR SOBRE ASPIRAÇÕES ESTÉTICAS
    // ========================================
    const isAestheticCommunity = AESTHETIC_ASPIRATION_SLUGS.includes(body.communitySlug.toLowerCase());

    if (isAestheticCommunity) {
      console.log(`[AI Moderate] Detectado post em arena estética ${body.communitySlug} por ${body.userName}`);

      try {
        const aspiration = parseAspirationFromPost(body.content);

        if (aspiration) {
          const response = generateAestheticEducationResponse(body.userName, aspiration);

          console.log(`[AI Moderate] Aspiração estética parseada: ${aspiration.procedure}, estado: ${aspiration.emotionalState}`);

          // FP reduzido se for impulsivo (5 FP), normal se for maduro (10 FP)
          const fpAwarded = aspiration.emotionalState === 'impulsive' ? 5 : 10;

          return NextResponse.json({
            success: true,
            type: 'aesthetic_education',
            moderation: {
              shouldRespond: true,
              response: response,
              responseType: 'aesthetic_education',
              action: 'aspiration_shared',
            },
            fp: {
              awarded: fpAwarded,
              action: 'aspiration_shared',
            },
            aspiration: {
              procedure: aspiration.procedure,
              emotionalState: aspiration.emotionalState,
              hasTraining: aspiration.currentPrep.training,
              hasDiet: aspiration.currentPrep.diet,
              hasMedical: aspiration.currentPrep.medicalFollowup,
            },
            analysis: null,
            celebrations: {
              streak: null,
              fpMilestone: null,
            },
            badges: null,
          });
        }
      } catch (aestheticError: any) {
        console.error('[AI Moderate] Erro ao processar aspiração estética:', aestheticError.message);
        // Fallback para moderação normal em caso de erro
      }
    }

    // ========================================
    // MODERAÇÃO NORMAL (não é receita, exercício, investigação de dor ou estética)
    // ========================================

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
        investigationId: result.investigationId,
        questionsRemaining: result.questionsRemaining,
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
      badges: result.newBadges ? {
        newBadges: result.newBadges.newBadges.map(b => ({
          id: b.id,
          name: b.name,
          description: b.description,
          icon: b.icon,
          rarity: b.rarity,
          fpReward: b.fpReward,
        })),
        totalFPRewarded: result.newBadges.totalFPRewarded,
      } : null,
    });

  } catch (error: any) {
    console.error('[AI Moderate POST Error]', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao moderar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

