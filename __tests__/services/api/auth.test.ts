import { authApi } from '@/services/api/auth'
import { apiClient, apiRequest } from '@/services/api/client'
import { createMockUser } from '../../factories'

jest.mock('@/services/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
  apiRequest: jest.fn((promise) => promise),
}))

describe('authApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signIn', () => {
    it('signs in with email and password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }
      const mockUser = createMockUser()
      const mockResponse = {
        user: mockUser,
        token: 'jwt-token-123',
      }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await authApi.signIn(credentials)

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/auth/mobile-signin',
        credentials
      )
      expect(result).toEqual(mockResponse)
    })

    it('handles invalid credentials', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }
      ;(apiRequest as jest.Mock).mockRejectedValue({
        message: 'Invalid credentials',
        status: 401,
      })

      await expect(authApi.signIn(credentials)).rejects.toEqual({
        message: 'Invalid credentials',
        status: 401,
      })
    })
  })

  describe('getSession', () => {
    it('verifies current session', async () => {
      const mockUser = createMockUser()
      const mockResponse = { user: mockUser }
      ;(apiRequest as jest.Mock).mockResolvedValue(mockResponse)

      const result = await authApi.getSession()

      expect(apiClient.get).toHaveBeenCalledWith('/api/auth/mobile-session')
      expect(result).toEqual(mockResponse)
    })

    it('handles expired session', async () => {
      ;(apiRequest as jest.Mock).mockRejectedValue({
        message: 'Unauthorized',
        status: 401,
      })

      await expect(authApi.getSession()).rejects.toEqual({
        message: 'Unauthorized',
        status: 401,
      })
    })
  })

  describe('registerPushToken', () => {
    it('registers iOS push token', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ success: true })

      const result = await authApi.registerPushToken('ios-token-123', 'ios')

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/notifications/subscribe',
        { token: 'ios-token-123', platform: 'ios' }
      )
      expect(result).toEqual({ success: true })
    })

    it('registers Android push token', async () => {
      ;(apiRequest as jest.Mock).mockResolvedValue({ success: true })

      const result = await authApi.registerPushToken('android-token-456', 'android')

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/notifications/subscribe',
        { token: 'android-token-456', platform: 'android' }
      )
      expect(result).toEqual({ success: true })
    })
  })
})
