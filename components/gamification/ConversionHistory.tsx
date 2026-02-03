'use client';

/**
 * Conversion History Component
 * Histórico de conversões com badges
 */

import { useEffect, useState } from 'react';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';

interface Badge {
  name: string;
  icon: string;
  earnedAt: Date;
}

interface ConversionRecord {
  id: string;
  tierName: string;
  badge: string;
  discountPercent: number;
  redeemedAt: Date;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
}

export function ConversionHistory() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [conversions, setConversions] = useState<ConversionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [badgesRes, couponsRes] = await Promise.all([
        fetch('/api/gamification/badges'),
        fetch('/api/coupons/list?limit=10'),
      ]);

      if (badgesRes.ok) {
        const badgesData = await badgesRes.json();
        setBadges(badgesData.badges || []);
      }

      if (couponsRes.ok) {
        const couponsData = await couponsRes.json();
        setConversions(
          couponsData.coupons.map((c: any) => ({
            id: c.id,
            tierName: c.tierName,
            badge: getTierBadge(c.tierId),
            discountPercent: c.discountPercent,
            redeemedAt: new Date(c.createdAt),
            status: c.status,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierBadge = (tierId: string): string => {
    const badges: Record<string, string> = {
      tier_basic: '🥉',
      tier_intermediate: '🥈',
      tier_advanced: '🥇',
    };
    return badges[tierId] || '🎟️';
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      ACTIVE: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      USED: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      EXPIRED: 'text-zinc-500 bg-zinc-800/50 border-zinc-700/50',
    };
    return colors[status] || colors.EXPIRED;
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      ACTIVE: 'Ativo',
      USED: 'Usado',
      EXPIRED: 'Expirado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badges Conquistados */}
      {badges.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">Badges Conquistados</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-medium text-white mb-1">
                  {badge.name}
                </div>
                <div className="text-xs text-zinc-500">
                  {new Date(badge.earnedAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Conversões */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white">Histórico de Resgates</h3>
        </div>

        {conversions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            <p>Nenhum resgate ainda.</p>
            <p className="text-sm mt-2">
              Acumule FP e resgate seu primeiro cupom!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversions.map((conversion) => (
              <div
                key={conversion.id}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{conversion.badge}</span>
                    <div>
                      <div className="font-semibold text-white">
                        {conversion.tierName}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {conversion.discountPercent}% OFF
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        conversion.status
                      )}`}
                    >
                      {getStatusLabel(conversion.status)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" />
                      {conversion.redeemedAt.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
