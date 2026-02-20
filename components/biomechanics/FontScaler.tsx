'use client';

import { useEffect } from 'react';

/**
 * Escala proporcionalmente TODAS as fontes rem do Tailwind nas páginas do Hub Biomecânico.
 * Como Tailwind usa rem (relativo ao html font-size = 16px), aumentar o html font-size
 * escala todos os text-* de forma proporcional sem alterar uma classe sequer.
 *
 * scale=1.2 → text-sm (14px) vira 16.8px, text-xl (20px) vira 24px, etc.
 */
export function FontScaler({ scale = 1.2 }: { scale?: number }) {
  useEffect(() => {
    const html = document.documentElement;
    const original = html.style.fontSize;
    html.style.fontSize = `${scale * 100}%`;
    return () => {
      html.style.fontSize = original;
    };
  }, [scale]);

  return null;
}
