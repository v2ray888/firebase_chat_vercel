import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const result = await sql`SELECT id, name, email, avatar, role, status, created_at FROM users ORDER BY created_at DESC`;
    return NextResponse.json(result, { status: 200 });
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

    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return NextResponse.json({ message: '该电子邮件已被使用。' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultAvatar = `https://picsum.photos/seed/${Math.random()}/40/40`;

    const newUser = await sql`
      INSERT INTO users (name, email, password, avatar, role, status) 
      VALUES (${name}, ${email}, ${hashedPassword}, ${defaultAvatar}, ${role}, ${status}) 
      RETURNING id, name, email, avatar, role, status, created_at
    `;

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
