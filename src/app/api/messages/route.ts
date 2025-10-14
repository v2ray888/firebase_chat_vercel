import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { case_id, sender_type, content, user_id, customer_id } = await request.json();

    if (!case_id || !sender_type || !content) {
      return NextResponse.json({ message: '缺少必需字段。' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    const result = await db.query(
      `INSERT INTO messages (case_id, sender_type, content, timestamp, user_id, customer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [case_id, sender_type, content, timestamp, user_id, customer_id]
    );

    // Also update the case's updated_at timestamp
    await db.query(
        'UPDATE cases SET updated_at = $1 WHERE id = $2',
        [timestamp, case_id]
    );

    // This helps in re-fetching the conversation list to show the latest message on top
    revalidatePath('/dashboard');
    revalidatePath('/api/conversations');

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

    