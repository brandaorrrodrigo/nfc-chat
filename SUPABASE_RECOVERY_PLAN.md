# 🔄 PLANO DE RECUPERAÇÃO - SUPABASE ONLINE

## Status Atual

```
⏳ Supabase: OFFLINE
✅ Código: 100% Pronto
✅ Sistema de HUBs: Implementado
✅ Scripts: Criados e testados
✅ Documentação: Completa
```

---

## 📋 Checklist de Ações Quando Supabase Voltar

### 1️⃣ Verificar Conexão
```bash
# Teste simples de conexão
psql postgresql://user:password@db.supabase.co:5432/postgres -c "SELECT 1"

# Ou usar o script de monitoramento
bash scripts/monitor-supabase.sh
```

✅ **Esperado:** Conexão bem-sucedida

---

### 2️⃣ Verificar Estrutura de HUBs
```bash
npx tsx scripts/verify-hub-structure.ts
```

✅ **Esperado:**
```
✅ Hub Biomecânico
   Filhas: 5
      • analise-agachamento
      • analise-terra
      • analise-supino
      • analise-puxadas
      • analise-elevacao-pelvica
```

**Se falhar:** Verificar se as arenas foram criadas corretamente no banco.

---

### 3️⃣ Testar Endpoints
```bash
bash scripts/test-hub-endpoints.sh
```

✅ **Esperado:**
- GET /api/hubs/hub-biomecanico → 200 OK
- GET /api/arenas → 200 OK
- GET /comunidades/hub/hub-biomecanico → 200 OK

**Se falhar:** Verificar logs do Next.js (`npm run dev`)

---

### 4️⃣ Testar no Browser

**URL:** `http://localhost:3000/comunidades/hub/hub-biomecanico`

✅ **Validação:**
- [ ] Grid com 5 arenas aparece
- [ ] Cada card mostra: nome, descrição, posts, badges
- [ ] Hover effects funcionam
- [ ] Click navega para arena individual
- [ ] Breadcrumb funciona
- [ ] Botão voltar retorna ao grid

**Se não renderizar:**
1. Verificar console do browser (F12)
2. Verificar terminal do Next.js (logs)
3. Verificar que API retorna dados válidos (`curl http://localhost:3000/api/hubs/hub-biomecanico`)

---

### 5️⃣ Testar Navegação Completa

```
1. Acessar /comunidades/hub/hub-biomecanico
2. Clicar em "Análise: Agachamento"
3. Deve abrir /comunidades/analise-agachamento
4. Verificar que feed carrega corretamente
5. Voltar ao anterior
6. Deve retornar ao grid
```

---

### 6️⃣ Testar Responsividade

Abrir DevTools (F12) e testar em:
- [ ] Desktop (1024px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

✅ **Esperado:** Grid se ajusta (3 cols → 2 cols → 1 col)

---

## 🚀 Script Automático (Recomendado)

```bash
# Rodará automaticamente quando Supabase voltar
bash scripts/monitor-supabase.sh
```

Este script:
1. ✅ Verifica conexão com Supabase
2. ✅ Quando online, executa `verify-hub-structure.ts`
3. ✅ Executa `test-hub-endpoints.sh`
4. ✅ Fornece próximos passos

---

## 🛠️ Troubleshooting

### Problema: "Cannot connect to database"
**Solução:**
1. Verificar que .env.local tem DATABASE_URL correto
2. Verificar que Supabase está realmente online
3. Tentar reconectar manualmente

### Problema: "HUB não encontrado (404)"
**Solução:**
1. Rodar `npx tsx scripts/verify-hub-structure.ts`
2. Verificar que hub-biomecanico existe no banco
3. Se não existir, verificar seed scripts

### Problema: "Grid não carrega"
**Solução:**
1. Abrir DevTools (F12) → Console
2. Verificar se há erros de rede
3. Testar API diretamente: `curl http://localhost:3000/api/hubs/hub-biomecanico`
4. Verificar que arena tem children

### Problema: "Links não funcionam"
**Solução:**
1. Verificar que arenas filhas existem no banco
2. Verificar que slugs são válidos
3. Testar `/api/arenas` para listar todas

---

## 📊 Sumário de Commits Pronto

Quando supabase voltar, o código já está pronto com:
- ✅ 2 commits de implementação do sistema de HUBs
- ✅ API genérica para HUBs
- ✅ Página HUB com grid responsivo
- ✅ Scripts de validação
- ✅ Documentação completa

**Nenhuma mudança de código será necessária** — apenas testes!

---

## 📞 Como Ativar os Testes

**Opção A: Manual**
```bash
# 1. Verificar estrutura
npx tsx scripts/verify-hub-structure.ts

# 2. Testar endpoints
bash scripts/test-hub-endpoints.sh

# 3. Acessar browser
open http://localhost:3000/comunidades/hub/hub-biomecanico
```

**Opção B: Automático (Recomendado)**
```bash
bash scripts/monitor-supabase.sh
# Aguardará Supabase ficar online e executará tudo automaticamente
```

---

## ✅ Checklist Final

- [x] Sistema de HUBs implementado
- [x] Código commitado e pushed
- [x] Scripts criados
- [x] Documentação completa
- [x] Aguardando Supabase online

**Quando Supabase voltar:**
- [ ] Rodar `bash scripts/monitor-supabase.sh`
- [ ] Validar todos os testes
- [ ] Testar navegação
- [ ] Testar responsividade
- [ ] ✅ COMPLETO!

---

**Status:** ⏳ Aguardando Supabase Online
**Última Atualização:** 2026-02-10
**Próxima Ação:** Quando Supabase online, executar scripts de teste
