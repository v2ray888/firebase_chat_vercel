'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 如果用户已经登录，直接重定向
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("开始登录请求");
      const result = await login(email, password);
      
      if (result.success) {
        toast({
            title: "登录成功",
            description: "正在跳转...",
        });
        
        // 获取redirect参数，如果没有则默认跳转到'/dashboard'
        const redirect = searchParams.get('redirect') || '/dashboard';
        console.log("跳转目标:", redirect);
        
        // 添加一个小延迟，确保toast消息能够显示
        setTimeout(() => {
          console.log("执行跳转到:", redirect);
          router.push(redirect);
        }, 1000);
      } else {
        toast({
            variant: "destructive",
            title: "登录失败",
            description: result.message || '无效的电子邮件或密码。',
        });
        setLoading(false);
      }
    } catch (error) {
        console.error("登录过程中发生错误:", error);
        toast({
            variant: "destructive",
            title: "发生错误",
            description: '无法连接到服务器。请稍后再试。',
        });
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
          <Button className="w-full" type="submit" disabled={loading}>
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