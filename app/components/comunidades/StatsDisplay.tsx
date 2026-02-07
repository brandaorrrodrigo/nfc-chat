'use client'

import React from 'react'
import { Users, MessageCircle, Eye, Activity, Loader2 } from 'lucide-react'
import type { CommunityStats } from '@/app/hooks/useCommunityStats'
import type { ArenaStats } from '@/app/hooks/useArenaStats'

interface StatsDisplayProps {
  stats: CommunityStats | ArenaStats | null
  loading?: boolean
  variant?: 'compact' | 'full'
  showOnline?: boolean
  className?: string
}

/**
 * Componente reutilizável para exibir estatísticas REAIS
 * - variant='compact': Mostra apenas números essenciais (para cards)
 * - variant='full': Mostra todos os detalhes (para páginas)
 * - showOnline: Exibe contador de "online agora"
 */
export function StatsDisplay({
  stats,
  loading = false,
  variant = 'compact',
  showOnline = true,
  className = ''
}: StatsDisplayProps) {
  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-zinc-400 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Carregando...</span>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  // Detectar se é ArenaStats ou CommunityStats
  const isArenaStats = 'arenaId' in stats
  const isCommunityStats = 'totalArenas' in stats

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 text-sm ${className}`}>
        {/* Online Now */}
        {showOnline && stats.onlineNow > 0 && (
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-4 h-4" />
            <span className="font-medium">{stats.onlineNow}</span>
            <span className="text-zinc-400">online</span>
          </div>
        )}

        {/* Posts */}
        {isArenaStats && (
          <div className="flex items-center gap-1.5 text-zinc-300">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{stats.totalPosts}</span>
            <span className="text-zinc-400">posts</span>
          </div>
        )}

        {/* Members (apenas arena) */}
        {isArenaStats && stats.totalMembers > 0 && (
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Users className="w-4 h-4" />
            <span className="font-medium">{stats.totalMembers}</span>
          </div>
        )}
      </div>
    )
  }

  // FULL VARIANT - Exibição detalhada
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {/* Online Now */}
      {showOnline && (
        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Online Agora</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.onlineNow}
          </div>
        </div>
      )}

      {/* Total Posts */}
      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Posts</span>
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.totalPosts}
        </div>
        {isArenaStats && stats.recentPosts24h > 0 && (
          <div className="text-xs text-zinc-400 mt-1">
            +{stats.recentPosts24h} hoje
          </div>
        )}
      </div>

      {/* Total Comments */}
      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <Eye className="w-5 h-5" />
          <span className="text-sm font-medium">Comentários</span>
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.totalComments}
        </div>
        {isArenaStats && stats.recentComments24h > 0 && (
          <div className="text-xs text-zinc-400 mt-1">
            +{stats.recentComments24h} hoje
          </div>
        )}
      </div>

      {/* Members/Users */}
      <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
        <div className="flex items-center gap-2 text-orange-400 mb-2">
          <Users className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isCommunityStats ? 'Usuários' : 'Membros'}
          </span>
        </div>
        <div className="text-2xl font-bold text-white">
          {isCommunityStats ? stats.totalUsers : (stats as ArenaStats).totalMembers}
        </div>
      </div>

      {/* Arenas (apenas community stats) */}
      {isCommunityStats && (
        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Arenas</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.totalArenas}
          </div>
        </div>
      )}
    </div>
  )
}
