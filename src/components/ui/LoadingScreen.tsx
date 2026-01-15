import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-bebias-dark">
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text className="mt-4 text-gray-400">{message}</Text>
    </View>
  );
}
