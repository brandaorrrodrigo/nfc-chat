/**
 * GERADOR DE THREADS E RESPOSTAS ORGÂNICAS
 *
 * Integra:
 * - Ghost users
 * - Templates de threads
 * - Sistema de linguagem natural
 * - Anti-spam controls
 *
 * IMPORTANTE: Este módulo NÃO interage com banco de dados diretamente.
 * Apenas gera objetos que serão salvos pelo script de povoamento.
 */

import {
  selecionarGhostUserAleatorio,
  selecionarGhostUsers,
  type GhostUser,
  type NivelUsuario,
} from './ghost-users-database';

import {
  selecionarThreadTemplate,
  selecionarRespostaTemplate,
  selecionarTomResposta,
  type ThreadTemplate,
  type RespostaTemplate,
  type CategoriaArena,
  type TipoThread,
} from './thread-templates';

import {
  naturalizarTexto,
  selecionarPerfilAleatorio,
  obterPerfilNaturalizacao,
  validarNaturalidade,
} from '../lib/ia/language-naturalizer';

// ============================================
// TIPOS
// ============================================

export interface ThreadGerada {
  autor: GhostUser;
  titulo: string;
  conteudo: string;
  categoria: CategoriaArena;
  tipo: TipoThread;
  timestamp: Date;
  respostas: RespostaGerada[];
}

export interface RespostaGerada {
  autor: GhostUser;
  conteudo: string;
  timestamp: Date;
  tom: RespostaTemplate['tom'];
  parentId?: string; // Para respostas a respostas
}

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
  MIN_RESPOSTAS_POR_THREAD: 3,
  MAX_RESPOSTAS_POR_THREAD: 7,
  MIN_INTERVALO_RESPOSTAS_MINUTOS: 5,
  MAX_INTERVALO_RESPOSTAS_MINUTOS: 45,
  CHANCE_IA_INTERVIR: 0.4, // 40% de chance da IA responder
  MAX_RESPOSTAS_SEGUIDAS_MESMO_USER: 2,
};

// ============================================
// GERADOR DE THREAD COMPLETA
// ============================================

/**
 * Gera uma thread completa com autor, título, conteúdo e respostas
 */
export function gerarThread(
  categoria: CategoriaArena,
  tipo?: TipoThread,
  timestampBase?: Date
): ThreadGerada {
  // 1. Selecionar template
  const template = selecionarThreadTemplate(categoria, tipo);

  // 2. Selecionar autor baseado no nível do template
  const autor = selecionarGhostUserAleatorio(template.nivelAutor);

  // 3. Naturalizar conteúdo
  const perfilAutor = mapearNivelParaPerfil(autor.nivel);
  const opcoesNaturalizacao = obterPerfilNaturalizacao(perfilAutor);

  const tituloNaturalizado = naturalizarTexto(template.titulo, {
    ...opcoesNaturalizacao,
    nivel: 'forte', // Títulos mais informais
  });

  const conteudoNaturalizado = naturalizarTexto(template.conteudo, opcoesNaturalizacao);

  // 4. Timestamp
  const timestamp = timestampBase || gerarTimestampAleatorio();

  // 5. Gerar respostas
  const quantidadeRespostas = Math.floor(
    Math.random() * (CONFIG.MAX_RESPOSTAS_POR_THREAD - CONFIG.MIN_RESPOSTAS_POR_THREAD + 1)
  ) + CONFIG.MIN_RESPOSTAS_POR_THREAD;

  const respostas = gerarRespostasParaThread(
    template.tipo,
    quantidadeRespostas,
    timestamp,
    [autor.id] // Evitar autor responder a si mesmo
  );

  return {
    autor,
    titulo: tituloNaturalizado,
    conteudo: conteudoNaturalizado,
    categoria,
    tipo: template.tipo,
    timestamp,
    respostas,
  };
}

// ============================================
// GERADOR DE RESPOSTAS
// ============================================

/**
 * Gera respostas para uma thread
 */
