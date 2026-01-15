import { apiClient, apiRequest } from './client';
import { LoginCredentials, LoginResponse, SessionResponse } from '@/types';

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Sign in with email and password
   */
  signIn: (credentials: LoginCredentials) =>
    apiRequest<LoginResponse>(apiClient.post('/api/auth/mobile-signin', credentials)),

  /**
   * Verify current session
   */
  getSession: () => apiRequest<SessionResponse>(apiClient.get('/api/auth/mobile-session')),

  /**
   * Register push notification token
   */
  registerPushToken: (token: string, platform: 'ios' | 'android') =>
    apiRequest<{ success: boolean }>(
      apiClient.post('/api/notifications/subscribe', { token, platform })
    ),
};
