'use client';

import React from 'react';
import * as S from './BiomechanicalReport.styles';

interface StabilityBadgeProps {
  stabilizerScore: number;
}

export const StabilityBadge: React.FC<StabilityBadgeProps> = ({ stabilizerScore }) => {
  return (
    <S.StabilityContainer>
      <S.BadgeIcon>🎯</S.BadgeIcon>
      <S.BadgeTitle>STABILITY MODE</S.BadgeTitle>
      <S.BadgeText>✓ Core ativado ({stabilizerScore.toFixed(1)}/10)</S.BadgeText>
      <S.BadgeText>✓ Controle postural mantido</S.BadgeText>
    </S.StabilityContainer>
  );
};
