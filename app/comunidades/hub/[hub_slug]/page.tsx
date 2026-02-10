'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Users, Loader } from 'lucide-react';

interface Arena {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  totalPosts: number;
  dailyActiveUsers: number;
  postCount: number;
}

interface HubData {
  hub: {
    title: string;
    subtitle: string;
    description: string;
    color: string;
  };
  arenas: Arena[];
}

export default function HubPage() {
  const params = useParams();
  const router = useRouter();
  const hubSlug = params.hub_slug as string;

  const [hubData, setHubData] = useState<HubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const response = await fetch(`/api/community/hub/${hubSlug}`);
        if (!response.ok) {
          throw new Error('Hub não encontrado');
        }
        const data = await response.json();
        setHubData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar hub');
      } finally {
        setLoading(false);
      }
    };

    fetchHub();
  }, [hubSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando hub...</p>
        </div>
      </div>
    );
  }

  if (error || !hubData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">⚠️ Hub não encontrado</h2>
          <p className="text-gray-400 mb-6">{error || 'Ocorreu um erro ao carregar o hub'}</p>
        </div>
        <Link
          href="/chat"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-lg hover:from-cyan-500/30 hover:to-purple-500/30 transition-all border border-cyan-500/30 hover:border-cyan-500/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Comunidades
        </Link>
      </div>
    );
  }

  const { hub, arenas } = hubData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Link
                href="/chat"
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors mt-1"
                title="Voltar para Comunidades"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {hub.title}
                </h1>
                <p className="text-sm text-cyan-400 font-medium mb-2">
                  {hub.subtitle}
                </p>
                <p className="text-sm text-gray-400 hidden sm:block max-w-2xl">
                  {hub.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {arenas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Nenhuma arena neste hub ainda</p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        ) : (
          <>
            {/* Descrição no mobile */}
            <p className="text-gray-400 text-sm mb-6 sm:hidden">
              {hub.description}
            </p>

            {/* Grid de Arenas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {arenas.map((arena) => (
                <Link
                  key={arena.id}
                  href={`/comunidades/${arena.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-purple-500/20 bg-slate-900/50 hover:bg-slate-900 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  {/* Background gradient animado */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${arena.color}00, ${arena.color}33)`,
                    }}
                  ></div>

                  {/* Linha superior colorida */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-30 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${arena.color}, transparent)`,
                    }}
                  ></div>

                  <div className="relative p-4 sm:p-6 h-full flex flex-col">
                    {/* Icon */}
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {arena.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {arena.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                      {arena.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 border-t border-purple-500/10 pt-3">
                      <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="font-medium">{arena.postCount}</span>
                        <span className="hidden sm:inline">posts</span>
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                        <Users className="w-3.5 h-3.5" />
                        <span className="font-medium">{arena.dailyActiveUsers}</span>
                        <span className="hidden sm:inline">pessoas</span>
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cyan-400 font-medium text-xs">
                        Entrar na Arena
                      </span>
                      <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:translate-x-1 transform">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer info */}
            <div className="mt-12 pt-8 border-t border-purple-500/10 text-center">
              <p className="text-gray-500 text-sm">
                {arenas.length} {arenas.length === 1 ? 'arena' : 'arenas'} disponíveis neste hub
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
