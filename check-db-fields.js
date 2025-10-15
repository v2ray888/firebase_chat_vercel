const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Checking database field names...');

// 使用camelCase转换
const sql = postgres(connectionString, {
  ssl: 'require',
  transform: postgres.camel
});

async function checkFields() {
  try {
    // 检查app_settings表
    console.log('\n=== app_settings table ===');
    const settings = await sql`SELECT * FROM app_settings WHERE id = 1`;
    if (settings.length > 0) {
      console.log('Fields in app_settings:');
      console.log(Object.keys(settings[0]));
      console.log('\nSample data:');
      console.log(JSON.stringify(settings[0], null, 2));
    } else {
      console.log('No settings found');
    }
    
    // 检查quick_replies表
    console.log('\n=== quick_replies table ===');
    const quickReplies = await sql`SELECT * FROM quick_replies LIMIT 1`;
    if (quickReplies.length > 0) {
      console.log('Fields in quick_replies:');
      console.log(Object.keys(quickReplies[0]));
      console.log('\nSample data:');
      console.log(JSON.stringify(quickReplies[0], null, 2));
    } else {
      console.log('No quick replies found');
    }
    
    // 检查cases表
    console.log('\n=== cases table ===');
    const cases = await sql`SELECT * FROM cases LIMIT 1`;
    if (cases.length > 0) {
      console.log('Fields in cases:');
      console.log(Object.keys(cases[0]));
    } else {
      console.log('No cases found');
    }
    
    // 检查customers表
    console.log('\n=== customers table ===');
    const customers = await sql`SELECT * FROM customers LIMIT 1`;
    if (customers.length > 0) {
      console.log('Fields in customers:');
      console.log(Object.keys(customers[0]));
    } else {
      console.log('No customers found');
    }
    
    // 检查messages表
    console.log('\n=== messages table ===');
    const messages = await sql`SELECT * FROM messages LIMIT 1`;
    if (messages.length > 0) {
      console.log('Fields in messages:');
      console.log(Object.keys(messages[0]));
    } else {
      console.log('No messages found');
    }
    
    await sql.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkFields();