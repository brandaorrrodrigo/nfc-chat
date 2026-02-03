'use client';

/**
 * Card de Cupom - Exibe cupom gerado
 * Mostra código, desconto, expiração e status
 */

import { Ticket, Copy, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface CouponCardProps {
  coupon: {
    id: string;
    code: string;
    tierName: string;
    discountPercent: number;
    planType: string;
    status: 'ACTIVE' | 'USED' | 'EXPIRED';
    createdAt: string;
    expiresAt: string;
    usedAt?: string;
  };
}

export function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = () => {
    switch (coupon.status) {
      case 'ACTIVE':
        return 'from-emerald-500 to-cyan-500';
      case 'USED':
        return 'from-blue-500 to-purple-500';
      case 'EXPIRED':
        return 'from-zinc-600 to-zinc-700';
    }
  };

  const getStatusText = () => {
    switch (coupon.status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'USED':
        return 'Usado';
      case 'EXPIRED':
        return 'Expirado';
    }
  };

  const getStatusIcon = () => {
    switch (coupon.status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'USED':
        return <CheckCircle className="w-4 h-4" />;
      case 'EXPIRED':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getTimeRemaining = () => {
    if (coupon.status !== 'ACTIVE') return null;

    const now = new Date();
    const expires = new Date(coupon.expiresAt);
    const diffMs = expires.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours < 0) return 'Expirado';
    if (diffHours === 0) return `${diffMinutes} minutos`;
    return `${diffHours}h ${diffMinutes}min`;
  };

  const getPlanTypeName = () => {
    switch (coupon.planType) {
      case 'monthly':
        return 'Mensal';
      case 'quarterly':
        return 'Trimestral';
      case 'annual':
        return 'Anual';
      default:
        return coupon.planType;
    }
  };

  return (
    <div
      className={`relative p-6 rounded-xl bg-gradient-to-br ${getStatusColor()} ${
        coupon.status === 'EXPIRED' ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">{coupon.tierName}</span>
        </div>

        <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
          {getStatusIcon()}
          <span className="text-xs font-semibold text-white">{getStatusText()}</span>
        </div>
      </div>

      {/* Discount */}
      <div className="mb-4">
        <p className="text-5xl font-bold text-white mb-1">
          {coupon.discountPercent}% OFF
        </p>
        <p className="text-sm text-white/80">Plano {getPlanTypeName()}</p>
      </div>

      {/* Code */}
      <div
        className="mb-4 p-4 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition"
        onClick={handleCopy}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/60 mb-1">Código do Cupom</p>
            <p className="text-xl font-mono font-bold text-white tracking-wider">
              {coupon.code}
            </p>
          </div>
          <button
            className="p-2 hover:bg-white/10 rounded-lg transition"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Copy className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Time Remaining */}
      {coupon.status === 'ACTIVE' && (
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Clock className="w-4 h-4" />
          <span>Expira em {getTimeRemaining()}</span>
        </div>
      )}

      {/* Used Date */}
      {coupon.status === 'USED' && coupon.usedAt && (
        <p className="text-xs text-white/60">
          Usado em {new Date(coupon.usedAt).toLocaleDateString('pt-BR')}
        </p>
      )}

      {/* Expired Date */}
      {coupon.status === 'EXPIRED' && (
        <p className="text-xs text-white/60">
          Expirou em {new Date(coupon.expiresAt).toLocaleDateString('pt-BR')}
        </p>
      )}
    </div>
  );
}

/**
 * Success Notification - Aparece após resgatar cupom
 */
interface CouponSuccessProps {
  coupon: {
    code: string;
    tierName: string;
    discountPercent: number;
    planType: string;
  };
  onClose: () => void;
}

export function CouponSuccessNotification({ coupon, onClose }: CouponSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-emerald-900 to-cyan-900 border-2 border-emerald-500 rounded-2xl max-w-md w-full p-8 text-center">
        {/* Sparkles */}
        <div className="absolute -top-4 -right-4 text-yellow-400 text-6xl animate-bounce">
          ✨
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
            <Ticket className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white mb-2">Parabéns! 🎉</h2>
        <p className="text-emerald-200 mb-6">
          Sua participação na arena gerou um desconto exclusivo!
        </p>

        {/* Discount */}
        <div className="mb-6 p-6 bg-white/10 rounded-xl">
          <p className="text-6xl font-bold text-white mb-2">
            {coupon.discountPercent}% OFF
          </p>
          <p className="text-sm text-emerald-200">{coupon.tierName}</p>
        </div>

        {/* Code */}
        <div className="mb-6">
          <p className="text-sm text-emerald-200 mb-2">Código do Cupom:</p>
          <div
            className="p-4 bg-black/30 rounded-lg cursor-pointer hover:bg-black/40 transition"
            onClick={handleCopy}
          >
            <p className="text-2xl font-mono font-bold text-white tracking-wider mb-2">
              {coupon.code}
            </p>
            <button
              className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar código
                </>
              )}
            </button>
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://app.nutrifitcoach.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition mb-4"
        >
          Usar Cupom no App →
        </a>

        {/* Close */}
        <button
          onClick={onClose}
          className="text-sm text-emerald-300 hover:text-white transition"
        >
          Fechar
        </button>

        {/* Warning */}
        <p className="mt-4 text-xs text-emerald-200/60">
          ⏰ Válido por 48 horas
        </p>
      </div>
    </div>
  );
}
