import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: '所有字段都是必需的。' }, { status: 400 });
    }

    // 检查用户是否已存在
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return NextResponse.json({ message: '该电子邮件已被使用。' }, { status: 409 });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 将用户插入数据库
    const defaultAvatar = `https://picsum.photos/seed/${encodeURIComponent(email)}/40/40`;
    const newUser = await sql`
      INSERT INTO users (name, email, "password", avatar, "role", status) 
      VALUES (${name}, ${email}, ${hashedPassword}, ${defaultAvatar}, 'agent', 'offline') 
      RETURNING id, name, email, "role"
    `;

    return NextResponse.json({ user: newUser[0] }, { status: 201 });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
