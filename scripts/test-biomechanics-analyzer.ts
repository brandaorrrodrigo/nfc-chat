/**
 * Script de teste para o novo sistema de análise biomecânica
 * Demonstra o pipeline completo: MediaPipe → Classificação → RAG → Prompt
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import {
  analyzeBiomechanics,
  generateMockFrames,
  queryRAG,
  getTopicsByCategory,
  debugPrompt,
} from '../lib/biomechanics';

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🧬 TESTE DO SISTEMA DE ANÁLISE BIOMECÂNICA               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Gerar dados fictícios (simulando extração do MediaPipe de um vídeo)
    console.log('═'.repeat(60));
    console.log('1️⃣  GERANDO DADOS FICTÍCIOS DE MEDIAPIPE');
    console.log('═'.repeat(60) + '\n');

    const mockFrames = generateMockFrames(15, 'squat');
    console.log(`✓ ${mockFrames.length} frames gerados (15fps)`);
    console.log(`  Exercício: Back Squat`);
    console.log(`  Duração: ${(mockFrames.length / 30).toFixed(1)}s\n`);

    // 2. Executar análise biomecânica
    console.log('═'.repeat(60));
    console.log('2️⃣  ANALISANDO COM SISTEMA BIOMECÂNICO');
    console.log('═'.repeat(60) + '\n');

    console.log('🔄 Processando frames...');
    const analysis = await analyzeBiomechanics(
      {
        exerciseName: 'back_squat',
        frames: mockFrames,
        fps: 30,
      },
      {
        includeRAG: true,
        useMinimalPrompt: false,
        debugMode: true,
      }
    );

    console.log('\n✓ Análise concluída!\n');

    // 3. Exibir resultado da classificação
    console.log('═'.repeat(60));
    console.log('3️⃣  RESULTADO DA CLASSIFICAÇÃO');
    console.log('═'.repeat(60) + '\n');

    console.log(`📊 Score Geral: ${analysis.classification.overallScore}/10`);
    console.log(`📈 Resumo:`);
    console.log(`   Excelente: ${analysis.classification.summary.excellent}`);
    console.log(`   Bom:       ${analysis.classification.summary.good}`);
    console.log(`   Aceitável: ${analysis.classification.summary.acceptable}`);
    console.log(`   Alerta:    ${analysis.classification.summary.warning}`);
    console.log(`   Crítico:   ${analysis.classification.summary.danger}`);
    console.log('');

    // Listar classificações
    if (analysis.classification.classifications.length > 0) {
      console.log('📋 Classificações Detalhadas:\n');
      analysis.classification.classifications.forEach((c) => {
        const icon =
          c.classification === 'danger'
            ? '🔴'
            : c.classification === 'warning'
              ? '🟡'
              : '🟢';
        console.log(`${icon} ${c.criterion}: ${c.value}${c.unit || ''}`);
        console.log(`   Nível: ${c.classification} | Range: ${c.range.acceptable}`);
        if (c.isSafetyCritical) {
          console.log(`   ⚠️ CRITÉRIO DE SEGURANÇA`);
        }
      });
    }
    console.log('');

    // 4. Exibir tópicos RAG
    console.log('═'.repeat(60));
    console.log('4️⃣  TÓPICOS RAG IDENTIFICADOS');
    console.log('═'.repeat(60) + '\n');

    if (analysis.ragTopicsUsed.length > 0) {
      console.log(`📚 ${analysis.ragTopicsUsed.length} tópicos de conhecimento:\n`);
      analysis.ragTopicsUsed.forEach((topic) => {
        console.log(`   • ${topic}`);
      });
    } else {
      console.log('ℹ️  Nenhum tópico crítico identificado (movimento excelente!)');
    }
    console.log('');

    // 5. Exibir prompt construído
    console.log('═'.repeat(60));
    console.log('5️⃣  PROMPT PARA OLLAMA (préview)');
    console.log('═'.repeat(60) + '\n');

    console.log(debugPrompt(analysis.prompt));
    console.log('');

    // 6. Resumo diagnóstico
    console.log('═'.repeat(60));
    console.log('6️⃣  RESUMO DIAGNÓSTICO');
    console.log('═'.repeat(60) + '\n');

    console.log(analysis.diagnosticSummary);
    console.log('');

    // 7. Próximos passos
    console.log('═'.repeat(60));
    console.log('7️⃣  PRÓXIMOS PASSOS');
    console.log('═'.repeat(60) + '\n');

    console.log('Agora você pode:');
    console.log('');
    console.log('1. 📤 Enviar o prompt para Ollama (llama3.1 ou superior)');
    console.log('');
    console.log('   Exemplo com curl:');
    console.log('   ```');
    console.log('   curl -X POST http://localhost:11434/api/generate \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"model": "llama3.1", "prompt": "' + analysis.prompt.userPrompt.substring(0, 50) + '...", "system": "' + analysis.prompt.systemPrompt.substring(0, 50) + '...", "stream": false}\'');
    console.log('   ```');
    console.log('');
    console.log('2. 💾 Salvar resultado no banco de dados');
    console.log('');
    console.log('3. 📊 Integrar em análise de vídeo real (com frames do MediaPipe)');
    console.log('');
    console.log('═'.repeat(60));
    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('═'.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (error.stack) {
      console.error('\nDetalhes:');
      console.error(error.stack);
    }
  }
}

main();
