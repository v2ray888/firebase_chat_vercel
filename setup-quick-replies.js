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

async function setupQuickReplies() {
  try {
    // 创建表（如果不存在）
    await sql`
      CREATE TABLE IF NOT EXISTS quick_replies (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('Quick replies table created or already exists');
    
    // 检查是否已有数据，如果没有则插入测试数据
    const existingReplies = await sql`SELECT COUNT(*) as count FROM quick_replies`;
    
    if (existingReplies[0].count === 0) {
      console.log('Inserting test data...');
      
      const testReplies = [
        '您好，请问有什么可以帮助您的吗？',
        '感谢您的咨询，我们会在24小时内回复您。',
        '如果您有紧急问题，请拨打我们的客服热线。',
        '我们的工作时间是周一至周五，上午9点到下午6点。'
      ];
      
      for (let i = 0; i < testReplies.length; i++) {
        await sql`
          INSERT INTO quick_replies (content, sort_order)
          VALUES (${testReplies[i]}, ${i})
        `;
      }
      
      console.log('Test data inserted successfully!');
    } else {
      console.log('Quick replies table already has data');
    }
    
    // 验证数据
    const replies = await sql`SELECT * FROM quick_replies ORDER BY sort_order`;
    console.log('\nCurrent quick replies:');
    replies.forEach(reply => {
      console.log(`${reply.sortOrder}: ${reply.content}`);
    });
  } catch (error) {
    console.error('Error setting up quick replies:', error.message);
  } finally {
    await sql.end();
  }
}

setupQuickReplies();