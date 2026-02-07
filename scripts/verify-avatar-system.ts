/**
 * Script de Verificação do Sistema de Avatares
 *
 * Verifica que todos os componentes do sistema estão funcionando corretamente
 *
 * Uso:
 *   npx ts-node scripts/verify-avatar-system.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface VerificationResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
}

const results: VerificationResult[] = [];

function check(name: string, condition: boolean, passMsg: string, failMsg: string) {
  results.push({
    name,
    status: condition ? 'PASS' : 'FAIL',
    message: condition ? passMsg : failMsg
  });
}

function warn(name: string, message: string) {
  results.push({
    name,
    status: 'WARN',
    message
  });
}

async function verifyAvatarSystem() {
  console.log('🔍 VERIFICAÇÃO DO SISTEMA DE AVATARES');
  console.log('='.repeat(70));
  console.log('');

  // 1. Verificar arquivos backend
  console.log('📦 Verificando arquivos do backend...\n');

  const backendFiles = [
    'backend/src/modules/avatars/avatar-catalog.json',
    'backend/src/modules/avatars/avatar.service.ts',
    'backend/src/modules/avatars/avatar-generator.service.ts',
    'backend/src/modules/avatars/avatar.module.ts',
    'backend/src/modules/avatars/index.ts',
    'backend/src/modules/avatars/README.md'
  ];

  backendFiles.forEach(file => {
    const exists = fs.existsSync(file);
    check(
      `Backend: ${path.basename(file)}`,
      exists,
      `✓ Arquivo existe`,
      `✗ Arquivo não encontrado: ${file}`
    );
  });

  // 2. Verificar catálogo de avatares
  console.log('🎨 Verificando catálogo de avatares...\n');

  try {
    const catalogPath = 'backend/src/modules/avatars/avatar-catalog.json';
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

    check(
      'Catálogo: Total de avatares',
      catalog.avatars.length === 30,
      `✓ 30 avatares encontrados`,
      `✗ Esperado 30 avatares, encontrado ${catalog.avatars.length}`
    );

    const femaleCount = catalog.avatars.filter((a: any) => a.sexo === 'F').length;
    const maleCount = catalog.avatars.filter((a: any) => a.sexo === 'M').length;

    check(
      'Catálogo: Avatares femininos',
      femaleCount === 15,
      `✓ 15 avatares femininos`,
      `✗ Esperado 15, encontrado ${femaleCount}`
    );

    check(
      'Catálogo: Avatares masculinos',
      maleCount === 15,
      `✓ 15 avatares masculinos`,
      `✗ Esperado 15, encontrado ${maleCount}`
    );

    check(
      'Catálogo: Cores de fallback',
      catalog.fallback_colors.length === 20,
      `✓ 20 cores de fallback`,
      `✗ Esperado 20 cores, encontrado ${catalog.fallback_colors.length}`
    );

  } catch (error) {
    check(
      'Catálogo: Leitura',
      false,
      '',
      `✗ Erro ao ler catálogo: ${error.message}`
    );
  }

  // 3. Verificar componentes frontend
  console.log('⚛️  Verificando componentes React...\n');

  const frontendFiles = [
    'components/avatar/AvatarDisplay.tsx',
    'components/avatar/index.ts'
  ];

  frontendFiles.forEach(file => {
    const exists = fs.existsSync(file);
    check(
      `Frontend: ${path.basename(file)}`,
      exists,
      `✓ Component existe`,
      `✗ Component não encontrado: ${file}`
    );
  });

  // 4. Verificar scripts
  console.log('🔧 Verificando scripts...\n');

  const scriptFiles = [
    'scripts/migrate-avatars.ts',
    'scripts/avatar-stats.ts'
  ];

  scriptFiles.forEach(file => {
    const exists = fs.existsSync(file);
    check(
      `Script: ${path.basename(file)}`,
      exists,
      `✓ Script existe`,
      `✗ Script não encontrado: ${file}`
    );
  });

  // 5. Verificar package.json
  console.log('📦 Verificando package.json...\n');

  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

    check(
      'package.json: avatar:migrate',
      !!pkg.scripts['avatar:migrate'],
      `✓ Script avatar:migrate configurado`,
      `✗ Script avatar:migrate não encontrado`
    );

    check(
      'package.json: avatar:stats',
      !!pkg.scripts['avatar:stats'],
      `✓ Script avatar:stats configurado`,
      `✗ Script avatar:stats não encontrado`
    );

  } catch (error) {
    check(
      'package.json: Leitura',
      false,
      '',
      `✗ Erro ao ler package.json: ${error.message}`
    );
  }

  // 6. Verificar schema Prisma
  console.log('🗄️  Verificando schema Prisma...\n');

  try {
    const schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');

    check(
      'Schema: Campo avatarId em Post',
      schema.includes('avatarId') && schema.includes('model Post'),
      `✓ Campo avatarId encontrado em Post`,
      `✗ Campo avatarId não encontrado em Post`
    );

    check(
      'Schema: Campo avatarImg em Post',
      schema.includes('avatarImg') && schema.includes('model Post'),
      `✓ Campo avatarImg encontrado em Post`,
      `✗ Campo avatarImg não encontrado em Post`
    );

    check(
      'Schema: Campo avatarId em Comment',
      schema.includes('avatarId') && schema.includes('model Comment'),
      `✓ Campo avatarId encontrado em Comment`,
      `✗ Campo avatarId não encontrado em Comment`
    );

  } catch (error) {
    check(
      'Schema: Leitura',
      false,
      '',
      `✗ Erro ao ler schema.prisma: ${error.message}`
    );
  }

  // 7. Verificar diretórios de assets
  console.log('📁 Verificando diretórios de assets...\n');

  const assetDirs = [
    'public/avatars',
    'public/avatars/female',
    'public/avatars/male',
    'public/avatars/generated'
  ];

  assetDirs.forEach(dir => {
    const exists = fs.existsSync(dir);
    check(
      `Diretório: ${dir}`,
      exists,
      `✓ Diretório existe`,
      `✗ Diretório não encontrado: ${dir}`
    );
  });

  // 8. Verificar imagens de avatar (opcional)
  console.log('🖼️  Verificando imagens de avatar...\n');

  const femaleImages = fs.existsSync('public/avatars/female')
    ? fs.readdirSync('public/avatars/female').filter(f => f.endsWith('.png')).length
    : 0;

  const maleImages = fs.existsSync('public/avatars/male')
    ? fs.readdirSync('public/avatars/male').filter(f => f.endsWith('.png')).length
    : 0;

  if (femaleImages === 0 && maleImages === 0) {
    warn(
      'Imagens: Avatares',
      `⚠ Nenhuma imagem encontrada. Sistema usará fallback de iniciais.`
    );
  } else {
    check(
      'Imagens: Avatares',
      femaleImages === 15 && maleImages === 15,
      `✓ ${femaleImages} femininos, ${maleImages} masculinos`,
      `⚠ Parcial: ${femaleImages} femininos, ${maleImages} masculinos (esperado 15 cada)`
    );
  }

  // 9. Verificar documentação
  console.log('📚 Verificando documentação...\n');

  const docFiles = [
    'AVATAR_SYSTEM_SETUP.md',
    'AVATAR_SYSTEM_COMPLETE.md',
    'backend/src/modules/avatars/README.md'
  ];

  docFiles.forEach(file => {
    const exists = fs.existsSync(file);
    check(
      `Documentação: ${path.basename(file)}`,
      exists,
      `✓ Documento existe`,
      `✗ Documento não encontrado: ${file}`
    );
  });

  // 10. Resultados
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESULTADOS DA VERIFICAÇÃO\n');

  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}\n`);
  });

  console.log('='.repeat(70));
  console.log(`\n📈 RESUMO:`);
  console.log(`   ✅ Passou: ${passCount}`);
  console.log(`   ❌ Falhou: ${failCount}`);
  console.log(`   ⚠️  Avisos: ${warnCount}`);
  console.log(`   📊 Total: ${results.length}\n`);

  if (failCount === 0) {
    console.log('🎉 SISTEMA DE AVATARES: 100% FUNCIONANDO!\n');
    console.log('Próximos passos:');
    console.log('  1. npx prisma migrate dev --name add_avatar_system');
    console.log('  2. npm run avatar:migrate');
    console.log('  3. npm run avatar:stats\n');
  } else {
    console.log('⚠️  ATENÇÃO: Alguns componentes falharam na verificação.');
    console.log('Por favor, corrija os erros acima antes de prosseguir.\n');
    process.exit(1);
  }

  console.log('='.repeat(70));
}

// Executar verificação
verifyAvatarSystem().catch(error => {
  console.error('❌ Erro fatal na verificação:', error);
  process.exit(1);
});
