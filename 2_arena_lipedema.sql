-- ════════════════════════════════════════════════════════
-- ARENA 2: Musculação Lipedema
-- ════════════════════════════════════════════════════════

-- Ghost Users (21)
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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

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
) ON CONFLICT (id) DO NOTHING;

-- Threads (5)
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

-- Mensagens (23)
INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_0_0',
  'musculacao-lipedema',
  'post_lipedema_1',
  'ghost_matheus93',
  'Matheus Carvalho',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-04T11:03:36.742Z'::timestamptz,
  '2026-02-04T11:03:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_0_1',
  'musculacao-lipedema',
  'post_lipedema_1',
  'ghost_lucas14',
  'Lucas Alves',
  'normal isso no começo. depois melhora',
  '2026-02-04T11:16:36.742Z'::timestamptz,
  '2026-02-04T11:16:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_0_2',
  'musculacao-lipedema',
  'post_lipedema_1',
  'ghost_priscilaferreira',
  'Priscila Ferreira',
  'No meu caso… discordo. no meu caso foi totalmente diferente',
  '2026-02-04T11:25:36.742Z'::timestamptz,
  '2026-02-04T11:25:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_1_0',
  'musculacao-lipedema',
  'post_lipedema_2',
  'ghost_carolinalopes',
  'Carolina Lopes',
  'tenta aumentar a proteina pra 1.6-2g por kg... comigo funcionou',
  '2026-02-05T10:39:36.742Z'::timestamptz,
  '2026-02-05T10:39:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_1_1',
  'musculacao-lipedema',
  'post_lipedema_2',
  'ghost_sabrina_',
  'Sabrina Souza',
  'Já passei por isso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-05T11:13:36.742Z'::timestamptz,
  '2026-02-05T11:13:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_1_2',
  'musculacao-lipedema',
  'post_lipedema_2',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'to na mesma situacao q vc... vamos junto!',
  '2026-02-05T11:41:36.742Z'::timestamptz,
  '2026-02-05T11:41:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_2_0',
  'musculacao-lipedema',
  'post_lipedema_3',
  'ghost_fernanda16',
  'Fernanda Nascimento',
  'to na mesma situacao q vc. vamos junto!',
  '2026-02-06T11:00:36.742Z'::timestamptz,
  '2026-02-06T11:00:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_2_1',
  'musculacao-lipedema',
  'post_lipedema_3',
  'ghost_gabriela_rodrigues',
  'Gabriela Rodrigues',
  'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
  '2026-02-06T11:32:36.742Z'::timestamptz,
  '2026-02-06T11:32:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_2_2',
  'musculacao-lipedema',
  'post_lipedema_3',
  'ghost_lucas14',
  'Lucas Alves',
  'cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-06T12:07:36.742Z'::timestamptz,
  '2026-02-06T12:07:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_3_0',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_amanda70',
  'Amanda Ferreira',
  'nao sou especialista, mas… hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-07T10:28:36.742Z'::timestamptz,
  '2026-02-07T10:28:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_3_1',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_vanessa43',
  'Vanessa Fernandes',
  'No meu caso… acho q depende muito da pessoa. nao da pra generalizar',
  '2026-02-07T10:47:36.742Z'::timestamptz,
  '2026-02-07T10:47:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_3_2',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_vanessabarbosa',
  'Vanessa Barbosa',
  'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-07T11:00:36.742Z'::timestamptz,
  '2026-02-07T11:00:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_3_3',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_priscila_fernandes',
  'Priscila Fernandes',
  'proteina: 1.6-2.2g/kg. mais q isso nao agrega. estudos mostram',
  '2026-02-07T11:28:36.742Z'::timestamptz,
  '2026-02-07T11:28:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_3_4',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ghost_rafael_soares',
  'Rafael Soares',
  'Cara, comigo foi assim… hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
  '2026-02-07T11:38:36.742Z'::timestamptz,
  '2026-02-07T11:38:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_3_5',
  'musculacao-lipedema',
  'post_lipedema_4',
  'ia_facilitadora',
  'NutriFit Coach',
  'Excelente relato. Quando o musculo trabalha, ele ajuda a drenar o liquido acumulado. Parar de treinar piora a estagnacao. Vcs sentem diferenca nos dias que treinam vs dias que nao treinam?',
  '2026-02-07T11:57:36.742Z'::timestamptz,
  '2026-02-07T11:57:36.742Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_0',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_fernanda_soares',
  'Fernanda Soares',
  'No meu caso… cara ja passei por isso tb... é frustrante demais mas nao desiste',
  '2026-02-08T10:54:36.742Z'::timestamptz,
  '2026-02-08T10:54:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_1',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_fernanda16',
  'Fernanda Nascimento',
  'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
  '2026-02-08T11:00:36.742Z'::timestamptz,
  '2026-02-08T11:00:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_2',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_rodrigo_wellness',
  'Rodrigo Lopes',
  'passei anos fazendo errado. quando corrigi a tecnica mudou tudo',
  '2026-02-08T11:24:36.742Z'::timestamptz,
  '2026-02-08T11:24:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_3',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_rafaela22',
  'Rafaela Fernandes',
  'cara ja passei por isso tb..... é frustrante demais mas nao desiste',
  '2026-02-08T11:30:36.742Z'::timestamptz,
  '2026-02-08T11:30:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_4',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_gabrielcastro',
  'Gabriel Castro',
  'não sou especialista, mas… cara ja passei por isso tb..... é frustrante demais mas nao desiste',
  '2026-02-08T12:06:36.742Z'::timestamptz,
  '2026-02-08T12:06:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_5',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_felipe_martins',
  'Felipe Martins',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-08T12:46:36.742Z'::timestamptz,
  '2026-02-08T12:46:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_6',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ghost_felipe_martins',
  'Felipe Martins',
  'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
  '2026-02-08T13:16:36.742Z'::timestamptz,
  '2026-02-08T13:16:36.742Z'::timestamptz,
  false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, post_id, author_id, author_name, content, created_at, updated_at, is_ia)
VALUES (
  'msg_lipedema_4_7',
  'musculacao-lipedema',
  'post_lipedema_5',
  'ia_facilitadora',
  'NutriFit Coach',
  'Faz sentido o medo. Mas hipertrofia muscular é diferente de inflamacao. Musculo forte melhora circulacao. Alguem conseguiu reduzir o inchaço fortalecendo as pernas?',
  '2026-02-08T13:41:36.742Z'::timestamptz,
  '2026-02-08T13:41:36.742Z'::timestamptz,
  true
) ON CONFLICT (id) DO NOTHING;

-- ✅ Arena 2 importada!
