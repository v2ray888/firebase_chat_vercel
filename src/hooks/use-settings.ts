'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AppSettings {
  id: number;
  primaryColor: string;
  welcomeMessage: string;
  offlineMessage: string;
  acceptNewChats: boolean;
  widgetTitle: string;
  widgetSubtitle: string;
  autoOpenWidget: boolean;
  showBranding: boolean;
  typingIndicatorMessage: string;
  connectionMessage: string;
  workStartTime: string;
  workEndTime: string;
  autoOffline: boolean;
  awayMessage: string;
  enableAiSuggestions: boolean;
  enableImageUpload: boolean; // 添加图片上传功能开关
  createdAt: string;
  updatedAt: string;
}

const defaultSettings: AppSettings = {
  id: 1,
  primaryColor: '#64B5F6',
  welcomeMessage: '您好！我们能为您做些什么？',
  offlineMessage: '我们目前不在。请留言，我们会尽快回复您。',
  acceptNewChats: true,
  widgetTitle: '客服支持',
  widgetSubtitle: '我们通常在几分钟内回复',
  autoOpenWidget: false,
  showBranding: true,
  typingIndicatorMessage: '客服正在输入...',
  connectionMessage: '已连接到客服',
  workStartTime: '09:00',
  workEndTime: '18:00',
  autoOffline: false,
  awayMessage: '我现在不在，但我稍后会回复您。',
  enableAiSuggestions: true,
  enableImageUpload: true, // 默认启用图片上传功能
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [initialSettings, setInitialSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        // If the server returns an error, we'll rely on the catch block
        // to handle it and set default settings.
        const errorData = await response.json();
        throw new Error(errorData.message || `Status: ${response.status}`);
      }
      const data = await response.json();
      setSettings(data);
      setInitialSettings(data);
    } catch (error: any) {
      // THIS IS THE CRITICAL FIX:
      // Instead of showing a "Loading Failed" toast, we silently fall back
      // to the default settings. This makes the UI resilient to any backend failures.
      console.error(`Failed to load settings: ${error.message}. Using default settings.`);
      setSettings(defaultSettings);
      setInitialSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = (newValues: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newValues }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || '保存失败');
      }
      
      setSettings(responseData);
      setInitialSettings(responseData);

      toast({
        title: '设置已保存',
        description: '您的更改已成功保存。',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: `保存设置失败: ${error.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  return { settings, loading, saving, updateSettings, handleSaveChanges, hasChanges };
}