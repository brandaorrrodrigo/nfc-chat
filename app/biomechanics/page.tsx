'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Video,
  BarChart3,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Play,
  Activity,
} from 'lucide-react';

interface VideoStat {
  id: string;
  user_name: string;
  movement_pattern: string;
  created_at: string;
  status: string;
  overall_score?: number;
}

function ScoreColor(score: number) {
  if (score >= 8) return 'text-green-400';
  if (score >= 6) return 'text-yellow-400';
  if (score >= 4) return 'text-orange-400';
  return 'text-red-400';
}

export default function BiomechanicsHomePage() {
  const [videos, setVideos] = useState<VideoStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/biomechanics/list-videos')
      .then((r) => r.json())
      .then((data) => setVideos(data.videos || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const analyzed = videos.filter((v) => v.status === 'BIOMECHANICS_ANALYZED_V2');
  const avgScore =
    analyzed.length > 0
      ? analyzed.reduce((sum, v) => sum + (v.overall_score || 0), 0) / analyzed.length
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-semibold">
              Sistema NFV — Análise Biomecânica v2.0
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Análise Biomecânica
            <span className="text-cyan-400"> Inteligente</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Pipeline Motor + Stabilizer com MediaPipe, RAG e relatórios via Ollama.
            Identifique compensações, assimetrias e padrões de movimento em tempo real.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-cyan-400">
              {loading ? '—' : videos.length}
            </p>
            <p className="text-slate-400 mt-2">Vídeos no sistema</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-green-400">
              {loading ? '—' : analyzed.length}
            </p>
            <p className="text-slate-400 mt-2">Análises concluídas</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-yellow-400">
              {loading ? '—' : avgScore !== null ? avgScore.toFixed(1) : '—'}
            </p>
            <p className="text-slate-400 mt-2">Score médio geral</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/biomechanics/videos"
            className="group bg-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-xl p-8 transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Vídeos Analisados</h2>
                <p className="text-slate-400 text-sm">Ver todos os registros</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Acesse a lista completa de vídeos com análise biomecânica. Clique em qualquer
              registro para ver o relatório detalhado com Motor + Stabilizer breakdown.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all">
              Ver vídeos <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/biomechanics/dashboard"
            className="group bg-slate-900 border border-slate-700 hover:border-purple-500/50 rounded-xl p-8 transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Dashboard</h2>
                <p className="text-slate-400 text-sm">Análise detalhada por ID</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Visualize análise completa Motor + Stabilizer, relatório LLM, tópicos RAG
              e plano corretivo personalizado por ID de vídeo.
            </p>
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm group-hover:gap-3 transition-all">
              Abrir dashboard <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Recent Analyses */}
        {!loading && analyzed.length > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Análises Recentes
              </h3>
              <Link
                href="/biomechanics/videos"
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
              >
                Ver todas →
              </Link>
            </div>
            <div className="space-y-3">
              {analyzed.slice(0, 5).map((video) => (
                <Link
                  key={video.id}
                  href={`/biomechanics/dashboard?videoId=${video.id}`}
                  className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700/50 hover:border-cyan-500/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white font-semibold capitalize truncate">
                        {video.movement_pattern || 'Exercício'}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {video.user_name || 'Anônimo'} •{' '}
                        {new Date(video.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  {video.overall_score !== undefined && (
                    <div className={`text-right ml-4 flex-shrink-0 ${ScoreColor(video.overall_score)}`}>
                      <p className="text-xl font-bold">{video.overall_score.toFixed(1)}</p>
                      <p className="text-slate-500 text-xs">/10</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && videos.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-12 text-center mb-12">
            <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Nenhuma análise ainda</h3>
            <p className="text-slate-400 mb-6">
              Nenhum vídeo foi enviado para análise biomecânica ainda.
            </p>
            <Link
              href="/biomechanics/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold transition"
            >
              <Play className="w-4 h-4" />
              Ir para o Dashboard
            </Link>
          </div>
        )}

        {/* How it works */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8">
          <h3 className="text-xl font-bold mb-8 text-center">Como funciona</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload do Vídeo',
                desc: 'Envie o vídeo do exercício para análise. O sistema suporta agachamento, terra, supino, remada e mais.',
                color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
              },
              {
                step: '2',
                title: 'Processamento MediaPipe',
                desc: 'Pipeline Motor + Stabilizer extrai 36 frames e calcula ângulos biomecânicos com MediaPipe Pose.',
                color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
              },
              {
                step: '3',
                title: 'Relatório Inteligente',
                desc: 'Ollama LLM + RAG gera relatório completo com classificações, problemas e plano corretivo personalizado.',
                color: 'text-green-400 border-green-500/30 bg-green-500/10',
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="text-center">
                <div
                  className={`w-10 h-10 ${color} border rounded-full flex items-center justify-center font-bold mx-auto mb-3`}
                >
                  {step}
                </div>
                <h4 className="font-semibold mb-2">{title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
