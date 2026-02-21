/**
 * Generate Share Card — Canvas API nativo
 * Gera imagem PNG para compartilhamento em redes sociais
 *
 * Layout (1080x1080 ou 1080x1920 Stories):
 *   Header: NUTRIFITCOACH + badge técnico
 *   Thumbnail (frame do pico) ou emoji do exercício
 *   Score circle principal
 *   Mini arcos Motor + Stabilizer
 *   Destaques: ✅ positivos + ⚠️ críticos
 *   CTA text dinâmico
 *   Footer com URL
 */

export interface ShareCardData {
  exerciseName: string;
  exerciseIcon: string;
  score: number;
  classificacao: string;
  pontosCriticos: Array<{ nome: string; severidade: string }>;
  arenaColor: string;
  // Dados enriquecidos
  motorScore?: number;
  stabilizerScore?: number;
  pontosPositivos?: string[];   // top 2 mostrados como ✅
  thumbnailUrl?: string;        // URL do frame de pico (se disponível)
  ctaText?: string;             // CTA gerado baseado no score
}

// ─── Cores ────────────────────────────────────────────────────────────────────

const SCORE_COLORS = {
  excellent: { main: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)', dim: 'rgba(74, 222, 128, 0.25)' },
  good:      { main: '#facc15', bg: 'rgba(250, 204, 21, 0.15)',  dim: 'rgba(250, 204, 21, 0.25)'  },
  poor:      { main: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', dim: 'rgba(248, 113, 113, 0.25)' },
};

function getScoreTheme(score: number) {
  if (score >= 7) return SCORE_COLORS.excellent;
  if (score >= 5) return SCORE_COLORS.good;
  return SCORE_COLORS.poor;
}

function getClassificacaoLabel(score: number): string {
  if (score >= 9) return 'EXCELENTE';
  if (score >= 8) return 'MUITO BOM';
  if (score >= 7) return 'BOM';
  if (score >= 5) return 'REGULAR';
  return 'NECESSITA ATENCAO';
}

// ─── Helpers Canvas ───────────────────────────────────────────────────────────

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
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

function drawDivider(ctx: CanvasRenderingContext2D, y: number, pad: number, width: number) {
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(width - pad, y);
  ctx.stroke();
}

/**
 * Desenha mini arco de score (para Motor e Stabilizer)
 * Retorna o y final após o componente
 */
function drawMiniScoreArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  score: number,
  label: string,
  width: number,
) {
  const theme = getScoreTheme(score);

  // Track bg
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI * 0.8, Math.PI * -0.2);
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = radius * 0.28;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Fill arc
  const arcStart = -Math.PI * 0.8;
  const arcEnd = arcStart + (score / 10) * (Math.PI * 1.6);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, arcStart, arcEnd);
  ctx.strokeStyle = theme.main;
  ctx.lineWidth = radius * 0.28;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Score number
  ctx.fillStyle = theme.main;
  ctx.font = `700 ${radius * 0.75}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(score.toFixed(1), cx, cy - radius * 0.08);

  // Label below arc
  ctx.fillStyle = '#71717a';
  ctx.font = `500 ${width * 0.016}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, cx, cy + radius * 0.9);
}

/**
 * Carrega imagem de URL (async). Retorna null em caso de falha.
 */
async function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timeout = setTimeout(() => resolve(null), 5000);
    img.onload = () => { clearTimeout(timeout); resolve(img); };
    img.onerror = () => { clearTimeout(timeout); resolve(null); };
    img.src = url;
  });
}

// ─── Render Principal ─────────────────────────────────────────────────────────

