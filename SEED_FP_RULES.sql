-- ============================================
-- POPULAR REGRAS DE FP NO BANCO
-- ============================================
-- Insere todas as regras de gamificação de FP
-- ============================================

-- Limpar regras existentes (opcional - comentar se não quiser resetar)
-- DELETE FROM "FPRule";

-- ========================================
-- CRIAÇÃO DE CONTEÚDO
-- ========================================

INSERT INTO "FPRule" (id, action, fpValue, dailyCap, cooldown, isActive)
VALUES
  ('fp_rule_post_created', 'POST_CREATED', 10, 50, 30, true),
  ('fp_rule_post_quality', 'POST_QUALITY_BONUS', 15, NULL, NULL, true),
  ('fp_rule_comment', 'COMMENT_CREATED', 5, 50, 10, true),
  ('fp_rule_comment_helpful', 'COMMENT_HELPFUL', 10, NULL, NULL, true),
  ('fp_rule_reply', 'REPLY_CREATED', 2, 20, 5, true),
  ('fp_rule_best_answer', 'BEST_ANSWER', 20, NULL, NULL, true)
ON CONFLICT (action) DO UPDATE SET
  fpValue = EXCLUDED.fpValue,
  dailyCap = EXCLUDED.dailyCap,
  cooldown = EXCLUDED.cooldown,
  isActive = EXCLUDED.isActive;

-- ========================================
-- ENGAGEMENT
-- ========================================

INSERT INTO "FPRule" (id, action, fpValue, dailyCap, cooldown, isActive)
VALUES
  ('fp_rule_post_liked', 'POST_LIKED', 1, 10, NULL, true),
  ('fp_rule_comment_liked', 'COMMENT_LIKED', 1, 10, NULL, true),
  ('fp_rule_post_shared', 'POST_SHARED', 5, 20, NULL, true)
ON CONFLICT (action) DO UPDATE SET
  fpValue = EXCLUDED.fpValue,
  dailyCap = EXCLUDED.dailyCap,
  isActive = EXCLUDED.isActive;

-- ========================================
-- NFV/BIOMECÂNICA
-- ========================================

INSERT INTO "FPRule" (id, action, fpValue, dailyCap, cooldown, isActive)
VALUES
  ('fp_rule_video_submitted', 'VIDEO_ANALYSIS_SUBMITTED', -25, NULL, NULL, true),
  ('fp_rule_video_approved', 'VIDEO_ANALYSIS_APPROVED', 10, NULL, NULL, true)
ON CONFLICT (action) DO UPDATE SET
  fpValue = EXCLUDED.fpValue,
  isActive = EXCLUDED.isActive;

-- ========================================
-- STREAK E DAILY
-- ========================================

INSERT INTO "FPRule" (id, action, fpValue, dailyCap, cooldown, isActive)
VALUES
  ('fp_rule_daily_login', 'DAILY_LOGIN', 2, 2, NULL, true),
  ('fp_rule_first_post_day', 'FIRST_POST_DAY', 5, 5, NULL, true),
  ('fp_rule_streak_7', 'STREAK_BONUS_7', 20, NULL, NULL, true),
  ('fp_rule_streak_30', 'STREAK_BONUS_30', 50, NULL, NULL, true),
  ('fp_rule_streak_90', 'STREAK_BONUS_90', 100, NULL, NULL, true),
  ('fp_rule_streak_365', 'STREAK_BONUS_365', 500, NULL, NULL, true)
ON CONFLICT (action) DO UPDATE SET
  fpValue = EXCLUDED.fpValue,
  dailyCap = EXCLUDED.dailyCap,
  isActive = EXCLUDED.isActive;

-- ========================================
-- PENALIDADES
-- ========================================

INSERT INTO "FPRule" (id, action, fpValue, dailyCap, cooldown, isActive)
VALUES
  ('fp_rule_spam', 'SPAM_PENALTY', -5, NULL, NULL, true),
  ('fp_rule_low_quality', 'LOW_QUALITY_PENALTY', -3, NULL, NULL, true),
  ('fp_rule_reported', 'REPORTED_CONTENT_PENALTY', -10, NULL, NULL, true),
  ('fp_rule_violation', 'VIOLATION_PENALTY', -50, NULL, NULL, true)
ON CONFLICT (action) DO UPDATE SET
  fpValue = EXCLUDED.fpValue,
  isActive = EXCLUDED.isActive;

-- ========================================
-- CONQUISTAS
-- ========================================

INSERT INTO "FPRule" (id, action, fpValue, dailyCap, cooldown, isActive)
VALUES
  ('fp_rule_badge_earned', 'BADGE_EARNED', 10, NULL, NULL, true),
  ('fp_rule_milestone', 'MILESTONE_REACHED', 25, NULL, NULL, true)
ON CONFLICT (action) DO UPDATE SET
  fpValue = EXCLUDED.fpValue,
  isActive = EXCLUDED.isActive;

-- ========================================
-- OUTROS
-- ========================================

INSERT INTO "FPRule" (id, action, fpValue, dailyCap, cooldown, isActive)
VALUES
  ('fp_rule_fp_to_discount', 'FP_TO_DISCOUNT', 0, NULL, NULL, true),
  ('fp_rule_manual_adj', 'FP_MANUAL_ADJUSTMENT', 0, NULL, NULL, true)
ON CONFLICT (action) DO UPDATE SET
  isActive = EXCLUDED.isActive;

-- ========================================
-- VERIFICAR REGRAS INSERIDAS
-- ========================================

SELECT
  action,
  fpValue,
  dailyCap,
  cooldown,
  isActive
FROM "FPRule"
ORDER BY
  CASE
    WHEN action LIKE '%CREATED%' THEN 1
    WHEN action LIKE '%LIKED%' THEN 2
    WHEN action LIKE '%VIDEO%' THEN 3
    WHEN action LIKE '%STREAK%' THEN 4
    WHEN action LIKE '%PENALTY%' THEN 5
    ELSE 6
  END,
  action;

SELECT '✅ Regras de FP inseridas com sucesso!' as message;
SELECT COUNT(*) || ' regras ativas' as total FROM "FPRule" WHERE isActive = true;
