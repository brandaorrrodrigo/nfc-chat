'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface HeatmapData {
  hours: Array<{ hour: number; count: number; intensity: number }>;
  peakHour: number;
  peakCount: number;
}

export function Heatmap() {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/heatmap').then(r => r.json()).then(d => {
      if (d.success) setData(d.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse bg-zinc-800 h-48 rounded-lg" />;
  if (!data) return null;

  const getIntensityColor = (intensity: number) => {
    if (intensity > 75) return 'bg-emerald-500';
    if (intensity > 50) return 'bg-emerald-600';
    if (intensity > 25) return 'bg-emerald-700';
    return 'bg-zinc-700';
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          Heatmap por Hora
        </h3>
        <div className="text-sm text-zinc-400">
          Pico: <span className="text-emerald-400 font-bold">{data.peakHour}h</span>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {data.hours.map(h => (
          <div key={h.hour} className="text-center">
            <div className={`w-full h-12 ${getIntensityColor(h.intensity)} rounded transition-all hover:scale-110`}
                 title={`${h.hour}h: ${h.count} conversões`} />
            <div className="text-xs text-zinc-500 mt-1">{h.hour}h</div>
          </div>
        ))}
      </div>
    </div>
  );
}
