import { act } from '@testing-library/react-native'
import { useWoltPreordersStore } from '@/stores/woltPreordersStore'
import { woltApi } from '@/services/api'
import { createMockWoltPreorder, createMockWoltPreorders, resetFactories } from '../factories'

jest.mock('@/services/api', () => ({
  woltApi: {
    getPreorders: jest.fn(),
    confirmPreorder: jest.fn(),
  },
}))

describe('woltPreordersStore', () => {
  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
    // Reset store state
    useWoltPreordersStore.setState({
      preorders: [],
      pendingCount: 0,
      isLoading: false,
      isRefreshing: false,
      isConfirming: null,
      error: null,
      successModal: null,
    })
  })

  describe('initial state', () => {
    it('has correct initial state', () => {
      const state = useWoltPreordersStore.getState()

      expect(state.preorders).toEqual([])
      expect(state.pendingCount).toBe(0)
      expect(state.isLoading).toBe(false)
      expect(state.isRefreshing).toBe(false)
      expect(state.isConfirming).toBeNull()
      expect(state.error).toBeNull()
      expect(state.successModal).toBeNull()
    })
  })

  describe('fetchPreorders', () => {
    it('fetches preorders successfully', async () => {
      const mockPreorders = createMockWoltPreorders(3)
      ;(woltApi.getPreorders as jest.Mock).mockResolvedValue({
        preorders: mockPreorders,
        pendingCount: 3,
      })

      await act(async () => {
        await useWoltPreordersStore.getState().fetchPreorders()
      })

      const state = useWoltPreordersStore.getState()
      expect(state.preorders).toEqual(mockPreorders)
      expect(state.pendingCount).toBe(3)
      expect(state.isLoading).toBe(false)
    })

    it('fetches preorders with status filter', async () => {
      const mockPreorders = createMockWoltPreorders(2, { status: 'pending_warehouse' })
      ;(woltApi.getPreorders as jest.Mock).mockResolvedValue({
        preorders: mockPreorders,
        pendingCount: 2,
      })

      await act(async () => {
        await useWoltPreordersStore.getState().fetchPreorders('pending_warehouse')
      })

      expect(woltApi.getPreorders).toHaveBeenCalledWith('pending_warehouse')
    })

    it('sets loading state while fetching', async () => {
      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      ;(woltApi.getPreorders as jest.Mock).mockReturnValue(promise)

      const fetchPromise = useWoltPreordersStore.getState().fetchPreorders()

      expect(useWoltPreordersStore.getState().isLoading).toBe(true)

      resolvePromise!({ preorders: [], pendingCount: 0 })
      await fetchPromise

      expect(useWoltPreordersStore.getState().isLoading).toBe(false)
    })

    it('handles fetch error', async () => {
      ;(woltApi.getPreorders as jest.Mock).mockRejectedValue({
        message: 'Network error',
      })

      await act(async () => {
        await useWoltPreordersStore.getState().fetchPreorders()
      })

      const state = useWoltPreordersStore.getState()
      expect(state.error).toBe('Network error')
      expect(state.isLoading).toBe(false)
    })
  })

  describe('refreshPreorders', () => {
    it('refreshes preorders successfully', async () => {
      const mockPreorders = createMockWoltPreorders(2)
      ;(woltApi.getPreorders as jest.Mock).mockResolvedValue({
        preorders: mockPreorders,
        pendingCount: 2,
      })

      await act(async () => {
        await useWoltPreordersStore.getState().refreshPreorders()
      })

      const state = useWoltPreordersStore.getState()
      expect(state.preorders).toEqual(mockPreorders)
      expect(state.isRefreshing).toBe(false)
    })

    it('sets refreshing state while refreshing', async () => {
      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      ;(woltApi.getPreorders as jest.Mock).mockReturnValue(promise)

      const refreshPromise = useWoltPreordersStore.getState().refreshPreorders()

      expect(useWoltPreordersStore.getState().isRefreshing).toBe(true)

      resolvePromise!({ preorders: [], pendingCount: 0 })
      await refreshPromise

      expect(useWoltPreordersStore.getState().isRefreshing).toBe(false)
    })
  })

  describe('confirmPreorder', () => {
    it('confirms preorder successfully', async () => {
      const mockPreorder = createMockWoltPreorder({ id: 1 })
      useWoltPreordersStore.setState({
        preorders: [mockPreorder],
        pendingCount: 1,
      })
      ;(woltApi.confirmPreorder as jest.Mock).mockResolvedValue({
        success: true,
        preorder: {
          id: 1,
          orderNumber: 'WP0001',
          status: 'sent_to_wolt',
          woltOrderId: 'wolt-123',
          woltTrackingUrl: 'https://wolt.com/tracking/123',
        },
      })

      await act(async () => {
        const result = await useWoltPreordersStore.getState().confirmPreorder(1)
        expect(result).toBe(true)
      })

      const state = useWoltPreordersStore.getState()
      expect(state.preorders).toHaveLength(0)
      expect(state.pendingCount).toBe(0)
      expect(state.isConfirming).toBeNull()
      expect(state.successModal).toEqual({
        orderNumber: 'WP0001',
        woltOrderId: 'wolt-123',
        woltTrackingUrl: 'https://wolt.com/tracking/123',
      })
    })

    it('sets confirming state while confirming', async () => {
      const mockPreorder = createMockWoltPreorder({ id: 5 })
      useWoltPreordersStore.setState({ preorders: [mockPreorder] })

      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      ;(woltApi.confirmPreorder as jest.Mock).mockReturnValue(promise)

      const confirmPromise = useWoltPreordersStore.getState().confirmPreorder(5)

      expect(useWoltPreordersStore.getState().isConfirming).toBe(5)

      resolvePromise!({ success: true, preorder: { id: 5, orderNumber: 'WP0005', woltOrderId: 'w', woltTrackingUrl: 'u' } })
      await confirmPromise

      expect(useWoltPreordersStore.getState().isConfirming).toBeNull()
    })

    it('handles confirm error from response', async () => {
      ;(woltApi.confirmPreorder as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Wolt service unavailable',
      })

      await act(async () => {
        const result = await useWoltPreordersStore.getState().confirmPreorder(1)
        expect(result).toBe(false)
      })

      const state = useWoltPreordersStore.getState()
      expect(state.error).toBe('Wolt service unavailable')
      expect(state.isConfirming).toBeNull()
    })

    it('handles confirm exception', async () => {
      ;(woltApi.confirmPreorder as jest.Mock).mockRejectedValue({
        message: 'Network error',
      })

      await act(async () => {
        const result = await useWoltPreordersStore.getState().confirmPreorder(1)
        expect(result).toBe(false)
      })

      const state = useWoltPreordersStore.getState()
      expect(state.error).toBe('Network error')
    })
  })

  describe('clearError', () => {
    it('clears error', () => {
      useWoltPreordersStore.setState({ error: 'Some error' })

      act(() => {
        useWoltPreordersStore.getState().clearError()
      })

      expect(useWoltPreordersStore.getState().error).toBeNull()
    })
  })

  describe('closeSuccessModal', () => {
    it('closes success modal', () => {
      useWoltPreordersStore.setState({
        successModal: {
          orderNumber: 'WP0001',
          woltOrderId: 'wolt-123',
          woltTrackingUrl: 'https://wolt.com/tracking/123',
        },
      })

      act(() => {
        useWoltPreordersStore.getState().closeSuccessModal()
      })

      expect(useWoltPreordersStore.getState().successModal).toBeNull()
    })
  })
})
