# 🏋️ Como Criar as Arenas de Biomecânica

## Método 1: SQL Editor do Supabase (RECOMENDADO)

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Faça login na sua conta
   - Selecione o projeto: `qducbqhuwqdyqioqevle`

2. **Abra o SQL Editor**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Execute o Script**
   - Copie todo o conteúdo do arquivo: `INSERT_BIOMECHANICS_ARENAS.sql`
   - Cole no editor SQL
   - Clique em **Run** ou pressione `Ctrl+Enter`

4. **Verifique os Resultados**
   - Você deve ver uma tabela com 6 arenas criadas ao final da execução
   - Todas as 6 arenas devem aparecer com `isActive: true`

---

## Método 2: Via API Route (Alternativo)

Se preferir usar a API Route criada:

```bash
# Certifique-se de que o servidor Next.js está rodando
cd D:\NUTRIFITCOACH_MASTER\nfc-comunidades
npm run dev

# Em outro terminal, execute:
curl -X POST http://localhost:3000/api/admin/seed-biomechanics
```

---

## 📋 Arenas que Serão Criadas

### 1. Hub Biomecânico
- **Slug:** `hub-biomecanico`
- **Tipo:** NFV_HUB
- **Categoria:** BIOMECANICA_NFV
- **Descrição:** Discussão aberta sobre biomecânica, padrões de movimento

### 2. Análise: Agachamento
- **Slug:** `analise-agachamento`
- **Tipo:** NFV_PREMIUM
- **Categoria:** BIOMECANICA_NFV
- **Movimento:** Agachamento (membros-inferiores)

### 3. Análise: Levantamento Terra
- **Slug:** `analise-terra`
- **Tipo:** NFV_PREMIUM
- **Categoria:** BIOMECANICA_NFV
- **Movimento:** Terra (membros-inferiores)

### 4. Análise: Supino
- **Slug:** `analise-supino`
- **Tipo:** NFV_PREMIUM
- **Categoria:** BIOMECANICA_NFV
- **Movimento:** Supino (membros-superiores)

### 5. Análise: Puxadas
- **Slug:** `analise-puxadas`
- **Tipo:** NFV_PREMIUM
- **Categoria:** BIOMECANICA_NFV
- **Movimento:** Puxadas (membros-superiores)

### 6. Análise: Elevação Pélvica
- **Slug:** `analise-elevacao-pelvica`
- **Tipo:** NFV_PREMIUM
- **Categoria:** BIOMECANICA_NFV
- **Movimento:** Elevação Pélvica (membros-inferiores)

---

## ✅ Verificação

Após executar o SQL, você pode verificar se as arenas foram criadas corretamente:

1. **No Supabase:**
   - Vá em **Table Editor**
   - Selecione a tabela `Arena`
   - Filtre por categoria: `BIOMECANICA_NFV`
   - Deve aparecer 6 arenas

2. **No App:**
   - Acesse: https://chat.nutrifitcoach.com.br
   - Navegue até a seção de arenas
   - Filtre por categoria "Biomecânica & NFV"
   - As 6 arenas devem aparecer

---

## ❌ Troubleshooting

### Erro: "duplicate key value violates unique constraint"
- As arenas já existem no banco
- Use o comando DELETE no início do SQL para limpar primeiro

### Erro: "permission denied"
- Verifique se você está usando o SQL Editor com permissões de admin
- Ou use a Service Role Key no Supabase

### Arenas não aparecem no app
- Verifique se `isActive` está como `true`
- Limpe o cache do navegador (Ctrl+Shift+R)
- Reinicie o servidor Next.js

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do servidor Next.js
3. Verifique a conexão com o banco de dados no `.env.local`
