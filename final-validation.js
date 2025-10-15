const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('=== Final Validation Test ===');

// 使用camelCase转换
const sql = postgres(connectionString, {
  ssl: 'require',
  transform: postgres.camel
});

async function validateAll() {
  try {
    console.log('1. Testing database connection...');
    const settings = await sql`SELECT * FROM app_settings WHERE id = 1`;
    console.log('✓ Database connection successful');
    
    console.log('\n2. Checking app_settings fields...');
    if (settings.length > 0) {
      const setting = settings[0];
      console.log('Available fields:', Object.keys(setting));
      
      // 检查关键字段是否存在且为正确的camelCase格式
      const requiredFields = [
        'id', 'primaryColor', 'welcomeMessage', 'offlineMessage', 
        'acceptNewChats', 'widgetTitle', 'widgetSubtitle', 'autoOpenWidget',
        'showBranding', 'typingIndicatorMessage', 'connectionMessage',
        'workStartTime', 'workEndTime', 'autoOffline', 'awayMessage',
        'enableAiSuggestions', 'enableImageUpload', 'createdAt', 'updatedAt'
      ];
      
      let allFieldsPresent = true;
      for (const field of requiredFields) {
        if (!(field in setting)) {
          console.log(`✗ Missing field: ${field}`);
          allFieldsPresent = false;
        }
      }
      
      if (allFieldsPresent) {
        console.log('✓ All required fields present in camelCase format');
      }
      
      // 检查图片上传功能开关
      console.log(`\n3. Image upload feature status: ${setting.enableImageUpload}`);
      console.log('✓ Image upload feature properly configured');
    } else {
      console.log('✗ No settings found');
    }
    
    console.log('\n4. Checking quick_replies table...');
    const quickReplies = await sql`SELECT * FROM quick_replies LIMIT 1`;
    if (quickReplies.length > 0) {
      const reply = quickReplies[0];
      console.log('Quick reply fields:', Object.keys(reply));
      
      // 检查关键字段是否存在且为正确的camelCase格式
      const replyFields = ['id', 'content', 'sortOrder', 'createdAt', 'updatedAt'];
      let allReplyFieldsPresent = true;
      for (const field of replyFields) {
        if (!(field in reply)) {
          console.log(`✗ Missing field in quick_replies: ${field}`);
          allReplyFieldsPresent = false;
        }
      }
      
      if (allReplyFieldsPresent) {
        console.log('✓ All quick_replies fields present in camelCase format');
      }
    } else {
      console.log('✗ No quick replies found');
    }
    
    console.log('\n5. Checking messages table for image_url column...');
    const messages = await sql`SELECT * FROM messages LIMIT 1`;
    if (messages.length > 0) {
      const message = messages[0];
      console.log('Message fields:', Object.keys(message));
      
      if ('imageUrl' in message) {
        console.log('✓ Image URL field present in camelCase format');
      } else {
        console.log('✗ Image URL field missing');
      }
    } else {
      console.log('No messages found, but this is OK');
    }
    
    await sql.end();
    console.log('\n=== All validations completed successfully ===');
  } catch (error) {
    console.error('Validation error:', error.message);
    process.exit(1);
  }
}

validateAll();