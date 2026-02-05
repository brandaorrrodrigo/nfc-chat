-- ════════════════════════════════════════════════════════════
-- POVOAMENTO LOTE 3 - ARENAS FALTANTES + THREADS 2/3
-- Execute no Supabase Studio > SQL Editor
-- ════════════════════════════════════════════════════════════

-- ════════════════════════════════════════
-- ARENA: sinal-vermelho
-- THREAD 1: Dor no ombro que não passa
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_01', 'sinal-vermelho', 'ghost_marcos_ombro', 'Marcos Henrique',
'gente to com uma dor no ombro direito faz 3 semanas. começa no supino e fica o dia inteiro. tomei antiinflamatorio e melhora mas volta. to treinando por cima pq nao quero perder o shape mas to preocupado. alguem ja teve isso?',
'2026-01-25T09:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_02', 'sinal-vermelho', 'ghost_dra_carol', 'Carol Fisioterapeuta',
'Marcos, 3 semanas de dor que volta mesmo com antiinflamatório é sinal de que algo estrutural pode estar irritado. O supino é o exercício que MAIS sobrecarrega o manguito rotador quando a técnica não está perfeita. Treinar por cima é o pior que vc pode fazer pq inflama mais a cada sessão. Para o supino AGORA e faz um teste: levanta o braço lateralmente devagar. Se doer entre 60° e 120° (arco doloroso) provavelmente é tendinopatia do supraespinhal. Procura um ortopedista',
'2026-01-25T09:22:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_03', 'sinal-vermelho', 'ghost_rodrigo_velho', 'Rodrigo Almeida',
'cara eu ignorei exatamente isso por 2 meses. resultado: tendinite no supraespinhal que virou bursite. fiquei 4 meses sem treinar nada de superior. perdi todo o ganho de 1 ano em 4 meses de inatividade. nao comete o msm erro que eu',
'2026-01-25T09:45:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_04', 'sinal-vermelho', 'ghost_paula_reab', 'Paula Reabilitação',
'concordo com a Carol mas tb acho que nem sempre precisa parar tudo. quando tive problema no ombro meu fisio liberou treinar perna, core, e até costas (remada baixa com pegada neutra). o que não podia era supino, desenvolvimento e elevação lateral. da pra manter bastante coisa sem agravar',
'2026-01-25T10:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_05', 'sinal-vermelho', 'ghost_marcos_ombro', 'Marcos Henrique',
'fiz o teste da Carol e doi sim nessa faixa. mds. vou procurar ortopedista essa semana. Paula boa dica vou treinar só o que não doi enquanto isso. to puto comigo mesmo de ter insistido 3 semanas',
'2026-01-25T10:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_06', 'sinal-vermelho', 'ghost_andre_func', 'André Funcional',
'pessoal eu acho que o problema é que a galera faz supino com ombro protraído e sem retração escapular. isso joga toda a carga no manguito. se tivesse feito certo desde o início provavelmente nao teria acontecido. prevenção > tratamento',
'2026-01-25T10:50:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_07', 'sinal-vermelho', 'ghost_dra_carol', 'Carol Fisioterapeuta',
'André, técnica ajuda MUITO mas não é garantia. Existem fatores anatômicos (formato do acrômio tipo 3, por exemplo) que predispõem a lesão mesmo com técnica perfeita. Não é legal culpar a vítima. O mais importante agora é o Marcos procurar avaliação e não agravar',
'2026-01-25T11:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t1_08', 'sinal-vermelho', 'ia_facilitadora', 'NutriFitVision',
'Caso importante que o Marcos trouxe e que muita gente vive em silêncio. A Carol identificou corretamente o teste do arco doloroso - dor entre 60-120° de abdução sugere envolvimento do supraespinhal. O Rodrigo deu um depoimento real do que acontece quando ignora. A Paula trouxe equilíbrio: não precisa parar TUDO, mas sim evitar movimentos que agravam.

Regra de ouro: dor que persiste por mais de 2 semanas E que piora durante o exercício NÃO é "dor normal de treino". É sinal vermelho que precisa de avaliação profissional.

Marcos, nos conta depois o que o ortopedista disse?',
'2026-01-25T11:40:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: sinal-vermelho
-- THREAD 2: Joelho estrala toda vez que agacha
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t2_01', 'sinal-vermelho', 'ghost_thais_joelho', 'Thaís Cardoso',
'meu joelho estrala TODA vez que eu agacho, no treino e fora dele. tipo escada, pegar algo no chão, tudo. não doi nada mas o barulho é alto e assusta. minha personal disse que se nao doi nao tem problema mas será msm? alguem mais tem isso?',
'2026-01-27T14:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t2_02', 'sinal-vermelho', 'ghost_dra_carol', 'Carol Fisioterapeuta',
'Thaís, sua personal está parcialmente certa. Crepitação (estralos) sem dor geralmente é inofensiva - é ar/líquido sinovial se movendo na articulação. MAS se começar a ter dor, inchaço, sensação de "travamento", ou se o estalo for acompanhado de falseio, aí muda completamente. Monitora esses sinais',
'2026-01-27T14:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t2_03', 'sinal-vermelho', 'ghost_ricardo_vet', 'Ricardo Souza',
'eu tb tinha isso e ficava tranquilo. ai um dia começou a doer do nada. fui no médico e era condromalacia grau 2. o estalo era o primeiro sinal que eu ignorei por 1 ano. não to dizendo q é o caso de todo mundo mas vale ficar atento',
'2026-01-27T14:48:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t2_04', 'sinal-vermelho', 'ghost_camila_pil', 'Camila Brito',
'gente eu faço pilates e a instrutora fala q estalo sem dor é normal e que fortalecendo vasto medial e glúteo médio geralmente melhora. comigo melhorou tipo 80%. ainda estrala as vezes mas muito menos. pode ser questão de estabilidade e não de lesão',
'2026-01-27T15:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t2_05', 'sinal-vermelho', 'ghost_thais_joelho', 'Thaís Cardoso',
'Ricardo vc me assustou agora kk. Carol obrigada pela explicação. vou ficar monitorando. Camila vou tentar focar no vasto medial pra ver se melhora. não tenho dor nem inchaço por enquanto então vou observar',
'2026-01-27T15:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t2_06', 'sinal-vermelho', 'ghost_andre_func', 'André Funcional',
'um ponto que ninguem falou: calçado. se vc treina de tênis com amortecimento alto (tipo pra corrida) fazendo agachamento, o joelho fica instável e estrala mais. experimenta treinar descalça ou com sapatilha e vê se muda. comigo mudou total',
'2026-01-27T15:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t2_07', 'sinal-vermelho', 'ia_facilitadora', 'NutriFitVision',
'Ótima discussão com visões complementares. Resumindo os sinais de ALERTA no joelho que estala:

