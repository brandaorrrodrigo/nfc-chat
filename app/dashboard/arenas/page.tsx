'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

interface Arena {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  status: string
  totalPosts: number
  dailyActiveUsers: number
  isActive: boolean
}

export default function ArenasPage() {
  const [arenas, setArenas] = useState<Arena[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchArenas()
  }, [])

  async function fetchArenas() {
    try {
      const res = await fetch('/api/arenas')
      const data = await res.json()
      setArenas(data)
    } catch (error) {
      console.error('Error fetching arenas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArenas = arenas.filter(arena =>
    arena.name.toLowerCase().includes(search.toLowerCase()) ||
    arena.slug.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando arenas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Arenas</h1>
          <p className="text-gray-400">Gerencie todas as comunidades</p>
        </div>

        <Link
          href="/dashboard/arenas/create"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.6)] transition-all"
        >
          <Plus className="w-5 h-5" />
          Nova Arena
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar arenas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-black text-white">{arenas.length}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Ativas</p>
          <p className="text-2xl font-black text-green-400">
            {arenas.filter(a => a.isActive).length}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">HOT 🔥</p>
          <p className="text-2xl font-black text-orange-400">
            {arenas.filter(a => a.status === 'HOT').length}
          </p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">COLD ❄️</p>
          <p className="text-2xl font-black text-blue-400">
            {arenas.filter(a => a.status === 'COLD').length}
          </p>
        </div>
      </div>

      {/* Arenas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArenas.map((arena) => (
          <Link
            key={arena.id}
            href={`/arenas/${arena.id}`}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6 hover:border-[#00ff88]/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl`} style={{ backgroundColor: arena.color }}>
                  {arena.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-[#00ff88] transition-colors">
                    {arena.name}
                  </h3>
                  <p className="text-xs text-gray-500">/{arena.slug}</p>
                </div>
              </div>

              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                arena.status === 'HOT' ? 'bg-orange-500/20 text-orange-400' :
                arena.status === 'WARM' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {arena.status}
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {arena.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{arena.totalPosts} posts</span>
              <span>{arena.dailyActiveUsers} ativos/dia</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
