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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  // Note: This is a placeholder for fetching real data.
  // In a real application, you would fetch this from your API.
  useEffect(() => {
    const fetchUsers = async () => {
        // This is a mock implementation. Replace with your actual data fetching logic.
        const mockUsers: User[] = [
            { id: 'user-1', name: 'Alex Doe', email: 'alex.doe@example.com', avatar: 'https://picsum.photos/seed/1/40/40', role: 'agent', status: 'online' },
            { id: 'user-2', name: 'Sam Smith', email: 'sam.smith@example.com', avatar: 'https://picsum.photos/seed/2/40/40', role: 'agent', status: 'offline' },
            { id: 'user-3', name: 'Jordan Lee', email: 'jordan.lee@example.com', avatar: 'https://picsum.photos/seed/3/40/40', role: 'admin', status: 'online' },
            { id: 'user-4', name: 'Casey Brown', email: 'casey.brown@example.com', avatar: 'https://picsum.photos/seed/4/40/40', role: 'agent', status: 'online' },
          ];
        setUsers(mockUsers);
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">用户管理</h1>
          <p className="text-muted-foreground">管理您的代理和管理员团队。</p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" /> 添加代理
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>添加新代理</DialogTitle>
                <DialogDescription>
                    填写详细信息以将新成员添加到您的团队。
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    名称
                    </Label>
                    <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                    电子邮件
                    </Label>
                    <Input id="email" type="email" defaultValue="pedro@example.com" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                    角色
                    </Label>
                    <Select>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="选择一个角色" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="agent">代理</SelectItem>
                            <SelectItem value="admin">管理员</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                <DialogFooter>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">添加用户</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
                        <DropdownMenuItem>编辑</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10">删除</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
