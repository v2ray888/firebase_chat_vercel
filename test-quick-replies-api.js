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

async function testQuickRepliesAPI() {
  try {
    // 模拟GET请求
    const quickReplies = await sql`
      SELECT * FROM quick_replies
      ORDER BY sort_order ASC, created_at ASC
    `;
    
    console.log('API Response:');
    console.log(JSON.stringify(quickReplies, null, 2));
    
    // 检查字段名
    console.log('\nField names in response:');
    if (quickReplies.length > 0) {
      console.log(Object.keys(quickReplies[0]));
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  } finally {
    await sql.end();
  }
}

testQuickRepliesAPI();