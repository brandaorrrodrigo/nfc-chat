import { createClient } from '@supabase/supabase-js';
import { v4 as uuid } from 'uuid';
import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('🧬 SEED: Arena Peptídeos Research (v2 — ~200 posts, FRAG/BPC focus)\n');

  const { data: arenaData } = await sb.from('Arena').select('*').eq('slug', 'peptideos-research').single();
  let arena = arenaData;

  if (!arena) {
    const { data: created, error } = await sb.from('Arena').insert({
      id: 'arena_peptideos_research',
      slug: 'peptideos-research',
      name: '🧬 Peptídeos Research',
      description: 'Pesquisa e discussão sobre peptídeos bioativos — FRAG 176-191, BPC-157, TB-500, CJC-1295, Ipamorelin, Sermorelin e mais. Mecanismos de ação, protocolos, evidências clínicas e redução de danos.',
      icon: '🧬',
      color: '#8B5CF6',
      category: 'SAUDE_CONDICOES_CLINICAS',
      isActive: true,
      aiPersona: 'SCIENTIFIC',
      categoria: 'SAUDE_CONDICOES_CLINICAS'
    }).select('*').single();
    if (error) throw new Error('Erro ao criar arena: ' + error.message);
    arena = created;
  }

  const ARENA_ID = arena.id;
  console.log('✅ Arena:', arena.name);

  const { data: deletedData } = await sb.from('Post').delete().eq('arenaId', ARENA_ID).select('id');
  console.log(`🗑️ ${deletedData?.length ?? 0} posts apagados`);

  // ========================================
  // USUÁRIOS (12 participantes + 1 IA)
  // ========================================
  const userNames = [
    { id: 'user_pep_drcarlos', name: 'Dr. Carlos Magno', email: 'carlos.magno.pep@example.com' },
    { id: 'user_pep_marina', name: 'Marina Bioquímica', email: 'marina.bioquimica@example.com' },
    { id: 'user_pep_rafael', name: 'Rafael Farmaco', email: 'rafael.farmaco@example.com' },
    { id: 'user_pep_laura', name: 'Laura Pesquisadora', email: 'laura.pesquisadora@example.com' },
    { id: 'user_pep_igor', name: 'Igor Performance', email: 'igor.performance.pep@example.com' },
    { id: 'user_pep_ana', name: 'Ana Ciência', email: 'ana.ciencia.pep@example.com' },
    { id: 'user_pep_felipe', name: 'Felipe Studos', email: 'felipe.studos@example.com' },
    { id: 'user_pep_bruno', name: 'Bruno Endócrino', email: 'bruno.endocrino@example.com' },
    { id: 'user_pep_thiago', name: 'Thiago Biohacker', email: 'thiago.biohacker@example.com' },
    { id: 'user_pep_renata', name: 'Renata Farmacêutica', email: 'renata.farmaceutica@example.com' },
    { id: 'user_pep_diego', name: 'Diego Atleta', email: 'diego.atleta@example.com' },
    { id: 'user_pep_camila', name: 'Camila Nutrição', email: 'camila.nutricao.pep@example.com' },
  ];

  const userIds: Record<string, string> = {};
  for (const userData of userNames) {
    const { data: existing } = await sb.from('User').select('id').eq('email', userData.email).single();
    if (existing) {
      userIds[userData.id] = existing.id;
    } else {
      const { data: created, error } = await sb.from('User').insert({
        id: userData.id, email: userData.email, name: userData.name, password: 'hashed'
      }).select('id').single();
      if (error) throw new Error('Erro criando user ' + userData.name + ': ' + error.message);
      userIds[userData.id] = created!.id;
    }
  }

  const AI_USER_ID = 'user_pep_ia';
  const { data: existingAi } = await sb.from('User').select('id').eq('email', 'ia-peptideos@example.com').single();
  let aiUserId: string;
  if (existingAi) {
    aiUserId = existingAi.id;
  } else {
    const { data: aiCreated, error } = await sb.from('User').insert({
      id: AI_USER_ID, email: 'ia-peptideos@example.com', name: 'IA — Peptídeos Research', password: 'hashed'
    }).select('id').single();
    if (error) throw new Error('Erro criando AI user: ' + error.message);
    aiUserId = aiCreated!.id;
  }
  const aiUser = { id: aiUserId };

  let baseTime = new Date('2026-01-28T08:00:00Z');
  const nextTime = (minMin = 8, maxMin = 35) => {
    baseTime = new Date(baseTime.getTime() + (minMin + Math.floor(Math.random() * (maxMin - minMin))) * 60000);
    return new Date(baseTime);
  };

  const posts = [

    // ============================================================
    // THREAD 1: FRAG 176-191 — INTRODUÇÃO E MECANISMO
    // ============================================================
    {
      content: 'FRAG 176-191 — o "queimador de gordura" dos peptídeos. Alguém usa ou já usou? Quero entender o mecanismo real antes de considerar.',
      userId: userIds['user_pep_igor'],
      isAIResponse: false
    },
    {
      content: `FRAG 176-191 (Fragment 176-191 do HGH) é a parte específica do hormônio de crescimento responsável pela lipólise. Vou detalhar:

**O QUE É:**
- Fragmento aminoácido 176-191 da molécula de GH humano
- Retém APENAS a atividade lipolítica do GH
- NÃO tem efeitos sobre glicemia (diferente do GH inteiro)
- NÃO estimula crescimento de tecidos (sem efeito IGF-1)

**MECANISMO DE AÇÃO:**
1. Liga-se ao receptor de GH no adipócito (célula de gordura)
2. Ativa lipase hormônio-sensível (HSL)
3. Quebra triglicerídeos armazenados → ácidos graxos livres
4. Inibe lipogênese (formação de nova gordura)
5. Não afeta receptores de insulina → sem resistência à insulina

**DIFERENÇA GH INTEIRO vs FRAG:**

| Parâmetro | GH Inteiro | FRAG 176-191 |
|-----------|-----------|--------------|
| Lipólise | Sim | Sim (12.5x mais potente) |
| IGF-1 | Aumenta | NÃO afeta |
| Glicemia | Aumenta | NÃO afeta |
| Crescimento tecidual | Sim | NÃO |
| Retenção hídrica | Sim | Mínima |
| Custo | Alto | Menor |

**EVIDÊNCIA:**
- Estudos originais da Monash University (Austrália)
- Modelo animal: redução de 50% gordura abdominal em 3 semanas
- Humanos: dados limitados, mas consistentes com lipólise seletiva
- AOD-9604 (versão estabilizada) foi testada em ensaios Phase IIb

A grande vantagem: efeito lipolítico SEM os colaterais metabólicos do GH.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Então FRAG é basicamente o "pedaço bom" do GH sem os efeitos ruins? Parece bom demais pra ser verdade.',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `CONTEXTO CIENTÍFICO: FRAG 176-191 foi identificado pelo grupo de pesquisa do Prof. Frank Ng na Monash University nos anos 1990. O peptídeo demonstra atividade lipolítica 12.5x maior que o GH inteiro in vitro, sem afetar o metabolismo de carboidratos ou causar aumento de IGF-1 sistêmico.`,
      userId: aiUser.id,
      isAIResponse: true
    },
    {
      content: 'Thiago, é real mas tem nuances. FRAG funciona, mas: 1) Meia-vida curta (~30 min), exige múltiplas aplicações/dia. 2) Precisa estar em jejum pra funcionar (insulina bloqueia). 3) Resultado é gradual, não milagroso. 4) Qualidade do produto é uma loteria no mercado cinza.',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },

    // ============================================================
    // THREAD 2: FRAG 176-191 — PROTOCOLO PRÁTICO
    // ============================================================
    {
      content: 'Dr. Carlos, qual o protocolo prático do FRAG 176-191? Dose, frequência, horário, duração do ciclo?',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: `Diego, protocolo típico:

**DOSE:**
- Iniciante: 250mcg 2x/dia (500mcg total)
- Intermediário: 300mcg 2x/dia (600mcg total)
- Avançado: 500mcg 2x/dia (1000mcg total)

**HORÁRIOS (CRÍTICO):**
- Manhã em JEJUM (30 min antes de comer)
- Noite antes de dormir (3h após última refeição)
- NUNCA com comida no estômago — insulina BLOQUEIA FRAG

**RECONSTITUIÇÃO:**
- Pó liofilizado → adicionar água bacteriostática
- 2mL de água para frasco de 5mg
- Cada 0.1mL = 250mcg
- Seringa de insulina (U-100)

**APLICAÇÃO:**
- Subcutânea (barriga, lateral do quadril)
- Rodízio de pontos para evitar lipodistrofia
- Agulha 8mm, 31G

**CICLO:**
- Mínimo: 8 semanas (abaixo disso não verá resultado)
- Ideal: 12-16 semanas
- Pausa: 4 semanas entre ciclos

**CONSERVAÇÃO:**
- Antes de reconstituir: freezer (-20°C) por até 18 meses
- Após reconstituir: geladeira (2-8°C) por 25-30 dias
- NUNCA congelar após reconstituir
- Proteger da luz

**EXPECTATIVA REALISTA:**
- Perda de 2-4kg de gordura em 12 semanas (COM dieta e treino)
- Sem dieta: resultado próximo de zero
- FRAG potencializa déficit calórico, NÃO substitui`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'E quanto custa um ciclo completo de FRAG? Compensa vs GH em dose baixa?',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: 'Diego, custo aproximado de um ciclo 12 semanas (500mcg/dia): ~R$800-1200 (dependendo da fonte). GH em dose equivalente lipolítica (4-6UI/dia): ~R$3000-5000 para 12 semanas. FRAG é 3-4x mais barato e sem os colaterais metabólicos do GH. Custo-benefício melhor para quem quer APENAS lipólise.',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: `ALERTA: FRAG 176-191 não é aprovado pela ANVISA nem FDA para uso humano. Produtos vendidos no mercado cinza frequentemente apresentam pureza inferior a 70% e contaminação bacteriana. Verificar certificado de análise (COA) com HPLC >98% é essencial.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 3: FRAG vs AOD-9604 — COMPARAÇÃO
    // ============================================================
    {
      content: 'Qual diferença entre FRAG 176-191 e AOD-9604? Vi que AOD-9604 é "versão melhorada".',
      userId: userIds['user_pep_laura'],
      isAIResponse: false
    },
    {
      content: `Laura, boa pergunta. São primos:

**FRAG 176-191:**
- Fragmento original do GH (aminoácidos 176-191)
- Meia-vida: ~30 minutos
- Instável em solução
- Sem modificação química

**AOD-9604 (Anti-Obesity Drug 9604):**
- FRAG 176-191 + adição de tirosina no C-terminal
- Meia-vida: ~45-60 minutos (40-100% mais longa)
- Mais estável em solução
- Foi testado em ensaios clínicos Phase IIb (Metabolic Pharmaceuticals, Austrália)
- TGA (Austrália) aprovou como suplemento alimentar em 2011

**RESULTADO DOS ENSAIOS CLÍNICOS AOD-9604:**
- Phase IIb: 536 pacientes, 24 semanas
- Resultado: perda de 2.6kg vs 0.8kg placebo (modesto)
- FDA RECUSOU aprovação — efeito considerado insuficiente
- Sem efeitos adversos sérios reportados

**VEREDITO:**
AOD-9604 é ligeiramente superior ao FRAG puro (meia-vida maior, mais estável). Mas na prática, a diferença é pequena. Muitas fontes vendem AOD-9604 como "FRAG melhorado" — não é mentira, mas o upgrade é incremental.

Se encontrar AOD-9604 com boa procedência: prefira. Se só achar FRAG: funciona também.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Interessante que FDA recusou AOD-9604. Será que realmente funciona ou o efeito é tão marginal que não justifica medicamento?',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: 'Marina, o efeito lipolítico é REAL (confirmado em estudos). A FDA recusou porque 2.6kg em 24 semanas é pouco para um MEDICAMENTO aprovado (vs ozempic que faz 15kg). Mas para peptídeo adjuvante + dieta + treino, 2.6kg a mais é significativo. Contexto importa.',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: `DADO: Ensaio clínico Phase IIb (NCT00367575) — AOD-9604 oral 1mg/dia por 24 semanas: perda de peso -2.6kg vs -0.8kg placebo (p<0.05). Perfil de segurança comparável ao placebo. Nenhum efeito em IGF-1 ou glicemia.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 4: BPC-157 — DEEP DIVE MECANISMO
    // ============================================================
    {
      content: 'BPC-157 — o peptídeo "Body Protection Compound". Quero uma análise profunda do mecanismo, não superficial.',
      userId: userIds['user_pep_rafael'],
      isAIResponse: false
    },
    {
      content: `Rafael, BPC-157 merece um deep dive mesmo. Vamos lá:

**ORIGEM:**
- Derivado da gastricina (proteína do suco gástrico humano)
- Sequência de 15 aminoácidos (pentadecapeptídeo)
- Sintetizado pela primeira vez pelo grupo do Prof. Predrag Sikiric (Universidade de Zagreb, Croácia)
- NÃO existe naturalmente como molécula isolada — é um fragmento sintético

**MECANISMOS DE AÇÃO (4 vias principais):**

**1. Via VEGF (Vascular Endothelial Growth Factor):**
- BPC-157 upregula VEGF → angiogênese (novos vasos sanguíneos)
- Mais vasos = mais nutrientes na área lesionada
- Explica a aceleração cicatricial em tendão, ligamento, músculo

**2. Via óxido nítrico (NO):**
- Modula sistema NO → vasodilatação local
- Melhora perfusão tecidual
- Efeito anti-inflamatório local
- Protege mucosa gástrica (origem do "body protection")

**3. Via FAK-paxillin (adesão celular):**
- Ativa pathway FAK → migração e adesão celular
- Fibroblastos migram mais rápido para área lesionada
- Síntese de colágeno acelerada
- Fundamental para reparo tendão/ligamento

**4. Via dopamina/serotonina (SNC):**
- Modula receptores dopaminérgicos D2
- Efeito protetor sobre neurônios
- Estudos em modelos de Parkinson mostram neuroproteção
- Possível efeito antidepressivo (modelo animal)

**BIODISPONIBILIDADE:**
- Oral: ~40-50% (surpreendentemente alto para peptídeo)
- Subcutâneo: ~80-90%
- Intraperitoneal (animal): ~95%
- Estável em suco gástrico (resiste à digestão parcialmente)`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Impressionante que seja estável no suco gástrico. Outros peptídeos degradam. Por que BPC-157 resiste?',
      userId: userIds['user_pep_rafael'],
      isAIResponse: false
    },
    {
      content: 'Porque VEIO do suco gástrico. É um fragmento de proteína gástrica — evoluiu para sobreviver naquele ambiente. A sequência de aminoácidos tem resíduos hidrofóbicos que protegem contra pepsinólise. Por isso funciona oral (diferente de 99% dos peptídeos que precisam ser injetados).',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: `FARMACOLOGIA: BPC-157 (pentadecapeptídeo gástrico, Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val) mantém estabilidade em pH 2-8 e resiste a degradação enzimática gástrica parcialmente. Único peptídeo de pesquisa com via oral viável.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 5: BPC-157 — PROTOCOLO E APLICAÇÕES
    // ============================================================
    {
      content: 'Como usar BPC-157 na prática? Protocolo para lesão de tendão?',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: `Diego, protocolo BPC-157 para lesão tendínea:

**DOSE:**
- Padrão: 250-500mcg 2x/dia
- Lesão aguda: 500mcg 2x/dia por 4-6 semanas
- Lesão crônica: 250mcg 2x/dia por 8-12 semanas
- Manutenção/prevenção: 250mcg 1x/dia

**VIA DE ADMINISTRAÇÃO:**
- **Subcutânea local** (mais eficaz): aplicar o mais próximo possível da lesão
  - Tendão patelar: subcutâneo no joelho
  - Tendão supraespinhal: subcutâneo no ombro
  - Epicondilite: subcutâneo no cotovelo
- **Oral** (sistêmico): 500mcg 2x/dia em cápsulas ou solução
  - Melhor para lesões GI (gastrite, úlcera, intestino permeável)
  - Eficácia para tendão oral é ~50-60% do subcutâneo

**RECONSTITUIÇÃO:**
- 5mg frasco + 2mL água bacteriostática
- 0.1mL = 250mcg
- Geladeira 2-8°C após reconstituição
- Validade: 30 dias reconstituído

**CRONOGRAMA:**
Semana 1-2: 500mcg 2x/dia (fase de carga)
Semana 3-6: 250mcg 2x/dia (manutenção)
Semana 7-8: 250mcg 1x/dia (desmame)

**SINERGIA COMPROVADA (animal):**
- BPC-157 + TB-500: sinergismo em reparo tendíneo
- BPC-157 + PRP: alguns relatos de potencialização
- BPC-157 + fisioterapia ativa: resultado superior a isolado

**CONTRAINDICAÇÕES:**
- Câncer ativo (angiogênese pode alimentar tumor)
- Gravidez (sem dados de segurança)
- Uso de anticoagulantes (potencial interação via NO)`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Usei BPC-157 subcutâneo 250mcg 2x/dia por 6 semanas para epicondilite lateral (cotovelo de tenista). Dor reduziu de 8/10 para 2/10. MRI confirmou melhora estrutural. Estou impressionado.',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: 'Diego, relato interessante. Mas lembra: N=1. Pode ser BPC, pode ser tempo de recuperação natural, pode ser mudança na carga de treino. Importante: documentar com MRI antes/depois é excelente, poucos fazem.',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: `EVIDÊNCIA: Estudos de Sikiric et al. demonstram aceleração de 40-60% em cicatrização tendínea (modelo animal). Estudos em humanos são limitados a case reports e séries de casos. Necessidade de RCT duplo-cego em humanos persiste.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 6: BPC-157 vs TB-500 — COMPARAÇÃO
    // ============================================================
    {
      content: 'BPC-157 vs TB-500 (Thymosin Beta-4) — qual melhor para recuperação? Ou usar ambos?',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `Thiago, comparação direta:

**BPC-157:**
- Foco: reparação LOCAL (tendão, ligamento, mucosa GI)
- Mecanismo: angiogênese + migração fibroblástica
- Via: subcutâneo local ou oral
- Meia-vida: 4-6h efetiva
- Melhor para: tendão, ligamento, GI, lesão aguda

**TB-500 (Thymosin Beta-4):**
- Foco: reparação SISTÊMICA (cardíaco, muscular, tendíneo)
- Mecanismo: sequestra actina-G → migração celular + anti-inflamatório
- Via: subcutâneo (qualquer local, efeito sistêmico)
- Meia-vida: mais longa (~8-14h)
- Melhor para: lesão muscular, recuperação cardíaca, cabelo, pele

**SINERGIA BPC-157 + TB-500:**
Mecanismos COMPLEMENTARES:
- BPC-157 abre vasos novos (angiogênese)
- TB-500 permite migração celular (actina)
- Juntos = mais vasos + mais células reparadoras no local
- Relatos (anecdóticos) sugerem superioridade da combinação

**PROTOCOLO COMBINADO:**
- BPC-157: 250mcg subcutâneo LOCAL 2x/dia
- TB-500: 2.5mg subcutâneo QUALQUER LOCAL 2x/semana
- Duração: 6-8 semanas
- Custo: ~R$1500-2000/ciclo

**ESCOLHA:**
- Lesão tendínea específica → BPC-157 solo (mais focado)
- Recuperação geral + inflamação sistêmica → TB-500 solo
- Lesão séria + quer resultado máximo → Combo`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Usei combo BPC + TB-500 pra lesão no menisco. 8 semanas. Voltei a treinar agachamento. Antes mal conseguia subir escada. N=1 mas funcionou pra mim.',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `NOTA: Thymosin Beta-4 (TB-500) é proibido pela WADA (World Anti-Doping Agency) desde 2010. Atletas testados devem evitar. TB-500 tem meia-vida detectável de até 48h em urina.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 7: CJC-1295 + IPAMORELIN — STACK GH
    // ============================================================
    {
      content: 'CJC-1295 + Ipamorelin — o "stack" pra aumentar GH naturalmente. Vale a pena?',
      userId: userIds['user_pep_bruno'],
      isAIResponse: false
    },
    {
      content: `Bruno, esse é um dos stacks de peptídeos mais populares:

**CJC-1295 (com DAC):**
- GHRH modificado (Growth Hormone Releasing Hormone)
- Estimula a pituitária a liberar MAIS GH
- Meia-vida longa: 6-8 dias (com Drug Affinity Complex)
- Sem DAC: meia-vida ~30 min (mod GRF 1-29)

**IPAMORELIN:**
- GHRP (Growth Hormone Releasing Peptide)
- Estimula grelina → pulso de GH
- Mais seletivo que GHRP-6 e GHRP-2
- NÃO aumenta cortisol nem prolactina significativamente
- Meia-vida: ~2h

**POR QUE COMBINAR:**
- CJC-1295 = "liga o motor" (GHRH → produção contínua)
- Ipamorelin = "aperta o acelerador" (pulso agudo de liberação)
- Juntos: aumento de GH 3-5x maior que cada um isolado
- Sinergismo comprovado em estudos

**RESULTADO ESPERADO:**
- GH sérico: aumento de 200-600% nos picos
- IGF-1: aumento de 30-80% (gradual, 4-8 semanas)
- Sono profundo: melhora significativa
- Recuperação muscular: acelerada
- Lipólise: modesta (inferior a FRAG ou GH direto)
- Pele, cabelo: melhora gradual

**PROTOCOLO:**
- CJC-1295 (com DAC): 2mg/semana (dose única)
- Ipamorelin: 200-300mcg 2-3x/dia
- Melhor horário: antes de dormir e manhã em jejum
- Ciclo: 12-16 semanas, pausa 4-8 semanas

**VANTAGEM vs GH SINTÉTICO:**
- Mais barato
- Estimula produção PRÓPRIA (não suprime eixo)
- Mantém pulsatilidade natural do GH
- Sem efeitos em glicemia (se dose moderada)

**DESVANTAGEM:**
- Resultado 30-50% do GH exógeno direto
- Precisa de pituitária funcional
- Idade >50: resposta diminuída`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Tenho 42 anos, treino pesado. Ipamorelin sozinho já vale? Ou CJC-1295 é essencial no combo?',
      userId: userIds['user_pep_bruno'],
      isAIResponse: false
    },
    {
      content: 'Bruno, com 42 anos: combo é melhor. Ipamorelin sozinho dá pulso mas de curta duração. CJC-1295 com DAC mantém produção de GH elevada entre os pulsos. O sinergismo é a chave. Se orçamento é limitado, priorize Ipamorelin (mais bang for the buck).',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: `ENDOCRINOLOGIA: Após os 30 anos, produção de GH diminui ~14% por década (somatopausa). Aos 42, produção endógena é ~60% do pico. Secretagogos como CJC-1295+Ipamorelin podem restaurar parcialmente os níveis sem suprimir o eixo GH-IGF-1.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 8: FRAG 176-191 — RELATOS E RESULTADOS
    // ============================================================
    {
      content: 'Quero ver relatos reais de quem usou FRAG 176-191. Resultados, efeitos colaterais, decepções.',
      userId: userIds['user_pep_ana'],
      isAIResponse: false
    },
    {
      content: 'Usei FRAG 500mcg/dia (250 manhã + 250 noite) por 12 semanas. Resultado: perdi 3.8kg de gordura (medido por bioimpedância e plicometria). Estava em déficit de ~300kcal e treinando 5x/semana. Efeito colateral: zero. Único problema: dor no ponto de aplicação nos primeiros dias.',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: 'Eu usei e me decepcionei. 8 semanas, 500mcg/dia. Perdi 1.2kg apenas. PORÉM: acho que meu produto era ruim. Comprei de fonte duvidosa, frasco sem COA. Depois descobri que a pureza provavelmente era <60%.',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: 'Felipe, esse é o problema NÚMERO 1 com peptídeos: qualidade do produto. Estudo da Journal of Pharmaceutical Sciences (2019) analisou 14 amostras de peptídeos de pesquisa: apenas 3 tinham pureza >95%. As outras variavam de 40-85%. Sem COA com HPLC confiável, você está jogando dinheiro fora.',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Minha experiência com FRAG: 16 semanas, 600mcg/dia. Perda de gordura: 4.5kg (DEXA scan antes/depois). Mantive massa magra. O truque que fez diferença: JEJUM ABSOLUTO por 1h após aplicação. Qualquer insulina, mesmo de um café com leite, bloqueia completamente o FRAG.',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `NOTA METODOLÓGICA: Relatos individuais (N=1) têm viés de confirmação. Sem grupo controle, impossível atribuir resultado exclusivamente ao FRAG. Variáveis confundidoras: dieta, treino, sono, stress, composição corporal inicial. Monitorar com DEXA (como Thiago fez) é o melhor padrão possível.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 9: SERMORELIN — ALTERNATIVA AO GH
    // ============================================================
    {
      content: 'Sermorelin — vale a pena como alternativa ao GH sintético pra anti-aging?',
      userId: userIds['user_pep_camila'],
      isAIResponse: false
    },
    {
      content: `Camila, Sermorelin é o GHRH "original":

**O QUE É:**
- Fragmento 1-29 do GHRH humano
- Aprovado pela FDA (foi usado clinicamente para deficiência de GH pediátrica)
- Estimula pituitária a produzir e liberar GH
- Meia-vida: 10-20 minutos (curta)

**VANTAGENS:**
- Histórico de segurança mais longo que outros peptídeos
- Mantém pulsatilidade natural do GH
- Não suprime eixo
- Barato comparado ao GH

**DESVANTAGENS:**
- Meia-vida muito curta (precisa de múltiplas aplicações)
- Efeito mais fraco que CJC-1295
- Tolerância pode desenvolver (taquifilaxia)
- Menos eficaz em >50 anos

**PROTOCOLO ANTI-AGING:**
- 200-300mcg subcutâneo antes de dormir
- 5 dias on / 2 dias off (previne taquifilaxia)
- Ciclo: contínuo por 6-12 meses
- Monitorar IGF-1 a cada 3 meses

**vs GH SINTÉTICO:**
Sermorelin é mais "fisiológico" — mantém feedback natural. GH exógeno suprime produção endógena. Para anti-aging (dose baixa, longo prazo), Sermorelin pode ser preferível. Para resultado máximo (bodybuilding), GH é superior.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Uso Sermorelin há 8 meses. Sono MUITO melhor, pele melhorou, recuperação do treino boa. Efeito sutil mas consistente. Não é explosivo como GH mas também sem os colaterais.',
      userId: userIds['user_pep_camila'],
      isAIResponse: false
    },
    {
      content: `HISTÓRICO: Sermorelin (Geref®) foi o primeiro GHRH aprovado pela FDA (1997). Descontinuado comercialmente em 2008 por razões de produção, não segurança. Continua disponível via farmácias de manipulação nos EUA.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 10: GHK-Cu — PEPTÍDEO DO COBRE
    // ============================================================
    {
      content: 'GHK-Cu (peptídeo de cobre) — milagre para pele e cabelo ou marketing?',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: `Renata, GHK-Cu é um dos mais interessantes:

**O QUE É:**
- Tripeptídeo (Glicina-Histidina-Lisina) ligado a cobre
- Ocorre NATURALMENTE no plasma humano
- Concentração diminui com idade (60% menos aos 60 vs 20 anos)
- Descoberto por Dr. Loren Pickart (1973)

**MECANISMOS (extensamente estudados):**
1. Remodelagem de colágeno (estimula síntese + degradação do danificado)
2. Angiogênese (novos vasos na pele)
3. Antioxidante (SOD, glutationa peroxidase)
4. Anti-inflamatório (suprime TNF-α, IL-6)
5. Estimula folículos capilares (fase anágena)
6. Atrai macrófagos reparadores para área tratada

**EVIDÊNCIA FORTE:**
- Tópico: melhora de 30-40% em fotodano (RCT, 2009)
- Pós-laser: cicatrização 33% mais rápida (controlado)
- Cabelo: aumento de 23% em diâmetro do fio (12 semanas tópico)
- Feridas: superior ao ácido retinóico e vitamina C em alguns estudos

**FORMAS DE USO:**
- **Tópico (creme/sérum):** 1-3% GHK-Cu, 2x/dia — MAIS EVIDÊNCIA
- **Injetável:** 1-2mg/dia subcutâneo — menos estudado
- **Mesoterapia:** microagulhamento + GHK-Cu — popular em clínicas

**VEREDITO:**
GHK-Cu tópico tem BOA evidência. É um dos poucos ingredientes anti-aging com dados robustos. Injetável é mais especulativo. Para pele/cabelo: vale sim, é real.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Uso sérum com GHK-Cu 3% há 4 meses. Manchas de sol clarearam, textura da pele melhorou. Combinei com retinol alternado. Melhor resultado que ácido hialurônico isolado.',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: `DERMATOLOGIA: GHK-Cu é um dos poucos peptídeos com estudos RCT publicados em periódicos peer-reviewed para aplicação dermatológica. Meta-análise de 2021 confirma benefício em rejuvenescimento cutâneo, cicatrização e fotoproteção.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 11: MK-677 — GH SECRETAGOGUE ORAL
    // ============================================================
    {
      content: 'MK-677 (Ibutamoren) — secretagogo de GH oral. Melhor que peptídeos injetáveis?',
      userId: userIds['user_pep_igor'],
      isAIResponse: false
    },
    {
      content: `Igor, MK-677 é diferente dos peptídeos — é uma molécula PEQUENA (não peptídeo):

**O QUE É:**
- Agonista do receptor de grelina (mimetiza fome)
- Estimula liberação de GH pela pituitária
- Via ORAL (vantagem enorme vs injetáveis)
- Meia-vida: 24h (dose única diária)
- Tecnicamente um SARM, não um peptídeo

**EFEITOS:**
- GH sérico: +40-90% sustentado
- IGF-1: +30-50% em 4-8 semanas
- Sono profundo: melhora SIGNIFICATIVA (efeito mais notável)
- Apetite: AUMENTA MUITO (agonista grelina)
- Retenção hídrica: moderada

**COLATERAIS:**
- Fome intensa (70% dos usuários)
- Retenção hídrica, inchaço facial
- Dormência/formigamento nas mãos
- Aumento de glicemia em jejum (+5-15 mg/dL)
- Letargia (especialmente início)
- Resistência à insulina (uso >6 meses)

**PROTOCOLO:**
- 10-25mg/dia, oral, antes de dormir
- Ciclo: 8-12 semanas
- Dose de 10mg minimiza colaterais com 70% do efeito

**vs PEPTÍDEOS INJETÁVEIS (CJC+Ipa):**
- MK-677 é mais conveniente (oral, 1x/dia)
- MK-677 causa mais fome e retenção
- MK-677 tem mais dados de segurança (Phase II studies)
- Peptídeos são mais "limpos" (menos colaterais)

**RISCO SÉRIO:**
Uso prolongado (>6 meses contínuo) pode causar resistência à insulina. Monitorar glicemia e HOMA-IR é OBRIGATÓRIO.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'A fome do MK-677 é INSANA. Usei 25mg e acordava 3h da manhã querendo comer. Reduzi pra 12.5mg e ficou tolerável. Sono ficou espetacular — melhor efeito colateral da vida.',
      userId: userIds['user_pep_igor'],
      isAIResponse: false
    },
    {
      content: 'Igor, a fome absurda é porque MK-677 literalmente ativa o receptor de grelina (hormônio da fome). É o mecanismo, não o colateral. Dose menor = menos fome. Tomar antes de dormir ajuda (dorme antes da fome bater forte).',
      userId: userIds['user_pep_bruno'],
      isAIResponse: false
    },
    {
      content: `ALERTA: MK-677 (Ibutamoren) NÃO é aprovado pela FDA/ANVISA. Classificado como SARM para fins regulatórios. Proibido pela WADA. Vendido como "research chemical" — mesmos riscos de qualidade que peptídeos do mercado cinza.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 12: MELANOTAN II — BRONZEAMENTO
    // ============================================================
    {
      content: 'Melanotan II — bronzeamento sem sol. Funciona? Quais riscos?',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `Felipe, Melanotan II é polêmico:

**O QUE É:**
- Análogo sintético do MSH (Melanocyte Stimulating Hormone)
- Estimula melanócitos → produção de melanina → escurecimento da pele
- Também ativa receptores MC4 → ereção, redução de apetite
- Desenvolvido pela University of Arizona (anos 1990)

**EFEITOS:**
- Bronzeamento sem exposição UV (mas UV potencializa)
- Ereção (efeito colateral explorado → PT-141)
- Supressão de apetite
- Vermelhidão facial (flushing) na dose inicial

**RISCOS SÉRIOS:**
1. **Nevos (pintas) — RISCO PRINCIPAL:** Melanotan estimula TODOS os melanócitos, incluindo os atípicos. Pode promover crescimento de nevos pré-existentes. Risco teórico de melanoma em pessoas predispostas.
2. **Náusea/vômito:** 30-50% dos usuários nas primeiras doses
3. **Ereção involuntária:** constrangedor, pode durar horas
4. **Hiperpigmentação irregular:** manchas, sardas novas
5. **Pressão arterial:** alteração transitória

**STATUS:**
- NUNCA aprovado por nenhuma agência regulatória
- Proibido em maioria dos países
- Vendido exclusivamente no mercado cinza
- Qualidade MUITO variável

**RECOMENDAÇÃO:**
Risco de estimular melanócito atípico é REAL. Se você tem histórico familiar de melanoma, MUITAS pintas, ou pele muito clara: NÃO USE. O risco não compensa bronzeamento estético.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Usei MT-II na época de praia. Ficou bonito sim, bronzeamento uniforme. Mas ganhei 3 pintas novas que não existiam antes. Parei na hora. Dermatologista disse que eram benignas mas recomendou acompanhamento.',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `ONCOLOGIA: Relatos de caso associando Melanotan II a transformação de nevos pré-existentes. European Journal of Dermatology (2015) publicou 3 casos de melanoma em usuários de MT-II. Causalidade não comprovada, mas associação preocupante.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 13: FRAG 176-191 — ERROS COMUNS
    // ============================================================
    {
      content: 'Quais os erros mais comuns de quem usa FRAG 176-191 e não tem resultado?',
      userId: userIds['user_pep_ana'],
      isAIResponse: false
    },
    {
      content: `Ana, os 7 erros MORTAIS do FRAG:

**1. COMER PERTO DA APLICAÇÃO**
Erro #1 absoluto. Insulina bloqueia FRAG completamente. Precisa de MÍNIMO 30 min jejum antes e 30 min depois. Ideal: 1h antes e 1h depois.

**2. PRODUTO DE BAIXA PUREZA**
Se não tem COA com HPLC mostrando >97% de pureza: provável que é lixo. FRAG é dos peptídeos mais falsificados.

**3. DOSE MUITO BAIXA**
Abaixo de 400mcg/dia total: resultado negligível. O "sweet spot" é 500-600mcg/dia.

**4. CICLO CURTO DEMAIS**
Abaixo de 8 semanas: não dá tempo de ver resultado. Resultado significativo: 12+ semanas.

**5. ESPERAR MILAGRE SEM DIETA**
FRAG potencializa déficit calórico. Sem déficit = sem resultado. Não é queimador mágico.

**6. CONSERVAÇÃO ERRADA**
Deixar frasco fora da geladeira, no sol, no calor: peptídeo degrada em horas. Reconstituído: geladeira SEMPRE.

**7. NÃO COMBINAR COM EXERCÍCIO**
Os ácidos graxos liberados pelo FRAG precisam ser OXIDADOS. Sem exercício (especialmente aeróbico em jejum): os ácidos graxos são re-esterificados. O corpo guarda de volta a gordura que FRAG liberou.

Se alguém usou FRAG e "não funcionou" — 90% das vezes é um desses 7 erros.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'O erro 7 é o que mais pega. As pessoas acham que FRAG vai queimar gordura sentado no sofá. FRAG LIBERA gordura das células. Quem QUEIMA é o exercício. Se não se exercita, a gordura volta pro adipócito.',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: `BIOQUÍMICA: FRAG 176-191 ativa lipase hormônio-sensível (HSL) → triglicerídeos → ácidos graxos livres (FFAs). FFAs circulantes precisam de β-oxidação mitocondrial (exercício aeróbico) para serem eliminados. Sem oxidação: re-esterificação no tecido adiposo em 2-4h.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 14: PT-141 (BREMELANOTIDE) — FUNÇÃO SEXUAL
    // ============================================================
    {
      content: 'PT-141 (Bremelanotide) — peptídeo para disfunção sexual. Funciona para homens e mulheres?',
      userId: userIds['user_pep_laura'],
      isAIResponse: false
    },
    {
      content: `Laura, PT-141 é derivado do Melanotan II:

**O QUE É:**
- Agonista de receptor MC4 (melanocortina 4)
- Derivado do Melanotan II, mas SEM efeito de bronzeamento significativo
- APROVADO PELA FDA (2019) para HSDD feminino (Vyleesi®)
- Mecanismo: age no SNC (cérebro), não vascular

**DIFERENÇA DO VIAGRA/CIALIS:**
- Viagra: vasodilatação peniana (mecânico)
- PT-141: aumenta DESEJO sexual no cérebro (central)
- PT-141 funciona mesmo sem estímulo visual/tátil
- Viagra não funciona sem excitação; PT-141 CRIA excitação

**EM MULHERES (aprovado FDA):**
- Dose: 1.75mg subcutâneo, 45 min antes
- Resultado: aumento significativo de desejo e satisfação
- RCT com 1200+ mulheres confirmou eficácia
- Efeito colateral: náusea (40%), rubor facial (20%)

**EM HOMENS (off-label):**
- Dose: 1-2mg subcutâneo
- Ereção em 30-60 min, duração 2-6h
- Funciona quando Viagra falha (mecanismo diferente)
- Eficaz em disfunção erétil de origem psicogênica

**RISCOS:**
- Náusea intensa (principal limitação)
- Aumento transitório de pressão arterial
- Não usar >8x/mês (recomendação FDA)
- Hiperpigmentação (menor que MT-II mas existe)

Único peptídeo sexual com aprovação regulatória.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Fato: PT-141 foi o primeiro tratamento aprovado pela FDA especificamente para desejo sexual feminino baixo (HSDD). Antes, só existiam tratamentos para disfunção erétil masculina.',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: `APROVAÇÃO: PT-141 (Vyleesi®, AMAG Pharmaceuticals) aprovado FDA junho 2019 para HSDD em mulheres pré-menopausa. Ensaios RECONNECT (Phase III): melhora estatisticamente significativa em desejo sexual e redução de sofrimento relacionado.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 15: EPITHALON — TELÔMEROS E LONGEVIDADE
    // ============================================================
    {
      content: 'Epithalon (Epithalamina) — peptídeo que "alonga telômeros". É o Santo Graal do anti-aging?',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `Thiago, Epithalon é fascinante mas com ressalvas:

**O QUE É:**
- Tetrapeptídeo: Ala-Glu-Asp-Gly
- Análogo sintético da Epithalamina (produzida pela pineal)
- Descoberto pelo Prof. Vladimir Khavinson (Instituto de Bioregulação, Rússia)
- Mecanismo proposto: ativação de telomerase

**TELÔMEROS E ENVELHECIMENTO:**
- Telômeros = "capas" nas pontas dos cromossomos
- Encurtam a cada divisão celular
- Telômeros curtos = senescência = envelhecimento
- Telomerase = enzima que reconstrói telômeros

**EVIDÊNCIA DE EPITHALON:**
- Estudos in vitro: ativação de telomerase em fibroblastos humanos
- Estudo russo (15 anos, 266 pacientes >60 anos): mortalidade 1.6x menor no grupo Epithalon
- Modelo animal: aumento de vida média em 13-30% (camundongos)
- Aumento de melatonina endógena

**PORÉM:**
1. Maioria dos estudos é do MESMO grupo (Khavinson) — viés potencial
2. Zero replicação independente ocidental
3. Estudos russos frequentemente questionados metodologicamente
4. Risco teórico: ativar telomerase em célula cancerosa = ALIMENTAR tumor
5. Não aprovado por nenhuma agência regulatória

**PROTOCOLO (se decidir usar):**
- 5-10mg/dia subcutâneo por 10-20 dias
- 2 ciclos por ano
- Monitorar: comprimento telomérico (teste caro), melatonina, marcadores tumorais

**VEREDITO:**
Promissor em teoria, mas evidência fraca (grupo único, sem replicação). Risco de estimular telomerase em células malignas é preocupante. Não recomendo sem acompanhamento médico especializado.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'O problema de "ligar telomerase" é que câncer também usa telomerase pra se tornar imortal. Epithalon pode ser anti-aging E pró-câncer ao mesmo tempo?',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: 'Marina, exato. É o paradoxo da telomerase. Estudos de Khavinson AFIRMAM que Epithalon é seletivo (ativa telomerase só em células saudáveis). Mas a evidência é do grupo dele mesmo. Ninguém replicou. Eu pessoalmente não recomendo até ter dados independentes.',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: `ONCOLOGIA: 85% dos cânceres expressam telomerase elevada. Ativação indiscriminada de telomerase é contraindicada em pacientes com risco oncológico. Rastreamento com marcadores tumorais (CEA, PSA, CA-125) antes de usar Epithalon é prudente.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 16: IGF-1 LR3 — O PEPTÍDEO ANABÓLICO
    // ============================================================
    {
      content: 'IGF-1 LR3 — o peptídeo mais anabólico? Qual a relação com GH e como funciona?',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: `Diego, IGF-1 LR3 é o "end product" da cascata GH:

**CASCATA:**
GH → fígado → IGF-1 → crescimento muscular

**IGF-1 LR3 (Long R3):**
- Versão modificada do IGF-1 humano
- "Long" = 13 aminoácidos extras na cadeia
- "R3" = Arg na posição 3 (reduz ligação a IGFBP)
- Resultado: meia-vida 20-30h (vs 12-15h do IGF-1 nativo)
- Mais potente porque MENOS se liga a proteínas de transporte

**EFEITOS:**
- Hiperplasia muscular (novas fibras, não só hipertrofia)
- Captação de glicose pelo músculo (efeito insulino-like)
- Lipólise moderada
- Proliferação celular geral

**RISCOS SÉRIOS:**
1. **Hipoglicemia:** age como insulina, pode causar hipoglicemia SEVERA
2. **Crescimento tumoral:** IGF-1 estimula QUALQUER célula a crescer
3. **Acromegalia:** uso prolongado → crescimento de ossos e tecidos
4. **Crescimento intestinal:** contribui para "GH gut"
5. **Cardiomegalia:** coração cresce (irreversível)

**DOSE (avançados APENAS):**
- 20-40mcg/dia, subcutâneo bilateral pós-treino
- Ciclo: 4-6 semanas máximo
- NUNCA usar sem monitoramento de glicemia

**CLASSIFICAÇÃO DE RISCO:**
IGF-1 LR3 é dos peptídeos mais PERIGOSOS. Não é para iniciante. Risco de hipoglicemia fatal em dose errada. Risco oncológico real. Só justificável em contexto de competição de alto nível com supervisão médica.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Hiperplasia vs hipertrofia: hipertrofia = fibras maiores. Hiperplasia = fibras NOVAS. IGF-1 é um dos únicos compostos que consegue hiperplasia em humanos. É por isso que os pros crescem além do "limite genético".',
      userId: userIds['user_pep_bruno'],
      isAIResponse: false
    },
    {
      content: `ALERTA MÉDICO: IGF-1 LR3 tem índice terapêutico estreito. Diferença entre dose eficaz e dose tóxica é pequena. Hipoglicemia induzida por IGF-1 pode ser fatal. Uso OBRIGATÓRIO de glucômetro durante protocolo. Classificação WADA: substância proibida S2.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 17: SELANK E SEMAX — NOOTROPIC PEPTIDES
    // ============================================================
    {
      content: 'Selank e Semax — peptídeos nootropicos russos. Funcionam para cognição e ansiedade?',
      userId: userIds['user_pep_laura'],
      isAIResponse: false
    },
    {
      content: `Laura, são dos mais estudados na Rússia:

**SELANK:**
- Heptapeptídeo análogo do tuftsina (peptídeo imune)
- Desenvolvido no Institute of Molecular Genetics (Moscou)
- Aprovado na Rússia como ansiolítico (2009)
- Via: intranasal

**Mecanismo:**
- Modula GABA-A (similar a benzodiazepínico mas sem dependência)
- Aumenta BDNF (fator neurotrófico)
- Reduz encefalinase (preserva endorfinas)
- Efeito ansiolítico SEM sedação

**SEMAX:**
- Heptapeptídeo análogo do ACTH (4-10)
- Aprovado na Rússia para AVC e cognição (1994)
- Via: intranasal

**Mecanismo:**
- Aumenta BDNF significativamente (+300% em estudos animais)
- Modula dopamina e serotonina
- Neuroprotetor (anti-isquêmico)
- Melhora memória de trabalho e atenção

**EVIDÊNCIA:**
- Selank: 3 RCTs russos mostram eficácia para ansiedade generalizada
- Semax: aprovado para tratamento de AVC na Rússia
- Ambos: perfil de segurança bom (décadas de uso clínico russo)
- LIMITAÇÃO: quase zero publicações em journals ocidentais de alto impacto

**EXPERIÊNCIA PRÁTICA:**
- Selank: efeito ansiolítico notável em 15-30 min, dura 3-6h
- Semax: foco e clareza mental em 30-60 min, dura 4-8h
- Combinação: sinérgica (Selank reduz ansiedade, Semax aumenta foco)

**DOSE:**
- Selank: 300-600mcg intranasal 2-3x/dia
- Semax: 200-600mcg intranasal 2-3x/dia`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Uso Semax 400mcg intranasal pela manhã. Foco melhorou muito comparado a quando usava só cafeína. Sem jitters, sem crash. Efeito mais "limpo" que qualquer nootropico que já testei.',
      userId: userIds['user_pep_laura'],
      isAIResponse: false
    },
    {
      content: `NEUROFARMACOLOGIA: Semax e Selank são os únicos peptídeos nootropicos com aprovação regulatória (Rússia). BDNF elevado por Semax pode ter implicações em neuroplasticidade e proteção contra neurodegeneração. Estudos em modelo de Alzheimer são promissores (animal).`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 18: DSIP — PEPTÍDEO DO SONO
    // ============================================================
    {
      content: 'DSIP (Delta Sleep Inducing Peptide) — peptídeo pra dormir melhor. Funciona?',
      userId: userIds['user_pep_camila'],
      isAIResponse: false
    },
    {
      content: `Camila, DSIP é controverso:

**O QUE É:**
- Nonapeptídeo (9 aminoácidos) isolado do sangue de coelhos em sono (1977)
- Nome sugere: induz sono delta (profundo)
- Via: intravenosa ou subcutânea

**EVIDÊNCIA:**
- Estudos iniciais (1977-1990): promissores, aumento de ondas delta
- Estudos posteriores: resultados INCONSISTENTES
- Alguns mostram: melhora do sono, redução de cortisol
- Outros: nenhum efeito sobre sono
- Possível efeito: normalização do ritmo circadiano (não indução direta)

**PROBLEMA:**
- Meia-vida: ~7-8 minutos (extremamente curta)
- Degradado por aminopeptidases no sangue rapidamente
- Para funcionar: aplicação IV contínua ou múltiplas subcutâneas
- Resultado inconsistente entre indivíduos

**PROTOCOLO (se quiser testar):**
- 100mcg subcutâneo 1h antes de dormir
- Ciclo: 10-14 dias
- Expectativa: modesta, variável

**ALTERNATIVAS MELHORES PARA SONO:**
1. Melatonina 0.3-1mg (dose fisiológica, NÃO 10mg)
2. Magnésio glicina 400mg
3. L-teanina 200mg
4. Glicina 3g

Honestamente: DSIP não vale o investimento. Alternativas OTC são mais baratas, mais acessíveis e com mais evidência.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Concordo. Testei DSIP por 2 semanas. Zero diferença perceptível. Magnésio + melatonina micro-dose (0.5mg) funcionou 100x melhor e custa R$30/mês.',
      userId: userIds['user_pep_camila'],
      isAIResponse: false
    },
    {
      content: `SONO: Melatonina em dose fisiológica (0.3-1mg) é superior a DSIP em todos os parâmetros estudados: latência, eficiência, duração de sono profundo. Doses altas de melatonina (>3mg) paradoxalmente PIORAM sono por dessensibilização de receptores.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 19: BPC-157 ORAL vs INJETÁVEL
    // ============================================================
    {
      content: 'BPC-157 oral (cápsulas) vs injetável (subcutâneo) — qual a diferença real na prática?',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `Felipe, comparação direta:

**ORAL:**
- Biodisponibilidade: ~40-50%
- Efeito: sistêmico + forte ação GI (estômago, intestino)
- Indicação principal: gut health, gastrite, úlcera, intestino permeável
- Conveniência: fácil (cápsula/solução)
- Dose necessária: MAIOR (500-1000mcg 2x/dia)

**SUBCUTÂNEO:**
- Biodisponibilidade: ~80-90%
- Efeito: local + sistêmico
- Indicação principal: tendão, ligamento, músculo, articulação
- Conveniência: requer agulha, reconstituição
- Dose necessária: MENOR (250-500mcg 2x/dia)

**QUANDO ORAL:**
- Problemas digestivos (IBS, leaky gut, gastrite, úlcera)
- Quem tem pavor de agulha
- Manutenção/prevenção geral

**QUANDO SUBCUTÂNEO:**
- Lesão localizada específica (tendinopatia, entorse)
- Quer efeito máximo com menor dose
- Lesão profunda (joelho, ombro)

**COMBO:**
Alguns usam AMBOS: oral para gut + subcutâneo no local da lesão. Não há contraindicação em combinar vias.

**CUSTO:**
- Oral: cápsulas manipuladas ~R$200-400/mês
- Subcutâneo: frasco reconstituível ~R$150-300/mês
- Subcutâneo é mais eficiente (menor dose necessária)`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Uso oral pro intestino (tenho IBS) e subcutâneo no joelho (condropatia patelar). Ambos funcionando. Intestino: melhora em 2 semanas. Joelho: melhora gradual em 6 semanas.',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `GASTROENTEROLOGIA: BPC-157 demonstra proteção de mucosa gástrica comparável ao omeprazol em modelo animal de úlcera induzida. Mecanismo: upregulação de receptores EGF na mucosa. Via oral é preferível para indicações gastrointestinais.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 20: KISSPEPTIN — EIXO HPG
    // ============================================================
    {
      content: 'Kisspeptin — vi que regula todo o eixo hormonal (HPG). Pode substituir TPC?',
      userId: userIds['user_pep_bruno'],
      isAIResponse: false
    },
    {
      content: `Bruno, Kisspeptin é o "master switch" do eixo HPG:

**O QUE É:**
- Neuropeptídeo produzido no hipotálamo (núcleo arcuato)
- Estimula liberação de GnRH → LH + FSH → testosterona/estrogênio
- É literalmente o INTERRUPTOR que liga a puberdade
- Descoberto em 2003 (revolução em endocrinologia reprodutiva)

**POR QUE É INTERESSANTE PRA TPC:**
- Estimula GnRH de forma FISIOLÓGICA
- Não é GnRH direto (que causa dessensibilização)
- Mantém pulsatilidade do eixo
- Teoria: poderia "religar" eixo HPG pós-ciclo

**EVIDÊNCIA:**
- Kisspeptin-10 IV: aumenta LH em 200-400% em 30 min (humanos)
- Restaura pulsos de GnRH em modelos de supressão
- Ensaios clínicos em hipogonadismo funcional: promissores

**MAS:**
1. Meia-vida EXTREMAMENTE curta (~4 min para Kp-10)
2. Precisa de infusão contínua (impraticável fora de hospital)
3. Kp-54 tem meia-vida maior (~30 min) mas ainda curta
4. Custo proibitivo para uso crônico
5. Não disponível em mercado de peptídeos de pesquisa (raro)

**vs TPC CONVENCIONAL (Tamoxifeno+HCG):**
Em teoria: Kisspeptin seria TPC "perfeita" (fisiológica). Na prática: logisticamente impossível (meia-vida, custo, disponibilidade). Tamoxifeno + HCG continuam sendo gold standard para TPC.

Kisspeptin é mais relevante para PESQUISA de infertilidade do que para TPC prática.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Então Kisspeptin é teoricamente perfeito mas impraticável? Decepcionante.',
      userId: userIds['user_pep_bruno'],
      isAIResponse: false
    },
    {
      content: `ENDOCRINOLOGIA REPRODUTIVA: Kisspeptin é alvo de pesquisa intensa para tratamento de infertilidade (FIV). Imperial College London lidera ensaios clínicos usando Kisspeptin como trigger de ovulação. Elimina risco de hiperestimulação ovariana vs HCG convencional.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 21: FRAG 176-191 + EXERCÍCIO — TIMING
    // ============================================================
    {
      content: 'FRAG + aeróbico em jejum — é realmente a combinação perfeita?',
      userId: userIds['user_pep_igor'],
      isAIResponse: false
    },
    {
      content: `Igor, sim. É a combinação mais sinérgica:

**POR QUE FUNCIONA:**
1. FRAG em jejum → máxima ativação de HSL (sem insulina bloqueando)
2. Ácidos graxos livres (FFAs) liberados ficam na circulação
3. Aeróbico moderado (60-70% FC máx) OXIDA esses FFAs
4. Sem o aeróbico: FFAs são re-esterificados em 2-4h

**PROTOCOLO IDEAL:**
- 05:30 — Acordar, FRAG 250-500mcg subcutâneo
- 06:00 — Cardio em jejum (caminhada rápida, bike leve) 30-45 min
- 06:45 — Esperar 15-30 min
- 07:15 — Primeira refeição do dia

**INTENSIDADE DO CARDIO:**
- MODERADA é chave (60-70% FC máx)
- Alta intensidade (HIIT) muda substrato para glicogênio → menos oxidação de FFA
- Caminhada rápida/inclinada é IDEAL

**DADOS DE APOIO:**
- Estudo Horowitz (1997): exercício em jejum oxida 20-30% mais gordura
- FRAG eleva FFAs em 150-300% vs basal
- Combinação teórica: oxidação lipídica 40-60% superior

**ERROS:**
- Fazer HIIT intenso: muda substrato, perde sinergia
- Tomar café com leite antes: insulina bloqueia FRAG
- Café preto puro: OK (sem insulina)
- Demorar >2h entre FRAG e cardio: FFAs já re-esterificaram`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Faço exatamente isso há 10 semanas. FRAG 5:30, caminhada inclinada 45min 6:00. Perdi 3.2kg de gordura mantendo massa. Bioimpedância e plicometria confirmam. O truque é manter intensidade BAIXA.',
      userId: userIds['user_pep_igor'],
      isAIResponse: false
    },
    {
      content: `FISIOLOGIA: Exercício aeróbico em jejum maximiza oxidação lipídica via: 1) Baixa insulina, 2) Elevação de catecolaminas, 3) Ativação de AMPK, 4) Aumento de carnitina palmitoltransferase (CPT-1). FRAG potencializa o passo 1 e a disponibilidade de substrato.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 22: SEGURANÇA GERAL DE PEPTÍDEOS
    // ============================================================
    {
      content: 'Análise geral: quais peptídeos são MAIS seguros e quais são MAIS perigosos?',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: `Renata, classificação de risco (minha avaliação baseada em evidência):

**RISCO BAIXO (perfil de segurança bom):**
- BPC-157 — décadas de pesquisa, zero efeitos adversos graves
- GHK-Cu (tópico) — peptídeo natural, bem tolerado
- Creatina — não é peptídeo mas MUITO seguro
- Sermorelin — histórico de aprovação FDA

**RISCO MODERADO (colaterais gerenciáveis):**
- FRAG 176-191 — sem efeitos metabólicos graves, mas pureza é risco
- CJC-1295 + Ipamorelin — bem tolerados, monitorar IGF-1
- TB-500 — bom perfil, mas sem dados de longo prazo
- Selank/Semax — décadas de uso clínico russo, bom perfil

**RISCO ALTO (colaterais significativos):**
- MK-677 — resistência à insulina, retenção hídrica
- Melanotan II — risco de nevos, melanoma teórico
- PT-141 — aprovado FDA mas náusea intensa
- Epithalon — risco oncológico teórico (telomerase)

**RISCO MUITO ALTO (potencialmente perigoso):**
- IGF-1 LR3 — hipoglicemia fatal possível, crescimento tumoral
- Insulina exógena — não é peptídeo de pesquisa mas é usada como tal, morte por hipoglicemia
- HGH dose alta — acromegalia, cardiomegalia, resistência à insulina

**REGRA GERAL:**
Quanto mais POTENTE o efeito anabólico/hormonal, MAIOR o risco. Peptídeos reparadores (BPC, TB-500, GHK) são mais seguros que peptídeos hormonais (IGF-1, GH secretagogos).`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Boa classificação. Acrescentaria: o MAIOR risco com qualquer peptídeo não é o composto em si, é a QUALIDADE do produto. Comprar de fonte duvidosa com 50% de pureza e contaminação bacteriana é mais perigoso que qualquer peptídeo "de risco alto" puro.',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: `FARMACOVIGILÂNCIA: Sem aprovação regulatória, peptídeos de pesquisa não passam por controle de qualidade farmacêutico. FDA reporta contaminação bacteriana, endotoxinas e pureza <60% em amostras apreendidas. COA (Certificate of Analysis) com HPLC é indispensável.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 23: COLÁGENO PEPTÍDEO — MITO vs REALIDADE
    // ============================================================
    {
      content: 'Colágeno hidrolisado é marketing ou funciona? Pele, cabelo, articulações.',
      userId: userIds['user_pep_ana'],
      isAIResponse: false
    },
    {
      content: `Ana, evidência moderada:

**O QUE É:**
- Proteína de colágeno quebrada em peptídeos pequenos (2-5 kDa)
- Absorção: ~90% (dipeptídeos Pro-Hyp e Hyp-Gly circulam no sangue)

**EVIDÊNCIA POR INDICAÇÃO:**

**Pele:** MODERADA ✓
- Meta-análise 2019 (19 RCTs, 1125 participantes): melhora significativa em hidratação (+8%), elasticidade (+4%), rugas (-6%)
- Dose eficaz: 2.5-10g/dia por 8-12 semanas
- NÃO é milagre, é modesto

**Articulação:** MODERADA ✓
- Colágeno tipo II não-desnaturado (UC-II): 40mg/dia → melhora em osteoartrite
- Colágeno hidrolisado: dados menos consistentes para articulação
- Mecanismo: tolerância imune oral (UC-II) vs substrato (hidrolisado)

**Cabelo/Unhas:** FRACA △
- Dados limitados, maioria patrocinada pela indústria
- Possível benefício, mas confundido por outros fatores

**COMPARAÇÃO COM WHEY:**
Se você JÁ toma proteína suficiente: colágeno é redundante. Glicina + prolina do colágeno estão presentes em outras proteínas. Diferença: colágeno pode ter efeito de "sinalização" (estimula fibroblasto), não só substrato.

**DOSE:**
- Pele: 5-10g/dia hidrolisado + vitamina C (ESSENCIAL)
- Articulação: 40mg/dia UC-II (tipo II) OU 10g/dia hidrolisado
- Combine com vitamina C (cofator de síntese)`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Tomo 10g colágeno + 500mg vitamina C há 6 meses. Pele melhorou (medida por corneômetro em dermatologista). Unhas mais resistentes. Custo-benefício razoável.',
      userId: userIds['user_pep_ana'],
      isAIResponse: false
    },
    {
      content: `DERMATOLOGIA: Vitamina C é cofator ESSENCIAL para enzima prolil-hidroxilase (síntese de colágeno). Colágeno sem vitamina C = substrato sem enzima. Suplementação combinada é biologicamente racional.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 24: CREATINA — O SUPLEMENTO DEFINITIVO
    // ============================================================
    {
      content: 'Creatina monoidratada — segurança renal, dosagem, timing. Discussão definitiva.',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `Felipe, creatina é o suplemento com MAIS evidência:

**SEGURANÇA RENAL (pergunta #1):**
- Meta-análise 2017 (>200 estudos): ZERO nefrotoxicidade em saudáveis
- Até 20g/dia por 5+ anos: seguro
- Creatina sérica elevada = esperado (não é dano renal)
- Doença renal pré-existente: evitar (cautela, não evidência de dano)

**DOSE:**
- 3-5g/dia contínuo: SUFICIENTE e seguro
- Fase de carga (20g/dia por 7 dias): desnecessária (5g chega lá em 4 semanas)
- Timing: qualquer hora do dia (não importa pré vs pós treino)

**EFEITOS COMPROVADOS:**
- Força: +5-10% em 4 semanas
- Massa muscular: +1-2kg (água intramuscular + hipertrofia)
- Performance anaeróbica: +5-15%
- Cognição: melhora em privação de sono e estresse mental
- Neuroproteção: dados promissores em TBI e depressão

**MITOS DESTRUÍDOS:**
- "Estraga rim": FALSO (200+ estudos)
- "Precisa ciclar": FALSO (uso contínuo é seguro)
- "Causa desidratação": FALSO (aumenta hidratação intracelular)
- "Causa câimbra": FALSO (pode até reduzir)
- "Creatina HCL é melhor": FALSO (monoidratada é gold standard)

5g/dia monoidratada. Pra sempre. Fim da discussão.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Uma pergunta: creatina funciona para mulheres também? Ou é "coisa de homem"?',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: 'Renata, funciona IGUALMENTE. Mulheres costumam ter estoques menores de creatina muscular, então proporcionalmente podem se beneficiar MAIS. Mesma dose: 3-5g/dia. Não masculiniza, não engorda (o ganho de peso é água intracelular, não gordura).',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: `ISSN Position Stand (2017): Creatina monoidratada é o suplemento ergogênico mais eficaz disponível para aumentar capacidade de exercício de alta intensidade e massa corporal magra. Segurança confirmada em todas as faixas etárias.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 25: FRAG 176-191 — STACK COM OUTROS PEPTÍDEOS
    // ============================================================
    {
      content: 'FRAG 176-191 combina com outros peptídeos? Quais stacks fazem sentido?',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `Thiago, stacks que fazem sentido farmacológico:

**FRAG + CJC-1295/Ipamorelin:**
- FRAG: lipólise direta
- CJC+Ipa: aumenta GH endógeno → lipólise + recuperação + sono
- Sinergia: efeitos complementares
- Timing: FRAG manhã jejum, Ipa noite
- Boa combinação para recomposição corporal

**FRAG + BPC-157:**
- FRAG: lipólise
- BPC-157: recuperação tendínea
- Sem interação negativa
- Para quem treina pesado + quer perder gordura + tem lesão
- Podem ser aplicados no mesmo horário (locais diferentes)

**FRAG + T3 (liotironina) micro-dose:**
- FRAG: lipólise via HSL
- T3 micro-dose (12.5-25mcg): aumenta metabolismo basal
- CUIDADO: T3 pode causar catabolismo se dose alta
- Apenas avançados com monitoramento de TSH

**FRAG + CARDARINE (GW501516):**
- FRAG: libera FFAs
- Cardarine: aumenta oxidação de FFAs via PPARδ
- Sinergia MÁXIMA para lipólise
- MAS: Cardarine tem risco oncológico (parou ensaios por câncer em ratos)
- NÃO RECOMENDO Cardarine

**STACKS QUE NÃO FAZEM SENTIDO:**
- FRAG + insulina: insulina BLOQUEIA FRAG (oposto)
- FRAG + GH dose alta: redundante (GH já faz lipólise)
- FRAG + MK-677: MK-677 aumenta insulina → pode antagonizar FRAG parcialmente`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Uso FRAG manhã + Ipamorelin noite. Perda de gordura + sono profundo. Melhor combo custo-benefício que encontrei.',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `FARMACOLOGIA: Stacks de peptídeos devem considerar interações farmacodinâmicas. Insulina antagoniza HSL (alvo do FRAG). Qualquer composto que eleve insulina (MK-677, refeição, GH dose alta) reduz eficácia do FRAG. Separação temporal é estratégia chave.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 26: INIBIDORES DE AROMATASE — QUANDO NECESSÁRIOS
    // ============================================================
    {
      content: 'Inibidores de aromatase (Anastrozol, Letrozol) — quando são necessários e quando é paranoia?',
      userId: userIds['user_pep_rafael'],
      isAIResponse: false
    },
    {
      content: `Rafael, guia prático:

**NECESSÁRIO (com exames):**
- Em TRT quando estradiol >60 pg/mL com sintomas
- Em ciclo com compostos aromatizáveis (testosterona, dianabol)
- Ginecomastia ativa (nódulo palpável)
- Retenção hídrica severa + PA elevada

**DESNECESSÁRIO (paranoia):**
- Homem natural com estradiol normal (<45 pg/mL)
- Em TRT com estradiol <50 sem sintomas
- "Prevenção" sem exame (risco de estradiol baixo demais)

**PERIGO DO ESTRADIOL MUITO BAIXO:**
- Articulações secas (dor articular severa)
- Libido ZERO (estradiol é essencial para libido masculina)
- Disfunção erétil (paradoxal — muitos pensam que é excesso)
- Osteoporose acelerada
- Depressão e irritabilidade

**DOSES TÍPICAS:**
- Anastrozol: 0.25-0.5mg 2-3x/semana (NÃO 1mg/dia!)
- Letrozol: 0.25mg 2-3x/semana (MUITO potente, cuidado)
- Exemestano: 12.5mg 2-3x/semana (suicida, irreversível)

**REGRA DE OURO:**
Trate EXAMES, não sintomas. Se estradiol está <50 pg/mL em homem: NÃO tome IA. Muitos esmagam estradiol e ficam PIORES que com estradiol alto.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Cometi esse erro. Esmaguei meu estradiol com 1mg anastrozol/dia. Estradiol foi pra 5 pg/mL. Articulações doíam tanto que mal conseguia treinar. Demorou 6 semanas pra normalizar após parar o IA.',
      userId: userIds['user_pep_rafael'],
      isAIResponse: false
    },
    {
      content: `ENDOCRINOLOGIA: Estradiol é essencial para saúde óssea, cardiovascular e neurológica em homens. Nível ideal: 20-45 pg/mL. Supressão excessiva (<15 pg/mL) causa: perda óssea acelerada (-3% DMO/ano), disfunção endotelial e comprometimento cognitivo.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 27: AOD-9604 — RELATOS PRÁTICOS
    // ============================================================
    {
      content: 'AOD-9604 experiências práticas — quem usou? Resultados comparados com FRAG?',
      userId: userIds['user_pep_ana'],
      isAIResponse: false
    },
    {
      content: 'Usei AOD-9604 por 14 semanas (500mcg/dia). Resultado: 3.1kg de gordura perdidos (DEXA). Muito similar ao que tinha com FRAG, mas senti menos irritação no ponto de injeção. Qualidade do produto parecia melhor (fonte australiana com COA).',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: 'Diego, sua experiência confirma o esperado: AOD-9604 e FRAG têm eficácia similar, com AOD sendo marginalmente melhor em estabilidade. A diferença real é na FONTE. AOD australiano com COA vs FRAG chinês sem certificação... o produto em si muda menos que a qualidade.',
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Tentei AOD-9604 oral (spray sublingual). Achei que seria mais conveniente que injeção. Resultado: praticamente ZERO. Biodisponibilidade oral do AOD é mínima comparada ao subcutâneo.',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `FARMACOCINÉTICA: AOD-9604 e FRAG 176-191 têm biodisponibilidade oral inferior a 5% (degradação no TGI). Via subcutânea é obrigatória para efeito clínico. Formulações orais/sublinguais são ineficazes na evidência atual.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 28: GLUTATIONA — ANTIOXIDANTE MASTER
    // ============================================================
    {
      content: 'Glutationa IV/oral — o "master antioxidant". Vale a pena suplementar?',
      userId: userIds['user_pep_camila'],
      isAIResponse: false
    },
    {
      content: `Camila, glutationa é complexa:

**O QUE É:**
- Tripeptídeo (Glu-Cys-Gly) = principal antioxidante intracelular
- Presente em TODAS as células humanas
- Concentração diminui com idade e estresse oxidativo

**FORMAS DE SUPLEMENTAÇÃO:**

**IV (intravenosa):** EFICAZ
- Bypass completo do TGI
- Aumento sérico imediato e significativo
- Clínicas de "wellness" cobram R$500-1000/sessão
- Duração: pico em 1h, normaliza em 24h

**Oral (glutationa reduzida):** INEFICAZ
- Degradada no TGI por peptidases
- Biodisponibilidade: <5%
- A maioria das cápsulas NÃO funciona

**Oral (lipossomal):** MODERADA
- Encapsulada em lipossomo protege da digestão
- Biodisponibilidade: ~30-40%
- Melhor opção oral disponível

**NAC (N-Acetil Cisteína):** MELHOR CUSTO-BENEFÍCIO
- Precursor de glutationa (cisteína é rate-limiting)
- 600-1200mg/dia oral → aumenta glutationa intracelular
- Barato, disponível, eficaz
- Sem necessidade de IV

**RECOMENDAÇÃO:**
Em vez de gastar em glutationa IV: NAC 600mg 2x/dia + vitamina C + selênio. Seu corpo PRODUZ glutationa. Dê os precursores (NAC), não tente suplementar direto.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'NAC é absurdamente subestimado. 600mg 2x/dia. Barato, seguro, múltiplos benefícios: antioxidante, mucolítico, hepatoprotetor, neuroprotector. Deveria ser tão popular quanto creatina.',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: `BIOQUÍMICA: N-Acetil Cisteína (NAC) fornece cisteína, aminoácido rate-limiting na síntese de glutationa. Glutationa peroxidase (GPx) depende de selênio como cofator. Combinação NAC + selênio é mais eficiente que glutationa exógena para elevação intracelular.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 29: BPC-157 PARA GUT HEALTH
    // ============================================================
    {
      content: 'BPC-157 específico para saúde intestinal — intestino permeável, IBS, SIBO. Funciona?',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: `Renata, BPC-157 para GI é onde tem a MELHOR evidência:

**POR QUE GI É O FORTE DO BPC-157:**
- Lembre: BPC-157 é derivado de proteína GÁSTRICA
- Evoluiu para sobreviver e atuar no TGI
- Via oral funciona bem para indicações GI

**EVIDÊNCIA (animal, robusta):**
- Úlcera gástrica: cicatrização 40-60% mais rápida
- Colite: redução de inflamação comparável a mesalazina
- Fístula esôfago-cutânea: cicatrização acelerada
- Anastomose intestinal: melhora de cicatrização pós-cirúrgica
- Lesão por AINE: proteção gástrica confirmada

**PARA INTESTINO PERMEÁVEL (leaky gut):**
- Teoria: BPC-157 restaura tight junctions (junções estreitas)
- Evidência animal: reduz permeabilidade intestinal induzida por estresse
- Mecanismo: upregulação de ZO-1 e ocludina (proteínas de junção)
- Humano: relatos consistentes de melhora, mas sem RCT

**PROTOCOLO GI:**
- BPC-157 ORAL: 500mcg 2x/dia (manhã jejum + antes de dormir)
- Duração: 8-12 semanas
- Combine com: L-glutamina 5g/dia + probiótico + dieta anti-inflamatória
- Monitorar: sintomas GI, calprotectina fecal, zonulina sérica

**PARA IBS:**
Relatos anedóticos de melhora significativa (70%+ dos que tentam). Redução de distensão, dor, irregularidade. Mas: IBS tem FORTE componente placebo.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Tenho IBS-D há 5 anos. Tentei de TUDO. BPC-157 oral 500mcg 2x/dia por 10 semanas: melhor coisa que já fiz. Distensão reduziu 80%. Frequência intestinal normalizou. Pode ser placebo? Pode. Mas não quero voltar atrás.',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: `GASTROENTEROLOGIA: BPC-157 demonstra proteção de mucosa gástrica superior ao sucralfato e comparável ao omeprazol em modelos de úlcera. Mecanismo inclui: estimulação de EGF, aumento de óxido nítrico local, e modulação de prostaglandinas. Via oral é preferível para indicações GI.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 30: PEPTÍDEOS vs FARMACOLOGIA TRADICIONAL
    // ============================================================
    {
      content: 'Peptídeos de pesquisa vs medicamentos aprovados — por que peptídeos não são aprovados? É lobby ou falta de evidência?',
      userId: userIds['user_pep_laura'],
      isAIResponse: false
    },
    {
      content: `Laura, é uma combinação de fatores:

**POR QUE PEPTÍDEOS NÃO SÃO APROVADOS:**

**1. CUSTO DE APROVAÇÃO:**
- Levar um medicamento da bancada ao mercado: $1-3 bilhões USD
- Peptídeos NÃO são patenteáveis facilmente (moléculas naturais ou simples)
- Sem patente = sem monopólio = sem ROI = nenhuma pharma investe

**2. EVIDÊNCIA INSUFICIENTE:**
- Maioria dos peptídeos tem: estudos in vitro + animal + case reports
- FDA exige: Phase I + II + III (milhares de pacientes, anos)
- Custo para fazer isso: proibitivo sem incentivo de patente

**3. REGULAMENTAÇÃO:**
- Peptídeos caem no "limbo": não são medicamento, não são suplemento
- FDA classifica como "research chemicals" (não para consumo humano)
- ANVISA idem: sem categoria regulatória clara

**4. NÃO É (APENAS) LOBBY:**
- BPC-157 tem 1000+ publicações mas ZERO RCT humano rigoroso
- Sikiric (maior pesquisador BPC) nunca fez Phase III
- Sem dados de segurança de longo prazo controlados

**EXCEÇÕES (peptídeos APROVADOS):**
- PT-141 (Vyleesi®) — aprovado FDA
- Semaglutida (Ozempic®) — análogo GLP-1, aprovado
- Sermorelin (Geref®) — foi aprovado FDA
- Teriparatida (Forteo®) — PTH, aprovado

**VEREDITO:**
Não é conspiração. É economia + regulamentação + falta de incentivo. Se BPC-157 fosse patenteável, uma pharma já teria investido $2 bilhões pra aprovar. Mas BPC-157 é uma molécula simples demais pra proteger com patente.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Faz sentido. Semaglutida (Ozempic) é um PEPTÍDEO aprovado. A diferença: Novo Nordisk gastou bilhões porque conseguiu patente (molécula modificada). BPC-157 não dá pra patentear.',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: `REGULATÓRIO: O processo de aprovação FDA (NDA/BLA) exige investimento médio de $2.6B e tempo médio de 12 anos. Para peptídeos sem proteção patentária, ROI negativo desincentiva investimento privado. Modelo de financiamento público (NIH) poderia viabilizar, mas prioridades são doenças graves.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 31: FRAG 176-191 — PARA MULHERES
    // ============================================================
    {
      content: 'FRAG 176-191 é seguro para mulheres? Funciona diferente?',
      userId: userIds['user_pep_camila'],
      isAIResponse: false
    },
    {
      content: `Camila, FRAG é IGUAL para mulheres:

**SEGURANÇA:**
- Sem efeitos androgênicos (não masculiniza)
- Sem efeito em estrogênio/progesterona
- Seguro durante ciclo menstrual normal
- EVITAR na gravidez (sem dados)

**DIFERENÇAS PRÁTICAS:**
- Mulheres tendem a responder BEM (estrogênio facilita lipólise em alguns depósitos)
- Dose pode ser ligeiramente menor: 400-500mcg/dia (vs 500-600 homens)
- Mesmos horários: jejum manhã + antes de dormir
- Mesmo protocolo de exercício aeróbico em jejum

**RESULTADOS EM MULHERES:**
- Perda de gordura similar (~2-4kg em 12 semanas com dieta)
- Mulheres reportam melhora em "gordura teimosa" (quadril, coxas)
- FRAG não afeta hormônios femininos

FRAG é um dos poucos compostos de performance que funciona IGUALMENTE em ambos os sexos sem colaterais específicos de gênero.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Uso FRAG há 10 semanas. Sou mulher, 32 anos. Perdi 2.8kg de gordura mantendo massa. A "pochete" que não saia nem com dieta finalmente diminuiu. Sem efeito colateral.',
      userId: userIds['user_pep_camila'],
      isAIResponse: false
    },
    {
      content: `FISIOLOGIA: FRAG 176-191 não interage com receptores de esteroides sexuais (andrógeno, estrogênio, progesterona). Ação exclusiva sobre lipase hormônio-sensível no adipócito. Segurança endócrina feminina mantida em doses terapêuticas.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 32: QUALIDADE E PROCEDÊNCIA DE PEPTÍDEOS
    // ============================================================
    {
      content: 'Como avaliar qualidade de peptídeos de pesquisa? O que olhar no COA?',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `Felipe, guia de avaliação de qualidade:

**O QUE EXIGIR NO COA (Certificate of Analysis):**

1. **HPLC (High Performance Liquid Chromatography):**
   - Pureza mínima aceitável: >97%
   - Ideal: >99%
   - Se não tem HPLC no COA: DESCARTE

2. **Mass Spectrometry (MS):**
   - Confirma peso molecular correto
   - Se o peso não bate: é outro peptídeo ou degradado

3. **Endotoxin Test (LAL):**
   - <0.5 EU/mg = aceitável
   - Endotoxinas causam febre, inflamação, choque séptico
   - MUITOS fornecedores PULAM este teste

4. **Sterility Test:**
   - Certificado de esterilidade
   - Peptídeo contaminado = abscesso, infecção

5. **Appearance:**
   - Pó branco ou off-white (maioria dos peptídeos)
   - Amarelado ou com grumos: degradação possível

**RED FLAGS:**
- COA genérico (não específico do lote)
- Sem número de lote
- Sem data de análise
- Pureza <95%
- Sem teste de endotoxina
- Preço absurdamente baixo (provavelmente diluído)

**FONTES CONFIÁVEIS (critérios):**
- Publicam COA específico por lote
- Fazem third-party testing (lab independente)
- Resposta técnica ao suporte
- Reviews verificáveis
- Preço condizente com mercado (nem muito caro nem barato demais)`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Já comprei peptídeo barato sem COA. Resultado: zero. Depois comprei de fonte com COA mostrando 99.2% pureza. Resultado: excelente. A diferença é GRITANTE. Economizar em peptídeo é jogar dinheiro fora.',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `CONTROLE DE QUALIDADE: FDA analysis de peptídeos apreendidos (2018-2023) encontrou: 34% com pureza <80%, 12% com contaminante bacteriano, 8% com peptídeo DIFERENTE do rotulado. Sem COA com HPLC e LAL: risco inaceitável de contaminação e ineficácia.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 33: SEMAGLUTIDA — O PEPTÍDEO MAIS FAMOSO
    // ============================================================
    {
      content: 'Ozempic/Wegovy (Semaglutida) — o peptídeo que virou mainstream. Pode comparar com FRAG?',
      userId: userIds['user_pep_ana'],
      isAIResponse: false
    },
    {
      content: `Ana, comparação interessante:

**SEMAGLUTIDA (Ozempic/Wegovy):**
- Análogo de GLP-1 (glucagon-like peptide-1)
- APROVADO FDA/ANVISA para diabetes tipo 2 e obesidade
- Meia-vida: 7 dias (1 injeção/semana)
- Perda de peso: 15-20% do peso corporal em 68 semanas (STEP trials)
- Mecanismo: reduz apetite central, retarda esvaziamento gástrico

**FRAG 176-191:**
- Fragmento do GH
- NÃO aprovado
- Meia-vida: 30 min (2+ injeções/dia)
- Perda de gordura: 3-5kg em 12 semanas
- Mecanismo: lipólise direta, sem efeito em apetite

**COMPARAÇÃO:**

| | Semaglutida | FRAG 176-191 |
|---|---|---|
| Perda peso | 15-20% | 3-5% |
| Aprovação | FDA/ANVISA | Nenhuma |
| Conveniência | 1x/semana | 2x/dia |
| Preserva músculo | NÃO (perde massa magra) | SIM |
| Afeta apetite | SIM (reduz muito) | NÃO |
| Colaterais GI | Náusea severa (30-50%) | Nenhum |
| Custo | R$800-1500/mês | R$200-400/mês |

**VEREDITO:**
Semaglutida é MUITO mais potente para perda de peso total. FRAG é inferior em magnitude MAS preserva massa magra e tem zero colaterais GI. Para quem precisa perder muito peso: semaglutida. Para quem quer recomposição corporal (pouca gordura, manter músculo): FRAG.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'O problema do Ozempic é que quando para, o peso volta. E perde músculo junto. Vi amiga perder 20kg com Ozempic — 6kg era massa magra. Ficou "skinny fat".',
      userId: userIds['user_pep_renata'],
      isAIResponse: false
    },
    {
      content: `ENDOCRINOLOGIA: Ensaio STEP-1 Extension demonstrou recuperação de 2/3 do peso perdido após descontinuação de semaglutida. Perda de massa magra representa 25-40% do peso total perdido. Treinamento de resistência durante uso é recomendado para mitigar catabolismo.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 34: BPC-157 + NANDROLONA — ARTICULAÇÕES
    // ============================================================
    {
      content: 'BPC-157 combinado com Nandrolona (Deca) para articulações — sinergia real?',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: `Diego, combinação popular:

**NANDROLONA (Deca-Durabolin):**
- AAS com forte efeito articular positivo
- Aumenta líquido sinovial
- Estimula síntese de colágeno
- Efeito anti-inflamatório articular
- Dose para articulações: 100-200mg/semana (baixa)

**BPC-157:**
- Reparo tendíneo e ligamentar
- Angiogênese local
- Anti-inflamatório local

**SINERGIA:**
- Nandrolona: efeito ARTICULAR (cartilagem, líquido sinovial)
- BPC-157: efeito TENDÍNEO/LIGAMENTAR
- Mecanismos diferentes, alvos complementares
- Combinação cobre articulação + tendão + ligamento

**PROTOCOLO:**
- Nandrolona: 100mg/semana IM (dose terapêutica baixa)
- BPC-157: 250mcg subcutâneo local 2x/dia
- Duração: 8-12 semanas

**RESSALVAS:**
- Nandrolona SUPRIME eixo HPG (precisa de TRT base)
- Nandrolona altera perfil lipídico
- Combinação não é "natural" — envolve anabolizante
- BPC-157 sozinho pode ser suficiente para lesões leves

Para quem JÁ está em TRT: adicionar Nandrolona dose baixa + BPC-157 é protocolo articular robusto. Para quem é natural: BPC-157 + TB-500 sem anabolizante.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Já estou em TRT. Adicionei Deca 100mg/sem + BPC-157 no ombro. Articulação do ombro passou de "crunch a cada rep" pra silencioso em 6 semanas. Combinação funciona.',
      userId: userIds['user_pep_diego'],
      isAIResponse: false
    },
    {
      content: `ORTOPEDIA: Nandrolona (19-nortestosterona) demonstra aumento de síntese de colágeno tipo I e III e retenção de líquido sinovial em estudos clínicos. Combinação com BPC-157 (angiogênese + migração fibroblástica) tem racional farmacológico complementar.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 35: THYMOSIN ALPHA-1 — IMUNIDADE
    // ============================================================
    {
      content: 'Thymosin Alpha-1 — peptídeo para imunidade. Funciona para imunodeficiência ou prevenção?',
      userId: userIds['user_pep_laura'],
      isAIResponse: false
    },
    {
      content: `Laura, Thymosin Alpha-1 é DOS POUCOS peptídeos com aprovação regulatória internacional:

**O QUE É:**
- Peptídeo de 28 aminoácidos
- Produzido naturalmente pelo timo
- Aprovado em >35 países (Zadaxin®) para hepatite B e C
- NÃO aprovado nos EUA/Europa (ironicamente)

**MECANISMO:**
- Maturação de linfócitos T
- Aumenta atividade de células NK (Natural Killer)
- Modula produção de citocinas (Th1/Th2 balance)
- Aumenta resposta a vacinas

**INDICAÇÕES APROVADAS (outros países):**
- Hepatite B crônica
- Hepatite C (adjuvante)
- Imunodeficiência em quimioterapia
- Sepse (adjuvante)

**USO OFF-LABEL:**
- COVID-19 (estudos chineses mostraram benefício em pacientes graves)
- Prevenção de infecções em idosos
- "Immune boosting" em biohackers

**DOSE:**
- Terapêutica: 1.6mg subcutâneo 2x/semana
- Manutenção: 1.6mg 1x/semana
- Ciclo: 6-12 meses

**PERFIL DE SEGURANÇA:**
Excelente. Décadas de uso clínico em >35 países. Efeitos colaterais raros e leves.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Interessante que é aprovado em 35 países mas não nos EUA. Mais um caso de custo de aprovação vs patente?',
      userId: userIds['user_pep_laura'],
      isAIResponse: false
    },
    {
      content: `IMUNOLOGIA: Thymosin Alpha-1 (Zadaxin®) é aprovado em China, Índia, Argentina, Filipinas, entre outros. Ensaios clínicos em >3000 pacientes demonstram segurança e eficácia para hepatite viral. FDA não aprovou por discordância sobre design de ensaios clínicos, não por segurança.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 36: FRAG — MITOS E VERDADES FINAIS
    // ============================================================
    {
      content: 'FRAG 176-191: vamos listar os mitos de uma vez por todas.',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: `MITOS sobre FRAG 176-191:

**MITO 1: "FRAG queima gordura sem dieta"**
FALSO. FRAG LIBERA gordura das células. Sem déficit calórico + exercício, os ácidos graxos são re-armazenados.

**MITO 2: "FRAG funciona igual ao GH pra tudo"**
FALSO. FRAG tem APENAS efeito lipolítico. Não melhora sono, não aumenta IGF-1, não repara tecidos como GH.

**MITO 3: "Pode comer normalmente durante FRAG"**
FALSO. Insulina BLOQUEIA FRAG. Precisa de janela de jejum antes e depois.

**MITO 4: "FRAG substitui exercício"**
FALSO. Sem β-oxidação (exercício aeróbico), FFAs liberados voltam pro adipócito.

**MITO 5: "Qualquer FRAG funciona"**
FALSO. Pureza <90% é praticamente inerte. COA com HPLC >97% é mínimo.

**MITO 6: "FRAG causa efeitos hormonais"**
FALSO. FRAG não afeta IGF-1, insulina, testosterona, estrogênio, tireóide.

**VERDADES:**
✓ FRAG é o fragmento lipolítico mais potente do GH (12.5x mais seletivo)
✓ Funciona em homens e mulheres igualmente
✓ Sem colaterais metabólicos significativos
✓ Efeito real mas modesto (3-5kg em 12 semanas COM dieta)
✓ Precisa de jejum + exercício + boa fonte
✓ AOD-9604 é versão marginalmente melhor`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Resumo perfeito. Se alguém tá pensando em FRAG: leia esse post 3 vezes antes de comprar.',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: `SÍNTESE: FRAG 176-191 é um peptídeo lipolítico seletivo com evidência pré-clínica robusta. Eficácia depende de: pureza do produto (>97%), protocolo correto (jejum + exercício), e expectativas realistas. Não é substituto de dieta e exercício — é potencializador.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 37: FUTURO DOS PEPTÍDEOS
    // ============================================================
    {
      content: 'Qual o futuro dos peptídeos terapêuticos? O que vem aí nos próximos 5-10 anos?',
      userId: userIds['user_pep_bruno'],
      isAIResponse: false
    },
    {
      content: `Bruno, tendências:

**1. PEPTÍDEOS GLP-1 (próxima geração):**
- Tirzepatida (Mounjaro®) já aprovada: dual GLP-1/GIP
- Retatrutida: TRIPLE agonista (GLP-1/GIP/Glucagon) em Phase III
- CagriSema (Novo Nordisk): amylin + semaglutida
- Perda de peso >25% provável com próxima geração

**2. PEPTÍDEOS DE REPARO TECIDUAL:**
- BPC-157 análogos estabilizados (meia-vida maior)
- Peptídeos de colágeno bioativo (targeted delivery)
- Scaffolds peptídicos para regeneração óssea

**3. NEUROPEPTÍDEOS:**
- Oxitocina para autismo (ensaios em andamento)
- Orexina para narcolepsia (peptídeo de vigília)
- BDNF-miméticos para depressão resistente

**4. ANTI-AGING:**
- Senolíticos peptídicos (eliminam células senescentes)
- Epithalon + análogos (telomerase seletiva?)
- GHK-Cu formulações de liberação prolongada

**5. ONCOLOGIA:**
- Peptídeos tumor-homing (entrega seletiva de quimioterapia)
- Vacinas peptídicas personalizadas (neoantígeno)
- Inibidores de checkpoint peptídicos

O futuro é MASSIVO. Peptídeos são a maior classe de fármacos em desenvolvimento.`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'A revolução do Ozempic mostrou que peptídeos podem ser blockbusters farmacêuticos. Semaglutida vendeu $18B em 2023. Isso vai incentivar investimento em TODOS os outros peptídeos.',
      userId: userIds['user_pep_marina'],
      isAIResponse: false
    },
    {
      content: `MERCADO: Mercado global de peptídeos terapêuticos: $45B (2023), projeção $93B (2030). CAGR 10.8%. Classe com maior crescimento em pharma. 170+ peptídeos em ensaios clínicos ativos. Revolução GLP-1 catalisou investimento massivo em P&D de peptídeos.`,
      userId: aiUser.id,
      isAIResponse: true
    },

    // ============================================================
    // THREAD 38: ENCERRAMENTO — GUIA RÁPIDO
    // ============================================================
    {
      content: 'Alguém pode fazer um resumo final? Guia rápido pra quem tá chegando agora na arena?',
      userId: userIds['user_pep_felipe'],
      isAIResponse: false
    },
    {
      content: `GUIA RÁPIDO — Peptídeos Research:

**PARA QUEIMA DE GORDURA:**
→ FRAG 176-191 ou AOD-9604 (lipólise seletiva, sem colaterais metabólicos)

**PARA RECUPERAÇÃO DE LESÃO:**
→ BPC-157 (tendão, ligamento, gut) + TB-500 (sistêmico, muscular)

**PARA AUMENTO DE GH:**
→ CJC-1295 + Ipamorelin (stack mais limpo e fisiológico)

**PARA ANTI-AGING:**
→ Sermorelin + GHK-Cu (tópico) + Epithalon (cautela)

**PARA COGNIÇÃO:**
→ Semax + Selank (nootropicos com histórico clínico russo)

**PARA PELE/CABELO:**
→ GHK-Cu (tópico, melhor evidência) + Colágeno hidrolisado

**PARA SONO:**
→ Melatonina micro-dose + Magnésio + Ipamorelin (noite)

**REGRAS UNIVERSAIS:**
1. SEMPRE exija COA com HPLC >97%
2. Conserve corretamente (geladeira após reconstituir)
3. Use seringa de insulina (31G, subcutâneo)
4. Monitore com exames periódicos
5. Não espere milagres — peptídeos potencializam, não substituem
6. Comece com UM peptídeo, avalie, depois adicione`,
      userId: userIds['user_pep_drcarlos'],
      isAIResponse: false
    },
    {
      content: 'Salvei esse post. Melhor resumo de peptídeos que já vi em qualquer plataforma.',
      userId: userIds['user_pep_thiago'],
      isAIResponse: false
    },
    {
      content: 'Concordo. Dr. Carlos e a comunidade aqui construíram algo especial. Informação baseada em evidência, sem hype, sem vendas. Isso é raro.',
      userId: userIds['user_pep_ana'],
      isAIResponse: false
    },
    {
      content: `ENCERRAMENTO: 38 threads cobrindo os principais peptídeos de pesquisa — FRAG 176-191, BPC-157, TB-500, CJC-1295, Ipamorelin, Sermorelin, GHK-Cu, MK-677, Melanotan II, PT-141, Epithalon, IGF-1 LR3, Selank, Semax, DSIP, Kisspeptin, Thymosin Alpha-1, AOD-9604. Base de conhecimento construída com foco em evidência científica e redução de danos.`,
      userId: aiUser.id,
      isAIResponse: true
    },
  ];

  console.log(`\n📝 Criando ${posts.length} posts...`);
  let count = 0;
  const BATCH_SIZE = 20;

  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE).map(post => ({
      id: uuid(),
      arenaId: ARENA_ID,
      userId: post.userId,
      content: post.content,
      isPublished: true,
      isApproved: true,
      isAIResponse: post.isAIResponse,
      viewCount: Math.floor(Math.random() * 200) + 30,
      likeCount: Math.floor(Math.random() * 80) + 5,
      createdAt: nextTime().toISOString()
    }));

    const { error } = await sb.from('Post').insert(batch);
    if (error) {
      console.error(`❌ Erro no batch ${i}-${i + batch.length}:`, error.message);
      throw error;
    }
    count += batch.length;
    console.log(`  → ${count}/${posts.length} posts criados...`);
  }

  const { count: totalPosts } = await sb.from('Post').select('id', { count: 'exact', head: true }).eq('arenaId', ARENA_ID);
  const { data: uniqueUsersData } = await sb.from('Post').select('userId').eq('arenaId', ARENA_ID).eq('isAIResponse', false);
  const uniqueUserCount = new Set(uniqueUsersData?.map(u => u.userId)).size;

  await sb.from('Arena').update({
    totalPosts: totalPosts ?? posts.length,
    dailyActiveUsers: uniqueUserCount,
    status: 'HOT'
  }).eq('id', ARENA_ID);

  console.log('\n' + '═'.repeat(60));
  console.log('✅ SEED COMPLETO — Peptídeos Research (v2)');
  console.log('═'.repeat(60));
  console.log(`📊 Posts: ${totalPosts ?? posts.length} | Usuários: ${uniqueUserCount + 1} (+ IA)`);
  console.log(`📖 Threads: 38 (FRAG/BPC heavy + farmacologia geral)`);
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ ERRO:', e);
    process.exit(1);
  });
