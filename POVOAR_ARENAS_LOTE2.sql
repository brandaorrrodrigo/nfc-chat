-- ════════════════════════════════════════════════════════════
-- POVOAMENTO LOTE 2 - THREADS 2 E 3 POR ARENA
-- Execute no Supabase Studio > SQL Editor
-- ════════════════════════════════════════════════════════════

-- ════════════════════════════════════════
-- ARENA: receitas-saudaveis
-- THREAD 2: Marmita fitness que não é triste
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t2_01', 'receitas-saudaveis', 'ghost_juliana_marm', 'Juliana Tavares',
'gente minhas marmitas são tão sem graça que dá vontade de chorar na hora do almoço. arroz, frango, brócolis. todo dia. alguem tem receita de marmita fit que seja GOSTOSA de verdade? to quase pedindo iFood',
'2026-01-29T12:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t2_02', 'receitas-saudaveis', 'ghost_renato_chef', 'Renato Barbosa',
'cara o segredo é molho. faço um molho de tomate caseiro com manjericão e alho que transforma qualquer coisa. coloco no frango, na carne moída, até no peixe. marmita sem molho é castigo msm',
'2026-01-29T12:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t2_03', 'receitas-saudaveis', 'ghost_fernanda_real', 'Fernanda Nascimento',
'cuidado com molho pronto de tomate pq tem açúcar escondido. eu olhei o rótulo do que eu usava e tinha mais açúcar que proteína. faço em casa com tomate pelado e fica muito melhor e mais barato',
'2026-01-29T12:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t2_04', 'receitas-saudaveis', 'ghost_lucas_flex', 'Lucas Ferreira',
'acho q o problema é a mentalidade de "marmita fitness". come comida normal só que em porção controlada. fiz estrogonofe light com creme de ricota, arroz integral e salada. é gostoso e cabe nas macros. nao precisa sofrer',
'2026-01-29T12:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t2_05', 'receitas-saudaveis', 'ghost_carol_dica', 'Carolina Mendes',
'eu vario o carboidrato e isso mudou tudo. segunda arroz, terça batata doce, quarta macarrão integral, quinta mandioca, sexta nhoque de batata. a proteína pode ser a mesma q vc nem percebe pq o acompanhamento muda',
'2026-01-29T13:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t2_06', 'receitas-saudaveis', 'ia_facilitadora', 'NutriFitVision',
'A monotonia alimentar é responsável por mais desistências de dieta do que o déficit calórico em si. O Renato acertou nos molhos caseiros como game-changer. A Fernanda alertou sobre açúcar oculto - rótulo é obrigatório. O Lucas trouxe uma mudança de paradigma importante: "comida normal em porção controlada" é mais sustentável que "comida fitness triste". A Carolina mostrou que variar o carboidrato já muda a experiência.

Pergunta: quem aqui faz meal prep no domingo pra semana toda? Quanto tempo leva? E como vocês resolvem o problema da comida ficar "cansada" no 4o e 5o dia?',
'2026-01-29T13:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- THREAD 3: Café da manhã proteico sem ovo
INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t3_01', 'receitas-saudaveis', 'ghost_marina_cafe', 'Marina Rezende',
'tenho alergia a ovo e todo café da manhã proteico que vejo usa ovo. crepioca, omelete, ovo mexido... o que vcs comem de manhã que tem proteína e NÃO é ovo?',
'2026-01-30T07:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t3_02', 'receitas-saudaveis', 'ghost_pedro_veg', 'Pedro Henrique Costa',
'iogurte grego natural com granola e fruta. 15g de proteína fácil. ou então tapioca com queijo cottage e peito de peru. dá super certo sem ovo',
'2026-01-30T07:45:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t3_03', 'receitas-saudaveis', 'ghost_jessica_nutri', 'Jéssica Almeida',
'mas iogurte grego de mercado tem muito açúcar e pouca proteína real. o nome engana. olha o rótulo: se tiver menos de 10g de proteína por pote nao é iogurte grego de verdade, é sobremesa. o bom é caro mas vale',
'2026-01-30T08:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t3_04', 'receitas-saudaveis', 'ghost_thiago_prat', 'Thiago Rezende',
'panqueca de banana com whey. amassa 1 banana, mistura 1 scoop de whey e frigideira antiaderente. fica tipo crepe doce e tem uns 25g de proteína. como quase todo dia e nao enjoo',
'2026-01-30T08:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t3_05', 'receitas-saudaveis', 'ghost_ana_meal', 'Ana Carolina Lima',
'pra quem nao tem tempo de manhã: overnight oats com whey. mistura aveia, leite, whey e chia na noite anterior, de manha só pega da geladeira. zero preparo e umas 30g de proteína',
'2026-01-30T08:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_rec_t3_06', 'receitas-saudaveis', 'ia_facilitadora', 'NutriFitVision',
'Ótimas alternativas sem ovo. A Jéssica fez um alerta crucial sobre iogurte grego - muitos do mercado são basicamente sobremesa. Olhar rótulo é obrigatório: busque pelo menos 10g de proteína por 100g e menos de 5g de açúcar. O Thiago e a Ana trouxeram receitas com whey que resolvem fácil a questão proteica.

