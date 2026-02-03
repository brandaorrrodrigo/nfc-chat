'use client';

/**
 * Pagina de Upload de Video para Analise Biomecanica
 * Acessivel em /comunidades/[slug]/analise
 */

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { getPremiumArenaConfig } from '@/lib/biomechanics/nfv-config';
import VideoUploadForm from '@/components/nfv/VideoUploadForm';
import { CHAT_ROUTES } from '@/lib/navigation';

export default function AnalisePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const arenaConfig = getPremiumArenaConfig(slug);

  // Mock user - em producao vem do auth
  const userId = 'user_mock_001';
  const userName = 'Usuario';

  if (!arenaConfig) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Arena nao encontrada ou nao e uma arena premium NFV.</p>
          <button
            onClick={() => router.push(CHAT_ROUTES.NFV_HUB)}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Voltar ao Hub Biomecanico
          </button>
        </div>
      </div>
    );
  }

  const handleUploadComplete = (analysisId: string) => {
    console.log('[NFV] Upload complete:', analysisId);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-white">{arenaConfig.name}</h1>
            <p className="text-xs text-zinc-500">Upload de Video</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <VideoUploadForm
          arenaSlug={slug}
          arenaName={arenaConfig.name}
          userId={userId}
          userName={userName}
          onUploadComplete={handleUploadComplete}
        />

        {/* Info */}
        <div className="mt-8 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-zinc-300">Como funciona</h3>
          </div>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Envie seu video de execucao do exercicio' },
              { step: '2', text: 'Nossa IA faz uma pre-analise biomecanica' },
              { step: '3', text: 'Um especialista revisa e complementa a analise' },
              { step: '4', text: 'Voce recebe a analise detalhada + correcoes' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-purple-400">{step}</span>
                </div>
                <p className="text-xs text-zinc-400 pt-0.5">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
