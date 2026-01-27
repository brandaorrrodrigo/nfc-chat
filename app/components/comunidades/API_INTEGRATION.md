# Documentação: Integração com API Real

## Visão Geral

Este documento descreve como conectar os componentes de comunidades do NutriFit Coach
com uma API real em produção. Atualmente, todos os dados são mockados (hardcoded).

---

## Componentes e Pontos de Integração

### 1. GlobalStatsHeader.tsx

**Localização:** `app/components/comunidades/GlobalStatsHeader.tsx`

**Dados Mock:**
```typescript
const STATS_MOCK: GlobalStats = {
  totalUsuarios: 12847,
  ativos24h: 1423,
  mensagensHoje: 847,
  intervencoesIA: 156,
  ultimaAtualizacao: new Date(),
};
```

**API Endpoint Sugerido:**
```
GET /api/comunidades/stats/global
```

**Response Esperada:**
```json
{
  "totalUsuarios": 12847,
  "ativos24h": 1423,
  "mensagensHoje": 847,
  "intervencoesIA": 156,
  "ultimaAtualizacao": "2025-01-25T14:30:00Z"
}
```

**Onde Modificar:**
Substituir `fetchStats()` por chamada real usando `fetch` ou `useSWR`:
```typescript
const fetchStats = useCallback(async () => {
  const res = await fetch('/api/comunidades/stats/global');
  const data = await res.json();
  setStats(data);
}, []);
```

---

### 2. LiveActivityTicker.tsx

**Localização:** `app/components/comunidades/LiveActivityTicker.tsx`

**Dados Mock:**
```typescript
const EVENTOS_MOCK: AtividadeEvento[] = [...]
```

**API Endpoint Sugerido:**
```
GET /api/comunidades/activity?limit=20
GET /api/comunidades/[slug]/activity?limit=20  // Para comunidade específica
```

**Response Esperada:**
```json
{
  "eventos": [
    {
      "id": "1",
      "tipo": "usuario_entrou",
      "mensagem": "Maria Silva entrou na arena Lipedema",
      "comunidade": "lipedema",
      "timestamp": "2025-01-25T14:30:00Z",
      "usuario": "Maria Silva"
    }
  ]
}
```

**WebSocket (Recomendado):**
Para atualizações em tempo real, usar WebSocket:
```typescript
useEffect(() => {
  const ws = new WebSocket('wss://api.nutrifitcoach.com.br/ws/activity');
  ws.onmessage = (event) => {
    const novoEvento = JSON.parse(event.data);
    setEventos(prev => [novoEvento, ...prev].slice(0, maxItems));
  };
  return () => ws.close();
}, []);
```

---

### 3. CommunityStatsCard.tsx

**Localização:** `app/components/comunidades/CommunityStatsCard.tsx`

**Dados Mock:**
```typescript
const COMMUNITY_STATS_MOCK: Record<string, CommunityStats> = {
  lipedema: { membrosInscritos: 1247, ... },
  peptideos: { membrosInscritos: 856, ... },
};
```

**API Endpoint Sugerido:**
```
GET /api/comunidades/[slug]/stats
```

**Response Esperada:**
```json
{
  "membrosInscritos": 1247,
  "usuariosAtivos": 47,
  "topicosAbertos": 24,
  "ultimaAtividade": "2025-01-25T14:28:00Z"
}
```

---

### 4. UserProfileModal.tsx

**Localização:** `app/components/comunidades/UserProfileModal.tsx`

**Dados Mock:**
```typescript
export const USUARIOS_MOCK: Record<string, UserProfile> = {...}
```

**API Endpoint Sugerido:**
```
GET /api/usuarios/[id]/profile
```

**Response Esperada:**
```json
{
  "id": "maria-silva",
  "nome": "Maria Silva",
  "avatar": "https://...",
  "is_premium": true,
  "comunidades": ["Protocolo Lipedema", "Nutrição Funcional"],
  "stats": {
    "topicos_criados": 12,
    "respostas": 87,
    "tempo_no_sistema": "4 meses",
    "membro_desde": "Set 2024"
  }
}
```

---

### 5. LoginModal.tsx

**Localização:** `app/components/comunidades/LoginModal.tsx`

**Integração com Auth:**
Substituir o `handleSubmit` simulado por:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const { token } = await res.json();
    // Salvar token (localStorage/cookie)
    // Atualizar estado de autenticação
    onClose();
  } else {
    // Tratar erro
  }

  setIsLoading(false);
};
```

**OAuth:**
Para login social, integrar com NextAuth.js ou similar:
```typescript
import { signIn } from 'next-auth/react';

const handleSocialLogin = (provider: string) => {
  signIn(provider.toLowerCase());
};
```

---

### 6. Páginas Principais

#### /comunidades/page.tsx

**Dados Mock:**
```typescript
const COMMUNITIES = [...]
```

**API Endpoint:**
```
GET /api/comunidades
```

#### /comunidades/[slug]/page.tsx

**Dados Mock:**
```typescript
const COMUNIDADES_DATA: Record<string, ComunidadeData> = {...}
const TOPICOS_LIPEDEMA: Topico[] = [...]
```

**API Endpoints:**
```
GET /api/comunidades/[slug]
GET /api/comunidades/[slug]/topicos
GET /api/comunidades/[slug]/ia-intervencoes
```

#### /comunidades/[slug]/admin/page.tsx

**Dados Mock:**
```typescript
const COMUNIDADES_ADMIN: Record<string, ComunidadeAdminData> = {...}
```

**API Endpoints:**
```
GET /api/admin/comunidades/[slug]
POST /api/admin/comunidades/[slug]/topicos
PUT /api/admin/comunidades/[slug]/topicos/[id]
DELETE /api/admin/comunidades/[slug]/topicos/[id]
PUT /api/admin/comunidades/[slug]/config-ia
```

---

## Padrão de Substituição

Para substituir dados mock por API real:

1. **Criar hooks customizados:**
```typescript
// hooks/useComunidade.ts
export function useComunidade(slug: string) {
  return useSWR(`/api/comunidades/${slug}`, fetcher);
}
```

2. **Substituir estado inicial:**
```typescript
// Antes
const [comunidade, setComunidade] = useState<ComunidadeData | null>(null);
useEffect(() => {
  const data = COMUNIDADES_DATA[slug];
  setComunidade(data);
}, [slug]);

// Depois
const { data: comunidade, error, isLoading } = useComunidade(slug);
```

3. **Adicionar tratamento de loading/error:**
```typescript
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage />;
```

---

## Estrutura de API Sugerida

```
/api
├── /auth
│   ├── login
│   ├── logout
│   └── register
├── /comunidades
│   ├── / (GET: listar todas)
│   ├── /stats/global (GET: stats globais)
│   ├── /activity (GET: eventos recentes)
│   └── /[slug]
│       ├── / (GET: dados da comunidade)
│       ├── /stats (GET: stats da comunidade)
│       ├── /topicos (GET/POST)
│       ├── /activity (GET: eventos da comunidade)
│       └── /ia-intervencoes (GET)
├── /usuarios
│   └── /[id]/profile (GET)
└── /admin
    └── /comunidades/[slug]
        ├── / (GET: dados admin)
        ├── /topicos (CRUD)
        └── /config-ia (PUT)
```

---

## WebSocket para Tempo Real

Para funcionalidades em tempo real (LiveActivityTicker, contadores):

```typescript
// lib/websocket.ts
let socket: WebSocket | null = null;

export function connectWebSocket(comunidadeSlug?: string) {
  const url = comunidadeSlug
    ? `wss://api.nutrifitcoach.com.br/ws/comunidade/${comunidadeSlug}`
    : `wss://api.nutrifitcoach.com.br/ws/global`;

  socket = new WebSocket(url);
  return socket;
}

// Eventos esperados:
// - user_joined: usuário entrou
// - new_topic: novo tópico criado
// - new_reply: nova resposta
// - ia_intervention: IA gerou intervenção
// - stats_update: atualização de estatísticas
```

---

## Notas Importantes

1. **Autenticação:** Implementar middleware para verificar token em rotas protegidas
2. **Rate Limiting:** Aplicar rate limiting nas APIs públicas
3. **Cache:** Usar cache (Redis) para dados frequentemente acessados
4. **SEO:** Manter Server Components para páginas públicas (SEO)
5. **Otimização:** Usar ISR (Incremental Static Regeneration) onde apropriado

---

## Checklist de Migração

- [ ] Criar endpoints de API
- [ ] Implementar autenticação (NextAuth.js)
- [ ] Substituir DADOS_MOCK por chamadas API
- [ ] Implementar WebSocket para tempo real
- [ ] Adicionar tratamento de erros
- [ ] Implementar loading states
- [ ] Testar em produção
- [ ] Monitorar performance

---

*Documentação gerada em: Janeiro 2025*
*NutriFit Coach - Sistema de Comunidades v1.0*
