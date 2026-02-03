'use client';

import { useEffect, useState } from 'react';
import { FlaskConical, Trophy } from 'lucide-react';

interface ABVariant {
  id: string;
  name: string;
  message: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export function ABTestResults() {
  const [variants, setVariants] = useState<ABVariant[]>([]);
  const [winner, setWinner] = useState<ABVariant | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/ab-test').then(r => r.json()).then(d => {
      if (d.success) {
        setVariants(d.data.variants);
        setWinner(d.data.winner);
        setConfidence(d.data.confidence);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse bg-zinc-800 h-64 rounded-lg" />;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-blue-400" />
          A/B Test: Mensagens de Conversão
        </h3>
        {winner && (
          <div className="text-sm text-emerald-400">
            Confiança: {confidence.toFixed(0)}%
          </div>
        )}
      </div>
      <div className="space-y-3">
        {variants.map(v => (
          <div key={v.id} className={`p-4 rounded-lg border ${
            winner?.id === v.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800 border-zinc-700'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{v.name}</span>
                  {winner?.id === v.id && <Trophy className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="text-sm text-zinc-400 mt-1">{v.message}</div>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {v.conversionRate.toFixed(1)}%
              </div>
            </div>
            <div className="flex gap-4 text-xs text-zinc-500">
              <span>{v.impressions} impressões</span>
              <span>{v.conversions} conversões</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
