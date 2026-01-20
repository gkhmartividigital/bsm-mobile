import {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatTimeSlot,
  formatPhone,
  formatPrice,
  formatEta,
  truncate,
} from '@/utils/formatters'

describe('formatters', () => {
  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const result = formatDate('2024-01-15T10:30:00Z')
      expect(result).toBe('15 Jan 2024')
    })

    it('formats date with custom pattern', () => {
      const result = formatDate('2024-01-15T10:30:00Z', 'yyyy-MM-dd')
      expect(result).toBe('2024-01-15')
    })

    it('returns dash for null', () => {
      expect(formatDate(null)).toBe('-')
    })

    it('returns dash for undefined', () => {
      expect(formatDate(undefined)).toBe('-')
    })

    it('returns dash for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('-')
    })
  })

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      const result = formatDateTime('2024-01-15T10:30:00Z')
      expect(result).toMatch(/15 Jan 2024/)
    })

    it('returns dash for null', () => {
      expect(formatDateTime(null)).toBe('-')
    })
  })

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const result = formatTime('2024-01-15T14:30:00Z')
      expect(result).toMatch(/\d{2}:\d{2}/)
    })

    it('returns dash for null', () => {
      expect(formatTime(null)).toBe('-')
    })
  })

  describe('formatRelativeTime', () => {
    it('formats recent time as relative', () => {
      const recentDate = new Date()
      recentDate.setMinutes(recentDate.getMinutes() - 5)
      const result = formatRelativeTime(recentDate.toISOString())
      expect(result).toMatch(/minutes? ago|less than/)
    })

    it('returns dash for null', () => {
      expect(formatRelativeTime(null)).toBe('-')
    })

    it('returns dash for undefined', () => {
      expect(formatRelativeTime(undefined)).toBe('-')
    })

    it('returns dash for invalid date', () => {
      expect(formatRelativeTime('invalid')).toBe('-')
    })
  })

  describe('formatTimeSlot', () => {
    it('formats time slot correctly', () => {
      const result = formatTimeSlot('2024-01-15', '10:00-12:00')
      expect(result).toBe('15 Jan - 10:00-12:00')
    })

    it('returns ASAP for now time slot', () => {
      const result = formatTimeSlot('2024-01-15', 'now')
      expect(result).toBe('ASAP')
    })

    it('returns empty string for null slot date', () => {
      expect(formatTimeSlot(null, '10:00-12:00')).toBe('')
    })

    it('returns empty string for null time slot', () => {
      expect(formatTimeSlot('2024-01-15', null)).toBe('')
    })

    it('returns empty string for both null', () => {
      expect(formatTimeSlot(null, null)).toBe('')
    })
  })

  describe('formatPhone', () => {
    it('formats 9-digit Georgian phone number', () => {
      expect(formatPhone('555123456')).toBe('555 123 456')
    })

    it('returns original for phone with country code (not 9 digits)', () => {
      // formatPhone only formats 9-digit numbers, numbers with country code are returned as-is
      expect(formatPhone('+995555123456')).toBe('+995555123456')
    })

    it('returns original if not 9 digits', () => {
      expect(formatPhone('12345')).toBe('12345')
    })

    it('returns dash for null', () => {
      expect(formatPhone(null)).toBe('-')
    })

    it('returns dash for undefined', () => {
      expect(formatPhone(undefined)).toBe('-')
    })

    it('removes non-digit characters', () => {
      expect(formatPhone('555-123-456')).toBe('555 123 456')
    })
  })

  describe('formatPrice', () => {
    it('formats price with default currency', () => {
      expect(formatPrice(15.5)).toBe('15.50 GEL')
    })

    it('formats price with custom currency', () => {
      expect(formatPrice(100, 'USD')).toBe('100.00 USD')
    })

    it('formats price with decimals', () => {
      expect(formatPrice(25.999)).toBe('26.00 GEL')
    })

    it('returns dash for null', () => {
      expect(formatPrice(null)).toBe('-')
    })

    it('returns dash for undefined', () => {
      expect(formatPrice(undefined)).toBe('-')
    })

    it('formats zero correctly', () => {
      expect(formatPrice(0)).toBe('0.00 GEL')
    })
  })

  describe('formatEta', () => {
    it('formats minutes under 60', () => {
      expect(formatEta(45)).toBe('45 min')
    })

    it('formats exactly 60 minutes as 1h', () => {
      expect(formatEta(60)).toBe('1h')
    })

    it('formats hours and minutes', () => {
      expect(formatEta(90)).toBe('1h 30m')
    })

    it('formats multiple hours', () => {
      expect(formatEta(180)).toBe('3h')
    })

    it('formats hours with remaining minutes', () => {
      expect(formatEta(125)).toBe('2h 5m')
    })

    it('returns dash for null', () => {
      expect(formatEta(null)).toBe('-')
    })

    it('returns dash for undefined', () => {
      expect(formatEta(undefined)).toBe('-')
    })
  })

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('This is a long text', 10)).toBe('This is a ...')
    })

    it('does not truncate short text', () => {
      expect(truncate('Short', 10)).toBe('Short')
    })

    it('handles exact length', () => {
      expect(truncate('Exactly10!', 10)).toBe('Exactly10!')
    })

    it('handles empty string', () => {
      expect(truncate('', 10)).toBe('')
    })

    it('handles maxLength of 0', () => {
      expect(truncate('Test', 0)).toBe('...')
    })
  })
})
