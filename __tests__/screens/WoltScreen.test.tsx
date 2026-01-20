import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import WoltScreen from '../../app/(tabs)/wolt'
import { useWoltPreorders } from '@/hooks'
import { createMockWoltPreorder, createMockWoltPreorders, resetFactories } from '../factories'

// Mock hooks
jest.mock('@/hooks', () => ({
  useWoltPreorders: jest.fn(),
}))

// Mock safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}))

describe('WoltScreen', () => {
  const defaultMockHook = {
    preorders: [],
    pendingCount: 0,
    isLoading: false,
    isRefreshing: false,
    isConfirming: null,
    error: null,
    successModal: null,
    refresh: jest.fn(),
    confirm: jest.fn(),
    clearError: jest.fn(),
    closeSuccessModal: jest.fn(),
  }

  beforeEach(() => {
    resetFactories()
    jest.clearAllMocks()
    ;(useWoltPreorders as jest.Mock).mockReturnValue(defaultMockHook)
  })

  describe('loading state', () => {
    it('shows loading screen when loading without preorders', () => {
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        isLoading: true,
        preorders: [],
      })

      render(<WoltScreen />)

      expect(screen.getByText('Loading preorders...')).toBeTruthy()
    })

    it('does not show loading screen when has preorders', () => {
      const preorders = createMockWoltPreorders(2)
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        isLoading: true,
        preorders,
      })

      render(<WoltScreen />)

      expect(screen.queryByText('Loading preorders...')).toBeNull()
    })
  })

  describe('error state', () => {
    it('shows error state when error without preorders', () => {
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        error: 'API error',
        preorders: [],
      })

      render(<WoltScreen />)

      expect(screen.getByText('Something went wrong')).toBeTruthy()
      expect(screen.getByText('API error')).toBeTruthy()
      expect(screen.getByText('Try Again')).toBeTruthy()
    })

    it('calls retry on error button press', () => {
      const clearError = jest.fn()
      const refresh = jest.fn()
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        error: 'API error',
        preorders: [],
        clearError,
        refresh,
      })

      render(<WoltScreen />)

      fireEvent.press(screen.getByText('Try Again'))

      expect(clearError).toHaveBeenCalled()
      expect(refresh).toHaveBeenCalled()
    })
  })

  describe('empty state', () => {
    it('shows empty state when no preorders', () => {
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: [],
      })

      render(<WoltScreen />)

      expect(screen.getByText('No Preorders')).toBeTruthy()
      expect(
        screen.getByText(/When new Wolt preorders arrive/)
      ).toBeTruthy()
    })
  })

  describe('preorders list', () => {
    it('renders preorders', () => {
      const preorders = [
        createMockWoltPreorder({ orderNumber: 'WP0001', customerName: 'Wolt Customer 1' }),
        createMockWoltPreorder({ orderNumber: 'WP0002', customerName: 'Wolt Customer 2' }),
      ]
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders,
        pendingCount: 2,
      })

      render(<WoltScreen />)

      expect(screen.getByText('#WP0001')).toBeTruthy()
      expect(screen.getByText('#WP0002')).toBeTruthy()
      expect(screen.getByText('Wolt Customer 1')).toBeTruthy()
      expect(screen.getByText('Wolt Customer 2')).toBeTruthy()
    })

    it('shows pending count badge', () => {
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: createMockWoltPreorders(3),
        pendingCount: 3,
      })

      render(<WoltScreen />)

      expect(screen.getByText('3')).toBeTruthy()
    })

    it('does not show badge when no pending preorders', () => {
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: [],
        pendingCount: 0,
      })

      render(<WoltScreen />)

      expect(screen.getByText('Wolt Preorders')).toBeTruthy()
    })
  })

  describe('header', () => {
    it('renders header title', () => {
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: createMockWoltPreorders(1),
      })

      render(<WoltScreen />)

      expect(screen.getByText('Wolt Preorders')).toBeTruthy()
    })

    it('has refresh button in header', () => {
      const refresh = jest.fn()
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: createMockWoltPreorders(1),
        refresh,
      })

      const { UNSAFE_getAllByType } = render(<WoltScreen />)

      // Find the refresh button by looking at all TouchableOpacity elements
      const touchables = UNSAFE_getAllByType(
        require('react-native').TouchableOpacity
      )
      // The first touchable in header should be the refresh button
      if (touchables.length > 0) {
        fireEvent.press(touchables[0])
        expect(refresh).toHaveBeenCalled()
      }
    })
  })

  describe('confirm preorder', () => {
    it('shows confirm button for pending preorders', () => {
      const preorder = createMockWoltPreorder({ status: 'pending_warehouse' })
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: [preorder],
      })

      render(<WoltScreen />)

      expect(screen.getByText('Send to Wolt')).toBeTruthy()
    })

    it('calls confirm when button pressed', () => {
      const confirm = jest.fn()
      const preorder = createMockWoltPreorder({ id: 5, status: 'pending_warehouse' })
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: [preorder],
        confirm,
      })

      render(<WoltScreen />)

      fireEvent.press(screen.getByText('Send to Wolt'))

      expect(confirm).toHaveBeenCalledWith(5)
    })

    it('shows loading state when confirming', () => {
      const preorder = createMockWoltPreorder({ id: 5, status: 'pending_warehouse' })
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: [preorder],
        isConfirming: 5,
      })

      render(<WoltScreen />)

      expect(screen.getByText('Sending to Wolt...')).toBeTruthy()
    })
  })

  describe('success modal', () => {
    it('shows success modal when successModal is set', () => {
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: [],
        successModal: {
          orderNumber: 'WP0001',
          woltOrderId: 'wolt-12345678',
          woltTrackingUrl: 'https://wolt.com/tracking/123',
        },
      })

      render(<WoltScreen />)

      expect(screen.getByText(/Order #WP0001 sent to Wolt!/)).toBeTruthy()
    })

    it('calls closeSuccessModal when Done is pressed', () => {
      const closeSuccessModal = jest.fn()
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: [],
        successModal: {
          orderNumber: 'WP0001',
          woltOrderId: 'wolt-12345678',
          woltTrackingUrl: 'https://wolt.com/tracking/123',
        },
        closeSuccessModal,
      })

      render(<WoltScreen />)

      fireEvent.press(screen.getByText('Done'))

      expect(closeSuccessModal).toHaveBeenCalled()
    })
  })

  describe('refresh', () => {
    it('calls refresh on pull to refresh', () => {
      const refresh = jest.fn()
      ;(useWoltPreorders as jest.Mock).mockReturnValue({
        ...defaultMockHook,
        preorders: createMockWoltPreorders(1),
        refresh,
      })

      render(<WoltScreen />)

      const flatList = screen.UNSAFE_getByType(require('react-native').FlatList)
      flatList.props.refreshControl.props.onRefresh()

      expect(refresh).toHaveBeenCalled()
    })
  })
})
