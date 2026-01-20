import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { OrderCard } from '@/components/orders/OrderCard'
import { createMockOrder, resetFactories } from '../../factories'

// Mock expo-router
const mockPush = jest.fn()
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('OrderCard', () => {
  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders order ID', () => {
      const order = createMockOrder({ id: 123, externalId: 'EXT-123' })
      render(<OrderCard order={order} />)
      expect(screen.getByText('#EXT-123')).toBeTruthy()
    })

    it('renders order ID when no external ID', () => {
      const order = createMockOrder({ id: 456, externalId: null })
      render(<OrderCard order={order} />)
      expect(screen.getByText('#456')).toBeTruthy()
    })

    it('renders customer name', () => {
      const order = createMockOrder({ customerName: 'John Doe' })
      render(<OrderCard order={order} />)
      expect(screen.getByText('John Doe')).toBeTruthy()
    })

    it('renders formatted phone number', () => {
      const order = createMockOrder({ customerPhone: '555123456' })
      render(<OrderCard order={order} />)
      expect(screen.getByText('555 123 456')).toBeTruthy()
    })

    it('renders customer address', () => {
      const order = createMockOrder({ customerAddress: '123 Main Street' })
      render(<OrderCard order={order} />)
      expect(screen.getByText('123 Main Street')).toBeTruthy()
    })

    it('renders product name and quantity', () => {
      const order = createMockOrder({ productName: 'Test Product', quantity: 3 })
      render(<OrderCard order={order} />)
      expect(screen.getByText('Test Product x3')).toBeTruthy()
    })

    it('renders status badge', () => {
      const order = createMockOrder({ status: 'PENDING' })
      render(<OrderCard order={order} />)
      expect(screen.getByText('Pending')).toBeTruthy()
    })

    it('renders provider badge', () => {
      const order = createMockOrder({ shippingProvider: 'wolt' })
      render(<OrderCard order={order} />)
      expect(screen.getByText('Wolt')).toBeTruthy()
    })
  })

  describe('time slot', () => {
    it('renders time slot when scheduled', () => {
      const order = createMockOrder({
        scheduleType: 'scheduled',
        timeSlot: '10:00-12:00',
        slotDate: '2024-01-15',
      })
      render(<OrderCard order={order} />)
      expect(screen.getByText(/Scheduled:/)).toBeTruthy()
    })

    it('does not render time slot when not scheduled', () => {
      const order = createMockOrder({
        scheduleType: 'immediate',
        timeSlot: null,
      })
      render(<OrderCard order={order} />)
      expect(screen.queryByText(/Scheduled:/)).toBeNull()
    })
  })

  describe('wolt info', () => {
    it('renders Wolt price when provider is wolt', () => {
      const order = createMockOrder({
        shippingProvider: 'wolt',
        woltPrice: 15.50,
      })
      render(<OrderCard order={order} />)
      expect(screen.getByText('Wolt: 15.5 GEL')).toBeTruthy()
    })

    it('does not render Wolt price when provider is not wolt', () => {
      const order = createMockOrder({
        shippingProvider: 'trackings_ge',
        woltPrice: 15.50,
      })
      render(<OrderCard order={order} />)
      expect(screen.queryByText(/Wolt:/)).toBeNull()
    })
  })

  describe('carrier status', () => {
    it('renders carrier status text when available', () => {
      const order = createMockOrder({
        carrierStatusText: 'Out for delivery',
      })
      render(<OrderCard order={order} />)
      expect(screen.getByText('Out for delivery')).toBeTruthy()
    })

    it('does not render carrier status when not available', () => {
      const order = createMockOrder({ carrierStatusText: null })
      render(<OrderCard order={order} />)
      expect(screen.queryByText('Out for delivery')).toBeNull()
    })
  })

  describe('navigation', () => {
    it('navigates to order detail on press', () => {
      const order = createMockOrder({ id: 999 })
      render(<OrderCard order={order} />)

      fireEvent.press(screen.getByText(order.customerName))

      expect(mockPush).toHaveBeenCalledWith('/(tabs)/orders/999')
    })
  })

  describe('different statuses', () => {
    it.each([
      ['PENDING', 'Pending'],
      ['READY', 'Ready'],
      ['SHIPPED', 'Shipped'],
      ['DELIVERED', 'Delivered'],
      ['CANCELLED', 'Cancelled'],
    ] as const)('renders %s status correctly', (status, label) => {
      const order = createMockOrder({ status })
      render(<OrderCard order={order} />)
      expect(screen.getByText(label)).toBeTruthy()
    })
  })
})
