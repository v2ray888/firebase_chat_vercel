'use client';

import { User } from "@/types";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // 添加调试信息
  console.log("AdminPage渲染 - currentUser:", currentUser, "authLoading:", authLoading);

  // State for Add/Edit dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserData, setCurrentUser] = useState<Partial<User>>({});
  const [formLoading, setFormLoading] = useState(false);

  // 检查用户权限
  useEffect(() => {
    console.log("权限检查 useEffect 触发 - authLoading:", authLoading, "currentUser:", currentUser);
    if (!authLoading && currentUser) {
      console.log("检查用户角色 - 当前角色:", currentUser.role, "是否为管理员:", currentUser.role === 'admin');
      // 如果不是管理员，重定向到主页
      if (currentUser.role !== 'admin') {
        console.log("用户不是管理员，重定向到仪表板");
        toast({
          title: '访问被拒绝',
          description: '您没有权限访问此页面。',
          variant: 'destructive',
        });
        router.push('/dashboard');
        return; // 添加return以确保不会继续执行
      } else {
        console.log("用户是管理员，允许访问");
      }
    }
  }, [currentUser, authLoading, router, toast]);

  const fetchUsers = async () => {
      setLoading(true);
      try {
          const response = await fetch('/api/users');
          if (!response.ok) {
              throw new Error('Failed to fetch users');
          }
          const data = await response.json();
          setUsers(data);
      } catch (error) {
          console.error(error);
          toast({ variant: "destructive", title: "错误", description: "无法加载用户数据。" });
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    // 只有管理员才能获取用户列表
    if (currentUser && currentUser.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
        setIsEdit(true);
        setCurrentUser(user);
    } else {
        setIsEdit(false);
        setCurrentUser({ role: 'agent', status: 'offline', password: '' });
    }
    setIsDialogOpen(true);
  }

  const handleSaveChanges = async () => {
    setFormLoading(true);
    const url = isEdit ? `/api/users/${currentUserData.id}` : '/api/users';
    const method = isEdit ? 'PATCH' : 'POST';

    // Basic validation
    if (!isEdit && (!currentUserData.name || !currentUserData.email || !currentUserData.password)) {
        toast({ variant: "destructive", title: "错误", description: "请填写所有必填字段。" });
        setFormLoading(false);
        return;
    }
     if (isEdit && (!currentUserData.name || !currentUserData.email)) {
        toast({ variant: "destructive", title: "错误", description: "名称和电子邮件是必填项。" });
        setFormLoading(false);
        return;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentUserData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '操作失败');
        }

        toast({ title: "成功", description: `用户已成功${isEdit ? '更新' : '添加'}。` });
        setIsDialogOpen(false);
        fetchUsers(); // Refresh user list

    } catch (error: any) {
        toast({ variant: "destructive", title: "操作失败", description: error.message });
    } finally {
        setFormLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
        const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '删除失败');
        }
        toast({ title: "成功", description: "用户已删除。" });
        fetchUsers(); // Refresh user list
    } catch (error: any) {
        toast({ variant: "destructive", title: "删除失败", description: error.message });
    }
  };

  // 如果仍在检查权限，显示加载状态
  if (authLoading) {
    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
            <Card>
                <CardContent className="p-0">
                   <div className="p-4 space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                   </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  // 如果用户不是管理员，不渲染页面内容（因为会被重定向）
  if (currentUser && currentUser.role !== 'admin') {
    return null; // 或者返回一个空的加载状态
  }

  // 如果页面仍在加载中，显示加载状态
  if (loading) {
    return (
        <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>
            <Card>
                <CardContent className="p-0">
                   <div className="p-4 space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                   </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">用户管理</h1>
          <p className="text-muted-foreground">管理您的代理和管理员团队。</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> 添加代理
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>
                  <span className="sr-only">操作</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-primary/20 text-primary' : ''}>
                        {user.role === 'admin' ? '管理员' : '代理'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="capitalize">{user.status === 'online' ? '在线' : '离线'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">切换菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenDialog(user)}>编辑</DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">删除</DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>您确定吗？</AlertDialogTitle>
                              <AlertDialogDescription>
                                此操作无法撤销。这将永久删除用户帐户并从我们的服务器中删除其数据。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">删除</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>{isEdit ? '编辑用户' : '添加新代理'}</DialogTitle>
                <DialogDescription>
                    {isEdit ? '更新用户的详细信息。' : '填写详细信息以将新成员添加到您的团队。'}
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">名称</Label>
                        <Input id="name" value={currentUserData.name || ''} onChange={(e) => setCurrentUser({...currentUserData, name: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">电子邮件</Label>
                        <Input id="email" type="email" value={currentUserData.email || ''} onChange={(e) => setCurrentUser({...currentUserData, email: e.target.value})} className="col-span-3" />
                    </div>
                    {!isEdit && (
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">密码</Label>
                            <Input id="password" type="password" value={currentUserData.password || ''} onChange={(e) => setCurrentUser({...currentUserData, password: e.target.value})} className="col-span-3" />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">角色</Label>
                        <Select value={currentUserData.role} onValueChange={(value: 'agent' | 'admin') => setCurrentUser({...currentUserData, role: value})}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="选择一个角色" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="agent">代理</SelectItem>
                                <SelectItem value="admin">管理员</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">状态</Label>
                        <Select value={currentUserData.status} onValueChange={(value: 'online' | 'offline') => setCurrentUser({...currentUserData, status: value})}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="选择一个状态" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="online">在线</SelectItem>
                                <SelectItem value="offline">离线</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
                    <Button onClick={handleSaveChanges} disabled={formLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {formLoading ? '保存中...' : '保存更改'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}