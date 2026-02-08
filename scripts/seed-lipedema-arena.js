const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ SEED: Arena Lipedema — Paradoxo do Cardio\n');

  let arena = await prisma.arena.findFirst({
    where: {
      OR: [
        { slug: 'lipedema-paradoxo' },
        { slug: 'lipedema-paradoxo-cardio' },
        { name: { contains: 'Lipedema' } }
      ]
    }
  });

  if (!arena) {
    console.log('⚠️ Arena não encontrada. Criando...');
    arena = await prisma.arena.create({
      data: {
        slug: 'lipedema-paradoxo',
        name: 'Lipedema — Paradoxo do Cardio',
        description: 'Arena dedicada ao paradoxo do exercício cardiovascular no lipedema. Cardio de alto impacto piora inflamação e dor, mas exercício é essencial. Aqui discutimos estratégias inteligentes: aquático, LISS, drenagem ativa, e como adaptar protocolos para quem convive com lipedema.',
        welcome_trigger: 'Bem-vinda à arena Lipedema — Paradoxo do Cardio! Aqui discutimos como fazer exercício cardiovascular de forma inteligente quando se tem lipedema. Pergunte sobre protocolos aquáticos, LISS adaptado, drenagem linfática ativa, e estratégias que protegem seus tecidos.',
        ai_prompt: 'Você é uma IA especialista em lipedema e exercício físico. Responda com base em evidências científicas sobre o paradoxo do cardio no lipedema: exercício é necessário mas impacto piora inflamação. Priorize: exercícios aquáticos, LISS de baixo impacto, drenagem linfática manual/ativa, compressão durante exercício. Sempre alerte que não substitui acompanhamento médico. Tom: empático, técnico mas acessível.',
        color_theme: '#8B5CF6',
        icon: '💜',
        order: 25,
        is_active: true,
        total_threads: 0,
        total_posts: 0,
        total_members: 0
      }
    });
    console.log('✅ Arena criada:', arena.id);
  } else {
    console.log('✅ Arena encontrada:', arena.id, arena.name);
  }

  const ARENA_ID = arena.id;
  const existingPosts = await prisma.post.count({
    where: { thread: { arena_id: ARENA_ID } }
  });

  console.log(`📊 Posts existentes: ${existingPosts}`);

  if (existingPosts >= 30) {
    console.log('✅ Arena já tem posts suficientes. Pulando seed.');
    await prisma.$disconnect();
    return;
  }

  let baseTime = new Date('2026-02-01T08:00:00Z');
  const nextTime = () => {
    baseTime = new Date(baseTime.getTime() + (45 + Math.floor(Math.random() * 90)) * 60000);
    return new Date(baseTime);
  };

  console.log('🧵 Thread 1: Correr piora meu lipedema?');
  const thread1 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-correr-piora-${Date.now()}`,
      title: 'Correr piora meu lipedema? Minhas pernas incham muito depois',
      initial_question: 'Gente, fui diagnosticada com lipedema estágio 2 há 6 meses. Sempre fui de correr, mas notei que depois da corrida minhas pernas ficam MUITO inchadas e doloridas, muito mais que antes. A médica disse pra eu "fazer exercício" mas não especificou qual. Corrida piora o lipedema? Estou confusa porque sempre ouvi que exercício ajuda 😢',
      author_type: 'user',
      author_id: 'user_sim_002',
      author_name: 'Juliana Santos',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  await prisma.post.createMany({
    data: [
      {
        thread_id: thread1.id,
        content: 'Gente, fui diagnosticada com lipedema estágio 2 há 6 meses. Sempre fui de correr, mas notei que depois da corrida minhas pernas ficam MUITO inchadas e doloridas, muito mais que antes. A médica disse pra eu "fazer exercício" mas não especificou qual. Corrida piora o lipedema? Estou confusa porque sempre ouvi que exercício ajuda 😢',
        author_type: 'user',
        author_id: 'user_sim_002',
        author_name: 'Juliana Santos',
        created_at: nextTime()
      },
      {
        thread_id: thread1.id,
        content: `Juliana, sua pergunta toca no que chamamos de **Paradoxo do Cardio no Lipedema** — e é uma das dúvidas mais importantes para quem convive com essa condição.

**O que está acontecendo no seu corpo:**

Quando você corre, o impacto repetitivo gera microtraumas nos tecidos. Em pessoas sem lipedema, o corpo absorve e repara rapidamente. No lipedema, o tecido adiposo já está cronicamente inflamado e com drenagem linfática comprometida. Cada impacto agrava essa inflamação, e o sistema linfático não consegue drenar o excesso de fluido — resultado: inchaço e dor intensificados.

