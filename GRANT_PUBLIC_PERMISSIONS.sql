-- ============================================
-- DAR PERMISSÕES PÚBLICAS (APENAS PARA TESTE)
-- ============================================
-- ATENÇÃO: Isso é apenas para desenvolvimento!
-- Em produção, use RLS apropriado
-- ============================================

-- Dar todas as permissões para anon e authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Garantir que futuras tabelas também terão permissão
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- Verificar permissões
SELECT
  tablename,
  tableowner,
  hasindexes,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

SELECT '✅ Permissões concedidas para anon e authenticated!' as message;
