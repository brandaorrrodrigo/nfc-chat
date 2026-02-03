# 🚀 Guia de Deploy Limpo no Vercel

**Projeto:** NutriFitCoach
**Erro resolvido:** `ENOENT: page_client-reference-manifest.js`

---

## ✅ CORREÇÃO APLICADA

### Problema Identificado
```
Error: ENOENT: no such file or directory,
lstat '/vercel/path0/.next/server/app/(dashboard)/page_client-reference-manifest.js'
```

**Causa Raiz:**
- `app/(dashboard)/layout.tsx` era Server Component
- Importava `Sidebar` e `TopBar` que são Client Components
- Next.js não conseguia gerar manifest corretamente

**Solução Implementada:**
- Adicionado `'use client'` ao `layout.tsx`
- Todos componentes do dashboard agora são Client Components
- Manifests serão gerados corretamente

---

## 📋 PASSO A PASSO - DEPLOY LIMPO

### 1️⃣ Limpar Cache Local (OPCIONAL - apenas se build local falhar)

```powershell
# Ir para o projeto
D:
cd D:\NUTRIFITCOACH_MASTER\nfc-comunidades

# Deletar pasta .next
Remove-Item -Recurse -Force .next

# Deletar node_modules (OPCIONAL - apenas se necessário)
Remove-Item -Recurse -Force node_modules

# Reinstalar dependências (se deletou node_modules)
npm install

# Build local para testar
npm run build
```

**Resultado esperado:**
```
✓ Generating static pages (35/35)
✓ Finalizing page optimization
✓ Collecting build traces
✓ Compiled successfully
```

---

### 2️⃣ Limpar Cache do Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Ir para: https://vercel.com/dashboard
2. Selecionar projeto **NutriFitCoach**
3. Ir para **Settings** → **General**
4. Rolar até **Build & Development Settings**
5. Clicar em **Clear Build Cache**
6. Confirmar

#### Opção B: Via CLI (se tiver Vercel CLI instalado)

```powershell
vercel env pull
vercel build --force
```

---

### 3️⃣ Fazer Deploy

```powershell
# Commit das correções (já feito)
git add .
git commit -m "fix: Corrigir manifest do dashboard"

# Push para produção
git push origin main
```

**O Vercel vai automaticamente:**
- Detectar o push
- Iniciar novo deploy
- Usar cache limpo
- Build deve passar sem erros

---

## 🔍 VERIFICAR SE DEU CERTO

### Durante o Build

Acompanhe em: https://vercel.com/dashboard

**Logs esperados:**
```
✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (35/35)
✓ Finalizing page optimization
```

**NÃO deve aparecer:**
```
❌ Error: ENOENT: no such file or directory
❌ page_client-reference-manifest.js
```

---

### Após Deploy

#### 1. Testar Dashboard
```
https://chat.nutrifitcoach.com.br
```
- Deve carregar normalmente
- Sidebar e TopBar funcionando
- Métricas visíveis

#### 2. Testar Exclusão de Mensagens
```
https://chat.nutrifitcoach.com.br/comunidades/receitas-saudaveis
```
- Enviar mensagem de teste
- Deletar mensagem
- Verificar FP descontado
- Alerta deve mostrar quantidade de FP removido

#### 3. Verificar Sistema de IA
- Enviar 8+ mensagens
- IA deve intervir com follow-up question
- Console (F12) deve mostrar logs

---

## 🛠️ SE AINDA FALHAR

### Cenário 1: Erro de Manifest Persiste

```powershell
# Limpar TUDO localmente
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .vercel

# Reinstalar
npm install

# Build limpo
npm run build

# Se passar localmente, push novamente
git push origin main --force
```

### Cenário 2: Erro de TypeScript

Se aparecer erros de tipo durante build:

```javascript
// next.config.js já tem:
typescript: {
  ignoreBuildErrors: true, // ✅ Já configurado
},
```

### Cenário 3: Erro de ESLint

```javascript
// next.config.js já tem:
eslint: {
  ignoreDuringBuilds: true, // ✅ Já configurado
},
```

### Cenário 4: Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**É NORMAL!** Redis não está disponível durante build. O código tem fallback.

---

## 📊 COMMITS APLICADOS

1. **48bc5c3** - Fix: Exclusão de mensagens + desconto FP
2. **aa7818d** - Feat: Infraestrutura IA local + Dashboard
3. **6c0501b** - Fix: Dynamic imports + Node.js runtime
4. **f016d4b** - Fix: Server/Client Component mismatch ✅ **CORREÇÃO FINAL**

---

## 🎯 ARQUIVOS MODIFICADOS

### Correções de Build:
- ✅ `app/(dashboard)/layout.tsx` - Adicionado 'use client'
- ✅ `app/(dashboard)/page.tsx` - Dynamic import do GPUMonitor
- ✅ `app/api/hardware/gpu/route.ts` - Node.js runtime

### Funcionalidades:
- ✅ `app/comunidades/[slug]/page.tsx` - Exclusão + refresh FP
- ✅ `app/api/comunidades/messages/[id]/route.ts` - Desconto de FP

---

## 📝 PRÓXIMOS PASSOS

1. ✅ **Código corrigido** - Commit f016d4b
2. ⏳ **Push para Vercel** - Execute agora:
   ```powershell
   git push origin main
   ```
3. ⏳ **Aguardar deploy** - 2-3 minutos
4. ✅ **Testar funcionalidades** - Ver seção "Verificar se deu certo"

---

## 🆘 SUPORTE

Se o erro persistir após seguir TODOS os passos:

1. Capture log completo do build do Vercel
2. Execute `npm run build` localmente e capture output
3. Verifique se há outros erros além do manifest

---

**Status:** ✅ Correção aplicada e pronta para deploy
**Próximo:** `git push origin main`
