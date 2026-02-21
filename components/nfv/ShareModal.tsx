'use client';

/**
 * ShareModal - Modal de compartilhamento de analise biomecanica
 * Gera card visual (Canvas) com thumbnail do pico, Motor/Stabilizer scores,
 * destaques positivos/negativos e CTA dinâmico baseado no score.
 */

import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Copy, Check, Loader2 } from 'lucide-react';
import { NFV_CONFIG } from '@/lib/biomechanics/nfv-config';
import {
  generateShareCard,
  generateShareCardInstagram,
  renderShareCardPreview,
  type ShareCardData,
} from '@/lib/share/generate-share-card';

const PATTERN_LABELS: Record<string, string> = {
  agachamento: 'Agachamento',
  terra: 'Levantamento Terra',
  supino: 'Supino',
  puxadas: 'Puxadas',
  'elevacao-pelvica': 'Elevacao Pelvica',
};

interface ShareModalProps {
  analysis: {
    id: string;
    movement_pattern: string;
    user_name: string;
    thumbnail_url?: string;
  };
  displayAnalysis: Record<string, unknown>;
  open: boolean;
  onClose: () => void;
}

function buildCtaText(score: number, exerciseName: string): string {
  if (score >= 8) {
    return `Mandei bem! Obtive ${score.toFixed(1)}/10 no ${exerciseName.toLowerCase()}. Sera que voce consegue superar? 💪`;
  }
  if (score >= 5) {
    return `Obtive ${score.toFixed(1)}/10 no ${exerciseName.toLowerCase()} com analise biomecanica por IA. Avalie sua execucao tambem!`;
  }
  return `Descobri pontos pra melhorar no meu ${exerciseName.toLowerCase()}. Analise o seu e veja como esta! 🏋️`;
}

function extractShareData(
  analysis: ShareModalProps['analysis'],
  displayAnalysis: Record<string, unknown>,
): ShareCardData {
  const score =
    (displayAnalysis.score as number) ||
    (displayAnalysis.overall_score as number) ||
    0;

  const report = (displayAnalysis.report as Record<string, unknown>) || {};
  const classificacao =
    (report.classificacao as string) ||
    (displayAnalysis.classificacao as string) ||
    (displayAnalysis.classification as string) ||
    '';

  // Pontos criticos — novo formato
  const pontosCriticosNovo =
    (displayAnalysis.pontos_criticos as Array<{ nome: string; severidade: string }>) || [];

  // Pontos criticos — antigo formato (fallback)
  const pontosCriticosAntigo = (
    (report.pontos_criticos as Array<{ tipo: string; descricao: string; severidade: string }>) || []
  ).map(p => ({ nome: p.descricao || p.tipo, severidade: p.severidade }));

  const pontosCriticos =
    pontosCriticosNovo.length > 0 ? pontosCriticosNovo : pontosCriticosAntigo;

  // Motor / Stabilizer scores
  const motorScore =
    (displayAnalysis.motor_score as number) ||
    (displayAnalysis.motorScore as number) ||
    undefined;
  const stabilizerScore =
    (displayAnalysis.stabilizer_score as number) ||
    (displayAnalysis.stabilizerScore as number) ||
    undefined;

  // Pontos positivos (top 2)
  const rawPositivos = (report.pontos_positivos as string[]) || [];
  // Também tenta extrair do motor_analysis (articulações excellent/good)
  const motorPositivos: string[] = [];
  if (!rawPositivos.length && displayAnalysis.motor_analysis) {
    const motorArr = displayAnalysis.motor_analysis as Array<{
      label?: string;
      rom?: { classification?: string; value?: number; unit?: string };
    }>;
    for (const m of motorArr) {
      const cls = m.rom?.classification;
      if (cls === 'excellent' || cls === 'good') {
        motorPositivos.push(`${m.label || 'Articulacao'}: ${m.rom?.value}${m.rom?.unit || 'deg'}`);
      }
    }
  }
  const pontosPositivos = (rawPositivos.length > 0 ? rawPositivos : motorPositivos).slice(0, 2);

  const arenaConfig = NFV_CONFIG.PREMIUM_ARENAS.find(
    a => a.pattern === analysis.movement_pattern,
  );

  const exerciseName = PATTERN_LABELS[analysis.movement_pattern] || analysis.movement_pattern;
  const ctaText = buildCtaText(score, exerciseName);

  return {
    exerciseName,
    exerciseIcon: arenaConfig?.icon || '🏋️',
    score,
    classificacao,
    pontosCriticos,
    arenaColor: arenaConfig?.color || '#8b5cf6',
    motorScore,
    stabilizerScore,
    pontosPositivos,
    thumbnailUrl: analysis.thumbnail_url,
    ctaText,
  };
}

