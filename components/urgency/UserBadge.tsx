'use client';

/**
 * User Badge Component
 * Mostra badge do usuário (Early Adopter, etc)
 */

import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';

export function UserBadge() {
  const [badge, setBadge] = useState<string | null>(null);
  const [isEarlyAdopter, setIsEarlyAdopter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadge();
  }, []);

  const fetchBadge = async () => {
    try {
      const res = await fetch('/api/urgency/badge');
      if (res.ok) {
        const data = await res.json();
        setBadge(data.badge);
        setIsEarlyAdopter(data.isEarlyAdopter);
      }
    } catch (error) {
      console.error('Error fetching badge:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !badge) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-lg ${
        isEarlyAdopter
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      }`}
    >
      <Award className="w-4 h-4" />
      <span>{badge}</span>
    </div>
  );
}
