import { apiRequest } from '@/services/api/client'

// Note: The apiClient uses axios interceptors which are difficult to test directly.
// We test the apiRequest helper function and mock the client in other tests.

describe('apiRequest', () => {
  it('returns data from successful response', async () => {
    const mockData = { orders: [] }
    const mockPromise = Promise.resolve({ data: mockData })

    const result = await apiRequest(mockPromise)

    expect(result).toEqual(mockData)
  })

  it('throws error from failed response', async () => {
    const mockError = { message: 'Network error', status: 500 }
    const mockPromise = Promise.reject(mockError)

    await expect(apiRequest(mockPromise)).rejects.toEqual(mockError)
  })

  it('handles API error response', async () => {
    const mockError = {
      message: 'Unauthorized',
      status: 401,
    }
    const mockPromise = Promise.reject(mockError)

    await expect(apiRequest(mockPromise)).rejects.toEqual(mockError)
  })
})

describe('API Configuration', () => {
  it('uses correct API base URL', () => {
    const { API_CONFIG } = require('@/constants/config')
    expect(API_CONFIG.BASE_URL).toBeDefined()
    expect(typeof API_CONFIG.BASE_URL).toBe('string')
  })

  it('has reasonable timeout', () => {
    const { API_CONFIG } = require('@/constants/config')
    expect(API_CONFIG.TIMEOUT).toBeGreaterThanOrEqual(10000)
    expect(API_CONFIG.TIMEOUT).toBeLessThanOrEqual(60000)
  })
})
