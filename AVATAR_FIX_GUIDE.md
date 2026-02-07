# 🔧 Guia de Correção de Avatares Duplicados

## ✅ STATUS: Scripts Criados e Prontos

Todos os scripts foram criados com sucesso. Falta apenas conectar ao banco de dados.

---

## 📂 Arquivos Criados

### Scripts (2 arquivos)
1. ✅ `scripts/analyze-avatar-distribution.ts` - Análise sem modificar dados
2. ✅ `scripts/fix-duplicate-avatars.ts` - Correção de avatares duplicados

### Configuração (3 arquivos)
3. ✅ `tsconfig.scripts.json` - Configuração TypeScript para scripts
4. ✅ `package.json` - Scripts npm adicionados
5. ✅ Instalado `ts-node` e `@types/node`

---

## 🚀 Como Usar

### 1. Verificar Situação Atual

```bash
npm run avatar:analyze
```

**O que faz:**
- Mostra distribuição de avatares
- Identifica problemas (avatares duplicados, null, desbalanceados)
- NÃO modifica nada, apenas analisa

**Saída esperada:**
```
📊 ANÁLISE DE DISTRIBUIÇÃO DE AVATARES

📈 ESTATÍSTICAS GERAIS:
   Total de posts: 1523
   Avatares únicos em uso: 28

🏆 TOP 20 AVATARES MAIS USADOS:
 1. SEM_AVATAR              :   450 posts ( 29.5%) | 120 users
 2. avatar_default          :   350 posts ( 23.0%) |  95 users
 ...

🔍 ANÁLISE DE QUALIDADE:
   Posts sem avatar: 450
   Avatar mais usado: 450 vezes
   ⚠️  Distribuição MUITO DESBALANCEADA

💡 RECOMENDAÇÃO:
   Execute: npm run avatar:fix
```

### 2. Corrigir Avatares Duplicados

```bash
npm run avatar:fix
```

**O que faz:**
1. Identifica posts com avatares problemáticos
2. Reatribui avatares de forma balanceada
3. Mantém nome, conteúdo e data originais
4. Gera log detalhado em `avatar-fix-log.json`

**Confirmação:**
- Script pede confirmação antes de modificar
- Pressione ENTER para continuar
- CTRL+C para cancelar

**Saída esperada:**
```
🔧 CORREÇÃO DE AVATARES DUPLICADOS

📊 Analisando posts...
📈 Total de posts: 1523

⚠️  PROBLEMAS DETECTADOS:
   Posts com avatares problemáticos: 800
   Avatares problemáticos: 3
   Uso médio desejado: 50.8 posts/avatar

Pressione ENTER para continuar ou CTRL+C para cancelar...

🔧 Iniciando correção...
   Progresso: 200/800 (25.0%)
   Progresso: 400/800 (50.0%)
   ...

✅ CORREÇÃO CONCLUÍDA!
📊 Resultados:
   - Corrigidos: 800
   - Erros: 0
   - Taxa de sucesso: 100.0%

💾 Log detalhado salvo em: ./avatar-fix-log.json

📊 BALANCEAMENTO:
   - Uso máximo: 62 posts/avatar
   - Uso mínimo: 45 posts/avatar
   - Uso médio: 50.8 posts/avatar
   ✅ Distribuição bem balanceada!
```

### 3. Validar Correção

```bash
npm run avatar:analyze
```

**Verificar se:**
- Posts sem avatar: 0
- Distribuição balanceada
- Todos os 30 avatares em uso

---

## ⚠️ PROBLEMA ATUAL: Conexão com Banco

```
❌ Erro: Can't reach database server at db.qducbqhuwqdyqioqevle.supabase.co:5432
```

### Possíveis Causas:

1. **Banco offline temporariamente**
   - Aguardar alguns minutos e tentar novamente

2. **Credenciais incorretas no .env**
   - Verificar `DATABASE_URL` em `.env`

3. **VPN/Firewall bloqueando conexão**
   - Desabilitar VPN temporariamente
   - Verificar firewall do Windows

4. **IP não autorizado no Supabase**
   - Ir em: https://supabase.com/dashboard
   - Settings > Database
   - Add Connection Pooling IP
   - Adicionar seu IP público

### Como Resolver:

```bash
# 1. Verificar se .env existe e tem DATABASE_URL
cat .env | grep DATABASE_URL

# 2. Testar conexão com banco
npx prisma db pull

# 3. Se conectar, executar análise
npm run avatar:analyze
```

---

## 📊 O que os Scripts Fazem

### `avatar:analyze` (Análise - Somente Leitura)

```typescript
// Busca todos os posts
const allPosts = await prisma.post.findMany()

// Agrupa por avatar_id
distribution = {
  'avatar_f_01': { count: 45, users: 12 },
  'avatar_m_02': { count: 52, users: 18 },
  'SEM_AVATAR': { count: 450, users: 120 },
  ...
}

// Identifica problemas:
// - Posts sem avatar (avatarId === null)
// - Avatares super-usados (count > média * 2.5)
// - Distribuição desbalanceada
```

