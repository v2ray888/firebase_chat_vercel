import 'dotenv/config';
import { sql } from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Seeding database...');

    // Start a transaction
    await sql.begin(async (sql) => {
        // Clear existing data from dependent tables first
        await sql.unsafe(`
            TRUNCATE TABLE messages, cases, websites, customers, users RESTART IDENTITY CASCADE;
        `);
        console.log('Cleared existing data from tables.');

        const fixedAlexDoeId = '72890a1a-4530-4355-8854-82531580e0a5';

        // Seed Users
        const users = [
          { id: fixedAlexDoeId, name: 'Alex Doe', email: 'alex.doe@example.com', password: 'password123', role: 'agent', status: 'online', avatar: 'https://picsum.photos/seed/1/40/40' },
          { id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', name: 'Sam Smith', email: 'sam.smith@example.com', password: 'password123', role: 'agent', status: 'offline', avatar: 'https://picsum.photos/seed/2/40/40' },
          { id: '3958dc9e-742f-4377-85e9-fec4b6a6442a', name: 'Jordan Lee', email: 'jordan.lee@example.com', password: 'password123', role: 'admin', status: 'online', avatar: 'https://picsum.photos/seed/3/40/40' },
          { id: '3958dc9e-737f-4377-85e9-fec4b6a6442a', name: 'Casey Brown', email: 'casey.brown@example.com', password: 'password123', role: 'agent', status: 'online', avatar: 'https://picsum.photos/seed/4/40/40' },
        ];

        const hashedUsers = await Promise.all(users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword, created_at: new Date(), updated_at: new Date() };
        }));
        
        const userInserts = await sql`
            INSERT INTO users ${sql(hashedUsers, 'id', 'name', 'email', 'password', 'role', 'status', 'avatar', 'created_at', 'updated_at')}
            RETURNING id, email`;

        const userIdsByEmail = userInserts.reduce((acc, user) => {
          acc[user.email] = user.id;
          return acc;
        }, {} as Record<string, string>);
        
        const alexDoeUserId = userIdsByEmail['alex.doe@example.com'];
        const samSmithUserId = userIdsByEmail['sam.smith@example.com'];
        console.log(`Seeded ${userInserts.length} users.`);


        // Seed Customers
        const customers = [
          { name: 'Jamie Robert', email: 'jamie.robert@example.com', avatar: 'https://picsum.photos/seed/101/40/40' },
          { name: 'Pat Taylor', email: 'pat.taylor@example.com', avatar: 'https://picsum.photos/seed/102/40/40' },
          { name: 'Chris Garcia', email: 'chris.garcia@example.com', avatar: 'https://picsum.photos/seed/103/40/40' },
          { name: 'Taylor Miller', email: 'taylor.miller@example.com', avatar: 'https://picsum.photos/seed/104/40/40' },
        ];
        
        const customersWithTimestamps = customers.map(c => ({...c, created_at: new Date(), updated_at: new Date()}))

        const customerInserts = await sql`
            INSERT INTO customers ${sql(customersWithTimestamps, 'name', 'email', 'avatar', 'created_at', 'updated_at')}
            RETURNING id`;
        const customerIds = customerInserts.map(c => c.id);
        console.log(`Seeded ${customerIds.length} customers.`);

        // Seed Cases and Messages
        const casesData = [
          { customerIndex: 0, status: 'in-progress', summary: '关于延迟订单 #12345XYZ 的查询。', messages: [
              { sender_type: 'user', content: '你好，我最近的订单遇到了问题。还没有送达。', timestamp: new Date(Date.now() - 1000 * 60 * 25) },
              { sender_type: 'agent', userId: alexDoeUserId, content: '你好 Jamie，听到这个消息我很难过。您能提供您的订单号吗？', timestamp: new Date(Date.now() - 1000 * 60 * 23) },
              { sender_type: 'user', content: '当然，是 #12345XYZ。', timestamp: new Date(Date.now() - 1000 * 60 * 22) },
              { sender_type: 'agent', userId: alexDoeUserId, content: '谢谢你。让我为你查询一下状态。', timestamp: new Date(Date.now() - 1000 * 60 * 21) },
              { sender_type: 'user', content: '好的，我等着。', timestamp: new Date(Date.now() - 1000 * 60 * 1) },
          ]},
          { customerIndex: 1, status: 'open', summary: '未指明商品的退货请求。', messages: [
              { sender_type: 'user', content: '我想退货。', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
              { sender_type: 'agent', userId: samSmithUserId, content: '我可以帮忙。您想退货的商品是什么？', timestamp: new Date(Date.now() - 1000 * 60 * 118) },
          ]},
          { customerIndex: 2, status: 'resolved', summary: '优惠码应用问题。', messages: [
              { sender_type: 'user', content: '我的优惠码无效。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
              { sender_type: 'system', content: '此对话已由 Alex Doe 解决。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
          ]},
          { customerIndex: 3, status: 'open', summary: '关于国际运输的问题。', messages: [
              { sender_type: 'user', content: '你们向加拿大发货吗？', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
          ]},
        ];
        
        let messageCount = 0;
        for (const caseItem of casesData) {
            const now = new Date();
            const caseResult = await sql`
                INSERT INTO cases (customer_id, status, summary, created_at, updated_at) 
                VALUES (${customerIds[caseItem.customerIndex]}, ${caseItem.status}, ${caseItem.summary}, ${now}, ${now}) 
                RETURNING id`;
            const caseId = caseResult[0].id;
            
            if (caseItem.messages.length > 0) {
              const messagesToInsert = caseItem.messages.map(message => ({
                  case_id: caseId,
                  sender_type: message.sender_type,
                  content: message.content,
                  timestamp: message.timestamp,
                  user_id: message.sender_type === 'agent' ? message.userId : null,
                  customer_id: message.sender_type === 'user' ? customerIds[caseItem.customerIndex] : null,
              }));

              await sql`INSERT INTO messages ${sql(messagesToInsert, 'case_id', 'sender_type', 'content', 'timestamp', 'user_id', 'customer_id')}`;
              messageCount += messagesToInsert.length;
            }
        }
        console.log(`Seeded ${casesData.length} cases with ${messageCount} messages.`);

        // Seed App Settings
        const settingsData = {
          id: 1,
          primary_color: '#64B5F6',
          welcome_message: '您好！我们能为您做些什么？',
          offline_message: '我们目前不在。请留言，我们会尽快回复您。',
          accept_new_chats: true,
          created_at: new Date(),
          updated_at: new Date()
        };
        await sql`
            INSERT INTO app_settings ${sql(settingsData)}
            ON CONFLICT (id) DO UPDATE SET
                primary_color = EXCLUDED.primary_color,
                welcome_message = EXCLUDED.welcome_message,
                offline_message = EXCLUDED.offline_message,
                accept_new_chats = EXCLUDED.accept_new_chats,
                updated_at = EXCLUDED.updated_at;
        `;
        console.log('Seeded app settings.');

        // Seed Websites
        if (alexDoeUserId) {
            const now = new Date();
            await sql`
                INSERT INTO websites (name, url, user_id, created_at, updated_at)
                VALUES ('霓虹示例网站', 'https://example.com', ${alexDoeUserId}, ${now}, ${now})
            `;
            console.log('Seeded websites.');
        }

    }); // End transaction

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Database seeding failed:', error);
    // process.exit(1) to indicate failure
    process.exit(1);
  } finally {
    // Ensure the connection is closed.
    await sql.end();
  }
}

seed();
