const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Attempting to connect to database...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function addImageColumn() {
  try {
    console.log('Checking if image_url column exists...');
    
    // 检查列是否存在
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'messages' AND column_name = 'image_url'
    `;
    
    if (columns.length > 0) {
      console.log('image_url column already exists');
      return;
    }
    
    console.log('Adding image_url column to messages table...');
    await sql`ALTER TABLE messages ADD COLUMN image_url TEXT`;
    console.log('image_url column added successfully!');
    
  } catch (error) {
    console.error('Error adding column:', error.message);
    if (error.message.includes('duplicate column')) {
      console.log('Column already exists');
    }
  } finally {
    await sql.end();
  }
}

addImageColumn();