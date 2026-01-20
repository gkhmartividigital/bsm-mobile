import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text, TouchableOpacity } from 'react-native'
import { EmptyState } from '@/components/ui/EmptyState'

describe('EmptyState', () => {
  describe('rendering', () => {
    it('renders with title only', () => {
      render(<EmptyState title="No items" />)
      expect(screen.getByText('No items')).toBeTruthy()
    })

    it('renders with title and description', () => {
      render(<EmptyState title="No items" description="Try adding some items" />)
      expect(screen.getByText('No items')).toBeTruthy()
      expect(screen.getByText('Try adding some items')).toBeTruthy()
    })

    it('renders with icon', () => {
      const icon = <Text testID="empty-icon">Empty Icon</Text>
      render(<EmptyState title="No items" icon={icon} />)
      expect(screen.getByTestId('empty-icon')).toBeTruthy()
      expect(screen.getByText('No items')).toBeTruthy()
    })

    it('renders with action', () => {
      const action = (
        <TouchableOpacity testID="action-button">
          <Text>Add Item</Text>
        </TouchableOpacity>
      )
      render(<EmptyState title="No items" action={action} />)
      expect(screen.getByTestId('action-button')).toBeTruthy()
      expect(screen.getByText('Add Item')).toBeTruthy()
    })

    it('renders with all props', () => {
      const icon = <Text testID="icon">Icon</Text>
      const action = <Text testID="action">Action</Text>
      render(
        <EmptyState
          title="No items"
          description="Add some items"
          icon={icon}
          action={action}
        />
      )
      expect(screen.getByTestId('icon')).toBeTruthy()
      expect(screen.getByText('No items')).toBeTruthy()
      expect(screen.getByText('Add some items')).toBeTruthy()
      expect(screen.getByTestId('action')).toBeTruthy()
    })
  })

  describe('without optional props', () => {
    it('does not render description when not provided', () => {
      render(<EmptyState title="No items" />)
      expect(screen.queryByText('Try adding some items')).toBeNull()
    })

    it('does not render icon when not provided', () => {
      render(<EmptyState title="No items" />)
      expect(screen.queryByTestId('empty-icon')).toBeNull()
    })

    it('does not render action when not provided', () => {
      render(<EmptyState title="No items" />)
      expect(screen.queryByTestId('action-button')).toBeNull()
    })
  })

  describe('action interaction', () => {
    it('action button can be pressed', () => {
      const onPress = jest.fn()
      const action = (
        <TouchableOpacity testID="action-button" onPress={onPress}>
          <Text>Add Item</Text>
        </TouchableOpacity>
      )
      render(<EmptyState title="No items" action={action} />)

      fireEvent.press(screen.getByTestId('action-button'))

      expect(onPress).toHaveBeenCalledTimes(1)
    })
  })
})
