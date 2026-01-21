import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Vibration,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Input, Card, LoadingScreen, LocationPickerModal } from '@/components/ui'
import { ordersApi } from '@/services/api'
import { UpdateOrderPayload, Order, OrderStatus } from '@/types'
import { useOrdersStore } from '@/stores'

// Simple haptic feedback using Vibration API
const hapticFeedback = {
  light: () => Vibration.vibrate(10),
  success: () => Vibration.vibrate([0, 30, 50, 30]),
  error: () => Vibration.vibrate([0, 50, 50, 50]),
}

interface FormData {
  customerName: string
  customerPhone: string
  customerAddress: string
  city: string
  productName: string
  quantity: string
  notes: string
  status: OrderStatus
}

interface FormErrors {
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  city?: string
  productName?: string
  quantity?: string
}

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'PENDING', label: 'Pending', color: '#f59e0b' },
  { value: 'READY', label: 'Ready', color: '#3b82f6' },
  { value: 'SHIPPED', label: 'Shipped', color: '#8b5cf6' },
  { value: 'DELIVERED', label: 'Delivered', color: '#10b981' },
  { value: 'CANCELLED', label: 'Cancelled', color: '#ef4444' },
]

export default function EditOrderScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const orderId = parseInt(id, 10)
  const refreshOrders = useOrdersStore((state) => state.refreshOrders)
  const setSelectedOrder = useOrdersStore((state) => state.setSelectedOrder)

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    city: '',
    productName: '',
    quantity: '1',
    notes: '',
    status: 'PENDING',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showStatusPicker, setShowStatusPicker] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLon, setLocationLon] = useState<number | null>(null)

  // Refs for input navigation
  const phoneRef = useRef<TextInput>(null)
  const addressRef = useRef<TextInput>(null)
  const cityRef = useRef<TextInput>(null)
  const productRef = useRef<TextInput>(null)
  const quantityRef = useRef<TextInput>(null)
  const notesRef = useRef<TextInput>(null)

  // Fetch order data
  useEffect(() => {
    async function loadOrder() {
      if (!orderId || isNaN(orderId)) {
        setLoadError('Invalid order ID')
        setIsLoadingOrder(false)
        return
      }

      try {
        const fetchedOrder = await ordersApi.getOrder(orderId)
        if (!fetchedOrder) {
          setLoadError('Order not found')
          setIsLoadingOrder(false)
          return
        }

        setOrder(fetchedOrder)
        setFormData({
          customerName: fetchedOrder.customerName || '',
          customerPhone: fetchedOrder.customerPhone || '',
          customerAddress: fetchedOrder.customerAddress || '',
          city: fetchedOrder.city || '',
          productName: fetchedOrder.productName || '',
          quantity: String(fetchedOrder.quantity || 1),
          notes: fetchedOrder.notes || '',
          status: fetchedOrder.status || 'PENDING',
        })
        setLocationLat(fetchedOrder.lat ?? null)
        setLocationLon(fetchedOrder.lon ?? null)
        setIsLoadingOrder(false)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load order'
        setLoadError(errorMessage)
        setIsLoadingOrder(false)
      }
    }

    loadOrder()
  }, [orderId])

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async (payload: UpdateOrderPayload & { _locationLat?: number | null; _locationLon?: number | null }) => {
      const { _locationLat, _locationLon, ...updatePayload } = payload

      // First update the order (without location - backend ignores lat/lon in PATCH)
      const updatedOrder = await ordersApi.updateOrder(orderId, updatePayload)

      // Then update location separately if coordinates are provided
      const locationChanged = _locationLat !== order?.lat || _locationLon !== order?.lon
      if (locationChanged && _locationLat != null && _locationLon != null) {
        return await ordersApi.updateLocation(orderId, _locationLat, _locationLon)
      }

      return updatedOrder
    },
    onSuccess: async (updatedOrder) => {
      hapticFeedback.success()
      // Update local state
      setSelectedOrder(updatedOrder)
      await refreshOrders()
      Alert.alert('Success', 'Order updated successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ])
    },
    onError: (error: { message?: string }) => {
      hapticFeedback.error()
      Alert.alert('Error', error.message || 'Failed to update order')
    },
  })

  // Update form field
  const updateField = useCallback(
    (field: keyof FormData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear error when user types
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors]
  )

  // Handle status change
  const handleStatusChange = useCallback((status: OrderStatus) => {
    hapticFeedback.light()
    setFormData((prev) => ({ ...prev, status }))
    setShowStatusPicker(false)
  }, [])

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    } else if (!/^\+?[\d\s-]{9,}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = 'Enter a valid phone number'
    }

    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required'
    }

    const quantity = parseInt(formData.quantity, 10)
    if (isNaN(quantity) || quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Handle form submission
  const handleSubmit = useCallback(() => {
    hapticFeedback.light()

    if (!validateForm()) {
      hapticFeedback.error()
      return
    }

    const payload = {
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      customerAddress: formData.customerAddress.trim(),
      city: formData.city.trim(),
      productName: formData.productName.trim(),
      quantity: parseInt(formData.quantity, 10),
      notes: formData.notes.trim() || undefined,
      status: formData.status,
      // Pass location separately (backend ignores lat/lon in PATCH)
      _locationLat: locationLat,
      _locationLon: locationLon,
    }

    updateOrderMutation.mutate(payload)
  }, [formData, locationLat, locationLon, validateForm, updateOrderMutation])

  // Reset form to original values
  const handleReset = useCallback(() => {
    hapticFeedback.light()
    if (order) {
      setFormData({
        customerName: order.customerName || '',
        customerPhone: order.customerPhone || '',
        customerAddress: order.customerAddress || '',
        city: order.city || '',
        productName: order.productName || '',
        quantity: String(order.quantity || 1),
        notes: order.notes || '',
        status: order.status || 'PENDING',
      })
      setLocationLat(order.lat ?? null)
      setLocationLon(order.lon ?? null)
    }
    setErrors({})
  }, [order])

  // Handle location update from picker
  const handleLocationSave = useCallback((lat: number, lon: number) => {
    setLocationLat(lat)
    setLocationLon(lon)
  }, [])

  // Loading state
  if (isLoadingOrder) {
    return <LoadingScreen message="Loading order..." />
  }

  // Error state
  if (loadError || !order) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Edit Order',
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#ffffff',
          }}
        />
        <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-4">
          <View className="items-center">
            <View className="bg-red-100 rounded-full p-4 mb-4">
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load order
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              {loadError || 'Order not found'}
            </Text>
            <Button
              title="Go Back"
              onPress={() => router.back()}
              variant="outline"
            />
          </View>
        </SafeAreaView>
      </>
    )
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === formData.status)

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Edit Order #${order.externalId || order.id}`,
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#ffffff',
        }}
      />
      <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 p-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Status */}
            <Card variant="elevated" className="mb-4">
              <View className="flex-row items-center mb-4">
                <View className="bg-green-100 rounded-full p-2 mr-3">
                  <Ionicons name="flag" size={20} color="#10b981" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  Order Status
                </Text>
              </View>

              <Pressable
                onPress={() => {
                  hapticFeedback.light()
                  setShowStatusPicker(!showStatusPicker)
                }}
                className="flex-row items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: currentStatus?.color }}
                    className="w-3 h-3 rounded-full mr-3"
                  />
                  <Text className="text-base font-medium text-gray-900">
                    {currentStatus?.label || formData.status}
                  </Text>
                </View>
                <Ionicons
                  name={showStatusPicker ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6b7280"
                />
              </Pressable>

              {showStatusPicker && (
                <View className="mt-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {STATUS_OPTIONS.map((status) => (
                    <Pressable
                      key={status.value}
                      onPress={() => handleStatusChange(status.value)}
                      className={`flex-row items-center p-3 border-b border-gray-100 ${
                        formData.status === status.value ? 'bg-sky-50' : ''
                      }`}
                    >
                      <View
                        style={{ backgroundColor: status.color }}
                        className="w-3 h-3 rounded-full mr-3"
                      />
                      <Text
                        className={`text-base ${
                          formData.status === status.value
                            ? 'font-semibold text-sky-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {status.label}
                      </Text>
                      {formData.status === status.value && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color="#0284c7"
                          style={{ marginLeft: 'auto' }}
                        />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </Card>

            {/* Customer Information */}
            <Card variant="elevated" className="mb-4">
              <View className="flex-row items-center mb-4">
                <View className="bg-sky-100 rounded-full p-2 mr-3">
                  <Ionicons name="person" size={20} color="#0ea5e9" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  Customer Information
                </Text>
              </View>

              <View className="gap-4">
                <Input
                  label="Customer Name"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChangeText={updateField('customerName')}
                  error={errors.customerName}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                  leftIcon={
                    <Ionicons name="person-outline" size={18} color="#9ca3af" />
                  }
                />

                <Input
                  ref={phoneRef}
                  label="Phone Number"
                  placeholder="+995 XXX XXX XXX"
                  value={formData.customerPhone}
                  onChangeText={updateField('customerPhone')}
                  error={errors.customerPhone}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => addressRef.current?.focus()}
                  leftIcon={
                    <Ionicons name="call-outline" size={18} color="#9ca3af" />
                  }
                />

                <Input
                  ref={addressRef}
                  label="Delivery Address"
                  placeholder="Enter full address"
                  value={formData.customerAddress}
                  onChangeText={updateField('customerAddress')}
                  error={errors.customerAddress}
                  multiline
                  numberOfLines={2}
                  returnKeyType="next"
                  onSubmitEditing={() => cityRef.current?.focus()}
                  leftIcon={
                    <Ionicons name="location-outline" size={18} color="#9ca3af" />
                  }
                />

                <Input
                  ref={cityRef}
                  label="City"
                  placeholder="Enter city"
                  value={formData.city}
                  onChangeText={updateField('city')}
                  error={errors.city}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => productRef.current?.focus()}
                  leftIcon={
                    <Ionicons name="business-outline" size={18} color="#9ca3af" />
                  }
                />
              </View>
            </Card>

            {/* Product Information */}
            <Card variant="elevated" className="mb-4">
              <View className="flex-row items-center mb-4">
                <View className="bg-purple-100 rounded-full p-2 mr-3">
                  <Ionicons name="cube" size={20} color="#9333ea" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  Product Information
                </Text>
              </View>

              <View className="gap-4">
                <Input
                  ref={productRef}
                  label="Product Name"
                  placeholder="Enter product name or description"
                  value={formData.productName}
                  onChangeText={updateField('productName')}
                  error={errors.productName}
                  returnKeyType="next"
                  onSubmitEditing={() => quantityRef.current?.focus()}
                  leftIcon={
                    <Ionicons name="cube-outline" size={18} color="#9ca3af" />
                  }
                />

                <Input
                  ref={quantityRef}
                  label="Quantity"
                  placeholder="1"
                  value={formData.quantity}
                  onChangeText={updateField('quantity')}
                  error={errors.quantity}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => notesRef.current?.focus()}
                  leftIcon={
                    <Ionicons name="layers-outline" size={18} color="#9ca3af" />
                  }
                />
              </View>
            </Card>

            {/* Delivery Location - Only for Wolt orders */}
            {order.shippingProvider === 'wolt' && (
              <Card variant="elevated" className="mb-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="bg-green-100 rounded-full p-2 mr-3">
                      <Ionicons name="location" size={20} color="#10b981" />
                    </View>
                    <Text className="text-lg font-semibold text-gray-900">
                      Delivery Location
                    </Text>
                  </View>
                  <Button
                    title={locationLat && locationLon ? 'Edit' : 'Add'}
                    variant="outline"
                    size="sm"
                    onPress={() => setShowLocationPicker(true)}
                    icon={<Ionicons name={locationLat && locationLon ? 'create-outline' : 'add'} size={16} color="#4f46e5" />}
                  />
                </View>

                {locationLat && locationLon ? (
                  <View className="bg-gray-50 p-3 rounded-lg">
                    <View className="flex-row items-center">
                      <Ionicons name="pin" size={16} color="#6b7280" />
                      <Text className="text-gray-700 ml-2">
                        Coordinates set
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm font-mono mt-1">
                      {locationLat.toFixed(6)}, {locationLon.toFixed(6)}
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-100 rounded-lg items-center justify-center py-6">
                    <Ionicons name="location-outline" size={32} color="#9ca3af" />
                    <Text className="text-gray-500 mt-2">No location set</Text>
                    <Text className="text-gray-400 text-xs">Tap "Add" to set delivery coordinates</Text>
                  </View>
                )}
              </Card>
            )}

            {/* Additional Notes */}
            <Card variant="elevated" className="mb-4">
              <View className="flex-row items-center mb-4">
                <View className="bg-amber-100 rounded-full p-2 mr-3">
                  <Ionicons name="document-text" size={20} color="#f59e0b" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  Additional Notes
                </Text>
                <Text className="text-sm text-gray-400 ml-2">(Optional)</Text>
              </View>

              <Input
                ref={notesRef}
                placeholder="Add any special instructions or notes..."
                value={formData.notes}
                onChangeText={updateField('notes')}
                multiline
                numberOfLines={3}
                returnKeyType="done"
                leftIcon={
                  <Ionicons name="create-outline" size={18} color="#9ca3af" />
                }
              />
            </Card>

            {/* Actions */}
            <View className="gap-3 mb-8">
              <Button
                title={updateOrderMutation.isPending ? 'Saving...' : 'Save Changes'}
                variant="primary"
                fullWidth
                loading={updateOrderMutation.isPending}
                onPress={handleSubmit}
                icon={
                  !updateOrderMutation.isPending && (
                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                  )
                }
              />

              <Button
                title="Reset Changes"
                variant="outline"
                fullWidth
                onPress={handleReset}
                disabled={updateOrderMutation.isPending}
                icon={<Ionicons name="refresh" size={18} color="#0284c7" />}
              />

              <Button
                title="Cancel"
                variant="ghost"
                fullWidth
                onPress={() => router.back()}
                disabled={updateOrderMutation.isPending}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {order.shippingProvider === 'wolt' && (
        <LocationPickerModal
          visible={showLocationPicker}
          onClose={() => setShowLocationPicker(false)}
          onSave={handleLocationSave}
          initialLat={locationLat}
          initialLon={locationLon}
          title="Set Delivery Location"
        />
      )}
    </>
  )
}
