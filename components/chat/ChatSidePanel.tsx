'use client';

/**
 * ChatSidePanel - Painel Lateral de Insights
 * ==========================================
 *
 * Painel com stats, conquistas e checklist
 * Design feminino e motivacional 💕✨
 */

import React, { useState } from 'react';
import {
  X,
  Flame,
  Droplet,
  Trophy,
  Sparkles,
  Check,
  ChevronRight,
  Target,
  TrendingUp,
  Heart,
  Calendar,
  Bell,
} from 'lucide-react';
import { StreakBadge, AchievementBadge } from './AchievementBadge';

export interface UserStats {
  calories: { current: number; target: number };
  water: { current: number; target: number };
  protein: { current: number; target: number };
  streak: number;
}

export interface Achievement {
  icon: string;
  title: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  time?: string;
}

export interface Insight {
  type: 'success' | 'warning' | 'info';
  message: string;
  emoji: string;
}

export interface ChatSidePanelProps {
  user: {
    name: string;
    photo?: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
  };
  stats: UserStats;
  achievements: Achievement[];
  checklist: ChecklistItem[];
  insights: Insight[];
  onClose?: () => void;
  onCheckItem?: (id: string) => void;
  className?: string;
}

const defaultUser = {
  name: 'Ana',
  level: 12,
  xp: 2340,
  xpToNextLevel: 3000,
};

const defaultStats: UserStats = {
  calories: { current: 1200, target: 1800 },
  water: { current: 1.5, target: 2.5 },
  protein: { current: 65, target: 90 },
  streak: 12,
};

const defaultAchievements: Achievement[] = [
  { icon: '🔥', title: '7 dias seguidos!', unlocked: true },
  { icon: '💪', title: '10 treinos completos', unlocked: true },
  { icon: '🎯', title: 'Meta de proteína 30 dias', unlocked: false, progress: 23, total: 30 },
];

const defaultChecklist: ChecklistItem[] = [
  { id: '1', text: 'Café da manhã registrado ☀️', checked: true, time: '7h' },
  { id: '2', text: 'Treino matinal 🏃‍♀️', checked: true, time: '8h' },
  { id: '3', text: 'Almoço às 12h 🥗', checked: false, time: '12h' },
  { id: '4', text: 'Treino de força às 18h 💪', checked: false, time: '18h' },
  { id: '5', text: 'Jantar até 20h 🍽️', checked: false, time: '20h' },
  { id: '6', text: 'Beber 2L de água 💧', checked: false },
];

const defaultInsights: Insight[] = [
  { type: 'success', emoji: '💪', message: 'Você está 20% acima da meta de proteínas esta semana! Arrasou!' },
  { type: 'warning', emoji: '💧', message: 'Hidratação baixa nos últimos 3 dias. Beba mais água, linda!' },
  { type: 'info', emoji: '🌸', message: 'Fase folicular detectada. Momento perfeito para treinos intensos!' },
];

