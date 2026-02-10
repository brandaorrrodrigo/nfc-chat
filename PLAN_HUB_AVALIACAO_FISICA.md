# 🔧 PLANO DE IMPLEMENTAÇÃO: HUB Avaliação Física

## DIAGNÓSTICO

**Problema atual:**
- Ao clicar em "Avaliação Física" (no menu/sidebar), abre uma arena individual
- Comportamento esperado: deve abrir uma página HUB com grid de cards das arenas relacionadas

**Causa raiz:**
- Não existe página HUB intermediária que agrupe arenas
- Links no menu apontam diretamente para `/comunidades/[arena-slug]`
- Arena model tem campo `category` mas não é usado para roteamento de hubs

---

## ARQUITETURA ESPERADA

```
[Menu] "Avaliação Física"
  ↓
/comunidades/hub/avaliacao-fisica
  ↓ (Página HUB renderiza grid)
┌─────────────┬─────────────┐
│ Avaliação   │ Postura &   │
│ Biométrica  │ Estética    │
├─────────────┼─────────────┤
│ Sinal Verm. │ Antes/Depois│
└─────────────┴─────────────┘
  ↓ (Click em card)
/comunidades/avaliacao-biometrica-assimetrias
  ↓ (Página arena individual)
[Posts, threads, IA responses]
```

---

## ARENAS QUE DEVEM SER AGRUPADAS NO HUB

```sql
-- Arenas de Avaliação Física (hub_slug = 'avaliacao-fisica')
- avaliacao-biometrica-assimetrias
- postura-estetica-real
- sinal-vermelho
- antes-depois-real
- dor-funcao-saude-postural (talvez)
- hipercifose-drenagem (talvez)

-- Arenas de Mobilidade/Flexibilidade (hub_slug = 'mobilidade-flexibilidade')
- postura-movimento
- alongamento-dinamico
- foam-roller

-- Arenas de Força (hub_slug = 'treino-forca')
- treino-gluteo
- deficit-calorico
- treino-em-casa
```

---

## IMPLEMENTAÇÃO - PASSO A PASSO

### PASSO 1: Adicionar campo `hub_slug` ao modelo Arena

**Arquivo:** `prisma/schema.prisma`

```diff
model Arena {
  id                String    @id @default(cuid())
  slug              String    @unique
  name              String
  description       String    @db.Text
  icon              String
  color             String
  category          String
+ hub_slug          String?   // Novo campo para agrupar arenas em hubs

  // ... resto dos campos
}
```

**Executar:**
```bash
npx prisma migrate dev --name add-hub-slug-to-arena
```

### PASSO 2: Atualizar arenas no banco

```sql
UPDATE "Arena" SET hub_slug = 'avaliacao-fisica'
WHERE slug IN (
  'avaliacao-biometrica-assimetrias',
  'postura-estetica-real',
  'sinal-vermelho',
  'antes-depois-real'
);

UPDATE "Arena" SET hub_slug = 'mobilidade-flexibilidade'
WHERE slug IN (
  'postura-movimento',
  'alongamento-dinamico'
);
```

### PASSO 3: Criar endpoint para buscar arenas por hub

**Arquivo novo:** `app/api/community/hub/[hub_slug]/route.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { hub_slug: string } }
) {
  try {
    const arenas = await prisma.arena.findMany({
      where: {
        hub_slug: params.hub_slug,
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        icon: true,
        color: true,
        description: true,
        totalPosts: true,
        dailyActiveUsers: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Configurar metadados do hub
    const HUB_CONFIG: Record<string, any> = {
      'avaliacao-fisica': {
        title: '👤 Hub de Avaliação Física',
        description: 'Avaliação completa: composição, postura, assimetrias, saúde postural e transformação visual',
        color: 'from-amber-600 to-orange-600',
      },
      'mobilidade-flexibilidade': {
        title: '🧘 Hub de Mobilidade & Flexibilidade',
        description: 'Melhore amplitude de movimento, evite lesões e corrija padrões posturais restritivos',
        color: 'from-teal-600 to-cyan-600',
      },
      'treino-forca': {
        title: '💪 Hub de Treino & Força',
        description: 'Ganho muscular, força máxima, progressão de carga e periodização inteligente',
        color: 'from-red-600 to-pink-600',
      },
    };

    const hubMeta = HUB_CONFIG[params.hub_slug] || {
      title: `Hub ${params.hub_slug}`,
      description: 'Comunidades relacionadas',
      color: 'from-purple-600 to-pink-600',
    };

    return NextResponse.json({
      hub: hubMeta,
      arenas: arenas.map((a) => ({
        ...a,
        postCount: a._count.posts,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar arenas do hub:', error);
    return NextResponse.json({ error: 'Failed to fetch hub arenas' }, { status: 500 });
  }
}
```

