# 🚀 Como Aplicar Avatares em Produção

## Passo a Passo Simples

### 1. Abrir Supabase Studio

```bash
# Abrir no navegador
https://supabase.com/dashboard/project/qducbqhuwqdyqioqevle
```

Ou use este comando para abrir automaticamente:
```bash
start https://supabase.com/dashboard/project/qducbqhuwqdyqioqevle
```

### 2. Ir para SQL Editor

1. No menu lateral, clique em **SQL Editor** (ícone </> )
2. Clique em **New Query** (ou "+ New query")

### 3. Copiar e Colar o Script

1. Abra o arquivo: `APLICAR_AVATARES_PRODUCAO.sql`
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase (Ctrl+V)

### 4. Executar o Script

1. Clique no botão **Run** (ou pressione Ctrl+Enter)
2. Aguarde alguns segundos enquanto processa
3. Você verá as mensagens de resultado

### 5. Verificar Resultados

O script mostra automaticamente:

✅ **Posts com avatar:** Quantos posts agora têm avatar
✅ **Comentários com avatar:** Quantos comentários agora têm avatar
✅ **Top 10 avatares:** Distribuição dos avatares mais usados

**Exemplo de resultado esperado:**
```
posts_com_avatar  | posts_sem_avatar | total_posts
        245       |        0         |    245

comments_com_avatar | comments_sem_avatar | total_comments
         892        |          0          |     892

avatarId        | quantidade | percentual
avatar_f_02     |     12     |    4.9
avatar_m_05     |     11     |    4.5
avatar_f_08     |     10     |    4.1
...
```

---

## ⚠️ IMPORTANTE

### Antes de Executar:

- ✅ Certifique-se de estar logado no Supabase
- ✅ Verifique se está no projeto correto (qducbqhuwqdyqioqevle)
- ✅ O script é SEGURO - apenas atualiza posts/comentários SEM avatar

### O que o Script FAZ:

✅ Cria lista temporária com 30 avatares
✅ Atribui avatares APENAS para posts sem avatar
✅ Atribui avatares APENAS para comentários sem avatar
✅ Distribui de forma balanceada e aleatória
✅ Mostra estatísticas de resultado

### O que o Script NÃO FAZ:

❌ NÃO altera posts que já têm avatar
❌ NÃO deleta nenhum dado
❌ NÃO modifica estrutura do banco
❌ NÃO afeta outros campos dos posts/comentários

---

## 🔍 Verificação Pós-Execução

Após executar o script, você pode verificar os resultados:

### Opção 1: Ver no Supabase Studio

1. Ir em **Table Editor** → **Post**
2. Verificar colunas: `avatarId`, `avatarImg`, `avatarInitialsColor`
3. Todos devem estar preenchidos

### Opção 2: Ver no Site

1. Abrir: https://chat.nutrifitcoach.com.br/comunidades/aspiracional-estetica
2. Todos os posts devem mostrar avatares variados
3. Ao recarregar a página (F5), avatares devem permanecer

### Opção 3: Rodar Query de Verificação

Cole esta query no SQL Editor:

```sql
-- Verificação rápida
SELECT
  (SELECT COUNT(*) FROM "Post" WHERE "avatarId" IS NULL) as posts_sem_avatar,
  (SELECT COUNT(*) FROM "Comment" WHERE "avatarId" IS NULL) as comments_sem_avatar,
  (SELECT COUNT(DISTINCT "avatarId") FROM "Post" WHERE "avatarId" IS NOT NULL) as avatares_unicos_em_uso;
```

**Resultado esperado:**
```
posts_sem_avatar | comments_sem_avatar | avatares_unicos_em_uso
       0         |          0          |          30
```

---

## 🆘 Troubleshooting

### Script não executa

**Erro:** "permission denied"
- **Solução:** Certifique-se de estar logado como admin/owner do projeto

**Erro:** "relation does not exist"
- **Solução:** Verifique se está no banco correto (postgres, não outro)

### Resultado mostra 0 posts

**Possível causa:** Banco vazio ou schema diferente
- **Solução:** Verifique se as tabelas "Post" e "Comment" existem:
  ```sql
  SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  ```

### Avatares não aparecem no site

**Possível causa:** Cache do navegador
- **Solução:** Recarregar com Ctrl+F5 (hard refresh)

**Possível causa:** Imagens dos avatares não existem
- **Solução:** Verificar se arquivos em `/public/avatars/` existem no projeto

---

## 📊 Estatísticas Esperadas

Após executar o script em produção:

```
✅ Cobertura: 100% (todos com avatar)
✅ Avatares em uso: 30/30
✅ Distribuição: Balanceada (cada avatar usado ~3-5% do total)
✅ Gênero: ~50% feminino, ~50% masculino
```

---

## 🔄 Re-executar o Script

**É seguro re-executar?** ✅ SIM

O script:
- Verifica quais posts/comentários NÃO têm avatar
- Atribui avatares APENAS para esses
- Posts que já têm avatar são ignorados

**Quando re-executar:**
- Após adicionar novos posts/comentários
- Se alguns posts ficaram sem avatar
- Para redistribuir avatares (após deletar avatarId manualmente)

---

## ✅ Checklist

Antes de executar:
- [ ] Logado no Supabase
- [ ] Projeto correto (qducbqhuwqdyqioqevle)
- [ ] SQL Editor aberto
- [ ] Script copiado

Durante execução:
- [ ] Script colado no editor
- [ ] Clicou em "Run"
- [ ] Aguardando resultado

Após execução:
- [ ] Resultado mostrou estatísticas
- [ ] Posts_sem_avatar = 0
- [ ] Comments_sem_avatar = 0
- [ ] Site mostra avatares variados

---

## 🎉 Sucesso!

Após executar o script, a página:
https://chat.nutrifitcoach.com.br/comunidades/aspiracional-estetica

Deve mostrar **avatares variados e balanceados** em todos os posts e comentários! 🚀

---

**Arquivo do script:** `APLICAR_AVATARES_PRODUCAO.sql`
**Última atualização:** 05/02/2026
