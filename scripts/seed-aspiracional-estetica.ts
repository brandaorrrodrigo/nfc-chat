import { PrismaClient } from '../lib/generated/prisma';
import { v4 as cuid } from 'cuid';

const prisma = new PrismaClient();

// ============================================================
// SEED: Aspiracional & Estética
// 32 posts em 8 conversas
// Foco: metas estéticas realistas, shape goals, before/after,
// recomposição corporal, autoestima, padrões de beleza,
// dismorfismo, comparação com redes sociais, celebrar conquistas,
// fotos de progresso, motivação de longo prazo
// ============================================================

const POSTS = [
  // ── CONVERSA 1: Shape goal realista vs Instagram ──────────
  {
    userId: 'user_sim_003',
    content: `Tenho 1,62m, 64kg, 28 anos. Meu "shape goal" é a Gracyanne Barbosa. Treino há 1 ano e meio e tô longe. Quão realista é esse objetivo pra uma mulher natural? Preciso de uma dose de realidade.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Mariana, ótimo que você está pedindo essa dose de realidade — é um sinal de maturidade no processo.

**Vamos analisar com dados:**

**O shape da Gracyanne Barbosa:**
- Massa muscular que excede significativamente o potencial genético feminino natural
- Percentual de gordura extremamente baixo (~12-15%) mantido cronicamente
- Volume muscular em glúteos e membros inferiores que requer **décadas de treino** + genética excepcional + provável uso de substâncias ergogênicas
- Ela mesma treina há **mais de 15 anos** com dedicação absoluta, é a profissão/marca dela

**Potencial de ganho muscular feminino natural (dados científicos):**
- **Ano 1**: ~4-5kg de massa muscular (se tudo for otimizado)
- **Ano 2**: ~2-3kg
- **Ano 3**: ~1-1,5kg
- **Ano 4+**: ~0,5-1kg por ano
- **Total em 5 anos otimizados**: ~10-12kg de massa muscular
- Esse é o TETO para a maioria das mulheres geneticamente médias treinando perfeitamente

**A realidade dos physiques de influencers:**
- Muitas usam anabolizantes (testosterona, oxandrolona, stanozolol) sem declarar
- Mesmo as "naturais" frequentemente não são
- Filtros, ângulos, pump pós-treino, iluminação e edição são padrão nas fotos
- O shape que você vê no post é o shape no MELHOR momento do dia, no melhor ângulo, com a melhor luz

**Isso NÃO significa que seu objetivo é inútil.**

Significa que o objetivo precisa ser **recalibrado** para algo alcançável e sustentável:

**Shape goal realista para mulher natural 1,62m com 1,5 ano de treino:**
- Redução para ~22-24% de gordura corporal (saudável e sustentável)
- Glúteos desenvolvidos e arredondados (sim, é possível naturalmente — não no nível da Gracyanne)
- Definição leve em membros e abdômen
- Ombros e costas torneados criando proporção visual (ilusão de cintura mais fina)
- Peso final: pode ser os mesmos 64kg ou até mais, com composição corporal completamente diferente

**O comparativo real:**
Em vez de "quero o shape da Gracyanne", pense: **"quero a melhor versão do MEU corpo com treino e nutrição otimizados"**. Esse shape vai ser único, vai ser seu, e vai ser alcançável.

1,5 ano de treino é apenas o começo — os melhores resultados naturais aparecem entre o ano 3 e 5.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_007',
    content: `Quando eu parei de buscar o corpo de outra pessoa e foquei no MEU potencial, meu treino virou prazer. Treino há 4 anos, nunca vou ter o shape da Gracyanne, mas meu corpo mudou absurdamente comparado com o antes. E isso é INCRÍVEL.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_003',
    content: `A tabela de ganho muscular por ano me abriu os olhos. Eu tô no ano 1,5 — ainda tenho muito potencial pela frente. Vou trocar o goal: em vez da Gracyanne, quero EU daqui 3 anos. Obrigada pela honestidade!`,
    isAIResponse: false,
  },

  // ── CONVERSA 2: Before & After — a foto que te enganam ────
  {
    userId: 'user_sim_010',
    content: `Vejo transformações absurdas de "12 semanas" na internet. Pessoa totalmente diferente. Quando eu comparo minhas 12 semanas de treino com essas fotos, me sinto fracassado. É humanamente possível essas transformações ou tem algo que eu não tô vendo?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Thiago, a maioria das transformações de "12 semanas" que viralizam nas redes contêm **pelo menos 3-4 das manipulações abaixo**. Entender isso é fundamental pra proteger sua saúde mental.

**Técnicas de manipulação em before & after:**

**1. Iluminação (impacto: ENORME):**
- Before: luz frontal difusa (achata o corpo, elimina sombras, zero definição)
- After: luz lateral/superior dura (cria sombras que simulam definição muscular)
- A MESMA pessoa, no MESMO dia, pode parecer ter perdido 5kg mudando só a luz

**2. Postura e contração:**
- Before: postura relaxada, ombros caídos, abdômen solto, sem pump
- After: postura ativa, ombros puxados, abdômen contraído, foto pós-treino com pump muscular
- Só isso gera uma diferença visual de ~2-3kg aparentes

**3. Desidratação e manipulação de água:**
- Muitas transformações usam protocolos de **depleção de água** no dia da foto "after"
- Reduzir sódio + water loading + cortar água 12-24h antes → pele mais fina, veias aparentes, aspecto de "sequíssimo"
- No dia seguinte, reidratado, a pessoa parece completamente diferente (pior)

**4. Bronzeamento:**
- Pele bronzeada (artificial ou natural) aumenta contraste visual e definição aparente
- Before: pálido. After: bronzeado. Parece outra pessoa.

**5. Edição digital:**
- Apps como Facetune, Spring, BodyTune permitem ajustar cintura, braços, mandíbula
- Muitos influencers editam SUTILMENTE — não é Photoshop óbvio, é ajuste fino quase imperceptível

**6. Timeframe real:**
- "12 semanas" pode significar 12 semanas de CUTTING após 2 anos de bulking
- Ou 12 semanas visíveis de uma jornada de 3 anos
- Raramente alguém mostra a timeline completa

**7. Substâncias:**
- Resultados como 8kg de músculo + 10kg de gordura perdidos em 12 semanas são fisiologicamente IMPOSSÍVEIS naturalmente
- Se a transformação parece boa demais, provavelmente é farmacologicamente assistida

**O que é REALMENTE possível em 12 semanas natural:**
- Perda de gordura: **2-4kg de gordura** (com déficit moderado)
- Ganho muscular: **0,5-1,5kg** (se for iniciante no treino de força)
- Mudança visual: perceptível mas SUTIL — não "outra pessoa"
- Mudanças mais notáveis: roupas vestindo diferente, medidas melhorando, treino mais forte

**Proteja sua percepção:**
- Compare-se APENAS com você mesmo de 3-6 meses atrás
- Tire fotos de progresso no mesmo horário, mesma luz, mesma pose, mesma roupa
- Meça centímetros e registre cargas no treino — dados não mentem como fotos

Suas 12 semanas são SUAS, não de um post editado na internet.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `Fiz um experimento: tirei duas fotos no mesmo dia — uma de manhã com luz frontal e barriga solta, outra à tarde pós-treino com luz lateral e abdômen contraído. Parecia 2 meses de diferença. Desde então, nunca mais confiei em before/after de internet.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_010',
    content: `Cara, a parte da iluminação e postura nunca tinha pensado. E o timeframe falso — "12 semanas" de quem já treina há 3 anos é completamente diferente de 12 semanas do zero. Vou focar nas minhas fotos e medidas e esquecer Instagram.`,
    isAIResponse: false,
  },

  // ── CONVERSA 3: Dismorfia corporal — quando a busca vira doença ──
  {
    userId: 'user_sim_005',
    content: `Preciso desabafar. Perdi 15kg, tô em 78kg com 1,80m, treino pesado, todo mundo elogia meu corpo. Mas quando me olho no espelho, só vejo defeitos — braço fino, peito não cresce, abdômen não aparece. Fico obcecado, tiro foto 10x por dia pra comparar. Minha namorada diz que tô doente. Isso tem nome?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Rafael, obrigado pela honestidade — o que você descreve tem sim nome e é mais comum do que se imagina, especialmente entre homens que treinam.

**Dismorfia Muscular (Vigorexia):**

É um subtipo do **Transtorno Dismórfico Corporal (TDC)** no qual a pessoa:
- Se percebe como menor/mais fraca/menos definida do que realmente é
- Apresenta preocupação excessiva e persistente com tamanho muscular e composição corporal
- Comportamentos compulsivos: checagem repetida no espelho, tirar fotos frequentemente, medir calorias obsessivamente, pesar-se múltiplas vezes ao dia
- Os comportamentos causam **sofrimento significativo** e interferem na vida

**Critérios que você pode estar apresentando:**
- Discrepância entre percepção e realidade (pessoas elogiam, você só vê defeitos) ✅
- Checagem compulsiva (fotos 10x/dia) ✅
- Preocupação desproporcional que gera sofrimento ✅
- Impacto no relacionamento (namorada preocupada) ✅

**Prevalência:**
- Estima-se que **10-25% dos homens que treinam musculação regularmente** apresentam sintomas de dismorfia muscular em algum grau
- A cultura fitness de redes sociais intensifica significativamente o quadro
- É subdiagnosticado porque homens raramente buscam ajuda para problemas de imagem corporal

**Mecanismo psicológico:**
- O cérebro cria uma **distorção perceptiva** genuína — não é "frescura" ou vaidade
- Áreas de processamento visual do córtex funcionam diferente em pessoas com TDC
- Cada melhoria real no corpo gera satisfação temporária que logo é substituída por um novo "defeito"
- O goalpost está sempre se movendo — nunca é suficiente

**Sinais de alerta para buscar ajuda profissional:**
- Evitar situações sociais por causa da aparência (praia, piscina)
- Treinar mesmo lesionado ou doente por medo de perder massa
- Gastar horas diárias pensando em defeitos corporais
- Usar substâncias (anabolizantes) por insatisfação corporal
- A preocupação afetar trabalho, relacionamentos ou qualidade de vida

**O que fazer:**

**1. Reconhecimento (você já deu esse passo):**
- Admitir que a percepção pode estar distorcida é o passo mais difícil e mais importante

**2. Buscar profissional especializado:**
- **TCC (Terapia Cognitivo-Comportamental)** é o padrão-ouro para TDC/dismorfia muscular
- Ensina a identificar distorções cognitivas e reduzir comportamentos compulsivos
- Em casos moderados a graves, ISRSs podem ajudar

**3. Reduza gatilhos:**
- Limite tempo em redes sociais fitness
- Pare de seguir perfis que intensificam comparação
- Reduza checagem no espelho (defina um limite: 2x/dia, não mais)

**4. Dados objetivos sobre emoção:**
- Use medidas, fotos mensais e cargas de treino como referência de progresso
- 1,80m, 78kg com treino pesado é um physique que a maioria dos homens sonha em ter

Rafael, sua namorada está certa em se preocupar. Isso não diminui sua masculinidade — pelo contrário, buscar ajuda exige mais coragem do que mais uma série no supino.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_004',
    content: `Cara, passei por algo muito parecido. Fui no psicólogo depois que percebi que tava recusando convites pra praia porque "meu shape não tava bom" — com 82kg de massa magra. Depois de 6 meses de TCC, minha relação com o espelho mudou completamente. Não tenha vergonha de procurar ajuda.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_005',
    content: `Não esperava me identificar tanto com algo chamado "transtorno". A parte do goalpost que sempre se move é EXATAMENTE o que acontece — consigo um objetivo e imediatamente foco no próximo defeito. Vou procurar um psicólogo. Valeu pela coragem de vocês também.`,
    isAIResponse: false,
  },

  // ── CONVERSA 4: Recomposição corporal — o goal mais inteligente ──
  {
    userId: 'user_sim_001',
    content: `Peso 62kg, 1,60m, 26 anos. Não preciso "emagrecer" mas meu corpo é "falso magro" — pouca definição, barriga mole, sem curvas. Minha amiga disse pra fazer recomposição corporal em vez de dieta. O que é isso exatamente e quanto tempo leva?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Ana Paula, recomposição corporal é provavelmente o goal mais inteligente para o seu perfil — e é o menos entendido pela maioria das pessoas.

**O que é recomposição corporal:**
Perder gordura e ganhar músculo **simultaneamente**, resultando em mudança de composição sem necessariamente mudar o peso na balança.

**Por que é perfeito pro seu caso "falso magro":**
- Seu peso (62kg, 1,60m, IMC 24,2) é saudável — não precisa de déficit agressivo
- O problema não é excesso de peso, é **excesso de gordura relativo à massa muscular**
- Fazer dieta restritiva perderia peso mas manteria a aparência "mole" (sem músculo por baixo)
- Recomposição muda a proporção: menos gordura + mais músculo = visual completamente diferente no MESMO peso

**O fenômeno visual da recomposição:**
- 62kg com 30% de gordura: aparência "falso magro", sem definição
- 62kg com 22% de gordura: definição visível, curvas, "tônus"
- Mesma balança, corpo completamente diferente
- O músculo ocupa **~18% menos volume** que a mesma massa de gordura → mais compacta, mais definida

**Quem consegue fazer recomposição simultânea:**
- ✅ Iniciantes no treino de força (SEU CASO — maior janela de oportunidade)
- ✅ Pessoas retornando após pausa
- ✅ Pessoas com percentual de gordura relativamente alto + pouca massa muscular
- ❌ Mais difícil para: treinados avançados, pessoas já magras/definidas

**Como fazer na prática:**

**Nutrição:**
- Calorias: **manutenção ou déficit LEVE** (100-200kcal abaixo do TDEE)
- Proteína: **1,8-2,2g/kg** (mínimo 112g/dia para 62kg) — PRIORIDADE ABSOLUTA
- Não precisa de superávit calórico como iniciante — seu corpo consegue redirecionar energia
- Carboidratos ao redor do treino, gorduras distribuídas ao longo do dia

**Treino:**
- Musculação **3-4x/semana** com progressão de carga
- Exercícios compostos: agachamento, hip thrust, supino, remada, terra
- Progressão: aumente carga ou repetições toda semana que conseguir
- O estímulo mecânico é o driver principal da hipertrofia

**Cardio:**
- Caminhada diária (NEAT) > cardio formal
- Não exagere no cardio — ele compete com a recuperação da musculação

**Timeline realista:**
- **Mês 1-2**: pouca mudança visual, ganho de força significativo (adaptação neural)
- **Mês 3-4**: primeiras mudanças visíveis — roupas começam a vestir diferente
- **Mês 6**: amigos e família notam a diferença
- **Mês 9-12**: transformação clara em fotos comparativas
- **Peso na balança**: pode não mudar NADA — e tá tudo certo

**O que medir em vez do peso:**
- Fotos mensais (mesma luz, ângulo, roupa)
- Medidas: cintura, quadril, braço, coxa
- Cargas no treino (subindo = ganhando músculo)
- Bioimpedância a cada 8-12 semanas

Recomposição é um jogo de paciência. A balança vai te frustrar. As fotos e medidas vão te motivar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_008',
    content: `Fiz recomposição por 8 meses — saí de 58kg para... 59kg. Mas perdi 6cm de cintura e ganhei 3cm de quadril. Meu corpo mudou COMPLETAMENTE e a balança mal se moveu. Recomposição é o melhor segredo fitness que ninguém conta porque não rende "perdi Xkg" pra post.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_001',
    content: `A explicação de 62kg com 30% vs 62kg com 22% sendo corpos totalmente diferentes me convenceu. Vou focar em musculação e proteína alta e ignorar a balança. Obrigada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 5: Celebrando conquistas não estéticas ───────
  {
    userId: 'user_sim_016',
    content: `Treino há 6 meses e esteticamente a mudança ainda é sutil. Mas ontem subi 5 andares de escada sem ofegar, carreguei as compras sozinha de uma vez, e meu joelho parou de doer. Por que ninguém fala dessas conquistas? Tá todo mundo focado só em antes e depois.`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Daniela, essas conquistas que você listou são **mais significativas para saúde e longevidade** do que qualquer mudança estética, e é uma pena que a cultura fitness as ignore.

**Conquistas funcionais — o que elas significam:**

**Subir 5 andares sem ofegar:**
- Seu **VO2 máximo melhorou** — cada 1 MET de aumento em capacidade aeróbica está associado a **~15% de redução na mortalidade por todas as causas** (estudo JAMA, 2018)
- Isso é literalmente tempo de vida extra

**Carregar compras sozinha:**
- Sua **força funcional aumentou** — capacidade de gerar força no dia a dia
- Força de preensão (grip strength) é um dos **melhores preditores de longevidade** que existem
- Cada kg de força de preensão a mais = menor risco de doença cardiovascular, diabetes tipo 2 e mortalidade

**Joelho parou de doer:**
- Os músculos ao redor da articulação **estabilizaram e protegem** o joelho
- Menos dor = mais atividade = mais saúde = ciclo virtuoso
- Muitas cirurgias de joelho poderiam ser evitadas com fortalecimento muscular adequado

**Outras conquistas não estéticas que merecem celebração:**
- Dormir melhor e mais profundamente
- Menos ansiedade e humor mais estável
- Mais energia ao longo do dia
- Postura melhor e menos dor nas costas
- Exames laboratoriais melhorando (glicemia, lipídios, pressão)
- Autoconfiança e sensação de capacidade
- Consistência — manter uma rotina de 6 meses JÁ te coloca no top 10% da população

**Por que a cultura fitness foca só em estética:**
- Estética é visual e "vendável" — funcionalidade não rende likes
- Before/after em foto é instantâneo — VO2 máximo não aparece na selfie
- Influencers vendem programas com promessa estética porque é o que gera cliques
- A indústria lucra com insatisfação corporal, não com pessoas saudáveis e satisfeitas

**Recalibre seus marcos de sucesso:**
- Estética é um SUBPRODUTO de treinar bem por tempo suficiente
- Funcionalidade e saúde são os resultados DIRETOS
- Quem treina focado em performance e funcionalidade invariavelmente desenvolve um corpo bonito como consequência
- Quem treina APENAS por estética frequentemente desiste quando o resultado "demora"

Daniela, você está construindo um corpo que FUNCIONA. A estética é questão de tempo. As conquistas que você listou são permanentes e mudam sua qualidade de vida — isso vale mais que qualquer foto de "after".`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_019',
    content: `Esse post deveria ser fixado. Minha maior conquista em 1 ano de treino não é estética — é conseguir brincar com meus filhos no chão sem precisar de ajuda pra levantar. Aos 45 anos, isso vale mais que tanquinho.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_016',
    content: `O dado de que cada MET a mais reduz mortalidade em 15% me motivou mais do que qualquer foto de influencer. Vou anotar todas as minhas conquistas funcionais junto com as medidas. Obrigada pela perspectiva! 💪`,
    isAIResponse: false,
  },

  // ── CONVERSA 6: Fotos de progresso — como fazer certo ─────
  {
    userId: 'user_sim_002',
    content: `Quero começar a documentar meu progresso com fotos mas não sei como fazer de forma útil. Toda vez que tiro foto, parece diferente dependendo do horário, o que comi, a luz. Tem um "protocolo" pra fotos de progresso confiáveis?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Juliana, documentar com fotos é uma das ferramentas mais poderosas de motivação — mas SÓ se feito de forma padronizada. Caso contrário, vira fonte de frustração.

**Protocolo de fotos de progresso padronizadas:**

**Frequência:**
- **1x por mês** (mesmo dia do mês, se possível)
- Semanal gera ansiedade e mudanças imperceptíveis que frustram
- Mensal permite diferenças visíveis e reduz obsessão

**Horário:**
- **Manhã, em jejum, após ir ao banheiro** — menor variação de retenção e inchaço
- Sempre no MESMO horário (±30 min)
- NÃO após refeição grande (inchaço abdominal)
- NÃO pós-treino (pump muscular temporário engana)

**Iluminação (a variável mais importante):**
- Mesma lâmpada, mesmo local, SEMPRE
- Ideal: luz natural de janela lateral (consistente e favorável)
- Se artificial: luminária fixa na mesma posição todo mês
- NUNCA compare foto com luz natural vs luz artificial

**Poses padronizadas (4 fotos básicas):**
1. **Frontal relaxado**: braços ao lado, pés na largura dos ombros, sem contrair nada
2. **Lateral**: virado 90°, braços naturais
3. **Costas**: mesmo que frontal, virado de costas
4. **Frontal contraído** (opcional): mesma posição mas com abdômen e braços contraídos

**Roupa:**
- Mesma roupa toda vez (biquíni, top + short curto, ou roupa íntima)
- Cor sólida e escura (preto é ideal — sem estampas que distraem)

**Câmera:**
- Mesma câmera/celular, mesma distância
- Ideal: tripé fixo na mesma posição com timer
- Se alguém tira: mesma pessoa, mesma altura, mesma distância
- Evite selfie no espelho (ângulo inconsistente)

**Background:**
- Parede lisa, cor neutra
- Sem objetos que mudam de posição

**O que registrar junto com a foto:**
- Data e peso da manhã
- Medidas (cintura, quadril, braço, coxa)
- Fase do ciclo menstrual (para mulheres — a variação hormonal afeta retenção e aparência)
- Nota sobre sono e estresse da semana

**Mindset ao comparar:**
- Compare fotos separadas por **no mínimo 3 meses**
- Mês a mês a diferença é sutil e pode frustrar
- 3 meses vs 3 meses = diferença motivadora
- Se possível, peça para OUTRA PESSOA comparar suas fotos — o olho de quem se vê todo dia no espelho é viciado

**NUNCA:**
- Compare suas fotos com fotos de outras pessoas
- Edite as fotos (perde todo o propósito)
- Tire fotos em dias ruins como "punição" — pule aquele mês se estiver fragilizada

Fotos de progresso bem feitas são um dos maiores motivadores de longo prazo. Daqui 1 ano, você vai agradecer por ter começado a documentar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_012',
    content: `A dica de comparar com 3 meses de intervalo em vez de mês a mês faz toda a diferença! Quando comparei janeiro vs abril, quase não acreditei na mudança. Mês a mês era imperceptível e me frustrava.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_002',
    content: `Protocolo salvo! Vou comprar um tripé baratinho e definir um canto do quarto com a mesma luz. Começando mês que vem — daqui 1 ano quero ter 12 fotos padronizadas pra ver minha jornada. Obrigada! 📸`,
    isAIResponse: false,
  },

  // ── CONVERSA 7: Pele solta após emagrecimento ─────────────
  {
    userId: 'user_sim_018',
    content: `Perdi 25kg em 14 meses (de 105 pra 80kg, homem, 1,75m). Tô orgulhoso mas tenho bastante pele solta na barriga e peito. É deprimente — perdi o peso mas não consigo ficar sem camisa na praia. Tem como melhorar sem cirurgia?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Marcelo, primeiro: perder 25kg é uma conquista monumental — não deixe a pele solta diminuir isso.

Agora vamos falar com realismo sobre o que é possível e o que não é.

**Fatores que determinam se a pele volta ou não:**

**1. Quantidade de peso perdido:**
- Perdas de **<15kg**: pele geralmente retrai bem
- Perdas de **15-25kg**: retração parcial, depende dos outros fatores
- Perdas de **>30kg**: retração limitada, cirurgia frequentemente necessária
- Seu caso (25kg): está na faixa intermediária — há potencial de melhora mas provavelmente não retração completa

**2. Velocidade da perda:**
- 25kg em 14 meses = ~1,8kg/mês — velocidade razoável mas ainda rápida
- Perdas mais lentas permitem retração gradual da pele
- A pele precisa de tempo para remodelação do colágeno

**3. Idade:**
- Elasticidade da pele diminui progressivamente após os 25-30 anos
- Quanto mais jovem, maior a capacidade de retração

**4. Tempo desde a perda:**
- A retração cutânea pode continuar por **12-24 meses** após estabilização do peso
- Você ainda está no processo — é cedo para conclusões definitivas

**5. Genética:**
- Algumas pessoas têm produção de elastina e colágeno geneticamente superior
- Infelizmente, essa variável não controlamos

**O que PODE ajudar (sem cirurgia):**

**1. Ganho de massa muscular (maior impacto):**
- Músculo "preenche" o espaço que a gordura ocupava
- Hipertrofia de peitoral e core pode melhorar significativamente a aparência
- Foque em peitoral, ombros e abdômen para as áreas afetadas
- Esse é o fator com maior potencial de melhoria sem cirurgia

**2. Hidratação e nutrição:**
- Vitamina C: essencial para síntese de colágeno (frutas cítricas, pimentão)
- Colágeno hidrolisado: 10-15g/dia — evidência modesta mas sem risco
- Vitamina A e zinco: cofatores de renovação celular
- Hidratação: 2-3L/dia — pele hidratada tem aparência e elasticidade melhores

**3. Tempo:**
- Dê ao seu corpo pelo menos **18-24 meses** de manutenção antes de considerar cirurgia
- A remodelação continua silenciosamente

**4. Evitar:**
- Fumo (destrói colágeno e elastina)
- Exposição solar excessiva sem proteção (fotoenvelhecimento)
- Reganho/perda cíclica (cada ciclo piora a elasticidade)

**Quando considerar cirurgia (abdominoplastia):**
- Após 18-24 meses de peso estável
- Se a pele solta causa desconforto físico (assaduras, irritação)
- Se o impacto psicológico é significativo
- Cirurgia é legítima e não é "fraqueza" — é solução para um problema que o corpo não resolve sozinho em muitos casos

**Perspectiva:**
25kg a menos significa: coração mais saudável, articulações preservadas, menor risco de diabetes, mais energia, mais anos de vida. A pele é uma consequência cosmética de uma decisão que potencialmente salvou sua saúde. Ela pode ser tratada com tempo, treino, ou eventualmente cirurgia — mas a saúde que você ganhou é permanente.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_015',
    content: `Perdi 30kg e decidi fazer abdominoplastia após 2 anos de manutenção. Melhor decisão da minha vida. Mas concordo 100% — esperem pelo menos 18-24 meses antes. Minha pele melhorou muito nos primeiros 18 meses com musculação e colágeno. O cirurgião disse que se eu tivesse operado cedo, teria tirado mais pele do que precisava.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_018',
    content: `A ideia de "preencher com músculo" me motiva muito. Vou focar pesado em peitoral e core nos próximos 12 meses e reavaliar. Se ainda precisar de cirurgia, faço sem peso na consciência. Valeu pela perspectiva equilibrada!`,
    isAIResponse: false,
  },

  // ── CONVERSA 8: Motivação de longo prazo — além da estética ──
  {
    userId: 'user_sim_017',
    content: `Treino há 2 anos e a motivação inicial (estética) já passou. Atingi mais ou menos o corpo que queria mas agora não tenho mais "meta visual" pra perseguir. Acordo sem vontade de treinar. O que mantém vocês treinando quando o objetivo estético já foi alcançado?`,
    isAIResponse: false,
  },
  {
    userId: 'ai_facilitator',
    content: `Renata, o que você está vivendo é um ponto de transição que quase todo praticante de longo prazo enfrenta. A motivação estética é um **excelente combustível inicial**, mas tem prazo de validade. Quem fica décadas treinando muda o referencial.

**Por que a motivação estética se esgota:**
- Objetivos estéticos são **finitos** — quando alcançados, o drive desaparece
- A adaptação hedônica faz você normalizar seu novo corpo rapidamente
- O retorno visual diminui com o tempo (ganhos marginais são imperceptíveis)
- Manter exige o mesmo esforço que construir, mas sem a recompensa da novidade

**O que substitui a motivação estética (praticantes de longo prazo):**

**1. Performance e metas de força:**
- "Quero agachar 100kg" tem uma clareza que "quero ficar bonita" não tem
- Progressão de carga é mensurável, objetiva e infinita
- Cada PR (personal record) gera dopamina independente de como você parece
- Metas de força: primeiro pull-up, terra com 2x peso corporal, flexão em pé de mãos...

**2. Identidade:**
- A transição mais poderosa: de "pessoa que treina" para "pessoa que É treinada"
- Treino vira parte de quem você é, como escovar os dentes — não depende de motivação
- Essa transição acontece geralmente entre o ano 2 e 3 — exatamente onde você está
- Disciplina > motivação: motivação flutua, disciplina sustenta

**3. Saúde e longevidade:**
- Após os 30, cada ano de treino consistente é um **investimento em independência futura**
- Densidade óssea, massa muscular, capacidade cardiovascular, equilíbrio — tudo que determina qualidade de vida aos 60, 70, 80 anos
- A pergunta muda de "como eu quero parecer?" para "como eu quero FUNCIONAR daqui 20 anos?"

**4. Regulação emocional:**
- Treino consistente é um dos **antidepressivos naturais mais potentes** que existem
- Quando você nota que nos dias que treina seu humor, energia e sono são melhores, o treino se justifica sozinho
- Muitos praticantes de longo prazo dizem: "não treino pra ficar bonito, treino pra ficar são"

**5. Comunidade e conexão social:**
- Amizades de academia, parceiros de treino, comunidades online
- O aspecto social se torna um motivador independente

**6. Novas modalidades e desafios:**
- Se musculação ficou monótona: experimente powerlifting, calistenia, CrossFit adaptado, escalada, luta, dança
- Manter o corpo treinado e experimentar novos desafios com ele é motivador

**Dica prática para a fase que você está:**
- Defina uma **meta de performance** para os próximos 6 meses (não estética)
- Encontre um **parceiro ou grupo** de treino
- Permita-se **variar** exercícios, modalidades, ambientes
- Relembre-se nos dias difíceis: "eu não treino porque preciso, treino porque é quem eu sou"

A motivação estética te trouxe até aqui. Agora é hora de encontrar razões que te levem adiante por mais 20, 30, 40 anos.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_004',
    content: `A transição de "treino pra ficar bonito" pra "treino pra funcionar" aconteceu naturalmente comigo no ano 3. Hoje treino há 7 anos e minha motivação principal é que nos dias que treino, sou uma pessoa melhor — melhor pai, melhor profissional, melhor marido. A estética virou bônus.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_017',
    content: `"Não treino pra ficar bonita, treino pra ficar sã" — isso me bateu forte. Essa semana treinei desmotivada e mesmo assim saí com a cabeça 100x melhor. Acho que é exatamente essa transição que preciso fazer. Vou definir uma meta de performance: quero fazer meu primeiro pull-up! 💪`,
    isAIResponse: false,
  },
];

// ============================================================
// EXECUÇÃO
// ============================================================

async function main() {
  console.log('🏟️  SEED: ASPIRACIONAL & ESTÉTICA');
  console.log('');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'aspiracional', mode: 'insensitive' } },
          { name: { contains: 'aspiracional', mode: 'insensitive' } },
          { slug: { contains: 'estetica', mode: 'insensitive' } },
          { name: { contains: 'estetica', mode: 'insensitive' } },
          { slug: { contains: 'estética', mode: 'insensitive' } },
          { name: { contains: 'estética', mode: 'insensitive' } },
        ],
      },
    });

    if (!arena) {
      console.log('❌ Arena não encontrada. Arenas disponíveis:');
      const allArenas = await prisma.arena.findMany({
        select: { slug: true, name: true },
        orderBy: { name: 'asc' },
      });
      allArenas.forEach(a => console.log(`  - ${a.slug} | ${a.name}`));
      return;
    }

    console.log(`✅ Arena encontrada: "${arena.name}" (${arena.slug})`);
    console.log(`   Posts atuais: ${arena.totalPosts}`);
    console.log('');

    // Limpar posts existentes
    console.log('🗑️  Limpando posts antigos...');
    await prisma.post.deleteMany({
      where: { arenaId: arena.id },
    });

    // Inserir novos posts
    console.log(`📝 Inserindo ${POSTS.length} posts...\n`);
    const baseTime = new Date('2025-01-29T07:45:00Z');

    for (let i = 0; i < POSTS.length; i++) {
      const post = POSTS[i];
      const postTime = new Date(baseTime.getTime() + (i * 18 * 60 * 1000));

      await prisma.post.create({
        data: {
          id: cuid(),
          arenaId: arena.id,
          userId: post.userId,
          content: post.content,
          isPublished: true,
          isPinned: false,
          isOfficial: false,
          isAIResponse: post.isAIResponse,
          isUnderReview: false,
          isApproved: true,
          viewCount: Math.floor(Math.random() * 50) + 5,
          likeCount: Math.floor(Math.random() * 15),
          commentCount: 0,
          isDeleted: false,
          createdAt: postTime,
          updatedAt: postTime,
        },
      });

      const label = post.isAIResponse ? '🤖 IA' : `👤 ${post.userId}`;
      console.log(`  ✅ Post ${(i + 1).toString().padStart(2)}/${POSTS.length} — ${label}`);
    }

    // Atualizar contador
    const count = await prisma.post.count({
      where: {
        arenaId: arena.id,
        isDeleted: false,
      },
    });

    await prisma.arena.update({
      where: { id: arena.id },
      data: { totalPosts: count },
    });

    console.log(`\n🎉 Concluído! ${count} posts na arena "${arena.name}"`);
  } catch (error) {
    console.error('❌ Erro fatal:', (error as any).message || error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