SEM dor + SEM inchaço + SEM falseio = provavelmente benigno (como a Carol explicou)
COM dor OU inchaço OU travamento = precisa de avaliação ortopédica

O Ricardo trouxe um lembrete importante: crepitação pode ser o primeiro sinal de condromalacia. A Camila sugeriu fortalecimento (vasto medial + glúteo médio) que é o tratamento padrão. E o André lembrou do calçado - fator muitas vezes ignorado.

Thaís, se começar a doer não espera pra procurar avaliação. Quanto antes, melhor o prognóstico.',
'2026-01-27T16:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: sinal-vermelho
-- THREAD 3: Tontura durante treino pesado
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t3_01', 'sinal-vermelho', 'ghost_bruno_tont', 'Bruno Martins',
'pessoal preciso de ajuda. to tendo tontura no meio do treino de perna, especialmente no leg press pesado. tipo escurece a vista e preciso sentar. isso é normal? meu professor fala que é pq to pegando pesado e que é bom sinal mas achei estranho',
'2026-01-29T08:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t3_02', 'sinal-vermelho', 'ghost_dra_carol', 'Carol Fisioterapeuta',
'Bruno, tontura e escurecimento de vista durante exercício NÃO é bom sinal. Seu professor está errado nisso. Pode ser: 1) queda de pressão (muito comum no leg press pela posição), 2) respiração errada (prender demais ou Valsalva excessivo), 3) hipoglicemia, 4) desidratação. Em casos mais raros pode indicar problema cardíaco. Se acontece com frequência, faça check-up cardiológico. Sério.',
'2026-01-29T08:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t3_03', 'sinal-vermelho', 'ghost_leandro_exp', 'Leandro Campos',
'eu tinha isso e era pressão baixa + treinar em jejum de manhã. comecei a tomar um café com torrada antes do treino e sumiu. as vezes é simples assim. mas concordo com a Carol que se persistir tem q investigar. fiz teste ergométrico pra tirar dúvida e ficou tudo ok',
'2026-01-29T08:50:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t3_04', 'sinal-vermelho', 'ghost_renata_nutri', 'Renata Cunha',
'outra coisa: manobra de Valsalva prolongada (aquele "trava" respiratório pra pegar peso) aumenta muito a pressão intratorácica e quando solta, a pressão cai de repente. no leg 45 inclinado pior ainda pq as pernas ficam acima do coração. tenta respirar melhor durante o movimento e ve se muda',
'2026-01-29T09:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t3_05', 'sinal-vermelho', 'ghost_bruno_tont', 'Bruno Martins',
'caramba então meu professor ta errado msm. eu treino as 6h da manhã e não como nada antes, só água. deve ser isso né. vou testar comer algo antes. e essa parada da respiração faz sentido pq eu prendo muito o ar no leg. vou corrigir e se continuar procuro cardiologista',
'2026-01-29T09:40:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t3_06', 'sinal-vermelho', 'ghost_paula_reab', 'Paula Reabilitação',
'Bruno uma dica: se escurecer a vista NÃO levanta rápido. senta no chão com a cabeça entre os joelhos. já vi gente desmaiar e bater a cabeça na academia. escurecimento de vista é aviso de que o cérebro ta sem oxigênio suficiente naquele momento. não é brincadeira',
'2026-01-29T10:05:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_sinal_t3_07', 'sinal-vermelho', 'ia_facilitadora', 'NutriFitVision',
'Caso sério que o Bruno trouxe e que merece atenção. A Carol corrigiu uma informação perigosa: tontura durante treino NÃO é "bom sinal".

Causas mais comuns: jejum prolongado, desidratação, Valsalva excessivo, e queda de pressão postural (especialmente no leg press pela posição inclinada).

Protocolo básico: 1) Alimentação leve 30-60min antes do treino, 2) Hidratação adequada, 3) Respiração controlada durante o movimento, 4) Se persistir: check-up cardiológico com teste ergométrico.

A Paula lembrou um ponto de segurança crucial: se escurecer a vista, senta IMEDIATO com cabeça baixa. Desmaio em academia pode resultar em trauma.

Bruno, nos atualiza depois que testar as mudanças?',
'2026-01-29T10:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: peptideos-research
-- THREAD 1: BPC-157 funciona mesmo ou hype?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_01', 'peptideos-research', 'ghost_felipe_bpc', 'Felipe Augusto',
'pessoal to pesquisando sobre BPC-157 pq to com uma tendinite que nao cura faz meses. vi muita gente falando que é milagroso pra recuperação mas tb vi gente dizendo que os estudos são todos em ratos e não tem nada em humanos. alguem aqui já usou? funcionou ou é hype?',
'2026-01-24T10:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_02', 'peptideos-research', 'ghost_dr_wagner', 'Wagner Endocrino',
'Felipe, vou ser honesto: os estudos de BPC-157 são quase todos em roedores e in vitro. Os resultados são impressionantes em ratos - regeneração de tendão, proteção gástrica, angiogênese. MAS extrapolar de rato pra humano é arriscado. Não existe ensaio clínico fase 3 em humanos. O que existe é relato anedótico de atletas, que tem viés enorme. Dito isso, o perfil de segurança PARECE ser bom nos relatos. Mas "parece" não é evidência.',
'2026-01-24T10:32:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_03', 'peptideos-research', 'ghost_rafael_usou', 'Rafael Mendes',
'eu usei BPC-157 subcutâneo por 4 semanas pra epicondilite que não melhorava com nada. 250mcg 2x/dia perto do cotovelo. minha experiência: melhorou MUITO a partir da 2a semana. consigo treinar sem dor agora. pode ser placebo? pode. mas pra mim funcionou e eu testei pq ja tinha tentado fisio, anti-inflamatório, PRP e nada adiantou',
'2026-01-24T10:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_04', 'peptideos-research', 'ghost_amanda_cetica', 'Amanda Lopes',
'Rafael com todo respeito mas vc não sabe se melhorou pelo BPC ou se ia melhorar naturalmente. epicondilite tem ciclo de melhora espontânea. e outra: onde vc comprou? pq a maioria dos peptídeos vendidos online não tem controle de qualidade nenhum. pode vir subdosado, contaminado, ou nem ser o que diz no rótulo. esse é o risco real que ninguem fala',
'2026-01-24T11:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_05', 'peptideos-research', 'ghost_rafael_usou', 'Rafael Mendes',
'Amanda justo, não posso provar que foi o BPC. Mas 8 meses sem melhora e de repente melhora na 2a semana de uso? Coincidência grande. Sobre qualidade concordo 100%, comprei de fonte que faz teste de pureza por HPLC e manda o certificado. Mas sei que a maioria não faz isso',
'2026-01-24T11:45:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_06', 'peptideos-research', 'ghost_dr_wagner', 'Wagner Endocrino',
'esse é o ponto central: sem regulamentação, sem padronização. Mesmo que o BPC-157 "funcione" em teoria, na prática vc pode estar injetando qualquer coisa. E o subcutâneo tem risco de infecção no local, reação alérgica, e efeitos que a gente simplesmente não conhece a longo prazo em humanos. Usar? É decisão pessoal. Mas tem que entrar sabendo que é experimental de verdade',
'2026-01-24T12:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_07', 'peptideos-research', 'ghost_lucas_oral', 'Lucas Tavares',
'tem gente usando BPC oral (cápsula) em vez de injeção pra evitar esses riscos. os estudos em ratos originais eram orais inclusive. alguem tem experiencia com oral? pq injetar eu nao tenho coragem mas comprimido eu tomaria',
'2026-01-24T12:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t1_08', 'peptideos-research', 'ia_facilitadora', 'NutriFitVision',
'Discussão de alto nível aqui. O Wagner contextualizou bem: evidência forte em roedores, fraca em humanos. O Rafael trouxe experiência pessoal positiva mas a Amanda levantou pontos válidos sobre viés de confirmação e qualidade do produto.

