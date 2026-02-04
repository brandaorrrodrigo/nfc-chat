import { gerarThread } from './thread-generator';

console.log('🧪 TESTE: ARENA GLÚTEO MÉDIO\n');

const threads = [];
for (let i = 0; i < 3; i++) threads.push(gerarThread('gluteo_medio'));

threads.forEach((t, i) => {
  console.log(`${i + 1}. "${t.titulo}" (${t.tipo})`);
  console.log(`   Respostas: ${t.respostas.length}`);
  const temIA = t.respostas.some(r => r.autor.id === 'ia_facilitadora');
  if (temIA) console.log(`   🤖 IA respondeu`);
});

console.log(`\n✅ ${new Set(threads.map(t => t.titulo)).size}/3 títulos únicos`);
console.log('🎉 TESTE OK!\n');
