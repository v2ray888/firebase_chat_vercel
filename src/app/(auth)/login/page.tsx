'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
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
            <Input id="email" type="email" placeholder="m@example.com" required defaultValue="alex.doe@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" required defaultValue="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" type="submit">
            登录
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
