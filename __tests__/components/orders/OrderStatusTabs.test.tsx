import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { OrderStatusTabs } from '@/components/orders/OrderStatusTabs'

describe('OrderStatusTabs', () => {
  const defaultCounts = {
    pending: 5,
    ready: 3,
    shipped: 8,
    delivered: 12,
    total: 28,
  }

  describe('rendering', () => {
    it('renders all tabs', () => {
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={jest.fn()}
          counts={defaultCounts}
        />
      )

      expect(screen.getByText('All')).toBeTruthy()
      expect(screen.getByText('Pending')).toBeTruthy()
      expect(screen.getByText('Ready')).toBeTruthy()
      expect(screen.getByText('Shipped')).toBeTruthy()
      expect(screen.getByText('Delivered')).toBeTruthy()
    })

    it('renders counts for each tab', () => {
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={jest.fn()}
          counts={defaultCounts}
        />
      )

      expect(screen.getByText('28')).toBeTruthy() // total
      expect(screen.getByText('5')).toBeTruthy()  // pending
      expect(screen.getByText('3')).toBeTruthy()  // ready
      expect(screen.getByText('8')).toBeTruthy()  // shipped
      expect(screen.getByText('12')).toBeTruthy() // delivered
    })
  })

  describe('active tab', () => {
    it('shows "all" as active', () => {
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={jest.fn()}
          counts={defaultCounts}
        />
      )

      expect(screen.getByText('All')).toBeTruthy()
    })

    it.each([
      'PENDING',
      'READY',
      'SHIPPED',
      'DELIVERED',
    ] as const)('shows %s as active', (status) => {
      render(
        <OrderStatusTabs
          activeTab={status}
          onTabChange={jest.fn()}
          counts={defaultCounts}
        />
      )

      expect(screen.getByText(status.charAt(0) + status.slice(1).toLowerCase())).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('calls onTabChange with "all" when All tab is pressed', () => {
      const onTabChange = jest.fn()
      render(
        <OrderStatusTabs
          activeTab="PENDING"
          onTabChange={onTabChange}
          counts={defaultCounts}
        />
      )

      fireEvent.press(screen.getByText('All'))

      expect(onTabChange).toHaveBeenCalledWith('all')
    })

    it('calls onTabChange with "PENDING" when Pending tab is pressed', () => {
      const onTabChange = jest.fn()
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={onTabChange}
          counts={defaultCounts}
        />
      )

      fireEvent.press(screen.getByText('Pending'))

      expect(onTabChange).toHaveBeenCalledWith('PENDING')
    })

    it('calls onTabChange with "READY" when Ready tab is pressed', () => {
      const onTabChange = jest.fn()
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={onTabChange}
          counts={defaultCounts}
        />
      )

      fireEvent.press(screen.getByText('Ready'))

      expect(onTabChange).toHaveBeenCalledWith('READY')
    })

    it('calls onTabChange with "SHIPPED" when Shipped tab is pressed', () => {
      const onTabChange = jest.fn()
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={onTabChange}
          counts={defaultCounts}
        />
      )

      fireEvent.press(screen.getByText('Shipped'))

      expect(onTabChange).toHaveBeenCalledWith('SHIPPED')
    })

    it('calls onTabChange with "DELIVERED" when Delivered tab is pressed', () => {
      const onTabChange = jest.fn()
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={onTabChange}
          counts={defaultCounts}
        />
      )

      fireEvent.press(screen.getByText('Delivered'))

      expect(onTabChange).toHaveBeenCalledWith('DELIVERED')
    })
  })

  describe('zero counts', () => {
    it('renders zero counts correctly', () => {
      const zeroCounts = {
        pending: 0,
        ready: 0,
        shipped: 0,
        delivered: 0,
        total: 0,
      }
      render(
        <OrderStatusTabs
          activeTab="all"
          onTabChange={jest.fn()}
          counts={zeroCounts}
        />
      )

      const zeros = screen.getAllByText('0')
      expect(zeros.length).toBe(5)
    })
  })
})
