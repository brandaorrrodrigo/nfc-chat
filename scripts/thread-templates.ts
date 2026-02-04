/**
 * TEMPLATES DE THREADS E RESPOSTAS
 *
 * Banco de dados de perguntas, relatos e respostas humanas
 * para povoamento orgânico das comunidades
 *
 * PRINCÍPIOS:
 * - Linguagem informal e imperfeita
 * - Emoções reais (frustração, dúvida, empolgação)
 * - Opiniões pessoais ("acho que", "pra mim")
 * - Erros leves de digitação
 */

import type { NivelUsuario } from './ghost-users-database';

export type TipoThread = 'pergunta' | 'relato' | 'debate' | 'duvida';
export type CategoriaArena = 'emagrecimento' | 'hipertrofia' | 'nutricao' | 'treino' | 'saude' | 'motivacao' | 'postura' | 'lipedema' | 'hipercifose' | 'compressao' | 'menstrual' | 'miofascial' | 'desvio_bacia' | 'gluteo_medio';

export interface ThreadTemplate {
  tipo: TipoThread;
  categoria: CategoriaArena;
  titulo: string;
  conteudo: string;
  nivelAutor: NivelUsuario;
}

export interface RespostaTemplate {
  conteudo: string;
  nivel: NivelUsuario;
  tom: 'apoio' | 'pratico' | 'tecnico' | 'discordancia' | 'relato';
}

// ============================================
// TEMPLATES DE THREADS POR CATEGORIA
// ============================================

export const THREADS_EMAGRECIMENTO: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'emagrecimento',
    titulo: 'to fazendo certo?',
    conteudo: 'comecei a dieta faz 2 semanas e não perdi nada ainda... to comendo menos e caminhando todo dia mas a balança não sai do lugar. é normal ou to fazendo algo errado?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'emagrecimento',
    titulo: 'nao aguento mais contar caloria',
    conteudo: 'gente sinceramente to exausto de ficar pesando comida e colocando no app. tem algum jeito mais simples? pq assim eu desisto',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'emagrecimento',
    titulo: 'pode comer carboidrato a noite?',
    conteudo: 'minha mae falou q carboidrato a noite engorda tudo. é vdd? pq eu treino de tarde e chego em casa com fome',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'emagrecimento',
    titulo: 'emagreci mas to flácida',
    conteudo: 'perdi 8kg em 3 meses só com dieta mas agora to parecendo uma uva passa... o q eu faço? preciso malhar?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'debate',
    categoria: 'emagrecimento',
    titulo: 'deficit alto vs deficit pequeno',
    conteudo: 'pessoal qual a opiniao de vcs... é melhor deficit calorico maior pra emagrecer rapido ou deficit pequeno pra nao sofrer? eu to fazendo 500kcal de deficit mas ta devagar',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'emagrecimento',
    titulo: 'plateou depois de 3 meses',
    conteudo: 'comecei emagrecendo bem (-1kg/semana) mas agora travou faz um mes. mantenho as mesmas calorias, mesmo treino, mas nada... alguem ja passou por isso?',
    nivelAutor: 'intermediario'
  },

  // CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'emagrecimento',
    titulo: 'essa historia de metabolismo lento é real?',
    conteudo: 'vejo muita gente falando que não emagrece pq tem metabolismo lento mas sera q isso existe mesmo ou é desculpa? pq CICO é CICO ne',
    nivelAutor: 'critico'
  },
];

export const THREADS_HIPERTROFIA: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'hipertrofia',
    titulo: 'quanto de proteina preciso?',
    conteudo: 'galera to começando a malhar agora e todo mundo fala de proteina mas nao sei quanto eu preciso. peso 75kg, quanto seria o ideal?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'hipertrofia',
    titulo: 'dor no dia seguinte é bom sinal?',
    conteudo: 'malhei perna ontem e hj to travado, mal consigo andar kkk isso significa que o treino foi bom ou exagerei?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'hipertrofia',
    titulo: 'whey é obrigatório?',
    conteudo: 'preciso mesmo tomar whey ou da pra crescer só com comida normal? é q ta caro demais',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'debate',
    categoria: 'hipertrofia',
    titulo: 'treino ABC vs ABCDE',
    conteudo: 'qual vcs preferem? to no ABC mas pensei em mudar pro ABCDE pra focar mais em cada musculo. opiniao de vcs?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'hipertrofia',
    titulo: 'mudei de treino e travei',
    conteudo: 'tava evoluindo legal no ABC ai troquei pro PPL e parou de crescer. alguem sabe pq isso acontece?',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS
  {
    tipo: 'debate',
    categoria: 'hipertrofia',
    titulo: 'drop set vale a pena?',
    conteudo: 'tenho usado drop set nas ultimas series mas nao sei se ta agregando ou só cansando demais. experiencia de vcs?',
    nivelAutor: 'avancado'
  },
];

