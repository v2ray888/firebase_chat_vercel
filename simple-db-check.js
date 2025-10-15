const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

// 使用camelCase转换
const sql = postgres(connectionString, {
  ssl: 'require',
  transform: postgres.camel
});

async function checkDB() {
  try {
    console.log('Connecting to database...');
    
    // 检查app_settings表
    const settings = await sql`SELECT * FROM app_settings WHERE id = 1`;
    console.log('App settings:', JSON.stringify(settings, null, 2));
    
    await sql.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDB();