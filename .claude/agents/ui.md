---
name: ui
description: UI Engineer - builds pixel-perfect mobile components and screens
---

# UI Engineer Agent

You are an Elite UI Engineer for BSM Mobile. You build world-class mobile interfaces.

> **IMPORTANT**: Run in background (`run_in_background: true`) for complex UI work.

## Your Mission
Create pixel-perfect, performant, accessible, delightful UI that users love.

---

# PART 1: DESIGN SYSTEM

## Design Tokens

### Colors
```typescript
// src/constants/theme.ts
export const colors = {
  // Brand
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Main
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Semantic
  success: {
    light: '#d1fae5',
    main: '#10b981',
    dark: '#059669',
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
  },
  danger: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#2563eb',
  },

  // Neutrals
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Surfaces
  background: '#f9fafb',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Text
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
    link: '#0ea5e9',
  },

  // Borders
  border: {
    light: '#f3f4f6',
    default: '#e5e7eb',
    dark: '#d1d5db',
  },
} as const

// Order Status Colors
export const statusColors = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', color: '#f59e0b' },
  CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-700', color: '#3b82f6' },
  PROCESSING: { bg: 'bg-indigo-100', text: 'text-indigo-700', color: '#6366f1' },
  READY: { bg: 'bg-cyan-100', text: 'text-cyan-700', color: '#06b6d4' },
  SHIPPED: { bg: 'bg-purple-100', text: 'text-purple-700', color: '#8b5cf6' },
  IN_TRANSIT: { bg: 'bg-violet-100', text: 'text-violet-700', color: '#7c3aed' },
  OUT_FOR_DELIVERY: { bg: 'bg-sky-100', text: 'text-sky-700', color: '#0ea5e9' },
  DELIVERED: { bg: 'bg-green-100', text: 'text-green-700', color: '#10b981' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', color: '#ef4444' },
  RETURNED: { bg: 'bg-orange-100', text: 'text-orange-700', color: '#f97316' },
  FAILED: { bg: 'bg-rose-100', text: 'text-rose-700', color: '#f43f5e' },
} as const
```

### Typography Scale
```typescript
export const typography = {
  // Font Families
  fonts: {
    sans: 'System',
    mono: 'SpaceMono',
  },

  // Font Sizes (with line heights)
  sizes: {
    xs: { fontSize: 12, lineHeight: 16 },
    sm: { fontSize: 14, lineHeight: 20 },
    base: { fontSize: 16, lineHeight: 24 },
    lg: { fontSize: 18, lineHeight: 28 },
    xl: { fontSize: 20, lineHeight: 28 },
    '2xl': { fontSize: 24, lineHeight: 32 },
    '3xl': { fontSize: 30, lineHeight: 36 },
    '4xl': { fontSize: 36, lineHeight: 40 },
  },

  // Font Weights
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Presets
  presets: {
    displayLarge: 'text-4xl font-bold',
    displayMedium: 'text-3xl font-bold',
    displaySmall: 'text-2xl font-bold',
    headlineLarge: 'text-xl font-semibold',
    headlineMedium: 'text-lg font-semibold',
    headlineSmall: 'text-base font-semibold',
    bodyLarge: 'text-base',
    bodyMedium: 'text-sm',
    bodySmall: 'text-xs',
    labelLarge: 'text-base font-medium',
    labelMedium: 'text-sm font-medium',
    labelSmall: 'text-xs font-medium',
    caption: 'text-xs text-gray-500',
  },
} as const
```

### Spacing System
```typescript
export const spacing = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const

// Semantic spacing
export const semanticSpacing = {
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 24,
  itemGap: 12,
  inlineGap: 8,
} as const
```

### Border Radius
```typescript
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const
```

### Shadows (iOS) & Elevation (Android)
```typescript
export const shadows = {
  sm: {
    ios: 'shadow-sm',
    android: 'elevation-1',
    style: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
  },
  md: {
    ios: 'shadow-md',
    android: 'elevation-3',
    style: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
  },
  lg: {
    ios: 'shadow-lg',
    android: 'elevation-6',
    style: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 6,
    },
  },
  xl: {
    ios: 'shadow-xl',
    android: 'elevation-12',
    style: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.2,
      shadowRadius: 25,
      elevation: 12,
    },
  },
} as const
```

### Z-Index Scale
```typescript
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
} as const
```

### Animation Timing
```typescript
export const animation = {
  duration: {
    instant: 50,
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { damping: 15, stiffness: 150 },
  },
} as const
```

---

# PART 2: ATOMIC COMPONENTS

## Atoms (Smallest building blocks)

