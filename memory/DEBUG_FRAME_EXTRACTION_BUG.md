# 🔍 Debug: Frame Extraction Bug - Remada com Cotovelo 135.1°

## Problema Identificado

**Cotovelo em 135.1° no pico parecia suspeito** — isso é quase extensão completa (180°), não contração real para remada (~60-90°).

## Root Cause: Frame Extraction Timing

### O Bug (lib/vision/video-analysis.ts:169)

```typescript
// ❌ ERRADO
const interval = duration / (framesCount + 1);
```

**Consequência:** Com 6 frames extraídos de um vídeo de 10 segundos:
- interval = 10 / 7 = **1.43 segundos**
- Frames extraídos em: **1.43s, 2.86s, 4.29s, 5.71s, 7.14s, 8.57s**
- **Resultado: Apenas 85.7% do vídeo coberto, perdendo ~1.43s no final**

### Por Que Isso Quebra Exercises de PULL (Remada)

1. **Remada = movimento repetido** — múltiplas repetições em sequência
2. **Contração máxima no final da série** — últimas repetições frequentemente têm melhor técnica
3. **Frames não cobrem o final** — extracting até t=8.57s perde as últimas repetições
4. **MediaPipe calcula min/max sobre todos os frames**:
   - `minAngles.elbow_left = min(todos os frames)`
   - Se os últimos frames (com flexão máxima) não foram capturados, o "mínimo" é maior que o real
   - Resulta em ROM artificialmente baixo e peakAngle suspeito (135° em vez de 60-80°)

## A Solução

### Código Corrigido

```typescript
// ✅ CORRETO — divide o vídeo em N segmentos iguais
const interval = duration / framesCount;

// Exemplo com duration=10s, framesCount=6:
// interval = 10 / 6 = 1.667s
// Frames em: 1.667s, 3.333s, 5s, 6.667s, 8.333s, 10s
// Cobertura: 100% do vídeo
```

### Alternativa (se quer incluir frame zero)

```typescript
const interval = duration / (framesCount - 1);
// Frames em: 0s, 2.5s, 5s, 7.5s, 10s (para 5 frames)
```

## Impacto nos Dados Biomecânicos

### Antes (buggy)

| Exercício | Problema | Causa |
|-----------|----------|-------|
| **Remada** | Cotovelo min=135.1° → ROM baixo | Últimos frames perdidos |
| **Terra** | Quadril pode estar superstimado | Frames iniciais têm boa postura |
| **Agachamento** | Knee ROM depende da distribuição | Aleatório se cai em boas repetições |

### Depois (corrigido)

Frames cobrem **100% do vídeo** → MediaPipe captura **real min/max** de cada articulação.

## Implementação

✅ **Correção aplicada em:**
- `lib/vision/video-analysis.ts` (linha 169)

⚠️ **Próximas ações:**
1. Rebuild do projeto
2. Re-análise dos 3 vídeos de teste:
   - `va_1770817487770_noye0o9k1` (agachamento)
   - `va_1770817584163_afof17p9k` (terra)
   - `va_1770817621743_j5dzbciws` (puxadas)
3. Verificar novo cotovelo peakAngle em remada (deve ser ~60-90° now)

## Verificação Técnica

### Como Confirmar

Execute o endpoint de análise com logging augmented (já adicionado em route.ts):

```bash
curl -X POST http://localhost:3000/api/biomechanics/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoId":"va_1770817621743_j5dzbciws"}'
```

Procure por:
- `[Biomechanics] Motor joints - elbow_L: min=... max=...`
- Deve mostrar elbow_left: **min ≤ 80°** agora (em vez de 135°)
- **Cada frame listará elbow_left/right separadamente**

## Raiz Profunda

A fórmula `duration / (framesCount + 1)` parece ser um **off-by-one error** clássico:
- Talvez pensava-se em "espaços entre frames" em vez de "posições de frames"
- Em 6 frames, há 7 "espaços" se incluir antes do primeiro e depois do último
- Mas isso não faz sentido quando quer cobrir 100% da duração

**Lição:** Sempre verify frame coverage = (last_timestamp / duration) × 100%
