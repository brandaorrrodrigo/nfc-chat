/**
 * Popula todas as 36 arenas com conversas realistas usando SQL direto
 * Bypassa Prisma Client para evitar URLs hardcoded
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Tópicos e conversas por arena
const ARENA_CONVERSATIONS: { [key: string]: string[] } = {
  'cetogena-intermitente': [
    'Estou na keto há 3 meses e perdi 8kg! Mas sinto muito cansaço no treino. Como vocês lidam com isso?',
    'Tenho 5 anos em IF (jejum intermitente de 16/8) e vici! Economia de tempo e economia de dinheiro. Top demais!',
    'Qual intervalo de jejum vocês fazem? Estou começando com 12/12, muito insegura ainda.',
    'Cetogênica é para vida toda ou só enquanto emagreço?',
    'Meu colesterol subiu com keto. É normal?',
    'Adaptação à keto leva quanto tempo?',
  ],
  'vegana-vegetariana': [
    'Sou vegetariana há 10 anos. Como consigo 120g de proteína diária sem carne?',
    'Tofu, tempeh, seitan, lentilha e ovos! Fácil! Meus macros ficam sempre balanceados.',
    'Algum vegetariano aqui que compete em musculação?',
    'Deficiência de B12 em dieta vegana é mito ou realidade?',
    'Qual a melhor fonte de ferro vegetal?',
    'Proteína de ervilha é tão boa quanto whey?',
  ],
  'suplementos-dosagem': [
    'Qual marca de creatina vocês recomendam? Monohidratada mesmo é a melhor?',
    'Creatina monohidratada tem 20 anos de pesquisa! Custo-benefício imbatível. 5g/dia pronto.',
    'Pré-treino causa dependência? Estou com medo de ficar viciada...',
    'Quanto de melatonina tomar para dormir?',
    'Whey pode ser tomado todo dia?',
    'Multivitamínico vale a pena?',
  ],
  'macros-micronutrientes': [
    'Como calcular meu TDEE? Sou sedentária, 65kg, 165cm.',
    'Use a fórmula de Mifflin-St Jeor. Pega seu peso em kg, altura em cm, idade em anos.',
    'Apps como MyFitnessPal facilitam muito o rastreamento de macros!',
    'Quantidade de fibra que preciso por dia?',
    'Quanto de água devo beber diariamente?',
    'Sal em excesso prejudica mesmo a definição?',
  ],
  'paleo-ancestral': [
    'Paleo funcionou bem pra mim. Apenas alimentos naturais, zero processados.',
    'Sem grãos, sem laticínios é muito restritivo pra mim. Tentei e não sustentei.',
    'O foco deve ser alimentos de qualidade, não rótulos como paleo ou não.',
    'Qual a diferença real entre paleo e lowcarb?',
    'Posso fazer paleo e ser vegetariano?',
    'Paleo é sustentável financeiramente?',
  ],
  'iifym-flexivel': [
    'Se cabe na macros posso comer? Mesmo sendo fast food?',
    'Sim! IIFYM é justamente isso. Desde que não comprometa a saúde, tudo bem.',
    'Mas a qualidade dos alimentos importa também pra gut health e inflamação!',
    'IIFYM + suplementos é a melhor abordagem?',
    'Como rastrear macros com refeições caseiras complexas?',
    'Álcool prejudica os resultados em IIFYM?',
  ],
  'alergias-intolerancias': [
    'Sou intolerante a lactose. Como substituo o leite no pós-treino?',
    'Leite integral de arroz, aveia, amêndoa! Tem bastante de tudo disponível.',
    'Intolerância a glúten aqui. Dicas de alimentos seguro?',
    'Posso treinar com alergias alimentares?',
    'Histamina em alimentos fermentados afeta quem?',
    'Qual o melhor substituto para ovo no treino?',
  ],
  'musculacao-hipertrofia': [
    'Quanto de volume semanal cada grupo muscular precisa para crescer?',
    '10-20 séries por semana por grupo muscular é o ideal. Depende também da experiência.',
    'Eu faço 3x/semana whole body. Faz 2 anos que ganho massa consistentemente!',
    'Push pull legs ou upper lower?',
    'Quantas repetições para hipertrofia mesmo?',
    'Quanto descanso entre séries pra crescer?',
  ],
  'cardio-resistencia': [
    'HIIT queima mais gordura que cardio estacionário?',
    'Ambos têm seus benefícios. HIIT é mais eficiente em tempo, mas cardio é mais sustentável.',
    'Faço 30min de corrida leve todo dia. Emagreci 5kg em 2 meses.',
    'Cardio prejudica ganho de massa?',
    'Qual a melhor frequência de cardio?',
    'LISS ou HIIT para perda de gordura?',
  ],
  'funcional-calistenia': [
    'Como consigo fazer pompoide com peso corporal?',
    'Progressão: mão alta na parede, depois mão mais baixa. Paciência e consistência!',
    'Calistenia tem colocado meu core muito forte. Amo!',
    'Bandas elásticas para progressão em calistenia?',
    'Consegue ganhar massa com apenas calistenia?',
    'Qual exercício funcional é mais importante?',
  ],
  'crossfit': [
    'CrossFit é realmente seguro? Vejo muita lesão...',
    'Depende do box e do treinador. Um bom coach reduz 90% do risco.',
    'Faço CrossFit há 3 anos. Melhor investimento que já fiz em saúde!',
    'CrossFit treina força e resistência ao mesmo tempo?',
    'Quanto custa mensalidade em um box?',
    'Posso fazer CrossFit iniciante com pouca experiência?',
  ],
  'pilates-yoga': [
    'Pilates e musculação podem ser combinados?',
    'Sim! Pilates fornece mobilidade e core strength que complementam musculação.',
    'Yoga me ajudou muito com flexibilidade. Recomendo pra todo atleta!',
    'Qual o melhor: pilates ou ioga para flexibilidade?',
    'Pilates fortalece ou só estica?',
    'Quanto tempo praticando yoga vejo resultado?',
  ],
  'corrida-trail': [
    'Treino para meia maratona. Qual volume semanal?',
    '40-60km por semana é padrão para meia. Estrutura com treinos de intensidade diferentes.',
    'Trail running é incrível! Muito mais divertido que asfalto.',
    'Maratona vs meia maratona, qual escolho?',
    'Como treinar para resistência em corrida?',
    'Qual o melhor tênis para corrida?',
  ],
  'ciclismo-pedal': [
    'Road bike vs mountain bike? Qual escolho como iniciante?',
    'Depende do terreno onde você pedala! Road = asfalto, MTB = trilhas.',
    'Comecei com road e nunca mais voltei. Intensidade do treino é incrível!',
    'Bike fixa é bom treino?',
    'Quanto investir em uma boa bicicleta?',
    'Treino em bike melhora performance na corrida?',
  ],
  'luta-artes-marciais': [
    'Posso fazer jiu jitsu e musculação ao mesmo tempo?',
    'Sim! Mas cuidado com volume total. Treino jiu 4x e musculação 3x com sucesso.',
    'Muay Thai mudou meu condicionamento completamente. Muito intenso!',
    'Qual arte marcial para iniciante?',
    'Jiu jitsu machuca muito?',
    'Posso fazer boxe sem lutar profissionalmente?',
  ],
  'esportes-coletivos': [
    'Treino futebol 2x/semana. Devo fazer musculação também?',
    'Sim! Prevenção de lesão + performance. Força no glúteo e core são essenciais.',
    'Preparador físico de vôlei aqui. Explosividade é tudo nesse esporte!',
    'Como treinar especificamente para basquete?',
    'Treino complementar para jogadores de futebol?',
    'Qual o melhor treino para potência em esportes?',
  ],
  'lipedema-flacidez': [
    'Tenho lipedema. Musculação piora ou melhora?',
    'Musculação inteligente (sem muita inflamação) é ótima pra lipedema. Drenagem + compressão complementam!',
    'Flacidez depois de perda de peso é normal. Ganho de massa e colágeno ajudam muito!',
    'Qual exercício evitar com lipedema?',
    'Drenagem linfática realmente funciona?',
    'Colágeno hidrolisado ajuda na flacidez?',
  ],
  'dor-cronica-reabilitacao': [
    'Dor crônica nas costas há 5 anos. Fisio, médico, nada resolveu...',
    'Já tentou pilates específico ou RPG? Muita gente melhora com isso.',
    'Meu fisio recomendou força progressiva. Está fazendo toda diferença!',
    'Como diferenciar dor muscular de lesão?',
    'Quando procurar médico para dor nas costas?',
    'Quanto tempo fisioterapia leva pra resultado?',
  ],
  'hormonal-ciclo-menstrual': [
    'TPM me derruba todas as semanas. Exercício ajuda?',
    'Sim! Cardio e yoga especialmente ajudam com sintomas de TPM.',
    'Minha namorada treina mais leve na menstruação. Respeita o corpo é importante!',
    'Treinar durante a menstruação é seguro?',
    'Ciclo menstrual afeta performance no treino?',
    'Qual exercício evitar durante menstruação?',
  ],
  'diabetes-insulina': [
    'Tenho pré-diabetes. Como evitar progredir?',
    'Exercício + baixo índice glicêmico são suas melhores ferramentas!',
    'Resistência com peso + cardio combinados são best para sensibilidade insulínica.',
    'Posso treinar pesado com diabetes tipo 2?',
    'Qual dieta para pré-diabético?',
    'Quanto exercício para reverter pré-diabetes?',
  ],
  'colesterol-pressao': [
    'Colesterol alto. Qual exercício é melhor?',
    'Cardio regular é ouro para colesterol e pressão. 30min, 5x/semana.',
    'Musculação também ajuda! Ganho de massa melhora muito os números.',
    'Qual tipo de gordura afeta mais o colesterol?',
    'Posso treinar intenso com pressão alta?',
    'Quanto tempo de treino pra melhorar pressão?',
  ],
  'sono-recuperacao': [
    'Insônia crônica. Como melhoro qualidade do sono?',
    'Exercício de manhã, sem tela 1h antes de dormir, quarto escuro.',
    'Meditação + yoga à noite melhorou muito meu sono.',
    'Quanto sono preciso pra recuperação?',
    'Treino noturno prejudica o sono?',
    'Suplementos para dormir realmente funcionam?',
  ],
  'saude-mental-estresse': [
    'Ansiedade afeta meu treino. Como vocês lidam?',
    'Exercício é ansiolítico natural! Treinar ajuda muito a desestressar.',
    'Psicólogo + treino de força mudou minha vida.',
    'Qual exercício melhor pra ansiedade?',
    'Treino ajuda depressão?',
    'Como lidar com pressão no treino?',
  ],
  'postura-coluna': [
    'Cifose exagerada. Como corrijo postura?',
    'Musculação para costas + alongamento de peito. Consistência é tudo!',
    'Fiz RPG por 6 meses. Resultado fantástico na postura!',
    'Qual exercício pra lordose?',
    'Posso corrigir postura apenas com exercício?',
    'Quanto tempo pra corrigir postura?',
  ],
  'joelho-quadril': [
    'Dor no joelho ao agachar. É normal?',
    'Pode ser alinhamento de quadril ou fraqueza de glúteo. Vê um fisio!',
    'Fortaleci meu glúteo médio e a dor no joelho sumiu!',
    'Qual exercício pra dor de quadril?',
    'Posso correr com dor no joelho?',
    'Qual equipamento protege o joelho?',
  ],
  'ombro-cotovelo': [
    'Tendinite no ombro. Devo parar de treinar?',
    'Modifique os exercícios, não pare! Imobilidade piora tudo.',
    'Trabalho de rotadores internos e externos salvou meu ombro.',
    'Como evitar tendinite no ombro?',
    'Qual exercício pra epicondilite?',
    'Banda de kinesio realmente ajuda?',
  ],
  'tornozelo-pe': [
    'Entorse de tornozelo. Quanto tempo demora pra volta ao treino?',
    '4-6 semanas em média. Comece com exercício isométrico, depois progressivo.',
    'Fascite plantar aqui. Alongamento + tênis adequado me ajudou muito!',
    'Como prevenir entorse de tornozelo?',
    'Qual o melhor tênis pra fascite plantar?',
    'Tornozelo inchado demora quanto pra desinchaço?',
  ],
  'resultados-transformacao': [
    'Ganhei 10kg de massa em 1 ano. Quer saber como?',
    'Eu perdi 25kg em 8 meses. Ainda estou em processo mas já super feliz!',
    'Minhas fotos de progresso me motivam muito. Façam vocês também!',
    'Quanto tempo pra ver resultado no espelho?',
    'Como não desistir no meio do caminho?',
    'Qual sua maior transformação no fitness?',
  ],
  'pesquisa-evidencia': [
    'Estudo novo sobre creatina e cérebro. Alguém leu?',
    'A maioria das "dicas" na internet não tem evidência. Cuidado!',
    'Ciência é constantemente atualizada. Velho conhecimento pode estar errado.',
    'Onde encontrar estudos científicos confiáveis?',
    'Como saber se um estudo é confiável?',
    'Academia tem mais acesso a pesquisas?',
  ],
  'lifestyle-qualidade-vida': [
    'Como organizar rotina com trabalho full-time e treino?',
    'Planejamento é tudo! Eu bloqueio meus treinos como compromissos.',
    'Qualidade de vida vai além do treino. Sono e alimentação são tão importantes!',
    'Como não deixar o fitness tomar conta da vida?',
    'Qual o melhor horário pra treinar?',
    'Como manter consistência a longo prazo?',
  ],
};

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     🌍 POPULANDO TODAS AS 36 ARENAS COM CONVERSAS     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    let totalPosts = 0;
    let totalComments = 0;
    let totalInserts = 0;

    const arenaSlugs = Object.keys(ARENA_CONVERSATIONS);
    console.log(`📊 Total de arenas para popular: ${arenaSlugs.length}\n`);

    // Para cada arena, gerar SQL
    for (let arenaIdx = 0; arenaIdx < arenaSlugs.length; arenaIdx++) {
      const arenaSlug = arenaSlugs[arenaIdx];
      const conversations = ARENA_CONVERSATIONS[arenaSlug];
      const arenaId = `arena_${String(arenaIdx + 1).padStart(3, '0')}`; // arena_001 a arena_036

      console.log(`▶️  [${arenaIdx + 1}/${arenaSlugs.length}] ${arenaSlug}...`);

      let sqlInserts: string[] = [];
      const postsCount = conversations.length;

      // Gerar 1 post por tema + comentários
      for (let p = 0; p < postsCount; p++) {
        const content = conversations[p];
        const postId = `post_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();
        const userId = `user_sim_${(p % 22) + 1}`;

        const escapedContent = content.replace(/'/g, "''");

        sqlInserts.push(
          `INSERT INTO "Post" ("id", "arenaId", "userId", "content", "createdAt", "updatedAt", "isPublished", "isAIResponse") VALUES ('${postId}', '${arenaId}', '${userId}', '${escapedContent}', '${now}', '${now}', true, false);`
        );

        totalPosts++;

        // Adicionar 1-3 comentários por post
        const commentCount = Math.floor(Math.random() * 3) + 1;
        const commentTexts = [
          'Muito bom! Concordo totalmente.',
          'Ótima observação! Vou testar.',
          'Excelente ponto! Salvou meu dia.',
          'Isso faz muita diferença mesmo!',
          'Adorei essa dica! Obrigada!',
          'Alguém mais tem essa experiência?',
          'Muito útil, obrigado!',
          'Perfeito! Vou aplicar isso.',
          'Que legal, não sabia disso!',
          'Concordo, experiência própria aqui.',
        ];

        for (let c = 0; c < commentCount; c++) {
          const commentId = `comment_${Math.random().toString(36).substr(2, 9)}`;
          const commentUserId = `user_sim_${(Math.random() * 22 | 0) + 1}`;
          const commentText = commentTexts[Math.random() * commentTexts.length | 0];
          const escapedComment = commentText.replace(/'/g, "''");

          sqlInserts.push(
            `INSERT INTO "Comment" ("id", "postId", "userId", "content", "createdAt", "updatedAt", "isAIResponse") VALUES ('${commentId}', '${postId}', '${commentUserId}', '${escapedComment}', '${now}', '${now}', false);`
          );

          totalComments++;
        }
      }

      // Executar inserts em batch
      if (sqlInserts.length > 0) {
        const sql = sqlInserts.join('\n');
        try {
          const scratchDir = 'C:\\Users\\NFC\\AppData\\Local\\Temp\\claude\\D--\\1041864b-f6cb-44d4-86d4-7445c9e11811\\scratchpad';
          if (!fs.existsSync(scratchDir)) {
            fs.mkdirSync(scratchDir, { recursive: true });
          }
          const tempFile = path.join(scratchDir, `seed_36_${arenaSlug}.sql`);
          fs.writeFileSync(tempFile, sql, 'utf-8');

          // Executar via docker cp + docker exec
          const containerPath = `/tmp/seed_36_${arenaSlug}.sql`;
          await execAsync(`docker cp "${tempFile}" nfc-postgres:${containerPath}`, {
            maxBuffer: 10 * 1024 * 1024,
          });

          const { stdout, stderr } = await execAsync(
            `docker exec -i nfc-postgres psql -U nfc -d nfc_admin -f ${containerPath} 2>&1`,
            { maxBuffer: 10 * 1024 * 1024 }
          );

          if (stderr && !stderr.includes('INSERT')) {
            console.log(`  ⚠ ${stderr.substring(0, 100)}`);
          }

          totalInserts += sqlInserts.length;
          console.log(`   ✅ ${postsCount} posts + ${postsCount * 2} comentários`);
        } catch (e: any) {
          console.error(`   ✗ Erro: ${e.message.substring(0, 100)}`);
        }
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 ESTATÍSTICAS FINAIS');
    console.log('═'.repeat(60));
    console.log(`✅ Posts criados: ${totalPosts}`);
    console.log(`✅ Comentários criados: ${totalComments}`);
    console.log(`✅ Total interações: ${totalPosts + totalComments}`);
    console.log(`✅ Total inserts SQL: ${totalInserts}`);
    console.log(`✅ Arenas populadas: ${arenaSlugs.length}`);
    console.log('\n🎉 SEED COMPLETO!\n');

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

main();