Estado atual da ciência sobre BPC-157:
- Mecanismo: estimula angiogênese e produção de fator de crescimento (em modelos animais)
- Via oral vs subcutâneo: ambas testadas em ratos, oral tem biodisponibilidade menor mas perfil mais seguro
- Riscos reais: contaminação do produto, falta de padronização, efeitos de longo prazo desconhecidos
- Status regulatório: NÃO é aprovado por nenhuma agência reguladora como terapêutico

Lembrete: esta arena é para discussão informativa e NÃO substitui orientação médica. Decisões sobre uso de peptídeos devem envolver profissional de saúde.',
'2026-01-24T13:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: peptideos-research
-- THREAD 2: GH secretagogos (MK-677) vale a pena?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t2_01', 'peptideos-research', 'ghost_thiago_gh', 'Thiago Rocha',
'to pensando em usar MK-677 pra aumentar GH naturalmente. vi que é oral (nao precisa injetar) e que ajuda no sono, recuperação e composição corporal. meu GH ta baixo no exame (tenho 38 anos). o que vcs acham, vale a pena ou é furada?',
'2026-01-26T11:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t2_02', 'peptideos-research', 'ghost_dr_wagner', 'Wagner Endocrino',
'Thiago, MK-677 (ibutamoren) é um secretagogo de GH - não é GH sintético. Ele estimula a glândula a produzir mais. Tem estudos em humanos sim (diferente do BPC-157). Os efeitos demonstrados: aumento de GH e IGF-1, melhora da qualidade do sono, aumento de massa magra leve. PORÉM: aumenta fome MUITO, pode piorar resistência à insulina, retenção hídrica, e o aumento de IGF-1 prolongado é controverso em relação a risco oncológico. Não é tão simples quanto parece',
'2026-01-26T11:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t2_03', 'peptideos-research', 'ghost_marcos_mk', 'Marcos Vieira',
'uso MK-677 faz 6 meses. 12.5mg antes de dormir. sono melhorou absurdamente, recuperação de treino tb. perdi gordura abdominal e ganhei uns 2kg de massa magra. fome aumentou sim nas primeiras 2 semanas dps normalizou. glicemia monitorada e nao alterou no meu caso. mas entendo que cada um é cada um',
'2026-01-26T11:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t2_04', 'peptideos-research', 'ghost_amanda_cetica', 'Amanda Lopes',
'Marcos 2kg de massa magra em 6 meses pode ser água. MK-677 causa retenção hídrica que aparece como "massa magra" na bioimpedância e até no DEXA. A real composição corporal pode não ter mudado tanto. E 6 meses de uso contínuo de algo que eleva IGF-1 sem acompanhamento médico rigoroso é arriscado. Vc fez exames de IGF-1 e insulina durante o uso?',
'2026-01-26T12:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t2_05', 'peptideos-research', 'ghost_marcos_mk', 'Marcos Vieira',
'Amanda fair point sobre a agua. fiz IGF-1 no mês 3 e subiu de 180 pra 310 (referência até 280). insulina basal ficou ok. meu endocrino sabe que uso e acompanha. nao recomendo ninguem usar sem acompanhamento. mas no meu caso com exames e médico ciente me sinto seguro',
'2026-01-26T12:40:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t2_06', 'peptideos-research', 'ghost_dr_wagner', 'Wagner Endocrino',
'IGF-1 de 310 com referência até 280 é acima do range. Não é dramático mas a longo prazo IGF-1 cronicamente elevado está associado em estudos epidemiológicos a maior risco de certos tipos de câncer (próstata, mama, cólon). A associação é estatística, não causal comprovada, mas é dado que existe. Para uso prolongado eu sugeriria ciclar: 3 meses on, 1 mês off. E monitorar IGF-1 e HOMA-IR trimestralmente',
'2026-01-26T13:05:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t2_07', 'peptideos-research', 'ia_facilitadora', 'NutriFitVision',
'Discussão equilibrada sobre MK-677. O Wagner trouxe o panorama científico completo - tem dados em humanos mas com ressalvas. O Marcos compartilhou experiência positiva COM acompanhamento médico. A Amanda levantou o ponto da retenção hídrica confundindo com massa magra (muito válido).

Pontos-chave sobre MK-677:
- É um dos poucos secretagogos com estudos em humanos
- Benefícios: sono, recuperação, composição corporal (leve)
- Riscos: fome aumentada, resistência à insulina, IGF-1 elevado cronicamente
- Monitoramento OBRIGATÓRIO: glicemia, insulina, IGF-1, HOMA-IR
- Sugestão do Wagner: ciclar 3 on / 1 off para mitigar riscos

