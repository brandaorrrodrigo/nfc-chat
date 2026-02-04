-- ════════════════════════════════════════════════════════
-- IMPORTAÇÃO 8 ARENAS - NUTRIFIT COMMUNITIES
-- ════════════════════════════════════════════════════════

-- Adicionar campos necessários
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
  'Discussões sobre postura e barriga projetada',
  '💬',
  '#8B5CF6',
  'postura',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_lipedema',
  'musculacao-lipedema',
  'Musculação Lipedema',
  'Como treinar com lipedema',
  '💬',
  '#8B5CF6',
  'lipedema',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_hipercifose',
  'hipercifose-drenagem',
  'Hipercifose Drenagem',
  'Hipercifose e drenagem corporal',
  '💬',
  '#8B5CF6',
  'hipercifose',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_compressao',
  'meia-compressao-treino',
  'Meia Compressão',
  'Treinar com meia de compressão',
  '💬',
  '#8B5CF6',
  'compressao',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_menstrual',
  'lipedema-dor-menstrual',
  'Dor Menstrual',
  'Dor nos nódulos no período menstrual',
  '💬',
  '#8B5CF6',
  'menstrual',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_gluteo_medio',
  'gluteo-medio-valgo',
  'Glúteo Médio/Valgo',
  'Glúteo médio e valgo dinâmico',
  '💬',
  '#8B5CF6',
  'gluteo_medio',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_miofascial',
  'liberacao-miofascial-lipedema',
  'Liberação Miofascial',
  'Liberação miofascial para lipedema',
  '💬',
  '#8B5CF6',
  'miofascial',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, "isActive", "createdAt", "updatedAt")
