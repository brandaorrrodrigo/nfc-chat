'use client';

/**
 * Social Proof Component
 * Mostra prova social para criar FOMO
 */

import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

interface SocialProofData {
  recentRedeems: number;
  activeUsers: number;
  popularTier: {
    name: string;
    badge: string;
    count: number;
  } | null;
  urgencyMessage: string;
  scarcityLevel: 'low' | 'medium' | 'high';
  recentActivity?: Array<{
    tierName: string;
    badge: string;
    minutesAgo: number;
    anonymousUser: string;
  }>;
}

export function SocialProof() {
  const [data, setData] = useState<SocialProofData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSocialProof();
    // Atualizar a cada 2 minutos
    const interval = setInterval(fetchSocialProof, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSocialProof = async () => {
    try {
      const res = await fetch('/api/urgency/social-proof?includeActivity=true');
      if (res.ok) {
        const result = await res.json();
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching social proof:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return null;

  const scarcityColors = {
    low: 'from-blue-500 to-cyan-500',
    medium: 'from-orange-500 to-amber-500',
    high: 'from-red-500 to-pink-500',
  };

  const scarcityGradient = scarcityColors[data.scarcityLevel];

  return (
    <div className="space-y-4">
      {/* Mensagem Principal */}
      <div
        className={`bg-gradient-to-r ${scarcityGradient} text-white p-4 rounded-lg shadow-lg`}
      >
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6" />
          <p className="font-semibold text-lg">{data.urgencyMessage}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Resgates Recentes */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-zinc-400">Últimas 24h</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            {data.recentRedeems}
          </div>
          <div className="text-xs text-zinc-500">Resgates realizados</div>
        </div>

        {/* Usuários Ativos */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-zinc-400">Ativos Agora</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">
            {data.activeUsers}
          </div>
          <div className="text-xs text-zinc-500">Usuários engajados</div>
        </div>
      </div>

      {/* Tier Mais Popular */}
      {data.popularTier && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm text-zinc-400">Mais Popular</div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="text-2xl">{data.popularTier.badge}</span>
                  <span>{data.popularTier.name}</span>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {data.popularTier.count}
            </div>
          </div>
        </div>
      )}

      {/* Atividade Recente */}
      {data.recentActivity && data.recentActivity.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="text-sm font-semibold text-zinc-400 mb-3">
            🔥 Atividade Recente
          </div>
          <div className="space-y-2">
            {data.recentActivity.slice(0, 3).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activity.badge}</span>
                  <span className="text-zinc-400">
                    {activity.anonymousUser}
                  </span>
                  <span className="text-zinc-600">resgatou</span>
                </div>
                <span className="text-zinc-500 text-xs">
                  {activity.minutesAgo < 1
                    ? 'agora'
                    : activity.minutesAgo === 1
                    ? '1 min'
                    : `${activity.minutesAgo} min`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
