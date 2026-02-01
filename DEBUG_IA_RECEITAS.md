# 🔍 DEBUG: Sistema de Resposta da IA - Receitas

## 📊 Status Atual

✅ API `/api/ai/moderate` existe e está implementada
✅ Hook `useAIModerator` existe e está funcionando
✅ Frontend chama a API corretamente
✅ Logs de debug adicionados

## 🧪 Como Testar

### PASSO 1: Verificar se Deploy Completou

Acesse: https://chat.nutrifitcoach.com.br/api/version

Deve mostrar:
```json
{
  "version": "1.1-ANTI-EXPLOIT",
  "commit": "b3e46dc"
}
```

Se o commit for diferente, aguarde o deploy completar (5-8 minutos).

---

### PASSO 2: Limpar Cache do Navegador

**IMPORTANTE:** Faça hard refresh para garantir que está usando a versão mais recente:

1. **Chrome/Edge:** `Ctrl + Shift + R`
2. **Ou abra aba anônima:** `Ctrl + Shift + N`
3. Faça login novamente

---

### PASSO 3: Abrir Console do Navegador

1. Pressione **F12**
2. Vá para aba **Console**
3. **Limpe o console** (ícone 🚫 ou Ctrl+L)

---

### PASSO 4: Postar Receita de Teste

Vá para: https://chat.nutrifitcoach.com.br/comunidades/receitas-saudaveis

Cole esta receita:

```
**Panqueca Fit**

**Ingredientes:**
- 2 ovos
- 1 banana madura
- 30g de aveia
- 1 scoop de whey protein
- Canela a gosto

**Modo de preparo:**
Bata todos os ingredientes no liquidificador até ficar homogêneo.
Aqueça uma frigideira antiaderente.
Despeje a massa e frite dos dois lados até dourar.

**Rende:** 2 porções
```

Envie a mensagem e **OBSERVE O CONSOLE**.

---

## 📋 O Que Você Deve Ver no Console

### ✅ CASO ESTEJA FUNCIONANDO:

Você verá esta sequência de logs:

```
🚀 [VERSÃO DEBUG v1.0] Moderação iniciada
[Moderação] Chamando moderatePost para: {...}
🔵 [useAIModerator] Iniciando moderação: {...}
🔵 [useAIModerator] Resposta HTTP: 200 OK
✅ [useAIModerator] Moderação concluída:
  - shouldRespond: true
  - responseType: "nutrition_analysis"
  - fpAwarded: 8
✅ [Moderação] Resultado completo: {...}
🔵 [Moderação] moderationResult existe
🔵 [Moderação] shouldRespond: true
🔵 [Moderação] response: SIM (tem resposta)
✅ [Moderação] IA vai responder! Tipo: nutrition_analysis
🎯 [Moderação] Agendando mensagem da IA com delay de 1.5s
💬 [Moderação] ADICIONANDO mensagem da IA ao chat: {...}
```

**Resultado esperado:** Após 1.5 segundos, a IA deve postar uma análise nutricional completa.

---

### ❌ CASO NÃO ESTEJA FUNCIONANDO:

Procure por:

#### ERRO 1: API não responde
```
🔴 [useAIModerator] Erro na API: {...}
```
**Solução:** Problema no servidor. Ver logs do Vercel.

#### ERRO 2: shouldRespond = false
```
⚠️ [Moderação] IA NÃO vai responder:
  - shouldRespond: false
```
**Possível causa:** Receita não foi detectada corretamente.

#### ERRO 3: moderationResult null
```
⚠️ [Moderação] moderationResult é NULL ou undefined
```
**Possível causa:** Erro silencioso na chamada da API.

---

## 🔧 Teste Manual da API (Sem Interface)

Se quiser testar a API diretamente:

### Opção 1: Usando cURL (PowerShell)

```powershell
$body = @{
    userId = "test-123"
    userName = "Teste"
    content = @"
**Panqueca Fit**

**Ingredientes:**
- 2 ovos
- 1 banana
- 30g de aveia

**Modo de preparo:**
Bata tudo e frite.

**Rende:** 2 porções
"@
    communitySlug = "receitas-saudaveis"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://chat.nutrifitcoach.com.br/api/ai/moderate" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

### Opção 2: Usando Node.js

```bash
node test-ai-moderate.js
```

---

## 📤 O Que Enviar para Debug

Se ainda não funcionar, me envie:

1. **Print do console completo** (todos os logs)
2. **Versão do deploy** (resultado de `/api/version`)
3. **Receita que você postou** (exata, copy/paste)
4. **URL da arena** onde testou

---

## 🎯 Checklist de Verificação

- [ ] Deploy completou (versão b3e46dc ou superior)
- [ ] Hard refresh feito (Ctrl+Shift+R)
- [ ] Console aberto e limpo antes de testar
- [ ] Receita postada na arena "Receitas Saudáveis"
- [ ] Logs observados no console
- [ ] Print do console salvo (se houver erro)

---

## 🚀 Próximos Passos Após Teste

Quando funcionar, podemos:

1. Remover logs de debug excessivos
2. Implementar melhorias na detecção de receitas
3. Adicionar suporte para mais arenas (exercícios, etc)
4. Melhorar formatação da resposta da IA

---

**Data:** 2026-02-01
**Commit:** b3e46dc
**Versão:** 1.1-ANTI-EXPLOIT + DEBUG
