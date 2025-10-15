const { config } = require('dotenv');
config();

const postgres = require('postgres');

const pg_url = process.env.POSTGRES_URL;

if (!pg_url) {
  console.error('POSTGRES_URL environment variable is not set');
  process.exit(1);
}

console.log('Attempting to connect to:', pg_url);

const sql = postgres(pg_url, { 
  transform: postgres.camel,
  timeout: 5000
});

async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful:', result);
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    await sql.end();
  }
}

testConnection();