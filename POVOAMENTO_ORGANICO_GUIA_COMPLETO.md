human: # 🏗️ SISTEMA DE POVOAMENTO ORGÂNICO — GUIA COMPLETO

## Status: ✅ IMPLEMENTADO

**Data:** 03/02/2026
**Versão:** 1.0
**Projeto:** NutrifitCoach Comunidades

---

## 📋 SUMÁRIO EXECUTIVO

Sistema completo de povoamento automático de comunidades para criar conteúdo orgânico, humano e útil, simulando crescimento natural de fóruns de fitness.

### Objetivos Alcançados

✅ 50 ghost users criados (distribuição 60/25/10/5)
✅ Templates de threads e respostas naturais
✅ Integração com sistema de linguagem natural
✅ Geração automática com CRON
✅ Controles anti-spam
✅ Integração com sistema de FP
✅ IA facilitadora (40% de intervenção)

---

## 🎯 OBJETIVOS DO SISTEMA

1. **Dar "vida" inicial às arenas** - Conteúdo sempre fresco
2. **Criar histórico de perguntas/respostas** - Base de conhecimento
3. **Aumentar tempo de permanência** - Conteúdo para ler
4. **Gerar conteúdo indexável** - SEO no Google
5. **Preparar terreno para usuários reais** - Sensação de comunidade ativa

---

## 📁 ESTRUTURA DE ARQUIVOS

```
scripts/
├── ghost-users-database.ts          # 50 ghost users pré-gerados
├── thread-templates.ts              # Templates de perguntas/respostas
├── thread-generator.ts              # Motor de geração de threads
└── populate-communities.ts          # Script principal de povoamento

app/api/cron/populate-communities/
└── route.ts                         # API para CRON job

lib/ia/
└── language-naturalizer.ts          # Sistema de naturalização (integrado)

POVOAMENTO_ORGANICO_GUIA_COMPLETO.md # Esta documentação
```

---

## 👤 GHOST USERS (50 usuários)

### Distribuição por Nível

| Nível | Quantidade | % | Comportamento |
|-------|-----------|---|---------------|
| **Iniciante** | ~30 | 60% | Inseguros, erram, perguntam muito |
| **Intermediário** | ~12 | 25% | Experiência prática, opinião formada |
| **Avançado** | ~5 | 10% | Mais conscientes, menos ativos |
| **Crítico/Cético** | ~3 | 5% | Questionam, discordam, pedem evidências |

### Estrutura de Ghost User

```typescript
interface GhostUser {
  id: string;              // ghost_username
  nome: string;            // João Silva
  username: string;        // joao_fit, maria_treino
  email: string;           // joao_fit@gmail.com
  nivel: NivelUsuario;     // iniciante|intermediario|avancado|critico
  genero: 'M' | 'F';
  avatar?: string;         // URL DiceBear
  bio?: string;            // Bio realista
  peso?: number;           // 55-105kg
  altura?: number;         // 155-185cm
  objetivo?: string;       // Emagrecer, ganhar massa, etc
  experienciaTreino?: string; // Meses de treino
}
```

### Características

- ✅ Nomes brasileiros comuns
- ✅ Usernames realistas (joao_fit, carla_saude)
- ✅ Bios contextualizadas por nível
- ✅ Dados físicos realistas
- ✅ Flag `is_ghost_user: true` no banco

---

## 🗂️ TEMPLATES DE THREADS

### Tipos de Thread

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Pergunta** | Dúvida direta | "quanto de proteina preciso?" |
| **Relato** | Experiência pessoal | "nao aguento mais contar caloria" |
| **Debate** | Discussão aberta | "deficit alto vs deficit pequeno" |
| **Dúvida** | Confusão | "pode comer carboidrato a noite?" |

### Categorias de Arena

- `emagrecimento` - Perda de peso, dieta, cardio
- `hipertrofia` - Ganho de massa, proteína, treino
- `nutricao` - Macros, jejum, alimentação
- `treino` - Exercícios, técnica, lesões
- `saude` - Dor, lesões, bem-estar
- `motivacao` - Consistência, disciplina, resultados

### Exemplos de Templates

