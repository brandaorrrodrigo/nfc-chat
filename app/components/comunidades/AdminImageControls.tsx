'use client';

/**
 * AdminImageControls - Controles de Admin para Imagens
 *
 * Permite que admins/moderadores removam imagens de posts
 * sem deletar o post inteiro.
 *
 * Estilo: Botão discreto que aparece no hover
 */

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

// ============================================
// TIPOS
// ============================================

interface AdminImageControlsProps {
  arquivoId: string;
  isAdmin: boolean;
  onDelete?: (arquivoId: string) => void;
}

// ============================================
// COMPONENTE: Modal de Confirmação
// ============================================

function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Remover Imagem
            </h3>
            <p className="text-sm text-zinc-400">
              Esta ação irá remover a imagem do post. O texto será mantido.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {/* Aviso */}
        <div className="bg-zinc-800/50 rounded-lg p-3 mb-4">
          <p className="text-xs text-zinc-500">
            <strong className="text-zinc-400">Nota:</strong> Esta é uma ação de moderação.
            O autor será notificado e a ação ficará registrada.
          </p>
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`
              flex-1 px-4 py-2.5
              bg-zinc-800 hover:bg-zinc-700
              text-white font-medium
              rounded-lg
              transition-colors
              disabled:opacity-50
            `}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`
              flex-1 px-4 py-2.5
              bg-red-500 hover:bg-red-600
              text-white font-medium
              rounded-lg
              transition-colors
              disabled:opacity-50
              flex items-center justify-center gap-2
            `}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removendo...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Remover
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function AdminImageControls({
  arquivoId,
  isAdmin,
  onDelete,
}: AdminImageControlsProps) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Só mostrar para admins
  if (!isAdmin) return null;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/comunidades/upload?arquivo_id=${arquivoId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        onDelete?.(arquivoId);
        setShowModal(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao remover imagem');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao remover imagem');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Botão de deletar */}
      <button
        onClick={() => setShowModal(true)}
        className={`
          absolute top-2 right-2 z-10
          p-1.5 rounded-lg
          bg-red-500/80 hover:bg-red-500
          text-white
          opacity-0 group-hover:opacity-100
          transition-all duration-200
          shadow-lg
        "
        title="Remover imagem (Admin)`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Modal de confirmação */}
      <ConfirmDeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