export default function ChatSidePanel({
  user = defaultUser,
  stats = defaultStats,
  achievements = defaultAchievements,
  checklist = defaultChecklist,
  insights = defaultInsights,
  onClose,
  onCheckItem,
  className = '',
}: ChatSidePanelProps) {
  const [localChecklist, setLocalChecklist] = useState(checklist);

  const handleCheck = (id: string) => {
    setLocalChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    onCheckItem?.(id);
  };

  const xpProgress = (user.xp / user.xpToNextLevel) * 100;

  return (
    <aside className={`w-80 border-l border-gray-200 bg-white overflow-y-auto ${className}`}>
      <div className="p-6 space-y-6">
        {/* Close button (mobile) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}

        {/* User Profile */}
        <div className="text-center">
          <div className="relative inline-block mb-3">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                {user.name.charAt(0)}
              </div>
            )}
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
              {user.level}
            </div>
          </div>
          <h3 className="font-semibold text-gray-900">{user.name} ✨</h3>
          <p className="text-sm text-gray-500">Nível {user.level} • {stats.streak} dias de jornada 🔥</p>

          {/* XP Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>XP</span>
              <span>{user.xp}/{user.xpToNextLevel}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Streak */}
        <StreakBadge days={stats.streak} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <MiniStatCard
            icon={Flame}
            label="Calorias"
            value={`${(stats.calories.current / 1000).toFixed(1)}k`}
            target={`${(stats.calories.target / 1000).toFixed(1)}k`}
            progress={(stats.calories.current / stats.calories.target) * 100}
            color="orange"
            emoji="🔥"
          />
          <MiniStatCard
            icon={Droplet}
            label="Água"
            value={`${stats.water.current}L`}
            target={`${stats.water.target}L`}
            progress={(stats.water.current / stats.water.target) * 100}
            color="blue"
            emoji="💧"
          />
        </div>

        {/* Achievements */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Conquistas 🏆
          </h4>
          <div className="space-y-2">
            {achievements.map((achievement, idx) => (
              <AchievementBadge
                key={idx}
                icon={achievement.icon}
                title={achievement.title}
                unlocked={achievement.unlocked}
                progress={achievement.progress}
                total={achievement.total}
              />
            ))}
          </div>
          <button className="w-full mt-2 text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center gap-1">
            Ver todas as conquistas 💎
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Insights */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Insights da IA ✨
          </h4>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <InsightCard key={idx} {...insight} />
            ))}
          </div>
        </div>

        {/* Daily Checklist */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-500" />
            Próximos Passos 📝
          </h4>
          <div className="space-y-2">
            {localChecklist.map((item) => (
              <ChecklistItemComponent
                key={item.id}
                item={item}
                onCheck={() => handleCheck(item.id)}
              />
            ))}
          </div>
          <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <p className="text-xs text-green-700 flex items-center gap-2">
              <span className="text-base">✅</span>
              <span>
                <strong>{localChecklist.filter((i) => i.checked).length}/{localChecklist.length}</strong> tarefas completas hoje!
              </span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-xl text-sm font-medium text-gray-700 border border-pink-200 transition-all">
              <Calendar className="w-4 h-4 text-pink-500" />
              Agenda 📅
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 rounded-xl text-sm font-medium text-gray-700 border border-teal-200 transition-all">
              <Bell className="w-4 h-4 text-teal-500" />
              Lembretes 🔔
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Mini Stat Card Component
function MiniStatCard({
  icon: Icon,
  label,
  value,
  target,
  progress,
  color,
  emoji,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  target: string;
  progress: number;
  color: 'orange' | 'blue' | 'green' | 'pink';
  emoji: string;
}) {
  const colorClasses = {
    orange: 'text-orange-500 bg-orange-50',
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    pink: 'text-pink-500 bg-pink-50',
  };

  const progressColors = {
    orange: 'from-orange-400 to-amber-500',
    blue: 'from-blue-400 to-cyan-500',
    green: 'from-green-400 to-emerald-500',
    pink: 'from-pink-400 to-rose-500',
  };

  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[0]}`} />
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-sm">{emoji}</span>
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-2">
        {value} <span className="text-gray-500 font-normal">/ {target}</span>
      </p>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${progressColors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({ type, message, emoji }: Insight) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  return (
    <div className={`p-3 rounded-xl border ${styles[type]} text-sm flex items-start gap-2`}>
      <span className="text-lg shrink-0">{emoji}</span>
      <p>{message}</p>
    </div>
  );
}

// Checklist Item Component
function ChecklistItemComponent({
  item,
  onCheck,
}: {
  item: ChecklistItem;
  onCheck: () => void;
}) {
  return (
    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
      <button
        onClick={onCheck}
        className={`
          w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all
          ${item.checked
            ? 'bg-gradient-to-r from-teal-500 to-purple-500 border-transparent'
            : 'border-gray-300 group-hover:border-teal-400'
          }
        `}
      >
        {item.checked && <Check className="w-3 h-3 text-white" />}
      </button>
      <span className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
        {item.text}
      </span>
      {item.time && (
        <span className="text-xs text-gray-400">{item.time}</span>
      )}
    </label>
  );
}

// Mobile Sheet Version
export function ChatSidePanelSheet({
  isOpen,
  onClose,
  ...props
}: ChatSidePanelProps & { isOpen: boolean }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden animate-slideInUp">
        <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
          {/* Handle */}
          <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
          <ChatSidePanel {...props} onClose={onClose} className="border-0" />
        </div>
      </div>
    </>
  );
}
