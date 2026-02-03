/**
 * API: Vision Analysis
 * POST /api/vision/analyze
 *
 * Analisa vídeo de exercício com Vision Model
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos

import { NextRequest, NextResponse } from 'next/server';
import { analyzeExerciseVideo, checkVisionModelAvailable } from '@/lib/vision/video-analysis';
import * as path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoPath, exerciseType, focusAreas, framesCount } = body;

    if (!videoPath || typeof videoPath !== 'string') {
      return NextResponse.json(
        { error: 'videoPath is required and must be a string' },
        { status: 400 }
      );
    }

    // Verificar se modelo está disponível
    const modelAvailable = await checkVisionModelAvailable();

    if (!modelAvailable) {
      return NextResponse.json(
        {
          error: 'Vision model not available',
          details: 'llama3.2-vision or llava not found in Ollama',
        },
        { status: 503 }
      );
    }

    console.log(`📹 Vision analysis request: ${videoPath}`);

    // Executar análise
    const result = await analyzeExerciseVideo({
      videoPath,
      exerciseType: exerciseType || 'exercício',
      focusAreas: focusAreas || ['técnica', 'postura', 'amplitude'],
      framesCount: framesCount || 8,
    });

    return NextResponse.json({
      success: true,
      analysis: {
        exerciseType: result.exerciseType,
        overallScore: result.overallScore,
        summary: result.summary,
        recommendations: result.recommendations,
        technicalIssues: result.technicalIssues,
        framesAnalyzed: result.frames.length,
        frames: result.frames.map((f) => ({
          number: f.frameNumber,
          timestamp: f.timestamp,
          score: f.score,
          issues: f.issues,
          analysis: f.analysis.substring(0, 200) + '...', // Resumo
        })),
      },
    });
  } catch (error: any) {
    console.error('❌ Vision analysis error:', error);

    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
