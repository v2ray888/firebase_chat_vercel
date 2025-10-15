const postgres = require('postgres');

async function checkAISetting() {
  let sql;
  try {
    console.log('Connecting to database...');
    sql = postgres(process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', { 
      ssl: 'require'
    });
    
    // 检查AI开关设置
    const settings = await sql`SELECT enable_ai_suggestions FROM app_settings LIMIT 1`;
    console.log('Current enable_ai_suggestions value:', settings[0]?.enable_ai_suggestions);
    
    // 手动更新设置为false来测试
    await sql`UPDATE app_settings SET enable_ai_suggestions = false`;
    console.log('AI setting updated to false');
    
    // 再次检查确认
    const updatedSettings = await sql`SELECT enable_ai_suggestions FROM app_settings LIMIT 1`;
    console.log('Updated enable_ai_suggestions value:', updatedSettings[0]?.enable_ai_suggestions);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

checkAISetting();