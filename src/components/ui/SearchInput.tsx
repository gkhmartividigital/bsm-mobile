import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  View,
  TextInput,
  Pressable,
  TextInputProps,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface SearchInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string
  onChangeText: (text: string) => void
  onDebouncedChange?: (text: string) => void
  debounceMs?: number
  placeholder?: string
  autoFocus?: boolean
}

export function SearchInput({
  value,
  onChangeText,
  onDebouncedChange,
  debounceMs = 300,
  placeholder = 'Search...',
  autoFocus = false,
  ...props
}: SearchInputProps) {
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced change handler
  useEffect(() => {
    if (onDebouncedChange) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      debounceTimer.current = setTimeout(() => {
        onDebouncedChange(value)
      }, debounceMs)
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [value, debounceMs, onDebouncedChange])

  const handleClear = useCallback(() => {
    onChangeText('')
    if (onDebouncedChange) {
      onDebouncedChange('')
    }
    inputRef.current?.focus()
  }, [onChangeText, onDebouncedChange])

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  return (
    <View
      className={`flex-row items-center rounded-xl border bg-white px-3 ${
        isFocused ? 'border-sky-500' : 'border-gray-200'
      }`}
    >
      <Ionicons
        name="search"
        size={20}
        color={isFocused ? '#0ea5e9' : '#9ca3af'}
      />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="ml-2 flex-1 py-3 text-base text-gray-900"
        accessibilityLabel="Search input"
        accessibilityHint="Type to search orders"
        {...props}
      />
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          className="ml-2 h-6 w-6 items-center justify-center rounded-full bg-gray-200"
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close" size={14} color="#6b7280" />
        </Pressable>
      )}
    </View>
  )
}
