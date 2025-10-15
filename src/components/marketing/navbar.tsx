'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <MessageSquare className="h-7 w-7 text-primary" />
                        <span className="font-bold text-xl font-headline">霓虹客服</span>
                    </Link>
                </div>
                <nav className="flex items-center gap-4 text-sm lg:gap-6">
                    <Link
                        href="#features"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        功能
                    </Link>
                    <Link
                        href="#pricing"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        定价
                    </Link>
                </nav>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <Link href="/login">
                        <Button variant="ghost">登录</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">免费注册</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
