import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '@/components/ui';

export default function ScanScreen() {
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center p-6">
        <Card variant="elevated" className="w-full items-center">
          <Text className="mb-4 text-6xl">📷</Text>
          <Text className="mb-2 text-xl font-bold text-gray-900">
            Barcode Scanner
          </Text>
          <Text className="mb-6 text-center text-gray-500">
            Scan order barcodes or QR codes to quickly find and update orders
          </Text>
          <Button
            title="Open Scanner"
            variant="primary"
            fullWidth
            onPress={() => {
              // TODO: Implement barcode scanning
              // This will use expo-camera with barcode scanning
            }}
          />
        </Card>

        <Text className="mt-8 text-center text-sm text-gray-400">
          Coming in Phase 2
        </Text>
      </View>
    </SafeAreaView>
  );
}
