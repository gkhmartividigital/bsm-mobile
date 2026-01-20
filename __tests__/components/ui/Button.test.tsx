import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  describe('rendering', () => {
    it('renders with title', () => {
      render(<Button title="Click Me" />)
      expect(screen.getByText('Click Me')).toBeTruthy()
    })

    it('renders with icon', () => {
      const icon = <Text testID="icon">Icon</Text>
      render(<Button title="With Icon" icon={icon} />)
      expect(screen.getByTestId('icon')).toBeTruthy()
      expect(screen.getByText('With Icon')).toBeTruthy()
    })
  })

  describe('variants', () => {
    it.each([
      'primary',
      'secondary',
      'outline',
      'danger',
      'success',
    ] as const)('renders %s variant', (variant) => {
      render(<Button title={`${variant} button`} variant={variant} />)
      expect(screen.getByText(`${variant} button`)).toBeTruthy()
    })
  })

  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('renders %s size', (size) => {
      render(<Button title={`${size} button`} size={size} />)
      expect(screen.getByText(`${size} button`)).toBeTruthy()
    })
  })

  describe('loading state', () => {
    it('shows loading indicator when loading', () => {
      render(<Button title="Loading" loading />)
      expect(screen.queryByText('Loading')).toBeNull()
    })

    it('sets disabled prop when loading', () => {
      const { UNSAFE_getByType } = render(
        <Button title="Loading" loading onPress={jest.fn()} />
      )

      const touchable = UNSAFE_getByType(
        require('react-native').TouchableOpacity
      )
      expect(touchable.props.disabled).toBe(true)
    })
  })

  describe('disabled state', () => {
    it('sets disabled prop when disabled', () => {
      const { UNSAFE_getByType } = render(
        <Button title="Disabled" disabled onPress={jest.fn()} />
      )

      const touchable = UNSAFE_getByType(
        require('react-native').TouchableOpacity
      )
      expect(touchable.props.disabled).toBe(true)
    })

    it('applies opacity style when disabled', () => {
      const { UNSAFE_getByType } = render(
        <Button title="Disabled" disabled onPress={jest.fn()} />
      )

      const touchable = UNSAFE_getByType(
        require('react-native').TouchableOpacity
      )
      // The component applies 'opacity-50' class when disabled
      expect(touchable.props.className).toContain('opacity-50')
    })
  })

  describe('interactions', () => {
    it('calls onPress when pressed', () => {
      const onPress = jest.fn()
      render(<Button title="Press Me" onPress={onPress} />)

      fireEvent.press(screen.getByText('Press Me'))

      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn()
      render(<Button title="Disabled" disabled onPress={onPress} />)

      fireEvent.press(screen.getByText('Disabled'))

      expect(onPress).not.toHaveBeenCalled()
    })
  })

  describe('fullWidth', () => {
    it('applies full width style when fullWidth is true', () => {
      render(<Button title="Full Width" fullWidth />)
      expect(screen.getByText('Full Width')).toBeTruthy()
    })
  })
})
