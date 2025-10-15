const postgres = require('postgres');
require('dotenv').config(); // 加载环境变量

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const pg_url = process.env.POSTGRES_URL;

// Use postgres driver with SSL requirement for Neon database
const sql = postgres(pg_url, { 
  ssl: 'require'
});

(async () => {
  try {
    const customers = await sql`SELECT * FROM customers`;
    console.log('Customers:', JSON.stringify(customers, null, 2));
    
    const cases = await sql`SELECT * FROM cases`;
    console.log('Cases:', JSON.stringify(cases, null, 2));
    
    const messages = await sql`SELECT * FROM messages`;
    console.log('Messages:', JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await sql.end();
  }
})().catch(console.error);