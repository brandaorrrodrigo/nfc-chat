'use client';

/**
 * Milestone Notification Component
 * Celebração de milestone completado com confetti
 */

import { useEffect, useState } from 'react';
import { X, Award, Sparkles } from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: string;
}

interface MilestoneNotificationProps {
  milestone: Milestone;
  onClose: () => void;
}

export function MilestoneNotification({
  milestone,
  onClose,
}: MilestoneNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fade in
    setTimeout(() => setShow(true), 100);

    // Auto-close após 5 segundos
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className={`relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-1 rounded-2xl shadow-2xl transform transition-all duration-300 ${
            show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-zinc-900 rounded-xl p-8 max-w-md">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon + Sparkles */}
            <div className="flex justify-center mb-4 relative">
              <div className="relative">
                <div className="text-7xl animate-bounce">{milestone.icon}</div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin-slow" />
                <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-purple-400 animate-ping" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              🎉 Milestone Completado!
            </h2>

            {/* Milestone Name */}
            <div className="text-center mb-4">
              <div className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {milestone.name}
              </div>
              <div className="text-sm text-zinc-400 mt-1">
                {milestone.description}
              </div>
            </div>

            {/* Reward */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="text-xs text-zinc-400">Recompensa</div>
                  <div className="font-semibold text-emerald-400">
                    {milestone.reward}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Continuar Evoluindo
            </button>
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      {show && <Confetti />}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}

/**
 * Confetti Component
 */
function Confetti() {
  const confettiCount = 50;
  const colors = [
    '#10b981',
    '#06b6d4',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#ef4444',
  ];

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = 2 + Math.random() * 3;
        const animationDelay = Math.random() * 2;
        const size = 5 + Math.random() * 10;

        return (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${left}%`,
              top: '-10px',
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              animationDuration: `${animationDuration}s`,
              animationDelay: `${animationDelay}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}
