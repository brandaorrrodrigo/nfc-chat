# ⚠️ UPLOAD MODULE - PROBLEMA CRÍTICO DE ARQUITETURA

**Data:** 2026-02-15
**Status:** 🔴 **INCOMPATIBILIDADE DETECTADA**

---

## 🚨 Problema Identificado

Os arquivos do **Upload Module** foram implementados usando **NestJS** (decorators como `@Injectable()`, `@Controller()`, `@Module()`), porém:

1. ❌ O projeto atual é **Next.js 15.5.0** (framework React)
2. ❌ **NÃO há dependências do NestJS instaladas** no `package.json`
3. ❌ **NÃO há arquivos** `main.ts` ou `app.module.ts` (estrutura NestJS)
4. ✅ Existe diretório `src/modules/` com código NestJS, mas sem configuração

### Arquivos Afetados (13 arquivos criados)

```
src/modules/upload/
├── storage/
│   ├── storage.interface.ts           ❌ NestJS
│   ├── local-storage.service.ts       ❌ NestJS (@Injectable)
│   └── s3-storage.service.ts          ❌ NestJS (@Injectable)
├── processors/
│   ├── thumbnail.processor.ts         ❌ NestJS (@Injectable)
│   └── video-metadata.processor.ts    ❌ NestJS (@Injectable)
├── guards/
│   └── quota.guard.ts                 ❌ NestJS (@Injectable, CanActivate)
├── interceptors/
│   └── file-validation.interceptor.ts ❌ NestJS (NestInterceptor)
├── dto/
│   ├── upload-video.dto.ts            ❌ NestJS (class-validator)
│   └── get-presigned-url.dto.ts       ❌ NestJS (class-validator)
├── upload.module.ts                   ❌ NestJS (@Module)
├── upload.service.ts                  ❌ NestJS (@Injectable)
└── upload.controller.ts               ❌ NestJS (@Controller)
```

**Nota:** O módulo `biomechanical` também usa NestJS mas igualmente sem dependências!

---

## 🎯 Soluções Possíveis

### **Opção 1: Converter para Next.js API Routes** ✅ RECOMENDADO

Reescrever o módulo usando **Next.js App Router** (API Routes nativas):

**Estrutura:**
```
app/api/v1/upload/
├── video/route.ts          → POST /api/v1/upload/video
├── [key]/route.ts          → GET /api/v1/upload/:key
├── delete/[key]/route.ts   → DELETE /api/v1/upload/:key
└── cleanup/route.ts        → POST /api/v1/upload/cleanup

lib/upload/
├── storage/
│   ├── storage.interface.ts
│   ├── local-storage.ts    → Classe TypeScript pura
│   └── s3-storage.ts       → Classe TypeScript pura
├── processors/
│   ├── thumbnail.ts
│   └── video-metadata.ts
├── validators/
│   ├── quota-validator.ts
│   └── file-validator.ts
└── upload.service.ts       → Classe TypeScript pura
```

**Vantagens:**
- ✅ Sem necessidade de instalar NestJS
- ✅ Aproveita roteamento nativo do Next.js
- ✅ Deploy unificado (Vercel)
- ✅ Menos overhead de framework
- ✅ Totalmente integrado com o projeto atual

**Desvantagens:**
- ⚠️ Precisa reescrever os 13 arquivos
- ⚠️ Perde Guards/Interceptors do NestJS (implementar manualmente)

---

### **Opção 2: Adicionar Backend NestJS Separado**

Manter os arquivos NestJS e criar um servidor backend separado:

**Estrutura:**
```
nfc-comunidades/              → Projeto atual (Next.js)
nfc-comunidades-api/          → NOVO projeto (NestJS)
  ├── src/
  │   ├── modules/
  │   │   ├── upload/         → Mover arquivos criados
  │   │   └── biomechanical/  → Mover módulo existente
  │   ├── main.ts
  │   └── app.module.ts
  ├── package.json
  └── tsconfig.json
```

