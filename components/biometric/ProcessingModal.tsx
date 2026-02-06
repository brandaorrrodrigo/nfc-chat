'use client'

import { Zap } from 'lucide-react'

interface ProcessingModalProps {
  isOpen: boolean
  analysisType: 'baseline' | 'comparison'
  stage: 'validating' | 'processing' | 'saving' | 'complete'
}

export function ProcessingModal({ isOpen, analysisType, stage }: ProcessingModalProps) {
  if (!isOpen) return null

  const stages = {
    validating: {
      label: 'Validando imagens...',
      progress: 25,
      description: 'Verificando qualidade e requisitos das fotos',
    },
    processing: {
      label: 'Processando análise...',
      progress: 60,
      description: 'IA analisando padrões posturais e assimetrias',
    },
    saving: {
      label: 'Salvando resultado...',
      progress: 90,
      description: 'Armazenando análise no banco de dados',
    },
    complete: {
      label: 'Análise concluída!',
      progress: 100,
      description: 'Redirecionando...',
    },
  }

  const currentStage = stages[stage]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-center gap-3 justify-center">
            <div className="relative w-8 h-8">
              <Zap className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-center">
              Análise {analysisType === 'baseline' ? 'Baseline' : 'Comparativa'}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900 text-center">{currentStage.label}</p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${currentStage.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 text-center">{currentStage.progress}%</p>
          </div>

          {/* Description */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">{currentStage.description}</p>
          </div>

          {/* Stage Indicators */}
          <div className="space-y-2">
            {Object.entries(stages).map(([key, data]) => {
              const stageOrder = ['validating', 'processing', 'saving', 'complete']
              const isComplete = stageOrder.indexOf(key) <= stageOrder.indexOf(stage)
              const isCurrent = key === stage

              return (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isComplete
                        ? isCurrent
                          ? 'bg-blue-500 text-white animate-pulse'
                          : 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isComplete && !isCurrent ? '✓' : stageOrder.indexOf(key) + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      isCurrent
                        ? 'font-semibold text-gray-900'
                        : isComplete
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {data.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Helpful Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 Não feche esta janela. Processamento pode levar até 30 segundos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
