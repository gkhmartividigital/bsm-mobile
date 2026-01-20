import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import OrdersScreen from '../../app/(tabs)/index'
import { useOrders } from '@/hooks'
import { createMockOrder, createMockOrders, resetFactories } from '../factories'

// Mock hooks
jest.mock('@/hooks', () => ({
  useOrders: jest.fn(),
}))

// Mock react-native-reanimated with chainable animation objects
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native')

  // Create chainable animation config objects
  const createChainable = (): Record<string, () => unknown> => {
    const obj: Record<string, () => unknown> = {}
    obj.duration = () => createChainable()
    obj.delay = () => createChainable()
    obj.springify = () => createChainable()
    return obj
  }

  // Create a proper View component with displayName
  const AnimatedView = RN.View
  AnimatedView.displayName = 'AnimatedView'

  return {
    __esModule: true,
    default: { View: AnimatedView },
    FadeIn: createChainable(),
    FadeOut: createChainable(),
    Layout: createChainable(),
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn(() => ({})),
  }
})

// Mock safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

describe('OrdersScreen', () => {
  const defaultMockHook = {
    orders: [],
    isLoading: false,
    isRefreshing: false,
    isSyncing: false,
    error: null,
    refresh: jest.fn(),
    sync: jest.fn(),
    counts: { pending: 0, ready: 0, shipped: 0, delivered: 0, total: 0 },
    clearError: jest.fn(),
  }

  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
    ;(useOrders as jest.Mock).mockReturnValue(defaultMockHook)
  })

  describe('loading state', () => {
    it('shows loading screen when loading without orders', () => {
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        isLoading: true,
        orders: [],
      })

      render(<OrdersScreen />)

      expect(screen.getByText('Loading orders...')).toBeTruthy()
    })

    it('does not show loading screen when has orders', () => {
      const orders = createMockOrders(3)
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        isLoading: true,
        orders,
      })

      render(<OrdersScreen />)

      expect(screen.queryByText('Loading orders...')).toBeNull()
    })
  })

  describe('error state', () => {
    it('shows error state when error without orders', () => {
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        error: 'Network error',
        orders: [],
      })

      render(<OrdersScreen />)

      expect(screen.getByText('Something went wrong')).toBeTruthy()
      expect(screen.getByText('Network error')).toBeTruthy()
      expect(screen.getByText('Try Again')).toBeTruthy()
    })

    it('calls retry on error button press', () => {
      const clearError = jest.fn()
      const refresh = jest.fn()
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        error: 'Network error',
        orders: [],
        clearError,
        refresh,
      })

      render(<OrdersScreen />)

      fireEvent.press(screen.getByText('Try Again'))

      expect(clearError).toHaveBeenCalled()
      expect(refresh).toHaveBeenCalled()
    })
  })

  describe('empty state', () => {
    it('shows empty state when no orders', () => {
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders: [],
      })

      render(<OrdersScreen />)

      expect(screen.getByText('No orders yet')).toBeTruthy()
    })
  })

  describe('orders list', () => {
    it('renders orders', () => {
      const orders = [
        createMockOrder({ customerName: 'John Doe' }),
        createMockOrder({ customerName: 'Jane Smith' }),
      ]
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders,
        counts: { ...defaultMockHook.counts, total: 2 },
      })

      render(<OrdersScreen />)

      expect(screen.getByText('John Doe')).toBeTruthy()
      expect(screen.getByText('Jane Smith')).toBeTruthy()
    })

    it('shows order count', () => {
      const orders = createMockOrders(5)
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders,
        counts: { ...defaultMockHook.counts, total: 5 },
      })

      render(<OrdersScreen />)

      expect(screen.getByText('5 active orders')).toBeTruthy()
    })
  })

  describe('status tabs', () => {
    it('renders status tabs', () => {
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders: createMockOrders(3),
        counts: { pending: 1, ready: 1, shipped: 1, delivered: 0, total: 3 },
      })

      render(<OrdersScreen />)

      // Check that tabs are rendered by looking for multiple occurrences of tab texts
      expect(screen.getByText('All')).toBeTruthy()
      // Use getAllByText since status text may appear in both tabs and order badges
      expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Ready').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Shipped').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Delivered').length).toBeGreaterThan(0)
    })

    it('filters orders by status', () => {
      const orders = [
        createMockOrder({ customerName: 'Pending User', status: 'PENDING' }),
        createMockOrder({ customerName: 'Shipped User', status: 'SHIPPED' }),
      ]
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders,
        counts: { pending: 1, ready: 0, shipped: 1, delivered: 0, total: 2 },
      })

      render(<OrdersScreen />)

      // Initially shows all orders
      expect(screen.getByText('Pending User')).toBeTruthy()
      expect(screen.getByText('Shipped User')).toBeTruthy()

      // Filter by SHIPPED status - find all "Shipped" texts and press the first one (the tab)
      const shippedElements = screen.getAllByText('Shipped')
      fireEvent.press(shippedElements[0])

      expect(screen.queryByText('Pending User')).toBeNull()
      expect(screen.getByText('Shipped User')).toBeTruthy()
    })
  })

  describe('sync', () => {
    it('calls sync when sync button pressed', () => {
      const sync = jest.fn()
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders: createMockOrders(1),
        sync,
      })

      render(<OrdersScreen />)

      fireEvent.press(screen.getByText('Sync'))

      expect(sync).toHaveBeenCalled()
    })

    it('disables sync button when syncing', () => {
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders: createMockOrders(1),
        isSyncing: true,
      })

      render(<OrdersScreen />)

      expect(screen.queryByText('Sync')).toBeNull()
    })
  })

  describe('refresh', () => {
    it('calls refresh on pull to refresh', () => {
      const refresh = jest.fn()
      ;(useOrders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        orders: createMockOrders(1),
        refresh,
      })

      render(<OrdersScreen />)

      const flatList = screen.UNSAFE_getByType(require('react-native').FlatList)
      flatList.props.refreshControl.props.onRefresh()

      expect(refresh).toHaveBeenCalled()
    })
  })
})
