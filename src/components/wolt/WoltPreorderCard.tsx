import React from 'react'
import { View, Text, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Card } from '@/components/ui'
import { WoltPreorder, WoltPreorderStatus } from '@/types'
import { formatPhone, formatRelativeTime, formatEta, formatPrice } from '@/utils'

interface WoltPreorderCardProps {
  preorder: WoltPreorder
  isConfirming: boolean
  onConfirm: () => void
}

const STATUS_CONFIG: Record<WoltPreorderStatus, { label: string; color: string; bg: string }> = {
  pending_warehouse: { label: 'Pack Order', color: '#d97706', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#059669', bg: '#d1fae5' },
  sent_to_wolt: { label: 'Sent to Wolt', color: '#0891b2', bg: '#cffafe' },
  delivered: { label: 'Delivered', color: '#16a34a', bg: '#dcfce7' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2' },
  wolt_failed: { label: 'Failed', color: '#dc2626', bg: '#fee2e2' },
}

export function WoltPreorderCard({ preorder, isConfirming, onConfirm }: WoltPreorderCardProps) {
  const statusConfig = STATUS_CONFIG[preorder.status] || STATUS_CONFIG.pending_warehouse

  const handleCall = () => {
    if (preorder.customerPhone) {
      Linking.openURL(`tel:${preorder.customerPhone}`)
    }
  }

  const canConfirm = preorder.status === 'pending_warehouse'

  return (
    <Card variant="elevated" className="mb-3">
      {/* Header - Order Number & Status */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="rounded-lg bg-gray-900 px-3 py-1.5">
          <Text className="text-lg font-bold text-white">
            #{preorder.orderNumber}
          </Text>
        </View>
        <View
          className="rounded-full px-3 py-1"
          style={{ backgroundColor: statusConfig.bg }}
        >
          <Text
            className="text-sm font-semibold"
            style={{ color: statusConfig.color }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Product Section */}
      <View className="mb-3 rounded-lg bg-sky-50 p-3">
        <Text className="text-lg font-bold text-gray-900">
          {preorder.quantity} x {preorder.productName}
        </Text>
        <Text className="mt-1 text-sm text-gray-600">
          Product: {formatPrice(preorder.productPrice)} | Delivery: {formatPrice(preorder.deliveryPrice)}
        </Text>
        <Text className="mt-1 text-base font-semibold text-sky-600">
          Total: {formatPrice(preorder.total)}
        </Text>
      </View>

      {/* Customer Info */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-800">
            {preorder.customerName}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatPhone(preorder.customerPhone)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleCall}
          className="ml-2 rounded-full bg-green-100 p-2"
        >
          <Ionicons name="call" size={20} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {/* Address */}
      <View className="mb-3">
        <View className="flex-row items-start">
          <Ionicons name="location" size={16} color="#6b7280" style={{ marginTop: 2 }} />
          <Text className="ml-1 flex-1 text-sm text-gray-600" numberOfLines={2}>
            {preorder.address}
          </Text>
        </View>
      </View>

      {/* Delivery Time/ETA */}
      {(preorder.deliveryTime || preorder.deliveryEta) && (
        <View className="mb-3 flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-600">
            {preorder.deliveryTime || (preorder.deliveryEta && `ETA: ${formatEta(preorder.deliveryEta)}`)}
          </Text>
        </View>
      )}

      {/* Delivery Instructions */}
      {preorder.deliveryInstructions && (
        <View className="mb-3 rounded-lg bg-amber-50 p-2">
          <Text className="text-sm text-amber-800">
            Note: {preorder.deliveryInstructions}
          </Text>
        </View>
      )}

      {/* Footer - Created Time */}
      <View className="mb-3 border-t border-gray-100 pt-2">
        <Text className="text-xs text-gray-400">
          Created {formatRelativeTime(preorder.createdAt)}
        </Text>
      </View>

      {/* Send to Wolt Button */}
      {canConfirm && (
        <TouchableOpacity
          onPress={onConfirm}
          disabled={isConfirming}
          className={`rounded-lg py-3 ${isConfirming ? 'bg-sky-300' : 'bg-sky-500'}`}
          activeOpacity={0.8}
        >
          {isConfirming ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="#ffffff" size="small" />
              <Text className="ml-2 text-center text-base font-bold text-white">
                Sending to Wolt...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center justify-center">
              <Ionicons name="send" size={18} color="#ffffff" />
              <Text className="ml-2 text-center text-base font-bold text-white">
                Send to Wolt
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </Card>
  )
}
