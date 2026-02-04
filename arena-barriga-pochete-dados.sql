-- SQL PARA POVOAR ARENA BARRIGA-POCHETE-POSTURA

-- 1. CRIAR GHOST USERS
INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_rafaela96', 'rafaela96@yahoo.com.br', 'Rafaela Alves', 'rafaela96', 'https://api.dicebear.com/7.x/avataaars/svg?seed=rafaela96', 'Intermediário buscando emagrecer.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_pedroalmeida', 'pedroalmeida@yahoo.com.br', 'Pedro Almeida', 'pedroalmeida', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedroalmeida', 'Voltando a treinar depois de muito tempo parado.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_fernando_santos', 'fernando_santos@gmail.com', 'Fernando Santos', 'fernando_santos', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fernando_santos', 'Iniciante tentando perder barriga.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_joaorocha', 'joaorocha@hotmail.com', 'João Rocha', 'joaorocha', 'https://api.dicebear.com/7.x/avataaars/svg?seed=joaorocha', 'Treino regular, ainda aprendendo.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_fernanda73', 'fernanda73@gmail.com', 'Fernanda Santos', 'fernanda73', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda73', 'Iniciante tentando ganhar massa muscular.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_tatianalima', 'tatianalima@gmail.com', 'Tatiana Lima', 'tatianalima', 'https://api.dicebear.com/7.x/avataaars/svg?seed=tatianalima', 'Voltando a treinar depois de muito tempo parado.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_gustavo43', 'gustavo43@gmail.com', 'Gustavo Costa', 'gustavo43', 'https://api.dicebear.com/7.x/avataaars/svg?seed=gustavo43', 'Voltando a treinar depois de muito tempo parado.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_diegocosta', 'diegocosta@gmail.com', 'Diego Costa', 'diegocosta', 'https://api.dicebear.com/7.x/avataaars/svg?seed=diegocosta', 'Experiente em musculação.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_thiago11', 'thiago11@hotmail.com', 'Thiago Souza', 'thiago11', 'https://api.dicebear.com/7.x/avataaars/svg?seed=thiago11', 'Iniciante tentando melhorar postura.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_carolina_fit', 'carolina_fit@outlook.com', 'Carolina Pereira', 'carolina_fit', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carolina_fit', 'Iniciante tentando correr melhor.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_felipe92', 'felipe92@outlook.com', 'Felipe Silva', 'felipe92', 'https://api.dicebear.com/7.x/avataaars/svg?seed=felipe92', 'Treino há uns 2 anos. Foco em melhorar postura.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_pedro_fernandes', 'pedro_fernandes@hotmail.com', 'Pedro Fernandes', 'pedro_fernandes', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro_fernandes', 'Questiono tudo antes de aplicar.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_ana57', 'ana57@hotmail.com', 'Ana Barbosa', 'ana57', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana57', 'Iniciante tentando melhorar postura.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_diego96', 'diego96@hotmail.com', 'Diego Souza', 'diego96', 'https://api.dicebear.com/7.x/avataaars/svg?seed=diego96', 'Iniciante tentando melhorar postura.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_carolinacosta', 'carolinacosta@outlook.com', 'Carolina Costa', 'carolinacosta', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carolinacosta', 'Baseio tudo em evidência.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_carlos15', 'carlos15@hotmail.com', 'Carlos Fernandes', 'carlos15', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos15', 'Iniciante tentando definir.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_fernando_', 'fernando_@gmail.com', 'Fernando Almeida', 'fernando_', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fernando_', 'Voltando a treinar depois de muito tempo parado.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_sabrinamartins', 'sabrinamartins@hotmail.com', 'Sabrina Martins', 'sabrinamartins', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sabrinamartins', 'Treino há uns 2 anos. Foco em aumentar força.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_joaorodrigues', 'joaorodrigues@yahoo.com.br', 'João Rodrigues', 'joaorodrigues', 'https://api.dicebear.com/7.x/avataaars/svg?seed=joaorodrigues', 'Iniciante tentando ficar saudável.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_amanda_treino', 'amanda_treino@outlook.com', 'Amanda Costa', 'amanda_treino', 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda_treino', 'Iniciante tentando voltar a treinar.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_igoralmeida', 'igoralmeida@hotmail.com', 'Igor Almeida', 'igoralmeida', 'https://api.dicebear.com/7.x/avataaars/svg?seed=igoralmeida', 'Começando agora. Objetivo: aumentar força.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_henrique4', 'henrique4@outlook.com', 'Henrique Gomes', 'henrique4', 'https://api.dicebear.com/7.x/avataaars/svg?seed=henrique4', 'Intermediário buscando definir.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_gustavo_ferreira', 'gustavo_ferreira@outlook.com', 'Gustavo Ferreira', 'gustavo_ferreira', 'https://api.dicebear.com/7.x/avataaars/svg?seed=gustavo_ferreira', 'Voltando a treinar depois de muito tempo parado.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_fabio_life', 'fabio_life@outlook.com', 'Fabio Dias', 'fabio_life', 'https://api.dicebear.com/7.x/avataaars/svg?seed=fabio_life', 'Treino há uns 2 anos. Foco em emagrecer.', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, username, avatar_url, bio, is_ghost_user, created_at, updated_at)
VALUES ('ghost_andre9', 'andre9@hotmail.com', 'André Lima', 'andre9', 'https://api.dicebear.com/7.x/avataaars/svg?seed=andre9', 'Novato, qualquer dica ajuda!', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- 2. CRIAR THREADS (POSTS)
INSERT INTO posts (id, arena_id, user_id, title, content, is_published, created_at, updated_at)
VALUES ('post_1', (SELECT id FROM arenas WHERE slug = 'barriga-pochete-postura'), 'ghost_rafaela96', 'pilates mudou tudo', 'depois de anos tentando musculacao comecei pilates e em 3 meses a barriga sumiu sem emagrecer um kg. foi so ativacao de core msm', true, '2026-02-04T00:21:48.465Z', '2026-02-04T00:21:48.465Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, arena_id, user_id, title, content, is_published, created_at, updated_at)
VALUES ('post_2', (SELECT id FROM arenas WHERE slug = 'barriga-pochete-postura'), 'ghost_fernanda73', 'Cara, comigo foi assim… barriga que nao sai mesmo emagrecendo', 'No meu caso… faco reeducacao alimentar ha meses, emagreci no corpo todo menos na barriga. ela fica projetada pra frente tipo pochete... isso é gordura resistente ou outra coisa? ja tentei de tudo', true, '2026-02-05T00:21:48.465Z', '2026-02-05T00:21:48.465Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, arena_id, user_id, title, content, is_published, created_at, updated_at)
VALUES ('post_3', (SELECT id FROM arenas WHERE slug = 'barriga-pochete-postura'), 'ghost_pedro_fernandes', 'lordose lombar é sempre ruim?', 'tem gente q fala q toda lordose é problema. mas nao é uma curvatura natural da coluna? qual o limite entre normal e patologico?', true, '2026-02-06T00:21:48.465Z', '2026-02-06T00:21:48.465Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, arena_id, user_id, title, content, is_published, created_at, updated_at)
VALUES ('post_4', (SELECT id FROM arenas WHERE slug = 'barriga-pochete-postura'), 'ghost_fernando_', 'barriga so de um lado?', 'No meu caso… gente isso é normal? minha barriga fica mais projetada de um lado. parece q meu corpo é torto. alguem ja teve isso?', true, '2026-02-07T00:21:48.465Z', '2026-02-07T00:21:48.465Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, arena_id, user_id, title, content, is_published, created_at, updated_at)
VALUES ('post_5', (SELECT id FROM arenas WHERE slug = 'barriga-pochete-postura'), 'ghost_igoralmeida', 'descobri q era postura nao gordura', 'passei anos fazendo dieta e treino abdominal achando q minha barriga era gordura. ai descobri q era anteversao pelvica. quando corrijo a postura a barriga some', true, '2026-02-08T00:21:48.465Z', '2026-02-08T00:21:48.465Z')
ON CONFLICT (id) DO NOTHING;


-- 3. CRIAR MENSAGENS (RESPOSTAS)
INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_0_0', 'barriga-pochete-postura', 'ghost_pedroalmeida', 'Pedro Almeida', 'Não sou especialista, mas… to na mesma situacao q vc. vamos junto!', '2026-02-04T00:34:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_0_1', 'barriga-pochete-postura', 'ghost_fernando_santos', 'Fernando Santos', 'cara ja passei por isso tb... é frustrante demais mas nao desiste', '2026-02-04T00:45:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_0_2', 'barriga-pochete-postura', 'ghost_joaorocha', 'João Rocha', 'no meu caso demorou uns 2 meses pra ver resultado. paciencia', '2026-02-04T01:25:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_1_0', 'barriga-pochete-postura', 'ghost_tatianalima', 'Tatiana Lima', 'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso', '2026-02-05T00:58:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_1_1', 'barriga-pochete-postura', 'ghost_gustavo43', 'Gustavo Costa', 'proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram', '2026-02-05T01:09:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_1_2', 'barriga-pochete-postura', 'ghost_diegocosta', 'Diego Costa', 'proteina: 1.6-2.2g/kg... mais q isso não agrega. estudos mostram', '2026-02-05T01:26:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_1_3', 'barriga-pochete-postura', 'ghost_thiago11', 'Thiago Souza', 'experimenta treinar em jejum. pra mim fez diferenca', '2026-02-05T01:36:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_1_4', 'barriga-pochete-postura', 'ghost_carolina_fit', 'Carolina Pereira', 'Cara, comigo foi assim… eu fazia assim tb e não dava resultado. mudei pra X e melhorou', '2026-02-05T01:47:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_1_5', 'barriga-pochete-postura', 'ghost_felipe92', 'Felipe Silva', 'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada', '2026-02-05T02:27:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_2_0', 'barriga-pochete-postura', 'ghost_ana57', 'Ana Barbosa', 'essa crença de metabolismo lento é mito. CICO funciona pra todo mundo', '2026-02-06T00:55:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_2_1', 'barriga-pochete-postura', 'ghost_diego96', 'Diego Souza', 'deficit calorico é oq importa no final. pode comer carbo a noite sim', '2026-02-06T01:31:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_2_2', 'barriga-pochete-postura', 'ghost_fernanda73', 'Fernanda Santos', 'proteina: 1.6-2.2g/kg. mais q isso nao agrega. estudos mostram', '2026-02-06T01:59:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_2_3', 'barriga-pochete-postura', 'ghost_carolinacosta', 'Carolina Costa', 'tem evidencia disso? pq tudo q eu li fala o contrario', '2026-02-06T02:30:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_2_4', 'barriga-pochete-postura', 'ghost_pedroalmeida', 'Pedro Almeida', 'deficit calorico é oq importa no final. pode comer carbo a noite sim', '2026-02-06T03:14:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_2_5', 'barriga-pochete-postura', 'ghost_carlos15', 'Carlos Fernandes', 'discordo. no meu caso foi totalmente diferente', '2026-02-06T03:53:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_2_6', 'barriga-pochete-postura', 'ia_facilitadora', 'NutriFit Coach', 'Ponto importante. Gluteo fraco é uma das causas mais comuns de anteversao pelvica. Quem aqui ja fortaleceu gluteo e notou diferenca na barriga?', '2026-02-06T04:20:48.465Z', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_3_0', 'barriga-pochete-postura', 'ghost_sabrinamartins', 'Sabrina Martins', 'eu fazia assim tb e não dava resultado. mudei pra X e melhorou', '2026-02-07T00:59:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_3_1', 'barriga-pochete-postura', 'ghost_joaorodrigues', 'João Rodrigues', 'Cara, comigo foi assim… diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso', '2026-02-07T01:43:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_3_2', 'barriga-pochete-postura', 'ghost_amanda_treino', 'Amanda Costa', 'experimenta treinar em jejum. pra mim fez diferenca', '2026-02-07T02:11:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_4_0', 'barriga-pochete-postura', 'ghost_joaorodrigues', 'João Rodrigues', 'comigo tb foi assim. levou uns 3 meses pra pegar o jeito', '2026-02-08T00:43:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_4_1', 'barriga-pochete-postura', 'ghost_henrique4', 'Henrique Gomes', 'no meu caso demorou uns 2 meses pra ver resultado. paciencia', '2026-02-08T00:54:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_4_2', 'barriga-pochete-postura', 'ghost_gustavo_ferreira', 'Gustavo Ferreira', 'cara ja passei por isso tb... é frustrante demais mas nao desiste', '2026-02-08T01:13:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_4_3', 'barriga-pochete-postura', 'ghost_fabio_life', 'Fabio Dias', 'no meu caso demorou uns 2 meses pra ver resultado. paciencia', '2026-02-08T01:50:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_4_4', 'barriga-pochete-postura', 'ghost_felipe92', 'Felipe Silva', 'no meu caso demorou uns 2 meses pra ver resultado. paciencia', '2026-02-08T02:19:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, author_id, author_name, content, created_at, is_ia)
VALUES ('msg_4_5', 'barriga-pochete-postura', 'ghost_andre9', 'André Lima', 'normal isso no começo. depois melhora', '2026-02-08T02:30:48.465Z', false)
ON CONFLICT (id) DO NOTHING;

