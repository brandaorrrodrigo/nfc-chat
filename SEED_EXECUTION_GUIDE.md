# 📋 Guia de Execução dos 4 Scripts Seed (Quando Supabase Online)

## 🎯 Objetivo

Executar automaticamente os 4 scripts seed quando o Supabase voltar online.

---

## 🚀 OPÇÃO 1: Monitor Automático (RECOMENDADO)

Este monitor ficará **aguardando** o Supabase ficar online e **executará automaticamente** os 4 scripts.

### Como Usar

**Terminal (bash/shell):**
```bash
npm run monitor:seeds
```

**OU manualmente:**
```bash
bash scripts/monitor-seeds.sh
```

### O que Acontece

1. ✅ Script inicia e tenta conectar ao Supabase a cada 10 segundos
2. ✅ Mostra progresso: "⏳ Tentativa 45/1000 (7 min decorridos)"
3. ✅ Quando Supabase fica online:
   - `✨ Supabase está ONLINE! Iniciando execução...`
4. ✅ Executa os 4 scripts em sequência:
   ```
   ✅ Peptídeos & Farmacologia (42 posts)
   ✅ Performance & Biohacking (40 posts)
   ✅ Receitas & Alimentação (41 posts)
   ✅ Exercícios & Técnica (40 posts)
   ```
5. ✅ Exibe relatório final com total de posts criados
6. ✅ Pronto! Você pode fechar o terminal

### Logs em Tempo Real

Para acompanhar em outro terminal:
```bash
tail -f logs/seed-monitor.log    # Monitor principal
tail -f logs/seed-*.log          # Logs individuais dos scripts
```

### Exemplos de Saída

```
════════════════════════════════════════════════════════════
ℹ️  [19:30:00] 🔍 MONITOR DE SUPABASE - SCRIPTS SEED
════════════════════════════════════════════════════════════
⏳ [19:30:00] ⏳ Tentativa 1/1000 (0 min decorridos)
⏳ [19:30:10] ⏳ Tentativa 2/1000 (0 min decorridos)
...
✅ [19:45:30] ✨ Supabase está ONLINE! Iniciando execução...

════════════════════════════════════════════════════════════
✅ [19:45:31] 🚀 EXECUTANDO 4 SCRIPTS SEED
════════════════════════════════════════════════════════════

⏳ [19:45:31] Iniciando: Peptídeos & Farmacologia
✅ [19:45:45] Peptídeos & Farmacologia executado (42 posts)

⏳ [19:45:47] Iniciando: Performance & Biohacking
✅ [19:46:02] Performance & Biohacking executado (40 posts)

⏳ [19:46:04] Iniciando: Receitas & Alimentação
✅ [19:46:19] Receitas & Alimentação executado (41 posts)

⏳ [19:46:21] Iniciando: Exercícios & Técnica
✅ [19:46:36] Exercícios & Técnica executado (40 posts)

════════════════════════════════════════════════════════════
✅ [19:46:38] 📊 RELATÓRIO FINAL
════════════════════════════════════════════════════════════

ℹ️  [19:46:38] Scripts executados: 4/4
ℹ️  [19:46:38] Posts criados: 163 (de 163 esperados)

✅ [19:46:38] 🎉 TODOS OS SCRIPTS EXECUTADOS COM SUCESSO!

ℹ️  [19:46:38] ➜ Próximos passos:
ℹ️  [19:46:38]    1. curl "https://chat.nutrifitcoach.com.br/api/arenas?flush=true"
ℹ️  [19:46:38]    2. Executar SQL UPDATE statements para associar arenas aos HUBs
ℹ️  [19:46:38]    3. Testar rotas em https://chat.nutrifitcoach.com.br
```

---

## 🎯 OPÇÃO 2: Executar Manualmente (Individual)

Se preferir executar cada script individualmente:

### Peptídeos & Farmacologia
```bash
npm run seeds:peptideos
# OU
npx tsx scripts/seed-peptideos-farmacologia.ts
```

### Performance & Biohacking
```bash
npm run seeds:performance
# OU
npx tsx scripts/seed-performance-biohacking.ts
```

### Receitas & Alimentação
```bash
npm run seeds:receitas
# OU
npx tsx scripts/seed-receitas-alimentacao.ts
```

### Exercícios & Técnica
```bash
npm run seeds:exercicios
# OU
npx tsx scripts/seed-exercicios-tecnica.ts
```

### Executar Todos em Sequência
```bash
npm run seeds:all-new
```

---

## 📊 Status dos Scripts

| Script | Posts | Arquivo | Status |
|--------|-------|---------|--------|
| Peptídeos & Farmacologia | 42 | `seed-peptideos-farmacologia.ts` | ✅ Pronto |
| Performance & Biohacking | 40 | `seed-performance-biohacking.ts` | ✅ Pronto |
| Receitas & Alimentação | 41 | `seed-receitas-alimentacao.ts` | ✅ Pronto |
| Exercícios & Técnica | 40 | `seed-exercicios-tecnica.ts` | ✅ Pronto |
| **TOTAL** | **163** | - | **✅ Pronto** |

