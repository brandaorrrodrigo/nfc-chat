'use client';

/**
 * ChatInput - Input Avançado
 * ===========================
 *
 * Input de chat com recursos avançados
 * Design premium e feminino 💕✨
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  Paperclip,
  Mic,
  Image,
  Camera,
  Calendar,
  UtensilsCrossed,
  Dumbbell,
  Scale,
  Heart,
  Droplets,
  Moon,
  X,
} from 'lucide-react';
import { SuggestionChip } from './SuggestionCard';

export interface ChatInputProps {
  onSend: (message: string) => void;
  onAttachment?: (file: File) => void;
  onVoice?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  remainingCredits?: number;
  isPremium?: boolean;
  placeholder?: string;
}

const suggestionTopics = [
  { emoji: '🌸', text: 'Meu ciclo menstrual' },
  { emoji: '🍽️', text: 'Cardápio de hoje' },
  { emoji: '💪', text: 'Treino para hoje' },
  { emoji: '⚖️', text: 'Atualizar peso' },
  { emoji: '💕', text: 'Como estou me sentindo' },
  { emoji: '💧', text: 'Meta de água' },
];

export default function ChatInput({
  onSend,
  onAttachment,
  onVoice,
  isLoading = false,
  disabled = false,
  remainingCredits = 47,
  isPremium = false,
  placeholder = 'Pergunte qualquer coisa... Dra. Sofia está aqui! 💕',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || isLoading || disabled) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAttachment) {
      onAttachment(file);
    }
    setShowAttachMenu(false);
  };

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        {/* Suggestions Bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {suggestionTopics.map((topic, idx) => (
            <SuggestionChip
              key={idx}
              emoji={topic.emoji}
              text={topic.text}
              onClick={() => handleSuggestionClick(topic.text)}
            />
          ))}
        </div>

        {/* Input Container */}
        <div className="relative group">
          {/* Glow Effect */}
          <div
            className={`
              absolute -inset-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-purple-400
              rounded-2xl blur-lg transition-opacity duration-300
              ${isFocused ? 'opacity-30' : 'opacity-0'}
            `}
          />

          {/* Input Box */}
          <div
            className={`
              relative flex items-end gap-2 bg-white rounded-2xl p-2
              border-2 transition-all duration-200
              ${isFocused
                ? 'border-transparent ring-2 ring-teal-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {/* Emoji Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="shrink-0 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              title="Emojis 😊"
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none min-h-[44px] max-h-[120px] py-2.5 text-gray-900 placeholder-gray-500"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Attach Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Anexar 📎"
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>

                {/* Attach Dropdown */}
                {showAttachMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[160px] animate-fadeIn">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                    >
                      <Image className="w-4 h-4 text-teal-500" />
                      Foto 📷
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                    >
                      <Camera className="w-4 h-4 text-purple-500" />
                      Câmera 📸
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                      Refeição 🍽️
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                    >
                      <Scale className="w-4 h-4 text-pink-500" />
                      Peso ⚖️
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Button */}
              <button
                onClick={onVoice}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Mensagem de voz 🎤"
              >
                <Mic className="w-5 h-5 text-gray-500" />
              </button>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!canSend}
                className={`
                  relative p-3 rounded-xl transition-all duration-200
                  ${canSend
                    ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}

                {/* Pulse effect when ready */}
                {canSend && !isLoading && (
                  <span className="absolute inset-0 rounded-xl bg-white/20 animate-ping" />
                )}
              </button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Credits Display */}
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1">
            {isPremium ? (
              <>
                <span className="text-base">💎</span>
                <span className="text-purple-600 font-medium">Premium</span> - Mensagens ilimitadas
              </>
            ) : (
              <>
                <span className="text-base">✨</span>
                <strong className="text-teal-600">{remainingCredits}</strong> mensagens restantes hoje
              </>
            )}
          </span>
          {!isPremium && (
            <a
              href="/planos"
              className="text-teal-600 hover:text-teal-700 font-medium transition-colors flex items-center gap-1"
            >
              Fazer upgrade 💕 →
            </a>
          )}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-400 mt-2 text-center">
          Enter para enviar • Shift + Enter para nova linha
        </p>
      </div>

      {/* Emoji Picker Overlay */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 p-4 bg-white rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Emojis 😊</span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {['😊', '💕', '🥗', '💪', '🔥', '✨', '🌟', '💎', '🎯', '🍳', '🥑', '🏃‍♀️', '😴', '💧', '🌸', '👑'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setMessage((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
