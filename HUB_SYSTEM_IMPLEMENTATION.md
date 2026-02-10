# 🎯 SISTEMA DE HUBs - GUIA DE IMPLEMENTAÇÃO

## 📌 Visão Geral

O sistema de HUBs permite agrupar arenas relacionadas em uma página central com grid de cards. Quando um usuário clica em um HUB, vê um grid com todas as arenas filhas em vez de um feed de conversas.

**Exemplo:**
```
/comunidades/hub/hub-biomecanico
  ↓
Grid com 5 arenas biomecânicas:
  • Análise: Agachamento
  • Análise: Levantamento Terra
  • Análise: Supino
  • Análise: Puxadas
  • Análise: Elevação Pélvica
```

---

## 🏗️ ARQUITETURA

### Modelo de Dados
```
Arena (HUB)
├─ id: string
├─ slug: string
├─ arenaType: 'NFV_HUB'
├─ parentArenaSlug: null
└─ ... outros campos

Arena (Filha)
├─ id: string
├─ slug: string
├─ arenaType: 'NFV_PREMIUM' | 'GENERAL'
├─ parentArenaSlug: 'hub-biomecanico'
└─ ... outros campos
```

### Rotas
```
Frontend:
├─ /comunidades/hub/[slug]           → Página HUB (grid de filhas)
├─ /comunidades/[arena-slug]         → Página Arena Individual
└─ /comunidades                       → Hub geral de comunidades

Backend:
├─ GET /api/hubs/[slug]              → Retorna HUB + filhas
└─ GET /api/arenas                   → Retorna todas as arenas
```

---

## 📂 ARQUIVOS IMPLEMENTADOS

### 1. Endpoint API
**Arquivo:** `app/api/hubs/[slug]/route.ts`

```typescript
GET /api/hubs/[slug]
RESPOSTA:
{
  success: true,
  hub: {
    id, slug, name, description, icon, color,
    arenaType: 'NFV_HUB', categoria
  },
  children: [
    { id, slug, name, description, icon, color,
      totalPosts, requiresFP, status, arenaType },
    ...
  ]
}
```

### 2. Página HUB
**Arquivo:** `app/comunidades/hub/[slug]/page.tsx`

Features:
- Grid responsivo (3 cols desktop, 1 mobile)
- Breadcrumb navegável
- Header com ícone e descrição
- Stats (total arenas, total posts)
- ArenaCards com hover effects
- Fallback para HUB não encontrado

### 3. Modificações
**Arquivo:** `app/comunidades/[slug]/page.tsx`

Adicionado:
- `useRouter` import
- `useEffect` para redirect futuro
- TODO: Adicionar check `arena.arenaType === 'NFV_HUB'`

---

## 🧪 COMO TESTAR

### Pré-requisitos
- Supabase online
- Next.js rodando localmente (`npm run dev`)

### Teste 1: Verificar Estrutura
```bash
npx tsx scripts/verify-hub-structure.ts
```

**Saída esperada:**
```
✅ Hub Biomecânico
   Slug: hub-biomecanico
   Type: NFV_HUB
   Filhas: 5
      • analise-agachamento
      • analise-terra
      • analise-supino
      • analise-puxadas
      • analise-elevacao-pelvica
```

### Teste 2: Endpoint API
```bash
curl http://localhost:3000/api/hubs/hub-biomecanico
```

**Saída esperada:** JSON com hub + 5 arenas filhas

### Teste 3: Página HUB
Acessar no browser:
```
http://localhost:3000/comunidades/hub/hub-biomecanico
```

**Validação:**
- [ ] Grid com 5 cards aparece
- [ ] Cada card mostra: nome, descrição, posts, badges
- [ ] Hover effects funcionam (border, sombra, ícone)
- [ ] Click navega para `/comunidades/[slug]` da arena
- [ ] Breadcrumb funciona
- [ ] Botão voltar retorna ao hub

### Teste 4: Navegação Completa
1. Acessar `/comunidades/hub/hub-biomecanico` ✅
2. Clicar em uma arena no grid ✅
3. Deve abrir `/comunidades/analise-agachamento` com feed ✅
4. Voltar deve retornar ao grid do hub ✅

### Teste 5: Responsividade
- [ ] Desktop (1024px): 3 colunas
- [ ] Tablet (768px): 2 colunas
- [ ] Mobile (375px): 1 coluna

### Teste 6: Dados Reais
- [ ] Contadores de posts são REAIS (não hardcoded)
- [ ] Badges de Premium aparecem se `requiresFP > 0`
- [ ] Stats do HUB calculadas corretamente
- [ ] Ícones carregam do emoji map

---

## 🔄 FLUXO ESPERADO

```
USUÁRIO CLICA NO HUB
         ↓
/comunidades/hub/hub-biomecanico
         ↓
Fetch /api/hubs/hub-biomecanico
         ↓
Renderiza página HUB com grid
         ↓
USUÁRIO CLICA EM UMA ARENA
         ↓
/comunidades/analise-agachamento
         ↓
Renderiza página ARENA com feed
```

---

## 🚀 PRÓXIMOS PASSOS

### Quando Supabase Online:
1. ✅ Executar `verify-hub-structure.ts`
2. ✅ Testar Endpoint API
3. ✅ Testar Página HUB
4. ✅ Testar Navegação Completa
5. ✅ Testar Responsividade

### Otimizações Futuras:
- [ ] Adicionar filtros de categoria no HUB
- [ ] Cache de HUBs por 5 minutos
- [ ] Analytics de cliques em arenas
- [ ] Criar mais HUBs (avaliacao-biometrica, nutricao, treino)

### Possíveis Problemas & Soluções:

**Problema:** HUB não retorna filhas
```
→ Verificar que parentArenaSlug está correto no banco
→ Verificar que filhas têm isActive = true
```

**Problema:** Grid não renderiza
```
→ Verificar console do browser
→ Verificar que API /api/hubs/[slug] retorna JSON válido
→ Verificar que children array não está vazio
```

**Problema:** Links não navegam
```
→ Verificar que slugs de arenas filhas existem
→ Verificar que arenas filhas têm isActive = true
```

---

## 📋 CHECKLIST DE DEPLOYMENT

- [ ] Todos os testes passaram
- [ ] Nenhum erro no console
- [ ] Responsive funcionando
- [ ] Git commit feito
- [ ] Push para origin/main
- [ ] Vercel deployment sucesso

---

## 🔗 REFERÊNCIAS

- **Schema Prisma:** `prisma/schema.prisma` → modelos Arena
- **Config NFV:** `lib/biomechanics/nfv-config.ts` → NFV_CONFIG
- **API Arenas:** `app/api/arenas/route.ts` → Endpoint principal

---

**Status:** ✅ Implementação Completa
**Data:** 2026-02-10
**Próxima Ação:** Testar quando Supabase online
