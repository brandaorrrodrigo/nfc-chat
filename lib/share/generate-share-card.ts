/**
 * Generate Share Card — Canvas API nativo
 * Gera imagem PNG para compartilhamento em redes sociais
 */

export interface ShareCardData {
  exerciseName: string;
  exerciseIcon: string;
  score: number;
  classificacao: string;
  pontosCriticos: Array<{
    nome: string;
    severidade: string;
  }>;
  arenaColor: string;
}

const SCORE_COLORS = {
  excellent: { main: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)' },
  good: { main: '#facc15', bg: 'rgba(250, 204, 21, 0.15)' },
  poor: { main: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
};

function getScoreTheme(score: number) {
  if (score >= 8) return SCORE_COLORS.excellent;
  if (score >= 6) return SCORE_COLORS.good;
  return SCORE_COLORS.poor;
}

function getClassificacaoLabel(score: number): string {
  if (score >= 9) return 'EXCELENTE';
  if (score >= 8) return 'MUITO BOM';
  if (score >= 6) return 'BOM';
  if (score >= 4) return 'REGULAR';
  return 'NECESSITA ATENCAO';
}

function getSeveridadeColor(severidade: string): string {
  switch (severidade?.toUpperCase()) {
    case 'LEVE': return '#facc15';
    case 'MODERADA':
    case 'MODERADO': return '#fb923c';
    case 'CRITICA':
    case 'SEVERO': return '#f87171';
    default: return '#a1a1aa';
  }
}

function getSeveridadeBarWidth(severidade: string): number {
  switch (severidade?.toUpperCase()) {
    case 'LEVE': return 0.4;
    case 'MODERADA':
    case 'MODERADO': return 0.65;
    case 'CRITICA':
    case 'SEVERO': return 0.9;
    default: return 0.3;
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function renderCard(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
  width: number,
  height: number
) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  const pad = width * 0.074; // ~80px at 1080
  const scoreTheme = getScoreTheme(data.score);
  const classificacao = data.classificacao || getClassificacaoLabel(data.score);

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#18181b');
  bgGrad.addColorStop(0.5, '#0f0f12');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle accent glow at top
  const glowGrad = ctx.createRadialGradient(width / 2, 0, 0, width / 2, 0, width * 0.6);
  glowGrad.addColorStop(0, `${data.arenaColor}15`);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height * 0.4);

  let y = pad;

  // ─── HEADER: NutriFitCoach branding ───
  ctx.fillStyle = '#71717a';
  ctx.font = `600 ${width * 0.022}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('NUTRIFITCOACH', width / 2, y);
  y += width * 0.018;

  ctx.fillStyle = '#52525b';
  ctx.font = `400 ${width * 0.016}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('Analise Biomecanica por IA', width / 2, y);
  y += pad * 1.2;

  // ─── Divider line ───
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(width - pad, y);
  ctx.stroke();
  y += pad * 0.8;

  // ─── Exercise name + icon ───
  ctx.textAlign = 'center';
  ctx.font = `400 ${width * 0.045}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = '#e4e4e7';
  ctx.fillText(`${data.exerciseIcon}  ${data.exerciseName}`, width / 2, y);
  y += pad * 1.5;

  // ─── Score circle ───
  const scoreRadius = width * 0.13;
  const scoreCenterX = width / 2;
  const scoreCenterY = y + scoreRadius;

  // Score circle background
  ctx.beginPath();
  ctx.arc(scoreCenterX, scoreCenterY, scoreRadius, 0, Math.PI * 2);
  ctx.fillStyle = scoreTheme.bg;
  ctx.fill();
  ctx.strokeStyle = `${scoreTheme.main}40`;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Score arc (progress)
  const scoreAngle = (data.score / 10) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(scoreCenterX, scoreCenterY, scoreRadius, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
  ctx.strokeStyle = scoreTheme.main;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Score number
  ctx.fillStyle = scoreTheme.main;
  ctx.font = `700 ${width * 0.083}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.score.toFixed(1), scoreCenterX, scoreCenterY - width * 0.01);

  // "/10" below
  ctx.fillStyle = '#71717a';
  ctx.font = `400 ${width * 0.026}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('/10', scoreCenterX, scoreCenterY + scoreRadius * 0.45);
  ctx.textBaseline = 'alphabetic';

  y = scoreCenterY + scoreRadius + pad * 0.6;

  // ─── Classification badge ───
  const badgeText = classificacao;
  ctx.font = `700 ${width * 0.02}px system-ui, -apple-system, sans-serif`;
  const badgeMetrics = ctx.measureText(badgeText);
  const badgeW = badgeMetrics.width + width * 0.04;
  const badgeH = width * 0.037;
  const badgeX = (width - badgeW) / 2;

  drawRoundedRect(ctx, badgeX, y, badgeW, badgeH, badgeH / 2);
  ctx.fillStyle = scoreTheme.bg;
  ctx.fill();
  ctx.strokeStyle = `${scoreTheme.main}50`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = scoreTheme.main;
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, width / 2, y + badgeH * 0.65);
  y += badgeH + pad * 1.2;

  // ─── Pontos criticos (bars) ───
  const maxBars = Math.min(data.pontosCriticos.length, 5);
  if (maxBars > 0) {
    ctx.fillStyle = '#52525b';
    ctx.font = `600 ${width * 0.016}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('PONTOS DE ATENCAO', pad, y);
    y += pad * 0.5;

    const barAreaWidth = width - pad * 2;
    const barHeight = width * 0.028;
    const barGap = width * 0.045;

    for (let i = 0; i < maxBars; i++) {
      const ponto = data.pontosCriticos[i];
      const barColor = getSeveridadeColor(ponto.severidade);
      const barFillRatio = getSeveridadeBarWidth(ponto.severidade);

      // Label
      ctx.fillStyle = '#a1a1aa';
      ctx.font = `400 ${width * 0.016}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(ponto.nome, pad, y);

      // Severity label
      ctx.fillStyle = barColor;
      ctx.font = `600 ${width * 0.013}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(ponto.severidade, width - pad, y);

      y += width * 0.014;

      // Bar background
      drawRoundedRect(ctx, pad, y, barAreaWidth, barHeight, barHeight / 2);
      ctx.fillStyle = '#27272a';
      ctx.fill();

      // Bar fill
      const fillWidth = barAreaWidth * barFillRatio;
      if (fillWidth > 0) {
        drawRoundedRect(ctx, pad, y, fillWidth, barHeight, barHeight / 2);
        const barGradient = ctx.createLinearGradient(pad, 0, pad + fillWidth, 0);
        barGradient.addColorStop(0, `${barColor}80`);
        barGradient.addColorStop(1, barColor);
        ctx.fillStyle = barGradient;
        ctx.fill();
      }

      y += barHeight + barGap;
    }
  }

  // ─── Footer ───
  const footerY = height - pad;

  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, footerY - pad * 0.8);
  ctx.lineTo(width - pad, footerY - pad * 0.8);
  ctx.stroke();

  ctx.fillStyle = '#52525b';
  ctx.font = `400 ${width * 0.016}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('chat.nutrifitcoach.com.br', width / 2, footerY - pad * 0.2);

  ctx.fillStyle = '#3f3f46';
  ctx.font = `400 ${width * 0.013}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('Analise biomecanica por IA', width / 2, footerY);
}

/**
 * Gera card quadrado (1080x1080) — ideal para WhatsApp e download
 */
export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  renderCard(canvas, data, 1080, 1080);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem')),
      'image/png'
    );
  });
}

/**
 * Gera card vertical (1080x1920) — ideal para Instagram Stories
 */
export async function generateShareCardInstagram(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  renderCard(canvas, data, 1080, 1920);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem')),
      'image/png'
    );
  });
}

/**
 * Gera preview menor para mostrar no modal (540x540)
 */
export function renderShareCardPreview(
  canvas: HTMLCanvasElement,
  data: ShareCardData
) {
  renderCard(canvas, data, 540, 540);
}
