import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import SettingsScreen from '../../app/(tabs)/settings'
import { useAuth } from '@/hooks'
import { createMockUser } from '../factories'

// Mock hooks
jest.mock('@/hooks', () => ({
  useAuth: jest.fn(),
}))

// Mock safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock Alert
jest.spyOn(Alert, 'alert')

describe('SettingsScreen', () => {
  const mockUser = createMockUser({
    name: 'Test User',
    email: 'test@example.com',
  })
  const defaultMockHook = {
    user: mockUser,
    logout: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue(defaultMockHook)
  })

  describe('rendering', () => {
    it('renders settings screen sections', () => {
      render(<SettingsScreen />)

      expect(screen.getByText('Account')).toBeTruthy()
      expect(screen.getByText('App Info')).toBeTruthy()
      expect(screen.getByText('Notifications')).toBeTruthy()
      expect(screen.getByText('Data Sync')).toBeTruthy()
      // There may be multiple Logout elements (button + section header)
      expect(screen.getAllByText('Logout').length).toBeGreaterThan(0)
    })

    it('displays user name', () => {
      render(<SettingsScreen />)

      expect(screen.getByText('Test User')).toBeTruthy()
    })

    it('displays user email', () => {
      render(<SettingsScreen />)

      expect(screen.getByText('test@example.com')).toBeTruthy()
    })

    it('displays user initials in avatar', () => {
      render(<SettingsScreen />)

      expect(screen.getByText('TU')).toBeTruthy()
    })

    it('displays app version', () => {
      render(<SettingsScreen />)

      expect(screen.getByText('1.0.0')).toBeTruthy()
    })
  })

  describe('user without name', () => {
    it('shows dash when user has no name', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        user: { ...mockUser, name: undefined },
      })

      render(<SettingsScreen />)

      expect(screen.getByText('-')).toBeTruthy()
    })

    it('shows question mark in avatar when no name', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        user: { ...mockUser, name: undefined },
      })

      render(<SettingsScreen />)

      expect(screen.getByText('?')).toBeTruthy()
    })
  })

  describe('user without email', () => {
    it('shows dash when user has no email', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        user: { ...mockUser, email: undefined },
      })

      render(<SettingsScreen />)

      const dashes = screen.getAllByText('-')
      expect(dashes.length).toBeGreaterThan(0)
    })
  })

  describe('no user', () => {
    it('handles null user', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        user: null,
      })

      render(<SettingsScreen />)

      expect(screen.getByText('?')).toBeTruthy()
    })
  })

  describe('notifications', () => {
    it('shows coming soon alert for notifications', () => {
      render(<SettingsScreen />)

      fireEvent.press(screen.getByText('Configure Notifications'))

      expect(Alert.alert).toHaveBeenCalledWith(
        'Coming Soon',
        'Notification settings coming in Phase 2'
      )
    })
  })

  describe('data sync', () => {
    it('shows sync info alert', () => {
      render(<SettingsScreen />)

      fireEvent.press(screen.getByText('Force Sync Now'))

      expect(Alert.alert).toHaveBeenCalledWith(
        'Sync',
        'Pull down on the orders list to refresh'
      )
    })

    it('displays sync interval', () => {
      render(<SettingsScreen />)

      expect(screen.getByText('Auto-refresh interval: 30 seconds')).toBeTruthy()
    })
  })

  describe('logout', () => {
    it('shows logout confirmation alert', () => {
      render(<SettingsScreen />)

      // Find the logout button (there might be multiple Logout texts)
      const logoutElements = screen.getAllByText('Logout')
      fireEvent.press(logoutElements[logoutElements.length - 1]) // Press the last one (the button)

      expect(Alert.alert).toHaveBeenCalledWith(
        'Logout',
        'Are you sure you want to logout?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Logout' }),
        ])
      )
    })

    it('calls logout when confirmed', async () => {
      const logout = jest.fn()
      ;(useAuth as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        logout,
      })

      // Mock Alert.alert to immediately call the confirm callback
      ;(Alert.alert as jest.Mock).mockImplementation(
        (title, message, buttons) => {
          const confirmButton = buttons?.find(
            (btn: { text: string }) => btn.text === 'Logout'
          )
          confirmButton?.onPress?.()
        }
      )

      render(<SettingsScreen />)

      // Find the logout button (there are multiple Logout texts)
      const logoutElements = screen.getAllByText('Logout')
      fireEvent.press(logoutElements[logoutElements.length - 1])

      await waitFor(() => {
        expect(logout).toHaveBeenCalled()
      })
    })

    it('does not call logout when cancelled', () => {
      const logout = jest.fn()
      ;(useAuth as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        logout,
      })

      // Mock Alert.alert to immediately call the cancel callback
      ;(Alert.alert as jest.Mock).mockImplementation(
        (title, message, buttons) => {
          const cancelButton = buttons?.find(
            (btn: { text: string }) => btn.text === 'Cancel'
          )
          cancelButton?.onPress?.()
        }
      )

      render(<SettingsScreen />)

      // Find the logout button (there are multiple Logout texts)
      const logoutElements = screen.getAllByText('Logout')
      fireEvent.press(logoutElements[logoutElements.length - 1])

      expect(logout).not.toHaveBeenCalled()
    })
  })

  describe('footer', () => {
    it('displays app name in footer', () => {
      render(<SettingsScreen />)

      expect(screen.getByText(/BEBIAS Shipping Manager/)).toBeTruthy()
    })

    it('displays technology stack in footer', () => {
      render(<SettingsScreen />)

      expect(screen.getByText(/Built with Expo & React Native/)).toBeTruthy()
    })
  })
})
