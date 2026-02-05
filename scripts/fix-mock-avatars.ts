/**
 * Script para adicionar avatares variados nas mensagens mock
 */

import * as fs from 'fs';

const filePath = 'app/comunidades/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Regex para encontrar autor sem avatar
const regex = /autor: { id: '([^']+)', nome: '([^']+)'(, is_premium: true)?(, is_founder: true)? }/g;

let count = 0;
content = content.replace(regex, (match, id, nome, premium, founder) => {
  // Pular se for IA
  if (id === 'ia') return match;

  count++;
  const avatarKey = id;
  let result = `autor: { id: '${id}', nome: '${nome}', avatar: MOCK_USER_AVATARS['${avatarKey}']`;

  if (premium) result += ', is_premium: true';
  if (founder) result += ', is_founder: true';

  result += ' }';
  return result;
});

fs.writeFileSync(filePath, content, 'utf-8');

console.log(`✅ Atualizadas ${count} mensagens com avatares variados!`);
