const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Creating default settings...');

// 使用camelCase转换
const sql = postgres(connectionString, {
  ssl: 'require',
  transform: postgres.camel
});

async function createDefaultSettings() {
  try {
    // 检查是否已存在设置
    const existing = await sql`SELECT id FROM app_settings WHERE id = 1`;
    
    if (existing.length === 0) {
      console.log('Creating default settings...');
      
      // 创建默认设置
      const result = await sql`
        INSERT INTO app_settings (
          id, primary_color, welcome_message, offline_message, accept_new_chats,
          widget_title, widget_subtitle, auto_open_widget, show_branding,
          typing_indicator_message, connection_message, work_start_time,
          work_end_time, auto_offline, away_message, enable_ai_suggestions,
          enable_image_upload
        ) VALUES (
          1, '#64B5F6', '您好！我们能为您做些什么？', '我们目前不在。请留言，我们会尽快回复您。', true,
          '客服支持', '我们通常在几分钟内回复', false, true,
          '客服正在输入...', '已连接到客服', '09:00',
          '18:00', false, '我现在不在，但我稍后会回复您。', true,
          true
        ) RETURNING *
      `;
      
      console.log('Default settings created:', result[0]);
    } else {
      console.log('Settings already exist');
      
      // 确保enable_image_upload字段存在
      const updateResult = await sql`
        UPDATE app_settings 
        SET enable_image_upload = COALESCE(enable_image_upload, true)
        WHERE id = 1
        RETURNING *
      `;
      
      console.log('Settings updated with enable_image_upload:', updateResult[0].enableImageUpload);
    }
    
    await sql.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createDefaultSettings();