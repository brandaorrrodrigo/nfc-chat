-- ========================================
-- CRIAR 6 ARENAS DE BIOMECÂNICA
-- Execute este SQL no Supabase SQL Editor
-- ========================================

-- Limpar arenas antigas se existirem (opcional)
-- DELETE FROM "Arena" WHERE slug IN ('hub-biomecanico', 'analise-agachamento', 'analise-terra', 'analise-supino', 'analise-puxadas', 'analise-elevacao-pelvica');

-- 1. Hub Biomecânico
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "isActive", "isPaused", "allowImages", "allowLinks", "allowVideos",
  "aiPersona", "aiInterventionRate", "aiFrustrationThreshold", "aiCooldown",
  "arenaType", "parentArenaSlug", "requiresFP", "requiresSubscription",
  "movementCategory", "movementPattern", categoria, "criadaPor",
  "totalPosts", "totalComments", "dailyActiveUsers", status,
  "createdAt", "updatedAt"
)
SELECT
  'clz1hub000001'::text, 'hub-biomecanico', 'Hub Biomecânico',
  'Discussão aberta sobre biomecânica, padrões de movimento, cadeia cinética e correção postural. IA especialista em análise de movimento.',
  'Activity', '#8b5cf6', 'biomecanica',
  true, false, true, true, false,
  'BIOMECHANICS_EXPERT', 60, 90, 5,
  'NFV_HUB', NULL, NULL, false,
  NULL, NULL, 'BIOMECANICA_NFV', 'ADMIN',
  245, 0, 22, 'WARM',
  NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Arena" WHERE slug = 'hub-biomecanico');

-- 2. Análise: Agachamento
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "isActive", "isPaused", "allowImages", "allowLinks", "allowVideos",
  "aiPersona", "aiInterventionRate", "aiFrustrationThreshold", "aiCooldown",
  "arenaType", "parentArenaSlug", "requiresFP", "requiresSubscription",
  "movementCategory", "movementPattern", categoria, "criadaPor",
  "totalPosts", "totalComments", "dailyActiveUsers", status,
  "createdAt", "updatedAt"
)
SELECT
  'clz1agac000002'::text, 'analise-agachamento', 'Análise: Agachamento',
  'Envie seu vídeo de agachamento e receba análise biomecânica com IA + revisão profissional. Identifique compensações e melhore sua técnica.',
  'Video', '#8b5cf6', 'biomecanica',
  true, false, true, true, true,
  'BIOMECHANICS_EXPERT', 40, 120, 5,
  'NFV_PREMIUM', 'hub-biomecanico', 25, false,
  'membros-inferiores', 'agachamento', 'BIOMECANICA_NFV', 'ADMIN',
  187, 0, 15, 'WARM',
  NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Arena" WHERE slug = 'analise-agachamento');

-- 3. Análise: Levantamento Terra
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "isActive", "isPaused", "allowImages", "allowLinks", "allowVideos",
  "aiPersona", "aiInterventionRate", "aiFrustrationThreshold", "aiCooldown",
  "arenaType", "parentArenaSlug", "requiresFP", "requiresSubscription",
  "movementCategory", "movementPattern", categoria, "criadaPor",
  "totalPosts", "totalComments", "dailyActiveUsers", status,
  "createdAt", "updatedAt"
)
SELECT
  'clz1terra00003'::text, 'analise-terra', 'Análise: Levantamento Terra',
  'Análise biomecânica do seu terra. IA identifica posição da coluna, ativação de posteriores e padrão de hip hinge.',
  'Video', '#f59e0b', 'biomecanica',
  true, false, true, true, true,
  'BIOMECHANICS_EXPERT', 40, 120, 5,
  'NFV_PREMIUM', 'hub-biomecanico', 25, false,
  'membros-inferiores', 'terra', 'BIOMECANICA_NFV', 'ADMIN',
  134, 0, 11, 'WARM',
  NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Arena" WHERE slug = 'analise-terra');

