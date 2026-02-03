'use client';

/**
 * Leaderboard - Ranking de contribuidores
 */

import { useState, useEffect } from 'react';
import { Trophy, Flame, Coins, Video, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  type?: 'fp_total' | 'fp_monthly' | 'streak' | 'videos';
  limit?: number;
  userId?: string;
}

export function Leaderboard({ type = 'fp_total', limit = 10, userId }: LeaderboardProps) {
  const [ranking, setRanking] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, [type, limit, userId]);

  const fetchRanking = async () => {
    try {
      const params = new URLSearchParams({ type, limit: limit.toString() });
      if (userId) params.append('userId', userId);

      const res = await fetch(`/api/ranking?${params}`);
      const data = await res.json();

      setRanking(data.ranking || []);
      setUserRank(data.userRank);
    } catch (error) {
      console.error('Error fetching ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'fp_total':
        return { icon: Coins, label: 'FP Total', color: 'purple', suffix: 'FP' };
      case 'fp_monthly':
        return { icon: TrendingUp, label: 'FP do Mês', color: 'green', suffix: 'FP' };
      case 'streak':
        return { icon: Flame, label: 'Streak', color: 'orange', suffix: 'dias' };
      case 'videos':
        return { icon: Video, label: 'Vídeos NFV', color: 'purple', suffix: 'vídeos' };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  if (loading) {
    return <div className="animate-pulse h-96 bg-zinc-800 rounded-xl" />;
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-zinc-700 to-zinc-800';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-${config.color}-500/20 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${config.color}-400`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{config.label}</h3>
            <p className="text-xs text-zinc-500">Top {limit}</p>
          </div>
        </div>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      {/* User Rank (se aplicável) */}
      {userRank && userRank > limit && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            Sua posição: #{userRank}
          </p>
        </div>
      )}

      {/* Ranking List */}
      <div className="space-y-2">
        {ranking.length === 0 ? (
          <p className="text-center text-zinc-500 py-8 text-sm">
            Nenhum dado disponível ainda
          </p>
        ) : (
          ranking.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                entry.userId === userId
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'bg-zinc-800/50 hover:bg-zinc-800'
              }`}
            >
              {/* Rank Badge */}
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(
                  entry.rank
                )} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-sm font-bold text-white">
                  {getRankIcon(entry.rank)}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {entry.userName}
                </p>
                <p className="text-xs text-zinc-500">
                  Posição #{entry.rank}
                </p>
              </div>

              {/* Value */}
              <div className="text-right">
                <p className={`text-lg font-bold text-${config.color}-400`}>
                  {entry.value}
                </p>
                <p className="text-xs text-zinc-500">{config.suffix}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
