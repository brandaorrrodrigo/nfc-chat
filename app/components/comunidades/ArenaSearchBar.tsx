'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, MessageSquare, ArrowRight, Crown, Zap } from 'lucide-react';
import Link from 'next/link';
import type { ArenaWithTags } from '@/types/arena';
import { CATEGORIA_LABELS, STATUS_CONFIG } from '@/lib/arena-utils';

interface ArenaSearchBarProps {
  className?: string;
  onResultClick?: () => void;
}

export default function ArenaSearchBar({
  className = '',
  onResultClick,
}: ArenaSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArenaWithTags[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/arenas/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      const data = await res.json();
      setResults(data.arenas || []);
      setShowResults(true);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Arena search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          window.location.href = `/comunidades/${results[selectedIndex].slug}`;
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

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#00f5ff]" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar arena ou tema..."
          className="
            w-full
            pl-12 pr-12 py-3.5
            bg-zinc-900/80 backdrop-blur-sm
            border border-zinc-700/50
            rounded-xl
            text-base text-white
            placeholder:text-zinc-500
            focus:outline-none focus:border-[#00f5ff]/50
            focus:shadow-[0_0_20px_rgba(0,245,255,0.1)]
            transition-all
          "
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {showResults && (
        <div
          className="
            absolute top-full left-0 right-0 mt-2
            bg-zinc-900/95 backdrop-blur-md
            border border-zinc-700/50
            rounded-xl
            shadow-[0_10px_50px_rgba(0,0,0,0.5)]
            max-h-[400px] overflow-y-auto
            z-50
          "
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-sm">
              {loading ? 'Buscando arenas...' : 'Nenhuma arena encontrada'}
            </div>
          ) : (
            <div className="py-2">
              {results.map((arena, index) => {
                const statusCfg = STATUS_CONFIG[arena.status] || STATUS_CONFIG.COLD;
                const categoriaLabel = CATEGORIA_LABELS[arena.categoria] || arena.category;
                const isNFV = arena.arenaType === 'NFV_HUB' || arena.arenaType === 'NFV_PREMIUM';

                return (
                  <Link
                    key={arena.id}
                    href={`/comunidades/${arena.slug}`}
                    onClick={handleResultClick}
                    className={`
                      block px-4 py-3
                      hover:bg-zinc-800/50
                      transition-colors
                      border-b border-zinc-800/50 last:border-0
                      ${selectedIndex === index ? 'bg-zinc-800/50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {/* Status dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusCfg.dotColor}`} />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            {arena.name}
                          </p>
                          {isNFV && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                              <Crown className="w-2.5 h-2.5" />
                              NFV
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                          <span className="text-[#00f5ff]">{categoriaLabel}</span>
                          <span>·</span>
                          <MessageSquare className="w-3 h-3" />
                          <span>{arena.totalPosts.toLocaleString()} posts</span>
                          {arena.tags && arena.tags.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="truncate max-w-[150px]">
                                {arena.tags.slice(0, 3).map((t) => t.tag).join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {results.length > 0 && (
            <div className="px-4 py-2 border-t border-zinc-800/50 text-xs text-zinc-500 text-center">
              ↑↓ navegar · Enter abrir · Esc fechar
            </div>
          )}
        </div>
      )}
    </div>
  );
}
