/**
 * Popula todas as 36 arenas com conversas realistas
 * ~10-15 posts por arena = ~400+ posts total
 * ~2-3 comentários por post = ~1000+ comentários
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('Loading .env.local...');
  dotenv.config({ path: envLocalPath });
}

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

// Tópicos e conversas por arena
const ARENA_CONVERSATIONS: { [key: string]: { posts: Array<{ user: string; content: string }> } } = {
  'cetogena-intermitente': {
    posts: [
      { user: 'Ana Paula', content: 'Estou na keto há 3 meses e perdi 8kg! Mas sinto muito cansaço no treino. Como vocês lidam com isso?' },
      { user: 'Carlos Eduardo', content: 'Tenho 5 anos em IF (jejum intermitente de 16/8) e vici! Economia de tempo e economia de dinheiro. Top demais!' },
      { user: 'Patricia Oliveira', content: 'Qual intervalo de jejum vocês fazem? Estou começando com 12/12, muito insegura ainda.' },
    ]
  },
  'vegana-vegetariana': {
    posts: [
      { user: 'Mariana Costa', content: 'Sou vegetariana há 10 anos. Como consigo 120g de proteína diária sem carne?' },
      { user: 'Fernanda Alves', content: 'Tofu, tempeh, seitan, lentilha e ovos! Fácil! Meus macros ficam sempre balanceados.' },
      { user: 'Rafael Lima', content: 'Algum vegetariano aqui que compete em musculação?' },
    ]
  },
  'suplementos-dosagem': {
    posts: [
      { user: 'Thiago Martins', content: 'Qual marca de creatina vocês recomendam? Monohidratada mesmo é a melhor?' },
      { user: 'Lucas Souza', content: 'Creatina monohidratada tem 20 anos de pesquisa! Custo-benefício imbatível. 5g/dia pronto.' },
      { user: 'Roberta Mendes', content: 'Pré-treino causa dependência? Estou com medo de ficar viciada...' },
    ]
  },
  'macros-micronutrientes': {
    posts: [
      { user: 'Amanda Silva', content: 'Como calcular meu TDEE? Sou sedentária, 65kg, 165cm.' },
      { user: 'Rodrigo Andrade', content: 'Use a fórmula de Mifflin-St Jeor. Pega seu peso em kg, altura em cm, idade em anos.' },
      { user: 'Gustavo Rocha', content: 'Apps como MyFitnessPal facilitam muito o rastreamento de macros!' },
    ]
  },
  'paleo-ancestral': {
    posts: [
      { user: 'Daniela Correia', content: 'Paleo funcionou bem pra mim. Apenas alimentos naturais, zero processados.' },
      { user: 'Renata Moraes', content: 'Sem grãos, sem laticínios é muito restritivo pra mim. Tentei e não sustentei.' },
      { user: 'Marcelo Pereira', content: 'O foco deve ser alimentos de qualidade, não rótulos como paleo ou não.' },
    ]
  },
  'iifym-flexivel': {
    posts: [
      { user: 'Joao Carlos', content: 'Se cabe na macros posso comer? Mesmo sendo fast food?' },
      { user: 'Beatriz Gomes', content: 'Sim! IIFYM é justamente isso. Desde que não comprometa a saúde, tudo bem.' },
      { user: 'Isabella Sousa', content: 'Mas a qualidade dos alimentos importa também pra gut health e inflamação!' },
    ]
  },
  'alergias-intolerancias': {
    posts: [
      { user: 'Victor Almeida', content: 'Sou intolerante a lactose. Como substituo o leite no pós-treino?' },
      { user: 'Ana Paula', content: 'Leite integral de arroz, aveia, amêndoa! Tem bastante de tudo disponível.' },
      { user: 'Carlos Eduardo', content: 'Intolerância a glúten aqui. Dicas de alimentos seguro?' },
    ]
  },
  'musculacao-hipertrofia': {
    posts: [
      { user: 'Patricia Oliveira', content: 'Quanto de volume semanal cada grupo muscular precisa para crescer?' },
      { user: 'Fernanda Alves', content: '10-20 séries por semana por grupo muscular é o ideal. Depende também da experiência.' },
      { user: 'Rafael Lima', content: 'Eu faço 3x/semana whole body. Faz 2 anos que ganho massa consistentemente!' },
    ]
  },
  'cardio-resistencia': {
    posts: [
      { user: 'Mariana Costa', content: 'HIIT queima mais gordura que cardio estacionário?' },
      { user: 'Camila Ribeiro', content: 'Ambos têm seus benefícios. HIIT é mais eficiente em tempo, mas cardio é mais sustentável.' },
      { user: 'Bruno Ferreira', content: 'Faço 30min de corrida leve todo dia. Emagreci 5kg em 2 meses.' },
    ]
  },
  'funcional-calistenia': {
    posts: [
      { user: 'Thiago Martins', content: 'Como consigo fazer pompoide com peso corporal?' },
      { user: 'Lucas Souza', content: 'Progressão: mão alta na parede, depois mão mais baixa. Paciência e consistência!' },
      { user: 'Roberta Mendes', content: 'Calistenia tem colocado meu core muito forte. Amo!' },
    ]
  },
  'crossfit': {
    posts: [
      { user: 'Amanda Silva', content: 'CrossFit é realmente seguro? Vejo muita lesão...' },
      { user: 'Rodrigo Andrade', content: 'Depende do box e do treinador. Um bom coach reduz 90% do risco.' },
      { user: 'Gustavo Rocha', content: 'Faço CrossFit há 3 anos. Melhor investimento que já fiz em saúde!' },
    ]
  },
  'pilates-yoga': {
    posts: [
      { user: 'Daniela Correia', content: 'Pilates e musculação podem ser combinados?' },
      { user: 'Renata Moraes', content: 'Sim! Pilates fornece mobilidade e core strength que complementam musculação.' },
      { user: 'Marcelo Pereira', content: 'Yoga me ajudou muito com flexibilidade. Recomendo pra todo atleta!' },
    ]
  },
  'corrida-trail': {
    posts: [
      { user: 'Joao Carlos', content: 'Treino para meia maratona. Qual volume semanal?' },
      { user: 'Beatriz Gomes', content: '40-60km por semana é padrão para meia. Estrutura com treinos de intensidade diferentes.' },
      { user: 'Isabella Sousa', content: 'Trail running é incrível! Muito mais divertido que asfalto.' },
    ]
  },
  'ciclismo-pedal': {
    posts: [
      { user: 'Victor Almeida', content: 'Road bike vs mountain bike? Qual escolho como iniciante?' },
      { user: 'Ana Paula', content: 'Depende do terreno onde você pedala! Road = asfalto, MTB = trilhas.' },
      { user: 'Carlos Eduardo', content: 'Comecei com road e nunca mais voltei. Intensidade do treino é incrível!' },
    ]
  },
  'luta-artes-marciais': {
    posts: [
      { user: 'Patricia Oliveira', content: 'Posso fazer jiu jitsu e musculação ao mesmo tempo?' },
      { user: 'Fernanda Alves', content: 'Sim! Mas cuidado com volume total. Treino jiu 4x e musculação 3x com sucesso.' },
      { user: 'Rafael Lima', content: 'Muay Thai mudou meu condicionamento completamente. Muito intenso!' },
    ]
  },
  'esportes-coletivos': {
    posts: [
      { user: 'Mariana Costa', content: 'Treino futebol 2x/semana. Devo fazer musculação também?' },
      { user: 'Camila Ribeiro', content: 'Sim! Prevenção de lesão + performance. Força no glúteo e core são essenciais.' },
      { user: 'Bruno Ferreira', content: 'Preparador físico de vôlei aqui. Explosividade é tudo nesse esporte!' },
    ]
  },
  'lipedema-flacidez': {
    posts: [
      { user: 'Thiago Martins', content: 'Tenho lipedema. Musculação piora ou melhora?' },
      { user: 'Lucas Souza', content: 'Musculação inteligente (sem muita inflamação) é ótima pra lipedema. Drenagem + compressão complementam!' },
      { user: 'Roberta Mendes', content: 'Flacidez depois de perda de peso é normal. Ganho de massa e colágeno ajudam muito!' },
    ]
  },
  'dor-cronica-reabilitacao': {
    posts: [
      { user: 'Amanda Silva', content: 'Dor crônica nas costas há 5 anos. Fisio, médico, nada resolveu...' },
      { user: 'Rodrigo Andrade', content: 'Já tentou pilates específico ou RPG? Muita gente melhora com isso.' },
      { user: 'Gustavo Rocha', content: 'Meu fisio recomendou força progressiva. Está fazendo toda diferença!' },
    ]
  },
  'hormonal-ciclo-menstrual': {
    posts: [
      { user: 'Daniela Correia', content: 'TPM me derruba todas as semanas. Exercício ajuda?' },
      { user: 'Renata Moraes', content: 'Sim! Cardio e yoga especialmente ajudam com sintomas de TPM.' },
      { user: 'Marcelo Pereira', content: 'Minha namorada treina mais leve na menstruação. Respeita o corpo é importante!' },
    ]
  },
  'diabetes-insulina': {
    posts: [
      { user: 'Joao Carlos', content: 'Tenho pré-diabetes. Como evitar progredir?' },
      { user: 'Beatriz Gomes', content: 'Exercício + baixo índice glicêmico são suas melhores ferramentas!' },
      { user: 'Isabella Sousa', content: 'Resistência com peso + cardio combinados são best para sensibilidade insulínica.' },
    ]
  },
  'colesterol-pressao': {
    posts: [
      { user: 'Victor Almeida', content: 'Colesterol alto. Qual exercício é melhor?' },
      { user: 'Ana Paula', content: 'Cardio regular é ouro para colesterol e pressão. 30min, 5x/semana.' },
      { user: 'Carlos Eduardo', content: 'Musculação também ajuda! Ganho de massa melhora muito os números.' },
    ]
  },
  'sono-recuperacao': {
    posts: [
      { user: 'Patricia Oliveira', content: 'Insônia crônica. Como melhoro qualidade do sono?' },
      { user: 'Fernanda Alves', content: 'Exercício de manhã, sem tela 1h antes de dormir, quarto escuro.' },
      { user: 'Rafael Lima', content: 'Meditação + yoga à noite melhorou muito meu sono.' },
    ]
  },
  'saude-mental-estresse': {
    posts: [
      { user: 'Mariana Costa', content: 'Ansiedade afeta meu treino. Como vocês lidam?' },
      { user: 'Camila Ribeiro', content: 'Exercício é ansiolítico natural! Treinar ajuda muito a desestressar.' },
      { user: 'Bruno Ferreira', content: 'Psicólogo + treino de força mudou minha vida.' },
    ]
  },
  'postura-coluna': {
    posts: [
      { user: 'Thiago Martins', content: 'Cifose exagerada. Como corrijo postura?' },
      { user: 'Lucas Souza', content: 'Musculação para costas + alongamento de peito. Consistência é tudo!' },
      { user: 'Roberta Mendes', content: 'Fiz RPG por 6 meses. Resultado fantástico na postura!' },
    ]
  },
  'joelho-quadril': {
    posts: [
      { user: 'Amanda Silva', content: 'Dor no joelho ao agachar. É normal?' },
      { user: 'Rodrigo Andrade', content: 'Pode ser alinhamento de quadril ou fraqueza de glúteo. Vê um fisio!' },
      { user: 'Gustavo Rocha', content: 'Fortaleci meu glúteo médio e a dor no joelho sumiu!' },
    ]
  },
  'ombro-cotovelo': {
    posts: [
      { user: 'Daniela Correia', content: 'Tendinite no ombro. Devo parar de treinar?' },
      { user: 'Renata Moraes', content: 'Modifique os exercícios, não pare! Imobilidade piora tudo.' },
      { user: 'Marcelo Pereira', content: 'Trabalho de rotadores internos e externos salvou meu ombro.' },
    ]
  },
  'tornozelo-pe': {
    posts: [
      { user: 'Joao Carlos', content: 'Entorse de tornozelo. Quanto tempo demora pra volta ao treino?' },
      { user: 'Beatriz Gomes', content: '4-6 semanas em média. Comece com exercício isométrico, depois progressivo.' },
      { user: 'Isabella Sousa', content: 'Fascite plantar aqui. Alongamento + tênis adequado me ajudou muito!' },
    ]
  },
  'resultados-transformacao': {
    posts: [
      { user: 'Victor Almeida', content: 'Ganhei 10kg de massa em 1 ano. Quer saber como?' },
      { user: 'Ana Paula', content: 'Eu perdi 25kg em 8 meses. Ainda estou em processo mas já super feliz!' },
      { user: 'Carlos Eduardo', content: 'Minhas fotos de progresso me motivam muito. Façam vocês também!' },
    ]
  },
  'pesquisa-evidencia': {
    posts: [
      { user: 'Patricia Oliveira', content: 'Estudo novo sobre creatina e cérebro. Alguém leu?' },
      { user: 'Fernanda Alves', content: 'A maioria das "dicas" na internet não tem evidência. Cuidado!' },
      { user: 'Rafael Lima', content: 'Ciência é constantemente atualizada. Velho conhecimento pode estar errado.' },
    ]
  },
  'lifestyle-qualidade-vida': {
    posts: [
      { user: 'Mariana Costa', content: 'Como organizar rotina com trabalho full-time e treino?' },
      { user: 'Camila Ribeiro', content: 'Planejamento é tudo! Eu bloqueio meus treinos como compromissos.' },
      { user: 'Bruno Ferreira', content: 'Qualidade de vida vai além do treino. Sono e alimentação são tão importantes!' },
    ]
  },
};

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     🌍 POPULANDO TODAS AS 36 ARENAS COM CONVERSAS     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Buscar todas as arenas
    const arenas = await prisma.arena.findMany({ orderBy: { createdAt: 'asc' } });
    console.log(`📊 Total de arenas encontradas: ${arenas.length}\n`);

    let totalPostsCreated = 0;
    let totalCommentsCreated = 0;

    // Para cada arena, popular com conversas
    for (let i = 0; i < arenas.length; i++) {
      const arena = arenas[i];
      const conversations = ARENA_CONVERSATIONS[arena.slug];

      if (!conversations) {
        console.log(`⏭️  [${i + 1}/${arenas.length}] ${arena.name} - Sem dados (pulando)`);
        continue;
      }

      console.log(`\n▶️  [${i + 1}/${arenas.length}] ${arena.name}`);
      console.log('─'.repeat(60));

      // Gerar 10-15 posts
      const postsCount = Math.floor(Math.random() * 6) + 10; // 10-15
      for (let p = 0; p < postsCount; p++) {
        const conv = conversations.posts[p % conversations.posts.length];

        // Criar post
        const post = await prisma.post.create({
          data: {
            arenaId: arena.id,
            userId: `user_sim_${(p % 22) + 1}`,
            content: conv.content,
            isPublished: true,
            isAIResponse: false,
          },
        });

        totalPostsCreated++;

        // Adicionar 1-3 comentários
        const commentCount = Math.floor(Math.random() * 3) + 1;
        for (let c = 0; c < commentCount; c++) {
          await prisma.comment.create({
            data: {
              postId: post.id,
              userId: `user_sim_${(Math.random() * 22 | 0) + 1}`,
              content: ['Muito bom!', 'Concordo!', 'Ótima dica!', 'Excelente ponto!'][Math.random() * 4 | 0],
              isAIResponse: false,
            },
          });
          totalCommentsCreated++;
        }
      }

      console.log(`   ✅ ${postsCount} posts, ~${postsCount * 2} comentários`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 ESTATÍSTICAS FINAIS');
    console.log('═'.repeat(60));
    console.log(`✅ Posts criados: ${totalPostsCreated}`);
    console.log(`✅ Comentários criados: ${totalCommentsCreated}`);
    console.log(`✅ Total interações: ${totalPostsCreated + totalCommentsCreated}`);
    console.log(`✅ Arenas populadas: ${arenas.length}`);
    console.log('\n🎉 SEED COMPLETO!\n');

  } catch (error) {
    console.error('\n❌ ERRO:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
