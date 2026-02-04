-- ════════════════════════════════════════════════════════
-- SETUP INICIAL - NUTRIFIT COMMUNITIES
-- Execute este arquivo PRIMEIRO
-- ════════════════════════════════════════════════════════

-- Adicionar campos necessários à tabela User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS is_ghost_user BOOLEAN DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Criar as 8 arenas
INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_postura',
  'barriga-pochete-postura',
  'Barriga Pochete',
  'Discussões sobre barriga pochete',
  '💬',
  '#8B5CF6',
  'postura',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_lipedema',
  'musculacao-lipedema',
  'Musculação Lipedema',
  'Discussões sobre musculação lipedema',
  '💬',
  '#8B5CF6',
  'lipedema',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_hipercifose',
  'hipercifose-drenagem',
  'Hipercifose Drenagem',
  'Discussões sobre hipercifose drenagem',
  '💬',
  '#8B5CF6',
  'hipercifose',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_compressao',
  'meia-compressao-treino',
  'Meia Compressão',
  'Discussões sobre meia compressão',
  '💬',
  '#8B5CF6',
  'compressao',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_menstrual',
  'lipedema-dor-menstrual',
  'Dor Menstrual',
  'Discussões sobre dor menstrual',
  '💬',
  '#8B5CF6',
  'menstrual',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_gluteo_medio',
  'gluteo-medio-valgo',
  'Glúteo Médio/Valgo',
  'Discussões sobre glúteo médio/valgo',
  '💬',
  '#8B5CF6',
  'gluteo_medio',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_miofascial',
  'liberacao-miofascial-lipedema',
  'Liberação Miofascial',
  'Discussões sobre liberação miofascial',
  '💬',
  '#8B5CF6',
  'miofascial',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_desvio_bacia',
  'desvio-bacia-gordura',
  'Desvio de Bacia',
  'Discussões sobre desvio de bacia',
  '💬',
  '#8B5CF6',
  'desvio_bacia',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name;

-- Criar tabela de mensagens
CREATE TABLE IF NOT EXISTS nfc_chat_messages (
    id TEXT PRIMARY KEY,
    comunidade_slug TEXT NOT NULL,
    post_id TEXT,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_ia BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_chat_comunidade ON nfc_chat_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_chat_post ON nfc_chat_messages(post_id);

-- ✅ Setup inicial concluído!
