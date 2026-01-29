'use client';

/**
 * PAINEL VIVO - Comunidade Individual
 *
 * Visual: Feed contínuo estilo aeroporto/bolsa de valores
 * Leitura sem cliques - fluxo contínuo de mensagens
 * Estética: Premium Cyberpunk - Cyan (#00f5ff) + Magenta (#ff006e) + Purple (#8b5cf6)
 *
 * IMPORTANTE: Header e Footer são renderizados GLOBALMENTE via providers.tsx
 * Esta página contém APENAS o conteúdo específico.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Bot,
  Sparkles,
  MessageSquare,
  Users,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { UserAvatar } from '@/app/components/comunidades/UserAvatar';
import { useLoginRequiredModal } from '@/app/components/comunidades/LoginRequiredModal';
import { useComunidadesAuth } from '@/app/components/comunidades/ComunidadesAuthContext';
import type { GalleryImage } from '@/app/components/comunidades/ImageGallery';
import { ImagePreview } from '@/hooks/useImageUpload';

// ========================================
// DYNAMIC IMPORTS (Bundle Optimization)
// Economia estimada: ~55KB do bundle inicial
// ========================================

// SmartFAB removido - input fixo no rodapé é suficiente

const LoginRequiredModal = dynamic(
  () => import('@/app/components/comunidades/LoginRequiredModal').then(mod => ({ default: mod.default })),
  { ssr: false }
);

const ComposeBox = dynamic(() => import('@/app/components/comunidades/ComposeBox'), {
  ssr: false,
  loading: () => <div className="h-24 bg-zinc-900/50 rounded-xl animate-pulse" />,
});

const ImageGallery = dynamic(() => import('@/app/components/comunidades/ImageGallery'), {
  ssr: false,
});

const ReactionPicker = dynamic(() => import('@/app/components/comunidades/ReactionPicker'), {
  ssr: false,
});

const FavoriteButton = dynamic(() => import('@/app/components/comunidades/FavoriteButton'), {
  ssr: false,
});

const IAPerguntaDoDia = dynamic(
  () => import('@/app/components/comunidades/IAInsights').then(mod => ({ default: mod.IAPerguntaDoDia })),
  { ssr: false }
);

// ========================================
// LIB IMPORTS
// ========================================
import { getPerguntaDoDia, getFaseAtual } from '@/lib/ia';
import { useIAFacilitadora } from '@/hooks/useIAFacilitadora';

// ========================================
// TIPOS
// ========================================

interface Mensagem {
  id: string;
  tipo: 'usuario' | 'ia';
  timestamp: string;
  autor: {
    id: string;
    nome: string;
    avatar?: string;
    is_premium?: boolean;
    is_founder?: boolean;
  };
  conteudo: string;
  ia_tipo?: 'resumo' | 'insight' | 'pergunta' | 'destaque';
  isNew?: boolean;
  imagens?: GalleryImage[];
}

interface ComunidadeData {
  titulo: string;
  descricao: string;
  membrosOnline: number;
  totalMensagens: number;
}

// ========================================
// DADOS MOCK - MENSAGENS DO FEED
// ========================================

const MENSAGENS_LIPEDEMA: Mensagem[] = [
  {
    id: '1',
    tipo: 'usuario',
    timestamp: '14:32',
    autor: { id: 'maria-silva', nome: 'Maria Silva', is_premium: true },
    conteudo: 'Comecei a dieta anti-inflamatória há 3 semanas e já sinto diferença no inchaço das pernas. Eliminei processados, aumentei ômega-3 e vegetais crucíferos.',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '14:33',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Em que momento do dia você sente mais dor, peso ou sensibilidade nas pernas?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '14:35',
    autor: { id: 'ana-costa', nome: 'Ana Costa' },
    conteudo: 'Maria, você sentiu diferença na dor também? Eu estou na segunda semana e a dor ainda está forte.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '14:38',
    autor: { id: 'maria-silva', nome: 'Maria Silva', is_premium: true },
    conteudo: 'Ana, a dor demorou mais pra melhorar. Por volta da semana 4-5 que percebi diferença real. Paciência!',
  },
  {
    id: '5',
    tipo: 'usuario',
    timestamp: '14:42',
    autor: { id: 'juliana-santos', nome: 'Juliana Santos' },
    conteudo: 'Alguém aqui faz drenagem linfática? Minha médica indicou junto com a dieta.',
  },
  {
    id: '6',
    tipo: 'ia',
    timestamp: '14:43',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'RESUMO DO PAINEL: 47 membros online discutindo dieta anti-inflamatória e drenagem linfática.',
    ia_tipo: 'resumo',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '14:47',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', is_founder: true },
    conteudo: 'Ótima discussão! A drenagem manual por profissional capacitado é diferente de aparelhos.',
  },
];

const MENSAGENS_DEFICIT_CALORICO: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '10:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que mais dificulta manter o déficit calórico hoje para você?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '10:05',
    autor: { id: 'lucas-mendes', nome: 'Lucas Mendes', is_premium: true },
    conteudo: 'Finais de semana são meu maior desafio. Durante a semana consigo manter, mas sábado e domingo desanda tudo.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '10:12',
    autor: { id: 'camila-rocha', nome: 'Camila Rocha' },
    conteudo: 'Lucas, eu também! Especialmente quando tem social. Almoço em família, churrasco... impossível manter.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '10:18',
    autor: { id: 'rafael-costa', nome: 'Rafael Costa', is_premium: true },
    conteudo: 'Minha estratégia: durante a semana fico em déficit maior. Fim de semana como na manutenção. Na média, ainda funciona.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '10:20',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'INSIGHT: 89 membros online. Tema mais discutido hoje: estratégias para finais de semana.',
    ia_tipo: 'insight',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '10:25',
    autor: { id: 'ana-beatriz', nome: 'Ana Beatriz', is_founder: true },
    conteudo: 'Gente, lembrem: déficit é média semanal, não diária. Se sábado passou um pouco, ajusta domingo. Não precisa desespero.',
  },
];

const MENSAGENS_TREINO_GLUTEO: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '08:30',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Você sente mais o glúteo treinando com carga alta ou com mais repetições?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '08:35',
    autor: { id: 'jessica-lima', nome: 'Jéssica Lima', is_premium: true },
    conteudo: 'Carga alta com certeza! Hip thrust pesado é o que mais sinto no dia seguinte.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '08:42',
    autor: { id: 'bruna-santos', nome: 'Bruna Santos' },
    conteudo: 'Eu prefiro repetições altas. Carga muito alta meu quadríceps rouba. Com mais reps consigo isolar melhor.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '08:50',
    autor: { id: 'patricia-alves', nome: 'Patricia Alves', is_founder: true },
    conteudo: 'Depende da fase do treino! Hipertrofia: 8-12 reps com carga moderada-alta. Metabólico: 15-20 reps mais leves. Variar é importante.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '08:52',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'DESTAQUE: Patricia (Founder) comentou sobre periodização. 124 membros online discutindo.',
    ia_tipo: 'destaque',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '09:00',
    autor: { id: 'marina-costa', nome: 'Marina Costa', is_premium: true },
    conteudo: 'Patricia, e a frequência? Treino glúteo 3x/semana, será que é muito?',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '09:08',
    autor: { id: 'patricia-alves', nome: 'Patricia Alves', is_founder: true },
    conteudo: 'Marina, pode funcionar se a intensidade for bem distribuída. 2 dias pesados + 1 leve de ativação. Mas presta atenção na recuperação!',
  },
];

const MENSAGENS_CANETAS: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '13:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que mais mudou no seu corpo ou apetite desde que começou a usar?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '13:15',
    autor: { id: 'joao-pedro', nome: 'João Pedro', is_premium: true },
    conteudo: 'Semana 3 com Ozempic 0.5mg. A náusea diminuiu bastante. Refeições menores e mais frequentes ajudam.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '13:22',
    autor: { id: 'amanda-silva', nome: 'Amanda Silva', is_premium: true },
    conteudo: 'João, você teve constipação? É o que mais me incomoda.',
  },
  {
    id: '4',
    tipo: 'ia',
    timestamp: '13:23',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'INSIGHT: Constipação afeta ~30% dos usuários. Estratégias: fibras (25-30g/dia), hidratação (2.5-3L).',
    ia_tipo: 'insight',
  },
  {
    id: '5',
    tipo: 'usuario',
    timestamp: '13:35',
    autor: { id: 'dr-ricardo', nome: 'Dr. Ricardo', is_founder: true },
    conteudo: 'LEMBRETE: Antes de iniciar - exames completos, acompanhamento médico. Nunca use sem prescrição.',
  },
  {
    id: '6',
    tipo: 'ia',
    timestamp: '13:36',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'DESTAQUE: Dr. Ricardo (Founder) sobre segurança e acompanhamento médico.',
    ia_tipo: 'destaque',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '13:42',
    autor: { id: 'carlos-mendes', nome: 'Carlos Mendes' },
    conteudo: 'Alguém migrou de Ozempic pra Mounjaro? Meu médico sugeriu pela maior eficácia.',
  },
];

const MENSAGENS_ODEIA_TREINAR: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '11:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Qual tipo de exercício você consegue manter por mais tempo sem desistir?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '11:08',
    autor: { id: 'renata-dias', nome: 'Renata Dias' },
    conteudo: 'Caminhada! Academia eu largo em 1 mês, mas caminhada de manhã consigo manter há 8 meses.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '11:15',
    autor: { id: 'pedro-santos', nome: 'Pedro Santos', is_premium: true },
    conteudo: 'Pra mim é natação. Academia me dá preguiça, mas piscina eu amo. Vou 3x por semana.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '11:22',
    autor: { id: 'isabela-ferreira', nome: 'Isabela Ferreira' },
    conteudo: 'Dança! Fiz aulas de zumba e foi a primeira vez que mantive exercício por mais de 2 meses.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '11:25',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'RESUMO: 56 membros online. Atividades mais citadas: caminhada, natação, dança. Padrão: exercícios ao ar livre ou em grupo têm maior adesão.',
    ia_tipo: 'resumo',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '11:32',
    autor: { id: 'marcos-oliveira', nome: 'Marcos Oliveira', is_founder: true },
    conteudo: 'O melhor exercício é o que você faz! Se academia não funciona, ok. Movimento é movimento.',
  },
];

const MENSAGENS_ANSIEDADE: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '20:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Em quais situações você percebe que come mais por emoção do que por fome?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '20:12',
    autor: { id: 'carolina-martins', nome: 'Carolina Martins', is_premium: true },
    conteudo: 'À noite, depois de um dia estressante no trabalho. É como se precisasse de uma "recompensa".',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '20:18',
    autor: { id: 'felipe-gomes', nome: 'Felipe Gomes' },
    conteudo: 'Quando estou entediado. Final de semana em casa = atacando a geladeira.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '20:25',
    autor: { id: 'mariana-costa', nome: 'Mariana Costa', is_premium: true },
    conteudo: 'Carolina, também! Descobri que se eu tomo um banho quente ou vejo um episódio de série, a vontade passa. O cérebro só quer dopamina.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '20:27',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'INSIGHT: 91 membros compartilhando. Padrões identificados: estresse, tédio, busca por recompensa.',
    ia_tipo: 'insight',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '20:35',
    autor: { id: 'dra-lucia', nome: 'Dra. Lucia', is_founder: true },
    conteudo: 'Identificar o gatilho já é metade da batalha. O próximo passo é criar estratégias alternativas pra cada situação.',
  },
];

const MENSAGENS_35_MAIS: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '15:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que você sente que mudou no seu corpo em relação a antes dos 30?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '15:10',
    autor: { id: 'sandra-lima', nome: 'Sandra Lima', is_premium: true },
    conteudo: 'O peso fica muito mais difícil de perder. Antes bastava cortar refrigerante, agora preciso de muito mais esforço.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '15:18',
    autor: { id: 'cristina-rocha', nome: 'Cristina Rocha', is_premium: true },
    conteudo: 'Gordura localizada na barriga que não existia! Antes engordava por igual, agora vai tudo pro abdômen.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '15:25',
    autor: { id: 'paula-santos', nome: 'Paula Santos' },
    conteudo: 'Pra mim foi a recuperação. Depois de um final de semana "livre", leva a semana inteira pra voltar ao peso anterior.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '15:28',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'RESUMO: 62 membros online. Principais queixas: metabolismo mais lento, gordura localizada, recuperação demorada.',
    ia_tipo: 'resumo',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '15:35',
    autor: { id: 'dra-monica', nome: 'Dra. Mônica', is_founder: true },
    conteudo: 'Depois dos 35, musculação vira prioridade. Massa muscular = metabolismo. Não é só cardio que resolve.',
  },
];

const MENSAGENS_ANTES_DEPOIS: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '09:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Qual foi o maior desafio no seu processo até agora?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '09:15',
    autor: { id: 'tatiana-alves', nome: 'Tatiana Alves', is_premium: true },
    conteudo: '8 meses de processo! O maior desafio foi aceitar que não é linear. Teve meses que o peso não mudou nada.',
    imagens: [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
        metadata: { is_before: true },
      },
      {
        url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop',
        metadata: { is_after: true },
      },
    ],
  },
  {
    id: '3',
    tipo: 'ia',
    timestamp: '09:16',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'DESTAQUE: Tatiana compartilhou transformação de 8 meses com fotos. 108 membros online.',
    ia_tipo: 'destaque',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '09:25',
    autor: { id: 'jorge-mendes', nome: 'Jorge Mendes' },
    conteudo: 'Tatiana, incrível! Quanto perdeu no total? E qual foi a estratégia principal?',
  },
  {
    id: '5',
    tipo: 'usuario',
    timestamp: '09:32',
    autor: { id: 'tatiana-alves', nome: 'Tatiana Alves', is_premium: true },
    conteudo: 'Jorge, 18kg! Déficit moderado + musculação 4x/semana. Nada radical, só constância.',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '09:40',
    autor: { id: 'andre-coach', nome: 'André Coach', is_founder: true },
    conteudo: 'Tatiana é exemplo de que processo > resultado. As fotos são consequência do compromisso diário.',
  },
];

const MENSAGENS_TREINO_CASA: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '07:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Qual exercício de casa você sente que dá mais resultado pra você?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '07:12',
    autor: { id: 'fernanda-lima', nome: 'Fernanda Lima', is_premium: true },
    conteudo: 'Hip thrust no chão com elástico! Sinto mais que na academia. O Bret ensina a técnica certinha no ebook.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '07:18',
    autor: { id: 'patricia-rocha', nome: 'Patricia Rocha' },
    conteudo: 'Fernanda, você faz com os pés elevados ou no chão? Tenho dúvida se faz diferença.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '07:25',
    autor: { id: 'fernanda-lima', nome: 'Fernanda Lima', is_premium: true },
    conteudo: 'Patricia, pés elevados no sofá ativa mais! No ebook do Bret tem a explicação biomecânica. Maior amplitude = mais ativação.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '07:27',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'INSIGHT: 78 membros online. Exercício mais citado hoje: hip thrust no chão com variações.',
    ia_tipo: 'insight',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '07:35',
    autor: { id: 'amanda-costa', nome: 'Amanda Costa', is_premium: true },
    conteudo: 'Agachamento búlgaro com mochila de livros! Parece besteira mas com 10kg já fica pesado. Zero custo.',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '07:42',
    autor: { id: 'carla-mendes', nome: 'Carla Mendes' },
    conteudo: 'Amanda, genial a ideia da mochila! Aqui não tenho halter nenhum, vou testar.',
  },
  {
    id: '8',
    tipo: 'usuario',
    timestamp: '07:50',
    autor: { id: 'coach-bret', nome: 'Coach Bret', is_founder: true },
    conteudo: 'Dica: progressão em casa é sobre TEMPO SOB TENSÃO. Desça em 3s, suba em 1s. Mesmo exercício fica 2x mais intenso.',
  },
  {
    id: '9',
    tipo: 'ia',
    timestamp: '07:51',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'DESTAQUE: Coach Bret (Founder) sobre tempo sob tensão. Técnica fundamental para progressão em casa.',
    ia_tipo: 'destaque',
  },
  {
    id: '10',
    tipo: 'usuario',
    timestamp: '08:00',
    autor: { id: 'julia-santos', nome: 'Julia Santos' },
    conteudo: 'E pra quem não tem elástico? Dá pra fazer algo eficiente só com peso do corpo?',
  },
  {
    id: '11',
    tipo: 'usuario',
    timestamp: '08:08',
    autor: { id: 'coach-bret', nome: 'Coach Bret', is_founder: true },
    conteudo: 'Julia, claro! Frog pump, single leg glute bridge, quadruped hip extension. Todos no ebook. Sem equipamento nenhum, resultado garantido.',
  },
];

const MENSAGENS_DIETA_VIDA_REAL: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '12:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que mais te desmotiva a seguir uma dieta elaborada?',
    ia_tipo: 'pergunta',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '12:08',
    autor: { id: 'ricardo-silva', nome: 'Ricardo Silva', is_premium: true },
    conteudo: 'A rigidez. Toda dieta parece que foi feita pra alguém que não trabalha, não tem vida social, não tem estresse.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '12:15',
    autor: { id: 'juliana-costa', nome: 'Juliana Costa' },
    conteudo: 'Preparar as marmitas! No papel parece fácil, na prática é mais uma tarefa numa vida já cheia de tarefas.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '12:22',
    autor: { id: 'marcelo-rocha', nome: 'Marcelo Rocha', is_premium: true },
    conteudo: 'Juliana, exato! Eu tenho a dieta perfeita no papel há 3 meses. Segui talvez 30% dela.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '12:25',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'RESUMO: 187 membros online. Principais barreiras: rigidez excessiva, falta de tempo, distância da rotina real.',
    ia_tipo: 'resumo',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '12:32',
    autor: { id: 'dra-helena', nome: 'Dra. Helena', is_founder: true },
    conteudo: 'A melhor dieta é a que você consegue seguir. Prefiro um plano 70% "perfeito" seguido 100% do tempo do que um 100% seguido 30%.',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '12:40',
    autor: { id: 'fernanda-dias', nome: 'Fernanda Dias', is_premium: true },
    conteudo: 'Dra. Helena, tem alguma estratégia pra simplificar? Tipo, versão "mínimo viável" de uma dieta?',
  },
  {
    id: '8',
    tipo: 'usuario',
    timestamp: '12:48',
    autor: { id: 'dra-helena', nome: 'Dra. Helena', is_founder: true },
    conteudo: 'Fernanda, sim! 1) Proteína em toda refeição. 2) Vegetais em 2 refeições. 3) Não repetir carboidrato processado. Só isso já muda muito.',
  },
];

// ========================================
// DADOS DAS COMUNIDADES (9 COMUNIDADES - FASE 1)
// ========================================

const COMUNIDADES_DATA: Record<string, ComunidadeData & { mensagens: Mensagem[] }> = {
  lipedema: {
    titulo: 'Protocolo Lipedema',
    descricao: 'Espaço para mulheres que convivem com lipedema',
    membrosOnline: 47,
    totalMensagens: 1842,
    mensagens: MENSAGENS_LIPEDEMA,
  },
  'deficit-calorico': {
    titulo: 'Déficit Calórico na Vida Real',
    descricao: 'Nem sempre o déficit funciona como nos cálculos',
    membrosOnline: 89,
    totalMensagens: 3156,
    mensagens: MENSAGENS_DEFICIT_CALORICO,
  },
  'treino-gluteo': {
    titulo: 'Treino de Glúteo Feminino',
    descricao: 'Treino de glúteo com olhar feminino',
    membrosOnline: 124,
    totalMensagens: 4521,
    mensagens: MENSAGENS_TREINO_GLUTEO,
  },
  canetas: {
    titulo: 'Canetas Emagrecedoras',
    descricao: 'Ozempic, Wegovy, Mounjaro: relatos reais',
    membrosOnline: 73,
    totalMensagens: 2847,
    mensagens: MENSAGENS_CANETAS,
  },
  'odeia-treinar': {
    titulo: 'Exercício para Quem Odeia Treinar',
    descricao: 'Para quem quer resultado sem academia tradicional',
    membrosOnline: 56,
    totalMensagens: 1956,
    mensagens: MENSAGENS_ODEIA_TREINAR,
  },
  'ansiedade-alimentacao': {
    titulo: 'Ansiedade, Compulsão e Alimentação',
    descricao: 'Relação emocional com a comida, sem julgamento',
    membrosOnline: 91,
    totalMensagens: 3842,
    mensagens: MENSAGENS_ANSIEDADE,
  },
  'emagrecimento-35-mais': {
    titulo: 'Emagrecimento Feminino 35+',
    descricao: 'Mudanças hormonais e metabolismo após os 30-40',
    membrosOnline: 62,
    totalMensagens: 2156,
    mensagens: MENSAGENS_35_MAIS,
  },
  'antes-depois': {
    titulo: 'Antes e Depois — Processo Real',
    descricao: 'Mais do que fotos, histórias de transformação',
    membrosOnline: 108,
    totalMensagens: 5234,
    mensagens: MENSAGENS_ANTES_DEPOIS,
  },
  'dieta-vida-real': {
    titulo: 'Dieta na Vida Real',
    descricao: 'Dificuldade real de seguir dietas elaboradas',
    membrosOnline: 187,
    totalMensagens: 8745,
    mensagens: MENSAGENS_DIETA_VIDA_REAL,
  },
  'treino-casa': {
    titulo: 'Treino em Casa',
    descricao: 'Exercícios livres e com poucos acessórios',
    membrosOnline: 78,
    totalMensagens: 3247,
    mensagens: MENSAGENS_TREINO_CASA,
  },
};

// ========================================
// NOVAS MENSAGENS SIMULADAS (para animação)
// ========================================

const NOVAS_MENSAGENS: Record<string, Mensagem[]> = {
  lipedema: [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '15:01',
      autor: { id: 'lucia-ferreira', nome: 'Lucia Ferreira' },
      conteudo: 'Gente, acabei de descobrir que tenho lipedema estágio 2. Vocês podem me indicar por onde começar?',
      isNew: true,
    },
    {
      id: 'new-2',
      tipo: 'ia',
      timestamp: '15:02',
      autor: { id: 'ia', nome: 'IA Facilitadora' },
      conteudo: 'BEM-VINDA LUCIA! Leia as mensagens anteriores sobre dieta anti-inflamatória. 47 membros online prontos para ajudar.',
      ia_tipo: 'insight',
      isNew: true,
    },
  ],
  'deficit-calorico': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '10:35',
      autor: { id: 'gabriel-lima', nome: 'Gabriel Lima', is_premium: true },
      conteudo: 'Alguém aqui usa app pra contar calorias? MyFitnessPal tá cheio de bug ultimamente.',
      isNew: true,
    },
  ],
  'treino-gluteo': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '09:15',
      autor: { id: 'fernanda-lima', nome: 'Fernanda Lima' },
      conteudo: 'Elevação pélvica com barra ou com anilha? Qual vocês preferem?',
      isNew: true,
    },
  ],
  canetas: [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '14:02',
      autor: { id: 'bruno-santos', nome: 'Bruno Santos', is_premium: true },
      conteudo: 'Pessoal, alguém sabe se pode tomar creatina junto com Ozempic? Meu treino está sofrendo...',
      isNew: true,
    },
  ],
  'odeia-treinar': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '11:40',
      autor: { id: 'larissa-costa', nome: 'Larissa Costa' },
      conteudo: 'Descobri que bike na rua me motiva muito mais que na academia. Alguém mais?',
      isNew: true,
    },
  ],
  'ansiedade-alimentacao': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '20:45',
      autor: { id: 'roberto-silva', nome: 'Roberto Silva' },
      conteudo: 'Alguém aqui conseguiu parar de comer por ansiedade? Como vocês fizeram?',
      isNew: true,
    },
  ],
  'emagrecimento-35-mais': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '15:45',
      autor: { id: 'regina-alves', nome: 'Regina Alves', is_premium: true },
      conteudo: 'Alguém fez exames hormonais e descobriu algo que mudou tudo? Quais exames pediram?',
      isNew: true,
    },
  ],
  'antes-depois': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '09:50',
      autor: { id: 'miguel-santos', nome: 'Miguel Santos', is_premium: true },
      conteudo: 'Finalmente perdi 25kg em 1 ano! Sem pressa, sem dieta maluca. Só constância.',
      isNew: true,
    },
  ],
  'dieta-vida-real': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '12:55',
      autor: { id: 'carla-mendes', nome: 'Carla Mendes' },
      conteudo: 'Gente, como vocês lidam com viagem a trabalho? Minha dieta vai pro espaço toda vez.',
      isNew: true,
    },
  ],
  'treino-casa': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '08:15',
      autor: { id: 'raquel-ferreira', nome: 'Raquel Ferreira', is_premium: true },
      conteudo: 'Alguém tem sugestão de elástico bom pra comprar? Quero começar a usar mas não sei qual resistência escolher.',
      isNew: true,
    },
  ],
};

// ========================================
// COMPONENTE: Status Indicador
// ========================================

function StatusIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-2.5 h-2.5 rounded-full bg-[#00f5ff]" />
        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#00f5ff] animate-ping" />
      </div>
      <span className="text-xs font-mono text-[#00f5ff] uppercase tracking-wider font-bold">
        Painel Ativo
      </span>
    </div>
  );
}

// ========================================
// COMPONENTE: Avatar da Mensagem
// ========================================

function MensagemAvatar({ autor, isIA }: { autor: Mensagem['autor']; isIA: boolean }) {
  if (isIA) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#00f5ff] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
        <Bot className="w-5 h-5 text-white" />
      </div>
    );
  }

  return (
    <UserAvatar
      user={{
        id: autor.id,
        nome: autor.nome,
        email: '',
        avatar: autor.avatar,
        is_premium: autor.is_premium,
        is_founder: autor.is_founder,
      }}
      size="md"
    />
  );
}

// ========================================
// COMPONENTE: Mensagem do Feed
// ========================================

function MensagemItem({
  mensagem,
  isNew,
  communitySlug,
  onLoginRequired
}: {
  mensagem: Mensagem;
  isNew?: boolean;
  communitySlug: string;
  onLoginRequired?: () => void;
}) {
  const isIA = mensagem.tipo === 'ia';

  const iaColors = {
    resumo: 'from-[#8b5cf6]/20 to-[#8b5cf6]/5 border-[#8b5cf6]/50',
    insight: 'from-[#00f5ff]/20 to-[#00f5ff]/5 border-[#00f5ff]/50',
    pergunta: 'from-[#ff006e]/20 to-[#ff006e]/5 border-[#ff006e]/50',
    destaque: 'from-amber-500/20 to-amber-500/5 border-amber-500/50',
  };

  const iaTextColors = {
    resumo: 'text-[#8b5cf6]',
    insight: 'text-[#00f5ff]',
    pergunta: 'text-[#ff006e]',
    destaque: 'text-amber-300',
  };

  const iaGlow = {
    resumo: '0 0 30px rgba(139, 92, 246, 0.3)',
    insight: '0 0 30px rgba(0, 245, 255, 0.3)',
    pergunta: '0 0 30px rgba(255, 0, 110, 0.3)',
    destaque: '0 0 30px rgba(245, 158, 11, 0.3)',
  };

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3
        transition-all duration-500 ease-out
        ${isNew ? 'animate-slideDown bg-[#00f5ff]/5' : ''}
        ${isIA
          ? `bg-gradient-to-r ${iaColors[mensagem.ia_tipo || 'insight']} border-l-2`
          : 'hover:bg-zinc-900/50 border-l-2 border-transparent hover:border-zinc-700'
        }
      `}
      style={isIA ? { boxShadow: iaGlow[mensagem.ia_tipo || 'insight'] } : {}}
    >
      <div className="flex-shrink-0 w-12 pt-0.5">
        <span className="text-xs font-mono text-zinc-600">{mensagem.timestamp}</span>
      </div>

      <div className="flex-shrink-0">
        <MensagemAvatar autor={mensagem.autor} isIA={isIA} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`
              text-sm font-semibold
              ${isIA
                ? iaTextColors[mensagem.ia_tipo || 'insight']
                : 'text-white'
              }
            `}
          >
            {mensagem.autor.nome}
          </span>

          {isIA && (
            <span className="px-1.5 py-0.5 text-[10px] bg-purple-500/30 text-purple-300 rounded flex items-center gap-1 font-mono">
              <Sparkles className="w-2.5 h-2.5" />
              {mensagem.ia_tipo?.toUpperCase()}
            </span>
          )}

          {!isIA && mensagem.autor.is_founder && (
            <span className="px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded font-bold">
              FOUNDER
            </span>
          )}

          {!isIA && mensagem.autor.is_premium && !mensagem.autor.is_founder && (
            <span className="px-1.5 py-0.5 text-[10px] bg-purple-500/20 text-purple-400 rounded">
              Premium
            </span>
          )}
        </div>

        <p
          className={`
            text-sm leading-relaxed
            ${isIA ? iaTextColors[mensagem.ia_tipo || 'insight'] : 'text-zinc-300'}
          `}
        >
          {mensagem.conteudo}
        </p>

        {mensagem.imagens && mensagem.imagens.length > 0 && (
          <ImageGallery images={mensagem.imagens} />
        )}

        <div className="mt-2 pt-2">
          <ReactionPicker
            messageId={mensagem.id}
            communitySlug={communitySlug}
            onLoginRequired={onLoginRequired}
          />
        </div>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE: Indicador de Novas Mensagens
// ========================================

function NovasMensagensIndicator({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-24 left-1/2 -translate-x-1/2 z-40
        flex items-center gap-2
        px-4 py-2
        bg-zinc-900/95 backdrop-blur-md
        border border-[#00f5ff]/50
        rounded-full
        shadow-[0_0_20px_rgba(0,245,255,0.3)]
        hover:bg-zinc-800
        transition-all
        animate-bounce
      `}
    >
      <ChevronDown className="w-4 h-4 text-[#00f5ff]" />
      <span className="text-sm font-medium text-[#00f5ff]">
        {count} nova{count > 1 ? 's' : ''} mensagem{count > 1 ? 'ns' : ''}
      </span>
    </button>
  );
}

// ========================================
// COMPONENTE: Comunidade Não Encontrada
// ========================================

function ComunidadeNaoEncontrada({ slug }: { slug: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
      }}
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">
          Comunidade não encontrada
        </h1>
        <p className="text-zinc-400 mb-6">
          A comunidade <span className="text-[#00f5ff] font-mono">&quot;{slug}&quot;</span> não existe ou foi removida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00f5ff] to-[#00b8c4] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] text-black font-semibold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Arenas
        </Link>
      </div>
    </div>
  );
}

// ========================================
// PÁGINA PRINCIPAL - PAINEL VIVO
// ========================================

// ========================================
// STORAGE KEY HELPER
// ========================================
const getStorageKey = (slug: string) => `nfc-comunidade-mensagens-${slug}`;

export default function PainelVivoPage() {
  // useParams é um hook de Client Component - seguro para usar aqui
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const { user, isAuthenticated } = useComunidadesAuth();
  const { isOpen, interactionType, openModal, closeModal } = useLoginRequiredModal();
  const { analisarConversa } = useIAFacilitadora();

  const [comunidade, setComunidade] = useState<(ComunidadeData & { mensagens: Mensagem[] }) | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novasMensagensCount, setNovasMensagensCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // Carregar dados da comunidade + mensagens salvas
  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    const data = COMUNIDADES_DATA[slug];
    if (data) {
      setComunidade(data);

      // Tentar carregar mensagens do localStorage
      try {
        const savedMessages = localStorage.getItem(getStorageKey(slug));
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages);
          // Mesclar mensagens mock com salvas (evitar duplicatas por ID)
          const mockIds = new Set(data.mensagens.map(m => m.id));
          const userMessages = parsed.filter((m: Mensagem) => !mockIds.has(m.id));
          setMensagens([...data.mensagens, ...userMessages]);
        } else {
          setMensagens(data.mensagens);
        }
      } catch {
        setMensagens(data.mensagens);
      }

      setNotFound(false);
    } else {
      setNotFound(true);
    }
    setIsLoading(false);
  }, [slug]);

  // Salvar mensagens do usuário no localStorage
  useEffect(() => {
    if (!slug || mensagens.length === 0) return;

    // Filtrar apenas mensagens do usuário (não mock)
    const mockData = COMUNIDADES_DATA[slug];
    if (!mockData) return;

    const mockIds = new Set(mockData.mensagens.map(m => m.id));
    const userMessages = mensagens.filter(m => !mockIds.has(m.id));

    if (userMessages.length > 0) {
      try {
        localStorage.setItem(getStorageKey(slug), JSON.stringify(userMessages));
      } catch (e) {
        console.error('Erro ao salvar mensagens:', e);
      }
    }
  }, [mensagens, slug]);

  // Simular chegada de novas mensagens
  useEffect(() => {
    if (!comunidade || !slug) return;

    const novasMensagens = NOVAS_MENSAGENS[slug] || [];
    let index = 0;

    const interval = setInterval(() => {
      if (index < novasMensagens.length) {
        setMensagens(prev => [...prev, { ...novasMensagens[index], isNew: true }]);

        if (!autoScroll) {
          setNovasMensagensCount(prev => prev + 1);
        }

        index++;
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [comunidade, slug, autoScroll]);

  // Auto-scroll para novas mensagens
  useEffect(() => {
    if (autoScroll && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [mensagens, autoScroll]);

  // Detectar se usuário scrollou para cima
  const handleScroll = () => {
    if (!feedRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    setAutoScroll(isAtBottom);
    if (isAtBottom) {
      setNovasMensagensCount(0);
    }
  };

  // Scrollar para o final
  const scrollToBottom = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setAutoScroll(true);
      setNovasMensagensCount(0);
    }
  };

  // Handler para responder
  const handleResponder = () => {
    if (!isAuthenticated) {
      openModal('responder');
    } else {
      scrollToBottom();
    }
  };

  // Handler para enviar mensagem
  const handleEnviarMensagem = async (message: string, images?: ImagePreview[]) => {
    if (!user) return;

    const galleryImages: GalleryImage[] | undefined = images?.map(img => ({
      url: img.previewUrl,
      metadata: img.metadata,
    }));

    const novaMensagem: Mensagem = {
      id: `user-${Date.now()}`,
      tipo: 'usuario',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      autor: {
        id: user.id,
        nome: user.nome,
        avatar: user.avatar,
        is_premium: user.is_premium,
        is_founder: user.is_founder,
      },
      conteudo: message,
      isNew: true,
      imagens: galleryImages,
    };

    setMensagens(prev => [...prev, novaMensagem]);

    // Verificar se é a primeira mensagem do usuário (boas-vindas)
    const isFirstMessage = !hasWelcomed;

    // Chamar IA para analisar e potencialmente responder
    try {
      // Converter mensagens para formato da IA
      const mensagensParaIA = [...mensagens, novaMensagem].slice(-10).map(m => ({
        id: m.id,
        texto: m.conteudo,
        autorId: m.autor.id,
        autorNome: m.autor.nome,
        isIA: m.tipo === 'ia',
        timestamp: new Date().toISOString(),
      }));

      const respostaIA = await analisarConversa(
        mensagensParaIA,
        comunidade?.titulo || '',
        slug
      );

      // Se a IA decidiu responder
      if (respostaIA) {
        const mensagemIA: Mensagem = {
          id: `ia-${Date.now()}`,
          tipo: 'ia',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          autor: { id: 'ia', nome: 'IA Facilitadora' },
          conteudo: respostaIA.texto,
          ia_tipo: respostaIA.tipo === 'blog' ? 'insight' :
                   respostaIA.tipo === 'correcao' ? 'destaque' : 'pergunta',
          isNew: true,
        };

        // Delay para parecer mais natural
        setTimeout(() => {
          setMensagens(prev => [...prev, mensagemIA]);
        }, 1500);
      } else if (isFirstMessage) {
        // Se é primeira mensagem e IA não respondeu, dar boas-vindas
        const boasVindas: Mensagem = {
          id: `ia-welcome-${Date.now()}`,
          tipo: 'ia',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          autor: { id: 'ia', nome: 'IA Facilitadora' },
          conteudo: `Bem-vinda à comunidade, ${user.nome}! 💜 Que bom ter você aqui. Fique à vontade para compartilhar suas experiências e tirar dúvidas. Estamos todas juntas nessa jornada!`,
          ia_tipo: 'insight',
          isNew: true,
        };

        setTimeout(() => {
          setMensagens(prev => [...prev, boasVindas]);
          setHasWelcomed(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Erro ao chamar IA:', error);
      // Se falhou mas é primeira mensagem, ainda dar boas-vindas
      if (isFirstMessage) {
        const boasVindas: Mensagem = {
          id: `ia-welcome-${Date.now()}`,
          tipo: 'ia',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          autor: { id: 'ia', nome: 'IA Facilitadora' },
          conteudo: `Bem-vinda, ${user.nome}! 💜 Sua participação é muito importante para nossa comunidade. Compartilhe suas experiências!`,
          ia_tipo: 'insight',
          isNew: true,
        };

        setTimeout(() => {
          setMensagens(prev => [...prev, boasVindas]);
          setHasWelcomed(true);
        }, 1500);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
        }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00f5ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500 font-mono text-sm">Carregando painel...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound || !comunidade) {
    return <ComunidadeNaoEncontrada slug={slug} />;
  }

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#00f5ff] rounded-full filter blur-[150px] opacity-5" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#ff006e] rounded-full filter blur-[150px] opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#8b5cf6] rounded-full filter blur-[150px] opacity-5" />
      </div>

      {/* ===== BARRA DE INFO DA COMUNIDADE (Header global via providers.tsx) ===== */}
      <div className="flex-shrink-0 relative z-40">
        <div
          className="backdrop-blur-md border-b"
          style={{
            background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(10, 14, 39, 0.95) 100%)',
            borderColor: 'rgba(0, 245, 255, 0.1)',
          }}
        >
          {/* Top Bar */}
          <div className="border-b border-white/5">
            <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-[#00f5ff] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono">VOLTAR</span>
              </Link>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <div className="relative">
                    <Users className="w-3.5 h-3.5" />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </div>
                  <span className="font-mono text-emerald-400">{comunidade.membrosOnline}</span>
                  <span className="text-zinc-600">online</span>
                </div>

                <div className="w-[1px] h-3 bg-white/10" />

                <div className="flex items-center gap-1.5 text-zinc-500">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="font-mono">{comunidade.totalMensagens.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="mb-2">
                  <StatusIndicator />
                </div>
                <h1
                  className="text-xl sm:text-2xl font-black text-white tracking-tight"
                  style={{ textShadow: '0 0 30px rgba(0, 245, 255, 0.3)' }}
                >
                  {comunidade.titulo}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <FavoriteButton
                  type="comunidade"
                  slug={slug}
                  variant="icon"
                  onLoginRequired={() => openModal('favoritar')}
                />
                <div className="flex-shrink-0 hidden sm:flex items-center gap-2 px-3 py-2 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 rounded-lg">
                  <Bot className="w-4 h-4 text-[#8b5cf6]" />
                  <span className="text-xs text-[#8b5cf6] font-mono">IA Ativa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Bar */}
          <div className="h-0.5 bg-white/5 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-[#00f5ff]/50 to-transparent"
              style={{ animation: 'slideRight 2s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* ===== FEED CONTÍNUO ===== */}
      <main
        ref={feedRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
      >
        <div className="max-w-4xl mx-auto py-4">
          {/* Pergunta do Dia - IA Facilitadora */}
          <div className="px-4 mb-4">
            <IAPerguntaDoDia
              pergunta={getPerguntaDoDia()}
              fase={getFaseAtual()}
            />
          </div>

          <div className="space-y-0 divide-y divide-white/5">
            {mensagens.map((mensagem, index) => (
              <MensagemItem
                key={`${mensagem.id}-${index}`}
                mensagem={mensagem}
                isNew={mensagem.isNew}
                communitySlug={slug}
                onLoginRequired={() => openModal('reagir')}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 py-8">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white/10" />
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#00f5ff]" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00f5ff] animate-ping" />
            </div>
            <span className="text-xs font-mono text-zinc-500">ATUALIZANDO</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
      </main>

      {/* Compose Box */}
      <ComposeBox
        isAuthenticated={isAuthenticated}
        onSubmit={handleEnviarMensagem}
        onLoginRequired={() => openModal('responder')}
      />

      {/* Indicador de novas mensagens */}
      <NovasMensagensIndicator count={novasMensagensCount} onClick={scrollToBottom} />

      {/* Smart FAB removido - input fixo no rodapé é suficiente */}

      {/* Modal de Login Necessário */}
      <LoginRequiredModal
        isOpen={isOpen}
        onClose={closeModal}
        interactionType={interactionType}
      />

      {/* Animations */}
      <style jsx global>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(500%); }
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroGlow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
