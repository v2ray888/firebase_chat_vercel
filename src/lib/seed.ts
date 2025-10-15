import 'dotenv/config';
import { sql } from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Seeding database...');

    // Start a transaction
    await sql.begin(async (sql) => {
        // Clear existing data from dependent tables first
        console.log('Clearing existing data...');
        await sql.unsafe(`
            TRUNCATE TABLE messages, cases, websites, customers, users, app_settings RESTART IDENTITY CASCADE;
        `);
        
        console.log('Seeding users...');
        const fixedAlexDoeId = '72890a1a-4530-4355-8854-82531580e0a5';
        const usersToInsert = [
          { id: fixedAlexDoeId, name: 'Alex Doe', email: 'alex.doe@example.com', password: await bcrypt.hash('password123', 10), role: 'agent', status: 'online', avatar: 'https://picsum.photos/seed/1/40/40' },
          { id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', name: 'Sam Smith', email: 'sam.smith@example.com', password: await bcrypt.hash('password123', 10), role: 'agent', status: 'offline', avatar: 'https://picsum.photos/seed/2/40/40' },
          { id: '3958dc9e-742f-4377-85e9-fec4b6a6442a', name: 'Jordan Lee', email: 'jordan.lee@example.com', password: await bcrypt.hash('password123', 10), role: 'admin', status: 'online', avatar: 'https://picsum.photos/seed/3/40/40' },
          { id: '3958dc9e-737f-4377-85e9-fec4b6a6442a', name: 'Casey Brown', email: 'casey.brown@example.com', password: await bcrypt.hash('password123', 10), role: 'agent', status: 'online', avatar: 'https://picsum.photos/seed/4/40/40' },
        ];
        await sql`INSERT INTO users ${sql(usersToInsert, 'id', 'name', 'email', 'password', 'role', 'status', 'avatar')}`;
        
        const userIds = {
            alex: fixedAlexDoeId,
            sam: '3958dc9e-712f-4377-85e9-fec4b6a6442a'
        };

        console.log('Seeding customers...');
        const customersToInsert = [
            { id: 'be6a895a-eb37-4148-99fa-1a1a5b847429', name: 'Jamie Robert', email: 'jamie.robert@example.com', avatar: 'https://picsum.photos/seed/101/40/40' },
            { id: '2c5a932b-54a7-4744-b2b0-379768564a97', name: 'Pat Taylor', email: 'pat.taylor@example.com', avatar: 'https://picsum.photos/seed/102/40/40' },
            { id: 'a429a288-6415-4654-a74e-56336338f71f', name: 'Chris Garcia', email: 'chris.garcia@example.com', avatar: 'https://picsum.photos/seed/103/40/40' },
            { id: 'e205163b-3134-4a57-a379-8a39a75d5812', name: 'Taylor Miller', email: 'taylor.miller@example.com', avatar: 'https://picsum.photos/seed/104/40/40' },
        ];
        await sql`INSERT INTO customers ${sql(customersToInsert, 'id', 'name', 'email', 'avatar')}`;

        const customerIds = {
            jamie: 'be6a895a-eb37-4148-99fa-1a1a5b847429',
            pat: '2c5a932b-54a7-4744-b2b0-379768564a97',
            chris: 'a429a288-6415-4654-a74e-56336338f71f',
            taylor: 'e205163b-3134-4a57-a379-8a39a75d5812'
        };

        console.log('Seeding cases...');
        const casesToInsert = [
            { id: 'c15c8e14-d4b3-4a11-827d-949f5b5b0b8c', customer_id: customerIds.jamie, status: 'in-progress', summary: '关于延迟订单 #12345XYZ 的查询。', updated_at: new Date(Date.now() - 1000 * 60 * 1) },
            { id: '725350b5-7724-434e-b5f7-628d011c7694', customer_id: customerIds.pat, status: 'open', summary: '未指明商品的退货请求。', updated_at: new Date(Date.now() - 1000 * 60 * 118) },
            { id: 'f8c3de3d-1fea-4d7c-a8b0-29f63d6a2f47', customer_id: customerIds.chris, status: 'resolved', summary: '优惠码应用问题。', updated_at: new Date(Date.now() - 1000 * 60 * 60 * 23) },
            { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', customer_id: customerIds.taylor, status: 'open', summary: '关于国际运输的问题。', updated_at: new Date(Date.now() - 1000 * 60 * 5) }
        ];
        await sql`INSERT INTO cases ${sql(casesToInsert, 'id', 'customer_id', 'status', 'summary', 'updated_at')}`;

        const caseIds = {
            jamie: 'c15c8e14-d4b3-4a11-827d-949f5b5b0b8c',
            pat: '725350b5-7724-434e-b5f7-628d011c7694',
            chris: 'f8c3de3d-1fea-4d7c-a8b0-29f63d6a2f47',
            taylor: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        }

        console.log('Seeding messages...');
        const messagesToInsert = [
            // Jamie's conversation
            { case_id: caseIds.jamie, sender_type: 'user', content: '你好，我最近的订单遇到了问题。还没有送达。', timestamp: new Date(Date.now() - 1000 * 60 * 25), customer_id: customerIds.jamie },
            { case_id: caseIds.jamie, sender_type: 'agent', content: '你好 Jamie，听到这个消息我很难过。您能提供您的订单号吗？', timestamp: new Date(Date.now() - 1000 * 60 * 23), user_id: userIds.alex },
            { case_id: caseIds.jamie, sender_type: 'user', content: '当然，是 #12345XYZ。', timestamp: new Date(Date.now() - 1000 * 60 * 22), customer_id: customerIds.jamie },
            { case_id: caseIds.jamie, sender_type: 'agent', content: '谢谢你。让我为你查询一下状态。', timestamp: new Date(Date.now() - 1000 * 60 * 21), user_id: userIds.alex },
            { case_id: caseIds.jamie, sender_type: 'user', content: '好的，我等着。', timestamp: new Date(Date.now() - 1000 * 60 * 1), customer_id: customerIds.jamie },

            // Pat's conversation
            { case_id: caseIds.pat, sender_type: 'user', content: '我想退货。', timestamp: new Date(Date.now() - 1000 * 60 * 120), customer_id: customerIds.pat },
            { case_id: caseIds.pat, sender_type: 'agent', content: '我可以帮忙。您想退货的商品是什么？', timestamp: new Date(Date.now() - 1000 * 60 * 118), user_id: userIds.sam },
            
            // Chris's conversation
            { case_id: caseIds.chris, sender_type: 'user', content: '我的优惠码无效。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), customer_id: customerIds.chris },
            { case_id: caseIds.chris, sender_type: 'system', content: '此对话已由 Alex Doe 解决。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },

            // Taylor's conversation
            { case_id: caseIds.taylor, sender_type: 'user', content: '你们向加拿大发货吗？', timestamp: new Date(Date.now() - 1000 * 60 * 5), customer_id: customerIds.taylor },
        ];
        await sql`INSERT INTO messages ${sql(messagesToInsert, 'case_id', 'sender_type', 'content', 'timestamp', 'user_id', 'customer_id')}`;

        console.log('Seeding app settings...');
        const settingsData = {
          id: 1,
          primary_color: '#64B5F6',
          welcome_message: '您好！我们能为您做些什么？',
          offline_message: '我们目前不在。请留言，我们会尽快回复您。',
          accept_new_chats: true,
        };
        await sql`
            INSERT INTO app_settings ${sql(settingsData, 'id', 'primary_color', 'welcome_message', 'offline_message', 'accept_new_chats')}
        `;
        
        console.log('Seeding websites...');
        const websitesToInsert = [
            { name: '霓虹示例网站', url: 'https://example.com', user_id: userIds.alex }
        ];
        await sql`INSERT INTO websites ${sql(websitesToInsert, 'name', 'url', 'user_id')}`;
    });

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seed();
