import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  describe('rendering', () => {
    it('renders without label', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeTruthy()
    })

    it('renders with label', () => {
      render(<Input label="Email" placeholder="Enter email" />)
      expect(screen.getByText('Email')).toBeTruthy()
      expect(screen.getByPlaceholderText('Enter email')).toBeTruthy()
    })

    it('renders with error message', () => {
      render(<Input label="Email" error="Invalid email" />)
      expect(screen.getByText('Invalid email')).toBeTruthy()
    })

    it('renders with left icon', () => {
      const leftIcon = <Text testID="left-icon">L</Text>
      render(<Input leftIcon={leftIcon} />)
      expect(screen.getByTestId('left-icon')).toBeTruthy()
    })

    it('renders with right icon', () => {
      const rightIcon = <Text testID="right-icon">R</Text>
      render(<Input rightIcon={rightIcon} />)
      expect(screen.getByTestId('right-icon')).toBeTruthy()
    })

    it('renders with both icons', () => {
      const leftIcon = <Text testID="left-icon">L</Text>
      const rightIcon = <Text testID="right-icon">R</Text>
      render(<Input leftIcon={leftIcon} rightIcon={rightIcon} />)
      expect(screen.getByTestId('left-icon')).toBeTruthy()
      expect(screen.getByTestId('right-icon')).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('calls onChangeText when text changes', () => {
      const onChangeText = jest.fn()
      render(<Input onChangeText={onChangeText} placeholder="Type here" />)

      fireEvent.changeText(screen.getByPlaceholderText('Type here'), 'Hello')

      expect(onChangeText).toHaveBeenCalledWith('Hello')
    })

    it('calls onFocus when focused', () => {
      const onFocus = jest.fn()
      render(<Input onFocus={onFocus} placeholder="Focus me" />)

      fireEvent(screen.getByPlaceholderText('Focus me'), 'focus')

      expect(onFocus).toHaveBeenCalled()
    })

    it('calls onBlur when blurred', () => {
      const onBlur = jest.fn()
      render(<Input onBlur={onBlur} placeholder="Blur me" />)

      fireEvent(screen.getByPlaceholderText('Blur me'), 'blur')

      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('props passing', () => {
    it('passes value prop correctly', () => {
      render(<Input value="test value" placeholder="Enter text" />)
      expect(screen.getByDisplayValue('test value')).toBeTruthy()
    })

    it('passes editable prop correctly', () => {
      render(<Input editable={false} value="readonly" placeholder="Readonly" />)
      const input = screen.getByDisplayValue('readonly')
      expect(input.props.editable).toBe(false)
    })

    it('passes secureTextEntry prop correctly', () => {
      render(<Input secureTextEntry placeholder="Password" />)
      const input = screen.getByPlaceholderText('Password')
      expect(input.props.secureTextEntry).toBe(true)
    })

    it('passes keyboardType prop correctly', () => {
      render(<Input keyboardType="email-address" placeholder="Email" />)
      const input = screen.getByPlaceholderText('Email')
      expect(input.props.keyboardType).toBe('email-address')
    })

    it('passes autoCapitalize prop correctly', () => {
      render(<Input autoCapitalize="none" placeholder="No caps" />)
      const input = screen.getByPlaceholderText('No caps')
      expect(input.props.autoCapitalize).toBe('none')
    })
  })
})
