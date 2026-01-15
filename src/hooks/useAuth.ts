import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/stores';

/**
 * Hook to manage authentication state and routing
 */
export function useAuth() {
  const { user, token, isAuthenticated, isLoading, error, login, logout, checkSession, clearError } =
    useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkSession,
    clearError,
  };
}

/**
 * Hook to protect routes based on authentication
 * Used in the root layout to redirect unauthenticated users
 */
export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    // Check session on mount
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return { isLoading, isAuthenticated };
}
