require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  // First try with all columns
  const { data: all, error: err1 } = await supabase
    .from('Arena')
    .select('*')
    .limit(1);

  if (err1) {
    console.log('Error fetching arenas:', err1.message);
    return;
  }

  if (all && all.length > 0) {
    console.log('=== COLUMNS IN Arena TABLE ===');
    console.log(Object.keys(all[0]).join(', '));
    console.log('\n=== SAMPLE ARENA ===');
    console.log(JSON.stringify(all[0], null, 2));
  }

  // Now fetch all arenas with just core fields
  const { data, error } = await supabase
    .from('Arena')
    .select('slug, name, totalPosts')
    .order('name');

  if (error) {
    console.log('Error:', error.message);
    return;
  }

  console.log('\n=== ALL ARENAS ===');
  data.forEach(a => {
    console.log(`  ${a.slug.padEnd(40)} "${a.name}" (${a.totalPosts} posts)`);
  });
  console.log(`\nTotal: ${data.length} arenas`);
})();
