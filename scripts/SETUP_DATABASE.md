# 🚀 SETUP COMPLETO DO BANCO DE DADOS

## Passo 1: Criar Todas as Tabelas

### 1.1 Acesse o Supabase SQL Editor
- URL: https://supabase.com/dashboard/project/qducbqhuwqdyqioqevle/sql/new
- Faça login se necessário

### 1.2 Execute o Script de Criação
1. Abra o arquivo: `CREATE_ALL_TABLES.sql`
2. **COPIE TODO O CONTEÚDO** (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (ou Ctrl+Enter)
5. Aguarde a execução (pode levar 10-30 segundos)

**✅ Resultado Esperado:**
- Você verá "Success. No rows returned"
- Ou uma mensagem de sucesso

**⚠️ Se houver erro:**
- Verifique se você está no projeto correto
- Verifique se tem permissões de admin

---

## Passo 2: Inserir as Arenas de Biomecânica

### 2.1 Execute o Script de Arenas
1. No mesmo SQL Editor, **limpe o conteúdo anterior**
2. Abra o arquivo: `INSERT_BIOMECHANICS_ARENAS.sql`
3. **COPIE TODO O CONTEÚDO**
4. Cole no SQL Editor
5. Clique em **"Run"**

**✅ Resultado Esperado:**
- Você verá uma tabela com 6 linhas ao final
- Cada linha representa uma arena criada

---

## Passo 3: Verificar se Funcionou

### 3.1 Verificar Tabelas Criadas
Execute este SQL para verificar:

```sql
-- Ver todas as tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**✅ Você deve ver:**
- Arena
- ArenaTag
- ArenaFounder
- Post
- Comment
- User
- VideoAnalysis
- E outras...

### 3.2 Verificar Arenas
```sql
-- Ver as 6 arenas de biomecânica
SELECT
  slug,
  name,
  categoria,
  "arenaType",
  "isActive"
FROM "Arena"
WHERE categoria = 'BIOMECANICA_NFV'
ORDER BY slug;
```

**✅ Você deve ver 6 arenas:**
1. analise-agachamento
2. analise-elevacao-pelvica
3. analise-puxadas
4. analise-supino
5. analise-terra
6. hub-biomecanico

---

## Passo 4: Testar no App

1. Acesse: https://chat.nutrifitcoach.com.br
2. Vá para a seção de Arenas
3. Filtre por "Biomecânica & NFV"
4. As 6 arenas devem aparecer!

---

## 🆘 TROUBLESHOOTING

### Erro: "permission denied"
**Solução:** Use o Service Role Key no Supabase Dashboard

### Erro: "type already exists"
**Solução:** Normal! O script usa `DO $$ BEGIN ... EXCEPTION` para ignorar tipos duplicados

### Erro: "relation already exists"
**Solução:** As tabelas já existem. Se quiser recriar:
```sql
-- CUIDADO: Isso apaga TODOS os dados!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Depois execute o CREATE_ALL_TABLES.sql novamente
```

### Arenas não aparecem no app
1. **Limpe o cache:** Ctrl+Shift+R no navegador
2. **Verifique se isActive é true:**
   ```sql
   UPDATE "Arena"
   SET "isActive" = true
   WHERE categoria = 'BIOMECANICA_NFV';
   ```
3. **Reinicie o servidor Next.js**

---

## 📋 ORDEM DE EXECUÇÃO

✅ 1. CREATE_ALL_TABLES.sql (criar estrutura)
✅ 2. INSERT_BIOMECHANICS_ARENAS.sql (inserir arenas)
⏭️ 3. Opcionalmente: Executar seed.ts para criar outras arenas

---

## 🎯 PRÓXIMOS PASSOS

Depois que tudo funcionar, você pode:

1. **Criar usuário admin:**
   ```bash
   cd D:\NUTRIFITCOACH_MASTER\nfc-comunidades
   npx tsx prisma/seed.ts
   ```

2. **Acessar como admin:**
   - Email: admin@nutrifitcoach.com
   - Senha: admin123

3. **Testar upload de vídeo:**
   - Entre em uma das arenas de análise
   - Faça upload de um vídeo de teste
   - Veja a análise biomecânica da IA

---

## 📞 Suporte

Se algo não funcionar:
1. Copie a mensagem de erro completa
2. Verifique os logs do servidor (terminal onde rodou `npm run dev`)
3. Verifique o console do navegador (F12)
