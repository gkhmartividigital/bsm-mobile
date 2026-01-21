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
 * Wolt estimate payload (alias for request)
 */
export type WoltEstimatePayload = WoltEstimateRequest;

/**
 * Wolt estimate response
 */
export interface WoltEstimateResponse {
  available: boolean;
  price?: number;
  currency?: string;
  eta_minutes?: number;
  provider?: 'wolt';
  formatted_address?: string;
  corrected_address?: string;
  is_binding?: boolean;
  coordinates?: {
    lat: number;
    lon: number;
  };
  error?: string;
  error_code?: string;
}

/**
 * Wolt order status
 */
export type WoltStatus =
  | 'RECEIVED'
  | 'CONFIRMED'
  | 'PICKUP_STARTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'CANCELLED';
