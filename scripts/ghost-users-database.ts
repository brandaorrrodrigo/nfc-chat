/**
 * BANCO DE DADOS DE GHOST USERS
 *
 * Usuários fictícios para povoamento orgânico das comunidades
 *
 * DISTRIBUIÇÃO:
 * - 60% iniciantes (inseguros, erram, perguntam muito)
 * - 25% intermediários (experiência prática, opinião formada)
 * - 10% avançados (mais conscientes, menos ativos)
 * - 5% críticos/céticos (questionam, discordam)
 */

export type NivelUsuario = 'iniciante' | 'intermediario' | 'avancado' | 'critico';

export interface GhostUser {
  id: string;
  nome: string;
  username: string;
  email: string;
  nivel: NivelUsuario;
  genero: 'M' | 'F';
  avatar?: string;
  bio?: string;
  peso?: number; // kg
  altura?: number; // cm
  objetivo?: string;
  experienciaTreino?: string; // meses
}

// ============================================
// NOMES BRASILEIROS COMUNS
// ============================================

const NOMES_MASCULINOS = [
  'João', 'Pedro', 'Lucas', 'Gabriel', 'Rafael', 'Felipe',
  'Gustavo', 'Bruno', 'Daniel', 'Fernando', 'Marcelo', 'André',
  'Carlos', 'Thiago', 'Rodrigo', 'Diego', 'Leonardo', 'Vitor',
  'Matheus', 'Henrique', 'Caio', 'Fabio', 'Igor', 'Leandro'
];

const NOMES_FEMININOS = [
  'Maria', 'Ana', 'Juliana', 'Fernanda', 'Carla', 'Paula',
  'Mariana', 'Camila', 'Beatriz', 'Leticia', 'Rafaela', 'Gabriela',
  'Tatiana', 'Bruna', 'Patricia', 'Amanda', 'Larissa', 'Jessica',
  'Renata', 'Carolina', 'Vanessa', 'Priscila', 'Sabrina', 'Luciana'
];

const SOBRENOMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira',
  'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro',
  'Martins', 'Carvalho', 'Rocha', 'Almeida', 'Lopes', 'Soares',
  'Fernandes', 'Vieira', 'Barbosa', 'Dias', 'Nascimento', 'Castro'
];

// ============================================
// SUFIXOS PARA USERNAME
// ============================================

const SUFIXOS_USERNAME = [
  'fit', 'treino', 'saude', 'sport', 'strong', 'run',
  'gym', 'life', 'shape', 'power', 'active', 'wellness',
  '', '', '', '' // Alguns sem sufixo
];

// ============================================
// OBJETIVOS COMUNS
// ============================================

const OBJETIVOS = [
  'Emagrecer',
  'Ganhar massa muscular',
  'Melhorar condicionamento',
  'Perder barriga',
  'Definir',
  'Ficar saudável',
  'Voltar a treinar',
  'Melhorar postura',
  'Aumentar força',
  'Correr melhor'
];

// ============================================
// FUNÇÃO GERADORA DE GHOST USERS
// ============================================

function gerarUsername(nome: string, sobrenome: string): string {
  const primeiroNome = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const primeiraSobrenome = sobrenome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const sufixo = SUFIXOS_USERNAME[Math.floor(Math.random() * SUFIXOS_USERNAME.length)];

  const opcoes = [
    `${primeiroNome}_${sufixo}`,
    `${primeiroNome}${primeiraSobrenome}`,
    `${primeiroNome}_${primeiraSobrenome}`,
    `${primeiroNome}${Math.floor(Math.random() * 99)}`,
  ].filter(u => u.length > 3 && u.length < 20);

  return opcoes[Math.floor(Math.random() * opcoes.length)].replace('__', '_').replace('_$', '');
}

function gerarEmail(username: string): string {
  const dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br'];
  const dominio = dominios[Math.floor(Math.random() * dominios.length)];
  return `${username}@${dominio}`;
}

function selecionarNivel(): NivelUsuario {
  const random = Math.random();
  if (random < 0.60) return 'iniciante';
  if (random < 0.85) return 'intermediario';
  if (random < 0.95) return 'avancado';
  return 'critico';
}

