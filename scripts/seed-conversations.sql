-- ═══════════════════════════════════════════════════════════════
-- SEED DE CONVERSAS REALISTAS - Gerado automaticamente
-- Execute no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- PASSO 1: Criar usuários mock

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'ana.silva@mock.com', 'Ana Silva', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'carlos.souza@mock.com', 'Carlos Souza', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'maria.santos@mock.com', 'Maria Santos', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'joao.lima@mock.com', 'João Lima', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'paula.mendes@mock.com', 'Paula Mendes', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'roberto.costa@mock.com', 'Roberto Costa', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'juliana.rocha@mock.com', 'Juliana Rocha', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'pedro.alves@mock.com', 'Pedro Alves', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'fernanda.dias@mock.com', 'Fernanda Dias', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'lucas.martins@mock.com', 'Lucas Martins', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'camila.freitas@mock.com', 'Camila Freitas', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'ricardo.nunes@mock.com', 'Ricardo Nunes', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'tatiana.gomes@mock.com', 'Tatiana Gomes', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'bruno.carvalho@mock.com', 'Bruno Carvalho', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'amanda.pires@mock.com', 'Amanda Pires', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'felipe.ramos@mock.com', 'Felipe Ramos', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'renata.moura@mock.com', 'Renata Moura', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'thiago.barros@mock.com', 'Thiago Barros', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'larissa.campos@mock.com', 'Larissa Campos', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'gustavo.pereira@mock.com', 'Gustavo Pereira', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'beatriz.gomes@mock.com', 'Beatriz Gomes', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'rodrigo.andrade@mock.com', 'Rodrigo Andrade', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'daniela.correia@mock.com', 'Daniela Correia', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'marcelo.pereira@mock.com', 'Marcelo Pereira', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'joao.carlos@mock.com', 'João Carlos', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'fernanda.alves@mock.com', 'Fernanda Alves', 'mock-password-hash', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'ia-facilitadora@mock.com', 'IA Facilitadora', 'mock-password-hash', 'ADMIN', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- PASSO 2: Inserir posts e comentários
DO $$
DECLARE
  v_arena_id TEXT;
  v_user_id TEXT;
  v_ia_user_id TEXT;
  v_post_id TEXT;
  v_post_date TIMESTAMP;
  v_comment_date TIMESTAMP;
  v_post_count INT;
  v_comment_count INT;
BEGIN

  -- Buscar ID da IA
  SELECT id INTO v_ia_user_id FROM "User" WHERE email = 'ia-facilitadora@mock.com' LIMIT 1;
  IF v_ia_user_id IS NULL THEN
    SELECT id INTO v_ia_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
  END IF;

  -- ════════════════════════════════════════
  -- Arena: lipedema
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'lipedema' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: lipedema';

    -- Thread 1: Protocolo nutricional para lipedema estágio 2
    v_post_date := NOW() - INTERVAL '7 days' - INTERVAL '22 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Protocolo nutricional para lipedema estágio 2**

Oi gente, minha nutricionista passou dieta anti-inflamatória pra ajudar no lipedema. Alguém aqui já testou retirar glúten e laticínios? Tô na 3ª semana e sinto menos inchaço nas pernas.', false, '#F0B27A', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'A abordagem anti-inflamatória é muito usada no manejo do lipedema. Estudos mostram que reduzir alimentos pró-inflamatórios pode diminuir retenção de líquidos e sensibilidade dolorosa. Você notou melhora na dor ao toque também?', true, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Eu fiz! Tirei glúten, laticínios e açúcar refinado por 3 meses. A diferença foi real - menos peso nas pernas e menos hematomas espontâneos.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Paula, como nutricionista posso dizer: a resposta varia muito. O mais importante é manter proteína adequada (1.6-2g/kg) pra não perder massa magra.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Complementando a Ana - meditação e yoga ajudaram muito o meu manejo. O estresse piora MUITO o lipedema.', false, '#73C6B6', v_comment_date, v_comment_date);

    -- Thread 2: Compressão durante exercícios - qual marca funciona?
    v_post_date := NOW() - INTERVAL '21 days' - INTERVAL '16 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Compressão durante exercícios - qual marca funciona?**

Meninas, preciso de indicação de meia de compressão pra usar no treino. As que comprei na farmácia incomodam demais. Alguém tem dica?', false, '#F0B27A', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Para exercícios com lipedema, meias de compressão graduada (20-30mmHg) são ideais. Marcas especializadas como Sigvaris, Venosan e Jobst costumam ter linhas esportivas mais confortáveis. O importante é que a compressão seja medida por profissional.', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Uso Sigvaris Cotton. É mais cara mas não esquenta tanto. Na musculação funciona super bem!', false, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'tatiana.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'No pilates uso a Venosan Legline. Dica: mede de manhã, antes do inchaço do dia.', false, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como fisio, reforço: NUNCA compre sem medição profissional. Compressão errada pode piorar a circulação.', false, '#FFEAA7', v_comment_date, v_comment_date);

    -- Thread 3: Exercício aquático: piscina ou hidro?
    v_post_date := NOW() - INTERVAL '9 days' - INTERVAL '14 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Exercício aquático: piscina ou hidro?**

Minha médica indicou exercícios na água. Mas não sei se faço natação ou hidroginástica. Qual melhor pro lipedema?', false, '#F1948A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ambos são excelentes! A pressão hidrostática da água atua como compressão natural e reduz edema. Natação trabalha mais cardiovascular, hidro tem mais foco em resistência muscular. Depende dos seus objetivos. Você prefere treino mais aeróbico ou de força?', true, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como ortopedista: para lipedema, deep water running é ouro. Combina cardio + resistência + compressão. Pergunte na academia se tem turma.', false, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Faço hidro 3x por semana e é a melhor coisa! Depois do treino as pernas ficam leves. Natação eu canso rápido mas hidro consigo fazer 1h tranquilo.', false, '#98D8C8', v_comment_date, v_comment_date);

    -- Thread 4: Resultados após 6 meses de tratamento
    v_post_date := NOW() - INTERVAL '3 days' - INTERVAL '23 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'tatiana.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Resultados após 6 meses de tratamento**

Vim compartilhar minha evolução! 6 meses de: dieta anti-inflamatória + pilates 3x + drenagem 2x + compressão diária. Reduzi 4cm de circunferência em cada coxa e a dor diminuiu 70%.', false, '#BB8FCE', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Resultados impressionantes, Tatiana! Essa combinação multimodal é exatamente o que a literatura recomenda. A consistência no tratamento faz toda diferença. Você manteve acompanhamento regular com sua equipe médica?', true, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Parabéns Tati!! Que inspiração! Estou no mês 2 e já vejo diferença. Seu relato me motiva demais.', false, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Maravilhosa! A constância é tudo mesmo. Quando eu parei a drenagem por 1 mês, voltou o inchaço.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Caso lindo! Como sua fisio, posso confirmar que esses números são reais e mensurados. Consistência é a chave.', false, '#D7BDE2', v_comment_date, v_comment_date);

    -- Thread 5: Lipedema e uso de canetas (Ozempic/Mounjaro)
    v_post_date := NOW() - INTERVAL '29 days' - INTERVAL '23 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Lipedema e uso de canetas (Ozempic/Mounjaro)**

Minha endo quer me prescrever Mounjaro pro lipedema. Estou com medo dos efeitos colaterais. Alguém aqui usa pra lipedema especificamente?', false, '#F0B27A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'As canetas de GLP-1 estão sendo estudadas como adjuvantes no tratamento do lipedema. A perda de peso pode reduzir a carga sobre o tecido afetado, mas o tecido lipedêmico em si responde diferente da gordura normal. É importante ter expectativas realistas. Sua endocrinologista explicou os prós e contras específicos pro seu caso?', true, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ana, como médico: canetas ajudam na gordura normal que acompanha o lipedema, mas o tecido lipedêmico responde pouco. O benefício é real mas limitado. Converse sobre a dose ideal pro seu peso.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Uso Ozempic há 4 meses. Perdi 8kg de gordura "normal" e o lipedema ficou mais evidente justamente por isso. Mas melhorou a mobilidade geral.', false, '#DDA0DD', v_comment_date, v_comment_date);

    -- Thread 6: Drenagem linfática: manual ou mecânica?
    v_post_date := NOW() - INTERVAL '1 days' - INTERVAL '17 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Drenagem linfática: manual ou mecânica?**

Minha fisio faz drenagem manual, mas vi umas botas pressurizadas (pressoterapia) que parecem boas. Alguém usa? É tão bom quanto a manual?', false, '#45B7D1', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'São complementares! A drenagem linfática manual (DLM) é mais precisa e pode adaptar a pressão por região. A pressoterapia mecânica é boa para manutenção entre sessões. Idealmente: DLM 2x/semana + pressoterapia nos outros dias.', true, '#45B7D1', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como fisio: DLM é insubstituível no lipedema. As botas são bom complemento mas NÃO substituem. A mão do profissional sente o tecido e adapta em tempo real.', false, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Tenho bota em casa e uso todo dia. Mas a sessão com a Juliana é outro nível. A bota ajuda a manter o resultado da DLM.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Comprei uma e uso assistindo TV. 20 minutos por dia faz diferença sim! Mas concordo que não substitui a profissional.', false, '#85C1E9', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: lipedema';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: lipedema-paradoxo
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'lipedema-paradoxo' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: lipedema-paradoxo';

    -- Thread 1: Cardio convencional piorou meu lipedema
    v_post_date := NOW() - INTERVAL '20 days' - INTERVAL '10 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Cardio convencional piorou meu lipedema**

