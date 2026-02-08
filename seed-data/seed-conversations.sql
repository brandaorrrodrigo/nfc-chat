-- ============================================
-- SEED: Conversas Realistas para NFC Comunidades
-- ============================================
-- Copie e cole este script no Supabase Console
-- ou execute via: psql $DATABASE_URL < seed-conversations.sql

-- 1. CRIAR USUARIOS SIMULADOS
INSERT INTO "User" (id, email, name, role) VALUES
('user_sim_001', 'ana.paula@fitcoach.local', 'Ana Paula', 'USER'),
('user_sim_002', 'juliana.santos@fitcoach.local', 'Juliana Santos', 'USER'),
('user_sim_003', 'mariana.costa@fitcoach.local', 'Mariana Costa', 'USER'),
('user_sim_004', 'carlos.eduardo@fitcoach.local', 'Carlos Eduardo', 'USER'),
('user_sim_005', 'rafael.lima@fitcoach.local', 'Rafael Lima', 'USER'),
('user_sim_006', 'patricia.oliveira@fitcoach.local', 'Patricia Oliveira', 'USER'),
('user_sim_007', 'fernanda.alves@fitcoach.local', 'Fernanda Alves', 'USER'),
('user_sim_008', 'camila.ribeiro@fitcoach.local', 'Camila Ribeiro', 'USER'),
('user_sim_009', 'bruno.ferreira@fitcoach.local', 'Bruno Ferreira', 'USER'),
('user_sim_010', 'thiago.martins@fitcoach.local', 'Thiago Martins', 'USER'),
('user_sim_011', 'lucas.souza@fitcoach.local', 'Lucas Souza', 'USER'),
('user_sim_012', 'roberta.mendes@fitcoach.local', 'Roberta Mendes', 'USER'),
('user_sim_013', 'amanda.silva@fitcoach.local', 'Amanda Silva', 'USER'),
('user_sim_014', 'rodrigo.andrade@fitcoach.local', 'Rodrigo Andrade', 'USER'),
('user_sim_015', 'gustavo.rocha@fitcoach.local', 'Gustavo Rocha', 'USER'),
('user_sim_016', 'daniela.correia@fitcoach.local', 'Daniela Correia', 'USER'),
('user_sim_017', 'renata.moraes@fitcoach.local', 'Renata Moraes', 'USER'),
('user_sim_018', 'marcelo.pereira@fitcoach.local', 'Marcelo Pereira', 'USER'),
('user_sim_019', 'joao.carlos@fitcoach.local', 'Joao Carlos', 'USER'),
('user_sim_020', 'beatriz.gomes@fitcoach.local', 'Beatriz Gomes', 'USER'),
('user_sim_021', 'isabella.sousa@fitcoach.local', 'Isabella Sousa', 'USER'),
('user_sim_022', 'victor.almeida@fitcoach.local', 'Victor Almeida', 'USER')
ON CONFLICT (id) DO NOTHING;

-- 2. EXEMPLO: POPULAR UMA ARENA COM CONVERSAS
-- Este exemplo popula a primeira arena com posts realistas

-- Buscar ID da primeira arena (postura-estetica ou similar)
WITH first_arena AS (
  SELECT id FROM "Arena" 
  WHERE slug LIKE '%postura%' OR slug LIKE '%estetica%'
  LIMIT 1
)
INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "isAIResponse")
SELECT
  'post_' || gen_random_uuid()::text,
  (SELECT id FROM first_arena),
  'user_sim_' || LPAD(CAST(FLOOR(RANDOM() * 22 + 1) AS TEXT), 3, '0'),
  'Tenho barriga saliente mesmo magro. Como posso corrigir? Ja fiz bastante treino mas nao consegui resolver este problema. Alguem pode ajudar?',
  true,
  false
UNION ALL
SELECT
  'post_' || gen_random_uuid()::text,
  (SELECT id FROM first_arena),
  'user_sim_' || LPAD(CAST(FLOOR(RANDOM() * 22 + 1) AS TEXT), 3, '0'),
  'Meus ombros sao desnivelados. Isso afeta minha aparencia? E possivel corrigir com exercicios?',
  true,
  false
UNION ALL
SELECT
  'post_' || gen_random_uuid()::text,
  (SELECT id FROM first_arena),
  'user_sim_' || LPAD(CAST(FLOOR(RANDOM() * 22 + 1) AS TEXT), 3, '0'),
  'Meu gluteo fica muito caido mesmo com treino. E postura ou preciso focar em ganhar massa muscular?',
  true,
  false;

-- 3. ATUALIZAR CONTADORES DA ARENA
UPDATE "Arena" 
SET 
  "totalPosts" = (SELECT COUNT(*) FROM "Post" WHERE "arenaId" = "Arena".id),
  "totalComments" = (SELECT COUNT(*) FROM "Comment" WHERE "postId" IN (SELECT id FROM "Post" WHERE "arenaId" = "Arena".id)),
  "dailyActiveUsers" = (SELECT COUNT(DISTINCT "userId") FROM "Post" WHERE "arenaId" = "Arena".id)
WHERE "slug" LIKE '%postura%' OR "slug" LIKE '%estetica%';

-- ============================================
-- Para popular TODAS as 36 arenas automaticamente:
-- Execute: npm run seed:conversations (quando banco estiver online)
-- ============================================
