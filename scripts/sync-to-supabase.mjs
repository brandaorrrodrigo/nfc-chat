// Sincroniza análises biomecânicas do banco local para o Supabase
// Usa Prisma com DATABASE_URL do Supabase

import { PrismaClient } from '../lib/generated/prisma/index.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.qducbqhuwqdyqioqevle:Anilha15%21@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});

const videos = [
  'va_1770817487770_noye0o9k1',
  'va_1770817584163_afof17p9k',
  'va_1770817621743_j5dzbciws'
];

try {
  for (const id of videos) {
    // Buscar dados do servidor local (banco local já tem os dados novos)
    const res = await fetch('http://localhost:3000/api/nfv/videos/' + id);
    const data = await res.json();
    const record = data.analysis;

    if (!record || !record.ai_analysis) {
      console.log(id + ': sem dados no banco local');
      continue;
    }

    // Atualizar no Supabase via Prisma
    await prisma.videoAnalysis.update({
      where: { id },
      data: {
        ai_analysis: record.ai_analysis,
        status: record.status,
        ai_analyzed_at: record.ai_analyzed_at ? new Date(record.ai_analyzed_at) : new Date(),
      }
    });

    const ai = typeof record.ai_analysis === 'string' ? JSON.parse(record.ai_analysis) : record.ai_analysis;
    console.log(id + ': OK - score=' + ai.overall_score + ' data=' + ai.timestamp.substring(0, 10));
  }
  console.log('\nSincronizacao concluida!');
} catch (err) {
  console.error('Erro:', err.message);
} finally {
  await prisma.$disconnect();
}
