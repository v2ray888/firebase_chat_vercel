const postgres = require('postgres');

// 从.env文件读取数据库URL
const dbUrl = 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// 创建数据库连接
const sql = postgres(dbUrl, {
  ssl: 'require',
  transform: postgres.camel,
  connection: {
    charset: 'utf8'
  }
});

async function checkDBStructure() {
  try {
    // 获取所有表
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Database Tables:');
    for (const table of tables) {
      console.log(`\nTable: ${table.tableName}`);
      
      // 获取表的列信息
      const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${table.tableName} ORDER BY ordinal_position`;
      console.log('Columns:');
      columns.forEach(column => {
        console.log(`  - ${column.columnName} (${column.dataType})`);
      });
    }
  } catch (error) {
    console.error('Error checking database structure:', error.message);
  } finally {
    await sql.end();
  }
}

checkDBStructure();