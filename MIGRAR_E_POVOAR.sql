-- ════════════════════════════════════════════════════════════
-- PASSO 1: MIGRAR TABELA nfc_chat_messages
-- Renomeia colunas antigas → schema correto da API
-- ════════════════════════════════════════════════════════════

-- Renomear colunas se existem com nome antigo
ALTER TABLE nfc_chat_messages RENAME COLUMN author_id TO user_id;
ALTER TABLE nfc_chat_messages RENAME COLUMN author_name TO user_name;

-- Adicionar colunas que faltam (ignora se já existem)
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS user_avatar TEXT;
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS parent_id TEXT;
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS original_content TEXT;
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE nfc_chat_messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Índices
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_slug ON nfc_chat_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_user ON nfc_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_created ON nfc_chat_messages(created_at DESC);

SELECT 'Migração concluída!' as status;