**Iniciante (Emagrecimento):**
```
Título: "to fazendo certo?"
Conteúdo: "comecei a dieta faz 2 semanas e não perdi nada ainda...
to comendo menos e caminhando todo dia mas a balança não sai do lugar.
é normal ou to fazendo algo errado?"
```

**Intermediário (Hipertrofia):**
```
Título: "treino ABC vs ABCDE"
Conteúdo: "qual vcs preferem? to no ABC mas pensei em mudar pro ABCDE
pra focar mais em cada musculo. opiniao de vcs?"
```

**Crítico (Nutrição):**
```
Título: "refeição trampa é necessaria?"
Conteúdo: "li uns artigos dizendo q refeicao trampa nao faz diferenca
nenhuma fisiologicamente. mas psicologicamente ajuda muito. opiniao?"
```

---

## 💬 TEMPLATES DE RESPOSTAS

### Tons de Resposta

| Tom | Uso | Exemplo |
|-----|-----|---------|
| **Apoio** | 60% em relatos | "cara ja passei por isso tb... é frustrante demais" |
| **Prático** | 50% em perguntas | "tenta aumentar a proteina pra 1.6-2g por kg" |
| **Técnico** | 20% geral | "deficit calorico é oq importa no final" |
| **Discordância** | 10-30% em debates | "discordo. no meu caso foi totalmente diferente" |
| **Relato** | 30% em relatos | "comigo tb foi assim. levou uns 3 meses" |

### Seleção Automática de Tom

```typescript
switch (tipoThread) {
  case 'pergunta':
    // 50% prático, 30% apoio, 20% técnico
  case 'relato':
    // 60% apoio, 30% relato, 10% discordância
  case 'debate':
    // 40% prático, 30% discordância, 30% técnico
  case 'duvida':
    // 50% prático, 30% relato, 20% apoio
}
```

---

## 🤖 INTEGRAÇÃO COM IA FACILITADORA

### Quando a IA Intervém

✅ **Apenas se:**
- Já existem pelo menos 3 mensagens humanas
- Probabilidade de 40% (4 em cada 10 threads)
- Thread tem potencial educativo

❌ **Nunca:**
- Como primeira resposta
- Duas vezes seguidas
- Em threads muito simples

### Formato da Resposta da IA

```
[Resposta curta e clara]
→ [Pergunta personalizada de follow-up]

Exemplo:
"Esse ponto que você levantou faz sentido. Muitas pessoas passam
por isso no começo. → O que mais te trava hoje: dor, falta de
tempo ou insegurança?"
```

### Templates da IA por Tipo

**Pergunta:**
- "Boa pergunta! Esse é um tema que gera muita dúvida. O que mais te impede de testar na prática?"

**Relato:**
- "Entendo sua frustração. Muita gente passa por isso no início. O que você acha que poderia ajustar primeiro?"

**Debate:**
- "Boa discussão! Ambos os lados têm seus pontos. No seu caso específico, qual se encaixa melhor na rotina?"

**Dúvida:**
- "Essa dúvida é super comum. Depende do seu objetivo principal. Qual é o seu foco agora?"

---

## 🧬 SISTEMA DE LINGUAGEM NATURAL

### Integração com Naturalizer

Todas as threads e respostas passam por:

1. **Seleção de perfil** (60% emocional, 25% prático, 10% técnico, 5% avançado)
2. **Naturalização de texto** (erros propositais, gírias, simplificação)
3. **Validação de score** (mínimo 60/100)

### Mapeamento Nível → Perfil

```typescript
iniciante      → emocional   (forte naturalização)
intermediario  → pratico     (média naturalização)
avancado       → tecnico     (leve naturalização)
critico        → avancado    (leve naturalização)
```

### Exemplos Antes/Depois

**Antes (formal):**
> "Você deve focar em proteína porque é essencial para hipertrofia muscular."

**Depois (naturalizado - iniciante):**
> "vc deve focar em proteina pq é essencial pra hipertrofia muscular"

---

## ⚙️ CONFIGURAÇÃO DO SISTEMA

### Parâmetros Principais

```typescript
const CONFIG = {
  MIN_RESPOSTAS_POR_THREAD: 3,
  MAX_RESPOSTAS_POR_THREAD: 7,
  MIN_INTERVALO_RESPOSTAS_MINUTOS: 5,
  MAX_INTERVALO_RESPOSTAS_MINUTOS: 45,
  CHANCE_IA_INTERVIR: 0.4, // 40%
  MAX_RESPOSTAS_SEGUIDAS_MESMO_USER: 2,
  THREADS_POR_ARENA_DIA: 1,
};
```

