'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useSettingsContext } from '@/contexts/settings-context';
import { Textarea } from '@/components/ui/textarea';


export default function SettingsAvailabilityPage() {
  const { settings, loading, saving, updateSettings } = useSettingsContext();
  
  if (loading || !settings || !updateSettings) {
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
      <Card>
          <CardHeader>
              <CardTitle>代理可用性</CardTitle>
              <CardDescription>管理您的团队的在线和离线状态。</CardDescription>
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
                      checked={settings.acceptNewChats}
                      onCheckedChange={(checked) => updateSettings({ acceptNewChats: checked })}
                      disabled={saving}
                      aria-label="Accept new chats"
                  />
              </div>
              
              <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                      <Label htmlFor="auto-offline" className="text-base">自动离线</Label>
                      <p className="text-sm text-muted-foreground">
                          根据办公时间自动设置离线状态
                      </p>
                  </div>
                  <Switch 
                      id="auto-offline"
                      checked={settings.autoOffline}
                      onCheckedChange={(checked) => updateSettings({ autoOffline: checked })}
                      disabled={saving}
                      aria-label="Auto offline"
                  />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-start-time">开始时间</Label>
                    <Input
                      id="work-start-time"
                      type="time"
                      value={settings.workStartTime}
                      onChange={(e) => updateSettings({ workStartTime: e.target.value })}
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work-end-time">结束时间</Label>
                    <Input
                      id="work-end-time"
                      type="time"
                      value={settings.workEndTime}
                      onChange={(e) => updateSettings({ workEndTime: e.target.value })}
                      disabled={saving}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="away-message">离线消息</Label>
                  <Textarea
                    id="away-message"
                    value={settings.awayMessage}
                    onChange={(e) => updateSettings({ awayMessage: e.target.value })}
                    disabled={saving}
                    placeholder="当代理离线时显示的消息"
                  />
                </div>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}