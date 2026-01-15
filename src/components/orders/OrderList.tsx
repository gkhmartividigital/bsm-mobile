import React from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import { Order } from '@/types';
import { OrderCard } from './OrderCard';
import { EmptyState } from '@/components/ui';

interface OrderListProps {
  orders: Order[];
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
}

export function OrderList({
  orders = [],
  refreshing,
  onRefresh,
  ListHeaderComponent,
}: OrderListProps) {
  if (orders.length === 0 && !refreshing) {
    return (
      <EmptyState
        title="No orders"
        description="Pull down to refresh or sync from Firestore"
      />
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <OrderCard order={item} />}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0ea5e9']}
          tintColor="#0ea5e9"
        />
      }
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
    />
  );
}
