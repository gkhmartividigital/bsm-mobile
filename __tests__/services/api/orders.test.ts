import { ordersApi } from '@/services/api/orders'
import { apiClient, apiRequest } from '@/services/api/client'
import { createMockOrder } from '../../factories'

jest.mock('@/services/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
  apiRequest: jest.fn((promise) => promise),
}))

describe('ordersApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getOrders', () => {
    it('fetches all orders', async () => {
      const mockOrders = [createMockOrder(), createMockOrder()]
      const mockResponse = { data: { orders: mockOrders } }
      ;(apiClient.get as jest.Mock).mockResolvedValue(mockResponse)
      ;(apiRequest as jest.Mock).mockResolvedValue({ orders: mockOrders })

      const result = await ordersApi.getOrders()

      expect(apiClient.get).toHaveBeenCalledWith('/api/orders')
      expect(result).toEqual({ orders: mockOrders })
    })
  })

  describe('getOrder', () => {
    it('fetches a single order by ID', async () => {
      const mockOrder = createMockOrder({ id: 123 })
      ;(apiRequest as jest.Mock).mockResolvedValue({ order: mockOrder })

      const result = await ordersApi.getOrder(123)

      expect(apiClient.get).toHaveBeenCalledWith('/api/orders/123')
      expect(result).toEqual(mockOrder)
    })
  })

  describe('updateOrder', () => {
    it('updates an existing order', async () => {
      const payload = { status: 'SHIPPED' as const }
      const mockOrder = createMockOrder({ id: 123, status: 'SHIPPED' })
      ;(apiRequest as jest.Mock).mockResolvedValue({ order: mockOrder })

      const result = await ordersApi.updateOrder(123, payload)

      expect(apiClient.patch).toHaveBeenCalledWith('/api/orders/123', payload)
      expect(result).toEqual(mockOrder)
    })
  })

  describe('deleteOrder', () => {
    it('deletes an order', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ success: true })

      const result = await ordersApi.deleteOrder(123)

      expect(apiClient.delete).toHaveBeenCalledWith('/api/orders/123')
      expect(result).toEqual({ success: true })
    })
  })

  describe('markDelivered', () => {
    it('marks an order as delivered', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ success: true })

      const result = await ordersApi.markDelivered(123)

      expect(apiClient.post).toHaveBeenCalledWith('/api/orders/mark-delivered', {
        orderId: 123,
      })
      expect(result).toEqual({ success: true })
    })
  })

  describe('sendToWolt', () => {
    it('sends an order to Wolt', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({
        success: true,
        woltOrderId: 'wolt-123',
      })

      const result = await ordersApi.sendToWolt(123)

      expect(apiClient.post).toHaveBeenCalledWith('/api/orders/123/send-to-wolt')
      expect(result).toEqual({ success: true, woltOrderId: 'wolt-123' })
    })
  })

  describe('syncOrders', () => {
    it('syncs orders from Firestore', async () => {
      const mockResponse = {
        success: true,
        synced: 5,
        skipped: 2,
        deliveredSkipped: 1,
        message: 'Sync complete',
      }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await ordersApi.syncOrders()

      expect(apiClient.post).toHaveBeenCalledWith('/api/sync-improved')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('syncCarrierStatus', () => {
    it('syncs carrier statuses', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ success: true, updated: 3 })

      const result = await ordersApi.syncCarrierStatus()

      expect(apiClient.post).toHaveBeenCalledWith('/api/sync-carrier-status')
      expect(result).toEqual({ success: true, updated: 3 })
    })
  })
})
