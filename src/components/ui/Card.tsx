import React from 'react'
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  pressable?: boolean
  onPress?: () => void
  className?: string
  style?: StyleProp<ViewStyle>
}

export function Card({
  children,
  variant = 'default',
  pressable = false,
  onPress,
  className,
  style,
}: CardProps) {
  const baseStyles = 'rounded-xl p-4'

  const variantStyles = {
    default: 'bg-white',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className || ''}`

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={combinedClassName}
        style={style}
      >
        {children}
      </TouchableOpacity>
    )
  }

  return (
    <View className={combinedClassName} style={style}>
      {children}
    </View>
  )
}
