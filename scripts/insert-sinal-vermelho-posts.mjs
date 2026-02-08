import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';

const supabase = createClient(
  'https://qducbqhuwqdyqioqevle.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdWNicWh1d3FkeXFpb3FldmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NDM3NjgsImV4cCI6MjA4NDUxOTc2OH0.hzOmMJcRGFPShGLRecDruzOr8_W3kwdtykI2NJpyOXE'
);

async function main() {
  const arenaId = 'arena-sinal-vermelho';
  const dockerUUID = '550e8400-e29b-41d4-a716-446655440000';

  const { data: posts } = await supabase
    .from('Post')
    .select('*')
    .eq('arenaId', arenaId);

  console.log(`📝 Posts encontrados: ${posts?.length || 0}`);

  let sql = '';
  for (const p of (posts || [])) {
    const content = (p.content || '').replace(/'/g, "''");
    sql += `INSERT INTO "Post" (id, content, "arenaId", "userId", "isAIResponse", "isPublished", "isApproved", "createdAt", "updatedAt") VALUES ('${p.id}', '${content}', '${dockerUUID}', '${p.userId}', ${p.isAIResponse}, ${p.isPublished}, ${p.isApproved}, '${p.createdAt}', '${p.updatedAt}');\n`;
  }

  if (sql.length > 0) {
    execSync('docker exec -i nfc-postgres psql -U nfc -d nfc_admin', {
      input: sql,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    console.log('✅ Posts Sinal Vermelho inseridos!');
  }
}

main().catch(console.error);
