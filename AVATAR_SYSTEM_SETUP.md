# 🎨 Sistema de Avatares - Guia de Setup Completo

## 📋 Visão Geral

Sistema determinístico de atribuição de avatares que resolve o problema de avatares duplicados e garante que avatares são **SEMPRE** atribuídos pelo backend, **NUNCA** pelo LLM.

---

## ✅ Checklist de Implementação

### 1. Backend - Módulo de Avatares

- [x] Criar diretório `backend/src/modules/avatars/`
- [x] Criar `avatar-catalog.json` (30 avatares)
- [x] Criar `avatar.service.ts` (lógica de atribuição)
- [x] Criar `avatar-generator.service.ts` (gerador de SVG)
- [x] Criar `avatar.module.ts` (módulo NestJS)
- [x] Criar `README.md` (documentação)
- [x] Criar `INTEGRATION_EXAMPLE.ts` (exemplos práticos)

### 2. Database - Schema Prisma

- [x] Adicionar campos de avatar ao modelo `Post`
  - `avatarId: String?`
  - `avatarImg: String?`
  - `avatarInitialsColor: String?`

- [x] Adicionar campos de avatar ao modelo `Comment`
  - `avatarId: String?`
  - `avatarImg: String?`
  - `avatarInitialsColor: String?`

- [x] Adicionar índice em `avatarId`

- [ ] **EXECUTAR MIGRATION:**
  ```bash
  npx prisma migrate dev --name add_avatar_system
  ```

### 3. Scripts

- [x] Criar `scripts/migrate-avatars.ts`
- [x] Criar `scripts/avatar-stats.ts`
- [x] Adicionar comandos ao `package.json`:
  - `npm run avatar:migrate`
  - `npm run avatar:stats`

### 4. Frontend - Componentes

- [x] Criar `components/avatar/AvatarDisplay.tsx`
- [x] Criar `components/avatar/index.ts`

### 5. Assets - Imagens

- [x] Criar diretórios:
  - `public/avatars/female/`
  - `public/avatars/male/`
  - `public/avatars/generated/`

- [ ] **TODO: Adicionar imagens reais**
  - 15 avatares femininos (f_01 a f_15)
  - 15 avatares masculinos (m_01 a m_15)
  - Formato: PNG, 200x200px mínimo
  - Nomes conforme catálogo (ex: `f_01_ecto_young_casual.png`)

### 6. System Prompt

- [ ] **CRÍTICO: Atualizar prompts de geração de chat**
  - Remover qualquer menção a avatares
  - Adicionar instrução explícita: "NUNCA mencione avatares"
  - Ver seção "System Prompt" abaixo

---

## 🚀 Passos de Instalação

### Passo 1: Verificar Arquivos Criados

```bash
# Verificar estrutura backend
ls -la backend/src/modules/avatars/

# Verificar componentes frontend
ls -la components/avatar/

# Verificar scripts
ls -la scripts/migrate-avatars.ts scripts/avatar-stats.ts
```

### Passo 2: Instalar Dependências (se necessário)

```bash
npm install
```

### Passo 3: Executar Migration

```bash
# Gerar e aplicar migration
npx prisma migrate dev --name add_avatar_system

# Verificar que foi criado
npx prisma migrate status
```

### Passo 4: Migrar Dados Existentes

```bash
# Atribuir avatares para posts/comentários sem avatar
npm run avatar:migrate
```

**Saída esperada:**
```
🚀 Iniciando migração de avatares...

📊 Estatísticas ANTES da migração:
  Total de posts: 1523
  Posts sem avatar: 1523
  ...

✅ Migração completa!
```

### Passo 5: Verificar Estatísticas

```bash
npm run avatar:stats
```

**Saída esperada:**
```
📊 RELATÓRIO DE ESTATÍSTICAS DE AVATARES

📈 TOTAIS GERAIS:
  Posts: 1523 (1523 com avatar, 0 sem)
  Cobertura: Posts 100.0%, Comentários 100.0%

🎨 DISTRIBUIÇÃO POR AVATAR (POSTS):
  Total de avatares únicos em uso: 28
  ...
```

---

## 🔧 Configuração

### System Prompt para Geração de Chat

**Atualizar o prompt usado para gerar mensagens:**