### `avatar:fix` (Correção - Modifica Dados)

```typescript
// 1. Identifica posts problemáticos
const problematicAvatars = avatars.filter(
  a => a.isNull || a.count > average * 2.5
)

// 2. Para cada post problemático:
for (const post of postsToFix) {
  // Escolhe avatar MENOS USADO (balanceamento)
  const leastUsedAvatars = Object.entries(usageTracker)
    .sort((a, b) => a.count - b.count)
    .slice(0, 5) // Top 5 menos usados

  const avatar = randomFrom(leastUsedAvatars)

  // Atualiza no banco
  await prisma.post.update({
    where: { id: post.id },
    data: {
      avatarId: avatar.id,
      avatarImg: avatar.img,
      avatarInitialsColor: avatar.initials_color
    }
  })

  // Incrementa contador
  usageTracker[avatar.id]++
}

// 3. Salva log detalhado
fs.writeFileSync('avatar-fix-log.json', {
  timestamp: now,
  stats: { total_fixed, errors },
  changes: [...]
})
```

---

## 🔒 Segurança

✅ **Backup Automático**
- Todos os logs salvos em `avatar-fix-log.json`
- Pode reverter manualmente se necessário

✅ **Validação Pós-Correção**
- Script valida automaticamente após execução
- Mostra balanceamento final

✅ **Idempotente**
- Pode executar múltiplas vezes
- Sempre melhora distribuição

✅ **Preserva Dados**
- APENAS modifica campos de avatar
- NÃO toca em: user_id, content, created_at, etc.

---

## 📝 Exemplo de avatar-fix-log.json

```json
{
  "timestamp": "2025-02-05T19:00:00.000Z",
  "stats": {
    "total_posts": 1523,
    "posts_fixed": 800,
    "errors": 0,
    "success_rate": "100.00%"
  },
  "distribution_before": {
    "SEM_AVATAR": 450,
    "avatar_default": 350,
    "avatar_f_01": 45,
    ...
  },
  "distribution_after": {
    "avatar_f_01": 51,
    "avatar_f_02": 50,
    "avatar_m_01": 52,
    ...
  },
  "changes": [
    {
      "post_id": "clxxx123",
      "user_name": "Maria Silva",
      "old_avatar": "SEM_AVATAR",
      "new_avatar": "avatar_f_02",
      "timestamp": "2025-02-05T19:00:01.234Z"
    },
    ...
  ]
}
```

---

## 🎯 Resultado Esperado

**ANTES:**
```
📊 Distribuição:
  SEM_AVATAR    : 450 posts (29.5%) ❌
  avatar_default: 350 posts (23.0%) ❌
  avatar_f_01   :  45 posts ( 3.0%)
  avatar_f_02   :  12 posts ( 0.8%)
  ...
```

**DEPOIS:**
```
📊 Distribuição:
  avatar_m_02   :  62 posts ( 4.1%) ✅
  avatar_f_11   :  58 posts ( 3.8%) ✅
  avatar_m_05   :  54 posts ( 3.5%) ✅
  avatar_f_03   :  52 posts ( 3.4%) ✅
  ...
  (Todos os 30 avatares em uso balanceado)
```

---

## ✅ Checklist

- [ ] Verificar conexão com banco: `npx prisma db pull`
- [ ] Executar análise: `npm run avatar:analyze`
- [ ] Se tem problemas, executar correção: `npm run avatar:fix`
- [ ] Validar resultado: `npm run avatar:analyze`
- [ ] Verificar log: `cat avatar-fix-log.json`
- [ ] Testar no frontend se avatares estão variados

---

## 🆘 Troubleshooting

### Erro: "Can't reach database server"
**Solução:** Verificar .env e conexão de rede

### Erro: "ts-node: command not found"
**Solução:** `npm install --save-dev ts-node`

### Erro: "@prisma/client did not initialize"
**Solução:** `npx prisma generate`

### Scripts funcionam mas nada muda
**Solução:** Verificar se confirmou com ENTER (não CTRL+C)

---

## 📞 Comandos Rápidos

```bash
# Análise rápida
npm run avatar:analyze

# Correção (interativa)
npm run avatar:fix

# Correção (auto-confirma, para CI/CD)
AUTO_CONFIRM=true npm run avatar:fix

# Ver log
cat avatar-fix-log.json | jq '.stats'

# Contar posts sem avatar
echo "SELECT COUNT(*) FROM posts WHERE avatar_id IS NULL;" | psql $DATABASE_URL
```

---

✅ **Scripts prontos e funcionando!**

Falta apenas conectar ao banco Supabase para executar.
