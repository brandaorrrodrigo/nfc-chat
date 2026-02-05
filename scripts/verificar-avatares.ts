/**
 * Verificar distribuição de avatares nas arenas geradas
 */

import * as fs from 'fs';

const arquivos = [
  'arena-lipedema-dados.json',
  'arena-hipercifose-dados.json',
  'arena-compressao-dados.json',
  'arena-menstrual-dados.json',
];

console.log('\n📊 ANÁLISE DE AVATARES GERADOS\n');
console.log('═'.repeat(60));

arquivos.forEach(arquivo => {
  try {
    const data = JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
    const arena = arquivo.replace('arena-', '').replace('-dados.json', '').toUpperCase();

    console.log(`\n🏟️  Arena: ${arena}`);
    console.log('─'.repeat(60));

    // Estatísticas gerais
    console.log(`   Ghost Users: ${data.ghostUsers.length}`);
    console.log(`   Threads: ${data.threads.length}`);
    console.log(`   Mensagens: ${data.mensagens.length}`);

    // Analisar estilos de avatar
    const styles: Record<string, number> = {};
    const backgrounds: Record<string, number> = {};

    data.ghostUsers.forEach((user: any) => {
      const match = user.avatar_url.match(/7\.x\/([^\/]+)\//);
      if (match) {
        const style = match[1];
        styles[style] = (styles[style] || 0) + 1;
      }

      const bgMatch = user.avatar_url.match(/backgroundColor=([a-f0-9]+)/);
      if (bgMatch) {
        const bg = bgMatch[1];
        backgrounds[bg] = (backgrounds[bg] || 0) + 1;
      }
    });

    console.log('\n   📸 Estilos de Avatar:');
    Object.entries(styles)
      .sort((a, b) => b[1] - a[1])
      .forEach(([style, count]) => {
        console.log(`      • ${style}: ${count} usuários`);
      });

    console.log(`\n   ✅ Total de estilos diferentes: ${Object.keys(styles).length}/8`);
    console.log(`   ✅ Total de cores diferentes: ${Object.keys(backgrounds).length}/8`);

    // Amostra de 3 avatares
    console.log('\n   🎨 Amostra de Avatares:');
    data.ghostUsers.slice(0, 3).forEach((user: any, i: number) => {
      const style = user.avatar_url.match(/7\.x\/([^\/]+)\//)?.[1] || 'unknown';
      console.log(`      ${i + 1}. ${user.username} → ${style}`);
    });

  } catch (error) {
    console.log(`   ❌ Erro ao ler ${arquivo}: ${error}`);
  }
});

console.log('\n═'.repeat(60));
console.log('✅ Análise concluída!\n');
