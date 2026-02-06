'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Zap, RefreshCw } from 'lucide-react'

interface FPStats {
  balance: number
  lifetime: number
  spent: number
  subscription: {
    tier: string
    status: string
  }
  quotas: {
    free_baseline_used: boolean
  }
}

export function FPBalance() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<FPStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.user?.email) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/fp/balance')
        if (!response.ok) throw new Error('Failed to fetch FP balance')

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar saldo')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [session?.user?.email])

  const handleRefresh = async () => {
    if (!session?.user?.email) return

    try {
      setLoading(true)
      const response = await fetch('/api/fp/balance')
      if (!response.ok) throw new Error('Failed to fetch FP balance')
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recarregar saldo')
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Faça login para ver seu saldo de FP</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-800">Seu Saldo FP</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-1 hover:bg-amber-100 rounded transition-colors disabled:opacity-50"
          title="Recarregar saldo"
        >
          <RefreshCw className={`w-4 h-4 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !stats ? (
        <div className="space-y-2">
          <div className="h-8 bg-amber-200 rounded animate-pulse"></div>
          <div className="h-4 bg-amber-100 rounded animate-pulse"></div>
        </div>
      ) : stats ? (
        <div className="space-y-3">
          {/* Saldo Principal */}
          <div className="bg-white rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-gray-600 mb-1">Saldo Disponível</p>
            <p className="text-3xl font-bold text-amber-600 flex items-baseline gap-1">
              {stats.balance}
              <span className="text-lg">FP</span>
            </p>
          </div>

          {/* Lifetime */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white rounded p-2 border border-amber-100">
              <p className="text-gray-600 text-xs">Ganhos (Lifetime)</p>
              <p className="font-semibold text-gray-800">{stats.lifetime}</p>
            </div>
            <div className="bg-white rounded p-2 border border-amber-100">
              <p className="text-gray-600 text-xs">Gastos</p>
              <p className="font-semibold text-gray-800">{stats.spent}</p>
            </div>
          </div>

          {/* Status de Quota Grátis */}
          <div className="bg-white rounded p-2 border border-amber-100 text-xs">
            <p className="text-gray-600 mb-1">Status Baseline</p>
            <p className="font-semibold text-gray-800">
              {stats.quotas.free_baseline_used ? (
                <span className="text-orange-600">✓ Já usado (próximas custam FP)</span>
              ) : (
                <span className="text-green-600">✓ Disponível (primeira é grátis!)</span>
              )}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
