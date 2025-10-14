import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: '电子邮件和密码是必需的。' }, { status: 400 });
    }

    // 查找用户
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result[0];

    if (!user) {
      return NextResponse.json({ message: '无效的电子邮件或密码。' }, { status: 401 });
    }

    // 比较密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: '无效的电子邮件或密码。' }, { status: 401 });
    }

    // 登录成功
    // 在真实应用中，您会在这里创建一个会话或JWT
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: '登录成功', user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}
