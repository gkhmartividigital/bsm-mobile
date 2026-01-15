import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  TextInputProps,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, style, ...props }, ref) => {
    return (
      <View className="w-full">
        {label && (
          <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
        )}
        <View
          className={`flex-row items-center rounded-lg border bg-white px-3 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className="flex-1 py-3 text-base text-gray-900"
            placeholderTextColor="#9ca3af"
            style={style}
            {...props}
          />
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
        {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';
