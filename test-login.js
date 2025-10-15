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

async function testLogin() {
  try {
    // 测试用户凭证
    const email = 'alex.doe@example.com';
    const password = 'password123';
    
    console.log(`Testing login for ${email}`);
    
    // 查找用户
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (users.length === 0) {
      console.log('User not found');
      return;
    }
    
    const user = users[0];
    console.log('User found:', user);
    
    // 测试密码比较
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('Login successful');
    } else {
      console.log('Invalid password');
    }
  } catch (error) {
    console.error('Login test error:', error.message);
  } finally {
    await sql.end();
  }
}

testLogin();