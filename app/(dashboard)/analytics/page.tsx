'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, MessageSquare } from 'lucide-react'

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/analytics/overview')
      const data = await res.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">
          📊 Analytics
        </h1>
        <p className="text-gray-400">
          Relatórios e métricas do ecossistema
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <p className="text-sm text-cyan-400 font-medium">DAU (Hoje)</p>
          </div>
          <p className="text-3xl font-black text-white">1,234</p>
          <p className="text-sm text-green-400 mt-1">+12% vs. ontem</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-purple-400 font-medium">Posts (7d)</p>
          </div>
          <p className="text-3xl font-black text-white">5,678</p>
          <p className="text-sm text-green-400 mt-1">+8% vs. semana anterior</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-sm text-green-400 font-medium">Engajamento</p>
          </div>
          <p className="text-3xl font-black text-white">87%</p>
          <p className="text-sm text-green-400 mt-1">+3% vs. mês anterior</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <p className="text-sm text-yellow-400 font-medium">FP Circulando</p>
          </div>
          <p className="text-3xl font-black text-white">45.6K</p>
          <p className="text-sm text-green-400 mt-1">+15% vs. mês anterior</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Usuários Ativos (30 dias)
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Gráfico de linha aqui (Recharts)
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Posts por Arena
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Gráfico de barras aqui (Recharts)
          </div>
        </div>
      </div>

      {/* Top Arenas */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Top 10 Arenas (por engajamento)
        </h3>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍽️</span>
                <div>
                  <p className="font-medium text-white">Arena #{i}</p>
                  <p className="text-xs text-gray-400">1,234 posts • 567 usuários ativos</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-[#00ff88]">87% engajamento</p>
                <p className="text-xs text-gray-400">+5% vs. semana anterior</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
