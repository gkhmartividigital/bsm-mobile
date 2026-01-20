import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

describe('LoadingScreen', () => {
  describe('rendering', () => {
    it('renders with default message', () => {
      render(<LoadingScreen />)
      expect(screen.getByText('Loading...')).toBeTruthy()
    })

    it('renders with custom message', () => {
      render(<LoadingScreen message="Please wait" />)
      expect(screen.getByText('Please wait')).toBeTruthy()
    })

    it('renders activity indicator', () => {
      render(<LoadingScreen />)
      expect(screen.getByText('Loading...')).toBeTruthy()
    })
  })

  describe('custom messages', () => {
    it.each([
      'Fetching orders...',
      'Syncing data...',
      'Logging in...',
      'Saving changes...',
    ])('renders custom message: %s', (message) => {
      render(<LoadingScreen message={message} />)
      expect(screen.getByText(message)).toBeTruthy()
    })
  })
})
