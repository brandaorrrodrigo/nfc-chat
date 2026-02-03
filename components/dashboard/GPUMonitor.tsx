'use client'

import { useEffect, useState } from 'react'
import { Activity, Cpu, ThermometerSun } from 'lucide-react'

interface GPUInfo {
  id: number
  name: string
  utilization: number
  temperature: number
  memoryUsed: number
  memoryTotal: number
  memoryUtilization: number
}

export function GPUMonitor() {
  const [gpus, setGpus] = useState<GPUInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGPUStats()

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchGPUStats, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchGPUStats() {
    try {
      const res = await fetch('/api/hardware/gpu')
      const data = await res.json()

      if (data.success) {
        setGpus(data.gpus)
        setError(null)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Erro ao buscar stats de GPU')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          🎮 Monitoramento de GPU
        </h3>
        <div className="text-center py-8 text-gray-400">
          Carregando...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          🎮 Monitoramento de GPU
        </h3>
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
          <p className="text-xs text-gray-500 mt-2">
            Certifique-se de que nvidia-smi está disponível
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
      <h3 className="text-lg font-bold text-white mb-4">
        🎮 Monitoramento de GPU
      </h3>

      <div className="space-y-4">
        {gpus.map((gpu) => (
          <div key={gpu.id} className="bg-slate-700/30 rounded-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-white text-sm">
                  GPU {gpu.id}: {gpu.name}
                </h4>
                <p className="text-xs text-gray-400">
                  RTX 3090 (24GB)
                </p>
              </div>

              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                gpu.utilization > 80 ? 'bg-red-500/20 text-red-400' :
                gpu.utilization > 50 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {gpu.utilization > 80 ? '🔥 High' :
                 gpu.utilization > 50 ? '⚡ Active' :
                 '✅ Idle'}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* GPU Utilization */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-gray-400">GPU</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">
                    {gpu.utilization}
                  </span>
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-600 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      gpu.utilization > 80 ? 'bg-red-500' :
                      gpu.utilization > 50 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${gpu.utilization}%` }}
                  />
                </div>
              </div>

              {/* Temperature */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <ThermometerSun className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-gray-400">Temp</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">
                    {gpu.temperature}
                  </span>
                  <span className="text-xs text-gray-400">°C</span>
                </div>
                <div className="w-full h-1.5 bg-slate-600 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      gpu.temperature > 80 ? 'bg-red-500' :
                      gpu.temperature > 70 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${(gpu.temperature / 100) * 100}%` }}
                  />
                </div>
              </div>

              {/* Memory */}
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span className="text-xs text-gray-400">VRAM</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">
                    {gpu.memoryUtilization}
                  </span>
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {(gpu.memoryUsed / 1024).toFixed(1)} / {(gpu.memoryTotal / 1024).toFixed(0)} GB
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gpus.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          Nenhuma GPU detectada
        </div>
      )}
    </div>
  )
}
