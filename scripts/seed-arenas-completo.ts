/**
 * ═══════════════════════════════════════════════════════════════
 * SEED COMPLETO DAS ARENAS - POPULAR COM CONVERSAS REAIS
 * ═══════════════════════════════════════════════════════════════
 *
 * Popula TODAS as 36 arenas com 30-40 conversas cada
 * IA intermediando e facilitando discussões
 * Usuários simulados realistas
 *
 * PRESERVA os 74 posts existentes!
 */

import { PrismaClient } from '../lib/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════
// USUÁRIOS SIMULADOS
// ═══════════════════════════════════════════════════════════════

const MOCK_USERS = [
  { name: 'Ana Silva', email: 'ana.silva@mock.com', bio: 'Nutricionista e entusiasta de vida saudável' },
  { name: 'Carlos Souza', email: 'carlos.souza@mock.com', bio: 'Personal trainer e coach de performance' },
  { name: 'Maria Santos', email: 'maria.santos@mock.com', bio: 'Estudante de nutrição e atleta amadora' },
  { name: 'João Lima', email: 'joao.lima@mock.com', bio: 'Crossfitter apaixonado por biomecânica' },
  { name: 'Paula Mendes', email: 'paula.mendes@mock.com', bio: 'Mãe de 2, em busca de qualidade de vida' },
  { name: 'Roberto Costa', email: 'roberto.costa@mock.com', bio: 'Médico ortopedista e praticante de musculação' },
  { name: 'Juliana Rocha', email: 'juliana.rocha@mock.com', bio: 'Fisioterapeuta especializada em reabilitação' },
  { name: 'Pedro Alves', email: 'pedro.alves@mock.com', bio: 'Engenheiro e corredor de longa distância' },
  { name: 'Fernanda Dias', email: 'fernanda.dias@mock.com', bio: 'Professora de yoga e meditação' },
  { name: 'Lucas Martins', email: 'lucas.martins@mock.com', bio: 'Estudante de educação física' },
  { name: 'Camila Freitas', email: 'camila.freitas@mock.com', bio: 'Nutricionista esportiva' },
  { name: 'Ricardo Nunes', email: 'ricardo.nunes@mock.com', bio: 'Bodybuilder natural' },
  { name: 'Tatiana Gomes', email: 'tatiana.gomes@mock.com', bio: 'Instrutora de pilates' },
  { name: 'Bruno Carvalho', email: 'bruno.carvalho@mock.com', bio: 'Triatleta amador' },
  { name: 'Amanda Pires', email: 'amanda.pires@mock.com', bio: 'Blogueira fitness e mãe fit' },
  { name: 'Felipe Ramos', email: 'felipe.ramos@mock.com', bio: 'Preparador físico de atletas' },
  { name: 'Renata Moura', email: 'renata.moura@mock.com', bio: 'Dançarina e professora de zumba' },
  { name: 'Thiago Barros', email: 'thiago.barros@mock.com', bio: 'Fisiculturista em off-season' },
  { name: 'Larissa Campos', email: 'larissa.campos@mock.com', bio: 'Estudante de biomedicina e fitness' },
  { name: 'Gustavo Pereira', email: 'gustavo.pereira@mock.com', bio: 'Treinador funcional e crossfit' }
];

// ═══════════════════════════════════════════════════════════════
// TEMPLATES DE CONVERSAS POR CATEGORIA
// ═══════════════════════════════════════════════════════════════

