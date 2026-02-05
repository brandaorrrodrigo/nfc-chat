-- =====================================================
-- MIGRAÇÃO: Adicionar campos de edição e exclusão
-- Tabela: nfc_chat_messages
-- Data: 2024
-- =====================================================

-- Adicionar campo para marcar mensagem como editada
ALTER TABLE nfc_chat_messages
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;

-- Adicionar timestamp de edição
ALTER TABLE nfc_chat_messages
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;

-- Adicionar backup do conteúdo original (primeira edição)
ALTER TABLE nfc_chat_messages
ADD COLUMN IF NOT EXISTS original_content TEXT;

-- Adicionar campo para soft delete
ALTER TABLE nfc_chat_messages
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Adicionar timestamp de exclusão
ALTER TABLE nfc_chat_messages
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Índice para filtrar mensagens deletadas (performance)
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_deleted
ON nfc_chat_messages(is_deleted)
WHERE is_deleted = FALSE;

-- Policy: permitir UPDATE para mensagens próprias
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'nfc_chat_messages'
    AND policyname = 'Update proprio'
  ) THEN
    CREATE POLICY "Update proprio" ON nfc_chat_messages
    FOR UPDATE USING (true);
  END IF;
END
$$;

-- Comentário para documentação
COMMENT ON COLUMN nfc_chat_messages.is_edited IS 'Indica se a mensagem foi editada';
COMMENT ON COLUMN nfc_chat_messages.edited_at IS 'Timestamp da última edição';
COMMENT ON COLUMN nfc_chat_messages.original_content IS 'Conteúdo original antes da primeira edição';
COMMENT ON COLUMN nfc_chat_messages.is_deleted IS 'Soft delete - oculta mensagem sem remover do banco';
COMMENT ON COLUMN nfc_chat_messages.deleted_at IS 'Timestamp da exclusão';

-- =====================================================
-- VERIFICAÇÃO: Execute após a migração
-- =====================================================
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'nfc_chat_messages'
-- ORDER BY ordinal_position;
