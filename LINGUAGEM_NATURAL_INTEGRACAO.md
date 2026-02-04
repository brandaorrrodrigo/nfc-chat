# 🗣️ SISTEMA DE LINGUAGEM NATURAL - INTEGRAÇÃO COMPLETA

## Status: ✅ IMPLEMENTADO

**Data:** 03/02/2026
**Versão:** 2.0
**Autor:** Sistema NutrifitCoach Comunidades

---

## 📋 RESUMO EXECUTIVO

Sistema completo de naturalização de linguagem para fazer posts e respostas da IA parecerem **genuinamente humanos**, não gerados por IA ou marketing.

### Objetivo
Simular escrita humana real em fóruns de treino, saúde e biomecânica, seguindo a regra de ouro:

> **"Se parecer bonito demais, está errado.
> Se parecer bagunçado, mas compreensível, está certo."**

---

## 🎯 O QUE FOI IMPLEMENTADO

### 1️⃣ Sistema de Naturalização (`lib/ia/language-naturalizer.ts`)

**Funcionalidades:**
- ✅ Naturalização automática de texto formal → informal
- ✅ Validação de score de naturalidade (0-100)
- ✅ 4 perfis de usuário (emocional, prático, técnico, avançado)
- ✅ Distribuição automática: 60/25/10/5
- ✅ Erros ortográficos propositais
- ✅ Gírias contextuais de treino/musculação
- ✅ Quebra de frases longas
- ✅ Simplificação de pontuação

**Principais Funções:**

```typescript
// Naturalizar texto
naturalizarTexto(texto, options)

// Validar naturalidade
validarNaturalidade(texto) // Retorna score 0-100

// Naturalizar + validar automaticamente
naturalizarEValidar(texto, perfil?)

// Obter perfil aleatório seguindo distribuição
selecionarPerfilAleatorio() // 60% emocional, 25% prático...

// Variar resposta de um array
variarResposta(respostas[])
```

---

### 2️⃣ Integração no Motor de Decisão (`lib/ia/decision-engine.ts`)

**O que mudou:**
- ✅ Import do sistema de naturalização
- ✅ Aplicação automática após gerar resposta
- ✅ Validação em modo development
- ✅ Logs de warning se score < 60

**Código adicionado:**

```typescript
// PASSO 6.5: NATURALIZAR TEXTO
const perfilSelecionado = selecionarPerfilAleatorio();
const opcoesNaturalizacao = obterPerfilNaturalizacao(perfilSelecionado);
const respostaFinal = naturalizarTexto(respostaComFollowUp, opcoesNaturalizacao);

// Validar em dev
if (process.env.NODE_ENV === 'development') {
  const validacao = validarNaturalidade(respostaFinal);
  if (!validacao.pareceHumano) {
    console.warn('[IA] Score baixo:', validacao.score);
  }
}
```

---

### 3️⃣ Referência no Config da IA (`app/comunidades/config/ia-facilitadora.ts`)

**Documentação adicionada:**

```typescript
/**
 * LINGUAGEM NATURAL (v2.0):
 * - Todas as respostas passam por naturalização automática
 * - Sistema baseado em: DICIONARIO_LINGUAGEM_HUMANA.md
 * - Distribuição: 60% emocional, 25% prático, 10% técnico, 5% avançado
 * - Validação automática (score mínimo: 60/100)
 * - Regra de ouro: "Se parecer bonito demais, está errado"
 *
 * @see DICIONARIO_LINGUAGEM_HUMANA.md
 * @see lib/ia/language-naturalizer.ts
 */
```

---

## 📚 ARQUIVOS CRIADOS/MODIFICADOS

### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `DICIONARIO_LINGUAGEM_HUMANA.md` | Dicionário de referência com gírias, padrões, limites |
| `lib/ia/language-naturalizer.ts` | Sistema completo de naturalização e validação |
| `lib/ia/language-naturalizer.test.ts` | Testes e exemplos de uso |
| `LINGUAGEM_NATURAL_INTEGRACAO.md` | Esta documentação |

