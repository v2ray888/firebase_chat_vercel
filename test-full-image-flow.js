const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Testing full image message flow...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function testFullImageFlow() {
  try {
    console.log('=== TESTING FULL IMAGE MESSAGE FLOW ===\n');
    
    // 1. 创建测试案例
    console.log('1. Creating test case...');
    const customerResult = await sql`
      INSERT INTO customers (name, email, avatar)
      VALUES ('Test Customer', 'test@example.com', 'https://picsum.photos/seed/test/40/40')
      RETURNING id
    `;
    
    const customerId = customerResult[0].id;
    console.log('   Customer created with ID:', customerId);
    
    const caseResult = await sql`
      INSERT INTO cases (customer_id, status, summary)
      VALUES (${customerId}, 'open', 'Test case for image messages')
      RETURNING id
    `;
    
    const caseId = caseResult[0].id;
    console.log('   Case created with ID:', caseId);
    
    // 2. 发送带图片的消息
    console.log('\n2. Sending image message...');
    const messageData = {
      case_id: caseId,
      sender_type: 'agent',
      content: '这是带图片的消息',
      timestamp: new Date().toISOString(),
      image_url: 'https://picsum.photos/seed/testmessage/400/300'
    };
    
    const messageResult = await sql`
      INSERT INTO messages ${sql(messageData)}
      RETURNING *
    `;
    
    console.log('   Message sent:', {
      id: messageResult[0].id,
      content: messageResult[0].content,
      imageUrl: messageResult[0].image_url,
      timestamp: messageResult[0].timestamp
    });
    
    // 3. 查询消息
    console.log('\n3. Retrieving messages...');
    const retrievedMessages = await sql`
      SELECT * FROM messages WHERE case_id = ${caseId}
      ORDER BY timestamp
    `;
    
    console.log('   Retrieved messages:');
    retrievedMessages.forEach((msg, index) => {
      console.log(`     ${index + 1}. ${msg.content}`);
      if (msg.image_url) {
        console.log(`        Image: ${msg.image_url}`);
      }
    });
    
    // 4. 清理测试数据
    console.log('\n4. Cleaning up test data...');
    await sql`DELETE FROM messages WHERE case_id = ${caseId}`;
    await sql`DELETE FROM cases WHERE id = ${caseId}`;
    await sql`DELETE FROM customers WHERE id = ${customerId}`;
    
    console.log('   Test data cleaned up successfully');
    
    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
    console.log('✓ Image URL column is working correctly');
    console.log('✓ Messages with images can be inserted and retrieved');
    console.log('✓ Database schema supports image messages');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sql.end();
  }
}

testFullImageFlow();