-- ═══════════════════════════════════════════════════════════════
-- SUBSTITUIR AVATARES POR INICIAIS (ESTILO GOOGLE)
-- Remove imagens repetidas e usa apenas iniciais coloridas
-- ═══════════════════════════════════════════════════════════════

-- Paleta de 20 cores vibrantes (mesmo do Google)
CREATE TEMP TABLE color_palette AS
SELECT * FROM (VALUES
  ('#FF6B9D'), -- Rosa
  ('#E91E63'), -- Pink
  ('#9C27B0'), -- Roxo
  ('#673AB7'), -- Roxo escuro
  ('#3F51B5'), -- Indigo
  ('#2196F3'), -- Azul
  ('#00BCD4'), -- Ciano
  ('#009688'), -- Teal
  ('#4CAF50'), -- Verde
  ('#8BC34A'), -- Verde claro
  ('#CDDC39'), -- Lima
  ('#FFC107'), -- Âmbar
  ('#FF9800'), -- Laranja
  ('#FF5722'), -- Laranja escuro
  ('#795548'), -- Marrom
  ('#607D8B'), -- Cinza azulado
  ('#0D47A1'), -- Azul escuro
  ('#1B5E20'), -- Verde escuro
  ('#388E3C'), -- Verde médio
  ('#F57C00')  -- Laranja médio
) AS t(color);

-- Função para gerar cor baseada no nome (determinística)
CREATE OR REPLACE FUNCTION get_color_for_name(user_name TEXT)
RETURNS TEXT AS $$
DECLARE
  name_hash BIGINT;
  color_count INT;
  color_index INT;
  selected_color TEXT;
BEGIN
  -- Hash simples do nome
  name_hash := hashtext(user_name);

  -- Total de cores disponíveis
  SELECT COUNT(*) INTO color_count FROM color_palette;

  -- Índice baseado no hash (sempre o mesmo para o mesmo nome)
  color_index := (ABS(name_hash) % color_count) + 1;

  -- Selecionar cor
  SELECT color INTO selected_color
  FROM color_palette
  OFFSET color_index - 1
  LIMIT 1;

  RETURN selected_color;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════
-- ATUALIZAR POSTS: Remover imagens e adicionar cores
-- ═══════════════════════════════════════════════════════════════

UPDATE "Post" p
SET
  "avatarId" = NULL,
  "avatarImg" = NULL,
  "avatarInitialsColor" = get_color_for_name(u.name)
FROM "User" u
WHERE p."userId" = u.id;

-- ═══════════════════════════════════════════════════════════════
-- ATUALIZAR COMENTÁRIOS: Remover imagens e adicionar cores
-- ═══════════════════════════════════════════════════════════════

UPDATE "Comment" c
SET
  "avatarId" = NULL,
  "avatarImg" = NULL,
  "avatarInitialsColor" = get_color_for_name(u.name)
FROM "User" u
WHERE c."userId" = u.id;

-- ═══════════════════════════════════════════════════════════════
-- VERIFICAR RESULTADOS
-- ═══════════════════════════════════════════════════════════════

-- Contar posts/comentários com cores
SELECT
  'POSTS' as tipo,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE "avatarInitialsColor" IS NOT NULL) as com_cor,
  COUNT(*) FILTER (WHERE "avatarImg" IS NOT NULL) as com_imagem
FROM "Post"

UNION ALL

SELECT
  'COMMENTS',
  COUNT(*),
  COUNT(*) FILTER (WHERE "avatarInitialsColor" IS NOT NULL),
  COUNT(*) FILTER (WHERE "avatarImg" IS NOT NULL)
FROM "Comment";

-- Exemplos de cores atribuídas (top 10 usuários)
SELECT
  u.name as usuario,
  p."avatarInitialsColor" as cor,
  COUNT(*) as posts
FROM "Post" p
JOIN "User" u ON p."userId" = u.id
WHERE p."avatarInitialsColor" IS NOT NULL
GROUP BY u.name, p."avatarInitialsColor"
ORDER BY posts DESC
LIMIT 10;

-- Limpar função temporária
DROP FUNCTION IF EXISTS get_color_for_name(TEXT);

-- ═══════════════════════════════════════════════════════════════
-- RESULTADO ESPERADO
-- ═══════════════════════════════════════════════════════════════
-- ✅ avatarImg = NULL (sem imagens)
-- ✅ avatarId = NULL (sem IDs de avatar)
-- ✅ avatarInitialsColor = cor única por usuário
--
-- Cada usuário terá sempre a mesma cor baseada no seu nome.
-- O frontend AvatarDisplay já mostra iniciais quando avatarImg é NULL.
-- ═══════════════════════════════════════════════════════════════