Fiz 3 meses de HIIT achando que ia melhorar. PIOROU. Mais dor, mais inchaço, mais hematomas. Minha fisio falou que era previsível. Por quê ninguém avisa?', false, '#98D8C8', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Infelizmente essa é uma das grandes armadilhas no lipedema. O HIIT e exercícios de alto impacto geram microtraumas vasculares que, no tecido lipedêmico (já com capilares frágeis), aumentam edema e inflamação. O paradoxo é que cardio "normal" pode ser anti-terapêutico. O protocolo ideal é: AEJ (aeróbico em jejum) de baixa intensidade + compressão.', true, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Paula, sinto muito. Infelizmente muitos profissionais ainda não conhecem o lipedema. A regra é: se o exercício gera vermelhidão ou dor nas pernas = está inflamando = parar.', false, '#45B7D1', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'O paradoxo do cardio no lipedema: a intensidade que reduz gordura normal INFLAMA o tecido lipedêmico. Bike estacionária com compressão é a melhor opção cardio.', false, '#FF6B6B', v_comment_date, v_comment_date);

    -- Thread 2: Protocolo AEJ + compressão: como fazer certo
    v_post_date := NOW() - INTERVAL '4 days' - INTERVAL '18 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Protocolo AEJ + compressão: como fazer certo**

Comecei AEJ com meia de compressão. 40 min de caminhada leve em jejum. Já estou na 4ª semana. Quanto tempo pra ver resultado real?', false, '#F0B27A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'AEJ no lipedema tem resultados mais lentos que na gordura normal. Espere 8-12 semanas para mudanças mensuráveis. Monitorize: circunferência, dor ao toque, e inchaço vespertino. Se os 3 melhorarem, o protocolo está funcionando. Qual a intensidade da sua caminhada? Deve ser 50-60% da FC máxima, onde você conversa confortavelmente.', true, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ana, meço minha FC com relógio. Se passar de 120bpm (zona 2) eu reduzo o passo. Tenho lipedema há 5 anos e essa é a abordagem que funciona.', false, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Complementando: faço AEJ + yoga leve depois. A combinação é ouro. O yoga ajuda no retorno linfático.', false, '#73C6B6', v_comment_date, v_comment_date);

    -- Thread 3: Por que musculação SIM mas corrida NÃO?
    v_post_date := NOW() - INTERVAL '11 days' - INTERVAL '21 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Por que musculação SIM mas corrida NÃO?**

Minha médica liberou musculação mas proibiu corrida. Não entendi: os dois não são exercício? Qual a lógica?', false, '#4ECDC4', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Excelente pergunta! Na musculação, a contração muscular atua como "bomba" para o sistema linfático, auxiliando a drenagem. A carga é controlada e não há impacto repetitivo. Na corrida, o impacto constante + gravidade + vibração traumatiza os capilares frágeis do tecido lipedêmico, gerando micro-sangramentos e inflamação. É a natureza do impacto que faz a diferença, não a intensidade.', true, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Boa explicação da IA. Acrescento: na musculação o tecido está em contração isométrica (protegido). Na corrida está em vibração livre (vulnerável). Pensem no tecido como uma esponja frágil - compressão suave ajuda, impacto machuca.', false, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'tatiana.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'No pilates a lógica é parecida: controlamos cada movimento. Sem impacto, com compressão dos músculos. Por isso funciona tão bem pra lipedema!', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Depois que entendi isso, troquei corrida por bike + musculação. Mudou tudo! 3 meses sem hematoma novo.', false, '#FF6B6B', v_comment_date, v_comment_date);

    -- Thread 4: Relato: bike estacionária com compressão
    v_post_date := NOW() - INTERVAL '13 days' - INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Relato: bike estacionária com compressão**

Relato de 3 meses: bike estacionária 30min/dia, 5x/semana, sempre com meia 20-30mmHg. Resultados: -3cm de coxa, dor reduziu de 7 pra 3 (escala 0-10), zero hematomas novos. Quem mais faz bike com compressão?', false, '#73C6B6', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Resultados consistentes com o que a literatura mostra! A bike elimina o impacto, a compressão protege os capilares, e o movimento cíclico das pernas funciona como bomba linfática natural. 30 minutos em zona 2 é o sweet spot. Você monitora sua FC durante?', true, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Camila, inspirador! Vou comprar uma bike. Alguma recomendação? Magnética ou spinning?', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Magnética, Ana! Spinning tem pegada mais agressiva e posição que pode pressionar vasos. Bike magnética reclinada é perfeita pro lipedema.', false, '#98D8C8', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: lipedema-paradoxo';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: deficit-calorico
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'deficit-calorico' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: deficit-calorico';

    -- Thread 1: Déficit de 500kcal mas peso não cai
    v_post_date := NOW() - INTERVAL '29 days' - INTERVAL '5 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Déficit de 500kcal mas peso não cai**

Estou em déficit de 500kcal há 6 semanas (acompanhando com nutricionista). Peso não desceu nada! Gordura abdominal continua igual. O que pode estar errado?', false, '#F7DC6F', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Platô de 6 semanas merece investigação. Possibilidades: 1) Adaptação metabólica - seu corpo pode ter reduzido o gasto calórico, 2) Retenção hídrica mascarando perda de gordura, 3) Erro na contagem calórica (muito comum mesmo com profissional). Pergunta crucial: suas medidas de cintura mudaram? Peso corporal sozinho pode enganar.', true, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ana, já aconteceu comigo. Peso parado mas cintura diminuindo. Recomposição corporal é real. Mede com fita!', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Estresse e sono ruim também travam o emagrecimento. Cortisol alto = retenção de água + acúmulo abdominal. Você dorme bem?', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Passei por isso! No meu caso era NEAT que caiu. Eu estava mais sedentária sem perceber. Comecei a usar pedômetro e fez diferença.', false, '#FFEAA7', v_comment_date, v_comment_date);

    -- Thread 2: Refeeds e dias livres: ciência ou desculpa?
    v_post_date := NOW() - INTERVAL '2 days' - INTERVAL '0 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'lucas.martins@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Refeeds e dias livres: ciência ou desculpa?**

Meu coach prescreve refeed de carbo 1x por semana no déficit. Funciona mesmo ou é só desculpa pra comer mais? Sinto que perco o progresso da semana.', false, '#82E0AA', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Refeeds têm base científica sim! Após período em déficit, a leptina (hormônio da saciedade) cai. Um dia com carboidratos elevados pode: 1) Restaurar parcialmente a leptina, 2) Reabastecer glicogênio muscular, 3) Dar "break" psicológico. MAS: refeed ≠ cheat day descontrolado. Deve ser planejado, com aumento de carbo mantendo proteína, sem exceder manutenção calórica.', true, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Lucas, uso refeed em todas as preps. Faz diferença brutal no treino do dia seguinte e na aderência à dieta. Mas tem que ser carbo limpo, não pizza.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'bruno.carvalho@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'No meu caso, 1 refeed por semana permite déficit mais agressivo nos outros 6 dias. O resultado semanal é melhor do que déficit moderado 7 dias.', false, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Concordo com o Ricardo. Arroz, batata doce, frutas - não ultraprocessados. A resposta hormonal é diferente.', false, '#4ECDC4', v_comment_date, v_comment_date);

    -- Thread 3: Metabolismo adaptativo é mito?
    v_post_date := NOW() - INTERVAL '13 days' - INTERVAL '11 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'thiago.barros@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Metabolismo adaptativo é mito?**

Vi um influencer falando que "metabolismo lento" é mito e que todo mundo emagrece no déficit. Mas eu faço déficit certinho e NÃO emagreço mais. Explica isso.', false, '#BB8FCE', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Não é mito, mas é nuançado. "Metabolismo lento" como desculpa = mito. Adaptação metabólica real = ciência. Após semanas em déficit, seu corpo reduz: 1) NEAT (movimentos espontâneos), 2) Termogênese dos alimentos, 3) Hormônios tireoidianos. Isso pode reduzir seu gasto em 200-300kcal/dia. Solução: diet breaks periódicas (1-2 semanas na manutenção a cada 8-12 semanas de déficit).', true, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'gustavo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Thiago, metabolismo adaptativo é REAL. Participantes do Biggest Loser tiveram metabolismo 500kcal abaixo do esperado ANOS depois do programa. É adaptação, não preguiça.', false, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'A chave é: deficit MODERADO e sustentável. Déficits agressivos aceleram a adaptação. 15-20% abaixo da manutenção é o ideal.', false, '#82E0AA', v_comment_date, v_comment_date);

    -- Thread 4: NEAT: o segredo que ninguém fala
    v_post_date := NOW() - INTERVAL '12 days' - INTERVAL '11 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**NEAT: o segredo que ninguém fala**

Comecei a medir meu NEAT (gasto fora do treino) e descobri que ele CAIU 400kcal quando comecei a dieta. Sem perceber, eu parava de andar, ficava mais parado. Alguém mais notou isso?', false, '#45B7D1', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Carlos, você identificou um dos maiores sabotadores do déficit! O NEAT pode representar 15-50% do gasto calórico diário. Em dieta, o corpo reduz movimentos inconscientes (mexer perna, andar mais devagar, etc). Estratégia: meta de 8-10mil passos/dia garante NEAT mínimo. Algumas pessoas usam stand desk e alarmes para se mover a cada hora.', true, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Eu como corredor noto isso DEMAIS. Quando corto calorias, fico com preguiça de subir escada, caminho mais devagar. O corpo economiza sem avisar.', false, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Comprei smartwatch só pra isso! Nos dias que não bato 8mil passos, sei que meu déficit real é menor. Game changer.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Mães: brincar com as crianças conta como NEAT! Desde que comecei a ser "mãe ativa" meu gasto subiu uns 200kcal/dia fácil.', false, '#BB8FCE', v_comment_date, v_comment_date);

    -- Thread 5: Parar de contar calorias: quando?
    v_post_date := NOW() - INTERVAL '4 days' - INTERVAL '23 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Parar de contar calorias: quando?**

Estou ficando obsessiva com contagem de calorias. Pesando tudo, evitando comer fora, ansiedade quando não sei os macros. Isso é normal no início ou já é problema?', false, '#82E0AA', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Fernanda, obrigado por compartilhar. O que você descreve ultrapassa o cuidado saudável. Sinais de alerta: 1) Evitar situações sociais por causa da comida, 2) Ansiedade quando não sabe macros exatos, 3) Relação punitiva com alimentação. Contar calorias é FERRAMENTA, não estilo de vida permanente. Após aprender porções intuitivamente (4-8 semanas), muitos profissionais recomendam migrar para "eating by feel". Já conversou com sua nutricionista sobre isso?', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Fernanda, como nutricionista vejo isso MUITO. Contar calorias por mais de 3 meses seguidos aumenta risco de comportamento restritivo. O ideal é usar por período limitado pra calibrar o "olho".', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Passei por isso. A terapia cognitivo-comportamental me ajudou muito. Agora como intuitivamente e mantenho o peso.', false, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica: faça 4 semanas contando, 2 semanas intuitivo. Vai e volta até se sentir confiante sem contar. Funciona muito bem!', false, '#F0B27A', v_comment_date, v_comment_date);

    -- Thread 6: Efeito sanfona: como quebrar o ciclo
    v_post_date := NOW() - INTERVAL '16 days' - INTERVAL '17 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Efeito sanfona: como quebrar o ciclo**

