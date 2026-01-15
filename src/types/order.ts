import { OrderStatus, ShippingProvider } from '@/constants/config'

// Re-export for convenience
export type { OrderStatus, ShippingProvider } from '@/constants/config'

/**
 * Order model matching the backend Prisma schema
 */
export interface Order {
  id: number;
  externalId?: string | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  productName: string;
  quantity: number;

  // Status
  status: OrderStatus;
  trackingCode?: string | null;
  trackingsOrderId?: number | null;
  shippingProvider?: ShippingProvider | null;
  shippingMethod?: string | null;

  // Wolt Fields
  lat?: number | null;
  lon?: number | null;
  woltPrice?: number | null;
  woltEta?: number | null;
  woltPickupEta?: number | null;
  woltOrderId?: string | null;
  woltTrackingUrl?: string | null;
  woltStatus?: string | null;
  sessionId?: string | null;

  // Time Slot
  scheduleType?: 'immediate' | 'scheduled' | null;
  timeSlot?: string | null;
  slotDate?: string | null;
  slotStart?: string | null;
  slotEnd?: string | null;

  // Carrier Status
  carrierStatus?: string | null;
  carrierStatusText?: string | null;
  estimatedDelivery?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Order creation payload
 */
export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city?: string;
  productName: string;
  quantity?: number;
}

/**
 * Order update payload
 */
export interface UpdateOrderPayload {
  status?: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  city?: string;
  productName?: string;
  quantity?: number;
  sendToShipping?: boolean;
  senderKey?: string;
}

/**
 * Orders list response
 */
export interface OrdersResponse {
  orders: Order[];
}

/**
 * Single order response
 */
export interface OrderResponse {
  order: Order;
}

/**
 * Order stats response
 */
export interface OrderStatsResponse {
  pending: number;
  ready: number;
  shipped: number;
  delivered: number;
  total: number;
}
