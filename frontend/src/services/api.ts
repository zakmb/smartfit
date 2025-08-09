import { auth } from '../firebase';
import type { CheckinEntry } from '../types/CheckinTypes';
import type { Settings } from '../contexts/SettingsContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const idToken = await user.getIdToken(true); // Force refresh token
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      };
    } catch (error) {
      console.error('Failed to get authentication token:', error);
      throw new Error('Authentication failed');
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        // Handle specific HTTP error codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to perform this action.');
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Request failed: ${response.statusText} - ${errorText}`);
      }

      // For DELETE requests or responses with no content, don't try to parse JSON
      if (options.method === 'DELETE' || response.status === 204) {
        return {} as T;
      }

      // Check if response has content before trying to parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  // Checkin endpoints
  async getAllEntries(): Promise<CheckinEntry[]> {
    return this.makeRequest<CheckinEntry[]>('/checkin');
  }

  async getEntryById(id: string): Promise<CheckinEntry> {
    return this.makeRequest<CheckinEntry>(`/checkin/${id}`);
  }

  async getEntriesByType(type: CheckinEntry['type']): Promise<CheckinEntry[]> {
    return this.makeRequest<CheckinEntry[]>(`/checkin/type/${type}`);
  }

  async getEntriesByDateRange(startDate: string, endDate: string): Promise<CheckinEntry[]> {
    return this.makeRequest<CheckinEntry[]>(`/checkin/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  async createEntry(entry: Omit<CheckinEntry, 'id' | 'userId'>): Promise<CheckinEntry> {
    return this.makeRequest<CheckinEntry>('/checkin', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }

  async updateEntry(id: string, entry: Partial<CheckinEntry>): Promise<CheckinEntry> {
    return this.makeRequest<CheckinEntry>(`/checkin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  }

  async deleteEntry(id: string): Promise<void> {
    return this.makeRequest<void>(`/checkin/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats(startDate: string, endDate: string): Promise<{
    workouts: number;
    meals: number;
    weights: number;
    water: number;
  }> {
    return this.makeRequest(`/checkin/stats?startDate=${startDate}&endDate=${endDate}`);
  }

  // Settings endpoints
  async getUserSettings(): Promise<Settings> {
    return this.makeRequest<Settings>('/settings');
  }

  async saveUserSettings(settings: Settings): Promise<Settings> {
    return this.makeRequest<Settings>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Auth endpoints
  async verifyToken(idToken: string): Promise<{ valid: boolean; userId: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
export type { CheckinEntry }; 