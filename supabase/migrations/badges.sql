-- ==========================================
-- Sistema de Badges - NutriFitCoach
-- Armazena badges desbloqueadas pelos usuarios
-- ==========================================

-- Tabela: nfc_user_badges
-- Registra cada badge desbloqueada por usuario
CREATE TABLE IF NOT EXISTS nfc_user_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  fp_rewarded INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Evitar duplicatas: usuario so pode ter uma badge de cada tipo
  UNIQUE(user_id, badge_id)
);

-- Index para buscar badges do usuario
CREATE INDEX IF NOT EXISTS idx_user_badges_user
  ON nfc_user_badges(user_id);

-- Index para buscar por badge especifica
CREATE INDEX IF NOT EXISTS idx_user_badges_badge
  ON nfc_user_badges(badge_id);

-- Index para listar desbloqueios recentes
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked
  ON nfc_user_badges(unlocked_at DESC);

-- ==========================================
-- View: Ranking de badges por usuario
-- ==========================================
CREATE OR REPLACE VIEW v_user_badge_stats AS
SELECT
  user_id,
  COUNT(*) as total_badges,
  SUM(fp_rewarded) as total_fp_from_badges,
  MIN(unlocked_at) as first_badge_at,
  MAX(unlocked_at) as last_badge_at
FROM nfc_user_badges
GROUP BY user_id
ORDER BY total_badges DESC;

-- ==========================================
-- View: Badges mais populares
-- ==========================================
CREATE OR REPLACE VIEW v_badge_popularity AS
SELECT
  badge_id,
  COUNT(*) as times_unlocked,
  MIN(unlocked_at) as first_unlock,
  MAX(unlocked_at) as last_unlock
FROM nfc_user_badges
GROUP BY badge_id
ORDER BY times_unlocked DESC;

-- ==========================================
-- Funcao: Limpar badges de usuarios inativos (180+ dias)
-- ==========================================
CREATE OR REPLACE FUNCTION cleanup_inactive_badges()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Nao deletamos badges, apenas registramos usuarios inativos
  -- Badges sao permanentes uma vez desbloqueadas
  RETURN 0;
END;
$$ LANGUAGE plpgsql;
