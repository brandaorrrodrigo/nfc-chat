# 🆕 Como Criar Novo Projeto Supabase

## Passo a Passo Completo

### 1. Criar Projeto

```bash
# Abrir Supabase
start https://supabase.com/dashboard
```

1. Clicar em **"New Project"**
2. Preencher:
   - **Name:** NutriFitCoach Comunidades
   - **Database Password:** (Criar senha forte e GUARDAR)
   - **Region:** South America (São Paulo) ou US East (Ohio)
   - **Pricing Plan:** Free (suficiente para dev)

3. Clicar em **"Create new project"**
4. **Aguardar 2-3 minutos** (criação do banco)

### 2. Copiar Connection String

1. Projeto criado → **Settings** (ícone engrenagem)
2. **Database** (menu lateral)
3. **Connection String** → **URI**
4. Copiar a string que começa com `postgresql://postgres...`

**Exemplo:**
```
postgresql://postgres.XXXXX:SENHA@db.XXXXX.supabase.co:5432/postgres
```

### 3. Atualizar .env

Abrir `.env` e substituir `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://postgres.XXXXX:SENHA@db.XXXXX.supabase.co:5432/postgres"
```

**IMPORTANTE:** Substituir `XXXXX` e `SENHA` pelos valores reais!

### 4. Criar Tabelas

```bash
# Criar schema no banco novo
npx prisma db push

# Aguardar conclusão
# Deve mostrar: "Your database is now in sync with your schema"
```

### 5. Popular Dados (Opcional)

Se tiver dados de teste ou backup:

```bash
# Restaurar backup SQL
psql $DATABASE_URL < backup.sql

# Ou popular via seeds
npm run seed
```

### 6. Testar Conexão

```bash
# Deve funcionar agora
npx prisma db pull

# Testar scripts
npm run avatar:analyze
```

### 7. Atualizar Vercel (Produção)

Se já tem deploy no Vercel:

1. Ir em: https://vercel.com/dashboard
2. Selecionar projeto nfc-comunidades
3. Settings > Environment Variables
4. Adicionar/Atualizar: `DATABASE_URL`
5. Valor: nova connection string do Supabase
6. Redeploy: Deployments > Latest > Redeploy

---

## ✅ Checklist

- [ ] Projeto Supabase criado
- [ ] Senha do banco salva em local seguro
- [ ] Connection string copiada
- [ ] .env atualizado com nova URL
- [ ] `npx prisma db push` executado com sucesso
- [ ] `npx prisma db pull` funciona
- [ ] Tabelas criadas no banco
- [ ] Scripts de avatar funcionando
- [ ] Vercel atualizado (se aplicável)

---

## 🔑 Guardar Credenciais

**IMPORTANTE:** Salvar estas informações:

```
Projeto Supabase
================
Project ID: [copiar do dashboard]
Project Name: NutriFitCoach Comunidades
Database Password: [a senha que você criou]
Region: [South America ou US East]
URL: postgresql://postgres...[connection string completa]
```

---

## 🆘 Problemas Comuns

### "Database already exists"
- Normal se `db push` já rodou antes
- Ignorar ou usar `--force-reset` (CUIDADO: apaga dados)

### "Timeout" durante criação
- Aguardar mais tempo (pode levar até 5 min)
- Refresh da página do dashboard

### Connection string não funciona
- Verificar se copiou **URI** (não Pooler)
- Verificar se senha está correta
- Usar Settings > Database > Connection String > **Direct connection**

---

## 📊 Tempo Estimado

- Criar projeto: 3-5 minutos
- Configurar .env: 1 minuto
- Criar tabelas: 2-3 minutos
- Testar: 1 minuto

**Total: ~10 minutos**