Perdi 15kg 3 vezes na vida. Recuperei tudo nas 3. Dessa vez quero fazer diferente. Alguém que quebrou o efeito sanfona pode compartilhar o que fez?', false, '#F1948A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Amanda, a experiência de yo-yo é muito comum e NÃO é falta de força de vontade. O corpo tem mecanismos de defesa contra perda de peso. A chave para quebrar o ciclo: 1) Fase de perda mais lenta (max 0.5-1% do peso/semana), 2) Fase de MANUTENÇÃO de 3-6 meses ANTES de tentar perder mais, 3) Construir hábitos, não seguir dietas temporárias. Qual era a abordagem nas 3 vezes anteriores?', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Amanda, o erro #1 é: a dieta termina quando atinge o peso. NÃO. A dieta termina quando os HÁBITOS estão automáticos. Mantenha por 6 meses no peso meta antes de relaxar.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'No meu caso, musculação foi o que mudou tudo. Mais músculo = metabolismo mais alto = mais fácil manter. Nunca mais fiz só dieta sem treino de força.', false, '#F7DC6F', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: deficit-calorico';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: treino-gluteo
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'treino-gluteo' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: treino-gluteo';

    -- Thread 1: Glúteo médio: o músculo esquecido
    v_post_date := NOW() - INTERVAL '29 days' - INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Glúteo médio: o músculo esquecido**

Treino glúteo há 2 anos mas só sinto gluteo máximo. Meu glúteo médio é inexistente e isso gera instabilidade no agachamento. Como ativar?', false, '#D7BDE2', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'O glúteo médio é crucial para estabilidade pélvica e estética lateral do quadril. Para ativá-lo: 1) Abdução de quadril deitada (com faixa), 2) Monster walk, 3) Single leg hip thrust. Importante: faça ativação ANTES do treino pesado (2 séries de 15-20 reps). Você sente o valgo dinâmico (joelhos para dentro) no agachamento?', true, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'tatiana.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Maria, no pilates a gente trabalha MUITO glúteo médio. Clam shell com resistência e side lying são exercícios excelentes.', false, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Faixa elástica mudou meu jogo! Uso no aquecimento: 3 séries de monster walk + crab walk. Meu agachamento ficou muito mais estável.', false, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Outra dica: step lateral com faixa. 3x20 cada lado. Em 4 semanas meu glúteo médio "apareceu" lateralmente.', false, '#45B7D1', v_comment_date, v_comment_date);

    -- Thread 2: Hip thrust vs agachamento para glúteo
    v_post_date := NOW() - INTERVAL '4 days' - INTERVAL '16 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Hip thrust vs agachamento para glúteo**

Pergunta polêmica: hip thrust ou agachamento, qual é superior para crescer glúteo? Meu tempo é limitado e preciso priorizar um.', false, '#BB8FCE', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'A ciência é clara: hip thrust tem maior ativação do glúteo máximo (EMG) porque o pico de tensão ocorre na extensão completa do quadril (onde o glúteo é mais forte). O agachamento tem pico de tensão na posição mais baixa (onde o quadríceps domina). Para GLÚTEO especificamente, hip thrust é superior. Mas o agachamento trabalha mais músculos simultaneamente. Ideal: priorize hip thrust, use agachamento como complemento.', true, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Concordo 100%. Na prep das minhas atletas, hip thrust é prioridade 1 para glúteo. Agachamento é pra perna geral.', false, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'bruno.carvalho@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Mas agachamento profundo (ATG) também trabalha bem o glúteo na posição alongada. Não descartaria totalmente.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Faço os dois! Hip thrust 2x/semana como principal, agachamento búlgaro 2x/semana como acessório. Melhor combo que já fiz.', false, '#D7BDE2', v_comment_date, v_comment_date);

    -- Thread 3: Frequência ideal: posso treinar glúteo todo dia?
    v_post_date := NOW() - INTERVAL '26 days' - INTERVAL '18 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'beatriz.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Frequência ideal: posso treinar glúteo todo dia?**

Quero glúteo grande RÁPIDO. Posso treinar todo dia? Vejo influenciadoras treinando glúteo 5-6x por semana. Funciona mesmo?', false, '#D7BDE2', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Treinar glúteo todo dia = overtraining para a maioria. O músculo cresce no DESCANSO, não no treino. Frequência ótima baseada em evidência: 2-3x/semana para a maioria, com 48-72h de recuperação entre sessões pesadas. Volume semanal de 12-20 séries. Treinar mais que isso sem recuperação adequada pode até REDUZIR o crescimento. Influenciadoras que treinam 6x muitas vezes usam auxílios farmacológicos que aceleram a recuperação.', true, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'felipe.ramos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Beatriz, como preparador: 3x/semana com intensidade alta > 6x/semana com intensidade baixa. SEMPRE. O estímulo precisa ser forte, e depois o corpo precisa de tempo pra reconstruir.', false, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Eu caí nessa de treinar todo dia. Resultado: tendinite no quadril e zero crescimento. Reduzi pra 3x e decolou!', false, '#85C1E9', v_comment_date, v_comment_date);

    -- Thread 4: Qual a carga ideal pro hip thrust?
    v_post_date := NOW() - INTERVAL '24 days' - INTERVAL '0 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Qual a carga ideal pro hip thrust?**

Estou fazendo hip thrust com 60kg mas não sei se é pouco. Pessoal no Instagram levanta 150+kg. Quanto é "bom"?', false, '#F1948A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Não compare com Instagram - muitos vídeos usam barras e anilhas "falsas" ou amplitude parcial. Uma referência realista: hip thrust de 1.5-2x seu peso corporal com amplitude completa e contração no topo de 2 segundos é EXCELENTE. Se você pesa 60kg, 90-120kg com boa técnica é ótimo. O mais importante é sentir o glúteo contraindo forte no topo do movimento.', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Larissa, 60kg com técnica perfeita (pausa no topo, sem hiper-extensão lombar) é melhor que 150kg com ego lift. Foco na conexão mente-músculo!', false, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Eu uso 80kg com banda elástica no joelho pra forçar ativação do glúteo médio também. A banda fez mais diferença que aumentar carga!', false, '#FFEAA7', v_comment_date, v_comment_date);

    -- Thread 5: Glúteo e genética: até onde dá pra mudar?
    v_post_date := NOW() - INTERVAL '14 days' - INTERVAL '20 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Glúteo e genética: até onde dá pra mudar?**

Sou ectomorfa, quadril estreito. Treino pesado há 3 anos e meu glúteo cresceu pouco comparado a amigas que começaram junto. Genética é tudo?', false, '#4ECDC4', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Genética influencia: inserção muscular, formato do quadril, distribuição de fibras, e resposta ao treinamento. MAS não é limitante absoluto. Ectomorfos podem precisar de mais volume, mais frequência, e mais calorias. Verifique: 1) Você está em superávit calórico? (essencial para crescimento), 2) Volume semanal suficiente? (12-20 séries), 3) Progressão de carga consistente? Genética define o teto, treino e nutrição determinam o quanto você chega perto dele.', true, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Fernanda, eu era igual. Mudou quando aumentei proteína pra 2g/kg E entrei em leve superávit. Glúteo precisa de COMIDA pra crescer!', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'gustavo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ectomorfos respondem bem a volume alto com frequência alta. Tenta 4x/semana com 6-8 séries por sessão. Total de 24-32 séries/semana.', false, '#45B7D1', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: treino-gluteo';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: canetas
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'canetas' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: canetas';

    -- Thread 1: Ozempic: relato de 3 meses
    v_post_date := NOW() - INTERVAL '15 days' - INTERVAL '11 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Ozempic: relato de 3 meses**

Comecei Ozempic 0.25mg há 3 meses, estou em 0.5mg agora. Perdi 7kg. Efeitos colaterais: náusea forte na 1ª semana de cada aumento de dose. Alguém mais?', false, '#F1948A', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Perda de 7kg em 3 meses está dentro do esperado para semaglutida. A náusea é o efeito colateral mais comum e tende a diminuir com adaptação. Dicas: comer porções menores, evitar gordura em excesso, e manter hidratação. Você manteve treino de força? É crucial para preservar massa muscular durante a perda com GLP-1.', true, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Renata, como médico: a náusea é dose-dependente. Se está muito forte, pode ficar mais tempo em 0.25 antes de subir. Não há pressa na titulação.', false, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Importante: musculação + proteína alta (2g/kg) é OBRIGATÓRIO com canetas. Senão perde muita massa magra junto. Já vi casos tristes de perda muscular severa.', false, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Reforço o Carlos! Meus pacientes que usam canetas SEM treino de força perdem até 40% de massa magra. Com treino + proteína, esse número cai pra 10-15%.', false, '#DDA0DD', v_comment_date, v_comment_date);

    -- Thread 2: Mounjaro vs Ozempic: diferenças reais
    v_post_date := NOW() - INTERVAL '3 days' - INTERVAL '7 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Mounjaro vs Ozempic: diferenças reais**

