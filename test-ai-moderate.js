/**
 * Script de Teste - API de Moderação IA
 *
 * COMO USAR:
 * 1. Certifique-se que o servidor está rodando (npm run dev)
 * 2. Execute: node test-ai-moderate.js
 */

async function testModerationAPI() {
  console.log('🧪 Testando API de Moderação IA\n');

  // Teste 1: Receita válida
  console.log('📝 TESTE 1: Receita Válida');
  console.log('─'.repeat(50));

  const recipeTest = {
    userId: 'test-user-123',
    userName: 'Rodrigo Teste',
    content: `
**Panqueca Fit**

**Ingredientes:**
- 2 ovos
- 1 banana madura
- 30g de aveia
- 1 scoop de whey protein
- Canela a gosto

**Modo de preparo:**
Bata todos os ingredientes no liquidificador até ficar homogêneo.
Aqueça uma frigideira antiaderente.
Despeje a massa e frite dos dois lados até dourar.

**Rende:** 2 porções
    `.trim(),
    communitySlug: 'receitas-saudaveis',
    messageId: 'test-msg-' + Date.now(),
  };

  try {
    const response = await fetch('http://localhost:3001/api/ai/moderate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeTest),
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(data, null, 2));

    if (data.success && data.moderation?.shouldRespond) {
      console.log('\n✅ TESTE PASSOU - IA vai responder!');
      console.log('Tipo de resposta:', data.moderation.responseType);
      console.log('FP concedido:', data.fp?.awarded);
    } else {
      console.log('\n❌ TESTE FALHOU - IA NÃO vai responder');
      console.log('Motivo:', data);
    }
  } catch (error) {
    console.error('\n🔴 ERRO:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Teste 2: Post sem receita
  console.log('📝 TESTE 2: Post Normal (sem receita)');
  console.log('─'.repeat(50));

  const normalTest = {
    userId: 'test-user-123',
    userName: 'Rodrigo Teste',
    content: 'Olá pessoal, tudo bem?',
    communitySlug: 'receitas-saudaveis',
    messageId: 'test-msg-' + Date.now(),
  };

  try {
    const response = await fetch('http://localhost:3001/api/ai/moderate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalTest),
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ API respondeu corretamente');
      console.log('Vai responder?', data.moderation?.shouldRespond ? 'SIM' : 'NÃO');
    }
  } catch (error) {
    console.error('\n🔴 ERRO:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n📋 TESTES CONCLUÍDOS!');
}

// Executar testes
testModerationAPI();
