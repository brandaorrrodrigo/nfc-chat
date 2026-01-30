-- =============================================
-- SCHEMA: Sistema de FP - NutriFitCoach CHAT
-- Execute no Supabase (PostgreSQL)
--
-- PREFIXO: nfc_chat_ (separa das tabelas do APP)
-- Tabelas existentes: nfc_chat_messages
-- =============================================

-- Tabela principal de saldo FP
CREATE TABLE IF NOT EXISTS nfc_chat_user_fp (
  user_id TEXT PRIMARY KEY,
  balance INT DEFAULT 0 CHECK (balance >= 0),
  total_earned INT DEFAULT 0 CHECK (total_earned >= 0),
  total_spent INT DEFAULT 0 CHECK (total_spent >= 0),
  streak_current INT DEFAULT 0 CHECK (streak_current >= 0),
  streak_best INT DEFAULT 0 CHECK (streak_best >= 0),
  last_activity_at TIMESTAMPTZ,
  last_daily_bonus_at DATE,
  fp_earned_today INT DEFAULT 0 CHECK (fp_earned_today >= 0),
  last_message_fp_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de histórico de transações (auditoria)
CREATE TABLE IF NOT EXISTS nfc_chat_fp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  amount INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'spend')),
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_nfc_chat_fp_trans_user ON nfc_chat_fp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_fp_trans_created ON nfc_chat_fp_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_fp_trans_action ON nfc_chat_fp_transactions(action);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_user_fp_balance ON nfc_chat_user_fp(balance DESC);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_user_fp_streak ON nfc_chat_user_fp(streak_current DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION nfc_chat_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS nfc_chat_user_fp_updated_at ON nfc_chat_user_fp;
CREATE TRIGGER nfc_chat_user_fp_updated_at
  BEFORE UPDATE ON nfc_chat_user_fp
  FOR EACH ROW
  EXECUTE FUNCTION nfc_chat_update_updated_at();

-- Função para reset diário do fp_earned_today (opcional - pode ser via cron)
CREATE OR REPLACE FUNCTION nfc_chat_reset_daily_fp()
RETURNS void AS $$
BEGIN
  UPDATE nfc_chat_user_fp
  SET fp_earned_today = 0
  WHERE DATE(last_activity_at) < CURRENT_DATE;
END;
$$ language 'plpgsql';

-- View para leaderboard (top usuários por FP)
CREATE OR REPLACE VIEW nfc_chat_fp_leaderboard AS
SELECT
  user_id,
  balance,
  streak_current,
  streak_best,
  total_earned,
  RANK() OVER (ORDER BY balance DESC) as rank_balance,
  RANK() OVER (ORDER BY streak_current DESC) as rank_streak
FROM nfc_chat_user_fp
WHERE balance > 0
ORDER BY balance DESC;

-- =============================================
-- RESUMO DAS TABELAS DO CHAT:
-- =============================================
-- nfc_chat_messages        (já existe)
-- nfc_chat_user_fp         (saldo FP)
-- nfc_chat_fp_transactions (histórico)
-- nfc_chat_fp_leaderboard  (view ranking)
-- =============================================

-- Confirma criação
SELECT 'Tabelas nfc_chat_user_fp e nfc_chat_fp_transactions criadas!' as status;
