# 🚀 POVOAMENTO ORGÂNICO - QUICK START

## 📝 O que é?

Sistema automático que cria threads e respostas **100% naturais e humanas** nas comunidades NutrifitCoach, usando:

- ✅ 50 ghost users (60% iniciante, 25% intermediário, 10% avançado, 5% crítico)
- ✅ Templates de perguntas/relatos/debates
- ✅ Sistema de linguagem natural (parece humano de verdade)
- ✅ IA facilitadora (intervém em 40% das threads)
- ✅ CRON automático (horários de pico: 8h, 13h, 19h)

---

## ⚡ Uso Rápido

### 1. Testar o Sistema (Dry Run)

```bash
# Não salva no banco, apenas mostra o que seria criado
DRY_RUN=true npx tsx scripts/populate-communities.ts
```

### 2. Criar Ghost Users (Primeira vez)

```bash
# Cria 50 ghost users no banco
npx tsx scripts/populate-communities.ts
```

### 3. Povoar Todas as Arenas

```bash
# Cria 1 thread em cada arena (6 arenas = 6 threads)
npx tsx scripts/populate-communities.ts
```

### 4. Povoar Arena Específica

```bash
# 1 thread
npx tsx scripts/populate-communities.ts emagrecimento-saudavel

# 5 threads
npx tsx scripts/populate-communities.ts ganho-massa-muscular 5
```

### 5. Testar Geração (Sem Banco)

```bash
# Testa geração, naturalização e validação
npx tsx scripts/test-povoamento.ts
```

---

## 🏟️ Arenas Disponíveis

- `emagrecimento-saudavel` - Perda de peso, dieta
- `ganho-massa-muscular` - Hipertrofia, proteína
- `nutricao-fitness` - Macros, jejum
- `treino-iniciantes` - Exercícios, técnica
- `saude-bem-estar` - Lesões, prevenção
- `motivacao-disciplina` - Consistência, hábitos
- `barriga-pochete-postura` - 🆕 Barriga projetada, anteversão pélvica, postura

---

## ⏰ CRON Automático (Vercel)

### Configuração (já está em vercel.json)

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

**Horários:** 08:00, 13:00, 19:00 (horários de pico)

### Testar CRON Manualmente

```bash
# GET (verificar status)
curl -H "Authorization: Bearer SEU_CRON_SECRET" \
  https://seu-dominio.com/api/cron/populate-communities

# POST (povoar todas as arenas)
curl -X POST \
  -H "Authorization: Bearer SEU_CRON_SECRET" \
  https://seu-dominio.com/api/cron/populate-communities

# POST (arena específica)
curl -X POST \
  -H "Authorization: Bearer SEU_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"arena": "emagrecimento-saudavel", "quantidade": 3}' \
  https://seu-dominio.com/api/cron/populate-communities
```

---

## 🔧 Variáveis de Ambiente

```env
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# CRON Secret (obrigatório para produção)
CRON_SECRET=seu_secret_aleatorio_seguro_123

# Dry Run (opcional, padrão: false)
DRY_RUN=false
```

---

## 📊 O que é Criado?

### Por Thread:

- 1 pergunta/relato/debate (autor: ghost user)
- 3-7 respostas de outros ghost users
- 40% de chance de resposta da IA facilitadora
- Timestamps realistas (5-45 min entre respostas)
- FP automático para todos os participantes

### Exemplo:

```
📌 Thread: "to fazendo certo?"
   Autor: joao_fit (iniciante)
   "comecei a dieta faz 2 semanas e não perdi nada ainda..."

   👤 maria_saude: "normal isso no começo. depois melhora"
   👤 carlos_treino: "tenta aumentar a proteina pra 1.6-2g por kg"
   👤 ana_fitness: "comigo tb foi assim. levou uns 3 meses"
   🤖 nutrifit_coach: "Boa pergunta! O que mais te impede de testar?"
```

---

## 📈 Estatísticas

Após executar, você verá:

```
📊 Estatísticas:
   Total threads: 6
   Total respostas: 28
   Média respostas/thread: 4.7
   Threads com IA: 2 (33.3%)
   Autores únicos: 18
```

---

## 🎯 Controles de Qualidade

Todas as threads passam por:

- ✅ **Score de naturalidade ≥ 60** (parecer humano)
- ✅ **3-7 respostas** por thread
- ✅ **≥2 autores únicos** (diversidade)
- ✅ **Timestamps cronológicos** (ordem correta)
- ✅ **Conteúdo não vazio**
- ✅ **Máx 2 respostas seguidas do mesmo usuário**

---

## 📚 Arquivos Importantes

| Arquivo | O que faz |
|---------|-----------|
| `scripts/populate-communities.ts` | Script principal |
| `scripts/test-povoamento.ts` | Testes sem banco |
| `scripts/ghost-users-database.ts` | 50 ghost users |
| `scripts/thread-templates.ts` | Templates de perguntas/respostas |
| `scripts/thread-generator.ts` | Motor de geração |
| `app/api/cron/populate-communities/route.ts` | Endpoint CRON |
| `POVOAMENTO_ORGANICO_GUIA_COMPLETO.md` | Documentação completa |

---

## 🚨 Problemas Comuns

### Ghost users não aparecem no banco

```bash
# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Rodar em dry run primeiro
DRY_RUN=true npx tsx scripts/populate-communities.ts
```

### CRON não executa

```bash
# Verificar secret
echo $CRON_SECRET

# Testar endpoint manualmente
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://seu-dominio.com/api/cron/populate-communities
```

### Score de naturalidade baixo

```typescript
// Ajustar em scripts/thread-generator.ts
const CONFIG = {
  NIVEL_NATURALIZACAO: 'forte', // Em vez de 'medio'
};
```

---

## 📖 Documentação Completa

Para detalhes completos, veja:
- **`POVOAMENTO_ORGANICO_GUIA_COMPLETO.md`** - Documentação técnica completa
- **`DICIONARIO_LINGUAGEM_HUMANA.md`** - Guia de linguagem natural
- **`LINGUAGEM_NATURAL_INTEGRACAO.md`** - Sistema de naturalização

---

## ✅ Checklist de Produção

- [ ] Criar ghost users: `npx tsx scripts/populate-communities.ts`
- [ ] Configurar `CRON_SECRET` nas variáveis de ambiente
- [ ] Testar CRON manualmente
- [ ] Deploy no Vercel com configuração de CRON
- [ ] Monitorar logs da primeira execução
- [ ] Ajustar frequência se necessário

---

## 🎉 Pronto!

Sistema **100% configurado** e pronto para criar comunidades vibrantes e orgânicas automaticamente!

**Próximo passo:** Executar o povoamento inicial:

```bash
npx tsx scripts/populate-communities.ts
```

---

**Versão:** 1.0
**Data:** 03/02/2026
**Status:** ✅ Produção Ready
