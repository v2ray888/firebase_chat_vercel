const { config } = require('dotenv');
config();

const postgres = require('postgres');

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL environment variable is not set');
  process.exit(1);
}

const connectionString = process.env.POSTGRES_URL;
console.log('Attempting to connect to database...');

const sql = postgres(connectionString, {
  ssl: 'require',
  transform: postgres.camel,
  timeout: 5000
});

async function checkQueryResult() {
  try {
    console.log('Querying conversations with detailed logging...');
    
    const rows = await sql`
        SELECT
            c.id,
            c.status,
            c.summary,
            c.created_at,
            c.updated_at,
            cust.id as customer_id,
            cust.name as customer_name,
            cust.email as customer_email,
            cust.avatar as customer_avatar,
            cust.created_at as customer_created_at,
            cust.updated_at as customer_updated_at
        FROM cases c
        JOIN customers cust ON c.customer_id = cust.id
        ORDER BY c.updated_at DESC
        LIMIT 1;
    `;
    
    console.log('Raw query result:', JSON.stringify(rows, null, 2));
    console.log('First row keys:', Object.keys(rows[0]));
    
  } catch (error) {
    console.error('Error querying database:', error.message);
  } finally {
    await sql.end();
  }
}

checkQueryResult();