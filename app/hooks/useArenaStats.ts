import { useState, useEffect } from 'react'

export interface ArenaStats {
  arenaId: string
  name: string
  slug: string
  totalPosts: number
  totalComments: number
  totalMembers: number
  onlineNow: number
  recentPosts24h: number
  recentComments24h: number
  updatedAt: string
}

/**
 * Hook para buscar estatísticas REAIS de uma arena específica
 * - Atualiza a cada 15 segundos
 * - Registra visita automaticamente
 */
export function useArenaStats(slug: string | null) {
  const [stats, setStats] = useState<ArenaStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let mounted = true

    async function fetchStats() {
      try {
        const response = await fetch(`/api/community/arena/${slug}/stats`)

        if (!response.ok) {
          throw new Error('Failed to fetch arena stats')
        }

        const data = await response.json()

        if (mounted) {
          setStats(data)
          setError(null)
        }
      } catch (err) {
        console.error('[useArenaStats] Error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    async function registerVisit() {
      try {
        await fetch(`/api/community/arena/${slug}/visit`, {
          method: 'POST',
        })
      } catch (err) {
        // Silenciar erro (não é crítico)
        console.warn('[useArenaStats] Failed to register visit:', err)
      }
    }

    // Registrar visita na montagem
    registerVisit()

    // Buscar stats imediatamente
    fetchStats()

    // Atualizar a cada 15 segundos
    const interval = setInterval(fetchStats, 15000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [slug])

  return { stats, loading, error }
}
