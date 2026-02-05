# Sistema de Arenas de Avaliação Biométrica por Visão Computacional

## 📋 Visão Geral

Sistema completo de 3 arenas temáticas focadas em discussões sobre avaliação biométrica, postura e biomecânica, com IA moderadora/facilitadora especializada.

### 🎯 Arenas Implementadas

1. **Postura & Estética Real** (`postura-estetica`)
   - Foco: Estética corporal sob ótica da postura e biomecânica
   - Ícone: 🏃‍♀️
   - Cor: #8B5CF6 (roxo)

2. **Avaliação Biométrica & Assimetrias** (`avaliacao-assimetrias`)
   - Foco: Leitura corporal, assimetrias e análise biométrica por IA
   - Ícone: 📐
   - Cor: #06B6D4 (ciano)

3. **Dor, Função & Saúde Postural** (`dor-funcao-saude`)
   - Foco: Dor, desconforto e função relacionados à postura
   - Ícone: ⚕️
   - Cor: #F59E0B (âmbar)

Cada arena possui **3 threads iniciais** pré-populadas com perguntas reais de usuários e respostas detalhadas da IA especialista.

---

## 📁 Estrutura de Arquivos

```
📦 nfc-comunidades/
├── 📁 data/
│   └── arenas-biometria-seed.json       # Dados das 3 arenas
├── 📁 scripts/
│   └── seed-arenas-biometria.ts         # Script de seed
├── 📁 lib/biomechanics/
│   └── arenas-prompts.ts                # Prompts específicos da IA
├── package.json                          # Script adicionado
└── ARENAS_BIOMETRIA_README.md           # Esta documentação
```

---

## 🚀 Como Usar

### 1. Verificar Configuração do Banco

Certifique-se de que o arquivo `.env` possui a variável `DATABASE_URL` configurada:

```bash
DATABASE_URL="postgresql://..."
```

### 2. Executar o Seed

```bash
npm run seed:arenas-biometria
```

Ou diretamente:

```bash
npx tsx scripts/seed-arenas-biometria.ts
```

### 3. Verificar Resultados

Abra o Prisma Studio para visualizar as arenas criadas:

```bash
npx prisma studio
```

Navegue até as tabelas:
- `Arena` - 3 novas arenas
- `Post` - 9 posts (threads iniciais)
- `Comment` - 9 comments (respostas da IA)
- `AIMetadata` - Metadados das respostas

---

## 📊 Estatísticas Esperadas

Após o seed bem-sucedido:

- ✅ **3 arenas** criadas/atualizadas
- ✅ **9 threads** (posts) criadas (3 por arena)
- ✅ **9 respostas da IA** criadas
- ✅ Todas as threads marcadas como `isPinned: true`
- ✅ Todas as respostas marcadas como `isAIResponse: true`

---

## 🤖 Sistema de IA Moderadora

### Personas por Arena

Cada arena tem uma especialista IA com personalidade e expertise específicas:

#### 1. Ana - Postura & Estética
- **Tom:** Acolhedor, técnico mas acessível, validador
- **Expertise:** Avaliação biométrica, análise postural, estética funcional
- **Foco:** Conectar percepções estéticas com padrões posturais

#### 2. Carlos - Avaliação Biométrica
- **Tom:** Técnico mas didático, tranquilizador, científico
- **Expertise:** Visão computacional, análise de assimetrias, biomecânica
- **Foco:** Diferenciar variações normais de padrões funcionais relevantes

#### 3. Mariana - Saúde Postural
- **Tom:** Acolhedor, validador, técnico mas empático
- **Expertise:** Biomecânica clínica, análise de dor, função e movimento
- **Foco:** Conectar dor/desconforto com padrões posturais

### Características das Respostas

Todas as respostas da IA seguem o padrão:

1. ✅ **Validação** da experiência do usuário
2. ✅ **Explicação técnica** em linguagem acessível
3. ✅ **Conexão** com análise biométrica por IA
4. ✅ **Testes simples** de auto-observação
5. ✅ **Pergunta aberta** personalizada no final

---

## 🔧 Integração com Sistema Existente

### Reutilização de Infraestrutura

O sistema foi implementado **reutilizando 100%** da infraestrutura existente:

✅ **Schema Prisma** - Models Arena, Post, Comment já existiam
✅ **Sistema de IA** - Usa `lib/ai/claude.ts` existente
✅ **Moderador** - Integra com `lib/ia/moderator.ts`
✅ **Padrão de Seed** - Segue `scripts/seed-nfv-arenas.ts`

### Configuração das Arenas

Todas as arenas foram configuradas com:

```typescript
{
  arenaType: 'NFV_HUB',           // Hub de discussão aberta
  categoria: 'BIOMECANICA_NFV',   // Categoria biomecânica
  aiPersona: 'BIOMECHANICS_EXPERT', // Persona especializada
  aiInterventionRate: 60,         // 60% de taxa de intervenção
  aiFrustrationThreshold: 120,    // 120 min sem atividade
  aiCooldown: 5,                  // 5 min entre respostas
}
```

