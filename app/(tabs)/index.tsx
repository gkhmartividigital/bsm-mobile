import React, { useState, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Platform,
  Vibration,
  Keyboard,
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { useOrders } from '@/hooks'
import { OrderCard } from '@/components/orders/OrderCard'
import { OrderStatusTabs } from '@/components/orders/OrderStatusTabs'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchInput } from '@/components/ui/SearchInput'
import { Order } from '@/types'
import { OrderStatus } from '@/constants'

type TabFilter = 'all' | OrderStatus

// Simple haptic feedback using Vibration API (works without expo-haptics)
const hapticFeedback = {
  light: () => {
    if (Platform.OS === 'ios') {
      // iOS has built-in haptic support via selection feedback
      Vibration.vibrate(10)
    } else {
      Vibration.vibrate(10)
    }
  },
  medium: () => {
    Vibration.vibrate(20)
  },
  success: () => {
    Vibration.vibrate([0, 30, 50, 30])
  },
  error: () => {
    Vibration.vibrate([0, 50, 50, 50])
  },
}

const EMPTY_STATE_CONFIG: Record<TabFilter, { title: string; description: string }> = {
  all: {
    title: 'No orders yet',
    description: 'Orders will appear here once they are created',
  },
  PENDING: {
    title: 'No pending orders',
    description: 'All orders have been processed',
  },
  READY: {
    title: 'No orders ready',
    description: 'No orders are ready for shipping',
  },
  SHIPPED: {
    title: 'No shipped orders',
    description: 'No orders are currently in transit',
  },
  DELIVERED: {
    title: 'No delivered orders',
    description: 'Delivered orders will appear here',
  },
  CANCELLED: {
    title: 'No cancelled orders',
    description: 'No orders have been cancelled',
  },
}