### Arquivos Modificados

| Arquivo | Mudanças |
|---------|----------|
| `lib/ia/decision-engine.ts` | + Import naturalização<br>+ Aplicação automática no PASSO 6.5<br>+ Validação em dev |
| `app/comunidades/config/ia-facilitadora.ts` | + Documentação do sistema<br>+ Referências aos arquivos |

---

## 🎨 PADRÕES DE LINGUAGEM

### Gírias Comuns

**Treino:**
- pump, shape, travado, pesado demais
- queimou tudo, senti pegar, pegou errado
- roubando no movimento, forçando a lombar

**Dor:**
- lombar gritando, ombro reclamando
- joelho esquisito, sensação ruim
- dor chata, fisgada

**Opinião:**
- acho que, pra mim foi assim, no meu caso
- posso estar errado, comigo funcionou
- fiquei com medo, fiquei na dúvida

### Erros Propositais

```
muito → muiito
também → tb
porque → pq
você → vc
quando → qdo
não → nao
alguém → alguem
```

### Inicios Naturais

- "Cara, comigo foi assim…"
- "No meu caso…"
- "Já passei por isso"
- "Eu achava que era frescura, mas…"
- "Não sou especialista, mas…"

---

## 🎯 DISTRIBUIÇÃO DE PERFIS

### Proporção Ideal (por thread)

| Perfil | % | Características |
|--------|---|-----------------|
| **Emocional** | 60% | Nível forte, muitos erros, gírias, opiniões pessoais |
| **Prático** | 25% | Nível médio, alguns erros, experiência prática |
| **Técnico** | 10% | Nível leve, poucos erros, termos técnicos moderados |
| **Avançado** | 5% | Nível leve, sem erros, linguagem mais consciente |

### Como é Selecionado

```typescript
const random = Math.random();
if (random < 0.60) return 'emocional';  // 60%
if (random < 0.85) return 'pratico';    // 25%
if (random < 0.95) return 'tecnico';    // 10%
return 'avancado';                       // 5%
```

---

## ✅ VALIDAÇÃO DE NATURALIDADE

### Score (0-100)

- **0-59**: ❌ Não parece humano
- **60-79**: ✅ Passa (aceitável)
- **80-100**: ✅✅ Excelente

### O que é Validado

| Critério | Penalidade | Descrição |
|----------|------------|-----------|
| Texto muito longo | -20 | > 500 caracteres |
| Pontuação perfeita | -15 | Todas as frases com ponto final |
| Sem gírias | -15 | Nenhuma expressão informal |
| Muito técnico | -10 | 3+ termos técnicos |
| Sem erros | -10 | Zero erros propositais |
| Muitos emojis | -5 | Mais de 1 emoji |
| Frases marketing | -10 | Muitas frases curtas |
| Sem opinião pessoal | -10 | Sem "acho", "pra mim", etc |

### Exemplo de Validação

```typescript
const validacao = validarNaturalidade(texto);

console.log(validacao.score);         // 75
console.log(validacao.pareceHumano);  // true
console.log(validacao.problemas);     // ['Sem gírias']
console.log(validacao.sugestoes);     // ['Adicione "acho que"...']
```

---

## 🔧 COMO USAR

### Uso Básico

```typescript
import { naturalizarEValidar } from '@/lib/ia/language-naturalizer';

// Texto da IA (formal)
const respostaIA = 'Você deve focar em proteína porque é essencial.';

// Naturalizar automaticamente
const { textoNaturalizado, validacao, perfil } = naturalizarEValidar(respostaIA);

console.log(textoNaturalizado);
// "vc deve focar em proteina pq é essencial"

console.log(validacao.pareceHumano); // true/false
console.log(perfil); // 'emocional' | 'pratico' | 'tecnico' | 'avancado'
```

### Uso com Perfil Específico

