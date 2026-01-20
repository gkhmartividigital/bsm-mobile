import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useOrders, useOrder } from '@/hooks/useOrders'
import { useOrdersStore } from '@/stores/ordersStore'
import { createMockOrder, createMockOrders, resetFactories } from '../factories'

// Mock the store
jest.mock('@/stores/ordersStore', () => ({
  useOrdersStore: jest.fn(),
}))

describe('useOrders', () => {
  const mockStore = {
    orders: [],
    isLoading: false,
    isRefreshing: false,
    isSyncing: false,
    error: null,
    lastSynced: null,
    fetchOrders: jest.fn(),
    refreshOrders: jest.fn(),
    syncFromFirestore: jest.fn(),
    syncCarrierStatus: jest.fn(),
    getOrdersByStatus: jest.fn(),
    getOrderCounts: jest.fn(() => ({
      pending: 0,
      ready: 0,
      shipped: 0,
      delivered: 0,
      total: 0,
    })),
    clearError: jest.fn(),
  }

  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
    jest.useFakeTimers()
    ;(useOrdersStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore)
      }
      return mockStore
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('fetches orders on mount', async () => {
    renderHook(() => useOrders())

    await waitFor(() => {
      expect(mockStore.fetchOrders).toHaveBeenCalled()
    })
  })

  it('returns orders from store', () => {
    const mockOrders = createMockOrders(3)
    ;(useOrdersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, orders: mockOrders }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useOrders())

    expect(result.current.orders).toEqual(mockOrders)
  })

  it('returns loading state', () => {
    ;(useOrdersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, isLoading: true }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useOrders())

    expect(result.current.isLoading).toBe(true)
  })

  it('returns error state', () => {
    ;(useOrdersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, error: 'Test error' }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useOrders())

    expect(result.current.error).toBe('Test error')
  })

  it('calls refresh function', async () => {
    const { result } = renderHook(() => useOrders())

    await act(async () => {
      await result.current.refresh()
    })

    expect(mockStore.refreshOrders).toHaveBeenCalled()
  })

  it('calls sync function', async () => {
    const { result } = renderHook(() => useOrders())

    await act(async () => {
      await result.current.sync()
    })

    expect(mockStore.syncFromFirestore).toHaveBeenCalled()
  })

  it('returns order counts', () => {
    const mockCounts = { pending: 5, ready: 3, shipped: 2, delivered: 10, total: 20 }
    ;(useOrdersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, getOrderCounts: () => mockCounts }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useOrders())

    expect(result.current.counts).toEqual(mockCounts)
  })

  it('sets up auto-refresh interval', async () => {
    renderHook(() => useOrders())

    // Fast forward 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    expect(mockStore.refreshOrders).toHaveBeenCalled()
  })

  it('cleans up interval on unmount', () => {
    const { unmount } = renderHook(() => useOrders())

    unmount()

    // Fast forward 30 seconds after unmount
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // refreshOrders should not be called after unmount
    expect(mockStore.refreshOrders).toHaveBeenCalledTimes(0)
  })
})

describe('useOrder', () => {
  const mockOrder = createMockOrder({ id: 123 })
  const mockStore = {
    selectedOrder: null,
    isLoading: false,
    error: null,
    getOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    updateOrder: jest.fn(),
    sendToWolt: jest.fn(),
    markDelivered: jest.fn(),
    setSelectedOrder: jest.fn(),
    clearError: jest.fn(),
  }

  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
    ;(useOrdersStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore)
      }
      return mockStore
    })
  })

  it('fetches order on mount', async () => {
    renderHook(() => useOrder(123))

    await waitFor(() => {
      expect(mockStore.getOrder).toHaveBeenCalledWith(123)
    })
  })

  it('returns selected order', () => {
    ;(useOrdersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, selectedOrder: mockOrder }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useOrder(123))

    expect(result.current.order).toEqual(mockOrder)
  })

  it('clears selected order on unmount', () => {
    const { unmount } = renderHook(() => useOrder(123))

    unmount()

    expect(mockStore.setSelectedOrder).toHaveBeenCalledWith(null)
  })

  it('calls updateStatus', async () => {
    mockStore.updateOrderStatus.mockResolvedValue(true)

    const { result } = renderHook(() => useOrder(123))

    await act(async () => {
      await result.current.updateStatus('SHIPPED')
    })

    expect(mockStore.updateOrderStatus).toHaveBeenCalledWith(123, 'SHIPPED')
  })

  it('calls sendToWolt', async () => {
    mockStore.sendToWolt.mockResolvedValue(true)

    const { result } = renderHook(() => useOrder(123))

    await act(async () => {
      await result.current.sendToWolt()
    })

    expect(mockStore.sendToWolt).toHaveBeenCalledWith(123)
  })

  it('calls markDelivered', async () => {
    mockStore.markDelivered.mockResolvedValue(true)

    const { result } = renderHook(() => useOrder(123))

    await act(async () => {
      await result.current.markDelivered()
    })

    expect(mockStore.markDelivered).toHaveBeenCalledWith(123)
  })
})
