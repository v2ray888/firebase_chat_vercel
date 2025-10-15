import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { case_id, sender_type, content, user_id, customer_id } = await request.json();

    if (!case_id || !sender_type || !content) {
      return NextResponse.json({ message: '缺少必需字段。' }, { status: 400 });
    }

    const timestamp = new Date();

    const result = await sql`
      INSERT INTO messages (case_id, sender_type, content, "timestamp", user_id, customer_id)
       VALUES (${case_id}, ${sender_type}, ${content}, ${timestamp}, ${user_id || null}, ${customer_id || null})
       RETURNING *
    `;

    // Also update the case's updated_at timestamp
    await sql`
        UPDATE cases SET updated_at = ${timestamp} WHERE id = ${case_id}
    `;

    // This helps in re-fetching the conversation list to show the latest message on top
    revalidatePath('/dashboard');
    revalidatePath('/api/conversations');

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
