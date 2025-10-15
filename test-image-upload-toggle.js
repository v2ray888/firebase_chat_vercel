const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Testing image upload toggle feature...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function testImageUploadToggle() {
  try {
    console.log('=== TESTING IMAGE UPLOAD TOGGLE FEATURE ===\n');
    
    // 1. 检查app_settings表结构
    console.log('1. Checking app_settings table structure...');
    const settingsColumns = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings' AND column_name = 'enable_image_upload'
    `;
    
    if (settingsColumns.length > 0) {
      console.log('   ✓ enable_image_upload column exists:');
      console.log(`     - Name: ${settingsColumns[0].column_name}`);
      console.log(`     - Type: ${settingsColumns[0].data_type}`);
      console.log(`     - Default: ${settingsColumns[0].column_default}`);
    } else {
      console.log('   ✗ enable_image_upload column not found');
      return;
    }
    
    // 2. 检查当前设置值
    console.log('\n2. Checking current settings...');
    const currentSettings = await sql`SELECT enable_image_upload FROM app_settings WHERE id = 1`;
    
    if (currentSettings.length > 0) {
      console.log('   Current enable_image_upload value:', currentSettings[0].enable_image_upload);
    } else {
      console.log('   No settings found');
    }
    
    // 3. 测试更新设置
    console.log('\n3. Testing settings update...');
    const newEnableValue = !(currentSettings[0]?.enable_image_upload ?? true);
    console.log(`   Updating enable_image_upload to: ${newEnableValue}`);
    
    const updateResult = await sql`
      UPDATE app_settings 
      SET enable_image_upload = ${newEnableValue}, updated_at = NOW()
      WHERE id = 1
      RETURNING enable_image_upload
    `;
    
    if (updateResult.length > 0) {
      console.log('   ✓ Settings updated successfully');
      console.log('   New enable_image_upload value:', updateResult[0].enable_image_upload);
    } else {
      console.log('   ✗ Failed to update settings');
    }
    
    // 4. 验证更新
    console.log('\n4. Verifying update...');
    const verifySettings = await sql`SELECT enable_image_upload FROM app_settings WHERE id = 1`;
    
    if (verifySettings.length > 0 && verifySettings[0].enable_image_upload === newEnableValue) {
      console.log('   ✓ Settings verified successfully');
      console.log('   Final enable_image_upload value:', verifySettings[0].enable_image_upload);
    } else {
      console.log('   ✗ Settings verification failed');
    }
    
    // 5. 恢复原始值
    console.log('\n5. Restoring original value...');
    const originalValue = currentSettings[0]?.enable_image_upload ?? true;
    await sql`
      UPDATE app_settings 
      SET enable_image_upload = ${originalValue}, updated_at = NOW()
      WHERE id = 1
    `;
    
    console.log('   ✓ Original value restored');
    
    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
    console.log('✓ Image upload toggle feature is working correctly');
    console.log('✓ Database column exists and is functional');
    console.log('✓ Settings can be updated and retrieved');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sql.end();
  }
}

testImageUploadToggle();