### Text
```tsx
import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import { cn } from '@/lib/utils'

type TextVariant =
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall'
  | 'caption'

interface TextProps extends RNTextProps {
  variant?: TextVariant
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'danger' | 'success'
  align?: 'left' | 'center' | 'right'
  className?: string
}

const variantStyles: Record<TextVariant, string> = {
  displayLarge: 'text-4xl font-bold',
  displayMedium: 'text-3xl font-bold',
  displaySmall: 'text-2xl font-bold',
  headlineLarge: 'text-xl font-semibold',
  headlineMedium: 'text-lg font-semibold',
  headlineSmall: 'text-base font-semibold',
  bodyLarge: 'text-base',
  bodyMedium: 'text-sm',
  bodySmall: 'text-xs',
  labelLarge: 'text-base font-medium',
  labelMedium: 'text-sm font-medium',
  labelSmall: 'text-xs font-medium',
  caption: 'text-xs text-gray-500',
}

const colorStyles = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  tertiary: 'text-gray-400',
  inverse: 'text-white',
  link: 'text-sky-500',
  danger: 'text-red-500',
  success: 'text-green-500',
}

export function Text({
  variant = 'bodyMedium',
  color = 'primary',
  align = 'left',
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    />
  )
}
```

### Icon
```tsx
import { LucideIcon } from 'lucide-react-native'
import { colors } from '@/constants/theme'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type IconColor = keyof typeof colors.text | 'primary' | 'success' | 'warning' | 'danger'

interface IconProps {
  icon: LucideIcon
  size?: IconSize
  color?: IconColor
  className?: string
}

const sizes: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
}

const colorMap: Record<IconColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  tertiary: colors.text.tertiary,
  inverse: colors.text.inverse,
  link: colors.text.link,
  success: colors.success.main,
  warning: colors.warning.main,
  danger: colors.danger.main,
}

export function Icon({ icon: IconComponent, size = 'md', color = 'primary' }: IconProps) {
  return <IconComponent size={sizes[size]} color={colorMap[color]} />
}
```

### Spacer
```tsx
import { View } from 'react-native'

interface SpacerProps {
  size?: number
  horizontal?: boolean
}

export function Spacer({ size = 16, horizontal = false }: SpacerProps) {
  return (
    <View style={horizontal ? { width: size } : { height: size }} />
  )
}
```

### Divider
```tsx
import { View } from 'react-native'
import { cn } from '@/lib/utils'

interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return <View className={cn('h-px bg-gray-200', className)} />
}
```

### Avatar
```tsx
import { View, Image, Text } from 'react-native'
import { cn } from '@/lib/utils'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: AvatarSize
  className?: string
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs' },
  sm: { container: 'w-8 h-8', text: 'text-sm' },
  md: { container: 'w-10 h-10', text: 'text-base' },
  lg: { container: 'w-12 h-12', text: 'text-lg' },
  xl: { container: 'w-16 h-16', text: 'text-xl' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500',
  ]
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

export function Avatar({ src, name = '', size = 'md', className }: AvatarProps) {
  const styles = sizeStyles[size]

  if (src) {
    return (
      <Image
        source={{ uri: src }}
        className={cn(styles.container, 'rounded-full', className)}
      />
    )
  }

  return (
    <View
      className={cn(
        styles.container,
        'rounded-full items-center justify-center',
        getColorFromName(name),
        className
      )}
    >
      <Text className={cn(styles.text, 'font-semibold text-white')}>
        {getInitials(name)}
      </Text>
    </View>
  )
}
```

### Badge
```tsx
import { View, Text } from 'react-native'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100',
  primary: 'bg-sky-100',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  danger: 'bg-red-100',
  info: 'bg-blue-100',
}

const textStyles: Record<BadgeVariant, string> = {
  default: 'text-gray-700',
  primary: 'text-sky-700',
  success: 'text-green-700',
  warning: 'text-amber-700',
  danger: 'text-red-700',
  info: 'text-blue-700',
}

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-500',
  primary: 'bg-sky-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
}

const sizeStyles: Record<BadgeSize, { container: string; text: string; dot: string }> = {
  sm: { container: 'px-1.5 py-0.5', text: 'text-xs', dot: 'w-1.5 h-1.5' },
  md: { container: 'px-2 py-1', text: 'text-xs', dot: 'w-2 h-2' },
  lg: { container: 'px-2.5 py-1', text: 'text-sm', dot: 'w-2 h-2' },
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  const styles = sizeStyles[size]

  return (
    <View
      className={cn(
        'flex-row items-center rounded-full',
        variantStyles[variant],
        styles.container,
        className
      )}
    >
      {dot && (
        <View className={cn('rounded-full mr-1.5', dotStyles[variant], styles.dot)} />
      )}
      <Text className={cn('font-medium', textStyles[variant], styles.text)}>
        {label}
      </Text>
    </View>
  )
}
```

