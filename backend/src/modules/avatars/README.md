# Sistema de Avatares - NutriFitCoach

## 📋 Visão Geral

Sistema determinístico de atribuição de avatares para posts e comentários, garantindo que avatares são **SEMPRE** atribuídos pelo backend, **NUNCA** gerados ou imaginados pelo LLM.

### Problema Resolvido

- ❌ Avatares duplicados nos chats
- ❌ Claude tentando "imaginar" avatares no texto
- ❌ Falta de sistema de atribuição automática

### Solução

✅ **30 avatares pré-definidos** com atribuição inteligente baseada em:
- Sexo (M/F)
- Idade (18-25, 25-35, 35-45, 45-60)
- Biotipo (ectomorfo, mesomorfo, endomorfo)
- Objetivo/Tags (hipertrofia, emagrecimento, crossfit, etc.)

✅ **Fallback robusto** com iniciais coloridas

✅ **Zero trabalho do LLM** - apenas escreve o texto da mensagem

---

## 🗂️ Estrutura de Arquivos

```
backend/src/modules/avatars/
├── avatar-catalog.json          # Catálogo com 30 avatares
├── avatar.service.ts            # Service principal (atribuição inteligente)
├── avatar-generator.service.ts  # Gerador de SVG (fallback)
├── avatar.module.ts             # Módulo NestJS
└── README.md                    # Esta documentação

scripts/
├── migrate-avatars.ts           # Migração de dados existentes
└── avatar-stats.ts              # Estatísticas de uso

components/avatar/
├── AvatarDisplay.tsx            # Component React
└── index.ts                     # Exports

prisma/schema.prisma             # Schema atualizado (Post + Comment)
```

---

## 🚀 Uso Básico

### 1. Importar o Service

```typescript
import { AvatarService } from './modules/avatars/avatar.service';

const avatarService = new AvatarService();
```

### 2. Atribuir Avatar Inteligente

```typescript
// Com critérios específicos
const avatar = avatarService.assignAvatar({
  sexo: 'F',
  idade: 29,
  biotipo: 'mesomorfo',
  objetivo: 'hipertrofia'
});

console.log(avatar);
// {
//   id: 'avatar_f_02',
//   sexo: 'F',
//   idade_range: '25-35',
//   biotipo: 'mesomorfo',
//   estilo: 'fitness_pro',
//   img: '/avatars/female/f_02_meso_adult_pro.png',
//   initials_color: '#9D50BB',
//   tags: ['adulta', 'atletica', 'intermediario']
// }
```

### 3. Atribuir Avatar Aleatório

```typescript
const avatar = avatarService.assignRandomAvatar();
```

### 4. Salvar no Banco

```typescript
await prisma.post.create({
  data: {
    userId: user.id,
    arenaId: arena.id,
    content: messageText,

    // Avatar (atribuído pelo backend)
    avatarId: avatar.id,
    avatarImg: avatar.img,
    avatarInitialsColor: avatar.initials_color
  }
});
```

### 5. Usar no Frontend

```tsx
import { AvatarDisplay } from '@/components/avatar';

<AvatarDisplay
  avatarId={post.avatarId}
  avatarImg={post.avatarImg}
  userName={post.user.name}
  initialsColor={post.avatarInitialsColor}
  size="md"
/>
```

---

## 🎯 Sistema de Filtros em Cascata

O `assignAvatar()` usa filtros em cascata:

1. **Filtra por sexo** (se fornecido)
   - Se há candidatos → mantém apenas deste sexo
   - Se não há → mantém todos

2. **Filtra por idade** (se fornecido)
   - Se há candidatos na faixa → mantém apenas estes
   - Se não há → mantém filtro anterior

3. **Filtra por biotipo** (se fornecido)
   - Se há candidatos → mantém apenas deste biotipo
   - Se não há → mantém filtro anterior

4. **Filtra por objetivo/tags** (se fornecido)
   - Busca match em tags (ex: "hipertrofia" → tag "hipertrofia")
   - Se há candidatos → mantém apenas estes
   - Se não há → mantém filtro anterior

5. **Escolhe aleatoriamente** entre os candidatos restantes

### Exemplo Prático

```typescript
// Critérios: Mulher, 29 anos, mesomorfo, hipertrofia
const avatar = avatarService.assignAvatar({
  sexo: 'F',        // 15 avatares femininos
  idade: 29,        // 5 avatares na faixa 25-35
  biotipo: 'mesomorfo',  // 2 avatares mesomorfos
  objetivo: 'hipertrofia' // 1 avatar com tag relacionada
});

// Resultado: avatar_f_02 ou avatar_f_11 (escolha aleatória)
```

---

## 🔧 Scripts NPM

### Migração de Dados

```bash
npm run avatar:migrate
```

Atribui avatares para todos os posts e comentários sem avatar.

**Saída:**
```
🚀 Iniciando migração de avatares...

📊 Estatísticas ANTES da migração:
  Total de posts: 1523
  Posts sem avatar: 1523
  Posts com avatar: 0

🔄 Migrando posts...
✅ Posts migrados: 1523, erros: 0

📈 Distribuição de avatares (top 10):
  1. avatar_m_02: 87 posts
  2. avatar_f_07: 76 posts
  ...
```

### Estatísticas de Uso

```bash
npm run avatar:stats
```

Exibe relatório completo sobre distribuição de avatares.