async function renderCard(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
  width: number,
  height: number,
) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  const pad = width * 0.074;
  const scoreTheme = getScoreTheme(data.score);
  const classificacao = data.classificacao || getClassificacaoLabel(data.score);
  const isStories = height > width;

  // ─── Fundo ──────────────────────────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#18181b');
  bgGrad.addColorStop(0.5, '#0f0f12');
  bgGrad.addColorStop(1, '#09090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Glow sutil no topo
  const glowGrad = ctx.createRadialGradient(width / 2, 0, 0, width / 2, 0, width * 0.6);
  glowGrad.addColorStop(0, `${data.arenaColor}20`);
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height * 0.35);

  let y = pad * 0.9;

  // ─── Header ─────────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e4e4e7';
  ctx.font = `700 ${width * 0.026}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('NUTRIFITCOACH', width / 2, y);
  y += width * 0.022;

  // Badge "Visão Computacional + MediaPipe"
  const badgeLabel = 'Visao Computacional + MediaPipe';
  ctx.font = `400 ${width * 0.014}px system-ui, -apple-system, sans-serif`;
  const bMetrics = ctx.measureText(badgeLabel);
  const bW = bMetrics.width + width * 0.03;
  const bH = width * 0.028;
  const bX = (width - bW) / 2;
  drawRoundedRect(ctx, bX, y, bW, bH, bH / 2);
  ctx.fillStyle = `${data.arenaColor}25`;
  ctx.fill();
  ctx.strokeStyle = `${data.arenaColor}50`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText(badgeLabel, width / 2, y + bH * 0.68);
  y += bH + pad * 0.7;

  drawDivider(ctx, y, pad, width);
  y += pad * 0.6;

  // ─── Thumbnail / Emoji ──────────────────────────────────────────────────────
  const thumbSize = isStories ? width * 0.35 : width * 0.28;
  const thumbCX = width / 2;
  const thumbCY = y + thumbSize / 2;
  const thumbR = thumbSize / 2;

  // Tentar carregar thumbnail do pico
  let thumbnail: HTMLImageElement | null = null;
  if (data.thumbnailUrl) {
    thumbnail = await loadImage(data.thumbnailUrl);
  }

  if (thumbnail) {
    // Desenhar imagem circular
    ctx.save();
    ctx.beginPath();
    ctx.arc(thumbCX, thumbCY, thumbR, 0, Math.PI * 2);
    ctx.clip();
    // Calcular crop centralizado (aspect-fill)
    const imgAspect = thumbnail.naturalWidth / thumbnail.naturalHeight;
    let sw = thumbnail.naturalWidth, sh = thumbnail.naturalHeight;
    let sx = 0, sy = 0;
    if (imgAspect > 1) { sw = sh; sx = (thumbnail.naturalWidth - sw) / 2; }
    else { sh = sw; sy = (thumbnail.naturalHeight - sh) / 2; }
    ctx.drawImage(thumbnail, sx, sy, sw, sh, thumbCX - thumbR, thumbCY - thumbR, thumbR * 2, thumbR * 2);
    ctx.restore();

    // Borda colorida
    ctx.beginPath();
    ctx.arc(thumbCX, thumbCY, thumbR, 0, Math.PI * 2);
    ctx.strokeStyle = `${data.arenaColor}80`;
    ctx.lineWidth = 4;
    ctx.stroke();
  } else {
    // Emoji / ícone do exercício
    ctx.beginPath();
    ctx.arc(thumbCX, thumbCY, thumbR, 0, Math.PI * 2);
    ctx.fillStyle = `${data.arenaColor}15`;
    ctx.fill();
    ctx.strokeStyle = `${data.arenaColor}40`;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = `${thumbR * 0.85}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.exerciseIcon, thumbCX, thumbCY + thumbR * 0.05);
    ctx.textBaseline = 'alphabetic';
  }

  y += thumbSize + pad * 0.5;

  // Nome do exercício
  ctx.fillStyle = '#d4d4d8';
  ctx.font = `600 ${width * 0.036}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(data.exerciseName, width / 2, y);
  y += pad * 1.2;

  // ─── Score Principal ─────────────────────────────────────────────────────────
  const scoreRadius = width * 0.115;
  const scoreCX = width / 2;
  const scoreCY = y + scoreRadius;

  // Fundo do círculo
  ctx.beginPath();
  ctx.arc(scoreCX, scoreCY, scoreRadius, 0, Math.PI * 2);
  ctx.fillStyle = scoreTheme.bg;
  ctx.fill();
  ctx.strokeStyle = `${scoreTheme.main}30`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Arco de progresso
  const scoreAngle = (data.score / 10) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(scoreCX, scoreCY, scoreRadius, -Math.PI / 2, -Math.PI / 2 + scoreAngle);
  ctx.strokeStyle = scoreTheme.main;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Número do score
  ctx.fillStyle = scoreTheme.main;
  ctx.font = `700 ${scoreRadius * 0.72}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.score.toFixed(1), scoreCX, scoreCY - scoreRadius * 0.12);

  // "/10" e classificação
  ctx.fillStyle = '#71717a';
  ctx.font = `400 ${width * 0.022}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('/10', scoreCX, scoreCY + scoreRadius * 0.4);
  ctx.textBaseline = 'alphabetic';

  y = scoreCY + scoreRadius + pad * 0.5;

  // Badge de classificação
  ctx.font = `700 ${width * 0.018}px system-ui, -apple-system, sans-serif`;
  const clW = ctx.measureText(classificacao).width + width * 0.04;
  const clH = width * 0.032;
  const clX = (width - clW) / 2;
  drawRoundedRect(ctx, clX, y, clW, clH, clH / 2);
  ctx.fillStyle = scoreTheme.bg;
  ctx.fill();
  ctx.strokeStyle = `${scoreTheme.main}50`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = scoreTheme.main;
  ctx.textAlign = 'center';
  ctx.fillText(classificacao, width / 2, y + clH * 0.67);
  y += clH + pad * 0.9;

  // ─── Mini arcos Motor / Stabilizer ─────────────────────────────────────────
  const hasMotorStab = data.motorScore != null && data.stabilizerScore != null;
  if (hasMotorStab) {
    const miniR = width * 0.065;
    const gap = width * 0.1;
    const leftCX = width / 2 - gap - miniR;
    const rightCX = width / 2 + gap + miniR;
    const miniCY = y + miniR;

    drawMiniScoreArc(ctx, leftCX,  miniCY, miniR, data.motorScore!,      'MOTOR',       width);
    drawMiniScoreArc(ctx, rightCX, miniCY, miniR, data.stabilizerScore!, 'ESTABILIDADE', width);

    // Linha divisória vertical entre os dois arcos
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(width / 2, y + miniR * 0.2);
    ctx.lineTo(width / 2, y + miniR * 1.6);
    ctx.stroke();
    ctx.setLineDash([]);

    y = miniCY + miniR + pad * 1.1;
  }

  drawDivider(ctx, y, pad, width);
  y += pad * 0.6;

  // ─── Destaques ──────────────────────────────────────────────────────────────
  const positivos = (data.pontosPositivos || []).slice(0, 2);
  const criticos  = (data.pontosCriticos  || []).slice(0, 1);
  const highlights = [
    ...positivos.map(p => ({ icon: '✅', text: p,       color: '#4ade80' })),
    ...criticos .map(c => ({ icon: '⚠️', text: c.nome,  color: '#fb923c' })),
  ];

  if (highlights.length > 0) {
    ctx.font = `600 ${width * 0.014}px system-ui, -apple-system, sans-serif`;
    ctx.fillStyle = '#52525b';
    ctx.textAlign = 'left';
    ctx.fillText('DESTAQUES', pad, y);
    y += pad * 0.45;

    const lineH = width * 0.046;
    for (const h of highlights) {
      // Fundo da linha
      drawRoundedRect(ctx, pad, y, width - pad * 2, lineH, lineH * 0.3);
      ctx.fillStyle = '#1c1c1f';
      ctx.fill();

      // Ícone
      ctx.font = `${lineH * 0.55}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = h.color;
      ctx.fillText(h.icon, pad + lineH * 0.25, y + lineH / 2);

      // Texto (truncar se necessário)
      const maxTextW = width - pad * 2 - lineH * 1.2;
      ctx.font = `400 ${width * 0.018}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = '#d4d4d8';
      let text = h.text;
      while (ctx.measureText(text).width > maxTextW && text.length > 10) {
        text = text.slice(0, -1);
      }
      if (text !== h.text) text = text.slice(0, -1) + '…';
      ctx.fillText(text, pad + lineH * 1.1, y + lineH / 2);
      ctx.textBaseline = 'alphabetic';

      y += lineH + width * 0.012;
    }
    y += pad * 0.3;
  }

  // ─── CTA Text ────────────────────────────────────────────────────────────────
  if (data.ctaText) {
    drawDivider(ctx, y, pad, width);
    y += pad * 0.7;

    const ctaFontSize = isStories ? width * 0.026 : width * 0.022;
    ctx.font = `500 ${ctaFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e4e4e7';

    // Quebrar em múltiplas linhas se necessário
    const maxLineW = width - pad * 2.5;
    const words = data.ctaText.split(' ');
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxLineW && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    const lineH = ctaFontSize * 1.5;
    for (const l of lines.slice(0, 3)) {
      ctx.fillText(l, width / 2, y);
      y += lineH;
    }
    y += pad * 0.3;
  }

  // ─── Footer ──────────────────────────────────────────────────────────────────
  const footerY = height - pad * 0.8;
  drawDivider(ctx, footerY - pad * 0.8, pad, width);

  ctx.fillStyle = '#71717a';
  ctx.font = `500 ${width * 0.018}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('chat.nutrifitcoach.com.br', width / 2, footerY - pad * 0.15);

  ctx.fillStyle = '#3f3f46';
  ctx.font = `400 ${width * 0.013}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('Analise biomecanica por IA', width / 2, footerY + pad * 0.25);
}

// ─── Exports Públicas ─────────────────────────────────────────────────────────

/** Gera card quadrado 1080x1080 — WhatsApp e download */
export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  await renderCard(canvas, data, 1080, 1080);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem'))),
      'image/png',
    );
  });
}

/** Gera card vertical 1080x1920 — Instagram Stories */
export async function generateShareCardInstagram(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  await renderCard(canvas, data, 1080, 1920);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem'))),
      'image/png',
    );
  });
}

/** Renderiza preview menor no modal (540x540) */
export async function renderShareCardPreview(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
): Promise<void> {
  await renderCard(canvas, data, 540, 540);
}
