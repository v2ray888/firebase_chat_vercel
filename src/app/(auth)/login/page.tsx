'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({
            title: "登录成功",
            description: "正在跳转到仪表盘...",
        });
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast({
            variant: "destructive",
            title: "登录失败",
            description: errorData.message || '无效的电子邮件或密码。',
        });
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "发生错误",
            description: '无法连接到服务器。请稍后再试。',
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">登录</CardTitle>
        <CardDescription>输入您的电子邮件以登录您的帐户。</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">电子邮件</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </Button>
          <div className="text-center text-sm">
            还没有帐户？{' '}
            <Link href="/signup" className="underline text-primary">
              注册
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