function gerarRespostasParaThread(
  tipoThread: TipoThread,
  quantidade: number,
  timestampInicial: Date,
  autoresProibidos: string[] = []
): RespostaGerada[] {
  const respostas: RespostaGerada[] = [];
  let timestampAtual = new Date(timestampInicial);
  let ultimoAutorId: string | null = null;
  let contagemRespostasSeguidasMesmoAutor = 0;

  for (let i = 0; i < quantidade; i++) {
    // Selecionar tom baseado no tipo de thread
    const tom = selecionarTomResposta(tipoThread);

    // Selecionar autor
    let autor: GhostUser;
    let tentativas = 0;

    do {
      autor = selecionarGhostUserAleatorio();
      tentativas++;

      // Evitar:
      // 1. Autores proibidos (autor da thread)
      // 2. Mesmo autor 3x seguidas
      const autorValido =
        !autoresProibidos.includes(autor.id) &&
        !(autor.id === ultimoAutorId && contagemRespostasSeguidasMesmoAutor >= CONFIG.MAX_RESPOSTAS_SEGUIDAS_MESMO_USER);

      if (autorValido) break;

    } while (tentativas < 20);

    // Atualizar controle de autor
    if (autor.id === ultimoAutorId) {
      contagemRespostasSeguidasMesmoAutor++;
    } else {
      contagemRespostasSeguidasMesmoAutor = 1;
      ultimoAutorId = autor.id;
    }

    // Selecionar template de resposta
    const template = selecionarRespostaTemplate(tom, autor.nivel);

    // Naturalizar conteúdo
    const perfilAutor = mapearNivelParaPerfil(autor.nivel);
    const opcoesNaturalizacao = obterPerfilNaturalizacao(perfilAutor);
    const conteudoNaturalizado = naturalizarTexto(template.conteudo, opcoesNaturalizacao);

    // Gerar timestamp (5-45 min depois da anterior)
    const intervaloMinutos =
      Math.floor(Math.random() * (CONFIG.MAX_INTERVALO_RESPOSTAS_MINUTOS - CONFIG.MIN_INTERVALO_RESPOSTAS_MINUTOS + 1)) +
      CONFIG.MIN_INTERVALO_RESPOSTAS_MINUTOS;

    timestampAtual = new Date(timestampAtual.getTime() + intervaloMinutos * 60 * 1000);

    respostas.push({
      autor,
      conteudo: conteudoNaturalizado,
      timestamp: new Date(timestampAtual),
      tom,
    });
  }

  return respostas;
}

// ============================================
// GERADOR DE RESPOSTA DA IA (FOLLOW-UP)
// ============================================

/**
 * Gera resposta da IA para uma thread (se aplicável)
 * Retorna null se IA não deve intervir
 */