Dica extra: queijo cottage (13g proteína/100g), ricota (11g/100g) e tofu firme (8g/100g) são ótimas fontes matinais que pouca gente considera.

Pergunta: vocês conseguem bater a meta de proteína no café da manhã (20-30g) ou concentram tudo no almoço e jantar? Como distribuem ao longo do dia?',
'2026-01-30T08:48:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: dieta-vida-real
-- THREAD 2: Contar caloria é neurose?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t2_01', 'dieta-vida-real', 'ghost_ricardo_cont', 'Ricardo Matos',
'minha namorada pesa TUDO no almoço. arroz na balancinha, frango na balancinha, até a salada. pesa o azeite com conta-gotas. isso é normal ou é demais? fico preocupado pq ela fica ansiosa quando come fora e nao pode pesar',
'2026-01-28T13:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t2_02', 'dieta-vida-real', 'ghost_paula_frust', 'Paula Cristina Melo',
'eu faço isso e nao vejo problema. no começo parece neurose mas depois vira automático. como saber quanto to comendo se nao peso? chute nunca funciona. mas concordo que a ansiedade em comer fora é real',
'2026-01-28T13:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t2_03', 'dieta-vida-real', 'ghost_vanessa_psic', 'Vanessa Correia',
'depende. contar caloria como ferramenta de aprendizado por uns meses = ok. contar caloria a vida inteira com ansiedade quando nao pode = problema. eu desenvolvi relação ruim com comida contando caloria obsessivamente. parei e comecei a comer intuitivo com acompanhamento',
'2026-01-28T13:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t2_04', 'dieta-vida-real', 'ghost_henrique_calc', 'Henrique Lopes',
'acho que tem um meio termo. eu contei calorias por 3 meses pra aprender porções. hoje em dia sei "de olho" quanto é 150g de arroz, 200g de frango. nao peso mais nada e mantenho o resultado. a balança foi escola, nao prisão',
'2026-01-28T13:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t2_05', 'dieta-vida-real', 'ghost_mariana_eq', 'Mariana Souza',
'o problema é que cada pessoa reage diferente. pra mim contar caloria deu transtorno alimentar. pra minha amiga foi a melhor coisa que fez. nao dá pra generalizar. se ta causando ansiedade, para. se ta ajudando sem sofrimento, continua',
'2026-01-28T14:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t2_06', 'dieta-vida-real', 'ia_facilitadora', 'NutriFitVision',
'Tema delicado e muito bem discutido. A Vanessa e a Mariana trouxeram o lado do transtorno alimentar que pode ser desencadeado pela contagem obsessiva - isso é real e documentado. O Henrique mostrou o uso saudável: como ferramenta temporária de educação alimentar. A Paula representou quem se adapta bem ao método.

Sinais de alerta: recusar convites sociais por não poder pesar comida, ansiedade intensa ao comer fora, pensamento constante em números. Se isso acontece, vale conversar com profissional.

Pergunta pro grupo: vocês usam app pra contar (MyFitnessPal, FatSecret) ou fazem na mão? E quem parou de contar - como foi a transição? Sentiram que perderam o controle?',
'2026-01-28T14:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- THREAD 3: Comer limpo é caro demais
INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t3_01', 'dieta-vida-real', 'ghost_jose_preco', 'José Carlos Pereira',
'sinceramente, comer "saudável" é coisa de rico. frango de peito ta 30 reais o kg, salmão nem se fala, frutas e verduras toda semana pesa no bolso. como faz pra ter dieta boa ganhando salário mínimo?',
'2026-01-29T19:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t3_02', 'dieta-vida-real', 'ghost_anderson_eco', 'Anderson Pereira',
'ovo é a proteína mais barata que existe. 30 ovos por 15-20 reais = 180g de proteína. sardinha em lata, frango de coxa (mais barato que peito e mais gostoso). nao precisa de salmão pra comer bem. a gente foi convencido que saudável = caro e nao é',
'2026-01-29T19:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t3_03', 'dieta-vida-real', 'ghost_cristiane_real', 'Cristiane Freitas',
'mas tb nao da pra romantizar. quem trabalha 10h por dia, chega em casa cansado, tem filho... nao tem tempo de cozinhar tudo do zero. o ultraprocessado existe pq é rápido e barato. a realidade é dura pra muita gente',
'2026-01-29T19:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t3_04', 'dieta-vida-real', 'ghost_fabio_tip', 'Fábio Mendes',
'feira no sábado no final da feira é muito mais barato. eu compro frutas e legumes pela metade do preço. congelo tudo no domingo. banana madura congela pra smoothie, legume picado congela pra sopa. dá trabalho mas economiza uns 40%',
'2026-01-29T19:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t3_05', 'dieta-vida-real', 'ghost_simone_pratica', 'Simone Araújo',
'substituições baratas que funcionam pra mim: aveia no lugar de granola, banana no lugar de whey no pós treino, feijão como fonte de proteína (é proteína incompleta mas com arroz completa). dá pra montar um prato nutritivo por 5-6 reais',
'2026-01-29T20:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_dvr_t3_06', 'dieta-vida-real', 'ia_facilitadora', 'NutriFitVision',
'Discussão necessária. O José trouxe uma realidade que atinge milhões de brasileiros. O Anderson desmistificou: proteína acessível existe (ovo, sardinha, coxa de frango, vísceras). A Cristiane fez o contraponto social que nao pode ser ignorado - tempo e energia são recursos tão limitados quanto dinheiro. O Fábio e a Simone mostraram estratégias reais de economia.