export const THREADS_NUTRICAO: ThreadTemplate[] = [
  {
    tipo: 'pergunta',
    categoria: 'nutricao',
    titulo: 'como calcular minhas calorias?',
    conteudo: 'gente nao faço ideia de quantas calorias eu preciso comer. tem algum jeito simples de descobrir?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'nutricao',
    titulo: 'jejum intermitente funciona?',
    conteudo: 'vi uns videos sobre jejum intermitente e fiquei curioso. alguem aqui faz? vale a pena?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'debate',
    categoria: 'nutricao',
    titulo: 'low carb vs dieta balanceada',
    conteudo: 'qual funciona melhor pra vcs? to em duvida se corto carbo ou so controlo as calorias normalmente',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'nutricao',
    titulo: 'desisti da dieta rigida',
    conteudo: 'cansei de dieta super restritiva. agora to comendo de tudo mas controlando quantidade e ta funcionando melhor. alguem mais assim?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'nutricao',
    titulo: 'refeição trampa é necessaria?',
    conteudo: 'li uns artigos dizendo q refeicao trampa nao faz diferenca nenhuma fisiologicamente. mas psicologicamente ajuda muito. opiniao?',
    nivelAutor: 'critico'
  },
];

export const THREADS_TREINO: ThreadTemplate[] = [
  {
    tipo: 'pergunta',
    categoria: 'treino',
    titulo: 'academia ou treino em casa?',
    conteudo: 'to querendo começar mas academia é caro. da pra ter resultado treinando em casa so com peso corporal?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'treino',
    titulo: 'sentindo dor no ombro no supino',
    conteudo: 'quando faço supino sinto um incomodo no ombro direito. é normal ou to fazendo errado?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'debate',
    categoria: 'treino',
    titulo: 'treino ate a falha ou deixar 1-2 reps?',
    conteudo: 'uns dizem q tem q ir ate a falha, outros falam pra deixar 1-2 reps. qual vcs acham melhor?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'treino',
    titulo: 'mudei a tecnica e melhorou muito',
    conteudo: 'tava fazendo agachamento errado (joelho passando muito da ponta do pé). ajustei a postura e agora sinto muito mais na coxa. valeu a pena',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_SAUDE: ThreadTemplate[] = [
  {
    tipo: 'pergunta',
    categoria: 'saude',
    titulo: 'dor nas costas é normal?',
    conteudo: 'comecei a malhar faz 1 mes e direto sinto dor lombar. isso é falta de costume ou to fazendo algo errado?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'saude',
    titulo: 'lesionei o joelho correndo',
    conteudo: 'forcei demais na corrida e agora to com o joelho inflamado. alguem ja passou por isso? quanto tempo ate voltar?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'saude',
    titulo: 'treinar gripado pode?',
    conteudo: 'to meio resfriado, nada grave. da pra treinar normal ou é melhor descansar?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'debate',
    categoria: 'saude',
    titulo: 'alongamento antes ou depois?',
    conteudo: 'qual vcs fazem? eu sempre alongava antes mas li q o ideal é so depois. confere?',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_MOTIVACAO: ThreadTemplate[] = [
  {
    tipo: 'relato',
    categoria: 'motivacao',
    titulo: 'quase desistindo',
    conteudo: 'to há 2 meses tentando mas nao vejo resultado nenhum. peso igual, corpo igual, só cansaço. como vcs se mantém motivados?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'motivacao',
    titulo: 'como criar consistencia?',
    conteudo: 'começo bem mas depois de 2 semanas sempre desisto. como vcs conseguem manter a rotina?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'motivacao',
    titulo: 'primeira vez que passei de 3 meses',
    conteudo: 'gente to muito feliz! é a primeira vez q consigo manter treino e dieta por mais de 3 meses. virou habito mesmo',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'motivacao',
    titulo: 'disciplina > motivacao',
    conteudo: 'comecei a aceitar q motivacao vai e vem mas disciplina é q faz a diferenca. concordam?',
    nivelAutor: 'intermediario'
  },
];

// ============================================
// TEMPLATES DE RESPOSTAS
// ============================================

export const RESPOSTAS_APOIO: RespostaTemplate[] = [
  {
    conteudo: 'cara ja passei por isso tb... é frustrante demais mas nao desiste',
    nivel: 'iniciante',
    tom: 'apoio'
  },
  {
    conteudo: 'normal isso no começo. depois melhora',
    nivel: 'iniciante',
    tom: 'apoio'
  },
  {
    conteudo: 'to na mesma situacao q vc. vamos junto!',
    nivel: 'iniciante',
    tom: 'apoio'
  },
  {
    conteudo: 'no meu caso demorou uns 2 meses pra ver resultado. paciencia',
    nivel: 'intermediario',
    tom: 'apoio'
  },
];

export const RESPOSTAS_PRATICAS: RespostaTemplate[] = [
  {
    conteudo: 'tenta aumentar a proteina pra 1.6-2g por kg. comigo funcionou',
    nivel: 'intermediario',
    tom: 'pratico'
  },
  {
    conteudo: 'diminui o peso e foca na tecnica primeiro. melhor fazer bem feito do q jogar peso',
    nivel: 'intermediario',
    tom: 'pratico'
  },
  {
    conteudo: 'eu fazia assim tb e não dava resultado. mudei pra X e melhorou',
    nivel: 'intermediario',
    tom: 'pratico'
  },
  {
    conteudo: 'experimenta treinar em jejum. pra mim fez diferenca',
    nivel: 'intermediario',
    tom: 'pratico'
  },
];

export const RESPOSTAS_TECNICAS: RespostaTemplate[] = [
  {
    conteudo: 'deficit calorico é oq importa no final. pode comer carbo a noite sim',
    nivel: 'avancado',
    tom: 'tecnico'
  },
  {
    conteudo: 'proteina: 1.6-2.2g/kg. mais q isso não agrega. estudos mostram',
    nivel: 'avancado',
    tom: 'tecnico'
  },
  {
    conteudo: 'hipertrofia funciona melhor em faixas de 8-12 reps com carga moderada',
    nivel: 'avancado',
    tom: 'tecnico'
  },
];

export const RESPOSTAS_DISCORDANCIA: RespostaTemplate[] = [
  {
    conteudo: 'discordo. no meu caso foi totalmente diferente',
    nivel: 'intermediario',
    tom: 'discordancia'
  },
  {
    conteudo: 'acho q depende muito da pessoa. nao da pra generalizar',
    nivel: 'intermediario',
    tom: 'discordancia'
  },
  {
    conteudo: 'tem evidencia disso? pq tudo q eu li fala o contrario',
    nivel: 'critico',
    tom: 'discordancia'
  },
  {
    conteudo: 'essa crença de metabolismo lento é mito. CICO funciona pra todo mundo',
    nivel: 'critico',
    tom: 'discordancia'
  },
];

export const RESPOSTAS_RELATO: RespostaTemplate[] = [
  {
    conteudo: 'comigo tb foi assim. levou uns 3 meses pra pegar o jeito',
    nivel: 'iniciante',
    tom: 'relato'
  },
  {
    conteudo: 'eu tive q mudar 3x o treino ate achar oq funciona pra mim',
    nivel: 'intermediario',
    tom: 'relato'
  },
  {
    conteudo: 'passei anos fazendo errado. quando corrigi a tecnica mudou tudo',
    nivel: 'intermediario',
    tom: 'relato'
  },
];

// ============================================
// TEMPLATES: LIPEDEMA E MUSCULAÇÃO
// ============================================

export const THREADS_LIPEDEMA: ThreadTemplate[] = [
  // THREAD PRINCIPAL (do exemplo)
  {
    tipo: 'pergunta',
    categoria: 'lipedema',
    titulo: 'musculacao engrossa a perna no lipedema?',
    conteudo: 'tenho lipedema e morro de medo de musculacao engrossar minhas pernas. treinar ajuda ou piora? alguem aqui tem experiencia?',
    nivelAutor: 'iniciante'
  },

  // INICIANTES
  {
    tipo: 'duvida',
    categoria: 'lipedema',
    titulo: 'diagnosticada com lipedema agora',
    conteudo: 'acabei de descobrir q tenho lipedema. to perdida, nao sei se posso treinar ou se vai piorar. me ajudem?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'lipedema',
    titulo: 'que exercicio nao inflama?',
    conteudo: 'quais exercicios vcs fazem q nao causam mais inflamacao? tenho medo de piorar',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'lipedema',
    titulo: 'impacto piorou tudo',
    conteudo: 'tentei correr e minhas pernas incharam muito mais. impacto realmente piora lipedema?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'lipedema',
    titulo: 'drenagem linfatica funciona?',
    conteudo: 'to fazendo drenagem mas e cara. sera q so exercicio resolve ou precisa dos dois?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'relato',
    categoria: 'lipedema',
    titulo: 'quando parei de treinar inchei mais',
    conteudo: 'fiquei um mes sem treinar por preguica e percebi q as pernas ficaram mais inchadas. voltei a treinar e melhorou',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'lipedema',
    titulo: 'carga alta ou carga baixa?',
    conteudo: 'qual funciona melhor pro lipedema? eu faco carga moderada mas vi gente falando q carga alta ajuda na drenagem',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'lipedema',
    titulo: 'meu erro foi carga alta sem controle',
    conteudo: 'forcei demais no leg press e fiquei uma semana com as pernas doendo e inchadas. aprendi q precisa ir devagar',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'pergunta',
    categoria: 'lipedema',
    titulo: 'gluteo ajuda na drenagem?',
    conteudo: 'li q fortalecer gluteo melhora a circulacao e ajuda na drenagem. alguem notou isso?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'lipedema',
    titulo: 'musculacao vs pilates pra lipedema',
    conteudo: 'qual vcs acham melhor? musculacao fortalece mas pilates parece mais suave. experiencia de vcs?',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'lipedema',
    titulo: 'lipedema tem cura ou so controle?',
    conteudo: 'vejo muita gente vendendo solucao milagrosa. mas na real é so controle ne? nao tem cura',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'lipedema',
    titulo: 'diferenca entre lipedema e linfedema',
    conteudo: 'como diferenciar? tenho duvida se o meu é lipedema ou linfedema. sintomas parecem parecidos',
    nivelAutor: 'intermediario'
  },
];

// ============================================
// TEMPLATES: BARRIGA POCHETE / POSTURA
// ============================================

export const THREADS_POSTURA: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'postura',
    titulo: 'barriga que nao sai mesmo emagrecendo',
    conteudo: 'faco reeducacao alimentar ha meses, emagreci no corpo todo menos na barriga. ela fica projetada pra frente tipo pochete. isso é gordura resistente ou outra coisa? ja tentei de tudo',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'postura',
    titulo: 'barriga so de um lado?',
    conteudo: 'gente isso é normal? minha barriga fica mais projetada de um lado. parece q meu corpo é torto. alguem ja teve isso?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'postura',
    titulo: 'descobri q era postura nao gordura',
    conteudo: 'passei anos fazendo dieta e treino abdominal achando q minha barriga era gordura. ai descobri q era anteversao pelvica. quando corrijo a postura a barriga some',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'postura',
    titulo: 'exercicio de abdomen resolve?',
    conteudo: 'malhei abdomen por 6 meses direto mas a barriga continua projetada. sera q to fazendo errado ou nao é isso q resolve?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'postura',
    titulo: 'ficar muito tempo sentado piora?',
    conteudo: 'trabalho 8h sentado e sinto q minha barriga fica cada vez mais pra frente. tem relacao ou to viajando?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'debate',
    categoria: 'postura',
    titulo: 'anteversao pelvica da pra corrigir sozinho?',
    conteudo: 'vi videos no youtube ensinando a corrigir anteversao pelvica em casa. funciona mesmo ou precisa de fisio? qual experiencia de vcs?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'postura',
    titulo: 'forcei core e piorou',
    conteudo: 'comecei a fazer prancha todo dia pra fortalecer o core mas sinto q a lombar ta doendo mais. sera q to fazendo errado?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'pergunta',
    categoria: 'postura',
    titulo: 'gluteo fraco causa barriga saliente?',
    conteudo: 'li q gluteo fraco deixa a pelve anterior e projeta a barriga. faz sentido? alguem corrigiu treinando glúteo?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'postura',
    titulo: 'treino de postura vs treino de hipertrofia',
    conteudo: 'qual priorizar? to querendo ganhar massa mas tbm corrigir a postura. da pra fazer os dois ao mesmo tempo?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'postura',
    titulo: 'pilates mudou tudo',
    conteudo: 'depois de anos tentando musculacao comecei pilates e em 3 meses a barriga sumiu sem emagrecer um kg. foi so ativacao de core msm',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'postura',
    titulo: 'lordose lombar é sempre ruim?',
    conteudo: 'tem gente q fala q toda lordose é problema. mas nao é uma curvatura natural da coluna? qual o limite entre normal e patologico?',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'postura',
    titulo: 'diastase ou anteversao?',
    conteudo: 'como diferenciar? tenho barriga projetada pos-gravidez mas nao sei se é diastase abdominal ou so postura ruim',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_HIPERCIFOSE: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'hipercifose',
    titulo: 'tenho postura curvada e sinto inchaco constante',
    conteudo: 'gente minha postura é bem curvada e eu sinto inchaço nas pernas quase todo dia. será que tem relação? alguém já passou por isso?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'hipercifose',
    titulo: 'diagnosticada com hipercifose agora',
    conteudo: 'acabei de descobrir que tenho hipercifose. to perdida, não sei se posso treinar ou se vai piorar. o que eu faço?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'hipercifose',
    titulo: 'que exercicio melhora postura curvada?',
    conteudo: 'minhas costas são super curvadas e isso me incomoda muito. tem algum exercício que ajuda? musculação ou pilates?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'hipercifose',
    titulo: 'ficar sentada curvada o dia todo',
    conteudo: 'trabalho home office e passo 10h sentada curvada no notebook. no fim do dia to toda inchada e dolorida. isso é normal?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'hipercifose',
    titulo: 'respiracao curta e cansaco',
    conteudo: 'alguem mais sente que respira mal? tenho postura curvada e sempre to com falta de ar. tem relacao?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'hipercifose',
    titulo: 'dor nas costas ou postura ruim?',
    conteudo: 'não sei se minha dor é por causa da postura ou se é algo mais sério. como diferenciar?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'relato',
    categoria: 'hipercifose',
    titulo: 'quando corrigi a postura pernas desincharam',
    conteudo: 'comecei a trabalhar postura com fisio e percebi que minhas pernas desincharam muito. não mudei mais nada, só corrigi a curvatura das costas',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'hipercifose',
    titulo: 'trabalhar dorsal mudou minha respiracao',
    conteudo: 'foquei em fortalecer as costas (dorsal, trapézio) e minha respiração melhorou muito. não esperava esse efeito',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'pergunta',
    categoria: 'hipercifose',
    titulo: 'alongamento ajuda na circulacao?',
    conteudo: 'vi gente falando q alongar a coluna melhora circulação e reduz inchaço. faz sentido? alguém testou?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'hipercifose',
    titulo: 'fortalecimento de costas vs drenagem',
    conteudo: 'qual é mais efetivo pra reduzir inchaço: treinar costas pra corrigir postura ou fazer drenagem linfática?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'hipercifose',
    titulo: 'yoga desbloqueou meu tronco',
    conteudo: 'depois de anos curvada, comecei yoga e senti que meu tronco "desbloqueou". circulação melhorou muito',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'hipercifose',
    titulo: 'hipercifose tem tratamento ou so controle?',
    conteudo: 'vejo muita gente falando de "corrigir" hipercifose mas será que corrige mesmo ou só controla? qual a real?',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'hipercifose',
    titulo: 'diferenca entre postura ruim e hipercifose',
    conteudo: 'todo mundo curvado tem hipercifose ou é só má postura? onde tá a linha divisória entre uma coisa e outra?',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_COMPRESSAO: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'compressao',
    titulo: 'treinar de meia de compressao funciona mesmo?',
    conteudo: 'vi muita gente falando de treinar de meia de compressão mas será que funciona ou é só modinha? vale a pena investir?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'compressao',
    titulo: 'comprei meia de compressao mas nao sei se funciona',
    conteudo: 'comprei uma meia de compressão mas não sei se to usando direito. tem que usar durante o treino ou só depois? alguém sabe?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'compressao',
    titulo: 'vale a pena investir em meia de compressao?',
    conteudo: 'to querendo comprar meia de compressão mas são caras. será que realmente vale a pena ou é só marketing?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'compressao',
    titulo: 'meia de compressao ajuda no lipedema?',
    conteudo: 'tenho lipedema e vi gente falando que meia de compressão ajuda. é verdade ou não faz diferença?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'compressao',
    titulo: 'quanto tempo usar meia de compressao?',
    conteudo: 'comprei meia de compressão mas não sei quanto tempo devo usar. durante o treino todo? só na parte de perna? me ajudem',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'compressao',
    titulo: 'meia de compressao ou calça compressora?',
    conteudo: 'qual é melhor pra treinar: meia de compressão ou calça compressora? tem diferença real ou tanto faz?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'relato',
    categoria: 'compressao',
    titulo: 'com meia sinto menos dor',
    conteudo: 'comecei a usar meia de compressão no treino e sinceramente sinto menos dor e inchaço depois. não sei se é psicológico mas ta funcionando',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'compressao',
    titulo: 'sem treino nao vi diferenca',
    conteudo: 'uso meia de compressão mas não treino regularmente. não vi diferença nenhuma no inchaço. será que só funciona junto com exercício?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'compressao',
    titulo: 'usei errado e nao ajudou',
    conteudo: 'usei meia de compressão por semanas mas não ajudou em nada. depois descobri que comprei a pressão errada. tem que ser específica mesmo',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'compressao',
    titulo: 'compressao durante ou apos treino?',
    conteudo: 'galera qual é melhor: usar meia de compressão durante o treino ou só depois pra recuperação? opiniões divididas aqui',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'compressao',
    titulo: 'meia de compressao vs drenagem linfatica',
    conteudo: 'o que funciona melhor pra reduzir inchaço: usar meia de compressão ou fazer drenagem linfática? ou os dois juntos?',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'compressao',
    titulo: 'compressao é so marketing ou tem ciencia?',
    conteudo: 'vejo muito atleta usando meia de compressão mas será que tem evidência científica real ou é só patrocínio? alguém já leu estudos?',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'compressao',
    titulo: 'diferenca entre meia estetica e terapeutica',
    conteudo: 'qual a diferença real entre meia de compressão estética e terapêutica? são os mesmos benefícios ou é enganação?',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_MENSTRUAL: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'menstrual',
    titulo: 'no periodo menstrual minha perna doi muito mais',
    conteudo: 'gente todo mes quando to menstruada minhas pernas doem muito mais. os nodulos ficam sensiveis e inchados. isso é normal ou so eu tenho isso?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'menstrual',
    titulo: 'descobri lipedema e agora entendo a dor menstrual',
    conteudo: 'anos sofrendo com dor nas pernas todo mes e achando q era frescura. agora descobri que tenho lipedema e faz todo sentido',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'menstrual',
    titulo: 'toda menstruacao minhas pernas incham',
    conteudo: 'sempre que to menstruada minhas pernas incham demais e doem. tem relação com lipedema ou é outra coisa?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'menstrual',
    titulo: 'é normal doer tanto no periodo?',
    conteudo: 'minhas pernas doem tanto no período menstrual que mal consigo andar direito. alguém mais passa por isso?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'menstrual',
    titulo: 'lipedema piora com hormonios?',
    conteudo: 'vi gente falando que hormônio piora lipedema. é verdade? minha dor sempre piora na menstruação',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'menstrual',
    titulo: 'dor nos nodulos antes ou durante menstruacao?',
    conteudo: 'a dor piora antes da menstruação ou durante? pra mim é sempre uns 3 dias antes que fica insuportável',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'relato',
    categoria: 'menstrual',
    titulo: 'sempre piora pra mim',
    conteudo: 'todo ciclo menstrual é a mesma coisa. dor nas pernas aumenta, inchaço piora, mal consigo treinar direito',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'menstrual',
    titulo: 'retencao me mata',
    conteudo: 'no período menstrual a retenção de líquido me mata. minhas pernas ficam pesadas e doloridas demais',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'menstrual',
    titulo: 'aprendi a ajustar treino nesses dias',
    conteudo: 'levou tempo mas aprendi a ajustar meu treino no período menstrual. diminuo intensidade e foco em mobilidade',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'menstrual',
    titulo: 'anticoncepcional ajuda ou piora?',
    conteudo: 'tomo anticoncepcional e não sei se ajuda ou piora o lipedema. alguém tem experiência com isso?',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'pergunta',
    categoria: 'menstrual',
    titulo: 'alimentacao vs dor menstrual',
    conteudo: 'será que ajustar alimentação no período menstrual reduz a dor? menos sal, mais água? o que funciona pra vcs?',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'menstrual',
    titulo: 'relacao entre estrogenio e lipedema',
    conteudo: 'li que estrogênio tem relação com lipedema e por isso piora na menstruação. alguém conhece os estudos sobre isso?',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'menstrual',
    titulo: 'ciclicidade da dor é diagnostico?',
    conteudo: 'a dor cíclica (que piora na menstruação) pode ser usada como critério de diagnóstico de lipedema? ou é só sintoma comum?',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_MIOFASCIAL: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'miofascial',
    titulo: 'liberacao miofascial resolve lipedema?',
    conteudo: 'vi muita gente falando de liberação miofascial pra lipedema. será que resolve mesmo ou é só mais uma modinha? alguém testou?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'miofascial',
    titulo: 'comprei rolo de liberacao mas nao sei usar',
    conteudo: 'comprei um rolo de liberação miofascial mas não faço ideia de como usar direito. tem que doer muito? quanto tempo fazer?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'miofascial',
    titulo: 'vale a pena investir em liberacao miofascial?',
    conteudo: 'to querendo comprar rolo ou pistola de massagem mas são caros. vale mesmo a pena ou é só marketing?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'miofascial',
    titulo: 'liberacao miofascial doi muito é normal?',
    conteudo: 'comecei a fazer liberação miofascial e dói demais. é pra doer assim mesmo ou to fazendo errado?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'miofascial',
    titulo: 'quanto tempo fazer liberacao?',
    conteudo: 'quanto tempo devo fazer liberação miofascial? 5 minutos? 30 minutos? todo dia ou só depois do treino?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'miofascial',
    titulo: 'liberacao ajuda no lipedema mesmo?',
    conteudo: 'tenho lipedema e vi gente falando que liberação miofascial ajuda. faz sentido ou não tem nada a ver?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'relato',
    categoria: 'miofascial',
    titulo: 'ajuda na dor nao resolve tudo',
    conteudo: 'liberação miofascial realmente ajuda na dor e deixa as pernas mais leves, mas não resolve o lipedema. é complementar',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'miofascial',
    titulo: 'sozinha nao mudou estetica',
    conteudo: 'usei liberação miofascial por meses mas sozinha não mudou nada na estética. só quando combinei com treino que vi diferença',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'miofascial',
    titulo: 'usei como complemento',
    conteudo: 'liberação miofascial como complemento do treino funciona bem. antes de treinar ajuda a mobilizar, depois ajuda na recuperação',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'miofascial',
    titulo: 'liberacao antes ou depois do treino?',
    conteudo: 'qual é melhor: fazer liberação miofascial antes do treino pra mobilizar ou depois pra recuperar? opiniões divididas',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'miofascial',
    titulo: 'rolo vs pistola de massagem?',
    conteudo: 'qual é mais efetivo: rolo de liberação ou pistola de massagem? a diferença de preço vale a pena?',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'miofascial',
    titulo: 'liberacao miofascial tem evidencia cientifica?',
    conteudo: 'vejo muita gente defendendo liberação miofascial mas será que tem evidência científica real? alguém já leu estudos?',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'miofascial',
    titulo: 'diferenca entre liberacao e massagem comum?',
    conteudo: 'qual a diferença real entre liberação miofascial e uma massagem comum? ou é só nome diferente pra mesma coisa?',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_DESVIO_BACIA: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'relato',
    categoria: 'desvio_bacia',
    titulo: 'depois que ajustei postura minha gordura mudou',
    conteudo: 'gente fiz ajuste postural e minha "gordura" da barriga mudou sem eu emagrecer nada. alguém mais passou por isso? parece mágica',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'desvio_bacia',
    titulo: 'descobri que nao era gordura era postura',
    conteudo: 'anos fazendo dieta achando q tinha gordura localizada. descobri q era desvio de bacia. quando corrigi a postura mudou tudo',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'relato',
    categoria: 'desvio_bacia',
    titulo: 'minha barriga sumiu quando corrigi a bacia',
    conteudo: 'comecei a trabalhar alinhamento da bacia e minha barriga literalmente sumiu. peso continua o mesmo mas silhueta mudou',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'desvio_bacia',
    titulo: 'desvio de bacia engorda?',
    conteudo: 'tenho desvio de bacia e sempre tive barriga. será q tem relação ou é coincidência?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'desvio_bacia',
    titulo: 'como saber se tenho desvio de bacia?',
    conteudo: 'como eu sei se tenho desvio de bacia? tem algum teste simples que posso fazer sozinha ou precisa de profissional?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'desvio_bacia',
    titulo: 'barriga lateral é desvio de bacia?',
    conteudo: 'minha barriga é mais pra um lado q pro outro. isso pode ser desvio de bacia ou é só gordura assimétrica?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'relato',
    categoria: 'desvio_bacia',
    titulo: 'minha barriga mudou sem emagrecer',
    conteudo: 'trabalhei correção postural por 3 meses. balança não mudou mas minha barriga diminuiu visivelmente. é impressionante',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'desvio_bacia',
    titulo: 'quadril alinhado mudou tudo',
    conteudo: 'depois q alinhou meu quadril a distribuição do meu corpo mudou. mesmas medidas mas aparência totalmente diferente',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'desvio_bacia',
    titulo: 'postura explica muita coisa',
    conteudo: 'anos culpando genética e dieta. na verdade era postura. corrigi e mudou mais q qualquer dieta já fez',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'desvio_bacia',
    titulo: 'anos fazendo dieta pra descobrir que era postura',
    conteudo: 'alguém mais passou anos em dieta restritiva pra descobrir q o problema era postural? me sinto enganada',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'desvio_bacia',
    titulo: 'fisio vs personal: quem trata desvio?',
    conteudo: 'devo ir em fisioterapeuta ou personal trainer pra corrigir desvio de bacia? qual é mais indicado?',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'desvio_bacia',
    titulo: 'diferenca entre desvio funcional e estrutural',
    conteudo: 'alguém sabe explicar a diferença entre desvio funcional (corrigível) e estrutural (anatômico)? isso muda o tratamento?',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'desvio_bacia',
    titulo: 'postura sozinha muda medidas?',
    conteudo: 'é possível que só correção postural mude medidas corporais sem perder gordura? ou é só impressão visual?',
    nivelAutor: 'intermediario'
  },
];

export const THREADS_GLUTEO_MEDIO: ThreadTemplate[] = [
  // INICIANTES
  {
    tipo: 'pergunta',
    categoria: 'gluteo_medio',
    titulo: 'a abdutora ajuda mesmo no joelho e no formato do gluteo?',
    conteudo: 'faço cadeira abdutora mas não sei se ta ajudando. melhora joelho e muda o formato do glúteo ou é só mito?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'gluteo_medio',
    titulo: 'o que é valgo dinamico?',
    conteudo: 'todo mundo fala de valgo dinâmico mas eu não entendo direito. é o joelho que vai pra dentro? isso é ruim?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'gluteo_medio',
    titulo: 'cadeira abdutora funciona mesmo?',
    conteudo: 'vi gente falando mal da cadeira abdutora dizendo que não serve pra nada. mas serve ou não serve?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'gluteo_medio',
    titulo: 'por que meu joelho doi quando corro?',
    conteudo: 'quando corro meu joelho dói na parte lateral. será que é glúteo fraco ou é outra coisa?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'pergunta',
    categoria: 'gluteo_medio',
    titulo: 'gluteo medio fraco causa dor?',
    conteudo: 'meu personal falou que meu glúteo médio é fraco e por isso tenho dor no joelho. faz sentido isso?',
    nivelAutor: 'iniciante'
  },
  {
    tipo: 'duvida',
    categoria: 'gluteo_medio',
    titulo: 'quadril largo é gluteo fraco?',
    conteudo: 'meu quadril é meio largo e alguém falou que pode ser glúteo médio fraco. isso existe mesmo?',
    nivelAutor: 'iniciante'
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'relato',
    categoria: 'gluteo_medio',
    titulo: 'quando fortaleco meu joelho doi menos',
    conteudo: 'comecei a treinar glúteo médio específico e meu joelho parou de doer quando corro. a diferença é clara',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'gluteo_medio',
    titulo: 'sozinha nao resolveu',
    conteudo: 'fiz só abdutora por meses mas não resolveu. quando combinei com agachamento e unilateral aí sim melhorou',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'relato',
    categoria: 'gluteo_medio',
    titulo: 'aprendi a ativar melhor',
    conteudo: 'levou tempo mas aprendi a sentir o glúteo médio trabalhando. antes eu só sentia o tensor da fáscia lata',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'debate',
    categoria: 'gluteo_medio',
    titulo: 'abdutora vs agachamento lateral?',
    conteudo: 'qual é mais efetivo pro glúteo médio: cadeira abdutora ou agachamento lateral? opiniões divididas',
    nivelAutor: 'intermediario'
  },
  {
    tipo: 'pergunta',
    categoria: 'gluteo_medio',
    titulo: 'gluteo medio muda formato do quadril?',
    conteudo: 'fortalecer glúteo médio realmente muda o formato do quadril ou é só melhora de postura?',
    nivelAutor: 'intermediario'
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'gluteo_medio',
    titulo: 'valgo dinamico é sempre problema?',
    conteudo: 'todo mundo fala mal de valgo dinâmico mas será que sempre é problema? ou depende do grau e da pessoa?',
    nivelAutor: 'critico'
  },
  {
    tipo: 'pergunta',
    categoria: 'gluteo_medio',
    titulo: 'diferenca entre valgo estrutural e funcional?',
    conteudo: 'qual a diferença entre valgo estrutural (ósseo) e funcional (muscular)? tratamento é diferente?',
    nivelAutor: 'intermediario'
  },
];

// ============================================
// FUNÇÃO DE SELEÇÃO DE TEMPLATES
// ============================================

export function selecionarThreadTemplate(categoria: CategoriaArena, tipo?: TipoThread): ThreadTemplate {
  const mapeamento: Record<CategoriaArena, ThreadTemplate[]> = {
    emagrecimento: THREADS_EMAGRECIMENTO,
    hipertrofia: THREADS_HIPERTROFIA,
    nutricao: THREADS_NUTRICAO,
    treino: THREADS_TREINO,
    saude: THREADS_SAUDE,
    motivacao: THREADS_MOTIVACAO,
    postura: THREADS_POSTURA,
    lipedema: THREADS_LIPEDEMA,
    hipercifose: THREADS_HIPERCIFOSE,
    compressao: THREADS_COMPRESSAO,
    menstrual: THREADS_MENSTRUAL,
    miofascial: THREADS_MIOFASCIAL,
    desvio_bacia: THREADS_DESVIO_BACIA,
    gluteo_medio: THREADS_GLUTEO_MEDIO,
  };

  let pool = mapeamento[categoria] || THREADS_EMAGRECIMENTO;

  // Filtrar por tipo se especificado
  if (tipo) {
    pool = pool.filter(t => t.tipo === tipo);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function selecionarRespostaTemplate(tom: RespostaTemplate['tom'], nivel?: NivelUsuario): RespostaTemplate {
  const mapeamento: Record<RespostaTemplate['tom'], RespostaTemplate[]> = {
    apoio: RESPOSTAS_APOIO,
    pratico: RESPOSTAS_PRATICAS,
    tecnico: RESPOSTAS_TECNICAS,
    discordancia: RESPOSTAS_DISCORDANCIA,
    relato: RESPOSTAS_RELATO,
  };

  let pool = mapeamento[tom];

  // Filtrar por nível se especificado
  if (nivel) {
    const poolFiltrado = pool.filter(r => r.nivel === nivel);
    if (poolFiltrado.length > 0) {
      pool = poolFiltrado;
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Seleciona tom de resposta baseado no tipo de thread
 */
export function selecionarTomResposta(tipoThread: TipoThread): RespostaTemplate['tom'] {
  const random = Math.random();

  switch (tipoThread) {
    case 'pergunta':
      // 50% prático, 30% apoio, 20% técnico
      if (random < 0.5) return 'pratico';
      if (random < 0.8) return 'apoio';
      return 'tecnico';

    case 'relato':
      // 60% apoio, 30% relato, 10% discordância
      if (random < 0.6) return 'apoio';
      if (random < 0.9) return 'relato';
      return 'discordancia';

    case 'debate':
      // 40% prático, 30% discordância, 30% técnico
      if (random < 0.4) return 'pratico';
      if (random < 0.7) return 'discordancia';
      return 'tecnico';

    case 'duvida':
      // 50% prático, 30% relato, 20% apoio
      if (random < 0.5) return 'pratico';
      if (random < 0.8) return 'relato';
      return 'apoio';

    default:
      return 'pratico';
  }
}

export default {
  selecionarThreadTemplate,
  selecionarRespostaTemplate,
  selecionarTomResposta,
};
