'use client';

/**
 * Chat Layout Client 💕
 *
 * Componente cliente do layout do Chat IA
 * Design feminino ✨
 *
 * NOTA: O UniversalHeader é renderizado globalmente pelo providers.tsx
 * Não adicionar header aqui para evitar duplicação!
 */

export default function ChatLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30">
      {/* Conteúdo - header já está no providers.tsx global */}
      {children}
    </div>
  );
}
