'use client';

import React from 'react';
import * as S from './BiomechanicalReport.styles';

interface ROMMeasurement {
  joint: string;
  angle: number;
  phase: 'inicial' | 'médio' | 'profundo';
}

interface ROMSectionProps {
  measurements: ROMMeasurement[];
  total?: number;
}

export const ROMSection: React.FC<ROMSectionProps> = ({ measurements, total }) => {
  return (
    <S.ROMContainer>
      <S.SectionTitle>DESTAQUES</S.SectionTitle>
      {measurements.map((rom, idx) => (
        <S.ROMItem key={idx}>
          <S.CheckIcon>✓</S.CheckIcon>
          <S.ROMText>
            {rom.joint}: {rom.angle.toFixed(1)}° ({rom.phase})
          </S.ROMText>
        </S.ROMItem>
      ))}
      {total && (
        <S.ROMTotal>
          <strong>ROM Total: {total.toFixed(1)}°</strong>
        </S.ROMTotal>
      )}
    </S.ROMContainer>
  );
};
