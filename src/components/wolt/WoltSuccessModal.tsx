import React from 'react'
import { View, Text, TouchableOpacity, Modal, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface WoltSuccessModalProps {
  visible: boolean
  orderNumber: string
  woltOrderId: string
  woltTrackingUrl?: string
  onClose: () => void
}

export function WoltSuccessModal({
  visible,
  orderNumber,
  woltOrderId,
  woltTrackingUrl,
  onClose,
}: WoltSuccessModalProps) {
  // Get last 8 characters of Wolt ID for the parcel label
  const shortWoltId = woltOrderId.slice(-8).toUpperCase()

  const handleOpenTracking = () => {
    if (woltTrackingUrl) {
      Linking.openURL(woltTrackingUrl)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6">
          {/* Success Icon */}
          <View className="mb-4 items-center">
            <View className="rounded-full bg-green-100 p-4">
              <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
            </View>
          </View>

          {/* Success Message */}
          <Text className="mb-2 text-center text-xl font-bold text-gray-900">
            Order #{orderNumber} sent to Wolt!
          </Text>

          {/* Instruction */}
          <Text className="mb-4 text-center text-sm text-gray-500">
            Write this code on the parcel
          </Text>

          {/* HUGE Wolt ID */}
          <View className="mb-4 rounded-xl bg-sky-100 p-4">
            <Text className="text-center text-4xl font-black tracking-widest text-sky-700">
              {shortWoltId}
            </Text>
          </View>

          {/* Full Wolt Order ID */}
          <Text className="mb-4 text-center text-xs text-gray-400">
            Full ID: {woltOrderId}
          </Text>

          {/* Tracking URL Link */}
          {woltTrackingUrl && (
            <TouchableOpacity
              onPress={handleOpenTracking}
              className="mb-4 flex-row items-center justify-center"
            >
              <Ionicons name="open-outline" size={16} color="#0891b2" />
              <Text className="ml-1 text-sm text-sky-600 underline">
                Open tracking page
              </Text>
            </TouchableOpacity>
          )}

          {/* Done Button */}
          <TouchableOpacity
            onPress={onClose}
            className="rounded-lg bg-sky-500 py-3"
            activeOpacity={0.8}
          >
            <Text className="text-center text-base font-bold text-white">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