Meu endo ofereceu Mounjaro em vez de Ozempic. Disse que é mais potente. Alguém fez os dois e pode comparar?', false, '#FF6B6B', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Mounjaro (tirzepatida) atua em 2 receptores (GLP-1 + GIP), enquanto Ozempic (semaglutida) atua apenas em GLP-1. Nos estudos, Mounjaro mostrou perda de peso ligeiramente superior (~15-20% vs ~12-15% do peso corporal). Efeitos colaterais gastrointestinais são similares. A escolha depende de resposta individual, custo e disponibilidade. Ambos são excelentes opções.', true, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Fato: Mounjaro tem leve vantagem em eficácia nos estudos SURMOUNT vs STEP. Mas na prática clínica, a resposta individual varia muito. Já vi pacientes respondendo melhor ao Ozempic.', false, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Eu comecei com Ozempic e migrei pro Mounjaro. Senti menos náusea e mais saciedade. Mas cada organismo é diferente.', false, '#96CEB4', v_comment_date, v_comment_date);

    -- Thread 3: Parar a caneta: e depois?
    v_post_date := NOW() - INTERVAL '9 days' - INTERVAL '18 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Parar a caneta: e depois?**

Atingi meu peso meta com Ozempic. Minha médica quer retirar gradualmente. Estou MORRENDO de medo de recuperar tudo. Alguém já parou?', false, '#F7DC6F', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Preocupação válida. Estudos mostram que ~67% dos pacientes recuperam parte do peso após parar GLP-1. MAS os que mantêm: 1) Treino de força consistente, 2) Proteína adequada, 3) Hábitos alimentares construídos durante o uso, têm resultados MUITO melhores. A caneta é ferramenta para CONSTRUIR hábitos, não muleta permanente. A retirada gradual é a abordagem correta.', true, '#F1948A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Camila, o período de transição é CRUCIAL. Mantenha o mesmo padrão alimentar, aumente a atividade física levemente, e monitore peso semanalmente. Se subir 2kg+, converse com a médica.', false, '#F1948A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'thiago.barros@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Parei há 6 meses. Recuperei 3kg dos 15 que perdi. Mantive musculação 4x/semana e dieta com proteína alta. É possível manter a maior parte sim.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica de quem passou por isso: não pare a caneta E a dieta ao mesmo tempo. Pare a caneta mas mantenha os hábitos por pelo menos 6 meses.', false, '#82E0AA', v_comment_date, v_comment_date);

    -- Thread 4: Canetas e exercício: combinação ideal
    v_post_date := NOW() - INTERVAL '1 days' - INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'felipe.ramos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Canetas e exercício: combinação ideal**

Como preparador físico, estou recebendo cada vez mais alunos usando canetas. Qual a melhor abordagem de treino? Mudar algo no periodização?', false, '#82E0AA', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ótima pergunta profissional! Com GLP-1, as prioridades mudam: 1) Prioridade MÁXIMA: preservar massa muscular (treino de força 3-4x/semana), 2) Proteína: 2-2.5g/kg de peso META (não atual), 3) Volume moderado-alto (15-20 séries/grupo/semana), 4) Cardio: opcional, não priorizar sobre musculação, 5) Monitorar: força nos exercícios compostos - se cair, pode ser perda muscular. Bioimpedância mensal é ideal.', true, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Felipe, na prep dos meus atletas que usam: treino full body 4x/semana, séries de 6-12 reps, foco em compostos. Nada de "treino pra queimar" - eles já estão queimando com a caneta.', false, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'bruno.carvalho@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica: creatina 5g/dia é especialmente importante com canetas. Ajuda a manter volume muscular e performance.', false, '#F0B27A', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: canetas';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: odeia-treinar
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'odeia-treinar' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: odeia-treinar';

    -- Thread 1: Detesto academia mas preciso me exercitar
    v_post_date := NOW() - INTERVAL '20 days' - INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Detesto academia mas preciso me exercitar**

Não suporto o ambiente de academia. O barulho, a competição, as máquinas. Mas sei que preciso me exercitar. O que funciona pra quem ODEIA treinar?', false, '#DDA0DD', 5, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Você não precisa de academia! O melhor exercício é aquele que você FAZ consistentemente. Opções fora da academia: 1) Caminhadas ao ar livre (pode ouvir podcast), 2) Dança (Zumba, Just Dance em casa), 3) Natação/hidroginástica, 4) Yoga/pilates em casa, 5) Treino funcional no parque. A chave é encontrar algo que não pareça "obrigação". O que você gosta de fazer que envolve movimento?', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Renata, eu ODIAVA academia. Comecei yoga em casa com YouTube e mudou minha vida. Zero pressão, no meu ritmo, no meu espaço.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Já tentou caminhada com podcast? Eu caminho 1h/dia ouvindo audiolivro. Nem parece exercício. Resultado: 10kg em 6 meses.', false, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Just Dance no videogame com as crianças! 30 minutos e queimo mais que na esteira. E rindo!', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '5 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'lucas.martins@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ring Fit Adventure no Nintendo Switch mudou minha relação com exercício. É um RPG onde você treina pra lutar. Viciante!', false, '#FF6B6B', v_comment_date, v_comment_date);

    -- Thread 2: Exercício mínimo efetivo: quanto é suficiente?
    v_post_date := NOW() - INTERVAL '8 days' - INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'joao.carlos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Exercício mínimo efetivo: quanto é suficiente?**

Tenho 55 anos e zero condicionamento. Qual o MÍNIMO de exercício que faz diferença real na saúde? Não quero meta de Instagram, quero saúde.', false, '#FFEAA7', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'A OMS recomenda 150 minutos/semana de atividade moderada. MAS estudos recentes mostram que QUALQUER quantidade é melhor que nada: 1) 10 min/dia de caminhada = 33% menos risco cardiovascular, 2) 2 sessões de força/semana = manutenção de massa muscular, 3) Subir escadas = equivale a cardio moderado. Comece com 10 minutos diários e aumente 5 min/semana. Em 2 meses você estará nos 30 min/dia sem perceber.', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'João, como médico: 20 minutos de caminhada diária reduz risco de diabetes tipo 2 em 30-50%. É o exercício com melhor custo-benefício que existe.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'marcelo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Tenho 50 e comecei com 15 minutos. Hoje faço 45. O segredo é: comece ridiculamente fácil. Se é fácil, você faz. Se faz, cria hábito.', false, '#4ECDC4', v_comment_date, v_comment_date);

    -- Thread 3: Treino em casa sem equipamento
    v_post_date := NOW() - INTERVAL '26 days' - INTERVAL '14 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Treino em casa sem equipamento**

Mães ocupadas: preciso de treino de 20 min em casa, sem equipamento, sem barulho (bebê dormindo). Existe isso?', false, '#73C6B6', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Claro! Treino silencioso de 20 minutos: 4 rounds de 5 exercícios, 30seg cada + 15seg descanso. 1) Agachamento bodyweight, 2) Prancha, 3) Ponte de glúteo, 4) Afundo alternado, 5) Superman. Sem pular, sem barulho. Efetivo e silencioso! Faça 3-4x/semana. Em 4 semanas você sente diferença real.', true, '#F1948A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Amanda, canal "Fitness Blender" no YouTube tem treinos de 20 min sem equipamento. Faço há 1 ano e estou em outra shape.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'tatiana.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Galões de água = halter caseiro! 5 litros = 5kg. Dá pra fazer muito exercício de força com isso.', false, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Faixa elástica custa 30 reais e transforma treino em casa. Minha melhor compra fitness.', false, '#F1948A', v_comment_date, v_comment_date);

    -- Thread 4: Dança como exercício: funciona?
    v_post_date := NOW() - INTERVAL '12 days' - INTERVAL '15 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Dança como exercício: funciona?**

Sou dançarina e professora de zumba. Muita gente pergunta se dança "conta" como exercício. Posso dizer: CONTA SIM. Mas qual o limite? Pra quem quer emagrecer, zumba 3x basta?', false, '#4ECDC4', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dança é exercício completo! Zumba 3x/semana = ~600-900kcal queimadas + melhora cardiovascular + coordenação + saúde mental (efeito social + dopamina). Para emagrecimento, combinado com alimentação adequada, é mais que suficiente. Para hipertrofia, precisaria complementar com trabalho de força específico. Mas para SAÚDE geral, dança é perfeita.', true, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Zumba me fez perder 12kg! Porque eu GOSTAVA e ia toda semana. Na academia eu faltava toda hora. O melhor exercício é o que você faz feliz.', false, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'lucas.martins@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Comecei fazendo Zumba de "zuação" e hoje é meu cardio principal. Muito mais divertido que esteira!', false, '#45B7D1', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: odeia-treinar';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: ansiedade-alimentacao
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'ansiedade-alimentacao' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: ansiedade-alimentacao';

    -- Thread 1: Compulsão noturna: não consigo parar de comer à noite
    v_post_date := NOW() - INTERVAL '2 days' - INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Compulsão noturna: não consigo parar de comer à noite**

Toda noite, depois das 21h, perco o controle. Como sem fome, sem pensar. Doces, salgados, tudo. Já tentei "não ter besteira em casa" mas saio pra comprar. É compulsão alimentar?', false, '#45B7D1', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'O que você descreve tem características de compulsão alimentar noturna (Night Eating Syndrome ou Binge Eating). É importante diferenciar: 1) Fome real (restrição calórica durante o dia?), 2) Fome emocional (estresse, tédio, ansiedade), 3) Compulsão clínica (perda de controle + culpa). Se há perda de controle e sofrimento, procure um psicólogo especializado em transtornos alimentares. Isso não se resolve com "força de vontade" - precisa de tratamento adequado.', true, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Fernanda, passei por isso. No meu caso, eu restringia DEMAIS durante o dia e à noite o corpo cobrava. Quando comecei a comer adequadamente de dia, a compulsão noturna diminuiu 80%.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como nutricionista: investigue se você está comendo proteína e fibra suficientes nas refeições principais. Déficit nesses nutrientes = mais fome noturna.', false, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Terapia cognitivo-comportamental me ajudou DEMAIS com isso. Hoje tenho ferramentas pra quando a vontade aparece. Procure um psicólogo, sério.', false, '#73C6B6', v_comment_date, v_comment_date);

    -- Thread 2: Comer emocional: como identificar?
    v_post_date := NOW() - INTERVAL '13 days' - INTERVAL '10 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Comer emocional: como identificar?**

