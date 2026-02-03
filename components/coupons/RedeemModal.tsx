'use client';

/**
 * Modal de Resgate de Cupons
 * Permite usuário converter FP em cupons de desconto
 */

import { useState } from 'react';
import { X, Ticket, Coins, Clock, Sparkles } from 'lucide-react';
import { COUPON_TIERS, getAvailableTiers, calculateDiscountedPrice } from '@/lib/coupons/coupon-tiers';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  fpBalance: number;
  userId: string;
  onRedeemSuccess: (coupon: any) => void;
}

export function RedeemModal({
  isOpen,
  onClose,
  fpBalance,
  userId,
  onRedeemSuccess,
}: RedeemModalProps) {
  const [redeeming, setRedeeming] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const availableTiers = getAvailableTiers(fpBalance);

  const handleRedeem = async (tierId: string) => {
    if (redeeming) return;

    setRedeeming(true);
    setSelectedTier(tierId);

    try {
      const response = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });

      const data = await response.json();

      if (data.success && data.coupon) {
        onRedeemSuccess(data.coupon);
        onClose();
      } else {
        alert(data.error || 'Erro ao resgatar cupom');
      }
    } catch (error) {
      console.error('Error redeeming coupon:', error);
      alert('Erro ao resgatar cupom');
    } finally {
      setRedeeming(false);
      setSelectedTier(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-700 rounded-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <Ticket className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Resgatar Cupom</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Converta seu Engajamento em Desconto
          </h2>
          <p className="text-zinc-400">
            Use seus Fitness Points para obter descontos exclusivos no App Premium
          </p>
        </div>

        {/* FP Balance */}
        <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-400">{fpBalance}</span>
            <span className="text-zinc-500">FP Disponíveis</span>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {COUPON_TIERS.map((tier) => {
            const isAvailable = fpBalance >= tier.fpCost;
            const isSelected = selectedTier === tier.id;

            return (
              <div
                key={tier.id}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  isAvailable
                    ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500 hover:bg-emerald-500/10 cursor-pointer'
                    : 'border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isAvailable && !redeeming && handleRedeem(tier.id)}
              >
                {/* Badge */}
                <div className="text-center mb-4">
                  <span className="text-5xl">{tier.badge}</span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-white text-center mb-2">
                  {tier.name}
                </h3>

                {/* Discount */}
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-emerald-400">
                    {tier.discountPercent}% OFF
                  </span>
                </div>

                {/* Plan Type */}
                <p className="text-sm text-zinc-400 text-center mb-4">
                  {tier.description}
                </p>

                {/* Cost */}
                <div className="flex items-center justify-center gap-2 p-3 bg-zinc-900 rounded-lg mb-4">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-white">{tier.fpCost} FP</span>
                </div>

                {/* Button */}
                <button
                  disabled={!isAvailable || redeeming}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    isAvailable
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:opacity-90'
                      : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  {redeeming && isSelected ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resgatando...
                    </span>
                  ) : isAvailable ? (
                    'Resgatar Agora'
                  ) : (
                    `Faltam ${tier.fpCost - fpBalance} FP`
                  )}
                </button>

                {/* Sparkles for available */}
                {isAvailable && (
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-400 mb-1">
                Validade de 48 Horas
              </p>
              <p className="text-xs text-zinc-400">
                Os cupons expiram em 48 horas após o resgate. Use-os rapidamente para
                garantir seu desconto no App Premium!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