Lembrete: peptídeos e secretagogos são substâncias experimentais. Uso sem acompanhamento médico é irresponsável.',
'2026-01-26T13:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: peptideos-research
-- THREAD 3: TB-500 vs BPC-157 para lesão
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t3_01', 'peptideos-research', 'ghost_daniel_les', 'Daniel Costa',
'vi gente usando TB-500 junto com BPC-157 pra recuperação de lesão. tipo um combo. alguem sabe a diferença entre os dois? qual é melhor pra tendão? ou os dois juntos realmente tem sinergia?',
'2026-01-28T09:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t3_02', 'peptideos-research', 'ghost_dr_wagner', 'Wagner Endocrino',
'Daniel, mecanismos diferentes: BPC-157 atua mais em angiogênese (formação de novos vasos) e fator de crescimento local. TB-500 (Timosina Beta-4) atua mais em migração celular e regulação de actina, ou seja, ajuda células a "irem" pro lugar certo. Em teoria se complementam. Na prática: todos os dados são pré-clínicos. A ideia do combo é lógica do ponto de vista molecular mas ninguem testou em ensaio clínico controlado em humanos',
'2026-01-28T09:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t3_03', 'peptideos-research', 'ghost_rafael_usou', 'Rafael Mendes',
'usei os dois juntos no protocolo da epicondilite que falei no outro thread. BPC-157 250mcg + TB-500 500mcg, ambos subcutâneo perto do local. Não consigo dizer qual fez mais efeito pq usei junto. mas o pessoal em fóruns de research fala que TB-500 é melhor pra tendão e BPC melhor pra gástrico e ligamento',
'2026-01-28T09:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t3_04', 'peptideos-research', 'ghost_amanda_cetica', 'Amanda Lopes',
'gente eu respeito quem pesquisa e decide usar com consciência. mas "fórum de research" não é fonte científica. é um grupo de pessoas fazendo auto-experimentação sem controle. os vieses são enormes: quem melhorou posta, quem não melhorou não posta, quem teve efeito colateral esconde. é o viés de sobrevivência clássico',
'2026-01-28T10:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t3_05', 'peptideos-research', 'ghost_daniel_les', 'Daniel Costa',
'Amanda concordo sobre os forums. mas qdo a medicina convencional não resolve (e no meu caso fiz 6 meses de fisio sem melhora) a pessoa começa a procurar alternativas. o ideal seria ter estudos em humanos mas enquanto não tem, a galera vai se arriscando. é a realidade',
'2026-01-28T10:45:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t3_06', 'peptideos-research', 'ghost_dr_wagner', 'Wagner Endocrino',
'os dois tem razão. A frustração do Daniel é legítima e a cautela da Amanda tb. O que eu sugeriria: antes de partir pra peptídeos, esgote as opções com mais evidência: ondas de choque (evidência moderada pra tendinopatia), PRP (evidência fraca-moderada), reabilitação excêntrica (evidência forte). Se nada funcionar e decidir tentar peptídeos, pelo menos faça com acompanhamento médico e exames antes/durante',
'2026-01-28T11:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_pept_t3_07', 'peptideos-research', 'ia_facilitadora', 'NutriFitVision',
'Discussão madura sobre TB-500 vs BPC-157. O Wagner explicou os mecanismos: BPC-157 foca em angiogênese/vasos, TB-500 em migração celular/actina. Em teoria complementares, mas sem comprovação em humanos.

Hierarquia baseada em evidência para tendinopatias crônicas:
1. Reabilitação excêntrica (mais evidência)
2. Ondas de choque extracorpóreas (evidência moderada)
3. PRP - Plasma Rico em Plaquetas (evidência mista)
4. Peptídeos como BPC-157/TB-500 (pré-clínico apenas)

A Amanda levantou o viés de sobrevivência em fóruns - ponto cientificamente correto. O Daniel expressou a frustração real de quem não melhora com tratamento convencional.

Esta arena é para discussão informativa. Qualquer decisão sobre uso de peptídeos deve ser feita COM profissional de saúde.',
'2026-01-28T11:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: treino-casa
-- THREAD 2: Treino sem equipamento nenhum funciona?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t2_01', 'treino-casa', 'ghost_mariana_casa', 'Mariana Oliveira',
'galera eu nao tenho NADA em casa. sem halteres, sem elástico, sem barra, nada. só eu e o chão. da pra fazer alguma coisa com isso ou to perdendo tempo? minha academia fechou e to sem grana pra outra',
'2026-01-27T07:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t2_02', 'treino-casa', 'ghost_pedro_calit', 'Pedro Calistenia',
'Mariana claro que dá. calistenia é basicamente isso. agachamento búlgaro (pé no sofá), flexão de braço, prancha, afundo, elevação de quadril, agachamento pistol (se conseguir). treinei 2 anos só com peso corporal e fiquei em melhor forma que na academia. o segredo é progressão: variações mais difíceis quando fica fácil, não mais repetições',
'2026-01-27T07:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t2_03', 'treino-casa', 'ghost_carol_real2', 'Carolina Santos',
'funciona pra um nível sim. mas vou ser honesta: pra hipertrofia significativa em algum momento vc vai precisar de sobrecarga. peso corporal tem limite. se o objetivo é saúde, mobilidade e condicionamento, é perfeito. se quer construir músculo sério, eventualmente precisa de peso. dito isso, um par de halteres ajustáveis de 10kg resolve muito e não é tão caro',
'2026-01-27T07:48:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t2_04', 'treino-casa', 'ghost_pedro_calit', 'Pedro Calistenia',
'Carol discordo parcialmente. gente que faz muscle-up, front lever, planche, tem hipertrofia significativa sem peso nenhum. o problema é que a maioria não progride nos exercícios. faz 50 flexões fáceis em vez de aprender a fazer flexão archer ou flexão em pino. calistenia avançada é sobrecarga sim, só que com alavanca e não com peso',
'2026-01-27T08:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t2_05', 'treino-casa', 'ghost_mariana_casa', 'Mariana Oliveira',
'Pedro vc me animou. Carolina tb, obrigada pela honestidade. vou começar com o básico que o Pedro falou e se gostar invisto nos halteres depois. por enquanto só quero voltar a me mexer e parar de ficar sedentária. algo é melhor que nada né',
'2026-01-27T08:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t2_06', 'treino-casa', 'ghost_thais_dica', 'Thaís Mendes',
'dica: garrafão de água de 5L = 5kg de peso. mochila com livros nas costas pra fazer flexão e agachamento com peso. galão de amaciante cheio de areia = 8-10kg pra remada. criatividade resolve muita coisa quando não tem equipamento',
'2026-01-27T08:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t2_07', 'treino-casa', 'ia_facilitadora', 'NutriFitVision',
'Discussão super útil pra quem está começando. O Pedro mostrou que calistenia funciona - a chave é PROGRESSÃO de dificuldade (variações mais difíceis, não mais reps). A Carolina equilibrou: pra saúde e condicionamento é perfeito, pra hipertrofia máxima eventualmente precisa de sobrecarga. A Thaís trouxe soluções criativas com o que tem em casa.