**Por que exercício é necessário mesmo assim:**

O exercício cardiovascular melhora a circulação linfática, reduz inflamação sistêmica, melhora sensibilidade à insulina (importante porque resistência insulínica agrava lipedema), e protege a saúde mental. Você PRECISA de exercício — mas do tipo certo.

**Alternativas inteligentes à corrida:**

1. **Exercício aquático** — O melhor aliado do lipedema. A pressão hidrostática da água funciona como compressão natural, auxiliando drenagem linfática. Natação, hidroginástica e caminhada na água são excelentes. A água elimina o impacto e ainda oferece resistência suave.

2. **Caminhada com compressão** — Se você gosta de atividade ao ar livre, caminhar com meias de compressão graduada (20-30 mmHg no mínimo) reduz drasticamente o inchaço pós-exercício. Ritmo moderado, superfície plana.

3. **Bicicleta ergométrica** — Sem impacto, mantém frequência cardíaca elevada. Ajuste resistência baixa a moderada. Use compressão nas pernas.

4. **Elíptico** — Impacto muito menor que corrida, mantém o trabalho cardiovascular.

**Protocolo recomendado:**
- Sempre use compressão durante o exercício
- Hidrate-se muito (ajuda drenagem linfática)
- Pós-treino: eleve as pernas 15-20 minutos
- Se possível, faça drenagem linfática manual 1-2x por semana

**Sobre a corrida:** Não precisa abandonar completamente, mas considere reduzir frequência e distância drasticamente, e substituir a maior parte por atividades aquáticas. Se depois de correr o inchaço dura mais de 24h, seu corpo está sinalizando que é demais.

⚠️ *Essa orientação é educacional. Consulte um angiologista ou médico especializado em lipedema para ajustar o protocolo ao seu estágio específico.*

Você tem acesso a piscina ou academia com elíptico?`,
        author_type: 'ai',
        author_name: 'IA — Lipedema Coach',
        created_at: nextTime()
      },
      {
        thread_id: thread1.id,
        content: 'Nossa, agora faz MUITO sentido! Eu saía da corrida com as pernas latejando e achava que era "normal". Tenho piscina no condomínio, vou começar a caminhar na água. Uma dúvida: a meia de compressão pode ser aquela de farmácia mesmo ou precisa ser específica?',
        author_type: 'user',
        author_id: 'user_sim_002',
        author_name: 'Juliana Santos',
        created_at: nextTime()
      },
      {
        thread_id: thread1.id,
        content: `Boa pergunta, Juliana! Há diferença sim:

**Meias de farmácia (suave compressão, 15-20 mmHg):** Servem para prevenção e uso diário leve, mas para exercício com lipedema estágio 2, geralmente não são suficientes.

**O que você precisa:** Meias de compressão graduada de 20-30 mmHg (classe II), idealmente sob medida. A compressão graduada significa que é mais forte no tornozelo e vai diminuindo conforme sobe — isso "empurra" o fluido linfático para cima.

**Marcas acessíveis no Brasil:** Venosan, Sigvaris e Kendall têm linhas de 20-30 mmHg que você encontra em lojas de produtos médicos. Custo médio: R$80-200 o par.

**Dica prática:** Para caminhar na água, você não precisa de meia — a pressão hidrostática da piscina já faz esse papel naturalmente. Use a meia nas atividades fora da água.

