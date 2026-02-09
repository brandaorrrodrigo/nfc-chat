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
import { isNFVArena, isNFVHub, isPremiumNFVArena, getPremiumArenaConfig } from '@/lib/biomechanics/nfv-config';

// NFV Dynamic Imports
const NFVHub = dynamic(() => import('@/components/nfv/NFVHub'), { ssr: false });
const VideoGallery = dynamic(() => import('@/components/nfv/VideoGallery'), { ssr: false });
const VideoUploadModal = dynamic(() => import('@/components/nfv/VideoUploadModal').then(mod => ({ default: mod.VideoUploadModal })), { ssr: false });
import {
  ArrowLeft,
  Bot,
  Sparkles,
  MessageSquare,
  Users,
  ChevronDown,
  AlertTriangle,
  Video,
  Upload,
  Activity,
} from 'lucide-react';
import { UserAvatar } from '@/app/components/comunidades/UserAvatar';
import { useLoginRequiredModal } from '@/app/components/comunidades/LoginRequiredModal';
import { useComunidadesAuth } from '@/app/components/comunidades/ComunidadesAuthContext';
import type { GalleryImage } from '@/app/components/comunidades/ImageGallery';
import { ImagePreview } from '@/hooks/useImageUpload';
import { useAIModerator, useCelebrations } from '@/hooks/useAIModerator';

// ========================================
// DYNAMIC IMPORTS (Bundle Optimization)
// Economia estimada: ~55KB do bundle inicial
// ========================================

// SmartFAB removido - input fixo no rodapé é suficiente

const CommunityBiomechanicsWidget = dynamic(
  () => import('@/components/biomechanics/CommunityBiomechanicsWidget'),
  { ssr: false }
);

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

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
  loading: () => <div className="animate-pulse">Carregando...</div>,
});

const IAPerguntaDoDia = dynamic(
  () => import('@/app/components/comunidades/IAInsights').then(mod => ({ default: mod.IAPerguntaDoDia })),
  { ssr: false }
);

const DicasFotoBiometrica = dynamic(
  () => import('@/app/components/comunidades/IAInsights').then(mod => ({ default: mod.DicasFotoBiometrica })),
  { ssr: false }
);

const MessageActions = dynamic(() => import('@/app/components/comunidades/MessageActions'), {
  ssr: false,
});

const EditableMessage = dynamic(() => import('@/app/components/comunidades/EditableMessage'), {
  ssr: false,
});

// ========================================
// LIB IMPORTS
// ========================================
import { getPerguntaDoDia, getFaseAtual } from '@/lib/ia';
import { useIAFacilitadora } from '@/hooks/useIAFacilitadora';
import { useFP } from '@/hooks/useFP';
import { useArenaStats } from '@/app/hooks/useArenaStats';
import { FP_CONFIG } from '@/lib/fp/config';
import { FPToastManager } from '@/components/chat/FPEarnedToast';
import { FPDisplayCompact } from '@/components/chat/FPDisplayCompact';

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
  // Campos para edição/exclusão
  createdAt?: string;
  isEdited?: boolean;
  editedAt?: string | null;
}

// ========================================
// AVATARES VARIADOS PARA USUÁRIOS MOCK
// ========================================

const AVATAR_STYLES = [
  'avataaars',
  'bottts',
  'fun-emoji',
  'pixel-art',
  'thumbs',
  'lorelei',
  'notionists',
  'big-smile',
];

const BACKGROUND_COLORS = [
  'b6e3f4', 'c0aede', 'ffd5dc', 'd1d4f9',
  'ffdfbf', 'c7ecee', 'ffeaa7', 'dfe6e9',
];

const MOCK_USER_AVATARS: Record<string, string> = {
  'amanda-costa': `https://api.dicebear.com/7.x/lorelei/svg?seed=amanda-costa-0&backgroundColor=b6e3f4&gender=female`,
  'amanda-silva': `https://api.dicebear.com/7.x/avataaars/svg?seed=amanda-silva-1&backgroundColor=c0aede`,
  'ana-beatriz': `https://api.dicebear.com/7.x/bottts/svg?seed=ana-beatriz-2&backgroundColor=ffd5dc`,
  'ana-costa': `https://api.dicebear.com/7.x/fun-emoji/svg?seed=ana-costa-3&backgroundColor=d1d4f9`,
  'andre-coach': `https://api.dicebear.com/7.x/pixel-art/svg?seed=andre-coach-4&backgroundColor=ffdfbf`,
  'bruna-santos': `https://api.dicebear.com/7.x/thumbs/svg?seed=bruna-santos-5&backgroundColor=c7ecee`,
  'bruno-santos': `https://api.dicebear.com/7.x/notionists/svg?seed=bruno-santos-6&backgroundColor=ffeaa7`,
  'camila-rocha': `https://api.dicebear.com/7.x/big-smile/svg?seed=camila-rocha-7&backgroundColor=dfe6e9`,
  'carla-mendes': `https://api.dicebear.com/7.x/lorelei/svg?seed=carla-mendes-8&backgroundColor=b6e3f4&gender=female`,
  'carlos-mendes': `https://api.dicebear.com/7.x/avataaars/svg?seed=carlos-mendes-9&backgroundColor=c0aede`,
  'carolina-martins': `https://api.dicebear.com/7.x/bottts/svg?seed=carolina-martins-10&backgroundColor=ffd5dc`,
  'coach-bret': `https://api.dicebear.com/7.x/fun-emoji/svg?seed=coach-bret-11&backgroundColor=d1d4f9`,
  'cristina-rocha': `https://api.dicebear.com/7.x/pixel-art/svg?seed=cristina-rocha-12&backgroundColor=ffdfbf`,
  'dr-carla': `https://api.dicebear.com/7.x/thumbs/svg?seed=dr-carla-13&backgroundColor=c7ecee`,
  'dr-lucas': `https://api.dicebear.com/7.x/notionists/svg?seed=dr-lucas-14&backgroundColor=ffeaa7`,
  'dr-marcus': `https://api.dicebear.com/7.x/big-smile/svg?seed=dr-marcus-15&backgroundColor=dfe6e9`,
  'dr-ricardo': `https://api.dicebear.com/7.x/lorelei/svg?seed=dr-ricardo-16&backgroundColor=b6e3f4`,
  'dra-helena': `https://api.dicebear.com/7.x/avataaars/svg?seed=dra-helena-17&backgroundColor=c0aede`,
  'dra-lucia': `https://api.dicebear.com/7.x/bottts/svg?seed=dra-lucia-18&backgroundColor=ffd5dc`,
  'dra-monica': `https://api.dicebear.com/7.x/fun-emoji/svg?seed=dra-monica-19&backgroundColor=d1d4f9`,
  'felipe-gomes': `https://api.dicebear.com/7.x/pixel-art/svg?seed=felipe-gomes-20&backgroundColor=ffdfbf`,
  'fernanda-alves': `https://api.dicebear.com/7.x/thumbs/svg?seed=fernanda-alves-21&backgroundColor=c7ecee`,
  'fernanda-dias': `https://api.dicebear.com/7.x/notionists/svg?seed=fernanda-dias-22&backgroundColor=ffeaa7`,
  'fernanda-lima': `https://api.dicebear.com/7.x/big-smile/svg?seed=fernanda-lima-23&backgroundColor=dfe6e9`,
  'gabriel-lima': `https://api.dicebear.com/7.x/lorelei/svg?seed=gabriel-lima-24&backgroundColor=b6e3f4`,
  'isabela-ferreira': `https://api.dicebear.com/7.x/avataaars/svg?seed=isabela-ferreira-25&backgroundColor=c0aede`,
  'jessica-lima': `https://api.dicebear.com/7.x/bottts/svg?seed=jessica-lima-26&backgroundColor=ffd5dc`,
  'joao-pedro': `https://api.dicebear.com/7.x/fun-emoji/svg?seed=joao-pedro-27&backgroundColor=d1d4f9`,
  'jorge-mendes': `https://api.dicebear.com/7.x/pixel-art/svg?seed=jorge-mendes-28&backgroundColor=ffdfbf`,
  'julia-santos': `https://api.dicebear.com/7.x/thumbs/svg?seed=julia-santos-29&backgroundColor=c7ecee`,
  'juliana-costa': `https://api.dicebear.com/7.x/notionists/svg?seed=juliana-costa-30&backgroundColor=ffeaa7`,
  'juliana-santos': `https://api.dicebear.com/7.x/big-smile/svg?seed=juliana-santos-31&backgroundColor=dfe6e9`,
  'larissa-costa': `https://api.dicebear.com/7.x/lorelei/svg?seed=larissa-costa-32&backgroundColor=b6e3f4&gender=female`,
  'lucas-ferreira': `https://api.dicebear.com/7.x/avataaars/svg?seed=lucas-ferreira-33&backgroundColor=c0aede`,
  'lucas-mendes': `https://api.dicebear.com/7.x/bottts/svg?seed=lucas-mendes-34&backgroundColor=ffd5dc`,
  'lucia-ferreira': `https://api.dicebear.com/7.x/fun-emoji/svg?seed=lucia-ferreira-35&backgroundColor=d1d4f9`,
  'marcelo-rocha': `https://api.dicebear.com/7.x/pixel-art/svg?seed=marcelo-rocha-36&backgroundColor=ffdfbf`,
  'marcos-oliveira': `https://api.dicebear.com/7.x/thumbs/svg?seed=marcos-oliveira-37&backgroundColor=c7ecee`,
  'maria-silva': `https://api.dicebear.com/7.x/notionists/svg?seed=maria-silva-38&backgroundColor=ffeaa7`,
  'mariana-costa': `https://api.dicebear.com/7.x/big-smile/svg?seed=mariana-costa-39&backgroundColor=dfe6e9`,
  'marina-costa': `https://api.dicebear.com/7.x/lorelei/svg?seed=marina-costa-40&backgroundColor=b6e3f4&gender=female`,
  'marina-silva': `https://api.dicebear.com/7.x/avataaars/svg?seed=marina-silva-41&backgroundColor=c0aede`,
  'miguel-santos': `https://api.dicebear.com/7.x/bottts/svg?seed=miguel-santos-42&backgroundColor=ffd5dc`,
  'patricia-alves': `https://api.dicebear.com/7.x/fun-emoji/svg?seed=patricia-alves-43&backgroundColor=d1d4f9`,
  'patricia-rocha': `https://api.dicebear.com/7.x/pixel-art/svg?seed=patricia-rocha-44&backgroundColor=ffdfbf`,
  'paula-santos': `https://api.dicebear.com/7.x/thumbs/svg?seed=paula-santos-45&backgroundColor=c7ecee`,
  'pedro-costa': `https://api.dicebear.com/7.x/notionists/svg?seed=pedro-costa-46&backgroundColor=ffeaa7`,
  'pedro-santos': `https://api.dicebear.com/7.x/big-smile/svg?seed=pedro-santos-47&backgroundColor=dfe6e9`,
  'rafael-costa': `https://api.dicebear.com/7.x/lorelei/svg?seed=rafael-costa-48&backgroundColor=b6e3f4`,
  'rafael-santos': `https://api.dicebear.com/7.x/avataaars/svg?seed=rafael-santos-49&backgroundColor=c0aede`,
  'raquel-ferreira': `https://api.dicebear.com/7.x/bottts/svg?seed=raquel-ferreira-50&backgroundColor=ffd5dc`,
  'regina-alves': `https://api.dicebear.com/7.x/fun-emoji/svg?seed=regina-alves-51&backgroundColor=d1d4f9`,
  'renata-dias': `https://api.dicebear.com/7.x/pixel-art/svg?seed=renata-dias-52&backgroundColor=ffdfbf`,
  'ricardo-mendes': `https://api.dicebear.com/7.x/thumbs/svg?seed=ricardo-mendes-53&backgroundColor=c7ecee`,
  'ricardo-silva': `https://api.dicebear.com/7.x/notionists/svg?seed=ricardo-silva-54&backgroundColor=ffeaa7`,
  'roberto-silva': `https://api.dicebear.com/7.x/big-smile/svg?seed=roberto-silva-55&backgroundColor=dfe6e9`,
  'sandra-lima': `https://api.dicebear.com/7.x/lorelei/svg?seed=sandra-lima-56&backgroundColor=b6e3f4&gender=female`,
  'tatiana-alves': `https://api.dicebear.com/7.x/avataaars/svg?seed=tatiana-alves-57&backgroundColor=c0aede`,
  'thiago-costa': `https://api.dicebear.com/7.x/bottts/svg?seed=thiago-costa-58&backgroundColor=ffd5dc`,
};

interface ComunidadeData {
  titulo: string;
  descricao: string;
  membrosOnline: number;
  totalMensagens: number;
}

// ========================================
// DADOS MOCK - MENSAGENS DO FEED
// ========================================

