#!/usr/bin/env node

/**
 * Execute Seeds When Supabase Online
 * ==================================
 *
 * Monitora a conexão com Supabase e executa os 4 scripts seed
 * quando o banco voltar online.
 *
 * USO:
 *   node scripts/execute-when-supabase-online.mjs
 *
 * O script vai:
 * 1. ✅ Tentar conectar ao Supabase a cada 10 segundos
 * 2. ✅ Quando conectar, executar os 4 scripts em sequência
 * 3. ✅ Relatar progresso e erros
 */

import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ========================================
// CONFIGURAÇÃO
// ========================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CHECK_INTERVAL = 10000; // 10 segundos
const MAX_RETRIES = 1000; // ~2.8 horas

const SCRIPTS = [
  {
    name: 'Peptídeos & Farmacologia',
    file: 'seed-peptideos-farmacologia.ts',
    posts: 42,
  },
  {
    name: 'Performance & Biohacking',
    file: 'seed-performance-biohacking.ts',
    posts: 40,
  },
  {
    name: 'Receitas & Alimentação',
    file: 'seed-receitas-alimentacao.ts',
    posts: 41,
  },
  {
    name: 'Exercícios & Técnica',
    file: 'seed-exercicios-tecnica.ts',
    posts: 40,
  },
];

// ========================================
// FUNÇÕES
// ========================================

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('pt-BR');
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    pending: '⏳',
  };
  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

async function checkSupabaseConnection() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      log('Variáveis de ambiente não configuradas', 'error');
      return false;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await supabase.from('Arena').select('id').limit(1);

    if (error) {
      log(`Supabase offline: ${error.message}`, 'warning');
      return false;
    }

    log('✨ Supabase está ONLINE! Iniciando execução dos scripts...', 'success');
    return true;
  } catch (err) {
    log(`Erro ao conectar: ${err.message}`, 'warning');
    return false;
  }
}

function executeScript(scriptFile) {
  return new Promise((resolve) => {
    log(`Iniciando: ${scriptFile}`, 'pending');

    const child = spawn('npx', ['tsx', `scripts/${scriptFile}`], {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${scriptFile} executado com sucesso`, 'success');
        resolve(true);
      } else {
        log(`❌ ${scriptFile} falhou com código ${code}`, 'error');
        resolve(false);
      }
    });

    child.on('error', (err) => {
      log(`Erro ao executar ${scriptFile}: ${err.message}`, 'error');
      resolve(false);
    });
  });
}

async function executeAllScripts() {
  log('═'.repeat(60), 'info');
  log('🚀 EXECUTANDO 4 SCRIPTS SEED', 'success');
  log('═'.repeat(60), 'info');

  const results = [];
  let totalPosts = 0;

  for (const script of SCRIPTS) {
    log(`\n📍 Executando: ${script.name}`, 'info');
    const success = await executeScript(script.file);
    results.push({ name: script.name, success, posts: script.posts });
    if (success) {
      totalPosts += script.posts;
    }
    // Aguardar 2 segundos entre scripts
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Relatório final
  log('\n' + '═'.repeat(60), 'info');
  log('📊 RELATÓRIO FINAL', 'success');
  log('═'.repeat(60), 'info');

  const successCount = results.filter((r) => r.success).length;
  const totalScripts = results.length;

  results.forEach((result) => {
    const icon = result.success ? '✅' : '❌';
    log(`${icon} ${result.name} (${result.posts} posts)`, result.success ? 'success' : 'error');
  });

  log(`\n📈 Resumo:`, 'info');
  log(`   Scripts executados: ${successCount}/${totalScripts}`, successCount === totalScripts ? 'success' : 'warning');
  log(`   Posts criados: ${totalPosts} (de ${SCRIPTS.reduce((sum, s) => sum + s.posts, 0)} esperados)`, 'info');

  if (successCount === totalScripts) {
    log('\n🎉 TODOS OS SCRIPTS EXECUTADOS COM SUCESSO!', 'success');
    log('➜ Próximos passos:', 'info');
    log('   1. curl "https://chat.nutrifitcoach.com.br/api/arenas?flush=true"', 'info');
    log('   2. Executar SQL UPDATE statements para associar arenas aos HUBs', 'info');
    log('   3. Testar rotas em https://chat.nutrifitcoach.com.br', 'info');
    process.exit(0);
  } else {
    log('\n⚠️  Alguns scripts falharam. Verifique os logs acima.', 'warning');
    process.exit(1);
  }
}

async function monitorAndExecute() {
  log('═'.repeat(60), 'info');
  log('🔍 MONITOR DE SUPABASE - SCRIPTS SEED', 'info');
  log('═'.repeat(60), 'info');
  log('Aguardando Supabase ficar online...', 'pending');
  log(`Checando a cada ${CHECK_INTERVAL / 1000} segundos`, 'info');
  log(`Timeout: ${(MAX_RETRIES * CHECK_INTERVAL) / 1000 / 60} minutos\n`, 'info');

  let attempts = 0;

  const checkInterval = setInterval(async () => {
    attempts++;

    // Mostrar progresso a cada 12 tentativas (2 minutos)
    if (attempts % 12 === 1) {
      const elapsed = Math.floor((attempts * CHECK_INTERVAL) / 1000 / 60);
      log(`⏳ Tentativa ${attempts}/${MAX_RETRIES} (${elapsed} min decorridos)`, 'pending');
    }

    const isOnline = await checkSupabaseConnection();

    if (isOnline) {
      clearInterval(checkInterval);
      await executeAllScripts();
    } else if (attempts >= MAX_RETRIES) {
      clearInterval(checkInterval);
      log('\n❌ Timeout: Supabase não ficou online no tempo limite', 'error');
      process.exit(1);
    }
  });
}

// ========================================
// EXECUTAR
// ========================================

monitorAndExecute().catch((err) => {
  log(`Erro fatal: ${err.message}`, 'error');
  process.exit(1);
});
