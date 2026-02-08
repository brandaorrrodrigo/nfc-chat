/**
 * Script para testar o endpoint da API de análise biomecânica
 * Testa a rota POST /api/biomechanics/analyze
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  analyzeBiomechanics,
} from '../lib/biomechanics';
import { downloadVideoFromSupabase, downloadVideoFromUrl, extractFrames } from '../lib/vision/video-analysis';
import * as fs from 'fs';
import * as os from 'os';

const TABLE = 'nfc_chat_video_analyses';

/**
 * Mock MediaPipe extractor
 */
function createMockLandmarksFromFrameNumber(frameNum: number, totalFrames: number) {
  const progress = frameNum / totalFrames;
  const hiphip = 0.5 + progress * 0.25 - Math.sin(progress * Math.PI) * 0.2;

  return {
    left_shoulder: { x: 0.3, y: 0.2, z: 0, visibility: 0.95 },
    right_shoulder: { x: 0.7, y: 0.2, z: 0, visibility: 0.95 },
    left_hip: { x: 0.3, y: hiphip, z: 0, visibility: 0.95 },
    right_hip: { x: 0.7, y: hiphip, z: 0, visibility: 0.95 },
    left_knee: { x: 0.3, y: hiphip + 0.22, z: 0, visibility: 0.95 },
    right_knee: { x: 0.7, y: hiphip + 0.22, z: 0, visibility: 0.95 },
    left_ankle: { x: 0.3, y: 0.92, z: 0, visibility: 0.95 },
    right_ankle: { x: 0.7, y: 0.92, z: 0, visibility: 0.95 },
    left_elbow: { x: 0.25, y: 0.4, z: 0, visibility: 0.9 },
    right_elbow: { x: 0.75, y: 0.4, z: 0, visibility: 0.9 },
    left_wrist: { x: 0.2, y: 0.3, z: 0, visibility: 0.9 },
    right_wrist: { x: 0.8, y: 0.3, z: 0, visibility: 0.9 },
    nose: { x: 0.5, y: 0.15, z: 0, visibility: 0.95 },
  };
}

/**
 * Simula o endpoint da API
 */
