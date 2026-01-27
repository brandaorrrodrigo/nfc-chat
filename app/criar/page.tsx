'use client';

/**
 * PÁGINA: Criar Nova Comunidade (Arena)
 *
 * Visual: Formulário cyberpunk para criação de comunidade
 * Estética: Dark mode + Verde Neon
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap, Lock, Globe, Users } from 'lucide-react';

// ========================================
// PÁGINA PRINCIPAL
// ========================================

export default function CriarComunidadePage() {
  const router = useRouter();
  const [criando, setCriando] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao_curta: '',
    descricao_completa: '',
    visibilidade: 'publica' as 'publica' | 'privada' | 'somente_convidados',
    tags: '',
  });

  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCriando(true);
    // MVP: Simula envio
    setTimeout(() => {
      setCriando(false);
      setEnviado(true);
    }, 1000);
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-black">
        <div
          className="fixed inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(#00ff88 1px, transparent 1px),
              linear-gradient(90deg, #00ff88 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-[#00ff88]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">
              Arena Criada!
            </h1>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              <span className="text-yellow-400 font-mono">[MVP DEMO]</span> Em produção, sua arena seria ativada.
              Por enquanto, estamos em fase de demonstração.
            </p>
            <Link
              href="/comunidades"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Arenas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#00ff88 1px, transparent 1px),
            linear-gradient(90deg, #00ff88 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Container Principal */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Botão Voltar */}
        <Link
          href="/comunidades"
          className={`
            inline-flex items-center gap-2 mb-8
            text-sm text-zinc-500 hover:text-[#00ff88]
            transition-colors duration-200
            group
          `}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Arenas</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Sistema / Nova Arena
            </span>
          </div>

          <h1
            className={`
              text-4xl sm:text-5xl
              font-black text-white mb-3
              tracking-tight
            `}
            style={{
              textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
            }}
          >
            CRIAR NOVA ARENA
          </h1>

          <p className="text-base text-zinc-400 font-light">
            Estabeleça um novo protocolo de operação para reunir agentes com interesses em comum.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Título da Arena *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Protocolo Lipedema"
              required
              className={`
                w-full px-4 py-3
                bg-zinc-900/50 backdrop-blur-sm
                border border-zinc-800
                rounded-lg
                text-white placeholder-zinc-600
                focus:outline-none focus:border-[#00ff88]/50
                transition-colors duration-200
              `}
            />
          </div>

          {/* Descrição Curta */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Descrição Curta
              <span className="text-zinc-500 font-normal ml-2">(máx 280 caracteres)</span>
            </label>
            <input
              type="text"
              value={formData.descricao_curta}
              onChange={(e) => setFormData({ ...formData, descricao_curta: e.target.value })}
              placeholder="Resumo em uma linha"
              maxLength={280}
              className={`
                w-full px-4 py-3
                bg-zinc-900/50 backdrop-blur-sm
                border border-zinc-800
                rounded-lg
                text-white placeholder-zinc-600
                focus:outline-none focus:border-[#00ff88]/50
                transition-colors duration-200
              `}
            />
            <p className="text-xs text-zinc-600 mt-1 text-right">
              {formData.descricao_curta.length}/280
            </p>
          </div>

          {/* Descrição Completa */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Descrição Completa
            </label>
            <textarea
              value={formData.descricao_completa}
              onChange={(e) => setFormData({ ...formData, descricao_completa: e.target.value })}
              placeholder="Descreva os objetivos e foco da comunidade..."
              rows={5}
              className={`
                w-full px-4 py-3
                bg-zinc-900/50 backdrop-blur-sm
                border border-zinc-800
                rounded-lg
                text-white placeholder-zinc-600
                resize-none
                focus:outline-none focus:border-[#00ff88]/50
                transition-colors duration-200
              `}
            />
          </div>

          {/* Visibilidade */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Nível de Acesso *
            </label>

            <div className="space-y-3">
              {/* Pública */}
              <label
                className={`
                  flex items-start gap-3 p-4
                  bg-zinc-900/50 backdrop-blur-sm
                  border rounded-lg
                  cursor-pointer
                  transition-all duration-200
                  ${
                    formData.visibilidade === 'publica'
                      ? 'border-[#00ff88] bg-[#00ff88]/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }
                `}
              >
                <input
                  type="radio"
                  name="visibilidade"
                  value="publica"
                  checked={formData.visibilidade === 'publica'}
                  onChange={(e) =>
                    setFormData({ ...formData, visibilidade: e.target.value as any })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-[#00ff88]" />
                    <span className="font-semibold text-white">Pública</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Qualquer agente pode visualizar e participar
                  </p>
                </div>
              </label>

              {/* Privada */}
              <label
                className={`
                  flex items-start gap-3 p-4
                  bg-zinc-900/50 backdrop-blur-sm
                  border rounded-lg
                  cursor-pointer
                  transition-all duration-200
                  ${
                    formData.visibilidade === 'privada'
                      ? 'border-[#00ff88] bg-[#00ff88]/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }
                `}
              >
                <input
                  type="radio"
                  name="visibilidade"
                  value="privada"
                  checked={formData.visibilidade === 'privada'}
                  onChange={(e) =>
                    setFormData({ ...formData, visibilidade: e.target.value as any })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-white">Privada</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Apenas membros aprovados podem acessar
                  </p>
                </div>
              </label>

              {/* Somente Convidados */}
              <label
                className={`
                  flex items-start gap-3 p-4
                  bg-zinc-900/50 backdrop-blur-sm
                  border rounded-lg
                  cursor-pointer
                  transition-all duration-200
                  ${
                    formData.visibilidade === 'somente_convidados'
                      ? 'border-[#00ff88] bg-[#00ff88]/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }
                `}
              >
                <input
                  type="radio"
                  name="visibilidade"
                  value="somente_convidados"
                  checked={formData.visibilidade === 'somente_convidados'}
                  onChange={(e) =>
                    setFormData({ ...formData, visibilidade: e.target.value as any })
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-white">Somente Convidados</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Acesso exclusivo mediante convite direto
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tags
              <span className="text-zinc-500 font-normal ml-2">(separadas por vírgula)</span>
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: nutrição, treino, lipedema"
              className={`
                w-full px-4 py-3
                bg-zinc-900/50 backdrop-blur-sm
                border border-zinc-800
                rounded-lg
                text-white placeholder-zinc-600
                focus:outline-none focus:border-[#00ff88]/50
                transition-colors duration-200
              `}
            />
          </div>

          {/* MVP Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400 font-mono">
              [MVP DEMO] Este formulário é uma demonstração. Em produção, sua arena seria criada e ativada.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/comunidades')}
              className={`
                flex-1 px-6 py-3
                bg-zinc-900 border border-zinc-800
                text-white font-semibold
                rounded-lg
                hover:border-zinc-700
                transition-colors duration-200
              `}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!formData.titulo || criando}
              className={`
                flex-1 px-6 py-3
                bg-[#00ff88] hover:bg-[#00ff88]/80
                disabled:bg-zinc-800 disabled:text-zinc-600
                text-black font-bold
                rounded-lg
                shadow-[0_0_20px_rgba(0,255,136,0.3)]
                hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]
                transition-all duration-200
                disabled:cursor-not-allowed disabled:shadow-none
                flex items-center justify-center gap-2
              `}
            >
              <Zap className="w-4 h-4" />
              <span>{criando ? 'Criando Arena...' : 'Ativar Arena'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
