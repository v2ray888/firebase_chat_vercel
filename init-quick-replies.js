const postgres = require('postgres');

// Hardcoded connection string for debugging
const connectionString = 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

console.log('Attempting to connect to database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  timeout: 5000
});

async function initQuickReplies() {
  try {
    console.log('Creating quick_replies table if it does not exist...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS quick_replies (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    
    console.log('Quick replies table created or already exists');
    
    // Check if we have any quick replies
    const existingReplies = await sql`SELECT COUNT(*) as count FROM quick_replies`;
    
    if (existingReplies[0].count === 0) {
      console.log('Inserting default quick replies...');
      
      await sql`
        INSERT INTO quick_replies (content, sort_order) VALUES 
        ('您好！我们能为您做些什么？', 0),
        ('感谢您的耐心等待。', 1),
        ('我们目前不在。请留言，我们会尽快回复您。', 2),
        ('这个问题我需要进一步了解，请提供更多详细信息。', 3)
      `;
      
      console.log('Default quick replies inserted');
    } else {
      console.log('Quick replies already exist, skipping default insertion');
    }
    
  } catch (error) {
    console.error('Error initializing quick replies:', error.message);
  } finally {
    await sql.end();
  }
}

initQuickReplies();