Dado importante: arroz + feijão juntos formam proteína completa com todos os aminoácidos essenciais. A base da alimentação brasileira já é naturalmente nutritiva.

Pergunta: qual a refeição mais nutritiva e barata que vocês conseguem montar? Compartilhem receita + preço aproximado. Vamos montar um banco de receitas acessíveis.',
'2026-01-29T20:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: deficit-calorico
-- THREAD 2: Déficit e treino pesado combinam?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t2_01', 'deficit-calorico', 'ghost_matheus_forca', 'Matheus Campos',
'to em cutting e minha força ta caindo muito. agachava 120kg e agora mal faço 100kg. é normal perder força em déficit ou to fazendo algo errado? nao quero perder o q conquistei',
'2026-01-30T16:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t2_02', 'deficit-calorico', 'ghost_bruno_nutri', 'Bruno Alves',
'normal sim. em déficit vc tem menos glicogênio muscular, menos energia, recuperação mais lenta. o objetivo no cutting nao é ganhar força, é MANTER o máximo de músculo. reduz volume e mantem intensidade. menos séries, mesma carga',
'2026-01-30T16:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t2_03', 'deficit-calorico', 'ghost_dani_cansada', 'Daniela Costa',
'eu forcei treino pesado em déficit agressivo e me lesionei. tendinite no ombro que demorou 3 meses pra sarar. o corpo em déficit se recupera mais devagar, cuidado com ego no treino. melhor treinar inteligente do que pesado nessa fase',
'2026-01-30T16:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t2_04', 'deficit-calorico', 'ghost_igor_contra', 'Igor Nascimento',
'depende do déficit. se é 300-400kcal da pra manter treino quase normal. se é 700-800kcal ai sim a força despenca. muita gente faz déficit agressivo demais e perde músculo junto. melhor ir devagar e manter a força',
'2026-01-30T16:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t2_05', 'deficit-calorico', 'ghost_carol_ciclo', 'Carolina Mendes',
'o que salvou minha força em cutting foi aumentar a proteína pra 2.2g/kg e manter creatina. perdi 6kg e a força caiu só 5-8%. nao é mágica mas faz diferença',
'2026-01-30T17:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t2_06', 'deficit-calorico', 'ia_facilitadora', 'NutriFitVision',
'Perda de força em déficit é esperada mas pode ser minimizada. O Bruno acertou na estratégia: manter intensidade (carga) e reduzir volume (séries). A Daniela alertou sobre o risco de lesão com recuperação comprometida. O Igor trouxe um ponto-chave: a magnitude do déficit determina quanto de força você perde. Estudos mostram que déficit moderado (300-500kcal) preserva mais músculo que déficit agressivo, mesmo que demore mais.

A Carolina mencionou proteína alta (2.2g/kg) + creatina que é exatamente o que a literatura recomenda pra preservação muscular em cutting.

Pergunta: vocês fazem refeed (dia de calorias mais altas) durante o cutting? Com que frequência? Sentem diferença no treino do dia seguinte?',
'2026-01-30T17:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- THREAD 3: Jejum intermitente funciona ou é moda?
INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t3_01', 'deficit-calorico', 'ghost_priscila_ji', 'Priscila Duarte',
'comecei jejum intermitente 16/8 faz 1 semana. to comendo das 12h às 20h. a fome de manhã é forte mas to aguentando. isso realmente acelera a perda de gordura ou é só mais uma forma de fazer déficit?',
'2026-01-31T09:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t3_02', 'deficit-calorico', 'ghost_henrique_calc', 'Henrique Lopes',
'faço JI há 2 anos e funciona pra mim. mas nao por mágica metabólica e sim pq tenho menos tempo pra comer = como menos naturalmente. se vc comer 3000kcal na janela de 8h nao vai emagrecer. é uma ferramenta de restrição temporal, nao milagre',
'2026-01-31T09:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t3_03', 'deficit-calorico', 'ghost_maria_serio', 'Maria Helena Torres',
'eu tentei JI e fez mal pra mim. comecei a ter compulsão na hora de quebrar o jejum, comia rápido e muito. minha nutri falou que pra quem tem tendência a comer emocional o JI pode piorar. nem todo mundo se adapta',
'2026-01-31T09:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t3_04', 'deficit-calorico', 'ghost_rodrigo_bio', 'Rodrigo Barbosa',
'do ponto de vista metabólico: JI nao queima mais gordura que déficit calórico convencional com mesmas calorias. estudos controlados mostram isso. a vantagem é praticidade pra quem prefere pular refeição do que comer pouco em todas',
'2026-01-31T09:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t3_05', 'deficit-calorico', 'ghost_isabela_result', 'Isabela Freitas',
'eu treino às 7h da manhã em jejum e me sinto ótima. mas tem gente que passa mal, fica tonta. testei com e sem café da manhã e rendo melhor em jejum. mas isso sou EU, cada um precisa testar no próprio corpo',
'2026-01-31T10:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_def_t3_06', 'deficit-calorico', 'ia_facilitadora', 'NutriFitVision',
'O Henrique e o Rodrigo alinharam com o que a ciência mostra: JI não tem vantagem metabólica sobre déficit convencional com mesmas calorias. Revisões sistemáticas de 2023-2024 confirmam isso. O benefício real é praticidade para algumas pessoas. A Maria Helena trouxe a contraindicação importante: pessoas com histórico de compulsão alimentar podem piorar com JI.

