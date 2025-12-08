/**
 * App store - general application state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/utils/constants';

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'query';
  database: 'postgres' | 'mongodb' | 'redis' | 'neo4j';
  description: string;
  timestamp: string;
}

interface UserPreferences {
  sidebarCollapsed: boolean;
  defaultPageSize: number;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
}

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Recent activities
  recentActivities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;

  // User preferences
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;

  // Global loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  sidebarCollapsed: false,
  defaultPageSize: 10,
  autoRefresh: false,
  refreshInterval: 30,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      // Recent activities
      recentActivities: [],

      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          recentActivities: [newActivity, ...state.recentActivities].slice(0, 10), // Keep only last 10
        }));
      },

      clearActivities: () => {
        set({ recentActivities: [] });
      },

      // User preferences
      preferences: DEFAULT_PREFERENCES,

      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        }));
      },

      // Global loading
      isLoading: false,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        preferences: state.preferences,
        recentActivities: state.recentActivities,
      }),
    }
  )
);
