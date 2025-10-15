const { config } = require('dotenv');
config();

const postgres = require('postgres');

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL environment variable is not set');
  process.exit(1);
}

const connectionString = process.env.POSTGRES_URL;
console.log('Attempting to connect to database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  timeout: 5000
});

async function updateSettings() {
  try {
    console.log('Updating app_settings with correct Chinese characters...');
    
    const updateResult = await sql`
      UPDATE app_settings 
      SET 
        welcome_message = '您好！我们能为您做些什么？',
        offline_message = '我们目前不在。请留言，我们会尽快回复您。'
      WHERE id = 1
      RETURNING *
    `;
    
    console.log('Update result:', updateResult);
    
    // 验证更新
    const result = await sql`SELECT * FROM app_settings WHERE id = 1`;
    console.log('Verification result:', result[0]);
  } catch (error) {
    console.error('Error updating database:', error.message);
  } finally {
    await sql.end();
  }
}

updateSettings();