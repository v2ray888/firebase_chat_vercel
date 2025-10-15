const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Connecting to database...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function finalDBCheck() {
  try {
    console.log('=== FINAL DATABASE STRUCTURE CHECK ===\n');
    
    // 检查messages表结构
    console.log('1. Messages table structure:');
    const messagesColumns = await sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'messages' 
      ORDER BY ordinal_position
    `;
    
    messagesColumns.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}`);
    });
    
    // 检查是否有image_url列
    const hasImageUrlColumn = messagesColumns.some(col => col.column_name === 'image_url');
    console.log(`\n2. Image URL column exists: ${hasImageUrlColumn ? 'YES' : 'NO'}`);
    
    // 检查app_settings表结构
    console.log('\n3. App settings table structure:');
    const settingsColumns = await sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'app_settings' 
      ORDER BY ordinal_position
    `;
    
    settingsColumns.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}) - Nullable: ${col.is_nullable}`);
    });
    
    // 检查是否有enable_ai_suggestions列
    const hasAiSuggestionsColumn = settingsColumns.some(col => col.column_name === 'enable_ai_suggestions');
    console.log(`\n4. AI suggestions column exists: ${hasAiSuggestionsColumn ? 'YES' : 'NO'}`);
    
    console.log('\n=== CHECK COMPLETE ===');
    
  } catch (error) {
    console.error('Database check failed:', error.message);
  } finally {
    await sql.end();
  }
}

finalDBCheck();