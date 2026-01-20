import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import { OrderList } from '@/components/orders/OrderList'
import { createMockOrder, createMockOrders, resetFactories } from '../../factories'

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('OrderList', () => {
  beforeEach(() => {
    resetFactories()
  })

  describe('rendering', () => {
    it('renders list of orders', () => {
      const orders = [
        createMockOrder({ customerName: 'Customer 1' }),
        createMockOrder({ customerName: 'Customer 2' }),
        createMockOrder({ customerName: 'Customer 3' }),
      ]
      render(
        <OrderList orders={orders} refreshing={false} onRefresh={jest.fn()} />
      )

      expect(screen.getByText('Customer 1')).toBeTruthy()
      expect(screen.getByText('Customer 2')).toBeTruthy()
      expect(screen.getByText('Customer 3')).toBeTruthy()
    })

    it('renders empty state when no orders', () => {
      render(
        <OrderList orders={[]} refreshing={false} onRefresh={jest.fn()} />
      )

      expect(screen.getByText('No orders')).toBeTruthy()
      expect(screen.getByText('Pull down to refresh or sync from Firestore')).toBeTruthy()
    })

    it('does not render empty state when refreshing with no orders', () => {
      render(
        <OrderList orders={[]} refreshing={true} onRefresh={jest.fn()} />
      )

      expect(screen.queryByText('No orders')).toBeNull()
    })

    it('renders ListHeaderComponent when provided', () => {
      const orders = createMockOrders(2)
      const { Text } = require('react-native')
      const Header = <Text testID="header">Header Content</Text>
      render(
        <OrderList
          orders={orders}
          refreshing={false}
          onRefresh={jest.fn()}
          ListHeaderComponent={Header}
        />
      )

      expect(screen.getByTestId('header')).toBeTruthy()
    })
  })

  describe('refresh', () => {
    it('calls onRefresh when pulled', async () => {
      const onRefresh = jest.fn()
      const orders = createMockOrders(3)
      render(
        <OrderList orders={orders} refreshing={false} onRefresh={onRefresh} />
      )

      const flatList = screen.UNSAFE_getByType(require('react-native').FlatList)
      const refreshControl = flatList.props.refreshControl

      refreshControl.props.onRefresh()

      expect(onRefresh).toHaveBeenCalledTimes(1)
    })

    it('shows refresh indicator when refreshing', () => {
      const orders = createMockOrders(3)
      render(
        <OrderList orders={orders} refreshing={true} onRefresh={jest.fn()} />
      )

      const flatList = screen.UNSAFE_getByType(require('react-native').FlatList)
      const refreshControl = flatList.props.refreshControl

      expect(refreshControl.props.refreshing).toBe(true)
    })
  })

  describe('list behavior', () => {
    it('uses order id as key extractor', () => {
      const orders = [
        createMockOrder({ id: 100 }),
        createMockOrder({ id: 200 }),
      ]
      render(
        <OrderList orders={orders} refreshing={false} onRefresh={jest.fn()} />
      )

      const flatList = screen.UNSAFE_getByType(require('react-native').FlatList)
      expect(flatList.props.keyExtractor(orders[0])).toBe('100')
      expect(flatList.props.keyExtractor(orders[1])).toBe('200')
    })
  })

  describe('with many orders', () => {
    it('renders large list of orders', () => {
      const orders = createMockOrders(20)
      render(
        <OrderList orders={orders} refreshing={false} onRefresh={jest.fn()} />
      )

      expect(screen.UNSAFE_getByType(require('react-native').FlatList)).toBeTruthy()
    })
  })
})
