-- ==========================================
-- Community Health System - NutriFitCoach
-- Tabelas para monitoramento de saúde e webhooks
-- ==========================================

-- ==========================================
-- Tabela: nfc_community_webhooks
-- Registra webhooks configurados por comunidade
-- ==========================================

CREATE TABLE IF NOT EXISTS nfc_community_webhooks (
  id TEXT PRIMARY KEY,
  community_slug TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,                              -- Para validação HMAC
  events TEXT[] NOT NULL,                   -- Array de eventos inscritos
  is_active BOOLEAN DEFAULT TRUE,
  failure_count INT DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  last_response_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para buscar webhooks de uma comunidade
CREATE INDEX IF NOT EXISTS idx_webhooks_community
  ON nfc_community_webhooks(community_slug);

-- Index para webhooks ativos
CREATE INDEX IF NOT EXISTS idx_webhooks_active
  ON nfc_community_webhooks(is_active) WHERE is_active = TRUE;

-- ==========================================
-- Tabela: nfc_community_health_snapshots
-- Armazena snapshots de saúde para histórico
-- ==========================================

CREATE TABLE IF NOT EXISTS nfc_community_health_snapshots (
  id TEXT PRIMARY KEY,
  community_slug TEXT NOT NULL,
  period TEXT NOT NULL,                     -- 'day', 'week', 'month'
  calculated_at TIMESTAMPTZ NOT NULL,

  -- Scores
  overall_score INT NOT NULL,
  overall_status TEXT NOT NULL,             -- 'excellent', 'good', 'moderate', 'concerning', 'critical'
  engagement_score INT,
  sentiment_score INT,
  growth_score INT,
  quality_score INT,

  -- Métricas de Engajamento
  total_messages INT DEFAULT 0,
  unique_users INT DEFAULT 0,
  reactions_given INT DEFAULT 0,
  questions_asked INT DEFAULT 0,
  questions_answered INT DEFAULT 0,

  -- Métricas de Sentimento
  sentiment_positive INT DEFAULT 0,
  sentiment_neutral INT DEFAULT 0,
  sentiment_negative INT DEFAULT 0,
  sentiment_avg_score FLOAT DEFAULT 0,

  -- Métricas de Crescimento
  new_users INT DEFAULT 0,
  returning_users INT DEFAULT 0,
  churned_users INT DEFAULT 0,
  retention_rate FLOAT DEFAULT 0,

  -- Métricas de Qualidade
  avg_message_length INT DEFAULT 0,
  long_messages INT DEFAULT 0,
  fp_awarded INT DEFAULT 0,
  badges_unlocked INT DEFAULT 0,
  ia_interventions INT DEFAULT 0,

  -- Alertas (JSON)
  alerts JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para buscar histórico de uma comunidade
CREATE INDEX IF NOT EXISTS idx_health_community_date
  ON nfc_community_health_snapshots(community_slug, calculated_at DESC);

-- Index para buscar por período
CREATE INDEX IF NOT EXISTS idx_health_period
  ON nfc_community_health_snapshots(period, calculated_at DESC);

-- ==========================================
-- Tabela: nfc_webhook_logs
-- Log de envios de webhook para debugging
-- ==========================================

CREATE TABLE IF NOT EXISTS nfc_webhook_logs (
  id TEXT PRIMARY KEY,
  webhook_id TEXT NOT NULL,
  event TEXT NOT NULL,
  payload JSONB,
  success BOOLEAN NOT NULL,
  status_code INT,
  error_message TEXT,
  response_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para buscar logs de um webhook
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook
  ON nfc_webhook_logs(webhook_id, created_at DESC);

-- Index para buscar falhas
CREATE INDEX IF NOT EXISTS idx_webhook_logs_failures
  ON nfc_webhook_logs(success) WHERE success = FALSE;

-- Limitar tamanho dos logs (manter últimos 7 dias)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM nfc_webhook_logs
  WHERE created_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- View: Resumo de saúde por comunidade
-- ==========================================

CREATE OR REPLACE VIEW v_community_health_summary AS
SELECT
  community_slug,
  overall_status,
  overall_score,
  total_messages,
  unique_users,
  sentiment_avg_score,
  retention_rate,
  calculated_at
FROM nfc_community_health_snapshots
WHERE period = 'day'
  AND calculated_at >= NOW() - INTERVAL '24 hours'
ORDER BY calculated_at DESC;

-- ==========================================
-- View: Webhooks ativos com stats
-- ==========================================

CREATE OR REPLACE VIEW v_active_webhooks AS
SELECT
  w.id,
  w.community_slug,
  w.url,
  w.events,
  w.failure_count,
  w.last_triggered_at,
  w.last_response_time_ms,
  (SELECT COUNT(*) FROM nfc_webhook_logs l WHERE l.webhook_id = w.id AND l.success = TRUE) as successful_sends,
  (SELECT COUNT(*) FROM nfc_webhook_logs l WHERE l.webhook_id = w.id AND l.success = FALSE) as failed_sends
FROM nfc_community_webhooks w
WHERE w.is_active = TRUE
ORDER BY w.created_at DESC;

-- ==========================================
-- Trigger: Atualizar updated_at em webhooks
-- ==========================================

CREATE OR REPLACE FUNCTION update_webhook_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_webhook_updated_at ON nfc_community_webhooks;
CREATE TRIGGER trigger_webhook_updated_at
  BEFORE UPDATE ON nfc_community_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_timestamp();
