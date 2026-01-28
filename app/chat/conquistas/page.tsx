'use client';

/**
 * Conquistas Page - Gamification Hub
 * ===================================
 *
 * Página dedicada às conquistas e gamificação
 * Mostra badges, FitPoints e progresso
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import UniversalHeader, { UniversalUser } from '@/components/shared/UniversalHeader';
import { GamificationBadges } from '../components';
import type { Badge } from '../components/GamificationBadges';

// Mock badges data
const mockBadges: Badge[] = [
  // Streak badges
  { id: 's1', name: 'Primeira Faísca', description: 'Complete 3 dias consecutivos', icon: '🔥', category: 'streak', rarity: 'common', unlocked: true, unlockedAt: new Date('2024-01-05') },
  { id: 's2', name: 'Chama Acesa', description: 'Complete 7 dias consecutivos', icon: '🌟', category: 'streak', rarity: 'rare', unlocked: true, unlockedAt: new Date('2024-01-10') },
  { id: 's3', name: 'Fogo Ardente', description: 'Complete 14 dias consecutivos', icon: '💎', category: 'streak', rarity: 'epic', unlocked: true, unlockedAt: new Date('2024-01-20') },
  { id: 's4', name: 'Chama Imortal', description: 'Complete 30 dias consecutivos', icon: '👑', category: 'streak', rarity: 'legendary', unlocked: false, progress: 15, maxProgress: 30 },

  // Messages badges
  { id: 'm1', name: 'Primeira Conversa', description: 'Envie sua primeira mensagem', icon: '💬', category: 'messages', rarity: 'common', unlocked: true, unlockedAt: new Date('2024-01-01') },
  { id: 'm2', name: 'Comunicadora', description: 'Envie 50 mensagens', icon: '📝', category: 'messages', rarity: 'common', unlocked: true, unlockedAt: new Date('2024-01-08') },
  { id: 'm3', name: 'Exploradora', description: 'Envie 100 mensagens', icon: '🧭', category: 'messages', rarity: 'rare', unlocked: true, unlockedAt: new Date('2024-01-15') },
  { id: 'm4', name: 'Entusiasta', description: 'Envie 250 mensagens', icon: '💪', category: 'messages', rarity: 'rare', unlocked: true, unlockedAt: new Date('2024-01-25') },
  { id: 'm5', name: 'Mestre da Conversa', description: 'Envie 500 mensagens', icon: '🏆', category: 'messages', rarity: 'epic', unlocked: false, progress: 342, maxProgress: 500 },
  { id: 'm6', name: 'Lenda', description: 'Envie 1000 mensagens', icon: '⭐', category: 'messages', rarity: 'legendary', unlocked: false, progress: 342, maxProgress: 1000 },

  // Engagement badges
  { id: 'e1', name: 'Primeira Curtida', description: 'Curta uma resposta da IA', icon: '❤️', category: 'engagement', rarity: 'common', unlocked: true, unlockedAt: new Date('2024-01-02') },
  { id: 'e2', name: 'Colecionadora', description: 'Salve 20 mensagens', icon: '📚', category: 'engagement', rarity: 'common', unlocked: true, unlockedAt: new Date('2024-01-12') },
  { id: 'e3', name: 'Fã Número 1', description: 'Curta 100 respostas', icon: '💕', category: 'engagement', rarity: 'rare', unlocked: true, unlockedAt: new Date('2024-01-18') },
  { id: 'e4', name: 'Compartilhadora', description: 'Compartilhe 10 insights', icon: '🔗', category: 'engagement', rarity: 'rare', unlocked: false, progress: 4, maxProgress: 10 },

  // Nutrition badges
  { id: 'n1', name: 'Curiosa Nutricional', description: 'Pergunte sobre nutrição', icon: '🥗', category: 'nutrition', rarity: 'common', unlocked: true, unlockedAt: new Date('2024-01-03') },
  { id: 'n2', name: 'Aprendiz de Chef', description: 'Peça 10 receitas saudáveis', icon: '👩‍🍳', category: 'nutrition', rarity: 'rare', unlocked: false, progress: 6, maxProgress: 10 },
  { id: 'n3', name: 'Expert em Macros', description: 'Pergunte sobre macronutrientes 50x', icon: '📊', category: 'nutrition', rarity: 'epic', unlocked: false, progress: 23, maxProgress: 50 },

  // Fitness badges
  { id: 'f1', name: 'Em Movimento', description: 'Pergunte sobre exercícios', icon: '🏃‍♀️', category: 'fitness', rarity: 'common', unlocked: true, unlockedAt: new Date('2024-01-04') },
  { id: 'f2', name: 'Atleta em Formação', description: 'Peça 20 sugestões de treino', icon: '💪', category: 'fitness', rarity: 'rare', unlocked: false, progress: 12, maxProgress: 20 },
  { id: 'f3', name: 'Guerreira Fitness', description: 'Complete desafios de treino', icon: '🏅', category: 'fitness', rarity: 'epic', unlocked: false, progress: 0, maxProgress: 10 },

  // Special badges
  { id: 'sp1', name: 'Early Adopter', description: 'Entrou no primeiro mês', icon: '🌟', category: 'special', rarity: 'epic', unlocked: true, unlockedAt: new Date('2024-01-01') },
  { id: 'sp2', name: 'Fundadora', description: 'Apoiou desde o início', icon: '👑', category: 'special', rarity: 'legendary', unlocked: false },
  { id: 'sp3', name: 'Feedback Champion', description: 'Deu 5 feedbacks construtivos', icon: '💎', category: 'special', rarity: 'rare', unlocked: false, progress: 2, maxProgress: 5 },
];

export default function ConquistasPage() {
  const [user, setUser] = useState<UniversalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'Maria Silva',
        email: 'maria@example.com',
        image: null,
        is_premium: true,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <UniversalHeader
        variant="chat"
        user={user}
        isLoading={isLoading}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Chat
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">Suas Conquistas</h1>
          <p className="text-zinc-400">
            Acompanhe seu progresso e desbloqueie recompensas incríveis!
          </p>
        </motion.div>

        {/* Gamification Content */}
        <GamificationBadges
          badges={mockBadges}
          totalFP={12580}
          streak={15}
        />
      </main>
    </div>
  );
}