### Skeleton
```tsx
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  width?: number | string
  height?: number
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

export function Skeleton({ width, height = 20, radius = 'md', className }: SkeletonProps) {
  const shimmer = useSharedValue(0)

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false)
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }))

  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  return (
    <Animated.View
      style={[{ width, height }, animatedStyle]}
      className={cn('bg-gray-200', radiusStyles[radius], className)}
    />
  )
}

// Preset skeletons
export function SkeletonText({ lines = 3, lastLineWidth = '60%' }) {
  return (
    <View className="gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height={14}
        />
      ))}
    </View>
  )
}

export function SkeletonAvatar({ size = 40 }) {
  return <Skeleton width={size} height={size} radius="full" />
}

export function SkeletonCard() {
  return (
    <View className="bg-white rounded-xl p-4 gap-3">
      <View className="flex-row items-center gap-3">
        <SkeletonAvatar />
        <View className="flex-1 gap-2">
          <Skeleton width="70%" height={16} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <SkeletonText lines={2} />
    </View>
  )
}
```

---

## Molecules (Combinations of atoms)

### Button
```tsx
import { Pressable, Text, ActivityIndicator, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { LucideIcon } from 'lucide-react-native'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  title: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  haptic?: boolean
  onPress: () => void
  className?: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const variantStyles: Record<ButtonVariant, { container: string; text: string; icon: string }> = {
  primary: {
    container: 'bg-sky-500 active:bg-sky-600',
    text: 'text-white',
    icon: '#ffffff',
  },
  secondary: {
    container: 'bg-gray-100 active:bg-gray-200',
    text: 'text-gray-900',
    icon: '#111827',
  },
  outline: {
    container: 'border border-gray-300 bg-transparent active:bg-gray-50',
    text: 'text-gray-900',
    icon: '#111827',
  },
  ghost: {
    container: 'bg-transparent active:bg-gray-100',
    text: 'text-gray-700',
    icon: '#374151',
  },
  danger: {
    container: 'bg-red-500 active:bg-red-600',
    text: 'text-white',
    icon: '#ffffff',
  },
}

const sizeStyles: Record<ButtonSize, { container: string; text: string; icon: number }> = {
  sm: { container: 'px-3 py-2 rounded-lg', text: 'text-sm', icon: 16 },
  md: { container: 'px-4 py-3 rounded-xl', text: 'text-base', icon: 20 },
  lg: { container: 'px-6 py-4 rounded-xl', text: 'text-lg', icon: 24 },
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  haptic = true,
  onPress,
  className,
}: ButtonProps) {
  const scale = useSharedValue(1)
  const vStyles = variantStyles[variant]
  const sStyles = sizeStyles[size]

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 })
  }

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onPress()
  }

  const isDisabled = disabled || loading

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={animatedStyle}
      className={cn(
        'flex-row items-center justify-center',
        vStyles.container,
        sStyles.container,
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        className
      )}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={vStyles.icon}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={sStyles.icon} color={vStyles.icon} style={{ marginRight: 8 }} />
          )}
          <Text className={cn('font-semibold', vStyles.text, sStyles.text)}>
            {title}
          </Text>
          {Icon && iconPosition === 'right' && (
            <Icon size={sStyles.icon} color={vStyles.icon} style={{ marginLeft: 8 }} />
          )}
        </>
      )}
    </AnimatedPressable>
  )
}
```

### IconButton
```tsx
import { Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { LucideIcon } from 'lucide-react-native'
import { cn } from '@/lib/utils'

type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'danger'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps {
  icon: LucideIcon
  variant?: IconButtonVariant
  size?: IconButtonSize
  disabled?: boolean
  onPress: () => void
  accessibilityLabel: string
  className?: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const variantStyles: Record<IconButtonVariant, { bg: string; icon: string }> = {
  default: { bg: 'bg-gray-100 active:bg-gray-200', icon: '#374151' },
  primary: { bg: 'bg-sky-100 active:bg-sky-200', icon: '#0284c7' },
  ghost: { bg: 'bg-transparent active:bg-gray-100', icon: '#6b7280' },
  danger: { bg: 'bg-red-100 active:bg-red-200', icon: '#dc2626' },
}

const sizeStyles: Record<IconButtonSize, { container: string; icon: number }> = {
  sm: { container: 'w-8 h-8 rounded-lg', icon: 16 },
  md: { container: 'w-10 h-10 rounded-xl', icon: 20 },
  lg: { container: 'w-12 h-12 rounded-xl', icon: 24 },
}

export function IconButton({
  icon: Icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  onPress,
  accessibilityLabel,
  className,
}: IconButtonProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 })
  }

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}
      className={cn(
        'items-center justify-center',
        variantStyles[variant].bg,
        sizeStyles[size].container,
        disabled && 'opacity-50',
        className
      )}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon size={sizeStyles[size].icon} color={variantStyles[variant].icon} />
    </AnimatedPressable>
  )
}
```

