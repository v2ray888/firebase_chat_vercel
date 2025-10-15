const { config } = require('dotenv');
config();

console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');

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

async function checkSettings() {
  try {
    console.log('Querying app_settings table...');
    const result = await sql`SELECT * FROM app_settings WHERE id = 1`;
    console.log('Raw result:', JSON.stringify(result, null, 2));
    
    if (result.length > 0) {
      console.log('Current settings:');
      console.log('- Primary Color:', result[0].primary_color);
      console.log('- Welcome Message:', result[0].welcome_message);
      console.log('- Offline Message:', result[0].offline_message);
      console.log('- Accept New Chats:', result[0].accept_new_chats);
    } else {
      console.log('No settings found in database');
    }
  } catch (error) {
    console.error('Error querying database:', error.message);
  } finally {
    await sql.end();
  }
}

checkSettings();