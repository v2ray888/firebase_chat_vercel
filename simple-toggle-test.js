const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Testing image upload toggle...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function simpleTest() {
  try {
    // 检查列是否存在
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings' AND column_name = 'enable_image_upload'
    `;
    
    console.log('Column exists:', columns.length > 0);
    
    // 如果存在，测试更新
    if (columns.length > 0) {
      // 获取当前值
      const current = await sql`SELECT enable_image_upload FROM app_settings WHERE id = 1`;
      console.log('Current value:', current[0]?.enable_image_upload);
      
      // 更新值
      const newValue = !(current[0]?.enable_image_upload ?? true);
      await sql`UPDATE app_settings SET enable_image_upload = ${newValue} WHERE id = 1`;
      console.log('Updated to:', newValue);
      
      // 验证更新
      const updated = await sql`SELECT enable_image_upload FROM app_settings WHERE id = 1`;
      console.log('Verified:', updated[0]?.enable_image_upload);
      
      // 恢复原值
      await sql`UPDATE app_settings SET enable_image_upload = ${current[0]?.enable_image_upload ?? true} WHERE id = 1`;
      console.log('Restored original value');
    }
    
    await sql.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

simpleTest();