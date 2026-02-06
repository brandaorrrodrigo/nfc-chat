'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, CheckCircle } from 'lucide-react'

export interface BiometricImages {
  frontal?: string
  lateral?: string
  posterior?: string
}

interface ImageUploaderProps {
  onImagesChange: (images: BiometricImages) => void
  disabled?: boolean
}

interface PreviewImage {
  frontal?: string
  lateral?: string
  posterior?: string
}

export function ImageUploader({ onImagesChange, disabled = false }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<PreviewImage>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRefs = {
    frontal: useRef<HTMLInputElement>(null),
    lateral: useRef<HTMLInputElement>(null),
    posterior: useRef<HTMLInputElement>(null),
  }

  const positions = [
    { key: 'frontal' as const, label: 'Frente', icon: '📸', description: 'Corpo inteiro de frente' },
    { key: 'lateral' as const, label: 'Perfil', icon: '➡️', description: 'Corpo inteiro de lado' },
    { key: 'posterior' as const, label: 'Costas', icon: '🔙', description: 'Corpo inteiro de costas' },
  ]

  const handleFileSelect = async (position: 'frontal' | 'lateral' | 'posterior', file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert('Imagem muito grande. Máximo 5MB')
      return
    }

    try {
      setUploadProgress((prev) => ({ ...prev, [position]: 0 }))

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const current = prev[position] || 0
          if (current >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return { ...prev, [position]: current + Math.random() * 30 }
        })
      }, 100)

      // Convert to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setPreviews((prev) => ({ ...prev, [position]: base64 }))
        onImagesChange({
          ...previews,
          [position]: base64,
        })
        setUploadProgress((prev) => ({ ...prev, [position]: 100 }))

        // Reset progress after 500ms
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[position]
            return newProgress
          })
        }, 500)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      alert('Erro ao processar imagem')
    }
  }

  const handleRemoveImage = (position: 'frontal' | 'lateral' | 'posterior') => {
    setPreviews((prev) => {
      const newPreviews = { ...prev }
      delete newPreviews[position]
      return newPreviews
    })
    onImagesChange({
      ...previews,
      [position]: undefined,
    })
    if (fileInputRefs[position].current) {
      fileInputRefs[position].current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {positions.map((position) => (
          <div
            key={position.key}
            className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-blue-400 transition-colors"
          >
            <input
              ref={fileInputRefs[position.key]}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(position.key, file)
              }}
              disabled={disabled}
              className="hidden"
              aria-label={`Upload foto ${position.label}`}
            />

            {previews[position.key] ? (
              // Preview da imagem
              <div className="relative bg-gray-100 aspect-square">
                <Image
                  src={previews[position.key]!}
                  alt={position.label}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center group">
                  <button
                    onClick={() => handleRemoveImage(position.key)}
                    disabled={disabled}
                    className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status de Upload */}
                {uploadProgress[position.key] !== undefined && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-white border-t-blue-400 animate-spin"></div>
                  </div>
                )}

                {/* Checkmark se completo */}
                {uploadProgress[position.key] === undefined && uploadProgress[position.key] !== 0 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            ) : (
              // Zona de upload
              <button
                onClick={() => fileInputRefs[position.key].current?.click()}
                disabled={disabled}
                className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 disabled:opacity-50 flex flex-col items-center justify-center gap-2 transition-colors p-4"
              >
                <span className="text-3xl">{position.icon}</span>
                <p className="font-semibold text-gray-700">{position.label}</p>
                <div className="flex items-center gap-1 text-blue-600 text-sm">
                  <Upload className="w-4 h-4" />
                  <span>Selecionar</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{position.description}</p>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Dicas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📸 Dicas de Foto</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Corpo inteiro visível (cabeça aos pés)</li>
          <li>✓ Roupa justa que permite ver contornos</li>
          <li>✓ Postura natural e relaxada</li>
          <li>✓ Fundo neutro e iluminação adequada</li>
          <li>✓ Máximo 5MB por imagem</li>
        </ul>
      </div>

      {/* Status */}
      <div className="flex gap-2 text-sm">
        {['frontal', 'lateral', 'posterior'].map((pos) => (
          <div
            key={pos}
            className={`flex items-center gap-1 px-2 py-1 rounded ${
              previews[pos as keyof typeof previews]
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className="capitalize">{pos}</span>
            {previews[pos as keyof typeof previews] && <CheckCircle className="w-3 h-3" />}
          </div>
        ))}
      </div>
    </div>
  )
}
