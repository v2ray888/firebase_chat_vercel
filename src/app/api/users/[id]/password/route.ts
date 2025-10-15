import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

type RouteParams = {
    params: {
        id: string;
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = params;
  if (!id) {
      return NextResponse.json({ message: '缺少用户 ID。' }, { status: 400 });
  }

  try {
      const body = await request.json();
      
      const { currentPassword, newPassword } = body;

      // 验证请求参数
      if (!currentPassword || !newPassword) {
          return NextResponse.json({ message: '当前密码和新密码都是必需的。' }, { status: 400 });
      }

      // 获取当前用户信息
      const users = await sql`SELECT * FROM users WHERE id = ${id}`;
      
      if (users.length === 0) {
          return NextResponse.json({ message: '未找到用户。' }, { status: 404 });
      }
      
      const user = users[0];

      // 验证当前密码
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
          return NextResponse.json({ message: '当前密码不正确。' }, { status: 401 });
      }

      // 哈希新密码
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // 更新密码
      const result = await sql`
        UPDATE users
        SET password = ${hashedNewPassword}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name, email, avatar, role, status
      `;

      if (result.length === 0) {
          return NextResponse.json({ message: '更新密码失败。' }, { status: 500 });
      }

      return NextResponse.json({ 
        message: '密码更新成功。', 
        user: result[0] 
      }, { status: 200 });

  } catch (error: any) {
      console.error(`Failed to update password for user ${id}:`, error);
      return NextResponse.json({ message: '内部服务器错误' }, { status: 500 });
  }
}