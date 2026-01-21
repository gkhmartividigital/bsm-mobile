import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
  Pressable,
} from 'react-native'
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useOrder } from '@/hooks'
import {
  Button,
  Card,
  StatusBadge,
  ProviderBadge,
  LoadingScreen,
  MapViewWrapper,
  LocationPickerModal,
} from '@/components/ui'
import {
  formatPhone,
  formatDateTime,
  formatTimeSlot,
  formatPrice,
  formatEta,
} from '@/utils'
import { ORDER_STATUS } from '@/constants'

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const orderId = parseInt(id, 10)

  const {
    order,
    isLoading,
    error,
    updateStatus,
    updateLocation,
    sendToWolt,
    sendToTrackings,
    markDelivered,
  } = useOrder(orderId)

  const [showLocationPicker, setShowLocationPicker] = useState(false)

  if (isLoading || !order) {
    return <LoadingScreen message="Loading order..." />
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-4">
        <View className="items-center">
          <View className="bg-red-100 rounded-full p-4 mb-4">
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load order
          </Text>
          <Text className="text-gray-500 text-center mb-6">{error}</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    )
  }

  const isWolt = order.shippingProvider === 'wolt'
  const isTrackings = !isWolt // Any non-Wolt order can be sent to Trackings.ge
  const hasTimeSlot = order.scheduleType === 'scheduled' && order.timeSlot
  const hasWoltOrderId = Boolean(order.woltOrderId)
  const hasTrackingCode = Boolean(order.trackingCode)
  const hasCoordinates = Boolean(order.lat && order.lon)
  const isReady = order.status === 'READY'
  // Backend requires: wolt provider + coordinates + no existing woltOrderId + status READY
  const canSendToWolt = isWolt && hasCoordinates && !hasWoltOrderId && isReady
  // Trackings.ge: no existing trackingCode + status READY
  const canSendToTrackings = isTrackings && !hasTrackingCode && isReady
  // Allow marking any order as delivered (not just Wolt orders)
  const canMarkDelivered = order.status !== 'DELIVERED'

  const handleStatusChange = async (status: keyof typeof ORDER_STATUS) => {
    const success = await updateStatus(status)
    if (success) {
      Alert.alert('Success', `Order status updated to ${status}`)
    } else {
      Alert.alert('Error', 'Failed to update status')
    }
  }

  const handleSendToWolt = async () => {
    const orderDetails = [
      `Order: #${order.externalId || order.id}`,
      `Customer: ${order.customerName}`,
      `Address: ${order.customerAddress}`,
      `Product: ${order.productName} x${order.quantity}`,
    ].join('\n')

    Alert.alert(
      'Send to Wolt',
      `This will send the order to Wolt courier service.\n\n${orderDetails}\n\nAre you sure?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send to Wolt',
          style: 'destructive',
          onPress: async () => {
            const success = await sendToWolt()
            if (success) {
              Alert.alert('Success', 'Order sent to Wolt')
            } else {
              Alert.alert('Error', 'Failed to send to Wolt')
            }
          },
        },
      ]
    )
  }

  const handleSendToTrackings = async () => {
    const orderDetails = [
      `Order: #${order.externalId || order.id}`,
      `Customer: ${order.customerName}`,
      `Address: ${order.customerAddress}`,
      `Product: ${order.productName} x${order.quantity}`,
    ].join('\n')

    Alert.alert(
      'Send to Trackings.ge',
      `This will send the order to Trackings.ge courier.\n\n${orderDetails}\n\nSelect sender:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Maka',
          onPress: async () => {
            const success = await sendToTrackings('maka')
            if (success) {
              Alert.alert('Success', 'Order sent to Trackings.ge')
            } else {
              Alert.alert('Error', 'Failed to send to Trackings.ge')
            }
          },
        },
        {
          text: 'Nato',
          onPress: async () => {
            const success = await sendToTrackings('nato')
            if (success) {
              Alert.alert('Success', 'Order sent to Trackings.ge')
            } else {
              Alert.alert('Error', 'Failed to send to Trackings.ge')
            }
          },
        },
      ]
    )
  }

  const handleMarkDelivered = async () => {
    Alert.alert(
      'Mark Delivered',
      'Are you sure this order has been delivered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            // Use markDelivered for Wolt orders (triggers Wolt webhook)
            // Use updateStatus for non-Wolt orders
            const success = isWolt && order.woltOrderId
              ? await markDelivered()
              : await updateStatus('DELIVERED')
            if (success) {
              Alert.alert('Success', 'Order marked as delivered')
            } else {
              Alert.alert('Error', 'Failed to mark delivered')
            }
          },
        },
      ]
    )
  }

  const handleCallCustomer = () => {
    if (order.customerPhone) {
      Linking.openURL(`tel:${order.customerPhone}`)
    }
  }

  const openWoltTracking = () => {
    if (order.woltTrackingUrl) {
      Linking.openURL(order.woltTrackingUrl)
    }
  }

  const handleLocationUpdate = async (lat: number, lon: number) => {
    const success = await updateLocation(lat, lon)
    if (success) {
      Alert.alert('Success', 'Location updated successfully')
    } else {
      Alert.alert('Error', 'Failed to update location')
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Order #${order.externalId || order.id}`,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
          headerRight: () => (
            <Button
              title="Edit"
              variant="ghost"
              size="sm"
              onPress={() => router.push(`/orders/edit?id=${order.id}`)}
              icon={<Ionicons name="create-outline" size={18} color="#ffffff" />}
              className="mr-2"
            />
          ),
        }}
      />
      <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 p-4">
          {/* Status Header */}
          <Card variant="elevated" className="mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
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
              <View className="flex-row items-center">
                <View className="bg-blue-100 rounded-full p-2 mr-3">
                  <Ionicons name="time" size={20} color="#2563eb" />
                </View>
                <View>
                  <Text className="font-semibold text-blue-700">Scheduled Delivery</Text>
                  <Text className="text-blue-600">
                    {formatTimeSlot(order.slotDate, order.timeSlot)}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Customer Info */}
          <Card variant="elevated" className="mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900">
                Customer
              </Text>
              {order.customerPhone && (
                <Button
                  title="Call"
                  variant="outline"
                  size="sm"
                  onPress={handleCallCustomer}
                  icon={<Ionicons name="call" size={16} color="#4f46e5" />}
                />
              )}
            </View>
            <View className="gap-3">
              <View className="flex-row items-center">
                <View className="bg-gray-100 rounded-full p-2 mr-3">
                  <Ionicons name="person" size={16} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500">Name</Text>
                  <Text className="font-medium text-gray-900">
                    {order.customerName}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <View className="bg-gray-100 rounded-full p-2 mr-3">
                  <Ionicons name="call" size={16} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500">Phone</Text>
                  <Text className="font-medium text-gray-900">
                    {formatPhone(order.customerPhone)}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className="bg-gray-100 rounded-full p-2 mr-3">
                  <Ionicons name="location" size={16} color="#6b7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500">Address</Text>
                  <Text className="font-medium text-gray-900">
                    {order.customerAddress}
                  </Text>
                  {order.city && (
                    <Text className="text-sm text-gray-500">{order.city}</Text>
                  )}
                </View>
              </View>
            </View>
          </Card>

          {/* Map View - Only for Wolt orders */}
          {isWolt && (
            <Card variant="elevated" className="mb-4 overflow-hidden">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Location
              </Text>
              {order.lat && order.lon ? (
                <MapViewWrapper
                  latitude={order.lat}
                  longitude={order.lon}
                  title={order.customerName}
                  description={order.customerAddress}
                  height={200}
                  onPress={() => setShowLocationPicker(true)}
                />
              ) : (
                <Pressable onPress={() => setShowLocationPicker(true)}>
                  <View className="bg-gray-100 rounded-lg items-center justify-center py-8">
                    <Ionicons name="location-outline" size={48} color="#9ca3af" />
                    <Text className="text-gray-500 mt-2">No location set</Text>
                    <Text className="text-gray-400 text-sm">Tap to set delivery location</Text>
                  </View>
                </Pressable>
              )}
            </Card>
          )}

          {/* Product Info */}
          <Card variant="elevated" className="mb-4">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              Product
            </Text>
            <View className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg">
              <View className="flex-row items-center flex-1">
                <View className="bg-primary-100 rounded-full p-2 mr-3">
                  <Ionicons name="cube" size={20} color="#4f46e5" />
                </View>
                <Text className="text-gray-900 flex-1" numberOfLines={2}>
                  {order.productName}
                </Text>
              </View>
              <View className="bg-primary-600 px-3 py-1 rounded-full ml-2">
                <Text className="font-bold text-white">x{order.quantity}</Text>
              </View>
            </View>
            {order.notes && (
              <View className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="document-text" size={14} color="#ca8a04" />
                  <Text className="text-xs font-medium text-yellow-700 ml-1">Notes</Text>
                </View>
                <Text className="text-gray-700">{order.notes}</Text>
              </View>
            )}
          </Card>

          {/* Wolt Info */}
          {isWolt && (
            <Card variant="elevated" className="mb-4 border-l-4 border-cyan-500">
              <View className="flex-row items-center mb-3">
                <View className="bg-cyan-100 rounded-full p-2 mr-3">
                  <Ionicons name="bicycle" size={20} color="#06b6d4" />
                </View>
                <Text className="text-lg font-semibold text-cyan-700">
                  Wolt Delivery
                </Text>
              </View>
              <View className="gap-2">
                {order.woltPrice && (
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                    <Text className="text-gray-500">Price</Text>
                    <Text className="font-semibold text-gray-900">
                      {formatPrice(order.woltPrice)}
                    </Text>
                  </View>
                )}
                {order.woltEta && (
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                    <Text className="text-gray-500">ETA</Text>
                    <Text className="font-medium text-gray-900">
                      {formatEta(order.woltEta)}
                    </Text>
                  </View>
                )}
                {order.woltStatus && (
                  <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                    <Text className="text-gray-500">Status</Text>
                    <View className="bg-cyan-100 px-2 py-1 rounded-full">
                      <Text className="font-medium text-cyan-700 text-sm">
                        {order.woltStatus}
                      </Text>
                    </View>
                  </View>
                )}
                {order.woltOrderId && (
                  <View className="flex-row justify-between items-center py-2">
                    <Text className="text-gray-500">Order ID</Text>
                    <Text className="font-mono text-sm text-gray-700">
                      {order.woltOrderId}
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
                    icon={<Ionicons name="navigate" size={16} color="#ffffff" />}
                  />
                )}
              </View>
            </Card>
          )}

          {/* Carrier Status (Trackings.ge) */}
          {order.carrierStatusText && (
            <Card variant="elevated" className="mb-4 border-l-4 border-purple-500">
              <View className="flex-row items-center mb-3">
                <View className="bg-purple-100 rounded-full p-2 mr-3">
                  <Ionicons name="car" size={20} color="#9333ea" />
                </View>
                <Text className="text-lg font-semibold text-purple-700">
                  Carrier Status
                </Text>
              </View>
              <Text className="text-gray-900">{order.carrierStatusText}</Text>
              {order.trackingCode && (
                <View className="mt-2 flex-row items-center">
                  <Text className="text-sm text-gray-500">Tracking: </Text>
                  <Text className="text-sm font-mono text-purple-600">
                    {order.trackingCode}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Timestamps */}
          <Card variant="outlined" className="mb-4">
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text className="text-gray-500 ml-2">Created</Text>
              </View>
              <Text className="text-gray-900">
                {formatDateTime(order.createdAt)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center pt-2">
              <View className="flex-row items-center">
                <Ionicons name="refresh-outline" size={16} color="#6b7280" />
                <Text className="text-gray-500 ml-2">Updated</Text>
              </View>
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
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-2">Change Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {order.status !== 'PENDING' && (
                  <Button
                    title="Pending"
                    variant="secondary"
                    size="sm"
                    onPress={() => handleStatusChange('PENDING')}
                    icon={<Ionicons name="hourglass-outline" size={14} color="#6b7280" />}
                  />
                )}
                {order.status !== 'READY' && (
                  <Button
                    title="Ready"
                    variant="primary"
                    size="sm"
                    onPress={() => handleStatusChange('READY')}
                    icon={<Ionicons name="checkmark-circle-outline" size={14} color="#ffffff" />}
                  />
                )}
                {order.status !== 'SHIPPED' && !isWolt && (
                  <Button
                    title="Shipped"
                    variant="secondary"
                    size="sm"
                    onPress={() => handleStatusChange('SHIPPED')}
                    icon={<Ionicons name="paper-plane-outline" size={14} color="#6b7280" />}
                  />
                )}
              </View>
            </View>

            {/* Shipping Actions */}
            {canSendToWolt && (
              <View className="mb-2">
                <Button
                  title="Send to Wolt"
                  variant="primary"
                  fullWidth
                  onPress={handleSendToWolt}
                  style={{ backgroundColor: '#0284c7' }}
                  icon={<Ionicons name="send" size={18} color="#ffffff" />}
                />
              </View>
            )}

            {canSendToTrackings && (
              <View className="mb-2">
                <Button
                  title="Send to Trackings.ge"
                  variant="primary"
                  fullWidth
                  onPress={handleSendToTrackings}
                  style={{ backgroundColor: '#0284c7' }}
                  icon={<Ionicons name="car" size={18} color="#ffffff" />}
                />
              </View>
            )}

            {canMarkDelivered && (
              <Button
                title="Mark Delivered"
                variant="success"
                fullWidth
                onPress={handleMarkDelivered}
                icon={<Ionicons name="checkmark-done" size={18} color="#ffffff" />}
              />
            )}
          </Card>
        </ScrollView>
      </SafeAreaView>

      <LocationPickerModal
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSave={handleLocationUpdate}
        initialLat={order.lat}
        initialLon={order.lon}
        title="Edit Delivery Location"
      />
    </>
  )
}
