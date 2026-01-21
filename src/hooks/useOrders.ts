import { useEffect, useCallback } from 'react';
import { useOrdersStore } from '@/stores';
import { OrderStatus } from '@/constants';

/**
 * Hook to fetch and manage orders
 */
export function useOrders() {
  const {
    orders,
    isLoading,
    isRefreshing,
    isSyncing,
    error,
    lastSynced,
    fetchOrders,
    refreshOrders,
    syncFromFirestore,
    syncCarrierStatus,
    getOrdersByStatus,
    getOrderCounts,
    clearError,
  } = useOrdersStore();

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
    }, 300000);

    return () => clearInterval(interval);
  }, [refreshOrders]);

  const handleRefresh = useCallback(async () => {
    await refreshOrders();
  }, [refreshOrders]);

  const handleSync = useCallback(async () => {
    await syncFromFirestore();
  }, [syncFromFirestore]);

  return {
    orders,
    isLoading,
    isRefreshing,
    isSyncing,
    error,
    lastSynced,
    refresh: handleRefresh,
    sync: handleSync,
    syncCarrier: syncCarrierStatus,
    getByStatus: getOrdersByStatus,
    counts: getOrderCounts(),
    clearError,
  };
}

/**
 * Hook to manage a single order
 */
export function useOrder(orderId: number) {
  const {
    selectedOrder,
    isLoading,
    error,
    getOrder,
    updateOrderStatus,
    updateOrder,
    sendToWolt,
    sendToTrackings,
    markDelivered,
    setSelectedOrder,
    clearError,
  } = useOrdersStore();

  // Fetch order on mount
  useEffect(() => {
    if (orderId) {
      getOrder(orderId);
    }
    return () => {
      setSelectedOrder(null);
    };
  }, [orderId, getOrder, setSelectedOrder]);

  const handleStatusChange = useCallback(
    async (status: OrderStatus) => {
      return updateOrderStatus(orderId, status);
    },
    [orderId, updateOrderStatus]
  );

  const handleSendToWolt = useCallback(async () => {
    return sendToWolt(orderId);
  }, [orderId, sendToWolt]);

  const handleSendToTrackings = useCallback(async (senderKey?: 'maka' | 'nato') => {
    return sendToTrackings(orderId, senderKey);
  }, [orderId, sendToTrackings]);

  const handleMarkDelivered = useCallback(async () => {
    return markDelivered(orderId);
  }, [orderId, markDelivered]);

  return {
    order: selectedOrder,
    isLoading,
    error,
    updateStatus: handleStatusChange,
    update: (payload: Parameters<typeof updateOrder>[1]) => updateOrder(orderId, payload),
    sendToWolt: handleSendToWolt,
    sendToTrackings: handleSendToTrackings,
    markDelivered: handleMarkDelivered,
    clearError,
  };
}