export function gerarRespostaIA(
  thread: ThreadGerada,
  timestampUltimaResposta: Date
): RespostaGerada | null {
  // IA só intervém em 40% dos casos
  if (Math.random() > CONFIG.CHANCE_IA_INTERVIR) {
    return null;
  }

  // IA só intervém se já houver pelo menos 3 respostas humanas
  if (thread.respostas.length < 3) {
    return null;
  }

  // Respostas específicas para arena de postura/barriga pochete
  const respostasPostura: string[] = [
    'Excelente ponto. A anteversao pelvica projeta o abdomen mesmo com baixo percentual de gordura. Pergunta para o grupo: alguem ja notou a barriga "sumir" quando ajusta a posicao da pelve em pe?',
    'Interessante. Muita gente treina abdomen sem ativar o transverso do abdomen, que é o musculo responsavel por "segurar" a barriga. Como vcs sentem a ativacao dele?',
    'Boa discussao. A postura sentada prolongada realmente desativa o core e aumenta a anteversao. Alguem aqui trabalha remoto e ja percebeu mudanca na postura ao longo do dia?',
    'Ponto importante. Gluteo fraco é uma das causas mais comuns de anteversao pelvica. Quem aqui ja fortaleceu gluteo e notou diferenca na barriga?',
    'Faz sentido a duvida. Lordose lombar é natural, mas o excesso (hiperlordose) projeta a barriga. Como vcs avaliam se a lordose de vcs ta dentro do normal?',
    'Concordo que o caso pos-gravidez pode envolver diastase. Isso requer avaliacao profissional. Alguem ja passou por avaliacao de diastase? Como foi?',
    'Otimo relato sobre pilates. A diferenca é que pilates trabalha estabilizacao antes de forca bruta. O que funcionou melhor pra vcs: pilates, RPG ou musculacao?',
    'O que muda mais sua barriga: emagrecer ou alinhar a postura?',
  ];

  // Respostas específicas para arena de lipedema
  const respostasLipedema: string[] = [
    'Musculacao terapeutica melhora drenagem e reduz inflamacao quando bem aplicada. Pergunta: alguem percebeu menos dor ao fortalecer gluteos e panturrilhas?',
    'Treinar nao inflama. Treinar errado inflama. O segredo ta no controle da carga e na progressao gradual. Qual exercicio te deu mais alivio: caminhada, forca ou ambos?',
    'Ponto importante. Impacto excessivo pode piorar a inflamacao. Exercicios de baixo impacto com fortalecimento ajudam na drenagem. Alguem notou diferenca entre musculacao e corrida?',
    'Excelente relato. Quando o musculo trabalha, ele ajuda a drenar o liquido acumulado. Parar de treinar piora a estagnacao. Vcs sentem diferenca nos dias que treinam vs dias que nao treinam?',
    'Faz sentido o medo. Mas hipertrofia muscular é diferente de inflamacao. Musculo forte melhora circulacao. Alguem conseguiu reduzir o inchaço fortalecendo as pernas?',
    'Boa discussao. Drenagem linfatica + exercicio funcionam melhor juntos. O movimento muscular é drenagem natural. Alguem faz so exercicio ou combina com drenagem?',
    'Concordo. Carga alta sem controle pode inflamar. O ideal é carga moderada, controle total e progressao lenta. Como vcs fazem a progressao de carga?',
  ];

  // Respostas específicas para arena de hipercifose
  const respostasHipercifose: string[] = [
    'A hipercifose altera respiracao e retorno venoso. Pergunta: alguem percebe mais inchaco apos longos periodos sentada curvada?',
    'Postura nao muda so aparencia. Muda circulacao. Quando o tronco ta curvado, a circulacao do sangue e linfa fica prejudicada. O que mais piora seu inchaco: postura ou tempo sentada?',
    'Excelente relato. Corrigir a curvatura melhora o retorno venoso das pernas. É mecanica pura: postura alinhada = circulacao fluindo melhor. Alguem mais notou esse efeito?',
    'Boa observacao. Fortalecer dorsal expande a caixa toracica e melhora a respiracao, o que aumenta oxigenacao e circulacao geral. Como vcs sentem a diferenca na respiracao?',
    'Faz sentido. Ficar curvada comprime os orgaos e vasos sanguineos, dificultando a drenagem natural do corpo. Vcs conseguem perceber diferenca quando melhoram a postura ao longo do dia?',
    'Interessante discussao. Alongar a coluna descomprime os vasos e melhora fluxo sanguineo. É diferente de drenagem manual, mas complementa. Alguem combina alongamento com outro metodo?',
    'Ponto valido. Treinar costas corrige a causa (postura), enquanto drenagem trata o sintoma (inchaco). Idealmente, os dois juntos. Qual abordagem trouxe mais resultado pra vcs?',
    'Concordo. Yoga e pilates trabalham mobilidade toracica, o que libera a respiracao e consequentemente melhora circulacao. Quem aqui ja testou ambos? Qual preferem?',
  ];

  // Respostas específicas para arena de compressão
  const respostasCompressao: string[] = [
    'A compressao potencializa o retorno linfatico quando ha movimento ritmico. Pergunta: quem usa percebe diferenca no pos-treino?',
    'Compressao sem movimento é estetica. Compressao com movimento é terapia. O movimento muscular amplifica o efeito. Voce usa compressao em qual tipo de treino?',
    'Excelente ponto. A compressao graduada (mais forte no tornozelo, menos na coxa) ajuda o sangue a subir. Mas precisa ser da pressao correta. Alguem ja testou diferentes niveis de compressao?',
    'Interessante relato. A compressao reduz a vibracao muscular e melhora propriocepcao, o que pode reduzir dor e fadiga. Vcs sentem essa diferenca durante ou apos o treino?',
    'Faz sentido. Sem movimento, a compressao sozinha nao resolve. O musculo precisa contrair pra bombear o sangue de volta. Como é a rotina de treino de quem usa meia?',
    'Boa observacao. Meia estetica tem baixa compressao (8-15 mmHg), terapeutica tem alta (20-30 mmHg). A diferenca é significativa. Alguem ja comparou os dois tipos?',
    'Ponto valido sobre modismo vs ciencia. Estudos mostram beneficio em recuperacao, mas nao em performance. Entao depende do objetivo. Qual é o seu: performance ou recuperacao?',
    'Concordo que a pressao errada pode nao funcionar ou até piorar. Compressao demais restringe, de menos nao faz efeito. Vcs mediram a pressao da meia antes de comprar?',
  ];

  // Respostas específicas para arena menstrual (dor nos nódulos)
  const respostasMenstrual: string[] = [
    'Variacoes hormonais aumentam permeabilidade vascular e inflamacao. Pergunta: alguem ajusta treino ou alimentacao nesse periodo?',
    'Dor ciclica nao é fraqueza. É fisiologia. Os hormonios realmente afetam o lipedema. O que mais te ajuda nesses dias: descanso ou adaptacao do treino?',
    'Faz sentido. O estrogenio aumenta retencao de liquidos e sensibilidade nos nodulos. É normal piorar na menstruacao. Como vcs lidam com a dor nesses dias?',
    'Excelente observacao. Muitas pessoas com lipedema relatam piora ciclica. Isso ajuda inclusive no diagnostico. Vcs notam padrao nos sintomas todo mes?',
    'Boa pergunta sobre anticoncepcional. Depende do tipo. Alguns pioram retencao, outros ajudam. Alguem ja testou diferentes tipos e notou diferenca?',
    'Interessante relato sobre ajuste de treino. Reduzir intensidade e focar em mobilidade pode ajudar muito nesses dias. Vcs preferem treino leve ou descanso total?',
    'Ponto importante. Reduzir sal, aumentar agua e antiinflamatorios naturais podem ajudar na fase menstrual. O que funciona melhor pra vcs: alimentacao ou suplementacao?',
    'Concordo. A ciclicidade da dor é forte indicador de relacao hormonal. Nao é frescura, é resposta fisiologica real. Como vcs explicam isso pra quem nao entende?',
  ];

  // Respostas específicas para arena de liberação miofascial
  const respostasMiofascial: string[] = [
    'Liberacao reduz tensao, mas sem forca e movimento o efeito é temporario. Pergunta: alguem usa como complemento do treino?',
    'Liberacao ajuda, mas nao substitui movimento. A fascia precisa de mobilidade ativa, nao só passiva. Voce usa liberacao antes ou depois do treino?',
    'Excelente ponto. Liberacao miofascial alivia tensao momentaneamente, mas sem fortalecimento o padrao de tensao volta. Como vcs combinam liberacao com treino de forca?',
    'Faz sentido. Liberacao sozinha nao muda estrutura, melhora mobilidade. O treino é que constroi mudanca real. Qual o timing que funciona melhor pra vcs?',
    'Boa observacao sobre dor. Nao deve doer muito. Pressao moderada, movimentos lentos. Se dói demais, pode estar fazendo errado ou muito intenso. Como vcs sentem durante?',
    'Interessante debate sobre rolo vs pistola. Rolo é mais controlavel, pistola é mais intensa mas caro. Ambos funcionam se bem usados. Qual vcs preferem e por que?',
    'Ponto valido sobre evidencia. Estudos mostram beneficio em mobilidade e reducao de dor, mas nao em estetica ou perda de medidas. Qual objetivo de vcs ao usar?',
    'Concordo sobre complementaridade. Liberacao prepara tecido, treino fortalece, alongamento mantém. Nenhum sozinho é solucao completa. Vcs fazem essa combinacao?',
  ];

  // Respostas específicas para arena de desvio de bacia
  const respostasDesvioBacia: string[] = [
    'Desvios de bacia alteram a distribuicao visual de gordura. Pergunta: alguem ja notou mudanca estetica sem mudanca de peso?',
    'Nem sempre é gordura. As vezes é alinhamento. Quando a bacia ta desalinhada, a gordura se distribui diferente visualmente. O que mudou mais seu corpo: balanca ou postura?',
    'Excelente relato. Alinhamento pelvico muda a projecao do abdomen e a silhueta geral, mesmo sem perder gordura. Vcs mediram antes e depois da correcao?',
    'Faz sentido. Desvio de bacia nao engorda, mas altera como a gordura aparece distribuida. É questao de mecanica corporal. Como descobriram que tinham desvio?',
    'Boa observacao. Assimetria visual pode ser postura, nao necessariamente gordura assimetrica. Um lado mais projetado sugere rotacao pelvica. Alguem ja fez avaliacao postural?',
    'Interessante debate sobre profissional. Idealmente fisio avalia e corrige, personal fortalece os padroes corretos. Os dois juntos é melhor. Qual caminho vcs seguiram?',
    'Ponto valido sobre funcional vs estrutural. Funcional corrige com exercicio e consciencia, estrutural é anatomico (ex: perna mais curta). Fizeram exame pra saber qual é o caso?',
    'Concordo. Postura muda distribuicao visual, nao medidas reais de gordura. Mas a aparencia muda tanto que parece q emagreceu. Ja tiraram fotos antes e depois?',
  ];

  // Respostas específicas para arena de glúteo médio/valgo
  const respostasGluteoMedio: string[] = [
    'O gluteo medio estabiliza pelve e joelho. Pergunta: alguem sentiu melhora no alinhamento ao subir escadas?',
    'Gluteo medio é postura, nao só estetica. Quando ele ta fraco, o joelho vai pra dentro (valgo). Voce sente o exercicio no gluteo ou no quadril?',
    'Excelente relato. Fortalecer gluteo medio reduz sobrecarga no joelho. É mecanica pura: estabiliza pelve = protege joelho. Vcs sentem diferenca na corrida?',
    'Faz sentido. Abdutora sozinha nao basta. Precisa de exercicios funcionais (agachamento unilateral, step lateral). Como vcs combinam os exercicios?',
    'Boa observacao sobre ativacao. Muita gente usa tensor da fascia lata ao inves do gluteo medio. A pegada é externa rotacao + abducao. Conseguem sentir a diferenca?',
    'Interessante debate. Abdutora isola, agachamento lateral é funcional. Idealmente os dois: isolar pra aprender, funcional pra transferir. Qual vcs preferem?',
    'Ponto valido. Valgo leve em mulheres é anatomico (quadril mais largo). Problema é valgo dinamico excessivo sob carga. Qual o limite saudavel? Depende de cada um.',
    'Concordo sobre estrutural vs funcional. Estrutural é osseo (femur, tibia), funcional é muscular (corrigivel). Exame de imagem diferencia. Qual o caso de vcs?',
  ];

  // Selecionar tipo de resposta da IA baseado no tipo de thread
  const respostasIA: Record<TipoThread, string[]> = {
    pergunta: [
      'Boa pergunta! Esse é um tema que gera muita dúvida. O que mais te impede de testar na prática?',
      'Interessante. Cada pessoa responde diferente. Você já tentou acompanhar os resultados por 2 semanas?',
      'Faz sentido a dúvida. O ideal é testar e ver como seu corpo responde. Tá medindo progresso de alguma forma?',
    ],
    relato: [
      'Entendo sua frustração. Muita gente passa por isso no início. O que você acha que poderia ajustar primeiro?',
      'Essa situação é mais comum do que parece. Você já considerou pedir ajuda de um profissional pra avaliar?',
      'Normal sentir isso. Adaptação leva tempo. Como você tem se sentido de energia no dia a dia?',
    ],
    debate: [
      'Boa discussão! Ambos os lados têm seus pontos. No seu caso específico, qual se encaixa melhor na rotina?',
      'Interessante ver as diferentes experiências. Qual critério você usa pra decidir o que funciona pra você?',
      'Válido. O contexto individual pesa muito. Como você mede se tá funcionando ou não?',
    ],
    duvida: [
      'Essa dúvida é super comum. Depende do seu objetivo principal. Qual é o seu foco agora?',
      'Faz sentido a confusão. Tem muito conteúdo contraditório por aí. O que você já testou até agora?',
      'Boa reflexão. A resposta varia de pessoa pra pessoa. Como você se sente com cada abordagem?',
    ],
  };

  // Se for arena específica, usar respostas customizadas
  let respostaEscolhida: string;

  if (thread.categoria === 'postura') {
    respostaEscolhida = respostasPostura[Math.floor(Math.random() * respostasPostura.length)];
  } else if (thread.categoria === 'lipedema') {
    respostaEscolhida = respostasLipedema[Math.floor(Math.random() * respostasLipedema.length)];
  } else if (thread.categoria === 'hipercifose') {
    respostaEscolhida = respostasHipercifose[Math.floor(Math.random() * respostasHipercifose.length)];
  } else if (thread.categoria === 'compressao') {
    respostaEscolhida = respostasCompressao[Math.floor(Math.random() * respostasCompressao.length)];
  } else if (thread.categoria === 'menstrual') {
    respostaEscolhida = respostasMenstrual[Math.floor(Math.random() * respostasMenstrual.length)];
  } else if (thread.categoria === 'miofascial') {
    respostaEscolhida = respostasMiofascial[Math.floor(Math.random() * respostasMiofascial.length)];
  } else if (thread.categoria === 'desvio_bacia') {
    respostaEscolhida = respostasDesvioBacia[Math.floor(Math.random() * respostasDesvioBacia.length)];
  } else if (thread.categoria === 'gluteo_medio') {
    respostaEscolhida = respostasGluteoMedio[Math.floor(Math.random() * respostasGluteoMedio.length)];
  } else {
    const respostasPossiveis = respostasIA[thread.tipo];
    respostaEscolhida = respostasPossiveis[Math.floor(Math.random() * respostasPossiveis.length)];
  }

  // Naturalizar resposta da IA
  const perfil = selecionarPerfilAleatorio();
  const opcoes = obterPerfilNaturalizacao(perfil);
  const respostaNaturalizada = naturalizarTexto(respostaEscolhida, opcoes);

  // Timestamp: 10-30 min após última resposta
  const intervaloMinutos = 10 + Math.floor(Math.random() * 20);
  const timestampIA = new Date(timestampUltimaResposta.getTime() + intervaloMinutos * 60 * 1000);

  // Criar ghost user para IA
  const ghostIA: GhostUser = {
    id: 'ia_facilitadora',
    nome: 'NutriFit Coach',
    username: 'nutrifit_coach',
    email: 'ia@nutrifitcoach.com',
    nivel: 'avancado',
    genero: 'F',
    bio: 'Time NutriFit Coach',
  };

  return {
    autor: ghostIA,
    conteudo: respostaNaturalizada,
    timestamp: timestampIA,
    tom: 'tecnico',
  };
}

