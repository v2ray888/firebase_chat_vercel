import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const result = await sql`SELECT * FROM app_settings WHERE id = 1`;
    
    // 如果没有找到设置，返回默认值，状态码为 200 OK
    if (result.length === 0) {
      return NextResponse.json({
        primary_color: '#64B5F6',
        welcome_message: '您好！我们能为您做些什么？',
        offline_message: '我们目前不在。请留言，我们会尽快回复您。',
        accept_new_chats: true,
      });
    }

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error('Failed to fetch settings:', error);
    // 只有在数据库查询本身发生灾难性错误时，才返回500
    // 但前端的 use-settings 钩子应该能处理这种情况
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { primary_color, welcome_message, offline_message, accept_new_chats } = body;
    
    if (primary_color === undefined || welcome_message === undefined || offline_message === undefined || accept_new_chats === undefined) {
      return NextResponse.json({ message: '缺少必需的设置字段。' }, { status: 400 });
    }

    const settingsData = {
        id: 1,
        primary_color,
        welcome_message,
        offline_message,
        accept_new_chats
    };

    // 使用最简单、最安全的 sql helper 语法进行 UPSERT
    const result = await sql`
        INSERT INTO app_settings ${sql(settingsData, 'id', 'primary_color', 'welcome_message', 'offline_message', 'accept_new_chats')}
        ON CONFLICT (id)
        DO UPDATE SET
            primary_color = EXCLUDED.primary_color,
            welcome_message = EXCLUDED.welcome_message,
            offline_message = EXCLUDED.offline_message,
            accept_new_chats = EXCLUDED.accept_new_chats
        RETURNING *
    `;
    
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