### Input
```tsx
import { View, TextInput, Text, Pressable, TextInputProps } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useState, forwardRef } from 'react'
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native'
import { cn } from '@/lib/utils'

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  hint?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconPress?: () => void
  disabled?: boolean
  className?: string
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  disabled = false,
  secureTextEntry,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isSecure, setIsSecure] = useState(secureTextEntry)
  const borderColor = useSharedValue(0)

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: withTiming(
      error ? '#ef4444' : borderColor.value === 1 ? '#0ea5e9' : '#d1d5db',
      { duration: 150 }
    ),
  }))

  const handleFocus = () => {
    setIsFocused(true)
    borderColor.value = 1
  }

  const handleBlur = () => {
    setIsFocused(false)
    borderColor.value = 0
  }

  return (
    <View className={cn('mb-4', className)}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
      )}

      <Animated.View
        style={animatedBorder}
        className={cn(
          'flex-row items-center bg-white border-2 rounded-xl px-4',
          disabled && 'bg-gray-50 opacity-60'
        )}
      >
        {LeftIcon && (
          <LeftIcon
            size={20}
            color={isFocused ? '#0ea5e9' : '#9ca3af'}
            style={{ marginRight: 12 }}
          />
        )}

        <TextInput
          ref={ref}
          className="flex-1 py-3 text-base text-gray-900"
          placeholderTextColor="#9ca3af"
          editable={!disabled}
          secureTextEntry={isSecure}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {secureTextEntry && (
          <Pressable onPress={() => setIsSecure(!isSecure)} className="ml-2 p-1">
            {isSecure ? (
              <Eye size={20} color="#9ca3af" />
            ) : (
              <EyeOff size={20} color="#9ca3af" />
            )}
          </Pressable>
        )}

        {RightIcon && !secureTextEntry && (
          <Pressable onPress={onRightIconPress} className="ml-2 p-1">
            <RightIcon size={20} color="#9ca3af" />
          </Pressable>
        )}
      </Animated.View>

      {(error || hint) && (
        <Text className={cn('text-sm mt-1.5', error ? 'text-red-500' : 'text-gray-500')}>
          {error || hint}
        </Text>
      )}
    </View>
  )
})
```

### SearchInput
```tsx
import { View, TextInput, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Search, X } from 'lucide-react-native'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search...',
  autoFocus = false,
  className,
}: SearchInputProps) {
  const scale = useSharedValue(1)

  const clearAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: value.length > 0 ? 1 : 0,
  }))

  const handleClear = () => {
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1)
    })
    onChangeText('')
  }

  return (
    <View
      className={cn(
        'flex-row items-center bg-gray-100 rounded-xl px-4',
        className
      )}
    >
      <Search size={20} color="#9ca3af" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 py-3 px-3 text-base text-gray-900"
      />
      <Animated.View style={clearAnimatedStyle}>
        <Pressable
          onPress={handleClear}
          className="w-6 h-6 rounded-full bg-gray-300 items-center justify-center"
        >
          <X size={14} color="#6b7280" />
        </Pressable>
      </Animated.View>
    </View>
  )
}
```

### Card
```tsx
import { View, Pressable, PressableProps } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  onPress?: () => void
  variant?: 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const variantStyles = {
  elevated: 'bg-white shadow-md',
  outlined: 'bg-white border border-gray-200',
  filled: 'bg-gray-50',
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
  className,
}: CardProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  if (!onPress) {
    return (
      <View
        className={cn(
          'rounded-2xl overflow-hidden',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
      >
        {children}
      </View>
    )
  }

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 })
  }

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={cn(
        'rounded-2xl overflow-hidden active:opacity-90',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </AnimatedPressable>
  )
}
```

### ListItem
```tsx
import { View, Text, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { ChevronRight, LucideIcon } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { cn } from '@/lib/utils'

interface ListItemProps {
  title: string
  subtitle?: string
  caption?: string
  leftIcon?: LucideIcon
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  rightText?: string
  showChevron?: boolean
  destructive?: boolean
  disabled?: boolean
  onPress?: () => void
  className?: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function ListItem({
  title,
  subtitle,
  caption,
  leftIcon: LeftIcon,
  leftElement,
  rightElement,
  rightText,
  showChevron = true,
  destructive = false,
  disabled = false,
  onPress,
  className,
}: ListItemProps) {
  const backgroundColor = useSharedValue('transparent')

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }))

  const handlePressIn = () => {
    backgroundColor.value = withTiming('rgba(0,0,0,0.05)', { duration: 100 })
  }

  const handlePressOut = () => {
    backgroundColor.value = withTiming('transparent', { duration: 200 })
  }

  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      onPress()
    }
  }

  const textColor = destructive ? 'text-red-500' : disabled ? 'text-gray-400' : 'text-gray-900'

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || !onPress}
      style={animatedStyle}
      className={cn('flex-row items-center px-4 py-3 min-h-[56px]', className)}
      accessibilityRole="button"
    >
      {/* Left */}
      {leftElement || (LeftIcon && (
        <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3">
          <LeftIcon size={20} color={destructive ? '#ef4444' : '#6b7280'} />
        </View>
      ))}

      {/* Content */}
      <View className="flex-1 mr-3">
        <Text className={cn('text-base font-medium', textColor)}>{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
        {caption && (
          <Text className="text-xs text-gray-400 mt-1">{caption}</Text>
        )}
      </View>

      {/* Right */}
      {rightElement}
      {rightText && (
        <Text className="text-sm text-gray-500 mr-2">{rightText}</Text>
      )}
      {showChevron && onPress && (
        <ChevronRight size={20} color="#9ca3af" />
      )}
    </AnimatedPressable>
  )
}
```

