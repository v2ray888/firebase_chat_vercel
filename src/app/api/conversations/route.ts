import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Conversation, Case, Customer, Message } from '@/types';

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

export async function GET() {
  try {
    const rows = await sql`
        SELECT
            c.id as case_id,
            c.status as case_status,
            c.summary as case_summary,
            c.created_at as case_created_at,
            c.updated_at as case_updated_at,
            cust.id as customer_id,
            cust.name as customer_name,
            cust.email as customer_email,
            cust.avatar as customer_avatar,
            (
                SELECT json_agg(m.* ORDER BY m.timestamp)
                FROM messages m
                WHERE m.case_id = c.id
            ) as messages
        FROM cases c
        JOIN customers cust ON c.customer_id = cust.id
        ORDER BY c.updated_at DESC;
    `;

    const conversations: Conversation[] = rows.map((row: any) => {
        const customer: Customer = {
            id: row.customerId,
            name: row.customerName,
            email: row.customerEmail,
            avatar: row.customerAvatar,
            createdAt: '', // 这些字段在当前查询中没有返回
            updatedAt: ''
        };

        const caseInfo: Case = {
            id: row.caseId,
            customerId: row.customerId,
            status: row.caseStatus,
            summary: row.caseSummary,
            createdAt: row.caseCreatedAt,
            updatedAt: row.caseUpdatedAt,
        };

        // 转换消息数组中的字段名
        const messages: Message[] = (row.messages || []).map((m: any) => toCamelCase(m));

        return {
            id: row.caseId,
            customer,
            case: caseInfo,
            messages,
        };
    });

    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}