/**
 * API Route: Análise Biomecânica COMPARATIVA
 * POST /api/biomechanics/analyze-comparative
 *
 * Compara frames do usuário com padrões de referência (ouro + ruins)
 * para detecção mais precisa de desvios.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as fsSync from 'fs'
import * as path from 'path'
import * as os from 'os'
import { runComparativeAnalysis } from '@/lib/biomechanics/comparative-analyzer'

const execAsync = promisify(exec)

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export const dynamic = 'force-dynamic'
export const maxDuration = 300

interface AnalyzeRequest {
  analysisId: string
  framesCount?: number
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body: AnalyzeRequest = await request.json()
    const { analysisId, framesCount = 6 } = body

    if (!analysisId) {
      return NextResponse.json({ error: 'analysisId é obrigatório' }, { status: 400 })
    }

    console.log(`🎥 Análise COMPARATIVA: ${analysisId}`)

    // 1. Buscar análise no banco
    const { data: analysis, error: fetchError } = await supabase
      .from('nfc_chat_video_analyses')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (fetchError || !analysis) {
      return NextResponse.json(
        { error: 'Análise não encontrada', details: fetchError?.message },
        { status: 404 }
      )
    }

    // Atualizar status
    await supabase
      .from('nfc_chat_video_analyses')
      .update({ status: 'PROCESSING_COMPARATIVE' })
      .eq('id', analysisId)

    // 2. Verificar Ollama
    try {
      const ollamaRes = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(5000) })
      if (!ollamaRes.ok) throw new Error('Ollama indisponível')
      const ollamaData = await ollamaRes.json()
      const models = ollamaData.models?.map((m: { name: string }) => m.name) || []
      const hasVision = models.some((m: string) => m.includes('vision'))
      if (!hasVision) throw new Error('Nenhum modelo de visão disponível')
      console.log(`  ✅ Ollama OK (${models.length} modelos)`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      return NextResponse.json(
        { error: 'Ollama não disponível', details: msg },
        { status: 503 }
      )
    }

    // 3. Criar temp dir
    const tempDir = path.join(os.tmpdir(), `biomech_comp_${Date.now()}`)
    await fs.mkdir(tempDir, { recursive: true })

    try {
      // 4. Baixar vídeo
      console.log('  ⬇️ Baixando vídeo...')
      const videoPath = path.join(tempDir, 'video.mp4')

      const videoRes = await fetch(analysis.video_url)
      if (!videoRes.ok) throw new Error(`Download falhou: ${videoRes.status}`)

      const videoBuffer = await videoRes.arrayBuffer()
      await fs.writeFile(videoPath, Buffer.from(videoBuffer))
      console.log('  ✅ Download completo')

      // 5. Obter duração
      let duration = 3
      try {
        const { stdout } = await execAsync(
          `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
        )
        duration = parseFloat(stdout.trim()) || 3
      } catch {
        console.warn('  ⚠️ Duração não detectada, usando 3s')
      }

      // 6. Extrair frames
      console.log(`  🖼️ Extraindo ${framesCount} frames...`)
      const interval = duration / (framesCount + 1)
      const framesBase64: string[] = []

      for (let i = 1; i <= framesCount; i++) {
        const timestamp = interval * i
        const framePath = path.join(tempDir, `frame_${i}.jpg`)

        await execAsync(
          `ffmpeg -y -ss ${timestamp} -i "${videoPath}" -frames:v 1 -q:v 2 "${framePath}"`
        )

        const imageBuffer = await fs.readFile(framePath)
        framesBase64.push(imageBuffer.toString('base64'))
      }
      console.log(`  ✅ ${framesBase64.length} frames extraídos`)

      // 7. ANÁLISE COMPARATIVA
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
      const { error: updateError } = await supabase
        .from('nfc_chat_video_analyses')
        .update({
          ai_analysis: finalResult,
          ai_analyzed_at: new Date().toISOString(),
          status: 'AI_ANALYZED',
        })
        .eq('id', analysisId)

      if (updateError) {
        console.error('Erro ao salvar:', updateError)
        return NextResponse.json(
          { error: 'Erro ao salvar', details: updateError.message },
          { status: 500 }
        )
      }

      console.log(`\n✅ Análise comparativa completa!`)
      console.log(`  Score: ${result.score}/10 - ${result.classification}`)
      console.log(`  Similaridade Ouro: ${result.similaridade_padrao_ouro}%`)
      console.log(`  Pontos Críticos: ${result.pontos_criticos.length}`)
      console.log(`  Método: ${result.metodo}`)
      console.log(`  Tempo: ${(Date.now() - startTime) / 1000}s`)

      return NextResponse.json({
        success: true,
        analysisId,
        score: result.score,
        classification: result.classification,
        similaridade_padrao_ouro: result.similaridade_padrao_ouro,
        pontos_criticos: result.pontos_criticos.length,
        metodo: result.metodo,
        references_used: result.references_used,
        processing_time_ms: Date.now() - startTime
      })

    } finally {
      try {
        await fs.rm(tempDir, { recursive: true })
      } catch { }
    }

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('❌ Erro:', msg)
    return NextResponse.json(
      { error: 'Erro na análise comparativa', details: msg },
      { status: 500 }
    )
  }
}

// GET: status do serviço comparativo
export async function GET() {
  // Verificar quais referências existem
  const referencesDir = path.join(process.cwd(), 'public', 'references')
  const patterns = ['ouro', 'valgo-severo', 'anterorizacao-tronco', 'lordose-lombar']

  const referencesStatus: Record<string, { available: boolean; frames: number }> = {}

  for (const pattern of patterns) {
    const dir = path.join(referencesDir, pattern)
    try {
      const files = fsSync.existsSync(dir)
        ? (await fs.readdir(dir)).filter(f => f.endsWith('.jpg'))
        : []
      referencesStatus[pattern] = {
        available: files.length >= 4,
        frames: files.length
      }
    } catch {
      referencesStatus[pattern] = { available: false, frames: 0 }
    }
  }

  // Verificar Ollama
  let ollamaOk = false
  let visionModel = ''
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) {
      const data = await res.json()
      const models = data.models?.map((m: { name: string }) => m.name) || []
      visionModel = models.find((m: string) => m.includes('vision')) || ''
      ollamaOk = !!visionModel
    }
  } catch { }

  return NextResponse.json({
    status: ollamaOk ? 'ready' : 'ollama_unavailable',
    ollama: ollamaOk,
    vision_model: visionModel,
    references: referencesStatus,
    comparative_ready: ollamaOk && referencesStatus['ouro']?.available
  })
}
