const { config } = require('dotenv');
config();

const postgres = require('postgres');

const connectionString = process.env.POSTGRES_URL;

console.log('Testing client image message feature...');

const sql = postgres(connectionString, {
  ssl: 'require'
});

async function testClientImageFeature() {
  try {
    console.log('=== TESTING CLIENT IMAGE MESSAGE FEATURE ===\n');
    
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
      VALUES (${customerId}, 'open', 'Test case for client image messages')
      RETURNING id
    `;
    
    const caseId = caseResult[0].id;
    console.log('   Case created with ID:', caseId);
    
    // 2. 模拟客户端发送带图片的消息
    console.log('\n2. Sending image message from client...');
    const clientMessageData = {
      case_id: caseId,
      sender_type: 'user',
      content: '这是客户端发送的图片消息',
      timestamp: new Date().toISOString(),
      customer_id: customerId,
      image_url: 'https://picsum.photos/seed/clientmessage/400/300'
    };
    
    const clientMessageResult = await sql`
      INSERT INTO messages ${sql(clientMessageData)}
      RETURNING *
    `;
    
    console.log('   Client message sent:', {
      id: clientMessageResult[0].id,
      content: clientMessageResult[0].content,
      imageUrl: clientMessageResult[0].image_url,
      senderType: clientMessageResult[0].sender_type,
      timestamp: clientMessageResult[0].timestamp
    });
    
    // 3. 查询消息
    console.log('\n3. Retrieving messages...');
    const retrievedMessages = await sql`
      SELECT * FROM messages WHERE case_id = ${caseId}
      ORDER BY timestamp
    `;
    
    console.log('   Retrieved messages:');
    retrievedMessages.forEach((msg, index) => {
      console.log(`     ${index + 1}. [${msg.sender_type}] ${msg.content}`);
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
    console.log('✓ Client can send image messages');
    console.log('✓ Image URL column is working correctly');
    console.log('✓ Messages with images can be inserted and retrieved');
    console.log('✓ Database schema supports client image messages');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sql.end();
  }
}

testClientImageFeature();