Treino mínimo viável sem equipamento (3x por semana):
- Agachamento búlgaro: 3x12 cada perna
- Flexão de braço (joelhos se necessário): 3x até falha
- Elevação de quadril: 3x15
- Prancha: 3x30-60seg
- Afundo: 3x12 cada perna

Mariana, comece e nos conta como está indo! Algo > nada, sempre.',
'2026-01-27T09:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: treino-casa
-- THREAD 3: Vizinho reclamando do barulho do treino
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t3_01', 'treino-casa', 'ghost_lucas_viz', 'Lucas Barros',
'gente situação chata: moro em apartamento e meu vizinho de baixo reclamou do barulho do meu treino. faço HIIT com saltos e burpee de manhã. ele subiu batendo na porta. entendo o lado dele mas tb preciso treinar. como vcs resolvem isso? to pensando em comprar tapete mas será que resolve?',
'2026-01-29T06:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t3_02', 'treino-casa', 'ghost_ana_apt', 'Ana Paula',
'Lucas eu passei por EXATAMENTE isso. a solução: troquei todo exercício de impacto por versão sem salto. burpee sem salto (faz a prancha, levanta, e fica na ponta dos pés em vez de saltar), agachamento sem salto, polichinelo virou step lateral. perdi um pouco de intensidade? sim. mas ninguem reclamou mais e consigo treinar em paz',
'2026-01-29T06:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t3_03', 'treino-casa', 'ghost_roberto_eng', 'Roberto Silva',
'tapete de EVA grosso (20mm) ajuda bastante mas não elimina totalmente. o impacto não é só sonoro, é vibração que transmite pela estrutura do prédio. concordo com a Ana: tirar saltos é a melhor solução. ou treina no horário que o prédio permite barulho (geralmente 8h-22h)',
'2026-01-29T07:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t3_04', 'treino-casa', 'ghost_lucas_viz', 'Lucas Barros',
'Ana boa ideia vou tentar tirar os saltos. Roberto eu treino 6h da manhã antes do trabalho, acho q esse é o problema tb kk. vou mudar pra versões sem impacto e tentar fazer dps das 8h no final de semana pelo menos',
'2026-01-29T07:40:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t3_05', 'treino-casa', 'ghost_pedro_calit', 'Pedro Calistenia',
'6h da manhã com burpee e saltos?? cara eu seria seu vizinho bravo tb kkk. mas falando sério: treino de calistenia é silencioso demais. flexão, prancha, agachamento isométrico, hollow body, L-sit... tudo zero barulho e MUITO eficiente. vale mais que HIIT com impacto na maioria dos objetivos',
'2026-01-29T08:05:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_casa_t3_06', 'treino-casa', 'ia_facilitadora', 'NutriFitVision',
'Problema real de quem treina em apartamento. Soluções que funcionam:

1. Substituir saltos por versões sem impacto (a Ana mostrou como)
2. Tapete EVA 20mm+ reduz barulho mas não vibração (Roberto explicou)
3. Respeitar horários do prédio (geralmente 8h-22h)
4. Calistenia silenciosa como alternativa (Pedro sugeriu)

HIIT sem saltos que funciona em apartamento:
- Agachamento rápido (sem saltar)
- Mountain climber controlado
- Flexão explosiva (mãos saem mas pés ficam)
- Prancha com shoulder tap
- Step lateral rápido

Lucas, treinar é importante mas boa convivência tb. Adaptar o treino é mais fácil que mudar de vizinho. Nos conta se as mudanças funcionaram!',
'2026-01-29T08:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: performance-biohacking
-- THREAD 2: Creatina além da academia
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t2_01', 'performance-biohacking', 'ghost_gabriel_creat', 'Gabriel Mendes',
'to lendo sobre creatina pra cognição e não só pra treino. parece que ajuda memória, foco, e até previne declínio cognitivo. alguem aqui usa creatina com foco em performance mental? 5g/dia igual pro treino ou dose diferente?',
'2026-01-26T13:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t2_02', 'performance-biohacking', 'ghost_dr_lucas_bio', 'Lucas Biohacker',
'Gabriel, os estudos de creatina pra cognição são promissores. Tem meta-análise mostrando benefício em situações de privação de sono e estresse cognitivo. A dose é a mesma: 3-5g/dia de monohidrato. O cérebro usa creatina como reserva energética assim como o músculo. Efeito mais notável em vegetarianos/veganos (que tem reservas menores) e pessoas com privação de sono. Não espere um efeito tipo "pílula do NZT" mas é sutil e consistente',
'2026-01-26T13:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t2_03', 'performance-biohacking', 'ghost_fernanda_cet', 'Fernanda Ribeiro',
'uso creatina faz 2 anos, 5g/dia. no treino sinto diferença clara. na cognição? sinceramente não percebi nada marcante. pode ser que esteja funcionando de forma sutil mas não sou capaz de distinguir do placebo. durmo bem, como bem, não tenho déficit. talvez pra quem dorme mal ou tem dieta ruim faça mais diferença',
'2026-01-26T13:50:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t2_04', 'performance-biohacking', 'ghost_andre_nootr', 'André Nootropics',
'Fernanda faz sentido. creatina pra cognição tem efeito maior em quem tá em déficit (sono ruim, stress alto, dieta sem carne). Se vc tá com tudo otimizado o baseline já é alto e o delta é pequeno. é tipo vitamina D: se vc já tá com 40ng/ml suplementar mais não muda nada. se tá com 15ng/ml é transformador',
'2026-01-26T14:12:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t2_05', 'performance-biohacking', 'ghost_gabriel_creat', 'Gabriel Mendes',
'André boa analogia da vitamina D. eu durmo mal (6h por noite, trabalho muito) e como pouca carne. vou testar 5g/dia e avaliar em 1 mês. o bom é que creatina é barata e segura, o risco/benefício é muito favorável',
'2026-01-26T14:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t2_06', 'performance-biohacking', 'ia_facilitadora', 'NutriFitVision',
'Creatina para cognição é uma das aplicações mais interessantes e menos conhecidas. O Lucas trouxe o contexto científico correto: meta-análises mostram benefício especialmente sob estresse cognitivo e privação de sono. A Fernanda deu um relato honesto: quem já tem baseline otimizado percebe pouco. O André fez a analogia perfeita com vitamina D.

