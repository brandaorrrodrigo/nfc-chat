import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ SEED: Arena Performance & Biohacking\n');

  let arena = await prisma.arena.findFirst({
    where: { OR: [{ slug: 'performance-biohacking' }, { name: { contains: 'Performance' } }] }
  });

  if (!arena) {
    arena = await prisma.arena.create({
      data: {
        slug: 'performance-biohacking',
        name: '💊 Performance & Biohacking',
        description: 'Ciência aplicada sem filtro. Protocolos de elite, farmacologia avançada, estratégias de otimização de performance física e cognitiva. Discussões sobre redução de danos, evidence-based protocols, e otimização biológica.',
        icon: '💊',
        color: '#EC4899',
        category: 'SAUDE_CONDICOES_CLINICAS',
        isActive: true,
        aiPersona: 'SCIENTIFIC',
        categoria: 'SAUDE_CONDICOES_CLINICAS'
      }
    });
  }

  const ARENA_ID = arena.id;
  console.log('✅ Arena:', arena.name);

  const deletedPosts = await prisma.post.deleteMany({ where: { arenaId: ARENA_ID } });
  console.log(`🗑️ ${deletedPosts.count} posts apagados`);

  const userNames = [
    { id: 'user_perf_001', name: 'Dr. Performance', email: 'dr.performance@example.com' },
    { id: 'user_perf_002', name: 'Elite Coach', email: 'elite.coach@example.com' },
    { id: 'user_perf_003', name: 'Biohacker Marcus', email: 'marcus.biohacker@example.com' },
    { id: 'user_perf_004', name: 'Sci Evidence', email: 'sci.evidence@example.com' },
    { id: 'user_perf_005', name: 'Otimização Igor', email: 'otimizacao.igor@example.com' },
    { id: 'user_perf_006', name: 'Atleta Pro', email: 'atleta.pro@example.com' },
    { id: 'user_perf_007', name: 'Research Julia', email: 'research.julia@example.com' },
  ];

  const userIds: Record<string, string> = {};
  for (const userData of userNames) {
    let user = await prisma.user.findUnique({ where: { email: userData.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { id: userData.id, email: userData.email, name: userData.name, password: 'hashed' }
      });
    }
    userIds[userData.id] = user.id;
  }

  let aiUser = await prisma.user.findUnique({ where: { email: 'ia-performance@example.com' } });
  if (!aiUser) {
    aiUser = await prisma.user.create({
      data: { email: 'ia-performance@example.com', name: 'IA — Performance & Biohacking', password: 'hashed' }
    });
  }

  let baseTime = new Date('2026-02-05T14:00:00Z');
  const nextTime = () => {
    baseTime = new Date(baseTime.getTime() + (40 + Math.floor(Math.random() * 80)) * 60000);
    return new Date(baseTime);
  };

  const posts = [
    // THREAD 1: Periodização avançada
    {
      content: 'Periodização avançada — block vs conjugate vs undulating?',
      userId: userIds['user_perf_001'],
      isAIResponse: false
    },
    {
      content: 'Estou estudando modelos de periodização. Vi muito sobre: block periodization (Yuri Verkhoshansky), conjugate method (Louie Simmons), undulating periodization, e agora daily undulating (DUP). Qual é superior? Existe "melhor"?',
      userId: userIds['user_perf_001'],
      isAIResponse: false
    },
    {
      content: `Não existe "melhor" absoluto, mas trade-offs significativos. Vou comparar:

**BLOCK PERIODIZATION (Verkhoshansky)**

Estrutura: Foco sequencial em qualidades motoras (acumulação → intensificação → realização)

Semana 1-3: Acumulação (hipertrofia, volume alto)
Semana 4-6: Intensificação (força, 85%+ 1RM)
Semana 7-9: Realização (pico de performance)

Vantagens:
- Adaptação profunda a cada qualidade
- Minimiza interferência entre estímulos
- Dados de atletas elite europeus

Desvantagens:
- Exige 9+ semanas mínimo
- Difícil manter hipertrofia durante bloco de força
- Maçante psicologicamente

**CONJUGATE METHOD (Louie Simmons)**

Estrutura: Rotação diária de qualidades (força máxima, força-velocidade, força dinâmica, hipertrofia)

Segunda: Max effort (85-90% 1RM, 1-3 reps)
Terça: Dynamic effort (50-60% 1RM, velocidade)
Quarta: Acessórios
Quinta: Repetition method (8-12 reps)

Vantagens:
- Frequência alta de estímulos
- Mantém todas qualidades
- Adaptável a lesões (trocar exercício principal)

Desvantagens:
- Exige técnica excelente
- Equipamento específico
- Complexidade programação

**DAILY UNDULATING (DUP)**

Estrutura: Mesma semana, diferentes qualidades cada dia

Segunda: Força (3-5 reps, 85-90%)
Terça: Hipertrofia (8-12 reps, 65-75%)
Quinta: Força-velocidade (5-8 reps, 75-85%)

Vantagens:
- Frequência moderada, simplicidade alta
- Bom para iniciados-intermediários
- Resultado >block para maioria

Desvantagens:
- Menos especialização
- Interferência entre estímulos (menor que se fosse ignorado)

**COMPARAÇÃO DIRETA (Meta-análises):**

| Modelo | Ganho força | Hipertrofia | Aderência | Melhor para |
|--------|-------------|------------|-----------|------------|
| Block | 8-12% | 6-8% | Média | Elite em transição |
| Conjugate | 10-15% | 8-10% | Baixa | Powerlifters experientes |
| DUP | 8-10% | 8-10% | Alta | Maioria dos atletas |

**Recomendação prática:**

- **Iniciante:** DUP (simplicidade, aderência)
- **Intermediário:** DUP ou Block (10-12 semanas)
- **Avançado:** Conjugate (dominância + acessórios rotativos)
- **PTSD/lesão frequente:** Conjugate (adaptabilidade)

Qual é seu nível e objetivo?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Sou intermediário, ganho força é importante mas também estética (hipertrofia). Qual recomenda?',
      userId: userIds['user_perf_001'],
      isAIResponse: false
    },
    {
      content: `DUP. Combina força + hipertrofia melhor que block para seu objetivo. Estrutura: 4 dias semana, duas qualidades por semana cada exercício principal.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // THREAD 2: Altitude training
    {
      content: 'Altitude training — é efetivo ou é $$$$ marketing?',
      userId: userIds['user_perf_002'],
      isAIResponse: false
    },
    {
      content: 'Vi atletas indo para altitude (1500-2500m) para "acumular eritrócitos" e aumentar capacidade aeróbica. Alguns fazem "live high train low". Qual é a ciência real? Vale o investimento?',
      userId: userIds['user_perf_002'],
      isAIResponse: false
    },
    {
      content: `Altitude training é REAL e efetivo, MAS com condições específicas. Não é marketing, mas frequentemente aplicado errado.

**Fisiologia:**
- Oxigênio menor em altitude → hipóxia crônica
- Corpo responde: aumento de EPO (eritropoietina)
- Produção de glóbulos vermelhos aumenta 8-15%
- Maior transporte de oxigênio

**"Live high, train low" (LHTL):**

Melhor abordagem: dormir em altitude, treinar em densidade normal

Efeitos comprovados:
- VO2max +5-10% (mais confiável)
- Resistência anaeróbica +3-7%
- Força: sem efeito direto

**Duração mínima:**
- 3 semanas: efeito marginal
- 4-6 semanas: efeito robusto
- 8+ semanas: ganhos máximos (depois platô)

**Custos/Benefícios:**

Vantagens:
- Ganho de VO2max sem farmacologia
- Efeito dura 2-3 semanas após saída

Desvantagens:
- Caro ($$ resort/voo/hospedagem)
- Perda de força durante aclimatação (dia 1-5 você está fraco)
- Requer pausa de treinamento intenso
- Nem todos toleram bem (mal-estar, insônia)

**Alternativa: Câmara hipóxica**

- Custo menor ($15k-40k máquina)
- Mesmos efeitos
- Menos confortável

**Comparação com doping EPO:**
- Altitude: legal, seguro, +5-10% VO2max
- EPO: ilegal, risco cardiovascular, +15%+ VO2max

**Recomendação:**
Se está 3-4 meses de competição e tem orçamento: LHTL é investimento válido. Se treina por saúde/estética: não justifica custo-benefício.

Qual é seu esporte?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Sou corredor de meia maratona. Considera relevante para meu nível?',
      userId: userIds['user_perf_002'],
      isAIResponse: false
    },
    {
      content: `Para meia maratona competitiva: SIM, altitude é relevante. VO2max é principal limitante. Se tem tempo e orçamento antes de season: recomendo. Se não, treino aeróbico high-intensity repetido é 80% do benefício, 0% do custo.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // THREAD 3: Nitrato dietético
    {
      content: 'Suco de beterraba — realmente melhora performance?',
      userId: userIds['user_perf_003'],
      isAIResponse: false
    },
    {
      content: 'Vi estudos que suco de beterraba (nitrato) melhora performance aeróbica, vasodilatação. Mas quanto tomar? Quando tomar? Qual é o efeito real em números?',
      userId: userIds['user_perf_003'],
      isAIResponse: false
    },
    {
      content: `Nitrato dietético é uns dos poucos suplementos com FORTE evidência de performance.

**Mecanismo:**
Nitrato → óxido nítrico (NO) → vasodilatação → maior fluxo sanguíneo → melhor O2

**Eficácia:**

Meta-análise (2016, 54 estudos):
- VO2max: +2-3% em atletas aeróbicos
- Resistência: +5-10% em capacidade anaeróbica
- Força: sem efeito

**Dosagem EXATA:**

500ml suco de beterraba = 400-500mg nitrato

Protocolo efetivo:
- Dia 1: 2-3 horas PRÉ-treino: 500ml suco
- Efeito máximo: 2.5-3 horas post-ingestão
- Duração: 2-24h

**Versão concentrada:**
200ml suco concentrado = mesmo efeito, menos volume

**Para múltiplos dias:**
- Estudos sugerem: 500ml/dia × 5-6 dias
- Acumula NO disponível

**Efeito tamanho:**
- Treino moderado: +2-3%
- Treino alta intensidade: +5-7%
- Já atleta elite: efeito menor

**Cuidados:**

- Suco caseiro: oxidação, perde eficácia
- Comprado: melhor estabilidade
- Alguns tem pouca NO biodisponibilidade (variam muito)
- Interação com antácidos reduz absorção

**Benchmark:**
- Atleta anaeróbico indo pro aeróbico: recomendo SIM
- Já corredor elite: efeito marginal
- Saúde geral: nenhum efeito significativo

Qual é sua modalidade/meta?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Treino força + HIIT. Seria mais relevante para cardio, certo? Ou vale a pena tentar?',
      userId: userIds['user_perf_003'],
      isAIResponse: false
    },
    {
      content: `Força + HIIT: nitrato vale mais em HIIT (capacidade anaeróbica ganha 5-7%). Força: zero. Tenta em sessão pré-HIIT, vê se sente diferença.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // THREAD 4: Hormônio de crescimento natural
    {
      content: 'GH secretagogos — peptídeos que estimulam GH, são efetivos?',
      userId: userIds['user_perf_004'],
      isAIResponse: false
    },
    {
      content: 'Vi hype sobre GHRP-6, MK-677 (ibutamoren), peptídeos que "aumentam GH naturalmente". Qual é a evidência? É seguro?',
      userId: userIds['user_perf_004'],
      isAIResponse: false
    },
    {
      content: `GH secretagogos têm farmacologia real, mas com caveats importantes:

**Mecanismo:**

GHRP-6 (Growth Hormone Releasing Peptide):
- Estimula liberação de GH via grelina
- Aumenta GH plasmático 5-20x em curtas pulsas
- Duração: 30-60 min

MK-677 (Ibutamoren):
- Agonista de grelina oral
- Aumento sustentado de GH (não pulsátil)
- Duração: contínua enquanto tomar

**Estudos:**

GHRP-6:
- Aumento GH: SIM, confirmado
- Performance: ~0-2% (estudos fracos)
- Hipertrofia: marginal vs placebo

MK-677:
- Aumento GH: SIM
- IGF-1: +20-30%
- Hipertrofia: +2-4% (estudos patrocinados)
- Independentes: efeito fraco

**Problemas:**

1. **GH pulsátil vs contínuo**
   - Corpo produz GH em pulsos (noite, pós-treino)
   - Peptídeos geram padrão diferente (anormal)
   - Efetividade desconhecida a longo prazo

2. **Efeitos colaterais:**
   - Aumento cortisol (stress sistêmico)
   - Aumento prolactina (alguns)
   - Retenção hídrica
   - Aumento apetite excessivo (MK-677)

3. **Tolerância:**
   - Dessensibilização em 4-8 semanas
   - Exige ciclos

4. **Status regulatório:**
   - GHRP-6: Research only
   - MK-677: Pesquisa (não aprovado)
   - Venda online: frequentemente falsificada

**Alternativas comprovadas:**

Para aumentar GH endógeno:
- Treino de força pesado (+200% GH pós treino)
- Sono 8h (crítico)
- Jejum intermitente (aumento GH)
- Arginine + Lysine (efeito fraco, seguro)

**Recomendação:**
Se quer crescimento muscular: treino periodizado + sono + nutrição > secretagogos experimentais. Se quer "otimização": argumenta risco experimental > benefício marginal.

Qual era seu objetivo?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Ganho muscular é objetivo. Então focar em treino + sono + comida é mais efetivo. Entendi.',
      userId: userIds['user_perf_004'],
      isAIResponse: false
    },

    // THREAD 5: Redução de danos
    {
      content: 'Redução de danos — protocolos para uso de substâncias "contínuo"?',
      userId: userIds['user_perf_005'],
      isAIResponse: false
    },
    {
      content: 'Vejo muito protocolo de "harm reduction" em contextos de uso de substâncias. Alguns atletas usam (AAS, SARMs, etc.) continua. Qual é o protocolo de redução de danos real? Exame de sangue, doses, etc.?',
      userId: userIds['user_perf_005'],
      isAIResponse: false
    },
    {
      content: `Harm reduction é real medicina pública de saúde. Aqui estão os protocolos baseados em evidência:

**Princípio:**
Reconhecer que alguns indivíduos VÃO usar (lei, moral fora escopo). Objetivo: minimizar dano.

**PROTOCOLO REDUÇÃO DE DANOS — ANABOLIZANTES:**

**Antes de iniciar:**
1. Exames baseline:
   - Perfil lipídico (colesterol, HDL, LDL, triglicerídeos)
   - Enzimas hepáticas (ALT, AST, bilirrubina)
   - Testosterona, LH, FSH
   - Hematócrito (risco policitemia)
   - Pressão arterial

2. Consulta cardiologista (EKG basal recomendado)

**Durante uso:**

Testosterona 300-500mg/semana:
- Exames a cada 8 semanas
- Pressão mensal
- Se LDL >200: adicionar estatina
- Se hematócrito >52%: doação de sangue

Doses mais altas (>500mg/sem):
- Monitoramento a cada 4 semanas
- Ultrassom cardíaco anual (hipertrofia VE)
- Consulta hepato

**Drogas com risco maior:**

| Droga | Risco principal | Monitoramento |
|-------|-----------------|----------------|
| Testosterone | Lipídios, coração | 8 semanas |
| Tren | Cardíaco, renal | 4 semanas |
| Orais | Hepático | 4 semanas |
| SARMs | Desconhecido (novo) | 4-8 semanas |

**Proteção adicional:**

- AI (Anastrozol) para estrogênio >50
- Estatina se LDL alto
- Antihipertensivo se necessário
- Ciclo: máximo 12-16 semanas contínuo, depois pausa 4-6 semanas

**Terapia pós-ciclo (PCT):**

Essencial para restaurar HPTA:
- Tamoxifeno 40-20mg × 4 semanas
- Ou Clomid 100-50mg × 4 semanas
- HCG durante ciclo (preserva testículos)

**Recomendação moral/médica:**
NÃO recomendo. MAS se vai fazer: protocolo acima reduz risco em 80%. Sem monitoramento: risco cardiovascular = jogador de roleta russa.

Qual é sua situação?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Só curiosidade médica mesmo. Acho importante saber o que existe para orientar pessoas corretamente.',
      userId: userIds['user_perf_005'],
      isAIResponse: false
    },
    {
      content: 'Exatamente isso. Conhecimento de harm reduction salva vidas. Melhor que deixar na mão de coaches ignorantes sem monitoramento..',
      userId: userIds['user_perf_006'],
      isAIResponse: false
    },
  ];

  console.log(`\n📝 Criando ${posts.length} posts...`);
  for (const post of posts) {
    await prisma.post.create({
      data: {
        arenaId: ARENA_ID,
        userId: post.userId,
        content: post.content,
        isPublished: true,
        isApproved: true,
        isAIResponse: post.isAIResponse,
        viewCount: Math.floor(Math.random() * 100),
        likeCount: Math.floor(Math.random() * 50),
        createdAt: nextTime()
      }
    });
  }

  const totalPosts = await prisma.post.count({ where: { arenaId: ARENA_ID } });
  const uniqueUsers = await prisma.post.findMany({
    where: { arenaId: ARENA_ID, isAIResponse: false },
    select: { userId: true },
    distinct: ['userId']
  });

  await prisma.arena.update({
    where: { id: ARENA_ID },
    data: { totalPosts, dailyActiveUsers: uniqueUsers.length, status: 'WARM' }
  });

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED COMPLETO — Performance & Biohacking');
  console.log('═'.repeat(60));
  console.log(`📊 Posts: ${totalPosts} | Usuários: ${uniqueUsers.length}`);
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
