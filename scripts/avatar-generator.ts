/**
 * GERADOR DE AVATARES VARIADOS
 *
 * Gera URLs de avatares com estilos diferentes para
 * evitar que todos os ghost users pareçam iguais
 */

// Estilos disponíveis no DiceBear API v7
const AVATAR_STYLES = [
  'avataaars',      // Estilo cartoon clássico
  'bottts',         // Robôs
  'fun-emoji',      // Emojis divertidos
  'pixel-art',      // Arte pixel
  'thumbs',         // Polegares coloridos
  'lorelei',        // Pessoas ilustradas
  'notionists',     // Estilo Notion
  'big-smile',      // Rostos sorrindo
];

// Cores de fundo variadas
const BACKGROUND_COLORS = [
  'b6e3f4', // Azul claro
  'c0aede', // Roxo claro
  'ffd5dc', // Rosa claro
  'd1d4f9', // Lavanda
  'ffdfbf', // Laranja claro
  'c7ecee', // Verde água
  'ffeaa7', // Amarelo claro
  'dfe6e9', // Cinza claro
];

/**
 * Gera uma URL de avatar variada para um ghost user
 *
 * @param username - Nome de usuário
 * @param index - Índice do usuário (para garantir variedade)
 * @param genero - Gênero do usuário (M/F)
 * @returns URL do avatar
 */
export function gerarAvatarVariado(
  username: string,
  index: number,
  genero?: 'M' | 'F'
): string {
  // Escolhe estilo baseado no index
  const style = AVATAR_STYLES[index % AVATAR_STYLES.length];

  // Escolhe cor de fundo baseado no index
  const bgColor = BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];

  // Seed único que combina username e index
  const seed = `${username}-${index}`;

  // Parâmetros extras baseados no estilo
  let extraParams = '';

  // Para alguns estilos, adiciona parâmetros específicos
  if (style === 'avataaars') {
    // Varia acessórios, roupas, etc.
    const accessories = ['Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers', 'Blank'];
    const tops = ['ShortHairShortFlat', 'LongHairStraight', 'ShortHairDreads01', 'LongHairCurly', 'ShortHairShortCurly'];
    extraParams = `&accessories=${accessories[index % accessories.length]}&top=${tops[index % tops.length]}`;
  } else if (style === 'lorelei') {
    // Define gênero para estilos que suportam
    if (genero) {
      extraParams = `&gender=${genero === 'F' ? 'female' : 'male'}`;
    }
  }

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${bgColor}${extraParams}`;
}

/**
 * Gera avatares para uma lista de ghost users
 */
export function gerarAvatarsParaGhostUsers(
  ghostUsers: Array<{
    username: string;
    genero?: 'M' | 'F';
  }>
): string[] {
  return ghostUsers.map((user, index) =>
    gerarAvatarVariado(user.username, index, user.genero)
  );
}

/**
 * Para testes - gera preview de vários avatares
 */
export function gerarPreviewAvatars(quantidade: number = 10): void {
  console.log('\n📸 Preview de Avatares:\n');

  for (let i = 0; i < quantidade; i++) {
    const username = `user${i}`;
    const genero = i % 2 === 0 ? 'M' : 'F';
    const avatar = gerarAvatarVariado(username, i, genero);
    console.log(`${i + 1}. ${username} (${genero}): ${avatar}`);
  }
}

// Se executado diretamente, mostra preview
if (require.main === module) {
  gerarPreviewAvatars(12);
}