Resumo baseado em evidência:
- Dose: 3-5g/dia de creatina monohidrato (mesma do treino)
- Maior benefício: privação de sono, estresse, vegetarianos, idosos
- Perfil de segurança: excelente (um dos suplementos mais estudados)
- Tempo para efeito cognitivo: 4-8 semanas de uso contínuo
- Não precisa de fase de carga

Gabriel, com 6h de sono e pouca carne, vc é exatamente o perfil que mais se beneficia. Nos conta depois de 1 mês!',
'2026-01-26T15:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: performance-biohacking
-- THREAD 3: Banho gelado e sauna - ciência ou modinha?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t3_01', 'performance-biohacking', 'ghost_vini_frio', 'Vinícius Alves',
'comecei a fazer banho gelado de manhã depois de ver o Huberman falando. 2 minutos de água fria no final do banho. to fazendo faz 2 semanas e sinto que fico mais disposto e focado dps. mas será que é real ou é só o choque que me acorda? kkk alguem aqui faz?',
'2026-01-28T08:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t3_02', 'performance-biohacking', 'ghost_dr_lucas_bio', 'Lucas Biohacker',
'Vinícius, tem ciência sim. Exposição ao frio aumenta noradrenalina (até 200-300% em alguns estudos) e dopamina (até 250%). São neurotransmissores de alerta, foco e motivação. O efeito dura horas. É REAL e não só "o choque te acordando". Porém: timing importa. Se fizer frio LOGO APÓS treino de hipertrofia, pode atenuar a resposta inflamatória que é necessária pra adaptação. Ou seja, pode prejudicar ganho muscular. Ideal: frio pela manhã separado do treino',
'2026-01-28T08:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t3_03', 'performance-biohacking', 'ghost_camila_sauna', 'Camila Ferraz',
'eu faço sauna 3x por semana e banho frio 2x. a sauna tem estudos mais robustos que o frio na minha opinião. o estudo finlandês com 2300 homens mostrou redução de 40% em morte cardiovascular com 4-7 sessões semanais. e aumenta proteínas de choque térmico (HSP) que ajudam em longevidade. mas concordo que virou modinha e muita gente faz sem entender pq',
'2026-01-28T08:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t3_04', 'performance-biohacking', 'ghost_ricardo_cet2', 'Ricardo Tavares',
'eu tentei o protocolo de frio e desisti em 4 dias. é HORRÍVEL. cada segundo parece uma hora. o "benefício mental" que senti era só alívio de ter saído da água gelada kk. pra mim não vale o sofrimento. treinar bem, dormir 8h e comer direito faz mais do que banho frio. unpopular opinion mas é oq penso',
'2026-01-28T09:20:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t3_05', 'performance-biohacking', 'ghost_dr_lucas_bio', 'Lucas Biohacker',
'Ricardo, sua unpopular opinion não é tão unpopular assim. Você está CERTO que treino, sono e nutrição são 95% do resultado. Frio/sauna são otimizações de 1-2% no topo da pirâmide. Se a base não tá sólida, otimizar o topo é perda de tempo. O problema é gente que dorme 5h, come mal, e acha que banho gelado vai resolver. Dito isso, pra quem já tem a base sólida, são ferramentas com evidência real',
'2026-01-28T09:45:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_perf_t3_06', 'performance-biohacking', 'ia_facilitadora', 'NutriFitVision',
'Discussão equilibrada. O Lucas trouxe a ciência: aumento de noradrenalina e dopamina com frio é documentado. A Camila citou o robusto estudo finlandês sobre sauna. O Ricardo trouxe o contraponto necessário: fundamentos primeiro, otimizações depois.

Hierarquia de prioridades (pirâmide):
Base: sono 7-9h, treino consistente, nutrição adequada
Meio: suplementos com evidência (creatina, vitamina D, ômega-3)
Topo: protocolos de frio, sauna, jejum, etc.

Não otimize o topo sem ter a base. Mas se a base está sólida:
- Frio: 1-3min de água fria (~10°C), de manhã, longe do treino de hipertrofia
- Sauna: 15-20min a 80°C+, 3-4x/semana

Vinícius, 2 semanas é pouco pra avaliar. Dá pelo menos 1 mês e depois compartilha aqui sua experiência.',
'2026-01-28T10:10:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: lipedema
-- THREAD 2: Médico disse que é só gordura localizada
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t2_01', 'lipedema', 'ghost_juliana_lip', 'Juliana Matos',
'fui no endocrinologista e ele disse q minha perna grossa é "gordura localizada" e que preciso emagrecer. mas eu JÁ emagreci 15kg e a perna NÃO mudou. dói quando aperto, fico com hematoma fácil, e minha mãe e avó tem a mesma coisa. será que é lipedema e ele não sabe diagnosticar?',
'2026-01-27T10:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t2_02', 'lipedema', 'ghost_dra_marina', 'Marina Vascular',
'Juliana, os sinais que vc descreve (dor à palpação, hematomas fáceis, componente familiar, e resistência à perda de peso localizada) são clássicos de lipedema. Infelizmente muitos médicos não conhecem ou confundem com obesidade/linfedema. O diagnóstico é CLÍNICO - não precisa de exame específico, mas ultrassom de partes moles pode ajudar a diferenciar. Minha sugestão: procure um angiologista ou cirurgião vascular que tenha experiência com lipedema. Existe uma lista de profissionais especializados',
'2026-01-27T10:30:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t2_03', 'lipedema', 'ghost_patricia_dx', 'Patrícia Andrade',
'Juliana eu levei 7 ANOS pra conseguir diagnóstico. passei por 4 médicos que disseram "emagrece que resolve". emagreci 20kg, braço fino, barriga fina, perna IGUAL. quando finalmente achei uma angiologista que entende de lipedema ela diagnosticou em 5 minutos. literalmente 5 minutos. é revoltante como a maioria dos médicos não conhece',
'2026-01-27T10:55:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t2_04', 'lipedema', 'ghost_renata_contra', 'Renata Dias',
'gente mas nem todo mundo que tem perna grossa tem lipedema né. eu achava q tinha tb, fui na angiologista e ela descartou. no meu caso era acúmulo de gordura mesmo + retenção. com dieta anti-inflamatória + drenagem linfática melhorou bastante. cuidado pra não se autodiagnosticar por internet',
'2026-01-27T11:18:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t2_05', 'lipedema', 'ghost_juliana_lip', 'Juliana Matos',
'Renata concordo que autodiagnóstico é perigoso. mas os sintomas que eu tenho são muito específicos: dor à palpação, hematomas espontâneos, hereditariedade, e desproporção que não muda com emagrecimento. vou procurar angiologista especializado como a Marina sugeriu. Patrícia 7 anos é muito tempo mds, fico feliz que vc conseguiu',
'2026-01-27T11:40:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t2_06', 'lipedema', 'ia_facilitadora', 'NutriFitVision',
'A Juliana tocou em um problema real: subdiagnóstico de lipedema. Estima-se que 11% das mulheres tenham algum grau de lipedema, mas a maioria não recebe diagnóstico correto.