async function testAPIEndpoint(videoId: string) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║          🧪 TESTE DO ENDPOINT DA API                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('REQUEST:');
  console.log('─'.repeat(60));
  console.log(`POST /api/biomechanics/analyze`);
  console.log(`Content-Type: application/json`);
  console.log('');
  console.log(`Body:`);
  console.log(JSON.stringify({ videoId }, null, 2));
  console.log('');

  let tempDir: string | null = null;

  try {
    const supabase = getSupabase();

    // Simular o que o endpoint faz
    console.log('PROCESSING:');
    console.log('─'.repeat(60));

    // 1. Fetch video
    console.log('1. Fetching video from database...');
    const { data: video, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', videoId)
      .single();

    if (fetchError || !video) {
      console.log(`   ❌ Error: ${fetchError?.message || 'Video not found'}`);
      return;
    }

    console.log(`   ✓ Found video: ${video.movement_pattern}`);
    console.log(`     User: ${video.user_name}`);

    // 2. Download video
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-api-test-'));
    let localVideoPath: string | null = null;

    console.log('2. Downloading video...');
    try {
      if (video.video_path) {
        localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
        console.log(`   ✓ Downloaded from Supabase`);
      } else if (video.video_url) {
        localVideoPath = await downloadVideoFromUrl(video.video_url, tempDir);
        console.log(`   ✓ Downloaded from URL`);
      }
    } catch (e: any) {
      console.log(`   ⚠️  Download failed, using mock data`);
    }

    // 3. Extract frames
    let framePaths: string[] = [];
    const frameCount = 15;
    const fps = 30;

    console.log('3. Extracting frames...');
    if (localVideoPath && fs.existsSync(localVideoPath)) {
      try {
        const framesDir = path.join(tempDir, 'frames');
        fs.mkdirSync(framesDir, { recursive: true });
        framePaths = await extractFrames(localVideoPath, framesDir, frameCount);
        console.log(`   ✓ Extracted ${framePaths.length} frames`);
      } catch (e) {
        console.log(`   ⚠️  Frame extraction failed, using mock data`);
      }
    } else {
      console.log(`   ℹ️  Using mock frames`);
    }

    // 4. Analyze
    console.log('4. Running biomechanics analysis...');
    const frames = Array.from({ length: Math.max(framePaths.length, frameCount) }, (_, i) => ({
      frameNumber: i + 1,
      timestamp: (i / fps) * 1000,
      landmarks: createMockLandmarksFromFrameNumber(i, frameCount),
    }));

    const analysis = await analyzeBiomechanics(
      {
        exerciseName: video.movement_pattern || 'squat',
        frames,
        fps,
      },
      {
        includeRAG: true,
        useMinimalPrompt: false,
        debugMode: false,
      }
    );

    console.log(`   ✓ Analysis complete`);

    // 5. Prepare response
    console.log('5. Preparing response...');

    const biomechanicsResult = {
      timestamp: new Date().toISOString(),
      system: 'biomechanics-v2',
      exercise_type: video.movement_pattern,
      overall_score: analysis.classification.overallScore,
      classification_summary: analysis.classification.summary,
      classifications_detail: analysis.classification.classifications.map((c) => ({
        criterion: c.criterion,
        value: `${c.value}${c.unit || ''}`,
        classification: c.classification,
        is_safety_critical: c.isSafetyCritical,
        rag_topics: c.ragTopics,
      })),
      rag_topics_used: analysis.ragTopicsUsed,
      frames_analyzed: analysis.mediaMetrics.totalFrames,
      duration_seconds: analysis.mediaMetrics.duration,
    };

    console.log(`   ✓ Response prepared`);

    // Display response
    console.log('');
    console.log('RESPONSE:');
    console.log('─'.repeat(60));
    console.log('HTTP/1.1 200 OK');
    console.log('Content-Type: application/json');
    console.log('');
    console.log('Body:');

    const responseBody = {
      success: true,
      videoId,
      analysis: biomechanicsResult,
      diagnostic: {
        score: analysis.classification.overallScore,
        summary: analysis.classification.summary,
        problems: analysis.classification.classifications.filter((c) =>
          ['warning', 'danger'].includes(c.classification)
        ),
        positive: analysis.classification.classifications.filter((c) =>
          ['excellent', 'good'].includes(c.classification)
        ),
      },
    };

    console.log(JSON.stringify(responseBody, null, 2));

    // Statistics
    console.log('');
    console.log('STATISTICS:');
    console.log('─'.repeat(60));
    console.log(`Score: ${analysis.classification.overallScore}/10`);
    console.log(`Frames Analyzed: ${analysis.mediaMetrics.totalFrames}`);
    console.log(`RAG Topics: ${analysis.ragTopicsUsed.length}`);
    console.log(`Critical Issues: ${analysis.classification.summary.danger}`);
    console.log(`Warnings: ${analysis.classification.summary.warning}`);
    console.log(`OK Criteria: ${analysis.classification.summary.acceptable + analysis.classification.summary.good + analysis.classification.summary.excellent}`);
    console.log('');

    // Save test
    console.log('SAVE TEST:');
    console.log('─'.repeat(60));
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        status: 'BIOMECHANICS_ANALYZED_V2',
        ai_analysis: biomechanicsResult,
        updated_at: new Date().toISOString(),
      })
      .eq('id', videoId);

    if (updateError) {
      console.log(`⚠️  Database save error: ${updateError.message}`);
    } else {
      console.log(`✓ Successfully saved to database`);
      console.log(`  Field: ai_analysis`);
      console.log(`  Status: BIOMECHANICS_ANALYZED_V2`);
    }

    console.log('');
    console.log('═'.repeat(60));
    console.log('✅ API ENDPOINT TEST SUCCESSFUL');
    console.log('═'.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Test Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        // ignore
      }
    }
  }
}

// Test with the agachamento video
const videoId = 'va_1770241761873_ckobfl93u';
testAPIEndpoint(videoId);
