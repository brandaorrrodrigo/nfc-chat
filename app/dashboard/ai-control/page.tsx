'use client'

import { useState, useEffect } from 'react'

export default function AIControlPage() {
  const [selectedArena, setSelectedArena] = useState<string>('global')
  const [arenas, setArenas] = useState<any[]>([])
  const [shadowMode, setShadowMode] = useState(true)
  const [aiSettings, setAISettings] = useState({
    persona: 'BALANCED',
    interventionRate: 50,
    frustrationThreshold: 120,
    cooldown: 5
  })

  useEffect(() => {
    fetchArenas()
  }, [])

  async function fetchArenas() {
    const res = await fetch('/api/arenas')
    const data = await res.json()
    setArenas(data)
  }

  async function saveSettings() {
    await fetch('/api/ai/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arenaId: selectedArena,
        settings: aiSettings
      })
    })

    alert('✅ Configurações salvas!')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">
          🤖 Controle da IA Facilitadora
        </h1>
        <p className="text-gray-400">
          Ajuste fino do comportamento da IA sem necessidade de deploy
        </p>
      </div>

      {/* Seletor de Arena */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <label className="text-sm text-gray-400 mb-2 block">
          Configurar IA para:
        </label>
        <select
          value={selectedArena}
          onChange={(e) => setSelectedArena(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
        >
          <option value="global">🌐 Global (todas as arenas)</option>
          {arenas.map(arena => (
            <option key={arena.id} value={arena.id}>
              {arena.icon} {arena.name}
            </option>
          ))}
        </select>
      </div>

      {/* Persona */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Persona da IA</h2>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'SCIENTIFIC', label: 'Científica', desc: 'Citações e evidências', emoji: '🔬' },
            { value: 'MOTIVATIONAL', label: 'Motivacional', desc: 'Acolhedora e empática', emoji: '💪' },
            { value: 'SUSTAINING', label: 'Sustentadora', desc: 'Mantém conversas ativas', emoji: '🤝' },
            { value: 'BALANCED', label: 'Equilibrada', desc: 'Mix de todas', emoji: '⚖️' }
          ].map(persona => (
            <button
              key={persona.value}
              onClick={() => setAISettings(prev => ({ ...prev, persona: persona.value }))}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                aiSettings.persona === persona.value
                  ? 'border-[#00ff88] bg-[#00ff88]/10'
                  : 'border-slate-700 bg-slate-700/30 hover:border-slate-600'
              }`}
            >
              <div className="text-3xl mb-2">{persona.emoji}</div>
              <div className="font-bold text-white mb-1">{persona.label}</div>
              <div className="text-xs text-gray-400">{persona.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-6">
        <h2 className="text-xl font-bold text-white">Sensibilidade de Intervenção</h2>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Taxa de Intervenção
            </label>
            <span className="text-sm font-bold text-[#00ff88]">
              {aiSettings.interventionRate}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={aiSettings.interventionRate}
            onChange={(e) => setAISettings(prev => ({ ...prev, interventionRate: parseInt(e.target.value) }))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Probabilidade da IA responder quando detecta oportunidade
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Threshold de Frustração
            </label>
            <span className="text-sm font-bold text-[#00ff88]">
              {aiSettings.frustrationThreshold} min
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="480"
            step="30"
            value={aiSettings.frustrationThreshold}
            onChange={(e) => setAISettings(prev => ({ ...prev, frustrationThreshold: parseInt(e.target.value) }))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tempo sem resposta antes da IA intervir
          </p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              Cooldown entre Respostas
            </label>
            <span className="text-sm font-bold text-[#00ff88]">
              {aiSettings.cooldown} min
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={aiSettings.cooldown}
            onChange={(e) => setAISettings(prev => ({ ...prev, cooldown: parseInt(e.target.value) }))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Intervalo mínimo entre respostas da IA
          </p>
        </div>
      </div>

      {/* Shadow Mode */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Modo Shadow (Preview)</h2>
            <p className="text-sm text-gray-400 mt-1">
              Respostas da IA passam por aprovação manual antes de publicar
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shadowMode}
              onChange={(e) => setShadowMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-slate-700 peer-focus:ring-4 peer-focus:ring-[#00ff88]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00ff88]"></div>
          </label>
        </div>

        {shadowMode && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-400">
              ⚠️ Modo Shadow ATIVO - Todas as respostas da IA aguardam aprovação manual
            </p>
          </div>
        )}
      </div>

      {/* Botão Salvar */}
      <button
        onClick={saveSettings}
        className="w-full px-6 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] transition-all"
      >
        Salvar Configurações
      </button>
    </div>
  )
}
