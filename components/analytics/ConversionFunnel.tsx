'use client';

import { useEffect, useState } from 'react';
import { TrendingDown } from 'lucide-react';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

export function ConversionFunnel() {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/funnel').then(r => r.json()).then(d => {
      if (d.success) setStages(d.data.stages);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse bg-zinc-800 h-64 rounded-lg" />;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingDown className="w-5 h-5 text-emerald-400" />
        Funil de Conversão
      </h3>
      <div className="space-y-4">
        {stages.map((stage, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">{stage.name}</span>
              <span className="text-white font-bold">{stage.count}</span>
            </div>
            <div className="h-12 bg-zinc-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-between px-4"
                   style={{ width: `${stage.percentage}%` }}>
                <span className="text-white text-sm font-bold">{stage.percentage.toFixed(1)}%</span>
              </div>
            </div>
            {stage.dropOffRate > 0 && (
              <div className="text-xs text-red-400 mt-1">
                ↓ {stage.dropOffRate.toFixed(1)}% drop-off
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
