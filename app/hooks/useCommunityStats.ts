import { useState, useEffect } from 'react'

export interface CommunityStats {
  totalArenas: number
  totalPosts: number
  totalComments: number
  totalUsers: number
  onlineNow: number
  recentActivity24h: number
  updatedAt: string
}

/**
 * Hook para buscar estatísticas GLOBAIS da comunidade
 * Atualiza a cada 30 segundos automaticamente
 */
export function useCommunityStats() {
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/community/stats')

        if (!response.ok) {
          throw new Error('Failed to fetch community stats')
        }

        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error('[useCommunityStats] Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    // Buscar imediatamente
    fetchStats()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error }
}
