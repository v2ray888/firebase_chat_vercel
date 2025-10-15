'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';

// 使用与认证上下文相同的User接口
interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'admin';
  avatar: string;
}

export default function ProfilePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 获取当前用户信息
  useEffect(() => {
    // 如果认证上下文还在加载，等待它完成
    if (authLoading) return;

    // 使用认证上下文中的用户信息
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    } else {
      // 如果没有认证用户，显示错误信息
      toast({
        title: '错误',
        description: '未找到用户信息，请重新登录。',
        variant: 'destructive',
      });
      setLoading(false);
    }
  }, [currentUser, authLoading, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // 准备更新数据
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      };

      // 发送更新请求
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        
        toast({
          title: '成功',
          description: '个人信息更新成功',
        });
      } else {
        const errorData = await response.json();
        toast({
          title: '错误',
          description: errorData.message || '更新失败',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '错误',
        description: '更新过程中发生错误',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // 验证密码确认
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: '错误',
          description: '新密码和确认密码不匹配',
          variant: 'destructive',
        });
        setUpdating(false);
        return;
      }

      // 验证密码字段
      if (!formData.currentPassword || !formData.newPassword) {
        toast({
          title: '错误',
          description: '请填写所有密码字段',
          variant: 'destructive',
        });
        setUpdating(false);
        return;
      }

      // 发送密码更新请求
      const response = await fetch(`/api/users/${user?.id}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // 更新认证上下文中的用户信息
        setUser(result.user);
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        
        toast({
          title: '成功',
          description: result.message,
        });
      } else {
        const errorData = await response.json();
        toast({
          title: '错误',
          description: errorData.message || '密码更新失败',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '错误',
        description: '密码更新过程中发生错误',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">个人资料</h1>
        <p className="text-muted-foreground">管理您的个人资料和账户设置</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>更新您的个人资料信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role === 'admin' ? '管理员' : '客服代理'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="您的姓名"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">电子邮件</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="您的电子邮件"
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  更新资料
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>修改密码</CardTitle>
            <CardDescription>更改您的账户密码</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">当前密码</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="输入当前密码"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">新密码</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="输入新密码"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="再次输入新密码"
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  更新密码
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}