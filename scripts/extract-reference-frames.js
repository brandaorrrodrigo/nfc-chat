const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')

async function extractFrames(videoPath, outputDir, totalFrames = 6) {
  
  // Verificar se vídeo existe
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Vídeo não encontrado: ${videoPath}`)
    return false
  }
  
  // Criar pasta de output se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  console.log(`🎬 Extraindo ${totalFrames} frames de: ${path.basename(videoPath)}`)
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => {
        console.log(`✅ Frames extraídos em: ${outputDir}`)
        resolve(true)
      })
      .on('error', (err) => {
        console.error(`❌ Erro ao extrair frames:`, err.message)
        reject(err)
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r   Progresso: ${Math.round(progress.percent)}%`)
        }
      })
      .screenshots({
        count: totalFrames,
        folder: outputDir,
        filename: 'frame-%i.jpg',
        size: '1280x720'
      })
  })
}

async function processAllReferenceVideos() {
  console.log('🚀 Iniciando extração de frames...\n')
  
  const videos = [
    {
      name: 'Padrão Ouro',
      input: 'public/references/ouro/agachamento-perfeito.mp4',
      output: 'public/references/ouro'
    },
    {
      name: 'Valgo Severo',
      input: 'public/references/valgo-severo/valgo-exemplo.mp4',
      output: 'public/references/valgo-severo'
    },
    {
      name: 'Anteriorização',
      input: 'public/references/anterorizacao-tronco/antero-exemplo.mp4',
      output: 'public/references/anterorizacao-tronco'
    },
    {
      name: 'Lordose Lombar',
      input: 'public/references/lordose-lombar/lordose-exemplo.mp4',
      output: 'public/references/lordose-lombar'
    }
  ]
  
  let successCount = 0
  let failCount = 0
  
  for (const video of videos) {
    console.log(`\n📹 Processando: ${video.name}`)
    
    try {
      const success = await extractFrames(video.input, video.output, 6)
      if (success) {
        successCount++
      } else {
        failCount++
        console.warn(`⚠️  Pulando ${video.name} (vídeo não encontrado)`)
      }
    } catch (error) {
      failCount++
      console.warn(`⚠️  Pulando ${video.name} (erro na extração)`)
    }
  }
  
  console.log('\n')
  console.log('========================================')
  console.log('✅ PROCESSAMENTO CONCLUÍDO!')
  console.log('========================================')
  console.log(`✅ Sucesso: ${successCount} vídeo(s)`)
  console.log(`⚠️  Pulados: ${failCount} vídeo(s)`)
  console.log('')
  console.log('📂 Verifique as pastas em public/references/')
  console.log('')
}

// Executar
processAllReferenceVideos()
  .catch(error => {
    console.error('\n❌ Erro fatal:', error.message)
    process.exit(1)
  })