import { woltApi } from '@/services/api/wolt'
import { apiClient, apiRequest } from '@/services/api/client'
import { createMockWoltPreorder } from '../../factories'

jest.mock('@/services/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
  apiRequest: jest.fn((promise) => promise),
}))

describe('woltApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getEstimate', () => {
    it('gets delivery estimate for an address', async () => {
      const payload = {
        address: '123 Test St',
        city: 'Tbilisi',
        lat: 41.7151,
        lon: 44.8271,
      }
      const mockResponse = {
        available: true,
        price: 15.00,
        currency: 'GEL',
        eta_minutes: 30,
      }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await woltApi.getEstimate(payload)

      expect(apiClient.post).toHaveBeenCalledWith('/api/wolt/estimate', payload)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('checkAvailability', () => {
    it('checks if Wolt is available for coordinates', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ available: true })

      const result = await woltApi.checkAvailability(41.7151, 44.8271)

      expect(apiClient.post).toHaveBeenCalledWith('/api/wolt/availability', {
        lat: 41.7151,
        lon: 44.8271,
      })
      expect(result).toEqual({ available: true })
    })

    it('returns false when not available', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ available: false })

      const result = await woltApi.checkAvailability(0, 0)

      expect(result).toEqual({ available: false })
    })
  })

  describe('getSettings', () => {
    it('gets Wolt Now settings', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ woltNowEnabled: true })

      const result = await woltApi.getSettings()

      expect(apiClient.get).toHaveBeenCalledWith('/api/wolt/settings')
      expect(result).toEqual({ woltNowEnabled: true })
    })
  })

  describe('toggleWoltNow', () => {
    it('enables Wolt Now', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ success: true })

      const result = await woltApi.toggleWoltNow(true)

      expect(apiClient.post).toHaveBeenCalledWith('/api/wolt/settings', {
        woltNowEnabled: true,
      })
      expect(result).toEqual({ success: true })
    })

    it('disables Wolt Now', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ success: true })

      const result = await woltApi.toggleWoltNow(false)

      expect(apiClient.post).toHaveBeenCalledWith('/api/wolt/settings', {
        woltNowEnabled: false,
      })
      expect(result).toEqual({ success: true })
    })
  })

  describe('getPreorders', () => {
    it('gets all preorders', async () => {
      const mockPreorders = [createMockWoltPreorder(), createMockWoltPreorder()]
      const mockResponse = {
        success: true,
        preorders: mockPreorders,
        pendingCount: 2,
        total: 2,
      }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await woltApi.getPreorders()

      expect(apiClient.get).toHaveBeenCalledWith('/api/wolt/preorder', {
        params: undefined,
      })
      expect(result).toEqual(mockResponse)
    })

    it('gets preorders by status', async () => {
      const mockPreorders = [createMockWoltPreorder({ status: 'pending_warehouse' })]
      const mockResponse = {
        success: true,
        preorders: mockPreorders,
        pendingCount: 1,
        total: 1,
      }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await woltApi.getPreorders('pending_warehouse')

      expect(apiClient.get).toHaveBeenCalledWith('/api/wolt/preorder', {
        params: { status: 'pending_warehouse' },
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('confirmPreorder', () => {
    it('confirms a preorder and sends to Wolt', async () => {
      const mockResponse = {
        success: true,
        preorder: {
          id: 1,
          orderNumber: 'WP0001',
          status: 'sent_to_wolt',
          woltOrderId: 'wolt-123',
          woltTrackingUrl: 'https://wolt.com/tracking/123',
        },
      }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await woltApi.confirmPreorder(1)

      expect(apiClient.post).toHaveBeenCalledWith('/api/wolt/preorder/1/confirm')
      expect(result).toEqual(mockResponse)
    })

    it('handles confirmation error', async () => {
      const mockResponse = {
        success: false,
        error: 'Wolt service unavailable',
      }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await woltApi.confirmPreorder(1)

      expect(result).toEqual(mockResponse)
    })
  })
})
