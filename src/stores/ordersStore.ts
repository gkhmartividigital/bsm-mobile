import { create } from 'zustand';
import { Order, OrderStatus, UpdateOrderPayload } from '@/types';
import { ordersApi } from '@/services/api';

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  isRefreshing: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSynced: Date | null;
}

interface OrdersActions {
  fetchOrders: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  getOrder: (id: number) => Promise<Order | null>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<boolean>;
  updateOrder: (id: number, payload: UpdateOrderPayload) => Promise<boolean>;
  sendToWolt: (id: number) => Promise<boolean>;
  markDelivered: (id: number) => Promise<boolean>;
  syncFromFirestore: () => Promise<void>;
  syncCarrierStatus: () => Promise<void>;
  setSelectedOrder: (order: Order | null) => void;
  clearError: () => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrderCounts: () => { pending: number; ready: number; shipped: number; total: number };
}

type OrdersStore = OrdersState & OrdersActions;

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  isRefreshing: false,
  isSyncing: false,
  error: null,
  lastSynced: null,
};

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  ...initialState,

  fetchOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await ordersApi.getOrders()
      console.log('API Response:', JSON.stringify(response, null, 2))
      set({
        orders: response?.orders ?? [],
        isLoading: false,
        lastSynced: new Date(),
      })
    } catch (error: unknown) {
      console.log('API Error:', error)
      const err = error as { message?: string; status?: number }
      set({ isLoading: false, error: err.message ?? 'Failed to fetch orders' })
    }
  },

  refreshOrders: async () => {
    set({ isRefreshing: true, error: null })
    try {
      const response = await ordersApi.getOrders()
      set({
        orders: response?.orders ?? [],
        isRefreshing: false,
        lastSynced: new Date(),
      })
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number }
      set({ isRefreshing: false, error: err.message ?? 'Failed to refresh orders' })
    }
  },

  getOrder: async (id: number) => {
    try {
      const order = await ordersApi.getOrder(id);
      set({ selectedOrder: order });
      return order;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch order';
      set({ error: errorMessage });
      return null;
    }
  },

  updateOrderStatus: async (id: number, status: OrderStatus) => {
    try {
      await ordersApi.updateOrder(id, { status });
      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, status } : order
        ),
        selectedOrder:
          state.selectedOrder?.id === id
            ? { ...state.selectedOrder, status }
            : state.selectedOrder,
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      set({ error: errorMessage });
      return false;
    }
  },

  updateOrder: async (id: number, payload: UpdateOrderPayload) => {
    try {
      const updatedOrder = await ordersApi.updateOrder(id, payload);
      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === id ? updatedOrder : order
        ),
        selectedOrder:
          state.selectedOrder?.id === id ? updatedOrder : state.selectedOrder,
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
      set({ error: errorMessage });
      return false;
    }
  },

  sendToWolt: async (id: number) => {
    try {
      const result = await ordersApi.sendToWolt(id);
      if (result.success) {
        // Refresh orders to get updated Wolt data
        await get().refreshOrders();
      }
      return result.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send to Wolt';
      set({ error: errorMessage });
      return false;
    }
  },

  markDelivered: async (id: number) => {
    try {
      await ordersApi.markDelivered(id);
      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, status: 'DELIVERED' as OrderStatus } : order
        ),
        selectedOrder:
          state.selectedOrder?.id === id
            ? { ...state.selectedOrder, status: 'DELIVERED' as OrderStatus }
            : state.selectedOrder,
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark delivered';
      set({ error: errorMessage });
      return false;
    }
  },

  syncFromFirestore: async () => {
    set({ isSyncing: true, error: null });
    try {
      await ordersApi.syncOrders();
      // Refresh orders after sync
      await get().fetchOrders();
      set({ isSyncing: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync';
      set({ isSyncing: false, error: errorMessage });
    }
  },

  syncCarrierStatus: async () => {
    try {
      await ordersApi.syncCarrierStatus();
      // Refresh orders to get updated carrier status
      await get().refreshOrders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync carrier status';
      set({ error: errorMessage });
    }
  },

  setSelectedOrder: (order: Order | null) => set({ selectedOrder: order }),

  clearError: () => set({ error: null }),

  getOrdersByStatus: (status: OrderStatus) => {
    const orders = get().orders ?? []
    return orders.filter(order => order.status === status)
  },

  getOrderCounts: () => {
    const orders = get().orders ?? []
    return {
      pending: orders.filter(o => o.status === 'PENDING').length,
      ready: orders.filter(o => o.status === 'READY').length,
      shipped: orders.filter(o => o.status === 'SHIPPED').length,
      total: orders.length,
    }
  },
}));