// Arena original: Protocolo Lipedema (conversas gerais)
const MENSAGENS_LIPEDEMA: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '09:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDOS ao Protocolo Lipedema! 🦵\n\nLipedema é uma condição real, progressiva e frequentemente sub-diagnosticada onde há acúmulo anormal de gordura nas pernas, glúteos e braços. NÃO é obesidade, NÃO é linfedema simples.\n\nAqui discutimos: diagnóstico & estágios, nutrição anti-inflamatória, exercícios seguros (AEJ, caminhada, natação), drenagem linfática, hormônios & contraceptivos, suplementos com evidência e saúde mental.\n\nProtocolo AEJ + compressão é a base. Evite HIIT (piora inflamação). Paciência: mudanças levam 4-8 semanas.',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '14:32',
    autor: { id: 'maria-silva', nome: 'Maria Silva', avatar: MOCK_USER_AVATARS['maria-silva'], is_premium: true },
    conteudo: 'Comecei a dieta anti-inflamatória há 3 semanas e já sinto diferença no inchaço das pernas. Eliminei processados, aumentei ômega-3 e vegetais crucíferos.',
  },
  {
    id: '3',
    tipo: 'ia',
    timestamp: '14:33',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Em que momento do dia você sente mais dor, peso ou sensibilidade nas pernas?',
    ia_tipo: 'pergunta',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '14:35',
    autor: { id: 'ana-costa', nome: 'Ana Costa', avatar: MOCK_USER_AVATARS['ana-costa'] },
    conteudo: 'Maria, você sentiu diferença na dor também? Eu estou na segunda semana e a dor ainda está forte.',
  },
  {
    id: '5',
    tipo: 'usuario',
    timestamp: '14:38',
    autor: { id: 'maria-silva', nome: 'Maria Silva', avatar: MOCK_USER_AVATARS['maria-silva'], is_premium: true },
    conteudo: 'Ana, a dor demorou mais pra melhorar. Por volta da semana 4-5 que percebi diferença real. Paciência!',
  },
  {
    id: '5',
    tipo: 'usuario',
    timestamp: '14:42',
    autor: { id: 'juliana-santos', nome: 'Juliana Santos', avatar: MOCK_USER_AVATARS['juliana-santos'] },
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
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Ótima discussão! A drenagem manual por profissional capacitado é diferente de aparelhos.',
  },
];

// Arena de destaque: Lipedema - Paradoxo do Cardio (conversas técnicas)
const MENSAGENS_LIPEDEMA_PARADOXO: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '14:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'PROTOCOLO EM DESTAQUE: Lipedema e o Paradoxo do Cardio — Por que HIIT pode estar piorando sua condição.',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '14:10',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Pessoal, vamos falar sobre o PARADOXO DO CARDIO no Lipedema. Você faz HIIT achando que vai "derreter" a gordura das pernas? Senta que essa doeu: você está INFLAMANDO o tecido doente e acelerando a progressão da doença.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '14:18',
    autor: { id: 'maria-silva', nome: 'Maria Silva', avatar: MOCK_USER_AVATARS['maria-silva'], is_premium: true },
    conteudo: 'Dra. Carla, sério isso? Minha endócrino mandou eu fazer HIIT 3x por semana! Estou piorando então?',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '14:25',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Maria, deixa eu explicar a bioquímica. O tecido adiposo no Lipedema NÃO é gordura comum. É um tecido HIPÓXICO, FIBROSADO, com drenagem linfática comprometida e infiltrado de macrófagos pró-inflamatórios (M1).',
  },
  {
    id: '5',
    tipo: 'usuario',
    timestamp: '14:32',
    autor: { id: 'ana-costa', nome: 'Ana Costa', avatar: MOCK_USER_AVATARS['ana-costa'] },
    conteudo: 'E o que acontece quando fazemos cardio intenso nesse tecido?',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '14:40',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Ana, quando você faz cardio de alto impacto: 1) O estresse mecânico repetitivo causa MICROTRAUMA no tecido já fragilizado. 2) A hipóxia local dispara HIF-1α (fator induzido por hipóxia), que ativa cascatas inflamatórias via NF-κB. 3) O sistema linfático, que já opera com 30-50% MENOS eficiência, não consegue drenar o excesso de fluido e mediadores inflamatórios (IL-6, TNF-α).',
  },
  {
    id: '7',
    tipo: 'ia',
    timestamp: '14:41',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'INSIGHT: Discussão técnica sobre mecanismos inflamatórios no Lipedema. HIF-1α, NF-κB, macrófagos M1.',
    ia_tipo: 'insight',
  },
  {
    id: '8',
    tipo: 'usuario',
    timestamp: '14:48',
    autor: { id: 'juliana-santos', nome: 'Juliana Santos', avatar: MOCK_USER_AVATARS['juliana-santos'] },
    conteudo: 'Meu Deus, então o resultado do HIIT é MAIS edema, MAIS fibrose, MAIS dor? Estou correndo pra trás?',
  },
  {
    id: '9',
    tipo: 'usuario',
    timestamp: '14:55',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Exatamente, Juliana. Mas calma, tem solução! A chave-mestra é: AEJ de BAIXÍSSIMA intensidade + compressão graduada.',
  },
  {
    id: '10',
    tipo: 'usuario',
    timestamp: '15:02',
    autor: { id: 'maria-silva', nome: 'Maria Silva', avatar: MOCK_USER_AVATARS['maria-silva'], is_premium: true },
    conteudo: 'Por que isso funciona e o HIIT não?',
  },
  {
    id: '11',
    tipo: 'usuario',
    timestamp: '15:10',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Maria, por 3 razões: 1) A contração muscular RÍTMICA em baixa intensidade funciona como bomba linfática auxiliar, facilitando drenagem SEM gerar microtrauma. 2) A compressão externa (20-30mmHg) cria gradiente de pressão que potencializa o retorno linfático em até 40%. 3) Em jejum, você opera com insulina basal baixa, maximizando lipólise via HSL SEM depender de adrenalina alta, que piora a inflamação.',
  },
  {
    id: '12',
    tipo: 'ia',
    timestamp: '15:11',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'PROTOCOLO DESTAQUE: Caminhada 5-6 km/h + Meia de compressão 20-30mmHg + Jejum. 40-60 minutos. Simples. Eficaz. Anti-inflamatório.',
    ia_tipo: 'destaque',
  },
  {
    id: '13',
    tipo: 'usuario',
    timestamp: '15:18',
    autor: { id: 'ana-costa', nome: 'Ana Costa', avatar: MOCK_USER_AVATARS['ana-costa'] },
    conteudo: 'Então o protocolo é: esteira a 5-6 km/h, com meia de compressão, em jejum, por 40-60 minutos?',
  },
  {
    id: '14',
    tipo: 'usuario',
    timestamp: '15:22',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Isso, Ana! Simples assim. Nada de HIIT, nada de impacto alto. A ciência é clara: no Lipedema, menos é mais.',
  },
  {
    id: '15',
    tipo: 'usuario',
    timestamp: '15:30',
    autor: { id: 'juliana-santos', nome: 'Juliana Santos', avatar: MOCK_USER_AVATARS['juliana-santos'] },
    conteudo: 'Vou começar amanhã! E a dieta anti-inflamatória ajuda também?',
  },
  {
    id: '16',
    tipo: 'usuario',
    timestamp: '15:38',
    autor: { id: 'dr-carla', nome: 'Dra. Carla', avatar: MOCK_USER_AVATARS['dr-carla'], is_founder: true },
    conteudo: 'Com certeza, Juliana! Eliminar processados, aumentar ômega-3 e vegetais crucíferos. A combinação AEJ + compressão + dieta anti-inflamatória é o tripé do protocolo Lipedema.',
  },
  {
    id: '17',
    tipo: 'ia',
    timestamp: '15:39',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'RESUMO: Protocolo Lipedema = AEJ baixa intensidade + Compressão 20-30mmHg + Dieta anti-inflamatória. HIIT = contraindicado (inflama tecido doente).',
    ia_tipo: 'resumo',
  },
];

const MENSAGENS_DEFICIT_CALORICO: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '09:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDOS à Arena Déficit Calórico na Vida Real! 📊\n\nAqui a gente não fala de cálculos de carboidrato balanceados em excel. Falamos de VIDA REAL: finais de semana, compromissos sociais, mudanças de rotina, ansiedade à noite.\n\n**O que acontece aqui:**\nVocê descobre que déficit NÃO é linear (tem semanas que o peso não cai), que a estratégia de "déficit maior durante semana + manutenção no fim de semana" FUNCIONA melhor que "todos os dias iguais", e que recuperação de um desvio é mais rápida do que pensa.\n\n**Pontos-chave:**\n✓ Déficit é MÉDIA semanal, não diária\n✓ Aderir 80% do tempo > perfeição 30% do tempo\n✓ Hormônios, estresse e sono impactam MUITO\n✓ Pequenos ajustes > mudanças radicais\n\n**Evitar:**\n✗ Obsessão com calorias diárias exatas\n✗ Culpa por desvios pontuais\n✗ Estratégias que ignoram vida social\n\nQual é sua maior dificuldade em manter um déficit? Vamos conversar! 💪',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '10:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que mais dificulta manter o déficit calórico hoje para você?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '10:05',
    autor: { id: 'lucas-mendes', nome: 'Lucas Mendes', avatar: MOCK_USER_AVATARS['lucas-mendes'], is_premium: true },
    conteudo: 'Finais de semana são meu maior desafio. Durante a semana consigo manter, mas sábado e domingo desanda tudo.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '10:12',
    autor: { id: 'camila-rocha', nome: 'Camila Rocha', avatar: MOCK_USER_AVATARS['camila-rocha'] },
    conteudo: 'Lucas, eu também! Especialmente quando tem social. Almoço em família, churrasco... impossível manter.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '10:18',
    autor: { id: 'rafael-costa', nome: 'Rafael Costa', avatar: MOCK_USER_AVATARS['rafael-costa'], is_premium: true },
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
    autor: { id: 'ana-beatriz', nome: 'Ana Beatriz', avatar: MOCK_USER_AVATARS['ana-beatriz'], is_founder: true },
    conteudo: 'Gente, lembrem: déficit é média semanal, não diária. Se sábado passou um pouco, ajusta domingo. Não precisa desespero.',
  },
];

const MENSAGENS_TREINO_GLUTEO: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '08:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDA à Arena Treino de Glúteo! 🍑\n\nEste é espaço onde a gente ESPECIFICA em hipertrofia de glúteo com foco feminino. Porque glúteo não é só estética — é funcionalidade (quadril mais saudável, menor risco de lesões).\n\n**O que você descobre aqui:**\n✓ Por que carga alta vs repetições altas gera resultados DIFERENTES\n✓ Hip thrust é o melhor, mas não é o ÚNICO exercício\n✓ Frequência ideal (2-3x/semana) e divisão de treino\n✓ Amplitude de movimento importa: pés elevados vs no chão\n✓ Progressão em casa com elásticos e peso corporal\n✓ Ativação x força x hipertrofia = fases diferentes\n\n**Pontos-chave:**\n✓ 8-12 reps com carga moderada-alta = hipertrofia clássica\n✓ 15-20 reps mais leves = trabalho metabólico\n✓ Variar estímulos = melhores ganhos\n✓ Recuperação é onde o glúteo cresce\n\n**Evitar:**\n✗ Acreditar que "máquina Smith é melhor que livre"\n✗ Fazer glúteo 1x/semana e esperar ganhos rápidos\n✗ Ignorar técnica por usar peso maior\n\nVocê treina glúteo como? Qual intensidade você sente melhor? 💎',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '08:30',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Você sente mais o glúteo treinando com carga alta ou com mais repetições?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '08:35',
    autor: { id: 'jessica-lima', nome: 'Jéssica Lima', avatar: MOCK_USER_AVATARS['jessica-lima'], is_premium: true },
    conteudo: 'Carga alta com certeza! Hip thrust pesado é o que mais sinto no dia seguinte.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '08:42',
    autor: { id: 'bruna-santos', nome: 'Bruna Santos', avatar: MOCK_USER_AVATARS['bruna-santos'] },
    conteudo: 'Eu prefiro repetições altas. Carga muito alta meu quadríceps rouba. Com mais reps consigo isolar melhor.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '08:50',
    autor: { id: 'patricia-alves', nome: 'Patricia Alves', avatar: MOCK_USER_AVATARS['patricia-alves'], is_founder: true },
    conteudo: 'Depende da fase do treino! Hipertrofia: 8-12 reps com carga moderada-alta. Metabólico: 15-20 reps mais leves. Variar é importante.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '08:52',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'DESTAQUE: Patricia (Founder) comentou sobre periodização. 5 membros online discutindo.',
    ia_tipo: 'destaque',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '09:00',
    autor: { id: 'marina-costa', nome: 'Marina Costa', avatar: MOCK_USER_AVATARS['marina-costa'], is_premium: true },
    conteudo: 'Patricia, e a frequência? Treino glúteo 3x/semana, será que é muito?',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '09:08',
    autor: { id: 'patricia-alves', nome: 'Patricia Alves', avatar: MOCK_USER_AVATARS['patricia-alves'], is_founder: true },
    conteudo: 'Marina, pode funcionar se a intensidade for bem distribuída. 2 dias pesados + 1 leve de ativação. Mas presta atenção na recuperação!',
  },
];

