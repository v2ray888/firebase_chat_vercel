'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast({
            title: "注册成功",
            description: "您的帐户已创建。正在登录...",
        });
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast({
            variant: "destructive",
            title: "注册失败",
            description: errorData.message || '请检查您的输入并重试。',
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
        <CardTitle className="text-2xl font-headline">注册</CardTitle>
        <CardDescription>创建一个帐户以开始使用霓虹客服。</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">名称</Label>
            <Input id="name" placeholder="Alex Doe" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>
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
            {loading ? '创建中...' : '创建帐户'}
          </Button>
          <div className="text-center text-sm">
            已经有帐户了？{' '}
            <Link href="/login" className="underline text-primary">
              登录
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
