import { apiClient, apiRequest } from './client';
import { ValidateAddressPayload, ValidateAddressResponse } from '@/types';

/**
 * Address API endpoints
 */
export const addressApi = {
  /**
   * Validate a Georgian address
   */
  validateAddress: (payload: ValidateAddressPayload) =>
    apiRequest<ValidateAddressResponse>(apiClient.post('/api/address/validate', payload)),

  /**
   * Search streets for autocomplete
   */
  searchStreets: (query: string) =>
    apiRequest<{ streets: string[] }>(
      apiClient.get('/api/address/lookup', { params: { q: query } })
    ),
};
