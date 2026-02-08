/**
 * Gera dados de conversas em JSON
 * Não precisa de conexão ao banco
 * Depois importa com seed-conversations.ts quando banco estiver disponível
 */

import * as fs from 'fs';
import * as path from 'path';

// Usuarios simulados (22 personas)
const SIMULATED_USERS = [
  { id: 'user_sim_001', name: 'Ana Paula', email: 'ana.paula@fitcoach.local' },
  { id: 'user_sim_002', name: 'Juliana Santos', email: 'juliana.santos@fitcoach.local' },
  { id: 'user_sim_003', name: 'Mariana Costa', email: 'mariana.costa@fitcoach.local' },
  { id: 'user_sim_004', name: 'Carlos Eduardo', email: 'carlos.eduardo@fitcoach.local' },
  { id: 'user_sim_005', name: 'Rafael Lima', email: 'rafael.lima@fitcoach.local' },
  { id: 'user_sim_006', name: 'Patricia Oliveira', email: 'patricia.oliveira@fitcoach.local' },
  { id: 'user_sim_007', name: 'Fernanda Alves', email: 'fernanda.alves@fitcoach.local' },
  { id: 'user_sim_008', name: 'Camila Ribeiro', email: 'camila.ribeiro@fitcoach.local' },
  { id: 'user_sim_009', name: 'Bruno Ferreira', email: 'bruno.ferreira@fitcoach.local' },
  { id: 'user_sim_010', name: 'Thiago Martins', email: 'thiago.martins@fitcoach.local' },
  { id: 'user_sim_011', name: 'Lucas Souza', email: 'lucas.souza@fitcoach.local' },
  { id: 'user_sim_012', name: 'Roberta Mendes', email: 'roberta.mendes@fitcoach.local' },
  { id: 'user_sim_013', name: 'Amanda Silva', email: 'amanda.silva@fitcoach.local' },
  { id: 'user_sim_014', name: 'Rodrigo Andrade', email: 'rodrigo.andrade@fitcoach.local' },
  { id: 'user_sim_015', name: 'Gustavo Rocha', email: 'gustavo.rocha@fitcoach.local' },
  { id: 'user_sim_016', name: 'Daniela Correia', email: 'daniela.correia@fitcoach.local' },
  { id: 'user_sim_017', name: 'Renata Moraes', email: 'renata.moraes@fitcoach.local' },
  { id: 'user_sim_018', name: 'Marcelo Pereira', email: 'marcelo.pereira@fitcoach.local' },
  { id: 'user_sim_019', name: 'Joao Carlos', email: 'joao.carlos@fitcoach.local' },
  { id: 'user_sim_020', name: 'Beatriz Gomes', email: 'beatriz.gomes@fitcoach.local' },
  { id: 'user_sim_021', name: 'Isabella Sousa', email: 'isabella.sousa@fitcoach.local' },
  { id: 'user_sim_022', name: 'Victor Almeida', email: 'victor.almeida@fitcoach.local' },
];

const TOPIC_TEMPLATES: Record<string, string[]> = {
  postura: [
    'Barriga saliente mesmo magro - como corrigir?',
    'Ombros desnivelados - afeta aparencia?',
    'Gluteo caido: e postura ou treino?',
    'Como corrigir cifose visual',
    'Pelve anteriorizada e barriga',
    'Lordose excessiva: treino ou genetica?',
  ],
  dor: [
    'Dor lombar ao acordar - causas?',
    'Joelho estrala ao agachar',
    'Dor no ombro ao levantar braco',
    'Formigamento nas maos durante treino',
    'Dor ciatica sem diagnostico de hernia',
    'Dor cervical e trabalho em casa',
  ],
  avaliacao: [
    'Um lado mais forte que outro - e problema?',
    'Assimetria de ombros: impacto funcional?',
    'Diferença entre pernas - preocupante?',
    'Rotação pelvica identificada na avaliacao',
    'Valgo de joelho - preciso corrigir?',
    'Como avaliar propria mobilidade',
  ],
  treino: [
    'Estagnacao no agachamento - como avancar?',
    'Como aumentar carga no supino',
    'Periodizacao para ganho de hipertrofia',
    'Treino A/B ou ABC? Qual escolher?',
    'Falha muscular: sempre necessaria?',
    'Volume ideal por grupo muscular',
  ],
  nutricao: [
    'Proteina: quanto e realmente suficiente?',
    'Carboidrato a noite engorda?',
    'Jejum intermitente: funciona mesmo?',
    'Refeeds: como fazer corretamente?',
    'Dieta flexivel vs rigida: qual escolher?',
    'Suplementos essenciais na musculacao',
  ],
  mobilidade: [
    'Mobilidade de quadril limitada',
    'Ombro travado: como solucionar?',
    'Flexibilidade de isquiotibial',
    'Mobilidade de tornozelo para agachamento',
    'Amplitude de movimento reduzida',
    'Alongamento estatico vs dinamico',
  ],
  default: [
    'Qual sua experiencia nessa area?',
    'Alguem pode ajudar com essa duvida?',
    'Vou compartilhar minha historia',
    'Como voces lidam com isso?',
    'Procuro orientacao',
  ],
};

