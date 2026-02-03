-- ============================================
-- CRIAR TABELA DE VÍDEOS NFV
-- ============================================
-- Esta é a tabela que a API espera encontrar
-- ============================================

-- Criar tabela nfc_chat_video_analyses
CREATE TABLE IF NOT EXISTS nfc_chat_video_analyses (
  id TEXT PRIMARY KEY,
  arena_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,

  -- Video info
  video_url TEXT NOT NULL,
  video_path TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  movement_pattern TEXT NOT NULL,
  user_description TEXT,

  -- Payment
  fp_cost INTEGER NOT NULL DEFAULT 0,
  paid_with_subscription BOOLEAN NOT NULL DEFAULT false,

  -- Analysis
  status TEXT NOT NULL DEFAULT 'PENDING_AI',
  ai_analysis TEXT,
  ai_confidence DOUBLE PRECISION,
  key_points JSONB,

  -- Review
  professional_review TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP(3),

  -- Timestamps
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_nfc_video_arena ON nfc_chat_video_analyses(arena_slug);
CREATE INDEX IF NOT EXISTS idx_nfc_video_user ON nfc_chat_video_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_video_status ON nfc_chat_video_analyses(status);
CREATE INDEX IF NOT EXISTS idx_nfc_video_created ON nfc_chat_video_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nfc_video_pattern ON nfc_chat_video_analyses(movement_pattern);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_nfc_video_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nfc_video_updated_at_trigger
    BEFORE UPDATE ON nfc_chat_video_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_nfc_video_updated_at();

-- Desabilitar RLS para teste
ALTER TABLE nfc_chat_video_analyses DISABLE ROW LEVEL SECURITY;

-- Verificar
SELECT
  'nfc_chat_video_analyses' as table_name,
  COUNT(*) as record_count
FROM nfc_chat_video_analyses;

SELECT '✅ Tabela nfc_chat_video_analyses criada com sucesso!' as message;
