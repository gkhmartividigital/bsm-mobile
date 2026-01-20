import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, LoginCredentials } from '@/types';
import { authApi } from '@/services/api';
import { STORAGE_KEYS } from '@/constants/config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading to check session
  error: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signIn(credentials);

      // Store token and user data
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.warn('Failed to clear secure storage:', error);
    }
    set({
      ...initialState,
      isLoading: false,
    });
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);

      if (!token || !userData) {
        set({ ...initialState, isLoading: false });
        return false;
      }

      // Verify token with server
      try {
        const response = await authApi.getSession();
        set({
          user: response.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } catch {
        // Token expired or invalid
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
        set({ ...initialState, isLoading: false });
        return false;
      }
    } catch {
      set({ ...initialState, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
