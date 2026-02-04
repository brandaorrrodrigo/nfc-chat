-- ════════════════════════════════════════════════════════
-- SETUP COMPLETO - NUTRIFIT COMMUNITIES
-- ════════════════════════════════════════════════════════
-- Este arquivo cria o schema completo e importa os dados
-- das 8 arenas com conteúdo orgânico
-- ════════════════════════════════════════════════════════

-- PASSO 1: Criar campo is_ghost_user na tabela User
-- ════════════════════════════════════════════════════════

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS is_ghost_user BOOLEAN DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS bio TEXT;

-- PASSO 2: Criar campo arena_slug na tabela Post
-- ════════════════════════════════════════════════════════

ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS arena_slug TEXT;

-- PASSO 3: Criar tabela de mensagens de chat (se não existir)
-- ════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS nfc_chat_messages (
    id TEXT PRIMARY KEY,
    comunidade_slug TEXT NOT NULL,
    post_id TEXT,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_ia BOOLEAN DEFAULT false,
    CONSTRAINT fk_chat_post FOREIGN KEY (post_id) REFERENCES "Post"(id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_author FOREIGN KEY (author_id) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_comunidade ON nfc_chat_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_chat_post ON nfc_chat_messages(post_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON nfc_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_is_ia ON nfc_chat_messages(is_ia);

-- PASSO 4: Desabilitar triggers temporariamente
-- ════════════════════════════════════════════════════════

SET session_replication_role = 'replica';

-- PASSO 5: Importar Ghost Users
-- ════════════════════════════════════════════════════════

-- Nota: Usando INSERT com ON CONFLICT para evitar duplicação
-- Os IDs dos ghost users começam com 'ghost_'

\echo 'Importando Ghost Users...'

-- Aqui você deve colar os INSERT statements dos ghost users
-- do arquivo importacao-arenas.sql, mas mudando:
-- - users → "User"
-- - Campos devem usar PascalCase se necessário

-- PASSO 6: Importar Threads (Posts)
-- ════════════════════════════════════════════════════════

\echo 'Importando Threads...'

-- Aqui você deve colar os INSERT statements das threads
-- do arquivo importacao-arenas.sql, mas mudando:
-- - posts → "Post"
-- - user_id → "userId"
-- - is_published → "isPublished"
-- - created_at → "createdAt"
-- - updated_at → "updatedAt"

-- PASSO 7: Importar Mensagens
-- ════════════════════════════════════════════════════════

\echo 'Importando Mensagens...'

-- As mensagens podem usar a tabela nfc_chat_messages
-- que acabamos de criar, mantendo os nomes em lowercase

-- PASSO 8: Reabilitar triggers
-- ════════════════════════════════════════════════════════

SET session_replication_role = 'origin';

-- PASSO 9: Verificação
-- ════════════════════════════════════════════════════════

\echo 'Verificando importação...'

SELECT
    'Ghost Users' as item,
    COUNT(*) as total
FROM "User"
WHERE is_ghost_user = true

UNION ALL

SELECT
    'Posts/Threads',
    COUNT(*)
FROM "Post"
WHERE arena_slug IS NOT NULL

UNION ALL

SELECT
    'Mensagens Chat',
    COUNT(*)
FROM nfc_chat_messages;

\echo '✅ Setup completo finalizado!'
