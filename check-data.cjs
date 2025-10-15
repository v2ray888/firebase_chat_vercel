const { config } = require('dotenv');
config();

const postgres = require('postgres');

const pg_url = process.env.POSTGRES_URL;

if (!pg_url) {
  console.error('POSTGRES_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(pg_url, { 
  transform: postgres.camel
});

async function checkData() {
  try {
    console.log('Checking users table...');
    const users = await sql`SELECT * FROM users`;
    console.log('Users count:', users.length);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\nChecking customers table...');
    const customers = await sql`SELECT * FROM customers`;
    console.log('Customers count:', customers.length);
    customers.forEach(customer => {
      console.log(`- ${customer.name} (${customer.email})`);
    });

    console.log('\nChecking cases table...');
    const cases = await sql`SELECT * FROM cases`;
    console.log('Cases count:', cases.length);
    
    console.log('\nChecking messages table...');
    const messages = await sql`SELECT * FROM messages`;
    console.log('Messages count:', messages.length);
    
    console.log('\nChecking app_settings table...');
    const settings = await sql`SELECT * FROM app_settings`;
    console.log('Settings:', settings[0]);
    
  } catch (err) {
    console.error('Failed to check data:', err);
  } finally {
    await sql.end();
  }
}

checkData();