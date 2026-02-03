'use client';

/**
 * Página de Perfil do Usuário
 *
 * Exibe:
 * - Informações do usuário
 * - Dashboard de FP
 * - Badges conquistados
 * - Posição nos rankings
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FPDashboard } from '@/components/gamification/FPDashboard';
import { StreakBadge } from '@/components/gamification/StreakBadge';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import {
  User,
  Award,
  TrendingUp,
  Loader2,
  ArrowLeft,
  Calendar,
  Mail,
  Shield
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchBadges();
    }
  }, [session?.user?.id]);

  const fetchBadges = async () => {
    try {
      const userId = (session?.user as any)?.id || session?.user?.email;
      const res = await fetch(`/api/badges?userId=${userId}`);
      const data = await res.json();
      setBadges(data.badges || []);
    } catch (error) {
      console.error('Erro ao buscar badges:', error);
    } finally {
      setLoadingBadges(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user as any;
  const userId = user.id || user.email;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-red-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] py-8">
      <div className="container max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
            <p className="text-zinc-500">Acompanhe seu progresso e conquistas</p>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-bold text-3xl ring-4 ring-emerald-500/30">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{user.name || 'Usuário'}</h2>

              <div className="space-y-2 text-sm text-zinc-400">
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {user.role === 'admin' && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Shield className="w-4 h-4" />
                    <span className="font-semibold">Administrador</span>
                  </div>
                )}
              </div>
            </div>

            {/* Streak Badge */}
            {userId && (
              <div>
                <StreakBadge userId={userId} />
              </div>
            )}
          </div>
        </div>

        {/* FP Dashboard */}
        {userId && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              Fitness Points (FP)
            </h2>
            <FPDashboard userId={userId} />
          </div>
        )}

        {/* Badges Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Badges Conquistados
          </h2>

          {loadingBadges ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : badges.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
              <Award className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">Nenhum badge conquistado ainda</p>
              <p className="text-sm text-zinc-600 mt-2">Continue participando para ganhar badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition group"
                >
                  {/* Badge Icon with Rarity Border */}
                  <div className="relative mb-3">
                    <div
                      className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} p-1`}
                    >
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                        <span className="text-4xl">{badge.icon}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge Name */}
                  <h3 className="text-sm font-bold text-white text-center mb-1 group-hover:text-emerald-400 transition">
                    {badge.name}
                  </h3>

                  {/* Badge Description */}
                  <p className="text-xs text-zinc-500 text-center line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Earned Date */}
                  <p className="text-xs text-zinc-600 text-center mt-2">
                    {new Date(badge.earnedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rankings Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            Classificação
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* FP Total Ranking */}
            <Leaderboard type="fp_total" limit={10} userId={userId} />

            {/* Streak Ranking */}
            <Leaderboard type="streak" limit={10} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
