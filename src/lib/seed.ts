import "dotenv/config";
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Seeding database...');

    // Clear existing data
    await client.query('TRUNCATE users, customers, cases, messages RESTART IDENTITY CASCADE');
    console.log('Cleared existing data.');

    // Seed Users
    const users = [
      { name: 'Alex Doe', email: 'alex.doe@example.com', password: 'password123', role: 'agent', status: 'online', avatar: 'https://picsum.photos/seed/1/40/40' },
      { name: 'Sam Smith', email: 'sam.smith@example.com', password: 'password123', role: 'agent', status: 'offline', avatar: 'https://picsum.photos/seed/2/40/40' },
      { name: 'Jordan Lee', email: 'jordan.lee@example.com', password: 'password123', role: 'admin', status: 'online', avatar: 'https://picsum.photos/seed/3/40/40' },
      { name: 'Casey Brown', email: 'casey.brown@example.com', password: 'password123', role: 'agent', status: 'online', avatar: 'https://picsum.photos/seed/4/40/40' },
    ];

    const userInserts = await Promise.all(users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.query(
        'INSERT INTO users (name, email, password, role, status, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [user.name, user.email, hashedPassword, user.role, user.status, user.avatar]
      );
    }));
    const userIds = userInserts.map(res => res.rows[0].id);
    console.log(`Seeded ${userIds.length} users.`);

    // Seed Customers
    const customers = [
      { name: 'Jamie Robert', email: 'jamie.robert@example.com', avatar: 'https://picsum.photos/seed/101/40/40' },
      { name: 'Pat Taylor', email: 'pat.taylor@example.com', avatar: 'https://picsum.photos/seed/102/40/40' },
      { name: 'Chris Garcia', email: 'chris.garcia@example.com', avatar: 'https://picsum.photos/seed/103/40/40' },
      { name: 'Taylor Miller', email: 'taylor.miller@example.com', avatar: 'https://picsum.photos/seed/104/40/40' },
    ];
    
    const customerInserts = await Promise.all(customers.map(customer => {
        return client.query(
          'INSERT INTO customers (name, email, avatar) VALUES ($1, $2, $3) RETURNING id',
          [customer.name, customer.email, customer.avatar]
        );
    }));
    const customerIds = customerInserts.map(res => res.rows[0].id);
    console.log(`Seeded ${customerIds.length} customers.`);

    // Seed Cases and Messages
    const casesData = [
      { customerIndex: 0, status: 'in-progress', summary: '关于延迟订单 #12345XYZ 的查询。', messages: [
          { sender_type: 'user', content: '你好，我最近的订单遇到了问题。还没有送达。', timestamp: new Date(Date.now() - 1000 * 60 * 25) },
          { sender_type: 'agent', userIndex: 0, content: '你好 Jamie，听到这个消息我很难过。您能提供您的订单号吗？', timestamp: new Date(Date.now() - 1000 * 60 * 23) },
          { sender_type: 'user', content: '当然，是 #12345XYZ。', timestamp: new Date(Date.now() - 1000 * 60 * 22) },
          { sender_type: 'agent', userIndex: 0, content: '谢谢你。让我为你查询一下状态。', timestamp: new Date(Date.now() - 1000 * 60 * 21) },
          { sender_type: 'user', content: '好的，我等着。', timestamp: new Date(Date.now() - 1000 * 60 * 1) },
      ]},
      { customerIndex: 1, status: 'open', summary: '未指明商品的退货请求。', messages: [
          { sender_type: 'user', content: '我想退货。', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
          { sender_type: 'agent', userIndex: 1, content: '我可以帮忙。您想退货的商品是什么？', timestamp: new Date(Date.now() - 1000 * 60 * 118) },
      ]},
      { customerIndex: 2, status: 'resolved', summary: '优惠码应用问题。', messages: [
          { sender_type: 'user', content: '我的优惠码无效。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
          { sender_type: 'system', content: '此对话已由 Alex Doe 解决。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
      ]},
      { customerIndex: 3, status: 'open', summary: '关于国际运输的问题。', messages: [
          { sender_type: 'user', content: '你们向加拿大发货吗？', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      ]},
    ];
    
    for (const caseItem of casesData) {
        const caseResult = await client.query(
            'INSERT INTO cases (customer_id, status, summary) VALUES ($1, $2, $3) RETURNING id',
            [customerIds[caseItem.customerIndex], caseItem.status, caseItem.summary]
        );
        const caseId = caseResult.rows[0].id;
        
        for (const message of caseItem.messages) {
            await client.query(
                'INSERT INTO messages (case_id, sender_type, content, timestamp, user_id, customer_id) VALUES ($1, $2, $3, $4, $5, $6)',
                [
                    caseId,
                    message.sender_type,
                    message.content,
                    message.timestamp,
                    message.sender_type === 'agent' ? userIds[message.userIndex!] : null,
                    message.sender_type === 'user' ? customerIds[caseItem.customerIndex] : null,
                ]
            );
        }
    }
    console.log(`Seeded ${casesData.length} cases with messages.`);


    await client.query('COMMIT');
    console.log('Database seeding complete.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database seeding failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