const MENSAGENS_CANETAS: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '12:30',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) à Arena GLP-1: Ozempic, Wegovy, Mounjaro! 💊\n\nEste é espaço seguro pra falar sobre injeções emagrecer: **relatos reais**, efeitos colaterais honestos, protocolos, como você se sente, dúvidas sobre transição.\n\n**Aqui você descobre:**\n✓ Expectativas REAIS: quanto emagrece, em quanto tempo, os "sides"\n✓ Efeito colateral mais comum (náusea, constipação) e como gerenciar\n✓ Diferenças: Ozempic (diabetes) vs Wegovy (emagrecimento) vs Mounjaro (novo)\n✓ Como funciona: GLP-1 aumenta saciedade, desacelera esvaziamento gástrico\n✓ Dose inicial, titulação, quando aumentar\n✓ Nutrição paralela: como comer com apetite menor\n✓ Manutenção pós-parada: o peso volta?\n\n**Pontos-chave:**\n✓ SEMPRE com prescrição médica e acompanhamento\n✓ Não é "solução mágica" — você ainda precisa comer menos\n✓ Semana 3-4 = apetite mudava significativamente\n✓ Hidratação (2.5-3L) + fibra (25-30g) = menos constipação\n✓ Pausa 1-2 semanas entre aumento de dose\n\n**Evitar:**\n✗ Usar sem prescrição ou acompanhamento médico\n✗ Esperar emagrecimento sem mudança de alimentação\n✗ Ignorar efeitos colaterais — fale com seu médico\n✗ Trocar de medicação por "ouvir falar"\n\nVocê está em alguma dose? Como estão os efeitos? Vamos compartilhar experiências seguras! 💙',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '13:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que mais mudou no seu corpo ou apetite desde que começou a usar?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '13:15',
    autor: { id: 'joao-pedro', nome: 'João Pedro', avatar: MOCK_USER_AVATARS['joao-pedro'], is_premium: true },
    conteudo: 'Semana 3 com Ozempic 0.5mg. A náusea diminuiu bastante. Refeições menores e mais frequentes ajudam.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '13:22',
    autor: { id: 'amanda-silva', nome: 'Amanda Silva', avatar: MOCK_USER_AVATARS['amanda-silva'], is_premium: true },
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
    autor: { id: 'dr-ricardo', nome: 'Dr. Ricardo', avatar: MOCK_USER_AVATARS['dr-ricardo'], is_founder: true },
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
    autor: { id: 'carlos-mendes', nome: 'Carlos Mendes', avatar: MOCK_USER_AVATARS['carlos-mendes'] },
    conteudo: 'Alguém migrou de Ozempic pra Mounjaro? Meu médico sugeriu pela maior eficácia.',
  },
];

const MENSAGENS_ODEIA_TREINAR: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '10:45',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO À ZONA SEGURA! 🚀\n\nSe você largar academia 1 mês depois de assinar, parou na máquina ao lado de quem "nasceu para treinar", ou academia é seu PIOR lugar do mundo — aqui é seu espaço.\n\n**O problema real:**\nAcademia tradicional não é para TODOS. E tudo bem. A melhor atividade é aquela que você CONSEGUE FAZER.\n\n**O que a gente descobre aqui:**\n✓ Caminhada de manhã é igualmente válida — consistência > intensidade\n✓ Natação, dança, pilates, yoga = atividades que GRUDAM porque você gosta\n✓ Resultados com atividades ao ar livre + em grupo são MELHORES (adesão é maior)\n✓ 30min de coisa que você ama > 60min de coisa que odeia\n✓ Seu corpo não sabe se está em academia ou em trilha — movimento é movimento\n✓ Combinar coisas que você gosta = adição da atividade por mais tempo\n\n**Pontos-chave:**\n✓ A melhor atividade é a que você faz\n✓ Consistência > perfeição > intensidade\n✓ Atividades em grupo e ao ar livre = maior adesão\n✓ Sua "preguiça de academia" pode ser sua maior FORÇA em outro contexto\n\n**Evitar:**\n✗ Forçar-se em academia se você odeia\n✗ Culpa por não seguir plano "padrão"\n✗ Acreditar que só musculação vale\n\nO que você GOSTARIA de fazer? Vamos descobrir sua atividade ideal! 💚',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '11:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Qual tipo de exercício você consegue manter por mais tempo sem desistir?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '11:08',
    autor: { id: 'renata-dias', nome: 'Renata Dias', avatar: MOCK_USER_AVATARS['renata-dias'] },
    conteudo: 'Caminhada! Academia eu largo em 1 mês, mas caminhada de manhã consigo manter há 8 meses.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '11:15',
    autor: { id: 'pedro-santos', nome: 'Pedro Santos', avatar: MOCK_USER_AVATARS['pedro-santos'], is_premium: true },
    conteudo: 'Pra mim é natação. Academia me dá preguiça, mas piscina eu amo. Vou 3x por semana.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '11:22',
    autor: { id: 'isabela-ferreira', nome: 'Isabela Ferreira', avatar: MOCK_USER_AVATARS['isabela-ferreira'] },
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
    autor: { id: 'marcos-oliveira', nome: 'Marcos Oliveira', avatar: MOCK_USER_AVATARS['marcos-oliveira'], is_founder: true },
    conteudo: 'O melhor exercício é o que você faz! Se academia não funciona, ok. Movimento é movimento.',
  },
];

const MENSAGENS_ANSIEDADE: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '19:30',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA SEM JULGAMENTO! 🤝\n\nCome porque está ansioso? Estressado? Entediado? Buscando preencher um vazio? Aqui a gente conversa sobre isso COM MATURIDADE e SEM CULPA.\n\n**Importante desde o início:**\nComida EMOCIONAL é normal. Universalmente. A questão é o PADRÃO e as FERRAMENTAS que você tem pra lidar.\n\n**O que a gente descobre aqui:**\n✓ Identificar seu gatilho emocional específico (estresse noturno vs tédio vs busca de recompensa)\n✓ Cérebro quer DOPAMINA, não necessariamente comida — encontrar substitutos\n✓ Banho quente, série, exercício = dopamina diferente\n✓ Diferença entre FOME física e fome EMOCIONAL\n✓ Estratégias reais pra cada situação (noite no sofá ≠ dia no trabalho estressado)\n✓ Como usar COMIDA como ferramenta, não como problema\n✓ Ansiedade severa = psicólogo; compulsão = profissional\n\n**Pontos-chave:**\n✓ Seu gatilho é único — descobrir é o caminho\n✓ Alternativas de dopamina funcionam (exercício, série, banho, música)\n✓ Uma noite de "comida compulsiva" NÃO desfaz sua semana\n✓ Compulsão recorrente = sinalizador para pedir ajuda profissional\n✓ Autoaceitação > culpa > vergonha\n\n**Evitar:**\n✗ Culpa paralisante ("estou gordinho, sou fraco")\n✗ Restrição severa (piora ansiedade)\n✗ Ignorar padrões repetidos (procurar ajuda profissional)\n\nEm que situação você come mais por emoção? Vamos identificar juntos! 💙',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '20:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Em quais situações você percebe que come mais por emoção do que por fome?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '20:12',
    autor: { id: 'carolina-martins', nome: 'Carolina Martins', avatar: MOCK_USER_AVATARS['carolina-martins'], is_premium: true },
    conteudo: 'À noite, depois de um dia estressante no trabalho. É como se precisasse de uma "recompensa".',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '20:18',
    autor: { id: 'felipe-gomes', nome: 'Felipe Gomes', avatar: MOCK_USER_AVATARS['felipe-gomes'] },
    conteudo: 'Quando estou entediado. Final de semana em casa = atacando a geladeira.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '20:25',
    autor: { id: 'mariana-costa', nome: 'Mariana Costa', avatar: MOCK_USER_AVATARS['mariana-costa'], is_premium: true },
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
    autor: { id: 'dra-lucia', nome: 'Dra. Lucia', avatar: MOCK_USER_AVATARS['dra-lucia'], is_founder: true },
    conteudo: 'Identificar o gatilho já é metade da batalha. O próximo passo é criar estratégias alternativas pra cada situação.',
  },
];

const MENSAGENS_35_MAIS: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '14:15',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA 35+: O CORPO MUDOU? 🔄\n\nAntes dos 30 você perdia peso cortando refrigerante. Aos 35, você faz tudo "certo" e nada funciona. Bem-vindo à realidade biológica.\n\n**O que REALMENTE mudou:**\n✓ Metabolismo de repouso cai ~2-3% por década após 30\n✓ Massa muscular diminui (sarcopenia) — peso corporal fica pior\n✓ Distribuição de gordura muda: tende concentrar na barriga (androginia hormonal)\n✓ Recuperação de desvios leva o DOBRO do tempo\n✓ Sensibilidade à insulina diminui — carboidrato é tratado diferente\n✓ Hormônios (estrogênio em mulheres, testosterona em homens) caem\n✓ Sleep e estresse impactam MUITO mais (recuperação é menor)\n\n**Por que a "fórmula antiga" não funciona:**\nVocê tinha mais massa muscular (queima mais calorias em repouso) + hormônios mais altos (queimava mais) + recuperação melhor (podia treinar mais frequente/intenso).\n\n**O que FUNCIONA agora:**\n✓ Musculação virou prioridade 1 (massa muscular = metabolismo)\n✓ Treino de força > cardio puro (pode parecer contra-intuitivo)\n✓ Déficit calórico menor (não funciona agressivo como antes)\n✓ Proteína maior (18-20% das calorias — preserva músculo)\n✓ Periodização com base em ciclo hormonal (se mulher)\n✓ Treino 4-5x/semana (consistência > intensidade)\n\n**Pontos-chave:**\n✓ Não é preguiça, é biologia\n✓ Ganhos são mais lentos — paciência é essencial\n✓ Composição corporal importa mais que número na balança\n✓ Saúde cardiovascular + força = longevidade\n\n**Evitar:**\n✗ Comparar seu emagrecimento com 20 anos atrás\n✗ Usar protocolo de pessoa mais jovem\n✗ Negligenciar sono e estresse\n\nO que você sente que mudou mais? Vamos conversar! 💪',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '15:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que você sente que mudou no seu corpo em relação a antes dos 30?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '15:10',
    autor: { id: 'sandra-lima', nome: 'Sandra Lima', avatar: MOCK_USER_AVATARS['sandra-lima'], is_premium: true },
    conteudo: 'O peso fica muito mais difícil de perder. Antes bastava cortar refrigerante, agora preciso de muito mais esforço.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '15:18',
    autor: { id: 'cristina-rocha', nome: 'Cristina Rocha', avatar: MOCK_USER_AVATARS['cristina-rocha'], is_premium: true },
    conteudo: 'Gordura localizada na barriga que não existia! Antes engordava por igual, agora vai tudo pro abdômen.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '15:25',
    autor: { id: 'paula-santos', nome: 'Paula Santos', avatar: MOCK_USER_AVATARS['paula-santos'] },
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
    autor: { id: 'dra-monica', nome: 'Dra. Mônica', avatar: MOCK_USER_AVATARS['dra-monica'], is_founder: true },
    conteudo: 'Depois dos 35, musculação vira prioridade. Massa muscular = metabolismo. Não é só cardio que resolve.',
  },
];

