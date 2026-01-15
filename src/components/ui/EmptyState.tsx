import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-center text-xl font-semibold text-gray-800">{title}</Text>
      {description && (
        <Text className="mt-2 text-center text-gray-500">{description}</Text>
      )}
      {action && <View className="mt-6">{action}</View>}
    </View>
  );
}
