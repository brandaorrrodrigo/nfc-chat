/**
 * EditableMessage - Componente de edição inline de mensagem
 *
 * Textarea para editar conteúdo da mensagem com:
 * - Preview em tempo real
 * - Contador de caracteres
 * - Botões salvar/cancelar
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';

const MAX_LENGTH = 2000;

interface EditableMessageProps {
  messageId: string;
  initialContent: string;
  onSave: (newContent: string) => Promise<void>;
  onCancel: () => void;
}

export function EditableMessage({
  messageId,
  initialContent,
  onSave,
  onCancel,
}: EditableMessageProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focar no textarea ao montar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Colocar cursor no final
      textareaRef.current.setSelectionRange(content.length, content.length);
    }
  }, []);

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Handler de salvamento
  async function handleSave() {
    const trimmedContent = content.trim();

    // Validações
    if (!trimmedContent) {
      setError('A mensagem não pode estar vazia');
      return;
    }

    if (trimmedContent === initialContent) {
      onCancel();
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      setError(`Máximo de ${MAX_LENGTH} caracteres`);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(trimmedContent);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar. Tente novamente.');
      setIsSaving(false);
    }
  }

  // Handler de teclas
  function handleKeyDown(e: React.KeyboardEvent) {
    // ESC para cancelar
    if (e.key === 'Escape') {
      onCancel();
    }
    // Ctrl+Enter para salvar
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  }

  const hasChanges = content.trim() !== initialContent;
  const isOverLimit = content.length > MAX_LENGTH;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-3"
    >
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className={`
            w-full p-4 rounded-xl resize-none
            bg-zinc-800/50 border transition-all duration-200
            text-white placeholder-zinc-500
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isOverLimit
              ? 'border-red-500/50 focus:border-red-400 focus:ring-red-500/30'
              : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-500/30'
            }
          `}
          rows={3}
          placeholder="Edite sua mensagem..."
        />

        {/* Indicador de carregamento */}
        {isSaving && (
          <div className="absolute inset-0 bg-zinc-900/50 rounded-xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Erro */}
      {error && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Contador de caracteres */}
        <div className="flex items-center gap-3">
          <span className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-zinc-500'}`}>
            {content.length}/{MAX_LENGTH}
          </span>

          {hasChanges && !isOverLimit && (
            <span className="text-xs text-purple-400">
              Alterações pendentes
            </span>
          )}
        </div>

        {/* Botões */}
        <div className="flex items-center gap-2">
          {/* Cancelar */}
          <button
            onClick={onCancel}
            disabled={isSaving}
            className={`
              px-4 py-2 rounded-lg
              bg-zinc-800 hover:bg-zinc-700
              text-zinc-300 transition-colors
              flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm
            `}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </button>

          {/* Salvar */}
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges || isOverLimit}
            className={`
              px-4 py-2 rounded-lg
              bg-purple-500 hover:bg-purple-600
              text-white font-medium transition-colors
              flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm
            `}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isSaving ? 'Salvando...' : 'Salvar'}
            </span>
          </button>
        </div>
      </div>

      {/* Dica de atalho */}
      <p className="text-xs text-zinc-600 text-right">
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Ctrl</kbd>
        {' + '}
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Enter</kbd>
        {' para salvar • '}
        <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Esc</kbd>
        {' para cancelar'}
      </p>
    </motion.div>
  );
}

export default EditableMessage;
