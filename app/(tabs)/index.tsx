import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrders, useRefresh } from '@/hooks';
import { OrderList, OrderStatusTabs } from '@/components/orders';
import { Button } from '@/components/ui';
import { OrderStatus } from '@/constants';

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
  } = useOrders();

  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  }, [orders, activeTab]);

  // Handle sync
  const handleSync = async () => {
    try {
      await sync();
      Alert.alert('Success', 'Orders synced successfully');
    } catch {
      Alert.alert('Error', 'Failed to sync orders');
    }
  };

  // Show error if any
  if (error) {
    Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
  }

  const HeaderComponent = (
    <View className="mb-4">
      {/* Sync Button */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500">
          {counts.total} active orders
        </Text>
        <Button
          title={isSyncing ? 'Syncing...' : 'Sync'}
          variant="outline"
          size="sm"
          onPress={handleSync}
          loading={isSyncing}
        />
      </View>

      {/* Status Tabs */}
      <OrderStatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />
    </View>
  );

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <OrderList
        orders={filteredOrders}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListHeaderComponent={HeaderComponent}
      />
    </SafeAreaView>
  );
}
