/**
 * TESTE DAS RESPOSTAS DA IA PARA ARENA POSTURA
 *
 * Execução: npx tsx scripts/test-ia-postura.ts
 */

import { gerarThread, gerarRespostaIA } from './thread-generator';
import { validarNaturalidade } from '../lib/ia/language-naturalizer';

console.log('════════════════════════════════════════════════════════');
console.log('🤖 TESTE: RESPOSTAS DA IA - ARENA POSTURA');
console.log('════════════════════════════════════════════════════════\n');

// Gerar 10 threads e forçar resposta da IA em todas
const threads = [];
const respostasIA = [];

console.log('📝 Gerando 10 threads e forçando resposta da IA...\n');

for (let i = 0; i < 10; i++) {
  const thread = gerarThread('postura');

  // Garantir que tem pelo menos 3 respostas
  while (thread.respostas.length < 3) {
    thread.respostas.push({
      autor: {
        id: 'dummy',
        nome: 'Dummy',
        username: 'dummy',
        email: 'dummy@test.com',
        nivel: 'iniciante',
        genero: 'M',
      },
      conteudo: 'teste',
      timestamp: new Date(),
      tom: 'apoio',
    });
  }

  const ultimaResposta = thread.respostas[thread.respostas.length - 1];
  const respostaIA = gerarRespostaIA(thread, ultimaResposta.timestamp);

  if (respostaIA) {
    threads.push(thread);
    respostasIA.push(respostaIA.conteudo);
  }
}

console.log(`✅ Geradas ${respostasIA.length} respostas da IA\n`);

// ============================================
// ANÁLISE DAS RESPOSTAS
// ============================================

console.log('📊 ANÁLISE DAS RESPOSTAS DA IA');
console.log('─'.repeat(60));

const termosPosturaEsperados = [
  'anteversao',
  'pelvica',
  'pelve',
  'transverso',
  'abdomen',
  'core',
  'gluteo',
  'lordose',
  'hiperlordose',
  'diastase',
  'pilates',
  'RPG',
  'postura',
  'barriga',
];

console.log('\n🔍 Verificando termos específicos de postura:\n');

const termosEncontrados: Record<string, number> = {};

respostasIA.forEach(resposta => {
  termosPosturaEsperados.forEach(termo => {
    if (resposta.toLowerCase().includes(termo)) {
      termosEncontrados[termo] = (termosEncontrados[termo] || 0) + 1;
    }
  });
});

const termosOrdenados = Object.entries(termosEncontrados)
  .sort((a, b) => b[1] - a[1]);

console.log('Termos encontrados (ordenados por frequência):');
termosOrdenados.forEach(([termo, qtd]) => {
  const percentual = ((qtd / respostasIA.length) * 100).toFixed(1);
  console.log(`   ${termo.padEnd(15)} - ${qtd}/${respostasIA.length} (${percentual}%)`);
});

// ============================================
// EXEMPLOS DE RESPOSTAS
// ============================================

console.log('\n\n📝 EXEMPLOS DE RESPOSTAS DA IA:\n');
console.log('─'.repeat(60));

respostasIA.slice(0, 5).forEach((resposta, index) => {
  console.log(`\n${index + 1}. ${resposta.substring(0, 150)}...`);

  const validacao = validarNaturalidade(resposta);
  console.log(`   Score: ${validacao.score}/100 ${validacao.pareceHumano ? '✅' : '❌'}`);
});

// ============================================
// VERIFICAR PADRÃO DE PERGUNTAS
// ============================================

console.log('\n\n❓ ANÁLISE DE PERGUNTAS DE FOLLOW-UP:\n');
console.log('─'.repeat(60));

const temPergunta = respostasIA.filter(r => r.includes('?')).length;
const percentualPerguntas = ((temPergunta / respostasIA.length) * 100).toFixed(1);

console.log(`\nRespostas com pergunta: ${temPergunta}/${respostasIA.length} (${percentualPerguntas}%)`);

if (percentualPerguntas === '100.0') {
  console.log('✅ Todas as respostas incluem pergunta de follow-up!');
} else {
  console.log('⚠️  Algumas respostas não têm pergunta de follow-up');
}

// ============================================
// SCORE MÉDIO
// ============================================

console.log('\n\n📈 SCORE MÉDIO DE NATURALIDADE:\n');
console.log('─'.repeat(60));

const scores = respostasIA.map(r => validarNaturalidade(r).score);
const scoreMedio = scores.reduce((a, b) => a + b, 0) / scores.length;
const scoreMinimo = Math.min(...scores);
const scoreMaximo = Math.max(...scores);

console.log(`\nScore médio: ${scoreMedio.toFixed(1)}/100`);
console.log(`Score mínimo: ${scoreMinimo}/100`);
console.log(`Score máximo: ${scoreMaximo}/100`);

const scoresAceitaveis = scores.filter(s => s >= 60).length;
const taxaAceitacao = ((scoresAceitaveis / scores.length) * 100).toFixed(1);

console.log(`\nScores ≥ 60: ${scoresAceitaveis}/${scores.length} (${taxaAceitacao}%)`);

// ============================================
// RESUMO
// ============================================

console.log('\n\n════════════════════════════════════════════════════════');
console.log('📋 RESUMO');
console.log('════════════════════════════════════════════════════════\n');

console.log(`✅ Respostas geradas: ${respostasIA.length}/10`);
console.log(`✅ Termos específicos: ${termosOrdenados.length}/${termosPosturaEsperados.length} tipos`);
console.log(`✅ Com pergunta follow-up: ${temPergunta}/${respostasIA.length} (${percentualPerguntas}%)`);
console.log(`✅ Score médio: ${scoreMedio.toFixed(1)}/100`);
console.log(`✅ Taxa de aceitação: ${taxaAceitacao}%`);

if (termosOrdenados.length >= 5) {
  console.log(`\n✅ RESPOSTAS SÃO ESPECÍFICAS DA ARENA DE POSTURA!`);
} else {
  console.log(`\n⚠️  ATENÇÃO: Respostas podem estar muito genéricas`);
}

if (scoreMedio >= 70) {
  console.log(`✅ SCORE MÉDIO DENTRO DA META (≥70)!`);
} else {
  console.log(`\n⚠️  ATENÇÃO: Score médio abaixo da meta`);
}

console.log('\n════════════════════════════════════════════════════════');
console.log('🎉 TESTE CONCLUÍDO!');
console.log('════════════════════════════════════════════════════════\n');