### PASSO 4: Criar página HUB

**Arquivo novo:** `app/comunidades/hub/[hub_slug]/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Users } from 'lucide-react';

interface Arena {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  totalPosts: number;
  dailyActiveUsers: number;
  postCount: number;
}

interface HubData {
  hub: {
    title: string;
    description: string;
    color: string;
  };
  arenas: Arena[];
}

export default function HubPage() {
  const params = useParams();
  const router = useRouter();
  const hubSlug = params.hub_slug as string;

  const [hubData, setHubData] = useState<HubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const response = await fetch(`/api/community/hub/${hubSlug}`);
        if (!response.ok) throw new Error('Failed to load hub');
        const data = await response.json();
        setHubData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHub();
  }, [hubSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !hubData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Hub não encontrado</h2>
          <p className="text-gray-400">{error || 'Ocorreu um erro ao carregar o hub'}</p>
        </div>
        <Link
          href="/comunidades"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Comunidades
        </Link>
      </div>
    );
  }

  const { hub, arenas } = hubData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/comunidades"
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{hub.title}</h1>
              <p className="text-sm text-gray-400">{hub.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {arenas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhuma arena neste hub ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arenas.map((arena) => (
              <Link
                key={arena.id}
                href={`/comunidades/${arena.slug}`}
                className="group relative overflow-hidden rounded-xl border border-purple-500/20 bg-slate-900/50 hover:bg-slate-900 transition-all hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${arena.color}00, ${arena.color}33)`,
                  }}
                ></div>

                <div className="relative p-6">
                  {/* Icon */}
                  <div className="text-4xl mb-4">{arena.icon}</div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {arena.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {arena.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {arena.postCount} posts
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {arena.dailyActiveUsers} pessoas
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between">
                    <span className="text-xs text-cyan-400 font-medium">Entrar na Arena</span>
                    <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### PASSO 5: Corrigir links no menu/navegação

**Encontre onde está o link "Avaliação Física"** (provavelmente em:)
- `components/layout/Header.tsx`
- `components/layout/Navbar.tsx`
- `components/comunidades/ComunidadesNav.tsx`
- Ou na própria página de comunidades

**Mude de:**
```tsx
<Link href="/comunidades/avaliacao-biometrica-assimetrias">
  Avaliação Física
</Link>
```

**Para:**
```tsx
<Link href="/comunidades/hub/avaliacao-fisica">
  Avaliação Física
</Link>
```

---

## TIMELINE DE IMPLEMENTAÇÃO

| Passo | Ação | Tempo | Dependência |
|-------|------|-------|------------|
| 1 | Atualizar schema Prisma | 5 min | - |
| 2 | Rodar migration | 2 min | Passo 1 |
| 3 | Atualizar banco (SQL) | 1 min | Passo 2 |
| 4 | Criar endpoint API | 10 min | Passo 3 |
| 5 | Criar página HUB | 20 min | Passo 4 |
| 6 | Corrigir links de navegação | 10 min | Passo 5 |
| **Total** | | **~45 min** | |

---

## VALIDAÇÃO

Após implementar, testar:

- [ ] Acessar `/comunidades/hub/avaliacao-fisica` carrega página
- [ ] Grid mostra todos os cards das arenas do hub
- [ ] Cards mostram: ícone, nome, descrição, contagem posts, usuários
- [ ] Clique em card navega para `/comunidades/[arena-slug]`
- [ ] Botão "Voltar" funciona
- [ ] Design responsivo (2 colunas desktop, 1 mobile)
- [ ] Links no menu funcionam corretamente

---

## BENEFÍCIOS

✅ UX melhorada — Usuários veem todas as arenas de uma categoria antes de escolher
✅ Descoberta — Pode ver alternativas na mesma categoria
✅ Organização — Agrupa arenas logicamente
✅ Escalabilidade — Fácil adicionar mais hubs/categorias depois
✅ Consistência — Segue padrão de navegação de outros sistemas

---

## PRÓXIMAS FASES (Futura)

1. Admin dashboard para criar/editar hubs via UI
2. Reordenar arenas dentro de um hub
3. Hub específico para "Biomecânica NFV" (agachamento, terra, supino, etc)
4. Hub para "Receitas e Nutrição"
5. Hub para "Saúde Hormonal"

