-- ═══════════════════════════════════════════════════════════════
-- POPULAR TODAS AS 36 ARENAS COM CONVERSAS REALISTAS
-- ═══════════════════════════════════════════════════════════════
--
-- OBJETIVO:
-- - Preservar 74 posts existentes
-- - Adicionar 30-40 posts por arena
-- - Total final: ~1.334 posts
-- - Conversas realistas e variadas
-- - Contadores sincronizados
--
-- TEMPO ESTIMADO: 2-3 minutos
-- ═══════════════════════════════════════════════════════════════

SELECT '🚀 INICIANDO SEED DE CONVERSAS...' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 0: RESETAR CONTADORES FALSOS
-- ═══════════════════════════════════════════════════════════════

SELECT '🔄 PASSO 0: Resetando contadores para valores REAIS...' as status;

-- Recalcular e atualizar TODOS os contadores das arenas
UPDATE "Arena" a
SET
  "totalPosts" = (
    SELECT COUNT(*)
    FROM "Post" p
    WHERE p."arenaId" = a.id
      AND p."isDeleted" = false
  ),
  "totalComments" = (
    SELECT COUNT(*)
    FROM "Comment" c
    JOIN "Post" p ON c."postId" = p.id
    WHERE p."arenaId" = a.id
      AND c."isDeleted" = false
      AND p."isDeleted" = false
  ),
  "dailyActiveUsers" = (
    SELECT COUNT(DISTINCT p."userId")
    FROM "Post" p
    WHERE p."arenaId" = a.id
      AND p."isDeleted" = false
  );

-- Recalcular comentários em cada post
UPDATE "Post" p
SET "commentCount" = (
  SELECT COUNT(*)
  FROM "Comment" c
  WHERE c."postId" = p.id
    AND c."isDeleted" = false
)
WHERE p."isDeleted" = false;

SELECT '✅ Contadores resetados para valores REAIS' as status;

-- Mostrar situação ANTES de popular
SELECT
  '📊 SITUAÇÃO ANTES DO SEED' as titulo,
  COUNT(*) as "Total Arenas",
  SUM("totalPosts") as "Posts Atuais (reais)",
  SUM("totalComments") as "Comentários Atuais (reais)",
  ROUND(AVG("totalPosts")::numeric, 1) as "Média Posts/Arena"
FROM "Arena"
WHERE "isActive" = true;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 1: CRIAR USUÁRIOS SIMULADOS
-- ═══════════════════════════════════════════════════════════════

SELECT '👥 PASSO 1: Criando usuários simulados...' as status;

-- Inserir usuários (se não existirem)
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
SELECT
  'user_sim_' || LPAD(num::text, 3, '0'),
  'simulado' || num || '@mock.com',
  CASE
    WHEN num = 1 THEN 'Ana Paula'
    WHEN num = 2 THEN 'Carlos Eduardo'
    WHEN num = 3 THEN 'Juliana Santos'
    WHEN num = 4 THEN 'Rafael Lima'
    WHEN num = 5 THEN 'Mariana Costa'
    WHEN num = 6 THEN 'Bruno Ferreira'
    WHEN num = 7 THEN 'Patricia Oliveira'
    WHEN num = 8 THEN 'Thiago Martins'
    WHEN num = 9 THEN 'Fernanda Alves'
    WHEN num = 10 THEN 'Lucas Souza'
    WHEN num = 11 THEN 'Camila Ribeiro'
    WHEN num = 12 THEN 'Rodrigo Andrade'
    WHEN num = 13 THEN 'Amanda Silva'
    WHEN num = 14 THEN 'Gustavo Rocha'
    WHEN num = 15 THEN 'Roberta Mendes'
    WHEN num = 16 THEN 'Daniela Correia'
    WHEN num = 17 THEN 'Renata Moraes'
    WHEN num = 18 THEN 'Marcelo Pereira'
    WHEN num = 19 THEN 'João Carlos'
    WHEN num = 20 THEN 'Beatriz Gomes'
  END,
  'mock-password-hash',
  'USER',
  NOW(),
  NOW()
FROM generate_series(1, 20) num
ON CONFLICT (email) DO NOTHING;

SELECT '✅ Usuários criados' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 2: CRIAR FUNÇÃO PARA GERAR POSTS
-- ═══════════════════════════════════════════════════════════════

SELECT '📝 PASSO 2: Criando funções auxiliares...' as status;

-- Função para selecionar usuário aleatório
CREATE OR REPLACE FUNCTION get_random_sim_user()
RETURNS TEXT AS $$
  SELECT id FROM "User"
  WHERE email LIKE 'simulado%@mock.com'
  ORDER BY RANDOM()
  LIMIT 1;
