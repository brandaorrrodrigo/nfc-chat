-- ============================================
-- DESABILITAR RLS TEMPORARIAMENTE (APENAS PARA TESTE)
-- ============================================
-- ATENÇÃO: Isso deixa as tabelas públicas!
-- Use apenas em ambiente de desenvolvimento
-- ============================================

-- Desabilitar RLS em todas as tabelas principais
ALTER TABLE "Arena" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ArenaTag" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "VideoAnalysis" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "FPTransaction" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "FPRule" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "UserBadge" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "AIMetadata" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ArenaFounder" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ModerationQueue" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "ModerationAction" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "SpamFilter" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" DISABLE ROW LEVEL SECURITY;

-- Verificar
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

SELECT '✅ RLS desabilitado! Agora a API deve funcionar.' as message;