Sinais que diferenciam lipedema de gordura localizada:
- Dor à palpação (gordura normal NÃO dói)
- Hematomas fáceis/espontâneos
- Desproporção que não responde a dieta (tronco emagrece, pernas não)
- Componente familiar forte
- Textura de "nódulos" palpáveis

A Renata trouxe um ponto válido: nem toda perna grossa é lipedema. O diagnóstico deve ser feito por profissional capacitado (angiologista/vascular com experiência em lipedema).

Juliana, se precisar de indicação de profissional especializado, o app NutriFitCoach tem uma rede de referência. Nos conte como foi a consulta!',
'2026-01-27T12:05:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: lipedema
-- THREAD 3: Exercício piora ou melhora o lipedema?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t3_01', 'lipedema', 'ghost_carla_exerc', 'Carla Novaes',
'diagnosticada com lipedema grau 2. minha médica mandou fazer exercício aquático e caminhada leve. mas quando faço musculação de perna a dor PIORA e incha mais. to confusa pq todo mundo fala pra treinar mas parece que piora. alguem mais sente isso?',
'2026-01-29T14:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t3_02', 'lipedema', 'ghost_dra_marina', 'Marina Vascular',
'Carla, isso é mais comum do que parece. O exercício de alto impacto ou musculação pesada de MMII pode aumentar o processo inflamatório local no lipedema. O recomendado é: exercícios de BAIXO impacto (natação, hidroginástica, bicicleta estacionária, pilates). Musculação pode sim, mas com carga moderada e SEMPRE com meia de compressão durante o treino. A compressão faz uma diferença enorme. E evitar exercícios de impacto como corrida e saltos',
'2026-01-29T14:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t3_03', 'lipedema', 'ghost_patricia_dx', 'Patrícia Andrade',
'Carla eu tive exatamente isso. a virada pra mim foi usar meia de compressão 20-30mmHg durante todo o treino e fazer drenagem linfática DEPOIS da musculação. antes eu treinava, inchava horrores e doía por 2 dias. com meia + drenagem consigo treinar normalmente. peça pra sua médica prescrever a meia no grau certo',
'2026-01-29T14:50:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t3_04', 'lipedema', 'ghost_amanda_aqua', 'Amanda Torres',
'eu só faço exercício na água agora. hidroginástica 3x e natação 2x. a água faz uma "compressão natural" e o impacto é zero. minha perna inchou ZERO desde que mudei pra aquático. não sei se é pra todo mundo mas pra mim foi a solução',
'2026-01-29T15:12:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t3_05', 'lipedema', 'ghost_carla_exerc', 'Carla Novaes',
'gente obrigada! vou pedir a meia de compressão pra médica e tentar treinar com ela. e vou experimentar hidroginástica tb. faz sentido o que a Marina falou sobre impacto. eu tava fazendo leg press pesado sem meia nenhuma, deve ser por isso que tava piorando',
'2026-01-29T15:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_lip_t3_06', 'lipedema', 'ia_facilitadora', 'NutriFitVision',
'Ponto fundamental que a Carla trouxe: exercício em lipedema precisa ser ADAPTADO. A Marina explicou que alto impacto e musculação pesada sem proteção aumenta inflamação local. A Patrícia deu a solução prática: meia de compressão durante treino + drenagem linfática depois.

Protocolo de exercício para lipedema:
- PREFERIR: natação, hidroginástica, bicicleta, pilates, caminhada
- PODE: musculação com carga moderada COM meia de compressão 20-30mmHg
- EVITAR: corrida, saltos, musculação pesada de pernas sem compressão
- COMPLEMENTAR: drenagem linfática manual pós-treino

A Amanda mostrou que exercício aquático é especialmente eficaz pela compressão hidrostática natural.

Carla, a meia de compressão é prescrita por angiologista/vascular. Peça indicação do grau adequado pro seu estágio.',
'2026-01-29T16:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: aspiracional-estetica
-- THREAD 2: Harmonização facial - vale a pena ou armadilha?
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t2_01', 'aspiracional-estetica', 'ghost_bianca_harmo', 'Bianca Reis',
'to pensando em fazer harmonização facial (preenchimento labial + mandíbula + malar). o dermato orçou R$4.500 tudo junto. to com medo de ficar artificial mas tb queria ter um rosto mais definido. alguem aqui fez? ficou natural? se arrependeu?',
'2026-01-26T16:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t2_02', 'aspiracional-estetica', 'ghost_larissa_fez', 'Larissa Monteiro',
'fiz preenchimento labial e malar ano passado. labial ficou lindo e natural, malar achei que ficou um pouco exagerado mas dps de 2 meses acomodou e ficou bom. dica: MENOS É MAIS. fala pro profissional que vc quer sutil. é mais fácil colocar mais depois do que tirar. e escolhe MUITO bem o profissional. vi casos horrorosos de gente que foi em lugar barato',
'2026-01-26T16:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t2_03', 'aspiracional-estetica', 'ghost_carol_contra', 'Carolina Duarte',
'eu fiz e me arrependi. fiz mandíbula e bichectomia juntos. resultado: fiquei com rosto fino demais e masculinizado. a bichectomia é IRREVERSÍVEL (tira gordura) e com o tempo o rosto envelhece mais rápido sem essa gordura. se pudesse voltar atrás não faria bichectomia de jeito nenhum. preenchimento pelo menos absorve em 1-2 anos',
'2026-01-26T16:48:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t2_04', 'aspiracional-estetica', 'ghost_dr_derma', 'Vinícius Dermatologista',
'alguns pontos técnicos: 1) preenchimento com ácido hialurônico é reversível (tem enzima que dissolve), isso dá segurança. 2) mandíbula e malar são áreas de RISCO vascular - só faça com profissional que tenha domínio de anatomia e tenha a enzima hialuronidase disponível pra emergência. 3) R$4.500 pra 3 áreas está no preço justo de mercado. Desconfie de muito barato. 4) bichectomia hoje a maioria dos especialistas contraindica por causa do envelhecimento facial acelerado que a Carolina descreveu',
'2026-01-26T17:12:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t2_05', 'aspiracional-estetica', 'ghost_bianca_harmo', 'Bianca Reis',
'Carolina sinto muito pela sua experiência. bichectomia eu descartei exatamente por isso que vc falou. Vinícius obrigada pelas dicas técnicas, vou perguntar pro dermato sobre a hialuronidase de emergência. Larissa o "menos é mais" faz total sentido, vou pedir pra começar com pouco',
'2026-01-26T17:35:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t2_06', 'aspiracional-estetica', 'ia_facilitadora', 'NutriFitVision',
'Discussão importante com experiências reais. A Larissa deu a dica de ouro: MENOS É MAIS. A Carolina trouxe um alerta válido sobre bichectomia (procedimento que a maioria dos especialistas atuais contraindica). O Vinícius trouxe pontos técnicos essenciais.

