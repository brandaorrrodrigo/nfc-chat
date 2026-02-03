'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export function ComboBuilder() {
  const [codes, setCodes] = useState<string[]>([]);
  const [newCode, setNewCode] = useState('');
  const [result, setResult] = useState<any>(null);

  const addCode = () => {
    if (newCode && codes.length < 3) {
      setCodes([...codes, newCode]);
      setNewCode('');
    }
  };

  const removeCode = (index: number) => {
    setCodes(codes.filter((_, i) => i !== index));
  };

  const validateCombo = async () => {
    const res = await fetch('/api/combo/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponCodes: codes }),
    });
    const data = await res.json();
    setResult(data.data);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h3 className="font-semibold text-white mb-4">Combo de Cupons</h3>

      <div className="space-y-3 mb-4">
        {codes.map((code, i) => (
          <div key={i} className="flex items-center gap-2 bg-zinc-800 p-3 rounded">
            <span className="flex-1 font-mono text-white">{code}</span>
            <button onClick={() => removeCode(i)} className="text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {codes.length < 3 && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            placeholder="Código do cupom"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white"
          />
          <button onClick={addCode} className="bg-emerald-500 hover:bg-emerald-600 p-2 rounded">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {codes.length > 0 && (
        <button
          onClick={validateCombo}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg"
        >
          Validar Combo
        </button>
      )}

      {result && (
        <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400 mb-2">
            {result.finalDiscount}% OFF Total
          </div>
          {result.totalDiscount > result.finalDiscount && (
            <div className="text-sm text-yellow-400">
              (Limitado a 40% - original: {result.totalDiscount}%)
            </div>
          )}
          {result.errors.length > 0 && (
            <div className="mt-2 text-sm text-red-400">
              {result.errors.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