```typescript
const chatGenerationPrompt = `
Você está gerando mensagens de chat para o sistema NutriFitCoach.

IMPORTANTE - AVATARES:
- NUNCA mencione ou descreva avatares no texto das mensagens
- NUNCA tente criar ou imaginar como o usuário se parece
- O usuário já possui um avatar_id atribuído automaticamente pelo sistema
- Você APENAS escreve mensagens coerentes com o perfil fornecido
- NÃO inclua descrições visuais do usuário

Informações que você RECEBE (não mencionar no texto):
{
  "user_name": "Maria_Fit34",
  "avatar_id": "avatar_f_02",  // JÁ DEFINIDO pelo backend
  "profile": {
    "sexo": "F",
    "idade": 29,
    "biotipo": "mesomorfo",
    "objetivo": "hipertrofia"
  }
}

Escreva APENAS a mensagem do chat. O avatar já está definido pelo sistema.
`;
```

### Integração no Código de Geração

```typescript
import { AvatarService } from './modules/avatars/avatar.service';

const avatarService = new AvatarService();

// 1. ATRIBUIR AVATAR (BACKEND)
const avatar = avatarService.assignAvatar({
  sexo: profile.sexo,
  idade: profile.idade,
  biotipo: profile.biotipo,
  objetivo: profile.objetivo
});

// 2. GERAR MENSAGEM (LLM - sem mencionar avatar)
const message = await claude.generate({
  system: chatGenerationPrompt,
  user: `
    Gere uma mensagem de chat para:
    Nome: ${userName}
    Avatar ID: ${avatar.id} (sistema interno, não mencionar)
    Perfil: ${JSON.stringify(profile)}
    Contexto: ${context}
  `
});

// 3. SALVAR COM AVATAR
await prisma.post.create({
  data: {
    userId,
    arenaId,
    content: message,
    avatarId: avatar.id,
    avatarImg: avatar.img,
    avatarInitialsColor: avatar.initials_color
  }
});
```

---

## 🎨 Adicionar Imagens de Avatar

### Opção 1: Usar Imagens Reais (Recomendado)

1. Criar ou obter 30 imagens de avatar (15F + 15M)
2. Salvar em `public/avatars/female/` e `public/avatars/male/`
3. Nomear conforme catálogo:
   - `f_01_ecto_young_casual.png`
   - `m_02_meso_adult_athlete.png`
   - etc.

**Especificações:**
- Formato: PNG com fundo transparente
- Tamanho: 200x200px mínimo (recomendado 400x400px)
- Estilo: Ilustrações consistentes (não fotos reais)

### Opção 2: Usar Avatares Gerados (Temporário)

Usar serviços como DiceBear, Avataaars, etc:

```typescript
// Gerar URLs dinâmicos
const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${userId}&backgroundColor=${bgColor}`;
```

### Opção 3: Gerar SVG com Iniciais (Fallback)

O sistema já tem geração automática de SVG com iniciais:

```typescript
import { AvatarGeneratorService } from './modules/avatars/avatar-generator.service';

const generator = new AvatarGeneratorService();
const svgPath = await generator.saveSVGToFile('user123', 'MS', '#9D50BB');
// Gera: /public/avatars/generated/user123.svg
```

---

## 📊 Monitoramento e Manutenção

### Queries SQL Úteis

```sql
-- Verificar cobertura de avatares
SELECT
  (SELECT COUNT(*) FROM posts WHERE avatar_id IS NOT NULL)::float /
  NULLIF((SELECT COUNT(*) FROM posts), 0) * 100 as coverage_pct;

-- Posts sem avatar
SELECT id, user_id, created_at
FROM posts
WHERE avatar_id IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Distribuição de avatares
SELECT avatar_id, COUNT(*) as total
FROM posts
WHERE avatar_id IS NOT NULL
GROUP BY avatar_id
ORDER BY total DESC;

-- Avatares não utilizados
SELECT a.id
FROM (
  SELECT DISTINCT avatar_id FROM posts WHERE avatar_id IS NOT NULL
) p
RIGHT JOIN avatars a ON p.avatar_id = a.id
WHERE p.avatar_id IS NULL;
```

### Scripts de Manutenção

```bash
# Verificar estatísticas semanalmente
npm run avatar:stats

# Re-migrar se necessário
npm run avatar:migrate

