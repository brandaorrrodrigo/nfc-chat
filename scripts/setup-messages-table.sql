-- =============================================
-- SETUP: Tabela de Mensagens das Comunidades
-- Prefixo: nfc_chat_ (para não conflitar com app)
-- =============================================
-- Execute este SQL no Supabase Dashboard:
-- 1. Vá em SQL Editor
-- 2. Cole e execute este script
-- =============================================

-- Tabela principal de mensagens
CREATE TABLE IF NOT EXISTS nfc_chat_messages (
  id TEXT PRIMARY KEY,
  comunidade_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES nfc_chat_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_slug ON nfc_chat_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_user ON nfc_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_created ON nfc_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_parent ON nfc_chat_messages(parent_id);

-- Índice composto para queries frequentes
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_slug_created ON nfc_chat_messages(comunidade_slug, created_at DESC);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_nfc_chat_messages_updated_at ON nfc_chat_messages;
CREATE TRIGGER update_nfc_chat_messages_updated_at
  BEFORE UPDATE ON nfc_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE nfc_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: qualquer um pode ler mensagens
CREATE POLICY "Leitura publica" ON nfc_chat_messages
  FOR SELECT USING (true);

-- Policy: usuários autenticados podem inserir
CREATE POLICY "Insercao permitida" ON nfc_chat_messages
  FOR INSERT WITH CHECK (true);

-- Verificar se tabela foi criada
SELECT 'Tabela nfc_chat_messages criada com sucesso!' as status;
