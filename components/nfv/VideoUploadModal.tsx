'use client';

/**
 * VideoUploadModal - Modal completo para upload de vídeo NFV
 * Suporta upload via arquivo ou URL
 */

import { useState, useRef } from 'react';
import { X, Upload, Video, Link as LinkIcon, Loader2, CheckCircle, AlertCircle, Camera, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase para upload direto (bypassa limite 4.5MB do Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  arenaSlug: string;
  arenaName: string;
  movementPattern: string;
  requiresFP: number;
  userId: string;
  userName: string;
  isPremium?: boolean;
}

type UploadMethod = 'file' | 'url';
type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export function VideoUploadModal({
  isOpen,
  onClose,
  arenaSlug,
  arenaName,
  movementPattern,
  requiresFP,
  userId,
  userName,
  isPremium = false,
}: VideoUploadModalProps) {
  const [method, setMethod] = useState<UploadMethod>('file');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    if (!file.type.startsWith('video/')) {
      setError('Por favor, selecione um arquivo de vídeo válido');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError('Vídeo muito grande. Máximo: 100MB');
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setStatus('uploading');
    setError('');
    setProgress(0);

    try {
      // Upload direto pro Supabase Storage (bypassa limite 4.5MB do Vercel)
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${arenaSlug}/${userId}_${timestamp}.${fileExt}`;
      const bucketName = 'nfv-videos';

      setProgress(10);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(uploadError.message || 'Erro ao fazer upload do vídeo');
      }

      setProgress(80);

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uploadData.path);

      setProgress(100);

      // Criar registro de análise
      await createVideoAnalysis(urlData.publicUrl, uploadData.path);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erro ao fazer upload');
      setStatus('error');
    }
  };

  const handleUrlSubmit = async () => {
    if (!videoUrl.trim()) {
      setError('Por favor, insira uma URL válida');
      return;
    }

    // Validar URL (YouTube, Vimeo, drive, etc)
    const validPatterns = [
      /youtube\.com\/watch/,
      /youtu\.be\//,
      /vimeo\.com\//,
      /drive\.google\.com/,
    ];

    const isValid = validPatterns.some((pattern) => pattern.test(videoUrl));
    if (!isValid) {
      setError('URL não suportada. Use YouTube, Vimeo ou Google Drive');
      return;
    }

    await createVideoAnalysis(videoUrl, videoUrl);
  };

  const createVideoAnalysis = async (videoUrl: string, videoPath: string) => {
    setStatus('processing');
    setError('');

    try {
      const response = await fetch('/api/nfv/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          arenaSlug,
          videoUrl,
          videoPath,
          movementPattern,
          userDescription: description,
          paidWithSubscription: isPremium,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar análise');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        window.location.reload(); // Recarregar para mostrar vídeo na fila
      }, 2000);
    } catch (err: any) {
      console.error('Create analysis error:', err);
      setError(err.message || 'Erro ao criar registro');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'uploading' || status === 'processing') {
      if (!confirm('Upload em andamento. Tem certeza que deseja cancelar?')) {
        return;
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Enviar Vídeo para Análise</h2>
            <p className="text-sm text-zinc-400 mt-1">{arenaName}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={status === 'uploading' || status === 'processing'}
            className="text-zinc-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Success */}
          {status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-400">Vídeo enviado com sucesso!</p>
                <p className="text-sm text-green-300/80 mt-1">
                  Seu vídeo entrou na fila de análise. Você será notificado quando a análise
                  estiver pronta.
                </p>
              </div>
            </div>
          )}

          {/* Status Error */}
          {status === 'error' && error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-400">Erro</p>
                <p className="text-sm text-red-300/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Method Selection */}
          {status === 'idle' && (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => setMethod('file')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg border transition
                    flex items-center justify-center gap-2
                    ${
                      method === 'file'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }
                  `}
                >
                  <Upload className="w-5 h-5" />
                  Upload de Arquivo
                </button>

                <button
                  onClick={() => setMethod('url')}
                  className={`
                    flex-1 py-3 px-4 rounded-lg border transition
                    flex items-center justify-center gap-2
                    ${
                      method === 'url'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }
                  `}
                >
                  <LinkIcon className="w-5 h-5" />
                  Link do Vídeo
                </button>
              </div>

              {/* File Upload */}
              {method === 'file' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 rounded-lg p-12 text-center cursor-pointer hover:border-purple-500 transition"
                  >
                    <Video className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">
                      Clique para selecionar um vídeo
                    </p>
                    <p className="text-sm text-zinc-500">
                      Formatos: MP4, MOV, AVI • Máximo: 100MB
                    </p>
                  </div>
                </div>
              )}

              {/* URL Input */}
              {method === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    URL do Vídeo
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    Suportado: YouTube, Vimeo, Google Drive
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte-nos sobre sua execução, dores, dificuldades..."
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <strong>ℹ️ Como funciona:</strong> Seu vídeo será analisado por IA especializada
                  em biomecânica e depois revisado por um profissional. O resultado será publicado
                  na arena em até 48 horas.
                </p>
              </div>

              {/* Guia de Gravação */}
              <div className="border border-zinc-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="w-full flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 transition"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Camera className="w-4 h-4 text-purple-400" />
                    Como gravar para melhor análise
                  </div>
                  {showTips ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </button>

                {showTips && (
                  <div className="p-4 space-y-4 bg-zinc-900/50">
                    {/* Ângulos recomendados */}
                    <div>
                      <h4 className="text-xs font-semibold text-purple-400 uppercase mb-2">
                        Ângulos Recomendados
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-zinc-800 rounded-lg p-2 text-center">
                          <div className="text-lg mb-1">📐</div>
                          <div className="font-medium text-white">Lateral (90°)</div>
                          <div className="text-zinc-500 mt-1">Profundidade, tronco, joelhos</div>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-2 text-center">
                          <div className="text-lg mb-1">👤</div>
                          <div className="font-medium text-white">Frontal</div>
                          <div className="text-zinc-500 mt-1">Valgo, distribuição de peso</div>
                        </div>
                        <div className="bg-zinc-800 rounded-lg p-2 text-center">
                          <div className="text-lg mb-1">🔙</div>
                          <div className="font-medium text-white">Posterior</div>
                          <div className="text-zinc-500 mt-1">Quadril, pés, alinhamento</div>
                        </div>
                      </div>
                    </div>

                    {/* Dicas de gravação */}
                    <div>
                      <h4 className="text-xs font-semibold text-purple-400 uppercase mb-2">
                        Dicas para Melhor Análise
                      </h4>
                      <ul className="space-y-2 text-xs text-zinc-400">
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span><strong className="text-zinc-300">Corpo inteiro visível</strong> - pés até cabeça no enquadramento</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span><strong className="text-zinc-300">Boa iluminação</strong> - evite contraluz e sombras</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span><strong className="text-zinc-300">Fundo limpo</strong> - sem objetos que confundam a análise</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span><strong className="text-zinc-300">2-3 repetições</strong> - para avaliar consistência</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span><strong className="text-zinc-300">Câmera fixa</strong> - na altura do quadril, sem movimento</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lightbulb className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span><strong className="text-zinc-300">Roupa ajustada</strong> - para visualizar articulações</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={method === 'url' ? handleUrlSubmit : () => fileInputRef.current?.click()}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
                >
                  {method === 'url' ? 'Enviar Link' : 'Selecionar Arquivo'}
                </button>
              </div>
            </>
          )}

          {/* Uploading */}
          {(status === 'uploading' || status === 'processing') && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                {status === 'uploading' ? 'Enviando vídeo...' : 'Processando...'}
              </p>
              {status === 'uploading' && (
                <div className="w-full max-w-xs mx-auto mt-4">
                  <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-zinc-500 mt-2">{progress}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