Pontos importantes: JI não é recomendado para gestantes, adolescentes, diabéticos sem acompanhamento, ou pessoas com distúrbios alimentares.

Pergunta: quem faz JI - vocês mantêm mesmo nos fins de semana e feriados? Ou só de segunda a sexta? Como lidam com a parte social (almoço com família, café com amigos)?',
'2026-01-31T10:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: treino-gluteo
-- THREAD 2: Genética limita resultado?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t2_01', 'treino-gluteo', 'ghost_amanda_gen', 'Amanda Vieira',
'treino glúteo há 2 anos consistente, carga boa, alimentação em dia... e meu bumbum continua pequeno. vejo menina que treina há 6 meses com resultado absurdo. é genética ou to fazendo algo errado? to desanimando sério',
'2026-01-31T14:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t2_02', 'treino-gluteo', 'ghost_renata_exp', 'Renata Gomes',
'genética influencia SIM. inserção muscular, formato do quadril, distribuição de gordura... tudo genético. mas não significa que vc não pode melhorar. meu glúteo era reto e hj é redondo. nao ficou enorme mas melhorou muito. compara com vc mesma, nao com os outros',
'2026-01-31T14:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t2_03', 'treino-gluteo', 'ghost_julia_dor', 'Júlia Fernandes',
'cuidado com comparação no Instagram. metade desses resultados de 6 meses é angulação de foto, iluminação e as vezes até procedimento estético. vi uma influencer que fazia propaganda de treino de glúteo e tinha colocado silicone. é desumano comparar',
'2026-01-31T14:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t2_04', 'treino-gluteo', 'ghost_anderson_bio', 'Anderson Pereira',
'2 anos é bastante. mas a pergunta é: vc tá progressindo de carga? pq muita gente treina "consistente" mas faz o mesmo peso há 1 ano. o músculo precisa de sobrecarga progressiva. se vc faz hip thrust com 40kg há meses, nao vai crescer mais',
'2026-01-31T14:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t2_05', 'treino-gluteo', 'ghost_leticia_prog', 'Letícia Martins',
'outro ponto: vc ta comendo suficiente? eu treinava muito e comia pouco. quando aumentei calorias (especialmente carboidrato pré treino) o glúteo começou a responder. músculo nao cresce em déficit pra maioria das pessoas',
'2026-01-31T15:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_glut_t2_06', 'treino-gluteo', 'ia_facilitadora', 'NutriFitVision',
'A Amanda levantou uma frustração real que muitas mulheres vivem. A Renata trouxe verdade: genética determina o TETO e a FORMA, mas não impede melhora. A Júlia alertou sobre comparação com redes sociais - fator enorme de desmotivação. O Anderson e a Letícia identificaram duas causas práticas: falta de progressão de carga e alimentação insuficiente.

Checklist de 2 anos sem resultado: 1) A carga subiu ao longo do tempo? 2) Está em superávit ou pelo menos manutenção calórica? 3) Proteína está em 1.6-2.2g/kg? 4) Está dormindo 7-8h? Se algum desses está falhando, o problema pode não ser genética.

