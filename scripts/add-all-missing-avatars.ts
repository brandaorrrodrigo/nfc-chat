/**
 * Adiciona TODOS os usuários que faltam no mapeamento de avatares
 */

import * as fs from 'fs';

const filePath = 'app/comunidades/[slug]/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Extrair todos os IDs de usuário únicos (exceto IA)
const userIds = new Set<string>();
const regex = /autor: { id: '([^']+)', nome: '([^']+)'/g;
let match;

while ((match = regex.exec(content)) !== null) {
  const [, id, nome] = match;
  if (id !== 'ia') {
    userIds.add(id);
  }
}

console.log(`📊 Total de usuários únicos encontrados: ${userIds.size}`);

// Estilos e cores disponíveis
const AVATAR_STYLES = [
  'lorelei',
  'avataaars',
  'bottts',
  'fun-emoji',
  'pixel-art',
  'thumbs',
  'notionists',
  'big-smile',
];

const BACKGROUND_COLORS = [
  'b6e3f4', 'c0aede', 'ffd5dc', 'd1d4f9',
  'ffdfbf', 'c7ecee', 'ffeaa7', 'dfe6e9',
];

// Gerar mapeamento completo
const sortedUsers = Array.from(userIds).sort();
const avatarMap: string[] = [];

sortedUsers.forEach((userId, index) => {
  const style = AVATAR_STYLES[index % AVATAR_STYLES.length];
  const bgColor = BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];

  // Detectar gênero pelo nome (simplificado)
  const genderParam = style === 'lorelei' &&
    (userId.includes('ana') || userId.includes('maria') || userId.includes('julia') ||
     userId.includes('fernanda') || userId.includes('paula') || userId.includes('carla') ||
     userId.includes('mariana') || userId.includes('patricia') || userId.includes('amanda') ||
     userId.includes('bruna') || userId.includes('jessica') || userId.includes('renata') ||
     userId.includes('cristiane') || userId.includes('simone') || userId.includes('vanessa') ||
     userId.includes('luciana') || userId.includes('tatiana') || userId.includes('sandra') ||
     userId.includes('dra-') || userId.includes('monica') || userId.includes('lucia') ||
     userId.includes('helena') || userId.includes('regina') || userId.includes('raquel') ||
     userId.includes('isabela') || userId.includes('larissa') || userId.includes('marina') ||
     userId.includes('carolina'))
    ? '&gender=female' : '';

  avatarMap.push(`  '${userId}': \`https://api.dicebear.com/7.x/${style}/svg?seed=${userId}-${index}&backgroundColor=${bgColor}${genderParam}\`,`);
});

// Substituir o mapeamento antigo pelo novo
const mapStart = content.indexOf('const MOCK_USER_AVATARS: Record<string, string> = {');
const mapEnd = content.indexOf('};', mapStart) + 2;

const newMapping = `const MOCK_USER_AVATARS: Record<string, string> = {\n${avatarMap.join('\n')}\n};`;

content = content.substring(0, mapStart) + newMapping + content.substring(mapEnd);

fs.writeFileSync(filePath, content, 'utf-8');

console.log(`✅ Mapeamento atualizado com ${sortedUsers.length} usuários!`);
console.log(`\n📋 Primeiros 10 usuários:`);
sortedUsers.slice(0, 10).forEach(u => console.log(`   - ${u}`));
