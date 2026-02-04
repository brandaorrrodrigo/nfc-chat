#!/usr/bin/env node
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Importar o seed manualmente
const seedModule = require('./prisma/seed.ts');

async function run() {
  try {
    console.log('🌱 Iniciando seed das comunidades...');
    
    // Rodar o seed
    await seedModule.default ? seedModule.default() : seedModule();
    
    console.log('✅ Seed completado com sucesso!');
    process.exit(0);
  } catch (e) {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  }
}

run();
