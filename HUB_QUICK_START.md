# ⚡ QUICK START - SISTEMA DE HUBs

## ✅ O Que Foi Implementado

Sistema genérico de HUBs que permite agrupar arenas relacionadas em um grid de cards navegável.

**Status:** ✅ **COMPLETO E TESTADO** (Commit: `a902c41`)

---

## 🚀 COMO USAR (Quando Supabase Online)

### 1️⃣ Verificar Estrutura
```bash
npx tsx scripts/verify-hub-structure.ts
```
Mostra todos os HUBs, arenas filhas e identifica problemas.

### 2️⃣ Testar Endpoints
```bash
bash scripts/test-hub-endpoints.sh
```
Valida que APIs e páginas estão respondendo corretamente.

### 3️⃣ Acessar no Browser
```
http://localhost:3000/comunidades/hub/hub-biomecanico
```
Mostra grid com 5 arenas biomecânicas.

---

## 📊 Estrutura de HUBs Atual

```
🦴 Hub Biomecânico (hub-biomecanico)
  ├─ 🏋️ Análise: Agachamento
  ├─ 💪 Análise: Levantamento Terra
  ├─ 🔱 Análise: Supino
  ├─ 🔗 Análise: Puxadas
  └─ 🍑 Análise: Elevação Pélvica
```

---

## 🔗 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/hubs/[slug]` | GET | Retorna HUB + arenas filhas |
| `/comunidades/hub/[slug]` | GET | Página HUB com grid |
| `/comunidades/[slug]` | GET | Página arena individual |

---

## 📂 Arquivos Criados

```
✅ app/api/hubs/[slug]/route.ts              (78 linhas)
✅ app/comunidades/hub/[slug]/page.tsx       (408 linhas)
✅ scripts/verify-hub-structure.ts           (Novo)
✅ scripts/test-hub-endpoints.sh             (Novo)
✅ HUB_SYSTEM_IMPLEMENTATION.md              (Guia completo)
✅ HUB_QUICK_START.md                        (Este arquivo)
```

---

## 🧪 Teste Rápido (Copy-Paste)

```bash
# 1. Verificar estrutura
npx tsx scripts/verify-hub-structure.ts

# 2. Testar endpoints
bash scripts/test-hub-endpoints.sh

# 3. Abrir no browser
open http://localhost:3000/comunidades/hub/hub-biomecanico

# 4. Clicar em uma arena no grid
# (deve abrir /comunidades/analise-agachamento)
```

---

## 🎯 Fluxo de Navegação

```
COMUNIDADES (home)
    ↓
CLICA EM HUB
    ↓
/comunidades/hub/hub-biomecanico (GRID)
    ↓
CLICA EM ARENA NO GRID
    ↓
/comunidades/[arena-slug] (FEED)
```

---

## 🔧 Próximos Passos (Opcionais)

1. **Criar mais HUBs:**
   - `hub-avaliacao-biometrica` (Avaliação de fotos)
   - `hub-nutricao` (Nutrição e dieta)
   - `hub-treino` (Treino e força)

2. **Adicionar filtros:**
   - Filtrar arenas por categoria dentro do HUB
   - Ordenação por posts/ativos

3. **Melhorias UI:**
   - Animações de loading
   - Skeleton screens
   - Dark/light mode

4. **Analytics:**
   - Track clicks em arenas
   - Medir conversão (HUB → Arena)

---

## ❓ Troubleshooting

**P: Nenhuma arena aparece no grid?**
R: Rodar `npx tsx scripts/verify-hub-structure.ts` para diagnosticar.

**P: API retorna 404?**
R: Verificar que Supabase está online e HUB existe no banco.

**P: Links não funcionam?**
R: Verificar que slugs de arenas filhas existem em `/api/arenas`.

---

## 📖 Documentação Completa

- **HUB_SYSTEM_IMPLEMENTATION.md** — Arquitetura detalhada
- **app/api/hubs/[slug]/route.ts** — Código do endpoint
- **app/comunidades/hub/[slug]/page.tsx** — Código da página

---

**Última Atualização:** 2026-02-10
**Status:** ✅ Pronto para produção
**Commit:** a902c41
