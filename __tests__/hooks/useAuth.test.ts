import { renderHook } from '@testing-library/react-native'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { createMockUser } from '../factories'

// Mock the store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}))

describe('useAuth', () => {
  const mockUser = createMockUser()
  const mockStore = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    checkSession: jest.fn(),
    clearError: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore)
      }
      return mockStore
    })
  })

  it('returns user from store', () => {
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, user: mockUser }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toEqual(mockUser)
  })

  it('returns token from store', () => {
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, token: 'test-token' }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.token).toBe('test-token')
  })

  it('returns isAuthenticated state', () => {
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, isAuthenticated: true }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isAuthenticated).toBe(true)
  })

  it('returns isLoading state', () => {
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, isLoading: true }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
  })

  it('returns error state', () => {
    ;(useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      const store = { ...mockStore, error: 'Test error' }
      if (typeof selector === 'function') {
        return selector(store)
      }
      return store
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.error).toBe('Test error')
  })

  it('provides login function', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.login).toBe(mockStore.login)
  })

  it('provides logout function', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.logout).toBe(mockStore.logout)
  })

  it('provides checkSession function', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.checkSession).toBe(mockStore.checkSession)
  })

  it('provides clearError function', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.clearError).toBe(mockStore.clearError)
  })
})
