'use client';

import { ComunidadesAuthProvider } from './components/comunidades/ComunidadesAuthContext';
import ComunidadesPageClient from './ComunidadesPageClient';

export default function ComunidadesPage() {
  return (
    <ComunidadesAuthProvider>
      <ComunidadesPageClient />
    </ComunidadesAuthProvider>
  );
}