const MENSAGENS_ANTES_DEPOIS: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '08:30',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA ANTES/DEPOIS — MAS DIFERENTE! 📸\n\nAqui NÃO é sobre foto perfeita antes-depois no espelho. É sobre a HISTÓRIA do processo. Os meses que o peso não caía. Os patamares. A volta frustrada. A volta bem-sucedida. A ressignificação.\n\n**O que a gente valoriza aqui:**\n✓ O tempo que levou (meses/anos) — transparência sobre realidade\n✓ Como foi SEM resultado aparente (semanas 4, 8, 12)\n✓ Desvios e como você voltou (nunca é linear)\n✓ O que funcionou VS o que foi ilusão\n✓ Impacto na vida além de estética (energia, disposição, auto-estima)\n✓ Lições aprendidas no caminho\n✓ Por que nunca "voltou ao ponto zero"\n\n**Estrutura honesta:**\n"Perdi 18kg em 8 meses. Mês 1-2: -3kg. Mês 3-4: NADA (frustrante). Mês 5-6: -4kg. Mês 7: voltei 1kg em final de semana. Mês 8: chegou nos 18kg final. O que aprendi: é média, não é linear."\n\n**Pontos-chave:**\n✓ Constância > perfeitismo\n✓ Composição corporal ≠ número na balança\n✓ Foto é CONSEQUÊNCIA, não objetivo\n✓ Semanas sem "resultado aparente" = o corpo tá mudando internamente\n✓ Volta do peso = oportunidade de aprender, não fracasso\n✓ Transformação real leva 6-12 meses mínimo\n\n**Evitar:**\n✗ Contos de fada ("perdi 20kg em 2 meses")\n✗ Focar APENAS em estética\n✗ Omitir plateaus e dificuldades\n✗ "Mágica" — sempre envolve treino + dieta + consistência\n\nQual é seu processo? Vamos compartilhar histórias honestas! 🙌',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '09:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Qual foi o maior desafio no seu processo até agora?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '09:15',
    autor: { id: 'tatiana-alves', nome: 'Tatiana Alves', avatar: MOCK_USER_AVATARS['tatiana-alves'], is_premium: true },
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
    conteudo: 'DESTAQUE: Tatiana compartilhou transformação de 8 meses com fotos. 4 membros online.',
    ia_tipo: 'destaque',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '09:25',
    autor: { id: 'jorge-mendes', nome: 'Jorge Mendes', avatar: MOCK_USER_AVATARS['jorge-mendes'] },
    conteudo: 'Tatiana, incrível! Quanto perdeu no total? E qual foi a estratégia principal?',
  },
  {
    id: '5',
    tipo: 'usuario',
    timestamp: '09:32',
    autor: { id: 'tatiana-alves', nome: 'Tatiana Alves', avatar: MOCK_USER_AVATARS['tatiana-alves'], is_premium: true },
    conteudo: 'Jorge, 18kg! Déficit moderado + musculação 4x/semana. Nada radical, só constância.',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '09:40',
    autor: { id: 'andre-coach', nome: 'André Coach', avatar: MOCK_USER_AVATARS['andre-coach'], is_founder: true },
    conteudo: 'Tatiana é exemplo de que processo > resultado. As fotos são consequência do compromisso diário.',
  },
];

const MENSAGENS_TREINO_CASA: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '06:45',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA TREINO EM CASA! 🏠💪\n\nSem academia? Sem problema. Com elástico + peso corporal você consegue MAIS resultado do que pensa.\n\n**O que você descobre aqui:**\n✓ Hip thrust no chão com elástico = eficiente quanto máquina\n✓ Pés elevados ativa MAIS que no chão (maior amplitude)\n✓ Progressão sem carga = TEMPO SOB TENSÃO (3s desce, 1s sobe = 2x mais intenso)\n✓ Exercícios sem nenhum equipamento: frog pump, single leg glute bridge, quadruped hip extension\n✓ Mochila de livros como halter (criativo e funciona)\n✓ Agachamento búlgaro com improviso\n✓ Progressão de semanas (mais reps → mais tempo lento → variações)\n\n**Princípio fundamental em casa:**\nSem carga pesada, você manipula TEMPO SOB TENSÃO. Músculos não sabem de onde vem o estímulo — só sentem tensão.\n\n**Pontos-chave:**\n✓ Elástico é tão eficiente quanto ferro (resistência variável é até melhor)\n✓ Peso corporal bem explorado = hipertrofia garantida\n✓ Amplitude completa > meio movimento com carga pesada\n✓ 3 dias/semana em casa > nenhum dia em academia\n✓ Progressão: reps → tempo lento → variações → mais reps\n✓ Recuperação em casa é IGUAL: descanso 48h entre grupos musculares\n\n**Evitar:**\n✗ Crer que "sem halter não funciona"\n✗ Movimento incompleto para parecer mais pesado\n✗ Treino aleatório — estrutura importa\n✗ Negligenciar progressão (semana que vem tem que ser mais difícil)\n\nO que você tem em casa? Vamos montar seu treino! 🎯',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '07:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'Qual exercício de casa você sente que dá mais resultado pra você?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '07:12',
    autor: { id: 'fernanda-lima', nome: 'Fernanda Lima', avatar: MOCK_USER_AVATARS['fernanda-lima'], is_premium: true },
    conteudo: 'Hip thrust no chão com elástico! Sinto mais que na academia. O Bret ensina a técnica certinha no ebook.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '07:18',
    autor: { id: 'patricia-rocha', nome: 'Patricia Rocha', avatar: MOCK_USER_AVATARS['patricia-rocha'] },
    conteudo: 'Fernanda, você faz com os pés elevados ou no chão? Tenho dúvida se faz diferença.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '07:25',
    autor: { id: 'fernanda-lima', nome: 'Fernanda Lima', avatar: MOCK_USER_AVATARS['fernanda-lima'], is_premium: true },
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
    autor: { id: 'amanda-costa', nome: 'Amanda Costa', avatar: MOCK_USER_AVATARS['amanda-costa'], is_premium: true },
    conteudo: 'Agachamento búlgaro com mochila de livros! Parece besteira mas com 10kg já fica pesado. Zero custo.',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '07:42',
    autor: { id: 'carla-mendes', nome: 'Carla Mendes', avatar: MOCK_USER_AVATARS['carla-mendes'] },
    conteudo: 'Amanda, genial a ideia da mochila! Aqui não tenho halter nenhum, vou testar.',
  },
  {
    id: '8',
    tipo: 'usuario',
    timestamp: '07:50',
    autor: { id: 'coach-bret', nome: 'Coach Bret', avatar: MOCK_USER_AVATARS['coach-bret'], is_founder: true },
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
    autor: { id: 'julia-santos', nome: 'Julia Santos', avatar: MOCK_USER_AVATARS['julia-santos'] },
    conteudo: 'E pra quem não tem elástico? Dá pra fazer algo eficiente só com peso do corpo?',
  },
  {
    id: '11',
    tipo: 'usuario',
    timestamp: '08:08',
    autor: { id: 'coach-bret', nome: 'Coach Bret', avatar: MOCK_USER_AVATARS['coach-bret'], is_founder: true },
    conteudo: 'Julia, claro! Frog pump, single leg glute bridge, quadruped hip extension. Todos no ebook. Sem equipamento nenhum, resultado garantido.',
  },
];

const MENSAGENS_DIETA_VIDA_REAL: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '11:30',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA DIETA VIDA REAL! 🍽️\n\nSe você tem dieta "perfeita" há 3 meses que segue 30% — bem-vindo ao lado dos honestos.\n\n**O verdadeiro problema das dietas:**\n✓ Feitas pra alguém que não trabalha, não tem vida social, sem estresse, sem dias ruins\n✓ Refeições 6x/dia = realista? NÃO. Quem prepara marmita pra 6 refeições diárias?\n✓ Alimentos "obrigatórios" que você ODEIA = desistência garantida\n✓ Rigidez absoluta = culpa + rebeldia + binge eating\n✓ Ignora a realidade: churrasco, happy hour, trabalho com pressão, síndrome pré-menstrual\n\n**O que realmente funciona:**\n✓ Um plano 70% "perfeito" seguido 100% do tempo > 100% perfeito seguido 30%\n✓ Simplicidade: proteína em toda refeição + vegetais em 2 refeições\n✓ Não repetir carboidrato processado no mesmo dia\n✓ 3 refeições principais (não 6)\n✓ Flexibilidade para mudanças de rotina\n✓ Um "free meal" por semana reduz saudade e aumenta adesão\n\n**Construindo seu plano minimalista:**\n1. **Proteína fixa:** frango, ovo, iogurte — O MESMO a semana inteira\n2. **Vegetais variados:** cenoura, brócolis, alface (já tira 70%)\n3. **Carboidrato:** arroz/batata/pão — escolha UMA fonte\n4. **Gordura:** azeite, manteiga — não tira, só conta\n5. **Free meal:** sábado à noite você come o que quiser\n\n**Pontos-chave:**\n✓ Simplicidade = aderência\n✓ Plano que respeita sua rotina > plano "científico" impossível\n✓ Marmita 3-4 refeições ≠ 6 refeições\n✓ Trabalha com o seu comportamento, não contra\n✓ Free meal NÃO quebra resultado — manutenção ≠ desvio permanente\n\n**Evitar:**\n✗ Alimentos que você odeia (óbvio, mas muita gente faz)\n✗ Seis refeições diárias\n✗ Culpa paralisante ("perdi na dieta, tá tudo perdido")\n✗ Rigidez que nega sua vida social\n\nQual é sua maior dificuldade em seguir dieta? Vamos simplificar! 💚',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'ia',
    timestamp: '12:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'O que mais te desmotiva a seguir uma dieta elaborada?',
    ia_tipo: 'pergunta',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '12:08',
    autor: { id: 'ricardo-silva', nome: 'Ricardo Silva', avatar: MOCK_USER_AVATARS['ricardo-silva'], is_premium: true },
    conteudo: 'A rigidez. Toda dieta parece que foi feita pra alguém que não trabalha, não tem vida social, não tem estresse.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '12:15',
    autor: { id: 'juliana-costa', nome: 'Juliana Costa', avatar: MOCK_USER_AVATARS['juliana-costa'] },
    conteudo: 'Preparar as marmitas! No papel parece fácil, na prática é mais uma tarefa numa vida já cheia de tarefas.',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '12:22',
    autor: { id: 'marcelo-rocha', nome: 'Marcelo Rocha', avatar: MOCK_USER_AVATARS['marcelo-rocha'], is_premium: true },
    conteudo: 'Juliana, exato! Eu tenho a dieta perfeita no papel há 3 meses. Segui talvez 30% dela.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '12:25',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'RESUMO: 6 membros online. Principais barreiras: rigidez excessiva, falta de tempo, distância da rotina real.',
    ia_tipo: 'resumo',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '12:32',
    autor: { id: 'dra-helena', nome: 'Dra. Helena', avatar: MOCK_USER_AVATARS['dra-helena'], is_founder: true },
    conteudo: 'A melhor dieta é a que você consegue seguir. Prefiro um plano 70% "perfeito" seguido 100% do tempo do que um 100% seguido 30%.',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '12:40',
    autor: { id: 'fernanda-dias', nome: 'Fernanda Dias', avatar: MOCK_USER_AVATARS['fernanda-dias'], is_premium: true },
    conteudo: 'Dra. Helena, tem alguma estratégia pra simplificar? Tipo, versão "mínimo viável" de uma dieta?',
  },
  {
    id: '8',
    tipo: 'usuario',
    timestamp: '12:48',
    autor: { id: 'dra-helena', nome: 'Dra. Helena', avatar: MOCK_USER_AVATARS['dra-helena'], is_founder: true },
    conteudo: 'Fernanda, sim! 1) Proteína em toda refeição. 2) Vegetais em 2 refeições. 3) Não repetir carboidrato processado. Só isso já muda muito.',
  },
];

// ========================================
// MENSAGENS: PEPTÍDEOS RESEARCH
// ========================================

