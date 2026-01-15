import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, StatusBadge, ProviderBadge } from '@/components/ui';
import { Order } from '@/types';
import { formatPhone, formatRelativeTime, formatTimeSlot } from '@/utils';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();

  const hasTimeSlot = order.scheduleType === 'scheduled' && order.timeSlot;
  const isWolt = order.shippingProvider === 'wolt';

  return (
    <Card
      variant="elevated"
      pressable
      onPress={() => router.push(`/(tabs)/orders/${order.id}`)}
      className="mb-3"
    >
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-gray-900">
            #{order.externalId || order.id}
          </Text>
          <ProviderBadge provider={order.shippingProvider} />
        </View>
        <StatusBadge status={order.status} />
      </View>

      {/* Time Slot Banner */}
      {hasTimeSlot && (
        <View className="mb-3 rounded-lg bg-blue-50 p-2">
          <Text className="text-sm font-medium text-blue-700">
            Scheduled: {formatTimeSlot(order.slotDate, order.timeSlot)}
          </Text>
        </View>
      )}

      {/* Customer Info */}
      <View className="mb-2">
        <Text className="text-base font-semibold text-gray-800">
          {order.customerName}
        </Text>
        <Text className="text-sm text-gray-500">
          {formatPhone(order.customerPhone)}
        </Text>
      </View>

      {/* Address */}
      <Text className="mb-2 text-sm text-gray-600" numberOfLines={2}>
        {order.customerAddress}
      </Text>

      {/* Product */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-sm text-gray-700">
          {order.productName} x{order.quantity}
        </Text>
      </View>

      {/* Footer */}
      <View className="mt-2 flex-row items-center justify-between border-t border-gray-100 pt-2">
        {/* Wolt Info */}
        {isWolt && order.woltPrice && (
          <Text className="text-sm text-cyan-600">
            Wolt: {order.woltPrice} GEL
          </Text>
        )}

        {/* Carrier Status */}
        {order.carrierStatusText && (
          <Text className="text-sm text-purple-600">
            {order.carrierStatusText}
          </Text>
        )}

        {/* Time */}
        <Text className="text-xs text-gray-400">
          {formatRelativeTime(order.createdAt)}
        </Text>
      </View>
    </Card>
  );
}