**Comandos:**
```bash
# Criar novo projeto NestJS
npx @nestjs/cli new nfc-comunidades-api

# Mover módulos
mv src/modules/* nfc-comunidades-api/src/modules/

# Rodar ambos
cd nfc-comunidades-api && npm run start:dev  # Porta 4000
cd nfc-comunidades && npm run dev            # Porta 3000
```

**Vantagens:**
- ✅ Mantém código NestJS intacto
- ✅ Separação clara frontend/backend
- ✅ Aproveita todos recursos do NestJS (Guards, Interceptors, Pipes)
- ✅ Swagger automático

**Desvantagens:**
- ⚠️ Precisa manter 2 projetos separados
- ⚠️ Deploy em 2 lugares diferentes
- ⚠️ CORS entre frontend e backend
- ⚠️ Mais complexidade de infraestrutura

---

### **Opção 3: Instalar NestJS no Projeto Atual** ⚠️ NÃO RECOMENDADO

Adicionar dependências NestJS ao projeto Next.js:

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express
npm install @nestjs/swagger @nestjs/platform-multer multer
npm install class-validator class-transformer
```

**Problemas:**
- ❌ Next.js e NestJS não são compatíveis nativamente
- ❌ Conflitos de roteamento
- ❌ Dois servidores HTTP diferentes
- ❌ Build complexo
- ❌ Deploy problemático na Vercel

---

## 📋 Comparação das Opções

| Critério | Next.js API Routes | Backend Separado | NestJS + Next.js |
|----------|-------------------|------------------|------------------|
| **Complexidade** | 🟢 Baixa | 🟡 Média | 🔴 Alta |
| **Manutenibilidade** | 🟢 Fácil | 🟡 Moderada | 🔴 Difícil |
| **Deploy** | 🟢 Vercel único | 🟡 2 deploys | 🔴 Complexo |
| **Curva de aprendizado** | 🟢 Baixa | 🟡 Média | 🔴 Alta |
| **Features NestJS** | 🔴 Nenhuma | 🟢 Todas | 🟢 Todas |
| **Performance** | 🟢 Excelente | 🟢 Excelente | 🟡 OK |
| **Custo infraestrutura** | 🟢 1 servidor | 🟡 2 servidores | 🟢 1 servidor |

---

## ✅ Recomendação Final

### **OPÇÃO 1: Converter para Next.js API Routes**

**Motivos:**
1. Projeto já é Next.js - manter arquitetura consistente
2. Deploy simplificado na Vercel
3. Menos overhead de frameworks
4. Manutenção mais fácil
5. Sem conflitos de dependências

**Conversão necessária:**
- Services: Remover `@Injectable()` → Classes TypeScript puras
- Controllers: Converter para `app/api/**/route.ts`
- Guards: Converter para funções middleware
- Interceptors: Converter para funções wrapper
- DTOs: Usar Zod ao invés de class-validator
- Module: Não necessário no Next.js

**Tempo estimado:** 2-3 horas de trabalho

---

## 🚀 Próximos Passos

### Se escolher **Opção 1 (Next.js):**

1. ✅ Criar estrutura `app/api/v1/upload/`
2. ✅ Converter Services para classes TypeScript puras
3. ✅ Criar API Routes para cada endpoint
4. ✅ Implementar validators com Zod
5. ✅ Testar endpoints

### Se escolher **Opção 2 (Backend separado):**

1. ✅ Criar novo projeto NestJS
2. ✅ Instalar dependências necessárias
3. ✅ Mover módulos para novo projeto
4. ✅ Criar `main.ts` e `app.module.ts`
5. ✅ Configurar CORS
6. ✅ Testar integração

### Se escolher **Opção 3 (NÃO fazer):**

- ⚠️ Esta opção NÃO é recomendada devido aos problemas de compatibilidade

---

## 📝 Decisão Necessária

**Por favor, escolha uma das opções acima para que possamos prosseguir com a implementação correta.**

**Pergunta:** Qual opção você prefere?

1. **[A] Converter para Next.js API Routes** (Recomendado)
2. **[B] Criar backend NestJS separado**
3. **[C] Outra abordagem** (descrever)

Aguardo sua decisão para continuar! 🚀