function gerarBio(nivel: NivelUsuario, objetivo: string): string {
  const bios = {
    iniciante: [
      `Começando agora. Objetivo: ${objetivo.toLowerCase()}.`,
      `Iniciante tentando ${objetivo.toLowerCase()}.`,
      `Voltando a treinar depois de muito tempo parado.`,
      `Novato, qualquer dica ajuda!`,
    ],
    intermediario: [
      `Treino há uns 2 anos. Foco em ${objetivo.toLowerCase()}.`,
      `Intermediário buscando ${objetivo.toLowerCase()}.`,
      `Treino regular, ainda aprendendo.`,
      `Curtindo o processo.`,
    ],
    avancado: [
      `Treino há mais de 5 anos.`,
      `Experiente em musculação.`,
      `Sempre buscando evolução.`,
      `Apaixonado por treino.`,
    ],
    critico: [
      `Questiono tudo antes de aplicar.`,
      `Baseio tudo em evidência.`,
      `Cético de modinha.`,
      `Mostrem os estudos.`,
    ],
  };

  const opcoes = bios[nivel];
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

// ============================================
// GERADOR PRINCIPAL
// ============================================

export function gerarGhostUsers(quantidade: number = 50): GhostUser[] {
  const users: GhostUser[] = [];
  const usernamesUsados = new Set<string>();

  let tentativas = 0;
  const maxTentativas = quantidade * 3;

  while (users.length < quantidade && tentativas < maxTentativas) {
    tentativas++;

    // Selecionar gênero
    const genero = Math.random() < 0.5 ? 'M' : 'F';

    // Selecionar nome
    const nome = genero === 'M'
      ? NOMES_MASCULINOS[Math.floor(Math.random() * NOMES_MASCULINOS.length)]
      : NOMES_FEMININOS[Math.floor(Math.random() * NOMES_FEMININOS.length)];

    const sobrenome = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];

    // Gerar username único
    const username = gerarUsername(nome, sobrenome);
    if (usernamesUsados.has(username)) continue;
    usernamesUsados.add(username);

    // Gerar outros dados
    const nivel = selecionarNivel();
    const objetivo = OBJETIVOS[Math.floor(Math.random() * OBJETIVOS.length)];
    const email = gerarEmail(username);

    // Dados físicos realistas (brasileiros)
    const peso = genero === 'M'
      ? 65 + Math.floor(Math.random() * 40) // 65-105kg
      : 55 + Math.floor(Math.random() * 35); // 55-90kg

    const altura = genero === 'M'
      ? 165 + Math.floor(Math.random() * 20) // 165-185cm
      : 155 + Math.floor(Math.random() * 20); // 155-175cm

    // Experiência de treino
    const experienciaMeses = {
      iniciante: Math.floor(Math.random() * 6), // 0-6 meses
      intermediario: 6 + Math.floor(Math.random() * 24), // 6-30 meses
      avancado: 30 + Math.floor(Math.random() * 60), // 30-90 meses
      critico: 12 + Math.floor(Math.random() * 48), // 12-60 meses
    };

    users.push({
      id: `ghost_${username}`,
      nome: `${nome} ${sobrenome}`,
      username,
      email,
      nivel,
      genero,
      bio: gerarBio(nivel, objetivo),
      peso,
      altura,
      objetivo,
      experienciaTreino: experienciaMeses[nivel].toString(),
    });
  }

  return users;
}

// ============================================
// GHOST USERS PRÉ-GERADOS (50 usuários)
// ============================================

export const GHOST_USERS: GhostUser[] = gerarGhostUsers(50);

// Distribuição esperada
const distribuicao = GHOST_USERS.reduce((acc, user) => {
  acc[user.nivel] = (acc[user.nivel] || 0) + 1;
  return acc;
}, {} as Record<NivelUsuario, number>);

console.log('[GHOST USERS] Distribuição gerada:');
console.log(`  Iniciantes: ${distribuicao.iniciante || 0} (meta: ~30)`);
console.log(`  Intermediários: ${distribuicao.intermediario || 0} (meta: ~12)`);
console.log(`  Avançados: ${distribuicao.avancado || 0} (meta: ~5)`);
console.log(`  Críticos: ${distribuicao.critico || 0} (meta: ~3)`);

// ============================================
// HELPERS
// ============================================

/**
 * Seleciona usuário aleatório baseado na distribuição
 */
export function selecionarGhostUserAleatorio(nivel?: NivelUsuario): GhostUser {
  if (nivel) {
    const usersPorNivel = GHOST_USERS.filter(u => u.nivel === nivel);
    return usersPorNivel[Math.floor(Math.random() * usersPorNivel.length)];
  }

  return GHOST_USERS[Math.floor(Math.random() * GHOST_USERS.length)];
}

/**
 * Seleciona múltiplos usuários únicos
 */
export function selecionarGhostUsers(quantidade: number, nivel?: NivelUsuario): GhostUser[] {
  const pool = nivel
    ? GHOST_USERS.filter(u => u.nivel === nivel)
    : GHOST_USERS;

  const selecionados = [...pool].sort(() => Math.random() - 0.5).slice(0, quantidade);
  return selecionados;
}

/**
 * Obter usuário por username
 */
export function getGhostUserByUsername(username: string): GhostUser | undefined {
  return GHOST_USERS.find(u => u.username === username);
}

export default {
  GHOST_USERS,
  gerarGhostUsers,
  selecionarGhostUserAleatorio,
  selecionarGhostUsers,
  getGhostUserByUsername,
};
