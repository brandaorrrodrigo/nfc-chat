-- ============================================
-- NFV - Tabelas para Analise Biomecanica
-- Executar no Supabase SQL Editor
-- ============================================

-- Analises de video (real-time)
CREATE TABLE IF NOT EXISTS nfc_chat_video_analyses (
  id TEXT PRIMARY KEY,
  arena_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_path TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INT,
  movement_pattern TEXT NOT NULL,
  user_description TEXT,
  fp_cost INT DEFAULT 0,
  paid_with_subscription BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'PENDING_AI',
  ai_analysis JSONB,
  ai_analyzed_at TIMESTAMPTZ,
  ai_confidence FLOAT,
  admin_reviewer_id TEXT,
  admin_notes TEXT,
  admin_edited_analysis JSONB,
  reviewed_at TIMESTAMPTZ,
  published_analysis JSONB,
  published_at TIMESTAMPTZ,
  rejection_reason TEXT,
  view_count INT DEFAULT 0,
  helpful_votes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_arena ON nfc_chat_video_analyses(arena_slug);
CREATE INDEX IF NOT EXISTS idx_video_status ON nfc_chat_video_analyses(status);
CREATE INDEX IF NOT EXISTS idx_video_user ON nfc_chat_video_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_video_pattern ON nfc_chat_video_analyses(movement_pattern);

-- Votos de utilidade
CREATE TABLE IF NOT EXISTS nfc_chat_video_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(analysis_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_vote_analysis ON nfc_chat_video_votes(analysis_id);
CREATE INDEX IF NOT EXISTS idx_vote_user ON nfc_chat_video_votes(user_id);

-- Trigger para updated_at automatico
CREATE OR REPLACE FUNCTION update_nfv_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_video_analyses_updated ON nfc_chat_video_analyses;
CREATE TRIGGER trg_video_analyses_updated
  BEFORE UPDATE ON nfc_chat_video_analyses
  FOR EACH ROW EXECUTE FUNCTION update_nfv_updated_at();

-- Enable RLS
ALTER TABLE nfc_chat_video_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_chat_video_votes ENABLE ROW LEVEL SECURITY;

-- Politicas de acesso (ajustar conforme necessidade)
CREATE POLICY "Video analyses are viewable by everyone"
  ON nfc_chat_video_analyses FOR SELECT USING (true);

CREATE POLICY "Users can insert their own analyses"
  ON nfc_chat_video_analyses FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own analyses"
  ON nfc_chat_video_analyses FOR UPDATE USING (true);

CREATE POLICY "Votes are viewable by everyone"
  ON nfc_chat_video_votes FOR SELECT USING (true);

CREATE POLICY "Users can insert votes"
  ON nfc_chat_video_votes FOR INSERT WITH CHECK (true);

-- ============================================
-- Supabase Storage: Criar bucket nfc-videos
-- Executar manualmente no dashboard:
-- 1. Storage > New bucket > nfc-videos
-- 2. Public bucket: ON (para videos aprovados)
-- 3. Max file size: 100MB
-- 4. Allowed MIME types: video/mp4, video/webm, video/quicktime
-- ============================================