Como saber se estou comendo por fome ou emoção? Às vezes não consigo diferenciar. Sinto que "preciso" comer mas não sei se é corpo ou mente.', false, '#F1948A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Teste simples: fome física aparece gradualmente e aceita qualquer comida. Fome emocional aparece de repente e pede comida ESPECÍFICA (geralmente doce ou comfort food). Outro teste: antes de comer, pergunte "se eu tivesse que comer brócolis agora, comeria?" Se sim = fome real. Se não = fome emocional. Não significa que fome emocional é "proibida" - significa que exige estratégias diferentes.', true, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Esse teste do brócolis MUDOU minha vida. Uso toda vez. 80% das vezes é emocional e eu nem percebia.', false, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Outra dica: diário alimentar com EMOÇÕES. Anota o que comeu + como se sentia. Em 1 semana os padrões ficam claros.', false, '#DDA0DD', v_comment_date, v_comment_date);

    -- Thread 3: Culpa depois de comer: como lidar?
    v_post_date := NOW() - INTERVAL '30 days' - INTERVAL '7 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Culpa depois de comer: como lidar?**

Sempre que como algo "proibido", fico com culpa horrível. Às vezes vou fazer cardio pra "compensar". Isso é normal ou já é transtorno?', false, '#F1948A', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Maria, exercício para "compensar" alimentação é um comportamento compensatório que pode indicar relação disfuncional com comida. Importante: 1) Não existem alimentos "proibidos" - existem frequências adequadas, 2) Exercício não é punição, 3) Uma refeição "fora do plano" NÃO destrói progresso. Se a culpa é constante e você usa exercício como punição regularmente, conversar com profissional de saúde mental é importante.', true, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Maria, nenhuma comida isolada engorda ou emagrece. É o PADRÃO ao longo do tempo. Um pedaço de bolo numa dieta boa é irrelevante nutricionalmente.', false, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Passei anos assim. O que me ajudou: mudar "eu FALHEI na dieta" para "eu ESCOLHI comer isso". Tirar a culpa e colocar consciência.', false, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Prática de auto-compaixão. Quando vem a culpa, falo comigo mesma como falaria com uma amiga. "Tudo bem, foi uma escolha, amanhã é outro dia." Parece bobo mas funciona.', false, '#85C1E9', v_comment_date, v_comment_date);

    -- Thread 4: Dieta restritiva gerou compulsão
    v_post_date := NOW() - INTERVAL '23 days' - INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'beatriz.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Dieta restritiva gerou compulsão**

Fiz dieta de 1200kcal por 4 meses. Perdi 10kg mas desenvolvi compulsão alimentar que não tinha antes. Agora como 3000kcal+ em episódios. O que aconteceu comigo?', false, '#45B7D1', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Beatriz, isso é EXTREMAMENTE comum e documentado na ciência. O Minnesota Starvation Experiment (1944) mostrou exatamente isso: restrição severa causa obsessão por comida e episódios de compulsão. 1200kcal para a maioria das mulheres é subfisiológico - seu corpo interpretou como fome e ativou mecanismos de sobrevivência. A recuperação envolve: aumentar calorias gradualmente para manutenção + acompanhamento psicológico + paciência. Isso não é fraqueza, é biologia.', true, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como médico: 1200kcal é uma caloria de CRIANÇA. Para adultos, raramente é apropriado. Infelizmente muitos "profissionais" ainda prescrevem isso. Procure um nutricionista que entenda de comportamento alimentar.', false, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Passei pela mesma coisa. A recuperação levou 1 ano com nutricionista + psicóloga. Hoje como 2100kcal e mantenho peso. Tenha paciência consigo mesma.', false, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Beatriz, você não está sozinha. Grupo de apoio ajuda muito. Saber que outras pessoas passaram por isso tira a vergonha e a solidão.', false, '#BB8FCE', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: ansiedade-alimentacao';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: emagrecimento-35-mais
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'emagrecimento-35-mais' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: emagrecimento-35-mais';

    -- Thread 1: Menopausa e acúmulo de gordura abdominal
    v_post_date := NOW() - INTERVAL '28 days' - INTERVAL '7 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Menopausa e acúmulo de gordura abdominal**

Entrei na perimenopausa aos 47. Sem mudar nada na alimentação, ganhei 5kg em 6 meses - tudo na barriga. É hormonal mesmo? Tem como reverter?', false, '#BB8FCE', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Sim, é hormonal. A queda de estrogênio redistribui a gordura: menos no quadril/coxas, mais no abdômen (padrão andróide). Isso acontece com quase todas as mulheres na perimenopausa. Estratégias: 1) Musculação é ESSENCIAL (mais que cardio), 2) Proteína mais alta (2g/kg), 3) Sono de qualidade (melatonina pode ajudar), 4) Discuta TRH com sua ginecologista. A boa notícia: com intervenção adequada, dá pra reverter boa parte.', true, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Renata, na perimenopausa o metabolismo pode cair 200-300kcal/dia. Musculação é a melhor forma de manter o metabolismo alto.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'TRH (terapia de reposição hormonal) quando indicada, pode ajudar significativamente na redistribuição de gordura. Converse com seu ginecologista.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Comecei musculação aos 43 justamente por isso. Melhor decisão da minha vida. Revirou meu corpo em 1 ano.', false, '#DDA0DD', v_comment_date, v_comment_date);

    -- Thread 2: Metabolismo aos 40: mito ou realidade?
    v_post_date := NOW() - INTERVAL '14 days' - INTERVAL '10 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'marcelo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Metabolismo aos 40: mito ou realidade?**

Tenho 50 e sinto que meu metabolismo PAROU. Como a mesma coisa de 10 anos atrás e engordo. Metabolismo realmente desacelera com idade?', false, '#F1948A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Estudo de 2021 no Science revolucionou isso: o metabolismo basal NÃO cai significativamente entre 20-60 anos. O que muda: 1) Perda de massa muscular (que reduz gasto), 2) Redução do NEAT (menos movimento espontâneo), 3) Mudanças hormonais. Ou seja: não é o metabolismo que freia, é a composição corporal e atividade que mudam. A solução: musculação + manter-se ativo. Seu metabolismo pode ser tão bom aos 50 quanto era aos 30 - se mantiver a massa muscular.', true, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Marcelo, como personal: meus alunos 50+ que treinam força 3x/semana têm metabolismo IGUAL ou melhor que os de 30. Músculo é o motor.', false, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Tenho 55 e corro meia maratona. Mas concordo: a musculação fez mais diferença na composição corporal que a corrida.', false, '#98D8C8', v_comment_date, v_comment_date);

    -- Thread 3: Resistência à insulina após os 35
    v_post_date := NOW() - INTERVAL '17 days' - INTERVAL '22 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'daniela.correia@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Resistência à insulina após os 35**

Exames mostraram resistência à insulina. Tenho 42 anos, IMC 27. Meu endócrino falou que é comum nessa idade. Como alimentação pode ajudar?', false, '#FFEAA7', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Resistência à insulina é reversível com intervenção adequada! Estratégias alimentares: 1) Reduzir carbo refinado e açúcar, 2) Aumentar fibras (25-30g/dia), 3) Proteína em todas as refeições (estabiliza glicose), 4) Vinagre de maçã antes das refeições (estudo em Diabetes Care mostrou melhora de 34% na sensibilidade), 5) Comer carbo DEPOIS da proteína e vegetais. E o mais potente: musculação. Músculo é o maior "consumidor" de glicose do corpo.', true, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Daniela, priorizaria: aveia no café, proteína + vegetais no almoço, e caminhar 15 min após as refeições principais (reduz pico glicêmico em 30%).', false, '#45B7D1', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Exercício é mais eficaz que metformina nos estágios iniciais de resistência à insulina. 150 min/semana de exercício moderado pode normalizar completamente.', false, '#98D8C8', v_comment_date, v_comment_date);

    -- Thread 4: Primeiro treino de força aos 45: por onde começar?
    v_post_date := NOW() - INTERVAL '13 days' - INTERVAL '11 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'joao.carlos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Primeiro treino de força aos 45: por onde começar?**

Nunca fiz musculação. Tenho 55, sedentário, colesterol alto. Médico mandou treinar. Mas tenho vergonha de ir na academia sem saber nada. Por onde começo?', false, '#45B7D1', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'João, você está dando o passo mais importante! Dicas para começar: 1) Contrate personal para 8-12 aulas iniciais (aprender técnica), 2) Comece com máquinas (mais seguras que pesos livres), 3) 2-3x/semana, 40 min, é suficiente, 4) Foco em exercícios compostos: leg press, supino máquina, remada. Sobre vergonha: 99% das pessoas na academia estão focadas nelas mesmas e torcem por você. E lembra: TODA pessoa experiente um dia foi iniciante.', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'João, como personal: meus melhores alunos começaram depois dos 50. A resposta ao treino é surpreendente. E a vergonha passa no segundo dia, prometo!', false, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'marcelo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Comecei aos 48. Hoje com 50, minha postura, disposição e exames melhoraram TUDO. É o melhor investimento em saúde que existe.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'felipe.ramos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica: horários mais vazios são ótimos pra iniciar. Meio da manhã ou meio da tarde. Menos gente, menos pressão.', false, '#D7BDE2', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: emagrecimento-35-mais';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: antes-depois
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'antes-depois' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: antes-depois';

    -- Thread 1: Transformação de 18 meses: fotos e o que aprendi
    v_post_date := NOW() - INTERVAL '9 days' - INTERVAL '5 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Transformação de 18 meses: fotos e o que aprendi**

Compartilhando minha jornada: 18 meses, de 95kg (25% BF) pra 82kg (12% BF). Fase 1: déficit moderado por 6 meses. Fase 2: manutenção por 3 meses. Fase 3: mais 6 meses de déficit. Fase 4: manutenção atual. O que aprendi: paciência > motivação.', false, '#73C6B6', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Transformação exemplar, Ricardo! O que mais chama atenção é a abordagem em fases com manutenção intermediária - exatamente o que a ciência recomenda para preservar massa magra e evitar adaptação metabólica. Perder 13kg mantendo essa composição corporal mostra que a musculação e proteína foram priorizadas. Pode compartilhar seu protocolo de treino e nutrição?', true, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'thiago.barros@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Cara, PARABÉNS! Essa abordagem em fases é a que funciona de verdade. Muita gente quer fazer em 3 meses e perde músculo junto.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Inspirador! A parte da manutenção intermediária que poucos falam. Obrigada por compartilhar o processo REAL.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'felipe.ramos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como preparador, confirmo: esse é o protocolo correto. Deficit → manutencão → deficit. Quem faz direto 12 meses de déficit = catástrofe metabólica.', false, '#FFEAA7', v_comment_date, v_comment_date);

    -- Thread 2: Não é só sobre peso: mudança de mentalidade
    v_post_date := NOW() - INTERVAL '21 days' - INTERVAL '20 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Não é só sobre peso: mudança de mentalidade**

