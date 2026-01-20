import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useWoltPreorders } from '@/hooks/useWoltPreorders'
import { useWoltPreordersStore } from '@/stores/woltPreordersStore'
import { createMockWoltPreorder, createMockWoltPreorders, resetFactories } from '../factories'

// Mock the store
jest.mock('@/stores/woltPreordersStore', () => ({
  useWoltPreordersStore: jest.fn(),
}))

describe('useWoltPreorders', () => {
  const mockStore = {
    preorders: [],
    pendingCount: 0,
    isLoading: false,
    isRefreshing: false,
    isConfirming: null,
    error: null,
    successModal: null,
    fetchPreorders: jest.fn(),
    refreshPreorders: jest.fn(),
    confirmPreorder: jest.fn(),
    clearError: jest.fn(),
    closeSuccessModal: jest.fn(),
  }

  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
    jest.useFakeTimers()
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore)
      }
      return mockStore
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('fetches preorders on mount', async () => {
    renderHook(() => useWoltPreorders())

    await waitFor(() => {
      expect(mockStore.fetchPreorders).toHaveBeenCalled()
    })
  })

  it('returns preorders from store', () => {
    const mockPreorders = createMockWoltPreorders(3)
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, preorders: mockPreorders }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useWoltPreorders())

    expect(result.current.preorders).toEqual(mockPreorders)
  })

  it('returns pendingCount from store', () => {
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, pendingCount: 5 }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useWoltPreorders())

    expect(result.current.pendingCount).toBe(5)
  })

  it('returns loading state', () => {
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, isLoading: true }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useWoltPreorders())

    expect(result.current.isLoading).toBe(true)
  })

  it('returns refreshing state', () => {
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, isRefreshing: true }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useWoltPreorders())

    expect(result.current.isRefreshing).toBe(true)
  })

  it('returns confirming state', () => {
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, isConfirming: 5 }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useWoltPreorders())

    expect(result.current.isConfirming).toBe(5)
  })

  it('returns error state', () => {
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, error: 'Test error' }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useWoltPreorders())

    expect(result.current.error).toBe('Test error')
  })

  it('returns success modal data', () => {
    const modalData = {
      orderNumber: 'WP0001',
      woltOrderId: 'wolt-123',
      woltTrackingUrl: 'https://wolt.com/tracking/123',
    }
    ;(useWoltPreordersStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, successModal: modalData }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useWoltPreorders())

    expect(result.current.successModal).toEqual(modalData)
  })

  it('calls refresh function', async () => {
    const { result } = renderHook(() => useWoltPreorders())

    await act(async () => {
      await result.current.refresh()
    })

    expect(mockStore.refreshPreorders).toHaveBeenCalled()
  })

  it('calls confirm function', async () => {
    mockStore.confirmPreorder.mockResolvedValue(true)

    const { result } = renderHook(() => useWoltPreorders())

    await act(async () => {
      const success = await result.current.confirm(5)
      expect(success).toBe(true)
    })

    expect(mockStore.confirmPreorder).toHaveBeenCalledWith(5)
  })

  it('calls clearError function', () => {
    const { result } = renderHook(() => useWoltPreorders())

    act(() => {
      result.current.clearError()
    })

    expect(mockStore.clearError).toHaveBeenCalled()
  })

  it('calls closeSuccessModal function', () => {
    const { result } = renderHook(() => useWoltPreorders())

    act(() => {
      result.current.closeSuccessModal()
    })

    expect(mockStore.closeSuccessModal).toHaveBeenCalled()
  })

  it('sets up auto-refresh interval', async () => {
    renderHook(() => useWoltPreorders())

    // Fast forward 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    expect(mockStore.refreshPreorders).toHaveBeenCalled()
  })

  it('cleans up interval on unmount', () => {
    const { unmount } = renderHook(() => useWoltPreorders())

    unmount()

    // Fast forward 30 seconds after unmount
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    // refreshPreorders should not be called after unmount
    expect(mockStore.refreshPreorders).toHaveBeenCalledTimes(0)
  })
})
