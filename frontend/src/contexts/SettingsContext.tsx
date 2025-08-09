import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { apiService } from '../services/api';

export interface Settings {
  workoutEnabled: boolean;
  mealEnabled: boolean;
  weightEnabled: boolean;
  waterEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: boolean) => Promise<void>;
  toggleSetting: (key: keyof Settings) => Promise<void>;
  saveSettings: (newSettings: Settings) => Promise<void>;
  isTypeEnabled: (type: string) => boolean;
  filterEntries: (entries: any[]) => any[];
  getEnabledTypes: () => string[];
  loading: boolean;
  error: string | null;
}

const defaultSettings: Settings = {
  workoutEnabled: true,
  mealEnabled: true,
  weightEnabled: true,
  waterEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from Firebase when user changes
  useEffect(() => {
    if (!currentUser) {
      setSettings(defaultSettings);
      return;
    }

    loadSettingsFromAPI();
  }, [currentUser]);

  const loadSettingsFromAPI = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const userSettings = await apiService.getUserSettings();
      setSettings(userSettings);
      
      // Also save to localStorage as fallback
      localStorage.setItem('smartfit-settings', JSON.stringify(userSettings));
    } catch (err) {
      console.error('Failed to load settings from API:', err);
      setError('Failed to load settings');
      addToast('Failed to load settings from server. Using cached settings.', 'warning');
      
      // Fallback to localStorage if API fails
      const savedSettings = localStorage.getItem('smartfit-settings');
      if (savedSettings) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        } catch (parseError) {
          console.error('Failed to parse saved settings:', parseError);
          setSettings(defaultSettings);
          addToast('Settings corrupted. Reset to defaults.', 'warning');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      
      const savedSettings = await apiService.saveUserSettings(newSettings);
      setSettings(savedSettings);
      
      // Also save to localStorage as fallback
      localStorage.setItem('smartfit-settings', JSON.stringify(savedSettings));
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };



  const updateSetting = async (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
  };

  const toggleSetting = async (key: keyof Settings) => {
    await updateSetting(key, !settings[key]);
  };

  const isTypeEnabled = (type: string): boolean => {
    const normalizedType = type.toLowerCase();
    
    // Map other types to their corresponding settings
    switch (normalizedType) {
      case 'workout':
        return settings.workoutEnabled;
      case 'exercise':
        return settings.workoutEnabled;
      case 'meal':
        return settings.mealEnabled;
      case 'weight':
        return settings.weightEnabled;
      case 'water':
        return settings.waterEnabled;
      default:
        return true; // Default to enabled for unknown types
    }
  };

  const filterEntries = (entries: any[]): any[] => {
    return entries.filter(entry => {
      const entryType = entry.type?.toLowerCase();
      return isTypeEnabled(entryType);
    });
  };

  const getEnabledTypes = (): string[] => {
    const allTypes = ['workout', 'meal', 'weight', 'water', 'exercise'];
    return allTypes.filter(type => isTypeEnabled(type));
  };

  const value: SettingsContextType = {
    settings,
    updateSetting,
    toggleSetting,
    saveSettings,
    isTypeEnabled,
    filterEntries,
    getEnabledTypes,
    loading,
    error,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 