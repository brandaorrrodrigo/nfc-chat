#!/usr/bin/env node
/**
 * Extrai frames de referência dos vídeos para análise comparativa
 * Uso: node scripts/extract-reference-frames.js
 */

const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const TOTAL_FRAMES = 6

async function extractFrames(videoPath, outputDir, totalFrames = TOTAL_FRAMES) {
  const fullVideoPath = path.resolve(videoPath)

  if (!fs.existsSync(fullVideoPath)) {
    console.error(`❌ Vídeo não encontrado: ${fullVideoPath}`)
    return false
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log(`🎬 Extraindo ${totalFrames} frames de: ${videoPath}`)

  // Obter duração
  let duration = 3
  try {
    const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${fullVideoPath}"`
    duration = parseFloat(execSync(cmd).toString().trim()) || 3
  } catch {
    console.warn('  ⚠️ Não foi possível obter duração, usando 3s')
  }

  const interval = duration / (totalFrames + 1)
  let extracted = 0

  for (let i = 1; i <= totalFrames; i++) {
    const timestamp = interval * i
    const outputFile = path.join(outputDir, `frame-${i}.jpg`)

    try {
      execSync(
        `ffmpeg -y -ss ${timestamp} -i "${fullVideoPath}" -frames:v 1 -q:v 2 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" "${outputFile}"`,
        { stdio: 'pipe' }
      )

      if (fs.existsSync(outputFile)) {
        const stats = fs.statSync(outputFile)
        console.log(`  ✅ Frame ${i} (${timestamp.toFixed(2)}s) - ${(stats.size / 1024).toFixed(0)}KB`)
        extracted++
      }
    } catch (e) {
      console.warn(`  ⚠️ Frame ${i} falhou: ${e.message?.substring(0, 80)}`)
    }
  }

  console.log(`  📸 ${extracted}/${totalFrames} frames extraídos`)
  return extracted > 0
}

async function processAllReferenceVideos() {
  console.log('🚀 Extração de frames de referência\n')
  console.log('='.repeat(50))

  // Verificar ffmpeg
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' })
    console.log('✅ ffmpeg disponível\n')
  } catch {
    console.error('❌ ffmpeg não encontrado! Instale com: winget install FFmpeg')
    process.exit(1)
  }

  const basePath = path.resolve('public/references')

  const videos = [
    {
      name: 'Padrão Ouro',
      input: path.join(basePath, 'ouro', 'agachamento-perfeito.mp4'),
      output: path.join(basePath, 'ouro')
    },
    {
      name: 'Valgo Severo',
      input: path.join(basePath, 'valgo-severo', 'valgo-exemplo.mp4'),
      output: path.join(basePath, 'valgo-severo')
    },
    {
      name: 'Anteriorização',
      input: path.join(basePath, 'anterorizacao-tronco', 'antero-exemplo.mp4'),
      output: path.join(basePath, 'anterorizacao-tronco')
    },
    {
      name: 'Lordose Lombar',
      input: path.join(basePath, 'lordose-lombar', 'lordose-exemplo.mp4'),
      output: path.join(basePath, 'lordose-lombar')
    }
  ]

  let success = 0
  let skipped = 0

  for (const video of videos) {
    console.log(`\n📹 ${video.name}`)

    if (!fs.existsSync(video.input)) {
      console.warn(`  ⏭️ Vídeo não encontrado, pulando...`)
      console.warn(`  📁 Esperado: ${video.input}`)
      skipped++
      continue
    }

    try {
      const ok = await extractFrames(video.input, video.output, TOTAL_FRAMES)
      if (ok) success++
    } catch (error) {
      console.warn(`  ⚠️ Erro: ${error.message}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Processados: ${success}`)
  console.log(`⏭️ Pulados: ${skipped}`)
  console.log(`📂 Pastas: ${basePath}`)

  if (skipped > 0) {
    console.log('\n💡 Para adicionar vídeos de referência:')
    console.log('   Copie vídeos .mp4 para as pastas correspondentes:')
    videos.forEach(v => {
      if (!fs.existsSync(v.input)) {
        console.log(`   → ${v.input}`)
      }
    })
  }
}

processAllReferenceVideos().catch(err => {
  console.error('❌ Erro fatal:', err)
  process.exit(1)
})
