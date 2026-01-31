/**
 * FPIcon - Icone da moeda FP reutilizavel
 *
 * Exibe a moeda dourada de Fitness Points com opcoes
 * de tamanho, animacao e efeito de brilho.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FPIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
  glow?: boolean;
  spin?: boolean;
}

export function FPIcon({
  size = 32,
  className = '',
  animated = false,
  glow = false,
  spin = false,
}: FPIconProps) {
  const [hasError, setHasError] = useState(false);

  // Fallback se a imagem nao carregar
  if (hasError) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
          FP
        </span>
      </div>
    );
  }

  const imageContent = (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Glow effect */}
      {glow && (
        <div
          className="absolute inset-0 bg-yellow-500 rounded-full blur-md opacity-40 animate-pulse"
          style={{ transform: 'scale(1.2)' }}
        />
      )}

      {/* Moeda */}
      <Image
        src="/fp-coin.png"
        alt="Fitness Points"
        width={size}
        height={size}
        className="object-contain relative z-10 drop-shadow-lg"
        onError={() => setHasError(true)}
        priority={size >= 48}
      />

      {/* Brilho overlay */}
      {animated && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full pointer-events-none z-20"
          style={{ transform: 'rotate(-45deg)' }}
        />
      )}
    </div>
  );

  // Com animacao de spin
  if (spin) {
    return (
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ perspective: 1000 }}
      >
        {imageContent}
      </motion.div>
    );
  }

  // Com animacao de pulse/scale
  if (animated) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {imageContent}
      </motion.div>
    );
  }

  return imageContent;
}

/**
 * FPIconAnimated - Moeda com animacao de entrada
 */
interface FPIconAnimatedProps extends FPIconProps {
  delay?: number;
}

export function FPIconAnimated({ delay = 0, ...props }: FPIconAnimatedProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay,
      }}
    >
      <FPIcon {...props} />
    </motion.div>
  );
}

/**
 * FPIconBounce - Moeda com animacao de "caindo"
 */
export function FPIconBounce({ size = 32, className = '' }: FPIconProps) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0, rotate: 0 }}
      animate={{ y: 0, opacity: 1, rotate: 720 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15,
      }}
    >
      <FPIcon size={size} className={className} glow />
    </motion.div>
  );
}

export default FPIcon;