const MENSAGENS_PEPTIDEOS_RESEARCH: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '07:45',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA PEPTÍDEOS RESEARCH! 🧬\n\nAqui a gente fala sobre Fragment 176-191, BPC-157, TB-500, Ipamorelin e outros peptídeos com FOCO EM CIÊNCIA, PROTOCOLOS e REDUÇÃO DE DANOS.\n\n**Importante desde o início:**\nEsta arena é para EDUCAÇÃO. Peptídeos são substâncias de pesquisa. Se você vai usar, é sua escolha — mas INFORMADA.\n\n**O que você descobre aqui:**\n✓ Fragment 176-191: mobiliza ácidos graxos, NÃO oxida — precisa cardio em jejum após\n✓ BPC-157: upregula fatores de crescimento (VEGF, EGF), acelera cicatrização de tendões\n✓ TB-500: regula actina, promove angiogênese, reduz inflamação — synergiza com BPC-157\n✓ Ipamorelin: estimula liberação natural de GH (mais fisiológico que HGH sintético)\n✓ Stack clássico pra regeneração: BPC-157 (250-500mcg) + TB-500 (2-5mg 2x/semana)\n✓ Protocolos específicos: aplicação próxima à lesão, frequência, duração\n✓ Estudos em humanos ainda são limitados — relatos anedóticos são consistentes\n\n**Erro mais comum:**\nFragment 176-191 sem cardio em jejum = injeção que não fez nada. Você MOBILIZA gordura mas NÃO oxida sem exercício.\n\n**Pontos-chave:**\n✓ Entender o mecanismo de cada peptídeo (não funciona "mágico")\n✓ Protocolo importa: dose, frequência, timing, exercício\n✓ Estudos limitados = responsabilidade do usuário é alta\n✓ Combinações (stacks) tem sinergia documentada\n✓ Monitorar efeitos colaterais e sinais de alerta\n✓ Médico especialista em regeneração = fundamental\n\n**Evitar:**\n✗ Usar sem pesquisa prévia\n✗ Acreditar em "milagre" sem trabalho complementar\n✗ Ignorar qualidade/origem (mercado é desregulado)\n✗ Esquecer que recuperação precisa treino + nutrição + sono\n\nQual peptídeo você tem dúvida? Vamos discutir com base em literatura! 🔬',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '08:15',
    autor: { id: 'dr-lucas', nome: 'Dr. Lucas', avatar: MOCK_USER_AVATARS['dr-lucas'], is_founder: true },
    conteudo: 'Vamos começar pelo mais mal-usado: Fragment 176-191. Esse peptídeo é o fragmento lipolítico do HGH (aminoácidos 176-191). Ele MOBILIZA gordura, mas NÃO oxida. Entenderam a diferença?',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '08:22',
    autor: { id: 'thiago-costa', nome: 'Thiago Costa', avatar: MOCK_USER_AVATARS['thiago-costa'], is_premium: true },
    conteudo: 'Dr. Lucas, então por isso meu Fragment não funcionou? Eu aplicava de manhã depois do café da manhã...',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '08:30',
    autor: { id: 'dr-lucas', nome: 'Dr. Lucas', avatar: MOCK_USER_AVATARS['dr-lucas'], is_founder: true },
    conteudo: 'Thiago, você jogou dinheiro fora. O Fragment MOBILIZA ácidos graxos para a corrente sanguínea. Se você não faz cardio em jejum logo após, esses ácidos graxos são REESTERIFICADOS de volta ao tecido adiposo. Protocolo correto: Fragment + 40min AEJ em jejum.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '08:31',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'INSIGHT: Fragment 176-191 mobiliza, mas NÃO oxida. Sem cardio em jejum = injeção que não fez nada.',
    ia_tipo: 'insight',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '08:40',
    autor: { id: 'marina-silva', nome: 'Marina Silva', avatar: MOCK_USER_AVATARS['marina-silva'], is_premium: true },
    conteudo: 'E o BPC-157? Ouvi falar que é milagroso pra lesões. Qual a ciência por trás?',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '08:48',
    autor: { id: 'dr-lucas', nome: 'Dr. Lucas', avatar: MOCK_USER_AVATARS['dr-lucas'], is_founder: true },
    conteudo: 'Marina, BPC-157 é um peptídeo gástrico que upregula fatores de crescimento (VEGF, EGF) e modula óxido nítrico. Acelera cicatrização de tendões, músculos e até mucosa gástrica. Protocolo comum: 250-500mcg/dia, subcutâneo próximo à lesão. Estudos em humanos ainda são limitados, mas relatos anedóticos são consistentes.',
  },
  {
    id: '8',
    tipo: 'usuario',
    timestamp: '09:00',
    autor: { id: 'ricardo-mendes', nome: 'Ricardo Mendes', avatar: MOCK_USER_AVATARS['ricardo-mendes'], is_premium: true },
    conteudo: 'Alguém já combinou BPC-157 com TB-500? Ouvi que a sinergia é absurda pra recuperação.',
  },
  {
    id: '9',
    tipo: 'usuario',
    timestamp: '09:10',
    autor: { id: 'dr-lucas', nome: 'Dr. Lucas', avatar: MOCK_USER_AVATARS['dr-lucas'], is_founder: true },
    conteudo: 'Ricardo, sim! TB-500 (Timosina Beta-4) regula actina, promove angiogênese e reduz inflamação. Combinado com BPC-157 você tem: regeneração tecidual (BPC) + vascularização e mobilidade celular (TB-500). Stack clássico pra lesões crônicas.',
  },
  {
    id: '10',
    tipo: 'ia',
    timestamp: '09:11',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'PROTOCOLO DESTAQUE: BPC-157 (250-500mcg) + TB-500 (2-5mg 2x/semana) = Stack regenerativo. Aplicação próxima à lesão.',
    ia_tipo: 'destaque',
  },
  {
    id: '11',
    tipo: 'usuario',
    timestamp: '09:20',
    autor: { id: 'thiago-costa', nome: 'Thiago Costa', avatar: MOCK_USER_AVATARS['thiago-costa'], is_premium: true },
    conteudo: 'E Ipamorelin? É melhor que o HGH sintético?',
  },
  {
    id: '12',
    tipo: 'usuario',
    timestamp: '09:28',
    autor: { id: 'dr-lucas', nome: 'Dr. Lucas', avatar: MOCK_USER_AVATARS['dr-lucas'], is_founder: true },
    conteudo: 'Thiago, Ipamorelin é um secretagogo — ele estimula sua própria hipófise a liberar GH. Vantagem: pulso mais fisiológico, menos dessensibilização. Desvantagem: depende da sua capacidade de produção. Dose comum: 200-300mcg antes de dormir. Combina bem com CJC-1295 (sem DAC) pra potencializar.',
  },
  {
    id: '13',
    tipo: 'usuario',
    timestamp: '09:40',
    autor: { id: 'marina-silva', nome: 'Marina Silva', avatar: MOCK_USER_AVATARS['marina-silva'], is_premium: true },
    conteudo: 'Qual a procedência confiável? Tenho medo de comprar peptídeo degradado ou falso.',
  },
  {
    id: '14',
    tipo: 'usuario',
    timestamp: '09:48',
    autor: { id: 'dr-lucas', nome: 'Dr. Lucas', avatar: MOCK_USER_AVATARS['dr-lucas'], is_founder: true },
    conteudo: 'Marina, pontos importantes: 1) Peptídeos são FRÁGEIS — exigem refrigeração. 2) Compre de fornecedores com COA (Certificate of Analysis) de laboratório terceirizado. 3) Reconstituição com água bacteriostática, não soro. 4) Armazenar reconstituído na geladeira, usar em até 30 dias.',
  },
  {
    id: '15',
    tipo: 'ia',
    timestamp: '09:49',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'ALERTA: Peptídeos exigem armazenamento refrigerado e reconstituição correta. Sempre exija COA do fornecedor.',
    ia_tipo: 'pergunta',
  },
];

// ========================================
// MENSAGENS: PERFORMANCE & BIOHACKING
// ========================================

const MENSAGENS_PERFORMANCE_BIOHACKING: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '09:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDOS à Arena Performance & Biohacking. Aqui discutimos protocolos de elite, farmacologia avançada e estratégias de redução de danos. Trenbolona, HGH Fragment 176-191, peptídeos de pesquisa e reparticionamento metabólico. Ciência aplicada sem filtro.',
    ia_tipo: 'destaque',
  },
  {
    id: '2',
    tipo: 'usuario',
    timestamp: '09:15',
    autor: { id: 'dr-marcus', nome: 'Dr. Marcus', avatar: MOCK_USER_AVATARS['dr-marcus'], is_founder: true },
    conteudo: 'Pessoal, vamos falar de Trembolona e reparticionamento. A pergunta que sempre recebo: "Como queimar gordura em superávit calórico?" A resposta está no antagonismo do Receptor de Glicocorticoide.',
  },
  {
    id: '3',
    tipo: 'usuario',
    timestamp: '09:22',
    autor: { id: 'rafael-santos', nome: 'Rafael Santos', avatar: MOCK_USER_AVATARS['rafael-santos'], is_premium: true },
    conteudo: 'Dr. Marcus, pode explicar melhor esse mecanismo? Vi que a Trembolona ocupa o GR e impede o cortisol de agir. Isso realmente reduz a deposição visceral?',
  },
  {
    id: '4',
    tipo: 'usuario',
    timestamp: '09:30',
    autor: { id: 'dr-marcus', nome: 'Dr. Marcus', avatar: MOCK_USER_AVATARS['dr-marcus'], is_founder: true },
    conteudo: 'Rafael, exato. São 3 mecanismos simultâneos: 1) Antagonismo do GR - menos cortisol ativo = menos lipogênese visceral. 2) Aumento de IGF-1 local que sequestra nutrientes pro músculo. 3) Upregulation de receptores β-adrenérgicos no adipócito aumentando lipólise basal.',
  },
  {
    id: '5',
    tipo: 'ia',
    timestamp: '09:31',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'INSIGHT: Discussão técnica sobre mecanismos de reparticionamento. 34 membros online acompanhando.',
    ia_tipo: 'insight',
  },
  {
    id: '6',
    tipo: 'usuario',
    timestamp: '09:40',
    autor: { id: 'carlos-mendes', nome: 'Carlos Mendes', avatar: MOCK_USER_AVATARS['carlos-mendes'], is_premium: true },
    conteudo: 'E os colaterais? Sei que perfil lipídico colapsa. Como monitorar corretamente?',
  },
  {
    id: '7',
    tipo: 'usuario',
    timestamp: '09:48',
    autor: { id: 'dr-marcus', nome: 'Dr. Marcus', avatar: MOCK_USER_AVATARS['dr-marcus'], is_founder: true },
    conteudo: 'Carlos, obrigatório: hematócrito (risco de policitemia), lipidograma completo (HDL despenca, LDL oxida), função hepática e renal. Colaterais neurológicos também são reais — insônia, agressividade via modulação GABAérgica. Monitoramento constante é o mínimo.',
  },
  {
    id: '8',
    tipo: 'usuario',
    timestamp: '10:00',
    autor: { id: 'lucas-ferreira', nome: 'Lucas Ferreira', avatar: MOCK_USER_AVATARS['lucas-ferreira'], is_premium: true },
    conteudo: 'Mudando de assunto: comprei Fragment 176-191 mas não vi resultado nenhum. Aplicava sempre de manhã depois do café. Onde errei?',
  },
  {
    id: '9',
    tipo: 'usuario',
    timestamp: '10:08',
    autor: { id: 'dr-marcus', nome: 'Dr. Marcus', avatar: MOCK_USER_AVATARS['dr-marcus'], is_founder: true },
    conteudo: 'Lucas, aí está seu erro. Fragment é o segmento C-terminal do GH (aminoácidos 176-191). Ele apenas MOBILIZA gordura via ativação da HSL, mas NÃO OXIDA. Se aplicou pós-refeição com insulina alta, a insulina INIBIU a HSL via fosforilação inibitória. O Fragment nem conseguiu agir.',
  },
  {
    id: '10',
    tipo: 'usuario',
    timestamp: '10:15',
    autor: { id: 'lucas-ferreira', nome: 'Lucas Ferreira', avatar: MOCK_USER_AVATARS['lucas-ferreira'], is_premium: true },
    conteudo: 'Então qual o protocolo correto?',
  },
  {
    id: '11',
    tipo: 'usuario',
    timestamp: '10:22',
    autor: { id: 'dr-marcus', nome: 'Dr. Marcus', avatar: MOCK_USER_AVATARS['dr-marcus'], is_founder: true },
    conteudo: 'Protocolo que funciona: 1) Aplicação subcutânea em jejum prolongado (8-12h sem comer). 2) Aguardar 15-20min para pico plasmático. 3) AEJ de baixa-média intensidade (60-70% FC máx) por 30-45min. 4) NÃO comer carboidrato imediatamente após.',
  },
  {
    id: '12',
    tipo: 'usuario',
    timestamp: '10:30',
    autor: { id: 'lucas-ferreira', nome: 'Lucas Ferreira', avatar: MOCK_USER_AVATARS['lucas-ferreira'], is_premium: true },
    conteudo: 'Então sem o cardio em jejum, os ácidos graxos liberados simplesmente voltam pro adipócito?',
  },
  {
    id: '13',
    tipo: 'usuario',
    timestamp: '10:35',
    autor: { id: 'dr-marcus', nome: 'Dr. Marcus', avatar: MOCK_USER_AVATARS['dr-marcus'], is_founder: true },
    conteudo: 'Exatamente. Re-esterificação. Ciclo inútil. Você pagou caro por uma injeção que não fez nada. O Fragment MOBILIZA, o cardio OXIDA. A sinergia é OBRIGATÓRIA. Sem cardio em jejum = dinheiro jogado fora.',
  },
  {
    id: '14',
    tipo: 'ia',
    timestamp: '10:36',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'RESUMO: Protocolo Fragment 176-191 = Jejum 8-12h + Aplicação + Espera 15min + AEJ 60-70% FC por 30-45min. Sem cardio = ciclo inútil de mobilização/re-esterificação.',
    ia_tipo: 'resumo',
  },
  {
    id: '15',
    tipo: 'usuario',
    timestamp: '10:45',
    autor: { id: 'amanda-costa', nome: 'Amanda Costa', avatar: MOCK_USER_AVATARS['amanda-costa'] },
    conteudo: 'Dr. Marcus, e sobre BPC-157 pra recuperação de lesão? Estou com tendinite crônica há 6 meses.',
  },
  {
    id: '16',
    tipo: 'usuario',
    timestamp: '10:52',
    autor: { id: 'dr-marcus', nome: 'Dr. Marcus', avatar: MOCK_USER_AVATARS['dr-marcus'], is_founder: true },
    conteudo: 'Amanda, BPC-157 é um pentadecapeptídeo derivado de proteína gástrica. Promove angiogênese, aumenta expressão de GH receptors e acelera cicatrização de tendão/ligamento. Protocolo comum: 250-500mcg 2x/dia, subcutâneo próximo à lesão. Duração: 4-6 semanas. Combinação com TB-500 potencializa.',
  },
  {
    id: '17',
    tipo: 'ia',
    timestamp: '10:53',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'NOVO TÓPICO: Peptídeos para recuperação — BPC-157 e TB-500. Compartilhe suas experiências.',
    ia_tipo: 'insight',
  },
];

