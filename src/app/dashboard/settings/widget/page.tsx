'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSettingsContext } from '@/contexts/settings-context';


export default function SettingsWidgetPage() {
  const { settings, loading, saving, updateSettings } = useSettingsContext();

  if (loading || !settings || !updateSettings) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <Card>
         <CardHeader>
           <CardTitle>自动消息</CardTitle>
           <CardDescription>设置在特定情况下自动发送的消息。</CardDescription>
         </CardHeader>
         <CardContent className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="welcome-message">欢迎消息</Label>
                <Textarea
                    id="welcome-message"
                    placeholder="输入欢迎消息..."
                    value={settings.welcome_message}
                    onChange={(e) => updateSettings({ welcome_message: e.target.value })}
                    disabled={saving}
                    className="max-w-lg"
                />
                <p className="text-sm text-muted-foreground">
                    此消息在客户首次打开聊天时发送。
                </p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="offline-message">离线消息</Label>
                <Textarea
                    id="offline-message"
                    placeholder="输入离线消息..."
                    value={settings.offline_message}
                    onChange={(e) => updateSettings({ offline_message: e.target.value })}
                    disabled={saving}
                    className="max-w-lg"
                />
                <p className="text-sm text-muted-foreground">
                    如果客户在您离线时尝试聊天，则会显示此消息。
                </p>
            </div>
         </CardContent>
       </Card>
    </div>
  );
}
