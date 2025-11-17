import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      login: async (email: string, password: string) => {
        try {
          // TODO: Replace with actual API call
          // const response = await fetch('/api/auth/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, password }),
          // });
          // const data = await response.json();

          // Mock implementation for development
          const mockUser: User = {
            id: '1',
            email,
            name: 'テストユーザー',
            role: 'admin',
          };

          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        // TODO: Call API logout endpoint
        // fetch('/api/auth/logout', { method: 'POST' });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user, isLoading: false });
      },

      checkAuth: () => {
        // TODO: Verify token with backend
        // const token = localStorage.getItem('token');
        // if (token) {
        //   fetch('/api/auth/me')
        //     .then(res => res.json())
        //     .then(user => set({ user, isAuthenticated: true, isLoading: false }))
        //     .catch(() => set({ user: null, isAuthenticated: false, isLoading: false }));
        // } else {
        //   set({ isLoading: false });
        // }

        // Mock implementation
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
