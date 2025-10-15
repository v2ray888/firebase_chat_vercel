'use client';

import { useSettings, type AppSettings } from '@/hooks/use-settings';
import { createContext, useContext, ReactNode } from 'react';

interface SettingsContextType {
  settings: AppSettings;
  loading: boolean;
  saving: boolean;
  updateSettings: (newValues: Partial<AppSettings>) => void;
  handleSaveChanges: () => Promise<void>;
  hasChanges: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const settingsData = useSettings();
  return (
    <SettingsContext.Provider value={settingsData}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
