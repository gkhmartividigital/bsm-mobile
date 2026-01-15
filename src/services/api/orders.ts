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
  getOrder: (id: number) => apiRequest<Order>(apiClient.get(`/api/orders/${id}`)),

  /**
   * Create a new order
   */
  createOrder: (payload: CreateOrderPayload) =>
    apiRequest<Order>(apiClient.post('/api/orders', payload)),

  /**
   * Update an existing order
   */
  updateOrder: (id: number, payload: UpdateOrderPayload) =>
    apiRequest<Order>(apiClient.patch(`/api/orders/${id}`, payload)),

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