// ============================================
// HELPERS
// ============================================

/**
 * Mapeia nível de usuário para perfil de naturalização
 */
function mapearNivelParaPerfil(nivel: NivelUsuario): 'emocional' | 'pratico' | 'tecnico' | 'avancado' {
  const mapeamento: Record<NivelUsuario, 'emocional' | 'pratico' | 'tecnico' | 'avancado'> = {
    iniciante: 'emocional',
    intermediario: 'pratico',
    avancado: 'tecnico',
    critico: 'avancado',
  };

  return mapeamento[nivel];
}

/**
 * Gera timestamp aleatório nos horários de pico (7-9h, 12-13:30h, 18-22h)
 */
function gerarTimestampAleatorio(baseDate?: Date): Date {
  const base = baseDate || new Date();

  // Horários de pico
  const horariosPico = [
    { inicio: 7, fim: 9 },     // Manhã
    { inicio: 12, fim: 13.5 }, // Almoço
    { inicio: 18, fim: 22 },   // Noite
  ];

  const horarioEscolhido = horariosPico[Math.floor(Math.random() * horariosPico.length)];

  // Gerar hora dentro do intervalo
  const hora = horarioEscolhido.inicio + Math.random() * (horarioEscolhido.fim - horarioEscolhido.inicio);
  const minuto = Math.floor(Math.random() * 60);

  const timestamp = new Date(base);
  timestamp.setHours(Math.floor(hora), minuto, 0, 0);

  return timestamp;
}

