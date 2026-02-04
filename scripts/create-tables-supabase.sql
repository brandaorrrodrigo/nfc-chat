-- Script para criar tabelas de comunidades no Supabase
-- Execute isso no Supabase Studio > SQL Editor

-- Criar tabela de usuários (simplificada, se não existir)
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT,
  role TEXT DEFAULT 'USER',
  "twoFactorEnabled" BOOLEAN DEFAULT false,
  "twoFactorSecret" TEXT,
  "fpTotal" INTEGER DEFAULT 0,
  "fpAvailable" INTEGER DEFAULT 0,
  "currentStreak" INTEGER DEFAULT 0,
  "longestStreak" INTEGER DEFAULT 0,
  "lastActiveDate" TIMESTAMP,
  "isMuted" BOOLEAN DEFAULT false,
  "mutedUntil" TIMESTAMP,
  "isBanned" BOOLEAN DEFAULT false,
  "bannedAt" TIMESTAMP,
  "bannedReason" TEXT,
  "spamScore" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now()
);

-- Criar tabela de comunidades
CREATE TABLE IF NOT EXISTS "Comunidade" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descricao_curta TEXT,
  descricao_completa TEXT,
  visibilidade TEXT DEFAULT 'publica',
  requer_aprovacao BOOLEAN DEFAULT false,
  total_membros INTEGER DEFAULT 0,
  total_topicos INTEGER DEFAULT 0,
  total_mensagens INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  criador_id TEXT,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  arquivada_em TIMESTAMP,
  icon TEXT,
  color TEXT,
  FOREIGN KEY (criador_id) REFERENCES "User"(id)
);

-- Criar tabela de membros da comunidade
CREATE TABLE IF NOT EXISTS "MembroComunidade" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  comunidade_id TEXT NOT NULL,
  usuario_id TEXT NOT NULL,
  papel TEXT DEFAULT 'membro',
  status TEXT DEFAULT 'ativo',
  is_premium_member BOOLEAN DEFAULT false,
  pode_criar_topico BOOLEAN DEFAULT true,
  pode_responder BOOLEAN DEFAULT true,
  pode_moderar BOOLEAN DEFAULT false,
  pode_convidar BOOLEAN DEFAULT false,
  notificacoes_email BOOLEAN DEFAULT true,
  notificacoes_push BOOLEAN DEFAULT true,
  data_entrada TIMESTAMP DEFAULT now(),
  ultima_visualizacao TIMESTAMP,
  FOREIGN KEY (comunidade_id) REFERENCES "Comunidade"(id),
  FOREIGN KEY (usuario_id) REFERENCES "User"(id),
  UNIQUE(comunidade_id, usuario_id)
);

-- Criar tabela de tópicos
CREATE TABLE IF NOT EXISTS "Topico" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  comunidade_id TEXT NOT NULL,
  autor_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL,
  conteudo TEXT,
  tipo TEXT DEFAULT 'discussao',
  status TEXT DEFAULT 'aberto',
  tags TEXT[] DEFAULT '{}',
  total_respostas INTEGER DEFAULT 0,
  total_visualizacoes INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT now(),
  "updatedAt" TIMESTAMP DEFAULT now(),
  ultima_resposta_em TIMESTAMP,
  fixado_ate TIMESTAMP,
  FOREIGN KEY (comunidade_id) REFERENCES "Comunidade"(id),
  FOREIGN KEY (autor_id) REFERENCES "User"(id)
);

-- Criar tabela de respostas/comentários
CREATE TABLE IF NOT EXISTS "Resposta" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  topico_id TEXT NOT NULL,
  autor_id TEXT NOT NULL,
  resposta_pai_id TEXT,
  conteudo TEXT NOT NULL,
  tipo_autor TEXT DEFAULT 'usuario',
  status TEXT DEFAULT 'visivel',
  reacoes TEXT,
  marcada_solucao BOOLEAN DEFAULT false,
  indice_ordem INTEGER,
  "createdAt" TIMESTAMP DEFAULT now(),
  editado_em TIMESTAMP,
  FOREIGN KEY (topico_id) REFERENCES "Topico"(id),
  FOREIGN KEY (autor_id) REFERENCES "User"(id),
  FOREIGN KEY (resposta_pai_id) REFERENCES "Resposta"(id)
);

