# ⚡ QUICK START - NutriFitCoach Local

## ✅ STATUS ATUAL

**Ambiente Verificado:**
- ✅ Node.js v20.19.6
- ✅ npm 10.8.2
- ✅ Docker 29.1.3
- ✅ Docker Compose v2.40.3
- ✅ Ollama 0.15.1
- ✅ NVIDIA Driver 560.94

**Modelos Ollama Instalados:**
- ✅ llama3.1:70b (42 GB)
- ✅ llama3:8b (4.7 GB)
- ✅ llava:latest (4.7 GB)
- ✅ nomic-embed-text (274 MB)

**Arquivos Criados:**
- ✅ Prisma Client gerado
- ✅ docker-compose.yml configurado
- ✅ Todas as bibliotecas de IA implementadas
- ✅ GPU monitoring configurado

---

## 🚀 PASSOS PARA INICIAR (5 MIN)

### **PASSO 1: Iniciar Docker Desktop**

**Windows:**
1. Abra o Docker Desktop (ícone na área de trabalho ou menu iniciar)
2. Aguarde até ver "Docker Desktop is running" na bandeja

**Verificar:**
```bash
docker ps
```

---

### **PASSO 2: Subir Containers (PostgreSQL + Redis + ChromaDB)**

```bash
docker compose up -d
```

**Containers esperados:**
- `nfc-postgres` (porta 5432)
- `nfc-redis` (porta 6379)
- `nfc-chromadb` (porta 8000)

**Verificar:**
```bash
docker compose ps
```

---

### **PASSO 3: Configurar .env.local**

**Se ainda não existe:**
```bash
copy .env.local.example .env.local
```

**Edite `.env.local` e ajuste:**
```bash
# Database (altere a senha)
DATABASE_URL="postgresql://nfc:SUA_SENHA_AQUI@localhost:5432/nfc_admin"

# Deixe o resto como está (já configurado para local)
```

---

### **PASSO 4: Criar Database e Popular**

```bash
# Rodar migrations
npx prisma migrate dev --name init

# Popular com dados iniciais
npx ts-node prisma/seed.ts
```

**Login padrão criado:**
- Email: `admin@nutrifitcoach.com`
- Senha: `admin123`

---

### **PASSO 5: Iniciar Aplicação**

```bash
npm run dev
```

**Acesse:**
- 🌐 App: http://localhost:3001
- 🎮 GPU Monitor: http://localhost:3001 (Dashboard widget)

---

## 🎮 TESTAR COMPONENTES

### **1. Testar Ollama (LLM)**

```bash
# Via CLI
ollama run llama3.1:70b

# Via API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1:70b",
  "prompt": "Explique proteína em português",
  "stream": false
}'
```

### **2. Testar ChromaDB**

```bash
curl http://localhost:8000/api/v1/heartbeat
```

### **3. Testar GPU Monitoring**

```bash
# No terminal
nvidia-smi

# Ou acesse o Dashboard e veja o widget "GPU Monitor"
```

---

## 📊 VERIFICAR STATUS

### **Serviços Docker:**
```bash
docker compose ps
```

Deve mostrar:
```
NAME            STATUS          PORTS
nfc-postgres    Up X minutes    0.0.0.0:5432->5432/tcp
nfc-redis       Up X minutes    0.0.0.0:6379->6379/tcp
nfc-chromadb    Up X minutes    0.0.0.0:8000->8000/tcp
```

### **Ollama:**
```bash
ollama list
```

### **GPUs:**
```bash
nvidia-smi
```

Deve mostrar 3 GPUs RTX 3090.

---

## 🐛 PROBLEMAS COMUNS

### **"Docker não conecta"**
**Solução:** Inicie o Docker Desktop e aguarde ele ficar pronto.

### **"Port already in use"**
**Solução:** Altere as portas no `docker-compose.yml` se necessário.

### **"Ollama not responding"**
**Solução:**
```bash
# Windows: Feche e abra o Ollama pela bandeja
# Ou reinstale: winget install Ollama.Ollama
```

### **"CUDA out of memory"**
**Solução:** Feche outros processos usando GPU ou use modelo menor:
```bash
# No .env.local
DEFAULT_LLM_MODEL="llama3:8b"
```

---

## 📈 PERFORMANCE ESPERADA

Com 3x RTX 3090:

| Componente | GPU | VRAM | Tokens/seg |
|------------|-----|------|------------|
| Llama 70B | 0-1 | ~45GB | 15-20 |
| Llama 8B | 1 | ~5GB | 80-100 |
| LLaVA 13B | 2 | ~12GB | 10-15 |

---

## ✅ CHECKLIST FINAL

Antes de considerar pronto:

- [ ] Docker Desktop rodando
- [ ] 3 containers UP (`docker compose ps`)
- [ ] Ollama respondendo (`ollama list`)
- [ ] Database criada (`npx prisma migrate dev`)
- [ ] Seed executado (dados iniciais)
- [ ] App rodando (`npm run dev`)
- [ ] Dashboard acessível (localhost:3001)
- [ ] Login funcionando (admin@nutrifitcoach.com)
- [ ] GPU Monitor mostrando 3 GPUs
- [ ] System Status: tudo verde

---

## 🎯 PRÓXIMOS PASSOS

1. **Testar IA:**
   - Vá em "Controle IA" no dashboard
   - Configure uma arena
   - Teste geração de resposta

2. **Configurar Arenas:**
   - Crie arenas customizadas
   - Ajuste personas da IA
   - Configure thresholds

3. **Popular RAG:**
   - Adicione documentos ao ChromaDB
   - Teste queries
   - Verifique citações

4. **Monitorar:**
   - Observe GPU Monitor em tempo real
   - Verifique logs do Ollama
   - Ajuste configurações conforme necessário

---

## 📚 DOCUMENTAÇÃO COMPLETA

- 📖 **LOCAL_SETUP_GUIDE.md** - Guia detalhado
- 📖 **MIGRATION_LOCAL_SUMMARY.md** - Resumo técnico
- 📖 **ADMIN_PANEL_README.md** - Painel administrativo

---

## 🆘 COMANDOS ÚTEIS

```bash
# Gerenciar Docker
docker compose up -d           # Subir
docker compose down            # Parar
docker compose logs -f         # Ver logs
docker compose restart redis   # Reiniciar serviço

# Gerenciar Ollama
ollama list                    # Listar modelos
ollama ps                      # Ver rodando
ollama serve                   # Iniciar servidor

# Monitorar GPU
nvidia-smi                     # Status
watch -n 1 nvidia-smi         # Atualização contínua

# Desenvolvimento
npm run dev                    # Iniciar app
npx prisma studio             # Abrir DB visual
npx prisma migrate dev        # Rodar migrations
```

---

🎉 **Sistema pronto para uso! Qualquer dúvida, consulte a documentação completa.**
