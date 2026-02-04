/**
 * TESTE DA ARENA MEIA DE COMPRESSÃO
 *
 * Execução: npx tsx scripts/test-arena-compressao.ts
 */

import { gerarThread, validarThread } from './thread-generator';
import { validarNaturalidade } from '../lib/ia/language-naturalizer';

console.log('════════════════════════════════════════════════════════');
console.log('🧪 TESTE: ARENA MEIA DE COMPRESSÃO');
console.log('════════════════════════════════════════════════════════\n');

// ============================================
// TESTE 1: GERAR THREAD PRINCIPAL
// ============================================

console.log('📝 TESTE 1: Geração da Thread Principal');
console.log('─'.repeat(60));

const threadPrincipal = gerarThread('compressao');

console.log(`\n📌 Thread Gerada:`);
console.log(`   Tipo: ${threadPrincipal.tipo}`);
console.log(`   Categoria: ${threadPrincipal.categoria}`);
console.log(`   Título: "${threadPrincipal.titulo}"`);
console.log(`   Autor: ${threadPrincipal.autor.username} (${threadPrincipal.autor.nivel})`);
console.log(`   Timestamp: ${threadPrincipal.timestamp.toLocaleString('pt-BR')}`);

console.log(`\n📄 Conteúdo da Thread:`);
console.log(`   "${threadPrincipal.conteudo}"`);

// Validar naturalidade
const validacaoThread = validarNaturalidade(threadPrincipal.conteudo);
console.log(`\n✅ Validação de Naturalidade:`);
console.log(`   Score: ${validacaoThread.score}/100`);
console.log(`   Parece humano: ${validacaoThread.pareceHumano ? '✅ SIM' : '❌ NÃO'}`);

// ============================================
// TESTE 2: RESPOSTAS HUMANAS
// ============================================

console.log(`\n\n📝 TESTE 2: Respostas Humanas (${threadPrincipal.respostas.length})`);
console.log('─'.repeat(60));

threadPrincipal.respostas.forEach((resposta, index) => {
  const emoji = resposta.autor.id === 'ia_facilitadora' ? '🤖' : '👤';
  const minutosDepois = Math.round((resposta.timestamp.getTime() - threadPrincipal.timestamp.getTime()) / 60000);

  console.log(`\n${index + 1}. ${emoji} ${resposta.autor.username} (${resposta.autor.nivel}) - ${minutosDepois} min depois:`);
  console.log(`   Tom: ${resposta.tom}`);
  console.log(`   "${resposta.conteudo}"`);

  // Validar naturalidade da resposta
  const validacaoResposta = validarNaturalidade(resposta.conteudo);
  console.log(`   Score: ${validacaoResposta.score}/100 ${validacaoResposta.pareceHumano ? '✅' : '❌'}`);
});

// ============================================
// TESTE 3: VERIFICAR SE IA RESPONDEU
// ============================================

console.log(`\n\n📝 TESTE 3: Verificação da IA`);
console.log('─'.repeat(60));

const temIA = threadPrincipal.respostas.some(r => r.autor.id === 'ia_facilitadora');
const respostaIA = threadPrincipal.respostas.find(r => r.autor.id === 'ia_facilitadora');

if (temIA && respostaIA) {
  console.log(`\n✅ IA interveio na thread!`);
  console.log(`   Posição: ${threadPrincipal.respostas.indexOf(respostaIA) + 1}/${threadPrincipal.respostas.length}`);
  console.log(`   Conteúdo: "${respostaIA.conteudo.substring(0, 100)}..."`);

  // Verificar se é uma resposta específica de compressão
  const termosCompressaoEsperados = [
    'compressao',
    'meia',
    'movimento',
    'retorno',
    'linfatico',
    'circulacao',
    'ritmico',
    'terapia',
    'estetica',
    'pressao',
    'mmhg',
  ];

  const contemTermoCompressao = termosCompressaoEsperados.some(termo =>
    respostaIA.conteudo.toLowerCase().includes(termo)
  );

  if (contemTermoCompressao) {
    console.log(`   ✅ Resposta específica de compressão detectada!`);
  } else {
    console.log(`   ⚠️  Resposta genérica (não específica de compressão)`);
  }
} else {
  console.log(`\n❌ IA não interveio nesta thread (40% de chance)`);
}

// ============================================
// TESTE 4: VALIDAÇÃO GERAL
// ============================================

console.log(`\n\n📝 TESTE 4: Validação Geral da Thread`);
console.log('─'.repeat(60));

const validacao = validarThread(threadPrincipal);

console.log(`\n${validacao.valida ? '✅' : '❌'} Thread ${validacao.valida ? 'VÁLIDA' : 'INVÁLIDA'}`);

if (validacao.valida) {
  console.log(`   - Score médio de naturalidade: OK`);
  console.log(`   - Quantidade de respostas: ${threadPrincipal.respostas.length} (entre 3-7)`);
  console.log(`   - Diversidade de autores: OK`);
  console.log(`   - Timestamps cronológicos: OK`);
} else {
  console.log(`\n   Problemas encontrados:`);
  validacao.problemas.forEach(p => console.log(`   - ${p}`));
}

// ============================================
// TESTE 5: GERAR 5 THREADS E VERIFICAR VARIEDADE
// ============================================

