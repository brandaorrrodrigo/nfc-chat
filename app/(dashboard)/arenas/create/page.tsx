'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateArenaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '🎯',
    color: '#6366f1',
    category: 'nutrition',
    aiPersona: 'BALANCED',
    aiInterventionRate: 50,
    aiFrustrationThreshold: 120,
    aiCooldown: 5
  })

  function handleChange(e: any) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-gerar slug
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/arenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push('/arenas')
      } else {
        alert('Erro ao criar arena')
      }
    } catch (error) {
      console.error('Error creating arena:', error)
      alert('Erro ao criar arena')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/arenas"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <h1 className="text-3xl font-black text-white mb-2">Nova Arena</h1>
        <p className="text-gray-400">Criar uma nova comunidade</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Informações Básicas</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome da Arena
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                placeholder="Ex: Receitas Fit"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono"
                placeholder="receitas-fit"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                placeholder="Descreva o propósito desta arena..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Emoji/Ícone
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                maxLength={2}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-2xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cor
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-12 bg-slate-700 border border-slate-600 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Configurações da IA */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Configurações da IA</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Persona
              </label>
              <select
                name="aiPersona"
                value={formData.aiPersona}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="BALANCED">Equilibrada</option>
                <option value="SCIENTIFIC">Científica</option>
                <option value="MOTIVATIONAL">Motivacional</option>
                <option value="SUSTAINING">Sustentadora</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Taxa de Intervenção: {formData.aiInterventionRate}%
              </label>
              <input
                type="range"
                name="aiInterventionRate"
                min="0"
                max="100"
                value={formData.aiInterventionRate}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Threshold de Frustração: {formData.aiFrustrationThreshold} min
              </label>
              <input
                type="range"
                name="aiFrustrationThreshold"
                min="30"
                max="480"
                step="30"
                value={formData.aiFrustrationThreshold}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link
            href="/arenas"
            className="flex-1 px-6 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all text-center"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] transition-all disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Arena'}
          </button>
        </div>
      </form>
    </div>
  )
}
