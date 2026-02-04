-- ════════════════════════════════════════════════════════
-- CORREÇÃO: Adicionar campo updated_at
-- Execute este arquivo AGORA antes de continuar
-- ════════════════════════════════════════════════════════

-- Adicionar campo updated_at à tabela nfc_chat_messages
ALTER TABLE nfc_chat_messages
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ✅ Correção aplicada!
-- Agora você pode executar as arenas 6, 7 e 8 novamente
