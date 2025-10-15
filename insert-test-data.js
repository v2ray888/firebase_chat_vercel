const postgres = require('postgres');

async function insertTestData() {
  let sql;
  try {
    console.log('Connecting to database...');
    sql = postgres(process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', { 
      ssl: 'require'
    });
    
    // 检查表是否存在，如果不存在则创建
    try {
      await sql`CREATE TABLE IF NOT EXISTS quick_replies (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;
      console.log('Table checked/created');
    } catch (e) {
      console.log('Table exists or error creating table:', e.message);
    }
    
    // 清空现有数据并插入测试数据
    await sql`DELETE FROM quick_replies`;
    console.log('Existing data cleared');
    
    const testReplies = [
      '您好，请问有什么可以帮助您的吗？',
      '感谢您的咨询，我们会在24小时内回复您。',
      '如果您有紧急问题，请拨打我们的客服热线。',
      '我们的工作时间是周一至周五，上午9点到下午6点。'
    ];
    
    for (let i = 0; i < testReplies.length; i++) {
      await sql`INSERT INTO quick_replies (content, sort_order) VALUES (${testReplies[i]}, ${i})`;
    }
    
    console.log('Test data inserted');
    
    // 验证数据
    const replies = await sql`SELECT * FROM quick_replies ORDER BY sort_order`;
    console.log('Current quick replies:');
    replies.forEach((reply, index) => {
      console.log(`${index + 1}. ${reply.content}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

insertTestData();