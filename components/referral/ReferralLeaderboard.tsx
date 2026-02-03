'use client';

/**
 * Referral Leaderboard Component
 * Ranking dos top indicadores
 */

import { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface TopReferrer {
  userId: string;
  userName: string;
  referralCount: number;
  fpEarned: number;
  rank: number;
}

export function ReferralLeaderboard() {
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/referral/leaderboard');
      if (res.ok) {
        const result = await res.json();
        setTopReferrers(
          result.topReferrers.map((r: any, index: number) => ({
            ...r,
            rank: index + 1,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-zinc-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-zinc-500 font-bold">{rank}</div>;
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 2:
        return 'from-zinc-500/20 to-zinc-600/20 border-zinc-400/30';
      case 3:
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      default:
        return 'from-zinc-800/50 to-zinc-900/50 border-zinc-700/50';
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (topReferrers.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
        <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-500">Nenhum indicador ainda.</p>
        <p className="text-xs text-zinc-600 mt-2">Seja o primeiro!</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-semibold text-white">Top Indicadores</h3>
      </div>

      <div className="space-y-3">
        {topReferrers.map((referrer) => (
          <div
            key={referrer.userId}
            className={`bg-gradient-to-r ${getRankColor(referrer.rank)} border rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRankIcon(referrer.rank)}
                <div>
                  <div className="font-semibold text-white">
                    {referrer.userName}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {referrer.referralCount} indicação(ões)
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-emerald-400">
                  {referrer.fpEarned} FP
                </div>
                <div className="text-xs text-zinc-500">ganhos</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
