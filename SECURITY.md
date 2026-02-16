# 🔒 Política de Segurança

## Versões Suportadas

Apenas a versão mais recente recebe atualizações de segurança.

| Versão | Suportada          |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |
| < 1.0  | :x:                |

---

## 🚨 Reportar uma Vulnerabilidade

### ⚠️ NÃO Abra Issues Públicas

**Vulnerabilidades de segurança NÃO devem ser reportadas via GitHub Issues públicas.**

### ✅ Como Reportar

Envie um email para: **security@nutrifitcoach.com.br**

**Inclua:**
- Descrição detalhada da vulnerabilidade
- Steps para reproduzir
- Impacto potencial
- Versão afetada
- Seu nome/contato (para crédito na correção)

### 🕐 O que Esperar

- **24 horas:** Confirmação de recebimento
- **72 horas:** Avaliação inicial
- **7 dias:** Plano de correção
- **30 dias:** Correção implementada e release

### 🏆 Reconhecimento

Pesquisadores de segurança responsáveis serão reconhecidos em:
- Hall of Fame de Segurança
- CHANGELOG da release
- Créditos no advisory

---

## 🛡️ Práticas de Segurança

### Autenticação e Autorização

#### JWT Tokens
```typescript
// ✅ BOM: Tokens com expiração curta
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }  // 15 minutos
);

// Refresh token com expiração maior
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET!,
  { expiresIn: '7d' }  // 7 dias
);
```

#### Secrets Management

```bash
# ✅ BOM: Secrets via ambiente ou Docker secrets
DATABASE_URL=postgresql://user:${DB_PASSWORD}@localhost:5432/db

# ❌ RUIM: Hardcoded
DATABASE_URL=postgresql://user:hardcodedpassword@localhost:5432/db
```

### Input Validation

```typescript
// ✅ BOM: Validação com class-validator
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// ❌ RUIM: Sem validação
export class CreateUserDto {
  email: string;
  password: string;
}
```

### SQL Injection Protection

```typescript
// ✅ BOM: Prisma (parametrizado automaticamente)
await prisma.user.findUnique({
  where: { email: userEmail }
});

// ❌ RUIM: Raw SQL sem sanitização
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`;

// ✅ BOM: Raw SQL parametrizado
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${Prisma.sql`${userEmail}`}`;
```

### XSS Protection

```typescript
// ✅ BOM: Sanitização de HTML
import DOMPurify from 'isomorphic-dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);

// ✅ BOM: React escapa automaticamente
return <div>{userInput}</div>;

// ❌ RUIM: dangerouslySetInnerHTML sem sanitização
return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
```

### File Upload Security

```typescript
// ✅ BOM: Validação completa
const allowedMimeTypes = ['video/mp4', 'video/webm'];
const maxSize = 100 * 1024 * 1024; // 100MB

if (!allowedMimeTypes.includes(file.mimetype)) {
  throw new Error('Tipo de arquivo não permitido');
}

if (file.size > maxSize) {
  throw new Error('Arquivo muito grande');
}

// Verificar magic bytes (não confiar apenas em mimetype)
const fileType = await FileType.fromBuffer(file.buffer);
if (!allowedMimeTypes.includes(fileType?.mime)) {
  throw new Error('Tipo de arquivo inválido');
}
```

### Rate Limiting

```typescript
// Nginx (docker/nginx/nginx.conf)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=2r/s;

// Application level (Express)
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: 'Muitas requisições, tente novamente mais tarde.'
});

app.use('/api/', limiter);
```

### CORS

```typescript
// ✅ BOM: CORS restrito
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [],
  credentials: true,
  optionsSuccessStatus: 200
};

// ❌ RUIM: CORS aberto
const corsOptions = {
  origin: '*',
  credentials: true
};
```

### Password Hashing

```typescript
// ✅ BOM: bcrypt com salt rounds alto
import bcrypt from 'bcryptjs';

const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verificação
const isValid = await bcrypt.compare(password, hashedPassword);

// ❌ RUIM: Hash sem salt ou algoritmo fraco
const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
```

---

## 🔐 Configuração de Produção

### Checklist de Segurança

