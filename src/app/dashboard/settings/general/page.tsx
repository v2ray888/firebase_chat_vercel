'use client';

import { WidgetPreview } from '@/components/settings/widget-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSettingsContext } from '@/contexts/settings-context';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsGeneralPage() {
  const { settings, loading, saving, updateSettings } = useSettingsContext();

  if (loading || !settings || !updateSettings) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
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
              <CardTitle>小部件自定义</CardTitle>
              <CardDescription>调整颜色以匹配您的品牌。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">主色</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary-color-hex"
                    value={settings.primaryColor}
                    onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                    className="w-32"
                    disabled={saving}
                  />
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                    className="w-10 h-10 p-1"
                    disabled={saving}
                  />
                </div>
              </div>
              
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
              
              <div className="space-y-2">
                <Label htmlFor="welcome-message">欢迎消息</Label>
                <Textarea
                  id="welcome-message"
                  value={settings.welcomeMessage}
                  onChange={(e) => updateSettings({ welcomeMessage: e.target.value })}
                  disabled={saving}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offline-message">离线消息</Label>
                <Textarea
                  id="offline-message"
                  value={settings.offlineMessage}
                  onChange={(e) => updateSettings({ offlineMessage: e.target.value })}
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
              <CardTitle>聊天设置</CardTitle>
              <CardDescription>自定义聊天体验</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="typing-indicator-message">输入指示消息</Label>
                <Input
                  id="typing-indicator-message"
                  value={settings.typingIndicatorMessage}
                  onChange={(e) => updateSettings({ typingIndicatorMessage: e.target.value })}
                  disabled={saving}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="connection-message">连接消息</Label>
                <Input
                  id="connection-message"
                  value={settings.connectionMessage}
                  onChange={(e) => updateSettings({ connectionMessage: e.target.value })}
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accept-new-chats">接受新聊天</Label>
                  <p className="text-sm text-muted-foreground">
                    允许新客户发起聊天
                  </p>
                </div>
                <Switch
                  id="accept-new-chats"
                  checked={settings.acceptNewChats}
                  onCheckedChange={(checked) => updateSettings({ acceptNewChats: checked })}
                  disabled={saving}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-ai-suggestions">启用AI建议</Label>
                  <p className="text-sm text-muted-foreground">
                    显示AI生成的快速回复建议
                  </p>
                </div>
                <Switch
                  id="enable-ai-suggestions"
                  checked={settings.enableAiSuggestions}
                  onCheckedChange={(checked) => updateSettings({ enableAiSuggestions: checked })}
                  disabled={saving}
                />
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