---

## 🔧 Configurações do Monitor

Localizado em: `scripts/monitor-seeds.sh`

Você pode ajustar:

```bash
CHECK_INTERVAL=10      # Checar a cada 10 segundos
MAX_ATTEMPTS=1000      # Máximo ~2.8 horas
```

---

## ⏳ Tempo Estimado

- **Check**: ~3-5 minutos (primeiro sucesso)
- **Execução**: ~15 minutos (4 scripts)
- **Total**: ~20 minutos quando Supabase voltar

---

## ✅ Próximos Passos Após Execução

Quando todos os scripts terminarem com sucesso:

### 1️⃣ Limpar Cache
```bash
curl "https://chat.nutrifitcoach.com.br/api/arenas?flush=true"
```

### 2️⃣ Executar SQL UPDATE para Associar Arenas aos HUBs

Ver `HUB_IMPLEMENTATION_GUIDE.md` para os statements.

Exemplo:
```sql
UPDATE "Arena" SET hub_slug = 'peptideos-biohacking'
WHERE slug IN (
  'peptideos-farmacologia',
  'performance-biohacking'
);
```

### 3️⃣ Testar em Produção
- Acesse: https://chat.nutrifitcoach.com.br
- Verifique se as arenas estão aparecendo
- Teste os HUBs: `/comunidades/hub/avaliacao-fisica`

---

## 🐛 Troubleshooting

### "Variáveis de ambiente não configuradas"

**Causa**: `.env` não carregado

**Solução**:
```bash
# Verifique se .env existe
ls -la .env

# Se existir, a variável pode estar vazia
echo $NEXT_PUBLIC_SUPABASE_URL
```

### "npm: command not found"

**Causa**: Node.js não instalado

**Solução**:
```bash
# Instale Node.js 18+
node --version  # Deve ser v18.17.0+
npm --version
```

### Script pendurado por muito tempo

**Verificar**:
- Supabase realmente está online?
- Firewall bloqueando conexão?
- DNS resolvendo corretamente?

**Teste manual**:
```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
const s = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
s.from('Arena').select('id').limit(1).then(r =>
  console.log(r.error ? '❌ Erro: ' + r.error.message : '✅ Online')
);
"
```

### Um script falhou, outros ainda vão executar?

**Sim!** O monitor continua mesmo se um script falhar:
- ✅ Script 1 com sucesso
- ❌ Script 2 falhou (logs em `logs/seed-script2.log`)
- ✅ Script 3 com sucesso
- ✅ Script 4 com sucesso

Verifique o log do script que falhou e execute novamente manualmente.

---

## 📝 Logs Gerados

Após execução, você terá:

```
logs/
├── seed-monitor.log                    # Log principal do monitor
├── seed-peptideos-farmacologia.log     # Script 1
├── seed-performance-biohacking.log     # Script 2
├── seed-receitas-alimentacao.log       # Script 3
└── seed-exercicios-tecnica.log         # Script 4
```

---

## 🎓 Exemplo Prático (Passo a Passo)

### 1️⃣ Inicie o Monitor
```bash
npm run monitor:seeds
```

Output:
```
════════════════════════════════════════════════════════════
ℹ️  [19:30:00] 🔍 MONITOR DE SUPABASE - SCRIPTS SEED
════════════════════════════════════════════════════════════
⏳ [19:30:00] Aguardando Supabase ficar online...
⏳ [19:30:00] Checando a cada 10 segundos
⏳ [19:30:00] Timeout: 166 minutos
```

### 2️⃣ Aguarde (Monitor ficará aguardando)
- Pode deixar rodando em background
- Ou deixar em outro terminal

### 3️⃣ Quando Supabase Voltar Online
Monitor automaticamente detectará e iniciará:
```
✅ [19:45:30] ✨ Supabase está ONLINE! Iniciando execução...
```

### 4️⃣ Acompanhe os Logs
```bash
tail -f logs/seed-monitor.log
```

### 5️⃣ Quando Terminar
```
✅ [19:46:38] 🎉 TODOS OS SCRIPTS EXECUTADOS COM SUCESSO!
```

### 6️⃣ Próximos Passos
- Limpar cache
- Executar SQL UPDATEs
- Testar em produção

---

## 🔗 Referências Rápidas

- **HUB_IMPLEMENTATION_GUIDE.md** — Guia completo do sistema de HUBs
- **HUB_SYSTEM_STATUS.md** — Status detalhado
- **scripts/monitor-seeds.sh** — Script de monitoramento
- **.env** — Variáveis de ambiente (deve ter `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

**Status**: 🟢 Pronto para execução | ⏳ Aguardando Supabase online
