import { act } from '@testing-library/react-native'
import { useOrdersStore } from '@/stores/ordersStore'
import { ordersApi } from '@/services/api'
import { createMockOrder, createMockOrders, resetFactories } from '../factories'

jest.mock('@/services/api', () => ({
  ordersApi: {
    getOrders: jest.fn(),
    getOrder: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
    markDelivered: jest.fn(),
    sendToWolt: jest.fn(),
    syncOrders: jest.fn(),
    syncCarrierStatus: jest.fn(),
  },
}))

describe('ordersStore', () => {
  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
    // Reset store state
    useOrdersStore.setState({
      orders: [],
      selectedOrder: null,
      isLoading: false,
      isRefreshing: false,
      isSyncing: false,
      error: null,
      lastSynced: null,
    })
  })

  describe('initial state', () => {
    it('has correct initial state', () => {
      const state = useOrdersStore.getState()

      expect(state.orders).toEqual([])
      expect(state.selectedOrder).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.isRefreshing).toBe(false)
      expect(state.isSyncing).toBe(false)
      expect(state.error).toBeNull()
      expect(state.lastSynced).toBeNull()
    })
  })

  describe('fetchOrders', () => {
    it('fetches orders successfully', async () => {
      const mockOrders = createMockOrders(3)
      ;(ordersApi.getOrders as jest.Mock).mockResolvedValue({ orders: mockOrders })

      await act(async () => {
        await useOrdersStore.getState().fetchOrders()
      })

      const state = useOrdersStore.getState()
      expect(state.orders).toEqual(mockOrders)
      expect(state.isLoading).toBe(false)
      expect(state.lastSynced).toBeInstanceOf(Date)
    })

    it('sets loading state while fetching', async () => {
      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      ;(ordersApi.getOrders as jest.Mock).mockReturnValue(promise)

      const fetchPromise = useOrdersStore.getState().fetchOrders()

      expect(useOrdersStore.getState().isLoading).toBe(true)

      resolvePromise!({ orders: [] })
      await fetchPromise

      expect(useOrdersStore.getState().isLoading).toBe(false)
    })

    it('handles fetch error', async () => {
      ;(ordersApi.getOrders as jest.Mock).mockRejectedValue({
        message: 'Network error',
      })

      await act(async () => {
        await useOrdersStore.getState().fetchOrders()
      })

      const state = useOrdersStore.getState()
      expect(state.error).toBe('Network error')
      expect(state.isLoading).toBe(false)
    })
  })

  describe('refreshOrders', () => {
    it('refreshes orders successfully', async () => {
      const mockOrders = createMockOrders(2)
      ;(ordersApi.getOrders as jest.Mock).mockResolvedValue({ orders: mockOrders })

      await act(async () => {
        await useOrdersStore.getState().refreshOrders()
      })

      const state = useOrdersStore.getState()
      expect(state.orders).toEqual(mockOrders)
      expect(state.isRefreshing).toBe(false)
    })

    it('sets refreshing state while refreshing', async () => {
      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      ;(ordersApi.getOrders as jest.Mock).mockReturnValue(promise)

      const refreshPromise = useOrdersStore.getState().refreshOrders()

      expect(useOrdersStore.getState().isRefreshing).toBe(true)

      resolvePromise!({ orders: [] })
      await refreshPromise

      expect(useOrdersStore.getState().isRefreshing).toBe(false)
    })
  })

  describe('getOrder', () => {
    it('fetches single order successfully', async () => {
      const mockOrder = createMockOrder({ id: 123 })
      ;(ordersApi.getOrder as jest.Mock).mockResolvedValue(mockOrder)

      await act(async () => {
        const result = await useOrdersStore.getState().getOrder(123)
        expect(result).toEqual(mockOrder)
      })

      expect(useOrdersStore.getState().selectedOrder).toEqual(mockOrder)
    })

    it('handles fetch error', async () => {
      ;(ordersApi.getOrder as jest.Mock).mockRejectedValue(new Error('Not found'))

      await act(async () => {
        const result = await useOrdersStore.getState().getOrder(999)
        expect(result).toBeNull()
      })

      expect(useOrdersStore.getState().error).toBe('Not found')
    })
  })

  describe('updateOrderStatus', () => {
    it('updates order status successfully', async () => {
      const mockOrder = createMockOrder({ id: 1, status: 'PENDING' })
      useOrdersStore.setState({ orders: [mockOrder], selectedOrder: mockOrder })
      ;(ordersApi.updateOrder as jest.Mock).mockResolvedValue({})

      await act(async () => {
        const result = await useOrdersStore.getState().updateOrderStatus(1, 'SHIPPED')
        expect(result).toBe(true)
      })

      const state = useOrdersStore.getState()
      expect(state.orders[0].status).toBe('SHIPPED')
      expect(state.selectedOrder?.status).toBe('SHIPPED')
    })

    it('handles update error', async () => {
      const mockOrder = createMockOrder({ id: 1, status: 'PENDING' })
      useOrdersStore.setState({ orders: [mockOrder] })
      ;(ordersApi.updateOrder as jest.Mock).mockRejectedValue(new Error('Update failed'))

      await act(async () => {
        const result = await useOrdersStore.getState().updateOrderStatus(1, 'SHIPPED')
        expect(result).toBe(false)
      })

      expect(useOrdersStore.getState().error).toBe('Update failed')
    })
  })

  describe('updateOrder', () => {
    it('updates order successfully', async () => {
      const mockOrder = createMockOrder({ id: 1 })
      const updatedOrder = { ...mockOrder, customerName: 'Updated Name' }
      useOrdersStore.setState({ orders: [mockOrder] })
      ;(ordersApi.updateOrder as jest.Mock).mockResolvedValue(updatedOrder)

      await act(async () => {
        const result = await useOrdersStore.getState().updateOrder(1, { customerName: 'Updated Name' })
        expect(result).toBe(true)
      })

      expect(useOrdersStore.getState().orders[0].customerName).toBe('Updated Name')
    })
  })

  describe('sendToWolt', () => {
    it('sends order to Wolt successfully', async () => {
      const mockOrder = createMockOrder({ id: 1 })
      useOrdersStore.setState({ orders: [mockOrder] })
      ;(ordersApi.sendToWolt as jest.Mock).mockResolvedValue({ success: true })
      ;(ordersApi.getOrders as jest.Mock).mockResolvedValue({ orders: [mockOrder] })

      await act(async () => {
        const result = await useOrdersStore.getState().sendToWolt(1)
        expect(result).toBe(true)
      })
    })

    it('handles send to Wolt error', async () => {
      ;(ordersApi.sendToWolt as jest.Mock).mockRejectedValue(new Error('Wolt unavailable'))

      await act(async () => {
        const result = await useOrdersStore.getState().sendToWolt(1)
        expect(result).toBe(false)
      })

      expect(useOrdersStore.getState().error).toBe('Wolt unavailable')
    })
  })

  describe('markDelivered', () => {
    it('marks order as delivered', async () => {
      const mockOrder = createMockOrder({ id: 1, status: 'SHIPPED' })
      useOrdersStore.setState({ orders: [mockOrder], selectedOrder: mockOrder })
      ;(ordersApi.markDelivered as jest.Mock).mockResolvedValue({})

      await act(async () => {
        const result = await useOrdersStore.getState().markDelivered(1)
        expect(result).toBe(true)
      })

      const state = useOrdersStore.getState()
      expect(state.orders[0].status).toBe('DELIVERED')
      expect(state.selectedOrder?.status).toBe('DELIVERED')
    })
  })

  describe('syncFromFirestore', () => {
    it('syncs orders from Firestore', async () => {
      const mockOrders = createMockOrders(2)
      ;(ordersApi.syncOrders as jest.Mock).mockResolvedValue({})
      ;(ordersApi.getOrders as jest.Mock).mockResolvedValue({ orders: mockOrders })

      await act(async () => {
        await useOrdersStore.getState().syncFromFirestore()
      })

      expect(ordersApi.syncOrders).toHaveBeenCalled()
      expect(useOrdersStore.getState().isSyncing).toBe(false)
    })

    it('sets syncing state while syncing', async () => {
      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      ;(ordersApi.syncOrders as jest.Mock).mockReturnValue(promise)

      const syncPromise = useOrdersStore.getState().syncFromFirestore()

      expect(useOrdersStore.getState().isSyncing).toBe(true)

      resolvePromise!({})
      ;(ordersApi.getOrders as jest.Mock).mockResolvedValue({ orders: [] })
      await syncPromise

      expect(useOrdersStore.getState().isSyncing).toBe(false)
    })
  })

  describe('syncCarrierStatus', () => {
    it('syncs carrier status', async () => {
      ;(ordersApi.syncCarrierStatus as jest.Mock).mockResolvedValue({})
      ;(ordersApi.getOrders as jest.Mock).mockResolvedValue({ orders: [] })

      await act(async () => {
        await useOrdersStore.getState().syncCarrierStatus()
      })

      expect(ordersApi.syncCarrierStatus).toHaveBeenCalled()
    })
  })

  describe('setSelectedOrder', () => {
    it('sets selected order', () => {
      const mockOrder = createMockOrder()

      act(() => {
        useOrdersStore.getState().setSelectedOrder(mockOrder)
      })

      expect(useOrdersStore.getState().selectedOrder).toEqual(mockOrder)
    })

    it('clears selected order', () => {
      const mockOrder = createMockOrder()
      useOrdersStore.setState({ selectedOrder: mockOrder })

      act(() => {
        useOrdersStore.getState().setSelectedOrder(null)
      })

      expect(useOrdersStore.getState().selectedOrder).toBeNull()
    })
  })

  describe('clearError', () => {
    it('clears error', () => {
      useOrdersStore.setState({ error: 'Some error' })

      act(() => {
        useOrdersStore.getState().clearError()
      })

      expect(useOrdersStore.getState().error).toBeNull()
    })
  })

  describe('getOrdersByStatus', () => {
    it('filters orders by status', () => {
      const orders = [
        createMockOrder({ status: 'PENDING' }),
        createMockOrder({ status: 'SHIPPED' }),
        createMockOrder({ status: 'PENDING' }),
        createMockOrder({ status: 'DELIVERED' }),
      ]
      useOrdersStore.setState({ orders })

      const pendingOrders = useOrdersStore.getState().getOrdersByStatus('PENDING')

      expect(pendingOrders).toHaveLength(2)
      expect(pendingOrders.every((o) => o.status === 'PENDING')).toBe(true)
    })

    it('returns empty array when no matching orders', () => {
      const orders = [createMockOrder({ status: 'PENDING' })]
      useOrdersStore.setState({ orders })

      const deliveredOrders = useOrdersStore.getState().getOrdersByStatus('DELIVERED')

      expect(deliveredOrders).toHaveLength(0)
    })
  })

  describe('getOrderCounts', () => {
    it('returns correct counts', () => {
      const orders = [
        createMockOrder({ status: 'PENDING' }),
        createMockOrder({ status: 'PENDING' }),
        createMockOrder({ status: 'READY' }),
        createMockOrder({ status: 'SHIPPED' }),
        createMockOrder({ status: 'SHIPPED' }),
        createMockOrder({ status: 'SHIPPED' }),
        createMockOrder({ status: 'DELIVERED' }),
      ]
      useOrdersStore.setState({ orders })

      const counts = useOrdersStore.getState().getOrderCounts()

      expect(counts).toEqual({
        pending: 2,
        ready: 1,
        shipped: 3,
        delivered: 1,
        total: 7,
      })
    })

    it('returns zeros when no orders', () => {
      useOrdersStore.setState({ orders: [] })

      const counts = useOrdersStore.getState().getOrderCounts()

      expect(counts).toEqual({
        pending: 0,
        ready: 0,
        shipped: 0,
        delivered: 0,
        total: 0,
      })
    })
  })
})
