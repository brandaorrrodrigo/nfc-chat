/**
 * RAG (Retrieval-Augmented Generation) para contexto biomecânico
 * Fornece conhecimento especializado sobre tópicos de movimento
 */

import type { RAGContext } from './prompt-builder';

/**
 * Base de conhecimento biomecânico estruturada
 */
const BIOMECHANICAL_KNOWLEDGE: Record<string, Record<string, string>> = {
  // ===== SQUAT =====
  'profundidade agachamento': {
    content: `
**Profundidade do Agachamento**

A profundidade do agachamento é determinada pelo ângulo do quadril na posição mais baixa:
- **Abaixo da paralela**: Quadril abaixo da linha dos joelhos (ângulo < 80°)
  - Máxima ativação muscular, maior demanda de mobilidade
  - Recomendado para: powerlifting, hipertrofia

- **Paralela**: Quadril alinhado com joelho (ângulo ~90°)
  - Ponto de referência comum em competições
  - Bom comprometimento entre amplitude e segurança

- **Acima da paralela**: Quadril acima da linha dos joelhos (ângulo > 90°)
  - Menor demanda de mobilidade de tornozelo
  - Menos ativação de glúteo máximo
  - Comum em iniciantes com limitações de mobilidade
`,
    source: 'Biomecânica do Movimento Humano',
  },

  'valgo dinâmico': {
    content: `
**Valgo Dinâmico do Joelho**

Valgo é o colapso medial do joelho durante o movimento, frequentemente chamado de "knee cave" ou "joelhos para dentro".

**Causas Biomecânicas:**
1. Insuficiência do glúteo médio - principal causa
   - Abdutor fraco não consegue estabilizar pelve
   - Resulta em queda pélvica contralateral

2. Fraqueza de rotadores externos do quadril
   - Quadríceps vasto medial obíquo (VMO) fraco
   - Desequilíbrio vastus lateralis vs VMO

3. Limitação de dorsiflexão do tornozelo
   - Compensa com rotação interna de tíbia
   - Aumenta desvio medial de joelho

**Risco de Lesão:**
- Aumento de força de cisalhamento no ligamento cruzado anterior (LCA)
- Sobrecarga de estruturas mediais (menisco medial, ligamento colateral)
- Dor patelofemoral (síndrome da dor anterior do joelho)

**Correção Prioritária:**
1. Fortalecer glúteo médio (clams, abduções lateral em pé, step-ups)
2. Mobilizar tornozelo (flexão dorsal)
3. Melhorar propriocepção (single leg stance, mini band walks)
4. Regressões de movimento (goblet squat com foco em rastreamento de joelho)
`,
    source: 'Análise de Movimento - Vulnerabilidades do Joelho',
  },

  'insuficiência glúteo médio': {
    content: `
**Insuficiência do Glúteo Médio**

O glúteo médio é o abdutor primário do quadril e estabilizador fundamental da pelve.

**Função Biomecânica:**
- Abdução e rotação externa do quadril
- Estabilização pélvica durante movimento unilateral
- Prevenção de queda pélvica contralateral (Trendelenburg negativo)

**Sinais de Fraqueza:**
- Queda pélvica no lado contralateral durante agachamento unilateral
- Valgo de joelho (colapso medial)
- Tendência a inclinar tronco lateralmente
- Dor lateral de quadril/glúteo

**Testes Diagnósticos:**
- Teste de Trendelenburg: ao ficar em pé em uma perna, pelve desce
- Teste de força: abdução contra resistência
- Padrão de movimento: queda pélvica > 5° em exercícios unilaterais

**Exercícios Corretivos:**
- Clams e clams com faixa elástica (mini band)
- Abduções lateral em pé com controle
- Step-ups (sobre caixa ou degrau)
- Monster walks com mini band
- Lateral band walks
- Single leg glute bridges
- Sumo squats com foco em abdução
`,
    source: 'Estabilidade Pélvica e Controle de Movimento',
  },

  'ativação VMO': {
    content: `
**Vasto Medial Obíquo (VMO) - Ativação e Função**

O VMO é a porção medial do quadríceps, crítica para estabilização patelofemoral.

**Função Específica:**
- Rastreamento medial da patela
- Contração terminal de extensão (últimos 30° de extensão)
- Prevenção de subluxação patelar lateral

**Ativação Efetiva:**
- Agachamento com pés em rotação externa (pigeon toe stance)
- Movimento em cadeia fechada (squat) > cadeia aberta (leg extension)
- Foco em range terminal de extensão
- Adução com resistência

**Desequilíbrio VMO vs Vastus Lateralis:**
- VL dominante = puxada lateral de patela
- Dor patelofemoral anterior (PFPS)
- Valgo dinâmico do joelho

**Exercícios de Preferência para VMO:**
- Sissy squats (extremo VL)
- Step-ups (bom VMO)
- Agachamentos com pés girados para fora (bom VMO)
- Terminal knee extensions com banda
- Copenhagen adduções isométricas
`,
    source: 'Análise Muscular - Quadríceps',
  },

  'butt wink': {
    content: `
**Butt Wink - Retroversão Pélvica no Agachamento**

"Butt wink" é a inclinação pélvica posterior (retroversão) que ocorre no fundo do agachamento.

**Biomecânica:**
- Mudança de inclinação pélvica anterior → posterior
- Flexão adicional de coluna lombar
- Perda de lordose lombar fisiológica

**Causas:**
1. **Limitação de mobilidade** (mais comum)
   - Isquiotibiais tensos
   - Glúteos tensos
   - Limitação de dorsiflexão de tornozelo (compensação)

2. **Fraqueza de controle de core**
   - Incapacidade de manter lordose sob carga
   - Fadiga de estabilizadores lombares

3. **Proporções antropométricas**
   - Fêmur longo em relação à tíbia
   - Tronco longo
   - Pode ser parcialmente natural

**Risco de Lesão:**
- Aumento de pressão intradiscal L4-L5 (disco mais vulnerável)
- Flexão repetida = degeneração discal acelerada
- Potencial para hérnia de disco

**Progressão de Melhoria:**
1. Priorizar mobilidade de tornozelo e isquiotibiais
2. Reduzir profundidade até encontrar limite antes de butt wink
3. Melhorar flexibilidade de hip flexores
4. Fortalecer core em isometria (planks)
5. Elevar salto (1-2cm) temporariamente para permitir maior profundidade com neutro
6. Progressão gradual de profundidade conforme mobilidade melhora
`,
    source: 'Lisca Lombar e Integridade Discal',
  },

  'inclinação anterior tronco agachamento': {
    content: `
**Inclinação Anterior do Tronco no Agachamento**

O ângulo do tronco em relação à vertical varia por tipo de agachamento.

**Referências Esperadas:**
- **Back Squat**: 45° ± 10° (inclinação aceitável)
- **Front Squat**: < 30° (tronco mais vertical)
- **Goblet Squat**: < 35° (tronco vertical para facilitar controle)

**Biomecânica da Inclinação:**
- Maior inclinação = maior momento de força no quadril = maior demanda glúteo
- Menor inclinação = maior demanda em quadríceps e dorsi

**Problemas com Excesso:**
- Transferência de carga para coluna lombar
- Possível ligação com butt wink
- Redução de ativação de quadríceps

**Otimização por Tipo de Agachamento:**
- **Back Squat moderado (45°)**: Forma clássica de powerlifting
- **Front Squat vertical**: Apropriado para treino funcional e mobilidade
- **Goblet Squat**: Ótimo para iniciantes e mobilidade

**Tópicos Relacionados:**
- Mobilidade de tornozelo
- Força de core
- Proporções antropométricas
`,
    source: 'Análise de Padrão de Movimento - Agachamento',
  },

  'controle core': {
    content: `
**Controle de Core - Fundamentos para Estabilidade**

O core é muito mais que abdominal - é um sistema integrado de estabilização.

**Componentes do Core:**
1. **Anterior**: Reto abdominal, oblíquos externos/internos
2. **Posterior**: Eretores espinhais, multífidos
3. **Lateral**: Quadrado lombar, transverso abdominal
4. **Inferior**: Assoalho pélvico
5. **Superior**: Diafragma

**Função Integrada:**
- Cria pressão intra-abdominal (aumento de rigidez espinhal)
- Estabiliza coluna durante movimento
- Transferência de força entre segmentos (cintura escapular ↔ membros inferiores)

**Déficit de Controle - Sinais:**
- Excessiva extensão/flexão de coluna durante exercício
- Incapacidade de manter alinhamento neutro
- Colapso postural sob fadiga
- Dor lombar crônica

**Exercícios de Progressão:**
1. **Nível 1 - Isométricos básicos**
   - Plank frontal (prono)
   - Plank lateral
   - Dead bug
   - Quadruped

2. **Nível 2 - Dinâmica com restrição**
   - Pallof press (anti-rotação)
   - Suitcase carry (anti-lateral flexão)
   - Bird dog
   - Marching em plank

3. **Nível 3 - Movimento livre**
   - Ab wheel rollout
   - Hanging leg raise
   - Turkish getup
   - Movimento composto (squat com foco em core)
`,
    source: 'Estabilidade Espinhal e Core Training',
  },

  'retroversão pélvica agachamento': {
    content: `
**Retroversão Pélvica no Agachamento (Butt Wink)**

Veja tópico: 'butt wink'
`,
    source: 'Cruzamento - Veja butt wink',
  },

  'flexão lombar': {
    content: `
**Flexão Lombar - Biomecânica e Risco**

A flexão de coluna lombar é o movimento de inclinação anterior da coluna.

**Características Biomecânicas:**
- Aumento do ângulo de lordose lombar (mais negativo)
- Deslocamento anterior de núcleo pulposo discal
- Redução de pressão intradiscal em alguns segmentos, aumento em outros (principalmente L4-L5)

**Risco Ocupacional vs Exercício:**
- Flexão repetida + carga externa = alto risco (ex: levantamento de peso mal executado)
- Flexão sob controle em range seguro = aceitável

**Em Contexto de Agachamento:**
- Pequeno aumento esperado no fundo (até 10°)
- > 20° indica potencial problema (butt wink excessivo)
- Deve retornar a neutro na ascensão

**Estratégias de Proteção:**
- Manter lordose fisiológica
- Trabalhar mobilidade anterior de quadril
- Fortalecer extensores lombares
- Não forçar profundidade além da capacidade de manter neutro
`,
    source: 'Integridade Discal e Movimento Seguro',
  },

  // ===== HINGE =====
  'flexão lombar levantamento terra': {
    content: `
**Flexão Lombar no Levantamento Terra**

No deadlift, a flexão lombar é crítica para segurança.

**Posição Inicial (Setup):**
- Coluna em neutro com lordose fisiológica mantida (10-30° flexão é normal)
- Ombros sobre a barra
- Escápulas retradas ligeiramente

**Ao Puxar (Primeira Tração):**
- Manter neutro absoluto (0-10° flexão máximo)
- Qualquer arredondamento adicional = risco de lesão discal
- Pressão intradiscal máxima em L5-S1 e L4-L5

**Causas de Arredondamento (> 40°):**
1. Pernas muito curtas em relação ao tronco
2. Fraqueza de extensores lombares
3. Limitação de mobilidade de quadril
4. Técnica inadequada (puxar com costas antes de com pernas)
5. Carga muito pesada para força atual

**Progressão Segura:**
1. Dominar movimento com carga leve (só barra 20kg)
2. Vídeo análise para feedback
3. Mobilidade: hip hinges, Good Mornings
4. Força: Good Mornings, Back Extensions, Deadlifts romênios
5. Elevação da barra (deficit reduzido) para facilitar técnica
`,
    source: 'Técnica Segura em Levantamentos Pesados',
  },

  'neutro coluna deadlift': {
    content: `
**Manutenção de Coluna Neutra no Deadlift**

Coluna neutra = alinhamento seguro que protege discos intervertebrais.

**Posição Neutra:**
- Mantém curvas naturais da coluna
- Distribui carga uniformemente
- Protege estruturas neurais

**Aplicação Prática:**
1. Cervical: Pescoço em linha com tronco (não olhe para cima)
2. Torácica: Ligeira cifose natural (não deixe desabar)
3. Lombar: Lordose natural mantida (não hiperextenda nem deixe arredondar)
4. Sacral: Alinhada com lombar

**Testes de Feedback:**
- Aperte seu core como se preparasse para um soco
- Dê um leve "puxão" nos lats (tireóide)
- Sinta contração nos estabilizadores

**Checklist de Execução:**
- ✓ Escápulas posicionadas (não levantadas)
- ✓ Peito aberto (ligeira retração escapular)
- ✓ Core engajado
- ✓ Coluna sente-se "empilhada" e segura
`,
    source: 'Biomecânica de Levantamento Terra',
  },

  // ===== PRESS =====
  'impingement subacromial': {
    content: `
**Síndrome de Impingement Subacromial**

Compressão de estruturas (tendão, bolsa) no espaço subacromial do ombro.

**Anatomia Relevante:**
- Espaço subacromial = entre acrômio (acima) e cabeça do úmero (abaixo)
- Estruturas: tendões do manguito rotador (principalmente supraespinal), bolsa subacromial

**Mecanismo de Impingement:**
1. Espaço reduzido por:
   - Cifose excessiva
   - Rotação interna excessiva de ombro
   - Abdução excessiva (elbowflare)

2. Provocadores de dor:
   - Movimento de elevação do braço em rotação interna
   - Press com cotovelo muito abducido
   - Falta de estabilização escapular

**Apresentação em Supino:**
- Impingement durante descida (especialmente com cotovelo abducido)
- Dor aguda anterior de ombro
- Piora com aumento de volume/frequência

**Prevenção e Tratamento:**
1. **Técnica:** Cotovelo em ~60-75° (não > 85°)
2. **Mobilidade:** Rotação externa, cifose torácica
3. **Força:** Cuff rotador, estabilizadores escapulares
4. **Progressão:** Regressão temporária se dor presente
`,
    source: 'Patologia de Ombro e Prevenção',
  },

  'retração escapular': {
    content: `
**Retração Escapular - Posicionamento e Função**

Retração = movimento posterior das escápulas (fechamento medial das omoplatas).

**Função no Treino:**
- Cria base estável para movimento de braço
- Ativa romboides e trapézio
- Reduz impingement subacromial

**Posicionamento Correto:**
- Imagine puxar omoplatas para baixo e para trás
- Contração de músculos entre escápulas
- Peito levemente elevado

**No Supino:**
- Retração ao deitar-se no banco
- Manter durante todo movimento
- Voltar a retrair ao final da repetição

**No Agachamento (Back Squat):**
- Retração leve ajuda estabilizar coluna
- Não forçar excessivamente (pode causar cifose)

**No Deadlift:**
- "Puxar lats para baixo" = semelhante à retração
- Prepara para tração

**Exercícios de Ativação:**
- Face pulls
- Band pull-aparts
- Scapular push-ups
- Prone Y-raises
`,
    source: 'Estabilidade e Posicionamento de Ombro',
  },

  // ===== GERAL =====
  'sinal Trendelenburg': {
    content: `
**Sinal de Trendelenburg - Indicador de Fraqueza**

Teste clássico para função do glúteo médio.

**Teste Positivo:**
- Ao ficar em pé em uma perna, a pelve desce do lado oposto
- Indica fraqueza de abdutor no lado de apoio
- "Queda pélvica contralateral"

**Interpretação:**
- Trendelenburg positivo (>5° queda) = glúteo médio insuficiente
- Incapacidade de manter pelve nível
- Risco aumentado de valgo e compensações

**Manifestação em Movimento:**
- Agachamento unilateral: pelve inclina-se para o lado da perna que se levanta
- Caminhada: movimento "de pato" (pigeon-toed gait)
- Agachamento bilateral: valgo de joelho

**Correção:**
1. Testes de força muscular específicos
2. Exercícios de isolamento: clams, abduções
3. Exercícios funcionais: lunges, step-ups, agachamento unilateral
4. Progressão gradual
5. Reavaliação após 2-3 semanas
`,
    source: 'Diagnóstico e Correção de Assimetrias',
  },

  'queda pélvica': {
    content: `
**Queda Pélvica - Assimetria de Estabilidade**

Desigualdade de altura pélvica durante movimento unilateral.

**Normal vs Patológico:**
- < 5°: Normal
- 5-10°: Leve Trendelenburg
- > 10°: Trendelenburg positivo clinicamente significante

**Causas:**
1. Glúteo médio fraco ipsilateral
2. Dor de quadril contralateral
3. Assimetria de comprimento de perna
4. Desequilíbrio de força bilateral

**Apresentação Clínica:**
- Agachamento unilateral: pelve desnivelada
- Caminhada: balanço excessivo
- Corrida: queda pélvica exagerada

**Programação de Correção:**
- Isolamento do fraco (high volume, low intensity)
- Movimento funcional progressivo
- Balanceamento bilateral
`,
    source: 'Simetria e Equilíbrio no Movimento',
  },

  'assimetria bilateral': {
    content: `
**Assimetria Bilateral - Identificação e Correção**

Diferenças lado esquerdo vs direito em amplitude, força ou padrão de movimento.

**Tipos Comuns:**
1. **ROM (Amplitude)**: Um lado mais restrito
2. **Força**: Um lado mais fraco
3. **Padrão**: Um lado compensa diferentemente
4. **Ativação Muscular**: Desequilíbrio de recrutamento

**Impactos:**
- Maior risco de lesão no lado fraco
- Compensação postural crônica
- Movimento ineficiente
- Potencial para patologia

**Detecção:**
- Vídeo análise lado a lado
- Testes de força (dinamômetro, 1RM teste)
- ROM measurement
- Observação qualitativa de padrão

**Progressão de Correção:**
1. **Conscientização**: Video feedback
2. **Isolamento**: Trabalho unilateral no fraco
3. **Balance**: Equalização de volume/intensidade
4. **Reintegração**: Movimento bilateral com foco no fraco
5. **Monitoramento**: Reavaliação regular
`,
    source: 'Equilibração de Força e Padrão',
  },

  'compensação asimétrica': {
    content: `
**Compensação Assimétrica - Padrão de Substituição**

Quando um lado fraco, o corpo compensa com padrões anormais.

**Exemplos em Agachamento:**
- Um lado fraco → inclinação pélvica lateral
- Glúteo fraco → valgo do joelho contralateral
- Limitação de tornozelo → rotação excessiva

**Efeito Cascata:**
- Fraqueza local → compensação regional
- Compensação mantém → padrão se fixa
- Padrão crônico → risco estrutural (lesão)

**Intervalo Crítico:**
- Primeiros 4-6 semanas: padrão ainda mutável
- Após 8+ semanas: compensação mecanicamente "aprendida"
- Reabilitação tardía = tempo prolongado (semanas/meses)

**Estratégia de Correção:**
1. Intervir cedo (primeiras semanas)
2. Conscientização proprioceptiva
3. Regressão de movimento se necessário
4. Foco em padrão correto > força/volume
5. Progressão gradual
`,
    source: 'Padrão de Movimento e Aprendizagem Motora',
  },
};

