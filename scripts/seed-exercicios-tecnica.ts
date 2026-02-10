import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ SEED: Arena Exercícios & Técnica\n');

  let arena = await prisma.arena.findFirst({
    where: { OR: [{ slug: 'exercicios-tecnica' }, { name: { contains: 'Exercícios' } }] }
  });

  if (!arena) {
    arena = await prisma.arena.create({
      data: {
        slug: 'exercicios-tecnica',
        name: '🏋️ Exercícios & Técnica',
        description: 'Discussão profunda sobre técnica de exercícios, progressão de carga, segurança, movimento e otimização de performance. De iniciante a avançado.',
        icon: '🏋️',
        color: '#EF4444',
        category: 'TREINO_EXERCICIOS',
        isActive: true,
        aiPersona: 'SCIENTIFIC',
        categoria: 'TREINO_EXERCICIOS'
      }
    });
  }

  const ARENA_ID = arena.id;
  console.log('✅ Arena:', arena.name);

  const deletedPosts = await prisma.post.deleteMany({ where: { arenaId: ARENA_ID } });
  console.log(`🗑️ ${deletedPosts.count} posts apagados`);

  const userNames = [
    { id: 'user_ex_001', name: 'Técnica Barbosão', email: 'tecnica.barbosa@example.com' },
    { id: 'user_ex_002', name: 'Coach Forma', email: 'coach.forma@example.com' },
    { id: 'user_ex_003', name: 'Levanta Pesado', email: 'levanta.pesado@example.com' },
    { id: 'user_ex_004', name: 'Biomecânica João', email: 'biomecanica.joao@example.com' },
    { id: 'user_ex_005', name: 'Movimento Natural', email: 'movimento.natural@example.com' },
    { id: 'user_ex_006', name: 'Segurança First', email: 'seguranca.first@example.com' },
    { id: 'user_ex_007', name: 'Iniciante Plus', email: 'iniciante.plus@example.com' },
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

  let aiUser = await prisma.user.findUnique({ where: { email: 'ia-exercicios@example.com' } });
  if (!aiUser) {
    aiUser = await prisma.user.create({
      data: { email: 'ia-exercicios@example.com', name: 'IA — Exercícios & Técnica', password: 'hashed' }
    });
  }

  let baseTime = new Date('2026-02-05T16:00:00Z');
  const nextTime = () => {
    baseTime = new Date(baseTime.getTime() + (35 + Math.floor(Math.random() * 75)) * 60000);
    return new Date(baseTime);
  };

  const posts = [
    // THREAD 1: Agachamento profundo
    {
      content: 'Agachamento profundo — é seguro ou sobrecarga de joelho?',
      userId: userIds['user_ex_001'],
      isAIResponse: false
    },
    {
      content: 'Vejo muita divergência: alguns dizem agachar até o fundo é perigoso para joelho (passam 90°), outros dizem que é o padrão. Qual é a realidade científica? Há profundidade ideal?',
      userId: userIds['user_ex_001'],
      isAIResponse: false
    },
    {
      content: `Agachamento profundo é SEGURO se técnica está correta. A confusão vem de:

**Mito antigo:** "Não passe 90° no joelho = risco"
**Realidade:** Agachamento profundo (até fundo) é seguro EM indivíduos com:
- Mobilidade adequada
- Técnica correta
- Progressão apropriada

**Ciência:**

Meta-análise (2014, múltiplos estudos):
- Agachamento profundo ≠ aumento de lesão de joelho
- Atletas com ACL intacto: agachamento profundo é seguro
- Padrão de ativação muscular é MELHOR em profundidade maior

**Dados biomecânicos:**

| Profundidade | Stress joelho | Ativação glúteo | Efetividade |
|--------------|---------------|-----------------|-------------|
| 60° (raso) | Baixo | Fraco | Baixa |
| 90° (paralelo) | Moderado | Bom | Boa |
| 110°+ (profundo) | Maior | Excelente | Excelente |

**Importante:** Stress MAIOR em joelho profundo, MAS:
1. Joelho é articulação que SUPORTA carga (design)
2. Glúteo ativa mais (protege joelho)
3. Se progressão é gradual: se adapta

**O PORÉM:**

Agachamento profundo EXIGE:
1. Mobilidade de quadril (flexibilidade)
2. Estabilidade de tornozelo (dorsiflexão)
3. Força de core (estabiliza coluna)
4. Técnica: costas neutra, joelhos sobre pés

**Técnica CORRETA para profundo:**

1. Pés ombro-largura
2. Peito elevado
3. Descida lenta (2-3 seg)
4. Fundo: joelhos flexos 100-120°, quadril abaixo do joelho
5. Costas retas (não arredonda)
6. Joelhos rastreando sobre 2º/3º dedo
7. Subida com explosão

**Progressão correta:**

Semana 1-2: Agachamento ao paralelo (90°), 3x8
Semana 3-4: Agachamento "em transição" (100°), 3x8
Semana 5+: Agachamento profundo (fundo), 3x8

**Quando EVITAR profundo:**

- Lesão prévia de joelho (ACL, menisco)
- Mobilidade ruim (não consegue manter forma)
- Dor durante movimento (stop imediatamente)

**Benefício do profundo:**

- Ganho muscular maior (+5-10% vs paralelo)
- Ativação glúteo máximo (80% mais)
- Transferência funcional melhor

Qual é seu nível de mobilidade/experiência?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Sou intermediário, bom nível de mobilidade, zero lesões. Vou começar a aprofundar então. Quanto peso deveria "soltar" para manter técnica?',
      userId: userIds['user_ex_001'],
      isAIResponse: false
    },
    {
      content: `Intermediário + mobilidade boa = pode aprofundar. Reduza carga em 15-20% (não precisa ser dramático). Em 2-3 semanas você volta ao peso anterior COM técnica profunda melhor.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // THREAD 2: Variantes de rosca
    {
      content: 'Rosca direta vs supino — qual é mais efetiva para bíceps?',
      userId: userIds['user_ex_002'],
      isAIResponse: false
    },
    {
      content: 'Eu faço rosca direta e supino. Que musculam bíceps, mas qual é MAIS efetiva? Devo priorizar uma? Fazem a mesma coisa?',
      userId: userIds['user_ex_002'],
      isAIResponse: false
    },
    {
      content: `Não fazem a mesma coisa. Diferenças biomecânicas importantes:

**ROSCA DIRETA (barbell curl):**

Ativação muscular:
- Bíceps: 100% (máximo)
- Braquial: 40%
- Braquiorradial: 30%

Vantagem:
- Isolamento máximo de bíceps
- Carga pesada possível
- Movimento simples

Desvantagem:
- Desestabiliza coluna (risco de arco, trapz ativa demais)
- Menor amplitude (cotovelo não estende 100%)

**SUPINO (barbell bench):**

Ativação muscular:
- Bíceps: 10-15% (mínimo)
- Peitoral: 80%
- Triceps: 70%

Realidade:
- Supino é exercício de PEITO, não bíceps
- Bíceps apenas auxilia em certa amplitude

**QUAL ESCOLHER:**

Para ganho ESPECÍFICO de bíceps:
- Rosca direta > supino

Para força geral + ganho bíceps:
- Rosca direta + supino (complementam)

**PROTOCOLO OTIMIZADO:**

Se quer bíceps grande:

**Opção A (Isolamento):**
- 4x8 rosca direta (força)
- 3x12 rosca inclinada (alongamento)
- 3x15 rosca martelo (braquial, suporte)

**Opção B (Força + volume):**
- 4x6 rosca close-grip supino (força geral)
- 3x12 rosca direta (volume)
- 3x15 rosca martelo

**Dados:** Rosca direta +8-10% crescimento vs supino para bíceps.

Qual é seu objetivo — força ou estética?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Estética, quer bíceps grande. Vou priorizar rosca direta então, complementar com martelo.',
      userId: userIds['user_ex_002'],
      isAIResponse: false
    },

    // THREAD 3: Deadlift técnica
    {
      content: 'Deadlift — costas arredondadas no início = risco?',
      userId: userIds['user_ex_003'],
      isAIResponse: false
    },
    {
      content: 'Na saída do chão, minha coluna fica levemente arredondada (cifose). Eu consigo levantar peso, mas parece "perigoso". É lesão em potencial ou é aceitável?',
      userId: userIds['user_ex_003'],
      isAIResponse: false
    },
    {
      content: `Cifose leve na saída é muito comum MAS não é ideal. Risco existe, mas depende:

**Ciência:**

Costas arredondadas no deadlift:
- Aumenta shear force na coluna (risco pequeno)
- Reduz ativação de glúteo (~15%)
- Aumenta ativação de costas (~20%)

NÃO é imediatamente perigoso, MAS:
1. Risco aumenta com volume (múltiplas séries)
2. Risco aumenta com intensidade (cargas >85%)
3. Risco aumenta com treino frequente (>1x/semana pesado)

**Técnica CORRETA (posição saída):**

1. Pés ombro-largura, dedos apontam levemente para frente
2. Cotovelos estendidos, braços retos
3. Barra perto do corpo (15cm)
4. Costas NEUTRAIS (não arredondadas)
5. Quadril baixo (não muito alto)
6. Olhar: frente, coluna segue

**Como corrigir cifose inicial:**

1. **Mobilidade:** Tornozelo dorsiflexão + flexor de quadril alongado
2. **Força:** Prancha + glúteo bridge (ativa extensores)
3. **Carga reduzida:** Desce o peso em 10-20%, pratica forma
4. **Vídeo:** Grava lateral, verifica se costas estão retas

**Progressão:**

Semana 1-3: Peso reduzido, forma perfeita
Semana 4-6: Aumenta carga gradual, mantém forma
Semana 7+: Volta ao peso anterior, forma corrigida

**Benchmark:**

Você consegue fazer deadlift leve (só barra) com costas 100% neutrais?
- Se SIM: é só falta de consciência postural (fácil corrigir)
- Se NÃO: mobilidade/força limitada (mais tempo)

Qual é a sua situação?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Com só a barra consigo manter neutro sim. Então é consciência postural mesmo. Vou fazer com carga leve e vídeo.',
      userId: userIds['user_ex_003'],
      isAIResponse: false
    },

    // THREAD 4: Isolamento vs compostos
    {
      content: 'Isolamento vs compostos — qual devo focar como iniciante?',
      userId: userIds['user_ex_004'],
      isAIResponse: false
    },
    {
      content: 'Comecei na academia há 2 meses. Vejo muito debate: alguns falam que iniciante deve fazer SÓ compostos (supino, agachamento, deadlift), outros falam que isolamento é tão importante. Qual devo priorizar?',
      userId: userIds['user_ex_004'],
      isAIResponse: false
    },
    {
      content: `Para iniciante, a resposta é PRAGMÁTICA e não ideológica:

**PRIORIDADE 1 (80% do tempo): Exercícios Compostos**

Por quê:
1. Aprender padrão de movimento (fundamental)
2. Ativar múltiplos músculos (eficiência)
3. Ganho de força máximo
4. Economia de tempo

Compostos obrigatórios:
- Supino ou rosca (push superior)
- Agachamento (push inferior)
- Deadlift ou Remada (pull)

**PRIORIDADE 2 (20% do tempo): Isolamento**

Fins (não meios):
1. Corrigir fraqueza específica
2. Complementar ganho muscular
3. Prevenir lesão

Exemplos:
- Bíceps fraco? Rosca direta
- Peitoral desbalanceado? Pec deck
- Ombro fraco? Lateral raise

**PROTOCOLO INICIANTE (3 dias/semana):**

**Segunda (Push):**
- Supino 4x8 (composto principal)
- Rosca inclinada 3x10 (composto assistência)
- Triceps corda 3x12 (isolamento)

**Quarta (Pull):**
- Remada barra 4x8 (composto principal)
- Puxada lateral 3x10 (composto assistência)
- Rosca direta 3x8 (isolamento bíceps)

**Sexta (Perna):**
- Agachamento 4x8 (composto principal)
- Leg press 3x10 (composto assistência)
- Extensão de perna 3x12 (isolamento quad)

**Ratio: 70% compostos, 30% isolamento**

**Erros comuns iniciante:**

❌ Focar SÓ em isolamento (mau para aprendizado)
❌ Ignorar isolamento (desbalanceios futuros)
❌ Forma ruim em compostos (lesão, progresso lento)

**Timeline:**

Mês 1-3: 80% compostos, 20% isolamento (aprender padrão)
Mês 4-6: 70% compostos, 30% isolamento (começar especialização)
Mês 6+: 60% compostos, 40% isolamento (especialização real)

Você está seguindo algum programa estruturado?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Não, estou fazendo por conta própria. Vou estruturar assim: 70% compostos, 30% isolamento. Obrigada!',
      userId: userIds['user_ex_004'],
      isAIResponse: false
    },

    // THREAD 5: Progressão de carga
    {
      content: 'Progressão de carga — quanto aumentar por semana?',
      userId: userIds['user_ex_005'],
      isAIResponse: false
    },
    {
      content: 'Toda semana eu aumento 2.5kg no supino. Às vezes consigo, às vezes não. Qual é a progressão ideal? Tem fórmula exata?',
      userId: userIds['user_ex_005'],
      isAIResponse: false
    },
    {
      content: `Progressão é INDIVIDUAL, mas existem parâmetros científicos:

**PROGRESSIVE OVERLOAD — Princípios:**

Não é só aumentar peso. É aumentar demanda:

| Método | Exemplo | Frequência |
|--------|---------|-----------|
| Aumentar peso | 60kg → 62.5kg | 1-2x/mês |
| Aumentar reps | 8 reps → 10 reps | Semanal |
| Aumentar séries | 3x8 → 4x8 | 2-3x/mês |
| Aumentar frequência | 1x/semana → 2x/semana | Cada 8-12 semanas |

**VELOCIDADE IDEAL DE PROGRESSÃO (por experiência):**

| Nível | Aumento semanal | Método |
|-------|-----------------|--------|
| Iniciante (<6 meses) | +2.5-5kg/semana | Peso ou reps |
| Intermediário (6-18 meses) | +2.5-5kg/2 semanas | Peso ou reps |
| Avançado (>18 meses) | +2.5kg/4 semanas | Peso (muito lento) |
| Elite (>3 anos) | +1-2kg/mês | Peso ou reps |

**SEU CASO (2kg/semana aumento):**

+2.5kg supino por semana é:
- Para iniciante: ÓTIMO
- Para intermediário: AGRESSIVO
- Para avançado: IMPOSSÍVEL (muro)

**Progressão recomendada:**

**Mês 1:** +2.5kg semana (iniciante velocidade)
**Mês 2:** +2.5kg a cada 2 semanas (começar desacelerar)
**Mês 3+:** +2.5kg a cada 3 semanas (intermediário)

**Sinais de progressão SAUDÁVEL:**

✅ Consegue progressão
✅ Sem dor (incômodo ok, dor NÃO)
✅ Técnica mantém (sem trucar movimento)

⚠️ Sinais de MUITO agressivo:
- Não consegue fazer séries completas
- Técnica piora (arco, trapz high)
- Dor (diferente de queimação muscular)
- Plateou por 2-3 semanas

**Se plateou em 2kg/semana:**

Opções:
1. Desce para +2.5kg a cada 2 semanas
2. Aumenta reps em vez de peso (8 → 12 reps)
3. Adiciona série (3x8 → 4x8)
4. Muda ângulo/variante (supino → supino inclinado)

Qual é seu nível de experiência?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Estou há 6 meses na academia, então intermediário. Vou desacelerar para +2.5kg a cada 2 semanas para manter longevidade.',
      userId: userIds['user_ex_005'],
      isAIResponse: false
    },
    {
      content: 'Boa decisão! Longevidade em treino é chave. Muitos iniciantes querem ganho rápido e se machucam em 1 ano. Seu jeito é melhor.',
      userId: userIds['user_ex_006'],
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
        viewCount: Math.floor(Math.random() * 85),
        likeCount: Math.floor(Math.random() * 42),
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
  console.log('✅ SEED COMPLETO — Exercícios & Técnica');
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
