'use client'

import { useSession, signOut } from 'next-auth/react'
import { Bell, LogOut, User } from 'lucide-react'

export function TopBar() {
  const { data: session } = useSession()

  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-bold text-white">
          Bem-vindo, {session?.user?.name || 'Admin'}
        </h2>
        <p className="text-sm text-gray-400">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: '2-digit', 
            month: 'long' 
          })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{session?.user?.name}</p>
            <p className="text-xs text-gray-400">{session?.user?.role}</p>
          </div>

          <button
            onClick={() => signOut()}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
