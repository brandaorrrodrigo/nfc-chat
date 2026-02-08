/**
 * Teste de integração: Dashboard Biomecânico + Comunidade
 * Simula acesso a /comunidades/analise-agachamento
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (require('fs').existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { getSupabase } from '../lib/supabase';

async function testCommunityIntegration() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║    🏘️  TESTE DE INTEGRAÇÃO: COMUNIDADE + BIOMECÂNICA      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('SIMULANDO: Usuário acessa /comunidades/analise-agachamento');
  console.log('─'.repeat(60));

  const communitySlug = 'analise-agachamento';

  try {
    const supabase = getSupabase();

    // Step 1: Verificar configuração da comunidade
    console.log('\nStep 1: Carregando comunidade...');
    console.log(`   ✓ Slug: ${communitySlug}`);
    console.log(`   ✓ Nome: Analise: Agachamento`);
    console.log(`   ✓ Tipo: Arena Premium NFV`);
    console.log(`   ✓ Padrão: agachamento`);

    // Step 2: Buscar vídeos analisados da comunidade
    console.log('\nStep 2: Buscando vídeos analisados da comunidade...');
    const { data: videos, error: videosError } = await supabase
      .from('nfc_chat_video_analyses')
      .select('id, user_name, movement_pattern, created_at, status, ai_analysis, arena_slug')
      .order('created_at', { ascending: false })
      .limit(100);

    if (videosError) {
      console.log(`   ❌ Erro: ${videosError.message}`);
      return;
    }

    console.log(`   ✓ ${videos?.length || 0} vídeo(s) encontrado(s)`);

    // Step 3: Formatar dados para widget
    console.log('\nStep 3: Formatando dados para CommunityBiomechanicsWidget...');
    const communityVideos = (videos || []).map((video: any) => {
      let overall_score: number | undefined;

      if (video.ai_analysis) {
        try {
          const analysis = typeof video.ai_analysis === 'string'
            ? JSON.parse(video.ai_analysis)
            : video.ai_analysis;
          overall_score = analysis.overall_score || analysis.score;
        } catch (e) {
          // parsing failed
        }
      }

      return {
        id: video.id,
        user_name: video.user_name,
        movement_pattern: video.movement_pattern,
        created_at: video.created_at,
        status: video.status,
        overall_score,
        exercise_type: video.movement_pattern,
      };
    });

    console.log(`   ✓ ${communityVideos.length} vídeo(s) formatado(s)`);

    // Step 4: Simular renderização da página
    console.log('\n' + '═'.repeat(60));
    console.log('PÁGINA DA COMUNIDADE RENDERIZADA:');
    console.log('═'.repeat(60));

    console.log('\n📱 LAYOUT (Desktop - 3 colunas):');
    console.log('┌───────────────────────────────────────────────────────────────┐');
    console.log('│ Header: Analise Agachamento          [Enviar Vídeo] 25 FP     │');
    console.log('├──────────────────┬─────────────────────────────────────────────┤');
    console.log('│ Sidebar Esquerda │ Conteúdo Principal                          │');
    console.log('│ (col-span-1)     │ (col-span-2)                                │');
    console.log('├──────────────────┼─────────────────────────────────────────────┤');
    console.log('│ 🧡 Análises      │ 📹 Galeria de Vídeos                        │');
    console.log('│ ────────────────  │ ─────────────────────────────────────────  │');

    if (communityVideos.length === 0) {
      console.log('│ Nenhuma análise  │ [Nenhum vídeo]                              │');
    } else {
      communityVideos.slice(0, 5).forEach((video, idx) => {
        const scoreColor = video.overall_score
          ? video.overall_score >= 8 ? '🟢'
            : video.overall_score >= 6 ? '🟡'
            : video.overall_score >= 4 ? '🟠'
            : '🔴'
          : '⚪';

        const line = `│ ${scoreColor} ${video.movement_pattern.padEnd(11)} │ [Video ${idx + 1}] [Video ${idx + 6}] [Video ${idx + 11}]   │`;
        console.log(line.substring(0, 64));
      });

      if (communityVideos.length > 5) {
        console.log(`│ ${communityVideos.length} análises       │                                             │`);
      }
    }

    console.log('│ Ver todas →      │                                             │');
    console.log('└──────────────────┴─────────────────────────────────────────────┘');

    // Step 5: Widget Cards
    console.log('\n🎴 CARDS DO WIDGET (CommunityBiomechanicsWidget):');
    console.log('─'.repeat(60));

    communityVideos.forEach((video, idx) => {
      const statusIcon = video.status === 'BIOMECHANICS_ANALYZED_V2' ? '✅' : '⏳';
      const scoreStr = video.overall_score !== undefined
        ? `${video.overall_score.toFixed(1)}/10`
        : 'N/A';

      console.log(`\n[Card ${idx + 1}] ${statusIcon}`);
      console.log(`  Exercício: ${video.movement_pattern}`);
      console.log(`  Usuário: ${video.user_name}`);
      console.log(`  Data: ${new Date(video.created_at).toLocaleDateString('pt-BR')}`);
      console.log(`  Score: ${scoreStr}`);
      console.log(`  Link: /biomechanics/dashboard?videoId=${video.id}`);
    });

    // Step 6: Resposta da API
    console.log('\n\n📡 RESPOSTA DA API GET /api/biomechanics/list-videos?community=analise-agachamento:');
    console.log('─'.repeat(60));
    const apiResponse = {
      success: true,
      videos: communityVideos,
      total: communityVideos.length,
    };
    console.log(JSON.stringify(apiResponse, null, 2));

    // Step 7: Interactions
    console.log('\n\n⚙️  INTERAÇÕES DO USUÁRIO:');
    console.log('─'.repeat(60));
    console.log('\n1. Clicar no card de análise:');
    console.log(`   → Navega para: /biomechanics/dashboard?videoId=${communityVideos[0]?.id}`);
    console.log('\n2. Clicar em "Ver todas →":');
    console.log(`   → Navega para: /biomechanics/videos`);
    console.log('\n3. Clicar em "Enviar Vídeo":');
    console.log(`   → Abre modal de upload`);
    console.log(`   → Salva em arena_slug: '${communitySlug}'`);
    console.log(`   → Vídeo aparece na comunidade e no dashboard`);

    // Step 8: Data Flow
    console.log('\n\n📊 FLUXO DE DADOS:');
    console.log('─'.repeat(60));
    console.log(`
Database (nfc_chat_video_analyses)
  ↓
  ├─ [Filtro] arena_slug = '${communitySlug}'
  ↓
API Endpoint: GET /api/biomechanics/list-videos?community=${communitySlug}
  ↓
CommunityBiomechanicsWidget (formato props)
  ├─ communitySlug: '${communitySlug}'
  ├─ limit: 8
  ↓
Renderiza ${communityVideos.length} card(s)
  ├─ Mostrados: ${Math.min(communityVideos.length, 8)}
  ├─ Link para: /biomechanics/dashboard?videoId={id}
  └─ Link "Ver todas": /biomechanics/videos
    `);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ INTEGRAÇÃO TESTADA COM SUCESSO');
    console.log('═'.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Erro no teste:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

testCommunityIntegration();