-- 4. Análise: Supino
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "isActive", "isPaused", "allowImages", "allowLinks", "allowVideos",
  "aiPersona", "aiInterventionRate", "aiFrustrationThreshold", "aiCooldown",
  "arenaType", "parentArenaSlug", "requiresFP", "requiresSubscription",
  "movementCategory", "movementPattern", categoria, "criadaPor",
  "totalPosts", "totalComments", "dailyActiveUsers", status,
  "createdAt", "updatedAt"
)
SELECT
  'clz1supi000004'::text, 'analise-supino', 'Análise: Supino',
  'Envie seu vídeo de supino para análise de retração escapular, trajetória da barra e ativação peitoral.',
  'Video', '#ef4444', 'biomecanica',
  true, false, true, true, true,
  'BIOMECHANICS_EXPERT', 40, 120, 5,
  'NFV_PREMIUM', 'hub-biomecanico', 25, false,
  'membros-superiores', 'supino', 'BIOMECANICA_NFV', 'ADMIN',
  112, 0, 9, 'WARM',
  NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Arena" WHERE slug = 'analise-supino');

-- 5. Análise: Puxadas
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "isActive", "isPaused", "allowImages", "allowLinks", "allowVideos",
  "aiPersona", "aiInterventionRate", "aiFrustrationThreshold", "aiCooldown",
  "arenaType", "parentArenaSlug", "requiresFP", "requiresSubscription",
  "movementCategory", "movementPattern", categoria, "criadaPor",
  "totalPosts", "totalComments", "dailyActiveUsers", status,
  "createdAt", "updatedAt"
)
SELECT
  'clz1puxa000005'::text, 'analise-puxadas', 'Análise: Puxadas',
  'Análise biomecânica de puxadas e remadas. IA avalia ativação de dorsais, compensação de bíceps e posição escapular.',
  'Video', '#06b6d4', 'biomecanica',
  true, false, true, true, true,
  'BIOMECHANICS_EXPERT', 40, 120, 5,
  'NFV_PREMIUM', 'hub-biomecanico', 25, false,
  'membros-superiores', 'puxadas', 'BIOMECANICA_NFV', 'ADMIN',
  98, 0, 7, 'WARM',
  NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Arena" WHERE slug = 'analise-puxadas');

-- 6. Análise: Elevação Pélvica
INSERT INTO "Arena" (
  id, slug, name, description, icon, color, category,
  "isActive", "isPaused", "allowImages", "allowLinks", "allowVideos",
  "aiPersona", "aiInterventionRate", "aiFrustrationThreshold", "aiCooldown",
  "arenaType", "parentArenaSlug", "requiresFP", "requiresSubscription",
  "movementCategory", "movementPattern", categoria, "criadaPor",
  "totalPosts", "totalComments", "dailyActiveUsers", status,
  "createdAt", "updatedAt"
)
SELECT
  'clz1elev000006'::text, 'analise-elevacao-pelvica', 'Análise: Elevação Pélvica',
  'Análise do hip thrust e elevação pélvica. IA verifica extensão de quadril, ativação glútea e compensações lombares.',
  'Video', '#ec4899', 'biomecanica',
  true, false, true, true, true,
  'BIOMECHANICS_EXPERT', 40, 120, 5,
  'NFV_PREMIUM', 'hub-biomecanico', 25, false,
  'membros-inferiores', 'elevacao-pelvica', 'BIOMECANICA_NFV', 'ADMIN',
  156, 0, 13, 'WARM',
  NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Arena" WHERE slug = 'analise-elevacao-pelvica');

-- Verificar arenas criadas
SELECT
  slug,
  name,
  categoria,
  "arenaType",
  status,
  "isActive"
FROM "Arena"
WHERE slug IN (
  'hub-biomecanico',
  'analise-agachamento',
  'analise-terra',
  'analise-supino',
  'analise-puxadas',
  'analise-elevacao-pelvica'
)
ORDER BY slug;
