import { Metadata } from 'next';
import ChatLayoutClient from './ChatLayoutClient';

export const metadata: Metadata = {
  title: 'Dra. Sofia IA 💕 | NutriFitCoach',
  description: 'Converse com Dra. Sofia, sua nutricionista virtual especializada em saúde feminina. IA personalizada para nutrição, treino e bem-estar 24/7. ✨',
  keywords: ['nutricionista virtual', 'IA nutrição', 'saúde feminina', 'coach fitness', 'NutriFitCoach'],
  openGraph: {
    title: 'Dra. Sofia IA 💕 | NutriFitCoach',
    description: 'Sua coach de saúde pessoal com inteligência artificial especializada em nutrição feminina ✨',
    type: 'website',
    images: [
      {
        url: '/og-chat.png',
        width: 1200,
        height: 630,
        alt: 'Dra. Sofia - Chat IA NutriFitCoach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dra. Sofia IA 💕 | NutriFitCoach',
    description: 'Sua coach de saúde pessoal com inteligência artificial ✨',
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
}
