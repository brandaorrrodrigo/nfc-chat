'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Check, X, Edit } from 'lucide-react'

interface QueueItem {
  id: string
  userId: string
  postId?: string
  commentId?: string
  reason: string
  flagScore: number
  status: string
  detectedBy: string
  createdAt: string
}

export default function ModerationPage() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('PENDING')

  useEffect(() => {
    fetchQueue()
  }, [filter])

  async function fetchQueue() {
    try {
      const res = await fetch(`/api/moderation/queue?status=${filter}`)
      const data = await res.json()
      setQueue(data)
    } catch (error) {
      console.error('Error fetching moderation queue:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(itemId: string, action: 'APPROVE' | 'REJECT' | 'EDIT') {
    try {
      await fetch('/api/moderation/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action })
      })

      fetchQueue()
    } catch (error) {
      console.error('Error handling moderation action:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando fila...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            🛡️ Moderação
          </h1>
          <p className="text-gray-400">
            Fila de conteúdo para revisão
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'PENDING'
                ? 'bg-[#00ff88] text-black'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Pendentes ({queue.filter(i => i.status === 'PENDING').length})
          </button>

          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'APPROVED'
                ? 'bg-[#00ff88] text-black'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Aprovados
          </button>

          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'REJECTED'
                ? 'bg-[#00ff88] text-black'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Rejeitados
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Na Fila</p>
          <p className="text-2xl font-black text-yellow-400">
            {queue.filter(i => i.status === 'PENDING').length}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Aprovados Hoje</p>
          <p className="text-2xl font-black text-green-400">45</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Rejeitados Hoje</p>
          <p className="text-2xl font-black text-red-400">12</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Taxa de Spam</p>
          <p className="text-2xl font-black text-purple-400">3.2%</p>
        </div>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-12 text-center">
            <p className="text-gray-400">Nenhum item na fila</p>
          </div>
        ) : (
          queue.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    item.flagScore >= 80 ? 'bg-red-500/20' :
                    item.flagScore >= 50 ? 'bg-yellow-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    <AlertTriangle className={`w-6 h-6 ${
                      item.flagScore >= 80 ? 'text-red-400' :
                      item.flagScore >= 50 ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">
                        {item.reason}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.flagScore >= 80 ? 'bg-red-500/20 text-red-400' :
                        item.flagScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        Score: {item.flagScore}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400">
                      Detectado por: {item.detectedBy} •{' '}
                      {new Date(item.createdAt).toLocaleString('pt-BR')}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      User ID: {item.userId} •{' '}
                      {item.postId ? `Post: ${item.postId}` : `Comment: ${item.commentId}`}
                    </p>
                  </div>
                </div>

                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(item.id, 'APPROVE')}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                      title="Aprovar"
                    >
                      <Check className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleAction(item.id, 'EDIT')}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleAction(item.id, 'REJECT')}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      title="Rejeitar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
