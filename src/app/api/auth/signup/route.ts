import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: '所有字段都是必需的。' }, { status: 400 });
    }

    // 检查用户是否已存在
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ message: '该电子邮件已被使用。' }, { status: 409 });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 将用户插入数据库
    const defaultAvatar = `https://picsum.photos/seed/${Math.random()}/40/40`;
    const newUser = await db.query(
      'INSERT INTO users (name, email, "password", avatar, "role", status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, "role"',
      [name, email, hashedPassword, defaultAvatar, 'agent', 'offline']
    );

    return NextResponse.json({ user: newUser.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
