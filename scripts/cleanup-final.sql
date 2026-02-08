-- ═══════════════════════════════════════════════════════════════
-- LIMPEZA FINAL DEFINITIVA
-- Remove TODOS os posts que NÃO começam com **título**
-- em arenas que têm posts realistas (com **)
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_deleted_comments INT := 0;
  v_deleted_posts INT := 0;
  v_arena_id TEXT;
  v_post_count INT;
  v_comment_count INT;
BEGIN

  -- Arenas que têm posts realistas = arenas que contêm pelo menos 1 post com **
  -- Nessas arenas, deletar tudo que NÃO começa com **

  -- 1. Deletar comentários primeiro
  DELETE FROM "Comment"
  WHERE "postId" IN (
    SELECT p.id FROM "Post" p
    WHERE p.content NOT LIKE '**%'
    AND p."arenaId" IN (
      -- Apenas arenas que já têm posts realistas
      SELECT DISTINCT "arenaId" FROM "Post" WHERE content LIKE '**%'
    )
  );
  GET DIAGNOSTICS v_deleted_comments = ROW_COUNT;
  RAISE NOTICE 'Comentários removidos: %', v_deleted_comments;

  -- 2. Deletar posts
  DELETE FROM "Post"
  WHERE content NOT LIKE '**%'
  AND "arenaId" IN (
    SELECT DISTINCT "arenaId" FROM "Post" WHERE content LIKE '**%'
  );
  GET DIAGNOSTICS v_deleted_posts = ROW_COUNT;
  RAISE NOTICE 'Posts removidos: %', v_deleted_posts;

  -- 3. Atualizar contadores
  FOR v_arena_id IN SELECT id FROM "Arena" WHERE "isActive" = true
  LOOP
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;
  END LOOP;

  RAISE NOTICE 'Limpeza final! Posts: %, Comentários: %', v_deleted_posts, v_deleted_comments;
END $$;

-- Verificar
SELECT a.slug, a.name, a."totalPosts", a."totalComments"
FROM "Arena" a
WHERE a."isActive" = true AND a."totalPosts" > 0
ORDER BY a."totalPosts" DESC;
