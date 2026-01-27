'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface Voice {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

export interface SpeechConfig {
  rate?: number; // 0.1 to 10 (default: 1)
  pitch?: number; // 0 to 2 (default: 1)
  volume?: number; // 0 to 1 (default: 1)
  voice?: SpeechSynthesisVoice | null;
}

export interface UseSpeechSynthesisReturn {
  speak: (text: string, config?: SpeechConfig) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  voices: Voice[];
  getVoicesForLanguage: (locale: string) => Voice[];
}

/**
 * Hook for Text-to-Speech using browser SpeechSynthesis API (FREE)
 * Supports 10 languages and customizable voice settings
 */
export function useSpeechSynthesis(locale: string = 'pt-BR'): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<Voice[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if SpeechSynthesis is supported
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const voiceList = availableVoices.map(voice => ({
        voice,
        name: voice.name,
        lang: voice.lang,
      }));
      setVoices(voiceList);
    };

    // Voices may load asynchronously
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  /**
   * Get voices for a specific language
   */
  const getVoicesForLanguage = useCallback((targetLocale: string): Voice[] => {
    // Map locale to language code (e.g., 'pt-BR' -> 'pt')
    const langCode = targetLocale.split('-')[0];

    return voices.filter(v => {
      const voiceLang = v.lang.split('-')[0];
      return voiceLang === langCode || v.lang === targetLocale;
    });
  }, [voices]);

  /**
   * Speak text with optional configuration
   */
  const speak = useCallback((text: string, config: SpeechConfig = {}) => {
    if (!isSupported || !window.speechSynthesis) {
      console.error('SpeechSynthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice settings
    utterance.rate = config.rate ?? 1;
    utterance.pitch = config.pitch ?? 1;
    utterance.volume = config.volume ?? 1;
    utterance.lang = locale;

    // Select voice
    if (config.voice) {
      utterance.voice = config.voice;
    } else {
      // Auto-select best voice for locale
      const voicesForLang = getVoicesForLanguage(locale);
      if (voicesForLang.length > 0) {
        // Prefer local voices over remote
        const localVoice = voicesForLang.find(v => v.voice.localService);
        utterance.voice = localVoice?.voice || voicesForLang[0].voice;
      }
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    // Store reference and speak
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, locale, getVoicesForLanguage]);

  /**
   * Pause current speech
   */
  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }, [isSupported]);

  /**
   * Resume paused speech
   */
  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  /**
   * Cancel/stop current speech
   */
  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  }, [isSupported]);

  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    getVoicesForLanguage,
  };
}
