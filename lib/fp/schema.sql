-- =============================================
-- SCHEMA: Sistema de FP - NutriFitCoach
-- Execute no Supabase (PostgreSQL)
-- =============================================

-- Tabela principal de saldo FP
CREATE TABLE IF NOT EXISTS user_fp (
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
CREATE TABLE IF NOT EXISTS fp_transactions (
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
CREATE INDEX IF NOT EXISTS idx_fp_transactions_user_id ON fp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_fp_transactions_created_at ON fp_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fp_transactions_action ON fp_transactions(action);
CREATE INDEX IF NOT EXISTS idx_user_fp_balance ON user_fp(balance DESC);
CREATE INDEX IF NOT EXISTS idx_user_fp_streak ON user_fp(streak_current DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_fp_updated_at ON user_fp;
CREATE TRIGGER update_user_fp_updated_at
  BEFORE UPDATE ON user_fp
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para reset diário do fp_earned_today (opcional - pode ser via cron)
CREATE OR REPLACE FUNCTION reset_daily_fp_earned()
RETURNS void AS $$
BEGIN
  UPDATE user_fp
  SET fp_earned_today = 0
  WHERE DATE(last_activity_at) < CURRENT_DATE;
END;
$$ language 'plpgsql';

-- View para leaderboard (top usuários por FP)
CREATE OR REPLACE VIEW fp_leaderboard AS
SELECT
  user_id,
  balance,
  streak_current,
  streak_best,
  total_earned,
  RANK() OVER (ORDER BY balance DESC) as rank_balance,
  RANK() OVER (ORDER BY streak_current DESC) as rank_streak
FROM user_fp
WHERE balance > 0
ORDER BY balance DESC;

-- Permissões (ajuste conforme necessário para seu setup Supabase)
-- GRANT SELECT, INSERT, UPDATE ON user_fp TO authenticated;
-- GRANT SELECT, INSERT ON fp_transactions TO authenticated;
-- GRANT SELECT ON fp_leaderboard TO authenticated;

-- =============================================
-- EXEMPLO DE USO:
-- =============================================

-- Inserir usuário novo:
-- INSERT INTO user_fp (user_id) VALUES ('user_123') ON CONFLICT DO NOTHING;

-- Creditar FP:
-- UPDATE user_fp SET balance = balance + 10, total_earned = total_earned + 10 WHERE user_id = 'user_123';
-- INSERT INTO fp_transactions (user_id, amount, type, action, description)
-- VALUES ('user_123', 10, 'earn', 'daily_access', 'Acesso diário');

-- Debitar FP (resgate):
-- UPDATE user_fp SET balance = balance - 100, total_spent = total_spent + 100 WHERE user_id = 'user_123';
-- INSERT INTO fp_transactions (user_id, amount, type, action, description, metadata)
-- VALUES ('user_123', -100, 'spend', 'redeem', 'Resgate: 5% de desconto', '{"discount_percent": 5, "coupon_code": "NFC5-ABC123"}');

-- Top 10 leaderboard:
-- SELECT * FROM fp_leaderboard LIMIT 10;
