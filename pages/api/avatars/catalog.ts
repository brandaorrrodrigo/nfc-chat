/**
 * API Endpoint: GET /api/avatars/catalog
 * Retorna o catálogo completo de avatares disponíveis
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as path from 'path';

interface Avatar {
  id: string;
  sexo: 'M' | 'F';
  idade_range: string;
  biotipo: string;
  estilo: string;
  skin_tone: string;
  hair_color: string;
  img: string;
  initials_color: string;
  tags: string[];
}

interface AvatarCatalog {
  version: string;
  total_avatars: number;
  avatars: Avatar[];
  fallback_colors: string[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AvatarCatalog | { error: string }>
) {
  // Apenas GET permitido
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ler catálogo do arquivo
    const catalogPath = path.join(
      process.cwd(),
      'backend/src/modules/avatars/avatar-catalog.json'
    );

    const catalogData = fs.readFileSync(catalogPath, 'utf-8');
    const catalog: AvatarCatalog = JSON.parse(catalogData);

    // Cache por 1 hora (avatares não mudam frequentemente)
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    return res.status(200).json(catalog);
  } catch (error) {
    console.error('Erro ao carregar catálogo de avatares:', error);
    return res.status(500).json({ error: 'Failed to load avatar catalog' });
  }
}
