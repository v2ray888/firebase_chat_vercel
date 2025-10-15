import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 将snake_case转换为camelCase的辅助函数
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // 转换字段名
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[camelKey] = toCamelCase(obj[key]);
      }
    }
    return newObj;
  }
  
  return obj;
}

export async function POST(request: Request) {
  try {
    const { case_id, sender_type, content, user_id, customer_id, image_url } = await request.json();

    if (!case_id || !sender_type || !content) {
      return NextResponse.json({ message: '缺少必需字段。' }, { status: 400 });
    }

    const timestamp = new Date();

    // The sql template tag automatically handles mapping camelCase (e.g., caseId)
    // to snake_case (e.g., case_id) for insertion.
    const messageData = {
      case_id,
      sender_type,
      content,
      timestamp,
      user_id: user_id || null,
      customer_id: customer_id || null,
      image_url: image_url || null
    };

    const result = await sql`
      INSERT INTO messages ${sql(messageData)}
      RETURNING *
    `;

    // Also update the case's updated_at timestamp
    await sql`
        UPDATE cases SET updated_at = ${timestamp} WHERE id = ${case_id}
    `;

    // This helps in re-fetching the conversation list to show the latest message on top
    revalidatePath('/dashboard');
    revalidatePath('/api/conversations');

    // 转换数据库字段名为camelCase格式
    const formattedResult = toCamelCase(result[0]);
    return NextResponse.json(formattedResult, { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}