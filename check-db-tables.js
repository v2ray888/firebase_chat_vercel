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

async function checkTables() {
  try {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Database tables:');
    tables.forEach(table => {
      console.log('- ' + table.tableName);
    });
    
    // 检查是否有quick_replies表
    const hasQuickRepliesTable = tables.some(table => table.tableName === 'quick_replies');
    console.log('\nHas quick_replies table:', hasQuickRepliesTable);
    
    if (hasQuickRepliesTable) {
      const replies = await sql`SELECT * FROM quick_replies`;
      console.log('\nQuick replies in database:');
      console.table(replies);
    }
  } catch (error) {
    console.error('Error checking database:', error.message);
  } finally {
    await sql.end();
  }
}

checkTables();