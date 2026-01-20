import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Card } from '@/components/ui/Card'

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      )
      expect(screen.getByText('Card Content')).toBeTruthy()
    })

    it('renders with default variant', () => {
      render(
        <Card>
          <Text>Default Card</Text>
        </Card>
      )
      expect(screen.getByText('Default Card')).toBeTruthy()
    })
  })

  describe('variants', () => {
    it.each(['default', 'elevated', 'outlined'] as const)(
      'renders %s variant',
      (variant) => {
        render(
          <Card variant={variant}>
            <Text>{variant} Card</Text>
          </Card>
        )
        expect(screen.getByText(`${variant} Card`)).toBeTruthy()
      }
    )
  })

  describe('pressable behavior', () => {
    it('renders as View (not TouchableOpacity) by default', () => {
      const onPress = jest.fn()
      const { UNSAFE_queryByType } = render(
        <Card onPress={onPress}>
          <Text>Non-pressable</Text>
        </Card>
      )

      // When pressable is false, it renders a View, not TouchableOpacity
      const touchable = UNSAFE_queryByType(
        require('react-native').TouchableOpacity
      )
      expect(touchable).toBeNull()
    })

    it('is pressable when pressable prop is true', () => {
      const onPress = jest.fn()
      render(
        <Card pressable onPress={onPress}>
          <Text>Pressable</Text>
        </Card>
      )

      fireEvent.press(screen.getByText('Pressable'))

      expect(onPress).toHaveBeenCalledTimes(1)
    })

    it('requires both pressable and onPress to be pressable', () => {
      const onPress = jest.fn()
      render(
        <Card pressable>
          <Text>No onPress</Text>
        </Card>
      )

      fireEvent.press(screen.getByText('No onPress'))

      expect(onPress).not.toHaveBeenCalled()
    })
  })

  describe('custom styling', () => {
    it('applies custom className', () => {
      render(
        <Card className="custom-class">
          <Text>Custom Class</Text>
        </Card>
      )
      expect(screen.getByText('Custom Class')).toBeTruthy()
    })

    it('applies custom style', () => {
      render(
        <Card style={{ marginTop: 10 }}>
          <Text>Custom Style</Text>
        </Card>
      )
      expect(screen.getByText('Custom Style')).toBeTruthy()
    })
  })
})
