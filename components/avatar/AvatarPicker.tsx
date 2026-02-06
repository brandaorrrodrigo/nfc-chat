/**
 * Componente de seleção de avatar para usuários
 * Permite escolher entre 30 avatares pré-definidos
 */

import React, { useState } from 'react';
import Image from 'next/image';

interface Avatar {
  id: string;
  sexo: 'M' | 'F';
  idade_range: string;
  biotipo: string;
  estilo: string;
  img: string;
  initials_color: string;
  tags: string[];
}

interface AvatarPickerProps {
  onSelect: (avatar: Avatar) => void;
  selectedAvatarId?: string;
  userGender?: 'M' | 'F';
  className?: string;
}

export function AvatarPicker({
  onSelect,
  selectedAvatarId,
  userGender,
  className = ''
}: AvatarPickerProps) {
  const [filter, setFilter] = useState<'all' | 'M' | 'F'>(userGender || 'all');
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar avatares
  React.useEffect(() => {
    fetch('/api/avatars/catalog')
      .then(res => res.json())
      .then(data => {
        setAvatars(data.avatars);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar avatares:', err);
        setLoading(false);
      });
  }, []);

  // Filtrar avatares
  const filteredAvatars = filter === 'all'
    ? avatars
    : avatars.filter(a => a.sexo === filter);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Título */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Escolha seu avatar
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Selecione um avatar ou faça upload da sua foto
        </p>
      </div>

      {/* Filtros */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({avatars.length})
        </button>
        <button
          onClick={() => setFilter('F')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'F'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Feminino ({avatars.filter(a => a.sexo === 'F').length})
        </button>
        <button
          onClick={() => setFilter('M')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'M'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Masculino ({avatars.filter(a => a.sexo === 'M').length})
        </button>
      </div>

      {/* Grid de avatares */}
      <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-2">
        {filteredAvatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar)}
            className={`relative aspect-square rounded-lg overflow-hidden transition-all hover:scale-105 ${
              selectedAvatarId === avatar.id
                ? 'ring-4 ring-blue-500 ring-offset-2'
                : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-300'
            }`}
            title={`${avatar.estilo} - ${avatar.idade_range} anos`}
          >
            <Image
              src={avatar.img}
              alt={avatar.id}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback para iniciais se imagem não carregar
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  const div = document.createElement('div');
                  div.className = 'absolute inset-0 flex items-center justify-center text-white font-bold text-xl';
                  div.style.backgroundColor = avatar.initials_color;
                  div.textContent = avatar.id.substring(7, 9).toUpperCase();
                  target.parentElement.appendChild(div);
                }
              }}
            />

            {/* Indicador de seleção */}
            {selectedAvatarId === avatar.id && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Info do avatar selecionado */}
      {selectedAvatarId && (
        <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          {(() => {
            const selected = avatars.find(a => a.id === selectedAvatarId);
            if (!selected) return null;
            return (
              <div className="space-y-1">
                <p className="font-medium text-gray-900">Avatar selecionado</p>
                <p>
                  {selected.sexo === 'F' ? 'Feminino' : 'Masculino'} • {selected.idade_range} anos • {selected.biotipo}
                </p>
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  {selected.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
