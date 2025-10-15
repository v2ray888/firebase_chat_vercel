import postgres from 'postgres';

const sql = postgres('postgresql://neondb_owner:npg_HyejBc0o4NDb@ep-weathered-water-a11m8s0w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', {
  transform: postgres.camel
});

async function checkUsers() {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await sql.end();
  }
}

checkUsers();