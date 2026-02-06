'use client'

import { useState } from 'react'
import { X, Copy, Share2, Download, ChevronDown, ChevronUp } from 'lucide-react'

interface AnalysisResultProps {
  isOpen: boolean
  onClose: () => void
  analysisType: 'baseline' | 'comparison'
  resultText: string
  fpSpent?: number
  newBalance?: number
  baselineId?: string
  comparisonId?: string
}

export function AnalysisResult({
  isOpen,
  onClose,
  analysisType,
  resultText,
  fpSpent,
  newBalance,
  baselineId,
  comparisonId,
}: AnalysisResultProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([resultText], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `analise-${analysisType}-${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const title = analysisType === 'baseline' ? 'Análise Baseline' : 'Análise Comparativa'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title} ✓</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Payment Info */}
          {fpSpent !== undefined && newBalance !== undefined && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Resumo da Operação</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">FP Gastos</p>
                  <p className="text-lg font-bold text-orange-600">{fpSpent} FP</p>
                </div>
                <div>
                  <p className="text-gray-600">Novo Saldo</p>
                  <p className="text-lg font-bold text-green-600">{newBalance} FP</p>
                </div>
              </div>
            </div>
          )}

          {/* Free Baseline Info */}
          {analysisType === 'baseline' && fpSpent === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-semibold">
                ✓ Primeira análise baseline foi grátis!
              </p>
            </div>
          )}

          {/* Analysis Text */}
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors mb-2"
            >
              <h3 className="font-semibold text-gray-900">Resultado da Análise</h3>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {isExpanded && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{resultText}</p>
                </div>
              </div>
            )}
          </div>

          {/* IDs */}
          {(baselineId || comparisonId) && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1 font-mono">
              {baselineId && (
                <p>
                  <span className="font-semibold">ID Baseline:</span> {baselineId}
                </p>
              )}
              {comparisonId && (
                <p>
                  <span className="font-semibold">ID Comparação:</span> {comparisonId}
                </p>
              )}
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Próximos Passos</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {analysisType === 'baseline' ? (
                <>
                  <li>✓ Baseline criado com sucesso</li>
                  <li>✓ Retorne para comparações futuras</li>
                  <li>✓ Comparações custam FP, mas revelam progresso</li>
                </>
              ) : (
                <>
                  <li>✓ Comparação criada com sucesso</li>
                  <li>✓ Analise bem os pontos de melhoria</li>
                  <li>✓ Crie um plano de ação baseado nos resultados</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Baixar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
