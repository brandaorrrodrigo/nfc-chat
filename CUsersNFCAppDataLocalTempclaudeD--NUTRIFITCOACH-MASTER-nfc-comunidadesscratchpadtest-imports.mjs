// Teste de imports dos componentes criados
import fs from 'fs';
import path from 'path';

const componentFiles = [
  'D:\NUTRIFITCOACH_MASTER\nfc-comunidades\components\biometric\FPBalance.tsx',
  'D:\NUTRIFITCOACH_MASTER\nfc-comunidades\components\biometric\ImageUploader.tsx',
  'D:\NUTRIFITCOACH_MASTER\nfc-comunidades\components\biometric\PaywallModal.tsx',
  'D:\NUTRIFITCOACH_MASTER\nfc-comunidades\components\biometric\ProcessingModal.tsx',
  'D:\NUTRIFITCOACH_MASTER\nfc-comunidades\components\biometric\AnalysisResult.tsx',
];

console.log('✅ Testando imports dos componentes...\n');

for (const file of componentFiles) {
  if (!fs.existsSync(file)) {
    console.log(`❌ ${path.basename(file)} - ARQUIVO NÃO EXISTE`);
    continue;
  }

  const content = fs.readFileSync(file, 'utf-8');
  
  // Verificar se tem 'use client'
  const hasUseClient = content.includes("'use client'");
  
  // Verificar se exporta função/componente
  const hasExport = content.match(/export (function|const|default)/);
  
  // Verificar imports principais
  const hasLucide = content.includes('lucide-react');
  
  const status = hasUseClient && hasExport && hasLucide ? '✅' : '⚠️';
  console.log(`${status} ${path.basename(file)}`);
  if (!hasUseClient) console.log(`   - Falta: 'use client'`);
  if (!hasExport) console.log(`   - Falta: export`);
  if (!hasLucide) console.log(`   - Falta: lucide-react`);
}

console.log('\n✅ Teste de imports concluído');
