import { apiClient, apiRequest } from './client';
import {
  Order,
  OrdersResponse,
  OrderResponse,
  CreateOrderPayload,
  UpdateOrderPayload,
  SyncResponse,
} from '@/types';

/**
 * Orders API endpoints
 */
export const ordersApi = {
  /**
   * Get all active orders (PENDING, READY, SHIPPED)
   */
  getOrders: () => apiRequest<OrdersResponse>(apiClient.get('/api/orders')),

  /**
   * Get single order by ID
   */
  getOrder: async (id: number): Promise<Order> => {
    const response = await apiRequest<OrderResponse>(apiClient.get(`/api/orders/${id}`))
    return response.order
  },

  /**
   * Create a new order
   */
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await apiRequest<OrderResponse>(apiClient.post('/api/orders', payload))
    return response.order
  },

  /**
   * Update an existing order
   */
  updateOrder: async (id: number, payload: UpdateOrderPayload): Promise<Order> => {
    const response = await apiRequest<OrderResponse>(apiClient.patch(`/api/orders/${id}`, payload))
    return response.order
  },

  /**
   * Delete an order
   */
  deleteOrder: (id: number) =>
    apiRequest<{ success: boolean }>(apiClient.delete(`/api/orders/${id}`)),

  /**
   * Mark order as delivered (for Wolt orders)
   */
  markDelivered: (id: number) =>
    apiRequest<{ success: boolean }>(
      apiClient.post('/api/orders/mark-delivered', { orderId: id })
    ),

  /**
   * Send order to Wolt
   */
  sendToWolt: (id: number) =>
    apiRequest<{ success: boolean; woltOrderId?: string }>(
      apiClient.post(`/api/orders/${id}/send-to-wolt`)
    ),

  /**
   * Sync orders from Firestore
   */
  syncOrders: () => apiRequest<SyncResponse>(apiClient.post('/api/sync-improved')),

  /**
   * Sync carrier statuses from Trackings.ge
   */
  syncCarrierStatus: () =>
    apiRequest<{ success: boolean; updated: number }>(
      apiClient.post('/api/sync-carrier-status')
    ),
};
