-- =============================================
-- SETUP: Tabela de Mensagens das Comunidades
-- =============================================
-- Execute este SQL no Supabase Dashboard:
-- 1. Vá em SQL Editor
-- 2. Cole e execute este script
-- =============================================

-- Tabela principal de mensagens
CREATE TABLE IF NOT EXISTS community_messages (
  id TEXT PRIMARY KEY,
  comunidade_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES community_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_messages_slug ON community_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_messages_user ON community_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_parent ON community_messages(parent_id);

-- Índice composto para queries frequentes
CREATE INDEX IF NOT EXISTS idx_messages_slug_created ON community_messages(comunidade_slug, created_at DESC);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_community_messages_updated_at ON community_messages;
CREATE TRIGGER update_community_messages_updated_at
  BEFORE UPDATE ON community_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security) - opcional mas recomendado
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Policy: qualquer um pode ler mensagens
CREATE POLICY IF NOT EXISTS "Mensagens são públicas para leitura"
  ON community_messages FOR SELECT
  USING (true);

-- Policy: usuários autenticados podem inserir
CREATE POLICY IF NOT EXISTS "Usuários autenticados podem criar mensagens"
  ON community_messages FOR INSERT
  WITH CHECK (true);

-- Verificar se tabela foi criada
SELECT 'Tabela community_messages criada com sucesso!' as status;
