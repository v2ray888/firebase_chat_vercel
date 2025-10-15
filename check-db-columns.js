const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Checking database columns...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function checkColumns() {
  try {
    // 检查app_settings表的所有列
    const allColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings'
      ORDER BY ordinal_position
    `;
    
    console.log('All app_settings columns:');
    allColumns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });
    
    // 检查特定列
    const imageColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings' AND column_name = 'enable_image_upload'
    `;
    
    console.log('\nImage upload column exists:', imageColumn.length > 0);
    
    // 检查实际数据
    const settings = await sql`SELECT * FROM app_settings WHERE id = 1`;
    if (settings.length > 0) {
      console.log('\nSettings data:');
      Object.keys(settings[0]).forEach(key => {
        console.log(`- ${key}: ${settings[0][key]}`);
      });
    }
    
    await sql.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkColumns();