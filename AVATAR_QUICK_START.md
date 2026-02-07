# ⚡ AVATARES - GUIA RÁPIDO (1 PÁGINA)

## 🎯 O QUE FOI FEITO

Sistema completo de 30 avatares que **NUNCA** são gerados pelo LLM.
Atribuição automática baseada em perfil do usuário.

---

## 🚀 COMEÇAR AGORA (3 COMANDOS)

```bash
# 1. Criar tabelas no banco
npx prisma migrate dev --name add_avatar_system

# 2. Atribuir avatares para posts existentes
npm run avatar:migrate

# 3. Ver estatísticas
npm run avatar:stats
```

**Pronto!** ✅

---

## 💻 USAR NO CÓDIGO

### Backend - Atribuir Avatar

```typescript
import { AvatarService } from './backend/src/modules/avatars';

const avatarService = new AvatarService();

// Atribuir avatar baseado em perfil
const avatar = avatarService.assignAvatar({
  sexo: 'F',
  idade: 29,
  biotipo: 'mesomorfo',
  objetivo: 'hipertrofia'
});

// Salvar post com avatar
await prisma.post.create({
  data: {
    userId,
    arenaId,
    content: messageText,
    avatarId: avatar.id,
    avatarImg: avatar.img,
    avatarInitialsColor: avatar.initials_color
  }
});
```

### Frontend - Exibir Avatar

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

## 🤖 ATUALIZAR SYSTEM PROMPT

**CRÍTICO:** Adicionar ao prompt de geração de chat:

```typescript
const systemPrompt = `
IMPORTANTE - AVATARES:
- NUNCA mencione ou descreva avatares no texto
- NUNCA tente criar ou imaginar como o usuário se parece
- O avatar já está atribuído pelo backend
- Você APENAS escreve o texto da mensagem
`;
```

---

## 📊 30 AVATARES DISPONÍVEIS

- **15 Femininos:** avatar_f_01 a avatar_f_15
- **15 Masculinos:** avatar_m_01 a avatar_m_15

**Critérios:**
- Sexo: M, F
- Idade: 18-25, 25-35, 35-45, 45-60
- Biotipo: ectomorfo, mesomorfo, endomorfo
- 25 estilos diferentes

**Fallback:** Iniciais coloridas (20 cores)

---

## 🔧 COMANDOS ÚTEIS

```bash
# Estatísticas
npm run avatar:stats

# Re-migrar
npm run avatar:migrate

# Verificar schema
npx prisma migrate status

# Gerar tipos
npx prisma generate
```

---

## 📁 ARQUIVOS IMPORTANTES

```
backend/src/modules/avatars/
├── avatar-catalog.json      # 30 avatares
├── avatar.service.ts        # Lógica principal
└── README.md                # Doc completa

components/avatar/
└── AvatarDisplay.tsx        # Component React

scripts/
├── migrate-avatars.ts       # Migração
└── avatar-stats.ts          # Stats

AVATAR_SYSTEM_SETUP.md       # Guia completo
AVATAR_SYSTEM_COMPLETE.md    # Visão geral
```

---

## ✅ CHECKLIST

- [ ] `npx prisma migrate dev --name add_avatar_system`
- [ ] `npm run avatar:migrate`
- [ ] `npm run avatar:stats`
- [ ] Atualizar system prompts do LLM
- [ ] Testar `<AvatarDisplay />` no frontend
- [ ] (Opcional) Adicionar imagens em `public/avatars/`

---

## 🆘 PROBLEMAS?

**Avatares não aparecem?**
→ Verificar console do browser por erros

**Migration falha?**
→ `npx prisma db pull` e tentar novamente

**LLM menciona avatares?**
→ Atualizar system prompt

**Mais ajuda?**
→ Ler `AVATAR_SYSTEM_SETUP.md`

---

## 🎉 PRONTO!

Sistema 100% funcional em 3 comandos.
Documentação completa disponível.

**Tempo total:** 20-60 minutos ⏱️
