'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/settings/sidebar-nav';
import { Button } from '@/components/ui/button';
import { SettingsProvider, useSettingsContext } from '@/contexts/settings-context';

const sidebarNavItems = [
  {
    title: '通用',
    href: '/dashboard/settings/general',
  },
  {
    title: '小部件',
    href: '/dashboard/settings/widget',
  },
  {
    title: '可用性',
    href: '/dashboard/settings/availability',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

function SettingsLayoutContent({ children }: SettingsLayoutProps) {
    const { loading, saving, handleSaveChanges } = useSettingsContext();

    return (
        <div className="overflow-y-auto h-full">
            <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h1 className="text-3xl font-bold font-headline">设置</h1>
                        <p className="text-muted-foreground">
                            管理您的应用设置并自定义小部件行为。
                        </p>
                    </div>
                    <Button onClick={handleSaveChanges} disabled={saving || loading}>
                        {saving ? '保存中...' : '保存更改'}
                    </Button>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-4xl">{children}</div>
                </div>
            </div>
        </div>
    );
}


export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <SettingsProvider>
        <SettingsLayoutContent>
            {children}
        </SettingsLayoutContent>
    </SettingsProvider>
  );
}