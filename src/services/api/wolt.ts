import { apiClient, apiRequest } from './client'
import {
  WoltEstimatePayload,
  WoltEstimateResponse,
  WoltPreordersResponse,
  WoltConfirmResponse,
} from '@/types'

/**
 * Wolt API endpoints
 */
export const woltApi = {
  /**
   * Get delivery estimate for an address
   */
  getEstimate: (payload: WoltEstimatePayload) =>
    apiRequest<WoltEstimateResponse>(apiClient.post('/api/wolt/estimate', payload)),

  /**
   * Check if Wolt is available for an address
   */
  checkAvailability: (lat: number, lon: number) =>
    apiRequest<{ available: boolean }>(
      apiClient.post('/api/wolt/availability', { lat, lon })
    ),

  /**
   * Get Wolt Now settings
   */
  getSettings: () =>
    apiRequest<{ woltNowEnabled: boolean }>(apiClient.get('/api/wolt/settings')),

  /**
   * Toggle Wolt Now availability
   */
  toggleWoltNow: (enabled: boolean) =>
    apiRequest<{ success: boolean }>(
      apiClient.post('/api/wolt/settings', { woltNowEnabled: enabled })
    ),

  /**
   * Get Wolt preorders
   */
  getPreorders: (status?: string) =>
    apiRequest<WoltPreordersResponse>(
      apiClient.get('/api/wolt/preorder', { params: status ? { status } : undefined })
    ),

  /**
   * Confirm a preorder and send to Wolt
   */
  confirmPreorder: (id: number) =>
    apiRequest<WoltConfirmResponse>(
      apiClient.post(`/api/wolt/preorder/${id}/confirm`)
    ),
}
