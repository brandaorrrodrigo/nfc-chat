-- =============================================
-- CRIAR TABELAS DO SISTEMA FP (Fitness Points)
-- Execute no Supabase Studio > SQL Editor
-- =============================================

-- Tabela principal de saldo FP
CREATE TABLE IF NOT EXISTS nfc_chat_user_fp (
  user_id TEXT PRIMARY KEY,
  balance INT DEFAULT 0 CHECK (balance >= 0),
  total_earned INT DEFAULT 0 CHECK (total_earned >= 0),
  total_spent INT DEFAULT 0 CHECK (total_spent >= 0),
  streak_current INT DEFAULT 0 CHECK (streak_current >= 0),
  streak_best INT DEFAULT 0 CHECK (streak_best >= 0),
  streak_30_claimed BOOLEAN DEFAULT false,
  last_activity_at TIMESTAMPTZ,
  last_daily_bonus_at DATE,
  fp_earned_today INT DEFAULT 0 CHECK (fp_earned_today >= 0),
  last_message_fp_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de histórico de transações
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

-- Confirma criação
SELECT 'Tabelas FP criadas com sucesso!' as status;
