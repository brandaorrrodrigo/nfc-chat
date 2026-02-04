/**
 * Página Principal - Server Component
 *
 * Este é um server component que envolve ComunidadesPageClient com ComunidadesAuthProvider
 * para garantir que o hook useComunidadesAuth() funcione corretamente.
 */

import { ComunidadesAuthProvider } from './components/comunidades/ComunidadesAuthContext';
import ComunidadesPageClient from './ComunidadesPageClient';

export default function ComunidadesPage() {
  return (
    <ComunidadesAuthProvider>
      <ComunidadesPageClient />
    </ComunidadesAuthProvider>
  );
}