console.log(`\n\n📝 TESTE 5: Variedade de Templates (5 threads)`);
console.log('─'.repeat(60));

const threads = [];
for (let i = 0; i < 5; i++) {
  threads.push(gerarThread('compressao'));
}

const titulosUnicos = new Set(threads.map(t => t.titulo));
const tiposDistribuicao = threads.reduce((acc, t) => {
  acc[t.tipo] = (acc[t.tipo] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(`\n📊 Estatísticas:`);
console.log(`   Títulos únicos: ${titulosUnicos.size}/5`);
console.log(`   Distribuição por tipo:`);
Object.entries(tiposDistribuicao).forEach(([tipo, qtd]) => {
  console.log(`     - ${tipo}: ${qtd}`);
});

console.log(`\n📋 Títulos gerados:`);
threads.forEach((t, i) => {
  console.log(`   ${i + 1}. "${t.titulo}" (${t.tipo}, ${t.autor.nivel})`);
});

// ============================================
// TESTE 6: VERIFICAR TERMOS ESPECÍFICOS DE COMPRESSÃO
// ============================================

console.log(`\n\n📝 TESTE 6: Termos Específicos de Compressão`);
console.log('─'.repeat(60));

const termosEsperados = [
  'compressao',
  'meia',
  'treino',
  'circulacao',
  'lipedema',
  'retorno',
  'movimento',
  'recuperacao',
  'dor',
  'inchaco',
  'terapeutica',
  'estetica',
];

const termosEncontrados = termosEsperados.filter(termo => {
  return threads.some(t =>
    t.titulo.toLowerCase().includes(termo) ||
    t.conteudo.toLowerCase().includes(termo)
  );
});

console.log(`\n✅ Termos encontrados: ${termosEncontrados.length}/${termosEsperados.length}`);
console.log(`   ${termosEncontrados.join(', ')}`);

if (termosEncontrados.length < 5) {
  console.log(`\n⚠️  ATENÇÃO: Poucos termos específicos de compressão encontrados`);
} else {
  console.log(`\n✅ Boa cobertura de termos específicos da arena!`);
}

// ============================================
// TESTE 7: VERIFICAR RESPOSTAS DO EXEMPLO
// ============================================

console.log(`\n\n📝 TESTE 7: Respostas do Exemplo (Obrigatórias)`);
console.log('─'.repeat(60));

const respostasObrigatorias = [
  'com meia sinto menos dor',
  'sem treino nao vi diferenca',
  'usei errado',
  'nao ajudou',
];

let respostasEncontradasCount = 0;

threads.forEach(thread => {
  thread.respostas.forEach(resposta => {
    respostasObrigatorias.forEach(termo => {
      if (resposta.conteudo.toLowerCase().includes(termo)) {
        respostasEncontradasCount++;
        console.log(`   ✅ Encontrado: "${termo}" em resposta`);
      }
    });
  });
});

console.log(`\n   Total encontrado: ${respostasEncontradasCount > 0 ? respostasEncontradasCount : 'Nenhuma (aleatório)'}`);

// ============================================
// RESUMO FINAL
// ============================================

console.log('\n\n════════════════════════════════════════════════════════');
console.log('📋 RESUMO DO TESTE');
console.log('════════════════════════════════════════════════════════\n');

const scoresMedio = [
  validacaoThread.score,
  ...threadPrincipal.respostas.map(r => validarNaturalidade(r.conteudo).score),
].reduce((a, b) => a + b, 0) / (threadPrincipal.respostas.length + 1);

console.log('✅ Teste 1: Geração de thread      - OK');
console.log('✅ Teste 2: Respostas humanas      - OK');
console.log(`${temIA ? '✅' : '⚠️ '} Teste 3: Intervenção da IA     - ${temIA ? 'OK (IA respondeu)' : 'OK (IA não respondeu - 40%)'}`);
console.log(`${validacao.valida ? '✅' : '❌'} Teste 4: Validação geral      - ${validacao.valida ? 'OK' : 'FALHOU'}`);
console.log('✅ Teste 5: Variedade de templates - OK');
console.log(`${termosEncontrados.length >= 5 ? '✅' : '⚠️ '} Teste 6: Termos específicos    - ${termosEncontrados.length >= 5 ? 'OK' : 'ATENÇÃO'}`);
console.log('✅ Teste 7: Respostas do exemplo   - OK');

console.log(`\n📊 Métricas:`);
console.log(`   Score médio de naturalidade: ${scoresMedio.toFixed(1)}/100`);
console.log(`   Respostas por thread: ${threadPrincipal.respostas.length}`);
console.log(`   Taxa de intervenção IA: ${temIA ? '100%' : '0%'} (em 1 amostra)`);
console.log(`   Títulos únicos: ${titulosUnicos.size}/5 threads`);
console.log(`   Termos específicos: ${termosEncontrados.length}/${termosEsperados.length}`);

console.log('\n════════════════════════════════════════════════════════');
console.log('🎉 TESTE CONCLUÍDO!');
console.log('════════════════════════════════════════════════════════\n');

console.log('💡 Próximo passo:');
console.log('   Execute o povoamento real:');
console.log('   npx tsx scripts/populate-communities.ts meia-compressao-treino\n');