### Horários de Pico (Geração)

Threads são criadas preferencialmente em:

- **07:00 - 09:00** - Manhã
- **12:00 - 13:30** - Almoço
- **18:00 - 22:00** - Noite

---

## 🚀 COMO USAR

### 1️⃣ Criar Ghost Users (Uma vez)

```bash
npx tsx scripts/populate-communities.ts
```

Isso criará os 50 ghost users no banco com flag `is_ghost_user: true`.

### 2️⃣ Povoar Todas as Arenas (Manual)

```bash
# Povoar todas (1 thread por arena)
npx tsx scripts/populate-communities.ts

# Resultado:
# - 6 arenas × 1 thread = 6 threads
# - Cada thread com 3-7 respostas
# - IA intervém em ~40% das threads
```

### 3️⃣ Povoar Arena Específica

```bash
# Povoar apenas emagrecimento (1 thread)
npx tsx scripts/populate-communities.ts emagrecimento-saudavel

# Povoar hipertrofia (5 threads)
npx tsx scripts/populate-communities.ts ganho-massa-muscular 5
```

### 4️⃣ Modo Dry Run (Testar sem salvar)

```bash
DRY_RUN=true npx tsx scripts/populate-communities.ts
```

---

## ⏰ CRON JOB AUTOMÁTICO

### Configurar CRON (Vercel)

Adicione ao `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/populate-communities",
      "schedule": "0 8,13,19 * * *"
    }
  ]
}
```

**Schedule:** 08:00, 13:00, 19:00 (horários de pico)

### Testar Endpoint CRON

```bash
# GET (verificar status)
curl -H "Authorization: Bearer SEU_CRON_SECRET" \
  https://seu-dominio.com/api/cron/populate-communities

# POST (executar povoamento)
curl -X POST \
  -H "Authorization: Bearer SEU_CRON_SECRET" \
  -H "Content-Type: application/json" \
  https://seu-dominio.com/api/cron/populate-communities

# POST com arena específica
curl -X POST \
  -H "Authorization: Bearer SEU_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"arena": "emagrecimento-saudavel", "quantidade": 3}' \
  https://seu-dominio.com/api/cron/populate-communities
```

### Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
CRON_SECRET=seu_secret_aleatorio_seguro_123
```

---

## 🎁 INTEGRAÇÃO COM FITNESS POINTS (FP)

### Pontuação Automática

| Ação | FP Concedidos | Quando |
|------|---------------|--------|
| Criar thread | +15 FP | Autor da thread |
| Enviar mensagem | +2 FP por msg | Cada resposta |
| Mensagem longa | +3 FP extra | Se > 200 chars |

### Implementação

```typescript
// Criar thread
await supabase.rpc('add_fitness_points', {
  p_user_id: autorId,
  p_points: 15,
  p_reason: 'create_thread',
});

// Cada resposta
await supabase.rpc('add_fitness_points', {
  p_user_id: autorId,
  p_points: 2,
  p_reason: 'send_message',
});
```

---

## 🛡️ CONTROLES ANTI-SPAM

### Regras Implementadas

✅ **Máximo 1 thread por usuário/dia**
✅ **Máximo 2 respostas seguidas do mesmo usuário**
✅ **IA nunca responde duas vezes seguidas**
✅ **Intervalos realistas** (5-45 min entre respostas)
✅ **Diversidade de autores** (mínimo 2 autores únicos por thread)
✅ **Validação de naturalidade** (score ≥ 60)

### Validação Automática

Cada thread gerada é validada antes de salvar:

```typescript
validarThread(thread) {
  ✓ Score de naturalidade ≥ 60
  ✓ Quantidade de respostas (3-7)
  ✓ Diversidade de autores (≥2)
  ✓ Timestamps cronológicos
  ✓ Conteúdo não vazio
}
```

---

## 📊 ESTATÍSTICAS E MONITORAMENTO

### Estatísticas Geradas

```typescript
{
  totalThreads: 6,
  totalRespostas: 28,
  mediaRespostasPorThread: "4.7",
  distribuicaoPorTipo: {
    pergunta: 3,
    relato: 2,
    debate: 1
  },
  autoresUnicos: 18,
  threadsComIA: 2,
  percentualIA: "33.3%"
}
```

### Logs de Execução

```
[1/4] 👤 Criando Ghost Users no banco...
   ✅ joao_fit criado
   ✅ maria_saude criada
   ...

