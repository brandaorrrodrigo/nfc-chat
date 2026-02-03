'use client';

/**
 * VideoUploadButton - Botão para iniciar upload de vídeo NFV
 * Mostra custo em FP e valida permissões
 */

import { useState } from 'react';
import { Upload, Loader2, Coins } from 'lucide-react';

interface VideoUploadButtonProps {
  arenaSlug: string;
  arenaName: string;
  requiresFP: number;
  userFP?: number;
  isSubscriber?: boolean;
  onUploadStart: () => void;
}

export function VideoUploadButton({
  arenaSlug,
  arenaName,
  requiresFP,
  userFP = 0,
  isSubscriber = false,
  onUploadStart,
}: VideoUploadButtonProps) {
  const [isChecking, setIsChecking] = useState(false);

  const canAfford = isSubscriber || userFP >= requiresFP;
  const fpNeeded = Math.max(0, requiresFP - userFP);

  const handleClick = async () => {
    if (!canAfford) {
      // Mostrar modal de FP insuficiente
      return;
    }

    setIsChecking(true);
    try {
      // Verificar permissões via API
      const response = await fetch(`/api/nfv/check-permission?arenaSlug=${arenaSlug}`);
      const data = await response.json();

      if (data.allowed) {
        onUploadStart();
      } else {
        alert(`Permissão negada: ${data.reason}`);
      }
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      alert('Erro ao verificar permissões. Tente novamente.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Enviar Vídeo para Análise
          </h3>

          <p className="text-sm text-zinc-400 mb-4">
            Receba análise biomecânica detalhada com IA + revisão profissional
          </p>

          {/* Custo */}
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-zinc-300">
              {isSubscriber ? (
                <>
                  <span className="text-green-400 font-semibold">GRATUITO</span>
                  <span className="text-zinc-500 ml-2">(assinante)</span>
                </>
              ) : (
                <>
                  Custo: <span className="text-yellow-400 font-semibold">{requiresFP} FP</span>
                  {userFP > 0 && (
                    <span className="text-zinc-500 ml-2">
                      (você tem: {userFP} FP)
                    </span>
                  )}
                </>
              )}
            </span>
          </div>

          {/* Botão */}
          <button
            onClick={handleClick}
            disabled={!canAfford || isChecking}
            className={`
              w-full px-6 py-3 rounded-lg font-medium transition-all
              flex items-center justify-center gap-2
              ${
                canAfford
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }
            `}
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verificando...
              </>
            ) : !canAfford ? (
              <>
                <Coins className="w-5 h-5" />
                Faltam {fpNeeded} FP
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Enviar Vídeo
              </>
            )}
          </button>

          {/* FP insuficiente */}
          {!canAfford && !isSubscriber && (
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400">
                💡 <strong>Como ganhar FP:</strong> Participe das comunidades fazendo perguntas,
                compartilhando conhecimento e ajudando outros membros.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
