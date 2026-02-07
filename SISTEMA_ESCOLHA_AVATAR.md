# 🎨 Sistema de Escolha de Avatar para Usuários

## 📋 O que foi criado

### 1. **Script de correção de arenas**
- **Arquivo:** `scripts/fix-arena-avatars.ts`
- **Função:** Analisa e corrige avatares duplicados nas arenas
- **Comando:** `npm run avatar:fix-arenas`

### 2. **Componente de seleção de avatar**
- **Arquivo:** `components/avatar/AvatarPicker.tsx`
- **Função:** Interface para usuários escolherem avatar
- **Features:**
  - Grid visual com 30 avatares
  - Filtros por gênero (Todos/Feminino/Masculino)
  - Preview do avatar selecionado
  - Informações detalhadas (idade, biotipo, tags)
  - Fallback para iniciais se imagem falhar

### 3. **API de catálogo**
- **Arquivo:** `pages/api/avatars/catalog.ts`
- **Endpoint:** `GET /api/avatars/catalog`
- **Resposta:** JSON com 30 avatares disponíveis
- **Cache:** 1 hora

### 4. **SQL para adicionar avatar ao User**
- **Arquivo:** `ADICIONAR_AVATAR_USER.sql`
- **Função:** Adiciona campos de avatar na tabela User
- **Campos:**
  - `avatarId` - ID do avatar escolhido
  - `avatarImg` - Path da imagem
  - `avatarInitialsColor` - Cor de fallback
  - `profilePicture` - Upload de foto própria (alternativa)

---

## 🚀 Como usar

### Passo 1: Aplicar SQL no Supabase

```bash
# Copiar SQL
type ADICIONAR_AVATAR_USER.sql | clip
```

1. Abrir Supabase SQL Editor
2. Colar e executar
3. Verificar que colunas foram criadas

### Passo 2: Corrigir avatares das arenas

**Opção A: Localmente (banco local)**
```bash
npm run avatar:fix-arenas
```

**Opção B: No Supabase (criar script SQL similar)**

### Passo 3: Integrar componente no cadastro

Exemplo de uso no formulário de cadastro:

```tsx
import { AvatarPicker } from '@/components/avatar/AvatarPicker';
import { useState } from 'react';

export default function SignupPage() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [useCustomPhoto, setUseCustomPhoto] = useState(false);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setUseCustomPhoto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      // Avatar escolhido
      avatarId: selectedAvatar?.id,
      avatarImg: selectedAvatar?.img,
      avatarInitialsColor: selectedAvatar?.initials_color,
      // Ou foto própria
      profilePicture: useCustomPhoto ? uploadedImageUrl : null
    };

    // Enviar para API
    await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Senha" required />

      {/* Seleção de avatar OU upload de foto */}
      <div className="space-y-4">
        <h3>Escolha sua foto de perfil</h3>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setUseCustomPhoto(false)}
            className={!useCustomPhoto ? 'active' : ''}
          >
            Escolher Avatar
          </button>
          <button
            type="button"
            onClick={() => setUseCustomPhoto(true)}
            className={useCustomPhoto ? 'active' : ''}
          >
            Upload de Foto
          </button>
        </div>

        {/* Conteúdo */}
        {!useCustomPhoto ? (
          <AvatarPicker
            onSelect={handleAvatarSelect}
            selectedAvatarId={selectedAvatar?.id}
          />
        ) : (
          <input type="file" accept="image/*" />
        )}
      </div>

      <button type="submit">Cadastrar</button>
    </form>
  );
}
```

---

## 📊 Análise de avatares em arenas

O script `fix-arena-avatars.ts` faz:

1. **Análise:**
   - Conta total de arenas
   - Identifica arenas com avatar
   - Detecta duplicados
   - Mostra distribuição atual

2. **Correção:**
   - Mantém arenas com avatar único
   - Reatribui apenas duplicados
   - Usa algoritmo de balanceamento
   - Escolhe avatares menos usados

3. **Relatório:**
   - Log detalhado em JSON
   - Estatísticas before/after
   - Top 10 avatares mais usados

### Exemplo de saída:

