const postgres = require('postgres');

// Hardcoded connection string for debugging
const connectionString = 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('Attempting to connect to database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  timeout: 5000
});

async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Tables:', JSON.stringify(tables, null, 2));
    
    // Check app_settings table structure
    const settingsColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings'
      ORDER BY ordinal_position
    `;
    
    console.log('app_settings columns:', JSON.stringify(settingsColumns, null, 2));
    
    // Check if quick_replies table exists
    const quickRepliesExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'quick_replies'
      )
    `;
    
    console.log('quick_replies table exists:', quickRepliesExists[0].exists);
    
  } catch (error) {
    console.error('Error checking schema:', error.message);
  } finally {
    await sql.end();
  }
}

checkSchema();