```typescript
// Forçar perfil emocional (60%)
const resultado = naturalizarEValidar(texto, 'emocional');

// Forçar perfil técnico (10%)
const resultado = naturalizarEValidar(texto, 'tecnico');
```

### Uso Direto (sem validação)

```typescript
import { naturalizarTexto, obterPerfilNaturalizacao } from '@/lib/ia/language-naturalizer';

const opcoes = obterPerfilNaturalizacao('pratico');
const textoNatural = naturalizarTexto(texto, opcoes);
```

### Variar Respostas Template

```typescript
import { variarResposta } from '@/lib/ia/language-naturalizer';

const templates = [
  'Proteína é importante, mas não precisa se matar.',
  'O ideal são 1.6-2.2g/kg.',
  'Prefira proteína de qualidade.',
];

const resposta = variarResposta(templates);
// Retorna uma das 3 + naturalização automática
```

---

## 🧪 TESTES

### Executar Testes

```bash
npx tsx lib/ia/language-naturalizer.test.ts
```

### Saída Esperada

```
==========================================================
TESTES DO SISTEMA DE NATURALIZAÇÃO
==========================================================

📝 EXEMPLO 1: Naturalização Básica
----------------------------------------------------------
Original: Você deve focar muito em proteína...
Naturalizado: vc deve focar muiito em proteina pq...

📊 EXEMPLO 2: Validação de Naturalidade
----------------------------------------------------------
Score: 45 /100
Parece humano? ❌ Não
Problemas:
  - Pontuação perfeita demais
  - Sem gírias ou expressões informais

...
```

---

## 📊 EXEMPLOS ANTES/DEPOIS

### Exemplo 1: Resposta Técnica

**Antes:**
> "A ingestão proteica recomendada é de 1.6 a 2.2 gramas por quilograma de peso corporal para otimizar a síntese proteica muscular."

**Depois (Perfil Prático):**
> "a ingestão proteica recomendada é de 1.6 a 2.2 gramas por quilograma... pra otimizar a síntese proteica muscular"

**Score:** 68/100 ✅

---

### Exemplo 2: Resposta Emocional

**Antes:**
> "Compreendo sua frustração. A adesão dietética é um desafio comum. Sugiro começar com pequenas mudanças incrementais."

**Depois (Perfil Emocional):**
> "Cara, comigo foi assim… compreendo sua frustracao. a adesão dietética é um desafio comum msm... sugiro começar com pequenas mudancas incrementais"

**Score:** 72/100 ✅

---

### Exemplo 3: Resposta Avançada

**Antes:**
> "O jejum intermitente é uma estratégia nutricional válida que pode auxiliar no controle calórico e na flexibilidade metabólica."

**Depois (Perfil Avançado):**
> "O jejum intermitente é uma estratégia nutricional válida que pode auxiliar no controle calorico... e na flexibilidade metabolica"

**Score:** 65/100 ✅

---

## 🚀 FLUXO COMPLETO DE RESPOSTA DA IA

```
1. Usuário envia mensagem
   ↓
2. API /api/comunidades/ia recebe
   ↓
3. decidirEResponder() [decision-engine.ts]
   ├─ Anti-spam check
   ├─ Decidir tipo de intervenção
   └─ Gerar resposta base
   ↓
4. Formatar com follow-up question
   ↓
5. 🆕 NATURALIZAR TEXTO
   ├─ selecionarPerfilAleatorio() → 60/25/10/5
   ├─ obterPerfilNaturalizacao(perfil)
   ├─ naturalizarTexto(resposta, opcoes)
   └─ validarNaturalidade() [em dev]
   ↓
6. Salvar intervenção no banco
   ↓
7. Retornar resposta naturalizada
   ↓
8. Renderizar em tela (parecer humano!)
```

---

## 📈 MÉTRICAS DE QUALIDADE

### Metas

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Score médio** | ≥ 70 | `validarNaturalidade().score` |
| **Taxa de aprovação** | ≥ 95% | `validacao.pareceHumano === true` |
| **Distribuição de perfis** | 60/25/10/5 | Logs de perfil selecionado |
| **Erros propositais** | ≥ 40% | Presença de "tb", "pq", "vc" |