$$ LANGUAGE SQL;

-- Função para gerar conteúdo de post baseado no tema
CREATE OR REPLACE FUNCTION generate_post_content(arena_name TEXT, post_number INT)
RETURNS TEXT AS $$
DECLARE
  contents TEXT[] := ARRAY[
    'Comecei recentemente e estou com dúvidas sobre a melhor forma de progredir. Alguém tem dicas?',
    'Tenho sentido desconforto ao fazer esse movimento. Isso é normal ou devo ajustar alguma coisa?',
    'Qual a frequência ideal para ver resultados? Estou fazendo 3x por semana.',
    'Percebi uma diferença entre um lado e outro. Isso pode ser problema?',
    'Alguém já teve experiência com essa abordagem? Funciona mesmo?',
    'Estou há 2 meses sem progressão. O que pode estar errado?',
    'Vi que existem várias escolas de pensamento sobre isso. Qual seguir?',
    'Meu treino está focado nisso mas não vejo mudança significativa ainda.',
    'Será que estou fazendo da forma correta? Filmei e parece diferente.',
    'Quanto tempo leva em média para adaptar a essa nova rotina?',
    'Li que isso pode ser contraproducente. Procede?',
    'Qual a relação entre frequência e intensidade nesse caso?',
    'Devo priorizar volume ou carga nessa fase?',
    'Tenho limitação de mobilidade. Como adaptar?',
    'Isso funciona melhor em jejum ou alimentado?',
    'Qual o papel da genética nisso tudo?',
    'Devo fazer todos os dias ou intercalar?',
    'Quando sei que é hora de aumentar a dificuldade?',
    'Isso vale para qualquer idade ou tem restrições?',
    'Como saber se estou exagerando ou sendo muito cauteloso?'
  ];
BEGIN
  RETURN contents[(post_number % array_length(contents, 1)) + 1] ||
         ' (' || arena_name || ')';
END;
$$ LANGUAGE plpgsql;

-- Função para gerar resposta da IA
CREATE OR REPLACE FUNCTION generate_ia_response(question TEXT)
RETURNS TEXT AS $$
DECLARE
  responses TEXT[] := ARRAY[
    'Ótima pergunta! Vamos analisar isso por partes: 1) É importante entender seu contexto atual, 2) Avaliar seus objetivos específicos, 3) Considerar suas limitações individuais. Você pode compartilhar mais detalhes sobre sua situação?',
    'Entendo sua preocupação. Esse tipo de dúvida é muito comum e tem explicação técnica. O mais importante é: isso piora em algum momento específico? Há gatilhos identificáveis? Essas informações ajudam muito.',
    'Excelente observação! Isso que você descreveu pode ter múltiplas causas: postura, padrão de movimento, histórico de lesões ou até características anatômicas. O ideal é fazer uma avaliação presencial para individualizar.',
    'Vamos pensar nisso de forma prática: primeiro, precisamos identificar se é uma questão de técnica, volume, intensidade ou recuperação. Cada um tem solução diferente. Você está acompanhando algum indicador de progresso?',
    'Interessante seu relato. Na literatura, encontramos que isso varia bastante entre indivíduos. O que funciona para alguns pode não funcionar para outros. O segredo está em testar de forma estruturada e avaliar resultados.',
    'Essa é uma dúvida recorrente e com boa razão - há muita informação conflitante. A verdade é que depende de vários fatores contextuais. Vou detalhar os principais pontos a considerar...',
    'Agradeço por compartilhar sua experiência. Isso ajuda muito a comunidade! Pelo que você descreveu, o caminho mais indicado seria: 1) Avaliar padrão atual, 2) Identificar limitações, 3) Progressão gradual.',
    'Entendo sua frustração. Plateaus são normais e geralmente indicam necessidade de mudança de estímulo. Algumas estratégias que costumam funcionar: variar ângulos, ajustar volume, trabalhar mobilidade.',
    'Boa pergunta técnica! A resposta envolve entender biomecânica e fisiologia. Em resumo: isso depende do seu objetivo primário. Para hipertrofia, fazemos X. Para força, Y. Para resistência, Z.',
    'Pelo seu relato, parece que você está no caminho certo mas pode estar faltando um ajuste fino. Já tentou filmar seu movimento para análise? Às vezes compensações sutis explicam muito.'
  ];
BEGIN
  RETURN responses[(LENGTH(question) % array_length(responses, 1)) + 1];
END;
$$ LANGUAGE plpgsql;

