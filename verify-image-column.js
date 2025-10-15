const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Attempting to connect to database...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function verifyImageColumn() {
  try {
    console.log('Checking messages table structure...');
    
    // 获取所有列
    const columns = await sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'messages' 
      ORDER BY ordinal_position
    `;
    
    console.log('Messages table columns:');
    columns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}, Default: ${col.column_default || 'NULL'}`);
    });
    
    // 检查image_url列是否存在
    const imageColumn = columns.find(col => col.column_name === 'image_url');
    if (imageColumn) {
      console.log('\n✓ image_url column exists:');
      console.log(`  - Name: ${imageColumn.column_name}`);
      console.log(`  - Type: ${imageColumn.data_type}`);
      console.log(`  - Nullable: ${imageColumn.is_nullable}`);
    } else {
      console.log('\n✗ image_url column does not exist');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sql.end();
  }
}

verifyImageColumn();