[2/4] 🏟️  Povoando arena: emagrecimento-saudavel
   Arena: Emagrecimento Saudável (uuid-xxx)
   Gerando 1 thread(s)...

   ✅ Thread criada: "to fazendo certo?"
      Autor: joao_fit
      👤 maria_saude: "normal isso no começo. depois melhora"
      👤 carlos_treino: "tenta aumentar a proteina pra 1.6-2g..."
      🤖 nutrifit_coach: "Boa pergunta! O que mais te impede..."
   ✅ 4 respostas criadas

   📊 Estatísticas:
      Total threads: 1
      Total respostas: 4
      Threads com IA: 1 (100.0%)
      Autores únicos: 4
```

---

## 🔍 ARENAS DISPONÍVEIS

| Slug | Categoria | Descrição |
|------|-----------|-----------|
| `emagrecimento-saudavel` | emagrecimento | Perda de peso, dieta, cardio |
| `ganho-massa-muscular` | hipertrofia | Ganho de massa, proteína |
| `nutricao-fitness` | nutricao | Macros, jejum, alimentação |
| `treino-iniciantes` | treino | Exercícios, técnica |
| `saude-bem-estar` | saude | Lesões, dor, prevenção |
| `motivacao-disciplina` | motivacao | Consistência, hábitos |

---

## 🧪 TESTES E VALIDAÇÃO

### Testar Geração de Thread

```typescript
import { gerarThread } from './scripts/thread-generator';

const thread = gerarThread('emagrecimento');

console.log('Título:', thread.titulo);
console.log('Autor:', thread.autor.username, `(${thread.autor.nivel})`);
console.log('Conteúdo:', thread.conteudo);
console.log('Respostas:', thread.respostas.length);
```

### Testar Geração em Lote

```typescript
import { gerarThreadsEmLote, gerarEstatisticas } from './scripts/thread-generator';

const threads = gerarThreadsEmLote('hipertrofia', 10, {
  incluirIA: true,
  dataInicio: new Date(),
});

const stats = gerarEstatisticas(threads);
console.log(stats);
```

### Testar Naturalização

```typescript
import { validarNaturalidade } from './lib/ia/language-naturalizer';

const thread = gerarThread('treino');
const validacao = validarNaturalidade(thread.conteudo);

console.log('Score:', validacao.score);
console.log('Parece humano?', validacao.pareceHumano);
console.log('Problemas:', validacao.problemas);
```

---

## 📈 MÉTRICAS DE SUCESSO

### Metas

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Threads/dia/arena** | 1-2 | Logs de execução |
| **Respostas/thread** | 3-7 | Estatísticas |
| **Score naturalidade** | ≥ 70 | Validação automática |
| **Taxa IA** | ~40% | Estatísticas |
| **Autores únicos/thread** | ≥ 3 | Validação automática |
| **Diversidade de níveis** | 60/25/10/5 | Distribuição ghost users |

### Monitoramento

```sql
-- Threads criadas por ghost users
SELECT COUNT(*)
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE u.is_ghost_user = true
AND p.created_at >= NOW() - INTERVAL '7 days';

-- Respostas por thread
SELECT AVG(respostas)
FROM (
  SELECT p.id, COUNT(m.id) as respostas
  FROM posts p
  LEFT JOIN nfc_chat_messages m ON m.post_id = p.id
  WHERE p.created_at >= NOW() - INTERVAL '7 days'
  GROUP BY p.id
) AS stats;
```

---

## 🛠️ MANUTENÇÃO E EXPANSÃO

### Adicionar Novos Templates

**Arquivo:** `scripts/thread-templates.ts`

```typescript
export const THREADS_NUTRICAO: ThreadTemplate[] = [
  // Adicionar novo template:
  {
    tipo: 'pergunta',
    categoria: 'nutricao',
    titulo: 'suplementos realmente funcionam?',
    conteudo: 'galera to em duvida se vale a pena gastar com suplementos...',
    nivelAutor: 'iniciante'
  },
];
```

### Ajustar Distribuição de Perfis

**Arquivo:** `scripts/thread-generator.ts`

```typescript
const CONFIG = {
  MIN_RESPOSTAS_POR_THREAD: 4, // Era 3
  MAX_RESPOSTAS_POR_THREAD: 10, // Era 7
  CHANCE_IA_INTERVIR: 0.5, // Era 0.4 (50% em vez de 40%)
};
```

### Criar Novos Ghost Users

```typescript
import { gerarGhostUsers } from './scripts/ghost-users-database';

// Gerar mais 20 usuários
const novosUsers = gerarGhostUsers(20);
console.log(novosUsers);
```

---

## ⚠️ AVISOS IMPORTANTES

### ✅ FAZER

- Rodar em horários de pico (8h, 13h, 19h)
- Validar naturalidade antes de salvar
- Monitorar FP concedidos
- Diversificar autores e tons
- Manter threads curtas e humanas

### ❌ NÃO FAZER

- Não criar threads muito técnicas/perfeitas
- Não fazer mesmo usuário responder 3x seguido
- Não povoar fora dos horários de pico
- Não ignorar validação de naturalidade
- Não fazer IA dominar a conversa

---

## 🎓 BOAS PRÁTICAS

### Para Threads

1. **Títulos curtos** (< 60 caracteres)
2. **Conteúdo médio** (100-300 caracteres)
3. **Erros propositais** ("to", "pq", "vc")
4. **Emoção real** (frustração, dúvida, empolgação)
5. **Opinião pessoal** ("acho que", "no meu caso")

### Para Respostas

1. **Variar tom** (apoio, prático, discordância)
2. **Intervalo realista** (5-45 min)
3. **Não repetir autores** (máx 2x seguido)
4. **Conteúdo útil** (não só "concordo")
5. **Score ≥ 60** (validação automática)

### Para IA

1. **Entrar depois de 3+ mensagens humanas**
2. **Resposta curta + pergunta follow-up**
3. **40% de chance** (não em todas)
4. **Tom natural** (não robótico/formal)
5. **Não dominar** (máx 1 resposta por thread)

---

## 📞 SUPORTE E TROUBLESHOOTING

### Problemas Comuns

**"Ghost users não aparecem no banco"**
- Verificar se `is_ghost_user` flag existe na tabela `users`
- Conferir variáveis de ambiente (SUPABASE_URL, SUPABASE_ANON_KEY)
- Rodar em modo Dry Run primeiro: `DRY_RUN=true npx tsx ...`

**"Score de naturalidade sempre baixo"**
- Aumentar nível de naturalização: `nivel: 'forte'`
- Adicionar mais gírias em `language-naturalizer.ts`
- Verificar se templates estão muito formais

**"IA respondendo muito/pouco"**
- Ajustar `CHANCE_IA_INTERVIR` (padrão: 0.4 = 40%)
- Verificar condição de mínimo 3 mensagens humanas
- Conferir logs de execução

**"CRON não executa"**
- Verificar `CRON_SECRET` em variáveis de ambiente
- Testar endpoint manualmente com curl
- Conferir logs da Vercel

---

## 🎉 CONCLUSÃO

Sistema de povoamento orgânico **100% implementado e pronto para produção**.

### Benefícios

✅ **50 ghost users** realistas e diversos
✅ **Geração automática** de threads e respostas
✅ **100% natural** com sistema de linguagem humana
✅ **Integração com IA** (40% de intervenção)
✅ **CRON automatizado** para horários de pico
✅ **Controles anti-spam** robustos
✅ **Sistema de FP** integrado
✅ **Validação automática** de qualidade

### Próximos Passos

1. **Configurar CRON** em produção (Vercel)
2. **Monitorar métricas** (threads/dia, score, FP)
3. **Expandir templates** baseado em feedback
4. **Ajustar distribuição** de perfis se necessário
5. **Adicionar novas arenas** conforme crescimento

---

**Versão:** 1.0
**Última atualização:** 03/02/2026
**Status:** ✅ Produção Ready

🚀 **Sistema pronto para criar comunidades vibrantes e orgânicas!**