**Saída:**
```
📊 RELATÓRIO DE ESTATÍSTICAS DE AVATARES

📈 TOTAIS GERAIS:
  Posts: 1523 (1523 com avatar, 0 sem)
  Comentários: 4521 (4521 com avatar, 0 sem)
  Cobertura: Posts 100.0%, Comentários 100.0%

🎨 DISTRIBUIÇÃO POR AVATAR (POSTS):
  Total de avatares únicos em uso: 28

  1. avatar_m_02
     M | 25-35 | mesomorfo | athlete
     Uso: 87 posts (5.7%)

  2. avatar_f_07
     F | 25-35 | endomorfo | weight_loss
     Uso: 76 posts (5.0%)

⚧ DISTRIBUIÇÃO POR SEXO:
  Masculino (M): 720 (47.3%)
  Feminino (F): 803 (52.7%)

💪 DISTRIBUIÇÃO POR BIOTIPO:
  Ectomorfo: 450 (29.5%)
  Mesomorfo: 612 (40.2%)
  Endomorfo: 461 (30.3%)
```

---

## 🔄 Migração do Schema Prisma

### 1. Gerar Migration

```bash
npx prisma migrate dev --name add_avatar_system
```

### 2. Aplicar em Produção

```bash
npx prisma migrate deploy
```

### 3. Campos Adicionados

**Post:**
```prisma
model Post {
  // ... campos existentes

  // Avatar (NUNCA gerado pelo LLM)
  avatarId        String?
  avatarImg       String?
  avatarInitialsColor String?

  // ... restante
}
```

**Comment:**
```prisma
model Comment {
  // ... campos existentes

  // Avatar (NUNCA gerado pelo LLM)
  avatarId        String?
  avatarImg       String?
  avatarInitialsColor String?

  // ... restante
}
```

---

## 🤖 Atualizar System Prompt do LLM

**CRÍTICO:** Atualizar o prompt de geração de chat para remover referências a avatares.

### Antes (❌)
```
Você está gerando mensagens de chat. Descreva o usuário e seu avatar...
```

### Depois (✅)
```
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
  "avatar_id": "avatar_f_02",  // JÁ DEFINIDO, não comentar
  "profile": {
    "sexo": "F",
    "idade": 29,
    "biotipo": "mesomorfo",
    "objetivo": "hipertrofia"
  }
}

Escreva APENAS a mensagem do chat. O avatar já está definido pelo sistema.
```

---

## 📊 Catálogo de Avatares

30 avatares divididos em:

### Femininos (15)
- **avatar_f_01** a **avatar_f_15**
- Idades: 18-60 anos
- Biotipos: ecto, meso, endo
- Estilos: casual_fitness, fitness_pro, wellness, yoga_pilates, crossfit, bodybuilding, triathlete, dance_fitness, climber, etc.

### Masculinos (15)
- **avatar_m_01** a **avatar_m_15**
- Idades: 18-60 anos
- Biotipos: ecto, meso, endo
- Estilos: bodybuilding_beginner, athlete, powerlifting, calisthenics, crossfit, strongman, runner, martial_artist, soccer_player, rugby_player, etc.

---

## 🎨 Fallback de Iniciais

Quando não há imagem disponível ou há erro ao carregar:

```typescript
const initials = avatarService.getInitials('Maria Silva'); // "MS"
const color = avatarService.getInitialsColor('Maria Silva'); // "#9D50BB"
```

**Regras:**
- Nome único: primeiras 2 letras (ex: "Maria" → "MA")
- Nome completo: primeira do primeiro + primeira do último (ex: "Maria Silva" → "MS")
- Cor determinística: mesmo nome sempre gera mesma cor

---

## 🔒 Garantias do Sistema

✅ **Determinístico:** Mesmo perfil sempre gera pool consistente de candidatos

✅ **Escalável:** 30 avatares base cobrem ampla variedade de perfis

✅ **Robusto:** Fallback automático para iniciais coloridas

✅ **Zero trabalho do LLM:** LLM apenas escreve texto, nunca lida com avatares

✅ **Migração segura:** Script de migração com logs detalhados e rollback

---

## 📈 Métricas e Monitoramento

### Métricas Importantes

1. **Cobertura de avatares:** % de posts/comentários com avatar
2. **Distribuição:** Uso balanceado dos 30 avatares
3. **Fallback rate:** Frequência de uso de iniciais vs imagens
4. **Performance:** Tempo de atribuição de avatar

### Queries Úteis

```sql
-- Posts sem avatar
SELECT COUNT(*) FROM posts WHERE avatar_id IS NULL;

-- Distribuição de avatares
SELECT avatar_id, COUNT(*) as total
FROM posts
WHERE avatar_id IS NOT NULL
GROUP BY avatar_id
ORDER BY total DESC;

-- Cobertura por arena
SELECT a.slug,
       COUNT(p.id) as total_posts,
       COUNT(p.avatar_id) as posts_with_avatar,
       ROUND(COUNT(p.avatar_id)::numeric / COUNT(p.id) * 100, 2) as coverage_pct
FROM arenas a
LEFT JOIN posts p ON p.arena_id = a.id
GROUP BY a.slug
ORDER BY coverage_pct ASC;
```

---

## 🐛 Troubleshooting

### Problema: Avatares duplicados

**Causa:** Migration não executada ou sistema antigo ainda ativo

**Solução:**
```bash
npm run avatar:migrate
```

### Problema: Imagens não carregam

**Causa:** Paths incorretos ou arquivos não existem

**Solução:** Verificar que `/public/avatars/` existe e tem permissões corretas

### Problema: LLM ainda menciona avatares

**Causa:** System prompt não atualizado

**Solução:** Atualizar prompt conforme seção "Atualizar System Prompt"

---

## 🚀 Roadmap Futuro

- [ ] Upload de avatares customizados por usuários
- [ ] Sistema de badges e conquistas visuais
- [ ] Avatares animados para usuários premium
- [ ] Geração procedural de mais variações
- [ ] A/B testing de estilos de avatar

---

## 📝 Licença

Propriedade de NutriFitCoach - Todos os direitos reservados
