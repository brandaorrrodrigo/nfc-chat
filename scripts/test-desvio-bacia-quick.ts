import { gerarThread } from './thread-generator';

console.log('════════════════════════════════════════════════════════');
console.log('🧪 TESTE RÁPIDO: ARENA DESVIO BACIA');
console.log('════════════════════════════════════════════════════════\n');

const threads = [];
for (let i = 0; i < 3; i++) {
  threads.push(gerarThread('desvio_bacia'));
}

threads.forEach((t, i) => {
  console.log(`\n${i + 1}. "${t.titulo}" (${t.tipo})`);
  console.log(`   Autor: ${t.autor.username}`);
  console.log(`   Respostas: ${t.respostas.length}`);
  const temIA = t.respostas.some(r => r.autor.id === 'ia_facilitadora');
  if (temIA) console.log(`   🤖 IA respondeu`);
});

const titulosUnicos = new Set(threads.map(t => t.titulo));
console.log(`\n✅ ${titulosUnicos.size}/3 títulos únicos`);
console.log('\n🎉 TESTE CONCLUÍDO!\n');