Pergunta: quem treina há mais de 1 ano - vocês anotam os pesos e reps de cada treino? Conseguem ver progressão numérica ao longo dos meses?',
'2026-01-31T15:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: canetas
-- THREAD 2: Efeito sanfona pós caneta
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t2_01', 'canetas', 'ghost_eduardo_quest', 'Eduardo Ramos',
'parei Ozempic depois de 6 meses. perdi 18kg usando. já recuperei 7kg em 3 meses sem a medicação. a fome voltou com tudo. to pensando se vale a pena voltar a usar ou se vou ficar dependente pra sempre',
'2026-02-02T10:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t2_02', 'canetas', 'ghost_regina_exp', 'Regina Oliveira',
'passei pelo mesmo. mas no meu caso eu nao mudei NADA de hábito durante o uso. só tomava e comia menos pq nao tinha fome. quando parou, voltei a comer como antes. o erro foi meu. a caneta deveria ter sido janela de oportunidade pra mudar estilo de vida',
'2026-02-02T10:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t2_03', 'canetas', 'ghost_silvia_preoc', 'Sílvia Monteiro',
'esse é o problema que ninguem fala antes de começar. os estudos mostram que a maioria recupera peso ao parar. e o custo de usar pra vida toda é absurdo - 800 a 1500 reais por mês. quem pode sustentar isso?',
'2026-02-02T10:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t2_04', 'canetas', 'ghost_adriana_posi', 'Adriana Lima',
'eu parei há 8 meses e mantive o peso. mas fiz diferente: durante o uso comecei musculação, montei rotina alimentar, trabalhei a relação com comida na terapia. quando parei já tinha hábitos novos. a caneta sozinha nao resolve, concordo. mas como ferramenta de transição foi incrível',
'2026-02-02T10:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t2_05', 'canetas', 'ghost_jorge_cetico', 'Jorge Campos',
'minha opinião impopular: se a pessoa precisa de remédio pra comer menos, o problema nao é fome, é comportamental. nao to julgando, to dizendo que SÓ a caneta sem trabalhar o emocional é igual tomar remédio pra dor sem tratar a causa',
'2026-02-02T11:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_can_t2_06', 'canetas', 'ia_facilitadora', 'NutriFitVision',
'Debate complexo e necessário. A Regina identificou o erro mais comum: usar a medicação sem mudar hábitos. A Adriana mostrou o caminho que a literatura recomenda: usar o período de apetite reduzido para construir novos padrões. A Sílvia trouxe a questão econômica real. O Jorge levantou um ponto parcialmente correto, mas vale um adendo: a obesidade tem componentes neurobiológicos reais (resistência à leptina, alteração no eixo GLP-1) que não são "apenas comportamentais".

Dados atuais: ~67% recuperam peso ao parar sem mudança de estilo de vida. ~30% mantêm quando combinam com exercício + reeducação alimentar + acompanhamento psicológico.

Pergunta: quem está usando atualmente - vocês estão fazendo exercício e mudando alimentação DURANTE o uso? Ou estão "deixando pra depois"?',
'2026-02-02T11:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: ansiedade-alimentacao
-- THREAD 2: Culpa depois de comer
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t2_01', 'ansiedade-alimentacao', 'ghost_camila_culpa', 'Camila Rodrigues',
'ontem comi um pedaço de bolo no aniversário da minha filha e fiquei com culpa o dia inteiro. nao consegui dormir pensando nas calorias. sei que é errado pensar assim mas nao consigo controlar. alguem mais?',
'2026-01-29T21:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t2_02', 'ansiedade-alimentacao', 'ghost_fabio_prat', 'Fábio Mendes',
'eu passava por isso. o que me ajudou foi pensar em SEMANA e nao em DIA. um pedaço de bolo numa semana de 21 refeições nao muda NADA no resultado. faz a conta: 300kcal a mais em 15000kcal semanais = 2% de diferença. irrelevante',
'2026-01-29T21:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t2_03', 'ansiedade-alimentacao', 'ghost_maria_serio', 'Maria Helena Torres',
'Camila, isso pode ser mais sério do que parece. culpa persistente com comida, insônia por causa de calorias, pensamento obsessivo... são sinais de relação disfuncional com alimentação. eu vivi isso e só melhorei com ajuda profissional. nao é frescura',
'2026-01-29T21:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t2_04', 'ansiedade-alimentacao', 'ghost_gabriela_anx', 'Gabriela Santos',
'concordo com a Maria Helena. mas tb acho que a cultura fitness piora isso. todo mundo postando marmita perfeita, "dia do lixo é pra fraco", "disciplina acima de tudo". isso cria uma relação tóxica com comida. comer bolo no aniversário da filha é NORMAL',
'2026-01-29T21:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t2_05', 'ansiedade-alimentacao', 'ghost_vanessa_mind', 'Vanessa Correia',
'uma coisa que minha terapeuta me ensinou: trocar "eu comi bolo e estraguei tudo" por "eu comi bolo no aniversário da minha filha e foi um momento especial". a comida nao é só combustível, ela tem papel social e emocional. negar isso é que causa problema',
'2026-01-29T22:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ans_t2_06', 'ansiedade-alimentacao', 'ia_facilitadora', 'NutriFitVision',
'Thread muito importante. O Fábio trouxe a perspectiva racional: matematicamente, uma refeição não define resultado. Mas como a Maria Helena e a Gabriela apontaram, quando a culpa é persistente e causa insônia, estamos além da preocupação normal - pode indicar relação disfuncional com comida. A Vanessa trouxe uma técnica real da terapia cognitivo-comportamental: reenquadrar o pensamento.

Comida não é apenas macro e caloria. Ela faz parte de celebrações, afeto, cultura. Uma relação saudável com alimentação inclui flexibilidade sem culpa.

