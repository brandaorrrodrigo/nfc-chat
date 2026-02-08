/**
 * Gera SQL a partir dos dados de seed-conversations.ts
 * Uso: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/generate-seed-sql.ts
 * Saída: scripts/seed-conversations.sql
 */

import * as fs from 'fs';
import * as path from 'path';

// ═══════════════════════════════════════════════════════════════
// DADOS (copiados de seed-conversations.ts)
// ═══════════════════════════════════════════════════════════════

interface ConvPost {
  user?: string;
  ia?: boolean;
  content: string;
}

interface ConvThread {
  title: string;
  posts: ConvPost[];
}

const EXCLUDED_SLUGS = [
  'postura-estetica',
  'avaliacao-assimetrias',
  'dor-funcao-saude',
  'avaliacao-fisica-foto',
  'hub-avaliacao-fisica',
];

const MOCK_USERS = [
  { name: 'Ana Silva', email: 'ana.silva@mock.com' },
  { name: 'Carlos Souza', email: 'carlos.souza@mock.com' },
  { name: 'Maria Santos', email: 'maria.santos@mock.com' },
  { name: 'João Lima', email: 'joao.lima@mock.com' },
  { name: 'Paula Mendes', email: 'paula.mendes@mock.com' },
  { name: 'Roberto Costa', email: 'roberto.costa@mock.com' },
  { name: 'Juliana Rocha', email: 'juliana.rocha@mock.com' },
  { name: 'Pedro Alves', email: 'pedro.alves@mock.com' },
  { name: 'Fernanda Dias', email: 'fernanda.dias@mock.com' },
  { name: 'Lucas Martins', email: 'lucas.martins@mock.com' },
  { name: 'Camila Freitas', email: 'camila.freitas@mock.com' },
  { name: 'Ricardo Nunes', email: 'ricardo.nunes@mock.com' },
  { name: 'Tatiana Gomes', email: 'tatiana.gomes@mock.com' },
  { name: 'Bruno Carvalho', email: 'bruno.carvalho@mock.com' },
  { name: 'Amanda Pires', email: 'amanda.pires@mock.com' },
  { name: 'Felipe Ramos', email: 'felipe.ramos@mock.com' },
  { name: 'Renata Moura', email: 'renata.moura@mock.com' },
  { name: 'Thiago Barros', email: 'thiago.barros@mock.com' },
  { name: 'Larissa Campos', email: 'larissa.campos@mock.com' },
  { name: 'Gustavo Pereira', email: 'gustavo.pereira@mock.com' },
  { name: 'Beatriz Gomes', email: 'beatriz.gomes@mock.com' },
  { name: 'Rodrigo Andrade', email: 'rodrigo.andrade@mock.com' },
  { name: 'Daniela Correia', email: 'daniela.correia@mock.com' },
  { name: 'Marcelo Pereira', email: 'marcelo.pereira@mock.com' },
  { name: 'João Carlos', email: 'joao.carlos@mock.com' },
  { name: 'Fernanda Alves', email: 'fernanda.alves@mock.com' },
];

const IA_USER_EMAIL = 'ia-facilitadora@mock.com';

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA',
  '#F1948A', '#85C1E9', '#73C6B6', '#F0B27A', '#D7BDE2',
];