export default function ShareModal({
  analysis,
  displayAnalysis,
  open,
  onClose,
}: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [shareData] = useState<ShareCardData>(() =>
    extractShareData(analysis, displayAnalysis),
  );

  // Render preview (async) ao abrir
  useEffect(() => {
    if (!open || !canvasRef.current) return;
    setPreviewLoading(true);
    renderShareCardPreview(canvasRef.current, shareData).finally(() =>
      setPreviewLoading(false),
    );
  }, [open, shareData]);

  if (!open) return null;

  const arenaSlug =
    NFV_CONFIG.PREMIUM_ARENAS.find(a => a.pattern === analysis.movement_pattern)?.slug ||
    'analise';
  const analysisUrl = `https://chat.nutrifitcoach.com.br/comunidades/${arenaSlug}/videos/${analysis.id}`;

  const whatsappText = `🏋️ ${shareData.ctaText || `Obtive ${shareData.score.toFixed(1)}/10 no ${shareData.exerciseName.toLowerCase()} com analise biomecanica por IA!`} ${analysisUrl}`;

  const handleWhatsApp = async () => {
    setGenerating('whatsapp');
    try {
      if (navigator.share && navigator.canShare) {
        const blob = await generateShareCard(shareData);
        const file = new File([blob], 'analise-biomecanica.png', { type: 'image/png' });
        const sharePayload = { text: whatsappText, files: [file] };
        if (navigator.canShare(sharePayload)) {
          await navigator.share(sharePayload);
          setGenerating(null);
          return;
        }
      }
    } catch {
      // fallback
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
    setGenerating(null);
  };

  const handleInstagram = async () => {
    setGenerating('instagram');
    try {
      const blob = await generateShareCardInstagram(shareData);
      downloadBlob(blob, 'analise-biomecanica-stories.png');
    } catch (err) {
      console.error('[Share] Instagram error:', err);
    }
    setGenerating(null);
  };

  const handleDownload = async () => {
    setGenerating('download');
    try {
      const blob = await generateShareCard(shareData);
      downloadBlob(blob, 'analise-biomecanica.png');
    } catch (err) {
      console.error('[Share] Download error:', err);
    }
    setGenerating(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(analysisUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = analysisUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h3 className="text-sm font-semibold text-white mb-4">Compartilhar Resultado</h3>

        {/* Canvas Preview */}
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 mb-5">
          {previewLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-10">
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
            </div>
          )}
          <canvas ref={canvasRef} className="w-full" style={{ aspectRatio: '1/1' }} />
        </div>

        {/* Score rápido */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="text-xs text-zinc-500">
            Score: <span className="text-white font-semibold">{shareData.score.toFixed(1)}/10</span>
          </div>
          {shareData.motorScore != null && shareData.stabilizerScore != null && (
            <div className="flex gap-3 text-xs text-zinc-500">
              <span>Motor: <span className="text-zinc-300">{shareData.motorScore.toFixed(1)}</span></span>
              <span>Estab: <span className="text-zinc-300">{shareData.stabilizerScore.toFixed(1)}</span></span>
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            disabled={generating !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors disabled:opacity-50"
          >
            {generating === 'whatsapp' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            )}
            WhatsApp
          </button>

          {/* Instagram Stories */}
          <button
            onClick={handleInstagram}
            disabled={generating !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium hover:bg-pink-500/20 transition-colors disabled:opacity-50"
          >
            {generating === 'instagram' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            )}
            Stories
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={generating !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50"
          >
            {generating === 'download' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            disabled={generating !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar link
              </>
            )}
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-[10px] text-zinc-600 text-center mt-4">
          O card compartilhado contem apenas o resultado. Seu video nao e incluido.
        </p>
      </div>
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
