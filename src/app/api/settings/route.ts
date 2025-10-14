import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const result = await sql`SELECT * FROM app_settings WHERE id = 1`;
    if (result.length === 0) {
      // Return default settings if none are found in the database.
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
    // Return default settings on error as a fallback, with a 200 OK status
    // so the frontend can still render.
    return NextResponse.json({
        primary_color: '#64B5F6',
        welcome_message: '您好！我们能为您做些什么？',
        offline_message: '我们目前不在。请留言，我们会尽快回复您。',
        accept_new_chats: true,
      });
  }
}

export async function POST(request: Request) {
  try {
    const { primary_color, welcome_message, offline_message, accept_new_chats } = await request.json();

    // Validate that all required fields are present
    if (primary_color === undefined || welcome_message === undefined || offline_message === undefined || accept_new_chats === undefined) {
      return NextResponse.json({ message: '缺少必需的设置字段。' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO app_settings (id, primary_color, welcome_message, offline_message, accept_new_chats)
      VALUES (1, ${primary_color}, ${welcome_message}, ${offline_message}, ${accept_new_chats})
      ON CONFLICT (id) 
      DO UPDATE SET 
        primary_color = EXCLUDED.primary_color, 
        welcome_message = EXCLUDED.welcome_message,
        offline_message = EXCLUDED.offline_message,
        accept_new_chats = EXCLUDED.accept_new_chats
      RETURNING *;
    `;
    
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
