/**
 * Testes e Exemplos do Sistema de Naturalização
 *
 * Execute com: npx tsx lib/ia/language-naturalizer.test.ts
 */

import {
  naturalizarTexto,
  validarNaturalidade,
  naturalizarEValidar,
  obterPerfilNaturalizacao,
  selecionarPerfilAleatorio,
  variarResposta,
} from './language-naturalizer';

// ============================================
// EXEMPLOS DE USO
// ============================================

console.log('='.repeat(60));
console.log('TESTES DO SISTEMA DE NATURALIZAÇÃO');
console.log('='.repeat(60));
console.log();

// EXEMPLO 1: Naturalização básica
console.log('📝 EXEMPLO 1: Naturalização Básica');
console.log('-'.repeat(60));

const textoFormal = 'Você deve focar muito em proteína porque é essencial para hipertrofia. Quando você treina, precisa garantir ingestão adequada.';

const naturalizado1 = naturalizarTexto(textoFormal, {
  nivel: 'medio',
  perfil: 'pratico',
  aplicarErros: true,
  usarGirias: true
});

console.log('Original:', textoFormal);
console.log('Naturalizado:', naturalizado1);
console.log();

// EXEMPLO 2: Validação de naturalidade
console.log('📊 EXEMPLO 2: Validação de Naturalidade');
console.log('-'.repeat(60));

const textoPerfeito = 'A hipertrofia muscular depende de três fatores principais: treinamento adequado, nutrição balanceada e recuperação suficiente. É importante manter a consistência.';

const validacao1 = validarNaturalidade(textoPerfeito);

console.log('Texto:', textoPerfeito);
console.log('Score:', validacao1.score, '/100');
console.log('Parece humano?', validacao1.pareceHumano ? '✅ Sim' : '❌ Não');
console.log('Problemas:');
validacao1.problemas.forEach(p => console.log('  -', p));
console.log('Sugestões:');
validacao1.sugestoes.forEach(s => console.log('  -', s));
console.log();

// EXEMPLO 3: Naturalizar e validar automaticamente
console.log('🔄 EXEMPLO 3: Naturalização + Validação Automática');
console.log('-'.repeat(60));

const textoIA = 'O deficit calórico é fundamental para o emagrecimento. Você precisa consumir menos calorias do que gasta. É a única forma cientificamente comprovada.';

const resultado = naturalizarEValidar(textoIA, 'emocional');

console.log('Original:', resultado.textoOriginal);
console.log('Naturalizado:', resultado.textoNaturalizado);
console.log('Perfil usado:', resultado.perfil);
console.log('Score:', resultado.validacao.score, '/100');
console.log('Parece humano?', resultado.validacao.pareceHumano ? '✅ Sim' : '❌ Não');
console.log();

// EXEMPLO 4: Diferentes perfis de usuário
console.log('👥 EXEMPLO 4: Diferentes Perfis de Usuário');
console.log('-'.repeat(60));

const textoBase = 'Treinar em jejum pode funcionar, mas depende do seu objetivo e condicionamento.';

const perfis: Array<'emocional' | 'pratico' | 'tecnico' | 'avancado'> = [
  'emocional',
  'pratico',
  'tecnico',
  'avancado'
];

perfis.forEach(perfil => {
  const opcoes = obterPerfilNaturalizacao(perfil);
  const naturalizado = naturalizarTexto(textoBase, opcoes);
  console.log(`${perfil.toUpperCase()}:`, naturalizado);
});
console.log();

// EXEMPLO 5: Variar respostas
console.log('🎲 EXEMPLO 5: Variação de Respostas');
console.log('-'.repeat(60));

const respostasTemplates = [
  'Proteína é importante, mas não precisa se matar tentando bater a meta todo dia.',
  'O ideal são 1.6-2.2g/kg, mas se ficar em 1.5g já está ótimo.',
  'Prefira proteína de qualidade: carne, frango, peixe, ovos, whey.',
];

console.log('Resposta variada 1:', variarResposta(respostasTemplates));
console.log('Resposta variada 2:', variarResposta(respostasTemplates));
console.log('Resposta variada 3:', variarResposta(respostasTemplates));
console.log();

// EXEMPLO 6: Comparação antes/depois
console.log('⚖️  EXEMPLO 6: Comparação Antes/Depois');
console.log('-'.repeat(60));

