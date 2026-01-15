// API Configuration
export const API_CONFIG = {
  // Replace with your actual API URL
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://shipping-manager-standalone.vercel.app',
  TIMEOUT: 30000,
} as const;

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'BSM Mobile',
  VERSION: '1.0.0',
  BEBIAS_LOCATION: {
    lat: 41.7151,
    lon: 44.8271,
  },
} as const;

// Order Status Configuration
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  READY: 'READY',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Shipping Provider Configuration
export const SHIPPING_PROVIDER = {
  TRACKINGS_GE: 'trackings_ge',
  WOLT: 'wolt',
  MANUAL: 'manual',
} as const;

export type ShippingProvider = (typeof SHIPPING_PROVIDER)[keyof typeof SHIPPING_PROVIDER];

// Carrier Status (from Trackings.ge)
export const CARRIER_STATUS = {
  OFD: 'Out for Delivery',
  INBOUND: 'In Transit',
  SIGN: 'Delivered',
  PICKUP_STARTED: 'Courier Dispatched',
  DELIVERED: 'Delivered',
} as const;

// Status Colors
export const STATUS_COLORS = {
  PENDING: '#f59e0b',
  READY: '#3b82f6',
  SHIPPED: '#8b5cf6',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  PUSH_TOKEN: 'push_token',
  LAST_SYNC: 'last_sync',
} as const;
