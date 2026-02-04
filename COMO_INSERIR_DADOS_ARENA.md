# 📥 COMO INSERIR OS DADOS DA ARENA NO BANCO

## Status: ✅ Dados Gerados com Sucesso!

**Arena:** Barriga Pochete / Postura
**Threads:** 5
**Respostas:** 25
**Ghost Users:** 25
**Taxa IA:** 20%

---

## 📁 Arquivos Gerados

✅ `arena-barriga-pochete-dados.json` - Dados em formato JSON
✅ `arena-barriga-pochete-dados.sql` - Script SQL pronto para executar

---

## 🎯 OPÇÃO 1: SQL Direto no Supabase (RECOMENDADO)

### Passo 1: Abrir Supabase Dashboard

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto NutrifitCoach
3. Vá em **SQL Editor** (menu lateral)

### Passo 2: Criar a Arena (se não existir)

```sql
-- Verificar se arena existe
SELECT * FROM arenas WHERE slug = 'barriga-pochete-postura';

-- Se não existir, criar:
INSERT INTO arenas (
  slug,
  name,
  description,
  icon,
  color,
  category,
  ai_persona,
  ai_intervention_rate,
  ai_frustration_threshold,
  ai_cooldown,
  arena_type,
  status,
  created_at,
  updated_at
) VALUES (
  'barriga-pochete-postura',
  'Barriga "Pochete": Gordura ou Postura?',
  'Aqui a estética começa na postura. Nem tudo que parece gordura é gordura.',
  '🏋️',
  'purple',
  'postura',
  'BIOMECHANICS_EXPERT',
  40,
  30,
  10,
  'GENERAL',
  'ACTIVE',
  NOW(),
  NOW()
);
```

### Passo 3: Executar SQL dos Dados

1. Abra o arquivo `arena-barriga-pochete-dados.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou F5)

✅ **Pronto!** Todos os dados serão inseridos.

---

## 🎯 OPÇÃO 2: Via Script com Variáveis de Ambiente

### Passo 1: Configurar `.env`

Crie/atualize o arquivo `.env` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Passo 2: Executar Script de Povoamento

```bash
npx tsx scripts/populate-communities.ts barriga-pochete-postura 5
```

---

## 🎯 OPÇÃO 3: Via JSON (Programaticamente)

### Código Node.js

```typescript
import { createClient } from '@supabase/supabase-js';
import * as dados from './arena-barriga-pochete-dados.json';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 1. Criar ghost users
for (const user of dados.ghostUsers) {
  await supabase.from('users').upsert(user);
}

// 2. Criar threads
for (const thread of dados.threads) {
  // Buscar arena_id
  const { data: arena } = await supabase
    .from('arenas')
    .select('id')
    .eq('slug', thread.arena_slug)
    .single();

  if (arena) {
    await supabase.from('posts').insert({
      ...thread,
      arena_id: arena.id,
    });
  }
}

// 3. Criar mensagens
for (const msg of dados.mensagens) {
  await supabase.from('nfc_chat_messages').insert(msg);
}
```

---

## 📊 Verificar Inserção

Após inserir, execute estes comandos SQL para verificar:

### Verificar Ghost Users

```sql
SELECT COUNT(*) as total,
       name, username
FROM users
WHERE is_ghost_user = true
LIMIT 10;
```

**Esperado:** 25 ghost users

### Verificar Threads

```sql
SELECT p.id, p.title, u.username, p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN arenas a ON p.arena_id = a.id
WHERE a.slug = 'barriga-pochete-postura'
ORDER BY p.created_at DESC;
```

**Esperado:** 5 threads

### Verificar Mensagens

```sql
SELECT COUNT(*) as total_mensagens,
       COUNT(DISTINCT author_id) as autores_unicos,
       COUNT(CASE WHEN is_ia THEN 1 END) as mensagens_ia
FROM nfc_chat_messages
WHERE comunidade_slug = 'barriga-pochete-postura';
```

**Esperado:**
- Total mensagens: 25
- Autores únicos: 25-26
- Mensagens IA: 1-2 (20-40%)

### Ver Thread Completa (Exemplo)

```sql
SELECT
  p.title as thread_titulo,
  p.content as thread_conteudo,
  u.username as thread_autor,
  (
    SELECT json_agg(
      json_build_object(
        'autor', m.author_name,
        'conteudo', m.content,
        'is_ia', m.is_ia,
        'timestamp', m.created_at
      ) ORDER BY m.created_at
    )
    FROM nfc_chat_messages m
    WHERE m.post_id = p.id
  ) as respostas
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN arenas a ON p.arena_id = a.id
WHERE a.slug = 'barriga-pochete-postura'
LIMIT 1;
```

---

## 📋 Preview das Threads Geradas

### Thread 1: "pilates mudou tudo"
**Autor:** rafaela96 (intermediario)
**Conteúdo:** "depois de anos tentando musculacao comecei pilates e em 3 meses a barriga sumiu sem emagrecer um kg. foi so ativacao de core msm"
**Respostas:** 3

### Thread 2: "barriga que nao sai mesmo emagrecendo"
**Autor:** fernanda73 (iniciante)
**Conteúdo:** "faco reeducacao alimentar ha meses, emagreci no corpo todo menos na barriga. ela fica projetada pra frente tipo pochete..."
**Respostas:** 6

### Thread 3: "lordose lombar é sempre ruim?"
**Autor:** pedro_fernandes (critico)
**Conteúdo:** "tem gente q fala q toda lordose é problema. mas nao é uma curvatura natural da coluna?..."
**Respostas:** 7

### Thread 4: "barriga so de um lado?"
**Autor:** fernando_ (iniciante)
**Conteúdo:** "gente isso é normal? minha barriga fica mais projetada de um lado. parece q meu corpo é torto..."
**Respostas:** 3

### Thread 5: "descobri q era postura nao gordura"
**Autor:** igoralmeida (iniciante)
**Conteúdo:** "passei anos fazendo dieta e treino abdominal achando q minha barriga era gordura. ai descobri q era anteversao pelvica..."
**Respostas:** 6

---

## ✅ Checklist de Inserção

- [ ] Arena criada no banco (slug: `barriga-pochete-postura`)
- [ ] Arquivo SQL copiado e executado
- [ ] Verificação: 25 ghost users criados
- [ ] Verificação: 5 threads criadas
- [ ] Verificação: 25 mensagens criadas
- [ ] Verificação: Pelo menos 1 resposta da IA
- [ ] Testar visualização no front-end

---

## 🎉 Resultado Esperado

Após inserir os dados, você terá:

✅ **Arena completamente povoada**
✅ **5 threads com títulos realistas**
✅ **25 mensagens de 25 autores diferentes**
✅ **Conteúdo 100% natural** (score médio: 96.9/100)
✅ **1-2 respostas da IA** com perguntas de follow-up
✅ **Termos específicos de postura** (anteversão pélvica, core, glúteo)
✅ **Pronto para usuários reais** interagirem

---

## 🚨 Troubleshooting

### Erro: "duplicate key value violates unique constraint"

**Solução:** Alguns dados já existem. Execute com `ON CONFLICT DO NOTHING` (já está no SQL gerado).

### Erro: "foreign key violation"

**Solução:** A arena não existe. Execute o Passo 2 primeiro (criar arena).

### Mensagens não aparecem

**Solução:** Verifique se o campo `post_id` nas mensagens está correto.

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique os logs do Supabase
2. Execute as queries de verificação acima
3. Revise os arquivos JSON/SQL gerados

---

**Status:** ✅ Dados prontos para inserção!
**Versão:** 1.0
**Data:** 03/02/2026