/**
 * Valida thread gerada
 */
export function validarThread(thread: ThreadGerada): {
  valida: boolean;
  problemas: string[];
} {
  const problemas: string[] = [];

  // Validar naturalidade do conteúdo
  const validacaoConteudo = validarNaturalidade(thread.conteudo);
  if (!validacaoConteudo.pareceHumano) {
    problemas.push(`Conteúdo não parece humano (score: ${validacaoConteudo.score})`);
  }

  // Validar quantidade de respostas
  if (thread.respostas.length < CONFIG.MIN_RESPOSTAS_POR_THREAD) {
    problemas.push(`Poucas respostas (${thread.respostas.length})`);
  }

  // Validar diversidade de autores
  const autoresUnicos = new Set(thread.respostas.map(r => r.autor.id));
  if (autoresUnicos.size < 2) {
    problemas.push('Falta diversidade de autores nas respostas');
  }

  // Validar timestamps (ordem cronológica)
  for (let i = 1; i < thread.respostas.length; i++) {
    if (thread.respostas[i].timestamp <= thread.respostas[i - 1].timestamp) {
      problemas.push('Timestamps fora de ordem');
      break;
    }
  }

  return {
    valida: problemas.length === 0,
    problemas,
  };
}

// ============================================
// GERADOR EM LOTE
// ============================================

