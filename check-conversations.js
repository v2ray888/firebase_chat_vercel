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
  timeout: 5000
});

async function checkConversations() {
  try {
    console.log('Querying conversations...');
    
    const rows = await sql`
        SELECT
            c.id as case_id,
            c.status as case_status,
            c.summary as case_summary,
            c.created_at as case_created_at,
            c.updated_at as case_updated_at,
            cust.id as customer_id,
            cust.name as customer_name,
            cust.email as customer_email,
            cust.avatar as customer_avatar
        FROM cases c
        JOIN customers cust ON c.customer_id = cust.id
        ORDER BY c.updated_at DESC
        LIMIT 5;
    `;
    
    console.log('Conversations:', JSON.stringify(rows, null, 2));
    
    if (rows.length > 0) {
      console.log('Checking messages for first conversation...');
      const firstCaseId = rows[0].case_id;
      const messages = await sql`
        SELECT * FROM messages 
        WHERE case_id = ${firstCaseId}
        ORDER BY timestamp ASC
      `;
      
      console.log('Messages for case', firstCaseId, ':', JSON.stringify(messages, null, 2));
    }
  } catch (error) {
    console.error('Error querying database:', error.message);
  } finally {
    await sql.end();
  }
}

checkConversations();