export default function OrdersScreen() {
  const {
    orders,
    isLoading,
    isRefreshing,
    isSyncing,
    error,
    refresh,
    sync,
    counts,
    clearError,
  } = useOrders()

  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Filter orders based on active tab and search query
  const filteredOrders = useMemo(() => {
    const orderList = orders ?? []

    // First filter by status tab
    let result = activeTab === 'all'
      ? orderList
      : orderList.filter(order => order.status === activeTab)

    // Then filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim()
      result = result.filter(order => {
        const searchableFields = [
          order.customerName,
          order.customerPhone,
          order.customerAddress,
          order.productName,
          order.externalId,
          order.trackingCode,
        ]
        return searchableFields.some(field =>
          field?.toLowerCase().includes(query)
        )
      })
    }

    return result
  }, [orders, activeTab, debouncedSearchQuery])

  // Handle debounced search change
  const handleDebouncedSearchChange = useCallback((query: string) => {
    setDebouncedSearchQuery(query)
  }, [])

  // Handle tab change with haptic feedback
  const handleTabChange = useCallback((tab: TabFilter) => {
    hapticFeedback.light()
    setActiveTab(tab)
  }, [])

  // Handle refresh with haptic feedback
  const handleRefresh = useCallback(async () => {
    hapticFeedback.light()
    await refresh()
  }, [refresh])

  // Handle sync with haptic feedback
  const handleSync = useCallback(async () => {
    hapticFeedback.medium()
    try {
      await sync()
      hapticFeedback.success()
    } catch {
      hapticFeedback.error()
    }
  }, [sync])

  // Handle retry
  const handleRetry = useCallback(() => {
    hapticFeedback.medium()
    clearError()
    refresh()
  }, [clearError, refresh])

  // Render order card - OrderCard already handles navigation internally
  const renderOrderCard = useCallback(({ item }: { item: Order }) => (
    <OrderCard order={item} />
  ), [])

  // Key extractor
  const keyExtractor = useCallback((item: Order) => item.id.toString(), [])

  // Empty state config for current tab or search
  const emptyConfig = useMemo(() => {
    if (debouncedSearchQuery.trim()) {
      return {
        title: 'No results found',
        description: `No orders match "${debouncedSearchQuery}"`,
        isSearch: true,
      }
    }
    return {
      ...(EMPTY_STATE_CONFIG[activeTab] || EMPTY_STATE_CONFIG.all),
      isSearch: false,
    }
  }, [activeTab, debouncedSearchQuery])

  // Loading state
  if (isLoading && !orders?.length) {
    return <LoadingScreen message="Loading orders..." />
  }

  // Error state
  if (error && !orders?.length) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header
          title="Orders"
          subtitle={`${counts.total} active orders`}
          isSyncing={isSyncing}
          onSync={handleSync}
        />
        <View className="flex-1 items-center justify-center p-8">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <Text className="text-4xl">!</Text>
          </View>
          <Text className="mb-2 text-center text-xl font-semibold text-gray-800">
            Something went wrong
          </Text>
          <Text className="mb-6 text-center text-gray-500">{error}</Text>
          <TouchableOpacity
            onPress={handleRetry}
            className="rounded-xl bg-sky-500 px-6 py-3"
            accessibilityRole="button"
            accessibilityLabel="Retry loading orders"
          >
            <Text className="font-semibold text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={filteredOrders}
        keyExtractor={keyExtractor}
        renderItem={renderOrderCard}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
          flexGrow: filteredOrders.length === 0 ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#0ea5e9']}
            tintColor="#0ea5e9"
            progressBackgroundColor="#ffffff"
          />
        }
        ListHeaderComponent={
          <View className="mb-4">
            {/* Search Bar */}
            <View className="mb-3">
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onDebouncedChange={handleDebouncedSearchChange}
                debounceMs={300}
                placeholder="Search orders..."
              />
            </View>

            {/* Sync Button Row */}
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-sm text-gray-500">
                {debouncedSearchQuery.trim()
                  ? `${filteredOrders.length} result${filteredOrders.length !== 1 ? 's' : ''}`
                  : `${counts.total} active orders`}
              </Text>
              <TouchableOpacity
                onPress={handleSync}
                disabled={isSyncing}
                className={`flex-row items-center rounded-lg border border-sky-500 px-3 py-2 ${
                  isSyncing ? 'opacity-50' : ''
                }`}
                accessibilityRole="button"
                accessibilityLabel="Sync orders"
              >
                {isSyncing ? (
                  <ActivityIndicator size="small" color="#0ea5e9" />
                ) : (
                  <Text className="font-semibold text-sky-500">Sync</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Status Tabs */}
            <OrderStatusTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              counts={counts}
            />
          </View>
        }
        ListEmptyComponent={
          <Animated.View
            entering={FadeIn.delay(200)}
            className="flex-1 items-center justify-center py-16"
          >
            <EmptyState
              title={emptyConfig.title}
              description={emptyConfig.description}
              action={
                emptyConfig.isSearch ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery('')
                      setDebouncedSearchQuery('')
                    }}
                    className="mt-4 rounded-xl bg-sky-500 px-6 py-3"
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                  >
                    <Text className="font-semibold text-white">Clear Search</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={handleRefresh}
                    className="mt-4 rounded-xl bg-sky-500 px-6 py-3"
                    accessibilityRole="button"
                    accessibilityLabel="Refresh orders"
                  >
                    <Text className="font-semibold text-white">Refresh</Text>
                  </TouchableOpacity>
                )
              }
            />
          </Animated.View>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />

    </View>
  )
}

// Header component (used only in error state since main header is in _layout.tsx)
interface HeaderProps {
  title: string
  subtitle: string
  isSyncing: boolean
  onSync: () => void
}

function Header({ title, subtitle, isSyncing, onSync }: HeaderProps) {
  return (
    <View className="bg-[#1a1a2e] px-4 pb-4 pt-2">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-white">{title}</Text>
          <Text className="text-sm text-gray-400">{subtitle}</Text>
        </View>
        <Pressable
          onPress={onSync}
          disabled={isSyncing}
          className={`rounded-lg bg-white/10 px-4 py-2 ${isSyncing ? 'opacity-50' : ''}`}
          accessibilityRole="button"
          accessibilityLabel="Sync orders"
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="font-medium text-white">Sync</Text>
          )}
        </Pressable>
      </View>
    </View>
  )
}