const exemplos = [
  {
    categoria: 'Muito formal',
    texto: 'A alimentação adequada, aliada ao treinamento de resistência, proporciona resultados superiores na composição corporal.'
  },
  {
    categoria: 'Marketing agressivo',
    texto: 'Transforme seu corpo! Emagreça rápido! Resultados garantidos! Clique aqui!'
  },
  {
    categoria: 'Muito técnico',
    texto: 'O catabolismo proteico é minimizado através da periodização adequada do treinamento e estratégias nutricionais como a modulação da insulina pós-treino.'
  },
];

exemplos.forEach(({ categoria, texto }) => {
  const resultado = naturalizarEValidar(texto);
  console.log(`\n📌 ${categoria}`);
  console.log('Original:', texto);
  console.log('Naturalizado:', resultado.textoNaturalizado);
  console.log('Score:', resultado.validacao.score, '/100');
  console.log('Problemas:', resultado.validacao.problemas.join(', '));
});
console.log();

// EXEMPLO 7: Distribuição de perfis aleatórios
console.log('📊 EXEMPLO 7: Distribuição de Perfis (100 amostras)');
console.log('-'.repeat(60));

const distribuicao = {
  emocional: 0,
  pratico: 0,
  tecnico: 0,
  avancado: 0,
};

for (let i = 0; i < 100; i++) {
  const perfil = selecionarPerfilAleatorio();
  distribuicao[perfil]++;
}

console.log('Distribuição obtida (meta: 60/25/10/5):');
console.log(`  Emocional: ${distribuicao.emocional}% (meta: 60%)`);
console.log(`  Prático: ${distribuicao.pratico}% (meta: 25%)`);
console.log(`  Técnico: ${distribuicao.tecnico}% (meta: 10%)`);
console.log(`  Avançado: ${distribuicao.avancado}% (meta: 5%)`);
console.log();

// EXEMPLO 8: Casos reais da comunidade
console.log('💬 EXEMPLO 8: Casos Reais da Comunidade');
console.log('-'.repeat(60));

const casosReais = [
  {
    contexto: 'Usuário pergunta sobre proteína',
    respostaIA: 'A ingestão proteica recomendada é de 1.6 a 2.2 gramas por quilograma de peso corporal para otimizar a síntese proteica muscular.',
  },
  {
    contexto: 'Usuário relata dificuldade com dieta',
    respostaIA: 'Compreendo sua frustração. A adesão dietética é um desafio comum. Sugiro começar com pequenas mudanças incrementais.',
  },
  {
    contexto: 'Discussão sobre jejum intermitente',
    respostaIA: 'O jejum intermitente é uma estratégia nutricional válida que pode auxiliar no controle calórico e na flexibilidade metabólica.',
  },
];

casosReais.forEach(({ contexto, respostaIA }) => {
  const resultado = naturalizarEValidar(respostaIA);
  console.log(`\n📌 ${contexto}`);
  console.log('IA formal:', respostaIA);
  console.log('IA natural:', resultado.textoNaturalizado);
  console.log('✓ Score:', resultado.validacao.score, '| Perfil:', resultado.perfil);
});
console.log();

// ============================================
// RESUMO E RECOMENDAÇÕES
// ============================================

console.log('='.repeat(60));
console.log('📋 RESUMO E RECOMENDAÇÕES');
console.log('='.repeat(60));
console.log();
console.log('✅ Sistema de naturalização implementado com sucesso!');
console.log();
console.log('📝 Como usar no código:');
console.log('');
console.log('1. Importar:');
console.log('   import { naturalizarEValidar } from "@/lib/ia/language-naturalizer"');
console.log('');
console.log('2. Aplicar na resposta da IA:');
console.log('   const { textoNaturalizado } = naturalizarEValidar(respostaIA)');
console.log('');
console.log('3. Validar manualmente:');
console.log('   const validacao = validarNaturalidade(texto)');
console.log('   if (!validacao.pareceHumano) { /* ajustar */ }');
console.log();
console.log('🎯 Metas de qualidade:');
console.log('   - Score mínimo: 60/100');
console.log('   - Distribuição de perfis: 60/25/10/5');
console.log('   - Zero emojis excessivos (máx 1)');
console.log('   - Erros propositais leves em 40%+ dos casos');
console.log();
console.log('📚 Referências:');
console.log('   - DICIONARIO_LINGUAGEM_HUMANA.md');
console.log('   - lib/ia/language-naturalizer.ts');
console.log('   - lib/ia/decision-engine.ts (integração)');
console.log();
console.log('='.repeat(60));
