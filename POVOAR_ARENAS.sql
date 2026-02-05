-- ════════════════════════════════════════════════════════════
-- POVOAMENTO ORGÂNICO - TODAS AS ARENAS DE CHAT
-- Execute no Supabase Studio > SQL Editor
--
-- Estrutura por thread:
-- 1) Pergunta inicial (leigo/inseguro)
-- 2) Experiência pessoal
-- 3) Alerta / medo
-- 4) Divergência técnica leve
-- 5) Solução prática diferente
-- 6) IA Facilitadora (NutriFitVision)
-- ════════════════════════════════════════════════════════════

-- Garantir que a tabela existe com schema correto
CREATE TABLE IF NOT EXISTS nfc_chat_messages (
  id TEXT PRIMARY KEY,
  comunidade_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES nfc_chat_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  original_content TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_slug ON nfc_chat_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_user ON nfc_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_created ON nfc_chat_messages(created_at DESC);

-- ════════════════════════════════════════
-- ARENA: receitas-saudaveis
-- THREAD 1: Frango todo dia enjoa
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t1_01', 'receitas-saudaveis', 'ghost_camila_fit', 'Camila Rodrigues',
'gente to numa fase que nao aguento mais frango. como vcs fazem pra comer proteina sem enjoar? eu como frango grelhado no almoço e na janta ja faz 3 semanas e to quase desistindo da dieta por causa disso...',
'2026-01-28T09:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t1_02', 'receitas-saudaveis', 'ghost_marcos_cozinha', 'Marcos Oliveira',
'comigo foi assim tb, enjoei de frango em 2 semanas. ai comecei a fazer desfiado com tempero diferente cada dia. um dia curry, outro dia mostarda com mel, outro calabresa ralada por cima. muda completamente',
'2026-01-28T09:32:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t1_03', 'receitas-saudaveis', 'ghost_jessica_nutri', 'Jéssica Almeida',
'cuidado com tempero pronto pessoal, eu usava aqueles sachê de tempero e quando fui ver tinha mais sódio que o próprio frango. minha pressão subiu e o nutricionista cortou tudo. melhor usar ervas frescas msm',
'2026-01-28T09:48:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t1_04', 'receitas-saudaveis', 'ghost_rafael_treino', 'Rafael Santos',
'acho que o problema nao é o frango em si, é comer a MESMA preparação. ovo cozido todo dia tb enjoa ne. varia a proteina: patinho, tilapia, ovo mexido, sardinha. nao precisa ser frango todo santo dia',
'2026-01-28T10:05:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t1_05', 'receitas-saudaveis', 'ghost_ana_meal', 'Ana Carolina Lima',
'eu resolvi isso fazendo meal prep diferente. domingo faço 3 proteinas diferentes: frango desfiado com açafrão, carne moída com legumes e peixe assado. ai cada dia é uma coisa e nunca enjoo. dá trabalho mas vale',
'2026-01-28T10:22:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t1_06', 'receitas-saudaveis', 'ia_facilitadora', 'NutriFitVision',
'Pontos importantes levantados aqui: a monotonia alimentar é uma das maiores causas de abandono de dieta, e o Marcos e a Ana trouxeram estratégias práticas pra resolver isso. A Jéssica levantou um alerta válido sobre sódio em temperos prontos - ervas frescas (alecrim, tomilho, orégano) dão sabor sem riscos. O Rafael tem razão que diversificar a fonte proteica é mais sustentável que ficar só no frango.

Pergunta pro grupo: quem aqui já tentou incluir proteínas vegetais (lentilha, grão de bico, tofu) no rodízio pra variar ainda mais? Como foi a adaptação no paladar?',
'2026-01-28T10:40:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t1_07', 'receitas-saudaveis', 'ghost_pedro_veg', 'Pedro Henrique Costa',
'eu misturo lentilha com arroz e fica muito bom. nao sou vegano mas reduzi carne pra 1x ao dia e nas outras refeições uso leguminosa. confesso que no começo estranhei mas hj prefiro assim',
'2026-01-28T11:01:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: dieta-vida-real
-- THREAD 1: Final de semana destrói a dieta
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t1_01', 'dieta-vida-real', 'ghost_fernanda_real', 'Fernanda Nascimento',
'durante a semana consigo seguir certinho mas chega sexta a noite eu destruo tudo. pizza, cerveja, doce... segunda começo do zero com culpa. alguem mais vive esse ciclo ou sou só eu?',
'2026-01-27T20:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t1_02', 'dieta-vida-real', 'ghost_carlos_rea', 'Carlos Eduardo Silva',
'eu vivia assim por anos. o que mudou pra mim foi parar de pensar em "dieta" e pensar em "rotina". final de semana como pizza sim mas como 2 fatias e nao a pizza inteira. nao precisa ser 8 ou 80',
'2026-01-27T20:47:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t1_03', 'dieta-vida-real', 'ghost_paula_frust', 'Paula Cristina Melo',
'eu fiz isso por tanto tempo que desenvolvi compulsão. sério msm. de segunda a quinta restringia demais, ai no fim de semana explodia. minha psicóloga disse que era ciclo de restrição-compulsão. só melhorou quando parei de cortar tudo na semana',
'2026-01-27T21:02:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t1_04', 'dieta-vida-real', 'ghost_lucas_flex', 'Lucas Ferreira',
'depende muito. tem gente que funciona bem com refeição livre no fim de semana e nao atrapalha o resultado. nem todo mundo que come pizza sexta tem compulsão. as vezes é só social msm e ta tudo bem',
'2026-01-27T21:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t1_05', 'dieta-vida-real', 'ghost_mariana_eq', 'Mariana Souza',
'o que funcionou pra mim foi incluir coisas gostosas DURANTE a semana. como chocolate amargo quase todo dia, faço panqueca de banana no café. ai chega o fim de semana e nao tenho aquela vontade absurda de comer tudo',
'2026-01-27T21:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t1_06', 'dieta-vida-real', 'ia_facilitadora', 'NutriFitVision',
'Essa thread trouxe algo fundamental: a diferença entre flexibilidade alimentar saudável e ciclo de restrição-compulsão. A Paula levantou um ponto sério que muita gente ignora - restrição excessiva na semana pode gerar efeito rebote. O Lucas tem razão que nem toda refeição livre é problema. A chave que a Mariana trouxe é interessante: incluir prazer ao longo da semana reduz a urgência do fim de semana.

Pergunta: quem aqui já tentou fazer uma "refeição livre" planejada (tipo escolher o restaurante antes) vs comer por impulso? Notaram diferença no quanto comem?',
'2026-01-27T21:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: deficit-calorico
-- THREAD 1: Déficit e metabolismo travou
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t1_01', 'deficit-calorico', 'ghost_thais_plato', 'Thaís Ribeiro',
'to em déficit de 500kcal faz 2 meses e nas primeiras 3 semanas perdi 2kg. depois disso a balança TRAVOU. nao sobe nem desce. to comendo certinho, treino 5x por semana. oq ta acontecendo?? metabolismo adaptou?',
'2026-01-29T08:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t1_02', 'deficit-calorico', 'ghost_bruno_nutri', 'Bruno Alves',
'passei por isso. no meu caso era retenção de líquido por causa do treino intenso. quando dei 1 semana de deload a balança despencou 1.5kg de uma vez. as vezes o corpo ta perdendo gordura mas segurando água',
'2026-01-29T08:38:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t1_03', 'deficit-calorico', 'ghost_dani_cansada', 'Daniela Costa',
'cuidado com déficit muito agressivo por muito tempo. eu fiz 600kcal de déficit por 4 meses seguidos e meu cabelo começou a cair, ciclo menstrual desregulou e vivia cansada. nutricionista falou que meu corpo entrou em modo de economia',
'2026-01-29T08:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t1_04', 'deficit-calorico', 'ghost_henrique_calc', 'Henrique Lopes',
'nem sempre é adaptação metabólica. as vezes a pessoa calcula errado o gasto calórico. aqueles apps que falam que vc gasta 2500kcal por dia muitas vezes superestimam. eu descobri que meu TDEE real era uns 300kcal abaixo do que o app falava',
'2026-01-29T09:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t1_05', 'deficit-calorico', 'ghost_carol_ciclo', 'Carolina Mendes',
'uma coisa que funcionou pra mim foi fazer dieta reversa. subi as calorias por 4 semanas (sem medo) e depois voltei pro déficit. parece contraditório mas o resultado voltou a aparecer. as vezes o corpo precisa desse reset',
'2026-01-29T09:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t1_06', 'deficit-calorico', 'ia_facilitadora', 'NutriFitVision',
'Ótima discussão. O Bruno trouxe um ponto que muita gente não considera: retenção hídrica mascara perda de gordura, especialmente em quem treina pesado. A Daniela alertou sobre os riscos de déficit prolongado - queda de cabelo e alteração menstrual são sinais sérios de que o corpo está sob estresse excessivo. O Henrique levantou a questão do cálculo errado de TDEE, que é mais comum do que parece. E a dieta reversa que a Carolina mencionou tem respaldo na literatura.

Pergunta: vocês estão medindo APENAS pela balança ou também usam fotos, medidas com fita e sensação da roupa? As vezes o corpo recompõe (perde gordura e ganha músculo) e a balança não muda.',
'2026-01-29T09:45:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: treino-gluteo
-- THREAD 1: Hip thrust vs agachamento
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t1_01', 'treino-gluteo', 'ghost_bia_glute', 'Beatriz Alves',
'meninas eu treino glúteo 3x na semana, faço agachamento livre, leg press, stiff... mas sinto que nao desenvolve. vi um video falando que hip thrust é o melhor exercicio pra glúteo e que agachamento é mais pra perna. é verdade isso?',
'2026-01-30T14:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t1_02', 'treino-gluteo', 'ghost_renata_exp', 'Renata Gomes',
'eu fazia só agachamento por 2 anos e minha perna cresceu mas glúteo quase nada. quando comecei a fazer hip thrust pesado (80kg+) o glúteo explodiu em 4 meses. pra mim fez toda diferença',
'2026-01-30T14:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t1_03', 'treino-gluteo', 'ghost_julia_dor', 'Júlia Fernandes',
'eu tentei hip thrust pesado e machuquei a lombar pq nao tava fazendo a retroversão pélvica certa. fiquei 2 semanas sem treinar. nao é só jogar peso, a técnica importa MUITO nesse exercicio',
'2026-01-30T14:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t1_04', 'treino-gluteo', 'ghost_anderson_bio', 'Anderson Pereira',
'nem sempre é hip thrust vs agachamento. o problema pode ser que vc nao ta ativando o glúteo direito. muita mulher faz agachamento dominando com quadríceps. tenta fazer ativação antes do treino - clam shell, ponte, abdução. ai o agachamento pega mais no glúteo',
'2026-01-30T14:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t1_05', 'treino-gluteo', 'ghost_leticia_prog', 'Letícia Martins',
'eu faço os dois e acho que o combo é o que funciona. agachamento profundo + hip thrust pesado + exercicio unilateral (búlgaro). mas a frequência tb importa. quando passei de 2x pra 3x por semana o resultado acelerou',
'2026-01-30T15:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t1_06', 'treino-gluteo', 'ia_facilitadora', 'NutriFitVision',
'Discussão muito rica. A ciência realmente mostra que o hip thrust gera maior ativação do glúteo máximo no pico da contração comparado ao agachamento. Mas como o Anderson falou, a questão da ativação prévia pode mudar completamente a equação - o padrão motor importa tanto quanto o exercício. A Júlia trouxe um alerta importante: hip thrust sem retroversão pélvica sobrecarrega a lombar. E a Letícia acertou no combo multi-exercício.

Pergunta pro grupo: quem aqui consegue sentir o glúteo trabalhando durante o agachamento ou só sente quadríceps e posterior? O que vocês fazem (ou já tentaram) pra melhorar essa conexão mente-músculo?',
'2026-01-30T15:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: odeia-treinar
-- THREAD 1: Odeio academia mas preciso de resultado
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t1_01', 'odeia-treinar', 'ghost_aline_odeia', 'Aline Batista',
'confesso que ODEIO academia. o ambiente, a musica alta, o suor dos outros. mas preciso perder peso e o médico mandou fazer exercício. alguem mais se sente assim? existe alternativa que da resultado de verdade?',
'2026-01-26T17:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t1_02', 'odeia-treinar', 'ghost_roberto_casa', 'Roberto Lima',
'eu era igual. detestava academia. comecei a treinar em casa com elástico e peso corporal. YouTube tem treino de tudo. perdi 8kg em 5 meses sem pisar na academia. nao é o ideal mas melhor que nao fazer nada',
'2026-01-26T17:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t1_03', 'odeia-treinar', 'ghost_patricia_tent', 'Patrícia Mendes',
'eu comecei assim em casa e me machuquei pq não sabia fazer os exercícios direito. sem orientação é arriscado. pelo menos umas aulas com personal pra aprender a técnica antes de treinar sozinha',
'2026-01-26T17:38:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t1_04', 'odeia-treinar', 'ghost_diego_func', 'Diego Cardoso',
'acho que o problema é achar que exercício = academia. natação, dança, luta, caminhada, pilates, escalada... tudo é exercício. o melhor treino é o que vc CONSEGUE fazer com constância. academia é UMA opção, não a única',
'2026-01-26T17:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t1_05', 'odeia-treinar', 'ghost_sabrina_muda', 'Sabrina Rocha',
'eu odiava academia até trocar de horário. ia às 18h lotada e barulhenta. mudei pra 6h da manhã e é outro mundo. 5 pessoas no máximo, silêncio, treino rápido. as vezes o problema não é a academia, é o ambiente daquele horário',
'2026-01-26T18:12:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t1_06', 'odeia-treinar', 'ia_facilitadora', 'NutriFitVision',
'Todos os caminhos que vocês trouxeram são válidos e essa diversidade é o ponto mais importante. O Diego acertou em cheio: o melhor exercício é o que você mantém com consistência. A Patrícia fez um alerta relevante sobre técnica - principalmente em casa sem supervisão. E a Sabrina trouxe algo que pouca gente considera: o horário muda completamente a experiência.

Pergunta: pra quem treina em casa ou faz atividades alternativas - como vocês medem progresso sem os aparelhos da academia? Usam app, espelho, medidas? O que mantém vocês motivados sem o ambiente tradicional?',
'2026-01-26T18:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: treino-casa
-- THREAD 1: Treino em casa funciona pra hipertrofia?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t1_01', 'treino-casa', 'ghost_vinicius_duvida', 'Vinícius Cardoso',
'comprei uns halteres ajustáveis até 20kg e uma barra com anilhas. da pra ter resultado de hipertrofia real em casa ou preciso de academia? quero ganhar massa sem sair de casa se possível',
'2026-01-25T10:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t1_02', 'treino-casa', 'ghost_gustavo_home', 'Gustavo Martins',
'da sim cara. eu treino em casa há 1 ano e meio, comecei com 65kg e to com 78kg. o segredo é progressão de carga e treinar perto da falha. com 20kg de haltere e criatividade vc faz muita coisa',
'2026-01-25T10:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t1_03', 'treino-casa', 'ghost_felipe_real', 'Felipe Nogueira',
'funciona até um ponto. depois que vc já tem uma base, 20kg de haltere fica pouco pra perna e costas. eu treinei em casa 8 meses e evoluí bem, mas depois tive que ir pra academia pq precisava de mais carga. nao adianta romantizar',
'2026-01-25T10:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t1_04', 'treino-casa', 'ghost_thiago_tip', 'Thiago Rezende',
'nem sempre precisa de mais peso. tecnicas de intensidade salvam: drop set, rest-pause, isometria, tempo de execução lento (4 segundos na negativa). com isso 20kg vira muito mais pesado. o músculo nao sabe quanto peso tem, ele responde a tensão',
'2026-01-25T10:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t1_05', 'treino-casa', 'ghost_amanda_adpt', 'Amanda Vieira',
'eu misturo: treino em casa 3x e vou na academia 2x pra usar os aparelhos que nao tenho. pago aquele plano básico baratinho só pra usar leg press e puxador. melhor dos dois mundos',
'2026-01-25T11:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t1_06', 'treino-casa', 'ia_facilitadora', 'NutriFitVision',
'Discussão bem equilibrada. O Gustavo mostrou que é possível sim ter resultados expressivos em casa, e o Thiago complementou com técnicas de intensidade que são fundamentais quando o peso é limitado. O Felipe trouxe uma visão realista: existe um teto, especialmente pra grandes grupos musculares. A Amanda encontrou um meio termo inteligente.

Pergunta pro grupo: quem treina em casa, qual exercício vocês sentem MAIS dificuldade de substituir sem os aparelhos da academia? Perna? Costas? Ombro? Compartilhem as adaptações que funcionaram.',
'2026-01-25T11:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: performance-biohacking
-- THREAD 1: Creatina todo mundo pode tomar?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t1_01', 'performance-biohacking', 'ghost_rodrigo_bio', 'Rodrigo Barbosa',
'galera to querendo começar creatina mas tenho medo. meu pai teve problema renal e ouço muita gente falar que prejudica o rim. é mito ou tem fundamento? tomo bastante água se isso ajuda',
'2026-01-31T19:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t1_02', 'performance-biohacking', 'ghost_marcelo_supl', 'Marcelo Ramos',
'tomo creatina há 3 anos sem problema nenhum. é o suplemento mais estudado que existe. 5g por dia todo dia, sem fase de saturação. meus exames de rim sempre normais. mas se vc tem histórico familiar, faz exame antes',
'2026-01-31T19:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t1_03', 'performance-biohacking', 'ghost_priscila_alert', 'Priscila Duarte',
'meu nefrologista falou que creatina NÃO causa problema renal em rim saudável, mas quem já tem predisposição precisa monitorar. ela aumenta a creatinina no sangue (normal, é metabolito) e isso pode confundir exames. sempre avisa o médico que vc toma',
'2026-01-31T19:32:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t1_04', 'performance-biohacking', 'ghost_jorge_cetico', 'Jorge Campos',
'acho que o povo exagera nos suplementos. creatina ajuda sim mas nao é mágica. se a dieta e o treino nao tão bons, creatina nao vai resolver. vi muita gente gastar dinheiro com suplemento e nao comer proteína suficiente. prioridades ne',
'2026-01-31T19:48:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t1_05', 'performance-biohacking', 'ghost_isabela_result', 'Isabela Freitas',
'no meu caso a diferença foi bem perceptível. mais reps nos exercícios, recuperação melhor entre séries e visivelmente mais "cheia" (retenção intramuscular). mas concordo com o Jorge, sem dieta e treino em dia é jogar dinheiro fora',
'2026-01-31T20:05:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t1_06', 'performance-biohacking', 'ia_facilitadora', 'NutriFitVision',
'Excelente debate com informações relevantes. A Priscila trouxe o ponto-chave: creatina em rim saudável é segura (meta-análises confirmam), mas o aumento de creatinina sérica pode confundir exames - avisar o médico é fundamental. O Jorge e a Isabela concordam que suplemento sem base (dieta + treino) não faz milagre. Pra quem tem histórico familiar renal como o Rodrigo, exames prévios são obrigatórios.

Pergunta: além de creatina, quais suplementos vocês sentem que realmente fazem diferença perceptível no treino? E quais vocês já testaram e acharam que não valeu o investimento?',
'2026-01-31T20:22:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: canetas
-- THREAD 1: Ozempic - expectativa vs realidade
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t1_01', 'canetas', 'ghost_simone_ozem', 'Simone Araújo',
'comecei ozempic há 6 semanas. nas primeiras 2 semanas perdi 3kg e achei maravilhoso. mas agora to com náusea forte, não consigo comer quase nada e perdi massa muscular tb. ninguém fala dessa parte. alguém mais passou por isso?',
'2026-02-01T11:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t1_02', 'canetas', 'ghost_regina_exp', 'Regina Oliveira',
'passei sim. os primeiros 2 meses são os piores. a náusea passa com o tempo, pelo menos comigo passou. o truque é comer pouco e frequente, evitar gordura e nao deitar depois de comer. mas massa muscular vc precisa treinar e comer proteína senão perde msm',
'2026-02-01T11:22:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t1_03', 'canetas', 'ghost_silvia_preoc', 'Sílvia Monteiro',
'eu tive efeito colateral sério. gastroparesia (estômago parou de esvaziar). fiquei internada 3 dias. nao quero assustar ninguem pq sei que é raro mas acontece. tenham acompanhamento médico de verdade, nao é vitamina',
'2026-02-01T11:40:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t1_04', 'canetas', 'ghost_adriana_posi', 'Adriana Lima',
'concordo com acompanhamento médico mas tbm nao pode demonizar. eu perdi 22kg com Wegovy em 8 meses, fiz musculação junto, proteína alta, e to com todos os exames ótimos. pra mim foi a melhor decisão da minha vida. cada organismo reage diferente',
'2026-02-01T11:58:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t1_05', 'canetas', 'ghost_eduardo_quest', 'Eduardo Ramos',
'minha dúvida é: e quando para de tomar? vi relatos de gente que recuperou todo o peso. isso nao é tipo fazer dieta radical? perde rápido e volta rápido?',
'2026-02-01T12:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t1_06', 'canetas', 'ia_facilitadora', 'NutriFitVision',
'Essa thread toca em pontos essenciais. A Simone descreveu o lado que muita gente não conta nas redes sociais. A Regina trouxe estratégias práticas pra lidar com náusea. A Sílvia alertou sobre efeitos graves - raros mas reais. A Adriana mostrou que com acompanhamento e treino os resultados podem ser excelentes. E o Eduardo fez A pergunta que todo mundo deveria fazer antes de começar.

Os estudos mostram que ~67% das pessoas recuperam parte do peso ao parar o medicamento se não mudaram hábitos durante o uso. A chave é usar o período da medicação pra construir uma base de treino e alimentação que se sustente.

Pergunta pro grupo: quem está usando ou já usou - vocês mudaram hábitos alimentares e de exercício DURANTE o uso? Ou focaram só na perda de peso pela medicação?',
'2026-02-01T12:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: ansiedade-alimentacao
-- THREAD 1: Comer emocional à noite
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t1_01', 'ansiedade-alimentacao', 'ghost_gabriela_anx', 'Gabriela Santos',
'durante o dia consigo comer super bem. mas à noite quando deito no sofá começa a vontade absurda de comer besteira. chocolate, biscoito, pão... nao é fome de verdade, é ansiedade. como controlar isso? ja tentei de tudo',
'2026-01-28T22:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t1_02', 'ansiedade-alimentacao', 'ghost_cristiane_rel', 'Cristiane Freitas',
'eu vivia isso. pra mim o que ajudou foi escovar os dentes logo depois do jantar. parece bobo mas funciona pq quebra o ciclo. e tb parei de ter besteira em casa. se nao tem, nao como. parece radical mas foi o que funcionou',
'2026-01-28T22:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t1_03', 'ansiedade-alimentacao', 'ghost_maria_serio', 'Maria Helena Torres',
'gente isso pode ser compulsão alimentar noturna, que é um transtorno real. eu demorei anos pra procurar ajuda e só melhorei com terapia + psiquiatra. nem sempre é "falta de disciplina", as vezes tem algo mais profundo',
'2026-01-28T22:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t1_04', 'ansiedade-alimentacao', 'ghost_fabio_prat', 'Fábio Mendes',
'no meu caso era porque eu comia pouco durante o dia. ficava em déficit absurdo até as 19h e à noite o corpo compensava. quando comecei a comer melhor no almoço (mais carboidrato inclusive) a compulsão noturna sumiu',
'2026-01-28T22:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t1_05', 'ansiedade-alimentacao', 'ghost_vanessa_mind', 'Vanessa Correia',
'o que mudou pra mim foi entender que a vontade de comer passa em uns 15 minutos. quando dá a vontade eu faço outra coisa: tomo um chá, leio, pego o celular. se depois de 15min ainda quiser, como. mas 80% das vezes passa',
'2026-01-28T23:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t1_06', 'ansiedade-alimentacao', 'ia_facilitadora', 'NutriFitVision',
'Thread muito importante e sensível. A Maria Helena trouxe um ponto que precisa ser normalizado: comer compulsivo noturno pode ser um transtorno e buscar ajuda profissional não é fraqueza. O Fábio trouxe outra causa comum - restrição diurna excessiva gera compensação noturna. As estratégias da Cristiane e da Vanessa (escovação, distração por 15 min) são técnicas comportamentais reais usadas em terapia.

Importante: se a compulsão causa sofrimento significativo, vergonha, ou acontece com frequência alta, considerar avaliação com profissional é o melhor caminho.

Pergunta: vocês conseguem identificar O QUE dispara a vontade? É tédio, estresse do dia, solidão, hábito de assistir TV comendo? Identificar o gatilho é o primeiro passo.',
'2026-01-28T23:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: emagrecimento-35-mais
-- THREAD 1: Metabolismo depois dos 35
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t1_01', 'emagrecimento-35-mais', 'ghost_claudia_35', 'Cláudia Ribeiro',
'tenho 38 anos e sinto que meu corpo mudou completamente. como a mesma coisa que comia aos 28 e engordo. treino da mesma forma e nao vejo resultado. é impressão minha ou o metabolismo realmente desacelera depois dos 35?',
'2026-01-29T15:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t1_02', 'emagrecimento-35-mais', 'ghost_sandra_exp', 'Sandra Oliveira',
'tenho 42 e sinto a mesma coisa. o que mudou pra mim foi priorizar musculação pesada em vez de cardio. minha nutri explicou que massa muscular segura o metabolismo e conforme a idade avança a gente perde músculo se nao treinar. comecei a focar em carga e vi diferença',
'2026-01-29T15:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t1_03', 'emagrecimento-35-mais', 'ghost_lucia_horm', 'Lúcia Campos',
'pode ser hormonal tb. eu descobri que minha tireoide tava no limite inferior da normalidade e a progesterona tava baixa. minha endócrino ajustou e em 3 meses já senti diferença. vale fazer exames completos antes de achar que é só "metabolismo lento"',
'2026-01-29T15:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t1_04', 'emagrecimento-35-mais', 'ghost_andre_trein', 'André Matos',
'com todo respeito mas acho que muita gente culpa o metabolismo quando na real mudou o estilo de vida. aos 28 vc andava mais, dormia melhor, tinha menos estresse. com 38 trabalha sentada o dia todo, dorme mal, estressada. o metabolismo cai sim mas nao tanto quanto pensam',
'2026-01-29T15:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t1_05', 'emagrecimento-35-mais', 'ghost_renata_sono', 'Renata Lima',
'ninguem fala do SONO. eu emagreci 5kg só melhorando o sono. dormia 5h por noite, comecei a dormir 7h e cortei café depois das 14h. o cortisol diminui, a vontade de doce diminui, disposição pra treinar aumenta. sono é subestimado demais',
'2026-01-29T16:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t1_06', 'emagrecimento-35-mais', 'ia_facilitadora', 'NutriFitVision',
'Essa thread resume bem a complexidade do emagrecimento após os 35. A Sandra focou no que a ciência confirma: sarcopenia (perda muscular) reduz taxa metabólica basal - musculação é essencial. A Lúcia lembrou dos hormônios - tireoide, progesterona, estradiol devem ser investigados. O André provocou um ponto incômodo mas verdadeiro: mudança de estilo de vida contribui tanto quanto a idade. E a Renata trouxe o sono, que estudos mostram que dormir menos de 6h aumenta grelina (hormônio da fome) e resistência insulínica.

Pergunta: quem aqui fez exames hormonais completos recentemente? Tireoide, testosterona, cortisol, insulina em jejum? Muita mulher descobre desregulações tratáveis que explicam a dificuldade de emagrecer.',
'2026-01-29T16:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: antes-depois
-- THREAD 1: Processo real, não foto de Instagram
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t1_01', 'antes-depois', 'ghost_tatiane_real', 'Tatiane Ferreira',
'perdi 15kg em 10 meses. mas ninguem mostra as estrias, a pele flácida, os dias que chorei de frustração pq a balança nao descia. to orgulhosa mas o processo foi MUITO mais difícil do que parece nos reels de antes e depois',
'2026-01-27T16:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t1_02', 'antes-depois', 'ghost_marcos_proc', 'Marcos Vieira',
'cara, 15kg em 10 meses é resultado incrível. eu to no mês 4 e perdi só 6kg e as vezes acho pouco. mas seu relato me motivou demais. é isso aí, nao é linear, nao é bonito todo dia, mas vai chegando',
'2026-01-27T16:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t1_03', 'antes-depois', 'ghost_luana_flac', 'Luana Pereira',
'eu perdi 25kg e fiquei com pele sobrando na barriga. nenhum exercício resolve pq é excesso de pele msm. to juntando pra cirurgia. é frustrante pq vc chega no peso ideal mas o corpo nao fica como vc imaginava',
'2026-01-27T16:32:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t1_04', 'antes-depois', 'ghost_flavio_ment', 'Flávio Gomes',
'acho que a gente precisa separar saúde de estética. a Tatiane e a Luana conquistaram SAÚDE. pele, estria, flacidez são estéticos. claro que incomodam mas a vitória de perder esse peso e manter é gigante. nao deixem a estética apagar a conquista',
'2026-01-27T16:48:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t1_05', 'antes-depois', 'ghost_juliana_mant', 'Juliana Souza',
'o mais difícil nao é perder, é manter. perdi 12kg duas vezes e recuperei. na terceira vez foquei em hábitos e nao em dieta. faz 2 anos que to no peso sem sofrimento. a mentalidade muda mais que a comida',
'2026-01-27T17:05:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t1_06', 'antes-depois', 'ia_facilitadora', 'NutriFitVision',
'Essa thread é ouro puro. A Tatiane mostrou a realidade que Instagram esconde. A Luana trouxe algo que quem perde muito peso enfrenta e pouca gente fala abertamente. O Flávio fez um resgate importante: conquista de saúde é inquestionável. E a Juliana trouxe o dado que mais importa - manutenção. Estatisticamente, ~80% das pessoas recuperam o peso em 5 anos. Os 20% que mantêm são os que mudaram IDENTIDADE (de "pessoa fazendo dieta" pra "pessoa que se alimenta bem").

Pergunta: pra quem está no processo ou já chegou - qual foi o momento mais difícil? O platô? A pressão social? A frustração com o espelho? Compartilhar isso ajuda quem está começando.',
'2026-01-27T17:22:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: exercicios-que-ama
-- THREAD 1: Exercício favorito vs eficiente
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t1_01', 'exercicios-que-ama', 'ghost_nathalia_fav', 'Nathália Costa',
'eu AMO fazer rosca direta e elevação lateral. poderia fazer o dia inteiro. mas meu personal fala que eu devia focar mais em compostos (agachamento, supino, barra fixa). posso focar no que eu gosto ou preciso fazer o que é "certo"?',
'2026-01-30T08:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t1_02', 'exercicios-que-ama', 'ghost_daniel_gosta', 'Daniel Nascimento',
'eu tb prefiro isolados. mas comecei a fazer os compostos primeiro quando to com energia e deixo os que eu gosto pro final como "recompensa". assim faço os dois e o treino fica mais legal',
'2026-01-30T08:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t1_03', 'exercicios-que-ama', 'ghost_raquel_lesao', 'Raquel Miranda',
'eu focava só no que gostava e desenvolvi desproporção muscular. ombro bonito mas costas fraca. resultado: dor no ombro por desequilíbrio. o personal tem razão, equilíbrio importa pra prevenir lesão',
'2026-01-30T08:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t1_04', 'exercicios-que-ama', 'ghost_igor_contra', 'Igor Nascimento',
'discordo parcialmente. se a pessoa só faz o que o personal manda e odeia o treino, vai desistir em 2 meses. melhor fazer exercícios que gosta com consistência do que fazer treino perfeito por 3 semanas e largar',
'2026-01-30T08:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t1_05', 'exercicios-que-ama', 'ghost_camila_meio', 'Camila Rodrigues',
'acho que o meio termo existe. meu treino tem 70% compostos/essenciais e 30% do que eu amo. nao precisa ser 100% otimizado pra dar resultado. precisa ser sustentável e prazeroso o suficiente pra vc querer voltar amanhã',
'2026-01-30T09:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t1_06', 'exercicios-que-ama', 'ia_facilitadora', 'NutriFitVision',
'Debate clássico entre otimização e aderência. A ciência diz que exercícios compostos recrutam mais fibras e geram mais estímulo hormonal. Mas o Igor e a Camila trouxeram o que os estudos também confirmam: aderência é o fator #1 de resultado a longo prazo. A Raquel alertou sobre o risco real de desequilíbrio muscular.

A solução da Camila (70/30) é muito utilizada por treinadores experientes: base com compostos + espaço para exercícios que o aluno gosta. Gostar do treino não é capricho, é estratégia.

Pergunta: qual exercício vocês ODIAVAM no começo mas aprenderam a gostar depois que viram resultado? E qual vocês amam mas sabem que não é tão eficiente assim?',
'2026-01-30T09:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: lipedema-paradoxo
-- THREAD 1: HIIT piora lipedema?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t1_01', 'lipedema-paradoxo', 'ghost_miriam_lip', 'Miriam Rodrigues',
'minha fisio falou que HIIT pode piorar o lipedema e que eu deveria fazer só aeróbico de baixa intensidade. mas eu amo crossfit e sinto que me ajuda. to confusa. é verdade que exercício intenso inflama mais?',
'2026-02-01T09:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t1_02', 'lipedema-paradoxo', 'ghost_eliana_exp', 'Eliana Martins',
'comigo foi real. fiz HIIT por 3 meses e minhas pernas incharam mais, ficaram mais pesadas e doloridas. quando troquei pra caminhada + musculação moderada com meia de compressão, melhorou muito. cada corpo é diferente mas no meu caso HIIT piorou sim',
'2026-02-01T09:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t1_03', 'lipedema-paradoxo', 'ghost_claudia_fisio', 'Cláudia Souza',
'sou fisioterapeuta e realmente tem fundamento. exercício muito intenso ativa via HIF-1α e NF-κB que são pró-inflamatórias. no lipedema o tecido adiposo já tem inflamação crônica. adicionar mais inflamação pode piorar. mas nao é regra absoluta, depende do estágio',
'2026-02-01T09:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t1_04', 'lipedema-paradoxo', 'ghost_tatiane_disc', 'Tatiane Castro',
'mas exercício leve não gera resultado muscular suficiente pra melhorar a composição corporal. eu faço musculação pesada COM meia de compressão e nao piora. acho que depende mais da compressão durante o exercício do que da intensidade em si',
'2026-02-01T09:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t1_05', 'lipedema-paradoxo', 'ghost_viviane_aej', 'Viviane Ferreira',
'eu faço AEJ (aeróbico em jejum) de baixa intensidade com meia de compressão 3x por semana. pra mim foi o combo perfeito. caminhada leve 40min em jejum. noto menos inchaço e as pernas ficam mais leves o dia todo. nao sei se é pra todo mundo mas funciona pra mim',
'2026-02-01T10:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t1_06', 'lipedema-paradoxo', 'ia_facilitadora', 'NutriFitVision',
'Discussão técnica excelente. A Cláudia trouxe a base molecular: HIF-1α e NF-κB em exercício de alta intensidade podem amplificar a inflamação no tecido adiposo do lipedema. A Eliana confirmou com experiência pessoal. Mas a Tatiane levantou um contraponto relevante: a compressão durante o exercício pode ser mais determinante que a intensidade. A Viviane trouxe o protocolo AEJ + compressão que vários especialistas em lipedema recomendam.

O consenso atual na literatura é: evitar impacto excessivo e exercícios que causem edema visível nas pernas, SEMPRE usar compressão, e priorizar exercícios que melhorem retorno venoso.

Pergunta: quem usa meia de compressão durante o treino - qual mmHg vocês usam? 15-20? 20-30? Sentem diferença entre treinar com e sem?',
'2026-02-01T10:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: lipedema (protocolo)
-- THREAD 1: Diagnóstico difícil
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t1_01', 'lipedema', 'ghost_monica_diag', 'Mônica Alves',
'fui em 3 médicos diferentes e nenhum sabia o que era lipedema. um falou que era gordura normal, outro mandou fazer dieta, outro falou que era circulação. só no 4o médico (angiologista) que diagnosticou. é muita desinformação na área médica sobre isso',
'2026-01-26T14:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t1_02', 'lipedema', 'ghost_rosa_igual', 'Rosa Maria Santos',
'mesma coisa comigo. 5 anos ouvindo que era só emagrecer. perdi 20kg e as pernas continuaram IGUAIS. ai soube que lipedema nao responde a dieta como gordura normal. foi um alívio saber que nao era culpa minha mas tb uma frustração enorme',
'2026-01-26T14:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t1_03', 'lipedema', 'ghost_diana_medo', 'Diana Oliveira',
'eu tenho medo de ter e nao ter sido diagnosticada. minhas pernas sempre foram mais grossas que o resto do corpo, dói quando aperta, e tenho hematomas fácil. como sei se é lipedema ou só genética?',
'2026-01-26T14:38:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t1_04', 'lipedema', 'ghost_kelly_info', 'Kelly Cristina Melo',
'Diana, os sinais clássicos são: desproporção (pernas grossas, cintura fina), dor ao toque/pressão, hematomas fáceis, gordura que nao sai com dieta, piora com calor e período menstrual. se vc tem 3+ desses sinais vale procurar um angiologista ou cirurgião vascular que CONHEÇA lipedema',
'2026-01-26T14:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t1_05', 'lipedema', 'ghost_lucia_trat', 'Lúcia Campos',
'o diagnóstico é clínico (nao tem exame específico). mas oq me ajudou foi: drenagem linfática 2x/semana, meia de compressão todo dia, musculação leve com compressão, e alimentação anti-inflamatória. nao cura mas controla MUITO bem os sintomas',
'2026-01-26T15:12:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t1_06', 'lipedema', 'ia_facilitadora', 'NutriFitVision',
'Esse tema é fundamental e infelizmente subdiagnosticado. Estima-se que até 11% das mulheres podem ter algum grau de lipedema. A Mônica e a Rosa retratam a realidade: muitos profissionais de saúde ainda não reconhecem. A Kelly trouxe os critérios clínicos principais. A Lúcia descreveu o protocolo conservador que a literatura atual recomenda.

Pontos-chave: lipedema NÃO responde a dieta convencional (o tecido adiposo é diferente), o diagnóstico é clínico, e o tratamento conservador (compressão + exercício adequado + drenagem) melhora significativamente a qualidade de vida.

Pergunta: quem já foi diagnosticada - quanto tempo levou do primeiro sintoma até o diagnóstico? E o que vocês gostariam de ter sabido antes?',
'2026-01-26T15:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: aspiracional-estetica
-- THREAD 1: Harmonização facial - vale a pena?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t1_01', 'aspiracional-estetica', 'ghost_larissa_harm', 'Larissa Nogueira',
'to pensando em fazer harmonização facial (preenchimento labial + mandíbula). mas tenho medo de ficar artificial. alguem aqui já fez? fica natural ou sempre dá pra perceber?',
'2026-02-02T13:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t1_02', 'aspiracional-estetica', 'ghost_priscila_fez', 'Priscila Souza',
'fiz preenchimento labial e amei. mas fui numa dermatologista que é conservadora. colocou pouco, ficou super natural. acho que o segredo é o profissional. foge de quem coloca muito de uma vez e de promoção no Instagram',
'2026-02-02T13:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t1_03', 'aspiracional-estetica', 'ghost_juliana_arr', 'Juliana Souza',
'eu fiz mandíbula e me arrependi. ficou muito marcado e nao combinou com meu rosto. dissolveu depois de 1 ano mas fiquei com trauma. pesquisem MUITO o profissional e peçam pra ver fotos de PACIENTES REAIS, nao fotos do Instagram com filtro e iluminação',
'2026-02-02T13:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t1_04', 'aspiracional-estetica', 'ghost_ricardo_opin', 'Ricardo Matos',
'como homem que já fez preenchimento (olheira): o resultado é bom quando é sutil. o problema é que muita gente quer mudança drástica e aí fica exagerado. procedimento estético é pra realçar, não pra transformar. quem quer mudar muito talvez precise de outra abordagem',
'2026-02-02T13:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t1_05', 'aspiracional-estetica', 'ghost_beatriz_prep', 'Beatriz Alves',
'antes de fazer qualquer procedimento eu acho que a pessoa deveria estar num bom momento emocional. eu fiz botox num momento de baixa autoestima achando que ia resolver e não resolveu nada. o problema era interno. hoje faço procedimentos porque QUERO, não porque PRECISO',
'2026-02-02T14:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t1_06', 'aspiracional-estetica', 'ia_facilitadora', 'NutriFitVision',
'Discussão madura e importante. A Priscila e o Ricardo concordam: menos é mais, e o profissional faz toda diferença. A Juliana trouxe o lado do arrependimento que pouca gente compartilha. E a Beatriz tocou num ponto que deveria ser pré-requisito: o estado emocional de quem busca o procedimento.

Procedimentos estéticos não são vilões quando feitos com consciência, profissional qualificado e expectativas realistas. O problema é quando viram solução para questões emocionais ou quando a busca pelo "perfeito" leva a excessos.

Pergunta: vocês pesquisam quanto tempo antes de fazer um procedimento? E quais critérios usam pra escolher o profissional? Preço? Indicação? Resultado em outros pacientes?',
'2026-02-02T14:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- VERIFICAÇÃO FINAL
-- ════════════════════════════════════════

SELECT comunidade_slug, COUNT(*) as total_mensagens
FROM nfc_chat_messages
GROUP BY comunidade_slug
ORDER BY total_mensagens DESC;
