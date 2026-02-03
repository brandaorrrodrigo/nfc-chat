# 🔧 Comandos PowerShell Corretos

**Problema:** No PowerShell do Windows, os caminhos com `/d/` não funcionam.

---

## ✅ COMANDOS CORRETOS

### Navegar para o projeto:
```powershell
# ERRADO (não funciona no PowerShell)
cd /d/NUTRIFITCOACH_MASTER/nfc-comunidades

# CORRETO (usar D:\ no PowerShell)
D:
cd D:\NUTRIFITCOACH_MASTER\nfc-comunidades
```

### Ver diretório atual:
```powershell
pwd
```

### Listar arquivos:
```powershell
ls
```

### Ver arquivo SQL:
```powershell
Get-Content supabase\migrations\ia_interventions.sql
```

### Abrir arquivo no Notepad:
```powershell
notepad supabase\migrations\ia_interventions.sql
```

---

## 📝 Executar SQL no Supabase

**Supabase CLI não está instalado**, então use o **Dashboard**:

1. Abrir navegador
2. Ir para: https://supabase.com/dashboard
3. Selecionar projeto
4. Clicar em **SQL Editor**
5. Clicar em **+ New Query**
6. Colar SQL de: `supabase\migrations\ia_interventions.sql`
7. Clicar em **RUN**

**Guia completo:** Ver arquivo `EXECUTAR_SQL_SUPABASE.md`

---

## 🚀 Git no PowerShell

### Ver status:
```powershell
git status
```

### Ver commits recentes:
```powershell
git log --oneline -5
```

### Push para produção:
```powershell
git push origin main
```

---

## 💡 DICA: Usar Windows Terminal

Recomendo usar **Windows Terminal** em vez de PowerShell padrão:

1. Baixar da Microsoft Store: "Windows Terminal"
2. Mais moderno e com melhor suporte
3. Suporta múltiplas abas
4. Sintaxe colorida

---

## 📂 Estrutura do Projeto

```
D:\NUTRIFITCOACH_MASTER\
└── nfc-comunidades\
    ├── app\
    │   ├── api\
    │   │   └── comunidades\
    │   │       └── ia\
    │   │           ├── route.ts         ← API principal
    │   │           └── resposta\
    │   │               └── route.ts     ← API de tracking
    │   └── comunidades\
    │       └── [slug]\
    │           └── page.tsx             ← Frontend
    ├── hooks\
    │   └── useIAFacilitadora.ts         ← Hook React
    ├── lib\
    │   └── ia\
    │       ├── anti-spam.ts             ← Filtros
    │       ├── follow-up-generator.ts   ← Perguntas
    │       ├── intervention-tracker.ts  ← Tracking
    │       └── decision-engine.ts       ← Motor
    └── supabase\
        └── migrations\
            └── ia_interventions.sql     ← SQL para executar
```

---

## ✅ Verificar Deploy

Após fazer push, verificar no Vercel:

1. Ir para: https://vercel.com/dashboard
2. Selecionar projeto
3. Ver último deploy
4. Status deve estar: **Ready**

URL de produção:
```
https://chat.nutrifitcoach.com.br
```

---

## 🧪 Testar Sistema

Após executar SQL no Supabase:

```powershell
# Abrir navegador na arena de receitas
start https://chat.nutrifitcoach.com.br/comunidades/receitas-saudaveis
```

Postar receita de teste:
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

**Resultado esperado:**
- Após 8+ mensagens na arena
- IA responde com análise nutricional
- **SEMPRE** termina com pergunta (→ Como tem sido...?)

---

**Próximo passo:** Executar SQL no Supabase Dashboard! 🚀