Meu antes e depois não é sobre peso. Pesava 72kg antes, peso 72kg agora. Mas perdi 8kg de gordura e ganhei 8kg de músculo em 2 anos. Recomposição corporal é real! A balança mente.', false, '#F0B27A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Recomposição corporal é um dos melhores resultados possíveis! Mesmo peso, corpo completamente diferente. Isso é especialmente comum em iniciantes que começam treino de força com alimentação adequada. Amanda, você provavelmente notou: roupas mais folgadas na cintura e mais justas nos ombros/coxas? Esse é o sinal clássico de recomposição.', true, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Amanda, isso é TUDO! Parei de me pesar e comecei a me medir. -8cm de cintura pesando a mesma coisa. A balança é a pior métrica.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'bruno.carvalho@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Isso mostra porque fotos são mais importantes que peso. O espelho não mente, a balança sim.', false, '#45B7D1', v_comment_date, v_comment_date);

    -- Thread 3: Processo honesto: os dias ruins
    v_post_date := NOW() - INTERVAL '6 days' - INTERVAL '5 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'paula.mendes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Processo honesto: os dias ruins**

Todo mundo posta o resultado final mas ninguém fala dos dias ruins. Nos meus 14 meses de processo: chorei 3 vezes por frustração, quis desistir 5 vezes, comi besteira em 2 festas inteiras. E MESMO ASSIM perdi 18kg. Perfeição não existe.', false, '#98D8C8', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Obrigado pela honestidade, Paula! Isso é MUITO mais inspirador que fotos filtradas. A consistência não é 100% - é 80-85% do tempo sendo bom o suficiente. Estudos mostram que pessoas que permitem "imperfeições planejadas" têm MELHOR aderência a longo prazo. O perfeccionismo alimentar é inimigo do progresso sustentável.', true, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Esse post deveria ser fixado! O processo real tem altos e baixos. Obrigada por mostrar que é normal.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'No meu processo eu errei MUITO. Mas o que importa é: na segunda-feira eu estava de volta. Não é sobre cair, é sobre levantar.', false, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como personal, digo: meus melhores alunos não são os perfeitos. São os consistentes. 80% de aderência com persistência > 100% por 2 meses.', false, '#82E0AA', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: antes-depois';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: dieta-vida-real
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'dieta-vida-real' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: dieta-vida-real';

    -- Thread 1: Marmita vs restaurante: como manter dieta sem cozinhar
    v_post_date := NOW() - INTERVAL '17 days' - INTERVAL '14 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Marmita vs restaurante: como manter dieta sem cozinhar**

Engenheiro, trabalho 10h/dia. Zero tempo pra cozinhar. Como manter alimentação saudável comendo fora? Restaurante por quilo é opção? Delivery?', false, '#FF6B6B', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Totalmente possível! Estratégias: 1) Restaurante por quilo: monte prato com 1/2 salada, 1/4 proteína, 1/4 carbo. Evite frituras e molhos, 2) Delivery: apps têm opções "fit" (filtro por calorias), 3) Meal prep domingo: 2h de cozinha = 5 dias de marmita, 4) Rotisseria: frango assado + salada pronta = jantar em 5 min. Não precisa ser perfeito, precisa ser consistente.', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Pedro, dica de ouro: marmitarias fitness entregam congelado. Você esquenta no micro. Preço similar a delivery e muito mais saudável.', false, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Meal prep é game changer. Domingo: cozinho 2kg de frango, arroz, e lavo salada. Dá pra 5 dias. 2 horas de trabalho = semana inteira resolvida.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '12 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Airfryer + tempero pronto = frango em 20 min. Não precisa ser chef pra comer bem!', false, '#F1948A', v_comment_date, v_comment_date);

    -- Thread 2: Dieta social: como comer com amigos sem sabotar
    v_post_date := NOW() - INTERVAL '9 days' - INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'lucas.martins@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Dieta social: como comer com amigos sem sabotar**

Toda sexta saio com amigos: rodízio de pizza, churrasquinho, boteco. Se eu evitar, perco convívio social. Se participar, detono a dieta. Alguma estratégia?', false, '#F1948A', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'A vida social é parte da saúde! Estratégias: 1) Coma proteína antes de sair (chega menos faminto), 2) No rodízio: priorize sabores com proteína, coma devagar, 3) No boteco: opte por porções menores + petiscos proteicos, 4) Álcool: limite a 2 drinks, alterne com água, 5) "Conta semanal": se sexta é livre, compense levemente seg-qui. Uma refeição "livre" por semana NÃO sabota progresso se os outros 20+ são bons.', true, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'thiago.barros@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Lucas, minha regra: 90% bom, 10% livre. 21 refeições na semana, 2-3 são sociais e sem estresse. Funciona perfeitamente.', false, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'bruno.carvalho@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'No churrasco: carne magra + salada. Sem pão de alho, sem farofa. Dá pra comer MUITO e manter dentro do plano.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica: seja a pessoa que sugere o restaurante. Escolha um com opções saudáveis E gostosas. Todo mundo fica feliz!', false, '#96CEB4', v_comment_date, v_comment_date);

    -- Thread 3: Viagem e dieta: como não voltar 5kg mais pesado
    v_post_date := NOW() - INTERVAL '16 days' - INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Viagem e dieta: como não voltar 5kg mais pesado**

Viajo a trabalho 2x/mês. Hotel + restaurantes + aeroporto. Sempre volto 2-3kg mais pesado (sei que é retenção mas mesmo assim). Dicas pra viagem?', false, '#D7BDE2', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'A maioria do peso pós-viagem é retenção de sódio + glicogênio, não gordura real. Mesmo assim, dicas: 1) Café da manhã do hotel: ovos + frutas (skip buffet de pães), 2) Leve sachês de whey na mala, 3) Garrafinha de água sempre, 4) Caminhe ao invés de Uber quando possível, 5) Jantar: proteína + salada em qualquer restaurante. E relaxe: 2-3 dias "fora" não destroem semanas de consistência.', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Eu viajo MUITO. Kit de sobrevivência: whey sachê, castanhas, barra de proteína. Aeroporto sem opção saudável = sachê de whey com água.', false, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Regra de viagem: café e jantar eu controlo. Almoço eu libero pra experimentar a comida local. Funciona bem!', false, '#4ECDC4', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: dieta-vida-real';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: treino-casa
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'treino-casa' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: treino-casa';

    -- Thread 1: Kit básico para treinar em casa: o que comprar primeiro?
    v_post_date := NOW() - INTERVAL '18 days' - INTERVAL '11 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Kit básico para treinar em casa: o que comprar primeiro?**

Quero montar home gym com orçamento de R$500. O que é prioridade?', false, '#98D8C8', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Com R$500, priorize nesta ordem: 1) Kit de faixas elásticas (3 resistências) ~R$80, 2) Par de halteres ajustáveis ~R$200, 3) Tapete de yoga ~R$50, 4) Barra de porta para pull-ups ~R$70, 5) Rolo de espuma (foam roller) ~R$60. Com isso você consegue treinar TUDO: empurrar, puxar, membros inferiores, core. Sobram ~R$40 pra uma corda de pular (cardio perfeito).', true, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Concordo com a priorização! Mas se tiver que escolher UMA coisa: faixa elástica. Com 80 reais resolve 90% dos exercícios.', false, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'tatiana.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Galão de água de 5L = halter grátis! Livros empilhados = step! Cadeira = banco! Criatividade salva o bolso.', false, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'lucas.martins@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Marketplace tem equipamento usado por metade do preço. Comprei barra + anilhas por R$300. Gente que comprou e desistiu vende barato.', false, '#FFEAA7', v_comment_date, v_comment_date);

    -- Thread 2: Treino com faixa elástica: funciona mesmo?
    v_post_date := NOW() - INTERVAL '27 days' - INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'beatriz.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Treino com faixa elástica: funciona mesmo?**

Comprei faixa elástica mas parece "treino de velho". Isso realmente constrói músculo ou é só pra reabilitação?', false, '#FF6B6B', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Faixa elástica constrói músculo SIM - estudos mostram ganhos comparáveis aos pesos livres para iniciantes e intermediários. A vantagem: resistência PROGRESSIVA (aumenta conforme estica). Limitação: para avançados, a carga máxima é limitada. Para membros superiores funciona muito bem. Para pernas pode ficar insuficiente com o tempo. Dica: combine faixas de diferentes resistências para variar carga.', true, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'felipe.ramos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Beatriz, treino atletas com faixa quando viajam. Funciona DEMAIS. O segredo é: tempo sob tensão. Séries lentas de 15-20 reps. O músculo não sabe se é faixa ou ferro.', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Treino 100% com faixas há 8 meses e meus glúteos CRESCERAM. Não tanto quanto com peso, mas o resultado é real.', false, '#FF6B6B', v_comment_date, v_comment_date);

    -- Thread 3: Treino bodyweight avançado: além do básico
    v_post_date := NOW() - INTERVAL '21 days' - INTERVAL '22 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'lucas.martins@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Treino bodyweight avançado: além do básico**

