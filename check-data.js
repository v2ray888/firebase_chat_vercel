const postgres = require('postgres');

async function checkData() {
  let sql;
  try {
    console.log('Connecting to database...');
    sql = postgres(process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', { 
      ssl: 'require'
    });
    
    // 等待连接建立
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 检查数据
    const replies = await sql`SELECT * FROM quick_replies ORDER BY sort_order`;
    console.log('Current quick replies:');
    console.log('Total count:', replies.length);
    replies.forEach((reply, index) => {
      console.log(`${index + 1}. ID: ${reply.id}, Content: ${reply.content}, Sort: ${reply.sort_order}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

checkData();