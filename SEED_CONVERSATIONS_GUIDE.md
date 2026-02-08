# Guia: Seed de Conversas Realistas

## Visão Geral

Este script popula todas as 36 arenas com conversas autênticas e realistas, criando:
- **22 personas simuladas** com diferentes perfis e estilos de escrita
- **30-40 posts por arena** adaptados ao tema específico
- **Comentários naturais** que geram engajamento realista
- **Contadores sincronizados** automaticamente

## Objetivo

- Preservar os ~74 posts existentes
- Adicionar ~1.260 novos posts (35 por arena × 36 arenas)
- Total final: ~1.334 posts + comentários
- Conversas temáticas e relevantes para cada arena
- Sistema pronto para demonstração

## Arquitetura do Script

### Usuarios Simulados (22 personas)

```
- 5 iniciantes femininos
- 2 iniciantes masculinos
- 3 intermediarios femininos
- 3 intermediarios masculinos
- 2 avancados femininos
- 2 avancados masculinos
- 5+ personas especializadas
```

Cada usuario tem:
- `id`, `name`, `email` (únicos)
- Perfil com experiência, objetivo, estilo de escrita
- Padrões de interação realistas

### Templates de Conversas

O script mapeia arenas por slug e usa templates específicos:

| Arena Slug Contains | Template | Topicos |
|------------------|----------|---------|
| postura, estetica | postura_estetica | 6+ topicos |
| dor, funcao | dor_funcao | 6+ topicos |
| avalia, assimetria | avaliacao_biometrica | 6+ topicos |
| treino, performance | treino_performance | 6+ topicos |
| nutri, dieta | nutricao | 6+ topicos |
| mobilidade, flexibilidade | mobilidade | 6+ topicos |
| (outras) | default | 5 topicos genericos |

### Estrutura de Conversas

Para cada arena, o script cria threads com:

1. **POST PRINCIPAL** (pergunta do usuario)
   - Usuario simulado faz uma pergunta temática
   - Conteúdo natural e relevante

2. **COMENTARIOS** (resposta + feedbacks)
   - Comentário 1: Resposta inicial de outro usuario
   - Comentário 2: Follow-up do usuario original (probabilidade 60%)
   - Comentários 3-4: Outros usuarios comentando (2 comentarios)

Média: **4-5 posts/comentarios por thread**

## Como Executar

### Pré-requisitos

1. **Variáveis de ambiente** configuradas:
   ```bash
   DATABASE_URL = postgresql://...
   ```

2. **Banco de dados acessível** (Supabase ou PostgreSQL local)

3. **Node.js 18+** instalado

### Execução

```bash
# Na pasta do projeto
cd NUTRIFITCOACH_MASTER/nfc-comunidades

# Executar o seed
npm run seed:conversations
```

### Tempo Esperado

- **~10-15 minutos** para 36 arenas
- ~100ms delay entre arenas (para evitar sobrecarga)
- Gera 1-2 posts por segundo

## Saída Esperada

```
======================================
Seed de Conversas Realistas
======================================

Preparando usuarios simulados...
OK: 22 usuarios prontos

Arenas encontradas: 36
Meta por arena: 35 posts
Total esperado: ~1260 posts

Iniciando populacao em 3 segundos...

[1/36]
  Criando 35 posts para: Arena 1
    -> 35 posts, 105 comentarios
[2/36]
  Criando 30 posts para: Arena 2
    -> 35 posts, 98 comentarios
...
[36/36]

======================================
SEED COMPLETO!
======================================

Estatisticas Finais:
  Total de posts: ~1334
  Total de comentarios: ~3200-4000
  Total de interacoes: ~4500-5300
  Media de posts/arena: 37

Top 10 Arenas com mais posts:

  1. Arena 1: 35 posts
  2. Arena 2: 35 posts
  ...

Sistema pronto para uso!
```

## Detalhes do Script

### Ubicacao
```
scripts/seed-conversations.ts
```

### Funcionalidades Principais

#### 1. Criacao de Usuarios
```typescript
async function createOrGetUser(user: any)
```
- Cria usuarios se nao existirem
- Evita duplicatas verificando email

#### 2. Mapeamento de Arena
```typescript
function getTemplateForArena(arena: any): string[]
```
- Identifica tipo de arena pelo slug
- Retorna topicos apropriados

