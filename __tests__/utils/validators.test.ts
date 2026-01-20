import {
  emailSchema,
  georgianPhoneSchema,
  loginSchema,
  orderSchema,
  isValidGeorgianPhone,
  isValidEmail,
} from '@/utils/validators'

describe('validators', () => {
  describe('emailSchema', () => {
    it('accepts valid email', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(emailSchema.safeParse('invalid-email').success).toBe(false)
    })

    it('rejects email without domain', () => {
      expect(emailSchema.safeParse('test@').success).toBe(false)
    })

    it('rejects email without @', () => {
      expect(emailSchema.safeParse('testexample.com').success).toBe(false)
    })
  })

  describe('georgianPhoneSchema', () => {
    it('accepts 9-digit number', () => {
      expect(georgianPhoneSchema.safeParse('555123456').success).toBe(true)
    })

    it('accepts number with +995', () => {
      expect(georgianPhoneSchema.safeParse('+995555123456').success).toBe(true)
    })

    it('accepts number with 995', () => {
      expect(georgianPhoneSchema.safeParse('995555123456').success).toBe(true)
    })

    it('rejects short number', () => {
      expect(georgianPhoneSchema.safeParse('12345').success).toBe(false)
    })

    it('rejects number with letters', () => {
      expect(georgianPhoneSchema.safeParse('555abc456').success).toBe(false)
    })
  })

  describe('loginSchema', () => {
    it('accepts valid login credentials', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('orderSchema', () => {
    const validOrder = {
      customerName: 'John Doe',
      customerPhone: '555123456',
      customerAddress: '123 Main Street, Tbilisi',
      city: 'Tbilisi',
      productName: 'Test Product',
      quantity: 1,
    }

    it('accepts valid order', () => {
      const result = orderSchema.safeParse(validOrder)
      expect(result.success).toBe(true)
    })

    it('rejects short customer name', () => {
      const result = orderSchema.safeParse({
        ...validOrder,
        customerName: 'J',
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid phone', () => {
      const result = orderSchema.safeParse({
        ...validOrder,
        customerPhone: '123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects short address', () => {
      const result = orderSchema.safeParse({
        ...validOrder,
        customerAddress: '123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty product name', () => {
      const result = orderSchema.safeParse({
        ...validOrder,
        productName: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects quantity less than 1', () => {
      const result = orderSchema.safeParse({
        ...validOrder,
        quantity: 0,
      })
      expect(result.success).toBe(false)
    })

    it('uses default city when not provided', () => {
      const result = orderSchema.safeParse({
        customerName: 'John Doe',
        customerPhone: '555123456',
        customerAddress: '123 Main Street',
        productName: 'Test Product',
        quantity: 1,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.city).toBe('Tbilisi')
      }
    })

    it('uses default quantity when not provided', () => {
      const result = orderSchema.safeParse({
        customerName: 'John Doe',
        customerPhone: '555123456',
        customerAddress: '123 Main Street',
        productName: 'Test Product',
        city: 'Tbilisi',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.quantity).toBe(1)
      }
    })
  })

  describe('isValidGeorgianPhone', () => {
    it('returns true for valid phone', () => {
      expect(isValidGeorgianPhone('555123456')).toBe(true)
    })

    it('returns true for phone with +995', () => {
      expect(isValidGeorgianPhone('+995555123456')).toBe(true)
    })

    it('returns false for invalid phone', () => {
      expect(isValidGeorgianPhone('123')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidGeorgianPhone('')).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    it('returns true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('returns false for invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isValidEmail('')).toBe(false)
    })

    it('returns true for complex valid email', () => {
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true)
    })
  })
})
