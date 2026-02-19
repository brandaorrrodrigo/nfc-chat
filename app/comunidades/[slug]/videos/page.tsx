'use client';

/**
 * Pagina de Galeria de Analises Publicadas
 * Acessivel em /comunidades/[slug]/videos
 */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Video } from 'lucide-react';
import { getPremiumArenaConfig, isPremiumNFVArena } from '@/lib/biomechanics/nfv-config';
import { CHAT_ROUTES } from '@/lib/navigation';
import VideoGallery from '@/components/nfv/VideoGallery';

export default function VideosPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug ?? "") as string;

  const isPremium = isPremiumNFVArena(slug);
  const arenaConfig = getPremiumArenaConfig(slug);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-400" />
              {arenaConfig ? arenaConfig.name : 'Analises Publicadas'}
            </h1>
            <p className="text-xs text-zinc-500">Galeria de analises biomecanicas</p>
          </div>

          {isPremium && (
            <button
              onClick={() => router.push(CHAT_ROUTES.NFV_ANALISE(slug))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Upload className="w-3.5 h-3.5" />
              Enviar Video
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <VideoGallery
          arenaSlug={slug}
          onSelectAnalysis={(id) => router.push(CHAT_ROUTES.NFV_VIDEO(slug, id))}
        />
      </div>
    </div>
  );
}