### Monitoramento

Em modo development, cada resposta é validada e logada:

```typescript
if (process.env.NODE_ENV === 'development') {
  const validacao = validarNaturalidade(respostaFinal);
  if (!validacao.pareceHumano) {
    console.warn('[IA] Score:', validacao.score, 'Problemas:', validacao.problemas);
  }
}
```

---

## 🛠️ MANUTENÇÃO E EVOLUÇÃO

### Adicionar Novas Gírias

**Arquivo:** `lib/ia/language-naturalizer.ts`

```typescript
const GIRIAS_TREINO = [
  'pump', 'shape', 'travado',
  // Adicionar aqui:
  'bombando', 'trincado', 'definido'
];
```

### Ajustar Distribuição de Perfis

```typescript
export function selecionarPerfilAleatorio() {
  const random = Math.random();
  if (random < 0.70) return 'emocional';  // Aumentar para 70%
  if (random < 0.85) return 'pratico';    // Manter 15%
  if (random < 0.95) return 'tecnico';    // Manter 10%
  return 'avancado';                       // Manter 5%
}
```

### Adicionar Novos Padrões de Validação

```typescript
// Novo critério: evitar uso de "obviamente", "claramente"
const palavrasMarketing = ['obviamente', 'claramente', 'simplesmente'];
const temMarketing = palavrasMarketing.some(p => texto.includes(p));

if (temMarketing) {
  problemas.push('Uso de linguagem de marketing');
  sugestoes.push('Remova "obviamente", "claramente"');
  score -= 10;
}
```

---

## 🎓 BOAS PRÁTICAS

### ✅ FAZER

- Sempre usar `naturalizarEValidar()` para facilidade
- Logar problemas de validação em dev
- Variar templates de resposta com `variarResposta()`
- Testar com `language-naturalizer.test.ts`
- Seguir a regra de ouro do dicionário

### ❌ NÃO FAZER

- Não ignorar score < 60 em produção
- Não forçar sempre o mesmo perfil
- Não adicionar emojis manualmente (máx 1)
- Não escrever frases muito longas (> 500 chars)
- Não usar linguagem perfeita demais

---

## 📞 SUPORTE E DÚVIDAS

### Arquivos de Referência

1. **Dicionário:** `DICIONARIO_LINGUAGEM_HUMANA.md`
2. **Sistema:** `lib/ia/language-naturalizer.ts`
3. **Testes:** `lib/ia/language-naturalizer.test.ts`
4. **Integração:** `lib/ia/decision-engine.ts`
5. **Config:** `app/comunidades/config/ia-facilitadora.ts`

### Problemas Comuns

**Score sempre baixo?**
- Verifique se está usando perfil correto
- Tente `nivel: 'forte'` nas opções
- Adicione mais gírias ao banco de dados

**Texto parece robótico?**
- Force perfil 'emocional' para testes
- Ative `aplicarErros: true`
- Adicione início natural ("Cara, comigo foi assim…")

**Validação muito rigorosa?**
- Ajuste limites em `validarNaturalidade()`
- Reduza penalidades de -15 para -10
- Aceite score ≥ 55 em vez de 60

---

## 🎉 CONCLUSÃO

Sistema de linguagem natural **100% implementado e integrado** no fluxo de respostas da IA.

### Benefícios

✅ Respostas parecem genuinamente humanas
✅ Distribuição natural de perfis (60/25/10/5)
✅ Validação automática de qualidade
✅ Fácil manutenção e expansão
✅ Documentação completa

### Próximos Passos

1. Monitorar métricas de qualidade em produção
2. Coletar feedback de usuários reais
3. Ajustar gírias baseado em uso real
4. Expandir banco de padrões regionais (PT-BR)

---

**Versão:** 2.0
**Última atualização:** 03/02/2026
**Status:** ✅ Produção Ready
