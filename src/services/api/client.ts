import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, STORAGE_KEYS } from '@/constants/config';
import { ApiError } from '@/types';

/**
 * Create axios instance with default config
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Response interceptor - handle errors
  client.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: error.response?.status,
      };

      if (error.response) {
        // Server responded with error
        const data = error.response.data as { message?: string; error?: string };
        apiError.message = data.message || data.error || `Error ${error.response.status}`;

        // Handle 401 - unauthorized
        if (error.response.status === 401) {
          await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
          await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
          // You might want to redirect to login here
        }
      } else if (error.request) {
        // Request made but no response
        apiError.message = 'Network error. Please check your connection.';
      } else {
        // Request setup error
        apiError.message = error.message || 'Failed to make request';
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();

/**
 * Helper function to make API calls with error handling
 */
export async function apiRequest<T>(
  request: Promise<{ data: T }>
): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw error;
  }
}