/**
 * Busca tópicos na base de conhecimento
 */
export function queryRAG(topics: string[]): RAGContext[] {
  const results: RAGContext[] = [];
  const seenTopics = new Set<string>();

  for (const topic of topics) {
    // Normalizar busca
    const normalized = topic.toLowerCase().trim();

    // Buscar correspondência exata primeiro
    if (BIOMECHANICAL_KNOWLEDGE[normalized] && !seenTopics.has(normalized)) {
      const info = BIOMECHANICAL_KNOWLEDGE[normalized];
      results.push({
        topic,
        content: info.content.trim(),
        source: info.source,
      });
      seenTopics.add(normalized);
    } else {
      // Buscar correspondência parcial
      for (const [key, value] of Object.entries(BIOMECHANICAL_KNOWLEDGE)) {
        if (
          (key.includes(normalized) || normalized.includes(key)) &&
          !seenTopics.has(key)
        ) {
          results.push({
            topic: key,
            content: value.content.trim(),
            source: value.source,
          });
          seenTopics.add(key);
          break;
        }
      }
    }
  }

  return results;
}

/**
 * Lista todos os tópicos disponíveis
 */
export function listAvailableTopics(): string[] {
  return Object.keys(BIOMECHANICAL_KNOWLEDGE);
}

/**
 * Obtém tópicos por categoria
 */
