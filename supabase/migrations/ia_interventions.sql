-- ==========================================
-- IA Facilitadora Avancada - Schema
-- Sistema anti-spam e tracking de intervencoes
-- ==========================================

-- Tabela: nfc_chat_ia_interventions
-- Armazena todas as intervencoes da IA com perguntas de follow-up
CREATE TABLE IF NOT EXISTS nfc_chat_ia_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comunidade_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  trigger_message_id TEXT,
  intervention_type TEXT NOT NULL,
  intervention_text TEXT NOT NULL,
  follow_up_question TEXT NOT NULL,
  was_answered BOOLEAN DEFAULT FALSE,
  answer_message_id TEXT,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para cooldown check (usuario + comunidade + data)
CREATE INDEX IF NOT EXISTS idx_ia_interv_cooldown
  ON nfc_chat_ia_interventions(user_id, comunidade_slug, created_at DESC);

-- Index para buscar intervencoes nao respondidas
CREATE INDEX IF NOT EXISTS idx_ia_interv_unanswered
  ON nfc_chat_ia_interventions(was_answered, user_id, comunidade_slug)
  WHERE was_answered = FALSE;

-- Tabela: nfc_chat_ia_user_stats
-- Estatisticas diarias por usuario para ajuste de probabilidade
CREATE TABLE IF NOT EXISTS nfc_chat_ia_user_stats (
  user_id TEXT NOT NULL,
  stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
  interventions_received INT DEFAULT 0,
  questions_ignored INT DEFAULT 0,
  questions_answered INT DEFAULT 0,
  adjusted_probability FLOAT DEFAULT 0.4,
  last_intervention_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, stat_date)
);

-- Index para buscar stats do usuario
CREATE INDEX IF NOT EXISTS idx_ia_user_stats_lookup
  ON nfc_chat_ia_user_stats(user_id, stat_date DESC);

-- ==========================================
-- Funcoes Auxiliares
-- ==========================================

-- Funcao para obter estatisticas do usuario hoje
CREATE OR REPLACE FUNCTION get_user_ia_stats_today(p_user_id TEXT)
RETURNS TABLE (
  interventions_received INT,
  questions_ignored INT,
  questions_answered INT,
  adjusted_probability FLOAT,
  last_intervention_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(s.interventions_received, 0),
    COALESCE(s.questions_ignored, 0),
    COALESCE(s.questions_answered, 0),
    COALESCE(s.adjusted_probability, 0.4),
    s.last_intervention_at
  FROM nfc_chat_ia_user_stats s
  WHERE s.user_id = p_user_id
    AND s.stat_date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Funcao para incrementar ou criar stats do usuario
CREATE OR REPLACE FUNCTION upsert_user_ia_stats(
  p_user_id TEXT,
  p_increment_interventions BOOLEAN DEFAULT FALSE,
  p_increment_ignored BOOLEAN DEFAULT FALSE,
  p_increment_answered BOOLEAN DEFAULT FALSE,
  p_new_probability FLOAT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO nfc_chat_ia_user_stats (
    user_id,
    stat_date,
    interventions_received,
    questions_ignored,
    questions_answered,
    adjusted_probability,
    last_intervention_at
  )
  VALUES (
    p_user_id,
    CURRENT_DATE,
    CASE WHEN p_increment_interventions THEN 1 ELSE 0 END,
    CASE WHEN p_increment_ignored THEN 1 ELSE 0 END,
    CASE WHEN p_increment_answered THEN 1 ELSE 0 END,
    COALESCE(p_new_probability, 0.4),
    CASE WHEN p_increment_interventions THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id, stat_date) DO UPDATE SET
    interventions_received = nfc_chat_ia_user_stats.interventions_received +
      CASE WHEN p_increment_interventions THEN 1 ELSE 0 END,
    questions_ignored = nfc_chat_ia_user_stats.questions_ignored +
      CASE WHEN p_increment_ignored THEN 1 ELSE 0 END,
    questions_answered = nfc_chat_ia_user_stats.questions_answered +
      CASE WHEN p_increment_answered THEN 1 ELSE 0 END,
    adjusted_probability = COALESCE(p_new_probability, nfc_chat_ia_user_stats.adjusted_probability),
    last_intervention_at = CASE
      WHEN p_increment_interventions THEN NOW()
      ELSE nfc_chat_ia_user_stats.last_intervention_at
    END;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies (se necessario)
-- ALTER TABLE nfc_chat_ia_interventions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE nfc_chat_ia_user_stats ENABLE ROW LEVEL SECURITY;
