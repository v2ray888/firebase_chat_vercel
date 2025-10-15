import postgres from 'postgres';

const sql = postgres('postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', {
  transform: postgres.camel
});

async function testLogin(email, password) {
  try {
    console.log(`Attempting to login with email: ${email}`);
    
    // 查找用户
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (users.length === 0) {
      console.log('User not found');
      return;
    }
    
    const user = users[0];
    console.log('User found:', user);
    
    // 注意：在实际应用中，我们需要验证密码
    // 这里我们只是检查用户是否存在
    const { password: _, ...userWithoutPassword } = user;
    console.log('User without password:', userWithoutPassword);
    
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    await sql.end();
  }
}

// 测试Jordan Lee的登录
testLogin('jordan.lee@example.com', 'password123');