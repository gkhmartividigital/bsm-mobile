/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * API Error
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Sync response
 */
export interface SyncResponse {
  success: boolean;
  synced: number;
  skipped: number;
  deliveredSkipped: number;
  message: string;
}
