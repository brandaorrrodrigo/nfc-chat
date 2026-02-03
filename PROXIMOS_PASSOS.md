# ✅ PRÓXIMOS PASSOS - Sistema IA Avançada

**Status:** Código 100% implementado e deployado ✅
**Commit:** 55dfd1a (já está no GitHub)
**Falta:** Executar SQL no Supabase (5 minutos)

---

## 🎯 CHECKLIST

### ☐ PASSO 1: Abrir arquivo SQL
```powershell
D:
cd D:\NUTRIFITCOACH_MASTER\nfc-comunidades
notepad supabase\migrations\ia_interventions.sql
```

**Resultado:** Notepad abre com o SQL completo

---

### ☐ PASSO 2: Copiar TODO o conteúdo
- Selecionar tudo: `Ctrl + A`
- Copiar: `Ctrl + C`

---

### ☐ PASSO 3: Acessar Supabase Dashboard
1. Abrir navegador
2. Ir para: https://supabase.com/dashboard
3. Login se necessário
4. Selecionar projeto: **NutriFitCoach Comunidades**

---

### ☐ PASSO 4: Executar SQL
1. Menu lateral → **SQL Editor**
2. Clicar em **+ New Query**
3. Colar o SQL copiado: `Ctrl + V`
4. Clicar em **RUN** (botão verde no canto inferior direito)
5. Aguardar mensagem: **Success**

---

### ☐ PASSO 5: Verificar se funcionou
No **SQL Editor**, executar esta query:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name LIKE 'nfc_chat_ia%';
```

**Deve retornar:**
```
nfc_chat_ia_interventions
nfc_chat_ia_user_stats
```

---

### ☐ PASSO 6: Testar em produção

1. Ir para: https://chat.nutrifitcoach.com.br/comunidades/receitas-saudaveis
2. Fazer login
3. Postar várias mensagens (mínimo 8)
4. Na 8ª+ mensagem, postar esta receita:

```
**Panqueca Fit**

**Ingredientes:**
- 2 ovos
- 1 banana
- 30g de aveia

**Modo de preparo:**
Bata tudo e frite.

**Rende:** 2 porções
```

5. Abrir Console (F12)
6. Observar logs

---

## ✅ RESULTADO ESPERADO

**Console mostra:**
```
🚀 [VERSÃO DEBUG v1.0] Moderação iniciada
✅ [Moderação] IA vai responder! Tipo: nutrition_analysis
🎯 [Moderação] Agendando mensagem da IA com delay de 1.5s
💬 [Moderação] ADICIONANDO mensagem da IA ao chat
```

**Após 1.5 segundos:**
- IA posta análise nutricional da receita
- Resposta **SEMPRE** termina com pergunta:
  ```
  → Como tem sido sua energia durante as janelas de jejum?
  ```

---

## 🔍 SE NÃO FUNCIONAR

### Cenário 1: SQL dá erro
**Solução:** Ver arquivo `EXECUTAR_SQL_SUPABASE.md` → seção Troubleshooting

### Cenário 2: IA não responde
**Possíveis causas:**
- Menos de 8 mensagens na arena
- Cooldown ativo (10 minutos desde última intervenção)
- Limite diário atingido (2 intervenções/dia)
- Probabilidade não atingida (40% chance)

**Ver logs no Console:**
```
⚠️ [Moderação] IA NÃO vai responder:
  - motivo: "Aguardando mais mensagens (5/8)"
```

### Cenário 3: Resposta sem follow-up
**Causa:** Usando sistema antigo (não deveria acontecer)

**Verificar:**
- Deploy completou? Ver: https://vercel.com/dashboard
- Commit é 55dfd1a ou posterior?

---

## 📊 MONITORAR SISTEMA

### Ver intervenções da IA:
```sql
SELECT
  comunidade_slug,
  user_id,
  intervention_type,
  follow_up_question,
  was_answered,
  created_at
FROM nfc_chat_ia_interventions
ORDER BY created_at DESC
LIMIT 10;
```

### Ver stats de usuário:
```sql
SELECT
  user_id,
  interventions_received,
  questions_ignored,
  questions_answered,
  adjusted_probability,
  stat_date
FROM nfc_chat_ia_user_stats
ORDER BY stat_date DESC, user_id
LIMIT 10;
```

---

## 🎉 QUANDO TUDO FUNCIONAR

Sistema operando:
- ✅ Anti-spam (8 msgs, cooldown, limite diário)
- ✅ Follow-up questions personalizadas
- ✅ Tracking automático de respostas
- ✅ Probabilidade se ajusta sozinha

**Comportamento:**
- Usuário posta 8+ mensagens
- IA analisa e decide (40% chance)
- Se intervir, resposta **sempre** com pergunta
- Se usuário responde, probabilidade sobe para ~48%
- Se ignora, probabilidade cai para ~20%

---

## 📝 ARQUIVOS DE REFERÊNCIA

- `EXECUTAR_SQL_SUPABASE.md` → Guia detalhado do SQL
- `COMANDOS_POWERSHELL.md` → Comandos corretos para Windows
- `TESTE_IA_RECEITAS.md` → Guia de testes completo
- `PLANO_COMPLETO_FINAL.md` → Resumo técnico completo

---

**Tempo estimado:** 5-10 minutos
**Dificuldade:** Fácil (copiar/colar)
**Próximo:** Executar SQL no Supabase! 🚀