```
🔍 ANÁLISE E CORREÇÃO DE AVATARES EM ARENAS

📊 Total de arenas: 45

📈 Distribuição atual:
   ✅ Arenas com avatar: 42
   ⚠️  Arenas sem avatar: 3
   🎨 Avatares únicos em uso: 18/30

🚨 Avatares duplicados:
   - avatar_f_02: usado 5 vezes
   - avatar_m_01: usado 4 vezes
   - avatar_f_08: usado 3 vezes

🔧 Arenas que precisam de correção: 9

✅ CORREÇÃO CONCLUÍDA!

📊 Resultados:
   - Arenas corrigidas: 9
   - Taxa de sucesso: 100.0%

📈 Nova distribuição (top 10):
   avatar_f_02          : 1 arena(s)
   avatar_m_01          : 1 arena(s)
   avatar_f_08          : 1 arena(s)
   ...

📊 Estatísticas finais:
   - Avatares em uso: 27/30
   - Uso máximo: 2 arena(s)/avatar
   - Uso mínimo: 1 arena(s)/avatar
```

---

## 🎨 Catálogo de Avatares

### Endpoint da API

```
GET /api/avatars/catalog
```

**Resposta:**
```json
{
  "version": "1.0.0",
  "total_avatars": 30,
  "avatars": [
    {
      "id": "avatar_f_01",
      "sexo": "F",
      "idade_range": "18-25",
      "biotipo": "ectomorfo",
      "estilo": "casual_fitness",
      "skin_tone": "clara",
      "hair_color": "loiro",
      "img": "/avatars/female/f_01_ecto_young_casual.png",
      "initials_color": "#FF6B9D",
      "tags": ["jovem", "magra", "iniciante"]
    },
    // ... 29 more
  ],
  "fallback_colors": ["#FF6B9D", "#E91E63", ...]
}
```

### Uso no frontend

```tsx
// Buscar avatares
const response = await fetch('/api/avatars/catalog');
const data = await response.json();
console.log(data.avatars); // Array com 30 avatares

// Filtrar por gênero
const femaleAvatars = data.avatars.filter(a => a.sexo === 'F');
const maleAvatars = data.avatars.filter(a => a.sexo === 'M');

// Filtrar por idade
const youngAvatars = data.avatars.filter(a =>
  a.idade_range === '18-25'
);
```

---

## 🔧 Próximos Passos

### 1. Aplicar SQL no Supabase ✅
```bash
# Executar ADICIONAR_AVATAR_USER.sql no Supabase Studio
```

### 2. Corrigir arenas duplicadas
```bash
# Local (se testando)
npm run avatar:fix-arenas

# Produção: criar script SQL similar ao APLICAR_AVATARES_TODAS_COLUNAS.sql
```

### 3. Integrar AvatarPicker no cadastro
- Importar componente
- Adicionar ao formulário
- Enviar avatarId/avatarImg/avatarInitialsColor no signup

### 4. Atualizar lógica de exibição
Usar avatar do User quando disponível:

```tsx
// Prioridade:
// 1. profilePicture (foto própria)
// 2. avatarImg (avatar escolhido)
// 3. Fallback para iniciais

const getUserAvatar = (user) => {
  if (user.profilePicture) return user.profilePicture;
  if (user.avatarImg) return user.avatarImg;
  return null; // Usar AvatarDisplay com fallback
};
```

### 5. Permitir mudança de avatar
Criar página de perfil onde usuário pode:
- Ver avatar atual
- Trocar por outro avatar
- Upload de foto própria
- Remover foto e voltar para avatar

---

## 📦 Arquivos Criados

```
scripts/fix-arena-avatars.ts          → Script de correção
components/avatar/AvatarPicker.tsx    → Componente de seleção
pages/api/avatars/catalog.ts          → API endpoint
ADICIONAR_AVATAR_USER.sql             → SQL para User
SISTEMA_ESCOLHA_AVATAR.md             → Este arquivo
```

---

## ✅ Checklist

- [ ] SQL executado no Supabase (User com campos de avatar)
- [ ] Avatares de arenas corrigidos
- [ ] AvatarPicker integrado no cadastro
- [ ] API /api/avatars/catalog funcionando
- [ ] Lógica de exibição atualizada (prioridade: foto > avatar > iniciais)
- [ ] Página de perfil com opção de trocar avatar
- [ ] Testado em produção

---

**Última atualização:** 05/02/2026
