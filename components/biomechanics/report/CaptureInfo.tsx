'use client';

import React from 'react';
import * as S from './BiomechanicalReport.styles';

interface CaptureInfoProps {
  mode: string;
  confidenceScore: number;
  anglesCount: number;
  upgradePrompt?: {
    recommendedMode: string;
    reason: string;
  };
}

export const CaptureInfo: React.FC<CaptureInfoProps> = ({
  mode,
  confidenceScore,
  anglesCount,
  upgradePrompt,
}) => {
  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return 'excelente';
    if (score >= 75) return 'alta';
    if (score >= 60) return 'moderada';
    return 'baixa';
  };

  return (
    <S.CaptureInfoContainer>
      <S.InfoBox>
        <S.InfoTitle>MODO: {mode}</S.InfoTitle>
        <S.InfoText>
          Confiabilidade: {confidenceScore.toFixed(0)}% ({getConfidenceLevel(confidenceScore)})
        </S.InfoText>
        <S.InfoText>{anglesCount} ângulo(s)</S.InfoText>

        {upgradePrompt && (
          <S.UpgradePrompt>
            <S.UpgradeIcon>💡</S.UpgradeIcon>
            <S.UpgradeText>
              Upgrade → {upgradePrompt.recommendedMode}
            </S.UpgradeText>
            <S.UpgradeReason>{upgradePrompt.reason}</S.UpgradeReason>
          </S.UpgradePrompt>
        )}
      </S.InfoBox>
    </S.CaptureInfoContainer>
  );
};
