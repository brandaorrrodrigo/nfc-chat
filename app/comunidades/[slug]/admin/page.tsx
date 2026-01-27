'use client';

/**
 * PÁGINA: PAINEL ADMINISTRATIVO - Comunidade
 *
 * Visual: Dashboard de controle / Command Center
 * Estilo: WordPress Admin - Gerenciamento completo
 * Estética: Cyberpunk Dark + Verde Neon (#00ff88)
 *
 * Funcionalidades:
 * - Gerenciar tópicos (CRUD)
 * - Visualizar estatísticas
 * - Configurar IA Facilitadora
 * - Moderar conteúdo
 *
 * MVP: Dados mock para demonstração
 */

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  FileText,
  HelpCircle,
  Megaphone,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  Shield,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface Topico {
  id: string;
  slug: string;
  titulo: string;
  conteudo: string;
  tipo: 'discussao' | 'pergunta' | 'anuncio';
  criado_em: string;
  hora: string;
  autor: {
    nome: string;
    is_premium?: boolean;
    is_founder?: boolean;
  };
  respostas_count: number;
  status: 'publicado' | 'rascunho' | 'arquivado';
}

interface ComunidadeAdminData {
  titulo: string;
  descricao: string;
  agentesOnline: number;
  totalMensagens: number;
  topicos: Topico[];
  configIA: {
    ativo: boolean;
    gerarResumos: boolean;
    gerarPerguntas: boolean;
    gerarInsights: boolean;
    gerarDestaques: boolean;
  };
  stats: {
    totalMembros: number;
    novosHoje: number;
    topicosHoje: number;
    interacoesIA: number;
  };
}

// ========================================
// DADOS MOCK
// ========================================

const TOPICOS_LIPEDEMA: Topico[] = [
  {
    id: '1',
    slug: 'dieta-anti-inflamatoria',
    titulo: 'Dieta Anti-Inflamatória Básica - Por onde começar?',
    conteudo: 'Comecei a dieta anti-inflamatória há 3 semanas e já sinto diferença no inchaço das pernas.',
    tipo: 'discussao',
    criado_em: '2025-01-20',
    hora: '14:32',
    autor: { nome: 'Maria Silva', is_premium: true },
    respostas_count: 24,
    status: 'publicado',
  },
  {
    id: '2',
    slug: 'treinos-baixo-impacto',
    titulo: 'Treinos de baixo impacto que funcionam',
    conteudo: 'Depois de testar vários exercícios, encontrei uma rotina que não agrava o lipedema.',
    tipo: 'pergunta',
    criado_em: '2025-01-19',
    hora: '10:15',
    autor: { nome: 'Ana Costa' },
    respostas_count: 18,
    status: 'publicado',
  },
  {
    id: '3',
    slug: 'suplementos-recomendados',
    titulo: 'Suplementos que ajudam no lipedema',
    conteudo: 'Lista dos suplementos que meu médico recomendou: Diosmina + Hesperidina, Ômega-3.',
    tipo: 'discussao',
    criado_em: '2025-01-18',
    hora: '16:45',
    autor: { nome: 'Dra. Carla', is_founder: true },
    respostas_count: 31,
    status: 'publicado',
  },
  {
    id: '4',
    slug: 'drenagem-linfatica',
    titulo: 'Experiências com drenagem linfática',
    conteudo: 'Minha médica indicou drenagem linfática junto com a dieta.',
    tipo: 'pergunta',
    criado_em: '2025-01-17',
    hora: '09:20',
    autor: { nome: 'Juliana Santos' },
    respostas_count: 15,
    status: 'rascunho',
  },
];

