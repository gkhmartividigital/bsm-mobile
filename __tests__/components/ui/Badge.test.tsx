import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { StatusBadge, ProviderBadge } from '@/components/ui/Badge'
import { OrderStatus } from '@/constants'

describe('StatusBadge', () => {
  describe('rendering', () => {
    it.each([
      ['PENDING', 'Pending'],
      ['READY', 'Ready'],
      ['SHIPPED', 'Shipped'],
      ['DELIVERED', 'Delivered'],
      ['CANCELLED', 'Cancelled'],
    ] as const)('renders %s status as "%s"', (status, expectedLabel) => {
      render(<StatusBadge status={status as OrderStatus} />)
      expect(screen.getByText(expectedLabel)).toBeTruthy()
    })
  })

  describe('sizes', () => {
    it('renders with default md size', () => {
      render(<StatusBadge status="PENDING" />)
      expect(screen.getByText('Pending')).toBeTruthy()
    })

    it('renders with sm size', () => {
      render(<StatusBadge status="PENDING" size="sm" />)
      expect(screen.getByText('Pending')).toBeTruthy()
    })

    it('renders with md size', () => {
      render(<StatusBadge status="PENDING" size="md" />)
      expect(screen.getByText('Pending')).toBeTruthy()
    })
  })

  describe('unknown status', () => {
    it('displays raw status for unknown status', () => {
      render(<StatusBadge status={'UNKNOWN' as OrderStatus} />)
      expect(screen.getByText('UNKNOWN')).toBeTruthy()
    })
  })
})

describe('ProviderBadge', () => {
  describe('rendering', () => {
    it('renders wolt provider', () => {
      render(<ProviderBadge provider="wolt" />)
      expect(screen.getByText('Wolt')).toBeTruthy()
    })

    it('renders trackings_ge provider', () => {
      render(<ProviderBadge provider="trackings_ge" />)
      expect(screen.getByText('Trackings')).toBeTruthy()
    })

    it('renders manual provider', () => {
      render(<ProviderBadge provider="manual" />)
      expect(screen.getByText('Manual')).toBeTruthy()
    })

    it('renders manual for unknown provider', () => {
      render(<ProviderBadge provider="unknown_provider" />)
      expect(screen.getByText('Manual')).toBeTruthy()
    })

    it('renders manual for null provider', () => {
      render(<ProviderBadge provider={null} />)
      expect(screen.getByText('Manual')).toBeTruthy()
    })

    it('renders manual for undefined provider', () => {
      render(<ProviderBadge provider={undefined} />)
      expect(screen.getByText('Manual')).toBeTruthy()
    })
  })
})
