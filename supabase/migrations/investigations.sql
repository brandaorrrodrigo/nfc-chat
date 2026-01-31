-- ==========================================
-- Sistema de Investigação Progressiva
-- A IA faz perguntas antes de dar diagnóstico
-- ==========================================

-- Tabela: nfc_chat_investigations
-- Armazena o estado de cada investigação em andamento
CREATE TABLE IF NOT EXISTS nfc_chat_investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  comunidade_slug TEXT NOT NULL,
  topic TEXT NOT NULL,
  questions_asked INT DEFAULT 0,
  answers_received INT DEFAULT 0,
  asked_questions JSONB DEFAULT '[]'::jsonb,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_question_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para buscar investigação por post
CREATE INDEX IF NOT EXISTS idx_investigations_post
  ON nfc_chat_investigations(post_id);

-- Index para buscar investigações ativas de um usuário
CREATE INDEX IF NOT EXISTS idx_investigations_user_active
  ON nfc_chat_investigations(user_id, comunidade_slug, is_complete)
  WHERE is_complete = FALSE;

-- Index para limpeza de investigações antigas
CREATE INDEX IF NOT EXISTS idx_investigations_created
  ON nfc_chat_investigations(created_at);

-- ==========================================
-- Função para limpar investigações antigas (30+ dias)
-- ==========================================
CREATE OR REPLACE FUNCTION cleanup_old_investigations()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM nfc_chat_investigations
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND is_complete = TRUE;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- View: Estatísticas de investigações por tópico
-- ==========================================
CREATE OR REPLACE VIEW v_investigation_stats AS
SELECT
  topic,
  COUNT(*) as total,
  SUM(CASE WHEN is_complete THEN 1 ELSE 0 END) as completed,
  AVG(answers_received) as avg_answers,
  AVG(questions_asked) as avg_questions
FROM nfc_chat_investigations
GROUP BY topic
ORDER BY total DESC;
