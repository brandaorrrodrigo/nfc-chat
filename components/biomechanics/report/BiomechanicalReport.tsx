'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BiomechanicalAnalysis } from '@/types/biomechanical.types';
import { ScoreCard } from './ScoreCard';
import { ROMSection } from './ROMSection';
import { CompensationAlert } from './CompensationAlert';
import { StabilityBadge } from './StabilityBadge';
import { CaptureInfo } from './CaptureInfo';
import * as S from './BiomechanicalReport.styles';

interface BiomechanicalReportProps {
  analysis: BiomechanicalAnalysis;
  onExport?: () => void;
}

export const BiomechanicalReport: React.FC<BiomechanicalReportProps> = ({
  analysis,
  onExport,
}) => {
  const { scores, rotationAnalysis, captureSetup, confidenceScore } = analysis;

  const getClassification = (score: number) => {
    if (score >= 9) return { text: 'EXCELENTE', color: '#10B981' };
    if (score >= 8) return { text: 'MUITO BOM', color: '#3B82F6' };
    if (score >= 7) return { text: 'BOM', color: '#F59E0B' };
    return { text: 'PRECISA MELHORAR', color: '#EF4444' };
  };

  const classification = getClassification(scores.igpb);

  return (
    <S.Container id="biomechanical-report">
      {/* Header */}
      <S.Header>
        <S.Title>NUTRIFITCOACH</S.Title>
        <S.Subtitle>Visão Computacional + MediaPipe</S.Subtitle>
      </S.Header>

      {/* Thumbnail */}
      <S.ThumbnailSection>
        <S.ThumbnailCircle>
          {analysis.thumbnailUrl ? (
            <img src={analysis.thumbnailUrl} alt={analysis.exerciseName} />
          ) : (
            <S.PlaceholderImage />
          )}
        </S.ThumbnailCircle>
        <S.ExerciseName>{analysis.exerciseName}</S.ExerciseName>
      </S.ThumbnailSection>

      {/* Score Principal */}
      <S.MainScoreSection>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <S.ScoreCircle borderColor={classification.color}>
            <S.ScoreValue>{scores.igpb.toFixed(1)}</S.ScoreValue>
            <S.ScoreMax>/10</S.ScoreMax>
          </S.ScoreCircle>
        </motion.div>
        <S.Classification color={classification.color}>
          {classification.text}
        </S.Classification>
      </S.MainScoreSection>

      {/* Scores Detalhados */}
      <S.DetailedScoresGrid>
        <ScoreCard label="MOTOR" value={scores.motor} index={0} />
        <ScoreCard label="ESTABILIZADOR" value={scores.stabilizer} index={1} />
        <ScoreCard label="SIMETRIA" value={scores.symmetry} index={2} />
      </S.DetailedScoresGrid>

      {/* Info de Captura */}
      <CaptureInfo
        mode={captureSetup.mode}
        confidenceScore={confidenceScore}
        anglesCount={captureSetup.angles.length}
        upgradePrompt={analysis.upgradePrompt}
      />

      {/* ROM com 3 Pontos */}
      {analysis.romMeasurements && analysis.romMeasurements.length > 0 && (
        <ROMSection
          measurements={analysis.romMeasurements}
          total={analysis.romTotal}
        />
      )}

      {/* Stability Mode Badge */}
      {scores.stabilizer >= 8 && (
        <StabilityBadge stabilizerScore={scores.stabilizer} />
      )}

      {/* Compensação Rotacional */}
      {rotationAnalysis.detected && (
        <CompensationAlert
          type={rotationAnalysis.type}
          origin={rotationAnalysis.origin}
          magnitude={rotationAnalysis.magnitude}
        />
      )}

      {/* Mensagem Motivacional */}
      <S.MotivationalMessage>
        <p>
          Mandei bem! Obtive {scores.igpb.toFixed(1)}/10 no{' '}
          {analysis.exerciseName.toLowerCase()}. Será que você consegue superar? 💪
        </p>
      </S.MotivationalMessage>

      {/* Footer */}
      <S.Footer>
        <S.FooterLink>chat.nutrifitcoach.com.br</S.FooterLink>
        <S.FooterSubtext>Análise Biomecânica por IA</S.FooterSubtext>
      </S.Footer>

      {/* Botão de Exportar */}
      {onExport && (
        <S.ExportButton onClick={onExport}>
          📸 Exportar como Imagem
        </S.ExportButton>
      )}
    </S.Container>
  );
};
