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

async function initQuickReplies() {
  try {
    // 插入一些测试数据
    await sql`DELETE FROM quick_replies`;
    
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
    
    console.log('Quick replies initialized successfully!');
    
    // 验证数据
    const replies = await sql`SELECT * FROM quick_replies ORDER BY sort_order`;
    console.log('Current quick replies:');
    console.table(replies);
  } catch (error) {
    console.error('Error initializing quick replies:', error.message);
  } finally {
    await sql.end();
  }
}

initQuickReplies();