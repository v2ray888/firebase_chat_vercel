import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 从认证令牌中获取用户ID的函数
function getUserIdFromRequest(request: Request): string | null {
  // 获取cookie中的认证令牌
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }
  
  const authToken = cookieHeader
    .split('; ')
    .find(row => row.startsWith('auth-token='));
    
  if (!authToken) {
    return null;
  }
  
  // 解析用户ID（格式: userId|timestamp）
  const userId = authToken.split('=')[1].split('|')[0];
  return userId || null;
}

export async function GET(request: Request) {
  try {
    // 从请求中获取当前用户ID
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ message: '未授权访问' }, { status: 401 });
    }

    const websites = await sql`
      SELECT * FROM websites 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(websites, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch websites:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 从请求中获取当前用户ID
    const userId = getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({ message: '未授权访问' }, { status: 401 });
    }

    const { name, url } = await request.json();

    if (!name || !url) {
      return NextResponse.json({ message: '网站名称和URL是必需的。' }, { status: 400 });
    }

    const websiteData = {
        name,
        url,
        userId
    };

    const newWebsite = await sql`
      INSERT INTO websites ${sql(websiteData, 'name', 'url', 'userId')}
      RETURNING *
    `;
    
    revalidatePath('/dashboard/integration');

    return NextResponse.json(newWebsite[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create website:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}