VALUES (
  'arena_desvio_bacia',
  'desvio-bacia-gordura',
  'Desvio de Bacia',
  'Desvio de bacia vs gordura localizada',
  '💬',
  '#8B5CF6',
  'desvio_bacia',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;


-- Criar tabela de mensagens
CREATE TABLE IF NOT EXISTS nfc_chat_messages (
    id TEXT PRIMARY KEY,
    comunidade_slug TEXT NOT NULL,
    post_id TEXT,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_ia BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_chat_comunidade ON nfc_chat_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_chat_post ON nfc_chat_messages(post_id);


-- ════ ARENA 1: Barriga Pochete ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_igor_nascimento',
  'igor_nascimento@outlook.com',
  'Igor Nascimento',
  'igor_nascimento',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=igor_nascimento',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_active',
  'andre_active@hotmail.com',
  'André Souza',
  'andre_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_active',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernanda16',
  'fernanda16@gmail.com',
  'Fernanda Nascimento',
  'fernanda16',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda16',
  'Iniciante tentando melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila96',
  'priscila96@hotmail.com',
  'Priscila Souza',
  'priscila96',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila96',
  'Iniciante tentando ganhar massa muscular.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_almeida',
  'henrique_almeida@hotmail.com',
  'Henrique Almeida',
  'henrique_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_almeida',
  'Iniciante tentando correr melhor.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela22',
  'rafaela22@yahoo.com.br',
  'Rafaela Fernandes',
  'rafaela22',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela22',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_marianacastro',
  'marianacastro@hotmail.com',
  'Mariana Castro',
  'marianacastro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=marianacastro',
  'Começando agora. Objetivo: melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_saude',
  'andre_saude@yahoo.com.br',
  'André Alves',
  'andre_saude',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_saude',
  'Treino há uns 2 anos. Foco em perder barriga.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique0',
  'henrique0@yahoo.com.br',
  'Henrique Lima',
  'henrique0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique0',
  'Intermediário buscando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rodrigo_santos',
  'rodrigo_santos@yahoo.com.br',
  'Rodrigo Santos',
  'rodrigo_santos',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rodrigo_santos',
  'Apaixonado por treino.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernando_alves',
  'fernando_alves@outlook.com',
  'Fernando Alves',
  'fernando_alves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernando_alves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amandaalves',
  'amandaalves@outlook.com',
  'Amanda Alves',
  'amandaalves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amandaalves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_luciana_',
  'luciana_@outlook.com',
  'Luciana Rodrigues',
  'luciana_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=luciana_',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolina_vieira',
  'carolina_vieira@yahoo.com.br',
  'Carolina Vieira',
  'carolina_vieira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolina_vieira',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vitorferreira',
  'vitorferreira@gmail.com',
  'Vitor Ferreira',
  'vitorferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vitorferreira',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_active',
  'henrique_active@yahoo.com.br',
  'Henrique Oliveira',
  'henrique_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_active',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolinalopes',
  'carolinalopes@yahoo.com.br',
  'Carolina Lopes',
  'carolinalopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolinalopes',
  'Apaixonado por treino.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carlos_almeida',
  'carlos_almeida@gmail.com',
  'Carlos Almeida',
  'carlos_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos_almeida',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscilaferreira',
  'priscilaferreira@hotmail.com',
  'Priscila Ferreira',
  'priscilaferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscilaferreira',
  'Começando agora. Objetivo: voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_postura_1',
  'arena_postura',
  'ghost_igor_nascimento',
  'Eu achava que era frescura, mas… exercicio de abdomen resolve

não sou especialista, mas… malhei abdomen por 6 meses direto mas a barriga continua projetada. sera q to fazendo errado ou nao é isso q resolve?',
  true,
  '2026-02-04T10:23:36.736Z'::timestamptz,
  '2026-02-04T10:23:36.736Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_postura_2',
  'arena_postura',
  'ghost_henrique_almeida',
  'Cara, comigo foi assim… ficar muiito tempo sentado piora?

trabalho 8h sentado e sinto q minha barriga fica cada vez mais pra frente. tem relacao ou to viajando?',
  true,
  '2026-02-05T10:23:36.736Z'::timestamptz,
  '2026-02-05T10:23:36.736Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_postura_3',
  'arena_postura',
  'ghost_henrique0',
  'diastase ou anteversao?

como diferenciar? tenho barriga projetada pos-gravidez mas nao sei se é diastase abdominal ou so postura ruim',
  true,
  '2026-02-06T10:23:36.736Z'::timestamptz,
  '2026-02-06T10:23:36.736Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_postura_4',
  'arena_postura',
  'ghost_amandaalves',
  'ficar muito tempo sentado piora?

não sou especialista, mas… trabalho 8h sentado e sinto q minha barriga fica cada vez mais pra frente. tem relacao ou to viajando',
  true,
  '2026-02-07T10:23:36.736Z'::timestamptz,
  '2026-02-07T10:23:36.736Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_postura_5',
  'arena_postura',
  'ghost_vitorferreira',
  'gluteo fraco causa barriga saliente?

li q gluteo fraco deixa a pelve anterior e projeta a barriga. faz sentido? alguem corrigiu treinando glúteo?',
  true,
  '2026-02-08T10:23:36.736Z'::timestamptz,
  '2026-02-08T10:23:36.736Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_0_0',
  'barriga-pochete-postura',
  'post_postura_1',
  'ghost_andre_active',
  'André Souza',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-04T10:50:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_0_1',
  'barriga-pochete-postura',
  'post_postura_1',
  'ghost_fernanda16',
  'Fernanda Nascimento',
  'Eu achava que era frescura, mas… normal isso no começo. depois melhora',
  '2026-02-04T11:13:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_0_2',
  'barriga-pochete-postura',
  'post_postura_1',
  'ghost_priscila96',
  'Priscila Souza',
  'normal isso no começo. depois melhora',
  '2026-02-04T11:35:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_1_0',
  'barriga-pochete-postura',
  'post_postura_2',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-05T10:53:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_1_1',
  'barriga-pochete-postura',
  'post_postura_2',
  'ghost_marianacastro',
  'Mariana Castro',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-05T11:32:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_1_2',
  'barriga-pochete-postura',
  'post_postura_2',
  'ghost_andre_saude',
  'André Alves',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-05T12:07:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_1_3',
  'barriga-pochete-postura',
  'post_postura_2',
  'ia_facilitadora',
  'NutriFit Coach',
  'Excelente ponto. A anteversao pelvica projeta o abdomen mesmo com baixo percentual de gordura. Pergunta para o grupo: alguem ja notou a barriga "sumir" quando ajusta a posicao da pelve em pe?',
  '2026-02-05T12:35:36.736Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_2_0',
  'barriga-pochete-postura',
  'post_postura_3',
  'ghost_rodrigo_santos',
  'Rodrigo Santos',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-06T10:42:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_2_1',
  'barriga-pochete-postura',
  'post_postura_3',
  'ghost_fernando_alves',
  'Fernando Alves',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-06T11:25:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_2_2',
  'barriga-pochete-postura',
  'post_postura_3',
  'ghost_fernando_alves',
  'Fernando Alves',
  'No meu caso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-06T11:55:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_2_3',
  'barriga-pochete-postura',
  'post_postura_3',
  'ia_facilitadora',
  'NutriFit Coach',
  'Excelente ponto. A anteversao pelvica projeta o abdomen mesmo com baixo percentual de gordura. Pergunta para o grupo: alguem ja notou a barriga "sumir" quando ajusta a posicao da pelve em pe?',
  '2026-02-06T12:05:36.736Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_3_0',
  'barriga-pochete-postura',
  'post_postura_4',
  'ghost_luciana_',
  'Luciana Rodrigues',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-07T11:00:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_3_1',
  'barriga-pochete-postura',
  'post_postura_4',
  'ghost_henrique_almeida',
  'Henrique Almeida',
  'Cara, comigo foi assim… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-07T11:20:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_3_2',
  'barriga-pochete-postura',
  'post_postura_4',
  'ghost_carolina_vieira',
  'Carolina Vieira',
  'Eu achava que era frescura, mas… eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-07T11:29:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_4_0',
  'barriga-pochete-postura',
  'post_postura_5',
  'ghost_henrique_active',
  'Henrique Oliveira',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-08T11:04:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_4_1',
  'barriga-pochete-postura',
  'post_postura_5',
  'ghost_carolinalopes',
  'Carolina Lopes',
  'deficit calorico é oq importa no final. pode comer carbo a noite sim',
  '2026-02-08T11:46:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_4_2',
  'barriga-pochete-postura',
  'post_postura_5',
  'ghost_andre_saude',
  'André Alves',
  'no meu caso demorou uns 2 meses pra ver resultado... paciencia',
  '2026-02-08T12:26:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_4_3',
  'barriga-pochete-postura',
  'post_postura_5',
  'ghost_carlos_almeida',
  'Carlos Almeida',
  'No meu caso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-08T12:53:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_postura_4_4',
  'barriga-pochete-postura',
  'post_postura_5',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'No meu caso… proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-08T13:02:36.736Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;


-- ════ ARENA 2: Musculação Lipedema ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_caio_run',
  'caio_run@yahoo.com.br',
  'Caio Dias',
  'caio_run',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=caio_run',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_matheus93',
  'matheus93@hotmail.com',
  'Matheus Carvalho',
  'matheus93',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=matheus93',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_lucas14',
  'lucas14@outlook.com',
  'Lucas Alves',
  'lucas14',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas14',
  'Sempre buscando evolução.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscilaferreira',
  'priscilaferreira@hotmail.com',
  'Priscila Ferreira',
  'priscilaferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscilaferreira',
  'Começando agora. Objetivo: voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_active',
  'andre_active@hotmail.com',
  'André Souza',
  'andre_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_active',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolinalopes',
  'carolinalopes@yahoo.com.br',
  'Carolina Lopes',
  'carolinalopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolinalopes',
  'Apaixonado por treino.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_sabrina_',
  'sabrina_@hotmail.com',
  'Sabrina Souza',
  'sabrina_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sabrina_',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila_fernandes',
  'priscila_fernandes@hotmail.com',
  'Priscila Fernandes',
  'priscila_fernandes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila_fernandes',
  'Iniciante tentando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_matheus_castro',
  'matheus_castro@hotmail.com',
  'Matheus Castro',
  'matheus_castro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=matheus_castro',
  'Iniciante tentando emagrecer.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernanda16',
  'fernanda16@gmail.com',
  'Fernanda Nascimento',
  'fernanda16',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda16',
  'Iniciante tentando melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabriela_rodrigues',
  'gabriela_rodrigues@hotmail.com',
  'Gabriela Rodrigues',
  'gabriela_rodrigues',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriela_rodrigues',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela22',
  'rafaela22@yahoo.com.br',
  'Rafaela Fernandes',
  'rafaela22',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela22',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda70',
  'amanda70@gmail.com',
  'Amanda Ferreira',
  'amanda70',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda70',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessa43',
  'vanessa43@hotmail.com',
  'Vanessa Fernandes',
  'vanessa43',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessa43',
  'Iniciante tentando voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessabarbosa',
  'vanessabarbosa@yahoo.com.br',
  'Vanessa Barbosa',
  'vanessabarbosa',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessabarbosa',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafael_soares',
  'rafael_soares@yahoo.com.br',
  'Rafael Soares',
  'rafael_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafael_soares',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_almeida',
  'henrique_almeida@hotmail.com',
  'Henrique Almeida',
  'henrique_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_almeida',
  'Iniciante tentando correr melhor.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernanda_soares',
  'fernanda_soares@hotmail.com',
  'Fernanda Soares',
  'fernanda_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda_soares',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rodrigo_wellness',
  'rodrigo_wellness@gmail.com',
  'Rodrigo Lopes',
  'rodrigo_wellness',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rodrigo_wellness',
  'Mostrem os estudos.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabrielcastro',
  'gabrielcastro@outlook.com',
  'Gabriel Castro',
  'gabrielcastro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabrielcastro',
  'Começando agora. Objetivo: aumentar força.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_felipe_martins',
  'felipe_martins@hotmail.com',
  'Felipe Martins',
  'felipe_martins',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=felipe_martins',
  'Sempre buscando evolução.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_lipedema_1',
  'arena_lipedema',
  'ghost_caio_run',
  'quando parei de treinar inchei mais

fiquei um mes sem treinar por preguica e percebi q as pernas ficaram mais inchadas. voltei a treinar e melhorou',
  true,
  '2026-02-04T10:23:36.742Z'::timestamptz,
  '2026-02-04T10:23:36.742Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_lipedema_2',
  'arena_lipedema',
  'ghost_andre_active',
  'que exercicio nao inflama

No meu caso… quais exercicios vcs fazem q nao causam mais inflamacao? tenho medo de piorar',
  true,
  '2026-02-05T10:23:36.742Z'::timestamptz,
  '2026-02-05T10:23:36.742Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_lipedema_3',
  'arena_lipedema',
  'ghost_matheus_castro',
  'musculacao engrossa a perna no lipedema?

Não sou especialista, mas… tenho lipedema e morro de medo de musculacao engrossar minhas pernas. treinar ajuda ou piora? alguem aqui tem experiencia?',
  true,
  '2026-02-06T10:23:36.742Z'::timestamptz,
  '2026-02-06T10:23:36.742Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_lipedema_4',
  'arena_lipedema',
  'ghost_rafaela22',
  'lipedema tem cura ou so controle

vejo muita gente vendendo solucao milagrosa. mas na real é so controle ne? nao tem cura',
  true,
  '2026-02-07T10:23:36.742Z'::timestamptz,
  '2026-02-07T10:23:36.742Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_lipedema_5',
  'arena_lipedema',
  'ghost_henrique_almeida',
  'impacto piorou tudo

tentei correr e minhas pernas incharam muito mais. impacto realmente piora lipedema',
  true,
  '2026-02-08T10:23:36.742Z'::timestamptz,
  '2026-02-08T10:23:36.742Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_0_0',
  'musculacao-lipedema',
  'post_lipedema_1',
  'ghost_matheus93',
  'Matheus Carvalho',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-04T11:03:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_0_1',
  'musculacao-lipedema',
  'post_lipedema_1',
  'ghost_lucas14',
  'Lucas Alves',
  'normal isso no começo. depois melhora',
  '2026-02-04T11:16:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_0_2',
  'musculacao-lipedema',
  'post_lipedema_1',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'No meu caso… discordo. no meu caso foi totalmente diferente',
  '2026-02-04T11:25:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_1_0',
  'musculacao-lipedema',
  'post_lipedema_2',
  'ghost_carolinalopes',
  'Carolina Lopes',
  'tenta aumentar a proteina pra 1.6-2g por kg... comigo funcionou',
  '2026-02-05T10:39:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_1_1',
  'musculacao-lipedema',
  'post_lipedema_2',
  'ghost_sabrina_',
  'Sabrina Souza',
  'Já passei por isso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-05T11:13:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_1_2',
  'musculacao-lipedema',
  'post_lipedema_2',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'to na mesma situacao q vc... vamos junto!',
  '2026-02-05T11:41:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_2_0',
  'musculacao-lipedema',
  'post_lipedema_3',
  'ghost_fernanda16',
  'Fernanda Nascimento',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-06T11:00:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_2_1',
  'musculacao-lipedema',
  'post_lipedema_3',
  'ghost_gabriela_rodrigues',
  'Gabriela Rodrigues',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-06T11:32:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_2_2',
  'musculacao-lipedema',
  'post_lipedema_3',
  'ghost_lucas14',
  'Lucas Alves',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-06T12:07:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_3_0',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_amanda70',
  'Amanda Ferreira',
  'nao sou especialista, mas… hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-07T10:28:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_3_1',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_vanessa43',
  'Vanessa Fernandes',
  'No meu caso… acho q depende muito da pessoa. nao da pra generalizar',
  '2026-02-07T10:47:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_3_2',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_vanessabarbosa',
  'Vanessa Barbosa',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-07T11:00:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_3_3',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'proteina: 1.6-2.2g/kg. mais q isso nao agrega. estudos mostram',
  '2026-02-07T11:28:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_3_4',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_rafael_soares',
  'Rafael Soares',
  'Cara, comigo foi assim… hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-07T11:38:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_3_5',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ia_facilitadora',
  'NutriFit Coach',
  'Excelente relato. Quando o musculo trabalha, ele ajuda a drenar o liquido acumulado. Parar de treinar piora a estagnacao. Vcs sentem diferenca nos dias que treinam vs dias que nao treinam?',
  '2026-02-07T11:57:36.742Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_0',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_fernanda_soares',
  'Fernanda Soares',
  'No meu caso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-08T10:54:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_1',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_fernanda16',
  'Fernanda Nascimento',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-08T11:00:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_2',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_rodrigo_wellness',
  'Rodrigo Lopes',
  'passei anos fazendo errado. quando corrigi a tecnica mudou tudo',
  '2026-02-08T11:24:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_3',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'cara ja passei por isso tb..... é frustrante demais mas nao desiste',
  '2026-02-08T11:30:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_4',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_gabrielcastro',
  'Gabriel Castro',
  'não sou especialista, mas… cara ja passei por isso tb..... é frustrante demais mas nao desiste',
  '2026-02-08T12:06:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_5',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_felipe_martins',
  'Felipe Martins',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-08T12:46:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_6',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_felipe_martins',
  'Felipe Martins',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-08T13:16:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_lipedema_4_7',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ia_facilitadora',
  'NutriFit Coach',
  'Faz sentido o medo. Mas hipertrofia muscular é diferente de inflamacao. Musculo forte melhora circulacao. Alguem conseguiu reduzir o inchaço fortalecendo as pernas?',
  '2026-02-08T13:41:36.742Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;


-- ════ ARENA 3: Hipercifose Drenagem ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_jessica19',
  'jessica19@hotmail.com',
  'Jessica Barbosa',
  'jessica19',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica19',
  'Iniciante tentando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscilaferreira',
  'priscilaferreira@hotmail.com',
  'Priscila Ferreira',
  'priscilaferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscilaferreira',
  'Começando agora. Objetivo: voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_caio_run',
  'caio_run@yahoo.com.br',
  'Caio Dias',
  'caio_run',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=caio_run',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafael_soares',
  'rafael_soares@yahoo.com.br',
  'Rafael Soares',
  'rafael_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafael_soares',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_igor_nascimento',
  'igor_nascimento@outlook.com',
  'Igor Nascimento',
  'igor_nascimento',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=igor_nascimento',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_caiolopes',
  'caiolopes@hotmail.com',
  'Caio Lopes',
  'caiolopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=caiolopes',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_leandro_',
  'leandro_@yahoo.com.br',
  'Leandro Costa',
  'leandro_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=leandro_',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_matheus93',
  'matheus93@hotmail.com',
  'Matheus Carvalho',
  'matheus93',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=matheus93',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila41',
  'priscila41@gmail.com',
  'Priscila Barbosa',
  'priscila41',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila41',
  'Intermediário buscando melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolina_vieira',
  'carolina_vieira@yahoo.com.br',
  'Carolina Vieira',
  'carolina_vieira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolina_vieira',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda_rodrigues',
  'amanda_rodrigues@hotmail.com',
  'Amanda Rodrigues',
  'amanda_rodrigues',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda_rodrigues',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila_fernandes',
  'priscila_fernandes@hotmail.com',
  'Priscila Fernandes',
  'priscila_fernandes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila_fernandes',
  'Iniciante tentando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique0',
  'henrique0@yahoo.com.br',
  'Henrique Lima',
  'henrique0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique0',
  'Intermediário buscando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_luciana_',
  'luciana_@outlook.com',
  'Luciana Rodrigues',
  'luciana_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=luciana_',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda70',
  'amanda70@gmail.com',
  'Amanda Ferreira',
  'amanda70',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda70',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernando_alves',
  'fernando_alves@outlook.com',
  'Fernando Alves',
  'fernando_alves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernando_alves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_almeida',
  'henrique_almeida@hotmail.com',
  'Henrique Almeida',
  'henrique_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_almeida',
  'Iniciante tentando correr melhor.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernanda_soares',
  'fernanda_soares@hotmail.com',
  'Fernanda Soares',
  'fernanda_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda_soares',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_anaribeiro',
  'anaribeiro@hotmail.com',
  'Ana Ribeiro',
  'anaribeiro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anaribeiro',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabriela_rodrigues',
  'gabriela_rodrigues@hotmail.com',
  'Gabriela Rodrigues',
  'gabriela_rodrigues',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriela_rodrigues',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amandaalves',
  'amandaalves@outlook.com',
  'Amanda Alves',
  'amandaalves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amandaalves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessabarbosa',
  'vanessabarbosa@yahoo.com.br',
  'Vanessa Barbosa',
  'vanessabarbosa',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessabarbosa',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabrielcastro',
  'gabrielcastro@outlook.com',
  'Gabriel Castro',
  'gabrielcastro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabrielcastro',
  'Começando agora. Objetivo: aumentar força.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_bruno_dias',
  'bruno_dias@gmail.com',
  'Bruno Dias',
  'bruno_dias',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bruno_dias',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_hipercifose_1',
  'arena_hipercifose',
  'ghost_jessica19',
  'Cara, comigo foi assim… que exercicio melhora postura curvada

minhas costas são super curvadas e isso me incomoda muito. tem algum exercício que ajuda? musculação ou pilates?',
  true,
  '2026-02-04T10:23:36.743Z'::timestamptz,
  '2026-02-04T10:23:36.743Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_hipercifose_2',
  'arena_hipercifose',
  'ghost_priscila41',
  'diferenca entre postura ruim e hipercifose

todo mundo curvado tem hipercifose ou é só má postura? onde tá a linha divisória entre uma coisa e outra',
  true,
  '2026-02-05T10:23:36.743Z'::timestamptz,
  '2026-02-05T10:23:36.743Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_hipercifose_3',
  'arena_hipercifose',
  'ghost_luciana_',
  'quando corrigi a postura pernas desincharam

comecei a trabalhar postura com fisio e percebi que minhas pernas desincharam muito. nao mudei mais nada, só corrigi a curvatura das costas',
  true,
  '2026-02-06T10:23:36.743Z'::timestamptz,
  '2026-02-06T10:23:36.743Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_hipercifose_4',
  'arena_hipercifose',
  'ghost_leandro_',
  'hipercifose tem tratamento ou so controle?

vejo muita gente falando de "corrigir" hipercifose mas será que corrige mesmo ou só controla? qual a real?',
  true,
  '2026-02-07T10:23:36.743Z'::timestamptz,
  '2026-02-07T10:23:36.743Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_hipercifose_5',
  'arena_hipercifose',
  'ghost_anaribeiro',
  'hipercifose tem tratamento ou so controle?

vejo muita gente falando de "corrigir" hipercifose mas será que corrige mesmo ou só controla? qual a real?',
  true,
  '2026-02-08T10:23:36.743Z'::timestamptz,
  '2026-02-08T10:23:36.743Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_0',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'normal isso no começo. depois melhora',
  '2026-02-04T10:38:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_1',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ghost_caio_run',
  'Caio Dias',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-04T10:58:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_2',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ghost_rafael_soares',
  'Rafael Soares',
  'No meu caso… tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-04T11:43:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_3',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ghost_igor_nascimento',
  'Igor Nascimento',
  'não sou especialista, mas… tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-04T12:13:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_4',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ghost_caiolopes',
  'Caio Lopes',
  'Não sou especialista, mas… to na mesma situacao q vc. vamos junto!',
  '2026-02-04T12:23:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_5',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ghost_leandro_',
  'Leandro Costa',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-04T12:32:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_6',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ghost_matheus93',
  'Matheus Carvalho',
  'Cara, comigo foi assim… to na mesma situacao q vc. vamos junto!',
  '2026-02-04T12:54:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_0_7',
  'hipercifose-drenagem',
  'post_hipercifose_1',
  'ia_facilitadora',
  'NutriFit Coach',
  'Já passei por isso… Concordo. Yoga e pilates trabalham mobilidade toracica, o que libera a respiracao e consequentemente melhora circulacao. Quem aqui ja testou ambos? Qual preferem?',
  '2026-02-04T13:09:36.743Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_1_0',
  'hipercifose-drenagem',
  'post_hipercifose_2',
  'ghost_carolina_vieira',
  'Carolina Vieira',
  'Já passei por isso… normal isso no começo. depois melhora',
  '2026-02-05T10:46:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_1_1',
  'hipercifose-drenagem',
  'post_hipercifose_2',
  'ghost_amanda_rodrigues',
  'Amanda Rodrigues',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-05T11:08:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_1_2',
  'hipercifose-drenagem',
  'post_hipercifose_2',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-05T11:44:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_1_3',
  'hipercifose-drenagem',
  'post_hipercifose_2',
  'ghost_henrique0',
  'Henrique Lima',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-05T12:19:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_1_4',
  'hipercifose-drenagem',
  'post_hipercifose_2',
  'ghost_caio_run',
  'Caio Dias',
  'no meu caso demorou uns 2 meses pra ver resultado... paciencia',
  '2026-02-05T12:33:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_2_0',
  'hipercifose-drenagem',
  'post_hipercifose_3',
  'ghost_amanda70',
  'Amanda Ferreira',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-06T11:03:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_2_1',
  'hipercifose-drenagem',
  'post_hipercifose_3',
  'ghost_caio_run',
  'Caio Dias',
  'acho q depende muito da pessoa... nao da pra generalizar',
  '2026-02-06T11:48:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_2_2',
  'hipercifose-drenagem',
  'post_hipercifose_3',
  'ghost_fernando_alves',
  'Fernando Alves',
  'Não sou especialista, mas… normal isso no começo. depois melhora',
  '2026-02-06T12:08:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_3_0',
  'hipercifose-drenagem',
  'post_hipercifose_4',
  'ghost_henrique_almeida',
  'Henrique Almeida',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-07T10:49:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_3_1',
  'hipercifose-drenagem',
  'post_hipercifose_4',
  'ghost_fernanda_soares',
  'Fernanda Soares',
  'essa crença de metabolismo lento é mito... CICO funciona pra todo mundo',
  '2026-02-07T11:26:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_3_2',
  'hipercifose-drenagem',
  'post_hipercifose_4',
  'ghost_anaribeiro',
  'Ana Ribeiro',
  'deficit calorico é oq importa no final. pode comer carbo a noite sim',
  '2026-02-07T11:45:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_3_3',
  'hipercifose-drenagem',
  'post_hipercifose_4',
  'ghost_gabriela_rodrigues',
  'Gabriela Rodrigues',
  'nao sou especialista, mas… diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-07T12:21:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_3_4',
  'hipercifose-drenagem',
  'post_hipercifose_4',
  'ghost_amandaalves',
  'Amanda Alves',
  'No meu caso… deficit calorico é oq importa no final. pode comer carbo a noite sim',
  '2026-02-07T12:57:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_3_5',
  'hipercifose-drenagem',
  'post_hipercifose_4',
  'ghost_henrique0',
  'Henrique Lima',
  'acho q depende muito da pessoa. nao da pra generalizar',
  '2026-02-07T13:02:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_3_6',
  'hipercifose-drenagem',
  'post_hipercifose_4',
  'ghost_amanda70',
  'Amanda Ferreira',
  'não sou especialista, mas… essa crença de metabolismo lento é mito... CICO funciona pra todo mundo',
  '2026-02-07T13:31:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_4_0',
  'hipercifose-drenagem',
  'post_hipercifose_5',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'nao sou especialista, mas… hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-08T10:45:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_4_1',
  'hipercifose-drenagem',
  'post_hipercifose_5',
  'ghost_vanessabarbosa',
  'Vanessa Barbosa',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-08T11:10:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_4_2',
  'hipercifose-drenagem',
  'post_hipercifose_5',
  'ghost_leandro_',
  'Leandro Costa',
  'tenta aumentar a proteina pra 1.6-2g por kg... comigo funcionou',
  '2026-02-08T11:32:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_4_3',
  'hipercifose-drenagem',
  'post_hipercifose_5',
  'ghost_gabriela_rodrigues',
  'Gabriela Rodrigues',
  'acho q depende muito da pessoa. nao da pra generalizar',
  '2026-02-08T11:45:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_4_4',
  'hipercifose-drenagem',
  'post_hipercifose_5',
  'ghost_gabrielcastro',
  'Gabriel Castro',
  'discordo. no meu caso foi totalmente diferente',
  '2026-02-08T12:12:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_hipercifose_4_5',
  'hipercifose-drenagem',
  'post_hipercifose_5',
  'ghost_bruno_dias',
  'Bruno Dias',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-08T12:45:36.743Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;


-- ════ ARENA 4: Meia Compressão ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_patricia4',
  'patricia4@gmail.com',
  'Patricia Barbosa',
  'patricia4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=patricia4',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_lucas14',
  'lucas14@outlook.com',
  'Lucas Alves',
  'lucas14',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas14',
  'Sempre buscando evolução.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_matheus93',
  'matheus93@hotmail.com',
  'Matheus Carvalho',
  'matheus93',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=matheus93',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_luciana_',
  'luciana_@outlook.com',
  'Luciana Rodrigues',
  'luciana_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=luciana_',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_igor_nascimento',
  'igor_nascimento@outlook.com',
  'Igor Nascimento',
  'igor_nascimento',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=igor_nascimento',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela22',
  'rafaela22@yahoo.com.br',
  'Rafaela Fernandes',
  'rafaela22',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela22',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amandaalves',
  'amandaalves@outlook.com',
  'Amanda Alves',
  'amandaalves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amandaalves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila_fernandes',
  'priscila_fernandes@hotmail.com',
  'Priscila Fernandes',
  'priscila_fernandes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila_fernandes',
  'Iniciante tentando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila96',
  'priscila96@hotmail.com',
  'Priscila Souza',
  'priscila96',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila96',
  'Iniciante tentando ganhar massa muscular.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_leandro_',
  'leandro_@yahoo.com.br',
  'Leandro Costa',
  'leandro_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=leandro_',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela63',
  'rafaela63@gmail.com',
  'Rafaela Oliveira',
  'rafaela63',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela63',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_active',
  'henrique_active@yahoo.com.br',
  'Henrique Oliveira',
  'henrique_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_active',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_tatiana_ferreira',
  'tatiana_ferreira@outlook.com',
  'Tatiana Ferreira',
  'tatiana_ferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=tatiana_ferreira',
  'Cético de modinha.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolinalopes',
  'carolinalopes@yahoo.com.br',
  'Carolina Lopes',
  'carolinalopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolinalopes',
  'Apaixonado por treino.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_felipe_martins',
  'felipe_martins@hotmail.com',
  'Felipe Martins',
  'felipe_martins',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=felipe_martins',
  'Sempre buscando evolução.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_caio_run',
  'caio_run@yahoo.com.br',
  'Caio Dias',
  'caio_run',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=caio_run',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rodrigo_wellness',
  'rodrigo_wellness@gmail.com',
  'Rodrigo Lopes',
  'rodrigo_wellness',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rodrigo_wellness',
  'Mostrem os estudos.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda70',
  'amanda70@gmail.com',
  'Amanda Ferreira',
  'amanda70',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda70',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessa43',
  'vanessa43@hotmail.com',
  'Vanessa Fernandes',
  'vanessa43',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessa43',
  'Iniciante tentando voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabriela_rocha',
  'gabriela_rocha@outlook.com',
  'Gabriela Rocha',
  'gabriela_rocha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriela_rocha',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_caiolopes',
  'caiolopes@hotmail.com',
  'Caio Lopes',
  'caiolopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=caiolopes',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vitorferreira',
  'vitorferreira@gmail.com',
  'Vitor Ferreira',
  'vitorferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vitorferreira',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessabarbosa',
  'vanessabarbosa@yahoo.com.br',
  'Vanessa Barbosa',
  'vanessabarbosa',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessabarbosa',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carlos_almeida',
  'carlos_almeida@gmail.com',
  'Carlos Almeida',
  'carlos_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos_almeida',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_compressao_1',
  'arena_compressao',
  'ghost_patricia4',
  'diferenca entre meia estetica e terapeutica

qual a diferença real entre meia de compressão estética e terapêutica? são os mesmos benefícios ou é enganação?',
  true,
  '2026-02-04T10:23:36.745Z'::timestamptz,
  '2026-02-04T10:23:36.745Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_compressao_2',
  'arena_compressao',
  'ghost_priscila_fernandes',
  'comprei meia de compressao mas nao sei se funciona

Não sou especialista, mas… comprei uma meia de compressão mas nao sei se to usando direito. tem que usar durante o treino ou só depois? alguém sabe',
  true,
  '2026-02-05T10:23:36.745Z'::timestamptz,
  '2026-02-05T10:23:36.745Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_compressao_3',
  'arena_compressao',
  'ghost_henrique_active',
  'comprei meia de compressao mas nao sei se funciona

comprei uma meia de compressão mas não sei se to usando direito. tem que usar durante o treino ou só depois? alguem sabe?',
  true,
  '2026-02-06T10:23:36.745Z'::timestamptz,
  '2026-02-06T10:23:36.745Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_compressao_4',
  'arena_compressao',
  'ghost_amanda70',
  'Já passei por isso… meia de compressao ou calça compressora?

qual é melhor pra treinar: meia de compressão ou calça compressora? tem diferença real ou tanto faz',
  true,
  '2026-02-07T10:23:36.745Z'::timestamptz,
  '2026-02-07T10:23:36.745Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_compressao_5',
  'arena_compressao',
  'ghost_vitorferreira',
  'diferenca entre meia estetica e terapeutica

qual a diferença real entre meia de compressão estética e terapêutica? são os mesmos benefícios ou é enganação?',
  true,
  '2026-02-08T10:23:36.745Z'::timestamptz,
  '2026-02-08T10:23:36.745Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_0_0',
  'meia-compressao-treino',
  'post_compressao_1',
  'ghost_lucas14',
  'Lucas Alves',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-04T10:46:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_0_1',
  'meia-compressao-treino',
  'post_compressao_1',
  'ghost_matheus93',
  'Matheus Carvalho',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-04T10:52:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_0_2',
  'meia-compressao-treino',
  'post_compressao_1',
  'ghost_luciana_',
  'Luciana Rodrigues',
  'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
  '2026-02-04T11:09:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_0_3',
  'meia-compressao-treino',
  'post_compressao_1',
  'ghost_igor_nascimento',
  'Igor Nascimento',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-04T11:45:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_0_4',
  'meia-compressao-treino',
  'post_compressao_1',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'normal isso no começo. depois melhora',
  '2026-02-04T11:56:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_0_5',
  'meia-compressao-treino',
  'post_compressao_1',
  'ghost_amandaalves',
  'Amanda Alves',
  'normal isso no começo. depois melhora',
  '2026-02-04T12:04:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_0_6',
  'meia-compressao-treino',
  'post_compressao_1',
  'ia_facilitadora',
  'NutriFit Coach',
  'A compressao potencializa o retorno linfatico quando ha movimento ritmico. Pergunta: quem usa percebe diferenca no pos-treino?',
  '2026-02-04T12:31:36.745Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_1_0',
  'meia-compressao-treino',
  'post_compressao_2',
  'ghost_priscila96',
  'Priscila Souza',
  'Já passei por isso… experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-05T10:46:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_1_1',
  'meia-compressao-treino',
  'post_compressao_2',
  'ghost_leandro_',
  'Leandro Costa',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-05T11:02:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_1_2',
  'meia-compressao-treino',
  'post_compressao_2',
  'ghost_rafaela63',
  'Rafaela Oliveira',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-05T11:14:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_1_3',
  'meia-compressao-treino',
  'post_compressao_2',
  'ia_facilitadora',
  'NutriFit Coach',
  'Boa observacao. Meia estetica tem baixa compressao (8-15 mmHg), terapeutica tem alta (20-30 mmHg). A diferenca é significativa. Alguem ja comparou os dois tipos?',
  '2026-02-05T11:42:36.745Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_2_0',
  'meia-compressao-treino',
  'post_compressao_3',
  'ghost_rafaela63',
  'Rafaela Oliveira',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-06T10:43:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_2_1',
  'meia-compressao-treino',
  'post_compressao_3',
  'ghost_tatiana_ferreira',
  'Tatiana Ferreira',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-06T10:48:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_2_2',
  'meia-compressao-treino',
  'post_compressao_3',
  'ghost_carolinalopes',
  'Carolina Lopes',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-06T11:19:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_2_3',
  'meia-compressao-treino',
  'post_compressao_3',
  'ghost_felipe_martins',
  'Felipe Martins',
  'passei anos fazendo errado... quando corrigi a tecnica mudou tudo',
  '2026-02-06T12:04:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_2_4',
  'meia-compressao-treino',
  'post_compressao_3',
  'ghost_caio_run',
  'Caio Dias',
  'passei anos fazendo errado. quando corrigi a tecnica mudou tudo',
  '2026-02-06T12:09:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_2_5',
  'meia-compressao-treino',
  'post_compressao_3',
  'ghost_rodrigo_wellness',
  'Rodrigo Lopes',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-06T12:18:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_2_6',
  'meia-compressao-treino',
  'post_compressao_3',
  'ia_facilitadora',
  'NutriFit Coach',
  'Boa observacao. Meia estetica tem baixa compressao (8-15 mmHg), terapeutica tem alta (20-30 mmHg). A diferenca é significativa. Alguem ja comparou os dois tipos?',
  '2026-02-06T12:41:36.745Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_3_0',
  'meia-compressao-treino',
  'post_compressao_4',
  'ghost_vanessa43',
  'Vanessa Fernandes',
  'nao sou especialista, mas… experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-07T10:59:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_3_1',
  'meia-compressao-treino',
  'post_compressao_4',
  'ghost_gabriela_rocha',
  'Gabriela Rocha',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-07T11:33:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_3_2',
  'meia-compressao-treino',
  'post_compressao_4',
  'ghost_leandro_',
  'Leandro Costa',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-07T12:01:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_3_3',
  'meia-compressao-treino',
  'post_compressao_4',
  'ghost_caiolopes',
  'Caio Lopes',
  'Cara, comigo foi assim… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-07T12:12:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_4_0',
  'meia-compressao-treino',
  'post_compressao_5',
  'ghost_caiolopes',
  'Caio Lopes',
  'eu fazia assim tb e não dava resultado... mudei pra X e melhorou',
  '2026-02-08T10:59:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_4_1',
  'meia-compressao-treino',
  'post_compressao_5',
  'ghost_caiolopes',
  'Caio Lopes',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-08T11:33:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_4_2',
  'meia-compressao-treino',
  'post_compressao_5',
  'ghost_patricia4',
  'Patricia Barbosa',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-08T11:52:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_4_3',
  'meia-compressao-treino',
  'post_compressao_5',
  'ghost_vanessabarbosa',
  'Vanessa Barbosa',
  'No meu caso… tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-08T12:34:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_compressao_4_4',
  'meia-compressao-treino',
  'post_compressao_5',
  'ghost_carlos_almeida',
  'Carlos Almeida',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-08T12:54:36.745Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;


-- ════ ARENA 5: Dor Menstrual ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_saude',
  'andre_saude@yahoo.com.br',
  'André Alves',
  'andre_saude',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_saude',
  'Treino há uns 2 anos. Foco em perder barriga.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique0',
  'henrique0@yahoo.com.br',
  'Henrique Lima',
  'henrique0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique0',
  'Intermediário buscando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabriela_rodrigues',
  'gabriela_rodrigues@hotmail.com',
  'Gabriela Rodrigues',
  'gabriela_rodrigues',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriela_rodrigues',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila41',
  'priscila41@gmail.com',
  'Priscila Barbosa',
  'priscila41',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila41',
  'Intermediário buscando melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabrielcastro',
  'gabrielcastro@outlook.com',
  'Gabriel Castro',
  'gabrielcastro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabrielcastro',
  'Começando agora. Objetivo: aumentar força.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafael_soares',
  'rafael_soares@yahoo.com.br',
  'Rafael Soares',
  'rafael_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafael_soares',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_bruno_dias',
  'bruno_dias@gmail.com',
  'Bruno Dias',
  'bruno_dias',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bruno_dias',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda_rodrigues',
  'amanda_rodrigues@hotmail.com',
  'Amanda Rodrigues',
  'amanda_rodrigues',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda_rodrigues',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rodrigo_santos',
  'rodrigo_santos@yahoo.com.br',
  'Rodrigo Santos',
  'rodrigo_santos',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rodrigo_santos',
  'Apaixonado por treino.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_almeida',
  'henrique_almeida@hotmail.com',
  'Henrique Almeida',
  'henrique_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_almeida',
  'Iniciante tentando correr melhor.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessabarbosa',
  'vanessabarbosa@yahoo.com.br',
  'Vanessa Barbosa',
  'vanessabarbosa',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessabarbosa',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela22',
  'rafaela22@yahoo.com.br',
  'Rafaela Fernandes',
  'rafaela22',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela22',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carlossilva',
  'carlossilva@hotmail.com',
  'Carlos Silva',
  'carlossilva',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlossilva',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vitorferreira',
  'vitorferreira@gmail.com',
  'Vitor Ferreira',
  'vitorferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vitorferreira',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_tatiana_ferreira',
  'tatiana_ferreira@outlook.com',
  'Tatiana Ferreira',
  'tatiana_ferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=tatiana_ferreira',
  'Cético de modinha.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolina_vieira',
  'carolina_vieira@yahoo.com.br',
  'Carolina Vieira',
  'carolina_vieira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolina_vieira',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_felipe_martins',
  'felipe_martins@hotmail.com',
  'Felipe Martins',
  'felipe_martins',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=felipe_martins',
  'Sempre buscando evolução.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela63',
  'rafaela63@gmail.com',
  'Rafaela Oliveira',
  'rafaela63',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela63',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_active',
  'andre_active@hotmail.com',
  'André Souza',
  'andre_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_active',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernando_alves',
  'fernando_alves@outlook.com',
  'Fernando Alves',
  'fernando_alves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernando_alves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_felipe45',
  'felipe45@outlook.com',
  'Felipe Barbosa',
  'felipe45',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=felipe45',
  'Começando agora. Objetivo: perder barriga.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_marianacastro',
  'marianacastro@hotmail.com',
  'Mariana Castro',
  'marianacastro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=marianacastro',
  'Começando agora. Objetivo: melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_leandro_',
  'leandro_@yahoo.com.br',
  'Leandro Costa',
  'leandro_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=leandro_',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_menstrual_1',
  'arena_menstrual',
  'ghost_andre_saude',
  'ciclicidade da dor é diagnostico

a dor cíclica (que piora na menstruação) pode ser usada como critério de diagnóstico de lipedema? ou é só sintoma comum?',
  true,
  '2026-02-04T10:23:36.746Z'::timestamptz,
  '2026-02-04T10:23:36.746Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_menstrual_2',
  'arena_menstrual',
  'ghost_henrique0',
  'anticoncepcional ajuda ou piora?

tomo anticoncepcional e não sei se ajuda ou piora o lipedema. alguém tem experiência com isso?',
  true,
  '2026-02-05T10:23:36.746Z'::timestamptz,
  '2026-02-05T10:23:36.746Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_menstrual_3',
  'arena_menstrual',
  'ghost_carlossilva',
  'Cara, comigo foi assim… lipedema piora com hormonios?

vi gente falando que hormônio piora lipedema. é verdade? minha dor sempre piora na menstruação',
  true,
  '2026-02-06T10:23:36.746Z'::timestamptz,
  '2026-02-06T10:23:36.746Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_menstrual_4',
  'arena_menstrual',
  'ghost_henrique0',
  'anticoncepcional ajuda ou piora?

tomo anticoncepcional e não sei se ajuda ou piora o lipedema. alguém tem experiência com isso?',
  true,
  '2026-02-07T10:23:36.746Z'::timestamptz,
  '2026-02-07T10:23:36.746Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_menstrual_5',
  'arena_menstrual',
  'ghost_felipe45',
  'dor nos nodulos antes ou durante menstruacao?

Já passei por isso… a dor piora antes da menstruação ou durante? pra mim é sempre uns 3 dias antes que fica insuportável',
  true,
  '2026-02-08T10:23:36.746Z'::timestamptz,
  '2026-02-08T10:23:36.746Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_0_0',
  'lipedema-dor-menstrual',
  'post_menstrual_1',
  'ghost_henrique0',
  'Henrique Lima',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-04T10:40:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_0_1',
  'lipedema-dor-menstrual',
  'post_menstrual_1',
  'ghost_gabriela_rodrigues',
  'Gabriela Rodrigues',
  'Cara, comigo foi assim… proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-04T11:17:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_0_2',
  'lipedema-dor-menstrual',
  'post_menstrual_1',
  'ghost_priscila41',
  'Priscila Barbosa',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-04T11:53:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_0_3',
  'lipedema-dor-menstrual',
  'post_menstrual_1',
  'ghost_gabrielcastro',
  'Gabriel Castro',
  'No meu caso… diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-04T12:02:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_0_4',
  'lipedema-dor-menstrual',
  'post_menstrual_1',
  'ghost_rafael_soares',
  'Rafael Soares',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-04T12:19:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_0_5',
  'lipedema-dor-menstrual',
  'post_menstrual_1',
  'ghost_bruno_dias',
  'Bruno Dias',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-04T12:57:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_1_0',
  'lipedema-dor-menstrual',
  'post_menstrual_2',
  'ghost_amanda_rodrigues',
  'Amanda Rodrigues',
  'No meu caso… proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-05T11:06:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_1_1',
  'lipedema-dor-menstrual',
  'post_menstrual_2',
  'ghost_rodrigo_santos',
  'Rodrigo Santos',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-05T11:50:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_1_2',
  'lipedema-dor-menstrual',
  'post_menstrual_2',
  'ghost_henrique_almeida',
  'Henrique Almeida',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-05T12:35:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_1_3',
  'lipedema-dor-menstrual',
  'post_menstrual_2',
  'ghost_vanessabarbosa',
  'Vanessa Barbosa',
  'Eu achava que era frescura, mas… proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-05T13:00:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_1_4',
  'lipedema-dor-menstrual',
  'post_menstrual_2',
  'ghost_vanessabarbosa',
  'Vanessa Barbosa',
  'Já passei por isso… experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-05T13:07:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_1_5',
  'lipedema-dor-menstrual',
  'post_menstrual_2',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'deficit calorico é oq importa no final. pode comer carbo a noite sim',
  '2026-02-05T13:35:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_2_0',
  'lipedema-dor-menstrual',
  'post_menstrual_3',
  'ghost_bruno_dias',
  'Bruno Dias',
  'passei anos fazendo errado... quando corrigi a tecnica mudou tudo',
  '2026-02-06T10:33:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_2_1',
  'lipedema-dor-menstrual',
  'post_menstrual_3',
  'ghost_vitorferreira',
  'Vitor Ferreira',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-06T10:54:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_2_2',
  'lipedema-dor-menstrual',
  'post_menstrual_3',
  'ghost_tatiana_ferreira',
  'Tatiana Ferreira',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-06T11:24:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_2_3',
  'lipedema-dor-menstrual',
  'post_menstrual_3',
  'ghost_carolina_vieira',
  'Carolina Vieira',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-06T11:45:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_2_4',
  'lipedema-dor-menstrual',
  'post_menstrual_3',
  'ghost_felipe_martins',
  'Felipe Martins',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-06T12:13:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_2_5',
  'lipedema-dor-menstrual',
  'post_menstrual_3',
  'ghost_rafaela63',
  'Rafaela Oliveira',
  'Não sou especialista, mas… comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-06T12:18:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_3_0',
  'lipedema-dor-menstrual',
  'post_menstrual_4',
  'ghost_andre_active',
  'André Souza',
  'proteina: 1.6-2.2g/kg. mais q isso nao agrega. estudos mostram',
  '2026-02-07T10:59:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_3_1',
  'lipedema-dor-menstrual',
  'post_menstrual_4',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'tem evidencia disso? pq tudo q eu li fala o contrario',
  '2026-02-07T11:11:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_3_2',
  'lipedema-dor-menstrual',
  'post_menstrual_4',
  'ghost_fernando_alves',
  'Fernando Alves',
  'proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-07T11:35:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_3_3',
  'lipedema-dor-menstrual',
  'post_menstrual_4',
  'ghost_felipe45',
  'Felipe Barbosa',
  'No meu caso… hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-07T12:05:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_3_4',
  'lipedema-dor-menstrual',
  'post_menstrual_4',
  'ghost_marianacastro',
  'Mariana Castro',
  'discordo. no meu caso foi totalmente diferente',
  '2026-02-07T12:46:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_3_5',
  'lipedema-dor-menstrual',
  'post_menstrual_4',
  'ghost_fernando_alves',
  'Fernando Alves',
  'proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-07T12:51:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_3_6',
  'lipedema-dor-menstrual',
  'post_menstrual_4',
  'ghost_leandro_',
  'Leandro Costa',
  'proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-07T12:59:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_4_0',
  'lipedema-dor-menstrual',
  'post_menstrual_5',
  'ghost_fernando_alves',
  'Fernando Alves',
  'proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-08T10:49:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_4_1',
  'lipedema-dor-menstrual',
  'post_menstrual_5',
  'ghost_henrique_almeida',
  'Henrique Almeida',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-08T10:55:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_4_2',
  'lipedema-dor-menstrual',
  'post_menstrual_5',
  'ghost_gabriela_rodrigues',
  'Gabriela Rodrigues',
  'Cara, comigo foi assim… eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-08T11:19:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_4_3',
  'lipedema-dor-menstrual',
  'post_menstrual_5',
  'ghost_tatiana_ferreira',
  'Tatiana Ferreira',
  'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
  '2026-02-08T11:43:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_4_4',
  'lipedema-dor-menstrual',
  'post_menstrual_5',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-08T12:15:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_4_5',
  'lipedema-dor-menstrual',
  'post_menstrual_5',
  'ghost_henrique_almeida',
  'Henrique Almeida',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-08T12:35:36.746Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_menstrual_4_6',
  'lipedema-dor-menstrual',
  'post_menstrual_5',
  'ia_facilitadora',
  'NutriFit Coach',
  'Dor ciclica nao é fraqueza. É fisiologia. Os hormonios realmente afetam o lipedema. O que mais te ajuda nesses dias: descanso ou adaptacao do treino?',
  '2026-02-08T12:51:36.746Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;


-- ════ ARENA 6: Glúteo Médio/Valgo ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_saude',
  'andre_saude@yahoo.com.br',
  'André Alves',
  'andre_saude',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_saude',
  'Treino há uns 2 anos. Foco em perder barriga.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila96',
  'priscila96@hotmail.com',
  'Priscila Souza',
  'priscila96',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila96',
  'Iniciante tentando ganhar massa muscular.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_igor_nascimento',
  'igor_nascimento@outlook.com',
  'Igor Nascimento',
  'igor_nascimento',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=igor_nascimento',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_matheus_castro',
  'matheus_castro@hotmail.com',
  'Matheus Castro',
  'matheus_castro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=matheus_castro',
  'Iniciante tentando emagrecer.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_patricia4',
  'patricia4@gmail.com',
  'Patricia Barbosa',
  'patricia4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=patricia4',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernanda_soares',
  'fernanda_soares@hotmail.com',
  'Fernanda Soares',
  'fernanda_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda_soares',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_caiolopes',
  'caiolopes@hotmail.com',
  'Caio Lopes',
  'caiolopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=caiolopes',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda_rodrigues',
  'amanda_rodrigues@hotmail.com',
  'Amanda Rodrigues',
  'amanda_rodrigues',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda_rodrigues',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_bruno_dias',
  'bruno_dias@gmail.com',
  'Bruno Dias',
  'bruno_dias',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bruno_dias',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila41',
  'priscila41@gmail.com',
  'Priscila Barbosa',
  'priscila41',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila41',
  'Intermediário buscando melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_camilacosta',
  'camilacosta@hotmail.com',
  'Camila Costa',
  'camilacosta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=camilacosta',
  'Começando agora. Objetivo: ganhar massa muscular.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafael_soares',
  'rafael_soares@yahoo.com.br',
  'Rafael Soares',
  'rafael_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafael_soares',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessa43',
  'vanessa43@hotmail.com',
  'Vanessa Fernandes',
  'vanessa43',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessa43',
  'Iniciante tentando voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabriela_rocha',
  'gabriela_rocha@outlook.com',
  'Gabriela Rocha',
  'gabriela_rocha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriela_rocha',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vitorferreira',
  'vitorferreira@gmail.com',
  'Vitor Ferreira',
  'vitorferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vitorferreira',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_almeida',
  'henrique_almeida@hotmail.com',
  'Henrique Almeida',
  'henrique_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_almeida',
  'Iniciante tentando correr melhor.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaelcosta',
  'rafaelcosta@outlook.com',
  'Rafael Costa',
  'rafaelcosta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaelcosta',
  'Intermediário buscando ficar saudável.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique0',
  'henrique0@yahoo.com.br',
  'Henrique Lima',
  'henrique0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique0',
  'Intermediário buscando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscilaferreira',
  'priscilaferreira@hotmail.com',
  'Priscila Ferreira',
  'priscilaferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscilaferreira',
  'Começando agora. Objetivo: voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_active',
  'andre_active@hotmail.com',
  'André Souza',
  'andre_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_active',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_leandro_',
  'leandro_@yahoo.com.br',
  'Leandro Costa',
  'leandro_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=leandro_',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vanessabarbosa',
  'vanessabarbosa@yahoo.com.br',
  'Vanessa Barbosa',
  'vanessabarbosa',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vanessabarbosa',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique_active',
  'henrique_active@yahoo.com.br',
  'Henrique Oliveira',
  'henrique_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique_active',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carlos_almeida',
  'carlos_almeida@gmail.com',
  'Carlos Almeida',
  'carlos_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos_almeida',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_gluteo_medio_1',
  'arena_gluteo_medio',
  'ghost_andre_saude',
  'qdo fortaleco meu joelho doi menos

comecei a treinar glúteo médio específico e meu joelho parou de doer qdo corro. a diferença é clara',
  true,
  '2026-02-04T10:23:36.747Z'::timestamptz,
  '2026-02-04T10:23:36.747Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_gluteo_medio_2',
  'arena_gluteo_medio',
  'ghost_patricia4',
  'sozinha nao resolveu

fiz só abdutora por meses mas não resolveu. qdo combinei com agachamento e unilateral aí sim melhorou',
  true,
  '2026-02-05T10:23:36.747Z'::timestamptz,
  '2026-02-05T10:23:36.747Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_gluteo_medio_3',
  'arena_gluteo_medio',
  'ghost_bruno_dias',
  'gluteo medio muda formato do quadril

fortalecer glúteo médio realmente muda o formato do quadril ou é só melhora de postura',
  true,
  '2026-02-06T10:23:36.747Z'::timestamptz,
  '2026-02-06T10:23:36.747Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_gluteo_medio_4',
  'arena_gluteo_medio',
  'ghost_priscila41',
  'gluteo medio muda formato do quadril?

fortalecer glúteo médio realmente muda o formato do quadril ou é só melhora de postura',
  true,
  '2026-02-07T10:23:36.747Z'::timestamptz,
  '2026-02-07T10:23:36.747Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_gluteo_medio_5',
  'arena_gluteo_medio',
  'ghost_leandro_',
  'valgo dinamico é sempre problema?

todo mundo fala mal de valgo dinâmico mas será que sempre é problema? ou depende do grau e da pessoa?',
  true,
  '2026-02-08T10:23:36.747Z'::timestamptz,
  '2026-02-08T10:23:36.747Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_0_0',
  'gluteo-medio-valgo',
  'post_gluteo_medio_1',
  'ghost_priscila96',
  'Priscila Souza',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-04T10:42:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_0_1',
  'gluteo-medio-valgo',
  'post_gluteo_medio_1',
  'ghost_igor_nascimento',
  'Igor Nascimento',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-04T11:02:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_0_2',
  'gluteo-medio-valgo',
  'post_gluteo_medio_1',
  'ghost_matheus_castro',
  'Matheus Castro',
  'Cara, comigo foi assim… comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-04T11:22:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_1_0',
  'gluteo-medio-valgo',
  'post_gluteo_medio_2',
  'ghost_fernanda_soares',
  'Fernanda Soares',
  'Já passei por isso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-05T10:57:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_1_1',
  'gluteo-medio-valgo',
  'post_gluteo_medio_2',
  'ghost_priscila96',
  'Priscila Souza',
  'Eu achava que era frescura, mas… comigo tb foi assim... levou uns 3 meses pra pegar o jeito',
  '2026-02-05T11:14:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_1_2',
  'gluteo-medio-valgo',
  'post_gluteo_medio_2',
  'ghost_caiolopes',
  'Caio Lopes',
  'normal isso no começo. depois melhora',
  '2026-02-05T11:38:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_1_3',
  'gluteo-medio-valgo',
  'post_gluteo_medio_2',
  'ghost_amanda_rodrigues',
  'Amanda Rodrigues',
  'Cara, comigo foi assim… normal isso no começo. depois melhora',
  '2026-02-05T12:15:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_2_0',
  'gluteo-medio-valgo',
  'post_gluteo_medio_3',
  'ghost_priscila41',
  'Priscila Barbosa',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-06T10:48:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_2_1',
  'gluteo-medio-valgo',
  'post_gluteo_medio_3',
  'ghost_camilacosta',
  'Camila Costa',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-06T11:09:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_2_2',
  'gluteo-medio-valgo',
  'post_gluteo_medio_3',
  'ghost_rafael_soares',
  'Rafael Soares',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-06T11:30:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_2_3',
  'gluteo-medio-valgo',
  'post_gluteo_medio_3',
  'ghost_vanessa43',
  'Vanessa Fernandes',
  'Cara, comigo foi assim… diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-06T11:50:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_2_4',
  'gluteo-medio-valgo',
  'post_gluteo_medio_3',
  'ghost_gabriela_rocha',
  'Gabriela Rocha',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-06T12:32:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_2_5',
  'gluteo-medio-valgo',
  'post_gluteo_medio_3',
  'ghost_vitorferreira',
  'Vitor Ferreira',
  'eu fazia assim tb e nao dava resultado... mudei pra X e melhorou',
  '2026-02-06T13:16:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_2_6',
  'gluteo-medio-valgo',
  'post_gluteo_medio_3',
  'ghost_igor_nascimento',
  'Igor Nascimento',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-06T13:26:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_3_0',
  'gluteo-medio-valgo',
  'post_gluteo_medio_4',
  'ghost_henrique_almeida',
  'Henrique Almeida',
  'Eu achava que era frescura, mas… experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-07T10:33:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_3_1',
  'gluteo-medio-valgo',
  'post_gluteo_medio_4',
  'ghost_rafaelcosta',
  'Rafael Costa',
  'no meu caso demorou uns 2 meses pra ver resultado... paciencia',
  '2026-02-07T11:14:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_3_2',
  'gluteo-medio-valgo',
  'post_gluteo_medio_4',
  'ghost_henrique0',
  'Henrique Lima',
  'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
  '2026-02-07T11:58:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_3_3',
  'gluteo-medio-valgo',
  'post_gluteo_medio_4',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-07T12:39:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_3_4',
  'gluteo-medio-valgo',
  'post_gluteo_medio_4',
  'ghost_andre_active',
  'André Souza',
  'eu fazia assim tb e nao dava resultado. mudei pra X e melhorou',
  '2026-02-07T12:55:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_3_5',
  'gluteo-medio-valgo',
  'post_gluteo_medio_4',
  'ghost_vanessa43',
  'Vanessa Fernandes',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-07T13:14:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_4_0',
  'gluteo-medio-valgo',
  'post_gluteo_medio_5',
  'ghost_vanessabarbosa',
  'Vanessa Barbosa',
  'Já passei por isso… hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-08T11:08:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_4_1',
  'gluteo-medio-valgo',
  'post_gluteo_medio_5',
  'ghost_igor_nascimento',
  'Igor Nascimento',
  'discordo. no meu caso foi totalmente diferente',
  '2026-02-08T11:44:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_4_2',
  'gluteo-medio-valgo',
  'post_gluteo_medio_5',
  'ghost_henrique_active',
  'Henrique Oliveira',
  'deficit calorico é oq importa no final. pode comer carbo a noite sim',
  '2026-02-08T12:11:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_4_3',
  'gluteo-medio-valgo',
  'post_gluteo_medio_5',
  'ghost_carlos_almeida',
  'Carlos Almeida',
  'Já passei por isso… proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-08T12:33:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_gluteo_medio_4_4',
  'gluteo-medio-valgo',
  'post_gluteo_medio_5',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-08T12:55:36.747Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;


-- ════ ARENA 7: Liberação Miofascial ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscilaferreira',
  'priscilaferreira@hotmail.com',
  'Priscila Ferreira',
  'priscilaferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscilaferreira',
  'Começando agora. Objetivo: voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela63',
  'rafaela63@gmail.com',
  'Rafaela Oliveira',
  'rafaela63',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela63',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carlos_almeida',
  'carlos_almeida@gmail.com',
  'Carlos Almeida',
  'carlos_almeida',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos_almeida',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_active',
  'andre_active@hotmail.com',
  'André Souza',
  'andre_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_active',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaelcosta',
  'rafaelcosta@outlook.com',
  'Rafael Costa',
  'rafaelcosta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaelcosta',
  'Intermediário buscando ficar saudável.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_patricia4',
  'patricia4@gmail.com',
  'Patricia Barbosa',
  'patricia4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=patricia4',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafael_soares',
  'rafael_soares@yahoo.com.br',
  'Rafael Soares',
  'rafael_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafael_soares',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernando_alves',
  'fernando_alves@outlook.com',
  'Fernando Alves',
  'fernando_alves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernando_alves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_saude',
  'andre_saude@yahoo.com.br',
  'André Alves',
  'andre_saude',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_saude',
  'Treino há uns 2 anos. Foco em perder barriga.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda70',
  'amanda70@gmail.com',
  'Amanda Ferreira',
  'amanda70',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda70',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolina_vieira',
  'carolina_vieira@yahoo.com.br',
  'Carolina Vieira',
  'carolina_vieira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolina_vieira',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_bruno_dias',
  'bruno_dias@gmail.com',
  'Bruno Dias',
  'bruno_dias',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bruno_dias',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique0',
  'henrique0@yahoo.com.br',
  'Henrique Lima',
  'henrique0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique0',
  'Intermediário buscando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaela22',
  'rafaela22@yahoo.com.br',
  'Rafaela Fernandes',
  'rafaela22',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela22',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_caiolopes',
  'caiolopes@hotmail.com',
  'Caio Lopes',
  'caiolopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=caiolopes',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila_fernandes',
  'priscila_fernandes@hotmail.com',
  'Priscila Fernandes',
  'priscila_fernandes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila_fernandes',
  'Iniciante tentando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_vitorferreira',
  'vitorferreira@gmail.com',
  'Vitor Ferreira',
  'vitorferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=vitorferreira',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_sabrina_',
  'sabrina_@hotmail.com',
  'Sabrina Souza',
  'sabrina_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sabrina_',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_felipe_martins',
  'felipe_martins@hotmail.com',
  'Felipe Martins',
  'felipe_martins',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=felipe_martins',
  'Sempre buscando evolução.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolinalopes',
  'carolinalopes@yahoo.com.br',
  'Carolina Lopes',
  'carolinalopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolinalopes',
  'Apaixonado por treino.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_miofascial_1',
  'arena_miofascial',
  'ghost_priscilaferreira',
  'vale a pena investir em liberacao miofascial?

to querendo comprar rolo ou pistola de massagem mas são caros. vale mesmo a pena ou é só marketing?',
  true,
  '2026-02-04T10:23:36.748Z'::timestamptz,
  '2026-02-04T10:23:36.748Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_miofascial_2',
  'arena_miofascial',
  'ghost_patricia4',
  'ajuda na dor nao resolve tudo

liberação miofascial realmente ajuda na dor e deixa as pernas mais leves, mas nao resolve o lipedema. é complementar',
  true,
  '2026-02-05T10:23:36.748Z'::timestamptz,
  '2026-02-05T10:23:36.748Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_miofascial_3',
  'arena_miofascial',
  'ghost_amanda70',
  'Eu achava que era frescura, mas… quanto tempo fazer liberacao

não sou especialista. mas… quanto tempo devo fazer liberação miofascial? 5 minutos? 30 minutos? todo dia ou só depois do treino?',
  true,
  '2026-02-06T10:23:36.748Z'::timestamptz,
  '2026-02-06T10:23:36.748Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_miofascial_4',
  'arena_miofascial',
  'ghost_rafaelcosta',
  'diferenca entre liberacao e massagem comum?

qual a diferença real entre liberação miofascial e uma massagem comum? ou é só nome diferente pra mesma coisa?',
  true,
  '2026-02-07T10:23:36.748Z'::timestamptz,
  '2026-02-07T10:23:36.748Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_miofascial_5',
  'arena_miofascial',
  'ghost_vitorferreira',
  'ajuda na dor nao resolve tudo

liberação miofascial realmente ajuda na dor e deixa as pernas mais leves, mas não resolve o lipedema. é complementar',
  true,
  '2026-02-08T10:23:36.748Z'::timestamptz,
  '2026-02-08T10:23:36.748Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_0_0',
  'liberacao-miofascial-lipedema',
  'post_miofascial_1',
  'ghost_rafaela63',
  'Rafaela Oliveira',
  'proteina: 1.6-2.2g/kg. mais q isso nao agrega... estudos mostram',
  '2026-02-04T10:55:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_0_1',
  'liberacao-miofascial-lipedema',
  'post_miofascial_1',
  'ghost_carlos_almeida',
  'Carlos Almeida',
  'Já passei por isso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-04T11:08:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_0_2',
  'liberacao-miofascial-lipedema',
  'post_miofascial_1',
  'ghost_andre_active',
  'André Souza',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-04T11:53:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_0_3',
  'liberacao-miofascial-lipedema',
  'post_miofascial_1',
  'ghost_rafaelcosta',
  'Rafael Costa',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-04T12:09:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_1_0',
  'liberacao-miofascial-lipedema',
  'post_miofascial_2',
  'ghost_rafael_soares',
  'Rafael Soares',
  'normal isso no começo... depois melhora',
  '2026-02-05T10:29:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_1_1',
  'liberacao-miofascial-lipedema',
  'post_miofascial_2',
  'ghost_fernando_alves',
  'Fernando Alves',
  'Cara, comigo foi assim… to na mesma situacao q vc. vamos junto!',
  '2026-02-05T10:34:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_1_2',
  'liberacao-miofascial-lipedema',
  'post_miofascial_2',
  'ghost_andre_saude',
  'André Alves',
  'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
  '2026-02-05T11:02:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_2_0',
  'liberacao-miofascial-lipedema',
  'post_miofascial_3',
  'ghost_carolina_vieira',
  'Carolina Vieira',
  'to na mesma situacao q vc... vamos junto!',
  '2026-02-06T10:48:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_2_1',
  'liberacao-miofascial-lipedema',
  'post_miofascial_3',
  'ghost_bruno_dias',
  'Bruno Dias',
  'deficit calorico é oq importa no final. pode comer carbo a noite sim',
  '2026-02-06T11:14:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_2_2',
  'liberacao-miofascial-lipedema',
  'post_miofascial_3',
  'ghost_rafaela63',
  'Rafaela Oliveira',
  'Não sou especialista, mas… experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-06T11:27:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_2_3',
  'liberacao-miofascial-lipedema',
  'post_miofascial_3',
  'ghost_fernando_alves',
  'Fernando Alves',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-06T11:53:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_2_4',
  'liberacao-miofascial-lipedema',
  'post_miofascial_3',
  'ghost_henrique0',
  'Henrique Lima',
  'deficit calorico é oq importa no final. pode comer carbo a noite sim',
  '2026-02-06T12:21:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_2_5',
  'liberacao-miofascial-lipedema',
  'post_miofascial_3',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-06T12:50:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_2_6',
  'liberacao-miofascial-lipedema',
  'post_miofascial_3',
  'ghost_caiolopes',
  'Caio Lopes',
  'proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
  '2026-02-06T13:14:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_3_0',
  'liberacao-miofascial-lipedema',
  'post_miofascial_4',
  'ghost_fernando_alves',
  'Fernando Alves',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-07T10:43:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_3_1',
  'liberacao-miofascial-lipedema',
  'post_miofascial_4',
  'ghost_amanda70',
  'Amanda Ferreira',
  'Eu achava que era frescura, mas… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-07T11:03:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_3_2',
  'liberacao-miofascial-lipedema',
  'post_miofascial_4',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-07T11:29:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_4_0',
  'liberacao-miofascial-lipedema',
  'post_miofascial_5',
  'ghost_sabrina_',
  'Sabrina Souza',
  'normal isso no começo. depois melhora',
  '2026-02-08T10:37:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_4_1',
  'liberacao-miofascial-lipedema',
  'post_miofascial_5',
  'ghost_felipe_martins',
  'Felipe Martins',
  'passei anos fazendo errado. quando corrigi a tecnica mudou tudo',
  '2026-02-08T11:22:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_miofascial_4_2',
  'liberacao-miofascial-lipedema',
  'post_miofascial_5',
  'ghost_carolinalopes',
  'Carolina Lopes',
  'passei anos fazendo errado. quando corrigi a tecnica mudou tudo',
  '2026-02-08T11:34:36.748Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;


-- ════ ARENA 8: Desvio de Bacia ════

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amandaalves',
  'amandaalves@outlook.com',
  'Amanda Alves',
  'amandaalves',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amandaalves',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_patricia4',
  'patricia4@gmail.com',
  'Patricia Barbosa',
  'patricia4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=patricia4',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila_fernandes',
  'priscila_fernandes@hotmail.com',
  'Priscila Fernandes',
  'priscila_fernandes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila_fernandes',
  'Iniciante tentando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_matheus93',
  'matheus93@hotmail.com',
  'Matheus Carvalho',
  'matheus93',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=matheus93',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_marianacastro',
  'marianacastro@hotmail.com',
  'Mariana Castro',
  'marianacastro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=marianacastro',
  'Começando agora. Objetivo: melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_andre_active',
  'andre_active@hotmail.com',
  'André Souza',
  'andre_active',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=andre_active',
  'Começando agora. Objetivo: definir.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscilaferreira',
  'priscilaferreira@hotmail.com',
  'Priscila Ferreira',
  'priscilaferreira',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscilaferreira',
  'Começando agora. Objetivo: voltar a treinar.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_luciana_',
  'luciana_@outlook.com',
  'Luciana Rodrigues',
  'luciana_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=luciana_',
  'Curtindo o processo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_jessica19',
  'jessica19@hotmail.com',
  'Jessica Barbosa',
  'jessica19',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica19',
  'Iniciante tentando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carolinalopes',
  'carolinalopes@yahoo.com.br',
  'Carolina Lopes',
  'carolinalopes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carolinalopes',
  'Apaixonado por treino.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_henrique0',
  'henrique0@yahoo.com.br',
  'Henrique Lima',
  'henrique0',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique0',
  'Intermediário buscando melhorar postura.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_rafaelcosta',
  'rafaelcosta@outlook.com',
  'Rafael Costa',
  'rafaelcosta',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaelcosta',
  'Intermediário buscando ficar saudável.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_priscila96',
  'priscila96@hotmail.com',
  'Priscila Souza',
  'priscila96',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=priscila96',
  'Iniciante tentando ganhar massa muscular.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_leandro_',
  'leandro_@yahoo.com.br',
  'Leandro Costa',
  'leandro_',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=leandro_',
  'Baseio tudo em evidência.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_carlossilva',
  'carlossilva@hotmail.com',
  'Carlos Silva',
  'carlossilva',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=carlossilva',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernanda_soares',
  'fernanda_soares@hotmail.com',
  'Fernanda Soares',
  'fernanda_soares',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda_soares',
  'Voltando a treinar depois de muito tempo parado.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_bruno_dias',
  'bruno_dias@gmail.com',
  'Bruno Dias',
  'bruno_dias',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bruno_dias',
  'Treino regular, ainda aprendendo.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_matheus_castro',
  'matheus_castro@hotmail.com',
  'Matheus Castro',
  'matheus_castro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=matheus_castro',
  'Iniciante tentando emagrecer.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_gabriela_rocha',
  'gabriela_rocha@outlook.com',
  'Gabriela Rocha',
  'gabriela_rocha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=gabriela_rocha',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_amanda_rodrigues',
  'amanda_rodrigues@hotmail.com',
  'Amanda Rodrigues',
  'amanda_rodrigues',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda_rodrigues',
  'Novato, qualquer dica ajuda!',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "User" (id, email, name, username, avatar_url, bio, is_ghost_user, "createdAt", "updatedAt")
VALUES (
  'ghost_fernanda16',
  'fernanda16@gmail.com',
  'Fernanda Nascimento',
  'fernanda16',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda16',
  'Iniciante tentando melhorar condicionamento.',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_ghost_user = EXCLUDED.is_ghost_user;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_desvio_bacia_1',
  'arena_desvio_bacia',
  'ghost_amandaalves',
  'descobri que nao era gordura era postura

anos fazendo dieta achando q tinha gordura localizada. descobri q era desvio de bacia. quando corrigi a postura mudou tudo',
  true,
  '2026-02-04T10:23:36.749Z'::timestamptz,
  '2026-02-04T10:23:36.749Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_desvio_bacia_2',
  'arena_desvio_bacia',
  'ghost_priscila_fernandes',
  'Já passei por isso… desvio de bacia engorda?

No meu caso… tenho desvio de bacia e sempre tive barriga. será q tem relação ou é coincidência?',
  true,
  '2026-02-05T10:23:36.749Z'::timestamptz,
  '2026-02-05T10:23:36.749Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_desvio_bacia_3',
  'arena_desvio_bacia',
  'ghost_luciana_',
  'minha barriga mudou sem emagrecer

trabalhei correção postural por 3 meses. balança não mudou mas minha barriga diminuiu visivelmente. é impressionante',
  true,
  '2026-02-06T10:23:36.749Z'::timestamptz,
  '2026-02-06T10:23:36.749Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_desvio_bacia_4',
  'arena_desvio_bacia',
  'ghost_carlossilva',
  'Cara, comigo foi assim… como saber se tenho desvio de bacia?

nao sou especialista. mas… como eu sei se tenho desvio de bacia? tem algum teste simples que posso fazer sozinha ou precisa de profissional?',
  true,
  '2026-02-07T10:23:36.749Z'::timestamptz,
  '2026-02-07T10:23:36.749Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO "Post" (id, "arenaId", "userId", content, "isPublished", "createdAt", "updatedAt")
VALUES (
  'post_desvio_bacia_5',
  'arena_desvio_bacia',
  'ghost_matheus_castro',
  'nao sou especialista, mas… descobri que nao era gordura era postura

anos fazendo dieta achando q tinha gordura localizada. descobri q era desvio de bacia. quando corrigi a postura mudou tudo',
  true,
  '2026-02-08T10:23:36.749Z'::timestamptz,
  '2026-02-08T10:23:36.749Z'::timestamptz
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_0_0',
  'desvio-bacia-gordura',
  'post_desvio_bacia_1',
  'ghost_patricia4',
  'Patricia Barbosa',
  'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
  '2026-02-04T10:37:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_0_1',
  'desvio-bacia-gordura',
  'post_desvio_bacia_1',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'No meu caso… to na mesma situacao q vc. vamos junto!',
  '2026-02-04T10:47:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_0_2',
  'desvio-bacia-gordura',
  'post_desvio_bacia_1',
  'ghost_matheus93',
  'Matheus Carvalho',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-04T11:09:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_0_3',
  'desvio-bacia-gordura',
  'post_desvio_bacia_1',
  'ghost_marianacastro',
  'Mariana Castro',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-04T11:29:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_0_4',
  'desvio-bacia-gordura',
  'post_desvio_bacia_1',
  'ghost_andre_active',
  'André Souza',
  'tem evidencia disso? pq tudo q eu li fala o contrario',
  '2026-02-04T11:41:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_0_5',
  'desvio-bacia-gordura',
  'post_desvio_bacia_1',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-04T12:26:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_0_6',
  'desvio-bacia-gordura',
  'post_desvio_bacia_1',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'Cara, comigo foi assim… comigo tb foi assim... levou uns 3 meses pra pegar o jeito',
  '2026-02-04T12:49:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_1_0',
  'desvio-bacia-gordura',
  'post_desvio_bacia_2',
  'ghost_luciana_',
  'Luciana Rodrigues',
  'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
  '2026-02-05T10:34:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_1_1',
  'desvio-bacia-gordura',
  'post_desvio_bacia_2',
  'ghost_jessica19',
  'Jessica Barbosa',
  'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
  '2026-02-05T10:49:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_1_2',
  'desvio-bacia-gordura',
  'post_desvio_bacia_2',
  'ghost_carolinalopes',
  'Carolina Lopes',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-05T11:13:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_1_3',
  'desvio-bacia-gordura',
  'post_desvio_bacia_2',
  'ia_facilitadora',
  'NutriFit Coach',
  'Excelente relato. Alinhamento pelvico muda a projecao do abdomen e a silhueta geral, mesmo sem perder gordura. Vcs mediram antes e depois da correcao?',
  '2026-02-05T11:31:36.749Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_2_0',
  'desvio-bacia-gordura',
  'post_desvio_bacia_3',
  'ghost_henrique0',
  'Henrique Lima',
  'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
  '2026-02-06T10:37:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_2_1',
  'desvio-bacia-gordura',
  'post_desvio_bacia_3',
  'ghost_rafaelcosta',
  'Rafael Costa',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-06T11:20:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_2_2',
  'desvio-bacia-gordura',
  'post_desvio_bacia_3',
  'ghost_priscila96',
  'Priscila Souza',
  'No meu caso… to na mesma situacao q vc. vamos junto!',
  '2026-02-06T11:31:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_2_3',
  'desvio-bacia-gordura',
  'post_desvio_bacia_3',
  'ghost_leandro_',
  'Leandro Costa',
  'essa crença de metabolismo lento é mito. CICO funciona pra todo mundo',
  '2026-02-06T12:03:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_2_4',
  'desvio-bacia-gordura',
  'post_desvio_bacia_3',
  'ghost_andre_active',
  'André Souza',
  'Não sou especialista, mas… normal isso no começo... depois melhora',
  '2026-02-06T12:32:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_3_0',
  'desvio-bacia-gordura',
  'post_desvio_bacia_4',
  'ghost_matheus93',
  'Matheus Carvalho',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-07T10:56:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_3_1',
  'desvio-bacia-gordura',
  'post_desvio_bacia_4',
  'ghost_fernanda_soares',
  'Fernanda Soares',
  'experimenta treinar em jejum. pra mim fez diferenca',
  '2026-02-07T11:11:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_3_2',
  'desvio-bacia-gordura',
  'post_desvio_bacia_4',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-07T11:28:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_3_3',
  'desvio-bacia-gordura',
  'post_desvio_bacia_4',
  'ghost_bruno_dias',
  'Bruno Dias',
  'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
  '2026-02-07T11:48:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_3_4',
  'desvio-bacia-gordura',
  'post_desvio_bacia_4',
  'ghost_leandro_',
  'Leandro Costa',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-07T11:54:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_4_0',
  'desvio-bacia-gordura',
  'post_desvio_bacia_5',
  'ghost_gabriela_rocha',
  'Gabriela Rocha',
  'discordo. no meu caso foi totalmente diferente',
  '2026-02-08T11:00:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_4_1',
  'desvio-bacia-gordura',
  'post_desvio_bacia_5',
  'ghost_amanda_rodrigues',
  'Amanda Rodrigues',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-08T11:28:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_4_2',
  'desvio-bacia-gordura',
  'post_desvio_bacia_5',
  'ghost_carolinalopes',
  'Carolina Lopes',
  'no meu caso demorou uns 2 meses pra ver resultado... paciencia',
  '2026-02-08T11:40:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_4_3',
  'desvio-bacia-gordura',
  'post_desvio_bacia_5',
  'ghost_jessica19',
  'Jessica Barbosa',
  'normal isso no começo. depois melhora',
  '2026-02-08T12:03:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_4_4',
  'desvio-bacia-gordura',
  'post_desvio_bacia_5',
  'ghost_gabriela_rocha',
  'Gabriela Rocha',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-08T12:30:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_4_5',
  'desvio-bacia-gordura',
  'post_desvio_bacia_5',
  'ghost_fernanda16',
  'Fernanda Nascimento',
  'nao sou especialista, mas… essa crença de metabolismo lento é mito. CICO funciona pra todo mundo',
  '2026-02-08T12:36:36.749Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, is_ia)
VALUES (
  'msg_desvio_bacia_4_6',
  'desvio-bacia-gordura',
  'post_desvio_bacia_5',
  'ia_facilitadora',
  'NutriFit Coach',
  'Já passei por isso… Interessante debate sobre profissional. Idealmente fisio avalia e corrige, personal fortalece os padroes corretos. Os dois juntos é melhor. Qual caminho vcs seguiram?',
  '2026-02-08T13:05:36.749Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;


-- ════════════════════════════════════════════════════════
-- RESUMO: 176 users | 40 threads | 203 msgs
-- ════════════════════════════════════════════════════════
