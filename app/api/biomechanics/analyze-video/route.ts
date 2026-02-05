/**
 * API Route: Análise Biomecânica Completa de Vídeo
 * POST /api/biomechanics/analyze-video
 *
 * Fluxo:
 * 1. Recebe analysisId
 * 2. Baixa vídeo do Supabase
 * 3. Extrai frames com ffmpeg
 * 4. Analisa cada frame com Llama 3.2-Vision (JSON estruturado)
 * 5. Gera relatório técnico com Llama 3.1
 * 6. Salva resultado no banco
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

import { analyzeAllFrames, FrameAnalysis } from '@/lib/biomechanics/vision-analyzer';
import { generateBiomechanicsReport, generateBiomechanicsReportWithRAG, BiomechanicsReport, EnhancedBiomechanicsReport } from '@/lib/biomechanics/report-generator';
import { checkRAGAvailability } from '@/lib/biomechanics/rag-service';

const execAsync = promisify(exec);

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface AnalyzeRequest {
  analysisId: string;
  framesCount?: number;
  useRAG?: boolean; // Usar RAG para citações científicas
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: AnalyzeRequest = await request.json();
    const { analysisId, framesCount = 6, useRAG = true } = body;

    if (!analysisId) {
      return NextResponse.json({ error: 'analysisId é obrigatório' }, { status: 400 });
    }

    console.log(`🎥 Iniciando análise biomecânica: ${analysisId}`);

    // 1. Buscar análise no banco
    const { data: analysis, error: fetchError } = await supabase
      .from('nfc_chat_video_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (fetchError || !analysis) {
      return NextResponse.json(
        { error: 'Análise não encontrada', details: fetchError?.message },
        { status: 404 }
      );
    }

    // Atualizar status para processando
    await supabase
      .from('nfc_chat_video_analyses')
      .update({ status: 'PROCESSING' })
      .eq('id', analysisId);

    // 2. Verificar Ollama
    let visionModel = '';
    try {
      const { data } = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
      const models = data.models?.map((m: any) => m.name) || [];

      visionModel = models.find((m: string) => m.includes('llama3.2-vision')) ||
                    models.find((m: string) => m.includes('llava')) ||
                    models.find((m: string) => m.includes('vision'));

      if (!visionModel) {
        throw new Error('Nenhum modelo de visão disponível');
      }

      console.log(`   ✅ Modelo vision: ${visionModel}`);
    } catch (err: any) {
      await updateAnalysisError(analysisId, 'Ollama não disponível');
      return NextResponse.json(
        { error: 'Ollama não está rodando ou não tem modelo de visão', details: err.message },
        { status: 503 }
      );
    }

    // 3. Criar diretório temporário
    const tempDir = path.join(os.tmpdir(), `biomech_${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // 4. Baixar vídeo
      console.log('⬇️  Baixando vídeo...');
      const videoPath = path.join(tempDir, 'video.mp4');

      const videoResponse = await axios.get(analysis.video_url, {
        responseType: 'arraybuffer',
        timeout: 120000,
      });

      await fs.writeFile(videoPath, Buffer.from(videoResponse.data));
      console.log('   ✅ Download completo');

      // 5. Verificar ffmpeg
      try {
        await execAsync('ffmpeg -version');
      } catch {
        await updateAnalysisError(analysisId, 'ffmpeg não instalado');
        return NextResponse.json(
          { error: 'ffmpeg não está instalado no servidor' },
          { status: 500 }
        );
      }

      // 6. Obter duração do vídeo
      const { stdout: durationOut } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
      );
      const duration = parseFloat(durationOut.trim()) || 10;
      console.log(`   Duração: ${duration.toFixed(1)}s`);

      // 7. Extrair frames
      console.log('🖼️  Extraindo frames...');
      const interval = duration / (framesCount + 1);
      const framesBase64: string[] = [];

      for (let i = 1; i <= framesCount; i++) {
        const timestamp = interval * i;
        const framePath = path.join(tempDir, `frame_${i}.jpg`);

        await execAsync(
          `ffmpeg -ss ${timestamp} -i "${videoPath}" -vframes 1 -q:v 2 "${framePath}" -y`
        );

        const imageBuffer = await fs.readFile(framePath);
        framesBase64.push(imageBuffer.toString('base64'));
      }
      console.log(`   ✅ ${framesCount} frames extraídos`);

      // 8. Analisar frames com Vision
      console.log('🔍 Analisando frames com Vision...');
      const exerciseType = analysis.movement_pattern || 'agachamento';
      const frameAnalyses = await analyzeAllFrames(framesBase64, exerciseType);
      console.log('   ✅ Análise de frames completa');

      // 9. Gerar relatório técnico com Llama 3.1 (com ou sem RAG)
      let report: BiomechanicsReport | EnhancedBiomechanicsReport;
      let ragUsed = false;

      if (useRAG) {
        console.log('📝 Gerando relatório técnico com RAG...');
        const ragAvailability = await checkRAGAvailability();

        if (ragAvailability.available) {
          report = await generateBiomechanicsReportWithRAG(frameAnalyses, exerciseType);
          ragUsed = true;
          console.log(`   ✅ Relatório gerado com RAG (${(report as EnhancedBiomechanicsReport).rag_chunks_used || 0} chunks)`);
        } else {
          console.log(`   ⚠️ RAG não disponível: ${ragAvailability.error}`);
          console.log('   📝 Gerando relatório sem RAG...');
          report = await generateBiomechanicsReport(frameAnalyses, exerciseType);
          console.log('   ✅ Relatório gerado');
        }
      } else {
        console.log('📝 Gerando relatório técnico (sem RAG)...');
        report = await generateBiomechanicsReport(frameAnalyses, exerciseType);
        console.log('   ✅ Relatório gerado');
      }

      // 10. Calcular métricas finais
      const avgScore = frameAnalyses.reduce((s, f) => s + f.score, 0) / frameAnalyses.length;

      // 11. Preparar resultado final
      const enhancedReport = report as EnhancedBiomechanicsReport;

      const finalResult = {
        analysis_type: ragUsed ? 'biomechanics_complete_rag' : 'biomechanics_complete',
        model_vision: visionModel,
        model_text: 'llama3.1',
        rag_enabled: ragUsed,
        rag_chunks_used: enhancedReport.rag_chunks_used || 0,
        rag_sources: enhancedReport.rag_sources || [],
        timestamp: new Date().toISOString(),
        duration_seconds: duration,
        frames_analyzed: framesCount,
        exercise_type: exerciseType,

        // Análise frame a frame
        frame_analyses: frameAnalyses.map((f, i) => ({
          frame: i + 1,
          timestamp: `${(interval * (i + 1)).toFixed(1)}s`,
          fase: f.fase,
          angulos: f.angulos_aproximados,
          alinhamentos: f.alinhamentos,
          desvios: f.desvios_criticos,
          score: f.score,
          justificativa: f.justificativa,
        })),

        // Relatório técnico
        report: {
          resumo: report.resumo_executivo,
          analise_por_fase: report.analise_por_fase,
          pontos_criticos: report.pontos_criticos,
          recomendacoes: report.recomendacoes_corretivas,
          classificacao: report.classificacao,
          proximos_passos: report.proximos_passos,
          // Campos adicionais do RAG
          desvios_detalhados: enhancedReport.desvios_identificados,
          referencias_cientificas: enhancedReport.referencias_cientificas,
        },

        // Scores
        overall_score: report.score_geral,
        frame_scores: frameAnalyses.map(f => f.score),

        // Resumo para UI
        summary: report.resumo_executivo,
        recommendations: report.proximos_passos,

        // Tempo de processamento
        processing_time_ms: Date.now() - startTime,
      };

      // 12. Salvar no banco
      const { error: updateError } = await supabase
        .from('nfc_chat_video_analyses')
        .update({
          ai_analysis: finalResult,
          ai_analyzed_at: new Date().toISOString(),
          ai_confidence: avgScore / 10,
          status: 'AI_ANALYZED',
        })
        .eq('id', analysisId);

      if (updateError) {
        console.error('Erro ao salvar:', updateError);
        return NextResponse.json(
          { error: 'Erro ao salvar análise', details: updateError.message },
          { status: 500 }
        );
      }

      console.log('✅ Análise biomecânica completa!');
      console.log(`   Score: ${report.score_geral.toFixed(1)}/10`);
      console.log(`   Classificação: ${report.classificacao}`);
      console.log(`   Tempo: ${(Date.now() - startTime) / 1000}s`);

      return NextResponse.json({
        success: true,
        analysisId,
        score: report.score_geral,
        classificacao: report.classificacao,
        frames_analyzed: framesCount,
        processing_time_ms: Date.now() - startTime,
      });

    } finally {
      // Limpar arquivos temporários
      try {
        await fs.rm(tempDir, { recursive: true });
      } catch { }
    }

  } catch (error: any) {
    console.error('❌ Erro na análise biomecânica:', error);
    return NextResponse.json(
      { error: 'Erro interno na análise', details: error.message },
      { status: 500 }
    );
  }
}

async function updateAnalysisError(analysisId: string, errorMessage: string) {
  try {
    await supabase
      .from('nfc_chat_video_analyses')
      .update({
        status: 'ERROR',
        ai_analysis: { error: errorMessage, timestamp: new Date().toISOString() },
      })
      .eq('id', analysisId);
  } catch { }
}

// GET para verificar status do serviço
export async function GET() {
  try {
    const { data } = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    const models = data.models?.map((m: any) => m.name) || [];

    const visionModel = models.find((m: string) => m.includes('vision') || m.includes('llava'));
    const textModel = models.find((m: string) => m.includes('llama3') && !m.includes('vision'));

    // Verificar RAG
    const ragStatus = await checkRAGAvailability();

    return NextResponse.json({
      status: 'ready',
      ollama: true,
      vision_model: visionModel || null,
      text_model: textModel || null,
      models_available: models,
      rag: {
        available: ragStatus.available,
        pinecone: ragStatus.pinecone,
        openai_embeddings: ragStatus.openai,
        index: ragStatus.indexName,
        error: ragStatus.error,
      },
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'unavailable',
      ollama: false,
      error: err.message,
    }, { status: 503 });
  }
}
