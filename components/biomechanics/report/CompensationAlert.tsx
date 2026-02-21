'use client';

import React from 'react';
import * as S from './BiomechanicalReport.styles';

interface CompensationAlertProps {
  type: string;
  origin: string;
  magnitude: number;
}

export const CompensationAlert: React.FC<CompensationAlertProps> = ({
  type,
  origin,
  magnitude,
}) => {
  const getAlertText = () => {
    const severity = magnitude > 15 ? 'Compensação' : 'Leve compensação';
    const originText = origin.toLowerCase().replace('_', ' ');

    return `${severity} rotacional ${originText} detectada (${magnitude.toFixed(1)}°). Considere trabalho de mobilidade.`;
  };

  return (
    <S.CompensationContainer>
      <S.AlertIcon>⚠️</S.AlertIcon>
      <S.AlertTitle>ATENÇÃO</S.AlertTitle>
      <S.AlertText>{getAlertText()}</S.AlertText>
    </S.CompensationContainer>
  );
};
