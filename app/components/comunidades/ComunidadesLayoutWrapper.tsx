'use client';

/**
 * ComunidadesLayoutWrapper
 *
 * Client wrapper para o layout das comunidades.
 * Encapsula o provider de auth para uso no layout server-side.
 */

import { ComunidadesAuthProvider } from './ComunidadesAuthContext';

export default function ComunidadesLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ComunidadesAuthProvider>
      {children}
    </ComunidadesAuthProvider>
  );
}
