/**
 * API Route: Upload Video to Supabase Storage
 * Faz upload de arquivo de vídeo para o bucket do Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'nfv-videos';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const arenaSlug = formData.get('arenaSlug') as string;
    const userId = formData.get('userId') as string;

    if (!file || !arenaSlug || !userId) {
      return NextResponse.json(
        { error: 'File, arenaSlug e userId são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Arquivo deve ser um vídeo' },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo: 100MB' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${arenaSlug}/${userId}_${timestamp}.${fileExt}`;

    console.log('[Upload Video] Uploading to:', fileName);

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload Video] Supabase error:', uploadError);

      // Se o bucket não existe, tentar criar
      if (uploadError.message.includes('not found')) {
        console.log('[Upload Video] Bucket not found, creating...');
        const { error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: MAX_FILE_SIZE,
        });

        if (bucketError) {
          console.error('[Upload Video] Failed to create bucket:', bucketError);
          return NextResponse.json(
            { error: 'Erro ao configurar storage. Contate o suporte.' },
            { status: 500 }
          );
        }

        // Tentar upload novamente
        const { data: retryData, error: retryError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (retryError) {
          console.error('[Upload Video] Retry failed:', retryError);
          return NextResponse.json(
            { error: 'Erro ao fazer upload do vídeo' },
            { status: 500 }
          );
        }

        // Obter URL pública
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(retryData.path);

        return NextResponse.json({
          videoUrl: urlData.publicUrl,
          videoPath: retryData.path,
        });
      }

      return NextResponse.json(
        { error: uploadError.message || 'Erro ao fazer upload' },
        { status: 500 }
      );
    }

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadData.path);

    console.log('[Upload Video] Success:', urlData.publicUrl);

    return NextResponse.json({
      videoUrl: urlData.publicUrl,
      videoPath: uploadData.path,
    });
  } catch (error: any) {
    console.error('[Upload Video] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

// Aumentar limite de body para 100MB (Vercel padrão é 4.5MB)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};
