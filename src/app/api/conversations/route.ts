import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Conversation, Case, Customer, Message } from '@/types';

export async function GET() {
  try {
    // This query is complex. It groups messages by case and then constructs the conversation object.
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
            json_agg(
                json_build_object(
                    'id', m.id,
                    'case_id', m.case_id,
                    'sender_type', m.sender_type,
                    'content', m.content,
                    'timestamp', m.timestamp,
                    'user_id', m.user_id,
                    'customer_id', m.customer_id
                ) ORDER BY m.timestamp
            ) as messages
        FROM cases c
        JOIN customers cust ON c.customer_id = cust.id
        LEFT JOIN messages m ON c.id = m.case_id
        GROUP BY c.id, cust.id
        ORDER BY MAX(m.timestamp) DESC;
    `;

    const conversations: Conversation[] = rows.map((row: any) => {
        const customer: Customer = {
            id: row.customer_id,
            name: row.customer_name,
            email: row.customer_email,
            avatar: row.customer_avatar,
        };

        const caseInfo: Case = {
            id: row.case_id,
            customer_id: row.customer_id,
            status: row.case_status,
            summary: row.case_summary,
            created_at: row.case_created_at,
            updated_at: row.case_updated_at,
        };

        const messages: Message[] = row.messages.filter((m: any) => m.id !== null) || [];

        return {
            id: row.case_id,
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
