'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Copy, PlusCircle, Globe, Trash2 } from "lucide-react";
import type { Website } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function IntegrationPage() {
    const { toast } = useToast();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newWebsiteName, setNewWebsiteName] = useState('');
    const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    
    const codeSnippet = selectedWebsite ? `<div id="neonsupport-widget-container"></div>
<script 
  src="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app-domain.com'}/widget.js" 
  data-widget-id="${selectedWebsite.id}" 
  defer>
</script>` : '请先选择或添加一个网站以生成代码片段。';

    const fetchWebsites = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/websites');
            if (!response.ok) throw new Error('无法获取网站列表');
            const data = await response.json();
            setWebsites(data);
            if (data.length > 0 && !selectedWebsite) {
                setSelectedWebsite(data[0]);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: '错误', description: error.message });
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchWebsites();
    }, []);

    const handleCopy = () => {
        if (!selectedWebsite) {
            toast({ variant: 'destructive', title: '错误', description: '没有可复制代码。' });
            return;
        }
        navigator.clipboard.writeText(codeSnippet);
        toast({
            title: "已复制到剪贴板！",
            description: "您现在可以将代码粘贴到您网站的HTML中。",
        });
    };

    const handleAddWebsite = async () => {
        if (!newWebsiteName || !newWebsiteUrl) {
            toast({ variant: 'destructive', title: '错误', description: '请填写所有字段。' });
            return;
        }
        setFormLoading(true);
        try {
            const response = await fetch('/api/websites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newWebsiteName, url: newWebsiteUrl }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '添加网站失败');
            }
            const newSite = await response.json();
            toast({ title: '成功', description: '网站已成功添加。' });
            setIsDialogOpen(false);
            setNewWebsiteName('');
            setNewWebsiteUrl('');
            // Refresh list and select the new site
            const updatedWebsites = [...websites, newSite];
            setWebsites(updatedWebsites);
            setSelectedWebsite(newSite);
        } catch (error: any) {
            toast({ variant: 'destructive', title: '操作失败', description: error.message });
        } finally {
            setFormLoading(false);
        }
    };

    // Placeholder for delete functionality
    const handleDeleteWebsite = (websiteId: string) => {
        // This is a placeholder. A real implementation would call a DELETE API endpoint.
        console.log(`TODO: Delete website with ID: ${websiteId}`);
        toast({ title: '功能待定', description: '删除功能即将推出！' });
    }


    return (
        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch p-4 md:p-6 lg:p-8">
            <ResizablePanel defaultSize={35} minSize={25} maxSize={40}>
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline text-2xl">我的网站</CardTitle>
                            <CardDescription>管理您的已注册网站。</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" />添加网站</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>添加新网站</DialogTitle>
                                    <DialogDescription>输入您想安装聊天小部件的网站的详细信息。</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="website-name">网站名称</Label>
                                        <Input id="website-name" value={newWebsiteName} onChange={(e) => setNewWebsiteName(e.target.value)} placeholder="我的电商网站" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="website-url">网站URL</Label>
                                        <Input id="website-url" value={newWebsiteUrl} onChange={(e) => setNewWebsiteUrl(e.target.value)} placeholder="https://example.com" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
                                    <Button onClick={handleAddWebsite} disabled={formLoading}>
                                        {formLoading ? '添加中...' : '添加网站'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto">
                        {loading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ) : websites.length > 0 ? (
                            <div className="space-y-2">
                                {websites.map(site => (
                                    <button
                                        key={site.id}
                                        className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-colors ${selectedWebsite?.id === site.id ? 'bg-accent border-primary' : 'hover:bg-accent/50'}`}
                                        onClick={() => setSelectedWebsite(site)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold">{site.name}</p>
                                                <p className="text-sm text-muted-foreground">{site.url}</p>
                                            </div>
                                        </div>
                                         <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteWebsite(site.id); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-10">
                                <p>您还没有添加任何网站。</p>
                                <p>点击“添加网站”开始吧。</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={65}>
                <div className="h-full pl-4 md:pl-6 lg:pl-8">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">整合代码</CardTitle>
                        <CardDescription>
                            将此代码片段粘贴到您网站的HTML文件中<code>&lt;/body&gt;</code>结束标签之前。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                             <Skeleton className="h-32 w-full" />
                        ) : (
                        <div className="relative rounded-md bg-muted/50 p-4 font-mono text-sm">
                            <pre><code className="whitespace-pre-wrap">{codeSnippet}</code></pre>
                            {selectedWebsite && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:bg-muted"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">复制代码</span>
                                </Button>
                            )}
                        </div>
                        )}
                    </CardContent>
                </Card>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
