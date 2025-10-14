'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar"
import {
  MessageSquare,
  Settings,
  Code,
  Users,
  Bot
} from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header";
import { UserNav } from "@/components/user-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-4">
             <div className="flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground font-headline">霓虹客服</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard">
                  <SidebarMenuButton isActive={isActive('/dashboard')} tooltip="对话">
                    <MessageSquare />
                    <span>对话</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/integration">
                  <SidebarMenuButton isActive={isActive('/dashboard/integration')} tooltip="整合">
                    <Code />
                    <span>整合</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/settings">
                  <SidebarMenuButton isActive={isActive('/dashboard/settings')} tooltip="设置">
                    <Settings />
                    <span>设置</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/admin">
                  <SidebarMenuButton isActive={isActive('/dashboard/admin')} tooltip="管理">
                    <Users />
                    <span>管理</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
