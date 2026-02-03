'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, UserPlus } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  fpTotal: number
  fpAvailable: number
  isBanned: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Usuários</h1>
          <p className="text-gray-400">Gerencie todos os membros</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-black text-white">{users.length}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Admins</p>
          <p className="text-2xl font-black text-purple-400">
            {users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">Banidos</p>
          <p className="text-2xl font-black text-red-400">
            {users.filter(u => u.isBanned).length}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-sm text-gray-400">FP Médio</p>
          <p className="text-2xl font-black text-yellow-400">
            {Math.round(users.reduce((acc, u) => acc + u.fpTotal, 0) / users.length || 0)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Usuário</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">FP Total</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">FP Disponível</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Cadastro</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-700/50 hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'SUPER_ADMIN' ? 'bg-red-500/20 text-red-400' :
                      user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                      user.role === 'MODERATOR' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white font-mono">{user.fpTotal}</td>
                  <td className="px-6 py-4 text-yellow-400 font-mono">{user.fpAvailable}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isBanned
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {user.isBanned ? 'Banido' : 'Ativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-sm text-[#00ff88] hover:text-[#00d9ff]"
                    >
                      Ver Dossiê
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