export function getTopicsByCategory(category: string): string[] {
  const categoryTopics: Record<string, string[]> = {
    squat: [
      'profundidade agachamento',
      'valgo dinâmico',
      'insuficiência glúteo médio',
      'ativação VMO',
      'butt wink',
      'inclinação anterior tronco agachamento',
      'controle core',
      'retroversão pélvica agachamento',
      'flexão lombar',
    ],
    hinge: [
      'flexão lombar levantamento terra',
      'neutro coluna deadlift',
      'padrão hip hinge',
      'dominância quadril',
      'posterior chain',
      'glute involvement',
    ],
    horizontal_press: [
      'impingement subacromial',
      'retração escapular',
      'estabilidade escapular supino',
      'assimetria bilateral',
    ],
    vertical_press: [
      'mobilidade overhead',
      'compensação lombar overhead',
      'core stability overhead',
    ],
    pull: [
      'retração escapular',
      'estabilidade escapular',
      'momentum cheating row',
    ],
    unilateral: [
      'sinal Trendelenburg',
      'queda pélvica',
      'assimetria bilateral',
      'compensação asimétrica',
      'valgo unilateral',
    ],
    core: [
      'controle core',
      'estabilidade pélvica',
      'alinhamento neutro prancha',
    ],
  };

  return categoryTopics[category.toLowerCase()] || [];
}

/**
 * Adiciona tópico customizado à base (para dados específicos da aplicação)
 */
export function addCustomTopic(
  topic: string,
  content: string,
  source?: string
): void {
  BIOMECHANICAL_KNOWLEDGE[topic.toLowerCase()] = {
    content,
    source: source || 'Conhecimento Customizado',
  };
}
