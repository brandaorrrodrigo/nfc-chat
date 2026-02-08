import { PrismaClient, AIPersona, ArenaType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ SEED: Arena Lipedema — Paradoxo do Cardio\n');

  // Buscar ou criar arena
  let arena = await prisma.arena.findFirst({
    where: {
      OR: [
        { slug: 'lipedema-paradoxo' },
        { slug: 'lipedema-paradoxo-cardio' }
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
        icon: '💜',
        color: '#8B5CF6',
        category: 'saude',
        isActive: true,
        aiPersona: AIPersona.BALANCED,
        aiInterventionRate: 60,
        arenaType: ArenaType.GENERAL
      }
    });
    console.log('✅ Arena criada:', arena.id);
  } else {
    console.log('✅ Arena encontrada:', arena.id, arena.name);
  }

  const ARENA_ID = arena.id;

  // Verificar posts existentes
  const existingPosts = await prisma.post.count({
    where: { arenaId: ARENA_ID }
  });

  console.log(`📊 Posts existentes: ${existingPosts}`);

  if (existingPosts >= 20) {
    console.log('✅ Arena já tem posts suficientes. Pulando seed.');
    return;
  }

  // Usar ID fixo para IA (sem criar usuário)
  const aiUserId = 'ai-lipedema-coach';

  let baseTime = new Date('2026-02-01T08:00:00Z');
  const nextTime = () => {
    baseTime = new Date(baseTime.getTime() + (45 + Math.floor(Math.random() * 90)) * 60000);
    return new Date(baseTime);
  };

  // Posts sobre Lipedema
  const posts = [
    {
      content: 'Oi pessoal! Fui diagnosticada com lipedema estágio 2 há 6 meses. Sempre fui de correr, mas depois da corrida minhas pernas ficam MUITO inchadas. A médica disse pra fazer exercício mas não especificou qual. Corrida piora o lipedema? Estou confusa 😢',
      isAIResponse: false,
      userId: 'user_02'
    },
    {
      content: `Sua pergunta toca no **Paradoxo do Cardio no Lipedema** — uma das dúvidas mais importantes!

O impacto repetitivo da corrida gera microtraumas. No lipedema, o tecido adiposo está cronicamente inflamado e a drenagem linfática é comprometida. Cada impacto agrava a inflamação.

**Alternativas inteligentes:**
- Exercício aquático (melhor aliado!)
- Caminhada com compressão
- Bicicleta ergométrica
- Elíptico

Você tem acesso a piscina ou academia?`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Tenho piscina no condomínio! Vou começar a caminhar na água. Uma dúvida: a meia de compressão pode ser de farmácia ou precisa ser específica?',
      isAIResponse: false,
      userId: 'user_03'
    },
    {
      content: `Boa pergunta! Você precisa de meias de compressão graduada de 20-30 mmHg (classe II), idealmente sob medida.

Marcas como Venosan e Sigvaris têm linhas acessíveis no Brasil (R$80-200 o par).

Para caminhar na água, não precisa de meia — a pressão hidrostática da piscina já faz esse papel naturalmente!`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Passei pela MESMA coisa! Corria 5x por semana e minhas pernas só pioravam. Troquei pra hidroginástica há 4 meses e a diferença é absurda. A piscina virou minha melhor amiga 💜',
      isAIResponse: false,
      userId: 'user_04'
    },
    {
      content: 'Tenho lipedema estágio 1 e quero começar exercício aquático. Mas fico na dúvida: hidroginástica ou natação? Qual funciona melhor para drenagem?',
      isAIResponse: false,
      userId: 'user_05'
    },
    {
      content: `Ambas são excelentes para lipedema, mas têm características diferentes:

**Hidroginástica:**
- Posição vertical → pressão hidrostática atua de baixo para cima
- Movimentos variados
- Componente social
- Professor adapta exercícios

**Natação:**
- Posição horizontal → pressão uniforme
- Maior autonomia
- Intensidade cardiovascular maior

Para lipedema estágio 1, combinar as duas é ideal: 2x hidro + 1x natação por semana!`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Minha endocrinologista disse que musculação seria boa por causa da resistência insulínica (tenho lipedema + SOP). Mas tenho medo de piorar o inchaço nas pernas. Como adaptar?',
      isAIResponse: false,
      userId: 'user_06'
    },
    {
      content: `Sua endocrinologista está certa! Musculação é uma das melhores ferramentas para lipedema quando feita corretamente:

**Por que ajuda:**
- Melhora resistência insulínica
- Contração muscular empurra fluido linfático
- Protege articulações sobrecarregadas
- Melhora metabolismo basal

**Adaptações essenciais:**
- Use meias de compressão (20-30 mmHg)
- Séries moderadas (12-15 reps)
- Leg press em vez de agachamento
- Máximo 40-45 min para pernas
- Elevar pernas 10-15 min pós-treino

A combinação musculação adaptada + aquático é padrão-ouro!`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Vejo muita gente falando que HIIT é proibido com lipedema, mas minha personal diz que é o melhor para queimar gordura. Ela diz que lipedema "é só gordura teimosa". Isso é verdade?',
      isAIResponse: false,
      userId: 'user_07'
    },
    {
      content: `Preciso ser direta: **lipedema NÃO é "gordura teimosa".**

É uma condição patológica com inflamação crônica, hiperplasia e hipertrofia de células adiposas, comprometimento linfático. Não responde a déficit calórico como gordura comum.

**HIIT convencional é problemático:**
- Alto impacto → microtraumas repetitivos
- Picos de pressão → dificulta retorno linfático

**HIIT adaptado é possível:**
- Bike ergométrica com intervalos
- Remo ergômetro
- Intervalos na piscina

Se sua personal insiste que é "só gordura", considere uma segunda opinião com especialista em lipedema!`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Faço drenagem linfática manual 2x por semana e treino 4x. Dúvida: faço drenagem ANTES ou DEPOIS do treino? No mesmo dia ou separado?',
      isAIResponse: false,
      userId: 'user_08'
    },
    {
      content: `Excelente pergunta! O timing faz diferença:

**Cenário ideal: Drenagem APÓS exercício**
- Exercício mobiliza fluido
- Drenagem direciona para linfonodos
- Efeito sinérgico potencializado

**Cenário aceitável: Dias separados**
- Treino: Seg, Qua, Sex, Sáb
- Drenagem: Ter, Qui
- Recuperação entre treinos

**Menos ideal: Drenagem ANTES**
- Exercício "desfaz" parte do trabalho
- Perde benefício da sessão

**Dica:** Use compressão 4-6h após drenagem para "segurar" resultado!`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Tenho lipedema estágio 2 nas pernas e braços. Caminhada é meu único exercício possível agora. Mas quanto posso caminhar sem piorar o inchaço? Tem limite?',
      isAIResponse: false,
      userId: 'user_09'
    },
    {
      content: `Caminhada é um exercício válido! Aqui está o protocolo progressivo:

**Semanas 1-2:** 15-20 min, 3x/semana
**Semanas 3-4:** 25-30 min, 4x/semana
**Semanas 5-6:** 30-40 min, 4-5x/semana
**Semanas 7+:** 40-50 min (máximo), 5x/semana

**Limites importantes:**
- 50 minutos é o máximo contínuo
- Acima disso, acúmulo de fluido supera drenagem
- Use compressão sempre (20-30 mmHg)
- Superfície plana (evite morros)
- Ritmo moderado (consiga conversar)

**Seu termômetro:**
- Inchaço igual/menor após 2h → adequado
- Inchaço maior que resolve em 4h → no limite
- Inchaço que dura 12h+ → reduza`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Yoga ou Pilates ajudam no lipedema? Penso na circulação, flexibilidade e no estresse que piora inflamação.',
      isAIResponse: false,
      userId: 'user_10'
    },
    {
      content: `Excelente conexão entre estresse-inflamação-lipedema!

**Yoga para lipedema:**
- Reduz cortisol (estresse crônico piora inflamação)
- Posturas invertidas (pernas na parede) favorecem retorno linfático
- Pranayama melhora função do diafragma (motor da linfa)
- Flexibilidade mantida
- Rating: ⭐⭐⭐⭐⭐ para estresse/inflamação

**Pilates para lipedema:**
- Fortalecimento de core (estabiliza pelve)
- Exercícios em decúbito reduzem efeito gravidade
- Baixo impacto
- Rating: ⭐⭐⭐⭐⭐ para fortalecimento

**Recomendação:** Combine ambas! 2x aquático + 2x pilates + 1x yoga é um combo excelente!`,
      isAIResponse: true,
      userId: aiUserId
    },
    {
      content: 'Moro no Nordeste e o calor é constante. Nos dias quentes minhas pernas incham MUITO mais. Como lidar com lipedema em região quente?',
      isAIResponse: false,
      userId: 'user_11'
    },
    {
      content: `Calor é um fator agravante real! Causa vasodilatação e aumenta permeabilidade vascular — no lipedema, esse fluido extra se acumula.

**Estratégias:**
1. **Horário:** 5-7h manhã ou após 18h. Evite 10h-16h
2. **Piscina:** Seu melhor aliado! Água refresca + comprime
3. **Compressão inteligente:** Modelos "summer" de tecido fino
4. **Hidratação reforçada:** 2.5-3L água/dia + sal + limão
5. **Banho frio pós-exercício:** 20-24°C por 3-5 min (vasoconstrição)
6. **Roupas:** Largas, tecidos que respiram
7. **Noite:** Elevar pernas + ventilador/ar condicionado

O calor é sério mas manejável com adaptações!`,
      isAIResponse: true,
      userId: aiUserId
    }
  ];

  console.log(`\n🧵 Criando ${posts.length} posts...`);

  for (const post of posts) {
    await prisma.post.create({
      data: {
        content: post.content,
        arenaId: ARENA_ID,
        userId: post.userId,
        isAIResponse: post.isAIResponse,
        isPublished: true,
        isApproved: true,
        createdAt: nextTime()
      }
    });
  }

  // Atualizar arena com contadores
  const postCount = await prisma.post.count({
    where: { arenaId: ARENA_ID }
  });

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED COMPLETO — Lipedema: Paradoxo do Cardio');
  console.log('═'.repeat(60));
  console.log(`📊 Posts criados: ${postCount}`);
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
