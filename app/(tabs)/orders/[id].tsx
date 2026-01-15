import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrder } from '@/hooks';
import { Button, Card, StatusBadge, ProviderBadge, LoadingScreen } from '@/components/ui';
import {
  formatPhone,
  formatDateTime,
  formatTimeSlot,
  formatPrice,
  formatEta,
} from '@/utils';
import { ORDER_STATUS } from '@/constants';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const orderId = parseInt(id, 10);

  const {
    order,
    isLoading,
    error,
    updateStatus,
    sendToWolt,
    markDelivered,
  } = useOrder(orderId);

  if (isLoading || !order) {
    return <LoadingScreen message="Loading order..." />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-lg text-red-500">{error}</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="outline"
          className="mt-4"
        />
      </SafeAreaView>
    );
  }

  const isWolt = order.shippingProvider === 'wolt';
  const hasTimeSlot = order.scheduleType === 'scheduled' && order.timeSlot;
  const canSendToWolt = isWolt && order.status === 'READY' && !order.woltOrderId;
  const canMarkDelivered = isWolt && order.woltOrderId && order.status !== 'DELIVERED';

  const handleStatusChange = async (status: keyof typeof ORDER_STATUS) => {
    const success = await updateStatus(status);
    if (success) {
      Alert.alert('Success', `Order status updated to ${status}`);
    } else {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleSendToWolt = async () => {
    Alert.alert(
      'Send to Wolt',
      'Are you sure you want to send this order to Wolt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            const success = await sendToWolt();
            if (success) {
              Alert.alert('Success', 'Order sent to Wolt');
            } else {
              Alert.alert('Error', 'Failed to send to Wolt');
            }
          },
        },
      ]
    );
  };

  const handleMarkDelivered = async () => {
    Alert.alert(
      'Mark Delivered',
      'Are you sure this order has been delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const success = await markDelivered();
            if (success) {
              Alert.alert('Success', 'Order marked as delivered');
            } else {
              Alert.alert('Error', 'Failed to mark delivered');
            }
          },
        },
      ]
    );
  };

  const openMap = () => {
    if (order.lat && order.lon) {
      const url = `https://www.google.com/maps?q=${order.lat},${order.lon}`;
      Linking.openURL(url);
    }
  };

  const openWoltTracking = () => {
    if (order.woltTrackingUrl) {
      Linking.openURL(order.woltTrackingUrl);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Order #${order.externalId || order.id}`,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
        }}
      />
      <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 p-4">
          {/* Status Header */}
          <Card variant="elevated" className="mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  #{order.externalId || order.id}
                </Text>
                <View className="mt-2 flex-row items-center gap-2">
                  <StatusBadge status={order.status} />
                  <ProviderBadge provider={order.shippingProvider} />
                </View>
              </View>
            </View>
          </Card>

          {/* Time Slot */}
          {hasTimeSlot && (
            <Card variant="outlined" className="mb-4 border-blue-200 bg-blue-50">
              <Text className="font-semibold text-blue-700">Scheduled Delivery</Text>
              <Text className="mt-1 text-blue-600">
                {formatTimeSlot(order.slotDate, order.timeSlot)}
              </Text>
            </Card>
          )}

          {/* Customer Info */}
          <Card variant="elevated" className="mb-4">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              Customer
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Name</Text>
                <Text className="font-medium text-gray-900">
                  {order.customerName}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Phone</Text>
                <Text className="font-medium text-gray-900">
                  {formatPhone(order.customerPhone)}
                </Text>
              </View>
              <View>
                <Text className="text-gray-500">Address</Text>
                <Text className="mt-1 font-medium text-gray-900">
                  {order.customerAddress}
                </Text>
                {order.lat && order.lon && (
                  <Button
                    title="Open in Maps"
                    variant="outline"
                    size="sm"
                    onPress={openMap}
                    className="mt-2"
                  />
                )}
              </View>
            </View>
          </Card>

          {/* Product Info */}
          <Card variant="elevated" className="mb-4">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              Product
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-gray-900">{order.productName}</Text>
              <Text className="font-medium text-gray-900">x{order.quantity}</Text>
            </View>
          </Card>

          {/* Wolt Info */}
          {isWolt && (
            <Card variant="elevated" className="mb-4 border-l-4 border-cyan-500">
              <Text className="mb-3 text-lg font-semibold text-cyan-700">
                Wolt Delivery
              </Text>
              <View className="space-y-2">
                {order.woltPrice && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500">Price</Text>
                    <Text className="font-medium text-gray-900">
                      {formatPrice(order.woltPrice)}
                    </Text>
                  </View>
                )}
                {order.woltEta && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500">ETA</Text>
                    <Text className="font-medium text-gray-900">
                      {formatEta(order.woltEta)}
                    </Text>
                  </View>
                )}
                {order.woltStatus && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500">Status</Text>
                    <Text className="font-medium text-cyan-600">
                      {order.woltStatus}
                    </Text>
                  </View>
                )}
                {order.woltTrackingUrl && (
                  <Button
                    title="Track Courier"
                    variant="primary"
                    size="sm"
                    onPress={openWoltTracking}
                    className="mt-2"
                  />
                )}
              </View>
            </Card>
          )}

          {/* Carrier Status (Trackings.ge) */}
          {order.carrierStatusText && (
            <Card variant="elevated" className="mb-4 border-l-4 border-purple-500">
              <Text className="mb-2 text-lg font-semibold text-purple-700">
                Carrier Status
              </Text>
              <Text className="text-gray-900">{order.carrierStatusText}</Text>
              {order.trackingCode && (
                <Text className="mt-1 text-sm text-gray-500">
                  Tracking: {order.trackingCode}
                </Text>
              )}
            </Card>
          )}

          {/* Timestamps */}
          <Card variant="outlined" className="mb-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Created</Text>
              <Text className="text-gray-900">
                {formatDateTime(order.createdAt)}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              <Text className="text-gray-500">Updated</Text>
              <Text className="text-gray-900">
                {formatDateTime(order.updatedAt)}
              </Text>
            </View>
          </Card>

          {/* Actions */}
          <Card variant="elevated" className="mb-8">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Actions
            </Text>

            {/* Status Change Buttons */}
            <View className="mb-4 flex-row flex-wrap gap-2">
              {order.status !== 'PENDING' && (
                <Button
                  title="Pending"
                  variant="secondary"
                  size="sm"
                  onPress={() => handleStatusChange('PENDING')}
                />
              )}
              {order.status !== 'READY' && (
                <Button
                  title="Ready"
                  variant="primary"
                  size="sm"
                  onPress={() => handleStatusChange('READY')}
                />
              )}
              {order.status !== 'SHIPPED' && !isWolt && (
                <Button
                  title="Shipped"
                  variant="secondary"
                  size="sm"
                  onPress={() => handleStatusChange('SHIPPED')}
                />
              )}
            </View>

            {/* Wolt Actions */}
            {canSendToWolt && (
              <Button
                title="Send to Wolt"
                variant="primary"
                fullWidth
                onPress={handleSendToWolt}
                className="mb-2"
              />
            )}

            {canMarkDelivered && (
              <Button
                title="Mark Delivered"
                variant="success"
                fullWidth
                onPress={handleMarkDelivered}
              />
            )}
          </Card>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
