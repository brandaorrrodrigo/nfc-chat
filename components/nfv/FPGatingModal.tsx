'use client';

/**
 * FP Gating Modal - Modal de custo FP + upsell assinatura
 */

import React from 'react';
import { X, Zap, Crown, Lock } from 'lucide-react';
import { APP_URL } from '@/lib/navigation';

interface FPGatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fpBalance: number;
  fpCost: number;
  arenaName: string;
  onConfirmSpend?: () => void;
}

export default function FPGatingModal({
  isOpen,
  onClose,
  fpBalance,
  fpCost,
  arenaName,
  onConfirmSpend,
}: FPGatingModalProps) {
  if (!isOpen) return null;

  const canAfford = fpBalance >= fpCost;
  const deficit = fpCost - fpBalance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload de Video</h3>
            <p className="text-xs text-zinc-400">{arenaName}</p>
          </div>
        </div>

        {canAfford ? (
          <>
            {/* Pode pagar */}
            <div className="bg-zinc-800/50 rounded-xl p-4 mb-4 border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-300">Custo do upload</span>
                <span className="text-lg font-bold text-amber-400 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {fpCost} FP
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Seu saldo</span>
                <span className="text-sm text-zinc-300">{fpBalance} FP</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-zinc-500">Apos upload</span>
                <span className="text-sm text-green-400">{fpBalance - fpCost} FP</span>
              </div>
            </div>

            <div className="text-xs text-zinc-500 mb-4">
              Sua analise sera processada pela IA e revisada por um especialista.
              Voce ganha +10 FP quando ela for publicada.
            </div>

            <button
              onClick={onConfirmSpend}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Confirmar Upload ({fpCost} FP)
            </button>
          </>
        ) : (
          <>
            {/* Nao pode pagar */}
            <div className="bg-red-900/20 rounded-xl p-4 mb-4 border border-red-800/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-300">Custo do upload</span>
                <span className="text-lg font-bold text-amber-400 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {fpCost} FP
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Seu saldo</span>
                <span className="text-sm text-red-400">{fpBalance} FP</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-red-400">Faltam</span>
                <span className="text-sm text-red-400">{deficit} FP</span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-4">
              Participe do chat para ganhar mais FP, ou assine o App para uploads ilimitados.
            </p>

            {/* Upsell Assinatura */}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-600/30 text-amber-300 hover:border-amber-500/50 transition-all mb-3"
            >
              <Crown className="w-5 h-5" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Assinante App</p>
                <p className="text-[10px] text-amber-400/70">
                  Uploads ilimitados + todas as funcionalidades
                </p>
              </div>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors"
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
