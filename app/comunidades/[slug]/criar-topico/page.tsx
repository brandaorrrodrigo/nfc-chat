'use client';

/**
 * PÁGINA: Criar Novo Tópico
 *
 * Visual: Formulário cyberpunk para criação de tópico
 * Suporte a upload de imagens (até 5)
 * Layout especial para Antes/Depois
 */

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, MessageSquare, HelpCircle, Megaphone, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '@/app/components/comunidades/ImageUploader';
import useImageUpload from '@/hooks/useImageUpload';
import { useComunidadesAuth } from '@/app/components/comunidades/ComunidadesAuthContext';

// ========================================
// PÁGINA PRINCIPAL
// ========================================

type Props = {
  params: Promise<{ slug: string }>;
};

export default function CriarTopicoPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useComunidadesAuth();
  const [enviado, setEnviado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    tipo: 'discussao' as 'discussao' | 'pergunta' | 'anuncio',
  });

  // Hook de upload de imagens
  const {
    images,
    isUploading,
    error: uploadError,
    addImages,
    removeImage,
    setImageMetadata,
    uploadAll,
    canAddMore,
    remainingSlots,
  } = useImageUpload(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // MVP: Gerar ID temporário para o tópico
      const tempTopicoId = `temp-${Date.now()}`;

      // Upload das imagens (se houver)
      if (images.length > 0) {
        const uploadedFiles = await uploadAll('topico', tempTopicoId);
        console.log('Imagens enviadas:', uploadedFiles);
      }

      // MVP: Simula envio com delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setEnviado(true);
    } catch (err) {
      console.error('Erro ao criar tópico:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (enviado) {
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

        {/* Top Bar */}
        <div className="relative z-20 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <span className="text-sm font-mono text-[#00ff88]">NutriFit Comunidades</span>
            <a
              href="https://app.nutrifitcoach.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#00ff88] transition-colors"
            >
              <span>Acessar App</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-[#00ff88]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">
              Tópico Enviado!
            </h1>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              <span className="text-yellow-400 font-mono">[MVP DEMO]</span> Em produção, seu tópico seria publicado na arena.
              Por enquanto, estamos em fase de demonstração.
            </p>
            <Link
              href={`/comunidades/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00ff88]/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Arena
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const tipoOptions = [
    { value: 'discussao', label: 'Discussão', icon: MessageSquare, desc: 'Compartilhe experiências e ideias' },
    { value: 'pergunta', label: 'Pergunta', icon: HelpCircle, desc: 'Tire suas dúvidas com a comunidade' },
    { value: 'anuncio', label: 'Anúncio', icon: Megaphone, desc: 'Comunicados importantes' },
  ];

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

      {/* Top Bar */}
      <div className="relative z-20 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <span className="text-sm font-mono text-[#00ff88]">NutriFit Comunidades</span>
          <a
            href="https://app.nutrifitcoach.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#00ff88] transition-colors"
          >
            <span>Acessar App</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Container Principal */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Botão Voltar */}
        <Link
          href={`/comunidades/${slug}`}
          className={`
            inline-flex items-center gap-2 mb-8
            text-sm text-zinc-500 hover:text-[#00ff88]
            transition-colors duration-200
            group
          `}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para Arena</span>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Novo Tópico
            </span>
          </div>

          <h1
            className={`
              text-3xl sm:text-4xl
              font-black text-white mb-3
              tracking-tight
            `}
            style={{
              textShadow: '0 0 30px rgba(0, 255, 136, 0.3)',
            }}
          >
            CRIAR TÓPICO
          </h1>

          <p className="text-base text-zinc-400 font-light">
            Compartilhe conhecimento, faça perguntas ou publique um anúncio.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Tipo de Tópico
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tipoOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`
                      flex flex-col items-center gap-2 p-4
                      bg-zinc-900/50 backdrop-blur-sm
                      border rounded-lg
                      cursor-pointer
                      transition-all duration-200
                      ${
                        formData.tipo === option.value
                          ? 'border-[#00ff88] bg-[#00ff88]/5'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={option.value}
                      checked={formData.tipo === option.value}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                      className="sr-only"
                    />
                    <Icon className={`w-6 h-6 ${formData.tipo === option.value ? 'text-[#00ff88]' : 'text-zinc-500'}`} />
                    <span className={`font-semibold ${formData.tipo === option.value ? 'text-white' : 'text-zinc-400'}`}>
                      {option.label}
                    </span>
                    <span className="text-xs text-zinc-500 text-center">{option.desc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Um título claro e objetivo"
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

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Conteúdo *
            </label>
            <textarea
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              placeholder="Descreva seu tópico em detalhes..."
              required
              rows={8}
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
            <p className="text-xs text-zinc-600 mt-2">
              Dica: Use markdown para formatação (negrito, listas, etc.)
            </p>
          </div>

          {/* Upload de Imagens */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <ImageIcon className="w-4 h-4 text-[#00ff88]" />
              Imagens (opcional)
            </label>
            <ImageUploader
              images={images}
              onAddImages={addImages}
              onRemoveImage={removeImage}
              onSetMetadata={setImageMetadata}
              error={uploadError}
              canAddMore={canAddMore}
              remainingSlots={remainingSlots}
              disabled={isSubmitting || isUploading}
              showBeforeAfter={true}
            />
            <p className="text-xs text-zinc-600 mt-2">
              Máximo 5 imagens (JPG, PNG, WEBP). Para relatos de progresso, marque as imagens como "Antes" e "Depois".
            </p>
          </div>

          {/* MVP Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-sm text-yellow-400 font-mono">
              [MVP DEMO] Este formulário é uma demonstração. Em produção, seu tópico seria salvo e publicado na arena.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/comunidades/${slug}`)}
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
              disabled={!formData.titulo || !formData.conteudo || isSubmitting || isUploading}
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
              {isSubmitting || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isUploading ? 'Enviando imagens...' : 'Publicando...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publicar{images.length > 0 ? ` (${images.length} img)` : ''}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
