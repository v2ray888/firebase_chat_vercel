const { sql } = require('./src/lib/db');

async function testQuickReplies() {
  try {
    // 检查表结构
    console.log('Checking quick_replies table structure...');
    const tableInfo = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'quick_replies'`;
    console.log('Table structure:', tableInfo);
    
    // 检查现有数据
    console.log('Checking existing quick replies...');
    const quickReplies = await sql`SELECT * FROM quick_replies LIMIT 5`;
    console.log('Existing quick replies:', quickReplies);
    
    sql.end();
  } catch (error) {
    console.error('Error:', error);
    sql.end();
  }
}

testQuickReplies();