Já faço 50 flexões e 20 agachamentos pistol. Preciso de progressão mais difícil sem equipamento. O que vem depois?', false, '#96CEB4', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Progressões avançadas de calistenia: 1) Flexão: archer push-up → one arm push-up, 2) Agachamento: shrimp squat → sissy squat, 3) Barra: muscle up → front lever progressions, 4) Core: dragon flag → human flag. Para pernas especificamente: nordic curl (hamstrings) e pistol com mochila carregada. Calistenia avançada trabalha força + controle motor de uma forma que pesos não conseguem.', true, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'bruno.carvalho@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Lucas, dá uma olhada no programa de calistenia do FitnessFAQs no YouTube. Progressões muito bem estruturadas.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'gustavo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Handstand push-ups contra a parede é um dos melhores exercícios para ombro que existe. Zero equipamento, carga alta.', false, '#96CEB4', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: treino-casa';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: performance-biohacking
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'performance-biohacking' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: performance-biohacking';

    -- Thread 1: Creatina: o que a ciência realmente diz
    v_post_date := NOW() - INTERVAL '24 days' - INTERVAL '7 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'gustavo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Creatina: o que a ciência realmente diz**

Creatina é o suplemento mais estudado do mundo, mas ainda vejo gente com medo de tomar. Vamos listar os benefícios comprovados?', false, '#F0B27A', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Benefícios comprovados da creatina monohidratada (5g/dia): 1) +5-10% força em exercícios de alta intensidade, 2) +1-2kg massa magra (via volumização celular), 3) Neuroproteção (estudos em Parkinson/Alzheimer), 4) Melhora cognitiva sob privação de sono, 5) Possível efeito antidepressivo. Segurança: NENHUM estudo mostrou dano renal em pessoas SAUDÁVEIS (meta-análise com +500 estudos). Contraindicação: apenas doença renal pré-existente.', true, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como médico, posso confirmar: creatina é o suplemento com maior evidência científica. Prescrevo pra pacientes 50+ pela neuroproteção.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, '5g/dia, todo dia, pra sempre. Não precisa de ciclo, não precisa de loading. Simples assim.', false, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'thiago.barros@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica: creatina monohidratada é a mais barata e a MELHOR. As versões "premium" (HCL, buffered) não mostraram superioridade nos estudos.', false, '#45B7D1', v_comment_date, v_comment_date);

    -- Thread 2: Protocolo de sono para performance
    v_post_date := NOW() - INTERVAL '17 days' - INTERVAL '20 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'marcelo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Protocolo de sono para performance**

Otimizei tudo: treino, dieta, suplementos. Mas durmo 5-6h por noite por causa do trabalho. Quanto isso prejudica?', false, '#FF6B6B', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'O sono é provavelmente o fator mais subestimado em performance. <6h/noite causa: 1) -20-30% testosterona, 2) +40% resistência à insulina, 3) -11% performance aeróbica, 4) Aumento de cortisol (catabolismo), 5) Redução de GH (crescimento muscular). Estratégias: set alarm pra DORMIR (não só acordar), quarto 18-20 graus, blackout total, sem tela 1h antes. Se não consegue 7-8h: naps de 20min no almoço ajudam MUITO.', true, '#F1948A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'gustavo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Marcelo, se tiver que escolher entre treinar e dormir: DURMA. Treino sem sono = cortisol alto = catabolismo. Você piora treinando mal dormido.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'felipe.ramos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Meus atletas têm meta de sono como têm meta de treino. 7-8h é não-negociável. Performance caiu? Primeira coisa que investigo é sono.', false, '#96CEB4', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: performance-biohacking';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: peptideos-research
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'peptideos-research' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: peptideos-research';

    -- Thread 1: BPC-157: evidência científica atual
    v_post_date := NOW() - INTERVAL '4 days' - INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'rodrigo.andrade@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**BPC-157: evidência científica atual**

Estudando BPC-157 pra uma tendinopatia crônica que não resolve. A maioria dos estudos é em ratos. Alguém tem experiência humana real?', false, '#F1948A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'BPC-157 (Body Protection Compound) tem evidência promissora mas predominantemente pré-clínica. Em modelos animais: aceleração de cicatrização de tendões, ligamentos, músculo e intestino. Mecanismo: estimula angiogênese e fatores de crescimento locais. Limitações: poucos estudos em humanos, regulação como "research chemical", variação de qualidade entre fornecedores. Se considerar uso, converse com médico que entenda de peptídeos.', true, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como médico: os dados pré-clínicos são impressionantes, mas faltam trials em humanos. Use com supervisão médica SEMPRE. E cuidado com a fonte - peptídeos de procedência duvidosa podem conter impurezas.', false, '#73C6B6', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'thiago.barros@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Usei por 4 semanas em uma tendinite no cotovelo que tinha há 1 ano. Melhorou significativamente. Anecdotal, eu sei, mas minha experiência foi positiva.', false, '#82E0AA', v_comment_date, v_comment_date);

    -- Thread 2: Ipamorelin + CJC-1295: protocolos de GH
    v_post_date := NOW() - INTERVAL '23 days' - INTERVAL '5 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'gustavo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Ipamorelin + CJC-1295: protocolos de GH**

Alguém usa combo Ipamorelin + CJC-1295 DAC? Estou pesquisando como alternativa ao GH sintético. Quais as diferenças práticas?', false, '#82E0AA', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Ipamorelin (GHRP) + CJC-1295 DAC (GHRH) atuam sinergicamente: Ipamorelin estimula liberação pulsátil de GH, CJC-1295 amplifica e prolonga a onda. Diferenças vs GH exógeno: 1) Mantém eixo feedback natural (não suprime produção endógena), 2) Padrão pulsátil fisiológico (vs nível constante do GH exógeno), 3) Menos efeitos colaterais (menos retenção, menos resistência insulina), 4) Efeito mais sutil. Limitação: menos potente que GH exógeno em doses terapêuticas.', true, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'rodrigo.andrade@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Uso há 6 meses. Melhora no sono (profundo demais), recuperação entre treinos, e qualidade de pele. Não espere resultados dramáticos - é sutil mas consistente.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ricardo.nunes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Para quem é natural: peptídeos de GH são a opção com melhor custo-benefício de risco. Muito mais seguros que GH sintético.', false, '#F7DC6F', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: peptideos-research';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: receitas-saudaveis
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'receitas-saudaveis' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: receitas-saudaveis';

    -- Thread 1: Bolo de caneca proteico (5 minutos)
    v_post_date := NOW() - INTERVAL '2 days' - INTERVAL '0 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Bolo de caneca proteico (5 minutos)**

Receita mais fácil do mundo: 1 scoop whey + 1 ovo + 1 colher de aveia + canela. Microondas 2min. Macros: 35P/15C/8G. Fica tipo bolo de chocolate fofinho!', false, '#82E0AA', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Excelente receita! Análise nutricional: ~275kcal, excelente razão proteína:caloria. Variações: adicionar banana amassada (+carbo pré-treino), usar whey de baunilha com pedaços de fruta, ou adicionar pasta de amendoim (+gordura boa). Dica: não passe de 2min no micro senão fica borrachudo.', true, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Faço TODO dia pro café! Minha variação: adiciono 1 colher de cacau em pó. Fica sabor brownie. As crianças amam!', false, '#45B7D1', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Vida universitária salva! Receita perfeita pro dormitório. Barata, rápida, proteica. Virou meu lanche pré-treino.', false, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'camila.freitas@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica: em vez de micro, jogue na frigideira antiaderente. Fica tipo panqueca americana. Coloca banana por cima. Chef kiss!', false, '#D7BDE2', v_comment_date, v_comment_date);

    -- Thread 2: Meal prep dominical: 7 refeições em 2 horas
    v_post_date := NOW() - INTERVAL '24 days' - INTERVAL '13 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Meal prep dominical: 7 refeições em 2 horas**

Meu meal prep de domingo: 2kg frango grelhado + 1kg arroz + feijão + 5 saladas lavadas. 2h de trabalho = semana inteira. Quem mais faz? Compartilhem receitas!', false, '#98D8C8', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Meal prep é a estratégia #1 de consistência alimentar! Dicas para otimizar: 1) Cozinhe 2-3 proteínas diferentes (frango, carne, peixe) pra não enjoar, 2) Use temperos diferentes em cada lote, 3) Congele 3 porções + geladeira 4 (congelado não perde textura em até 3 meses), 4) Legumes: asse tudo junto no forno (abobrinha, brócolis, cenoura). Alguém quer compartilhar sua montagem de marmita?', true, '#F0B27A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Minha adição: faço wrap de alface com frango desfiado. Fica tipo taco fit. Zero carbo e delicioso.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dica de nutricionista: varie as cores dos vegetais ao longo da semana. Cores diferentes = micronutrientes diferentes.', false, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Uso potes de vidro transparente. Vendo as cores das comidas dá mais vontade de comer saudável!', false, '#4ECDC4', v_comment_date, v_comment_date);

    -- Thread 3: Overnight oats: receita base + variações
    v_post_date := NOW() - INTERVAL '27 days' - INTERVAL '15 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Overnight oats: receita base + variações**

Overnight oats virou meu café padrão! Base: 40g aveia + 1 scoop whey + 150ml leite + chia. Deixo na geladeira à noite. De manhã só como. Variações?', false, '#85C1E9', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Base excelente! ~350kcal, 30P/40C/10G. Variações: 1) Tropical: manga + coco ralado, 2) Berry: morango + blueberry + mel, 3) Chocolate: cacau + banana + pasta de amendoim, 4) Natalino: canela + nozes + passas, 5) Green: espinafre + abacate + limão. Dica pro: prepare 5 potes no domingo (1 de cada sabor). Cada dia uma surpresa!', true, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Minha favorita: banana + pasta de amendoim + granola por cima. Parece sobremesa, mas é café da manhã proteico!', false, '#DDA0DD', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Versão vegan: leite de coco + whey vegano + frutas vermelhas. Fica cremoso e delicioso.', false, '#98D8C8', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: receitas-saudaveis';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: exercicios-que-ama
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'exercicios-que-ama' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: exercicios-que-ama';

    -- Thread 1: Hip thrust: o exercício que mudou meu shape
    v_post_date := NOW() - INTERVAL '24 days' - INTERVAL '17 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Hip thrust: o exercício que mudou meu shape**

