'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSettingsContext } from '@/contexts/settings-context';
import { Switch } from '@/components/ui/switch';
import { WidgetPreview } from '@/components/settings/widget-preview';


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
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>小部件配置</CardTitle>
              <CardDescription>自定义小部件的外观和行为</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="widget-title">小部件标题</Label>
                <Input
                  id="widget-title"
                  value={settings.widgetTitle}
                  onChange={(e) => updateSettings({ widgetTitle: e.target.value })}
                  disabled={saving}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="widget-subtitle">小部件副标题</Label>
                <Input
                  id="widget-subtitle"
                  value={settings.widgetSubtitle}
                  onChange={(e) => updateSettings({ widgetSubtitle: e.target.value })}
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-open-widget">自动打开小部件</Label>
                  <p className="text-sm text-muted-foreground">
                    页面加载时自动打开小部件
                  </p>
                </div>
                <Switch
                  id="auto-open-widget"
                  checked={settings.autoOpenWidget}
                  onCheckedChange={(checked) => updateSettings({ autoOpenWidget: checked })}
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-branding">显示品牌标识</Label>
                  <p className="text-sm text-muted-foreground">
                    在小部件中显示品牌标识
                  </p>
                </div>
                <Switch
                  id="show-branding"
                  checked={settings.showBranding}
                  onCheckedChange={(checked) => updateSettings({ showBranding: checked })}
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-image-upload">启用图片上传</Label>
                  <p className="text-sm text-muted-foreground">
                    允许用户在聊天中发送图片
                  </p>
                </div>
                <Switch
                  id="enable-image-upload"
                  checked={settings.enableImageUpload}
                  onCheckedChange={(checked) => updateSettings({ enableImageUpload: checked })}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
          
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
                  value={settings.welcomeMessage}
                  onChange={(e) => updateSettings({ welcomeMessage: e.target.value })}
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
                  value={settings.offlineMessage}
                  onChange={(e) => updateSettings({ offlineMessage: e.target.value })}
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
        
        <Card>
          <CardHeader>
            <CardTitle>小部件预览</CardTitle>
            <CardDescription>
              这是您的小部件向客户显示的方式。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WidgetPreview
              primaryColor={settings.primaryColor}
              welcomeMessage={settings.welcomeMessage}
              widgetTitle={settings.widgetTitle}
              widgetSubtitle={settings.widgetSubtitle}
              autoOpen={settings.autoOpenWidget}
              showBranding={settings.showBranding}
              enableImageUpload={settings.enableImageUpload}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}