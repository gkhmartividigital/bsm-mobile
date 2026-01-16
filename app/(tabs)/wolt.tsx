import React from 'react'
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { EmptyState, LoadingScreen, Button } from '@/components/ui'
import { WoltPreorderCard, WoltSuccessModal } from '@/components/wolt'
import { useWoltPreorders } from '@/hooks'
import { WoltPreorder } from '@/types'

export default function WoltScreen() {
  const {
    preorders,
    pendingCount,
    isLoading,
    isRefreshing,
    isConfirming,
    error,
    successModal,
    refresh,
    confirm,
    clearError,
    closeSuccessModal,
  } = useWoltPreorders()

  const renderHeader = () => (
    <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Text className="text-2xl font-bold text-gray-900">Wolt Preorders</Text>
        {pendingCount > 0 && (
          <View className="ml-2 rounded-full bg-amber-500 px-2.5 py-0.5">
            <Text className="text-sm font-bold text-white">{pendingCount}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={refresh}
        disabled={isRefreshing}
        className="rounded-full bg-gray-100 p-2"
      >
        <Ionicons
          name="refresh"
          size={20}
          color={isRefreshing ? '#9ca3af' : '#374151'}
        />
      </TouchableOpacity>
    </View>
  )

  const renderItem = ({ item }: { item: WoltPreorder }) => (
    <WoltPreorderCard
      preorder={item}
      isConfirming={isConfirming === item.id}
      onConfirm={() => confirm(item.id)}
    />
  )

  const renderEmpty = () => (
    <EmptyState
      icon={<Ionicons name="cube-outline" size={48} color="#9ca3af" />}
      title="No Preorders"
      description="When new Wolt preorders arrive, they will appear here for warehouse confirmation."
    />
  )

  const renderError = () => (
    <View className="flex-1 items-center justify-center p-8">
      <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
      <Text className="mt-4 text-center text-lg font-semibold text-gray-800">
        Something went wrong
      </Text>
      <Text className="mt-2 text-center text-gray-500">{error}</Text>
      <View className="mt-6">
        <Button
          title="Try Again"
          onPress={() => {
            clearError()
            refresh()
          }}
          variant="primary"
        />
      </View>
    </View>
  )

  if (isLoading && preorders.length === 0) {
    return <LoadingScreen message="Loading preorders..." />
  }

  if (error && preorders.length === 0) {
    return (
      <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
        {renderError()}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <View className="flex-1 px-4 pt-4">
        {renderHeader()}

        <FlatList
          data={preorders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              colors={['#0ea5e9']}
              tintColor="#0ea5e9"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={preorders.length === 0 ? { flex: 1 } : undefined}
        />
      </View>

      {/* Success Modal */}
      {successModal && (
        <WoltSuccessModal
          visible={!!successModal}
          orderNumber={successModal.orderNumber}
          woltOrderId={successModal.woltOrderId}
          woltTrackingUrl={successModal.woltTrackingUrl}
          onClose={closeSuccessModal}
        />
      )}
    </SafeAreaView>
  )
}