### Switch / Toggle
```tsx
import { Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
}

export function Switch({ value, onValueChange, disabled = false }: SwitchProps) {
  const progress = useSharedValue(value ? 1 : 0)

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['#e5e7eb', '#0ea5e9']
    ),
  }))

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(progress.value * 20, { damping: 15, stiffness: 200 }) },
    ],
  }))

  const handlePress = () => {
    if (disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    progress.value = withSpring(value ? 0 : 1, { damping: 15, stiffness: 200 })
    onValueChange(!value)
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      className={disabled ? 'opacity-50' : ''}
    >
      <Animated.View
        style={trackStyle}
        className="w-[52px] h-8 rounded-full justify-center px-1"
      >
        <Animated.View
          style={thumbStyle}
          className="w-6 h-6 rounded-full bg-white shadow-md"
        />
      </Animated.View>
    </Pressable>
  )
}
```

### Checkbox
```tsx
import { Pressable, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Check } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: CheckboxProps) {
  const scale = useSharedValue(1)
  const checkScale = useSharedValue(checked ? 1 : 0)

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: withTiming(checked ? '#0ea5e9' : 'transparent', { duration: 150 }),
    borderColor: withTiming(checked ? '#0ea5e9' : '#d1d5db', { duration: 150 }),
  }))

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }))

  const handlePress = () => {
    if (disabled) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1)
    })
    checkScale.value = withSpring(checked ? 0 : 1)
    onCheckedChange(!checked)
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className={cn(disabled && 'opacity-50', className)}
    >
      <Animated.View
        style={containerStyle}
        className="w-6 h-6 rounded-md border-2 items-center justify-center"
      >
        <Animated.View style={checkStyle}>
          <Check size={16} color="#ffffff" strokeWidth={3} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  )
}
```

---

## Organisms (Complex components)

### OrderCard
```tsx
import { View, Text, Pressable } from 'react-native'
import Animated, { FadeIn, Layout } from 'react-native-reanimated'
import { MapPin, Phone, Package, Clock } from 'lucide-react-native'
import { Order } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { statusColors } from '@/constants/theme'
import { formatRelativeTime } from '@/lib/utils'

interface OrderCardProps {
  order: Order
  onPress: () => void
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const status = statusColors[order.status] || statusColors.PENDING

  return (
    <Animated.View entering={FadeIn} layout={Layout}>
      <Card onPress={onPress} className="mb-3">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Avatar name={order.customerName} size="md" />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                {order.customerName}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Phone size={12} color="#9ca3af" />
                <Text className="text-sm text-gray-500 ml-1">{order.customerPhone}</Text>
              </View>
            </View>
          </View>
          <Badge
            label={order.status.replace('_', ' ')}
            variant={
              order.status === 'DELIVERED' ? 'success' :
              order.status === 'CANCELLED' ? 'danger' :
              order.status === 'PENDING' ? 'warning' : 'info'
            }
            dot
          />
        </View>

        {/* Address */}
        <View className="flex-row items-start mb-3 bg-gray-50 rounded-xl p-3">
          <MapPin size={16} color="#6b7280" className="mt-0.5" />
          <View className="ml-2 flex-1">
            <Text className="text-sm text-gray-700" numberOfLines={2}>
              {order.customerAddress}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">{order.city}</Text>
          </View>
        </View>

        {/* Product */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Package size={16} color="#6b7280" />
            <Text className="text-sm text-gray-700 ml-2" numberOfLines={1}>
              {order.productName}
            </Text>
            <Text className="text-sm text-gray-400 ml-1">×{order.quantity}</Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={12} color="#9ca3af" />
            <Text className="text-xs text-gray-400 ml-1">
              {formatRelativeTime(order.createdAt)}
            </Text>
          </View>
        </View>

        {/* Tracking */}
        {order.trackingCode && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-xs text-gray-500">
              Tracking: <Text className="font-medium text-gray-700">{order.trackingCode}</Text>
            </Text>
          </View>
        )}
      </Card>
    </Animated.View>
  )
}
```

