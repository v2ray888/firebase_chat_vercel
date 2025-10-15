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
      if (!response.ok) {
        throw new Error('无法加载设置');
      }
      const data = await response.json();
      setSettings(data);
      setInitialSettings(data);
    } catch (error) {
      console.error(error);
      setSettings(defaultSettings); // Fallback to default on error
      setInitialSettings(defaultSettings);
      toast({
        variant: 'destructive',
        title: '加载失败',
        description: '无法加载应用设置。正在使用默认设置。',
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
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '保存失败');
      }
      
      const savedData = await response.json();

      setSettings(savedData);
      setInitialSettings(savedData);

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
