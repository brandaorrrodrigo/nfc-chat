# Juiz Biométrico NFV - Sistema de Avaliação Visual

## 📋 Visão Geral

**Juiz Biométrico NFV** é uma IA especializada em análise biométrica visual objetiva para a Arena de Avaliação Biométrica & Assimetrias do BiometricPro Hub.

### 🎯 Filosofia

Esta IA **NÃO é**:
- ❌ Coach motivacional
- ❌ Vendedor de soluções
- ❌ Dador de dicas genéricas

Esta IA **É**:
- ✅ Analista técnico corporal
- ✅ Documentador de baseline biométrico
- ✅ Comparador de evoluções temporais
- ✅ Identificador de padrões compensatórios

**Frase-chave:** "Não avaliamos intenção. Avaliamos o corpo."

---

## 🏗️ Arquitetura do Sistema

### Componentes Criados

```
📦 Juiz Biométrico NFV/
├── 📁 backend/src/modules/community/
│   ├── 📁 prompts/
│   │   └── juiz-biometrico-prompt.md       # System prompt completo (12KB)
│   └── 📁 ai/
│       └── (reservado para future expansion)
├── 📁 lib/biomechanics/
│   └── juiz-biometrico.service.ts          # Service principal (11KB)
├── 📁 app/api/biometric/
│   └── analyze/
│       └── route.ts                         # API endpoint
├── 📁 prisma/
│   └── schema.prisma                        # Models adicionados
└── JUIZ_BIOMETRICO_README.md               # Esta documentação
```

---

## 📊 Models Prisma

### BiometricBaseline

Armazena a avaliação inicial (marco zero) do usuário.

```prisma
model BiometricBaseline {
  id                String   @id @default(cuid())
  user_id           String
  analysis_text     String   @db.Text
  images_metadata   Json     // { frontal, lateral, posterior }
  protocol_context  String?  @db.Text
  comparisons       BiometricComparison[]
  created_at        DateTime @default(now())
}
```

### BiometricComparison

Armazena reavaliações comparativas com o baseline.

```prisma
model BiometricComparison {
  id                String            @id @default(cuid())
  baseline_id       String
  baseline          BiometricBaseline @relation(...)
  user_id           String
  analysis_text     String            @db.Text
  images_metadata   Json
  protocol_context  String?           @db.Text
  created_at        DateTime          @default(now())
}
```

---

## 🚀 Como Usar

### 1. Migrar Banco de Dados

```bash
# Gerar client Prisma
npx prisma generate

# Aplicar migration
npx prisma db push

# Verificar no Prisma Studio
npx prisma studio
```

### 2. Configurar Variáveis de Ambiente

Adicione ao `.env`:

```bash
# Claude API (obrigatório)
ANTHROPIC_API_KEY=sk-ant-...

# Database (já deve existir)
DATABASE_URL="postgresql://..."
```

### 3. Usar API

#### Criar Baseline (Primeira Avaliação)

```typescript
POST /api/biometric/analyze

{
  "user_id": "user123",
  "images": {
    "frontal": "data:image/jpeg;base64,...",
    "lateral": "data:image/jpeg;base64,...",
    "posterior": "data:image/jpeg;base64,..."
  },
  "current_protocol": "Treino 5x semana + dieta low carb",
  "type": "baseline"
}
```

**Resposta:**

```json
{
  "type": "baseline_created",
  "baseline_id": "clx123abc",
  "analysis": "### 📊 AVALIAÇÃO BIOMÉTRICA NFV\n\n..."
}
```

#### Criar Reavaliação (Comparação)

```typescript
POST /api/biometric/analyze

{
  "user_id": "user123",
  "baseline_id": "clx123abc",
  "images": {
    "frontal": "data:image/jpeg;base64,...",
    "lateral": "data:image/jpeg;base64,...",
    "posterior": "data:image/jpeg;base64,..."
  },
  "current_protocol": "Treino 6x semana + dieta cetogênica",
  "type": "comparison"
}
```

**Resposta:**

```json
{
  "type": "comparison_created",
  "comparison_id": "clx456def",
  "analysis": "### 🔄 REAVALIAÇÃO BIOMÉTRICA NFV\n\n..."
}
```

#### Buscar Avaliações do Usuário

```typescript
GET /api/biometric/analyze?user_id=user123&action=all

// Resposta
{
  "type": "all_evaluations",
  "evaluations": [...],
  "total": 3
}
```

#### Buscar Baseline Mais Recente

```typescript
GET /api/biometric/analyze?user_id=user123&action=latest

// Resposta
{
  "type": "latest_baseline",
  "baseline": {
    "id": "clx123abc",
    "analysis_text": "...",
    "created_at": "2026-02-05T...",
    "comparisons": [...]
  }
}
```

#### Mensagem de Boas-Vindas

```typescript
GET /api/biometric/analyze?action=welcome

// Resposta
{
  "type": "welcome",
  "message": "👁️ Bem-vindo à Arena de Avaliação Biométrica NFV..."
}
```