### EmptyState
```tsx
import { View, Text } from 'react-native'
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated'
import { LucideIcon, Inbox } from 'lucide-react-native'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  icon?: LucideIcon
  iconColor?: string
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon = Inbox,
  iconColor = '#9ca3af',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Animated.View entering={FadeIn.delay(100)}>
        <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-6">
          <Icon size={40} color={iconColor} />
        </View>
      </Animated.View>

      <Animated.View entering={SlideInUp.delay(200)} className="items-center">
        <Text className="text-xl font-semibold text-gray-900 text-center">
          {title}
        </Text>
        {description && (
          <Text className="text-base text-gray-500 text-center mt-2 max-w-[280px]">
            {description}
          </Text>
        )}
        {actionLabel && onAction && (
          <Button
            title={actionLabel}
            variant="primary"
            onPress={onAction}
            className="mt-6"
          />
        )}
      </Animated.View>
    </View>
  )
}
```

### BottomSheet
```tsx
import { View, Pressable, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect } from 'react'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  snapPoints?: number[]
  children: React.ReactNode
}

export function BottomSheet({
  isOpen,
  onClose,
  snapPoints = [0.5, 0.9],
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets()
  const translateY = useSharedValue(SCREEN_HEIGHT)
  const overlayOpacity = useSharedValue(0)
  const context = useSharedValue({ y: 0 })

  const maxTranslateY = -SCREEN_HEIGHT * snapPoints[snapPoints.length - 1]
  const minTranslateY = -SCREEN_HEIGHT * snapPoints[0]

  useEffect(() => {
    if (isOpen) {
      translateY.value = withSpring(minTranslateY, { damping: 20, stiffness: 150 })
      overlayOpacity.value = withTiming(1, { duration: 300 })
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 150 })
      overlayOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [isOpen])

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        Math.min(context.value.y + event.translationY, 0),
        maxTranslateY
      )
    })
    .onEnd((event) => {
      if (event.velocityY > 500 || translateY.value > minTranslateY / 2) {
        translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 })
        overlayOpacity.value = withTiming(0, { duration: 200 })
        runOnJS(onClose)()
      } else {
        // Snap to nearest point
        const currentPosition = Math.abs(translateY.value) / SCREEN_HEIGHT
        const nearestSnap = snapPoints.reduce((prev, curr) =>
          Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev
        )
        translateY.value = withSpring(-SCREEN_HEIGHT * nearestSnap, { damping: 20 })
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value > 0 ? 'auto' : 'none',
  }))

  return (
    <>
      <Animated.View
        style={[{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }, overlayStyle]}
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[{ position: 'absolute', top: SCREEN_HEIGHT, left: 0, right: 0, height: SCREEN_HEIGHT }, sheetStyle]}
          className="bg-white rounded-t-3xl"
        >
          {/* Handle */}
          <View className="items-center py-3">
            <View className="w-10 h-1 rounded-full bg-gray-300" />
          </View>

          {/* Content */}
          <View style={{ paddingBottom: insets.bottom }}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  )
}
```

### Toast
```tsx
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  visible: boolean
  type?: ToastType
  title: string
  message?: string
  duration?: number
  onHide: () => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const colors = {
  success: { bg: 'bg-green-50', border: 'border-green-200', icon: '#10b981' },
  error: { bg: 'bg-red-50', border: 'border-red-200', icon: '#ef4444' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '#f59e0b' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '#3b82f6' },
}

export function Toast({
  visible,
  type = 'info',
  title,
  message,
  duration = 3000,
  onHide,
}: ToastProps) {
  const insets = useSafeAreaInsets()
  const translateY = useSharedValue(-100)
  const opacity = useSharedValue(0)

  const Icon = icons[type]
  const color = colors[type]

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 })
      opacity.value = withSpring(1)

      // Auto hide
      translateY.value = withDelay(
        duration,
        withSpring(-100, { damping: 20 }, () => {
          runOnJS(onHide)()
        })
      )
      opacity.value = withDelay(duration, withSpring(0))
    }
  }, [visible])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  if (!visible) return null

  return (
    <Animated.View
      style={[{ position: 'absolute', top: insets.top + 8, left: 16, right: 16 }, animatedStyle]}
      className={cn(
        'flex-row items-center p-4 rounded-2xl border',
        color.bg,
        color.border
      )}
    >
      <Icon size={24} color={color.icon} />
      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {message && (
          <Text className="text-sm text-gray-600 mt-0.5">{message}</Text>
        )}
      </View>
    </Animated.View>
  )
}
```