Pergunta: vocês conseguem comer algo "fora da dieta" em eventos sociais sem culpa? Ou evitam comer pra nao sentir essa culpa depois? Como lidam?',
'2026-01-29T22:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: emagrecimento-35-mais
-- THREAD 2: Menopausa e gordura abdominal
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t2_01', 'emagrecimento-35-mais', 'ghost_helena_meno', 'Helena Cardoso',
'entrei na perimenopausa com 45 anos e minha barriga EXPLODIU. nunca tive barriga na vida e agora parece que toda gordura vai pra ali. médica falou que é hormonal. tem como reverter isso ou vou conviver com isso?',
'2026-01-30T10:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t2_02', 'emagrecimento-35-mais', 'ghost_sandra_exp', 'Sandra Oliveira',
'passei por isso com 47. reposição hormonal fez uma diferença enorme na gordura abdominal pra mim. mas tb mudei o treino pra mais musculação e menos cardio. a combinação que funcionou. só reposição sem exercício nao resolveu em quem eu conheço',
'2026-01-30T10:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t2_03', 'emagrecimento-35-mais', 'ghost_lucia_horm', 'Lúcia Campos',
'cuidado com reposição hormonal sem acompanhamento sério. minha amiga começou por conta (comprou em farmácia sem receita) e teve problema. precisa de exame, avaliação de risco, mamografia. nao é suplemento, é medicamento',
'2026-01-30T10:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t2_04', 'emagrecimento-35-mais', 'ghost_andre_trein', 'André Matos',
'a gordura abdominal na menopausa nao é só estética, é visceral. aumenta risco cardiovascular e resistência insulínica. musculação ajuda a captar glicose pelo músculo independente de insulina. ou seja: quanto mais músculo, melhor o controle metabólico',
'2026-01-30T10:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t2_05', 'emagrecimento-35-mais', 'ghost_renata_sono', 'Renata Lima',
'minha endócrino focou em: 1) sono (melatonina), 2) estresse (cortisol alto = gordura abdominal), 3) musculação 3x, 4) proteína alta. sem falar em reposição. resultado veio em 4 meses. as vezes nao é o hormônio sexual que falta, é o estilo de vida que precisa ajustar',
'2026-01-30T11:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_35_t2_06', 'emagrecimento-35-mais', 'ia_facilitadora', 'NutriFitVision',
'Tema essencial. A queda de estrogênio na perimenopausa realmente redistribui gordura para região abdominal - é fisiológico. A Sandra mostrou que reposição + exercício pode reverter parcialmente. A Lúcia alertou sobre automedicação - TRH (terapia de reposição hormonal) precisa de avaliação individualizada. O André trouxe o dado sobre gordura visceral e risco cardiovascular que toda mulher 40+ deveria conhecer.

A Renata mostrou que nem sempre a resposta é hormônio: sono, estresse e exercício impactam diretamente o cortisol que é grande responsável pelo acúmulo abdominal.

Pergunta: quem está na perimenopausa/menopausa - vocês fizeram painel hormonal completo? Quais exames pediram? Muitas mulheres não sabem o que pedir ao médico.',
'2026-01-30T11:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: lipedema-paradoxo
-- THREAD 2: Compressão durante o treino
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t2_01', 'lipedema-paradoxo', 'ghost_eliana_comp', 'Eliana Martins',
'minha fisio mandou usar meia de compressão 20-30mmHg durante TODO o treino. mas é muuito desconfortável e quente. alguem consegue treinar com isso? qual marca vcs usam? as que eu comprei apertam demais atrás do joelho',
'2026-02-02T09:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t2_02', 'lipedema-paradoxo', 'ghost_viviane_aej', 'Viviane Ferreira',
'uso Sigvaris e acho a melhor. a Kendall aperta muito no cós e incomoda. dica: compra a 7/8 (que vai até abaixo do joelho) em vez da calça inteira, é bem mais confortável pra treinar e já protege onde importa',
'2026-02-02T09:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t2_03', 'lipedema-paradoxo', 'ghost_diana_medo', 'Diana Oliveira',
'eu treinei SEM compressão por 6 meses e minhas pernas pioraram visivelmente. quando comecei a usar viu a diferença no mesmo mês. menos inchaço pós treino e menos dor. é chato mas vale muito a pena',
'2026-02-02T09:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t2_04', 'lipedema-paradoxo', 'ghost_tatiane_disc', 'Tatiane Castro',
'legging de compressão esportiva (tipo nike, adidas) NÃO é a mesma coisa que meia medicinal. a pressão é muito menor. minha angiologista explicou que precisa ser prescrita com mmHg específico pro seu caso. nao adianta usar qualquer legging apertada',
'2026-02-02T09:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t2_05', 'lipedema-paradoxo', 'ghost_kelly_info', 'Kelly Cristina Melo',
'pra quem nao aguenta meia no treino: pelo menos use DEPOIS do treino por 2-3 horas. minha fisio falou que o pós-treino é quando mais inflama. se nao consegue treinar com meia, coloca imediatamente depois. melhor que nada',
'2026-02-02T10:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lpar_t2_06', 'lipedema-paradoxo', 'ia_facilitadora', 'NutriFitVision',
'Discussão prática excelente. A Viviane trouxe dica valiosa: meia 7/8 é mais tolerável que a calça inteira. A Diana comprovou na prática a diferença que a compressão faz. A Tatiane fez uma distinção crucial: legging esportiva NÃO substitui meia medicinal prescrita - a compressão graduada é diferente. E a Kelly trouxe a alternativa do pós-treino pra quem não tolera durante.

