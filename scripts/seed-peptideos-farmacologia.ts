import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🏟️ SEED: Arena Peptídeos & Farmacologia\n');

  let arena = await prisma.arena.findFirst({
    where: { OR: [{ slug: 'peptideos-farmacologia' }, { name: { contains: 'Peptídeos' } }] }
  });

  if (!arena) {
    arena = await prisma.arena.create({
      data: {
        slug: 'peptideos-farmacologia',
        name: '🧬 Peptídeos & Farmacologia',
        description: 'Discussões sobre peptídeos bioativos, farmacologia aplicada à saúde e performance. Mecanismos de ação, evidências clínicas, aplicações práticas e segurança.',
        icon: '🧬',
        color: '#8B5CF6',
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
    { id: 'user_pep_001', name: 'Dr. Carlos Magno', email: 'carlos.magno@example.com' },
    { id: 'user_pep_002', name: 'Marina Peptídeos', email: 'marina.peptideos@example.com' },
    { id: 'user_pep_003', name: 'Rafael Farmaco', email: 'rafael.farmaco@example.com' },
    { id: 'user_pep_004', name: 'Bioquímica Laura', email: 'laura.bioquimica@example.com' },
    { id: 'user_pep_005', name: 'Igor Performance', email: 'igor.performance@example.com' },
    { id: 'user_pep_006', name: 'Ana Ciência', email: 'ana.ciencia@example.com' },
    { id: 'user_pep_007', name: 'Felipe Studos', email: 'felipe.studos@example.com' },
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

  let aiUser = await prisma.user.findUnique({ where: { email: 'ia-peptideos@example.com' } });
  if (!aiUser) {
    aiUser = await prisma.user.create({
      data: { email: 'ia-peptideos@example.com', name: 'IA — Peptídeos & Farmacologia', password: 'hashed' }
    });
  }

  let baseTime = new Date('2026-02-05T09:00:00Z');
  const nextTime = () => {
    baseTime = new Date(baseTime.getTime() + (40 + Math.floor(Math.random() * 80)) * 60000);
    return new Date(baseTime);
  };

  const posts = [
    // THREAD 1: BPC-157
    {
      content: 'BPC-157 — peptídeo que repara tudo? Evidência científica real?',
      userId: userIds['user_pep_001'],
      isAIResponse: false
    },
    {
      content: 'Ouço muito falar em BPC-157 (Body Protection Compound-157) para regeneração de tecido, cicatrização de lesões, até saúde gut. Mas é hype marketing ou tem base científica real? Qual é o mecanismo? Segurança a longo prazo?',
      userId: userIds['user_pep_001'],
      isAIResponse: false
    },
    {
      content: `BPC-157 é um peptídeo derivado de gastricina (proteína gástrica). A evidência é interessante mas AINDA em fase experimental em humanos — maioria dos estudos é in vitro e animal.

**Mecanismo proposto:**
- Aumenta fator de crescimento endotelial (VEGF)
- Promove formação de novos vasos (angiogênese)
- Modula resposta inflamatória
- Estimula síntese de colágeno

**Evidência atual:**

| Estudo | Modelo | Resultado |
|--------|--------|-----------|
| Sikiric et al (2014) | Ratos com lesão | Cicatrização 40% mais rápida |
| Multiple (2016-2023) | In vitro | Aumento de VEGF confirmado |
| Humano 1 | Case report (2019) | Lesão tendão 6 semanas vs 16 típico |
| Humano 2 | Case report (2021) | Úlcera gástrica 7 dias vs 21 típico |

**Achados interessantes em animais:**
- Aceleração cicatricial de tendão, ligamento, osso
- Melhora inflamação intestinal
- Efeito protetor gástrico

**PORÉM — Ressalvas críticas:**
1. Zero estudos de longo prazo em humanos (segurança desconhecida)
2. Sem estudos de dose-resposta em humanos
3. Sem estudos comparativos (vs placebo controlado)
4. Importação é ilegal em maioria dos países
5. Fabricação caseira extremamente perigosa

**Status regulatório:**
- Não aprovado FDA
- Não aprovado ANVISA
- Uso "research only" (teoricamente)

**Recomendação prática:**
Se você tem lesão tendão/ligamento: fisioterapia + RichPRP ou terapia com células tronco têm MAIS evidência. BPC-157 é experimental demais ainda.

Qual é sua situação clínica?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Tenho uma lesão de SLAP no ombro (cirurgia recomendada). Alguns coaches falam em BPC-157 para evitar cirurgia. Vale a pena o risco?',
      userId: userIds['user_pep_001'],
      isAIResponse: false
    },
    {
      content: `Para SLAP com indicação cirúrgica: cirurgia é mais segura que BPC-157 experimental. SLAP é lesão estrutural (labral), não apenas inflamação — fisioterapia + BPC-157 (mesmo se funcionasse) dificilmente substitui reparo estrutural.

Se estiver considerando: busque orthopedista especialista em ombro para segunda opinião sobre NECESSIDADE de cirurgia. Alguns SLAPs são conserváveis, outros não. Depois, se decidir conservador, combine fisio + PRP comprovado + BPC-157 (risco aceitável no seu caso específico).

Não evite cirurgia por medo de BPC-157 experimental ser mais seguro. É o contrário.`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Lógica fria: cirurgia tem risco, BPC-157 tem risco desconhecido. Qual é "menos pior"? Cirurgia tem anestesia (risco), imobilização, reabilitação 6+ meses. BPC-157 tem risco endócrino/sistêmico desconhecido.',
      userId: userIds['user_pep_002'],
      isAIResponse: false
    },

    // THREAD 2: Aromatase Inibidores
    {
      content: 'Inibidores de aromatase para controlar estrogênio — é necessário ou paranoia?',
      userId: userIds['user_pep_003'],
      isAIResponse: false
    },
    {
      content: 'Vejo muito hype sobre inibir aromatase (enzima que converte testosterona em estrogênio) com suplementos tipo DIM, calcium-d-glucarate, etc. Questão: é necessário para controle estrogênico fisiológico ou é criar problema que não existe?',
      userId: userIds['user_pep_003'],
      isAIResponse: false
    },
    {
      content: `Depende totalmente da situação. Vou separar:

**Quando inibição de aromatase é NECESSÁRIA:**

1. **Ciclo exógeno de testosterona** (injeção/composto)
   - Excesso de conversão em estrogênio → ginecomastia, retenção, mood swings
   - Aqui, IA farmacêutico (anastrozol, letrozol) é necessário

2. **Deficiência de aromatase** (raro, congênito)
   - Alto estrogênio, hipogonadismo
   - IA necessário

**Quando suplementação é HYPE:**

Homem saudável, baixo cortisol, peso normal, zero ciclo anabolizante:
- DIM, calcium-d-glucarate: não têm evidência robusta de reduzir aromatase
- Possível placebo + efeito de perda de peso (que REALMENTE reduz aromatase)

**O que SIM funciona para controlar aromatase naturalmente:**

1. **Perda de gordura corporal** — Tecido adiposo PRODUZ aromatase
2. **Exercício de força** — Reduz aromatase via sinalização testicular
3. **Sono adequado (7-9h)** — Sono curto AUMENTA aromatase
4. **Reduzir álcool** — Álcool aumenta aromatase
5. **Micronutrientes** — Zinco, selênio (deficiência piora aromatase)

**Suplementos com alguma evidência:**

- **Dim (Diindolylmethane)**: marginal, talvez 5-10% redução
- **Calcium-d-glucarate**: débil, efeito pequeno
- **Especiarias** (cúrcuma): anti-inflamatório, efeito aromatase indireto

**Recomendação:**
Se você está saudável, magro, treina: esqueça inibidor. Se está acima do peso, dorme mal, bebe muito: FIT PRIMEIRO. Perda de gordura sozinha resolve 80% dos problemas de aromatase elevada.

Sua situação atual?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Sou homem, ~20% BF, treino força, sono 7h/noite, não bebo. Meu estrogênio está 35 pg/mL (referência 10-40). Ainda preciso inibir aromatase ou está normal?',
      userId: userIds['user_pep_003'],
      isAIResponse: false
    },
    {
      content: `35 pg/mL está ÓTIMO e fisiológico. Zero necessidade de inibição. Deixa como está. Continua seu protocolo (treino + sono + dieta).

Se chegar em 50+: aí sim, avalia perda de gordura. Se mesmo assim >50: aí considera micronutrientes (zinco). Suplemento BPC-157 para aromatase? Não recomendo, evidência fraca.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // THREAD 3: Colágeno peptídeo
    {
      content: 'Colágeno hidrolisado — realmente melhora pele, cabelo, unhas?',
      userId: userIds['user_pep_004'],
      isAIResponse: false
    },
    {
      content: 'Tomo colágeno peptídeo há 3 meses (10g/dia). Vejo muita propaganda sobre melhora de pele, cabelo, unhas. Mas é realmente efetivo ou é só hype? Qual é o mecanismo?',
      userId: userIds['user_pep_004'],
      isAIResponse: false
    },
    {
      content: `Colágeno peptídeo (hidrolisado) tem evidência moderada, mas NÃO é milagre. Mecanismo:

**Biodisponibilidade:**
- Colágeno inteiro (proteína de cadeia longa) = NÃO absorvido
- Colágeno hidrolisado (peptídeos pequenos) = ~90% absorção
- Dipeptídeos glicina-prolina circulam após absorção

**O que a evidência mostra:**

| Estudo | N | Duração | Resultado |
|--------|---|---------|-----------|
| Choi et al (2019) | 72 | 12 semanas | Elasticidade pele +13% |
| Inoue et al (2016) | 150 | 8 semanas | Hidratação pele +28% |
| Proksch et al (2014) | 114 | 8 semanas | Elasticidade +7% |
| Cabelo/unhas | Múltiplos | 8-12 | Melhora >50% relato subjetivo, <15% objetivo |

**Mecanismo real:**
1. Colágeno digerido → aminoácidos/dipeptídeos
2. Alguns chegam circulação (principalmente glicina, prolina, hidroxiprolina)
3. Estimulam fibroblasto via sinalização (ainda não 100% claro COMO)
4. Aumento de síntese de colágeno endógeno

**PORÉM — Críticas importantes:**
1. Maioria dos estudos é patrocinada por fabricantes
2. Efeitos são MODESTOS (~10-15%)
3. Outros fatores (genética, vitamina C, sono) têm MAIS impacto
4. Nenhuma evidência que colágeno específico > outra proteína qualquer

**Vs proteína comum:**
Colágeno é proteína como outra. Diferença é: se você NÃO toma proteína suficiente (1.6g/kg), colágeno + treinamento + vitamina C = útil. Se você JÁ toma proteína adequada, colágeno é redundante.

**Recomendação:**
- Se já toma whey + dieta protéica: colágeno é custo-benefício ruim
- Se quer tentar: combine com vitamina C (essencial para síntese colágeno)
- Expectativa: melhora modesta, 8-12 semanas

Continua tomando? Tem como medir efeito (foto pele, elasticidade)?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Tomo colágeno + vitamina C + durmo bem. Pele parece mais hidratada sim, cabelo menos quebradiço. Mas honestamente não sei se é colágeno ou só o fato de estar cuidando melhor da saúde (sono + hidratação).',
      userId: userIds['user_pep_004'],
      isAIResponse: false
    },
    {
      content: `Essa é a resposta mais honesta. Muito provavelmente é 70% sono+hidratação+vitamina C, 30% colágeno. Continue assim. Não precisa obsessionar sobre colágeno especificamente.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // THREAD 4: Oxitocina sintética
    {
      content: 'Oxitocina — "hormônio do amor" — pode melhorar relacionamento, confiança, saúde mental?',
      userId: userIds['user_pep_005'],
      isAIResponse: false
    },
    {
      content: 'Vi estudos sobre oxitocina intranasal melhorando confiança, empatia, até comportamento social. Alguns biohackers usam. Mas qual é o risco? Vale a pena experimenta',
      userId: userIds['user_pep_005'],
      isAIResponse: false
    },
    {
      content: `Oxitocina é real, tem efeitos reais, MAS com ressalvas críticas:

**Fatos científicos:**
- Sintetizada no hipotálamo, liberada pela pituitária
- Liga-se a receptores no cérebro → confiança, bonding, redução medo
- Inalação intranasal consegue cruzar barreira hematoencefálica

**Estudos mostram:**

| Contexto | Efeito | Robustez |
|----------|--------|----------|
| Confiança em jogo econômico | +30-40% | Média |
| Empatia em leitura de emoção | +15-25% | Fraca-Média |
| Redução de medo | +20% | Média |
| Bonding parental | +40% | Forte |

**MAS — Efeitos paradoxais:**

1. **Aumento de IN-GROUP bias** — Oxitocina torna você MÃO generoso com "seu grupo", mas MENOS com "out-group"
2. **Ativação emocional** — Não é só "amor", é intensificação emocional geral
3. **Perda de vigilância** — Reduz desconfiança até em contextos onde deveria desconfiar
4. **Variabilidade individual** — Resposta 40% dos usuários é oposta (mais ansiedade)

**Riscos fisiológicos:**
- Tolerância rápida (dessensibilização de receptores)
- Rebote de ansiedade ao parar
- Efeito em hormônios reprodutivos desconhecido a longo prazo
- Interação com medicações psiquiátricas perigosa

**Status regulatório:**
- Proibido venda fora prescrição na maioria de países
- O que "biohackers" compram é frequentemente falsificado ou contaminado

**Recomendação:**
NÃO tenta oxitocina exógena para "melhorar relacionamento". A forma COMPROVADA e SEM risco é: contato físico, conversas honestas, vulnerabilidade — isso libera oxitocina endógena naturalmente.

Se tem diagnóstico psiquiátrico (autismo, PTSD): aí sim, oxitocina sob supervisão médica pode ter utilidade. Fora isso, risco > benefício.

Qual era seu objetivo final?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Ouço muita propaganda biohacker sobre "otimizar oxitocina" mas isso soa como querer medicar relacionamentos que na verdade precisam de comunicação real. Acho que a recomendação é boa.',
      userId: userIds['user_pep_006'],
      isAIResponse: false
    },

    // THREAD 5: Creatina
    {
      content: 'Creatina — segura para o rim? Precisa ciclar? Beber mais água?',
      userId: userIds['user_pep_007'],
      isAIResponse: false
    },
    {
      content: 'Tomo creatina (5g/dia) há 2 anos. Nunca tive problema. Mas vejo muito mito sobre "estragar rim", "precisa ciclar". Qual é a REAL evidência sobre segurança renal de longo prazo?',
      userId: userIds['user_pep_007'],
      isAIResponse: false
    },
    {
      content: `Creatina é um dos suplementos mais estudados. Segurança renal é ROBUSTA.

**Fatos sobre creatina e rim:**

1. **Creatina = marcador de função renal (não causa dano)**
   - Creatina sérica é apenas INDICADOR de função, não causador
   - Aumento de creatina sérica com suplemento é esperado (carregamento muscular)

2. **Mega-meta-análise (200+ estudos, 2017):**
   - Zero evidência de nefrotoxicidade em população saudável
   - Até 20g/dia por 5+ anos = SEGURO
   - Pessoas com doença renal PRÉ-EXISTENTE: evitar (já têm clearance comprometido)

3. **Mecanismo:**
   - Creatina não é metabolizada pelo rim
   - Apenas filtrada (como qualquer soluto)
   - Não causa inflamação renal

**Mitos:**

| Mito | Realidade |
|------|-----------|
| "Estraga rim" | Zero evidência em saudáveis |
| "Precisa ciclar" | Desnecessário, contínuo é seguro |
| "Aumenta desidratação" | Falso, aumenta retenção hídrica (positivo) |
| "Interage com nefro-tóxicos" | Sim, evitar álcool + AINE crônicos |

**Recomendação prática:**
- 5g/dia contínuo: SEGURO e efetivo
- Nenhuma necessidade de ciclar
- Beba 2-3L água/dia (não especificamente para creatina, só hidratação geral)
- Se tem doença renal: conversa com nefrô

Você tá vendo benefício nos 2 anos?`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Sim, força +10%, ganho muscular notável, nenhum efeito colateral. Tranquilo em continuar então.',
      userId: userIds['user_pep_007'],
      isAIResponse: false
    },
    {
      content: 'Creatina é dos poucos suplementos que REALMENTE funciona com evidência forte. Continua 100%.',
      userId: userIds['user_pep_002'],
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
        viewCount: Math.floor(Math.random() * 80),
        likeCount: Math.floor(Math.random() * 40),
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
  console.log('✅ SEED COMPLETO — Peptídeos & Farmacologia');
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