// ========================================
// NOVAS ARENAS (FASE 3) - MENSAGENS INICIAIS
// ========================================

const MENSAGENS_RECEITAS_SAUDAVEIS: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '10:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA RECEITAS SAUDÁVEIS! 🥗\n\nCompartilhe suas receitas fit favoritas e receba ANÁLISE NUTRICIONAL COMPLETA da IA!\n\n**Como funciona:**\n1. Você descreve a receita: ingredientes + modo de preparo + quantas porções\n2. IA analisa macros + classificação + horário ideal\n3. Você recebe sugestões de variações\n\n**O que a IA vai calcular:**\n✓ Calorias por porção\n✓ Proteínas, carboidratos, gorduras (detalhado)\n✓ Fibra + micronutrientes principais\n✓ Classificação: Low Carb / Cetogênica / Balanceada / High Protein\n✓ Horário ideal de consumo (manhã = carbs maiores, noite = protein-fat)\n✓ Sugestões de variações (substituições inteligentes)\n✓ Score de praticidade (tempo + ingredientes)\n\n**Exemplos de análise:**\n"Ovos mexidos com brócolis: 25g proteína, 8g carbs, 16g gordura = 260 calorias. Excelente café da manhã."\n"Panqueca proteína com aveia: low carb, 20g proteína, ótimo pré-treino."\n\n**Pontos-chave:**\n✓ Receita que você GOSTA > receita "perfeita" que você odeia\n✓ Simplicidade de preparo = maior chance de fazer\n✓ Ingredientes que você realmente tem em casa\n✓ Praticidade conta (marmita vale, receita de 10 ingredientes não)\n✓ Macros variam por objetivo (volume = carbs altos; definição = protein-fat altos)\n\n**Evitar:**\n✗ Receitas extremamente complicadas\n✗ Ingredientes "fit" caros que você não vai usar\n✗ Ignorar o gosto pessoal em prol de "nutrição"\n\nQual é sua receita favorita? Descreva detalhado pra gente analisar! 💚',
    ia_tipo: 'destaque',
  },
];

const MENSAGENS_EXERCICIOS_QUE_AMA: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '10:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA EXERCÍCIOS QUE VOCÊ AMA! 🏋️\n\nCompartilhe aquele exercício que te FAZ FELIZ e receba ANÁLISE BIOMECÂNICA COMPLETA da IA!\n\n**Como funciona:**\n1. Você descreve o exercício (movimento, carga, amplitude, como sente)\n2. IA analisa músculos + padrão + intensidade\n3. Você recebe variações, progressões e alternativas\n\n**O que a IA vai detalhar:**\n✓ Músculos ativados (primários + secundários)\n✓ Padrão de movimento (empurrar, puxar, agachar, rotação, etc)\n✓ Dificuldade relativa (iniciante, intermediário, avançado)\n✓ Equipamento necessário (ou alternativas)\n✓ Variações progressivas (mais difícil) e regressivas (mais fácil)\n✓ Alternativas para diferentes objetivos (hipertrofia vs força vs resistência)\n✓ Sinergias (que exercícios combinar bem)\n✓ Erros comuns que reduzem efetividade\n\n**Exemplos de análise:**\n"Hip thrust: glúteo máximo PRIMARY, quadríceps e hamstring secondary. Padrão: extensão de quadril. Progressão: pés elevados, banda de resistência, haltere."\n"Flexão de braço: peito PRIMARY, tríceps + deltóide anterior secondary. Regressão: na parede ou joelhos."\n\n**Pontos-chave:**\n✓ Exercício que você AMA > exercício que todo mundo faz\n✓ Músculos respondem ao PADRÃO DE MOVIMENTO, não ao nome\n✓ Amplitude completa > meia amplitude com carga pesada\n✓ Múltiplos exercícios = múltiplos ângulos = melhores ganhos\n✓ Variações previnem plateaus e lesões por uso repetitivo\n\n**Evitar:**\n✗ Exercícios que causam DOR (desconforto muscular ≠ dor articular)\n✗ Meio movimento com ego ("levanto mais peso")\n✗ Mesmos exercícios por anos sem variação\n\nQual é seu exercício favorito? Descreva e vamos analisar! 💪',
    ia_tipo: 'destaque',
  },
];

const MENSAGENS_SINAL_VERMELHO: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '10:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA SINAL VERMELHO! 🚨\n\nSentindo DOR ou DESCONFORTO AGUDO em algum exercício? Vamos investigar JUNTOS.\n\n**Como funciona:**\n1. Você descreve a dor (qual exercício, onde exatamente, quando piora, escala 1-10)\n2. IA faz 3-5 perguntas de diagnóstico específicas\n3. Você recebe análise + recomendações + "verde para médico?"\n\n**O que a gente identifica:**\n✓ Ajustes de técnica (80% dos casos): posição de mão, amplitude, instabilidade\n✓ Questões musculares/anatômicas (15%): desequilíbrio, encurtamento, fraqueza\n✓ Sinais de alerta para procurar médico (5%): possível lesão estrutural\n\n**Exemplos de investigação:**\n"Dor no ombro em supino?" → Perguntamos: (1) Dor durante movimento ou final? (2) Braço interno ou externo? (3) Amplitude que dói? → Pode ser técnica, mobilidade ou lesão\n"Dor no joelho em agachamento?" → Investigamos: (1) Qual parte do joelho? (2) Joelho cai para dentro? (3) Pé cava ou fica reto? → Frequentemente é falta de alinhamento\n\n**Pontos-chave:**\n✓ DESCONFORTO muscular (queimação, pompa) ≠ DOR articular (aguda, limitante)\n✓ Dor = sinal de alerta para PARAR aquele movimento\n✓ Técnica resolve 80% — é a primeira verificação\n✓ Mobilidade/flexibilidade resolve 15%\n✓ Se não melhora em 1-2 semanas = procurar profissional\n✓ Análise baseada em literatura científica, MAS NÃO substitui avaliação médica\n\n**Evitar:**\n✗ Treinar "passando pela dor" — é sintoma, não preguiça\n✗ Ignorar sinais repetidos (procurar médico/fisioterapeuta)\n✗ Acreditar que só repouso resolve (geralmente é técnica + repouso)\n✗ Descuidar de mobilidade e aquecimento\n\nDescreva sua dor em detalhes! Vamos investigar! 🎯',
    ia_tipo: 'destaque',
  },
];

const MENSAGENS_ASPIRACIONAL_ESTETICA: Mensagem[] = [
  {
    id: '1',
    tipo: 'ia',
    timestamp: '10:00',
    autor: { id: 'ia', nome: 'IA Facilitadora' },
    conteudo: 'BEM-VINDO(A) À ARENA ASPIRACIONAL & ESTÉTICA! 💎\n\nCompartilhe seus sonhos estéticos com BASE CIENTÍFICA e RESPONSABILIDADE.\n\n**Importante desde o início:**\nA IA não é cirurgião, não faz indicação. A IA questiona PREPARO, investiga MOTIVAÇÃO e fornece EDUCAÇÃO.\n\n**O que a IA vai orientar:**\n✓ Anatomia do procedimento (baseada em Tratados SBCP, Netter, Moore)\n✓ Realismo: o que cirurgia consegue fazer (e o que NÃO consegue)\n✓ Preparo físico necessário (estrutura é importante)\n✓ Nutrição pré/pós-operatória (que impacta cicatrização)\n✓ Quando procurar avaliação médica especializada\n✓ Riscos e contraindicações reais\n✓ Período de recuperação (não é magic wand)\n✓ Por que treino + dieta ANTES são fundamentais\n\n**Exemplos de investigação:**\n"Quero glúteo maior" → Ótimo! Antes: gluteoplastia de implante vs lipoenxertia? Objetivo realista? Você tem massa muscular base (treino resolveria 70%)? Estágio do lipedema (se tiver)?\n"Quero lipoaspiração" → Legal. Primeira: dieta e treino já foram testados? Lipoaspiração em zona não-tônica pode deixar pele flácida.\n"Blefaroplastia inferior" → Frequente em 40+. Primeiro: você dorme bem? (inchaço matinal ≠ ptose palpebral)\n\n**Pontos-chave:**\n✓ Cirurgia é COMPLEMENTO de estilo de vida saudável, NÃO SUBSTITUTO\n✓ Treino + nutrição resolvem 60-70% dos "problemas estéticos"\n✓ Você precisa estar com composição corporal boa PRÉ-operatório\n✓ Motivação honesta importa (pressão social ≠ desejo genuíno)\n✓ Especialista SBCP certificado é não-negociável\n✓ Cicatrização leva 12-18 meses (paciência)\n✓ Revisão pode ser necessária (realismo)\n✓ Foto de referência 3D é essencial (expectativa clara)\n\n**Investigação de motivação:**\nA IA vai questionar: (1) Por quê? (pressão vs genuíno) (2) Você tentou treino? (3) Aceitação + autoestima (sem cirurgia já está bem?) (4) Estágio de vida (antes filhos vs depois)\n\n**Evitar:**\n✗ Cirurgia como "cura" para baixa autoestima\n✗ Decisões impulsivas (IA vai questionar)\n✗ Pedir indicação de cirurgião (procure SBCP certificado)\n✗ Ter expectativa de mudança de personalidade pós-cirurgia\n✗ Negligenciar preparo físico (você vai se arrepender)\n\n**Regra de ouro:**\nSe você NÃO gosta de você mesmo agora, cirurgia não vai resolver. Cirurgia potencializa alguém que JÁ gosta de si mesmo.\n\nQual é seu sonho estético? Vamos conversar sobre REALISMO e PREPARO! 💚',
    ia_tipo: 'destaque',
  },
];

// ========================================
// DADOS DAS COMUNIDADES (11 COMUNIDADES - FASE 2)
// ========================================