const ARENA_CONVERSATIONS: Record<string, ConvThread[]> = {

  'lipedema': [
    {
      title: 'Protocolo nutricional para lipedema estágio 2',
      posts: [
        { user: 'Paula Mendes', content: 'Oi gente, minha nutricionista passou dieta anti-inflamatória pra ajudar no lipedema. Alguém aqui já testou retirar glúten e laticínios? Tô na 3ª semana e sinto menos inchaço nas pernas.' },
        { ia: true, content: 'A abordagem anti-inflamatória é muito usada no manejo do lipedema. Estudos mostram que reduzir alimentos pró-inflamatórios pode diminuir retenção de líquidos e sensibilidade dolorosa. Você notou melhora na dor ao toque também?' },
        { user: 'Juliana Rocha', content: 'Eu fiz! Tirei glúten, laticínios e açúcar refinado por 3 meses. A diferença foi real - menos peso nas pernas e menos hematomas espontâneos.' },
        { user: 'Ana Silva', content: 'Paula, como nutricionista posso dizer: a resposta varia muito. O mais importante é manter proteína adequada (1.6-2g/kg) pra não perder massa magra.' },
        { user: 'Fernanda Dias', content: 'Complementando a Ana - meditação e yoga ajudaram muito o meu manejo. O estresse piora MUITO o lipedema.' },
      ]
    },
    {
      title: 'Compressão durante exercícios - qual marca funciona?',
      posts: [
        { user: 'Camila Freitas', content: 'Meninas, preciso de indicação de meia de compressão pra usar no treino. As que comprei na farmácia incomodam demais. Alguém tem dica?' },
        { ia: true, content: 'Para exercícios com lipedema, meias de compressão graduada (20-30mmHg) são ideais. Marcas especializadas como Sigvaris, Venosan e Jobst costumam ter linhas esportivas mais confortáveis. O importante é que a compressão seja medida por profissional.' },
        { user: 'Paula Mendes', content: 'Uso Sigvaris Cotton. É mais cara mas não esquenta tanto. Na musculação funciona super bem!' },
        { user: 'Tatiana Gomes', content: 'No pilates uso a Venosan Legline. Dica: mede de manhã, antes do inchaço do dia.' },
        { user: 'Juliana Rocha', content: 'Como fisio, reforço: NUNCA compre sem medição profissional. Compressão errada pode piorar a circulação.' },
      ]
    },
    {
      title: 'Exercício aquático: piscina ou hidro?',
      posts: [
        { user: 'Renata Moura', content: 'Minha médica indicou exercícios na água. Mas não sei se faço natação ou hidroginástica. Qual melhor pro lipedema?' },
        { ia: true, content: 'Ambos são excelentes! A pressão hidrostática da água atua como compressão natural e reduz edema. Natação trabalha mais cardiovascular, hidro tem mais foco em resistência muscular. Depende dos seus objetivos. Você prefere treino mais aeróbico ou de força?' },
        { user: 'Roberto Costa', content: 'Como ortopedista: para lipedema, deep water running é ouro. Combina cardio + resistência + compressão. Pergunte na academia se tem turma.' },
        { user: 'Amanda Pires', content: 'Faço hidro 3x por semana e é a melhor coisa! Depois do treino as pernas ficam leves. Natação eu canso rápido mas hidro consigo fazer 1h tranquilo.' },
      ]
    },
    {
      title: 'Resultados após 6 meses de tratamento',
      posts: [
        { user: 'Tatiana Gomes', content: 'Vim compartilhar minha evolução! 6 meses de: dieta anti-inflamatória + pilates 3x + drenagem 2x + compressão diária. Reduzi 4cm de circunferência em cada coxa e a dor diminuiu 70%.' },
        { ia: true, content: 'Resultados impressionantes, Tatiana! Essa combinação multimodal é exatamente o que a literatura recomenda. A consistência no tratamento faz toda diferença. Você manteve acompanhamento regular com sua equipe médica?' },
        { user: 'Paula Mendes', content: 'Parabéns Tati!! Que inspiração! Estou no mês 2 e já vejo diferença. Seu relato me motiva demais.' },
        { user: 'Fernanda Dias', content: 'Maravilhosa! A constância é tudo mesmo. Quando eu parei a drenagem por 1 mês, voltou o inchaço.' },
        { user: 'Juliana Rocha', content: 'Caso lindo! Como sua fisio, posso confirmar que esses números são reais e mensurados. Consistência é a chave.' },
      ]
    },
    {
      title: 'Lipedema e uso de canetas (Ozempic/Mounjaro)',
      posts: [
        { user: 'Ana Silva', content: 'Minha endo quer me prescrever Mounjaro pro lipedema. Estou com medo dos efeitos colaterais. Alguém aqui usa pra lipedema especificamente?' },
        { ia: true, content: 'As canetas de GLP-1 estão sendo estudadas como adjuvantes no tratamento do lipedema. A perda de peso pode reduzir a carga sobre o tecido afetado, mas o tecido lipedêmico em si responde diferente da gordura normal. É importante ter expectativas realistas. Sua endocrinologista explicou os prós e contras específicos pro seu caso?' },
        { user: 'Roberto Costa', content: 'Ana, como médico: canetas ajudam na gordura normal que acompanha o lipedema, mas o tecido lipedêmico responde pouco. O benefício é real mas limitado. Converse sobre a dose ideal pro seu peso.' },
        { user: 'Camila Freitas', content: 'Uso Ozempic há 4 meses. Perdi 8kg de gordura "normal" e o lipedema ficou mais evidente justamente por isso. Mas melhorou a mobilidade geral.' },
      ]
    },
    {
      title: 'Drenagem linfática: manual ou mecânica?',
      posts: [
        { user: 'Larissa Campos', content: 'Minha fisio faz drenagem manual, mas vi umas botas pressurizadas (pressoterapia) que parecem boas. Alguém usa? É tão bom quanto a manual?' },
        { ia: true, content: 'São complementares! A drenagem linfática manual (DLM) é mais precisa e pode adaptar a pressão por região. A pressoterapia mecânica é boa para manutenção entre sessões. Idealmente: DLM 2x/semana + pressoterapia nos outros dias.' },
        { user: 'Juliana Rocha', content: 'Como fisio: DLM é insubstituível no lipedema. As botas são bom complemento mas NÃO substituem. A mão do profissional sente o tecido e adapta em tempo real.' },
        { user: 'Paula Mendes', content: 'Tenho bota em casa e uso todo dia. Mas a sessão com a Juliana é outro nível. A bota ajuda a manter o resultado da DLM.' },
        { user: 'Fernanda Dias', content: 'Comprei uma e uso assistindo TV. 20 minutos por dia faz diferença sim! Mas concordo que não substitui a profissional.' },
      ]
    },
  ],

  'lipedema-paradoxo': [
    {
      title: 'Cardio convencional piorou meu lipedema',
      posts: [
        { user: 'Paula Mendes', content: 'Fiz 3 meses de HIIT achando que ia melhorar. PIOROU. Mais dor, mais inchaço, mais hematomas. Minha fisio falou que era previsível. Por quê ninguém avisa?' },
        { ia: true, content: 'Infelizmente essa é uma das grandes armadilhas no lipedema. O HIIT e exercícios de alto impacto geram microtraumas vasculares que, no tecido lipedêmico (já com capilares frágeis), aumentam edema e inflamação. O paradoxo é que cardio "normal" pode ser anti-terapêutico. O protocolo ideal é: AEJ (aeróbico em jejum) de baixa intensidade + compressão.' },
        { user: 'Juliana Rocha', content: 'Paula, sinto muito. Infelizmente muitos profissionais ainda não conhecem o lipedema. A regra é: se o exercício gera vermelhidão ou dor nas pernas = está inflamando = parar.' },
        { user: 'Roberto Costa', content: 'O paradoxo do cardio no lipedema: a intensidade que reduz gordura normal INFLAMA o tecido lipedêmico. Bike estacionária com compressão é a melhor opção cardio.' },
      ]
    },
    {
      title: 'Protocolo AEJ + compressão: como fazer certo',
      posts: [
        { user: 'Ana Silva', content: 'Comecei AEJ com meia de compressão. 40 min de caminhada leve em jejum. Já estou na 4ª semana. Quanto tempo pra ver resultado real?' },
        { ia: true, content: 'AEJ no lipedema tem resultados mais lentos que na gordura normal. Espere 8-12 semanas para mudanças mensuráveis. Monitorize: circunferência, dor ao toque, e inchaço vespertino. Se os 3 melhorarem, o protocolo está funcionando. Qual a intensidade da sua caminhada? Deve ser 50-60% da FC máxima, onde você conversa confortavelmente.' },
        { user: 'Camila Freitas', content: 'Ana, meço minha FC com relógio. Se passar de 120bpm (zona 2) eu reduzo o passo. Tenho lipedema há 5 anos e essa é a abordagem que funciona.' },
        { user: 'Fernanda Dias', content: 'Complementando: faço AEJ + yoga leve depois. A combinação é ouro. O yoga ajuda no retorno linfático.' },
      ]
    },
    {
      title: 'Por que musculação SIM mas corrida NÃO?',
      posts: [
        { user: 'Larissa Campos', content: 'Minha médica liberou musculação mas proibiu corrida. Não entendi: os dois não são exercício? Qual a lógica?' },
        { ia: true, content: 'Excelente pergunta! Na musculação, a contração muscular atua como "bomba" para o sistema linfático, auxiliando a drenagem. A carga é controlada e não há impacto repetitivo. Na corrida, o impacto constante + gravidade + vibração traumatiza os capilares frágeis do tecido lipedêmico, gerando micro-sangramentos e inflamação. É a natureza do impacto que faz a diferença, não a intensidade.' },
        { user: 'Roberto Costa', content: 'Boa explicação da IA. Acrescento: na musculação o tecido está em contração isométrica (protegido). Na corrida está em vibração livre (vulnerável). Pensem no tecido como uma esponja frágil - compressão suave ajuda, impacto machuca.' },
        { user: 'Tatiana Gomes', content: 'No pilates a lógica é parecida: controlamos cada movimento. Sem impacto, com compressão dos músculos. Por isso funciona tão bem pra lipedema!' },
        { user: 'Paula Mendes', content: 'Depois que entendi isso, troquei corrida por bike + musculação. Mudou tudo! 3 meses sem hematoma novo.' },
      ]
    },
    {
      title: 'Relato: bike estacionária com compressão',
      posts: [
        { user: 'Camila Freitas', content: 'Relato de 3 meses: bike estacionária 30min/dia, 5x/semana, sempre com meia 20-30mmHg. Resultados: -3cm de coxa, dor reduziu de 7 pra 3 (escala 0-10), zero hematomas novos. Quem mais faz bike com compressão?' },
        { ia: true, content: 'Resultados consistentes com o que a literatura mostra! A bike elimina o impacto, a compressão protege os capilares, e o movimento cíclico das pernas funciona como bomba linfática natural. 30 minutos em zona 2 é o sweet spot. Você monitora sua FC durante?' },
        { user: 'Ana Silva', content: 'Camila, inspirador! Vou comprar uma bike. Alguma recomendação? Magnética ou spinning?' },
        { user: 'Juliana Rocha', content: 'Magnética, Ana! Spinning tem pegada mais agressiva e posição que pode pressionar vasos. Bike magnética reclinada é perfeita pro lipedema.' },
      ]
    },
  ],

  'deficit-calorico': [
    {
      title: 'Déficit de 500kcal mas peso não cai',
      posts: [
        { user: 'Ana Silva', content: 'Estou em déficit de 500kcal há 6 semanas (acompanhando com nutricionista). Peso não desceu nada! Gordura abdominal continua igual. O que pode estar errado?' },
        { ia: true, content: 'Platô de 6 semanas merece investigação. Possibilidades: 1) Adaptação metabólica - seu corpo pode ter reduzido o gasto calórico, 2) Retenção hídrica mascarando perda de gordura, 3) Erro na contagem calórica (muito comum mesmo com profissional). Pergunta crucial: suas medidas de cintura mudaram? Peso corporal sozinho pode enganar.' },
        { user: 'Carlos Souza', content: 'Ana, já aconteceu comigo. Peso parado mas cintura diminuindo. Recomposição corporal é real. Mede com fita!' },
        { user: 'Camila Freitas', content: 'Estresse e sono ruim também travam o emagrecimento. Cortisol alto = retenção de água + acúmulo abdominal. Você dorme bem?' },
        { user: 'Maria Santos', content: 'Passei por isso! No meu caso era NEAT que caiu. Eu estava mais sedentária sem perceber. Comecei a usar pedômetro e fez diferença.' },
      ]
    },
    {
      title: 'Refeeds e dias livres: ciência ou desculpa?',
      posts: [
        { user: 'Lucas Martins', content: 'Meu coach prescreve refeed de carbo 1x por semana no déficit. Funciona mesmo ou é só desculpa pra comer mais? Sinto que perco o progresso da semana.' },
        { ia: true, content: 'Refeeds têm base científica sim! Após período em déficit, a leptina (hormônio da saciedade) cai. Um dia com carboidratos elevados pode: 1) Restaurar parcialmente a leptina, 2) Reabastecer glicogênio muscular, 3) Dar "break" psicológico. MAS: refeed ≠ cheat day descontrolado. Deve ser planejado, com aumento de carbo mantendo proteína, sem exceder manutenção calórica.' },
        { user: 'Ricardo Nunes', content: 'Lucas, uso refeed em todas as preps. Faz diferença brutal no treino do dia seguinte e na aderência à dieta. Mas tem que ser carbo limpo, não pizza.' },
        { user: 'Bruno Carvalho', content: 'No meu caso, 1 refeed por semana permite déficit mais agressivo nos outros 6 dias. O resultado semanal é melhor do que déficit moderado 7 dias.' },
        { user: 'Camila Freitas', content: 'Concordo com o Ricardo. Arroz, batata doce, frutas - não ultraprocessados. A resposta hormonal é diferente.' },
      ]
    },
    {
      title: 'Metabolismo adaptativo é mito?',
      posts: [
        { user: 'Thiago Barros', content: 'Vi um influencer falando que "metabolismo lento" é mito e que todo mundo emagrece no déficit. Mas eu faço déficit certinho e NÃO emagreço mais. Explica isso.' },
        { ia: true, content: 'Não é mito, mas é nuançado. "Metabolismo lento" como desculpa = mito. Adaptação metabólica real = ciência. Após semanas em déficit, seu corpo reduz: 1) NEAT (movimentos espontâneos), 2) Termogênese dos alimentos, 3) Hormônios tireoidianos. Isso pode reduzir seu gasto em 200-300kcal/dia. Solução: diet breaks periódicas (1-2 semanas na manutenção a cada 8-12 semanas de déficit).' },
        { user: 'Gustavo Pereira', content: 'Thiago, metabolismo adaptativo é REAL. Participantes do Biggest Loser tiveram metabolismo 500kcal abaixo do esperado ANOS depois do programa. É adaptação, não preguiça.' },
        { user: 'Ana Silva', content: 'A chave é: deficit MODERADO e sustentável. Déficits agressivos aceleram a adaptação. 15-20% abaixo da manutenção é o ideal.' },
      ]
    },
    {
      title: 'NEAT: o segredo que ninguém fala',
      posts: [
        { user: 'Carlos Souza', content: 'Comecei a medir meu NEAT (gasto fora do treino) e descobri que ele CAIU 400kcal quando comecei a dieta. Sem perceber, eu parava de andar, ficava mais parado. Alguém mais notou isso?' },
        { ia: true, content: 'Carlos, você identificou um dos maiores sabotadores do déficit! O NEAT pode representar 15-50% do gasto calórico diário. Em dieta, o corpo reduz movimentos inconscientes (mexer perna, andar mais devagar, etc). Estratégia: meta de 8-10mil passos/dia garante NEAT mínimo. Algumas pessoas usam stand desk e alarmes para se mover a cada hora.' },
        { user: 'Pedro Alves', content: 'Eu como corredor noto isso DEMAIS. Quando corto calorias, fico com preguiça de subir escada, caminho mais devagar. O corpo economiza sem avisar.' },
        { user: 'Maria Santos', content: 'Comprei smartwatch só pra isso! Nos dias que não bato 8mil passos, sei que meu déficit real é menor. Game changer.' },
        { user: 'Amanda Pires', content: 'Mães: brincar com as crianças conta como NEAT! Desde que comecei a ser "mãe ativa" meu gasto subiu uns 200kcal/dia fácil.' },
      ]
    },
    {
      title: 'Parar de contar calorias: quando?',
      posts: [
        { user: 'Fernanda Dias', content: 'Estou ficando obsessiva com contagem de calorias. Pesando tudo, evitando comer fora, ansiedade quando não sei os macros. Isso é normal no início ou já é problema?' },
        { ia: true, content: 'Fernanda, obrigado por compartilhar. O que você descreve ultrapassa o cuidado saudável. Sinais de alerta: 1) Evitar situações sociais por causa da comida, 2) Ansiedade quando não sabe macros exatos, 3) Relação punitiva com alimentação. Contar calorias é FERRAMENTA, não estilo de vida permanente. Após aprender porções intuitivamente (4-8 semanas), muitos profissionais recomendam migrar para "eating by feel". Já conversou com sua nutricionista sobre isso?' },
        { user: 'Ana Silva', content: 'Fernanda, como nutricionista vejo isso MUITO. Contar calorias por mais de 3 meses seguidos aumenta risco de comportamento restritivo. O ideal é usar por período limitado pra calibrar o "olho".' },
        { user: 'Renata Moura', content: 'Passei por isso. A terapia cognitivo-comportamental me ajudou muito. Agora como intuitivamente e mantenho o peso.' },
        { user: 'Camila Freitas', content: 'Dica: faça 4 semanas contando, 2 semanas intuitivo. Vai e volta até se sentir confiante sem contar. Funciona muito bem!' },
      ]
    },
    {
      title: 'Efeito sanfona: como quebrar o ciclo',
      posts: [
        { user: 'Amanda Pires', content: 'Perdi 15kg 3 vezes na vida. Recuperei tudo nas 3. Dessa vez quero fazer diferente. Alguém que quebrou o efeito sanfona pode compartilhar o que fez?' },
        { ia: true, content: 'Amanda, a experiência de yo-yo é muito comum e NÃO é falta de força de vontade. O corpo tem mecanismos de defesa contra perda de peso. A chave para quebrar o ciclo: 1) Fase de perda mais lenta (max 0.5-1% do peso/semana), 2) Fase de MANUTENÇÃO de 3-6 meses ANTES de tentar perder mais, 3) Construir hábitos, não seguir dietas temporárias. Qual era a abordagem nas 3 vezes anteriores?' },
        { user: 'Ricardo Nunes', content: 'Amanda, o erro #1 é: a dieta termina quando atinge o peso. NÃO. A dieta termina quando os HÁBITOS estão automáticos. Mantenha por 6 meses no peso meta antes de relaxar.' },
        { user: 'Paula Mendes', content: 'No meu caso, musculação foi o que mudou tudo. Mais músculo = metabolismo mais alto = mais fácil manter. Nunca mais fiz só dieta sem treino de força.' },
      ]
    },
  ],

  'treino-gluteo': [
    {
      title: 'Glúteo médio: o músculo esquecido',
      posts: [
        { user: 'Maria Santos', content: 'Treino glúteo há 2 anos mas só sinto gluteo máximo. Meu glúteo médio é inexistente e isso gera instabilidade no agachamento. Como ativar?' },
        { ia: true, content: 'O glúteo médio é crucial para estabilidade pélvica e estética lateral do quadril. Para ativá-lo: 1) Abdução de quadril deitada (com faixa), 2) Monster walk, 3) Single leg hip thrust. Importante: faça ativação ANTES do treino pesado (2 séries de 15-20 reps). Você sente o valgo dinâmico (joelhos para dentro) no agachamento?' },
        { user: 'Tatiana Gomes', content: 'Maria, no pilates a gente trabalha MUITO glúteo médio. Clam shell com resistência e side lying são exercícios excelentes.' },
        { user: 'Amanda Pires', content: 'Faixa elástica mudou meu jogo! Uso no aquecimento: 3 séries de monster walk + crab walk. Meu agachamento ficou muito mais estável.' },
        { user: 'Fernanda Alves', content: 'Outra dica: step lateral com faixa. 3x20 cada lado. Em 4 semanas meu glúteo médio "apareceu" lateralmente.' },
      ]
    },
    {
      title: 'Hip thrust vs agachamento para glúteo',
      posts: [
        { user: 'Camila Freitas', content: 'Pergunta polêmica: hip thrust ou agachamento, qual é superior para crescer glúteo? Meu tempo é limitado e preciso priorizar um.' },
        { ia: true, content: 'A ciência é clara: hip thrust tem maior ativação do glúteo máximo (EMG) porque o pico de tensão ocorre na extensão completa do quadril (onde o glúteo é mais forte). O agachamento tem pico de tensão na posição mais baixa (onde o quadríceps domina). Para GLÚTEO especificamente, hip thrust é superior. Mas o agachamento trabalha mais músculos simultaneamente. Ideal: priorize hip thrust, use agachamento como complemento.' },
        { user: 'Ricardo Nunes', content: 'Concordo 100%. Na prep das minhas atletas, hip thrust é prioridade 1 para glúteo. Agachamento é pra perna geral.' },
        { user: 'Bruno Carvalho', content: 'Mas agachamento profundo (ATG) também trabalha bem o glúteo na posição alongada. Não descartaria totalmente.' },
        { user: 'Larissa Campos', content: 'Faço os dois! Hip thrust 2x/semana como principal, agachamento búlgaro 2x/semana como acessório. Melhor combo que já fiz.' },
      ]
    },
    {
      title: 'Frequência ideal: posso treinar glúteo todo dia?',
      posts: [
        { user: 'Beatriz Gomes', content: 'Quero glúteo grande RÁPIDO. Posso treinar todo dia? Vejo influenciadoras treinando glúteo 5-6x por semana. Funciona mesmo?' },
        { ia: true, content: 'Treinar glúteo todo dia = overtraining para a maioria. O músculo cresce no DESCANSO, não no treino. Frequência ótima baseada em evidência: 2-3x/semana para a maioria, com 48-72h de recuperação entre sessões pesadas. Volume semanal de 12-20 séries. Treinar mais que isso sem recuperação adequada pode até REDUZIR o crescimento. Influenciadoras que treinam 6x muitas vezes usam auxílios farmacológicos que aceleram a recuperação.' },
        { user: 'Felipe Ramos', content: 'Beatriz, como preparador: 3x/semana com intensidade alta > 6x/semana com intensidade baixa. SEMPRE. O estímulo precisa ser forte, e depois o corpo precisa de tempo pra reconstruir.' },
        { user: 'Amanda Pires', content: 'Eu caí nessa de treinar todo dia. Resultado: tendinite no quadril e zero crescimento. Reduzi pra 3x e decolou!' },
      ]
    },
    {
      title: 'Qual a carga ideal pro hip thrust?',
      posts: [
        { user: 'Larissa Campos', content: 'Estou fazendo hip thrust com 60kg mas não sei se é pouco. Pessoal no Instagram levanta 150+kg. Quanto é "bom"?' },
        { ia: true, content: 'Não compare com Instagram - muitos vídeos usam barras e anilhas "falsas" ou amplitude parcial. Uma referência realista: hip thrust de 1.5-2x seu peso corporal com amplitude completa e contração no topo de 2 segundos é EXCELENTE. Se você pesa 60kg, 90-120kg com boa técnica é ótimo. O mais importante é sentir o glúteo contraindo forte no topo do movimento.' },
        { user: 'Ricardo Nunes', content: 'Larissa, 60kg com técnica perfeita (pausa no topo, sem hiper-extensão lombar) é melhor que 150kg com ego lift. Foco na conexão mente-músculo!' },
        { user: 'Maria Santos', content: 'Eu uso 80kg com banda elástica no joelho pra forçar ativação do glúteo médio também. A banda fez mais diferença que aumentar carga!' },
      ]
    },
    {
      title: 'Glúteo e genética: até onde dá pra mudar?',
      posts: [
        { user: 'Fernanda Alves', content: 'Sou ectomorfa, quadril estreito. Treino pesado há 3 anos e meu glúteo cresceu pouco comparado a amigas que começaram junto. Genética é tudo?' },
        { ia: true, content: 'Genética influencia: inserção muscular, formato do quadril, distribuição de fibras, e resposta ao treinamento. MAS não é limitante absoluto. Ectomorfos podem precisar de mais volume, mais frequência, e mais calorias. Verifique: 1) Você está em superávit calórico? (essencial para crescimento), 2) Volume semanal suficiente? (12-20 séries), 3) Progressão de carga consistente? Genética define o teto, treino e nutrição determinam o quanto você chega perto dele.' },
        { user: 'Amanda Pires', content: 'Fernanda, eu era igual. Mudou quando aumentei proteína pra 2g/kg E entrei em leve superávit. Glúteo precisa de COMIDA pra crescer!' },
        { user: 'Gustavo Pereira', content: 'Ectomorfos respondem bem a volume alto com frequência alta. Tenta 4x/semana com 6-8 séries por sessão. Total de 24-32 séries/semana.' },
      ]
    },
  ],

  'canetas': [
    {
      title: 'Ozempic: relato de 3 meses',
      posts: [
        { user: 'Renata Moura', content: 'Comecei Ozempic 0.25mg há 3 meses, estou em 0.5mg agora. Perdi 7kg. Efeitos colaterais: náusea forte na 1ª semana de cada aumento de dose. Alguém mais?' },
        { ia: true, content: 'Perda de 7kg em 3 meses está dentro do esperado para semaglutida. A náusea é o efeito colateral mais comum e tende a diminuir com adaptação. Dicas: comer porções menores, evitar gordura em excesso, e manter hidratação. Você manteve treino de força? É crucial para preservar massa muscular durante a perda com GLP-1.' },
        { user: 'Roberto Costa', content: 'Renata, como médico: a náusea é dose-dependente. Se está muito forte, pode ficar mais tempo em 0.25 antes de subir. Não há pressa na titulação.' },
        { user: 'Carlos Souza', content: 'Importante: musculação + proteína alta (2g/kg) é OBRIGATÓRIO com canetas. Senão perde muita massa magra junto. Já vi casos tristes de perda muscular severa.' },
        { user: 'Ana Silva', content: 'Reforço o Carlos! Meus pacientes que usam canetas SEM treino de força perdem até 40% de massa magra. Com treino + proteína, esse número cai pra 10-15%.' },
      ]
    },
    {
      title: 'Mounjaro vs Ozempic: diferenças reais',
      posts: [
        { user: 'Pedro Alves', content: 'Meu endo ofereceu Mounjaro em vez de Ozempic. Disse que é mais potente. Alguém fez os dois e pode comparar?' },
        { ia: true, content: 'Mounjaro (tirzepatida) atua em 2 receptores (GLP-1 + GIP), enquanto Ozempic (semaglutida) atua apenas em GLP-1. Nos estudos, Mounjaro mostrou perda de peso ligeiramente superior (~15-20% vs ~12-15% do peso corporal). Efeitos colaterais gastrointestinais são similares. A escolha depende de resposta individual, custo e disponibilidade. Ambos são excelentes opções.' },
        { user: 'Roberto Costa', content: 'Fato: Mounjaro tem leve vantagem em eficácia nos estudos SURMOUNT vs STEP. Mas na prática clínica, a resposta individual varia muito. Já vi pacientes respondendo melhor ao Ozempic.' },
        { user: 'Renata Moura', content: 'Eu comecei com Ozempic e migrei pro Mounjaro. Senti menos náusea e mais saciedade. Mas cada organismo é diferente.' },
      ]
    },
    {
      title: 'Parar a caneta: e depois?',
      posts: [
        { user: 'Camila Freitas', content: 'Atingi meu peso meta com Ozempic. Minha médica quer retirar gradualmente. Estou MORRENDO de medo de recuperar tudo. Alguém já parou?' },
        { ia: true, content: 'Preocupação válida. Estudos mostram que ~67% dos pacientes recuperam parte do peso após parar GLP-1. MAS os que mantêm: 1) Treino de força consistente, 2) Proteína adequada, 3) Hábitos alimentares construídos durante o uso, têm resultados MUITO melhores. A caneta é ferramenta para CONSTRUIR hábitos, não muleta permanente. A retirada gradual é a abordagem correta.' },
        { user: 'Ana Silva', content: 'Camila, o período de transição é CRUCIAL. Mantenha o mesmo padrão alimentar, aumente a atividade física levemente, e monitore peso semanalmente. Se subir 2kg+, converse com a médica.' },
        { user: 'Thiago Barros', content: 'Parei há 6 meses. Recuperei 3kg dos 15 que perdi. Mantive musculação 4x/semana e dieta com proteína alta. É possível manter a maior parte sim.' },
        { user: 'Paula Mendes', content: 'Dica de quem passou por isso: não pare a caneta E a dieta ao mesmo tempo. Pare a caneta mas mantenha os hábitos por pelo menos 6 meses.' },
      ]
    },
    {
      title: 'Canetas e exercício: combinação ideal',
      posts: [
        { user: 'Felipe Ramos', content: 'Como preparador físico, estou recebendo cada vez mais alunos usando canetas. Qual a melhor abordagem de treino? Mudar algo no periodização?' },
        { ia: true, content: 'Ótima pergunta profissional! Com GLP-1, as prioridades mudam: 1) Prioridade MÁXIMA: preservar massa muscular (treino de força 3-4x/semana), 2) Proteína: 2-2.5g/kg de peso META (não atual), 3) Volume moderado-alto (15-20 séries/grupo/semana), 4) Cardio: opcional, não priorizar sobre musculação, 5) Monitorar: força nos exercícios compostos - se cair, pode ser perda muscular. Bioimpedância mensal é ideal.' },
        { user: 'Ricardo Nunes', content: 'Felipe, na prep dos meus atletas que usam: treino full body 4x/semana, séries de 6-12 reps, foco em compostos. Nada de "treino pra queimar" - eles já estão queimando com a caneta.' },
        { user: 'Bruno Carvalho', content: 'Dica: creatina 5g/dia é especialmente importante com canetas. Ajuda a manter volume muscular e performance.' },
      ]
    },
  ],

  'odeia-treinar': [
    {
      title: 'Detesto academia mas preciso me exercitar',
      posts: [
        { user: 'Renata Moura', content: 'Não suporto o ambiente de academia. O barulho, a competição, as máquinas. Mas sei que preciso me exercitar. O que funciona pra quem ODEIA treinar?' },
        { ia: true, content: 'Você não precisa de academia! O melhor exercício é aquele que você FAZ consistentemente. Opções fora da academia: 1) Caminhadas ao ar livre (pode ouvir podcast), 2) Dança (Zumba, Just Dance em casa), 3) Natação/hidroginástica, 4) Yoga/pilates em casa, 5) Treino funcional no parque. A chave é encontrar algo que não pareça "obrigação". O que você gosta de fazer que envolve movimento?' },
        { user: 'Fernanda Dias', content: 'Renata, eu ODIAVA academia. Comecei yoga em casa com YouTube e mudou minha vida. Zero pressão, no meu ritmo, no meu espaço.' },
        { user: 'Pedro Alves', content: 'Já tentou caminhada com podcast? Eu caminho 1h/dia ouvindo audiolivro. Nem parece exercício. Resultado: 10kg em 6 meses.' },
        { user: 'Amanda Pires', content: 'Just Dance no videogame com as crianças! 30 minutos e queimo mais que na esteira. E rindo!' },
        { user: 'Lucas Martins', content: 'Ring Fit Adventure no Nintendo Switch mudou minha relação com exercício. É um RPG onde você treina pra lutar. Viciante!' },
      ]
    },
    {
      title: 'Exercício mínimo efetivo: quanto é suficiente?',
      posts: [
        { user: 'João Carlos', content: 'Tenho 55 anos e zero condicionamento. Qual o MÍNIMO de exercício que faz diferença real na saúde? Não quero meta de Instagram, quero saúde.' },
        { ia: true, content: 'A OMS recomenda 150 minutos/semana de atividade moderada. MAS estudos recentes mostram que QUALQUER quantidade é melhor que nada: 1) 10 min/dia de caminhada = 33% menos risco cardiovascular, 2) 2 sessões de força/semana = manutenção de massa muscular, 3) Subir escadas = equivale a cardio moderado. Comece com 10 minutos diários e aumente 5 min/semana. Em 2 meses você estará nos 30 min/dia sem perceber.' },
        { user: 'Roberto Costa', content: 'João, como médico: 20 minutos de caminhada diária reduz risco de diabetes tipo 2 em 30-50%. É o exercício com melhor custo-benefício que existe.' },
        { user: 'Marcelo Pereira', content: 'Tenho 50 e comecei com 15 minutos. Hoje faço 45. O segredo é: comece ridiculamente fácil. Se é fácil, você faz. Se faz, cria hábito.' },
      ]
    },
    {
      title: 'Treino em casa sem equipamento',
      posts: [
        { user: 'Amanda Pires', content: 'Mães ocupadas: preciso de treino de 20 min em casa, sem equipamento, sem barulho (bebê dormindo). Existe isso?' },
        { ia: true, content: 'Claro! Treino silencioso de 20 minutos: 4 rounds de 5 exercícios, 30seg cada + 15seg descanso. 1) Agachamento bodyweight, 2) Prancha, 3) Ponte de glúteo, 4) Afundo alternado, 5) Superman. Sem pular, sem barulho. Efetivo e silencioso! Faça 3-4x/semana. Em 4 semanas você sente diferença real.' },
        { user: 'Fernanda Dias', content: 'Amanda, canal "Fitness Blender" no YouTube tem treinos de 20 min sem equipamento. Faço há 1 ano e estou em outra shape.' },
        { user: 'Tatiana Gomes', content: 'Galões de água = halter caseiro! 5 litros = 5kg. Dá pra fazer muito exercício de força com isso.' },
        { user: 'Larissa Campos', content: 'Faixa elástica custa 30 reais e transforma treino em casa. Minha melhor compra fitness.' },
      ]
    },
    {
      title: 'Dança como exercício: funciona?',
      posts: [
        { user: 'Renata Moura', content: 'Sou dançarina e professora de zumba. Muita gente pergunta se dança "conta" como exercício. Posso dizer: CONTA SIM. Mas qual o limite? Pra quem quer emagrecer, zumba 3x basta?' },
        { ia: true, content: 'Dança é exercício completo! Zumba 3x/semana = ~600-900kcal queimadas + melhora cardiovascular + coordenação + saúde mental (efeito social + dopamina). Para emagrecimento, combinado com alimentação adequada, é mais que suficiente. Para hipertrofia, precisaria complementar com trabalho de força específico. Mas para SAÚDE geral, dança é perfeita.' },
        { user: 'Amanda Pires', content: 'Zumba me fez perder 12kg! Porque eu GOSTAVA e ia toda semana. Na academia eu faltava toda hora. O melhor exercício é o que você faz feliz.' },
        { user: 'Lucas Martins', content: 'Comecei fazendo Zumba de "zuação" e hoje é meu cardio principal. Muito mais divertido que esteira!' },
      ]
    },
  ],

  'ansiedade-alimentacao': [
    {
      title: 'Compulsão noturna: não consigo parar de comer à noite',
      posts: [
        { user: 'Fernanda Dias', content: 'Toda noite, depois das 21h, perco o controle. Como sem fome, sem pensar. Doces, salgados, tudo. Já tentei "não ter besteira em casa" mas saio pra comprar. É compulsão alimentar?' },
        { ia: true, content: 'O que você descreve tem características de compulsão alimentar noturna (Night Eating Syndrome ou Binge Eating). É importante diferenciar: 1) Fome real (restrição calórica durante o dia?), 2) Fome emocional (estresse, tédio, ansiedade), 3) Compulsão clínica (perda de controle + culpa). Se há perda de controle e sofrimento, procure um psicólogo especializado em transtornos alimentares. Isso não se resolve com "força de vontade" - precisa de tratamento adequado.' },
        { user: 'Paula Mendes', content: 'Fernanda, passei por isso. No meu caso, eu restringia DEMAIS durante o dia e à noite o corpo cobrava. Quando comecei a comer adequadamente de dia, a compulsão noturna diminuiu 80%.' },
        { user: 'Ana Silva', content: 'Como nutricionista: investigue se você está comendo proteína e fibra suficientes nas refeições principais. Déficit nesses nutrientes = mais fome noturna.' },
        { user: 'Renata Moura', content: 'Terapia cognitivo-comportamental me ajudou DEMAIS com isso. Hoje tenho ferramentas pra quando a vontade aparece. Procure um psicólogo, sério.' },
      ]
    },
    {
      title: 'Comer emocional: como identificar?',
      posts: [
        { user: 'Larissa Campos', content: 'Como saber se estou comendo por fome ou emoção? Às vezes não consigo diferenciar. Sinto que "preciso" comer mas não sei se é corpo ou mente.' },
        { ia: true, content: 'Teste simples: fome física aparece gradualmente e aceita qualquer comida. Fome emocional aparece de repente e pede comida ESPECÍFICA (geralmente doce ou comfort food). Outro teste: antes de comer, pergunte "se eu tivesse que comer brócolis agora, comeria?" Se sim = fome real. Se não = fome emocional. Não significa que fome emocional é "proibida" - significa que exige estratégias diferentes.' },
        { user: 'Fernanda Dias', content: 'Esse teste do brócolis MUDOU minha vida. Uso toda vez. 80% das vezes é emocional e eu nem percebia.' },
        { user: 'Amanda Pires', content: 'Outra dica: diário alimentar com EMOÇÕES. Anota o que comeu + como se sentia. Em 1 semana os padrões ficam claros.' },
      ]
    },
    {
      title: 'Culpa depois de comer: como lidar?',
      posts: [
        { user: 'Maria Santos', content: 'Sempre que como algo "proibido", fico com culpa horrível. Às vezes vou fazer cardio pra "compensar". Isso é normal ou já é transtorno?' },
        { ia: true, content: 'Maria, exercício para "compensar" alimentação é um comportamento compensatório que pode indicar relação disfuncional com comida. Importante: 1) Não existem alimentos "proibidos" - existem frequências adequadas, 2) Exercício não é punição, 3) Uma refeição "fora do plano" NÃO destrói progresso. Se a culpa é constante e você usa exercício como punição regularmente, conversar com profissional de saúde mental é importante.' },
        { user: 'Ana Silva', content: 'Maria, nenhuma comida isolada engorda ou emagrece. É o PADRÃO ao longo do tempo. Um pedaço de bolo numa dieta boa é irrelevante nutricionalmente.' },
        { user: 'Fernanda Dias', content: 'Passei anos assim. O que me ajudou: mudar "eu FALHEI na dieta" para "eu ESCOLHI comer isso". Tirar a culpa e colocar consciência.' },
        { user: 'Renata Moura', content: 'Prática de auto-compaixão. Quando vem a culpa, falo comigo mesma como falaria com uma amiga. "Tudo bem, foi uma escolha, amanhã é outro dia." Parece bobo mas funciona.' },
      ]
    },
    {
      title: 'Dieta restritiva gerou compulsão',
      posts: [
        { user: 'Beatriz Gomes', content: 'Fiz dieta de 1200kcal por 4 meses. Perdi 10kg mas desenvolvi compulsão alimentar que não tinha antes. Agora como 3000kcal+ em episódios. O que aconteceu comigo?' },
        { ia: true, content: 'Beatriz, isso é EXTREMAMENTE comum e documentado na ciência. O Minnesota Starvation Experiment (1944) mostrou exatamente isso: restrição severa causa obsessão por comida e episódios de compulsão. 1200kcal para a maioria das mulheres é subfisiológico - seu corpo interpretou como fome e ativou mecanismos de sobrevivência. A recuperação envolve: aumentar calorias gradualmente para manutenção + acompanhamento psicológico + paciência. Isso não é fraqueza, é biologia.' },
        { user: 'Roberto Costa', content: 'Como médico: 1200kcal é uma caloria de CRIANÇA. Para adultos, raramente é apropriado. Infelizmente muitos "profissionais" ainda prescrevem isso. Procure um nutricionista que entenda de comportamento alimentar.' },
        { user: 'Camila Freitas', content: 'Passei pela mesma coisa. A recuperação levou 1 ano com nutricionista + psicóloga. Hoje como 2100kcal e mantenho peso. Tenha paciência consigo mesma.' },
        { user: 'Fernanda Dias', content: 'Beatriz, você não está sozinha. Grupo de apoio ajuda muito. Saber que outras pessoas passaram por isso tira a vergonha e a solidão.' },
      ]
    },
  ],

  'emagrecimento-35-mais': [
    {
      title: 'Menopausa e acúmulo de gordura abdominal',
      posts: [
        { user: 'Renata Moura', content: 'Entrei na perimenopausa aos 47. Sem mudar nada na alimentação, ganhei 5kg em 6 meses - tudo na barriga. É hormonal mesmo? Tem como reverter?' },
        { ia: true, content: 'Sim, é hormonal. A queda de estrogênio redistribui a gordura: menos no quadril/coxas, mais no abdômen (padrão andróide). Isso acontece com quase todas as mulheres na perimenopausa. Estratégias: 1) Musculação é ESSENCIAL (mais que cardio), 2) Proteína mais alta (2g/kg), 3) Sono de qualidade (melatonina pode ajudar), 4) Discuta TRH com sua ginecologista. A boa notícia: com intervenção adequada, dá pra reverter boa parte.' },
        { user: 'Ana Silva', content: 'Renata, na perimenopausa o metabolismo pode cair 200-300kcal/dia. Musculação é a melhor forma de manter o metabolismo alto.' },
        { user: 'Roberto Costa', content: 'TRH (terapia de reposição hormonal) quando indicada, pode ajudar significativamente na redistribuição de gordura. Converse com seu ginecologista.' },
        { user: 'Paula Mendes', content: 'Comecei musculação aos 43 justamente por isso. Melhor decisão da minha vida. Revirou meu corpo em 1 ano.' },
      ]
    },
    {
      title: 'Metabolismo aos 40: mito ou realidade?',
      posts: [
        { user: 'Marcelo Pereira', content: 'Tenho 50 e sinto que meu metabolismo PAROU. Como a mesma coisa de 10 anos atrás e engordo. Metabolismo realmente desacelera com idade?' },
        { ia: true, content: 'Estudo de 2021 no Science revolucionou isso: o metabolismo basal NÃO cai significativamente entre 20-60 anos. O que muda: 1) Perda de massa muscular (que reduz gasto), 2) Redução do NEAT (menos movimento espontâneo), 3) Mudanças hormonais. Ou seja: não é o metabolismo que freia, é a composição corporal e atividade que mudam. A solução: musculação + manter-se ativo. Seu metabolismo pode ser tão bom aos 50 quanto era aos 30 - se mantiver a massa muscular.' },
        { user: 'Carlos Souza', content: 'Marcelo, como personal: meus alunos 50+ que treinam força 3x/semana têm metabolismo IGUAL ou melhor que os de 30. Músculo é o motor.' },
        { user: 'Pedro Alves', content: 'Tenho 55 e corro meia maratona. Mas concordo: a musculação fez mais diferença na composição corporal que a corrida.' },
      ]
    },
    {
      title: 'Resistência à insulina após os 35',
      posts: [
        { user: 'Daniela Correia', content: 'Exames mostraram resistência à insulina. Tenho 42 anos, IMC 27. Meu endócrino falou que é comum nessa idade. Como alimentação pode ajudar?' },
        { ia: true, content: 'Resistência à insulina é reversível com intervenção adequada! Estratégias alimentares: 1) Reduzir carbo refinado e açúcar, 2) Aumentar fibras (25-30g/dia), 3) Proteína em todas as refeições (estabiliza glicose), 4) Vinagre de maçã antes das refeições (estudo em Diabetes Care mostrou melhora de 34% na sensibilidade), 5) Comer carbo DEPOIS da proteína e vegetais. E o mais potente: musculação. Músculo é o maior "consumidor" de glicose do corpo.' },
        { user: 'Camila Freitas', content: 'Daniela, priorizaria: aveia no café, proteína + vegetais no almoço, e caminhar 15 min após as refeições principais (reduz pico glicêmico em 30%).' },
        { user: 'Roberto Costa', content: 'Exercício é mais eficaz que metformina nos estágios iniciais de resistência à insulina. 150 min/semana de exercício moderado pode normalizar completamente.' },
      ]
    },
    {
      title: 'Primeiro treino de força aos 45: por onde começar?',
      posts: [
        { user: 'João Carlos', content: 'Nunca fiz musculação. Tenho 55, sedentário, colesterol alto. Médico mandou treinar. Mas tenho vergonha de ir na academia sem saber nada. Por onde começo?' },
        { ia: true, content: 'João, você está dando o passo mais importante! Dicas para começar: 1) Contrate personal para 8-12 aulas iniciais (aprender técnica), 2) Comece com máquinas (mais seguras que pesos livres), 3) 2-3x/semana, 40 min, é suficiente, 4) Foco em exercícios compostos: leg press, supino máquina, remada. Sobre vergonha: 99% das pessoas na academia estão focadas nelas mesmas e torcem por você. E lembra: TODA pessoa experiente um dia foi iniciante.' },
        { user: 'Carlos Souza', content: 'João, como personal: meus melhores alunos começaram depois dos 50. A resposta ao treino é surpreendente. E a vergonha passa no segundo dia, prometo!' },
        { user: 'Marcelo Pereira', content: 'Comecei aos 48. Hoje com 50, minha postura, disposição e exames melhoraram TUDO. É o melhor investimento em saúde que existe.' },
        { user: 'Felipe Ramos', content: 'Dica: horários mais vazios são ótimos pra iniciar. Meio da manhã ou meio da tarde. Menos gente, menos pressão.' },
      ]
    },
  ],

  'antes-depois': [
    {
      title: 'Transformação de 18 meses: fotos e o que aprendi',
      posts: [
        { user: 'Ricardo Nunes', content: 'Compartilhando minha jornada: 18 meses, de 95kg (25% BF) pra 82kg (12% BF). Fase 1: déficit moderado por 6 meses. Fase 2: manutenção por 3 meses. Fase 3: mais 6 meses de déficit. Fase 4: manutenção atual. O que aprendi: paciência > motivação.' },
        { ia: true, content: 'Transformação exemplar, Ricardo! O que mais chama atenção é a abordagem em fases com manutenção intermediária - exatamente o que a ciência recomenda para preservar massa magra e evitar adaptação metabólica. Perder 13kg mantendo essa composição corporal mostra que a musculação e proteína foram priorizadas. Pode compartilhar seu protocolo de treino e nutrição?' },
        { user: 'Thiago Barros', content: 'Cara, PARABÉNS! Essa abordagem em fases é a que funciona de verdade. Muita gente quer fazer em 3 meses e perde músculo junto.' },
        { user: 'Larissa Campos', content: 'Inspirador! A parte da manutenção intermediária que poucos falam. Obrigada por compartilhar o processo REAL.' },
        { user: 'Felipe Ramos', content: 'Como preparador, confirmo: esse é o protocolo correto. Deficit → manutencão → deficit. Quem faz direto 12 meses de déficit = catástrofe metabólica.' },
      ]
    },
    {
      title: 'Não é só sobre peso: mudança de mentalidade',
      posts: [
        { user: 'Amanda Pires', content: 'Meu antes e depois não é sobre peso. Pesava 72kg antes, peso 72kg agora. Mas perdi 8kg de gordura e ganhei 8kg de músculo em 2 anos. Recomposição corporal é real! A balança mente.' },
        { ia: true, content: 'Recomposição corporal é um dos melhores resultados possíveis! Mesmo peso, corpo completamente diferente. Isso é especialmente comum em iniciantes que começam treino de força com alimentação adequada. Amanda, você provavelmente notou: roupas mais folgadas na cintura e mais justas nos ombros/coxas? Esse é o sinal clássico de recomposição.' },
        { user: 'Maria Santos', content: 'Amanda, isso é TUDO! Parei de me pesar e comecei a me medir. -8cm de cintura pesando a mesma coisa. A balança é a pior métrica.' },
        { user: 'Bruno Carvalho', content: 'Isso mostra porque fotos são mais importantes que peso. O espelho não mente, a balança sim.' },
      ]
    },
    {
      title: 'Processo honesto: os dias ruins',
      posts: [
        { user: 'Paula Mendes', content: 'Todo mundo posta o resultado final mas ninguém fala dos dias ruins. Nos meus 14 meses de processo: chorei 3 vezes por frustração, quis desistir 5 vezes, comi besteira em 2 festas inteiras. E MESMO ASSIM perdi 18kg. Perfeição não existe.' },
        { ia: true, content: 'Obrigado pela honestidade, Paula! Isso é MUITO mais inspirador que fotos filtradas. A consistência não é 100% - é 80-85% do tempo sendo bom o suficiente. Estudos mostram que pessoas que permitem "imperfeições planejadas" têm MELHOR aderência a longo prazo. O perfeccionismo alimentar é inimigo do progresso sustentável.' },
        { user: 'Renata Moura', content: 'Esse post deveria ser fixado! O processo real tem altos e baixos. Obrigada por mostrar que é normal.' },
        { user: 'Fernanda Dias', content: 'No meu processo eu errei MUITO. Mas o que importa é: na segunda-feira eu estava de volta. Não é sobre cair, é sobre levantar.' },
        { user: 'Carlos Souza', content: 'Como personal, digo: meus melhores alunos não são os perfeitos. São os consistentes. 80% de aderência com persistência > 100% por 2 meses.' },
      ]
    },
  ],

  'dieta-vida-real': [
    {
      title: 'Marmita vs restaurante: como manter dieta sem cozinhar',
      posts: [
        { user: 'Pedro Alves', content: 'Engenheiro, trabalho 10h/dia. Zero tempo pra cozinhar. Como manter alimentação saudável comendo fora? Restaurante por quilo é opção? Delivery?' },
        { ia: true, content: 'Totalmente possível! Estratégias: 1) Restaurante por quilo: monte prato com 1/2 salada, 1/4 proteína, 1/4 carbo. Evite frituras e molhos, 2) Delivery: apps têm opções "fit" (filtro por calorias), 3) Meal prep domingo: 2h de cozinha = 5 dias de marmita, 4) Rotisseria: frango assado + salada pronta = jantar em 5 min. Não precisa ser perfeito, precisa ser consistente.' },
        { user: 'Ana Silva', content: 'Pedro, dica de ouro: marmitarias fitness entregam congelado. Você esquenta no micro. Preço similar a delivery e muito mais saudável.' },
        { user: 'Carlos Souza', content: 'Meal prep é game changer. Domingo: cozinho 2kg de frango, arroz, e lavo salada. Dá pra 5 dias. 2 horas de trabalho = semana inteira resolvida.' },
        { user: 'Amanda Pires', content: 'Airfryer + tempero pronto = frango em 20 min. Não precisa ser chef pra comer bem!' },
      ]
    },
    {
      title: 'Dieta social: como comer com amigos sem sabotar',
      posts: [
        { user: 'Lucas Martins', content: 'Toda sexta saio com amigos: rodízio de pizza, churrasquinho, boteco. Se eu evitar, perco convívio social. Se participar, detono a dieta. Alguma estratégia?' },
        { ia: true, content: 'A vida social é parte da saúde! Estratégias: 1) Coma proteína antes de sair (chega menos faminto), 2) No rodízio: priorize sabores com proteína, coma devagar, 3) No boteco: opte por porções menores + petiscos proteicos, 4) Álcool: limite a 2 drinks, alterne com água, 5) "Conta semanal": se sexta é livre, compense levemente seg-qui. Uma refeição "livre" por semana NÃO sabota progresso se os outros 20+ são bons.' },
        { user: 'Thiago Barros', content: 'Lucas, minha regra: 90% bom, 10% livre. 21 refeições na semana, 2-3 são sociais e sem estresse. Funciona perfeitamente.' },
        { user: 'Bruno Carvalho', content: 'No churrasco: carne magra + salada. Sem pão de alho, sem farofa. Dá pra comer MUITO e manter dentro do plano.' },
        { user: 'Maria Santos', content: 'Dica: seja a pessoa que sugere o restaurante. Escolha um com opções saudáveis E gostosas. Todo mundo fica feliz!' },
      ]
    },
    {
      title: 'Viagem e dieta: como não voltar 5kg mais pesado',
      posts: [
        { user: 'Amanda Pires', content: 'Viajo a trabalho 2x/mês. Hotel + restaurantes + aeroporto. Sempre volto 2-3kg mais pesado (sei que é retenção mas mesmo assim). Dicas pra viagem?' },
        { ia: true, content: 'A maioria do peso pós-viagem é retenção de sódio + glicogênio, não gordura real. Mesmo assim, dicas: 1) Café da manhã do hotel: ovos + frutas (skip buffet de pães), 2) Leve sachês de whey na mala, 3) Garrafinha de água sempre, 4) Caminhe ao invés de Uber quando possível, 5) Jantar: proteína + salada em qualquer restaurante. E relaxe: 2-3 dias "fora" não destroem semanas de consistência.' },
        { user: 'Pedro Alves', content: 'Eu viajo MUITO. Kit de sobrevivência: whey sachê, castanhas, barra de proteína. Aeroporto sem opção saudável = sachê de whey com água.' },
        { user: 'Camila Freitas', content: 'Regra de viagem: café e jantar eu controlo. Almoço eu libero pra experimentar a comida local. Funciona bem!' },
      ]
    },
  ],

  'treino-casa': [
    {
      title: 'Kit básico para treinar em casa: o que comprar primeiro?',
      posts: [
        { user: 'Fernanda Dias', content: 'Quero montar home gym com orçamento de R$500. O que é prioridade?' },
        { ia: true, content: 'Com R$500, priorize nesta ordem: 1) Kit de faixas elásticas (3 resistências) ~R$80, 2) Par de halteres ajustáveis ~R$200, 3) Tapete de yoga ~R$50, 4) Barra de porta para pull-ups ~R$70, 5) Rolo de espuma (foam roller) ~R$60. Com isso você consegue treinar TUDO: empurrar, puxar, membros inferiores, core. Sobram ~R$40 pra uma corda de pular (cardio perfeito).' },
        { user: 'Carlos Souza', content: 'Concordo com a priorização! Mas se tiver que escolher UMA coisa: faixa elástica. Com 80 reais resolve 90% dos exercícios.' },
        { user: 'Tatiana Gomes', content: 'Galão de água de 5L = halter grátis! Livros empilhados = step! Cadeira = banco! Criatividade salva o bolso.' },
        { user: 'Lucas Martins', content: 'Marketplace tem equipamento usado por metade do preço. Comprei barra + anilhas por R$300. Gente que comprou e desistiu vende barato.' },
      ]
    },
    {
      title: 'Treino com faixa elástica: funciona mesmo?',
      posts: [
        { user: 'Beatriz Gomes', content: 'Comprei faixa elástica mas parece "treino de velho". Isso realmente constrói músculo ou é só pra reabilitação?' },
        { ia: true, content: 'Faixa elástica constrói músculo SIM - estudos mostram ganhos comparáveis aos pesos livres para iniciantes e intermediários. A vantagem: resistência PROGRESSIVA (aumenta conforme estica). Limitação: para avançados, a carga máxima é limitada. Para membros superiores funciona muito bem. Para pernas pode ficar insuficiente com o tempo. Dica: combine faixas de diferentes resistências para variar carga.' },
        { user: 'Felipe Ramos', content: 'Beatriz, treino atletas com faixa quando viajam. Funciona DEMAIS. O segredo é: tempo sob tensão. Séries lentas de 15-20 reps. O músculo não sabe se é faixa ou ferro.' },
        { user: 'Larissa Campos', content: 'Treino 100% com faixas há 8 meses e meus glúteos CRESCERAM. Não tanto quanto com peso, mas o resultado é real.' },
      ]
    },
    {
      title: 'Treino bodyweight avançado: além do básico',
      posts: [
        { user: 'Lucas Martins', content: 'Já faço 50 flexões e 20 agachamentos pistol. Preciso de progressão mais difícil sem equipamento. O que vem depois?' },
        { ia: true, content: 'Progressões avançadas de calistenia: 1) Flexão: archer push-up → one arm push-up, 2) Agachamento: shrimp squat → sissy squat, 3) Barra: muscle up → front lever progressions, 4) Core: dragon flag → human flag. Para pernas especificamente: nordic curl (hamstrings) e pistol com mochila carregada. Calistenia avançada trabalha força + controle motor de uma forma que pesos não conseguem.' },
        { user: 'Bruno Carvalho', content: 'Lucas, dá uma olhada no programa de calistenia do FitnessFAQs no YouTube. Progressões muito bem estruturadas.' },
        { user: 'Gustavo Pereira', content: 'Handstand push-ups contra a parede é um dos melhores exercícios para ombro que existe. Zero equipamento, carga alta.' },
      ]
    },
  ],

  'performance-biohacking': [
    {
      title: 'Creatina: o que a ciência realmente diz',
      posts: [
        { user: 'Gustavo Pereira', content: 'Creatina é o suplemento mais estudado do mundo, mas ainda vejo gente com medo de tomar. Vamos listar os benefícios comprovados?' },
        { ia: true, content: 'Benefícios comprovados da creatina monohidratada (5g/dia): 1) +5-10% força em exercícios de alta intensidade, 2) +1-2kg massa magra (via volumização celular), 3) Neuroproteção (estudos em Parkinson/Alzheimer), 4) Melhora cognitiva sob privação de sono, 5) Possível efeito antidepressivo. Segurança: NENHUM estudo mostrou dano renal em pessoas SAUDÁVEIS (meta-análise com +500 estudos). Contraindicação: apenas doença renal pré-existente.' },
        { user: 'Roberto Costa', content: 'Como médico, posso confirmar: creatina é o suplemento com maior evidência científica. Prescrevo pra pacientes 50+ pela neuroproteção.' },
        { user: 'Ricardo Nunes', content: '5g/dia, todo dia, pra sempre. Não precisa de ciclo, não precisa de loading. Simples assim.' },
        { user: 'Thiago Barros', content: 'Dica: creatina monohidratada é a mais barata e a MELHOR. As versões "premium" (HCL, buffered) não mostraram superioridade nos estudos.' },
      ]
    },
    {
      title: 'Protocolo de sono para performance',
      posts: [
        { user: 'Marcelo Pereira', content: 'Otimizei tudo: treino, dieta, suplementos. Mas durmo 5-6h por noite por causa do trabalho. Quanto isso prejudica?' },
        { ia: true, content: 'O sono é provavelmente o fator mais subestimado em performance. <6h/noite causa: 1) -20-30% testosterona, 2) +40% resistência à insulina, 3) -11% performance aeróbica, 4) Aumento de cortisol (catabolismo), 5) Redução de GH (crescimento muscular). Estratégias: set alarm pra DORMIR (não só acordar), quarto 18-20 graus, blackout total, sem tela 1h antes. Se não consegue 7-8h: naps de 20min no almoço ajudam MUITO.' },
        { user: 'Gustavo Pereira', content: 'Marcelo, se tiver que escolher entre treinar e dormir: DURMA. Treino sem sono = cortisol alto = catabolismo. Você piora treinando mal dormido.' },
        { user: 'Felipe Ramos', content: 'Meus atletas têm meta de sono como têm meta de treino. 7-8h é não-negociável. Performance caiu? Primeira coisa que investigo é sono.' },
      ]
    },
  ],

  'peptideos-research': [
    {
      title: 'BPC-157: evidência científica atual',
      posts: [
        { user: 'Rodrigo Andrade', content: 'Estudando BPC-157 pra uma tendinopatia crônica que não resolve. A maioria dos estudos é em ratos. Alguém tem experiência humana real?' },
        { ia: true, content: 'BPC-157 (Body Protection Compound) tem evidência promissora mas predominantemente pré-clínica. Em modelos animais: aceleração de cicatrização de tendões, ligamentos, músculo e intestino. Mecanismo: estimula angiogênese e fatores de crescimento locais. Limitações: poucos estudos em humanos, regulação como "research chemical", variação de qualidade entre fornecedores. Se considerar uso, converse com médico que entenda de peptídeos.' },
        { user: 'Roberto Costa', content: 'Como médico: os dados pré-clínicos são impressionantes, mas faltam trials em humanos. Use com supervisão médica SEMPRE. E cuidado com a fonte - peptídeos de procedência duvidosa podem conter impurezas.' },
        { user: 'Thiago Barros', content: 'Usei por 4 semanas em uma tendinite no cotovelo que tinha há 1 ano. Melhorou significativamente. Anecdotal, eu sei, mas minha experiência foi positiva.' },
      ]
    },
    {
      title: 'Ipamorelin + CJC-1295: protocolos de GH',
      posts: [
        { user: 'Gustavo Pereira', content: 'Alguém usa combo Ipamorelin + CJC-1295 DAC? Estou pesquisando como alternativa ao GH sintético. Quais as diferenças práticas?' },
        { ia: true, content: 'Ipamorelin (GHRP) + CJC-1295 DAC (GHRH) atuam sinergicamente: Ipamorelin estimula liberação pulsátil de GH, CJC-1295 amplifica e prolonga a onda. Diferenças vs GH exógeno: 1) Mantém eixo feedback natural (não suprime produção endógena), 2) Padrão pulsátil fisiológico (vs nível constante do GH exógeno), 3) Menos efeitos colaterais (menos retenção, menos resistência insulina), 4) Efeito mais sutil. Limitação: menos potente que GH exógeno em doses terapêuticas.' },
        { user: 'Rodrigo Andrade', content: 'Uso há 6 meses. Melhora no sono (profundo demais), recuperação entre treinos, e qualidade de pele. Não espere resultados dramáticos - é sutil mas consistente.' },
        { user: 'Ricardo Nunes', content: 'Para quem é natural: peptídeos de GH são a opção com melhor custo-benefício de risco. Muito mais seguros que GH sintético.' },
      ]
    },
  ],

  'receitas-saudaveis': [
    {
      title: 'Bolo de caneca proteico (5 minutos)',
      posts: [
        { user: 'Fernanda Dias', content: 'Receita mais fácil do mundo: 1 scoop whey + 1 ovo + 1 colher de aveia + canela. Microondas 2min. Macros: 35P/15C/8G. Fica tipo bolo de chocolate fofinho!' },
        { ia: true, content: 'Excelente receita! Análise nutricional: ~275kcal, excelente razão proteína:caloria. Variações: adicionar banana amassada (+carbo pré-treino), usar whey de baunilha com pedaços de fruta, ou adicionar pasta de amendoim (+gordura boa). Dica: não passe de 2min no micro senão fica borrachudo.' },
        { user: 'Amanda Pires', content: 'Faço TODO dia pro café! Minha variação: adiciono 1 colher de cacau em pó. Fica sabor brownie. As crianças amam!' },
        { user: 'Maria Santos', content: 'Vida universitária salva! Receita perfeita pro dormitório. Barata, rápida, proteica. Virou meu lanche pré-treino.' },
        { user: 'Camila Freitas', content: 'Dica: em vez de micro, jogue na frigideira antiaderente. Fica tipo panqueca americana. Coloca banana por cima. Chef kiss!' },
      ]
    },
    {
      title: 'Meal prep dominical: 7 refeições em 2 horas',
      posts: [
        { user: 'Carlos Souza', content: 'Meu meal prep de domingo: 2kg frango grelhado + 1kg arroz + feijão + 5 saladas lavadas. 2h de trabalho = semana inteira. Quem mais faz? Compartilhem receitas!' },
        { ia: true, content: 'Meal prep é a estratégia #1 de consistência alimentar! Dicas para otimizar: 1) Cozinhe 2-3 proteínas diferentes (frango, carne, peixe) pra não enjoar, 2) Use temperos diferentes em cada lote, 3) Congele 3 porções + geladeira 4 (congelado não perde textura em até 3 meses), 4) Legumes: asse tudo junto no forno (abobrinha, brócolis, cenoura). Alguém quer compartilhar sua montagem de marmita?' },
        { user: 'Pedro Alves', content: 'Minha adição: faço wrap de alface com frango desfiado. Fica tipo taco fit. Zero carbo e delicioso.' },
        { user: 'Ana Silva', content: 'Dica de nutricionista: varie as cores dos vegetais ao longo da semana. Cores diferentes = micronutrientes diferentes.' },
        { user: 'Larissa Campos', content: 'Uso potes de vidro transparente. Vendo as cores das comidas dá mais vontade de comer saudável!' },
      ]
    },
    {
      title: 'Overnight oats: receita base + variações',
      posts: [
        { user: 'Amanda Pires', content: 'Overnight oats virou meu café padrão! Base: 40g aveia + 1 scoop whey + 150ml leite + chia. Deixo na geladeira à noite. De manhã só como. Variações?' },
        { ia: true, content: 'Base excelente! ~350kcal, 30P/40C/10G. Variações: 1) Tropical: manga + coco ralado, 2) Berry: morango + blueberry + mel, 3) Chocolate: cacau + banana + pasta de amendoim, 4) Natalino: canela + nozes + passas, 5) Green: espinafre + abacate + limão. Dica pro: prepare 5 potes no domingo (1 de cada sabor). Cada dia uma surpresa!' },
        { user: 'Maria Santos', content: 'Minha favorita: banana + pasta de amendoim + granola por cima. Parece sobremesa, mas é café da manhã proteico!' },
        { user: 'Fernanda Dias', content: 'Versão vegan: leite de coco + whey vegano + frutas vermelhas. Fica cremoso e delicioso.' },
      ]
    },
  ],

  'exercicios-que-ama': [
    {
      title: 'Hip thrust: o exercício que mudou meu shape',
      posts: [
        { user: 'Larissa Campos', content: 'Sou apaixonada por hip thrust! Quando comecei levantava 20kg, hoje faço 100kg com pausa no topo. Meu glúteo mudou completamente em 1 ano. Quem mais ama esse exercício?' },
        { ia: true, content: 'O hip thrust é realmente um dos melhores exercícios para desenvolvimento glúteo! Análise biomecânica: pico de tensão na extensão completa (onde o glúteo é mais forte), posição estável que permite carga alta, e baixo estresse na lombar. Progressão de 20kg para 100kg em 1 ano é fantástica! Dica: tente variações unilateral para corrigir assimetrias.' },
        { user: 'Amanda Pires', content: 'ME TOO! É o único exercício que eu SINTO o glúteo trabalhando 100%. Agachamento eu sinto mais perna.' },
        { user: 'Tatiana Gomes', content: 'No pilates a gente faz variações de ponte que são basicamente hip thrust no solo. É universal!' },
      ]
    },
    {
      title: 'Levantamento terra: rei dos exercícios?',
      posts: [
        { user: 'Rodrigo Andrade', content: 'Pra mim, terra é o rei. Trabalha TUDO: posterior, core, grip, costa. 200kg no terra me deu mais resultado que qualquer outro exercício isolado. Quem concorda?' },
        { ia: true, content: 'O levantamento terra é de fato um dos exercícios mais completos! Recruta ~70% da musculatura total do corpo. Benefícios únicos: 1) Maior liberação hormonal (GH, testosterona), 2) Desenvolvimento de posterior inteiro, 3) Core funcional real, 4) Transferência para atividades do dia a dia. 200kg é uma carga respeitável! Sua técnica é convencional ou sumo?' },
        { user: 'Felipe Ramos', content: 'Terra convencional pra posterior, sumo pra quadril/adutores. Os dois são reis, só de reinos diferentes!' },
        { user: 'Thiago Barros', content: 'Terra é o exercício que separa quem treina de verdade de quem brinca. Nada constrói um posterior como 5x5 pesado de terra.' },
      ]
    },
  ],

  'sinal-vermelho': [
    {
      title: 'Dor aguda no ombro durante supino',
      posts: [
        { user: 'Bruno Carvalho', content: 'Senti uma pontada FORTE no ombro direito no meio do supino, na subida. Parei na hora. Dói ao levantar o braço lateralmente. O que pode ser e o que faço?' },
        { ia: true, content: 'Dor aguda durante supino com irradiação em abdução sugere possível lesão no manguito rotador (supraespinal é o mais comum) ou conflito subacromial. PARE o exercício imediatamente (você fez certo!). Nos próximos 48h: gelo 15min a cada 2h, anti-inflamatório se necessário. Se dor persistir após 72h ou piorar, procure ortopedista. Evite QUALQUER exercício que cause dor no ombro até avaliação. Melhor perder 1 semana de treino que 6 meses de reabilitação.' },
        { user: 'Roberto Costa', content: 'Bruno, como ortopedista: essa apresentação merece ultrassom de ombro. Pode ser desde uma bursite simples até lesão parcial do supraespinal. Não force.' },
        { user: 'Juliana Rocha', content: 'Enquanto espera consulta: movimente o ombro SEM CARGA. Pendular (braço relaxado em círculos) ajuda a manter mobilidade sem agravar.' },
        { user: 'Carlos Souza', content: 'Bruno, quando voltar: revise a técnica do supino. Retrair escapulas + não descer a barra no pescoço. 90% das lesões de ombro no supino são técnica.' },
      ]
    },
    {
      title: 'Joelho estrala no agachamento: normal?',
      posts: [
        { user: 'Maria Santos', content: 'Meu joelho direito estrala TODA vez que agacho. Sem dor, mas o barulho me assusta. É pra preocupar?' },
        { ia: true, content: 'Crepitação (estalo) SEM dor geralmente é benigna: bolhas de gás sinovial, tendões deslizando, ou superfícies cartilaginosas articulando. Preocupe-se SE: 1) Vier acompanhada de dor, 2) Causar inchaço, 3) Limitar movimento, 4) Piorar progressivamente. Se apenas estala sem outros sintomas, continue treinando normalmente. Monitore: anote se muda de padrão. Uma dica: aqueça com 5min de bike antes de agachar.' },
        { user: 'Roberto Costa', content: 'Maria, estalo sem dor = provavelmente normal. O joelho é a articulação mais "barulhenta" do corpo. Eu como médico só investigo se houver dor ou derrame articular.' },
        { user: 'Gustavo Pereira', content: 'Meu joelho estala há 15 anos. Agacho 180kg. Zero problema. O corpo faz barulho, é normal!' },
      ]
    },
    {
      title: 'Formigamento no braço durante treino',
      posts: [
        { user: 'Pedro Alves', content: 'Sinto formigamento no braço esquerdo quando faço desenvolvimento acima da cabeça. Começa no ombro e vai até a mão. Devo parar?' },
        { ia: true, content: 'Formigamento que irradia do ombro até a mão durante exercício overhead é sinal de alerta para compressão neural. Possíveis causas: 1) Síndrome do desfiladeiro torácico (compressão entre clavícula e 1ª costela), 2) Compressão de raiz cervical (C5-C7), 3) Compressão do plexo braquial. PARE o exercício que causa o sintoma e procure um ortopedista ou neurologista. Formigamento = nervo = não ignore.' },
        { user: 'Roberto Costa', content: 'Pedro, formigamento em padrão ombro para mão é dermátomo cervical. Precisa de avaliação. Pode ser apenas postura no exercício, mas pode ser algo mais sério. Não adie.' },
        { user: 'Juliana Rocha', content: 'Enquanto espera avaliação: substitua overhead por elevação lateral (abaixo de 90 graus). Teste se o formigamento aparece.' },
      ]
    },
  ],

  'aspiracional-estetica': [
    {
      title: 'Lipo ou emagrecimento natural primeiro?',
      posts: [
        { user: 'Beatriz Gomes', content: 'Tenho gordura localizada na barriga que não sai com dieta. Já perdi 12kg mas a barriga persiste. Minha médica sugeriu lipo. Devo tentar mais tempo natural ou partir pra cirurgia?' },
        { ia: true, content: 'Questão que merece reflexão cuidadosa. Pontos a considerar: 1) Gordura localizada resistente APÓS emagrecimento significativo pode ser candidata a procedimento, 2) Verifique se está em peso estável há pelo menos 6 meses, 3) Lipo NÃO é emagrecimento - é modelagem, 4) Sem mudança de hábitos, a gordura pode voltar em outros lugares. Perguntas importantes: seu IMC atual é saudável? Você mantém treino de força? A decisão é estética ou funcional?' },
        { user: 'Roberto Costa', content: 'Como médico: lipo em paciente que já emagreceu e treina é MUITO diferente de lipo como "atalho". No primeiro caso, resultados são melhores e mais duráveis. Mas estabilize peso primeiro.' },
        { user: 'Amanda Pires', content: 'Fiz lipo na barriga há 2 anos, APÓS perder 20kg naturalmente. Melhor decisão. Mas só porque já tinha os hábitos consolidados.' },
        { user: 'Ana Silva', content: 'Beatriz, verifique também se não é diástase (separação dos músculos abdominais). É comum após emagrecimento e causa barriga saliente que NÃO resolve com dieta. Fisio pode avaliar.' },
      ]
    },
    {
      title: 'Harmonização facial e autoestima',
      posts: [
        { user: 'Larissa Campos', content: 'Estou considerando harmonização facial (preenchimento labial + malar). Meu namorado diz que não preciso. Mas EU quero. Isso é vaidade ruim ou autocuidado?' },
        { ia: true, content: 'A motivação é o que importa. Se a decisão é SUA (não de terceiros ou de Instagram), se é algo que te incomoda genuinamente, e se você tem expectativas realistas = autocuidado válido. Sinais de alerta: 1) Fazer pra agradar alguém, 2) Nunca estar satisfeita (sempre quer "mais um"), 3) Comparação constante com filtros. Conselho: consulte 2-3 profissionais antes, pergunte sobre riscos, e tenha pelo menos 30 dias entre a decisão e o procedimento (evita impulso).' },
        { user: 'Fernanda Dias', content: 'Fiz preenchimento labial. Gostei muito. Dica: comece SUTIL. Sempre dá pra colocar mais, tirar é mais difícil.' },
        { user: 'Renata Moura', content: 'Larissa, a opinião do namorado é irrelevante. É SEU rosto, SUA decisão. Se te faz sentir bem E você pesquisou bem, vá em frente.' },
      ]
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// GERADOR SQL
// ═══════════════════════════════════════════════════════════════

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

function randomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function generateSQL(): string {
  const lines: string[] = [];

  lines.push('-- ═══════════════════════════════════════════════════════════════');
  lines.push('-- SEED DE CONVERSAS REALISTAS - Gerado automaticamente');
  lines.push('-- Execute no Supabase SQL Editor');
  lines.push('-- ═══════════════════════════════════════════════════════════════');
  lines.push('');

  // 1. Criar usuários mock
  lines.push('-- PASSO 1: Criar usuários mock');
  lines.push('');

  for (const u of MOCK_USERS) {
    lines.push(`INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")`);
    lines.push(`VALUES (gen_random_uuid(), '${esc(u.email)}', '${esc(u.name)}', 'mock-password-hash', 'USER', NOW(), NOW())`);
    lines.push(`ON CONFLICT (email) DO NOTHING;`);
    lines.push('');
  }

  // IA Facilitadora user
  lines.push(`INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")`);
  lines.push(`VALUES (gen_random_uuid(), '${esc(IA_USER_EMAIL)}', 'IA Facilitadora', 'mock-password-hash', 'ADMIN', NOW(), NOW())`);
  lines.push(`ON CONFLICT (email) DO NOTHING;`);
  lines.push('');

  // 2. DO block para inserir posts e comments
  lines.push('-- PASSO 2: Inserir posts e comentários');
  lines.push('DO $$');
  lines.push('DECLARE');
  lines.push('  v_arena_id TEXT;');
  lines.push('  v_user_id TEXT;');
  lines.push('  v_ia_user_id TEXT;');
  lines.push('  v_post_id TEXT;');
  lines.push('  v_post_date TIMESTAMP;');
  lines.push('  v_comment_date TIMESTAMP;');
  lines.push('  v_post_count INT;');
  lines.push('  v_comment_count INT;');
  lines.push('BEGIN');
  lines.push('');
  lines.push(`  -- Buscar ID da IA`);
  lines.push(`  SELECT id INTO v_ia_user_id FROM "User" WHERE email = '${esc(IA_USER_EMAIL)}' LIMIT 1;`);
  lines.push(`  IF v_ia_user_id IS NULL THEN`);
  lines.push(`    SELECT id INTO v_ia_user_id FROM "User" WHERE email = 'ana.silva@mock.com' LIMIT 1;`);
  lines.push(`  END IF;`);
  lines.push('');

  let totalPosts = 0;
  let totalComments = 0;

  for (const [slug, threads] of Object.entries(ARENA_CONVERSATIONS)) {
    lines.push(`  -- ════════════════════════════════════════`);
    lines.push(`  -- Arena: ${slug}`);
    lines.push(`  -- ════════════════════════════════════════`);
    lines.push(`  SELECT id INTO v_arena_id FROM "Arena" WHERE slug = '${esc(slug)}' AND "isActive" = true LIMIT 1;`);
    lines.push(`  IF v_arena_id IS NOT NULL THEN`);
    lines.push(`    RAISE NOTICE 'Populando arena: ${esc(slug)}';`);
    lines.push('');

    threads.forEach((thread, tIdx) => {
      const posts = thread.posts;
      if (posts.length === 0) return;

      const firstPost = posts[0];
      const firstUserEmail = firstPost.user
        ? MOCK_USERS.find(u => u.name === firstPost.user)?.email || 'ana.silva@mock.com'
        : 'ana.silva@mock.com';

      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const hoursAgo = Math.floor(Math.random() * 24);

      lines.push(`    -- Thread ${tIdx + 1}: ${esc(thread.title)}`);
      lines.push(`    v_post_date := NOW() - INTERVAL '${daysAgo} days' - INTERVAL '${hoursAgo} hours';`);
      lines.push(`    SELECT id INTO v_user_id FROM "User" WHERE email = '${esc(firstUserEmail)}' LIMIT 1;`);
      lines.push(`    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;`);
      lines.push('');
      lines.push(`    INSERT INTO "Post" (id, "arenaId", "userId", content, "isAIResponse", "avatarInitialsColor", "commentCount", "createdAt", "updatedAt")`);
      lines.push(`    VALUES (gen_random_uuid(), v_arena_id, v_user_id, '${esc(`**${thread.title}**\n\n${firstPost.content}`)}', false, '${randomColor()}', ${posts.length - 1}, v_post_date, v_post_date)`);
      lines.push(`    RETURNING id INTO v_post_id;`);
      lines.push('');
      totalPosts++;

      // Comments (posts 1..n)
      for (let c = 1; c < posts.length; c++) {
        const cp = posts[c];
        const isIA = !!cp.ia;
        const commentUserEmail = isIA
          ? IA_USER_EMAIL
          : (cp.user ? MOCK_USERS.find(u => u.name === cp.user)?.email || 'ana.silva@mock.com' : 'ana.silva@mock.com');

        const commentHoursLater = c * (1 + Math.floor(Math.random() * 3));

        lines.push(`    v_comment_date := v_post_date + INTERVAL '${commentHoursLater} hours';`);
        if (isIA) {
          lines.push(`    v_user_id := v_ia_user_id;`);
        } else {
          lines.push(`    SELECT id INTO v_user_id FROM "User" WHERE email = '${esc(commentUserEmail)}' LIMIT 1;`);
          lines.push(`    IF v_user_id IS NULL THEN v_user_id := v_ia_user_id; END IF;`);
        }
        lines.push(`    INSERT INTO "Comment" (id, "postId", "userId", content, "isAIResponse", "avatarInitialsColor", "createdAt", "updatedAt")`);
        lines.push(`    VALUES (gen_random_uuid(), v_post_id, v_user_id, '${esc(cp.content)}', ${isIA}, '${randomColor()}', v_comment_date, v_comment_date);`);
        lines.push('');
        totalComments++;
      }
    });

    // Update arena counters
    lines.push(`    -- Atualizar contadores da arena`);
    lines.push(`    SELECT COUNT(*) INTO v_post_count FROM "Post" WHERE "arenaId" = v_arena_id;`);
    lines.push(`    SELECT COUNT(*) INTO v_comment_count FROM "Comment" c JOIN "Post" p ON c."postId" = p.id WHERE p."arenaId" = v_arena_id;`);
    lines.push(`    UPDATE "Arena" SET "totalPosts" = v_post_count, "totalComments" = v_comment_count WHERE id = v_arena_id;`);
    lines.push('');
    lines.push(`  ELSE`);
    lines.push(`    RAISE NOTICE 'Arena nao encontrada: ${esc(slug)}';`);
    lines.push(`  END IF;`);
    lines.push('');
  }

  lines.push(`  RAISE NOTICE 'SEED COMPLETO! ${totalPosts} posts + ${totalComments} comentarios inseridos.';`);
  lines.push('END $$;');
  lines.push('');

  // 3. Relatório
  lines.push('-- PASSO 3: Verificar resultado');
  lines.push(`SELECT a.slug, a.name, a."totalPosts", a."totalComments"`);
  lines.push(`FROM "Arena" a`);
  lines.push(`WHERE a."isActive" = true`);
  lines.push(`ORDER BY a."totalPosts" DESC;`);

  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

const sql = generateSQL();
const outPath = path.join(__dirname, 'seed-conversations.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log(`SQL gerado: ${outPath}`);
console.log(`Tamanho: ${(sql.length / 1024).toFixed(1)} KB`);
console.log(`\nPróximo passo: copie o conteúdo do arquivo e cole no Supabase SQL Editor`);
console.log(`https://supabase.com/dashboard/project/qducbqhuwqdyqioqevle/editor`);
