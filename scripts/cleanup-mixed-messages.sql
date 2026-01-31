-- =====================================================
-- LIMPEZA: Mensagens Misturadas entre Arenas
--
-- Este script identifica e corrige mensagens que foram
-- salvas com o slug errado (quando dois destaques
-- apontavam para o mesmo endereço)
-- =====================================================

-- 1. DIAGNÓSTICO: Ver todas as mensagens por comunidade
-- (Execute primeiro para entender a situação)
SELECT
  comunidade_slug,
  COUNT(*) as total_mensagens,
  MIN(created_at) as primeira_msg,
  MAX(created_at) as ultima_msg
FROM nfc_chat_messages
WHERE is_deleted = FALSE OR is_deleted IS NULL
GROUP BY comunidade_slug
ORDER BY total_mensagens DESC;

-- 2. VER MENSAGENS DE PERFORMANCE-BIOHACKING
-- (Identifique quais são sobre peptídeos vs sobre trembolona)
SELECT
  id,
  user_name,
  LEFT(content, 100) as preview_conteudo,
  created_at
FROM nfc_chat_messages
WHERE comunidade_slug = 'performance-biohacking'
  AND (is_deleted = FALSE OR is_deleted IS NULL)
ORDER BY created_at DESC
LIMIT 50;

-- =====================================================
-- OPÇÃO A: MOVER mensagens sobre peptídeos para a nova arena
-- =====================================================
-- Se você identificar mensagens que deveriam estar em peptideos-research,
-- use este comando (substitua os IDs):

-- UPDATE nfc_chat_messages
-- SET comunidade_slug = 'peptideos-research'
-- WHERE id IN ('id1', 'id2', 'id3');

-- =====================================================
-- OPÇÃO B: EXCLUIR (soft delete) mensagens duplicadas/erradas
-- =====================================================
-- Se preferir apenas ocultar as mensagens erradas:

-- UPDATE nfc_chat_messages
-- SET
--   is_deleted = TRUE,
--   deleted_at = NOW()
-- WHERE id IN ('id1', 'id2', 'id3');

-- =====================================================
-- OPÇÃO C: EXCLUIR TODAS as mensagens de performance-biohacking
-- (USE COM CUIDADO - apaga todo o histórico da arena)
-- =====================================================

-- UPDATE nfc_chat_messages
-- SET
--   is_deleted = TRUE,
--   deleted_at = NOW()
-- WHERE comunidade_slug = 'performance-biohacking';

-- =====================================================
-- OPÇÃO D: DELETAR PERMANENTEMENTE (sem possibilidade de recuperação)
-- =====================================================

-- DELETE FROM nfc_chat_messages
-- WHERE comunidade_slug = 'performance-biohacking';

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
-- Após executar a limpeza, verifique:

-- SELECT
--   comunidade_slug,
--   COUNT(*) as total,
--   SUM(CASE WHEN is_deleted = TRUE THEN 1 ELSE 0 END) as deletadas
-- FROM nfc_chat_messages
-- GROUP BY comunidade_slug;