-- Inserir usuário admin padrão
INSERT INTO "User" (email, name, role)
VALUES ('admin@nutrifitcoach.com', 'Admin NFC', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Inserir as 16 comunidades
INSERT INTO "Comunidade" (slug, titulo, descricao_curta, descricao_completa, visibilidade, icon, color, criador_id)
SELECT
  data->>'slug' AS slug,
  data->>'titulo' AS titulo,
  data->>'descricao_curta' AS descricao_curta,
  data->>'descricao_completa' AS descricao_completa,
  'publica' AS visibilidade,
  data->>'icon' AS icon,
  data->>'color' AS color,
  u.id AS criador_id
FROM (
  VALUES
    ('{"slug": "receitas-saudaveis", "titulo": "Receitas Saudáveis", "descricao_curta": "Receitas fit com análise nutricional", "descricao_completa": "Compartilhe receitas saudáveis e receba análise automática de calorias, proteínas e nutrientes", "icon": "Utensils", "color": "#10b981"}'::jsonb),
    ('{"slug": "dieta-vida-real", "titulo": "Dieta na Vida Real", "descricao_curta": "Dificuldade real de seguir dietas", "descricao_completa": "Espaço para falar sobre os desafios práticos de manter uma dieta", "icon": "Utensils", "color": "#84cc16"}'::jsonb),
    ('{"slug": "deficit-calorico", "titulo": "Déficit Calórico na Vida Real", "descricao_curta": "O que realmente acontece com o déficit", "descricao_completa": "Discussões sobre como o déficit calórico funciona (ou não) na prática", "icon": "TrendingDown", "color": "#f97316"}'::jsonb),
    ('{"slug": "exercicios-que-ama", "titulo": "Exercícios que Ama", "descricao_curta": "Compartilhe seus exercícios favoritos", "descricao_completa": "Encontre os exercícios que você realmente gosta de fazer", "icon": "Dumbbell", "color": "#6366f1"}'::jsonb),
    ('{"slug": "treino-gluteo", "titulo": "Treino de Glúteo", "descricao_curta": "Foco em glúteos", "descricao_completa": "Exercícios e programas específicos para desenvolvimento glúteo", "icon": "Dumbbell", "color": "#ec4899"}'::jsonb),
    ('{"slug": "odeia-treinar", "titulo": "Exercício para Quem Odeia Treinar", "descricao_curta": "Para quem não gosta de ginástica", "descricao_completa": "Dicas para quem pensa que odeia exercício... até encontrar o seu tipo", "icon": "Zap", "color": "#f59e0b"}'::jsonb),
    ('{"slug": "treino-casa", "titulo": "Treino em Casa", "descricao_curta": "Exercícios sem equipamento", "descricao_completa": "Treinos que você pode fazer em casa com pouco ou nenhum equipamento", "icon": "Home", "color": "#8b5cf6"}'::jsonb),
    ('{"slug": "performance-biohacking", "titulo": "Performance & Biohacking", "descricao_curta": "Otimização física e mental", "descricao_completa": "Técnicas para potencializar seu desempenho", "icon": "Zap", "color": "#06b6d4"}'::jsonb),
    ('{"slug": "sinal-vermelho", "titulo": "Sinal Vermelho", "descricao_curta": "Saúde das mulheres", "descricao_completa": "Saúde feminina, ciclo menstrual e questões relacionadas", "icon": "Heart", "color": "#ef4444"}'::jsonb),
    ('{"slug": "lipedema-paradoxo", "titulo": "Lipedema — Paradoxo do Cardio", "descricao_curta": "Entenda o lipedema", "descricao_completa": "Tudo sobre lipedema e por que cardio nem sempre funciona", "icon": "AlertCircle", "color": "#f87171"}'::jsonb),
    ('{"slug": "lipedema", "titulo": "Protocolo Lipedema", "descricao_curta": "Protocolo de tratamento", "descricao_completa": "Protocolo completo para manejo do lipedema", "icon": "Activity", "color": "#fb7185"}'::jsonb),
    ('{"slug": "canetas", "titulo": "Canetas Emagrecedoras", "descricao_curta": "Medicações para emagrecimento", "descricao_completa": "Discussão sobre canetas e medicações para emagrecimento", "icon": "Pill", "color": "#a78bfa"}'::jsonb),
    ('{"slug": "ansiedade-alimentacao", "titulo": "Ansiedade, Compulsão e Alimentação", "descricao_curta": "Emoções e alimentação", "descricao_completa": "Conexão entre ansiedade, compulsão e hábitos alimentares", "icon": "Brain", "color": "#60a5fa"}'::jsonb),
    ('{"slug": "emagrecimento-35-mais", "titulo": "Emagrecimento Feminino 35+", "descricao_curta": "Para mulheres acima de 35", "descricao_completa": "Desafios específicos do emagrecimento feminino depois dos 35 anos", "icon": "Users", "color": "#fbbf24"}'::jsonb),
    ('{"slug": "antes-depois", "titulo": "Antes e Depois — Processo Real", "descricao_curta": "Jornada real de transformação", "descricao_completa": "Compartilhe sua transformação, com todos os altos e baixos do caminho", "icon": "TrendingUp", "color": "#10b981"}'::jsonb),
    ('{"slug": "aspiracional-estetica", "titulo": "Aspiracional & Estética", "descricao_curta": "Objetivos estéticos", "descricao_completa": "Discussão sobre objetivos estéticos, imagem corporal e autoestima", "icon": "Sparkles", "color": "#fbbf24"}'::jsonb)
  ) AS t(data)
CROSS JOIN "User" u
WHERE u.email = 'admin@nutrifitcoach.com'
ON CONFLICT (slug) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS "Comunidade_slug_idx" ON "Comunidade"(slug);
CREATE INDEX IF NOT EXISTS "Topico_comunidade_id_idx" ON "Topico"(comunidade_id);
CREATE INDEX IF NOT EXISTS "Resposta_topico_id_idx" ON "Resposta"(topico_id);
CREATE INDEX IF NOT EXISTS "MembroComunidade_comunidade_id_idx" ON "MembroComunidade"(comunidade_id);

-- Verificar se tudo foi criado
SELECT
  COUNT(*) as total_comunidades
FROM "Comunidade";
