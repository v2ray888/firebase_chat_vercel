import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

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
    const { customer_name, customer_email, content, website_id, image_url } = await request.json();

    if (!customer_name || !customer_email || !content || !website_id) {
      return NextResponse.json({ message: '缺少必需字段。' }, { status: 400 });
    }

    const timestamp = new Date();

    // 1. 检查客户是否已存在，如果不存在则创建新客户
    let customerResult = await sql`
      SELECT * FROM customers WHERE email = ${customer_email}
    `;
    
    let customerId: string;
    if (customerResult.length === 0) {
      // 创建新客户
      const defaultAvatar = `https://picsum.photos/seed/customer-${Date.now()}/40/40`;
      const newCustomer = await sql`
        INSERT INTO customers (name, email, avatar)
        VALUES (${customer_name}, ${customer_email}, ${defaultAvatar})
        RETURNING id
      `;
      customerId = newCustomer[0].id;
    } else {
      customerId = customerResult[0].id;
    }

    // 2. 创建新对话(case)
    const newCase = await sql`
      INSERT INTO cases (customer_id, status, summary)
      VALUES (${customerId}, 'open', ${content.substring(0, 100) + (content.length > 100 ? '...' : '')})
      RETURNING id
    `;
    
    const caseId = newCase[0].id;

    // 3. 保存客户消息
    const messageData = {
      case_id: caseId,
      sender_type: 'user',
      content,
      timestamp,
      customer_id: customerId,
      image_url: image_url || null
    };

    const messageResult = await sql`
      INSERT INTO messages ${sql(messageData)}
      RETURNING *
    `;

    // 更新case的updated_at时间戳
    await sql`
      UPDATE cases SET updated_at = ${timestamp} WHERE id = ${caseId}
    `;

    // 转换数据库字段名为camelCase格式
    const formattedResult = toCamelCase(messageResult[0]);
    
    // 返回创建的消息和case信息
    return NextResponse.json({
      message: formattedResult,
      caseId: caseId,
      customerId: customerId
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to process widget message:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}