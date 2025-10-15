const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Final test of image upload toggle...');

// 使用camelCase转换
const sql = postgres(connectionString, {
  ssl: 'require',
  transform: postgres.camel
});

async function finalTest() {
  try {
    // 检查实际数据
    const settings = await sql`SELECT * FROM app_settings WHERE id = 1`;
    if (settings.length > 0) {
      console.log('Current enableImageUpload value:', settings[0].enableImageUpload);
      
      // 更新值
      const newValue = !(settings[0].enableImageUpload ?? true);
      console.log('Updating to:', newValue);
      
      const updateResult = await sql`
        UPDATE app_settings 
        SET enable_image_upload = ${newValue}
        WHERE id = 1
        RETURNING enable_image_upload
      `;
      
      console.log('Update result:', updateResult[0].enableImageUpload);
      
      // 验证更新
      const verify = await sql`SELECT enable_image_upload FROM app_settings WHERE id = 1`;
      console.log('Verified value:', verify[0].enableImageUpload);
      
      // 恢复原值
      await sql`
        UPDATE app_settings 
        SET enable_image_upload = ${settings[0].enableImageUpload}
        WHERE id = 1
      `;
      
      console.log('Restored original value');
    } else {
      console.log('No settings found');
    }
    
    await sql.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

finalTest();