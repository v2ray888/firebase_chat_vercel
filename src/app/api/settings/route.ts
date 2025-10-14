import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT * FROM app_settings WHERE id = 1', []);
    if (result.rows.length === 0) {
      // Return default settings if none are found in the database.
      // This prevents "Loading failed" errors on fresh setups.
      return NextResponse.json({
        primary_color: '#64B5F6',
        welcome_message: '您好！我们能为您做些什么？',
        offline_message: '我们目前不在。请留言，我们会尽快回复您。',
        accept_new_chats: true,
      });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    // Return default settings on error as a fallback
    return NextResponse.json({
        primary_color: '#64B5F6',
        welcome_message: '您好！我们能为您做些什么？',
        offline_message: '我们目前不在。请留言，我们会尽快回复您。',
        accept_new_chats: true,
      }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { primary_color, welcome_message, offline_message, accept_new_chats } = await request.json();

    // Validate that all required fields are present
    if (primary_color === undefined || welcome_message === undefined || offline_message === undefined || accept_new_chats === undefined) {
      return NextResponse.json({ message: '缺少必需的设置字段。' }, { status: 400 });
    }

    // Use a robust UPSERT (INSERT ... ON CONFLICT ... DO UPDATE) query.
    // This will create the settings row if it doesn't exist (id=1),
    // or update it if it does. This prevents race conditions and handles both creation and updates.
    const query = `
      INSERT INTO app_settings (id, primary_color, welcome_message, offline_message, accept_new_chats)
      VALUES (1, $1, $2, $3, $4)
      ON CONFLICT (id) 
      DO UPDATE SET 
        primary_color = EXCLUDED.primary_color, 
        welcome_message = EXCLUDED.welcome_message,
        offline_message = EXCLUDED.offline_message,
        accept_new_chats = EXCLUDED.accept_new_chats
      RETURNING *;
    `;
    
    const values = [primary_color, welcome_message, offline_message, accept_new_chats];
    const result = await db.query(query, values);

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
