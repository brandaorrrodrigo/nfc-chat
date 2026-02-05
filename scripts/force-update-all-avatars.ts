/**
 * FORÇA atualização de TODOS os avatares nas mensagens
 * Remove avatares existentes e reaplica do mapeamento
 */

import * as fs from 'fs';

const filePath = 'app/comunidades/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// PASSO 1: Remover TODOS os avatares existentes das mensagens (exceto IA)
content = content.replace(
  /autor: { id: '([^']+)', nome: '([^']+)', avatar: MOCK_USER_AVATARS\['[^']+'\](, is_premium: true)?(, is_founder: true)? }/g,
  (match, id, nome, premium, founder) => {
    if (id === 'ia') return match;
    let result = `autor: { id: '${id}', nome: '${nome}'`;
    if (premium) result += ', is_premium: true';
    if (founder) result += ', is_founder: true';
    result += ' }';
    return result;
  }
);

console.log('✅ Removidos avatares antigos');

// PASSO 2: Adicionar avatar de volta para TODOS (exceto IA)
let count = 0;
content = content.replace(
  /autor: { id: '([^']+)', nome: '([^']+)'(, is_premium: true)?(, is_founder: true)? }/g,
  (match, id, nome, premium, founder) => {
    if (id === 'ia') return match;

    count++;
    let result = `autor: { id: '${id}', nome: '${nome}', avatar: MOCK_USER_AVATARS['${id}']`;
    if (premium) result += ', is_premium: true';
    if (founder) result += ', is_founder: true';
    result += ' }';
    return result;
  }
);

fs.writeFileSync(filePath, content, 'utf-8');

console.log(`✅ ${count} mensagens atualizadas com avatares do mapeamento!`);
