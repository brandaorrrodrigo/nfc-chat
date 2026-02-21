'use client';

import React from 'react';
import { motion } from 'framer-motion';
import * as S from './BiomechanicalReport.styles';

interface ScoreCardProps {
  label: string;
  value: number;
  index?: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ label, value, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <S.ScoreCardContainer>
        <S.ScoreCardValue>{value.toFixed(1)}</S.ScoreCardValue>
        <S.ScoreCardLabel>{label}</S.ScoreCardLabel>
      </S.ScoreCardContainer>
    </motion.div>
  );
};
