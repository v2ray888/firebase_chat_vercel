import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await sql`SELECT id, name, email, avatar, role, status, created_at, updated_at FROM users WHERE id = ${id}`;
    if (result.length === 0) {
      return NextResponse.json({ message: '未找到用户。' }, { status: 404 });
    }
    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}


export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
      return NextResponse.json({ message: '缺少用户 ID。' }, { status: 400 });
  }

  try {
      const body = await request.json();
      
      const { name, email, role, status, password } = body;

      const updates: Record<string, any> = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (role) updates.role = role;
      if (status) updates.status = status;
      if (password) updates.password = await bcrypt.hash(password, 10);
      updates.updated_at = new Date();

      const keys = Object.keys(updates);
      if (keys.length <= 1) { // only updated_at
          return NextResponse.json({ message: '没有提供要更新的字段。' }, { status: 400 });
      }

      const result = await sql`
        UPDATE users
        SET ${sql(updates)}
        WHERE id = ${id}
        RETURNING id, name, email, avatar, role, status
      `;

      if (result.length === 0) {
          return NextResponse.json({ message: '未找到用户。' }, { status: 404 });
      }

      return NextResponse.json(result[0], { status: 200 });

  } catch (error: any) {
      console.error(`Failed to update user ${id}:`, error);
       if (error.code === '23505' && error.constraint === 'users_email_key') {
          return NextResponse.json({ message: '该电子邮件已被使用。' }, { status: 409 });
       }
      return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
      return NextResponse.json({ message: '缺少用户 ID。' }, { status: 400 });
  }
  
  try {
    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ message: '未找到用户。' }, { status: 404 });
    }

    return NextResponse.json({ message: '用户已成功删除。' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}