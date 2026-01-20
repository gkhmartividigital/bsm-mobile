import { Order, OrderStatus, WoltPreorder, WoltPreorderStatus, User } from '@/types'

let orderIdCounter = 1
let preorderIdCounter = 1

/**
 * Create a mock Order
 */
export function createMockOrder(overrides: Partial<Order> = {}): Order {
  const id = orderIdCounter++
  return {
    id,
    externalId: `EXT-${id}`,
    customerName: 'Test Customer',
    customerPhone: '555123456',
    customerAddress: '123 Test Street, Tbilisi',
    city: 'Tbilisi',
    productName: 'Test Product',
    quantity: 1,
    notes: null,
    status: 'PENDING' as OrderStatus,
    trackingCode: `TRK${id}`,
    trackingsOrderId: null,
    shippingProvider: 'trackings_ge',
    shippingMethod: 'standard',
    lat: 41.7151,
    lon: 44.8271,
    woltPrice: null,
    woltEta: null,
    woltPickupEta: null,
    woltOrderId: null,
    woltTrackingUrl: null,
    woltStatus: null,
    sessionId: null,
    scheduleType: null,
    timeSlot: null,
    slotDate: null,
    slotStart: null,
    slotEnd: null,
    carrierStatus: null,
    carrierStatusText: null,
    estimatedDelivery: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create multiple mock orders
 */
export function createMockOrders(count: number, overrides: Partial<Order> = {}): Order[] {
  return Array.from({ length: count }, () => createMockOrder(overrides))
}

/**
 * Create mock orders grouped by status
 */
export const mockOrdersByStatus = {
  pending: createMockOrders(3, { status: 'PENDING' }),
  ready: createMockOrders(2, { status: 'READY' }),
  shipped: createMockOrders(4, { status: 'SHIPPED' }),
  delivered: createMockOrders(5, { status: 'DELIVERED' }),
}

/**
 * Create a mock Wolt preorder
 */
export function createMockWoltPreorder(overrides: Partial<WoltPreorder> = {}): WoltPreorder {
  const id = preorderIdCounter++
  return {
    id,
    orderNumber: `WP${String(id).padStart(4, '0')}`,
    status: 'pending_warehouse' as WoltPreorderStatus,
    customerName: 'Wolt Customer',
    customerPhone: '555987654',
    address: '456 Wolt Street, Tbilisi',
    lat: 41.7100,
    lon: 44.8200,
    productName: 'Wolt Product',
    quantity: 2,
    productPrice: 25.00,
    deliveryPrice: 5.00,
    deliveryTime: undefined,
    deliveryEta: 30,
    deliveryInstructions: undefined,
    total: 55.00,
    woltOrderId: undefined,
    woltTrackingUrl: undefined,
    createdAt: new Date().toISOString(),
    confirmedAt: undefined,
    sentToWoltAt: undefined,
    ...overrides,
  }
}

/**
 * Create multiple mock Wolt preorders
 */
export function createMockWoltPreorders(
  count: number,
  overrides: Partial<WoltPreorder> = {}
): WoltPreorder[] {
  return Array.from({ length: count }, () => createMockWoltPreorder(overrides))
}

/**
 * Create a mock user
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  }
}

/**
 * Reset ID counters (call in beforeEach if needed)
 */
export function resetFactories(): void {
  orderIdCounter = 1
  preorderIdCounter = 1
}
