'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSettings } from '@/hooks/use-settings';

export default function SettingsWidgetPage() {
  const { settings, loading, saving, updateSettings, handleSaveChanges } = useSettings();

  if (loading) {
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
      <div>
        <h3 className="text-lg font-medium">小部件</h3>
        <p className="text-sm text-muted-foreground">
          设置在特定情况下自动发送的消息。
        </p>
      </div>
       <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="space-y-8">
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
        <Button type="submit" disabled={saving}>
          {saving ? '保存中...' : '保存更改'}
        </Button>
      </form>
    </div>
  );
}