---

## 📝 Estrutura de Dados

### Arena JSON (exemplo)

```json
{
  "slug": "postura-estetica",
  "name": "Postura & Estética Real",
  "description": "...",
  "icon": "🏃‍♀️",
  "color": "#8B5CF6",
  "category": "biomecanica",
  "aiPersona": "BIOMECHANICS_EXPERT",
  "aiPrompt": "Você é uma especialista em...",
  "aiOpenQuestions": [...],
  "threads": [...]
}
```

### Thread (Post + Comment)

Cada thread é composta de:

1. **Post** (pergunta do usuário)
   - `userId: 'system-biometria'`
   - `isPinned: true`
   - `isOfficial: true`

2. **Comment** (resposta da IA)
   - `userId: 'ai-biomechanics'`
   - `isAIResponse: true`
   - `isApproved: true`

3. **AIMetadata** (metadados)
   - `confidenceScore: 0.85`
   - `wasApproved: true`

---

## 🎨 Customização

### Adicionar Nova Arena

1. Edite `data/arenas-biometria-seed.json`
2. Adicione nova entrada no array `arenas`
3. Configure threads iniciais
4. Execute o seed novamente

### Modificar Prompts

Edite `lib/biomechanics/arenas-prompts.ts`:

```typescript
export const ARENA_PROMPTS = {
  'nova-arena': {
    systemPrompt: '...',
    openQuestions: [...],
    examples: [...],
    persona: { ... }
  }
}
```

---

## 🧪 Testes

### Verificação Manual

1. **Prisma Studio**
   ```bash
   npx prisma studio
   ```

2. **Consulta SQL**
   ```sql
   SELECT slug, name, totalPosts, totalComments
   FROM Arena
   WHERE categoria = 'BIOMECANICA_NFV';
   ```

3. **Frontend** (se disponível)
   - Acesse `/comunidades/postura-estetica`
   - Verifique threads fixadas
   - Teste sistema de comentários

---

## ⚠️ Troubleshooting

### Erro: "Can't reach database server"

**Causa:** Banco de dados não acessível ou `.env` não configurado

**Solução:**
```bash
# Verifique se DATABASE_URL está configurada
cat .env | grep DATABASE_URL

# Teste conexão
npx prisma db pull
```

### Erro: "Unknown file extension .ts"

**Causa:** ts-node com problemas de ESM

**Solução:** Use `npx tsx` ao invés de `ts-node`
```bash
npx tsx scripts/seed-arenas-biometria.ts
```

### Seed Executa Mas Não Cria Dados

**Causa:** Já existem arenas com mesmo slug

**Solução:** O script usa `upsert()` - os dados serão atualizados, não duplicados

---

## 📚 Referências

### Arquivos Relacionados

- `prisma/schema.prisma` - Schema completo
- `lib/ai/claude.ts` - Integração Claude
- `lib/ia/moderator.ts` - Moderador principal
- `lib/biomechanics/nfv-config.ts` - Config NFV
- `scripts/seed-nfv-arenas.ts` - Padrão de referência

### Documentação Externa

- [Prisma Seeding](https://www.prisma.io/docs/guides/database/seed-database)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Claude API](https://docs.anthropic.com/claude/reference)

---

## 🎯 Próximos Passos

### Implementações Futuras

1. **Interface Frontend**
   - Componentes React para exibir arenas
   - Sistema de comentários em tempo real
   - Badges e gamificação

2. **Sistema de Moderação**
   - Adaptar `lib/ia/moderator.ts` para reconhecer arenas automaticamente
   - Integrar prompts específicos nas respostas
   - Sistema de follow-up inteligente

3. **Análise de Vídeo**
   - Upload de vídeos nas arenas
   - Análise biométrica automática por IA
   - Geração de relatórios visuais

4. **Métricas e Analytics**
   - Dashboard de engajamento por arena
   - Taxa de resposta da IA
   - Tópicos mais discutidos

---

## ✅ Checklist de Verificação

Após executar o seed, verifique:

- [ ] 3 arenas criadas em `Arena` table
- [ ] 9 posts criados em `Post` table
- [ ] 9 comments criados em `Comment` table
- [ ] Todos os posts têm `isPinned: true`
- [ ] Todos os comments têm `isAIResponse: true`
- [ ] AIMetadata criado para cada post
- [ ] Métricas da arena atualizadas (`totalPosts`, `totalComments`)
- [ ] Prompts acessíveis via `getArenaPrompt(slug)`

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique logs do seed: `npm run seed:arenas-biometria`
2. Consulte Prisma Studio: `npx prisma studio`
3. Revise a documentação acima
4. Verifique o código-fonte comentado

---

**Sistema implementado com sucesso! 🎉**

_Documentação criada em: 2026-02-05_
