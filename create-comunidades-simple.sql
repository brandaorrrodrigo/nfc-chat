-- Script SIMPLES para criar tabelas e comunidades no Supabase
-- Execute isso no Supabase Studio > SQL Editor

-- 1. Criar tabela de comunidades
CREATE TABLE IF NOT EXISTS "Comunidade" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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

-- 2. Criar tabela de membros da comunidade
CREATE TABLE IF NOT EXISTS "MembroComunidade" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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

-- 3. Criar tabela de tópicos
CREATE TABLE IF NOT EXISTS "Topico" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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

-- 4. Criar tabela de respostas
CREATE TABLE IF NOT EXISTS "Resposta" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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

-- 5. Criar usuário admin se não existir
INSERT INTO "User" (id, email, name, role)
SELECT gen_random_uuid()::TEXT, 'admin@nutrifitcoach.com', 'Admin NFC', 'SUPER_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM "User" WHERE email = 'admin@nutrifitcoach.com')
LIMIT 1;

-- 6. Inserir as 16 comunidades (versão simplificada)
INSERT INTO "Comunidade" (slug, titulo, descricao_curta, descricao_completa, icon, color, criador_id)
SELECT u.id, slug, titulo, descricao_curta, descricao_completa, icon, color FROM (VALUES
  ('receitas-saudaveis', 'Receitas Saudaveis', 'Receitas fit com analise nutricional', 'Compartilhe receitas saudaveis e receba analise automatica de calorias', 'Utensils', '#10b981'),
  ('dieta-vida-real', 'Dieta na Vida Real', 'Dificuldade real de seguir dietas', 'Espaco para falar sobre os desafios praticos de manter uma dieta', 'Utensils', '#84cc16'),
  ('deficit-calorico', 'Deficit Calorico na Vida Real', 'O que realmente acontece com o deficit', 'Discussoes sobre como o deficit calorico funciona na pratica', 'TrendingDown', '#f97316'),
  ('exercicios-que-ama', 'Exercicios que Ama', 'Compartilhe seus exercicios favoritos', 'Encontre os exercicios que voce realmente gosta de fazer', 'Dumbbell', '#6366f1'),
  ('treino-gluteo', 'Treino de Gluteo', 'Foco em gluteos', 'Exercicios e programas especificos para desenvolvimento gluteo', 'Dumbbell', '#ec4899'),
  ('odeia-treinar', 'Exercicio para Quem Odeia Treinar', 'Para quem nao gosta de ginastica', 'Dicas para quem pensa que odeia exercicio ate encontrar o seu tipo', 'Zap', '#f59e0b'),
  ('treino-casa', 'Treino em Casa', 'Exercicios sem equipamento', 'Treinos que voce pode fazer em casa com pouco ou nenhum equipamento', 'Home', '#8b5cf6'),
  ('performance-biohacking', 'Performance & Biohacking', 'Otimizacao fisica e mental', 'Tecnicas para potencializar seu desempenho', 'Zap', '#06b6d4'),
  ('sinal-vermelho', 'Sinal Vermelho', 'Saude das mulheres', 'Saude feminina, ciclo menstrual e questoes relacionadas', 'Heart', '#ef4444'),
  ('lipedema-paradoxo', 'Lipedema Paradoxo do Cardio', 'Entenda o lipedema', 'Tudo sobre lipedema e por que cardio nem sempre funciona', 'AlertCircle', '#f87171'),
  ('lipedema', 'Protocolo Lipedema', 'Protocolo de tratamento', 'Protocolo completo para manejo do lipedema', 'Activity', '#fb7185'),
  ('canetas', 'Canetas Emagrecedoras', 'Medicacoes para emagrecimento', 'Discussao sobre canetas e medicacoes para emagrecimento', 'Pill', '#a78bfa'),
  ('ansiedade-alimentacao', 'Ansiedade Compulsao e Alimentacao', 'Emocoes e alimentacao', 'Conexao entre ansiedade, compulsao e habitos alimentares', 'Brain', '#60a5fa'),
  ('emagrecimento-35-mais', 'Emagrecimento Feminino 35+', 'Para mulheres acima de 35', 'Desafios especificos do emagrecimento feminino depois dos 35 anos', 'Users', '#fbbf24'),
  ('antes-depois', 'Antes e Depois Processo Real', 'Jornada real de transformacao', 'Compartilhe sua transformacao com todos os altos e baixos do caminho', 'TrendingUp', '#10b981'),
  ('aspiracional-estetica', 'Aspiracional & Estetica', 'Objetivos esteticos', 'Discussao sobre objetivos esteticos, imagem corporal e autoestima', 'Sparkles', '#fbbf24')
) AS t(slug, titulo, descricao_curta, descricao_completa, icon, color)
CROSS JOIN "User" u
WHERE u.email = 'admin@nutrifitcoach.com'
ON CONFLICT (slug) DO NOTHING;

-- 7. Criar indices
CREATE INDEX IF NOT EXISTS "Comunidade_slug_idx" ON "Comunidade"(slug);
CREATE INDEX IF NOT EXISTS "Comunidade_criador_id_idx" ON "Comunidade"(criador_id);
CREATE INDEX IF NOT EXISTS "Topico_comunidade_id_idx" ON "Topico"(comunidade_id);
CREATE INDEX IF NOT EXISTS "MembroComunidade_comunidade_id_idx" ON "MembroComunidade"(comunidade_id);

-- 8. Verificar resultado
SELECT COUNT(*) as total_comunidades FROM "Comunidade";
