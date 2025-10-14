import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const result = await db.query('SELECT id, name, email, avatar, role, status, created_at FROM users ORDER BY created_at DESC', []);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role, status } = await request.json();

    if (!name || !email || !password || !role || !status) {
      return NextResponse.json({ message: '所有字段都是必需的。' }, { status: 400 });
    }

    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: '该电子邮件已被使用。' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatar = `https://picsum.photos/seed/${Math.random()}/40/40`;

    const newUser = await db.query(
      'INSERT INTO users (name, email, password, avatar, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, avatar, role, status, created_at',
      [name, email, hashedPassword, defaultAvatar, role, status]
    );

    return NextResponse.json(newUser.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}

    