const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Adding enable_image_upload column to app_settings table...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function addEnableImageUploadColumn() {
  try {
    console.log('=== ADDING ENABLE_IMAGE_UPLOAD COLUMN ===\n');
    
    // 检查是否已存在enable_image_upload列
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings' AND column_name = 'enable_image_upload'
    `;
    
    if (columns.length > 0) {
      console.log('Column enable_image_upload already exists');
      return;
    }
    
    // 添加enable_image_upload列
    console.log('Adding enable_image_upload column...');
    await sql`ALTER TABLE app_settings ADD COLUMN enable_image_upload BOOLEAN DEFAULT true`;
    
    console.log('✓ Column enable_image_upload added successfully');
    console.log('  - Type: BOOLEAN');
    console.log('  - Default value: true');
    
    // 验证列已添加
    console.log('\n=== VERIFYING COLUMN ADDITION ===');
    const verifyColumns = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings' AND column_name = 'enable_image_upload'
    `;
    
    if (verifyColumns.length > 0) {
      console.log('✓ Column verified:');
      console.log(`  - Name: ${verifyColumns[0].column_name}`);
      console.log(`  - Type: ${verifyColumns[0].data_type}`);
      console.log(`  - Default: ${verifyColumns[0].column_default}`);
    } else {
      console.log('✗ Column verification failed');
    }
    
    console.log('\n=== OPERATION COMPLETED ===');
    
  } catch (error) {
    console.error('Failed to add enable_image_upload column:', error.message);
    
    // 如果是列已存在的错误，忽略
    if (error.message.includes('duplicate column')) {
      console.log('Column already exists, ignoring error');
    }
  } finally {
    await sql.end();
  }
}

addEnableImageUploadColumn();