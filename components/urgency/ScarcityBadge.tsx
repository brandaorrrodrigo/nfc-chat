'use client';

/**
 * Scarcity Badge Component
 * Mostra alerta de escassez para tier específico
 */

import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

interface ScarcityBadgeProps {
  tierId: string;
}

export function ScarcityBadge({ tierId }: ScarcityBadgeProps) {
  const [message, setMessage] = useState<string>('');
  const [shouldShow, setShouldShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScarcity();
  }, [tierId]);

  const fetchScarcity = async () => {
    try {
      const res = await fetch(`/api/urgency/scarcity?tierId=${tierId}`);
      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
        setShouldShow(data.shouldShow);
      }
    } catch (error) {
      console.error('Error fetching scarcity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !shouldShow || !message) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg animate-pulse">
      <Flame className="w-3.5 h-3.5" />
      <span>{message}</span>
    </div>
  );
}
