const postgres = require('postgres');

async function addImageUrlColumn() {
  let sql;
  try {
    console.log('Connecting to database...');
    sql = postgres(process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', { 
      ssl: 'require'
    });
    
    // 检查messages表结构
    const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages' ORDER BY ordinal_position`;
    console.log('Current messages columns:');
    columns.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });
    
    // 检查是否需要添加image_url列
    const hasImageColumn = columns.some(col => col.column_name === 'image_url');
    console.log('\nHas image_url column:', hasImageColumn);
    
    if (!hasImageColumn) {
      console.log('\nAdding image_url column...');
      try {
        await sql`ALTER TABLE messages ADD COLUMN image_url TEXT`;
        console.log('Column added successfully!');
      } catch (error) {
        console.error('Error adding column:', error.message);
      }
    } else {
      console.log('\nColumn already exists.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

addImageUrlColumn();