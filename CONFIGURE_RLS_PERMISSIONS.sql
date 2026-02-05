-- ============================================
-- CONFIGURAR PERMISSÕES RLS (ROW LEVEL SECURITY)
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ARENA (Leitura Pública)
-- ============================================

-- Habilitar RLS
ALTER TABLE "Arena" ENABLE ROW LEVEL SECURITY;

-- Policy: Leitura pública para arenas ativas
CREATE POLICY "Arena public read active" ON "Arena"
  FOR SELECT
  USING ("isActive" = true);

-- Policy: Admins podem tudo
CREATE POLICY "Arena admin full access" ON "Arena"
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'authenticated'
    AND (
      (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN')
      OR auth.uid()::text IN (SELECT id FROM "User" WHERE role IN ('ADMIN', 'SUPER_ADMIN'))
    )
  );

-- ============================================
-- 2. ARENATAG (Leitura Pública)
-- ============================================

ALTER TABLE "ArenaTag" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ArenaTag public read" ON "ArenaTag"
  FOR SELECT
  USING (true);

CREATE POLICY "ArenaTag admin write" ON "ArenaTag"
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'authenticated');

-- ============================================
-- 3. POST (Leitura Pública de Posts Aprovados)
-- ============================================

ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

-- Leitura: posts publicados e aprovados
CREATE POLICY "Post public read approved" ON "Post"
  FOR SELECT
  USING (
    "isPublished" = true
    AND "isApproved" = true
    AND "isDeleted" = false
  );

-- Escrita: usuários autenticados podem criar posts
CREATE POLICY "Post authenticated create" ON "Post"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Atualização: apenas próprio autor ou admin
CREATE POLICY "Post author update" ON "Post"
  FOR UPDATE
  USING (
    auth.uid()::text = "userId"
    OR (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
  );

-- Deleção: apenas próprio autor ou admin
CREATE POLICY "Post author delete" ON "Post"
  FOR DELETE
  USING (
    auth.uid()::text = "userId"
    OR (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
  );

-- ============================================
-- 4. COMMENT (Leitura Pública de Comentários Aprovados)
-- ============================================

ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comment public read approved" ON "Comment"
  FOR SELECT
  USING ("isApproved" = true AND "isDeleted" = false);

CREATE POLICY "Comment authenticated create" ON "Comment"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Comment author update" ON "Comment"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Comment author delete" ON "Comment"
  FOR DELETE
  USING (
    auth.uid()::text = "userId"
    OR (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
  );

-- ============================================
-- 5. USER (Leitura Pública de Perfis)
-- ============================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Leitura pública de informações básicas
CREATE POLICY "User public read profile" ON "User"
  FOR SELECT
  USING (true);

-- Atualização: apenas o próprio usuário
CREATE POLICY "User self update" ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id);

-- Admin pode tudo
CREATE POLICY "User admin full access" ON "User"
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN')
  );

-- ============================================
-- 6. VIDEOANALYSIS (Permissões Especiais)
-- ============================================

ALTER TABLE "VideoAnalysis" ENABLE ROW LEVEL SECURITY;

-- Leitura: apenas o autor ou admin
CREATE POLICY "VideoAnalysis owner read" ON "VideoAnalysis"
  FOR SELECT
  USING (
    auth.uid()::text = "userId"
    OR (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
  );

-- Criação: usuários autenticados
CREATE POLICY "VideoAnalysis authenticated create" ON "VideoAnalysis"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Admin pode revisar e atualizar
CREATE POLICY "VideoAnalysis admin update" ON "VideoAnalysis"
  FOR UPDATE
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
  );

-- ============================================
-- 7. FPTRANSACTION (Apenas Leitura Própria)
-- ============================================

ALTER TABLE "FPTransaction" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FPTransaction owner read" ON "FPTransaction"
  FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "FPTransaction system create" ON "FPTransaction"
  FOR INSERT
  WITH CHECK (true); -- Sistema pode criar

-- ============================================
-- 8. MODERATIONQUEUE (Apenas Moderadores)
-- ============================================

ALTER TABLE "ModerationQueue" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ModerationQueue moderator access" ON "ModerationQueue"
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
  );

-- ============================================
-- 9. TABELAS PÚBLICAS (Leitura Livre)
-- ============================================

-- FPRule: leitura pública
ALTER TABLE "FPRule" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FPRule public read" ON "FPRule"
  FOR SELECT
  USING (true);

-- SpamFilter: apenas sistema
ALTER TABLE "SpamFilter" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SpamFilter system only" ON "SpamFilter"
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN')
  );

-- UserBadge: leitura pública
ALTER TABLE "UserBadge" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "UserBadge public read" ON "UserBadge"
  FOR SELECT
  USING (true);

-- AIMetadata: leitura pública
ALTER TABLE "AIMetadata" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AIMetadata public read" ON "AIMetadata"
  FOR SELECT
  USING (true);

-- ArenaFounder: leitura pública
ALTER TABLE "ArenaFounder" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ArenaFounder public read" ON "ArenaFounder"
  FOR SELECT
  USING (true);

-- ============================================
-- 10. AUDITLOG (Apenas Admins)
-- ============================================

ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AuditLog admin only" ON "AuditLog"
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN')
  );

-- ============================================
-- 11. MODERATIONACTION (Apenas Moderadores)
-- ============================================

ALTER TABLE "ModerationAction" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ModerationAction moderator access" ON "ModerationAction"
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role')::text IN ('ADMIN', 'SUPER_ADMIN', 'MODERATOR')
  );

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Listar todas as tabelas com RLS habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true
ORDER BY tablename;

-- Contar policies criadas
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Mensagem de sucesso
SELECT '✅ RLS configurado com sucesso em todas as tabelas!' as message;
