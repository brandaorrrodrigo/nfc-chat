-- Verificar distribuição de avatares nas arenas e posts
SELECT 
  'Arenas' as tipo,
  COUNT(*) as total,
  COUNT(DISTINCT "avatarId") as avatares_unicos,
  COUNT(*) - COUNT(DISTINCT "avatarId") as duplicacoes
FROM "Arena"
WHERE "avatarId" IS NOT NULL

UNION ALL

SELECT 
  'Posts',
  COUNT(*),
  COUNT(DISTINCT "avatarId"),
  COUNT(*) - COUNT(DISTINCT "avatarId")
FROM "Post"
WHERE "avatarId" IS NOT NULL

UNION ALL

SELECT 
  'Comments',
  COUNT(*),
  COUNT(DISTINCT "avatarId"),
  COUNT(*) - COUNT(DISTINCT "avatarId")
FROM "Comment"
WHERE "avatarId" IS NOT NULL;

-- Avatares mais usados (possíveis duplicados)
SELECT 
  "avatarId",
  COUNT(*) as vezes_usado,
  STRING_AGG(DISTINCT id::text, ', ') as arena_ids
FROM "Arena"
WHERE "avatarId" IS NOT NULL
GROUP BY "avatarId"
HAVING COUNT(*) > 1
ORDER BY vezes_usado DESC;
