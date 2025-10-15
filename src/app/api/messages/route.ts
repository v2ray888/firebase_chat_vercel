import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { caseId, senderType, content, userId, customerId } = await request.json();

    if (!caseId || !senderType || !content) {
      return NextResponse.json({ message: '缺少必需字段。' }, { status: 400 });
    }

    const timestamp = new Date();

    // The sql template tag automatically handles mapping camelCase (e.g., caseId)
    // to snake_case (e.g., case_id) for insertion.
    const messageData = {
      caseId,
      senderType,
      content,
      timestamp,
      userId: userId || null,
      customerId: customerId || null
    };

    const result = await sql`
      INSERT INTO messages ${sql(messageData)}
      RETURNING *
    `;

    // Also update the case's updated_at timestamp
    await sql`
        UPDATE cases SET updated_at = ${timestamp} WHERE id = ${caseId}
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
