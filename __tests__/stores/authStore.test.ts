import { act } from '@testing-library/react-native'
import * as SecureStore from 'expo-secure-store'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/services/api'
import { createMockUser } from '../factories'
import { STORAGE_KEYS } from '@/constants/config'

jest.mock('@/services/api', () => ({
  authApi: {
    signIn: jest.fn(),
    getSession: jest.fn(),
    registerPushToken: jest.fn(),
  },
}))

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store state
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    })
  })

  describe('initial state', () => {
    it('has correct initial state', () => {
      const state = useAuthStore.getState()

      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(true)
      expect(state.error).toBeNull()
    })
  })

  describe('login', () => {
    it('logs in successfully', async () => {
      const mockUser = createMockUser()
      const mockResponse = { user: mockUser, token: 'jwt-token-123' }
      ;(authApi.signIn as jest.Mock).mockResolvedValue(mockResponse)

      await act(async () => {
        const result = await useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'password123',
        })
        expect(result).toBe(true)
      })

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe('jwt-token-123')
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN,
        'jwt-token-123'
      )
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      )
    })

    it('handles login error', async () => {
      ;(authApi.signIn as jest.Mock).mockRejectedValue(new Error('Invalid credentials'))

      await act(async () => {
        const result = await useAuthStore.getState().login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        expect(result).toBe(false)
      })

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe('Invalid credentials')
    })

    it('sets loading state while logging in', async () => {
      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      ;(authApi.signIn as jest.Mock).mockReturnValue(promise)

      useAuthStore.setState({ isLoading: false })
      const loginPromise = useAuthStore.getState().login({
        email: 'test@example.com',
        password: 'password',
      })

      expect(useAuthStore.getState().isLoading).toBe(true)

      resolvePromise!({ user: createMockUser(), token: 'token' })
      await loginPromise

      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    it('logs out successfully', async () => {
      const mockUser = createMockUser()
      useAuthStore.setState({
        user: mockUser,
        token: 'token',
        isAuthenticated: true,
        isLoading: false,
      })

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN)
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA)
    })

    it('handles SecureStore error gracefully', async () => {
      ;(SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'))

      useAuthStore.setState({
        user: createMockUser(),
        token: 'token',
        isAuthenticated: true,
      })

      await act(async () => {
        await useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('checkSession', () => {
    it('restores session from storage', async () => {
      const mockUser = createMockUser()
      ;(SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) return Promise.resolve('stored-token')
        if (key === STORAGE_KEYS.USER_DATA) return Promise.resolve(JSON.stringify(mockUser))
        return Promise.resolve(null)
      })
      ;(authApi.getSession as jest.Mock).mockResolvedValue({ user: mockUser })

      await act(async () => {
        const result = await useAuthStore.getState().checkSession()
        expect(result).toBe(true)
      })

      const state = useAuthStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe('stored-token')
      expect(state.isAuthenticated).toBe(true)
    })

    it('returns false when no token stored', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null)

      await act(async () => {
        const result = await useAuthStore.getState().checkSession()
        expect(result).toBe(false)
      })

      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('clears session when token is invalid', async () => {
      ;(SecureStore.getItemAsync as jest.Mock).mockImplementation((key) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) return Promise.resolve('invalid-token')
        if (key === STORAGE_KEYS.USER_DATA) return Promise.resolve('{}')
        return Promise.resolve(null)
      })
      ;(authApi.getSession as jest.Mock).mockRejectedValue(new Error('Token expired'))

      await act(async () => {
        const result = await useAuthStore.getState().checkSession()
        expect(result).toBe(false)
      })

      // Verify that deleteItemAsync was called (at least once for cleanup)
      expect(SecureStore.deleteItemAsync).toHaveBeenCalled()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('clearError', () => {
    it('clears error', () => {
      useAuthStore.setState({ error: 'Some error' })

      act(() => {
        useAuthStore.getState().clearError()
      })

      expect(useAuthStore.getState().error).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('sets loading state', () => {
      useAuthStore.setState({ isLoading: false })

      act(() => {
        useAuthStore.getState().setLoading(true)
      })

      expect(useAuthStore.getState().isLoading).toBe(true)

      act(() => {
        useAuthStore.getState().setLoading(false)
      })

      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })
})
