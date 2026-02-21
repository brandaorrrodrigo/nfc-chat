/**
 * API Route: Generate Thumbnail
 * POST { videoId } → FFmpeg extrai frame central → upload Supabase → atualiza thumbnail_url
 * Lightweight: usa apenas FFmpeg (sem MediaPipe/Ollama)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

const TABLE = 'nfc_chat_video_analyses';

const isWindows = process.platform === 'win32';
const FFPROBE_BIN = isWindows
  ? (process.env.FFPROBE_PATH || 'C:\\ProgramData\\chocolatey\\bin\\ffprobe.exe')
  : 'ffprobe';
const FFMPEG_BIN = isWindows
  ? (process.env.FFMPEG_PATH || 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe')
  : 'ffmpeg';
const EXEC_OPTIONS = isWindows ? { shell: 'cmd.exe' as const } : {};

export async function POST(req: NextRequest) {
  let tempDir: string | undefined;

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Buscar registro no banco
    const { data: video, error: dbError } = await supabase
      .from(TABLE)
      .select('id, video_url, video_path, thumbnail_url')
      .eq('id', videoId)
      .single();

    if (dbError || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // 2. Criar temp dir
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nfv-thumb-'));
    const localVideoPath = path.join(tempDir, 'video.mp4');
    const thumbPath = path.join(tempDir, 'thumbnail.jpg');

    // 3. Baixar vídeo
    if (video.video_path) {
      // Tentar caminho local primeiro, depois Supabase Storage
      try {
        fs.accessSync(video.video_path);
        fs.copyFileSync(video.video_path, localVideoPath);
      } catch {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('nfv-videos')
          .download(video.video_path);
        if (downloadError) throw new Error(`Download Supabase falhou: ${downloadError.message}`);
        const arrayBuffer = await fileData.arrayBuffer();
        fs.writeFileSync(localVideoPath, Buffer.from(arrayBuffer));
      }
    } else if (video.video_url) {
      // Download via URL pública
      const response = await fetch(video.video_url);
      if (!response.ok) throw new Error(`HTTP ${response.status} ao baixar vídeo`);
      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(localVideoPath, Buffer.from(arrayBuffer));
    } else {
      return NextResponse.json({ error: 'Vídeo sem URL ou path no banco' }, { status: 400 });
    }

    // 4. Obter duração com ffprobe
    const { stdout: durationStr } = await execAsync(
      `"${FFPROBE_BIN}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${localVideoPath}"`,
      EXEC_OPTIONS
    );
    const duration = parseFloat(durationStr.trim()) || 5;
    const midpoint = Math.max(0.5, duration / 2);

    // 5. Extrair frame no ponto central
    await execAsync(
      `"${FFMPEG_BIN}" -ss ${midpoint.toFixed(2)} -i "${localVideoPath}" -vframes 1 -q:v 2 "${thumbPath}" -y`,
      EXEC_OPTIONS
    );

    if (!fs.existsSync(thumbPath)) {
      throw new Error('Extração de frame falhou');
    }

    // 6. Upload para Supabase Storage
    const frameBuffer = fs.readFileSync(thumbPath);
    const storagePath = `thumbnails/${videoId}_thumbnail.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('nfv-videos')
      .upload(storagePath, frameBuffer, { contentType: 'image/jpeg', upsert: true });

    if (uploadError) throw new Error(`Upload falhou: ${uploadError.message}`);

    const { data: urlData } = supabase.storage.from('nfv-videos').getPublicUrl(storagePath);
    const thumbnailUrl = urlData.publicUrl;

    // 7. Atualizar thumbnail_url no banco
    await supabase
      .from(TABLE)
      .update({ thumbnail_url: thumbnailUrl, updated_at: new Date().toISOString() })
      .eq('id', videoId);

    console.log(`[generate-thumbnail] ${videoId} → ${storagePath}`);
    return NextResponse.json({ success: true, thumbnailUrl });

  } catch (err) {
    console.error('[generate-thumbnail] Erro:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro desconhecido' },
      { status: 500 }
    );
  } finally {
    if (tempDir && fs.existsSync(tempDir)) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch { /* cleanup */ }
    }
  }
}
