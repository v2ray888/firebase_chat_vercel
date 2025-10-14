import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

type RouteParams = {
    params: {
        id: string;
    }
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  try {
    const result = await db.query('SELECT id, name, email, avatar, role, status, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: '未找到用户。' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}


export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = params;
  if (!id) {
      return NextResponse.json({ message: '缺少用户 ID。' }, { status: 400 });
  }

  try {
      const { name, email, role, status, password } = await request.json();
      
      // Dynamically build query
      const fields: any = {};
      if (name) fields.name = name;
      if (email) fields.email = email;
      if (role) fields.role = role;
      if (status) fields.status = status;
      if (password) fields.password = await bcrypt.hash(password, 10);

      const keys = Object.keys(fields);
      if (keys.length === 0) {
          return NextResponse.json({ message: '没有提供要更新的字段。' }, { status: 400 });
      }

      const setClause = keys.map((key, index) => `"${key}" = $${index + 1}`).join(', ');
      const values = Object.values(fields);
      
      const query = `UPDATE users SET ${setClause} WHERE id = $${values.length + 1} RETURNING id, name, email, avatar, role, status`;
      const queryParams = [...values, id];

      const result = await db.query(query, queryParams);

      if (result.rows.length === 0) {
          return NextResponse.json({ message: '未找到用户。' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error: any) {
      console.error(`Failed to update user ${id}:`, error);
       if (error.code === '23505' && error.constraint === 'users_email_key') {
          return NextResponse.json({ message: '该电子邮件已被使用。' }, { status: 409 });
       }
      return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;
  if (!id) {
      return NextResponse.json({ message: '缺少用户 ID。' }, { status: 400 });
  }
  
  try {
    // You might want to check if the user has associated records (e.g., messages)
    // and decide whether to reassign them or prevent deletion.
    // For this implementation, we will perform a direct deletion.

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: '未找到用户。' }, { status: 404 });
    }

    return NextResponse.json({ message: '用户已成功删除。' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

    