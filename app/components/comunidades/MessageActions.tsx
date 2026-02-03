/**
 * MessageActions - Dropdown de ações para mensagens
 *
 * Exibe menu com opções de editar e excluir mensagem.
 * - Edição: disponível por 15 minutos após envio
 * - Exclusão: disponível a qualquer momento (para o autor)
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit2, Trash2, AlertCircle, X } from 'lucide-react';

// Limite de tempo para edição (minutos)
const EDIT_TIME_LIMIT_MINUTES = 15;

interface MessageActionsProps {
  messageId: string;
  authorId: string;
  currentUserId: string;
  createdAt: Date | string;
  onEdit: () => void;
  onDelete: () => void;
}

export function MessageActions({
  messageId,
  authorId,
  currentUserId,
  createdAt,
  onEdit,
  onDelete,
}: MessageActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Só o autor pode ver o menu
  const isAuthor = authorId === currentUserId;

  // Calcular se ainda pode editar (usar estado para evitar hydration mismatch)
  const canDelete = isAuthor;
  const [canEdit, setCanEdit] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(EDIT_TIME_LIMIT_MINUTES);

  useEffect(() => {
    const createdDate = new Date(createdAt);
    const minutesSinceCreation = (Date.now() - createdDate.getTime()) / 1000 / 60;
    setCanEdit(isAuthor && minutesSinceCreation < EDIT_TIME_LIMIT_MINUTES);
    setMinutesRemaining(Math.max(0, EDIT_TIME_LIMIT_MINUTES - minutesSinceCreation));
  }, [createdAt, isAuthor]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Não renderizar se não for o autor
  if (!isAuthor) return null;

  return (
    <>
      <div ref={menuRef} className="relative">
        {/* Botão do menu */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            p-1.5 rounded-lg transition-all duration-200
            ${isOpen
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }
          `}
          aria-label="Opções da mensagem"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className={`
                absolute right-0 top-8 z-50 w-52
                bg-zinc-900 border border-purple-500/30
                rounded-xl shadow-lg shadow-purple-500/10
                overflow-hidden
              `}
            >
              {/* Opção Editar */}
              {canEdit ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onEdit();
                  }}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3
                    text-white hover:bg-purple-500/20 transition-colors
                    text-left text-sm
                  `}
                >
                  <Edit2 className="w-4 h-4 text-purple-400" />
                  <div className="flex-1">
                    <span>Editar</span>
                    <span className="ml-2 text-xs text-zinc-500">
                      ({Math.floor(minutesRemaining)}min restantes)
                    </span>
                  </div>
                </button>
              ) : (
                <div className="px-4 py-3 flex items-center gap-2 text-zinc-500 text-xs border-b border-zinc-800">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Edição disponível por {EDIT_TIME_LIMIT_MINUTES}min</span>
                </div>
              )}

              {/* Opção Excluir */}
              {canDelete && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowDeleteConfirm(true);
                  }}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3
                    text-red-400 hover:bg-red-500/20 transition-colors
                    text-left text-sm border-t border-zinc-800
                  `}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                bg-zinc-900 rounded-2xl p-6 max-w-md w-full
                border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]
              `}
            >
              <div className="text-center">
                {/* Ícone */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-white mb-2">
                  Excluir mensagem?
                </h3>

                {/* Descrição */}
                <p className="text-zinc-400 text-sm mb-6">
                  Esta ação não pode ser desfeita. Sua mensagem será removida permanentemente.
                </p>

                {/* Botões */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`
                      flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700
                      text-white rounded-xl transition-colors
                    `}
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={() => {
                      onDelete();
                      setShowDeleteConfirm(false);
                    }}
                    className={`
                      flex-1 px-4 py-3 bg-red-500 hover:bg-red-600
                      text-white rounded-xl transition-colors font-bold
                    `}
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {/* Botão fechar */}
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MessageActions;
