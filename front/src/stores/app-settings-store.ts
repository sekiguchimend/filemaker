import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DateRange {
  from: Date;
  to: Date;
}

interface AppSettingsState {
  selectedStoreId: string | null;
  dateRange: DateRange;
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
}

interface AppSettingsActions {
  setSelectedStoreId: (storeId: string | null) => void;
  setDateRange: (range: DateRange) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  resetDateRangeToToday: () => void;
  setDateRangeToThisMonth: () => void;
}

export type AppSettingsStore = AppSettingsState & AppSettingsActions;

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  };
};

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set) => ({
      // State
      selectedStoreId: null,
      dateRange: getDefaultDateRange(),
      theme: 'system',
      sidebarCollapsed: false,

      // Actions
      setSelectedStoreId: (storeId) => set({ selectedStoreId: storeId }),

      setDateRange: (range) => set({ dateRange: range }),

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      resetDateRangeToToday: () => {
        const today = new Date();
        set({
          dateRange: {
            from: today,
            to: today,
          },
        });
      },

      setDateRangeToThisMonth: () => {
        set({ dateRange: getDefaultDateRange() });
      },
    }),
    {
      name: 'app-settings-storage',
      partialize: (state) => ({
        selectedStoreId: state.selectedStoreId,
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        // dateRangeはセッションごとにリセットするため永続化しない
      }),
    }
  )
);
