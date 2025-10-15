const postgres = require('postgres');

// 从.env文件读取数据库URL
const dbUrl = 'postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// 创建数据库连接
const sql = postgres(dbUrl, {
  ssl: 'require',
  transform: postgres.camel,
  connection: {
    charset: 'utf8'
  }
});

async function checkUsers() {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log('Users in DB:');
    console.log(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
  } finally {
    await sql.end();
  }
}

checkUsers();