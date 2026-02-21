'use client';

import React, { useRef } from 'react';
import { BiomechanicalReport } from './BiomechanicalReport';
import { BiomechanicalAnalysis } from '@/types/biomechanical.types';

interface ExportImageProps {
  analysis: BiomechanicalAnalysis;
}

export const ExportImage: React.FC<ExportImageProps> = ({ analysis }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!reportRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#1a1a1a',
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `analise-${analysis.exerciseName.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  return (
    <div>
      <div ref={reportRef}>
        <BiomechanicalReport
          analysis={analysis}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};