/**
 * Gera múltiplas threads de uma vez
 */
export function gerarThreadsEmLote(
  categoria: CategoriaArena,
  quantidade: number,
  opcoes?: {
    incluirIA?: boolean;
    dataInicio?: Date;
    intervaloHoras?: number;
  }
): ThreadGerada[] {
  const {
    incluirIA = true,
    dataInicio = new Date(),
    intervaloHoras = 24,
  } = opcoes || {};

  const threads: ThreadGerada[] = [];
  let timestampBase = new Date(dataInicio);

  for (let i = 0; i < quantidade; i++) {
    // Gerar thread
    const thread = gerarThread(categoria, undefined, timestampBase);

    // Adicionar resposta da IA se configurado
    if (incluirIA && thread.respostas.length >= 3) {
      const ultimaResposta = thread.respostas[thread.respostas.length - 1];
      const respostaIA = gerarRespostaIA(thread, ultimaResposta.timestamp);

      if (respostaIA) {
        thread.respostas.push(respostaIA);
      }
    }

    // Validar
    const validacao = validarThread(thread);
    if (!validacao.valida) {
      console.warn(`[THREAD] Thread inválida:`, validacao.problemas);
      // Tenta novamente
      i--;
      continue;
    }

    threads.push(thread);

    // Avançar timestamp base
    timestampBase = new Date(timestampBase.getTime() + intervaloHoras * 60 * 60 * 1000);
  }

  return threads;
}

