const postgres = require('postgres');
require('dotenv').config();

async function testDBConnection() {
  try {
    console.log('Testing database connection...');
    console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'Loaded' : 'Not found');
    
    const sql = postgres(process.env.POSTGRES_URL, { 
      ssl: 'require',
      timeout: 5000
    });
    
    // 测试连接
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful!');
    console.log('Test result:', result);
    
    // 检查messages表结构
    console.log('\nChecking messages table structure...');
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
    
    // 检查是否包含image_url列
    const hasImageColumn = columns.some(col => col.column_name === 'image_url');
    console.log('\nHas image_url column:', hasImageColumn);
    
    await sql.end();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testDBConnection();