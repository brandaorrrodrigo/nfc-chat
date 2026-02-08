/**
 * Cria as 6 arenas base esperadas pelo seed-conversations
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Carregar .env.local ANTES de qualquer import que use DATABASE_URL
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('✓ Loading .env.local');
  const config = dotenv.config({ path: envLocalPath });
  if (config.error) {
    console.error('Erro carregando .env.local:', config.error);
  } else {
    console.log('  DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
  }
} else {
  console.log('⚠ .env.local not found');
}

import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== Criando Arenas Base ===\n');

  const arenas = [
    {
      slug: 'postura-estetica',
      name: 'Postura & Estetica',
      description: 'Discuta postura, alinhamento corporal e objetivos estéticos',
      icon: 'Sparkles',
      color: '#ec4899',
      category: 'fitness',
    },
    {
      slug: 'dor-funcao',
      name: 'Dor & Funcao',
      description: 'Discuta dor, reabilitação e função corporal',
      icon: 'Heart',
      color: '#ef4444',
      category: 'health',
    },
    {
      slug: 'avaliacao-biometrica',
      name: 'Avaliacao Biometrica',
      description: 'Discuta avaliações biométricas e análises corporais',
      icon: 'Activity',
      color: '#3b82f6',
      category: 'fitness',
    },
    {
      slug: 'treino-performance',
      name: 'Treino & Performance',
      description: 'Discuta treino, progressão e desempenho',
      icon: 'Zap',
      color: '#f59e0b',
      category: 'fitness',
    },
    {
      slug: 'nutricao',
      name: 'Nutricao',
      description: 'Discuta nutrição, dieta e alimentação',
      icon: 'Apple',
      color: '#10b981',
      category: 'nutrition',
    },
    {
      slug: 'mobilidade',
      name: 'Mobilidade',
      description: 'Discuta mobilidade, flexibilidade e amplitude de movimento',
      icon: 'Wind',
      color: '#8b5cf6',
      category: 'fitness',
    },
  ];

  for (const arena of arenas) {
    try {
      const existing = await prisma.arena.findUnique({
        where: { slug: arena.slug },
      });

      if (existing) {
        console.log(`✓ ${arena.name} já existe`);
      } else {
        await prisma.arena.create({
          data: {
            slug: arena.slug,
            name: arena.name,
            description: arena.description,
            icon: arena.icon,
            color: arena.color,
            category: arena.category,
            isActive: true,
          },
        });
        console.log(`✓ ${arena.name} criada`);
      }
    } catch (e: any) {
      console.error(`✗ ${arena.name}: ${e.message}`);
    }
  }

  console.log('\n✅ Arenas prontas para seed\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
