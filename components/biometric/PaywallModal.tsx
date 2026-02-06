'use client'

import { Zap, X, AlertCircle, ArrowRight } from 'lucide-react'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  requiredFP: number
  currentBalance: number
  shortfall: number
  operationType: 'baseline' | 'comparison'
  onPurchaseClick?: () => void
}

export function PaywallModal({
  isOpen,
  onClose,
  requiredFP,
  currentBalance,
  shortfall,
  operationType,
  onPurchaseClick,
}: PaywallModalProps) {
  if (!isOpen) return null

  const titles = {
    baseline: 'Análise Baseline',
    comparison: 'Análise Comparativa',
  }

  const descriptions = {
    baseline: 'Sua primeira análise baseline é grátis! Depois, cada nova análise custa FP.',
    comparison: 'Comparar sua forma atual com o baseline anterior custa FP.',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">FP Insuficientes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Situation */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">{titles[operationType]}</h3>
            <p className="text-sm text-gray-700">{descriptions[operationType]}</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Seu saldo:</span>
                <span className="font-semibold text-gray-900">{currentBalance} FP</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Necessário:</span>
                <span className="font-semibold text-orange-600">{requiredFP} FP</span>
              </div>
            </div>
          </div>

          {/* Shortfall Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-center">
              <span className="text-sm font-semibold text-red-700">
                Faltam <span className="text-lg">{shortfall} FP</span>
              </span>
            </p>
          </div>

          {/* FP Info */}
          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Como conseguir FP?</p>
            <ul className="space-y-1 ml-4">
              <li>• Completar avaliações biométricas: +50 FP</li>
              <li>• Participar de comunidades: +10 FP por mês</li>
              <li>• Plano Premium: FP ilimitado</li>
              <li>• Compras diretas: pacotes FP em promoção</li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onPurchaseClick}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              Comprar FP
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            💡 Primeira análise baseline é sempre grátis para novos usuários
          </p>
        </div>
      </div>
    </div>
  )
}