-- Função para gerar comentário de follow-up
CREATE OR REPLACE FUNCTION generate_followup_comment(post_number INT)
RETURNS TEXT AS $$
DECLARE
  comments TEXT[] := ARRAY[
    'Muito obrigado pela resposta! Vou testar isso.',
    'Excelente explicação! Esclareceu minhas dúvidas.',
    'Também tenho essa dúvida. Seguindo o tópico!',
    'No meu caso foi parecido. Resolveu em 2 semanas.',
    'Ótimo ponto! Não tinha pensado por esse ângulo.',
    'Vou tentar essa abordagem e volto aqui com o resultado.',
    'Faz total sentido. Valeu pela ajuda!',
    'Alguém tem mais experiência com isso?',
    'Concordo! Passei pelo mesmo.',
    'Isso funciona mesmo. Testei e aprovei!',
    'Interessante. Vou pesquisar mais sobre.',
    'Obrigado! Era exatamente isso que precisava.',
    'Perfeito! Vou implementar já.',
    'Boa! Não sabia dessa informação.',
    'Exatamente! Você descreveu meu caso.'
  ];
BEGIN
  RETURN comments[(post_number % array_length(comments, 1)) + 1];
END;
$$ LANGUAGE plpgsql;

SELECT '✅ Funções criadas' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 3: POPULAR CADA ARENA
-- ═══════════════════════════════════════════════════════════════

SELECT '💬 PASSO 3: Populando arenas com conversas...' as status;

DO $$
DECLARE
  arena RECORD;
  current_posts INT;
  posts_needed INT;
  post_idx INT;
  user_id TEXT;
  post_id TEXT;
  ia_response_id TEXT;
  comment_user_id TEXT;
BEGIN
  -- Para cada arena
  FOR arena IN (
    SELECT id, name, slug
    FROM "Arena"
    WHERE "isActive" = true
    ORDER BY name
  ) LOOP

    -- Contar posts existentes
    SELECT COUNT(*) INTO current_posts
    FROM "Post"
    WHERE "arenaId" = arena.id
      AND "isDeleted" = false;

    -- Calcular quantos posts criar (meta: 35 por arena)
    posts_needed := GREATEST(35 - current_posts, 0);

    IF posts_needed > 0 THEN
      RAISE NOTICE 'Arena: % - Criando % posts', arena.name, posts_needed;

      -- Criar posts
      FOR post_idx IN 1..posts_needed LOOP

        -- Escolher usuário aleatório
        SELECT id INTO user_id FROM "User"
        WHERE email LIKE 'simulado%@mock.com'
        ORDER BY RANDOM()
        LIMIT 1;

        -- Criar post do usuário
        INSERT INTO "Post" (
          id, "arenaId", "userId", content,
          "isAIResponse", "isPublished", "isDeleted",
          "commentCount", "viewCount", "likeCount",
          "createdAt", "updatedAt"
        )
        VALUES (
          gen_random_uuid(),
          arena.id,
          user_id,
          generate_post_content(arena.name, post_idx),
          false,
          true,
          false,
          0, 0, 0,
          NOW() - (random() * INTERVAL '30 days'),
          NOW() - (random() * INTERVAL '30 days')
        )
        RETURNING id INTO post_id;

        -- 70% de chance: criar resposta da IA
        IF random() < 0.7 THEN
          INSERT INTO "Post" (
            id, "arenaId", "userId", content,
            "isAIResponse", "isPublished", "isDeleted",
            "commentCount", "viewCount", "likeCount",
            "createdAt", "updatedAt"
          )
          VALUES (
            gen_random_uuid(),
            arena.id,
            user_id, -- mesmo user para manter relação
            generate_ia_response(generate_post_content(arena.name, post_idx)),
            true,
            true,
            false,
            0, 0, 0,
            NOW() - (random() * INTERVAL '29 days'),
            NOW() - (random() * INTERVAL '29 days')
          )
          RETURNING id INTO ia_response_id;
        END IF;

        -- 50% de chance: criar 1-3 comentários
        IF random() < 0.5 THEN
          FOR i IN 1..(1 + floor(random() * 3))::INT LOOP

            SELECT id INTO comment_user_id FROM "User"
            WHERE email LIKE 'simulado%@mock.com'
            ORDER BY RANDOM()
            LIMIT 1;

            INSERT INTO "Comment" (
              id, "postId", "userId", content,
              "isAIResponse", "isDeleted",
              "createdAt", "updatedAt"
            )
            VALUES (
              gen_random_uuid(),
              post_id,
              comment_user_id,
              generate_followup_comment(post_idx + i),
              false,
              false,
              NOW() - (random() * INTERVAL '28 days'),
              NOW() - (random() * INTERVAL '28 days')
            );

          END LOOP;
        END IF;

      END LOOP;

    ELSE
      RAISE NOTICE 'Arena: % - Já tem posts suficientes (% posts)', arena.name, current_posts;
    END IF;

  END LOOP;

