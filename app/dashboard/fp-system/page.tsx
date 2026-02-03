'use client'

import { useState, useEffect } from 'react'

interface FPRule {
  id: string
  action: string
  fpValue: number
  dailyCap: number | null
  cooldown: number | null
  isActive: boolean
}

export default function FPSystemPage() {
  const [rules, setRules] = useState<FPRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  async function fetchRules() {
    try {
      const res = await fetch('/api/fp/rules')
      const data = await res.json()
      setRules(data)
    } catch (error) {
      console.error('Error fetching rules:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateRule(ruleId: string, updates: Partial<FPRule>) {
    try {
      await fetch(`/api/fp/rules/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      setRules(prev => prev.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ))
    } catch (error) {
      console.error('Error updating rule:', error)
    }
  }

  async function createRule() {
    const action = prompt('Nome da ação (ex: comment_helpful):')
    if (!action) return

    try {
      const res = await fetch('/api/fp/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          fpValue: 10,
          dailyCap: null,
          cooldown: null,
          isActive: true
        })
      })

      if (res.ok) {
        fetchRules()
      }
    } catch (error) {
      console.error('Error creating rule:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando regras...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            🪙 Sistema de Fitness Points
          </h1>
          <p className="text-gray-400">
            Configuração da economia de mérito
          </p>
        </div>

        <button
          onClick={createRule}
          className="px-6 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] transition-all"
        >
          + Nova Regra
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <p className="text-sm text-gray-400">FP Emitidos Hoje</p>
          <p className="text-3xl font-black text-[#00ff88] mt-2">1,245</p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <p className="text-sm text-gray-400">FP em Circulação</p>
          <p className="text-3xl font-black text-white mt-2">45,678</p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <p className="text-sm text-gray-400">Taxa de Conversão</p>
          <p className="text-3xl font-black text-purple-400 mt-2">23%</p>
        </div>
      </div>

      {/* Tabela de Regras */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Regras de Pontuação
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-400">Ação</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-400">FP</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-400">Cap Diário</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-400">Cooldown</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-400">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-white font-medium">{rule.action}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={rule.fpValue}
                      onChange={(e) => updateRule(rule.id, { fpValue: parseInt(e.target.value) })}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-center"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={rule.dailyCap || ''}
                      onChange={(e) => updateRule(rule.id, { dailyCap: parseInt(e.target.value) || null })}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-center"
                      placeholder="∞"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={rule.cooldown || ''}
                      onChange={(e) => updateRule(rule.id, { cooldown: parseInt(e.target.value) || null })}
                      className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rule.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {rule.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateRule(rule.id, { isActive: !rule.isActive })}
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      {rule.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversão FP → Desconto */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Tabela de Conversão (FP → Desconto APP)
        </h2>

        <div className="grid grid-cols-5 gap-4">
          {[
            { fp: 150, discount: 5 },
            { fp: 300, discount: 10 },
            { fp: 500, discount: 15 },
            { fp: 750, discount: 20 },
            { fp: 1000, discount: 25 }
          ].map((tier) => (
            <div key={tier.fp} className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-center">
              <p className="text-2xl font-black text-[#00ff88]">{tier.fp} FP</p>
              <p className="text-sm text-gray-400 mt-1">=</p>
              <p className="text-3xl font-black text-white mt-1">{tier.discount}%</p>
              <p className="text-xs text-gray-500 mt-1">desconto</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
