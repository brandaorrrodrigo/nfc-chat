/**
 * Script de teste para análise COMPARATIVA com vídeos de referência
 *
 * Uso: npx tsx scripts/test-comparative-analysis.ts <analysisId>
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as fsPromises from 'fs/promises'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { runComparativeAnalysis } from '../lib/biomechanics/comparative-analyzer'

const execAsync = promisify(exec)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase não configurado. Verifique .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const analysisId = process.argv[2]
if (!analysisId) {
  console.error('❌ Uso: npx tsx scripts/test-comparative-analysis.ts <analysisId>')
  process.exit(1)
}

async function main() {
  console.log('🎥 TESTE: Análise Biomecânica COMPARATIVA com Referências')
  console.log('='.repeat(60))
  const startTime = Date.now()

  // 1. Buscar análise no banco
  console.log(`\n📋 Buscando: ${analysisId}`)
  const { data: analysis, error } = await supabase
    .from('nfc_chat_video_analyses')
    .select('*')
    .eq('id', analysisId)
    .single()

  if (error || !analysis) {
    console.error('❌ Análise não encontrada:', error?.message)
    process.exit(1)
  }

  console.log('   Arena:', analysis.arena_slug)
  console.log('   Padrão:', analysis.movement_pattern)
  console.log('   URL:', analysis.video_url)

  // 2. Verificar referências disponíveis
  console.log('\n📁 Verificando frames de referência...')
  const refDir = path.join(process.cwd(), 'public', 'references')
  const patterns = ['ouro', 'valgo-severo', 'anterorizacao-tronco', 'lordose-lombar']

  for (const pattern of patterns) {
    const dir = path.join(refDir, pattern)
    const frames = fs.existsSync(dir)
      ? (await fsPromises.readdir(dir)).filter(f => f.endsWith('.jpg'))
      : []
    const status = frames.length >= 4 ? '✅' : '⚠️'
    console.log(`   ${status} ${pattern}: ${frames.length} frames`)
  }

  // 3. Verificar Ollama
  console.log('\n🤖 Verificando Ollama...')
  try {
    const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(5000) })
    const data = await res.json()
    const models = data.models?.map((m: { name: string }) => m.name) || []
    const visionModel = models.find((m: string) => m.includes('vision'))
    if (!visionModel) {
      console.error('❌ Nenhum modelo de visão encontrado. Execute: ollama pull llama3.2-vision')
      process.exit(1)
    }
    console.log(`   ✅ Modelos: ${models.join(', ')}`)
    console.log(`   ✅ Vision: ${visionModel}`)
  } catch {
    console.error('❌ Ollama não está rodando. Execute: ollama serve')
    process.exit(1)
  }

  // 4. Criar temp dir e baixar vídeo
  const tempDir = path.join(process.cwd(), 'temp', `comp_test_${Date.now()}`)
  await fsPromises.mkdir(tempDir, { recursive: true })

  try {
    console.log('\n⬇️  Baixando vídeo...')
    const videoPath = path.join(tempDir, 'video.mp4')
    const videoRes = await fetch(analysis.video_url)
    if (!videoRes.ok) throw new Error(`Download falhou: ${videoRes.status}`)
    const videoBuffer = await videoRes.arrayBuffer()
    await fsPromises.writeFile(videoPath, Buffer.from(videoBuffer))
    console.log('   ✅ Download completo')

    // 5. Obter duração
    let duration = 3
    try {
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
      )
      duration = parseFloat(stdout.trim()) || 3
    } catch {
      console.warn('   ⚠️ Duração não detectada, usando 3s')
    }
    console.log(`   Duração: ${duration.toFixed(1)}s`)

    // 6. Extrair frames
    const framesCount = 6
    console.log(`\n🖼️  Extraindo ${framesCount} frames...`)
    const interval = duration / (framesCount + 1)
    const framesBase64: string[] = []

    for (let i = 1; i <= framesCount; i++) {
      const timestamp = interval * i
      const framePath = path.join(tempDir, `frame_${i}.jpg`)

      await execAsync(
        `ffmpeg -y -ss ${timestamp} -i "${videoPath}" -frames:v 1 -q:v 2 "${framePath}"`
      )

      const imageBuffer = await fsPromises.readFile(framePath)
      framesBase64.push(imageBuffer.toString('base64'))
      process.stdout.write(`\r   Frame ${i}/${framesCount}`)
    }
    console.log('\n   ✅ Frames extraídos')

    // 7. RODAR ANÁLISE COMPARATIVA
    console.log('\n🚀 Iniciando análise comparativa...')
    const result = await runComparativeAnalysis(framesBase64, duration)

    // 8. Preparar resultado final
    const finalResult = {
      analysis_type: 'biomechanics_comparative',
      ...result,
      video_id: analysisId,
      exercise_type: analysis.movement_pattern || 'agachamento',
      processing_time_ms: Date.now() - startTime
    }

    // 9. Salvar no banco
    console.log('\n💾 Salvando resultado...')
    const { error: updateError } = await supabase
      .from('nfc_chat_video_analyses')
      .update({
        ai_analysis: finalResult,
        ai_analyzed_at: new Date().toISOString(),
        ai_confidence: result.score / 10,
        status: 'AI_ANALYZED',
      })
      .eq('id', analysisId)

    if (updateError) {
      console.error('❌ Erro ao salvar:', updateError.message)
    } else {
      console.log('   ✅ Salvo no banco!')
    }

    // 10. Resultado
    console.log('\n' + '='.repeat(60))
    console.log('📊 RESULTADO DA ANÁLISE COMPARATIVA')
    console.log('='.repeat(60))
    console.log(`   Score: ${result.score}/10`)
    console.log(`   Classificação: ${result.classification}`)
    console.log(`   Similaridade Padrão Ouro: ${result.similaridade_padrao_ouro}%`)
    console.log(`   Frames Analisados: ${result.frames_analyzed}`)
    console.log(`   Método: ${result.metodo}`)
    console.log(`   Referências Usadas:`)
    console.log(`      Padrão Ouro: ${result.references_used.gold_standard ? '✅' : '❌'}`)
    console.log(`      Valgo: ${result.references_used.valgo_pattern ? '✅' : '❌'}`)
    console.log(`      Anteriorização: ${result.references_used.anterorizacao_pattern ? '✅' : '❌'}`)
    console.log(`      Lordose: ${result.references_used.lordose_pattern ? '✅' : '❌'}`)
    console.log(`   Tempo: ${((Date.now() - startTime) / 1000).toFixed(1)}s`)

    // Análise por frame
    console.log('\n📝 Análise Comparativa por Frame:')
    for (const frame of result.comparative_analysis) {
      console.log(`\n   Frame ${frame.frame_numero} (${frame.timestamp}):`)
      console.log(`      Score: ${frame.score}/10 (Ajustado: ${frame.score_ajustado}/10)`)
      console.log(`      Sim. Ouro: ${frame.similaridade_com_padrao_ouro}%`)
      console.log(`      Sim. Valgo: ${frame.similaridade_com_valgo}%`)
      console.log(`      Sim. Anteriorização: ${frame.similaridade_com_anterorizacao}%`)
      console.log(`      Ângulos Estimados: Joelho E=${frame.angulos_estimados.joelho_esquerdo}° D=${frame.angulos_estimados.joelho_direito}° | Quadril=${frame.angulos_estimados.flexao_quadril}° | Tronco=${frame.angulos_estimados.inclinacao_tronco}°`)
      console.log(`      Ângulos Referência: Joelho E=${frame.angulos_referencia.joelho_esquerdo}° D=${frame.angulos_referencia.joelho_direito}° | Quadril=${frame.angulos_referencia.flexao_quadril}° | Tronco=${frame.angulos_referencia.inclinacao_tronco}°`)
      console.log(`      Método: ${frame.metodo}`)
      if (frame.desvios_observados.length > 0) {
        console.log(`      Desvios: ${frame.desvios_observados.join('; ')}`)
      }
      if (frame.aspectos_positivos.length > 0) {
        console.log(`      Positivos: ${frame.aspectos_positivos.join('; ')}`)
      }
      console.log(`      Justificativa: ${frame.justificativa}`)
    }

    // Pontos críticos
    if (result.pontos_criticos.length > 0) {
      console.log('\n⚠️  PONTOS CRÍTICOS:')
      for (const ponto of result.pontos_criticos) {
        const icon = ponto.severidade === 'CRITICA' ? '🔴' : ponto.severidade === 'MODERADA' ? '🟡' : '🟢'
        console.log(`   ${icon} [${ponto.severidade}] ${ponto.nome}`)
        console.log(`      Frames afetados: ${ponto.frames_afetados} | Frequência: ${ponto.frequencia}`)
      }
    } else {
      console.log('\n✅ Nenhum ponto crítico identificado!')
    }

    console.log('\n' + '='.repeat(60))

  } finally {
    try {
      await fsPromises.rm(tempDir, { recursive: true })
      console.log('🧹 Arquivos temporários removidos')
    } catch { }
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
