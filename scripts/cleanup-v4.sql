DO $$
DECLARE
  v_del_comments INT;
  v_del_posts INT;
BEGIN
  -- Deletar comentários de posts sem **
  DELETE FROM "Comment"
  WHERE "postId" IN (
    SELECT p.id FROM "Post" p
    JOIN "Arena" a ON p."arenaId" = a.id
    WHERE p.content NOT LIKE '**%'
    AND a."isActive" = true
  );
  GET DIAGNOSTICS v_del_comments = ROW_COUNT;

  -- Deletar posts sem **
  DELETE FROM "Post"
  WHERE id IN (
    SELECT p.id FROM "Post" p
    JOIN "Arena" a ON p."arenaId" = a.id
    WHERE p.content NOT LIKE '**%'
    AND a."isActive" = true
  );
  GET DIAGNOSTICS v_del_posts = ROW_COUNT;

  -- Atualizar contadores
  UPDATE "Arena" a SET
    "totalPosts" = (SELECT COUNT(*) FROM "Post" WHERE "arenaId" = a.id),
    "totalComments" = (SELECT COUNT(*) FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = a.id)
  WHERE a."isActive" = true;

  RAISE NOTICE 'DELETADOS: % posts, % comentarios', v_del_posts, v_del_comments;
END $$;