---

## 🔧 Service - JuizBiometricoService

### Métodos Públicos

```typescript
import { juizBiometrico } from '@/lib/biomechanics/juiz-biometrico.service';

// Criar baseline
const baseline = await juizBiometrico.analyzeBaseline({
  user_id: 'user123',
  images: { frontal, lateral, posterior },
  current_protocol: 'Treino 5x semana',
});

// Criar comparação
const comparison = await juizBiometrico.analyzeComparison({
  user_id: 'user123',
  baseline_id: 'clx123abc',
  images: { frontal, lateral, posterior },
  current_protocol: 'Treino 6x semana',
});

// Buscar baseline do usuário
const userBaseline = await juizBiometrico.getUserBaseline('user123');

// Listar todas as avaliações
const allEvaluations = await juizBiometrico.getUserEvaluations('user123');

// Mensagem de boas-vindas
const welcome = juizBiometrico.getWelcomeMessage();
```

---

## 📐 Protocolo de Análise

O Juiz Biométrico avalia **4 domínios técnicos**:

### 1️⃣ Alinhamento Global
- Plano Sagital (Lateral)
  - Anteriorização cranial
  - Cifose torácica
  - Lordose lombar
  - Linha de gravidade

- Plano Frontal (Frente/Costas)
  - Nivelamento de ombros
  - Nivelamento de cristas ilíacas
  - Escoliose aparente
  - Linha média corporal

### 2️⃣ Complexo Pelve & Core
- Posição Pélvica
  - Anteversão/Retroversão
  - Relação pelve-lombar

- Projeção Abdominal
  - Tipo de projeção
  - Diástase abdominal
  - Linha alba

- Assimetrias Pélvicas
  - Rotação pélvica
  - Inclinação lateral

### 3️⃣ Membros Inferiores
- Alinhamento de Joelhos
  - Valgo/Varo
  - Hiperextensão

- Rotação Femoral
- Assimetrias
- Aspectos Circulatórios/Estruturais

### 4️⃣ Estética Funcional
- Relação Postura-Estética
- "Barriga pochete" postural
- Projeção glútea
- Proporção tronco-MMII
- Impacto funcional

---

## 📋 Formato de Resposta

### Baseline

```markdown
### 📊 AVALIAÇÃO BIOMÉTRICA NFV

**🔍 VISÃO GERAL**
- Padrão postural predominante: [...]
- Simetria global: [...]
- Compensações detectadas: [...]

**🎯 PRINCIPAIS ACHADOS TÉCNICOS**
1. [Achado técnico com localização, grau e implicação]
2. [...]

**⚙️ IMPACTO FUNCIONAL**
- No Movimento: [...]
- Na Estética: [...]
- No Potencial: [...]

**📌 REGISTRO BASELINE NFV**
- Data: [...]
- ID Registro: [...]
- Padrão documentado: [...]

**🔄 PRÓXIMOS PASSOS**
- Reavaliação recomendada: 30-45 dias
- Mesmas condições: Horário, roupa, ângulos

**❓ PERGUNTA DE CONTINUIDADE**
→ Você está seguindo algum protocolo atualmente?
```

### Comparação

```markdown
### 🔄 REAVALIAÇÃO BIOMÉTRICA NFV

**📅 Comparação Temporal**
- Baseline: [data]
- Reavaliação: [data]
- Intervalo: [X dias]

**📊 ANÁLISE COMPARATIVA**
1. [Achado original]
   - Status: [MELHOROU | MANTEVE | PIOROU]
   - Evidência: [...]
   - Magnitude: [...]

**🎯 NOVOS ACHADOS**
[Padrões que não existiam no baseline]

**📈 SÍNTESE DA EVOLUÇÃO**
- Aspectos que melhoraram: [X de Y]
- Aspectos que pioraram: [X de Y]
- Aspectos estagnados: [X de Y]

**⚖️ VEREDICTO TÉCNICO**
Este padrão corporal está:
- [ ] Evoluindo positivamente
- [ ] Estagnado
- [ ] Regredindo

**🔮 PROJEÇÃO**
Sem ajuste metodológico, este padrão tende a [...]
```

---

## 🎯 Características Principais

### ✅ O Que a IA FAZ

- ✅ Analisa padrões posturais objetivamente
- ✅ Documenta assimetrias com critérios técnicos
- ✅ Compara evoluções temporais sem suavizar
- ✅ Aponta melhoras E pioras com clareza
- ✅ Usa linguagem técnica explicada

### ❌ O Que a IA NÃO FAZ

- ❌ NÃO faz diagnóstico médico
- ❌ NÃO promete resultados
- ❌ NÃO vende produtos/serviços
- ❌ NÃO motiva genericamente
- ❌ NÃO suaviza verdades técnicas

---

## 🔒 Limitações Éticas

O Juiz Biométrico tem limitações claras e transparentes:

### Caso: Usuário pede diagnóstico médico