Sou apaixonada por hip thrust! Quando comecei levantava 20kg, hoje faço 100kg com pausa no topo. Meu glúteo mudou completamente em 1 ano. Quem mais ama esse exercício?', false, '#73C6B6', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'O hip thrust é realmente um dos melhores exercícios para desenvolvimento glúteo! Análise biomecânica: pico de tensão na extensão completa (onde o glúteo é mais forte), posição estável que permite carga alta, e baixo estresse na lombar. Progressão de 20kg para 100kg em 1 ano é fantástica! Dica: tente variações unilateral para corrigir assimetrias.', true, '#85C1E9', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'ME TOO! É o único exercício que eu SINTO o glúteo trabalhando 100%. Agachamento eu sinto mais perna.', false, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'tatiana.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'No pilates a gente faz variações de ponte que são basicamente hip thrust no solo. É universal!', false, '#F7DC6F', v_comment_date, v_comment_date);

    -- Thread 2: Levantamento terra: rei dos exercícios?
    v_post_date := NOW() - INTERVAL '8 days' - INTERVAL '7 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'rodrigo.andrade@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Levantamento terra: rei dos exercícios?**

Pra mim, terra é o rei. Trabalha TUDO: posterior, core, grip, costa. 200kg no terra me deu mais resultado que qualquer outro exercício isolado. Quem concorda?', false, '#98D8C8', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'O levantamento terra é de fato um dos exercícios mais completos! Recruta ~70% da musculatura total do corpo. Benefícios únicos: 1) Maior liberação hormonal (GH, testosterona), 2) Desenvolvimento de posterior inteiro, 3) Core funcional real, 4) Transferência para atividades do dia a dia. 200kg é uma carga respeitável! Sua técnica é convencional ou sumo?', true, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'felipe.ramos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Terra convencional pra posterior, sumo pra quadril/adutores. Os dois são reis, só de reinos diferentes!', false, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'thiago.barros@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Terra é o exercício que separa quem treina de verdade de quem brinca. Nada constrói um posterior como 5x5 pesado de terra.', false, '#FFEAA7', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: exercicios-que-ama';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: sinal-vermelho
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'sinal-vermelho' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: sinal-vermelho';

    -- Thread 1: Dor aguda no ombro durante supino
    v_post_date := NOW() - INTERVAL '11 days' - INTERVAL '1 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'bruno.carvalho@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Dor aguda no ombro durante supino**

Senti uma pontada FORTE no ombro direito no meio do supino, na subida. Parei na hora. Dói ao levantar o braço lateralmente. O que pode ser e o que faço?', false, '#DDA0DD', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Dor aguda durante supino com irradiação em abdução sugere possível lesão no manguito rotador (supraespinal é o mais comum) ou conflito subacromial. PARE o exercício imediatamente (você fez certo!). Nos próximos 48h: gelo 15min a cada 2h, anti-inflamatório se necessário. Se dor persistir após 72h ou piorar, procure ortopedista. Evite QUALQUER exercício que cause dor no ombro até avaliação. Melhor perder 1 semana de treino que 6 meses de reabilitação.', true, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Bruno, como ortopedista: essa apresentação merece ultrassom de ombro. Pode ser desde uma bursite simples até lesão parcial do supraespinal. Não force.', false, '#4ECDC4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Enquanto espera consulta: movimente o ombro SEM CARGA. Pendular (braço relaxado em círculos) ajuda a manter mobilidade sem agravar.', false, '#BB8FCE', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '8 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'carlos.souza@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Bruno, quando voltar: revise a técnica do supino. Retrair escapulas + não descer a barra no pescoço. 90% das lesões de ombro no supino são técnica.', false, '#73C6B6', v_comment_date, v_comment_date);

    -- Thread 2: Joelho estrala no agachamento: normal?
    v_post_date := NOW() - INTERVAL '27 days' - INTERVAL '21 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'maria.santos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Joelho estrala no agachamento: normal?**

Meu joelho direito estrala TODA vez que agacho. Sem dor, mas o barulho me assusta. É pra preocupar?', false, '#F0B27A', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Crepitação (estalo) SEM dor geralmente é benigna: bolhas de gás sinovial, tendões deslizando, ou superfícies cartilaginosas articulando. Preocupe-se SE: 1) Vier acompanhada de dor, 2) Causar inchaço, 3) Limitar movimento, 4) Piorar progressivamente. Se apenas estala sem outros sintomas, continue treinando normalmente. Monitore: anote se muda de padrão. Uma dica: aqueça com 5min de bike antes de agachar.', true, '#82E0AA', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Maria, estalo sem dor = provavelmente normal. O joelho é a articulação mais "barulhenta" do corpo. Eu como médico só investigo se houver dor ou derrame articular.', false, '#FFEAA7', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '9 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'gustavo.pereira@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Meu joelho estala há 15 anos. Agacho 180kg. Zero problema. O corpo faz barulho, é normal!', false, '#73C6B6', v_comment_date, v_comment_date);

    -- Thread 3: Formigamento no braço durante treino
    v_post_date := NOW() - INTERVAL '15 days' - INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'pedro.alves@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Formigamento no braço durante treino**

Sinto formigamento no braço esquerdo quando faço desenvolvimento acima da cabeça. Começa no ombro e vai até a mão. Devo parar?', false, '#4ECDC4', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '3 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Formigamento que irradia do ombro até a mão durante exercício overhead é sinal de alerta para compressão neural. Possíveis causas: 1) Síndrome do desfiladeiro torácico (compressão entre clavícula e 1ª costela), 2) Compressão de raiz cervical (C5-C7), 3) Compressão do plexo braquial. PARE o exercício que causa o sintoma e procure um ortopedista ou neurologista. Formigamento = nervo = não ignore.', true, '#98D8C8', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Pedro, formigamento em padrão ombro para mão é dermátomo cervical. Precisa de avaliação. Pode ser apenas postura no exercício, mas pode ser algo mais sério. Não adie.', false, '#F7DC6F', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'juliana.rocha@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Enquanto espera avaliação: substitua overhead por elevação lateral (abaixo de 90 graus). Teste se o formigamento aparece.', false, '#FF6B6B', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: sinal-vermelho';
  END IF;

  -- ════════════════════════════════════════
  -- Arena: aspiracional-estetica
  -- ════════════════════════════════════════
  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = 'aspiracional-estetica' AND "isActive" = true LIMIT 1;
  IF v_arena_id IS NOT NULL THEN
    RAISE NOTICE 'Populando arena: aspiracional-estetica';

    -- Thread 1: Lipo ou emagrecimento natural primeiro?
    v_post_date := NOW() - INTERVAL '14 days' - INTERVAL '1 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'beatriz.gomes@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Lipo ou emagrecimento natural primeiro?**

Tenho gordura localizada na barriga que não sai com dieta. Já perdi 12kg mas a barriga persiste. Minha médica sugeriu lipo. Devo tentar mais tempo natural ou partir pra cirurgia?', false, '#85C1E9', 4, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '1 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Questão que merece reflexão cuidadosa. Pontos a considerar: 1) Gordura localizada resistente APÓS emagrecimento significativo pode ser candidata a procedimento, 2) Verifique se está em peso estável há pelo menos 6 meses, 3) Lipo NÃO é emagrecimento - é modelagem, 4) Sem mudança de hábitos, a gordura pode voltar em outros lugares. Perguntas importantes: seu IMC atual é saudável? Você mantém treino de força? A decisão é estética ou funcional?', true, '#FF6B6B', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'roberto.costa@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Como médico: lipo em paciente que já emagreceu e treina é MUITO diferente de lipo como "atalho". No primeiro caso, resultados são melhores e mais duráveis. Mas estabilize peso primeiro.', false, '#F1948A', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '6 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'amanda.pires@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Fiz lipo na barriga há 2 anos, APÓS perder 20kg naturalmente. Melhor decisão. Mas só porque já tinha os hábitos consolidados.', false, '#45B7D1', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '4 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Beatriz, verifique também se não é diástase (separação dos músculos abdominais). É comum após emagrecimento e causa barriga saliente que NÃO resolve com dieta. Fisio pode avaliar.', false, '#4ECDC4', v_comment_date, v_comment_date);

    -- Thread 2: Harmonização facial e autoestima
    v_post_date := NOW() - INTERVAL '2 days' - INTERVAL '14 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'larissa.campos@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;

    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '**Harmonização facial e autoestima**

Estou considerando harmonização facial (preenchimento labial + malar). Meu namorado diz que não preciso. Mas EU quero. Isso é vaidade ruim ou autocuidado?', false, '#73C6B6', 3, v_post_date, v_post_date)
    RETURNING id INTO v_post_id;

    v_comment_date := v_post_date + INTERVAL '2 hours';
    v_user_id := v_ia_user_id;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'A motivação é o que importa. Se a decisão é SUA (não de terceiros ou de Instagram), se é algo que te incomoda genuinamente, e se você tem expectativas realistas = autocuidado válido. Sinais de alerta: 1) Fazer pra agradar alguém, 2) Nunca estar satisfeita (sempre quer "mais um"), 3) Comparação constante com filtros. Conselho: consulte 2-3 profissionais antes, pergunte sobre riscos, e tenha pelo menos 30 dias entre a decisão e o procedimento (evita impulso).', true, '#96CEB4', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '2 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'fernanda.dias@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Fiz preenchimento labial. Gostei muito. Dica: comece SUTIL. Sempre dá pra colocar mais, tirar é mais difícil.', false, '#D7BDE2', v_comment_date, v_comment_date);

    v_comment_date := v_post_date + INTERVAL '3 hours';
    SELECT id INTO v_user_id FROM "User" WHERE email = 'renata.moura@mock.com' LIMIT 1;
    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;
    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), v_post_id, v_user_id, 'Larissa, a opinião do namorado é irrelevante. É SEU rosto, SUA decisão. Se te faz sentir bem E você pesquisou bem, vá em frente.', false, '#96CEB4', v_comment_date, v_comment_date);

    -- Atualizar contadores da arena
    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;
    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;
    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;

  ELSE
    RAISE NOTICE 'Arena nao encontrada: aspiracional-estetica';
  END IF;

  RAISE NOTICE 'SEED COMPLETO! 60 posts + 211 comentarios inseridos.';
END $$;

-- PASSO 3: Verificar resultado
SELECT a.slug, a.name, a."totalPosts", a."totalComments"
FROM "Arena" a
WHERE a."isActive" = true
ORDER BY a."totalPosts" DESC;