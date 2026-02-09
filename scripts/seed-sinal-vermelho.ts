// ═══════════════════════════════════════════════════════════════
// SEED ARENA: SINAL VERMELHO — DOR, AJUSTE OU LESÃO
// Executar: npx tsx scripts/seed-sinal-vermelho.ts
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

const POSTS = [
  // ─────────────────────────────────────────────────────────
  // CONVERSA 1: Dor no ombro no supino
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_bruno',
    content: `🚨 DOR AGUDA NO OMBRO DURANTE SUPINO

Senti pontada FORTE no ombro direito no meio do supino, na subida. Parei na hora. Dói ao levantar o braço lateralmente. O que pode ser?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Boa decisão ter parado. Dor aguda durante supino com irradiação para abdução precisa investigação:

**🔍 PERGUNTAS ESSENCIAIS:**
1. Dor na FRENTE (perto bíceps), TOPO ou LATERAL do ombro?
2. Pontada tipo "agulhada" ou sensação de "rasgar"?
3. Barra desce na linha do pescoço, mamilos ou abaixo?
4. Desce até encostar no peito ou para antes?
5. Pegada aberta ou fechada?

**HIPÓTESE PRINCIPAL (80% dos casos):**
**Impacto subacromial** — tendão do supraespinhal "prensado" entre úmero e acrômio. Comum quando: barra desce alto, pegada muito aberta, escápulas não retraídas.

**O QUE FAZER AGORA:**
- ❌ Não treine ombro/peito por 5-7 dias
- ✅ Gelo 15 min, 3x/dia, primeiras 48h
- ✅ Movimente SUAVEMENTE (não imobilizar)
- ⚠️ Se dor > 7 dias ou piorar → ortopedista

Me responde as 5 perguntas pra refinar.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_bruno',
    content: `Dor na FRENTE, perto do bíceps. Agulhada. Desço na linha dos mamilos, pegada um pouco mais aberta que ombros. Desço até encostar no peito.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Quadro claro: **irritação do tendão da porção longa do bíceps** com impacto subacromial.

Pegada aberta + amplitude máxima = ombro em extensão + rotação externa máxima. Tendão do bíceps fica pinçado.

**🔧 AJUSTES DE TÉCNICA:**
1. Fechar levemente a pegada (largura dos ombros + 1 palmo)
2. NÃO encostar barra no peito (parar 2-3 dedos acima)
3. Retrair e deprimir escápulas ("guardar no bolso de trás")
4. Cotovelos a ~45° (não 90°)
5. Supino com halteres — permite posição natural

**PLANO DE RETORNO:**
- Dia 1-7: sem supino. Pode treinar pernas/costas
- Dia 8-14: halteres leve (50% carga), com ajustes
- Dia 15+: progredir com técnica corrigida

**🚨 MÉDICO SE:** dor > 10 dias, fraqueza ao segurar objetos, dor ao dormir de lado, inchaço.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `Passei por isso há 6 meses. Impacto subacromial. Ajustei pegada e parei de descer até o peito. Nunca mais tive dor. Os ajustes são certeiros.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 2: Formigamento no braço
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_pedro',
    content: `⚡ FORMIGAMENTO NO BRAÇO DURANTE TREINO DE OMBRO

Formigamento no braço esquerdo quando faço desenvolvimento acima da cabeça. Começa no ombro e vai até a mão. Devo parar?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Formigamento que irradia até a mão = envolvimento NERVOSO. Precisa atenção.

**🔍 PERGUNTAS CRÍTICAS:**
1. Todos os dedos ou apenas alguns? (quais?)
2. Só no desenvolvimento ou outros exercícios acima da cabeça?
3. Formiga fora do treino? (dormir, dirigir, celular)
4. Dor no pescoço?
5. Trabalho prolongado no computador?

**QUAL NERVO:**
- Dedão + indicador + médio → nervo mediano (túnel do carpo)
- Anelar + mindinho → nervo ulnar (pescoço ou cotovelo)
- Todos + dorso → origem cervical

**HIPÓTESE PRINCIPAL:** Síndrome do desfiladeiro torácico — nervos comprimidos entre clavícula e primeira costela ao elevar braços. Comum em quem tem ombros caídos + trabalho no PC.

**⚠️ SIM, pare o desenvolvimento. Substitua por elevação lateral.**`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_pedro',
    content: `Anelar e mindinho. Só no desenvolvimento e puxada alta. Formiga às vezes no PC (trabalho 8h sentado). Sem dor no pescoço.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Confirmado: **compressão do nervo ulnar no desfiladeiro torácico**.

8h no PC encurta escalenos, protrui ombros. Espaço do nervo ulnar estreita. Braço acima da cabeça = pior.

**🔧 CORREÇÕES:**

**No treino:** elevação lateral (máx 90°), puxada frontal pegada neutra

**No trabalho:** monitor altura dos olhos, cotovelos 90° apoiados, pausa a cada 50 min

**Exercícios diários (5 min):**
1. Alongamento escalenos: orelha ao ombro, 30s cada
2. Retração cervical (chin tuck): 10x, 5s
3. Abertura peitoral na porta: 30s
4. Depressão escapular: 10x

**Se não melhorar em 3-4 semanas → neurologista para eletroneuromiografia.**`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Exatamente meu caso. Nervo ulnar por postura no PC. 2 meses de correção postural + trocar desenvolvimento por elevação lateral = resolveu 100%.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 3: Joelho estrala
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_maria',
    content: `🦵 JOELHO ESTRALA NO AGACHAMENTO — NORMAL?

Meu joelho direito estrala TODA vez que agacho. Sem dor, mas o barulho me assusta. É pra preocupar?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Estralidos sem dor são queixa muito comum. Boa notícia: na maioria NÃO é preocupante.

**🔍 PERGUNTAS:**
1. "Pop" único ou série de crepitações (como pisar areia)?
2. Toda amplitude ou só numa fase?
3. Só com carga ou sem peso também?
4. Joelho incha depois do treino?
5. Dor ao subir/descer escada?

**CENÁRIOS:**
- **A — Pop sem dor (70%):** Cavitação articular (gás no líquido sinovial). Igual estalar dedos. BENIGNO. Não causa artrose.
- **B — Crepitação sem dor:** Condromalácia leve. Fortalecer VMO.
- **C — Estralido COM dor/inchaço:** Possível lesão. Médico necessário.

**RECOMENDAÇÕES:**
1. Aqueça bem (5 min bicicleta + agachamento sem peso)
2. Fortaleça VMO: extensão últimos 30°
3. Verifique alinhamento (valgo dinâmico)
4. Foam roller antes do treino

**🚨 ORTOPEDISTA SE:** estralido mudar, surgir dor, joelho travar, inchaço.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_maria',
    content: `Pop único, sempre no mesmo ponto, meio do agachamento. Sem peso também. Sem inchaço, sem dor na escada. Só barulho.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Clássico **Cenário A — cavitação articular**. Pop único, mesmo ponto, sem peso, sem dor = benigno. Pode continuar agachando normalmente. Mantenha aquecimento e boa técnica. Se surgir DOR junto → reavalie. Fique tranquila! 👍`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_014',
    content: `Meu joelho estrala há 10 anos. Ressonância normal. Ortopedista: cavitação, benigno. Agacho 120kg sem problema. Pode ficar tranquila, Maria!`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 4: Dor lombar no terra
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_009',
    content: `💥 DOR LOMBAR DEPOIS DO LEVANTAMENTO TERRA

Lombar "trava" no dia seguinte ao terra. Não é dor aguda durante, é rigidez que dura 2-3 dias. Uso cinto. 100kg no terra, peso corporal 80kg. Normal ou erro de técnica?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Rigidez lombar 2-3 dias NÃO é normal. Sugere sobrecarga mecânica.

**🔍 INVESTIGAÇÃO:**
1. Quadril muito baixo (agachamento) ou alto (stiff)?
2. Costas arredondam na subida?
3. Faz Valsalva? (prender ar contra cinto)
4. Barra colada na canela ou afastada?
5. Sua altura?

100kg com 80kg corporal = 1.25x = carga moderada. "Travar" nessa carga = padrão motor incorreto.

**ERROS MAIS COMUNS:**
1. Quadril sobe antes dos ombros = lombar assume carga
2. Barra afastada do corpo = alavanca multiplica na lombar
3. Sem Valsalva = cinto é só estético
4. Hiperextensão no topo = comprime discos`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_009',
    content: `Quadril alto. Acho que arredonda saindo do chão. Não faço Valsalva, só prendo ar leve. Barra um pouco afastada. 1,85m.`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `VÁRIOS problemas identificados. 1,85m + quadril alto + lombar arredondando + barra afastada + sem Valsalva = lombar fazendo 90% do trabalho.

**🔧 CORREÇÕES:**
1. Com 1,85m: teste **terra sumo** (encurta alavanca) OU convencional com barra elevada (blocos 5-10cm)
2. "Empurre o chão" em vez de "puxe a barra" = ativa glúteos primeiro
3. Barra RASPANDO canela (use meião)
4. Valsalva: inspirar fundo, expandir abdômen 360° contra cinto
5. Volte pra 70kg com técnica perfeita, progrida 5kg/semana

Se rigidez SUMIR com correções = era técnica. Se persistir = avaliação médica.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_015',
    content: `1,90m aqui. Terra sumo = melhor coisa que fiz. Alavanca muda completamente pra quem é alto. Lombar nunca mais travou.`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 5: Dor no quadril corrida
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_006',
    content: `🏃‍♀️ DOR LATERAL NO QUADRIL AO CORRER

Comecei a correr há 2 meses. Dor lateral quadril direito, piora durante treino e ao deitar de lado. 38 anos, mulher, sedentária antes. O que pode ser?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Dor lateral de quadril em corredora iniciante = causa bem definida na maioria dos casos.

**HIPÓTESE (90%):** Tendinopatia do glúteo médio. Ele é o principal estabilizador lateral na corrida. Fraco → inflama → dor progressiva.

**Por que piora correndo:** Cada passada = glúteo médio estabiliza pelve. Se fraco, tendão sobrecarrega.
**Por que dói deitada:** Compressão direta do tendão contra trocânter.

**🔧 RECOMENDAÇÕES:**
1. Reduza corrida pela metade (não pare)
2. Não deite no lado que dói (travesseiro entre joelhos)
3. Fortalecimento glúteo médio ESSENCIAL:
   - Abdução lateral deitada 3x15
   - Clamshell com elástico 3x15
   - Ponte unilateral 3x10

4. Evite: alongamento excessivo do quadril, terreno inclinado

Se não melhorar 3-4 semanas → fisioterapeuta.`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_006',
    content: `Dói no osso lateral. Sim, na escada. Corro 3x/semana 5km. Tênis antigo. Zero fortalecimento — só corro. Achei meu problema...`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_012',
    content: `Tive exatamente isso. Glúteo médio fraco + corrida = receita pra dor. 2 meses de fortalecimento com fisio e nunca mais. Clamshell com elástico é o melhor exercício!`,
    isAIResponse: false,
  },

  // ─────────────────────────────────────────────────────────
  // CONVERSA 6: Dor cervical crônica
  // ─────────────────────────────────────────────────────────
  {
    userId: 'user_sim_010',
    content: `📱 DOR CERVICAL QUE NÃO PASSA — 10H NO COMPUTADOR

Dor cervical há meses. Trabalho 10h/dia no PC. Fisio e massagem aliviam por dias e volta. Irradia pra base do crânio, às vezes dor de cabeça. Vou viver com isso pra sempre?`,
    isAIResponse: false,
  },
  {
    userId: 'ia_sinal_vermelho',
    content: `Melhora com tratamento e volta = NÃO é estrutural. É funcional/postural. Tratamento alivia sintoma mas você volta pra mesma posição que causa.

**O QUE ACONTECE:**
"Cabeça pra frente" = cada cm avançado = +4.5kg de carga na cervical. 10h assim = extensores cervicais em tensão constante → rigidez → dor → cefaleia tensional.

**SOLUÇÃO EM 3 FRENTES:**

**1. Ergonomia (fechar a torneira):**
- Monitor na altura dos olhos
- Notebook → suporte + teclado externo (~R$100-140)
- Braços apoiados

**2. Micro-pausas (evitar acúmulo):**
- A cada 50 min: retração cervical 10x + rotação lenta

**3. Fortalecimento (cura longo prazo):**
Exercícios diários 5 min:
- Chin tuck (queixo duplo): 15x
- Isometria flexora deitado: levantar cabeça 2cm, 10x10s
- Rotação resistida com mão: 10s cada lado
- Alongamento escalenos: 30s cada
- Abertura peitoral: 30s

**CRONOGRAMA:**
- Sem 1-2: ergonomia + pausas → dor reduz 30-40%
- Sem 3-8: + exercícios → reduz 70-80%
- Mês 3+: manutenção (NÃO parar quando dor sumir)`,
    isAIResponse: true,
  },
  {
    userId: 'user_sim_010',
    content: `Uso notebook na mesa, monitor na altura do umbigo. Dor mais do lado direito (mouse). Zero exercício. Celular bastante à noite.`,
    isAIResponse: false,
  },
  {
    userId: 'user_sim_011',
    content: `Passei ANOS com dor cervical até comprar suporte pro notebook. Resolveu 60% sozinho. Chin tuck todo dia = outros 40%. Hoje zero dor.`,
    isAIResponse: false,
  },
];

// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log('🏟️  SEED: SINAL VERMELHO\n');

  try {
    // Encontrar arena
    const arena = await prisma.arena.findFirst({
      where: {
        OR: [
          { slug: { contains: 'sinal', mode: 'insensitive' } },
          { slug: { contains: 'vermelho', mode: 'insensitive' } },
          { name: { contains: 'Sinal', mode: 'insensitive' } },
        ],
      },
    });

    if (!arena) {
      console.log('❌ Arena não encontrada. Arenas disponíveis:');
      const allArenas = await prisma.arena.findMany({
        select: { id: true, slug: true, name: true },
        orderBy: { slug: 'asc' },
      });
      allArenas.forEach(a => console.log(`  ${a.slug} | ${a.name}`));
      return;
    }

    console.log(`✅ Arena: ${arena.name} | ID: ${arena.id}`);

    // Limpar posts antigos
    const deleted = await prisma.post.deleteMany({
      where: { arenaId: arena.id },
    });
    console.log(`🗑️  ${deleted.count} posts antigos removidos`);

    // Inserir novos posts
    let created = 0;
    const baseTime = new Date('2026-02-07T07:00:00Z');

    for (let i = 0; i < POSTS.length; i++) {
      const post = POSTS[i];
      const postTime = new Date(baseTime.getTime() + (i * 20 * 60 * 1000));

      try {
        await prisma.post.create({
          data: {
            arenaId: arena.id,
            userId: post.userId,
            content: post.content,
            isPublished: true,
            isPinned: false,
            isOfficial: false,
            isAIResponse: post.isAIResponse,
            isUnderReview: false,
            isApproved: true,
            viewCount: Math.floor(Math.random() * 60) + 10,
            likeCount: Math.floor(Math.random() * 20),
            commentCount: 0,
            isDeleted: false,
            createdAt: postTime,
            updatedAt: postTime,
          },
        });
        created++;
      } catch (err: any) {
        console.error(`❌ Post ${i}: ${err.message}`);
      }
    }

    // Atualizar contagem
    const count = await prisma.post.count({
      where: { arenaId: arena.id, isDeleted: false },
    });

    await prisma.arena.update({
      where: { id: arena.id },
      data: { totalPosts: count },
    });

    console.log(`\n✅ ${created} posts criados`);
    console.log(`📊 Total na arena: ${count}`);
    console.log('\n🏟️  Arena pronta! ✅\n');
  } catch (error) {
    console.error('Erro fatal:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