const TOPICOS_PEPTIDEOS: Topico[] = [
  {
    id: '1',
    slug: 'ozempic-primeiras-semanas',
    titulo: 'Ozempic: Minhas primeiras semanas',
    conteudo: 'Relato da semana 3 com Ozempic 0.5mg. A náusea diminuiu bastante.',
    tipo: 'discussao',
    criado_em: '2025-01-22',
    hora: '13:15',
    autor: { nome: 'João Pedro', is_premium: true },
    respostas_count: 45,
    status: 'publicado',
  },
  {
    id: '2',
    slug: 'mounjaro-vs-ozempic',
    titulo: 'Mounjaro vs Ozempic - Qual escolher?',
    conteudo: 'Usei os dois e compartilho as diferenças.',
    tipo: 'pergunta',
    criado_em: '2025-01-21',
    hora: '11:30',
    autor: { nome: 'Dr. Ricardo', is_founder: true },
    respostas_count: 67,
    status: 'publicado',
  },
  {
    id: '3',
    slug: 'reducao-danos',
    titulo: 'Protocolo de redução de danos',
    conteudo: 'IMPORTANTE: Antes de começar - exames completos.',
    tipo: 'anuncio',
    criado_em: '2025-01-20',
    hora: '08:00',
    autor: { nome: 'Admin', is_founder: true },
    respostas_count: 89,
    status: 'publicado',
  },
];

const COMUNIDADES_ADMIN: Record<string, ComunidadeAdminData> = {
  lipedema: {
    titulo: 'Protocolo Lipedema',
    descricao: 'Estratégias anti-inflamatórias e protocolos especializados',
    agentesOnline: 47,
    totalMensagens: 1842,
    topicos: TOPICOS_LIPEDEMA,
    configIA: {
      ativo: true,
      gerarResumos: true,
      gerarPerguntas: true,
      gerarInsights: true,
      gerarDestaques: true,
    },
    stats: {
      totalMembros: 1247,
      novosHoje: 12,
      topicosHoje: 3,
      interacoesIA: 156,
    },
  },
  peptideos: {
    titulo: 'Arsenal: Peptídeos & Canetas',
    descricao: 'Ozempic, Mounjaro e protocolos avançados',
    agentesOnline: 63,
    totalMensagens: 2156,
    topicos: TOPICOS_PEPTIDEOS,
    configIA: {
      ativo: true,
      gerarResumos: true,
      gerarPerguntas: false,
      gerarInsights: true,
      gerarDestaques: true,
    },
    stats: {
      totalMembros: 856,
      novosHoje: 8,
      topicosHoje: 5,
      interacoesIA: 203,
    },
  },
};

// ========================================
// COMPONENTES
// ========================================

