'use client';

/**
 * Expiration Alert Component
 * Alerta de cupom próximo de expirar
 */

import { useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';

interface ExpiringCoupon {
  id: string;
  code: string;
  discountPercent: number;
  tierName: string;
  hoursRemaining: number;
  expiresAt: string;
}

export function ExpirationAlert() {
  const [coupons, setCoupons] = useState<ExpiringCoupon[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpiringCoupons();
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchExpiringCoupons, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchExpiringCoupons = async () => {
    try {
      // Buscar cupons do usuário
      const res = await fetch('/api/coupons/list?status=ACTIVE');
      if (res.ok) {
        const data = await res.json();

        // Filtrar cupons expirando em menos de 12h
        const now = new Date();
        const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

        const expiring = data.coupons.filter((c: any) => {
          const expiresAt = new Date(c.expiresAt);
          return expiresAt <= twelveHoursFromNow && expiresAt > now;
        }).map((c: any) => {
          const hoursRemaining = Math.floor(
            (new Date(c.expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60)
          );
          return {
            id: c.id,
            code: c.code,
            discountPercent: c.discountPercent,
            tierName: c.tierName,
            hoursRemaining,
            expiresAt: c.expiresAt,
          };
        });

        setCoupons(expiring);
      }
    } catch (error) {
      console.error('Error fetching expiring coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (couponId: string) => {
    setDismissed(prev => new Set(prev).add(couponId));
  };

  const handleUseNow = (code: string) => {
    // Copiar código e redirecionar para checkout
    navigator.clipboard.writeText(code);
    window.open(
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.nutrifitcoach.com'}/checkout?coupon=${code}`,
      '_blank'
    );
  };

  const visibleCoupons = coupons.filter(c => !dismissed.has(c.id));

  if (loading || visibleCoupons.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md">
      {visibleCoupons.map((coupon) => (
        <div
          key={coupon.id}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg shadow-2xl animate-bounce"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold text-sm">⏰ Cupom Expirando!</span>
            </div>
            <button
              onClick={() => handleDismiss(coupon.id)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              Seu cupom de <strong>{coupon.discountPercent}% OFF</strong> expira
              em <strong>{coupon.hoursRemaining}h</strong>!
            </p>

            <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-2 font-mono text-center">
              {coupon.code}
            </div>

            <button
              onClick={() => handleUseNow(coupon.code)}
              className="w-full bg-white text-red-600 font-bold py-2 rounded hover:bg-red-50 transition-colors"
            >
              Usar Agora
            </button>

            <p className="text-xs text-white/80 text-center">
              Expira em: {new Date(coupon.expiresAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
