'use client';

import { WidgetPreview } from '@/components/settings/widget-preview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { AppSettings } from '@/hooks/use-settings';

interface SettingsGeneralPageProps {
  settings?: AppSettings;
  loading?: boolean;
  saving?: boolean;
  updateSettings?: (newValues: Partial<AppSettings>) => void;
}

export default function SettingsGeneralPage({ 
  settings, 
  loading, 
  saving, 
  updateSettings 
}: SettingsGeneralPageProps) {

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
                  value={settings.primary_color}
                  onChange={(e) => updateSettings({ primary_color: e.target.value })}
                  className="w-32"
                  disabled={saving}
                />
                <Input
                  id="primary-color"
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => updateSettings({ primary_color: e.target.value })}
                  className="w-10 h-10 p-1"
                  disabled={saving}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>小部件预览</CardTitle>
            <CardDescription>
              这是您的小部件向客户显示的方式。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WidgetPreview
              primaryColor={settings.primary_color}
              welcomeMessage={settings.welcome_message}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