END $$;

SELECT '✅ Posts criados' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 4: ATUALIZAR CONTADORES DE COMENTÁRIOS NOS POSTS
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 PASSO 4: Atualizando contadores de posts...' as status;

UPDATE "Post" p
SET "commentCount" = (
  SELECT COUNT(*)
  FROM "Comment" c
  WHERE c."postId" = p.id
    AND c."isDeleted" = false
)
WHERE p."isDeleted" = false;

SELECT '✅ Contadores de posts atualizados' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 5: ATUALIZAR CONTADORES DAS ARENAS
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 PASSO 5: Atualizando contadores de arenas...' as status;

UPDATE "Arena" a
SET
  "totalPosts" = (
    SELECT COUNT(*)
    FROM "Post" p
    WHERE p."arenaId" = a.id
      AND p."isDeleted" = false
  ),
  "totalComments" = (
    SELECT COUNT(*)
    FROM "Comment" c
    JOIN "Post" p ON c."postId" = p.id
    WHERE p."arenaId" = a.id
      AND c."isDeleted" = false
      AND p."isDeleted" = false
  ),
  "dailyActiveUsers" = (
    SELECT COUNT(DISTINCT p."userId")
    FROM "Post" p
    WHERE p."arenaId" = a.id
      AND p."isDeleted" = false
  );

SELECT '✅ Contadores de arenas atualizados' as status;

-- ═══════════════════════════════════════════════════════════════
-- PASSO 6: LIMPAR FUNÇÕES TEMPORÁRIAS
-- ═══════════════════════════════════════════════════════════════

DROP FUNCTION IF EXISTS get_random_sim_user();
DROP FUNCTION IF EXISTS generate_post_content(TEXT, INT);
DROP FUNCTION IF EXISTS generate_ia_response(TEXT);
DROP FUNCTION IF EXISTS generate_followup_comment(INT);

-- ═══════════════════════════════════════════════════════════════
-- PASSO 7: RELATÓRIO FINAL
-- ═══════════════════════════════════════════════════════════════

SELECT '📊 PASSO 7: Gerando relatório final...' as status;

-- Estatísticas gerais
SELECT
  '📈 ESTATÍSTICAS FINAIS' as titulo,
  COUNT(*) as "Total Arenas",
  SUM("totalPosts") as "Total Posts",
  SUM("totalComments") as "Total Comentários",
  ROUND(AVG("totalPosts")::numeric, 1) as "Média Posts/Arena"
FROM "Arena"
WHERE "isActive" = true;

-- Top 10 arenas
SELECT
  '🏆 TOP 10 ARENAS COM MAIS POSTS' as titulo;

SELECT
  name as "Arena",
  "totalPosts" as "Posts",
  "totalComments" as "Comentários",
  "dailyActiveUsers" as "Usuários"
FROM "Arena"
WHERE "isActive" = true
ORDER BY "totalPosts" DESC
LIMIT 10;

-- Distribuição de posts por arena
SELECT
  '📊 DISTRIBUIÇÃO DE POSTS' as titulo;

SELECT
  CASE
    WHEN "totalPosts" = 0 THEN '0 posts'
    WHEN "totalPosts" BETWEEN 1 AND 10 THEN '1-10 posts'
    WHEN "totalPosts" BETWEEN 11 AND 20 THEN '11-20 posts'
    WHEN "totalPosts" BETWEEN 21 AND 30 THEN '21-30 posts'
    WHEN "totalPosts" >= 31 THEN '31+ posts'
  END as "Faixa",
  COUNT(*) as "Quantidade de Arenas"
FROM "Arena"
WHERE "isActive" = true
GROUP BY 1
ORDER BY 1;

-- Verificação de integridade
SELECT
  '✅ VERIFICAÇÃO DE INTEGRIDADE' as titulo;

SELECT
  COUNT(*) as "Arenas Verificadas",
  SUM(CASE WHEN "totalPosts" >= 30 THEN 1 ELSE 0 END) as "Com 30+ Posts",
  SUM(CASE WHEN "totalPosts" < 30 THEN 1 ELSE 0 END) as "Com Menos de 30"
FROM "Arena"
WHERE "isActive" = true;

SELECT '✅ SEED COMPLETO!' as status;
SELECT 'Sistema pronto para uso! 🎉' as mensagem;
