'use client';

/**
 * VideoUploadForm - Form de upload de video para analise biomecanica
 */

import React, { useState, useRef } from 'react';
import { Upload, Video, FileVideo, X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { NFV_CONFIG, getPremiumArenaConfig } from '@/lib/biomechanics/nfv-config';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { useNFVGating } from '@/hooks/useNFVGating';
import FPGatingModal from './FPGatingModal';
import MovementPatternBadge from './MovementPatternBadge';

interface VideoUploadFormProps {
  arenaSlug: string;
  arenaName: string;
  userId: string;
  userName: string;
  onUploadComplete?: (analysisId: string) => void;
}

export default function VideoUploadForm({
  arenaSlug,
  arenaName,
  userId,
  userName,
  onUploadComplete,
}: VideoUploadFormProps) {
  const arenaConfig = getPremiumArenaConfig(arenaSlug);
  const movementPattern = arenaConfig?.pattern || 'geral';

  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showGatingModal, setShowGatingModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadVideo, uploading, progress, error: uploadError, reset: resetUpload } = useVideoUpload();
  const { gatingResult, loading: gatingLoading, checkGating } = useNFVGating(userId, arenaSlug);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!NFV_CONFIG.VIDEO.allowedTypes.includes(file.type)) {
      alert('Formato nao suportado. Use MP4, WebM ou MOV.');
      return;
    }

    // Validar tamanho
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > NFV_CONFIG.VIDEO.maxSizeMB) {
      alert(`Video muito grande. Maximo: ${NFV_CONFIG.VIDEO.maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadSuccess(false);
    setAnalysisId(null);
    resetUpload();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    // Verificar gating
    await checkGating();

    if (gatingResult && !gatingResult.allowed) {
      setShowGatingModal(true);
      return;
    }

    await performUpload(false);
  };

  const handleConfirmSpend = async () => {
    setShowGatingModal(false);
    await performUpload(false);
  };

  const performUpload = async (paidWithSubscription: boolean) => {
    if (!selectedFile) return;

    try {
      const result = await uploadVideo({
        file: selectedFile,
        userId,
        userName,
        arenaSlug,
        movementPattern,
        userDescription: description,
        paidWithSubscription: paidWithSubscription || (gatingResult?.reason === 'subscriber'),
      });

      if (result?.analysisId) {
        setUploadSuccess(true);
        setAnalysisId(result.analysisId);
        onUploadComplete?.(result.analysisId);
      }
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Enviar Video para Analise</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <MovementPatternBadge pattern={movementPattern} size="sm" />
            <span className="text-xs text-zinc-500">{arenaName}</span>
          </div>
        </div>
      </div>

      {/* Upload Success */}
      {uploadSuccess && analysisId && (
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-semibold text-green-300">Video Enviado!</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Seu video esta na fila para analise. Voce sera notificado quando a analise estiver pronta.
          </p>
          <p className="text-xs text-zinc-500 mt-1">ID: {analysisId}</p>
        </div>
      )}

      {/* File Selection */}
      {!uploadSuccess && (
        <>
          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 hover:border-purple-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 group-hover:bg-purple-500/10 flex items-center justify-center transition-colors">
                <Upload className="w-8 h-8 text-zinc-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <p className="text-sm text-zinc-300 mb-1">Clique para selecionar um video</p>
              <p className="text-xs text-zinc-600">
                MP4, WebM ou MOV • Max {NFV_CONFIG.VIDEO.maxSizeMB}MB • Max {NFV_CONFIG.VIDEO.maxDurationSeconds}s
              </p>
            </div>
          ) : (
            <div className="relative bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden">
              {/* Preview */}
              {previewUrl && (
                <video
                  src={previewUrl}
                  controls
                  className="w-full max-h-64 object-contain bg-black"
                />
              )}

              {/* File Info */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-zinc-300 truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-zinc-600">
                    ({(selectedFile.size / (1024 * 1024)).toFixed(1)}MB)
                  </span>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={NFV_CONFIG.VIDEO.allowedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Description */}
          <div>
            <label className="block text-sm text-zinc-300 mb-2">
              Descricao (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que quer analisar, duvidas sobre sua tecnica, dores que sente..."
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-600 resize-none h-24 focus:outline-none focus:border-purple-500/50"
              maxLength={500}
            />
            <p className="text-xs text-zinc-600 mt-1 text-right">{description.length}/500</p>
          </div>

          {/* Guidelines */}
          <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800">
            <h4 className="text-xs font-semibold text-zinc-400 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Dicas para um bom video
            </h4>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>• Filme de lado (perfil) para melhor visao dos angulos</li>
              <li>• Use boa iluminacao</li>
              <li>• Filme pelo menos 2-3 repeticoes</li>
              <li>• Mantenha o corpo inteiro visivel no quadro</li>
              <li>• Evite roupas muito largas que escondam articulacoes</li>
            </ul>
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">{uploadError}</p>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-sm text-zinc-300">Enviando video...</span>
                <span className="text-xs text-zinc-500 ml-auto">{progress}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading || gatingLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {gatingLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verificando permissao...
              </>
            ) : uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Enviar para Analise
              </>
            )}
          </button>
        </>
      )}

      {/* FP Gating Modal */}
      <FPGatingModal
        isOpen={showGatingModal}
        onClose={() => setShowGatingModal(false)}
        fpBalance={gatingResult?.fpBalance || 0}
        fpCost={gatingResult?.fpCost || 25}
        arenaName={arenaName}
        onConfirmSpend={handleConfirmSpend}
      />
    </div>
  );
}