Compressão graduada funciona assim: maior pressão no tornozelo, menor na coxa. Isso favorece o retorno venoso e linfático. Legging esportiva comprime uniformemente, sem esse gradiente.

Pergunta: quem faz drenagem linfática - vocês fazem antes ou depois do treino? E com que frequência? Combinam com a compressão?',
'2026-02-02T10:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: antes-depois
-- THREAD 2: Recuperei tudo e to recomeçando
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t2_01', 'antes-depois', 'ghost_carlos_volta', 'Carlos Eduardo Silva',
'em 2023 perdi 20kg. em 2024 recuperei 25kg. to mais gordo que antes de começar. a vergonha é enorme. to recomeçando pela terceira vez e fico pensando se dessa vez vai ser diferente ou se vou falhar de novo',
'2026-01-28T18:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t2_02', 'antes-depois', 'ghost_marcos_proc', 'Marcos Vieira',
'Carlos, eu recomeço pela QUINTA vez. sem vergonha nenhuma. cada vez que recomeça vc já sabe mais do que na vez anterior. o que deu errado antes? identifica, muda a abordagem e vai. desistir é a única forma real de falhar',
'2026-01-28T18:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t2_03', 'antes-depois', 'ghost_luana_flac', 'Luana Pereira',
'o efeito sanfona é real e cada vez fica mais difícil. mas sabe o que eu aprendi? que todas as vezes que eu falhei foi pq fiz algo radical demais. cortar tudo, treinar todo dia, obsessão com a balança. dessa vez to indo devagar e ta sendo muito melhor',
'2026-01-28T18:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t2_04', 'antes-depois', 'ghost_flavio_ment', 'Flávio Gomes',
'uma coisa que me ajudou: parar de achar que existe uma linha de chegada. nao é "vou emagrecer 20kg e pronto". é mudar pra SEMPRE a forma como vc come e se move. se a estratégia nao é sustentável pra vida toda, vc vai recuperar. sempre',
'2026-01-28T18:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t2_05', 'antes-depois', 'ghost_tatiane_real', 'Tatiane Ferreira',
'algo que ninguém fala: as vezes o motivo de recuperar nao é comida. é emocional. eu recuperei peso depois de uma separação. outra vez depois de perder o emprego. o corpo reflete o que a mente ta vivendo. acompanhamento psicológico deveria ser parte do processo',
'2026-01-28T19:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_ad_t2_06', 'antes-depois', 'ia_facilitadora', 'NutriFitVision',
'Thread corajosa do Carlos. Cada ponto levantado tem respaldo na ciência do comportamento. O Marcos trouxe resiliência real - não é sobre não cair, é sobre levantar sabendo mais. A Luana identificou o padrão: abordagens radicais falham a longo prazo. O Flávio acertou na mentalidade: não existe linha de chegada. E a Tatiane trouxe a camada emocional que a maioria dos programas de emagrecimento ignora.

Dado relevante: pessoas que mantêm o peso perdido por mais de 5 anos têm 3 características em comum: exercício regular, automonitoramento flexível, e café da manhã consistente.

Pergunta: pra quem está recomeçando - o que vocês vão fazer DIFERENTE dessa vez? O que vocês já sabem que NÃO funciona pra vocês especificamente?',
'2026-01-28T19:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: exercicios-que-ama
-- THREAD 2: Cardio vs musculação
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t2_01', 'exercicios-que-ama', 'ghost_patricia_card', 'Patrícia Mendes',
'eu AMO correr. corro 5x por semana, 8-10km por vez. mas todo mundo fala que pra emagrecer musculação é melhor. preciso mesmo largar a corrida e ir pra academia? detesto academia',
'2026-01-31T08:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t2_02', 'exercicios-que-ama', 'ghost_daniel_gosta', 'Daniel Nascimento',
'ninguém precisa largar o que ama. mas adicionar 2x de musculação por semana vai potencializar demais o resultado da corrida. mais músculo = mais gasto calórico em repouso = mais fácil emagrecer. e previne lesão na corrida tb',
'2026-01-31T08:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t2_03', 'exercicios-que-ama', 'ghost_raquel_lesao', 'Raquel Miranda',
'eu corria muito e desenvolvi lesão no joelho por falta de musculatura. o ortopedista mandou parar de correr e fortalecer primeiro. 4 meses de musculação e voltei a correr sem dor. mas agora faço os dois. nunca mais só corrida',
'2026-01-31T08:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t2_04', 'exercicios-que-ama', 'ghost_igor_contra', 'Igor Nascimento',
'acho que essa briga "cardio vs musculação" é coisa de influencer. os dois são importantes. cardio pra saúde cardiovascular, musculação pra saúde metabólica e óssea. o ideal é fazer os dois. a proporção depende do objetivo',
'2026-01-31T08:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t2_05', 'exercicios-que-ama', 'ghost_sabrina_muda', 'Sabrina Rocha',
'eu odiava musculação até descobrir treino funcional. mistura de força com movimento dinâmico. nao é corrida e nao é academia tradicional. pra quem gosta de se mexer e nao de ficar parada numa máquina pode ser o caminho',
'2026-01-31T09:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_exama_t2_06', 'exercicios-que-ama', 'ia_facilitadora', 'NutriFitVision',
'O Daniel trouxe a resposta mais equilibrada: não precisa largar a corrida, mas ADICIONAR musculação potencializa tudo. A Raquel viveu na prática o que estudos de biomecânica mostram: corredores sem fortalecimento têm maior incidência de lesões em joelho e quadril. O Igor desmistificou a falsa dicotomia cardio vs musculação. E a Sabrina mostrou que "musculação" não precisa ser a academia tradicional.

