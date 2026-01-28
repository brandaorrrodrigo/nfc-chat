'use client';

/**
 * Chat Layout Client 💕
 *
 * Componente cliente do layout do Chat IA
 * Com UniversalHeader e design feminino ✨
 */

import UniversalHeader from '@/components/shared/UniversalHeader';

export default function ChatLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-purple-50/30">
      {/* Header Fixo com backdrop blur 💕 */}
      <UniversalHeader
        variant="chat"
        showLogo={true}
      />

      {/* Conteúdo com padding-top para compensar header fixo */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}