Comece com 20-30 minutos de caminhada na água, 3x por semana, e observe como suas pernas respondem. Provavelmente você vai notar diferença enorme comparado à corrida!`,
        author_type: 'ai',
        author_name: 'IA — Lipedema Coach',
        created_at: nextTime()
      },
      {
        thread_id: thread1.id,
        content: 'Juliana, passei pela MESMA coisa! Corria 5x por semana e minhas pernas só pioravam. Troquei pra hidroginástica há 4 meses e a diferença é absurda. Menos inchaço, menos dor, e ainda emagreci 3kg. A piscina virou minha melhor amiga 💜',
        author_type: 'user',
        author_id: 'user_sim_016',
        author_name: 'Daniela Correia',
        created_at: nextTime()
      },
      {
        thread_id: thread1.id,
        content: 'Obrigada por esse thread! Eu tava nessa situação exata e achava que tava exagerando. Vou mostrar essa explicação da IA pra minha médica. Alguém sabe se elíptico com compressão realmente funciona bem? Não tenho piscina perto.',
        author_type: 'user',
        author_id: 'user_sim_003',
        author_name: 'Mariana Costa',
        created_at: nextTime()
      }
    ]
  });

  console.log('🧵 Thread 2: Hidroginástica vs Natação');
  const thread2 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-hidro-vs-natacao-${Date.now()}`,
      title: 'Hidroginástica ou natação? Qual é melhor para lipedema?',
      initial_question: 'Oi pessoal! Tenho lipedema estágio 1 e quero começar exercício aquático. Mas fico na dúvida: hidroginástica ou natação? Qual funciona melhor para drenagem e para não piorar o inchaço? Alguém tem experiência com os dois?',
      author_type: 'user',
      author_id: 'user_sim_017',
      author_name: 'Renata Moraes',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  await prisma.post.createMany({
    data: [
      {
        thread_id: thread2.id,
        content: 'Oi pessoal! Tenho lipedema estágio 1 e quero começar exercício aquático. Mas fico na dúvida: hidroginástica ou natação? Qual funciona melhor para drenagem e para não piorar o inchaço? Alguém tem experiência com os dois?',
        author_type: 'user',
        author_id: 'user_sim_017',
        author_name: 'Renata Moraes',
        created_at: nextTime()
      },
      {
        thread_id: thread2.id,
        content: `Renata, ótima pergunta! Ambas são excelentes para lipedema, mas têm características diferentes:

**Hidroginástica — Vantagens para lipedema:**
- Exercício em posição vertical → a pressão hidrostática atua de baixo para cima nas pernas, favorecendo drenagem
- Movimentos variados que trabalham amplitude de movimento
- Componente social (aulas em grupo) que ajuda na adesão
- Intensidade geralmente moderada e controlável
- Professor presente para adaptar exercícios

**Natação — Vantagens para lipedema:**
- Posição horizontal redistribui a pressão hidrostática de forma mais uniforme por todo o corpo
- Trabalho cardiovascular mais intenso (se desejado)
- Maior autonomia (você controla ritmo e duração)
- Movimentos de perna no nado (especialmente costas e peito) promovem bombeamento linfático excelente

**Qual escolher?**

Para lipedema estágio 1, ambas funcionam muito bem. A recomendação prática:

- **Se você quer começar devagar e ter acompanhamento:** Hidroginástica. O professor pode adaptar movimentos e a turma motiva.
- **Se você já sabe nadar e quer autonomia:** Natação, especialmente nado costas (menos impacto nos ombros e excelente para pernas).
- **Ideal:** Combinar ambas. Exemplo: 2x hidro + 1x natação por semana.

**Temperatura da água:** Entre 28-31°C é ideal. Água muito quente (>33°C) pode dilatar vasos e piorar inchaço. Água muito fria pode ser desconfortável para o tecido sensível do lipedema.

**Cuidado importante:** Evite piscinas com muito cloro se sua pele é sensível — lipedema frequentemente vem acompanhado de sensibilidade cutânea.

Você sabe nadar ou preferiria começar pela hidro?`,
        author_type: 'ai',
        author_name: 'IA — Lipedema Coach',
        created_at: nextTime()
      },
      {
        thread_id: thread2.id,
        content: 'Sei nadar sim, mas não muito bem. Acho que vou começar com hidro pra pegar ritmo e depois adicionar natação. Adorei a dica da temperatura! A piscina do meu clube é bem quentinha, vou perguntar a temperatura exata.',
        author_type: 'user',
        author_id: 'user_sim_017',
        author_name: 'Renata Moraes',
        created_at: nextTime()
      },
      {
        thread_id: thread2.id,
        content: 'Faço hidro há 2 anos por causa do lipedema e é a melhor coisa que já fiz! Minhas pernas desincharam visivelmente. A professora sabe da minha condição e adapta os exercícios de salto (faz sem impacto). Recomendo demais começar por aí, Renata!',
        author_type: 'user',
        author_id: 'user_sim_006',
        author_name: 'Patricia Oliveira',
        created_at: nextTime()
      },
      {
        thread_id: thread2.id,
        content: 'Eu tentei natação mas achei solitário demais. Na hidro conheci outras mulheres com lipedema e a troca é incrível. Fora que a gente ri muito na aula, ajuda demais no emocional que a gente sabe que sofre com essa condição.',
        author_type: 'user',
        author_id: 'user_sim_001',
        author_name: 'Ana Paula',
        created_at: nextTime()
      }
    ]
  });

  console.log('🧵 Threads 3-8 criadas...');

  const thread3 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-musculacao-segura-${Date.now()}`,
      title: 'Musculação é segura para quem tem lipedema?',
      initial_question: 'Minha endocrinologista disse que musculação seria boa para mim por causa da resistência insulínica (tenho lipedema + SOP). Mas tenho medo de piorar o inchaço nas pernas. Alguém treina musculação com lipedema? Como adaptar?',
      author_type: 'user',
      author_id: 'user_sim_007',
      author_name: 'Fernanda Alves',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  const thread4 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-hiit-proibido-${Date.now()}`,
      title: 'HIIT é totalmente proibido para quem tem lipedema?',
      initial_question: 'Vejo muita gente falando que HIIT é proibido com lipedema, mas minha personal insiste que é o melhor para queimar gordura. Ela diz que lipedema "é só gordura teimosa" e que HIIT resolve. Isso é verdade? Estou confusa com informações tão diferentes.',
      author_type: 'user',
      author_id: 'user_sim_020',
      author_name: 'Beatriz Gomes',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  const thread5 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-drenagem-exercicio-${Date.now()}`,
      title: 'Drenagem linfática antes ou depois do exercício?',
      initial_question: 'Faço drenagem linfática manual 2x por semana e treino 4x. Minha dúvida é sobre timing: faço drenagem ANTES ou DEPOIS do treino? No mesmo dia ou em dias separados? Quero otimizar os resultados.',
      author_type: 'user',
      author_id: 'user_sim_006',
      author_name: 'Patricia Oliveira',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  const thread6 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-caminhada-distancia-${Date.now()}`,
      title: 'Quanto posso caminhar por dia com lipedema sem piorar?',
      initial_question: 'Tenho lipedema estágio 2 nas pernas e braços. Caminhada é o único exercício que consigo fazer agora (questão financeira, sem piscina). Mas quanto posso caminhar sem piorar o inchaço? Tem limite? Ritmo importa?',
      author_type: 'user',
      author_id: 'user_sim_019',
      author_name: 'João Carlos',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  const thread7 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-yoga-pilates-${Date.now()}`,
      title: 'Yoga ou Pilates ajudam no lipedema? Qual é melhor?',
      initial_question: 'Além do exercício cardiovascular, será que yoga ou pilates podem ajudar no lipedema? Penso na questão da circulação, flexibilidade e também do estresse (que sei que piora inflamação). Alguém pratica?',
      author_type: 'user',
      author_id: 'user_sim_008',
      author_name: 'Camila Ribeiro',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  const thread8 = await prisma.thread.create({
    data: {
      arena_id: ARENA_ID,
      slug: `lipedema-exercicio-calor-${Date.now()}`,
      title: 'Exercício no calor piora muito o lipedema — como lidar?',
      initial_question: 'Moro no Nordeste e o calor aqui é constante. Percebo que nos dias muito quentes, minhas pernas incham MUITO mais, especialmente se faço exercício ao ar livre. Tem algo específico pra quem tem lipedema e mora em região quente? Não tenho como mudar de cidade rs',
      author_type: 'user',
      author_id: 'user_sim_003',
      author_name: 'Mariana Costa',
      is_pinned: false,
      is_initial_seed: true,
      posts_count: 0,
      created_at: nextTime(),
      updated_at: nextTime(),
      last_activity_at: nextTime()
    }
  });

  console.log('\n📊 Atualizando contadores...');
  const allThreads = await prisma.thread.findMany({
    where: { arena_id: ARENA_ID },
    select: { id: true }
  });

  for (const thread of allThreads) {
    const postCount = await prisma.post.count({
      where: { thread_id: thread.id }
    });
    await prisma.thread.update({
      where: { id: thread.id },
      data: {
        posts_count: postCount,
        last_activity_at: new Date()
      }
    });
  }

  const totalThreads = await prisma.thread.count({
    where: { arena_id: ARENA_ID }
  });

  const totalPosts = await prisma.post.count({
    where: { thread: { arena_id: ARENA_ID } }
  });

  const uniqueAuthors = await prisma.post.findMany({
    where: {
      thread: { arena_id: ARENA_ID },
      author_type: 'user'
    },
    select: { author_id: true },
    distinct: ['author_id']
  });

  await prisma.arena.update({
    where: { id: ARENA_ID },
    data: {
      total_threads: totalThreads,
      total_posts: totalPosts,
      total_members: uniqueAuthors.length
    }
  });

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED COMPLETO — Lipedema: Paradoxo do Cardio');
  console.log('═'.repeat(60));
  console.log(`📊 Threads criadas: ${totalThreads}`);
  console.log(`📊 Posts criados: ${totalPosts}`);
  console.log(`📊 Membros únicos: ${uniqueAuthors.length}`);
  console.log('═'.repeat(60));

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e);
    process.exit(1);
  });
