'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MetricCard } from '@/components/dashboard/MetricCard'

// Dynamic import para evitar problemas de SSR
const GPUMonitor = dynamic(
  () => import('@/components/dashboard/GPUMonitor').then(mod => mod.GPUMonitor),
  {
    ssr: false,
    loading: () => (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">🎮 Monitoramento de GPU</h3>
        <div className="text-center py-8 text-gray-400">Carregando...</div>
      </div>
    )
  }
)

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    usersOnline: 0,
    messagesPerMinute: 0,
    aiResponseRate: 0,
    fpIssuedToday: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchMetrics() {
    try {
      const res = await fetch('/api/dashboard/metrics')
      const data = await res.json()
      setMetrics(data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando métricas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">
          Dashboard Real-Time
        </h1>
        <p className="text-gray-400">
          Visão geral do ecossistema NutriFitCoach
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Usuários Online"
          value={metrics.usersOnline}
          icon="👥"
          color="cyan"
          trend="+12%"
        />

        <MetricCard
          title="Mensagens/Min"
          value={metrics.messagesPerMinute}
          icon="💬"
          color="purple"
          trend="+5%"
        />

        <MetricCard
          title="Taxa Resposta IA"
          value={`${metrics.aiResponseRate}%`}
          icon="🤖"
          color="green"
          trend="-3%"
        />

        <MetricCard
          title="FP Emitidos Hoje"
          value={metrics.fpIssuedToday}
          icon="🪙"
          color="yellow"
          trend="+18%"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Ações Rápidas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/dashboard/arenas/create"
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors text-center group"
          >
            <div className="text-3xl mb-2">➕</div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-white">Nova Arena</p>
          </a>

          <a
            href="/dashboard/moderation"
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors text-center group"
          >
            <div className="text-3xl mb-2">🛡️</div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-white">Moderação</p>
          </a>

          <a
            href="/dashboard/ai-control"
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors text-center group"
          >
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-white">Controle IA</p>
          </a>

          <a
            href="/dashboard/analytics"
            className="p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors text-center group"
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-medium text-gray-300 group-hover:text-white">Analytics</p>
          </a>
        </div>
      </div>

      {/* GPU Monitoring */}
      <GPUMonitor />

      {/* System Status */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Status do Sistema
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Database</span>
            </div>
            <span className="text-xs text-green-400 font-medium">Operacional</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Redis Cache</span>
            </div>
            <span className="text-xs text-green-400 font-medium">Operacional</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Ollama (Llama 3.1 70B)</span>
            </div>
            <span className="text-xs text-green-400 font-medium">Local - GPU 0</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">ChromaDB (RAG)</span>
            </div>
            <span className="text-xs text-green-400 font-medium">Local - Docker</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">LLaVA Vision</span>
            </div>
            <span className="text-xs text-green-400 font-medium">Local - GPU 2</span>
          </div>
        </div>
      </div>
    </div>
  )
}