function StatCard({ icon: Icon, value, label, trend }: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <Icon className="w-5 h-5 text-[#00ff88]" />
        </div>
        {trend && (
          <span className={`text-xs font-mono ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function TopicoRow({ topico, onEdit, onDelete, onToggleStatus }: {
  topico: Topico;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}) {
  const tipoConfig = {
    discussao: { icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    pergunta: { icon: HelpCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    anuncio: { icon: Megaphone, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  };

  const statusConfig = {
    publicado: { color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle },
    rascunho: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
    arquivado: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', icon: XCircle },
  };

  const config = tipoConfig[topico.tipo];
  const status = statusConfig[topico.status];
  const TipoIcon = config.icon;
  const StatusIcon = status.icon;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all group">
      <div className="flex items-start gap-4">
        {/* Status Indicator */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <TipoIcon className={`w-4 h-4 ${config.color}`} />
          </div>
          <button
            onClick={() => onToggleStatus(topico.id)}
            className={`p-1.5 rounded ${status.bg} hover:opacity-80 transition-opacity`}
            title={`Status: ${topico.status}`}
          >
            <StatusIcon className={`w-3 h-3 ${status.color}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-white truncate">
              {topico.titulo}
            </h3>
            <span className={`px-1.5 py-0.5 text-[10px] ${status.bg} ${status.color} rounded`}>
              {topico.status}
            </span>
          </div>

          <p className="text-xs text-zinc-500 line-clamp-1 mb-2">
            {topico.conteudo}
          </p>

          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {topico.autor.nome}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {topico.respostas_count}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {topico.criado_em}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(topico.id)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            onClick={() => onDelete(topico.id)}
            className="p-2 bg-zinc-800 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IAConfigToggle({ label, enabled, onToggle }: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors cursor-pointer"
      onClick={onToggle}
    >
      <span className="text-sm text-zinc-300">{label}</span>
      {enabled ? (
        <ToggleRight className="w-6 h-6 text-[#00ff88]" />
      ) : (
        <ToggleLeft className="w-6 h-6 text-zinc-600" />
      )}
    </div>
  );
}

// ========================================
// PÁGINA PRINCIPAL
// ========================================

type Props = {
  params: Promise<{ slug: string }>;
};

export default function AdminPanelPage({ params }: Props) {
  const { slug } = use(params);
  const [comunidade, setComunidade] = useState<ComunidadeAdminData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'topicos' | 'ia' | 'membros'>('overview');
  const [configIA, setConfigIA] = useState({
    ativo: true,
    gerarResumos: true,
    gerarPerguntas: true,
    gerarInsights: true,
    gerarDestaques: true,
  });

  useEffect(() => {
    const data = COMUNIDADES_ADMIN[slug];
    if (data) {
      setComunidade(data);
      setConfigIA(data.configIA);
    }
  }, [slug]);

  const handleEdit = (id: string) => {
    alert(`[MVP DEMO] Editar tópico ${id}`);
  };

  const handleDelete = (id: string) => {
    alert(`[MVP DEMO] Excluir tópico ${id}`);
  };

  const handleToggleStatus = (id: string) => {
    alert(`[MVP DEMO] Alternar status do tópico ${id}`);
  };

  const toggleIAConfig = (key: keyof typeof configIA) => {
    setConfigIA(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!comunidade) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Comunidade não encontrada</h1>
          <Link href="/comunidades" className="text-[#00ff88] hover:underline">
            Voltar para Arenas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(#00ff88 1px, transparent 1px),
            linear-gradient(90deg, #00ff88 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Page Navigation - Nota: Header global é renderizado via providers.tsx */}
      <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href={`/comunidades/${slug}`}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-[#00ff88] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono">PAINEL PÚBLICO</span>
              </Link>

              <div className="h-6 w-[1px] bg-zinc-800" />

              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-mono text-amber-500 uppercase">Admin</span>
              </div>
            </div>

            <a
              href={`/comunidades/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-xs text-zinc-400"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Público</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="mt-4">
            <h1
              className="text-2xl font-black text-white"
              style={{ textShadow: '0 0 20px rgba(0, 255, 136, 0.2)' }}
            >
              {comunidade.titulo}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">{comunidade.descricao}</p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 -mb-[1px]">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'topicos', label: 'Tópicos', icon: FileText },
              { id: 'ia', label: 'IA Facilitadora', icon: Bot },
              { id: 'membros', label: 'Membros', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all
                  ${activeTab === tab.id
                    ? 'bg-zinc-900 text-[#00ff88] border border-zinc-800 border-b-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* MVP Notice */}
        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400 font-mono">
            [MVP DEMO] Painel administrativo em demonstração. Em produção, as ações serão persistidas no banco de dados.
          </p>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                value={comunidade.stats.totalMembros.toLocaleString()}
                label="Total de Membros"
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                icon={TrendingUp}
                value={comunidade.stats.novosHoje}
                label="Novos Hoje"
              />
              <StatCard
                icon={FileText}
                value={comunidade.stats.topicosHoje}
                label="Tópicos Hoje"
              />
              <StatCard
                icon={Bot}
                value={comunidade.stats.interacoesIA}
                label="Interações IA"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00ff88]" />
                Ações Rápidas
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link
                  href={`/comunidades/${slug}/criar-topico`}
                  className="flex items-center gap-3 p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-lg hover:bg-[#00ff88]/20 transition-colors group"
                >
                  <Plus className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-sm font-medium text-white group-hover:text-[#00ff88] transition-colors">
                    Novo Tópico
                  </span>
                </Link>

                <button
                  onClick={() => setActiveTab('ia')}
                  className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors group"
                >
                  <Bot className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                    Configurar IA
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('membros')}
                  className="flex items-center gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors group"
                >
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                    Ver Membros
                  </span>
                </button>

                <button
                  className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors group"
                >
                  <Settings className="w-5 h-5 text-zinc-400" />
                  <span className="text-sm font-medium text-white group-hover:text-zinc-300 transition-colors">
                    Configurações
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Topics */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00ff88]" />
                  Tópicos Recentes
                </h2>
                <button
                  onClick={() => setActiveTab('topicos')}
                  className="text-xs text-[#00ff88] hover:underline"
                >
                  Ver todos
                </button>
              </div>

              <div className="space-y-3">
                {comunidade.topicos.slice(0, 3).map((topico) => (
                  <TopicoRow
                    key={topico.id}
                    topico={topico}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tópicos Tab */}
        {activeTab === 'topicos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Gerenciar Tópicos ({comunidade.topicos.length})
              </h2>
              <Link
                href={`/comunidades/${slug}/criar-topico`}
                className="flex items-center gap-2 px-4 py-2 bg-[#00ff88] hover:bg-[#00ff88]/80 text-black font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Tópico</span>
              </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-500">Filtrar:</span>
              {['Todos', 'Publicados', 'Rascunhos', 'Arquivados'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Topics List */}
            <div className="space-y-3">
              {comunidade.topicos.map((topico) => (
                <TopicoRow
                  key={topico.id}
                  topico={topico}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          </div>
        )}

        {/* IA Tab */}
        {activeTab === 'ia' && (
          <div className="space-y-6">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">IA Facilitadora</h2>
                  <p className="text-sm text-zinc-500">Configure como a IA interage com sua comunidade</p>
                </div>
              </div>

              {/* Master Toggle */}
              <div
                className={`
                  flex items-center justify-between p-4 rounded-xl mb-6 cursor-pointer transition-all
                  ${configIA.ativo
                    ? 'bg-[#00ff88]/10 border-2 border-[#00ff88]/30'
                    : 'bg-zinc-800/50 border-2 border-zinc-700'
                  }
                `}
                onClick={() => toggleIAConfig('ativo')}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-5 h-5 ${configIA.ativo ? 'text-[#00ff88]' : 'text-zinc-500'}`} />
                  <div>
                    <p className="text-sm font-semibold text-white">IA Ativa</p>
                    <p className="text-xs text-zinc-500">
                      {configIA.ativo ? 'A IA está analisando e gerando intervenções' : 'A IA está desativada'}
                    </p>
                  </div>
                </div>
                {configIA.ativo ? (
                  <ToggleRight className="w-8 h-8 text-[#00ff88]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-zinc-600" />
                )}
              </div>

              {/* Config Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Tipos de Intervenção</h3>

                <IAConfigToggle
                  label="Gerar Resumos da Comunidade"
                  enabled={configIA.gerarResumos}
                  onToggle={() => toggleIAConfig('gerarResumos')}
                />

                <IAConfigToggle
                  label="Gerar Perguntas para Reflexão"
                  enabled={configIA.gerarPerguntas}
                  onToggle={() => toggleIAConfig('gerarPerguntas')}
                />

                <IAConfigToggle
                  label="Gerar Insights e Padrões"
                  enabled={configIA.gerarInsights}
                  onToggle={() => toggleIAConfig('gerarInsights')}
                />

                <IAConfigToggle
                  label="Destacar Anúncios Importantes"
                  enabled={configIA.gerarDestaques}
                  onToggle={() => toggleIAConfig('gerarDestaques')}
                />
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-2.5 bg-[#00ff88] hover:bg-[#00ff88]/80 text-black font-semibold rounded-lg transition-colors"
                  onClick={() => alert('[MVP DEMO] Configurações salvas!')}
                >
                  Salvar Configurações
                </button>
              </div>
            </div>

            {/* IA Stats */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Estatísticas da IA</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">{comunidade.stats.interacoesIA}</p>
                  <p className="text-xs text-zinc-500 mt-1">Intervenções Totais</p>
                </div>
                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-400">42</p>
                  <p className="text-xs text-zinc-500 mt-1">Resumos Gerados</p>
                </div>
                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-[#00ff88]">28</p>
                  <p className="text-xs text-zinc-500 mt-1">Insights Criados</p>
                </div>
                <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">15</p>
                  <p className="text-xs text-zinc-500 mt-1">Destaques</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Membros Tab */}
        {activeTab === 'membros' && (
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Gerenciar Membros</h2>
                <p className="text-sm text-zinc-500">{comunidade.stats.totalMembros.toLocaleString()} membros cadastrados</p>
              </div>
            </div>

            <div className="text-center py-12 text-zinc-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm font-mono">[MVP DEMO]</p>
              <p className="text-sm mt-2">Gerenciamento de membros será implementado na versão completa.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
