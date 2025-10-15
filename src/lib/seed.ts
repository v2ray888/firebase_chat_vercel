import 'dotenv/config';
import { sql } from './db';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('Seeding database...');

    // Use a single transaction to ensure atomicity
    await sql.begin(async (sql) => {
      // The schema.sql now handles dropping tables, so we just seed.
      console.log('Clearing existing data...');
      await sql.unsafe(`
          TRUNCATE TABLE "messages", "websites", "cases", "customers", "users", "app_settings" RESTART IDENTITY CASCADE;
      `);
      
      console.log('Seeding users...');
      // Use fixed UUIDs for predictable associations
      const usersToInsert = [
        { id: '72890a1a-4530-4355-8854-82531580e0a5', name: 'Alex Doe', email: 'alex.doe@example.com', password: await bcrypt.hash('password123', 10), role: 'agent' as const, status: 'online' as const, avatar: 'https://picsum.photos/seed/1/40/40' },
        { id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', name: 'Sam Smith', email: 'sam.smith@example.com', password: await bcrypt.hash('password123', 10), role: 'agent' as const, status: 'offline' as const, avatar: 'https://picsum.photos/seed/2/40/40' },
        { id: '3958dc9e-742f-4377-85e9-fec4b6a6442a', name: 'Jordan Lee', email: 'jordan.lee@example.com', password: await bcrypt.hash('password123', 10), role: 'admin' as const, status: 'online' as const, avatar: 'https://picsum.photos/seed/3/40/40' },
        { id: '3958dc9e-737f-4377-85e9-fec4b6a6442a', name: 'Casey Brown', email: 'casey.brown@example.com', password: await bcrypt.hash('password123', 10), role: 'agent' as const, status: 'online' as const, avatar: 'https://picsum.photos/seed/4/40/40' },
      ];
      await sql`INSERT INTO users ${sql(usersToInsert, 'id', 'name', 'email', 'password', 'role', 'status', 'avatar')}`;
      
      const userIds = {
        alex: '72890a1a-4530-4355-8854-82531580e0a5',
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
        { id: 'c15c8e14-d4b3-4a11-827d-949f5b5b0b8c', customerId: customerIds.jamie, status: 'in-progress' as const, summary: '关于延迟订单 #12345XYZ 的查询。', updatedAt: new Date(Date.now() - 1000 * 60 * 1) },
        { id: '725350b5-7724-434e-b5f7-628d011c7694', customerId: customerIds.pat, status: 'open' as const, summary: '未指明商品的退货请求。', updatedAt: new Date(Date.now() - 1000 * 60 * 118) },
        { id: 'f8c3de3d-1fea-4d7c-a8b0-29f63d6a2f47', customerId: customerIds.chris, status: 'resolved' as const, summary: '优惠码应用问题。', updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23) },
        { id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed', customerId: customerIds.taylor, status: 'open' as const, summary: '关于国际运输的问题。', updatedAt: new Date(Date.now() - 1000 * 60 * 5) }
      ];
      await sql`INSERT INTO cases ${sql(casesToInsert, 'id', 'customerId', 'status', 'summary', 'updatedAt')}`;
      
      const caseIds = {
        jamie: 'c15c8e14-d4b3-4a11-827d-949f5b5b0b8c',
        pat: '725350b5-7724-434e-b5f7-628d011c7694',
        chris: 'f8c3de3d-1fea-4d7c-a8b0-29f63d6a2f47',
        taylor: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
      };

      console.log('Seeding messages...');
      const messagesToInsert = [
        { caseId: caseIds.jamie, senderType: 'user' as const, content: '你好，我最近的订单遇到了问题。还没有送达。', timestamp: new Date(Date.now() - 1000 * 60 * 25), customerId: customerIds.jamie, userId: null },
        { caseId: caseIds.jamie, senderType: 'agent' as const, content: '你好 Jamie，听到这个消息我很难过。您能提供您的订单号吗？', timestamp: new Date(Date.now() - 1000 * 60 * 23), userId: userIds.alex, customerId: null },
        { caseId: caseIds.jamie, senderType: 'user' as const, content: '当然，是 #12345XYZ。', timestamp: new Date(Date.now() - 1000 * 60 * 22), customerId: customerIds.jamie, userId: null },
        { caseId: caseIds.jamie, senderType: 'agent' as const, content: '谢谢你。让我为你查询一下状态。', timestamp: new Date(Date.now() - 1000 * 60 * 21), userId: userIds.alex, customerId: null },
        { caseId: caseIds.jamie, senderType: 'user' as const, content: '好的，我等着。', timestamp: new Date(Date.now() - 1000 * 60 * 1), customerId: customerIds.jamie, userId: null },
        { caseId: caseIds.pat, senderType: 'user' as const, content: '我想退货。', timestamp: new Date(Date.now() - 1000 * 60 * 120), customerId: customerIds.pat, userId: null },
        { caseId: caseIds.pat, senderType: 'agent' as const, content: '我可以帮忙。您想退货的商品是什么？', timestamp: new Date(Date.now() - 1000 * 60 * 118), userId: userIds.sam, customerId: null },
        { caseId: caseIds.chris, senderType: 'user' as const, content: '我的优惠码无效。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), customerId: customerIds.chris, userId: null },
        { caseId: caseIds.chris, senderType: 'system' as const, content: '此对话已由 Alex Doe 解决。', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), userId: null, customerId: null },
        { caseId: caseIds.taylor, senderType: 'user' as const, content: '你们向加拿大发货吗？', timestamp: new Date(Date.now() - 1000 * 60 * 5), customerId: customerIds.taylor, userId: null },
      ];
      await sql`INSERT INTO messages ${sql(messagesToInsert, 'caseId', 'senderType', 'content', 'timestamp', 'userId', 'customerId')}`;

      console.log('Seeding app settings...');
      const settingsData = {
        id: 1,
        primary_color: '#64B5F6',
        welcome_message: '您好！我们能为您做些什么？',
        offline_message: '我们目前不在。请留言，我们会尽快回复您。',
        accept_new_chats: true,
<<<<<<< HEAD
        widget_title: '客服支持',
        widget_subtitle: '我们通常在几分钟内回复',
        auto_open_widget: false,
        show_branding: true,
        typing_indicator_message: '客服正在输入...',
        connection_message: '已连接到客服',
        work_start_time: '09:00',
        work_end_time: '18:00',
        auto_offline: false,
        away_message: '我现在不在，但我稍后会回复您。',
        enable_ai_suggestions: true,
        enable_image_upload: true  // 添加图片上传功能开关
=======
>>>>>>> 397514edb21c0d3505dba3525893063086b66a55
      };
      await sql`
          INSERT INTO app_settings ${sql(settingsData)}
          ON CONFLICT (id) DO UPDATE SET
              primary_color = EXCLUDED.primary_color,
              welcome_message = EXCLUDED.welcome_message,
              offline_message = EXCLUDED.offline_message,
              accept_new_chats = EXCLUDED.accept_new_chats,
<<<<<<< HEAD
              widget_title = EXCLUDED.widget_title,
              widget_subtitle = EXCLUDED.widget_subtitle,
              auto_open_widget = EXCLUDED.auto_open_widget,
              show_branding = EXCLUDED.show_branding,
              typing_indicator_message = EXCLUDED.typing_indicator_message,
              connection_message = EXCLUDED.connection_message,
              work_start_time = EXCLUDED.work_start_time,
              work_end_time = EXCLUDED.work_end_time,
              auto_offline = EXCLUDED.auto_offline,
              away_message = EXCLUDED.away_message,
              enable_ai_suggestions = EXCLUDED.enable_ai_suggestions,
              enable_image_upload = EXCLUDED.enable_image_upload,
=======
>>>>>>> 397514edb21c0d3505dba3525893063086b66a55
              updated_at = CURRENT_TIMESTAMP
      `;
      
      console.log('Seeding websites...');
      const websitesToInsert = [
          { name: '霓虹示例网站', url: 'https://example.com', userId: userIds.alex }
      ];
      await sql`INSERT INTO websites ${sql(websitesToInsert, 'name', 'url', 'userId')}`;
    });

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  } finally {
    // Ensure the connection is closed.
    await sql.end();
  }
}

seed();