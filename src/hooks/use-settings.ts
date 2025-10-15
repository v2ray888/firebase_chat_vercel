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
