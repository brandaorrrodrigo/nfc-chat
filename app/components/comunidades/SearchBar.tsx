'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, MessageSquare, FileText, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SearchResult {
  type: 'topico' | 'resposta';
  id: string;
  title: string;
  snippet: string;
  slug?: string;
  topicSlug?: string;
  communitySlug: string;
  communityTitle: string;
  author?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
  topicType?: string;
  createdAt: string;
  url: string;
}

interface SearchBarProps {
  communitySlug?: string; // Se definido, busca apenas nessa comunidade
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
}

/**
 * SearchBar - Barra de busca para comunidades
 *
 * Features:
 * - Busca em tempo real (debounced)
 * - Resultados em dropdown
 * - Highlight dos termos encontrados
 * - Filtra por comunidade específica ou todas
 */
export default function SearchBar({
  communitySlug,
  placeholder = 'Buscar nas comunidades...',
  className = '',
  onResultClick
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Busca debounced
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: '10'
      });
      if (communitySlug) {
        params.set('community', communitySlug);
      }

      const res = await fetch(`/api/comunidades/search?${params}`);
      const data = await res.json();

      setResults(data.results || []);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [communitySlug]);

  // Debounce na digitação
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      search(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, search]);

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = results[selectedIndex].url;
        }
        break;
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
    onResultClick?.();
  };

  // Renderiza texto com highlight (converte **texto** para <strong>)
  const renderHighlight = (text: string) => {
    if (!text) return null;

    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className="text-[#00ff88] font-semibold">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="
            w-full
            pl-10 pr-10 py-2.5
            bg-zinc-900/80 backdrop-blur-sm
            border border-zinc-700
            rounded-xl
            text-sm text-white
            placeholder:text-zinc-500
            focus:outline-none focus:border-[#00ff88]/50
            focus:shadow-[0_0_20px_rgba(0,255,136,0.1)]
            transition-all
          "
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showResults && (
        <div
          className="
            absolute top-full left-0 right-0 mt-2
            bg-zinc-900/95 backdrop-blur-md
            border border-zinc-700
            rounded-xl
            shadow-[0_10px_50px_rgba(0,0,0,0.5)]
            max-h-[400px] overflow-y-auto
            z-50
          "
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-sm">
              {loading ? 'Buscando...' : 'Nenhum resultado encontrado'}
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  onClick={handleResultClick}
                  className={`
                    block px-4 py-3
                    hover:bg-zinc-800/50
                    transition-colors
                    border-b border-zinc-800 last:border-0
                    ${selectedIndex === index ? 'bg-zinc-800/50' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Ícone do tipo */}
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-lg
                      flex items-center justify-center
                      ${result.type === 'topico'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-cyan-500/20 text-cyan-400'
                      }
                    `}>
                      {result.type === 'topico' ? (
                        <FileText className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      {/* Título */}
                      <p className="text-sm font-medium text-white truncate">
                        {renderHighlight(result.title)}
                      </p>

                      {/* Snippet */}
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {renderHighlight(result.snippet)}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500">
                        <span className="text-[#00ff88]">{result.communityTitle}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(result.createdAt), {
                            locale: ptBR,
                            addSuffix: true
                          })}
                        </span>
                        {result.author && (
                          <>
                            <span>•</span>
                            <span>{result.author.display_name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Footer */}
          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-zinc-800 text-xs text-zinc-500 text-center">
              Pressione ↑↓ para navegar, Enter para abrir
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente compacto para uso em headers
export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2
        px-3 py-2
        bg-zinc-800/50 hover:bg-zinc-800
        border border-zinc-700 hover:border-zinc-600
        rounded-lg
        text-sm text-zinc-400 hover:text-white
        transition-all
      "
    >
      <Search className="w-4 h-4" />
      <span className="hidden sm:inline">Buscar</span>
      <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-zinc-700 rounded">⌘K</kbd>
    </button>
  );
}