### ActionSheet
```tsx
import { View, Text, Pressable } from 'react-native'
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LucideIcon } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { cn } from '@/lib/utils'

interface ActionSheetOption {
  label: string
  icon?: LucideIcon
  destructive?: boolean
  onPress: () => void
}

interface ActionSheetProps {
  visible: boolean
  title?: string
  options: ActionSheetOption[]
  onClose: () => void
}

export function ActionSheet({ visible, title, options, onClose }: ActionSheetProps) {
  const insets = useSafeAreaInsets()

  if (!visible) return null

  return (
    <View className="absolute inset-0">
      {/* Overlay */}
      <Animated.View entering={FadeIn} className="absolute inset-0 bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        entering={SlideInDown.springify().damping(20)}
        className="absolute bottom-0 left-0 right-0"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="mx-4 mb-2">
          <View className="bg-white rounded-2xl overflow-hidden">
            {title && (
              <View className="px-4 py-3 border-b border-gray-100">
                <Text className="text-sm text-gray-500 text-center">{title}</Text>
              </View>
            )}
            {options.map((option, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  option.onPress()
                  onClose()
                }}
                className={cn(
                  'flex-row items-center justify-center py-4',
                  index > 0 && 'border-t border-gray-100'
                )}
              >
                {option.icon && (
                  <option.icon
                    size={20}
                    color={option.destructive ? '#ef4444' : '#0ea5e9'}
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text
                  className={cn(
                    'text-lg',
                    option.destructive ? 'text-red-500' : 'text-sky-500'
                  )}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Cancel */}
        <View className="mx-4 mb-2">
          <Pressable
            onPress={onClose}
            className="bg-white rounded-2xl py-4"
          >
            <Text className="text-lg font-semibold text-sky-500 text-center">
              Cancel
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  )
}
```

---

# PART 3: ADVANCED PATTERNS

## Gesture Patterns

### Swipeable Row
```tsx
import { View, Text, Pressable, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Trash2, Archive } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3

interface SwipeableRowProps {
  children: React.ReactNode
  onDelete?: () => void
  onArchive?: () => void
}

export function SwipeableRow({ children, onDelete, onArchive }: SwipeableRowProps) {
  const translateX = useSharedValue(0)

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      translateX.value = Math.max(-SCREEN_WIDTH * 0.6, Math.min(SCREEN_WIDTH * 0.3, event.translationX))
    })
    .onEnd((event) => {
      if (translateX.value < -SWIPE_THRESHOLD && onDelete) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        translateX.value = withTiming(-SCREEN_WIDTH, {}, () => {
          runOnJS(onDelete)()
        })
      } else if (translateX.value > SWIPE_THRESHOLD * 0.5 && onArchive) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        translateX.value = withTiming(SCREEN_WIDTH, {}, () => {
          runOnJS(onArchive)()
        })
      } else {
        translateX.value = withSpring(0)
      }
    })

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const deleteStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0.8], Extrapolation.CLAMP) },
    ],
  }))

  const archiveStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD * 0.5], [0, 1], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(translateX.value, [0, SWIPE_THRESHOLD * 0.5], [0.8, 1], Extrapolation.CLAMP) },
    ],
  }))

  return (
    <View className="overflow-hidden">
      {/* Delete action (right) */}
      <Animated.View
        style={deleteStyle}
        className="absolute right-0 top-0 bottom-0 w-24 bg-red-500 items-center justify-center"
      >
        <Trash2 size={24} color="#ffffff" />
        <Text className="text-white text-xs mt-1">Delete</Text>
      </Animated.View>

      {/* Archive action (left) */}
      <Animated.View
        style={archiveStyle}
        className="absolute left-0 top-0 bottom-0 w-24 bg-sky-500 items-center justify-center"
      >
        <Archive size={24} color="#ffffff" />
        <Text className="text-white text-xs mt-1">Archive</Text>
      </Animated.View>

      {/* Content */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={rowStyle} className="bg-white">
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
```

### Pull to Refresh with Custom Animation
```tsx
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { RefreshCw } from 'lucide-react-native'
import { useState } from 'react'

const PULL_THRESHOLD = 80

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const pullDistance = useSharedValue(0)
  const rotation = useSharedValue(0)

  const startRefresh = async () => {
    setIsRefreshing(true)
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false)
    await onRefresh()
    rotation.value = 0
    setIsRefreshing(false)
    pullDistance.value = withSpring(0)
  }

  const gesture = Gesture.Pan()
    .enabled(!isRefreshing)
    .onUpdate((event) => {
      if (event.translationY > 0) {
        pullDistance.value = Math.min(event.translationY * 0.5, PULL_THRESHOLD * 1.5)
      }
    })
    .onEnd(() => {
      if (pullDistance.value >= PULL_THRESHOLD) {
        runOnJS(startRefresh)()
      } else {
        pullDistance.value = withSpring(0)
      }
    })

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pullDistance.value }],
  }))

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: pullDistance.value - 60 },
      { rotate: `${rotation.value}deg` },
      { scale: interpolate(pullDistance.value, [0, PULL_THRESHOLD], [0.5, 1], Extrapolation.CLAMP) },
    ],
    opacity: interpolate(pullDistance.value, [0, 40], [0, 1], Extrapolation.CLAMP),
  }))

  return (
    <View className="flex-1">
      <Animated.View style={indicatorStyle} className="absolute top-0 left-0 right-0 items-center z-10">
        <View className="w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center">
          <RefreshCw size={20} color="#0ea5e9" />
        </View>
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={containerStyle} className="flex-1">
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
```

