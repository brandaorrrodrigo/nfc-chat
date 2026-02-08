/**
 * Popula arenas com conversas usando SQL direto
 * Bypasseia Prisma Client para evitar URLs hardcoded
 */

import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  console.log('\n=== Populando Arenas com SQL ===\n');

  try {
    // 1. Ler JSON
    const jsonPath = path.join(__dirname, '..', 'seed-data', 'conversations.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    console.log(`Usuarios: ${jsonData.usuarios.length}`);
    console.log(`Conversas: ${jsonData.conversas.length}\n`);

    // Mapa de slug para ID de arena
    const arenaSlugToId: { [key: string]: string } = {
      'postura-estetica': 'arena_001',
      'dor-funcao': 'arena_002',
      'avaliacao-biometrica': 'arena_003',
      'treino-performance': 'arena_004',
      'nutricao': 'arena_005',
      'mobilidade': 'arena_006',
    };

    let totalPosts = 0;
    let totalComments = 0;
    let totalInserts = 0;

    // 2. Para cada conversa, gerar SQL de inserts
    for (const conversa of jsonData.conversas) {
      console.log(`▶ ${conversa.arena_name}...`);

      let postsCount = 0;
      let sqlInserts: string[] = [];

      // Para cada thread
      for (const thread of conversa.threads) {
        // Pegar usuario
        const authorUser = jsonData.usuarios.find(
          (u: any) => u.id === thread.usuario_original_id
        );

        if (!authorUser) continue;

        // Gerar ID único para o post
        const postId = `post_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        // Insert post
        const escapedContent = thread.posts[0].conteudo.replace(/'/g, "''");
        const arenaId = arenaSlugToId[conversa.arena_slug];
        if (!arenaId) {
          console.log(`    ⚠ Arena slug not found: ${conversa.arena_slug}`);
          continue;
        }
        sqlInserts.push(
          `INSERT INTO "Post" ("id", "arenaId", "userId", "content", "createdAt", "updatedAt") VALUES ('${postId}', '${arenaId}', '${authorUser.id}', '${escapedContent}', '${now}', '${now}');`
        );

        postsCount++;

        // Inserir comentarios
        for (let i = 1; i < thread.posts.length; i++) {
          const postData = thread.posts[i];
          const commentUser = jsonData.usuarios.find(
            (u: any) => u.id === postData.usuario_id
          );

          if (!commentUser) continue;

          const commentId = `comment_${Math.random().toString(36).substr(2, 9)}`;
          const escapedCommentContent = postData.conteudo.replace(/'/g, "''");

          sqlInserts.push(
            `INSERT INTO "Comment" ("id", "postId", "userId", "content", "createdAt", "updatedAt") VALUES ('${commentId}', '${postId}', '${commentUser.id}', '${escapedCommentContent}', '${now}', '${now}');`
          );

          totalComments++;
        }
      }

      // Executar inserts em batch
      if (sqlInserts.length > 0) {
        const sql = sqlInserts.join('\n');
        try {
          // Escrever SQL em arquivo temporário
          const scratchDir = 'C:\\Users\\NFC\\AppData\\Local\\Temp\\claude\\D--\\1041864b-f6cb-44d4-86d4-7445c9e11811\\scratchpad';
          if (!fs.existsSync(scratchDir)) {
            fs.mkdirSync(scratchDir, { recursive: true });
          }
          const tempFile = path.join(scratchDir, `seed_${conversa.arena_slug}.sql`);
          fs.writeFileSync(tempFile, sql, 'utf-8');

          // Executar via docker cp + docker exec
          const containerPath = `/tmp/seed_${conversa.arena_slug}.sql`;
          await execAsync(`docker cp "${tempFile}" nfc-postgres:${containerPath}`, {
            maxBuffer: 10 * 1024 * 1024,
          });
          const { stdout, stderr } = await execAsync(
            `docker exec -i nfc-postgres psql -U nfc -d nfc_admin -f ${containerPath} 2>&1`,
            { maxBuffer: 10 * 1024 * 1024 }
          );

          if (stderr && !stderr.includes('INSERT')) {
            console.log(`  ⚠ ${stderr.substring(0, 100)}`);
          }

          totalPosts += postsCount;
          totalInserts += sqlInserts.length;

          console.log(
            `  ✓ ${postsCount} posts inseridos (${sqlInserts.length} rows)`
          );
        } catch (e: any) {
          console.error(`  ✗ Erro: ${e.message.substring(0, 100)}`);
        }
      }
    }

    console.log(`\n✅ COMPLETO!`);
    console.log(`  Posts totais: ${totalPosts}`);
    console.log(`  Comentarios: ${totalComments}`);
    console.log(`  Total de inserts SQL: ${totalInserts}`);
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

main();
