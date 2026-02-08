-- ═══════════════════════════════════════════════════════════════
-- LIMPEZA DE POSTS DUPLICADOS/GENÉRICOS
-- Remove posts com conteúdo template repetido, mantendo os realistas
-- Execute no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- PASSO 1: Identificar e deletar posts com conteúdo genérico/template
-- Esses são posts gerados pelo seed-arenas-completo.ts que usa templates

DO $$
DECLARE
  v_deleted_comments INT := 0;
  v_deleted_posts INT := 0;
  v_arena_id TEXT;
  v_post_count INT;
  v_comment_count INT;
BEGIN

  -- Deletar comentários dos posts genéricos primeiro (FK constraint)
  DELETE FROM "Comment"
  WHERE "postId" IN (
    SELECT id FROM "Post"
    WHERE content IN (
      -- Templates genéricos que aparecem repetidos
      SELECT content FROM "Post"
      GROUP BY content
      HAVING COUNT(*) > 1
    )
    -- NÃO deletar posts que contêm títulos em bold (são os realistas com **)
    AND content NOT LIKE '**%'
  );
  GET DIAGNOSTICS v_deleted_comments = ROW_COUNT;
  RAISE NOTICE 'Comentários de posts genéricos deletados: %', v_deleted_comments;

  -- Deletar os posts genéricos (conteúdo duplicado)
  DELETE FROM "Post"
  WHERE content IN (
    SELECT content FROM "Post"
    GROUP BY content
    HAVING COUNT(*) > 1
  )
  AND content NOT LIKE '**%';
  GET DIAGNOSTICS v_deleted_posts = ROW_COUNT;
  RAISE NOTICE 'Posts genéricos deletados: %', v_deleted_posts;

  -- Também deletar posts com conteúdo template conhecido
  -- (podem não ser duplicados exatos mas são genéricos)
  DELETE FROM "Comment"
  WHERE "postId" IN (
    SELECT id FROM "Post"
    WHERE (
      content LIKE '%Interessante seu relato. Na literatura%'
      OR content LIKE '%Essa é uma dúvida recorrente e com boa razão%'
      OR content LIKE '%Entendo sua preocupação. Esse tipo de dúvida%'
      OR content LIKE '%Pelo seu relato, parece que você está no caminho certo%'
      OR content LIKE '%Ótima pergunta! Vamos analisar isso por partes%'
      OR content LIKE '%Agradeço por compartilhar sua experiência%'
      OR content LIKE '%Vamos pensar nisso de forma prática%'
      OR content LIKE '%Li que isso pode ser contraproducente%'
      OR content LIKE '%Qual a frequência ideal para ver resultados%'
      OR content LIKE '%Tenho sentido desconforto ao fazer esse movimento%'
      OR content LIKE '%Será que estou fazendo da forma correta%'
      OR content LIKE '%Devo priorizar volume ou carga nessa fase%'
      OR content LIKE '%Quando sei que é hora de aumentar a dificuldade%'
      OR content LIKE '%Comecei recentemente e estou com dúvidas%'
      OR content LIKE '%Isso funciona melhor em jejum ou alimentado%'
      OR content LIKE '%Qual a relação entre frequência e intensidade%'
      OR content LIKE '%Estou há 2 meses sem progressão%'
      OR content LIKE '%Tenho limitação de mobilidade. Como adaptar%'
      OR content LIKE '%Percebi uma diferença entre um lado e outro%'
      OR content LIKE '%Meu treino está focado nisso mas não vejo%'
      OR content LIKE '%Vi que existem várias escolas de pensamento%'
      OR content LIKE '%Qual o papel da genética nisso tudo%'
      OR content LIKE '%Isso vale para qualquer idade ou tem restrições%'
      OR content LIKE '%Devo fazer todos os dias ou intercalar%'
      OR content LIKE '%Quanto tempo leva em média para adaptar%'
      OR content LIKE '%Alguém já teve experiência com essa abordagem%'
      OR content LIKE '%Como saber se estou exagerando ou sendo muito%'
      OR content LIKE '%Entendo sua frustração. Plateaus são normais%'
    )
    AND content NOT LIKE '**%'
  );
  GET DIAGNOSTICS v_deleted_comments = ROW_COUNT;
  RAISE NOTICE 'Comentários de templates deletados: %', v_deleted_comments;

  DELETE FROM "Post"
  WHERE (
    content LIKE '%Interessante seu relato. Na literatura%'
    OR content LIKE '%Essa é uma dúvida recorrente e com boa razão%'
    OR content LIKE '%Entendo sua preocupação. Esse tipo de dúvida%'
    OR content LIKE '%Pelo seu relato, parece que você está no caminho certo%'
    OR content LIKE '%Ótima pergunta! Vamos analisar isso por partes%'
    OR content LIKE '%Agradeço por compartilhar sua experiência%'
    OR content LIKE '%Vamos pensar nisso de forma prática%'
    OR content LIKE '%Li que isso pode ser contraproducente%'
    OR content LIKE '%Qual a frequência ideal para ver resultados%'
    OR content LIKE '%Tenho sentido desconforto ao fazer esse movimento%'
    OR content LIKE '%Será que estou fazendo da forma correta%'
    OR content LIKE '%Devo priorizar volume ou carga nessa fase%'
    OR content LIKE '%Quando sei que é hora de aumentar a dificuldade%'
    OR content LIKE '%Comecei recentemente e estou com dúvidas%'
    OR content LIKE '%Isso funciona melhor em jejum ou alimentado%'
    OR content LIKE '%Qual a relação entre frequência e intensidade%'
    OR content LIKE '%Estou há 2 meses sem progressão%'
    OR content LIKE '%Tenho limitação de mobilidade. Como adaptar%'
    OR content LIKE '%Percebi uma diferença entre um lado e outro%'
    OR content LIKE '%Meu treino está focado nisso mas não vejo%'
    OR content LIKE '%Vi que existem várias escolas de pensamento%'
    OR content LIKE '%Qual o papel da genética nisso tudo%'
    OR content LIKE '%Isso vale para qualquer idade ou tem restrições%'
    OR content LIKE '%Devo fazer todos os dias ou intercalar%'
    OR content LIKE '%Quanto tempo leva em média para adaptar%'
    OR content LIKE '%Alguém já teve experiência com essa abordagem%'
    OR content LIKE '%Como saber se estou exagerando ou sendo muito%'
    OR content LIKE '%Entendo sua frustração. Plateaus são normais%'
  )
  AND content NOT LIKE '**%';
  GET DIAGNOSTICS v_deleted_posts = ROW_COUNT;
  RAISE NOTICE 'Posts template deletados: %', v_deleted_posts;

  -- PASSO 2: Atualizar contadores de todas as arenas ativas
  FOR v_arena_id IN SELECT id FROM "Arena" WHERE "isActive" = true
  LOOP
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;
  END LOOP;

  RAISE NOTICE 'Contadores de arenas atualizados!';
END $$;

-- PASSO 3: Verificar resultado
SELECT a.slug, a.name, a."totalPosts", a."totalComments"
FROM "Arena" a
WHERE a."isActive" = true
ORDER BY a."totalPosts" DESC;
