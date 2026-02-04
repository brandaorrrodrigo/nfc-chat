/**
 * TEMPLATES ESPECÍFICOS: ARENA BARRIGA POCHETE
 *
 * Arena focada em:
 * - Barriga projetada / pochete
 * - Anteversão pélvica
 * - Postura abdominal
 * - Estética sem emagrecer
 * - Biomecânica básica
 *
 * SEO: barriga projetada, anteversão pélvica, postura abdominal
 */

import type { ThreadTemplate, RespostaTemplate } from '../thread-templates';

// ============================================
// CONFIGURAÇÃO DA ARENA
// ============================================

export const ARENA_CONFIG = {
  slug: 'barriga-pochete-postura',
  nome: 'Barriga "Pochete": Gordura ou Postura?',
  categoria: 'postura' as const,
  descricao: 'Aqui a estética começa na postura. Nem tudo que parece gordura é gordura.',
  seo: {
    keywords: [
      'barriga projetada',
      'anteversão pélvica',
      'postura abdominal',
      'estética sem emagrecer',
      'barriga pochete',
      'lombar anterior',
      'core fraco',
    ],
    intencao: 'educacional + diagnóstico prático',
  },
};

// ============================================
// THREADS PRINCIPAIS
// ============================================

export const THREADS_BARRIGA_POSTURA: ThreadTemplate[] = [
  // THREAD PRINCIPAL (do exemplo)
  {
    tipo: 'pergunta',
    categoria: 'postura' as any,
    titulo: 'barriga que nao sai mesmo emagrecendo',
    conteudo: `faco reeducacao alimentar ha meses, emagreci no corpo todo menos na barriga.
ela fica projetada pra frente tipo pochete. isso é gordura resistente ou outra coisa?
ja tentei de tudo`,
    nivelAutor: 'iniciante',
  },

  // VARIAÇÕES INICIANTES
  {
    tipo: 'duvida',
    categoria: 'postura' as any,
    titulo: 'barriga so de um lado?',
    conteudo: `gente isso é normal? minha barriga fica mais projetada de um lado.
parece q meu corpo é torto. alguem ja teve isso?`,
    nivelAutor: 'iniciante',
  },
  {
    tipo: 'relato',
    categoria: 'postura' as any,
    titulo: 'descobri q era postura nao gordura',
    conteudo: `passei anos fazendo dieta e treino abdominal achando q minha barriga
era gordura. ai descobri q era anteversao pelvica. quando corrijo a postura a barriga some`,
    nivelAutor: 'iniciante',
  },
  {
    tipo: 'pergunta',
    categoria: 'postura' as any,
    titulo: 'exercicio de abdomen resolve?',
    conteudo: `malhei abdomen por 6 meses direto mas a barriga continua projetada.
sera q to fazendo errado ou nao é isso q resolve?`,
    nivelAutor: 'iniciante',
  },
  {
    tipo: 'duvida',
    categoria: 'postura' as any,
    titulo: 'ficar muito tempo sentado piora?',
    conteudo: `trabalho 8h sentado e sinto q minha barriga fica cada vez mais pra frente.
tem relacao ou to viajando?`,
    nivelAutor: 'iniciante',
  },

  // INTERMEDIÁRIOS
  {
    tipo: 'debate',
    categoria: 'postura' as any,
    titulo: 'anteversao pelvica da pra corrigir sozinho?',
    conteudo: `vi videos no youtube ensinando a corrigir anteversao pelvica em casa.
funciona mesmo ou precisa de fisio? qual experiencia de vcs?`,
    nivelAutor: 'intermediario',
  },
  {
    tipo: 'relato',
    categoria: 'postura' as any,
    titulo: 'forcei core e piorou',
    conteudo: `comecei a fazer prancha todo dia pra fortalecer o core mas sinto q
a lombar ta doendo mais. sera q to fazendo errado?`,
    nivelAutor: 'intermediario',
  },
  {
    tipo: 'pergunta',
    categoria: 'postura' as any,
    titulo: 'glúteo fraco causa barriga saliente?',
    conteudo: `li q gluteo fraco deixa a pelve anterior e projeta a barriga.
faz sentido? alguem corrigiu treinando glúteo?`,
    nivelAutor: 'intermediario',
  },
  {
    tipo: 'debate',
    categoria: 'postura' as any,
    titulo: 'treino de postura vs treino de hipertrofia',
    conteudo: `qual priorizar? to querendo ganhar massa mas tbm corrigir a postura.
da pra fazer os dois ao mesmo tempo?`,
    nivelAutor: 'intermediario',
  },

  // AVANÇADOS/CRÍTICOS
  {
    tipo: 'debate',
    categoria: 'postura' as any,
    titulo: 'lordose lombar é sempre ruim?',
    conteudo: `tem gente q fala q toda lordose é problema. mas nao é uma curvatura
natural da coluna? qual o limite entre normal e patologico?`,
    nivelAutor: 'critico',
  },
  {
    tipo: 'pergunta',
    categoria: 'postura' as any,
    titulo: 'diástase ou anteversao?',
    conteudo: `como diferenciar? tenho barriga projetada pos-gravidez mas nao sei
se é diastase abdominal ou so postura ruim`,
    nivelAutor: 'intermediario',
  },
  {
    tipo: 'relato',
    categoria: 'postura' as any,
    titulo: 'pilates mudou tudo',
    conteudo: `depois de anos tentando musculacao comecei pilates e em 3 meses
a barriga sumiu sem emagrecer um kg. foi so ativacao de core msm`,
    nivelAutor: 'intermediario',
  },
];