Checklist antes de fazer harmonização:
- Profissional qualificado (médico dermatologista ou cirurgião plástico)
- Confirme que tem hialuronidase disponível pra emergência vascular
- Comece com pouco - é mais fácil adicionar que tirar
- Evite bichectomia (irreversível + envelhece o rosto)
- Ácido hialurônico absorve em 12-18 meses (reversível)
- Desconfie de preços muito abaixo do mercado

Bianca, se decidir fazer, compartilha sua experiência aqui depois! Ajuda muito quem está na mesma dúvida.',
'2026-01-26T18:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- ARENA: aspiracional-estetica
-- THREAD 3: Resultado de treino vs procedimento estético
-- ════════════════════════════════════════

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t3_01', 'aspiracional-estetica', 'ghost_fernanda_dil', 'Fernanda Lima',
'discussão honesta: eu treino faz 4 anos e meu corpo melhorou muito MAS tem coisas que treino não resolve. flacidez abdominal pós-gestação, gordura localizada no flanco que não sai com dieta nenhuma. to cogitando lipo + abdominoplastia. alguem treina E fez procedimento? sente que complementou ou se arrependeu?',
'2026-01-28T15:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t3_02', 'aspiracional-estetica', 'ghost_amanda_pos', 'Amanda Pós-Cirúrgica',
'Fernanda fiz mini abdominoplastia + lipo de flanco faz 1 ano. melhor decisão da minha vida. treinei 3 anos antes pra chegar no máximo natural e a cirurgia fez o que treino não ia fazer nunca (tirar excesso de pele). MAS: o pós-operatório é pesado. fiquei 2 meses sem treinar, 3 meses de cinta, e custou R$18k. não é decisão pra tomar por impulso',
'2026-01-28T15:28:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t3_03', 'aspiracional-estetica', 'ghost_roberto_nat', 'Roberto Natural',
'eu acho que a sociedade coloca pressão demais. flacidez pós-gestação é NORMAL. gordura localizada é NORMAL. a gente busca um padrão que é irreal pra maioria. treina, come bem, cuida da saúde e aceita que o corpo real não é o corpo do Instagram filtrado. não sou contra cirurgia mas acho que tem que ter certeza de que é pra si mesma e não pela pressão de fora',
'2026-01-28T15:50:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t3_04', 'aspiracional-estetica', 'ghost_fernanda_dil', 'Fernanda Lima',
'Roberto eu entendo seu ponto e concordo sobre a pressão social. mas no meu caso a flacidez me incomoda fisicamente (pele dobra e irrita durante exercício) e psicologicamente. já fiz terapia, trabalho autoaceitação, e mesmo assim é algo que quero mudar PRA MIM. acho que cada um sabe seus limites e motivações',
'2026-01-28T16:15:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t3_05', 'aspiracional-estetica', 'ghost_amanda_pos', 'Amanda Pós-Cirúrgica',
'Roberto, respeito sua opinião mas nem sempre é pressão social. eu LITERALMENTE não conseguia usar legging sem a pele se dobrando e irritando. afetava meu treino e meu conforto. a cirurgia resolveu um problema funcional além do estético. cada caso é um caso',
'2026-01-28T16:38:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t3_06', 'aspiracional-estetica', 'ghost_roberto_nat', 'Roberto Natural',
'justo, vocês tem razão. eu generalizei e cada situação é única. quando tem componente funcional (irritação da pele, desconforto) realmente vai além do estético. peço desculpa se pareceu que eu tava julgando, não era a intenção',
'2026-01-28T17:00:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

INSERT INTO nfc_chat_messages (id, comunidade_slug, user_id, user_name, content, created_at)
VALUES ('msg_asp_t3_07', 'aspiracional-estetica', 'ia_facilitadora', 'NutriFitVision',
'Discussão madura com múltiplas perspectivas. A Amanda deu relato real de quem treinou, atingiu o máximo natural, e complementou com cirurgia. O Roberto trouxe a reflexão sobre pressão social (válida). A Fernanda e Amanda responderam com nuance: pode ser funcional, não só estético.

Quando procedimento estético faz sentido para quem treina:
- Quando atingiu o máximo que treino e dieta podem oferecer (mínimo 1-2 anos consistente)
- Quando tem componente funcional (excesso de pele que irrita, limita movimento)
- Quando a motivação é interna e não pressão externa
- Com expectativas realistas sobre resultado e pós-operatório

Treino e procedimento NÃO são opostos - podem ser complementares. O importante é que a decisão seja informada, com profissional qualificado, e COM base de saúde sólida.

Fernanda, se decidir seguir, busca indicações de cirurgiões plásticos membros da SBCP.',
'2026-01-28T17:25:00.000Z'::timestamptz) ON CONFLICT (id) DO NOTHING;

-- ════════════════════════════════════════
-- VERIFICAÇÃO FINAL
-- ════════════════════════════════════════

SELECT comunidade_slug, COUNT(*) as total_mensagens
FROM nfc_chat_messages
GROUP BY comunidade_slug
ORDER BY total_mensagens DESC;