```
⚠️ Limitação Técnica

Minha análise é biométrica visual, não diagnóstica.

Eu posso:
- Identificar padrões posturais
- Documentar assimetrias
- Comparar evoluções visuais

Eu NÃO posso:
- Diagnosticar doenças
- Identificar lesões internas
- Substituir avaliação médica
```

### Caso: Usuário pede treino/dieta

```
📋 Fora do Escopo

Minha função é avaliar padrões corporais, não prescrever protocolos.

Esta arena é de AVALIAÇÃO, não de prescrição.
```

### Caso: Usuário insiste em venda

```
🔒 Princípio da Arena

Esta é uma zona de avaliação técnica neutra.

Não vendo, não indico, não pressiono.

A lógica dos dados faz o trabalho.
```

---

## 📊 Métricas de Sucesso

A IA está funcionando bem quando:

✅ Usuário entende padrão corporal com clareza
✅ Usuário solicita reavaliação futura (engajamento)
✅ Usuário compartilha baseline com outros (viralização)
✅ Usuário reconhece piora/estagnação SEM defensividade
✅ Conversão para app ocorre por lógica, não por pressão

---

## 🧪 Exemplo de Uso Completo

### Passo 1: Primeiro Usuário Entra na Arena

```typescript
// Frontend
const welcome = await fetch('/api/biometric/analyze?action=welcome');
const data = await welcome.json();

console.log(data.message);
// "👁️ Bem-vindo à Arena de Avaliação Biométrica NFV..."
```

### Passo 2: Usuário Envia 3 Fotos (Baseline)

```typescript
const formData = {
  user_id: 'user123',
  images: {
    frontal: base64Front,
    lateral: base64Side,
    posterior: base64Back,
  },
  current_protocol: 'Treino 5x semana + dieta mediterrânea',
  type: 'baseline',
};

const response = await fetch('/api/biometric/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

const result = await response.json();
console.log(result.baseline_id); // "clx123abc"
console.log(result.analysis); // Análise completa formatada
```

### Passo 3: 45 Dias Depois - Reavaliação

```typescript
const formData = {
  user_id: 'user123',
  baseline_id: 'clx123abc', // Referência ao baseline
  images: {
    frontal: newBase64Front,
    lateral: newBase64Side,
    posterior: newBase64Back,
  },
  current_protocol: 'Treino 6x semana + dieta cetogênica',
  type: 'comparison',
};

const response = await fetch('/api/biometric/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

const result = await response.json();
console.log(result.comparison_id); // "clx456def"
console.log(result.analysis); // Comparação objetiva: melhorou/piorou/manteve
```

---

## 🔧 Troubleshooting

### Erro: "Prompt file not found"

**Causa:** Arquivo `juiz-biometrico-prompt.md` não encontrado

**Solução:**
```bash
# Verifique se o arquivo existe
ls backend/src/modules/community/prompts/juiz-biometrico-prompt.md

# Se não existir, crie o diretório
mkdir -p backend/src/modules/community/prompts
```

### Erro: "Table biometric_baselines does not exist"

**Causa:** Migration não foi aplicada

**Solução:**
```bash
npx prisma generate
npx prisma db push
```

### Erro: "ANTHROPIC_API_KEY not found"

**Causa:** Chave da API Claude não configurada

**Solução:**
```bash
# Adicione ao .env
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env
```

### Erro: "Invalid image format"

**Causa:** Imagem não está em base64 ou URL válida

**Solução:**
```typescript
// Converter File para base64
const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
```

---

## 📚 Referências

### Arquivos do Sistema

- **System Prompt:** `backend/src/modules/community/prompts/juiz-biometrico-prompt.md`
- **Service:** `lib/biomechanics/juiz-biometrico.service.ts`
- **API Endpoint:** `app/api/biometric/analyze/route.ts`
- **Prisma Schema:** `prisma/schema.prisma`

### Integrações

- **Claude Vision API:** `claude-sonnet-4-20250514`
- **Prisma ORM:** PostgreSQL
- **Next.js API Routes:** App Router

---

## 🎯 Próximos Passos

### Implementações Futuras

1. **Frontend React**
   - [ ] Componente de upload de 3 fotos
   - [ ] Visualização da análise formatada
   - [ ] Histórico de comparações
   - [ ] Dashboard de evolução

2. **Melhorias na Análise**
   - [ ] Detecção automática de qualidade de imagem
   - [ ] Validação de pose (corpo inteiro visível)
   - [ ] Sugestão de ângulos melhores
   - [ ] Overlay visual de landmarks

3. **Gamificação**
   - [ ] Badges por consistência (reavaliações regulares)
   - [ ] Pontos FP por compartilhamento
   - [ ] Ranking de melhoras técnicas

4. **Exportação**
   - [ ] PDF da avaliação
   - [ ] Gráficos de evolução temporal
   - [ ] Comparação visual lado-a-lado

---

**Sistema implementado com sucesso! 🎉**

_Documentação criada em: 2026-02-05_
