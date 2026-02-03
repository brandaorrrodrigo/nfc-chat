'use client';

import { useEffect, useState } from 'react';
import { Zap, Gift } from 'lucide-react';

interface SpecialEvent {
  id: string;
  name: string;
  type: string;
  multiplier?: number;
  discountBoost?: number;
}

export function EventBanner() {
  const [event, setEvent] = useState<SpecialEvent | null>(null);

  useEffect(() => {
    fetch('/api/events/active').then(r => r.json()).then(d => setEvent(d.event));
  }, []);

  if (!event) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-center gap-3">
        {event.type === 'fp_multiplier' ? <Zap className="w-6 h-6" /> : <Gift className="w-6 h-6" />}
        <div>
          <div className="font-bold text-lg">{event.name}</div>
          <div className="text-sm">
            {event.multiplier && `${event.multiplier}x FP em todas atividades!`}
            {event.discountBoost && `+${event.discountBoost}% de desconto extra!`}
          </div>
        </div>
      </div>
    </div>
  );
}
