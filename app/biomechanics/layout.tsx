/**
 * Layout para seção de análise biomecânica
 */

import Link from 'next/link';
import { FontScaler } from '@/components/biomechanics/FontScaler';

export const metadata = {
  title: 'Dashboard Biomecânico - NutriFitCoach',
  description: 'Análise avançada de movimento e técnica de exercício',
};

export default function BiomechanicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FontScaler scale={1.2} />
      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/biomechanics"
                className="text-white font-semibold hover:text-cyan-400 transition"
              >
                Início
              </Link>
              <Link
                href="/biomechanics/dashboard"
                className="text-slate-400 hover:text-white transition"
              >
                Dashboard
              </Link>
              <Link
                href="/biomechanics/videos"
                className="text-slate-400 hover:text-white transition"
              >
                Vídeos Analisados
              </Link>
            </div>
            <div className="text-slate-400 text-sm">
              Sistema de Análise Biomecânica v2.0
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
