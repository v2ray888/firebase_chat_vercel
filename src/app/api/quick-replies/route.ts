import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export interface QuickReply {
  id: number;
  content: string;
  sortOrder: number;  // 改为 camelCase
  createdAt: string;  // 改为 camelCase
  updatedAt: string;  // 改为 camelCase
}

// 获取所有快捷回复
export async function GET() {
  try {
    const quickReplies = await sql`
      SELECT * FROM quick_replies
      ORDER BY sort_order ASC, created_at ASC
    `;
    
    // 由于数据库连接已配置自动转换 snake_case 到 camelCase，直接返回即可
    const formattedReplies = quickReplies.map(reply => ({
      id: reply.id,
      content: reply.content,
      sortOrder: reply.sortOrder,  // 使用 camelCase
      createdAt: reply.createdAt,  // 使用 camelCase
      updatedAt: reply.updatedAt    // 使用 camelCase
    }));
    
    // 设置正确的字符编码
    const response = NextResponse.json(formattedReplies);
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
    return response;
  } catch (error) {
    console.error('Failed to fetch quick replies:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

// 创建或更新快捷回复
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证请求体
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: '请求体必须是快捷回复数组' }, { status: 400 });
    }
    
    // 使用正确的事务方式
    const updatedReplies = await sql.begin(async sql => {
      // 删除所有现有的快捷回复
      await sql`DELETE FROM quick_replies`;
      
      // 插入新的快捷回复
      for (let i = 0; i < body.length; i++) {
        const reply = body[i];
        if (typeof reply.content !== 'string' || reply.content.trim() === '') {
          throw new Error('快捷回复内容不能为空');
        }
        
        await sql`
          INSERT INTO quick_replies (content, sort_order)
          VALUES (${reply.content.trim()}, ${i})
        `;
      }
      
      // 返回更新后的快捷回复列表
      const updatedReplies = await sql`
        SELECT * FROM quick_replies
        ORDER BY sort_order ASC, created_at ASC
      `;
      
      return updatedReplies;
    });
    
    // 由于数据库连接已配置自动转换 snake_case 到 camelCase，直接返回即可
    const formattedReplies = updatedReplies.map(reply => ({
      id: reply.id,
      content: reply.content,
      sortOrder: reply.sortOrder,  // 使用 camelCase
      createdAt: reply.createdAt,  // 使用 camelCase
      updatedAt: reply.updatedAt    // 使用 camelCase
    }));
    
    // 设置正确的字符编码
    const response = NextResponse.json(formattedReplies);
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
    return response;
  } catch (error: any) {
    console.error('Failed to save quick replies:', error);
    return NextResponse.json({ message: '保存快捷回复失败: ' + error.message }, { status: 400 });
  }
}