const CONVERSATION_TEMPLATES = {
  NUTRICAO_DIETAS: [
    {
      user: 'Ana Silva',
      content: 'Comecei a dieta cetogênica há 2 semanas. Já perdi 3kg mas estou sentindo muita fadiga nos treinos. É normal?'
    },
    {
      ia: true,
      content: 'A fadiga inicial na cetogênica é comum (keto flu). Seu corpo está se adaptando a usar gordura como energia. Quanto tempo você deixa entre a última refeição e o treino? E você está suplementando eletrólitos?'
    },
    {
      user: 'Carlos Souza',
      content: 'Ana, passei por isso também. Aumentei sódio, potássio e magnésio. Melhorou muito em 1 semana.'
    },
    {
      user: 'Maria Santos',
      content: 'Eu faço low carb, não keto. Mantenho 50-80g de carbo nos dias de treino pesado. Funciona bem!'
    }
  ],
  TREINO_EXERCICIOS: [
    {
      user: 'João Lima',
      content: 'Meu agachamento travou em 120kg há 3 meses. Já mudei programa 2x e nada. Dicas?'
    },
    {
      ia: true,
      content: 'Platô de 3 meses merece investigação detalhada. Vamos por partes: 1) Como está sua progressão (micro ou macro)? 2) Volume semanal total de quadríceps? 3) Recuperação (sono, estresse, alimentação)?'
    },
    {
      user: 'Carlos Souza',
      content: 'João, você está fazendo acessórios? Leg press, búlgaro, etc? Às vezes o problema não é o agachamento em si.'
    },
    {
      user: 'Ricardo Nunes',
      content: 'Pode ser técnica também. Você já filmou para ver se não tem compensação? Eu descobri que meu glúteo não ativava direito.'
    }
  ],
  SAUDE_CONDICOES_CLINICAS: [
    {
      user: 'Paula Mendes',
      content: 'Tenho lipedema em estágio 2. Minha endócrino liberou musculação, mas tenho medo de piorar com sobrecarga.'
    },
    {
      ia: true,
      content: 'Lipedema + musculação pode ser benéfico se feito corretamente. A chave é evitar exercícios de alto impacto e inflamatórios. Você já foi avaliada por um fisioterapeuta especializado em lipedema? Eles podem criar protocolo específico.'
    },
    {
      user: 'Juliana Rocha',
      content: 'Paula, sou fisio. No lipedema, priorizamos exercícios aquáticos, bike, e musculação com foco em hipertrofia controlada. Evitamos HIIT e pliométricos que aumentam inflamação.'
    },
    {
      user: 'Roberto Costa',
      content: 'Como médico, concordo com a Juliana. E não esqueça: drenagem linfática + compressão são essenciais no protocolo.'
    }
  ],
  BIOMECANICA_NFV: [
    {
      user: 'Thiago Barros',
      content: 'Meu supino está travando no meio da trajetória. Sinto que o tríceps desiste antes do peitoral cansar.'
    },
    {
      ia: true,
      content: 'Interessante. Isso pode indicar: 1) Ponto de estagnação (sticking point) por desvantagem mecânica, ou 2) Tríceps realmente mais fraco. Você consegue fazer supino fechado ou francês com que carga? E qual a largura da pegada no supino?'
    },
    {
      user: 'Felipe Ramos',
      content: 'Thiago, tenta fazer mais trabalho específico de tríceps ANTES do supino. Tipo pré-exaustão reversa. Funciona para alguns atletas.'
    },
    {
      user: 'João Lima',
      content: 'Ou pode ser questão de timing neural. Às vezes o cérebro não recruta as fibras na ordem certa. Já tentou supino com pausa?'
    }
  ],
  RECEITAS_ALIMENTACAO: [
    {
      user: 'Fernanda Dias',
      content: 'Fiz um bolo fit de banana com aveia e whey. Ficou INCRÍVEL! 30g de proteína por fatia. Alguém quer a receita?'
    },
    {
      ia: true,
      content: 'Ótima iniciativa Fernanda! Compartilhar receitas fit ajuda muito a comunidade. Pode postar: ingredientes, modo de preparo e macros por porção? 👨‍🍳'
    },
    {
      user: 'Amanda Pires',
      content: 'EU QUERO! Meus filhos amam bolo e seria perfeito para o lanche deles.'
    },
    {
      user: 'Camila Freitas',
      content: 'Fernanda, você usou whey de que sabor? E ficou seco ou úmido?'
    }
  ],
  COMUNIDADES_LIVRES: [
    {
      user: 'Lucas Martins',
      content: 'Estou pensando em fazer minhas primeiras fotos de progresso profissionais. Vale a pena contratar fotógrafo ou celular bom resolve?'
    },
    {
      ia: true,
      content: 'Depende do objetivo! Para acompanhamento pessoal, celular com boa luz natural funciona bem. Para redes sociais/portfólio, fotógrafo especializado faz diferença no resultado. Qual seu objetivo principal?'
    },
    {
      user: 'Amanda Pires',
      content: 'Eu faço com celular mesmo. O importante é consistência: mesma luz, mesmo horário, mesma pose. Assim dá pra comparar real.'
    },
    {
      user: 'Ricardo Nunes',
      content: 'Profissional vale MUITO a pena se você compete ou quer monetizar. A qualidade é outra coisa. Mas para progresso pessoal, Lucas, celular resolve sim.'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '═'.repeat(80));
  console.log('🌱 SEED COMPLETO DAS ARENAS');
  console.log('═'.repeat(80) + '\n');

  // ═══════════════════════════════════════════════════════════════
  // PASSO 1: Criar/Verificar Usuários Mock
  // ═══════════════════════════════════════════════════════════════

  console.log('👥 PASSO 1: Criando usuários simulados...\n');

  const createdUsers: any[] = [];

  for (const mockUser of MOCK_USERS) {
    let user = await prisma.user.findUnique({
      where: { email: mockUser.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: mockUser.email,
          name: mockUser.name,
          password: 'mock-password-hash', // Não será usado para login
          role: 'USER'
        }
      });
      console.log(`   ✓ Criado: ${user.name}`);
    } else {
      console.log(`   → Já existe: ${user.name}`);
    }

    createdUsers.push(user);
  }

  console.log(`\n✅ ${createdUsers.length} usuários prontos\n`);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 2: Buscar Arenas
  // ═══════════════════════════════════════════════════════════════

  console.log('🏟️  PASSO 2: Buscando arenas...\n');

  const arenas = await prisma.arena.findMany({
    include: {
      posts: {
        where: { isDeleted: false }
      }
    }
  });

  console.log(`✅ ${arenas.length} arenas encontradas\n`);

  // ═══════════════════════════════════════════════════════════════
  // PASSO 3: Popular cada arena
  // ═══════════════════════════════════════════════════════════════

  console.log('💬 PASSO 3: Populando arenas com conversas...\n');
  console.log('─'.repeat(80) + '\n');

  let totalPostsCreated = 0;
  let totalCommentsCreated = 0;

  for (const arena of arenas) {
    const currentPosts = arena.posts.length;
    const postsNeeded = Math.max(30 - currentPosts, 0);

    if (postsNeeded === 0) {
      console.log(`✓ ${arena.name}: Já tem ${currentPosts} posts (ok)`);
      continue;
    }

    console.log(`🌱 ${arena.name}:`);
    console.log(`   Atual: ${currentPosts} posts`);
    console.log(`   Meta: 30 posts`);
    console.log(`   Criando: ${postsNeeded} posts\n`);

    // Selecionar template baseado na categoria
    const templates = CONVERSATION_TEMPLATES[arena.categoria] || CONVERSATION_TEMPLATES.COMUNIDADES_LIVRES;

    // Criar posts
    for (let i = 0; i < postsNeeded; i++) {
      // Alternar entre usuários e IA
      const useIA = i % 4 === 0; // 1 de cada 4 posts é da IA

      if (useIA) {
        // Post da IA
        const iaTemplate = templates.find(t => t.ia);
        const content = iaTemplate?.content || 'O que vocês acham sobre este tema?';

        const post = await prisma.post.create({
          data: {
            arenaId: arena.id,
            userId: createdUsers[0].id, // User padrão para IA
            content: content,
            isAIResponse: true,
            avatarInitialsColor: '#8b5cf6'
          }
        });

        totalPostsCreated++;
      } else {
        // Post de usuário
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const userTemplate = templates.filter(t => !t.ia)[i % templates.filter(t => !t.ia).length];
        const content = userTemplate?.content || `Discussão interessante sobre ${arena.name}`;

        const post = await prisma.post.create({
          data: {
            arenaId: arena.id,
            userId: randomUser.id,
            content: content,
            isAIResponse: false
          }
        });

        totalPostsCreated++;

        // 50% de chance de ter comentários
        if (Math.random() > 0.5) {
          const numComments = Math.floor(Math.random() * 3) + 1; // 1-3 comentários

          for (let c = 0; c < numComments; c++) {
            const commentUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const commentContent = `Concordo! ${['Muito bom', 'Ótimo ponto', 'Excelente', 'Isso mesmo'][Math.floor(Math.random() * 4)]}`;

            await prisma.comment.create({
              data: {
                postId: post.id,
                userId: commentUser.id,
                content: commentContent
              }
            });

            totalCommentsCreated++;
          }
        }
      }

      // Progress
      if ((i + 1) % 10 === 0) {
        console.log(`   → ${i + 1}/${postsNeeded} posts criados...`);
      }
    }

    console.log(`   ✅ Completo: ${postsNeeded} posts criados\n`);
  }

  console.log('─'.repeat(80) + '\n');

  // ═══════════════════════════════════════════════════════════════
  // PASSO 4: Atualizar Contadores
  // ═══════════════════════════════════════════════════════════════

  console.log('📊 PASSO 4: Atualizando contadores...\n');

  for (const arena of arenas) {
    const realPosts = await prisma.post.count({
      where: {
        arenaId: arena.id,
        isDeleted: false
      }
    });

    const realComments = await prisma.comment.count({
      where: {
        post: {
          arenaId: arena.id
        },
        isDeleted: false
      }
    });

    const uniqueUsers = await prisma.post.findMany({
      where: {
        arenaId: arena.id,
        isDeleted: false
      },
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    await prisma.arena.update({
      where: { id: arena.id },
      data: {
        totalPosts: realPosts,
        totalComments: realComments,
        dailyActiveUsers: uniqueUsers.length
      }
    });
  }

  console.log('✅ Contadores atualizados\n');

  // ═══════════════════════════════════════════════════════════════
  // PASSO 5: Relatório Final
  // ═══════════════════════════════════════════════════════════════

  console.log('═'.repeat(80));
  console.log('📊 RELATÓRIO FINAL');
  console.log('═'.repeat(80) + '\n');

  console.log(`✅ Posts criados: ${totalPostsCreated}`);
  console.log(`✅ Comentários criados: ${totalCommentsCreated}`);
  console.log(`✅ Total de interações: ${totalPostsCreated + totalCommentsCreated}\n`);

  // Verificar situação final
  const finalStats = await prisma.arena.findMany({
    select: {
      name: true,
      totalPosts: true,
      totalComments: true
    }
  });

  console.log('📋 Situação final das arenas:\n');

  for (const arena of finalStats) {
    console.log(`   ${arena.name}: ${arena.totalPosts} posts, ${arena.totalComments} comentários`);
  }

  console.log('\n' + '═'.repeat(80));
  console.log('🎉 SEED COMPLETO!');
  console.log('═'.repeat(80) + '\n');
}

main()
  .catch((error) => {
    console.error('\n❌ ERRO:\n', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