#### 3. Populacao de Arena
```typescript
async function populateArena(arena, targetPostsPerArena, allUsers)
```
- Conta posts existentes
- Calcula quantos precisam ser criados
- Cria threads com comentarios realistas
- Atualiza contadores da arena

#### 4. Atualizacao de Contadores
```typescript
await prisma.arena.update({
  data: {
    totalPosts,
    totalComments,
    dailyActiveUsers: uniqueUsers.length
  }
})
```

## Dados Criados

### Usuarios
- 22 personas com perfis completos
- Emails locais (fitcoach.local)
- Role padrão: USER

### Posts
- ~1.260 novos posts
- Topicos variados e temáticos
- Conteúdo realista por arena

### Comentarios
- ~3.200-4.000 novos comentarios
- Patterns naturais de conversas
- Usuarios diferentes interagindo

### Arenas (Atualizadas)
- `totalPosts` sincronizado
- `totalComments` sincronizado
- `dailyActiveUsers` calculado
- `updatedAt` refreshed

## Segurança

### O que o script FAZ

✅ Criar usuarios simulados com dados realistas
✅ Adicionar posts temáticos
✅ Manter histórico de posts existentes
✅ Sincronizar contadores automaticamente
✅ Usar transacoes do Prisma

### O que o script NÃO FAZ

❌ Nao deleta dados existentes
❌ Nao modifica usuarios reais
❌ Nao enviamessagens
❌ Nao acessa APIs externas
❌ Nao requer credenciais adicionais

## Troubleshooting

### Erro: "Can't reach database server"

**Solução:**
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Verificar conexão ao Supabase
psql $DATABASE_URL -c "SELECT 1"

# Se usar .env local
source .env.local
npm run seed:conversations
```

### Erro: "Invalid `prisma.user.findUnique()`"

**Solução:**
```bash
# Regenerar Prisma client
npx prisma generate

# Executar novamente
npm run seed:conversations
```

### Erro: Timeout

**Solução:**
```bash
# Aumentar timeout do Node
NODE_OPTIONS="--max-old-space-size=4096" npm run seed:conversations

# Ou usar tsx (mais rápido)
npx tsx scripts/seed-conversations.ts
```

## Customizacao

### Adicionar mais usuarios
Editar `SIMULATED_USERS` em `seed-conversations.ts`:
```typescript
const SIMULATED_USERS = [
  // ... usuarios existentes
  {
    id: 'user_sim_023',
    name: 'Novo Usuario',
    email: 'novo@fitcoach.local'
  }
];
```

### Mudar quantidade de posts
Editar `populateArena()`:
```typescript
await populateArena(arenas[i], 50, allUsers); // 50 posts ao invés de 35
```

### Adicionar novos templates
Editar `TOPIC_TEMPLATES`:
```typescript
const TOPIC_TEMPLATES: Record<string, string[]> = {
  // ... templates existentes
  novo_topico: [
    'Topico 1',
    'Topico 2',
    // ...
  ]
};
```

## Rollback (Se necessário)

### Remover dados criados

```sql
-- SQL para remover posts/comentarios simulados
DELETE FROM "Comment"
WHERE "post"."userId" LIKE 'user_sim_%';

DELETE FROM "Post"
WHERE "userId" LIKE 'user_sim_%';

-- Remover usuarios simulados (CUIDADO!)
DELETE FROM "User"
WHERE email LIKE '%.fitcoach.local';
```

## Próximos Passos

1. ✅ Executar o script
2. ✅ Validar contadores nos frontend
3. ✅ Verificar conversas em cada arena
4. ✅ Testar busca e filtros
5. ✅ Demonstrar sistema populado

## Arquivos

```
scripts/
  seed-conversations.ts    <- Script principal
  seed-test-data.ts        <- Script de teste existente
  seed-arenas-biometria.ts <- Outro script de seed

package.json               <- Com novo script adicionado
```

## Comandos Úteis

```bash
# Executar seed de conversas
npm run seed:conversations

# Executar seed de teste
npm run seed:test

# Ver logs do Prisma
DEBUG=* npm run seed:conversations

# Limpar dados (com cautela)
npx prisma db push --force-reset
```

## Suporte

Para problemas ou dúvidas:
1. Verificar `.env` e `DATABASE_URL`
2. Confirmar conexão ao banco
3. Regenerar Prisma client
4. Executar novamente com logs detalhados
