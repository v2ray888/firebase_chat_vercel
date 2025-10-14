'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/use-settings';

export default function SettingsAvailabilityPage() {
  const { settings, loading, saving, updateSettings, handleSaveChanges } = useSettings();

  if (loading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
            <Skeleton className="h-40 w-full" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">可用性</h3>
        <p className="text-sm text-muted-foreground">
          管理您的团队的在线和离线状态。
        </p>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>代理可用性</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                      <Label htmlFor="accept-chats" className="text-base">接受新聊天</Label>
                      <p className="text-sm text-muted-foreground">
                          关闭此项可对新访客显示为离线。
                      </p>
                  </div>
                  <Switch 
                      id="accept-chats"
                      checked={settings.accept_new_chats}
                      onCheckedChange={(checked) => updateSettings({ accept_new_chats: checked })}
                      disabled={saving}
                      aria-label="Accept new chats"
                  />
              </div>
              <div className="space-y-2 pt-4">
                  <Label>办公时间（即将推出）</Label>
                  <p className="text-sm text-muted-foreground">
                      根据时间表自动设置您的可用性。此功能计划在将来的更新中推出。
                  </p>
              </div>
               <Button onClick={handleSaveChanges} disabled={saving}>
                  {saving ? '保存中...' : '保存可用性'}
               </Button>
          </CardContent>
      </Card>
    </div>
  );
}
