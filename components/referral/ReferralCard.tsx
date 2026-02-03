'use client';

/**
 * Referral Card Component
 * Card com código de indicação do usuário
 */

import { useEffect, useState } from 'react';
import { Copy, Check, Users, Gift, Share2 } from 'lucide-react';

interface ReferralData {
  code: string | null;
  totalReferrals: number;
  successfulConversions: number;
  pendingReferrals: number;
  totalFPEarned: number;
  conversionRate: number;
  rewards: {
    referrerFP: number;
    refereeDiscount: number;
  };
}

export function ReferralCard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const res = await fetch('/api/referral/stats');
      if (res.ok) {
        const result = await res.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      const res = await fetch('/api/referral/generate', { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        setData((prev) => ({
          ...prev!,
          code: result.code,
        }));
      }
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const copyCode = () => {
    if (data?.code) {
      navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareCode = async () => {
    if (!data?.code) return;

    const shareUrl = `${window.location.origin}/signup?ref=${data.code}`;
    const shareText = `🎁 Use meu código ${data.code} e ganhe ${data.rewards.refereeDiscount}% de desconto no NutriFitCoach! ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Convite NutriFitCoach',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(shareText);
      alert('Link copiado! Cole e compartilhe com seus amigos.');
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-800 rounded w-1/2" />
          <div className="h-12 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!data?.code) {
    return (
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-6 h-6 text-purple-400" />
          <h3 className="font-semibold text-white text-lg">
            Indique e Ganhe
          </h3>
        </div>

        <p className="text-zinc-400 mb-4">
          Gere seu código de indicação e ganhe <strong className="text-purple-400">+50 FP</strong> para
          cada amigo que converter!
        </p>

        <button
          onClick={generateCode}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          Gerar Meu Código
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-purple-400" />
          <h3 className="font-semibold text-white text-lg">Seu Código de Indicação</h3>
        </div>
        <Users className="w-5 h-5 text-purple-400" />
      </div>

      {/* Código */}
      <div className="bg-zinc-900 border border-purple-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="font-mono text-2xl font-bold text-purple-400">
            {data.code}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyCode}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              title="Copiar código"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-zinc-400" />
              )}
            </button>
            <button
              onClick={shareCode}
              className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Recompensas */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-zinc-900/50 border border-emerald-500/30 rounded-lg p-3">
          <div className="text-xs text-zinc-400 mb-1">Você Ganha</div>
          <div className="text-2xl font-bold text-emerald-400">
            +{data.rewards.referrerFP} FP
          </div>
          <div className="text-xs text-zinc-500">por conversão</div>
        </div>
        <div className="bg-zinc-900/50 border border-pink-500/30 rounded-lg p-3">
          <div className="text-xs text-zinc-400 mb-1">Amigo Ganha</div>
          <div className="text-2xl font-bold text-pink-400">
            +{data.rewards.refereeDiscount}% OFF
          </div>
          <div className="text-xs text-zinc-500">desconto extra</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-2xl font-bold text-white">{data.totalReferrals}</div>
          <div className="text-xs text-zinc-500">Indicações</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-emerald-400">
            {data.successfulConversions}
          </div>
          <div className="text-xs text-zinc-500">Conversões</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">
            {data.totalFPEarned}
          </div>
          <div className="text-xs text-zinc-500">FP Ganhos</div>
        </div>
      </div>

      {/* Taxa de conversão */}
      {data.totalReferrals > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Taxa de Conversão</span>
            <span className="text-emerald-400 font-semibold">
              {data.conversionRate.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Pendentes */}
      {data.pendingReferrals > 0 && (
        <div className="mt-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <div className="text-xs text-yellow-400">
            🕐 {data.pendingReferrals} indicação(ões) pendente(s) de conversão
          </div>
        </div>
      )}
    </div>
  );
}
