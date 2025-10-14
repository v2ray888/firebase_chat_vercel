import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT id, name, email, avatar, role, status FROM users ORDER BY created_at DESC', []);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
