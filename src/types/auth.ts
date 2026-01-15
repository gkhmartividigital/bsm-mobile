/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login response from /api/auth/mobile-signin
 */
export interface LoginResponse {
  user: User;
  token: string;
}

/**
 * Session response from /api/auth/mobile-session
 */
export interface SessionResponse {
  user: User;
}

/**
 * Auth state
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
