'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

interface Cohort {
  fpRange: string;
  totalUsers: number;
  converted: number;
  conversionRate: number;
  avgTimeToConvert: number;
}

export function CohortTable() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/cohorts').then(r => r.json()).then(d => {
      if (d.success) setCohorts(d.data.cohorts);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse bg-zinc-800 h-64 rounded-lg" />;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-400" />
        Análise de Cohort (por FP)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800">
            <tr>
              <th className="text-left text-zinc-400 pb-3">Faixa FP</th>
              <th className="text-right text-zinc-400 pb-3">Usuários</th>
              <th className="text-right text-zinc-400 pb-3">Convertidos</th>
              <th className="text-right text-zinc-400 pb-3">Taxa</th>
              <th className="text-right text-zinc-400 pb-3">Tempo Médio</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c, i) => (
              <tr key={i} className="border-b border-zinc-800/50">
                <td className="py-3 text-white font-medium">{c.fpRange}</td>
                <td className="text-right text-zinc-300">{c.totalUsers}</td>
                <td className="text-right text-emerald-400">{c.converted}</td>
                <td className="text-right">
                  <span className="text-purple-400 font-bold">{c.conversionRate.toFixed(1)}%</span>
                </td>
                <td className="text-right text-zinc-400">{c.avgTimeToConvert}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
