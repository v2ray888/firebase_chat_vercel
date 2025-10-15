const postgres = require('postgres');

async function checkMessagesTable() {
  let sql;
  try {
    console.log('Connecting to database...');
    sql = postgres(process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', { 
      ssl: 'require'
    });
    
    // 检查messages表结构
    console.log('\n=== MESSAGES TABLE STRUCTURE ===');
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
    
    console.log('Columns:');
    columns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}, Default: ${col.column_default || 'NULL'}`);
    });
    
    // 检查是否有数据
    console.log('\n=== SAMPLE DATA ===');
    const sampleData = await sql`SELECT * FROM messages LIMIT 3`;
    console.log('Sample records:');
    sampleData.forEach((row, index) => {
      console.log(`Record ${index + 1}:`, JSON.stringify(row, null, 2));
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

checkMessagesTable();