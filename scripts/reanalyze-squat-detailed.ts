/**
 * Script para análise biomecânica DETALHADA do agachamento
 * Usa prompt específico com análise de excêntrica/concêntrica
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');

if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { downloadVideoFromUrl, downloadVideoFromSupabase, checkVisionModelAvailable, extractFrames } from '../lib/vision/video-analysis';
import { analyzeFrame } from '../lib/vision/video-analysis';
import * as fs from 'fs';
import * as os from 'os';
import axios from 'axios';

const TABLE = 'nfc_chat_video_analyses';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const VISION_MODEL = 'llama3.2-vision:latest';

// Prompt detalhado para análise de agachamento
const SQUAT_ANALYSIS_PROMPT = `Você é um especialista em biomecânica do movimento humano analisando um AGACHAMENTO.

ANALISE ESTE FRAME DE FORMA DETALHADA:

**FASES DO MOVIMENTO:**
- Este é o início, meio ou fim do movimento? (excêntrica/concêntrica)
- Se excêntrica (descida): profundidade parcial? profundidade total?
- Se concêntrica (subida): há estagnação? velocidade constante?

**ALINHAMENTO E POSIÇÃO:**
1. **Joelhos:**
   - Alinhamento de varo (joelhos virados para dentro)? ou valgo (virados para fora)?
   - Joelhos ultrapassam os dedos dos pés?
   - Ambos os joelhos estão alinhados com os pés?
   - Diferença de profundidade entre os dois lados?

2. **Coluna/Tórax:**
   - Coluna em posição neutra ou hiperextendida?
   - Há arredondamento das costas (cifose)?
   - Inclinação do tórax para frente é excessiva?
   - Qual é o ângulo aproximado da coluna?

3. **Barra/Carga:**
   - Barra está centrada nas costas?
   - Está desalinhada (um lado mais baixo que outro)?
   - Posição alta (trap bar) ou baixa (powerlifting)?

4. **Pés:**
   - Largura de pés apropriada?
   - Pés apontando para frente ou em rotação externa?
   - Há elevação de calcanhares ou shift de peso?
   - Distribuição de peso entre medial/lateral do pé?

5. **Quadril:**
   - Profundidade do agachamento: acima da paralela, paralela, ou abaixo?
   - Há "butt wink" (inclinação pélvica posterior excessiva) no fundo?
   - Quadril está travado ou móvel?

**PROBLEMAS TÉCNICOS IDENTIFICADOS:**
- Varo de joelho? (sim/não) - Qual grau?
- Valgo de joelho? (sim/não) - Qual grau?
- Cifose excessiva? (sim/não)
- Lordose excessiva? (sim/não)
- Colapso medial de joelho? (sim/não)
- Assimetria entre lados? (sim/não)
- Elevação de calcanhar? (sim/não)
- Inclinação excessiva do tórax? (sim/não)

**COMPENSAÇÕES OBSERVADAS:**
- Qual é a compensação principal, se houver?
- Por que o atleta está compensando? (falta de mobilidade? fraqueza?)
- Qual área deveria ser focada para correção?

**PONTUAÇÃO (0-10):**
- Técnica geral
- Segurança biomecânica
- Eficiência do movimento

Seja ESPECÍFICO e TÉCNICO. Use termos biomecânicos precisos. Indique medidas aproximadas quando relevante.`;

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🎥 ANÁLISE BIOMECÂNICA DETALHADA DO AGACHAMENTO    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let tempDir: string | null = null;

  try {
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase não configurado');
      return;
    }

    const supabase = getSupabase();

    // 1. Buscar vídeo
    console.log('🔍 Buscando vídeo de agachamento mais recente...\n');

    const { data: allVideos, error: fetchError } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (fetchError || !allVideos) {
      console.error('❌ Erro ao buscar vídeos:', fetchError?.message);
      return;
    }

    const videos = allVideos.filter(v =>
      v.movement_pattern?.toLowerCase() === 'squat' ||
      v.movement_pattern?.toLowerCase() === 'agachamento'
    );

    if (videos.length === 0) {
      console.error('❌ Nenhum vídeo encontrado');
      return;
    }

    const video = videos[0];
    console.log(`📹 Vídeo: ${video.id}`);
    console.log(`   Usuário: ${video.user_name}`);
    console.log(`   Data: ${new Date(video.created_at).toLocaleString('pt-BR')}\n`);

    // 2. Verificar Ollama
    const visionAvailable = await checkVisionModelAvailable();
    if (!visionAvailable) {
      console.error('❌ Ollama não disponível');
      return;
    }

    // 3. Baixar vídeo
    console.log('═'.repeat(60));
    console.log('📥 PREPARANDO VÍDEO');
    console.log('═'.repeat(60) + '\n');

    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-squat-'));
    let localVideoPath: string;

    if (video.video_path) {
      console.log('Baixando do Supabase...\n');
      localVideoPath = await downloadVideoFromSupabase(video.video_path, tempDir);
    } else if (video.video_url) {
      console.log('Baixando da URL...\n');
      localVideoPath = await downloadVideoFromUrl(video.video_url, tempDir);
    } else {
      throw new Error('Sem URL ou path');
    }

    // 4. Extrair frames (estratégia: capturar diferentes fases)
    console.log('═'.repeat(60));
    console.log('🎬 EXTRAINDO FRAMES (TODAS AS FASES)');
    console.log('═'.repeat(60) + '\n');

    const framesDir = path.join(tempDir, 'frames');
    fs.mkdirSync(framesDir, { recursive: true });

    const framePaths = await extractFrames(localVideoPath, framesDir, 12);
    console.log(`✅ ${framePaths.length} frames extraídos\n`);

    // 5. Analisar frames com prompt detalhado
    console.log('═'.repeat(60));
    console.log('🔬 ANÁLISE BIOMECÂNICA DETALHADA');
    console.log('═'.repeat(60) + '\n');

    const analysisResults: any[] = [];

    for (let i = 0; i < framePaths.length; i++) {
      const framePath = framePaths[i];
      const frameNum = i + 1;
      const progress = ((frameNum / framePaths.length) * 100).toFixed(0);

      console.log(`[${progress}%] Frame ${frameNum}/${framePaths.length} - Analisando...`);

      try {
        const imageBase64 = fs.readFileSync(framePath).toString('base64');

        const response = await axios.post(
          `${OLLAMA_URL}/api/generate`,
          {
            model: VISION_MODEL,
            prompt: SQUAT_ANALYSIS_PROMPT,
            images: [imageBase64],
            stream: false,
            options: {
              temperature: 0.2,
              num_predict: 800,
            },
          },
          { timeout: 180000 }
        );

        const analysis = response.data.response || '';
        analysisResults.push({
          frameNumber: frameNum,
          analysis,
        });

        console.log(`      ✅ Análise completa\n`);
      } catch (error: any) {
        console.error(`      ❌ Erro: ${error.message}\n`);
      }
    }

    // 6. Exibir resultados
    console.log('═'.repeat(60));
    console.log('📊 RESULTADO FINAL DA ANÁLISE DETALHADA');
    console.log('═'.repeat(60) + '\n');

    analysisResults.forEach((result) => {
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`📸 FRAME ${result.frameNumber}`);
      console.log('═'.repeat(60) + '\n');
      console.log(result.analysis);
      console.log('');
    });

    // 7. Salvar análise detalhada
    console.log('\n' + '═'.repeat(60));
    console.log('💾 SALVANDO ANÁLISE DETALHADA');
    console.log('═'.repeat(60) + '\n');

    const detailedAnalysis = {
      timestamp: new Date().toISOString(),
      model: VISION_MODEL,
      exercise: 'agachamento',
      frames_analyzed: analysisResults.length,
      analysis_type: 'detailed_biomechanics',
      frame_analyses: analysisResults,
    };

    const { error: updateError } = await supabase
      .from(TABLE)
      .update({
        status: 'DETAILED_ANALYZED',
        detailed_analysis: detailedAnalysis,
        updated_at: new Date().toISOString(),
      })
      .eq('id', video.id);

    if (updateError) {
      console.error('⚠️  Erro ao salvar:', updateError.message);
    } else {
      console.log('✅ Análise detalhada salva com sucesso!\n');
    }

    console.log('═'.repeat(60));
    console.log('🎉 ANÁLISE DETALHADA CONCLUÍDA!');
    console.log('═'.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Erro:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        console.warn(`⚠️  Falha ao limpar: ${tempDir}`);
      }
    }
  }
}

main();
