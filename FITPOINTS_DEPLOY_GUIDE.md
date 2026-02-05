# 🚀 Guia Rápido de Deploy - Sistema FitPoints

## ⚡ Comandos para Executar (em ordem)

### 1️⃣ Gerar Cliente Prisma Atualizado

```bash
npx prisma generate
```

**O que faz:** Gera os tipos TypeScript atualizados com os novos models FitPoints

---

### 2️⃣ Aplicar Mudanças no Banco de Dados

```bash
npx prisma db push
```

**O que faz:**
- Cria tabelas `FitPointsTransaction` e `BiometricPricing`
- Adiciona campos FitPoints no model `User`
- Adiciona campos de monetização em `BiometricBaseline` e `BiometricComparison`

**⚠️ Importante:** Certifique-se de que o banco Supabase está ativo antes de executar

---

### 3️⃣ Popular Tabela de Preços

```bash
npm run seed:pricing
```

**O que faz:**
- Insere 3 registros na tabela `BiometricPricing`:
  - baseline: 0 FPs (primeira grátis)
  - comparison: 25 FPs
  - export_pdf: 15 FPs

---

### 4️⃣ Verificar no Banco (Opcional)

```bash
npx prisma studio
```

**O que faz:** Abre interface visual do banco para verificar:
- Tabela `User` com novos campos FitPoints
- Tabela `FitPointsTransaction` (vazia inicialmente)
- Tabela `BiometricPricing` (3 registros)
- Tabelas `BiometricBaseline` e `BiometricComparison` atualizadas

---

## ✅ Checklist de Verificação

Após executar os comandos, verifique:

- [ ] Cliente Prisma gerado sem erros
- [ ] `npx prisma db push` executou sem erros
- [ ] Seed de pricing executou com sucesso
- [ ] Prisma Studio mostra as 3 tabelas novas
- [ ] Model User tem campos: `fitpoints_balance`, `fitpoints_lifetime`, `subscription_tier`
- [ ] BiometricPricing tem 3 registros (baseline, comparison, export_pdf)

---

## 🧪 Teste Rápido (Opcional)

### Criar usuário de teste com FitPoints:

```typescript
// No Prisma Studio ou via API:
// 1. Criar usuário
// 2. Adicionar fitpoints_balance = 100
// 3. Definir subscription_tier = 'free'
// 4. Definir free_baseline_used = false

// 2. Testar baseline grátis via API
POST /api/biometric/analyze
{
  "user_id": "test-user-id",
  "images": { "frontal": "...", "lateral": "...", "posterior": "..." },
  "type": "baseline"
}

// Esperado: payment_info.method = 'free_quota', cost_fps = 0

// 3. Testar comparação com FPs
POST /api/biometric/analyze
{
  "user_id": "test-user-id",
  "baseline_id": "baseline-id-from-step-2",
  "images": { "frontal": "...", "lateral": "...", "posterior": "..." },
  "type": "comparison"
}

// Esperado: payment_info.method = 'fitpoints', cost_fps = 25
// Verificar: fitpoints_balance reduzido em 25
```

---

## ❌ Solução de Problemas

### Erro: "Can't reach database server"

**Causa:** Banco Supabase pausado ou inativo

**Solução:**
1. Acesse dashboard do Supabase
2. Aguarde o projeto "wake up" (pode levar 1-2 minutos)
3. Tente novamente o comando

---

### Erro: "Table already exists"

**Causa:** Tabela já existe no banco

**Solução:**
- Isso é normal se você já executou `db push` antes
- O Prisma vai apenas adicionar campos novos
- Prossiga normalmente

---

### Erro: "Cannot find module '@prisma/client'"

**Causa:** Cliente Prisma não foi gerado

**Solução:**
```bash
npx prisma generate
npm install
```

---

## 📊 Estrutura Final do Banco

Após o deploy, seu banco terá:

```
User
├── id (String)
├── email (String)
├── ... (campos existentes)
├── fitpoints_balance (Int) ← NOVO
├── fitpoints_lifetime (Int) ← NOVO
├── subscription_tier (String) ← NOVO
├── subscription_status (String) ← NOVO
├── subscription_ends_at (DateTime?) ← NOVO
└── free_baseline_used (Boolean) ← NOVO

FitPointsTransaction ← NOVA TABELA
├── id (String)
├── user_id (String)
├── amount (Int)
├── balance_after (Int)
├── transaction_type (String)
├── category (String)
├── description (String)
├── reference_id (String?)
├── metadata (Json?)
└── created_at (DateTime)

BiometricPricing ← NOVA TABELA
├── id (String)
├── item_type (String) UNIQUE
├── fps_cost (Int)
├── premium_free (Boolean)
├── first_free (Boolean)
├── max_per_month (Int?)
├── is_active (Boolean)
├── created_at (DateTime)
└── updated_at (DateTime)

BiometricBaseline
├── ... (campos existentes)
├── was_free (Boolean) ← NOVO
└── cost_fps (Int) ← NOVO

BiometricComparison
├── ... (campos existentes)
├── cost_fps (Int) ← NOVO
├── payment_method (String) ← NOVO
└── transaction_id (String?) ← NOVO
```

---

## 🎯 Próximos Passos Após Deploy

1. **Testar Sistema Completo**
   - Criar baseline grátis
   - Criar comparação com FPs
   - Verificar dedução de FPs
   - Verificar histórico de transações

2. **Implementar Frontend**
   - Mostrar saldo de FPs
   - Alertas de paywall
   - Botão "Comprar FPs"
   - Botão "Assinar Premium"

3. **Integrar Gateway de Pagamento**
   - Stripe ou Mercado Pago
   - Compra de FPs
   - Assinatura Premium
   - Webhooks de confirmação

---

**Dúvidas?** Consulte `FITPOINTS_MONETIZATION_SYSTEM.md` para documentação completa.
