/**
 * Wolt estimate request
 */
export interface WoltEstimatePayload {
  address: string;
  city?: string;
  lat?: number;
  lon?: number;
}

/**
 * Wolt estimate response
 */
export interface WoltEstimateResponse {
  available: boolean;
  price?: number;
  currency?: string;
  eta_minutes?: number;
  is_binding?: boolean;
  coordinates?: {
    lat: number;
    lon: number;
  };
  error?: string;
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
