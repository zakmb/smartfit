import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { apiService } from '../services/api';
import type { CheckinEntry } from '../types/CheckinTypes';

interface CheckinContextType {
  entries: CheckinEntry[];
  addEntry: (entry: Omit<CheckinEntry, 'id' | 'userId'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  updateEntry: (id: string, entry: Partial<CheckinEntry>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CheckinContext = createContext<CheckinContextType | undefined>(undefined);

export function useCheckin() {
  const context = useContext(CheckinContext);
  if (!context) {
    throw new Error('useCheckin must be used within a CheckinProvider');
  }
  return context;
}

export function CheckinProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CheckinEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Convert API CheckinEntry to local CheckinEntry
  const convertApiEntry = (apiEntry: any): CheckinEntry => ({
    id: apiEntry.id?.toString() || '',
    userId: apiEntry.userId || '',
    type: apiEntry.type.toLowerCase() as CheckinEntry['type'],
    title: apiEntry.title,
    description: apiEntry.description,
    calories: apiEntry.calories,
    duration: apiEntry.duration,
    weight: apiEntry.weight,
    water: apiEntry.water,
    exercises: apiEntry.exercises?.map((ex: any) => ({
      ...ex,
      unit: (ex.unit as string) === 'bodyweight' ? 'kg' : ex.unit as 'kg' | 'lbs'
    })),
    timestamp: apiEntry.timestamp,
  });

  // Convert local CheckinEntry to API CheckinEntry
  const convertToApiEntry = (entry: Omit<CheckinEntry, 'id' | 'userId'>): any => ({
    type: entry.type.toUpperCase() as 'WORKOUT' | 'EXERCISE' | 'MEAL' | 'WEIGHT' | 'WATER',
    title: entry.title,
    description: entry.description,
    calories: entry.calories,
    duration: entry.duration,
    weight: entry.weight,
    water: entry.water,
    exercises: entry.exercises,
    timestamp: entry.timestamp,
  });

  // Load entries from backend API
  const loadEntriesFromAPI = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      const apiEntries = await apiService.getAllEntries();
              const convertedEntries = apiEntries.map(convertApiEntry);
      setEntries(convertedEntries);
    } catch (err) {
      console.error('Failed to load entries from API:', err);
      setError('Failed to load entries from server');
    } finally {
      setLoading(false);
    }
  };

  // Load data from API only
  useEffect(() => {
    if (!currentUser) {
      setEntries([]);
      return;
    }

    // Load initial data from API
    loadEntriesFromAPI();
  }, [currentUser]);

  const addEntry = async (entry: Omit<CheckinEntry, 'id' | 'userId'>) => {
    if (!currentUser) return;

    try {
      setError(null);
      
      // Add to backend API only - it will handle Firebase storage
      const apiEntry = convertToApiEntry(entry);
      const createdApiEntry = await apiService.createEntry(apiEntry);
      const convertedEntry = convertApiEntry(createdApiEntry);

      // Refresh the entire list to ensure consistency
      await loadEntriesFromAPI();
      
      // Show success toast
      addToast(`${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} entry added successfully!`, 'success');
    } catch (err) {
      console.error('Failed to add entry:', err);
      setError('Failed to add entry');
      addToast('Failed to add entry. Please try again.', 'error');
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setError(null);
      
      // Delete from backend API only - it will handle Firebase storage
      await apiService.deleteEntry(id);
      
      // Refresh the entire list to ensure consistency
      await loadEntriesFromAPI();
      
      // Show success toast
      addToast('Entry deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete entry:', err);
      setError('Failed to delete entry');
      addToast('Failed to delete entry. Please try again.', 'error');
      throw err;
    }
  };

  const updateEntry = async (id: string, updatedFields: Partial<CheckinEntry>) => {
    try {
      setError(null);
      
      // Update in backend API only - it will handle Firebase storage
      const apiUpdateData: any = {};
      if (updatedFields.title) apiUpdateData.title = updatedFields.title;
      if (updatedFields.description) apiUpdateData.description = updatedFields.description;
      if (updatedFields.calories !== undefined) apiUpdateData.calories = updatedFields.calories;
      if (updatedFields.duration !== undefined) apiUpdateData.duration = updatedFields.duration;
      if (updatedFields.weight !== undefined) apiUpdateData.weight = updatedFields.weight;
      if (updatedFields.water !== undefined) apiUpdateData.water = updatedFields.water;
      if (updatedFields.timestamp) apiUpdateData.timestamp = updatedFields.timestamp;
      
      await apiService.updateEntry(id, apiUpdateData);
      
      // Update local state
      setEntries(prev => prev.map(entry => 
        entry.id === id ? { ...entry, ...updatedFields } : entry
      ));
      
      // Show success toast
      addToast('Entry updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update entry:', err);
      setError('Failed to update entry');
      addToast('Failed to update entry. Please try again.', 'error');
      throw err;
    }
  };

  const value: CheckinContextType = {
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
    loading,
    error,
  };

  return (
    <CheckinContext.Provider value={value}>
      {children}
    </CheckinContext.Provider>
  );
}
