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
  notes?: string | null;

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
  notes?: string;
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
  notes?: string;
  sendToShipping?: boolean;
  senderKey?: string;
  lat?: number | null;
  lon?: number | null;
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

/**
 * Wolt estimate request
 */
export interface WoltEstimateRequest {
  address: string;
  city?: string;
  lat?: number;
  lon?: number;
  customerName?: string;
  orderId?: string;
}

/**
 * Wolt estimate response
 */
export interface WoltEstimateResponse {
  available: boolean;
  price?: number;
  currency?: string;
  eta_minutes?: number;
  provider: 'wolt';
  formatted_address?: string;
  corrected_address?: string;
  coordinates?: { lat: number; lon: number };
  is_binding?: boolean;
  error?: string;
  error_code?: string;
}
