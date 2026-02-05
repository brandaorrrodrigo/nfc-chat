/**
 * Script de teste para Deep Analysis + RAG
 *
 * Testa todo o pipeline end-to-end:
 * 1. Qdrant connection
 * 2. Ollama connection
 * 3. RAG search
 * 4. LLM generation
 * 5. Deep analysis completo
 *
 * Uso:
 *   npm run test-deep-analysis
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DeepAnalysisService } from '../src/modules/analysis/deep-analysis.service';
import { RagService } from '../src/modules/analysis/rag/rag.service';
import { OllamaService } from '../src/modules/analysis/ollama/ollama.service';
import { VectorStoreService } from '../src/modules/analysis/rag/vector-store.service';

async function testDeepAnalysis() {
  console.log('🧪 Starting Deep Analysis Integration Test\n');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    // Get services
    const deepAnalysis = app.get(DeepAnalysisService);
    const ragService = app.get(RagService);
    const ollamaService = app.get(OllamaService);
    const vectorStore = app.get(VectorStoreService);

    // Test 1: Qdrant Connection
    console.log('1️⃣  Testing Qdrant connection...');
    const qdrantHealthy = await vectorStore.healthCheck();
    if (!qdrantHealthy) {
      throw new Error('Qdrant is not healthy');
    }
    const collectionInfo = await vectorStore.getCollectionInfo('biomechanics_knowledge');
    console.log(`✅ Qdrant OK - ${collectionInfo?.points_count || 0} chunks available\n`);

    // Test 2: Ollama Connection
    console.log('2️⃣  Testing Ollama connection...');
    const ollamaHealthy = await ollamaService.healthCheck();
    if (!ollamaHealthy) {
      throw new Error('Ollama is not healthy');
    }
    const models = await ollamaService.listModels();
    console.log(`✅ Ollama OK - ${models.length} models available`);
    console.log(`   Models: ${models.join(', ')}\n`);

    // Test 3: RAG Search
    console.log('3️⃣  Testing RAG search...');
    const ragResult = await ragService.searchContext({
      deviationType: 'knee_valgus',
      exerciseId: 'back-squat',
      severity: 'moderate',
      topK: 3,
    });

    console.log(`✅ RAG Search OK`);
    console.log(`   Found: ${ragResult.chunks.length} chunks from ${ragResult.sources.length} sources`);
    if (ragResult.sources.length > 0) {
      console.log(`   Top source: "${ragResult.sources[0].title}"`);
      console.log(`   Relevance: ${ragResult.sources[0].relevance.toFixed(3)}`);
    }
    console.log('');

    // Test 4: LLM Generation
    console.log('4️⃣  Testing LLM generation...');
    const llmResult = await ollamaService.generate({
      model: 'llama3.1:8b',
      prompt: 'Say "Hello from Deep Analysis Test!" in exactly 10 words.',
      options: {
        temperature: 0.3,
        max_tokens: 50,
      },
    });

    console.log(`✅ LLM Generation OK`);
    console.log(`   Response: "${llmResult.text.substring(0, 100)}..."`);
    console.log('');

    // Test 5: Full Deep Analysis
    console.log('5️⃣  Testing full Deep Analysis pipeline...');

    const mockQuickAnalysis = {
      overall_score: 6.2,
      similarity_to_gold: 0.65,
      classification: 'REGULAR',
      deviations_detected: JSON.stringify([
        {
          type: 'knee_valgus',
          severity: 'moderate',
          percentage: 60,
          average_value: 15,
          frames_affected: [2, 3, 4, 5, 6],
        },
        {
          type: 'butt_wink',
          severity: 'severe',
          percentage: 80,
          average_value: 20,
          frames_affected: [3, 4, 5, 6],
        },
      ]),
    };

    const deepResult = await deepAnalysis.analyze({
      quickAnalysis: mockQuickAnalysis,
      exerciseId: 'back-squat',
      userId: 'test_user',
      estimatedTime: 35000,
    });

    console.log(`✅ Deep Analysis OK`);
    console.log(`   Processing time: ${deepResult.processing_time_ms}ms`);
    console.log(`   Sources used: ${deepResult.rag_sources_used.length}`);
    console.log(`   Deviations analyzed: ${deepResult.scientific_context.deviations_analyzed.join(', ')}`);
    console.log(`   Narrative length: ${deepResult.llm_narrative.length} chars`);
    console.log('');

    // Display narrative preview
    console.log('📄 Narrative Preview:');
    console.log('─'.repeat(60));
    const narrativePreview = deepResult.llm_narrative.substring(0, 500);
    console.log(narrativePreview);
    if (deepResult.llm_narrative.length > 500) {
      console.log('...(truncated)');
    }
    console.log('─'.repeat(60));
    console.log('');

    // Display sources
    if (deepResult.rag_sources_used.length > 0) {
      console.log('📚 Scientific Sources Used:');
      deepResult.rag_sources_used.forEach((source, idx) => {
        console.log(`   ${idx + 1}. ${source.title}`);
        console.log(`      Authors: ${source.authors}`);
        console.log(`      Year: ${source.year} | Evidence: ${source.evidence_level}`);
        console.log(`      Relevance: ${source.relevance.toFixed(3)}`);
        console.log('');
      });
    }

    // Summary
    console.log('✨ All tests passed!');
    console.log('\n🎉 Deep Analysis system is fully operational!');
    console.log('\nNext steps:');
    console.log('  1. Integrate with worker (Stage 5)');
    console.log('  2. Add more scientific documents');
    console.log('  3. Fine-tune prompts for better narratives');
    console.log('  4. Monitor performance in production');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
