const postgres = require('postgres');

async function debugQuickReplies() {
  let sql;
  try {
    console.log('Connecting to database...');
    sql = postgres('postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', { 
      ssl: 'require',
      transform: postgres.camel
    });
    
    console.log('Checking if quick_replies table exists...');
    const tableCheck = await sql`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quick_replies') as exists`;
    console.log('Table exists:', tableCheck[0].exists);
    
    if (tableCheck[0].exists) {
      console.log('Fetching quick replies...');
      const replies = await sql`SELECT * FROM quick_replies ORDER BY sort_order`;
      console.log('Found', replies.length, 'quick replies:');
      console.log(JSON.stringify(replies, null, 2));
    } else {
      console.log('quick_replies table does not exist');
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

debugQuickReplies();