// ============================================
// ESTATÍSTICAS
// ============================================

/**
 * Gera estatísticas sobre threads criadas
 */
export function gerarEstatisticas(threads: ThreadGerada[]) {
  const totalThreads = threads.length;
  const totalRespostas = threads.reduce((acc, t) => acc + t.respostas.length, 0);

  const porTipo = threads.reduce((acc, t) => {
    acc[t.tipo] = (acc[t.tipo] || 0) + 1;
    return acc;
  }, {} as Record<TipoThread, number>);

  const autoresUnicos = new Set<string>();
  threads.forEach(t => {
    autoresUnicos.add(t.autor.id);
    t.respostas.forEach(r => autoresUnicos.add(r.autor.id));
  });

  const respostasComIA = threads.filter(t =>
    t.respostas.some(r => r.autor.id === 'ia_facilitadora')
  ).length;

  return {
    totalThreads,
    totalRespostas,
    mediaRespostasPorThread: (totalRespostas / totalThreads).toFixed(1),
    distribuicaoPorTipo: porTipo,
    autoresUnicos: autoresUnicos.size,
    threadsComIA: respostasComIA,
    percentualIA: `${((respostasComIA / totalThreads) * 100).toFixed(1)}%`,
  };
}

export default {
  gerarThread,
  gerarRespostaIA,
  gerarThreadsEmLote,
  validarThread,
  gerarEstatisticas,
};
