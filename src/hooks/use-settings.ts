'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AppSettings {
  primary_color: string;
  welcome_message: string;
  offline_message: string;
  accept_new_chats: boolean;
}

const defaultSettings: AppSettings = {
  primary_color: '#64B5F6',
  welcome_message: '您好！我们能为您做些什么？',
  offline_message: '我们目前不在。请留言，我们会尽快回复您。',
  accept_new_chats: true,
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
      // 不再检查 response.ok，因为即使是 500 错误，我们也要尝试解析 body
      // 以处理后端可能返回的错误信息
      const data = await response.json();
      
      if (!response.ok) {
        // 如果响应状态不是 2xx，则抛出错误，错误信息来自后端
        throw new Error(data.message || '加载设置失败。');
      }

      setSettings(data);
      setInitialSettings(data);
    } catch (error: any) {
      console.error(error);
      setSettings(defaultSettings); // 出错时回退到默认设置
      setInitialSettings(defaultSettings);
      toast({
        variant: 'destructive',
        title: '加载失败',
        description: `无法加载应用设置: ${error.message}。正在使用默认设置。`,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = (newValues: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newValues }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // 确保我们只发送纯净的设置数据
      const payload: AppSettings = {
        primary_color: settings.primary_color,
        welcome_message: settings.welcome_message,
        offline_message: settings.offline_message,
        accept_new_chats: settings.accept_new_chats,
      };

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