// ============================================
// RESPOSTAS HUMANAS ESPECÍFICAS
// ============================================

export const RESPOSTAS_BARRIGA_POSTURA: RespostaTemplate[] = [
  // RELATOS DE DESCOBERTA
  {
    conteudo: 'eu era magra e tinha barriga. descobri anteversao pelvica',
    nivel: 'iniciante',
    tom: 'relato',
  },
  {
    conteudo: 'no meu caso era postura + horas sentada. ajustei e mudou muito',
    nivel: 'intermediario',
    tom: 'relato',
  },
  {
    conteudo: 'treinar abdomen isolado nao resolveu nada pra mim',
    nivel: 'iniciante',
    tom: 'relato',
  },
  {
    conteudo: 'forcei muito core e esqueci do gluteo. erro classico',
    nivel: 'intermediario',
    tom: 'relato',
  },

  // RESPOSTAS PRÁTICAS
  {
    conteudo: 'tenta ficar em pe e encaixar a pelve. se a barriga some é postura',
    nivel: 'intermediario',
    tom: 'pratico',
  },
  {
    conteudo: 'comeca com exercicios de ativacao de transverso. prancha vem depois',
    nivel: 'intermediario',
    tom: 'pratico',
  },
  {
    conteudo: 'fortalece gluteo e posterior de coxa. muda a inclinacao da pelve',
    nivel: 'avancado',
    tom: 'pratico',
  },
  {
    conteudo: 'pilates ou RPG resolve mais q musculacao nesse caso',
    nivel: 'intermediario',
    tom: 'pratico',
  },

  // APOIO
  {
    conteudo: 'cara passei pela mesma coisa. frustrante demais',
    nivel: 'iniciante',
    tom: 'apoio',
  },
  {
    conteudo: 'normal. a maioria acha q é so gordura mas tem mt coisa envolvida',
    nivel: 'intermediario',
    tom: 'apoio',
  },
  {
    conteudo: 'nao é frescura nao. anteversao realmente projeta a barriga',
    nivel: 'intermediario',
    tom: 'apoio',
  },

  // DISCORDÂNCIA/CETICISMO
  {
    conteudo: 'acho q na maioria dos casos ainda é gordura localizada mesmo',
    nivel: 'critico',
    tom: 'discordancia',
  },
  {
    conteudo: 'depende. tem gente q tem anteversao e nao tem barriga. é individual',
    nivel: 'critico',
    tom: 'discordancia',
  },

  // TÉCNICO
  {
    conteudo: 'anteversao pelvica + core fraco + respiracao ruim = barriga projetada',
    nivel: 'avancado',
    tom: 'tecnico',
  },
  {
    conteudo: 'o problema nao é a lordose em si mas a compensacao muscular',
    nivel: 'avancado',
    tom: 'tecnico',
  },
  {
    conteudo: 'diastase abdominal é outra coisa. precisa avaliar com fisio',
    nivel: 'avancado',
    tom: 'tecnico',
  },
];

// ============================================
// RESPOSTAS DA IA (FOUNDER/FACILITADORA)
// ============================================

export const RESPOSTAS_IA_BARRIGA_POSTURA = [
  // RESPOSTA PRINCIPAL (do exemplo)
  `Excelente ponto. A anteversao pelvica projeta o abdomen mesmo com baixo percentual de gordura.
Pergunta para o grupo: alguem ja notou a barriga "sumir" quando ajusta a posicao da pelve em pe?`,

  // OUTRAS VARIAÇÕES
  `Interessante. Muita gente treina abdomen sem ativar o transverso do abdomen, que é o musculo
responsavel por "segurar" a barriga. Como vcs sentem a ativacao dele?`,

  `Boa discussao. A postura sentada prolongada realmente desativa o core e aumenta a anteversao.
Alguem aqui trabalha remoto e ja percebeu mudanca na postura ao longo do dia?`,

  `Ponto importante. Gluteo fraco é uma das causas mais comuns de anteversao pelvica.
Quem aqui ja fortaleceu gluteo e notou diferenca na barriga?`,

  `Faz sentido a duvida. Lordose lombar é natural, mas o excesso (hiperlordose) projeta
a barriga. Como vcs avaliam se a lordose de vcs ta dentro do normal?`,

  `Concordo que o caso pos-gravidez pode envolver diastase. Isso requer avaliacao profissional.
Alguem ja passou por avaliacao de diastase? Como foi?`,

  `Otimo relato sobre pilates. A diferenca é que pilates trabalha estabilizacao antes de
forca bruta. O que funcionou melhor pra vcs: pilates, RPG ou musculacao?`,
];

// ============================================
// PERGUNTAS ABERTAS FINAIS
// ============================================

export const PERGUNTAS_FINAIS_BARRIGA_POSTURA = [
  'O que muda mais sua barriga: emagrecer ou alinhar a postura?',
  'Voce ja conseguiu "sumir" a barriga so ajustando a pelve?',
  'Qual exercicio fez mais diferenca na sua postura abdominal?',
  'Voce descobriu isso sozinho ou precisou de profissional?',
  'Como voce sabe se sua barriga é gordura ou postura?',
  'Trabalhar sentado piorou sua barriga? O que voce faz pra compensar?',
];

// ============================================
// EXPORTS
// ============================================

export default {
  ARENA_CONFIG,
  THREADS_BARRIGA_POSTURA,
  RESPOSTAS_BARRIGA_POSTURA,
  RESPOSTAS_IA_BARRIGA_POSTURA,
  PERGUNTAS_FINAIS_BARRIGA_POSTURA,
};
