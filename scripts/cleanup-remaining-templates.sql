-- ═══════════════════════════════════════════════════════════════
-- LIMPEZA FINAL - Remove posts que NÃO começam com **título**
-- Todos os posts realistas do seed usam formato **Título**\n\nConteúdo
-- Posts sem esse formato são sobras do template antigo
-- Execute no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_deleted_comments INT := 0;
  v_deleted_posts INT := 0;
  v_arena_id TEXT;
  v_post_count INT;
  v_comment_count INT;
BEGIN

  -- 1. Deletar comentários dos posts template (sem **)
  DELETE FROM "Comment"
  WHERE "postId" IN (
    SELECT p.id FROM "Post" p
    JOIN "Arena" a ON p."arenaId" = a.id
    WHERE p.content NOT LIKE '**%'
    AND a."isActive" = true
    -- Apenas posts de mock users (não deletar posts reais de usuários)
    AND p."userId" IN (
      SELECT id FROM "User" WHERE email LIKE '%@mock.com'
    )
  );
  GET DIAGNOSTICS v_deleted_comments = ROW_COUNT;
  RAISE NOTICE 'Comentários removidos: %', v_deleted_comments;

  -- 2. Deletar posts template (sem **)
  DELETE FROM "Post"
  WHERE content NOT LIKE '**%'
  AND "arenaId" IN (SELECT id FROM "Arena" WHERE "isActive" = true)
  AND "userId" IN (
    SELECT id FROM "User" WHERE email LIKE '%@mock.com'
  );
  GET DIAGNOSTICS v_deleted_posts = ROW_COUNT;
  RAISE NOTICE 'Posts removidos: %', v_deleted_posts;

  -- 3. Atualizar contadores de todas as arenas
  FOR v_arena_id IN SELECT id FROM "Arena" WHERE "isActive" = true
  LOOP
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;
  END LOOP;

  RAISE NOTICE 'Limpeza completa! Posts: %, Comentários: %', v_deleted_posts, v_deleted_comments;
END $$;

-- Verificar resultado
SELECT a.slug, a.name, a."totalPosts", a."totalComments"
FROM "Arena" a
WHERE a."isActive" = true AND a."totalPosts" > 0
ORDER BY a."totalPosts" DESC;