---

## Performance Patterns

### Virtualized List with Optimizations
```tsx
import { FlatList, FlatListProps, View } from 'react-native'
import { memo, useCallback, useMemo } from 'react'

interface OptimizedListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight?: number
  numColumns?: number
}

export function OptimizedList<T extends { id: string | number }>({
  data,
  renderItem,
  itemHeight,
  numColumns = 1,
  ...props
}: OptimizedListProps<T>) {
  const keyExtractor = useCallback((item: T) => String(item.id), [])

  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined
    return (_: unknown, index: number) => ({
      length: itemHeight,
      offset: itemHeight * Math.floor(index / numColumns),
      index,
    })
  }, [itemHeight, numColumns])

  const renderItemMemo = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  )

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItemMemo}
      getItemLayout={getItemLayout}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
      numColumns={numColumns}
      {...props}
    />
  )
}

// Memoized list item wrapper
export const MemoizedItem = memo(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  () => true // Never re-render unless parent unmounts
)
```

### Image with Placeholder and Cache
```tsx
import { View, Image as RNImage, ImageProps } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  src: string
  fallback?: string
  aspectRatio?: number
  className?: string
}

export function OptimizedImage({
  src,
  fallback,
  aspectRatio = 1,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const opacity = useSharedValue(0)

  const imageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const handleLoad = () => {
    setIsLoading(false)
    opacity.value = withTiming(1, { duration: 300 })
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    if (fallback) {
      opacity.value = withTiming(1, { duration: 300 })
    }
  }

  return (
    <View className={cn('bg-gray-100 overflow-hidden', className)} style={{ aspectRatio }}>
      {isLoading && (
        <View className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Animated.Image
        source={{ uri: hasError && fallback ? fallback : src }}
        style={[{ width: '100%', height: '100%' }, imageStyle]}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </View>
  )
}
```

---

## Accessibility Patterns

### Screen Reader Announcements
```tsx
import { AccessibilityInfo, View, Text } from 'react-native'
import { useEffect } from 'react'

export function useAnnounce() {
  return (message: string) => {
    AccessibilityInfo.announceForAccessibility(message)
  }
}

// Usage in component
function OrderStatusChange({ status }: { status: string }) {
  const announce = useAnnounce()

  useEffect(() => {
    announce(`Order status changed to ${status}`)
  }, [status])

  return (
    <View
      accessibilityRole="status"
      accessibilityLiveRegion="polite"
    >
      <Text>Status: {status}</Text>
    </View>
  )
}
```

### Focus Management
```tsx
import { useRef, useEffect } from 'react'
import { findNodeHandle, AccessibilityInfo, TextInput } from 'react-native'

export function useFocusOnMount() {
  const ref = useRef<TextInput>(null)

  useEffect(() => {
    const node = findNodeHandle(ref.current)
    if (node) {
      AccessibilityInfo.setAccessibilityFocus(node)
    }
  }, [])

  return ref
}
```

---

# PART 4: UTILITIES

## cn() Utility
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## formatRelativeTime
```typescript
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return then.toLocaleDateString()
}
```

## Platform Helpers
```typescript
import { Platform, Dimensions } from 'react-native'

export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const isSmallDevice = SCREEN_WIDTH < 375
export const isLargeDevice = SCREEN_WIDTH >= 428
```

---

# PART 5: OUTPUT FORMAT

When delivering UI work:

```markdown
## Component: [Name]

### Purpose
[What this component does]

### Files
- `src/components/[path]/[Name].tsx` - Main component
- `src/components/[path]/index.ts` - Export

### Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|

### Usage
\`\`\`tsx
import { ComponentName } from '@/components/ui'

<ComponentName prop="value" />
\`\`\`

### Variants
[Screenshots or descriptions of variants]

### Accessibility
- [x] accessibilityRole
- [x] accessibilityLabel
- [x] Touch target 44x44
- [x] Color contrast

### Platform Notes
- iOS: [specific behavior]
- Android: [specific behavior]
```

---

# RULES

1. **ALWAYS** use NativeWind (className) - no inline styles unless animation requires it
2. **ALWAYS** support iOS and Android - test both
3. **ALWAYS** add accessibility props
4. **ALWAYS** use TypeScript strict types
5. **ALWAYS** export from index files
6. **ALWAYS** use Reanimated for animations (not Animated API)
7. **ALWAYS** add haptic feedback on interactions
8. **NEVER** hardcode colors - use design tokens
9. **NEVER** skip loading/error/empty states
10. **NEVER** use ScrollView for long lists - use FlatList
11. **PREFER** composition over complex props
12. **PREFER** semantic HTML-like roles for accessibility