# Verificar logs de erro
grep "AvatarDisplay" logs/application.log | grep ERROR
```

---

## 🐛 Troubleshooting

### Problema: Migration falha

**Erro:**
```
Error: Migration failed
```

**Solução:**
```bash
# Resetar migration (CUIDADO: perde dados)
npx prisma migrate reset

# Ou criar migration customizada
npx prisma migrate dev --create-only --name add_avatar_system
# Editar o arquivo SQL gerado
npx prisma migrate deploy
```

### Problema: Avatares não aparecem no frontend

**Causas possíveis:**

1. Imagens não existem em `public/avatars/`
   - Verificar: `ls -la public/avatars/female/`
   - Adicionar imagens ou usar fallback de iniciais

2. Next.js não servindo arquivos estáticos
   - Reiniciar servidor: `npm run dev`
   - Verificar `next.config.js` não bloqueia `/avatars/`

3. Componente não recebe props corretas
   - Verificar que `avatarImg`, `userName` são passados
   - Checar console do browser por erros

**Debug:**
```tsx
<AvatarDisplay
  avatarImg={post.avatarImg || undefined}
  userName={post.user?.name || 'Usuário'}
  initialsColor={post.avatarInitialsColor}
  size="md"
/>
```

### Problema: LLM ainda menciona avatares

**Causa:** System prompt não atualizado

**Solução:**

1. Localizar onde o prompt é definido
2. Adicionar seção "IMPORTANTE - AVATARES"
3. Testar geração e verificar output

**Teste:**
```typescript
const message = await generateMessage(profile);
console.log('Mensagem gerada:', message);
// Deve NÃO conter: "avatar", "aparência", "foto", etc.
```

---

## 📈 Próximos Passos

### Curto Prazo (Imediato)

1. [ ] Executar migration: `npx prisma migrate dev --name add_avatar_system`
2. [ ] Migrar dados: `npm run avatar:migrate`
3. [ ] Atualizar system prompts
4. [ ] Adicionar imagens reais de avatares
5. [ ] Testar componente `AvatarDisplay` em produção

### Médio Prazo (1-2 semanas)

1. [ ] Monitorar distribuição de avatares
2. [ ] Ajustar algoritmo se necessário (balanceamento)
3. [ ] Adicionar mais variações (ampliar de 30 para 50 avatares)
4. [ ] Implementar upload de avatar customizado

### Longo Prazo (1-3 meses)

1. [ ] Sistema de badges e conquistas
2. [ ] Avatares animados para premium
3. [ ] A/B testing de estilos
4. [ ] Analytics de preferência de avatar

---

## 📝 Checklist Final

Antes de marcar como concluído:

- [ ] Migration executada com sucesso
- [ ] Todos os posts têm avatar (cobertura 100%)
- [ ] Todos os comentários têm avatar (cobertura 100%)
- [ ] Componente `AvatarDisplay` funciona no frontend
- [ ] Fallback de iniciais funciona quando imagem falha
- [ ] System prompt atualizado (LLM não menciona avatares)
- [ ] Imagens de avatar adicionadas (ou fallback configurado)
- [ ] Scripts `avatar:migrate` e `avatar:stats` funcionando
- [ ] Documentação lida e compreendida pela equipe
- [ ] Testes em ambiente de staging aprovados

---

## 📚 Documentação Adicional

- **README completo:** `backend/src/modules/avatars/README.md`
- **Exemplos de integração:** `backend/src/modules/avatars/INTEGRATION_EXAMPLE.ts`
- **Schema Prisma:** `prisma/schema.prisma`
- **Catálogo de avatares:** `backend/src/modules/avatars/avatar-catalog.json`

---

## 🆘 Suporte

Se encontrar problemas:

1. Verificar logs: `grep "Avatar" logs/application.log`
2. Executar estatísticas: `npm run avatar:stats`
3. Consultar documentação: `backend/src/modules/avatars/README.md`
4. Verificar issues conhecidas neste documento

---

## ✅ Conclusão

O sistema de avatares está **100% implementado** e pronto para uso. Falta apenas:

1. Executar a migration do Prisma
2. Rodar o script de migração de dados
3. Adicionar imagens reais (ou manter fallback)
4. Atualizar system prompts do LLM

**Tempo estimado para finalizar:** 30-60 minutos

🚀 **Boa sorte!**