Recomendação atual da OMS: 150-300min de aeróbico moderado + 2x fortalecimento muscular por semana. Os dois se complementam.

Pergunta: pra quem faz os dois - como vocês organizam a semana? Correm e musculam no mesmo dia ou alternam? E como fica a recuperação?',
'2026-01-31T09:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: odeia-treinar
-- THREAD 2: Quanto mínimo de exercício da resultado?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t2_01', 'odeia-treinar', 'ghost_roberto_min', 'Roberto Lima',
'qual o MÍNIMO de exercício que eu preciso fazer pra ter algum resultado? sério, nao quero 1h por dia 5x na semana. quero o mínimo viável pra nao morrer cedo. existe isso?',
'2026-01-27T19:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t2_02', 'odeia-treinar', 'ghost_diego_func', 'Diego Cardoso',
'a OMS fala em 150 minutos por semana de atividade moderada. isso da 30 min por dia, 5x. mas se vc dividir em 3 sessões de 50min já ta ótimo. e moderado = caminhada rápida, nao precisa sofrer. é mais acessível do que parece',
'2026-01-27T19:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t2_03', 'odeia-treinar', 'ghost_aline_odeia', 'Aline Batista',
'mas 150 minutos é o ideal, nao o mínimo. estudos recentes mostraram que até 75 minutos por semana (metade do recomendado) já reduz risco de morte em 23%. ou seja: QUALQUER movimento é melhor que nenhum. 15 minutos 5x na semana já faz diferença',
'2026-01-27T19:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t2_04', 'odeia-treinar', 'ghost_patricia_tent', 'Patrícia Mendes',
'concordo que pouco é melhor que nada. mas se o objetivo é emagrecer de verdade e nao só "nao morrer", 15 minutos nao vai dar resultado visível. precisa de mais intensidade ou duração. depende do que vc quer',
'2026-01-27T19:52:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t2_05', 'odeia-treinar', 'ghost_sabrina_muda', 'Sabrina Rocha',
'o que eu fiz: comecei com 10 minutos de caminhada. depois de 2 semanas aumentei pra 15. depois 20. hoje faço 40 minutos sem perceber. o segredo é começar tão fácil que parece ridículo. se parece difícil demais, vc nao vai começar',
'2026-01-27T20:08:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_odeia_t2_06', 'odeia-treinar', 'ia_facilitadora', 'NutriFitVision',
'Pergunta honesta do Roberto que muita gente tem vergonha de fazer. A Aline trouxe dados científicos encorajadores: 75min/semana já reduz mortalidade significativamente. A Patrícia fez a distinção importante entre saúde básica e resultado estético - são objetivos diferentes com demandas diferentes. A Sabrina mostrou a estratégia que a psicologia comportamental chama de "hábitos atômicos": começar tão pequeno que é impossível falhar.

O "mínimo viável" pra saúde: 2-3 caminhadas de 20-30min + 2 sessões curtas de exercício com peso corporal (agachamento, flexão, prancha). Total: ~2h por semana.

Pergunta: pra quem odeia treinar mas faz mesmo assim - o que vocês fazem pra tornar MENOS chato? Podcast? Música? Treinar com alguém? O que funciona?',
'2026-01-27T20:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENAS QUE FALTAVAM: sinal-vermelho e peptideos-research
-- ════════════════════════════════════════

-- ARENA: sinal-vermelho (Dor durante exercício - precisa ter slug no banco)
-- ARENA: peptideos-research (Peptídeos - precisa ter slug no banco)

-- ════════════════════════════════════════
-- VERIFICAÇÃO FINAL
-- ════════════════════════════════════════

SELECT comunidade_slug, COUNT(*) as total_mensagens
FROM nfc_chat_messages
GROUP BY comunidade_slug
ORDER BY total_mensagens DESC;