const COMUNIDADES_DATA: Record<string, ComunidadeData & { mensagens: Mensagem[] }> = {
  // lipedema removido - buscar dados reais da API
  'lipedema-paradoxo': {
    titulo: 'Lipedema — Paradoxo do Cardio',
    descricao: 'Por que HIIT pode piorar o lipedema? Discussão técnica sobre o protocolo AEJ + compressão',
    membrosOnline: 28,
    totalMensagens: 634,
    mensagens: MENSAGENS_LIPEDEMA_PARADOXO,
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
  'performance-biohacking': {
    titulo: 'Performance & Biohacking',
    descricao: 'Protocolos de elite, farmacologia avançada e estratégias de redução de danos',
    membrosOnline: 34,
    totalMensagens: 1256,
    mensagens: MENSAGENS_PERFORMANCE_BIOHACKING,
  },
  'peptideos-research': {
    titulo: 'Peptídeos Research',
    descricao: 'Fragment 176-191, BPC-157, TB-500, Ipamorelin e outros peptídeos de pesquisa. Ciência, protocolos e redução de danos.',
    membrosOnline: 23,
    totalMensagens: 847,
    mensagens: MENSAGENS_PEPTIDEOS_RESEARCH,
  },
  'receitas-saudaveis': {
    titulo: 'Receitas Saudáveis',
    descricao: 'Compartilhe receitas fit e receba análise nutricional automática da IA',
    membrosOnline: 12,
    totalMensagens: 45,
    mensagens: MENSAGENS_RECEITAS_SAUDAVEIS,
  },
  'exercicios-que-ama': {
    titulo: 'Exercícios que Ama',
    descricao: 'Compartilhe exercícios que você AMA fazer e receba análise biomecânica da IA',
    membrosOnline: 18,
    totalMensagens: 67,
    mensagens: MENSAGENS_EXERCICIOS_QUE_AMA,
  },
  // sinal-vermelho removido - buscar dados reais da API
  'aspiracional-estetica': {
    titulo: '💎 Aspiracional & Estética',
    descricao: 'Sonhos estéticos com base científica e responsabilidade',
    membrosOnline: 14,
    totalMensagens: 38,
    mensagens: MENSAGENS_ASPIRACIONAL_ESTETICA,
  },
  'postura-estetica': {
    titulo: '🧍 Postura & Estética Real',
    descricao: 'Discussões sobre estética corporal sob a ótica da postura e biomecânica',
    membrosOnline: 0,
    totalMensagens: 0,
    mensagens: [],
  },
  'avaliacao-assimetrias': {
    titulo: '📐 Avaliação Biométrica & Assimetrias',
    descricao: 'Espaço para discussões sobre leitura corporal, assimetrias e análise biométrica por IA',
    membrosOnline: 0,
    totalMensagens: 0,
    mensagens: [],
  },
  'dor-funcao-saude': {
    titulo: '🩺 Dor, Função & Saúde Postural',
    descricao: 'Explore a relação entre postura, dor e função corporal',
    membrosOnline: 0,
    totalMensagens: 0,
    mensagens: [],
  },
  'avaliacao-fisica-foto': {
    titulo: '📸 Avaliação Física por Foto',
    descricao: 'Envie suas fotos para análise biométrica completa com IA',
    membrosOnline: 0,
    totalMensagens: 0,
    mensagens: [],
  },
  'hub-avaliacao-fisica': {
    titulo: '🏋️ Hub Avaliação Física',
    descricao: 'Central de avaliação física com ferramentas de análise corporal',
    membrosOnline: 0,
    totalMensagens: 0,
    mensagens: [],
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
      autor: { id: 'lucia-ferreira', nome: 'Lucia Ferreira', avatar: MOCK_USER_AVATARS['lucia-ferreira'] },
      conteudo: 'Gente, acabei de descobrir que tenho lipedema estágio 2. Vocês podem me indicar por onde começar?',
      isNew: true,
    },
    {
      id: 'new-2',
      tipo: 'ia',
      timestamp: '15:02',
      autor: { id: 'ia', nome: 'IA Facilitadora' },
      conteudo: 'SEJA BEM-VINDO(A) LUCIA! Leia as mensagens anteriores sobre dieta anti-inflamatória. 47 membros online prontos para ajudar.',
      ia_tipo: 'insight',
      isNew: true,
    },
  ],
  'lipedema-paradoxo': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '15:45',
      autor: { id: 'fernanda-alves', nome: 'Fernanda Alves', avatar: MOCK_USER_AVATARS['fernanda-alves'], is_premium: true },
      conteudo: 'Fiz 2 semanas de AEJ com compressão e a diferença no inchaço é absurda! Obrigada pelas dicas técnicas.',
      isNew: true,
    },
    {
      id: 'new-2',
      tipo: 'ia',
      timestamp: '15:46',
      autor: { id: 'ia', nome: 'IA Facilitadora' },
      conteudo: 'DESTAQUE: Fernanda relatou melhora com protocolo AEJ + compressão. 28 membros online acompanhando.',
      ia_tipo: 'destaque',
      isNew: true,
    },
  ],
  'deficit-calorico': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '10:35',
      autor: { id: 'gabriel-lima', nome: 'Gabriel Lima', avatar: MOCK_USER_AVATARS['gabriel-lima'], is_premium: true },
      conteudo: 'Alguém aqui usa app pra contar calorias? MyFitnessPal tá cheio de bug ultimamente.',
      isNew: true,
    },
  ],
  'treino-gluteo': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '09:15',
      autor: { id: 'fernanda-lima', nome: 'Fernanda Lima', avatar: MOCK_USER_AVATARS['fernanda-lima'] },
      conteudo: 'Elevação pélvica com barra ou com anilha? Qual vocês preferem?',
      isNew: true,
    },
  ],
  canetas: [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '14:02',
      autor: { id: 'bruno-santos', nome: 'Bruno Santos', avatar: MOCK_USER_AVATARS['bruno-santos'], is_premium: true },
      conteudo: 'Pessoal, alguém sabe se pode tomar creatina junto com Ozempic? Meu treino está sofrendo...',
      isNew: true,
    },
  ],
  'odeia-treinar': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '11:40',
      autor: { id: 'larissa-costa', nome: 'Larissa Costa', avatar: MOCK_USER_AVATARS['larissa-costa'] },
      conteudo: 'Descobri que bike na rua me motiva muito mais que na academia. Alguém mais?',
      isNew: true,
    },
  ],
  'ansiedade-alimentacao': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '20:45',
      autor: { id: 'roberto-silva', nome: 'Roberto Silva', avatar: MOCK_USER_AVATARS['roberto-silva'] },
      conteudo: 'Alguém aqui conseguiu parar de comer por ansiedade? Como vocês fizeram?',
      isNew: true,
    },
  ],
  'emagrecimento-35-mais': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '15:45',
      autor: { id: 'regina-alves', nome: 'Regina Alves', avatar: MOCK_USER_AVATARS['regina-alves'], is_premium: true },
      conteudo: 'Alguém fez exames hormonais e descobriu algo que mudou tudo? Quais exames pediram?',
      isNew: true,
    },
  ],
  'antes-depois': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '09:50',
      autor: { id: 'miguel-santos', nome: 'Miguel Santos', avatar: MOCK_USER_AVATARS['miguel-santos'], is_premium: true },
      conteudo: 'Finalmente perdi 25kg em 1 ano! Sem pressa, sem dieta maluca. Só constância.',
      isNew: true,
    },
  ],
  'dieta-vida-real': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '12:55',
      autor: { id: 'carla-mendes', nome: 'Carla Mendes', avatar: MOCK_USER_AVATARS['carla-mendes'] },
      conteudo: 'Gente, como vocês lidam com viagem a trabalho? Minha dieta vai pro espaço toda vez.',
      isNew: true,
    },
  ],
  'treino-casa': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '08:15',
      autor: { id: 'raquel-ferreira', nome: 'Raquel Ferreira', avatar: MOCK_USER_AVATARS['raquel-ferreira'], is_premium: true },
      conteudo: 'Alguém tem sugestão de elástico bom pra comprar? Quero começar a usar mas não sei qual resistência escolher.',
      isNew: true,
    },
  ],
  'performance-biohacking': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '11:20',
      autor: { id: 'pedro-costa', nome: 'Pedro Costa', avatar: MOCK_USER_AVATARS['pedro-costa'], is_premium: true },
      conteudo: 'Alguém já usou BPC-157 pra recuperação de lesão? Estou com tendinite crônica e queria saber se vale a pena.',
      isNew: true,
    },
    {
      id: 'new-2',
      tipo: 'ia',
      timestamp: '11:21',
      autor: { id: 'ia', nome: 'IA Facilitadora' },
      conteudo: 'NOVO TÓPICO: Peptídeos para recuperação de lesões. 34 membros online prontos para compartilhar experiências.',
      ia_tipo: 'insight',
      isNew: true,
    },
  ],
  'peptideos-research': [
    {
      id: 'new-1',
      tipo: 'usuario',
      timestamp: '14:35',
      autor: { id: 'rafael-costa', nome: 'Rafael Costa', avatar: MOCK_USER_AVATARS['rafael-costa'], is_premium: true },
      conteudo: 'Pessoal, qual a melhor hora pra aplicar Fragment antes do AEJ? 30 min antes ou menos?',
      isNew: true,
    },
    {
      id: 'new-2',
      tipo: 'ia',
      timestamp: '14:36',
      autor: { id: 'ia', nome: 'IA Facilitadora' },
      conteudo: 'NOVO TÓPICO: Timing de aplicação do Fragment 176-191. 23 membros online discutindo protocolos.',
      ia_tipo: 'insight',
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
  currentUserId,
  isEditing,
  onLoginRequired,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: {
  mensagem: Mensagem;
  isNew?: boolean;
  communitySlug: string;
  currentUserId?: string;
  isEditing?: boolean;
  onLoginRequired?: () => void;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (newContent: string) => Promise<void>;
  onDelete?: () => void;
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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 flex-wrap">
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

            {/* Indicador de editado */}
            {!isIA && mensagem.isEdited && (
              <span className="text-[10px] text-zinc-500 italic">
                (editado)
              </span>
            )}
          </div>

          {/* Botão de ações (editar/excluir) */}
          {!isIA && currentUserId && onStartEdit && onDelete && (
            <MessageActions
              messageId={mensagem.id}
              authorId={mensagem.autor.id}
              currentUserId={currentUserId}
              createdAt={mensagem.createdAt || new Date().toISOString()}
              onEdit={onStartEdit}
              onDelete={onDelete}
            />
          )}
        </div>

        {/* Conteúdo da mensagem ou editor */}
        {isEditing && onSaveEdit && onCancelEdit ? (
          <EditableMessage
            messageId={mensagem.id}
            initialContent={mensagem.conteudo}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            {isIA ? (
              <div
                className={`
                  text-sm leading-relaxed prose prose-invert prose-sm max-w-none
                  ${iaTextColors[mensagem.ia_tipo || 'insight']}
                  prose-headings:${iaTextColors[mensagem.ia_tipo || 'insight']}
                  prose-strong:${iaTextColors[mensagem.ia_tipo || 'insight']}
                  prose-ul:text-zinc-300
                  prose-li:text-zinc-300
                  prose-p:text-zinc-300
                `}
              >
                <ReactMarkdown>
                  {mensagem.conteudo}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-zinc-300">
                {mensagem.conteudo}
              </p>
            )}

            {mensagem.imagens && mensagem.imagens.length > 0 && (
              <ImageGallery images={mensagem.imagens} />
            )}
          </>
        )}

        {!isEditing && (
          <div className="mt-2 pt-2">
            <ReactionPicker
              messageId={mensagem.id}
              communitySlug={communitySlug}
              onLoginRequired={onLoginRequired}
            />
          </div>
        )}
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
// COMPONENTE: Arena Premium NFV (Biomecânica)
// ========================================

function PremiumArenaPage({
  slug,
  arenaConfig,
  fpBalance,
  isAuthenticated,
  isPremium,
  userId,
  userName,
  lastEarned,
  clearLastEarned,
}: {
  slug: string;
  arenaConfig: any;
  fpBalance: number;
  isAuthenticated: boolean;
  isPremium: boolean;
  userId?: string;
  userName?: string;
  lastEarned: any;
  clearLastEarned: () => void;
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const canUpload = isAuthenticated && (isPremium || fpBalance >= 25);

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
      }}
    >
      <FPToastManager lastEarned={lastEarned} onClear={clearLastEarned} />

      {/* Header da Arena Premium */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/comunidades/hub-biomecanico" className="text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5" style={{ color: arenaConfig?.color || '#8b5cf6' }} />
                <h1 className="text-lg font-bold text-white">
                  {arenaConfig?.name || slug}
                </h1>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">
                  NFV PREMIUM
                </span>
              </div>
            </div>

            {/* Botão Upload */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Faça login para enviar vídeos para análise.');
                  return;
                }
                if (!isPremium && fpBalance < 25) {
                  alert(`Você precisa de 25 FP para enviar um vídeo.\nSeu saldo atual: ${fpBalance} FP.\n\nGanhe FP participando das comunidades!`);
                  return;
                }
                setShowUploadModal(true);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                canUpload
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Enviar Vídeo
              {isPremium ? (
                <span className="text-[10px] text-green-400 font-bold">GRATUITO</span>
              ) : (
                <span className="text-[10px] opacity-75">25 FP</span>
              )}
            </button>
          </div>

          <p className="text-xs text-zinc-500 mt-2 ml-8">
            Envie seu vídeo de exercício e receba análise biomecânica detalhada com IA + revisão profissional em 48h.
          </p>
        </div>
      </div>

      {/* Conteúdo Principal - Análises + Galeria */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Análises Biomecânicas (Sidebar) */}
          <div className="lg:col-span-1">
            <CommunityBiomechanicsWidget communitySlug={slug} limit={8} />
          </div>

          {/* Galeria de Vídeos (Main) */}
          <div className="lg:col-span-2">
            <VideoGallery
              arenaSlug={slug}
              onSelectAnalysis={(id) => {
                window.location.href = `/comunidades/${slug}/videos/${id}`;
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      {showUploadModal && userId && (
        <VideoUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          arenaSlug={slug}
          arenaName={arenaConfig?.name || slug}
          movementPattern={arenaConfig?.pattern || slug}
          requiresFP={isPremium ? 0 : 25}
          userId={userId}
          userName={userName || 'Usuário'}
          isPremium={isPremium}
        />
      )}
    </div>
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

export default function PainelVivoPage() {
  // useParams é um hook de Client Component - seguro para usar aqui
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const { user, isAuthenticated } = useComunidadesAuth();
  const { isOpen, interactionType, openModal, closeModal } = useLoginRequiredModal();
  const { analisarConversa, notificarRespostaUsuario } = useIAFacilitadora();

  // Sistema de Moderação IA v3 - Acolhimento
  const { moderatePost, isProcessing: isModerating } = useAIModerator();
  const {
    currentCelebration,
    dismissCelebration,
    processModerationResult,
    hasCelebrations,
  } = useCelebrations();

  // Sistema de FP
  const {
    balance: fpBalance,
    streak: fpStreak,
    loading: fpLoading,
    earnFP,
    claimDailyBonus,
    lastEarned,
    clearLastEarned,
    refresh: refreshFP,
  } = useFP();

  const [comunidade, setComunidade] = useState<(ComunidadeData & { mensagens: Mensagem[] }) | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novasMensagensCount, setNovasMensagensCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // Stats REAIS da arena (auto-refresh 15s)
  const { stats: arenaStats } = useArenaStats(slug || null);

  // Handlers para edição e exclusão de mensagens
  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/comunidades/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao editar mensagem');
      }

      // Atualizar mensagem localmente
      setMensagens(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, conteudo: newContent, isEdited: true, editedAt: new Date().toISOString() }
            : m
        )
      );

      setEditingMessageId(null);
    } catch (error: any) {
      console.error('Erro ao editar mensagem:', error);
      throw error;
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/comunidades/messages/${messageId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao excluir mensagem');
      }

      // Remover mensagem da lista (UI otimista)
      setMensagens(prev => prev.filter(m => m.id !== messageId));

      // Atualizar saldo de FP (a API já removeu os FPs no banco)
      await refreshFP();

      // Mostrar mensagem de sucesso
      if (result.fpRemoved && result.fpRemoved > 0) {
        alert(`✅ Mensagem deletada!\n\n⚠️ ${result.fpRemoved} FP foi removido do seu saldo.`);
      } else {
        alert('✅ Mensagem deletada com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao excluir mensagem:', error);
      alert(`❌ Erro ao excluir mensagem\n\n${error.message || 'Tente novamente.'}`);
    }
  };

  // Carregar dados REAIS da API (não usar COMUNIDADES_DATA mock)
  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    const loadCommunityData = async () => {
      try {
        // Buscar dados da arena da API
        const arenaResponse = await fetch(`/api/arenas`);
        const arenas = await arenaResponse.json();
        const arena = arenas.find((a: any) => a.slug === slug);

        if (!arena) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }

        // Converter arena para formato ComunidadeData
        setComunidade({
          titulo: arena.name,
          descricao: arena.description,
          membrosOnline: arena.dailyActiveUsers || 0,
          totalMensagens: arena.totalPosts || 0,
          mensagens: [],
        });

        // Carregar posts da API
        const postsResponse = await fetch(`/api/comunidades/posts-comments?slug=${slug}`);
        const result = await postsResponse.json();

        if (result.mensagens && result.mensagens.length > 0) {
          setMensagens(result.mensagens);
        } else {
          setMensagens([]);
        }

        setNotFound(false);
      } catch (error) {
        console.error('Erro ao carregar comunidade:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommunityData();
  }, [slug]);

  // Claim daily FP bonus ao acessar comunidade
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Tenta claim do bônus diário (API valida se já foi feito hoje)
      claimDailyBonus();
    }
  }, [isAuthenticated, isLoading, claimDailyBonus]);

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

    // Criar mensagem temporária para UI imediata
    const tempId = `user-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const novaMensagem: Mensagem = {
      id: tempId,
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
      createdAt,
      isEdited: false,
      editedAt: null,
    };

    // Adicionar à UI imediatamente (otimistic update)
    setMensagens(prev => [...prev, novaMensagem]);

    // Salvar no banco de dados via API
    let realMessageId = tempId;
    try {
      const response = await fetch('/api/comunidades/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          content: message,
        }),
      });

      if (!response.ok) {
        console.error('Erro ao salvar mensagem no banco');
      } else {
        const result = await response.json();
        // Atualizar ID da mensagem com o ID real do banco
        if (result.mensagem?.id) {
          realMessageId = result.mensagem.id;
          setMensagens(prev =>
            prev.map(m => m.id === tempId ? {
              ...m,
              id: result.mensagem.id,
              createdAt: result.mensagem.createdAt || m.createdAt,
            } : m)
          );
        }
      }
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }

    // Ganhar FP por mensagem APÓS salvar (para ter messageId correto)
    // API detecta automaticamente: pergunta (+5) ou mensagem (+2) + bônus longa (+3)
    earnFP(FP_CONFIG.ACTIONS.MESSAGE, {
      messageLength: message.length,
      messageContent: message,  // Para detectar perguntas (termina com "?")
      roomId: slug,
      messageId: realMessageId,  // ID real da mensagem para rastrear FP
    }).catch(console.error);

    // Notificar sistema de tracking da IA sobre nova mensagem (para detectar respostas)
    notificarRespostaUsuario(
      user.id,
      slug,
      message,
      realMessageId  // Usar ID real da mensagem
    ).catch(console.error); // Fire and forget, não bloqueia UI

    // ========================================
    // SISTEMA DE MODERAÇÃO IA v3 - Acolhimento
    // Prioridade: welcome > emotional > misinformation
    // ========================================
    try {
      console.log('🚀 [VERSÃO DEBUG v1.0] Moderação iniciada');
      console.log('[Moderação] Chamando moderatePost para:', { slug, message: message.substring(0, 100) });

      const moderationResult = await moderatePost({
        userId: user.id,
        userName: user.nome,
        content: message,
        communitySlug: slug,
        communityName: comunidade?.titulo,
        messageId: realMessageId,
        checkStreak: true,
        checkFPMilestone: true,
      });

      console.log('✅ [Moderação] Resultado completo:', JSON.stringify(moderationResult, null, 2));

      if (moderationResult) {
        console.log('🔵 [Moderação] moderationResult existe');
        console.log('🔵 [Moderação] shouldRespond:', moderationResult.moderation?.shouldRespond);
        console.log('🔵 [Moderação] response:', moderationResult.moderation?.response ? 'SIM (tem resposta)' : 'NÃO (sem resposta)');

        // Processar celebrações (streak, FP milestone)
        processModerationResult(moderationResult);

        // Se moderação decidiu responder (welcome, emotional support, misinformation, nutrition, exercise, etc)
        if (moderationResult.moderation?.shouldRespond && moderationResult.moderation?.response) {
          console.log('✅ [Moderação] IA vai responder! Tipo:', moderationResult.moderation.responseType);

          const mensagemModerador: Mensagem = {
            id: moderationResult.moderation.interventionId || `ia-mod-${Date.now()}`,
            tipo: 'ia',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            autor: { id: 'ia', nome: 'IA Facilitadora' },
            conteudo: moderationResult.moderation.response,
            ia_tipo: moderationResult.moderation.responseType === 'welcome' ? 'insight' :
                     moderationResult.moderation.responseType === 'emotional_support' ? 'destaque' :
                     moderationResult.moderation.responseType === 'misinformation' ? 'destaque' :
                     moderationResult.moderation.responseType === 'achievement' ? 'destaque' :
                     moderationResult.moderation.responseType === 'nutrition_analysis' ? 'destaque' :
                     moderationResult.moderation.responseType === 'biomechanics_analysis' ? 'destaque' :
                     moderationResult.moderation.responseType === 'investigation_question' ? 'pergunta' :
                     moderationResult.moderation.responseType === 'aesthetic_education' ? 'insight' : 'pergunta',
            isNew: true,
          };

          // Delay para parecer mais natural
          console.log('🎯 [Moderação] Agendando mensagem da IA com delay de 1.5s');
          setTimeout(() => {
            console.log('💬 [Moderação] ADICIONANDO mensagem da IA ao chat:', {
              id: mensagemModerador.id,
              tipo: mensagemModerador.ia_tipo,
              preview: mensagemModerador.conteudo.substring(0, 100),
            });
            setMensagens(prev => [...prev, mensagemModerador]);
            if (moderationResult.moderation.responseType === 'welcome') {
              setHasWelcomed(true);
            }
          }, 1500);

          // Se moderação já respondeu, não precisa da IA legacy
          return;
        } else {
          console.log('⚠️ [Moderação] IA NÃO vai responder:', {
            temModerationResult: !!moderationResult,
            temModeration: !!moderationResult?.moderation,
            shouldRespond: moderationResult?.moderation?.shouldRespond,
            temResponse: !!moderationResult?.moderation?.response,
          });
        }
      } else {
        console.log('⚠️ [Moderação] moderationResult é NULL ou undefined');
      }
    } catch (error) {
      console.error('🔴 [Moderação] Erro:', error);
      // Continua com IA legacy se moderação falhar
    }

    // ========================================
    // IA LEGACY - Facilitadora (perguntas, técnico, blog)
    // Só executa se moderação não respondeu
    // ========================================

    // Verificar se é a primeira mensagem do usuário (boas-vindas fallback)
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

      const resultadoIA = await analisarConversa(
        mensagensParaIA,
        comunidade?.titulo || '',
        slug,
        user.id
      );

      const respostaIA = resultadoIA.resposta;

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
          conteudo: `Olá, ${user.nome}! 💜 Que bom ter você aqui na comunidade. Fique à vontade para compartilhar suas experiências e tirar dúvidas. Estamos juntos nessa jornada!`,
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
          conteudo: `Olá, ${user.nome}! 💜 Sua participação é muito importante para nossa comunidade. Compartilhe suas experiências!`,
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

  // NFV Hub - Layout especial biomecanico (antes do notFound check)
  if (!isLoading && isNFVHub(slug)) {
    return <NFVHub />;
  }

  // NFV Premium Arena - Layout com galeria de videos (antes do notFound check)
  if (!isLoading && isPremiumNFVArena(slug)) {
    const arenaConfig = getPremiumArenaConfig(slug);
    return (
      <PremiumArenaPage
        slug={slug}
        arenaConfig={arenaConfig}
        fpBalance={fpBalance}
        isAuthenticated={isAuthenticated}
        isPremium={user?.is_premium || false}
        userId={user?.id}
        userName={user?.nome || user?.name}
        lastEarned={lastEarned}
        clearLastEarned={clearLastEarned}
      />
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
      {/* FP Toast Notifications */}
      <FPToastManager lastEarned={lastEarned} onClear={clearLastEarned} />

      {/* Celebration Toast (Streak / FP Milestone) */}
      {hasCelebrations && currentCelebration && (
        <div className="fixed top-20 right-4 z-50 animate-slideDown">
          <div
            className={`
              p-4 rounded-xl border backdrop-blur-md shadow-lg max-w-sm
              ${currentCelebration.type === 'streak'
                ? 'bg-orange-500/10 border-orange-500/30'
                : 'bg-purple-500/10 border-purple-500/30'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${currentCelebration.type === 'streak' ? 'animate-pulse' : ''}`}>
                {currentCelebration.type === 'streak' ? '🔥' : '🏆'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white whitespace-pre-line">
                  {currentCelebration.response}
                </p>
                {currentCelebration.fpBonus && (
                  <p className="text-xs text-emerald-400 mt-1 font-semibold">
                    +{currentCelebration.fpBonus} FP bônus!
                  </p>
                )}
              </div>
              <button
                onClick={dismissCelebration}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <span className="sr-only">Fechar</span>
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

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

              {/* Contador REAL de mensagens no feed */}
              {mensagens.length > 0 && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <MessageSquare className="w-3 h-3" />
                    <span>{mensagens.length} mensagens</span>
                  </div>
                </div>
              )}
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
                {comunidade.descricao && (
                  <p className="text-sm text-zinc-400 mt-1">
                    {comunidade.descricao}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* FP Display */}
                {isAuthenticated && (
                  <FPDisplayCompact
                    balance={fpBalance}
                    streak={fpStreak}
                    loading={fpLoading}
                  />
                )}
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
          {/* Dicas de Foto (arenas biometricas) */}
          {slug === 'avaliacao-fisica-foto' && (
            <div className="px-4 mb-4">
              <DicasFotoBiometrica />
            </div>
          )}

          <div className="space-y-0 divide-y divide-white/5">
            {mensagens.map((mensagem, index) => (
              <MensagemItem
                key={`${mensagem.id}-${index}`}
                mensagem={mensagem}
                isNew={mensagem.isNew}
                communitySlug={slug}
                currentUserId={user?.id}
                isEditing={editingMessageId === mensagem.id}
                onLoginRequired={() => openModal('reagir')}
                onStartEdit={() => setEditingMessageId(mensagem.id)}
                onCancelEdit={() => setEditingMessageId(null)}
                onSaveEdit={(newContent) => handleEditMessage(mensagem.id, newContent)}
                onDelete={() => handleDeleteMessage(mensagem.id)}
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