const COMMENT_RESPONSES = [
  'Tambem tenho isso! Vou testar a dica.',
  'Passei por situacao similar. No meu caso foi diferente.',
  'Otima explicacao! Muito util.',
  'Alguem ja fez isso? Queria saber resultados.',
  'Estou na mesma situacao. Vou tentar.',
  'Fez diferença grande comigo.',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getTemplateForArena(arenaSlug: string): string[] {
  const slug = arenaSlug.toLowerCase();

  if (slug.includes('postura') || slug.includes('estetica')) return TOPIC_TEMPLATES.postura;
  if (slug.includes('dor') || slug.includes('funcao')) return TOPIC_TEMPLATES.dor;
  if (slug.includes('avalia') || slug.includes('assimetria')) return TOPIC_TEMPLATES.avaliacao;
  if (slug.includes('treino') || slug.includes('performance')) return TOPIC_TEMPLATES.treino;
  if (slug.includes('nutri') || slug.includes('dieta')) return TOPIC_TEMPLATES.nutricao;
  if (slug.includes('mobilidade') || slug.includes('flexibilidade')) return TOPIC_TEMPLATES.mobilidade;

  return TOPIC_TEMPLATES.default;
}

function generateConversationData() {
  console.log('\nGerando dados de conversas...\n');

  const mockArenas = [
    { id: 'arena_1', slug: 'postura-estetica', name: 'Postura & Estetica' },
    { id: 'arena_2', slug: 'dor-funcao', name: 'Dor & Funcao' },
    { id: 'arena_3', slug: 'avaliacao-biometrica', name: 'Avaliacao Biometrica' },
    { id: 'arena_4', slug: 'treino-performance', name: 'Treino & Performance' },
    { id: 'arena_5', slug: 'nutricao', name: 'Nutricao' },
    { id: 'arena_6', slug: 'mobilidade', name: 'Mobilidade' },
  ];

  const data: any = {
    usuarios: SIMULATED_USERS,
    conversas: [],
    estatisticas: {
      total_usuarios: SIMULATED_USERS.length,
      total_arenas: mockArenas.length,
      total_posts: 0,
      total_comentarios: 0,
    },
  };

  for (const arena of mockArenas) {
    const topics = getTemplateForArena(arena.slug);
    const arenaData = {
      arena_id: arena.id,
      arena_slug: arena.slug,
      arena_name: arena.name,
      threads: [] as any[],
    };

    for (let t = 0; t < 7; t++) {
      // 7 threads por arena = ~35 posts
      const topic = getRandomElement(topics);
      const initialUser = getRandomElement(SIMULATED_USERS);

      const thread = {
        topico: topic,
        usuario_original: initialUser.name,
        usuario_original_id: initialUser.id,
        posts: [
          {
            tipo: 'post_principal',
            usuario: initialUser.name,
            usuario_id: initialUser.id,
            conteudo: `${topic}\n\nTenho essa duvida ha algum tempo.`,
          },
        ],
      };

      // Adicionar comentarios
      const responder = getRandomElement(SIMULATED_USERS);
      thread.posts.push({
        tipo: 'comentario_resposta',
        usuario: responder.name,
        usuario_id: responder.id,
        conteudo: 'Otima pergunta! Vou compartilhar minha experiencia.',
      });

      if (Math.random() > 0.4) {
        thread.posts.push({
          tipo: 'comentario_followup',
          usuario: initialUser.name,
          usuario_id: initialUser.id,
          conteudo: 'Obrigado! Isso ajuda muito!',
        });
      }

      const comentador = getRandomElement(SIMULATED_USERS);
      if (comentador.id !== initialUser.id) {
        thread.posts.push({
          tipo: 'comentario_outro',
          usuario: comentador.name,
          usuario_id: comentador.id,
          conteudo: getRandomElement(COMMENT_RESPONSES),
        });
      }

      arenaData.threads.push(thread);
      data.estatisticas.total_posts += thread.posts.length;
      data.estatisticas.total_comentarios += thread.posts.length - 1;
    }

    data.conversas.push(arenaData);
  }

  return data;
}

// Gerar e salvar dados
const conversationData = generateConversationData();

const outputDir = path.join(__dirname, '..', 'seed-data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, 'conversations.json');

fs.writeFileSync(outputFile, JSON.stringify(conversationData, null, 2), 'utf-8');

console.log(`
======================================
Dados Gerados com Sucesso!
======================================

Arquivo: ${outputFile}

Estatisticas:
  - Usuarios: ${conversationData.estatisticas.total_usuarios}
  - Arenas: ${conversationData.estatisticas.total_arenas}
  - Posts: ${conversationData.estatisticas.total_posts}
  - Comentarios: ${conversationData.estatisticas.total_comentarios}
  - Total de Interacoes: ${conversationData.estatisticas.total_posts + conversationData.estatisticas.total_comentarios}

Proximos passos:
1. Aguarde o banco ficar acessivel
2. Execute: npm run seed:conversations
3. Os dados serao importados automaticamente

Ou importe manualmente:
  cat seed-data/conversations.json
`);
