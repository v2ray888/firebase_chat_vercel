'use client';

import { WidgetPreview } from "@/components/settings/widget-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SettingsPage() {
    const { toast } = useToast();
    const [primaryColor, setPrimaryColor] = useState('#64B5F6');
    const [welcomeMessage, setWelcomeMessage] = useState('您好！我们能为您做些什么？');
    const [offlineMessage, setOfflineMessage] = useState('我们目前不在。请留言，我们会尽快回复您。');

    const handleSaveChanges = () => {
        toast({
            title: "设置已保存",
            description: "您的更改已成功保存。",
        });
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <h1 className="text-3xl font-bold font-headline mb-6">设置</h1>
            <Tabs defaultValue="appearance">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="appearance">外观</TabsTrigger>
                    <TabsTrigger value="availability">可用性</TabsTrigger>
                    <TabsTrigger value="responses">自动回复</TabsTrigger>
                </TabsList>

                <TabsContent value="appearance">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>小部件自定义</CardTitle>
                                <CardDescription>自定义您的聊天小部件的外观和感觉。</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="primary-color">主色</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="primary-color-hex"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="w-32"
                                        />
                                        <Input
                                            id="primary-color"
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="w-10 h-10 p-1"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle>小部件预览</CardTitle>
                                <CardDescription>这是您的小部件向客户显示的方式。</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <WidgetPreview primaryColor={primaryColor} welcomeMessage={welcomeMessage} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="availability">
                    <Card>
                        <CardHeader>
                            <CardTitle>代理可用性</CardTitle>
                            <CardDescription>设置您团队的在线时间和离线状态。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">接受新聊天</Label>
                                    <p className="text-sm text-muted-foreground">
                                        关闭此项可对新访客显示为离线。
                                    </p>
                                </div>
                                <Switch defaultChecked/>
                            </div>
                            <div className="space-y-2">
                                <Label>办公时间（即将推出）</Label>
                                <p className="text-sm text-muted-foreground">
                                    根据时间表自动设置您的可用性。此功能计划在将来的更新中推出。
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="responses">
                    <Card>
                        <CardHeader>
                            <CardTitle>自动聊天回复</CardTitle>
                            <CardDescription>设置在特定情况下自动发送的消息。</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="welcome-message">欢迎消息</Label>
                                <Textarea
                                    id="welcome-message"
                                    placeholder="输入欢迎消息..."
                                    value={welcomeMessage}
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">此消息在客户首次打开聊天时发送。</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="offline-message">离线消息</Label>
                                <Textarea
                                    id="offline-message"
                                    placeholder="输入离线消息..."
                                    value={offlineMessage}
                                    onChange={(e) => setOfflineMessage(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">如果客户在您离线时尝试聊天，则会显示此消息。</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveChanges} className="bg-accent hover:bg-accent/90 text-accent-foreground">保存更改</Button>
            </div>
        </div>
    )
}
