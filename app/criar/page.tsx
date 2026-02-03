'use client';

/**
 * PÁGINA: Criar Nova Comunidade (Arena)
 *
 * Visual: Formulário cyberpunk para criação de comunidade
 * Estética: Dark mode + Verde Neon
 * Funcionalidades:
 *  - Busca arenas similares ao digitar título (debounce 500ms)
 *  - Campo de categoria obrigatório
 *  - Submissão real via POST /api/arenas
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Zap,
  Lock,
  Globe,
  Users,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  Loader2,
  Search,
} from 'lucide-react';
import type { ArenaWithTags, ArenaCategoria } from '@/types/arena';
import { CATEGORIA_LABELS, CATEGORIA_ORDER, STATUS_CONFIG } from '@/lib/arena-utils';

// ========================================
// PÁGINA PRINCIPAL
// ========================================

export default function CriarComunidadePage() {
  const router = useRouter();
  const [criando, setCriando] = useState(false);
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao_curta: '',
    descricao_completa: '',
    visibilidade: 'publica' as 'publica' | 'privada' | 'somente_convidados',
    categoria: '' as ArenaCategoria | '',
    tags: '',
  });

  const [enviado, setEnviado] = useState(false);
  const [novaArenaSlug, setNovaArenaSlug] = useState('');

  // Similar arenas state
  const [similares, setSimilares] = useState<ArenaWithTags[]>([]);
  const [buscandoSimilares, setBuscandoSimilares] = useState(false);
  const [showSimilares, setShowSimilares] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Search for similar arenas when title changes
  const buscarSimilares = useCallback(async (titulo: string) => {
    if (titulo.trim().length < 3) {
      setSimilares([]);
      setShowSimilares(false);
      return;
    }

    setBuscandoSimilares(true);
    try {
      const res = await fetch(
        `/api/arenas/search?q=${encodeURIComponent(titulo)}&limit=5`
      );
      const data = await res.json();
      const found = data.arenas || [];
      setSimilares(found);
      setShowSimilares(found.length > 0);
    } catch {
      setSimilares([]);
    } finally {
      setBuscandoSimilares(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      buscarSimilares(formData.titulo);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.titulo, buscarSimilares]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!formData.titulo.trim()) {
      setErro('Título é obrigatório.');
      return;
    }
    if (!formData.categoria) {
      setErro('Selecione uma categoria.');
      return;
    }

    setCriando(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const slug = formData.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const res = await fetch('/api/arenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.titulo.trim(),
          slug,
          description: formData.descricao_curta || formData.descricao_completa || formData.titulo,
          categoria: formData.categoria,
          criadaPor: 'USER',
          tags: tagsArray,
          icon: '💬',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao criar arena');
      }

      const data = await res.json();
      setNovaArenaSlug(data.arena?.slug || slug);
      setEnviado(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar arena. Tente novamente.';
      setErro(msg);
    } finally {
      setCriando(false);
    }
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
              Sua nova arena foi criada com sucesso. Agora é só convidar os membros e começar as discussões.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/comunidades/${novaArenaSlug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/80 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Ir para Arena
              </Link>
              <Link
                href="/comunidades"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-700 text-white font-semibold rounded-lg hover:border-zinc-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para Arenas
              </Link>
            </div>
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
            Antes de criar, verifique se já existe uma arena similar. Buscar é mais fácil que criar.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Título da Arena *
            </label>
            <div className="relative">
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
              {buscandoSimilares && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-[#00ff88] animate-spin" />
                </div>
              )}
            </div>

            {/* Similar arenas panel */}
            {showSimilares && similares.length > 0 && (
              <div className="mt-3 bg-amber-500/5 border border-amber-500/20 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-amber-500/10">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-sm text-amber-300 font-medium">
                    Arenas similares encontradas
                  </p>
                  <Search className="w-3.5 h-3.5 text-amber-500/60 ml-auto" />
                </div>

                <div className="divide-y divide-amber-500/10">
                  {similares.map((arena) => {
                    const statusCfg = STATUS_CONFIG[arena.status] || STATUS_CONFIG.COLD;
                    const catLabel = CATEGORIA_LABELS[arena.categoria] || 'Comunidade';

                    return (
                      <div
                        key={arena.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-amber-500/5 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCfg.dotColor}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{arena.name}</p>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="text-amber-400/70">{catLabel}</span>
                            <span>·</span>
                            <MessageSquare className="w-3 h-3" />
                            <span>{arena.totalPosts.toLocaleString()} posts</span>
                          </div>
                        </div>
                        <Link
                          href={`/comunidades/${arena.slug}`}
                          className="flex-shrink-0 text-xs font-medium text-[#00ff88] hover:text-[#00ff88]/80 transition-colors flex items-center gap-1"
                        >
                          Ir para Arena
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    );
                  })}
                </div>

                <div className="px-4 py-2.5 bg-amber-500/5 border-t border-amber-500/10">
                  <p className="text-xs text-zinc-500">
                    Tem certeza que quer criar uma nova? Considere participar de uma arena existente.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Categoria *
            </label>
            <select
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value as ArenaCategoria })
              }
              required
              className={`
                w-full px-4 py-3
                bg-zinc-900/50 backdrop-blur-sm
                border border-zinc-800
                rounded-lg
                text-white
                focus:outline-none focus:border-[#00ff88]/50
                transition-colors duration-200
                ${!formData.categoria ? 'text-zinc-600' : ''}
              `}
            >
              <option value="" disabled>
                Selecione a categoria...
              </option>
              {CATEGORIA_ORDER.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-900 text-white">
                  {CATEGORIA_LABELS[cat]}
                </option>
              ))}
            </select>
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
                    setFormData({ ...formData, visibilidade: e.target.value as 'publica' | 'privada' | 'somente_convidados' })
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
                    setFormData({ ...formData, visibilidade: e.target.value as 'publica' | 'privada' | 'somente_convidados' })
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
                    setFormData({ ...formData, visibilidade: e.target.value as 'publica' | 'privada' | 'somente_convidados' })
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

          {/* Error message */}
          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-400">{erro}</p>
            </div>
          )}

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
              disabled={!formData.titulo || !formData.categoria || criando}
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
              {criando ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{criando ? 'Criando Arena...' : 'Ativar Arena'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
