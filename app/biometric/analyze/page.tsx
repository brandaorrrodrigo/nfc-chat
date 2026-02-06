'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { FPBalance } from '@/components/biometric/FPBalance'
import { ImageUploader, BiometricImages } from '@/components/biometric/ImageUploader'
import { PaywallModal } from '@/components/biometric/PaywallModal'
import { ProcessingModal } from '@/components/biometric/ProcessingModal'
import { AnalysisResult } from '@/components/biometric/AnalysisResult'
import { AlertCircle, Zap, ArrowRight } from 'lucide-react'

const BASELINE_COST_FP = 0 // Primeira é grátis
const COMPARISON_COST_FP = 25

interface AnalysisState {
  type: 'idle' | 'validating' | 'processing' | 'saving' | 'complete' | 'error'
  operationType: 'baseline' | 'comparison'
  errorMessage?: string
}

interface ResultData {
  success: boolean
  analysis?: string
  fpSpent?: number
  newBalance?: number
  baselineId?: string
  comparisonId?: string
  error?: string
  message?: string
}

export default function BiometricAnalyzePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [images, setImages] = useState<BiometricImages>({})
  const [description, setDescription] = useState('')
  const [selectedMode, setSelectedMode] = useState<'baseline' | 'comparison' | null>(null)
  const [baselineId, setBaselineId] = useState<string | null>(null)

  // UI States
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    type: 'idle',
    operationType: 'baseline',
  })
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallData, setPaywallData] = useState({
    requiredFP: 0,
    currentBalance: 0,
    shortfall: 0,
  })
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [showResult, setShowResult] = useState(false)

  // Verificar autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Autenticação Necessária</h1>
          <p className="text-gray-600 mb-6">Faça login para acessar as análises biométricas.</p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Ir para Login
          </button>
        </div>
      </div>
    )
  }

  // Funções principais
  const handleAnalyzeBaseline = useCallback(async () => {
    if (!session?.user?.id) return

    const requiredImages = images.frontal && images.lateral && images.posterior
    if (!requiredImages) {
      alert('Por favor, envie as 3 fotos: frente, perfil e costas')
      return
    }

    setSelectedMode('baseline')
    setAnalysisState({ type: 'validating', operationType: 'baseline' })

    try {
      // Simular validação
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAnalysisState({ type: 'processing', operationType: 'baseline' })

      // Chamar endpoint
      const response = await fetch('/api/biometric/baseline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images,
          description: description || 'Baseline inicial',
        }),
      })

      const data = await response.json()

      // Simular saving
      setAnalysisState({ type: 'saving', operationType: 'baseline' })
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar baseline')
      }

      // Sucesso
      setAnalysisState({ type: 'complete', operationType: 'baseline' })
      setBaselineId(data.baseline_id)
      setResultData({
        success: true,
        analysis: data.analysis,
        fpSpent: 0,
        baselineId: data.baseline_id,
        message: data.message,
      })
      setShowResult(true)

      // Reset após 2 segundos
      setTimeout(() => {
        setAnalysisState({ type: 'idle', operationType: 'baseline' })
        setImages({})
        setDescription('')
      }, 2000)
    } catch (error) {
      console.error('Erro ao analisar baseline:', error)
      setAnalysisState({
        type: 'error',
        operationType: 'baseline',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }, [images, description, session?.user?.id])

  const handleAnalyzeComparison = useCallback(async () => {
    if (!baselineId) {
      alert('Crie um baseline primeiro')
      return
    }

    if (!session?.user?.id) return

    const requiredImages = images.frontal && images.lateral && images.posterior
    if (!requiredImages) {
      alert('Por favor, envie as 3 fotos: frente, perfil e costas')
      return
    }

    setSelectedMode('comparison')
    setAnalysisState({ type: 'validating', operationType: 'comparison' })

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAnalysisState({ type: 'processing', operationType: 'comparison' })

      const response = await fetch('/api/biometric/comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseline_id: baselineId,
          images,
          description: description || 'Reavaliação comparativa',
        }),
      })

      const data = await response.json()

      // Se paywall bloqueou
      if (response.status === 402) {
        setPaywallData({
          requiredFP: data.required_fps,
          currentBalance: data.current_balance,
          shortfall: data.shortfall,
        })
        setShowPaywall(true)
        setAnalysisState({ type: 'idle', operationType: 'comparison' })
        return
      }

      setAnalysisState({ type: 'saving', operationType: 'comparison' })
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar comparação')
      }

      setAnalysisState({ type: 'complete', operationType: 'comparison' })
      setResultData({
        success: true,
        analysis: data.analysis,
        fpSpent: data.fps_deducted,
        newBalance: data.new_balance,
        comparisonId: data.comparison_id,
        message: data.message,
      })
      setShowResult(true)

      setTimeout(() => {
        setAnalysisState({ type: 'idle', operationType: 'comparison' })
        setImages({})
        setDescription('')
      }, 2000)
    } catch (error) {
      console.error('Erro ao analisar comparação:', error)
      setAnalysisState({
        type: 'error',
        operationType: 'comparison',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      })
    }
  }, [baselineId, images, description, session?.user?.email])

  const isProcessing = analysisState.type !== 'idle' && analysisState.type !== 'error'

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Avaliação Biométrica NFV</h1>
          </div>
          <p className="text-blue-100">Análise técnica objetiva do seu corpo. Sem achismos, só evidência visual.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Saldo FP */}
        <div className="mb-6">
          <FPBalance />
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Baseline Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 border-b border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">📸</span>
                  <h2 className="text-2xl font-bold text-gray-900">Análise Baseline</h2>
                </div>
                <p className="text-green-700 font-semibold text-sm">Grátis para primeira análise</p>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  Crie um baseline biométrico. Suas primeiras fotos serão comparadas com futuras avaliações para
                  rastrear progresso.
                </p>

                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ 3 fotos (frente, perfil, costas)</li>
                  <li>✓ Análise IA completa</li>
                  <li>✓ Armazenado para futuras comparações</li>
                  <li>✓ Grátis para nova conta</li>
                </ul>

                <button
                  onClick={() => setSelectedMode('baseline')}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  Iniciar Baseline
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Comparison Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 border-b border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🔄</span>
                  <h2 className="text-2xl font-bold text-gray-900">Comparação</h2>
                </div>
                <p className="text-blue-700 font-semibold text-sm">{COMPARISON_COST_FP} FP por análise</p>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  Reavalie seu corpo e compare com o baseline anterior. Veja exatamente o que mudou.
                </p>

                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Requer baseline anterior</li>
                  <li>✓ 3 fotos atualizadas</li>
                  <li>✓ Comparação automática</li>
                  <li>✓ Rastreamento de progresso</li>
                </ul>

                <button
                  onClick={() => {
                    if (!baselineId) {
                      alert('Crie um baseline primeiro')
                      return
                    }
                    setSelectedMode('comparison')
                  }}
                  disabled={!baselineId}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comparar Agora
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Mode */}
        {selectedMode && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedMode === 'baseline' ? 'Análise Baseline' : 'Análise Comparativa'}
              </h2>
              <button
                onClick={() => {
                  setSelectedMode(null)
                  setImages({})
                  setDescription('')
                }}
                disabled={isProcessing}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Voltar
              </button>
            </div>

            {/* Image Uploader */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Envie suas fotos</h3>
              <ImageUploader onImagesChange={setImages} disabled={isProcessing} />
            </div>

            {/* Protocol Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seu protocolo atual (opcional)</h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isProcessing}
                placeholder="Ex: Treino de hipertrofia 4x/semana, dieta 2800 kcal, whey protein..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-2">Ajuda a IA contextualizar a análise</p>
            </div>

            {/* Error Message */}
            {analysisState.type === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <p className="text-red-700 font-semibold">{analysisState.errorMessage}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex gap-4">
              <button
                onClick={selectedMode === 'baseline' ? handleAnalyzeBaseline : handleAnalyzeComparison}
                disabled={isProcessing || (!images.frontal && !images.lateral && !images.posterior)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-5 h-5" />
                {isProcessing ? 'Processando...' : selectedMode === 'baseline' ? 'Analisar Baseline' : 'Comparar Agora'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProcessingModal
        isOpen={analysisState.type !== 'idle' && analysisState.type !== 'error' && analysisState.type !== 'complete'}
        analysisType={analysisState.operationType}
        stage={analysisState.type as any}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        requiredFP={paywallData.requiredFP}
        currentBalance={paywallData.currentBalance}
        shortfall={paywallData.shortfall}
        operationType="comparison"
        onPurchaseClick={() => {
          router.push('/fp/purchase')
        }}
      />

      {resultData && (
        <AnalysisResult
          isOpen={showResult}
          onClose={() => {
            setShowResult(false)
            setSelectedMode(null)
            setImages({})
            setDescription('')
          }}
          analysisType={analysisState.operationType}
          resultText={resultData.analysis || 'Análise concluída'}
          fpSpent={resultData.fpSpent}
          newBalance={resultData.newBalance}
          baselineId={resultData.baselineId}
          comparisonId={resultData.comparisonId}
        />
      )}
    </div>
  )
}
