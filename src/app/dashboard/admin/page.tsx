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


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // State for Add/Edit dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [formLoading, setFormLoading] = useState(false);

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
    fetchUsers();
  }, []);

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
    const url = isEdit ? `/api/users/${currentUser.id}` : '/api/users';
    const method = isEdit ? 'PATCH' : 'POST';

    // Basic validation
    if (!isEdit && (!currentUser.name || !currentUser.email || !currentUser.password)) {
        toast({ variant: "destructive", title: "错误", description: "请填写所有必填字段。" });
        setFormLoading(false);
        return;
    }
     if (isEdit && (!currentUser.name || !currentUser.email)) {
        toast({ variant: "destructive", title: "错误", description: "名称和电子邮件是必填项。" });
        setFormLoading(false);
        return;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentUser),
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
                        <Input id="name" value={currentUser.name || ''} onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">电子邮件</Label>
                        <Input id="email" type="email" value={currentUser.email || ''} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} className="col-span-3" />
                    </div>
                    {!isEdit && (
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">密码</Label>
                            <Input id="password" type="password" value={currentUser.password || ''} onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})} className="col-span-3" />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">角色</Label>
                        <Select value={currentUser.role} onValueChange={(value: 'agent' | 'admin') => setCurrentUser({...currentUser, role: value})}>
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
                        <Select value={currentUser.status} onValueChange={(value: 'online' | 'offline') => setCurrentUser({...currentUser, status: value})}>
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

    