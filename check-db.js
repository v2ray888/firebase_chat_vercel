const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Attempting to connect to database...');

const sql = postgres(connectionString, {
  timeout: 5000
});

async function checkSettings() {
  try {
    console.log('Querying app_settings table...');
    const result = await sql`SELECT * FROM app_settings WHERE id = 1`;
    console.log('Settings result:', result);
    
    if (result.length > 0) {
      console.log('Current settings:');
      console.log('- Primary Color:', result[0].primary_color || result[0].primaryColor);
      console.log('- Welcome Message:', result[0].welcome_message || result[0].welcomeMessage);
      console.log('- Offline Message:', result[0].offline_message || result[0].offlineMessage);
      console.log('- Accept New Chats:', result[0].accept_new_chats || result[0].acceptNewChats);
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