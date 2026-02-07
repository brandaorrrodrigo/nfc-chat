# 🔌 Guia de Conexão com Supabase

## ⚠️ Problema Atual

```
❌ Can't reach database server at db.qducbqhuwqdyqioqevle.supabase.co:5432
```

**URL configurada:**
```
postgresql://postgres:Anilha15!@db.qducbqhuwqdyqioqevle.supabase.co:5432/postgres
```

---

## 🔍 Possíveis Causas

### 1. Banco Pausado no Supabase
O Supabase pausa projetos inativos automaticamente no plano Free.

**Solução:**
1. Ir em: https://supabase.com/dashboard
2. Selecionar o projeto: `qducbqhuwqdyqioqevle`
3. Se mostrar "Paused", clicar em "Restore"
4. Aguardar 1-2 minutos até ficar "Active"

### 2. Firewall do Windows Bloqueando
O Windows Defender pode bloquear conexões PostgreSQL.

**Solução:**
```powershell
# Testar conectividade básica
Test-NetConnection -ComputerName db.qducbqhuwqdyqioqevle.supabase.co -Port 5432

# Se falhar, adicionar exceção no firewall:
# 1. Painel de Controle > Windows Defender Firewall
# 2. Configurações Avançadas
# 3. Regras de Saída > Nova Regra
# 4. Porta > TCP > 5432
# 5. Permitir Conexão
```

### 3. IP Não Autorizado
Supabase pode restringir acesso por IP.

**Solução:**
1. Ir em: https://supabase.com/dashboard
2. Settings > Database
3. Connection Pooling > Add restriction
4. Verificar se há restrições de IP
5. Se houver, adicionar seu IP público:
   - Descobrir IP: https://ifconfig.me
   - Adicionar na lista de IPs permitidos

### 4. VPN/Proxy Interferindo
VPN pode bloquear portas do PostgreSQL.

**Solução:**
```bash
# Desabilitar VPN temporariamente
# Testar novamente
npx prisma db pull
```

### 5. Senha Incorreta
A senha pode ter caracteres especiais que precisam encoding.

**Solução:**
```bash
# Verificar se senha tem caracteres especiais
# Senha atual: Anilha15!

# URL encode de "!" é "%21"
# Tentar com senha encoded:
DATABASE_URL="postgresql://postgres:Anilha15%21@db.qducbqhuwqdyqioqevle.supabase.co:5432/postgres"
```

---

## 🧪 Testes de Diagnóstico

### Teste 1: Ping do Servidor
```powershell
ping db.qducbqhuwqdyqioqevle.supabase.co
```
**Esperado:** Receber resposta (não timeout)

### Teste 2: Porta Aberta
```powershell
Test-NetConnection -ComputerName db.qducbqhuwqdyqioqevle.supabase.co -Port 5432
```
**Esperado:** `TcpTestSucceeded: True`

### Teste 3: DNS Resolution
```powershell
nslookup db.qducbqhuwqdyqioqevle.supabase.co
```
**Esperado:** Retornar IP válido

### Teste 4: Prisma Pull
```bash
npx prisma db pull
```
**Esperado:** Conectar e baixar schema

---

## 🔧 Soluções Rápidas

### Solução A: Verificar Dashboard Supabase

```bash
# 1. Abrir navegador
start https://supabase.com/dashboard/project/qducbqhuwqdyqioqevle

# 2. Verificar status do projeto
# 3. Se "Paused", clicar em "Restore"
```

### Solução B: Usar Connection String Direta

```bash
# 1. No dashboard do Supabase
# 2. Settings > Database
# 3. Connection String > Direct Connection
# 4. Copiar a string com pooler desabilitado
# 5. Atualizar .env
```

### Solução C: Testar com psql

```bash
# Instalar PostgreSQL client (se não tiver)
# Depois testar conexão direta:

psql "postgresql://postgres:Anilha15!@db.qducbqhuwqdyqioqevle.supabase.co:5432/postgres"

# Se conectar, o problema é no Prisma
# Se não conectar, o problema é rede/firewall
```

### Solução D: Usar Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref qducbqhuwqdyqioqevle

# Verificar status
supabase status
```

---

## 🎯 Solução Alternativa: Rodar Scripts com Banco Local

Se não conseguir conectar ao Supabase agora, pode testar os scripts com banco local:

### Opção 1: Usar SQLite (Mais Simples)

```bash
# 1. Atualizar prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

# 2. Criar banco local
npx prisma db push

# 3. Popular com dados de teste
# (criar script de seed)

# 4. Rodar scripts
npm run avatar:analyze
```

### Opção 2: PostgreSQL Local com Docker

```bash
# 1. Iniciar PostgreSQL local
docker run --name postgres-local -e POSTGRES_PASSWORD=senha123 -p 5432:5432 -d postgres

# 2. Atualizar .env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/postgres"

# 3. Rodar migration
npx prisma db push

# 4. Rodar scripts
npm run avatar:analyze
```

---

## ✅ Checklist de Verificação

- [ ] Dashboard Supabase está acessível
- [ ] Projeto mostra status "Active" (não "Paused")
- [ ] Ping do servidor funciona
- [ ] Porta 5432 está aberta (Test-NetConnection)
- [ ] DNS resolve corretamente (nslookup)
- [ ] VPN está desabilitada
- [ ] Firewall permite PostgreSQL (porta 5432)
- [ ] IP público está autorizado no Supabase
- [ ] Senha está correta (sem encoding especial)
- [ ] `npx prisma db pull` funciona

---

## 📞 Comandos de Debug

```bash
# Ver configuração atual
cat .env | grep DATABASE_URL

# Testar conexão básica
npx prisma db pull

# Ver schema atual
npx prisma db execute --stdin <<< "SELECT version();"

# Verificar porta
Test-NetConnection -ComputerName db.qducbqhuwqdyqioqevle.supabase.co -Port 5432

# Ver IP público
curl ifconfig.me
```

---

## 🆘 Se Nada Funcionar

**Última opção:**
1. Criar novo projeto no Supabase
2. Copiar connection string
3. Atualizar .env
4. Rodar migrations
5. Testar scripts

**Ou:**
Aguardar e tentar novamente mais tarde (pode ser manutenção temporária do Supabase).

---

## 📧 Suporte Supabase

Se o problema persistir:
- Dashboard: https://supabase.com/dashboard
- Status: https://status.supabase.com
- Discord: https://discord.supabase.com
- Docs: https://supabase.com/docs/guides/database/connecting-to-postgres
