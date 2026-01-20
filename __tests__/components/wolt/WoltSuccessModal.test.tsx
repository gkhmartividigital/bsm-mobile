import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { WoltSuccessModal } from '@/components/wolt/WoltSuccessModal'

// Mock Linking.openURL
jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true))

describe('WoltSuccessModal', () => {
  const defaultProps = {
    visible: true,
    orderNumber: 'WP0001',
    woltOrderId: 'wolt-12345678-abcd-efgh',
    woltTrackingUrl: 'https://wolt.com/tracking/12345',
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders when visible is true', () => {
      render(<WoltSuccessModal {...defaultProps} />)
      expect(screen.getByText(/Order #WP0001 sent to Wolt!/)).toBeTruthy()
    })

    it('does not render when visible is false', () => {
      render(<WoltSuccessModal {...defaultProps} visible={false} />)
      expect(screen.queryByText(/Order #WP0001 sent to Wolt!/)).toBeNull()
    })

    it('renders order number in success message', () => {
      render(<WoltSuccessModal {...defaultProps} orderNumber="WP9999" />)
      expect(screen.getByText('Order #WP9999 sent to Wolt!')).toBeTruthy()
    })

    it('renders instruction text', () => {
      render(<WoltSuccessModal {...defaultProps} />)
      expect(screen.getByText('Write this code on the parcel')).toBeTruthy()
    })

    it('renders short Wolt ID (last 8 characters)', () => {
      render(
        <WoltSuccessModal
          {...defaultProps}
          woltOrderId="wolt-12345678-abcd-efgh"
        />
      )
      expect(screen.getByText('BCD-EFGH')).toBeTruthy()
    })

    it('renders full Wolt order ID', () => {
      render(<WoltSuccessModal {...defaultProps} />)
      expect(screen.getByText('Full ID: wolt-12345678-abcd-efgh')).toBeTruthy()
    })

    it('renders Done button', () => {
      render(<WoltSuccessModal {...defaultProps} />)
      expect(screen.getByText('Done')).toBeTruthy()
    })
  })

  describe('tracking URL', () => {
    it('renders tracking link when URL is provided', () => {
      render(<WoltSuccessModal {...defaultProps} />)
      expect(screen.getByText('Open tracking page')).toBeTruthy()
    })

    it('does not render tracking link when URL is not provided', () => {
      render(
        <WoltSuccessModal {...defaultProps} woltTrackingUrl={undefined} />
      )
      expect(screen.queryByText('Open tracking page')).toBeNull()
    })

    it('opens tracking URL when link is pressed', () => {
      render(<WoltSuccessModal {...defaultProps} />)

      fireEvent.press(screen.getByText('Open tracking page'))

      expect(Linking.openURL).toHaveBeenCalledWith(
        'https://wolt.com/tracking/12345'
      )
    })
  })

  describe('interactions', () => {
    it('calls onClose when Done button is pressed', () => {
      const onClose = jest.fn()
      render(<WoltSuccessModal {...defaultProps} onClose={onClose} />)

      fireEvent.press(screen.getByText('Done'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('short ID formatting', () => {
    it('formats short ID correctly for various lengths', () => {
      const { rerender } = render(
        <WoltSuccessModal {...defaultProps} woltOrderId="12345678" />
      )
      expect(screen.getByText('12345678')).toBeTruthy()

      rerender(
        <WoltSuccessModal {...defaultProps} woltOrderId="abcdefghijklmnop" />
      )
      expect(screen.getByText('IJKLMNOP')).toBeTruthy()
    })
  })
})
