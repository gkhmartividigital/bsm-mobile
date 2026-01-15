import React from 'react';
import { View, ViewProps, TouchableOpacity } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  pressable?: boolean;
  onPress?: () => void;
}

export function Card({
  children,
  variant = 'default',
  pressable = false,
  onPress,
  className,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl p-4';

  const variantStyles = {
    default: 'bg-white',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className || ''}`;

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={combinedClassName}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={combinedClassName} {...props}>
      {children}
    </View>
  );
}