#### Secrets
- [ ] JWT_SECRET com 32+ caracteres aleatórios
- [ ] DATABASE_URL não exposta em logs
- [ ] Secrets via Docker secrets ou variáveis de ambiente
- [ ] .env no .gitignore
- [ ] Secrets rotacionados regularmente

#### HTTPS/TLS
- [ ] Certificado SSL válido (Let's Encrypt)
- [ ] HTTPS obrigatório (redirect HTTP → HTTPS)
- [ ] TLS 1.2+ apenas
- [ ] HSTS habilitado
- [ ] Ciphers fortes configurados

#### Headers de Segurança

```nginx
# docker/nginx/nginx.conf
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

#### Firewall
- [ ] UFW/iptables configurado
- [ ] Apenas portas 22, 80, 443 abertas
- [ ] Fail2Ban instalado
- [ ] PostgreSQL/Redis não expostos publicamente

#### Container Security
- [ ] Containers rodando como usuário não-root
- [ ] Imagens de fontes confiáveis
- [ ] Imagens atualizadas regularmente
- [ ] Secrets não em Dockerfiles
- [ ] .dockerignore configurado

#### Database
- [ ] Senha forte (20+ caracteres aleatórios)
- [ ] Acesso restrito via network
- [ ] Backups criptografados
- [ ] Audit logs habilitados

#### Monitoring
- [ ] Logs de acesso revisados regularmente
- [ ] Alertas de segurança configurados
- [ ] Monitoramento de tentativas de acesso
- [ ] Detecção de anomalias

---

## 🚫 Vulnerabilidades Conhecidas

### Nenhuma no momento

Última verificação: 2026-02-15

---

## 📋 Compliance

### LGPD (Lei Geral de Proteção de Dados)

- ✅ **Consentimento:** Usuários consentem ao criar conta
- ✅ **Acesso:** Usuários podem acessar seus dados via API
- ✅ **Exclusão:** Usuários podem deletar conta e dados
- ✅ **Minimização:** Coletamos apenas dados necessários
- ✅ **Segurança:** Dados criptografados em trânsito e em repouso
- ✅ **Portabilidade:** Exportação de dados disponível

### Dados Armazenados

| Dado | Justificativa | Retenção |
|------|---------------|----------|
| Email | Autenticação | Enquanto conta ativa |
| Nome | Personalização | Enquanto conta ativa |
| Senha (hash) | Autenticação | Enquanto conta ativa |
| Vídeos | Análise biomecânica | 30 dias ou deletado pelo usuário |
| Análises | Histórico | Enquanto conta ativa |
| Logs | Debugging e segurança | 90 dias |

### Direitos do Usuário

✅ **Direito de Acesso:** GET /api/users/me/data
✅ **Direito de Correção:** PUT /api/users/me
✅ **Direito de Exclusão:** DELETE /api/users/me
✅ **Direito de Portabilidade:** GET /api/users/me/export
✅ **Direito de Revogar Consentimento:** DELETE /api/users/me/consent

---

## 🔄 Incidentes de Segurança

### Processo de Resposta

1. **Detecção** (T+0h)
   - Monitoramento detecta anomalia
   - Alerta enviado para security team

2. **Contenção** (T+1h)
   - Isolar sistemas afetados
   - Bloquear ataques em andamento
   - Preservar evidências

3. **Erradicação** (T+6h)
   - Remover vulnerabilidade
   - Patch sistemas afetados
   - Verificar não há backdoors

4. **Recuperação** (T+12h)
   - Restaurar sistemas
   - Verificar integridade
   - Monitoramento intensivo

5. **Comunicação** (T+24h)
   - Notificar usuários afetados
   - Publicar post-mortem
   - Reportar para autoridades (se necessário)

---

## 📚 Recursos de Segurança

### Tools

- **Dependabot:** Alertas de dependências vulneráveis
- **npm audit:** Verificação de vulnerabilidades npm
- **OWASP ZAP:** Scanning de vulnerabilidades web
- **SonarQube:** Análise de código estático

### Best Practices

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

## 📞 Contato de Segurança

- **Email:** security@nutrifitcoach.com.br
- **PGP Key:** [security-key.asc](./security-key.asc)
- **Response Time:** 24h (business days)

---

**Última atualização:** 2026-02-15
**Versão:** 1.0.0

🔒 **Segurança é responsabilidade de todos.**
